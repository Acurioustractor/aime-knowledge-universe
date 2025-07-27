/**
 * Hoodie Earning API
 * 
 * Handles hoodie earning events, eligibility checks, and Airtable sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { hoodieEarningEngine, EarningEvent } from '@/lib/hoodie-stock-exchange/earning-engine'; 
import { fetchHoodieStockExchangeData } from '@/lib/integrations/hoodie-stock-exchange-data';

/**
 * POST /api/hoodies/earning
 * Process hoodie earning events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'check_eligibility':
        return await handleEligibilityCheck(data);
      
      case 'award_hoodie':
        return await handleHoodieAward(data);
      
      case 'process_content_completion':
        return await handleContentCompletion(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: check_eligibility, award_hoodie, or process_content_completion' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in hoodie earning API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/hoodies/earning/eligibility
 * Check earning eligibility for a learner and hoodie
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const learnerId = url.searchParams.get('learner_id');
    const hoodieId = url.searchParams.get('hoodie_id');

    if (!learnerId || !hoodieId) {
      return NextResponse.json(
        { error: 'learner_id and hoodie_id are required' },
        { status: 400 }
      );
    }

    // Get learner's completed actions (mock for now - would come from user activity tracking)
    const completedActions = await getMockLearnerActivity(learnerId);

    const eligibility = await hoodieEarningEngine.checkEarningEligibility(
      learnerId,
      hoodieId,
      completedActions
    );

    return NextResponse.json(eligibility);

  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}

async function handleEligibilityCheck(data: {
  learner_id: string;
  hoodie_id: string;
  completed_actions?: any;
}) {
  const { learner_id, hoodie_id, completed_actions } = data;

  if (!learner_id || !hoodie_id) {
    return NextResponse.json(
      { error: 'learner_id and hoodie_id are required' },
      { status: 400 }
    );
  }

  const actions = completed_actions || await getMockLearnerActivity(learner_id);

  const eligibility = await hoodieEarningEngine.checkEarningEligibility(
    learner_id,
    hoodie_id,
    actions
  );

  return NextResponse.json(eligibility);
}

async function handleHoodieAward(data: EarningEvent) {
  const requiredFields = ['learner_id', 'learner_name', 'hoodie_id', 'earning_method'];
  
  for (const field of requiredFields) {
    if (!data[field as keyof EarningEvent]) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  // Ensure required fields have defaults
  const earningEvent: EarningEvent = {
    ...data,
    earned_at: data.earned_at || new Date().toISOString(),
    completion_evidence: data.completion_evidence || {},
    imagination_credits_earned: data.imagination_credits_earned || 0,
    acquisition_story: data.acquisition_story || `Earned through ${data.earning_method}`
  };

  const result = await hoodieEarningEngine.awardHoodie(earningEvent);

  if (result.success) {
    // Sync to Airtable
    await hoodieEarningEngine.syncEarningToAirtable(earningEvent);
  }

  return NextResponse.json(result);
}

async function handleContentCompletion(data: {
  learner_id: string;
  learner_name: string;
  content_id: string;
  content_type: string;
  completion_data?: any;
}) {
  const { learner_id, learner_name, content_id, content_type, completion_data } = data;

  if (!learner_id || !learner_name || !content_id || !content_type) {
    return NextResponse.json(
      { error: 'learner_id, learner_name, content_id, and content_type are required' },
      { status: 400 }
    );
  }

  await hoodieEarningEngine.processContentCompletionEarning(
    learner_id,
    learner_name,
    content_id,
    content_type,
    completion_data
  );

  return NextResponse.json({ 
    success: true, 
    message: 'Content completion processed for hoodie earning' 
  });
}

/**
 * Mock function to get learner activity
 * In production, this would query the actual user activity database
 */
async function getMockLearnerActivity(learnerId: string) {
  // This would be replaced with real database queries
  return {
    content_engaged: ['content-1', 'content-2', 'video-intro-to-systems'],
    mentorship_provided: 'Mentored 2 community members in systems thinking',
    community_contributions: ['shared-knowledge-post', 'helped-newcomer'],
    impact_demonstrations: ['community-garden-project']
  };
}

/**
 * GET /api/hoodies/earning/paths
 * Get available learning paths with hoodie earning opportunities
 */
export async function paths(request: NextRequest) {
  try {
    const { hoodies } = await fetchHoodieStockExchangeData();
    
    // Group hoodies by category to create learning paths
    const pathsMap = new Map();
    
    hoodies.forEach(hoodie => {
      const category = hoodie.category;
      if (!pathsMap.has(category)) {
        pathsMap.set(category, {
          id: category,
          name: getCategoryDisplayName(category),
          description: getCategoryDescription(category),
          hoodies: [],
          totalHoodies: 0,
          totalCredits: 0,
          icon: getCategoryIcon(category)
        });
      }
      
      const path = pathsMap.get(category);
      path.hoodies.push(hoodie);
      path.totalHoodies += 1;
      path.totalCredits += hoodie.imagination_credit_multiplier || 0;
    });

    const paths = Array.from(pathsMap.values());
    
    return NextResponse.json({ paths });

  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

function getCategoryDisplayName(category: string): string {
  const names = {
    transformation: 'Transformation & Joy',
    knowledge: 'Indigenous Knowledge Systems',
    community: 'Community Building',
    leadership: 'Leadership & Presidents',
    education: 'Educational Innovation',
    innovation: 'Embassy & Innovation',
    systems: 'Systems Change',
    stewardship: 'Custodial Stewardship',
    tools: 'Toolshed Mastery',
    imagination: 'IMAGI-NATION',
    general: 'General Learning'
  };
  return names[category as keyof typeof names] || category;
}

function getCategoryDescription(category: string): string {
  const descriptions = {
    transformation: 'Master joy-centered approaches to personal and organizational transformation',
    knowledge: 'Explore Indigenous Knowledge Systems and traditional wisdom',
    community: 'Build and strengthen community connections and support networks',
    leadership: 'Develop leadership skills for positive social impact',
    education: 'Innovate in educational approaches and learning systems',
    innovation: 'Drive innovation and creative problem-solving in your field',
    systems: 'Understand and influence complex systems for sustainable change',
    stewardship: 'Practice custodial stewardship of resources and knowledge',
    tools: 'Master practical tools and frameworks for impact',
    imagination: 'Engage with visionary thinking and imagination-centered practices',
    general: 'General learning and skill development'
  };
  return descriptions[category as keyof typeof descriptions] || 'Develop expertise in this area';
}

function getCategoryIcon(category: string): string {
  const icons = {
    transformation: '✨',
    knowledge: '📚',
    community: '🤝',
    leadership: '👑',
    education: '🎓',
    innovation: '💡',
    systems: '🔄',
    stewardship: '🛡️',
    tools: '🔧',
    imagination: '🌟',
    general: '🎯'
  };
  return icons[category as keyof typeof icons] || '🎯';
}