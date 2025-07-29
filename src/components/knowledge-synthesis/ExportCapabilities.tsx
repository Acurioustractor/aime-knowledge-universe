"use client"

import { useState } from 'react'

interface ExportOptions {
  format: 'pdf' | 'docx' | 'markdown' | 'json'
  sections: string[]
  includeImages: boolean
  includeReferences: boolean
  includeMetadata: boolean
  customization: {
    title: string
    author: string
    organization: string
    purpose: string
  }
}

interface ExportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  options: ExportOptions
  createdAt: Date
  completedAt?: Date
  downloadUrl?: string
  error?: string
}

const availableSections = [
  { id: 'evolution-story', title: 'Evolution & Growth Story', icon: '📅' },
  { id: 'systems-economics', title: 'Systems & Economics', icon: '🏠' },
  { id: 'imagi-nation-vision', title: 'IMAGI-NATION Vision', icon: '🌟' },
  { id: 'implementation-pathways', title: 'Implementation Pathways', icon: '🛤️' },
  { id: 'cross-reference', title: 'Cross-Reference System', icon: '🔗' },
  { id: 'document-integration', title: 'Document Integration', icon: '📚' }
]

const exportFormats = [
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Professional document format for sharing and printing',
    icon: '📄',
    features: ['Formatted layouts', 'Images included', 'Print-ready']
  },
  {
    id: 'docx',
    name: 'Word Document',
    description: 'Editable document for collaboration and customization',
    icon: '📝',
    features: ['Editable text', 'Collaborative editing', 'Template-ready']
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Plain text format for developers and technical documentation',
    icon: '💻',
    features: ['Version control friendly', 'Developer-focused', 'Lightweight']
  },
  {
    id: 'json',
    name: 'JSON Data',
    description: 'Structured data format for integration and analysis',
    icon: '🔧',
    features: ['Machine-readable', 'API integration', 'Data analysis']
  }
]

const presetConfigurations = [
  {
    id: 'complete-synthesis',
    name: 'Complete Knowledge Synthesis',
    description: 'Full synthesis with all sections and references',
    sections: availableSections.map(s => s.id),
    includeImages: true,
    includeReferences: true,
    includeMetadata: true
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'Key highlights and overview for leadership',
    sections: ['evolution-story', 'imagi-nation-vision'],
    includeImages: false,
    includeReferences: false,
    includeMetadata: true
  },
  {
    id: 'implementation-guide',
    name: 'Implementation Guide',
    description: 'Practical guidance for practitioners',
    sections: ['implementation-pathways', 'systems-economics'],
    includeImages: true,
    includeReferences: true,
    includeMetadata: false
  },
  {
    id: 'research-document',
    name: 'Research Document',
    description: 'Academic format with full references',
    sections: availableSections.map(s => s.id),
    includeImages: false,
    includeReferences: true,
    includeMetadata: true
  }
]

