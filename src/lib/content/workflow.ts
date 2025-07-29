/**
 * AIME Knowledge Archive - Content Management Workflows
 * 
 * Professional content lifecycle and workflow management system
 */

export interface ContentItem {
  id: string;
  globalId: string;
  title: string;
  description: string;
  type: string;
  source: string;
  sourceId: string;
  url?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  priority: 'high' | 'medium' | 'low';
  metadata: Record<string, any>;
  content: {
    text: string;
    markdown?: string;
    html?: string;
    excerpt: string;
  };
  themes: string[];
  tags: string[];
  categories: string[];
  authors: string[];
  reviewers?: string[];
  publishedDate?: Date;
  lastModified: Date;
  createdAt: Date;
  qualityScore: number;
  impactScore: number;
  engagement?: {
    views: number;
    shares: number;
    comments: number;
  };
}

export interface WorkflowAction {
  id: string;
  type: 'validate' | 'enhance' | 'categorize' | 'review' | 'publish' | 'archive';
  name: string;
  description: string;
  automated: boolean;
  requiredRole?: string;
  conditions?: string[];
  action: (item: ContentItem) => Promise<ContentItem>;
}

export interface WorkflowRule {
  id: string;
  name: string;
  source: string[];
  contentType: string[];
  triggers: string[];
  actions: string[];
  enabled: boolean;
  priority: number;
}

export class ContentWorkflowManager {
  private actions: Map<string, WorkflowAction> = new Map();
  private rules: Map<string, WorkflowRule> = new Map();
  private processingQueue: ContentItem[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeDefaultActions();
    this.initializeDefaultRules();
  }

  private initializeDefaultActions() {
    const defaultActions: WorkflowAction[] = [
      {
        id: 'validate-content',
        type: 'validate',
        name: 'Content Validation',
        description: 'Validate content structure and required fields',
        automated: true,
        action: this.validateContent.bind(this)
      },
      {
        id: 'extract-themes',
        type: 'enhance',
        name: 'Theme Extraction',
        description: 'Automatically extract themes from content',
        automated: true,
        action: this.extractThemes.bind(this)
      },
      {
        id: 'generate-tags',
        type: 'enhance',
        name: 'Tag Generation',
        description: 'Generate relevant tags from content',
        automated: true,
        action: this.generateTags.bind(this)
      },
      {
        id: 'optimize-seo',
        type: 'enhance',
        name: 'SEO Optimization',
        description: 'Optimize content for search engines',
        automated: true,
        action: this.optimizeSEO.bind(this)
      },
      {
        id: 'calculate-quality',
        type: 'enhance',
        name: 'Quality Scoring',
        description: 'Calculate content quality score',
        automated: true,
        action: this.calculateQualityScore.bind(this)
      },
      {
        id: 'categorize-content',
        type: 'categorize',
        name: 'Auto-Categorization',
        description: 'Automatically categorize content by type and topic',
        automated: true,
        action: this.categorizeContent.bind(this)
      },
      {
        id: 'manual-review',
        type: 'review',
        name: 'Manual Content Review',
        description: 'Require manual review for sensitive content',
        automated: false,
        requiredRole: 'editor',
        action: this.manualReview.bind(this)
      },
      {
        id: 'auto-publish',
        type: 'publish',
        name: 'Auto-Publish',
        description: 'Automatically publish validated content',
        automated: true,
        conditions: ['quality_score > 7', 'validation_passed'],
        action: this.autoPublish.bind(this)
      }
    ];

    defaultActions.forEach(action => {
      this.actions.set(action.id, action);
    });
  }

