"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  UserGroupIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface BusinessCase {
  id: string
  title: string
  subtitle: string
  description: string
  priority: 'flagship' | 'core' | 'emerging'
  target_audience: string
  impact_score: number
  tags: string[]
  key_outcomes: string[]
  challenge: string
  approach: string
  implementation: string[]
  metrics: string[]
  testimonials: Array<{
    quote: string
    author: string
    role: string
  }>
  resources: Array<{
    title: string
    type: string
    url: string
  }>
}

export default function BusinessCaseDetailPage() {
  const params = useParams()
  const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'approach' | 'implementation' | 'results' | 'resources'>('overview')

  useEffect(() => {
    loadBusinessCase()
  }, [params.id])

  const loadBusinessCase = async () => {
    // Mock data for the core 8 business cases
    const mockData = getBusinessCaseData(params.id as string)
    setBusinessCase(mockData)
    setLoading(false)
  }

  const getBusinessCaseData = (id: string): BusinessCase => {
    const cases = {
      'joy-corps': {
        id: 'joy-corps',
        title: 'Joy Corps',
        subtitle: 'Organizational Transformation Through Indigenous Wisdom',
        description: 'Joy Corps represents AIME\'s flagship approach to embedding Indigenous wisdom into organizational culture and operations. This comprehensive transformation methodology prioritizes relationships, community benefit, and seven-generation thinking to create sustainable organizational change.',
        priority: 'flagship' as const,
        target_audience: 'Global Organizations & Corporate Leaders',
        impact_score: 95,
        tags: ['transformation', 'organizational-change', 'indigenous-wisdom', 'joy-corps', 'culture', 'leadership'],
        key_outcomes: [
          'Organizations report 40% improvement in employee engagement through relationship-first approaches',
          'Implementation of seven-generation thinking in strategic planning processes across 50+ companies',
          'Cultural transformation metrics show sustained positive change over 18+ months',
          'Leadership development programs integrate Indigenous mentoring methodologies',
          'Measurable improvements in organizational resilience and adaptability'
        ],
        challenge: 'Traditional organizational structures often prioritize short-term profits over long-term sustainability and human relationships. This creates disconnected workplaces where employees feel undervalued and organizational purpose lacks deeper meaning.',
        approach: 'Joy Corps transforms organizations by embedding Indigenous wisdom principles into core operations. The methodology focuses on relationship-building, community-centered decision-making, and seven-generation thinking to create workplaces that honor both people and purpose.',
        implementation: [
          'Leadership immersion in Indigenous wisdom principles and relationship-first approaches',
          'Cultural assessment and transformation planning with community input and feedback',
          'Implementation of mentoring networks and relationship-building systems across all levels',
          'Integration of seven-generation thinking into strategic planning and decision-making processes',
          'Development of community-centered policies and practices that prioritize collective wellbeing',
          'Ongoing measurement and adaptation based on cultural transformation metrics and employee feedback'
        ],
        metrics: [
          '40% increase in employee engagement scores',
          '60% improvement in leadership effectiveness ratings',
          '25% reduction in staff turnover',
          '50% increase in innovation metrics',
          '35% improvement in organizational resilience measures'
        ],
        testimonials: [
          {
            quote: "Joy Corps didn't just change our policies - it transformed how we see ourselves as an organization. We now make decisions thinking about the impact on seven generations.",
            author: "Sarah Chen",
            role: "CEO, Global Tech Solutions"
          },
          {
            quote: "The relationship-first approach has created the most connected and purposeful workplace I've ever experienced. Our teams are more creative and collaborative than ever.",
            author: "Marcus Williams",
            role: "Head of People & Culture, Innovation Labs"
          }
        ],
        resources: [
          { title: 'Joy Corps Implementation Guide', type: 'PDF', url: '/resources/joy-corps-guide.pdf' },
          { title: 'Seven-Generation Planning Toolkit', type: 'Toolkit', url: '/resources/seven-generation-toolkit' },
          { title: 'Organizational Transformation Webinar Series', type: 'Video', url: '/resources/transformation-webinars' }
        ]
      },
      // Add more cases as needed...
    }
    
    return cases[id as keyof typeof cases] || cases['joy-corps']
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      flagship: 'bg-purple-100 text-purple-800 border-purple-200',
      core: 'bg-blue-100 text-blue-800 border-blue-200',
      emerging: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority as keyof typeof colors] || colors.core
  }

  const getPriorityIcon = (priority: string) => {
    const icons = {
      flagship: '🌟',
      core: '⚡',
      emerging: '🌱'
    }
    return icons[priority as keyof typeof icons] || icons.core
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business case...</p>
        </div>
      </div>
    )
  }

  if (!businessCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Case Not Found</h2>
          <p className="text-gray-600 mb-4">The requested business case could not be found.</p>
          <Link href="/business-cases" className="text-blue-600 hover:text-blue-800">
            ← Back to Business Cases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/business-cases" className="hover:text-gray-700">
              Business Cases
            </Link>
            <span>•</span>
            <span className="text-gray-900">{businessCase.title}</span>
          </div>

          {/* Title Section */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(businessCase.priority)}`}>
                  {getPriorityIcon(businessCase.priority)} {businessCase.priority.toUpperCase()}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Impact Score: {businessCase.impact_score}/100</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {businessCase.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {businessCase.subtitle}
              </p>
              <p className="text-gray-700 leading-relaxed max-w-4xl">
                {businessCase.description}
              </p>
            </div>

            <div className="ml-8 text-right">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {businessCase.impact_score}
                </div>
                <div className="text-sm text-blue-800">Impact Score</div>
              </div>
              
              <Link
                href="/business-cases"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Cases</span>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: DocumentTextIcon },
                { key: 'approach', label: 'Approach', icon: LightBulbIcon },
                { key: 'implementation', label: 'Implementation', icon: RocketLaunchIcon },
                { key: 'results', label: 'Results', icon: ChartBarIcon },
                { key: 'resources', label: 'Resources', icon: UserGroupIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>   
   {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  The Challenge
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {businessCase.challenge}
                </p>
              </div>

              {/* Target Audience */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600 mr-3" />
                  Target Audience
                </h2>
                <p className="text-gray-700 text-lg">
                  {businessCase.target_audience}
                </p>
              </div>

              {/* Key Themes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Themes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {businessCase.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Priority Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(businessCase.priority)}`}>
                      {businessCase.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Impact Score</span>
                    <span className="font-semibold text-gray-900">{businessCase.impact_score}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Key Outcomes</span>
                    <span className="font-semibold text-gray-900">{businessCase.key_outcomes.length}</span>
                  </div>
                </div>
              </div>

              {/* Key Outcomes Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Outcomes</h3>
                <div className="space-y-3">
                  {businessCase.key_outcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{outcome}</p>
                    </div>
                  ))}
                  {businessCase.key_outcomes.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      +{businessCase.key_outcomes.length - 3} more outcomes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approach' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <LightBulbIcon className="w-8 h-8 text-yellow-600 mr-3" />
                Our Approach
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {businessCase.approach}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <RocketLaunchIcon className="w-8 h-8 text-blue-600 mr-3" />
                Implementation Process
              </h2>
              <div className="space-y-6">
                {businessCase.implementation.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="w-6 h-6 text-green-600 mr-3" />
                Key Metrics
              </h2>
              <div className="space-y-4">
                {businessCase.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <StarIcon className="w-6 h-6 text-yellow-600 mr-3" />
                Testimonials
              </h2>
              <div className="space-y-6">
                {businessCase.testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <blockquote className="text-gray-700 italic mb-2">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Outcomes List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complete Outcomes List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessCase.key_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserGroupIcon className="w-8 h-8 text-purple-600 mr-3" />
                Resources & Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessCase.resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {resource.type}
                      </span>
                    </div>
                    <a
                      href={resource.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Access Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}