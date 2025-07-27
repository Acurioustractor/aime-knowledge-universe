/**
 * YouTube API Integration - World Class Implementation
 * 
 * Handles real YouTube API connections, video fetching, metadata extraction,
 * and preparation for transcription services.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  duration: string; // ISO 8601 format (PT4M13S)
  viewCount: string;
  likeCount: string;
  commentCount: string;
  tags: string[];
  categoryId: string;
  defaultLanguage?: string;
  caption: boolean; // Whether captions are available
  channelId: string;
  channelTitle: string;
  statistics: {
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    favoriteCount: number;
    commentCount: number;
  };
  contentDetails: {
    duration: string;
    dimension: string; // 2d or 3d
    definition: string; // hd or sd
    caption: string; // true or false
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: any;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
  };
  // Transcription data (to be populated later)
  transcription?: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    text?: string;
    timestamps?: { start: number; end: number; text: string }[];
    language?: string;
    confidence?: number;
    lastUpdated?: string;
  };
  // Search metadata
  searchMetadata: {
    extractedKeywords: string[];
    topics: string[];
    mentions: string[];
    lastIndexed: string;
  };
  // Sync metadata
  syncMetadata: {
    lastSynced: string;
    syncVersion: number;
    source: 'youtube-api';
    errors?: string[];
  };
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: any;
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings?: {
    channel?: {
      title: string;
      description: string;
      keywords: string;
      unsubscribedTrailer?: string;
    };
    image?: {
      bannerExternalUrl: string;
    };
  };
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: any;
  channelId: string;
  channelTitle: string;
  itemCount: number;
  videos?: string[]; // Video IDs
}

export interface YouTubeSyncResult {
  success: boolean;
  videosProcessed: number;
  videosAdded: number;
  videosUpdated: number;
  errors: string[];
  startTime: string;
  endTime: string;
  duration: number; // milliseconds
  nextPageToken?: string;
  totalResults?: number;
}

export class YouTubeAPI {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all videos from a channel with pagination
   */
  async getChannelVideos(
    channelId: string,
    maxResults: number = 50,
    pageToken?: string
  ): Promise<{ videos: YouTubeVideo[]; nextPageToken?: string; totalResults?: number }> {
    try {
      // First get the channel's uploads playlist
      const channelResponse = await this.makeRequest('/channels', {
        part: 'contentDetails,statistics,brandingSettings,snippet',
        id: channelId
      });

      if (!channelResponse.items?.length) {
        throw new Error(`Channel ${channelId} not found`);
      }

      const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get videos from uploads playlist
      const playlistResponse = await this.makeRequest('/playlistItems', {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: maxResults.toString(),
        pageToken: pageToken || '',
        order: 'date'
      });

      if (!playlistResponse.items?.length) {
        return { videos: [] };
      }

      // Extract video IDs
      const videoIds = playlistResponse.items
        .map((item: any) => item.contentDetails.videoId)
        .filter(Boolean);

      // Get detailed video information
      const videos = await this.getVideoDetails(videoIds);

      return {
        videos,
        nextPageToken: playlistResponse.nextPageToken,
        totalResults: playlistResponse.pageInfo?.totalResults
      };

    } catch (error) {
      console.error('❌ Error fetching channel videos:', error);
      throw error;
    }
  }

  /**
   * Get detailed information for specific videos
   */
  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (!videoIds.length) return [];

    try {
      const response = await this.makeRequest('/videos', {
        part: 'snippet,contentDetails,statistics,status,topicDetails',
        id: videoIds.join(',')
      });

      return response.items?.map((item: any) => this.transformVideoData(item)) || [];

    } catch (error) {
      console.error('❌ Error fetching video details:', error);
      throw error;
    }
  }

  /**
   * Search for videos with query
   */
  async searchVideos(
    query: string,
    channelId?: string,
    maxResults: number = 25,
    pageToken?: string
  ): Promise<{ videos: YouTubeVideo[]; nextPageToken?: string; totalResults?: number }> {
    try {
      const searchParams: any = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order: 'relevance'
      };

      if (channelId) {
        searchParams.channelId = channelId;
      }

      if (pageToken) {
        searchParams.pageToken = pageToken;
      }

      const searchResponse = await this.makeRequest('/search', searchParams);

      if (!searchResponse.items?.length) {
        return { videos: [] };
      }

      // Get video IDs from search results
      const videoIds = searchResponse.items.map((item: any) => item.id.videoId);

      // Get detailed video information
      const videos = await this.getVideoDetails(videoIds);

      return {
        videos,
        nextPageToken: searchResponse.nextPageToken,
        totalResults: searchResponse.pageInfo?.totalResults
      };

    } catch (error) {
      console.error('❌ Error searching videos:', error);
      throw error;
    }
  }

  /**
   * Get channel information
   */
  async getChannelInfo(channelId: string): Promise<YouTubeChannel> {
    try {
      const response = await this.makeRequest('/channels', {
        part: 'snippet,statistics,brandingSettings,contentDetails',
        id: channelId
      });

      if (!response.items?.length) {
        throw new Error(`Channel ${channelId} not found`);
      }

      return this.transformChannelData(response.items[0]);

    } catch (error) {
      console.error('❌ Error fetching channel info:', error);
      throw error;
    }
  }

  /**
   * Get channel playlists
   */
  async getChannelPlaylists(channelId: string, maxResults: number = 25): Promise<YouTubePlaylist[]> {
    try {
      const response = await this.makeRequest('/playlists', {
        part: 'snippet,contentDetails',
        channelId,
        maxResults: maxResults.toString()
      });

      return response.items?.map((item: any) => this.transformPlaylistData(item)) || [];

    } catch (error) {
      console.error('❌ Error fetching playlists:', error);
      throw error;
    }
  }

  /**
   * Check if captions are available for a video
   */
  async getCaptionInfo(videoId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest('/captions', {
        part: 'snippet',
        videoId
      });

      return response.items || [];

    } catch (error) {
      console.error('❌ Error fetching caption info:', error);
      return [];
    }
  }

  /**
   * Make authenticated request to YouTube API
   */
  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Transform YouTube API video data to our format
   */
  private transformVideoData(item: any): YouTubeVideo {
    const now = new Date().toISOString();
    
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount || '0',
      likeCount: item.statistics.likeCount || '0',
      commentCount: item.statistics.commentCount || '0',
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId,
      defaultLanguage: item.snippet.defaultLanguage,
      caption: item.contentDetails.caption === 'true',
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      statistics: {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        dislikeCount: parseInt(item.statistics.dislikeCount || '0'),
        favoriteCount: parseInt(item.statistics.favoriteCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0')
      },
      contentDetails: item.contentDetails,
      snippet: item.snippet,
      searchMetadata: {
        extractedKeywords: this.extractKeywords(item.snippet.title, item.snippet.description, item.snippet.tags),
        topics: this.extractTopics(item.snippet.title, item.snippet.description),
        mentions: this.extractMentions(item.snippet.description),
        lastIndexed: now
      },
      syncMetadata: {
        lastSynced: now,
        syncVersion: 1,
        source: 'youtube-api'
      }
    };
  }

  /**
   * Transform channel data
   */
  private transformChannelData(item: any): YouTubeChannel {
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      customUrl: item.snippet.customUrl,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      statistics: item.statistics,
      brandingSettings: item.brandingSettings
    };
  }

  /**
   * Transform playlist data
   */
  private transformPlaylistData(item: any): YouTubePlaylist {
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      itemCount: item.contentDetails.itemCount
    };
  }

  /**
   * Extract keywords for search indexing
   */
  private extractKeywords(title: string, description: string, tags: string[] = []): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const keywords = new Set<string>();

    // Add existing tags
    tags.forEach(tag => keywords.add(tag.toLowerCase()));

    // Extract common AIME-related terms
    const aimeTerms = [
      'aime', 'mentoring', 'indigenous', 'education', 'university', 'student',
      'youth', 'leadership', 'community', 'cultural', 'bridge', 'pathway',
      'success', 'story', 'impact', 'program', 'hoodie', 'imagination',
      'innovation', 'learning', 'development', 'transformation', 'support'
    ];

    aimeTerms.forEach(term => {
      if (text.includes(term)) {
        keywords.add(term);
      }
    });

    // Extract hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = text.match(hashtagRegex) || [];
    hashtags.forEach(tag => keywords.add(tag.replace('#', '')));

    return Array.from(keywords);
  }

  /**
   * Extract topics from content
   */
  private extractTopics(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const topics = new Set<string>();

    const topicMap = {
      'mentoring': ['mentor', 'mentoring', 'guidance', 'support'],
      'education': ['education', 'learning', 'school', 'university', 'study'],
      'indigenous': ['indigenous', 'aboriginal', 'first nations', 'native'],
      'leadership': ['leadership', 'leader', 'leading', 'management'],
      'culture': ['culture', 'cultural', 'tradition', 'heritage'],
      'youth': ['youth', 'young', 'student', 'teenager'],
      'innovation': ['innovation', 'innovative', 'technology', 'digital'],
      'community': ['community', 'social', 'network', 'connection']
    };

    Object.entries(topicMap).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        topics.add(topic);
      }
    });

    return Array.from(topics);
  }

  /**
   * Extract mentions and organizations
   */
  private extractMentions(text: string): string[] {
    const mentions = new Set<string>();
    
    // Common organization patterns
    const orgPatterns = [
      /university of \w+/gi,
      /\w+ university/gi,
      /\w+ college/gi,
      /\w+ institute/gi,
      /department of \w+/gi
    ];

    orgPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => mentions.add(match.toLowerCase()));
    });

    return Array.from(mentions);
  }

  /**
   * Convert ISO 8601 duration to seconds
   */
  static parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Format duration for display
   */
  static formatDuration(duration: string): string {
    const totalSeconds = YouTubeAPI.parseDuration(duration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}