'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AIMEBusinessCase {
  id: string;
  title: string;
  subtitle: string;
  core_challenge: string;
  transformation_approach: string;
  target_audience: string;
  key_outcomes: string[];
  market_size: string;
  digital_hoodies: any[];
  phases: any[];
  related_videos: string[];
  related_tools: string[];
  related_newsletters: string[];
  action_steps: any[];
  engagement_opportunities: any[];
  impact_metrics: any[];
  tags: string[];
  color_theme: string;
  icon: string;
  priority: 'flagship' | 'core' | 'emerging';
  status: 'active' | 'launching' | 'concept';
}

interface AIMEBusinessCasesHubProps {
  initialCases?: AIMEBusinessCase[];
}

export default function AIMEBusinessCasesHub({ initialCases = [] }: AIMEBusinessCasesHubProps) {
  const [cases, setCases] = useState<AIMEBusinessCase[]>(initialCases);
  const [loading, setLoading] = useState(!initialCases.length);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'flagship' | 'core' | 'emerging'>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'journey' | 'network'>('cards');
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

  useEffect(() => {
    if (!initialCases.length) {
      loadCases();
    }
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business-cases/aime-process');
      const result = await response.json();
      
      if (result.success) {
        setCases(result.cases_preview || []);
      }
    } catch (error) {
      console.error('Error loading AIME business cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const processCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business-cases/aime-process', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        await loadCases(); // Reload processed cases
      }
    } catch (error) {
      console.error('Error processing cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;
    if (selectedTheme !== 'all' && !c.tags.includes(selectedTheme)) return false;
    if (selectedCategory !== 'all') {
      // Map categories to business case types
      const categoryMapping: Record<string, string[]> = {
        'organizational': ['joy-corps', 'custodians'],
        'leadership': ['presidents', 'citizens'],
        'education': ['imagi-labs', 'indigenous-labs'],
        'innovation': ['mentor-credit', 'systems-residency']
      };
      const relevantCases = categoryMapping[selectedCategory] || [];
      if (!relevantCases.includes(c.id)) return false;
    }
    return true;
  });

  const flagshipCases = cases.filter(c => c.priority === 'flagship');
  const coreCases = cases.filter(c => c.priority === 'core');
  const themes = [...new Set(cases.flatMap(c => c.tags))];

  const getColorClasses = (theme: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', hover: 'hover:border-purple-400' },
      gold: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', hover: 'hover:border-yellow-400' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', hover: 'hover:border-green-400' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', hover: 'hover:border-blue-400' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', hover: 'hover:border-orange-400' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', hover: 'hover:border-teal-400' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', hover: 'hover:border-indigo-400' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', hover: 'hover:border-red-400' }
    };
    return colorMap[theme] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AIME Business Cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container-wiki py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              AIME's Transformation Pathways
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Eight comprehensive business cases demonstrating how AIME's relational economics 
              and imagination-based approaches create systemic transformation across education, 
              leadership, and organizational change.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{cases.length}</div>
                <div className="text-sm text-blue-200">Transformation Pathways</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{cases.reduce((sum, c) => sum + c.phases, 0)}</div>
                <div className="text-sm text-blue-200">Implementation Phases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{cases.reduce((sum, c) => sum + c.digital_hoodies, 0)}</div>
                <div className="text-sm text-blue-200">Digital Hoodies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">∞</div>
                <div className="text-sm text-blue-200">Impact Potential</div>
              </div>
            </div>

            {cases.length === 0 && (
              <button
                onClick={processCases}
                className="bg-yellow-500 text-yellow-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
              >
                🚀 Process Business Cases
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation & Filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container-wiki py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {[
                  { mode: 'cards', label: '📋 Cards', desc: 'Card view' },
                  { mode: 'journey', label: '🗺️ Journey', desc: 'Journey map' },
                  { mode: 'network', label: '🕸️ Network', desc: 'Network view' }
                ].map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="flagship">🌟 Flagship</option>
                <option value="core">⚡ Core</option>
                <option value="emerging">🌱 Emerging</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="organizational">🏢 Organizational</option>
                <option value="leadership">👑 Leadership</option>
                <option value="education">🎓 Education</option>
                <option value="innovation">🚀 Innovation</option>
              </select>

              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Themes</option>
                {themes.slice(0, 8).map(theme => (
                  <option key={theme} value={theme}>
                    {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container-wiki">
          {/* Flagship Cases Spotlight */}
          {flagshipCases.length > 0 && viewMode === 'cards' && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">🌟 Flagship Transformations</h2>
                <p className="text-lg text-gray-600">Our most comprehensive and impactful transformation pathways</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {flagshipCases.map((businessCase) => (
                  <FlagshipCaseCard key={businessCase.id} businessCase={businessCase} />
                ))}
              </div>
            </div>
          )}

          {/* Journey Map View */}
          {viewMode === 'journey' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">🗺️ Transformation Journey Map</h2>
              <div className="relative">
                {/* Journey Path */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 transform -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCases.map((businessCase, index) => (
                    <JourneyStepCard key={businessCase.id} businessCase={businessCase} stepNumber={index + 1} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Network View */}
          {viewMode === 'network' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">🕸️ Interconnected Network</h2>
              <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 min-h-96">
                <NetworkVisualization cases={filteredCases} hoveredCase={hoveredCase} setHoveredCase={setHoveredCase} />
              </div>
            </div>
          )}

          {/* Standard Cards View */}
          {viewMode === 'cards' && (
            <>
              {/* Core Cases */}
              {coreCases.length > 0 && (
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ Core Transformation Cases</h2>
                    <p className="text-gray-600">Essential pathways for systemic change</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coreCases.map((businessCase) => (
                      <CoreCaseCard key={businessCase.id} businessCase={businessCase} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Take Action Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Transformation?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
              Each pathway offers multiple ways to engage - from learning the frameworks to leading 
              transformation in your community. Choose your level of commitment and impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { level: 'Learn', commitment: '2-4 hours', icon: '📚', desc: 'Explore frameworks' },
                { level: 'Participate', commitment: '1-2 weeks', icon: '🤝', desc: 'Join working groups' },
                { level: 'Implement', commitment: '3-6 months', icon: '🚀', desc: 'Run pilot programs' },
                { level: 'Lead', commitment: 'Ongoing', icon: '👑', desc: 'Drive systemic change' }
              ].map(({ level, commitment, icon, desc }) => (
                <div key={level} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-bold mb-1">{level}</div>
                  <div className="text-sm opacity-75 mb-2">{commitment}</div>
                  <div className="text-xs opacity-60">{desc}</div>
                </div>
              ))}
            </div>
            
            <button className="mt-8 bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              🌟 Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for flagship cases
function FlagshipCaseCard({ businessCase }: { businessCase: AIMEBusinessCase }) {
  const colors = {
    purple: 'from-purple-600 to-indigo-600',
    gold: 'from-yellow-500 to-orange-500',
    green: 'from-green-600 to-teal-600',
    blue: 'from-blue-600 to-cyan-600'
  }[businessCase.color_theme] || 'from-blue-600 to-purple-600';

  return (
    <div className={`group relative bg-gradient-to-br ${colors} rounded-xl p-8 text-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
      <div className="absolute top-4 right-4 text-3xl">{businessCase.icon}</div>
      <div className="absolute top-4 left-4">
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
          🌟 FLAGSHIP
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-2 leading-tight">{businessCase.title}</h3>
        <p className="text-lg opacity-90 mb-4">{businessCase.subtitle}</p>
        <p className="opacity-75 mb-6 line-clamp-3">{businessCase.core_challenge}</p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{businessCase.phases}</div>
            <div className="text-xs opacity-75">Transformation Phases</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{businessCase.digital_hoodies}</div>
            <div className="text-xs opacity-75">Digital Hoodies</div>
          </div>
        </div>
        
        <Link 
          href={`/business-cases/${businessCase.id}`}
          className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Explore Pathway
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// Component for core cases
function CoreCaseCard({ businessCase }: { businessCase: AIMEBusinessCase }) {
  const colorClasses = {
    purple: 'border-purple-200 hover:border-purple-400 bg-purple-50',
    gold: 'border-yellow-200 hover:border-yellow-400 bg-yellow-50',
    green: 'border-green-200 hover:border-green-400 bg-green-50',
    blue: 'border-blue-200 hover:border-blue-400 bg-blue-50',
    orange: 'border-orange-200 hover:border-orange-400 bg-orange-50',
    teal: 'border-teal-200 hover:border-teal-400 bg-teal-50',
    indigo: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50',
    red: 'border-red-200 hover:border-red-400 bg-red-50'
  }[businessCase.color_theme] || 'border-blue-200 hover:border-blue-400 bg-blue-50';

  return (
    <div className={`group bg-white border-2 ${colorClasses} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{businessCase.icon}</div>
        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
          ⚡ CORE
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
        {businessCase.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{businessCase.subtitle}</p>
      
      {/* Tags */}
      {businessCase.tags && businessCase.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {businessCase.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <Link 
        href={`/business-cases/${businessCase.id}`}
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        Explore Details →
      </Link>
    </div>
  );
}

// Component for journey steps
function JourneyStepCard({ businessCase, stepNumber }: { businessCase: AIMEBusinessCase; stepNumber: number }) {
  return (
    <div className="relative">
      {/* Journey Node */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
        {stepNumber}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-8 hover:shadow-lg transition-shadow">
        <div className="text-2xl mb-2 text-center">{businessCase.icon}</div>
        <h3 className="font-bold text-gray-900 text-center mb-2 text-sm">{businessCase.title}</h3>
        <p className="text-xs text-gray-600 text-center line-clamp-2">{businessCase.subtitle}</p>
        
        <div className="mt-3 text-center">
          <Link 
            href={`/business-cases/${businessCase.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Network visualization component
function NetworkVisualization({ cases, hoveredCase, setHoveredCase }: { 
  cases: AIMEBusinessCase[]; 
  hoveredCase: string | null; 
  setHoveredCase: (id: string | null) => void;
}) {
  return (
    <div className="relative w-full h-full min-h-96">
      {cases.map((businessCase, index) => {
        const angle = (index / cases.length) * 2 * Math.PI;
        const radius = 120;
        const x = 50 + (radius * Math.cos(angle)) * 0.4; // Scale down for container
        const y = 50 + (radius * Math.sin(angle)) * 0.4;
        
        return (
          <div
            key={businessCase.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              hoveredCase === businessCase.id ? 'scale-110 z-10' : 'scale-100'
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
            onMouseEnter={() => setHoveredCase(businessCase.id)}
            onMouseLeave={() => setHoveredCase(null)}
          >
            <div className="bg-white rounded-full p-4 shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
              <div className="text-2xl text-center">{businessCase.icon}</div>
              <div className="text-xs font-bold text-center mt-1">{businessCase.title.split(':')[0]}</div>
            </div>
            
            {hoveredCase === businessCase.id && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-48 z-20">
                <h4 className="font-bold text-sm mb-1">{businessCase.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{businessCase.subtitle}</p>
                <Link 
                  href={`/business-cases/${businessCase.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                >
                  Explore →
                </Link>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Connection lines (simplified) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {cases.map((_, index) => {
          const angle1 = (index / cases.length) * 2 * Math.PI;
          const angle2 = ((index + 1) / cases.length) * 2 * Math.PI;
          const radius = 120 * 0.4;
          
          const x1 = 50 + radius * Math.cos(angle1);
          const y1 = 50 + radius * Math.sin(angle1);
          const x2 = 50 + radius * Math.cos(angle2);
          const y2 = 50 + radius * Math.sin(angle2);
          
          return (
            <line
              key={index}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}