export default function ExportCapabilities() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    sections: [],
    includeImages: true,
    includeReferences: true,
    includeMetadata: true,
    customization: {
      title: 'AIME Knowledge Synthesis',
      author: '',
      organization: '',
      purpose: ''
    }
  })
  
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<'configure' | 'jobs' | 'templates'>('configure')

  const handlePresetSelect = (preset: typeof presetConfigurations[0]) => {
    setExportOptions(prev => ({
      ...prev,
      sections: preset.sections,
      includeImages: preset.includeImages,
      includeReferences: preset.includeReferences,
      includeMetadata: preset.includeMetadata,
      customization: {
        ...prev.customization,
        title: preset.name
      }
    }))
  }

  const handleSectionToggle = (sectionId: string) => {
    setExportOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(id => id !== sectionId)
        : [...prev.sections, sectionId]
    }))
  }

  const handleSelectAll = () => {
    setExportOptions(prev => ({
      ...prev,
      sections: availableSections.map(s => s.id)
    }))
  }

  const handleSelectNone = () => {
    setExportOptions(prev => ({
      ...prev,
      sections: []
    }))
  }

  const validateExportOptions = (): string[] => {
    const errors: string[] = []
    
    if (exportOptions.sections.length === 0) {
      errors.push('Please select at least one section to export')
    }
    
    if (!exportOptions.customization.title.trim()) {
      errors.push('Please provide a title for the export')
    }
    
    return errors
  }

  const startExport = async () => {
    const errors = validateExportOptions()
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'))
      return
    }

    setIsExporting(true)
    
    try {
      // Simulate export process
      const newJob: ExportJob = {
        id: `export-${Date.now()}`,
        status: 'processing',
        options: { ...exportOptions },
        createdAt: new Date()
      }
      
      setExportJobs(prev => [newJob, ...prev])
      
      // Simulate processing time
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { 
                ...job, 
                status: 'completed' as const, 
                completedAt: new Date(),
                downloadUrl: `/exports/${newJob.id}.${exportOptions.format}`
              }
            : job
        ))
        setIsExporting(false)
      }, 3000)
      
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  const downloadExport = (job: ExportJob) => {
    // Simulate download
    alert(`Download started: ${job.options.customization.title}.${job.options.format}`)
  }

  const getFormatIcon = (format: string) => {
    return exportFormats.find(f => f.id === format)?.icon || '📄'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Export Knowledge Synthesis</h2>
        <p className="text-lg text-gray-700 max-w-3xl">
          Export sections or the complete knowledge synthesis in various formats for sharing, 
          collaboration, or integration with other systems.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1">
          {[
            { id: 'configure', label: 'Configure Export', icon: '⚙️' },
            { id: 'jobs', label: 'Export History', icon: '📋' },
            { id: 'templates', label: 'Templates & Presets', icon: '📑' }
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

      {/* Configure Export Tab */}
      {activeTab === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map(format => (
                  <div
                    key={format.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exportOptions.format === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: format.id as any }))}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{format.icon}</span>
                      <h4 className="font-semibold text-gray-900">{format.name}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{format.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {format.features.map(feature => (
                        <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Sections to Include</h3>
                <div className="space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleSelectNone}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSections.map(section => (
                  <label key={section.id} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={exportOptions.sections.includes(section.id)}
                      onChange={() => handleSectionToggle(section.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-lg mr-2">{section.icon}</span>
                    <span className="font-medium text-gray-900">{section.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeImages}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Include Images</span>
                    <p className="text-gray-600 text-sm">Include charts, diagrams, and visual elements</p>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeReferences}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeReferences: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Include References</span>
                    <p className="text-gray-600 text-sm">Include document references and citations</p>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Include Metadata</span>
                    <p className="text-gray-600 text-sm">Include creation date, author info, and version details</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Customization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={exportOptions.customization.title}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customization: { ...prev.customization, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Document title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={exportOptions.customization.author}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customization: { ...prev.customization, author: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Author name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                  <input
                    type="text"
                    value={exportOptions.customization.organization}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customization: { ...prev.customization, organization: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <input
                    type="text"
                    value={exportOptions.customization.purpose}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      customization: { ...prev.customization, purpose: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Purpose or use case"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Export Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Preview</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getFormatIcon(exportOptions.format)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{exportOptions.customization.title || 'Untitled Export'}</div>
                    <div className="text-sm text-gray-600">{exportOptions.format.toUpperCase()} format</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{exportOptions.sections.length}</strong> sections selected
                  </div>
                  <div className="space-y-1">
                    {exportOptions.sections.map(sectionId => {
                      const section = availableSections.find(s => s.id === sectionId)
                      return section ? (
                        <div key={sectionId} className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">{section.icon}</span>
                          {section.title}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">Options:</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    {exportOptions.includeImages && <div>✓ Images included</div>}
                    {exportOptions.includeReferences && <div>✓ References included</div>}
                    {exportOptions.includeMetadata && <div>✓ Metadata included</div>}
                  </div>
                </div>
              </div>
              
              <button
                onClick={startExport}
                disabled={isExporting || exportOptions.sections.length === 0}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  isExporting || exportOptions.sections.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isExporting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </div>
                ) : (
                  'Start Export'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Export History</h3>
          
          {exportJobs.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Exports Yet</h4>
              <p className="text-gray-600">Your export history will appear here after you create your first export.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exportJobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-3">{getFormatIcon(job.options.format)}</span>
                        <h4 className="font-semibold text-gray-900">{job.options.customization.title}</h4>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div>Format: {job.options.format.toUpperCase()}</div>
                        <div>Sections: {job.options.sections.length} selected</div>
                        <div>Created: {job.createdAt.toLocaleString()}</div>
                        {job.completedAt && <div>Completed: {job.completedAt.toLocaleString()}</div>}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {job.options.sections.slice(0, 3).map(sectionId => {
                          const section = availableSections.find(s => s.id === sectionId)
                          return section ? (
                            <span key={sectionId} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {section.icon} {section.title}
                            </span>
                          ) : null
                        })}
                        {job.options.sections.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                            +{job.options.sections.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {job.status === 'completed' && job.downloadUrl && (
                        <button
                          onClick={() => downloadExport(job)}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Download
                        </button>
                      )}
                      
                      {job.status === 'processing' && (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates & Presets Tab */}
      {activeTab === 'templates' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Export Templates & Presets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presetConfigurations.map(preset => (
              <div key={preset.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{preset.name}</h4>
                <p className="text-gray-600 mb-4">{preset.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sections:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preset.sections.map(sectionId => {
                        const section = availableSections.find(s => s.id === sectionId)
                        return section ? (
                          <span key={sectionId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {section.icon} {section.title}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div>✓ Images: {preset.includeImages ? 'Included' : 'Excluded'}</div>
                    <div>✓ References: {preset.includeReferences ? 'Included' : 'Excluded'}</div>
                    <div>✓ Metadata: {preset.includeMetadata ? 'Included' : 'Excluded'}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    handlePresetSelect(preset)
                    setActiveTab('configure')
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Preset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}