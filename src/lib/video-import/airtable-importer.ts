/**
 * Airtable Video Import System
 * 
 * Integrates with AIME's Airtable database to import video assets and metadata
 * into the IMAGI-NATION TV system with intelligent categorization
 */

import { getVideoDatabase } from '../database/video-database';

export interface AirtableVideoRecord {
  id: string;
  fields: {
    Title?: string;
    Description?: string;
    'Video URL'?: string;
    'YouTube ID'?: string;
    'Vimeo ID'?: string;
    'Video Type'?: string;
    Category?: string[];
    Tags?: string[];
    'Publish Date'?: string;
    Duration?: string;
    Thumbnail?: {
      id: string;
      url: string;
      filename: string;
    }[];
    'Program Association'?: string[];
    'Age Group'?: string[];
    'Cultural Context'?: string[];
    'Quality Rating'?: number;
    'Approval Status'?: string;
    'Featured Video'?: boolean;
    'Series Name'?: string;
    'Episode Number'?: number;
    'Season'?: number;
    'Speakers/Presenters'?: string[];
    'Learning Objectives'?: string[];
    'Accessibility Features'?: string[];
    'Language'?: string;
    'Content Warnings'?: string[];
    'Related Documents'?: string[];
    Notes?: string;
  };
  createdTime: string;
}

export interface ProcessedAirtableVideo {
  airtableId: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeId?: string;
  vimeoId?: string;
  
  // Metadata from Airtable
  videoType: string;
  category: string[];
  tags: string[];
  publishDate: string;
  duration?: string;
  thumbnailUrl?: string;
  
  // AIME-specific data
  programAssociation: string[];
  ageGroup: string[];
  culturalContext: string[];
  qualityRating: number;
  approvalStatus: string;
  featured: boolean;
  
  // Series information
  seriesName?: string;
  episodeNumber?: number;
  season?: number;
  
  // Educational metadata
  speakers: string[];
  learningObjectives: string[];
  accessibilityFeatures: string[];
  language: string;
  contentWarnings: string[];
  relatedDocuments: string[];
  
  // Processing metadata
  isImaginationTv: boolean;
  themes: string[];
  programs: string[];
  relevanceScore: number;
  
  notes?: string;
  createdTime: string;
}

export class AirtableVideoImporter {
  private db: any;
  private apiKey: string;
  private baseId: string;
  private tableId: string;
  
  constructor(apiKey?: string, baseId?: string, tableId?: string) {
    this.apiKey = apiKey || process.env.AIRTABLE_API_KEY || '';
    this.baseId = baseId || process.env.AIRTABLE_BASE_ID || '';
    this.tableId = tableId || 'Video Assets'; // Default table name
    this.initializeDatabase();
  }
  
  private async initializeDatabase() {
    this.db = await getVideoDatabase();
  }
  
