/**
 * Unified Video API Endpoint
 * 
 * Provides unified access to all video content across AIME platform:
 * - YouTube videos
 * - Airtable video assets
 * - IMAGI-NATION TV episodes
 * - Direct uploads
 */

import { NextRequest, NextResponse } from 'next/server';
import { unifiedVideoManager } from '@/lib/video-management/unified-video-manager';
import { UnifiedVideoContent } from '@/lib/video-management/unified-video-schema';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/videos/unified - Get videos with filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const action = searchParams.get('action') || 'list';
    const query = searchParams.get('q') || '';
    const source = searchParams.get('source') || '';
    const contentType = searchParams.get('contentType') || '';
    const themes = searchParams.get('themes')?.split(',').filter(Boolean) || [];
    const programs = searchParams.get('programs')?.split(',').filter(Boolean) || [];
    const hasTranscription = searchParams.get('hasTranscription');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') as any || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    const includeTranscriptions = searchParams.get('includeTranscriptions') === 'true';
    
    console.log('🎬 Unified video API request:', {
      action, query, source, contentType, themes, programs, 
      hasTranscription, limit, offset, sortBy, sortOrder
    });

    switch (action) {
      case 'search':
        if (!query.trim()) {
          return NextResponse.json({
            success: false,
            error: 'Search query is required'
          }, { status: 400 });
        }

        const searchResults = await unifiedVideoManager.searchVideos(query, {
          source: source || undefined,
          contentType: contentType || undefined,
          themes: themes.length > 0 ? themes : undefined,
          programs: programs.length > 0 ? programs : undefined,
          includeTranscriptions,
          limit,
          offset
        });

        return NextResponse.json({
          success: true,
          data: {
            videos: searchResults.videos,
            total: searchResults.total,
            suggestions: searchResults.suggestions,
            query: query
          },
          meta: {
            offset,
            limit,
            hasMore: offset + limit < searchResults.total,
            searchParams: {
              query,
              source,
              contentType,
              themes,
              programs,
              includeTranscriptions
            }
          }
        });

      case 'analytics':
        const analytics = unifiedVideoManager.getAnalytics();
        
        return NextResponse.json({
          success: true,
          data: analytics
        });

      case 'sync':
        // Trigger sync from all sources
        const syncResults = await unifiedVideoManager.syncAllSources();
        
        return NextResponse.json({
          success: true,
          data: {
            syncResults,
            message: 'Sync completed from all sources'
          }
        });

      case 'list':
      default:
        const filterOptions = {
          source: source || undefined,
          contentType: contentType || undefined,
          themes: themes.length > 0 ? themes : undefined,
          programs: programs.length > 0 ? programs : undefined,
          hasTranscription: hasTranscription === 'true' ? true : hasTranscription === 'false' ? false : undefined,
          limit,
          offset,
          sortBy,
          sortOrder
        };

        const { videos, total } = unifiedVideoManager.getVideos(filterOptions);

        return NextResponse.json({
          success: true,
          data: {
            videos,
            total
          },
          meta: {
            offset,
            limit,
            hasMore: offset + limit < total,
            filters: {
              source,
              contentType,
              themes,
              programs,
              hasTranscription,
              sortBy,
              sortOrder
            }
          }
        });
    }

  } catch (error) {
    console.error('❌ Unified videos API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch videos'
    }, { status: 500 });
  }
}

/**
 * POST /api/videos/unified - Add or update video content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, video, videoId, options } = body;

    console.log('🎬 Unified video POST request:', action);

    switch (action) {
      case 'add':
        if (!video) {
          return NextResponse.json({
            success: false,
            error: 'Video data is required'
          }, { status: 400 });
        }

        await unifiedVideoManager.addVideo(video);

        return NextResponse.json({
          success: true,
          data: {
            videoId: video.id,
            message: 'Video added successfully'
          }
        });

      case 'queue-transcription':
        if (!videoId) {
          return NextResponse.json({
            success: false,
            error: 'Video ID is required'
          }, { status: 400 });
        }

        const transcriptionJobId = await unifiedVideoManager.queueTranscription(
          videoId, 
          options?.priority || 'medium'
        );

        return NextResponse.json({
          success: true,
          data: {
            jobId: transcriptionJobId,
            videoId,
            message: 'Transcription job queued successfully'
          }
        });

      case 'bulk-add':
        if (!Array.isArray(body.videos)) {
          return NextResponse.json({
            success: false,
            error: 'Videos array is required'
          }, { status: 400 });
        }

        const addResults = await Promise.allSettled(
          body.videos.map((video: UnifiedVideoContent) => 
            unifiedVideoManager.addVideo(video)
          )
        );

        const successful = addResults.filter(result => result.status === 'fulfilled').length;
        const failed = addResults.filter(result => result.status === 'rejected').length;

        return NextResponse.json({
          success: true,
          data: {
            totalProcessed: body.videos.length,
            successful,
            failed,
            errors: addResults
              .filter(result => result.status === 'rejected')
              .map(result => (result as PromiseRejectedResult).reason?.message || 'Unknown error')
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Unified videos POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, { status: 500 });
  }
}

/**
 * PUT /api/videos/unified - Update video content
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, updates } = body;

    if (!videoId) {
      return NextResponse.json({
        success: false,
        error: 'Video ID is required'
      }, { status: 400 });
    }

    // Get existing video
    const { videos } = unifiedVideoManager.getVideos({
      limit: 1000
    });
    
    const existingVideo = videos.find(v => v.id === videoId);
    if (!existingVideo) {
      return NextResponse.json({
        success: false,
        error: 'Video not found'
      }, { status: 404 });
    }

    // Apply updates
    const updatedVideo: UnifiedVideoContent = {
      ...existingVideo,
      ...updates,
      updatedAt: new Date().toISOString(),
      syncMetadata: {
        ...existingVideo.syncMetadata,
        lastSynced: new Date().toISOString(),
        syncVersion: existingVideo.syncMetadata.syncVersion + 1
      }
    };

    // Update in manager
    await unifiedVideoManager.addVideo(updatedVideo);

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        message: 'Video updated successfully'
      }
    });

  } catch (error) {
    console.error('❌ Unified videos PUT API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update video'
    }, { status: 500 });
  }
}