/**
 * Newsletter API Route - Database First
 * 
 * Provides endpoints for fetching newsletters from local database
 * with sync capabilities for Mailchimp data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentRepository } from '@/lib/database/connection';
import { getMailchimpSyncService } from '@/lib/services/mailchimp-sync';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') || 'sent';
    const type = searchParams.get('type') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const stats = searchParams.get('stats') === 'true';
    const sync = searchParams.get('sync') === 'true';

    console.log(`📧 Newsletter API called with: sync=${sync}, limit=${limit}, query=${query}`);

    const repository = await getContentRepository();

    // Handle sync request
    if (sync) {
      try {
        console.log('📧 Starting Mailchimp sync...');
        const syncService = getMailchimpSyncService();
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
        console.error('📧 Sync error:', error);
        return NextResponse.json({
          success: false,
          error: 'Sync failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Handle stats request
    if (stats) {
      try {
        const syncService = getMailchimpSyncService();
        const syncStatus = await syncService.getSyncStatus();
        const dbStats = await repository.getStats();
        
        return NextResponse.json({
          success: true,
          data: {
            ...dbStats,
            sync_status: syncStatus
          }
        });
      } catch (error) {
        console.error('📧 Stats error:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to get stats',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Fetch newsletters from database
    try {
      const { newsletters, total } = await repository.getNewsletters({
        limit,
        offset,
        status: status !== 'all' ? status : undefined,
        type: type !== 'all' ? type : undefined,
        search: query || undefined,
        sortBy: sortBy as any
      });

      console.log(`📧 Returning ${newsletters.length} newsletters (${total} total)`);

      return NextResponse.json({
        success: true,
        data: newsletters,
        total,
        count: newsletters.length,
        query: query || null,
        filters: { status, type, sortBy },
        pagination: { limit, offset }
      });
    } catch (error) {
      console.error('📧 Database query error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch newsletters',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('📧 Newsletter API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint for manual sync trigger
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Manual sync triggered via POST');
    
    const syncService = getMailchimpSyncService();
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
    console.error('📧 Manual sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}