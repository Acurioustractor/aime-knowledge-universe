'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LearningPathway {
  id: string;
  title: string;
  description: string;
  duration: string;
  concepts: string[];
  prerequisites: string[];
  outcomes: string[];
  progress?: number;
}

const learningPathways: LearningPathway[] = [
  {
    id: 'indigenous-systems-thinking',
    title: 'Indigenous Systems Thinking',
    description: 'Understand how Indigenous wisdom informs modern approaches to complex challenges through seven-generation thinking, reciprocity, and relational decision-making.',
    duration: '6-8 weeks',
    concepts: ['Seven-generation thinking', 'Reciprocity principles', 'Collective decision-making', 'Systems interconnection'],
    prerequisites: [],
    outcomes: ['Apply Indigenous principles to modern challenges', 'Make decisions considering long-term impact', 'Understand systems interconnections'],
    progress: 0
  },
  {
    id: 'hoodie-economics',
    title: 'Hoodie Economics Fundamentals',
    description: 'Learn the principles of relational economics where value is created through relationships, imagination, and community validation rather than traditional market forces.',
    duration: '4-6 weeks',
    concepts: ['Relational value creation', 'Community validation', 'Imagination as currency', 'Economic reciprocity'],
    prerequisites: [],
    outcomes: ['Design relational value systems', 'Implement community validation processes', 'Create economic models based on relationships'],
    progress: 0
  },
  {
    id: 'mentoring-methodology',
    title: 'AIME Mentoring Methodology',
    description: 'Master the art of reverse mentoring and relationship-first approaches that have transformed thousands of young people and communities worldwide.',
    duration: '8-10 weeks',
    concepts: ['Reverse mentoring', 'Relationship building', 'Cultural protocol', 'Impact measurement'],
    prerequisites: [],
    outcomes: ['Facilitate effective mentoring relationships', 'Design culturally appropriate programs', 'Measure relational impact'],
    progress: 0
  },
  {
    id: 'joy-corps-transformation',
    title: 'Joy Corps Organizational Change',
    description: 'Transform organizations through relational principles, moving from transactional to relationship-based operations that benefit all stakeholders.',
    duration: '12-16 weeks',
    concepts: ['Organizational transformation', 'Stakeholder relationships', 'Cultural change', 'Systemic impact'],
    prerequisites: ['Indigenous Systems Thinking', 'Hoodie Economics Fundamentals'],
    outcomes: ['Lead organizational transformation', 'Implement relational business practices', 'Measure systemic change'],
    progress: 0
  },
  {
    id: 'imagination-curriculum',
    title: 'Imagination-Centered Learning Design',
    description: 'Design educational experiences that center imagination, creativity, and practical application rather than traditional knowledge transfer methods.',
    duration: '10-12 weeks',
    concepts: ['Imagination-centered pedagogy', 'Experiential learning', 'Creative problem-solving', 'Learning assessment'],
    prerequisites: ['Mentoring Methodology'],
    outcomes: ['Design imagination-centered curricula', 'Facilitate creative learning', 'Assess transformational outcomes'],
    progress: 0
  },
  {
    id: 'systems-change-leadership',
    title: 'Systems Change Leadership',
    description: 'Develop the skills to lead transformation at scale, working with complex systems and multiple stakeholders to create lasting positive change.',
    duration: '16-20 weeks',
    concepts: ['Systems intervention', 'Multi-stakeholder engagement', 'Change strategy', 'Leadership development'],
    prerequisites: ['Indigenous Systems Thinking', 'Joy Corps Transformation'],
    outcomes: ['Design systems interventions', 'Lead multi-stakeholder change', 'Create lasting transformation'],
    progress: 0
  }
];

const coreKnowledgeAreas = [
  {
    title: 'Indigenous Wisdom',
    description: 'Ancient knowledge systems applied to contemporary challenges',
    resources: 156,
    keyTopics: ['Seven-generation thinking', 'Reciprocity', 'Ceremony and protocol', 'Land-based learning']
  },
  {
    title: 'Relational Economics',
    description: 'Economic models based on relationships rather than transactions',
    resources: 89,
    keyTopics: ['Value creation', 'Community validation', 'Imagination currency', 'Network effects']
  },
  {
    title: 'Systems Transformation',
    description: 'Approaches to changing complex organizational and social systems',
    resources: 124,
    keyTopics: ['Leverage points', 'Stakeholder engagement', 'Cultural change', 'Impact measurement']
  },
  {
    title: 'Youth Leadership',
    description: 'Empowering young people as agents of systemic change',
    resources: 78,
    keyTopics: ['Mentoring models', 'Leadership development', 'Intergenerational learning', 'Community organizing']
  }
];

