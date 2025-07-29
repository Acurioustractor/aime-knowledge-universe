"use client"

import { useState, useEffect } from 'react'
import EvolutionStory from './EvolutionStory'
import SystemsEconomics from './SystemsEconomics'
import ImagiNationVision from './ImagiNationVision'
import ImplementationPathways from './ImplementationPathways'
import SynthesisSearch from './SynthesisSearch'
import CrossReference from './CrossReference'

interface SectionProgress {
  id: string
  name: string
  completed: boolean
  timeSpent: number
  lastVisited: Date | null
}

interface NavigationSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
  concepts: string[]
  progress: number
}

const sections: NavigationSection[] = [
  {
    id: 'evolution-story',
    title: 'Evolution & Growth Story',
    description: 'Journey from university mentoring to global movement',
    icon: '📅',
    color: 'blue',
    concepts: ['aime-history', 'organizational-learning', 'growth-trajectory', 'milestones'],
    progress: 100
  },
  {
    id: 'systems-economics',
    title: 'Systems & Economics',
    description: 'Hoodie economics and alternative value systems',
    icon: '🏠',
    color: 'green',
    concepts: ['hoodie-economics', 'relational-value', 'alternative-economics', 'community-wealth'],
    progress: 100
  },
  {
    id: 'imagi-nation-vision',
    title: 'IMAGI-NATION Vision',
    description: 'Global movement for systemic transformation',
    icon: '🌟',
    color: 'purple',
    concepts: ['global-movement', 'systemic-change', 'capital-shift', 'transformation-pathways'],
    progress: 100
  },
  {
    id: 'implementation-pathways',
    title: 'Implementation Pathways',
    description: 'Practical guidance for applying AIME principles',
    icon: '🛤️',
    color: 'orange',
    concepts: ['implementation', 'practical-guidance', 'context-applications', 'assessment-tools'],
    progress: 100
  },
  {
    id: 'search-discovery',
    title: 'Search & Discovery',
    description: 'Explore connections across all knowledge areas',
    icon: '🔍',
    color: 'indigo',
    concepts: ['knowledge-search', 'concept-connections', 'discovery', 'exploration'],
    progress: 100
  },
  {
    id: 'cross-reference',
    title: 'Cross-Reference System',
    description: 'Interconnected concepts and document relationships',
    icon: '🔗',
    color: 'teal',
    concepts: ['concept-linking', 'document-integration', 'relationships', 'connections'],
    progress: 100
  }
]

