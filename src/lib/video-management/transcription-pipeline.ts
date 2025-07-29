/**
 * Video Transcription Pipeline with AI Integration
 * 
 * Handles transcription, wisdom extraction, and knowledge processing for AIME videos
 * Integrates with multiple transcription providers and AI services
 */

import { UnifiedVideoContent, WisdomExtract } from './unified-video-schema';
import { unifiedVideoManager } from './unified-video-manager';

export interface TranscriptionProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  supportedLanguages: string[];
  maxFileSize: number; // in MB
  costPerMinute: number; // in cents
  accuracy: number; // 0-1
  features: {
    speakerDiarization: boolean;
    punctuation: boolean;
    confidence: boolean;
    timestamps: boolean;
    emotions: boolean;
  };
}

export interface TranscriptionRequest {
  videoId: string;
  videoUrl: string;
  language?: string;
  provider?: string;
  options: {
    speakerDiarization?: boolean;
    punctuation?: boolean;
    timestamps?: boolean;
    confidenceThreshold?: number;
    customVocabulary?: string[];
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata: {
    expectedDuration?: number;
    contentType: string;
    themes: string[];
    culturalContext?: string;
  };
}

export interface TranscriptionResult {
  jobId: string;
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  provider: string;
  language: string;
  confidence: number;
  processingTime: number; // milliseconds
  transcript: {
    text: string;
    segments: TranscriptSegment[];
    speakers?: SpeakerInfo[];
    summary?: string;
    keyTopics: string[];
    wisdomExtracts: WisdomExtract[];
  };
  metadata: {
    wordCount: number;
    speakerCount: number;
    avgConfidence: number;
    detectedLanguage?: string;
    emotions?: EmotionAnalysis[];
  };
  cost: {
    provider: string;
    amount: number; // in cents
    currency: 'USD';
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number;
  text: string;
  confidence: number;
  speakerId?: string;
  emotions?: string[];
  keywords?: string[];
  wisdomIndicators?: number; // 0-1 score
}

export interface SpeakerInfo {
  id: string;
  name?: string;
  role?: string;
  confidence: number;
  segments: string[]; // segment IDs
  characteristics: {
    gender?: 'male' | 'female' | 'unknown';
    ageGroup?: 'young' | 'adult' | 'senior';
    accent?: string;
    emotionalTone?: string[];
  };
}

export interface EmotionAnalysis {
  timestamp: number;
  emotions: Record<string, number>; // emotion -> confidence
  overall: string;
  intensity: number; // 0-1
}

export interface WisdomExtractionConfig {
  enableIndigenousWisdomDetection: boolean;
  enableSystemsThinkingAnalysis: boolean;
  enableMentoringInsights: boolean;
  culturalContexts: string[];
  keyThemes: string[];
  minimumWisdomScore: number; // 0-1
}

class VideoTranscriptionPipeline {
  private providers: Map<string, TranscriptionProvider> = new Map();
  private activeJobs: Map<string, TranscriptionResult> = new Map();
  private jobQueue: TranscriptionRequest[] = [];
  private maxConcurrentJobs: number = 3;
  private processingJobs: Set<string> = new Set();

  constructor() {
    this.setupProviders();
    this.startJobProcessor();
    console.log('🎤 Video Transcription Pipeline initialized');
  }

  /**
   * Queue transcription job for a video
   */
  async queueTranscription(request: TranscriptionRequest): Promise<string> {
    const jobId = `transcription-${request.videoId}-${Date.now()}`;
    
    console.log(`📝 Queuing transcription job: ${jobId} for video: ${request.videoId}`);
    
    // Create initial result object
    const result: TranscriptionResult = {
      jobId,
      videoId: request.videoId,
      status: 'pending',
      provider: request.provider || this.selectBestProvider(request),
      language: request.language || 'en',
      confidence: 0,
      processingTime: 0,
      transcript: {
        text: '',
        segments: [],
        keyTopics: [],
        wisdomExtracts: []
      },
      metadata: {
        wordCount: 0,
        speakerCount: 0,
        avgConfidence: 0
      },
      cost: {
        provider: request.provider || 'auto',
        amount: 0,
        currency: 'USD'
      }
    };

    this.activeJobs.set(jobId, result);
    this.jobQueue.push(request);
    
    // Sort queue by priority
    this.jobQueue.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    console.log(`📋 Job queued. Queue length: ${this.jobQueue.length}`);
    
    return jobId;
  }

