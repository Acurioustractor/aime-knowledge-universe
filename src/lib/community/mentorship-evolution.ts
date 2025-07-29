/**
 * Mentorship Relationship Evolution System
 * 
 * Manages the natural progression from mentee to peer to mentor and tracks relationship lifecycle
 */

import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';
import { mentorshipFramework, MentorshipGoal } from './mentorship-framework';

export interface MentorshipProgression {
  sessionId: string;
  currentRole: 'mentee' | 'peer' | 'mentor' | 'senior_mentor';
  progressionScore: number; // 0-1
  readinessIndicators: {
    knowledgeAcquisition: number;
    practicalApplication: number;
    wisdomSharing: number;
    communityContribution: number;
    leadershipDemonstration: number;
  };
  nextMilestone: {
    targetRole: 'peer' | 'mentor' | 'senior_mentor';
    requirements: string[];
    estimatedTimeframe: string;
    supportNeeded: string[];
  };
  progressionHistory: ProgressionEvent[];
}

export interface ProgressionEvent {
  id: string;
  sessionId: string;
  eventType: 'role_transition' | 'milestone_achieved' | 'skill_demonstrated' | 'recognition_earned';
  fromRole?: string;
  toRole?: string;
  description: string;
  evidence: any;
  timestamp: string;
  impactScore: number;
}

export interface MentorshipTransition {
  id: string;
  relationshipId: string;
  mentorSessionId: string;
  menteeSessionId: string;
  transitionType: 'completion' | 'peer_transition' | 'reverse_mentoring' | 'collaborative_partnership';
  transitionDate: string;
  continuedConnectionType?: 'alumni_network' | 'peer_support' | 'project_collaboration' | 'friendship';
  transitionPlan: {
    finalReflections: string[];
    achievementsRecognized: string[];
    futureGoals: string[];
    connectionMaintenance: string;
  };
  impactSummary: MentorshipImpactSummary;
}

export interface MentorshipImpactSummary {
  relationshipId: string;
  duration: number; // days
  goalsAchieved: number;
  milestonesCompleted: number;
  wisdomInsightsShared: number;
  skillsAcquired: string[];
  communityContributions: string[];
  menteeGrowthScore: number; // 0-1
  mentorSatisfaction: number; // 0-1
  menteeSatisfaction: number; // 0-1
  relationshipStrengthFinal: number; // 0-1
  readyForNextLevel: boolean;
  successStory?: string;
}

export interface MentorshipSuccessStory {
  id: string;
  relationshipId: string;
  mentorSessionId: string;
  menteeSessionId: string;
  title: string;
  story: string;
  keyLearnings: string[];
  impactAchieved: string[];
  inspirationalQuotes: string[];
  publiclyVisible: boolean;
  createdAt: string;
  tags: string[];
  category: 'transformation' | 'innovation' | 'leadership' | 'community_impact';
}

/**
 * Mentorship Relationship Evolution System
 */
export class MentorshipEvolution {

  /**
   * Assess mentorship progression for a user
   */
  async assessMentorshipProgression(sessionId: string): Promise<MentorshipProgression> {
    console.log(`📈 Assessing mentorship progression for ${sessionId}`);

    // Get user's mentorship history
    const [mentorships, menteeships] = await Promise.all([
      enhancedContentRepository.getMentorshipRelationships(sessionId, 'mentor'),
      enhancedContentRepository.getMentorshipRelationships(sessionId, 'mentee')
    ]);

    // Calculate readiness indicators
    const readinessIndicators = await this.calculateReadinessIndicators(
      sessionId,
      mentorships,
      menteeships
    );

    // Determine current role
    const currentRole = this.determineCurrentRole(mentorships, menteeships, readinessIndicators);

    // Calculate overall progression score
    const progressionScore = this.calculateProgressionScore(readinessIndicators);

    // Determine next milestone
    const nextMilestone = this.determineNextMilestone(currentRole, readinessIndicators);

    // Get progression history
    const progressionHistory = await this.getProgressionHistory(sessionId);

    return {
      sessionId,
      currentRole,
      progressionScore,
      readinessIndicators,
      nextMilestone,
      progressionHistory
    };
  }

