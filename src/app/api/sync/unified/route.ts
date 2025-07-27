/**
 * Unified Content Sync API
 * 
 * Endpoint for syncing all content sources (videos, newsletters, tools, documents)
 * with progress tracking and comprehensive statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedSyncService } from '@/lib/services/unified-sync';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      includeVideos = true,
      includeNewsletters = true,
      includeTools = true,
      includeDocuments = true
    } = body;

    console.log('🚀 Unified sync API called with options:', {
      includeVideos,
      includeNewsletters,
      includeTools,
      includeDocuments
    });

    const syncService = getUnifiedSyncService();
    
    // Check if sync is already running
    const status = syncService.getSyncStatus();
    if (status.isRunning) {
      return NextResponse.json({
        success: false,
        error: 'Sync already in progress',
        status: status
      }, { status: 409 });
    }
    
    // Start unified sync
    const result = await syncService.syncAllContent({
      includeVideos,
      includeNewsletters,
      includeTools,
      includeDocuments
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${result.totalSynced} items across ${result.results.length} sources`,
        totalSynced: result.totalSynced,
        results: result.results,
        summary: {
          sources: result.results.length,
          successful: result.results.filter(r => r.success).length,
          failed: result.results.filter(r => !r.success).length,
          totalDuration: result.results.reduce((sum, r) => sum + r.duration, 0)
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Some sync operations failed',
        results: result.results,
        totalSynced: result.totalSynced
      }, { status: 207 }); // Multi-Status
    }
  } catch (error) {
    console.error('🚀 Unified sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unified sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('stats') === 'true';

    console.log('🚀 Unified sync status requested');
    
    const syncService = getUnifiedSyncService();
    const status = syncService.getSyncStatus();
    
    let response: any = {
      success: true,
      status: status
    };

    if (includeStats) {
      const stats = await syncService.getDatabaseStats();
      response.stats = stats;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('🚀 Unified sync status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}