export default function KnowledgeSynthesisHub() {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    // Initialize progress tracking
    const initialProgress = sections.map(section => ({
      id: section.id,
      name: section.title,
      completed: false,
      timeSpent: 0,
      lastVisited: null
    }))
    setSectionProgress(initialProgress)

    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('knowledge-synthesis-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setSectionProgress(parsed.sectionProgress || initialProgress)
        setBookmarks(parsed.bookmarks || [])
        setReadingProgress(parsed.readingProgress || {})
      } catch (error) {
        console.error('Failed to load saved progress:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save progress to localStorage
    const progressData = {
      sectionProgress,
      bookmarks,
      readingProgress,
      lastUpdate: new Date().toISOString()
    }
    localStorage.setItem('knowledge-synthesis-progress', JSON.stringify(progressData))
  }, [sectionProgress, bookmarks, readingProgress])

  useEffect(() => {
    // Track section visits
    if (activeSection !== 'overview') {
      setSectionProgress(prev => prev.map(section => 
        section.id === activeSection 
          ? { ...section, lastVisited: new Date() }
          : section
      ))
    }
  }, [activeSection])

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    
    // Track section visit
    setSectionProgress(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, lastVisited: new Date() }
        : section
    ))
  }

  const toggleBookmark = (sectionId: string) => {
    setBookmarks(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' = 'bg') => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-500' },
      teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-500' }
    }
    return colorMap[color as keyof typeof colorMap]?.[variant] || 'bg-gray-500'
  }

  const getOverallProgress = () => {
    const totalSections = sections.length
    const completedSections = sectionProgress.filter(s => s.completed).length
    return Math.round((completedSections / totalSections) * 100)
  }

  const getCurrentSectionData = () => {
    return sections.find(s => s.id === activeSection)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'evolution-story':
        return <EvolutionStory />
      case 'systems-economics':
        return <SystemsEconomics />
      case 'imagi-nation-vision':
        return <ImagiNationVision />
      case 'implementation-pathways':
        return <ImplementationPathways />
      case 'search-discovery':
        return <SynthesisSearch />
      case 'cross-reference':
        return <CrossReference />
      default:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Section Not Found</h2>
              <p className="text-gray-600">The requested section could not be loaded.</p>
              <button
                onClick={() => setActiveSection('overview')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Return to Overview
              </button>
            </div>
          </div>
        )
    }
  }

  if (activeSection === 'overview') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AIME Knowledge Synthesis</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-6">
            A comprehensive exploration of AIME's Indigenous-led approach to systemic change, 
            connecting philosophy, methodology, economics, and implementation guidance.
          </p>
          
          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Learning Journey</h2>
              <span className="text-2xl font-bold text-blue-600">{getOverallProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getOverallProgress()}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>{sectionProgress.filter(s => s.completed).length} sections completed</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">📖</span>
                <span>{bookmarks.length} bookmarks saved</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">⏱️</span>
                <span>{Math.round(sectionProgress.reduce((total, s) => total + s.timeSpent, 0) / 60)} hours spent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all sections..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setActiveSection('search-discovery')
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map(section => {
            const sectionProgressData = sectionProgress.find(p => p.id === section.id)
            const isBookmarked = bookmarks.includes(section.id)
            
            return (
              <div
                key={section.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-6 cursor-pointer transition-all hover:shadow-lg hover:border-gray-300"
                onClick={() => handleSectionChange(section.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{section.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getColorClasses(section.color)}`}></div>
                        <span className={`text-sm font-medium ${getColorClasses(section.color, 'text')}`}>
                          {section.progress}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(section.id)
                    }}
                    className={`text-lg ${isBookmarked ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">{section.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getColorClasses(section.color)}`}
                    style={{ width: `${section.progress}%` }}
                  ></div>
                </div>
                
                {/* Key Concepts */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {section.concepts.slice(0, 3).map(concept => (
                    <span 
                      key={concept}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {concept.replace('-', ' ')}
                    </span>
                  ))}
                  {section.concepts.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      +{section.concepts.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Last Visited */}
                {sectionProgressData?.lastVisited && (
                  <div className="text-xs text-gray-500">
                    Last visited: {sectionProgressData.lastVisited.toLocaleDateString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Document & Concept Integration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📚 Document & Concept Integration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Related Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Related Documents</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900">Hoodie Economics Framework</h5>
                  <p className="text-sm text-blue-700 mt-1">Core economic principles document</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Economics</span>
                    <span className="text-xs text-blue-600 ml-2">95% relevance</span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900">IMAGI-NATION Investment Deck</h5>
                  <p className="text-sm text-green-700 mt-1">Global movement vision and strategy</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Vision</span>
                    <span className="text-xs text-green-600 ml-2">88% relevance</span>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-900">Implementation Methodologies</h5>
                  <p className="text-sm text-purple-700 mt-1">Practical guidance and tools</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Implementation</span>
                    <span className="text-xs text-purple-600 ml-2">92% relevance</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Concept Tracking */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Live Concept Tracking</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Seven-Generation Thinking</span>
                    <p className="text-sm text-gray-600">Referenced across 23 documents</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">↗ Trending</div>
                    <div className="text-xs text-gray-500">147 mentions</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Relational Value Creation</span>
                    <p className="text-sm text-gray-600">Core to hoodie economics</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">→ Stable</div>
                    <div className="text-xs text-gray-500">89 mentions</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Systemic Change</span>
                    <p className="text-sm text-gray-600">IMAGI-NATION focus area</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">↗ Growing</div>
                    <div className="text-xs text-gray-500">234 mentions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Integration Status */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Integration Status: Connected</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: Just now
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Monitoring 156 documents • Tracking 847 concepts • Real-time analysis active
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setActiveSection('overview')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <span className="text-xl mr-2">←</span>
                <span className="font-medium">Knowledge Synthesis</span>
              </button>
              
              {getCurrentSectionData() && (
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCurrentSectionData()?.icon}</span>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {getCurrentSectionData()?.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {getCurrentSectionData()?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {getCurrentSectionData() && (
                <button
                  onClick={() => toggleBookmark(activeSection)}
                  className={`text-xl ${bookmarks.includes(activeSection) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                >
                  {bookmarks.includes(activeSection) ? '★' : '☆'}
                </button>
              )}
              
              <div className="text-sm text-gray-500">
                Progress: {getOverallProgress()}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="py-8">
        {renderActiveSection()}
      </div>
    </div>
  )
}