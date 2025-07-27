/**
 * Health check endpoint for unified search API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const db = await getDatabase();
    
    // Test basic query
    const testQuery = await db.get('SELECT COUNT(*) as count FROM content LIMIT 1');
    
    // Test search enhancement functions
    const { calculateAdvancedRelevance } = await import('@/lib/search-enhancement');
    
    const testResult = calculateAdvancedRelevance({
      id: 'test',
      title: 'Test',
      description: 'Test description',
      content: 'Test content',
      type: 'content',
      metadata: {},
      relevance_score: 0
    }, 'test');
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      checks: {
        database_connection: 'ok',
        basic_query: testQuery ? 'ok' : 'failed',
        search_enhancement: testResult > 0 ? 'ok' : 'failed'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}