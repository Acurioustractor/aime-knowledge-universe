/**
 * Airtable Video Integration System
 * 
 * Integrates video assets from Airtable with the unified video management system
 * Handles Vimeo, YouTube, and direct video URLs from AIME's digital assets
 */

import { UnifiedVideoContent, VideoContentUtils } from './unified-video-schema';
import { unifiedVideoManager } from './unified-video-manager';

export interface AirtableVideoAsset {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  tags: string[];
  size: string;
  usageRestrictions: string;
  dateAdded: string;
  url?: string;
  thumbnailUrl?: string;
  attachments: any[];
  metadata: {
    source: string;
    airtableId: string;
    lastModified: string;
    createdTime: string;
    allFields: Record<string, any>;
  };
}

export interface VideoIntegrationResult {
  total: number;
  processed: number;
  newVideos: number;
  updatedVideos: number;
  errors: string[];
  videosBySource: Record<string, number>;
}

class AirtableVideoIntegration {
  private processedVideos: Set<string> = new Set();

  /**
   * Sync all video assets from Airtable tools API
   */
  async syncAirtableVideos(): Promise<VideoIntegrationResult> {
    console.log('🎬 Starting Airtable video asset sync...');
    
    const startTime = Date.now();
    const result: VideoIntegrationResult = {
      total: 0,
      processed: 0,
      newVideos: 0,
      updatedVideos: 0,
      errors: [],
      videosBySource: {}
    };

    try {
      // Fetch all tools from Airtable
      const response = await fetch('/api/tools?limit=1000');
      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error('Failed to fetch Airtable tools data');
      }

      // Filter for video assets
      const videoAssets = data.data.filter((item: any) => 
        item.fileType === 'Video' && item.url
      ) as AirtableVideoAsset[];

      result.total = videoAssets.length;
      console.log(`📹 Found ${videoAssets.length} video assets in Airtable`);

      // Process each video asset
      for (const asset of videoAssets) {
        try {
          const success = await this.processVideoAsset(asset);
          
          if (success.isNew) {
            result.newVideos++;
          } else if (success.isUpdated) {
            result.updatedVideos++;
          }
          
          result.processed++;
          
          // Track by source platform
          const platform = this.detectVideoPlatform(asset.url!);
          result.videosBySource[platform] = (result.videosBySource[platform] || 0) + 1;
          
        } catch (error) {
          const errorMsg = `Failed to process video ${asset.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error('❌', errorMsg);
          result.errors.push(errorMsg);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Airtable video sync completed in ${duration}ms`);
      console.log(`📊 Results: ${result.newVideos} new, ${result.updatedVideos} updated, ${result.errors.length} errors`);

      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Airtable video sync failed:', errorMsg);
      result.errors.push(errorMsg);
      return result;
    }
  }

