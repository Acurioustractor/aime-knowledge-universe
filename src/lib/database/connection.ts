/**
 * Standardized Database Connection Manager
 * 
 * Provides unified database access with connection pooling, error handling,
 * and consistent patterns across the application.
 * 
 * Week 2: Technical Consolidation - Unified database connection pattern
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import path from 'path';

// Database configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const DB_PATH = process.env.DATABASE_PATH || './data/aime-data-lake.db';

// Connection instances
let supabaseClient: SupabaseClient | null = null;
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Initialize Supabase connection with standardized configuration
 */
function initializeSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase configuration missing. Using placeholder client.');
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'aime-knowledge-platform',
        'x-client-version': '1.0.0'
      }
    }
  });
}

/**
 * Initialize SQLite database connection with optimizations
 */
export async function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (db) return db;

  console.log('🗄️ Initializing AIME Data Lake database...');
  
  try {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Enable WAL mode for better concurrency
    await db.exec('PRAGMA journal_mode = WAL');
    
    // Optimize for performance
    await db.exec('PRAGMA synchronous = NORMAL');
    await db.exec('PRAGMA cache_size = 1000000'); // 1GB cache
    await db.exec('PRAGMA temp_store = MEMORY');
    await db.exec('PRAGMA mmap_size = 268435456'); // 256MB mmap
    await db.exec('PRAGMA foreign_keys = ON');
    
    // Initialize schema if needed
    await initializeSchema();
    
    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Get Supabase client with connection caching
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = initializeSupabase();
  }
  return supabaseClient;
}

/**
 * Initialize database schema for SQLite
 */
