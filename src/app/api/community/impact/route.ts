/**
 * Community Impact API
 * 
 * Manages impact tracking, milestones, stories, and recognition
 */

import { NextRequest, NextResponse } from 'next/server';
import { impactMeasurementSystem } from '@/lib/community/impact-measurement-system';

export const dynamic = 'force-dynamic';

// GET /api/community/impact - Get impact data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action'); // 'dashboard', 'health', 'stories', 'milestones'
    const sessionId = searchParams.get('sessionId');
    const communityId = searchParams.get('communityId');
    const scope = searchParams.get('scope') as 'personal' | 'community' | 'global';
    
    if (!sessionId && !communityId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID or Community ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'dashboard':
        if (!sessionId) {
          return NextResponse.json({
            success: false,
            error: 'Session ID is required for dashboard'
          }, { status: 400 });
        }

        console.log(`📊 Getting impact dashboard for ${sessionId}`);
        
        const dashboardData = await impactMeasurementSystem.getImpactDashboard(
          sessionId,
          scope || 'personal'
        );

        return NextResponse.json({
          success: true,
          data: dashboardData
        });

      case 'health':
        if (!communityId) {
          return NextResponse.json({
            success: false,
            error: 'Community ID is required for health report'
          }, { status: 400 });
        }

        console.log(`📈 Getting health report for community ${communityId}`);
        
        const period = searchParams.get('period') || 'last_30_days';
        const healthReport = await impactMeasurementSystem.generateCommunityHealthReport(
          communityId,
          period
        );

        return NextResponse.json({
          success: true,
          data: healthReport
        });

      case 'stories':
        console.log(`📖 Getting impact stories`);
        
        // Get featured impact stories (placeholder)
        const stories = [
          {
            id: 'story_1',
            title: 'Transforming Education Through Systems Thinking',
            storytellerSessionId: 'user_1',
            impactType: 'implementation_success',
            story: 'After participating in AIME philosophy circles, I implemented systems thinking approaches in my classroom...',
            beneficiaries: { direct: 30, indirect: 150, communities: ['school_district_1'] },
            lessonsLearned: [
              'Students respond well to holistic thinking approaches',
              'Cultural context is crucial for effective implementation',
              'Peer collaboration enhances learning outcomes'
            ],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            featuredStory: true
          },
          {
            id: 'story_2',
            title: 'Building Bridges Across Communities',
            storytellerSessionId: 'user_2',
            impactType: 'community_building',
            story: 'Through regional community initiatives, we connected Indigenous and non-Indigenous educators...',
            beneficiaries: { direct: 15, indirect: 200, communities: ['regional_1', 'regional_2'] },
            lessonsLearned: [
              'Cultural protocols create safe spaces for dialogue',
              'Shared stories build understanding and empathy',
              'Long-term relationships require ongoing commitment'
            ],
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            featuredStory: true
          }
        ];
        
        return NextResponse.json({
          success: true,
          data: {
            stories,
            totalStories: stories.length,
            featuredStories: stories.filter(s => s.featuredStory)
          }
        });

      case 'milestones':
        console.log(`🏆 Getting available milestones`);
        
        // Get available milestones (placeholder)
        const milestones = [
          {
            id: 'milestone_first_connection',
            title: 'First Connection',
            description: 'Made your first meaningful connection in the community',
            type: 'individual',
            category: 'collaboration',
            criteria: [
              { metricName: 'connection_formed', threshold: 1 }
            ],
            celebrationLevel: 'recognition',
            rewards: {
              badge: 'community_connector',
              title: 'Community Connector'
            }
          },
          {
            id: 'milestone_wisdom_sharer',
            title: 'Wisdom Sharer',
            description: 'Shared valuable insights with the community',
            type: 'individual',
            category: 'cultural_impact',
            criteria: [
              { metricName: 'wisdom_captured', threshold: 5 }
            ],
            celebrationLevel: 'celebration',
            rewards: {
              badge: 'wisdom_keeper',
              title: 'Wisdom Keeper',
              communityRecognition: true
            }
          },
          {
            id: 'milestone_implementation_champion',
            title: 'Implementation Champion',
            description: 'Successfully implemented AIME approaches in your context',
            type: 'individual',
            category: 'implementation',
            criteria: [
              { metricName: 'implementation_completed', threshold: 1 },
              { metricName: 'impact_story_shared', threshold: 1 }
            ],
            celebrationLevel: 'major_milestone',
            rewards: {
              badge: 'implementation_champion',
              title: 'Implementation Champion',
              privileges: ['featured_profile'],
              communityRecognition: true
            }
          }
        ];
        
        return NextResponse.json({
          success: true,
          data: {
            milestones,
            totalMilestones: milestones.length,
            categories: ['learning', 'implementation', 'mentorship', 'collaboration', 'leadership', 'cultural_impact']
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: dashboard, health, stories, or milestones'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Community impact GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process impact request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/impact - Track impact, create story, or create recognition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'track_impact', 'create_story', 'create_recognition'
      sessionId,
      impactData,
      storyData,
      recognitionData
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'track_impact':
        if (!impactData) {
          return NextResponse.json({
            success: false,
            error: 'Impact data is required'
          }, { status: 400 });
        }

        console.log(`📊 Tracking impact for ${sessionId}`);

        const impact = await impactMeasurementSystem.trackImpact(sessionId, impactData);

        return NextResponse.json({
          success: true,
          data: { impact },
          message: 'Impact tracked successfully'
        });

      case 'create_story':
        if (!storyData) {
          return NextResponse.json({
            success: false,
            error: 'Story data is required'
          }, { status: 400 });
        }

        console.log(`📖 Creating impact story for ${sessionId}`);

        const story = await impactMeasurementSystem.createImpactStory(sessionId, storyData);

        return NextResponse.json({
          success: true,
          data: { story },
          message: `Impact story "${story.title}" created successfully`
        });

      case 'create_recognition':
        if (!recognitionData) {
          return NextResponse.json({
            success: false,
            error: 'Recognition data is required'
          }, { status: 400 });
        }

        console.log(`🏅 Creating recognition for ${recognitionData.contributorSessionId}`);

        const recognition = await impactMeasurementSystem.createContributionRecognition(
          recognitionData.contributorSessionId,
          {
            ...recognitionData,
            recognizedBy: [sessionId] // Add nominator to recognizers
          }
        );

        return NextResponse.json({
          success: true,
          data: { recognition },
          message: 'Recognition created successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: track_impact, create_story, or create_recognition'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Community impact POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process impact request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/impact - Update story or recognition
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'update_story', 'feature_story', 'validate_impact'
      sessionId,
      storyId,
      impactId,
      updates
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'update_story':
        if (!storyId || !updates) {
          return NextResponse.json({
            success: false,
            error: 'Story ID and updates are required'
          }, { status: 400 });
        }

        console.log(`🔄 Updating story ${storyId}`);

        // Update story (placeholder)
        return NextResponse.json({
          success: true,
          data: { storyId, updates },
          message: 'Story updated successfully'
        });

      case 'feature_story':
        if (!storyId) {
          return NextResponse.json({
            success: false,
            error: 'Story ID is required'
          }, { status: 400 });
        }

        console.log(`⭐ Featuring story ${storyId}`);

        // Feature story (placeholder)
        return NextResponse.json({
          success: true,
          data: { storyId, featured: true },
          message: 'Story featured successfully'
        });

      case 'validate_impact':
        if (!impactId) {
          return NextResponse.json({
            success: false,
            error: 'Impact ID is required'
          }, { status: 400 });
        }

        console.log(`✅ Validating impact ${impactId}`);

        // Validate impact (placeholder)
        return NextResponse.json({
          success: true,
          data: { impactId, validated: true, validatedBy: sessionId },
          message: 'Impact validated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: update_story, feature_story, or validate_impact'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Community impact PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update impact data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}