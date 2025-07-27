import { NextResponse } from 'next/server';
import axios from 'axios';
import { unifiedVideoManager } from '@/lib/video-management/unified-video-manager';
import { UnifiedVideoContent, VideoContentUtils } from '@/lib/video-management/unified-video-schema';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Enhanced YouTube API integration with unified video management
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    let query = searchParams.get('q') || '';
    const channelFilter = searchParams.get('channel') || '';
    const useUnified = searchParams.get('unified') === 'true';
    
    console.log('🎥 YouTube API request:', { limit, page, query, channelFilter, useUnified });
    
    // If using unified system, return from video manager
    if (useUnified) {
      const { videos, total } = unifiedVideoManager.getVideos({
        source: 'youtube',
        limit,
        offset: (page - 1) * limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      
      return NextResponse.json({
        success: true,
        videos: videos.map(video => ({
          id: video.sourceId,
          title: video.title,
          description: video.description,
          publishedAt: video.publishedAt,
          thumbnail: video.thumbnailUrl,
          url: video.url,
          duration: video.duration,
          tags: video.themes,
          categories: video.programs,
          viewCount: video.analytics.viewCount,
          hasTranscription: video.transcription?.status === 'completed'
        })),
        pageInfo: {
          totalResults: total,
          resultsPerPage: limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit)
        },
        source: 'unified-video-manager'
      });
    }
    
    // Check if we have a YouTube API key
    if (!process.env.YOUTUBE_API_KEY) {
      console.log('⚠️ YouTube API key not configured, returning mock data');
      return getMockYouTubeData(limit, page, query);
    }
    
    // Get channel ID from environment or use default
    let channelId = channelFilter || process.env.YOUTUBE_CHANNEL_ID || process.env.IMAGINATION_TV_CHANNEL_ID;
    
    // If using @aimementoring handle, try to search for their videos directly
    if (query === '@aimementoring' || channelFilter === '@aimementoring') {
      console.log('🎯 Searching for @aimementoring videos directly');
      query = 'AIME mentoring indigenous education Jack Manning Bancroft';
      channelId = null; // Search across all channels
    }
    
    if (!channelId && !query) {
      console.log('⚠️ No valid YouTube channel ID or search query configured');
      return getMockYouTubeData(limit, page, 'AIME');
    }
    
    // Construct the YouTube API URL
    let youtubeApiUrl: string;
    
    if (query && !channelId) {
      // Search for videos across all channels
      youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&order=relevance&type=video&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`;
    } else if (query && channelId) {
      // Search for videos with query within specific channel
      youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit}&order=relevance&type=video&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`;
    } else {
      // Get latest videos from channel
      youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`;
    }
    
    console.log('🔗 Calling YouTube API:', youtubeApiUrl.replace(process.env.YOUTUBE_API_KEY!, '[API_KEY]'));
    
    const response = await axios.get(youtubeApiUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'AIME-Knowledge-System/1.0'
      }
    });
    
    console.log(`✅ YouTube API response: ${response.data.items?.length || 0} videos`);
    
    // Get video details for duration and statistics
    const videoIds = response.data.items?.map((item: any) => item.id.videoId).join(',');
    let videoDetails: any = {};
    
    if (videoIds) {
      try {
        const detailsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`,
          { timeout: 10000 }
        );
        
        detailsResponse.data.items?.forEach((video: any) => {
          videoDetails[video.id] = {
            duration: video.contentDetails.duration,
            viewCount: parseInt(video.statistics.viewCount || '0'),
            likeCount: parseInt(video.statistics.likeCount || '0'),
            commentCount: parseInt(video.statistics.commentCount || '0')
          };
        });
      } catch (detailsError) {
        console.warn('⚠️ Failed to fetch video details:', detailsError);
      }
    }
    
    // Transform the response to unified format and store in video manager
    const videos = await Promise.all(response.data.items?.map(async (item: any) => {
      const videoId = item.id.videoId;
      const details = videoDetails[videoId] || {};
      const categorization = VideoContentUtils.categorizeByTitle(item.snippet.title);
      
      const unifiedVideo: UnifiedVideoContent = {
        id: VideoContentUtils.generateVideoId('youtube', videoId),
        source: 'youtube',
        sourceId: videoId,
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        title: item.snippet.title,
        description: item.snippet.description || '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        duration: details.duration || 'PT0S',
        publishedAt: item.snippet.publishedAt,
        updatedAt: new Date().toISOString(),
        contentType: categorization.contentType,
        themes: categorization.themes,
        programs: categorization.programs,
        topics: [],
        language: 'en',
        technical: {
          quality: 'high',
          format: 'mp4'
        },
        access: {
          level: 'public',
          ageAppropriate: true,
          culturalSensitivity: 'none'
        },
        analytics: {
          viewCount: details.viewCount || 0,
          likeCount: details.likeCount || 0,
          commentCount: details.commentCount || 0,
          shareCount: 0,
          engagementRate: details.viewCount > 0 ? (details.likeCount + details.commentCount) / details.viewCount : 0,
          lastAnalyticsUpdate: new Date().toISOString()
        },
        knowledgeConnections: [],
        syncMetadata: {
          lastSynced: new Date().toISOString(),
          syncSource: 'youtube-api',
          syncVersion: 1,
          needsReview: false,
          autoProcessed: true
        }
      };
      
      // Store in unified video manager
      try {
        await unifiedVideoManager.addVideo(unifiedVideo);
      } catch (error) {
        console.warn(`⚠️ Failed to add video to unified manager: ${videoId}`, error);
      }
      
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.medium?.url,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: details.duration,
        tags: categorization.themes,
        categories: categorization.programs,
        viewCount: details.viewCount || 0,
        likeCount: details.likeCount || 0,
        channelTitle: item.snippet.channelTitle,
        hasTranscription: false // Will be updated when transcription is processed
      };
    }) || []);
    
    return NextResponse.json({
      success: true,
      videos,
      pageInfo: {
        totalResults: response.data.pageInfo?.totalResults || videos.length,
        resultsPerPage: response.data.pageInfo?.resultsPerPage || limit,
        currentPage: page,
        totalPages: Math.ceil((response.data.pageInfo?.totalResults || videos.length) / limit)
      },
      source: 'youtube-api',
      channelId,
      query: query || null
    });
    
  } catch (error: any) {
    console.error('❌ YouTube API error:', error.response?.data || error.message);
    
    // Return mock data as fallback
    console.log('⚠️ YouTube API failed, returning mock data');
    return getMockYouTubeData(limit, page, query);
  }
}

