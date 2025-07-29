"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, UpdateType } from '@/lib/content-organization/models/purpose-content'

// Types for Updates Hub
type UpdatesHubProps = {
  latestUpdates?: PurposeContentItem[];
  allUpdates?: PurposeContentItem[];
  isLoading?: boolean;
}

type UpdateFilters = {
  updateType?: UpdateType;
  theme?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

type UpdateCategory = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  type: UpdateType;
}

/**
 * Updates Hub component
 * 
 * Displays a hub for update-focused content with latest updates,
 * update categories, and update grid with filtering.
 */
export default function UpdatesHub({ 
  latestUpdates = [], 
  allUpdates = [],
  isLoading = false
}: UpdatesHubProps) {
  // State for filters
  const [filters, setFilters] = useState<UpdateFilters>({});
  const [filteredUpdates, setFilteredUpdates] = useState<PurposeContentItem[]>(allUpdates);
  
  // Update categories
  const updateCategories: UpdateCategory[] = [
    {
      id: 'newsletter',
      name: 'Newsletters',
      description: 'Regular newsletters with updates and announcements',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      ),
      type: 'newsletter'
    },
    {
      id: 'announcement',
      name: 'Announcements',
      description: 'Important announcements and updates',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
          <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
        </svg>
      ),
      type: 'announcement'
    },
    {
      id: 'news',
      name: 'News',
      description: 'Latest news and updates',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
          <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
          <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
        </svg>
      ),
      type: 'news'
    },
    {
      id: 'release',
      name: 'Releases',
      description: 'New releases and updates to tools and resources',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
      ),
      type: 'release'
    }
  ];
  
  // Apply filters when they change
  useEffect(() => {
    if (allUpdates.length === 0) return;
    
    let filtered = [...allUpdates];
    
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
    
    // Filter by date range
    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter(update => {
        if (!update.date) return false;
        
        const updateDate = new Date(update.date);
        
        if (filters.dateRange?.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (updateDate < fromDate) return false;
        }
        
        if (filters.dateRange?.to) {
          const toDate = new Date(filters.dateRange.to);
          if (updateDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredUpdates(filtered);
  }, [allUpdates, filters]);
  
  // Get unique themes
  const themes = Array.from(
    new Set(
      allUpdates.flatMap(update => 
        update.themes?.map(theme => ({ id: theme.id, name: theme.name })) || []
      ).map(theme => JSON.stringify(theme))
    )
  ).map(theme => JSON.parse(theme));
  
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
    const category = updateCategories.find(cat => cat.type === type);
    return category ? category.icon : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
        <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
        <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
      </svg>
    );
  };
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Updates & News</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Updates & News</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Stay informed with the latest updates, newsletters, announcements, and news from across the IMAGI-NATION network.
          </p>
          
          {/* Update Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Update Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {updateCategories.map((category) => (
                <button
                  key={category.id}
                  className={`bg-white rounded-lg shadow-md p-6 text-left hover:bg-gray-50 transition-colors ${
                    filters.updateType === category.type ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => handleFilterChange('updateType', filters.updateType === category.type ? 'all' : category.type)}
                >
                  <div className="flex items-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Latest Updates */}
          {latestUpdates.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Latest Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestUpdates.slice(0, 2).map((update) => (
                  <div key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/updates/${update.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {update.thumbnail ? (
                          <Image
                            src={update.thumbnail}
                            alt={update.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                            {getUpdateTypeIcon(update.updateDetails?.updateType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeColor(update.updateDetails?.updateType)}`}>
                            {getUpdateTypeLabel(update.updateDetails?.updateType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{update.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{update.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {update.date && (
                            <span>{new Date(update.date).toLocaleDateString()}</span>
                          )}
                          {update.updateDetails?.publisher && (
                            <span className="ml-auto">{update.updateDetails.publisher}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              {latestUpdates.length > 2 && (
                <div className="mt-6 text-center">
                  <Link href="/updates/latest" className="btn btn-primary">
                    View All Latest Updates
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter Updates</h2>
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
              
              {/* Date Filter */}
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input 
                  type="date" 
                  id="dateFrom" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mb-2"
                  value={filters.dateRange?.from || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: e.target.value || undefined
                    }
                  }))}
                />
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input 
                  type="date" 
                  id="dateTo" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.dateRange?.to || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      to: e.target.value || undefined
                    }
                  }))}
                />
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
          
          {/* Updates Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Updates</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpdates.map((update) => (
                  <div key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/updates/${update.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {update.thumbnail ? (
                          <Image
                            src={update.thumbnail}
                            alt={update.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            {getUpdateTypeIcon(update.updateDetails?.updateType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeColor(update.updateDetails?.updateType)}`}>
                            {getUpdateTypeLabel(update.updateDetails?.updateType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{update.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{update.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {update.themes?.slice(0, 2).map(theme => (
                            <span 
                              key={theme.id} 
                              className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {update.date && (
                            <span>{new Date(update.date).toLocaleDateString()}</span>
                          )}
                          {update.updateDetails?.publisher && (
                            <span className="ml-auto">{update.updateDetails.publisher}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Update Categories Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/updates/latest" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-600 mr-3">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Latest Updates</h3>
                </div>
                <p className="text-gray-600">
                  View the most recent updates and announcements.
                </p>
              </Link>
              
              <Link href="/updates/newsletters" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500 mr-3">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Newsletters</h3>
                </div>
                <p className="text-gray-600">
                  Browse all newsletters and subscribe to receive future updates.
                </p>
              </Link>
              
              <Link href="/updates/announcements" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500 mr-3">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Announcements</h3>
                </div>
                <p className="text-gray-600">
                  View important announcements and updates.
                </p>
              </Link>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="bg-primary-50 rounded-lg shadow-md p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-2">Subscribe to Our Newsletter</h2>
                <p className="text-gray-600">
                  Stay up to date with the latest updates, announcements, and news. Subscribe to our newsletter to receive regular updates directly in your inbox.
                </p>
              </div>
              <div className="md:w-1/3">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}