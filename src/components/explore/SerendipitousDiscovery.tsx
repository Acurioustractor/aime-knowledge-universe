"use client"

import { useState, useEffect } from 'react'

interface SerendipityItem {
  id: string
  title: string
  description: string
  type: string
  surprise_factor: number
  connection_story: string
  related_items: {
    id: string
    title: string
    type: string
  }[]
}

export function SerendipitousDiscovery() {
  const [currentDiscovery, setCurrentDiscovery] = useState<SerendipityItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [discoveryHistory, setDiscoveryHistory] = useState<SerendipityItem[]>([])

  const generateSerendipity = async () => {
    setIsLoading(true)
    
    // Simulate AI-powered serendipitous discovery
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock serendipitous discoveries
    const mockDiscoveries: SerendipityItem[] = [
      {
        id: '1',
        title: 'Ancient Songlines & Modern Data Networks',
        description: 'Discover how Aboriginal songlines share surprising similarities with modern internet routing protocols, both creating navigational systems through complex landscapes.',
        type: 'conceptual-bridge',
        surprise_factor: 0.92,
        connection_story: 'Both systems create pathways through complex territories - one through physical landscape, one through digital space. Both rely on nodes, relationships, and collective memory.',
        related_items: [
          { id: 'a1', title: 'Indigenous Navigation Systems', type: 'research' },
          { id: 'a2', title: 'Network Theory in Community Building', type: 'tool' },
          { id: 'a3', title: 'Digital Aboriginal Storytelling Project', type: 'story' }
        ]
      },
      {
        id: '2',
        title: 'Hoodie Economics & Mycelial Networks',
        description: 'The relationship-based exchange in Hoodie Economics mirrors how fungi share resources through underground networks - both prioritize community health over individual accumulation.',
        type: 'biomimicry-insight',
        surprise_factor: 0.88,
        connection_story: 'Mycelial networks distribute nutrients where needed most, just like Hoodie Economics distributes value based on community needs rather than market forces.',
        related_items: [
          { id: 'b1', title: 'Relational Economics Framework', type: 'tool' },
          { id: 'b2', title: 'Biomimicry in Social Systems', type: 'research' },
          { id: 'b3', title: 'Community Resource Sharing Stories', type: 'story' }
        ]
      },
      {
        id: '3',
        title: 'Seven Generation Thinking & Quantum Entanglement',
        description: 'Indigenous seven generation decision-making and quantum entanglement both recognize that actions create lasting connections across time and space.',
        type: 'temporal-connection',
        surprise_factor: 0.85,
        connection_story: 'Just as quantum particles remain connected regardless of distance, decisions made today remain entangled with future generations through complex cause-and-effect relationships.',
        related_items: [
          { id: 'c1', title: 'Long-term Impact Assessment Tools', type: 'tool' },
          { id: 'c2', title: 'Indigenous Time Concepts', type: 'research' },
          { id: 'c3', title: 'Intergenerational Policy Success Story', type: 'story' }
        ]
      }
    ]
    
    const randomDiscovery = mockDiscoveries[Math.floor(Math.random() * mockDiscoveries.length)]
    setCurrentDiscovery(randomDiscovery)
    
    // Add to history if not already there
    if (!discoveryHistory.find(item => item.id === randomDiscovery.id)) {
      setDiscoveryHistory(prev => [randomDiscovery, ...prev].slice(0, 5))
    }
    
    setIsLoading(false)
  }

  const getSurpriseColor = (factor: number) => {
    if (factor >= 0.9) return 'from-purple-500 to-pink-500'
    if (factor >= 0.8) return 'from-blue-500 to-purple-500'
    return 'from-green-500 to-blue-500'
  }

  const getSurpriseLabel = (factor: number) => {
    if (factor >= 0.9) return 'Mind-Bending'
    if (factor >= 0.8) return 'Surprising'
    return 'Interesting'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Serendipitous Discovery</h3>
            <p className="text-sm text-gray-600 mt-1">
              AI finds unexpected connections between seemingly unrelated concepts
            </p>
          </div>
          <button
            onClick={generateSerendipity}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Discovering...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Discovery
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Discovery */}
      <div className="p-6">
        {!currentDiscovery && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Serendipity?</h3>
            <p className="text-gray-600 mb-6">
              Click the button above to discover unexpected connections between Indigenous wisdom and contemporary insights.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-gray-600 mt-4">
              Analyzing relationships across thousands of concepts...
            </p>
          </div>
        ) : currentDiscovery && (
          <div className="space-y-6">
            
            {/* Discovery Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getSurpriseColor(currentDiscovery.surprise_factor)}`}>
                    {getSurpriseLabel(currentDiscovery.surprise_factor)} Connection
                  </div>
                  <div className="text-sm text-gray-500">
                    Surprise Factor: {Math.round(currentDiscovery.surprise_factor * 100)}%
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentDiscovery.title}
                </h3>
                <p className="text-gray-600">
                  {currentDiscovery.description}
                </p>
              </div>
            </div>

            {/* Connection Story */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-l-4 border-purple-400">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                The Connection Story
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {currentDiscovery.connection_story}
              </p>
            </div>

            {/* Related Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Explore These Related Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentDiscovery.related_items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {item.type}
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{item.title}</h5>
                    <p className="text-sm text-gray-600">
                      Click to explore this {item.type} and its connections
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save Discovery
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Connection
              </button>
              <button 
                onClick={generateSerendipity}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Another Discovery
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Discovery History */}
      {discoveryHistory.length > 0 && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-4">Previous Discoveries</h4>
          <div className="space-y-2">
            {discoveryHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentDiscovery(item)}
                className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="text-xs text-gray-500">
                    {getSurpriseLabel(item.surprise_factor)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}