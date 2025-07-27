/**
 * Research API for accessing research and insights content
 */
import { ContentItem } from '../../content-integration/models/content-item';
import { 
  PurposeContentItem, 
  ResearchOptions,
  ResearchType
} from '../models/purpose-content';
import { DefaultPurposeClassifier, PurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer, ContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentFilter, ContentFilter } from '../utils/content-filter';
import { ContentProvider } from './stories-api';

/**
 * Research API interface
 */
export interface ResearchAPI {
  fetchResearch(options?: ResearchOptions): Promise<PurposeContentItem[]>;
  fetchResearchById(id: string): Promise<PurposeContentItem | null>;
  fetchResearchByTheme(theme: string, options?: ResearchOptions): Promise<PurposeContentItem[]>;
  fetchResearchByTopic(topic: string, options?: ResearchOptions): Promise<PurposeContentItem[]>;
  fetchFeaturedResearch(limit?: number): Promise<PurposeContentItem[]>;
  fetchRelatedResearch(contentId: string, limit?: number): Promise<PurposeContentItem[]>;
}

/**
 * Default Research API implementation
 */
export class DefaultResearchAPI implements ResearchAPI {
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
   * Fetch research with optional filtering
   */
  async fetchResearch(options: ResearchOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'research'
    const researchOptions: ResearchOptions = {
      ...options,
      primaryPurpose: 'research'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by research options
    return this.contentFilter.filterByResearchOptions(enhancedContent, researchOptions);
  }
  
  /**
   * Fetch research by ID
   */
  async fetchResearchById(id: string): Promise<PurposeContentItem | null> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(id);
    
    if (!content) return null;
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceWithPurpose(content);
    
    // Check if content is research
    if (enhancedContent.primaryPurpose !== 'research' && 
        !enhancedContent.secondaryPurposes?.includes('research')) {
      return null;
    }
    
    return enhancedContent;
  }
  
  /**
   * Fetch research by theme
   */
  async fetchResearchByTheme(theme: string, options: ResearchOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'research' and theme
    const researchOptions: ResearchOptions = {
      ...options,
      primaryPurpose: 'research',
      theme
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by research options
    return this.contentFilter.filterByResearchOptions(enhancedContent, researchOptions);
  }
  
  /**
   * Fetch research by topic
   */
  async fetchResearchByTopic(topic: string, options: ResearchOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'research' and topic
    const researchOptions: ResearchOptions = {
      ...options,
      primaryPurpose: 'research',
      topic
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by research options
    return this.contentFilter.filterByResearchOptions(enhancedContent, researchOptions);
  }
  
  /**
   * Fetch featured research
   */
  async fetchFeaturedResearch(limit: number = 5): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'research' and sort by relevance
    const researchOptions: ResearchOptions = {
      primaryPurpose: 'research',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by research options
    return this.contentFilter.filterByResearchOptions(enhancedContent, researchOptions);
  }
  
  /**
   * Fetch related research for a content item
   */
  async fetchRelatedResearch(contentId: string, limit: number = 5): Promise<PurposeContentItem[]> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(contentId);
    
    if (!content) return [];
    
    // Get themes from content
    const themes = content.themes?.map(theme => theme.id) || [];
    
    // Get topics from content
    const topics = content.topics?.map(topic => topic.id) || [];
    
    // Set primary purpose to 'research' and filter by themes and topics
    const researchOptions: ResearchOptions = {
      primaryPurpose: 'research',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by research options
    let relatedResearch = this.contentFilter.filterByResearchOptions(enhancedContent, researchOptions);
    
    // Filter out the original content
    relatedResearch = relatedResearch.filter(item => item.id !== contentId);
    
    // Score research by relevance to original content
    const scoredResearch = relatedResearch.map(research => {
      let score = 0;
      
      // Score by matching themes
      research.themes?.forEach(theme => {
        if (themes.includes(theme.id)) {
          score += 10;
        }
      });
      
      // Score by matching topics
      research.topics?.forEach(topic => {
        if (topics.includes(topic.id)) {
          score += 5;
        }
      });
      
      // Score by matching research type
      if (content.researchDetails?.researchType === research.researchDetails?.researchType) {
        score += 8;
      }
      
      // Score by matching tags
      const contentTags = content.tags || [];
      const researchTags = research.tags || [];
      const matchingTags = researchTags.filter(tag => contentTags.includes(tag));
      score += matchingTags.length * 3;
      
      return {
        ...research,
        relationScore: score
      };
    });
    
    // Sort by relation score (descending)
    scoredResearch.sort((a, b) => b.relationScore - a.relationScore);
    
    // Return top research
    return scoredResearch.slice(0, limit).map(({ relationScore, ...research }) => research);
  }
}