/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DefaultSearchUtility } from '../utils/search-utility';
import { DefaultPurposeClassifier } from '../classifiers/purpose-classifier';
import { DefaultContentEnhancer } from '../utils/content-enhancer';
import { ContentItem } from '../../content-integration/models/content-item';
import SearchResults from '@/components/search/SearchResults';

// Mock the integrations module
jest.mock('@/lib/integrations', () => ({
  getAllContent: jest.fn().mockResolvedValue([
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
    }
  ])
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn()
  }),
  usePathname: jest.fn().mockReturnValue('/search'),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation(param => {
      if (param === 'q') return 'test';
      return null;
    }),
    has: jest.fn().mockReturnValue(false)
  })
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, fill, style, className }: { src: string, alt: string, fill?: boolean, style?: any, className?: string }) => {
    return <img src={src} alt={alt} className={className} style={style} />;
  };
});

describe('Search Integration Tests', () => {
  let searchUtility: DefaultSearchUtility;
  let contentEnhancer: DefaultContentEnhancer;
  
  beforeEach(() => {
    // Create instances of the components
    contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
    searchUtility = new DefaultSearchUtility(contentEnhancer);
  });
  
  describe('Search Utility Integration', () => {
    it('should search content and return results', async () => {
      // Perform search
      const searchResults = await searchUtility.search({
        query: 'story',
        limit: 10
      });
      
      // Assertions
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].item.primaryPurpose).toBeDefined();
      expect(searchResults[0].score).toBeGreaterThan(0);
      expect(searchResults[0].matches.length).toBeGreaterThan(0);
    });
    
    it('should filter search results by purpose', async () => {
      // Perform search with purpose filter
      const searchResults = await searchUtility.search({
        query: 'story',
        purpose: 'story',
        limit: 10
      });
      
      // Assertions
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.every(result => 
        result.item.primaryPurpose === 'story' || 
        result.item.secondaryPurposes?.includes('story')
      )).toBe(true);
    });
    
    it('should sort search results by relevance', async () => {
      // Perform search with relevance sorting
      const searchResults = await searchUtility.search({
        query: 'story',
        sortBy: 'relevance',
        sortOrder: 'desc',
        limit: 10
      });
      
      // Assertions
      expect(searchResults.length).toBeGreaterThan(0);
      
      // Check that results are sorted by score
      for (let i = 0; i < searchResults.length - 1; i++) {
        expect(searchResults[i].score).toBeGreaterThanOrEqual(searchResults[i + 1].score);
      }
    });
    
    it('should sort search results by date', async () => {
      // Perform search with date sorting
      const searchResults = await searchUtility.search({
        query: 'story',
        sortBy: 'date',
        sortOrder: 'desc',
        limit: 10
      });
      
      // Assertions
      expect(searchResults.length).toBeGreaterThan(0);
      
      // Check that results are sorted by date
      for (let i = 0; i < searchResults.length - 1; i++) {
        const dateA = searchResults[i].item.date ? new Date(searchResults[i].item.date).getTime() : 0;
        const dateB = searchResults[i + 1].item.date ? new Date(searchResults[i + 1].item.date).getTime() : 0;
        expect(dateA).toBeGreaterThanOrEqual(dateB);
      }
    });
  });
  
  describe('Search UI Integration', () => {
    it('should render search results', async () => {
      // Perform search
      const searchResults = await searchUtility.search({
        query: 'story',
        limit: 10
      });
      
      // Render search results component
      render(
        <SearchResults
          results={searchResults}
          isLoading={false}
          query="story"
          onFilterChange={() => {}}
          activeFilters={{}}
        />
      );
      
      // Assertions
      expect(screen.getByText(/Found \d+ results for "story"/)).toBeInTheDocument();
      
      // Check that results are rendered
      for (const result of searchResults) {
        expect(screen.getByText(result.item.title)).toBeInTheDocument();
      }
    });
    
    it('should render loading state', () => {
      // Render search results component in loading state
      render(
        <SearchResults
          results={[]}
          isLoading={true}
          query="story"
          onFilterChange={() => {}}
          activeFilters={{}}
        />
      );
      
      // Assertions
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
    
    it('should render empty state', () => {
      // Render search results component with no results
      render(
        <SearchResults
          results={[]}
          isLoading={false}
          query="nonexistent"
          onFilterChange={() => {}}
          activeFilters={{}}
        />
      );
      
      // Assertions
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
      expect(screen.getByText(/We couldn't find any matches for "nonexistent"/)).toBeInTheDocument();
    });
    
    it('should handle filter changes', async () => {
      // Perform search
      const searchResults = await searchUtility.search({
        query: 'story',
        limit: 10
      });
      
      // Mock filter change handler
      const handleFilterChange = jest.fn();
      
      // Render search results component
      render(
        <SearchResults
          results={searchResults}
          isLoading={false}
          query="story"
          onFilterChange={handleFilterChange}
          activeFilters={{}}
        />
      );
      
      // Find and click a filter button (if available)
      const filterButtons = screen.queryAllByRole('button');
      if (filterButtons.length > 0) {
        fireEvent.click(filterButtons[0]);
        expect(handleFilterChange).toHaveBeenCalled();
      }
    });
  });
});