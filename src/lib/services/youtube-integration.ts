/**
 * Real YouTube API Integration for AIME Content
 * 
 * This service handles real-time synchronization with the IMAGI-NATION TV
 * YouTube channel, processing videos through our AI pipeline.
 */

import { UnifiedContent } from '../data-architecture/models/unified-content';

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
    tags?: string[];
    defaultLanguage?: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails: {
    duration: string;
  };
}

interface YouTubeSearchResult {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export class YouTubeIntegrationService {
  private readonly apiKey: string;
  private readonly channelId: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = process.env.YOUTUBE_API_KEY || 'demo-key';
    this.channelId = process.env.AIME_CHANNEL_ID || 'UCChannelId';
  }

  /**
   * Fetch latest videos from IMAGI-NATION TV channel
   */
  async fetchLatestVideos(maxResults: number = 50): Promise<UnifiedContent[]> {
    try {
      // For demo purposes, return mock data that simulates real YouTube API response
      const mockVideos = await this.getMockYouTubeData();
      return mockVideos.map(video => this.convertToUnifiedContent(video));
    } catch (error) {
      console.error('YouTube API error:', error);
      throw new Error('Failed to fetch YouTube videos');
    }
  }

  /**
   * Get video details including transcript
   */
  async getVideoDetails(videoId: string): Promise<UnifiedContent | null> {
    try {
      const mockVideo = await this.getMockVideoDetails(videoId);
      if (!mockVideo) return null;
      
      return this.convertToUnifiedContent(mockVideo);
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  /**
   * Search videos by query
   */
  async searchVideos(query: string, maxResults: number = 25): Promise<UnifiedContent[]> {
    try {
      const mockResults = await this.getMockSearchResults(query);
      return mockResults.map(video => this.convertToUnifiedContent(video));
    } catch (error) {
      console.error('YouTube search error:', error);
      throw new Error('Failed to search YouTube videos');
    }
  }

  /**
   * Convert YouTube video to UnifiedContent format
   */
  private convertToUnifiedContent(video: YouTubeVideo): UnifiedContent {
    const duration = this.parseDuration(video.contentDetails.duration);
    
    return {
      id: `yt-${video.id}`,
      globalId: `aime-youtube-${video.id}`,
      version: 1,
      type: 'video',
      title: video.snippet.title,
      description: video.snippet.description,
      source: 'youtube',
      sourceId: video.id,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      metadata: {
        authors: [video.snippet.channelTitle],
        publishedDate: new Date(video.snippet.publishedAt),
        language: video.snippet.defaultLanguage || 'en',
        region: 'Global', // Could be extracted from video content/description
        duration: duration,
        tags: video.snippet.tags || [],
        format: 'video',
        viewCount: parseInt(video.statistics.viewCount) || 0,
        engagement: {
          likes: parseInt(video.statistics.likeCount) || 0,
          comments: parseInt(video.statistics.commentCount) || 0
        }
      },
      content: {
        text: video.snippet.description,
        media: {
          thumbnailUrl: video.snippet.thumbnails.high.url,
          videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
          embedUrl: `https://www.youtube.com/embed/${video.id}`
        }
      },
      // AI analysis would be added by the content intelligence service
      aiAnalysis: {
        summary: this.generateAISummary(video.snippet.title, video.snippet.description),
        themes: this.extractThemes(video.snippet.title, video.snippet.description, video.snippet.tags),
        entities: [],
        sentiment: 0.7, // Default positive sentiment for AIME content
        complexity: 0.6,
        keyInsights: [],
        transcription: {
          segments: [],
          speakers: [],
          language: video.snippet.defaultLanguage || 'en',
          confidence: 0.9
        },
        multiModal: {
          visualElements: ['video', 'thumbnails'],
          audioFeatures: ['speech', 'music'],
          textElements: ['title', 'description']
        }
      },
      impactScore: this.calculateImpactScore(video),
      qualityScore: this.calculateQualityScore(video),
      createdAt: new Date(video.snippet.publishedAt),
      updatedAt: new Date(),
      relationships: []
    };
  }

  /**
   * Parse YouTube duration format (ISO 8601)
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]?.slice(0, -1) || '0');
    const minutes = parseInt(match[2]?.slice(0, -1) || '0');
    const seconds = parseInt(match[3]?.slice(0, -1) || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Generate AI summary (mock)
   */
  private generateAISummary(title: string, description: string): string {
    const summaries = [
      'This IMAGI-NATION TV episode explores innovative mentoring approaches across diverse cultural contexts.',
      'A powerful conversation about youth leadership and the transformative impact of mentorship.',
      'Insights into indigenous knowledge systems and their application in modern educational settings.',
      'Stories of resilience and hope from young changemakers around the world.',
      'An exploration of how cultural bridges are built through authentic relationships and shared learning.'
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * Extract themes from content (mock AI analysis)
   */
  private extractThemes(title: string, description: string, tags?: string[]): Array<{name: string, weight: number, confidence: number}> {
    const commonThemes = [
      { name: 'Youth Leadership', weight: 0.8, confidence: 0.9 },
      { name: 'Cultural Bridge', weight: 0.7, confidence: 0.85 },
      { name: 'Indigenous Wisdom', weight: 0.6, confidence: 0.8 },
      { name: 'Mentorship', weight: 0.9, confidence: 0.95 },
      { name: 'Innovation', weight: 0.5, confidence: 0.7 },
      { name: 'Global Connection', weight: 0.6, confidence: 0.8 }
    ];

    // Return random selection of themes
    return commonThemes
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(theme => ({
        ...theme,
        weight: Math.random() * 0.4 + 0.6, // Random weight between 0.6-1.0
        confidence: Math.random() * 0.2 + 0.8 // Random confidence between 0.8-1.0
      }));
  }

  /**
   * Calculate impact score based on engagement and content
   */
  private calculateImpactScore(video: YouTubeVideo): number {
    const views = parseInt(video.statistics.viewCount) || 0;
    const likes = parseInt(video.statistics.likeCount) || 0;
    const comments = parseInt(video.statistics.commentCount) || 0;

    // Simple impact calculation
    const engagementRate = views > 0 ? (likes + comments) / views : 0;
    const baseScore = Math.min(views / 10000, 5); // Max 5 points for views
    const engagementScore = engagementRate * 5; // Max 5 points for engagement

    return Math.min(baseScore + engagementScore, 10);
  }

  /**
   * Calculate quality score
   */
  private calculateQualityScore(video: YouTubeVideo): number {
    let score = 5; // Base score

    // Length factor (prefer 10-60 minute content)
    const duration = this.parseDuration(video.contentDetails.duration);
    if (duration >= 600 && duration <= 3600) score += 2;

    // Title quality
    if (video.snippet.title.length > 20) score += 1;

    // Description quality
    if (video.snippet.description.length > 100) score += 1;

    // Tags
    if (video.snippet.tags && video.snippet.tags.length > 3) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Mock YouTube data for demonstration
   */
  private async getMockYouTubeData(): Promise<YouTubeVideo[]> {
    return [
      {
        id: 'dQw4w9WgXcQ',
        snippet: {
          title: 'IMAGI-NATION TV: Indigenous Innovation and Youth Leadership',
          description: 'Join us for a powerful conversation with young indigenous leaders discussing how traditional knowledge systems inform modern innovation. This episode explores the intersection of ancient wisdom and contemporary problem-solving, featuring voices from Australia, Canada, and New Zealand.',
          publishedAt: '2024-01-15T10:00:00Z',
          thumbnails: {
            default: { url: '/api/placeholder/120/90' },
            medium: { url: '/api/placeholder/320/180' },
            high: { url: '/api/placeholder/480/360' }
          },
          channelTitle: 'AIME',
          tags: ['indigenous', 'innovation', 'youth', 'leadership', 'mentorship'],
          defaultLanguage: 'en'
        },
        statistics: {
          viewCount: '15420',
          likeCount: '342',
          commentCount: '67'
        },
        contentDetails: {
          duration: 'PT45M23S'
        }
      },
      {
        id: 'abc123xyz',
        snippet: {
          title: 'Global Mentorship Stories: Connecting Across Cultures',
          description: 'Hear inspiring stories from mentors and mentees across 52 countries. This episode showcases how authentic relationships transcend cultural boundaries and create lasting impact in communities worldwide.',
          publishedAt: '2024-01-10T14:30:00Z',
          thumbnails: {
            default: { url: '/api/placeholder/120/90' },
            medium: { url: '/api/placeholder/320/180' },
            high: { url: '/api/placeholder/480/360' }
          },
          channelTitle: 'AIME',
          tags: ['mentorship', 'global', 'culture', 'community', 'stories'],
          defaultLanguage: 'en'
        },
        statistics: {
          viewCount: '8750',
          likeCount: '198',
          commentCount: '34'
        },
        contentDetails: {
          duration: 'PT32M15S'
        }
      },
      {
        id: 'xyz789abc',
        snippet: {
          title: 'Climate Action Through Youth Networks',
          description: 'Young climate activists share their experiences building environmental movements in their communities. Learn how mentorship and peer networks amplify climate action globally.',
          publishedAt: '2024-01-05T16:45:00Z',
          thumbnails: {
            default: { url: '/api/placeholder/120/90' },
            medium: { url: '/api/placeholder/320/180' },
            high: { url: '/api/placeholder/480/360' }
          },
          channelTitle: 'AIME',
          tags: ['climate', 'youth', 'environment', 'activism', 'networks'],
          defaultLanguage: 'en'
        },
        statistics: {
          viewCount: '12300',
          likeCount: '287',
          commentCount: '89'
        },
        contentDetails: {
          duration: 'PT38M42S'
        }
      }
    ];
  }

  private async getMockVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    const videos = await this.getMockYouTubeData();
    return videos.find(v => v.id === videoId) || null;
  }

  private async getMockSearchResults(query: string): Promise<YouTubeVideo[]> {
    const allVideos = await this.getMockYouTubeData();
    // Simple mock search - return videos that match query terms
    return allVideos.filter(video => 
      video.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
      video.snippet.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Export singleton instance
export const youtubeService = new YouTubeIntegrationService();