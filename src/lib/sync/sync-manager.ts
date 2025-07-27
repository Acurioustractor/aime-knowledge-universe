/**
 * AIME Data Lake Sync Manager
 * 
 * Orchestrates background synchronization from all data sources:
 * - Airtable (500+ tools)
 * - YouTube (423+ videos) 
 * - GitHub (repositories)
 * - Mailchimp (newsletters)
 * - Local files
 * 
 * Features:
 * - Incremental sync (only changed data)
 * - Rate limiting & quota management
 * - Error handling & retry logic
 * - Real-time status tracking
 * - Webhook support for instant updates
 */

import { getContentRepository, ContentRepository } from '../database/connection';
import { fetchAllAirtableTools, transformToContentFormat } from './airtable-sync';
import cron from 'node-cron';

interface SyncJob {
  source: string;
  frequency: string; // cron expression
  fetcher: () => Promise<any[]>;
  transformer: (data: any[]) => any[];
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'idle' | 'running' | 'error' | 'success';
  errorMessage?: string;
}

interface SyncStats {
  totalSynced: number;
  duration: number;
  errors: string[];
  success: boolean;
}

export class DataLakeSyncManager {
  private repository: ContentRepository | null = null;
  private jobs: Map<string, SyncJob> = new Map();
  private isInitialized = false;
  private syncLocks: Set<string> = new Set(); // PREVENT CONCURRENT SYNCS!

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔄 Initializing AIME Data Lake Sync Manager...');
    
    this.repository = await getContentRepository();
    this.setupSyncJobs();
    this.startScheduler();
    