  /**
   * Get transcription job status
   */
  getJobStatus(jobId: string): TranscriptionResult | null {
    return this.activeJobs.get(jobId) || null;
  }

  /**
   * Process transcription with wisdom extraction
   */
  async processTranscription(jobId: string): Promise<TranscriptionResult> {
    const result = this.activeJobs.get(jobId);
    if (!result) {
      throw new Error(`Job not found: ${jobId}`);
    }

    console.log(`🎬 Processing transcription job: ${jobId}`);
    
    const startTime = Date.now();
    result.status = 'processing';
    
    try {
      // Get video details
      const video = await this.getVideoDetails(result.videoId);
      if (!video) {
        throw new Error(`Video not found: ${result.videoId}`);
      }

      // Step 1: Extract audio and transcribe
      const transcriptionData = await this.transcribeVideo(video, result.provider);
      
      // Step 2: Process transcript segments
      const processedSegments = await this.processTranscriptSegments(
        transcriptionData.segments,
        video.themes,
        video.contentType
      );

      // Step 3: Extract wisdom and insights
      const wisdomExtracts = await this.extractWisdom(
        transcriptionData.text,
        processedSegments,
        {
          enableIndigenousWisdomDetection: true,
          enableSystemsThinkingAnalysis: true,
          enableMentoringInsights: video.programs.includes('mentoring'),
          culturalContexts: this.detectCulturalContexts(video),
          keyThemes: video.themes,
          minimumWisdomScore: 0.7
        }
      );

      // Step 4: Generate summary and key topics
      const summary = await this.generateSummary(transcriptionData.text, video.contentType);
      const keyTopics = await this.extractKeyTopics(transcriptionData.text, video.themes);

      // Update result
      result.status = 'completed';
      result.confidence = transcriptionData.avgConfidence;
      result.processingTime = Date.now() - startTime;
      result.transcript = {
        text: transcriptionData.text,
        segments: processedSegments,
        speakers: transcriptionData.speakers,
        summary,
        keyTopics,
        wisdomExtracts
      };
      result.metadata = {
        wordCount: transcriptionData.text.split(' ').length,
        speakerCount: transcriptionData.speakers?.length || 1,
        avgConfidence: transcriptionData.avgConfidence,
        detectedLanguage: transcriptionData.detectedLanguage,
        emotions: transcriptionData.emotions
      };
      result.cost = this.calculateCost(video.duration || 'PT10M', result.provider);

      // Update video with transcription
      await this.updateVideoWithTranscription(video, result);

      console.log(`✅ Transcription completed: ${jobId} in ${result.processingTime}ms`);
      
      return result;

    } catch (error) {
      console.error(`❌ Transcription failed: ${jobId}`, error);
      
      result.status = 'failed';
      result.error = {
        code: 'TRANSCRIPTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true
      };
      
      return result;
    }
  }

