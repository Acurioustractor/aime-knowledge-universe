"use client"

import { useState, useEffect } from 'react'
import { useFraming } from '../framing/FramingContext'
import ConceptTooltip from '../framing/ConceptTooltip'

interface DocumentConnection {
  id: string
  title: string
  category: string
  summary: string
  concepts: string[]
  keyQuotes: string[]
  readingTime: number
  relevanceScore: number
}

interface ConceptFrequency {
  name: string
  frequency: number
  categories: string[]
  trend: 'increasing' | 'stable' | 'decreasing'
  synthesisRelevance: number
}

interface FramingIntegrationProps {
  currentSection?: string
  sectionConcepts?: string[]
}

export default function FramingIntegration({ currentSection, sectionConcepts = [] }: FramingIntegrationProps) {
  const { concepts, isFramingLoaded, getConceptInfo, relatedConcepts } = useFraming()
  const [documentConnections, setDocumentConnections] = useState<DocumentConnection[]>([])
  const [conceptFrequencies, setConceptFrequencies] = useState<ConceptFrequency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<DocumentConnection | null>(null)

  useEffect(() => {
    if (isFramingLoaded) {
      loadDocumentConnections()
      loadConceptFrequencies()
    }
  }, [isFramingLoaded, currentSection, sectionConcepts])

  const loadDocumentConnections = async () => {
    try {
      setIsLoading(true)
      
      // Build search query from section concepts
      const searchConcepts = sectionConcepts.length > 0 ? sectionConcepts : ['aime', 'indigenous', 'mentoring']
      
      // Fetch documents for each concept and combine results
      const allDocuments: DocumentConnection[] = []
      
      for (const concept of searchConcepts) {
        const response = await fetch(`/api/framing?type=search&q=${encodeURIComponent(concept)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            data.data.results.forEach((doc: any) => {
              // Calculate relevance score based on concept overlap
              const conceptOverlap = doc.concepts.filter((c: string) => 
                sectionConcepts.some(sc => c.toLowerCase().includes(sc.toLowerCase()))
              ).length
              
              const relevanceScore = conceptOverlap / Math.max(sectionConcepts.length, 1)
              
              // Avoid duplicates and add with relevance score
              if (!allDocuments.find(d => d.id === doc.id)) {
                allDocuments.push({
                  id: doc.id,
                  title: doc.title,
                  category: doc.category,
                  summary: doc.summary || 'Document summary not available',
                  concepts: doc.concepts,
                  keyQuotes: doc.keyQuotes || [],
                  readingTime: doc.readingTime || 5,
                  relevanceScore
                })
              }
            })
          }
        }
      }
      
      // Sort by relevance and take top results
      const sortedDocuments = allDocuments
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 8)
      
      setDocumentConnections(sortedDocuments)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load document connections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadConceptFrequencies = async () => {
    try {
      const response = await fetch('/api/framing?type=concepts&limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Enrich concepts with synthesis relevance
          const enrichedConcepts = data.data.concepts.map((concept: any) => {
            // Calculate how relevant this concept is to current synthesis section
            const synthesisRelevance = sectionConcepts.length > 0 
              ? sectionConcepts.reduce((score, sc) => {
                  return score + (concept.name.toLowerCase().includes(sc.toLowerCase()) ? 1 : 0)
                }, 0) / sectionConcepts.length
              : 0.5
            
            // Simulate trend analysis (in real implementation, this would compare to historical data)
            const trend = concept.frequency > 10 ? 'increasing' : 
                         concept.frequency > 5 ? 'stable' : 'decreasing'
            
            return {
              name: concept.name,
              frequency: concept.frequency,
              categories: concept.categories,
              trend,
              synthesisRelevance
            }
          })
          
          setConceptFrequencies(enrichedConcepts)
        }
      }
    } catch (error) {
      console.error('Failed to load concept frequencies:', error)
    }
  }

  const getDocumentTypeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'report': return '📊'
      case 'letter': return '✉️'
      case 'proposal': return '📋'
      case 'analysis': return '🔍'
      case 'vision': return '🌟'
      case 'methodology': return '🔧'
      default: return '📄'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈'
      case 'stable': return '➖'
      case 'decreasing': return '📉'
      default: return '➖'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600'
      case 'stable': return 'text-blue-600'
      case 'decreasing': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  if (!isFramingLoaded) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Document & Concept Integration</h2>
        <p className="text-lg text-gray-700 max-w-3xl">
          Real-time connections between the knowledge synthesis and AIME's document library, 
          showing how concepts evolve and relate across different sources.
        </p>
        {lastUpdate && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Connections */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Related Documents</h3>
            <button
              onClick={loadDocumentConnections}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : documentConnections.length > 0 ? (
            <div className="space-y-4">
              {documentConnections.map(doc => (
                <div
                  key={doc.id}
                  className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedDocument?.id === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">{getDocumentTypeIcon(doc.category)}</span>
                        <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{doc.summary}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-gray-500">{doc.readingTime} min read</div>
                      <div className="text-xs text-blue-600 font-medium">
                        {Math.round(doc.relevanceScore * 100)}% relevant
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.concepts.slice(0, 5).map(concept => (
                      <ConceptTooltip key={concept} concept={concept}>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {concept.replace('-', ' ')}
                        </span>
                      </ConceptTooltip>
                    ))}
                    {doc.concepts.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{doc.concepts.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  {doc.keyQuotes.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-sm italic">
                        "{doc.keyQuotes[0].substring(0, 150)}..."
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Related Documents</h4>
              <p className="text-gray-600">No documents found for the current section concepts.</p>
            </div>
          )}
        </div>

        {/* Concept Frequencies Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Live Concept Analysis</h3>
          
          {/* Current Section Concepts */}
          {currentSection && sectionConcepts.length > 0 && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">{currentSection} Concepts</h4>
              <div className="space-y-2">
                {sectionConcepts.map(concept => {
                  const conceptInfo = getConceptInfo(concept)
                  return (
                    <div key={concept} className="flex items-center justify-between">
                      <ConceptTooltip concept={concept}>
                        <span className="text-blue-800 text-sm capitalize cursor-help">
                          {concept.replace('-', ' ')}
                        </span>
                      </ConceptTooltip>
                      {conceptInfo && (
                        <span className="text-blue-600 text-xs">
                          {conceptInfo.frequency} docs
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Top Concepts */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Trending Concepts</h4>
            <div className="space-y-3">
              {conceptFrequencies
                .filter(c => c.synthesisRelevance > 0.3 || c.frequency > 5)
                .slice(0, 8)
                .map(concept => (
                <div key={concept.name} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <ConceptTooltip concept={concept.name}>
                      <span className="font-medium text-gray-900 text-sm capitalize cursor-help">
                        {concept.name.replace('-', ' ')}
                      </span>
                    </ConceptTooltip>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs ${getTrendColor(concept.trend)}`}>
                        {getTrendIcon(concept.trend)}
                      </span>
                      <span className="text-xs text-gray-500">{concept.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {concept.categories.slice(0, 2).map(category => (
                      <span key={category} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  {concept.synthesisRelevance > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${concept.synthesisRelevance * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Integration Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-green-800">Documents Connected</span>
                <span className="text-green-600 font-medium">{documentConnections.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-800">Concepts Tracked</span>
                <span className="text-green-600 font-medium">{conceptFrequencies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-800">Auto-Update</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Document Detail */}
      {selectedDocument && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedDocument.title}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span>{getDocumentTypeIcon(selectedDocument.category)} {selectedDocument.category}</span>
                <span>{selectedDocument.readingTime} min read</span>
                <span>{Math.round(selectedDocument.relevanceScore * 100)}% relevant</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDocument(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-700 mb-4">{selectedDocument.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.concepts.map(concept => (
                  <ConceptTooltip key={concept} concept={concept}>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm cursor-help">
                      {concept.replace('-', ' ')}
                    </span>
                  </ConceptTooltip>
                ))}
              </div>
            </div>
            
            {selectedDocument.keyQuotes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Quotes</h4>
                <div className="space-y-2">
                  {selectedDocument.keyQuotes.slice(0, 2).map((quote, index) => (
                    <blockquote key={index} className="text-gray-700 text-sm italic border-l-4 border-blue-200 pl-3">
                      "{quote}"
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Full Document
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Add to Synthesis
            </button>
          </div>
        </div>
      )}
    </div>
  )
}