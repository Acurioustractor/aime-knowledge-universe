/**
 * Smart Recommendations API
 * 
 * Provides intelligent content recommendations based on user context and behavior
 */

import { NextRequest, NextResponse } from 'next/server';
import { recommendationEngine } from '@/lib/recommendations/recommendation-engine';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      currentContentId,
      recommendationType = 'personalized',
      limit = 10,
      excludeContentIds = []
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log(`🎯 Generating ${recommendationType} recommendations for session ${sessionId}`);

    // Get user session
    const userSession = await enhancedContentRepository.getOrCreateUserSession(sessionId);

    // Get all content for recommendations
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      limit: 1000 // Get all content for comprehensive recommendations
    });

    // Get user interactions for personalization (placeholder for now)
    const userInteractions: any[] = []; // Would fetch from user_interactions table

    // Generate recommendations
    const recommendationRequest = {
      sessionId,
      currentContentId,
      recommendationType,
      limit,
      excludeContentIds
    };

    const recommendations = await recommendationEngine.generateRecommendations(
      recommendationRequest,
      userSession,
      contentResult.items,
      userInteractions
    );

    return NextResponse.json({
      success: true,
      data: recommendations.recommendations,
      total: recommendations.total,
      reasoning: recommendations.reasoning,
      userContext: recommendations.userContext,
      metadata: {
        sessionId,
        recommendationType,
        contentPoolSize: contentResult.items.length,
        processingTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Recommendations API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const type = searchParams.get('type') || 'personalized';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Use POST method logic for GET requests
    const userSession = await enhancedContentRepository.getOrCreateUserSession(sessionId);
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({ limit: 1000 });
    const userInteractions: any[] = [];

    const recommendations = await recommendationEngine.generateRecommendations(
      {
        sessionId,
        recommendationType: type as any,
        limit
      },
      userSession,
      contentResult.items,
      userInteractions
    );

    return NextResponse.json({
      success: true,
      data: recommendations.recommendations,
      total: recommendations.total,
      reasoning: recommendations.reasoning,
      userContext: recommendations.userContext
    });

  } catch (error) {
    console.error('Recommendations GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}