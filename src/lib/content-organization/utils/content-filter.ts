/**
 * Content Filter Utility
 * 
 * This utility provides functions for filtering content by purpose and other criteria.
 */

import { PurposeContentItem } from '../models/purpose-content';
import { ContentPurpose } from '../models/purpose-content';

/**
 * Content filter options
 */
export interface ContentFilterOptions {
  primaryPurpose?: ContentPurpose;
  secondaryPurposes?: ContentPurpose[];
  theme?: string;
  topic?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  sortBy?: 'date' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Story-specific filter options
 */
export interface StoryFilterOptions extends ContentFilterOptions {
  storyType?: string;
  protagonist?: string;
}

/**
 * Tool-specific filter options
 */
export interface ToolFilterOptions extends ContentFilterOptions {
  toolType?: string;
  audience?: string;
  context?: string;
}

/**
 * Research-specific filter options
 */
export interface ResearchFilterOptions extends ContentFilterOptions {
  researchType?: string;
  methodology?: string;
}

/**
 * Event-specific filter options
 */
export interface EventFilterOptions extends ContentFilterOptions {
  eventType?: string;
  location?: string;
}

/**
 * Update-specific filter options
 */
export interface UpdateFilterOptions extends ContentFilterOptions {
  updateType?: string;
  publisher?: string;
}

/**
 * Default content filter implementation
 */
export class DefaultContentFilter {
  /**
   * Filter content by purpose options
   */
  filterByPurposeOptions(
    contentItems: PurposeContentItem[],
    options: ContentFilterOptions
  ): PurposeContentItem[] {
    let filteredItems = [...contentItems];
    
    // Filter by primary purpose
    if (options.primaryPurpose) {
      filteredItems = filteredItems.filter(item => 
        item.primaryPurpose === options.primaryPurpose
      );
    }
    
    // Filter by secondary purposes
    if (options.secondaryPurposes && options.secondaryPurposes.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.secondaryPurposes && 
        options.secondaryPurposes!.some(purpose => 
          item.secondaryPurposes!.includes(purpose)
        )
      );
    }
    
    // Filter by theme
    if (options.theme) {
      filteredItems = filteredItems.filter(item => 
        item.themes && item.themes.some(theme => 
          theme.id === options.theme || theme.name === options.theme
        )
      );
    }
    
    // Filter by topic
    if (options.topic) {
      filteredItems = filteredItems.filter(item => 
        item.topics && item.topics.some(topic => 
          topic.id === options.topic || topic.name === options.topic
        )
      );
    }
    
    // Filter by tag
    if (options.tag) {
      filteredItems = filteredItems.filter(item => 
        item.tags && item.tags.includes(options.tag!)
      );
    }
    
