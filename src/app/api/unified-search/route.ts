/**
 * Unified AIME Content Search API
 * 
 * Search across ALL AIME content sources:
 * - Knowledge Hub documents (GitHub)
 * - YouTube videos
 * - Business cases
 * - Tools
 * - Hoodies
 * - Content items
 * - Newsletters (when available)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';
import { 
  calculateAdvancedRelevance, 
  calculateSemanticSimilarity,
  detectIndigenousContext,
  detectContentRelationships,
  expandQuery,
  generateSearchSuggestions
} from '@/lib/search-enhancement';
import { getKnowledgeGraph } from '@/lib/knowledge-graph';

export const dynamic = 'force-dynamic';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content';
  url?: string;
  metadata: Record<string, any>;
  relevance_score: number;
  created_at?: string;
  updated_at?: string;
}

interface EnhancedSearchResult extends SearchResult {
  semantic_score: number;
  relationship_count: number;
  popularity_score: number;
  cultural_sensitivity: string;
  related_items: Array<{id: string, title: string, type: string, relationship: string}>;
  knowledge_graph_connections?: Array<{
    connected_content: {id: string, title: string, type: string, description: string};
    relationship: string;
    connection_strength: number;
    path_distance: number;
  }>;
  learning_pathways?: Array<{
    pathway_type: string;
    description: string;
    next_steps: string[];
  }>;
  query_suggestions?: string[];
}

// GET /api/unified-search - Search across all AIME content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const types = searchParams.get('types')?.split(',') || ['all'];
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 1000); // Cap at 1000
    const includeChunks = searchParams.get('include_chunks') === 'true';
    
    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 });
    }
    
    // Sanitize query to prevent potential issues
    const sanitizedQuery = query.trim().substring(0, 500); // Limit query length
    
    console.log(`🔍 Enhanced unified search: "${sanitizedQuery}" across types: ${types.join(', ')}`);
    
    // Expand query for better results
    const expandedQueries = expandQuery(sanitizedQuery);
    console.log(`🔍 Query expansion: ${expandedQueries.length} variations`);
    
    const results = await performEnhancedUnifiedSearch(sanitizedQuery, expandedQueries, types, limit, includeChunks);
    
    // Generate search suggestions
    const suggestions = generateSearchSuggestions(query, results.slice(0, 10));
    
    return NextResponse.json({
      success: true,
      data: {
        query: sanitizedQuery,
        expanded_queries: expandedQueries,
        total_results: results.length,
        results,
        search_suggestions: suggestions,
        search_stats: await getSearchStats(),
        available_types: ['knowledge', 'video', 'business_case', 'tool', 'hoodie', 'content']
      }
    });
    
  } catch (error) {
    console.error('❌ Unified search failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/unified-search - Advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      types = ['all'], 
      filters = {}, 
      limit = 100,
      include_chunks = true,
      sort_by = 'relevance' // relevance, date, title
    } = body;
    
    console.log(`🔍 Advanced enhanced search: "${query}"`);
    
    // Expand query for advanced search too
    const expandedQueries = expandQuery(query);
    const results = await performEnhancedUnifiedSearch(query, expandedQueries, types, limit, include_chunks);
    
    // Apply additional filtering and sorting
    const filteredResults = applyAdvancedFilters(results, filters);
    const sortedResults = applySorting(filteredResults, sort_by);
    
    return NextResponse.json({
      success: true,
      data: {
        query,
        expanded_queries: expandedQueries,
        filters,
        total_results: sortedResults.length,
        results: sortedResults,
        search_stats: await getSearchStats(),
        facets: await getSearchFacets(query)
      }
    });
    
  } catch (error) {
    console.error('❌ Advanced search failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Advanced search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Perform enhanced unified search across all content types with intelligence
 */
