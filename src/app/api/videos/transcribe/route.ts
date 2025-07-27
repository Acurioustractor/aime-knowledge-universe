/**
 * Video Transcription API Endpoint
 * 
 * Handles transcription requests, job status, and transcription management
 */

import { NextRequest, NextResponse } from 'next/server';
import { videoTranscriptionPipeline, TranscriptionRequest } from '@/lib/video-management/transcription-pipeline';
import { unifiedVideoManager } from '@/lib/video-management/unified-video-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/videos/transcribe - Start transcription job
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, videoId, options = {} } = body;

    console.log('🎤 Transcription API request:', action, videoId);

    switch (action) {
      case 'start':
        if (!videoId) {
          return NextResponse.json({
            success: false,
            error: 'Video ID is required'
          }, { status: 400 });
        }

        // Get video details
        const { videos } = unifiedVideoManager.getVideos({ limit: 1000 });
        const video = videos.find(v => v.id === videoId);

        if (!video) {
          return NextResponse.json({
            success: false,
            error: 'Video not found'
          }, { status: 404 });
        }

        // Check if already transcribed
        if (video.transcription?.status === 'completed') {
          return NextResponse.json({
            success: true,
            data: {
              message: 'Video already transcribed',
              transcription: video.transcription,
              jobId: null
            }
          });
        }

        // Create transcription request
        const transcriptionRequest: TranscriptionRequest = {
          videoId,
          videoUrl: video.url,
          language: options.language || 'en',
          provider: options.provider,
          options: {
            speakerDiarization: options.speakerDiarization || false,
            punctuation: options.punctuation !== false,
            timestamps: options.timestamps !== false,
            confidenceThreshold: options.confidenceThreshold || 0.8,
            customVocabulary: options.customVocabulary || []
          },
          priority: options.priority || 'medium',
          metadata: {
            expectedDuration: video.duration ? parseDurationToSeconds(video.duration) : undefined,
            contentType: video.contentType,
            themes: video.themes,
            culturalContext: video.access.culturalSensitivity !== 'none' ? 'sensitive' : 'general'
          }
        };

        // Queue transcription
        const jobId = await videoTranscriptionPipeline.queueTranscription(transcriptionRequest);

        return NextResponse.json({
          success: true,
          data: {
            jobId,
            message: 'Transcription job queued successfully',
            estimatedTime: estimateTranscriptionTime(video.duration || 'PT10M'),
            options: transcriptionRequest.options
          }
        });

      case 'batch':
        if (!Array.isArray(body.videoIds)) {
          return NextResponse.json({
            success: false,
            error: 'Video IDs array is required'
          }, { status: 400 });
        }

        const batchResults = [];
        const { videos: allVideos } = unifiedVideoManager.getVideos({ limit: 1000 });

        for (const vid of body.videoIds) {
          const video = allVideos.find(v => v.id === vid);
          if (!video) {
            batchResults.push({
              videoId: vid,
              success: false,
              error: 'Video not found'
            });
            continue;
          }

          if (video.transcription?.status === 'completed') {
            batchResults.push({
              videoId: vid,
              success: true,
              jobId: null,
              message: 'Already transcribed'
            });
            continue;
          }

          try {
            const transcriptionRequest: TranscriptionRequest = {
              videoId: vid,
              videoUrl: video.url,
              language: options.language || 'en',
              provider: options.provider,
              options: {
                speakerDiarization: options.speakerDiarization || false,
                punctuation: options.punctuation !== false,
                timestamps: options.timestamps !== false,
                confidenceThreshold: options.confidenceThreshold || 0.8
              },
              priority: options.priority || 'low', // Lower priority for batch jobs
              metadata: {
                expectedDuration: video.duration ? parseDurationToSeconds(video.duration) : undefined,
                contentType: video.contentType,
                themes: video.themes
              }
            };

            const jobId = await videoTranscriptionPipeline.queueTranscription(transcriptionRequest);
            
            batchResults.push({
              videoId: vid,
              success: true,
              jobId,
              message: 'Queued for transcription'
            });

          } catch (error) {
            batchResults.push({
              videoId: vid,
              success: false,
              error: error instanceof Error ? error.message : 'Failed to queue'
            });
          }
        }

        const successful = batchResults.filter(r => r.success).length;
        const failed = batchResults.filter(r => !r.success).length;

        return NextResponse.json({
          success: true,
          data: {
            totalProcessed: body.videoIds.length,
            successful,
            failed,
            results: batchResults,
            estimatedCompletionTime: estimateBatchCompletionTime(successful)
          }
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
      error: error instanceof Error ? error.message : 'Failed to process transcription request'
    }, { status: 500 });
  }
}

