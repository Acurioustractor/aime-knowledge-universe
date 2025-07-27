/**
 * Automatic Relationship Detection Service
 * 
 * Analyzes content to automatically detect and create relationships between:
 * - Business cases ↔ Tools
 * - Business cases ↔ Videos  
 * - Tools ↔ Videos
 * - Content based on shared themes, tags, and mentions
 */

import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { BusinessCasesRepository } from '../database/business-cases-repository';

export interface DetectedRelationship {
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  reason: string;
}

export class RelationshipDetector {
  private businessCasesRepo: BusinessCasesRepository;

  constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
    this.businessCasesRepo = new BusinessCasesRepository(db);
  }

  /**
   * Analyze and create relationships for a business case
   */
  async analyzeBusinessCase(caseId: string): Promise<DetectedRelationship[]> {
    const businessCase = await this.businessCasesRepo.getBusinessCase(caseId);
    if (!businessCase) return [];

    const relationships: DetectedRelationship[] = [];

    // Find related tools based on text analysis
    const relatedTools = await this.findRelatedTools(businessCase);
    relationships.push(...relatedTools);

    // Find related videos based on content matching
    const relatedVideos = await this.findRelatedVideos(businessCase);
    relationships.push(...relatedVideos);

    // Find similar business cases
    const similarCases = await this.findSimilarCases(businessCase);
    relationships.push(...similarCases);

    // Create the relationships in the database
    for (const rel of relationships) {
      await this.businessCasesRepo.createRelationship(rel);
    }

    return relationships;
  }

  /**
   * Find tools that relate to a business case
   */
  private async findRelatedTools(businessCase: any): Promise<DetectedRelationship[]> {
    const relationships: DetectedRelationship[] = [];

    // Search for tools with matching tags
    const tagMatches = await this.db.all(`
      SELECT id, title, tags, description 
      FROM content 
      WHERE content_type = 'tool'
      AND tags IS NOT NULL
    `);

    for (const tool of tagMatches) {
      const toolTags = JSON.parse(tool.tags || '[]');
      const commonTags = businessCase.tags.filter((tag: string) => 
        toolTags.some((toolTag: string) => 
          toolTag.toLowerCase() === tag.toLowerCase()
        )
      );

      if (commonTags.length > 0) {
        relationships.push({
          source_type: 'business_case',
          source_id: businessCase.id,
          target_type: 'tool',
          target_id: tool.id,
          relationship_type: 'uses',
          strength: Math.min(commonTags.length * 0.3, 1.0),
          reason: `Shared tags: ${commonTags.join(', ')}`
        });
      }

      // Check for title/description mentions
      const caseText = `${businessCase.title} ${businessCase.summary} ${businessCase.solution}`.toLowerCase();
      const toolTitle = tool.title.toLowerCase();

      if (caseText.includes(toolTitle) || 
          (tool.description && caseText.includes(tool.description.toLowerCase().substring(0, 50)))) {
        relationships.push({
          source_type: 'business_case',
          source_id: businessCase.id,
          target_type: 'tool',
          target_id: tool.id,
          relationship_type: 'mentions',
          strength: 0.8,
          reason: `Business case mentions "${tool.title}"`
        });
      }
    }

    // Deduplicate by keeping highest strength
    const uniqueRels = new Map<string, DetectedRelationship>();
    relationships.forEach(rel => {
      const key = `${rel.target_id}`;
      const existing = uniqueRels.get(key);
      if (!existing || rel.strength > existing.strength) {
        uniqueRels.set(key, rel);
      }
    });

    return Array.from(uniqueRels.values());
  }

  /**
   * Find videos that relate to a business case
   */
  private async findRelatedVideos(businessCase: any): Promise<DetectedRelationship[]> {
    const relationships: DetectedRelationship[] = [];

    // Search videos by theme and content matching
    const videos = await this.db.all(`
      SELECT id, title, description, tags, themes 
      FROM content 
      WHERE content_type = 'video'
    `);

    for (const video of videos) {
      let strength = 0;
      const reasons: string[] = [];

      // Check tag overlap
      if (video.tags) {
        const videoTags = JSON.parse(video.tags);
        const commonTags = businessCase.tags.filter((tag: string) =>
          videoTags.some((vTag: string) => vTag.toLowerCase() === tag.toLowerCase())
        );
        if (commonTags.length > 0) {
          strength += commonTags.length * 0.2;
          reasons.push(`Tags: ${commonTags.join(', ')}`);
        }
      }

      // Check theme matching
      if (video.themes) {
        const videoThemes = JSON.parse(video.themes);
        const caseThemes = this.extractThemes(businessCase);
        const commonThemes = caseThemes.filter((theme: string) =>
          videoThemes.some((vTheme: string) => vTheme.toLowerCase().includes(theme.toLowerCase()))
        );
        if (commonThemes.length > 0) {
          strength += commonThemes.length * 0.3;
          reasons.push(`Themes: ${commonThemes.join(', ')}`);
        }
      }

      // Check content similarity
      const similarity = this.calculateTextSimilarity(
        `${businessCase.title} ${businessCase.summary}`,
        `${video.title} ${video.description || ''}`
      );
      if (similarity > 0.3) {
        strength += similarity * 0.5;
        reasons.push(`Content similarity: ${Math.round(similarity * 100)}%`);
      }

      if (strength > 0.2) {
        relationships.push({
          source_type: 'business_case',
          source_id: businessCase.id,
          target_type: 'video',
          target_id: video.id,
          relationship_type: 'illustrates',
          strength: Math.min(strength, 1.0),
          reason: reasons.join('; ')
        });
      }
    }

    return relationships;
  }

  /**
   * Find similar business cases
   */
  private async findSimilarCases(businessCase: any): Promise<DetectedRelationship[]> {
    const relationships: DetectedRelationship[] = [];

    const otherCases = await this.db.all(`
      SELECT id, title, summary, tags, industry, region, program_type
      FROM business_cases
      WHERE id != ?
    `, [businessCase.id]);

    for (const otherCase of otherCases) {
      let strength = 0;
      const reasons: string[] = [];

      // Same industry
      if (otherCase.industry === businessCase.industry) {
        strength += 0.2;
        reasons.push(`Same industry: ${businessCase.industry}`);
      }

      // Same region
      if (otherCase.region === businessCase.region) {
        strength += 0.2;
        reasons.push(`Same region: ${businessCase.region}`);
      }

      // Same program type
      if (otherCase.program_type === businessCase.program_type) {
        strength += 0.3;
        reasons.push(`Same program: ${businessCase.program_type}`);
      }

      // Tag overlap
      const otherTags = JSON.parse(otherCase.tags || '[]');
      const commonTags = businessCase.tags.filter((tag: string) =>
        otherTags.includes(tag)
      );
      if (commonTags.length > 0) {
        strength += commonTags.length * 0.1;
        reasons.push(`Shared tags: ${commonTags.join(', ')}`);
      }

      if (strength > 0.3) {
        relationships.push({
          source_type: 'business_case',
          source_id: businessCase.id,
          target_type: 'business_case',
          target_id: otherCase.id,
          relationship_type: 'similar_to',
          strength: Math.min(strength, 1.0),
          reason: reasons.join('; ')
        });
      }
    }

    return relationships;
  }

  /**
   * Extract themes from business case content
   */
  private extractThemes(businessCase: any): string[] {
    const themes = new Set<string>();
    
    // Common AIME themes to look for
    const themeKeywords = {
      'mentoring': ['mentor', 'mentoring', 'guidance', 'support'],
      'education': ['education', 'school', 'university', 'learning', 'student'],
      'indigenous': ['indigenous', 'aboriginal', 'first nations', 'traditional'],
      'youth': ['youth', 'young people', 'teenager', 'student'],
      'leadership': ['leader', 'leadership', 'empower', 'inspire'],
      'imagination': ['imagination', 'creative', 'innovation', 'imagine'],
      'community': ['community', 'together', 'collective', 'social'],
      'pathways': ['pathway', 'journey', 'career', 'future', 'opportunity']
    };

    const caseText = `${businessCase.title} ${businessCase.summary} ${businessCase.solution}`.toLowerCase();

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => caseText.includes(keyword))) {
        themes.add(theme);
      }
    }

    return Array.from(themes);
  }

  /**
   * Calculate simple text similarity between two strings
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Analyze all content and build relationship graph
   */
  async analyzeAllContent(): Promise<{
    total_relationships: number;
    by_type: Record<string, number>;
  }> {
    console.log('🔍 Starting comprehensive relationship analysis...');

    // Get all business cases
    const cases = await this.db.all('SELECT id FROM business_cases');
    let totalRelationships = 0;

    for (const caseRow of cases) {
      const relationships = await this.analyzeBusinessCase(caseRow.id);
      totalRelationships += relationships.length;
      console.log(`✓ Analyzed case ${caseRow.id}: ${relationships.length} relationships found`);
    }

    // Get relationship stats
    const stats = await this.db.all(`
      SELECT relationship_type, COUNT(*) as count
      FROM content_relationships
      GROUP BY relationship_type
    `);

    const byType = Object.fromEntries(stats.map(s => [s.relationship_type, s.count]));

    console.log(`✅ Relationship analysis complete: ${totalRelationships} new relationships created`);

    return {
      total_relationships: totalRelationships,
      by_type: byType
    };
  }
}