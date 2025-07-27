/**
 * Tools API for accessing tool and resource content
 */
import { ContentItem } from '../../content-integration/models/content-item';
import { 
  PurposeContentItem, 
  ToolOptions,
  ToolType
} from '../models/purpose-content';
import { DefaultPurposeClassifier, PurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer, ContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentFilter, ContentFilter } from '../utils/content-filter';
import { ContentProvider } from './stories-api';

/**
 * Tools API interface
 */
export interface ToolsAPI {
  fetchTools(options?: ToolOptions): Promise<PurposeContentItem[]>;
  fetchToolById(id: string): Promise<PurposeContentItem | null>;
  fetchToolsByAudience(audience: string, options?: ToolOptions): Promise<PurposeContentItem[]>;
  fetchToolsByContext(context: string, options?: ToolOptions): Promise<PurposeContentItem[]>;
  fetchFeaturedTools(limit?: number): Promise<PurposeContentItem[]>;
  fetchRelatedTools(contentId: string, limit?: number): Promise<PurposeContentItem[]>;
}

/**
 * Default Tools API implementation
 */
export class DefaultToolsAPI implements ToolsAPI {
  private contentEnhancer: ContentEnhancer;
  private contentFilter: ContentFilter;
  private contentProvider: ContentProvider;
  
  constructor(
    contentProvider: ContentProvider,
    contentEnhancer: ContentEnhancer = new DefaultContentEnhancer(),
    contentFilter: ContentFilter = new DefaultContentFilter()
  ) {
    this.contentProvider = contentProvider;
    this.contentEnhancer = contentEnhancer;
    this.contentFilter = contentFilter;
  }
  
  /**
   * Fetch tools with optional filtering
   */
  async fetchTools(options: ToolOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'tool'
    const toolOptions: ToolOptions = {
      ...options,
      primaryPurpose: 'tool'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by tool options
    return this.contentFilter.filterByToolOptions(enhancedContent, toolOptions);
  }
  
  /**
   * Fetch a tool by ID
   */
  async fetchToolById(id: string): Promise<PurposeContentItem | null> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(id);
    
    if (!content) return null;
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceWithPurpose(content);
    
    // Check if content is a tool
    if (enhancedContent.primaryPurpose !== 'tool' && 
        !enhancedContent.secondaryPurposes?.includes('tool')) {
      return null;
    }
    
    return enhancedContent;
  }
  
  /**
   * Fetch tools by audience
   */
  async fetchToolsByAudience(audience: string, options: ToolOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'tool' and audience
    const toolOptions: ToolOptions = {
      ...options,
      primaryPurpose: 'tool',
      audience: [audience]
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by tool options
    return this.contentFilter.filterByToolOptions(enhancedContent, toolOptions);
  }
  
  /**
   * Fetch tools by context
   */
  async fetchToolsByContext(context: string, options: ToolOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'tool' and context
    const toolOptions: ToolOptions = {
      ...options,
      primaryPurpose: 'tool',
      context: [context]
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by tool options
    return this.contentFilter.filterByToolOptions(enhancedContent, toolOptions);
  }
  
  /**
   * Fetch featured tools
   */
  async fetchFeaturedTools(limit: number = 5): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'tool' and sort by relevance
    const toolOptions: ToolOptions = {
      primaryPurpose: 'tool',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by tool options
    return this.contentFilter.filterByToolOptions(enhancedContent, toolOptions);
  }
  
  /**
   * Fetch related tools for a content item
   */
  async fetchRelatedTools(contentId: string, limit: number = 5): Promise<PurposeContentItem[]> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(contentId);
    
    if (!content) return [];
    
    // Get themes from content
    const themes = content.themes?.map(theme => theme.id) || [];
    
    // Get topics from content
    const topics = content.topics?.map(topic => topic.id) || [];
    
    // Set primary purpose to 'tool' and filter by themes and topics
    const toolOptions: ToolOptions = {
      primaryPurpose: 'tool',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by tool options
    let relatedTools = this.contentFilter.filterByToolOptions(enhancedContent, toolOptions);
    
    // Filter out the original content
    relatedTools = relatedTools.filter(item => item.id !== contentId);
    
    // Score tools by relevance to original content
    const scoredTools = relatedTools.map(tool => {
      let score = 0;
      
      // Score by matching themes
      tool.themes?.forEach(theme => {
        if (themes.includes(theme.id)) {
          score += 10;
        }
      });
      
      // Score by matching topics
      tool.topics?.forEach(topic => {
        if (topics.includes(topic.id)) {
          score += 5;
        }
      });
      
      // Score by matching tags
      const contentTags = content.tags || [];
      const toolTags = tool.tags || [];
      const matchingTags = toolTags.filter(tag => contentTags.includes(tag));
      score += matchingTags.length * 3;
      
      return {
        ...tool,
        relationScore: score
      };
    });
    
    // Sort by relation score (descending)
    scoredTools.sort((a, b) => b.relationScore - a.relationScore);
    
    // Return top tools
    return scoredTools.slice(0, limit).map(({ relationScore, ...tool }) => tool);
  }
}