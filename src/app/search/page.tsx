'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  content?: string;
  content_type: string;
  source: string;
  url?: string;
  source_created_at?: string;
  view_count?: number;
  relevance_score?: number;
  match_reasons?: string[];
}

interface SearchSuggestion {
  query: string;
  type: 'correction' | 'completion' | 'related';
  confidence: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'newsletter' | 'tool' | 'business_case'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Use the smart search API
      const response = await fetch(`/api/search/smart?q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        console.log(`🔍 Found ${data.total} total search results`);
        setResults(data.results);
        setTotalResults(data.total);
        setSuggestions(data.suggestions || []);
        setRelatedSearches(data.relatedSearches || []);
        setRelatedContent(data.relatedContent || []);
      } else {
        console.log('🔍 No search results found');
        setResults([]);
        setTotalResults(0);
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get content description
  const getContentDescription = (result: SearchResult): string => {
    if (result.content) {
      // Get first 200 chars of content
      return result.content.substring(0, 200) + (result.content.length > 200 ? '...' : '');
    }
    return 'No description available';
  };

  const filteredResults = results.filter(result => {
    if (filterType === 'all') return true;
    return result.content_type === filterType;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'relevance') return (b.relevance_score || 0) - (a.relevance_score || 0);
    if (sortBy === 'date') return new Date(b.source_created_at || 0).getTime() - new Date(a.source_created_at || 0).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  useEffect(() => {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    const themeParam = urlParams.get('theme');
    
    if (queryParam) {
      setQuery(queryParam);
      handleSearch(queryParam);
    } else if (themeParam) {
      const themeQueries = {
        climate: 'climate action youth leadership environmental change',
        indigenous: 'indigenous knowledge traditional wisdom cultural bridge',
        digital: 'digital innovation technology virtual mentoring online',
        global: 'global impact cross-cultural international collaboration'
      };
      
      const searchQuery = themeQueries[themeParam as keyof typeof themeQueries] || themeParam;
      setQuery(searchQuery);
      handleSearch(searchQuery);
    } else if (!query && results.length === 0) {
      // Auto-search for popular topics on page load
      handleSearch('mentorship wisdom');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Search</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-6">Search Knowledge Archive</h1>
          
          {/* Search Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="mb-6">
            <div className="flex max-w-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for mentoring wisdom, stories, tools, or research..."
                className="flex-1 px-3 py-2 border border-gray-400 text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-400 hover:bg-gray-200 disabled:opacity-50 text-black font-medium"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Quick Searches */}
          <div className="mb-6">
            <span className="text-sm text-gray-700 mr-2">Popular searches:</span>
            {['indigenous custodianship', 'youth leadership', 'cultural bridges', 'mentoring stories', 'innovation'].map((term) => (
              <button
                key={term}
                onClick={() => {setQuery(term); handleSearch(term);}}
                className="text-blue-600 underline hover:text-blue-800 text-sm mr-4"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-6 items-center text-sm">
            {/* Content Type Filter */}
            <div>
              <label className="text-gray-700 mr-2">Filter by type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-400 px-2 py-1"
              >
                <option value="all">All content</option>
                <option value="videos">Videos</option>
                <option value="stories">Stories</option>
                <option value="tools">Tools</option>
                <option value="research">Research</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-gray-700 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-400 px-2 py-1"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <span className="text-gray-700 mr-2">View:</span>
              <button
                onClick={() => setViewMode('list')}
                className={`text-blue-600 underline hover:text-blue-800 mr-2 ${viewMode === 'list' ? 'font-bold' : ''}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`text-blue-600 underline hover:text-blue-800 ${viewMode === 'grid' ? 'font-bold' : ''}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">
          {/* Results */}
          <div className="mb-4 text-sm text-gray-600">
            {sortedResults.length > 0 && `${sortedResults.length} results found`}
          </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching through AIME knowledge...</p>
          </div>
        )}

        {/* Results Display */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {sortedResults.map((result) => (
              <div key={result.id} className="border-b border-gray-300 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300">
                      {result.type.toUpperCase()}
                    </span>
                    <span className="ml-2 text-xs text-gray-600">
                      {result.source} • {formatDate(result.metadata?.publishedDate)}
                    </span>
                  </div>
                  {result.relevanceScore && (
                    <span className="text-xs text-gray-600">
                      {Math.round(result.relevanceScore * 100)}% match
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-black mb-2">
                  <button className="text-blue-600 underline hover:text-blue-800 text-left">
                    {result.title}
                  </button>
                </h3>
                
                <p className="text-gray-700 mb-3 text-sm">
                  {result.description}
                </p>
                
                {result.themes && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-600">Topics: </span>
                    {result.themes.slice(0, 3).map((theme, i) => (
                      <span key={i} className="text-xs text-gray-700">
                        {theme}{i < Math.min(result.themes!.length, 3) - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <button className="text-blue-600 underline hover:text-blue-800">
                    {result.type === 'video' ? 'Watch' : result.type === 'tool' ? 'Download' : 'Read'} →
                  </button>
                  <div className="flex gap-4">
                    <button className="text-blue-600 underline hover:text-blue-800">
                      Save
                    </button>
                    <button className="text-blue-600 underline hover:text-blue-800">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResults.map((result) => (
              <div key={result.id} className="border border-gray-300 p-4 bg-gray-50">
                <div className="mb-3">
                  <span className="bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-400">
                    {result.type.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-bold text-black mb-2">
                  <button className="text-blue-600 underline hover:text-blue-800 text-left">
                    {result.title}
                  </button>
                </h3>
                
                <p className="text-gray-700 text-sm mb-3">
                  {result.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {formatDate(result.metadata?.publishedDate)}
                  </span>
                  <button className="text-blue-600 underline hover:text-blue-800">
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {/* Related Content Section */}
        {relatedContent.length > 0 && (
          <div className="mt-8 border-t border-gray-300 pt-8">
            <h3 className="text-lg font-bold text-black mb-4">Related Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedContent.slice(0, 6).map((item) => (
                <div key={item.id} className="border border-gray-300 p-4 bg-gray-50">
                  <h4 className="font-medium text-black mb-2">
                    <Link href={item.url || '#'} className="text-blue-600 underline hover:text-blue-800">
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.content_type} • {item.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && sortedResults.length === 0 && query && (
          <div className="border border-gray-300 p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-black mb-2">No results found</h3>
            <p className="text-gray-700 mb-4">Your search for "<strong>{query}</strong>" did not match any content in the archive.</p>
            <p className="text-sm text-gray-600 mb-4">Suggestions:</p>
            <ul className="text-sm text-gray-700 mb-4 ml-4">
              <li>• Try different or more general keywords</li>
              <li>• Check your spelling</li>
              <li>• Browse categories below</li>
            </ul>
            <div className="space-x-4">
              <Link href="/stories" className="text-blue-600 underline hover:text-blue-800">
                Browse Stories
              </Link>
              <Link href="/content/videos" className="text-blue-600 underline hover:text-blue-800">
                Watch Videos
              </Link>
              <Link href="/tools" className="text-blue-600 underline hover:text-blue-800">
                Get Tools
              </Link>
              <Link href="/research" className="text-blue-600 underline hover:text-blue-800">
                Read Research
              </Link>
            </div>
          </div>
        )}
      </div>
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
    workshop: 'bg-orange-100 text-orange-700',
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
    workshop: 'bg-gradient-to-r from-orange-400 to-orange-600',
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
    workshop: '👥',
    default: '📄'
  };
  return icons[type] || icons.default;
}

function formatDate(date: string | undefined): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}