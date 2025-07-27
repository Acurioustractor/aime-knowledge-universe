import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeVideos } from '@/lib/integrations/youtube';

/**
 * GET /api/admin/youtube/channels
 * Fetch videos from multiple AIME-related channels and searches
 */
export async function GET() {
  try {
    console.log('📺 Fetching comprehensive AIME YouTube content...');
    
    const searchQueries = [
      'AIME mentoring education indigenous Australia',
      'IMAGI-NATION TV episodes',
      'Jack Manning Bancroft',
      'hoodie economics',
      'indigenous education programs Australia',
      'AIME imagination curriculum',
      'mentoring indigenous youth',
      'education transformation Australia'
    ];
    
    const allVideos = [];
    
    for (const query of searchQueries) {
      try {
        console.log(`🔍 Searching: "${query}"`);
        const videos = await fetchYouTubeVideos({ 
          query, 
          limit: 10 
        });
        
        allVideos.push(...videos);
        console.log(`✅ Found ${videos.length} videos for "${query}"`);
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.warn(`⚠️ Search failed for "${query}":`, error);
      }
    }
    
    // Remove duplicates by video ID
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );
    
    console.log(`📺 Total unique AIME videos found: ${uniqueVideos.length}`);
    
    return NextResponse.json({
      success: true,
      totalVideos: uniqueVideos.length,
      searchQueries: searchQueries.length,
      videos: uniqueVideos.slice(0, 20).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description.substring(0, 150) + '...',
        url: video.url,
        metadata: {
          viewCount: video.metadata?.viewCount,
          duration: video.metadata?.duration,
          channelTitle: video.metadata?.channelTitle
        }
      }))
    });
    
  } catch (error) {
    console.error('❌ YouTube channel fetch failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}