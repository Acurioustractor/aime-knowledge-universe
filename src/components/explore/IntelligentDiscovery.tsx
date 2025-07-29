"use client"

import { useState, useEffect } from 'react'
import { ContentCard } from '@/components/ContentCard'

interface DiscoveryItem {
  id: string
  title: string
  description: string
  type: string
  source: string
  url: string
  thumbnail?: string
  relevanceScore: number
  connections: string[]
}

export function IntelligentDiscovery() {
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [discoveryType, setDiscoveryType] = useState('trending')

  const discoveryTypes = [
    { id: 'trending', label: 'Trending Now', description: 'Most engaged content this week' },
    { id: 'connections', label: 'Unexpected Connections', description: 'Surprising relationships between concepts' },
    { id: 'deep', label: 'Deep Wisdom', description: 'Profound Indigenous knowledge insights' },
    { id: 'practical', label: 'Ready to Apply', description: 'Tools and frameworks ready for implementation' }
  ]

  useEffect(() => {
    loadDiscoveries(discoveryType)
  }, [discoveryType])

  const loadDiscoveries = async (type: string) => {
    setIsLoading(true)
    try {
      // For now, create mock intelligent discoveries
      // In production, this would use the new /api/search/explore endpoint
      const mockDiscoveries: DiscoveryItem[] = [
        {
          id: '1',
          title: 'Seven Generation Thinking in Business Strategy',
          description: 'How Indigenous long-term thinking transforms corporate decision-making for sustainable impact.',
          type: 'business-case',
          source: 'airtable',
          url: '/business-cases/seven-generation-strategy',
          relevanceScore: 0.95,
          connections: ['Indigenous custodianship', 'Corporate transformation', 'Sustainability']
        },
        {
          id: '2', 
          title: 'Hoodie Economics Explained: From Transactional to Relational',
          description: 'IMAGI-NATION TV episode breaking down the philosophy behind relationship-centered economics.',
          type: 'video',
          source: 'youtube',
          url: '/content/videos/hoodie-economics-explained',
          relevanceScore: 0.92,
          connections: ['Relational economics', 'Community building', 'Value creation']
        },
        {
          id: '3',
          title: 'Mentoring Methodology: Building Bridges Across Cultures',
          description: 'Comprehensive toolkit for creating meaningful mentoring relationships that honor cultural differences.',
          type: 'tool',
          source: 'airtable',
          url: '/tools/mentoring-methodology',
          relevanceScore: 0.89,
          connections: ['Mentoring', 'Cultural bridge-building', 'Relationship formation']
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setDiscoveries(mockDiscoveries)
    } catch (error) {
      console.error('Error loading discoveries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      
      {/* Discovery Type Selector */}
      <div className="border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {discoveryTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setDiscoveryType(type.id)}
              className={`p-4 rounded-lg text-left transition-all ${
                discoveryType === type.id
                  ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                  : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 text-gray-700'
              }`}
            >
              <h3 className="font-semibold mb-1">{type.label}</h3>
              <p className="text-sm opacity-80">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Results */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Discovering connections...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {discoveries.map((item, index) => (
              <div key={item.id} className="group">
                
                {/* Discovery Item */}
                <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  
                  {/* Relevance Score */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {Math.round(item.relevanceScore * 100)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Connections */}
                    <div className="flex flex-wrap gap-2">
                      {item.connections.map((connection, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800"
                        >
                          {connection}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Discovery Index */}
                  <div className="flex-shrink-0 text-2xl font-bold text-gray-300">
                    #{index + 1}
                  </div>

                </div>

                {/* Connection Visualization */}
                <div className="ml-16 mt-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Connected to {item.connections.length} other concepts</span>
                    <button className="text-blue-600 hover:text-blue-800 underline">
                      Explore connections →
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {!isLoading && discoveries.length > 0 && (
        <div className="border-t border-gray-200 p-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Discover more connections
          </button>
        </div>
      )}

    </div>
  )
}