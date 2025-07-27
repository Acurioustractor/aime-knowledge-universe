/**
 * Supabase Database Client
 * 
 * High-performance database operations for AIME Wiki content
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database types
export interface ContentItem {
  id: string;
  source_id: string;
  source: 'youtube' | 'airtable' | 'mailchimp' | 'github';
  content_type: 'video' | 'tool' | 'newsletter' | 'story' | 'research';
  title: string;
  description?: string;
  content?: string;
  url?: string;
  thumbnail_url?: string;
  metadata: Record<string, any>;
  tags: string[];
  categories: string[];
  authors: string[];
  themes: string[];
  view_count: number;
  engagement_score: number;
  is_featured: boolean;
  source_created_at?: string;
  source_updated_at?: string;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  source: string;
  last_sync_at?: string;
  last_successful_sync_at?: string;
  total_records: number;
  new_records: number;
  updated_records: number;
  sync_duration_ms: number;
  error_count: number;
  last_error?: string;
  next_sync_at?: string;
  is_syncing: boolean;
  sync_config: Record<string, any>;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local');
  console.warn('   Run: node setup-supabase.js to configure');
}

export const supabase: SupabaseClient = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

/**
 * Content Repository - High-level database operations
 */
export class ContentRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  /**
   * Get content with filtering, pagination, and search
   */
  async getContent(options: {
    source?: string;
    contentType?: string;
    limit?: number;
    offset?: number;
    search?: string;
    featured?: boolean;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'relevance';
    categories?: string[];
    tags?: string[];
  } = {}): Promise<{ items: ContentItem[]; total: number }> {
    const {
      source,
      contentType,
      limit = 50,
      offset = 0,
      search,
      featured,
      sortBy = 'newest',
      categories,
      tags
    } = options;

    let query = this.client
      .from('content_items')
      .select('*', { count: 'exact' });

    // Apply filters
    if (source) query = query.eq('source', source);
    if (contentType) query = query.eq('content_type', contentType);
    if (featured !== undefined) query = query.eq('is_featured', featured);
    if (categories?.length) query = query.overlaps('categories', categories);
    if (tags?.length) query = query.overlaps('tags', tags);

    // Apply search
    if (search) {
      query = query.textSearch('title,description,content', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('source_created_at', { ascending: false, nullsFirst: false });
        break;
      case 'oldest':
        query = query.order('source_created_at', { ascending: true, nullsFirst: false });
        break;
      case 'popular':
        query = query.order('engagement_score', { ascending: false })
                    .order('view_count', { ascending: false });
        break;
      case 'relevance':
        // For search queries, relevance is handled by textSearch
        if (!search) {
          query = query.order('created_at', { ascending: false });
        }
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching content:', error);
      throw error;
    }

    return {
      items: data || [],
      total: count || 0
    };
  }

  /**
   * Get single content item by ID
   */
  async getContentById(id: string): Promise<ContentItem | null> {
    const { data, error } = await this.client
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching content by ID:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get content by source and source_id
   */
  async getContentBySourceId(source: string, sourceId: string): Promise<ContentItem | null> {
    const { data, error } = await this.client
      .from('content_items')
      .select('*')
      .eq('source', source)
      .eq('source_id', sourceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching content by source ID:', error);
      throw error;
    }

    return data;
  }

  /**
   * Batch upsert content items (for sync operations)
   */
  async upsertContent(items: Partial<ContentItem>[]): Promise<{ success: number; errors: number }> {
    if (items.length === 0) return { success: 0, errors: 0 };

    console.log(`📦 Upserting ${items.length} content items...`);

    try {
      const { data, error } = await this.client
        .from('content_items')
        .upsert(items, {
          onConflict: 'source,source_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Batch upsert error:', error);
        return { success: 0, errors: items.length };
      }

      console.log(`✅ Successfully upserted ${items.length} items`);
      return { success: items.length, errors: 0 };

    } catch (error) {
      console.error('Batch upsert failed:', error);
      return { success: 0, errors: items.length };
    }
  }

  /**
   * Update content engagement metrics
   */
  async updateEngagement(id: string, viewCount?: number, engagementScore?: number): Promise<void> {
    const updates: Partial<ContentItem> = {};
    if (viewCount !== undefined) updates.view_count = viewCount;
    if (engagementScore !== undefined) updates.engagement_score = engagementScore;

    const { error } = await this.client
      .from('content_items')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating engagement:', error);
      throw error;
    }
  }

  /**
   * Get content statistics
   */
  async getStats(): Promise<{
    totalItems: number;
    bySource: Record<string, number>;
    byType: Record<string, number>;
    recentItems: number;
  }> {
    const { data, error } = await this.client
      .from('content_summary')
      .select('*');

    if (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }

    const stats = {
      totalItems: 0,
      bySource: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      recentItems: 0
    };

    data?.forEach(row => {
      stats.totalItems += row.total_items;
      stats.bySource[row.source] = (stats.bySource[row.source] || 0) + row.total_items;
      stats.byType[row.content_type] = (stats.byType[row.content_type] || 0) + row.total_items;
      stats.recentItems += row.new_today || 0;
    });

    return stats;
  }

  /**
   * Search content with full-text search
   */
  async searchContent(query: string, options: {
    limit?: number;
    offset?: number;
    contentType?: string;
    source?: string;
  } = {}): Promise<{ items: ContentItem[]; total: number }> {
    return this.getContent({
      ...options,
      search: query,
      sortBy: 'relevance'
    });
  }

  /**
   * Get related content
   */
  async getRelatedContent(contentId: string, limit: number = 5): Promise<ContentItem[]> {
    const { data, error } = await this.client
      .from('content_relationships')
      .select(`
        related_content_id,
        strength,
        content_items!related_content_id (*)
      `)
      .eq('source_content_id', contentId)
      .order('strength', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related content:', error);
      return [];
    }

    return data?.map(rel => rel.content_items).filter(Boolean) || [];
  }

  /**
   * Record content interaction for analytics
   */
  async recordInteraction(contentId: string, type: string, sessionId?: string, metadata?: Record<string, any>): Promise<void> {
    const { error } = await this.client
      .from('content_interactions')
      .insert({
        content_id: contentId,
        interaction_type: type,
        user_session: sessionId,
        metadata: metadata || {}
      });

    if (error) {
      console.error('Error recording interaction:', error);
      // Don't throw - analytics shouldn't break the app
    }
  }
}

