/**
 * Community Matching Engine
 * 
 * AI-powered system for connecting users based on compatibility, shared goals, and complementary skills
 */

import { UserSession, CommunityUserProfile, enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface CompatibilityScore {
  philosophyAlignment: number;    // 0-1 based on shared domains
  goalCompatibility: number;      // 0-1 based on learning objectives
  experienceComplement: number;   // 0-1 based on skill gaps/expertise
  culturalFit: number;           // 0-1 based on communication style
  geographicPreference: number;   // 0-1 based on location preferences
  overallScore: number;          // Weighted combination
  reasoning: string[];           // Explanation of match factors
}

export interface UserMatchSuggestion {
  sessionId: string;
  userSession: UserSession;
  communityProfile: CommunityUserProfile;
  compatibilityScore: CompatibilityScore;
  suggestedConnectionType: 'peer' | 'mentor' | 'mentee';
  sharedInterests: string[];
  complementarySkills: string[];
  mutualConnections: string[];
}

export interface MatchingRequest {
  sessionId: string;
  connectionTypes?: ('peer' | 'mentor' | 'mentee')[];
  philosophyDomains?: string[];
  geographicScope?: 'local' | 'regional' | 'global';
  experienceLevel?: string;
  limit?: number;
  excludeSessionIds?: string[];
}

/**
 * Community Matching Engine with intelligent compatibility scoring
 */
export class CommunityMatchingEngine {
  
  /**
   * Generate user match suggestions based on compatibility
   */
  async generateMatchSuggestions(request: MatchingRequest): Promise<UserMatchSuggestion[]> {
    console.log(`🎯 Generating match suggestions for session ${request.sessionId}`);

    // Get the requesting user's profile and session
    const [userSession, userProfile] = await Promise.all([
      enhancedContentRepository.getOrCreateUserSession(request.sessionId),
      enhancedContentRepository.getOrCreateCommunityProfile(request.sessionId)
    ]);

    // Get potential matches
    const candidateUsers = await this.getCandidateUsers(request, userProfile);
    
    // Calculate compatibility scores for each candidate
    const matchSuggestions: UserMatchSuggestion[] = [];
    
    for (const candidate of candidateUsers) {
      const compatibilityScore = await this.calculateCompatibilityScore(
        userSession,
        userProfile,
        candidate.userSession,
        candidate.communityProfile
      );

      // Only include matches above minimum threshold
      if (compatibilityScore.overallScore >= 0.3) {
        const suggestion: UserMatchSuggestion = {
          sessionId: candidate.userSession.session_id,
          userSession: candidate.userSession,
          communityProfile: candidate.communityProfile,
          compatibilityScore,
          suggestedConnectionType: this.determineSuggestedConnectionType(
            userSession,
            candidate.userSession,
            compatibilityScore
          ),
          sharedInterests: this.findSharedInterests(userSession, candidate.userSession),
          complementarySkills: this.findComplementarySkills(userSession, candidate.userSession),
          mutualConnections: await this.findMutualConnections(
            userSession.session_id,
            candidate.userSession.session_id
          )
        };

        matchSuggestions.push(suggestion);
      }
    }

    // Sort by compatibility score and return top matches
    return matchSuggestions
      .sort((a, b) => b.compatibilityScore.overallScore - a.compatibilityScore.overallScore)
      .slice(0, request.limit || 10);
  }

  /**
   * Get candidate users for matching
   */
  private async getCandidateUsers(
    request: MatchingRequest,
    userProfile: CommunityUserProfile
  ): Promise<Array<{ userSession: UserSession; communityProfile: CommunityUserProfile }>> {
    // Get all community profiles with their user sessions
    const { data: profiles, error } = await enhancedContentRepository.client
      .from('community_user_profiles_enhanced')
      .select('*')
      .neq('session_id', request.sessionId)
      .eq('profile_visibility', 'community'); // Only include users open to community connections

    if (error) {
      console.error('Error fetching candidate users:', error);
      return [];
    }

    if (!profiles) return [];

    // Filter based on request criteria
    let candidates = profiles;

    // Geographic scope filtering
    if (userProfile.geographic_scope !== 'global') {
      candidates = candidates.filter(profile => {
        if (userProfile.geographic_scope === 'local') {
          return profile.location_info?.city === userProfile.location_info?.city;
        } else if (userProfile.geographic_scope === 'regional') {
          return profile.location_info?.region === userProfile.location_info?.region ||
                 profile.location_info?.country === userProfile.location_info?.country;
        }
        return true;
      });
    }

    // Philosophy domain filtering
    if (request.philosophyDomains?.length) {
      candidates = candidates.filter(profile => 
        request.philosophyDomains!.some(domain => 
          profile.current_focus_domain === domain ||
          profile.interests.includes(domain)
        )
      );
    }

    // Exclude specified session IDs
    if (request.excludeSessionIds?.length) {
      candidates = candidates.filter(profile => 
        !request.excludeSessionIds!.includes(profile.session_id)
      );
    }

    // Convert to required format
    return candidates.map(profile => ({
      userSession: {
        id: profile.id,
        session_id: profile.session_id,
        user_role: profile.user_role,
        interests: profile.interests,
        current_focus_domain: profile.current_focus_domain,
        engagement_level: profile.engagement_level,
        learning_style: profile.learning_style,
        experience_level: profile.experience_level,
        goals: profile.goals,
        preferred_complexity: profile.preferred_complexity,
        last_active: profile.last_active,
        created_at: profile.created_at
      },
      communityProfile: profile
    }));
  }

  /**
   * Calculate compatibility score between two users
   */
  private async calculateCompatibilityScore(
    user1Session: UserSession,
    user1Profile: CommunityUserProfile,
    user2Session: UserSession,
    user2Profile: CommunityUserProfile
  ): Promise<CompatibilityScore> {
    const reasoning: string[] = [];

    // 1. Philosophy Domain Alignment (30% weight)
    const philosophyAlignment = this.calculatePhilosophyAlignment(
      user1Session,
      user2Session,
      reasoning
    );

    // 2. Goal Compatibility (25% weight)
    const goalCompatibility = this.calculateGoalCompatibility(
      user1Session,
      user2Session,
      reasoning
    );

    // 3. Experience Complement (20% weight)
    const experienceComplement = this.calculateExperienceComplement(
      user1Session,
      user2Session,
      reasoning
    );

    // 4. Cultural Fit (15% weight)
    const culturalFit = this.calculateCulturalFit(
      user1Profile,
      user2Profile,
      reasoning
    );

    // 5. Geographic Preference (10% weight)
    const geographicPreference = this.calculateGeographicPreference(
      user1Profile,
      user2Profile,
      reasoning
    );

    // Calculate weighted overall score
    const overallScore = (
      philosophyAlignment * 0.30 +
      goalCompatibility * 0.25 +
      experienceComplement * 0.20 +
      culturalFit * 0.15 +
      geographicPreference * 0.10
    );

    return {
      philosophyAlignment,
      goalCompatibility,
      experienceComplement,
      culturalFit,
      geographicPreference,
      overallScore: Math.min(overallScore, 1.0),
      reasoning
    };
  }

  /**
   * Calculate philosophy domain alignment
   */
  private calculatePhilosophyAlignment(
    user1: UserSession,
    user2: UserSession,
    reasoning: string[]
  ): number {
    let score = 0;

    // Same current focus domain
    if (user1.current_focus_domain && user1.current_focus_domain === user2.current_focus_domain) {
      score += 0.5;
      reasoning.push(`Both focused on ${user1.current_focus_domain}`);
    }

    // Shared interests
    const sharedInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    if (sharedInterests.length > 0) {
      const interestOverlap = sharedInterests.length / Math.max(user1.interests.length, user2.interests.length);
      score += interestOverlap * 0.5;
      reasoning.push(`${Math.round(interestOverlap * 100)}% interest overlap: ${sharedInterests.slice(0, 3).join(', ')}`);
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate goal compatibility
   */
  private calculateGoalCompatibility(
    user1: UserSession,
    user2: UserSession,
    reasoning: string[]
  ): number {
    let score = 0;

    // Similar experience levels can work well together
    const experienceLevels = ['beginner', 'intermediate', 'advanced'];
    const user1Level = experienceLevels.indexOf(user1.experience_level);
    const user2Level = experienceLevels.indexOf(user2.experience_level);
    const levelDiff = Math.abs(user1Level - user2Level);

    if (levelDiff === 0) {
      score += 0.4;
      reasoning.push('Same experience level for peer learning');
    } else if (levelDiff === 1) {
      score += 0.6;
      reasoning.push('Complementary experience levels for mentoring');
    }

    // Similar complexity preferences
    const complexityDiff = Math.abs(user1.preferred_complexity - user2.preferred_complexity);
    if (complexityDiff <= 1) {
      score += 0.3;
      reasoning.push('Compatible complexity preferences');
    }

    // Shared goal themes (simplified analysis)
    const user1GoalWords = user1.goals.join(' ').toLowerCase().split(/\s+/);
    const user2GoalWords = user2.goals.join(' ').toLowerCase().split(/\s+/);
    const sharedGoalWords = user1GoalWords.filter(word => 
      word.length > 3 && user2GoalWords.includes(word)
    );

    if (sharedGoalWords.length > 0) {
      score += 0.3;
      reasoning.push('Shared goal themes identified');
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate experience complement
   */
  private calculateExperienceComplement(
    user1: UserSession,
    user2: UserSession,
    reasoning: string[]
  ): number {
    let score = 0;

    // Different but complementary experience levels
    const experienceLevels = ['beginner', 'intermediate', 'advanced'];
    const user1Level = experienceLevels.indexOf(user1.experience_level);
    const user2Level = experienceLevels.indexOf(user2.experience_level);
    const levelDiff = Math.abs(user1Level - user2Level);

    if (levelDiff === 1) {
      score += 0.6;
      reasoning.push('Complementary experience levels for mutual learning');
    } else if (levelDiff === 0) {
      score += 0.4;
      reasoning.push('Same experience level for peer support');
    }

    // Different learning styles can complement each other
    if (user1.learning_style && user2.learning_style && user1.learning_style !== user2.learning_style) {
      score += 0.2;
      reasoning.push('Different learning styles for diverse perspectives');
    }

    // Different roles can be complementary
    if (user1.user_role && user2.user_role && user1.user_role !== user2.user_role) {
      score += 0.2;
      reasoning.push('Different professional roles for cross-sector learning');
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate cultural fit
   */
  private calculateCulturalFit(
    user1Profile: CommunityUserProfile,
    user2Profile: CommunityUserProfile,
    reasoning: string[]
  ): number {
    let score = 0.5; // Default neutral score

    // Communication style compatibility
    if (user1Profile.communication_style === user2Profile.communication_style) {
      score += 0.3;
      reasoning.push(`Both prefer ${user1Profile.communication_style} communication`);
    } else if (user1Profile.communication_style === 'mixed' || user2Profile.communication_style === 'mixed') {
      score += 0.2;
      reasoning.push('Flexible communication styles');
    }

    // Cultural considerations overlap
    const sharedCulturalConsiderations = user1Profile.cultural_considerations.filter(consideration =>
      user2Profile.cultural_considerations.includes(consideration)
    );

    if (sharedCulturalConsiderations.length > 0) {
      score += 0.2;
      reasoning.push('Shared cultural considerations');
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate geographic preference
   */
  private calculateGeographicPreference(
    user1Profile: CommunityUserProfile,
    user2Profile: CommunityUserProfile,
    reasoning: string[]
  ): number {
    let score = 0.5; // Default score for global connections

    // If both prefer local connections
    if (user1Profile.geographic_scope === 'local' && user2Profile.geographic_scope === 'local') {
      if (user1Profile.location_info?.city === user2Profile.location_info?.city) {
        score = 1.0;
        reasoning.push('Same city for local connection preference');
      } else {
        score = 0.2;
        reasoning.push('Different cities but both prefer local connections');
      }
    }
    // If both prefer regional connections
    else if (user1Profile.geographic_scope === 'regional' && user2Profile.geographic_scope === 'regional') {
      if (user1Profile.location_info?.region === user2Profile.location_info?.region ||
          user1Profile.location_info?.country === user2Profile.location_info?.country) {
        score = 0.8;
        reasoning.push('Same region for regional connection preference');
      } else {
        score = 0.3;
        reasoning.push('Different regions but both prefer regional connections');
      }
    }
    // If both are open to global connections
    else if (user1Profile.geographic_scope === 'global' || user2Profile.geographic_scope === 'global') {
      score = 0.7;
      reasoning.push('Global connection compatibility');
    }

    return score;
  }

  /**
   * Determine suggested connection type
   */
  private determineSuggestedConnectionType(
    user1: UserSession,
    user2: UserSession,
    compatibility: CompatibilityScore
  ): 'peer' | 'mentor' | 'mentee' {
    const experienceLevels = ['beginner', 'intermediate', 'advanced'];
    const user1Level = experienceLevels.indexOf(user1.experience_level);
    const user2Level = experienceLevels.indexOf(user2.experience_level);

    // If user2 has significantly more experience, suggest user2 as mentor
    if (user2Level > user1Level + 1) {
      return 'mentor';
    }
    // If user1 has significantly more experience, suggest user1 as mentor (user2 as mentee)
    else if (user1Level > user2Level + 1) {
      return 'mentee';
    }
    // Otherwise, suggest peer relationship
    else {
      return 'peer';
    }
  }

  /**
   * Find shared interests between users
   */
  private findSharedInterests(user1: UserSession, user2: UserSession): string[] {
    return user1.interests.filter(interest => user2.interests.includes(interest));
  }

  /**
   * Find complementary skills between users
   */
  private findComplementarySkills(user1: UserSession, user2: UserSession): string[] {
    // This is a simplified implementation
    // In a real system, you'd have more sophisticated skill analysis
    const complementarySkills: string[] = [];

    // Different experience levels suggest complementary skills
    if (user1.experience_level !== user2.experience_level) {
      complementarySkills.push('Experience level complement');
    }

    // Different roles suggest complementary skills
    if (user1.user_role && user2.user_role && user1.user_role !== user2.user_role) {
      complementarySkills.push(`${user1.user_role} + ${user2.user_role} perspective`);
    }

    // Different learning styles
    if (user1.learning_style && user2.learning_style && user1.learning_style !== user2.learning_style) {
      complementarySkills.push('Diverse learning approaches');
    }

    return complementarySkills;
  }

  /**
   * Find mutual connections between users
   */
  private async findMutualConnections(sessionId1: string, sessionId2: string): Promise<string[]> {
    try {
      // Get connections for both users
      const [user1Connections, user2Connections] = await Promise.all([
        enhancedContentRepository.getUserConnections(sessionId1),
        enhancedContentRepository.getUserConnections(sessionId2)
      ]);

      // Find mutual connections
      const user1ConnectedIds = user1Connections.map(conn => 
        conn.user_session_id === sessionId1 ? conn.connected_session_id : conn.user_session_id
      );
      
      const user2ConnectedIds = user2Connections.map(conn => 
        conn.user_session_id === sessionId2 ? conn.connected_session_id : conn.user_session_id
      );

      return user1ConnectedIds.filter(id => user2ConnectedIds.includes(id));
    } catch (error) {
      console.error('Error finding mutual connections:', error);
      return [];
    }
  }

  /**
   * Explain match reasoning in human-readable format
   */
  generateMatchExplanation(suggestion: UserMatchSuggestion): string {
    const { compatibilityScore, sharedInterests, complementarySkills } = suggestion;
    
    let explanation = `${Math.round(compatibilityScore.overallScore * 100)}% compatibility match. `;
    
    if (sharedInterests.length > 0) {
      explanation += `You both share interests in ${sharedInterests.slice(0, 3).join(', ')}. `;
    }
    
    if (complementarySkills.length > 0) {
      explanation += `Your complementary skills include ${complementarySkills.slice(0, 2).join(' and ')}. `;
    }
    
    if (compatibilityScore.reasoning.length > 0) {
      explanation += compatibilityScore.reasoning.slice(0, 2).join('. ') + '.';
    }
    
    return explanation;
  }
}

// Singleton instance
export const communityMatchingEngine = new CommunityMatchingEngine();