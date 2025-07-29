/**
 * Mentor Support and Development System
 * 
 * Provides training, peer support, workload monitoring, and recognition for mentors
 */

import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface MentorTrainingResource {
  id: string;
  title: string;
  description: string;
  category: 'philosophy' | 'communication' | 'guidance_techniques' | 'boundary_setting';
  contentType: 'article' | 'video' | 'interactive' | 'case_study';
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  tags: string[];
  completionTracking: boolean;
}

export interface MentorWorkloadMetrics {
  mentorSessionId: string;
  activeMentees: number;
  averageSessionsPerWeek: number;
  totalMentoringHours: number;
  satisfactionScore: number;
  burnoutRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  lastAssessment: string;
}

export interface PeerMentorConnection {
  id: string;
  mentor1SessionId: string;
  mentor2SessionId: string;
  connectionType: 'buddy' | 'expertise_exchange' | 'support_group';
  sharedInterests: string[];
  connectionStrength: number;
  lastInteraction: string;
  status: 'active' | 'inactive';
}

export interface MentorRecognition {
  id: string;
  mentorSessionId: string;
  recognitionType: 'milestone' | 'impact' | 'innovation' | 'community_contribution';
  title: string;
  description: string;
  criteria: string[];
  awardedDate: string;
  publiclyVisible: boolean;
  badgeIcon?: string;
}

/**
 * Mentor Support and Development System
 */
export class MentorSupportSystem {

