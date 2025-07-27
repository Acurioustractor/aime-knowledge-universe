/**
 * Events API for accessing event and program content
 */
import { ContentItem } from '../../content-integration/models/content-item';
import { 
  PurposeContentItem, 
  EventOptions,
  EventType
} from '../models/purpose-content';
import { DefaultPurposeClassifier, PurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer, ContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentFilter, ContentFilter } from '../utils/content-filter';
import { ContentProvider } from './stories-api';

/**
 * Events API interface
 */
export interface EventsAPI {
  fetchEvents(options?: EventOptions): Promise<PurposeContentItem[]>;
  fetchEventById(id: string): Promise<PurposeContentItem | null>;
  fetchUpcomingEvents(limit?: number): Promise<PurposeContentItem[]>;
  fetchPastEvents(options?: EventOptions): Promise<PurposeContentItem[]>;
  fetchEventsByRegion(region: string, options?: EventOptions): Promise<PurposeContentItem[]>;
  fetchEventsByType(type: string, options?: EventOptions): Promise<PurposeContentItem[]>;
}

/**
 * Default Events API implementation
 */
export class DefaultEventsAPI implements EventsAPI {
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
   * Fetch events with optional filtering
   */
  async fetchEvents(options: EventOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'event'
    const eventOptions: EventOptions = {
      ...options,
      primaryPurpose: 'event'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by event options
    return this.contentFilter.filterByEventOptions(enhancedContent, eventOptions);
  }
  
  /**
   * Fetch event by ID
   */
  async fetchEventById(id: string): Promise<PurposeContentItem | null> {
    // Fetch content by ID
    const content = await this.contentProvider.getContentById(id);
    
    if (!content) return null;
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceWithPurpose(content);
    
    // Check if content is an event
    if (enhancedContent.primaryPurpose !== 'event' && 
        !enhancedContent.secondaryPurposes?.includes('event')) {
      return null;
    }
    
    return enhancedContent;
  }
  
  /**
   * Fetch upcoming events
   */
  async fetchUpcomingEvents(limit: number = 5): Promise<PurposeContentItem[]> {
    const now = new Date();
    
    // Set primary purpose to 'event' and filter for future events
    const eventOptions: EventOptions = {
      primaryPurpose: 'event',
      dateFrom: now.toISOString(),
      sortBy: 'date',
      sortOrder: 'asc',
      limit
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by event options
    return this.contentFilter.filterByEventOptions(enhancedContent, eventOptions);
  }
  
  /**
   * Fetch past events
   */
  async fetchPastEvents(options: EventOptions = {}): Promise<PurposeContentItem[]> {
    const now = new Date();
    
    // Set primary purpose to 'event' and filter for past events
    const eventOptions: EventOptions = {
      ...options,
      primaryPurpose: 'event',
      dateTo: now.toISOString(),
      sortBy: 'date',
      sortOrder: 'desc'
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by event options
    return this.contentFilter.filterByEventOptions(enhancedContent, eventOptions);
  }
  
  /**
   * Fetch events by region
   */
  async fetchEventsByRegion(region: string, options: EventOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'event' and region
    const eventOptions: EventOptions = {
      ...options,
      primaryPurpose: 'event',
      region
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by event options
    return this.contentFilter.filterByEventOptions(enhancedContent, eventOptions);
  }
  
  /**
   * Fetch events by type
   */
  async fetchEventsByType(type: string, options: EventOptions = {}): Promise<PurposeContentItem[]> {
    // Set primary purpose to 'event' and event type
    const eventOptions: EventOptions = {
      ...options,
      primaryPurpose: 'event',
      eventType: type as EventType
    };
    
    // Fetch all content
    const allContent = await this.contentProvider.getAllContent();
    
    // Enhance content with purpose fields
    const enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
    
    // Filter by event options
    return this.contentFilter.filterByEventOptions(enhancedContent, eventOptions);
  }
}