/**
 * Newsletter Sync API Route
 * 
 * Dedicated endpoint for syncing Mailchimp campaigns
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMailchimpSyncService } from '@/lib/services/mailchimp-sync';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Newsletter sync API called');
    
    const syncService = getMailchimpSyncService();
    
    // Check if sync is already running
    const status = await syncService.getSyncStatus();
    if (status.isRunning) {
      return NextResponse.json({
        success: false,
        error: 'Sync already in progress',
        status: status
      }, { status: 409 });
    }
    
    // Start sync
    const result = await syncService.syncAllCampaigns();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${result.synced} newsletters`,
        synced: result.synced
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Sync failed',
        message: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('📧 Newsletter sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Newsletter sync status requested');
    
    const syncService = getMailchimpSyncService();
    const status = await syncService.getSyncStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('📧 Newsletter sync status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}