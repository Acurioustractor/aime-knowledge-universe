'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  themes: string[];
  region: string;
  date: string;
  duration?: string;
  imageUrl?: string;
}

export default function BrowsePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filterBy, setFilterBy] = useState<'all' | 'videos' | 'stories' | 'tools' | 'research'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load content from our aggregation pipeline storage
      const response = await fetch('/api/content?limit=200');
      const data = await response.json();
      
      if (data.success && data.data.content.length > 0) {
        console.log(`✅ Loaded ${data.data.content.length} items from content storage`);
        
        // Convert to expected format
        const loadedContent: ContentItem[] = data.data.content.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: mapContentType(item.contentType),
          themes: item.tags || [],
          region: extractRegion(item),
          date: item.date || new Date().toISOString().split('T')[0],
          duration: item.contentType === 'video' ? 'Video' : item.contentType === 'tool' ? 'Tool' : undefined,
          imageUrl: item.thumbnail
        }));
        
        setContent(loadedContent);
      } else {
        console.log('📝 No content in storage yet - pipeline may still be running');
        setContent([]);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    }
  };

  // Helper to extract region from content item
  const extractRegion = (item: any): string => {
    if (item.source === 'hoodie-data') return item.region || 'Australia';
    if (item.tags?.some((tag: string) => tag.includes('Sydney'))) return 'NSW';
    if (item.tags?.some((tag: string) => tag.includes('Melbourne'))) return 'VIC';
    if (item.tags?.some((tag: string) => tag.includes('Brisbane'))) return 'QLD';
    if (item.tags?.some((tag: string) => tag.includes('Perth'))) return 'WA';
    if (item.tags?.some((tag: string) => tag.includes('Adelaide'))) return 'SA';
    return 'Global';
  };

  // Helper function to map content types to expected values
  const mapContentType = (type: string): string => {
    switch (type) {
      case 'content': return 'story';
      case 'recommendations': return 'tool';
      case 'overview': return 'research';
      case 'research': return 'research';
      case 'tools': return 'tool';
      case 'stories': return 'story';
      default: return type;
    }
  };

  // Get unique values for filters
  const regions = ['all', ...Array.from(new Set(content.map(item => item.region)))];
  const themes = ['all', ...Array.from(new Set(content.flatMap(item => item.themes)))];

  // Filter content
  const filteredContent = content.filter(item => {
    if (filterBy !== 'all' && item.type !== filterBy.slice(0, -1)) return false;
    if (selectedRegion !== 'all' && item.region !== selectedRegion) return false;
    if (selectedTheme !== 'all' && !item.themes.includes(selectedTheme)) return false;
    return true;
  });

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0; // popular would need view count data
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Browse</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">
            Browse Knowledge Archive
          </h1>
          <p className="text-gray-700 max-w-4xl">
            Browse and filter through the complete collection of mentoring wisdom, stories, and resources from around the world.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">

        {/* Filters */}
        <div className="border border-gray-300 bg-gray-50 p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-end mb-6">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Content Type</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-2 py-1 border border-gray-400 text-sm"
              >
                <option value="all">All Types</option>
                <option value="videos">Videos</option>
                <option value="stories">Stories</option>
                <option value="tools">Tools</option>
                <option value="research">Research</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2 py-1 border border-gray-400 text-sm"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-2 py-1 border border-gray-400 text-sm"
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>
                    {theme === 'all' ? 'All Themes' : theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1 border border-gray-400 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title A-Z</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-bold text-black mb-1">View</label>
              <div className="text-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`text-blue-600 underline hover:text-blue-800 mr-2 ${viewMode === 'grid' ? 'font-bold' : ''}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`text-blue-600 underline hover:text-blue-800 ${viewMode === 'list' ? 'font-bold' : ''}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filterBy !== 'all' || selectedRegion !== 'all' || selectedTheme !== 'all') && (
            <div className="pt-4 border-t border-gray-300">
              <div className="text-sm text-gray-700">
                <strong>Active filters:</strong>
                {filterBy !== 'all' && (
                  <span className="ml-2">
                    Type: {filterBy}
                    <button onClick={() => setFilterBy('all')} className="ml-1 text-blue-600 underline hover:text-blue-800">[clear]</button>
                  </span>
                )}
                {selectedRegion !== 'all' && (
                  <span className="ml-3">
                    Region: {selectedRegion}
                    <button onClick={() => setSelectedRegion('all')} className="ml-1 text-blue-600 underline hover:text-blue-800">[clear]</button>
                  </span>
                )}
                {selectedTheme !== 'all' && (
                  <span className="ml-3">
                    Theme: {selectedTheme}
                    <button onClick={() => setSelectedTheme('all')} className="ml-1 text-blue-600 underline hover:text-blue-800">[clear]</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilterBy('all');
                    setSelectedRegion('all');
                    setSelectedTheme('all');
                  }}
                  className="ml-4 text-blue-600 underline hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedContent.length} of {content.length} items
          </p>
        </div>

          {/* Content Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContent.map((item) => (
                <ContentListItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* No Results */}
          {sortedContent.length === 0 && (
            <div className="border border-gray-300 p-6 bg-gray-50 text-center">
              <h3 className="text-lg font-bold text-black mb-2">No content found</h3>
              <p className="text-gray-700 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setFilterBy('all');
                  setSelectedRegion('all');
                  setSelectedTheme('all');
                }}
                className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {sortedContent.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-6 py-3 border border-gray-400 text-gray-700 hover:bg-gray-100">
                Load More Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="border border-gray-300 p-4 bg-gray-50 hover:bg-white transition-colors">
      <div className="mb-3">
        <span className="bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-400">
          {item.type.toUpperCase()}
        </span>
      </div>
      
      <h3 className="font-bold text-black mb-2">
        <button className="text-blue-600 underline hover:text-blue-800 text-left">
          {item.title}
        </button>
      </h3>
      
      <p className="text-gray-700 text-sm mb-3">
        {item.description}
      </p>
      
      <div className="mb-3 text-xs text-gray-600">
        <span>Topics: </span>
        {item.themes.slice(0, 3).map((theme, i) => (
          <span key={i} className="text-gray-700">
            {theme}{i < Math.min(item.themes.length, 3) - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{item.region}</span>
        <span className="text-gray-600">{formatDate(item.date)}</span>
      </div>
      
      {item.duration && (
        <div className="mt-1 text-xs text-gray-600">{item.duration}</div>
      )}
    </div>
  );
}

function ContentListItem({ item }: { item: ContentItem }) {
  return (
    <div className="border-b border-gray-300 pb-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300">
            {item.type.toUpperCase()}
          </span>
          <span className="ml-2 text-xs text-gray-600">
            {item.region} • {formatDate(item.date)}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-black mb-2">
        <button className="text-blue-600 underline hover:text-blue-800 text-left">
          {item.title}
        </button>
      </h3>
      
      <p className="text-gray-700 mb-3 text-sm">
        {item.description}
      </p>
      
      <div className="mb-3">
        <span className="text-xs text-gray-600">Topics: </span>
        {item.themes.map((theme, i) => (
          <span key={i} className="text-xs text-gray-700">
            {theme}{i < item.themes.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <button className="text-blue-600 underline hover:text-blue-800">
          {item.type === 'video' ? 'Watch' : item.type === 'tool' ? 'Download' : 'Read'} →
        </button>
        {item.duration && (
          <span className="text-xs text-gray-600">{item.duration}</span>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    video: 'bg-red-100 text-red-700',
    story: 'bg-purple-100 text-purple-700',
    tool: 'bg-green-100 text-green-700',
    research: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700'
  };
  return colors[type] || colors.default;
}

function getTypeGradient(type: string): string {
  const gradients: Record<string, string> = {
    video: 'bg-gradient-to-r from-red-400 to-red-600',
    story: 'bg-gradient-to-r from-purple-400 to-purple-600',
    tool: 'bg-gradient-to-r from-green-400 to-green-600',
    research: 'bg-gradient-to-r from-blue-400 to-blue-600',
    default: 'bg-gradient-to-r from-gray-400 to-gray-600'
  };
  return gradients[type] || gradients.default;
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    video: '🎥',
    story: '📖',
    tool: '🛠️',
    research: '🔬',
    default: '📄'
  };
  return icons[type] || icons.default;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}