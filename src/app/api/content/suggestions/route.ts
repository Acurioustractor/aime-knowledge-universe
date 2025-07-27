import { NextRequest, NextResponse } from 'next/server';
import { contentStorage } from '@/lib/content-storage';
// Initialize content on first API call
import '@/lib/init-content';

/**
 * API for content suggestions
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');

    const suggestions = contentStorage.getSuggestions(limit);

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        count: suggestions.length
      }
    });

  } catch (error) {
    console.error('❌ Content suggestions API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch suggestions'
    }, { status: 500 });
  }
}