/**
 * Smart Recommendation Engine
 * 
 * AI-powered content recommendations based on user context and behavior
 */

import { ContentItem, UserSession, UserInteraction } from '@/lib/database/enhanced-supabase';

export interface RecommendationRequest {
  sessionId: string;
  currentContentId?: string;
  recommendationType: 'related' | 'next_steps' | 'prerequisites' | 'examples' | 'trending' | 'personalized';
  limit?: number;
  excludeContentIds?: string[];
}

export interface RecommendationResult {
  content: ContentItem;
  score: number;
  reasoning: string;
  recommendationType: string;
  confidence: number;
}

export interface RecommendationResponse {
  recommendations: RecommendationResult[];
  total: number;
  reasoning: string;
  userContext: {
    interests: string[];
    currentFocus: string;
    experienceLevel: string;
    engagementPattern: string;
  };
}

/**
 * Smart Recommendation Engine with contextual understanding
 */
export class RecommendationEngine {
  /**
   * Generate personalized recommendations
   */
  async generateRecommendations(
    request: RecommendationRequest,
    userSession: UserSession,
    allContent: ContentItem[],
    userInteractions: UserInteraction[] = []
  ): Promise<RecommendationResponse> {
    console.log(`🎯 Generating ${request.recommendationType} recommendations for session ${request.sessionId}`);

    // Analyze user context and behavior
    const userContext = this.analyzeUserContext(userSession, userInteractions);
    
    // Get current content context if provided
    let currentContent: ContentItem | undefined;
    if (request.currentContentId) {
      currentContent = allContent.find(item => item.id === request.currentContentId);
    }

    // Generate recommendations based on type
    let recommendations: RecommendationResult[] = [];
    let reasoning = '';

    switch (request.recommendationType) {
      case 'related':
        recommendations = await this.generateRelatedRecommendations(
          currentContent,
          allContent,
          userContext,
          request.limit || 5
        );
        reasoning = 'Content related to what you\'re currently viewing';
        break;

      case 'next_steps':
        recommendations = await this.generateNextStepsRecommendations(
          currentContent,
          allContent,
          userContext,
          request.limit || 5
        );
        reasoning = 'Suggested next steps to build on your current understanding';
        break;

      case 'prerequisites':
        recommendations = await this.generatePrerequisiteRecommendations(
          currentContent,
          allContent,
          userContext,
          request.limit || 5
        );
        reasoning = 'Foundation knowledge that supports your current learning';
        break;

      case 'examples':
        recommendations = await this.generateExampleRecommendations(
          currentContent,
          allContent,
          userContext,
          request.limit || 5
        );
        reasoning = 'Real-world examples and case studies';
        break;

      case 'trending':
        recommendations = await this.generateTrendingRecommendations(
          allContent,
          userContext,
          request.limit || 10
        );
        reasoning = 'Popular content that others are engaging with';
        break;

      case 'personalized':
      default:
        recommendations = await this.generatePersonalizedRecommendations(
          allContent,
          userContext,
          userInteractions,
          request.limit || 10
        );
        reasoning = 'Personalized recommendations based on your interests and activity';
        break;
    }

    // Filter out excluded content
    if (request.excludeContentIds?.length) {
      recommendations = recommendations.filter(rec => 
        !request.excludeContentIds!.includes(rec.content.id)
      );
    }

    // Sort by score and apply limit
    recommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, request.limit || 10);

