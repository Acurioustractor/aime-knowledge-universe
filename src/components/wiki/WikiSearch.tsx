"use client"

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface WikiSearchProps {
  onSearch: (query: string) => void
  initialQuery?: string
}

export default function WikiSearch({ onSearch, initialQuery = '' }: WikiSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isExpanded, setIsExpanded] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Popular search suggestions
  const popularSearches = [
    'indigenous systems thinking',
    'hoodie economics',
    'mentoring methodology',
    'joy corps transformation',
    'seven generation thinking',
    'imagination curriculum',
    'business case studies',
    'cultural protocols',
    'reverse mentoring',
    'organizational change',
    'impact measurement',
    'digital hoodies'
  ]

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 1) {
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions(popularSearches.slice(0, 6))
      setShowSuggestions(isExpanded)
    }
  }, [query, isExpanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
      setIsExpanded(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    setIsExpanded(false)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsExpanded(true)
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    // Delay to allow suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setIsExpanded(false)
    }, 200)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center transition-all duration-200 ${
          isExpanded ? 'w-80' : 'w-64'
        }`}>
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search all knowledge..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {query.length > 1 && (
              <div className="p-3 border-b border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Search for "{query}"
                </div>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(query)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                    <span>Search for "<strong>{query}</strong>"</span>
                  </div>
                </button>
              </div>
            )}

            <div className="p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {query.length > 1 ? 'Related Searches' : 'Popular Searches'}
              </div>
              
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-md text-sm text-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick filters */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Quick Filters
              </div>
              <div className="flex flex-wrap gap-2">
                {['Business Cases', 'Tools', 'Videos', 'Hoodies', 'Indigenous Knowledge'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleSuggestionClick(filter.toLowerCase())}
                    className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}