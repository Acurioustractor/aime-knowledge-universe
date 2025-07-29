/**
 * Regional Community API
 * 
 * Manages regional community assignment, governance, and activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { regionalCommunitySystem } from '@/lib/community/regional-community-system';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// GET /api/community/regional - Get regional community data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action'); // 'dashboard', 'communities', 'membership'
    const sessionId = searchParams.get('sessionId');
    const communityId = searchParams.get('communityId');
    
    if (!sessionId && !communityId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID or Community ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'dashboard':
        if (!communityId) {
          return NextResponse.json({
            success: false,
            error: 'Community ID is required for dashboard'
          }, { status: 400 });
        }

        console.log(`📊 Getting regional community dashboard for ${communityId}`);
        
        const dashboardData = await regionalCommunitySystem.getRegionalCommunityDashboard(
          communityId,
          sessionId || undefined
        );

        return NextResponse.json({
          success: true,
          data: dashboardData
        });

      case 'communities':
        console.log(`🌍 Getting available regional communities`);
        
        // Get all available communities (would be filtered by user preferences in real implementation)
        const communities = await regionalCommunitySystem['getAvailableRegionalCommunities']();
        
        return NextResponse.json({
          success: true,
          data: {
            communities,
            totalCommunities: communities.length,
            communitiesByStatus: {
              forming: communities.filter(c => c.status === 'forming').length,
              active: communities.filter(c => c.status === 'active').length,
              thriving: communities.filter(c => c.status === 'thriving').length,
              needs_support: communities.filter(c => c.status === 'needs_support').length
            }
          }
        });

      case 'membership':
        if (!sessionId) {
          return NextResponse.json({
            success: false,
            error: 'Session ID is required for membership info'
          }, { status: 400 });
        }

        console.log(`👥 Getting membership info for ${sessionId}`);
        
        // Get user's regional memberships (placeholder)
        const memberships = []; // Would query database in real implementation
        
        return NextResponse.json({
          success: true,
          data: {
            memberships,
            primaryCommunity: memberships[0] || null,
            totalCommunities: memberships.length
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: dashboard, communities, or membership'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Regional community GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process regional community request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/regional - Create or join regional community
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'assign', 'create_initiative', 'join_community'
      sessionId,
      locationPreferences,
      communityId,
      initiativeData
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'assign':
        if (!locationPreferences) {
          return NextResponse.json({
            success: false,
            error: 'Location preferences are required for assignment'
          }, { status: 400 });
        }

        console.log(`🌍 Assigning user ${sessionId} to regional community`);

        const assignmentResult = await regionalCommunitySystem.assignUserToRegionalCommunity(
          sessionId,
          locationPreferences
        );

        return NextResponse.json({
          success: true,
          data: assignmentResult,
          message: `Successfully assigned to ${assignmentResult.assignedCommunity.name}`
        });

      case 'create_initiative':
        if (!communityId || !initiativeData) {
          return NextResponse.json({
            success: false,
            error: 'Community ID and initiative data are required'
          }, { status: 400 });
        }

        console.log(`🚀 Creating initiative in community ${communityId}`);

        const initiative = await regionalCommunitySystem.createRegionalInitiative(
          communityId,
          sessionId,
          initiativeData
        );

        return NextResponse.json({
          success: true,
          data: { initiative },
          message: `Initiative "${initiative.title}" created successfully`
        });

      case 'join_community':
        if (!communityId) {
          return NextResponse.json({
            success: false,
            error: 'Community ID is required to join'
          }, { status: 400 });
        }

        console.log(`👥 User ${sessionId} joining community ${communityId}`);

        // Create membership (simplified)
        const membership = await regionalCommunitySystem['createRegionalMembership'](
          sessionId,
          communityId,
          { preferredScope: 'regional' }
        );

        return NextResponse.json({
          success: true,
          data: { membership },
          message: 'Successfully joined regional community'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: assign, create_initiative, or join_community'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Regional community POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process regional community request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/regional - Update regional community or membership
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'update_leadership', 'update_initiative', 'update_membership'
      sessionId,
      communityId,
      updates,
      electionResults,
      initiativeId,
      membershipId
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'update_leadership':
        if (!communityId || !electionResults) {
          return NextResponse.json({
            success: false,
            error: 'Community ID and election results are required'
          }, { status: 400 });
        }

        console.log(`🗳️ Updating leadership for community ${communityId}`);

        const governance = await regionalCommunitySystem.updateCommunityLeadership(
          communityId,
          electionResults
        );

        return NextResponse.json({
          success: true,
          data: { governance },
          message: 'Community leadership updated successfully'
        });

      case 'update_initiative':
        if (!initiativeId || !updates) {
          return NextResponse.json({
            success: false,
            error: 'Initiative ID and updates are required'
          }, { status: 400 });
        }

        console.log(`🔄 Updating initiative ${initiativeId}`);

        // Update initiative (placeholder)
        // In real implementation, would update database
        
        return NextResponse.json({
          success: true,
          data: { initiativeId, updates },
          message: 'Initiative updated successfully'
        });

      case 'update_membership':
        if (!membershipId || !updates) {
          return NextResponse.json({
            success: false,
            error: 'Membership ID and updates are required'
          }, { status: 400 });
        }

        console.log(`👤 Updating membership ${membershipId}`);

        // Update membership (placeholder)
        // In real implementation, would update database
        
        return NextResponse.json({
          success: true,
          data: { membershipId, updates },
          message: 'Membership updated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: update_leadership, update_initiative, or update_membership'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Regional community PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update regional community',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/community/regional - Leave community or remove initiative
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action'); // 'leave_community', 'remove_initiative'
    const sessionId = searchParams.get('sessionId');
    const communityId = searchParams.get('communityId');
    const initiativeId = searchParams.get('initiativeId');
    const membershipId = searchParams.get('membershipId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    switch (action) {
      case 'leave_community':
        if (!membershipId) {
          return NextResponse.json({
            success: false,
            error: 'Membership ID is required to leave community'
          }, { status: 400 });
        }

        console.log(`👋 User ${sessionId} leaving community via membership ${membershipId}`);

        // Remove membership (placeholder)
        // In real implementation, would update database to set status to 'inactive'
        
        return NextResponse.json({
          success: true,
          data: { membershipId },
          message: 'Successfully left regional community'
        });

      case 'remove_initiative':
        if (!initiativeId) {
          return NextResponse.json({
            success: false,
            error: 'Initiative ID is required to remove initiative'
          }, { status: 400 });
        }

        console.log(`🗑️ Removing initiative ${initiativeId}`);

        // Remove initiative (placeholder)
        // In real implementation, would update database to set status to 'cancelled'
        
        return NextResponse.json({
          success: true,
          data: { initiativeId },
          message: 'Initiative removed successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: leave_community or remove_initiative'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Regional community DELETE error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process regional community deletion',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}