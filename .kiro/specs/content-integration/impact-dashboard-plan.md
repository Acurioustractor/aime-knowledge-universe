# Impact Dashboard Integration Plan

## Overview

The Impact Dashboard integration will present data and visualizations from the AIMEdashboards repository in a context-rich, story-focused way. Rather than simply displaying raw data, the system will connect impact metrics to the stories, videos, and resources that provide context and meaning. This document outlines the detailed implementation plan for the Impact Dashboard integration.

## Page Structure

The Impact Dashboard page will have the following structure:

1. **Header Section**
   - Title and description
   - Time period selector
   - View toggles (overview, detailed, story)

2. **Impact Overview**
   - Key metrics and highlights
   - Trend visualizations
   - Geographic impact map

3. **Impact Stories**
   - Data-driven stories about impact
   - Connections to videos and resources
   - Personal testimonials

4. **Impact Details**
   - Detailed metrics and visualizations
   - Comparative analysis
   - Downloadable reports

5. **Implementation Insights**
   - Lessons learned
   - Success factors
   - Replication guidelines

## Implementation Steps

### 1. Create Base Page Structure

- Set up the Impact Dashboard page component
- Implement responsive layout with different view options
- Create navigation and filtering controls

### 2. Implement Dashboard Extractor

- Create GitHub content extractor for dashboard configurations
- Implement data extraction from dashboard files
- Create visualization configuration parser

### 3. Implement Impact Overview

- Create key metrics component
- Implement trend visualization components
- Create geographic impact map

### 4. Implement Impact Stories

- Create story card components
- Implement connections to videos and resources
- Create testimonial components

### 5. Implement Impact Details

- Create detailed metrics components
- Implement comparative analysis visualizations
- Create downloadable report generator

### 6. Implement Implementation Insights

- Create lessons learned component
- Implement success factors visualization
- Create replication guidelines component

## Data Flow

1. System extracts dashboard configurations and data from the AIMEdashboards repository
2. Data is processed and connected to related content
3. User navigates to the Impact Dashboard and selects a view
4. System displays impact metrics and visualizations
5. User can filter and explore impact data
6. User can select a metric or visualization to view details
7. System suggests related stories, videos, and resources

## UI Components

### Impact Overview

```tsx
<ImpactOverview
  metrics={keyMetrics}
  trends={trendData}
  geographicData={geoData}
  timePeriod={selectedTimePeriod}
  onMetricSelect={handleMetricSelect}
/>
```

### Impact Stories

```tsx
<ImpactStories
  stories={impactStories}
  relatedContent={relatedContent}
  onStorySelect={handleStorySelect}
  onRelatedContentSelect={handleRelatedContentSelect}
/>
```

### Impact Details

```tsx
<ImpactDetails
  metrics={detailedMetrics}
  comparisons={comparisonData}
  selectedMetric={selectedMetric}
  onDownloadReport={handleDownloadReport}
/>
```

### Implementation Insights

```tsx
<ImplementationInsights
  lessons={lessonsLearned}
  successFactors={successFactors}
  guidelines={replicationGuidelines}
  onInsightSelect={handleInsightSelect}
/>
```

## Mock Data Structure

During development, we'll use mock data that represents the processed content from the AIMEdashboards repository:

```typescript
const mockKeyMetrics = [
  {
    id: 'students-reached',
    name: 'Students Reached',
    value: 25000,
    previousValue: 18000,
    change: 38.9,
    trend: 'up',
    unit: 'students',
    description: 'Total number of students reached through AIME programs'
  },
  {
    id: 'schools-participating',
    name: 'Schools Participating',
    value: 500,
    previousValue: 350,
    change: 42.9,
    trend: 'up',
    unit: 'schools',
    description: 'Number of schools participating in AIME programs'
  },
  // More metrics...
];

const mockImpactStories = [
  {
    id: 'imagination-lab-success',
    title: 'Imagination Lab Success Story',
    description: 'How the implementation of imagination labs transformed a school in Kenya',
    metrics: ['students-reached', 'imagination-index'],
    relatedContent: [
      { id: 'video-1', type: 'video', title: 'Schools as Imagination Labs' },
      { id: 'toolkit-1', type: 'toolkit', title: 'Imagination Lab Toolkit' }
    ],
    testimonials: [
      {
        quote: 'The imagination lab has completely transformed how our students engage with learning',
        author: 'School Principal, Kenya',
        role: 'Educator'
      }
    ]
  },
  // More stories...
];

const mockDetailedMetrics = [
  {
    id: 'imagination-index',
    name: 'Imagination Index',
    description: 'A composite measure of imagination capacity based on multiple indicators',
    data: [
      { period: '2020-Q1', value: 65 },
      { period: '2020-Q2', value: 68 },
      { period: '2020-Q3', value: 72 },
      { period: '2020-Q4', value: 75 },
      { period: '2021-Q1', value: 78 },
      { period: '2021-Q2', value: 82 },
      { period: '2021-Q3', value: 85 },
      { period: '2021-Q4', value: 89 }
    ],
    breakdowns: [
      { name: 'Creative Confidence', value: 85 },
      { name: 'Ideation Capacity', value: 92 },
      { name: 'Implementation Ability', value: 78 }
    ]
  },
  // More detailed metrics...
];
```

## Next Steps

1. Create the base page structure and layout
2. Implement the dashboard extractor
3. Create the impact overview components
4. Implement the impact stories section
5. Create the impact details components
6. Implement the implementation insights section
7. Connect impact data to related content