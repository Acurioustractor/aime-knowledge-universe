/**
 * Trending Content Identification Service
 * 
 * Identifies and ranks trending content based on engagement metrics and user behavior
 */

import { ContentItem, enhancedContentRepository } from '@/lib/database/enhanced-supabase';

export interface TrendingMetrics {
  contentId: string;
  trendingScore: number;
  viewVelocity: number; // Views per day
  engagementRate: number;
  shareRate: number;
  completionRate: number;
  recencyBoost: number;
  qualityScore: number;
  timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface TrendingContent {
  content: ContentItem;
  metrics: TrendingMetrics;
  trendingReason: string;
  category: 'viral' | 'steady_growth' | 'seasonal' | 'quality_boost' | 'new_release';
}

export interface TrendingAnalysis {
  trending: TrendingContent[];
  categories: {
    viral: TrendingContent[];
    steadyGrowth: TrendingContent[];
    seasonal: TrendingContent[];
    qualityBoost: TrendingContent[];
    newRelease: TrendingContent[];
  };
  insights: {
    topDomains: string[];
    emergingTopics: string[];
    contentTypeDistribution: Record<string, number>;
    timePatterns: string[];
  };
}

/**
 * Trending Content Service
 */
export class TrendingContentService {
  /**
   * Identify trending content across different timeframes
   */
  async identifyTrendingContent(
    timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    limit: number = 20
  ): Promise<TrendingAnalysis> {
    console.log(`📈 Identifying trending content for ${timeframe} timeframe`);

    // Get all content with engagement metrics
    const contentResult = await enhancedContentRepository.getContentWithPhilosophy({
      limit: 1000
    });

    // Calculate trending metrics for each content item
    const trendingMetrics = await Promise.all(
      contentResult.items.map(content => this.calculateTrendingMetrics(content, timeframe))
    );

    // Filter and sort by trending score
    const trending = trendingMetrics
      .filter(metrics => metrics.trendingScore > 0.3) // Minimum trending threshold
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    // Create trending content objects
    const trendingContent: TrendingContent[] = trending.map(metrics => {
      const content = contentResult.items.find(item => item.id === metrics.contentId)!;
      return {
        content,
        metrics,
        trendingReason: this.generateTrendingReason(metrics),
        category: this.categorizeTrendingContent(metrics)
      };
    });

    // Categorize trending content
    const categories = this.categorizeTrendingResults(trendingContent);

    // Generate insights
    const insights = this.generateTrendingInsights(trendingContent);

    return {
      trending: trendingContent,
      categories,
      insights
    };
  }

  /**
   * Get trending content for specific philosophy domain
   */
  async getTrendingByDomain(
    domain: string,
    timeframe: 'daily' | 'weekly' = 'weekly',
    limit: number = 10
  ): Promise<TrendingContent[]> {
    const analysis = await this.identifyTrendingContent(timeframe, 100);
    
    return analysis.trending
      .filter(item => item.content.philosophy_domain === domain)
      .slice(0, limit);
  }

  /**
   * Get trending content by type
   */
  async getTrendingByType(
    contentType: string,
    timeframe: 'daily' | 'weekly' = 'weekly',
    limit: number = 10
  ): Promise<TrendingContent[]> {
    const analysis = await this.identifyTrendingContent(timeframe, 100);
    
    return analysis.trending
      .filter(item => item.content.content_type === contentType)
      .slice(0, limit);
  }

