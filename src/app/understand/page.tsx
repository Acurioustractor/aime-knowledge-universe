'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConceptConnection {
  id: string;
  title: string;
  type: 'principle' | 'application' | 'example' | 'tool';
  description: string;
  connections: string[];
  strength: number; // 0-1
}

interface LearningProgress {
  pathway: string;
  completed: number;
  total: number;
  currentConcept: string;
  achievements: string[];
}

const conceptMap: ConceptConnection[] = [
  {
    id: 'seven-generation-thinking',
    title: 'Seven-Generation Thinking',
    type: 'principle',
    description: 'Decision-making framework that considers impact seven generations into the future',
    connections: ['reciprocity', 'systems-thinking', 'joy-corps', 'sustainable-economics'],
    strength: 1.0
  },
  {
    id: 'reciprocity',
    title: 'Reciprocity',
    type: 'principle',
    description: 'Exchange based on mutual benefit and relationship rather than transaction',
    connections: ['seven-generation-thinking', 'hoodie-economics', 'mentoring', 'community-building'],
    strength: 0.9
  },
  {
    id: 'hoodie-economics',
    title: 'Hoodie Economics',
    type: 'application',
    description: 'Economic model based on relational value and community validation',
    connections: ['reciprocity', 'community-validation', 'imagination-currency', 'network-effects'],
    strength: 0.8
  },
  {
    id: 'joy-corps',
    title: 'Joy Corps Transformation',
    type: 'application',
    description: 'Organizational change through relational principles and stakeholder flourishing',
    connections: ['seven-generation-thinking', 'systems-thinking', 'stakeholder-engagement', 'cultural-change'],
    strength: 0.8
  },
  {
    id: 'mentoring',
    title: 'Reverse Mentoring',
    type: 'application',
    description: 'Bidirectional learning relationships that honor different forms of knowledge',
    connections: ['reciprocity', 'cultural-protocol', 'relationship-building', 'youth-leadership'],
    strength: 0.7
  },
  {
    id: 'systems-thinking',
    title: 'Indigenous Systems Thinking',
    type: 'principle',
    description: 'Understanding interconnections and relationships within complex systems',
    connections: ['seven-generation-thinking', 'joy-corps', 'network-effects', 'holistic-approach'],
    strength: 0.9
  }
];

const mockProgress: LearningProgress[] = [
  {
    pathway: 'Indigenous Systems Thinking',
    completed: 3,
    total: 8,
    currentConcept: 'Seven-generation decision making',
    achievements: ['Systems mapping', 'Relationship identification', 'Cultural protocol understanding']
  },
  {
    pathway: 'Hoodie Economics Fundamentals',
    completed: 0,
    total: 6,
    currentConcept: 'Not started',
    achievements: []
  }
];