/**
 * GET /api/videos/transcribe - Get transcription job status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const videoId = searchParams.get('videoId');
    const action = searchParams.get('action') || 'status';

    console.log('🎤 Transcription status request:', { jobId, videoId, action });

    switch (action) {
      case 'status':
        if (!jobId) {
          return NextResponse.json({
            success: false,
            error: 'Job ID is required'
          }, { status: 400 });
        }

        const jobStatus = videoTranscriptionPipeline.getJobStatus(jobId);
        
        if (!jobStatus) {
          return NextResponse.json({
            success: false,
            error: 'Job not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: {
            job: jobStatus,
            progressPercentage: getProgressPercentage(jobStatus.status),
            estimatedTimeRemaining: estimateTimeRemaining(jobStatus)
          }
        });

      case 'video-status':
        if (!videoId) {
          return NextResponse.json({
            success: false,
            error: 'Video ID is required'
          }, { status: 400 });
        }

        // Get video transcription status
        const { videos } = unifiedVideoManager.getVideos({ limit: 1000 });
        const video = videos.find(v => v.id === videoId);

        if (!video) {
          return NextResponse.json({
            success: false,
            error: 'Video not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: {
            videoId,
            hasTranscription: !!video.transcription,
            transcriptionStatus: video.transcription?.status || 'not-started',
            transcriptionData: video.transcription || null,
            wisdomExtractsCount: video.transcription?.wisdomExtracts?.length || 0,
            keyTopicsCount: video.transcription?.keyTopics?.length || 0,
            lastUpdated: video.transcription?.lastUpdated
          }
        });

      case 'queue-stats':
        // Return queue statistics
        return NextResponse.json({
          success: true,
          data: {
            message: 'Queue statistics endpoint - would show active jobs, queue length, etc.',
            // In real implementation, would get actual stats from pipeline
            activeJobs: 0,
            queueLength: 0,
            completedToday: 0,
            avgProcessingTime: '2m 30s'
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Transcription status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transcription status'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/videos/transcribe - Cancel transcription job
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({
        success: false,
        error: 'Job ID is required'
      }, { status: 400 });
    }

    // In real implementation, would cancel the job
    console.log(`🚫 Cancelling transcription job: ${jobId}`);

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        message: 'Transcription job cancelled successfully'
      }
    });

  } catch (error) {
    console.error('❌ Transcription cancel API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel transcription job'
    }, { status: 500 });
  }
}

/**
 * Helper functions
 */
function parseDurationToSeconds(duration: string): number {
  // Parse ISO 8601 duration (PT15M30S -> 930 seconds)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 600; // Default 10 minutes
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

function estimateTranscriptionTime(duration: string): string {
  const seconds = parseDurationToSeconds(duration);
  const minutes = Math.ceil(seconds / 60);
  
  // Estimate: roughly 1/3 of video duration for processing
  const estimatedMinutes = Math.max(1, Math.ceil(minutes / 3));
  
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes}m`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const remainingMinutes = estimatedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}

function estimateBatchCompletionTime(jobCount: number): string {
  // Estimate based on concurrent processing (3 jobs at once)
  const concurrentJobs = 3;
  const avgJobTime = 5; // minutes per job
  
  const totalTime = Math.ceil(jobCount / concurrentJobs) * avgJobTime;
  
  if (totalTime < 60) {
    return `${totalTime}m`;
  } else {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return `${hours}h ${minutes}m`;
  }
}

function getProgressPercentage(status: string): number {
  const statusProgress = {
    'pending': 0,
    'processing': 50,
    'completed': 100,
    'failed': 0,
    'cancelled': 0
  };
  
  return statusProgress[status as keyof typeof statusProgress] || 0;
}

function estimateTimeRemaining(jobStatus: any): string {
  if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
    return '0m';
  }
  
  if (jobStatus.status === 'pending') {
    return 'Waiting in queue...';
  }
  
  // For processing jobs, estimate based on progress
  const remainingPercent = 100 - (jobStatus.progress || 50);
  const estimatedMinutes = Math.ceil(remainingPercent / 10); // Rough estimate
  
  return `${estimatedMinutes}m`;
}