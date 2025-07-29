/**
 * Integrations Index - Unified content fetching from all sources
 * 
 * This module provides a unified interface for fetching content from:
 * - Airtable (tools and resources)
 * - GitHub (documentation and repositories)
 * - YouTube (videos and channels)  
 * - Mailchimp (newsletters and campaigns)
 * - Hoodie Stock Exchange (hoodie data)
 */

// ========================================
// TYPES AND INTERFACES
// ========================================

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  source: string;
  url?: string;
  thumbnail?: string;
  date?: string;
  tags?: string[];
  categories?: string[];
  metadata?: Record<string, any>;
  score?: number;
  reasons?: string;
  content?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FetchOptions {
  limit?: number;
  source?: string;
  type?: string;
  search?: string;
  category?: string;
  tags?: string[];
  includeContent?: boolean;
  forceRefresh?: boolean;
}

// ========================================
// UNIFIED CONTENT FETCHER
// ========================================

/**
 * Fetches content from all integrated sources
 * Returns normalized ContentItem array
 */
export async function getAllContent(options: FetchOptions = {}): Promise<ContentItem[]> {
  try {
    const allContent: ContentItem[] = [];
    const { limit = 100, source } = options;

    // If specific source requested, only fetch from that source
    if (source) {
      switch (source.toLowerCase()) {
        case 'airtable':
          const airtableContent = await fetchAirtableContent(options);
          return airtableContent.slice(0, limit);
        case 'github':
          const githubContent = await fetchGitHubContent(options);
          return githubContent.slice(0, limit);
        case 'youtube':
          const youtubeContent = await fetchYouTubeContent(options);
          return youtubeContent.slice(0, limit);
        case 'mailchimp':
          const mailchimpContent = await fetchMailchimpContent(options);
          return mailchimpContent.slice(0, limit);
        case 'hoodies':
          const hoodieContent = await fetchHoodieContent(options);
          return hoodieContent.slice(0, limit);
        default:
          console.warn(`Unknown source: ${source}`);
          return [];
      }
    }

    // Fetch from all sources in parallel
    const fetchPromises = [
      fetchAirtableContent(options).catch(err => {
        console.warn('Airtable fetch failed:', err.message);
        return [];
      }),
      fetchGitHubContent(options).catch(err => {
        console.warn('GitHub fetch failed:', err.message);
        return [];
      }),
      fetchYouTubeContent(options).catch(err => {
        console.warn('YouTube fetch failed:', err.message);
        return [];
      }),
      fetchMailchimpContent(options).catch(err => {
        console.warn('Mailchimp fetch failed:', err.message);
        return [];
      }),
      fetchHoodieContent(options).catch(err => {
        console.warn('Hoodie content fetch failed:', err.message);
        return [];
      })
    ];

    const results = await Promise.allSettled(fetchPromises);
    
    // Combine all successful results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allContent.push(...result.value);
      } else {
        const sources = ['Airtable', 'GitHub', 'YouTube', 'Mailchimp', 'Hoodies'];
        console.warn(`${sources[index]} integration failed:`, result.reason);
      }
    });

    // Sort by date (newest first) and apply limit
    const sortedContent = allContent
      .sort((a, b) => {
        const dateA = new Date(a.date || a.created_at || 0).getTime();
        const dateB = new Date(b.date || b.created_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    console.log(`Successfully fetched ${sortedContent.length} items from all sources`);
    return sortedContent;

  } catch (error) {
    console.error('Error in getAllContent:', error);
    throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ========================================
// INDIVIDUAL SOURCE FETCHERS  
// ========================================

/**
 * Fetch content from Airtable
 */
async function fetchAirtableContent(options: FetchOptions): Promise<ContentItem[]> {
  try {
    // Use database repository instead of direct API call for reliability
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    
    const { tools } = await repo.getTools({
      limit: options.limit || 50,
      search: options.search,
      category: options.category
    });

    return tools.map((tool: any) => ({
      id: tool.id,
      title: tool.title || 'Untitled Tool',
      description: tool.description || '',
      type: 'tool',
      source: 'airtable',
      url: tool.url || tool.download_url,
      thumbnail: tool.thumbnail_url,
      date: tool.created_at,
      tags: tool.tags ? JSON.parse(tool.tags) : [],
      categories: tool.category ? [tool.category] : [],
      metadata: {
        tool_type: tool.tool_type,
        file_size: tool.file_size,
        usage_restrictions: tool.usage_restrictions,
        attachments: tool.attachments ? JSON.parse(tool.attachments) : []
      }
    }));
  } catch (error) {
    console.warn('Airtable content fetch fallback failed:', error);
    return [];
  }
}

/**
 * Fetch content from GitHub repositories
 */
async function fetchGitHubContent(options: FetchOptions): Promise<ContentItem[]> {
  try {
    // For now, return empty array - GitHub integration needs proper setup
    console.log('GitHub content fetching not yet implemented');
    return [];
  } catch (error) {
    console.warn('GitHub content fetch failed:', error);
    return [];
  }
}

/**
 * Fetch content from YouTube
 */
async function fetchYouTubeContent(options: FetchOptions): Promise<ContentItem[]> {
  try {
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    
    const { videos } = await repo.getVideos({
      limit: options.limit || 20,
      search: options.search
    });

    return videos.map((video: any) => ({
      id: video.id,
      title: video.title || 'Untitled Video',
      description: video.description || '',
      type: 'video',
      source: 'youtube',
      url: video.url,
      thumbnail: video.thumbnail_url,
      date: video.published_at,
      tags: video.tags ? JSON.parse(video.tags) : [],
      categories: [video.channel_title || 'YouTube'],
      metadata: {
        video_id: video.video_id,
        channel_id: video.channel_id,
        channel_title: video.channel_title,
        duration: video.duration,
        view_count: video.view_count,
        like_count: video.like_count
      }
    }));
  } catch (error) {
    console.warn('YouTube content fetch failed:', error);
    return [];
  }
}

/**
 * Fetch content from Mailchimp
 */
async function fetchMailchimpContent(options: FetchOptions): Promise<ContentItem[]> {
  try {
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    
    const { newsletters } = await repo.getNewsletters({
      limit: options.limit || 20,
      search: options.search
    });

    return newsletters.map((newsletter: any) => ({
      id: newsletter.id,
      title: newsletter.subject_line || 'Untitled Newsletter',
      description: newsletter.preview_text || '',
      type: 'newsletter',
      source: 'mailchimp',
      url: newsletter.archive_url,
      date: newsletter.send_time,
      tags: newsletter.tags ? JSON.parse(newsletter.tags) : [],
      categories: ['Newsletter'],
      metadata: {
        campaign_id: newsletter.campaign_id,
        opens: newsletter.opens,
        clicks: newsletter.clicks,
        open_rate: newsletter.open_rate,
        click_rate: newsletter.click_rate
      }
    }));
  } catch (error) {
    console.warn('Mailchimp content fetch failed:', error);
    return [];
  }
}

/**
 * Fetch hoodie content
 */
async function fetchHoodieContent(options: FetchOptions): Promise<ContentItem[]> {
  try {
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    
    const { hoodies } = await repo.getHoodies({
      limit: options.limit || 20,
      search: options.search
    });

    return hoodies.map((hoodie: any) => ({
      id: hoodie.id,
      title: hoodie.name || 'Untitled Hoodie',
      description: hoodie.description || '',
      type: 'hoodie',
      source: 'hoodies',
      date: hoodie.created_at,
      tags: [hoodie.category, hoodie.rarity_level].filter(Boolean),
      categories: [hoodie.category || 'Hoodie'],
      metadata: {
        category: hoodie.category,
        subcategory: hoodie.subcategory,
        rarity_level: hoodie.rarity_level,
        base_impact_value: hoodie.base_impact_value,
        current_holders: hoodie.active_holders,
        total_impact: hoodie.total_impact,
        is_tradeable: hoodie.is_tradeable
      }
    }));
  } catch (error) {
    console.warn('Hoodie content fetch failed:', error);
    return [];
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get content statistics from all sources
 */
export async function getContentStats(): Promise<Record<string, any>> {
  try {
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    return await repo.getStats();
  } catch (error) {
    console.error('Failed to get content stats:', error);
    return {};
  }
}

/**
 * Search content across all sources
 */
export async function searchAllContent(query: string, options: FetchOptions = {}): Promise<ContentItem[]> {
  try {
    const { getContentRepository } = await import('@/lib/database/connection');
    const repo = await getContentRepository();
    
    const { results } = await repo.searchContent(query, {
      limit: options.limit || 50,
      contentType: options.type
    });

    return results.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.content_type,
      source: item.source,
      url: item.url,
      thumbnail: item.thumbnail_url,
      date: item.created_at,
      tags: item.tags ? JSON.parse(item.tags) : [],
      categories: item.category ? [item.category] : []
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// ========================================
// LEGACY EXPORTS (for backward compatibility)
// ========================================

// Re-export individual integration functions if they exist
export { fetchAirtableResources } from './airtable';
export { fetchGitHubResources } from './github';
export { fetchYouTubeVideos } from './youtube';
export { fetchMailchimpCampaigns } from './mailchimp';
export { fetchHoodieStockExchangeData } from './hoodie-stock-exchange-data';