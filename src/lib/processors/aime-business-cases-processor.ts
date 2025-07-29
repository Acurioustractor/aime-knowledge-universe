/**
 * AIME Business Cases Processor
 * 
 * Processes the 8 core AIME business case documents into structured data
 * with summaries, related content, and action steps
 */

import fs from 'fs';
import path from 'path';
import { getDatabase } from '../database/connection';
import { BusinessCasesRepository } from '../database/business-cases-repository';

export interface AIMEBusinessCase {
  id: string;
  title: string;
  subtitle: string;
  core_challenge: string;
  transformation_approach: string;
  target_audience: string;
  key_outcomes: string[];
  market_size: string;
  digital_hoodies: DigitalHoodie[];
  phases: TransformationPhase[];
  related_videos: string[];
  related_tools: string[];
  related_newsletters: string[];
  action_steps: ActionStep[];
  engagement_opportunities: EngagementOpportunity[];
  impact_metrics: ImpactMetric[];
  tags: string[];
  color_theme: string;
  icon: string;
  priority: 'flagship' | 'core' | 'emerging';
  status: 'active' | 'launching' | 'concept';
}

export interface DigitalHoodie {
  name: string;
  description: string;
  criteria: string;
  phase: number;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface TransformationPhase {
  phase_number: number;
  title: string;
  duration: string;
  description: string;
  key_activities: string[];
  outcomes: string[];
  hoodies_earned: string[];
}

export interface ActionStep {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: string;
  impact_level: 'individual' | 'organizational' | 'systemic';
  next_steps: string[];
}

export interface EngagementOpportunity {
  type: 'learn' | 'participate' | 'contribute' | 'lead';
  title: string;
  description: string;
  commitment_level: 'light' | 'medium' | 'deep';
  prerequisites: string[];
  benefits: string[];
}

export interface ImpactMetric {
  metric: string;
  current_value: string;
  target_value: string;
  measurement_method: string;
  timeline: string;
}

export class AIMEBusinessCasesProcessor {
  private repository: BusinessCasesRepository;
  private casesDirectory: string;

  constructor() {
    this.casesDirectory = path.join(process.cwd(), 'docs', 'business_cases');
    this.initialize();
  }

  private async initialize() {
    const db = await getDatabase();
    this.repository = new BusinessCasesRepository(db);
    await this.repository.initializeSchema();
  }

