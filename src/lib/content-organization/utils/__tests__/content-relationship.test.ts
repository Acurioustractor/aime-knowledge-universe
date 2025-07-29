import { DefaultContentRelationship } from '../content-relationship';
import { PurposeContentItem } from '../../models/purpose-content';

describe('DefaultContentRelationship', () => {
  let contentRelationship: DefaultContentRelationship;
  let testItems: PurposeContentItem[];
  
  beforeEach(() => {
    contentRelationship = new DefaultContentRelationship();
    
    // Create test content items
    testItems = [
      // Item 1: Story with themes 1, 2 and topics 1, 2
      {
        id: 'item1',
        title: 'Item 1',
        description: 'Item 1 description',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/item1',
        date: '2023-01-01',
        primaryPurpose: 'story',
        purposeRelevance: 90,
        themes: [
          { id: 'theme1', name: 'Theme 1' },
          { id: 'theme2', name: 'Theme 2' }
        ],
        topics: [
          { id: 'topic1', name: 'Topic 1' },
          { id: 'topic2', name: 'Topic 2' }
        ],
        tags: ['tag1', 'tag2'],
        authors: ['Author 1']
      },
      
      // Item 2: Research with theme 1 and topic 1
      {
        id: 'item2',
        title: 'Item 2',
        description: 'Item 2 description',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/item2',
        date: '2023-01-02',
        primaryPurpose: 'research',
        purposeRelevance: 85,
        themes: [
          { id: 'theme1', name: 'Theme 1' }
        ],
        topics: [
          { id: 'topic1', name: 'Topic 1' }
        ],
        tags: ['tag1', 'tag3'],
        authors: ['Author 2']
      },
      
      // Item 3: Tool with theme 2 and topic 2
      {
        id: 'item3',
        title: 'Item 3',
        description: 'Item 3 description',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/item3',
        date: '2023-01-03',
        primaryPurpose: 'tool',
        purposeRelevance: 80,
        themes: [
          { id: 'theme2', name: 'Theme 2' }
        ],
        topics: [
          { id: 'topic2', name: 'Topic 2' }
        ],
        tags: ['tag2', 'tag4'],
        authors: ['Author 1']
      },
      
      // Item 4: Event with no shared themes or topics
      {
        id: 'item4',
        title: 'Item 4',
        description: 'Item 4 description',
        contentType: 'event',
        source: 'airtable',
        url: 'https://example.com/item4',
        date: '2023-01-04',
        primaryPurpose: 'event',
        purposeRelevance: 75,
        themes: [
          { id: 'theme3', name: 'Theme 3' }
        ],
        topics: [
          { id: 'topic3', name: 'Topic 3' }
        ],
        tags: ['tag5'],
        authors: ['Author 3']
      },
      
      // Item 5: Update with theme 1 and secondary purpose 'story'
      {
        id: 'item5',
        title: 'Item 5',
        description: 'Item 5 description',
        contentType: 'newsletter',
        source: 'mailchimp',
        url: 'https://example.com/item5',
        date: '2023-01-05',
        primaryPurpose: 'update',
        secondaryPurposes: ['story'],
        purposeRelevance: 70,
        themes: [
          { id: 'theme1', name: 'Theme 1' }
        ],
        tags: ['tag1'],
        authors: ['Author 2']
      }
    ];
  });
  
  describe('findRelatedContent', () => {
    it('should find related content based on shared themes', () => {
      const contentItem = testItems[0]; // Item 1 with themes 1, 2
      const relatedItems = contentRelationship.findRelatedContent(contentItem, testItems);
      
      // Should find items 2, 3, and 5 (all share at least one theme with item 1)
      expect(relatedItems.length).toBe(3);
      expect(relatedItems.some(item => item.id === 'item2')).toBe(true);
      expect(relatedItems.some(item => item.id === 'item3')).toBe(true);
      expect(relatedItems.some(item => item.id === 'item5')).toBe(true);
    });
    
    it('should find related content based on shared topics', () => {
      const contentItem = testItems[0]; // Item 1 with topics 1, 2
      const relatedItems = contentRelationship.findRelatedContent(contentItem, testItems);
      
      // Should find items 2 and 3 (share topics with item 1)
      expect(relatedItems.some(item => item.id === 'item2')).toBe(true);
      expect(relatedItems.some(item => item.id === 'item3')).toBe(true);
    });
    
    it('should find related content based on shared tags', () => {
      const contentItem = testItems[0]; // Item 1 with tags 'tag1', 'tag2'
      const relatedItems = contentRelationship.findRelatedContent(contentItem, testItems);
      
      // Should find items 2, 3, and 5 (share tags with item 1)
      expect(relatedItems.some(item => item.id === 'item2')).toBe(true);
      expect(relatedItems.some(item => item.id === 'item3')).toBe(true);
      expect(relatedItems.some(item => item.id === 'item5')).toBe(true);
    });
    
    it('should find related content based on shared authors', () => {
      const contentItem = testItems[0]; // Item 1 with author 'Author 1'
      const relatedItems = contentRelationship.findRelatedContent(contentItem, testItems);
      
      // Should find item 3 (shares author with item 1)
      expect(relatedItems.some(item => item.id === 'item3')).toBe(true);
    });
    
    it('should prioritize content with secondary purposes matching the primary purpose', () => {
      const contentItem = testItems[0]; // Item 1 with primary purpose 'story'
      const relatedItems = contentRelationship.findRelatedContent(
        contentItem, 
        testItems,
        { prioritizeSecondaryPurposes: true }
      );
      
      // Item 5 has secondary purpose 'story' which matches item 1's primary purpose
      // It should be ranked higher than other items
      expect(relatedItems[0].id).toBe('item5');
    });
    
    it('should exclude content with the same purpose if specified', () => {
      const contentItem = testItems[0]; // Item 1 with primary purpose 'story'
      const otherItems = [
        testItems[1], // 'research'
        testItems[2], // 'tool'
        {
          ...testItems[3], // 'event'
          primaryPurpose: 'story' // Change to 'story' to test exclusion
        },
        testItems[4] // 'update'
      ];
      
      const relatedItems = contentRelationship.findRelatedContent(
        contentItem, 
        otherItems,
        { excludeSamePurpose: true }
      );
      
      // Should not include the item with purpose 'story'
      expect(relatedItems.every(item => item.primaryPurpose !== 'story')).toBe(true);
    });
    
    it('should limit the number of results', () => {
      const contentItem = testItems[0];
      const relatedItems = contentRelationship.findRelatedContent(
        contentItem, 
        testItems,
        { maxItems: 2 }
      );
      
      expect(relatedItems.length).toBe(2);
    });
    
    it('should filter by minimum relationship strength', () => {
      const contentItem = testItems[0];
      
      // First get all related items with their relationship strengths
      const allRelatedItems = contentRelationship.findRelatedContent(
        contentItem, 
        testItems
      );
      
      // Find the item with the lowest relationship strength
      const lowestStrength = Math.min(...allRelatedItems.map(item => item.relationshipStrength || 0));
      
      // Now filter with a minimum strength higher than the lowest
      const filteredItems = contentRelationship.findRelatedContent(
        contentItem, 
        testItems,
        { minRelationshipStrength: lowestStrength + 1 }
      );
      
      // Should have fewer items than the full list
      expect(filteredItems.length).toBeLessThan(allRelatedItems.length);
    });
    
    it('should calculate relationship strength for each item', () => {
      const contentItem = testItems[0];
      const relatedItems = contentRelationship.findRelatedContent(contentItem, testItems);
      
      // All related items should have a relationship strength
      expect(relatedItems.every(item => item.relationshipStrength !== undefined)).toBe(true);
      
      // All relationship strengths should be between 0 and 100
      expect(relatedItems.every(item => {
        const strength = item.relationshipStrength || 0;
        return strength >= 0 && strength <= 100;
      })).toBe(true);
    });
  });
});