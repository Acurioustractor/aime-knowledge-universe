"use client"

import { useState } from 'react'

interface GettingStartedStep {
  title: string
  description: string
  actions: string[]
  resources: string[]
  timeframe: string
}

interface ContextApplication {
  context: string
  description: string
  adaptations: string[]
  examples: string[]
  considerations: string[]
}

interface Tool {
  name: string
  purpose: string
  description: string
  format: string
  downloadUrl?: string
}

interface AssessmentMethod {
  name: string
  focus: string
  description: string
  questions: string[]
  scoring: string
}

const gettingStartedSteps: GettingStartedStep[] = [
  {
    title: "1. Ground Yourself in Relationship",
    description: "Begin by understanding that all work starts with authentic relationship - with yourself, your community, and the land you're on.",
    actions: [
      "Acknowledge the traditional owners of the land you're on",
      "Reflect on your own story and motivations for this work",
      "Identify existing relationships and community connections",
      "Practice deep listening and genuine curiosity about others"
    ],
    resources: [
      "Cultural protocol guides for your region",
      "Reflection questions for personal story work",
      "Community mapping templates",
      "Active listening practice guides"
    ],
    timeframe: "Ongoing foundation"
  },
  {
    title: "2. Learn and Listen",
    description: "Immerse yourself in learning about Indigenous knowledge systems, community needs, and existing local solutions.",
    actions: [
      "Connect with local Indigenous knowledge holders and elders",
      "Study the history and current context of your local area",
      "Identify existing community organizations and initiatives",
      "Attend community events and listen more than you speak"
    ],
    resources: [
      "Local Indigenous knowledge resources",
      "Community organization directories",
      "Historical context research guides",
      "Community event calendars"
    ],
    timeframe: "3-6 months"
  },
  {
    title: "3. Build Authentic Connections",
    description: "Focus on building genuine relationships based on mutual respect, shared learning, and reciprocal support.",
    actions: [
      "Attend community gatherings and cultural events",
      "Offer your skills and resources in service of community priorities",
      "Share your own story and vulnerabilities authentically",
      "Create regular opportunities for connection and dialogue"
    ],
    resources: [
      "Community engagement best practices",
      "Storytelling and vulnerability guides",
      "Event planning templates",
      "Dialogue facilitation tools"
    ],
    timeframe: "6-12 months"
  },
  {
    title: "4. Start Small and Local",
    description: "Begin with small, local initiatives that respond to community-identified needs and build on existing strengths.",
    actions: [
      "Identify a specific, small-scale opportunity to contribute",
      "Work alongside existing community leaders and organizations",
      "Focus on building relationships rather than delivering programs",
      "Document and share learnings with the broader community"
    ],
    resources: [
      "Project planning templates",
      "Partnership agreements",
      "Community asset mapping tools",
      "Learning documentation guides"
    ],
    timeframe: "12-18 months"
  },
  {
    title: "5. Scale Through Story and Connection",
    description: "Share your experiences and learnings to inspire others while connecting with the broader AIME network.",
    actions: [
      "Document and share stories of relationship and impact",
      "Connect with other AIME practitioners and communities",
      "Offer support and learning to others beginning this journey",
      "Advocate for systemic changes that support community ownership"
    ],
    resources: [
      "Story collection and sharing platforms",
      "AIME network connection tools",
      "Mentorship and support frameworks",
      "Advocacy strategy guides"
    ],
    timeframe: "18+ months"
  }
]