  /**
   * Extract Indigenous custodianship and cultural insights
   */
  private async extractWisdom(
    text: string,
    segments: TranscriptSegment[],
    config: WisdomExtractionConfig
  ): Promise<WisdomExtract[]> {
    const wisdomExtracts: WisdomExtract[] = [];

    // Indigenous custodianship patterns
    const indigenousWisdomPatterns = [
      /seven generation/i,
      /ancestors?/i,
      /traditional knowledge/i,
      /elder wisdom/i,
      /connection to country/i,
      /circular thinking/i,
      /reciprocity/i,
      /kinship/i,
      /ceremony/i,
      /story telling/i,
      /oral tradition/i
    ];

    // Systems thinking patterns
    const systemsThinkingPatterns = [
      /systems change/i,
      /interconnected/i,
      /holistic approach/i,
      /feedback loop/i,
      /emergent/i,
      /complexity/i,
      /network effect/i,
      /relationships/i,
      /patterns/i
    ];

    // Mentoring insights patterns
    const mentoringPatterns = [
      /mentoring/i,
      /guidance/i,
      /role model/i,
      /inspiration/i,
      /potential/i,
      /growth mindset/i,
      /empowerment/i,
      /support/i,
      /encouragement/i
    ];

    // Process segments for wisdom extraction
    segments.forEach((segment, index) => {
      let wisdomScore = 0;
      const detectedPatterns: string[] = [];
      const wisdomType: string[] = [];

      if (config.enableIndigenousWisdomDetection) {
        indigenousWisdomPatterns.forEach(pattern => {
          if (pattern.test(segment.text)) {
            wisdomScore += 0.3;
            detectedPatterns.push(`indigenous-${pattern.source}`);
            wisdomType.push('indigenous-wisdom');
          }
        });
      }

      if (config.enableSystemsThinkingAnalysis) {
        systemsThinkingPatterns.forEach(pattern => {
          if (pattern.test(segment.text)) {
            wisdomScore += 0.25;
            detectedPatterns.push(`systems-${pattern.source}`);
            wisdomType.push('systems-thinking');
          }
        });
      }

      if (config.enableMentoringInsights) {
        mentoringPatterns.forEach(pattern => {
          if (pattern.test(segment.text)) {
            wisdomScore += 0.2;
            detectedPatterns.push(`mentoring-${pattern.source}`);
            wisdomType.push('mentoring-insight');
          }
        });
      }

      // Check for key themes
      config.keyThemes.forEach(theme => {
        if (segment.text.toLowerCase().includes(theme.toLowerCase())) {
          wisdomScore += 0.15;
          detectedPatterns.push(`theme-${theme}`);
        }
      });

      // If wisdom score meets threshold, create extract
      if (wisdomScore >= config.minimumWisdomScore) {
        wisdomExtracts.push({
          id: `wisdom-${index}`,
          type: wisdomType.join(',') as any,
          content: segment.text,
          timestamp: segment.startTime,
          confidence: Math.min(wisdomScore, 1.0),
          themes: [...new Set(wisdomType)],
          culturalContext: config.culturalContexts[0] || 'global',
          applications: [],
          relatedConcepts: detectedPatterns,
          sourceSegment: segment.id
        });
      }
    });

    // Sort by confidence and timestamp
    wisdomExtracts.sort((a, b) => b.confidence - a.confidence || a.timestamp - b.timestamp);

    console.log(`🧠 Extracted ${wisdomExtracts.length} wisdom insights`);
    
    return wisdomExtracts.slice(0, 10); // Limit to top 10
  }

  /**
   * Generate intelligent summary
   */
  private async generateSummary(text: string, contentType: string): Promise<string> {
    // In a real implementation, this would use an AI service like OpenAI or Claude
    const wordCount = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (wordCount < 100) {
      return text.substring(0, 200) + '...';
    }

    // Extract key sentences based on content type
    let keyPhrases: string[] = [];
    
    switch (contentType) {
      case 'educational':
        keyPhrases = ['learn', 'understand', 'concept', 'principle', 'method', 'approach'];
        break;
      case 'wisdom-sharing':
        keyPhrases = ['wisdom', 'tradition', 'experience', 'insight', 'knowledge', 'teaching'];
        break;
      case 'interview':
        keyPhrases = ['discuss', 'explain', 'share', 'perspective', 'view', 'opinion'];
        break;
      default:
        keyPhrases = ['important', 'key', 'main', 'significant', 'essential'];
    }

    // Find sentences with key phrases
    const importantSentences = sentences.filter(sentence => 
      keyPhrases.some(phrase => sentence.toLowerCase().includes(phrase))
    ).slice(0, 3);

    const summary = importantSentences.length > 0 
      ? importantSentences.join('. ') + '.'
      : sentences.slice(0, 2).join('. ') + '.';

    return summary.length > 300 ? summary.substring(0, 297) + '...' : summary;
  }

