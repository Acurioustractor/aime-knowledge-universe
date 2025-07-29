import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { youtubeStorage, YouTubeChannelConfig } from '@/lib/youtube/youtube-storage';
import { getYouTubeSyncManager } from '@/lib/youtube/youtube-sync-manager';

/**
 * YouTube Channels API Endpoint
 * 
 * Manages YouTube channel configurations and information
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list':
        const channels = youtubeStorage.getChannels();
        return NextResponse.json({
          success: true,
          data: {
            channels,
            total: channels.length
          }
        });

      case 'info':
        if (!channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID required'
          }, { status: 400 });
        }

        const channel = youtubeStorage.getChannel(channelId);
        if (!channel) {
          return NextResponse.json({
            success: false,
            error: 'Channel not found'
          }, { status: 404 });
        }

        // Get video count and stats for this channel
        const { total: videoCount } = youtubeStorage.getVideos({ channelId });
        const { videos: recentVideos } = youtubeStorage.getVideos({ 
          channelId, 
          limit: 5, 
          sortBy: 'published' 
        });

        return NextResponse.json({
          success: true,
          data: {
            channel,
            videoCount,
            recentVideos,
            lastActivity: recentVideos[0]?.publishedAt || 'Unknown'
          }
        });

      case 'discover':
        // This would use the YouTube API to discover channel information
        if (!channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID required for discovery'
          }, { status: 400 });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
          return NextResponse.json({
            success: false,
            error: 'YouTube API key not configured'
          }, { status: 500 });
        }

        const syncManager = getYouTubeSyncManager(apiKey);
        await syncManager.initialize();

        try {
          // This would call the YouTube API to get channel information
          // For now, return a placeholder response
          return NextResponse.json({
            success: true,
            data: {
              channelId,
              title: 'Discovered Channel',
              description: 'Channel discovered via YouTube API',
              subscriberCount: 'Unknown',
              videoCount: 'Unknown',
              thumbnails: {},
              canAdd: true
            }
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: `Failed to discover channel: ${error}`
          }, { status: 400 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube channels API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch channels'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, channelData } = body;

    switch (action) {
      case 'add':
        if (!channelData || !channelData.channelId || !channelData.channelName) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID and name required'
          }, { status: 400 });
        }

        // Check if channel already exists
        const existingChannel = youtubeStorage.getChannel(channelData.channelId);
        if (existingChannel) {
          return NextResponse.json({
            success: false,
            error: 'Channel already exists'
          }, { status: 409 });
        }

        const newChannel: YouTubeChannelConfig = {
          channelId: channelData.channelId,
          channelName: channelData.channelName,
          enabled: channelData.enabled ?? true,
          syncPriority: channelData.syncPriority || 'medium',
          videoCount: 0,
          syncErrors: []
        };

        youtubeStorage.addChannel(newChannel);

        return NextResponse.json({
          success: true,
          data: {
            channel: newChannel,
            message: 'Channel added successfully'
          }
        });

      case 'update':
        if (!channelData || !channelData.channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID required'
          }, { status: 400 });
        }

        const channelToUpdate = youtubeStorage.getChannel(channelData.channelId);
        if (!channelToUpdate) {
          return NextResponse.json({
            success: false,
            error: 'Channel not found'
          }, { status: 404 });
        }

        // Update channel configuration
        const updatedChannel: YouTubeChannelConfig = {
          ...channelToUpdate,
          ...channelData,
          channelId: channelToUpdate.channelId // Prevent changing the ID
        };

        youtubeStorage.addChannel(updatedChannel);

        return NextResponse.json({
          success: true,
          data: {
            channel: updatedChannel,
            message: 'Channel updated successfully'
          }
        });

      case 'sync':
        if (!channelData || !channelData.channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID required'
          }, { status: 400 });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
          return NextResponse.json({
            success: false,
            error: 'YouTube API key not configured'
          }, { status: 500 });
        }

        const syncManager = getYouTubeSyncManager(apiKey);
        await syncManager.initialize();

        const syncType = channelData.syncType || 'incremental';
        const syncResult = await syncManager.syncChannel(channelData.channelId, syncType);

        return NextResponse.json({
          success: true,
          data: {
            syncResult,
            message: `Channel sync completed: ${syncResult.videosAdded} videos added, ${syncResult.videosUpdated} updated`
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube channels POST API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json({
        success: false,
        error: 'Channel ID required'
      }, { status: 400 });
    }

    const channel = youtubeStorage.getChannel(channelId);
    if (!channel) {
      return NextResponse.json({
        success: false,
        error: 'Channel not found'
      }, { status: 404 });
    }

    // For now, we'll just disable the channel rather than actually deleting it
    // In a real implementation, you might want to also clean up associated videos
    const disabledChannel: YouTubeChannelConfig = {
      ...channel,
      enabled: false
    };

    youtubeStorage.addChannel(disabledChannel);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Channel disabled successfully'
      }
    });

  } catch (error) {
    console.error('❌ YouTube channels DELETE API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete channel'
    }, { status: 500 });
  }
}