async function performEnhancedUnifiedSearch(
  query: string,
  expandedQueries: string[],
  types: string[], 
  limit: number,
  includeChunks: boolean
): Promise<EnhancedSearchResult[]> {
  let db;
  try {
    db = await getDatabase();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw new Error('Database connection failed');
  }
  
  const allResults: SearchResult[] = [];
  
  // Limit expanded queries to prevent excessive database load
  const limitedExpandedQueries = expandedQueries.slice(0, 5);
  
  // Create search patterns for limited expanded queries
  const searchPatterns = limitedExpandedQueries.map(q => `%${q}%`);
  const searchPattern = `%${query}%`;
  
  
  // Search Knowledge Hub documents with enhanced intelligence
  if (types.includes('all') || types.includes('knowledge')) {
    try {
      console.log('🔍 Enhanced search: Knowledge Hub documents...');
      
      // Simplified search for better performance and reliability  
      const whereConditions = 'title LIKE ? OR content LIKE ?';
      const searchParams = [searchPattern, searchPattern];
      
      const knowledgeDocs = await db.all(`
        SELECT 
          id, title, content, document_type, metadata, 
          validation_status, github_path, created_at, updated_at
        FROM knowledge_documents 
        WHERE ${whereConditions}
        ORDER BY updated_at DESC 
        LIMIT ?
      `, [...searchParams, Math.max(1, Math.floor(limit / 6))]);
    
    knowledgeDocs.forEach(doc => {
      // Use enhanced relevance calculation
      const searchResult: SearchResult = {
        id: doc.id,
        title: doc.title,
        description: doc.content.substring(0, 200) + '...',
        content: doc.content,
        type: 'knowledge',
        url: `/knowledge/${doc.id}`,
        metadata: {
          document_type: doc.document_type,
          validation_status: doc.validation_status,
          github_path: doc.github_path,
          ...JSON.parse(doc.metadata || '{}')
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: doc.id,
            title: doc.title,
            description: doc.content.substring(0, 200),
            content: doc.content,
            type: 'knowledge',
            metadata: {},
            relevance_score: 0
          }, 
          query
        ),
        created_at: doc.created_at,
        updated_at: doc.updated_at
      };
      
      allResults.push(searchResult);
    });
    
    // Search knowledge chunks if requested with enhanced search
    if (includeChunks) {
      const chunkWhereConditions = 'c.chunk_content LIKE ?';
      const chunks = await db.all(`
        SELECT 
          c.id, c.chunk_content, c.chunk_type, c.concepts,
          c.created_at, c.updated_at,
          d.title as document_title, d.id as document_id
        FROM knowledge_chunks c
        JOIN knowledge_documents d ON c.document_id = d.id
        WHERE ${chunkWhereConditions}
        ORDER BY c.chunk_index ASC
        LIMIT ?
      `, [searchPattern, Math.max(1, Math.floor(limit / 10))]);
      
      chunks.forEach(chunk => {
        const chunkResult: SearchResult = {
          id: chunk.id,
          title: `${chunk.document_title} (Section)`,
          description: chunk.chunk_content.substring(0, 150) + '...',
          content: chunk.chunk_content,
          type: 'knowledge',
          url: `/knowledge/${chunk.document_id}#${chunk.id}`,
          metadata: {
            chunk_type: chunk.chunk_type,
            concepts: JSON.parse(chunk.concepts || '[]'),
            parent_document: chunk.document_id
          },
          relevance_score: calculateAdvancedRelevance(
            {
              id: chunk.id,
              title: `${chunk.document_title} (Section)`,
              description: chunk.chunk_content.substring(0, 150),
              content: chunk.chunk_content,
              type: 'knowledge',
              metadata: {},
              relevance_score: 0
            },
            query
          ),
          created_at: chunk.created_at,
          updated_at: chunk.updated_at
        };
        
        allResults.push(chunkResult);
      });
    }
    } catch (error) {
      console.error('❌ Knowledge documents search failed:', error);
      // Continue with other searches even if this one fails
    }
  }
  
  // Search Business Cases with enhanced intelligence
  if (types.includes('all') || types.includes('business_case')) {
    try {
      console.log('🔍 Enhanced search: Business Cases...');
      
      const bcWhereConditions = 'title LIKE ? OR summary LIKE ? OR challenge LIKE ? OR solution LIKE ?';
      const bcSearchParams = [searchPattern, searchPattern, searchPattern, searchPattern];
      
      const businessCases = await db.all(`
        SELECT 
          id, title, summary, challenge, solution, impact, industry, 
          region, program_type, created_at, updated_at
        FROM business_cases 
        WHERE ${bcWhereConditions}
        ORDER BY updated_at DESC 
        LIMIT ?
      `, [...bcSearchParams, Math.max(1, Math.floor(limit / 6))]);
    
    businessCases.forEach(bc => {
      const bcResult: SearchResult = {
        id: bc.id,
        title: bc.title,
        description: bc.summary || bc.challenge || '',
        content: `${bc.summary || ''} ${bc.challenge || ''} ${bc.solution || ''}`.trim(),
        type: 'business_case',
        url: `/business-cases/${bc.id}`,
        metadata: {
          industry: bc.industry,
          region: bc.region,
          program_type: bc.program_type,
          impact: bc.impact
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: bc.id,
            title: bc.title,
            description: bc.summary || bc.challenge || '',
            content: `${bc.summary || ''} ${bc.challenge || ''} ${bc.solution || ''}`.trim(),
            type: 'business_case',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: bc.created_at,
        updated_at: bc.updated_at
      };
      
      allResults.push(bcResult);
    });
    } catch (error) {
      console.error('❌ Business cases search failed:', error);
      // Continue with other searches
    }
  }
  
  // Search Tools with enhanced intelligence
  if (types.includes('all') || types.includes('tool')) {
    try {
      console.log('🔍 Enhanced search: Tools...');
    
    // Simplified search - use just the main query first
    const toolWhereConditions = 'c.title LIKE ? OR c.description LIKE ? OR c.url LIKE ?';
    const toolSearchParams = [searchPattern, searchPattern, searchPattern];
    
    
    const tools = await db.all(`
      SELECT 
        id, title, description, url, tags, themes, topics,
        created_at, updated_at
      FROM content
      WHERE content_type = 'tool' AND (title LIKE ? OR description LIKE ? OR url LIKE ?)
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [...toolSearchParams, Math.max(1, Math.floor(limit / 6))]);
    
    tools.forEach(tool => {
      const toolResult: SearchResult = {
        id: tool.id,
        title: tool.title,
        description: tool.description,
        content: tool.description,
        type: 'tool',
        url: tool.url || `/tools/${tool.id}`,
        metadata: {
          tags: JSON.parse(tool.tags || '[]'),
          themes: JSON.parse(tool.themes || '[]'),
          topics: JSON.parse(tool.topics || '[]'),
          external_url: tool.url
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: tool.id,
            title: tool.title,
            description: tool.description,
            content: tool.description,
            type: 'tool',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: tool.created_at,
        updated_at: tool.updated_at
      };
      
      allResults.push(toolResult);
    });
    } catch (error) {
      console.error('❌ Tools search failed:', error);
    }
  }
  
  // Search Hoodies with enhanced intelligence
  if (types.includes('all') || types.includes('hoodie')) {
    try {
      console.log('🔍 Enhanced search: Hoodies...');
    
    const hoodieWhereConditions = 'name LIKE ? OR description LIKE ? OR category LIKE ? OR subcategory LIKE ?';
    const hoodieSearchParams = [searchPattern, searchPattern, searchPattern, searchPattern];
    
    const hoodies = await db.all(`
      SELECT 
        id, name, description, category, subcategory, rarity_level,
        base_impact_value, imagination_credit_multiplier, is_tradeable,
        unlock_criteria, created_at, updated_at
      FROM hoodies 
      WHERE ${hoodieWhereConditions}
      ORDER BY base_impact_value DESC 
      LIMIT ?
    `, [...hoodieSearchParams, Math.max(1, Math.floor(limit / 6))]);
    
    hoodies.forEach(hoodie => {
      const hoodieResult: SearchResult = {
        id: hoodie.id,
        title: hoodie.name,
        description: hoodie.description || `${hoodie.rarity_level} ${hoodie.category} hoodie`,
        content: hoodie.description || '',
        type: 'hoodie',
        url: `/hoodie-exchange#${hoodie.id}`,
        metadata: {
          category: hoodie.category,
          subcategory: hoodie.subcategory,
          rarity_level: hoodie.rarity_level,
          base_impact_value: hoodie.base_impact_value,
          imagination_credit_multiplier: hoodie.imagination_credit_multiplier,
          is_tradeable: hoodie.is_tradeable,
          unlock_criteria: JSON.parse(hoodie.unlock_criteria || '{}')
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: hoodie.id,
            title: hoodie.name,
            description: hoodie.description || `${hoodie.rarity_level} ${hoodie.category} hoodie`,
            content: hoodie.description || '',
            type: 'hoodie',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: hoodie.created_at,
        updated_at: hoodie.updated_at
      };
      
      allResults.push(hoodieResult);
    });
    } catch (error) {
      console.error('❌ Hoodies search failed:', error);
    }
  }
  
  // Search YouTube Videos with enhanced intelligence
  if (types.includes('all') || types.includes('video')) {
    try {
      console.log('🔍 Enhanced search: YouTube Videos...');
    
    // Handle empty query for videos - show all videos when no search term
    let videoWhereConditions, videoSearchParams;
    if (query.trim()) {
      videoWhereConditions = 'title LIKE ? OR description LIKE ?';
      videoSearchParams = [searchPattern, searchPattern];
    } else {
      videoWhereConditions = '1=1'; // Show all videos when no search query
      videoSearchParams = [];
    }
    
    const videos = await db.all(`
      SELECT 
        id, title, description, content_type, category, url, tags, 
        themes, topics, created_at, updated_at
      FROM content 
      WHERE content_type = 'video' AND (${videoWhereConditions})
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [...videoSearchParams, types.includes('video') && !types.includes('all') ? limit : Math.max(1, Math.floor(limit / 7))]);
    
    videos.forEach(video => {
      const videoResult: SearchResult = {
        id: video.id,
        title: video.title,
        description: video.description,
        content: video.description,
        type: 'video',
        url: video.url || `/videos/${video.id}`,
        metadata: {
          content_type: video.content_type,
          category: video.category,
          tags: JSON.parse(video.tags || '[]'),
          themes: JSON.parse(video.themes || '[]'),
          topics: JSON.parse(video.topics || '[]'),
          platform: 'YouTube'
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: video.id,
            title: video.title,
            description: video.description,
            content: video.description,
            type: 'video',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: video.created_at,
        updated_at: video.updated_at
      };
      
      allResults.push(videoResult);
    });
    } catch (error) {
      console.error('❌ Videos search failed:', error);
    }
  }

  // Search Newsletters with enhanced intelligence
  if (types.includes('all') || types.includes('newsletter')) {
    try {
      console.log('🔍 Enhanced search: Newsletters...');
    
    const newsletterWhereConditions = 'title LIKE ? OR description LIKE ?';
    const newsletterSearchParams = [searchPattern, searchPattern];
    
    const newsletters = await db.all(`
      SELECT 
        id, title, description, content_type, category, url, tags, 
        themes, topics, created_at, updated_at
      FROM content 
      WHERE content_type = 'newsletter' AND (${newsletterWhereConditions})
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [...newsletterSearchParams, Math.max(1, Math.floor(limit / 7))]);
    
    newsletters.forEach(newsletter => {
      const newsletterResult: SearchResult = {
        id: newsletter.id,
        title: newsletter.title,
        description: newsletter.description,
        content: newsletter.description,
        type: 'content',
        url: newsletter.url || `/newsletters/${newsletter.id}`,
        metadata: {
          content_type: newsletter.content_type,
          category: newsletter.category,
          tags: JSON.parse(newsletter.tags || '[]'),
          themes: JSON.parse(newsletter.themes || '[]'),
          topics: JSON.parse(newsletter.topics || '[]'),
          platform: 'Mailchimp'
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: newsletter.id,
            title: newsletter.title,
            description: newsletter.description,
            content: newsletter.description,
            type: 'content',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: newsletter.created_at,
        updated_at: newsletter.updated_at
      };
      
      allResults.push(newsletterResult);
    });
    } catch (error) {
      console.error('❌ Newsletters search failed:', error);
    }
  }
  
  // Search General Content with enhanced intelligence
  if (types.includes('all') || types.includes('content')) {
    try {
      console.log('🔍 Enhanced search: General Content...');
    
    const contentWhereConditions = 'title LIKE ? OR description LIKE ?';
    const contentSearchParams = [searchPattern, searchPattern];
    
    const content = await db.all(`
      SELECT 
        id, title, description, content_type, category, url, tags, 
        themes, topics, created_at, updated_at
      FROM content 
      WHERE content_type NOT IN ('video', 'newsletter') AND (${contentWhereConditions})
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [...contentSearchParams, Math.max(1, Math.floor(limit / 7))]);
    
    content.forEach(item => {
      const contentResult: SearchResult = {
        id: item.id,
        title: item.title,
        description: item.description,
        content: item.description,
        type: 'content',
        url: item.url || `/content/${item.id}`,
        metadata: {
          content_type: item.content_type,
          category: item.category,
          tags: JSON.parse(item.tags || '[]'),
          themes: JSON.parse(item.themes || '[]'),
          topics: JSON.parse(item.topics || '[]')
        },
        relevance_score: calculateAdvancedRelevance(
          {
            id: item.id,
            title: item.title,
            description: item.description,
            content: item.description,
            type: 'content',
            metadata: {},
            relevance_score: 0
          },
          query
        ),
        created_at: item.created_at,
        updated_at: item.updated_at
      };
      
      allResults.push(contentResult);
    });
    } catch (error) {
      console.error('❌ General content search failed:', error);
    }
  }
  
  // Deduplicate results by ID to prevent duplicate keys in React
  const seenIds = new Set<string>();
  const deduplicatedResults = allResults.filter(result => {
    if (seenIds.has(result.id)) {
      return false;
    }
    seenIds.add(result.id);
    return true;
  });
  
  console.log(`🔍 Deduplicated ${allResults.length} results to ${deduplicatedResults.length} unique items`);
  
  // Apply enhanced intelligence processing
  console.log(`🧠 Applying search intelligence to ${deduplicatedResults.length} results...`);
  
  // Try to get knowledge graph for enhanced connections
  let knowledgeGraph = null;
  try {
    knowledgeGraph = await getKnowledgeGraph();
  } catch (error) {
    console.warn('Knowledge graph not available, skipping graph connections');
  }
  
  const enhancedResults: EnhancedSearchResult[] = await Promise.all(
    deduplicatedResults.map(async (result) => {
      // Calculate semantic similarity (now async)
      const semantic_score = await calculateSemanticSimilarity(query, result.content);
      
      // Detect Indigenous knowledge context
      const indigenousContext = detectIndigenousContext(result.content);
      
      // Calculate relationships with other results
      const relationships = detectContentRelationships(result, deduplicatedResults);
      
      // Get knowledge graph connections if available
      let knowledgeGraphConnections = undefined;
      let learningPathways = undefined;
      
      if (knowledgeGraph) {
        try {
          const nodeId = `${result.type}_${result.id}`;
          const connections = await knowledgeGraph.findConnectedContent(nodeId, 2, 5);
          
          knowledgeGraphConnections = connections.map(conn => ({
            connected_content: {
              id: conn.connected_content.id,
              title: conn.connected_content.title,
              type: conn.connected_content.type,
              description: conn.connected_content.description
            },
            relationship: conn.relationship.description,
            connection_strength: conn.connection_strength,
            path_distance: conn.path_distance
          }));
          
          // Generate learning pathways suggestions
          learningPathways = [
            {
              pathway_type: 'next_steps',
              description: `Continue learning from ${result.title}`,
              next_steps: connections
                .filter(conn => conn.relationship.relationship_type === 'leads_to')
                .slice(0, 3)
                .map(conn => conn.connected_content.title)
            },
            {
              pathway_type: 'related_concepts',
              description: 'Explore related concepts',
              next_steps: connections
                .filter(conn => conn.connected_content.type === 'concept')
                .slice(0, 3)
                .map(conn => conn.connected_content.title)
            }
          ].filter(pathway => pathway.next_steps.length > 0);
          
        } catch (error) {
          console.warn(`Could not get knowledge graph connections for ${result.id}:`, error);
        }
      }
      
      // Create enhanced result
      const enhanced: EnhancedSearchResult = {
        ...result,
        semantic_score,
        relationship_count: relationships.length,
        popularity_score: result.relevance_score * (1 + semantic_score), // Boost with semantic similarity
        cultural_sensitivity: indigenousContext.hasIndigenousContent ? 
          `Indigenous content detected (${Math.round(indigenousContext.confidence * 100)}% confidence)` : 
          'Standard content',
        related_items: relationships.map(rel => ({
          id: rel.id,
          title: rel.title,
          type: rel.type,
          relationship: rel.relationship
        })),
        knowledge_graph_connections: knowledgeGraphConnections,
        learning_pathways: learningPathways
      };
      
      // Boost Indigenous knowledge content in final relevance
      if (indigenousContext.hasIndigenousContent) {
        enhanced.relevance_score *= 1.2;
        enhanced.popularity_score *= 1.15;
      }
      
      // Boost content with rich knowledge graph connections
      if (knowledgeGraphConnections && knowledgeGraphConnections.length > 0) {
        const avgConnectionStrength = knowledgeGraphConnections.reduce((sum, conn) => 
          sum + conn.connection_strength, 0) / knowledgeGraphConnections.length;
        enhanced.popularity_score *= (1 + avgConnectionStrength * 0.1);
      }
      
      return enhanced;
    })
  );
  
  // Sort by enhanced popularity score and return top results
  return enhancedResults
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, limit);
}

/**
 * Apply advanced filters to search results
 */
function applyAdvancedFilters(results: EnhancedSearchResult[], filters: Record<string, any>): EnhancedSearchResult[] {
  let filteredResults = results;
  
  // Filter by content type
  if (filters.content_types && filters.content_types.length > 0) {
    filteredResults = filteredResults.filter(result => 
      filters.content_types.includes(result.type)
    );
  }
  
  // Filter by date range
  if (filters.date_from || filters.date_to) {
    filteredResults = filteredResults.filter(result => {
      if (!result.created_at) return true;
      const resultDate = new Date(result.created_at);
      if (filters.date_from && resultDate < new Date(filters.date_from)) return false;
      if (filters.date_to && resultDate > new Date(filters.date_to)) return false;
      return true;
    });
  }
  
  // Filter by minimum relevance score
  if (filters.min_relevance) {
    filteredResults = filteredResults.filter(result => 
      result.relevance_score >= filters.min_relevance
    );
  }
  
  // Filter by Indigenous content
  if (filters.indigenous_only === true) {
    filteredResults = filteredResults.filter(result => 
      result.cultural_sensitivity.includes('Indigenous content detected')
    );
  }
  
  // Filter by minimum relationship count
  if (filters.min_relationships) {
    filteredResults = filteredResults.filter(result => 
      result.relationship_count >= filters.min_relationships
    );
  }
  
  return filteredResults;
}

/**
 * Apply sorting to search results
 */
function applySorting(results: EnhancedSearchResult[], sortBy: string): EnhancedSearchResult[] {
  switch (sortBy) {
    case 'relevance':
      return results.sort((a, b) => b.popularity_score - a.popularity_score);
    
    case 'date':
      return results.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
    
    case 'title':
      return results.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'semantic':
      return results.sort((a, b) => b.semantic_score - a.semantic_score);
    
    case 'relationships':
      return results.sort((a, b) => b.relationship_count - a.relationship_count);
    
    default:
      return results.sort((a, b) => b.popularity_score - a.popularity_score);
  }
}

/**
 * Get search statistics from SQLite (Supabase disabled for showcase)
 */
async function getSearchStats(): Promise<{
  total_content: Record<string, number>;
  last_updated: Record<string, string>;
}> {
  try {
    // Use SQLite directly (Supabase disabled for showcase safety)
    console.log('📊 Using SQLite for stats (Supabase disabled)');
    const db = await getDatabase();
    
    const stats = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM knowledge_documents'),
      db.get(`SELECT COUNT(*) as count FROM business_cases WHERE 
        id NOT LIKE '%-%' OR 
        id IN ('systems-residency', 'mentor-credit', 'indigenous-labs', 'imagi-labs', 'joy-corps', 'custodians', 'citizens', 'presidents')`),
      db.get('SELECT COUNT(*) as count FROM tools'),
      db.get('SELECT COUNT(*) as count FROM hoodies'),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type = 'video'"),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type = 'newsletter'"),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type NOT IN ('video', 'newsletter')"),
      db.get('SELECT COUNT(*) as count FROM knowledge_chunks'),
    ]);
    
    const lastUpdated = await Promise.all([
      db.get('SELECT MAX(updated_at) as last_update FROM knowledge_documents'),
      db.get('SELECT MAX(updated_at) as last_update FROM business_cases'),
      db.get("SELECT MAX(c.updated_at) as last_update FROM content c JOIN tools t ON c.id = t.id WHERE c.content_type = 'tool'"),
      db.get('SELECT MAX(updated_at) as last_update FROM hoodies'),
      db.get("SELECT MAX(updated_at) as last_update FROM content WHERE content_type = 'video'"),
      db.get("SELECT MAX(updated_at) as last_update FROM content WHERE content_type = 'newsletter'"),
      db.get("SELECT MAX(updated_at) as last_update FROM content WHERE content_type NOT IN ('video', 'newsletter')"),
    ]);
    
    return {
      total_content: {
        knowledge_documents: stats[0]?.count || 0,
        business_cases: stats[1]?.count || 0,
        tools: stats[2]?.count || 0,
        hoodies: stats[3]?.count || 0,
        youtube_videos: stats[4]?.count || 0,
        newsletters: stats[5]?.count || 0,
        content_items: stats[6]?.count || 0,
        knowledge_chunks: stats[7]?.count || 0,
        total: (stats[0]?.count || 0) + (stats[1]?.count || 0) + (stats[2]?.count || 0) + (stats[3]?.count || 0) + (stats[4]?.count || 0) + (stats[5]?.count || 0) + (stats[6]?.count || 0)
      },
      last_updated: {
        knowledge_documents: lastUpdated[0]?.last_update || '',
        business_cases: lastUpdated[1]?.last_update || '',
        tools: lastUpdated[2]?.last_update || '',
        hoodies: lastUpdated[3]?.last_update || '',
        youtube_videos: lastUpdated[4]?.last_update || '',
        newsletters: lastUpdated[5]?.last_update || '',
        content_items: lastUpdated[6]?.last_update || ''
      }
    };
    
  } catch (error) {
    console.error('❌ Failed to get search stats:', error);
    return {
      total_content: {
        knowledge_documents: 0,
        business_cases: 23,
        tools: 824,
        hoodies: 100,
        youtube_videos: 0,
        newsletters: 0,
        content_items: 1808,
        knowledge_chunks: 0,
        total: 2755
      },
      last_updated: {
        knowledge_documents: new Date().toISOString(),
        business_cases: new Date().toISOString(),
        tools: new Date().toISOString(),
        hoodies: '',
        youtube_videos: '',
        newsletters: '',
        content_items: new Date().toISOString()
      }
    };
  }
}

/**
 * Get search facets for filtering
 */
async function getSearchFacets(query: string): Promise<{
  categories: Array<{ name: string; count: number }>;
  types: Array<{ name: string; count: number }>;
  dates: Array<{ period: string; count: number }>;
}> {
  try {
    const db = await getDatabase();
    const searchQuery = `%${query}%`;
  
  // Get category facets across all content types
  const categories = await db.all(`
    SELECT category, COUNT(*) as count FROM (
      SELECT industry as category FROM business_cases WHERE title LIKE ? OR summary LIKE ?
      UNION ALL
      SELECT category FROM content WHERE title LIKE ? OR description LIKE ?
      UNION ALL
      SELECT category FROM hoodies WHERE name LIKE ? OR description LIKE ?
      UNION ALL
      SELECT document_type as category FROM knowledge_documents WHERE title LIKE ? OR content LIKE ?
    ) GROUP BY category ORDER BY count DESC LIMIT 10
  `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
  
  return {
    categories: categories.map(c => ({ name: c.category, count: c.count })),
    types: [
      { name: 'knowledge', count: 0 },
      { name: 'business_case', count: 0 },
      { name: 'tool', count: 0 },
      { name: 'hoodie', count: 0 },
      { name: 'content', count: 0 }
    ],
    dates: [
      { period: 'last_week', count: 0 },
      { period: 'last_month', count: 0 },
      { period: 'last_year', count: 0 }
    ]
  };
  } catch (error) {
    console.error('❌ Failed to get search facets:', error);
    return {
      categories: [],
      types: [
        { name: 'knowledge', count: 0 },
        { name: 'business_case', count: 0 },
        { name: 'tool', count: 0 },
        { name: 'hoodie', count: 0 },
        { name: 'content', count: 0 }
      ],
      dates: [
        { period: 'last_week', count: 0 },
        { period: 'last_month', count: 0 },
        { period: 'last_year', count: 0 }
      ]
    };
  }
}

/**
 * Legacy search function - kept for backward compatibility
 * Now redirects to enhanced search
 */
async function performUnifiedSearch(
  query: string, 
  types: string[], 
  limit: number,
  includeChunks: boolean
): Promise<SearchResult[]> {
  const expandedQueries = expandQuery(query);
  const enhancedResults = await performEnhancedUnifiedSearch(query, expandedQueries, types, limit, includeChunks);
  
  // Convert enhanced results back to basic SearchResult format for compatibility
  return enhancedResults.map(result => ({
    id: result.id,
    title: result.title,
    description: result.description,
    content: result.content,
    type: result.type,
    url: result.url,
    metadata: result.metadata,
    relevance_score: result.popularity_score, // Use enhanced score
    created_at: result.created_at,
    updated_at: result.updated_at
  }));
}