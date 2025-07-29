/**
 * Content Relationship Mapping Engine
 * 
 * AI-powered system for detecting and managing relationships between content items
 */

import { ContentItem, ContentRelationship } from '@/lib/database/enhanced-supabase';

export type RelationshipType = 'implements' | 'supports' | 'contradicts' | 'builds_on' | 'exemplifies' | 'prerequisite_for';

export interface RelationshipSuggestion {
  sourceContentId: string;
  targetContentId: string;
  relationshipType: RelationshipType;
  strength: number;
  confidence: number;
  reasoning: string;
  evidence: string[];
}

export interface ConceptMatch {
  concept: string;
  contentIds: string[];
  strength: number;
  context: string;
}

/**
 * Content Relationship Engine
 * Analyzes content to identify semantic relationships and concept clusters
 */
export class RelationshipEngine {
  private openaiApiKey: string;

  constructor(openaiApiKey?: string) {
    this.openaiApiKey = openaiApiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Analyze content relationships using AI
   */
  async analyzeContentRelationships(
    sourceContent: ContentItem,
    candidateContent: ContentItem[]
  ): Promise<RelationshipSuggestion[]> {
    const suggestions: RelationshipSuggestion[] = [];

    for (const candidate of candidateContent) {
      if (candidate.id === sourceContent.id) continue;

      // Skip if relationship already exists
      // TODO: Check existing relationships in database

      const suggestion = await this.analyzeContentPair(sourceContent, candidate);
      if (suggestion && suggestion.confidence > 0.6) {
        suggestions.push(suggestion);
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze relationship between two specific content items
   */
  private async analyzeContentPair(
    sourceContent: ContentItem,
    targetContent: ContentItem
  ): Promise<RelationshipSuggestion | null> {
    try {
      // Use rule-based analysis for now, can be enhanced with AI later
      const relationship = this.detectRelationshipRuleBased(sourceContent, targetContent);
      
      if (relationship) {
        return {
          sourceContentId: sourceContent.id,
          targetContentId: targetContent.id,
          relationshipType: relationship.type,
          strength: relationship.strength,
          confidence: relationship.confidence,
          reasoning: relationship.reasoning,
          evidence: relationship.evidence
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing content pair:', error);
      return null;
    }
  }

  /**
   * Rule-based relationship detection
   */
  private detectRelationshipRuleBased(
    sourceContent: ContentItem,
    targetContent: ContentItem
  ): { type: RelationshipType; strength: number; confidence: number; reasoning: string; evidence: string[] } | null {
    const evidence: string[] = [];
    let relationshipType: RelationshipType | null = null;
    let strength = 0;
    let confidence = 0;
    let reasoning = '';

    // Same philosophy domain suggests relationship
    if (sourceContent.philosophy_domain === targetContent.philosophy_domain && sourceContent.philosophy_domain) {
      evidence.push(`Both content items belong to ${sourceContent.philosophy_domain} domain`);
      strength += 0.3;
    }

    // Complexity level analysis
    if (sourceContent.complexity_level && targetContent.complexity_level) {
      const complexityDiff = targetContent.complexity_level - sourceContent.complexity_level;
      
      if (complexityDiff === 1) {
        relationshipType = 'builds_on';
        strength += 0.4;
        evidence.push('Target content is one complexity level higher');
        reasoning = 'Target content builds upon concepts in source content';
      } else if (complexityDiff === -1) {
        relationshipType = 'prerequisite_for';
        strength += 0.4;
        evidence.push('Source content is one complexity level higher');
        reasoning = 'Source content is a prerequisite for target content';
      }
    }

    // Content type analysis
    if (sourceContent.content_type === 'research' && targetContent.content_type === 'tool') {
      relationshipType = relationshipType || 'supports';
      strength += 0.3;
      evidence.push('Research content supports practical tool');
      reasoning = reasoning || 'Research provides theoretical foundation for practical tool';
    } else if (sourceContent.content_type === 'tool' && targetContent.content_type === 'story') {
      relationshipType = relationshipType || 'exemplifies';
      strength += 0.3;
      evidence.push('Story exemplifies tool in practice');
      reasoning = reasoning || 'Story demonstrates practical application of tool';
    } else if (sourceContent.content_type === 'video' && targetContent.content_type === 'tool') {
      relationshipType = relationshipType || 'implements';
      strength += 0.2;
      evidence.push('Video content implements concepts from tool');
      reasoning = reasoning || 'Video demonstrates implementation of tool concepts';
    }

    // Keyword and concept overlap
    const sourceKeywords = [
      ...sourceContent.tags,
      ...sourceContent.key_concepts,
      ...sourceContent.themes
    ].map(k => k.toLowerCase());

    const targetKeywords = [
      ...targetContent.tags,
      ...targetContent.key_concepts,
      ...targetContent.themes
    ].map(k => k.toLowerCase());

    const commonKeywords = sourceKeywords.filter(k => targetKeywords.includes(k));
    const keywordOverlap = commonKeywords.length / Math.max(sourceKeywords.length, targetKeywords.length);

    if (keywordOverlap > 0.3) {
      strength += keywordOverlap * 0.4;
      evidence.push(`${Math.round(keywordOverlap * 100)}% keyword overlap: ${commonKeywords.slice(0, 3).join(', ')}`);
    }

    // Title and description similarity (simple word matching)
    const titleSimilarity = this.calculateTextSimilarity(sourceContent.title, targetContent.title);
    const descriptionSimilarity = sourceContent.description && targetContent.description 
      ? this.calculateTextSimilarity(sourceContent.description, targetContent.description)
      : 0;

    if (titleSimilarity > 0.3 || descriptionSimilarity > 0.2) {
      strength += Math.max(titleSimilarity, descriptionSimilarity) * 0.3;
      evidence.push('Similar titles or descriptions detected');
    }

    // Author overlap
    const commonAuthors = sourceContent.authors.filter(a => targetContent.authors.includes(a));
    if (commonAuthors.length > 0) {
      strength += 0.2;
      evidence.push(`Common authors: ${commonAuthors.join(', ')}`);
    }

    // Calculate confidence based on evidence strength
    confidence = Math.min(strength + (evidence.length * 0.1), 1.0);

    // Only return relationship if we have sufficient confidence
    if (confidence > 0.4 && relationshipType) {
      return {
        type: relationshipType,
        strength: Math.min(strength, 1.0),
        confidence,
        reasoning: reasoning || 'Content items share common themes and concepts',
        evidence
      };
    }

    return null;
  }

  /**
   * Simple text similarity calculation
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    const commonWords = words1.filter(w => words2.includes(w));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Extract concept clusters from content collection
   */
  async extractConceptClusters(content: ContentItem[]): Promise<ConceptMatch[]> {
    const conceptMap = new Map<string, { contentIds: string[]; contexts: string[] }>();

    // Collect all concepts from content
    for (const item of content) {
      const concepts = [
        ...item.key_concepts,
        ...item.themes,
        ...item.tags.filter(tag => tag.length > 3) // Filter out short tags
      ];

      for (const concept of concepts) {
        const normalizedConcept = concept.toLowerCase().trim();
        if (!conceptMap.has(normalizedConcept)) {
          conceptMap.set(normalizedConcept, { contentIds: [], contexts: [] });
        }
        
        const entry = conceptMap.get(normalizedConcept)!;
        if (!entry.contentIds.includes(item.id)) {
          entry.contentIds.push(item.id);
          entry.contexts.push(`${item.title} (${item.content_type})`);
        }
      }
    }

    // Convert to concept matches, filtering for concepts that appear in multiple items
    const conceptMatches: ConceptMatch[] = [];
    
    for (const [concept, data] of conceptMap.entries()) {
      if (data.contentIds.length >= 2) { // Only include concepts that appear in multiple items
        conceptMatches.push({
          concept,
          contentIds: data.contentIds,
          strength: Math.min(data.contentIds.length / content.length, 1.0),
          context: data.contexts.slice(0, 3).join(', ')
        });
      }
    }

    return conceptMatches.sort((a, b) => b.strength - a.strength);
  }

  /**
   * Generate relationship suggestions for new content
   */
  async suggestRelationshipsForNewContent(
    newContent: ContentItem,
    existingContent: ContentItem[],
    maxSuggestions: number = 10
  ): Promise<RelationshipSuggestion[]> {
    // Filter existing content to relevant candidates
    const candidates = existingContent.filter(item => {
      // Same philosophy domain
      if (item.philosophy_domain === newContent.philosophy_domain) return true;
      
      // Similar content type
      if (item.content_type === newContent.content_type) return true;
      
      // Overlapping keywords
      const overlap = this.calculateKeywordOverlap(newContent, item);
      if (overlap > 0.2) return true;
      
      return false;
    });

    const suggestions = await this.analyzeContentRelationships(newContent, candidates);
    return suggestions.slice(0, maxSuggestions);
  }

  /**
   * Calculate keyword overlap between two content items
   */
  private calculateKeywordOverlap(content1: ContentItem, content2: ContentItem): number {
    const keywords1 = [
      ...content1.tags,
      ...content1.key_concepts,
      ...content1.themes
    ].map(k => k.toLowerCase());

    const keywords2 = [
      ...content2.tags,
      ...content2.key_concepts,
      ...content2.themes
    ].map(k => k.toLowerCase());

    const commonKeywords = keywords1.filter(k => keywords2.includes(k));
    return commonKeywords.length / Math.max(keywords1.length, keywords2.length);
  }

  /**
   * Validate relationship suggestion
   */
  validateRelationship(suggestion: RelationshipSuggestion): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check confidence threshold
    if (suggestion.confidence < 0.6) {
      issues.push('Low confidence score');
      recommendations.push('Consider manual review before accepting');
    }

    // Check for circular relationships
    if (suggestion.relationshipType === 'builds_on' || suggestion.relationshipType === 'prerequisite_for') {
      // TODO: Check for circular dependencies in database
      recommendations.push('Verify no circular dependencies exist');
    }

    // Check evidence quality
    if (suggestion.evidence.length < 2) {
      issues.push('Limited evidence for relationship');
      recommendations.push('Gather additional evidence before confirming');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Generate relationship explanation for users
   */
  generateRelationshipExplanation(
    sourceContent: ContentItem,
    targetContent: ContentItem,
    relationship: ContentRelationship
  ): string {
    const typeExplanations = {
      implements: `"${targetContent.title}" demonstrates practical implementation of concepts from "${sourceContent.title}"`,
      supports: `"${sourceContent.title}" provides supporting evidence or context for "${targetContent.title}"`,
      contradicts: `"${sourceContent.title}" presents alternative perspectives to those in "${targetContent.title}"`,
      builds_on: `"${targetContent.title}" extends and builds upon the foundation established in "${sourceContent.title}"`,
      exemplifies: `"${targetContent.title}" serves as a concrete example of principles discussed in "${sourceContent.title}"`,
      prerequisite_for: `"${sourceContent.title}" provides essential background knowledge needed to understand "${targetContent.title}"`
    };

    let explanation = typeExplanations[relationship.relationship_type] || 'These content items are related';
    
    if (relationship.context) {
      explanation += `. ${relationship.context}`;
    }

    return explanation;
  }
}

// Singleton instance
export const relationshipEngine = new RelationshipEngine();