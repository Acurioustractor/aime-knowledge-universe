/**
 * Test Purpose Classifier
 * 
 * This file provides a simple way to test the purpose classifier with sample content.
 * It can be run directly with Node.js to see the classification results.
 */

import { ContentItem } from '../content-integration/models/content-item';
import { DefaultPurposeClassifier } from './classifiers/purpose-classifier';
import { PurposeContentItem } from './models/purpose-content';

// Create a purpose classifier
const purposeClassifier = new DefaultPurposeClassifier();

// Sample content items for testing
const sampleContentItems: ContentItem[] = [
  // Story content item
  {
    id: 'story1',
    title: 'Personal Story: My Journey in Education',
    description: 'A personal story about my journey in education',
    contentType: 'video',
    source: 'youtube',
    url: 'https://youtube.com/watch?v=123',
    date: '2023-01-01',
    tags: ['story', 'personal', 'journey', 'education'],
    themes: [{ id: 'theme1', name: 'Education' }],
    topics: [{ id: 'topic1', name: 'Personal Growth' }],
    authors: ['Author 1']
  },
  
  // Research content item
  {
    id: 'research1',
    title: 'Research Findings: Education Impact',
    description: 'Research findings about education impact',
    contentType: 'document',
    source: 'airtable',
    url: 'https://example.com/research',
    date: '2023-01-02',
    tags: ['research', 'education', 'impact'],
    themes: [{ id: 'theme1', name: 'Education' }],
    topics: [{ id: 'topic2', name: 'Impact Assessment' }],
    authors: ['Author 2']
  },
  
  // Tool content item
  {
    id: 'tool1',
    title: 'Implementation Toolkit: Education',
    description: 'A toolkit for education implementation',
    contentType: 'document',
    source: 'airtable',
    url: 'https://example.com/toolkit',
    date: '2023-01-10',
    tags: ['tool', 'toolkit', 'education', 'implementation'],
    themes: [{ id: 'theme1', name: 'Education' }],
    topics: [{ id: 'topic4', name: 'Implementation' }],
    authors: ['Author 5']
  },
  
  // Event content item
  {
    id: 'event1',
    title: 'Workshop: Education Innovation',
    description: 'A workshop about education innovation',
    contentType: 'event',
    source: 'airtable',
    url: 'https://example.com/event',
    date: '2023-02-01',
    tags: ['event', 'workshop', 'education', 'innovation'],
    themes: [{ id: 'theme1', name: 'Education' }, { id: 'theme2', name: 'Innovation' }],
    topics: [{ id: 'topic3', name: 'Education Innovation' }],
    authors: ['Author 3']
  },
  
  // Update content item
  {
    id: 'update1',
    title: 'Newsletter: January 2023',
    description: 'January 2023 newsletter',
    contentType: 'newsletter',
    source: 'mailchimp',
    url: 'https://example.com/newsletter',
    date: '2023-01-15',
    tags: ['update', 'newsletter'],
    themes: [{ id: 'theme3', name: 'Community' }],
    authors: ['Author 4']
  },
  
  // Ambiguous content item (could be story or research)
  {
    id: 'ambiguous1',
    title: 'Education Journey: Research and Personal Experience',
    description: 'A combination of research findings and personal experience in education',
    contentType: 'document',
    source: 'airtable',
    url: 'https://example.com/ambiguous',
    date: '2023-01-20',
    tags: ['education', 'journey', 'research', 'experience'],
    themes: [{ id: 'theme1', name: 'Education' }],
    topics: [{ id: 'topic1', name: 'Personal Growth' }, { id: 'topic2', name: 'Impact Assessment' }],
    authors: ['Author 6']
  }
];

// Classify each content item
const classifiedItems: PurposeContentItem[] = sampleContentItems.map(item => 
  purposeClassifier.classifyContent(item)
);

// Print the classification results
console.log('Content Purpose Classification Results:');
console.log('======================================');
console.log();

classifiedItems.forEach(item => {
  console.log(`Content Item: ${item.title}`);
  console.log(`Primary Purpose: ${item.primaryPurpose}`);
  console.log(`Purpose Relevance: ${item.purposeRelevance}`);
  console.log(`Secondary Purposes: ${item.secondaryPurposes?.join(', ') || 'None'}`);
  
  // Print purpose-specific details
  if (item.primaryPurpose === 'story' && item.storyDetails) {
    console.log(`Story Type: ${item.storyDetails.storyType}`);
  } else if (item.primaryPurpose === 'research' && item.researchDetails) {
    console.log(`Research Type: ${item.researchDetails.researchType}`);
  } else if (item.primaryPurpose === 'tool' && item.toolDetails) {
    console.log(`Tool Type: ${item.toolDetails.toolType}`);
  } else if (item.primaryPurpose === 'event' && item.eventDetails) {
    console.log(`Event Type: ${item.eventDetails.eventType}`);
  } else if (item.primaryPurpose === 'update' && item.updateDetails) {
    console.log(`Update Type: ${item.updateDetails.updateType}`);
  }
  
  console.log();
});

// Export the classifier and sample content for use in other files
export { purposeClassifier, sampleContentItems, classifiedItems };