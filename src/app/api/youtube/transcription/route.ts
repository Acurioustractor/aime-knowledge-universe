import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { transcriptionManager } from '@/lib/youtube/transcription-manager';

/**
 * YouTube Transcription API Endpoint
 * 
 * Manages video transcription queueing, processing, and retrieval
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, videoIds, options } = body;

    switch (action) {
      case 'queue':
        if (!videoIds || !Array.isArray(videoIds)) {
          return NextResponse.json({
            success: false,
            error: 'Video IDs array required'
          }, { status: 400 });
        }

        const queueResult = await transcriptionManager.queueVideosForTranscription(videoIds, options || {});
        
        return NextResponse.json({
          success: true,
          data: queueResult,
          message: `${queueResult.queued} videos queued for transcription`
        });

      case 'search':
        const { query } = body;
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Search query required'
          }, { status: 400 });
        }

        const searchResults = transcriptionManager.searchTranscriptions(query);
        
        return NextResponse.json({
          success: true,
          data: {
            results: searchResults,
            total: searchResults.length,
            query
          },
          message: `Found ${searchResults.length} transcription matches for "${query}"`
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Transcription API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Transcription operation failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';
    const jobId = searchParams.get('jobId');
    const videoId = searchParams.get('videoId');
    const status = searchParams.get('status') as any;

    switch (action) {
      case 'stats':
        const stats = transcriptionManager.getTranscriptionStats();
        
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'job':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            error: 'Job ID required'
          }, { status: 400 });
        }

        const job = transcriptionManager.getJob(jobId);
        if (!job) {
          return NextResponse.json({
            success: false,
            error: 'Job not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: { job }
        });

      case 'jobs':
        const jobs = transcriptionManager.getAllJobs(status);
        
        return NextResponse.json({
          success: true,
          data: {
            jobs,
            total: jobs.length,
            filter: status || 'all'
          }
        });

      case 'result':
        if (!videoId) {
          return NextResponse.json({
            success: false,
            error: 'Video ID required'
          }, { status: 400 });
        }

        const result = transcriptionManager.getTranscriptionResult(videoId);
        if (!result) {
          return NextResponse.json({
            success: false,
            error: 'Transcription result not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: { result }
        });

      case 'dashboard':
        const dashboardStats = transcriptionManager.getTranscriptionStats();
        const recentJobs = transcriptionManager.getAllJobs().slice(-10);
        
        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalJobs: dashboardStats.totalJobs,
              completedJobs: dashboardStats.completedJobs,
              pendingJobs: dashboardStats.pendingJobs,
              processingJobs: dashboardStats.processingJobs,
              failedJobs: dashboardStats.failedJobs,
              successRate: dashboardStats.successRate,
              avgProcessingTime: dashboardStats.avgProcessingTime
            },
            activity: {
              recentJobs: recentJobs.map(job => ({
                id: job.id,
                videoId: job.videoId,
                status: job.status,
                provider: job.provider,
                createdAt: job.createdAt,
                progress: job.progress
              })),
              queueLength: dashboardStats.queueLength
            },
            breakdown: {
              providers: dashboardStats.providerStats,
              languages: dashboardStats.languageStats
            },
            performance: {
              videosWithTranscription: dashboardStats.totalVideosWithTranscription,
              avgProcessingTime: dashboardStats.avgProcessingTime,
              successRate: dashboardStats.successRate
            }
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Transcription GET API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transcription data'
    }, { status: 500 });
  }
}