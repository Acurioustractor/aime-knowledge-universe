/**
 * Mentorship Matching Engine
 * 
 * Intelligent system for matching mentors with mentees based on expertise, goals, and compatibility
 */

import { 
  UserSession, 
  CommunityUserProfile, 
  MentorshipRelationship,
  enhancedContentRepository 
} from '@/lib/database/enhanced-supabase';

export interface MentorshipMatchRequest {
  sessionId: string;
  role: 'mentor' | 'mentee';
  expertiseDomains?: string[];
  learningGoals?: string[];
  meetingFrequency?: 'weekly' | 'biweekly' | 'monthly';
  expectedDuration?: number; // months
  communicationPreferences?: Record<string, any>;
  limit?: number;
}

export interface MentorProfile {
  sessionId: string;
  userSession: UserSession;
  communityProfile: CommunityUserProfile;
  expertiseDomains: string[];
  mentoringExperience: number;
  currentMentees: number;
  maxMentees: number;
  availability: string[];
  mentorshipStyle: string;
  successStories: string[];
}

export interface MenteeProfile {
  sessionId: string;
  userSession: UserSession;
  communityProfile: CommunityUserProfile;
  learningGoals: string[];
  currentChallenges: string[];
  preferredMentorType: string;
  commitmentLevel: number;
  previousMentorship: boolean;
}

export interface MentorshipMatch {
  mentor: MentorProfile;
  mentee: MenteeProfile;
  compatibilityScore: number;
  matchReasoning: string[];
  suggestedStructure: {
    meetingFrequency: string;
    duration: number;
    focusAreas: string[];
    milestones: string[];
  };
  potentialChallenges: string[];
  successPredictors: string[];
}

/**
 * Mentorship Matching Engine with intelligent pairing
 */
export class MentorshipEngine {

