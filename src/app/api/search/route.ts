/**
 * Unified Search API Route
 * 
 * Week 2: Technical Consolidation - Single search endpoint that replaces:
 * - /api/search/enhanced/route.ts
 * - /api/search/smart/route.ts  
 * - /api/search/semantic/route.ts
 * - /api/unified-search/route.ts
 * 
 * Provides both basic and enhanced search with automatic fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { unifiedSearchEngine, SearchQuery } from '@/lib/search/unified-search';

export const dynamic = 'force-dynamic';

/**
 * GET /api/search - Unified search endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse search parameters
    const searchQuery: SearchQuery = {
      query: searchParams.get('q') || searchParams.get('query') || '',
      searchType: (searchParams.get('type') as 'basic' | 'enhanced') || 'basic',
      contentTypes: searchParams.get('contentTypes')?.split(',').filter(Boolean),
      philosophyDomain: searchParams.get('domain') || searchParams.get('philosophyDomain') || undefined,
      complexityLevel: searchParams.get('complexity') ? parseInt(searchParams.get('complexity')!) : undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sessionId: searchParams.get('sessionId') || undefined
    };

    console.log('🔍 Unified search API called:', {
      query: searchQuery.query,
      type: searchQuery.searchType,
      contentTypes: searchQuery.contentTypes,
      limit: searchQuery.limit
    });

    // Validate query
    if (!searchQuery.query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required',
        results: [],
        total: 0,
        query: '',
        searchType: searchQuery.searchType,
        processingTime: 0
      }, { status: 400 });
    }

    // Perform search
    const searchResponse = await unifiedSearchEngine.search(searchQuery);

    return NextResponse.json(searchResponse);

  } catch (error) {
    console.error('❌ Unified search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      results: [],
      total: 0,
      query: '',
      searchType: 'basic',
      processingTime: 0
    }, { status: 500 });
  }
}

/**
 * POST /api/search - Advanced search operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log(`🔍 Unified search API POST action: ${action}`);

    switch (action) {
      case 'search':
        // Advanced search with full query object
        const searchQuery: SearchQuery = {
          query: data.query || '',
          searchType: data.searchType || 'basic',
          contentTypes: data.contentTypes,
          philosophyDomain: data.philosophyDomain,
          complexityLevel: data.complexityLevel,
          limit: data.limit || 20,
          offset: data.offset || 0,
          sessionId: data.sessionId,
          userContext: data.userContext
        };

        if (!searchQuery.query.trim()) {
          return NextResponse.json({
            success: false,
            error: 'Search query is required'
          }, { status: 400 });
        }

        const searchResponse = await unifiedSearchEngine.search(searchQuery);
        return NextResponse.json(searchResponse);

      case 'suggestions':
        // Get search suggestions for autocomplete
        const { partialQuery, limit } = data;
        
        if (!partialQuery || partialQuery.length < 2) {
          return NextResponse.json({
            success: true,
            suggestions: []
          });
        }

        const suggestions = await unifiedSearchEngine.getSearchSuggestions(
          partialQuery,
          limit || 5
        );

        return NextResponse.json({
          success: true,
          suggestions
        });

      case 'filters':
        // Get available search filters
        const filters = await unifiedSearchEngine.getSearchFilters();

        return NextResponse.json({
          success: true,
          filters
        });

      case 'health':
        // Search system health check
        try {
          // Quick test search
          const testResponse = await unifiedSearchEngine.search({
            query: 'test',
            searchType: 'basic',
            limit: 1
          });

          return NextResponse.json({
            success: true,
            status: 'healthy',
            searchTypes: ['basic', 'enhanced'],
            testQuery: {
              processingTime: testResponse.processingTime,
              resultsFound: testResponse.total > 0
            }
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 503 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: search, suggestions, filters, health'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Unified search API POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Search operation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/search - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}