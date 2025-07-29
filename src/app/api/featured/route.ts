import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/integrations';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  source: string;
  url?: string;
  thumbnail?: string;
  date?: string;
  tags?: string[];
  categories?: string[];
  metadata?: Record<string, any>;
  score?: number;
  reasons?: string;
}

/**
 * API route to fetch featured content from all sources with intelligent serving
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const type = searchParams.get('type') || undefined;
    const strategy = searchParams.get('strategy') || 'intelligent';
    
    // Get current hour for time-based rotation
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    if (strategy === 'intelligent') {
      const db = await getDb();
      
      // Time-based content strategies
      let query = '';
      let strategyName = '';
      
      if (currentHour >= 6 && currentHour < 12) {
        // Morning: Inspirational content
        strategyName = 'morning_inspiration';
        query = `
          SELECT * FROM content 
          WHERE (title LIKE '%inspiration%' OR title LIKE '%imagine%' OR title LIKE '%dream%' 
                 OR title LIKE '%morning%' OR title LIKE '%start%')
          AND content_type IN ('video', 'newsletter')
          ORDER BY RANDOM()
          LIMIT ${limit}
        `;
      } else if (currentHour >= 12 && currentHour < 17) {
        // Afternoon: Learning and tools
        strategyName = 'afternoon_learning';
        query = `
          SELECT * FROM content 
          WHERE content_type IN ('tool', 'business_case')
          ORDER BY view_count DESC, source_created_at DESC
          LIMIT ${limit}
        `;
      } else if (currentHour >= 17 && currentHour < 22) {
        // Evening: Stories and reflection
        strategyName = 'evening_stories';
        query = `
          SELECT * FROM content 
          WHERE (title LIKE '%story%' OR title LIKE '%journey%' OR content_type = 'video')
          ORDER BY RANDOM()
          LIMIT ${limit}
        `;
      } else {
        // Late night/early morning: Deep content
        strategyName = 'deep_dive';
        query = `
          SELECT * FROM content 
          WHERE length(content) > 1000
          ORDER BY view_count DESC
          LIMIT ${limit}
        `;
      }
      
      // Weekend special content
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        strategyName = 'weekend_exploration';
        query = `
          SELECT * FROM content 
          WHERE content_type IN ('newsletter', 'business_case', 'video')
          AND (title LIKE '%workshop%' OR title LIKE '%deep%' OR title LIKE '%explore%')
          ORDER BY RANDOM()
          LIMIT ${limit}
        `;
      }
      
      try {
        const featuredItems = await db.all(query);
        
        // If not enough items, get popular content as fallback
        if (featuredItems.length < limit) {
          const popularItems = await db.all(`
            SELECT * FROM content 
            WHERE id NOT IN (${featuredItems.map(() => '?').join(',') || "''"})
            ORDER BY view_count DESC, source_created_at DESC
            LIMIT ${limit - featuredItems.length}
          `, ...featuredItems.map(i => i.id));
          
          featuredItems.push(...popularItems);
        }
        
        return NextResponse.json({
          items: featuredItems,
          strategy: strategyName,
          timestamp: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Database error, falling back to legacy method:', dbError);
        // Fall through to legacy method
      }
    }
    
    // Legacy method - fetch from integrations
    const allContent = await getAllContent();
    
    // Filter by type if specified
    let filteredContent = allContent;
    if (type) {
      filteredContent = allContent.filter((item: any) => item.type === type);
    }
    
    // Intelligent scoring for legacy method
    const scoredContent = filteredContent.map((item: ContentItem) => {
      let score = 0;
      const reasons: string[] = [];
      
      // Recency scoring
      if (item.date) {
        const daysOld = (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld < 7) {
          score += 20;
          reasons.push('Recent');
        } else if (daysOld < 30) {
          score += 10;
          reasons.push('Fresh');
        }
      }
      
      // Content type scoring based on time of day
      if (currentHour >= 6 && currentHour < 12 && item.type === 'video') {
        score += 15;
        reasons.push('Morning video');
      } else if (currentHour >= 12 && currentHour < 17 && item.type === 'tool') {
        score += 15;
        reasons.push('Afternoon tool');
      }
      
      // Special content boost
      if (item.title.toLowerCase().includes('hoodie')) {
        score += 10;
        reasons.push('Hoodie content');
      }
      if (item.title.toLowerCase().includes('imagi-nation')) {
        score += 8;
        reasons.push('IMAGI-NATION');
      }
      
      return {
        ...item,
        score,
        reasons: reasons.join(', ')
      };
    });
    
    // Sort by score and get top items
    const sortedContent = scoredContent.sort((a, b) => (b.score || 0) - (a.score || 0));
    const featuredContent = sortedContent.slice(0, limit);
    
    return NextResponse.json({
      items: featuredContent,
      strategy: 'scored',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Featured content API error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch featured content' },
      { status: 500 }
    );
  }
}