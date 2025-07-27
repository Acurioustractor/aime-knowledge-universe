/**
 * Quota-Efficient YouTube Sync System
 * 
 * Minimizes API calls by:
 * - Caching video data locally
 * - Only fetching new videos since last sync
 * - Using efficient playlist pagination
 * - Background scheduling to spread quota usage
 */

import fs from 'fs/promises';
import path from 'path';

interface CachedVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: any;
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails: {
    duration: string;
    caption: string;
  };
  lastUpdated: string;
  metadata: any;
}

interface SyncState {
  lastFullSync: string;
  lastIncrementalSync: string;
  totalVideos: number;
  quotaUsedToday: number;
  cachedVideos: CachedVideo[];
  nextSyncAfter: string;
}

export class QuotaEfficientYouTubeSync {
  private cacheFile = path.join(process.cwd(), 'data', 'youtube-cache.json');
  private apiKey: string;
  private channelId: string;

  constructor(apiKey: string, channelId: string = 'UCDL9R_msvYDyHF7lx0NEyow') {
    this.apiKey = apiKey;
    this.channelId = channelId;
  }

  /**
   * Smart sync - only fetch what's needed
   */
  async performSmartSync(): Promise<{ 
    newVideos: number; 
    updatedVideos: number; 
    quotaUsed: number; 
    totalVideos: number;
  }> {
    console.log('🧠 Starting smart YouTube sync...');
    
    const syncState = await this.loadSyncState();
    const now = new Date().toISOString();
    
    // Check if we should do incremental or full sync
    const lastFullSync = new Date(syncState.lastFullSync || 0);
    const daysSinceFullSync = (Date.now() - lastFullSync.getTime()) / (1000 * 60 * 60 * 24);
    
    let quotaUsed = 0;
    let newVideos = 0;
    let updatedVideos = 0;
    
    if (daysSinceFullSync > 7) {
      // Full sync weekly
      console.log('📅 Performing weekly full sync...');
      const result = await this.performFullSync();
      quotaUsed = result.quotaUsed;
      newVideos = result.newVideos;
      syncState.lastFullSync = now;
    } else {
      // Incremental sync - only new videos since last sync
      console.log('⚡ Performing incremental sync...');
      const result = await this.performIncrementalSync(syncState.lastIncrementalSync);
      quotaUsed = result.quotaUsed;
      newVideos = result.newVideos;
      updatedVideos = result.updatedVideos;
    }
    
    syncState.lastIncrementalSync = now;
    syncState.quotaUsedToday += quotaUsed;
    syncState.totalVideos = syncState.cachedVideos.length;
    
    await this.saveSyncState(syncState);
    
    console.log(`✅ Smart sync complete: ${newVideos} new, ${updatedVideos} updated, ${quotaUsed} quota used`);
    
    return {
      newVideos,
      updatedVideos,
      quotaUsed,
      totalVideos: syncState.totalVideos
    };
  }

