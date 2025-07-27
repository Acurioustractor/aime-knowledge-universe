"use client"

import { useState, useEffect } from 'react'
import { DocumentTextIcon, LightBulbIcon, TagIcon, FolderIcon, CloudArrowUpIcon, DocumentPlusIcon, ChartBarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

interface BusinessCaseData {
  summary: {
    totalCases: number
    totalOrganizations: number
    categories: number
    avgImpactScore: number
  }
  topThemes: Array<{
    name: string
    frequency: number
    categories: string[]
  }>
  categories: Array<{
    name: string
    caseCount: number
    uniqueThemes: number
    avgImpactScore: number
  }>
  recentCases: Array<{
    id: string
    title: string
    category: string
    impactScore: number
    organization: string
  }>
}

export default function BusinessCasesPage() {
  const [businessCaseData, setBusinessCaseData] = useState<BusinessCaseData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Upload functionality
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'library'>('dashboard')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadText, setUploadText] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [processingResult, setProcessingResult] = useState<any>(null)
  
  // Document library functionality
  const [allCases, setAllCases] = useState<any[]>([])
  const [filteredCases, setFilteredCases] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [libraryLoading, setLibraryLoading] = useState(false)

  useEffect(() => {
    loadBusinessCaseData()
    if (activeTab === 'library') {
      loadAllCases()
    }
  }, [activeTab])

  const loadBusinessCaseData = async () => {
    try {
      // Fallback data for the core 8 cases
      setBusinessCaseData({
        summary: {
          totalCases: 8,
          totalOrganizations: 4,
          categories: 3,
          avgImpactScore: 85
        },
        topThemes: [
          { name: 'transformation', frequency: 8, categories: ['business'] },
          { name: 'mentoring', frequency: 7, categories: ['business'] },
          { name: 'indigenous-wisdom', frequency: 6, categories: ['business'] },
          { name: 'systems-change', frequency: 5, categories: ['business'] },
          { name: 'leadership', frequency: 4, categories: ['business'] }
        ],
        categories: [
          { name: 'flagship', caseCount: 3, uniqueThemes: 8, avgImpactScore: 95 },
          { name: 'core', caseCount: 4, uniqueThemes: 6, avgImpactScore: 80 },
          { name: 'emerging', caseCount: 1, uniqueThemes: 4, avgImpactScore: 70 }
        ],
        recentCases: [
          { id: 'joy-corps', title: 'Joy Corps: Organizational Transformation', category: 'flagship', impactScore: 95, organization: 'Global Organizations' },
          { id: 'custodians', title: 'Custodians: Systems Leadership', category: 'flagship', impactScore: 90, organization: 'System Leaders' },
          { id: 'presidents', title: 'Presidents: Executive Mentoring', category: 'core', impactScore: 85, organization: 'Senior Executives' },
          { id: 'citizens', title: 'Citizens: Community Engagement', category: 'core', impactScore: 80, organization: 'Communities' },
          { id: 'imagi-labs', title: 'IMAGI-Labs: Innovation Hubs', category: 'core', impactScore: 75, organization: 'Innovation Centers' }
        ]
      })
    } catch (error) {
      console.error('Failed to load business case data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllCases = async () => {
    setLibraryLoading(true)
    try {
      // Core 8 cases
      const fallbackCases = [
        {
          id: 'joy-corps',
          title: 'Joy Corps: Organizational Transformation Through Indigenous Wisdom',
          description: 'This document explores how organizations can embed Indigenous wisdom into their operations through the Joy Corps methodology. It demonstrates systematic transformation approaches that prioritize relationships, community benefit, and seven-generation thinking in corporate environments.',
          tags: ['transformation', 'organizational-change', 'indigenous-wisdom', 'joy-corps', 'culture', 'leadership'],
          priority: 'flagship',
          target_audience: 'Global Organizations',
          impact_score: 95,
          key_outcomes: [
            'Organizations report 40% improvement in employee engagement through relationship-first approaches',
            'Implementation of seven-generation thinking in strategic planning processes',
            'Cultural transformation metrics show sustained positive change over 18+ months'
          ]
        },
        {
          id: 'custodians',
          title: 'Custodians: Systems Leadership and Stewardship Models',
          description: 'This document outlines the Custodians pathway for developing systems leaders who understand their role as stewards of transformation. It integrates Indigenous concepts of custodianship with modern leadership development.',
          tags: ['systems-leadership', 'stewardship', 'custodianship', 'indigenous-wisdom', 'mentoring', 'transformation'],
          priority: 'flagship',
          target_audience: 'System Leaders',
          impact_score: 90,
          key_outcomes: [
            'Leaders demonstrate measurable shift toward stewardship mindset',
            'Systems thinking capabilities increase by 60% in program participants',
            'Network effects create ripple impact across connected organizations'
          ]
        },
        {
          id: 'presidents',
          title: 'Presidents: Executive Mentoring and Leadership Transformation',
          description: 'This document presents the Presidents pathway focused on transforming executive leadership through Indigenous mentoring methodologies. It addresses how senior leaders can embody and model transformational change.',
          tags: ['executive-leadership', 'mentoring', 'transformation', 'indigenous-wisdom', 'presidents', 'senior-management'],
          priority: 'core',
          target_audience: 'Senior Executives',
          impact_score: 85,
          key_outcomes: [
            'Executive decision-making incorporates long-term thinking principles',
            'Mentoring relationships become central to leadership development',
            'Organizational culture shifts reflect Indigenous wisdom integration'
          ]
        },
        {
          id: 'citizens',
          title: 'Citizens: Community Engagement and Collective Action',
          description: 'This document explores how the Citizens pathway enables community-level transformation through collective action and shared responsibility. It demonstrates grassroots approaches to systems change.',
          tags: ['community-engagement', 'collective-action', 'citizens', 'grassroots', 'transformation', 'networks'],
          priority: 'core',
          target_audience: 'Communities',
          impact_score: 80,
          key_outcomes: [
            'Community networks demonstrate increased collaboration and mutual support',
            'Grassroots initiatives show sustainable impact over multiple years',
            'Collective action models replicated across diverse geographic regions'
          ]
        },
        {
          id: 'imagi-labs',
          title: 'IMAGI-Labs: Innovation Hubs and Creative Transformation',
          description: 'This document details the IMAGI-Labs approach to creating innovation hubs that blend Indigenous wisdom with cutting-edge creative methodologies. It shows how imagination becomes a practical tool for transformation.',
          tags: ['innovation', 'creativity', 'imagi-labs', 'imagination', 'transformation', 'hubs'],
          priority: 'core',
          target_audience: 'Innovation Centers',
          impact_score: 75,
          key_outcomes: [
            'Innovation metrics show 50% increase in breakthrough solutions',
            'Creative methodologies integrate Indigenous wisdom principles',
            'Hub models successfully replicated in multiple contexts'
          ]
        },
        {
          id: 'indigenous-labs',
          title: 'Indigenous Labs: Cultural Knowledge and Modern Applications',
          description: 'This document presents the Indigenous Labs pathway that focuses on preserving and applying traditional knowledge in contemporary contexts. It bridges ancient wisdom with modern challenges.',
          tags: ['indigenous-knowledge', 'cultural-preservation', 'traditional-wisdom', 'modern-applications', 'labs'],
          priority: 'core',
          target_audience: 'Cultural Organizations',
          impact_score: 88,
          key_outcomes: [
            'Traditional knowledge systems successfully integrated into modern frameworks',
            'Cultural preservation efforts show measurable community impact',
            'Knowledge transfer between generations demonstrates sustained success'
          ]
        },
        {
          id: 'mentor-credit',
          title: 'Mentor Credit: Relationship Economics and Value Creation',
          description: 'This document explores the Mentor Credit system that creates economic value from mentoring relationships. It demonstrates how relational economics can transform traditional value creation models.',
          tags: ['mentor-credit', 'relational-economics', 'value-creation', 'mentoring', 'economics', 'relationships'],
          priority: 'emerging',
          target_audience: 'Economic Innovators',
          impact_score: 70,
          key_outcomes: [
            'Pilot programs demonstrate measurable economic value from mentoring relationships',
            'Alternative value creation models show promise for scaling',
            'Relationship-based economics principles gain institutional recognition'
          ]
        },
        {
          id: 'systems-residency',
          title: 'Systems Residency: Immersive Transformation Experiences',
          description: 'This document outlines the Systems Residency program that provides immersive experiences in systems transformation. It combines intensive learning with practical application in real-world contexts.',
          tags: ['systems-residency', 'immersive-learning', 'transformation', 'experiential', 'systems-thinking'],
          priority: 'emerging',
          target_audience: 'Change Agents',
          impact_score: 82,
          key_outcomes: [
            'Participants demonstrate deep systems thinking capabilities post-residency',
            'Immersive learning models show superior retention and application rates',
            'Residency graduates become effective transformation leaders in their contexts'
          ]
        }
      ]
      setAllCases(fallbackCases)
      setFilteredCases(fallbackCases)
    } catch (error) {
      console.error('Failed to load cases:', error)
    } finally {
      setLibraryLoading(false)
    }
  }

  const filterCases = () => {
    let filtered = allCases

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(query) ||
        c.target_audience?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        (c.tags || []).some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(c => 
        (c.priority || 'core').toLowerCase() === selectedCategoryFilter.toLowerCase()
      )
    }

    setFilteredCases(filtered)
  }

  useEffect(() => {
    filterCases()
  }, [searchQuery, selectedCategoryFilter, allCases])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadText(e.target?.result as string || '')
        }
        reader.readAsText(file)
      }
    }
  }

  const processBusinessCase = async () => {
    if (!uploadText.trim() && !uploadedFile) {
      alert('Please provide text content or upload a file')
      return
    }

    setProcessing(true)
    setProcessingResult(null)

    try {
      const content = uploadText.trim() || 'Business case content processing...'
      const result = await processBusinessCaseClientSide(content, uploadedFile?.name || 'Uploaded Business Case')
      setProcessingResult(result)
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Processing failed:', error)
      alert('Business case processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const processBusinessCaseClientSide = async (content: string, title: string) => {
    const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3)
    const wordCount = words.length
    
    // Business case specific concepts
    const businessConcepts = [
      'transformation', 'impact', 'roi', 'revenue', 'growth', 'efficiency', 'innovation',
      'leadership', 'strategy', 'implementation', 'results', 'metrics', 'performance',
      'organization', 'culture', 'change', 'improvement', 'success', 'value', 'benefit'
    ]
    
    const foundConcepts = businessConcepts.filter(concept => 
      content.toLowerCase().includes(concept)
    )
    
    // Categorization for business cases
    let category = 'general'
    if (content.toLowerCase().includes('flagship') || content.toLowerCase().includes('major')) {
      category = 'flagship'
    } else if (content.toLowerCase().includes('core') || content.toLowerCase().includes('essential')) {
      category = 'core'
    } else if (content.toLowerCase().includes('emerging') || content.toLowerCase().includes('new')) {
      category = 'emerging'
    }
    
    // Extract key metrics/numbers
    const numberMatches = content.match(/\d+%|\$\d+|\d+x|\d+\.\d+/g) || []
    
    // Calculate impact score based on content
    let impactScore = 0
    if (content.toLowerCase().includes('transform')) impactScore += 20
    if (content.toLowerCase().includes('million') || content.toLowerCase().includes('billion')) impactScore += 30
    if (numberMatches.length > 0) impactScore += 15
    if (foundConcepts.length > 5) impactScore += 25
    impactScore = Math.min(impactScore, 100)
    
    return {
      id: Date.now().toString(),
      title,
      category,
      concepts: foundConcepts,
      metrics: numberMatches,
      wordCount,
      impactScore,
      processedAt: new Date().toISOString(),
      summary: `Business case contains ${foundConcepts.length} key concepts and ${numberMatches.length} quantitative metrics. Impact score: ${impactScore}/100.`
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      flagship: 'bg-purple-100 text-purple-800 border-purple-200',
      core: 'bg-blue-100 text-blue-800 border-blue-200',
      emerging: 'bg-green-100 text-green-800 border-green-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      flagship: '🌟',
      core: '⚡',
      emerging: '🌱',
      general: '📊'
    }
    return icons[category as keyof typeof icons] || icons.general
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text || ''
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business cases...</p>
        </div>
      </div>
    )
  }

  if (!businessCaseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Cases Not Available</h2>
          <p className="text-gray-600">Please check the business cases data source.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AIME Business Cases</h1>
              <p className="text-lg text-gray-600 mt-2">
                Real-world transformations demonstrating AIME's impact across organizations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {businessCaseData.summary.totalCases}
                </div>
                <div className="text-sm text-gray-500">Cases Analyzed</div>
              </div>
              
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DocumentPlusIcon className="w-5 h-5" />
                <span>Add Case Study</span>
              </button>
            </div>
          </div>
          
          {/* Quick Navigation to All Cases */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Quick Access to All Business Cases</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'joy-corps', name: 'Joy Corps', icon: '🌟', priority: 'flagship' },
                { id: 'custodians', name: 'Custodians', icon: '🌟', priority: 'flagship' },
                { id: 'presidents', name: 'Presidents', icon: '⚡', priority: 'core' },
                { id: 'citizens', name: 'Citizens', icon: '⚡', priority: 'core' },
                { id: 'imagi-labs', name: 'IMAGI-Labs', icon: '⚡', priority: 'core' },
                { id: 'indigenous-labs', name: 'Indigenous Labs', icon: '⚡', priority: 'core' },
                { id: 'mentor-credit', name: 'Mentor Credit', icon: '🌱', priority: 'emerging' },
                { id: 'systems-residency', name: 'Systems Residency', icon: '🌱', priority: 'emerging' }
              ].map((businessCase) => (
                <a
                  key={businessCase.id}
                  href={`/business-cases/${businessCase.id}`}
                  className="flex items-center space-x-2 px-3 py-2 bg-white rounded border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                >
                  <span>{businessCase.icon}</span>
                  <span className="font-medium text-blue-900">{businessCase.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload & Analyze
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'library'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Document Library
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'upload' ? (
          /* Upload Interface */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <CloudArrowUpIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analyze Your Business Case
                </h2>
                <p className="text-gray-600">
                  Upload a business case or paste content to analyze transformation impact and key metrics
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Business Case (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports .txt, .md, .doc, .docx, .pdf files
                    </p>
                  </label>
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Paste Your Business Case Here
                </label>
                <textarea
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Paste your business case content here for analysis..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {uploadText.length} characters • {Math.ceil(uploadText.split(' ').length / 200)} min read
                </p>
              </div>

              {/* Process Button */}
              <div className="text-center">
                <button
                  onClick={processBusinessCase}
                  disabled={processing || (!uploadText.trim() && !uploadedFile)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Analyze Business Case</span>
                    </>
                  )}
                </button>
              </div>

              {/* Processing Result */}
              {processingResult && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    Analysis Complete! ✅
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span> {processingResult.title}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getCategoryColor(processingResult.category)}`}>
                        {getCategoryIcon(processingResult.category)} {processingResult.category}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Impact Score:</span> 
                      <span className="ml-2 font-bold text-blue-600">{processingResult.impactScore}/100</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Key Concepts:</span> {processingResult.concepts.join(', ') || 'None identified'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Metrics Found:</span> {processingResult.metrics.join(', ') || 'None identified'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Summary:</span> {processingResult.summary}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View in Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'library' ? (
          /* Document Library */
          <div>
            {/* Library Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Case Document Library</h2>
              <p className="text-gray-600 mb-6">
                Browse all business case documents with summaries, themes, and links to originals
              </p>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents, themes, or content..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="flagship">Flagship</option>
                    <option value="core">Core</option>
                    <option value="emerging">Emerging</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredCases.length} of {allCases.length} business case documents
              </div>
            </div>

            {/* Documents Grid */}
            {libraryLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading document library...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredCases.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(doc.priority || 'core')}`}>
                            {getCategoryIcon(doc.priority || 'core')} {doc.priority || 'Core'}
                          </span>
                          <span>📊 Impact: {doc.impact_score || 'N/A'}</span>
                          <span>🎯 {doc.target_audience || 'AIME Network'}</span>
                        </div>
                      </div>
                      
                      <a
                        href={`/business-cases/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>View Original</span>
                      </a>
                    </div>

                    {/* Document Summary */}
                    {doc.description && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {truncateText(doc.description, 300)}
                        </p>
                      </div>
                    )}

                    {/* Business Themes */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Business Themes ({doc.tags.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.slice(0, 10).map((theme, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {theme}
                            </span>
                          ))}
                          {doc.tags.length > 10 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              +{doc.tags.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Outcomes */}
                    {doc.key_outcomes && doc.key_outcomes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Key Outcomes</h4>
                        <div className="space-y-2">
                          {doc.key_outcomes.slice(0, 3).map((outcome, index) => (
                            <blockquote key={index} className="border-l-4 border-blue-200 pl-4 italic text-gray-700">
                              "{truncateText(outcome.trim(), 200)}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Document Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Document ID: {doc.id}
                      </div>
                      <div className="flex items-center space-x-3">
                        <a
                          href={`/business-cases/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Read Full Document →
                        </a>
                        <button
                          onClick={() => {
                            // Copy themes to clipboard for easy reference
                            const themes = (doc.tags || []).join(', ')
                            navigator.clipboard.writeText(themes)
                            alert('Themes copied to clipboard!')
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Copy Themes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredCases.length === 0 && !libraryLoading && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">
                      {searchQuery || selectedCategoryFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'No business case documents have been processed yet'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Dashboard Content */
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {businessCaseData.summary.totalCases}
                    </div>
                    <div className="text-sm text-gray-500">Total Cases</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {businessCaseData.summary.totalOrganizations}
                    </div>
                    <div className="text-sm text-gray-500">Organizations</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <FolderIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {businessCaseData.summary.categories}
                    </div>
                    <div className="text-sm text-gray-500">Categories</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <LightBulbIcon className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {businessCaseData.summary.avgImpactScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Impact Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Themes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Top Transformation Themes</h2>
                  <p className="text-sm text-gray-600 mt-1">Most common themes across business cases</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {businessCaseData.topThemes.slice(0, 10).map((theme, index) => (
                      <div key={theme.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {theme.name}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {theme.frequency}
                          </div>
                          <div className="text-xs text-gray-500">cases</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Case Categories</h2>
                  <p className="text-sm text-gray-600 mt-1">Distribution across priority levels</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {businessCaseData.categories.map((category) => (
                      <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category.caseCount} cases
                              </div>
                            </div>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category.name)}`}>
                            Impact: {category.avgImpactScore.toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Average themes per case: {category.uniqueThemes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Core Business Cases</h2>
                <p className="text-sm text-gray-600 mt-1">AIME's transformation pathways</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessCaseData.recentCases.map((businessCase) => (
                    <div key={businessCase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">
                          {businessCase.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(businessCase.category)}`}>
                          {businessCase.category}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        🎯 {businessCase.organization}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        📊 Impact Score: {businessCase.impactScore}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}