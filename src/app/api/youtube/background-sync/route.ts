import { NextRequest, NextResponse } from 'next/server';
import { quotaEfficientSync } from '@/lib/youtube/quota-efficient-sync';

/**
 * Background YouTube Sync API
 * 
 * Designed to be called by:
 * - Cron jobs (every 6 hours)
 * - Vercel cron functions
 * - GitHub Actions
 * - Manual triggers
 */

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const syncType = searchParams.get('type') || 'smart';
    const force = searchParams.get('force') === 'true';

    console.log(`🔄 Starting background YouTube sync (${syncType})...`);

    // Check if we should skip due to quota limits
    const stats = await quotaEfficientSync.getSyncStats();
    
    if (!force && stats.quotaUsedToday > 80) {
      return NextResponse.json({
        success: false,
        message: 'Quota limit reached for today',
        data: {
          quotaUsedToday: stats.quotaUsedToday,
          nextSyncAfter: 'Tomorrow at midnight PT'
        }
      });
    }

    let result;
    
    switch (syncType) {
      case 'smart':
        result = await quotaEfficientSync.performSmartSync();
        break;
      
      case 'incremental':
        // Only new videos since last sync
        result = await quotaEfficientSync.performSmartSync();
        break;
      
      default:
        throw new Error(`Unknown sync type: ${syncType}`);
    }

    console.log(`✅ Background sync complete:`, result);

    return NextResponse.json({
      success: true,
      data: {
        syncType,
        ...result,
        timestamp: new Date().toISOString()
      },
      message: `Background sync complete: ${result.newVideos} new videos`
    });

  } catch (error) {
    console.error('❌ Background sync failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Background sync failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await quotaEfficientSync.getSyncStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get sync stats'
    }, { status: 500 });
  }
}