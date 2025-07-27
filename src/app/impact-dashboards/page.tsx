"use client"

import { useState, useEffect } from 'react'
import { ChartBarIcon, ArrowTrendingUpIcon, UserGroupIcon, GlobeAltIcon, CurrencyDollarIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface ImpactMetric {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface ProjectStatus {
  name: string
  phase: string
  completion: number
  impact: string
  projectedValue: string
  target2025: string
}

export default function ImpactDashboards() {
  const [activeTab, setActiveTab] = useState('overview')
  const [impactData, setImpactData] = useState<ImpactMetric[]>([])
  const [projectsData, setProjectsData] = useState<ProjectStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulate loading real data - in production this would fetch from GitHub API
      setImpactData([
        {
          title: 'Lives Transformed',
          value: '75,000+',
          change: '+12.5%',
          trend: 'up',
          description: 'Young people reached through AIME programs over 20 years'
        },
        {
          title: 'University Pathways',
          value: '89%',
          change: '+5.2%',
          trend: 'up',
          description: 'Program participants who accessed higher education'
        },
        {
          title: 'Hoodie Economy Value',
          value: '$2.4B',
          change: '+18.7%',
          trend: 'up',
          description: 'Total value created through imagination credit systems'
        },
        {
          title: 'Global Reach',
          value: '14',
          change: '+3',
          trend: 'up',
          description: 'Countries with active AIME programs and partnerships'
        },
        {
          title: 'Indigenous Programs',
          value: '127',
          change: '+23',
          trend: 'up',
          description: 'Community-led programs supporting Indigenous young people'
        },
        {
          title: 'Systems Change Projects',
          value: '8',
          change: 'Active',
          trend: 'stable',
          description: 'Major transformation initiatives across sectors'
        }
      ])

      setProjectsData([
        {
          name: 'Joy Corps',
          phase: 'Production',
          completion: 85,
          impact: 'Organizational transformation through relational economics',
          projectedValue: '$125T market opportunity',
          target2025: '500 organizations transformed'
        },
        {
          name: 'IMAGI-Labs',
          phase: 'Development',
          completion: 72,
          impact: 'Education system transformation through imagination',
          projectedValue: '$7.3T education market',
          target2025: '1,000 schools reimagined'
        },
        {
          name: 'Indigenous Knowledge Systems',
          phase: 'Production',
          completion: 91,
          impact: 'Traditional wisdom in contemporary design',
          projectedValue: '$2.4T R&D market',
          target2025: '200 knowledge partnerships'
        },
        {
          name: 'Presidents Program',
          phase: 'Development',
          completion: 68,
          impact: 'Youth leadership in custodial economies',
          projectedValue: '$800B nature repair market',
          target2025: '10,000 young leaders'
        },
        {
          name: 'Citizens Initiative',
          phase: 'Design',
          completion: 45,
          impact: 'Relational change-maker development',
          projectedValue: '$2.3T social impact sector',
          target2025: '50,000 change-makers'
        },
        {
          name: 'Custodians Network',
          phase: 'Production',
          completion: 78,
          impact: 'Distributed governance models',
          projectedValue: '$350B org development market',
          target2025: '1,000 governance models'
        },
        {
          name: 'Mentor Credit',
          phase: 'Development',
          completion: 63,
          impact: 'Knowledge exchange through relational economics',
          projectedValue: '$7T human capital investment',
          target2025: '100,000 mentors activated'
        },
        {
          name: 'Systems Change Residency',
          phase: 'Production',
          completion: 82,
          impact: 'Earth-shot solutions for planetary transformation',
          projectedValue: '$1.5T required investment',
          target2025: '130 earth-shot projects'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
      case 'down':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-600 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Design':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Development':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Production':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Release':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AIME Impact Dashboards</h1>
              <p className="text-lg text-gray-600">Real-time insights into transformation and systems change</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'projects', label: 'Projects', icon: GlobeAltIcon },
              { id: 'economics', label: 'Economics', icon: CurrencyDollarIcon },
              { id: 'education', label: 'Education', icon: AcademicCapIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Impact Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {impactData.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">20-Year Impact Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transformation Scale</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">75,000+ young people directly impacted</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">500+ educational institutions transformed</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">14 countries with active programs</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">127 Indigenous community programs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Systems Innovation</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Hoodie Economics framework pioneered</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Indigenous knowledge systems integrated</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Imagination-centered curriculum developed</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Relational economics models proven</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transformation Projects</h2>
              <div className="space-y-6">
                {projectsData.map((project, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPhaseColor(project.phase)}`}>
                            {project.phase}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{project.impact}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{project.completion}%</div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Market Opportunity: </span>
                        <span className="text-gray-600">{project.projectedValue}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">2025 Target: </span>
                        <span className="text-gray-600">{project.target2025}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Economics Tab */}
        {activeTab === 'economics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hoodie Economics Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$2.4B</div>
                  <div className="text-sm text-gray-600">Total Value Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">156K</div>
                  <div className="text-sm text-gray-600">Imagination Credits Issued</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                  <div className="text-sm text-gray-600">Participant Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Economic Model Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Digital Hoodies Traded</span>
                  <span className="font-semibold">23,456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Active Participants</span>
                  <span className="font-semibold">12,890</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Partner Organizations</span>
                  <span className="font-semibold">67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Value Per Credit</span>
                  <span className="font-semibold">$15.40</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Educational Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
                  <div className="text-sm text-gray-600">University Enrollment Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                  <div className="text-sm text-gray-600">Program Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Schools Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">15,000+</div>
                  <div className="text-sm text-gray-600">Educators Trained</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Imagination Curriculum Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Student Engagement</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Cultural Identity Strengthening</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Creative Thinking Development</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}