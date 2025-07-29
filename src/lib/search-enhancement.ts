/**
 * Enhanced Search Intelligence for AIME Knowledge Universe
 * 
 * Adds semantic search, intelligent ranking, and content relationships
 */

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
}

/**
 * Advanced relevance scoring that considers multiple factors
 */
export function calculateAdvancedRelevance(
  item: SearchResult, 
  query: string,
  userContext?: {
    previousSearches?: string[];
    viewedContent?: string[];
    interests?: string[];
  }
): number {
  const queryLower = query.toLowerCase();
  const titleLower = item.title.toLowerCase();
  const descriptionLower = item.description.toLowerCase();
  const contentLower = item.content.toLowerCase();
  
  let score = 0;
  
  // 1. Exact title match (highest priority)
  if (titleLower === queryLower) score += 10;
  else if (titleLower.includes(queryLower)) score += 5;
  
  // 2. Title word matches
  const queryWords = queryLower.split(' ').filter(w => w.length > 2);
  const titleWords = titleLower.split(' ');
  const titleMatches = queryWords.filter(word => titleWords.some(tw => tw.includes(word)));
  score += titleMatches.length * 2;
  
  // 3. Description relevance
  if (descriptionLower.includes(queryLower)) score += 3;
  const descMatches = queryWords.filter(word => descriptionLower.includes(word));
  score += descMatches.length * 1.5;
  
  // 4. Content relevance
  const contentMatches = queryWords.filter(word => contentLower.includes(word));
  score += contentMatches.length * 0.5;
  
  // 5. Content type priority (Indigenous knowledge and business cases prioritized)
  const typePriority = {
    'knowledge': 2.0,
    'business_case': 1.8,
    'video': 1.5,
    'tool': 1.2,
    'content': 1.0,
    'hoodie': 0.8
  };
  score *= typePriority[item.type] || 1.0;
  
  // 6. Recency boost (newer content gets slight boost)
  if (item.created_at) {
    const daysSinceCreated = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 30) score *= 1.2; // Recent content boost
    else if (daysSinceCreated < 365) score *= 1.1; // Somewhat recent boost
  }
  
  // 7. User context relevance
  if (userContext) {
    // Boost if related to user's previous interests
    if (userContext.interests && userContext.interests.some(interest => 
      titleLower.includes(interest.toLowerCase()) || descriptionLower.includes(interest.toLowerCase())
    )) {
      score *= 1.3;
    }
    
    // Boost if related to previous searches
    if (userContext.previousSearches && userContext.previousSearches.some(prevSearch =>
      prevSearch.toLowerCase().split(' ').some(word => 
        titleLower.includes(word) || descriptionLower.includes(word)
      )
    )) {
      score *= 1.15;
    }
  }
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Enhanced semantic search using vector embeddings
 * Fallbacks to term similarity if semantic engine not available
 */
export async function calculateSemanticSimilarity(query: string, content: string): Promise<number> {
  try {
    // Try to use semantic search engine
    const { semanticSearchEngine } = await import('./search/semantic-search');
    
    // For now, use simple similarity as fallback until engine is properly initialized
    // TODO: Implement actual semantic similarity using the engine
    return calculateTermSimilarity(query, content);
  } catch (error) {
    // Fallback to term-based similarity
    return calculateTermSimilarity(query, content);
  }
}

/**
 * Term-based similarity calculation (original implementation)
 */
function calculateTermSimilarity(query: string, content: string): number {
  const queryTerms = extractKeyTerms(query);
  const contentTerms = extractKeyTerms(content);
  
  if (queryTerms.size === 0 || contentTerms.size === 0) return 0;
  
  // Calculate Jaccard similarity
  const intersection = new Set([...queryTerms].filter(term => contentTerms.has(term)));
  const union = new Set([...queryTerms, ...contentTerms]);
  
  return intersection.size / union.size;
}

/**
 * Extract key terms from text (simple keyword extraction)
 */
export function extractKeyTerms(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);
  
  return new Set(
    text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20) // Limit to top 20 terms
  );
}

/**
 * Indigenous knowledge context detection
 */
export function detectIndigenousContext(content: string): {
  hasIndigenousContent: boolean;
  confidence: number;
  concepts: string[];
} {
  const indigenousTerms = {
    'seven generation': 0.9,
    'seven-generation': 0.9,
    'indigenous': 0.8,
    'aboriginal': 0.8,
    'first nations': 0.8,
    'native': 0.7,
    'traditional knowledge': 0.8,
    'elder': 0.7,
    'ceremony': 0.8,
    'country': 0.6, // In Indigenous Australian context
    'songlines': 0.9,
    'dreamtime': 0.9,
    'reciprocity': 0.7,
    'custodian': 0.7,
    'custodianship': 0.8,
    'yarning': 0.8,
    'mob': 0.6, // In Indigenous Australian context
    'deadly': 0.6, // Positive term in Indigenous Australian context
    'uncle': 0.5, // Respectful term
    'aunty': 0.5, // Respectful term
    'cultural protocol': 0.9,
    'sacred': 0.7,
    'ancestors': 0.7,
    'connection to country': 0.9,
    'traditional owners': 0.8
  };
  
  const contentLower = content.toLowerCase();
  let totalScore = 0;
  let matchCount = 0;
  const foundConcepts: string[] = [];
  
  for (const [term, weight] of Object.entries(indigenousTerms)) {
    if (contentLower.includes(term)) {
      totalScore += weight;
      matchCount++;
      foundConcepts.push(term);
    }
  }
  
  const confidence = Math.min(totalScore / 3, 1); // Normalize to 0-1
  
  return {
    hasIndigenousContent: confidence > 0.3,
    confidence,
    concepts: foundConcepts
  };
}

