/**
 * Philosophy API Route
 * 
 * Provides access to philosophy primers and contextual explanations
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';
import { getPhilosophyPrimer, getPhilosophyDomains, searchPhilosophyPrimers } from '@/lib/philosophy/philosophy-primers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');
    const search = searchParams.get('search');
    const action = searchParams.get('action') || 'list';

    console.log(`Philosophy API called with action: ${action}, domain: ${domain}`);

    switch (action) {
      case 'get':
        if (!domain) {
          return NextResponse.json({
            success: false,
            error: 'Domain parameter required for get action'
          }, { status: 400 });
        }

        // Try to get from database first
        const dbPrimer = await enhancedContentRepository.getPhilosophyPrimer(domain);
        
        if (dbPrimer) {
          return NextResponse.json({
            success: true,
            data: dbPrimer,
            source: 'database'
          });
        }

        // Fallback to static primers
        const staticPrimer = getPhilosophyPrimer(domain);
        if (staticPrimer) {
          return NextResponse.json({
            success: true,
            data: staticPrimer,
            source: 'static'
          });
        }

        return NextResponse.json({
          success: false,
          error: 'Philosophy primer not found'
        }, { status: 404 });

      case 'search':
        if (!search) {
          return NextResponse.json({
            success: false,
            error: 'Search query required'
          }, { status: 400 });
        }

        const searchResults = searchPhilosophyPrimers(search);
        return NextResponse.json({
          success: true,
          data: searchResults,
          total: searchResults.length
        });

      case 'domains':
        const domains = getPhilosophyDomains();
        return NextResponse.json({
          success: true,
          data: domains
        });

      case 'list':
      default:
        // Get all philosophy primers from database
        const allPrimers = await enhancedContentRepository.getAllPhilosophyPrimers();
        
        return NextResponse.json({
          success: true,
          data: allPrimers,
          total: allPrimers.length,
          source: 'database'
        });
    }

  } catch (error) {
    console.error('Philosophy API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch philosophy content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}