  private initializeDefaultRules() {
    const defaultRules: WorkflowRule[] = [
      {
        id: 'mailchimp-newsletter-workflow',
        name: 'Mailchimp Newsletter Processing',
        source: ['mailchimp'],
        contentType: ['newsletter'],
        triggers: ['content_added', 'content_updated'],
        actions: ['validate-content', 'extract-themes', 'generate-tags', 'auto-publish'],
        enabled: true,
        priority: 10
      },
      {
        id: 'airtable-resource-workflow',
        name: 'Airtable Resource Processing',
        source: ['airtable'],
        contentType: ['resource', 'toolkit', 'event'],
        triggers: ['content_added', 'content_updated'],
        actions: ['validate-content', 'categorize-content', 'calculate-quality', 'auto-publish'],
        enabled: true,
        priority: 8
      },
      {
        id: 'github-document-workflow',
        name: 'GitHub Document Processing',
        source: ['github'],
        contentType: ['document'],
        triggers: ['content_added', 'content_updated'],
        actions: ['validate-content', 'extract-themes', 'optimize-seo', 'auto-publish'],
        enabled: true,
        priority: 6
      },
      {
        id: 'local-content-workflow',
        name: 'Local Content Processing',
        source: ['markdown'],
        contentType: ['content', 'research', 'tools', 'overview'],
        triggers: ['content_added', 'content_updated'],
        actions: ['validate-content', 'extract-themes', 'generate-tags', 'calculate-quality', 'auto-publish'],
        enabled: true,
        priority: 9
      },
      {
        id: 'high-priority-review',
        name: 'High Priority Content Review',
        source: ['*'],
        contentType: ['*'],
        triggers: ['content_added'],
        actions: ['manual-review'],
        enabled: false, // Disabled by default
        priority: 1
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  /**
   * Process content through workflow
   */
  async processContent(content: ContentItem, trigger: string = 'content_added'): Promise<ContentItem> {
    console.log(`🔄 Processing content: ${content.title} (${content.source})`);

    // Find applicable rules
    const applicableRules = this.findApplicableRules(content, trigger);
    
    if (applicableRules.length === 0) {
      console.log(`⏭️ No workflow rules apply to content: ${content.title}`);
      return content;
    }

    // Sort rules by priority
    applicableRules.sort((a, b) => b.priority - a.priority);

    let processedContent = { ...content };

    // Execute actions for each applicable rule
    for (const rule of applicableRules) {
      console.log(`📋 Applying rule: ${rule.name}`);
      
      for (const actionId of rule.actions) {
        const action = this.actions.get(actionId);
        if (!action) {
          console.warn(`⚠️ Action not found: ${actionId}`);
          continue;
        }

        try {
          console.log(`⚡ Executing action: ${action.name}`);
          processedContent = await action.action(processedContent);
        } catch (error) {
          console.error(`❌ Action failed: ${action.name}`, error);
          // Continue with other actions unless it's critical
          if (action.type === 'validate') {
            throw error; // Validation failures should stop processing
          }
        }
      }
    }

    console.log(`✅ Content processing completed: ${processedContent.title}`);
    return processedContent;
  }

  /**
   * Add content to processing queue
   */
  async queueContent(content: ContentItem, trigger: string = 'content_added') {
    this.processingQueue.push({ ...content, metadata: { ...content.metadata, trigger } });
    
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process the content queue
   */
  private async processQueue() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log(`🎯 Processing ${this.processingQueue.length} items in queue`);

    while (this.processingQueue.length > 0) {
      const content = this.processingQueue.shift();
      if (!content) continue;

      try {
        const trigger = content.metadata.trigger || 'content_added';
        await this.processContent(content, trigger);
      } catch (error) {
        console.error(`❌ Failed to process content: ${content.title}`, error);
      }
    }

    this.isProcessing = false;
    console.log(`✅ Queue processing completed`);
  }

  private findApplicableRules(content: ContentItem, trigger: string): WorkflowRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      if (!rule.enabled) return false;
      
      // Check source match
      const sourceMatch = rule.source.includes('*') || rule.source.includes(content.source);
      if (!sourceMatch) return false;

      // Check content type match
      const typeMatch = rule.contentType.includes('*') || rule.contentType.includes(content.type);
      if (!typeMatch) return false;

      // Check trigger match
      const triggerMatch = rule.triggers.includes('*') || rule.triggers.includes(trigger);
      if (!triggerMatch) return false;

      return true;
    });
  }

  // Action implementations
  private async validateContent(content: ContentItem): Promise<ContentItem> {
    const errors: string[] = [];

    // Required field validation
    if (!content.title?.trim()) errors.push('Title is required');
    if (!content.description?.trim()) errors.push('Description is required');
    if (!content.content?.text?.trim()) errors.push('Content text is required');

    // Content quality checks
    if (content.title.length < 5) errors.push('Title too short');
    if (content.description.length < 20) errors.push('Description too short');
    if (content.content.text.length < 50) errors.push('Content too short');

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return {
      ...content,
      status: 'review',
      metadata: {
        ...content.metadata,
        validation: { passed: true, errors: [], timestamp: new Date() }
      }
    };
  }

  private async extractThemes(content: ContentItem): Promise<ContentItem> {
    const themes: string[] = [];
    const text = (content.title + ' ' + content.description + ' ' + content.content.text).toLowerCase();

    // AIME theme patterns
    const themePatterns: Record<string, string[]> = {
      'Imagination & Creativity': ['imagination', 'creative', 'innovation', 'design thinking'],
      'Indigenous Systems Thinking': ['indigenous', 'traditional knowledge', 'cultural wisdom', 'ancestral'],
      'Education Transformation': ['education', 'learning', 'school', 'teaching', 'curriculum'],
      'Youth Leadership': ['youth', 'young people', 'leadership', 'empowerment'],
      'Mentorship': ['mentor', 'mentoring', 'guidance', 'coaching', 'support'],
      'Environmental Custodianship': ['environment', 'climate', 'sustainability', 'conservation'],
      'Network Health': ['network', 'community', 'collaboration', 'partnership'],
      'Cultural Bridge': ['cultural bridge', 'cross-cultural', 'diversity', 'inclusion']
    };

    Object.entries(themePatterns).forEach(([theme, patterns]) => {
      if (patterns.some(pattern => text.includes(pattern))) {
        themes.push(theme);
      }
    });

    return {
      ...content,
      themes: [...new Set([...content.themes, ...themes])]
    };
  }

