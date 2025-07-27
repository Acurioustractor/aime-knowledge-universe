"use client"

import { useState, useEffect, useCallback } from 'react'
import { ContentItem } from '@/lib/content-integration/models/content-item'

interface NewsletterFiltersProps {
  newsletters: ContentItem[]
  onFilterChange: (filteredNewsletters: ContentItem[]) => void
}

interface FilterState {
  searchQuery: string
  dateRange: {
    from: string
    to: string
  }
  themes: string[]
  newsletterTypes: string[]
  authors: string[]
  sortBy: 'date' | 'title' | 'openRate'
  sortOrder: 'asc' | 'desc'
}

export default function NewsletterFilters({ newsletters, onFilterChange }: NewsletterFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateRange: { from: '', to: '' },
    themes: [],
    newsletterTypes: [],
    authors: [],
    sortBy: 'date',
    sortOrder: 'desc'
  })

  const [isExpanded, setIsExpanded] = useState(false)

  // Extract unique values for filter options
  const availableThemes = Array.from(
    new Set(newsletters.flatMap(n => n.themes?.map(t => t.name) || []))
  ).sort()

  const availableNewsletterTypes = Array.from(
    new Set(newsletters.map(n => n.metadata?.newsletterType || 'general').filter(Boolean))
  ).sort()

  const availableAuthors = Array.from(
    new Set(newsletters.flatMap(n => n.authors || []))
  ).sort()

  // Get date range for newsletters
  const newsletterDates = newsletters
    .map(n => n.date)
    .filter(Boolean)
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime())

  const minDate = newsletterDates.length > 0 
    ? newsletterDates[0].toISOString().split('T')[0] 
    : ''
  const maxDate = newsletterDates.length > 0 
    ? newsletterDates[newsletterDates.length - 1].toISOString().split('T')[0] 
    : ''

  // Memoized filter function to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    let filtered = [...newsletters]

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(newsletter =>
        newsletter.title.toLowerCase().includes(query) ||
        newsletter.description.toLowerCase().includes(query) ||
        newsletter.content?.toLowerCase().includes(query) ||
        newsletter.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(newsletter => {
        if (!newsletter.date) return false
        const newsletterDate = new Date(newsletter.date)
        const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null

        if (fromDate && newsletterDate < fromDate) return false
        if (toDate && newsletterDate > toDate) return false
        return true
      })
    }

    // Theme filter
    if (filters.themes.length > 0) {
      filtered = filtered.filter(newsletter =>
        newsletter.themes?.some(theme => filters.themes.includes(theme.name))
      )
    }

    // Newsletter type filter
    if (filters.newsletterTypes.length > 0) {
      filtered = filtered.filter(newsletter =>
        filters.newsletterTypes.includes(newsletter.metadata?.newsletterType || 'general')
      )
    }

    // Author filter
    if (filters.authors.length > 0) {
      filtered = filtered.filter(newsletter =>
        newsletter.authors?.some(author => filters.authors.includes(author))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case 'date':
          aValue = a.date ? new Date(a.date).getTime() : 0
          bValue = b.date ? new Date(b.date).getTime() : 0
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'openRate':
          aValue = a.metadata?.openRate || 0
          bValue = b.metadata?.openRate || 0
          break
        default:
          aValue = 0
          bValue = 0
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [filters, newsletters])

  // Apply filters whenever filters change
  useEffect(() => {
    const filtered = applyFilters()
    onFilterChange(filtered)
  }, [applyFilters, onFilterChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'themes' | 'newsletterTypes' | 'authors', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      dateRange: { from: '', to: '' },
      themes: [],
      newsletterTypes: [],
      authors: [],
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.themes.length > 0 ||
    filters.newsletterTypes.length > 0 ||
    filters.authors.length > 0

  return (
    <div className="bg-white border border-gray-300 mb-6">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-black">Filter Newsletters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 border border-blue-200">
              {filters.themes.length + filters.newsletterTypes.length + filters.authors.length + 
               (filters.searchQuery ? 1 : 0) + (filters.dateRange.from || filters.dateRange.to ? 1 : 0)} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search newsletters by title, content, or tags..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange.from}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange.to}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="openRate">Open Rate</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value)}
                className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Newsletter Types */}
          {availableNewsletterTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Type</label>
              <div className="flex flex-wrap gap-2">
                {availableNewsletterTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleArrayFilter('newsletterTypes', type)}
                    className={`px-3 py-1 text-sm border transition-colors ${
                      filters.newsletterTypes.includes(type)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Themes */}
          {availableThemes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Themes</label>
              <div className="flex flex-wrap gap-2">
                {availableThemes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => toggleArrayFilter('themes', theme)}
                    className={`px-3 py-1 text-sm border transition-colors ${
                      filters.themes.includes(theme)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {availableAuthors.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authors</label>
              <div className="flex flex-wrap gap-2">
                {availableAuthors.map(author => (
                  <button
                    key={author}
                    onClick={() => toggleArrayFilter('authors', author)}
                    className={`px-3 py-1 text-sm border transition-colors ${
                      filters.authors.includes(author)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}