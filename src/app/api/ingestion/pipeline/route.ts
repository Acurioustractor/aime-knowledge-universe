import { NextRequest, NextResponse } from 'next/server';
import { ContentIngestionPipeline } from '@/lib/ingestion/pipeline';

/**
 * POST /api/ingestion/pipeline
 * Trigger comprehensive content ingestion pipeline
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting comprehensive content ingestion pipeline...');
    
    const body = await request.json();
    const { sources, processors, options } = body;
    
    const pipeline = new ContentIngestionPipeline();
    
    // Process all sources (sources parameter can be used for filtering later)
    const results = await pipeline.processAllSources();
    
    console.log(`✅ Pipeline completed: ${results.length} items processed`);
    
    return NextResponse.json({
      success: true,
      message: 'Content ingestion pipeline completed',
      results: {
        totalProcessed: results.length,
        successful: results.filter(r => r.status === 'completed').length,
        failed: results.filter(r => r.status === 'failed').length,
        sources: pipeline.getStats(),
        items: results.slice(0, 10) // Return first 10 items as preview
      }
    });
    
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Pipeline execution failed'
    }, { status: 500 });
  }
}

/**
 * GET /api/ingestion/pipeline
 * Get pipeline status and statistics
 */
export async function GET() {
  try {
    const pipeline = new ContentIngestionPipeline();
    const stats = pipeline.getStats();
    
    return NextResponse.json({
      success: true,
      stats,
      availableSources: [
        'youtube-main',
        'spotify-podcasts', 
        'airtable-assets'
      ],
      availableProcessors: [
        'transcript',
        'ai-analysis',
        'theme-extraction',
        'quality-scoring',
        'connection-mapping'
      ]
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get pipeline stats'
    }, { status: 500 });
  }
}