  /**
   * Calculate trending metrics for a content item
   */
  private async calculateTrendingMetrics(
    content: ContentItem,
    timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly'
  ): Promise<TrendingMetrics> {
    // In a real implementation, this would query analytics data
    // For now, we'll simulate based on available content metrics
    
    const baseScore = content.engagement_score || 0;
    const qualityScore = content.quality_score || 0;
    const viewCount = content.view_count || 0;

    // Simulate view velocity based on timeframe
    const timeMultiplier = this.getTimeMultiplier(timeframe);
    const viewVelocity = Math.max(viewCount * timeMultiplier, 0);

    // Simulate engagement rate (views to interactions ratio)
    const engagementRate = baseScore * 0.8 + Math.random() * 0.2;

    // Simulate share rate
    const shareRate = engagementRate * 0.3 + (content.is_featured ? 0.2 : 0);

    // Simulate completion rate
    const completionRate = Math.min(engagementRate * 1.2, 1.0);

    // Calculate recency boost
    const recencyBoost = this.calculateRecencyBoost(content, timeframe);

    // Calculate overall trending score
    const trendingScore = this.calculateTrendingScore({
      viewVelocity,
      engagementRate,
      shareRate,
      completionRate,
      recencyBoost,
      qualityScore
    });

    return {
      contentId: content.id,
      trendingScore,
      viewVelocity,
      engagementRate,
      shareRate,
      completionRate,
      recencyBoost,
      qualityScore,
      timeframe
    };
  }

  /**
   * Calculate trending score from individual metrics
   */
  private calculateTrendingScore(metrics: {
    viewVelocity: number;
    engagementRate: number;
    shareRate: number;
    completionRate: number;
    recencyBoost: number;
    qualityScore: number;
  }): number {
    const {
      viewVelocity,
      engagementRate,
      shareRate,
      completionRate,
      recencyBoost,
      qualityScore
    } = metrics;

    // Weighted combination of metrics
    let score = 0;

    // View velocity (30% weight)
    score += Math.min(viewVelocity / 10, 1.0) * 0.3;

    // Engagement rate (25% weight)
    score += engagementRate * 0.25;

    // Share rate (20% weight)
    score += shareRate * 0.2;

    // Completion rate (15% weight)
    score += completionRate * 0.15;

    // Quality score (10% weight)
    score += qualityScore * 0.1;

    // Apply recency boost
    score *= (1 + recencyBoost);

    return Math.min(score, 2.0); // Cap at 2.0
  }

  /**
   * Calculate recency boost based on content age
   */
  private calculateRecencyBoost(
    content: ContentItem,
    timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly'
  ): number {
    const now = new Date();
    const contentDate = new Date(content.source_created_at || content.created_at);
    const ageInHours = (now.getTime() - contentDate.getTime()) / (1000 * 60 * 60);

    let maxBoostHours: number;
    switch (timeframe) {
      case 'hourly':
        maxBoostHours = 6;
        break;
      case 'daily':
        maxBoostHours = 48;
        break;
      case 'weekly':
        maxBoostHours = 168; // 7 days
        break;
      case 'monthly':
        maxBoostHours = 720; // 30 days
        break;
    }

    if (ageInHours > maxBoostHours) return 0;

    // Linear decay from 0.5 boost to 0
    return 0.5 * (1 - ageInHours / maxBoostHours);
  }

  /**
   * Get time multiplier for view velocity calculation
   */
  private getTimeMultiplier(timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly'): number {
    switch (timeframe) {
      case 'hourly':
        return 0.1;
      case 'daily':
        return 0.05;
      case 'weekly':
        return 0.01;
      case 'monthly':
        return 0.003;
    }
  }

  /**
   * Generate trending reason explanation
   */
  private generateTrendingReason(metrics: TrendingMetrics): string {
    const reasons: string[] = [];

    if (metrics.viewVelocity > 5) {
      reasons.push(`High view velocity (${Math.round(metrics.viewVelocity)} views/day)`);
    }

    if (metrics.engagementRate > 0.7) {
      reasons.push(`High engagement rate (${Math.round(metrics.engagementRate * 100)}%)`);
    }

    if (metrics.shareRate > 0.3) {
      reasons.push(`Frequently shared (${Math.round(metrics.shareRate * 100)}% share rate)`);
    }

    if (metrics.recencyBoost > 0.2) {
      reasons.push('Recently published');
    }

    if (metrics.qualityScore > 0.8) {
      reasons.push('High quality content');
    }

    if (reasons.length === 0) {
      reasons.push('Steady engagement growth');
    }

    return reasons.slice(0, 2).join(', ');
  }

