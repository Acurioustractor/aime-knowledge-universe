import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/lib/content-integration/models/content-item';

export async function GET(request: NextRequest) {
  try {
    console.log('📂 Fetching GitHub content...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Mock GitHub data
    const mockItems: any[] = Array.from({ length: Math.min(limit, 50) }, (_, i) => ({
      id: `github-${offset + i}`,
      title: `Tool ${offset + i + 1}: ${['Mentoring Framework', 'Assessment Toolkit', 'Program Guide', 'Resource Library'][i % 4]}`,
      description: `Open source tool for AIME mentoring programs and educational resources`,
      contentType: 'tool',
      source: 'github',
      url: `https://github.com/aime/tool-${offset + i}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['tool', 'open-source', 'framework', 'guide'],
      themes: [{ id: 'tools', name: 'Tools & Resources', relevance: 85 }],
      topics: [{ id: 'toolkit', name: 'Implementation Toolkit', keywords: ['tool', 'framework'] }],
      authors: ['AIME Development Team'],
      thumbnail: `/assets/images/tool-${(i % 8) + 1}.jpg`
    }));

    return NextResponse.json({
      success: true,
      items: mockItems,
      meta: {
        total: 500, // Estimated total
        offset,
        limit,
        hasMore: offset + limit < 500
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub content'
    }, { status: 500 });
  }
}