  /**
   * Get personalized training resources for a mentor
   */
  async getPersonalizedTrainingResources(
    mentorSessionId: string,
    experienceLevel: 'new' | 'experienced' | 'expert' = 'new'
  ): Promise<MentorTrainingResource[]> {
    console.log(`📚 Getting training resources for mentor ${mentorSessionId}`);

    // Get mentor's current expertise and areas for development
    const mentorProfile = await enhancedContentRepository.getOrCreateCommunityProfile(mentorSessionId);
    
    const allResources = this.getAllTrainingResources();
    
    // Filter and prioritize based on experience level and needs
    let recommendedResources = allResources.filter(resource => {
      if (experienceLevel === 'new') {
        return resource.difficulty === 'beginner' || resource.difficulty === 'intermediate';
      } else if (experienceLevel === 'experienced') {
        return resource.difficulty === 'intermediate' || resource.difficulty === 'advanced';
      } else {
        return resource.difficulty === 'advanced';
      }
    });

    // Prioritize based on mentor's expertise domains
    recommendedResources = recommendedResources.sort((a, b) => {
      const aRelevance = this.calculateResourceRelevance(a, mentorProfile.interests);
      const bRelevance = this.calculateResourceRelevance(b, mentorProfile.interests);
      return bRelevance - aRelevance;
    });

    return recommendedResources.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Get all available training resources
   */
  private getAllTrainingResources(): MentorTrainingResource[] {
    return [
      {
        id: 'aime_philosophy_foundations',
        title: 'AIME Philosophy Foundations for Mentors',
        description: 'Deep dive into AIME philosophy and how to guide others in understanding and applying it',
        category: 'philosophy',
        contentType: 'interactive',
        estimatedTime: 45,
        difficulty: 'beginner',
        content: 'Interactive exploration of AIME core principles with mentoring applications',
        tags: ['philosophy', 'foundations', 'systems-thinking'],
        completionTracking: true
      },
      {
        id: 'effective_questioning',
        title: 'The Art of Effective Questioning',
        description: 'Learn how to ask powerful questions that promote deep thinking and self-discovery',
        category: 'communication',
        contentType: 'video',
        estimatedTime: 30,
        difficulty: 'intermediate',
        content: 'Video series on questioning techniques with practice scenarios',
        tags: ['communication', 'questioning', 'guidance'],
        completionTracking: true
      },
      {
        id: 'systems_thinking_mentoring',
        title: 'Mentoring Systems Thinkers',
        description: 'Specialized guidance for mentoring in systems thinking and complexity',
        category: 'guidance_techniques',
        contentType: 'case_study',
        estimatedTime: 60,
        difficulty: 'advanced',
        content: 'Case studies and frameworks for systems thinking mentorship',
        tags: ['systems-thinking', 'complexity', 'advanced'],
        completionTracking: true
      },
      {
        id: 'cultural_sensitivity',
        title: 'Cultural Sensitivity in Mentoring',
        description: 'Navigate cultural differences and create inclusive mentoring relationships',
        category: 'communication',
        contentType: 'article',
        estimatedTime: 25,
        difficulty: 'intermediate',
        content: 'Guidelines and best practices for culturally sensitive mentoring',
        tags: ['culture', 'inclusion', 'communication'],
        completionTracking: true
      },
      {
        id: 'boundary_setting',
        title: 'Healthy Boundaries in Mentoring',
        description: 'Establish and maintain appropriate boundaries while building meaningful relationships',
        category: 'boundary_setting',
        contentType: 'interactive',
        estimatedTime: 35,
        difficulty: 'beginner',
        content: 'Interactive scenarios and boundary-setting exercises',
        tags: ['boundaries', 'relationships', 'ethics'],
        completionTracking: true
      },
      {
        id: 'difficult_conversations',
        title: 'Navigating Difficult Conversations',
        description: 'Handle challenging situations and provide constructive feedback effectively',
        category: 'communication',
        contentType: 'video',
        estimatedTime: 40,
        difficulty: 'advanced',
        content: 'Video training with role-play examples and techniques',
        tags: ['communication', 'feedback', 'conflict-resolution'],
        completionTracking: true
      },
      {
        id: 'wisdom_capture_techniques',
        title: 'Capturing and Sharing Wisdom',
        description: 'Learn how to identify, capture, and share valuable insights from mentoring experiences',
        category: 'guidance_techniques',
        contentType: 'article',
        estimatedTime: 20,
        difficulty: 'intermediate',
        content: 'Techniques for wisdom identification and community sharing',
        tags: ['wisdom', 'knowledge-sharing', 'community'],
        completionTracking: true
      }
    ];
  }

  /**
   * Calculate resource relevance based on mentor interests
   */
  private calculateResourceRelevance(resource: MentorTrainingResource, mentorInterests: string[]): number {
    let relevance = 0;
    
    // Check tag overlap
    const tagOverlap = resource.tags.filter(tag => 
      mentorInterests.some(interest => interest.includes(tag) || tag.includes(interest))
    );
    relevance += tagOverlap.length * 2;

    // Category relevance
    if (mentorInterests.some(interest => interest.includes('philosophy')) && resource.category === 'philosophy') {
      relevance += 3;
    }
    if (mentorInterests.some(interest => interest.includes('communication')) && resource.category === 'communication') {
      relevance += 2;
    }

    return relevance;
  }

  /**
   * Create peer mentor connections
   */
  async createPeerMentorConnections(mentorSessionId: string): Promise<PeerMentorConnection[]> {
    console.log(`🤝 Creating peer connections for mentor ${mentorSessionId}`);

    // Get mentor profile
    const mentorProfile = await enhancedContentRepository.getOrCreateCommunityProfile(mentorSessionId);
    
    // Find other mentors with similar interests or complementary expertise
    const { data: otherMentors, error } = await enhancedContentRepository.client
      .from('community_user_profiles_enhanced')
      .select('*')
      .contains('relationship_types', ['mentor'])
      .neq('session_id', mentorSessionId);

    if (error || !otherMentors) {
      console.error('Error fetching other mentors:', error);
      return [];
    }

    const connections: PeerMentorConnection[] = [];

    for (const otherMentor of otherMentors.slice(0, 5)) { // Limit to top 5 connections
      const sharedInterests = mentorProfile.interests.filter(interest =>
        otherMentor.interests.includes(interest)
      );

      if (sharedInterests.length > 0) {
        const connection: PeerMentorConnection = {
          id: `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          mentor1SessionId: mentorSessionId,
          mentor2SessionId: otherMentor.session_id,
          connectionType: sharedInterests.length >= 3 ? 'buddy' : 'expertise_exchange',
          sharedInterests,
          connectionStrength: sharedInterests.length / Math.max(mentorProfile.interests.length, otherMentor.interests.length),
          lastInteraction: new Date().toISOString(),
          status: 'active'
        };

        connections.push(connection);
      }
    }

    // Store connections (in a real implementation)
    for (const connection of connections) {
      await this.storePeerConnection(connection);
    }

    return connections;
  }

  /**
   * Monitor mentor workload and assess burnout risk
   */
  async assessMentorWorkload(mentorSessionId: string): Promise<MentorWorkloadMetrics> {
    console.log(`📊 Assessing workload for mentor ${mentorSessionId}`);

    // Get active mentorship relationships
    const activeMentorships = await enhancedContentRepository.getMentorshipRelationships(
      mentorSessionId,
      'mentor'
    );

    const activeMentees = activeMentorships.filter(r => r.status === 'active').length;
    
    // Calculate metrics (simplified for demo)
    const averageSessionsPerWeek = activeMentees * 1; // Assume 1 session per mentee per week
    const totalMentoringHours = activeMentees * 1.5; // Assume 1.5 hours per mentee per week
    
    // Calculate satisfaction score (would be from surveys in real implementation)
    const satisfactionScore = Math.max(0.9 - (activeMentees * 0.1), 0.3); // Decreases with load
    
    // Assess burnout risk
    let burnoutRisk: MentorWorkloadMetrics['burnoutRisk'] = 'low';
    const recommendedActions: string[] = [];

    if (activeMentees >= 4) {
      burnoutRisk = 'high';
      recommendedActions.push('Consider reducing mentee load');
      recommendedActions.push('Take a break from accepting new mentees');
      recommendedActions.push('Connect with peer mentors for support');
    } else if (activeMentees >= 3) {
      burnoutRisk = 'medium';
      recommendedActions.push('Monitor your energy levels closely');
      recommendedActions.push('Ensure you have adequate support systems');
    } else {
      recommendedActions.push('You have capacity for additional mentees if desired');
      recommendedActions.push('Consider sharing your expertise with other mentors');
    }

    const metrics: MentorWorkloadMetrics = {
      mentorSessionId,
      activeMentees,
      averageSessionsPerWeek,
      totalMentoringHours,
      satisfactionScore,
      burnoutRisk,
      recommendedActions,
      lastAssessment: new Date().toISOString()
    };

    // Track workload metrics
    await this.storeWorkloadMetrics(metrics);

    return metrics;
  }

  /**
   * Generate mentor recognition based on achievements
   */
  async generateMentorRecognition(mentorSessionId: string): Promise<MentorRecognition[]> {
    console.log(`🏆 Generating recognition for mentor ${mentorSessionId}`);

    const recognitions: MentorRecognition[] = [];

    // Get mentor's mentorship history
    const mentorships = await enhancedContentRepository.getMentorshipRelationships(
      mentorSessionId,
      'mentor'
    );

    const completedMentorships = mentorships.filter(m => m.status === 'completed');
    const activeMentorships = mentorships.filter(m => m.status === 'active');

    // Milestone recognitions
    if (completedMentorships.length >= 1 && completedMentorships.length < 5) {
      recognitions.push({
        id: `recognition_first_completion_${mentorSessionId}`,
        mentorSessionId,
        recognitionType: 'milestone',
        title: 'First Mentorship Completed',
        description: 'Successfully guided your first mentee to completion',
        criteria: ['Complete at least one mentorship relationship'],
        awardedDate: new Date().toISOString(),
        publiclyVisible: true,
        badgeIcon: '🌱'
      });
    }

    if (completedMentorships.length >= 5) {
      recognitions.push({
        id: `recognition_experienced_mentor_${mentorSessionId}`,
        mentorSessionId,
        recognitionType: 'milestone',
        title: 'Experienced Mentor',
        description: 'Completed 5+ successful mentorship relationships',
        criteria: ['Complete at least 5 mentorship relationships'],
        awardedDate: new Date().toISOString(),
        publiclyVisible: true,
        badgeIcon: '🌳'
      });
    }

    // Impact recognitions
    const totalWisdomShared = mentorships.reduce((sum, m) => 
      sum + (m.wisdom_captured?.length || 0), 0
    );

    if (totalWisdomShared >= 10) {
      recognitions.push({
        id: `recognition_wisdom_sharer_${mentorSessionId}`,
        mentorSessionId,
        recognitionType: 'impact',
        title: 'Wisdom Sharer',
        description: 'Contributed significant wisdom insights to the community',
        criteria: ['Share 10+ wisdom insights with the community'],
        awardedDate: new Date().toISOString(),
        publiclyVisible: true,
        badgeIcon: '💡'
      });
    }

    // Community contribution recognitions
    if (activeMentorships.length >= 3) {
      recognitions.push({
        id: `recognition_dedicated_mentor_${mentorSessionId}`,
        mentorSessionId,
        recognitionType: 'community_contribution',
        title: 'Dedicated Mentor',
        description: 'Actively mentoring multiple community members',
        criteria: ['Maintain 3+ active mentorship relationships'],
        awardedDate: new Date().toISOString(),
        publiclyVisible: true,
        badgeIcon: '🤝'
      });
    }

    // Store recognitions
    for (const recognition of recognitions) {
      await this.storeMentorRecognition(recognition);
      
      // Track community impact
      await enhancedContentRepository.trackCommunityImpact({
        metric_type: 'recognition_awarded',
        session_id: mentorSessionId,
        metric_name: 'mentor_recognition',
        metric_value: 1,
        metric_unit: 'recognitions',
        impact_description: `Mentor recognition awarded: ${recognition.title}`,
        evidence: { recognitionType: recognition.recognitionType, criteria: recognition.criteria },
        beneficiaries: [mentorSessionId],
        confidence_score: 1.0
      });
    }

    return recognitions;
  }

  /**
   * Get mentor support dashboard data
   */
  async getMentorSupportDashboard(mentorSessionId: string): Promise<{
    workloadMetrics: MentorWorkloadMetrics;
    trainingResources: MentorTrainingResource[];
    peerConnections: PeerMentorConnection[];
    recognitions: MentorRecognition[];
    supportRecommendations: string[];
  }> {
    console.log(`📋 Getting support dashboard for mentor ${mentorSessionId}`);

    const [workloadMetrics, trainingResources, peerConnections, recognitions] = await Promise.all([
      this.assessMentorWorkload(mentorSessionId),
      this.getPersonalizedTrainingResources(mentorSessionId),
      this.getPeerConnections(mentorSessionId),
      this.getMentorRecognitions(mentorSessionId)
    ]);

    // Generate support recommendations
    const supportRecommendations = this.generateSupportRecommendations(workloadMetrics, trainingResources);

    return {
      workloadMetrics,
      trainingResources: trainingResources.slice(0, 5), // Top 5
      peerConnections,
      recognitions,
      supportRecommendations
    };
  }

  /**
   * Generate personalized support recommendations
   */
  private generateSupportRecommendations(
    workloadMetrics: MentorWorkloadMetrics,
    trainingResources: MentorTrainingResource[]
  ): string[] {
    const recommendations: string[] = [];

    // Workload-based recommendations
    if (workloadMetrics.burnoutRisk === 'high') {
      recommendations.push('Consider taking a break from new mentees to focus on current relationships');
      recommendations.push('Connect with peer mentors for support and advice');
      recommendations.push('Review boundary-setting resources to maintain healthy limits');
    } else if (workloadMetrics.burnoutRisk === 'medium') {
      recommendations.push('Monitor your energy levels and consider peer support');
      recommendations.push('Complete training on effective time management in mentoring');
    } else {
      recommendations.push('You have capacity to take on additional mentees if interested');
      recommendations.push('Consider sharing your expertise by training other mentors');
    }

    // Training-based recommendations
    if (trainingResources.length > 0) {
      recommendations.push(`Complete "${trainingResources[0].title}" to enhance your mentoring skills`);
    }

    // General recommendations
    recommendations.push('Regularly capture and share wisdom insights from your mentoring experiences');
    recommendations.push('Participate in mentor peer support groups for continuous learning');

    return recommendations;
  }

  /**
   * Get peer connections for a mentor
   */
  private async getPeerConnections(mentorSessionId: string): Promise<PeerMentorConnection[]> {
    // In a real implementation, this would query the database
    // For now, return empty array or create new connections
    return await this.createPeerMentorConnections(mentorSessionId);
  }

  /**
   * Get mentor recognitions
   */
  private async getMentorRecognitions(mentorSessionId: string): Promise<MentorRecognition[]> {
    // In a real implementation, this would query the database
    // For now, generate new recognitions
    return await this.generateMentorRecognition(mentorSessionId);
  }

  /**
   * Store peer connection (placeholder)
   */
  private async storePeerConnection(connection: PeerMentorConnection): Promise<void> {
    console.log(`💾 Storing peer connection ${connection.id}`);
    // In a real implementation, this would store in the database
  }

  /**
   * Store workload metrics (placeholder)
   */
  private async storeWorkloadMetrics(metrics: MentorWorkloadMetrics): Promise<void> {
    console.log(`📊 Storing workload metrics for ${metrics.mentorSessionId}`);
    // In a real implementation, this would store in the database
  }

  /**
   * Store mentor recognition (placeholder)
   */
  private async storeMentorRecognition(recognition: MentorRecognition): Promise<void> {
    console.log(`🏆 Storing recognition ${recognition.id}`);
    // In a real implementation, this would store in the database
  }

  /**
   * Track training completion
   */
  async trackTrainingCompletion(
    mentorSessionId: string,
    resourceId: string,
    completionTime: number,
    feedback?: string
  ): Promise<void> {
    console.log(`✅ Tracking training completion: ${resourceId} for ${mentorSessionId}`);

    await enhancedContentRepository.trackCommunityImpact({
      metric_type: 'training_completed',
      session_id: mentorSessionId,
      metric_name: 'mentor_training_completion',
      metric_value: 1,
      metric_unit: 'trainings',
      impact_description: `Mentor completed training: ${resourceId}`,
      evidence: { resourceId, completionTime, feedback },
      beneficiaries: [mentorSessionId],
      confidence_score: 1.0
    });
  }
}

// Singleton instance
export const mentorSupportSystem = new MentorSupportSystem();