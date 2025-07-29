/**
 * Cohort Formation Engine
 * 
 * Intelligent system for creating diverse but aligned implementation cohorts
 */

import { 
  UserSession, 
  CommunityUserProfile, 
  ImplementationCohort, 
  CohortMembership,
  enhancedContentRepository 
} from '@/lib/database/enhanced-supabase';

export interface CohortFormationRequest {
  philosophyDomain: string;
  implementationGoal: string;
  preferredSize?: number;
  maxSize?: number;
  facilitatorSessionId?: string;
  geographicScope?: 'local' | 'regional' | 'global';
  experienceLevel?: 'mixed' | 'beginner' | 'intermediate' | 'advanced';
  startDate?: string;
  durationWeeks?: number;
}

export interface CohortCandidate {
  sessionId: string;
  userSession: UserSession;
  communityProfile: CommunityUserProfile;
  alignmentScore: number;
  diversityContribution: number;
  availabilityMatch: number;
  reasoning: string[];
}

export interface CohortFormationResult {
  cohort: ImplementationCohort;
  selectedMembers: CohortCandidate[];
  alternateMembers: CohortCandidate[];
  formationReasoning: string;
  diversityAnalysis: {
    experienceLevels: Record<string, number>;
    geographicDistribution: Record<string, number>;
    roleDistribution: Record<string, number>;
    diversityScore: number;
  };
}

/**
 * Cohort Formation Engine with intelligent group composition
 */
export class CohortFormationEngine {

  /**
   * Form a new implementation cohort with optimal member selection
   */
  async formCohort(request: CohortFormationRequest): Promise<CohortFormationResult> {
    console.log(`🎯 Forming cohort for ${request.philosophyDomain}: ${request.implementationGoal}`);

    // Get potential cohort members
    const candidates = await this.getCohortCandidates(request);
    
    if (candidates.length < 3) {
      throw new Error('Insufficient candidates for cohort formation (minimum 3 required)');
    }

    // Select optimal cohort composition
    const selectedMembers = this.selectOptimalCohortMembers(candidates, request);
    
    // Create the cohort
    const cohort = await this.createCohort(request, selectedMembers);
    
    // Add members to cohort
    await this.addMembersToCohort(cohort.id, selectedMembers);
    
    // Generate formation analysis
    const diversityAnalysis = this.analyzeCohortDiversity(selectedMembers);
    const formationReasoning = this.generateFormationReasoning(selectedMembers, diversityAnalysis);
    
    // Get alternate members for potential expansion
    const alternateMembers = candidates
      .filter(candidate => !selectedMembers.find(member => member.sessionId === candidate.sessionId))
      .slice(0, 5);

    return {
      cohort,
      selectedMembers,
      alternateMembers,
      formationReasoning,
      diversityAnalysis
    };
  }

  /**
   * Get potential cohort candidates
   */
  private async getCohortCandidates(request: CohortFormationRequest): Promise<CohortCandidate[]> {
    // Get community profiles with user sessions
    const { data: profiles, error } = await enhancedContentRepository.client
      .from('community_user_profiles_enhanced')
      .select('*')
      .eq('profile_visibility', 'community'); // Only include users open to community

    if (error || !profiles) {
      console.error('Error fetching cohort candidates:', error);
      return [];
    }

    const candidates: CohortCandidate[] = [];

    for (const profile of profiles) {
      // Skip if user is already in too many active cohorts
      const existingCohorts = await enhancedContentRepository.getImplementationCohorts({
        memberSessionId: profile.session_id,
        status: 'active'
      });

      if (existingCohorts.length >= 2) {
        continue; // Skip users who are already in 2+ active cohorts
      }

      // Calculate alignment and diversity scores
      const alignmentScore = this.calculateAlignmentScore(profile, request);
      const diversityContribution = this.calculateDiversityContribution(profile, request);
      const availabilityMatch = this.calculateAvailabilityMatch(profile, request);

      // Only include candidates with minimum alignment
      if (alignmentScore >= 0.3) {
        const reasoning = this.generateCandidateReasoning(profile, alignmentScore, diversityContribution);

        candidates.push({
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
          alignmentScore,
          diversityContribution,
          availabilityMatch,
          reasoning
        });
      }
    }

    return candidates.sort((a, b) => 
      (b.alignmentScore * 0.6 + b.diversityContribution * 0.4) - 
      (a.alignmentScore * 0.6 + a.diversityContribution * 0.4)
    );
  }

