"use client"

import { useState, useEffect, useRef } from 'react'

interface AnalyticsEvent {
  id: string
  type: 'section_visit' | 'search_query' | 'export_action' | 'bookmark_action' | 'navigation'
  timestamp: Date
  data: any
  sessionId: string
  userId?: string
}

interface SectionEngagement {
  sectionId: string
  sectionTitle: string
  visits: number
  totalTimeSpent: number
  averageTimeSpent: number
  completionRate: number
  bookmarkRate: number
  exportCount: number
  lastVisited: Date
}

interface SearchAnalytics {
  query: string
  frequency: number
  resultCount: number
  clickThroughRate: number
  avgTimeToResult: number
  popularFilters: string[]
  lastSearched: Date
}

interface UserJourney {
  sessionId: string
  startTime: Date
  endTime?: Date
  sections: string[]
  searchQueries: string[]
  actions: string[]
  exitPoint?: string
  completedGoals: string[]
}

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  searchResponseTime: number
  exportProcessingTime: number
  memoryUsage: number
  userCount: number
  lastUpdated: Date
}

export default function AnalyticsMonitoring() {
  const [analyticsData, setAnalyticsData] = useState<{
    sectionEngagement: SectionEngagement[]
    searchAnalytics: SearchAnalytics[]
    userJourneys: UserJourney[]
    performanceMetrics: PerformanceMetrics
  }>({
    sectionEngagement: [],
    searchAnalytics: [],
    userJourneys: [],
    performanceMetrics: {
      loadTime: 0,
      renderTime: 0,
      searchResponseTime: 0,
      exportProcessingTime: 0,
      memoryUsage: 0,
      userCount: 0,
      lastUpdated: new Date()
    }
  })
  
  const [activeTab, setActiveTab] = useState<'engagement' | 'search' | 'journeys' | 'performance'>('engagement')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [isMonitoring, setIsMonitoring] = useState(true)
  
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const startTime = useRef(new Date())

  useEffect(() => {
    // Initialize analytics with mock data
    loadAnalyticsData()
    
    // Start performance monitoring
    if (isMonitoring) {
      startPerformanceMonitoring()
    }

    return () => {
      // Cleanup monitoring
      setIsMonitoring(false)
    }
  }, [timeRange, isMonitoring])

  const loadAnalyticsData = async () => {
    // Simulate loading analytics data
    const mockSectionEngagement: SectionEngagement[] = [
      {
        sectionId: 'evolution-story',
        sectionTitle: 'Evolution & Growth Story',
        visits: 1250,
        totalTimeSpent: 18750, // in seconds
        averageTimeSpent: 15,
        completionRate: 85,
        bookmarkRate: 42,
        exportCount: 38,
        lastVisited: new Date('2024-01-20T10:30:00')
      },
      {
        sectionId: 'systems-economics',
        sectionTitle: 'Systems & Economics',
        visits: 980,
        totalTimeSpent: 14700,
        averageTimeSpent: 15,
        completionRate: 78,
        bookmarkRate: 55,
        exportCount: 62,
        lastVisited: new Date('2024-01-20T11:15:00')
      },
      {
        sectionId: 'imagi-nation-vision',
        sectionTitle: 'IMAGI-NATION Vision',
        visits: 1450,
        totalTimeSpent: 23200,
        averageTimeSpent: 16,
        completionRate: 92,
        bookmarkRate: 68,
        exportCount: 45,
        lastVisited: new Date('2024-01-20T12:00:00')
      },
      {
        sectionId: 'implementation-pathways',
        sectionTitle: 'Implementation Pathways',
        visits: 875,
        totalTimeSpent: 13125,
        averageTimeSpent: 15,
        completionRate: 71,
        bookmarkRate: 38,
        exportCount: 74,
        lastVisited: new Date('2024-01-20T09:45:00')
      }
    ]

    const mockSearchAnalytics: SearchAnalytics[] = [
      {
        query: 'seven generation thinking',
        frequency: 145,
        resultCount: 23,
        clickThroughRate: 78,
        avgTimeToResult: 1.2,
        popularFilters: ['Indigenous Foundations', 'Principles'],
        lastSearched: new Date('2024-01-20T11:30:00')
      },
      {
        query: 'hoodie economics',
        frequency: 112,
        resultCount: 18,
        clickThroughRate: 85,
        avgTimeToResult: 0.9,
        popularFilters: ['Systems & Economics', 'Frameworks'],
        lastSearched: new Date('2024-01-20T12:15:00')
      },
      {
        query: 'implementation guide',
        frequency: 89,
        resultCount: 31,
        clickThroughRate: 72,
        avgTimeToResult: 1.5,
        popularFilters: ['Implementation Pathways', 'Tools'],
        lastSearched: new Date('2024-01-20T10:45:00')
      },
      {
        query: 'capital shift',
        frequency: 67,
        resultCount: 12,
        clickThroughRate: 88,
        avgTimeToResult: 0.8,
        popularFilters: ['IMAGI-NATION Vision', 'Impact'],
        lastSearched: new Date('2024-01-20T09:30:00')
      }
    ]

    const mockUserJourneys: UserJourney[] = [
      {
        sessionId: 'journey-1',
        startTime: new Date('2024-01-20T10:00:00'),
        endTime: new Date('2024-01-20T10:45:00'),
        sections: ['evolution-story', 'systems-economics', 'implementation-pathways'],
        searchQueries: ['hoodie economics', 'implementation guide'],
        actions: ['bookmark', 'export', 'cross_reference'],
        exitPoint: 'implementation-pathways',
        completedGoals: ['read_section', 'find_implementation']
      },
      {
        sessionId: 'journey-2',
        startTime: new Date('2024-01-20T11:15:00'),
        endTime: new Date('2024-01-20T12:00:00'),
        sections: ['imagi-nation-vision', 'systems-economics'],
        searchQueries: ['seven generation thinking', 'capital shift'],
        actions: ['bookmark', 'search', 'cross_reference'],
        exitPoint: 'systems-economics',
        completedGoals: ['understand_vision', 'explore_economics']
      }
    ]

    const mockPerformanceMetrics: PerformanceMetrics = {
      loadTime: 1.2,
      renderTime: 0.3,
      searchResponseTime: 0.8,
      exportProcessingTime: 2.1,
      memoryUsage: 45.2,
      userCount: 247,
      lastUpdated: new Date()
    }

    setAnalyticsData({
      sectionEngagement: mockSectionEngagement,
      searchAnalytics: mockSearchAnalytics,
      userJourneys: mockUserJourneys,
      performanceMetrics: mockPerformanceMetrics
    })
  }

  const startPerformanceMonitoring = () => {
    const monitoringInterval = setInterval(() => {
      // Monitor performance metrics
      const performanceEntries = performance.getEntriesByType('navigation')
      const memoryInfo = (performance as any).memory

      if (performanceEntries.length > 0) {
        const navigation = performanceEntries[0] as PerformanceNavigationTiming
        
        setAnalyticsData(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            lastUpdated: new Date()
          }
        }))
      }

      if (memoryInfo) {
        setAnalyticsData(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024, // MB
            lastUpdated: new Date()
          }
        }))
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(monitoringInterval)
  }

  const trackEvent = (type: AnalyticsEvent['type'], data: any) => {
    const event: AnalyticsEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      data,
      sessionId: sessionId.current
    }

    // In real implementation, this would send to analytics service
    console.log('Analytics Event:', event)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatMemory = (mb: number): string => {
    return `${mb.toFixed(1)} MB`
  }

  const getEngagementColor = (rate: number): string => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; fair: number }): string => {
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.fair) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics & Performance Monitoring</h2>
            <p className="text-lg text-gray-700 max-w-3xl">
              Track user engagement, analyze search patterns, and monitor system performance 
              to optimize the Knowledge Synthesis experience.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {isMonitoring ? '🟢 Monitoring' : '🔴 Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.sectionEngagement.reduce((sum, section) => sum + section.visits, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analyticsData.sectionEngagement.reduce((sum, section) => sum + section.completionRate, 0) / analyticsData.sectionEngagement.length)}%
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Search Queries</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.searchAnalytics.reduce((sum, search) => sum + search.frequency, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">🔍</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Load Time</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(analyticsData.performanceMetrics.loadTime, { good: 1.5, fair: 3.0 })}`}>
                {analyticsData.performanceMetrics.loadTime.toFixed(1)}s
              </p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'engagement', label: 'Section Engagement', icon: '📊' },
            { id: 'search', label: 'Search Analytics', icon: '🔍' },
            { id: 'journeys', label: 'User Journeys', icon: '🗺️' },
            { id: 'performance', label: 'Performance', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Section Engagement Analysis</h3>
            
            <div className="space-y-4">
              {analyticsData.sectionEngagement.map(section => (
                <div key={section.sectionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{section.sectionTitle}</h4>
                      <p className="text-sm text-gray-600">Last visited: {section.lastVisited.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{section.visits.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">visits</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Avg. Time:</span>
                      <div className="font-medium">{formatTime(section.averageTimeSpent)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Completion:</span>
                      <div className={`font-medium ${getEngagementColor(section.completionRate)}`}>
                        {section.completionRate}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bookmark Rate:</span>
                      <div className={`font-medium ${getEngagementColor(section.bookmarkRate)}`}>
                        {section.bookmarkRate}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Exports:</span>
                      <div className="font-medium">{section.exportCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Time:</span>
                      <div className="font-medium">{formatTime(section.totalTimeSpent)}</div>
                    </div>
                  </div>
                  
                  {/* Engagement Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Engagement Score</span>
                      <span>{Math.round((section.completionRate + section.bookmarkRate) / 2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(section.completionRate + section.bookmarkRate) / 2}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Analytics Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Search Query Analysis</h3>
            
            <div className="space-y-4">
              {analyticsData.searchAnalytics.map((search, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">"{search.query}"</h4>
                      <p className="text-sm text-gray-600">Last searched: {search.lastSearched.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{search.frequency}</div>
                      <div className="text-sm text-gray-600">searches</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Results:</span>
                      <div className="font-medium">{search.resultCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Click Rate:</span>
                      <div className={`font-medium ${getEngagementColor(search.clickThroughRate)}`}>
                        {search.clickThroughRate}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg. Time:</span>
                      <div className="font-medium">{search.avgTimeToResult}s</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Popularity:</span>
                      <div className="font-medium">#{index + 1}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 text-sm">Popular Filters:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {search.popularFilters.map(filter => (
                        <span key={filter} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {filter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Journeys Tab */}
      {activeTab === 'journeys' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">User Journey Mapping</h3>
            
            <div className="space-y-6">
              {analyticsData.userJourneys.map(journey => (
                <div key={journey.sessionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Session {journey.sessionId}</h4>
                      <p className="text-sm text-gray-600">
                        {journey.startTime.toLocaleString()} - {journey.endTime?.toLocaleString() || 'Active'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium">
                        {journey.endTime 
                          ? formatTime(Math.floor((journey.endTime.getTime() - journey.startTime.getTime()) / 1000))
                          : 'Active'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">Sections Visited:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {journey.sections.map(section => (
                          <span key={section} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm">Search Queries:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {journey.searchQueries.map((query, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            "{query}"
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm">Actions Taken:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {journey.actions.map((action, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Exit Point:</span>
                      <span className="ml-1 font-medium">{journey.exitPoint || 'Active'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Goals Completed:</span>
                      <span className="ml-1 font-medium">{journey.completedGoals.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Page Load Time</span>
                  <span className={`font-medium ${getPerformanceColor(analyticsData.performanceMetrics.loadTime, { good: 1.5, fair: 3.0 })}`}>
                    {analyticsData.performanceMetrics.loadTime.toFixed(1)}s
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Render Time</span>
                  <span className={`font-medium ${getPerformanceColor(analyticsData.performanceMetrics.renderTime, { good: 0.5, fair: 1.0 })}`}>
                    {analyticsData.performanceMetrics.renderTime.toFixed(1)}s
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Search Response</span>
                  <span className={`font-medium ${getPerformanceColor(analyticsData.performanceMetrics.searchResponseTime, { good: 1.0, fair: 2.0 })}`}>
                    {analyticsData.performanceMetrics.searchResponseTime.toFixed(1)}s
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Export Processing</span>
                  <span className={`font-medium ${getPerformanceColor(analyticsData.performanceMetrics.exportProcessingTime, { good: 2.0, fair: 5.0 })}`}>
                    {analyticsData.performanceMetrics.exportProcessingTime.toFixed(1)}s
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Memory Usage</span>
                  <span className={`font-medium ${getPerformanceColor(analyticsData.performanceMetrics.memoryUsage, { good: 50, fair: 100 })}`}>
                    {formatMemory(analyticsData.performanceMetrics.memoryUsage)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* System Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">System Health</span>
                  </div>
                  <span className="font-medium text-green-700">Healthy</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Active Users</span>
                  </div>
                  <span className="font-medium text-blue-700">{analyticsData.performanceMetrics.userCount}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">API Response</span>
                  </div>
                  <span className="font-medium text-yellow-700">Normal</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Database</span>
                  </div>
                  <span className="font-medium text-green-700">Connected</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  Last updated: {analyticsData.performanceMetrics.lastUpdated.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📈</div>
                <p>Performance trend charts would be rendered here</p>
                <p className="text-sm">Integration with charting library required</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for tracking analytics events
export function useAnalytics() {
  const trackEvent = (type: AnalyticsEvent['type'], data: any) => {
    // This would integrate with your analytics service
    console.log('Analytics Event:', { type, data, timestamp: new Date() })
  }

  const trackSectionVisit = (sectionId: string, sectionTitle: string) => {
    trackEvent('section_visit', { sectionId, sectionTitle })
  }

  const trackSearchQuery = (query: string, resultCount: number, filters: string[] = []) => {
    trackEvent('search_query', { query, resultCount, filters })
  }

  const trackExportAction = (format: string, sections: string[]) => {
    trackEvent('export_action', { format, sections })
  }

  const trackBookmarkAction = (sectionId: string, action: 'add' | 'remove') => {
    trackEvent('bookmark_action', { sectionId, action })
  }

  const trackNavigation = (from: string, to: string) => {
    trackEvent('navigation', { from, to })
  }

  return {
    trackSectionVisit,
    trackSearchQuery,
    trackExportAction,
    trackBookmarkAction,
    trackNavigation
  }
}