/**
 * Community Impact Measurement System
 * 
 * Tracks individual growth and collective community achievements with celebration and recognition
 */

import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface ImpactMetric {
  id: string;
  sessionId: string;
  metricType: 'individual_growth' | 'community_contribution' | 'collective_achievement' | 'relationship_impact';
  metricName: string;
  metricValue: number;
  metricUnit: string;
  category: 'learning' | 'implementation' | 'mentorship' | 'collaboration' | 'leadership' | 'cultural_impact';
  impactDescription: string;
  evidence: any;
  beneficiaries: string[]; // session IDs or community IDs
  confidenceScore: number; // 0-1
  measuredAt: string;
  reportedBy: string;
  validatedBy?: string;
  validatedAt?: string;
  tags: string[];
}

export interface ImpactMilestone {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community' | 'collective';
  category: ImpactMetric['category'];
  criteria: {
    metricName: string;
    threshold: number;
    timeframe?: string; // e.g., 'last_30_days', 'all_time'
  }[];
  achievedBy: string[]; // session IDs
  achievedAt: string[];
  celebrationLevel: 'recognition' | 'celebration' | 'major_milestone';
  rewards: {
    badge?: string;
    title?: string;
    privileges?: string[];
    communityRecognition?: boolean;
  };
  nextMilestone?: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  story: string;
  storytellerSessionId: string;
  impactType: 'personal_transformation' | 'community_building' | 'implementation_success' | 'cultural_change';
  keyMetrics: ImpactMetric[];
  timeline: {
    startDate: string;
    endDate?: string;
    keyEvents: Array<{
      date: string;
      event: string;
      impact: string;
    }>;
  };
  beneficiaries: {
    direct: number;
    indirect: number;
    communities: string[];
  };
  lessonsLearned: string[];
  inspirationalQuotes: string[];
  mediaAttachments: string[];
  shareWithCommunity: boolean;
  featuredStory: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityHealthMetrics {
  communityId: string;
  period: string; // e.g., 'last_30_days'
  engagement: {
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    participationRate: number;
    contentCreated: number;
    connectionsFormed: number;
  };
  growth: {
    newMembers: number;
    memberRetention: number;
    growthRate: number;
    churnRate: number;
  };
  relationships: {
    mentorshipRelationships: number;
    cohortParticipation: number;
    learningSpaceEngagement: number;
    crossCommunityConnections: number;
    relationshipSatisfaction: number;
  };
  impact: {
    milestonesAchieved: number;
    storiesShared: number;
    implementationsCompleted: number;
    wisdomCaptured: number;
    communityContributions: number;
  };
  healthScore: number; // 0-1
  recommendations: string[];
  alerts: Array<{
    type: 'warning' | 'critical' | 'opportunity';
    message: string;
    suggestedAction: string;
  }>;
}

export interface ContributionRecognition {
  id: string;
  contributorSessionId: string;
  contributionType: 'mentorship' | 'knowledge_sharing' | 'community_building' | 'innovation' | 'cultural_leadership';
  contributionDescription: string;
  impactMetrics: ImpactMetric[];
  recognitionLevel: 'appreciation' | 'recognition' | 'honor' | 'legacy';
  recognizedBy: string[]; // session IDs of recognizers
  recognitionDate: string;
  publicRecognition: boolean;
  rewards: {
    badge?: string;
    title?: string;
    privileges?: string[];
    mentionInStory?: boolean;
  };
  nominationReason: string;
  communityVotes?: number;
}

/**
 * Community Impact Measurement System
 */
export class ImpactMeasurementSystem {

