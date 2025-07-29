/**
 * Community Profile API
 * 
 * Manages community user profiles with preferences, privacy settings, and relationship history
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository, CommunityUserProfile } from '@/lib/database/enhanced-supabase';

export const dynamic = 'force-dynamic';

// GET /api/community/profile - Get community profile
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`👤 Fetching community profile for session ${sessionId}`);

    // Get or create community profile
    const profile = await enhancedContentRepository.getOrCreateCommunityProfile(sessionId);

    // Get user session for additional context
    const userSession = await enhancedContentRepository.getOrCreateUserSession(sessionId);

    // Get connection statistics
    const connections = await enhancedContentRepository.getUserConnections(sessionId);
    const connectionStats = {
      totalConnections: connections.length,
      peerConnections: connections.filter(c => c.connection_type === 'peer').length,
      mentorConnections: connections.filter(c => c.connection_type === 'mentor_mentee' && c.mentor_session_id !== sessionId).length,
      menteeConnections: connections.filter(c => c.connection_type === 'mentor_mentee' && c.mentor_session_id === sessionId).length,
      averageRelationshipStrength: connections.length > 0 
        ? connections.reduce((sum, c) => sum + c.relationship_strength, 0) / connections.length 
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        profile,
        userSession,
        connectionStats,
        lastUpdated: profile.updated_at
      }
    });

  } catch (error) {
    console.error('Community profile GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch community profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/community/profile - Create or update community profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, ...profileData } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`👤 Updating community profile for session ${sessionId}`);

    // Validate profile data
    const validationResult = validateProfileData(profileData);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid profile data',
        details: validationResult.errors
      }, { status: 400 });
    }

    // Check if profile exists
    let profile: CommunityUserProfile;
    try {
      profile = await enhancedContentRepository.getOrCreateCommunityProfile(sessionId);
      
      // Update existing profile
      profile = await enhancedContentRepository.updateCommunityProfile(sessionId, profileData);
      
    } catch (error) {
      // Create new profile
      profile = await enhancedContentRepository.getOrCreateCommunityProfile(sessionId, profileData);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        message: 'Community profile updated successfully'
      }
    });

  } catch (error) {
    console.error('Community profile POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update community profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/community/profile - Update specific profile fields
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, updates } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Updates are required'
      }, { status: 400 });
    }

    console.log(`👤 Updating community profile fields for session ${sessionId}`);

    // Validate updates
    const validationResult = validateProfileData(updates);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid update data',
        details: validationResult.errors
      }, { status: 400 });
    }

    // Update profile
    const profile = await enhancedContentRepository.updateCommunityProfile(sessionId, updates);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        updatedFields: Object.keys(updates),
        message: 'Profile updated successfully'
      }
    });

  } catch (error) {
    console.error('Community profile PUT error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile fields',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/community/profile - Delete community profile (privacy)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      }, { status: 400 });
    }

    console.log(`👤 Deleting community profile for session ${sessionId}`);

    // Set profile to private and remove personal information
    const privacyUpdates = {
      profile_visibility: 'private' as const,
      show_location: false,
      show_contact_info: false,
      allow_direct_messages: false,
      cultural_considerations: [],
      location_info: {}
    };

    await enhancedContentRepository.updateCommunityProfile(sessionId, privacyUpdates);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Community profile set to private and personal information removed'
      }
    });

  } catch (error) {
    console.error('Community profile DELETE error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete community profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Validate community profile data
 */
function validateProfileData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate geographic_scope
  if (data.geographic_scope && !['local', 'regional', 'global'].includes(data.geographic_scope)) {
    errors.push('geographic_scope must be one of: local, regional, global');
  }

  // Validate relationship_types
  if (data.relationship_types && Array.isArray(data.relationship_types)) {
    const validTypes = ['peer', 'mentor', 'mentee'];
    const invalidTypes = data.relationship_types.filter((type: string) => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      errors.push(`Invalid relationship_types: ${invalidTypes.join(', ')}`);
    }
  }

  // Validate communication_style
  if (data.communication_style && !['structured', 'casual', 'mixed'].includes(data.communication_style)) {
    errors.push('communication_style must be one of: structured, casual, mixed');
  }

  // Validate profile_visibility
  if (data.profile_visibility && !['private', 'connections', 'community', 'public'].includes(data.profile_visibility)) {
    errors.push('profile_visibility must be one of: private, connections, community, public');
  }

  // Validate availability_windows
  if (data.availability_windows && Array.isArray(data.availability_windows)) {
    for (const window of data.availability_windows) {
      if (!window.day_of_week || window.day_of_week < 0 || window.day_of_week > 6) {
        errors.push('availability_windows day_of_week must be between 0-6');
      }
      if (!window.start_time || !window.end_time) {
        errors.push('availability_windows must have start_time and end_time');
      }
    }
  }

  // Validate location_info
  if (data.location_info && typeof data.location_info === 'object') {
    if (data.location_info.coordinates) {
      const { latitude, longitude } = data.location_info.coordinates;
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        errors.push('location_info coordinates latitude must be between -90 and 90');
      }
      if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        errors.push('location_info coordinates longitude must be between -180 and 180');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}