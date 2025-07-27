/**
 * Utilities for finding related content
 */
import { PurposeContentItem } from '../models/purpose-content';

/**
 * Content relationship interface
 */
export interface ContentRelationship {
  findRelatedContent(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[],
    options?: RelatedContentOptions
  ): PurposeContentItem[];
}

/**
 * Related content options
 */
export interface RelatedContentOptions {
  maxItems?: number;
  excludeSamePurpose?: boolean;
  prioritizeSecondaryPurposes?: boolean;
  minRelationshipStrength?: number;
}

/**
 * Default content relationship implementation
 */
export class DefaultContentRelationship implements ContentRelationship {
  /**
   * Find related content for a given content item
   */
  findRelatedContent(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[],
    options: RelatedContentOptions = {}
  ): PurposeContentItem[] {
    const {
      maxItems = 10,
      excludeSamePurpose = false,
      prioritizeSecondaryPurposes = true,
      minRelationshipStrength = 0
    } = options;
    
    // Filter out the current item
    let filteredContent = allContent.filter(item => item.id !== contentItem.id);
    
    // Filter out items with the same purpose if excludeSamePurpose is true
    if (excludeSamePurpose) {
      filteredContent = filteredContent.filter(item => item.primaryPurpose !== contentItem.primaryPurpose);
    }
    
    // Calculate relationship strength for each item
    const relatedItems = filteredContent.map(item => {
      const strength = this.calculateRelationshipStrength(contentItem, item);
      
      return {
        ...item,
        relationshipStrength: strength
      };
    });
    
    // Filter out items with relationship strength below the minimum
    const filteredItems = relatedItems.filter(item => 
      (item.relationshipStrength || 0) >= minRelationshipStrength
    );
    
    // Sort by relationship strength
    let sortedItems = [...filteredItems].sort((a, b) => {
      const strengthA = a.relationshipStrength || 0;
      const strengthB = b.relationshipStrength || 0;
      return strengthB - strengthA;
    });
    
    // Prioritize items with secondary purposes matching the current item's primary purpose
    if (prioritizeSecondaryPurposes) {
      sortedItems = [
        ...sortedItems.filter(item => 
          item.secondaryPurposes?.includes(contentItem.primaryPurpose)
        ),
        ...sortedItems.filter(item => 
          !item.secondaryPurposes?.includes(contentItem.primaryPurpose)
        )
      ];
    }
    
    // Limit to maxItems
    return sortedItems.slice(0, maxItems);
  }
  
  /**
   * Calculate relationship strength between two content items
   */
  private calculateRelationshipStrength(
    item1: PurposeContentItem,
    item2: PurposeContentItem
  ): number {
    let strength = 0;
    
    // Check for shared themes
    if (item1.themes && item2.themes) {
      const item1ThemeIds = item1.themes.map(t => t.id);
      const item2ThemeIds = item2.themes.map(t => t.id);
      const sharedThemes = item1ThemeIds.filter(id => item2ThemeIds.includes(id));
      strength += sharedThemes.length * 10;
    }
    
    // Check for shared topics
    if (item1.topics && item2.topics) {
      const item1TopicIds = item1.topics.map(t => t.id);
      const item2TopicIds = item2.topics.map(t => t.id);
      const sharedTopics = item1TopicIds.filter(id => item2TopicIds.includes(id));
      strength += sharedTopics.length * 8;
    }
    
    // Check for shared tags
    if (item1.tags && item2.tags) {
      const sharedTags = item1.tags.filter(tag => item2.tags?.includes(tag));
      strength += sharedTags.length * 5;
    }
    
    // Check for shared regions
    if (item1.regions && item2.regions) {
      const item1RegionIds = item1.regions.map(r => r.id);
      const item2RegionIds = item2.regions.map(r => r.id);
      const sharedRegions = item1RegionIds.filter(id => item2RegionIds.includes(id));
      strength += sharedRegions.length * 7;
    }
    
    // Check for shared authors
    if (item1.authors && item2.authors) {
      const sharedAuthors = item1.authors.filter(author => item2.authors?.includes(author));
      strength += sharedAuthors.length * 15;
    }
    
    // Boost if same primary purpose
    if (item1.primaryPurpose === item2.primaryPurpose) {
      strength += 5;
    }
    
    // Boost if item1's purpose is in item2's secondary purposes
    if (item2.secondaryPurposes?.includes(item1.primaryPurpose)) {
      strength += 10;
    }
    
    // Boost if item2's purpose is in item1's secondary purposes
    if (item1.secondaryPurposes?.includes(item2.primaryPurpose)) {
      strength += 10;
    }
    
    // Boost if items have similar dates (within 30 days)
    if (item1.date && item2.date) {
      const date1 = new Date(item1.date).getTime();
      const date2 = new Date(item2.date).getTime();
      const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 30) {
        strength += Math.max(0, 10 - daysDiff / 3); // Max 10 points for same day, decreasing to 0 at 30 days
      }
    }
    
    // Normalize strength to 0-100 scale
    return Math.min(100, Math.max(0, strength));
  }
}