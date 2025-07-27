/**
 * Community Matching API
 * 
 * Provides intelligent user matching based on compatibility, shared goals, and complementary skills
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityMatchingEngine, MatchingRequest } from '@/lib/community/matching-engine';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// POST /api/community/matching - Generate match suggestions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      connectionTypes,
      philosophyDomains,
      geographicScope,
      experienceLevel,
      limit = 10,
      excludeSessionIds = []
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`🎯 Generating match suggestions for session ${sessionId}`);

    // Ensure user has a community profile
    await enhancedContentRepository.getOrCreateCommunityProfile(sessionId);

    // Create matching request
    const matchingRequest: MatchingRequest = {
      sessionId,
      connectionTypes,
      philosophyDomains,
      geographicScope,
      experienceLevel,
      limit,
      excludeSessionIds
    };

    // Generate match suggestions
    const suggestions = await communityMatchingEngine.generateMatchSuggestions(matchingRequest);

    // Generate explanations for each suggestion
    const suggestionsWithExplanations = suggestions.map(suggestion => ({
      ...suggestion,
      explanation: communityMatchingEngine.generateMatchExplanation(suggestion)
    }));

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        totalSuggestions: suggestions.length,
        suggestions: suggestionsWithExplanations,
        matchingCriteria: {
          connectionTypes: connectionTypes || ['peer', 'mentor', 'mentee'],
          philosophyDomains: philosophyDomains || 'all',
          geographicScope: geographicScope || 'global',
          experienceLevel: experienceLevel || 'any'
        }
      }
    });

  } catch (error) {
    console.error('Community matching API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate match suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/community/matching - Get match suggestions with query parameters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const connectionTypes = searchParams.get('connectionTypes')?.split(',');
    const philosophyDomains = searchParams.get('philosophyDomains')?.split(',');
    const geographicScope = searchParams.get('geographicScope') as 'local' | 'regional' | 'global';
    const experienceLevel = searchParams.get('experienceLevel');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    // Use POST method logic for GET requests
    const matchingRequest: MatchingRequest = {
      sessionId,
      connectionTypes: connectionTypes as any,
      philosophyDomains,
      geographicScope,
      experienceLevel,
      limit
    };

    const suggestions = await communityMatchingEngine.generateMatchSuggestions(matchingRequest);

    const suggestionsWithExplanations = suggestions.map(suggestion => ({
      ...suggestion,
      explanation: communityMatchingEngine.generateMatchExplanation(suggestion)
    }));

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        totalSuggestions: suggestions.length,
        suggestions: suggestionsWithExplanations
      }
    });

  } catch (error) {
    console.error('Community matching GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch match suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}