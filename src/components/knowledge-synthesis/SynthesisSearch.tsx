"use client"

import { useState, useEffect, useMemo } from 'react'

interface SearchResult {
  id: string
  title: string
  section: string
  content: string
  excerpt: string
  relevance: number
  concepts: string[]
  type: 'principle' | 'example' | 'framework' | 'story' | 'data'
}

interface SearchFilters {
  sections: string[]
  concepts: string[]
  types: string[]
}

// Real data integration - connects to framing API for actual content
const searchFramingAPI = async (rawQuery: string, limit: number = 50): Promise<SearchResult[]> => {
  try {
    // Clean and extract key terms from the search query
    const cleanedQuery = rawQuery
      .replace(/[?!.;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // Extract key terms by removing common question words
    const query = cleanedQuery
      .replace(/^(what|how|why|when|where|who)\s+(is|are|does|do|did|can|could|would|should)\s+/i, '')
      .replace(/^(what|how|why|when|where|who|is|are|does|do|did|can|could|would|should)\s+/i, '')
      .replace(/\s+(is|are|does|do|did|the|a|an)\s+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    const response = await fetch(`/api/framing?type=search&q=${encodeURIComponent(query)}&limit=${limit}`)
    const data = await response.json()
    
    if (data.success && data.data?.results) {
      const results = data.data.results.map((item: any, index: number) => ({
        id: item.id || `result-${index}`,
        title: item.title || 'Untitled Document',
        section: item.category || 'Knowledge Base',
        content: item.fullContent || item.contentPreview || '',
        excerpt: item.contentPreview ? item.contentPreview.substring(0, 200) + '...' : 
                (item.fullContent ? item.fullContent.substring(0, 200) + '...' : 'No description available'),
        relevance: item.relevance || (1 - index * 0.05), // Higher relevance for earlier results
        concepts: item.concepts || [],
        type: determineContentType(item)
      }))
      return results
    }
    return []
  } catch (error) {
    console.error('Error searching framing API:', error)
    return []
  }
}

const determineContentType = (item: any): 'principle' | 'example' | 'framework' | 'story' | 'data' => {
  const title = (item.title || '').toLowerCase()
  const content = (item.content || item.summary || '').toLowerCase()
  
  if (title.includes('principle') || content.includes('principle')) return 'principle'
  if (title.includes('framework') || title.includes('model') || content.includes('framework')) return 'framework'
  if (title.includes('story') || title.includes('journey') || content.includes('story')) return 'story'
  if (title.includes('data') || title.includes('$') || title.includes('metric')) return 'data'
  return 'example'
}

const availableSections = [
  'Indigenous Foundations',
  'AIME Methodology', 
  'Evolution & Growth Story',
  'Systems & Economics',
  'IMAGI-NATION Vision',
  'Implementation Pathways'
]

const availableConcepts = [
  'indigenous-wisdom',
  'relationship-building',
  'community-wellbeing',
  'systemic-change',
  'alternative-economics',
  'mentorship',
  'long-term-thinking',
  'community-ownership',
  'global-movement',
  'capacity-building'
]

const availableTypes = [
  'principle',
  'example', 
  'framework',
  'story',
  'data'
]

export default function SynthesisSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    sections: [],
    concepts: [],
    types: []
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Real search function using framing API
  const performSearch = useMemo(() => {
    return async (query: string, searchFilters: SearchFilters) => {
      if (!query.trim() && searchFilters.sections.length === 0 && searchFilters.concepts.length === 0 && searchFilters.types.length === 0) {
        return []
      }

      // Get results from framing API
      let filteredResults = await searchFramingAPI(query, 100)

      // Apply local filters to API results
      if (searchFilters.sections.length > 0) {
        filteredResults = filteredResults.filter(result => 
          searchFilters.sections.includes(result.section)
        )
      }

      if (searchFilters.concepts.length > 0) {
        filteredResults = filteredResults.filter(result => 
          result.concepts.some(concept => searchFilters.concepts.includes(concept))
        )
      }

      if (searchFilters.types.length > 0) {
        filteredResults = filteredResults.filter(result => 
          searchFilters.types.includes(result.type)
        )
      }

      // Sort by relevance
      return filteredResults.sort((a, b) => b.relevance - a.relevance)
    }
  }, [])

  // Perform search when query or filters change
  useEffect(() => {
    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await performSearch(searchQuery, filters)
        setResults(searchResults)
        
        // Add to search history
        if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
          setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filters, performSearch, searchHistory])

  const handleFilterChange = (filterType: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }))
  }

  const clearFilters = () => {
    setFilters({ sections: [], concepts: [], types: [] })
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'principle': return '🎯'
      case 'example': return '💡'
      case 'framework': return '🔧'
      case 'story': return '📖'
      case 'data': return '📊'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'principle': return 'bg-blue-100 text-blue-800'
      case 'example': return 'bg-green-100 text-green-800'
      case 'framework': return 'bg-purple-100 text-purple-800'
      case 'story': return 'bg-orange-100 text-orange-800'
      case 'data': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Synthesis Search</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Explore the interconnected knowledge within AIME's framework through intelligent search 
          and discovery. Find concepts, examples, principles, and stories across all sections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search and Filters Sidebar */}
        <div className="lg:col-span-1">
          {/* Search Input */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Knowledge Base
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for concepts, examples, stories..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
              <div className="space-y-1">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(query)}
                    className="text-sm text-blue-600 hover:text-blue-800 block"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Sections</h3>
            <div className="space-y-2">
              {availableSections.map(section => (
                <label key={section} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.sections.includes(section)}
                    onChange={(e) => handleFilterChange('sections', section, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{section}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Content Types</h3>
            <div className="space-y-2">
              {availableTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={(e) => handleFilterChange('types', type, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {getTypeIcon(type)} {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Concept Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Key Concepts</h3>
            <div className="space-y-2">
              {availableConcepts.slice(0, 6).map(concept => (
                <label key={concept} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.concepts.includes(concept)}
                    onChange={(e) => handleFilterChange('concepts', concept, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {concept.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.sections.length > 0 || filters.concepts.length > 0 || filters.types.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {results.length > 0 ? `${results.length} Results` : 'Search Results'}
              </h2>
              {(searchQuery || filters.sections.length > 0 || filters.concepts.length > 0 || filters.types.length > 0) && (
                <span className="text-sm text-gray-500">
                  {isSearching ? 'Searching...' : `Found ${results.length} matches`}
                </span>
              )}
            </div>
          </div>

          {/* No Results State */}
          {!isSearching && results.length === 0 && (searchQuery || filters.sections.length > 0 || filters.concepts.length > 0 || filters.types.length > 0) && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          )}

          {/* Default State */}
          {!isSearching && results.length === 0 && !searchQuery && filters.sections.length === 0 && filters.concepts.length === 0 && filters.types.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Explore AIME Knowledge</h3>
              <p className="text-gray-500 mb-6">
                Search for concepts, principles, examples, and stories across all sections of the knowledge synthesis.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Seven-Generation Thinking', 'Hoodie Economics', 'Joy Corps', 'Community Ownership'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map(result => (
                <div
                  key={result.id}
                  className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedResult?.id === result.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {highlightText(result.title, searchQuery)}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{result.section}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)} {result.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round(result.relevance * 100)}% match
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    {highlightText(result.excerpt, searchQuery)}
                  </p>
                  
                  {result.concepts.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.concepts.map(concept => (
                        <span
                          key={concept}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {concept.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected Result Detail */}
          {selectedResult && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Full Content</h3>
              <p className="text-blue-800">{selectedResult.content}</p>
              <div className="mt-4 flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Go to Section →
                </button>
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}