  /**
   * Process individual video asset from Airtable
   */
  private async processVideoAsset(asset: AirtableVideoAsset): Promise<{isNew: boolean, isUpdated: boolean}> {
    const videoId = VideoContentUtils.generateVideoId('airtable', asset.id);
    
    // Check if already processed
    if (this.processedVideos.has(videoId)) {
      return { isNew: false, isUpdated: false };
    }

    console.log(`🎥 Processing video: ${asset.title} (${asset.id})`);

    // Detect video platform and extract metadata
    const platform = this.detectVideoPlatform(asset.url!);
    const videoMetadata = await this.extractVideoMetadata(asset.url!, platform);
    
    // Categorize content
    const categorization = VideoContentUtils.categorizeByTitle(asset.title + ' ' + asset.description);
    
    // Map AIME-specific tags and categories
    const aimeMapping = this.mapAimeContent(asset);

    // Create unified video content
    const unifiedVideo: UnifiedVideoContent = {
      id: videoId,
      source: 'airtable',
      sourceId: asset.id,
      sourceUrl: asset.url,
      title: asset.title || 'Untitled Video',
      description: asset.description || '',
      url: asset.url!,
      thumbnailUrl: asset.thumbnailUrl,
      duration: videoMetadata.duration || 'PT0S',
      publishedAt: asset.dateAdded || asset.metadata.createdTime,
      updatedAt: asset.metadata.lastModified,
      contentType: aimeMapping.contentType || categorization.contentType,
      themes: [...new Set([...aimeMapping.themes, ...categorization.themes])],
      programs: [...new Set([...aimeMapping.programs, ...categorization.programs])],
      topics: aimeMapping.topics,
      language: 'en',
      technical: {
        quality: this.assessVideoQuality(asset),
        format: videoMetadata.format || 'unknown'
      },
      access: {
        level: this.determineAccessLevel(asset),
        ageAppropriate: true,
        culturalSensitivity: this.assessCulturalSensitivity(asset)
      },
      analytics: {
        viewCount: videoMetadata.viewCount || 0,
        likeCount: videoMetadata.likeCount || 0,
        commentCount: 0,
        shareCount: 0,
        engagementRate: 0,
        lastAnalyticsUpdate: new Date().toISOString()
      },
      knowledgeConnections: [],
      syncMetadata: {
        lastSynced: new Date().toISOString(),
        syncSource: 'airtable-tools',
        syncVersion: 1,
        needsReview: this.needsReview(asset),
        autoProcessed: true
      }
    };

    // Add IMAGI-NATION TV specific data if applicable
    if (aimeMapping.isImaginationTV) {
      unifiedVideo.imaginationTv = {
        episodeNumber: aimeMapping.episodeNumber,
        segments: [],
        learningObjectives: [],
        ageGroups: ['13-17', '18+'],
        culturalContexts: ['Indigenous', 'Global'],
        followUpActivities: [],
        communityFeatures: {
          allowComments: true,
          allowDiscussion: true,
          moderationRequired: true
        }
      };
    }

    // Check if video already exists
    const { videos: existingVideos } = unifiedVideoManager.getVideos({
      source: 'airtable',
      limit: 1000
    });
    
    const existingVideo = existingVideos.find(v => v.sourceId === asset.id);
    const isNew = !existingVideo;
    const isUpdated = existingVideo && 
      new Date(existingVideo.updatedAt) < new Date(asset.metadata.lastModified);

    // Add to unified video manager
    await unifiedVideoManager.addVideo(unifiedVideo);
    
    this.processedVideos.add(videoId);
    return { isNew, isUpdated };
  }

  /**
   * Detect video platform from URL
   */
  private detectVideoPlatform(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else if (url.includes('imagination.tv')) {
      return 'imagination-tv';
    } else {
      return 'other';
    }
  }

  /**
   * Extract video metadata from URL
   */
  private async extractVideoMetadata(url: string, platform: string): Promise<{
    duration?: string;
    viewCount?: number;
    likeCount?: number;
    format?: string;
  }> {
    // In a real implementation, this would call the respective APIs
    // For now, return defaults
    return {
      duration: 'PT10M0S', // Default 10 minutes
      viewCount: 0,
      likeCount: 0,
      format: platform === 'youtube' ? 'mp4' : 'unknown'
    };
  }

