"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { fetchAllContent, ContentItem, ContentType, ContentSource } from '@/lib/integrations'
import { contentCategories } from '@/lib/content-manager'
import ContentGrid from '@/components/ContentGrid'
import UnifiedSearch from '@/components/UnifiedSearch'

export default function ContentExplorerPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as ContentType || 'all';
  const initialSource = searchParams.get('source') as ContentSource || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';
  
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeType, setActiveType] = useState<ContentType | 'all'>(initialType);
  const [activeSource, setActiveSource] = useState<ContentSource | 'all'>(initialSource);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  
  // Fetch all content on initial load
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Import the integration functions directly
        const { fetchAllContent } = await import('@/lib/integrations');
        
        const options = query ? { query } : {};
        const allContent = await fetchAllContent(options);
        setContent(allContent);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    loadContent();
  }, [query]);
  
  // Apply filters when content or active filters change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...content];
      
      // Filter by type
      if (activeType !== 'all') {
        filtered = filtered.filter(item => item.type === activeType);
      }
      
      // Filter by source
      if (activeSource !== 'all') {
        filtered = filtered.filter(item => item.source === activeSource);
      }
      
      // Filter by category
      if (activeCategory !== 'all') {
        filtered = filtered.filter(item => {
          // Check if the item has categories that match the active category
          if (item.categories && item.categories.length > 0) {
            return item.categories.some(cat => 
              cat.toLowerCase() === activeCategory.toLowerCase()
            );
          }
          
          // If no categories, check tags
          if (item.tags && item.tags.length > 0) {
            return item.tags.some(tag => 
              tag.toLowerCase() === activeCategory.toLowerCase()
            );
          }
          
          return false;
        });
      }
      
      setFilteredContent(filtered);
    };
    
    applyFilters();
  }, [content, activeType, activeSource, activeCategory]);
  
  // Get unique content types and sources for filters
  const contentTypes = Array.from(new Set(content.map(item => item.type)));
  const contentSources = Array.from(new Set(content.map(item => item.source)));
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Content Explorer</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Content Explorer</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Explore our comprehensive collection of content from all sources, including videos, newsletters, 
            documents, and implementation toolkits.
          </p>
          
          {/* Search box */}
          <div className="mb-8">
            <UnifiedSearch placeholder="Search all content..." />
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Content Type Filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select 
                  id="type" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value as ContentType | 'all')}
                >
                  <option value="all">All Content Types</option>
                  {contentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Source Filter */}
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select 
                  id="source" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={activeSource}
                  onChange={(e) => setActiveSource(e.target.value as ContentSource | 'all')}
                >
                  <option value="all">All Sources</option>
                  {contentSources.map(source => (
                    <option key={source} value={source}>
                      {source === 'youtube' ? 'YouTube' :
                       source === 'mailchimp' ? 'Mailchimp' :
                       source === 'airtable' ? 'Airtable' :
                       source === 'github' ? 'GitHub Repositories' :
                       source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  id="category" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {contentCategories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
          ) : (
            <ContentGrid 
              items={filteredContent}
              columns={3}
              variant="default"
            />
          )}
        </div>
      </div>
    </div>
  );
}