/**
 * Sync Status Repository
 */
export class SyncRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  /**
   * Get sync status for all sources
   */
  async getAllSyncStatus(): Promise<SyncStatus[]> {
    const { data, error } = await this.client
      .from('sync_status')
      .select('*')
      .order('last_sync_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching sync status:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get sync status for specific source
   */
  async getSyncStatus(source: string): Promise<SyncStatus | null> {
    const { data, error } = await this.client
      .from('sync_status')
      .select('*')
      .eq('source', source)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching sync status:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update sync status
   */
  async updateSyncStatus(source: string, updates: Partial<SyncStatus>): Promise<void> {
    const { error } = await this.client
      .from('sync_status')
      .upsert({
        source,
        ...updates,
        last_sync_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating sync status:', error);
      throw error;
    }
  }

  /**
   * Mark sync as started
   */
  async startSync(source: string): Promise<void> {
    await this.updateSyncStatus(source, {
      is_syncing: true,
      error_count: 0,
      last_error: undefined
    });
  }

  /**
   * Mark sync as completed
   */
  async completeSync(source: string, stats: {
    totalRecords: number;
    newRecords: number;
    updatedRecords: number;
    durationMs: number;
  }): Promise<void> {
    await this.updateSyncStatus(source, {
      is_syncing: false,
      last_successful_sync_at: new Date().toISOString(),
      total_records: stats.totalRecords,
      new_records: stats.newRecords,
      updated_records: stats.updatedRecords,
      sync_duration_ms: stats.durationMs,
      next_sync_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
    });
  }

  /**
   * Mark sync as failed
   */
  async failSync(source: string, error: string): Promise<void> {
    const currentStatus = await this.getSyncStatus(source);
    await this.updateSyncStatus(source, {
      is_syncing: false,
      error_count: (currentStatus?.error_count || 0) + 1,
      last_error: error,
      next_sync_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes retry
    });
  }
}

// Singleton instances
export const contentRepository = new ContentRepository();
export const syncRepository = new SyncRepository();