  /**
   * Map AIME-specific content from Airtable tags and fields
   */
  private mapAimeContent(asset: AirtableVideoAsset): {
    contentType: UnifiedVideoContent['contentType'];
    themes: string[];
    programs: string[];
    topics: string[];
    isImaginationTV: boolean;
    episodeNumber?: number;
  } {
    const tags = asset.tags || [];
    const title = asset.title.toLowerCase();
    const description = asset.description.toLowerCase();
    
    let contentType: UnifiedVideoContent['contentType'] = 'educational';
    const themes: string[] = [];
    const programs: string[] = [];
    const topics: string[] = [];
    let isImaginationTV = false;
    let episodeNumber: number | undefined;

    // Content type detection
    if (tags.includes('IMAGI-NATION {TV}') || title.includes('imagi-nation')) {
      contentType = 'educational';
      isImaginationTV = true;
      
      // Extract episode number
      const episodeMatch = title.match(/(\d+)/);
      if (episodeMatch) {
        episodeNumber = parseInt(episodeMatch[1]);
      }
    } else if (tags.includes('{President}') || title.includes('interview')) {
      contentType = 'interview';
    } else if (title.includes('wisdom') || title.includes('teaching')) {
      contentType = 'wisdom-sharing';
    } else if (title.includes('ceremony')) {
      contentType = 'ceremony';
    }

    // Theme detection
    if (title.includes('indigenous') || description.includes('indigenous') || 
        tags.some(tag => tag.toLowerCase().includes('indigenous'))) {
      themes.push('indigenous-wisdom');
    }
    
    if (title.includes('systems') || description.includes('systems')) {
      themes.push('systems-thinking');
    }
    
    if (title.includes('youth') || title.includes('young')) {
      themes.push('youth-leadership');
    }
    
    if (title.includes('mentor') || description.includes('mentor')) {
      themes.push('mentoring');
    }

    // Program detection
    if (tags.includes('IMAGI-NATION {TV}') || isImaginationTV) {
      programs.push('imagi-labs');
    }
    
    if (tags.includes('{President}')) {
      programs.push('presidents');
    }
    
    if (title.includes('joy corps') || description.includes('joy corps')) {
      programs.push('joy-corps');
    }
    
    if (title.includes('custodian') || description.includes('custodian')) {
      programs.push('custodians');
    }

    // Topic extraction from tags
    tags.forEach(tag => {
      if (tag !== 'IMAGI-NATION {TV}' && tag !== '{President}' && tag !== 'Staff Resource') {
        topics.push(tag.toLowerCase().replace(/[{}]/g, ''));
      }
    });

    return {
      contentType,
      themes,
      programs,
      topics,
      isImaginationTV,
      episodeNumber
    };
  }

  /**
   * Assess video quality based on metadata
   */
  private assessVideoQuality(asset: AirtableVideoAsset): 'high' | 'medium' | 'low' {
    // Check size and other indicators
    if (asset.size === 'Large' || asset.thumbnailUrl) {
      return 'high';
    } else if (asset.size === 'Medium') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Determine access level based on tags and content
   */
  private determineAccessLevel(asset: AirtableVideoAsset): UnifiedVideoContent['access']['level'] {
    const tags = asset.tags || [];
    
    if (tags.includes('Staff Resource')) {
      return 'internal';
    } else if (tags.includes('Community')) {
      return 'community';
    } else {
      return 'public';
    }
  }

  /**
   * Assess cultural sensitivity requirements
   */
  private assessCulturalSensitivity(asset: AirtableVideoAsset): UnifiedVideoContent['access']['culturalSensitivity'] {
    const title = asset.title.toLowerCase();
    const description = asset.description.toLowerCase();
    
    if (title.includes('ceremony') || title.includes('sacred') || 
        description.includes('ceremony') || description.includes('sacred')) {
      return 'permission-required';
    } else if (title.includes('indigenous') || description.includes('indigenous')) {
      return 'advisory';
    } else {
      return 'none';
    }
  }

  /**
   * Determine if content needs manual review
   */
  private needsReview(asset: AirtableVideoAsset): boolean {
    // Videos without descriptions or with sensitive content need review
    return !asset.description || 
           asset.description.length < 10 ||
           this.assessCulturalSensitivity(asset) === 'permission-required';
  }

  /**
   * Get sync statistics
   */
  getStats(): {
    totalProcessed: number;
    lastSyncTime: string;
  } {
    return {
      totalProcessed: this.processedVideos.size,
      lastSyncTime: new Date().toISOString()
    };
  }

  /**
   * Reset processing cache
   */
  reset(): void {
    this.processedVideos.clear();
  }
}

// Export singleton instance
export const airtableVideoIntegration = new AirtableVideoIntegration();
export default AirtableVideoIntegration;