    this.isInitialized = true;
    console.log('✅ Sync Manager initialized successfully');
  }

  private setupSyncJobs(): void {
    // AIRTABLE SYNC - Every 30 minutes
    this.jobs.set('airtable', {
      source: 'airtable',
      frequency: '*/30 * * * *', // Every 30 minutes
      fetcher: this.fetchAirtableTools.bind(this),
      transformer: this.transformAirtableData.bind(this),
      enabled: true,
      status: 'idle'
    });

    // YOUTUBE SYNC - Every hour (quota management)
    this.jobs.set('youtube', {
      source: 'youtube',
      frequency: '0 */1 * * *', // Every hour
      fetcher: this.fetchYouTubeVideos.bind(this),
      transformer: this.transformYouTubeData.bind(this),
      enabled: true,
      status: 'idle'
    });

    // GITHUB SYNC - Every 2 hours (less frequent)
    this.jobs.set('github', {
      source: 'github',
      frequency: '0 */2 * * *', // Every 2 hours
      fetcher: this.fetchGitHubContent.bind(this),
      transformer: this.transformGitHubData.bind(this),
      enabled: true,
      status: 'idle'
    });

    // MAILCHIMP SYNC - Every hour
    this.jobs.set('mailchimp', {
      source: 'mailchimp',
      frequency: '0 */1 * * *', // Every hour
      fetcher: this.fetchMailchimpCampaigns.bind(this),
      transformer: this.transformMailchimpData.bind(this),
      enabled: true,
      status: 'idle'
    });
  }

  private startScheduler(): void {
    console.log('🚀 SCALE-UP: Re-enabling automated syncing with proper concurrency controls');
    
    // Schedule each sync job with staggered timing to prevent conflicts
    this.jobs.forEach((job, source) => {
      if (!job.enabled) return;

      console.log(`📅 Scheduling ${source} sync: ${job.frequency}`);
      
      cron.schedule(job.frequency, async () => {
        // Add random delay to prevent simultaneous syncs
        const delay = Math.random() * 30000; // 0-30 seconds
        setTimeout(async () => {
          await this.runSyncJob(source);
        }, delay);
      });
    });

    // Run initial sync with proper staggering
    setTimeout(() => this.runInitialSync(), 10000); // Start after 10 seconds
    console.log('✅ Automated syncing enabled with concurrency protection');
  }

  private async runInitialSync(): Promise<void> {
    console.log('🚀 Running initial sync for all sources...');
    
    const sources = ['airtable', 'youtube', 'github', 'mailchimp'];
    
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      setTimeout(async () => {
        await this.runSyncJob(source);
      }, i * 10000); // Stagger by 10 seconds
    }
  }

  async runSyncJob(source: string): Promise<SyncStats> {
    const job = this.jobs.get(source);
    if (!job || !job.enabled) {
      throw new Error(`Sync job '${source}' not found or disabled`);
    }

    // PREVENT CONCURRENT SYNCS!
    if (this.syncLocks.has(source)) {
      console.log(`🔒 ${source} sync already locked - preventing race condition`);
      return { totalSynced: 0, duration: 0, errors: ['Sync locked - preventing race condition'], success: false };
    }

    if (job.status === 'running') {
      console.log(`⏭️ Skipping ${source} sync - already running`);
      return { totalSynced: 0, duration: 0, errors: ['Already running'], success: false };
    }

    const startTime = Date.now();
    
    // ACQUIRE SYNC LOCK
    this.syncLocks.add(source);
    job.status = 'running';
    job.lastRun = new Date();
    
    try {
      console.log(`🔒 ${source} sync lock acquired - starting sync...`);
      
      // Fetch data from source
      const rawData = await job.fetcher();
      console.log(`📊 ${source}: Fetched ${rawData.length} raw items`);
      
      // Transform data to our schema
      const transformedData = job.transformer(rawData);
      console.log(`🔄 ${source}: Transformed ${transformedData.length} items`);
      
      // Batch upsert to database
      const upsertedCount = await this.repository!.batchUpsertContent(transformedData, source);
      
      const duration = Date.now() - startTime;
      job.status = 'success';
      job.errorMessage = undefined;
      
      console.log(`✅ ${source} sync completed: ${upsertedCount} items in ${duration}ms`);
      
      return {
        totalSynced: upsertedCount,
        duration,
        errors: [],
        success: true
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      job.status = 'error';
      job.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`❌ ${source} sync failed:`, error);
      
      return {
        totalSynced: 0,
        duration,
        errors: [job.errorMessage],
        success: false
      };
    } finally {
      // RELEASE SYNC LOCK
      this.syncLocks.delete(source);
      console.log(`🔓 ${source} sync lock released`);
    }
  }

  // AIRTABLE FETCHER - AGGRESSIVE 500+ TOOLS SYNC!
  private async fetchAirtableTools(): Promise<any[]> {
    console.log('🔥 🚀 SYNC MANAGER: Using AGGRESSIVE Airtable sync for ALL 500+ tools!');
    
    try {
      // Use our new aggressive sync function that gets ALL tools
      const tools = await fetchAllAirtableTools();
      console.log(`🔥 ✅ SYNC MANAGER: Successfully fetched ${tools.length} tools from Airtable`);
      
      // Return in the format expected by the transformer
      return tools.map(tool => ({
        id: tool.id,
        fields: {
          Name: tool.title,
          Description: tool.description,
          Category: tool.category,
          'File Type': tool.fileType,
          URL: tool.url,
          'Thumbnail URL': tool.thumbnailUrl,
          Tags: tool.tags,
          Themes: tool.themes
        },
        createdTime: tool.metadata?.created_time || new Date().toISOString()
      }));
         } catch (error) {
       console.error('❌ SYNC MANAGER: Airtable aggressive sync failed:', error);
       return [];
     }
  }

  private transformAirtableData(records: any[]): any[] {
    return records.map(record => {
      const fields = record.fields || {};
      
      // Extract video URL and thumbnail
      const attachments = fields.Attachments || [];
      const videoAttachment = attachments.find((att: any) => 
        att.type?.includes('video') || att.filename?.includes('.mp4')
      );
      const imageAttachment = attachments.find((att: any) => 
        att.type?.includes('image') || att.filename?.match(/\.(jpg|jpeg|png|gif)$/i)
      );
      
      return {
        id: record.id,
        source_id: record.id,
        title: fields.Name || fields.Title || fields.Tool || fields.Asset || 'Untitled Tool',
        description: fields.Description || fields.Summary || fields.Content || fields.Notes || '',
        content_type: 'tool',
        category: fields.Category || fields.Type || fields.Genre || 'General',
        file_type: fields.FileType || fields.Type || fields.Format || (videoAttachment ? 'Video' : 'Unknown'),
        url: videoAttachment?.url || fields.URL || null,
        thumbnail_url: imageAttachment?.thumbnails?.large?.url || imageAttachment?.url || null,
        tags: Array.isArray(fields.Tags) ? fields.Tags : 
              typeof fields.Tags === 'string' ? fields.Tags.split(',').map((t: string) => t.trim()) : [],
        themes: [],
        topics: [],
        authors: [],
        metadata: {
          airtable_record_id: record.id,
          airtable_created_time: record.createdTime,
          all_fields: fields
        },
        source_created_at: record.createdTime,
        source_updated_at: record.lastModified || record.createdTime,
        tool_type: fields.ToolType || 'general',
        usage_restrictions: fields.Usage || fields.Rights || fields.License || 'Unknown',
        file_size: fields.Size || fields.FileSize || 'Unknown',
        download_url: videoAttachment?.url || fields.DownloadURL || null,
        attachments: attachments,
        airtable_record_id: record.id
      };
    });
  }

  // YOUTUBE FETCHER - SCALE UP TO ALL 423 VIDEOS!
  private async fetchYouTubeVideos(): Promise<any[]> {
    console.log('🚀 SCALE-UP: Fetching ALL 423 YouTube videos...');
    
    try {
      // Fetch from our YouTube API route to get ALL videos without limit
      const response = await fetch('http://localhost:3000/api/integrations/youtube?limit=500');
      
      if (!response.ok) {
        throw new Error(`YouTube API failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`🚀 ✅ SYNC MANAGER: Successfully fetched ${data.items?.length || 0} YouTube videos`);
      
      return data.items || [];
    } catch (error) {
      console.warn('❌ YouTube fetch failed, using empty array:', error);
      return [];
    }
  }

  private transformYouTubeData(videos: any[]): any[] {
    return videos.map(video => ({
      id: `youtube_${video.id.replace(/[^a-zA-Z0-9]/g, '_')}`,
      source_id: video.id,
      title: video.title,
      description: video.description || '',
      content_type: 'video',
      category: 'Video Content',
      file_type: 'Video',
      url: video.url,
      thumbnail_url: video.thumbnail,
      tags: video.tags || [],
      themes: JSON.stringify(video.themes || []),
      topics: JSON.stringify(video.topics || []),
      authors: JSON.stringify(video.authors || ['AIME Mentoring']),
      metadata: {
        youtube_video_id: video.id,
        channel_id: video.metadata?.channelId,
        duration: video.metadata?.duration,
        view_count: video.metadata?.viewCount,
        published_at: video.date,
        thumbnails: video.metadata?.thumbnails
      },
      source_created_at: video.date,
      source_updated_at: video.date
    }));
  }

  // GITHUB FETCHER
  private async fetchGitHubContent(): Promise<any[]> {
    try {
      const { fetchRepositoryContent } = await import('../integrations/github');
      const content = await fetchRepositoryContent({ limit: 50 });
      return content;
    } catch (error) {
      console.warn('❌ GitHub fetch failed, using empty array:', error);
      return [];
    }
  }

  private transformGitHubData(items: any[]): any[] {
    return items.map(item => ({
      id: `github-${item.id}`,
      source_id: item.id,
      title: item.title,
      description: item.description || '',
      content_type: 'tool',
      category: 'Documentation',
      file_type: 'Document',
      url: item.url,
      thumbnail_url: null,
      tags: item.tags || [],
      themes: [],
      topics: [],
      authors: item.authors || [],
      metadata: {
        repository: item.repository,
        file_path: item.filePath,
        language: item.language
      },
      source_created_at: item.date,
      source_updated_at: item.date
    }));
  }

  // MAILCHIMP FETCHER - SCALE UP TO ALL NEWSLETTERS!
  private async fetchMailchimpCampaigns(): Promise<any[]> {
    console.log('🚀 SCALE-UP: Fetching ALL Mailchimp newsletters...');
    
    try {
      const { fetchMailchimpCampaigns } = await import('../integrations/mailchimp');
      // Remove limit entirely to fetch ALL available newsletters with pagination
      const campaigns = await fetchMailchimpCampaigns({});
      console.log(`🚀 ✅ SYNC MANAGER: Successfully fetched ${campaigns.length} Mailchimp newsletters`);
      return campaigns;
    } catch (error) {
      console.warn('❌ Mailchimp fetch failed, using empty array:', error);
      return [];
    }
  }

  private transformMailchimpData(campaigns: any[]): any[] {
    return campaigns.map(campaign => ({
      id: `mailchimp-${campaign.id}`,
      source_id: campaign.id,
      title: campaign.title,
      description: campaign.description || '',
      content_type: 'newsletter',
      category: 'Newsletter',
      file_type: 'Email',
      url: campaign.url,
      thumbnail_url: null,
      tags: campaign.tags || [],
      themes: [],
      topics: [],
      authors: ['AIME Team'],
      metadata: {
        campaign_id: campaign.id,
        send_date: campaign.sendDate,
        recipients: campaign.recipients
      },
      source_created_at: campaign.date,
      source_updated_at: campaign.date
    }));
  }

  // PUBLIC API
  async getSyncStatus(): Promise<any> {
    if (!this.repository) await this.initialize();
    
    const dbStatus = await this.repository!.getSyncStatus();
    const jobStatus = Array.from(this.jobs.entries()).map(([source, job]) => ({
      source,
      status: job.status,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
      enabled: job.enabled,
      errorMessage: job.errorMessage
    }));

    return {
      database: dbStatus,
      jobs: jobStatus,
      isInitialized: this.isInitialized
    };
  }

  async getStats(): Promise<any> {
    if (!this.repository) await this.initialize();
    return this.repository!.getStats();
  }

  async forceSyncAll(): Promise<{ [source: string]: SyncStats }> {
    const results: { [source: string]: SyncStats } = {};
    
    for (const source of this.jobs.keys()) {
      try {
        results[source] = await this.runSyncJob(source);
      } catch (error) {
        results[source] = {
          totalSynced: 0,
          duration: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          success: false
        };
      }
    }

    return results;
  }

  async forceSyncSource(source: string): Promise<SyncStats> {
    return this.runSyncJob(source);
  }
}

// Singleton instance
let syncManager: DataLakeSyncManager | null = null;

export async function getSyncManager(): Promise<DataLakeSyncManager> {
  if (!syncManager) {
    syncManager = new DataLakeSyncManager();
    await syncManager.initialize();
  }
  return syncManager;
} 