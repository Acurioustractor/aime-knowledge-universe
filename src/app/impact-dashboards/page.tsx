"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ImpactDashboards() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Set loading to false after a brief delay to show the iframe
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleIframeError = () => {
    setError(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AIME Impact Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-6">
            The AIME Impact Dashboard is currently being updated. Please try again later or visit the dashboard directly.
          </p>
          <div className="space-y-3">
            <a 
              href="https://Acurioustractor.github.io/AIMEdashboards" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Dashboard in New Tab
            </a>
            <Link 
              href="/"
              className="block text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
              <div className="text-gray-300">|</div>
              <h1 className="text-2xl font-bold text-gray-900">AIME Impact Dashboard</h1>
            </div>
            <a 
              href="https://Acurioustractor.github.io/AIMEdashboards" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Open in New Tab ↗
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Dashboard */}
      <div className="w-full h-screen bg-gray-50">
        <iframe
          src="https://Acurioustractor.github.io/AIMEdashboards"
          title="AIME Impact Dashboard"
          className="w-full h-full border-0"
          onError={handleIframeError}
          style={{ minHeight: 'calc(100vh - 80px)' }}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </div>
  )
}