export default function UnderstandPage() {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [progress] = useState<LearningProgress[]>(mockProgress);

  const getConceptById = (id: string) => {
    return conceptMap.find(c => c.id === id);
  };

  const getConnectedConcepts = (conceptId: string) => {
    const concept = getConceptById(conceptId);
    if (!concept) return [];
    return concept.connections.map(id => getConceptById(id)).filter(Boolean);
  };

  const getConceptTypeColor = (type: string) => {
    const colors = {
      'principle': 'bg-blue-50 text-blue-900 border-blue-200',
      'application': 'bg-green-50 text-green-900 border-green-200',
      'example': 'bg-purple-50 text-purple-900 border-purple-200',
      'tool': 'bg-orange-50 text-orange-900 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-900 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Understanding Connections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Visualize how concepts connect across Indigenous knowledge systems, 
            track your learning progress, and discover unexpected relationships between ideas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Knowledge Map */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-light text-gray-900">Knowledge Map</h2>
                <button
                  onClick={() => setShowConnections(!showConnections)}
                  className="text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 hover:border-gray-400 transition-colors"
                >
                  {showConnections ? 'Hide connections' : 'Show connections'}
                </button>
              </div>
              <p className="text-gray-600 mb-8">
                Click on any concept to explore its connections and see how Indigenous wisdom 
                integrates across different applications and contexts.
              </p>
            </div>

            {/* Concept Map Visualization */}
            <div className="relative">
              {/* Background grid for visual structure */}
              <div className="absolute inset-0 grid grid-cols-3 gap-8 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-gray-200"></div>
                ))}
              </div>

              {/* Concept nodes */}
              <div className="relative grid grid-cols-3 gap-8 p-8">
                {conceptMap.slice(0, 6).map((concept, index) => (
                  <div
                    key={concept.id}
                    className={`relative p-6 border-2 cursor-pointer transition-all ${getConceptTypeColor(concept.type)} ${
                      selectedConcept === concept.id 
                        ? 'scale-105 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
                  >
                    <div className="mb-3">
                      <span className="text-xs uppercase tracking-wide font-medium opacity-75">
                        {concept.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium mb-2">{concept.title}</h3>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {concept.description.substring(0, 80)}...
                    </p>
                    
                    {/* Connection strength indicator */}
                    <div className="absolute top-2 right-2">
                      <div className={`w-2 h-2 rounded-full ${
                        concept.strength > 0.8 ? 'bg-green-500' :
                        concept.strength > 0.6 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connection lines (simplified visualization) */}
              {showConnections && selectedConcept && (
                <svg className="absolute inset-0 pointer-events-none" style={{zIndex: 1}}>
                  {/* Simple connection visualization - in real implementation, this would be more sophisticated */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                    </marker>
                  </defs>
                  <line x1="50%" y1="50%" x2="80%" y2="30%" 
                        stroke="#6B7280" strokeWidth="2" opacity="0.6"
                        markerEnd="url(#arrowhead)" />
                  <line x1="50%" y1="50%" x2="20%" y2="80%" 
                        stroke="#6B7280" strokeWidth="2" opacity="0.6"
                        markerEnd="url(#arrowhead)" />
                </svg>
              )}
            </div>

            {/* Selected Concept Details */}
            {selectedConcept && (
              <div className="mt-8 p-8 bg-gray-50 border-l-4 border-gray-400">
                {(() => {
                  const concept = getConceptById(selectedConcept);
                  if (!concept) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-light text-gray-900">{concept.title}</h3>
                        <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${getConceptTypeColor(concept.type)}`}>
                          {concept.type}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {concept.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Connected concepts:</h4>
                        <div className="flex flex-wrap gap-2">
                          {getConnectedConcepts(selectedConcept).map((connected) => (
                            <button
                              key={connected?.id}
                              onClick={() => setSelectedConcept(connected?.id || null)}
                              className="text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1 rounded transition-colors"
                            >
                              {connected?.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Link 
                          href={`/discover?q=${encodeURIComponent(concept.title)}`}
                          className="text-sm text-gray-900 hover:text-gray-700 font-medium"
                        >
                          Explore content →
                        </Link>
                        <Link 
                          href={`/learn?focus=${concept.id}`}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Learn more
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Learning Progress Sidebar */}
          <div className="lg:col-span-1">
            {/* Current Progress */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Your Learning Progress</h3>
              
              <div className="space-y-6">
                {progress.map((item) => (
                  <div key={item.pathway} className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{item.pathway}</h4>
                      <span className="text-sm text-gray-500">
                        {item.completed}/{item.total}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${(item.completed / item.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Current: </span>
                      {item.currentConcept}
                    </div>

                    {item.achievements.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Completed:</p>
                        <div className="space-y-1">
                          {item.achievements.map((achievement, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link 
                        href={`/learn/${item.pathway.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-gray-900 hover:text-gray-700 font-medium"
                      >
                        Continue learning →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link 
                  href="/learn"
                  className="text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 px-4 py-2 transition-colors"
                >
                  Explore all pathways
                </Link>
              </div>
            </div>

            {/* Concept Legend */}
            <div className="bg-gray-50 p-6">
              <h4 className="font-medium text-gray-900 mb-4">Concept Types</h4>
              <div className="space-y-3">
                {[
                  { type: 'principle', label: 'Core Principles', desc: 'Fundamental Indigenous wisdom' },
                  { type: 'application', label: 'Applications', desc: 'Practical implementations' },
                  { type: 'example', label: 'Examples', desc: 'Real-world cases' },
                  { type: 'tool', label: 'Tools', desc: 'Implementation resources' }
                ].map(item => (
                  <div key={item.type} className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded border-2 mt-1 ${getConceptTypeColor(item.type)}`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}