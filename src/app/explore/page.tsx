"use client"

import { useState, useEffect } from 'react'
import { IntelligentDiscovery } from '@/components/explore/IntelligentDiscovery'
import { KnowledgeGraph } from '@/components/explore/KnowledgeGraph'
import { SerendipitousDiscovery } from '@/components/explore/SerendipitousDiscovery'

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize explore features
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore: Intelligent Discovery
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover unexpected connections across AIME's 20+ years of Indigenous wisdom, 
              relational economics, and transformational learning through AI-powered exploration.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-lg italic">
                "In a world of infinite information, wisdom lies in understanding the relationships between ideas."
              </p>
              <p className="text-sm mt-2 opacity-80">— Indigenous Systems Thinking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Philosophy Primer */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-12 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Philosophy First: Indigenous Systems Thinking</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Before exploring connections, understand that Indigenous knowledge systems recognize 
                  all elements as interconnected. This exploration tool reveals the relationships that 
                  Western thinking often separates, helping you see the holistic nature of AIME's approach.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exploration Components */}
        <div className="space-y-12">
          
          {/* Intelligent Discovery */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intelligent Discovery</h2>
            <p className="text-lg text-gray-600 mb-8">
              AI-powered content surfacing based on semantic understanding and Indigenous knowledge connections.
            </p>
            <IntelligentDiscovery />
          </section>

          {/* Knowledge Graph */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Knowledge Graph</h2>
            <p className="text-lg text-gray-600 mb-8">
              Visual exploration of concept relationships across all AIME content sources.
            </p>
            <KnowledgeGraph />
          </section>

          {/* Serendipitous Discovery */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Serendipitous Discovery</h2>
            <p className="text-lg text-gray-600 mb-8">
              Unexpected connections that reveal the interconnected nature of Indigenous wisdom and modern applications.
            </p>
            <SerendipitousDiscovery />
          </section>

        </div>

        {/* Cultural Protocol Notice */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Cultural Protocols & Attribution</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  All Indigenous knowledge presented here is shared with respect for cultural protocols. 
                  Content is attributed to its sources and communities, with elder validation for sensitive materials. 
                  This exploration tool serves to honor and amplify Indigenous wisdom, not appropriate it.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}