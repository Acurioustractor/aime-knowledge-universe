"use client"

import { useState, useEffect } from 'react'
import WikiSidebar from '@/components/wiki/WikiSidebar'
import WikiContent from '@/components/wiki/WikiContent'
import WikiSearch from '@/components/wiki/WikiSearch'
import WikiBreadcrumbs from '@/components/wiki/WikiBreadcrumbs'
import { FramingProvider } from '@/components/framing/FramingContext'

interface WikiPageProps {
  searchParams?: {
    section?: string;
    page?: string;
    search?: string;
  }
}

export default function WikiPage({ searchParams }: WikiPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentSection, setCurrentSection] = useState(searchParams?.section || 'overview')
  const [currentPage, setCurrentPage] = useState(searchParams?.page || 'introduction')
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || '')
  const [searchMode, setSearchMode] = useState(!!searchParams?.search)

  // Handle navigation
  const handleNavigation = (section: string, page?: string) => {
    setCurrentSection(section)
    setCurrentPage(page || 'overview')
    setSearchMode(false)
    setSearchQuery('')
    
    // Update URL without page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('section', section)
      if (page) url.searchParams.set('page', page)
      url.searchParams.delete('search')
      window.history.pushState({}, '', url.toString())
    }
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSearchMode(!!query)
    
    // Update URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (query) {
        url.searchParams.set('search', query)
        url.searchParams.delete('section')
        url.searchParams.delete('page')
      } else {
        url.searchParams.delete('search')
      }
      window.history.pushState({}, '', url.toString())
    }
  }

  return (
    <FramingProvider>
      <div className="min-h-screen bg-white">
      {/* Wiki Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AIME Knowledge Wiki</h1>
                <p className="text-sm text-gray-500">Complete knowledge repository</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <WikiSearch 
              onSearch={handleSearch}
              initialQuery={searchQuery}
            />
            
            <div className="text-sm text-gray-500">
              2,700+ resources
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {!searchMode && (
          <WikiBreadcrumbs 
            section={currentSection}
            page={currentPage}
            onNavigate={handleNavigation}
          />
        )}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <WikiSidebar
          isOpen={sidebarOpen}
          currentSection={currentSection}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          searchMode={searchMode}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <WikiContent
            section={currentSection}
            page={currentPage}
            searchQuery={searchQuery}
            searchMode={searchMode}
            onNavigate={handleNavigation}
          />
        </main>
      </div>
    </div>
    </FramingProvider>
  )
}