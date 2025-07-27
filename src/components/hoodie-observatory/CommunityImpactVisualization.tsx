/**
 * Community Impact Visualization
 * 
 * Shows how hoodie economics creates network effects and collective value
 * Visualizes relationships, impact flows, and community benefits
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  UsersIcon,
  ArrowRightIcon,
  HeartIcon,
  SparklesIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  LinkIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface CommunityNode {
  id: string;
  name: string;
  type: 'holder' | 'hoodie' | 'impact' | 'community';
  category?: string;
  value: number;
  connections: string[];
  position: { x: number; y: number };
  size: number;
  color: string;
  description: string;
}

interface ImpactFlow {
  from: string;
  to: string;
  value: number;
  type: 'mentorship' | 'collaboration' | 'knowledge_transfer' | 'community_building';
  story: string;
}

interface CommunityImpactVisualizationProps {
  hoodies: any[];
  stats: any;
  className?: string;
}

export default function CommunityImpactVisualization({
  hoodies,
  stats,
  className = ''
}: CommunityImpactVisualizationProps) {
  const [nodes, setNodes] = useState<CommunityNode[]>([]);
  const [flows, setFlows] = useState<ImpactFlow[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [viewMode, setViewMode] = useState<'network' | 'flows' | 'stories'>('network');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    generateCommunityNetwork();
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [hoodies]);

  const generateCommunityNetwork = () => {
    const networkNodes: CommunityNode[] = [];
    const networkFlows: ImpactFlow[] = [];

    // Create hoodie nodes
    hoodies.forEach((hoodie, index) => {
      const angle = (index / hoodies.length) * 2 * Math.PI;
      const radius = 150;
      
      networkNodes.push({
        id: hoodie.id,
        name: hoodie.name,
        type: 'hoodie',
        category: hoodie.category,
        value: hoodie.imagination_credits_earned || 0,
        connections: [],
        position: {
          x: 300 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius
        },
        size: Math.max(20, Math.min(50, (hoodie.current_holders || 1) * 3)),
        color: getCategoryColor(hoodie.category),
        description: hoodie.description
      });

      // Create holder nodes for each hoodie
      for (let i = 0; i < Math.min(hoodie.current_holders || 0, 3); i++) {
        const holderAngle = angle + (i - 1) * 0.3;
        const holderRadius = radius + 80;
        
        const holderId = `${hoodie.id}-holder-${i}`;
        networkNodes.push({
          id: holderId,
          name: `${hoodie.category} Practitioner ${i + 1}`,
          type: 'holder',
          category: hoodie.category,
          value: hoodie.imagination_credit_multiplier || 1,
          connections: [hoodie.id],
          position: {
            x: 300 + Math.cos(holderAngle) * holderRadius,
            y: 300 + Math.sin(holderAngle) * holderRadius
          },
          size: 15,
          color: '#3B82F6',
          description: `Community member practicing ${hoodie.category} principles`
        });

        // Create impact flows
        networkFlows.push({
          from: holderId,
          to: hoodie.id,
          value: hoodie.imagination_credit_multiplier || 1,
          type: 'knowledge_transfer',
          story: `Practitioner applies ${hoodie.name} principles, creating ${hoodie.imagination_credit_multiplier}x impact multiplier for the community`
        });
      }
    });

    // Create community impact nodes
    const impactCategories = Array.from(new Set(hoodies.map(h => h.category)));
    impactCategories.forEach((category, index) => {
      const angle = (index / impactCategories.length) * 2 * Math.PI;
      const radius = 80;
      
      const impactId = `impact-${category}`;
      networkNodes.push({
        id: impactId,
        name: `${category} Impact`,
        type: 'impact',
        category,
        value: hoodies.filter(h => h.category === category).reduce((sum, h) => sum + (h.imagination_credits_earned || 0), 0),
        connections: hoodies.filter(h => h.category === category).map(h => h.id),
        position: {
          x: 300 + Math.cos(angle) * radius,
          y: 300 + Math.sin(angle) * radius
        },
        size: 25,
        color: '#10B981',
        description: `Collective impact created through ${category} hoodies`
      });

      // Create flows from hoodies to impact
      hoodies.filter(h => h.category === category).forEach(hoodie => {
        networkFlows.push({
          from: hoodie.id,
          to: impactId,
          value: hoodie.imagination_credits_earned || 0,
          type: 'community_building',
          story: `${hoodie.name} contributes to collective ${category} impact, benefiting entire community`
        });
      });
    });

    // Central community node
    networkNodes.push({
      id: 'community-center',
      name: 'AIME Community',
      type: 'community',
      value: stats?.total_market_value || 0,
      connections: impactCategories.map(cat => `impact-${cat}`),
      position: { x: 300, y: 300 },
      size: 40,
      color: '#8B5CF6',
      description: 'The heart of the hoodie economics ecosystem where all value flows converge'
    });

    // Flows from impact to community
    impactCategories.forEach(category => {
      networkFlows.push({
        from: `impact-${category}`,
        to: 'community-center',
        value: hoodies.filter(h => h.category === category).reduce((sum, h) => sum + (h.imagination_credits_earned || 0), 0),
        type: 'community_building',
        story: `${category} impact flows into community abundance, creating shared value for all members`
      });
    });

    setNodes(networkNodes);
    setFlows(networkFlows);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      transformation: '#8B5CF6',
      knowledge: '#3B82F6',
      community: '#10B981',
      leadership: '#F59E0B',
      education: '#6366F1',
      innovation: '#EC4899',
      systems: '#14B8A6',
      stewardship: '#F97316',
      tools: '#6B7280',
      imagination: '#EF4444'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'holder': return <UsersIcon className="h-3 w-3" />;
      case 'hoodie': return <SparklesIcon className="h-3 w-3" />;
      case 'impact': return <TrendingUpIcon className="h-3 w-3" />;
      case 'community': return <HeartIcon className="h-4 w-4" />;
      default: return <StarIcon className="h-3 w-3" />;
    }
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const relatedFlows = selectedNode ? flows.filter(f => f.from === selectedNode || f.to === selectedNode) : [];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-blue-600" />
              Community Impact Network
            </h2>
            <p className="text-gray-600 text-sm">
              Visualizing how hoodie economics creates interconnected value and collective abundance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('network')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'network'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Network
            </button>
            <button
              onClick={() => setViewMode('flows')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'flows'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Flows
            </button>
            <button
              onClick={() => setViewMode('stories')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'stories'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Stories
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-96 relative overflow-hidden">
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 600 400"
                className="absolute inset-0"
              >
                {/* Connection Lines */}
                {viewMode === 'network' && flows.map((flow, index) => {
                  const fromNode = nodes.find(n => n.id === flow.from);
                  const toNode = nodes.find(n => n.id === flow.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  const opacity = selectedNode ? 
                    (flow.from === selectedNode || flow.to === selectedNode ? 0.8 : 0.2) : 0.4;
                  
                  return (
                    <line
                      key={`flow-${index}`}
                      x1={fromNode.position.x}
                      y1={fromNode.position.y}
                      x2={toNode.position.x}
                      y2={toNode.position.y}
                      stroke={flow.type === 'community_building' ? '#10B981' : '#3B82F6'}
                      strokeWidth={Math.max(1, flow.value / 10)}
                      opacity={opacity}
                      strokeDasharray={flow.type === 'knowledge_transfer' ? '5,5' : 'none'}
                    />
                  );
                })}

                {/* Animated Flow Particles */}
                {viewMode === 'flows' && flows.map((flow, index) => {
                  const fromNode = nodes.find(n => n.id === flow.from);
                  const toNode = nodes.find(n => n.id === flow.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  const progress = (animationFrame * 0.02 + index * 0.1) % 1;
                  const x = fromNode.position.x + (toNode.position.x - fromNode.position.x) * progress;
                  const y = fromNode.position.y + (toNode.position.y - fromNode.position.y) * progress;
                  
                  return (
                    <circle
                      key={`particle-${index}`}
                      cx={x}
                      cy={y}
                      r={3}
                      fill={flow.type === 'community_building' ? '#10B981' : '#3B82F6'}
                      opacity={0.8}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                  const isSelected = selectedNode === node.id;
                  const isConnected = selectedNode ? 
                    flows.some(f => (f.from === selectedNode && f.to === node.id) || (f.to === selectedNode && f.from === node.id)) : false;
                  
                  const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.3) : 1;
                  const scale = isSelected ? 1.2 : 1;
                  
                  return (
                    <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y}) scale(${scale})`}>
                      <circle
                        r={node.size}
                        fill={node.color}
                        opacity={opacity}
                        stroke={isSelected ? '#1F2937' : 'white'}
                        strokeWidth={isSelected ? 3 : 2}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                      
                      {/* Node Icon */}
                      <foreignObject
                        x={-6}
                        y={-6}
                        width={12}
                        height={12}
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center text-white">
                          {getNodeIcon(node.type)}
                        </div>
                      </foreignObject>
                      
                      {/* Node Label */}
                      <text
                        y={node.size + 15}
                        textAnchor="middle"
                        className="fill-gray-700 text-xs font-medium pointer-events-none"
                        opacity={opacity}
                      >
                        {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-sm border">
                <div className="text-xs font-medium text-gray-900 mb-2">Network Legend</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-600">Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Holders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-xs text-gray-600">Hoodies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            {selectedNodeData ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedNodeData.color }}
                  >
                    {getNodeIcon(selectedNodeData.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedNodeData.name}</h3>
                    <span className="text-xs text-gray-500 capitalize">{selectedNodeData.type}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{selectedNodeData.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Value:</span>
                    <span className="ml-1 text-gray-700">{selectedNodeData.value}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Connections:</span>
                    <span className="ml-1 text-gray-700">{selectedNodeData.connections.length}</span>
                  </div>
                </div>

                {relatedFlows.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Impact Flows</h4>
                    <div className="space-y-2">
                      {relatedFlows.slice(0, 3).map((flow, index) => (
                        <div key={index} className="bg-white rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-medium text-gray-900 capitalize">
                              {flow.type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{flow.story}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Explore the Network</h3>
                </div>
                <p className="text-blue-800 text-sm mb-3">
                  Click on any node to see how it connects to the broader community and creates value flows.
                </p>
                <div className="text-xs text-blue-700">
                  <strong>Philosophy:</strong> Each connection represents a relationship that creates mutual value, 
                  demonstrating how hoodie economics builds community wealth through collaboration.
                </div>
              </div>
            )}

            {/* Impact Stories */}
            {viewMode === 'stories' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Impact Stories</h3>
                {flows.slice(0, 4).map((flow, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {flow.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">{flow.story}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Value: {flow.value} imagination credits
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Network Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Network Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Nodes:</span>
                  <span className="text-sm font-medium text-gray-900">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Connections:</span>
                  <span className="text-sm font-medium text-gray-900">{flows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Community Value:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {flows.reduce((sum, f) => sum + f.value, 0)} credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Network Density:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round((flows.length / (nodes.length * (nodes.length - 1))) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}