const contextApplications: ContextApplication[] = [
  {
    context: "Educational Institutions",
    description: "Implementing AIME principles within schools, universities, and other learning environments.",
    adaptations: [
      "Relationship-first curriculum design",
      "Community and cultural knowledge integration",
      "Student voice and choice in learning pathways",
      "Mentor and peer support networks"
    ],
    examples: [
      "University mentoring programs connecting Indigenous and non-Indigenous students",
      "Community-controlled early childhood education centers",
      "High school programs that integrate traditional knowledge with contemporary learning",
      "Adult education programs focused on community leadership development"
    ],
    considerations: [
      "Institutional policies and funding structures may conflict with relationship-first approaches",
      "Need for cultural protocol training for all staff and participants",
      "Importance of community ownership and control over cultural content",
      "Balancing academic requirements with holistic development"
    ]
  },
  {
    context: "Healthcare & Wellbeing",
    description: "Applying AIME approaches to community health, mental health, and holistic wellbeing initiatives.",
    adaptations: [
      "Community-defined wellness and health outcomes",
      "Traditional healing and contemporary medicine integration",
      "Peer support and community care models",
      "Addressing social determinants through relationship building"
    ],
    examples: [
      "Community healing circles for trauma and grief",
      "Youth peer support programs for mental health",
      "Traditional medicine and food sovereignty initiatives",
      "Community-controlled health services with cultural healing integration"
    ],
    considerations: [
      "Medical and legal regulations may limit traditional healing integration",
      "Need for trauma-informed and culturally safe practices",
      "Importance of community ownership of health data and decisions",
      "Balancing individual and community approaches to wellness"
    ]
  },
  {
    context: "Community Development",
    description: "Using AIME principles for economic development, housing, and community infrastructure projects.",
    adaptations: [
      "Community ownership and control of development processes",
      "Traditional knowledge integration in planning and design",
      "Relationship-based economic models and exchange systems",
      "Seven-generation thinking in all development decisions"
    ],
    examples: [
      "Community-owned renewable energy projects",
      "Traditional housing and building design initiatives",
      "Local food systems and agricultural projects",
      "Community enterprise and cooperative development"
    ],
    considerations: [
      "Government regulations and funding requirements may conflict with community control",
      "Need for capacity building in project management and technical skills",
      "Importance of environmental and cultural impact assessment",
      "Balancing traditional and contemporary approaches to development"
    ]
  },
  {
    context: "Corporate & Business",
    description: "Integrating AIME principles into business practices, corporate social responsibility, and organizational culture.",
    adaptations: [
      "Stakeholder-first decision making processes",
      "Long-term sustainability over short-term profit",
      "Community partnership and shared ownership models",
      "Cultural competency and Indigenous procurement policies"
    ],
    examples: [
      "Indigenous supplier development and procurement programs",
      "Employee volunteer programs focused on community relationship building",
      "Corporate mentoring partnerships with Indigenous students",
      "Sustainable business practices guided by traditional ecological knowledge"
    ],
    considerations: [
      "Shareholder expectations and profit requirements may conflict with community-first approaches",
      "Need for genuine partnership rather than charitable or extractive relationships",
      "Importance of long-term commitment and relationship building",
      "Risk of cultural appropriation or tokenistic engagement"
    ]
  }
]

const toolsAndFrameworks: Tool[] = [
  {
    name: "Relationship Mapping Template",
    purpose: "Community Connection",
    description: "A visual tool for mapping existing relationships, identifying connection opportunities, and tracking relationship quality over time.",
    format: "PDF Worksheet"
  },
  {
    name: "Cultural Protocol Checklist",
    purpose: "Respectful Engagement",
    description: "Guidelines for engaging respectfully with Indigenous communities, including protocol questions and cultural considerations.",
    format: "Interactive Checklist"
  },
  {
    name: "Seven-Generation Impact Assessment",
    purpose: "Long-term Planning",
    description: "Framework for evaluating decisions and initiatives based on their potential impact seven generations into the future.",
    format: "Assessment Framework"
  },
  {
    name: "Community Asset Inventory",
    purpose: "Strength-Based Planning",
    description: "Tool for identifying and documenting existing community strengths, resources, and assets as foundation for development.",
    format: "Spreadsheet Template"
  },
  {
    name: "Story Collection Kit",
    purpose: "Impact Documentation",
    description: "Guidelines and templates for collecting, documenting, and sharing stories of relationship and impact in culturally appropriate ways.",
    format: "Multi-media Kit"
  },
  {
    name: "Mentoring Partnership Agreement",
    purpose: "Relationship Structure",
    description: "Template for establishing clear expectations, boundaries, and goals for mentoring relationships.",
    format: "Agreement Template"
  }
]

