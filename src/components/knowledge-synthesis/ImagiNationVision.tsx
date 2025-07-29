"use client"

import { useState } from 'react'

interface VisionElement {
  title: string
  description: string
  details: string
  impact: string
  timeline: string
}

interface CapitalShiftArea {
  sector: string
  current: string
  target: string
  mechanism: string
  expectedImpact: string
  examples: string[]
}

interface TransformationPathway {
  stage: string
  description: string
  keyActions: string[]
  indicators: string[]
  timeframe: string
}

const visionElements: VisionElement[] = [
  {
    title: "Global Network of Change Agents",
    description: "A worldwide community of young people, mentors, and organizations working together to create systemic change.",
    details: "IMAGI-NATION connects local movements across the globe, sharing resources, knowledge, and support while respecting cultural sovereignty and local leadership.",
    impact: "1 million young people directly engaged in systemic change work",
    timeline: "5-7 years"
  },
  {
    title: "Alternative Economic Systems",
    description: "Demonstrating and scaling viable alternatives to extractive capitalism that prioritize wellbeing over profit.",
    details: "Hoodie economics principles implemented across multiple sectors, creating new models of value creation and exchange that benefit communities.",
    impact: "$100M shifted from extractive to regenerative economic models",
    timeline: "3-5 years"
  },
  {
    title: "Indigenous Knowledge Renaissance",
    description: "Elevation and integration of Indigenous custodianship in global decision-making and problem-solving.",
    details: "Traditional knowledge systems recognized and resourced as essential solutions for climate, social, and economic challenges.",
    impact: "Indigenous knowledge systems integrated into policy and education globally",
    timeline: "7-10 years"
  },
  {
    title: "Regenerative Education Revolution",
    description: "Education systems transformed to prioritize relationship, creativity, and cultural connection over competition and standardization.",
    details: "Joy Corps methodology and Indigenous pedagogies reshape how learning happens, creating environments where all young people can thrive.",
    impact: "10,000 schools implementing relationship-first education models",
    timeline: "5-8 years"
  },
  {
    title: "Climate Justice Through Community",
    description: "Community-led solutions to climate change that address justice, sovereignty, and healing simultaneously.",
    details: "Local communities empowered to lead climate solutions that also strengthen cultural identity and economic sovereignty.",
    impact: "1,000 communities implementing community-led climate solutions",
    timeline: "3-7 years"
  }
]

const capitalShiftAreas: CapitalShiftArea[] = [
  {
    sector: "Education",
    current: "Standardized testing, competitive ranking, institutional control",
    target: "Relationship-based learning, community-owned education, cultural curriculum",
    mechanism: "Direct funding to community education initiatives, mentor network expansion",
    expectedImpact: "Improved engagement, cultural connection, and life outcomes for Indigenous and marginalized youth",
    examples: ["Community-controlled schools", "Cultural immersion programs", "Peer mentoring networks"]
  },
  {
    sector: "Economic Development",
    current: "Corporate extraction, profit maximization, external ownership",
    target: "Community ownership, regenerative practices, local wealth building",
    mechanism: "Investment in community enterprises, cooperative development, local currency systems",
    expectedImpact: "Increased community wealth retention, sustainable livelihoods, reduced inequality",
    examples: ["Community land trusts", "Cooperative businesses", "Local currency systems"]
  },
  {
    sector: "Healthcare & Wellbeing",
    current: "Disease treatment focus, individual solutions, medical model dominance",
    target: "Community wellbeing, prevention through connection, holistic approaches",
    mechanism: "Funding for community healing programs, traditional medicine integration, mental health support",
    expectedImpact: "Improved community mental health, cultural healing, reduced health disparities",
    examples: ["Community healing circles", "Cultural wellness programs", "Peer support networks"]
  },
  {
    sector: "Technology & Innovation",
    current: "Extractive data practices, centralized platforms, profit-driven development",
    target: "Community-controlled technology, data sovereignty, purpose-driven innovation",
    mechanism: "Investment in Indigenous-led tech, community platform development, ethical AI initiatives",
    expectedImpact: "Digital sovereignty, culturally appropriate technology, community-controlled data",
    examples: ["Indigenous language apps", "Community networking platforms", "Cultural preservation tech"]
  }
]

