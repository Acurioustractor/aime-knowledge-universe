/**
 * Hoodie Stock Exchange Observatory
 * 
 * Philosophy-first demonstration of hoodie economics using real Airtable data
 * Shows relational value creation, community impact, and implementation pathways
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  HeartIcon,
  LightBulbIcon,
  UsersIcon,
  TrendingUpIcon,
  BookOpenIcon,
  SparklesIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import HoodieObservatoryDashboard from '@/components/hoodie-observatory/HoodieObservatoryDashboard';
import CommunityImpactVisualization from '@/components/hoodie-observatory/CommunityImpactVisualization';
import HoodieJourneyVisualization from '@/components/hoodie-observatory/HoodieJourneyVisualization';
import HoodieEconomicsBusinessCase from '@/components/hoodie-observatory/HoodieEconomicsBusinessCase';
import { HoodieStockExchangeData, ExchangeStats } from '@/lib/integrations/hoodie-stock-exchange-data';

export default function HoodieObservatoryPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'dashboard' | 'community' | 'journey' | 'business' | 'implementation'>('overview');
  const [hoodies, setHoodies] = useState<HoodieStockExchangeData[]>([]);
  const [stats, setStats] = useState<ExchangeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObservatoryData();
  }, []);

  const loadObservatoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hoodie-exchange?action=list');
      const result = await response.json();
      
      if (result.success) {
        setHoodies(result.data.hoodies);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error loading observatory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const philosophyPrinciples = [
    {
      title: "Relational Value Creation",
      description: "Value increases through relationships and community impact, not artificial scarcity",
      icon: <HeartIcon className="h-6 w-6" />,
      example: "When someone earns a mentoring hoodie, it creates value for their mentees, the community, and future mentors",
      contrast: "Traditional systems: Value through exclusivity and competition"
    },
    {
      title: "Collective Abundance",
      description: "Individual achievements create shared resources and community wealth",
      icon: <UsersIcon className="h-6 w-6" />,
      example: "Each hoodie earned generates imagination credits that fund community programs and support systems",
      contrast: "Traditional systems: Individual accumulation at community expense"
    },
    {
      title: "Impact Multiplication",
      description: "Success is measured by how much positive change you enable in others",
      icon: <TrendingUpIcon className="h-6 w-6" />,
      example: "A systems thinking hoodie holder's impact multiplies as they help others see interconnections",
      contrast: "Traditional systems: Success measured by personal gain and status"
    },
    {
      title: "Sustainable Stewardship",
      description: "Long-term thinking and custodial responsibility guide all decisions",
      icon: <GlobeAltIcon className="h-6 w-6" />,
      example: "Hoodie holders are stewards who ensure knowledge and resources benefit future generations",
      contrast: "Traditional systems: Short-term profit maximization"
    }
  ];

  const implementationPathways = [
    {
      title: "Organizational Assessment",
      description: "Evaluate your organization's readiness for relational economics",
      steps: [
        "Map current value creation systems",
        "Identify relationship-building opportunities",
        "Assess community impact potential",
        "Design recognition systems that reward collective benefit"
      ],
      timeframe: "2-4 weeks",
      difficulty: "Beginner"
    },
    {
      title: "Community Building",
      description: "Create systems that strengthen relationships and shared purpose",
      steps: [
        "Establish mentoring and knowledge-sharing programs",
        "Design collaborative achievement recognition",
        "Build feedback loops that strengthen community bonds",
        "Create spaces for story-sharing and vision alignment"
      ],
      timeframe: "1-3 months",
      difficulty: "Intermediate"
    },
    {
      title: "Value System Transformation",
      description: "Shift from transactional to relational value measurement",
      steps: [
        "Develop impact-based success metrics",
        "Create systems for tracking community benefit",
        "Implement long-term thinking in decision-making",
        "Build abundance mindset throughout organization"
      ],
      timeframe: "3-6 months",
      difficulty: "Advanced"
    },
    {
      title: "Ecosystem Integration",
      description: "Connect with broader networks practicing hoodie economics",
      steps: [
        "Join communities of practice",
        "Share learnings and receive feedback",
        "Collaborate on larger impact initiatives",
        "Become a model for others to follow"
      ],
      timeframe: "6-12 months",
      difficulty: "Expert"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Hoodie Observatory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <HeartIcon className="h-10 w-10" />
              Hoodie Economics Observatory
            </h1>
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Witness relational economics in action through AIME's hoodie ecosystem. 
              See how individual achievement creates collective abundance and community value.
            </p>
            <div className="bg-white/10 rounded-lg p-6 max-w-4xl mx-auto">
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong>What you'll discover:</strong> This observatory uses real data from AIME's hoodie system to demonstrate 
                how relational economics creates sustainable value. Unlike traditional stock exchanges that profit from scarcity, 
                hoodie economics shows how abundance grows when shared, how relationships create lasting value, 
                and how community benefit drives individual success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-4">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'overview'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LightBulbIcon className="h-4 w-4 inline mr-2" />
              Philosophy Overview
            </button>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'dashboard'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="h-4 w-4 inline mr-2" />
              Live Observatory
            </button>
            <button
              onClick={() => setActiveSection('community')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'community'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <UsersIcon className="h-4 w-4 inline mr-2" />
              Community Impact
            </button>
            <button
              onClick={() => setActiveSection('journey')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'journey'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <HeartIcon className="h-4 w-4 inline mr-2" />
              Journey
            </button>
            <button
              onClick={() => setActiveSection('business')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'business'
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChartBarIcon className="h-4 w-4 inline mr-2" />
              Business Case
            </button>
            <button
              onClick={() => setActiveSection('implementation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'implementation'
                  ? 'bg-orange-100 text-orange-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BuildingLibraryIcon className="h-4 w-4 inline mr-2" />
              Implementation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Philosophy Overview */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Understanding Hoodie Economics
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Hoodie economics represents a fundamental shift from transactional to relational value creation. 
                    Named after the hoodie as a symbol of comfort, belonging, and inclusive community, this approach 
                    demonstrates how individual achievement can create collective abundance rather than individual wealth accumulation.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-2">The Core Insight</h3>
                    <p className="text-purple-800 text-sm">
                      Traditional stock exchanges create value through artificial scarcity - the fewer people who can access something, 
                      the more valuable it becomes. Hoodie economics inverts this: value increases as more people benefit, 
                      creating sustainable abundance that serves entire communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {philosophyPrinciples.map((principle, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {principle.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{principle.title}</h3>
                      <p className="text-gray-700 text-sm mb-4">{principle.description}</p>
                      
                      <div className="bg-green-50 rounded-lg p-3 mb-3">
                        <div className="font-medium text-green-900 text-sm mb-1">Hoodie Economics Example:</div>
                        <div className="text-green-800 text-xs">{principle.example}</div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-3">
                        <div className="font-medium text-red-900 text-sm mb-1">Traditional Contrast:</div>
                        <div className="text-red-800 text-xs">{principle.contrast}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Real Data Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">See It In Action</h2>
                <p className="text-gray-700">
                  This observatory uses real data from AIME's hoodie system to demonstrate these principles
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats?.total_hoodies || 0}</div>
                  <div className="text-sm text-gray-600">Active Hoodies</div>
                  <div className="text-xs text-gray-500 mt-1">Each representing community value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats?.total_holders || 0}</div>
                  <div className="text-sm text-gray-600">Community Holders</div>
                  <div className="text-xs text-gray-500 mt-1">People creating collective impact</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(stats?.average_imagination_credits || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Credits</div>
                  <div className="text-xs text-gray-500 mt-1">Relational value per hoodie</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    ${Math.round(stats?.total_market_value || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Community Value</div>
                  <div className="text-xs text-gray-500 mt-1">Total abundance created</div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Explore the Live Observatory
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Observatory Dashboard */}
        {activeSection === 'dashboard' && (
          <HoodieObservatoryDashboard />
        )}

        {/* Community Impact Visualization */}
        {activeSection === 'community' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <UsersIcon className="h-6 w-6 text-green-600" />
                Community Impact Network
              </h2>
              <p className="text-gray-700 mb-6">
                This visualization shows how hoodie economics creates interconnected value flows throughout the community. 
                Each connection represents a relationship that generates mutual benefit, demonstrating how individual success 
                contributes to collective abundance.
              </p>
            </div>
            
            <CommunityImpactVisualization hoodies={hoodies} stats={stats} />
          </div>
        )}

        {/* Hoodie Journey Visualization */}
        {activeSection === 'journey' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <HeartIcon className="h-6 w-6 text-purple-600" />
                The Hoodie Journey
              </h2>
              <p className="text-gray-700 mb-6">
                Follow the complete journey from hoodie discovery to community impact amplification. 
                This visualization shows how individual achievement creates collective value at every stage, 
                demonstrating the philosophy of relational economics in practice.
              </p>
            </div>
            
            <HoodieJourneyVisualization 
              selectedHoodie={hoodies[0]} 
              onStageSelect={(stageId) => console.log('Stage selected:', stageId)}
            />
          </div>
        )}

        {/* Business Case */}
        {activeSection === 'business' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
                Business Case for Hoodie Economics
              </h2>
              <p className="text-gray-700 mb-6">
                Comprehensive analysis of the business value, ROI, and implementation considerations 
                for organizations adopting hoodie economics principles. Based on real-world case studies 
                and measurable outcomes.
              </p>
            </div>
            
            <HoodieEconomicsBusinessCase stats={stats} />
          </div>
        )}

        {/* Implementation Pathways */}
        {activeSection === 'implementation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <BuildingLibraryIcon className="h-6 w-6 text-orange-600" />
                Implementation Pathways
              </h2>
              <p className="text-gray-700 mb-6">
                Ready to implement hoodie economics in your organization or community? These pathways provide structured 
                approaches for transitioning from transactional to relational value systems.
              </p>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">Getting Started</h3>
                <p className="text-orange-800 text-sm">
                  Each pathway builds on the previous one, creating a comprehensive transformation journey. 
                  Start with organizational assessment to understand your current state, then progressively 
                  build community systems and relational value measurement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {implementationPathways.map((pathway, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{pathway.title}</h3>
                      <p className="text-gray-600 text-sm">{pathway.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Implementation Steps:</h4>
                    <ul className="space-y-2">
                      {pathway.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Timeframe:</span>
                        <span className="font-medium text-gray-900">{pathway.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Level:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pathway.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          pathway.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          pathway.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pathway.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Implementing hoodie economics requires commitment to long-term thinking and community benefit. 
                  Start with small experiments, build on successes, and always prioritize relationships over transactions.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Study the Observatory
                  </button>
                  <button
                    onClick={() => setActiveSection('community')}
                    className="px-6 py-3 bg-white text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                  >
                    Explore Community Impact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}