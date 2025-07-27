"use client"

import { useState, useEffect } from 'react'

interface ConceptLink {
  id: string
  term: string
  definition: string
  section: string
  relatedConcepts: string[]
  examples: string[]
  documentReferences: string[]
}

interface BusinessCaseConnection {
  id: string
  title: string
  relevantConcepts: string[]
  description: string
  connection: string
}

interface DocumentReference {
  id: string
  title: string
  type: 'report' | 'letter' | 'proposal' | 'transcript' | 'analysis'
  concepts: string[]
  excerpt: string
  relevance: number
}

// Mock data for demonstration
const conceptLinks: ConceptLink[] = [
  {
    id: 'seven-generation',
    term: 'Seven-Generation Thinking',
    definition: 'A decision-making principle that considers the impact of actions on seven generations into the future.',
    section: 'Indigenous Foundations',
    relatedConcepts: ['hoodie-economics', 'sustainable-development', 'long-term-planning'],
    examples: [
      'Resource management decisions in Indigenous communities',
      'AIME program design considering long-term community impact',
      'Investment decisions in the $100M capital shift'
    ],
    documentReferences: ['aime-report-2024', 'indigenous-wisdom-letter', 'sustainability-proposal']
  },
  {
    id: 'hoodie-economics',
    term: 'Hoodie Economics',
    definition: 'An alternative economic framework based on relationships, community wellbeing, and Indigenous principles of value creation.',
    section: 'Systems & Economics',
    relatedConcepts: ['seven-generation', 'community-ownership', 'relational-value'],
    examples: [
      'Community-owned enterprises that prioritize wellbeing over profit',
      'Gift economy elements in mentoring programs',
      'Alternative measurement systems for community impact'
    ],
    documentReferences: ['hoodie-economics-framework', 'economic-model-analysis', 'community-wealth-report']
  },
  {
    id: 'community-ownership',
    term: 'Community Ownership',
    definition: 'The principle that communities should have control over decisions, resources, and programs that affect them.',
    section: 'Implementation Pathways',
    relatedConcepts: ['hoodie-economics', 'cultural-sovereignty', 'local-control'],
    examples: [
      'Community-controlled schools and education programs',
      'Local decision-making in AIME program design',
      'Community ownership of data and stories'
    ],
    documentReferences: ['community-control-report', 'ownership-models-analysis', 'local-governance-study']
  },
  {
    id: 'joy-corps',
    term: 'Joy Corps',
    definition: 'AIME systematic approach to relationship-building and mentorship that creates sustainable change through authentic connection.',
    section: 'AIME Methodology',
    relatedConcepts: ['relationship-building', 'mentorship', 'systematic-approach'],
    examples: [
      'University mentoring programs connecting Indigenous and non-Indigenous students',
      'Community-based youth support networks',
      'Peer-to-peer learning and leadership development'
    ],
    documentReferences: ['joy-corps-methodology', 'mentoring-framework', 'relationship-impact-study']
  },
  {
    id: 'imagi-nation',
    term: 'IMAGI-NATION',
    definition: 'A global movement for systemic change that prioritizes relationships, Indigenous wisdom, and community wellbeing over profit and extraction.',
    section: 'IMAGI-NATION Vision',
    relatedConcepts: ['systemic-change', 'global-movement', 'alternative-economics'],
    examples: [
      '$100M capital shift from extractive to regenerative models',
      'Global network of young people working for change',
      'Integration of Indigenous knowledge in global decision-making'
    ],
    documentReferences: ['imagi-nation-vision', 'global-movement-strategy', 'capital-shift-proposal']
  }
]

const businessCaseConnections: BusinessCaseConnection[] = [
  {
    id: 'bc-education',
    title: 'Relationship-First Education Business Case',
    relevantConcepts: ['joy-corps', 'community-ownership', 'seven-generation'],
    description: 'Business case for implementing relationship-first education models in schools and universities.',
    connection: 'Demonstrates how Joy Corps methodology and community ownership principles create better educational outcomes and long-term community benefit.'
  },
  {
    id: 'bc-economic-development',
    title: 'Community Economic Development Business Case',
    relevantConcepts: ['hoodie-economics', 'community-ownership', 'alternative-economics'],
    description: 'Business case for community-controlled economic development using hoodie economics principles.',
    connection: 'Shows how alternative economic models based on relationships and community wellbeing create sustainable prosperity.'
  },
  {
    id: 'bc-youth-engagement',
    title: 'Indigenous Youth Engagement Business Case',
    relevantConcepts: ['joy-corps', 'cultural-sovereignty', 'mentorship'],
    description: 'Business case for comprehensive Indigenous youth engagement and leadership development.',
    connection: 'Illustrates how Joy Corps methodology and cultural grounding create powerful youth leadership and community connection.'
  },
  {
    id: 'bc-systemic-change',
    title: 'Systemic Change Investment Business Case',
    relevantConcepts: ['imagi-nation', 'seven-generation', 'capital-shift'],
    description: 'Business case for investing in systemic change rather than band-aid solutions.',
    connection: 'Demonstrates how IMAGI-NATION vision and seven-generation thinking create lasting impact and return on investment.'
  }
]

