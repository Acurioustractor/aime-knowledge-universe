import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Fetching Mailchimp content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock Mailchimp data
    const mockItems: any[] = Array.from({ length: Math.min(limit, 75) }, (_, i) => ({
      id: `mailchimp-${offset + i}`,
      title: `Newsletter ${offset + i + 1}: ${['Monthly Update', 'Impact Report', 'Community News', 'Program Highlights'][i % 4]}`,
      description: `AIME newsletter featuring program updates, success stories, and community news`,
      contentType: 'newsletter',
      source: 'mailchimp',
      url: `https://mailchimp.com/newsletter/${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['newsletter', 'updates', 'community', 'news'],
      themes: [{ id: 'community', name: 'Community Updates', relevance: 80 }],
      topics: [{ id: 'updates', name: 'Program Updates', keywords: ['update', 'news'] }],
      authors: ['AIME Communications Team'],
      thumbnail: `/assets/images/newsletter-${(i % 6) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: 1000, // Estimated total
        offset,
        limit,
        hasMore: offset + limit < 1000
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Mailchimp content'
    }, { status: 500 });
  }
}