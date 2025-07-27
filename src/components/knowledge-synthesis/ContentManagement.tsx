"use client"

import { useState, useEffect } from 'react'

interface ContentVersion {
  id: string
  timestamp: Date
  author: string
  changes: ContentChange[]
  message: string
  approved: boolean
  approvedBy?: string
  approvedAt?: Date
}

interface ContentChange {
  id: string
  type: 'addition' | 'modification' | 'deletion'
  section: string
  field: string
  oldValue?: string
  newValue?: string
  description: string
}

interface ContentItem {
  id: string
  section: string
  type: 'principle' | 'example' | 'framework' | 'story' | 'data'
  title: string
  content: string
  metadata: {
    lastModified: Date
    modifiedBy: string
    version: number
    status: 'draft' | 'review' | 'approved' | 'published'
    accuracy: number
    relevance: number
    culturalSensitivity: 'pending' | 'approved' | 'needs-review'
  }
  validationResults: ValidationResult[]
}

interface ValidationResult {
  id: string
  type: 'accuracy' | 'consistency' | 'cultural' | 'language' | 'technical'
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
  autoFixable: boolean
}

interface EditorialWorkflowStage {
  id: string
  name: string
  description: string
  requiredRole: string[]
  autoProgress: boolean
  validationRequired: boolean
}

const workflowStages: EditorialWorkflowStage[] = [
  {
    id: 'draft',
    name: 'Draft',
    description: 'Content is being created or edited',
    requiredRole: ['contributor', 'editor', 'admin'],
    autoProgress: false,
    validationRequired: false
  },
  {
    id: 'validation',
    name: 'Validation',
    description: 'Automated validation checks are running',
    requiredRole: ['system'],
    autoProgress: true,
    validationRequired: true
  },
  {
    id: 'cultural-review',
    name: 'Cultural Review',
    description: 'Cultural advisor reviews for sensitivity and accuracy',
    requiredRole: ['cultural-advisor', 'admin'],
    autoProgress: false,
    validationRequired: true
  },
  {
    id: 'editorial-review',
    name: 'Editorial Review',
    description: 'Content editor reviews for accuracy and consistency',
    requiredRole: ['editor', 'admin'],
    autoProgress: false,
    validationRequired: true
  },
  {
    id: 'final-approval',
    name: 'Final Approval',
    description: 'Final approval for publication',
    requiredRole: ['admin'],
    autoProgress: false,
    validationRequired: true
  },
  {
    id: 'published',
    name: 'Published',
    description: 'Content is live and available to users',
    requiredRole: ['system'],
    autoProgress: true,
    validationRequired: false
  }
]

