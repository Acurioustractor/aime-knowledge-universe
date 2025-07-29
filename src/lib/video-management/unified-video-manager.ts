/**
 * Unified Video Management System
 * 
 * Centralized manager for all video content across AIME platform
 * Handles syncing, processing, and unified access to videos from multiple sources
 */

import { UnifiedVideoContent, VideoChannel, VideoProcessingJob, VideoContentUtils, WisdomExtract, VideoSearchResult } from './unified-video-schema';
import { YouTubeVideo } from '@/lib/youtube/youtube-api';
import { ContentItem } from '@/lib/content-storage';

export interface VideoManagerConfig {
  enableAutoSync: boolean;
  syncIntervalHours: number;
  enableAutoTranscription: boolean;
  enableAutoAnalysis: boolean;
  maxConcurrentJobs: number;
  retentionDays?: number;
}

export interface VideoSyncResult {
  source: string;
  totalProcessed: number;
  newVideos: number;
  updatedVideos: number;
  errors: string[];
  duration: number; // milliseconds
}

export interface VideoAnalyticsData {
  totalVideos: number;
  videosBySource: Record<string, number>;
  videosByContentType: Record<string, number>;
  videosByTheme: Record<string, number>;
  videosWithTranscription: number;
  totalDuration: number; // total seconds across all videos
  averageDuration: number;
  recentActivity: Array<{
    date: string;
    newVideos: number;
    transcriptionsCompleted: number;
  }>;
  topPerformingVideos: Array<{
    id: string;
    title: string;
    viewCount: number;
    engagementRate: number;
  }>;
}

class UnifiedVideoManager {
  private videos: Map<string, UnifiedVideoContent> = new Map();
  private channels: Map<string, VideoChannel> = new Map();
  private processingJobs: Map<string, VideoProcessingJob> = new Map();
  private config: VideoManagerConfig;
  private syncInProgress: boolean = false;

  constructor(config: VideoManagerConfig = {
    enableAutoSync: true,
    syncIntervalHours: 6,
    enableAutoTranscription: true,
    enableAutoAnalysis: true,
    maxConcurrentJobs: 3
  }) {
    this.config = config;
    console.log('🎬 Unified Video Manager initialized');
    this.loadPersistedData();
    this.setupDefaultChannels();
    
    if (config.enableAutoSync) {
      this.startAutoSync();
    }
  }

  /**
   * Add or update video content
   */
  async addVideo(video: UnifiedVideoContent): Promise<void> {
    console.log(`📹 Adding video: ${video.title} (${video.source})`);
    
    // Validate video
    if (!this.validateVideo(video)) {
      throw new Error(`Invalid video data for ${video.id}`);
    }

    // Auto-categorize if themes/programs are empty
    if (video.themes.length === 0 || video.programs.length === 0) {
      const categorization = VideoContentUtils.categorizeByTitle(video.title + ' ' + video.description);
      video.themes = [...video.themes, ...categorization.themes];
      video.programs = [...video.programs, ...categorization.programs];
      video.contentType = categorization.contentType;
    }

    // Store video
    this.videos.set(video.id, video);
    
    // Auto-queue transcription if enabled
    if (this.config.enableAutoTranscription && !video.transcription) {
      await this.queueTranscription(video.id);
    }
    
    // Auto-queue analysis if enabled
    if (this.config.enableAutoAnalysis) {
      await this.queueAnalysis(video.id);
    }

    this.persistData();
    console.log(`✅ Video added: ${video.id}`);
  }

  /**
   * Get videos with filtering and pagination
   */
  getVideos(options: {
    source?: string;
    contentType?: string;
    themes?: string[];
    programs?: string[];
    hasTranscription?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'publishedAt' | 'updatedAt' | 'viewCount' | 'duration' | 'relevance';
    sortOrder?: 'asc' | 'desc';
  } = {}): { videos: UnifiedVideoContent[]; total: number } {
    let filteredVideos = Array.from(this.videos.values());

    // Apply filters
    if (options.source) {
      filteredVideos = filteredVideos.filter(v => v.source === options.source);
    }

    if (options.contentType) {
      filteredVideos = filteredVideos.filter(v => v.contentType === options.contentType);
    }

    if (options.themes && options.themes.length > 0) {
      filteredVideos = filteredVideos.filter(v => 
        options.themes!.some(theme => v.themes.includes(theme))
      );
    }

    if (options.programs && options.programs.length > 0) {
      filteredVideos = filteredVideos.filter(v => 
        options.programs!.some(program => v.programs.includes(program))
      );
    }

    if (options.hasTranscription !== undefined) {
      filteredVideos = filteredVideos.filter(v => 
        options.hasTranscription ? 
        v.transcription?.status === 'completed' : 
        !v.transcription || v.transcription.status !== 'completed'
      );
    }

    // Sort videos
    const sortBy = options.sortBy || 'publishedAt';
    const sortOrder = options.sortOrder || 'desc';
    
    filteredVideos.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'publishedAt':
          aVal = new Date(a.publishedAt).getTime();
          bVal = new Date(b.publishedAt).getTime();
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
          break;
        case 'viewCount':
          aVal = a.analytics.viewCount;
          bVal = b.analytics.viewCount;
          break;
        case 'duration':
          aVal = VideoContentUtils.parseDuration(a.duration || 'PT0S');
          bVal = VideoContentUtils.parseDuration(b.duration || 'PT0S');
          break;
        default:
          aVal = new Date(a.publishedAt).getTime();
          bVal = new Date(b.publishedAt).getTime();
      }