  /**
   * Calculate how well a candidate aligns with cohort goals
   */
  private calculateAlignmentScore(profile: any, request: CohortFormationRequest): number {
    let score = 0;
    const reasons: string[] = [];

    // Philosophy domain alignment
    if (profile.current_focus_domain === request.philosophyDomain) {
      score += 0.4;
      reasons.push('Current focus matches cohort domain');
    } else if (profile.interests.includes(request.philosophyDomain)) {
      score += 0.2;
      reasons.push('Has interest in cohort domain');
    }

    // Goal alignment (simplified keyword matching)
    const goalKeywords = request.implementationGoal.toLowerCase().split(/\s+/);
    const userGoalText = profile.goals.join(' ').toLowerCase();
    const matchingKeywords = goalKeywords.filter(keyword => 
      keyword.length > 3 && userGoalText.includes(keyword)
    );

    if (matchingKeywords.length > 0) {
      score += (matchingKeywords.length / goalKeywords.length) * 0.3;
      reasons.push(`Goal alignment: ${matchingKeywords.length} matching themes`);
    }

    // Experience level appropriateness
    if (request.experienceLevel === 'mixed' || request.experienceLevel === profile.experience_level) {
      score += 0.2;
      reasons.push('Experience level fits cohort needs');
    }

    // Engagement level
    if (profile.engagement_level >= 3) {
      score += 0.1;
      reasons.push('High engagement level');
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate how much diversity a candidate would contribute
   */
  private calculateDiversityContribution(profile: any, request: CohortFormationRequest): number {
    let score = 0.5; // Base diversity score

    // Geographic diversity
    if (request.geographicScope === 'global' && profile.location_info?.country) {
      score += 0.2;
    }

    // Role diversity
    if (profile.user_role && ['educator', 'policymaker', 'community-leader', 'researcher'].includes(profile.user_role)) {
      score += 0.2;
    }

    // Learning style diversity
    if (profile.learning_style) {
      score += 0.1;
    }

    // Cultural considerations (adds richness to discussions)
    if (profile.cultural_considerations?.length > 0) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate availability match for cohort timing
   */
  private calculateAvailabilityMatch(profile: any, request: CohortFormationRequest): number {
    // For now, return a base score
    // In a full implementation, this would analyze availability_windows
    return 0.7;
  }

  /**
   * Select optimal cohort members using diversity and alignment
   */
  private selectOptimalCohortMembers(
    candidates: CohortCandidate[], 
    request: CohortFormationRequest
  ): CohortCandidate[] {
    const targetSize = request.preferredSize || 6;
    const maxSize = request.maxSize || 8;
    
    if (candidates.length <= targetSize) {
      return candidates;
    }

    const selected: CohortCandidate[] = [];
    const remaining = [...candidates];

    // First, select the highest alignment candidate
    const topCandidate = remaining.shift()!;
    selected.push(topCandidate);

    // Then select for diversity while maintaining alignment
    while (selected.length < targetSize && remaining.length > 0) {
      let bestCandidate: CohortCandidate | null = null;
      let bestScore = -1;

      for (const candidate of remaining) {
        // Calculate composite score considering current group composition
        const diversityBonus = this.calculateDiversityBonus(candidate, selected);
        const compositeScore = (candidate.alignmentScore * 0.6) + 
                              (candidate.diversityContribution * 0.3) + 
                              (diversityBonus * 0.1);

        if (compositeScore > bestScore) {
          bestScore = compositeScore;
          bestCandidate = candidate;
        }
      }

      if (bestCandidate) {
        selected.push(bestCandidate);
        const index = remaining.indexOf(bestCandidate);
        remaining.splice(index, 1);
      } else {
        break;
      }
    }

    return selected;
  }

  /**
   * Calculate diversity bonus based on current group composition
   */
  private calculateDiversityBonus(candidate: CohortCandidate, currentMembers: CohortCandidate[]): number {
    let bonus = 0;

    // Experience level diversity
    const experienceLevels = currentMembers.map(m => m.userSession.experience_level);
    if (!experienceLevels.includes(candidate.userSession.experience_level)) {
      bonus += 0.3;
    }

    // Role diversity
    const roles = currentMembers.map(m => m.userSession.user_role).filter(Boolean);
    if (candidate.userSession.user_role && !roles.includes(candidate.userSession.user_role)) {
      bonus += 0.3;
    }

    // Geographic diversity
    const countries = currentMembers.map(m => m.communityProfile.location_info?.country).filter(Boolean);
    if (candidate.communityProfile.location_info?.country && 
        !countries.includes(candidate.communityProfile.location_info.country)) {
      bonus += 0.2;
    }

    // Learning style diversity
    const learningStyles = currentMembers.map(m => m.userSession.learning_style).filter(Boolean);
    if (candidate.userSession.learning_style && 
        !learningStyles.includes(candidate.userSession.learning_style)) {
      bonus += 0.2;
    }

    return Math.min(bonus, 1.0);
  }

  /**
   * Create the cohort in the database
   */
  private async createCohort(
    request: CohortFormationRequest, 
    members: CohortCandidate[]
  ): Promise<ImplementationCohort> {
    const cohortData: Omit<ImplementationCohort, 'id' | 'created_at' | 'updated_at'> = {
      name: this.generateCohortName(request),
      description: `Implementation cohort focused on ${request.implementationGoal} within ${request.philosophyDomain}`,
      philosophy_domain: request.philosophyDomain,
      implementation_goal: request.implementationGoal,
      max_members: request.maxSize || 8,
      current_member_count: members.length,
      facilitator_session_ids: request.facilitatorSessionId ? [request.facilitatorSessionId] : [],
      start_date: request.startDate,
      expected_duration_weeks: request.durationWeeks || 12,
      current_phase: 'formation',
      shared_resources: [],
      milestones: this.generateDefaultMilestones(request),
      meeting_schedule: {
        frequency: 'weekly',
        duration_minutes: 90
      },
      status: 'forming',
      completion_rate: 0
    };

    return await enhancedContentRepository.createImplementationCohort(cohortData);
  }

  /**
   * Add selected members to the cohort
   */
  private async addMembersToCohort(cohortId: string, members: CohortCandidate[]): Promise<void> {
    for (const member of members) {
      try {
        await enhancedContentRepository.joinCohort(cohortId, member.sessionId, 'member');
        
        // Track community impact
        await enhancedContentRepository.trackCommunityImpact({
          metric_type: 'community_milestone',
          session_id: member.sessionId,
          cohort_id: cohortId,
          metric_name: 'cohort_joined',
          metric_value: 1,
          metric_unit: 'cohorts',
          impact_description: `Joined implementation cohort for ${member.userSession.current_focus_domain}`,
          evidence: { cohortId, role: 'member' },
          beneficiaries: [member.sessionId],
          confidence_score: 1.0
        });
      } catch (error) {
        console.error(`Error adding member ${member.sessionId} to cohort:`, error);
      }
    }
  }

  /**
   * Generate a meaningful cohort name
   */
  private generateCohortName(request: CohortFormationRequest): string {
    const domainNames = {
      'imagination-based-learning': 'Imagination Pioneers',
      'hoodie-economics': 'Relational Value Builders',
      'mentoring-systems': 'Mentorship Network Weavers'
    };

    const baseName = domainNames[request.philosophyDomain as keyof typeof domainNames] || 
                     `${request.philosophyDomain} Cohort`;
    
    const timestamp = new Date().toISOString().slice(0, 7); // YYYY-MM format
    return `${baseName} - ${timestamp}`;
  }

  /**
   * Generate default milestones for the cohort
   */
  private generateDefaultMilestones(request: CohortFormationRequest): any[] {
    const durationWeeks = request.durationWeeks || 12;
    const startDate = new Date(request.startDate || Date.now());

    return [
      {
        id: '1',
        title: 'Cohort Orientation Complete',
        description: 'All members introduced, goals aligned, and working agreements established',
        target_date: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completion_criteria: ['Member introductions', 'Goal setting', 'Working agreements'],
        status: 'pending'
      },
      {
        id: '2',
        title: 'Implementation Plan Developed',
        description: 'Detailed plan created for achieving the cohort implementation goal',
        target_date: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        completion_criteria: ['Implementation strategy', 'Resource identification', 'Timeline creation'],
        status: 'pending'
      },
      {
        id: '3',
        title: 'Mid-Point Progress Review',
        description: 'Assessment of progress and adjustment of plans as needed',
        target_date: new Date(startDate.getTime() + (durationWeeks / 2) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        completion_criteria: ['Progress assessment', 'Challenge identification', 'Plan adjustments'],
        status: 'pending'
      },
      {
        id: '4',
        title: 'Implementation Complete',
        description: 'Successfully implemented the cohort goal with measurable outcomes',
        target_date: new Date(startDate.getTime() + (durationWeeks - 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        completion_criteria: ['Goal achievement', 'Outcome measurement', 'Success documentation'],
        status: 'pending'
      }
    ];
  }

  /**
   * Analyze cohort diversity
   */
  private analyzeCohortDiversity(members: CohortCandidate[]): {
    experienceLevels: Record<string, number>;
    geographicDistribution: Record<string, number>;
    roleDistribution: Record<string, number>;
    diversityScore: number;
  } {
    const experienceLevels: Record<string, number> = {};
    const geographicDistribution: Record<string, number> = {};
    const roleDistribution: Record<string, number> = {};

    for (const member of members) {
      // Experience levels
      const experience = member.userSession.experience_level;
      experienceLevels[experience] = (experienceLevels[experience] || 0) + 1;

      // Geographic distribution
      const country = member.communityProfile.location_info?.country || 'Unknown';
      geographicDistribution[country] = (geographicDistribution[country] || 0) + 1;

      // Role distribution
      const role = member.userSession.user_role || 'Unknown';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    }

    // Calculate diversity score (higher is more diverse)
    const experienceDiversity = Object.keys(experienceLevels).length / 3; // Max 3 levels
    const geographicDiversity = Math.min(Object.keys(geographicDistribution).length / members.length, 1);
    const roleDiversity = Math.min(Object.keys(roleDistribution).length / members.length, 1);

    const diversityScore = (experienceDiversity + geographicDiversity + roleDiversity) / 3;

    return {
      experienceLevels,
      geographicDistribution,
      roleDistribution,
      diversityScore
    };
  }

  /**
   * Generate formation reasoning
   */
  private generateFormationReasoning(
    members: CohortCandidate[], 
    diversity: any
  ): string {
    const reasons: string[] = [];

    reasons.push(`Selected ${members.length} members with strong alignment to cohort goals`);
    
    if (diversity.diversityScore > 0.6) {
      reasons.push('Achieved high diversity across experience levels, roles, and geography');
    } else if (diversity.diversityScore > 0.4) {
      reasons.push('Balanced diversity with strong goal alignment');
    }

    const avgAlignment = members.reduce((sum, m) => sum + m.alignmentScore, 0) / members.length;
    reasons.push(`Average goal alignment: ${Math.round(avgAlignment * 100)}%`);

    const experienceLevels = Object.keys(diversity.experienceLevels);
    if (experienceLevels.length > 1) {
      reasons.push(`Mixed experience levels: ${experienceLevels.join(', ')}`);
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Generate candidate reasoning
   */
  private generateCandidateReasoning(
    profile: any, 
    alignmentScore: number, 
    diversityContribution: number
  ): string[] {
    const reasons: string[] = [];

    if (alignmentScore > 0.7) {
      reasons.push('Strong alignment with cohort goals');
    } else if (alignmentScore > 0.5) {
      reasons.push('Good alignment with cohort goals');
    } else {
      reasons.push('Moderate alignment with cohort goals');
    }

    if (diversityContribution > 0.7) {
      reasons.push('High diversity contribution');
    } else if (diversityContribution > 0.5) {
      reasons.push('Good diversity contribution');
    }

    if (profile.engagement_level >= 4) {
      reasons.push('High engagement level');
    }

    if (profile.cultural_considerations?.length > 0) {
      reasons.push('Brings cultural perspectives');
    }

    return reasons;
  }

  /**
   * Suggest cohort merging for small cohorts
   */
  async suggestCohortMerging(cohortId: string): Promise<{
    shouldMerge: boolean;
    suggestedCohorts: ImplementationCohort[];
    reasoning: string;
  }> {
    const cohort = await enhancedContentRepository.getImplementationCohorts({
      memberSessionId: cohortId
    });

    if (!cohort.length) {
      return { shouldMerge: false, suggestedCohorts: [], reasoning: 'Cohort not found' };
    }

    const currentCohort = cohort[0];
    
    if (currentCohort.current_member_count >= 4) {
      return { shouldMerge: false, suggestedCohorts: [], reasoning: 'Cohort has sufficient members' };
    }

    // Find compatible cohorts
    const compatibleCohorts = await enhancedContentRepository.getImplementationCohorts({
      philosophyDomain: currentCohort.philosophy_domain,
      status: 'forming'
    });

    const suggestedCohorts = compatibleCohorts.filter(c => 
      c.id !== currentCohort.id && 
      c.current_member_count < 6 &&
      c.current_member_count + currentCohort.current_member_count <= 8
    );

    return {
      shouldMerge: suggestedCohorts.length > 0,
      suggestedCohorts,
      reasoning: suggestedCohorts.length > 0 
        ? `Found ${suggestedCohorts.length} compatible cohorts for merging`
        : 'No compatible cohorts found for merging'
    };
  }
}

// Singleton instance
export const cohortFormationEngine = new CohortFormationEngine();