const assessmentMethods: AssessmentMethod[] = [
  {
    name: "Relationship Quality Assessment",
    focus: "Connection Strength",
    description: "Evaluate the quality and depth of relationships within your initiative or community.",
    questions: [
      "How would you describe the level of trust in key relationships?",
      "Do people feel heard and valued in decision-making processes?",
      "Are there strong networks of mutual support and care?",
      "How well are conflicts resolved through dialogue and understanding?"
    ],
    scoring: "5-point scale: 1 (Very Poor) to 5 (Excellent)"
  },
  {
    name: "Cultural Connection Evaluation",
    focus: "Cultural Grounding",
    description: "Assess how well your work connects with and honors Indigenous knowledge and cultural practices.",
    questions: [
      "Are Indigenous voices centered in leadership and decision-making?",
      "How well are traditional knowledge systems integrated into the work?",
      "Do participants report increased connection to culture and identity?",
      "Are cultural protocols consistently followed and respected?"
    ],
    scoring: "Qualitative assessment with community feedback"
  },
  {
    name: "Community Ownership Check",
    focus: "Local Control",
    description: "Evaluate the extent to which communities have genuine ownership and control over initiatives.",
    questions: [
      "Who makes key decisions about direction and resources?",
      "How are community priorities identified and prioritized?",
      "Do communities have control over their own data and stories?",
      "Are there clear pathways for community feedback and change?"
    ],
    scoring: "Community-led assessment process"
  },
  {
    name: "Systemic Impact Review",
    focus: "Systems Change",
    description: "Assess progress toward broader systemic and structural changes.",
    questions: [
      "What systems-level changes have resulted from this work?",
      "How has power and resource distribution been affected?",
      "Are there measurable improvements in community wellbeing indicators?",
      "What policy or structural changes have been influenced or achieved?"
    ],
    scoring: "Mixed methods with quantitative and qualitative indicators"
  }
]