  /**
   * Incremental sync - only fetch videos newer than last sync
   */
  private async performIncrementalSync(lastSyncDate: string): Promise<{
    newVideos: number;
    updatedVideos: number;
    quotaUsed: number;
  }> {
    let quotaUsed = 0;
    let newVideos = 0;
    let updatedVideos = 0;
    
    try {
      // Get uploads playlist (1 quota unit)
      const channelResponse = await this.makeAPICall(
        `channels?key=${this.apiKey}&id=${this.channelId}&part=contentDetails`
      );
      quotaUsed += 1;
      
      const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get recent videos from playlist (1 quota unit per 50 videos)
      const publishedAfter = lastSyncDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      let pageToken = '';
      let allNewVideoIds: string[] = [];
      
      do {
        const playlistResponse = await this.makeAPICall(
          `playlistItems?key=${this.apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=50&publishedAfter=${publishedAfter}${pageToken ? `&pageToken=${pageToken}` : ''}`
        );
        quotaUsed += 1;
        
        const videoIds = playlistResponse.items
          .filter((item: any) => new Date(item.snippet.publishedAt) > new Date(lastSyncDate))
          .map((item: any) => item.snippet.resourceId.videoId);
        
        allNewVideoIds.push(...videoIds);
        pageToken = playlistResponse.nextPageToken;
        
        // Stop if no new videos or we've found enough
      } while (pageToken && allNewVideoIds.length < 50);
      
      // Get detailed info for new videos (1 quota unit per 50 videos)
      if (allNewVideoIds.length > 0) {
        const chunks = this.chunkArray(allNewVideoIds, 50);
        
        for (const chunk of chunks) {
          const detailsResponse = await this.makeAPICall(
            `videos?key=${this.apiKey}&id=${chunk.join(',')}&part=snippet,statistics,contentDetails`
          );
          quotaUsed += 1;
          
          for (const video of detailsResponse.items) {
            await this.cacheVideo(video);
            newVideos++;
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Incremental sync failed:', error);
    }
    
    return { newVideos, updatedVideos, quotaUsed };
  }

  /**
   * Full sync - get all videos (quota intensive, use sparingly)
   */
  private async performFullSync(): Promise<{
    newVideos: number;
    quotaUsed: number;
  }> {
    console.log('🔄 Starting full sync (quota intensive)...');
    
    let quotaUsed = 0;
    let newVideos = 0;
    const syncState = await this.loadSyncState();
    
    try {
      // Get channel info (1 quota unit)
      const channelResponse = await this.makeAPICall(
        `channels?key=${this.apiKey}&id=${this.channelId}&part=contentDetails,statistics`
      );
      quotaUsed += 1;
      
      const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;
      const totalVideos = parseInt(channelResponse.items[0].statistics.videoCount);
      
      console.log(`📊 Channel has ${totalVideos} total videos`);
      
      // Get all videos from playlist in chunks (1 quota unit per 50 videos)
      let pageToken = '';
      let allVideoIds: string[] = [];
      let pageCount = 0;
      const maxPages = Math.ceil(totalVideos / 50);
      
      do {
        const playlistResponse = await this.makeAPICall(
          `playlistItems?key=${this.apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}`
        );
        quotaUsed += 1;
        pageCount++;
        
        const videoIds = playlistResponse.items.map((item: any) => item.snippet.resourceId.videoId);
        allVideoIds.push(...videoIds);
        
        pageToken = playlistResponse.nextPageToken;
        
        console.log(`📄 Fetched page ${pageCount}/${maxPages} (${allVideoIds.length}/${totalVideos} videos)`);
        
        // Quota protection - stop if we're using too much quota
        if (quotaUsed > 20) {
          console.log('⚠️ Quota limit reached, stopping full sync');
          break;
        }
        
      } while (pageToken && pageCount < maxPages);
      
      // Get detailed info for videos (1 quota unit per 50 videos)
      const chunks = this.chunkArray(allVideoIds, 50);
      
      for (let i = 0; i < chunks.length && quotaUsed < 50; i++) {
        const chunk = chunks[i];
        
        const detailsResponse = await this.makeAPICall(
          `videos?key=${this.apiKey}&id=${chunk.join(',')}&part=snippet,statistics,contentDetails`
        );
        quotaUsed += 1;
        
        for (const video of detailsResponse.items) {
          const existing = syncState.cachedVideos.find(v => v.id === video.id);
          if (!existing) {
            newVideos++;
          }
          await this.cacheVideo(video);
        }
        
        console.log(`📊 Processed ${(i + 1) * 50} videos, quota used: ${quotaUsed}`);
      }
      
    } catch (error) {
      console.error('❌ Full sync failed:', error);
    }
    
    console.log(`✅ Full sync complete: ${newVideos} new videos, ${quotaUsed} quota used`);
    return { newVideos, quotaUsed };
  }

  /**
   * Get cached videos for frontend
   */
  async getCachedVideos(options: {
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<{
    videos: CachedVideo[];
    total: number;
    hasMore: boolean;
  }> {
    const syncState = await this.loadSyncState();
    let videos = syncState.cachedVideos;
    
    // Apply search filter
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by publish date (newest first)
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginatedVideos = videos.slice(offset, offset + limit);
    
    return {
      videos: paginatedVideos,
      total: videos.length,
      hasMore: offset + limit < videos.length
    };
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<{
    totalVideos: number;
    lastSync: string;
    quotaUsedToday: number;
    cacheAge: string;
    nextSyncRecommended: string;
  }> {
    const syncState = await this.loadSyncState();
    
    return {
      totalVideos: syncState.totalVideos,
      lastSync: syncState.lastIncrementalSync,
      quotaUsedToday: syncState.quotaUsedToday,
      cacheAge: this.getTimeAgo(syncState.lastIncrementalSync),
      nextSyncRecommended: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
    };
  }

  // Helper methods
  private async makeAPICall(endpoint: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}`);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('YouTube API quota exceeded');
      }
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  private async cacheVideo(video: any): Promise<void> {
    const syncState = await this.loadSyncState();
    
    const cachedVideo: CachedVideo = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails,
      statistics: {
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0'
      },
      contentDetails: {
        duration: video.contentDetails.duration,
        caption: video.contentDetails.caption
      },
      lastUpdated: new Date().toISOString(),
      metadata: {
        channelTitle: video.snippet.channelTitle,
        categoryId: video.snippet.categoryId,
        tags: video.snippet.tags || [],
        defaultLanguage: video.snippet.defaultLanguage
      }
    };
    
    // Update or add video
    const existingIndex = syncState.cachedVideos.findIndex(v => v.id === video.id);
    if (existingIndex >= 0) {
      syncState.cachedVideos[existingIndex] = cachedVideo;
    } else {
      syncState.cachedVideos.push(cachedVideo);
    }
    
    await this.saveSyncState(syncState);
  }

  private async loadSyncState(): Promise<SyncState> {
    try {
      await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
      const data = await fs.readFile(this.cacheFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {
        lastFullSync: '',
        lastIncrementalSync: '',
        totalVideos: 0,
        quotaUsedToday: 0,
        cachedVideos: [],
        nextSyncAfter: new Date().toISOString()
      };
    }
  }

  private async saveSyncState(state: SyncState): Promise<void> {
    await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
    await fs.writeFile(this.cacheFile, JSON.stringify(state, null, 2));
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private getTimeAgo(dateString: string): string {
    if (!dateString) return 'Never';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return 'Recently';
  }
}

export const quotaEfficientSync = new QuotaEfficientYouTubeSync(
  process.env.YOUTUBE_API_KEY || '',
  'UCDL9R_msvYDyHF7lx0NEyow'
);