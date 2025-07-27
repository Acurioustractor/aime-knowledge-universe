"use client"

import { useState } from 'react'
import { ContentItem, ContentType } from '@/lib/integrations'
import ContentCard from './ContentCard'

type ContentGridProps = {
  items: ContentItem[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured';
  limit?: number;
  className?: string;
}

export default function ContentGrid({ 
  items, 
  title, 
  description, 
  showFilters = false,
  columns = 3,
  variant = 'default',
  limit,
  className = ''
}: ContentGridProps) {
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all');
  const [activeSource, setActiveSource] = useState<string>('all');
  
  // Filter items based on active filters
  const filteredItems = items.filter(item => {
    if (activeType !== 'all' && item.type !== activeType) {
      return false;
    }
    if (activeSource !== 'all' && item.source !== activeSource) {
      return false;
    }
    return true;
  });
  
  // Apply limit if specified
  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;
  
  // Get unique content types and sources for filters
  const contentTypes = Array.from(new Set(items.map(item => item.type)));
  const contentSources = Array.from(new Set(items.map(item => item.source)));
  
  // Determine grid columns class
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];
  
  return (
    <div className={className}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      
      {/* Filters */}
      {showFilters && items.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeType === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Types
            </button>
            {contentTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeType === type 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSource('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeSource === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Sources
            </button>
            {contentSources.map(source => (
              <button
                key={source}
                onClick={() => setActiveSource(source)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeSource === source 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Content Grid */}
      {displayItems.length > 0 ? (
        <div className={`grid ${gridColumnsClass} gap-6`}>
          {displayItems.map(item => (
            <ContentCard 
              key={`${item.source}-${item.id}`} 
              item={item} 
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No content found</h3>
          <p className="text-gray-600">
            {activeType !== 'all' || activeSource !== 'all' 
              ? 'Try changing your filters or search criteria.'
              : 'No content items are available at this time.'}
          </p>
        </div>
      )}
    </div>
  );
}