"use client"

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface SearchResult {
  id: string
  title: string
  description: string
  content: string
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content'
  url?: string
  metadata: Record<string, any>
  relevance_score: number
  semantic_score: number
  cultural_sensitivity: string
  related_items: Array<{id: string, title: string, type: string, relationship: string}>
}

interface WikiSearchResultsProps {
  query: string
  onNavigate: (section: string, page?: string) => void
}

export default function WikiSearchResults({ query, onNavigate }: WikiSearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all'])
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch search results
  useEffect(() => {
    if (!query.trim()) return

    const fetchResults = async () => {
      setLoading(true)
      try {
        const typesParam = selectedTypes.includes('all') ? 'all' : selectedTypes.join(',')
        const response = await fetch(
          `/api/unified-search?q=${encodeURIComponent(query)}&types=${typesParam}&limit=50&include_chunks=true`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setResults(data.data.results || [])
            setTotalResults(data.data.total_results || 0)
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, selectedTypes])

  // Content type icons and colors
  const typeConfig = {
    knowledge: { icon: '📚', color: 'bg-blue-100 text-blue-800', label: 'Knowledge' },
    business_case: { icon: '💼', color: 'bg-green-100 text-green-800', label: 'Business Case' },
    tool: { icon: '🛠️', color: 'bg-purple-100 text-purple-800', label: 'Tool' },
    hoodie: { icon: '👕', color: 'bg-yellow-100 text-yellow-800', label: 'Hoodie' },
    video: { icon: '🎬', color: 'bg-red-100 text-red-800', label: 'Video' },
    content: { icon: '📄', color: 'bg-gray-100 text-gray-800', label: 'Content' }
  }

  const handleTypeFilter = (type: string) => {
    if (type === 'all') {
      setSelectedTypes(['all'])
    } else {
      const newTypes = selectedTypes.includes('all') 
        ? [type]
        : selectedTypes.includes(type)
          ? selectedTypes.filter(t => t !== type)
          : [...selectedTypes, type]
      
      setSelectedTypes(newTypes.length === 0 ? ['all'] : newTypes)
    }
  }

  const getResultSnippet = (content: string, query: string) => {
    const words = content.toLowerCase().split(' ')
    const queryWords = query.toLowerCase().split(' ')
    
    // Find first occurrence of any query word
    let startIndex = 0
    for (let i = 0; i < words.length; i++) {
      if (queryWords.some(qw => words[i].includes(qw))) {
        startIndex = Math.max(0, i - 10)
        break
      }
    }
    
    const snippet = words.slice(startIndex, startIndex + 30).join(' ')
    return snippet.length < content.length ? snippet + '...' : snippet
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2)
    let highlightedText = text
    
    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    })
    
    return highlightedText
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Searching knowledge universe...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600 mt-1">
              {totalResults.toLocaleString()} results found across all knowledge areas
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All Types' },
                    { key: 'knowledge', label: 'Knowledge' },
                    { key: 'business_case', label: 'Business Cases' },
                    { key: 'tool', label: 'Tools' },
                    { key: 'hoodie', label: 'Hoodies' },
                    { key: 'video', label: 'Videos' },
                    { key: 'content', label: 'Content' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleTypeFilter(key)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedTypes.includes(key)
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="type">Content Type</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use broader search terms</li>
              <li>Check spelling and try synonyms</li>
              <li>Remove filters to see more results</li>
              <li>Try searching for specific concepts like "mentoring" or "indigenous"</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => {
            const typeInfo = typeConfig[result.type] || typeConfig.content
            
            return (
              <div
                key={result.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Result Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div>
                      <h3 
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                        dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                      />
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        {result.cultural_sensitivity.includes('Indigenous') && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            🏛️ Indigenous Content
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>Relevance: {Math.round(result.relevance_score * 10) / 10}</div>
                    {result.semantic_score > 0 && (
                      <div>Semantic: {Math.round(result.semantic_score * 100)}%</div>
                    )}
                  </div>
                </div>

                {/* Result Content */}
                <div className="mb-4">
                  <p 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(
                        result.description || getResultSnippet(result.content, query), 
                        query
                      ) 
                    }}
                  />
                </div>

                {/* Metadata */}
                {result.metadata && Object.keys(result.metadata).length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {result.metadata.tags && result.metadata.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Items */}
                {result.related_items && result.related_items.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Related Content:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.related_items.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}