  /**
   * Calculate readiness indicators for progression
   */
  private async calculateReadinessIndicators(
    sessionId: string,
    mentorships: any[],
    menteeships: any[]
  ): Promise<MentorshipProgression['readinessIndicators']> {
    
    // Knowledge Acquisition (based on completed menteeships and goals)
    const completedMenteeships = menteeships.filter(m => m.status === 'completed');
    const knowledgeAcquisition = Math.min(completedMenteeships.length * 0.3, 1.0);

    // Practical Application (based on goal achievement and milestones)
    const totalGoalsAchieved = menteeships.reduce((sum, m) => 
      sum + (m.goals_achieved?.length || 0), 0
    );
    const practicalApplication = Math.min(totalGoalsAchieved * 0.1, 1.0);

    // Wisdom Sharing (based on insights shared with community)
    const totalWisdomShared = [...mentorships, ...menteeships].reduce((sum, m) => 
      sum + (m.wisdom_captured?.length || 0), 0
    );
    const wisdomSharing = Math.min(totalWisdomShared * 0.05, 1.0);

    // Community Contribution (based on community impact metrics)
    const communityImpacts = await this.getCommunityImpacts(sessionId);
    const communityContribution = Math.min(communityImpacts.length * 0.1, 1.0);

    // Leadership Demonstration (based on successful mentorships)
    const successfulMentorships = mentorships.filter(m => 
      m.status === 'completed' && (m.satisfaction_mentee || 0) >= 0.8
    );
    const leadershipDemonstration = Math.min(successfulMentorships.length * 0.25, 1.0);

    return {
      knowledgeAcquisition,
      practicalApplication,
      wisdomSharing,
      communityContribution,
      leadershipDemonstration
    };
  }

  /**
   * Determine current role based on experience and indicators
   */
  private determineCurrentRole(
    mentorships: any[],
    menteeships: any[],
    indicators: MentorshipProgression['readinessIndicators']
  ): MentorshipProgression['currentRole'] {
    
    const activeMentorships = mentorships.filter(m => m.status === 'active').length;
    const completedMentorships = mentorships.filter(m => m.status === 'completed').length;
    const completedMenteeships = menteeships.filter(m => m.status === 'completed').length;

    // Senior Mentor: 5+ completed mentorships, high leadership score
    if (completedMentorships >= 5 && indicators.leadershipDemonstration >= 0.8) {
      return 'senior_mentor';
    }

    // Mentor: 1+ completed mentorships or high readiness scores
    if (completedMentorships >= 1 || 
        (indicators.knowledgeAcquisition >= 0.7 && indicators.practicalApplication >= 0.7)) {
      return 'mentor';
    }

    // Peer: Completed menteeships and showing leadership potential
    if (completedMenteeships >= 1 && indicators.wisdomSharing >= 0.5) {
      return 'peer';
    }

    // Default to mentee
    return 'mentee';
  }

  /**
   * Calculate overall progression score
   */
  private calculateProgressionScore(indicators: MentorshipProgression['readinessIndicators']): number {
    const weights = {
      knowledgeAcquisition: 0.25,
      practicalApplication: 0.25,
      wisdomSharing: 0.20,
      communityContribution: 0.15,
      leadershipDemonstration: 0.15
    };

    return (
      indicators.knowledgeAcquisition * weights.knowledgeAcquisition +
      indicators.practicalApplication * weights.practicalApplication +
      indicators.wisdomSharing * weights.wisdomSharing +
      indicators.communityContribution * weights.communityContribution +
      indicators.leadershipDemonstration * weights.leadershipDemonstration
    );
  }

