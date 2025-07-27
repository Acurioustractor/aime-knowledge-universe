/**
 * Search Utility
 * 
 * This utility provides functions for searching content with purpose-awareness.
 */

import { ContentItem, SearchOptions as BaseSearchOptions, SearchResult } from '../../content-integration/models/content-item';
import { ContentPurpose, PurposeContentItem } from '../models/purpose-content';
import { DefaultContentEnhancer } from './content-enhancer';

/**
 * Purpose-aware search options
 */
export interface SearchOptions extends BaseSearchOptions {
  purpose?: ContentPurpose;
  minPurposeRelevance?: number;
}

/**
 * Purpose-aware search result
 */
export interface PurposeSearchResult extends SearchResult {
  primaryPurpose: ContentPurpose;
  purposeRelevance: number;
  secondaryPurposes?: ContentPurpose[];
}

/**
 * Search utility interface
 */
export interface SearchUtility {
  /**
   * Search content with purpose-awareness
   */
  search(options: SearchOptions): Promise<PurposeSearchResult[]>;
  
  /**
   * Group search results by purpose
   */
  groupByPurpose(results: PurposeSearchResult[]): Record<ContentPurpose, PurposeSearchResult[]>;
}

/**
 * Default search utility implementation
 */
export class DefaultSearchUtility implements SearchUtility {
  private contentEnhancer?: DefaultContentEnhancer;
  
  constructor(contentEnhancer?: DefaultContentEnhancer) {
    this.contentEnhancer = contentEnhancer;
  }
  
  /**
   * Search content with purpose-awareness
   */
  async search(options: SearchOptions): Promise<PurposeSearchResult[]> {
    try {
      // Get all content
      const allContent = await this.getAllContent();
      
      // Enhance content with purpose information
      let enhancedContent: PurposeContentItem[] = [];
      
      if (this.contentEnhancer) {
        enhancedContent = this.contentEnhancer.enhanceMultipleWithPurpose(allContent);
      } else {
        // If no content enhancer is provided, return mock data with purpose information
        enhancedContent = this.getMockPurposeContent();
      }
      
      // Filter by purpose if specified
      let filteredContent = enhancedContent;
      if (options.purpose) {
        filteredContent = filteredContent.filter(item => 
          item.primaryPurpose === options.purpose ||
          (item.secondaryPurposes && item.secondaryPurposes.includes(options.purpose!))
        );
      }
      
      // Filter by minimum purpose relevance if specified
      if (options.minPurposeRelevance) {
        filteredContent = filteredContent.filter(item => 
          item.purposeRelevance >= options.minPurposeRelevance!
        );
      }
      
      // Search content
      const results = this.searchContent(filteredContent, options);
      
      // Sort results
      this.sortResults(results, options);
      
      // Apply limit and offset
      return this.applyLimitAndOffset(results, options);
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }
  
  /**
   * Group search results by purpose
   */
  groupByPurpose(results: PurposeSearchResult[]): Record<ContentPurpose, PurposeSearchResult[]> {
    const grouped: Record<ContentPurpose, PurposeSearchResult[]> = {
      story: [],
      tool: [],
      research: [],
      event: [],
      update: []
    };
    
    results.forEach(result => {
      grouped[result.primaryPurpose].push(result);
    });
    
    return grouped;
  }
  
  /**
   * Get all content
   */
  private async getAllContent(): Promise<ContentItem[]> {
    try {
      // In a real implementation, this would fetch content from the API
      // For now, return mock data
      return [];
    } catch (error) {
      console.error('Error getting all content:', error);
      return [];
    }
  }
  
  /**
   * Search content
   */
  private searchContent(content: PurposeContentItem[], options: SearchOptions): PurposeSearchResult[] {
    if (!options.query) {
      return content.map(item => ({
        ...item,
        relevance: 100,
      })) as PurposeSearchResult[];
    }
    
    const query = options.query.toLowerCase();
    const results: PurposeSearchResult[] = [];
    
    content.forEach(item => {
      let relevance = 0;
      const matchedTerms: string[] = [];
      
      // Check title
      if (item.title && item.title.toLowerCase().includes(query)) {
        relevance += 50;
        matchedTerms.push('title');
      }
      
      // Check description
      if (item.description && item.description.toLowerCase().includes(query)) {
        relevance += 30;
        matchedTerms.push('description');
      }
      
      // Check content
      if (item.content && item.content.toLowerCase().includes(query)) {
        relevance += 20;
        matchedTerms.push('content');
      }
      
      // Check tags
      if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) {
        relevance += 40;
        matchedTerms.push('tags');
      }
      
      // Check themes
      if (item.themes && item.themes.some(theme => theme.name.toLowerCase().includes(query))) {
        relevance += 40;
        matchedTerms.push('themes');
      }
      
      // Check topics
      if (item.topics && item.topics.some(topic => topic.name.toLowerCase().includes(query))) {
        relevance += 40;
        matchedTerms.push('topics');
      }
      
      // Add to results if relevant
      if (relevance > 0) {
        results.push({
          ...item,
          relevance,
          matchedTerms,
        });
      }
    });
    
    return results;
  }
  