  /**
   * Extract key topics using NLP
   */
  private async extractKeyTopics(text: string, existingThemes: string[]): Promise<string[]> {
    const topics = new Set<string>();
    
    // Add existing themes
    existingThemes.forEach(theme => topics.add(theme));
    
    // AIME-specific topic patterns
    const topicPatterns = {
      'indigenous-wisdom': /indigenous|aboriginal|traditional|ancestral|elder/gi,
      'mentoring': /mentor|guide|support|role model|inspiration/gi,
      'systems-thinking': /system|holistic|interconnected|network|complexity/gi,
      'youth-leadership': /youth|young|leader|potential|empowerment/gi,
      'hoodie-economics': /hoodie economics|relational|value|community wealth/gi,
      'education': /education|learning|teaching|knowledge|skill/gi,
      'community': /community|collective|together|collaboration|partnership/gi,
      'transformation': /transform|change|shift|evolution|innovation/gi,
      'storytelling': /story|narrative|tale|sharing|oral tradition/gi,
      'connection': /connection|relationship|bond|link|network/gi
    };

    // Extract topics based on patterns
    Object.entries(topicPatterns).forEach(([topic, pattern]) => {
      const matches = text.match(pattern);
      if (matches && matches.length >= 2) {
        topics.add(topic);
      }
    });

    // Extract frequent nouns (simple implementation)
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      if (!['that', 'this', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'their'].includes(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    // Add frequent words as topics
    Object.entries(frequency)
      .filter(([word, count]) => count >= 3)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([word]) => topics.add(word));

    return Array.from(topics).slice(0, 15);
  }

  /**
   * Private helper methods
   */
  private setupProviders(): void {
    // OpenAI Whisper
    this.providers.set('whisper', {
      id: 'whisper',
      name: 'OpenAI Whisper',
      apiEndpoint: 'https://api.openai.com/v1/audio/transcriptions',
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      maxFileSize: 25, // MB
      costPerMinute: 0.6, // cents
      accuracy: 0.95,
      features: {
        speakerDiarization: false,
        punctuation: true,
        confidence: false,
        timestamps: true,
        emotions: false
      }
    });

    // Google Speech-to-Text
    this.providers.set('google', {
      id: 'google',
      name: 'Google Speech-to-Text',
      apiEndpoint: 'https://speech.googleapis.com/v1/speech:recognize',
      supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar'],
      maxFileSize: 10, // MB for direct API
      costPerMinute: 1.44, // cents
      accuracy: 0.92,
      features: {
        speakerDiarization: true,
        punctuation: true,
        confidence: true,
        timestamps: true,
        emotions: false
      }
    });

    // AssemblyAI
    this.providers.set('assemblyai', {
      id: 'assemblyai',
      name: 'AssemblyAI',
      apiEndpoint: 'https://api.assemblyai.com/v2/transcript',
      supportedLanguages: ['en'],
      maxFileSize: 100, // MB
      costPerMinute: 0.65, // cents
      accuracy: 0.94,
      features: {
        speakerDiarization: true,
        punctuation: true,
        confidence: true,
        timestamps: true,
        emotions: true
      }
    });

    console.log(`🔧 Configured ${this.providers.size} transcription providers`);
  }

  private selectBestProvider(request: TranscriptionRequest): string {
    // Logic to select best provider based on requirements
    if (request.options.speakerDiarization) {
      return 'assemblyai'; // Best for speaker diarization
    }
    
    if (request.language && request.language !== 'en') {
      return 'google'; // Best language support
    }
    
    if (request.priority === 'low') {
      return 'whisper'; // Most cost-effective
    }
    
    return 'assemblyai'; // Default to most feature-rich
  }

  private async transcribeVideo(video: UnifiedVideoContent, provider: string): Promise<any> {
    console.log(`🎤 Transcribing video with ${provider}: ${video.title}`);
    
    // Mock transcription result for now
    // In real implementation, this would call the actual provider APIs
    return {
      text: `This is a transcribed version of ${video.title}. The content discusses ${video.themes.join(', ')} and provides insights into ${video.programs.join(', ')}. This would be the full transcription text extracted from the audio.`,
      segments: [
        {
          id: 'seg-1',
          startTime: 0,
          endTime: 30,
          text: `Welcome to ${video.title}. Today we'll be exploring important concepts.`,
          confidence: 0.95,
          keywords: ['welcome', 'exploring', 'concepts']
        },
        {
          id: 'seg-2', 
          startTime: 30,
          endTime: 60,
          text: 'Indigenous custodianship teaches us about the importance of seven-generation thinking.',
          confidence: 0.92,
          keywords: ['indigenous', 'wisdom', 'seven-generation'],
          wisdomIndicators: 0.9
        },
        {
          id: 'seg-3',
          startTime: 60,
          endTime: 90,
          text: 'Systems thinking helps us understand interconnected relationships and patterns.',
          confidence: 0.94,
          keywords: ['systems', 'thinking', 'interconnected', 'relationships'],
          wisdomIndicators: 0.8
        }
      ],
      speakers: [
        {
          id: 'speaker-1',
          name: 'Presenter',
          confidence: 0.9,
          segments: ['seg-1', 'seg-2', 'seg-3'],
          characteristics: {
            gender: 'unknown',
            emotionalTone: ['educational', 'inspiring']
          }
        }
      ],
      avgConfidence: 0.94,
      detectedLanguage: 'en',
      emotions: [
        {
          timestamp: 15,
          emotions: { confident: 0.8, inspiring: 0.7 },
          overall: 'positive',
          intensity: 0.7
        }
      ]
    };
  }

  private async processTranscriptSegments(
    segments: any[],
    themes: string[],
    contentType: string
  ): Promise<TranscriptSegment[]> {
    return segments.map(segment => ({
      ...segment,
      emotions: segment.emotions || ['neutral'],
      keywords: segment.keywords || [],
      wisdomIndicators: segment.wisdomIndicators || 0
    }));
  }

  private detectCulturalContexts(video: UnifiedVideoContent): string[] {
    const contexts: string[] = [];
    
    if (video.themes.includes('indigenous-wisdom')) {
      contexts.push('indigenous');
    }
    
    if (video.programs.includes('imagi-labs')) {
      contexts.push('imagination-based-learning');
    }
    
    if (video.access.culturalSensitivity !== 'none') {
      contexts.push('culturally-sensitive');
    }
    
    return contexts.length > 0 ? contexts : ['global'];
  }

  private calculateCost(duration: string, provider: string): { provider: string; amount: number; currency: 'USD' } {
    const durationMinutes = this.parseDurationToMinutes(duration);
    const providerInfo = this.providers.get(provider);
    const costPerMinute = providerInfo?.costPerMinute || 1.0;
    
    return {
      provider,
      amount: Math.round(durationMinutes * costPerMinute),
      currency: 'USD'
    };
  }

  private parseDurationToMinutes(duration: string): number {
    // Parse ISO 8601 duration (PT15M30S -> 15.5 minutes)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 10; // Default fallback
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 60 + minutes + seconds / 60;
  }

  private async getVideoDetails(videoId: string): Promise<UnifiedVideoContent | null> {
    const { videos } = unifiedVideoManager.getVideos({ limit: 1000 });
    return videos.find(v => v.id === videoId) || null;
  }

  private async updateVideoWithTranscription(
    video: UnifiedVideoContent,
    result: TranscriptionResult
  ): Promise<void> {
    // Update video with transcription data
    video.transcription = {
      text: result.transcript.text,
      language: result.language,
      confidence: result.confidence,
      keyTopics: result.transcript.keyTopics,
      wisdomExtracts: result.transcript.wisdomExtracts,
      status: 'completed',
      provider: result.provider,
      lastUpdated: new Date().toISOString(),
      segments: result.transcript.segments,
      speakers: result.transcript.speakers,
      summary: result.transcript.summary,
      timestamps: result.transcript.segments.map(seg => ({
        time: seg.startTime,
        text: seg.text
      }))
    };

    // Update sync metadata
    video.syncMetadata.lastSynced = new Date().toISOString();
    video.syncMetadata.syncVersion++;

    // Save back to video manager
    await unifiedVideoManager.addVideo(video);
    
    console.log(`💾 Updated video ${video.id} with transcription data`);
  }

  private startJobProcessor(): void {
    // Process jobs every 5 seconds
    setInterval(() => {
      this.processJobQueue();
    }, 5000);
  }

  private async processJobQueue(): Promise<void> {
    if (this.processingJobs.size >= this.maxConcurrentJobs || this.jobQueue.length === 0) {
      return;
    }

    const request = this.jobQueue.shift();
    if (!request) return;

    const jobId = Array.from(this.activeJobs.entries())
      .find(([, result]) => result.videoId === request.videoId)?.[0];
    
    if (!jobId) return;

    this.processingJobs.add(jobId);
    
    try {
      await this.processTranscription(jobId);
    } catch (error) {
      console.error(`❌ Job processing failed: ${jobId}`, error);
    } finally {
      this.processingJobs.delete(jobId);
    }
  }
}

// Export singleton instance
export const videoTranscriptionPipeline = new VideoTranscriptionPipeline();
export default VideoTranscriptionPipeline;