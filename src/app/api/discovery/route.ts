/**
 * Content Discovery API
 * 
 * Provides personalized content discovery and dashboard data
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';
import { recommendationEngine } from '@/lib/recommendations/recommendation-engine';
import { trendingContentService } from '@/lib/recommendations/trending-content';
import { userContextModelingService } from '@/lib/recommendations/user-context-modeling';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      sessionId,
      section,
      domain,
      timeframe = 'weekly',
      limit = 10
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log(`🎯 Discovery API: ${action} for session ${sessionId}`);

    switch (action) {
      case 'dashboard':
        return await handleDashboardRequest(sessionId, domain, timeframe);
      
      case 'section':
        return await handleSectionRequest(sessionId, section, domain, timeframe, limit);
      
      case 'trending':
        return await handleTrendingRequest(timeframe, domain, limit);
      
      case 'personalized':
        return await handlePersonalizedRequest(sessionId, limit);
      
      case 'cross_domain':
        return await handleCrossDomainRequest(sessionId, limit);
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Discovery API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Discovery request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleDashboardRequest(
  sessionId: string,
  domain?: string,
  timeframe: string = 'weekly'
) {
  try {
    // Build user profile
    const userProfile = await userContextModelingService.buildUserProfile(sessionId);
    
    // Get all content for recommendations
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      philosophyDomain: domain,
      limit: 1000
    });

    // Generate dashboard sections
    const [
      personalizedRecs,
      trendingAnalysis,
      recentContent,
      crossDomainContent
    ] = await Promise.all([
      generatePersonalizedRecommendations(sessionId, userProfile, contentResult.items),
      trendingContentService.identifyTrendingContent(timeframe as any, 10),
      getRecentContent(contentResult.items, 6),
      generateCrossDomainContent(userProfile, contentResult.items)
    ]);

    const dashboardData = {
      userProfile: {
        interests: userProfile.interests,
        currentFocus: userProfile.currentFocus,
        experienceLevel: userProfile.experienceLevel,
        engagementPattern: userProfile.engagementPattern
      },
      sections: {
        personalized: personalizedRecs.slice(0, 6),
        trending: trendingAnalysis.trending.slice(0, 6).map(item => ({
          ...item.content,
          reasoning: item.trendingReason,
          trendingScore: item.metrics.trendingScore
        })),
        recent: recentContent,
        cross_domain: crossDomainContent,
        learning_path: await generateLearningPath(userProfile, contentResult.items),
        community: await generateCommunityHighlights(userProfile, contentResult.items)
      },
      insights: {
        totalContent: contentResult.items.length,
        trendingTopics: trendingAnalysis.insights.emergingTopics.slice(0, 5),
        recommendationQuality: personalizedRecs.length > 0 ? 
          personalizedRecs.reduce((sum, rec) => sum + rec.score, 0) / personalizedRecs.length : 0
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard request failed:', error);
    throw error;
  }
}

async function handleSectionRequest(
  sessionId: string,
  section: string,
  domain?: string,
  timeframe: string = 'weekly',
  limit: number = 10
) {
  try {
    const userProfile = await userContextModelingService.buildUserProfile(sessionId);
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      philosophyDomain: domain,
      limit: 1000
    });

    let sectionData: any[] = [];

    switch (section) {
      case 'personalized':
        sectionData = await generatePersonalizedRecommendations(sessionId, userProfile, contentResult.items);
        break;
      
      case 'trending':
        const trendingAnalysis = await trendingContentService.identifyTrendingContent(timeframe as any, limit);
        sectionData = trendingAnalysis.trending.map(item => ({
          ...item.content,
          reasoning: item.trendingReason,
          trendingScore: item.metrics.trendingScore
        }));
        break;
      
      case 'recent':
        sectionData = getRecentContent(contentResult.items, limit);
        break;
      
      case 'cross_domain':
        sectionData = await generateCrossDomainContent(userProfile, contentResult.items);
        break;
      
      case 'learning_path':
        sectionData = await generateLearningPath(userProfile, contentResult.items);
        break;
      
      case 'community':
        sectionData = await generateCommunityHighlights(userProfile, contentResult.items);
        break;
      
      default:
        throw new Error(`Unknown section: ${section}`);
    }

    return NextResponse.json({
      success: true,
      data: sectionData.slice(0, limit)
    });

  } catch (error) {
    console.error(`Section ${section} request failed:`, error);
    throw error;
  }
}

async function handleTrendingRequest(
  timeframe: string = 'weekly',
  domain?: string,
  limit: number = 10
) {
  try {
    let trendingContent;
    
    if (domain) {
      trendingContent = await trendingContentService.getTrendingByDomain(domain, timeframe as any, limit);
    } else {
      const analysis = await trendingContentService.identifyTrendingContent(timeframe as any, limit);
      trendingContent = analysis.trending;
    }

    return NextResponse.json({
      success: true,
      data: trendingContent.map(item => ({
        ...item.content,
        reasoning: item.trendingReason,
        trendingScore: item.metrics.trendingScore,
        category: item.category
      }))
    });

  } catch (error) {
    console.error('Trending request failed:', error);
    throw error;
  }
}

async function handlePersonalizedRequest(sessionId: string, limit: number = 10) {
  try {
    const userProfile = await userContextModelingService.buildUserProfile(sessionId);
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({ limit: 1000 });
    
    const recommendations = await generatePersonalizedRecommendations(
      sessionId, 
      userProfile, 
      contentResult.items
    );

    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, limit)
    });

  } catch (error) {
    console.error('Personalized request failed:', error);
    throw error;
  }
}

async function handleCrossDomainRequest(sessionId: string, limit: number = 10) {
  try {
    const userProfile = await userContextModelingService.buildUserProfile(sessionId);
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({ limit: 1000 });
    
    const crossDomainContent = await generateCrossDomainContent(userProfile, contentResult.items);

    return NextResponse.json({
      success: true,
      data: crossDomainContent.slice(0, limit)
    });

  } catch (error) {
    console.error('Cross-domain request failed:', error);
    throw error;
  }
}

// Helper functions

async function generatePersonalizedRecommendations(
  sessionId: string,
  userProfile: any,
  allContent: any[]
) {
  // Mock user session for recommendation engine
  const mockUserSession = {
    id: sessionId,
    session_id: sessionId,
    interests: userProfile.interests,
    current_focus_domain: userProfile.currentFocus,
    experience_level: userProfile.experienceLevel,
    preferred_complexity: userProfile.preferredComplexity,
    engagement_level: 3,
    learning_style: userProfile.learningStyle,
    goals: [],
    last_active: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  const recommendations = await recommendationEngine.generateRecommendations(
    {
      sessionId,
      recommendationType: 'personalized',
      limit: 10
    },
    mockUserSession,
    allContent,
    [] // No interaction history for now
  );

  return recommendations.recommendations.map(rec => ({
    ...rec.content,
    reasoning: rec.reasoning,
    score: rec.score,
    confidence: rec.confidence
  }));
}

function getRecentContent(allContent: any[], limit: number) {
  return allContent
    .filter(item => item.source_created_at || item.created_at)
    .sort((a, b) => {
      const dateA = new Date(a.source_created_at || a.created_at);
      const dateB = new Date(b.source_created_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map(item => ({
      ...item,
      reasoning: 'Recently published'
    }));
}

async function generateCrossDomainContent(userProfile: any, allContent: any[]) {
  // Find content that spans multiple domains or connects user's interests
  const userDomains = new Set(userProfile.interests.map((interest: string) => 
    mapInterestToDomain(interest)
  ).filter(Boolean));

  const crossDomainContent = allContent.filter(item => {
    // Look for content that mentions multiple domains in concepts/themes
    const itemDomains = new Set([
      item.philosophy_domain,
      ...item.key_concepts.map(mapConceptToDomain),
      ...item.themes.map(mapConceptToDomain)
    ].filter(Boolean));

    // Content is cross-domain if it touches multiple domains user is interested in
    const intersection = new Set([...userDomains].filter(x => itemDomains.has(x)));
    return intersection.size >= 2 || itemDomains.size >= 2;
  });

  return crossDomainContent.slice(0, 6).map(item => ({
    ...item,
    reasoning: 'Bridges multiple philosophy domains',
    domains: Array.from(new Set([
      item.philosophy_domain,
      ...item.key_concepts.map(mapConceptToDomain),
      ...item.themes.map(mapConceptToDomain)
    ].filter(Boolean)))
  }));
}

async function generateLearningPath(userProfile: any, allContent: any[]) {
  // Find content that represents next steps in user's learning journey
  const currentComplexity = userProfile.preferredComplexity || 1;
  const focusDomain = userProfile.currentFocus;

  const nextStepContent = allContent.filter(item => {
    return item.philosophy_domain === focusDomain &&
           item.complexity_level === currentComplexity + 1;
  });

  return nextStepContent.slice(0, 6).map(item => ({
    ...item,
    reasoning: 'Next step in your learning journey',
    isNextStep: true
  }));
}

async function generateCommunityHighlights(userProfile: any, allContent: any[]) {
  // Find highly engaged content in user's areas of interest
  const communityContent = allContent
    .filter(item => {
      return userProfile.interests.some((interest: string) =>
        item.key_concepts.includes(interest) ||
        item.themes.includes(interest) ||
        item.tags.includes(interest)
      );
    })
    .filter(item => item.engagement_score > 0.7)
    .sort((a, b) => b.engagement_score - a.engagement_score);

  return communityContent.slice(0, 6).map(item => ({
    ...item,
    reasoning: 'Highly engaged by community',
    communityRating: item.engagement_score * 5 // Convert to 5-star rating
  }));
}

function mapInterestToDomain(interest: string): string | null {
  const domainMap: Record<string, string> = {
    'imagination': 'imagination-based-learning',
    'creative': 'imagination-based-learning',
    'hoodie': 'hoodie-economics',
    'economics': 'hoodie-economics',
    'value': 'hoodie-economics',
    'mentor': 'mentoring-systems',
    'mentoring': 'mentoring-systems',
    'leadership': 'mentoring-systems',
    'community': 'community-building'
  };

  return domainMap[interest.toLowerCase()] || null;
}

function mapConceptToDomain(concept: string): string | null {
  return mapInterestToDomain(concept);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const section = searchParams.get('section');
    const domain = searchParams.get('domain');
    const timeframe = searchParams.get('timeframe') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (section) {
      return await handleSectionRequest(sessionId, section, domain || undefined, timeframe, limit);
    } else {
      return await handleDashboardRequest(sessionId, domain || undefined, timeframe);
    }

  } catch (error) {
    console.error('Discovery GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Discovery request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}