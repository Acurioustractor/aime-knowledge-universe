/**
 * Sync API - Manual sync trigger
 * 
 * Allows manual triggering of content sync from external APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/sync/sync-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { source, force = false } = body;

    console.log('🔄 Manual sync triggered:', { source, force });

    let results;

    if (source) {
      // Sync specific source
      switch (source) {
        case 'youtube':
          results = [await syncService.syncYouTube()];
          break;
        case 'airtable':
          results = [await syncService.syncAirtable()];
          break;
        case 'mailchimp':
          results = [await syncService.syncMailchimp()];
          break;
        case 'github':
          results = [await syncService.syncGitHub()];
          break;
        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid source',
            validSources: ['youtube', 'airtable', 'mailchimp', 'github']
          }, { status: 400 });
      }
    } else {
      // Sync all sources
      results = await syncService.syncAll();
    }

    const successCount = results.filter(r => r.success).length;
    const totalRecords = results.reduce((sum, r) => sum + r.totalRecords, 0);
    const newRecords = results.reduce((sum, r) => sum + r.newRecords, 0);
    const updatedRecords = results.reduce((sum, r) => sum + r.updatedRecords, 0);

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        sourcesProcessed: results.length,
        sourcesSuccessful: successCount,
        totalRecords,
        newRecords,
        updatedRecords
      }
    });

  } catch (error) {
    console.error('Sync API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching sync status...');
    
    const status = await syncService.getSyncStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Sync status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sync status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}