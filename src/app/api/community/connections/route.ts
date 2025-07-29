/**
 * Community Connections API
 * 
 * Manages user connections, relationship tracking, and connection requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository, UserConnection } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// GET /api/community/connections - Get user connections
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const connectionType = searchParams.get('connectionType');
    const status = searchParams.get('status') || 'active';

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`🤝 Fetching connections for session ${sessionId}`);

    // Get user connections
    const connections = await enhancedContentRepository.getUserConnections(sessionId, connectionType || undefined);

    // Filter by status if specified
    const filteredConnections = status === 'all' 
      ? connections 
      : connections.filter(conn => conn.status === status);

    // Get detailed information for each connection
    const connectionsWithDetails = await Promise.all(
      filteredConnections.map(async (connection) => {
        // Determine which session ID is the connected user
        const connectedSessionId = connection.user_session_id === sessionId 
          ? connection.connected_session_id 
          : connection.user_session_id;

        // Get connected user's session and profile
        try {
          const [connectedUserSession, connectedUserProfile] = await Promise.all([
            enhancedContentRepository.getOrCreateUserSession(connectedSessionId),
            enhancedContentRepository.getOrCreateCommunityProfile(connectedSessionId)
          ]);

          return {
            ...connection,
            connectedUser: {
              sessionId: connectedSessionId,
              userSession: connectedUserSession,
              communityProfile: connectedUserProfile
            }
          };
        } catch (error) {
          console.error(`Error fetching details for connected user ${connectedSessionId}:`, error);
          return {
            ...connection,
            connectedUser: null
          };
        }
      })
    );

    // Calculate connection statistics
    const connectionStats = {
      totalConnections: filteredConnections.length,
      activeConnections: filteredConnections.filter(c => c.status === 'active').length,
      pendingConnections: filteredConnections.filter(c => c.status === 'pending').length,
      connectionTypes: {
        peer: filteredConnections.filter(c => c.connection_type === 'peer').length,
        mentor: filteredConnections.filter(c => c.connection_type === 'mentor_mentee' && c.mentor_session_id !== sessionId).length,
        mentee: filteredConnections.filter(c => c.connection_type === 'mentor_mentee' && c.mentor_session_id === sessionId).length,
        cohort: filteredConnections.filter(c => c.connection_type === 'cohort_member').length,
        regional: filteredConnections.filter(c => c.connection_type === 'regional_community').length
      },
      averageStrength: filteredConnections.length > 0 
        ? filteredConnections.reduce((sum, c) => sum + c.relationship_strength, 0) / filteredConnections.length 
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        connections: connectionsWithDetails,
        connectionStats,
        filters: {
          connectionType: connectionType || 'all',
          status
        }
      }
    });

  } catch (error) {
    console.error('Community connections GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch connections',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/connections - Create new connection or connection request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userSessionId,
      connectedSessionId,
      connectionType,
      connectionReason,
      message
    } = body;

    if (!userSessionId || !connectedSessionId) {
      return NextResponse.json({
        success: false,
        error: 'Both userSessionId and connectedSessionId are required'
      }, { status: 400 });
    }

    if (userSessionId === connectedSessionId) {
      return NextResponse.json({
        success: false,
        error: 'Cannot connect to yourself'
      }, { status: 400 });
    }

    console.log(`🤝 Creating connection between ${userSessionId} and ${connectedSessionId}`);

    // Check if connection already exists
    const existingConnections = await enhancedContentRepository.getUserConnections(userSessionId);
    const existingConnection = existingConnections.find(conn => 
      (conn.user_session_id === userSessionId && conn.connected_session_id === connectedSessionId) ||
      (conn.user_session_id === connectedSessionId && conn.connected_session_id === userSessionId)
    );

    if (existingConnection) {
      return NextResponse.json({
        success: false,
        error: 'Connection already exists',
        data: { existingConnection }
      }, { status: 409 });
    }

    // Get both users' profiles to determine connection details
    const [userProfile, connectedProfile] = await Promise.all([
      enhancedContentRepository.getOrCreateCommunityProfile(userSessionId),
      enhancedContentRepository.getOrCreateCommunityProfile(connectedSessionId)
    ]);

    // Check if connected user allows direct messages
    if (!connectedProfile.allow_direct_messages) {
      return NextResponse.json({
        success: false,
        error: 'User does not accept direct connection requests'
      }, { status: 403 });
    }

    // Determine shared interests
    const [userSession, connectedUserSession] = await Promise.all([
      enhancedContentRepository.getOrCreateUserSession(userSessionId),
      enhancedContentRepository.getOrCreateUserSession(connectedSessionId)
    ]);

    const sharedInterests = userSession.interests.filter(interest => 
      connectedUserSession.interests.includes(interest)
    );

    // Create connection
    const newConnection: Omit<UserConnection, 'id' | 'connection_date'> = {
      user_session_id: userSessionId,
      connected_session_id: connectedSessionId,
      connection_type: connectionType || 'peer',
      relationship_strength: 0.3, // Initial strength
      connection_reason: connectionReason || 'Direct connection request',
      shared_interests: sharedInterests,
      mutual_connections: 0, // Will be calculated later
      last_interaction: new Date().toISOString(),
      interaction_count: 1,
      message_count: message ? 1 : 0,
      mentor_session_id: connectionType === 'mentor_mentee' ? userSessionId : undefined,
      status: 'pending' // Requires acceptance
    };

    const connection = await enhancedContentRepository.createUserConnection(newConnection);

    // Track community impact
    await enhancedContentRepository.trackCommunityImpact({
      metric_type: 'relationship_formed',
      session_id: userSessionId,
      metric_name: 'connection_request_sent',
      metric_value: 1,
      metric_unit: 'requests',
      impact_description: `Connection request sent to ${connectedSessionId}`,
      evidence: { connectionType, connectionReason },
      beneficiaries: [userSessionId, connectedSessionId],
      confidence_score: 0.9
    });

    return NextResponse.json({
      success: true,
      data: {
        connection,
        message: 'Connection request sent successfully',
        requiresAcceptance: true
      }
    });

  } catch (error) {
    console.error('Community connections POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create connection',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/connections - Update connection (accept, decline, update strength)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      connectionId,
      sessionId,
      action, // 'accept', 'decline', 'update_strength', 'end'
      relationshipStrength,
      notes
    } = body;

    if (!connectionId || !sessionId || !action) {
      return NextResponse.json({
        success: false,
        error: 'connectionId, sessionId, and action are required'
      }, { status: 400 });
    }

    console.log(`🤝 Updating connection ${connectionId} with action: ${action}`);

    // Get the connection
    const { data: connection, error: fetchError } = await enhancedContentRepository.client
      .from('user_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (fetchError || !connection) {
      return NextResponse.json({
        success: false,
        error: 'Connection not found'
      }, { status: 404 });
    }

    // Verify user is part of this connection
    if (connection.user_session_id !== sessionId && connection.connected_session_id !== sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to modify this connection'
      }, { status: 403 });
    }

    let updateData: Partial<UserConnection> = {};
    let responseMessage = '';

    switch (action) {
      case 'accept':
        if (connection.status !== 'pending') {
          return NextResponse.json({
            success: false,
            error: 'Connection is not pending'
          }, { status: 400 });
        }
        updateData = {
          status: 'active',
          relationship_strength: 0.5, // Boost initial strength upon acceptance
          last_interaction: new Date().toISOString(),
          interaction_count: connection.interaction_count + 1
        };
        responseMessage = 'Connection accepted successfully';
        break;

      case 'decline':
        if (connection.status !== 'pending') {
          return NextResponse.json({
            success: false,
            error: 'Connection is not pending'
          }, { status: 400 });
        }
        updateData = {
          status: 'ended'
        };
        responseMessage = 'Connection declined';
        break;

      case 'update_strength':
        if (typeof relationshipStrength !== 'number' || relationshipStrength < 0 || relationshipStrength > 1) {
          return NextResponse.json({
            success: false,
            error: 'relationshipStrength must be a number between 0 and 1'
          }, { status: 400 });
        }
        updateData = {
          relationship_strength: relationshipStrength,
          last_interaction: new Date().toISOString(),
          interaction_count: connection.interaction_count + 1
        };
        responseMessage = 'Relationship strength updated';
        break;

      case 'end':
        updateData = {
          status: 'ended'
        };
        responseMessage = 'Connection ended';
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

    // Update the connection
    const { data: updatedConnection, error: updateError } = await enhancedContentRepository.client
      .from('user_connections')
      .update(updateData)
      .eq('id', connectionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating connection:', updateError);
      throw updateError;
    }

    // Track community impact for accepted connections
    if (action === 'accept') {
      await enhancedContentRepository.trackCommunityImpact({
        metric_type: 'relationship_formed',
        session_id: sessionId,
        metric_name: 'connection_accepted',
        metric_value: 1,
        metric_unit: 'connections',
        impact_description: `Connection accepted with ${connection.user_session_id === sessionId ? connection.connected_session_id : connection.user_session_id}`,
        evidence: { connectionType: connection.connection_type, previousStatus: connection.status },
        beneficiaries: [connection.user_session_id, connection.connected_session_id],
        confidence_score: 1.0
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        connection: updatedConnection,
        message: responseMessage,
        action
      }
    });

  } catch (error) {
    console.error('Community connections PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update connection',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/community/connections - Remove connection
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const connectionId = searchParams.get('connectionId');
    const sessionId = searchParams.get('sessionId');

    if (!connectionId || !sessionId) {
      return NextResponse.json({
        success: false,
        error: 'connectionId and sessionId are required'
      }, { status: 400 });
    }

    console.log(`🤝 Removing connection ${connectionId}`);

    // Get the connection to verify ownership
    const { data: connection, error: fetchError } = await enhancedContentRepository.client
      .from('user_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (fetchError || !connection) {
      return NextResponse.json({
        success: false,
        error: 'Connection not found'
      }, { status: 404 });
    }

    // Verify user is part of this connection
    if (connection.user_session_id !== sessionId && connection.connected_session_id !== sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized to remove this connection'
      }, { status: 403 });
    }

    // Soft delete by setting status to 'ended'
    const { error: updateError } = await enhancedContentRepository.client
      .from('user_connections')
      .update({ status: 'ended' })
      .eq('id', connectionId);

    if (updateError) {
      console.error('Error removing connection:', updateError);
      throw updateError;
    }

    // Update connection counts
    await Promise.all([
      enhancedContentRepository['updateConnectionCounts'](connection.user_session_id),
      enhancedContentRepository['updateConnectionCounts'](connection.connected_session_id)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Connection removed successfully',
        connectionId
      }
    });

  } catch (error) {
    console.error('Community connections DELETE error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to remove connection',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}