  /**
   * Track individual or community impact
   */
  async trackImpact(
    sessionId: string,
    impactData: {
      metricType: ImpactMetric['metricType'];
      metricName: string;
      metricValue: number;
      metricUnit: string;
      category: ImpactMetric['category'];
      impactDescription: string;
      evidence: any;
      beneficiaries: string[];
      confidenceScore: number;
      tags?: string[];
    }
  ): Promise<ImpactMetric> {
    console.log(`📊 Tracking impact: ${impactData.metricName} for ${sessionId}`);

    const impact: ImpactMetric = {
      id: `impact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      ...impactData,
      measuredAt: new Date().toISOString(),
      reportedBy: sessionId,
      tags: impactData.tags || []
    };

    // Store impact metric
    await this.storeImpactMetric(impact);

    // Check for milestone achievements
    await this.checkMilestoneAchievements(sessionId, impact);

    // Update community health metrics
    await this.updateCommunityHealthMetrics(sessionId, impact);

    // Track in enhanced repository for consistency
    await enhancedContentRepository.trackCommunityImpact({
      metric_type: impactData.metricType,
      session_id: sessionId,
      metric_name: impactData.metricName,
      metric_value: impactData.metricValue,
      metric_unit: impactData.metricUnit,
      impact_description: impactData.impactDescription,
      evidence: impactData.evidence,
      beneficiaries: impactData.beneficiaries,
      confidence_score: impactData.confidenceScore
    });

    return impact;
  }

  /**
   * Check and award milestone achievements
   */
  private async checkMilestoneAchievements(sessionId: string, newImpact: ImpactMetric): Promise<void> {
    console.log(`🏆 Checking milestones for ${sessionId}`);

    const availableMilestones = await this.getAvailableMilestones();
    const userMetrics = await this.getUserMetrics(sessionId);

    for (const milestone of availableMilestones) {
      // Check if user has already achieved this milestone
      if (milestone.achievedBy.includes(sessionId)) continue;

      // Check if criteria are met
      const criteriaMetrics = milestone.criteria.every(criterion => {
        const relevantMetrics = userMetrics.filter(metric => 
          metric.metricName === criterion.metricName
        );

        if (relevantMetrics.length === 0) return false;

        // Apply timeframe filter if specified
        let filteredMetrics = relevantMetrics;
        if (criterion.timeframe) {
          const cutoffDate = this.getTimeframeCutoff(criterion.timeframe);
          filteredMetrics = relevantMetrics.filter(metric => 
            new Date(metric.measuredAt) >= cutoffDate
          );
        }

        // Calculate total value
        const totalValue = filteredMetrics.reduce((sum, metric) => sum + metric.metricValue, 0);
        return totalValue >= criterion.threshold;
      });

      if (criteriaMetrics) {
        await this.awardMilestone(sessionId, milestone);
      }
    }
  }

  /**
   * Award milestone to user
   */
  private async awardMilestone(sessionId: string, milestone: ImpactMilestone): Promise<void> {
    console.log(`🎉 Awarding milestone "${milestone.title}" to ${sessionId}`);

    // Update milestone record
    milestone.achievedBy.push(sessionId);
    milestone.achievedAt.push(new Date().toISOString());

    await this.updateMilestone(milestone);

    // Create celebration event
    await this.createCelebrationEvent(sessionId, milestone);

    // Award rewards
    if (milestone.rewards.badge) {
      await this.awardBadge(sessionId, milestone.rewards.badge);
    }

    if (milestone.rewards.title) {
      await this.awardTitle(sessionId, milestone.rewards.title);
    }

    if (milestone.rewards.communityRecognition) {
      await this.createCommunityRecognition(sessionId, milestone);
    }

    // Track milestone achievement as impact
    await this.trackImpact(sessionId, {
      metricType: 'individual_growth',
      metricName: 'milestone_achieved',
      metricValue: 1,
      metricUnit: 'milestones',
      category: milestone.category,
      impactDescription: `Achieved milestone: ${milestone.title}`,
      evidence: { milestoneId: milestone.id, criteria: milestone.criteria },
      beneficiaries: [sessionId],
      confidenceScore: 1.0,
      tags: ['milestone', 'achievement']
    });
  }

  /**
   * Create impact story
   */
  async createImpactStory(
    storytellerSessionId: string,
    storyData: {
      title: string;
      story: string;
      impactType: ImpactStory['impactType'];
      timeline: ImpactStory['timeline'];
      beneficiaries: ImpactStory['beneficiaries'];
      lessonsLearned: string[];
      inspirationalQuotes?: string[];
      shareWithCommunity?: boolean;
    }
  ): Promise<ImpactStory> {
    console.log(`📖 Creating impact story: ${storyData.title}`);

    // Get related metrics for this user
    const relatedMetrics = await this.getUserMetrics(storytellerSessionId);
    const storyMetrics = relatedMetrics.filter(metric => 
      new Date(metric.measuredAt) >= new Date(storyData.timeline.startDate) &&
      (!storyData.timeline.endDate || new Date(metric.measuredAt) <= new Date(storyData.timeline.endDate))
    );

    const impactStory: ImpactStory = {
      id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: storyData.title,
      story: storyData.story,
      storytellerSessionId,
      impactType: storyData.impactType,
      keyMetrics: storyMetrics,
      timeline: storyData.timeline,
      beneficiaries: storyData.beneficiaries,
      lessonsLearned: storyData.lessonsLearned,
      inspirationalQuotes: storyData.inspirationalQuotes || [],
      mediaAttachments: [],
      shareWithCommunity: storyData.shareWithCommunity !== false,
      featuredStory: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store impact story
    await this.storeImpactStory(impactStory);

    // Track story creation as impact
    await this.trackImpact(storytellerSessionId, {
      metricType: 'community_contribution',
      metricName: 'impact_story_shared',
      metricValue: 1,
      metricUnit: 'stories',
      category: 'cultural_impact',
      impactDescription: `Shared impact story: ${impactStory.title}`,
      evidence: { storyId: impactStory.id, beneficiaries: impactStory.beneficiaries },
      beneficiaries: ['community'],
      confidenceScore: 0.9,
      tags: ['story', 'sharing', 'inspiration']
    });

    return impactStory;
  }

  /**
   * Generate community health report
   */
  async generateCommunityHealthReport(
    communityId: string,
    period: string = 'last_30_days'
  ): Promise<CommunityHealthMetrics> {
    console.log(`📈 Generating health report for community ${communityId}`);

    const cutoffDate = this.getTimeframeCutoff(period);
    const communityMetrics = await this.getCommunityMetrics(communityId, cutoffDate);

    // Calculate engagement metrics
    const engagement = {
      activeUsers: await this.getActiveUsersCount(communityId, cutoffDate),
      totalSessions: communityMetrics.filter(m => m.metricName === 'session_started').length,
      averageSessionDuration: this.calculateAverageSessionDuration(communityMetrics),
      participationRate: await this.calculateParticipationRate(communityId, cutoffDate),
      contentCreated: communityMetrics.filter(m => m.category === 'learning').length,
      connectionsFormed: communityMetrics.filter(m => m.metricName.includes('connection')).length
    };

    // Calculate growth metrics
    const growth = {
      newMembers: communityMetrics.filter(m => m.metricName === 'community_joined').length,
      memberRetention: await this.calculateRetentionRate(communityId, cutoffDate),
      growthRate: await this.calculateGrowthRate(communityId, cutoffDate),
      churnRate: await this.calculateChurnRate(communityId, cutoffDate)
    };

    // Calculate relationship metrics
    const relationships = {
      mentorshipRelationships: communityMetrics.filter(m => m.metricName.includes('mentorship')).length,
      cohortParticipation: communityMetrics.filter(m => m.metricName.includes('cohort')).length,
      learningSpaceEngagement: communityMetrics.filter(m => m.metricName.includes('learning_space')).length,
      crossCommunityConnections: communityMetrics.filter(m => m.metricName.includes('cross_community')).length,
      relationshipSatisfaction: await this.calculateRelationshipSatisfaction(communityId)
    };

    // Calculate impact metrics
    const impact = {
      milestonesAchieved: communityMetrics.filter(m => m.metricName === 'milestone_achieved').length,
      storiesShared: communityMetrics.filter(m => m.metricName === 'impact_story_shared').length,
      implementationsCompleted: communityMetrics.filter(m => m.metricName.includes('implementation_completed')).length,
      wisdomCaptured: communityMetrics.filter(m => m.metricName.includes('wisdom')).length,
      communityContributions: communityMetrics.filter(m => m.metricType === 'community_contribution').length
    };

    // Calculate overall health score
    const healthScore = this.calculateHealthScore(engagement, growth, relationships, impact);

    // Generate recommendations and alerts
    const { recommendations, alerts } = this.generateHealthRecommendations(
      engagement, growth, relationships, impact, healthScore
    );

    return {
      communityId,
      period,
      engagement,
      growth,
      relationships,
      impact,
      healthScore,
      recommendations,
      alerts
    };
  }

  /**
   * Create contribution recognition
   */
  async createContributionRecognition(
    contributorSessionId: string,
    recognitionData: {
      contributionType: ContributionRecognition['contributionType'];
      contributionDescription: string;
      recognitionLevel: ContributionRecognition['recognitionLevel'];
      nominationReason: string;
      recognizedBy: string[];
      publicRecognition?: boolean;
    }
  ): Promise<ContributionRecognition> {
    console.log(`🏅 Creating recognition for ${contributorSessionId}`);

    // Get contributor's impact metrics
    const contributorMetrics = await this.getUserMetrics(contributorSessionId);
    const relevantMetrics = contributorMetrics.filter(metric => 
      this.isRelevantToContribution(metric, recognitionData.contributionType)
    );

    const recognition: ContributionRecognition = {
      id: `recognition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contributorSessionId,
      contributionType: recognitionData.contributionType,
      contributionDescription: recognitionData.contributionDescription,
      impactMetrics: relevantMetrics,
      recognitionLevel: recognitionData.recognitionLevel,
      recognizedBy: recognitionData.recognizedBy,
      recognitionDate: new Date().toISOString(),
      publicRecognition: recognitionData.publicRecognition !== false,
      rewards: this.generateRecognitionRewards(recognitionData.recognitionLevel, recognitionData.contributionType),
      nominationReason: recognitionData.nominationReason,
      communityVotes: recognitionData.recognizedBy.length
    };

    // Store recognition
    await this.storeContributionRecognition(recognition);

    // Award rewards
    await this.awardRecognitionRewards(contributorSessionId, recognition.rewards);

    // Track recognition as impact
    await this.trackImpact(contributorSessionId, {
      metricType: 'community_contribution',
      metricName: 'contribution_recognized',
      metricValue: 1,
      metricUnit: 'recognitions',
      category: 'leadership',
      impactDescription: `Received ${recognition.recognitionLevel} recognition for ${recognition.contributionType}`,
      evidence: { recognitionId: recognition.id, contributionType: recognition.contributionType },
      beneficiaries: [contributorSessionId],
      confidenceScore: 1.0,
      tags: ['recognition', 'contribution', recognition.contributionType]
    });

    return recognition;
  }

