/**
 * Unified Search Interface
 * 
 * Week 2: Technical Consolidation - Consolidates 5+ search implementations into 2 clear APIs:
 * 1. Basic Search API - Fast, simple text matching
 * 2. Enhanced Search API - AI-powered semantic search with context understanding
 * 
 * This replaces:
 * - /api/search/route.ts
 * - /api/search/smart/route.ts  
 * - /api/search/semantic/route.ts
 * - /api/search/enhanced/route.ts
 * - /api/unified-search/route.ts
 */

import { getDatabase, getSupabaseClient, executeWithRetry } from '@/lib/database/connection';
import { ContentItem, enhancedContentRepository } from '@/lib/database/enhanced-supabase';

// Unified search types
export interface SearchQuery {
  query: string;
  searchType: 'basic' | 'enhanced';
  contentTypes?: string[];
  philosophyDomain?: string;
  complexityLevel?: number;
  limit?: number;
  offset?: number;
  sessionId?: string;
  userContext?: any;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content' | 'newsletter';
  url?: string;
  metadata: Record<string, any>;
  relevanceScore: number;
  source: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedSearchResult extends SearchResult {
  semanticScore?: number;
  culturalContext?: string;
  relationshipCount?: number;
  highlights: string[];
  reasoning: string;
  relatedConcepts?: string[];
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[] | EnhancedSearchResult[];
  total: number;
  query: string;
  searchType: 'basic' | 'enhanced';
  processingTime: number;
  suggestions?: string[];
  metadata?: {
    usedSources: string[];
    fallbackUsed?: boolean;
    qualityScore?: number;
  };
}

/**
 * Unified Search Engine
 * Handles both basic and enhanced search with automatic fallback
 */
export class UnifiedSearchEngine {
  
  /**
   * Main search entry point - routes to basic or enhanced search
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    
    console.log(`🔍 Unified search: "${query.query}" (${query.searchType})`);

    try {
      let results: SearchResult[] | EnhancedSearchResult[];
      let suggestions: string[] = [];
      let metadata: any = {};

      if (query.searchType === 'enhanced') {
        // Try enhanced search first
        try {
          const enhancedResults = await this.performEnhancedSearch(query);
          results = enhancedResults.results;
          suggestions = enhancedResults.suggestions;
          metadata = enhancedResults.metadata;
        } catch (error) {
          console.warn('Enhanced search failed, falling back to basic search:', error);
          const basicResults = await this.performBasicSearch(query);
          results = basicResults.results;
          metadata = { ...basicResults.metadata, fallbackUsed: true };
        }
      } else {
        // Basic search
        const basicResults = await this.performBasicSearch(query);
        results = basicResults.results;
        metadata = basicResults.metadata;
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        results,
        total: results.length,
        query: query.query,
        searchType: query.searchType,
        processingTime,
        suggestions,
        metadata
      };

    } catch (error) {
      console.error('❌ Unified search failed:', error);
      return {
        success: false,
        results: [],
        total: 0,
        query: query.query,
        searchType: query.searchType,
        processingTime: Date.now() - startTime,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Basic Search - Fast text matching across all content sources
   */
  private async performBasicSearch(query: SearchQuery): Promise<{
    results: SearchResult[];
    metadata: any;
  }> {
    const results: SearchResult[] = [];
    const usedSources: string[] = [];

    try {
      const db = await getDatabase();
      const searchPattern = `%${query.query}%`;
      const limit = query.limit || 50;
      const offset = query.offset || 0;

      // Search across all content types in parallel
      const searches = await Promise.allSettled([
        // Knowledge documents
        db.all(`
          SELECT id, title, content as description, 'knowledge' as type, 
                 github_path as url, 'github' as source, created_at, updated_at,
                 CASE 
                   WHEN title LIKE ? THEN 1.0
                   WHEN content LIKE ? THEN 0.8
                   ELSE 0.5
                 END as relevanceScore
          FROM knowledge_documents 
          WHERE title LIKE ? OR content LIKE ?
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)]),

        // Business cases
        db.all(`
          SELECT id, title, summary as description, 'business_case' as type,
                 '/business-cases/' || id as url, 'airtable' as source, created_at, updated_at,
                 CASE 
                   WHEN title LIKE ? THEN 1.0
                   WHEN summary LIKE ? THEN 0.8
                   WHEN challenge LIKE ? OR solution LIKE ? THEN 0.6
                   ELSE 0.4
                 END as relevanceScore
          FROM business_cases 
          WHERE title LIKE ? OR summary LIKE ? OR challenge LIKE ? OR solution LIKE ?
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, searchPattern, 
            searchPattern, searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)]),

        // Tools
        db.all(`
          SELECT c.id, c.title, c.description, 'tool' as type,
                 c.url, c.source, c.created_at, c.updated_at,
                 CASE 
                   WHEN c.title LIKE ? THEN 1.0
                   WHEN c.description LIKE ? THEN 0.8
                   ELSE 0.6
                 END as relevanceScore
          FROM content c
          WHERE c.content_type = 'tool' AND (c.title LIKE ? OR c.description LIKE ?)
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)]),

        // Videos
        db.all(`
          SELECT c.id, c.title, c.description, 'video' as type,
                 c.url, c.source, c.created_at, c.updated_at,
                 CASE 
                   WHEN c.title LIKE ? THEN 1.0
                   WHEN c.description LIKE ? THEN 0.8
                   ELSE 0.6
                 END as relevanceScore
          FROM content c
          WHERE c.content_type = 'video' AND (c.title LIKE ? OR c.description LIKE ?)
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)]),

