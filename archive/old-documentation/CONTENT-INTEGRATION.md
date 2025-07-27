# AIME Content Integration System

This document explains how the content integration system works and how to use it to display content from various sources throughout the site.

## Overview

The content integration system provides a unified way to access and display content from multiple sources:

- **YouTube videos** from the IMAGI-NATION {TV} channel
- **Mailchimp newsletters** from your email campaigns
- **Airtable resources** including toolkits, events, and other structured data
- **GitHub repositories** including documents and other files from:
  - aime-knowledge-hub
  - aime-artifacts
  - AIMEdashboards

All content is normalized into a consistent format, making it easy to display and search across all sources.

## How It Works

### 1. Integration Services

The integration services are located in `src/lib/integrations/` and include:

- `youtube.ts` - Fetches videos from YouTube
- `mailchimp.ts` - Fetches newsletters from Mailchimp
- `airtable.ts` - Fetches resources from Airtable
- `github.ts` - Fetches content from GitHub repositories
- `index.ts` - Provides unified access to all sources

### 2. Content Format

All content is normalized into a consistent `ContentItem` format:

```typescript
type ContentItem = {
  id: string;
  title: string;
  description: string;
  type: ContentType; // 'video' | 'newsletter' | 'resource' | 'document' | 'toolkit' | 'event'
  source: ContentSource; // 'youtube' | 'mailchimp' | 'airtable' | 'github'
  url: string;
  thumbnail?: string;
  date?: string;
  tags?: string[];
  categories?: string[];
  metadata?: Record<string, any>;
};
```

### 3. Display Components

The system includes several components for displaying content:

- `ContentCard.tsx` - Displays a single content item in various formats
- `ContentGrid.tsx` - Displays a grid of content items with filtering
- `FeaturedContent.tsx` - Displays featured content from any source
- `UnifiedSearch.tsx` - Provides search across all content sources

## Using the Integration System

### Fetching Content

To fetch content from all sources:

```typescript
import { fetchAllContent } from '@/lib/integrations';

// Fetch all content
const allContent = await fetchAllContent();

// Fetch content with options
const options = { 
  limit: 10, 
  query: 'imagination',
  category: 'education'
};
const filteredContent = await fetchAllContent(options);
```

To fetch content from a specific source:

```typescript
import { fetchYouTubeVideos, fetchMailchimpCampaigns } from '@/lib/integrations';

// Fetch videos
const videos = await fetchYouTubeVideos({ limit: 5 });

// Fetch newsletters
const newsletters = await fetchMailchimpCampaigns({ limit: 3 });
```

### Searching Content

To search across all content sources:

```typescript
import { searchAllContent } from '@/lib/integrations';

// Search all content
const results = await searchAllContent('imagination');
```

### Displaying Content

To display content using the provided components:

```tsx
import { ContentGrid } from '@/components/ContentGrid';
import { FeaturedContent } from '@/components/FeaturedContent';

// Display a grid of content
<ContentGrid 
  items={content}
  columns={3}
  variant="default"
  showFilters={true}
/>

// Display featured content
<FeaturedContent 
  title="Featured Videos"
  type="video"
  limit={3}
  viewAllLink="/content/videos"
/>
```

## Production Setup

In the current implementation, the integration services use mock data for development. In a production environment, you would need to:

1. Update the integration services to use real API endpoints
2. Configure the necessary API keys in your environment variables
3. Implement proper error handling and caching

### API Keys Required

- `YOUTUBE_API_KEY` - For accessing the YouTube Data API
- `YOUTUBE_CHANNEL_ID` - Your YouTube channel ID
- `MAILCHIMP_API_KEY` - For accessing the Mailchimp API
- `MAILCHIMP_SERVER_PREFIX` - Your Mailchimp server prefix (e.g., 'us12')
- `AIRTABLE_API_KEY` - For accessing the Airtable API
- `AIRTABLE_BASE_ID` - Your Airtable base ID
- `GITHUB_TOKEN` - For accessing private GitHub repositories (optional)

## Extending the System

To add a new content source:

1. Create a new integration service in `src/lib/integrations/`
2. Update the `ContentSource` type in `index.ts`
3. Add the new source to the `fetchAllContent` function
4. Update the content display components as needed

## Best Practices

1. **Use Content Types** - Always specify the appropriate content type for each item
2. **Consistent Metadata** - Use consistent metadata fields across all content sources
3. **Error Handling** - Implement proper error handling for API calls
4. **Caching** - Consider implementing caching for frequently accessed content
5. **Pagination** - Implement pagination for large content collections

## Example: Adding Content to a Page

Here's an example of how to add content from multiple sources to a page:

```tsx
"use client"

import { useState, useEffect } from 'react'
import { fetchAllContent } from '@/lib/integrations'
import ContentGrid from '@/components/ContentGrid'

export default function MyPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const allContent = await fetchAllContent({ 
          category: 'education',
          limit: 12
        });
        setContent(allContent);
        setLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Education Resources</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <ContentGrid 
          items={content}
          columns={3}
          showFilters={true}
        />
      )}
    </div>
  );
}
```

This system provides a flexible and consistent way to integrate and display content from all your sources, creating a unified experience for users exploring your knowledge base.