  /**
   * Get impact dashboard data
   */
  async getImpactDashboard(
    sessionId: string,
    scope: 'personal' | 'community' | 'global' = 'personal'
  ): Promise<{
    personalMetrics: ImpactMetric[];
    milestones: ImpactMilestone[];
    stories: ImpactStory[];
    recognitions: ContributionRecognition[];
    communityHealth?: CommunityHealthMetrics;
    recommendations: string[];
  }> {
    console.log(`📊 Getting impact dashboard for ${sessionId} (${scope})`);

    const personalMetrics = await this.getUserMetrics(sessionId);
    const milestones = await this.getUserMilestones(sessionId);
    const stories = await this.getUserStories(sessionId);
    const recognitions = await this.getUserRecognitions(sessionId);

    let communityHealth: CommunityHealthMetrics | undefined;
    if (scope === 'community' || scope === 'global') {
      // Get user's primary community
      const userCommunity = await this.getUserPrimaryCommunity(sessionId);
      if (userCommunity) {
        communityHealth = await this.generateCommunityHealthReport(userCommunity);
      }
    }

    const recommendations = this.generatePersonalRecommendations(personalMetrics, milestones);

    return {
      personalMetrics,
      milestones,
      stories,
      recognitions,
      communityHealth,
      recommendations
    };
  }