  /**
   * Import all approved videos from Airtable
   */
  async importAllVideos(): Promise<{
    imported: number;
    processed: number;
    skipped: number;
    errors: string[];
  }> {
    await this.initializeDatabase();
    
    console.log('📋 Starting Airtable video import...');
    
    const videos = await this.fetchAirtableVideos();
    const results = { imported: 0, processed: 0, skipped: 0, errors: [] as string[] };
    
    for (const video of videos) {
      try {
        // Check if video already exists
        const existing = await this.checkExistingVideo(video);
        if (existing) {
          console.log(`⏭️  Video "${video.fields.Title}" already exists, skipping...`);
          results.skipped++;
          continue;
        }
        
        // Process video metadata
        const processedVideo = await this.processAirtableVideo(video);
        
        // Only import approved videos
        if (processedVideo.approvalStatus !== 'Approved') {
          console.log(`⏸️  Video "${processedVideo.title}" not approved, skipping...`);
          results.skipped++;
          continue;
        }
        
        // Import into IMAGI-NATION TV database
        await this.importVideoToDatabase(processedVideo);
        
        results.imported++;
        results.processed++;
        
        console.log(`✅ Imported from Airtable: ${processedVideo.title}`);
        
      } catch (error) {
        const errorMsg = `Failed to process Airtable video ${video.id}: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        results.processed++;
      }
    }
    
    return results;
  }
  
  /**
   * Fetch videos from Airtable API
   */
  private async fetchAirtableVideos(): Promise<AirtableVideoRecord[]> {
    if (!this.apiKey || !this.baseId) {
      throw new Error('Airtable API key and base ID not configured');
    }
    
    const videos: AirtableVideoRecord[] = [];
    let offset = '';
    
    do {
      const url = new URL(`https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableId)}`);
      url.searchParams.set('pageSize', '100');
      url.searchParams.set('filterByFormula', 'NOT({Video URL} = "")'); // Only records with video URLs
      
      if (offset) {
        url.searchParams.set('offset', offset);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      videos.push(...data.records);
      offset = data.offset || '';
      
    } while (offset);
    
    console.log(`📋 Fetched ${videos.length} videos from Airtable`);
    return videos;
  }
  
  /**
   * Check if video already exists in database
   */
  private async checkExistingVideo(video: AirtableVideoRecord): Promise<boolean> {
    const fields = video.fields;
    
    // Check by YouTube ID
    if (fields['YouTube ID']) {
      const existing = await this.db.getEpisodeByYouTubeId(fields['YouTube ID']);
      if (existing) return true;
    }
    
    // Check by Airtable ID
    try {
      const existing = await this.db.getEpisode(`airtable-${video.id}`);
      if (existing) return true;
    } catch (error) {
      // Episode doesn't exist, which is fine
    }
    
    // Check by title (fuzzy match)
    if (fields.Title) {
      const { episodes } = await this.db.getEpisodes({ limit: 1000 });
      const titleMatch = episodes.find((ep: any) => 
        ep.title.toLowerCase().trim() === fields.Title!.toLowerCase().trim()
      );
      if (titleMatch) return true;
    }
    
    return false;
  }
  
  /**
   * Process Airtable video record into standardized format
   */
  async processAirtableVideo(video: AirtableVideoRecord): Promise<ProcessedAirtableVideo> {
    const fields = video.fields;
    
    console.log(`🔍 Processing Airtable video: ${fields.Title}`);
    
    // Extract video IDs from URL
    const { youtubeId, vimeoId } = this.extractVideoIds(fields['Video URL'] || '');
    
    // Determine if this is IMAGI-NATION TV content
    const isImaginationTv = this.isImaginationTvContent(fields);
    
    // Extract themes from categories and tags
    const themes = this.extractThemesFromAirtable(fields);
    
    // Map programs from Airtable categories
    const programs = this.mapAirtablePrograms(fields['Program Association'] || []);
    
    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(fields, themes);
    
    return {
      airtableId: video.id,
      title: fields.Title || 'Untitled Video',
      description: fields.Description || '',
      videoUrl: fields['Video URL'] || '',
      youtubeId,
      vimeoId,
      
      videoType: fields['Video Type'] || 'educational',
      category: fields.Category || [],
      tags: fields.Tags || [],
      publishDate: fields['Publish Date'] || video.createdTime,
      duration: fields.Duration,
      thumbnailUrl: fields.Thumbnail?.[0]?.url,
      
      programAssociation: fields['Program Association'] || [],
      ageGroup: fields['Age Group'] || [],
      culturalContext: fields['Cultural Context'] || ['Global'],
      qualityRating: fields['Quality Rating'] || 0.5,
      approvalStatus: fields['Approval Status'] || 'Pending',
      featured: fields['Featured Video'] || false,
      
      seriesName: fields['Series Name'],
      episodeNumber: fields['Episode Number'],
      season: fields['Season'] || 1,
      
      speakers: fields['Speakers/Presenters'] || [],
      learningObjectives: fields['Learning Objectives'] || [],
      accessibilityFeatures: fields['Accessibility Features'] || [],
      language: fields['Language'] || 'en',
      contentWarnings: fields['Content Warnings'] || [],
      relatedDocuments: fields['Related Documents'] || [],
      
      isImaginationTv,
      themes,
      programs,
      relevanceScore,
      
      notes: fields.Notes,
      createdTime: video.createdTime
    };
  }
  
  /**
   * Extract YouTube and Vimeo IDs from URLs
   */
  private extractVideoIds(url: string): { youtubeId?: string; vimeoId?: string } {
    let youtubeId: string | undefined;
    let vimeoId: string | undefined;
    
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        youtubeId = match[1];
        break;
      }
    }
    
    // Vimeo patterns
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ];
    
    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern);
      if (match) {
        vimeoId = match[1];
        break;
      }
    }
    
    return { youtubeId, vimeoId };
  }
  
  /**
   * Determine if content belongs to IMAGI-NATION TV
   */
  private isImaginationTvContent(fields: any): boolean {
    const seriesName = fields['Series Name']?.toLowerCase() || '';
    const title = fields.Title?.toLowerCase() || '';
    const category = (fields.Category || []).map((c: string) => c.toLowerCase());
    
    return seriesName.includes('imagi-nation tv') ||
           seriesName.includes('imagination tv') ||
           title.includes('imagi-nation tv') ||
           title.includes('imagination tv') ||
           category.includes('imagi-nation tv') ||
           category.includes('imagination tv');
  }
  
  /**
   * Extract themes from Airtable categories and tags
   */
  private extractThemesFromAirtable(fields: any): string[] {
    const themes = new Set<string>();
    
    // Map categories to themes
    const categoryMappings = {
      'Education': 'education',
      'Mentoring': 'mentoring',
      'Indigenous Custodianship': 'indigenous-custodianship',
      'Indigenous Knowledge': 'indigenous-wisdom',
      'Systems Thinking': 'systems-thinking',
      'Youth Leadership': 'youth-leadership',
      'Innovation': 'innovation',
      'Community': 'community',
      'Social Change': 'social-change',
      'Imagination': 'imagination',
      'Storytelling': 'storytelling',
      'Economics': 'economics',
      'Hoodie Economics': 'hoodie-economics'
    };
    
    // Process categories
    const categories = fields.Category || [];
    for (const category of categories) {
      const theme = categoryMappings[category as keyof typeof categoryMappings];
      if (theme) {
        themes.add(theme);
      }
    }
    
    // Process tags
    const tags = fields.Tags || [];
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      
      // Direct theme mapping
      if (Object.values(categoryMappings).includes(lowerTag)) {
        themes.add(lowerTag);
      }
      
      // Keyword-based theme detection
      if (lowerTag.includes('mentor')) themes.add('mentoring');
      if (lowerTag.includes('indigenous') || lowerTag.includes('traditional')) themes.add('indigenous-wisdom');
      if (lowerTag.includes('system') || lowerTag.includes('holistic')) themes.add('systems-thinking');
      if (lowerTag.includes('youth') || lowerTag.includes('young')) themes.add('youth-leadership');
      if (lowerTag.includes('imagination') || lowerTag.includes('creative')) themes.add('imagination');
      if (lowerTag.includes('education') || lowerTag.includes('learning')) themes.add('education');
      if (lowerTag.includes('community') || lowerTag.includes('collective')) themes.add('community');
      if (lowerTag.includes('change') || lowerTag.includes('transform')) themes.add('social-change');
    }
    
    return Array.from(themes);
  }
  
  /**
   * Map Airtable program associations to internal program IDs
   */
  private mapAirtablePrograms(programAssociations: string[]): string[] {
    const programMappings = {
      'IMAGI-Labs': 'imagi-labs',
      'Mentoring Program': 'mentoring',
      'Joy Corps': 'joy-corps',
      'Custodians': 'custodians',
      'Citizens': 'citizens',
      'Presidents': 'presidents',
      'Hoodie Economics': 'hoodie-economics',
      'Systems Residency': 'systems-residency',
      'IMAGI-NATION TV': 'imagination-tv'
    };
    
    const programs: string[] = [];
    
    for (const association of programAssociations) {
      const program = programMappings[association as keyof typeof programMappings];
      if (program) {
        programs.push(program);
      }
    }
    
    return programs;
  }
  
  /**
   * Calculate relevance score based on Airtable metadata
   */
  private calculateRelevanceScore(fields: any, themes: string[]): number {
    let score = 0;
    
    // Quality rating from Airtable
    const qualityRating = fields['Quality Rating'] || 0;
    score += qualityRating * 0.3;
    
    // Approval status
    if (fields['Approval Status'] === 'Approved') score += 0.2;
    if (fields['Approval Status'] === 'Featured') score += 0.3;
    
    // Featured status
    if (fields['Featured Video']) score += 0.2;
    
    // Theme richness
    score += Math.min(themes.length * 0.05, 0.2);
    
    // Has learning objectives
    if (fields['Learning Objectives'] && fields['Learning Objectives'].length > 0) {
      score += 0.1;
    }
    
    // Has speakers identified
    if (fields['Speakers/Presenters'] && fields['Speakers/Presenters'].length > 0) {
      score += 0.05;
    }
    
    // Program association
    if (fields['Program Association'] && fields['Program Association'].length > 0) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Import processed video into IMAGI-NATION TV database
   */
  async importVideoToDatabase(video: ProcessedAirtableVideo): Promise<string> {
    await this.initializeDatabase();
    
    let episodeId: string;
    
    if (video.isImaginationTv && video.episodeNumber) {
      // Official IMAGI-NATION TV episode
      episodeId = `imagi-tv-s${video.season}e${video.episodeNumber}`;
    } else {
      // General AIME content from Airtable
      episodeId = `airtable-${video.airtableId}`;
    }
    
    // Parse duration if provided
    let durationSeconds = 0;
    if (video.duration) {
      durationSeconds = this.parseDuration(video.duration);
    }
    
    // Create episode entry
    await this.db.createEpisode({
      id: episodeId,
      episode_number: video.episodeNumber || 0,
      season: video.season || 1,
      title: video.title,
      description: video.description,
      video_url: video.videoUrl,
      youtube_id: video.youtubeId,
      vimeo_id: video.vimeoId,
      duration_seconds: durationSeconds,
      duration_iso: video.duration,
      thumbnail_url: video.thumbnailUrl,
      published_at: video.publishDate,
      status: video.approvalStatus === 'Approved' ? 'published' : 'draft',
      content_type: this.mapVideoType(video.videoType),
      themes: video.themes,
      programs: video.programs,
      learning_objectives: video.learningObjectives,
      age_groups: video.ageGroup,
      cultural_contexts: video.culturalContext,
      access_level: 'public',
      cultural_sensitivity: this.determineCulturalSensitivity(video),
      has_transcription: video.accessibilityFeatures.includes('Captions') || video.accessibilityFeatures.includes('Subtitles'),
      transcription_status: 'pending',
      wisdom_extracts_count: 0,
      key_topics: video.tags,
      view_count: 0, // Will be updated from analytics
      like_count: 0,
      discussion_count: 0,
      reflection_count: 0
    });
    
    // Store Airtable-specific metadata
    await this.storeAirtableMetadata(episodeId, video);
    
    // Queue processing jobs
    if (video.youtubeId && (video.accessibilityFeatures.includes('Captions') || video.accessibilityFeatures.includes('Subtitles'))) {
      await this.db.createProcessingJob({
        episode_id: episodeId,
        job_type: 'transcription',
        priority: video.featured ? 'high' : 'medium',
        provider: 'youtube-captions',
        input_data: {
          youtubeId: video.youtubeId,
          language: video.language
        }
      });
    }
    
    // Queue wisdom extraction for high-quality content
    if (video.relevanceScore > 0.7) {
      await this.db.createProcessingJob({
        episode_id: episodeId,
        job_type: 'wisdom-extraction',
        priority: 'medium',
        provider: 'internal',
        input_data: {
          themes: video.themes,
          speakers: video.speakers,
          culturalContext: video.culturalContext
        }
      });
    }
    
    return episodeId;
  }
  
  /**
   * Store Airtable-specific metadata for future reference
   */
  private async storeAirtableMetadata(episodeId: string, video: ProcessedAirtableVideo): Promise<void> {
    // This could be stored in a separate table or as JSON metadata
    // For now, we'll store key Airtable info in the processing jobs table
    await this.db.createProcessingJob({
      episode_id: episodeId,
      job_type: 'airtable-sync',
      status: 'completed',
      priority: 'low',
      provider: 'airtable',
      input_data: {
        airtableId: video.airtableId,
        originalCategories: video.category,
        qualityRating: video.qualityRating,
        featured: video.featured,
        speakers: video.speakers,
        contentWarnings: video.contentWarnings,
        relatedDocuments: video.relatedDocuments,
        notes: video.notes
      }
    });
  }
  
  /**
   * Parse duration string into seconds
   */
  private parseDuration(duration: string): number {
    // Handle various duration formats
    const timePattern = /(?:(\d+):)?(\d+):(\d+)/; // HH:MM:SS or MM:SS
    const match = duration.match(timePattern);
    
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      return hours * 3600 + minutes * 60 + seconds;
    }
    
    // Handle other formats like "25 minutes"
    const minutesMatch = duration.match(/(\d+)\s*min/i);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]) * 60;
    }
    
    return 0;
  }
  
  /**
   * Map Airtable video types to internal content types
   */
  private mapVideoType(videoType: string): string {
    const mappings = {
      'Educational': 'educational',
      'Inspirational': 'inspirational',
      'Documentary': 'documentary',
      'Interview': 'interview',
      'Workshop': 'workshop',
      'Event': 'event',
      'Presentation': 'educational',
      'Story': 'inspirational',
      'Tutorial': 'educational'
    };
    
    return mappings[videoType as keyof typeof mappings] || 'educational';
  }
  
  /**
   * Determine cultural sensitivity requirements
   */
  private determineCulturalSensitivity(video: ProcessedAirtableVideo): 'none' | 'advisory' | 'permission-required' {
    // Check cultural contexts
    if (video.culturalContext.includes('Indigenous')) {
      return 'advisory';
    }
    
    // Check content warnings
    if (video.contentWarnings.length > 0) {
      return 'advisory';
    }
    
    // Check if Indigenous speakers are present
    const indigenousIndicators = ['elder', 'traditional', 'indigenous', 'aboriginal'];
    const hasIndigenousSpeakers = video.speakers.some(speaker =>
      indigenousIndicators.some(indicator => 
        speaker.toLowerCase().includes(indicator)
      )
    );
    
    if (hasIndigenousSpeakers) {
      return 'advisory';
    }
    
    return 'none';
  }
  
  /**
   * Sync updated metadata from Airtable
   */
  async syncVideoUpdates(airtableId?: string): Promise<{
    updated: number;
    errors: string[];
  }> {
    await this.initializeDatabase();
    
    console.log('🔄 Syncing video updates from Airtable...');
    
    let videos: AirtableVideoRecord[];
    
    if (airtableId) {
      // Sync specific video
      videos = await this.fetchSpecificVideo(airtableId);
    } else {
      // Sync all videos modified in the last 24 hours
      videos = await this.fetchRecentlyModifiedVideos();
    }
    
    const results = { updated: 0, errors: [] as string[] };
    
    for (const video of videos) {
      try {
        const processedVideo = await this.processAirtableVideo(video);
        
        // Find existing episode
        const episodeId = processedVideo.isImaginationTv && processedVideo.episodeNumber 
          ? `imagi-tv-s${processedVideo.season}e${processedVideo.episodeNumber}`
          : `airtable-${processedVideo.airtableId}`;
        
        const existing = await this.db.getEpisode(episodeId);
        if (existing) {
          // Update existing episode
          await this.updateExistingEpisode(episodeId, processedVideo);
          results.updated++;
          console.log(`🔄 Updated: ${processedVideo.title}`);
        }
        
      } catch (error) {
        const errorMsg = `Failed to sync video ${video.id}: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
      }
    }
    
    return results;
  }
  
  /**
   * Fetch specific video from Airtable
   */
  private async fetchSpecificVideo(airtableId: string): Promise<AirtableVideoRecord[]> {
    const url = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableId)}/${airtableId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return [data];
  }
  
  /**
   * Fetch recently modified videos from Airtable
   */
  private async fetchRecentlyModifiedVideos(): Promise<AirtableVideoRecord[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isoDate = yesterday.toISOString().split('T')[0];
    
    const url = new URL(`https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableId)}`);
    url.searchParams.set('filterByFormula', `AND(NOT({Video URL} = ""), LAST_MODIFIED_TIME() > "${isoDate}")`);
    url.searchParams.set('pageSize', '100');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.records || [];
  }
  
  /**
   * Update existing episode with new Airtable data
   */
  private async updateExistingEpisode(episodeId: string, video: ProcessedAirtableVideo): Promise<void> {
    await this.db.updateEpisode(episodeId, {
      title: video.title,
      description: video.description,
      video_url: video.videoUrl,
      youtube_id: video.youtubeId,
      vimeo_id: video.vimeoId,
      thumbnail_url: video.thumbnailUrl,
      status: video.approvalStatus === 'Approved' ? 'published' : 'draft',
      content_type: this.mapVideoType(video.videoType),
      themes: video.themes,
      programs: video.programs,
      learning_objectives: video.learningObjectives,
      age_groups: video.ageGroup,
      cultural_contexts: video.culturalContext,
      cultural_sensitivity: this.determineCulturalSensitivity(video),
      key_topics: video.tags
    });
  }
}

// Export singleton instance
export const airtableImporter = new AirtableVideoImporter();