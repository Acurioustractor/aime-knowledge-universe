/**
 * AIME Knowledge Archive - YouTube Data API Integration
 * 
 * Professional YouTube integration for IMAGI-NATION TV content
 */

import { ContentItem, FetchOptions } from './index';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  duration: string;
  viewCount: string;
  channelTitle: string;
  tags?: string[];
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface YouTubeSearchOptions {
  query?: string;
  channelId?: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  publishedAfter?: string;
  publishedBefore?: string;
}

/**
 * Fetch YouTube videos by search query or channel - Uses direct API
 */
export async function fetchYouTubeVideos(options: FetchOptions = {}): Promise<ContentItem[]> {
  try {
    console.log(`📺 Fetching YouTube videos from direct API...`);
    
    // Use direct API approach since integration API doesn't exist
    return await fetchYouTubeVideosDirectAPI(options);

  } catch (error) {
    console.error('❌ YouTube API error:', error);
    console.error('❌ Error details:', error);
    
    // Return empty array if API fails
    return [];
  }
}

/**
 * Fallback: Direct YouTube API search (original implementation)
 */
async function fetchYouTubeVideosDirectAPI(options: FetchOptions = {}): Promise<ContentItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey || apiKey === 'your_youtube_api_key_here') {
    console.error('❌ YouTube API key not configured - cannot fetch videos');
    throw new Error('YouTube API key required but not configured');
  }

  try {
    const {
      query = 'AIME mentoring education',
      limit = 25,
    } = options;

    const baseUrl = 'https://www.googleapis.com/youtube/v3';
    
    console.log(`📺 Fallback: Fetching YouTube videos with query: "${query}"`);
    
    // Build search parameters
    const searchParams = new URLSearchParams({
      part: 'snippet',
      maxResults: limit.toString(),
      order: 'relevance',
      type: 'video',
      q: query,
      key: apiKey
    });

    // Search for videos
    const searchResponse = await fetch(`${baseUrl}/search?${searchParams}`);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`❌ YouTube search failed: ${searchResponse.status} - ${errorText}`);
      throw new Error(`YouTube search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      console.log('📺 No YouTube videos found for query');
      return [];
    }

    // Get video IDs for detailed information
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Fetch detailed video information
    const detailsParams = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
      key: apiKey
    });

    const detailsResponse = await fetch(`${baseUrl}/videos?${detailsParams}`);
    
    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error(`❌ YouTube details fetch failed: ${detailsResponse.status} - ${errorText}`);
      throw new Error(`YouTube details fetch failed: ${detailsResponse.status}`);
    }

    const detailsData = await detailsResponse.json();

    // Transform to our format
    const videos: YouTubeVideo[] = detailsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      channelTitle: item.snippet.channelTitle,
      tags: item.snippet.tags,
      statistics: {
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0'
      }
    }));

    console.log(`📺 Successfully fetched ${videos.length} YouTube videos from direct API`);
    return transformYouTubeToContent(videos);

  } catch (error) {
    console.error('❌ YouTube API error:', error);
    throw error;
  }
}

/**
 * Transform YouTube videos to unified ContentItem format
 */
export function transformYouTubeToContent(videos: YouTubeVideo[]): ContentItem[] {
  return videos.map(video => ({
    id: `youtube-${video.id}`,
    title: video.title,
    description: video.description.substring(0, 300) + (video.description.length > 300 ? '...' : ''),
    type: 'video',
    source: 'youtube',
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: video.thumbnails?.medium?.url || video.thumbnails?.default?.url || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
    date: video.publishedAt,
    tags: video.tags || [],
    categories: ['Video', 'Educational Content'],
    metadata: {
      videoId: video.id,
      channelTitle: video.channelTitle,
      publishedDate: video.publishedAt,
      duration: video.duration,
      viewCount: parseInt(video.statistics.viewCount || '0'),
      likeCount: parseInt(video.statistics.likeCount || '0'),
      commentCount: parseInt(video.statistics.commentCount || '0'),
      thumbnails: video.thumbnails,
      platform: 'YouTube'
    }
  }));
}

/**
 * Fetches a single video by ID from YouTube API
 */
export async function fetchYouTubeVideoById(id: string): Promise<ContentItem | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey || apiKey === 'your_youtube_api_key_here') {
    console.error('❌ YouTube API key not configured - cannot fetch video');
    throw new Error('YouTube API key required but not configured');
  }

  try {
    const baseUrl = 'https://www.googleapis.com/youtube/v3';
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: id,
      key: apiKey
    });

    console.log(`📺 Fetching YouTube video by ID: ${id}`);

    const response = await fetch(`${baseUrl}/videos?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ YouTube video fetch failed: ${response.status} - ${errorText}`);
      throw new Error(`YouTube video fetch failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log(`📺 No YouTube video found with ID: ${id}`);
      return null;
    }

    const item = data.items[0];
    const video: YouTubeVideo = {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      channelTitle: item.snippet.channelTitle,
      tags: item.snippet.tags,
      statistics: {
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0'
      }
    };

    const transformed = transformYouTubeToContent([video]);
    console.log(`📺 Successfully fetched YouTube video: ${video.title}`);
    return transformed[0] || null;

  } catch (error) {
    console.error(`❌ Error fetching YouTube video ${id}:`, error);
    throw error;
  }
}