    // Filter by date range
    if (options.dateFrom || options.dateTo) {
      filteredItems = filteredItems.filter(item => {
        if (!item.date) return false;
        
        const itemDate = new Date(item.date);
        
        if (options.dateFrom) {
          const fromDate = new Date(options.dateFrom);
          if (itemDate < fromDate) return false;
        }
        
        if (options.dateTo) {
          const toDate = new Date(options.dateTo);
          if (itemDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    // Filter by author
    if (options.author) {
      filteredItems = filteredItems.filter(item => 
        item.authors && item.authors.includes(options.author!)
      );
    }
    
    // Sort items
    if (options.sortBy) {
      filteredItems.sort((a, b) => {
        switch (options.sortBy) {
          case 'date':
            if (!a.date) return options.sortOrder === 'asc' ? -1 : 1;
            if (!b.date) return options.sortOrder === 'asc' ? 1 : -1;
            return options.sortOrder === 'asc' 
              ? new Date(a.date).getTime() - new Date(b.date).getTime()
              : new Date(b.date).getTime() - new Date(a.date).getTime();
          
          case 'title':
            return options.sortOrder === 'asc'
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          
          case 'relevance':
            return options.sortOrder === 'asc'
              ? a.purposeRelevance - b.purposeRelevance
              : b.purposeRelevance - a.purposeRelevance;
          
          default:
            return 0;
        }
      });
    }
    
    // Apply limit and offset
    if (options.offset || options.limit) {
      const offset = options.offset || 0;
      const limit = options.limit || filteredItems.length;
      filteredItems = filteredItems.slice(offset, offset + limit);
    }
    
    return filteredItems;
  }
  
  /**
   * Filter content by story options
   */
  filterByStoryOptions(
    contentItems: PurposeContentItem[],
    options: StoryFilterOptions
  ): PurposeContentItem[] {
    // First filter by purpose options
    let filteredItems = this.filterByPurposeOptions(contentItems, {
      ...options,
      primaryPurpose: 'story'
    });
    
    // Filter by story type
    if (options.storyType) {
      filteredItems = filteredItems.filter(item => 
        item.storyDetails && item.storyDetails.storyType === options.storyType
      );
    }
    
    // Filter by protagonist
    if (options.protagonist) {
      filteredItems = filteredItems.filter(item => 
        item.storyDetails && 
        item.storyDetails.protagonists && 
        item.storyDetails.protagonists.includes(options.protagonist!)
      );
    }
    
    return filteredItems;
  }
  
  /**
   * Filter content by tool options
   */
  filterByToolOptions(
    contentItems: PurposeContentItem[],
    options: ToolFilterOptions
  ): PurposeContentItem[] {
    // First filter by purpose options
    let filteredItems = this.filterByPurposeOptions(contentItems, {
      ...options,
      primaryPurpose: 'tool'
    });
    
    // Filter by tool type
    if (options.toolType) {
      filteredItems = filteredItems.filter(item => 
        item.toolDetails && item.toolDetails.toolType === options.toolType
      );
    }
    
    // Filter by audience
    if (options.audience) {
      filteredItems = filteredItems.filter(item => 
        item.toolDetails && 
        item.toolDetails.targetAudience && 
        item.toolDetails.targetAudience.includes(options.audience!)
      );
    }
    
    // Filter by context
    if (options.context) {
      filteredItems = filteredItems.filter(item => 
        item.toolDetails && 
        item.toolDetails.implementationContext && 
        item.toolDetails.implementationContext.includes(options.context!)
      );
    }
    
    return filteredItems;
  }
  
  /**
   * Filter content by research options
   */
  filterByResearchOptions(
    contentItems: PurposeContentItem[],
    options: ResearchFilterOptions
  ): PurposeContentItem[] {
    // First filter by purpose options
    let filteredItems = this.filterByPurposeOptions(contentItems, {
      ...options,
      primaryPurpose: 'research'
    });
    
    // Filter by research type
    if (options.researchType) {
      filteredItems = filteredItems.filter(item => 
        item.researchDetails && item.researchDetails.researchType === options.researchType
      );
    }
    
    // Filter by methodology
    if (options.methodology) {
      filteredItems = filteredItems.filter(item => 
        item.researchDetails && 
        item.researchDetails.methodology === options.methodology
      );
    }
    
    return filteredItems;
  }
  
  /**
   * Filter content by event options
   */
  filterByEventOptions(
    contentItems: PurposeContentItem[],
    options: EventFilterOptions
  ): PurposeContentItem[] {
    // First filter by purpose options
    let filteredItems = this.filterByPurposeOptions(contentItems, {
      ...options,
      primaryPurpose: 'event'
    });
    
    // Filter by event type
    if (options.eventType) {
      filteredItems = filteredItems.filter(item => 
        item.eventDetails && item.eventDetails.eventType === options.eventType
      );
    }
    
    // Filter by location
    if (options.location) {
      filteredItems = filteredItems.filter(item => 
        item.eventDetails && 
        item.eventDetails.location === options.location
      );
    }
    
    return filteredItems;
  }
  
  /**
   * Filter content by update options
   */
  filterByUpdateOptions(
    contentItems: PurposeContentItem[],
    options: UpdateFilterOptions
  ): PurposeContentItem[] {
    // First filter by purpose options
    let filteredItems = this.filterByPurposeOptions(contentItems, {
      ...options,
      primaryPurpose: 'update'
    });
    
    // Filter by update type
    if (options.updateType) {
      filteredItems = filteredItems.filter(item => 
        item.updateDetails && item.updateDetails.updateType === options.updateType
      );
    }
    
    // Filter by publisher
    if (options.publisher) {
      filteredItems = filteredItems.filter(item => 
        item.updateDetails && 
        item.updateDetails.publisher === options.publisher
      );
    }
    
    return filteredItems;
  }
}