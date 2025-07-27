/**
 * Health Check API
 * Used by initialization scripts to verify server is ready
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIHandler } from '@/lib/api-middleware';
import { checkDatabaseHealth } from '@/lib/database/connection';

async function handleHealthCheck(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'AIME Wiki',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      processingTime: 0
    };

    // Database health check if requested
    const checkDB = request.nextUrl.searchParams.get('db') === 'true';
    if (checkDB) {
      try {
        const dbHealth = await checkDatabaseHealth();
        health.database = {
          sqlite: {
            status: dbHealth.sqlite.connected ? 'connected' : 'disconnected',
            error: dbHealth.sqlite.error
          },
          supabase: {
            status: dbHealth.supabase.connected ? 'connected' : 'disconnected', 
            error: dbHealth.supabase.error
          }
        };
      } catch (dbError) {
        health.database = {
          status: 'error',
          error: dbError instanceof Error ? dbError.message : 'Database check failed'
        };
      }
    }

    health.processingTime = Date.now() - startTime;
    
    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime
    }, { status: 503 });
  }
}

export const GET = createAPIHandler(handleHealthCheck, {
  rateLimit: 'public',
  endpoint: '/api/health'
}); 