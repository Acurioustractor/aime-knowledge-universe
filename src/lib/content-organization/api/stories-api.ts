/**
 * Stories API for accessing story-focused content
 */
import { ContentItem } from '../../content-integration/models/content-item';
import { 
  PurposeContentItem, 
  StoryOptions,
  StoryType
} from '../models/purpose-content';
import { DefaultPurposeClassifier, PurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer, ContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentFilter, ContentFilter } from '../utils/content-filter';

/**
 * Stories API interface
 */
export interface StoriesAPI {
  fetchStories(options?: StoryOptions): Promise<PurposeContentItem[]>;
  fetchStoryById(id: string): Promise<PurposeContentItem | null>;
  fetchStoriesByTheme(theme: string, options?: StoryOptions): Promise<PurposeContentItem[]>;
  fetchFeaturedStories(limit?: number): Promise<PurposeContentItem[]>;
  fetchRelatedStories(contentId: string, limit?: number): Promise<PurposeContentItem[]>;
}

/**
 * Default Stories API implementation
 */
export class DefaultStoriesAPI implements StoriesAPI {
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
   * Fetch stories with optional filtering
   */
  async fetchStories(options: StoryOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'story'
    const storyOptions: StoryOptions = {
      ...options,
      primaryPurpose: 'story'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by story options
    return this.contentFilter.filterByStoryOptions(enhancedContent, storyOptions);
  }
  
  /**
   * Fetch a story by ID
   */
  async fetchStoryById(id: string): Promise<PurposeContentItem | null> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(id);
    
    if (!content) return null;
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceWithPurpose(content);
    
    // Check if content is a story
    if (enhancedContent.primaryPurpose !== 'story' && 
        !enhancedContent.secondaryPurposes?.includes('story')) {
      return null;
    }
    
    return enhancedContent;
  }
  
  /**
   * Fetch stories by theme
   */
  async fetchStoriesByTheme(theme: string, options: StoryOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'story' and theme
    const storyOptions: StoryOptions = {
      ...options,
      primaryPurpose: 'story',
      theme
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by story options
    return this.contentFilter.filterByStoryOptions(enhancedContent, storyOptions);
  }
  
  /**
   * Fetch featured stories
   */
  async fetchFeaturedStories(limit: number = 5): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'story' and sort by relevance
    const storyOptions: StoryOptions = {
      primaryPurpose: 'story',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by story options
    return this.contentFilter.filterByStoryOptions(enhancedContent, storyOptions);
  }
  
  /**
   * Fetch related stories for a content item
   */
  async fetchRelatedStories(contentId: string, limit: number = 5): Promise<PurposeContentItem[]> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(contentId);
    
    if (!content) return [];
    
    // Get themes from content
    const themes = content.themes?.map(theme => theme.id) || [];
    
    // Get topics from content
    const topics = content.topics?.map(topic => topic.id) || [];
    
    // Set primary purpose to 'story' and filter by themes and topics
    const storyOptions: StoryOptions = {
      primaryPurpose: 'story',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by story options
    let relatedStories = this.contentFilter.filterByStoryOptions(enhancedContent, storyOptions);
    
    // Filter out the original content
    relatedStories = relatedStories.filter(item => item.id !== contentId);
    
    // Score stories by relevance to original content
    const scoredStories = relatedStories.map(story => {
      let score = 0;
      
      // Score by matching themes
      story.themes?.forEach(theme => {
        if (themes.includes(theme.id)) {
          score += 10;
        }
      });
      
      // Score by matching topics
      story.topics?.forEach(topic => {
        if (topics.includes(topic.id)) {
          score += 5;
        }
      });
      
      // Score by matching tags
      const contentTags = content.tags || [];
      const storyTags = story.tags || [];
      const matchingTags = storyTags.filter(tag => contentTags.includes(tag));
      score += matchingTags.length * 3;
      
      return {
        ...story,
        relationScore: score
      };
    });
    
    // Sort by relation score (descending)
    scoredStories.sort((a, b) => b.relationScore - a.relationScore);
    
    // Return top stories
    return scoredStories.slice(0, limit).map(({ relationScore, ...story }) => story);
  }
}

/**
 * Content provider interface
 */
export interface ContentProvider {
  getAllContent(): Promise<ContentItem[]>;
  getContentById(id: string): Promise<ContentItem | null>;
}

/**
 * Mock content provider for testing
 */
export class MockContentProvider implements ContentProvider {
  private content: ContentItem[];
  
  constructor(content: ContentItem[] = []) {
    this.content = content;
  }
  
  async getAllContent(): Promise<ContentItem[]> {
    return this.content;
  }
  
  async getContentById(id: string): Promise<ContentItem | null> {
    return this.content.find(item => item.id === id) || null;
  }
}