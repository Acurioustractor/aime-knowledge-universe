import { NextRequest, NextResponse } from 'next/server';
import { contentPipeline } from '@/lib/aggregation/content-pipeline';

/**
 * API endpoint for content aggregation pipeline
 */

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting content aggregation pipeline...');
    
    const jobId = await contentPipeline.startAggregation();
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Content aggregation started',
      estimatedDuration: '45-60 minutes'
    });
    
  } catch (error) {
    console.error('❌ Aggregation startup failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = contentPipeline.getStatus();
    const readinessReport = contentPipeline.getPhase2ReadinessReport();
    
    return NextResponse.json({
      success: true,
      status,
      readinessReport,
      phase1Complete: readinessReport.phase1Complete
    });
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}