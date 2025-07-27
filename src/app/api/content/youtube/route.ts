import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/lib/services/youtube-integration';

/**
 * GET /api/content/youtube
 * 
 * Fetch YouTube videos from IMAGI-NATION TV channel
 * Query parameters:
 * - maxResults: Number of videos to return (default: 25)
 * - search: Search query for filtering videos
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '25');
    const searchQuery = searchParams.get('search');

    let videos;
    
    if (searchQuery) {
      videos = await youtubeService.searchVideos(searchQuery, maxResults);
    } else {
      videos = await youtubeService.fetchLatestVideos(maxResults);
    }

    return NextResponse.json({
      success: true,
      data: videos,
      metadata: {
        total: videos.length,
        source: 'youtube',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch YouTube content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content/youtube/sync
 * 
 * Trigger manual sync of YouTube content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceRefresh = false } = body;

    // In a real implementation, this would trigger a background job
    // to sync all YouTube content through the AI pipeline
    const videos = await youtubeService.fetchLatestVideos(50);

    // Simulate processing time for AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: 'YouTube sync completed',
      data: {
        processed: videos.length,
        newItems: Math.floor(videos.length * 0.2), // Simulate 20% new content
        updated: Math.floor(videos.length * 0.1),  // Simulate 10% updated content
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('YouTube sync error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync YouTube content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}