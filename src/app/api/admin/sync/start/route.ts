import { syncScheduler } from '@/lib/sync/scheduler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('⚠️ OLD SYNC SCHEDULER DISABLED - Using new DataLakeSyncManager instead');
    
    // DISABLED TO PREVENT CONFLICTS WITH NEW DATA LAKE SYSTEM
    // syncScheduler.start();
    
    // const jobs = syncScheduler.getAllJobs();

    return NextResponse.json({
      success: true,
      message: 'Old sync scheduler disabled - using new DataLakeSyncManager',
      // jobs: jobs.map(job => ({
      //   id: job.id,
      //   name: job.name,
      //   source: job.source,
      //   enabled: job.enabled,
      //   status: job.status,
      //   lastRun: job.lastRun,
      //   nextRun: job.nextRun
      // }))
    });
  } catch (error) {
    console.error('❌ Sync start failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Sync scheduler disabled'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Getting sync status from new DataLakeSyncManager...');
    
    // DISABLED OLD SCHEDULER
    // const jobs = syncScheduler.getAllJobs();

    return NextResponse.json({
      success: true,
      message: 'Using new DataLakeSyncManager - old scheduler disabled',
      // jobs: jobs.map(job => ({
      //   id: job.id,
      //   name: job.name,
      //   source: job.source,
      //   enabled: job.enabled,
      //   status: job.status,
      //   lastRun: job.lastRun,
      //   nextRun: job.nextRun,
      //   retryCount: job.retryCount,
      //   maxRetries: job.maxRetries
      // }))
    });
  } catch (error) {
    console.error('❌ Getting sync status failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status'
    }, { status: 500 });
  }
}