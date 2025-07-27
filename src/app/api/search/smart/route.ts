import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SearchResult {
  id: string;
  title: string;
  content_type: string;
  content: string;
  source: string;
  url: string;
  source_created_at: string;
  view_count: number;
  relevance_score: number;
  match_reasons: string[];
}

interface SearchSuggestion {
  query: string;
  type: 'correction' | 'completion' | 'related';
  confidence: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId') || null;
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    const db = await getDb();
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 0);
    
    // Track search query
    if (userId) {
      await db.run(`
        INSERT INTO search_history (id, user_id, query, timestamp)
        VALUES (?, ?, ?, ?)
      `, `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, userId, query, Date.now());
    }
    
    // Get all content for smart scoring
    const allContent = await db.all(`
      SELECT id, title, content_type, content, source, url, 
             source_created_at, view_count, tags
      FROM content
      ORDER BY source_created_at DESC
      LIMIT 1000
    `);
    
    // Score each item based on multiple relevance factors
    const scoredResults: SearchResult[] = allContent.map(item => {
      let score = 0;
      const matchReasons: string[] = [];
      
      // 1. Title matching (highest weight)
      const titleLower = item.title.toLowerCase();
      queryTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 50;
          matchReasons.push(`Title contains "${term}"`);
        }
        // Exact word match bonus
        const titleWords = titleLower.split(/\s+/);
        if (titleWords.includes(term)) {
          score += 25;
          matchReasons.push(`Title exact match "${term}"`);
        }
      });
      
      // 2. Content matching
      const contentLower = (item.content || '').toLowerCase();
      queryTerms.forEach(term => {
        const contentMatches = (contentLower.match(new RegExp(term, 'g')) || []).length;
        if (contentMatches > 0) {
          score += Math.min(contentMatches * 5, 20); // Cap at 20 points per term
          matchReasons.push(`Content contains "${term}" (${contentMatches}x)`);
        }
      });
      
      // 3. Tag matching
      const tags = (item.tags || '').toLowerCase().split(',').map(t => t.trim());
      queryTerms.forEach(term => {
        if (tags.some(tag => tag.includes(term))) {
          score += 30;
          matchReasons.push(`Tag match "${term}"`);
        }
      });
      
      // 4. Fuzzy matching for typos
      queryTerms.forEach(term => {
        if (term.length > 3) {
          // Simple edit distance check
          const similarWords = extractSimilarWords(titleLower + ' ' + contentLower, term);
          if (similarWords.length > 0) {
            score += 10;
            matchReasons.push(`Similar to "${term}"`);
          }
        }
      });
      
      // 5. Popularity boost (small factor)
      if (item.view_count > 100) {
        score += 5;
        matchReasons.push('Popular content');
      }
      
      // 6. Recency boost
      const daysOld = (Date.now() - new Date(item.source_created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld < 30) {
        score += 10;
        matchReasons.push('Recent content');
      }
      
      // 7. Content type relevance
      if (queryLower.includes('video') && item.content_type === 'video') {
        score += 20;
        matchReasons.push('Video type match');
      } else if (queryLower.includes('tool') && item.content_type === 'tool') {
        score += 20;
        matchReasons.push('Tool type match');
      }
      
      // 8. Special query patterns
      if (queryLower.includes('how to') && item.content_type === 'tool') {
        score += 15;
        matchReasons.push('How-to content');
      }
      if (queryLower.includes('example') && item.content_type === 'business_case') {
        score += 15;
        matchReasons.push('Example/case study');
      }
      
      return {
        ...item,
        relevance_score: score,
        match_reasons: matchReasons
      };
    }).filter(item => item.relevance_score > 0);
    
    // Sort by relevance score
    scoredResults.sort((a, b) => b.relevance_score - a.relevance_score);
    
    // Get paginated results
    const paginatedResults = scoredResults.slice(offset, offset + limit);
    
    // Generate search suggestions
    const suggestions = await generateSearchSuggestions(query, scoredResults, db);
    
    // Get related searches based on user history
    const relatedSearches = await getRelatedSearches(query, db);
    
    // Find related content (items often viewed together)
    const relatedContent = await findRelatedContent(paginatedResults, db);
    
    // Update view counts for returned results
    if (paginatedResults.length > 0) {
      await db.run(`
        UPDATE content 
        SET search_appearance_count = COALESCE(search_appearance_count, 0) + 1
        WHERE id IN (${paginatedResults.map(() => '?').join(',')})
      `, ...paginatedResults.map(r => r.id));
    }
    
    return NextResponse.json({
      query,
      total: scoredResults.length,
      results: paginatedResults,
      suggestions,
      relatedSearches,
      relatedContent,
      pagination: {
        offset,
        limit,
        hasMore: offset + limit < scoredResults.length
      }
    });
    
  } catch (error) {
    console.error('Smart search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

// Helper function for fuzzy matching
function extractSimilarWords(text: string, term: string): string[] {
  const words = text.split(/\s+/);
  const similar: string[] = [];
  
  words.forEach(word => {
    if (word.length >= term.length - 1 && word.length <= term.length + 1) {
      const distance = levenshteinDistance(word, term);
      if (distance <= 2 && distance > 0) {
        similar.push(word);
      }
    }
  });
  
  return [...new Set(similar)];
}

// Simple Levenshtein distance implementation
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

async function generateSearchSuggestions(
  query: string, 
  results: SearchResult[], 
  db: any
): Promise<SearchSuggestion[]> {
  const suggestions: SearchSuggestion[] = [];
  
  // 1. Completion suggestions based on popular searches
  const popularSearches = await db.all(`
    SELECT query, COUNT(*) as count
    FROM search_history
    WHERE query LIKE ?
    GROUP BY query
    ORDER BY count DESC
    LIMIT 5
  `, query + '%');
  
  popularSearches.forEach((search: any) => {
    if (search.query !== query) {
      suggestions.push({
        query: search.query,
        type: 'completion',
        confidence: Math.min(search.count / 10, 1)
      });
    }
  });
  
  // 2. Related topic suggestions based on results
  if (results.length > 0) {
    const topResults = results.slice(0, 5);
    const commonTerms = extractCommonTerms(topResults);
    
    commonTerms.slice(0, 3).forEach(term => {
      if (!query.toLowerCase().includes(term.toLowerCase())) {
        suggestions.push({
          query: `${query} ${term}`,
          type: 'related',
          confidence: 0.7
        });
      }
    });
  }
  
  // 3. Correction suggestions for potential typos
  if (results.length === 0) {
    const corrections = await findPossibleCorrections(query, db);
    corrections.forEach(correction => {
      suggestions.push({
        query: correction,
        type: 'correction',
        confidence: 0.8
      });
    });
  }
  
  return suggestions.slice(0, 5);
}

function extractCommonTerms(results: SearchResult[]): string[] {
  const termFrequency: { [key: string]: number } = {};
  
  results.forEach(result => {
    const words = result.title.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'with', 'from'].includes(word)) {
        termFrequency[word] = (termFrequency[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(termFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);
}

async function findPossibleCorrections(query: string, db: any): Promise<string[]> {
  // Get all unique words from titles
  const titles = await db.all(`
    SELECT DISTINCT title FROM content
  `);
  
  const allWords = new Set<string>();
  titles.forEach((item: any) => {
    item.title.toLowerCase().split(/\s+/).forEach((word: string) => {
      if (word.length > 3) allWords.add(word);
    });
  });
  
  // Find words with low edit distance
  const corrections: string[] = [];
  const queryWords = query.toLowerCase().split(/\s+/);
  
  queryWords.forEach(queryWord => {
    allWords.forEach(word => {
      const distance = levenshteinDistance(queryWord, word);
      if (distance === 1 || (distance === 2 && queryWord.length > 5)) {
        corrections.push(query.replace(new RegExp(queryWord, 'i'), word));
      }
    });
  });
  
  return [...new Set(corrections)].slice(0, 3);
}

async function getRelatedSearches(query: string, db: any): Promise<string[]> {
  // Find searches that often follow this query
  const relatedSearches = await db.all(`
    SELECT sh2.query, COUNT(*) as count
    FROM search_history sh1
    JOIN search_history sh2 ON sh1.user_id = sh2.user_id
    WHERE sh1.query = ?
    AND sh2.query != ?
    AND sh2.timestamp > sh1.timestamp
    AND sh2.timestamp - sh1.timestamp < 300000  -- Within 5 minutes
    GROUP BY sh2.query
    ORDER BY count DESC
    LIMIT 5
  `, query, query);
  
  return relatedSearches.map((s: any) => s.query);
}

async function findRelatedContent(results: SearchResult[], db: any): Promise<any[]> {
  if (results.length === 0) return [];
  
  // Find content often viewed together
  const topResultIds = results.slice(0, 3).map(r => r.id);
  
  const related = await db.all(`
    SELECT c.*, COUNT(*) as co_view_count
    FROM content c
    JOIN user_interactions ui1 ON ui1.content_id IN (${topResultIds.map(() => '?').join(',')})
    JOIN user_interactions ui2 ON ui2.user_id = ui1.user_id 
      AND ui2.content_id = c.id
      AND ui2.content_id NOT IN (${topResultIds.map(() => '?').join(',')})
      AND ABS(ui2.timestamp - ui1.timestamp) < 1800000  -- Within 30 minutes
    WHERE ui1.interaction_type = 'view' AND ui2.interaction_type = 'view'
    GROUP BY c.id
    ORDER BY co_view_count DESC
    LIMIT 5
  `, ...topResultIds, ...topResultIds);
  
  return related;
}

// Track user interactions
export async function PUT(request: NextRequest) {
  try {
    const { userId, contentId, interactionType, duration } = await request.json();
    
    const db = await getDb();
    
    // Record interaction
    await db.run(`
      INSERT INTO user_interactions (id, user_id, content_id, interaction_type, duration, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `, `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, userId, contentId, interactionType, duration || 0, Date.now());
    
    // Update content view count if viewing
    if (interactionType === 'view') {
      await db.run(`
        UPDATE content 
        SET view_count = COALESCE(view_count, 0) + 1
        WHERE id = ?
      `, contentId);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}