  /**
   * Find mentor matches for a mentee
   */
  async findMentorMatches(request: MentorshipMatchRequest): Promise<MentorshipMatch[]> {
    if (request.role !== 'mentee') {
      throw new Error('This method is for finding mentors for mentees');
    }

    console.log(`🎯 Finding mentor matches for session ${request.sessionId}`);

    // Get mentee profile
    const menteeProfile = await this.buildMenteeProfile(request.sessionId, request);
    
    // Get available mentors
    const availableMentors = await this.getAvailableMentors(request);
    
    // Calculate compatibility and create matches
    const matches: MentorshipMatch[] = [];
    
    for (const mentor of availableMentors) {
      const compatibilityScore = this.calculateMentorshipCompatibility(mentor, menteeProfile, request);
      
      if (compatibilityScore.score >= 0.4) {
        const match: MentorshipMatch = {
          mentor,
          mentee: menteeProfile,
          compatibilityScore: compatibilityScore.score,
          matchReasoning: compatibilityScore.reasoning,
          suggestedStructure: this.generateMentorshipStructure(mentor, menteeProfile, request),
          potentialChallenges: this.identifyPotentialChallenges(mentor, menteeProfile),
          successPredictors: this.identifySuccessPredictors(mentor, menteeProfile)
        };
        
        matches.push(match);
      }
    }

    // Sort by compatibility score and return top matches
    return matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, request.limit || 5);
  }

  /**
   * Find mentee matches for a mentor
   */
  async findMenteeMatches(request: MentorshipMatchRequest): Promise<MentorshipMatch[]> {
    if (request.role !== 'mentor') {
      throw new Error('This method is for finding mentees for mentors');
    }

    console.log(`🎯 Finding mentee matches for session ${request.sessionId}`);

    // Get mentor profile
    const mentorProfile = await this.buildMentorProfile(request.sessionId, request);
    
    // Get potential mentees
    const potentialMentees = await this.getPotentialMentees(request);
    
    // Calculate compatibility and create matches
    const matches: MentorshipMatch[] = [];
    
    for (const mentee of potentialMentees) {
      const compatibilityScore = this.calculateMentorshipCompatibility(mentorProfile, mentee, request);
      
      if (compatibilityScore.score >= 0.4) {
        const match: MentorshipMatch = {
          mentor: mentorProfile,
          mentee,
          compatibilityScore: compatibilityScore.score,
          matchReasoning: compatibilityScore.reasoning,
          suggestedStructure: this.generateMentorshipStructure(mentorProfile, mentee, request),
          potentialChallenges: this.identifyPotentialChallenges(mentorProfile, mentee),
          successPredictors: this.identifySuccessPredictors(mentorProfile, mentee)
        };
        
        matches.push(match);
      }
    }

    return matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, request.limit || 5);
  }

  /**
   * Create a mentorship relationship
   */
  async createMentorshipRelationship(
    mentorSessionId: string,
    menteeSessionId: string,
    structure: any
  ): Promise<MentorshipRelationship> {
    console.log(`🤝 Creating mentorship relationship: ${mentorSessionId} → ${menteeSessionId}`);

    const relationship: Omit<MentorshipRelationship, 'id' | 'start_date'> = {
      mentor_session_id: mentorSessionId,
      mentee_session_id: menteeSessionId,
      expertise_domains: structure.focusAreas || [],
      learning_goals: structure.milestones || [],
      meeting_frequency: structure.meetingFrequency || 'monthly',
      communication_preferences: {},
      expected_duration_months: structure.duration || 6,
      actual_end_date: undefined,
      goals_achieved: [],
      milestones_completed: [],
      wisdom_captured: [],
      satisfaction_mentor: undefined,
      satisfaction_mentee: undefined,
      relationship_strength: 0.5,
      status: 'pending'
    };

    return await enhancedContentRepository.createMentorshipRelationship(relationship);
  }

  /**
   * Build mentor profile from user data
   */
  private async buildMentorProfile(sessionId: string, request: MentorshipMatchRequest): Promise<MentorProfile> {
    const [userSession, communityProfile] = await Promise.all([
      enhancedContentRepository.getOrCreateUserSession(sessionId),
      enhancedContentRepository.getOrCreateCommunityProfile(sessionId)
    ]);

    // Get current mentorship relationships
    const currentMentorships = await enhancedContentRepository.getMentorshipRelationships(sessionId, 'mentor');
    const activeMentorships = currentMentorships.filter(m => m.status === 'active');

    return {
      sessionId,
      userSession,
      communityProfile,
      expertiseDomains: request.expertiseDomains || this.inferExpertiseDomains(userSession),
      mentoringExperience: this.calculateMentoringExperience(userSession, currentMentorships),
      currentMentees: activeMentorships.length,
      maxMentees: this.calculateMaxMentees(userSession, communityProfile),
      availability: this.extractAvailability(communityProfile),
      mentorshipStyle: this.inferMentorshipStyle(userSession, communityProfile),
      successStories: [] // Would be populated from past mentorships
    };
  }

  /**
   * Build mentee profile from user data
   */
  private async buildMenteeProfile(sessionId: string, request: MentorshipMatchRequest): Promise<MenteeProfile> {
    const [userSession, communityProfile] = await Promise.all([
      enhancedContentRepository.getOrCreateUserSession(sessionId),
      enhancedContentRepository.getOrCreateCommunityProfile(sessionId)
    ]);

    // Check for previous mentorship experience
    const pastMentorships = await enhancedContentRepository.getMentorshipRelationships(sessionId, 'mentee');

    return {
      sessionId,
      userSession,
      communityProfile,
      learningGoals: request.learningGoals || this.inferLearningGoals(userSession),
      currentChallenges: this.identifyCurrentChallenges(userSession),
      preferredMentorType: this.inferPreferredMentorType(userSession, communityProfile),
      commitmentLevel: this.assessCommitmentLevel(userSession, communityProfile),
      previousMentorship: pastMentorships.length > 0
    };
  }

  /**
   * Get available mentors
   */
  private async getAvailableMentors(request: MentorshipMatchRequest): Promise<MentorProfile[]> {
    // Get community profiles of users who want to mentor
    const { data: profiles, error } = await enhancedContentRepository.client
      .from('community_user_profiles_enhanced')
      .select('*')
      .contains('relationship_types', ['mentor'])
      .eq('profile_visibility', 'community');

    if (error || !profiles) {
      console.error('Error fetching potential mentors:', error);
      return [];
    }

    const mentors: MentorProfile[] = [];

    for (const profile of profiles) {
      // Skip if this is the requesting user
      if (profile.session_id === request.sessionId) continue;

      // Check if mentor has capacity
      const currentMentorships = await enhancedContentRepository.getMentorshipRelationships(profile.session_id, 'mentor');
      const activeMentorships = currentMentorships.filter(m => m.status === 'active');
      const maxMentees = this.calculateMaxMentees(profile, profile);

      if (activeMentorships.length >= maxMentees) continue;

      // Build mentor profile
      const mentorProfile: MentorProfile = {
        sessionId: profile.session_id,
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
        communityProfile: profile,
        expertiseDomains: this.inferExpertiseDomains(profile),
        mentoringExperience: this.calculateMentoringExperience(profile, currentMentorships),
        currentMentees: activeMentorships.length,
        maxMentees,
        availability: this.extractAvailability(profile),
        mentorshipStyle: this.inferMentorshipStyle(profile, profile),
        successStories: []
      };

      mentors.push(mentorProfile);
    }

    return mentors;
  }

  /**
   * Get potential mentees
   */
  private async getPotentialMentees(request: MentorshipMatchRequest): Promise<MenteeProfile[]> {
    // Get community profiles of users seeking mentorship
    const { data: profiles, error } = await enhancedContentRepository.client
      .from('community_user_profiles_enhanced')
      .select('*')
      .contains('relationship_types', ['mentee'])
      .eq('profile_visibility', 'community');

    if (error || !profiles) {
      console.error('Error fetching potential mentees:', error);
      return [];
    }

    const mentees: MenteeProfile[] = [];

    for (const profile of profiles) {
      // Skip if this is the requesting user
      if (profile.session_id === request.sessionId) continue;

      // Check if mentee is already in a mentorship
      const currentMentorships = await enhancedContentRepository.getMentorshipRelationships(profile.session_id, 'mentee');
      const activeMentorships = currentMentorships.filter(m => m.status === 'active');

      // Skip if already has an active mentor (for now, limit to 1:1)
      if (activeMentorships.length > 0) continue;

      const menteeProfile: MenteeProfile = {
        sessionId: profile.session_id,
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
        communityProfile: profile,
        learningGoals: this.inferLearningGoals(profile),
        currentChallenges: this.identifyCurrentChallenges(profile),
        preferredMentorType: this.inferPreferredMentorType(profile, profile),
        commitmentLevel: this.assessCommitmentLevel(profile, profile),
        previousMentorship: currentMentorships.length > 0
      };

      mentees.push(menteeProfile);
    }

    return mentees;
  }

  /**
   * Calculate mentorship compatibility
   */
  private calculateMentorshipCompatibility(
    mentor: MentorProfile,
    mentee: MenteeProfile,
    request: MentorshipMatchRequest
  ): { score: number; reasoning: string[] } {
    let score = 0;
    const reasoning: string[] = [];

    // 1. Expertise-Goal Alignment (40% weight)
    const expertiseAlignment = this.calculateExpertiseAlignment(mentor, mentee, reasoning);
    score += expertiseAlignment * 0.4;

    // 2. Experience Level Appropriateness (25% weight)
    const experienceMatch = this.calculateExperienceMatch(mentor, mentee, reasoning);
    score += experienceMatch * 0.25;

    // 3. Communication Style Compatibility (20% weight)
    const communicationFit = this.calculateCommunicationFit(mentor, mentee, reasoning);
    score += communicationFit * 0.2;

    // 4. Availability Alignment (10% weight)
    const availabilityMatch = this.calculateAvailabilityMatch(mentor, mentee, reasoning);
    score += availabilityMatch * 0.1;

    // 5. Cultural Compatibility (5% weight)
    const culturalFit = this.calculateCulturalFit(mentor, mentee, reasoning);
    score += culturalFit * 0.05;

    return {
      score: Math.min(score, 1.0),
      reasoning
    };
  }

  /**
   * Calculate expertise-goal alignment
   */
  private calculateExpertiseAlignment(mentor: MentorProfile, mentee: MenteeProfile, reasoning: string[]): number {
    const mentorExpertise = mentor.expertiseDomains.map(d => d.toLowerCase());
    const menteeGoals = mentee.learningGoals.map(g => g.toLowerCase());

    let alignmentScore = 0;
    let matchCount = 0;

    for (const goal of menteeGoals) {
      for (const expertise of mentorExpertise) {
        if (goal.includes(expertise) || expertise.includes(goal)) {
          alignmentScore += 1;
          matchCount++;
          break;
        }
      }
    }

    if (matchCount > 0) {
      const score = Math.min(alignmentScore / menteeGoals.length, 1.0);
      reasoning.push(`${matchCount} expertise-goal matches found`);
      return score;
    }

    // Check for philosophy domain alignment
    if (mentor.userSession.current_focus_domain === mentee.userSession.current_focus_domain) {
      reasoning.push('Shared philosophy domain focus');
      return 0.6;
    }

    // Check for interest overlap
    const sharedInterests = mentor.userSession.interests.filter(interest =>
      mentee.userSession.interests.includes(interest)
    );

    if (sharedInterests.length > 0) {
      reasoning.push(`${sharedInterests.length} shared interests`);
      return Math.min(sharedInterests.length / 3, 0.5);
    }

    return 0.1;
  }

  /**
   * Calculate experience level match
   */
  private calculateExperienceMatch(mentor: MentorProfile, mentee: MenteeProfile, reasoning: string[]): number {
    const experienceLevels = ['beginner', 'intermediate', 'advanced'];
    const mentorLevel = experienceLevels.indexOf(mentor.userSession.experience_level);
    const menteeLevel = experienceLevels.indexOf(mentee.userSession.experience_level);

    const levelDifference = mentorLevel - menteeLevel;

    if (levelDifference >= 1 && levelDifference <= 2) {
      reasoning.push(`Optimal experience gap: mentor is ${levelDifference} level${levelDifference > 1 ? 's' : ''} ahead`);
      return levelDifference === 1 ? 1.0 : 0.8;
    } else if (levelDifference === 0) {
      reasoning.push('Same experience level - peer mentoring opportunity');
      return 0.6;
    } else if (levelDifference < 0) {
      reasoning.push('Mentee has more experience - reverse mentoring potential');
      return 0.3;
    } else {
      reasoning.push('Large experience gap may be challenging');
      return 0.4;
    }
  }

  /**
   * Calculate communication style fit
   */
  private calculateCommunicationFit(mentor: MentorProfile, mentee: MenteeProfile, reasoning: string[]): number {
    const mentorStyle = mentor.communityProfile.communication_style;
    const menteeStyle = mentee.communityProfile.communication_style;

    if (mentorStyle === menteeStyle) {
      reasoning.push(`Matching communication styles: ${mentorStyle}`);
      return 1.0;
    } else if (mentorStyle === 'mixed' || menteeStyle === 'mixed') {
      reasoning.push('Flexible communication styles');
      return 0.8;
    } else {
      reasoning.push('Different communication styles - may need adjustment');
      return 0.5;
    }
  }

  /**
   * Calculate availability match
   */
  private calculateAvailabilityMatch(mentor: MentorProfile, mentee: MenteeProfile, reasoning: string[]): number {
    // Simplified availability matching
    // In a full implementation, this would analyze availability_windows
    reasoning.push('Availability analysis needed');
    return 0.7;
  }

  /**
   * Calculate cultural fit
   */
  private calculateCulturalFit(mentor: MentorProfile, mentee: MenteeProfile, reasoning: string[]): number {
    const mentorConsiderations = mentor.communityProfile.cultural_considerations || [];
    const menteeConsiderations = mentee.communityProfile.cultural_considerations || [];

    if (mentorConsiderations.length === 0 && menteeConsiderations.length === 0) {
      return 0.7; // Neutral
    }

    const sharedConsiderations = mentorConsiderations.filter(c =>
      menteeConsiderations.includes(c)
    );

    if (sharedConsiderations.length > 0) {
      reasoning.push('Shared cultural considerations');
      return 0.9;
    }

    return 0.6;
  }

  /**
   * Generate suggested mentorship structure
   */
  private generateMentorshipStructure(mentor: MentorProfile, mentee: MenteeProfile, request: MentorshipMatchRequest) {
    return {
      meetingFrequency: request.meetingFrequency || this.suggestMeetingFrequency(mentor, mentee),
      duration: request.expectedDuration || this.suggestDuration(mentor, mentee),
      focusAreas: this.suggestFocusAreas(mentor, mentee),
      milestones: this.suggestMilestones(mentor, mentee)
    };
  }

  /**
   * Helper methods for profile building
   */
  private inferExpertiseDomains(userSession: any): string[] {
    const domains = [];
    
    if (userSession.current_focus_domain) {
      domains.push(userSession.current_focus_domain);
    }
    
    // Add interests as potential expertise areas for experienced users
    if (userSession.experience_level === 'advanced') {
      domains.push(...userSession.interests.slice(0, 3));
    }
    
    return [...new Set(domains)];
  }

  private calculateMentoringExperience(userSession: any, mentorships: any[]): number {
    // Base experience on user level and past mentorships
    const experienceMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const baseExperience = experienceMap[userSession.experience_level as keyof typeof experienceMap] || 1;
    const mentorshipBonus = Math.min(mentorships.length * 0.5, 2);
    
    return baseExperience + mentorshipBonus;
  }

  private calculateMaxMentees(userSession: any, communityProfile: any): number {
    const engagementLevel = userSession.engagement_level || 1;
    const baseCapacity = Math.floor(engagementLevel * 1.5);
    return Math.max(1, Math.min(baseCapacity, 4)); // 1-4 mentees max
  }

  private extractAvailability(communityProfile: any): string[] {
    // Simplified - would analyze availability_windows in full implementation
    return ['flexible'];
  }

  private inferMentorshipStyle(userSession: any, communityProfile: any): string {
    const style = communityProfile.communication_style || 'mixed';
    const experience = userSession.experience_level;
    
    if (style === 'structured' && experience === 'advanced') return 'directive';
    if (style === 'casual') return 'collaborative';
    return 'adaptive';
  }

  private inferLearningGoals(userSession: any): string[] {
    const goals = [...userSession.goals];
    
    // Add domain-specific learning goals
    if (userSession.current_focus_domain) {
      goals.push(`Advance in ${userSession.current_focus_domain}`);
    }
    
    return goals.slice(0, 5);
  }

  private identifyCurrentChallenges(userSession: any): string[] {
    const challenges = [];
    
    if (userSession.experience_level === 'beginner') {
      challenges.push('Getting started', 'Building confidence');
    } else if (userSession.experience_level === 'intermediate') {
      challenges.push('Scaling impact', 'Overcoming obstacles');
    }
    
    return challenges;
  }

  private inferPreferredMentorType(userSession: any, communityProfile: any): string {
    if (communityProfile.communication_style === 'structured') return 'directive';
    if (userSession.experience_level === 'beginner') return 'supportive';
    return 'collaborative';
  }

  private assessCommitmentLevel(userSession: any, communityProfile: any): number {
    return Math.min(userSession.engagement_level || 1, 5);
  }

  private suggestMeetingFrequency(mentor: MentorProfile, mentee: MenteeProfile): string {
    if (mentee.userSession.experience_level === 'beginner') return 'weekly';
    if (mentor.currentMentees >= 2) return 'monthly';
    return 'biweekly';
  }

  private suggestDuration(mentor: MentorProfile, mentee: MenteeProfile): number {
    if (mentee.previousMentorship) return 4; // Shorter for experienced mentees
    if (mentee.userSession.experience_level === 'beginner') return 8; // Longer for beginners
    return 6; // Standard duration
  }

  private suggestFocusAreas(mentor: MentorProfile, mentee: MenteeProfile): string[] {
    const areas = [];
    
    // Find overlap between mentor expertise and mentee goals
    for (const expertise of mentor.expertiseDomains) {
      for (const goal of mentee.learningGoals) {
        if (goal.toLowerCase().includes(expertise.toLowerCase())) {
          areas.push(expertise);
          break;
        }
      }
    }
    
    // Add philosophy domain if shared
    if (mentor.userSession.current_focus_domain === mentee.userSession.current_focus_domain) {
      areas.push(mentor.userSession.current_focus_domain);
    }
    
    return [...new Set(areas)].slice(0, 3);
  }

  private suggestMilestones(mentor: MentorProfile, mentee: MenteeProfile): string[] {
    const milestones = [
      'Establish mentorship goals and expectations',
      'Complete initial assessment and planning',
      'Achieve first major learning objective',
      'Mid-point progress review and adjustment',
      'Complete final project or demonstration',
      'Transition to independent practice'
    ];
    
    return milestones.slice(0, 4);
  }

  private identifyPotentialChallenges(mentor: MentorProfile, mentee: MenteeProfile): string[] {
    const challenges = [];
    
    if (mentor.currentMentees >= 2) {
      challenges.push('Mentor has multiple mentees - may have limited availability');
    }
    
    if (mentor.communityProfile.communication_style !== mentee.communityProfile.communication_style) {
      challenges.push('Different communication styles may require adjustment period');
    }
    
    if (!mentee.previousMentorship) {
      challenges.push('Mentee is new to mentorship - may need extra guidance on process');
    }
    
    return challenges;
  }

  private identifySuccessPredictors(mentor: MentorProfile, mentee: MenteeProfile): string[] {
    const predictors = [];
    
    if (mentee.commitmentLevel >= 4) {
      predictors.push('High mentee commitment level');
    }
    
    if (mentor.mentoringExperience >= 3) {
      predictors.push('Experienced mentor with proven track record');
    }
    
    if (mentor.userSession.current_focus_domain === mentee.userSession.current_focus_domain) {
      predictors.push('Shared philosophy domain creates strong foundation');
    }
    
    return predictors;
  }
}

// Singleton instance
export const mentorshipEngine = new MentorshipEngine();