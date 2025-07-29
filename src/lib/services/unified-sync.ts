/**
 * Unified Content Sync Service
 * 
 * Coordinates syncing all content sources (videos, newsletters, tools, documents)
 * into the unified database with proper rate limiting and progress tracking.
 */

import { getContentRepository } from '../database/connection';
import { getMailchimpSyncService } from './mailchimp-sync';
import { fetchMailchimpCampaigns } from '../content-integration/api/mailchimp-api';
import axios from 'axios';

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';

interface SyncResult {
  success: boolean;
  source: string;
  synced: number;
  total: number;
  duration: number;
  error?: string;
}

interface UnifiedSyncStatus {
  isRunning: boolean;
  currentStep: string;
  progress: number;
  results: SyncResult[];
  startTime?: number;
  estimatedCompletion?: number;
}

export class UnifiedSyncService {
  private isRunning = false;
  private currentStep = '';
  private progress = 0;
  private results: SyncResult[] = [];
  private startTime?: number;

  /**
   * Sync all content sources to the database
   */
  async syncAllContent(options: {
    includeVideos?: boolean;
    includeNewsletters?: boolean;
    includeTools?: boolean;
    includeDocuments?: boolean;
  } = {}): Promise<{ success: boolean; results: SyncResult[]; totalSynced: number }> {
    if (this.isRunning) {
      throw new Error('Sync already in progress');
    }

    const {
      includeVideos = true,
      includeNewsletters = true,
      includeTools = true,
      includeDocuments = true
    } = options;

    this.isRunning = true;
    this.currentStep = 'Initializing';
    this.progress = 0;
    this.results = [];
    this.startTime = Date.now();

    console.log('🚀 Starting unified content sync...');

    try {
      const repository = await getContentRepository();
      let totalSynced = 0;
      const totalSteps = [includeVideos, includeNewsletters, includeTools, includeDocuments].filter(Boolean).length;
      let completedSteps = 0;

      // 1. Sync Tools from Airtable
      if (includeTools) {
        this.currentStep = 'Syncing Tools from Airtable';
        this.progress = (completedSteps / totalSteps) * 100;
        
        try {
          const toolsResult = await this.syncAirtableTools(repository);
          this.results.push(toolsResult);
          totalSynced += toolsResult.synced;
          completedSteps++;
        } catch (error) {
          console.error('Tools sync failed:', error);
          this.results.push({
            success: false,
            source: 'airtable',
            synced: 0,
            total: 0,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // 2. Sync Videos from YouTube
      if (includeVideos) {
        this.currentStep = 'Syncing Videos from YouTube';
        this.progress = (completedSteps / totalSteps) * 100;
        
        try {
          const videosResult = await this.syncYouTubeVideos(repository);
          this.results.push(videosResult);
          totalSynced += videosResult.synced;
          completedSteps++;
        } catch (error) {
          console.error('Videos sync failed:', error);
          this.results.push({
            success: false,
            source: 'youtube',
            synced: 0,
            total: 0,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // 3. Sync Newsletters from Mailchimp
      if (includeNewsletters) {
        this.currentStep = 'Syncing Newsletters from Mailchimp';
        this.progress = (completedSteps / totalSteps) * 100;
        
        try {
          const newslettersResult = await this.syncMailchimpNewsletters();
          this.results.push(newslettersResult);
          totalSynced += newslettersResult.synced;
          completedSteps++;
        } catch (error) {
          console.error('Newsletters sync failed:', error);
          this.results.push({
            success: false,
            source: 'mailchimp',
            synced: 0,
            total: 0,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // 4. Sync Documents from GitHub
      if (includeDocuments) {
        this.currentStep = 'Syncing Documents from GitHub';
        this.progress = (completedSteps / totalSteps) * 100;
        
        try {
          const documentsResult = await this.syncGitHubDocuments(repository);
          this.results.push(documentsResult);
          totalSynced += documentsResult.synced;
          completedSteps++;
        } catch (error) {
          console.error('Documents sync failed:', error);
          this.results.push({
            success: false,
            source: 'github',
            synced: 0,
            total: 0,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      this.currentStep = 'Completed';
      this.progress = 100;

      const overallSuccess = this.results.some(r => r.success);
      console.log(`✅ Unified sync completed: ${totalSynced} total items synced`);

      return {
        success: overallSuccess,
        results: this.results,
        totalSynced
      };

    } catch (error) {
      console.error('❌ Unified sync failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Sync tools from Airtable
   */
  private async syncAirtableTools(repository: any): Promise<SyncResult> {
    const startTime = Date.now();
    console.log('🛠️ Syncing tools from Airtable...');

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable API credentials not configured');
    }

    try {
      const tools = await this.fetchAirtableTools();
      const synced = await repository.batchUpsertContent(tools, 'airtable');
      
      return {
        success: true,
        source: 'airtable',
        synced,
        total: tools.length,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        source: 'airtable',
        synced: 0,
        total: 0,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Sync videos from YouTube
   */
  private async syncYouTubeVideos(repository: any): Promise<SyncResult> {
    const startTime = Date.now();
    console.log('📺 Syncing videos from YouTube...');

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const videos = await this.fetchYouTubeVideos();
      const synced = await repository.batchUpsertVideos(videos);
      
      return {
        success: true,
        source: 'youtube',
        synced,
        total: videos.length,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        source: 'youtube',
        synced: 0,
        total: 0,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Sync newsletters from Mailchimp
   */
  private async syncMailchimpNewsletters(): Promise<SyncResult> {
    const startTime = Date.now();
    console.log('📧 Syncing newsletters from Mailchimp...');

    try {
      const syncService = getMailchimpSyncService();
      const result = await syncService.syncAllCampaigns();
      
      return {
        success: result.success,
        source: 'mailchimp',
        synced: result.synced,
        total: result.synced, // Mailchimp service doesn't return total
        duration: Date.now() - startTime,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        source: 'mailchimp',
        synced: 0,
        total: 0,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Sync documents from GitHub
   */
  private async syncGitHubDocuments(repository: any): Promise<SyncResult> {
    const startTime = Date.now();
    console.log('📄 Syncing documents from GitHub...');

    try {
      const documents = await this.fetchGitHubDocuments();
      const synced = await repository.batchUpsertContent(documents, 'github');
      
      return {
        success: true,
        source: 'github',
        synced,
        total: documents.length,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        source: 'github',
        synced: 0,
        total: 0,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Fetch tools from Airtable
   */
  private async fetchAirtableTools(): Promise<any[]> {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Tools`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        maxRecords: 1000,
        view: 'Grid view'
      }
    });

    return response.data.records.map((record: any) => ({
      id: `tool-${record.id}`,
      source_id: record.id,
      title: record.fields.Title || 'Untitled Tool',
      description: record.fields.Description || '',
      content_type: 'tool',
      category: record.fields.Category || 'General',
      file_type: record.fields['File Type'] || 'Unknown',
      url: record.fields.URL,
      tool_type: record.fields['Tool Type'],
      usage_restrictions: record.fields['Usage Restrictions'],
      file_size: record.fields['File Size'],
      download_url: record.fields['Download URL'],
      attachments: record.fields.Attachments || [],
      tags: record.fields.Tags || [],
      themes: record.fields.Themes || [],
      topics: record.fields.Topics || [],
      authors: record.fields.Authors || [],
      airtable_record_id: record.id,
      created_at: record.createdTime,
      updated_at: record.createdTime
    }));
  }

  /**
   * Fetch videos from YouTube
   */
  private async fetchYouTubeVideos(): Promise<any[]> {
    // Search for AIME-related content
    const searchQueries = [
      'AIME mentoring education indigenous Australia',
      'IMAGI-NATION TV episodes',
      'Jack Manning Bancroft',
      'hoodie economics',
      'indigenous education programs Australia'
    ];

    const allVideos: any[] = [];

    for (const query of searchQueries) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: YOUTUBE_API_KEY,
            q: query,
            part: 'snippet',
            type: 'video',
            maxResults: 50,
            order: 'relevance'
          }
        });

        const videoIds = response.data.items.map((item: any) => item.id.videoId);
        
        // Get detailed video information
        const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            key: YOUTUBE_API_KEY,
            id: videoIds.join(','),
            part: 'snippet,contentDetails,statistics,status'
          }
        });

        allVideos.push(...detailsResponse.data.items);

        // Add delay to respect rate limits
        await this.delay(1000);
      } catch (error) {
        console.error(`Error fetching videos for query "${query}":`, error);
      }
    }

    // Remove duplicates
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );

    return uniqueVideos;
  }

  /**
   * Fetch documents from GitHub
   */
  private async fetchGitHubDocuments(): Promise<any[]> {
    // This would fetch documents from GitHub repositories
    // For now, return empty array as placeholder
    console.log('📄 GitHub document sync not yet implemented');
    return [];
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): UnifiedSyncStatus {
    return {
      isRunning: this.isRunning,
      currentStep: this.currentStep,
      progress: this.progress,
      results: this.results,
      startTime: this.startTime,
      estimatedCompletion: this.startTime && this.progress > 0 
        ? this.startTime + ((Date.now() - this.startTime) / this.progress * 100)
        : undefined
    };
  }

  /**
   * Get comprehensive database statistics
   */
  async getDatabaseStats(): Promise<any> {
    const repository = await getContentRepository();
    const stats = await repository.getStats();
    const syncStatus = await repository.getSyncStatus();

    return {
      ...stats,
      sync_history: syncStatus,
      last_unified_sync: this.startTime ? new Date(this.startTime).toISOString() : null
    };
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let unifiedSyncService: UnifiedSyncService | null = null;

export function getUnifiedSyncService(): UnifiedSyncService {
  if (!unifiedSyncService) {
    unifiedSyncService = new UnifiedSyncService();
  }
  return unifiedSyncService;
}