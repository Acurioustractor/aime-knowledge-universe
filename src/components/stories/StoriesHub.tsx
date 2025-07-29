"use client"

import { useState, useEffect } from 'react'
import { PurposeContentItem, StoryType } from '@/lib/content-organization/models/purpose-content'
import StoryGrid from './StoryGrid'
import StoryFilters from './StoryFilters'

type StoriesHubProps = {
  initialStories?: PurposeContentItem[];
  title?: string;
  description?: string;
  showFilters?: boolean;
}

export default function StoriesHub({ 
  initialStories = [], 
  title = "Stories & Narratives",
  description = "Explore personal journeys, case studies, and impact stories from across all content sources.",
  showFilters = true
}: StoriesHubProps) {
  const [stories, setStories] = useState<PurposeContentItem[]>(initialStories);
  const [filters, setFilters] = useState<{
    storyType?: StoryType;
    theme?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(initialStories.length === 0);
  
  // Get unique story types from stories
  const storyTypes = Array.from(
    new Set(
      stories
        .filter(story => story.storyDetails?.storyType)
        .map(story => story.storyDetails!.storyType!)
    )
  ).map(type => ({
    id: type,
    name: getStoryTypeLabel(type)
  }));
  
  // Get unique themes from stories
  const themes = Array.from(
    new Set(
      stories.flatMap(story => 
        story.themes?.map(theme => ({ id: theme.id, name: theme.name })) || []
      ).map(theme => JSON.stringify(theme))
    )
  ).map(theme => JSON.parse(theme));
  
  // Get unique regions from stories
  const regions = Array.from(
    new Set(
      stories.flatMap(story => 
        story.regions?.map(region => ({ id: region.id, name: region.name })) || []
      ).map(region => JSON.stringify(region))
    )
  ).map(region => JSON.parse(region));
  
  // Fetch stories if none are provided
  useEffect(() => {
    if (initialStories.length === 0) {
      fetchStories();
    }
  }, [initialStories]);
  
  // Fetch stories from API
  const fetchStories = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would fetch stories from the API
      // For now, use mock data
      const mockStories = getMockStories();
      
      setStories(mockStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: {
    storyType?: StoryType;
    theme?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    setFilters(newFilters);
  };
  
  // Get story type label
  function getStoryTypeLabel(type: StoryType): string {
    switch (type) {
      case 'personal':
        return 'Personal Story';
      case 'case_study':
        return 'Case Study';
      case 'impact':
        return 'Impact Story';
      case 'journey':
        return 'Journey';
      default:
        return 'Story';
    }
  }
  
  // Mock stories for testing
  function getMockStories(): PurposeContentItem[] {
    return [
      {
        id: 'story1',
        title: 'Personal Story: My Journey in Education',
        description: 'A personal story about my journey in education and how it transformed my perspective on learning.',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=123',
        date: '2023-01-01',
        tags: ['story', 'personal', 'journey', 'education'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 90 }],
        topics: [{ id: 'topic1', name: 'Personal Growth', keywords: ['growth'] }],
        authors: ['Author 1'],
        thumbnail: '/assets/images/School - Day 4-16.jpg',
        primaryPurpose: 'story',
        purposeRelevance: 90,
        storyDetails: {
          storyType: 'personal'
        }
      },
      {
        id: 'story2',
        title: 'Impact Story: Education in Rural Communities',
        description: 'A story about the impact of education initiatives in rural communities and how they are changing lives.',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=456',
        date: '2023-01-20',
        tags: ['story', 'impact', 'education', 'rural'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
        topics: [{ id: 'topic5', name: 'Rural Education', keywords: ['rural'] }],
        authors: ['Author 6'],
        thumbnail: '/assets/images/School - Day 4-20.jpg',
        primaryPurpose: 'story',
        purposeRelevance: 85,
        storyDetails: {
          storyType: 'impact'
        },
        regions: [{ id: 'region1', name: 'Rural', type: 'country' }]
      },
      {
        id: 'story3',
        title: 'Case Study: Innovative Learning Approaches',
        description: 'A case study examining innovative approaches to learning and their outcomes in different contexts.',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/case-study',
        date: '2023-01-15',
        tags: ['story', 'case study', 'education', 'innovation'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 80 }, { id: 'theme2', name: 'Innovation', relevance: 85 }],
        topics: [{ id: 'topic6', name: 'Learning Innovation', keywords: ['innovation'] }],
        authors: ['Author 7'],
        thumbnail: '/assets/images/School - Day 4-44.jpg',
        primaryPurpose: 'story',
        purposeRelevance: 80,
        storyDetails: {
          storyType: 'case_study'
        }
      }
    ];
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="md:w-64 flex-shrink-0">
            <StoryFilters
              storyTypes={storyTypes}
              themes={themes}
              regions={regions}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>
        )}
        
        {/* Stories grid */}
        <div className="flex-grow">
          <StoryGrid stories={stories} filters={filters} />
        </div>
      </div>
    </div>
  );
}