export default function ContentManagement() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [versionHistory, setVersionHistory] = useState<ContentVersion[]>([])
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'workflow' | 'validation' | 'history'>('content')
  const [userRole] = useState<string>('editor') // Would come from auth context
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    loadContentItems()
    loadVersionHistory()
  }, [])

  const loadContentItems = async () => {
    // Simulate loading content from API
    const mockContent: ContentItem[] = [
      {
        id: 'seven-gen-thinking',
        section: 'Indigenous Foundations',
        type: 'principle',
        title: 'Seven-Generation Thinking',
        content: 'Seven-generation thinking is a principle that considers the impact of decisions on seven generations into the future...',
        metadata: {
          lastModified: new Date('2024-01-15'),
          modifiedBy: 'cultural.advisor@aime.org',
          version: 3,
          status: 'published',
          accuracy: 95,
          relevance: 98,
          culturalSensitivity: 'approved'
        },
        validationResults: []
      },
      {
        id: 'hoodie-economics-draft',
        section: 'Systems & Economics',
        type: 'framework',
        title: 'Hoodie Economics Framework',
        content: 'Hoodie economics represents an alternative economic framework based on relationships...',
        metadata: {
          lastModified: new Date(),
          modifiedBy: 'content.editor@aime.org',
          version: 1,
          status: 'review',
          accuracy: 88,
          relevance: 92,
          culturalSensitivity: 'pending'
        },
        validationResults: [
          {
            id: 'val-1',
            type: 'cultural',
            severity: 'warning',
            message: 'Consider adding Indigenous perspective on economic systems',
            suggestion: 'Include reference to traditional Indigenous economic practices',
            autoFixable: false
          }
        ]
      }
    ]
    setContentItems(mockContent)
  }

  const loadVersionHistory = async () => {
    // Simulate loading version history
    const mockHistory: ContentVersion[] = [
      {
        id: 'v-1',
        timestamp: new Date('2024-01-15T10:30:00'),
        author: 'cultural.advisor@aime.org',
        message: 'Updated seven-generation thinking definition based on elder feedback',
        changes: [
          {
            id: 'ch-1',
            type: 'modification',
            section: 'Indigenous Foundations',
            field: 'content',
            oldValue: 'Seven-generation thinking considers future impact...',
            newValue: 'Seven-generation thinking is a principle that considers the impact of decisions on seven generations into the future...',
            description: 'Enhanced definition with more precise language'
          }
        ],
        approved: true,
        approvedBy: 'admin@aime.org',
        approvedAt: new Date('2024-01-15T11:00:00')
      }
    ]
    setVersionHistory(mockHistory)
  }

  const validateContent = async (contentId: string) => {
    setIsValidating(true)
    
    // Simulate validation process
    setTimeout(() => {
      const validationResults: ValidationResult[] = [
        {
          id: 'val-accuracy-1',
          type: 'accuracy',
          severity: 'info',
          message: 'Content references verified against source documents',
          autoFixable: false
        },
        {
          id: 'val-consistency-1',
          type: 'consistency',
          severity: 'warning',
          message: 'Terminology differs from other sections',
          suggestion: 'Use "community wellbeing" instead of "collective welfare"',
          autoFixable: true
        },
        {
          id: 'val-cultural-1',
          type: 'cultural',
          severity: 'info',
          message: 'Cultural sensitivity check passed',
          autoFixable: false
        }
      ]
      
      setContentItems(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, validationResults }
          : item
      ))
      
      setIsValidating(false)
    }, 2000)
  }

  const updateContentStatus = (contentId: string, newStatus: ContentItem['metadata']['status']) => {
    setContentItems(prev => prev.map(item => 
      item.id === contentId 
        ? { 
            ...item, 
            metadata: { 
              ...item.metadata, 
              status: newStatus,
              lastModified: new Date(),
              version: item.metadata.version + 1
            }
          }
        : item
    ))

    // Create version history entry
    const newVersion: ContentVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date(),
      author: 'current.user@aime.org',
      message: `Status changed to ${newStatus}`,
      changes: [
        {
          id: `ch-${Date.now()}`,
          type: 'modification',
          section: 'Metadata',
          field: 'status',
          oldValue: selectedItem?.metadata.status,
          newValue: newStatus,
          description: `Updated content status from ${selectedItem?.metadata.status} to ${newStatus}`
        }
      ],
      approved: newStatus === 'published',
      approvedBy: newStatus === 'published' ? 'admin@aime.org' : undefined,
      approvedAt: newStatus === 'published' ? new Date() : undefined
    }
    
    setVersionHistory(prev => [newVersion, ...prev])
  }

  const applyAutoFix = (validationId: string, contentId: string) => {
    setContentItems(prev => prev.map(item => 
      item.id === contentId 
        ? {
            ...item,
            validationResults: item.validationResults.filter(v => v.id !== validationId),
            metadata: {
              ...item.metadata,
              lastModified: new Date(),
              version: item.metadata.version + 1
            }
          }
        : item
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'published': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const canUserPerformAction = (action: string) => {
    const rolePermissions = {
      'contributor': ['edit', 'submit'],
      'editor': ['edit', 'submit', 'review', 'validate'],
      'cultural-advisor': ['cultural-review', 'edit', 'submit'],
      'admin': ['edit', 'submit', 'review', 'approve', 'publish', 'validate']
    }
    
    return rolePermissions[userRole as keyof typeof rolePermissions]?.includes(action) || false
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Management & Version Control</h2>
        <p className="text-lg text-gray-700 max-w-3xl">
          Manage content accuracy, track changes, and ensure cultural sensitivity through 
          collaborative editorial workflows and automated validation.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'content', label: 'Content Overview', icon: '📝' },
            { id: 'workflow', label: 'Editorial Workflow', icon: '🔄' },
            { id: 'validation', label: 'Validation Results', icon: '✅' },
            { id: 'history', label: 'Version History', icon: '📋' }
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

      {/* Content Overview Tab */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content List */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Content Items</h3>
            <div className="space-y-4">
              {contentItems.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.section} • {item.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.metadata.status)}`}>
                      {item.metadata.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Accuracy:</span>
                      <span className="ml-1 font-medium">{item.metadata.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Relevance:</span>
                      <span className="ml-1 font-medium">{item.metadata.relevance}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Version:</span>
                      <span className="ml-1 font-medium">v{item.metadata.version}</span>
                    </div>
                  </div>
                  
                  {item.validationResults.length > 0 && (
                    <div className="mt-3 flex items-center text-sm">
                      <span className="text-orange-600 mr-2">⚠️</span>
                      <span className="text-gray-700">{item.validationResults.length} validation issue(s)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Detail */}
          <div>
            {selectedItem ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h3>
                  <div className="flex space-x-2">
                    {canUserPerformAction('validate') && (
                      <button
                        onClick={() => validateContent(selectedItem.id)}
                        disabled={isValidating}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 disabled:opacity-50"
                      >
                        {isValidating ? 'Validating...' : 'Validate'}
                      </button>
                    )}
                    {canUserPerformAction('edit') && (
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Content</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">
                      {selectedItem.content}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Metadata</h4>
                      <div className="space-y-2 text-sm">
                        <div>Last modified: {selectedItem.metadata.lastModified.toLocaleString()}</div>
                        <div>Modified by: {selectedItem.metadata.modifiedBy}</div>
                        <div>Cultural sensitivity: {selectedItem.metadata.culturalSensitivity}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Quality Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Accuracy</span>
                          <span className="text-sm font-medium">{selectedItem.metadata.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${selectedItem.metadata.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {canUserPerformAction('review') && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateContentStatus(selectedItem.id, 'review')}
                          className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          Send to Review
                        </button>
                        {canUserPerformAction('approve') && (
                          <button
                            onClick={() => updateContentStatus(selectedItem.id, 'approved')}
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                        {canUserPerformAction('publish') && (
                          <button
                            onClick={() => updateContentStatus(selectedItem.id, 'published')}
                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Content Item</h3>
                <p className="text-gray-600">Choose a content item to view details and manage its lifecycle.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editorial Workflow Tab */}
      {activeTab === 'workflow' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Editorial Workflow Stages</h3>
          
          <div className="space-y-6">
            {workflowStages.map((stage, index) => (
              <div key={stage.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                    <p className="text-gray-600">{stage.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{index + 1}</span>
                    {index < workflowStages.length - 1 && (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Required Roles:</span>
                    <div className="mt-1">
                      {stage.requiredRole.map(role => (
                        <span key={role} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900">Auto Progress:</span>
                    <span className={`ml-2 ${stage.autoProgress ? 'text-green-600' : 'text-red-600'}`}>
                      {stage.autoProgress ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900">Validation Required:</span>
                    <span className={`ml-2 ${stage.validationRequired ? 'text-blue-600' : 'text-gray-600'}`}>
                      {stage.validationRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Results Tab */}
      {activeTab === 'validation' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Validation Results</h3>
          
          {selectedItem ? (
            <div className="space-y-4">
              {selectedItem.validationResults.length === 0 ? (
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h4 className="text-lg font-semibold text-green-900 mb-2">All Checks Passed</h4>
                  <p className="text-green-800">This content has passed all validation checks.</p>
                </div>
              ) : (
                selectedItem.validationResults.map(result => (
                  <div key={result.id} className={`rounded-lg border p-4 ${getSeverityColor(result.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{result.type.charAt(0).toUpperCase() + result.type.slice(1)} Check</h4>
                        <p className="text-sm">{result.message}</p>
                      </div>
                      <span className="text-xs font-medium uppercase px-2 py-1 rounded">
                        {result.severity}
                      </span>
                    </div>
                    
                    {result.suggestion && (
                      <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                        <p className="text-sm"><strong>Suggestion:</strong> {result.suggestion}</p>
                      </div>
                    )}
                    
                    {result.autoFixable && (
                      <div className="mt-3">
                        <button
                          onClick={() => applyAutoFix(result.id, selectedItem.id)}
                          className="px-3 py-1 bg-white text-gray-800 rounded text-sm hover:bg-gray-50"
                        >
                          Apply Auto-fix
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Select Content for Validation</h4>
              <p className="text-gray-600">Choose a content item to view its validation results.</p>
            </div>
          )}
        </div>
      )}

      {/* Version History Tab */}
      {activeTab === 'history' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Version History</h3>
          
          <div className="space-y-4">
            {versionHistory.map(version => (
              <div key={version.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{version.message}</h4>
                    <p className="text-sm text-gray-600">
                      {version.timestamp.toLocaleString()} by {version.author}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {version.approved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                        Approved
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {version.changes.length} change(s)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {version.changes.map(change => (
                    <div key={change.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{change.description}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          change.type === 'addition' ? 'bg-green-100 text-green-800' :
                          change.type === 'modification' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {change.type}
                        </span>
                      </div>
                      
                      {change.oldValue && change.newValue && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">- Old:</span>
                            <p className="text-gray-700 bg-red-50 p-2 rounded mt-1">
                              {change.oldValue}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">+ New:</span>
                            <p className="text-gray-700 bg-green-50 p-2 rounded mt-1">
                              {change.newValue}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {version.approved && version.approvedBy && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                    Approved by {version.approvedBy} on {version.approvedAt?.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}