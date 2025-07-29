/**
 * Business Case Areas Parser
 * 
 * Processes the large source document and breaks it into structured business case areas
 * Creates cards, summaries, and full pages automatically
 */

import fs from 'fs';
import path from 'path';
import { getDatabase } from '../database/connection';
import { BusinessCasesRepository } from '../database/business-cases-repository';

export interface BusinessCaseArea {
  id: string;
  title: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  stakeholders: string[];
  timeline: string;
  metrics: Record<string, any>;
  related_programs: string[];
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in_progress' | 'planned';
}

export interface ProcessedDocument {
  areas: BusinessCaseArea[];
  categories: string[];
  summary: string;
  total_count: number;
  cross_references: Array<{
    source_id: string;
    target_id: string;
    relationship: string;
    strength: number;
  }>;
}

export class BusinessCaseParser {
  private repository: BusinessCasesRepository;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const db = await getDatabase();
    this.repository = new BusinessCasesRepository(db);
    await this.repository.initializeSchema();
  }

  /**
   * Parse the source document and extract business case areas
   */
  async parseSourceDocument(): Promise<ProcessedDocument> {
    const sourcePath = path.join(process.cwd(), 'BUSINESS_CASE_AREAS_SOURCE.md');
    
    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source document not found. Please add your content to BUSINESS_CASE_AREAS_SOURCE.md');
    }

    const content = fs.readFileSync(sourcePath, 'utf-8');
    
    // Extract the actual content (after the instructions)
    const contentStart = content.indexOf('<!-- PASTE YOUR LARGE DOCUMENT BELOW THIS LINE -->');
    const actualContent = contentStart > -1 ? content.substring(contentStart) : content;

    if (actualContent.trim().length < 100) {
      throw new Error('Please add your business case areas content to the source document');
    }

    // Parse the content into structured areas
    const areas = await this.extractBusinessCaseAreas(actualContent);
    const categories = this.extractCategories(areas);
    const crossReferences = this.findCrossReferences(areas);
    
    const summary = this.generateSummary(areas, categories);

    return {
      areas,
      categories,
      summary,
      total_count: areas.length,
      cross_references: crossReferences
    };
  }

  /**
   * Extract individual business case areas from the content
   */
  private async extractBusinessCaseAreas(content: string): Promise<BusinessCaseArea[]> {
    const areas: BusinessCaseArea[] = [];
    
    // Split content by major sections (## headings)
    const sections = content.split(/\n## /).filter(section => section.trim().length > 0);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length < 2) continue;
      
      // Extract title (first line, remove any leading ##)
      const title = lines[0].replace(/^#+\s*/, '').trim();
      if (title.toLowerCase().includes('instruction') || title.toLowerCase().includes('processing')) {
        continue; // Skip instruction sections
      }

      // Try to extract structured information
      const area = await this.parseSection(section, title, i);
      if (area) {
        areas.push(area);
      }
    }

    // If no structured areas found, try parsing by paragraphs/bullets
    if (areas.length === 0) {
      return this.parseUnstructuredContent(content);
    }

    return areas;
  }

  /**
   * Parse a single section into a business case area
   */
  private async parseSection(section: string, title: string, index: number): Promise<BusinessCaseArea | null> {
    const lines = section.split('\n');
    const content = section.toLowerCase();
    
    // Create ID from title
    const id = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // Try to extract key information using patterns
    const challenge = this.extractByPattern(section, ['challenge', 'problem', 'issue']);
    const solution = this.extractByPattern(section, ['solution', 'approach', 'strategy', 'method']);
    const impact = this.extractByPattern(section, ['impact', 'outcome', 'result', 'benefit']);
    const stakeholders = this.extractStakeholders(section);
    const timeline = this.extractByPattern(section, ['timeline', 'duration', 'timeframe', 'period']);
    
    // Determine category based on content
    const category = this.determineCategory(title, section);
    
    // Extract metrics
    const metrics = this.extractMetrics(section);
    
    // Generate summary if not explicitly provided
    const summary = this.generateAreaSummary(title, challenge, solution, impact);
    
    // Extract tags
    const tags = this.extractTags(title, section);
    
    // Determine priority based on content indicators
    const priority = this.determinePriority(section);
    
    // Determine status
    const status = this.determineStatus(section);

    return {
      id,
      title,
      category,
      summary,
      challenge: challenge || 'Challenge details to be documented',
      solution: solution || 'Solution approach to be documented',
      impact: impact || 'Impact metrics to be measured',
      stakeholders,
      timeline: timeline || 'Timeline to be defined',
      metrics,
      related_programs: this.extractRelatedPrograms(section),
      tags,
      priority,
      status
    };
  }

  /**
   * Parse unstructured content by looking for key phrases and patterns
   */
  private parseUnstructuredContent(content: string): BusinessCaseArea[] {
    const areas: BusinessCaseArea[] = [];
    
    // Look for bullet points, numbered lists, or paragraph breaks that might indicate different areas
    const potentialAreas = content.split(/\n\s*[-•*]\s+|\n\d+\.\s+|\n\n+/)
      .filter(item => item.trim().length > 50) // Only substantial content
      .slice(0, 20); // Limit to reasonable number

    potentialAreas.forEach((item, index) => {
      const lines = item.split('\n').filter(line => line.trim().length > 0);
      if (lines.length === 0) return;

      // Use first line as title, or extract from content
      let title = lines[0].replace(/^#+\s*/, '').trim();
      if (title.length > 100) {
        title = title.substring(0, 100) + '...';
      }

      const id = `area-${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)}`;
      
      areas.push({
        id,
        title,
        category: this.determineCategory(title, item),
        summary: item.substring(0, 200) + '...',
        challenge: 'To be documented based on source content',
        solution: 'To be detailed from source material',
        impact: 'Impact metrics to be defined',
        stakeholders: this.extractStakeholders(item),
        timeline: 'Timeline to be specified',
        metrics: {},
        related_programs: [],
        tags: this.extractTags(title, item),
        priority: 'medium',
        status: 'planned'
      });
    });

    return areas;
  }

  /**
   * Extract information using common patterns
   */
  private extractByPattern(content: string, keywords: string[]): string {
    const lines = content.split('\n');
    
    for (const keyword of keywords) {
      // Look for lines that start with the keyword
      const directMatch = lines.find(line => 
        line.toLowerCase().includes(keyword + ':') || 
        line.toLowerCase().includes(keyword + ' -') ||
        line.toLowerCase().startsWith(keyword)
      );
      
      if (directMatch) {
        return directMatch.replace(new RegExp(`^.*${keyword}:?\\s*`, 'i'), '').trim();
      }
      
      // Look for paragraphs that contain the keyword
      const sections = content.split('\n\n');
      const contextMatch = sections.find(section => 
        section.toLowerCase().includes(keyword) && section.length > 50
      );
      
      if (contextMatch) {
        return contextMatch.trim();
      }
    }
    
    return '';
  }

  /**
   * Extract stakeholders from content
   */
  private extractStakeholders(content: string): string[] {
    const stakeholderKeywords = [
      'students', 'teachers', 'educators', 'schools', 'universities', 
      'communities', 'families', 'government', 'companies', 'partners',
      'mentors', 'leaders', 'administrators', 'policymakers'
    ];
    
    const found = new Set<string>();
    const words = content.toLowerCase().split(/\s+/);
    
    stakeholderKeywords.forEach(keyword => {
      if (words.includes(keyword) || words.includes(keyword.slice(0, -1))) {
        found.add(keyword);
      }
    });
    
    return Array.from(found);
  }

  /**
   * Determine category based on content
   */
  private determineCategory(title: string, content: string): string {
    const categoryKeywords = {
      'Education': ['education', 'school', 'university', 'curriculum', 'learning'],
      'Corporate': ['corporate', 'business', 'company', 'industry', 'workplace'],
      'Government': ['government', 'policy', 'department', 'ministry', 'council'],
      'Community': ['community', 'local', 'indigenous', 'cultural', 'traditional'],
      'Technology': ['technology', 'digital', 'platform', 'online', 'tech'],
      'Training': ['training', 'professional development', 'capacity building', 'skills'],
      'Partnership': ['partnership', 'collaboration', 'alliance', 'cooperation']
    };
    
    const combinedText = (title + ' ' + content).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => combinedText.includes(keyword))) {
        return category;
      }
    }
    
    return 'General';
  }

  /**
   * Extract metrics and numbers from content
   */
  private extractMetrics(content: string): Record<string, any> {
    const metrics: Record<string, any> = {};
    
    // Look for number patterns
    const numberPatterns = [
      /(\d+(?:,\d{3})*)\s*(?:students?|people|participants?)/gi,
      /(\d+(?:\.\d+)?)%\s*(?:increase|improvement|completion|success)/gi,
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|thousand|investment|funding)/gi,
      /(\d+)\s*(?:years?|months?|weeks?)/gi
    ];
    
    numberPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match, i) => {
          const key = `metric_${index}_${i}`;
          metrics[key] = match;
        });
      }
    });
    
    return metrics;
  }

  /**
   * Extract tags from content
   */
  private extractTags(title: string, content: string): string[] {
    const commonTags = [
      'indigenous', 'education', 'mentoring', 'youth', 'leadership',
      'community', 'university', 'school', 'training', 'partnership',
      'digital', 'innovation', 'curriculum', 'cultural', 'pathways'
    ];
    
    const found = new Set<string>();
    const combinedText = (title + ' ' + content).toLowerCase();
    
    commonTags.forEach(tag => {
      if (combinedText.includes(tag)) {
        found.add(tag);
      }
    });
    
    return Array.from(found);
  }

  /**
   * Extract related programs
   */
  private extractRelatedPrograms(content: string): string[] {
    const programPatterns = [
      /IMAGI-NATION/gi,
      /mentoring?\s+program/gi,
      /university\s+pathway/gi,
      /training\s+kit/gi
    ];
    
    const programs = new Set<string>();
    
    programPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => programs.add(match));
      }
    });
    
    return Array.from(programs);
  }

  /**
   * Determine priority based on content indicators
   */
  private determinePriority(content: string): 'high' | 'medium' | 'low' {
    const highPriorityIndicators = ['critical', 'urgent', 'major', 'significant', 'flagship'];
    const lowPriorityIndicators = ['minor', 'small', 'pilot', 'trial', 'experimental'];
    
    const lowerContent = content.toLowerCase();
    
    if (highPriorityIndicators.some(indicator => lowerContent.includes(indicator))) {
      return 'high';
    }
    
    if (lowPriorityIndicators.some(indicator => lowerContent.includes(indicator))) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Determine status based on content indicators
   */
  private determineStatus(content: string): 'completed' | 'in_progress' | 'planned' {
    const completedIndicators = ['completed', 'finished', 'achieved', 'successful', 'delivered'];
    const inProgressIndicators = ['ongoing', 'current', 'implementing', 'developing', 'active'];
    const plannedIndicators = ['planned', 'proposed', 'future', 'upcoming', 'potential'];
    
    const lowerContent = content.toLowerCase();
    
    if (completedIndicators.some(indicator => lowerContent.includes(indicator))) {
      return 'completed';
    }
    
    if (inProgressIndicators.some(indicator => lowerContent.includes(indicator))) {
      return 'in_progress';
    }
    
    return 'planned';
  }

  /**
   * Extract categories from areas
   */
  private extractCategories(areas: BusinessCaseArea[]): string[] {
    const categories = new Set<string>();
    areas.forEach(area => categories.add(area.category));
    return Array.from(categories);
  }

  /**
   * Find cross-references between areas
   */
  private findCrossReferences(areas: BusinessCaseArea[]): Array<{
    source_id: string;
    target_id: string;
    relationship: string;
    strength: number;
  }> {
    const references: Array<{
      source_id: string;
      target_id: string;
      relationship: string;
      strength: number;
    }> = [];
    
    for (let i = 0; i < areas.length; i++) {
      for (let j = i + 1; j < areas.length; j++) {
        const area1 = areas[i];
        const area2 = areas[j];
        
        // Check for shared tags
        const sharedTags = area1.tags.filter(tag => area2.tags.includes(tag));
        if (sharedTags.length > 0) {
          references.push({
            source_id: area1.id,
            target_id: area2.id,
            relationship: 'shared_themes',
            strength: Math.min(sharedTags.length * 0.3, 1.0)
          });
        }
        
        // Check for same category
        if (area1.category === area2.category) {
          references.push({
            source_id: area1.id,
            target_id: area2.id,
            relationship: 'same_category',
            strength: 0.5
          });
        }
        
        // Check for shared stakeholders
        const sharedStakeholders = area1.stakeholders.filter(stakeholder => 
          area2.stakeholders.includes(stakeholder)
        );
        if (sharedStakeholders.length > 0) {
          references.push({
            source_id: area1.id,
            target_id: area2.id,
            relationship: 'shared_stakeholders',
            strength: Math.min(sharedStakeholders.length * 0.2, 1.0)
          });
        }
      }
    }
    
    return references;
  }

  /**
   * Generate overall summary
   */
  private generateSummary(areas: BusinessCaseArea[], categories: string[]): string {
    const totalAreas = areas.length;
    const completedCount = areas.filter(a => a.status === 'completed').length;
    const highPriorityCount = areas.filter(a => a.priority === 'high').length;
    
    return `AIME Business Case Portfolio includes ${totalAreas} strategic areas across ${categories.length} categories. ${completedCount} areas have been completed, with ${highPriorityCount} high-priority initiatives. Key categories include: ${categories.join(', ')}.`;
  }

  /**
   * Generate area summary
   */
  private generateAreaSummary(title: string, challenge: string, solution: string, impact: string): string {
    const parts = [title];
    if (challenge) parts.push(`addresses ${challenge.substring(0, 50)}...`);
    if (solution) parts.push(`through ${solution.substring(0, 50)}...`);
    if (impact) parts.push(`achieving ${impact.substring(0, 50)}...`);
    
    return parts.join(' ').substring(0, 200) + (parts.join(' ').length > 200 ? '...' : '');
  }

  /**
   * Process and save all areas to database
   */
  async processAndSave(): Promise<ProcessedDocument> {
    const processed = await this.parseSourceDocument();
    
    // Save each area as a business case
    for (const area of processed.areas) {
      await this.repository.upsertBusinessCase({
        id: area.id,
        title: area.title,
        summary: area.summary,
        challenge: area.challenge,
        solution: area.solution,
        impact: area.impact,
        metrics: area.metrics,
        industry: area.category,
        region: 'Various', // Can be updated from content analysis
        program_type: this.mapCategoryToProgram(area.category),
        year: new Date().getFullYear(),
        tags: area.tags,
        is_featured: area.priority === 'high'
      });
    }
    
    console.log(`✅ Processed and saved ${processed.areas.length} business case areas`);
    return processed;
  }

  /**
   * Map category to program type
   */
  private mapCategoryToProgram(category: string): string {
    const mapping: Record<string, string> = {
      'Education': 'Education',
      'Corporate': 'Partnership',
      'Government': 'Partnership',
      'Community': 'Community',
      'Technology': 'Digital Platform',
      'Training': 'Training',
      'Partnership': 'Partnership'
    };
    
    return mapping[category] || 'General';
  }
}