export default function ImplementationPathways() {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'applications' | 'tools' | 'assessment'>('getting-started')
  const [selectedStep, setSelectedStep] = useState<GettingStartedStep | null>(null)
  const [selectedContext, setSelectedContext] = useState<ContextApplication | null>(null)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Implementation Pathways</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Practical guidance for implementing AIME principles and approaches in diverse contexts, 
          with tools, frameworks, and assessment methods to support your journey.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'getting-started', label: 'Getting Started Guide', icon: '🌱' },
            { id: 'applications', label: 'Context Applications', icon: '🔧' },
            { id: 'tools', label: 'Tools & Frameworks', icon: '📋' },
            { id: 'assessment', label: 'Assessment Methods', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Getting Started Tab */}
      {activeTab === 'getting-started' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Journey with AIME Principles</h2>
          
          {/* Introduction */}
          <div className="bg-orange-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-orange-900 mb-3">Before You Begin</h3>
            <p className="text-orange-800 mb-4">
              This is not a program to implement or a curriculum to follow. These are principles 
              and approaches that emerge from relationship and community. Your journey will be 
              unique to your context, community, and connections.
            </p>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Core Principles to Remember</h4>
              <ul className="text-orange-800 text-sm space-y-1">
                <li>• Relationship comes before program</li>
                <li>• Communities own their own solutions</li>
                <li>• Cultural protocols must be respected</li>
                <li>• Change happens through connection, not control</li>
                <li>• Seven-generation thinking guides all decisions</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Steps List */}
            <div className="space-y-4">
              {gettingStartedSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStep?.title === step.title
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedStep(step)}
                >
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <span className="text-xs text-orange-600 font-medium">{step.timeframe}</span>
                </div>
              ))}
            </div>

            {/* Step Detail */}
            <div className="sticky top-6">
              {selectedStep ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-4">{selectedStep.title}</h3>
                  <p className="text-gray-700 mb-4">{selectedStep.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Actions</h4>
                      <ul className="space-y-1">
                        {selectedStep.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Helpful Resources</h4>
                      <ul className="space-y-1">
                        {selectedStep.resources.map((resource, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">📄</span>
                            <span className="text-gray-700 text-sm">{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-1">Timeframe</h4>
                      <p className="text-gray-600 text-sm">{selectedStep.timeframe}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                  <p className="text-gray-600">Click on any step to learn more about beginning your implementation journey.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Context-Specific Applications</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Context Cards */}
            <div className="space-y-4">
              {contextApplications.map((context, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedContext?.context === context.context
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedContext(context)}
                >
                  <h3 className="text-lg font-semibold mb-2">{context.context}</h3>
                  <p className="text-gray-600 text-sm">{context.description}</p>
                </div>
              ))}
            </div>

            {/* Context Detail */}
            <div className="sticky top-6">
              {selectedContext ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-4">{selectedContext.context}</h3>
                  <p className="text-gray-700 mb-4">{selectedContext.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Adaptations</h4>
                      <ul className="space-y-1">
                        {selectedContext.adaptations.map((adaptation, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700 text-sm">{adaptation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                      <ul className="space-y-1">
                        {selectedContext.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">💡</span>
                            <span className="text-gray-700 text-sm">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Important Considerations</h4>
                      <ul className="space-y-1">
                        {selectedContext.considerations.map((consideration, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-yellow-500 mr-2">⚠️</span>
                            <span className="text-gray-700 text-sm">{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold mb-2">Explore Applications</h3>
                  <p className="text-gray-600">Select a context to see how AIME principles can be adapted for different settings.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tools & Frameworks Tab */}
      {activeTab === 'tools' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Tools & Frameworks</h2>
          <p className="text-lg text-gray-700 mb-8">
            Practical tools and frameworks to support your implementation journey. These are starting 
            points that should be adapted to your specific context and community needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsAndFrameworks.map((tool, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <span className="text-xs text-purple-600 font-medium">{tool.purpose}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{tool.format}</span>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Online Learning Modules</h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Cultural Protocol Training</li>
                  <li>• Relationship Building Fundamentals</li>
                  <li>• Community Engagement Best Practices</li>
                  <li>• Mentoring Skills Development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community of Practice</h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Monthly practitioner calls</li>
                  <li>• Regional community networks</li>
                  <li>• Peer mentoring and support</li>
                  <li>• Resource sharing platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Methods Tab */}
      {activeTab === 'assessment' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Assessment & Evaluation Methods</h2>
          <p className="text-lg text-gray-700 mb-8">
            Self-evaluation tools to assess progress and impact. Remember that the most important 
            measures of success are determined by the communities you're working with, not external metrics.
          </p>

          <div className="space-y-8">
            {assessmentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4">
                  <h3 className="text-xl font-semibold">{method.name}</h3>
                  <p className="opacity-90 text-sm">{method.focus}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{method.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Questions</h4>
                      <ul className="space-y-2">
                        {method.questions.map((question, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2">?</span>
                            <span className="text-gray-700 text-sm">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Assessment Approach</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 text-sm">{method.scoring}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Principles */}
          <div className="mt-12 bg-yellow-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">Assessment Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Community-Led</h4>
                <p className="text-yellow-800 text-sm">
                  Communities should define success metrics and lead evaluation processes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Relationship-Focused</h4>
                <p className="text-yellow-800 text-sm">
                  Quality of relationships is the most important indicator of success.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Culturally Appropriate</h4>
                <p className="text-yellow-800 text-sm">
                  Assessment methods must align with cultural values and practices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Learning-Oriented</h4>
                <p className="text-yellow-800 text-sm">
                  Evaluation should support learning and improvement, not judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}