export default function LearnPage() {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Structured Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Build deep understanding through carefully designed learning pathways that 
            integrate Indigenous wisdom with practical application and community validation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Learning Pathways */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-light text-gray-900">Learning Pathways</h2>
            <p className="text-gray-600">Choose your journey through AIME's methodology</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {learningPathways.map((pathway) => (
              <div 
                key={pathway.id} 
                className="border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-900">{pathway.title}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {pathway.duration}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {pathway.description}
                  </p>

                  {/* Prerequisites */}
                  {pathway.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
                      <div className="flex flex-wrap gap-2">
                        {pathway.prerequisites.map((prereq) => (
                          <span key={prereq} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Concepts */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key concepts:</p>
                    <div className="flex flex-wrap gap-2">
                      {pathway.concepts.slice(0, 3).map((concept) => (
                        <span key={concept} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                          {concept}
                        </span>
                      ))}
                      {pathway.concepts.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{pathway.concepts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/learn/${pathway.id}`}
                      className="text-gray-900 hover:text-gray-700 font-medium"
                    >
                      Begin pathway →
                    </Link>
                    <button
                      onClick={() => setSelectedPathway(selectedPathway === pathway.id ? null : pathway.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {selectedPathway === pathway.id ? 'Hide details' : 'View details'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedPathway === pathway.id && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Learning outcomes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {pathway.outcomes.map((outcome, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">All concepts covered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {pathway.concepts.map((concept) => (
                              <span key={concept} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Knowledge Areas */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Core Knowledge Areas</h2>
            <p className="text-gray-600">
              Explore key domains of AIME's methodology with curated resources and learning materials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreKnowledgeAreas.map((area) => (
              <div key={area.title} className="bg-gray-50 p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-900">{area.title}</h3>
                  <span className="text-sm text-gray-500">
                    {area.resources} resources
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {area.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Key topics:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {area.keyTopics.map((topic) => (
                      <span key={topic} className="text-sm text-gray-600">
                        • {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  href={`/discover?q=${encodeURIComponent(area.title.toLowerCase())}`}
                  className="text-gray-900 hover:text-gray-700 font-medium text-sm"
                >
                  Explore resources →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Living Applications */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Living Applications</h2>
            <p className="text-gray-600">
              See AIME's methodology in action through interactive platforms and real-world implementations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mentor App */}
            <div className="border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">📱 Mentor App</h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Experience relationship-first mentoring methodology through our interactive platform. 
                  Build meaningful connections, track learning progress, and contribute to community wisdom.
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Key Features:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Mentoring relationship building and tracking
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Community validation and peer recognition
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Success story documentation and sharing
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Assessment frameworks and impact measurement
                    </div>
                  </div>
                </div>

                <Link 
                  href="/mentor-app"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Explore Mentor App →
                </Link>
              </div>
            </div>

            {/* IMAGI-NATION TV */}
            <div className="border border-gray-200 hover:border-purple-300 transition-colors">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">📺 IMAGI-NATION TV</h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Learn through visual storytelling with 423+ episodes featuring global wisdom keepers, 
                  transformation stories, and practical applications of Indigenous systems thinking.
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Content Highlights:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Thematic learning playlists by concept
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Global voices from 52 countries
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Workshop series and training programs
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Speaker profiles and wisdom keeper interviews
                    </div>
                  </div>
                </div>

                <Link 
                  href="/content/videos"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  Watch IMAGI-NATION TV →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-gray-900 text-white p-12 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Ready to begin your learning journey?</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Start with Indigenous Systems Thinking to build the foundational understanding 
              that informs all of AIME's methodology, or explore our core knowledge areas 
              to find the topics most relevant to your interests and goals.
            </p>
            <div className="flex justify-center space-x-6">
              <Link 
                href="/learn/indigenous-systems-thinking"
                className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
              >
                Start with Indigenous Systems Thinking
              </Link>
              <Link 
                href="/discover"
                className="px-8 py-3 border border-gray-600 text-white hover:border-gray-500 transition-colors"
              >
                Browse all content
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}