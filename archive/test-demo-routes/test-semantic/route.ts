/**
 * Test Semantic Search API Route
 * 
 * Test endpoint for the new semantic search engine implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { unifiedSearchInterface } from '@/lib/search/search-interface';
import { semanticSearchEngine } from '@/lib/search/semantic-search';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      searchType = 'semantic',
      philosophyDomain,
      contentTypes,
      complexityLevel,
      sessionId,
      testMode = false
    } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing semantic search: "${query}"`);

    if (testMode) {
      // Direct test of semantic search engine
      const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
        philosophyDomain,
        complexityLevel,
        limit: 100
      });

      const searchQuery = {
        query,
        searchType: searchType as any,
        philosophyDomain,
        contentTypes,
        complexityLevel,
        useEmbeddings: true,
        similarityThreshold: 0.6
      };

      const directResults = await semanticSearchEngine.search(searchQuery, contentResult.items);

      return NextResponse.json({
        success: true,
        mode: 'direct',
        data: {
          ...directResults,
          contentCount: contentResult.items.length,
          testQuery: searchQuery
        }
      });
    } else {
      // Test through unified search interface
      const searchOptions = {
        query,
        searchType: searchType as any,
        philosophyDomain,
        contentTypes,
        complexityLevel,
        sessionId: sessionId || `test-${Date.now()}`,
        limit: 20
      };

      const unifiedResults = await unifiedSearchInterface.search(searchOptions);

      return NextResponse.json({
        success: true,
        mode: 'unified',
        data: {
          ...unifiedResults,
          testOptions: searchOptions
        }
      });
    }

  } catch (error) {
    console.error('Semantic search test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Search test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testType = searchParams.get('test') || 'basic';

    switch (testType) {
      case 'embeddings':
        // Test embeddings service availability
        const { embeddingsService } = await import('@/lib/search/embeddings-service');
        const isAvailable = await embeddingsService.isAvailable();
        const modelInfo = embeddingsService.getModelInfo();

        return NextResponse.json({
          success: true,
          test: 'embeddings',
          data: {
            available: isAvailable,
            modelInfo,
            hasApiKey: !!process.env.OPENAI_API_KEY
          }
        });

      case 'content':
        // Test content retrieval
        const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
          limit: 10
        });

        return NextResponse.json({
          success: true,
          test: 'content',
          data: {
            totalItems: contentResult.total,
            sampleItems: contentResult.items.slice(0, 3).map(item => ({
              id: item.id,
              title: item.title,
              content_type: item.content_type,
              philosophy_domain: item.philosophy_domain,
              key_concepts: item.key_concepts,
              quality_score: item.quality_score
            }))
          }
        });

      case 'philosophy':
        // Test philosophy primers
        const primers = await enhancedContentRepository.getAllPhilosophyPrimers();

        return NextResponse.json({
          success: true,
          test: 'philosophy',
          data: {
            primersCount: primers.length,
            domains: primers.map(p => p.domain)
          }
        });

      default:
        // Basic system test
        return NextResponse.json({
          success: true,
          test: 'basic',
          data: {
            timestamp: new Date().toISOString(),
            environment: {
              hasOpenAI: !!process.env.OPENAI_API_KEY,
              hasSupabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
            },
            availableTests: ['embeddings', 'content', 'philosophy']
          }
        });
    }

  } catch (error) {
    console.error('Semantic search system test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'System test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}