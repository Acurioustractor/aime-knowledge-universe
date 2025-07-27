"use client"

import { useState } from 'react'

interface EconomicPrinciple {
  title: string
  description: string
  example: string
  visualization: string
}

interface ComparisonItem {
  aspect: string
  traditional: string
  hoodie: string
  impact: string
}

const hoodieEconomicsPrinciples: EconomicPrinciple[] = [
  {
    title: "Relational Value Creation",
    description: "Value is created through relationships and connections, not just transactions. The quality of relationships determines the quality of outcomes.",
    example: "A mentoring session creates value for both mentor and mentee that extends far beyond any monetary exchange - knowledge transfer, emotional support, network expansion, and personal growth.",
    visualization: "🤝"
  },
  {
    title: "Community-Centered Exchange",
    description: "Economic activity serves community wellbeing first, with individual benefit flowing from collective prosperity.",
    example: "When a community invests in education for young people, the benefits return to strengthen the entire community through increased capacity, innovation, and social cohesion.",
    visualization: "🌐"
  },
  {
    title: "Seven-Generation Thinking",
    description: "Economic decisions consider their impact seven generations into the future, prioritizing long-term sustainability over short-term gain.",
    example: "Instead of extracting maximum profit from natural resources, decisions consider how those resources will be available for great-great-great-great-great-great-grandchildren.",
    visualization: "🌳"
  },
  {
    title: "Gift Economy Elements",
    description: "Resources flow based on need and abundance rather than purely transactional exchange, creating cycles of reciprocity.",
    example: "Knowledge and skills are shared freely, creating a network of mutual support where giving creates receiving through relationship rather than direct payment.",
    visualization: "🎁"
  },
  {
    title: "Cultural Wealth Recognition",
    description: "Indigenous knowledge, community wisdom, and cultural practices are recognized as valuable economic assets deserving of protection and investment.",
    example: "Traditional ecological knowledge is valued and compensated as intellectual property, with communities benefiting from sustainable applications of their ancestral wisdom.",
    visualization: "💎"
  },
  {
    title: "Holistic Impact Measurement",
    description: "Success is measured across social, cultural, environmental, and economic dimensions, not just financial returns.",
    example: "A program's success includes improved relationships, cultural connection, environmental sustainability, and community capacity alongside any monetary outcomes.",
    visualization: "📊"
  }
]

const economicComparison: ComparisonItem[] = [
  {
    aspect: "Primary Goal",
    traditional: "Maximize profit/individual wealth",
    hoodie: "Maximize community wellbeing",
    impact: "Shifts focus from extraction to regeneration"
  },
  {
    aspect: "Value Source",
    traditional: "Scarcity and competition",
    hoodie: "Relationship and abundance",
    impact: "Creates collaborative rather than competitive dynamics"
  },
  {
    aspect: "Time Horizon",
    traditional: "Quarterly/annual returns",
    hoodie: "Seven generations",
    impact: "Prioritizes sustainability over quick gains"
  },
  {
    aspect: "Resource Distribution",
    traditional: "Market-based allocation",
    hoodie: "Need and contribution-based",
    impact: "Reduces inequality and ensures basic needs are met"
  },
  {
    aspect: "Decision Making",
    traditional: "Shareholder primacy",
    hoodie: "Community consensus",
    impact: "Includes all stakeholders in economic decisions"
  },
  {
    aspect: "Success Metrics",
    traditional: "GDP, profit margins, ROI",
    hoodie: "Relationship quality, cultural vitality, ecological health",
    impact: "Measures what truly matters for human flourishing"
  }
]

const relationalValueFramework = {
  dimensions: [
    {
      name: "Social Capital",
      description: "The networks of relationships that enable society to function effectively",
      measurement: "Trust levels, network density, collaboration frequency",
      examples: ["Mentoring relationships", "Community partnerships", "Peer support networks"]
    },
    {
      name: "Cultural Capital",
      description: "Knowledge, skills, education, and cultural practices that provide social advantage",
      measurement: "Cultural practice preservation, knowledge transfer rates, identity strength",
      examples: ["Traditional knowledge sharing", "Language preservation", "Cultural ceremonies"]
    },
    {
      name: "Spiritual Capital",
      description: "Sense of purpose, meaning, and connection to something greater than oneself",
      measurement: "Sense of purpose surveys, community connection metrics, wellbeing indicators",
      examples: ["Connection to country", "Spiritual practices", "Life purpose clarity"]
    },
    {
      name: "Natural Capital",
      description: "The world's stocks of natural assets including geology, soil, air, water and all living things",
      measurement: "Ecosystem health, biodiversity indices, resource sustainability",
      examples: ["Land care practices", "Sustainable resource use", "Environmental stewardship"]
    }
  ]
}

