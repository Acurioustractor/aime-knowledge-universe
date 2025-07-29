/**
 * Supabase Connection Test API
 * 
 * Test your Supabase connection and database setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, contentRepository } from '@/lib/database/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('content_items')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      if (connectionError.code === '42P01') {
        return NextResponse.json({
          success: false,
          error: 'Database tables not found',
          message: 'You need to run the database schema first. Go to Supabase SQL Editor and run the schema from src/lib/database/supabase-setup.sql',
          step: 'schema_missing'
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        message: connectionError.message,
        step: 'connection_failed'
      }, { status: 500 });
    }
    
    // Test 2: Repository functions
    const stats = await contentRepository.getStats();
    
    // Test 3: Check sync status table
    const { data: syncStatus, error: syncError } = await supabase
      .from('sync_status')
      .select('*');
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      tests: {
        connection: '✅ Connected',
        tables: '✅ Tables exist',
        repository: '✅ Repository working'
      },
      data: {
        contentStats: stats,
        syncStatus: syncStatus || [],
        totalSources: syncStatus?.length || 0
      },
      nextSteps: [
        'Connection is working!',
        'Go to /admin/sync to run initial content sync',
        'Or use the API: POST /api/sync'
      ]
    });
    
  } catch (error) {
    console.error('Supabase test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: [
        'Check your SUPABASE_URL in .env.local',
        'Check your SUPABASE_SERVICE_KEY in .env.local',
        'Make sure you ran the database schema',
        'Verify your Supabase project is active'
      ]
    }, { status: 500 });
  }
}