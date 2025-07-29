/**
 * Community Cohorts API
 * 
 * Manages implementation cohorts, formation, membership, and collaborative tools
 */

import { NextRequest, NextResponse } from 'next/server';
import { cohortFormationEngine, CohortFormationRequest } from '@/lib/community/cohort-formation-engine';
import { enhancedContentRepository, ImplementationCohort } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// GET /api/community/cohorts - Get cohorts (all, by member, by domain, etc.)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const philosophyDomain = searchParams.get('philosophyDomain');
    const status = searchParams.get('status');
    const memberSessionId = searchParams.get('memberSessionId');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`🎯 Fetching cohorts with filters: domain=${philosophyDomain}, status=${status}, member=${memberSessionId}`);

    // Get cohorts based on filters
    const cohorts = await enhancedContentRepository.getImplementationCohorts({
      philosophyDomain: philosophyDomain || undefined,
      status: status || undefined,
      memberSessionId: memberSessionId || undefined,
      limit
    });

    // Get detailed information for each cohort
    const cohortsWithDetails = await Promise.all(
      cohorts.map(async (cohort) => {
        // Get cohort memberships
        const { data: memberships, error } = await enhancedContentRepository.client
          .from('cohort_memberships')
          .select(`
            *,
            user_sessions!inner(*)
          `)
          .eq('cohort_id', cohort.id)
          .eq('status', 'active');

        if (error) {
          console.error(`Error fetching memberships for cohort ${cohort.id}:`, error);
        }

        return {
          ...cohort,
          members: memberships || [],
          memberCount: memberships?.length || 0
        };
      })
    );

    // Calculate cohort statistics
    const cohortStats = {
      totalCohorts: cohorts.length,
      activeCohorts: cohorts.filter(c => c.status === 'active').length,
      formingCohorts: cohorts.filter(c => c.status === 'forming').length,
      completedCohorts: cohorts.filter(c => c.status === 'completed').length,
      averageSize: cohorts.length > 0 
        ? cohorts.reduce((sum, c) => sum + c.current_member_count, 0) / cohorts.length 
        : 0,
      philosophyDomains: [...new Set(cohorts.map(c => c.philosophy_domain))]
    };

    return NextResponse.json({
      success: true,
      data: {
        cohorts: cohortsWithDetails,
        cohortStats,
        filters: {
          philosophyDomain: philosophyDomain || 'all',
          status: status || 'all',
          memberSessionId: memberSessionId || null
        }
      }
    });

  } catch (error) {
    console.error('Community cohorts GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cohorts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/cohorts - Create new cohort or form cohort automatically
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'create' or 'form'
      sessionId,
      philosophyDomain,
      implementationGoal,
      preferredSize,
      maxSize,
      geographicScope,
      experienceLevel,
      startDate,
      durationWeeks,
      // For manual creation
      name,
      description,
      facilitatorSessionId
    } = body;

    if (!sessionId || !philosophyDomain || !implementationGoal) {
      return NextResponse.json({
        success: false,
        error: 'sessionId, philosophyDomain, and implementationGoal are required'
      }, { status: 400 });
    }

    console.log(`🎯 ${action === 'form' ? 'Forming' : 'Creating'} cohort for ${philosophyDomain}: ${implementationGoal}`);

    if (action === 'form') {
      // Use intelligent cohort formation
      const formationRequest: CohortFormationRequest = {
        philosophyDomain,
        implementationGoal,
        preferredSize: preferredSize || 6,
        maxSize: maxSize || 8,
        facilitatorSessionId: facilitatorSessionId || sessionId,
        geographicScope: geographicScope || 'global',
        experienceLevel: experienceLevel || 'mixed',
        startDate: startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to next week
        durationWeeks: durationWeeks || 12
      };

      try {
        const formationResult = await cohortFormationEngine.formCohort(formationRequest);

        // Track community impact
        await enhancedContentRepository.trackCommunityImpact({
          metric_type: 'community_milestone',
          session_id: sessionId,
          cohort_id: formationResult.cohort.id,
          metric_name: 'cohort_formed',
          metric_value: 1,
          metric_unit: 'cohorts',
          impact_description: `Formed implementation cohort: ${formationResult.cohort.name}`,
          evidence: { 
            memberCount: formationResult.selectedMembers.length,
            philosophyDomain,
            implementationGoal 
          },
          beneficiaries: formationResult.selectedMembers.map(m => m.sessionId),
          confidence_score: 1.0
        });

        return NextResponse.json({
          success: true,
          data: {
            cohort: formationResult.cohort,
            members: formationResult.selectedMembers,
            alternateMembers: formationResult.alternateMembers,
            formationReasoning: formationResult.formationReasoning,
            diversityAnalysis: formationResult.diversityAnalysis,
            message: 'Cohort formed successfully with intelligent member selection'
          }
        });

      } catch (error) {
        console.error('Cohort formation error:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to form cohort',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }

    } else {
      // Manual cohort creation
      const cohortData = {
        name: name || `${philosophyDomain} Implementation Cohort`,
        description: description || `Working together on: ${implementationGoal}`,
        philosophy_domain: philosophyDomain,
        implementation_goal: implementationGoal,
        max_members: maxSize || 8,
        current_member_count: 1, // Creator is first member
        facilitator_session_ids: facilitatorSessionId ? [facilitatorSessionId] : [sessionId],
        start_date: startDate,
        expected_duration_weeks: durationWeeks || 12,
        current_phase: 'formation' as const,
        shared_resources: [],
        milestones: [],
        meeting_schedule: {
          frequency: 'weekly' as const,
          duration_minutes: 90
        },
        status: 'forming' as const,
        completion_rate: 0
      };

      try {
        const cohort = await enhancedContentRepository.createImplementationCohort(cohortData);
        
        // Add creator as first member
        await enhancedContentRepository.joinCohort(cohort.id, sessionId, 'facilitator');

        return NextResponse.json({
          success: true,
          data: {
            cohort,
            message: 'Cohort created successfully. Invite others to join!'
          }
        });

      } catch (error) {
        console.error('Cohort creation error:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to create cohort',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('Community cohorts POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process cohort request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/cohorts - Update cohort or join/leave cohort
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // 'join', 'leave', 'update', 'advance_phase'
      cohortId,
      sessionId,
      role, // for joining
      updates // for updating
    } = body;

    if (!cohortId || !sessionId || !action) {
      return NextResponse.json({
        success: false,
        error: 'cohortId, sessionId, and action are required'
      }, { status: 400 });
    }

    console.log(`🎯 Cohort action: ${action} for cohort ${cohortId} by session ${sessionId}`);

    switch (action) {
      case 'join':
        try {
          const membership = await enhancedContentRepository.joinCohort(
            cohortId, 
            sessionId, 
            role || 'member'
          );

          // Track community impact
          await enhancedContentRepository.trackCommunityImpact({
            metric_type: 'community_milestone',
            session_id: sessionId,
            cohort_id: cohortId,
            metric_name: 'cohort_joined',
            metric_value: 1,
            metric_unit: 'cohorts',
            impact_description: `Joined implementation cohort as ${role || 'member'}`,
            evidence: { cohortId, role: role || 'member' },
            beneficiaries: [sessionId],
            confidence_score: 1.0
          });

          return NextResponse.json({
            success: true,
            data: {
              membership,
              message: 'Successfully joined cohort'
            }
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to join cohort',
            message: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 });
        }

      case 'leave':
        try {
          const { error } = await enhancedContentRepository.client
            .from('cohort_memberships')
            .update({ status: 'left' })
            .eq('cohort_id', cohortId)
            .eq('member_session_id', sessionId);

          if (error) throw error;

          // Update cohort member count
          const { data: cohort } = await enhancedContentRepository.client
            .from('implementation_cohorts')
            .select('current_member_count')
            .eq('id', cohortId)
            .single();

          if (cohort) {
            await enhancedContentRepository.client
              .from('implementation_cohorts')
              .update({ current_member_count: Math.max(0, cohort.current_member_count - 1) })
              .eq('id', cohortId);
          }

          return NextResponse.json({
            success: true,
            data: {
              message: 'Successfully left cohort'
            }
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to leave cohort',
            message: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 });
        }

      case 'update':
        if (!updates) {
          return NextResponse.json({
            success: false,
            error: 'Updates are required for update action'
          }, { status: 400 });
        }

        try {
          // Verify user has permission to update (facilitator or member)
          const { data: membership } = await enhancedContentRepository.client
            .from('cohort_memberships')
            .select('role')
            .eq('cohort_id', cohortId)
            .eq('member_session_id', sessionId)
            .eq('status', 'active')
            .single();

          if (!membership || (membership.role !== 'facilitator' && membership.role !== 'mentor')) {
            return NextResponse.json({
              success: false,
              error: 'Insufficient permissions to update cohort'
            }, { status: 403 });
          }

          const { data: updatedCohort, error } = await enhancedContentRepository.client
            .from('implementation_cohorts')
            .update(updates)
            .eq('id', cohortId)
            .select()
            .single();

          if (error) throw error;

          return NextResponse.json({
            success: true,
            data: {
              cohort: updatedCohort,
              message: 'Cohort updated successfully'
            }
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to update cohort',
            message: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 });
        }

      case 'advance_phase':
        try {
          // Get current cohort
          const { data: cohort } = await enhancedContentRepository.client
            .from('implementation_cohorts')
            .select('current_phase, status')
            .eq('id', cohortId)
            .single();

          if (!cohort) {
            return NextResponse.json({
              success: false,
              error: 'Cohort not found'
            }, { status: 404 });
          }

          // Determine next phase
          const phaseProgression = {
            'formation': 'orientation',
            'orientation': 'active',
            'active': 'completion',
            'completion': 'alumni'
          };

          const nextPhase = phaseProgression[cohort.current_phase as keyof typeof phaseProgression];
          const nextStatus = nextPhase === 'alumni' ? 'completed' : cohort.status;

          if (!nextPhase) {
            return NextResponse.json({
              success: false,
              error: 'Cannot advance from current phase'
            }, { status: 400 });
          }

          const { data: updatedCohort, error } = await enhancedContentRepository.client
            .from('implementation_cohorts')
            .update({ 
              current_phase: nextPhase,
              status: nextStatus
            })
            .eq('id', cohortId)
            .select()
            .single();

          if (error) throw error;

          // Track milestone
          await enhancedContentRepository.trackCommunityImpact({
            metric_type: 'community_milestone',
            session_id: sessionId,
            cohort_id: cohortId,
            metric_name: 'phase_advanced',
            metric_value: 1,
            metric_unit: 'phases',
            impact_description: `Advanced cohort to ${nextPhase} phase`,
            evidence: { previousPhase: cohort.current_phase, newPhase: nextPhase },
            beneficiaries: [sessionId],
            confidence_score: 1.0
          });

          return NextResponse.json({
            success: true,
            data: {
              cohort: updatedCohort,
              message: `Cohort advanced to ${nextPhase} phase`
            }
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'Failed to advance cohort phase',
            message: error instanceof Error ? error.message : 'Unknown error'
          }, { status: 500 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Community cohorts PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process cohort update',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/community/cohorts - Disband cohort (facilitator only)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cohortId = searchParams.get('cohortId');
    const sessionId = searchParams.get('sessionId');

    if (!cohortId || !sessionId) {
      return NextResponse.json({
        success: false,
        error: 'cohortId and sessionId are required'
      }, { status: 400 });
    }

    console.log(`🎯 Disbanding cohort ${cohortId}`);

    // Verify user is a facilitator
    const { data: membership } = await enhancedContentRepository.client
      .from('cohort_memberships')
      .select('role')
      .eq('cohort_id', cohortId)
      .eq('member_session_id', sessionId)
      .eq('status', 'active')
      .single();

    if (!membership || membership.role !== 'facilitator') {
      return NextResponse.json({
        success: false,
        error: 'Only facilitators can disband cohorts'
      }, { status: 403 });
    }

    // Update cohort status to disbanded
    const { error: cohortError } = await enhancedContentRepository.client
      .from('implementation_cohorts')
      .update({ status: 'disbanded' })
      .eq('id', cohortId);

    if (cohortError) throw cohortError;

    // Update all memberships to inactive
    const { error: membershipError } = await enhancedContentRepository.client
      .from('cohort_memberships')
      .update({ status: 'inactive' })
      .eq('cohort_id', cohortId);

    if (membershipError) throw membershipError;

    return NextResponse.json({
      success: true,
      data: {
        message: 'Cohort disbanded successfully'
      }
    });

  } catch (error) {
    console.error('Community cohorts DELETE error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to disband cohort',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}