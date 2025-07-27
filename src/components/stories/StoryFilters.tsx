"use client"

import { useState, useEffect } from 'react'
import { StoryType } from '@/lib/content-organization/models/purpose-content'

type StoryFiltersProps = {
  storyTypes: { id: StoryType; name: string }[];
  themes: { id: string; name: string }[];
  regions: { id: string; name: string }[];
  onFilterChange: (filters: {
    storyType?: StoryType;
    theme?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  initialFilters?: {
    storyType?: StoryType;
    theme?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function StoryFilters({ 
  storyTypes, 
  themes, 
  regions, 
  onFilterChange,
  initialFilters = {}
}: StoryFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);
  
  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters };
    
    // If the same value is selected, clear the filter
    if (newFilters[filterType] === value) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {Object.keys(filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all
          </button>
        )}
      </div>
      
      {/* Story Type Filter */}
      {storyTypes && storyTypes.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-sm text-gray-500 uppercase mb-2">Story Type</h4>
          <div className="space-y-2">
            {storyTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleFilterChange('storyType', type.id)}
                className={`w-full px-3 py-2 text-left rounded-md ${
                  filters.storyType === type.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Theme Filter */}
      {themes && themes.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-sm text-gray-500 uppercase mb-2">Theme</h4>
          <div className="space-y-2">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleFilterChange('theme', theme.id)}
                className={`w-full px-3 py-2 text-left rounded-md ${
                  filters.theme === theme.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Region Filter */}
      {regions && regions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-sm text-gray-500 uppercase mb-2">Region</h4>
          <div className="space-y-2">
            {regions.map(region => (
              <button
                key={region.id}
                onClick={() => handleFilterChange('region', region.id)}
                className={`w-full px-3 py-2 text-left rounded-md ${
                  filters.region === region.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Date Range Filter */}
      <div>
        <h4 className="font-medium text-sm text-gray-500 uppercase mb-2">Date Range</h4>
        <div className="space-y-4">
          <div>
            <label htmlFor="dateFrom" className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              id="dateFrom"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              id="dateTo"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}