import { DefaultContentFilter } from '../content-filter';
import { PurposeContentItem, StoryOptions, ToolOptions, ResearchOptions, EventOptions, UpdateOptions } from '../../models/purpose-content';

describe('DefaultContentFilter', () => {
  let contentFilter: DefaultContentFilter;
  let testItems: PurposeContentItem[];
  
  beforeEach(() => {
    contentFilter = new DefaultContentFilter();
    
    // Create test content items
    testItems = [
      // Story items
      {
        id: 'story1',
        title: 'Personal Story 1',
        description: 'A personal story',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=123',
        date: '2023-01-01',
        primaryPurpose: 'story',
        purposeRelevance: 90,
        storyDetails: {
          storyType: 'personal',
          protagonists: ['Person 1']
        },
        themes: [{ id: 'theme1', name: 'Theme 1' }],
        topics: [{ id: 'topic1', name: 'Topic 1' }]
      },
      {
        id: 'story2',
        title: 'Case Study 1',
        description: 'A case study',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/case-study',
        date: '2023-01-02',
        primaryPurpose: 'story',
        purposeRelevance: 85,
        storyDetails: {
          storyType: 'case_study',
          protagonists: ['Organization 1']
        },
        themes: [{ id: 'theme2', name: 'Theme 2' }],
        topics: [{ id: 'topic2', name: 'Topic 2' }]
      },
      
      // Tool items
      {
        id: 'tool1',
        title: 'Implementation Toolkit',
        description: 'A toolkit for implementation',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/toolkit',
        date: '2023-01-03',
        primaryPurpose: 'tool',
        purposeRelevance: 95,
        toolDetails: {
          toolType: 'toolkit',
          targetAudience: ['Educators'],
          implementationContext: ['Classroom']
        },
        themes: [{ id: 'theme1', name: 'Theme 1' }]
      },
      
      // Research items
      {
        id: 'research1',
        title: 'Research Findings',
        description: 'Research findings and analysis',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/research',
        date: '2023-01-04',
        primaryPurpose: 'research',
        purposeRelevance: 92,
        researchDetails: {
          researchType: 'finding',
          methodology: 'Qualitative'
        },
        topics: [{ id: 'topic1', name: 'Topic 1' }]
      },
      
      // Event items
      {
        id: 'event1',
        title: 'Workshop Event',
        description: 'A workshop event',
        contentType: 'event',
        source: 'airtable',
        url: 'https://example.com/event',
        date: '2023-01-05',
        primaryPurpose: 'event',
        purposeRelevance: 88,
        eventDetails: {
          eventType: 'workshop',
          startDate: '2023-02-01',
          endDate: '2023-02-01',
          location: 'New York'
        }
      },
      
      // Update items
      {
        id: 'update1',
        title: 'Newsletter January 2023',
        description: 'January 2023 newsletter',
        contentType: 'newsletter',
        source: 'mailchimp',
        url: 'https://example.com/newsletter',
        date: '2023-01-06',
        primaryPurpose: 'update',
        purposeRelevance: 85,
        updateDetails: {
          updateType: 'newsletter',
          publicationDate: '2023-01-06',
          publisher: 'IMAGI-NATION'
        }
      }
    ];
  });
  
  describe('filterByPurposeOptions', () => {
    it('should filter by primary purpose', () => {
      const options = { primaryPurpose: 'story' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(item => item.primaryPurpose === 'story')).toBe(true);
    });
    
    it('should filter by minimum purpose relevance', () => {
      const options = { minPurposeRelevance: 90 };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered.length).toBe(3);
      expect(filtered.every(item => item.purposeRelevance >= 90)).toBe(true);
    });
    
    it('should filter by theme', () => {
      const options = { theme: 'theme1' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(item => 
        item.themes?.some(theme => theme.id === 'theme1' || theme.name === 'Theme 1')
      )).toBe(true);
    });
    
    it('should filter by topic', () => {
      const options = { topic: 'topic1' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(item => 
        item.topics?.some(topic => topic.id === 'topic1' || topic.name === 'Topic 1')
      )).toBe(true);
    });
    
    it('should sort by date', () => {
      const options = { sortBy: 'date', sortOrder: 'desc' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered[0].id).toBe('update1');
      expect(filtered[filtered.length - 1].id).toBe('story1');
    });
    
    it('should sort by relevance', () => {
      const options = { sortBy: 'relevance', sortOrder: 'desc' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered[0].id).toBe('tool1');
      expect(filtered[0].purposeRelevance).toBe(95);
    });
    
    it('should apply limit and offset', () => {
      const options = { limit: 2, offset: 1, sortBy: 'date', sortOrder: 'asc' };
      const filtered = contentFilter.filterByPurposeOptions(testItems, options);
      
      expect(filtered.length).toBe(2);
      expect(filtered[0].id).toBe('story2');
      expect(filtered[1].id).toBe('tool1');
    });
  });
  
  describe('filterByStoryOptions', () => {
    it('should filter by story type', () => {
      const options: StoryOptions = { 
        primaryPurpose: 'story',
        storyType: 'personal'
      };
      const filtered = contentFilter.filterByStoryOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('story1');
      expect(filtered[0].storyDetails?.storyType).toBe('personal');
    });
    
    it('should filter by protagonists', () => {
      const options: StoryOptions = { 
        primaryPurpose: 'story',
        protagonists: ['Person 1']
      };
      const filtered = contentFilter.filterByStoryOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('story1');
      expect(filtered[0].storyDetails?.protagonists).toContain('Person 1');
    });
  });
  
  describe('filterByToolOptions', () => {
    it('should filter by tool type', () => {
      const options: ToolOptions = { 
        primaryPurpose: 'tool',
        toolType: 'toolkit'
      };
      const filtered = contentFilter.filterByToolOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('tool1');
      expect(filtered[0].toolDetails?.toolType).toBe('toolkit');
    });
    
    it('should filter by audience', () => {
      const options: ToolOptions = { 
        primaryPurpose: 'tool',
        audience: ['Educators']
      };
      const filtered = contentFilter.filterByToolOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('tool1');
      expect(filtered[0].toolDetails?.targetAudience).toContain('Educators');
    });
    
    it('should filter by context', () => {
      const options: ToolOptions = { 
        primaryPurpose: 'tool',
        context: ['Classroom']
      };
      const filtered = contentFilter.filterByToolOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('tool1');
      expect(filtered[0].toolDetails?.implementationContext).toContain('Classroom');
    });
  });
  
  describe('filterByResearchOptions', () => {
    it('should filter by research type', () => {
      const options: ResearchOptions = { 
        primaryPurpose: 'research',
        researchType: 'finding'
      };
      const filtered = contentFilter.filterByResearchOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('research1');
      expect(filtered[0].researchDetails?.researchType).toBe('finding');
    });
    
    it('should filter by methodology', () => {
      const options: ResearchOptions = { 
        primaryPurpose: 'research',
        methodology: 'Qualitative'
      };
      const filtered = contentFilter.filterByResearchOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('research1');
      expect(filtered[0].researchDetails?.methodology).toContain('Qualitative');
    });
  });
  
  describe('filterByEventOptions', () => {
    it('should filter by event type', () => {
      const options: EventOptions = { 
        primaryPurpose: 'event',
        eventType: 'workshop'
      };
      const filtered = contentFilter.filterByEventOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('event1');
      expect(filtered[0].eventDetails?.eventType).toBe('workshop');
    });
    
    it('should filter by date range', () => {
      const options: EventOptions = { 
        primaryPurpose: 'event',
        dateFrom: '2023-01-15',
        dateTo: '2023-02-15'
      };
      const filtered = contentFilter.filterByEventOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('event1');
    });
    
    it('should filter by location', () => {
      const options: EventOptions = { 
        primaryPurpose: 'event',
        location: 'New York'
      };
      const filtered = contentFilter.filterByEventOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('event1');
      expect(filtered[0].eventDetails?.location).toBe('New York');
    });
  });
  
  describe('filterByUpdateOptions', () => {
    it('should filter by update type', () => {
      const options: UpdateOptions = { 
        primaryPurpose: 'update',
        updateType: 'newsletter'
      };
      const filtered = contentFilter.filterByUpdateOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('update1');
      expect(filtered[0].updateDetails?.updateType).toBe('newsletter');
    });
    
    it('should filter by publication date', () => {
      const options: UpdateOptions = { 
        primaryPurpose: 'update',
        publicationDate: '2023-01-06'
      };
      const filtered = contentFilter.filterByUpdateOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('update1');
      expect(filtered[0].updateDetails?.publicationDate).toBe('2023-01-06');
    });
    
    it('should filter by publisher', () => {
      const options: UpdateOptions = { 
        primaryPurpose: 'update',
        publisher: 'IMAGI-NATION'
      };
      const filtered = contentFilter.filterByUpdateOptions(testItems, options);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('update1');
      expect(filtered[0].updateDetails?.publisher).toBe('IMAGI-NATION');
    });
  });
});