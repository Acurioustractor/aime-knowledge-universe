/**
 * Database Debug API
 * 
 * Debug what's actually in the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentRepository } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    // Check if PostgreSQL is enabled, if not use SQLite
    if (process.env.ENABLE_POSTGRES_DB !== 'true') {
      try {
        const repository = await getContentRepository();
        const stats = await repository.getStats();
        const syncStatus = await repository.getSyncStatus();
        
        return NextResponse.json({
          success: true,
          database_type: 'SQLite',
          stats,
          sync_status: syncStatus,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          database_type: 'SQLite',
          error: error instanceof Error ? error.message : 'SQLite access failed',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // PostgreSQL path (only if explicitly enabled)
    const { postgres } = await import('@/lib/database/postgres');
    
    // Check if database is initialized
    if (!postgres.isInitialized()) {
      return NextResponse.json({
        success: false,
        database_type: 'PostgreSQL',
        error: 'Database not initialized',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Check content table
    const allContent = await postgres.query(`
      SELECT source, type, COUNT(*) as count 
      FROM content_items 
      GROUP BY source, type
    `);
    
    // Check total tools from airtable
    const airtableTools = await postgres.query(`
      SELECT title, source, type
      FROM content_items 
      WHERE source = 'airtable' AND type = 'tool'
      LIMIT 10
    `);
    
    // Raw count
    const totalCount = await postgres.queryOne(`
      SELECT COUNT(*) as total FROM content_items 
      WHERE type = 'tool' AND source = 'airtable'
    `);
    
    return NextResponse.json({
      success: true,
      database_type: 'PostgreSQL',
      debug: {
        content_breakdown: allContent,
        airtable_tools_sample: airtableTools,
        airtable_tools_total: totalCount?.total || 0,
        table_exists: true
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: { table_exists: false }
    });
  }
} 