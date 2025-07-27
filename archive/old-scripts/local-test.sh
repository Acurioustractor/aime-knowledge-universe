#!/bin/bash

# Local test script for content organization features
# This script tests that the content organization features are working correctly

echo "Testing content organization features..."

# Test the purpose classifier
echo "Testing purpose classifier..."
node -e "
const { DefaultPurposeClassifier } = require('./src/lib/content-organization/classifiers/purpose-classifier');
const classifier = new DefaultPurposeClassifier();

// Test content item
const contentItem = {
  id: 'test-item',
  title: 'Test Story',
  description: 'This is a test story',
  contentType: 'video',
  source: 'youtube',
  tags: ['story', 'test'],
  themes: [{ id: 'theme1', name: 'Education' }]
};

// Classify the content item
const classifiedItem = classifier.classifyContent(contentItem);
console.log('Classified item:', JSON.stringify(classifiedItem, null, 2));

// Check that the classification is correct
if (classifiedItem.primaryPurpose === 'story') {
  console.log('✅ Purpose classifier is working correctly');
} else {
  console.log('❌ Purpose classifier is not working correctly');
  process.exit(1);
}
"

# Test the content filter
echo "Testing content filter..."
node -e "
const { DefaultContentFilter } = require('./src/lib/content-organization/utils/content-filter');
const filter = new DefaultContentFilter();

// Test content items
const contentItems = [
  {
    id: 'story1',
    title: 'Story 1',
    primaryPurpose: 'story',
    themes: [{ id: 'theme1', name: 'Education' }]
  },
  {
    id: 'research1',
    title: 'Research 1',
    primaryPurpose: 'research',
    themes: [{ id: 'theme1', name: 'Education' }]
  },
  {
    id: 'tool1',
    title: 'Tool 1',
    primaryPurpose: 'tool',
    themes: [{ id: 'theme2', name: 'Innovation' }]
  }
];

// Filter by purpose
const storyItems = filter.filterByPurposeOptions(contentItems, { primaryPurpose: 'story' });
console.log('Story items:', storyItems.map(item => item.id));

// Filter by theme
const educationItems = filter.filterByPurposeOptions(contentItems, { theme: 'theme1' });
console.log('Education items:', educationItems.map(item => item.id));

// Check that the filtering is correct
if (storyItems.length === 1 && storyItems[0].id === 'story1' &&
    educationItems.length === 2 && educationItems.some(item => item.id === 'story1') && educationItems.some(item => item.id === 'research1')) {
  console.log('✅ Content filter is working correctly');
} else {
  console.log('❌ Content filter is not working correctly');
  process.exit(1);
}
"

# Test the feature flags
echo "Testing feature flags..."
node -e "
const { getFeatureFlags } = require('./src/lib/content-organization/feature-flags');

// Get the feature flags
const flags = getFeatureFlags();
console.log('Feature flags:', flags);

// Check that the feature flags are enabled
const allEnabled = Object.values(flags).every(flag => flag === true);
if (allEnabled) {
  console.log('✅ Feature flags are all enabled');
} else {
  console.log('❌ Some feature flags are not enabled');
  process.exit(1);
}
"

echo "All tests passed! The content organization features are working correctly."