  /**
   * Helper methods for calculations and data operations
   */
  private calculateHealthScore(
    engagement: any,
    growth: any,
    relationships: any,
    impact: any
  ): number {
    // Weighted health score calculation
    const engagementScore = Math.min(engagement.participationRate, 1.0) * 0.3;
    const growthScore = Math.min(growth.growthRate / 0.1, 1.0) * 0.2; // 10% growth = 1.0
    const relationshipScore = Math.min(relationships.relationshipSatisfaction, 1.0) * 0.3;
    const impactScore = Math.min(impact.milestonesAchieved / 10, 1.0) * 0.2; // 10 milestones = 1.0

    return engagementScore + growthScore + relationshipScore + impactScore;
  }

  private generateHealthRecommendations(
    engagement: any,
    growth: any,
    relationships: any,
    impact: any,
    healthScore: number
  ): { recommendations: string[]; alerts: any[] } {
    const recommendations: string[] = [];
    const alerts: any[] = [];

    if (healthScore < 0.6) {
      alerts.push({
        type: 'warning',
        message: 'Community health score is below optimal',
        suggestedAction: 'Focus on increasing engagement and relationship building'
      });
    }

    if (engagement.participationRate < 0.5) {
      recommendations.push('Increase community engagement through events and activities');
    }

    if (growth.churnRate > 0.2) {
      alerts.push({
        type: 'critical',
        message: 'High member churn rate detected',
        suggestedAction: 'Investigate reasons for member departure and improve retention'
      });
    }

    if (relationships.relationshipSatisfaction < 0.7) {
      recommendations.push('Focus on improving relationship quality and support systems');
    }

    return { recommendations, alerts };
  }