  /**
   * Determine next milestone for progression
   */
  private determineNextMilestone(
    currentRole: MentorshipProgression['currentRole'],
    indicators: MentorshipProgression['readinessIndicators']
  ): MentorshipProgression['nextMilestone'] {
    
    switch (currentRole) {
      case 'mentee':
        return {
          targetRole: 'peer',
          requirements: [
            'Complete at least one mentorship relationship',
            'Achieve 70% of your learning goals',
            'Share insights with the community',
            'Demonstrate practical application of learned concepts'
          ],
          estimatedTimeframe: '3-6 months',
          supportNeeded: [
            'Continue active mentorship engagement',
            'Focus on goal achievement',
            'Start sharing wisdom insights'
          ]
        };

      case 'peer':
        return {
          targetRole: 'mentor',
          requirements: [
            'Demonstrate expertise in at least one domain',
            'Show consistent wisdom sharing',
            'Complete mentor training resources',
            'Express willingness to guide others'
          ],
          estimatedTimeframe: '6-12 months',
          supportNeeded: [
            'Complete mentor training program',
            'Connect with experienced mentors',
            'Start informal mentoring activities'
          ]
        };

      case 'mentor':
        return {
          targetRole: 'senior_mentor',
          requirements: [
            'Successfully complete 5+ mentorship relationships',
            'Demonstrate exceptional mentoring skills',
            'Contribute to mentor training and development',
            'Show community leadership'
          ],
          estimatedTimeframe: '12-24 months',
          supportNeeded: [
            'Take on challenging mentoring cases',
            'Contribute to mentor development programs',
            'Lead community initiatives'
          ]
        };

      default:
        return {
          targetRole: 'senior_mentor',
          requirements: ['Continue excellence in mentoring and community leadership'],
          estimatedTimeframe: 'Ongoing',
          supportNeeded: ['Focus on community impact and mentor development']
        };
    }
  }

  /**
   * Create mentorship transition when relationship evolves
   */
  async createMentorshipTransition(
    relationshipId: string,
    transitionType: MentorshipTransition['transitionType'],
    transitionPlan: MentorshipTransition['transitionPlan']
  ): Promise<MentorshipTransition> {
    console.log(`🔄 Creating mentorship transition for relationship ${relationshipId}`);

    // Get relationship details
    const { data: relationship } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .select('*')
      .eq('id', relationshipId)
      .single();

    if (!relationship) {
      throw new Error('Mentorship relationship not found');
    }

    // Calculate impact summary
    const impactSummary = await this.calculateImpactSummary(relationship);

    const transition: MentorshipTransition = {
      id: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      relationshipId,
      mentorSessionId: relationship.mentor_session_id,
      menteeSessionId: relationship.mentee_session_id,
      transitionType,
      transitionDate: new Date().toISOString(),
      continuedConnectionType: this.determineContinuedConnection(transitionType, impactSummary),
      transitionPlan,
      impactSummary
    };

    // Store transition
    await this.storeMentorshipTransition(transition);

    // Update progression for both participants
    await this.updateProgressionAfterTransition(transition);

    // Track community impact
    await enhancedContentRepository.trackCommunityImpact({
      metric_type: 'relationship_evolved',
      session_id: relationship.mentee_session_id,
      metric_name: 'mentorship_transition',
      metric_value: 1,
      metric_unit: 'transitions',
      impact_description: `Mentorship relationship transitioned: ${transitionType}`,
      evidence: { transitionType, impactSummary, relationshipId },
      beneficiaries: [relationship.mentor_session_id, relationship.mentee_session_id],
      confidence_score: 0.9
    });

    return transition;
  }

