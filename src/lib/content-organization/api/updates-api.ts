/**
 * Updates API for accessing update and news content
 */
import { ContentItem } from '../../content-integration/models/content-item';
import { 
  PurposeContentItem, 
  UpdateOptions,
  UpdateType
} from '../models/purpose-content';
import { DefaultPurposeClassifier, PurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer, ContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentFilter, ContentFilter } from '../utils/content-filter';
import { ContentProvider } from './stories-api';

/**
 * Updates API interface
 */
export interface UpdatesAPI {
  fetchUpdates(options?: UpdateOptions): Promise<PurposeContentItem[]>;
  fetchUpdateById(id: string): Promise<PurposeContentItem | null>;
  fetchLatestUpdates(limit?: number): Promise<PurposeContentItem[]>;
  fetchUpdatesByTheme(theme: string, options?: UpdateOptions): Promise<PurposeContentItem[]>;
  fetchRelatedUpdates(contentId: string, limit?: number): Promise<PurposeContentItem[]>;
}

/**
 * Default Updates API implementation
 */
export class DefaultUpdatesAPI implements UpdatesAPI {
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
   * Fetch updates with optional filtering
   */
  async fetchUpdates(options: UpdateOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'update'
    const updateOptions: UpdateOptions = {
      ...options,
      primaryPurpose: 'update'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by update options
    return this.contentFilter.filterByUpdateOptions(enhancedContent, updateOptions);
  }
  
  /**
   * Fetch update by ID
   */
  async fetchUpdateById(id: string): Promise<PurposeContentItem | null> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(id);
    
    if (!content) return null;
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceWithPurpose(content);
    
    // Check if content is an update
    if (enhancedContent.primaryPurpose !== 'update' && 
        !enhancedContent.secondaryPurposes?.includes('update')) {
      return null;
    }
    
    return enhancedContent;
  }
  
  /**
   * Fetch latest updates
   */
  async fetchLatestUpdates(limit: number = 5): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'update' and sort by date
    const updateOptions: UpdateOptions = {
      primaryPurpose: 'update',
      sortBy: 'date',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by update options
    return this.contentFilter.filterByUpdateOptions(enhancedContent, updateOptions);
  }
  
  /**
   * Fetch updates by theme
   */
  async fetchUpdatesByTheme(theme: string, options: UpdateOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'update' and theme
    const updateOptions: UpdateOptions = {
      ...options,
      primaryPurpose: 'update',
      theme
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by update options
    return this.contentFilter.filterByUpdateOptions(enhancedContent, updateOptions);
  }
  
  /**
   * Fetch related updates for a content item
   */
  async fetchRelatedUpdates(contentId: string, limit: number = 5): Promise<PurposeContentItem[]> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(contentId);
    
    if (!content) return [];
    
    // Get themes from content
    const themes = content.themes?.map(theme => theme.id) || [];
    
    // Get topics from content
    const topics = content.topics?.map(topic => topic.id) || [];
    
    // Set primary purpose to 'update' and filter by themes and topics
    const updateOptions: UpdateOptions = {
      primaryPurpose: 'update',
      sortBy: 'date',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by update options
    let relatedUpdates = this.contentFilter.filterByUpdateOptions(enhancedContent, updateOptions);
    
    // Filter out the original content
    relatedUpdates = relatedUpdates.filter(item => item.id !== contentId);
    
    // Score updates by relevance to original content
    const scoredUpdates = relatedUpdates.map(update => {
      let score = 0;
      
      // Score by matching themes
      update.themes?.forEach(theme => {
        if (themes.includes(theme.id)) {
          score += 10;
        }
      });
      
      // Score by matching topics
      update.topics?.forEach(topic => {
        if (topics.includes(topic.id)) {
          score += 5;
        }
      });
      
      // Score by matching update type
      if (content.updateDetails?.updateType === update.updateDetails?.updateType) {
        score += 8;
      }
      
      // Score by matching tags
      const contentTags = content.tags || [];
      const updateTags = update.tags || [];
      const matchingTags = updateTags.filter(tag => contentTags.includes(tag));
      score += matchingTags.length * 3;
      
      // Score by date proximity
      if (content.date && update.date) {
        const contentDate = new Date(content.date).getTime();
        const updateDate = new Date(update.date).getTime();
        const diffDays = Math.abs(contentDate - updateDate) / (1000 * 60 * 60 * 24);
        
        // Closer dates get higher scores
        if (diffDays < 30) {
          score += 5;
        } else if (diffDays < 90) {
          score += 3;
        } else if (diffDays < 180) {
          score += 1;
        }
      }
      
      return {
        ...update,
        relationScore: score
      };
    });
    
    // Sort by relation score (descending)
    scoredUpdates.sort((a, b) => b.relationScore - a.relationScore);
    
    // Return top updates
    return scoredUpdates.slice(0, limit).map(({ relationScore, ...update }) => update);
  }
}