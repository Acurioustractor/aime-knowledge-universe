/**
 * YouTube Content Integration
 * 
 * Integrates YouTube videos with the main content storage system
 * for unified search and browse functionality
 */

import { youtubeStorage } from './youtube-storage';
import { contentStorage } from '@/lib/content-storage';
import { getYouTubeSyncManager } from './youtube-sync-manager';

export interface YouTubeIntegrationConfig {
  autoSync: boolean;
  syncIntervalMinutes: number;
  maxVideosToSync: number;
  enableTranscriptionSearch: boolean;
}

class YouTubeContentIntegration {
  private static instance: YouTubeContentIntegration;
  private config: YouTubeIntegrationConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config: Partial<YouTubeIntegrationConfig> = {}) {
    this.config = {
      autoSync: config.autoSync ?? true,
      syncIntervalMinutes: config.syncIntervalMinutes ?? 30,
      maxVideosToSync: config.maxVideosToSync ?? 1000,
      enableTranscriptionSearch: config.enableTranscriptionSearch ?? true
    };
  }

  static getInstance(config?: Partial<YouTubeIntegrationConfig>): YouTubeContentIntegration {
    if (!YouTubeContentIntegration.instance) {
      YouTubeContentIntegration.instance = new YouTubeContentIntegration(config);
    }
    return YouTubeContentIntegration.instance;
  }

  /**
   * Start the integration service
   */
  start(): void {
    if (this.isRunning) {
      console.log('⚠️ YouTube content integration already running');
      return;
    }

    console.log('🚀 Starting YouTube content integration...');
    
    // Perform initial sync
    this.syncYouTubeContent();

    // Set up automatic syncing if enabled
    if (this.config.autoSync) {
      this.syncInterval = setInterval(() => {
        this.syncYouTubeContent();
      }, this.config.syncIntervalMinutes * 60 * 1000);
      
      console.log(`⏰ Auto-sync enabled every ${this.config.syncIntervalMinutes} minutes`);
    }

    this.isRunning = true;
  }

  /**
   * Stop the integration service
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ YouTube content integration not running');
      return;
    }

    console.log('⏹️ Stopping YouTube content integration...');
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.isRunning = false;
    console.log('✅ YouTube content integration stopped');
  }

  /**
   * Manually trigger sync of YouTube content to main content storage
   */
  async syncYouTubeContent(): Promise<{
    success: boolean;
    videosProcessed: number;
    errors: string[];
  }> {
    console.log('🔄 Syncing YouTube content to main content storage...');
    
    try {
      // Get YouTube videos as ContentItems
      const contentItems = youtubeStorage.getContentItems({
        limit: this.config.maxVideosToSync
      });

      if (contentItems.length === 0) {
        console.log('📝 No YouTube videos found to sync');
        return {
          success: true,
          videosProcessed: 0,
          errors: []
        };
      }

      // Enhance content items with YouTube-specific metadata
      const enhancedItems = contentItems.map(item => ({
        ...item,
        // Add YouTube-specific tags for better categorization
        tags: [
          ...(item.tags || []),
          'youtube',
          'video',
          ...(item.metadata?.topics || []),
          ...(item.metadata?.keywords || [])
        ].filter((tag, index, array) => array.indexOf(tag) === index), // Remove duplicates
        
        // Enhance description with transcription if available
        description: this.enhanceDescriptionWithTranscription(item),
        
        // Add search metadata
        searchableContent: this.createSearchableContent(item),
        
        // Add YouTube-specific metadata
        youtubeMetadata: {
          videoId: item.id.replace('youtube-', ''),
          channelTitle: item.metadata?.channelTitle,
          viewCount: item.metadata?.viewCount,
          likeCount: item.metadata?.likeCount,
          duration: item.metadata?.duration,
          hasTranscription: item.metadata?.hasTranscription,
          publishedAt: item.metadata?.publishedAt
        }
      }));

      // Store in main content storage
      contentStorage.storeContent(enhancedItems, 'youtube');

      console.log(`✅ Synced ${enhancedItems.length} YouTube videos to content storage`);
      
      return {
        success: true,
        videosProcessed: enhancedItems.length,
        errors: []
      };

    } catch (error) {
      const errorMessage = `YouTube content sync failed: ${error}`;
      console.error('❌', errorMessage);
      
      return {
        success: false,
        videosProcessed: 0,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Search across YouTube content using enhanced search capabilities
   */
  searchYouTubeContent(query: string, options: {
    limit?: number;
    offset?: number;
    includeTranscriptions?: boolean;
    channelFilter?: string;
    dateFilter?: { after?: string; before?: string };
    durationFilter?: { min?: number; max?: number };
  } = {}): {
    videos: any[];
    total: number;
    suggestions: string[];
    searchMetadata: {
      query: string;
      resultsFromTranscription: number;
      resultsFromMetadata: number;
      searchTime: number;
    };
  } {
    const startTime = Date.now();
    console.log(`🔍 Searching YouTube content for: "${query}"`);

    // First search in YouTube storage for detailed results
    const youtubeResults = youtubeStorage.searchVideos(query, {
      channelId: options.channelFilter,
      limit: options.limit || 20,
      offset: options.offset || 0
    });

    // Also search in main content storage for integrated results
    const contentResults = contentStorage.searchContent(query)
      .filter(item => item.source === 'youtube');

    // Combine and deduplicate results
    const combinedResults = this.deduplicateResults(youtubeResults.videos, contentResults);

    // Apply additional filters
    let filteredResults = combinedResults;

    if (options.dateFilter) {
      filteredResults = filteredResults.filter(video => {
        const publishedDate = new Date(video.publishedAt);
        
        if (options.dateFilter!.after && publishedDate < new Date(options.dateFilter!.after)) {
          return false;
        }
        
        if (options.dateFilter!.before && publishedDate > new Date(options.dateFilter!.before)) {
          return false;
        }
        
        return true;
      });
    }

    if (options.durationFilter) {
      filteredResults = filteredResults.filter(video => {
        const durationSeconds = this.parseDurationToSeconds(video.duration);
        
        if (options.durationFilter!.min && durationSeconds < options.durationFilter!.min) {
          return false;
        }
        
        if (options.durationFilter!.max && durationSeconds > options.durationFilter!.max) {
          return false;
        }
        
        return true;
      });
    }

    // Calculate search metadata
    const resultsWithTranscription = filteredResults.filter(v => 
      v.transcription?.text?.toLowerCase().includes(query.toLowerCase())
    ).length;

    const searchTime = Date.now() - startTime;

    return {
      videos: filteredResults,
      total: filteredResults.length,
      suggestions: youtubeResults.suggestions,
      searchMetadata: {
        query,
        resultsFromTranscription: resultsWithTranscription,
        resultsFromMetadata: filteredResults.length - resultsWithTranscription,
        searchTime
      }
    };
  }

  /**
   * Get YouTube integration statistics
   */
  getIntegrationStats(): {
    isRunning: boolean;
    config: YouTubeIntegrationConfig;
    lastSyncTime: string;
    youtubeVideosInStorage: number;
    youtubeVideosInContent: number;
    syncErrors: string[];
  } {
    const youtubeStats = youtubeStorage.getStats();
    const contentStats = contentStorage.getStats();
    const youtubeContentCount = contentStats.sourceStats['youtube'] || 0;

    return {
      isRunning: this.isRunning,
      config: this.config,
      lastSyncTime: contentStats.lastUpdated || 'Never',
      youtubeVideosInStorage: youtubeStats.totalVideos,
      youtubeVideosInContent: youtubeContentCount,
      syncErrors: []
    };
  }

  /**
   * Initialize YouTube sync and integration
   */
  async initializeYouTubeSync(apiKey: string): Promise<{
    success: boolean;
    message: string;
    stats?: any;
  }> {
    try {
      console.log('🎬 Initializing YouTube sync and integration...');
      
      // Initialize sync manager
      const syncManager = getYouTubeSyncManager(apiKey);
      await syncManager.initialize();
      
      // Perform initial incremental sync to get recent videos
      const syncResult = await syncManager.performIncrementalSync();
      
      // Sync to content storage
      const integrationResult = await this.syncYouTubeContent();
      
      // Start the integration service
      this.start();
      
      const stats = this.getIntegrationStats();
      
      return {
        success: true,
        message: `YouTube integration initialized successfully. Synced ${syncResult.videosAdded} new videos.`,
        stats
      };
      
    } catch (error) {
      console.error('❌ YouTube initialization failed:', error);
      return {
        success: false,
        message: `YouTube initialization failed: ${error}`
      };
    }
  }

  /**
   * Private helper methods
   */
  private enhanceDescriptionWithTranscription(item: any): string {
    let description = item.description || '';
    
    if (this.config.enableTranscriptionSearch && item.metadata?.hasTranscription) {
      // In a real implementation, we would get the actual transcription
      // For now, we'll just indicate that transcription is available
      description += '\n\n[Video includes transcription for enhanced searchability]';
    }
    
    return description;
  }

  private createSearchableContent(item: any): string {
    const searchableParts = [
      item.title,
      item.description,
      ...(item.tags || []),
      ...(item.metadata?.topics || []),
      ...(item.metadata?.keywords || []),
      item.metadata?.channelTitle
    ];
    
    return searchableParts.filter(Boolean).join(' ').toLowerCase();
  }

  private deduplicateResults(youtubeVideos: any[], contentItems: any[]): any[] {
    const videoMap = new Map();
    
    // Add YouTube videos (these are more detailed)
    youtubeVideos.forEach(video => {
      videoMap.set(video.id, video);
    });
    
    // Add content items only if not already present
    contentItems.forEach(item => {
      const videoId = item.id.replace('youtube-', '');
      if (!videoMap.has(videoId)) {
        videoMap.set(videoId, {
          id: videoId,
          title: item.title,
          description: item.description,
          publishedAt: item.metadata?.publishedAt,
          duration: item.metadata?.duration,
          channelTitle: item.metadata?.channelTitle,
          // Add other relevant fields
        });
      }
    });
    
    return Array.from(videoMap.values());
  }

  private parseDurationToSeconds(duration: string): number {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
}

// Export singleton instance
export const youtubeContentIntegration = YouTubeContentIntegration.getInstance();