/**
 * Content relationship detection
 */
export function detectContentRelationships(
  item: SearchResult,
  allResults: SearchResult[]
): Array<{id: string, title: string, type: string, relationship: string, strength: number}> {
  const relationships: Array<{id: string, title: string, type: string, relationship: string, strength: number}> = [];
  
  const itemTerms = extractKeyTerms(item.title + ' ' + item.description);
  
  for (const other of allResults) {
    if (other.id === item.id) continue;
    
    const otherTerms = extractKeyTerms(other.title + ' ' + other.description);
    const similarity = calculateTermSimilarity(
      Array.from(itemTerms).join(' '),
      Array.from(otherTerms).join(' ')
    );
    
    if (similarity > 0.2) { // Threshold for relationship
      let relationshipType = 'related';
      
      // Determine relationship type
      if (item.type === 'business_case' && other.type === 'tool') {
        relationshipType = 'implements';
      } else if (item.type === 'knowledge' && other.type === 'business_case') {
        relationshipType = 'applied_in';
      } else if (item.type === 'video' && other.type === 'knowledge') {
        relationshipType = 'explains';
      } else if (similarity > 0.5) {
        relationshipType = 'similar_to';
      }
      
      relationships.push({
        id: other.id,
        title: other.title,
        type: other.type,
        relationship: relationshipType,
        strength: similarity
      });
    }
  }
  
  return relationships
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5); // Top 5 relationships
}

/**
 * Query expansion for better search results
 */
export function expandQuery(query: string): string[] {
  const expansions: Record<string, string[]> = {
    'mentoring': ['mentorship', 'guidance', 'coaching', 'support'],
    'indigenous': ['aboriginal', 'first nations', 'native', 'traditional'],
    'systems': ['system', 'framework', 'approach', 'methodology'],
    'transformation': ['change', 'development', 'evolution', 'growth'],
    'leadership': ['leaders', 'leading', 'guidance', 'direction'],
    'community': ['communities', 'collective', 'group', 'network'],
    'economics': ['economic', 'economy', 'financial', 'value'],
    'hoodie': ['hoodies', 'achievement', 'recognition', 'badge'],
    'youth': ['young', 'students', 'children', 'kids'],
    'education': ['learning', 'teaching', 'school', 'training']
  };
  
  const queryWords = query.toLowerCase().split(' ');
  const expandedTerms = new Set([query]);
  
  for (const word of queryWords) {
    if (expansions[word]) {
      expansions[word].forEach(expansion => {
        expandedTerms.add(query.replace(word, expansion));
      });
    }
  }
  
  return Array.from(expandedTerms);
}

/**
 * Smart search suggestions based on query
 */
export function generateSearchSuggestions(query: string, recentResults: SearchResult[]): string[] {
  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Base suggestions for common AIME topics
  const baseSuggestions = {
    'indigenous': [
      'indigenous systems thinking',
      'indigenous knowledge protocols', 
      'indigenous leadership models',
      'traditional ecological knowledge'
    ],
    'hoodie': [
      'hoodie economics explained',
      'hoodie trading system',
      'digital hoodies achievement',
      'imagination credits'
    ],
    'mentoring': [
      'mentoring methodology',
      'reverse mentoring',
      'youth mentoring programs',
      'cultural mentoring'
    ],
    'systems': [
      'systems thinking framework',
      'systems change leadership',
      'organizational systems',
      'social systems'
    ],
    'joy': [
      'joy corps transformation',
      'joy in organizations',
      'joy-based leadership',
      'community joy'
    ]
  };
  
  // Add base suggestions
  for (const [key, values] of Object.entries(baseSuggestions)) {
    if (queryLower.includes(key)) {
      values.forEach(suggestion => suggestions.add(suggestion));
    }
  }
  
  // Add suggestions based on recent results
  recentResults.slice(0, 10).forEach(result => {
    const terms = extractKeyTerms(result.title);
    Array.from(terms).slice(0, 3).forEach(term => {
      if (term.length > 3 && !queryLower.includes(term)) {
        suggestions.add(`${query} ${term}`);
      }
    });
  });
  
  // Generic helpful completions
  if (query.length > 2) {
    suggestions.add(`${query} examples`);
    suggestions.add(`${query} framework`);
    suggestions.add(`${query} implementation`);
    suggestions.add(`how to ${query}`);
  }
  
  return Array.from(suggestions).slice(0, 8);
}