const transformationPathways: TransformationPathway[] = [
  {
    stage: "Foundation Building",
    description: "Establishing strong relationships, shared understanding, and initial community connections",
    keyActions: [
      "Deep listening and relationship building with communities",
      "Cultural protocol establishment and respect systems",
      "Local leadership identification and support",
      "Shared vision development through community dialogue"
    ],
    indicators: [
      "Trust levels between communities and AIME",
      "Cultural protocol adherence",
      "Community participation rates",
      "Local leadership engagement"
    ],
    timeframe: "Years 1-2"
  },
  {
    stage: "Community Empowerment",
    description: "Transferring ownership and control to communities while providing ongoing support",
    keyActions: [
      "Community ownership transfer processes",
      "Local capacity building and training",
      "Resource allocation decision-making by communities",
      "Peer-to-peer learning network development"
    ],
    indicators: [
      "Community-led decision making",
      "Local capacity metrics",
      "Resource flow transparency",
      "Network strength measures"
    ],
    timeframe: "Years 2-4"
  },
  {
    stage: "System Innovation",
    description: "Creating new systems and structures that embody alternative values and approaches",
    keyActions: [
      "Alternative economic model implementation",
      "Policy advocacy and systemic change work",
      "New institution creation (schools, businesses, governance)",
      "Cross-sector collaboration development"
    ],
    indicators: [
      "Alternative system adoption rates",
      "Policy change achievements",
      "New institution sustainability",
      "Cross-sector partnership strength"
    ],
    timeframe: "Years 3-6"
  },
  {
    stage: "Global Movement",
    description: "Scaling and connecting local transformations into a global movement for change",
    keyActions: [
      "International network connection and solidarity",
      "Global resource sharing and mutual support",
      "Policy influence at international level",
      "Movement narrative and story sharing"
    ],
    indicators: [
      "International partnership quality",
      "Global resource flow equity",
      "International policy influence",
      "Movement narrative reach"
    ],
    timeframe: "Years 5-10"
  }
]