  /**
   * Sort results
   */
  private sortResults(results: PurposeSearchResult[], options: SearchOptions): void {
    const sortBy = options.sortBy || 'relevance';
    const sortOrder = options.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = a.relevance - b.relevance;
          break;
        case 'date':
          if (!a.date) return sortOrder === 'asc' ? -1 : 1;
          if (!b.date) return sortOrder === 'asc' ? 1 : -1;
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  /**
   * Apply limit and offset
   */
  private applyLimitAndOffset(results: PurposeSearchResult[], options: SearchOptions): PurposeSearchResult[] {
    const offset = options.offset || 0;
    const limit = options.limit || results.length;
    
    return results.slice(offset, offset + limit);
  }
  
  /**
   * Get mock purpose content for testing
   */
  private getMockPurposeContent(): PurposeContentItem[] {
    return [
      {
        id: 'story1',
        title: 'Personal Story: My Journey in Education',
        description: 'A personal story about my journey in education',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=123',
        date: '2023-01-01',
        tags: ['story', 'personal', 'journey', 'education'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 90 }],
        topics: [{ id: 'topic1', name: 'Personal Growth', keywords: ['growth'] }],
        authors: ['Author 1'],
        primaryPurpose: 'story',
        purposeRelevance: 90,
        storyDetails: {
          storyType: 'personal'
        }
      },
      {
        id: 'research1',
        title: 'Research Findings: Education Impact',
        description: 'Research findings about education impact',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/research',
        date: '2023-01-02',
        tags: ['research', 'education', 'impact'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
        topics: [{ id: 'topic2', name: 'Impact Assessment', keywords: ['impact'] }],
        authors: ['Author 2'],
        primaryPurpose: 'research',
        purposeRelevance: 85,
        researchDetails: {
          researchType: 'finding'
        }
      },
      {
        id: 'tool1',
        title: 'Implementation Toolkit: Education',
        description: 'A toolkit for education implementation',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/toolkit',
        date: '2023-01-10',
        tags: ['tool', 'toolkit', 'education', 'implementation'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 80 }],
        topics: [{ id: 'topic4', name: 'Implementation', keywords: ['implement'] }],
        authors: ['Author 5'],
        primaryPurpose: 'tool',
        purposeRelevance: 95,
        toolDetails: {
          toolType: 'toolkit'
        }
      },
      {
        id: 'event1',
        title: 'Workshop: Education Innovation',
        description: 'A workshop about education innovation',
        contentType: 'event',
        source: 'airtable',
        url: 'https://example.com/event',
        date: '2023-02-01',
        tags: ['event', 'workshop', 'education', 'innovation'],
        themes: [
          { id: 'theme1', name: 'Education', relevance: 75 }, 
          { id: 'theme2', name: 'Innovation', relevance: 80 }
        ],
        topics: [{ id: 'topic3', name: 'Education Innovation', keywords: ['innovation'] }],
        authors: ['Author 3'],
        primaryPurpose: 'event',
        purposeRelevance: 90,
        eventDetails: {
          eventType: 'workshop'
        }
      },
      {
        id: 'update1',
        title: 'Newsletter: January 2023',
        description: 'January 2023 newsletter with updates on education initiatives',
        contentType: 'newsletter',
        source: 'mailchimp',
        url: 'https://example.com/newsletter',
        date: '2023-01-15',
        tags: ['update', 'newsletter', 'education'],
        themes: [{ id: 'theme3', name: 'Community', relevance: 70 }],
        authors: ['Author 4'],
        primaryPurpose: 'update',
        purposeRelevance: 85,
        updateDetails: {
          updateType: 'newsletter'
        }
      },
      {
        id: 'story2',
        title: 'Impact Story: Education in Rural Communities',
        description: 'A story about the impact of education initiatives in rural communities',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=456',
        date: '2023-01-20',
        tags: ['story', 'impact', 'education', 'rural'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
        topics: [{ id: 'topic5', name: 'Rural Education', keywords: ['rural'] }],
        authors: ['Author 6'],
        primaryPurpose: 'story',
        purposeRelevance: 85,
        storyDetails: {
          storyType: 'impact'
        }
      }
    ];
  }
}