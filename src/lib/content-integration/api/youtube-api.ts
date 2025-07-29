/**
 * YouTube API Integration
 * 
 * This module provides functions to fetch content from YouTube.
 */

import { ContentItem, RawContent } from '../models/content-item';
import axios from 'axios';

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch videos from a YouTube channel or playlist
 * 
 * @param channelId YouTube channel ID
 * @param playlistId YouTube playlist ID
 * @param maxResults Maximum number of results to return
 * @returns Promise<ContentItem[]> Array of content items
 */
export async function fetchYouTubeVideos(
  channelId?: string,
  playlistId?: string,
  maxResults: number = 50
): Promise<ContentItem[]> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found. Using mock data instead.');
      return [];
    }

    let videoIds: string[] = [];

    // If playlistId is provided, fetch videos from the playlist
    if (playlistId) {
      const playlistResponse = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId,
          maxResults,
          key: YOUTUBE_API_KEY
        }
      });

      videoIds = playlistResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);
    }
    // If channelId is provided, fetch uploads from the channel
    else if (channelId) {
      // First, get the uploads playlist ID for the channel
      const channelResponse = await axios.get(`${YOUTUBE_API_URL}/channels`, {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: YOUTUBE_API_KEY
        }
      });

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Then, get the videos from the uploads playlist
      const uploadsResponse = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults,
          key: YOUTUBE_API_KEY
        }
      });

      videoIds = uploadsResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);
    }

    // If no videos were found, return an empty array
    if (videoIds.length === 0) {
      return [];
    }

    // Fetch video details for all videos
    const videoResponse = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY
      }
    });

    // Convert YouTube API response to ContentItem array
    return videoResponse.data.items.map((item: any) => normalizeYouTubeVideo(item));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

/**
 * Normalize a YouTube video to a ContentItem
 * 
 * @param video YouTube video object
 * @returns ContentItem
 */
function normalizeYouTubeVideo(video: RawContent): ContentItem {
  const snippet = video.snippet;
  const statistics = video.statistics;
  
  // Extract tags from video
  const tags = snippet.tags || [];
  
  // Extract themes from video description
  const themes = extractThemesFromDescription(snippet.description);
  
  // Extract topics from video description
  const topics = extractTopicsFromDescription(snippet.description);
  
  return {
    id: `youtube-${video.id}`,
    title: snippet.title,
    description: snippet.description,
    contentType: 'video',
    source: 'youtube',
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
    date: snippet.publishedAt,
    authors: [snippet.channelTitle],
    tags,
    themes,
    topics,
    metadata: {
      videoId: video.id,
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      duration: video.contentDetails?.duration,
      viewCount: statistics?.viewCount,
      likeCount: statistics?.likeCount,
      commentCount: statistics?.commentCount
    }
  };
}

/**
 * Extract themes from video description
 * 
 * @param description Video description
 * @returns Array of themes
 */
function extractThemesFromDescription(description: string): { id: string; name: string; relevance: number }[] {
  // This is a simple implementation that looks for hashtags in the description
  // In a real implementation, you would use a more sophisticated approach
  const hashtags = description.match(/#(\w+)/g) || [];
  
  return hashtags.map(hashtag => {
    const name = hashtag.substring(1); // Remove the # character
    return {
      id: `theme-${name.toLowerCase()}`,
      name,
      relevance: 70 // Default relevance
    };
  });
}

/**
 * Extract topics from video description
 * 
 * @param description Video description
 * @returns Array of topics
 */
function extractTopicsFromDescription(description: string): { id: string; name: string; keywords?: string[] }[] {
  // This is a simple implementation that looks for keywords in the description
  // In a real implementation, you would use a more sophisticated approach
  const keywords = [
    'education', 'learning', 'teaching', 'school', 'classroom',
    'innovation', 'technology', 'future', 'development',
    'community', 'collaboration', 'partnership',
    'research', 'analysis', 'findings', 'data',
    'implementation', 'toolkit', 'guide', 'resource'
  ];
  
  const foundKeywords = keywords.filter(keyword => 
    description.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return foundKeywords.map(keyword => ({
    id: `topic-${keyword.toLowerCase()}`,
    name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
    keywords: [keyword]
  }));
}

/**
 * Search YouTube videos
 * 
 * @param query Search query
 * @param maxResults Maximum number of results to return
 * @returns Promise<ContentItem[]> Array of content items
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10
): Promise<ContentItem[]> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found. Using mock data instead.');
      return [];
    }

    const searchResponse = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);

    // If no videos were found, return an empty array
    if (videoIds.length === 0) {
      return [];
    }

    // Fetch video details for all videos
    const videoResponse = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY
      }
    });

    // Convert YouTube API response to ContentItem array
    return videoResponse.data.items.map((item: any) => normalizeYouTubeVideo(item));
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
}