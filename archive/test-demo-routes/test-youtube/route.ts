import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeVideos } from '@/lib/integrations/youtube';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing YouTube API integration...');
    
    const videos = await fetchYouTubeVideos({ 
      limit: 3, 
      query: 'AIME education mentoring' 
    });
    
    console.log(`✅ YouTube API returned ${videos.length} videos`);
    
    return NextResponse.json({
      success: true,
      count: videos.length,
      videos: videos.map(v => ({
        id: v.id,
        title: v.title,
        source: v.source,
        url: v.url
      }))
    });
    
  } catch (error) {
    console.error('❌ YouTube API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}