  /**
   * Categorize trending content
   */
  private categorizeTrendingContent(metrics: TrendingMetrics): TrendingContent['category'] {
    // Viral: High view velocity and engagement
    if (metrics.viewVelocity > 10 && metrics.engagementRate > 0.8) {
      return 'viral';
    }

    // New release: High recency boost
    if (metrics.recencyBoost > 0.3) {
      return 'new_release';
    }

    // Quality boost: High quality score driving engagement
    if (metrics.qualityScore > 0.8 && metrics.engagementRate > 0.6) {
      return 'quality_boost';
    }

    // Seasonal: Moderate but consistent metrics (would need time series data)
    if (metrics.engagementRate > 0.5 && metrics.viewVelocity > 2) {
      return 'seasonal';
    }

    // Steady growth: Default category
    return 'steady_growth';
  }

  /**
   * Categorize trending results
   */
  private categorizeTrendingResults(trendingContent: TrendingContent[]): TrendingAnalysis['categories'] {
    const categories: TrendingAnalysis['categories'] = {
      viral: [],
      steadyGrowth: [],
      seasonal: [],
      qualityBoost: [],
      newRelease: []
    };

    for (const item of trendingContent) {
      switch (item.category) {
        case 'viral':
          categories.viral.push(item);
          break;
        case 'steady_growth':
          categories.steadyGrowth.push(item);
          break;
        case 'seasonal':
          categories.seasonal.push(item);
          break;
        case 'quality_boost':
          categories.qualityBoost.push(item);
          break;
        case 'new_release':
          categories.newRelease.push(item);
          break;
      }
    }

    return categories;
  }

  /**
   * Generate insights from trending analysis
   */
  private generateTrendingInsights(trendingContent: TrendingContent[]): TrendingAnalysis['insights'] {
    // Top domains
    const domainCounts = new Map<string, number>();
    const topicCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();

    for (const item of trendingContent) {
      // Count domains
      if (item.content.philosophy_domain) {
        domainCounts.set(
          item.content.philosophy_domain,
          (domainCounts.get(item.content.philosophy_domain) || 0) + 1
        );
      }

      // Count content types
      typeCounts.set(
        item.content.content_type,
        (typeCounts.get(item.content.content_type) || 0) + 1
      );

      // Count topics
      for (const concept of item.content.key_concepts) {
        topicCounts.set(concept, (topicCounts.get(concept) || 0) + 1);
      }
    }

    const topDomains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain]) => domain);

    const emergingTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);

    const contentTypeDistribution = Object.fromEntries(typeCounts);

    // Generate time patterns (simplified)
    const timePatterns = [
      'Peak engagement during business hours',
      'Higher video engagement in evenings',
      'Tool content trending on weekdays'
    ];

    return {
      topDomains,
      emergingTopics,
      contentTypeDistribution,
      timePatterns
    };
  }

  /**
   * Get seasonal trending content
   */
  async getSeasonalTrending(
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'current',
    limit: number = 10
  ): Promise<TrendingContent[]> {
    // This would analyze seasonal patterns in content engagement
    // For now, return general trending content
    const analysis = await this.identifyTrendingContent('monthly', limit);
    return analysis.categories.seasonal;
  }

  /**
   * Predict trending content
   */
  async predictTrendingContent(
    hoursAhead: number = 24,
    limit: number = 10
  ): Promise<TrendingContent[]> {
    // This would use ML models to predict future trending content
    // For now, return content with high growth velocity
    const analysis = await this.identifyTrendingContent('hourly', 50);
    
    return analysis.trending
      .filter(item => item.metrics.viewVelocity > 3)
      .slice(0, limit);
  }
}

// Singleton instance
export const trendingContentService = new TrendingContentService();