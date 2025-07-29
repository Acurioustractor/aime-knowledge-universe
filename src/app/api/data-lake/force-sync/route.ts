/**
 * Force Sync API - Manually trigger aggressive sync
 * 
 * Forces a fresh sync of all 500+ tools from Airtable
 * Bypasses normal sync intervals
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSyncManager } from '@/lib/sync/sync-manager';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔥 💪 FORCE SYNC: Starting aggressive 500-tool sync...');
    
    // Initialize sync manager
    const syncManager = await getSyncManager();
    
    // Force sync Airtable specifically
    console.log('🔥 🚀 FORCE SYNC: Triggering Airtable sync...');
    const airtableResult = await syncManager.forceSyncSource('airtable');
    
    // Get updated stats
    const stats = await syncManager.getStats();
    
    const processingTime = Date.now() - startTime;
    
    console.log(`🔥 ✅ FORCE SYNC COMPLETE: ${airtableResult.totalSynced} tools synced in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: {
        force_sync_completed: true,
        airtable_sync_result: airtableResult,
        updated_stats: stats,
        tools_in_database: stats.source_breakdown?.airtable || 0
      },
      meta: {
        processing_time: processingTime,
        message: `Force sync completed: ${airtableResult.totalSynced} tools`
      }
    });
    
  } catch (error) {
    console.error('❌ Force sync failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Force sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 