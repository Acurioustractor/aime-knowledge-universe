/**
 * Search Interface Layer
 * 
 * Unified interface for all search operations
 */

import { semanticSearchEngine, SearchQuery, SearchResponse } from './semantic-search';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface UnifiedSearchOptions {
  query: string;
  searchType?: 'semantic' | 'keyword' | 'philosophy' | 'relationship';
  philosophyDomain?: string;
  contentTypes?: string[];
  complexityLevel?: number;
  sessionId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  philosophyDomains: string[];
  contentTypes: string[];
  complexityLevels: number[];
  authors: string[];
  themes: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Unified Search Interface
 * Coordinates between different search engines and data sources
 */
export class UnifiedSearchInterface {
  /**
   * Perform unified search across all content with contextual ranking
   */
  async search(options: UnifiedSearchOptions): Promise<SearchResponse> {
    console.log(`🔍 Unified search: "${options.query}" (${options.searchType || 'semantic'})`);

    // Get user context if session provided
    let userContext;
    if (options.sessionId) {
      userContext = await enhancedContentRepository.getOrCreateUserSession(options.sessionId);
    }

    // Get all content for search
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      philosophyDomain: options.philosophyDomain,
      complexityLevel: options.complexityLevel,
      limit: 1000 // Get all content for comprehensive search
    });

    // Build search query
    const searchQuery: SearchQuery = {
      query: options.query,
      searchType: this.mapSearchType(options.searchType || 'semantic'),
      philosophyDomain: options.philosophyDomain,
      contentTypes: options.contentTypes,
      complexityLevel: options.complexityLevel,
      userContext,
      useEmbeddings: true, // Enable embeddings by default
      similarityThreshold: 0.7
    };

    // Perform semantic search
    const searchResponse = await semanticSearchEngine.search(searchQuery, contentResult.items);

    // Apply contextual ranking based on user context and search history
    const rankedResults = await this.applyContextualRanking(
      searchResponse.results,
      userContext,
      options
    );

    // Apply pagination
    const startIndex = options.offset || 0;
    const endIndex = startIndex + (options.limit || 20);
    const paginatedResults = rankedResults.slice(startIndex, endIndex);

    // Track search analytics
    if (options.sessionId) {
      await this.trackSearchAnalytics({
        sessionId: options.sessionId,
        query: options.query,
        searchType: options.searchType || 'semantic',
        resultsCount: rankedResults.length,
        philosophyDomain: options.philosophyDomain,
        clickedResults: [], // Will be updated when user clicks
        satisfactionScore: null // Will be updated based on user feedback
      });
    }

    return {
      ...searchResponse,
      results: paginatedResults,
      total: rankedResults.length
    };
  }

  /**
   * Apply contextual ranking to search results
   */
  private async applyContextualRanking(
    results: any[],
    userContext: any,
    options: UnifiedSearchOptions
  ): Promise<any[]> {
    if (!userContext || results.length === 0) {
      return results;
    }

    // Get user's recent interactions for context
    const recentInteractions = await this.getUserRecentInteractions(userContext.session_id);
    
    // Apply contextual scoring
    const contextualResults = results.map(result => {
      let contextualScore = result.relevanceScore;
      const contextFactors = [];

      // User interest alignment
      if (userContext.interests.length > 0) {
        const interestMatch = this.calculateInterestAlignment(result.content, userContext.interests);
        contextualScore += interestMatch * 0.2;
        if (interestMatch > 0.5) {
          contextFactors.push(`Interest match: ${Math.round(interestMatch * 100)}%`);
        }
      }

      // Experience level matching
      if (userContext.experience_level && result.content.complexity_level) {
        const experienceBonus = this.calculateExperienceBonus(
          result.content.complexity_level,
          userContext.experience_level,
          userContext.preferred_complexity
        );
        contextualScore += experienceBonus;
        if (experienceBonus > 0) {
          contextFactors.push(`Experience match`);
        }
      }

      // Recent interaction patterns
      const interactionBonus = this.calculateInteractionBonus(result.content, recentInteractions);
      contextualScore += interactionBonus;
      if (interactionBonus > 0) {
        contextFactors.push(`Similar to recent views`);
      }

      // Current focus domain alignment
      if (userContext.current_focus_domain && result.content.philosophy_domain === userContext.current_focus_domain) {
        contextualScore += 0.15;
        contextFactors.push('Focus domain match');
      }

      // Learning pathway progression
      const progressionBonus = this.calculateProgressionBonus(result.content, userContext, recentInteractions);
      contextualScore += progressionBonus;
      if (progressionBonus > 0) {
        contextFactors.push('Learning progression');
      }

      return {
        ...result,
        contextualScore: Math.min(contextualScore, 1.0),
        contextFactors,
        originalScore: result.relevanceScore
      };
    });

    // Sort by contextual score
    return contextualResults.sort((a, b) => b.contextualScore - a.contextualScore);
  }

  /**
   * Calculate interest alignment score
   */
  private calculateInterestAlignment(content: any, userInterests: string[]): number {
    const contentKeywords = [
      ...content.tags,
      ...content.key_concepts,
      ...content.themes,
      content.philosophy_domain
    ].filter(Boolean).map(k => k.toLowerCase());

    const normalizedInterests = userInterests.map(i => i.toLowerCase());
    
    let matches = 0;
    for (const interest of normalizedInterests) {
      if (contentKeywords.some(keyword => keyword.includes(interest) || interest.includes(keyword))) {
        matches++;
      }
    }

    return matches / Math.max(normalizedInterests.length, 1);
  }

  /**
   * Calculate experience level bonus
   */
  private calculateExperienceBonus(
    contentComplexity: number,
    userExperience: string,
    preferredComplexity: number
  ): number {
    const experienceMap = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };

    const userLevel = experienceMap[userExperience as keyof typeof experienceMap] || 1;
    const targetComplexity = preferredComplexity || userLevel;

    // Prefer content slightly above or at user's level
    if (contentComplexity === targetComplexity) {
      return 0.1; // Perfect match
    } else if (contentComplexity === targetComplexity + 1) {
      return 0.05; // Slight challenge
    } else if (contentComplexity < targetComplexity - 1) {
      return -0.05; // Too easy
    } else if (contentComplexity > targetComplexity + 2) {
      return -0.1; // Too difficult
    }

    return 0;
  }

  /**
   * Calculate interaction bonus based on similar content
   */
  private calculateInteractionBonus(content: any, recentInteractions: any[]): number {
    if (recentInteractions.length === 0) return 0;

    let bonus = 0;
    const recentContentTypes = recentInteractions.map(i => i.content_type);
    const recentDomains = recentInteractions.map(i => i.philosophy_domain).filter(Boolean);
    const recentConcepts = recentInteractions.flatMap(i => i.key_concepts || []);

    // Content type similarity
    if (recentContentTypes.includes(content.content_type)) {
      bonus += 0.05;
    }

    // Philosophy domain similarity
    if (recentDomains.includes(content.philosophy_domain)) {
      bonus += 0.08;
    }

    // Concept overlap
    const conceptOverlap = content.key_concepts.filter((concept: string) => 
      recentConcepts.includes(concept)
    ).length;
    
    if (conceptOverlap > 0) {
      bonus += Math.min(conceptOverlap * 0.02, 0.1);
    }

    return bonus;
  }

  /**
   * Calculate learning progression bonus
   */
  private calculateProgressionBonus(content: any, userContext: any, recentInteractions: any[]): number {
    // If user has been viewing prerequisite content, boost related advanced content
    const recentComplexities = recentInteractions.map(i => i.complexity_level || 1);
    const avgRecentComplexity = recentComplexities.reduce((sum, c) => sum + c, 0) / recentComplexities.length;

    if (content.complexity_level === Math.ceil(avgRecentComplexity) + 1) {
      return 0.1; // Next logical step
    }

    // If user has been in a domain, boost related content in same domain
    const recentDomains = recentInteractions.map(i => i.philosophy_domain).filter(Boolean);
    const domainFrequency = recentDomains.filter(d => d === content.philosophy_domain).length;
    
    if (domainFrequency >= 2) {
      return 0.05; // Domain focus bonus
    }

    return 0;
  }

  /**
   * Get user's recent interactions for context
   */
  private async getUserRecentInteractions(sessionId: string): Promise<any[]> {
    try {
      // This would query the user_interactions table
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      return [];
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSearchSuggestions(partialQuery: string, limit: number = 5): Promise<string[]> {
    if (partialQuery.length < 2) return [];

    // Get content for suggestion generation
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      limit: 500
    });

    const suggestions = new Set<string>();

    // Extract suggestions from content titles and concepts
    for (const item of contentResult.items) {
      // Title-based suggestions
      if (item.title.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.add(item.title);
      }

      // Concept-based suggestions
      for (const concept of [...item.key_concepts, ...item.themes, ...item.tags]) {
        if (concept.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(concept);
        }
      }

      if (suggestions.size >= limit) break;
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get available search filters
   */
  async getSearchFilters(): Promise<SearchFilters> {
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      limit: 1000
    });

    const philosophyDomains = [...new Set(
      contentResult.items
        .map(item => item.philosophy_domain)
        .filter(Boolean)
    )];

    const contentTypes = [...new Set(
      contentResult.items.map(item => item.content_type)
    )];

    const complexityLevels = [...new Set(
      contentResult.items.map(item => item.complexity_level)
    )].sort((a, b) => a - b);

    const authors = [...new Set(
      contentResult.items.flatMap(item => item.authors)
    )].slice(0, 20);

    const themes = [...new Set(
      contentResult.items.flatMap(item => item.themes)
    )].slice(0, 30);

    return {
      philosophyDomains,
      contentTypes,
      complexityLevels,
      authors,
      themes
    };
  }

  /**
   * Search within specific philosophy domain
   */
  async searchPhilosophyDomain(
    domain: string,
    query: string,
    options: Partial<UnifiedSearchOptions> = {}
  ): Promise<SearchResponse> {
    return this.search({
      ...options,
      query,
      philosophyDomain: domain,
      searchType: 'philosophy'
    });
  }

  /**
   * Search for implementation resources
   */
  async searchImplementationResources(
    query: string,
    options: Partial<UnifiedSearchOptions> = {}
  ): Promise<SearchResponse> {
    return this.search({
      ...options,
      query,
      contentTypes: ['tool'],
      searchType: 'semantic'
    });
  }

  /**
   * Search for examples and stories
   */
  async searchExamples(
    query: string,
    options: Partial<UnifiedSearchOptions> = {}
  ): Promise<SearchResponse> {
    return this.search({
      ...options,
      query,
      contentTypes: ['story', 'video'],
      searchType: 'semantic'
    });
  }

  /**
   * Get related content based on current content
   */
  async getRelatedContent(
    contentId: string,
    sessionId?: string,
    limit: number = 5
  ): Promise<SearchResponse> {
    // Get the current content item
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      limit: 1000
    });

    const currentContent = contentResult.items.find(item => item.id === contentId);
    if (!currentContent) {
      return {
        results: [],
        total: 0,
        summary: 'Content not found',
        suggestions: [],
        relatedConcepts: []
      };
    }

    // Build search query from current content
    const relatedQuery = [
      ...currentContent.key_concepts.slice(0, 3),
      ...currentContent.themes.slice(0, 2)
    ].join(' ');

    return this.search({
      query: relatedQuery,
      philosophyDomain: currentContent.philosophy_domain,
      sessionId,
      limit
    });
  }

  /**
   * Map search type to internal format
   */
  private mapSearchType(searchType: string): 'intent' | 'concept' | 'implementation' | 'philosophy' {
    switch (searchType) {
      case 'philosophy':
        return 'philosophy';
      case 'relationship':
        return 'concept';
      case 'keyword':
        return 'intent';
      default:
        return 'intent';
    }
  }

  /**
   * Track search analytics with enhanced data
   */
  private async trackSearchAnalytics(data: {
    sessionId: string;
    query: string;
    searchType: string;
    resultsCount: number;
    philosophyDomain?: string;
    clickedResults?: string[];
    satisfactionScore?: number;
  }): Promise<void> {
    try {
      // Enhanced analytics data
      const analyticsData = {
        session_id: data.sessionId,
        query: data.query,
        search_type: data.searchType,
        results_count: data.resultsCount,
        philosophy_domain: data.philosophyDomain,
        clicked_results: data.clickedResults || [],
        satisfaction_score: data.satisfactionScore,
        timestamp: new Date().toISOString(),
        query_length: data.query.length,
        query_complexity: this.calculateQueryComplexity(data.query),
        has_filters: !!(data.philosophyDomain || data.searchType !== 'semantic')
      };

      console.log('Enhanced search analytics:', analyticsData);
      
      // In production, this would be stored in search_analytics table
      // await enhancedContentRepository.trackSearchAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Failed to track search analytics:', error);
      // Don't throw - analytics shouldn't break search
    }
  }

  /**
   * Calculate query complexity for analytics
   */
  private calculateQueryComplexity(query: string): 'simple' | 'moderate' | 'complex' {
    const words = query.trim().split(/\s+/).length;
    const hasQuotes = query.includes('"');
    const hasOperators = /\b(AND|OR|NOT)\b/i.test(query);
    const hasSpecialChars = /[()[\]{}*?]/.test(query);

    if (words <= 2 && !hasQuotes && !hasOperators && !hasSpecialChars) {
      return 'simple';
    } else if (words <= 5 && (hasQuotes || hasOperators || hasSpecialChars)) {
      return 'complex';
    } else {
      return 'moderate';
    }
  }
}

// Singleton instance
export const unifiedSearchInterface = new UnifiedSearchInterface();