      const result = aVal - bVal;
      return sortOrder === 'desc' ? -result : result;
    });

    const total = filteredVideos.length;
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    
    const paginatedVideos = filteredVideos.slice(offset, offset + limit);

    return { videos: paginatedVideos, total };
  }

  /**
   * Search videos with advanced text matching
   */
  async searchVideos(query: string, options: {
    source?: string;
    contentType?: string;
    themes?: string[];
    programs?: string[];
    includeTranscriptions?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ videos: VideoSearchResult[]; total: number; suggestions: string[] }> {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const videoScores = new Map<string, { score: number; matchedTerms: string[]; matchedSegments: any[] }>();
    
    this.videos.forEach((video, videoId) => {
      let score = 0;
      const matchedTerms: string[] = [];
      const matchedSegments: any[] = [];
      
      searchTerms.forEach(term => {
        // Title matches get highest score
        if (video.title.toLowerCase().includes(term)) {
          score += 10;
          matchedTerms.push(term);
        }
        
        // Description matches get medium score
        if (video.description.toLowerCase().includes(term)) {
          score += 5;
          matchedTerms.push(term);
        }
        
        // Theme/program matches get high score
        if (video.themes.some(theme => theme.includes(term)) || 
            video.programs.some(program => program.includes(term))) {
          score += 8;
          matchedTerms.push(term);
        }
        
        // Topic matches get medium score
        if (video.topics.some(topic => topic.toLowerCase().includes(term))) {
          score += 6;
          matchedTerms.push(term);
        }
        
        // Transcription matches (if available and enabled)
        if (options.includeTranscriptions && video.transcription?.text) {
          const transcriptionLower = video.transcription.text.toLowerCase();
          if (transcriptionLower.includes(term)) {
            score += 3;
            matchedTerms.push(term);
            
            // Find specific segments with timestamps
            if (video.transcription.timestamps) {
              video.transcription.timestamps.forEach(timestamp => {
                if (timestamp.text.toLowerCase().includes(term)) {
                  matchedSegments.push({
                    timestamp: timestamp.time,
                    duration: 10, // Assume 10-second segments
                    content: timestamp.text,
                    relevance: 0.7
                  });
                }
              });
            }
          }
        }
      });
      
      if (score > 0) {
        videoScores.set(videoId, { 
          score, 
          matchedTerms: [...new Set(matchedTerms)], 
          matchedSegments 
        });
      }
    });

    // Get videos sorted by relevance score
    const sortedVideoIds = Array.from(videoScores.entries())
      .sort(([,a], [,b]) => b.score - a.score)
      .map(([videoId]) => videoId);

    let matchingVideos = sortedVideoIds
      .map(videoId => {
        const video = this.videos.get(videoId);
        const searchData = videoScores.get(videoId);
        
        if (!video || !searchData) return null;
        
        return {
          ...video,
          relevanceScore: searchData.score,
          matchedTerms: searchData.matchedTerms,
          matchedSegments: searchData.matchedSegments
        } as VideoSearchResult;
      })
      .filter((video): video is VideoSearchResult => video !== null);

    // Apply additional filters
    if (options.source) {
      matchingVideos = matchingVideos.filter(v => v.source === options.source);
    }
    
    if (options.contentType) {
      matchingVideos = matchingVideos.filter(v => v.contentType === options.contentType);
    }
    
    if (options.themes && options.themes.length > 0) {
      matchingVideos = matchingVideos.filter(v => 
        options.themes!.some(theme => v.themes.includes(theme))
      );
    }
    
    if (options.programs && options.programs.length > 0) {
      matchingVideos = matchingVideos.filter(v => 
        options.programs!.some(program => v.programs.includes(program))
      );
    }

    const total = matchingVideos.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    
    const paginatedVideos = matchingVideos.slice(offset, offset + limit);
    
    // Generate search suggestions
    const suggestions = this.generateSearchSuggestions(query);

    return { videos: paginatedVideos, total, suggestions };
  }

  /**
   * Sync videos from all configured sources
   */
  async syncAllSources(): Promise<VideoSyncResult[]> {
    if (this.syncInProgress) {
      throw new Error('Sync already in progress');
    }

    this.syncInProgress = true;
    console.log('🔄 Starting sync from all video sources...');
    
    const results: VideoSyncResult[] = [];
    
    try {
      // Sync YouTube channels
      const youtubeChannels = Array.from(this.channels.values())
        .filter(channel => channel.platform === 'youtube' && channel.syncEnabled);
      
      for (const channel of youtubeChannels) {
        try {
          const result = await this.syncYouTubeChannel(channel);
          results.push(result);
        } catch (error) {
          console.error(`❌ Failed to sync YouTube channel ${channel.name}:`, error);
          results.push({
            source: `youtube-${channel.id}`,
            totalProcessed: 0,
            newVideos: 0,
            updatedVideos: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            duration: 0
          });
        }
      }
      
      // Sync Airtable videos
      try {
        const airtableResult = await this.syncAirtableVideos();
        results.push(airtableResult);
      } catch (error) {
        console.error('❌ Failed to sync Airtable videos:', error);
        results.push({
          source: 'airtable',
          totalProcessed: 0,
          newVideos: 0,
          updatedVideos: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          duration: 0
        });
      }
      
      console.log(`✅ Sync completed. Total results: ${results.length}`);
      return results;
      
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Queue transcription job for a video
   */
  async queueTranscription(videoId: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    const video = this.videos.get(videoId);
    if (!video) {
      throw new Error(`Video not found: ${videoId}`);
    }

    // Import transcription pipeline dynamically to avoid circular dependencies
    const { videoTranscriptionPipeline } = await import('./transcription-pipeline');
    
    // Create transcription request
    const transcriptionRequest = {
      videoId,
      videoUrl: video.url,
      language: video.language || 'en',
      options: {
        speakerDiarization: true,
        punctuation: true,
        timestamps: true,
        confidenceThreshold: 0.8
      },
      priority,
      metadata: {
        expectedDuration: video.duration ? this.parseDurationToSeconds(video.duration) : undefined,
        contentType: video.contentType,
        themes: video.themes,
        culturalContext: video.access.culturalSensitivity !== 'none' ? 'sensitive' : 'general'
      }
    };

    const jobId = await videoTranscriptionPipeline.queueTranscription(transcriptionRequest);
    console.log(`📝 Queued transcription job: ${jobId} for video: ${video.title}`);
    
    return jobId;
  }

  /**
   * Get analytics data for the video collection
   */
  getAnalytics(): VideoAnalyticsData {
    const videos = Array.from(this.videos.values());
    
    const analytics: VideoAnalyticsData = {
      totalVideos: videos.length,
      videosBySource: {},
      videosByContentType: {},
      videosByTheme: {},
      videosWithTranscription: 0,
      totalDuration: 0,
      averageDuration: 0,
      recentActivity: [],
      topPerformingVideos: []
    };

    // Calculate statistics
    videos.forEach(video => {
      // By source
      analytics.videosBySource[video.source] = (analytics.videosBySource[video.source] || 0) + 1;
      
      // By content type
      analytics.videosByContentType[video.contentType] = (analytics.videosByContentType[video.contentType] || 0) + 1;
      
      // By themes
      video.themes.forEach(theme => {
        analytics.videosByTheme[theme] = (analytics.videosByTheme[theme] || 0) + 1;
      });
      
      // Transcription count
      if (video.transcription?.status === 'completed') {
        analytics.videosWithTranscription++;
      }
      
      // Duration
      const duration = VideoContentUtils.parseDuration(video.duration || 'PT0S');
      analytics.totalDuration += duration;
    });

    analytics.averageDuration = videos.length > 0 ? analytics.totalDuration / videos.length : 0;

    // Top performing videos
    analytics.topPerformingVideos = videos
      .sort((a, b) => b.analytics.viewCount - a.analytics.viewCount)
      .slice(0, 10)
      .map(video => ({
        id: video.id,
        title: video.title,
        viewCount: video.analytics.viewCount,
        engagementRate: video.analytics.engagementRate || 0
      }));

    return analytics;
  }

  /**
   * Private helper methods
   */
  private async syncYouTubeChannel(channel: VideoChannel): Promise<VideoSyncResult> {
    const startTime = Date.now();
    console.log(`📺 Syncing YouTube channel: ${channel.name}`);
    
    // This would integrate with the YouTube API
    // For now, return mock result
    return {
      source: `youtube-${channel.id}`,
      totalProcessed: 0,
      newVideos: 0,
      updatedVideos: 0,
      errors: [],
      duration: Date.now() - startTime
    };
  }

  private async syncAirtableVideos(): Promise<VideoSyncResult> {
    const startTime = Date.now();
    console.log('📁 Syncing Airtable videos...');
    
    // This would integrate with the Airtable API
    // For now, return mock result
    return {
      source: 'airtable',
      totalProcessed: 0,
      newVideos: 0,
      updatedVideos: 0,
      errors: [],
      duration: Date.now() - startTime
    };
  }

  private async processTranscriptionJob(jobId: string): Promise<void> {
    const job = this.processingJobs.get(jobId);
    if (!job) return;

    console.log(`🎤 Processing transcription job: ${jobId}`);
    
    // Update job status
    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    job.progress = 0;
    
    // Simulate transcription processing
    const video = this.videos.get(job.videoId);
    if (video) {
      // Mock transcription result
      video.transcription = {
        text: `Transcription for: ${video.title}. This is where the actual transcribed content would appear.`,
        language: 'en',
        confidence: 0.95,
        keyTopics: video.themes,
        wisdomExtracts: [],
        status: 'completed',
        provider: 'google',
        lastUpdated: new Date().toISOString()
      };
      
      this.videos.set(video.id, video);
    }
    
    // Complete job
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    job.progress = 100;
    
    console.log(`✅ Transcription completed for job: ${jobId}`);
  }

  private async queueAnalysis(videoId: string): Promise<string> {
    // Implementation for analysis queuing
    console.log(`🔍 Queuing analysis for video: ${videoId}`);
    return `analysis-${videoId}-${Date.now()}`;
  }

  private validateVideo(video: UnifiedVideoContent): boolean {
    return !!(
      video.id &&
      video.source &&
      video.sourceId &&
      video.title &&
      video.url &&
      VideoContentUtils.isValidVideoUrl(video.url)
    );
  }

  private generateSearchSuggestions(query: string): string[] {
    const allThemes = new Set<string>();
    const allPrograms = new Set<string>();
    const allTopics = new Set<string>();

    this.videos.forEach(video => {
      video.themes.forEach(theme => allThemes.add(theme));
      video.programs.forEach(program => allPrograms.add(program));
      video.topics.forEach(topic => allTopics.add(topic));
    });

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Find related terms
    [...allThemes, ...allPrograms, ...allTopics].forEach(term => {
      if (term.includes(queryLower) && term !== queryLower) {
        suggestions.push(term);
      }
    });

    return suggestions.slice(0, 5);
  }

  private setupDefaultChannels(): void {
    // Add default AIME channels
    if (!this.channels.has('aime-main')) {
      this.addChannel({
        id: 'aime-main',
        name: 'AIME Main Channel',
        platform: 'youtube',
        platformChannelId: process.env.YOUTUBE_CHANNEL_ID || 'UCYourChannelId',
        isAimeOfficial: true,
        contentType: 'educational',
        syncEnabled: true,
        videoCount: 0,
        config: {
          autoTranscribe: true,
          autoAnalyze: true,
          defaultAccessLevel: 'public',
          defaultThemes: ['indigenous-wisdom', 'mentoring'],
          moderationRequired: false
        }
      });
    }

    if (!this.channels.has('imagination-tv')) {
      this.addChannel({
        id: 'imagination-tv',
        name: 'IMAGI-NATION TV',
        platform: 'youtube',
        platformChannelId: process.env.IMAGINATION_TV_CHANNEL_ID || 'UCImaginationTVChannelId',
        isAimeOfficial: true,
        contentType: 'entertainment',
        syncEnabled: true,
        videoCount: 0,
        config: {
          autoTranscribe: true,
          autoAnalyze: true,
          defaultAccessLevel: 'public',
          defaultThemes: ['imagination', 'youth-leadership'],
          moderationRequired: false
        }
      });
    }
  }

  private addChannel(channel: VideoChannel): void {
    this.channels.set(channel.id, channel);
    console.log(`📺 Added channel: ${channel.name}`);
  }

  private startAutoSync(): void {
    const intervalMs = this.config.syncIntervalHours * 60 * 60 * 1000;
    setInterval(() => {
      console.log('🔄 Starting scheduled auto-sync...');
      this.syncAllSources().catch(error => {
        console.error('❌ Auto-sync failed:', error);
      });
    }, intervalMs);
  }

  private persistData(): void {
    // In a real implementation, this would save to database
    console.log('💾 Video data persisted');
  }

  private loadPersistedData(): void {
    // In a real implementation, this would load from database
    console.log('📂 Loading persisted video data');
  }

  private parseDurationToSeconds(duration: string): number {
    // Parse ISO 8601 duration (PT15M30S -> 930 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 600; // Default 10 minutes
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
}

// Export singleton instance
export const unifiedVideoManager = new UnifiedVideoManager();
export default UnifiedVideoManager;