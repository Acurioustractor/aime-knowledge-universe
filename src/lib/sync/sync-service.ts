/**
 * Smart Sync Service
 * 
 * Handles intelligent syncing of content from external APIs to Supabase
 */

import { contentRepository, syncRepository, ContentItem } from '@/lib/database/supabase';
import { fetchYouTubeVideos } from '@/lib/integrations/youtube';
import { fetchAirtableContent } from '@/lib/integrations/airtable';
import { fetchAllMailchimpCampaigns } from '@/lib/content-integration/api/mailchimp-api';
import { fetchGitHubContent } from '@/lib/integrations/github';

export interface SyncResult {
  source: string;
  success: boolean;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  durationMs: number;
  error?: string;
}

export class SyncService {
  /**
   * Sync all sources
   */
  async syncAll(): Promise<SyncResult[]> {
    console.log('🔄 Starting full sync of all sources...');
    
    const results = await Promise.allSettled([
      this.syncYouTube(),
      this.syncAirtable(),
      this.syncMailchimp(),
      this.syncGitHub()
    ]);

    const syncResults = results.map((result, index) => {
      const sources = ['youtube', 'airtable', 'mailchimp', 'github'];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          source: sources[index],
          success: false,
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: 0,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    console.log('✅ Full sync completed:', syncResults);
    return syncResults;
  }

  /**
   * Sync YouTube content
   */
  async syncYouTube(): Promise<SyncResult> {
    const startTime = Date.now();
    const source = 'youtube';
    
    try {
      console.log('📺 Starting YouTube sync...');
      await syncRepository.startSync(source);

      // Fetch from YouTube API
      const videos = await fetchYouTubeVideos({ limit: 100 });
      
      if (videos.length === 0) {
        console.log('📺 No YouTube videos found');
        await syncRepository.completeSync(source, {
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        });
        
        return {
          source,
          success: true,
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        };
      }

      // Transform to database format
      const contentItems: Partial<ContentItem>[] = videos.map(video => ({
        source_id: video.id.replace('youtube-', ''),
        source: 'youtube' as const,
        content_type: 'video' as const,
        title: video.title,
        description: video.description,
        url: video.url,
        thumbnail_url: video.thumbnail,
        metadata: video.metadata || {},
        tags: video.tags || [],
        categories: video.categories || [],
        authors: [video.metadata?.channelTitle || 'AIME'],
        themes: [],
        source_created_at: video.date,
        source_updated_at: video.date
      }));

      // Check for existing content to determine new vs updated
      let newRecords = 0;
      let updatedRecords = 0;

      for (const item of contentItems) {
        const existing = await contentRepository.getContentBySourceId(source, item.source_id!);
        if (existing) {
          updatedRecords++;
        } else {
          newRecords++;
        }
      }

      // Batch upsert to database
      const result = await contentRepository.upsertContent(contentItems);
      
      const durationMs = Date.now() - startTime;
      
      await syncRepository.completeSync(source, {
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      });

      console.log(`✅ YouTube sync completed: ${result.success} items in ${durationMs}ms`);
      
      return {
        source,
        success: true,
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ YouTube sync failed:', errorMessage);
      
      await syncRepository.failSync(source, errorMessage);
      
      return {
        source,
        success: false,
        totalRecords: 0,
        newRecords: 0,
        updatedRecords: 0,
        durationMs: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Sync Airtable content
   */
  async syncAirtable(): Promise<SyncResult> {
    const startTime = Date.now();
    const source = 'airtable';
    
    try {
      console.log('🗃️ Starting Airtable sync...');
      await syncRepository.startSync(source);

      // Fetch from Airtable API
      const tools = await fetchAirtableContent({ limit: 500 });
      
      if (tools.length === 0) {
        console.log('🗃️ No Airtable tools found');
        await syncRepository.completeSync(source, {
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        });
        
        return {
          source,
          success: true,
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        };
      }

      // Transform to database format
      const contentItems: Partial<ContentItem>[] = tools.map(tool => ({
        source_id: tool.id.replace('airtable-', ''),
        source: 'airtable' as const,
        content_type: 'tool' as const,
        title: tool.title,
        description: tool.description,
        url: tool.url,
        thumbnail_url: tool.thumbnail,
        metadata: tool.metadata || {},
        tags: tool.tags || [],
        categories: tool.categories || [],
        authors: [],
        themes: [],
        source_created_at: tool.metadata?.createdTime,
        source_updated_at: tool.metadata?.lastModifiedTime
      }));

      // Check for existing content
      let newRecords = 0;
      let updatedRecords = 0;

      for (const item of contentItems) {
        const existing = await contentRepository.getContentBySourceId(source, item.source_id!);
        if (existing) {
          updatedRecords++;
        } else {
          newRecords++;
        }
      }

      // Batch upsert to database
      const result = await contentRepository.upsertContent(contentItems);
      
      const durationMs = Date.now() - startTime;
      
      await syncRepository.completeSync(source, {
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      });

      console.log(`✅ Airtable sync completed: ${result.success} items in ${durationMs}ms`);
      
      return {
        source,
        success: true,
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Airtable sync failed:', errorMessage);
      
      await syncRepository.failSync(source, errorMessage);
      
      return {
        source,
        success: false,
        totalRecords: 0,
        newRecords: 0,
        updatedRecords: 0,
        durationMs: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Sync Mailchimp newsletters
   */
  async syncMailchimp(): Promise<SyncResult> {
    const startTime = Date.now();
    const source = 'mailchimp';
    
    try {
      console.log('📧 Starting Mailchimp sync...');
      await syncRepository.startSync(source);

      // Fetch from Mailchimp API - get ALL campaigns
      const newsletters = await fetchAllMailchimpCampaigns();
      
      if (newsletters.length === 0) {
        console.log('📧 No Mailchimp newsletters found');
        await syncRepository.completeSync(source, {
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        });
        
        return {
          source,
          success: true,
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        };
      }

      // Transform to database format
      const contentItems: Partial<ContentItem>[] = newsletters.map(newsletter => ({
        source_id: newsletter.id.replace('mailchimp-', ''),
        source: 'mailchimp' as const,
        content_type: 'newsletter' as const,
        title: newsletter.title,
        description: newsletter.description,
        url: newsletter.url,
        thumbnail_url: newsletter.thumbnail,
        metadata: newsletter.metadata || {},
        tags: newsletter.tags || [],
        categories: newsletter.categories || [],
        authors: newsletter.authors || [],
        themes: [],
        source_created_at: newsletter.date,
        source_updated_at: newsletter.date
      }));

      // Check for existing content
      let newRecords = 0;
      let updatedRecords = 0;

      for (const item of contentItems) {
        const existing = await contentRepository.getContentBySourceId(source, item.source_id!);
        if (existing) {
          updatedRecords++;
        } else {
          newRecords++;
        }
      }

      // Batch upsert to database
      const result = await contentRepository.upsertContent(contentItems);
      
      const durationMs = Date.now() - startTime;
      
      await syncRepository.completeSync(source, {
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      });

      console.log(`✅ Mailchimp sync completed: ${result.success} items in ${durationMs}ms`);
      
      return {
        source,
        success: true,
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Mailchimp sync failed:', errorMessage);
      
      await syncRepository.failSync(source, errorMessage);
      
      return {
        source,
        success: false,
        totalRecords: 0,
        newRecords: 0,
        updatedRecords: 0,
        durationMs: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Sync GitHub content
   */
  async syncGitHub(): Promise<SyncResult> {
    const startTime = Date.now();
    const source = 'github';
    
    try {
      console.log('🐙 Starting GitHub sync...');
      await syncRepository.startSync(source);

      // Fetch from GitHub API
      const content = await fetchGitHubContent({ limit: 100 });
      
      if (content.length === 0) {
        console.log('🐙 No GitHub content found');
        await syncRepository.completeSync(source, {
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        });
        
        return {
          source,
          success: true,
          totalRecords: 0,
          newRecords: 0,
          updatedRecords: 0,
          durationMs: Date.now() - startTime
        };
      }

      // Transform to database format
      const contentItems: Partial<ContentItem>[] = content.map(item => ({
        source_id: item.id.replace('github-', ''),
        source: 'github' as const,
        content_type: 'research' as const,
        title: item.title,
        description: item.description,
        url: item.url,
        thumbnail_url: item.thumbnail,
        metadata: item.metadata || {},
        tags: item.tags || [],
        categories: item.categories || [],
        authors: [],
        themes: [],
        source_created_at: item.date,
        source_updated_at: item.date
      }));

      // Check for existing content
      let newRecords = 0;
      let updatedRecords = 0;

      for (const item of contentItems) {
        const existing = await contentRepository.getContentBySourceId(source, item.source_id!);
        if (existing) {
          updatedRecords++;
        } else {
          newRecords++;
        }
      }

      // Batch upsert to database
      const result = await contentRepository.upsertContent(contentItems);
      
      const durationMs = Date.now() - startTime;
      
      await syncRepository.completeSync(source, {
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      });

      console.log(`✅ GitHub sync completed: ${result.success} items in ${durationMs}ms`);
      
      return {
        source,
        success: true,
        totalRecords: result.success,
        newRecords,
        updatedRecords,
        durationMs
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ GitHub sync failed:', errorMessage);
      
      await syncRepository.failSync(source, errorMessage);
      
      return {
        source,
        success: false,
        totalRecords: 0,
        newRecords: 0,
        updatedRecords: 0,
        durationMs: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Check if sync is needed for a source
   */
  async shouldSync(source: string): Promise<boolean> {
    const status = await syncRepository.getSyncStatus(source);
    
    if (!status) return true; // First sync
    if (status.is_syncing) return false; // Already syncing
    
    const now = new Date();
    const nextSync = status.next_sync_at ? new Date(status.next_sync_at) : new Date(0);
    
    return now >= nextSync;
  }

  /**
   * Get sync status for all sources
   */
  async getSyncStatus() {
    return await syncRepository.getAllSyncStatus();
  }
}

// Singleton instance
export const syncService = new SyncService();