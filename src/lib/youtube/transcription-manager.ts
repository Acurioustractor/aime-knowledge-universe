/**
 * Transcription Management System
 * 
 * Handles video transcription queueing, processing, and storage
 * Prepares for integration with various transcription services
 */

import { YouTubeVideo } from './youtube-api';
import { youtubeStorage } from './youtube-storage';

export interface TranscriptionJob {
  id: string;
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  provider: 'google' | 'aws' | 'azure' | 'openai' | 'whisper';
  language: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  progress?: number;
  error?: string;
  metadata?: {
    confidence?: number;
    wordCount?: number;
    duration?: number;
    costEstimate?: number;
  };
}

export interface TranscriptionResult {
  videoId: string;
  text: string;
  timestamps?: Array<{
    start: number;
    end: number;
    text: string;
    confidence?: number;
  }>;
  language: string;
  confidence: number;
  provider: string;
  processedAt: string;
  metadata: {
    wordCount: number;
    duration: number;
    speakerCount?: number;
    topics?: string[];
    keywords?: string[];
  };
}

export interface TranscriptionConfig {
  maxConcurrentJobs: number;
  retryAttempts: number;
  batchSize: number;
  autoQueueNewVideos: boolean;
  preferredProvider: 'google' | 'aws' | 'azure' | 'openai' | 'whisper';
  languageDetection: boolean;
  targetLanguages: string[];
  qualityThreshold: number; // minimum confidence score
}

class TranscriptionManager {
  private static instance: TranscriptionManager;
  private jobs = new Map<string, TranscriptionJob>();
  private results = new Map<string, TranscriptionResult>();
  private processingQueue: string[] = [];
  private config: TranscriptionConfig;
  private isProcessing = false;

  constructor(config: Partial<TranscriptionConfig> = {}) {
    this.config = {
      maxConcurrentJobs: config.maxConcurrentJobs || 3,
      retryAttempts: config.retryAttempts || 2,
      batchSize: config.batchSize || 10,
      autoQueueNewVideos: config.autoQueueNewVideos || true,
      preferredProvider: config.preferredProvider || 'google',
      languageDetection: config.languageDetection || true,
      targetLanguages: config.targetLanguages || ['en', 'en-AU', 'en-US'],
      qualityThreshold: config.qualityThreshold || 0.8
    };

    console.log('🎤 Transcription Manager initialized');
  }

  static getInstance(config?: Partial<TranscriptionConfig>): TranscriptionManager {
    if (!TranscriptionManager.instance) {
      TranscriptionManager.instance = new TranscriptionManager(config);
    }
    return TranscriptionManager.instance;
  }

  /**
   * Queue videos for transcription
   */
  async queueVideosForTranscription(videoIds: string[], options: {
    priority?: 'high' | 'medium' | 'low';
    provider?: 'google' | 'aws' | 'azure' | 'openai' | 'whisper';
    language?: string;
  } = {}): Promise<{
    queued: number;
    skipped: number;
    errors: string[];
  }> {
    console.log(`🎤 Queueing ${videoIds.length} videos for transcription...`);
    
    let queued = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const videoId of videoIds) {
      try {
        // Check if video exists and doesn't already have transcription
        const { videos } = youtubeStorage.getVideos({ limit: 1000 });
        const video = videos.find(v => v.id === videoId);
        
        if (!video) {
          errors.push(`Video ${videoId} not found`);
          continue;
        }

        // Skip if already has completed transcription
        if (video.transcription?.status === 'completed') {
          skipped++;
          continue;
        }

        // Check if job already exists
        const existingJob = Array.from(this.jobs.values())
          .find(job => job.videoId === videoId && 
                      ['pending', 'processing'].includes(job.status));
        
        if (existingJob) {
          skipped++;
          continue;
        }

        // Create transcription job
        const jobId = `trans-${videoId}-${Date.now()}`;
        const job: TranscriptionJob = {
          id: jobId,
          videoId,
          status: 'pending',
          provider: options.provider || this.config.preferredProvider,
          language: options.language || this.detectLanguage(video),
          priority: options.priority || 'medium',
          createdAt: new Date().toISOString(),
          metadata: {
            duration: this.parseDurationToSeconds(video.duration),
            costEstimate: this.estimateTranscriptionCost(video.duration)
          }
        };

        this.jobs.set(jobId, job);
        this.addToProcessingQueue(jobId, job.priority);

        // Update video with pending transcription status
        video.transcription = {
          status: 'pending',
          language: job.language,
          lastUpdated: new Date().toISOString()
        };

        youtubeStorage.storeVideos([video], video.channelId);
        
        queued++;
        console.log(`✅ Queued video ${videoId} for transcription (Job: ${jobId})`);

      } catch (error) {
        const errorMessage = `Failed to queue video ${videoId}: ${error}`;
        errors.push(errorMessage);
        console.error('❌', errorMessage);
      }
    }

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    console.log(`🎤 Transcription queueing complete: ${queued} queued, ${skipped} skipped`);
    
