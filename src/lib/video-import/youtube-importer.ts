/**
 * YouTube Video Import System
 * 
 * Comprehensive system to import, categorize, and process AIME YouTube videos
 * into the IMAGI-NATION TV database with intelligent metadata extraction
 */

import { getVideoDatabase } from '../database/video-database';

export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  defaultLanguage?: string;
  caption?: string;
}

export interface ProcessedVideoMetadata {
  // Core identification
  youtubeId: string;
  title: string;
  description: string;
  
  // Content classification
  contentType: 'educational' | 'inspirational' | 'documentary' | 'interview' | 'workshop' | 'event';
  themes: string[];
  programs: string[];
  ageGroups: string[];
  culturalContexts: string[];
  
  // Quality assessment
  qualityScore: number; // 0-1
  relevanceScore: number; // 0-1
  
  // Technical metadata
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  
  // AI-extracted metadata
  extractedTopics: string[];
  speakerIdentification: string[];
  languageDetected: string;
  accessibilityFeatures: string[];
  
  // AIME-specific categorization
  isImaginationTv: boolean;
  episodeNumber?: number;
  season?: number;
  seriesName?: string;
  mentorsPresent: string[];
  programsReferences: string[];
}

export class YouTubeVideoImporter {
  private db: any;
  private apiKey: string;
  private channelIds: string[];
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || '';
    this.channelIds = [
      'UCfH7_J6bT5nVLz1VJ6z2J4A', // AIME Main Channel
      'UCxYZ123456789ABCDEFG', // AIME Education Channel (example)
      // Add more AIME channel IDs as needed
    ];
    this.initializeDatabase();
  }
  
  private async initializeDatabase() {
    this.db = await getVideoDatabase();
  }
  
  /**
   * Import all videos from AIME YouTube channels
   */
  async importAllVideos(): Promise<{
    imported: number;
    processed: number;
    errors: string[];
  }> {
    await this.initializeDatabase();
    
    let totalImported = 0;
    let totalProcessed = 0;
    const errors: string[] = [];
    
    console.log('🎬 Starting YouTube video import for AIME channels...');
    
    for (const channelId of this.channelIds) {
      try {
        const channelResults = await this.importChannelVideos(channelId);
        totalImported += channelResults.imported;
        totalProcessed += channelResults.processed;
        errors.push(...channelResults.errors);
        
        console.log(`📺 Channel ${channelId}: ${channelResults.imported} imported, ${channelResults.processed} processed`);
      } catch (error) {
        const errorMsg = `Failed to import from channel ${channelId}: ${error}`;
        console.error('❌', errorMsg);
        errors.push(errorMsg);
      }
    }
    
    return {
      imported: totalImported,
      processed: totalProcessed,
      errors
    };
  }
  
  /**
   * Import videos from a specific YouTube channel
   */
  async importChannelVideos(channelId: string, maxResults: number = 500): Promise<{
    imported: number;
    processed: number;
    errors: string[];
  }> {
    const videos = await this.fetchChannelVideos(channelId, maxResults);
    const results = { imported: 0, processed: 0, errors: [] as string[] };
    
    for (const video of videos) {
      try {
        // Check if video already exists
        const existing = await this.db.getEpisodeByYouTubeId(video.id);
        if (existing) {
          console.log(`⏭️  Video ${video.id} already exists, skipping...`);
          continue;
        }
        
        // Process and categorize video
        const metadata = await this.processVideoMetadata(video);
        
        // Import into database
        await this.importVideoToDatabase(metadata);
        
        results.imported++;
        results.processed++;
        
        console.log(`✅ Imported: ${metadata.title}`);
        
        // Add small delay to respect API limits
        await this.delay(100);
        
      } catch (error) {
        const errorMsg = `Failed to process video ${video.id}: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        results.processed++;
      }
    }
    
    return results;
  }
  
  /**
   * Fetch videos from YouTube Data API
   */
  private async fetchChannelVideos(channelId: string, maxResults: number): Promise<YouTubeVideoData[]> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured');
    }
    
    const videos: YouTubeVideoData[] = [];
    let nextPageToken = '';
    
    do {
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
      searchUrl.searchParams.set('key', this.apiKey);
      searchUrl.searchParams.set('channelId', channelId);
      searchUrl.searchParams.set('part', 'snippet');
      searchUrl.searchParams.set('type', 'video');
      searchUrl.searchParams.set('maxResults', '50');
      searchUrl.searchParams.set('order', 'date');
      
      if (nextPageToken) {
        searchUrl.searchParams.set('pageToken', nextPageToken);
      }
      
      const response = await fetch(searchUrl.toString());
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${data.error?.message || response.statusText}`);
      }
      
      // Get detailed video information
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      detailsUrl.searchParams.set('key', this.apiKey);
      detailsUrl.searchParams.set('id', videoIds);
      detailsUrl.searchParams.set('part', 'snippet,contentDetails,statistics');
      
      const detailsResponse = await fetch(detailsUrl.toString());
      const detailsData = await detailsResponse.json();
      
      if (!detailsResponse.ok) {
        throw new Error(`YouTube API error: ${detailsData.error?.message || detailsResponse.statusText}`);
      }
      
      // Process video data
      for (const item of detailsData.items) {
        videos.push({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description || '',
          thumbnails: item.snippet.thumbnails,
          publishedAt: item.snippet.publishedAt,
          duration: item.contentDetails.duration,
          viewCount: parseInt(item.statistics.viewCount || '0'),
          likeCount: parseInt(item.statistics.likeCount || '0'),
          channelTitle: item.snippet.channelTitle,
          tags: item.snippet.tags || [],
          categoryId: item.snippet.categoryId,
          defaultLanguage: item.snippet.defaultLanguage,
          caption: item.contentDetails.caption
        });
      }
      
      nextPageToken = data.nextPageToken || '';
      
    } while (nextPageToken && videos.length < maxResults);
    
    return videos.slice(0, maxResults);
  }
  
  /**
   * Process and extract intelligent metadata from video
   */
  async processVideoMetadata(video: YouTubeVideoData): Promise<ProcessedVideoMetadata> {
    console.log(`🔍 Processing metadata for: ${video.title}`);
    
    const title = video.title.toLowerCase();
    const description = video.description.toLowerCase();
    const tags = (video.tags || []).map(tag => tag.toLowerCase());
    const allText = [title, description, ...tags].join(' ');
    
    // Content type classification
    const contentType = this.classifyContentType(allText);
    
    // Theme extraction
    const themes = this.extractThemes(allText);
    
    // Program identification
    const programs = this.identifyPrograms(allText);
    
    // Age group assessment
    const ageGroups = this.determineAgeGroups(allText);
    
    // Cultural context detection
    const culturalContexts = this.detectCulturalContexts(allText);
    
    // IMAGI-NATION TV detection
    const imaginationTvData = this.detectImaginationTvContent(allText, video.title);
    
    // Quality assessment
    const qualityScore = this.assessVideoQuality(video);
    const relevanceScore = this.assessRelevanceScore(allText, themes);
    
    // Duration processing
    const durationSeconds = this.parseYouTubeDuration(video.duration);
    
    // Speaker identification
    const speakers = this.identifySpeakers(allText);
    
    // Extract topics
    const extractedTopics = this.extractTopics(allText);
    
    return {
      youtubeId: video.id,
      title: video.title,
      description: video.description,
      
      contentType,
      themes,
      programs,
      ageGroups,
      culturalContexts,
      
      qualityScore,
      relevanceScore,
      
      duration: video.duration,
      durationSeconds,
      thumbnailUrl: this.selectBestThumbnail(video.thumbnails),
      viewCount: video.viewCount,
      likeCount: video.likeCount,
      publishedAt: video.publishedAt,
      
      extractedTopics,
      speakerIdentification: speakers,
      languageDetected: video.defaultLanguage || 'en',
      accessibilityFeatures: video.caption === 'true' ? ['captions'] : [],
      
      isImaginationTv: imaginationTvData.isImaginationTv,
      episodeNumber: imaginationTvData.episodeNumber,
      season: imaginationTvData.season,
      seriesName: imaginationTvData.seriesName,
      mentorsPresent: speakers.filter(speaker => this.isKnownMentor(speaker)),
      programsReferences: programs
    };
  }
  
  /**
   * Classify video content type based on content analysis
   */
  private classifyContentType(text: string): 'educational' | 'inspirational' | 'documentary' | 'interview' | 'workshop' | 'event' {
    const patterns = {
      workshop: ['workshop', 'training', 'hands-on', 'practical', 'session', 'masterclass'],
      interview: ['interview', 'conversation', 'chat with', 'talks with', 'discussion with'],
      documentary: ['documentary', 'story of', 'journey of', 'behind the scenes', 'documentary'],
      event: ['conference', 'summit', 'gathering', 'ceremony', 'celebration', 'launch'],
      inspirational: ['inspiration', 'motivational', 'inspiring', 'hope', 'dream', 'vision'],
      educational: ['learn', 'education', 'teaching', 'knowledge', 'understanding', 'explain']
    };
    
    for (const [type, keywords] of Object.entries(patterns)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches >= 2) {
        return type as any;
      }
    }
    
    // Default to educational for AIME content
    return 'educational';
  }
  
  /**
   * Extract relevant themes from video content
   */
  private extractThemes(text: string): string[] {
    const themePatterns = {
      'imagination': ['imagination', 'creative', 'dreaming', 'vision', 'possibility'],
      'mentoring': ['mentor', 'mentoring', 'guidance', 'support', 'relationship'],
      'indigenous-wisdom': ['indigenous', 'traditional', 'cultural', 'elder', 'ceremony', 'dreaming'],
      'systems-thinking': ['systems', 'holistic', 'interconnected', 'complexity', 'relationships'],
      'youth-leadership': ['youth', 'young', 'leadership', 'student', 'emerging'],
      'education': ['education', 'learning', 'teaching', 'school', 'university'],
      'social-change': ['change', 'transformation', 'impact', 'social', 'justice'],
      'innovation': ['innovation', 'creative', 'new', 'breakthrough', 'pioneering'],
      'community': ['community', 'collective', 'together', 'collaboration', 'network'],
      'economics': ['economics', 'economic', 'financial', 'hoodie economics', 'value']
    };
    
    const themes: string[] = [];
    
    for (const [theme, keywords] of Object.entries(themePatterns)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > 0) {
        themes.push(theme);
      }
    }
    
    return themes;
  }
  
  /**
   * Identify AIME programs mentioned in content
   */
  private identifyPrograms(text: string): string[] {
    const programPatterns = {
      'imagi-labs': ['imagi-labs', 'imagi labs', 'imagination labs'],
      'mentoring': ['mentoring program', 'mentor program', 'mentoring'],
      'joy-corps': ['joy corps', 'joy-corps', 'joycorps'],
      'custodians': ['custodians', 'custodian program'],
      'citizens': ['citizens', 'citizen program'],
      'presidents': ['presidents', 'president program'],
      'hoodie-economics': ['hoodie economics', 'hoodie-economics'],
      'systems-residency': ['systems residency', 'residency program']
    };
    
    const programs: string[] = [];
    
    for (const [program, patterns] of Object.entries(programPatterns)) {
      const hasMatch = patterns.some(pattern => text.includes(pattern));
      if (hasMatch) {
        programs.push(program);
      }
    }
    
    return programs;
  }
  
  /**
   * Determine appropriate age groups for content
   */
  private determineAgeGroups(text: string): string[] {
    const agePatterns = {
      '13-17': ['high school', 'teenager', 'teen', 'secondary', 'youth'],
      '18-25': ['university', 'college', 'undergraduate', 'young adult'],
      '26+': ['professional', 'adult', 'leader', 'executive', 'mentor']
    };
    
    const ageGroups: string[] = [];
    
    for (const [group, keywords] of Object.entries(agePatterns)) {
      const hasMatch = keywords.some(keyword => text.includes(keyword));
      if (hasMatch) {
        ageGroups.push(group);
      }
    }
    
    // Default to broad audience if no specific indicators
    if (ageGroups.length === 0) {
      return ['13+'];
    }
    
    return ageGroups;
  }
  
  /**
   * Detect cultural contexts and sensitivity requirements
   */
  private detectCulturalContexts(text: string): string[] {
    const culturalPatterns = {
      'Indigenous': ['indigenous', 'aboriginal', 'first nations', 'native', 'traditional'],
      'Global': ['international', 'global', 'worldwide', 'cross-cultural'],
      'Australian': ['australia', 'australian', 'aussie'],
      'African': ['africa', 'african'],
      'Pacific': ['pacific', 'pacific islands', 'oceania']
    };
    
    const contexts: string[] = [];
    
    for (const [context, keywords] of Object.entries(culturalPatterns)) {
      const hasMatch = keywords.some(keyword => text.includes(keyword));
      if (hasMatch) {
        contexts.push(context);
      }
    }
    
    // Default to Global if no specific cultural markers
    if (contexts.length === 0) {
      contexts.push('Global');
    }
    
    return contexts;
  }
  
  /**
   * Detect if content belongs to IMAGI-NATION TV series
   */
  private detectImaginationTvContent(text: string, title: string): {
    isImaginationTv: boolean;
    episodeNumber?: number;
    season?: number;
    seriesName?: string;
  } {
    const imaginationTvPatterns = [
      'imagi-nation tv',
      'imagination tv',
      'imagi nation tv',
      'imagination nation tv'
    ];
    
    const isImaginationTv = imaginationTvPatterns.some(pattern => 
      text.includes(pattern) || title.toLowerCase().includes(pattern)
    );
    
    if (!isImaginationTv) {
      return { isImaginationTv: false };
    }
    
    // Try to extract episode and season numbers
    const episodeMatch = title.match(/episode\s*(\d+)/i) || text.match(/episode\s*(\d+)/i);
    const seasonMatch = title.match(/season\s*(\d+)/i) || text.match(/season\s*(\d+)/i);
    
    return {
      isImaginationTv: true,
      episodeNumber: episodeMatch ? parseInt(episodeMatch[1]) : undefined,
      season: seasonMatch ? parseInt(seasonMatch[1]) : 1,
      seriesName: 'IMAGI-NATION TV'
    };
  }
  
  /**
   * Assess video quality based on various metrics
   */
  private assessVideoQuality(video: YouTubeVideoData): number {
    let score = 0.5; // Base score
    
    // Title quality (clear, descriptive)
    if (video.title.length > 10 && video.title.length < 100) score += 0.1;
    if (!/\b(test|tmp|temp)\b/i.test(video.title)) score += 0.1;
    
    // Description quality
    if (video.description.length > 50) score += 0.1;
    if (video.description.length > 200) score += 0.1;
    
    // Engagement metrics
    if (video.viewCount > 100) score += 0.1;
    if (video.viewCount > 1000) score += 0.1;
    if (video.likeCount > 10) score += 0.05;
    
    // Duration appropriateness (not too short, not too long)
    const duration = this.parseYouTubeDuration(video.duration);
    if (duration > 120 && duration < 3600) score += 0.1; // 2 min to 1 hour
    
    // Has captions
    if (video.caption === 'true') score += 0.1;
    
    // Has tags
    if (video.tags && video.tags.length > 0) score += 0.05;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Assess relevance to AIME content and mission
   */
  private assessRelevanceScore(text: string, themes: string[]): number {
    let score = 0;
    
    // Core AIME themes
    const coreThemes = ['imagination', 'mentoring', 'indigenous-wisdom', 'education', 'youth-leadership'];
    const coreThemeMatches = themes.filter(theme => coreThemes.includes(theme)).length;
    score += (coreThemeMatches / coreThemes.length) * 0.5;
    
    // AIME-specific terms
    const aimeTerms = ['aime', 'jack manning bancroft', 'imagination', 'mentoring', 'indigenous'];
    const aimeMatches = aimeTerms.filter(term => text.includes(term)).length;
    score += (aimeMatches / aimeTerms.length) * 0.3;
    
    // Educational/inspirational content indicators
    const positiveIndicators = ['learn', 'inspire', 'transform', 'change', 'growth', 'potential'];
    const positiveMatches = positiveIndicators.filter(indicator => text.includes(indicator)).length;
    score += Math.min(positiveMatches * 0.05, 0.2);
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Parse YouTube duration format (PT4M13S) to seconds
   */
  private parseYouTubeDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  /**
   * Select best quality thumbnail
   */
  private selectBestThumbnail(thumbnails: any): string {
    if (thumbnails.maxres) return thumbnails.maxres.url;
    if (thumbnails.high) return thumbnails.high.url;
    if (thumbnails.medium) return thumbnails.medium.url;
    if (thumbnails.default) return thumbnails.default.url;
    return '';
  }
  
  /**
   * Identify speakers/presenters in content
   */
  private identifySpeakers(text: string): string[] {
    const knownSpeakers = [
      'jack manning bancroft',
      'jack bancroft',
      'jack manning',
      'aime team',
      'mentor',
      'elder'
    ];
    
    const speakers: string[] = [];
    
    for (const speaker of knownSpeakers) {
      if (text.includes(speaker)) {
        speakers.push(speaker);
      }
    }
    
    // Extract "with [name]" patterns
    const withMatches = text.match(/with\s+([a-z\s]+)/g);
    if (withMatches) {
      for (const match of withMatches) {
        const name = match.replace('with ', '').trim();
        if (name.length > 2 && name.length < 50) {
          speakers.push(name);
        }
      }
    }
    
    return [...new Set(speakers)]; // Remove duplicates
  }
  
  /**
   * Extract key topics using keyword analysis
   */
  private extractTopics(text: string): string[] {
    const topicPatterns = {
      'seven-generation-thinking': ['seven generation', 'long term', 'future impact'],
      'relationship-building': ['relationship', 'connection', 'trust', 'rapport'],
      'potential-development': ['potential', 'capacity', 'capability', 'talent'],
      'systems-change': ['systems change', 'transformation', 'systemic'],
      'cultural-bridge': ['cultural bridge', 'cross-cultural', 'bridge building'],
      'innovation-methods': ['innovation', 'creative methods', 'new approaches'],
      'storytelling': ['story', 'narrative', 'sharing', 'storytelling'],
      'leadership-development': ['leadership', 'leader', 'leading', 'guide']
    };
    
    const topics: string[] = [];
    
    for (const [topic, keywords] of Object.entries(topicPatterns)) {
      const hasMatch = keywords.some(keyword => text.includes(keyword));
      if (hasMatch) {
        topics.push(topic);
      }
    }
    
    return topics;
  }
  
  /**
   * Check if speaker is a known AIME mentor/leader
   */
  private isKnownMentor(speaker: string): boolean {
    const knownMentors = [
      'jack manning bancroft',
      'jack bancroft',
      'aime team'
    ];
    
    return knownMentors.some(mentor => 
      speaker.toLowerCase().includes(mentor.toLowerCase())
    );
  }
  
  /**
   * Import processed video into IMAGI-NATION TV database
   */
  async importVideoToDatabase(metadata: ProcessedVideoMetadata): Promise<string> {
    await this.initializeDatabase();
    
    let episodeId: string;
    
    if (metadata.isImaginationTv && metadata.episodeNumber) {
      // This is an official IMAGI-NATION TV episode
      episodeId = `imagi-tv-s${metadata.season || 1}e${metadata.episodeNumber}`;
    } else {
      // This is general AIME video content
      episodeId = `aime-video-${metadata.youtubeId}`;
    }
    
    // Create episode entry
    await this.db.createEpisode({
      id: episodeId,
      episode_number: metadata.episodeNumber || 0,
      season: metadata.season || 1,
      title: metadata.title,
      description: metadata.description,
      video_url: `https://www.youtube.com/watch?v=${metadata.youtubeId}`,
      youtube_id: metadata.youtubeId,
      duration_seconds: metadata.durationSeconds,
      duration_iso: metadata.duration,
      thumbnail_url: metadata.thumbnailUrl,
      published_at: metadata.publishedAt,
      status: metadata.qualityScore > 0.6 ? 'published' : 'draft',
      content_type: metadata.contentType,
      themes: metadata.themes,
      programs: metadata.programs,
      learning_objectives: this.generateLearningObjectives(metadata),
      age_groups: metadata.ageGroups,
      cultural_contexts: metadata.culturalContexts,
      access_level: 'public',
      cultural_sensitivity: this.determineCulturalSensitivity(metadata.culturalContexts),
      has_transcription: metadata.accessibilityFeatures.includes('captions'),
      transcription_status: 'pending',
      wisdom_extracts_count: 0,
      key_topics: metadata.extractedTopics,
      view_count: Math.floor(metadata.viewCount * 0.1), // Scale down for internal tracking
      like_count: metadata.likeCount,
      discussion_count: 0,
      reflection_count: 0
    });
    
    // Queue processing jobs for transcription and analysis
    if (metadata.accessibilityFeatures.includes('captions')) {
      await this.db.createProcessingJob({
        episode_id: episodeId,
        job_type: 'transcription',
        priority: 'medium',
        provider: 'youtube-captions',
        input_data: {
          youtubeId: metadata.youtubeId,
          duration: metadata.duration
        }
      });
    }
    
    // Queue wisdom extraction
    await this.db.createProcessingJob({
      episode_id: episodeId,
      job_type: 'wisdom-extraction',
      priority: 'low',
      provider: 'internal',
      input_data: {
        themes: metadata.themes,
        topics: metadata.extractedTopics,
        culturalContext: metadata.culturalContexts
      }
    });
    
    return episodeId;
  }
  
  /**
   * Generate learning objectives based on metadata
   */
  private generateLearningObjectives(metadata: ProcessedVideoMetadata): string[] {
    const objectives: string[] = [];
    
    // Theme-based objectives
    if (metadata.themes.includes('imagination')) {
      objectives.push('Explore the power of imagination in creating positive change');
    }
    
    if (metadata.themes.includes('mentoring')) {
      objectives.push('Understand effective mentoring relationships and practices');
    }
    
    if (metadata.themes.includes('indigenous-wisdom')) {
      objectives.push('Learn from Indigenous knowledge systems and perspectives');
    }
    
    if (metadata.themes.includes('systems-thinking')) {
      objectives.push('Develop systems thinking approaches to complex challenges');
    }
    
    // Content type objectives
    if (metadata.contentType === 'workshop') {
      objectives.push('Gain practical skills and tools for implementation');
    }
    
    if (metadata.contentType === 'interview') {
      objectives.push('Hear diverse perspectives and experiences from community leaders');
    }
    
    // Default if no specific objectives
    if (objectives.length === 0) {
      objectives.push('Gain insights into AIME\'s approach to education and social change');
    }
    
    return objectives;
  }
  
  /**
   * Determine cultural sensitivity level
   */
  private determineCulturalSensitivity(culturalContexts: string[]): 'none' | 'advisory' | 'permission-required' {
    if (culturalContexts.includes('Indigenous')) {
      return 'advisory'; // Indigenous content should be approached with cultural respect
    }
    
    return 'none';
  }
  
  /**
   * Add delay for API rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const youtubeImporter = new YouTubeVideoImporter();