  /**
   * Calculate impact summary for a mentorship relationship
   */
  private async calculateImpactSummary(relationship: any): Promise<MentorshipImpactSummary> {
    const startDate = new Date(relationship.start_date);
    const endDate = new Date();
    const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Get goals and milestones (would be from database in real implementation)
    const goals = await mentorshipFramework.getMentorshipGoals(relationship.id);
    const goalsAchieved = goals.filter(g => g.status === 'completed').length;
    const milestonesCompleted = goals.reduce((sum, g) => 
      sum + g.milestones.filter(m => m.completed).length, 0
    );

    const skillsAcquired = relationship.expertise_domains || [];
    const wisdomInsightsShared = relationship.wisdom_captured?.length || 0;

    // Calculate growth and satisfaction scores (simplified)
    const menteeGrowthScore = Math.min(goalsAchieved * 0.3, 1.0);
    const mentorSatisfaction = relationship.satisfaction_mentor || 0.8;
    const menteeSatisfaction = relationship.satisfaction_mentee || 0.8;
    const relationshipStrengthFinal = relationship.relationship_strength || 0.7;

    const readyForNextLevel = menteeGrowthScore >= 0.7 && menteeSatisfaction >= 0.8;

    return {
      relationshipId: relationship.id,
      duration,
      goalsAchieved,
      milestonesCompleted,
      wisdomInsightsShared,
      skillsAcquired,
      communityContributions: [],
      menteeGrowthScore,
      mentorSatisfaction,
      menteeSatisfaction,
      relationshipStrengthFinal,
      readyForNextLevel
    };
  }

  /**
   * Determine continued connection type after transition
   */
  private determineContinuedConnection(
    transitionType: MentorshipTransition['transitionType'],
    impactSummary: MentorshipImpactSummary
  ): MentorshipTransition['continuedConnectionType'] {
    
    if (impactSummary.relationshipStrengthFinal >= 0.8) {
      if (transitionType === 'peer_transition') {
        return 'peer_support';
      } else if (transitionType === 'reverse_mentoring') {
        return 'collaborative_partnership';
      } else {
        return 'alumni_network';
      }
    } else if (impactSummary.relationshipStrengthFinal >= 0.6) {
      return 'project_collaboration';
    } else {
      return 'alumni_network';
    }
  }

  /**
   * Create success story from completed mentorship
   */
  async createSuccessStory(
    relationshipId: string,
    title: string,
    story: string,
    keyLearnings: string[],
    impactAchieved: string[],
    inspirationalQuotes: string[] = [],
    publiclyVisible: boolean = true
  ): Promise<MentorshipSuccessStory> {
    console.log(`📖 Creating success story for relationship ${relationshipId}`);

    // Get relationship details
    const { data: relationship } = await enhancedContentRepository.client
      .from('mentorship_relationships')
      .select('*')
      .eq('id', relationshipId)
      .single();

    if (!relationship) {
      throw new Error('Mentorship relationship not found');
    }

    // Categorize the story
    const category = this.categorizeSuccessStory(story, impactAchieved);

    const successStory: MentorshipSuccessStory = {
      id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      relationshipId,
      mentorSessionId: relationship.mentor_session_id,
      menteeSessionId: relationship.mentee_session_id,
      title,
      story,
      keyLearnings,
      impactAchieved,
      inspirationalQuotes,
      publiclyVisible,
      createdAt: new Date().toISOString(),
      tags: this.generateStoryTags(story, keyLearnings, impactAchieved),
      category
    };

    // Store success story
    await this.storeSuccessStory(successStory);

    // Track community impact if public
    if (publiclyVisible) {
      await enhancedContentRepository.trackCommunityImpact({
        metric_type: 'story_shared',
        session_id: relationship.mentee_session_id,
        metric_name: 'mentorship_success_story',
        metric_value: 1,
        metric_unit: 'stories',
        impact_description: `Success story shared: ${title}`,
        evidence: { category, keyLearnings, impactAchieved },
        beneficiaries: ['community'],
        confidence_score: 0.8
      });
    }

    return successStory;
  }

  /**
   * Categorize success story based on content
   */
  private categorizeSuccessStory(
    story: string,
    impactAchieved: string[]
  ): MentorshipSuccessStory['category'] {
    const storyLower = story.toLowerCase();
    const impactText = impactAchieved.join(' ').toLowerCase();

    if (storyLower.includes('transform') || storyLower.includes('change') || 
        impactText.includes('transformation')) {
      return 'transformation';
    } else if (storyLower.includes('innovat') || storyLower.includes('creat') || 
               impactText.includes('innovation')) {
      return 'innovation';
    } else if (storyLower.includes('lead') || storyLower.includes('guide') || 
               impactText.includes('leadership')) {
      return 'leadership';
    } else {
      return 'community_impact';
    }
  }

