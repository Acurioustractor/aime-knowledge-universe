"use client"

import { useState, useEffect, useRef } from 'react'

interface GraphNode {
  id: string
  label: string
  type: 'concept' | 'content' | 'tool' | 'story'
  size: number
  color: string
}

interface GraphEdge {
  source: string
  target: string
  strength: number
  type: 'implements' | 'supports' | 'builds_on' | 'exemplifies'
}

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'concepts' | 'connections' | 'pathways'>('concepts')

  const viewModes = [
    { id: 'concepts', label: 'Concepts', description: 'Core Indigenous custodianship concepts' },
    { id: 'connections', label: 'Connections', description: 'How ideas relate to each other' },
    { id: 'pathways', label: 'Pathways', description: 'Learning journey flows' }
  ]

  useEffect(() => {
    initializeGraph()
  }, [viewMode])

  const initializeGraph = async () => {
    setIsLoading(true)
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, create a mock knowledge graph
    // In production, this would fetch real relationship data
    createMockGraph()
    
    setIsLoading(false)
  }

  const createMockGraph = () => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth || 800
    const height = svg.clientHeight || 600

    // Clear existing content
    svg.innerHTML = ''

    // Create mock nodes based on view mode
    const mockNodes: GraphNode[] = [
      { id: '1', label: 'Seven Generation Thinking', type: 'concept', size: 30, color: '#EF4444' },
      { id: '2', label: 'Hoodie Economics', type: 'concept', size: 28, color: '#F59E0B' },
      { id: '3', label: 'Indigenous Systems', type: 'concept', size: 25, color: '#10B981' },
      { id: '4', label: 'Mentoring Methodology', type: 'tool', size: 20, color: '#3B82F6' },
      { id: '5', label: 'Community Building', type: 'content', size: 22, color: '#8B5CF6' },
      { id: '6', label: 'Transformation Stories', type: 'story', size: 18, color: '#EC4899' },
      { id: '7', label: 'Relational Economics', type: 'concept', size: 24, color: '#F97316' },
      { id: '8', label: 'Cultural Protocols', type: 'tool', size: 19, color: '#06B6D4' }
    ]

    const mockEdges: GraphEdge[] = [
      { source: '1', target: '2', strength: 0.8, type: 'supports' },
      { source: '2', target: '7', strength: 0.9, type: 'implements' },
      { source: '3', target: '1', strength: 0.7, type: 'builds_on' },
      { source: '4', target: '5', strength: 0.6, type: 'supports' },
      { source: '5', target: '6', strength: 0.5, type: 'exemplifies' },
      { source: '7', target: '4', strength: 0.4, type: 'implements' },
      { source: '8', target: '3', strength: 0.8, type: 'supports' }
    ]

    // Simple force-directed layout simulation
    const nodes = mockNodes.map(node => ({
      ...node,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      vx: 0,
      vy: 0
    }))

    // Create SVG groups
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    svg.appendChild(g)

    // Draw edges
    mockEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)!
      const targetNode = nodes.find(n => n.id === edge.target)!
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', sourceNode.x.toString())
      line.setAttribute('y1', sourceNode.y.toString())
      line.setAttribute('x2', targetNode.x.toString())
      line.setAttribute('y2', targetNode.y.toString())
      line.setAttribute('stroke', '#D1D5DB')
      line.setAttribute('stroke-width', (edge.strength * 3).toString())
      line.setAttribute('opacity', '0.6')
      g.appendChild(line)
    })

    // Draw nodes
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', node.x.toString())
      circle.setAttribute('cy', node.y.toString())
      circle.setAttribute('r', node.size.toString())
      circle.setAttribute('fill', node.color)
      circle.setAttribute('stroke', '#FFFFFF')
      circle.setAttribute('stroke-width', '2')
      circle.setAttribute('cursor', 'pointer')
      circle.style.transition = 'all 0.3s ease'
      
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', (node.size * 1.2).toString())
        circle.setAttribute('stroke-width', '3')
      })
      
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', node.size.toString())
        circle.setAttribute('stroke-width', '2')
      })
      
      circle.addEventListener('click', () => {
        setSelectedNode(node)
      })
      
      g.appendChild(circle)

      // Add labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', node.x.toString())
      text.setAttribute('y', (node.y + node.size + 15).toString())
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#374151')
      text.setAttribute('font-size', '12')
      text.setAttribute('font-weight', '600')
      text.textContent = node.label
      g.appendChild(text)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      
      {/* View Mode Selector */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex space-x-4">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode.id
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {viewModes.find(m => m.id === viewMode)?.description}
        </div>
      </div>

      {/* Graph Container */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Mapping knowledge relationships...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              width="100%"
              height="500"
              className="border border-gray-200 rounded-lg bg-gray-50"
            >
              {/* SVG content will be added programmatically */}
            </svg>
            
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-sm mb-3">Node Types</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Core Concepts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Tools & Methods</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Content & Stories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Systems & Frameworks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedNode.label}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="capitalize">{selectedNode.type}</span>
                <span>•</span>
                <span>Connected to 3 other concepts</span>
              </div>
              <p className="text-gray-700 mb-4">
                This concept represents a fundamental aspect of Indigenous knowledge systems
                and its application in contemporary contexts. Click connections to explore relationships.
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Explore Content
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  View Connections
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}