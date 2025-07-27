/**
 * Intelligent Content Recommendation Engine for AIME Knowledge Universe
 * 
 * Provides personalized content recommendations based on:
 * - Content similarity (semantic and keyword-based)
 * - User behavior patterns
 * - Indigenous knowledge pathways
 * - Learning progression logic
 * - Community engagement data
 */

import { getDatabase } from './database/connection';
import { calculateSemanticSimilarity, detectIndigenousContext } from './search-enhancement';
import { getSemanticSearchEngine } from './semantic-search';

export interface RecommendationRequest {
  user_id?: string;
  current_content_id: string;
  content_type: string;
  user_interests?: string[];
  learning_goals?: string[];
  max_recommendations?: number;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content';
  url: string;
  recommendation_score: number;
  recommendation_reason: string;
  cultural_context?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_time?: string;
  prerequisites?: string[];
  related_hoodies?: string[];
  metadata: Record<string, any>;
}

export interface UserLearningProfile {
  user_id: string;
  interests: string[];
  completed_content: string[];
  current_level: 'beginner' | 'intermediate' | 'advanced';
  preferred_content_types: string[];
  cultural_preferences: {
    indigenous_focused: boolean;
    cultural_sensitivity_level: 'standard' | 'high' | 'expert';
  };
  learning_path: string[];
  engagement_history: {
    content_id: string;
    engagement_type: 'viewed' | 'completed' | 'bookmarked' | 'shared';
    timestamp: string;
    duration?: number;
  }[];
}

