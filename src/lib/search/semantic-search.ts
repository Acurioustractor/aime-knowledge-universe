/**
 * Semantic Search Engine
 * 
 * AI-powered search that understands intent and context with OpenAI embeddings
 */

import { ContentItem, enhancedContentRepository } from '@/lib/database/enhanced-supabase';
import { embeddingsService, SimilarityResult } from './embeddings-service';

export interface SearchQuery {
  query: string;
  searchType: 'intent' | 'concept' | 'implementation' | 'philosophy';
  philosophyDomain?: string;
  contentTypes?: string[];
  complexityLevel?: number;
  userContext?: any;
  useEmbeddings?: boolean;
  similarityThreshold?: number;
}

export interface SearchResult {
  content: ContentItem;
  relevanceScore: number;
  matchType: 'exact' | 'semantic' | 'conceptual' | 'contextual' | 'vector_similarity';
  highlights: string[];
  reasoning: string;
  similarityScore?: number;
  embeddingMatch?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  summary: string;
  suggestions: string[];
  relatedConcepts: string[];
  philosophyContext?: any;
  searchMetadata: {
    usedEmbeddings: boolean;
    processingTime: number;
    intentAnalysis: any;
    qualityScore: number;
  };
}

/**
 * Semantic Search Engine with AI-powered understanding
 */
export class SemanticSearchEngine {
  private openaiApiKey: string;

