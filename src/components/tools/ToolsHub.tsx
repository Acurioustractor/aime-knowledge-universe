"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, ToolType } from '@/lib/content-organization/models/purpose-content'

// Types for Tools Hub
type ToolsHubProps = {
  featuredTools?: PurposeContentItem[];
  allTools?: PurposeContentItem[];
  isLoading?: boolean;
}

type ToolFilters = {
  toolType?: ToolType;
  theme?: string;
  audience?: string;
  context?: string;
}

type ToolCategory = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  type: ToolType;
}

/**
 * Tools Hub component
 * 
 * Displays a hub for tool-focused content with featured tools,
 * tool categories, and tool grid with filtering.
 */
export default function ToolsHub({ 
  featuredTools = [], 
  allTools = [],
  isLoading = false
}: ToolsHubProps) {
  // State for filters
  const [filters, setFilters] = useState<ToolFilters>({});
  const [filteredTools, setFilteredTools] = useState<PurposeContentItem[]>(allTools);
  
  // Tool categories
  const toolCategories: ToolCategory[] = [
    {
      id: 'implementation',
      name: 'Implementation Toolkits',
      description: 'Comprehensive toolkits for implementing AIME programs and initiatives',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
          <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
        </svg>
      ),
      type: 'implementation'
    },
    {
      id: 'worksheet',
      name: 'Worksheets & Guides',
      description: 'Practical worksheets and guides for various activities and processes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      type: 'worksheet'
    },
    {
      id: 'guide',
      name: 'How-to Guides',
      description: 'Step-by-step guides for implementing specific practices and approaches',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
          <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
        </svg>
      ),
      type: 'guide'
    },
    {
      id: 'template',
      name: 'Templates',
      description: 'Ready-to-use templates for various documents and activities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
          <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
          <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
        </svg>
      ),
      type: 'template'
    },
    {
      id: 'toolkit',
      name: 'Complete Toolkits',
      description: 'Comprehensive collections of tools, guides, and resources',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
          <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
          <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
          <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
        </svg>
      ),
      type: 'toolkit'
    }
  ];
  
  // Apply filters when they change
  useEffect(() => {
    if (allTools.length === 0) return;
    
    let filtered = [...allTools];
    
    // Filter by tool type
    if (filters.toolType) {
      filtered = filtered.filter(tool => 
        tool.toolDetails?.toolType === filters.toolType
      );
    }
    
    // Filter by theme
    if (filters.theme) {
      filtered = filtered.filter(tool => 
        tool.themes?.some(theme => 
          theme.name.toLowerCase().includes(filters.theme!.toLowerCase()) ||
          theme.id === filters.theme
        )
      );
    }
    
    // Filter by audience
    if (filters.audience) {
      filtered = filtered.filter(tool => 
        tool.toolDetails?.targetAudience?.some(audience => 
          audience.toLowerCase().includes(filters.audience!.toLowerCase())
        )
      );
    }
    
    // Filter by context
    if (filters.context) {
      filtered = filtered.filter(tool => 
        tool.toolDetails?.implementationContext?.some(context => 
          context.toLowerCase().includes(filters.context!.toLowerCase())
        )
      );
    }
    
    setFilteredTools(filtered);
  }, [allTools, filters]);  

  // Get unique tool types
  const toolTypes = Array.from(
    new Set(allTools.map(tool => tool.toolDetails?.toolType).filter(Boolean) as ToolType[])
  );
  
  // Get unique themes
  const themes = Array.from(
    new Set(
      allTools.flatMap(tool => 
        tool.themes?.map(theme => ({ id: theme.id, name: theme.name })) || []
      ).map(theme => JSON.stringify(theme))
    )
  ).map(theme => JSON.parse(theme));
  
  // Get unique audiences
  const audiences = Array.from(
    new Set(
      allTools.flatMap(tool => 
        tool.toolDetails?.targetAudience || []
      )
    )
  );
  
  // Get unique contexts
  const contexts = Array.from(
    new Set(
      allTools.flatMap(tool => 
        tool.toolDetails?.implementationContext || []
      )
    )
  );
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof ToolFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };
  
  // Get tool type label
  const getToolTypeLabel = (type?: ToolType) => {
    switch (type) {
      case 'implementation':
        return 'Implementation Toolkit';
      case 'worksheet':
        return 'Worksheet';
      case 'guide':
        return 'Guide';
      case 'template':
        return 'Template';
      case 'toolkit':
        return 'Complete Toolkit';
      default:
        return 'Tool';
    }
  };
  
  // Get tool type icon
  const getToolTypeIcon = (type?: ToolType) => {
    const category = toolCategories.find(cat => cat.type === type);
    return category ? category.icon : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
        <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
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
              <li className="text-gray-700 font-medium">Tools & Resources</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Tools & Resources</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Access practical implementation toolkits, worksheets, guides, and templates to support your work.
            These resources are designed to help you implement AIME's approaches and methodologies.
          </p>
          
          {/* Tool Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Tool Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {toolCategories.map((category) => (
                <button
                  key={category.id}
                  className={`bg-white rounded-lg shadow-md p-6 text-left hover:bg-gray-50 transition-colors ${
                    filters.toolType === category.type ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => handleFilterChange('toolType', filters.toolType === category.type ? 'all' : category.type)}
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
    
          {/* Featured Tools */}
          {featuredTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Featured Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTools.slice(0, 3).map((tool) => (
                  <div key={tool.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/tools/${tool.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {tool.thumbnail ? (
                          <Image
                            src={tool.thumbnail}
                            alt={tool.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                            {getToolTypeIcon(tool.toolDetails?.toolType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getToolTypeLabel(tool.toolDetails?.toolType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{tool.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
                        {tool.toolDetails?.targetAudience && tool.toolDetails.targetAudience.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">For:</span>
                            <span>{tool.toolDetails.targetAudience.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Tool Type Filter */}
              <div>
                <label htmlFor="toolType" className="block text-sm font-medium text-gray-700 mb-1">Tool Type</label>
                <select 
                  id="toolType" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.toolType || 'all'}
                  onChange={(e) => handleFilterChange('toolType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  {toolTypes.map((type) => (
                    <option key={type} value={type}>{getToolTypeLabel(type)}</option>
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
              
              {/* Audience Filter */}
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select 
                  id="audience" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.audience || 'all'}
                  onChange={(e) => handleFilterChange('audience', e.target.value)}
                >
                  <option value="all">All Audiences</option>
                  {audiences.map((audience) => (
                    <option key={audience} value={audience}>{audience}</option>
                  ))}
                </select>
              </div>
              
              {/* Context Filter */}
              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Implementation Context</label>
                <select 
                  id="context" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.context || 'all'}
                  onChange={(e) => handleFilterChange('context', e.target.value)}
                >
                  <option value="all">All Contexts</option>
                  {contexts.map((context) => (
                    <option key={context} value={context}>{context}</option>
                  ))}
                </select>
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
          
          {/* Tool Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Tools</h2>
              <p className="text-sm text-gray-500">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more tools.
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
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/tools/${tool.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {tool.thumbnail ? (
                          <Image
                            src={tool.thumbnail}
                            alt={tool.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            {getToolTypeIcon(tool.toolDetails?.toolType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getToolTypeLabel(tool.toolDetails?.toolType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{tool.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {tool.themes?.slice(0, 2).map(theme => (
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
          
          {/* Tool Categories Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/tools/implementation" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500 mr-3">
                    <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Implementation Toolkits</h3>
                </div>
                <p className="text-gray-600">
                  Comprehensive toolkits for implementing AIME programs and initiatives.
                </p>
              </Link>
              
              <Link href="/tools/worksheets" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500 mr-3">
                    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Worksheets & Guides</h3>
                </div>
                <p className="text-gray-600">
                  Practical worksheets and guides for various activities and processes.
                </p>
              </Link>
              
              <Link href="/tools/templates" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500 mr-3">
                    <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
                    <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Templates</h3>
                </div>
                <p className="text-gray-600">
                  Ready-to-use templates for various documents and activities.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}