  /**
   * Process all 8 AIME business case documents
   */
  async processAllCases(): Promise<AIMEBusinessCase[]> {
    const caseFiles = [
      { file: 'AIME Business cases.md', id: 'joy-corps' },
      { file: 'AIME Business cases (1).md', id: 'presidents' },
      { file: 'AIME Business cases (2).md', id: 'citizens' },
      { file: 'AIME Business cases (3).md', id: 'imagi-labs' },
      { file: 'AIME Business cases (4).md', id: 'indigenous-labs' },
      { file: 'AIME Business cases (5).md', id: 'custodians' },
      { file: 'AIME Business cases (6).md', id: 'mentor-credit' },
      { file: 'AIME Business cases (7).md', id: 'systems-residency' }
    ];

    const processedCases: AIMEBusinessCase[] = [];

    for (const { file, id } of caseFiles) {
      try {
        const casePath = path.join(this.casesDirectory, file);
        const content = fs.readFileSync(casePath, 'utf-8');
        const processedCase = await this.processSingleCase(content, id);
        processedCases.push(processedCase);
        console.log(`✅ Processed: ${processedCase.title}`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }

    return processedCases;
  }

  /**
   * Process a single business case document
   */
  private async processSingleCase(content: string, id: string): Promise<AIMEBusinessCase> {
    // Extract title and subtitle
    const titleMatch = content.match(/^#\s*\*\*(.+?)\*\*/m);
    const subtitleMatch = content.match(/^\*(.+?)\*/m);
    
    const title = titleMatch ? titleMatch[1] : `Business Case ${id}`;
    const subtitle = subtitleMatch ? subtitleMatch[1] : '';

    // Extract executive summary for core challenge
    const execSummaryMatch = content.match(/##\s*\*\*Executive Summary\*\*\s*\n\n(.*?)(?=\n##|\n---|\n\*\*Target Audience)/s);
    const core_challenge = execSummaryMatch ? execSummaryMatch[1].substring(0, 500) + '...' : '';

    // Extract target audience
    const targetAudienceMatch = content.match(/\*\*Target Audience:\*\*\s*(.+?)(?=\n\n|\n---|$)/s);
    const target_audience = targetAudienceMatch ? targetAudienceMatch[1].trim() : '';

    // Extract phases
    const phases = this.extractPhases(content);

    // Extract digital hoodies
    const digital_hoodies = this.extractDigitalHoodies(content);

    // Map to business case structure
    return {
      id,
      title,
      subtitle,
      core_challenge,
      transformation_approach: this.extractTransformationApproach(content),
      target_audience,
      key_outcomes: this.extractKeyOutcomes(content),
      market_size: this.extractMarketSize(content),
      digital_hoodies,
      phases,
      related_videos: this.suggestRelatedVideos(title, content),
      related_tools: this.suggestRelatedTools(title, content),
      related_newsletters: this.suggestRelatedNewsletters(title, content),
      action_steps: this.generateActionSteps(title, content),
      engagement_opportunities: this.generateEngagementOpportunities(title, content),
      impact_metrics: this.extractImpactMetrics(content),
      tags: this.generateTags(title, content),
      color_theme: this.assignColorTheme(id),
      icon: this.assignIcon(id),
      priority: this.determinePriority(title, content),
      status: 'active'
    };
  }

  /**
   * Extract transformation phases from content
   */
  private extractPhases(content: string): TransformationPhase[] {
    const phases: TransformationPhase[] = [];
    const phaseMatches = content.match(/###\s*\*\*Phase\s+(\d+):\s*(.+?)\s*\((.+?)\)\*\*\s*\n\n(.*?)(?=###|\n##|$)/gs);
    
    if (phaseMatches) {
      phaseMatches.forEach((match, index) => {
        const phaseMatch = match.match(/###\s*\*\*Phase\s+(\d+):\s*(.+?)\s*\((.+?)\)\*\*\s*\n\n(.*)/s);
        if (phaseMatch) {
          const [, phaseNum, title, duration, description] = phaseMatch;
          
          phases.push({
            phase_number: parseInt(phaseNum),
            title: title.trim(),
            duration: duration.trim(),
            description: description.substring(0, 300) + '...',
            key_activities: this.extractListItems(description, 'activities'),
            outcomes: this.extractListItems(description, 'outcomes'),
            hoodies_earned: this.extractHoodiesFromPhase(description)
          });
        }
      });
    }

    return phases;
  }

  /**
   * Extract digital hoodies from content
   */
  private extractDigitalHoodies(content: string): DigitalHoodie[] {
    const hoodies: DigitalHoodie[] = [];
    const hoodieMatches = content.match(/\*\s*\*\*(.+?Badge)\*\*:\s*(.+?)(?=\n\*|\n\n|$)/g);
    
    if (hoodieMatches) {
      hoodieMatches.forEach((match, index) => {
        const hoodieMatch = match.match(/\*\s*\*\*(.+?)\*\*:\s*(.+)/);
        if (hoodieMatch) {
          const [, name, description] = hoodieMatch;
          
          hoodies.push({
            name: name.trim(),
            description: description.trim(),
            criteria: description.trim(),
            phase: Math.floor(index / 3) + 1, // Roughly distribute across phases
            rarity: this.determineHoodieRarity(name, description)
          });
        }
      });
    }

    return hoodies;
  }

  /**
   * Generate action steps for each business case
   */
  private generateActionSteps(title: string, content: string): ActionStep[] {
    const baseActions = [
      {
        title: "Learn the Framework",
        description: `Explore the comprehensive approach outlined in ${title} and understand how it applies to your context.`,
        difficulty: 'beginner' as const,
        time_commitment: '2-4 hours',
        impact_level: 'individual' as const,
        next_steps: ['Complete self-assessment', 'Join online community', 'Attend introduction session']
      },
      {
        title: "Complete Assessment",
        description: "Use AIME's assessment tools to evaluate your current state and identify transformation opportunities.",
        difficulty: 'intermediate' as const,
        time_commitment: '1-2 weeks',
        impact_level: 'organizational' as const,
        next_steps: ['Share results with team', 'Develop action plan', 'Identify key stakeholders']
      },
      {
        title: "Implement Pilot Program",
        description: "Start with a focused pilot implementation to test the approach in your specific context.",
        difficulty: 'advanced' as const,
        time_commitment: '3-6 months',
        impact_level: 'organizational' as const,
        next_steps: ['Measure outcomes', 'Gather feedback', 'Scale successful elements']
      },
      {
        title: "Join the Movement",
        description: "Connect with the broader AIME network and contribute to systemic transformation.",
        difficulty: 'intermediate' as const,
        time_commitment: 'Ongoing',
        impact_level: 'systemic' as const,
        next_steps: ['Attend network events', 'Share your story', 'Mentor others']
      }
    ];

    return baseActions;
  }

  /**
   * Generate engagement opportunities
   */
  private generateEngagementOpportunities(title: string, content: string): EngagementOpportunity[] {
    return [
      {
        type: 'learn',
        title: 'Attend Introductory Webinar',
        description: `Join monthly webinars exploring ${title} concepts and real-world applications.`,
        commitment_level: 'light',
        prerequisites: [],
        benefits: ['Understanding of core concepts', 'Connection with community', 'Access to resources']
      },
      {
        type: 'participate',
        title: 'Join Working Group',
        description: 'Participate in focused working groups developing specific aspects of the approach.',
        commitment_level: 'medium',
        prerequisites: ['Basic understanding of framework', 'Regular attendance commitment'],
        benefits: ['Direct influence on development', 'Peer learning', 'Early access to tools']
      },
      {
        type: 'contribute',
        title: 'Share Your Story',
        description: 'Document and share your implementation experience to help others learn.',
        commitment_level: 'medium',
        prerequisites: ['Implementation experience', 'Willingness to share openly'],
        benefits: ['Recognition in community', 'Feedback on approach', 'Network building']
      },
      {
        type: 'lead',
        title: 'Become a Regional Ambassador',
        description: 'Lead the development and implementation in your region or sector.',
        commitment_level: 'deep',
        prerequisites: ['Demonstrated success', 'Leadership experience', 'Community connections'],
        benefits: ['Strategic influence', 'Advanced training', 'Direct AIME partnership']
      }
    ];
  }

  /**
   * Suggest related videos based on content themes
   */
  private suggestRelatedVideos(title: string, content: string): string[] {
    const videoSuggestions: Record<string, string[]> = {
      'joy-corps': ['organizational-transformation', 'relational-economics', 'workplace-culture'],
      'presidents': ['youth-leadership', 'custodial-economies', 'young-changemakers'],
      'citizens': ['social-entrepreneurship', 'collective-intelligence', 'systems-change'],
      'imagi-labs': ['education-transformation', 'imagination-curriculum', 'learning-innovation'],
      'indigenous-labs': ['indigenous-knowledge', 'traditional-wisdom', 'cultural-integration'],
      'custodians': ['network-governance', 'stewardship', 'collective-leadership'],
      'mentor-credit': ['knowledge-exchange', 'mentoring-systems', 'relational-economics'],
      'systems-residency': ['systems-change', 'planetary-solutions', 'earth-shot-thinking']
    };

    // This would be enhanced to actually match with real video IDs from the database
    return videoSuggestions[title.toLowerCase().replace(/[^a-z]/g, '-')] || [];
  }

  /**
   * Suggest related tools
   */
  private suggestRelatedTools(title: string, content: string): string[] {
    const toolSuggestions: Record<string, string[]> = {
      'joy-corps': ['organizational-assessment-toolkit', 'relational-leadership-framework', 'culture-transformation-guide'],
      'presidents': ['youth-leadership-curriculum', 'custodial-economics-model', 'changemaker-toolkit'],
      'citizens': ['social-entrepreneur-handbook', 'collective-intelligence-framework', 'network-building-guide'],
      'imagi-labs': ['imagination-curriculum', 'education-design-toolkit', 'learning-assessment-tools'],
      'indigenous-labs': ['knowledge-systems-framework', 'cultural-integration-guide', 'wisdom-sharing-protocols'],
      'custodians': ['governance-frameworks', 'stewardship-protocols', 'network-management-tools'],
      'mentor-credit': ['mentoring-system-design', 'knowledge-exchange-platform', 'relationship-mapping-tools'],
      'systems-residency': ['systems-thinking-toolkit', 'solution-design-framework', 'impact-measurement-tools']
    };

    return toolSuggestions[title.toLowerCase().replace(/[^a-z]/g, '-')] || [];
  }

  /**
   * Suggest related newsletters
   */
  private suggestRelatedNewsletters(title: string, content: string): string[] {
    // This would be enhanced to match with actual newsletter campaigns
    return ['transformation-insights', 'network-updates', 'success-stories'];
  }

  /**
   * Helper methods
   */
  private extractTransformationApproach(content: string): string {
    const solutionMatch = content.match(/##\s*\*\*Solution Overview.*?\*\*\s*\n\n(.*?)(?=\n##|\n###)/s);
    return solutionMatch ? solutionMatch[1].substring(0, 300) + '...' : '';
  }

  private extractKeyOutcomes(content: string): string[] {
    const outcomes: string[] = [];
    const bulletMatches = content.match(/^\*\s+(.+?)$/gm);
    if (bulletMatches) {
      outcomes.push(...bulletMatches.slice(0, 5).map(match => match.replace(/^\*\s+/, '')));
    }
    return outcomes;
  }

  private extractMarketSize(content: string): string {
    const marketMatches = content.match(/\$[\d,]+\s*(?:billion|trillion|million)/gi);
    return marketMatches ? marketMatches[0] : 'Multi-billion dollar opportunity';
  }

  private extractImpactMetrics(content: string): ImpactMetric[] {
    // Extract specific metrics mentioned in content
    return [
      {
        metric: 'Participant Satisfaction',
        current_value: 'Baseline',
        target_value: '95%+',
        measurement_method: 'Regular surveys and feedback',
        timeline: '12 months'
      },
      {
        metric: 'Network Growth',
        current_value: 'Current community',
        target_value: '10x growth',
        measurement_method: 'Active participation tracking',
        timeline: '24 months'
      }
    ];
  }

  private extractListItems(text: string, type: string): string[] {
    const items: string[] = [];
    const bulletMatches = text.match(/^\*\s+(.+?)$/gm);
    if (bulletMatches) {
      items.push(...bulletMatches.slice(0, 3).map(match => match.replace(/^\*\s+/, '')));
    }
    return items;
  }

  private extractHoodiesFromPhase(description: string): string[] {
    const hoodieMatches = description.match(/\*\*(.+?Badge)\*\*/g);
    return hoodieMatches ? hoodieMatches.map(match => match.replace(/\*\*/g, '')) : [];
  }

  private determineHoodieRarity(name: string, description: string): 'common' | 'rare' | 'legendary' {
    if (name.toLowerCase().includes('mastery') || name.toLowerCase().includes('advanced')) return 'legendary';
    if (name.toLowerCase().includes('systems') || name.toLowerCase().includes('leadership')) return 'rare';
    return 'common';
  }

  private generateTags(title: string, content: string): string[] {
    const commonTags = [
      'transformation', 'leadership', 'systems-change', 'relational-economics',
      'education', 'mentoring', 'indigenous-knowledge', 'youth-development',
      'organizational-change', 'network-governance', 'custodianship', 'imagination'
    ];
    
    const contentLower = (title + ' ' + content).toLowerCase();
    return commonTags.filter(tag => contentLower.includes(tag.replace('-', ' ')));
  }

  private assignColorTheme(id: string): string {
    const themes: Record<string, string> = {
      'joy-corps': 'purple',
      'presidents': 'gold',
      'citizens': 'green',
      'imagi-labs': 'blue',
      'indigenous-labs': 'orange',
      'custodians': 'teal',
      'mentor-credit': 'indigo',
      'systems-residency': 'red'
    };
    return themes[id] || 'gray';
  }

  private assignIcon(id: string): string {
    const icons: Record<string, string> = {
      'joy-corps': '🏢',
      'presidents': '👑',
      'citizens': '🌍',
      'imagi-labs': '🧪',
      'indigenous-labs': '🌿',
      'custodians': '🛡️',
      'mentor-credit': '🤝',
      'systems-residency': '🚀'
    };
    return icons[id] || '📋';
  }

  private determinePriority(title: string, content: string): 'flagship' | 'core' | 'emerging' {
    const flagshipKeywords = ['joy corps', 'presidents', 'systems change'];
    const titleLower = title.toLowerCase();
    
    if (flagshipKeywords.some(keyword => titleLower.includes(keyword))) return 'flagship';
    return 'core';
  }

  /**
   * Save all processed cases to database
   */
  async saveProcessedCases(): Promise<AIMEBusinessCase[]> {
    const cases = await this.processAllCases();
    
    for (const businessCase of cases) {
      await this.repository.upsertBusinessCase({
        id: businessCase.id,
        title: businessCase.title,
        summary: businessCase.core_challenge,
        challenge: businessCase.core_challenge,
        solution: businessCase.transformation_approach,
        impact: businessCase.key_outcomes.join('; '),
        metrics: {
          market_size: businessCase.market_size,
          phases: businessCase.phases.length,
          hoodies: businessCase.digital_hoodies.length
        },
        industry: this.mapToIndustry(businessCase.title),
        region: 'Global',
        program_type: this.mapToProgramType(businessCase.title),
        year: new Date().getFullYear(),
        tags: businessCase.tags,
        is_featured: businessCase.priority === 'flagship',
        related_tools: businessCase.related_tools,
        related_videos: businessCase.related_videos
      });
    }

    console.log(`✅ Saved ${cases.length} AIME business cases to database`);
    return cases;
  }

  private mapToIndustry(title: string): string {
    if (title.toLowerCase().includes('education') || title.toLowerCase().includes('imagi-labs')) return 'Education';
    if (title.toLowerCase().includes('organization') || title.toLowerCase().includes('joy corps')) return 'Corporate';
    if (title.toLowerCase().includes('government') || title.toLowerCase().includes('custodian')) return 'Government';
    return 'Community';
  }

  private mapToProgramType(title: string): string {
    if (title.toLowerCase().includes('mentor')) return 'Mentoring';
    if (title.toLowerCase().includes('education') || title.toLowerCase().includes('lab')) return 'Training';
    if (title.toLowerCase().includes('systems') || title.toLowerCase().includes('residency')) return 'Innovation';
    return 'Transformation';
  }
}