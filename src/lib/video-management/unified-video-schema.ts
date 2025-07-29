/**
 * Unified Video Content Schema for AIME Knowledge System
 * 
 * This schema unifies video content from multiple sources:
 * - YouTube (AIME channels, IMAGI-NATION TV)
 * - Airtable (Digital Assets, Tools)
 * - Direct uploads
 */

export interface UnifiedVideoContent {
  // Core identification
  id: string;
  source: 'youtube' | 'airtable' | 'imagination-tv' | 'direct-upload' | 'other';
  sourceId: string; // Original ID from source system
  sourceUrl?: string; // Original URL from source
  
  // Content metadata
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string; // ISO 8601 duration format (PT4M13S)
  publishedAt: string; // ISO 8601 date
  updatedAt: string;
  
  // AIME-specific categorization
  contentType: 'educational' | 'wisdom-sharing' | 'case-study' | 'methodology' | 'ceremony' | 'interview' | 'presentation';
  themes: string[]; // ['indigenous-wisdom', 'systems-thinking', 'youth-leadership', 'hoodie-economics']
  programs: string[]; // ['joy-corps', 'imagi-labs', 'mentoring', 'custodians', 'citizens']
  topics: string[]; // Extracted topics/keywords
  
  // Content analysis
  language: string; // Primary language (ISO 639-1)
  speakers?: Array<{
    name: string;
    role?: string;
    organization?: string;
    timeSegments?: Array<{start: number, end: number}>; // In seconds
  }>;
  
  // Knowledge extraction
  transcription?: VideoTranscription;
  
  // Integration with knowledge system
  knowledgeConnections: Array<{
    documentId: string;
    documentTitle: string;
    relationshipType: 'references' | 'expands-on' | 'example-of' | 'contradicts' | 'builds-upon';
    relevanceScore: number; // 0-1
    specificSegments?: Array<{
      videoTime: number;
      documentSection: string;
      description: string;
    }>;
  }>;
  
  // Video technical metadata
  technical: {
    resolution?: string; // e.g., "1920x1080"
    bitrate?: number;
    format?: string; // e.g., "mp4", "webm"
    fileSize?: number; // in bytes
    quality: 'high' | 'medium' | 'low';
  };
  
  // Access and permissions
  access: {
    level: 'public' | 'community' | 'internal' | 'restricted';
    ageAppropriate: boolean;
    culturalSensitivity: 'none' | 'advisory' | 'permission-required';
    regions?: string[]; // Geographic restrictions if any
  };
  
  // Engagement and analytics
  analytics: {
    viewCount: number;
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
    averageWatchTime?: number; // in seconds
    engagementRate?: number; // 0-1
    lastAnalyticsUpdate: string;
  };
  
  // IMAGI-NATION TV specific
  imaginationTv?: {
    episodeNumber?: number;
    season?: number;
    series?: string;
    segments: Array<{
      type: 'introduction' | 'story' | 'wisdom' | 'activity' | 'reflection' | 'discussion';
      startTime: number;
      endTime: number;
      title: string;
      description: string;
      relatedContent: string[]; // Links to other AIME resources
      discussionPrompts?: string[];
    }>;
    learningObjectives: string[];
    ageGroups: string[]; // e.g., ['8-12', '13-17', '18+']
    culturalContexts: string[];
    followUpActivities: string[];
    communityFeatures: {
      allowComments: boolean;
      allowDiscussion: boolean;
      moderationRequired: boolean;
    };
  };
  
  // Sync and management metadata
  syncMetadata: {
    lastSynced: string;
    syncSource: string; // Which API/system it was synced from
    syncVersion: number;
    errors?: string[];
    needsReview: boolean;
    autoProcessed: boolean;
  };
}

export interface WisdomExtract {
  id: string;
  type: 'indigenous-wisdom' | 'systems-thinking' | 'mentoring-insight' | 'principle' | 'story' | 'methodology' | 'reflection' | 'teaching' | 'ceremony';
  content: string;
  timestamp: number; // Start time in seconds
  confidence: number; // 0-1
  themes: string[];
  culturalContext: string;
  applications: string[];
  relatedConcepts: string[];
  sourceSegment?: string;
  endTime?: number; // End time in seconds
  speaker?: string;
  relevanceScore?: number; // 0-1 (backward compatibility)
  discussionPrompts?: string[];
}