  private async generateTags(content: ContentItem): Promise<ContentItem> {
    const tags: string[] = [];
    const text = (content.title + ' ' + content.description).toLowerCase();

    // Common tag patterns
    const tagPatterns = [
      'workshop', 'toolkit', 'framework', 'program', 'research', 'analysis',
      'implementation', 'guide', 'resource', 'episode', 'video', 'story',
      'innovation', 'creativity', 'leadership', 'mentorship', 'education'
    ];

    tagPatterns.forEach(pattern => {
      if (text.includes(pattern)) {
        tags.push(pattern);
      }
    });

    // Add source-specific tags
    tags.push(content.source);
    if (content.metadata?.repository) {
      tags.push(content.metadata.repository);
    }

    return {
      ...content,
      tags: [...new Set([...content.tags, ...tags])]
    };
  }

  private async optimizeSEO(content: ContentItem): Promise<ContentItem> {
    // Generate SEO-friendly excerpt
    const excerpt = content.content.text
      .substring(0, 160)
      .replace(/[^\w\s]/gi, '')
      .trim() + '...';

    // Extract key phrases for SEO
    const seoKeywords = content.themes
      .concat(content.tags)
      .join(', ')
      .toLowerCase();

    return {
      ...content,
      content: {
        ...content.content,
        excerpt
      },
      metadata: {
        ...content.metadata,
        seo: {
          keywords: seoKeywords,
          excerpt,
          optimized: true,
          timestamp: new Date()
        }
      }
    };
  }

  private async calculateQualityScore(content: ContentItem): Promise<ContentItem> {
    let score = 5; // Base score

    // Content length factors
    const wordCount = content.content.text.split(/\s+/).length;
    if (wordCount > 100) score += 1;
    if (wordCount > 500) score += 1;
    if (wordCount > 1000) score += 1;

    // Structure factors
    if (content.themes.length > 0) score += 1;
    if (content.tags.length > 2) score += 1;
    if (content.description.length > 50) score += 1;

    // Source reliability
    if (['mailchimp', 'airtable'].includes(content.source)) score += 1;
    if (content.source === 'github') score += 0.5;

    // Metadata richness
    if (content.authors.length > 0) score += 0.5;
    if (content.publishedDate) score += 0.5;

    return {
      ...content,
      qualityScore: Math.min(score, 10)
    };
  }

  private async categorizeContent(content: ContentItem): Promise<ContentItem> {
    const categories: string[] = [];

    // Content type categorization
    switch (content.type) {
      case 'newsletter':
        categories.push('Communications', 'Updates');
        break;
      case 'resource':
        categories.push('Resources', 'Tools');
        break;
      case 'event':
        categories.push('Events', 'Community');
        break;
      case 'document':
        categories.push('Documentation', 'Knowledge');
        break;
      default:
        categories.push('General');
    }

    // Theme-based categorization
    if (content.themes.includes('Education Transformation')) {
      categories.push('Education');
    }
    if (content.themes.includes('Indigenous Systems Thinking')) {
      categories.push('Indigenous Custodianship');
    }

    return {
      ...content,
      categories: [...new Set([...content.categories, ...categories])]
    };
  }

  private async manualReview(content: ContentItem): Promise<ContentItem> {
    // In a real system, this would queue the content for manual review
    // For now, just mark it as requiring review
    return {
      ...content,
      status: 'review',
      metadata: {
        ...content.metadata,
        manualReview: {
          required: true,
          reason: 'Automated rule triggered manual review',
          timestamp: new Date()
        }
      }
    };
  }

  private async autoPublish(content: ContentItem): Promise<ContentItem> {
    // Check conditions before publishing
    if (content.qualityScore < 7) {
      throw new Error('Quality score too low for auto-publish');
    }

    if (!content.metadata?.validation?.passed) {
      throw new Error('Content must pass validation before publishing');
    }

    return {
      ...content,
      status: 'published',
      publishedDate: new Date(),
      metadata: {
        ...content.metadata,
        published: {
          auto: true,
          timestamp: new Date()
        }
      }
    };
  }

  // Management methods
  getWorkflowRules(): WorkflowRule[] {
    return Array.from(this.rules.values());
  }

  getWorkflowActions(): WorkflowAction[] {
    return Array.from(this.actions.values());
  }

  enableRule(ruleId: string) {
    const rule = this.rules.get(ruleId);
    if (rule) rule.enabled = true;
  }

  disableRule(ruleId: string) {
    const rule = this.rules.get(ruleId);
    if (rule) rule.enabled = false;
  }

  getQueueStatus(): { pending: number, processing: boolean } {
    return {
      pending: this.processingQueue.length,
      processing: this.isProcessing
    };
  }
}

// Singleton instance
export const contentWorkflow = new ContentWorkflowManager();