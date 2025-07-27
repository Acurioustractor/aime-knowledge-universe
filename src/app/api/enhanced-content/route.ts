/**
 * Enhanced Content API Route
 * 
 * Philosophy-first content delivery with intelligent recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const options = {
      philosophyDomain: searchParams.get('domain') || undefined,
      complexityLevel: searchParams.get('complexity') ? parseInt(searchParams.get('complexity')!) : undefined,
      userRole: searchParams.get('role') || undefined,
      includePrerequisites: searchParams.get('prerequisites') !== 'false',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    console.log('Enhanced content API called with options:', options);

    const result = await enhancedContentRepository.getContentWithPhilosophy(options);

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      philosophy: result.philosophy,
      options
    });

  } catch (error) {
    console.error('Enhanced content API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch enhanced content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log(`Enhanced content API POST called with action: ${action}`);

    switch (action) {
      case 'recommend':
        const { sessionId, currentContentId, recommendationType, limit } = data;
        
        if (!sessionId || !recommendationType) {
          return NextResponse.json({
            success: false,
            error: 'Session ID and recommendation type required'
          }, { status: 400 });
        }

        const recommendations = await enhancedContentRepository.getRecommendedContent({
          sessionId,
          currentContentId,
          recommendationType,
          limit: limit || 5
        });

        return NextResponse.json({
          success: true,
          data: recommendations,
          total: recommendations.length,
          recommendationType
        });

      case 'track':
        const { interaction } = data;
        
        if (!interaction || !interaction.sessionId || !interaction.contentId) {
          return NextResponse.json({
            success: false,
            error: 'Valid interaction data required'
          }, { status: 400 });
        }

        await enhancedContentRepository.trackUserInteraction(interaction);

        return NextResponse.json({
          success: true,
          message: 'Interaction tracked successfully'
        });

      case 'session':
        const { sessionId: newSessionId, initialData } = data;
        
        if (!newSessionId) {
          return NextResponse.json({
            success: false,
            error: 'Session ID required'
          }, { status: 400 });
        }

        const session = await enhancedContentRepository.getOrCreateUserSession(
          newSessionId,
          initialData
        );

        return NextResponse.json({
          success: true,
          data: session
        });

      case 'pathways':
        const { philosophyDomain, targetAudience, difficultyLevel } = data;

        const pathways = await enhancedContentRepository.getImplementationPathways({
          philosophyDomain,
          targetAudience,
          difficultyLevel
        });

        return NextResponse.json({
          success: true,
          data: pathways,
          total: pathways.length
        });

      case 'performance':
        const { contentId } = data;

        const performance = await enhancedContentRepository.getContentPerformance(contentId);

        return NextResponse.json({
          success: true,
          data: performance,
          total: performance.length
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: recommend, track, session, pathways, performance'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Enhanced content API POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process enhanced content request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}