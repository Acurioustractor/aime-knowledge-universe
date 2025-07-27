/**
 * Content API - Database-first approach
 * 
 * Fast content retrieval from Supabase (no external API calls)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentRepository } from '@/lib/database/connection';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const options = {
      source: searchParams.get('source') || undefined,
      contentType: searchParams.get('type') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      categories: searchParams.get('categories')?.split(',').filter(Boolean),
      tags: searchParams.get('tags')?.split(',').filter(Boolean)
    };

    console.log('📦 Fetching content from database:', options);

    const repo = await getContentRepository();
    
    // Use the available methods from ContentRepository
    // Since getContent might not exist, let's use the available methods
    let result;
    if (options.contentType === 'tool' || options.contentType === 'tools') {
      const toolsResult = await repo.getTools({
        limit: options.limit,
        offset: options.offset,
        search: options.search,
        category: options.categories?.[0],
        sortBy: options.sortBy as any
      });
      result = {
        items: toolsResult.tools,
        total: toolsResult.total
      };
    } else if (options.contentType === 'video' || options.contentType === 'videos') {
      const videosResult = await repo.getVideos({
        limit: options.limit,
        offset: options.offset,
        search: options.search,
        sortBy: options.sortBy as any
      });
      result = {
        items: videosResult.videos,
        total: videosResult.total
      };
    } else if (options.contentType === 'newsletter' || options.contentType === 'newsletters') {
      const newslettersResult = await repo.getNewsletters({
        limit: options.limit,
        offset: options.offset,
        search: options.search,
        sortBy: options.sortBy as any
      });
      result = {
        items: newslettersResult.newsletters,
        total: newslettersResult.total
      };
    } else {
      // Get mixed content - combine tools, videos, and newsletters
      const [toolsResult, videosResult, newslettersResult] = await Promise.all([
        repo.getTools({ limit: Math.ceil(options.limit / 3), search: options.search }),
        repo.getVideos({ limit: Math.ceil(options.limit / 3), search: options.search }),
        repo.getNewsletters({ limit: Math.ceil(options.limit / 3), search: options.search })
      ]);
      
      const allItems = [
        ...toolsResult.tools,
        ...videosResult.videos,
        ...newslettersResult.newsletters
      ];
      
      result = {
        items: allItems.slice(options.offset, options.offset + options.limit),
        total: toolsResult.total + videosResult.total + newslettersResult.total
      };
    }

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      limit: options.limit,
      offset: options.offset,
      source: 'database'
    });

  } catch (error) {
    console.error('Content API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}