async function initializeSchema(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  try {
    // Check if schema is already initialized
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='content'
    `);
    
    if (tables.length > 0) {
      console.log('📋 Database schema already exists');
      return;
    }

    console.log('📋 Creating SQLite schema...');
    
    // Create SQLite-compatible schema
    await db.exec(`
      -- Content table for all content types
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        source_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        content_type TEXT DEFAULT 'tool',
        category TEXT,
        file_type TEXT,
        url TEXT,
        thumbnail_url TEXT,
        tags TEXT, -- JSON string
        themes TEXT, -- JSON string
        topics TEXT, -- JSON string
        authors TEXT, -- JSON string
        metadata TEXT, -- JSON string
        is_featured INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        source_created_at TEXT,
        source_updated_at TEXT,
        last_synced_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        indexed_at TEXT
      );

      -- Tools-specific table
      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        tool_type TEXT,
        usage_restrictions TEXT,
        file_size TEXT,
        download_url TEXT,
        attachment_count INTEGER DEFAULT 0,
        attachments TEXT, -- JSON string
        airtable_record_id TEXT,
        FOREIGN KEY (id) REFERENCES content(id) ON DELETE CASCADE
      );

      -- Videos table for YouTube content
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        video_id TEXT UNIQUE NOT NULL,
        channel_id TEXT,
        channel_title TEXT,
        duration TEXT,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        published_at TEXT,
        transcript TEXT,
        captions_available INTEGER DEFAULT 0,
        video_quality TEXT,
        definition TEXT,
        dimension TEXT,
        licensed_content INTEGER DEFAULT 0,
        default_language TEXT,
        default_audio_language TEXT,
        live_broadcast_content TEXT,
        privacy_status TEXT,
        upload_status TEXT,
        embeddable INTEGER DEFAULT 1,
        public_stats_viewable INTEGER DEFAULT 1,
        made_for_kids INTEGER DEFAULT 0,
        youtube_created_at TEXT,
        youtube_updated_at TEXT,
        last_synced_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES content(id) ON DELETE CASCADE
      );

      -- Newsletters/Campaigns table
      CREATE TABLE IF NOT EXISTS newsletters (
        id TEXT PRIMARY KEY,
        campaign_id TEXT UNIQUE NOT NULL,
        web_id TEXT,
        list_id TEXT,
        folder_id TEXT,
        type TEXT DEFAULT 'regular',
        status TEXT DEFAULT 'sent',
        subject_line TEXT,
        preview_text TEXT,
        content_html TEXT,
        content_text TEXT,
        archive_url TEXT,
        long_archive_url TEXT,
        email_count INTEGER DEFAULT 0,
        opens INTEGER DEFAULT 0,
        unique_opens INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        unique_clicks INTEGER DEFAULT 0,
        unsubscribes INTEGER DEFAULT 0,
        bounce_rate REAL DEFAULT 0.0,
        open_rate REAL DEFAULT 0.0,
        click_rate REAL DEFAULT 0.0,
        send_time TEXT,
        create_time TEXT,
        segment_text TEXT,
        recipient_count INTEGER DEFAULT 0,
        settings TEXT, -- JSON string
        tracking TEXT, -- JSON string
        social_card TEXT, -- JSON string
        report_summary TEXT, -- JSON string
        delivery_status TEXT, -- JSON string
        ab_split_opts TEXT, -- JSON string
        rss_opts TEXT, -- JSON string
        variate_settings TEXT, -- JSON string
        mailchimp_created_at TEXT,
        mailchimp_updated_at TEXT,
        last_synced_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES content(id) ON DELETE CASCADE
      );

      -- Sync status tracking
      CREATE TABLE IF NOT EXISTS sync_status (
        source TEXT PRIMARY KEY,
        last_sync_at TEXT,
        last_successful_sync_at TEXT,
        total_records INTEGER DEFAULT 0,
        sync_duration_ms INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        next_sync_at TEXT
      );

      -- Full-text search
      CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
        id, title, description, content, tags, themes, topics
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_content_source ON content(source);
      CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
      CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
      CREATE INDEX IF NOT EXISTS idx_content_created ON content(created_at);
      CREATE INDEX IF NOT EXISTS idx_newsletters_campaign_id ON newsletters(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
      CREATE INDEX IF NOT EXISTS idx_newsletters_send_time ON newsletters(send_time);
      CREATE INDEX IF NOT EXISTS idx_newsletters_type ON newsletters(type);
      CREATE INDEX IF NOT EXISTS idx_videos_video_id ON videos(video_id);
      CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id);
      CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at);
      CREATE INDEX IF NOT EXISTS idx_videos_view_count ON videos(view_count);

      -- HOODIE STOCK EXCHANGE TABLES
      
      -- Digital hoodies/badges table
      CREATE TABLE IF NOT EXISTS hoodies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL, -- transformation, knowledge, impact
        subcategory TEXT, -- joy-corps, systems-mapping, etc.
        icon_url TEXT,
        rarity_level TEXT DEFAULT 'common', -- common, rare, legendary, mythic
        base_impact_value REAL DEFAULT 0.0,
        imagination_credit_multiplier REAL DEFAULT 1.0,
        unlock_criteria TEXT, -- JSON string describing how to unlock
        prerequisite_hoodies TEXT, -- JSON array of hoodie IDs
        associated_content_id TEXT, -- Link to content that awards this hoodie
        is_tradeable INTEGER DEFAULT 1,
        is_mentorship_required INTEGER DEFAULT 0,
        max_holders INTEGER DEFAULT -1, -- -1 for unlimited
        current_holders INTEGER DEFAULT 0,
        total_impact_generated REAL DEFAULT 0.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (associated_content_id) REFERENCES content(id)
      );

      -- Hoodie ownership and relationships
      CREATE TABLE IF NOT EXISTS hoodie_holders (
        id TEXT PRIMARY KEY,
        hoodie_id TEXT NOT NULL,
        holder_id TEXT NOT NULL, -- User/person identifier
        holder_name TEXT,
        holder_email TEXT,
        acquired_at TEXT DEFAULT CURRENT_TIMESTAMP,
        acquired_method TEXT DEFAULT 'earned', -- earned, traded, mentored, gifted
        acquisition_story TEXT,
        current_impact_contribution REAL DEFAULT 0.0,
        utilization_rate REAL DEFAULT 0.0, -- How actively they use the hoodie
        mentorship_chain TEXT, -- JSON array of previous holders who mentored
        is_active INTEGER DEFAULT 1,
        last_activity_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hoodie_id) REFERENCES hoodies(id) ON DELETE CASCADE
      );

      -- Trading history and narratives
      CREATE TABLE IF NOT EXISTS hoodie_trades (
        id TEXT PRIMARY KEY,
        hoodie_id TEXT NOT NULL,
        from_holder_id TEXT,
        to_holder_id TEXT NOT NULL,
        trade_type TEXT DEFAULT 'standard', -- standard, mentorship, collective, gift
        imagination_credits_used REAL DEFAULT 0.0,
        trade_narrative TEXT, -- Story behind the trade
        vision_alignment_score REAL DEFAULT 0.0,
        community_validation_score REAL DEFAULT 0.0,
        impact_prediction TEXT, -- JSON prediction of outcomes
        actual_impact_generated REAL DEFAULT 0.0,
        trade_conditions TEXT, -- JSON conditions/requirements
        mentorship_duration_months INTEGER DEFAULT 0,
        wisdom_dividends_percentage REAL DEFAULT 0.0,
        is_collective_trade INTEGER DEFAULT 0,
        consortium_members TEXT, -- JSON array if collective trade
        trade_status TEXT DEFAULT 'completed', -- pending, completed, cancelled
        completed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hoodie_id) REFERENCES hoodies(id) ON DELETE CASCADE,
        FOREIGN KEY (from_holder_id) REFERENCES hoodie_holders(holder_id),
        FOREIGN KEY (to_holder_id) REFERENCES hoodie_holders(holder_id)
      );

      -- Imagination credit system
      CREATE TABLE IF NOT EXISTS imagination_credits (
        id TEXT PRIMARY KEY,
        holder_id TEXT NOT NULL,
        credits_balance REAL DEFAULT 0.0,
        credits_earned_lifetime REAL DEFAULT 0.0,
        credits_spent_lifetime REAL DEFAULT 0.0,
        impact_multiplier REAL DEFAULT 1.0,
        community_recognition_score REAL DEFAULT 0.0,
        vision_accuracy_score REAL DEFAULT 0.0,
        mentorship_quality_score REAL DEFAULT 0.0,
        relationship_depth_points INTEGER DEFAULT 0,
        innovation_catalyst_count INTEGER DEFAULT 0,
        community_stewardship_score REAL DEFAULT 0.0,
        last_credit_activity_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Trading circles and wisdom councils
      CREATE TABLE IF NOT EXISTS trading_circles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        circle_type TEXT DEFAULT 'wisdom', -- wisdom, transformation, innovation
        max_members INTEGER DEFAULT 12,
        current_members INTEGER DEFAULT 0,
        elder_holder_id TEXT, -- Moderator/elder
        decision_threshold REAL DEFAULT 0.66, -- Consensus percentage needed
        is_active INTEGER DEFAULT 1,
        specialization_tags TEXT, -- JSON array
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Circle membership
      CREATE TABLE IF NOT EXISTS circle_members (
        id TEXT PRIMARY KEY,
        circle_id TEXT NOT NULL,
        holder_id TEXT NOT NULL,
        member_role TEXT DEFAULT 'member', -- member, elder, facilitator
        joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
        contribution_score REAL DEFAULT 0.0,
        votes_cast INTEGER DEFAULT 0,
        trades_facilitated INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (circle_id) REFERENCES trading_circles(id) ON DELETE CASCADE
      );

      -- Future projects and vision boards
      CREATE TABLE IF NOT EXISTS vision_projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        vision_statement TEXT,
        project_type TEXT DEFAULT 'transformation', -- transformation, research, community
        target_impact_area TEXT, -- environment, education, social-justice, etc.
        timeline_months INTEGER DEFAULT 12,
        required_hoodies TEXT, -- JSON array of hoodie categories needed
        reserved_hoodies TEXT, -- JSON array of specific hoodies reserved
        initiator_holder_id TEXT NOT NULL,
        consortium_members TEXT, -- JSON array of participating holders
        imagination_credits_pledged REAL DEFAULT 0.0,
        community_votes INTEGER DEFAULT 0,
        community_score REAL DEFAULT 0.0,
        project_status TEXT DEFAULT 'visioning', -- visioning, planning, active, completed
        real_world_impact_measured REAL DEFAULT 0.0,
        success_metrics TEXT, -- JSON array of measurement criteria
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for hoodie exchange performance
      CREATE INDEX IF NOT EXISTS idx_hoodies_category ON hoodies(category);
      CREATE INDEX IF NOT EXISTS idx_hoodies_rarity ON hoodies(rarity_level);
      CREATE INDEX IF NOT EXISTS idx_hoodies_tradeable ON hoodies(is_tradeable);
      CREATE INDEX IF NOT EXISTS idx_hoodie_holders_hoodie_id ON hoodie_holders(hoodie_id);
      CREATE INDEX IF NOT EXISTS idx_hoodie_holders_holder_id ON hoodie_holders(holder_id);
      CREATE INDEX IF NOT EXISTS idx_hoodie_holders_active ON hoodie_holders(is_active);
      CREATE INDEX IF NOT EXISTS idx_hoodie_trades_hoodie_id ON hoodie_trades(hoodie_id);
      CREATE INDEX IF NOT EXISTS idx_hoodie_trades_status ON hoodie_trades(trade_status);
      CREATE INDEX IF NOT EXISTS idx_hoodie_trades_type ON hoodie_trades(trade_type);
      CREATE INDEX IF NOT EXISTS idx_hoodie_trades_completed_at ON hoodie_trades(completed_at);
      CREATE INDEX IF NOT EXISTS idx_imagination_credits_holder_id ON imagination_credits(holder_id);
      CREATE INDEX IF NOT EXISTS idx_vision_projects_status ON vision_projects(project_status);
      CREATE INDEX IF NOT EXISTS idx_vision_projects_type ON vision_projects(project_type);

      -- AIME Knowledge Hub Integration Tables
      -- Knowledge documents from GitHub repository
      CREATE TABLE IF NOT EXISTS knowledge_documents (
        id TEXT PRIMARY KEY,
        github_path TEXT UNIQUE NOT NULL,
        github_sha TEXT,
        title TEXT NOT NULL,
        content TEXT,
        markdown_content TEXT,
        document_type TEXT DEFAULT 'knowledge',
        metadata TEXT,
        validation_status TEXT DEFAULT 'pending',
        cultural_sensitivity_level TEXT DEFAULT 'public',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_synced_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Knowledge chunks for semantic search and validation
      CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        chunk_index INTEGER,
        chunk_content TEXT NOT NULL,
        chunk_type TEXT DEFAULT 'paragraph',
        concepts TEXT,
        relationships TEXT,
        validation_scores TEXT,
        semantic_embedding TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE
      );

      -- Multi-tier validation system
      CREATE TABLE IF NOT EXISTS knowledge_validations (
        id TEXT PRIMARY KEY,
        chunk_id TEXT,
        document_id TEXT,
        validator_id TEXT NOT NULL,
        validator_type TEXT NOT NULL,
        validator_name TEXT,
        vote_score INTEGER,
        confidence_level REAL DEFAULT 0.5,
        rationale TEXT,
        cultural_considerations TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chunk_id) REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE
      );

      -- Knowledge-Hoodie connections
      CREATE TABLE IF NOT EXISTS hoodie_knowledge_requirements (
        id TEXT PRIMARY KEY,
        hoodie_id TEXT NOT NULL,
        document_id TEXT,
        chunk_id TEXT,
        requirement_type TEXT DEFAULT 'engagement',
        validation_threshold REAL DEFAULT 0.7,
        cultural_protocol_required INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hoodie_id) REFERENCES hoodies(id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE,
        FOREIGN KEY (chunk_id) REFERENCES knowledge_chunks(id) ON DELETE CASCADE
      );

      -- Knowledge relationship graph
      CREATE TABLE IF NOT EXISTS knowledge_relationships (
        id TEXT PRIMARY KEY,
        source_type TEXT NOT NULL,
        source_id TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        strength REAL DEFAULT 0.5,
        discovered_by TEXT DEFAULT 'system',
        verified_by TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- User interaction tracking tables for smart search
      CREATE TABLE IF NOT EXISTS user_interactions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        content_id TEXT NOT NULL,
        interaction_type TEXT NOT NULL, -- view, click, share, save, etc.
        duration INTEGER DEFAULT 0, -- milliseconds
        timestamp INTEGER NOT NULL,
        metadata TEXT, -- JSON string
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        activity_type TEXT NOT NULL, -- search, recommendation_generated, etc.
        content_id TEXT,
        timestamp INTEGER NOT NULL,
        metadata TEXT, -- JSON string
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS search_history (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        query TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        results_count INTEGER DEFAULT 0,
        metadata TEXT, -- JSON string
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Add search_appearance_count to content table if not exists (ignore if already exists)
      -- ALTER TABLE content ADD COLUMN search_appearance_count INTEGER DEFAULT 0;

      -- Indexes for user tracking tables
      CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_content_id ON user_interactions(content_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_timestamp ON user_interactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
      CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_search_history_timestamp ON search_history(timestamp);

      -- Indexes for knowledge tables
      CREATE INDEX IF NOT EXISTS idx_knowledge_documents_github_path ON knowledge_documents(github_path);
      CREATE INDEX IF NOT EXISTS idx_knowledge_documents_type ON knowledge_documents(document_type);
      CREATE INDEX IF NOT EXISTS idx_knowledge_documents_validation ON knowledge_documents(validation_status);
      CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document_id ON knowledge_chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_type ON knowledge_chunks(chunk_type);
      CREATE INDEX IF NOT EXISTS idx_knowledge_validations_chunk_id ON knowledge_validations(chunk_id);
      CREATE INDEX IF NOT EXISTS idx_knowledge_validations_validator ON knowledge_validations(validator_type);
      CREATE INDEX IF NOT EXISTS idx_hoodie_knowledge_hoodie_id ON hoodie_knowledge_requirements(hoodie_id);
      CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_source ON knowledge_relationships(source_type, source_id);
      CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_target ON knowledge_relationships(target_type, target_id);
    `);
    
    console.log('📋 SQLite database schema created successfully with Hoodie Stock Exchange tables');
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    throw error;
  }
}

/**
 * Get database instance (initialize if needed)
 */
export async function getDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!db) {
    await initializeDatabase();
  }
  return db!;
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<{
  supabase: { connected: boolean; error?: string };
  sqlite: { connected: boolean; error?: string };
}> {
  const result = {
    supabase: { connected: false, error: undefined as string | undefined },
    sqlite: { connected: false, error: undefined as string | undefined }
  };

  // Check Supabase connection
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('content_items').select('id').limit(1);
    
    if (error) {
      result.supabase.error = error.message;
    } else {
      result.supabase.connected = true;
    }
  } catch (error) {
    result.supabase.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Check SQLite connection
  try {
    const database = await getDatabase();
    const testResult = await database.get('SELECT 1 as test');
    result.sqlite.connected = testResult?.test === 1;
  } catch (error) {
    result.sqlite.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

/**
 * Execute database operation with error handling and retry logic
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        console.error(`❌ Database operation failed after ${maxRetries} attempts:`, lastError);
        throw lastError;
      }

      console.warn(`⚠️ Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${retryDelayMs}ms:`, lastError.message);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      retryDelayMs *= 2; // Exponential backoff
    }
  }

  throw lastError!;
}

/**
 * Graceful shutdown - close all database connections
 */
export function closeDatabaseConnections(): void {
  if (db) {
    try {
      db.close();
      db = null;
      console.log('✅ SQLite connection closed');
    } catch (error) {
      console.error('❌ Error closing SQLite connection:', error);
    }
  }

  // Supabase connections are automatically managed
  if (supabaseClient) {
    supabaseClient = null;
    console.log('✅ Supabase client reference cleared');
  }
}

/**
 * Transaction wrapper for SQLite operations
 */
export function withTransaction<T>(
  operation: (db: Database<sqlite3.Database, sqlite3.Statement>) => Promise<T>
): Promise<T> {
  return executeWithRetry(async () => {
    const database = await getDatabase();
    await database.run('BEGIN TRANSACTION');
    try {
      const result = await operation(database);
      await database.run('COMMIT');
      return result;
    } catch (error) {
      await database.run('ROLLBACK');
      throw error;
    }
  });
}

/**
 * Content Repository - High-level database operations
 */
export class ContentRepository {
  private db: Database<sqlite3.Database, sqlite3.Statement>;

  constructor(database: Database<sqlite3.Database, sqlite3.Statement>) {
    this.db = database;
  }

  // TOOLS OPERATIONS
  async getTools(options: {
    limit?: number;
    offset?: number;
    category?: string;
    fileType?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'title' | 'relevance';
  } = {}): Promise<{ tools: any[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      category,
      fileType,
      search,
      sortBy = 'newest'
    } = options;

    let query = `
      SELECT c.*, t.tool_type, t.usage_restrictions, t.file_size, 
             t.attachments, t.download_url, t.view_count
      FROM content c
      LEFT JOIN tools t ON c.id = t.id
      WHERE c.content_type = 'tool'
    `;
    
    const params: any[] = [];
    
    // Add filters
    if (category && category !== 'all') {
      query += ` AND c.category = ?`;
      params.push(category);
    }
    
    if (fileType && fileType !== 'all') {
      query += ` AND c.file_type = ?`;
      params.push(fileType);
    }
    
    if (search) {
      query += ` AND c.id IN (
        SELECT id FROM content_fts 
        WHERE content_fts MATCH ?
      )`;
      params.push(search);
    }
    
    // Add sorting
    switch (sortBy) {
      case 'newest':
        query += ` ORDER BY c.created_at DESC`;
        break;
      case 'oldest':
        query += ` ORDER BY c.created_at ASC`;
        break;
      case 'title':
        query += ` ORDER BY c.title ASC`;
        break;
      case 'relevance':
        if (search) {
          query += ` ORDER BY rank`;
        } else {
          query += ` ORDER BY c.created_at DESC`;
        }
        break;
    }
    
    // Get total count
    const countQuery = query.replace(
      /SELECT c\.\*, t\.tool_type.*?FROM/,
      'SELECT COUNT(*) as total FROM'
    ).replace(/ORDER BY.*$/, '');
    
    const [{ total }] = await this.db.all(countQuery, params);
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const tools = await this.db.all(query, params);
    
    return { tools, total };
  }

  // BATCH UPSERT for sync operations - WITH DEBUG LOGGING
  async batchUpsertContent(items: any[], source: string): Promise<number> {
    const startTime = Date.now();
    
    console.log(`🔧 DEBUG: Starting batch upsert for ${source} with ${items.length} items`);
    
    try {
      await this.db.run('BEGIN TRANSACTION');
      
      const contentStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO content (
          id, source, source_id, title, description, content_type,
          category, file_type, url, thumbnail_url, tags, themes,
          topics, authors, metadata, source_created_at, source_updated_at,
          last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const toolsStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO tools (
          id, tool_type, usage_restrictions, file_size, download_url,
          attachment_count, attachments, airtable_record_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let upsertedCount = 0;
      
      console.log(`🔧 DEBUG: Processing ${items.length} items in database transaction...`);
      
      for (const item of items) {
        try {
          // Insert into content table
          await contentStmt.run(
            item.id,
            source,
            item.source_id || item.id,
            item.title,
            item.description || '',
            item.content_type || 'tool',
            item.category || 'General',
            item.file_type || 'Unknown',
            item.url,
            item.thumbnail_url,
            JSON.stringify(item.tags || []),
            JSON.stringify(item.themes || []),
            JSON.stringify(item.topics || []),
            JSON.stringify(item.authors || []),
            JSON.stringify(item.metadata || {}),
            item.source_created_at || item.created_at,
            item.source_updated_at || item.updated_at,
            new Date().toISOString()
          );
          
          // Insert into tools table if it's a tool
          if (item.content_type === 'tool' || source === 'airtable') {
            await toolsStmt.run(
              item.id,
              item.tool_type,
              item.usage_restrictions,
              item.file_size,
              item.download_url,
              item.attachments?.length || 0,
              JSON.stringify(item.attachments || []),
              item.airtable_record_id || item.source_id
            );
          }
          
          upsertedCount++;
          
          // Debug progress every 100 items
          if (upsertedCount % 100 === 0) {
            console.log(`🔧 DEBUG: Processed ${upsertedCount}/${items.length} items...`);
          }
        } catch (error) {
          console.error(`🔧 DEBUG: Failed to upsert item ${item.id}:`, error);
          // Continue processing other items
        }
      }
      
      await contentStmt.finalize();
      await toolsStmt.finalize();
      
      console.log(`🔧 DEBUG: About to commit transaction with ${upsertedCount} items processed`);
      await this.db.run('COMMIT');
      
      // Update sync status
      await this.updateSyncStatus(source, upsertedCount, Date.now() - startTime);
      
      console.log(`✅ Batch upserted ${upsertedCount} items from ${source} in ${Date.now() - startTime}ms`);
      console.log(`🔧 DEBUG: Database transaction completed successfully`);
      return upsertedCount;
      
    } catch (error) {
      await this.db.run('ROLLBACK');
      console.error(`❌ Batch upsert failed for ${source}:`, error);
      throw error;
    }
  }

  // NEWSLETTERS OPERATIONS
  async getNewsletters(options: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'subject' | 'opens';
  } = {}): Promise<{ newsletters: any[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      status = 'sent',
      type,
      search,
      sortBy = 'newest'
    } = options;

    let query = `
      SELECT c.*, n.campaign_id, n.web_id, n.subject_line, n.preview_text,
             n.archive_url, n.long_archive_url, n.email_count, n.opens, 
             n.unique_opens, n.clicks, n.unique_clicks, n.open_rate, 
             n.click_rate, n.send_time, n.create_time, n.recipient_count,
             n.status as campaign_status, n.type as campaign_type
      FROM content c
      JOIN newsletters n ON c.id = n.id
      WHERE c.content_type = 'newsletter' AND c.source = 'mailchimp'
    `;
    
    const params: any[] = [];
    
    // Add filters
    if (status && status !== 'all') {
      query += ` AND n.status = ?`;
      params.push(status);
    }
    
    if (type && type !== 'all') {
      query += ` AND n.type = ?`;
      params.push(type);
    }
    
    if (search && search.trim()) {
      query += ` AND (c.title LIKE ? OR n.subject_line LIKE ? OR n.preview_text LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Add sorting
    switch (sortBy) {
      case 'newest':
        query += ` ORDER BY n.send_time DESC`;
        break;
      case 'oldest':
        query += ` ORDER BY n.send_time ASC`;
        break;
      case 'subject':
        query += ` ORDER BY n.subject_line ASC`;
        break;
      case 'opens':
        query += ` ORDER BY n.opens DESC`;
        break;
      default:
        query += ` ORDER BY n.send_time DESC`;
    }
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM content c
      JOIN newsletters n ON c.id = n.id
      WHERE c.content_type = 'newsletter' AND c.source = 'mailchimp'
    `;
    
    const countParams: any[] = [];
    
    if (status && status !== 'all') {
      countQuery += ` AND n.status = ?`;
      countParams.push(status);
    }
    
    if (type && type !== 'all') {
      countQuery += ` AND n.type = ?`;
      countParams.push(type);
    }
    
    if (search && search.trim()) {
      countQuery += ` AND (c.title LIKE ? OR n.subject_line LIKE ? OR n.preview_text LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const totalResult = await this.db.get(countQuery, countParams);
    const total = totalResult?.total || 0;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const newsletters = await this.db.all(query, params);
    
    return { newsletters, total };
  }

  async getNewsletter(id: string): Promise<any | null> {
    const newsletter = await this.db.get(`
      SELECT c.*, n.campaign_id, n.web_id, n.subject_line, n.preview_text,
             n.content_html, n.content_text, n.archive_url, n.long_archive_url,
             n.email_count, n.opens, n.unique_opens, n.clicks, n.unique_clicks,
             n.unsubscribes, n.bounce_rate, n.open_rate, n.click_rate,
             n.send_time, n.create_time, n.recipient_count, n.settings,
             n.tracking, n.social_card, n.report_summary, n.delivery_status,
             n.status as campaign_status, n.type as campaign_type
      FROM content c
      JOIN newsletters n ON c.id = n.id
      WHERE c.id = ? OR n.campaign_id = ?
    `, [id, id]);
    
    return newsletter || null;
  }

  async batchUpsertNewsletters(campaigns: any[]): Promise<number> {
    const startTime = Date.now();
    
    console.log(`📧 Starting batch upsert for newsletters with ${campaigns.length} items`);
    
    try {
      await this.db.run('BEGIN TRANSACTION');
      
      const contentStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO content (
          id, source, source_id, title, description, content_type,
          category, url, thumbnail_url, tags, metadata, 
          source_created_at, source_updated_at, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const newsletterStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO newsletters (
          id, campaign_id, web_id, list_id, folder_id, type, status,
          subject_line, preview_text, content_html, content_text,
          archive_url, long_archive_url, email_count, opens, unique_opens,
          clicks, unique_clicks, unsubscribes, bounce_rate, open_rate,
          click_rate, send_time, create_time, segment_text, recipient_count,
          settings, tracking, social_card, report_summary, delivery_status,
          mailchimp_created_at, mailchimp_updated_at, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let upsertedCount = 0;
      
      for (const campaign of campaigns) {
        try {
          const id = `newsletter-${campaign.id}`;
          
          // Insert into content table
          await contentStmt.run(
            id,
            'mailchimp',
            campaign.id,
            campaign.settings?.subject_line || campaign.subject_line || 'Untitled Newsletter',
            campaign.settings?.preview_text || campaign.preview_text || '',
            'newsletter',
            'Newsletter',
            campaign.archive_url || campaign.long_archive_url,
            null, // thumbnail_url
            JSON.stringify(campaign.tags || []),
            JSON.stringify({
              campaign_type: campaign.type,
              status: campaign.status,
              list_id: campaign.recipients?.list_id,
              folder_id: campaign.settings?.folder_id
            }),
            campaign.create_time,
            campaign.send_time || campaign.create_time,
            new Date().toISOString()
          );
          
          // Insert into newsletters table
          await newsletterStmt.run(
            id,
            campaign.id,
            campaign.web_id || null,
            campaign.recipients?.list_id || null,
            campaign.settings?.folder_id || null,
            campaign.type || 'regular',
            campaign.status || 'sent',
            campaign.settings?.subject_line || campaign.subject_line || '',
            campaign.settings?.preview_text || campaign.preview_text || '',
            campaign.content?.html || '',
            campaign.content?.plain_text || '',
            campaign.archive_url || '',
            campaign.long_archive_url || '',
            campaign.emails_sent || 0,
            campaign.report_summary?.opens || 0,
            campaign.report_summary?.unique_opens || 0,
            campaign.report_summary?.subscriber_clicks || 0,
            campaign.report_summary?.clicks || 0,
            campaign.report_summary?.unsubscribed || 0,
            campaign.report_summary?.bounce_rate || 0.0,
            campaign.report_summary?.open_rate || 0.0,
            campaign.report_summary?.click_rate || 0.0,
            campaign.send_time || null,
            campaign.create_time || null,
            campaign.recipients?.segment_text || '',
            campaign.recipients?.recipient_count || 0,
            JSON.stringify(campaign.settings || {}),
            JSON.stringify(campaign.tracking || {}),
            JSON.stringify(campaign.social_card || {}),
            JSON.stringify(campaign.report_summary || {}),
            JSON.stringify(campaign.delivery_status || {}),
            campaign.create_time,
            campaign.send_time || campaign.create_time,
            new Date().toISOString()
          );
          
          upsertedCount++;
          
          if (upsertedCount % 50 === 0) {
            console.log(`📧 Processed ${upsertedCount}/${campaigns.length} newsletters...`);
          }
        } catch (error) {
          console.error(`📧 Failed to upsert newsletter ${campaign.id}:`, error);
        }
      }
      
      await contentStmt.finalize();
      await newsletterStmt.finalize();
      
      await this.db.run('COMMIT');
      
      // Update sync status
      await this.updateSyncStatus('mailchimp', upsertedCount, Date.now() - startTime);
      
      console.log(`✅ Batch upserted ${upsertedCount} newsletters in ${Date.now() - startTime}ms`);
      return upsertedCount;
      
    } catch (error) {
      await this.db.run('ROLLBACK');
      console.error(`❌ Newsletter batch upsert failed:`, error);
      throw error;
    }
  }

  // VIDEOS OPERATIONS
  async getVideos(options: {
    limit?: number;
    offset?: number;
    channel?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'views' | 'title';
    minDuration?: number;
    maxDuration?: number;
  } = {}): Promise<{ videos: any[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      channel,
      search,
      sortBy = 'newest',
      minDuration,
      maxDuration
    } = options;

    let query = `
      SELECT c.*, v.video_id, v.channel_id, v.channel_title, v.duration,
             v.view_count, v.like_count, v.comment_count, v.published_at,
             v.transcript, v.captions_available, v.privacy_status
      FROM content c
      JOIN videos v ON c.id = v.id
      WHERE c.content_type = 'video' AND c.source = 'youtube'
    `;
    
    const params: any[] = [];
    
    // Add filters
    if (channel && channel !== 'all') {
      query += ` AND v.channel_id = ?`;
      params.push(channel);
    }
    
    if (search && search.trim()) {
      query += ` AND (c.title LIKE ? OR c.description LIKE ? OR v.transcript LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Duration filters (assuming duration is in seconds)
    if (minDuration) {
      query += ` AND CAST(v.duration AS INTEGER) >= ?`;
      params.push(minDuration);
    }
    
    if (maxDuration) {
      query += ` AND CAST(v.duration AS INTEGER) <= ?`;
      params.push(maxDuration);
    }
    
    // Add sorting
    switch (sortBy) {
      case 'newest':
        query += ` ORDER BY v.published_at DESC`;
        break;
      case 'oldest':
        query += ` ORDER BY v.published_at ASC`;
        break;
      case 'views':
        query += ` ORDER BY v.view_count DESC`;
        break;
      case 'title':
        query += ` ORDER BY c.title ASC`;
        break;
      default:
        query += ` ORDER BY v.published_at DESC`;
    }
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM content c
      JOIN videos v ON c.id = v.id
      WHERE c.content_type = 'video' AND c.source = 'youtube'
    `;
    
    const countParams: any[] = [];
    
    if (channel && channel !== 'all') {
      countQuery += ` AND v.channel_id = ?`;
      countParams.push(channel);
    }
    
    if (search && search.trim()) {
      countQuery += ` AND (c.title LIKE ? OR c.description LIKE ? OR v.transcript LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (minDuration) {
      countQuery += ` AND CAST(v.duration AS INTEGER) >= ?`;
      countParams.push(minDuration);
    }
    
    if (maxDuration) {
      countQuery += ` AND CAST(v.duration AS INTEGER) <= ?`;
      countParams.push(maxDuration);
    }
    
    const totalResult = await this.db.get(countQuery, countParams);
    const total = totalResult?.total || 0;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const videos = await this.db.all(query, params);
    
    return { videos, total };
  }

  async getVideo(id: string): Promise<any | null> {
    const video = await this.db.get(`
      SELECT c.*, v.video_id, v.channel_id, v.channel_title, v.duration,
             v.view_count, v.like_count, v.comment_count, v.published_at,
             v.transcript, v.captions_available, v.video_quality, v.definition,
             v.dimension, v.licensed_content, v.default_language, 
             v.live_broadcast_content, v.privacy_status, v.embeddable
      FROM content c
      JOIN videos v ON c.id = v.id
      WHERE c.id = ? OR v.video_id = ?
    `, [id, id]);
    
    return video || null;
  }

  async batchUpsertVideos(videos: any[]): Promise<number> {
    const startTime = Date.now();
    
    console.log(`📺 Starting batch upsert for videos with ${videos.length} items`);
    
    try {
      await this.db.run('BEGIN TRANSACTION');
      
      const contentStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO content (
          id, source, source_id, title, description, content_type,
          category, url, thumbnail_url, tags, metadata, 
          source_created_at, source_updated_at, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const videoStmt = await this.db.prepare(`
        INSERT OR REPLACE INTO videos (
          id, video_id, channel_id, channel_title, duration, view_count,
          like_count, comment_count, published_at, transcript,
          captions_available, video_quality, definition, dimension,
          licensed_content, default_language, default_audio_language,
          live_broadcast_content, privacy_status, upload_status,
          embeddable, public_stats_viewable, made_for_kids,
          youtube_created_at, youtube_updated_at, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let upsertedCount = 0;
      
      for (const video of videos) {
        try {
          const id = `video-${video.video_id || video.id}`;
          
          // Insert into content table
          await contentStmt.run(
            id,
            'youtube',
            video.video_id || video.id,
            video.title || video.snippet?.title || 'Untitled Video',
            video.description || video.snippet?.description || '',
            'video',
            'Video',
            `https://www.youtube.com/watch?v=${video.video_id || video.id}`,
            video.thumbnail_url || video.snippet?.thumbnails?.default?.url,
            JSON.stringify(video.tags || video.snippet?.tags || []),
            JSON.stringify({
              channel_id: video.channel_id || video.snippet?.channelId,
              channel_title: video.channel_title || video.snippet?.channelTitle,
              category_id: video.snippet?.categoryId,
              default_language: video.snippet?.defaultLanguage,
              live_broadcast_content: video.snippet?.liveBroadcastContent
            }),
            video.published_at || video.snippet?.publishedAt,
            video.updated_at || new Date().toISOString(),
            new Date().toISOString()
          );
          
          // Insert into videos table
          await videoStmt.run(
            id,
            video.video_id || video.id,
            video.channel_id || video.snippet?.channelId || '',
            video.channel_title || video.snippet?.channelTitle || '',
            video.duration || video.contentDetails?.duration || '',
            parseInt(video.view_count || video.statistics?.viewCount || '0'),
            parseInt(video.like_count || video.statistics?.likeCount || '0'),
            parseInt(video.comment_count || video.statistics?.commentCount || '0'),
            video.published_at || video.snippet?.publishedAt || null,
            video.transcript || '',
            video.captions_available || (video.contentDetails?.caption === 'true' ? 1 : 0),
            video.video_quality || video.contentDetails?.definition || '',
            video.definition || video.contentDetails?.definition || '',
            video.dimension || video.contentDetails?.dimension || '',
            video.licensed_content || (video.contentDetails?.licensedContent ? 1 : 0),
            video.default_language || video.snippet?.defaultLanguage || '',
            video.default_audio_language || video.snippet?.defaultAudioLanguage || '',
            video.live_broadcast_content || video.snippet?.liveBroadcastContent || '',
            video.privacy_status || video.status?.privacyStatus || 'public',
            video.upload_status || video.status?.uploadStatus || 'processed',
            video.embeddable !== false ? 1 : 0,
            video.public_stats_viewable !== false ? 1 : 0,
            video.made_for_kids || (video.status?.madeForKids ? 1 : 0),
            video.published_at || video.snippet?.publishedAt,
            video.updated_at || new Date().toISOString(),
            new Date().toISOString()
          );
          
          upsertedCount++;
          
          if (upsertedCount % 50 === 0) {
            console.log(`📺 Processed ${upsertedCount}/${videos.length} videos...`);
          }
        } catch (error) {
          console.error(`📺 Failed to upsert video ${video.video_id || video.id}:`, error);
        }
      }
      
      await contentStmt.finalize();
      await videoStmt.finalize();
      
      await this.db.run('COMMIT');
      
      // Update sync status
      await this.updateSyncStatus('youtube', upsertedCount, Date.now() - startTime);
      
      console.log(`✅ Batch upserted ${upsertedCount} videos in ${Date.now() - startTime}ms`);
      return upsertedCount;
      
    } catch (error) {
      await this.db.run('ROLLBACK');
      console.error(`❌ Video batch upsert failed:`, error);
      throw error;
    }
  }

  // GET TOOLS - Fast database query for tools page
  async getTools(options: {
    limit?: number;
    offset?: number;
    category?: string;
    fileType?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'title' | 'relevance';
  } = {}): Promise<{ tools: any[], total: number }> {
    const { limit = 12, offset = 0, category, fileType, search, sortBy = 'newest' } = options;
    
    console.log(`🔍 Database: Getting tools with options:`, options);
    
    // Build base query for tools from Airtable
    let baseQuery = `
      SELECT c.*, t.tool_type, t.usage_restrictions, t.file_size, 
             t.download_url, t.attachments, t.airtable_record_id
      FROM content c
      LEFT JOIN tools t ON c.id = t.id
      WHERE c.content_type = 'tool' AND c.source = 'airtable'
    `;
    
    const params: any[] = [];
    
    // Add filters
    if (category && category !== 'all') {
      baseQuery += ` AND c.category = ?`;
      params.push(category);
    }
    
    if (fileType && fileType !== 'all') {
      baseQuery += ` AND c.file_type = ?`;
      params.push(fileType);
    }
    
    if (search && search.trim()) {
      baseQuery += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Add sorting
    switch (sortBy) {
      case 'newest':
        baseQuery += ` ORDER BY c.created_at DESC`;
        break;
      case 'oldest':
        baseQuery += ` ORDER BY c.created_at ASC`;
        break;
      case 'title':
        baseQuery += ` ORDER BY c.title ASC`;
        break;
      default:
        baseQuery += ` ORDER BY c.created_at DESC`;
    }
    
    // Get total count - FIXED!
    let countQuery = `
      SELECT COUNT(*) as total
      FROM content c
      WHERE c.content_type = 'tool' AND c.source = 'airtable'
    `;
    
    const countParams: any[] = [];
    
    // Add same filters for count
    if (category && category !== 'all') {
      countQuery += ` AND c.category = ?`;
      countParams.push(category);
    }
    
    if (fileType && fileType !== 'all') {
      countQuery += ` AND c.file_type = ?`;
      countParams.push(fileType);
    }
    
    if (search && search.trim()) {
      countQuery += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const totalResult = await this.db.get(countQuery, countParams);
    const total = totalResult?.total || 0;
    
    console.log(`🔍 Database: Found ${total} total tools matching criteria`);
    
    // Add pagination
    baseQuery += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const tools = await this.db.all(baseQuery, params);
    
    console.log(`🔍 Database: Returning ${tools.length} tools (${offset}-${offset + tools.length} of ${total})`);
    
    return { tools, total };
  }

  // SEARCH with full-text search
  async searchContent(query: string, options: {
    limit?: number;
    offset?: number;
    contentType?: string;
  } = {}): Promise<{ results: any[], total: number }> {
    const { limit = 50, offset = 0, contentType } = options;
    
    let searchQuery = `
      SELECT c.*, rank
      FROM content_fts 
      JOIN content c ON content_fts.id = c.id
      WHERE content_fts MATCH ?
    `;
    
    const params: any[] = [query];
    
    if (contentType && contentType !== 'all') {
      searchQuery += ` AND c.content_type = ?`;
      params.push(contentType);
    }
    
    searchQuery += ` ORDER BY rank LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const results = await this.db.all(searchQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM content_fts 
      JOIN content c ON content_fts.id = c.id
      WHERE content_fts MATCH ?
      ${contentType && contentType !== 'all' ? 'AND c.content_type = ?' : ''}
    `;
    
    const countParams = contentType && contentType !== 'all' ? [query, contentType] : [query];
    const [{ total }] = await this.db.all(countQuery, countParams);
    
    return { results, total };
  }

  // ANALYTICS
  async updateSyncStatus(source: string, recordCount: number, durationMs: number): Promise<void> {
    await this.db.run(`
      INSERT OR REPLACE INTO sync_status (
        source, last_sync_at, last_successful_sync_at, total_records,
        sync_duration_ms, error_count, next_sync_at
      ) VALUES (?, ?, ?, ?, ?, 0, ?)
    `, [
      source,
      new Date().toISOString(),
      new Date().toISOString(),
      recordCount,
      durationMs,
      new Date(Date.now() + 30 * 60 * 1000).toISOString() // Next sync in 30 minutes
    ]);
  }

  async getSyncStatus(): Promise<any[]> {
    return this.db.all(`
      SELECT * FROM sync_status 
      ORDER BY last_sync_at DESC
    `);
  }

  async getStats(): Promise<any> {
    const [contentStats] = await this.db.all(`
      SELECT 
        COUNT(*) as total_items,
        COUNT(DISTINCT source) as total_sources,
        COUNT(CASE WHEN content_type = 'tool' THEN 1 END) as tools_count,
        COUNT(CASE WHEN content_type = 'video' THEN 1 END) as videos_count,
        COUNT(CASE WHEN content_type = 'newsletter' THEN 1 END) as newsletters_count,
        COUNT(CASE WHEN content_type = 'document' THEN 1 END) as documents_count,
        MAX(last_synced_at) as last_sync
      FROM content
    `);
    
    const sourceStats = await this.db.all(`
      SELECT source, COUNT(*) as count
      FROM content
      GROUP BY source
    `);
    
    return {
      ...contentStats,
      source_breakdown: sourceStats.reduce((acc, stat) => {
        acc[stat.source] = stat.count;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // HOODIE STOCK EXCHANGE OPERATIONS

  // Get all hoodies with filtering and pagination
  async getHoodies(options: {
    limit?: number;
    offset?: number;
    category?: string;
    rarity?: string;
    tradeable?: boolean;
    search?: string;
    sortBy?: 'newest' | 'impact' | 'rarity' | 'holders';
  } = {}): Promise<{ hoodies: any[], total: number }> {
    const {
      limit = 50,
      offset = 0,
      category,
      rarity,
      tradeable,
      search,
      sortBy = 'newest'
    } = options;

    let query = `
      SELECT h.*, 
             COUNT(hh.id) as active_holders,
             AVG(hh.utilization_rate) as avg_utilization,
             SUM(hh.current_impact_contribution) as total_impact
      FROM hoodies h
      LEFT JOIN hoodie_holders hh ON h.id = hh.hoodie_id AND hh.is_active = 1
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (category && category !== 'all') {
      query += ` AND h.category = ?`;
      params.push(category);
    }
    
    if (rarity && rarity !== 'all') {
      query += ` AND h.rarity_level = ?`;
      params.push(rarity);
    }
    
    if (tradeable !== undefined) {
      query += ` AND h.is_tradeable = ?`;
      params.push(tradeable ? 1 : 0);
    }
    
    if (search && search.trim()) {
      query += ` AND (h.name LIKE ? OR h.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` GROUP BY h.id`;
    
    // Add sorting
    switch (sortBy) {
      case 'impact':
        query += ` ORDER BY total_impact DESC`;
        break;
      case 'rarity':
        query += ` ORDER BY 
          CASE h.rarity_level 
            WHEN 'mythic' THEN 1 
            WHEN 'legendary' THEN 2 
            WHEN 'rare' THEN 3 
            WHEN 'common' THEN 4 
          END`;
        break;
      case 'holders':
        query += ` ORDER BY active_holders DESC`;
        break;
      default:
        query += ` ORDER BY h.created_at DESC`;
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT h.id) as total
      FROM hoodies h
      WHERE 1=1
      ${category && category !== 'all' ? 'AND h.category = ?' : ''}
      ${rarity && rarity !== 'all' ? 'AND h.rarity_level = ?' : ''}
      ${tradeable !== undefined ? 'AND h.is_tradeable = ?' : ''}
      ${search && search.trim() ? 'AND (h.name LIKE ? OR h.description LIKE ?)' : ''}
    `;
    
    const countParams: any[] = [];
    if (category && category !== 'all') countParams.push(category);
    if (rarity && rarity !== 'all') countParams.push(rarity);
    if (tradeable !== undefined) countParams.push(tradeable ? 1 : 0);
    if (search && search.trim()) countParams.push(`%${search}%`, `%${search}%`);
    
    const totalResult = await this.db.get(countQuery, countParams);
    const total = totalResult?.total || 0;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const hoodies = await this.db.all(query, params);
    
    return { hoodies, total };
  }

  // Get specific hoodie with detailed information
  async getHoodie(id: string): Promise<any | null> {
    const hoodie = await this.db.get(`
      SELECT h.*,
             COUNT(hh.id) as active_holders,
             AVG(hh.utilization_rate) as avg_utilization,
             SUM(hh.current_impact_contribution) as total_impact,
             MAX(ht.completed_at) as last_trade_date
      FROM hoodies h
      LEFT JOIN hoodie_holders hh ON h.id = hh.hoodie_id AND hh.is_active = 1
      LEFT JOIN hoodie_trades ht ON h.id = ht.hoodie_id AND ht.trade_status = 'completed'
      WHERE h.id = ?
      GROUP BY h.id
    `, [id]);
    
    if (!hoodie) return null;
    
    // Get recent holders
    const holders = await this.db.all(`
      SELECT hh.*, ic.credits_balance, ic.impact_multiplier
      FROM hoodie_holders hh
      LEFT JOIN imagination_credits ic ON hh.holder_id = ic.holder_id
      WHERE hh.hoodie_id = ? AND hh.is_active = 1
      ORDER BY hh.acquired_at DESC
      LIMIT 10
    `, [id]);
    
    // Get recent trades
    const trades = await this.db.all(`
      SELECT ht.*, 
             from_holder.holder_name as from_name,
             to_holder.holder_name as to_name
      FROM hoodie_trades ht
      LEFT JOIN hoodie_holders from_holder ON ht.from_holder_id = from_holder.holder_id
      LEFT JOIN hoodie_holders to_holder ON ht.to_holder_id = to_holder.holder_id
      WHERE ht.hoodie_id = ?
      ORDER BY ht.completed_at DESC
      LIMIT 10
    `, [id]);
    
    return {
      ...hoodie,
      current_holders: holders,
      recent_trades: trades
    };
  }

  // Create or update hoodie
  async upsertHoodie(hoodie: any): Promise<string> {
    const id = hoodie.id || `hoodie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db.run(`
      INSERT OR REPLACE INTO hoodies (
        id, name, description, category, subcategory, icon_url, rarity_level,
        base_impact_value, imagination_credit_multiplier, unlock_criteria,
        prerequisite_hoodies, associated_content_id, is_tradeable,
        is_mentorship_required, max_holders, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      hoodie.name,
      hoodie.description || '',
      hoodie.category,
      hoodie.subcategory || '',
      hoodie.icon_url || '',
      hoodie.rarity_level || 'common',
      hoodie.base_impact_value || 0.0,
      hoodie.imagination_credit_multiplier || 1.0,
      JSON.stringify(hoodie.unlock_criteria || {}),
      JSON.stringify(hoodie.prerequisite_hoodies || []),
      hoodie.associated_content_id || null,
      hoodie.is_tradeable !== false ? 1 : 0,
      hoodie.is_mentorship_required ? 1 : 0,
      hoodie.max_holders || -1,
      new Date().toISOString()
    ]);
    
    return id;
  }

  // Award hoodie to holder
  async awardHoodie(hoodieId: string, holderData: {
    holder_id: string;
    holder_name: string;
    holder_email?: string;
    acquisition_story?: string;
    acquired_method?: string;
  }): Promise<string> {
    const holderId = `holder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db.run(`
      INSERT INTO hoodie_holders (
        id, hoodie_id, holder_id, holder_name, holder_email,
        acquisition_story, acquired_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      holderId,
      hoodieId,
      holderData.holder_id,
      holderData.holder_name,
      holderData.holder_email || '',
      holderData.acquisition_story || '',
      holderData.acquired_method || 'earned'
    ]);
    
    // Update hoodie holder count
    await this.db.run(`
      UPDATE hoodies 
      SET current_holders = current_holders + 1 
      WHERE id = ?
    `, [hoodieId]);
    
    // Initialize imagination credits if needed
    await this.db.run(`
      INSERT OR IGNORE INTO imagination_credits (
        id, holder_id, credits_balance
      ) VALUES (?, ?, ?)
    `, [
      `credits-${holderData.holder_id}`,
      holderData.holder_id,
      10.0 // Starting credits
    ]);
    
    return holderId;
  }

  // Execute trade between holders
  async executeTrade(trade: {
    hoodie_id: string;
    from_holder_id?: string;
    to_holder_id: string;
    trade_type?: string;
    imagination_credits_used?: number;
    trade_narrative?: string;
    vision_alignment_score?: number;
    community_validation_score?: number;
    trade_conditions?: any;
  }): Promise<string> {
    const tradeId = `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await this.db.run('BEGIN TRANSACTION');
      
      // Create trade record
      await this.db.run(`
        INSERT INTO hoodie_trades (
          id, hoodie_id, from_holder_id, to_holder_id, trade_type,
          imagination_credits_used, trade_narrative, vision_alignment_score,
          community_validation_score, trade_conditions, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        tradeId,
        trade.hoodie_id,
        trade.from_holder_id || null,
        trade.to_holder_id,
        trade.trade_type || 'standard',
        trade.imagination_credits_used || 0.0,
        trade.trade_narrative || '',
        trade.vision_alignment_score || 0.0,
        trade.community_validation_score || 0.0,
        JSON.stringify(trade.trade_conditions || {}),
        new Date().toISOString()
      ]);
      
      // If transferring from another holder, deactivate their ownership
      if (trade.from_holder_id) {
        await this.db.run(`
          UPDATE hoodie_holders 
          SET is_active = 0 
          WHERE hoodie_id = ? AND holder_id = ? AND is_active = 1
        `, [trade.hoodie_id, trade.from_holder_id]);
        
        // Deduct imagination credits from sender
        if (trade.imagination_credits_used && trade.imagination_credits_used > 0) {
          await this.db.run(`
            UPDATE imagination_credits 
            SET credits_balance = credits_balance - ?,
                credits_spent_lifetime = credits_spent_lifetime + ?
            WHERE holder_id = ?
          `, [trade.imagination_credits_used, trade.imagination_credits_used, trade.from_holder_id]);
        }
      }
      
      // Create new holder record or activate existing
      const existingHolder = await this.db.get(`
        SELECT id FROM hoodie_holders 
        WHERE hoodie_id = ? AND holder_id = ?
      `, [trade.hoodie_id, trade.to_holder_id]);
      
      if (existingHolder) {
        await this.db.run(`
          UPDATE hoodie_holders 
          SET is_active = 1, acquired_at = ?, acquired_method = 'traded'
          WHERE id = ?
        `, [new Date().toISOString(), existingHolder.id]);
      } else {
        await this.awardHoodie(trade.hoodie_id, {
          holder_id: trade.to_holder_id,
          holder_name: 'New Holder', // Would be provided in real implementation
          acquired_method: 'traded'
        });
      }
      
      await this.db.run('COMMIT');
      return tradeId;
      
    } catch (error) {
      await this.db.run('ROLLBACK');
      throw error;
    }
  }

  // Get holder's portfolio
  async getHolderPortfolio(holderId: string): Promise<any> {
    const hoodies = await this.db.all(`
      SELECT h.*, hh.acquired_at, hh.acquisition_story, hh.current_impact_contribution,
             hh.utilization_rate, hh.acquired_method
      FROM hoodies h
      JOIN hoodie_holders hh ON h.id = hh.hoodie_id
      WHERE hh.holder_id = ? AND hh.is_active = 1
      ORDER BY hh.acquired_at DESC
    `, [holderId]);
    
    const credits = await this.db.get(`
      SELECT * FROM imagination_credits WHERE holder_id = ?
    `, [holderId]);
    
    const tradingHistory = await this.db.all(`
      SELECT ht.*, h.name as hoodie_name
      FROM hoodie_trades ht
      JOIN hoodies h ON ht.hoodie_id = h.id
      WHERE ht.from_holder_id = ? OR ht.to_holder_id = ?
      ORDER BY ht.completed_at DESC
      LIMIT 20
    `, [holderId, holderId]);
    
    return {
      holder_id: holderId,
      active_hoodies: hoodies,
      imagination_credits: credits,
      trading_history: tradingHistory,
      total_impact: hoodies.reduce((sum, h) => sum + (h.current_impact_contribution || 0), 0),
      portfolio_value: hoodies.reduce((sum, h) => sum + (h.base_impact_value || 0), 0)
    };
  }

  // Get trading opportunities (available hoodies for trade)
  async getTradingOpportunities(holderId: string, options: {
    category?: string;
    maxPrice?: number;
    limit?: number;
  } = {}): Promise<any[]> {
    const { category, maxPrice, limit = 20 } = options;
    
    let query = `
      SELECT h.*, hh.holder_id as current_holder, hh.holder_name,
             ic.credits_balance as holder_credits,
             COUNT(ht.id) as trade_count,
             AVG(ht.imagination_credits_used) as avg_trade_price
      FROM hoodies h
      JOIN hoodie_holders hh ON h.id = hh.hoodie_id AND hh.is_active = 1
      LEFT JOIN imagination_credits ic ON hh.holder_id = ic.holder_id
      LEFT JOIN hoodie_trades ht ON h.id = ht.hoodie_id
      WHERE h.is_tradeable = 1 AND hh.holder_id != ?
    `;
    
    const params: any[] = [holderId];
    
    if (category && category !== 'all') {
      query += ` AND h.category = ?`;
      params.push(category);
    }
    
    query += ` GROUP BY h.id, hh.id`;
    
    if (maxPrice) {
      query += ` HAVING avg_trade_price <= ? OR avg_trade_price IS NULL`;
      params.push(maxPrice);
    }
    
    query += ` ORDER BY h.total_impact_generated DESC LIMIT ?`;
    params.push(limit);
    
    return this.db.all(query, params);
  }

  // Get hoodie exchange statistics
  async getHoodieExchangeStats(): Promise<any> {
    const [stats] = await this.db.all(`
      SELECT 
        COUNT(DISTINCT h.id) as total_hoodies,
        COUNT(DISTINCT hh.holder_id) as total_holders,
        COUNT(DISTINCT ht.id) as total_trades,
        SUM(h.total_impact_generated) as cumulative_impact,
        AVG(ht.imagination_credits_used) as avg_trade_price,
        COUNT(CASE WHEN h.rarity_level = 'mythic' THEN 1 END) as mythic_hoodies,
        COUNT(CASE WHEN h.rarity_level = 'legendary' THEN 1 END) as legendary_hoodies,
        COUNT(CASE WHEN h.rarity_level = 'rare' THEN 1 END) as rare_hoodies,
        COUNT(CASE WHEN h.rarity_level = 'common' THEN 1 END) as common_hoodies
      FROM hoodies h
      LEFT JOIN hoodie_holders hh ON h.id = hh.hoodie_id AND hh.is_active = 1
      LEFT JOIN hoodie_trades ht ON h.id = ht.hoodie_id AND ht.trade_status = 'completed'
    `);
    
    const categoryStats = await this.db.all(`
      SELECT category, COUNT(*) as count, AVG(base_impact_value) as avg_impact
      FROM hoodies
      GROUP BY category
    `);
    
    const topHolders = await this.db.all(`
      SELECT hh.holder_id, hh.holder_name, 
             COUNT(h.id) as hoodie_count,
             SUM(h.base_impact_value) as portfolio_value,
             ic.credits_balance
      FROM hoodie_holders hh
      JOIN hoodies h ON hh.hoodie_id = h.id
      LEFT JOIN imagination_credits ic ON hh.holder_id = ic.holder_id
      WHERE hh.is_active = 1
      GROUP BY hh.holder_id
      ORDER BY portfolio_value DESC
      LIMIT 10
    `);
    
    return {
      ...stats,
      category_breakdown: categoryStats,
      top_holders: topHolders
    };
  }
}

// Singleton repository instance
let repository: ContentRepository | null = null;

export async function getContentRepository(): Promise<ContentRepository> {
  if (!repository) {
    const database = await getDatabase();
    repository = new ContentRepository(database);
  }
  return repository;
}

// Initialize cleanup handlers on module load (server-side only)
if (typeof window === 'undefined') {
  // Only initialize on server-side
  process.on('beforeExit', closeDatabaseConnections);
  process.on('SIGINT', closeDatabaseConnections);
  process.on('SIGTERM', closeDatabaseConnections);
} 