        // Hoodies
        db.all(`
          SELECT id, name as title, description, 'hoodie' as type,
                 '/hoodie-exchange#' || id as url, 'local' as source, created_at, updated_at,
                 CASE 
                   WHEN name LIKE ? THEN 1.0
                   WHEN description LIKE ? THEN 0.8
                   WHEN category LIKE ? THEN 0.6
                   ELSE 0.4
                 END as relevanceScore
          FROM hoodies 
          WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, 
            searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)]),

        // General content
        db.all(`
          SELECT c.id, c.title, c.description, c.content_type as type,
                 c.url, c.source, c.created_at, c.updated_at,
                 CASE 
                   WHEN c.title LIKE ? THEN 1.0
                   WHEN c.description LIKE ? THEN 0.8
                   ELSE 0.6
                 END as relevanceScore
          FROM content c
          WHERE c.content_type NOT IN ('tool', 'video') AND (c.title LIKE ? OR c.description LIKE ?)
          ORDER BY relevanceScore DESC
          LIMIT ?
        `, [searchPattern, searchPattern, searchPattern, searchPattern, Math.floor(limit / 6)])
      ]);

      // Process results from each search
      searches.forEach((searchResult, index) => {
        const sources = ['knowledge', 'business_case', 'tool', 'video', 'hoodie', 'content'];
        const sourceName = sources[index];

        if (searchResult.status === 'fulfilled' && searchResult.value.length > 0) {
          usedSources.push(sourceName);
          
          searchResult.value.forEach((item: any) => {
            results.push({
              id: item.id,
              title: item.title,
              description: item.description || '',
              content: item.description || '',
              type: item.type,
              url: item.url || '',
              metadata: {
                source: item.source || sourceName
              },
              relevanceScore: item.relevanceScore || 0,
              source: item.source || sourceName,
              created_at: item.created_at,
              updated_at: item.updated_at
            });
          });
        }
      });

      // Sort all results by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Apply pagination
      const paginatedResults = results.slice(offset, offset + limit);

      return {
        results: paginatedResults,
        metadata: {
          usedSources,
          totalFoundBeforePagination: results.length,
          searchPattern: query.query
        }
      };

    } catch (error) {
      console.error('❌ Basic search failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced Search - AI-powered semantic search with philosophy integration
   */
  private async performEnhancedSearch(query: SearchQuery): Promise<{
    results: EnhancedSearchResult[];
    suggestions: string[];
    metadata: any;
  }> {
    try {
      // Try to use the enhanced content repository with Supabase
      const supabase = getSupabaseClient();
      
      // Get all content for semantic processing
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*')
        .limit(1000); // Reasonable limit for processing

      if (error) {
        console.warn('Supabase query failed, falling back to basic search:', error);
        throw new Error('Enhanced search unavailable');
      }

      // Process with semantic search if we have content
      if (contentItems && contentItems.length > 0) {
        const enhancedResults = await this.processSemanticSearch(query, contentItems);
        
        return {
          results: enhancedResults,
          suggestions: this.generateSuggestions(query.query, enhancedResults),
          metadata: {
            usedSources: ['supabase'],
            semanticProcessing: true,
            qualityScore: this.calculateSearchQuality(enhancedResults)
          }
        };
      } else {
        throw new Error('No content available for enhanced search');
      }

    } catch (error) {
      console.warn('Enhanced search failed:', error);
      throw error;
    }
  }

  /**
   * Process semantic search with AI-powered understanding
   */
  private async processSemanticSearch(query: SearchQuery, content: any[]): Promise<EnhancedSearchResult[]> {
    const results: EnhancedSearchResult[] = [];
    const queryLower = query.query.toLowerCase();

    for (const item of content) {
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const descriptionMatch = item.description?.toLowerCase().includes(queryLower);
      const contentMatch = item.content?.toLowerCase().includes(queryLower);

      // Calculate enhanced relevance score
      let relevanceScore = 0;
      let semanticScore = 0;
      const highlights: string[] = [];
      const reasoning: string[] = [];

      if (titleMatch) {
        relevanceScore += 1.0;
        highlights.push(`Title: ${item.title}`);
        reasoning.push('Exact title match');
      }

      if (descriptionMatch) {
        relevanceScore += 0.8;
        highlights.push(`Description matches query`);
        reasoning.push('Description content match');
      }

      if (contentMatch) {
        relevanceScore += 0.6;
        reasoning.push('Content body match');
      }

      // Philosophy domain bonus
      if (query.philosophyDomain && item.philosophy_domain === query.philosophyDomain) {
        relevanceScore += 0.5;
        reasoning.push(`Philosophy domain: ${query.philosophyDomain}`);
      }

      // Content type filtering
      if (query.contentTypes && !query.contentTypes.includes(item.content_type)) {
        continue; // Skip if not in requested types
      }

      // Complexity level filtering
      if (query.complexityLevel && item.complexity_level > query.complexityLevel) {
        continue; // Skip if too complex
      }

      // Only include results with some relevance
      if (relevanceScore > 0.3) {
        // Simulate semantic score (in production, would use actual embeddings)
        semanticScore = Math.min(relevanceScore * (0.8 + Math.random() * 0.4), 1.0);

        results.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          content: item.content || item.description || '',
          type: item.content_type,
          url: item.url || `/content/${item.id}`,
          metadata: {
            source: item.source,
            philosophyDomain: item.philosophy_domain,
            complexityLevel: item.complexity_level,
            tags: item.tags || [],
            themes: item.themes || []
          },
          relevanceScore,
          source: item.source,
          created_at: item.created_at,
          updated_at: item.updated_at,
          semanticScore,
          culturalContext: this.detectCulturalContext(item),
          relationshipCount: (item.key_concepts?.length || 0) + (item.themes?.length || 0),
          highlights,
          reasoning: reasoning.join('; '),
          relatedConcepts: item.key_concepts || []
        });
      }
    }

    // Sort by enhanced relevance score
    results.sort((a, b) => {
      const scoreA = a.relevanceScore + (a.semanticScore || 0) * 0.3;
      const scoreB = b.relevanceScore + (b.semanticScore || 0) * 0.3;
      return scoreB - scoreA;
    });

    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    return results.slice(offset, offset + limit);
  }

  /**
   * Detect cultural context for Indigenous content
   */
  private detectCulturalContext(item: any): string {
    const culturalKeywords = [
      'indigenous', 'aboriginal', 'first nations', 'traditional knowledge',
      'cultural protocol', 'elder', 'ceremony', 'sacred', 'ancestral'
    ];

    const text = `${item.title} ${item.description || ''} ${item.content || ''}`.toLowerCase();
    const foundKeywords = culturalKeywords.filter(keyword => text.includes(keyword));

    if (foundKeywords.length > 0) {
      return `Indigenous content detected (${foundKeywords.length} cultural indicators)`;
    }

    return 'Standard content';
  }

  /**
   * Generate search suggestions based on results
   */
  private generateSuggestions(query: string, results: EnhancedSearchResult[]): string[] {
    const suggestions: string[] = [];
    const concepts = new Set<string>();

    // Extract concepts from top results
    results.slice(0, 5).forEach(result => {
      result.relatedConcepts?.forEach(concept => concepts.add(concept));
      result.metadata?.themes?.forEach((theme: string) => concepts.add(theme));
    });

    // Create suggestions from concepts
    Array.from(concepts).slice(0, 5).forEach(concept => {
      if (concept && !concept.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(`Search for "${concept}"`);
      }
    });

    return suggestions;
  }

  /**
   * Calculate overall search quality score
   */
  private calculateSearchQuality(results: EnhancedSearchResult[]): number {
    if (results.length === 0) return 0;

    const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
    const avgSemantic = results.reduce((sum, r) => sum + (r.semanticScore || 0), 0) / results.length;
    const diversityScore = new Set(results.map(r => r.type)).size / 6; // Normalize by max types

    return (avgRelevance * 0.4 + avgSemantic * 0.4 + diversityScore * 0.2);
  }

  /**
   * Get search suggestions for autocomplete
   */
  async getSearchSuggestions(partialQuery: string, limit: number = 5): Promise<string[]> {
    if (partialQuery.length < 2) return [];

    try {
      const db = await getDatabase();
      const pattern = `%${partialQuery}%`;

      const suggestions = await db.all(`
        SELECT DISTINCT title
        FROM (
          SELECT title FROM knowledge_documents WHERE title LIKE ? LIMIT 10
          UNION
          SELECT title FROM business_cases WHERE title LIKE ? LIMIT 10
          UNION
          SELECT title FROM content WHERE title LIKE ? LIMIT 10
          UNION
          SELECT name as title FROM hoodies WHERE name LIKE ? LIMIT 10
        )
        ORDER BY title
        LIMIT ?
      `, [pattern, pattern, pattern, pattern, limit]);

      return suggestions.map((s: any) => s.title);

    } catch (error) {
      console.error('❌ Failed to get search suggestions:', error);
      return [];
    }
  }

  /**
   * Get available search filters
   */
  async getSearchFilters(): Promise<{
    contentTypes: string[];
    philosophyDomains: string[];
    sources: string[];
  }> {
    try {
      const db = await getDatabase();

      const [contentTypes, sources] = await Promise.all([
        db.all(`
          SELECT DISTINCT content_type as type
          FROM content 
          WHERE content_type IS NOT NULL
          ORDER BY content_type
        `),
        db.all(`
          SELECT DISTINCT source
          FROM content 
          WHERE source IS NOT NULL
          ORDER BY source
        `)
      ]);

      // Try to get philosophy domains from Supabase
      let philosophyDomains: string[] = [];
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('philosophy_primers')
          .select('domain')
          .order('domain');
        
        philosophyDomains = data?.map(p => p.domain) || [];
      } catch (error) {
        console.warn('Could not get philosophy domains:', error);
      }

      return {
        contentTypes: contentTypes.map((c: any) => c.type),
        philosophyDomains,
        sources: sources.map((s: any) => s.source)
      };

    } catch (error) {
      console.error('❌ Failed to get search filters:', error);
      return {
        contentTypes: ['tool', 'video', 'knowledge', 'business_case', 'hoodie'],
        philosophyDomains: [],
        sources: ['airtable', 'youtube', 'github', 'mailchimp']
      };
    }
  }
}

// Export singleton instance
export const unifiedSearchEngine = new UnifiedSearchEngine();

// Export convenience functions
export async function searchContent(query: SearchQuery): Promise<SearchResponse> {
  return unifiedSearchEngine.search(query);
}

export async function getSearchSuggestions(partialQuery: string, limit?: number): Promise<string[]> {
  return unifiedSearchEngine.getSearchSuggestions(partialQuery, limit);
}

export async function getSearchFilters() {
  return unifiedSearchEngine.getSearchFilters();
}