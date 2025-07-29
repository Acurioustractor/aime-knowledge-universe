import { DefaultPurposeClassifier } from '../purpose-classifier';
import { ContentItem } from '../../../content-integration/models/content-item';
import { ContentPurpose } from '../../models/purpose-content';

describe('DefaultPurposeClassifier', () => {
  let classifier: DefaultPurposeClassifier;
  
  beforeEach(() => {
    classifier = new DefaultPurposeClassifier();
  });
  
  describe('classifyContent', () => {
    it('should classify content based on content type', () => {
      // Create test content items with different content types
      const videoContent: ContentItem = {
        id: '1',
        title: 'Test Video',
        description: 'A test video',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=123',
        date: '2023-01-01'
      };
      
      const documentContent: ContentItem = {
        id: '2',
        title: 'Research Report',
        description: 'A research report',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/document',
        date: '2023-01-02'
      };
      
      const eventContent: ContentItem = {
        id: '3',
        title: 'Workshop Event',
        description: 'A workshop event',
        contentType: 'event',
        source: 'airtable',
        url: 'https://example.com/event',
        date: '2023-01-03'
      };
      
      // Classify content
      const classifiedVideo = classifier.classifyContent(videoContent);
      const classifiedDocument = classifier.classifyContent(documentContent);
      const classifiedEvent = classifier.classifyContent(eventContent);
      
      // Assertions
      expect(classifiedVideo.primaryPurpose).toBe('story');
      expect(classifiedDocument.primaryPurpose).toBe('research');
      expect(classifiedEvent.primaryPurpose).toBe('event');
    });
    
    it('should classify content based on title keywords', () => {
      // Create test content items with different title keywords
      const storyContent: ContentItem = {
        id: '1',
        title: 'Personal Story: My Journey',
        description: 'A personal story',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/story',
        date: '2023-01-01'
      };
      
      const researchContent: ContentItem = {
        id: '2',
        title: 'Research Findings: Analysis of Data',
        description: 'Research findings',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/research',
        date: '2023-01-02'
      };
      
      const toolContent: ContentItem = {
        id: '3',
        title: 'Implementation Toolkit',
        description: 'A toolkit for implementation',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/toolkit',
        date: '2023-01-03'
      };
      
      // Classify content
      const classifiedStory = classifier.classifyContent(storyContent);
      const classifiedResearch = classifier.classifyContent(researchContent);
      const classifiedTool = classifier.classifyContent(toolContent);
      
      // Assertions
      expect(classifiedStory.primaryPurpose).toBe('story');
      expect(classifiedResearch.primaryPurpose).toBe('research');
      expect(classifiedTool.primaryPurpose).toBe('tool');
    });
    
    it('should assign secondary purposes based on content characteristics', () => {
      // Create test content item with multiple purpose characteristics
      const mixedContent: ContentItem = {
        id: '1',
        title: 'Workshop Report: Implementation Findings',
        description: 'A workshop report with implementation findings',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/workshop-report',
        date: '2023-01-01',
        tags: ['workshop', 'implementation', 'findings']
      };
      
      // Classify content
      const classified = classifier.classifyContent(mixedContent);
      
      // Assertions
      expect(classified.primaryPurpose).toBeDefined();
      expect(classified.secondaryPurposes).toBeDefined();
      expect(classified.secondaryPurposes!.length).toBeGreaterThan(0);
    });
    
    it('should calculate purpose relevance scores', () => {
      // Create test content items
      const highRelevanceContent: ContentItem = {
        id: '1',
        title: 'Personal Story: My Journey',
        description: 'A detailed personal story about my journey',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=123',
        date: '2023-01-01',
        tags: ['story', 'personal', 'journey']
      };
      
      const lowRelevanceContent: ContentItem = {
        id: '2',
        title: 'Mixed Content',
        description: 'Content with mixed purposes',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/mixed',
        date: '2023-01-02'
      };
      
      // Classify content
      const classifiedHigh = classifier.classifyContent(highRelevanceContent);
      const classifiedLow = classifier.classifyContent(lowRelevanceContent);
      
      // Assertions
      expect(classifiedHigh.purposeRelevance).toBeGreaterThan(50);
      expect(classifiedLow.purposeRelevance).toBeLessThan(classifiedHigh.purposeRelevance);
    });
    
    it('should preserve all original content item properties', () => {
      // Create test content item with various properties
      const originalContent: ContentItem = {
        id: '1',
        title: 'Test Content',
        description: 'A test content item',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/test',
        date: '2023-01-01',
        tags: ['test', 'content'],
        authors: ['Test Author'],
        thumbnail: 'https://example.com/thumbnail.jpg',
        content: '<p>Test content</p>',
        themes: [{ id: 'theme1', name: 'Theme 1' }],
        topics: [{ id: 'topic1', name: 'Topic 1' }],
        regions: [{ id: 'region1', name: 'Region 1' }],
        participantTypes: [{ id: 'participant1', name: 'Participant 1' }]
      };
      
      // Classify content
      const classified = classifier.classifyContent(originalContent);
      
      // Assertions
      expect(classified.id).toBe(originalContent.id);
      expect(classified.title).toBe(originalContent.title);
      expect(classified.description).toBe(originalContent.description);
      expect(classified.contentType).toBe(originalContent.contentType);
      expect(classified.source).toBe(originalContent.source);
      expect(classified.url).toBe(originalContent.url);
      expect(classified.date).toBe(originalContent.date);
      expect(classified.tags).toEqual(originalContent.tags);
      expect(classified.authors).toEqual(originalContent.authors);
      expect(classified.thumbnail).toBe(originalContent.thumbnail);
      expect(classified.content).toBe(originalContent.content);
      expect(classified.themes).toEqual(originalContent.themes);
      expect(classified.topics).toEqual(originalContent.topics);
      expect(classified.regions).toEqual(originalContent.regions);
      expect(classified.participantTypes).toEqual(originalContent.participantTypes);
    });
  });
  
  describe('getPurposeScore', () => {
    it('should calculate purpose scores based on content characteristics', () => {
      // Create test content item
      const content: ContentItem = {
        id: '1',
        title: 'Test Content',
        description: 'A test content item',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/test',
        date: '2023-01-01'
      };
      
      // Calculate scores for different purposes
      const storyScore = classifier.getPurposeScore(content, 'story');
      const researchScore = classifier.getPurposeScore(content, 'research');
      const eventScore = classifier.getPurposeScore(content, 'event');
      const updateScore = classifier.getPurposeScore(content, 'update');
      const toolScore = classifier.getPurposeScore(content, 'tool');
      
      // Assertions
      expect(storyScore).toBeGreaterThanOrEqual(0);
      expect(researchScore).toBeGreaterThanOrEqual(0);
      expect(eventScore).toBeGreaterThanOrEqual(0);
      expect(updateScore).toBeGreaterThanOrEqual(0);
      expect(toolScore).toBeGreaterThanOrEqual(0);
    });
    
    it('should give higher scores for content with matching keywords', () => {
      // Create test content items with different keywords
      const storyContent: ContentItem = {
        id: '1',
        title: 'Personal Story',
        description: 'A personal story about a journey',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/story',
        date: '2023-01-01',
        tags: ['story', 'personal']
      };
      
      const researchContent: ContentItem = {
        id: '2',
        title: 'Research Findings',
        description: 'Research findings and analysis',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/research',
        date: '2023-01-02',
        tags: ['research', 'findings', 'analysis']
      };
      
      // Calculate scores
      const storyScoreForStory = classifier.getPurposeScore(storyContent, 'story');
      const researchScoreForStory = classifier.getPurposeScore(storyContent, 'research');
      const storyScoreForResearch = classifier.getPurposeScore(researchContent, 'story');
      const researchScoreForResearch = classifier.getPurposeScore(researchContent, 'research');
      
      // Assertions
      expect(storyScoreForStory).toBeGreaterThan(researchScoreForStory);
      expect(researchScoreForResearch).toBeGreaterThan(storyScoreForResearch);
    });
  });
});