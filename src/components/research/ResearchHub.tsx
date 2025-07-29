"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, ResearchType } from '@/lib/content-organization/models/purpose-content'

// Types for Research Hub
type ResearchHubProps = {
  featuredResearch?: PurposeContentItem[];
  allResearch?: PurposeContentItem[];
  isLoading?: boolean;
}

type ResearchFilters = {
  researchType?: ResearchType;
  theme?: string;
  topic?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

/**
 * Research Hub component
 * 
 * Displays a hub for research-focused content with featured research,
 * research themes, and research grid with filtering.
 */
export default function ResearchHub({ 
  featuredResearch = [], 
  allResearch = [],
  isLoading = false
}: ResearchHubProps) {
  // State for filters
  const [filters, setFilters] = useState<ResearchFilters>({});
  const [filteredResearch, setFilteredResearch] = useState<PurposeContentItem[]>(allResearch);
  
  // Apply filters when they change
  useEffect(() => {
    if (allResearch.length === 0) return;
    
    let filtered = [...allResearch];
    
    // Filter by research type
    if (filters.researchType) {
      filtered = filtered.filter(research => 
        research.researchDetails?.researchType === filters.researchType
      );
    }
    
    // Filter by theme
    if (filters.theme) {
      filtered = filtered.filter(research => 
        research.themes?.some(theme => 
          theme.name.toLowerCase().includes(filters.theme!.toLowerCase()) ||
          theme.id === filters.theme
        )
      );
    }
    
    // Filter by topic
    if (filters.topic) {
      filtered = filtered.filter(research => 
        research.topics?.some(topic => 
          topic.name.toLowerCase().includes(filters.topic!.toLowerCase()) ||
          topic.id === filters.topic
        )
      );
    }
    
    // Filter by date range
    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter(research => {
        if (!research.date) return false;
        
        const researchDate = new Date(research.date);
        
        if (filters.dateRange?.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (researchDate < fromDate) return false;
        }
        
        if (filters.dateRange?.to) {
          const toDate = new Date(filters.dateRange.to);
          if (researchDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredResearch(filtered);
  }, [allResearch, filters]);  
  
// Get unique research types
  const researchTypes = Array.from(
    new Set(allResearch.map(research => research.researchDetails?.researchType).filter(Boolean) as ResearchType[])
  );
  
  // Get unique themes
  const themes = Array.from(
    new Set(
      allResearch.flatMap(research => 
        research.themes?.map(theme => ({ id: theme.id, name: theme.name })) || []
      ).map(theme => JSON.stringify(theme))
    )
  ).map(theme => JSON.parse(theme));
  
  // Get unique topics
  const topics = Array.from(
    new Set(
      allResearch.flatMap(research => 
        research.topics?.map(topic => ({ id: topic.id, name: topic.name })) || []
      ).map(topic => JSON.stringify(topic))
    )
  ).map(topic => JSON.parse(topic));
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof ResearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };
  
  // Get research type label
  const getResearchTypeLabel = (type?: ResearchType) => {
    switch (type) {
      case 'finding':
        return 'Research Finding';
      case 'analysis':
        return 'Analysis';
      case 'synthesis':
        return 'Synthesis';
      case 'data':
        return 'Data';
      case 'report':
        return 'Report';
      default:
        return 'Research';
    }
  };
  
  // Get research type icon
  const getResearchTypeIcon = (type?: ResearchType) => {
    switch (type) {
      case 'finding':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
            <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
          </svg>
        );
      case 'analysis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
          </svg>
        );
      case 'synthesis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-500">
            <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
            <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
          </svg>
        );
      case 'data':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        );
      case 'report':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
            <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 001.06-1.06l-1.047-1.048A3.375 3.375 0 1011.625 18z" clipRule="evenodd" />
          </svg>
        );
    }
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
              <li className="text-gray-700 font-medium">Research & Insights</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Research & Insights</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Explore research findings, data analysis, and synthesis from across the AIME ecosystem.
            These insights provide evidence-based understanding of our work and impact.
          </p>
          
          {/* Featured Research */}
          {featuredResearch.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Featured Research</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredResearch.slice(0, 3).map((research) => (
                  <div key={research.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/research/${research.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {research.thumbnail ? (
                          <Image
                            src={research.thumbnail}
                            alt={research.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                            {getResearchTypeIcon(research.researchDetails?.researchType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getResearchTypeLabel(research.researchDetails?.researchType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{research.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{research.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {research.date && (
                            <span>{new Date(research.date).toLocaleDateString()}</span>
                          )}
                          {research.authors && research.authors.length > 0 && (
                            <span className="ml-auto">{research.authors[0]}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Research Themes */}
          {themes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Research Themes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {themes.slice(0, 6).map((theme) => (
                  <button
                    key={theme.id}
                    className={`bg-white rounded-lg shadow-md p-6 text-left hover:bg-gray-50 transition-colors ${
                      filters.theme === theme.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => handleFilterChange('theme', filters.theme === theme.id ? 'all' : theme.id)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                    <p className="text-sm text-gray-600">
                      {allResearch.filter(research => 
                        research.themes?.some(t => t.id === theme.id)
                      ).length} research items
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )} 
         
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Research Type Filter */}
              <div>
                <label htmlFor="researchType" className="block text-sm font-medium text-gray-700 mb-1">Research Type</label>
                <select 
                  id="researchType" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.researchType || 'all'}
                  onChange={(e) => handleFilterChange('researchType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  {researchTypes.map((type) => (
                    <option key={type} value={type}>{getResearchTypeLabel(type)}</option>
                  ))}
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
              
              {/* Topic Filter */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <select 
                  id="topic" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.topic || 'all'}
                  onChange={(e) => handleFilterChange('topic', e.target.value)}
                >
                  <option value="all">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
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
                className="btn btn-secondary mr-2"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Research Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Research</h2>
              <p className="text-sm text-gray-500">
                {filteredResearch.length} {filteredResearch.length === 1 ? 'item' : 'items'} found
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredResearch.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No research found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more research.
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
                {filteredResearch.map((research) => (
                  <div key={research.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/research/${research.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {research.thumbnail ? (
                          <Image
                            src={research.thumbnail}
                            alt={research.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            {getResearchTypeIcon(research.researchDetails?.researchType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getResearchTypeLabel(research.researchDetails?.researchType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{research.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{research.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {research.themes?.slice(0, 2).map(theme => (
                            <span 
                              key={theme.id} 
                              className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Research Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/research/findings" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500 mr-3">
                    <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Research Findings</h3>
                </div>
                <p className="text-gray-600">
                  Explore key findings from our research and evaluation work.
                </p>
              </Link>
              
              <Link href="/research/analysis" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500 mr-3">
                    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Data Analysis</h3>
                </div>
                <p className="text-gray-600">
                  Detailed analysis of data from our programs and initiatives.
                </p>
              </Link>
              
              <Link href="/research/synthesis" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500 mr-3">
                    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                    <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Synthesis Documents</h3>
                </div>
                <p className="text-gray-600">
                  Synthesis of research findings and insights across multiple sources.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}