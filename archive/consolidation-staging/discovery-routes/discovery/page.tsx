'use client';

import { useState, useEffect } from 'react';
import { HoodiePreview } from '@/components/hoodie-preview/HoodiePreview';
import { useHoodieCollection } from '@/hooks/useHoodiePreview';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content';
  url?: string;
  metadata: Record<string, any>;
  relevance_score: number;
  created_at?: string;
}

interface SearchStats {
  total_content: Record<string, number>;
  last_updated: Record<string, string>;
}

export default function DiscoveryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [totalResults, setTotalResults] = useState(0);
  
  // Load a collection of hoodies for discovery
  const { hoodies, loading: hoodiesLoading } = useHoodieCollection(3);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/unified-search?q=test&limit=1');
      const data = await response.json();
      if (data.success) {
        setStats(data.data.search_stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const typesParam = selectedTypes.includes('all') ? 'all' : selectedTypes.join(',');
      const response = await fetch(`/api/unified-search?q=${encodeURIComponent(query)}&types=${typesParam}&limit=50&include_chunks=true`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data.results);
        setTotalResults(data.data.total_results);
        if (data.data.search_stats) {
          setStats(data.data.search_stats);
        }
      } else {
        console.error('Search failed:', data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      knowledge: '📚',
      business_case: '💡',
      tool: '🔧',
      hoodie: '🎭',
      content: '📄',
      video: '🎬'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      knowledge: 'bg-purple-100 text-purple-800',
      business_case: 'bg-blue-100 text-blue-800',
      tool: 'bg-green-100 text-green-800',
      hoodie: 'bg-yellow-100 text-yellow-800',
      content: 'bg-gray-100 text-gray-800',
      video: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const typeOptions = [
    { id: 'all', label: '🌟 All Content', count: stats ? Object.values(stats.total_content).reduce((a, b) => a + b, 0) : 0 },
    { id: 'knowledge', label: '📚 Knowledge Docs', count: stats?.total_content?.knowledge_documents || 0 },
    { id: 'business_case', label: '💡 Business Cases', count: stats?.total_content?.business_cases || 0 },
    { id: 'tool', label: '🔧 Tools', count: stats?.total_content?.tools || 0 },
    { id: 'hoodie', label: '🎭 Hoodies', count: stats?.total_content?.hoodies || 0 },
    { id: 'content', label: '📄 Content', count: stats?.total_content?.content_items || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌟 AIME Knowledge Universe
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Search across all AIME content - documents, tools, hoodies, business cases, and more
          </p>
          
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              {typeOptions.map((type) => (
                <div key={type.id} className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{type.count.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">{type.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search across all AIME content... (e.g., 'mentoring', 'Indigenous knowledge', 'systems change')"
                className="flex-1 px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </div>

            {/* Content Type Filters */}
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    if (type.id === 'all') {
                      setSelectedTypes(['all']);
                    } else {
                      const newTypes = selectedTypes.includes(type.id)
                        ? selectedTypes.filter(t => t !== type.id)
                        : [...selectedTypes.filter(t => t !== 'all'), type.id];
                      setSelectedTypes(newTypes.length === 0 ? ['all'] : newTypes);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTypes.includes(type.id) || selectedTypes.includes('all')
                      ? 'bg-blue-600 text-white'
                      : 'bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Found {totalResults} results for "{query}"
              </h2>
              <p className="text-gray-300">
                Searched across {Object.values(stats?.total_content || {}).reduce((a, b) => a + b, 0).toLocaleString()} pieces of AIME content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="bg-white bg-opacity-10 rounded-lg p-6 hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)} {result.type.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-gray-400">
                      Score: {result.relevance_score.toFixed(1)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {result.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {result.description}
                  </p>
                  
                  {/* Metadata badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {result.metadata.category && (
                      <span className="px-2 py-1 bg-purple-600 bg-opacity-50 text-purple-200 text-xs rounded">
                        {result.metadata.category}
                      </span>
                    )}
                    {result.metadata.rarity_level && (
                      <span className="px-2 py-1 bg-yellow-600 bg-opacity-50 text-yellow-200 text-xs rounded">
                        {result.metadata.rarity_level}
                      </span>
                    )}
                    {result.metadata.document_type && (
                      <span className="px-2 py-1 bg-blue-600 bg-opacity-50 text-blue-200 text-xs rounded">
                        {result.metadata.document_type}
                      </span>
                    )}
                  </div>
                  
                  {result.url && (
                    <a
                      href={result.url}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View Details →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && query && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-300">Try searching for terms like "mentoring", "systems change", or "Indigenous knowledge"</p>
          </div>
        )}

        {/* Featured Hoodies Section */}
        {!query && !hoodiesLoading && hoodies.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🎭 Featured Digital Hoodies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hoodies.map((hoodie) => (
                <div key={hoodie.id} className="bg-white bg-opacity-10 rounded-xl p-1">
                  <HoodiePreview 
                    hoodie={hoodie}
                    mode="card"
                    showActions={true}
                    onInteraction={(action, h) => {
                      if (action === 'learn') {
                        console.log('Learning about hoodie:', h.name);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <a href="/hoodie-exchange" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
                Explore Hoodie Exchange →
              </a>
            </div>
          </div>
        )}

        {/* Suggested Searches */}
        {!query && (
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-4">Popular Searches</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'mentoring', 'Indigenous knowledge', 'systems change', 
                'Joy Corps', 'transformation', 'impact', 'wisdom', 
                'custodial', 'relational economics', 'validation'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {stats && (
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>
              Last updated: Knowledge Hub syncing • 
              Business Cases: {new Date(stats.last_updated.business_cases || '').toLocaleDateString()} • 
              Tools: {new Date(stats.last_updated.tools || '').toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}