import { NextRequest, NextResponse } from 'next/server';
import { youtubeContentIntegration } from '@/lib/youtube/youtube-content-integration';
import { youtubeStorage } from '@/lib/youtube/youtube-storage';
import { getYouTubeSyncManager } from '@/lib/youtube/youtube-sync-manager';
import { withValidation, createSuccessResponse, handleApiError } from '@/lib/validation/middleware';
import { withApiKeyFallback } from '@/lib/auth/middleware';
import { youtubeIntegrationRequestSchema, healthCheckQuerySchema } from '@/lib/validation/schemas';
import { redisCache, CacheKeys, CacheTTL } from '@/lib/cache/redis';

/**
 * @swagger
 * /api/youtube/integration:
 *   post:
 *     summary: Manage YouTube integration operations
 *     tags: [YouTube]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [initialize, full-sync, incremental-sync, start-integration, stop-integration, setup-channels, comprehensive-search]
 *               channels:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/YoutubeChannel'
 *               query:
 *                 type: string
 *               searchOptions:
 *                 type: object
 *                 properties:
 *                   limit:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 100
 *                   sortBy:
 *                     type: string
 *                     enum: [relevance, published, views, rating]
 *                   dateFilter:
 *                     type: string
 *                     enum: [hour, today, week, month, year]
 *                   channelId:
 *                     type: string
 *                   hasTranscript:
 *                     type: boolean
 *             required: [action]
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   get:
 *     summary: Get YouTube integration status and information
 *     tags: [YouTube]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [status, health-check, dashboard-data]
 *           default: status
 *     responses:
 *       200:
 *         description: Integration status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const auth = withApiKeyFallback(request);
    if (!auth.isAuthorized) {
      return auth.error!;
    }

    // Validate request body
    const validation = await withValidation(request, {
      bodySchema: youtubeIntegrationRequestSchema
    });
    
    if (validation.error) {
      return validation.error;
    }

    const { action, channels, query, searchOptions } = validation.body!;

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API key not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Check cache for non-destructive operations
    const cacheKey = CacheKeys.youtube.sync(action);
    let cachedResult = null;
    
    if (['status', 'dashboard-data'].includes(action)) {
      cachedResult = await redisCache.get(cacheKey);
      if (cachedResult) {
        return createSuccessResponse(cachedResult, 'Data retrieved from cache');
      }
    }

    switch (action) {
      case 'initialize':
        console.log('🚀 Initializing complete YouTube integration system...');
        
        try {
          const initResult = await youtubeContentIntegration.initializeYouTubeSync(apiKey);
          
          // Cache the result
          await redisCache.set(CacheKeys.youtube.stats(), initResult.stats, { ttl: CacheTTL.MEDIUM });
          
          return createSuccessResponse(initResult.stats, initResult.message);
        } catch (error) {
          console.error('YouTube initialization failed:', error);
          return handleApiError(error);
        }

      case 'full-sync':
        console.log('🔄 Starting full YouTube sync...');
        
        try {
          const syncManager = getYouTubeSyncManager(apiKey);
          await syncManager.initialize();
          
          const fullSyncResult = await syncManager.performFullSync();
          
          // Also sync to content storage
          const contentSyncResult = await youtubeContentIntegration.syncYouTubeContent();
          
          const result = {
            youtubeSync: fullSyncResult,
            contentSync: contentSyncResult,
            totalVideos: youtubeStorage.getStats().totalVideos
          };
          
          // Clear cache after sync
          await redisCache.clear('youtube:*');
          
          return createSuccessResponse(
            result,
            `Full sync completed: ${fullSyncResult.videosAdded} videos added, ${fullSyncResult.videosUpdated} updated`
          );
        } catch (error) {
          console.error('Full sync failed:', error);
          return handleApiError(error);
        }

      case 'incremental-sync':
        console.log('🔄 Starting incremental YouTube sync...');
        
        try {
          const incrementalSyncManager = getYouTubeSyncManager(apiKey);
          await incrementalSyncManager.initialize();
          
          const incrementalResult = await incrementalSyncManager.performIncrementalSync();
          const incrementalContentResult = await youtubeContentIntegration.syncYouTubeContent();
          
          const result = {
            youtubeSync: incrementalResult,
            contentSync: incrementalContentResult
          };
          
          // Clear relevant cache entries
          await redisCache.del(CacheKeys.youtube.stats());
          await redisCache.clear('youtube:search:*');
          
          return createSuccessResponse(
            result,
            `Incremental sync completed: ${incrementalResult.videosAdded} new videos, ${incrementalResult.videosUpdated} updated`
          );
        } catch (error) {
          console.error('Incremental sync failed:', error);
          return handleApiError(error);
        }

      case 'start-integration':
        try {
          youtubeContentIntegration.start();
          
          const stats = youtubeContentIntegration.getIntegrationStats();
          
          return createSuccessResponse(
            {
              status: 'running',
              stats
            },
            'YouTube content integration started'
          );
        } catch (error) {
          console.error('Failed to start integration:', error);
          return handleApiError(error);
        }

      case 'stop-integration':
        try {
          youtubeContentIntegration.stop();
          
          return createSuccessResponse(
            { status: 'stopped' },
            'YouTube content integration stopped'
          );
        } catch (error) {
          console.error('Failed to stop integration:', error);
          return handleApiError(error);
        }

      case 'setup-channels':
        if (!channels || !Array.isArray(channels)) {
          return NextResponse.json({
            success: false,
            error: 'Channels array required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }

        try {
          const channelResults = [];
          for (const channelData of channels) {
            try {
              youtubeStorage.addChannel(channelData as any);
              channelResults.push({
                channelId: channelData.channelId,
                channelName: channelData.channelName,
                success: true
              });
            } catch (error) {
              console.error(`Failed to add channel ${channelData.channelId}:`, error);
              channelResults.push({
                channelId: channelData.channelId,
                channelName: channelData.channelName,
                success: false,
                error: error instanceof Error ? error.message : String(error)
              });
            }
          }

          // Clear channel cache
          await redisCache.clear('youtube:channel:*');
          
          const successCount = channelResults.filter(r => r.success).length;
          
          return createSuccessResponse(
            {
              channels: channelResults,
              totalChannels: youtubeStorage.getChannels().length
            },
            `${successCount} channels added successfully`
          );
        } catch (error) {
          console.error('Channel setup failed:', error);
          return handleApiError(error);
        }

      case 'comprehensive-search':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Search query required',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }

        try {
          // Check cache first
          const searchCacheKey = CacheKeys.youtube.search(query, searchOptions || {});
          const cachedSearchResults = await redisCache.get(searchCacheKey);
          
          if (cachedSearchResults) {
            return createSuccessResponse(
              cachedSearchResults,
              `Found ${(cachedSearchResults as any)?.total || 0} cached videos matching "${query}"`
            );
          }

          const searchResults = youtubeContentIntegration.searchYouTubeContent(query, searchOptions as any || {});
          
          // Cache search results
          await redisCache.set(searchCacheKey, searchResults, { ttl: CacheTTL.SEARCH_RESULTS });
          
          return createSuccessResponse(
            searchResults,
            `Found ${searchResults.total} videos matching "${query}"`
          );
        } catch (error) {
          console.error('Search failed:', error);
          return handleApiError(error);
        }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube integration API error:', error);
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const auth = withApiKeyFallback(request);
    if (!auth.isAuthorized) {
      return auth.error!;
    }

    // Validate query parameters
    const validation = await withValidation(request, {
      querySchema: healthCheckQuerySchema
    });
    
    if (validation.error) {
      return validation.error;
    }

    const { action } = validation.query!;

    // Check cache for status requests
    const cacheKey = CacheKeys.youtube.stats();
    const cachedStatus = await redisCache.get(cacheKey);
    
    if (cachedStatus && action === 'status') {
      return createSuccessResponse(cachedStatus, 'Status retrieved from cache');
    }

    switch (action) {
      case 'status':
        try {
          const integrationStats = youtubeContentIntegration.getIntegrationStats();
          const youtubeStats = youtubeStorage.getStats();
          
          const apiKey = process.env.YOUTUBE_API_KEY;
          let syncStats = null;
          
          try {
            if (apiKey) {
              const syncManager = getYouTubeSyncManager(apiKey);
              syncStats = syncManager.getSyncStats();
            }
          } catch (error) {
            console.log('⚠️ Sync manager not initialized yet');
          }

          const statusData = {
            integration: integrationStats,
            youtube: youtubeStats,
            sync: syncStats,
            apiConfigured: !!apiKey,
            systemHealth: {
              youtubeAPIConnected: !!apiKey,
              storageWorking: true,
              integrationActive: integrationStats.isRunning,
              lastActivity: youtubeStats.lastSync
            }
          };
          
          // Cache the status for a short time
          await redisCache.set(cacheKey, statusData, { ttl: CacheTTL.SHORT });

          return createSuccessResponse(statusData);
        } catch (error) {
          console.error('Status check failed:', error);
          return handleApiError(error);
        }

      case 'health-check':
        try {
          const healthApiKey = process.env.YOUTUBE_API_KEY;
          let apiHealthy = false;
          let apiError = null;

          if (healthApiKey) {
            try {
              const syncManager = getYouTubeSyncManager(healthApiKey);
              await syncManager.initialize();
              apiHealthy = true;
            } catch (error) {
              apiError = error instanceof Error ? error.message : String(error);
              console.error('Health check API error:', error);
            }
          }

          const health = {
            overall: apiHealthy && !!healthApiKey,
            components: {
              apiKey: !!healthApiKey,
              apiConnection: apiHealthy,
              storage: true,
              integration: youtubeContentIntegration.getIntegrationStats().isRunning,
              cache: redisCache.isConnected()
            },
            errors: apiError ? [apiError] : [],
            lastChecked: new Date().toISOString()
          };

          return createSuccessResponse(health);
        } catch (error) {
          console.error('Health check failed:', error);
          return handleApiError(error);
        }

      case 'dashboard-data':
        try {
          // Check cache first
          const dashboardCacheKey = 'youtube:dashboard';
          const cachedDashboard = await redisCache.get(dashboardCacheKey);
          
          if (cachedDashboard) {
            return createSuccessResponse(cachedDashboard, 'Dashboard data retrieved from cache');
          }

          const dashboardStats = youtubeStorage.getStats();
          const integration = youtubeContentIntegration.getIntegrationStats();
          
          // Get recent activity
          const recentVideos = youtubeStorage.getVideos({ 
            limit: 10, 
            sortBy: 'published' 
          }).videos;
          
          // Get top channels
          const topChannels = dashboardStats.channelStats
            .sort((a, b) => b.videoCount - a.videoCount)
            .slice(0, 5);

          const dashboardData = {
            overview: {
              totalVideos: dashboardStats.totalVideos,
              totalChannels: dashboardStats.totalChannels,
              videosWithTranscription: dashboardStats.videosWithTranscription,
              storageSize: dashboardStats.storageSize,
              lastSync: dashboardStats.lastSync
            },
            activity: {
              recentVideos: recentVideos.slice(0, 5),
              syncJobs: dashboardStats.syncJobs,
              integrationStatus: integration.isRunning ? 'active' : 'inactive'
            },
            channels: topChannels,
            performance: {
              avgSearchTime: 150, // placeholder
              apiCallsToday: 0, // placeholder
              errorRate: 0 // placeholder
            }
          };
          
          // Cache dashboard data
          await redisCache.set(dashboardCacheKey, dashboardData, { ttl: CacheTTL.MEDIUM });

          return createSuccessResponse(dashboardData);
        } catch (error) {
          console.error('Dashboard data retrieval failed:', error);
          return handleApiError(error);
        }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ YouTube integration GET API error:', error);
    return handleApiError(error);
  }
}