"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, UpdateType } from '@/lib/content-organization/models/purpose-content'

// Types for Updates Archive
type UpdatesArchiveProps = {
  updates: PurposeContentItem[];
  isLoading?: boolean;
}

type UpdateFilters = {
  updateType?: UpdateType;
  theme?: string;
  year?: number;
}

/**
 * Updates Archive component
 * 
 * Displays an archive of updates with filtering options
 */
export default function UpdatesArchive({ 
  updates = [],
  isLoading = false
}: UpdatesArchiveProps) {
  const [filters, setFilters] = useState<UpdateFilters>({});
  const [filteredUpdates, setFilteredUpdates] = useState<PurposeContentItem[]>(updates);
  
  // Apply filters when they change or updates change
  useEffect(() => {
    let filtered = [...updates];
    
    // Filter by update type
    if (filters.updateType) {
      filtered = filtered.filter(update => 
        update.updateDetails?.updateType === filters.updateType
      );
    }
    
    // Filter by theme
    if (filters.theme) {
      filtered = filtered.filter(update => 
        update.themes?.some(theme => 
          theme.name.toLowerCase().includes(filters.theme!.toLowerCase()) ||
          theme.id === filters.theme
        )
      );
    }
    
    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(update => {
        if (!update.date) return false;
        const updateDate = new Date(update.date);
        return updateDate.getFullYear() === filters.year;
      });
    }
    
    setFilteredUpdates(filtered);
  }, [updates, filters]);
  
  // Get unique themes
  const themes = Array.from(
    new Set(
      updates.flatMap(update => 
        update.themes?.map(theme => ({ id: theme.id, name: theme.name })) || []
      ).map(theme => JSON.stringify(theme))
    )
  ).map(theme => JSON.parse(theme));
  
  // Get unique years
  const years = Array.from(
    new Set(
      updates
        .filter(update => update.date)
        .map(update => new Date(update.date!).getFullYear())
    )
  ).sort((a, b) => b - a); // Sort descending
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof UpdateFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };
  
  // Get update type label
  const getUpdateTypeLabel = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'Newsletter';
      case 'announcement':
        return 'Announcement';
      case 'news':
        return 'News';
      case 'release':
        return 'Release';
      default:
        return 'Update';
    }
  };
  
  // Get update type color
  const getUpdateTypeColor = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-green-100 text-green-800';
      case 'news':
        return 'bg-purple-100 text-purple-800';
      case 'release':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get update type icon
  const getUpdateTypeIcon = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
          </svg>
        );
      case 'news':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        );
      case 'release':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        );
    }
  };
  
  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Archive</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Update Type Filter */}
          <div>
            <label htmlFor="updateType" className="block text-sm font-medium text-gray-700 mb-1">Update Type</label>
            <select 
              id="updateType" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.updateType || 'all'}
              onChange={(e) => handleFilterChange('updateType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="newsletter">Newsletters</option>
              <option value="announcement">Announcements</option>
              <option value="news">News</option>
              <option value="release">Releases</option>
            </select>
          </div>
          
          {/* Theme Filter */}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select 
              id="theme" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.theme || 'all'}
              onChange={(e) => handleFilterChange('theme', e.target.value)}
            >
              <option value="all">All Themes</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select 
              id="year" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filters.year || 'all'}
              onChange={(e) => handleFilterChange('year', e.target.value === 'all' ? undefined : parseInt(e.target.value))}
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Updates List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Archive</h2>
          <p className="text-sm text-gray-500">
            {filteredUpdates.length} {filteredUpdates.length === 1 ? 'update' : 'updates'} found
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No updates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to find more updates.
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setFilters({})}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/updates/${update.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="p-6 flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {getUpdateTypeIcon(update.updateDetails?.updateType)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeColor(update.updateDetails?.updateType)}`}>
                          {getUpdateTypeLabel(update.updateDetails?.updateType)}
                        </span>
                        {update.date && (
                          <span className="text-xs text-gray-500">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold">{update.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{update.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}