    return { queued, skipped, errors };
  }

  /**
   * Get transcription job status
   */
  getJob(jobId: string): TranscriptionJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs with optional status filter
   */
  getAllJobs(status?: TranscriptionJob['status']): TranscriptionJob[] {
    const jobs = Array.from(this.jobs.values());
    return status ? jobs.filter(job => job.status === status) : jobs;
  }

  /**
   * Get transcription result
   */
  getTranscriptionResult(videoId: string): TranscriptionResult | undefined {
    return this.results.get(videoId);
  }

  /**
   * Search transcriptions
   */
  searchTranscriptions(query: string): Array<{
    videoId: string;
    video: YouTubeVideo;
    transcription: TranscriptionResult;
    matches: Array<{
      text: string;
      timestamp: number;
      confidence: number;
    }>;
  }> {
    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    this.results.forEach((transcription, videoId) => {
      const matches: any[] = [];
      
      // Search in full text
      if (transcription.text.toLowerCase().includes(searchTerm)) {
        // If we have timestamps, find specific matches
        if (transcription.timestamps) {
          transcription.timestamps.forEach(segment => {
            if (segment.text.toLowerCase().includes(searchTerm)) {
              matches.push({
                text: segment.text,
                timestamp: segment.start,
                confidence: segment.confidence || transcription.confidence
              });
            }
          });
        } else {
          // No timestamps, just add full text match
          matches.push({
            text: transcription.text.substring(0, 200) + '...',
            timestamp: 0,
            confidence: transcription.confidence
          });
        }
      }

      if (matches.length > 0) {
        // Get the video data
        const { videos } = youtubeStorage.getVideos({ limit: 1000 });
        const video = videos.find(v => v.id === videoId);
        
        if (video) {
          results.push({
            videoId,
            video,
            transcription,
            matches
          });
        }
      }
    });

    return results.sort((a, b) => b.matches.length - a.matches.length);
  }

  /**
   * Get transcription statistics
   */
  getTranscriptionStats(): {
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalVideosWithTranscription: number;
    avgProcessingTime: number;
    successRate: number;
    queueLength: number;
    providerStats: Record<string, number>;
    languageStats: Record<string, number>;
  } {
    const jobs = Array.from(this.jobs.values());
    const completed = jobs.filter(j => j.status === 'completed');
    const failed = jobs.filter(j => j.status === 'failed');
    
    // Calculate average processing time
    const processingTimes = completed
      .filter(job => job.startedAt && job.completedAt)
      .map(job => {
        const start = new Date(job.startedAt!).getTime();
        const end = new Date(job.completedAt!).getTime();
        return end - start;
      });
    
    const avgProcessingTime = processingTimes.length > 0 ? 
      processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length : 0;

    // Provider stats
    const providerStats: Record<string, number> = {};
    jobs.forEach(job => {
      providerStats[job.provider] = (providerStats[job.provider] || 0) + 1;
    });

    // Language stats
    const languageStats: Record<string, number> = {};
    jobs.forEach(job => {
      languageStats[job.language] = (languageStats[job.language] || 0) + 1;
    });

    return {
      totalJobs: jobs.length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      processingJobs: jobs.filter(j => j.status === 'processing').length,
      completedJobs: completed.length,
      failedJobs: failed.length,
      totalVideosWithTranscription: this.results.size,
      avgProcessingTime: Math.round(avgProcessingTime / 1000), // Convert to seconds
      successRate: jobs.length > 0 ? (completed.length / jobs.length) * 100 : 0,
      queueLength: this.processingQueue.length,
      providerStats,
      languageStats
    };
  }

  /**
   * Start processing the transcription queue
   */
  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('🎬 Starting transcription processing...');

    while (this.processingQueue.length > 0) {
      const activeJobs = this.getAllJobs('processing');
      
      if (activeJobs.length >= this.config.maxConcurrentJobs) {
        // Wait a bit before checking again
        await this.delay(5000);
        continue;
      }

      const jobId = this.processingQueue.shift();
      if (!jobId) continue;

      const job = this.jobs.get(jobId);
      if (!job || job.status !== 'pending') continue;

      // Start processing this job
      this.processTranscriptionJob(job);
    }

    this.isProcessing = false;
    console.log('✅ Transcription processing completed');
  }

  /**
   * Process a single transcription job
   */
  private async processTranscriptionJob(job: TranscriptionJob): Promise<void> {
    console.log(`🎤 Processing transcription job ${job.id} for video ${job.videoId}`);
    
    try {
      // Update job status
      job.status = 'processing';
      job.startedAt = new Date().toISOString();
      this.jobs.set(job.id, job);

      // Get video data
      const { videos } = youtubeStorage.getVideos({ limit: 1000 });
      const video = videos.find(v => v.id === job.videoId);
      
      if (!video) {
        throw new Error(`Video ${job.videoId} not found`);
      }

      // Update video transcription status
      video.transcription = {
        ...video.transcription,
        status: 'processing',
        lastUpdated: new Date().toISOString()
      };
      youtubeStorage.storeVideos([video], video.channelId);

      // Simulate transcription processing
      // In a real implementation, this would call the actual transcription service
      const result = await this.simulateTranscription(video, job);

      // Store the result
      this.results.set(job.videoId, result);

      // Update job as completed
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.progress = 100;
      job.metadata = {
        ...job.metadata,
        confidence: result.confidence,
        wordCount: result.metadata.wordCount
      };
      this.jobs.set(job.id, job);

      // Update video with completed transcription
      video.transcription = {
        status: 'completed',
        text: result.text,
        timestamps: result.timestamps,
        language: result.language,
        confidence: result.confidence,
        lastUpdated: result.processedAt
      };
      youtubeStorage.storeVideos([video], video.channelId);

      console.log(`✅ Completed transcription for video ${job.videoId}`);

    } catch (error) {
      console.error(`❌ Transcription failed for job ${job.id}:`, error);
      
      // Update job as failed
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.error = String(error);
      this.jobs.set(job.id, job);

      // Update video transcription status
      const { videos } = youtubeStorage.getVideos({ limit: 1000 });
      const video = videos.find(v => v.id === job.videoId);
      if (video) {
        video.transcription = {
          ...video.transcription,
          status: 'failed',
          lastUpdated: new Date().toISOString()
        };
        youtubeStorage.storeVideos([video], video.channelId);
      }
    }
  }

  /**
   * Simulate transcription processing (placeholder for real implementation)
   */
  private async simulateTranscription(video: YouTubeVideo, job: TranscriptionJob): Promise<TranscriptionResult> {
    // Simulate processing time based on video duration
    const duration = this.parseDurationToSeconds(video.duration);
    const processingTime = Math.min(duration * 100, 5000); // Max 5 seconds for demo
    
    await this.delay(processingTime);

    // Generate mock transcription based on video title and description
    const mockText = this.generateMockTranscription(video);
    const mockTimestamps = this.generateMockTimestamps(mockText, duration);

    return {
      videoId: video.id,
      text: mockText,
      timestamps: mockTimestamps,
      language: job.language,
      confidence: 0.92,
      provider: job.provider,
      processedAt: new Date().toISOString(),
      metadata: {
        wordCount: mockText.split(' ').length,
        duration,
        topics: video.searchMetadata.topics,
        keywords: video.searchMetadata.extractedKeywords
      }
    };
  }

  /**
   * Helper methods
   */
  private addToProcessingQueue(jobId: string, priority: 'high' | 'medium' | 'low'): void {
    // Add to queue based on priority
    if (priority === 'high') {
      this.processingQueue.unshift(jobId);
    } else {
      this.processingQueue.push(jobId);
    }
  }

  private detectLanguage(video: YouTubeVideo): string {
    // Simple language detection based on video metadata
    return video.defaultLanguage || 'en';
  }

  private estimateTranscriptionCost(duration: string): number {
    const durationSeconds = this.parseDurationToSeconds(duration);
    // Rough estimate: $0.006 per minute for Google Speech-to-Text
    return Math.round((durationSeconds / 60) * 0.006 * 100) / 100;
  }

  private parseDurationToSeconds(duration: string): number {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  private generateMockTranscription(video: YouTubeVideo): string {
    // Generate mock transcription based on video content
    const templates = [
      `Welcome to this video about ${video.title}. In today's session, we'll be exploring the concepts discussed in the description: ${video.description.substring(0, 100)}...`,
      `Hello everyone, and thank you for watching. Today we're going to talk about ${video.title}. This is an important topic related to ${video.searchMetadata.topics.join(', ')}.`,
      `In this video, we'll cover the key aspects of ${video.title}. As mentioned in the description, ${video.description.substring(0, 80)}...`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateMockTimestamps(text: string, duration: number): Array<{
    start: number;
    end: number;
    text: string;
    confidence?: number;
  }> {
    const words = text.split(' ');
    const segments: any[] = [];
    const wordsPerSegment = 10;
    const timePerSegment = duration / Math.ceil(words.length / wordsPerSegment);

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      const start = (i / wordsPerSegment) * timePerSegment;
      const end = Math.min(start + timePerSegment, duration);
      
      segments.push({
        start: Math.round(start),
        end: Math.round(end),
        text: segmentWords.join(' '),
        confidence: 0.9 + Math.random() * 0.1
      });
    }

    return segments;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const transcriptionManager = TranscriptionManager.getInstance();