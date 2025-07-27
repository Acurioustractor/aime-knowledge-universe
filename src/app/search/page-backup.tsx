'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  source: string;
  url?: string;
  metadata?: any;
  themes?: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/content/real?limit=50`);
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.data.content.filter((item: any) => {
          const searchLower = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.themes?.some((theme: string) => theme.toLowerCase().includes(searchLower))
          );
        });
        setResults(filtered);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

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
                placeholder="Search for content..."
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
        </div>
      </div>

      {/* Results */}
      <div className="py-8">
        <div className="container-wiki">
          {results.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black mb-4">
                Search Results ({results.length})
              </h2>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border border-gray-300 p-4 bg-white">
                    <h3 className="text-lg font-bold text-black mb-2">
                      <Link href={result.url || '#'} className="text-blue-600 underline hover:text-blue-800">
                        {result.title}
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-2">{result.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs border">
                        {result.type}
                      </span>
                      <span>Source: {result.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {query && results.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}