const documentReferences: DocumentReference[] = [
  {
    id: 'aime-report-2024',
    title: 'AIME Full Report - Year 1',
    type: 'report',
    concepts: ['joy-corps', 'community-ownership', 'impact-measurement'],
    excerpt: 'Our approach to mentoring is fundamentally about relationship-first engagement that honors cultural protocols and builds genuine connection...',
    relevance: 0.95
  },
  {
    id: 'imagi-nation-vision',
    title: 'AIME IMAGI-NATION Investment Deck',
    type: 'proposal',
    concepts: ['imagi-nation', 'capital-shift', 'global-movement'],
    excerpt: 'IMAGI-NATION represents a $100M capital shift towards regenerative economic models that prioritize community wellbeing...',
    relevance: 0.92
  },
  {
    id: 'indigenous-wisdom-letter',
    title: 'Letter to Humanity',
    type: 'letter',
    concepts: ['seven-generation', 'indigenous-wisdom', 'systemic-change'],
    excerpt: 'We must return to Indigenous ways of thinking that consider the impact of our decisions on seven generations into the future...',
    relevance: 0.88
  },
  {
    id: 'hoodie-economics-framework',
    title: 'Hoodie Economics Analysis',
    type: 'analysis',
    concepts: ['hoodie-economics', 'alternative-economics', 'relational-value'],
    excerpt: 'Hoodie economics represents a fundamental shift from transactional to relational value creation, where community wellbeing is the primary measure of success...',
    relevance: 0.85
  }
]

export default function CrossReference() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptLink | null>(null)
  const [activeTab, setActiveTab] = useState<'concepts' | 'business-cases' | 'documents'>('concepts')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConcepts, setFilteredConcepts] = useState<ConceptLink[]>(conceptLinks)

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = conceptLinks.filter(concept =>
        concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.section.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredConcepts(filtered)
    } else {
      setFilteredConcepts(conceptLinks)
    }
  }, [searchTerm])

  const getRelatedBusinessCases = (conceptId: string) => {
    return businessCaseConnections.filter(bc =>
      bc.relevantConcepts.includes(conceptId)
    )
  }

  const getRelatedDocuments = (conceptId: string) => {
    return documentReferences.filter(doc =>
      doc.concepts.includes(conceptId)
    ).sort((a, b) => b.relevance - a.relevance)
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return '📊'
      case 'letter': return '✉️'
      case 'proposal': return '📋'
      case 'transcript': return '🎤'
      case 'analysis': return '🔍'
      default: return '📄'
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-100 text-blue-800'
      case 'letter': return 'bg-green-100 text-green-800'
      case 'proposal': return 'bg-purple-100 text-purple-800'
      case 'transcript': return 'bg-orange-100 text-orange-800'
      case 'analysis': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cross-Reference System</h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Explore the interconnected concepts, business cases, and documents within the AIME knowledge system. 
          Discover how ideas connect across sections and relate to real-world applications.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'concepts', label: 'Concept Links', icon: '🔗' },
            { id: 'business-cases', label: 'Business Case Connections', icon: '💼' },
            { id: 'documents', label: 'Document References', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Concept Links Tab */}
      {activeTab === 'concepts' && (
        <div>
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Concept List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Key Concepts</h2>
              {filteredConcepts.map(concept => (
                <div
                  key={concept.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedConcept?.id === concept.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedConcept(concept)}
                >
                  <h3 className="text-lg font-semibold mb-2">{concept.term}</h3>
                  <p className="text-gray-600 text-sm mb-2">{concept.definition}</p>
                  <span className="text-xs text-indigo-600 font-medium">{concept.section}</span>
                </div>
              ))}
            </div>

            {/* Concept Detail */}
            <div className="sticky top-6">
              {selectedConcept ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold mb-3">{selectedConcept.term}</h3>
                  <p className="text-gray-700 mb-4">{selectedConcept.definition}</p>
                  
                  <div className="space-y-4">
                    {/* Related Concepts */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Related Concepts</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedConcept.relatedConcepts.map(relatedId => {
                          const relatedConcept = conceptLinks.find(c => c.id === relatedId)
                          return relatedConcept ? (
                            <button
                              key={relatedId}
                              onClick={() => setSelectedConcept(relatedConcept)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
                            >
                              {relatedConcept.term}
                            </button>
                          ) : null
                        })}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                      <ul className="space-y-1">
                        {selectedConcept.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Document References */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Referenced In</h4>
                      <div className="space-y-2">
                        {getRelatedDocuments(selectedConcept.id).map(doc => (
                          <div key={doc.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{doc.title}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.type)}`}>
                                {getDocumentTypeIcon(doc.type)} {doc.type}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs">{doc.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Cases */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Related Business Cases</h4>
                      <div className="space-y-2">
                        {getRelatedBusinessCases(selectedConcept.id).map(bc => (
                          <div key={bc.id} className="bg-blue-50 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 text-sm mb-1">{bc.title}</h5>
                            <p className="text-blue-800 text-xs">{bc.connection}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-lg font-semibold mb-2">Explore Concept Connections</h3>
                  <p className="text-gray-600">Select any concept to see how it connects to other ideas, documents, and business cases.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business Case Connections Tab */}
      {activeTab === 'business-cases' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Business Case Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessCaseConnections.map(bc => (
              <div key={bc.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-3">{bc.title}</h3>
                <p className="text-gray-700 mb-4">{bc.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Connected Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {bc.relevantConcepts.map(conceptId => {
                      const concept = conceptLinks.find(c => c.id === conceptId)
                      return concept ? (
                        <span
                          key={conceptId}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                        >
                          {concept.term}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">Connection</h4>
                  <p className="text-gray-700 text-sm">{bc.connection}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document References Tab */}
      {activeTab === 'documents' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Document References</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documentReferences.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{doc.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.type)}`}>
                    {getDocumentTypeIcon(doc.type)} {doc.type}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm">{doc.excerpt}</p>
                
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Related Concepts</h4>
                  <div className="flex flex-wrap gap-1">
                    {doc.concepts.map(conceptId => {
                      const concept = conceptLinks.find(c => c.id === conceptId)
                      return concept ? (
                        <span
                          key={conceptId}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
                        >
                          {concept.term}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Relevance: {Math.round(doc.relevance * 100)}%
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View Document →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}