"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, StoryType } from '@/lib/content-organization/models/purpose-content'

type StoryGridProps = {
  stories: PurposeContentItem[];
  filters?: {
    storyType?: StoryType;
    theme?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function StoryGrid({ stories, filters = {} }: StoryGridProps) {
  // Filter stories based on filters
  const filteredStories = stories.filter(story => {
    // Filter by story type
    if (filters.storyType && story.storyDetails?.storyType !== filters.storyType) {
      return false;
    }
    
    // Filter by theme
    if (filters.theme && !story.themes?.some(theme => theme.id === filters.theme || theme.name === filters.theme)) {
      return false;
    }
    
    // Filter by region
    if (filters.region && !story.regions?.some(region => region.id === filters.region || region.name === filters.region)) {
      return false;
    }
    
    // Filter by date range
    if ((filters.dateFrom || filters.dateTo) && story.date) {
      const storyDate = new Date(story.date);
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (storyDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (storyDate > toDate) return false;
      }
    }
    
    return true;
  });
  
  // Get story type label
  const getStoryTypeLabel = (type?: StoryType) => {
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
  };
  
  if (filteredStories.length === 0) {
    return (
      <div className="py-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
          <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm4.5 7.5a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75zm-4.5.75a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No stories found</h3>
        <p className="text-gray-600">
          Try adjusting your filters to find more stories.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStories.map((story) => (
        <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Link href={`/stories/${story.id}`} className="block hover:opacity-95 transition-opacity">
            <div className="relative h-48">
              {story.thumbnail ? (
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  style={{objectFit: 'cover'}}
                  className="bg-gray-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                    <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm4.5 7.5a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75zm-4.5.75a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Story type badge */}
              {story.storyDetails?.storyType && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {getStoryTypeLabel(story.storyDetails.storyType)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{story.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
              <div className="flex flex-wrap gap-2">
                {story.themes?.slice(0, 2).map(theme => (
                  <span 
                    key={theme.id} 
                    className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                  >
                    {theme.name}
                  </span>
                ))}
                {story.date && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(story.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}