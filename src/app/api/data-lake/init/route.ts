/**
 * Data Lake Initialization API
 * 
 * Initializes the AIME Data Lake with:
 * - Database setup
 * - Initial sync from all sources
 * - Background scheduler startup
 * - Health checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSyncManager } from '@/lib/sync/sync-manager';
import { getContentRepository } from '@/lib/database/connection';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Initializing AIME Data Lake...');
    
    // Initialize database and sync manager
    const repository = await getContentRepository();
    const syncManager = await getSyncManager();
    
    // Get current stats
    const initialStats = await repository.getStats();
    console.log('📊 Initial database stats:', initialStats);
    
    // If database is empty, run initial sync
    if (initialStats.total_items === 0) {
      console.log('🔄 Database empty - running initial sync...');
      
      const syncResults = await syncManager.forceSyncAll();
      const finalStats = await repository.getStats();
      
      return NextResponse.json({
        success: true,
        data: {
          action: 'initialized',
          initial_sync_performed: true,
          sync_results: syncResults,
          initial_stats: initialStats,
          final_stats: finalStats
        },
        meta: {
          processing_time: Date.now() - startTime,
          message: 'Data Lake initialized with initial sync'
        }
      });
    } else {
      // Database has data, just ensure sync manager is running
      const syncStatus = await syncManager.getSyncStatus();
      
      return NextResponse.json({
        success: true,
        data: {
          action: 'verified',
          initial_sync_performed: false,
          current_stats: initialStats,
          sync_status: syncStatus
        },
        meta: {
          processing_time: Date.now() - startTime,
          message: 'Data Lake already initialized'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Data Lake initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Initialization failed',
        code: 'INIT_ERROR'
      },
      meta: {
        processing_time: Date.now() - startTime
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Data Lake status...');
    
    const repository = await getContentRepository();
    const stats = await repository.getStats();
    
    // Check if sync manager is initialized
    let syncStatus;
    try {
      const syncManager = await getSyncManager();
      syncStatus = await syncManager.getSyncStatus();
    } catch (error) {
      syncStatus = { error: 'Sync manager not initialized' };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        database_stats: stats,
        sync_status: syncStatus,
        health: {
          database: stats.total_items > 0 ? 'healthy' : 'empty',
          sync_manager: syncStatus.error ? 'error' : 'healthy'
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Data Lake status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Status check failed',
        code: 'STATUS_ERROR'
      }
    }, { status: 500 });
  }
} 