export default function ImagiNationVision() {
  const [activeTab, setActiveTab] = useState<'vision' | 'capital' | 'theory' | 'pathways'>('vision')
  const [selectedElement, setSelectedElement] = useState<VisionElement | null>(null)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">IMAGI-NATION Vision</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          A global movement for systemic change that prioritizes relationships, Indigenous custodianship, 
          and community wellbeing over profit and extraction. Imagining and building the world our 
          great-great-great-great-great-great-grandchildren deserve.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'vision', label: 'Vision & Goals', icon: '🌟' },
            { id: 'capital', label: '$100M Capital Shift', icon: '💰' },
            { id: 'theory', label: 'Systemic Change Theory', icon: '🔄' },
            { id: 'pathways', label: 'Future Pathways', icon: '🛤️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Vision & Goals Tab */}
      {activeTab === 'vision' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Core Vision Elements</h2>
          
          {/* Vision Statement */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">IMAGI-NATION Declaration</h3>
            <p className="text-lg leading-relaxed">
              We imagine a world where every young person knows they matter, where Indigenous custodianship 
              guides our decisions, where communities control their own destinies, and where the 
              economy serves life rather than extraction. This is not just a dream - it's an 
              inevitable future we're building together, one relationship at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Elements */}
            <div className="space-y-4">
              {visionElements.map((element, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedElement?.title === element.title
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedElement(element)}
                >
                  <h3 className="text-lg font-semibold mb-2">{element.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{element.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Timeline: {element.timeline}</span>
                    <span>Impact: {element.impact}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Element Detail */}
            <div className="sticky top-6">
              {selectedElement ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-4">{selectedElement.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
                      <p className="text-gray-700">{selectedElement.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
                      <p className="text-gray-700">{selectedElement.details}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expected Impact</h4>
                      <p className="text-purple-600 font-medium">{selectedElement.impact}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                      <p className="text-gray-600">{selectedElement.timeline}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-lg font-semibold mb-2">Explore the Vision</h3>
                  <p className="text-gray-600">Click on any element to learn more about how we're building this future together.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Capital Shift Tab */}
      {activeTab === 'capital' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">$100M Capital Shift Initiative</h2>
          
          {/* Overview */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-green-900 mb-3">The Challenge & Opportunity</h3>
            <p className="text-green-800 mb-4">
              Currently, billions flow into systems that perpetuate inequality, environmental destruction, 
              and cultural erosion. Our $100M capital shift initiative demonstrates how redirecting 
              even a small fraction of global capital can create transformative change.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">$100M</div>
                <div className="text-green-700 text-sm">Target Capital Shift</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">10-Year</div>
                <div className="text-green-700 text-sm">Implementation Timeline</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">1M+</div>
                <div className="text-green-700 text-sm">Lives Directly Impacted</div>
              </div>
            </div>
          </div>

          {/* Capital Shift Areas */}
          <div className="space-y-6">
            {capitalShiftAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <h3 className="text-xl font-semibold">{area.sector}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Current System</h4>
                      <p className="text-gray-700 text-sm">{area.current}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Target System</h4>
                      <p className="text-gray-700 text-sm">{area.target}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shift Mechanism</h4>
                      <p className="text-gray-700 text-sm">{area.mechanism}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expected Impact</h4>
                      <p className="text-gray-700 text-sm">{area.expectedImpact}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {area.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Projections */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">10-Year Impact Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-blue-100">Young people directly engaged</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">10K</div>
                <div className="text-green-100">Community enterprises supported</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">500</div>
                <div className="text-purple-100">Policy changes influenced</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">50</div>
                <div className="text-orange-100">Countries with active programs</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Systemic Change Theory Tab */}
      {activeTab === 'theory' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Theory of Systemic Change</h2>
          
          {/* Core Theory */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Relationship-Driven Systems Change</h3>
            <p className="text-gray-700 mb-4">
              Real systemic change happens through relationships, not institutions. When we change 
              how people relate to each other and their environment, we change the systems those 
              relationships create and sustain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Individual Level</h4>
                <p className="text-gray-600 text-sm">
                  Personal transformation through relationship, cultural connection, and purpose discovery
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">Community Level</h4>
                <p className="text-gray-600 text-sm">
                  Community ownership and control of resources, decision-making, and cultural practices
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Systems Level</h4>
                <p className="text-gray-600 text-sm">
                  New institutions and structures that embody alternative values and ways of being
                </p>
              </div>
            </div>
          </div>

          {/* Change Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Indigenous Systems Thinking</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🌐</span>
                  <span className="text-gray-700">Everything is connected - no issue exists in isolation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🔄</span>
                  <span className="text-gray-700">Circular thinking - outcomes feed back into inputs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">⏳</span>
                  <span className="text-gray-700">Seven-generation time horizon for decision making</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🤝</span>
                  <span className="text-gray-700">Relationship quality determines system health</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Change Mechanisms</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">💚</span>
                  <span className="text-gray-700">Love and care as primary motivators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">📖</span>
                  <span className="text-gray-700">Story and narrative to shift consciousness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🌱</span>
                  <span className="text-gray-700">Small experiments that prove new possibilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🌊</span>
                  <span className="text-gray-700">Movement building through connection and solidarity</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Systems Map */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Interconnected Systems Change</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Education</h4>
                <p className="text-sm">Relationship-first learning that honors all ways of knowing</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Economics</h4>
                <p className="text-sm">Community-controlled wealth building and alternative exchange</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Governance</h4>
                <p className="text-sm">Consensus-based decision making and community sovereignty</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Environment</h4>
                <p className="text-sm">Indigenous land management and regenerative practices</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Future Pathways Tab */}
      {activeTab === 'pathways' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Transformation Pathways</h2>
          
          {/* Pathway Overview */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-6">
              Our transformation happens through four interconnected stages, each building on the 
              relationships and foundations of the previous stage while maintaining community 
              ownership and cultural sovereignty.
            </p>
          </div>

          {/* Transformation Stages */}
          <div className="space-y-8">
            {transformationPathways.map((pathway, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className={`p-4 ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' :
                  index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{pathway.stage}</h3>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {pathway.timeframe}
                    </span>
                  </div>
                  <p className="mt-2 opacity-90">{pathway.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Actions</h4>
                      <ul className="space-y-2">
                        {pathway.keyActions.map((action, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Success Indicators</h4>
                      <ul className="space-y-2">
                        {pathway.indicators.map((indicator, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2">📊</span>
                            <span className="text-gray-700 text-sm">{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
            <p className="text-lg mb-6">
              IMAGI-NATION is not just a vision - it's a call to action. Every relationship built, 
              every young person supported, every community empowered brings us closer to the world 
              our great-great-great-great-great-great-grandchildren deserve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Start Where You Are</h4>
                <p className="text-sm opacity-90">Build authentic relationships in your community</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Connect & Learn</h4>
                <p className="text-sm opacity-90">Join the global network of change agents</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Transform Systems</h4>
                <p className="text-sm opacity-90">Create new ways of being and doing together</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}