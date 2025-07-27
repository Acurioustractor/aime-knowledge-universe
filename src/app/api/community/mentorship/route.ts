/**
 * Community Mentorship API
 * 
 * Manages mentor-mentee relationships, matching, and mentorship lifecycle
 */

import { NextRequest, NextResponse } from 'next/server';
import { mentorshipEngine, MentorshipMatchRequest } from '@/lib/community/mentorship-engine';
import { enhancedContentRepository, MentorshipRelationship } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// GET /api/community/mentorship - Get mentorship relationships or find matches
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action'); // 'relationships' or 'matches'
    const role = searchParams.get('role') as 'mentor' | 'mentee';
    const status = searchParams.get('status');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`🎯 Mentorship ${action || 'relationships'} request for session ${sessionId}`);

    if (action === 'matches') {
      // Find mentorship matches
      if (!role) {
        return NextResponse.json({
          success: false,
          error: 'Role (mentor or mentee) is required for finding matches'
        }, { status: 400 });
      }

      const matchRequest: MentorshipMatchRequest = {
        sessionId,
        role,
        limit: parseInt(searchParams.get('limit') || '5')
      };

      let matches;
      if (role === 'mentor') {
        matches = await mentorshipEngine.findMenteeMatches(matchRequest);
      } else {
        matches = await mentorshipEngine.findMentorMatches(matchRequest);
      }

      return NextResponse.json({
        success: true,
        data: {
          sessionId,
          role,
          matches,
          totalMatches: matches.length
        }
      });

    } else {
      // Get existing mentorship relationships
      const relationships = await enhancedContentRepository.getMentorshipRelationships(
        sessionId, 
        role
      );

      // Filter by status if specified
      const filteredRelationships = status 
        ? relationships.filter(r => r.status === status)
        : relationships;

      // Get detailed information for each relationship
      const relationshipsWithDetails = await Promise.all(
        filteredRelationships.map(async (relationship) => {
          const otherSessionId = relationship.mentor_session_id === sessionId 
            ? relationship.mentee_session_id 
            : relationship.mentor_session_id;

          try {
            const [otherUserSession, otherCommunityProfile] = await Promise.all([
              enhancedContentRepository.getOrCreateUserSession(otherSessionId),
              enhancedContentRepository.getOrCreateCommunityProfile(otherSessionId)
            ]);

            return {
              ...relationship,
              otherUser: {
                sessionId: otherSessionId,
                userSession: otherUserSession,
                communityProfile: otherCommunityProfile,
                role: relationship.mentor_session_id === sessionId ? 'mentee' : 'mentor'
              }
            };
          } catch (error) {
            console.error(`Error fetching details for user ${otherSessionId}:`, error);
            return {
              ...relationship,
              otherUser: null
            };
          }
        })
      );

      // Calculate mentorship statistics
      const mentorshipStats = {
        totalRelationships: filteredRelationships.length,
        activeRelationships: filteredRelationships.filter(r => r.status === 'active').length,
        completedRelationships: filteredRelationships.filter(r => r.status === 'completed').length,
        averageDuration: filteredRelationships.length > 0 
          ? filteredRelationships.reduce((sum, r) => sum + r.expected_duration_months, 0) / filteredRelationships.length 
          : 0,
        averageSatisfaction: this.calculateAverageSatisfaction(filteredRelationships, role)
      };

      return NextResponse.json({
        success: true,
        data: {
          sessionId,
          role: role || 'both',
          relationships: relationshipsWithDetails,
          mentorshipStats,
          filters: {
            status: status || 'all'
          }
        }
      });
    }

  } catch (error) {
    console.error('Community mentorship GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process mentorship request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/mentorship - Create mentorship relationship or request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'request' or 'create'
      mentorSessionId,
      menteeSessionId,
      sessionId, // requesting user
      expertiseDomains,
      learningGoals,
      meetingFrequency,
      expectedDuration,
      message
    } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`🤝 Mentorship ${action}: ${mentorSessionId} → ${menteeSessionId}`);

    if (action === 'request') {
      // Create mentorship request
      if (!mentorSessionId || !menteeSessionId) {
        return NextResponse.json({
          success: false,
          error: 'Both mentorSessionId and menteeSessionId are required'
        }, { status: 400 });
      }

      if (mentorSessionId === menteeSessionId) {
        return NextResponse.json({
          success: false,
          error: 'Cannot create mentorship with yourself'
        }, { status: 400 });
      }

      // Check if relationship already exists
      const existingRelationships = await enhancedContentRepository.getMentorshipRelationships(mentorSessionId, 'mentor');
      const existingRelationship = existingRelationships.find(r => 
        r.mentee_session_id === menteeSessionId && r.status !== 'ended'
      );

      if (existingRelationship) {
        return NextResponse.json({
          success: false,
          error: 'Mentorship relationship already exists',
          data: { existingRelationship }
        }, { status: 409 });
      }

      // Create the mentorship relationship
      const structure = {
        focusAreas: expertiseDomains || [],
        milestones: learningGoals || [],
        meetingFrequency: meetingFrequency || 'monthly',
        duration: expectedDuration || 6
      };

      const relationship = await mentorshipEngine.createMentorshipRelationship(
        mentorSessionId,
        menteeSessionId,
        structure
      );

      // Track community impact
      await enhancedContentRepository.trackCommunityImpact({
        metric_type: 'relationship_formed',
        session_id: sessionId,
        metric_name: 'mentorship_requested',
        metric_value: 1,
        metric_unit: 'relationships',
        impact_description: `Mentorship relationship requested between ${mentorSessionId} and ${menteeSessionId}`,
        evidence: { 
          mentorSessionId, 
          menteeSessionId, 
          expertiseDomains, 
          expectedDuration 
        },
        beneficiaries: [mentorSessionId, menteeSessionId],
        confidence_score: 0.9
      });

      return NextResponse.json({
        success: true,
        data: {
          relationship,
          message: 'Mentorship relationship created successfully',
          requiresAcceptance: relationship.status === 'pending'
        }
      });

    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Community mentorship POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create mentorship relationship',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/mentorship - Update mentorship relationship
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      relationshipId,
      sessionId,
      action, // 'accept', 'decline', 'complete', 'pause', 'update'
      updates,
      satisfactionRating,
      feedback,
      wisdomToCapture
    } = body;

    if (!relationshipId || !sessionId || !action) {
      return NextResponse.json({
        success: false,
        error: 'relationshipId, sessionId, and action are required'
      }, { status: 400 });
    }

    console.log(`🤝 Updating mentorship ${relationshipId} with action: ${action}`);

    // Get the relationship
    const { data: relationship, error: fetchError } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .select('*')
      .eq('id', relationshipId)
      .single();

    if (fetchError || !relationship) {
      return NextResponse.json({
        success: false,
        error: 'Mentorship relationship not found'
      }, { status: 404 });
    }

    // Verify user is part of this relationship
    if (relationship.mentor_session_id !== sessionId && relationship.mentee_session_id !== sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to modify this mentorship relationship'
      }, { status: 403 });
    }

    let updateData: Partial<MentorshipRelationship> = {};
    let responseMessage = '';

    switch (action) {
      case 'accept':
        if (relationship.status !== 'pending') {
          return NextResponse.json({
            success: false,
            error: 'Mentorship relationship is not pending'
          }, { status: 400 });
        }
        updateData = {
          status: 'active',
          relationship_strength: 0.6 // Boost upon acceptance
        };
        responseMessage = 'Mentorship relationship accepted successfully';
        break;

      case 'decline':
        if (relationship.status !== 'pending') {
          return NextResponse.json({
            success: false,
            error: 'Mentorship relationship is not pending'
          }, { status: 400 });
        }
        updateData = {
          status: 'ended'
        };
        responseMessage = 'Mentorship relationship declined';
        break;

      case 'complete':
        updateData = {
          status: 'completed',
          actual_end_date: new Date().toISOString()
        };
        
        // Add satisfaction rating if provided
        if (satisfactionRating) {
          const isMentor = relationship.mentor_session_id === sessionId;
          updateData[isMentor ? 'satisfaction_mentor' : 'satisfaction_mentee'] = satisfactionRating;
        }

        // Capture wisdom if provided
        if (wisdomToCapture) {
          updateData.wisdom_captured = [
            ...(relationship.wisdom_captured || []),
            wisdomToCapture
          ];
        }

        responseMessage = 'Mentorship relationship completed successfully';
        break;

      case 'pause':
        updateData = {
          status: 'paused'
        };
        responseMessage = 'Mentorship relationship paused';
        break;

      case 'update':
        if (!updates) {
          return NextResponse.json({
            success: false,
            error: 'Updates are required for update action'
          }, { status: 400 });
        }
        updateData = updates;
        responseMessage = 'Mentorship relationship updated';
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

    // Update the relationship
    const { data: updatedRelationship, error: updateError } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .update(updateData)
      .eq('id', relationshipId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating mentorship relationship:', updateError);
      throw updateError;
    }

    // Track community impact for significant actions
    if (['accept', 'complete'].includes(action)) {
      await enhancedContentRepository.trackCommunityImpact({
        metric_type: 'relationship_formed',
        session_id: sessionId,
        metric_name: `mentorship_${action}ed`,
        metric_value: 1,
        metric_unit: 'relationships',
        impact_description: `Mentorship relationship ${action}ed`,
        evidence: { 
          relationshipId, 
          action, 
          satisfactionRating,
          previousStatus: relationship.status 
        },
        beneficiaries: [relationship.mentor_session_id, relationship.mentee_session_id],
        confidence_score: 1.0
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        relationship: updatedRelationship,
        message: responseMessage,
        action
      }
    });

  } catch (error) {
    console.error('Community mentorship PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update mentorship relationship',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/community/mentorship - End mentorship relationship
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const relationshipId = searchParams.get('relationshipId');
    const sessionId = searchParams.get('sessionId');
    const reason = searchParams.get('reason');

    if (!relationshipId || !sessionId) {
      return NextResponse.json({
        success: false,
        error: 'relationshipId and sessionId are required'
      }, { status: 400 });
    }

    console.log(`🤝 Ending mentorship relationship ${relationshipId}`);

    // Get the relationship to verify ownership
    const { data: relationship, error: fetchError } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .select('*')
      .eq('id', relationshipId)
      .single();

    if (fetchError || !relationship) {
      return NextResponse.json({
        success: false,
        error: 'Mentorship relationship not found'
      }, { status: 404 });
    }

    // Verify user is part of this relationship
    if (relationship.mentor_session_id !== sessionId && relationship.mentee_session_id !== sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to end this mentorship relationship'
      }, { status: 403 });
    }

    // End the relationship
    const { error: updateError } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .update({ 
        status: 'ended',
        actual_end_date: new Date().toISOString()
      })
      .eq('id', relationshipId);

    if (updateError) {
      console.error('Error ending mentorship relationship:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Mentorship relationship ended successfully',
        relationshipId,
        reason: reason || 'Not specified'
      }
    });

  } catch (error) {
    console.error('Community mentorship DELETE error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to end mentorship relationship',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Helper function to calculate average satisfaction
 */
function calculateAverageSatisfaction(relationships: MentorshipRelationship[], role?: string): number {
  const completedRelationships = relationships.filter(r => r.status === 'completed');
  
  if (completedRelationships.length === 0) return 0;

  let totalSatisfaction = 0;
  let count = 0;

  for (const relationship of completedRelationships) {
    if (!role || role === 'mentor') {
      if (relationship.satisfaction_mentor) {
        totalSatisfaction += relationship.satisfaction_mentor;
        count++;
      }
    }
    if (!role || role === 'mentee') {
      if (relationship.satisfaction_mentee) {
        totalSatisfaction += relationship.satisfaction_mentee;
        count++;
      }
    }
  }

  return count > 0 ? totalSatisfaction / count : 0;
}