# Purpose-Based Content Organization API Reference

This document provides a detailed API reference for developers working with the purpose-based content organization system in the IMAGI-NATION Research Wiki.

## Table of Contents

1. [Models](#models)
2. [Classifiers](#classifiers)
3. [Filters](#filters)
4. [Relationships](#relationships)
5. [Search](#search)
6. [Enhancers](#enhancers)
7. [UI Components](#ui-components)

## Models

### ContentPurpose

```typescript
type ContentPurpose = 
  | 'story'
  | 'tool'
  | 'research'
  | 'event'
  | 'update';
```

### PurposeContentItem

```typescript
type PurposeContentItem = ContentItem & {
  primaryPurpose: ContentPurpose;
  secondaryPurposes?: ContentPurpose[];
  purposeRelevance: number; // 0-100
  
  // Purpose-specific details
  storyDetails?: StoryDetails;
  toolDetails?: ToolDetails;
  researchDetails?: ResearchDetails;
  eventDetails?: EventDetails;
  updateDetails?: UpdateDetails;
  
  // Relationship information
  relatedContent?: PurposeContentItem[];
  relationshipStrength?: number; // 0-100
};
```

### StoryDetails

```typescript
type StoryDetails = {
  storyType: StoryType;
  keyQuotes?: string[];
  keyMoments?: KeyMoment[];
  protagonists?: string[];
  narrative?: string;
};

type StoryType = 
  | 'personal'
  | 'case_study'
  | 'impact'
  | 'journey';

type KeyMoment = {
  title: string;
  description: string;
  timestamp?: string; // For video content
  themes?: Theme[];
};
```

### ToolDetails

```typescript
type ToolDetails = {
  toolType: ToolType;
  usageInstructions?: string;
  targetAudience?: string[];
  implementationContext?: string[];
  prerequisites?: string[];
};

type ToolType = 
  | 'implementation'
  | 'worksheet'
  | 'guide'
  | 'toolkit'
  | 'template';
```

### ResearchDetails

```typescript
type ResearchDetails = {
  researchType: ResearchType;
  keyFindings?: string[];
  methodology?: string;
  dataPoints?: DataPoint[];
  visualizations?: Visualization[];
};

type ResearchType = 
  | 'finding'
  | 'analysis'
  | 'synthesis'
  | 'data'
  | 'report';

type DataPoint = {
  label: string;
  value: number | string;
  unit?: string;
  context?: string;
};

type Visualization = {
  title: string;
  description: string;
  type: 'chart' | 'graph' | 'map' | 'table' | 'image';
  url?: string;
  data?: Record<string, any>;
};
```

### EventDetails

```typescript
type EventDetails = {
  eventType: EventType;
  startDate?: string;
  endDate?: string;
  location?: string;
  registrationUrl?: string;
  materials?: EventMaterial[];
  speakers?: string[];
};

type EventType = 
  | 'workshop'
  | 'webinar'
  | 'training'
  | 'conference'
  | 'meeting';

type EventMaterial = {
  title: string;
  description: string;
  type: 'presentation' | 'document' | 'video' | 'audio' | 'other';
  url: string;
};
```

### UpdateDetails

```typescript
type UpdateDetails = {
  updateType: UpdateType;
  publicationDate?: string;
  publisher?: string;
  callToAction?: string;
  highlights?: string[];
};

type UpdateType = 
  | 'newsletter'
  | 'announcement'
  | 'news'
  | 'release';
```

### PurposeContentOptions

```typescript
type PurposeContentOptions = ContentOptions & {
  primaryPurpose?: ContentPurpose;
  secondaryPurposes?: ContentPurpose[];
  minPurposeRelevance?: number; // 0-100
};
```

### Purpose-Specific Options

```typescript
type StoryOptions = PurposeContentOptions & {
  storyType?: StoryType;
  protagonists?: string[];
};

type ToolOptions = PurposeContentOptions & {
  toolType?: ToolType;
  audience?: string[];
  context?: string[];
};

type ResearchOptions = PurposeContentOptions & {
  researchType?: ResearchType;
  methodology?: string;
};

type EventOptions = PurposeContentOptions & {
  eventType?: EventType;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
};

type UpdateOptions = PurposeContentOptions & {
  updateType?: UpdateType;
  publicationDate?: string;
  publisher?: string;
};
```

## Classifiers

### PurposeClassifier Interface

```typescript
interface PurposeClassifier {
  classifyContent(contentItem: ContentItem): PurposeContentItem;
  getPurposeScore(contentItem: ContentItem, purpose: ContentPurpose): number;
}
```

### DefaultPurposeClassifier

```typescript
class DefaultPurposeClassifier implements PurposeClassifier {
  classifyContent(contentItem: ContentItem): PurposeContentItem;
  getPurposeScore(contentItem: ContentItem, purpose: ContentPurpose): number;
  private calculatePurposeRelevance(contentItem: ContentItem, purpose: ContentPurpose): number;
  private getSecondaryPurposes(contentItem: ContentItem, primaryPurpose: ContentPurpose): ContentPurpose[];
  private getPurposeSpecificDetails(contentItem: ContentItem, purpose: ContentPurpose): any;
}
```

#### Example Usage

```typescript
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier';
import { ContentItem } from '@/lib/content-integration/models/content-item';

// Create a content item
const contentItem: ContentItem = {
  id: '1',
  title: 'Personal Story: My Journey',
  description: 'A personal story about my journey',
  contentType: 'video',
  source: 'youtube',
  url: 'https://youtube.com/watch?v=123',
  date: '2023-01-01'
};

// Create a purpose classifier
const purposeClassifier = new DefaultPurposeClassifier();

// Classify the content item
const classifiedItem = purposeClassifier.classifyContent(contentItem);

console.log(classifiedItem.primaryPurpose); // 'story'
console.log(classifiedItem.purposeRelevance); // 85
```

## Filters

### ContentFilter Interface

```typescript
interface ContentFilter {
  filterByPurposeOptions(
    contentItems: PurposeContentItem[], 
    options: PurposeContentOptions
  ): PurposeContentItem[];
  
  filterByStoryOptions(
    contentItems: PurposeContentItem[],
    options: StoryOptions
  ): PurposeContentItem[];
  
  filterByToolOptions(
    contentItems: PurposeContentItem[],
    options: ToolOptions
  ): PurposeContentItem[];
  
  filterByResearchOptions(
    contentItems: PurposeContentItem[],
    options: ResearchOptions
  ): PurposeContentItem[];
  
  filterByEventOptions(
    contentItems: PurposeContentItem[],
    options: EventOptions
  ): PurposeContentItem[];
  
  filterByUpdateOptions(
    contentItems: PurposeContentItem[],
    options: UpdateOptions
  ): PurposeContentItem[];
}
```

### DefaultContentFilter

```typescript
class DefaultContentFilter implements ContentFilter {
  filterByPurposeOptions(
    contentItems: PurposeContentItem[], 
    options: PurposeContentOptions
  ): PurposeContentItem[];
  
  filterByStoryOptions(
    contentItems: PurposeContentItem[],
    options: StoryOptions
  ): PurposeContentItem[];
  
  filterByToolOptions(
    contentItems: PurposeContentItem[],
    options: ToolOptions
  ): PurposeContentItem[];
  
  filterByResearchOptions(
    contentItems: PurposeContentItem[],
    options: ResearchOptions
  ): PurposeContentItem[];
  
  filterByEventOptions(
    contentItems: PurposeContentItem[],
    options: EventOptions
  ): PurposeContentItem[];
  
  filterByUpdateOptions(
    contentItems: PurposeContentItem[],
    options: UpdateOptions
  ): PurposeContentItem[];
  
  private applyStandardFilters(
    contentItems: PurposeContentItem[], 
    options: PurposeContentOptions
  ): PurposeContentItem[];
}
```

#### Example Usage

```typescript
import { DefaultContentFilter } from '@/lib/content-organization/utils/content-filter';
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content';

// Create a content filter
const contentFilter = new DefaultContentFilter();

// Filter content items by purpose
const filteredItems = contentFilter.filterByPurposeOptions(contentItems, {
  primaryPurpose: 'story',
  theme: 'theme1',
  sortBy: 'date',
  sortOrder: 'desc'
});

// Filter content items by story options
const filteredStories = contentFilter.filterByStoryOptions(contentItems, {
  primaryPurpose: 'story',
  storyType: 'personal'
});
```

## Relationships

### ContentRelationship Interface

```typescript
interface ContentRelationship {
  findRelatedContent(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[],
    options?: RelatedContentOptions
  ): PurposeContentItem[];
}

interface RelatedContentOptions {
  maxItems?: number;
  excludeSamePurpose?: boolean;
  prioritizeSecondaryPurposes?: boolean;
  minRelationshipStrength?: number;
}
```

### DefaultContentRelationship

```typescript
class DefaultContentRelationship implements ContentRelationship {
  findRelatedContent(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[],
    options: RelatedContentOptions = {}
  ): PurposeContentItem[];
  
  private calculateRelationshipStrength(
    item1: PurposeContentItem,
    item2: PurposeContentItem
  ): number;
}
```

#### Example Usage

```typescript
import { DefaultContentRelationship } from '@/lib/content-organization/utils/content-relationship';
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content';

// Create a content relationship utility
const contentRelationship = new DefaultContentRelationship();

// Find related content
const relatedItems = contentRelationship.findRelatedContent(
  contentItem,
  allContentItems,
  {
    maxItems: 5,
    excludeSamePurpose: false,
    prioritizeSecondaryPurposes: true,
    minRelationshipStrength: 20
  }
);
```

## Search

### SearchUtility Interface

```typescript
interface SearchUtility {
  search(options: SearchOptions): Promise<SearchResult[]>;
}

interface SearchOptions {
  query: string;
  purpose?: string;
  theme?: string;
  topic?: string;
  limit?: number;
  sortBy?: 'relevance' | 'date';
  sortOrder?: 'asc' | 'desc';
}

interface SearchResult {
  item: PurposeContentItem;
  score: number;
  matches: {
    field: string;
    text: string;
    positions: number[];
  }[];
}
```

### DefaultSearchUtility

```typescript
class DefaultSearchUtility implements SearchUtility {
  constructor(contentEnhancer: ContentEnhancer = new DefaultContentEnhancer());
  
  async search(options: SearchOptions): Promise<SearchResult[]>;
  
  private performSearch(
    content: PurposeContentItem[], 
    options: SearchOptions
  ): SearchResult[];
  
  private findMatches(text: string, queryTerms: string[]): number[];
  
  private getMatchContext(
    text: string, 
    position: number, 
    contextLength: number
  ): string;
}
```

#### Example Usage

```typescript
import { DefaultSearchUtility } from '@/lib/content-organization/utils/search-utility';

// Create a search utility
const searchUtility = new DefaultSearchUtility();

// Search content
const searchResults = await searchUtility.search({
  query: 'education',
  purpose: 'story',
  theme: 'theme1',
  sortBy: 'relevance',
  sortOrder: 'desc',
  limit: 10
});
```

## Enhancers

### ContentEnhancer Interface

```typescript
interface ContentEnhancer {
  enhanceWithPurpose(contentItem: ContentItem): PurposeContentItem;
  enhanceMultipleWithPurpose(contentItems: ContentItem[]): PurposeContentItem[];
  enhanceWithRelationships(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[]
  ): PurposeContentItem;
  enhanceMultipleWithRelationships(
    contentItems: PurposeContentItem[]
  ): PurposeContentItem[];
}
```

### DefaultContentEnhancer

```typescript
class DefaultContentEnhancer implements ContentEnhancer {
  constructor(
    purposeClassifier: PurposeClassifier,
    contentRelationship: ContentRelationship = new DefaultContentRelationship()
  );
  
  enhanceWithPurpose(contentItem: ContentItem): PurposeContentItem;
  enhanceMultipleWithPurpose(contentItems: ContentItem[]): PurposeContentItem[];
  enhanceWithRelationships(
    contentItem: PurposeContentItem,
    allContent: PurposeContentItem[]
  ): PurposeContentItem;
  enhanceMultipleWithRelationships(
    contentItems: PurposeContentItem[]
  ): PurposeContentItem[];
}
```

#### Example Usage

```typescript
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer';
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier';
import { ContentItem } from '@/lib/content-integration/models/content-item';

// Create a content enhancer
const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());

// Enhance content with purpose
const enhancedItem = contentEnhancer.enhanceWithPurpose(contentItem);

// Enhance multiple content items with purpose
const enhancedItems = contentEnhancer.enhanceMultipleWithPurpose(contentItems);

// Enhance content with relationships
const enhancedWithRelationships = contentEnhancer.enhanceWithRelationships(
  enhancedItem,
  enhancedItems
);
```

## UI Components

### HomePageIntegration

```typescript
function HomePageIntegration(): JSX.Element;
```

The `HomePageIntegration` component displays purpose-organized content on the homepage, including:

- Featured stories
- Latest updates
- Upcoming events
- Featured research
- Featured tools

### RelatedContent

```typescript
type RelatedContentProps = {
  currentItem: PurposeContentItem;
  relatedItems?: PurposeContentItem[];
  maxItems?: number;
  showRelationshipStrength?: boolean;
  className?: string;
};

function RelatedContent(props: RelatedContentProps): JSX.Element;
```

The `RelatedContent` component displays related content across different purposes, with optional relationship strength visualization.

### ContentFilters

```typescript
type ContentFiltersProps = {
  purposeOptions?: FilterOption[];
  themeOptions?: FilterOption[];
  topicOptions?: FilterOption[];
  contentTypeOptions?: FilterOption[];
  sourceOptions?: FilterOption[];
  regionOptions?: FilterOption[];
  dateRangeEnabled?: boolean;
  sortOptions?: FilterOption[];
  initialFilters?: Partial<PurposeContentOptions>;
  onFilterChange?: (filters: Partial<PurposeContentOptions>) => void;
  persistFilters?: boolean;
  className?: string;
};

function ContentFilters(props: ContentFiltersProps): JSX.Element;
```

The `ContentFilters` component provides filtering options for content hubs, with support for purpose-specific filters.

### SearchResults

```typescript
type SearchResultsProps = {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onFilterChange?: (filter: { type: string; value: string }) => void;
  activeFilters?: { [key: string]: string };
};

function SearchResults(props: SearchResultsProps): JSX.Element;
```

The `SearchResults` component displays search results with purpose-based filtering and grouping.