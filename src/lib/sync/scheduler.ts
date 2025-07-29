/**
 * AIME Knowledge Archive - Sync Job Scheduler
 * 
 * Professional scheduling system for data synchronization jobs
 */

export interface SyncJob {
  id: string;
  name: string;
  source: 'mailchimp' | 'airtable' | 'github' | 'youtube' | 'local';
  schedule: string; // cron format
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'idle' | 'running' | 'success' | 'error';
  retryCount: number;
  maxRetries: number;
  timeout: number; // milliseconds
  config: Record<string, any>;
}

export interface SyncResult {
  jobId: string;
  success: boolean;
  startTime: Date;
  endTime: Date;
  duration: number;
  itemsProcessed: number;
  itemsAdded: number;
  itemsUpdated: number;
  itemsRemoved: number;
  errors: string[];
  metadata: Record<string, any>;
}

export class SyncScheduler {
  private jobs: Map<string, SyncJob> = new Map();
  private runningJobs: Set<string> = new Set();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private history: SyncResult[] = [];

  constructor() {
    this.initializeDefaultJobs();
  }

  private initializeDefaultJobs() {
    const defaultJobs: SyncJob[] = [
      {
        id: 'mailchimp-newsletters',
        name: 'Mailchimp Newsletter Sync',
        source: 'mailchimp',
        schedule: '0 */1 * * *', // Every hour
        priority: 'high',
        enabled: true,
        status: 'idle',
        retryCount: 0,
        maxRetries: 3,
        timeout: 60000, // 1 minute
        config: {
          limit: 50,
          includeArchived: false
        }
      },
      {
        id: 'airtable-resources',
        name: 'Airtable Resources Sync',
        source: 'airtable',
        schedule: '*/30 * * * *', // Every 30 minutes
        priority: 'high',
        enabled: true,
        status: 'idle',
        retryCount: 0,
        maxRetries: 3,
        timeout: 120000, // 2 minutes
        config: {
          bases: ['DAM', 'COMMS'],
          maxRecords: 100
        }
      },
      {
        id: 'github-repos',
        name: 'GitHub Repositories Sync',
        source: 'github',
        schedule: '0 */2 * * *', // Every 2 hours
        priority: 'medium',
        enabled: true,
        status: 'idle',
        retryCount: 0,
        maxRetries: 2,
        timeout: 180000, // 3 minutes
        config: {
          repositories: ['aime-knowledge-hub', 'aime-artifacts', 'AIMEdashboards'],
          includePrivate: true
        }
      },
      {
        id: 'youtube-episodes',
        name: 'YouTube Episodes Sync',
        source: 'youtube',
        schedule: '0 */6 * * *', // Every 6 hours
        priority: 'medium',
        enabled: true, // Enabled - YouTube integration is ready
        status: 'idle',
        retryCount: 0,
        maxRetries: 2,
        timeout: 300000, // 5 minutes
        config: {
          channelId: 'IMAGI-NATION',
          maxResults: 50,
          query: 'AIME IMAGI-NATION mentoring education indigenous'
        }
      },
      {
        id: 'local-content',
        name: 'Local Content File Sync',
        source: 'local',
        schedule: '*/5 * * * *', // Every 5 minutes
        priority: 'high',
        enabled: true,
        status: 'idle',
        retryCount: 0,
        maxRetries: 1,
        timeout: 30000, // 30 seconds
        config: {
          watchDirectories: ['content', 'research', 'recommendations', 'implementation', 'voices', 'overview']
        }
      }
    ];

    defaultJobs.forEach(job => {
      this.jobs.set(job.id, job);
    });
  }

  /**
   * Start the scheduler
   */
  start() {
    console.log('🚀 Starting AIME Sync Scheduler...');
    
    this.jobs.forEach((job, jobId) => {
      if (job.enabled) {
        this.scheduleJob(jobId);
      }
    });

    console.log(`✅ Scheduler started with ${this.jobs.size} jobs`);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    console.log('🛑 Stopping AIME Sync Scheduler...');
    
    this.intervals.forEach((interval, jobId) => {
      clearInterval(interval);
      this.intervals.delete(jobId);
    });

    console.log('✅ Scheduler stopped');
  }

