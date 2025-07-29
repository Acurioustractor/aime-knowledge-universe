/**
 * IMAGI-NATION TV Database Manager
 * 
 * Comprehensive database operations for video content, episodes, transcriptions,
 * wisdom extraction, and analytics
 */

import { Database } from 'sqlite3';
import path from 'path';
import fs from 'fs';

export interface Episode {
  id: string;
  episode_number: number;
  season: number;
  title: string;
  description: string;
  video_url: string;
  youtube_id?: string;
  vimeo_id?: string;
  duration_seconds?: number;
  duration_iso?: string;
  thumbnail_url?: string;
  published_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived' | 'coming-soon';
  content_type: string;
  themes: string[]; // JSON parsed
  programs: string[]; // JSON parsed
  learning_objectives: string[]; // JSON parsed
  age_groups: string[]; // JSON parsed
  cultural_contexts: string[]; // JSON parsed
  view_count: number;
  like_count: number;
  discussion_count: number;
  reflection_count: number;
  has_transcription: boolean;
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed';
  transcription_text?: string;
  transcription_confidence?: number;
  wisdom_extracts_count: number;
  key_topics: string[]; // JSON parsed
  access_level: 'public' | 'community' | 'internal';
  cultural_sensitivity: 'none' | 'advisory' | 'permission-required';
  created_at: string;
}

export interface EpisodeSegment {
  id: string;
  episode_id: string;
  start_time: number;
  end_time: number;
  segment_order: number;
  segment_type: 'introduction' | 'story' | 'wisdom' | 'activity' | 'reflection' | 'discussion';
  title: string;
  description?: string;
  discussion_prompts: string[]; // JSON parsed
  related_content: string[]; // JSON parsed
  wisdom_indicators: number;
  created_at: string;
}

export interface WisdomExtract {
  id: string;
  episode_id: string;
  segment_id?: string;
  extract_type: 'indigenous-wisdom' | 'systems-thinking' | 'mentoring-insight' | 'principle' | 'story' | 'methodology' | 'reflection' | 'teaching' | 'ceremony';
  content: string;
  timestamp_start: number;
  timestamp_end?: number;
  speaker?: string;
  confidence: number;
  themes: string[]; // JSON parsed
  cultural_context: string;
  applications: string[]; // JSON parsed
  related_concepts: string[]; // JSON parsed
  reviewed: boolean;
  approved: boolean;
  reviewer_notes?: string;
  created_at: string;
}

export interface EpisodeAnalytics {
  id: string;
  episode_id: string;
  total_views: number;
  unique_viewers: number;
  average_watch_time?: number;
  completion_rate?: number;
  likes: number;
  shares: number;
  comments: number;
  discussions_started: number;
  reflections_submitted: number;
  wisdom_extracts_viewed: number;
  wisdom_extracts_shared: number;
  knowledge_connections_followed: number;
  most_replayed_segment?: any; // JSON parsed
  drop_off_points: any[]; // JSON parsed
  viewer_regions: any; // JSON parsed
  viewer_age_groups: any; // JSON parsed
  analytics_date: string;
  updated_at: string;
}

