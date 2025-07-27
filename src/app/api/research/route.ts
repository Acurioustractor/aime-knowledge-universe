import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('🔬 Fetching Research content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock Research data
    const mockItems: any[] = Array.from({ length: Math.min(limit, 30) }, (_, i) => ({
      id: `research-${offset + i}`,
      title: `Research ${offset + i + 1}: ${['Mentoring Effectiveness Study', 'Indigenous Education Outcomes', 'Community Impact Analysis', 'Program Evaluation'][i % 4]}`,
      description: `Academic research paper analyzing AIME program effectiveness and community impact`,
      contentType: 'research',
      source: 'research',
      url: `https://research.aime.org.au/paper/${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['research', 'analysis', 'evaluation', 'evidence'],
      themes: [{ id: 'research', name: 'Research & Evidence', relevance: 90 }],
      topics: [{ id: 'evaluation', name: 'Program Evaluation', keywords: ['research', 'study'] }],
      authors: ['Research Team'],
      thumbnail: `/assets/images/research-${(i % 8) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: 300, // Estimated total
        offset,
        limit,
        hasMore: offset + limit < 300
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Research content'
    }, { status: 500 });
  }
}