/**
 * Returns mock YouTube data for development/fallback
 */
function getMockYouTubeData(limit: number, page: number, query: string) {
  console.log('📺 Returning mock YouTube data');
  
  // Enhanced mock data with AIME-relevant content
  const allMockVideos = [
    {
      id: 'aime-indigenous-1',
      title: 'Indigenous Systems Thinking: Seven Generation Perspective',
      description: 'Exploring Indigenous approaches to long-term thinking and sustainable decision-making for future generations.',
      publishedAt: '2024-12-01T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/YE7VzlLtp-4/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=aime-indigenous-1',
      duration: 'PT15M30S',
      tags: ['indigenous-wisdom', 'systems-thinking', 'sustainability'],
      categories: ['mentoring', 'imagi-labs'],
      viewCount: 15420,
      likeCount: 890,
      channelTitle: 'AIME',
      hasTranscription: true
    },
    {
      id: 'aime-hoodie-economics',
      title: 'Hoodie Economics: Rethinking Value and Community Wealth',
      description: 'Jack Manning Bancroft explains the revolutionary economic model that prioritizes relationships and community over individual profit.',
      publishedAt: '2024-11-15T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/Mq4Nk5BWJIQ/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=aime-hoodie-economics',
      duration: 'PT22M45S',
      tags: ['hoodie-economics', 'alternative-economics', 'community'],
      categories: ['joy-corps', 'custodians'],
      viewCount: 28350,
      likeCount: 1245,
      channelTitle: 'AIME',
      hasTranscription: true
    },
    {
      id: 'aime-youth-mentoring',
      title: 'Youth Leadership Through Imaginative Mentoring',
      description: 'Discover how AIME\'s mentoring methodology unlocks potential and builds bridges between communities.',
      publishedAt: '2024-10-20T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/Ks-_Mh1QhMc/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=aime-youth-mentoring',
      duration: 'PT18M12S',
      tags: ['youth-leadership', 'mentoring', 'education'],
      categories: ['mentoring', 'citizens'],
      viewCount: 19780,
      likeCount: 756,
      channelTitle: 'AIME',
      hasTranscription: false
    },
    {
      id: 'imagi-nation-tv-1',
      title: 'IMAGI-NATION TV Episode 1: Welcome to the Movement',
      description: 'The first episode of IMAGI-NATION TV, introducing viewers to a new way of thinking about education and systems change.',
      publishedAt: '2024-09-01T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/imagi-1/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=imagi-nation-tv-1',
      duration: 'PT25M18S',
      tags: ['imagination', 'systems-change', 'education'],
      categories: ['imagi-labs'],
      viewCount: 45230,
      likeCount: 2134,
      channelTitle: 'IMAGI-NATION TV',
      hasTranscription: true
    },
    {
      id: 'joy-corps-transformation',
      title: 'Joy Corps: Transforming Organizations Through Relational Economics',
      description: 'See how organizations are implementing Joy Corps methodology to create more human-centered workplaces.',
      publishedAt: '2024-08-15T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/joy-corps/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=joy-corps-transformation',
      duration: 'PT20M05S',
      tags: ['joy-corps', 'transformation', 'workplace'],
      categories: ['joy-corps'],
      viewCount: 12890,
      likeCount: 567,
      channelTitle: 'AIME',
      hasTranscription: false
    },
    {
      id: 'custodians-wisdom',
      title: 'Custodians: Governing the Network of Change',
      description: 'Understanding the role of Custodians in maintaining and nurturing the global AIME network.',
      publishedAt: '2024-07-30T14:00:00Z',
      thumbnail: 'https://img.youtube.com/vi/custodians/mqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=custodians-wisdom',
      duration: 'PT16M42S',
      tags: ['custodians', 'governance', 'network'],
      categories: ['custodians'],
      viewCount: 8750,
      likeCount: 423,
      channelTitle: 'AIME',
      hasTranscription: true
    }
  ];
  
  // Filter by query if provided
  let filteredVideos = allMockVideos;
  if (query) {
    const queryLower = query.toLowerCase();
    filteredVideos = allMockVideos.filter(video => 
      video.title.toLowerCase().includes(queryLower) ||
      video.description.toLowerCase().includes(queryLower) ||
      video.tags.some(tag => tag.includes(queryLower)) ||
      video.categories.some(cat => cat.includes(queryLower))
    );
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + limit);
  
  return NextResponse.json({
    success: true,
    videos: paginatedVideos,
    pageInfo: {
      totalResults: filteredVideos.length,
      resultsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(filteredVideos.length / limit)
    },
    source: 'mock-data',
    _notice: 'Using enhanced mock data - Configure YouTube API for real data'
  });
}