export interface ProcessingJob {
  id: string;
  episode_id: string;
  job_type: 'transcription' | 'wisdom-extraction' | 'knowledge-connection' | 'analytics-update' | 'thumbnail-generation';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  provider?: string;
  input_data?: any; // JSON parsed
  output_data?: any; // JSON parsed
  progress_percentage: number;
  current_step?: string;
  estimated_completion?: string;
  processing_time_ms?: number;
  cost_cents?: number;
  tokens_used?: number;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

class VideoDatabase {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'video.db');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Failed to connect to video database:', err);
          reject(err);
        } else {
          console.log('📺 Connected to video database');
          this.initializeSchema().then(resolve).catch(reject);
        }
      });
    });
  }

  private async initializeSchema(): Promise<void> {
    // Try multiple possible schema locations
    const possiblePaths = [
      path.join(__dirname, 'video-schema.sql'),
      path.join(process.cwd(), 'src/lib/database/video-schema.sql'),
      path.join(process.cwd(), 'src', 'lib', 'database', 'video-schema.sql')
    ];
    
    let schema: string = '';
    let schemaPath: string = '';
    
    for (const pathToTry of possiblePaths) {
      try {
        if (fs.existsSync(pathToTry)) {
          schema = fs.readFileSync(pathToTry, 'utf8');
          schemaPath = pathToTry;
          break;
        }
      } catch (error) {
        console.log(`❌ Could not read schema from ${pathToTry}:`, error);
        continue;
      }
    }
    
    if (!schema) {
      console.error('❌ No video schema file found in any expected location:', possiblePaths);
      throw new Error('Video schema file not found');
    }
    
    try {
      console.log(`📺 Loading schema from: ${schemaPath}`);
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await this.run(statement);
        }
      }
      
      console.log('✅ Video database schema initialized');
    } catch (error) {
      console.error('❌ Failed to initialize video database schema:', error);
      throw error;
    }
  }

  private async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  private async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not connected'));
        return;
      }
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Episode Management
  async createEpisode(episode: Partial<Episode>): Promise<string> {
    const id = episode.id || `imagi-tv-s${episode.season}e${episode.episode_number}`;
    
    const sql = `
      INSERT INTO imagination_tv_episodes (
        id, episode_number, season, title, description,
        video_url, youtube_id, vimeo_id, duration_seconds, duration_iso,
        thumbnail_url, published_at, status, content_type,
        themes, programs, learning_objectives, age_groups, cultural_contexts,
        access_level, cultural_sensitivity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      episode.episode_number,
      episode.season || 1,
      episode.title,
      episode.description,
      episode.video_url,
      episode.youtube_id,
      episode.vimeo_id,
      episode.duration_seconds,
      episode.duration_iso,
      episode.thumbnail_url,
      episode.published_at || new Date().toISOString(),
      episode.status || 'draft',
      episode.content_type || 'educational',
      JSON.stringify(episode.themes || []),
      JSON.stringify(episode.programs || []),
      JSON.stringify(episode.learning_objectives || []),
      JSON.stringify(episode.age_groups || []),
      JSON.stringify(episode.cultural_contexts || []),
      episode.access_level || 'public',
      episode.cultural_sensitivity || 'none'
    ]);
    
    console.log(`📺 Created episode: ${episode.title} (${id})`);
    return id;
  }

  async getEpisode(id: string): Promise<Episode | null> {
    const sql = 'SELECT * FROM imagination_tv_episodes WHERE id = ?';
    const row = await this.get(sql, [id]);
    
    if (!row) return null;
    
    return this.parseEpisodeRow(row);
  }

  async getEpisodeByYouTubeId(youtubeId: string): Promise<Episode | null> {
    const sql = 'SELECT * FROM imagination_tv_episodes WHERE youtube_id = ?';
    const row = await this.get(sql, [youtubeId]);
    
    if (!row) return null;
    
    return this.parseEpisodeRow(row);
  }

  async getEpisodes(options: {
    status?: string;
    season?: number;
    limit?: number;
    offset?: number;
    includeSegments?: boolean;
    includeWisdom?: boolean;
  } = {}): Promise<{ episodes: Episode[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (options.status) {
      whereClause += ' AND status = ?';
      params.push(options.status);
    }
    
    if (options.season) {
      whereClause += ' AND season = ?';
      params.push(options.season);
    }
    
    // Get total count
    const countSql = `SELECT COUNT(*) as count FROM imagination_tv_episodes ${whereClause}`;
    const countResult = await this.get(countSql, params);
    const total = countResult.count;
    
    // Get episodes
    const sql = `
      SELECT * FROM imagination_tv_episodes 
      ${whereClause}
      ORDER BY season DESC, episode_number DESC
      ${options.limit ? `LIMIT ${options.limit}` : ''}
      ${options.offset ? `OFFSET ${options.offset}` : ''}
    `;
    
    const rows = await this.all(sql, params);
    const episodes = rows.map(row => this.parseEpisodeRow(row));
    
    // Optionally include segments and wisdom
    for (const episode of episodes) {
      if (options.includeSegments) {
        episode.segments = await this.getEpisodeSegments(episode.id);
      }
      if (options.includeWisdom) {
        episode.wisdomExtracts = await this.getEpisodeWisdom(episode.id);
      }
    }
    
    return { episodes, total };
  }

  async updateEpisode(id: string, updates: Partial<Episode>): Promise<void> {
    const setClause = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id') continue; // Don't update ID
      
      setClause.push(`${key} = ?`);
      
      // Handle JSON fields
      if (['themes', 'programs', 'learning_objectives', 'age_groups', 'cultural_contexts', 'key_topics'].includes(key)) {
        params.push(JSON.stringify(value));
      } else {
        params.push(value);
      }
    }
    
    if (setClause.length === 0) return;
    
    setClause.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);
    
    const sql = `UPDATE imagination_tv_episodes SET ${setClause.join(', ')} WHERE id = ?`;
    await this.run(sql, params);
    
    console.log(`📺 Updated episode: ${id}`);
  }

  // Episode Segments
  async createEpisodeSegment(segment: Partial<EpisodeSegment>): Promise<string> {
    const id = segment.id || `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sql = `
      INSERT INTO episode_segments (
        id, episode_id, start_time, end_time, segment_order,
        segment_type, title, description, discussion_prompts, related_content, wisdom_indicators
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      segment.episode_id,
      segment.start_time,
      segment.end_time,
      segment.segment_order,
      segment.segment_type,
      segment.title,
      segment.description,
      JSON.stringify(segment.discussion_prompts || []),
      JSON.stringify(segment.related_content || []),
      segment.wisdom_indicators || 0
    ]);
    
    console.log(`📺 Created segment: ${segment.title} for episode ${segment.episode_id}`);
    return id;
  }

  async getEpisodeSegments(episodeId: string): Promise<EpisodeSegment[]> {
    const sql = 'SELECT * FROM episode_segments WHERE episode_id = ? ORDER BY segment_order';
    const rows = await this.all(sql, [episodeId]);
    
    return rows.map(row => ({
      ...row,
      discussion_prompts: JSON.parse(row.discussion_prompts || '[]'),
      related_content: JSON.parse(row.related_content || '[]')
    }));
  }

  // Wisdom Extracts
  async createWisdomExtract(extract: Partial<WisdomExtract>): Promise<string> {
    const id = extract.id || `wisdom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sql = `
      INSERT INTO video_wisdom_extracts (
        id, episode_id, segment_id, extract_type, content,
        timestamp_start, timestamp_end, speaker, confidence,
        themes, cultural_context, applications, related_concepts,
        reviewed, approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      extract.episode_id,
      extract.segment_id,
      extract.extract_type,
      extract.content,
      extract.timestamp_start,
      extract.timestamp_end,
      extract.speaker,
      extract.confidence,
      JSON.stringify(extract.themes || []),
      extract.cultural_context || 'general',
      JSON.stringify(extract.applications || []),
      JSON.stringify(extract.related_concepts || []),
      extract.reviewed || false,
      extract.approved || false
    ]);
    
    console.log(`🧠 Created wisdom extract: ${extract.extract_type} for episode ${extract.episode_id}`);
    return id;
  }

  async getEpisodeWisdom(episodeId: string, onlyApproved: boolean = false): Promise<WisdomExtract[]> {
    let sql = 'SELECT * FROM video_wisdom_extracts WHERE episode_id = ?';
    const params = [episodeId];
    
    if (onlyApproved) {
      sql += ' AND approved = TRUE';
    }
    
    sql += ' ORDER BY confidence DESC, timestamp_start';
    
    const rows = await this.all(sql, params);
    
    return rows.map(row => ({
      ...row,
      themes: JSON.parse(row.themes || '[]'),
      applications: JSON.parse(row.applications || '[]'),
      related_concepts: JSON.parse(row.related_concepts || '[]')
    }));
  }

  // Processing Jobs
  async createProcessingJob(job: Partial<ProcessingJob>): Promise<string> {
    const id = job.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sql = `
      INSERT INTO video_processing_jobs (
        id, episode_id, job_type, status, priority, provider,
        input_data, progress_percentage, max_retries
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      job.episode_id,
      job.job_type,
      job.status || 'pending',
      job.priority || 'medium',
      job.provider,
      JSON.stringify(job.input_data || {}),
      job.progress_percentage || 0,
      job.max_retries || 3
    ]);
    
    console.log(`⚙️ Created processing job: ${job.job_type} for episode ${job.episode_id}`);
    return id;
  }

  async updateProcessingJob(id: string, updates: Partial<ProcessingJob>): Promise<void> {
    const setClause = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id') continue;
      
      setClause.push(`${key} = ?`);
      
      if (['input_data', 'output_data'].includes(key)) {
        params.push(JSON.stringify(value));
      } else {
        params.push(value);
      }
    }
    
    if (setClause.length === 0) return;
    
    params.push(id);
    const sql = `UPDATE video_processing_jobs SET ${setClause.join(', ')} WHERE id = ?`;
    await this.run(sql, params);
  }

  async getProcessingJobs(options: {
    status?: string;
    episodeId?: string;
    jobType?: string;
    limit?: number;
  } = {}): Promise<ProcessingJob[]> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (options.status) {
      whereClause += ' AND status = ?';
      params.push(options.status);
    }
    
    if (options.episodeId) {
      whereClause += ' AND episode_id = ?';
      params.push(options.episodeId);
    }
    
    if (options.jobType) {
      whereClause += ' AND job_type = ?';
      params.push(options.jobType);
    }
    
    const sql = `
      SELECT * FROM video_processing_jobs 
      ${whereClause}
      ORDER BY priority DESC, created_at
      ${options.limit ? `LIMIT ${options.limit}` : ''}
    `;
    
    const rows = await this.all(sql, params);
    
    return rows.map(row => ({
      ...row,
      input_data: JSON.parse(row.input_data || '{}'),
      output_data: JSON.parse(row.output_data || '{}')
    }));
  }

  // Analytics
  async updateEpisodeAnalytics(episodeId: string, analytics: Partial<EpisodeAnalytics>): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if analytics record exists for today
    const existing = await this.get(
      'SELECT id FROM episode_analytics WHERE episode_id = ? AND analytics_date = ?',
      [episodeId, today]
    );
    
    if (existing) {
      // Update existing record
      const setClause = [];
      const params = [];
      
      for (const [key, value] of Object.entries(analytics)) {
        if (key === 'id' || key === 'episode_id' || key === 'analytics_date') continue;
        
        setClause.push(`${key} = ?`);
        
        if (['most_replayed_segment', 'drop_off_points', 'viewer_regions', 'viewer_age_groups'].includes(key)) {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
      
      if (setClause.length > 0) {
        setClause.push('updated_at = ?');
        params.push(new Date().toISOString());
        params.push(existing.id);
        
        const sql = `UPDATE episode_analytics SET ${setClause.join(', ')} WHERE id = ?`;
        await this.run(sql, params);
      }
    } else {
      // Create new record
      const id = `analytics-${episodeId}-${today}`;
      
      const sql = `
        INSERT INTO episode_analytics (
          id, episode_id, analytics_date, total_views, unique_viewers,
          average_watch_time, completion_rate, likes, shares, comments,
          discussions_started, reflections_submitted, wisdom_extracts_viewed,
          wisdom_extracts_shared, knowledge_connections_followed,
          most_replayed_segment, drop_off_points, viewer_regions, viewer_age_groups
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await this.run(sql, [
        id, episodeId, today,
        analytics.total_views || 0,
        analytics.unique_viewers || 0,
        analytics.average_watch_time,
        analytics.completion_rate,
        analytics.likes || 0,
        analytics.shares || 0,
        analytics.comments || 0,
        analytics.discussions_started || 0,
        analytics.reflections_submitted || 0,
        analytics.wisdom_extracts_viewed || 0,
        analytics.wisdom_extracts_shared || 0,
        analytics.knowledge_connections_followed || 0,
        JSON.stringify(analytics.most_replayed_segment || {}),
        JSON.stringify(analytics.drop_off_points || []),
        JSON.stringify(analytics.viewer_regions || {}),
        JSON.stringify(analytics.viewer_age_groups || {})
      ]);
    }
    
    console.log(`📊 Updated analytics for episode: ${episodeId}`);
  }

  /**
   * Knowledge connection methods
   */
  async createKnowledgeConnection(connection: any): Promise<string> {
    const id = connection.id || `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sql = `
      INSERT INTO episode_knowledge_connections (
        id, episode_id, document_id, document_title, document_type,
        relationship_type, relevance_score, episode_timestamp,
        document_section, connection_description, auto_generated, manually_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      connection.episode_id,
      connection.document_id,
      connection.document_title,
      connection.document_type,
      connection.relationship_type,
      connection.relevance_score,
      connection.episode_timestamp,
      connection.document_section,
      connection.connection_description,
      connection.auto_generated || true,
      connection.manually_verified || false
    ]);
    
    return id;
  }
  
  async getEpisodeKnowledgeConnections(episodeId: string): Promise<any[]> {
    const sql = `
      SELECT ekc.*, e.title as episode_title
      FROM episode_knowledge_connections ekc
      LEFT JOIN imagination_tv_episodes e ON ekc.episode_id = e.id
      WHERE ekc.episode_id = ?
      ORDER BY ekc.relevance_score DESC
    `;
    
    return this.all(sql, [episodeId]);
  }
  
  async getDocumentKnowledgeConnections(documentId: string): Promise<any[]> {
    const sql = `
      SELECT ekc.*, e.title as episode_title, e.episode_number, e.season
      FROM episode_knowledge_connections ekc
      LEFT JOIN imagination_tv_episodes e ON ekc.episode_id = e.id
      WHERE ekc.document_id = ?
      ORDER BY ekc.relevance_score DESC
    `;
    
    return this.all(sql, [documentId]);
  }
  
  async createProcessingJob(job: any): Promise<string> {
    const id = job.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sql = `
      INSERT INTO video_processing_jobs (
        id, episode_id, job_type, status, priority, provider,
        input_data, progress_percentage, current_step
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.run(sql, [
      id,
      job.episode_id,
      job.job_type,
      job.status || 'pending',
      job.priority || 'medium',
      job.provider,
      JSON.stringify(job.input_data || {}),
      job.progress_percentage || 0,
      job.current_step || 'queued'
    ]);
    
    return id;
  }

  // Utility methods
  private parseEpisodeRow(row: any): Episode {
    return {
      ...row,
      themes: JSON.parse(row.themes || '[]'),
      programs: JSON.parse(row.programs || '[]'),
      learning_objectives: JSON.parse(row.learning_objectives || '[]'),
      age_groups: JSON.parse(row.age_groups || '[]'),
      cultural_contexts: JSON.parse(row.cultural_contexts || '[]'),
      key_topics: JSON.parse(row.key_topics || '[]')
    };
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing video database:', err);
          } else {
            console.log('📺 Video database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Singleton instance
let videoDatabase: VideoDatabase | null = null;

export async function getVideoDatabase(): Promise<VideoDatabase> {
  if (!videoDatabase) {
    videoDatabase = new VideoDatabase();
    await videoDatabase.connect();
  }
  return videoDatabase;
}

export default VideoDatabase;