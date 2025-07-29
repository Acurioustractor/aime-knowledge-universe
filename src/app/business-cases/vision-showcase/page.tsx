'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  HeartIcon, 
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  LightBulbIcon,
  BookOpenIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

interface BusinessCase {
  id: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: Record<string, any>;
  industry: string;
  region: string;
  program_type: string;
  year: number;
  tags: string[];
  is_featured: boolean;
  vision_principles: string[];
  transformation_type: 'relationship_wealth' | 'imagination_currency' | 'indigenous_wisdom' | 'systems_change';
}

const visionFramework = {
  relationship_wealth: {
    title: "Relationships as Wealth",
    description: "Where connections create value beyond transactions",
    icon: HeartIcon,
    color: "from-rose-400 to-pink-600",
    examples: ["Mentoring networks", "Corporate partnerships", "Community trust"]
  },
  imagination_currency: {
    title: "Imagination as Currency", 
    description: "Creative capacity becomes the primary measure of value",
    icon: SparklesIcon,
    color: "from-purple-400 to-indigo-600",
    examples: ["Digital innovation", "Problem-solving creativity", "Future visioning"]
  },
  indigenous_wisdom: {
    title: "Indigenous Systems Thinking",
    description: "Ancient wisdom guides modern solutions",
    icon: BookOpenIcon,
    color: "from-green-400 to-emerald-600", 
    examples: ["Ubuntu philosophy", "Seven-generation thinking", "Relational approaches"]
  },
  systems_change: {
    title: "Systems Transformation",
    description: "Reimagining how organizations and societies operate",
    icon: GlobeAltIcon,
    color: "from-blue-400 to-cyan-600",
    examples: ["Education reform", "Corporate culture shift", "Economic model change"]
  }
};

export default function BusinessCasesVisionShowcase() {
  const [cases, setCases] = useState<BusinessCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<BusinessCase | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await fetch('/api/business-cases');
      const data = await response.json();
      
      if (data.success) {
        // Enhance cases with vision mapping
        const enhancedCases = data.data.map((businessCase: any) => ({
          ...businessCase,
          id: businessCase.id || generateId(businessCase.title),
          vision_principles: extractVisionPrinciples(businessCase),
          transformation_type: determineTransformationType(businessCase)
        }));
        setCases(enhancedCases);
      }
    } catch (error) {
      console.error('Failed to load business cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateId = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  };

  const extractVisionPrinciples = (businessCase: any): string[] => {
    const principles = [];
    const text = `${businessCase.challenge} ${businessCase.solution} ${businessCase.impact}`.toLowerCase();
    
    if (text.includes('mentor') || text.includes('relationship') || text.includes('partnership')) {
      principles.push('relationship_wealth');
    }
    if (text.includes('innovation') || text.includes('creative') || text.includes('imagination')) {
      principles.push('imagination_currency');
    }
    if (text.includes('indigenous') || text.includes('cultural') || text.includes('ubuntu')) {
      principles.push('indigenous_wisdom');
    }
    if (text.includes('transform') || text.includes('system') || text.includes('change')) {
      principles.push('systems_change');
    }
    
    return principles.length > 0 ? principles : ['systems_change'];
  };

  const determineTransformationType = (businessCase: any): BusinessCase['transformation_type'] => {
    const text = `${businessCase.challenge} ${businessCase.solution}`.toLowerCase();
    
    if (text.includes('mentor') || text.includes('partnership')) return 'relationship_wealth';
    if (text.includes('digital') || text.includes('innovation')) return 'imagination_currency';  
    if (text.includes('indigenous') || text.includes('cultural')) return 'indigenous_wisdom';
    return 'systems_change';
  };

  const filteredCases = selectedPrinciple === 'all' 
    ? cases 
    : cases.filter(c => c.vision_principles.includes(selectedPrinciple));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading vision demonstrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white bg-opacity-10 rounded-full px-6 py-3 mb-6">
              <SparklesIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Vision in Action</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Business Cases as
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Vision Proof Points
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Real stories of transformation showing how AIME's revolutionary principles 
              create measurable impact across education, corporate partnerships, and global systems change.
            </p>
          </div>

          {/* Vision Framework Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Object.entries(visionFramework).map(([key, framework]) => {
              const Icon = framework.icon;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedPrinciple(selectedPrinciple === key ? 'all' : key)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedPrinciple === key 
                      ? 'border-white bg-white bg-opacity-10 scale-105' 
                      : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${framework.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{framework.title}</h3>
                  <p className="text-gray-300 text-sm">{framework.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Cases Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            {selectedPrinciple === 'all' ? 'All Vision Demonstrations' : `${visionFramework[selectedPrinciple as keyof typeof visionFramework]?.title} Cases`}
          </h2>
          <div className="text-gray-300">
            {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredCases.map((businessCase) => {
            const transformationType = visionFramework[businessCase.transformation_type];
            const Icon = transformationType.icon;
            
            return (
              <div
                key={businessCase.id}
                className="group bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCase(businessCase)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${transformationType.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{businessCase.year}</div>
                    <div className="text-gray-300 text-xs">{businessCase.region}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                  {businessCase.title}
                </h3>
                
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {businessCase.summary}
                </p>

                {/* Metrics Preview */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(businessCase.metrics).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{value}</div>
                      <div className="text-xs text-gray-400">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Vision Principles Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {businessCase.vision_principles.map((principle) => {
                    const framework = visionFramework[principle as keyof typeof visionFramework];
                    return (
                      <span
                        key={principle}
                        className={`px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${framework.color} bg-opacity-80`}
                      >
                        {framework.title}
                      </span>
                    );
                  })}
                </div>

                {/* Industry Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full">
                    {businessCase.industry}
                  </span>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Create Your Own Vision Story?
            </h3>
            <p className="text-white text-lg mb-6 opacity-90">
              Join the movement transforming how we create value, build relationships, and change systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/connect"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Start Your Journey
              </Link>
              <Link 
                href="/hoodie-exchange"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Explore Hoodies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedCase.title}</h2>
                  <div className="text-gray-300">{selectedCase.region} • {selectedCase.year}</div>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">The Challenge</h3>
                    <p className="text-gray-300">{selectedCase.challenge}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">The Solution</h3>
                    <p className="text-gray-300">{selectedCase.solution}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">The Impact</h3>
                    <p className="text-gray-300">{selectedCase.impact}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedCase.metrics).map(([key, value]) => (
                        <div key={key} className="bg-white bg-opacity-10 rounded-lg p-3">
                          <div className="text-yellow-400 font-bold text-lg">{value}</div>
                          <div className="text-gray-300 text-sm">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Vision Principles</h3>
                    <div className="space-y-2">
                      {selectedCase.vision_principles.map((principle) => {
                        const framework = visionFramework[principle as keyof typeof visionFramework];
                        const Icon = framework.icon;
                        return (
                          <div key={principle} className="flex items-center bg-white bg-opacity-10 rounded-lg p-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${framework.color} flex items-center justify-center mr-3`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{framework.title}</div>
                              <div className="text-gray-400 text-xs">{framework.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}