  constructor(openaiApiKey?: string) {
    this.openaiApiKey = openaiApiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Perform semantic search with intent understanding and embeddings
   */
  async search(query: SearchQuery, content: ContentItem[]): Promise<SearchResponse> {
    const startTime = Date.now();
    console.log(`🔍 Semantic search: "${query.query}" (${query.searchType})`);

    // Analyze search intent with AI
    const intent = await this.analyzeSearchIntent(query);
    
    // Filter content based on query parameters
    const filteredContent = this.filterContent(content, query);
    
    // Determine if we should use embeddings
    const useEmbeddings = query.useEmbeddings !== false && await embeddingsService.isAvailable();
    
    let scoredResults: SearchResult[] = [];
    
    if (useEmbeddings) {
      // Use vector similarity search with embeddings
      scoredResults = await this.performVectorSearch(query, filteredContent, intent);
    } else {
      // Fall back to traditional semantic search
      scoredResults = await this.scoreAndRankResults(query, filteredContent, intent);
    }
    
    // Generate search summary and suggestions
    const summary = this.generateSearchSummary(query, scoredResults);
    const suggestions = this.generateSearchSuggestions(query, scoredResults);
    const relatedConcepts = this.extractRelatedConcepts(scoredResults);
    
    const processingTime = Date.now() - startTime;
    const qualityScore = this.calculateSearchQuality(query, scoredResults, intent);

    return {
      results: scoredResults,
      total: scoredResults.length,
      summary,
      suggestions,
      relatedConcepts,
      philosophyContext: query.philosophyDomain ? await this.getPhilosophyContext(query.philosophyDomain) : undefined,
      searchMetadata: {
        usedEmbeddings: useEmbeddings,
        processingTime,
        intentAnalysis: intent,
        qualityScore
      }
    };
  }

  /**
   * Analyze search intent using AI and rule-based analysis
   */
  private async analyzeSearchIntent(query: SearchQuery): Promise<{
    primaryIntent: string;
    secondaryIntents: string[];
    concepts: string[];
    complexity: number;
    confidence: number;
    aiAnalysis?: any;
  }> {
    const queryLower = query.query.toLowerCase();
    const concepts: string[] = [];
    let primaryIntent = 'general';
    const secondaryIntents: string[] = [];
    let complexity = 1;
    let confidence = 0.7;
    let aiAnalysis: any = null;

    // Try AI-powered intent analysis if available
    if (this.openaiApiKey && query.query.length > 10) {
      try {
        aiAnalysis = await this.performAIIntentAnalysis(query.query);
        if (aiAnalysis) {
          primaryIntent = aiAnalysis.primaryIntent || primaryIntent;
          secondaryIntents.push(...(aiAnalysis.secondaryIntents || []));
          concepts.push(...(aiAnalysis.concepts || []));
          complexity = aiAnalysis.complexity || complexity;
          confidence = aiAnalysis.confidence || confidence;
        }
      } catch (error) {
        console.warn('AI intent analysis failed, using rule-based fallback:', error);
      }
    }

    // Rule-based intent analysis (fallback or enhancement)
    const ruleBasedAnalysis = this.performRuleBasedIntentAnalysis(queryLower);
    
    // Merge rule-based with AI analysis
    if (!aiAnalysis) {
      primaryIntent = ruleBasedAnalysis.primaryIntent;
      secondaryIntents.push(...ruleBasedAnalysis.secondaryIntents);
      concepts.push(...ruleBasedAnalysis.concepts);
      complexity = ruleBasedAnalysis.complexity;
      confidence = ruleBasedAnalysis.confidence;
    } else {
      // Enhance AI analysis with rule-based concepts
      concepts.push(...ruleBasedAnalysis.concepts);
      concepts.push(...this.extractPhilosophyConcepts(queryLower));
    }

    // Remove duplicates and filter concepts
    const uniqueConcepts = [...new Set(concepts)].filter(Boolean);

    return {
      primaryIntent,
      secondaryIntents: [...new Set(secondaryIntents)],
      concepts: uniqueConcepts,
      complexity,
      confidence,
      aiAnalysis
    };
  }

  /**
   * Perform AI-powered intent analysis using OpenAI
   */
  private async performAIIntentAnalysis(query: string): Promise<any> {
    if (!this.openaiApiKey) return null;

    try {
      const openai = new (await import('openai')).default({
        apiKey: this.openaiApiKey
      });

      const prompt = `Analyze this search query for AIME (Australian Indigenous Mentoring Experience) knowledge platform:

Query: "${query}"

Analyze the search intent and extract:
1. Primary intent (implementation, conceptual, examples, philosophy, general)
2. Secondary intents (if any)
3. Key concepts related to AIME's work (mentoring, education, indigenous, youth, leadership, etc.)
4. Complexity level (1-5, where 1=basic understanding, 5=advanced implementation)
5. Confidence in analysis (0-1)

Respond in JSON format:
{
  "primaryIntent": "string",
  "secondaryIntents": ["string"],
  "concepts": ["string"],
  "complexity": number,
  "confidence": number,
  "reasoning": "string"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }

    } catch (error) {
      console.error('AI intent analysis error:', error);
    }

    return null;
  }

  /**
   * Rule-based intent analysis (fallback)
   */
  private performRuleBasedIntentAnalysis(queryLower: string): {
    primaryIntent: string;
    secondaryIntents: string[];
    concepts: string[];
    complexity: number;
    confidence: number;
  } {
    let primaryIntent = 'general';
    const secondaryIntents: string[] = [];
    const concepts: string[] = [];
    let complexity = 1;
    let confidence = 0.6;

    // Implementation intent patterns
    if (queryLower.match(/\b(how to|implement|apply|use|create|build|develop|start)\b/)) {
      primaryIntent = 'implementation';
      complexity = 3;
      confidence = 0.8;
    }
    // Conceptual understanding patterns
    else if (queryLower.match(/\b(what is|explain|understand|define|meaning|concept)\b/)) {
      primaryIntent = 'conceptual';
      complexity = 2;
      confidence = 0.8;
    }
    // Example/story patterns
    else if (queryLower.match(/\b(example|case study|story|success|outcome|result)\b/)) {
      primaryIntent = 'examples';
      complexity = 2;
      confidence = 0.7;
    }
    // Philosophy/principle patterns
    else if (queryLower.match(/\b(why|philosophy|principle|belief|value|approach|theory)\b/)) {
      primaryIntent = 'philosophy';
      complexity = 1;
      confidence = 0.8;
    }
    // Comparison patterns
    else if (queryLower.match(/\b(compare|difference|versus|vs|better|alternative)\b/)) {
      primaryIntent = 'conceptual';
      secondaryIntents.push('examples');
      complexity = 3;
      confidence = 0.7;
    }

    // Extract AIME-specific concepts
    concepts.push(...this.extractPhilosophyConcepts(queryLower));

    return {
      primaryIntent,
      secondaryIntents,
      concepts,
      complexity,
      confidence
    };
  }

  /**
   * Extract AIME philosophy concepts from query
   */
  private extractPhilosophyConcepts(queryLower: string): string[] {
    const concepts: string[] = [];
    
    const conceptMap = {
      'imagination': ['imagination', 'creative', 'innovative', 'dream'],
      'hoodie': ['hoodie', 'economics', 'value', 'exchange'],
      'mentoring': ['mentor', 'mentoring', 'guide', 'support', 'coaching'],
      'education': ['education', 'learning', 'school', 'student', 'teach'],
      'indigenous': ['indigenous', 'aboriginal', 'first nations', 'cultural'],
      'youth': ['youth', 'young', 'student', 'teenager', 'adolescent'],
      'leadership': ['leader', 'leadership', 'lead', 'influence', 'inspire'],
      'community': ['community', 'network', 'group', 'collective', 'together'],
      'relationship': ['relationship', 'connection', 'bond', 'trust', 'rapport'],
      'empowerment': ['empower', 'empowerment', 'enable', 'strengthen', 'uplift']
    };

    for (const [concept, keywords] of Object.entries(conceptMap)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        concepts.push(concept);
      }
    }

    return concepts;
  }

  /**
   * Filter content based on query parameters
   */
  private filterContent(content: ContentItem[], query: SearchQuery): ContentItem[] {
    let filtered = [...content];

    // Filter by philosophy domain
    if (query.philosophyDomain) {
      filtered = filtered.filter(item => item.philosophy_domain === query.philosophyDomain);
    }

    // Filter by content types
    if (query.contentTypes?.length) {
      filtered = filtered.filter(item => query.contentTypes!.includes(item.content_type));
    }

    // Filter by complexity level
    if (query.complexityLevel) {
      filtered = filtered.filter(item => item.complexity_level <= query.complexityLevel!);
    }

    // Filter by user context
    if (query.userContext) {
      // Prefer content matching user's interests
      if (query.userContext.interests.length > 0) {
        const userInterests = query.userContext.interests.map((i: string) => i.toLowerCase());
        filtered = filtered.filter(item => {
          const itemKeywords = [
            ...item.tags,
            ...item.key_concepts,
            ...item.themes
          ].map(k => k.toLowerCase());
          
          return itemKeywords.some(keyword => userInterests.includes(keyword));
        });
      }
    }

    return filtered;
  }

  /**
   * Perform vector search using embeddings
   */
  private async performVectorSearch(
    query: SearchQuery,
    content: ContentItem[],
    intent: any
  ): Promise<SearchResult[]> {
    try {
      console.log('🔍 Performing vector search with embeddings...');
      
      // Generate query embedding with intent context
      const queryEmbedding = await embeddingsService.generateQueryEmbedding(
        query.query,
        intent.primaryIntent
      );

      // Get embeddings for content items
      const contentEmbeddings = await this.getContentEmbeddings(content);
      
      // Find similar content using cosine similarity
      const similarityResults = await embeddingsService.findSimilarContent(
        queryEmbedding,
        contentEmbeddings,
        query.similarityThreshold || 0.7,
        50 // Get more results for better ranking
      );

      // Convert to SearchResult format and apply additional scoring
      const searchResults: SearchResult[] = [];
      
      for (const result of similarityResults) {
        const additionalScore = this.calculateRelevanceScore(query, result.content, intent);
        
        // Combine vector similarity with traditional relevance scoring
        const combinedScore = (result.similarity * 0.7) + (additionalScore.total * 0.3);
        
        searchResults.push({
          content: result.content,
          relevanceScore: combinedScore,
          matchType: 'vector_similarity',
          highlights: additionalScore.highlights,
          reasoning: `Vector similarity: ${Math.round(result.similarity * 100)}%. ${additionalScore.reasoning}`,
          similarityScore: result.similarity,
          embeddingMatch: true
        });
      }

      // Sort by combined score and return top results
      return searchResults
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 20);

    } catch (error) {
      console.error('Vector search failed, falling back to traditional search:', error);
      // Fall back to traditional search if vector search fails
      return this.scoreAndRankResults(query, content, intent);
    }
  }

  /**
   * Get or generate embeddings for content items
   */
  private async getContentEmbeddings(content: ContentItem[]): Promise<Array<{
    contentId: string;
    embedding: number[];
    content: ContentItem;
  }>> {
    const contentEmbeddings: Array<{
      contentId: string;
      embedding: number[];
      content: ContentItem;
    }> = [];

    // Check if we have cached embeddings in database
    // For now, generate embeddings on-the-fly (in production, these would be pre-computed)
    
    const batchSize = 10; // Process in smaller batches to avoid rate limits
    
    for (let i = 0; i < content.length; i += batchSize) {
      const batch = content.slice(i, i + batchSize);
      
      try {
        const embeddings = await Promise.all(
          batch.map(async (item) => {
            // Generate summary for embedding
            const summary = embeddingsService.generateContentSummary(item);
            const embedding = await embeddingsService.generateEmbedding(summary, 'summary');
            
            return {
              contentId: item.id,
              embedding,
              content: item
            };
          })
        );
        
        contentEmbeddings.push(...embeddings);
        
        // Small delay to respect rate limits
        if (i + batchSize < content.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`Error generating embeddings for batch ${i / batchSize + 1}:`, error);
        // Continue with next batch
      }
    }

    return contentEmbeddings;
  }

  /**
   * Score and rank search results
   */
  private async scoreAndRankResults(
    query: SearchQuery,
    content: ContentItem[],
    intent: any
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const item of content) {
      const score = this.calculateRelevanceScore(query, item, intent);
      
      if (score.total > 0.3) { // Minimum relevance threshold
        results.push({
          content: item,
          relevanceScore: score.total,
          matchType: score.matchType,
          highlights: score.highlights,
          reasoning: score.reasoning
        });
      }
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate relevance score for content item
   */
  private calculateRelevanceScore(
    query: SearchQuery,
    content: ContentItem,
    intent: any
  ): {
    total: number;
    matchType: 'exact' | 'semantic' | 'conceptual' | 'contextual';
    highlights: string[];
    reasoning: string;
  } {
    let score = 0;
    const highlights: string[] = [];
    const reasons: string[] = [];
    let matchType: 'exact' | 'semantic' | 'conceptual' | 'contextual' = 'contextual';

    const queryTerms = query.query.toLowerCase().split(/\s+/);
    const contentText = [
      content.title,
      content.description || '',
      ...content.tags,
      ...content.key_concepts,
      ...content.themes
    ].join(' ').toLowerCase();

    // Exact title match
    if (content.title.toLowerCase().includes(query.query.toLowerCase())) {
      score += 1.0;
      matchType = 'exact';
      highlights.push(content.title);
      reasons.push('Exact title match');
    }

    // Term matching in content
    let termMatches = 0;
    for (const term of queryTerms) {
      if (term.length > 2 && contentText.includes(term)) {
        termMatches++;
        if (content.title.toLowerCase().includes(term)) {
          highlights.push(`Title contains "${term}"`);
        }
      }
    }
    
    const termScore = termMatches / queryTerms.length;
    score += termScore * 0.8;
    
    if (termScore > 0.5) {
      matchType = 'semantic';
      reasons.push(`${Math.round(termScore * 100)}% term match`);
    }

    // Concept matching
    const conceptMatches = intent.concepts.filter((concept: string) => 
      content.key_concepts.some(kc => kc.toLowerCase().includes(concept)) ||
      content.themes.some(theme => theme.toLowerCase().includes(concept))
    );
    
    if (conceptMatches.length > 0) {
      score += (conceptMatches.length / intent.concepts.length) * 0.6;
      matchType = 'conceptual';
      reasons.push(`Matches concepts: ${conceptMatches.join(', ')}`);
    }

    // Intent matching
    switch (intent.primaryIntent) {
      case 'implementation':
        if (content.content_type === 'tool') {
          score += 0.5;
          reasons.push('Implementation tool match');
        }
        break;
      case 'examples':
        if (content.content_type === 'story') {
          score += 0.5;
          reasons.push('Example/story match');
        }
        break;
      case 'philosophy':
        if (content.is_philosophy_primer) {
          score += 0.7;
          reasons.push('Philosophy primer match');
        }
        break;
      case 'conceptual':
        if (content.content_type === 'research') {
          score += 0.4;
          reasons.push('Research/conceptual match');
        }
        break;
    }

    // Quality boost
    score += content.quality_score * 0.2;
    
    // Engagement boost
    if (content.engagement_score > 0.7) {
      score += 0.1;
      reasons.push('High engagement content');
    }

    // Complexity matching
    if (query.complexityLevel && content.complexity_level <= query.complexityLevel) {
      score += 0.1;
    }

    return {
      total: Math.min(score, 1.0),
      matchType,
      highlights,
      reasoning: reasons.join('; ')
    };
  }

  /**
   * Generate search summary
   */
  private generateSearchSummary(query: SearchQuery, results: SearchResult[]): string {
    if (results.length === 0) {
      return `No results found for "${query.query}". Try broadening your search or exploring related concepts.`;
    }

    const topResult = results[0];
    const resultTypes = [...new Set(results.map(r => r.content.content_type))];
    
    let summary = `Found ${results.length} results for "${query.query}". `;
    
    if (topResult.matchType === 'exact') {
      summary += `Top result is an exact match: "${topResult.content.title}". `;
    } else {
      summary += `Most relevant result: "${topResult.content.title}" (${Math.round(topResult.relevanceScore * 100)}% match). `;
    }
    
    if (resultTypes.length > 1) {
      summary += `Results include ${resultTypes.join(', ')}.`;
    }

    return summary;
  }

  /**
   * Generate search suggestions
   */
  private generateSearchSuggestions(query: SearchQuery, results: SearchResult[]): string[] {
    const suggestions: string[] = [];
    
    // Suggest related concepts
    const concepts = new Set<string>();
    results.slice(0, 5).forEach(result => {
      result.content.key_concepts.forEach(concept => concepts.add(concept));
    });
    
    Array.from(concepts).slice(0, 3).forEach(concept => {
      suggestions.push(`Search for "${concept}"`);
    });

    // Suggest different content types
    const availableTypes = [...new Set(results.map(r => r.content.content_type))];
    if (availableTypes.length > 1) {
      availableTypes.forEach(type => {
        suggestions.push(`Show only ${type} content`);
      });
    }

    // Suggest philosophy domains
    const domains = [...new Set(results.map(r => r.content.philosophy_domain).filter(Boolean))];
    domains.slice(0, 2).forEach(domain => {
      suggestions.push(`Explore ${domain} philosophy`);
    });

    return suggestions.slice(0, 5);
  }

  /**
   * Extract related concepts from results
   */
  private extractRelatedConcepts(results: SearchResult[]): string[] {
    const conceptCounts = new Map<string, number>();
    
    results.slice(0, 10).forEach(result => {
      [...result.content.key_concepts, ...result.content.themes].forEach(concept => {
        conceptCounts.set(concept, (conceptCounts.get(concept) || 0) + 1);
      });
    });

    return Array.from(conceptCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([concept]) => concept);
  }

  /**
   * Get philosophy context for domain
   */
  private async getPhilosophyContext(domain: string): Promise<any> {
    try {
      const primer = await enhancedContentRepository.getPhilosophyPrimer(domain);
      return primer || {
        domain,
        briefExplanation: `Context for ${domain} philosophy`,
        keyPrinciples: []
      };
    } catch (error) {
      console.error('Error fetching philosophy context:', error);
      return {
        domain,
        briefExplanation: `Context for ${domain} philosophy`,
        keyPrinciples: []
      };
    }
  }

  /**
   * Calculate overall search quality score
   */
  private calculateSearchQuality(
    query: SearchQuery,
    results: SearchResult[],
    intent: any
  ): number {
    if (results.length === 0) return 0;

    let qualityScore = 0;
    const factors = [];

    // Result relevance quality
    const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
    qualityScore += avgRelevance * 0.4;
    factors.push(`Avg relevance: ${Math.round(avgRelevance * 100)}%`);

    // Result diversity (different content types)
    const contentTypes = new Set(results.map(r => r.content.content_type));
    const diversityScore = Math.min(contentTypes.size / 4, 1); // Normalize to max 4 types
    qualityScore += diversityScore * 0.2;
    factors.push(`Diversity: ${contentTypes.size} types`);

    // Intent matching quality
    const intentMatches = results.filter(r => {
      switch (intent.primaryIntent) {
        case 'implementation':
          return r.content.content_type === 'tool';
        case 'examples':
          return r.content.content_type === 'story';
        case 'philosophy':
          return r.content.is_philosophy_primer;
        case 'conceptual':
          return r.content.content_type === 'research';
        default:
          return true;
      }
    }).length;
    
    const intentScore = intentMatches / results.length;
    qualityScore += intentScore * 0.2;
    factors.push(`Intent match: ${Math.round(intentScore * 100)}%`);

    // High-quality content ratio
    const highQualityCount = results.filter(r => r.content.quality_score > 0.7).length;
    const qualityRatio = highQualityCount / results.length;
    qualityScore += qualityRatio * 0.2;
    factors.push(`High quality: ${Math.round(qualityRatio * 100)}%`);

    console.log(`Search quality: ${Math.round(qualityScore * 100)}% (${factors.join(', ')})`);
    
    return Math.min(qualityScore, 1.0);
  }

  /**
   * Search with vector similarity (when embeddings are available)
   */
  async vectorSearch(
    queryEmbedding: number[],
    content: ContentItem[],
    threshold: number = 0.7
  ): Promise<SearchResult[]> {
    try {
      const contentEmbeddings = await this.getContentEmbeddings(content);
      
      const similarityResults = await embeddingsService.findSimilarContent(
        queryEmbedding,
        contentEmbeddings,
        threshold,
        20
      );

      return similarityResults.map(result => ({
        content: result.content,
        relevanceScore: result.similarity,
        matchType: 'vector_similarity' as const,
        highlights: [result.content.title],
        reasoning: `Vector similarity: ${Math.round(result.similarity * 100)}%`,
        similarityScore: result.similarity,
        embeddingMatch: true
      }));

    } catch (error) {
      console.error('Vector search failed:', error);
      return [];
    }
  }
}

// Singleton instance
export const semanticSearchEngine = new SemanticSearchEngine();