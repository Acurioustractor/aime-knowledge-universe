import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/knowledge-graph
 * 
 * Retrieve knowledge graph data with real-time connections
 * Query parameters:
 * - view: 'full' | 'themes' | 'people' | 'locations' | 'content'
 * - depth: number (1-3, default: 2)
 * - focus: nodeId to focus the graph around
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'full';
    const depth = parseInt(searchParams.get('depth') || '2');
    const focus = searchParams.get('focus');

    // Simulate graph processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    const graphData = generateKnowledgeGraph(view, depth, focus);

    return NextResponse.json({
      success: true,
      data: graphData,
      metadata: {
        view,
        depth,
        focus,
        generated: new Date().toISOString(),
        nodeCount: graphData.nodes.length,
        edgeCount: graphData.edges.length,
        density: calculateGraphDensity(graphData.nodes.length, graphData.edges.length)
      }
    });

  } catch (error) {
    console.error('Knowledge graph error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate knowledge graph',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge-graph/query
 * 
 * Query the knowledge graph with specific criteria
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      startNodes = [], 
      traversalConfig = {}, 
      filters = {},
      maxResults = 50 
    } = body;

    // Simulate graph query processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const queryResults = executeGraphQuery({
      startNodes,
      traversalConfig,
      filters,
      maxResults
    });

    return NextResponse.json({
      success: true,
      data: queryResults,
      metadata: {
        query: { startNodes, traversalConfig, filters },
        executionTime: 0.8,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Graph query error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Graph query failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Graph generation functions

function generateKnowledgeGraph(view: string, depth: number, focus?: string) {
  const nodes = generateNodes(view);
  const edges = generateEdges(nodes, depth);
  const clusters = generateClusters(nodes);
  const analytics = generateGraphAnalytics(nodes, edges);

  return {
    nodes,
    edges,
    clusters,
    analytics,
    realTimeUpdates: {
      recentConnections: generateRecentConnections(),
      activeNodes: generateActiveNodes(nodes),
      growthMetrics: generateGrowthMetrics()
    }
  };
}

function generateNodes(view: string) {
  const allNodes = [
    // Content nodes
    { id: 'content-1', label: 'IMAGI-NATION TV', type: 'content', category: 'video', size: 25, connections: 30, x: 300, y: 200, color: '#3b82f6', metadata: { episodes: 256, views: '2.3M' } },
    { id: 'content-2', label: 'Youth Workshops', type: 'content', category: 'workshop', size: 20, connections: 22, x: 180, y: 180, color: '#3b82f6', metadata: { workshops: 148, participants: 3200 } },
    { id: 'content-3', label: 'Research Papers', type: 'content', category: 'research', size: 18, connections: 15, x: 420, y: 160, color: '#3b82f6', metadata: { papers: 89, citations: 450 } },
    
    // People nodes
    { id: 'person-1', label: 'Jack Manning Bancroft', type: 'person', category: 'founder', size: 24, connections: 35, x: 150, y: 250, color: '#10b981', metadata: { role: 'Founder & CEO', impact: 'Global' } },
    { id: 'person-2', label: 'Indigenous Elders', type: 'person', category: 'elder', size: 22, connections: 28, x: 350, y: 100, color: '#10b981', metadata: { regions: 12, wisdom: 'Traditional' } },
    { id: 'person-3', label: 'Youth Mentors', type: 'person', category: 'mentor', size: 19, connections: 25, x: 450, y: 350, color: '#10b981', metadata: { mentors: 890, countries: 52 } },
    { id: 'person-4', label: 'Global Alumni', type: 'person', category: 'alumni', size: 21, connections: 18, x: 200, y: 400, color: '#10b981', metadata: { alumni: 12000, outcomes: 'Positive' } },
    
    // Theme nodes
    { id: 'theme-1', label: 'Indigenous Wisdom', type: 'theme', category: 'core', size: 23, connections: 32, x: 200, y: 150, color: '#f59e0b', metadata: { strength: 0.95, prevalence: 'High' } },
    { id: 'theme-2', label: 'Youth Leadership', type: 'theme', category: 'core', size: 25, connections: 40, x: 400, y: 200, color: '#f59e0b', metadata: { strength: 0.92, prevalence: 'Very High' } },
    { id: 'theme-3', label: 'Cultural Bridge', type: 'theme', category: 'core', size: 20, connections: 26, x: 300, y: 300, color: '#f59e0b', metadata: { strength: 0.88, prevalence: 'High' } },
    { id: 'theme-4', label: 'Innovation', type: 'theme', category: 'emerging', size: 18, connections: 20, x: 500, y: 150, color: '#f59e0b', metadata: { strength: 0.75, prevalence: 'Growing' } },
    { id: 'theme-5', label: 'Mentorship', type: 'theme', category: 'foundational', size: 26, connections: 45, x: 250, y: 250, color: '#f59e0b', metadata: { strength: 0.98, prevalence: 'Universal' } },
    
    // Location nodes
    { id: 'loc-1', label: 'Australia', type: 'location', category: 'primary', size: 24, connections: 35, x: 250, y: 400, color: '#8b5cf6', metadata: { programs: 45, reach: '80%' } },
    { id: 'loc-2', label: 'North America', type: 'location', category: 'regional', size: 18, connections: 22, x: 100, y: 300, color: '#8b5cf6', metadata: { programs: 12, reach: '15%' } },
    { id: 'loc-3', label: 'Global Network', type: 'location', category: 'virtual', size: 22, connections: 38, x: 400, y: 50, color: '#8b5cf6', metadata: { countries: 52, digital: 'Yes' } },
    { id: 'loc-4', label: 'Remote Communities', type: 'location', category: 'focus', size: 16, connections: 15, x: 100, y: 350, color: '#8b5cf6', metadata: { communities: 120, access: 'Limited' } },
    
    // Concept nodes
    { id: 'concept-1', label: 'Systemic Change', type: 'concept', category: 'outcome', size: 19, connections: 24, x: 380, y: 280, color: '#ef4444', metadata: { impact: 'Long-term', scale: 'Institutional' } },
    { id: 'concept-2', label: 'Relationship Building', type: 'concept', category: 'process', size: 17, connections: 20, x: 320, y: 350, color: '#ef4444', metadata: { importance: 'Critical', method: 'Authentic' } },
    { id: 'concept-3', label: 'Knowledge Transfer', type: 'concept', category: 'process', size: 15, connections: 18, x: 480, y: 250, color: '#ef4444', metadata: { direction: 'Bidirectional', format: 'Multiple' } }
  ];

  // Filter nodes based on view
  switch (view) {
    case 'themes':
      return allNodes.filter(node => node.type === 'theme');
    case 'people':
      return allNodes.filter(node => node.type === 'person');
    case 'locations':
      return allNodes.filter(node => node.type === 'location');
    case 'content':
      return allNodes.filter(node => node.type === 'content');
    case 'full':
    default:
      return allNodes;
  }
}

function generateEdges(nodes: any[], depth: number) {
  const edges = [];
  const nodeIds = nodes.map(n => n.id);

  // Generate meaningful connections based on node types and relationships
  const connections = [
    // Content to theme connections
    { source: 'content-1', target: 'theme-1', strength: 0.9, type: 'contains_theme', label: 'Features Indigenous Wisdom' },
    { source: 'content-1', target: 'theme-2', strength: 0.85, type: 'contains_theme', label: 'Promotes Youth Leadership' },
    { source: 'content-2', target: 'theme-2', strength: 0.95, type: 'develops_theme', label: 'Develops Leadership' },
    { source: 'content-2', target: 'theme-5', strength: 0.9, type: 'implements_theme', label: 'Mentorship Model' },
    
    // People to theme connections
    { source: 'person-1', target: 'theme-5', strength: 0.95, type: 'champions_theme', label: 'Mentorship Champion' },
    { source: 'person-2', target: 'theme-1', strength: 0.98, type: 'embodies_theme', label: 'Wisdom Keepers' },
    { source: 'person-3', target: 'theme-2', strength: 0.88, type: 'develops_theme', label: 'Youth Development' },
    
    // Location to content connections
    { source: 'loc-1', target: 'content-1', strength: 0.8, type: 'hosts_content', label: 'Primary Location' },
    { source: 'loc-3', target: 'content-1', strength: 0.7, type: 'distributes_content', label: 'Global Reach' },
    
    // Theme interconnections
    { source: 'theme-1', target: 'theme-3', strength: 0.85, type: 'enables_theme', label: 'Cultural Foundation' },
    { source: 'theme-2', target: 'theme-5', strength: 0.92, type: 'supported_by', label: 'Mentorship Enables Leadership' },
    { source: 'theme-3', target: 'theme-5', strength: 0.8, type: 'facilitates_theme', label: 'Bridges Through Mentorship' },
    
    // Concept connections
    { source: 'concept-1', target: 'theme-2', strength: 0.75, type: 'achieved_through', label: 'Youth Drive Change' },
    { source: 'concept-2', target: 'theme-5', strength: 0.9, type: 'core_of', label: 'Heart of Mentorship' },
    { source: 'concept-3', target: 'theme-1', strength: 0.8, type: 'preserves_theme', label: 'Wisdom Sharing' }
  ];

  // Filter connections based on available nodes and depth
  connections.forEach(conn => {
    if (nodeIds.includes(conn.source) && nodeIds.includes(conn.target)) {
      edges.push({
        id: `${conn.source}-${conn.target}`,
        source: conn.source,
        target: conn.target,
        strength: conn.strength,
        type: conn.type,
        label: conn.label,
        weight: Math.round(conn.strength * 5), // Visual weight 1-5
        animated: conn.strength > 0.9 // Animate strong connections
      });
    }
  });

  return edges;
}

function generateClusters(nodes: any[]) {
  return [
    {
      id: 'cluster-mentorship',
      label: 'Mentorship Ecosystem',
      nodes: nodes.filter(n => ['theme-5', 'person-1', 'person-3', 'concept-2'].includes(n.id)).map(n => n.id),
      color: '#f0fdf4',
      coherence: 0.92
    },
    {
      id: 'cluster-indigenous',
      label: 'Indigenous Knowledge Hub',
      nodes: nodes.filter(n => ['theme-1', 'person-2', 'concept-3'].includes(n.id)).map(n => n.id),
      color: '#fef3c7',
      coherence: 0.88
    },
    {
      id: 'cluster-youth',
      label: 'Youth Leadership Network',
      nodes: nodes.filter(n => ['theme-2', 'content-2', 'person-3', 'person-4'].includes(n.id)).map(n => n.id),
      color: '#e0e7ff',
      coherence: 0.85
    }
  ];
}

function generateGraphAnalytics(nodes: any[], edges: any[]) {
  return {
    networkMetrics: {
      density: calculateGraphDensity(nodes.length, edges.length),
      avgDegree: (edges.length * 2) / nodes.length,
      clustering: 0.73,
      diameter: 4,
      components: 1
    },
    nodeMetrics: {
      totalNodes: nodes.length,
      byType: nodes.reduce((acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      centralNodes: nodes
        .sort((a, b) => b.connections - a.connections)
        .slice(0, 5)
        .map(n => ({ id: n.id, label: n.label, connections: n.connections }))
    },
    edgeMetrics: {
      totalEdges: edges.length,
      avgStrength: edges.reduce((sum, e) => sum + e.strength, 0) / edges.length,
      strongConnections: edges.filter(e => e.strength > 0.8).length,
      byType: edges.reduce((acc, edge) => {
        acc[edge.type] = (acc[edge.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }
  };
}

function generateRecentConnections() {
  return [
    {
      source: 'New Workshop Series',
      target: 'Youth Leadership',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      strength: 0.85,
      type: 'develops_theme'
    },
    {
      source: 'Global Alumni Network',
      target: 'Systemic Change',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      strength: 0.78,
      type: 'achieves_outcome'
    },
    {
      source: 'IMAGI-NATION Episode 257',
      target: 'Innovation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      strength: 0.82,
      type: 'explores_theme'
    }
  ];
}

function generateActiveNodes(nodes: any[]) {
  return nodes
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map(node => ({
      id: node.id,
      label: node.label,
      activity: Math.random() * 0.8 + 0.2, // 0.2-1.0
      lastUpdate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24) // Random within 24h
    }));
}

function generateGrowthMetrics() {
  return {
    nodesAdded: {
      today: 3,
      thisWeek: 18,
      thisMonth: 67
    },
    connectionsAdded: {
      today: 12,
      thisWeek: 89,
      thisMonth: 234
    },
    densityGrowth: 0.023, // 2.3% increase this month
    clusterEvolution: {
      newClusters: 2,
      mergedClusters: 1,
      averageCoherence: 0.86
    }
  };
}

function calculateGraphDensity(nodeCount: number, edgeCount: number): number {
  if (nodeCount < 2) return 0;
  const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
  return edgeCount / maxEdges;
}

function executeGraphQuery(queryConfig: any) {
  // Mock graph query execution
  return {
    paths: [
      {
        nodes: ['theme-5', 'person-1', 'content-1'],
        edges: ['mentorship-champion', 'creates-content'],
        score: 0.92,
        explanation: 'Strong mentorship pathway through founder to content'
      },
      {
        nodes: ['theme-1', 'person-2', 'theme-3'],
        edges: ['embodies-wisdom', 'enables-bridge'],
        score: 0.88,
        explanation: 'Indigenous wisdom enables cultural bridging'
      }
    ],
    subgraph: {
      nodes: 12,
      edges: 18,
      density: 0.27
    },
    insights: [
      'Mentorship is the central hub connecting all major themes',
      'Indigenous wisdom strongly correlates with cultural bridge building',
      'Youth leadership emerges from strong mentorship relationships'
    ]
  };
}