import { DefaultPurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentFilter } from '../utils/content-filter';
import { DefaultContentEnhancer } from '../utils/content-enhancer';
import { DefaultContentRelationship } from '../utils/content-relationship';
import { ContentItem } from '../../content-integration/models/content-item';
import { PurposeContentItem, StoryOptions } from '../models/purpose-content';

describe('Purpose Content Integration Tests', () => {
  // Test data
  const testContentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Personal Story: My Journey',
      description: 'A personal story about my journey',
      contentType: 'video',
      source: 'youtube',
      url: 'https://youtube.com/watch?v=123',
      date: '2023-01-01',
      tags: ['story', 'personal', 'journey'],
      themes: [
        { id: 'theme1', name: 'Theme 1' },
        { id: 'theme2', name: 'Theme 2' }
      ],
      topics: [
        { id: 'topic1', name: 'Topic 1' }
      ]
    },
    {
      id: '2',
      title: 'Research Findings: Analysis of Data',
      description: 'Research findings and analysis',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/research',
      date: '2023-01-02',
      tags: ['research', 'findings', 'analysis'],
      themes: [
        { id: 'theme1', name: 'Theme 1' },
        { id: 'theme3', name: 'Theme 3' }
      ],
      topics: [
        { id: 'topic2', name: 'Topic 2' }
      ]
    },
    {
      id: '3',
      title: 'Workshop Event: Implementation Training',
      description: 'A workshop event for implementation training',
      contentType: 'event',
      source: 'airtable',
      url: 'https://example.com/event',
      date: '2023-01-03',
      tags: ['event', 'workshop', 'training'],
      themes: [
        { id: 'theme2', name: 'Theme 2' }
      ],
      topics: [
        { id: 'topic3', name: 'Topic 3' }
      ]
    },
    {
      id: '4',
      title: 'Implementation Toolkit',
      description: 'A toolkit for implementation',
      contentType: 'document',
      source: 'airtable',
      url: 'https://example.com/toolkit',
      date: '2023-01-04',
      tags: ['tool', 'implementation', 'toolkit'],
      themes: [
        { id: 'theme3', name: 'Theme 3' }
      ],
      topics: [
        { id: 'topic3', name: 'Topic 3' }
      ]
    },
    {
      id: '5',
      title: 'Newsletter: January 2023',
      description: 'January 2023 newsletter',
      contentType: 'newsletter',
      source: 'mailchimp',
      url: 'https://example.com/newsletter',
      date: '2023-01-05',
      tags: ['update', 'newsletter'],
      themes: [
        { id: 'theme1', name: 'Theme 1' }
      ],
      topics: [
        { id: 'topic1', name: 'Topic 1' }
      ]
    }
  ];
  
  // Create instances of the components
  const purposeClassifier = new DefaultPurposeClassifier();
  const contentFilter = new DefaultContentFilter();
  const contentEnhancer = new DefaultContentEnhancer(purposeClassifier);
  const contentRelationship = new DefaultContentRelationship();
  
  // Test the integration of purpose classifier and content filter
  describe('Purpose Classifier and Content Filter Integration', () => {
    let enhancedItems: PurposeContentItem[];
    
    beforeEach(() => {
      // Enhance content items with purpose information
      enhancedItems = contentEnhancer.enhanceMultipleWithPurpose(testContentItems);
    });
    
    it('should classify and filter content by purpose', () => {
      // Filter by story purpose
      const storyItems = contentFilter.filterByPurposeOptions(enhancedItems, {
        primaryPurpose: 'story'
      });
      
      // Filter by research purpose
      const researchItems = contentFilter.filterByPurposeOptions(enhancedItems, {
        primaryPurpose: 'research'
      });
      
      // Filter by event purpose
      const eventItems = contentFilter.filterByPurposeOptions(enhancedItems, {
        primaryPurpose: 'event'
      });
      
      // Filter by tool purpose
      const toolItems = contentFilter.filterByPurposeOptions(enhancedItems, {
        primaryPurpose: 'tool'
      });
      
      // Filter by update purpose
      const updateItems = contentFilter.filterByPurposeOptions(enhancedItems, {
        primaryPurpose: 'update'
      });
      
      // Assertions
      expect(storyItems.length).toBeGreaterThan(0);
      expect(researchItems.length).toBeGreaterThan(0);
      expect(eventItems.length).toBeGreaterThan(0);
      expect(toolItems.length).toBeGreaterThan(0);
      expect(updateItems.length).toBeGreaterThan(0);
      
      // Check that each item has the correct primary purpose
      expect(storyItems.every(item => item.primaryPurpose === 'story')).toBe(true);
      expect(researchItems.every(item => item.primaryPurpose === 'research')).toBe(true);
      expect(eventItems.every(item => item.primaryPurpose === 'event')).toBe(true);
      expect(toolItems.every(item => item.primaryPurpose === 'tool')).toBe(true);
      expect(updateItems.every(item => item.primaryPurpose === 'update')).toBe(true);
    });
    
    it('should filter content by theme', () => {
      // Filter by theme1
      const theme1Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        theme: 'theme1'
      });
      
      // Filter by theme2
      const theme2Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        theme: 'theme2'
      });
      
      // Filter by theme3
      const theme3Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        theme: 'theme3'
      });
      
      // Assertions
      expect(theme1Items.length).toBe(3); // Items 1, 2, and 5
      expect(theme2Items.length).toBe(2); // Items 1 and 3
      expect(theme3Items.length).toBe(2); // Items 2 and 4
      
      // Check that each item has the correct theme
      expect(theme1Items.every(item => 
        item.themes?.some(theme => theme.id === 'theme1')
      )).toBe(true);
      
      expect(theme2Items.every(item => 
        item.themes?.some(theme => theme.id === 'theme2')
      )).toBe(true);
      
      expect(theme3Items.every(item => 
        item.themes?.some(theme => theme.id === 'theme3')
      )).toBe(true);
    });
    
    it('should filter content by topic', () => {
      // Filter by topic1
      const topic1Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        topic: 'topic1'
      });
      
      // Filter by topic2
      const topic2Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        topic: 'topic2'
      });
      
      // Filter by topic3
      const topic3Items = contentFilter.filterByPurposeOptions(enhancedItems, {
        topic: 'topic3'
      });
      
      // Assertions
      expect(topic1Items.length).toBe(2); // Items 1 and 5
      expect(topic2Items.length).toBe(1); // Item 2
      expect(topic3Items.length).toBe(2); // Items 3 and 4
      
      // Check that each item has the correct topic
      expect(topic1Items.every(item => 
        item.topics?.some(topic => topic.id === 'topic1')
      )).toBe(true);
      
      expect(topic2Items.every(item => 
        item.topics?.some(topic => topic.id === 'topic2')
      )).toBe(true);
      
      expect(topic3Items.every(item => 
        item.topics?.some(topic => topic.id === 'topic3')
      )).toBe(true);
    });
    
    it('should filter content by purpose-specific options', () => {
      // Get story items
      const storyItems = enhancedItems.filter(item => item.primaryPurpose === 'story');
      
      // Add story-specific details
      const storyItemsWithDetails = storyItems.map(item => ({
        ...item,
        storyDetails: {
          storyType: 'personal' as const,
          protagonists: ['Person 1']
        }
      }));
      
      // Filter by story type
      const personalStories = contentFilter.filterByStoryOptions(storyItemsWithDetails, {
        primaryPurpose: 'story',
        storyType: 'personal'
      });
      
      // Assertions
      expect(personalStories.length).toBeGreaterThan(0);
      expect(personalStories.every(item => 
        item.storyDetails?.storyType === 'personal'
      )).toBe(true);
    });
  });
  
  // Test the integration of content enhancer and content relationship
  describe('Content Enhancer and Content Relationship Integration', () => {
    let enhancedItems: PurposeContentItem[];
    
    beforeEach(() => {
      // Enhance content items with purpose information
      enhancedItems = contentEnhancer.enhanceMultipleWithPurpose(testContentItems);
    });
    
    it('should find related content across purposes', () => {
      // Get the first item
      const item1 = enhancedItems[0];
      
      // Find related content
      const relatedItems = contentRelationship.findRelatedContent(
        item1,
        enhancedItems,
        { maxItems: 3 }
      );
      
      // Assertions
      expect(relatedItems.length).toBeGreaterThan(0);
      expect(relatedItems.length).toBeLessThanOrEqual(3);
      
      // Check that each related item has a relationship strength
      expect(relatedItems.every(item => 
        item.relationshipStrength !== undefined
      )).toBe(true);
      
      // Check that the related items are sorted by relationship strength
      expect(relatedItems).toEqual(
        [...relatedItems].sort((a, b) => 
          (b.relationshipStrength || 0) - (a.relationshipStrength || 0)
        )
      );
    });
    
    it('should enhance content with relationships', () => {
      // Enhance the first item with relationships
      const enhancedItem = contentEnhancer.enhanceWithRelationships(
        enhancedItems[0],
        enhancedItems
      );
      
      // Assertions
      expect(enhancedItem.relatedContent).toBeDefined();
      expect(enhancedItem.relatedContent!.length).toBeGreaterThan(0);
      
      // Check that each related item has a relationship strength
      expect(enhancedItem.relatedContent!.every(item => 
        item.relationshipStrength !== undefined
      )).toBe(true);
    });
    
    it('should enhance multiple content items with relationships', () => {
      // Enhance all items with relationships
      const enhancedWithRelationships = contentEnhancer.enhanceMultipleWithRelationships(
        enhancedItems
      );
      
      // Assertions
      expect(enhancedWithRelationships.length).toBe(enhancedItems.length);
      
      // Check that each item has related content
      expect(enhancedWithRelationships.every(item => 
        item.relatedContent !== undefined
      )).toBe(true);
      
      // Check that each item has at least one related item
      expect(enhancedWithRelationships.every(item => 
        item.relatedContent!.length > 0
      )).toBe(true);
    });
  });
});