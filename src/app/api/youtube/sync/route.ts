import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { getYouTubeSyncManager } from '@/lib/youtube/youtube-sync-manager';

/**
 * YouTube Sync API Endpoint
 * 
 * Handles triggering different types of YouTube syncs
 */

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const syncType = searchParams.get('type') || 'incremental';
    const channelId = searchParams.get('channelId');
    
    // Get API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API key not configured'
      }, { status: 500 });
    }

    const syncManager = getYouTubeSyncManager(apiKey);
    await syncManager.initialize();

    let result;

    switch (syncType) {
      case 'full':
        console.log('🔄 Starting full sync via API...');
        result = await syncManager.performFullSync();
        break;
      
      case 'incremental':
        console.log('🔄 Starting incremental sync via API...');
        result = await syncManager.performIncrementalSync();
        break;
      
      case 'channel':
        if (!channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID required for channel sync'
          }, { status: 400 });
        }
        console.log(`🔄 Starting channel sync for ${channelId} via API...`);
        result = await syncManager.syncChannel(channelId, 'full');
        break;
      
      case 'transcription':
        console.log('🎤 Starting transcription queue via API...');
        result = await syncManager.queueTranscriptions();
        break;
      
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown sync type: ${syncType}`
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${syncType} sync completed successfully`
    });

  } catch (error) {
    console.error('❌ YouTube sync API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sync failed'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API key not configured'
      }, { status: 500 });
    }

    const syncManager = getYouTubeSyncManager(apiKey);

    switch (action) {
      case 'stats':
        const stats = syncManager.getSyncStats();
        return NextResponse.json({
          success: true,
          data: stats
        });
      
      case 'history':
        const limit = parseInt(searchParams.get('limit') || '10');
        const history = syncManager.getSyncHistory(limit);
        return NextResponse.json({
          success: true,
          data: { history, total: history.length }
        });
      
      case 'status':
        // Check if sync manager is running
        return NextResponse.json({
          success: true,
          data: {
            initialized: true,
            scheduledSyncsEnabled: true,
            apiKeyConfigured: !!apiKey
          }
        });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action. Use: stats, history, status'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube sync status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get sync status'
    }, { status: 500 });
  }
}