  private generatePersonalRecommendations(
    metrics: ImpactMetric[],
    milestones: ImpactMilestone[]
  ): string[] {
    const recommendations: string[] = [];

    // Check for areas of low activity
    const categories = ['learning', 'implementation', 'mentorship', 'collaboration', 'leadership'];
    const categoryMetrics = categories.map(cat => ({
      category: cat,
      count: metrics.filter(m => m.category === cat).length
    }));

    const lowActivityCategories = categoryMetrics.filter(cm => cm.count < 3);
    if (lowActivityCategories.length > 0) {
      recommendations.push(`Consider increasing activity in: ${lowActivityCategories.map(c => c.category).join(', ')}`);
    }

    // Check for milestone opportunities
    const unachievedMilestones = milestones.filter(m => m.achievedBy.length === 0);
    if (unachievedMilestones.length > 0) {
      recommendations.push(`Work towards achieving: ${unachievedMilestones[0].title}`);
    }

    return recommendations;
  }

  private getTimeframeCutoff(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'last_7_days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'last_30_days':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'last_90_days':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'last_year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // All time
    }
  }

  private isRelevantToContribution(metric: ImpactMetric, contributionType: string): boolean {
    const relevanceMap = {
      mentorship: ['mentorship'],
      knowledge_sharing: ['learning', 'cultural_impact'],
      community_building: ['collaboration', 'leadership'],
      innovation: ['implementation', 'leadership'],
      cultural_leadership: ['cultural_impact', 'leadership']
    };

    return relevanceMap[contributionType as keyof typeof relevanceMap]?.includes(metric.category) || false;
  }

  private generateRecognitionRewards(
    level: ContributionRecognition['recognitionLevel'],
    type: ContributionRecognition['contributionType']
  ): ContributionRecognition['rewards'] {
    const rewards: ContributionRecognition['rewards'] = {};

    // Level-based rewards
    switch (level) {
      case 'appreciation':
        rewards.badge = `${type}_contributor`;
        break;
      case 'recognition':
        rewards.badge = `${type}_champion`;
        rewards.title = `${type.replace('_', ' ')} Champion`;
        break;
      case 'honor':
        rewards.badge = `${type}_leader`;
        rewards.title = `${type.replace('_', ' ')} Leader`;
        rewards.privileges = ['featured_profile'];
        break;
      case 'legacy':
        rewards.badge = `${type}_legend`;
        rewards.title = `${type.replace('_', ' ')} Legend`;
        rewards.privileges = ['featured_profile', 'community_advisor'];
        rewards.mentionInStory = true;
        break;
    }

    return rewards;
  }

