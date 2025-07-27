"use client"

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface WikiSection {
  id: string
  title: string
  icon: string
  description: string
  pages: WikiPage[]
  expanded?: boolean
}

interface WikiPage {
  id: string
  title: string
  description?: string
  contentTypes?: string[]
  count?: number
}

interface WikiSidebarProps {
  isOpen: boolean
  currentSection: string
  currentPage: string
  onNavigate: (section: string, page?: string) => void
  searchMode: boolean
}

export default function WikiSidebar({ 
  isOpen, 
  currentSection, 
  currentPage, 
  onNavigate, 
  searchMode 
}: WikiSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([currentSection]))

  const wikiStructure: WikiSection[] = [
    {
      id: 'overview',
      title: 'Getting Started',
      icon: '🏠',
      description: 'Introduction to AIME knowledge',
      pages: [
        { id: 'introduction', title: 'Introduction', description: 'Welcome to AIME Knowledge Universe' },
        { id: 'philosophy', title: 'Our Philosophy', description: 'Indigenous wisdom and systems thinking' },
        { id: 'how-to-use', title: 'How to Use This Wiki', description: 'Navigation and search guide' },
        { id: 'quick-start', title: 'Quick Start Guide', description: 'Jump into key concepts' }
      ]
    },
    {
      id: 'indigenous-knowledge',
      title: 'Indigenous Knowledge Systems',
      icon: '🏛️',
      description: 'Traditional wisdom and protocols',
      pages: [
        { id: 'overview', title: 'Overview', contentTypes: ['knowledge', 'business_case'], count: 45 },
        { id: 'systems-thinking', title: 'Indigenous Systems Thinking', contentTypes: ['knowledge', 'tool'], count: 23 },
        { id: 'protocols', title: 'Cultural Protocols', contentTypes: ['knowledge'], count: 18 },
        { id: 'seven-generation', title: 'Seven Generation Thinking', contentTypes: ['knowledge', 'business_case'], count: 12 },
        { id: 'connection-to-country', title: 'Connection to Country', contentTypes: ['knowledge', 'video'], count: 31 },
        { id: 'storytelling', title: 'Indigenous Storytelling', contentTypes: ['knowledge', 'video', 'tool'], count: 27 }
      ]
    },
    {
      id: 'mentoring',
      title: 'Mentoring & Education',
      icon: '🎓',
      description: 'Educational approaches and mentoring',
      pages: [
        { id: 'overview', title: 'Mentoring Overview', contentTypes: ['knowledge', 'business_case'], count: 67 },
        { id: 'methodology', title: 'AIME Methodology', contentTypes: ['knowledge', 'tool'], count: 34 },
        { id: 'reverse-mentoring', title: 'Reverse Mentoring', contentTypes: ['knowledge', 'business_case'], count: 19 },
        { id: 'imagination-curriculum', title: 'Imagination Curriculum', contentTypes: ['knowledge', 'tool'], count: 42 },
        { id: 'university-partnerships', title: 'University Partnerships', contentTypes: ['business_case'], count: 28 },
        { id: 'impact-measurement', title: 'Impact Measurement', contentTypes: ['knowledge', 'tool'], count: 15 }
      ]
    },
    {
      id: 'hoodie-economics',
      title: 'Hoodie Economics',
      icon: '👕',
      description: 'Alternative economic systems',
      pages: [
        { id: 'overview', title: 'What is Hoodie Economics?', contentTypes: ['knowledge', 'business_case'], count: 38 },
        { id: 'imagination-credits', title: 'Imagination Credits', contentTypes: ['hoodie', 'tool'], count: 156 },
        { id: 'trading-system', title: 'Hoodie Trading System', contentTypes: ['hoodie', 'tool'], count: 89 },
        { id: 'value-creation', title: 'Value Creation Models', contentTypes: ['business_case', 'knowledge'], count: 24 },
        { id: 'digital-economy', title: 'Digital Economy Integration', contentTypes: ['tool', 'business_case'], count: 17 },
        { id: 'case-studies', title: 'Implementation Case Studies', contentTypes: ['business_case'], count: 31 }
      ]
    },
    {
      id: 'systems-change',
      title: 'Systems Change',
      icon: '🔄',
      description: 'Organizational and social transformation',
      pages: [
        { id: 'overview', title: 'Systems Change Overview', contentTypes: ['knowledge', 'business_case'], count: 52 },
        { id: 'joy-corps', title: 'Joy Corps Transformation', contentTypes: ['knowledge', 'business_case'], count: 29 },
        { id: 'organizational-change', title: 'Organizational Change', contentTypes: ['business_case', 'tool'], count: 41 },
        { id: 'leadership-models', title: 'Indigenous Leadership Models', contentTypes: ['knowledge', 'business_case'], count: 33 },
        { id: 'network-effects', title: 'Network Effects & Scaling', contentTypes: ['knowledge', 'tool'], count: 18 },
        { id: 'measurement-frameworks', title: 'Change Measurement', contentTypes: ['tool'], count: 22 }
      ]
    },
    {
      id: 'tools-frameworks',
      title: 'Tools & Frameworks',
      icon: '🛠️',
      description: 'Practical implementation resources',
      pages: [
        { id: 'overview', title: 'All Tools', contentTypes: ['tool'], count: 234 },
        { id: 'assessment-tools', title: 'Assessment Tools', contentTypes: ['tool'], count: 45 },
        { id: 'planning-frameworks', title: 'Planning Frameworks', contentTypes: ['tool'], count: 38 },
        { id: 'facilitation-guides', title: 'Facilitation Guides', contentTypes: ['tool'], count: 52 },
        { id: 'evaluation-methods', title: 'Evaluation Methods', contentTypes: ['tool'], count: 29 },
        { id: 'digital-tools', title: 'Digital Tools', contentTypes: ['tool'], count: 67 }
      ]
    },
    {
      id: 'business-cases',
      title: 'Business Cases',
      icon: '💼',
      description: 'Real-world implementations',
      pages: [
        { id: 'overview', title: 'All Business Cases', contentTypes: ['business_case'], count: 156 },
        { id: 'education-sector', title: 'Education Sector', contentTypes: ['business_case'], count: 67 },
        { id: 'corporate-partnerships', title: 'Corporate Partnerships', contentTypes: ['business_case'], count: 43 },
        { id: 'government-initiatives', title: 'Government Initiatives', contentTypes: ['business_case'], count: 28 },
        { id: 'community-programs', title: 'Community Programs', contentTypes: ['business_case'], count: 52 },
        { id: 'international-expansion', title: 'International Expansion', contentTypes: ['business_case'], count: 19 }
      ]
    },
    {
      id: 'media-content',
      title: 'Media & Content',
      icon: '🎬',
      description: 'Videos, newsletters, and media',
      pages: [
        { id: 'overview', title: 'All Media', contentTypes: ['video', 'content'], count: 892 },
        { id: 'video-library', title: 'Video Library', contentTypes: ['video'], count: 423 },
        { id: 'newsletters', title: 'Newsletter Archive', contentTypes: ['content'], count: 561 },
        { id: 'podcasts', title: 'Podcasts & Audio', contentTypes: ['content'], count: 78 },
        { id: 'presentations', title: 'Presentations', contentTypes: ['tool'], count: 134 },
        { id: 'publications', title: 'Publications & Reports', contentTypes: ['knowledge'], count: 89 }
      ]
    },
    {
      id: 'research',
      title: 'Research & Insights',
      icon: '🔬',
      description: 'Academic research and data',
      pages: [
        { id: 'overview', title: 'Research Overview', contentTypes: ['knowledge'], count: 78 },
        { id: 'impact-studies', title: 'Impact Studies', contentTypes: ['knowledge'], count: 34 },
        { id: 'methodology-research', title: 'Methodology Research', contentTypes: ['knowledge'], count: 23 },
        { id: 'longitudinal-studies', title: 'Longitudinal Studies', contentTypes: ['knowledge'], count: 12 },
        { id: 'comparative-analysis', title: 'Comparative Analysis', contentTypes: ['knowledge'], count: 18 },
        { id: 'future-research', title: 'Future Research Directions', contentTypes: ['knowledge'], count: 15 }
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Auto-expand current section
  useEffect(() => {
    setExpandedSections(prev => new Set([...prev, currentSection]))
  }, [currentSection])

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-[73px] w-80 h-[calc(100vh-73px)] bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Search mode indicator */}
        {searchMode && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">Search Mode Active</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">Clear search to browse by sections</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {wikiStructure.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const isCurrentSection = currentSection === section.id

            return (
              <div key={section.id}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    isCurrentSection 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>

                {/* Section Pages */}
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.pages.map((page) => {
                      const isCurrentPage = currentSection === section.id && currentPage === page.id

                      return (
                        <button
                          key={page.id}
                          onClick={() => onNavigate(section.id, page.id)}
                          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                            isCurrentPage
                              ? 'bg-blue-50 text-blue-900 border-l-2 border-blue-500'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{page.title}</span>
                            {page.count && (
                              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                                {page.count}
                              </span>
                            )}
                          </div>
                          
                          {page.description && (
                            <div className="text-xs text-gray-500 mt-1">{page.description}</div>
                          )}
                          
                          {page.contentTypes && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {page.contentTypes.map((type) => (
                                <span
                                  key={type}
                                  className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600"
                                >
                                  {type.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer Stats */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Knowledge Stats</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Resources:</span>
              <span className="font-medium">2,700+</span>
            </div>
            <div className="flex justify-between">
              <span>Business Cases:</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span>Tools & Frameworks:</span>
              <span className="font-medium">234</span>
            </div>
            <div className="flex justify-between">
              <span>Video Content:</span>
              <span className="font-medium">423</span>
            </div>
            <div className="flex justify-between">
              <span>Hoodies Available:</span>
              <span className="font-medium">100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}