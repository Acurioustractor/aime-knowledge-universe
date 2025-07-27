/**
 * Debug Supabase Connection
 * 
 * Simple test to debug connection issues
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        debug: {
          supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
          supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Missing',
          supabaseServiceKey: supabaseServiceKey ? 'Set' : 'Missing'
        }
      }, { status: 400 });
    }
    
    // Test basic fetch to Supabase
    console.log('Testing basic fetch to:', supabaseUrl);
    
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Fetch response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log('Fetch error response:', errorText);
      
      return NextResponse.json({
        success: false,
        error: 'Supabase API request failed',
        debug: {
          status: testResponse.status,
          statusText: testResponse.statusText,
          response: errorText,
          url: supabaseUrl
        }
      }, { status: 500 });
    }
    
    // Try to import and use Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test a simple query
    const { data, error } = await supabase
      .from('content_items')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Supabase query error:', error);
      
      if (error.code === '42P01') {
        return NextResponse.json({
          success: false,
          error: 'Tables not found',
          message: 'Database schema needs to be created. Run the SQL schema in Supabase.',
          debug: {
            errorCode: error.code,
            errorMessage: error.message
          }
        });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        debug: {
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      debug: {
        url: supabaseUrl,
        tablesExist: true,
        contentItemsCount: data?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}