'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  tags: string[];
  size: string;
  usageRestrictions: string;
  dateAdded: string;
  url?: string;
  thumbnailUrl?: string;
}

interface ToolsClientProps {
  initialTools: Tool[];
  totalTools: number;
  hasMore: boolean;
}

type FilterType = 'all' | 'video' | 'document' | 'training';

export default function ToolsClient({ initialTools, totalTools, hasMore }: ToolsClientProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(initialTools);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply filters and search whenever tools, activeFilter, or searchQuery changes
  useEffect(() => {
    let filtered = tools;

    // Apply category filter first
    switch (activeFilter) {
      case 'video':
        filtered = filtered.filter(tool => 
          tool.fileType?.toLowerCase() === 'video' || 
          tool.title.toLowerCase().includes('video') ||
          tool.category?.toLowerCase().includes('interview') ||
          tool.tags?.some(tag => tag.toLowerCase().includes('tv'))
        );
        break;
      case 'document':
        filtered = filtered.filter(tool => 
          tool.fileType?.toLowerCase() === 'document' ||
          tool.fileType?.toLowerCase() === 'image' ||
          tool.title.toLowerCase().includes('syllabus') ||
          tool.title.toLowerCase().includes('guide')
        );
        break;
      case 'training':
        filtered = filtered.filter(tool => 
          tool.category?.toLowerCase().includes('training') ||
          tool.category?.toLowerCase().includes('mentor') ||
          tool.title.toLowerCase().includes('mentor') ||
          tool.title.toLowerCase().includes('training') ||
          tool.tags?.some(tag => tag.toLowerCase().includes('president'))
        );
        break;
      default:
        // Keep all tools for 'all' filter
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        tool.fileType?.toLowerCase().includes(query)
      );
    }

    setFilteredTools(filtered);
  }, [tools, activeFilter, searchQuery]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const loadMoreTools = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tools-fast?limit=12&offset=${tools.length}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setTools(prev => [...prev, ...result.data]);
      } else {
        throw new Error(result.error || 'Failed to load more tools');
      }
    } catch (error) {
      console.error('Load more error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load more tools');
    } finally {
      setLoading(false);
    }
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'video': return '📹';
      case 'document': return '📄';
      case 'training': return '🎓';
      default: return '📚';
    }
  };

  const getFilterCount = (filter: FilterType) => {
    switch (filter) {
      case 'video':
        return tools.filter(tool => 
          tool.fileType?.toLowerCase() === 'video' || 
          tool.title.toLowerCase().includes('video') ||
          tool.category?.toLowerCase().includes('interview') ||
          tool.tags?.some(tag => tag.toLowerCase().includes('tv'))
        ).length;
      case 'document':
        return tools.filter(tool => 
          tool.fileType?.toLowerCase() === 'document' ||
          tool.fileType?.toLowerCase() === 'image' ||
          tool.title.toLowerCase().includes('syllabus') ||
          tool.title.toLowerCase().includes('guide')
        ).length;
      case 'training':
        return tools.filter(tool => 
          tool.category?.toLowerCase().includes('training') ||
          tool.category?.toLowerCase().includes('mentor') ||
          tool.title.toLowerCase().includes('mentor') ||
          tool.title.toLowerCase().includes('training') ||
          tool.tags?.some(tag => tag.toLowerCase().includes('president'))
        ).length;
      default:
        return tools.length;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-wiki py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-800 font-medium">Tools & Resources</span>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-wiki py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Tools & Resources
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover practical toolkits, frameworks, and resources designed to implement 
              AIME's proven mentoring approaches and imagination-based learning systems.
            </p>
            
            {/* Stats Badge */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {totalTools} resources available
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-12">
        <div className="container-wiki">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search resources by title, description, or tags..."
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters & Results */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filteredTools.length}</span> of <span className="font-medium text-gray-900">{totalTools}</span> resources
                {activeFilter !== 'all' && <span className="text-gray-500 ml-2">• {activeFilter} filter active</span>}
                {searchQuery && <span className="text-gray-500 ml-2">• search: "{searchQuery}"</span>}
              </div>
            </div>
            
            {/* Interactive Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Filter by:</span>
              <div className="flex space-x-2">
                {(['all', 'video', 'document', 'training'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all flex items-center space-x-1 ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{getFilterIcon(filter)}</span>
                    <span className="capitalize">{filter === 'all' ? 'All' : filter}</span>
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                      {getFilterCount(filter)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Thumbnail */}
                    {tool.thumbnailUrl && (
                      <div className="relative bg-gray-100 overflow-hidden">
                        <img 
                          src={tool.thumbnailUrl} 
                          alt={tool.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {tool.fileType === 'Video' && (
                            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                              📹 Video
                            </div>
                          )}
                          {tool.fileType === 'Document' && (
                            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                              📄 Document
                            </div>
                          )}
                          {tool.fileType === 'Image' && (
                            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                              🖼️ Image
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Category & Type */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                            {tool.category || 'General'}
                          </span>
                          {tool.tags && tool.tags.length > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              {tool.tags[0].replace(/[{}]/g, '')}
                            </span>
                          )}
                        </div>
                        {tool.size && (
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {tool.size}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>

                      {/* Description */}
                      {tool.description && tool.description.trim() && (
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                          {tool.description}
                        </p>
                      )}

                      {/* Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">
                              #{tag.replace(/[{}]/g, '')}
                            </span>
                          ))}
                          {tool.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{tool.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          {new Date(tool.dateAdded).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        {tool.url && (
                          <a 
                            href={tool.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <span>Open</span>
                            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && filteredTools.length === tools.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMoreTools}
                    disabled={loading}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Loading more resources...
                      </>
                    ) : (
                      <>
                        <span>Load more resources</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {searchQuery ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                {searchQuery ? (
                  <>
                    <p className="text-gray-500 mb-4">No resources match your search for "{searchQuery}".</p>
                    <div className="space-y-2">
                      <button
                        onClick={clearSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-2"
                      >
                        Clear Search
                      </button>
                      <button
                        onClick={() => {clearSearch(); handleFilterChange('all');}}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Show All Resources
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No resources match the "{activeFilter}" filter.</p>
                    <button
                      onClick={() => handleFilterChange('all')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Show All Resources
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={loadMoreTools}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}