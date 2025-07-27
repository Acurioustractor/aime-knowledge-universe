/**
 * User Context Modeling Service
 * 
 * Builds and maintains user profiles from interaction data for personalized recommendations
 */

import { UserSession, UserInteraction, ContentItem, enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface UserProfile {
  sessionId: string;
  interests: string[];
  currentFocus: string;
  experienceLevel: string;
  preferredComplexity: number;
  engagementPattern: 'deep_reader' | 'engaged_reader' | 'quick_browser' | 'new_user';
  learningStyle: 'visual' | 'textual' | 'practical' | 'mixed';
  contentPreferences: {
    preferredTypes: string[];
    avoidedTypes: string[];
    philosophyDomains: string[];
  };
  behaviorMetrics: {
    avgSessionDuration: number;
    avgContentDuration: number;
    completionRate: number;
    returnFrequency: number;
  };
  recentActivity: {
    viewedContent: string[];
    searchQueries: string[];
    topics: string[];
    lastActive: string;
  };
}

export interface InteractionAnalysis {
  contentEngagement: Map<string, number>;
  topicInterests: Map<string, number>;
  complexityProgression: number[];
  sessionPatterns: {
    averageDuration: number;
    peakActivityHours: number[];
    contentTypesViewed: string[];
  };
}

/**
 * User Context Modeling Service
 */
export class UserContextModelingService {
  /**
   * Build comprehensive user profile from session and interactions
   */
  async buildUserProfile(sessionId: string): Promise<UserProfile> {
    console.log(`👤 Building user profile for session ${sessionId}`);

    // Get user session data
    const userSession = await enhancedContentRepository.getOrCreateUserSession(sessionId);
    
    // Get user interactions (last 30 days)
    const userInteractions = await this.getUserInteractions(sessionId, 30);
    
    // Analyze interactions
    const interactionAnalysis = this.analyzeInteractions(userInteractions);
    
    // Extract interests from interactions and session
    const interests = this.extractUserInterests(userSession, userInteractions, interactionAnalysis);
    
    // Determine current focus
    const currentFocus = this.determineCurrentFocus(userSession, userInteractions);
    
    // Analyze engagement patterns
    const engagementPattern = this.analyzeEngagementPattern(userInteractions);
    
    // Determine learning style
    const learningStyle = this.determineLearningStyle(userInteractions);
    
    // Build content preferences
    const contentPreferences = this.buildContentPreferences(userInteractions, interactionAnalysis);
    
    // Calculate behavior metrics
    const behaviorMetrics = this.calculateBehaviorMetrics(userInteractions);
    
    // Get recent activity
    const recentActivity = this.getRecentActivity(userInteractions);

    const profile: UserProfile = {
      sessionId,
      interests,
      currentFocus,
      experienceLevel: userSession.experience_level,
      preferredComplexity: userSession.preferred_complexity,
      engagementPattern,
      learningStyle,
      contentPreferences,
      behaviorMetrics,
      recentActivity
    };

    console.log(`✅ Built profile for ${sessionId}: ${interests.length} interests, ${engagementPattern} pattern`);
    
    return profile;
  }

  /**
   * Update user profile based on new interaction
   */
  async updateUserProfile(
    sessionId: string, 
    interaction: Omit<UserInteraction, 'id' | 'created_at'>
  ): Promise<void> {
    console.log(`🔄 Updating user profile for session ${sessionId} with ${interaction.interaction_type} interaction`);

    // Track the interaction
    await enhancedContentRepository.trackUserInteraction(interaction);

    // Update session data based on interaction
    await this.updateSessionFromInteraction(sessionId, interaction);
  }

  /**
   * Get user interactions for a session
   */
  private async getUserInteractions(sessionId: string, days: number = 30): Promise<UserInteraction[]> {
    // This would query the user_interactions table
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Analyze user interactions to extract patterns
   */
  private analyzeInteractions(interactions: UserInteraction[]): InteractionAnalysis {
    const contentEngagement = new Map<string, number>();
    const topicInterests = new Map<string, number>();
    const complexityProgression: number[] = [];
    
    let totalDuration = 0;
    const contentTypesViewed: string[] = [];
    const hourlyActivity = new Array(24).fill(0);

    for (const interaction of interactions) {
      // Content engagement scoring
      const engagementScore = this.calculateEngagementScore(interaction);
      contentEngagement.set(interaction.content_id, engagementScore);

      // Track complexity progression
      if (interaction.context?.complexity_level) {
        complexityProgression.push(interaction.context.complexity_level);
      }

      // Track content types
      if (interaction.context?.content_type) {
        contentTypesViewed.push(interaction.context.content_type);
      }

      // Track session duration
      if (interaction.duration) {
        totalDuration += interaction.duration;
      }

      // Track activity hours
      const hour = new Date(interaction.created_at).getHours();
      hourlyActivity[hour]++;

      // Extract topics from context
      if (interaction.context?.key_concepts) {
        for (const concept of interaction.context.key_concepts) {
          topicInterests.set(concept, (topicInterests.get(concept) || 0) + engagementScore);
        }
      }
    }

    // Find peak activity hours
    const peakActivityHours = hourlyActivity
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    return {
      contentEngagement,
      topicInterests,
      complexityProgression,
      sessionPatterns: {
        averageDuration: interactions.length > 0 ? totalDuration / interactions.length : 0,
        peakActivityHours,
        contentTypesViewed: [...new Set(contentTypesViewed)]
      }
    };
  }

  /**
   * Calculate engagement score for an interaction
   */
  private calculateEngagementScore(interaction: UserInteraction): number {
    let score = 0;

    // Duration-based scoring
    if (interaction.duration) {
      if (interaction.duration > 300) score += 1.0; // 5+ minutes
      else if (interaction.duration > 120) score += 0.7; // 2+ minutes
      else if (interaction.duration > 60) score += 0.4; // 1+ minute
      else score += 0.2;
    }

    // Completion-based scoring
    if (interaction.completion_percentage) {
      score += interaction.completion_percentage * 0.5;
    }

    // Depth-based scoring
    if (interaction.depth_level > 1) {
      score += Math.min(interaction.depth_level * 0.2, 0.6);
    }

    // Satisfaction-based scoring
    if (interaction.satisfaction_rating) {
      score += (interaction.satisfaction_rating / 5) * 0.3;
    }

    // Interaction type weighting
    switch (interaction.interaction_type) {
      case 'bookmark':
      case 'share':
        score += 0.5;
        break;
      case 'implement':
        score += 1.0;
        break;
      case 'philosophy_primer_viewed':
        score += 0.3;
        break;
    }

    return Math.min(score, 2.0); // Cap at 2.0
  }

  /**
   * Extract user interests from session and interactions
   */
  private extractUserInterests(
    userSession: UserSession,
    interactions: UserInteraction[],
    analysis: InteractionAnalysis
  ): string[] {
    const interests = new Set<string>();

    // Add session interests
    userSession.interests.forEach(interest => interests.add(interest));

    // Add top topics from interactions
    const topTopics = Array.from(analysis.topicInterests.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);

    topTopics.forEach(topic => interests.add(topic));

    // Add inferred interests from content types
    const contentTypeInterests = this.inferInterestsFromContentTypes(
      analysis.sessionPatterns.contentTypesViewed
    );
    contentTypeInterests.forEach(interest => interests.add(interest));

    return Array.from(interests).slice(0, 15); // Limit to top 15 interests
  }

  /**
   * Determine current focus domain
   */
  private determineCurrentFocus(userSession: UserSession, interactions: UserInteraction[]): string {
    // Use session focus if set
    if (userSession.current_focus_domain) {
      return userSession.current_focus_domain;
    }

    // Infer from recent interactions
    const recentDomains = interactions
      .filter(interaction => {
        const daysSince = (Date.now() - new Date(interaction.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7; // Last week
      })
      .map(interaction => interaction.context?.philosophy_domain)
      .filter(Boolean);

    if (recentDomains.length > 0) {
      // Find most common domain
      const domainCounts = recentDomains.reduce((counts, domain) => {
        counts[domain!] = (counts[domain!] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const topDomain = Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])[0];

      if (topDomain) {
        return topDomain[0];
      }
    }

    return 'general';
  }

  /**
   * Analyze engagement pattern
   */
  private analyzeEngagementPattern(interactions: UserInteraction[]): UserProfile['engagementPattern'] {
    if (interactions.length === 0) return 'new_user';

    const avgDuration = interactions.reduce((sum, interaction) => 
      sum + (interaction.duration || 0), 0) / interactions.length;

    const avgCompletion = interactions.reduce((sum, interaction) => 
      sum + (interaction.completion_percentage || 0), 0) / interactions.length;

    if (avgDuration > 300 && avgCompletion > 0.7) return 'deep_reader';
    if (avgDuration > 120 && avgCompletion > 0.5) return 'engaged_reader';
    return 'quick_browser';
  }

  /**
   * Determine learning style from interactions
   */
  private determineLearningStyle(interactions: UserInteraction[]): UserProfile['learningStyle'] {
    const contentTypeCounts = interactions.reduce((counts, interaction) => {
      const type = interaction.context?.content_type;
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
      return counts;
    }, {} as Record<string, number>);

    const totalInteractions = interactions.length;
    if (totalInteractions === 0) return 'mixed';

    const videoRatio = (contentTypeCounts.video || 0) / totalInteractions;
    const toolRatio = (contentTypeCounts.tool || 0) / totalInteractions;
    const textRatio = ((contentTypeCounts.research || 0) + (contentTypeCounts.newsletter || 0)) / totalInteractions;

    if (videoRatio > 0.5) return 'visual';
    if (toolRatio > 0.4) return 'practical';
    if (textRatio > 0.5) return 'textual';
    return 'mixed';
  }

  /**
   * Build content preferences from interactions
   */
  private buildContentPreferences(
    interactions: UserInteraction[],
    analysis: InteractionAnalysis
  ): UserProfile['contentPreferences'] {
    const typeEngagement = new Map<string, number>();
    const domainEngagement = new Map<string, number>();

    // Calculate engagement by content type and domain
    for (const interaction of interactions) {
      const engagement = this.calculateEngagementScore(interaction);
      const contentType = interaction.context?.content_type;
      const domain = interaction.context?.philosophy_domain;

      if (contentType) {
        typeEngagement.set(contentType, (typeEngagement.get(contentType) || 0) + engagement);
      }

      if (domain) {
        domainEngagement.set(domain, (domainEngagement.get(domain) || 0) + engagement);
      }
    }

    // Get preferred types (top 3)
    const preferredTypes = Array.from(typeEngagement.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);

    // Get avoided types (bottom engagement)
    const avoidedTypes = Array.from(typeEngagement.entries())
      .filter(([, engagement]) => engagement < 0.3)
      .map(([type]) => type);

    // Get preferred philosophy domains
    const philosophyDomains = Array.from(domainEngagement.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([domain]) => domain);

    return {
      preferredTypes,
      avoidedTypes,
      philosophyDomains
    };
  }

  /**
   * Calculate behavior metrics
   */
  private calculateBehaviorMetrics(interactions: UserInteraction[]): UserProfile['behaviorMetrics'] {
    if (interactions.length === 0) {
      return {
        avgSessionDuration: 0,
        avgContentDuration: 0,
        completionRate: 0,
        returnFrequency: 0
      };
    }

    const avgContentDuration = interactions.reduce((sum, interaction) => 
      sum + (interaction.duration || 0), 0) / interactions.length;

    const completionRate = interactions.reduce((sum, interaction) => 
      sum + (interaction.completion_percentage || 0), 0) / interactions.length / 100;

    // Calculate return frequency (sessions per week)
    const uniqueDays = new Set(
      interactions.map(interaction => 
        new Date(interaction.created_at).toDateString()
      )
    ).size;

    const daysSinceFirst = interactions.length > 0 ? 
      (Date.now() - new Date(interactions[0].created_at).getTime()) / (1000 * 60 * 60 * 24) : 1;

    const returnFrequency = uniqueDays / Math.max(daysSinceFirst / 7, 1);

    return {
      avgSessionDuration: avgContentDuration * 3, // Estimate session as 3x content duration
      avgContentDuration,
      completionRate,
      returnFrequency
    };
  }

  /**
   * Get recent activity summary
   */
  private getRecentActivity(interactions: UserInteraction[]): UserProfile['recentActivity'] {
    const recentInteractions = interactions.filter(interaction => {
      const daysSince = (Date.now() - new Date(interaction.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 7; // Last week
    });

    const viewedContent = recentInteractions.map(interaction => interaction.content_id);
    const topics = recentInteractions.flatMap(interaction => 
      interaction.context?.key_concepts || []
    );

    return {
      viewedContent: [...new Set(viewedContent)],
      searchQueries: [], // Would be populated from search analytics
      topics: [...new Set(topics)],
      lastActive: interactions.length > 0 ? interactions[0].created_at : new Date().toISOString()
    };
  }

  /**
   * Update session data based on interaction
   */
  private async updateSessionFromInteraction(
    sessionId: string,
    interaction: Omit<UserInteraction, 'id' | 'created_at'>
  ): Promise<void> {
    // Update session's current focus if user is consistently viewing content from a domain
    if (interaction.context?.philosophy_domain) {
      // This would update the user session in the database
      console.log(`Updating session focus to ${interaction.context.philosophy_domain}`);
    }

    // Update preferred complexity based on engagement
    if (interaction.context?.complexity_level && interaction.completion_percentage > 0.7) {
      console.log(`User successfully engaged with complexity level ${interaction.context.complexity_level}`);
    }
  }

  /**
   * Infer interests from content types
   */
  private inferInterestsFromContentTypes(contentTypes: string[]): string[] {
    const typeToInterests: Record<string, string[]> = {
      'video': ['visual learning', 'multimedia'],
      'tool': ['practical application', 'implementation'],
      'story': ['case studies', 'real-world examples'],
      'research': ['academic content', 'evidence-based'],
      'newsletter': ['updates', 'community news']
    };

    const interests: string[] = [];
    for (const type of contentTypes) {
      if (typeToInterests[type]) {
        interests.push(...typeToInterests[type]);
      }
    }

    return [...new Set(interests)];
  }
}

// Singleton instance
export const userContextModelingService = new UserContextModelingService();