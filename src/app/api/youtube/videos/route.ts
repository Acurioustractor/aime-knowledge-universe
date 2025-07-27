import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { youtubeStorage } from '@/lib/youtube/youtube-storage';

/**
 * YouTube Videos API Endpoint
 * 
 * Provides access to stored YouTube videos with filtering, search, and pagination
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const action = searchParams.get('action') || 'list';
    const channelId = searchParams.get('channelId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') as 'published' | 'views' | 'likes' | 'duration' || 'published';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';
    const hasTranscription = searchParams.get('hasTranscription');
    const publishedAfter = searchParams.get('publishedAfter') || undefined;
    const publishedBefore = searchParams.get('publishedBefore') || undefined;
    const search = searchParams.get('search') || undefined;

    switch (action) {
      case 'search':
        if (!search) {
          return NextResponse.json({
            success: false,
            error: 'Search query required'
          }, { status: 400 });
        }

        const searchResults = youtubeStorage.searchVideos(search, {
          channelId,
          limit,
          offset
        });

        return NextResponse.json({
          success: true,
          data: {
            videos: searchResults.videos,
            total: searchResults.total,
            suggestions: searchResults.suggestions,
            query: search
          },
          meta: {
            offset,
            limit,
            hasMore: offset + limit < searchResults.total
          }
        });

      case 'list':
      default:
        const filterOptions = {
          channelId,
          limit,
          offset,
          sortBy,
          sortOrder,
          hasTranscription: hasTranscription === 'true' ? true : hasTranscription === 'false' ? false : undefined,
          publishedAfter,
          publishedBefore
        };

        const { videos, total } = youtubeStorage.getVideos(filterOptions);

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
              channelId,
              sortBy,
              sortOrder,
              hasTranscription,
              publishedAfter,
              publishedBefore
            }
          }
        });

      case 'stats':
        const stats = youtubeStorage.getStats();
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'content-items':
        // Get videos in ContentItem format for integration with content system
        const contentItems = youtubeStorage.getContentItems({
          channelId,
          limit,
          offset
        });

        return NextResponse.json({
          success: true,
          data: {
            content: contentItems,
            total: contentItems.length
          },
          meta: {
            offset,
            limit,
            format: 'ContentItem'
          }
        });
    }

  } catch (error) {
    console.error('❌ YouTube videos API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch videos'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, videoIds } = body;

    switch (action) {
      case 'update-transcription':
        if (!videoIds || !Array.isArray(videoIds)) {
          return NextResponse.json({
            success: false,
            error: 'Video IDs array required'
          }, { status: 400 });
        }

        // Mark videos for transcription processing
        const { videos } = youtubeStorage.getVideos({ limit: 1000 });
        const videosToUpdate = videos.filter(v => videoIds.includes(v.id));

        videosToUpdate.forEach(video => {
          video.transcription = {
            ...video.transcription,
            status: 'pending',
            lastUpdated: new Date().toISOString()
          };
        });

        if (videosToUpdate.length > 0) {
          // Group by channel for efficient storage
          const videosByChannel = videosToUpdate.reduce((acc, video) => {
            if (!acc[video.channelId]) {
              acc[video.channelId] = [];
            }
            acc[video.channelId].push(video);
            return acc;
          }, {} as Record<string, any[]>);

          Object.entries(videosByChannel).forEach(([channelId, channelVideos]) => {
            youtubeStorage.storeVideos(channelVideos, channelId);
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            videosQueued: videosToUpdate.length,
            message: `${videosToUpdate.length} videos queued for transcription`
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube videos POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, { status: 500 });
  }
}