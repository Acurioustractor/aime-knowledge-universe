import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('📺 Fetching IMAGI-NATION {TV} content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock IMAGI-NATION {TV} data
    const mockItems: any[] = Array.from({ length: Math.min(limit, 40) }, (_, i) => ({
      id: `imaginationtv-${offset + i}`,
      title: `IMAGI-NATION {TV} Episode ${offset + i + 1}: ${['Youth Leadership', 'Cultural Wisdom', 'Innovation Labs', 'Global Connections'][i % 4]}`,
      description: `Educational episode featuring youth voices, cultural wisdom, and innovative approaches to education`,
      contentType: 'video',
      source: 'imagination-tv',
      url: `https://imagination.tv/episode/${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['imagination-tv', 'youth', 'education', 'culture'],
      themes: [{ id: 'imagination', name: 'Imagination & Innovation', relevance: 85 }],
      topics: [{ id: 'youth-voice', name: 'Youth Voice', keywords: ['youth', 'voice'] }],
      authors: ['IMAGI-NATION TV Team'],
      thumbnail: `/assets/images/imagination-${(i % 10) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: 800, // Estimated total
        offset,
        limit,
        hasMore: offset + limit < 800
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch IMAGI-NATION TV content'
    }, { status: 500 });
  }
}