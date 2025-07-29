import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching Airtable content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock Airtable data - in production this would use Airtable API
    const totalAvailable = 300;
    const remainingItems = Math.max(0, totalAvailable - offset);
    const itemsToReturn = Math.min(limit, remainingItems);
    
    if (itemsToReturn === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        meta: { total: totalAvailable, offset, limit, hasMore: false }
      });
    }
    
    const mockItems: any[] = Array.from({ length: itemsToReturn }, (_, i) => ({
      id: `airtable-${offset + i}`,
      title: `Story ${offset + i + 1}: Impact in ${['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'][i % 5]}`,
      description: `Impact story documenting mentoring outcomes and community transformation`,
      contentType: i % 3 === 0 ? 'story' : i % 3 === 1 ? 'research' : 'tool',
      source: 'airtable',
      url: `https://airtable.com/record/${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['story', 'impact', 'mentoring', 'community'],
      themes: [{ id: 'impact', name: 'Community Impact', relevance: 90 }],
      topics: [{ id: 'stories', name: 'Impact Stories', keywords: ['story', 'outcome'] }],
      authors: ['Community Contributor'],
      thumbnail: `/assets/images/story-${(i % 15) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: totalAvailable,
        offset,
        limit,
        hasMore: offset + itemsToReturn < totalAvailable
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Airtable content'
    }, { status: 500 });
  }
}