export interface VideoTranscription {
  text: string;
  language: string;
  confidence: number;
  keyTopics: string[];
  wisdomExtracts: WisdomExtract[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider?: string;
  lastUpdated: string;
  segments?: TranscriptSegment[];
  speakers?: SpeakerInfo[];
  summary?: string;
  timestamps?: Array<{
    time: number;
    text: string;
  }>;
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

export interface VideoSearchResult extends UnifiedVideoContent {
  relevanceScore: number;
  matchedTerms: string[];
  matchedSegments?: Array<{
    timestamp: number;
    duration: number;
    content: string;
    relevance: number;
  }>;
}

export interface VideoProcessingJob {
  id: string;
  videoId: string;
  type: 'transcription' | 'analysis' | 'sync' | 'extraction' | 'quality-check';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface VideoChannel {
  id: string;
  name: string;
  platform: 'youtube' | 'vimeo' | 'other';
  platformChannelId: string;
  description?: string;
  isAimeOfficial: boolean;
  contentType: 'mixed' | 'educational' | 'entertainment' | 'ceremonies' | 'documentation';
  syncEnabled: boolean;
  lastSyncAt?: string;
  videoCount: number;
  subscriberCount?: number;
  config: {
    autoTranscribe: boolean;
    autoAnalyze: boolean;
    defaultAccessLevel: UnifiedVideoContent['access']['level'];
    defaultThemes: string[];
    moderationRequired: boolean;
  };
}

// Type guards for schema validation
export function isUnifiedVideoContent(obj: any): obj is UnifiedVideoContent {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.sourceId === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.url === 'string' &&
    Array.isArray(obj.themes) &&
    Array.isArray(obj.programs) &&
    Array.isArray(obj.topics)
  );
}

export function isWisdomExtract(obj: any): obj is WisdomExtract {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.content === 'string' &&
    typeof obj.category === 'string' &&
    Array.isArray(obj.themes)
  );
}

// Utility functions for working with video content
export class VideoContentUtils {
  static parseDuration(duration: string): number {
    // Parse ISO 8601 duration (PT4M13S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `PT${hours}H${minutes}M${secs}S`;
    } else if (minutes > 0) {
      return `PT${minutes}M${secs}S`;
    } else {
      return `PT${secs}S`;
    }
  }
  
  static generateVideoId(source: string, sourceId: string): string {
    return `${source}-${sourceId}`;
  }
  
  static extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
  static isValidVideoUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'imagination.tv'];
      return validDomains.some(domain => parsedUrl.hostname.includes(domain));
    } catch {
      return false;
    }
  }
  
  static categorizeByTitle(title: string): {
    contentType: UnifiedVideoContent['contentType'];
    themes: string[];
    programs: string[];
  } {
    const titleLower = title.toLowerCase();
    
    // Content type detection
    let contentType: UnifiedVideoContent['contentType'] = 'educational';
    if (titleLower.includes('wisdom') || titleLower.includes('elder') || titleLower.includes('teaching')) {
      contentType = 'wisdom-sharing';
    } else if (titleLower.includes('case study') || titleLower.includes('example') || titleLower.includes('success')) {
      contentType = 'case-study';
    } else if (titleLower.includes('methodology') || titleLower.includes('framework') || titleLower.includes('approach')) {
      contentType = 'methodology';
    } else if (titleLower.includes('ceremony') || titleLower.includes('ritual') || titleLower.includes('sacred')) {
      contentType = 'ceremony';
    } else if (titleLower.includes('interview') || titleLower.includes('conversation') || titleLower.includes('discussion')) {
      contentType = 'interview';
    }
    
    // Theme detection
    const themes: string[] = [];
    if (titleLower.includes('indigenous') || titleLower.includes('first nations') || titleLower.includes('aboriginal')) {
      themes.push('indigenous-wisdom');
    }
    if (titleLower.includes('system') || titleLower.includes('holistic') || titleLower.includes('interconnect')) {
      themes.push('systems-thinking');
    }
    if (titleLower.includes('youth') || titleLower.includes('young') || titleLower.includes('student')) {
      themes.push('youth-leadership');
    }
    if (titleLower.includes('hoodie') || titleLower.includes('economic') || titleLower.includes('value')) {
      themes.push('hoodie-economics');
    }
    if (titleLower.includes('mentor') || titleLower.includes('coaching') || titleLower.includes('guidance')) {
      themes.push('mentoring');
    }
    
    // Program detection
    const programs: string[] = [];
    if (titleLower.includes('joy corps') || titleLower.includes('joycorps')) {
      programs.push('joy-corps');
    }
    if (titleLower.includes('imagi') || titleLower.includes('imagination')) {
      programs.push('imagi-labs');
    }
    if (titleLower.includes('custodian')) {
      programs.push('custodians');
    }
    if (titleLower.includes('citizen')) {
      programs.push('citizens');
    }
    if (titleLower.includes('mentor')) {
      programs.push('mentoring');
    }
    
    return { contentType, themes, programs };
  }
}

export default UnifiedVideoContent;