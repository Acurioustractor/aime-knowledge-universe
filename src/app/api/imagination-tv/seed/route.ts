/**
 * IMAGI-NATION TV Database Seeding API
 * 
 * Seeds the database with initial episode data
 */

import { NextRequest, NextResponse } from 'next/server';
import { seedEpisodesDatabase } from '@/lib/database/seed-episodes';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/seed - Seed the database with episodes
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting IMAGI-NATION TV database seeding...');
    
    // Add authentication check here in production
    const body = await request.json();
    if (body.adminKey !== 'aime-seed-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }
    
    const startTime = Date.now();
    
    await seedEpisodesDatabase();
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Database seeding completed in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'IMAGI-NATION TV database seeded successfully',
        duration: `${duration}ms`,
        episodesCreated: 3,
        segmentsCreated: 19,
        wisdomExtractsCreated: 12
      }
    });
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to seed database'
    }, { status: 500 });
  }
}

/**
 * GET /api/imagination-tv/seed - Check seeding status
 */
export async function GET(request: NextRequest) {
  try {
    // Check if database has been seeded by trying to fetch episodes
    const episodesResponse = await fetch(
      `${request.nextUrl.origin}/api/imagination-tv/episodes?limit=1`
    );
    const episodesData = await episodesResponse.json();
    
    const isSeeded = episodesData.success && episodesData.data.total > 0;
    
    return NextResponse.json({
      success: true,
      data: {
        isSeeded,
        episodeCount: episodesData.data?.total || 0,
        message: isSeeded 
          ? 'Database has been seeded' 
          : 'Database needs seeding'
      }
    });
    
  } catch (error) {
    console.error('❌ Seeding status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check seeding status'
    }, { status: 500 });
  }
}