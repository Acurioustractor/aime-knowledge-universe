"use client"

import { useState, useEffect } from 'react'
import { ChevronRightIcon, BookOpenIcon, LightBulbIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface FramingDocument {
  id: string
  title: string
  category: string
  concepts: string[]
  keyQuotes: string[]
  summary: string
  readingTime: number
  metadata: {
    wordCount: number
    urgencyLevel: number
  }
}

interface FramingOverview {
  summary: {
    totalDocuments: number
    totalConcepts: number
    categories: number
  }
  topConcepts: Array<{
    name: string
    frequency: number
    categories: string[]
  }>
  categories: Array<{
    name: string
    documentCount: number
    uniqueConcepts: number
  }>
}

export default function UnderstandingPage() {
  const [overview, setOverview] = useState<FramingOverview | null>(null)
  const [documents, setDocuments] = useState<FramingDocument[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<FramingDocument | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'category' | 'document'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOverview()
  }, [])

  useEffect(() => {
    if (selectedCategory !== 'all') {
      loadDocuments(selectedCategory)
    }
  }, [selectedCategory])

  const loadOverview = async () => {
    try {
      const response = await fetch('/api/framing?type=overview&limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOverview(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load overview:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async (category: string) => {
    try {
      const url = category === 'all' 
        ? '/api/framing?type=documents&limit=50'
        : `/api/framing?type=documents&category=${category}&limit=50`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDocuments(data.data.documents)
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  const loadFullDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/framing?type=document&id=${docId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSelectedDocument(data.data.document)
          setViewMode('document')
        }
      }
    } catch (error) {
      console.error('Failed to load document:', error)
    }
  }

  const getCategoryInfo = (category: string) => {
    const info = {
      vision: {
        icon: '🎯',
        title: 'Vision & Philosophy',
        description: 'Core philosophical foundations and organizational purpose',
        color: 'bg-purple-50 border-purple-200 text-purple-900'
      },
      economic: {
        icon: '💰',
        title: 'Economic Framework',
        description: 'Alternative economic systems and transformation models',
        color: 'bg-green-50 border-green-200 text-green-900'
      },
      strategic: {
        icon: '🚀',
        title: 'Strategic Implementation',
        description: 'Strategic approaches and scaling methodologies',
        color: 'bg-blue-50 border-blue-200 text-blue-900'
      },
      operational: {
        icon: '⚙️',
        title: 'Operational Context',
        description: 'Day-to-day execution and operational frameworks',
        color: 'bg-orange-50 border-orange-200 text-orange-900'
      },
      communication: {
        icon: '📢',
        title: 'Communication & Engagement',
        description: 'Public engagement and communication strategies',
        color: 'bg-pink-50 border-pink-200 text-pink-900'
      }
    }
    return info[category as keyof typeof info] || {
      icon: '📄',
      title: category,
      description: 'Document category',
      color: 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AIME's philosophical framework...</p>
        </div>
      </div>
    )
  }

  // Overview Mode
  if (viewMode === 'overview' && overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
                Understanding AIME
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                A journey through the philosophical frameworks, economic models, and strategic visions 
                that guide AIME's mission to transform systems through Indigenous custodianship.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {overview.summary.totalDocuments}
                  </div>
                  <div className="text-gray-600">Foundational Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {overview.summary.totalConcepts}
                  </div>
                  <div className="text-gray-600">Key Concepts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {overview.summary.categories}
                  </div>
                  <div className="text-gray-600">Framework Areas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Concepts */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Concepts</h2>
            <p className="text-lg text-gray-600">
              The fundamental ideas that shape AIME's approach to systems transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {overview.topConcepts.slice(0, 6).map((concept, index) => (
              <div key={concept.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="text-sm text-gray-500">
                    {concept.frequency} documents
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                  {concept.name.replace(/-/g, ' ')}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {concept.categories.slice(0, 3).map(cat => {
                    const catInfo = getCategoryInfo(cat)
                    return (
                      <span key={cat} className={`px-2 py-1 rounded-full text-xs font-medium border ${catInfo.color}`}>
                        {catInfo.icon} {catInfo.title}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Framework Categories */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Framework Areas</h2>
            <p className="text-lg text-gray-600">
              Explore AIME's philosophy through different lenses and perspectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {overview.categories.map((category) => {
              const catInfo = getCategoryInfo(category.name)
              return (
                <div
                  key={category.name}
                  className={`rounded-xl border-2 p-8 cursor-pointer hover:shadow-lg transition-all duration-300 ${catInfo.color}`}
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setViewMode('category')
                    loadDocuments(category.name)
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{catInfo.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{catInfo.title}</h3>
                    <p className="text-sm mb-4 opacity-80">{catInfo.description}</p>
                    
                    <div className="flex justify-center items-center space-x-4 text-sm">
                      <span>{category.documentCount} documents</span>
                      <span>•</span>
                      <span>{category.uniqueConcepts} concepts</span>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center text-sm font-medium">
                      Explore <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Category Mode
  if (viewMode === 'category' && selectedCategory !== 'all') {
    const catInfo = getCategoryInfo(selectedCategory)
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <div className={`${catInfo.color} border-b`}>
          <div className="max-w-7xl mx-auto px-6 py-12">
            <button
              onClick={() => setViewMode('overview')}
              className="flex items-center text-sm mb-6 opacity-80 hover:opacity-100 transition-opacity"
            >
              ← Back to Overview
            </button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-5xl">{catInfo.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{catInfo.title}</h1>
                <p className="text-lg opacity-80 mt-2">{catInfo.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span>{documents.length} documents</span>
              <span>•</span>
              <span>Foundational frameworks and insights</span>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadFullDocument(doc.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                    {doc.readingTime} min read
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {doc.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.concepts.slice(0, 3).map(concept => (
                    <span key={concept} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {concept}
                    </span>
                  ))}
                  {doc.concepts.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                      +{doc.concepts.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{doc.metadata.wordCount.toLocaleString()} words</span>
                  <div className="flex items-center">
                    Read full document <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Document Mode
  if (viewMode === 'document' && selectedDocument) {
    return (
      <div className="min-h-screen bg-white">
        {/* Document Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={() => setViewMode('category')}
              className="flex items-center text-sm text-gray-600 mb-6 hover:text-gray-900 transition-colors"
            >
              ← Back to {getCategoryInfo(selectedDocument.category).title}
            </button>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl">{getCategoryInfo(selectedDocument.category).icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedDocument.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <span>{selectedDocument.readingTime} minute read</span>
                  <span>•</span>
                  <span>{selectedDocument.metadata.wordCount.toLocaleString()} words</span>
                  <span>•</span>
                  <span className="capitalize">{selectedDocument.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedDocument.concepts.map(concept => (
                <span key={concept} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Document Summary</h3>
              <p className="text-blue-800">{selectedDocument.summary}</p>
            </div>
            
            {selectedDocument.keyQuotes && selectedDocument.keyQuotes.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-4">
                  {selectedDocument.keyQuotes.slice(0, 3).map((quote, index) => (
                    <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
                      {quote.replace(/"/g, '')}
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {(selectedDocument as any).fullContent}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}