export default function SystemsEconomics() {
  const [activeTab, setActiveTab] = useState<'principles' | 'comparison' | 'framework' | 'models' | 'grp'>('principles')
  const [selectedPrinciple, setSelectedPrinciple] = useState<EconomicPrinciple | null>(null)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Systems & Economics</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Understanding hoodie economics - an alternative economic framework based on relationships, 
          community wellbeing, and Indigenous principles of value creation and exchange.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'principles', label: 'Hoodie Economics Principles', icon: '🏠' },
            { id: 'comparison', label: 'Economic Models Comparison', icon: '⚖️' },
            { id: 'framework', label: 'Relational Value Framework', icon: '🔗' },
            { id: 'models', label: 'Alternative Models', icon: '🌟' },
            { id: 'grp', label: 'GRP: $1 Trillion Potential', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Hoodie Economics Principles Tab */}
      {activeTab === 'principles' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Core Principles of Hoodie Economics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Principles List */}
            <div className="space-y-4">
              {hoodieEconomicsPrinciples.map((principle, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPrinciple?.title === principle.title
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                  onClick={() => setSelectedPrinciple(principle)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{principle.visualization}</span>
                    <h3 className="text-lg font-semibold">{principle.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>

            {/* Principle Detail */}
            <div className="sticky top-6">
              {selectedPrinciple ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{selectedPrinciple.visualization}</span>
                    <h3 className="text-xl font-semibold">{selectedPrinciple.title}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Principle</h4>
                      <p className="text-gray-700">{selectedPrinciple.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Real-World Example</h4>
                      <p className="text-gray-700">{selectedPrinciple.example}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold mb-2">Explore Hoodie Economics</h3>
                  <p className="text-gray-600">Click on any principle to learn more about how it works in practice.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Economic Models Comparison Tab */}
      {activeTab === 'comparison' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Traditional vs. Hoodie Economics</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aspect</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Traditional Economics</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hoodie Economics</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Impact of Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {economicComparison.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.aspect}</td>
                    <td className="px-6 py-4 text-gray-700">{item.traditional}</td>
                    <td className="px-6 py-4 text-gray-700">{item.hoodie}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{item.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Paradigm Shift</h3>
              <p className="text-blue-800">
                From competition-based scarcity thinking to collaboration-based abundance mindset.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Value Redefinition</h3>
              <p className="text-green-800">
                Recognizing forms of value beyond monetary - relationships, culture, environment, wellbeing.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Sustainable Future</h3>
              <p className="text-purple-800">
                Building economic systems that can sustain for seven generations while meeting present needs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Relational Value Framework Tab */}
      {activeTab === 'framework' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Relational Value Creation Framework</h2>
          <p className="text-lg text-gray-700 mb-8">
            A comprehensive approach to measuring and creating value that goes beyond financial metrics 
            to include the full spectrum of what makes communities thrive.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {relationalValueFramework.dimensions.map((dimension, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{dimension.name}</h3>
                <p className="text-gray-700 mb-4">{dimension.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How We Measure It</h4>
                    <p className="text-gray-600 text-sm">{dimension.measurement}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Examples in Practice</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {dimension.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Measurement Methods */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Integrated Measurement Approach</h3>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Quantitative Methods</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-200 mr-2">📊</span>
                      Survey instruments for wellbeing and connection
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-200 mr-2">📈</span>
                      Network analysis for relationship mapping
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-200 mr-2">🔢</span>
                      Environmental and economic impact metrics
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4">Qualitative Methods</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-200 mr-2">💬</span>
                      Story collection and narrative analysis
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-200 mr-2">👥</span>
                      Community reflection and dialogue processes
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-200 mr-2">🎭</span>
                      Cultural expression and artistic documentation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Models Tab */}
      {activeTab === 'models' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Alternative Economic Models</h2>
          <p className="text-lg text-gray-700 mb-8">
            Exploring diverse economic approaches that align with hoodie economics principles, 
            drawing from Indigenous economies, ecological economics, and cooperative models.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gift Economy */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎁</span>
                <h3 className="text-xl font-semibold">Gift Economy</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Resources flow based on generosity and reciprocity rather than market exchange, 
                building social bonds and community resilience.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">In AIME Practice</h4>
                <p className="text-gray-600 text-sm">
                  Knowledge sharing sessions where mentors and mentees exchange insights freely, 
                  creating networks of mutual support and learning.
                </p>
              </div>
            </div>

            {/* Circular Economy */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">♻️</span>
                <h3 className="text-xl font-semibold">Circular Economy</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Economic model that eliminates waste through the continual use of resources 
                in closed-loop systems, mimicking natural cycles.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">In AIME Practice</h4>
                <p className="text-gray-600 text-sm">
                  Alumni become mentors, creating continuous cycles of support and knowledge transfer 
                  that strengthen with each iteration.
                </p>
              </div>
            </div>

            {/* Cooperative Economics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🤝</span>
                <h3 className="text-xl font-semibold">Cooperative Economics</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Ownership and decision-making shared among members based on participation 
                rather than capital investment, prioritizing member benefit over profit.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">In AIME Practice</h4>
                <p className="text-gray-600 text-sm">
                  Community ownership of programs with local advisory groups making decisions 
                  about program direction and resource allocation.
                </p>
              </div>
            </div>

            {/* Ecological Economics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🌱</span>
                <h3 className="text-xl font-semibold">Ecological Economics</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Economic system that operates within ecological limits, recognizing 
                the economy as a subset of the larger environmental system.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">In AIME Practice</h4>
                <p className="text-gray-600 text-sm">
                  Programs that connect young people to country and traditional ecological knowledge, 
                  building understanding of sustainable resource relationships.
                </p>
              </div>
            </div>
          </div>

          {/* Integration Approach */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Integrated Approach</h3>
            <p className="text-lg mb-6">
              Hoodie economics doesn't replace traditional economics entirely, but rather creates 
              space for multiple economic models to coexist and complement each other.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Traditional Sectors</h4>
                <p className="text-sm">
                  Market-based exchange for goods and services where appropriate
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Community Sectors</h4>
                <p className="text-sm">
                  Gift economy and cooperative models for social and cultural activities
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Commons Sectors</h4>
                <p className="text-sm">
                  Shared ownership and stewardship for natural and cultural resources
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRP: Gross Relational Potential Tab */}
      {activeTab === 'grp' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">GRP: Gross Relational Potential - $1 Trillion+ Economic Model</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">IMAGI-NATION Network Value</h3>
            <p className="text-gray-700 mb-4">
              AIME's research identifies <strong>6,000 entities</strong> with collective impact reach of <strong>32 million people</strong>. 
              Using Metcalfe's Law and relational value mathematics, we've calculated the potential network value 
              of focused relationship building and mentoring systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">6,000</div>
                <div className="text-sm text-gray-600">Identified Entities</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">32M</div>
                <div className="text-sm text-gray-600">People Reached</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">$1T+</div>
                <div className="text-sm text-gray-600">GRP Potential</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Network Mathematics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Network Value Mathematics</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Metcalfe's Law Application</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Network value = n(n-1)/2 where n = number of nodes
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>5 nodes:</span>
                        <span className="font-medium">10 relations = $100K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>150 nodes:</span>
                        <span className="font-medium">11,175 relations = $111M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1,500 nodes:</span>
                        <span className="font-medium">1.1M relations = $11B</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">6,000 nodes:</span>
                        <span className="font-bold text-green-600">$1 Trillion+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">UNCx5 Algorithm</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Every 5-person group creates exponential relationship potential
                  </p>
                  <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                    <strong>Formula:</strong> nCr = n!/(n-r)!r! where r=5<br/>
                    <strong>Value per UNCx5:</strong> $100,000 USD<br/>
                    <strong>Result:</strong> Network value approaches infinity at scale
                  </div>
                </div>
              </div>
            </div>

            {/* JOY Corps Model */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 JOY Corps Implementation</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">1,000 JOY Corps Model</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Organizations applying AIME mentoring as one of 70+ activations
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        🌱
                      </div>
                      <div>
                        <div className="font-medium text-green-900">Nature Funds</div>
                        <div className="text-sm text-green-700">Environmental value creation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        ☮️
                      </div>
                      <div>
                        <div className="font-medium text-blue-900">Peace Index</div>
                        <div className="text-sm text-blue-700">Relational health measurement</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        💝
                      </div>
                      <div>
                        <div className="font-medium text-purple-900">Kindness Economics</div>
                        <div className="text-sm text-purple-700">Alternative value systems</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Economic Impact Projections */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">💡 Economic Impact Projections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">$750B</div>
                <div className="text-sm text-gray-700">Nature-based marketplace potential</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">$1B</div>
                <div className="text-sm text-gray-700">R&D value of 6,000 entities</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">1%</div>
                <div className="text-sm text-gray-700">Of global GDP for wellbeing measurement</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
                <div className="text-sm text-gray-700">Value of indigenous knowledge systems</div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🔑 Key GRP Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Relational Economics Foundation</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Each entity impacts 10,000+ people over 60 years</li>
                  <li>• $10,000 average value per relationship</li>
                  <li>• Focus on entities reaching 100K+ people</li>
                  <li>• Dunbar's number limits for authentic connections</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Network Effects</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• One unlikely connection can change the world</li>
                  <li>• Kinship systems create force multipliers</li>
                  <li>• UNCx5 growth fusion activates deep relationships</li>
                  <li>• Value creation in relation to nature, not abstracted from it</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-yellow-200">
              <p className="text-sm text-gray-600 italic">
                "With GRP (Gross Relational Potential) of over trillions of dollars, we believe after 20 years 
                of evidence-based research that we are well placed to help humanity unlock its potential and 
                economic prosperity in relation to nature not abstracted from it." - JMB, Founder
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}