  /**
   * Schedule a specific job
   */
  private scheduleJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job || !job.enabled) return;

    // Convert cron to simple interval for now (in production, use node-cron)
    const intervalMs = this.cronToMilliseconds(job.schedule);
    
    const interval = setInterval(async () => {
      await this.runJob(jobId);
    }, intervalMs);

    this.intervals.set(jobId, interval);
    
    // Calculate next run time
    job.nextRun = new Date(Date.now() + intervalMs);
    
    console.log(`📅 Scheduled job "${job.name}" to run every ${intervalMs/1000/60} minutes`);
  }

  /**
   * Run a sync job
   */
  async runJob(jobId: string): Promise<SyncResult> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (this.runningJobs.has(jobId)) {
      console.log(`⏭️ Job ${job.name} already running, skipping...`);
      return this.createErrorResult(jobId, ['Job already running']);
    }

    console.log(`🔄 Starting sync job: ${job.name}`);
    
    const startTime = new Date();
    this.runningJobs.add(jobId);
    job.status = 'running';
    job.lastRun = startTime;

    try {
      const result = await Promise.race([
        this.executeJob(job),
        this.createTimeoutPromise(job.timeout)
      ]);

      const endTime = new Date();
      const syncResult: SyncResult = {
        jobId,
        success: true,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        ...result,
        errors: []
      };

      job.status = 'success';
      job.retryCount = 0;
      this.history.push(syncResult);

      console.log(`✅ Job ${job.name} completed: ${result.itemsProcessed} items processed`);
      return syncResult;

    } catch (error) {
      const endTime = new Date();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      job.retryCount++;
      
      if (job.retryCount < job.maxRetries) {
        job.status = 'error';
        console.log(`⚠️ Job ${job.name} failed (retry ${job.retryCount}/${job.maxRetries}): ${errorMessage}`);
        // Schedule retry with exponential backoff
        setTimeout(() => this.runJob(jobId), Math.pow(2, job.retryCount) * 1000);
      } else {
        job.status = 'error';
        console.error(`❌ Job ${job.name} failed permanently: ${errorMessage}`);
      }

      const syncResult = this.createErrorResult(jobId, [errorMessage], startTime, endTime);
      this.history.push(syncResult);
      return syncResult;

    } finally {
      this.runningJobs.delete(jobId);
    }
  }

  /**
   * Execute the actual sync logic based on source
   */
  private async executeJob(job: SyncJob): Promise<Partial<SyncResult>> {
    switch (job.source) {
      case 'mailchimp':
        return await this.syncMailchimp(job);
      case 'airtable':
        return await this.syncAirtable(job);
      case 'github':
        return await this.syncGitHub(job);
      case 'youtube':
        return await this.syncYouTube(job);
      case 'local':
        return await this.syncLocalFiles(job);
      default:
        throw new Error(`Unknown source type: ${job.source}`);
    }
  }

  private async syncMailchimp(job: SyncJob): Promise<Partial<SyncResult>> {
    const { fetchMailchimpCampaigns } = await import('../integrations/mailchimp');
    const campaigns = await fetchMailchimpCampaigns({});
    
    return {
      itemsProcessed: campaigns.length,
      itemsAdded: campaigns.length, // For now, assume all are new
      itemsUpdated: 0,
      itemsRemoved: 0,
      metadata: { source: 'mailchimp', campaignCount: campaigns.length }
    };
  }

  private async syncAirtable(job: SyncJob): Promise<Partial<SyncResult>> {
    const { fetchAirtableResources } = await import('../integrations/airtable');
    const resources = await fetchAirtableResources({ limit: job.config.maxRecords });
    
    return {
      itemsProcessed: resources.length,
      itemsAdded: resources.length,
      itemsUpdated: 0,
      itemsRemoved: 0,
      metadata: { source: 'airtable', resourceCount: resources.length }
    };
  }

  private async syncGitHub(job: SyncJob): Promise<Partial<SyncResult>> {
    const { fetchRepositoryContent } = await import('../integrations/github');
    const content = await fetchRepositoryContent({ limit: 100 });
    
    return {
      itemsProcessed: content.length,
      itemsAdded: content.length,
      itemsUpdated: 0,
      itemsRemoved: 0,
      metadata: { source: 'github', repositoryCount: job.config.repositories.length }
    };
  }

  private async syncYouTube(job: SyncJob): Promise<Partial<SyncResult>> {
    const { fetchYouTubeVideos } = await import('../integrations/youtube');
    const videos = await fetchYouTubeVideos({ 
      limit: job.config.maxResults,
      query: job.config.query 
    });
    
    return {
      itemsProcessed: videos.length,
      itemsAdded: videos.length, // For now, assume all are new
      itemsUpdated: 0,
      itemsRemoved: 0,
      metadata: { source: 'youtube', videoCount: videos.length, query: job.config.query }
    };
  }

  private async syncLocalFiles(job: SyncJob): Promise<Partial<SyncResult>> {
    // Placeholder for local file sync
    return {
      itemsProcessed: 5, // Mock number
      itemsAdded: 0,
      itemsUpdated: 1,
      itemsRemoved: 0,
      metadata: { source: 'local', directoriesScanned: job.config.watchDirectories.length }
    };
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): SyncJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): SyncJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get sync history
   */
  getSyncHistory(limit: number = 50): SyncResult[] {
    return this.history.slice(-limit);
  }

  /**
   * Enable/disable a job
   */
  toggleJob(jobId: string, enabled: boolean) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.enabled = enabled;
    
    if (enabled) {
      this.scheduleJob(jobId);
    } else {
      const interval = this.intervals.get(jobId);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(jobId);
      }
    }
  }

  /**
   * Update job configuration
   */
  updateJobConfig(jobId: string, config: Partial<SyncJob>) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    Object.assign(job, config);
    
    // Reschedule if schedule changed
    if (config.schedule && job.enabled) {
      const interval = this.intervals.get(jobId);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(jobId);
      }
      this.scheduleJob(jobId);
    }
  }

  /**
   * Trigger a job to run immediately
   */
  async triggerJob(jobId: string): Promise<SyncResult> {
    return await this.runJob(jobId);
  }

  // Helper methods
  private cronToMilliseconds(cron: string): number {
    // Simple cron parser for common patterns
    // In production, use a proper cron library
    const patterns: Record<string, number> = {
      '*/5 * * * *': 5 * 60 * 1000,      // Every 5 minutes
      '*/30 * * * *': 30 * 60 * 1000,    // Every 30 minutes
      '0 */1 * * *': 60 * 60 * 1000,     // Every hour
      '0 */2 * * *': 2 * 60 * 60 * 1000, // Every 2 hours
      '0 */6 * * *': 6 * 60 * 60 * 1000  // Every 6 hours
    };
    
    return patterns[cron] || 60 * 60 * 1000; // Default to 1 hour
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Job timeout')), timeout);
    });
  }

  private createErrorResult(
    jobId: string, 
    errors: string[], 
    startTime: Date = new Date(), 
    endTime: Date = new Date()
  ): SyncResult {
    return {
      jobId,
      success: false,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      itemsProcessed: 0,
      itemsAdded: 0,
      itemsUpdated: 0,
      itemsRemoved: 0,
      errors,
      metadata: {}
    };
  }
}

// Singleton instance
export const syncScheduler = new SyncScheduler();