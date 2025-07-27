import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('📖 Fetching Stories content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock Stories data
    const mockItems: any[] = Array.from({ length: Math.min(limit, 60) }, (_, i) => ({
      id: `story-${offset + i}`,
      title: `Impact Story ${offset + i + 1}: ${['University Success', 'Career Breakthrough', 'Community Leadership', 'Cultural Bridge'][i % 4]}`,
      description: `Personal story showcasing the transformative impact of AIME mentoring programs`,
      contentType: 'story',
      source: 'stories',
      url: `https://stories.aime.org.au/${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['story', 'success', 'mentoring', 'transformation'],
      themes: [{ id: 'success', name: 'Success Stories', relevance: 95 }],
      topics: [{ id: 'outcomes', name: 'Program Outcomes', keywords: ['success', 'achievement'] }],
      authors: ['Program Participant'],
      thumbnail: `/assets/images/success-${(i % 12) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: 1500, // Estimated total
        offset,
        limit,
        hasMore: offset + limit < 1500
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Stories content'
    }, { status: 500 });
  }
}