  /**
   * Data operation placeholders (would connect to database in real implementation)
   */
  private async storeImpactMetric(impact: ImpactMetric): Promise<void> {
    console.log(`💾 Storing impact metric ${impact.id}`);
  }

  private async getUserMetrics(sessionId: string): Promise<ImpactMetric[]> {
    // Placeholder - would query database
    return [];
  }

  private async getAvailableMilestones(): Promise<ImpactMilestone[]> {
    // Placeholder - would return predefined milestones
    return [];
  }

  private async updateMilestone(milestone: ImpactMilestone): Promise<void> {
    console.log(`🔄 Updating milestone ${milestone.id}`);
  }

  private async createCelebrationEvent(sessionId: string, milestone: ImpactMilestone): Promise<void> {
    console.log(`🎉 Creating celebration for ${sessionId}`);
  }

  private async awardBadge(sessionId: string, badge: string): Promise<void> {
    console.log(`🏅 Awarding badge ${badge} to ${sessionId}`);
  }

  private async awardTitle(sessionId: string, title: string): Promise<void> {
    console.log(`👑 Awarding title ${title} to ${sessionId}`);
  }

  private async createCommunityRecognition(sessionId: string, milestone: ImpactMilestone): Promise<void> {
    console.log(`📢 Creating community recognition for ${sessionId}`);
  }

  private async storeImpactStory(story: ImpactStory): Promise<void> {
    console.log(`💾 Storing impact story ${story.id}`);
  }

  private async getCommunityMetrics(communityId: string, cutoffDate: Date): Promise<ImpactMetric[]> {
    // Placeholder - would query community metrics
    return [];
  }

  private async getActiveUsersCount(communityId: string, cutoffDate: Date): Promise<number> {
    // Placeholder - would count active users
    return 0;
  }

  private calculateAverageSessionDuration(metrics: ImpactMetric[]): number {
    // Placeholder calculation
    return 0;
  }

  private async calculateParticipationRate(communityId: string, cutoffDate: Date): Promise<number> {
    // Placeholder calculation
    return 0;
  }

  private async calculateRetentionRate(communityId: string, cutoffDate: Date): Promise<number> {
    // Placeholder calculation
    return 0;
  }

  private async calculateGrowthRate(communityId: string, cutoffDate: Date): Promise<number> {
    // Placeholder calculation
    return 0;
  }

  private async calculateChurnRate(communityId: string, cutoffDate: Date): Promise<number> {
    // Placeholder calculation
    return 0;
  }

  private async calculateRelationshipSatisfaction(communityId: string): Promise<number> {
    // Placeholder calculation
    return 0;
  }

  private async storeContributionRecognition(recognition: ContributionRecognition): Promise<void> {
    console.log(`💾 Storing recognition ${recognition.id}`);
  }

  private async awardRecognitionRewards(sessionId: string, rewards: ContributionRecognition['rewards']): Promise<void> {
    console.log(`🎁 Awarding rewards to ${sessionId}`);
  }

  private async getUserMilestones(sessionId: string): Promise<ImpactMilestone[]> {
    // Placeholder - would query user milestones
    return [];
  }

  private async getUserStories(sessionId: string): Promise<ImpactStory[]> {
    // Placeholder - would query user stories
    return [];
  }

  private async getUserRecognitions(sessionId: string): Promise<ContributionRecognition[]> {
    // Placeholder - would query user recognitions
    return [];
  }

  private async getUserPrimaryCommunity(sessionId: string): Promise<string | null> {
    // Placeholder - would find user's primary community
    return null;
  }

  private async updateCommunityHealthMetrics(sessionId: string, impact: ImpactMetric): Promise<void> {
    console.log(`📈 Updating community health metrics`);
  }
}

// Singleton instance
export const impactMeasurementSystem = new ImpactMeasurementSystem();