export class ContentRecommendationEngine {
  private db: any;
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    this.db = await getDatabase();
  }
  
  /**
   * Get personalized content recommendations
   */
  async getRecommendations(request: RecommendationRequest): Promise<ContentRecommendation[]> {
    await this.initialize();
    
    const { 
      user_id, 
      current_content_id, 
      content_type, 
      user_interests = [], 
      learning_goals = [],
      max_recommendations = 10 
    } = request;
    
    console.log(`🎯 Generating recommendations for content: ${current_content_id}`);
    
    // Get current content details
    const currentContent = await this.getCurrentContent(current_content_id, content_type);
    if (!currentContent) {
      throw new Error(`Content not found: ${current_content_id}`);
    }
    
    // Get user profile if available
    const userProfile = user_id ? await this.getUserProfile(user_id) : null;
    
    // Generate different types of recommendations
    const recommendations = await Promise.all([
      this.getSimilarContentRecommendations(currentContent, max_recommendations / 4),
      this.getProgressionBasedRecommendations(currentContent, userProfile, max_recommendations / 4),
      this.getIndigenousKnowledgeRecommendations(currentContent, max_recommendations / 4),
      this.getCommunityRecommendations(currentContent, user_interests, max_recommendations / 4)
    ]);
    
    // Flatten and deduplicate
    const allRecommendations = recommendations.flat();
    const uniqueRecommendations = this.deduplicateRecommendations(allRecommendations, current_content_id);
    
    // Apply user preferences and re-score
    const personalizedRecommendations = this.personalizeRecommendations(
      uniqueRecommendations, 
      userProfile, 
      user_interests, 
      learning_goals
    );
    
    // Sort by final score and return top recommendations
    return personalizedRecommendations
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, max_recommendations);
  }
  
  /**
   * Get content similar to current content
   */
  private async getSimilarContentRecommendations(
    currentContent: any, 
    limit: number
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    try {
      // Get semantic search engine for similarity
      const semanticEngine = await getSemanticSearchEngine();
      
      // Search for similar content across all types
      const similaritySearches = await Promise.all([
        this.findSimilarKnowledgeContent(currentContent, limit / 4),
        this.findSimilarBusinessCases(currentContent, limit / 4),
        this.findSimilarTools(currentContent, limit / 4),
        this.findSimilarVideos(currentContent, limit / 4)
      ]);
      
      similaritySearches.flat().forEach(item => {
        recommendations.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          url: item.url,
          recommendation_score: item.similarity_score * 0.8, // Base similarity score
          recommendation_reason: `Similar to "${currentContent.title}" - ${Math.round(item.similarity_score * 100)}% match`,
          metadata: item.metadata || {}
        });
      });
      
    } catch (error) {
      console.warn('Could not generate similarity recommendations:', error);
    }
    
    return recommendations;
  }
  
  /**
   * Get recommendations based on learning progression
   */
  private async getProgressionBasedRecommendations(
    currentContent: any,
    userProfile: UserLearningProfile | null,
    limit: number
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    try {
      // Define learning progressions
      const progressionPaths = {
        'knowledge': ['business_case', 'tool', 'video'],
        'business_case': ['tool', 'knowledge', 'hoodie'],
        'tool': ['video', 'knowledge', 'business_case'],
        'video': ['knowledge', 'tool', 'business_case'],
        'hoodie': ['business_case', 'knowledge', 'tool']
      };
      
      const nextTypes = progressionPaths[currentContent.type as keyof typeof progressionPaths] || [];
      
      for (const nextType of nextTypes) {
        const nextContent = await this.getContentByTypeAndTopics(
          nextType,
          this.extractTopics(currentContent),
          Math.ceil(limit / nextTypes.length)
        );
        
        nextContent.forEach(item => {
          recommendations.push({
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type,
            url: item.url,
            recommendation_score: 0.7,
            recommendation_reason: `Next step in learning progression from ${currentContent.type}`,
            difficulty_level: this.inferDifficultyLevel(item, userProfile),
            estimated_time: this.estimateContentTime(item),
            metadata: item.metadata || {}
          });
        });
      }
      
    } catch (error) {
      console.warn('Could not generate progression recommendations:', error);
    }
    
    return recommendations;
  }
  
  /**
   * Get Indigenous knowledge pathway recommendations
   */
  private async getIndigenousKnowledgeRecommendations(
    currentContent: any,
    limit: number
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    try {
      // Detect if current content has Indigenous context
      const indigenousContext = detectIndigenousContext(currentContent.content || currentContent.description);
      
      if (indigenousContext.hasIndigenousContent) {
        // Find related Indigenous knowledge content
        const indigenousContent = await this.db.all(`
          SELECT 
            id, title, content, document_type, 'knowledge' as type,
            '/knowledge/' || id as url
          FROM knowledge_documents 
          WHERE (content LIKE '%indigenous%' OR content LIKE '%traditional%' 
                 OR content LIKE '%cultural%' OR content LIKE '%ceremony%'
                 OR content LIKE '%custodian%' OR content LIKE '%elder%')
            AND id != ?
          ORDER BY updated_at DESC
          LIMIT ?
        `, [currentContent.id, limit]);
        
        indigenousContent.forEach(item => {
          const contextDetection = detectIndigenousContext(item.content);
          recommendations.push({
            id: item.id,
            title: item.title,
            description: item.content.substring(0, 200) + '...',
            type: 'knowledge',
            url: item.url,
            recommendation_score: 0.9 + (contextDetection.confidence * 0.1),
            recommendation_reason: 'Related Indigenous knowledge pathway',
            cultural_context: `Indigenous content (${Math.round(contextDetection.confidence * 100)}% confidence)`,
            metadata: {
              document_type: item.document_type,
              indigenous_concepts: contextDetection.concepts
            }
          });
        });
      }
      
    } catch (error) {
      console.warn('Could not generate Indigenous knowledge recommendations:', error);
    }
    
    return recommendations;
  }
  
  /**
   * Get community-driven recommendations
   */
  private async getCommunityRecommendations(
    currentContent: any,
    userInterests: string[],
    limit: number
  ): Promise<ContentRecommendation[]> {
    const recommendations: ContentRecommendation[] = [];
    
    try {
      // Get popular content in similar categories
      const popularContent = await this.db.all(`
        SELECT 
          id, title, description, content_type, category, 'content' as type,
          COALESCE(url, '/content/' || id) as url
        FROM content 
        WHERE category = ? AND id != ?
        ORDER BY updated_at DESC
        LIMIT ?
      `, [currentContent.category || 'general', currentContent.id, limit]);
      
      popularContent.forEach(item => {
        recommendations.push({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          url: item.url,
          recommendation_score: 0.6,
          recommendation_reason: `Popular in ${item.category} category`,
          metadata: {
            content_type: item.content_type,
            category: item.category
          }
        });
      });
      
    } catch (error) {
      console.warn('Could not generate community recommendations:', error);
    }
    
    return recommendations;
  }
  
  /**
   * Helper methods
   */
  private async getCurrentContent(contentId: string, contentType: string): Promise<any> {
    const queries = {
      'knowledge': `SELECT id, title, content, document_type FROM knowledge_documents WHERE id = ?`,
      'business_case': `SELECT id, title, description, content, category FROM business_cases WHERE id = ?`,
      'tool': `SELECT id, title, description FROM tools WHERE id = ?`,
      'content': `SELECT id, title, description, content_type, category FROM content WHERE id = ?`,
      'hoodie': `SELECT id, name as title, description, category FROM hoodies WHERE id = ?`
    };
    
    const query = queries[contentType as keyof typeof queries];
    if (!query) return null;
    
    return await this.db.get(query, [contentId]);
  }
  
  private async getUserProfile(userId: string): Promise<UserLearningProfile | null> {
    // This would typically come from a user profiles table
    // For now, return a default profile
    return {
      user_id: userId,
      interests: [],
      completed_content: [],
      current_level: 'intermediate',
      preferred_content_types: ['knowledge', 'video', 'business_case'],
      cultural_preferences: {
        indigenous_focused: false,
        cultural_sensitivity_level: 'standard'
      },
      learning_path: [],
      engagement_history: []
    };
  }
  
  private async findSimilarKnowledgeContent(currentContent: any, limit: number): Promise<any[]> {
    const results = await this.db.all(`
      SELECT id, title, content, 'knowledge' as type, '/knowledge/' || id as url
      FROM knowledge_documents 
      WHERE id != ? 
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [currentContent.id, limit * 2]);
    
    // Calculate similarity scores
    const contentText = currentContent.content || currentContent.description || currentContent.title;
    
    return await Promise.all(
      results.map(async (item) => ({
        ...item,
        description: item.content.substring(0, 200) + '...',
        similarity_score: await calculateSemanticSimilarity(contentText, item.content)
      }))
    ).then(items => 
      items.filter(item => item.similarity_score > 0.1)
           .sort((a, b) => b.similarity_score - a.similarity_score)
           .slice(0, limit)
    );
  }
  
  private async findSimilarBusinessCases(currentContent: any, limit: number): Promise<any[]> {
    return await this.db.all(`
      SELECT id, title, description, 'business_case' as type, 
             '/business-cases/' || id as url, 0.5 as similarity_score
      FROM business_cases 
      WHERE id != ? 
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [currentContent.id, limit]);
  }
  
  private async findSimilarTools(currentContent: any, limit: number): Promise<any[]> {
    return await this.db.all(`
      SELECT id, title, description, 'tool' as type,
             COALESCE(url, '/tools/' || id) as url, 0.4 as similarity_score
      FROM tools 
      WHERE id != ? 
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [currentContent.id, limit]);
  }
  
  private async findSimilarVideos(currentContent: any, limit: number): Promise<any[]> {
    return await this.db.all(`
      SELECT id, title, description, 'video' as type,
             COALESCE(url, '/videos/' || id) as url, 0.3 as similarity_score
      FROM content 
      WHERE content_type = 'video' AND id != ? 
      ORDER BY updated_at DESC 
      LIMIT ?
    `, [currentContent.id, limit]);
  }
  
  private async getContentByTypeAndTopics(type: string, topics: string[], limit: number): Promise<any[]> {
    // Simplified implementation - would be more sophisticated in practice
    const queries = {
      'knowledge': `SELECT id, title, content as description, 'knowledge' as type, '/knowledge/' || id as url FROM knowledge_documents ORDER BY updated_at DESC LIMIT ?`,
      'business_case': `SELECT id, title, description, 'business_case' as type, '/business-cases/' || id as url FROM business_cases ORDER BY updated_at DESC LIMIT ?`,
      'tool': `SELECT id, title, description, 'tool' as type, COALESCE(url, '/tools/' || id) as url FROM tools ORDER BY updated_at DESC LIMIT ?`,
      'video': `SELECT id, title, description, 'video' as type, COALESCE(url, '/videos/' || id) as url FROM content WHERE content_type = 'video' ORDER BY updated_at DESC LIMIT ?`
    };
    
    const query = queries[type as keyof typeof queries];
    if (!query) return [];
    
    return await this.db.all(query, [limit]);
  }
  
  private extractTopics(content: any): string[] {
    const text = (content.content || content.description || content.title || '').toLowerCase();
    const topics = [];
    
    // Extract key topics (simplified)
    const topicKeywords = [
      'indigenous', 'mentoring', 'leadership', 'systems', 'transformation',
      'education', 'youth', 'community', 'culture', 'innovation'
    ];
    
    topicKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        topics.push(keyword);
      }
    });
    
    return topics;
  }
  
  private deduplicateRecommendations(recommendations: ContentRecommendation[], currentId: string): ContentRecommendation[] {
    const seen = new Set([currentId]);
    return recommendations.filter(rec => {
      if (seen.has(rec.id)) return false;
      seen.add(rec.id);
      return true;
    });
  }
  
  private personalizeRecommendations(
    recommendations: ContentRecommendation[],
    userProfile: UserLearningProfile | null,
    userInterests: string[],
    learningGoals: string[]
  ): ContentRecommendation[] {
    return recommendations.map(rec => {
      let personalizedScore = rec.recommendation_score;
      
      // Boost based on user interests
      if (userInterests.length > 0) {
        const titleLower = rec.title.toLowerCase();
        const descLower = rec.description.toLowerCase();
        const matchingInterests = userInterests.filter(interest => 
          titleLower.includes(interest.toLowerCase()) || descLower.includes(interest.toLowerCase())
        );
        personalizedScore += matchingInterests.length * 0.1;
      }
      
      // Boost based on user profile preferences
      if (userProfile) {
        if (userProfile.preferred_content_types.includes(rec.type)) {
          personalizedScore += 0.15;
        }
        
        if (userProfile.cultural_preferences.indigenous_focused && rec.cultural_context) {
          personalizedScore += 0.2;
        }
      }
      
      return {
        ...rec,
        recommendation_score: Math.min(personalizedScore, 1.0) // Cap at 1.0
      };
    });
  }
  
  private inferDifficultyLevel(content: any, userProfile: UserLearningProfile | null): 'beginner' | 'intermediate' | 'advanced' {
    // Simplified difficulty inference
    const text = (content.content || content.description || content.title || '').toLowerCase();
    
    if (text.includes('introduction') || text.includes('basics') || text.includes('getting started')) {
      return 'beginner';
    } else if (text.includes('advanced') || text.includes('expert') || text.includes('mastery')) {
      return 'advanced';
    }
    
    return 'intermediate';
  }
  
  private estimateContentTime(content: any): string {
    const type = content.type;
    const contentLength = (content.content || content.description || '').length;
    
    // Rough time estimates based on content type and length
    if (type === 'video') return '15-30 min';
    if (type === 'business_case') return '10-20 min';
    if (type === 'tool') return '5-15 min';
    if (type === 'knowledge') {
      if (contentLength > 2000) return '20-40 min';
      if (contentLength > 1000) return '10-20 min';
      return '5-10 min';
    }
    
    return '10-15 min';
  }
}

/**
 * Global recommendation engine instance
 */
let recommendationEngine: ContentRecommendationEngine | null = null;

export async function getRecommendationEngine(): Promise<ContentRecommendationEngine> {
  if (!recommendationEngine) {
    recommendationEngine = new ContentRecommendationEngine();
  }
  return recommendationEngine;
}

/**
 * Quick recommendation function for API use
 */
export async function getContentRecommendations(request: RecommendationRequest): Promise<ContentRecommendation[]> {
  const engine = await getRecommendationEngine();
  return await engine.getRecommendations(request);
}