  /**
   * Generate tags for success story
   */
  private generateStoryTags(
    story: string,
    keyLearnings: string[],
    impactAchieved: string[]
  ): string[] {
    const tags = new Set<string>();

    // Extract tags from story content
    const storyWords = story.toLowerCase().split(/\s+/);
    const relevantWords = ['systems', 'thinking', 'philosophy', 'implementation', 
                          'leadership', 'community', 'transformation', 'innovation'];
    
    relevantWords.forEach(word => {
      if (storyWords.some(w => w.includes(word))) {
        tags.add(word);
      }
    });

    // Add tags from key learnings and impact
    [...keyLearnings, ...impactAchieved].forEach(item => {
      const words = item.toLowerCase().split(/\s+/);
      relevantWords.forEach(word => {
        if (words.some(w => w.includes(word))) {
          tags.add(word);
        }
      });
    });

    return Array.from(tags);
  }

  /**
   * Get progression history for a user
   */
  private async getProgressionHistory(sessionId: string): Promise<ProgressionEvent[]> {
    // In a real implementation, this would query the database
    // For now, return empty array
    return [];
  }

  /**
   * Get community impacts for a user
   */
  private async getCommunityImpacts(sessionId: string): Promise<any[]> {
    // In a real implementation, this would query community impact metrics
    // For now, return empty array
    return [];
  }

  /**
   * Update progression after transition
   */
  private async updateProgressionAfterTransition(transition: MentorshipTransition): Promise<void> {
    console.log(`📈 Updating progression after transition ${transition.id}`);

    // Create progression events for both participants
    const events: ProgressionEvent[] = [
      {
        id: `event_${Date.now()}_mentor`,
        sessionId: transition.mentorSessionId,
        eventType: 'milestone_achieved',
        description: `Completed mentorship relationship with successful ${transition.transitionType}`,
        evidence: { transitionId: transition.id, impactSummary: transition.impactSummary },
        timestamp: new Date().toISOString(),
        impactScore: 0.8
      },
      {
        id: `event_${Date.now()}_mentee`,
        sessionId: transition.menteeSessionId,
        eventType: transition.impactSummary.readyForNextLevel ? 'role_transition' : 'milestone_achieved',
        fromRole: 'mentee',
        toRole: transition.impactSummary.readyForNextLevel ? 'peer' : undefined,
        description: `Completed mentorship with growth and ${transition.transitionType}`,
        evidence: { transitionId: transition.id, impactSummary: transition.impactSummary },
        timestamp: new Date().toISOString(),
        impactScore: transition.impactSummary.menteeGrowthScore
      }
    ];

    // Store progression events
    for (const event of events) {
      await this.storeProgressionEvent(event);
    }
  }

  /**
   * Get mentorship success stories for inspiration
   */
  async getSuccessStories(
    category?: MentorshipSuccessStory['category'],
    limit: number = 10
  ): Promise<MentorshipSuccessStory[]> {
    // In a real implementation, this would query the database
    // For now, return empty array
    return [];
  }

  /**
   * Store mentorship transition (placeholder)
   */
  private async storeMentorshipTransition(transition: MentorshipTransition): Promise<void> {
    console.log(`💾 Storing mentorship transition ${transition.id}`);
    // In a real implementation, this would store in the database
  }

  /**
   * Store success story (placeholder)
   */
  private async storeSuccessStory(story: MentorshipSuccessStory): Promise<void> {
    console.log(`📖 Storing success story ${story.id}`);
    // In a real implementation, this would store in the database
  }

  /**
   * Store progression event (placeholder)
   */
  private async storeProgressionEvent(event: ProgressionEvent): Promise<void> {
    console.log(`📈 Storing progression event ${event.id}`);
    // In a real implementation, this would store in the database
  }
}

// Singleton instance
export const mentorshipEvolution = new MentorshipEvolution();