    return {
      recommendations,
      total: recommendations.length,
      reasoning,
      userContext: {
        interests: userContext.interests,
        currentFocus: userContext.currentFocus,
        experienceLevel: userContext.experienceLevel,
        engagementPattern: userContext.engagementPattern
      }
    };
  }

  /**
   * Analyze user context from session and interactions
   */
  private analyzeUserContext(
    userSession: UserSession,
    userInteractions: UserInteraction[]
  ): {
    interests: string[];
    currentFocus: string;
    experienceLevel: string;
    engagementPattern: string;
    preferredComplexity: number;
    recentTopics: string[];
  } {
    // Extract interests from session and recent interactions
    const sessionInterests = userSession.interests || [];
    const recentTopics = this.extractRecentTopics(userInteractions);
    const combinedInterests = [...new Set([...sessionInterests, ...recentTopics])];

    // Determine engagement pattern
    const engagementPattern = this.analyzeEngagementPattern(userInteractions);
    
    // Determine current focus
    const currentFocus = userSession.current_focus_domain || 
      this.inferCurrentFocus(userInteractions) || 
      'general';

    return {
      interests: combinedInterests,
      currentFocus,
      experienceLevel: userSession.experience_level,
      engagementPattern,
      preferredComplexity: userSession.preferred_complexity,
      recentTopics
    };
  }

  /**
   * Generate related content recommendations
   */
  private async generateRelatedRecommendations(
    currentContent: ContentItem | undefined,
    allContent: ContentItem[],
    userContext: any,
    limit: number
  ): Promise<RecommendationResult[]> {
    if (!currentContent) return [];

    const recommendations: RecommendationResult[] = [];

    for (const item of allContent) {
      if (item.id === currentContent.id) continue;

      let score = 0;
      const reasons: string[] = [];

      // Same philosophy domain
      if (item.philosophy_domain === currentContent.philosophy_domain) {
        score += 0.4;
        reasons.push('Same philosophy domain');
      }

      // Concept overlap
      const conceptOverlap = this.calculateConceptOverlap(currentContent, item);
      if (conceptOverlap > 0.3) {
        score += conceptOverlap * 0.5;
        reasons.push(`${Math.round(conceptOverlap * 100)}% concept overlap`);
      }

      // Similar complexity level
      const complexityDiff = Math.abs(item.complexity_level - currentContent.complexity_level);
      if (complexityDiff <= 1) {
        score += 0.2;
        reasons.push('Similar complexity level');
      }

      // Quality boost
      score += item.quality_score * 0.2;

      if (score > 0.3) {
        recommendations.push({
          content: item,
          score,
          reasoning: reasons.join(', '),
          recommendationType: 'related',
          confidence: Math.min(score, 1.0)
        });
      }
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Generate next steps recommendations
   */
  private async generateNextStepsRecommendations(
    currentContent: ContentItem | undefined,
    allContent: ContentItem[],
    userContext: any,
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    const targetComplexity = currentContent ? 
      Math.min(currentContent.complexity_level + 1, 5) : 
      userContext.preferredComplexity + 1;

    for (const item of allContent) {
      if (currentContent && item.id === currentContent.id) continue;

      let score = 0;
      const reasons: string[] = [];

      // Higher complexity level
      if (item.complexity_level === targetComplexity) {
        score += 0.5;
        reasons.push('Next complexity level');
      }

      // Same domain progression
      if (currentContent && item.philosophy_domain === currentContent.philosophy_domain) {
        score += 0.3;
        reasons.push('Same philosophy domain');
      }

      // User interests alignment
      const interestAlignment = this.calculateInterestAlignment(item, userContext.interests);
      if (interestAlignment > 0.3) {
        score += interestAlignment * 0.4;
        reasons.push('Matches your interests');
      }

      // Implementation focus for next steps
      if (item.content_type === 'tool') {
        score += 0.2;
        reasons.push('Practical implementation');
      }

      if (score > 0.4) {
        recommendations.push({
          content: item,
          score,
          reasoning: reasons.join(', '),
          recommendationType: 'next_steps',
          confidence: Math.min(score, 1.0)
        });
      }
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Generate prerequisite recommendations
   */
  private async generatePrerequisiteRecommendations(
    currentContent: ContentItem | undefined,
    allContent: ContentItem[],
    userContext: any,
    limit: number
  ): Promise<RecommendationResult[]> {
    if (!currentContent) return [];

    const recommendations: RecommendationResult[] = [];
    const targetComplexity = Math.max(currentContent.complexity_level - 1, 1);

    for (const item of allContent) {
      if (item.id === currentContent.id) continue;

      let score = 0;
      const reasons: string[] = [];

      // Lower complexity level
      if (item.complexity_level === targetComplexity) {
        score += 0.5;
        reasons.push('Foundation level');
      }

      // Same domain
      if (item.philosophy_domain === currentContent.philosophy_domain) {
        score += 0.4;
        reasons.push('Same philosophy domain');
      }

      // Prerequisite concepts
      const hasPrerequisiteConcepts = currentContent.prerequisite_concepts.some(concept =>
        item.key_concepts.includes(concept) || item.themes.includes(concept)
      );
      
      if (hasPrerequisiteConcepts) {
        score += 0.6;
        reasons.push('Contains prerequisite concepts');
      }

      // Philosophy primers are good prerequisites
      if (item.is_philosophy_primer) {
        score += 0.3;
        reasons.push('Philosophy foundation');
      }

      if (score > 0.4) {
        recommendations.push({
          content: item,
          score,
          reasoning: reasons.join(', '),
          recommendationType: 'prerequisites',
          confidence: Math.min(score, 1.0)
        });
      }
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Generate example recommendations
   */
  private async generateExampleRecommendations(
    currentContent: ContentItem | undefined,
    allContent: ContentItem[],
    userContext: any,
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // Focus on stories and videos as examples
    const exampleContent = allContent.filter(item => 
      item.content_type === 'story' || item.content_type === 'video'
    );

    for (const item of exampleContent) {
      if (currentContent && item.id === currentContent.id) continue;

      let score = 0;
      const reasons: string[] = [];

      // Same domain examples
      if (currentContent && item.philosophy_domain === currentContent.philosophy_domain) {
        score += 0.5;
        reasons.push('Examples from same domain');
      }

      // Interest alignment
      const interestAlignment = this.calculateInterestAlignment(item, userContext.interests);
      if (interestAlignment > 0.2) {
        score += interestAlignment * 0.4;
        reasons.push('Matches your interests');
      }

      // High engagement examples
      if (item.engagement_score > 0.7) {
        score += 0.3;
        reasons.push('Highly engaging example');
      }

      // Quality boost
      score += item.quality_score * 0.2;

      if (score > 0.3) {
        recommendations.push({
          content: item,
          score,
          reasoning: reasons.join(', '),
          recommendationType: 'examples',
          confidence: Math.min(score, 1.0)
        });
      }
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Generate trending recommendations
   */
  private async generateTrendingRecommendations(
    allContent: ContentItem[],
    userContext: any,
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // Sort by engagement and view count
    const trendingContent = allContent
      .filter(item => item.engagement_score > 0.5 || item.view_count > 10)
      .sort((a, b) => {
        const scoreA = a.engagement_score * 0.7 + (a.view_count / 100) * 0.3;
        const scoreB = b.engagement_score * 0.7 + (b.view_count / 100) * 0.3;
        return scoreB - scoreA;
      });

    for (const item of trendingContent.slice(0, limit * 2)) {
      let score = 0;
      const reasons: string[] = [];

      // Base trending score
      score += item.engagement_score * 0.5;
      score += Math.min(item.view_count / 100, 0.3);
      reasons.push('Popular content');

      // User interest alignment
      const interestAlignment = this.calculateInterestAlignment(item, userContext.interests);
      if (interestAlignment > 0.2) {
        score += interestAlignment * 0.3;
        reasons.push('Matches your interests');
      }

      // Complexity appropriateness
      if (item.complexity_level <= userContext.preferredComplexity + 1) {
        score += 0.2;
        reasons.push('Appropriate complexity');
      }

      recommendations.push({
        content: item,
        score,
        reasoning: reasons.join(', '),
        recommendationType: 'trending',
        confidence: Math.min(score, 1.0)
      });
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Generate personalized recommendations
   */
  private async generatePersonalizedRecommendations(
    allContent: ContentItem[],
    userContext: any,
    userInteractions: UserInteraction[],
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // Get content user hasn't interacted with recently
    const recentContentIds = userInteractions
      .filter(interaction => {
        const daysSince = (Date.now() - new Date(interaction.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7; // Last week
      })
      .map(interaction => interaction.content_id);

    const candidateContent = allContent.filter(item => 
      !recentContentIds.includes(item.id)
    );

    for (const item of candidateContent) {
      let score = 0;
      const reasons: string[] = [];

      // Interest alignment (primary factor)
      const interestAlignment = this.calculateInterestAlignment(item, userContext.interests);
      if (interestAlignment > 0.2) {
        score += interestAlignment * 0.6;
        reasons.push('Matches your interests');
      }

      // Current focus alignment
      if (item.philosophy_domain === userContext.currentFocus) {
        score += 0.4;
        reasons.push('Aligns with current focus');
      }

      // Complexity appropriateness
      if (item.complexity_level <= userContext.preferredComplexity + 1) {
        score += 0.3;
        reasons.push('Appropriate complexity');
      }

      // Quality and engagement
      score += item.quality_score * 0.2;
      if (item.engagement_score > 0.6) {
        score += 0.2;
        reasons.push('High quality content');
      }

      // Diversity bonus (different content types)
      if (this.shouldPromoteContentDiversity(item, recommendations)) {
        score += 0.1;
        reasons.push('Content diversity');
      }

      if (score > 0.4) {
        recommendations.push({
          content: item,
          score,
          reasoning: reasons.join(', '),
          recommendationType: 'personalized',
          confidence: Math.min(score, 1.0)
        });
      }
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Calculate concept overlap between two content items
   */
  private calculateConceptOverlap(content1: ContentItem, content2: ContentItem): number {
    const concepts1 = [...content1.key_concepts, ...content1.themes, ...content1.tags];
    const concepts2 = [...content2.key_concepts, ...content2.themes, ...content2.tags];
    
    const commonConcepts = concepts1.filter(concept => 
      concepts2.some(c => c.toLowerCase() === concept.toLowerCase())
    );
    
    return commonConcepts.length / Math.max(concepts1.length, concepts2.length);
  }

  /**
   * Calculate interest alignment
   */
  private calculateInterestAlignment(content: ContentItem, userInterests: string[]): number {
    if (userInterests.length === 0) return 0;

    const contentKeywords = [
      ...content.key_concepts,
      ...content.themes,
      ...content.tags,
      content.title
    ].map(k => k.toLowerCase());

    const matchingInterests = userInterests.filter(interest =>
      contentKeywords.some(keyword => keyword.includes(interest.toLowerCase()))
    );

    return matchingInterests.length / userInterests.length;
  }

  /**
   * Extract recent topics from user interactions
   */
  private extractRecentTopics(userInteractions: UserInteraction[]): string[] {
    // This would analyze recent interactions to extract topics
    // For now, return empty array
    return [];
  }

  /**
   * Analyze user engagement pattern
   */
  private analyzeEngagementPattern(userInteractions: UserInteraction[]): string {
    if (userInteractions.length === 0) return 'new_user';

    const avgDuration = userInteractions.reduce((sum, interaction) => 
      sum + (interaction.duration || 0), 0) / userInteractions.length;

    if (avgDuration > 300) return 'deep_reader'; // 5+ minutes
    if (avgDuration > 120) return 'engaged_reader'; // 2+ minutes
    return 'quick_browser';
  }

  /**
   * Infer current focus from recent interactions
   */
  private inferCurrentFocus(userInteractions: UserInteraction[]): string | null {
    // Analyze recent interactions to infer focus
    // For now, return null
    return null;
  }

  /**
   * Check if content type should be promoted for diversity
   */
  private shouldPromoteContentDiversity(
    item: ContentItem,
    currentRecommendations: RecommendationResult[]
  ): boolean {
    const currentTypes = currentRecommendations.map(rec => rec.content.content_type);
    const typeCount = currentTypes.filter(type => type === item.content_type).length;
    
    // Promote if this content type is underrepresented
    return typeCount < 2;
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();