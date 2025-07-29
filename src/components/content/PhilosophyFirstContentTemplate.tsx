/**
 * Philosophy-First Content Template
 * 
 * Enhanced template that presents content through philosophy-first lens with
 * integrated business cases, evidence, and implementation pathways
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  LightBulbIcon,
  ChartBarIcon,
  MapIcon,
  DocumentTextIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { ConceptBadge, ConceptHighlighter } from '@/components/philosophy/ContextualTooltip';
import BusinessCaseNarrative from './BusinessCaseNarrative';

interface PhilosophyContext {
  domain: string;
  coreValue: string;
  keyPrinciple: string;
  practicalApplication: string;
  expectedOutcome: string;
}

interface Evidence {
  type: 'story' | 'data' | 'research' | 'testimonial';
  title: string;
  content: string;
  source?: string;
  impact?: string;
  credibility: number;
}

interface ImplementationStep {
  id: string;
  title: string;
  description: string;
  philosophyConnection: string;
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  resources: string[];
  successMetrics: string[];
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  philosophyContext: PhilosophyContext;
  businessCase: {
    problem: string;
    solution: string;
    benefits: string[];
    evidence: Evidence[];
  };
  implementationPathway: {
    overview: string;
    steps: ImplementationStep[];
    timeline: string;
    successStories: string[];
  };
  relatedConcepts: string[];
  tags: string[];
  estimatedReadTime: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface PhilosophyFirstContentTemplateProps {
  content: ContentItem;
  conceptDefinitions: Record<string, any>;
  onConceptEngagement?: (concept: string, action: string) => void;
  onImplementationStart?: (stepId: string) => void;
  onEvidenceView?: (evidenceId: string) => void;
  className?: string;
}

export default function PhilosophyFirstContentTemplate({
  content,
  conceptDefinitions,
  onConceptEngagement,
  onImplementationStart,
  onEvidenceView,
  className = ''
}: PhilosophyFirstContentTemplateProps) {
  const [activeSection, setActiveSection] = useState<'philosophy' | 'business' | 'implementation'>('philosophy');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedEvidence, setExpandedEvidence] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Track reading progress
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrolled / maxHeight) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const toggleEvidenceExpansion = (evidenceIndex: number) => {
    const evidenceId = `evidence-${evidenceIndex}`;
    const newExpanded = new Set(expandedEvidence);
    if (newExpanded.has(evidenceId)) {
      newExpanded.delete(evidenceId);
    } else {
      newExpanded.add(evidenceId);
      onEvidenceView?.(evidenceId);
    }
    setExpandedEvidence(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'story': return <BookOpenIcon className="h-4 w-4" />;
      case 'data': return <ChartBarIcon className="h-4 w-4" />;
      case 'research': return <DocumentTextIcon className="h-4 w-4" />;
      case 'testimonial': return <UserGroupIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const renderContentWithConcepts = (text: string) => {
    return (
      <ConceptHighlighter
        content={text}
        concepts={content.relatedConcepts}
        conceptDefinitions={conceptDefinitions}
        philosophyDomain={content.philosophyContext.domain}
        onEngagement={onConceptEngagement}
      />
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                <p className="text-gray-600 mt-1">{content.description}</p>
              </div>
            </div>

            {/* Philosophy Context Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg mb-4">
              <LightBulbIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-800 font-medium">{content.philosophyContext.domain}</span>
              <span className="text-purple-600">•</span>
              <span className="text-purple-700">{content.philosophyContext.coreValue}</span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{content.estimatedReadTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4" />
                <span className="capitalize">{content.difficultyLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapIcon className="h-4 w-4" />
                <span>{content.implementationPathway.steps.length} implementation steps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-6">
          <button
            onClick={() => setActiveSection('philosophy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'philosophy'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LightBulbIcon className="h-4 w-4 inline mr-2" />
            Philosophy
          </button>
          <button
            onClick={() => setActiveSection('business')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'business'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 inline mr-2" />
            Business Case
          </button>
          <button
            onClick={() => setActiveSection('implementation')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'implementation'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapIcon className="h-4 w-4 inline mr-2" />
            Implementation
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Philosophy Section */}
        {activeSection === 'philosophy' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <LightBulbIcon className="h-6 w-6 text-purple-600" />
                Philosophy Foundation
              </h2>
              
              {/* Core Philosophy Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Core Value</h3>
                  <p className="text-purple-800">{content.philosophyContext.coreValue}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Key Principle</h3>
                  <p className="text-purple-800">{content.philosophyContext.keyPrinciple}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Practical Application</h3>
                  <p className="text-purple-800">{content.philosophyContext.practicalApplication}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Expected Outcome</h3>
                  <p className="text-purple-800">{content.philosophyContext.expectedOutcome}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed">
                {renderContentWithConcepts(content.content)}
              </div>
            </div>

            {/* Related Concepts */}
            {content.relatedConcepts.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {content.relatedConcepts.map(concept => (
                    <ConceptBadge
                      key={concept}
                      concept={concept}
                      explanation={conceptDefinitions[concept]?.explanation || 'No definition available'}
                      philosophyDomain={content.philosophyContext.domain}
                      variant="primary"
                      onEngagement={onConceptEngagement}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Business Case Section */}
        {activeSection === 'business' && (
          <div className="space-y-6">
            <BusinessCaseNarrative
              problem={content.businessCase.problem}
              solution={content.businessCase.solution}
              benefits={content.businessCase.benefits}
              evidence={content.businessCase.evidence}
              philosophyContext={content.philosophyContext}
              onEvidenceView={onEvidenceView}
            />

            {/* Evidence Deep Dive */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                Supporting Evidence
              </h3>
              
              <div className="space-y-4">
                {content.businessCase.evidence.map((evidence, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleEvidenceExpansion(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getEvidenceIcon(evidence.type)}     
                     </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{evidence.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                evidence.type === 'story' ? 'bg-green-100 text-green-800' :
                                evidence.type === 'data' ? 'bg-blue-100 text-blue-800' :
                                evidence.type === 'research' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {evidence.type}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < evidence.credibility ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRightIcon className={`h-4 w-4 text-gray-400 transition-transform ${
                          expandedEvidence.has(`evidence-${index}`) ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                    
                    {expandedEvidence.has(`evidence-${index}`) && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="pt-4">
                          <p className="text-gray-700 mb-4">{evidence.content}</p>
                          
                          <div className="flex items-center justify-between text-sm">
                            {evidence.source && (
                              <div className="text-gray-600">
                                <strong>Source:</strong> {evidence.source}
                              </div>
                            )}
                            {evidence.impact && (
                              <div className="text-green-600 font-medium">
                                Impact: {evidence.impact}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Implementation Section */}
        {activeSection === 'implementation' && (
          <div className="space-y-6">
            {/* Implementation Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapIcon className="h-6 w-6 text-green-600" />
                Implementation Pathway
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-green-800 leading-relaxed">
                  {renderContentWithConcepts(content.implementationPathway.overview)}
                </p>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Estimated Timeline: </span>
                  <span className="text-gray-700">{content.implementationPathway.timeline}</span>
                </div>
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h3>
              
              <div className="space-y-6">
                {content.implementationPathway.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connection Line */}
                    {index < content.implementationPathway.steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        completedSteps.has(step.id) ? 'bg-green-600' : 'bg-blue-600'
                      }`}>
                        {completedSteps.has(step.id) ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-gray-700 mb-3">{step.description}</p>
                            
                            {/* Philosophy Connection */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                              <div className="flex items-start gap-2">
                                <LightBulbIcon className="h-4 w-4 text-purple-600 mt-0.5" />
                                <div>
                                  <span className="text-purple-900 font-medium text-sm">Philosophy Connection: </span>
                                  <span className="text-purple-800 text-sm">{step.philosophyConnection}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(step.difficulty)}`}>
                              {step.difficulty}
                            </span>
                            <span className="text-sm text-gray-600">{step.timeEstimate}</span>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {step.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Prerequisites:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {step.prerequisites.map((prereq, i) => (
                                <li key={i}>{prereq}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Resources */}
                        {step.resources.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Resources Needed:</h5>
                            <div className="flex flex-wrap gap-2">
                              {step.resources.map((resource, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Success Metrics */}
                        {step.successMetrics.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Success Metrics:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {step.successMetrics.map((metric, i) => (
                                <li key={i}>{metric}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              toggleStepCompletion(step.id);
                              onImplementationStart?.(step.id);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              completedSteps.has(step.id)
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {completedSteps.has(step.id) ? (
                              <>
                                <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                                Completed
                              </>
                            ) : (
                              <>
                                <PlayIcon className="h-4 w-4 inline mr-2" />
                                Start Step
                              </>
                            )}
                          </button>
                          
                          {index < content.implementationPathway.steps.length - 1 && (
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                              <ArrowRightIcon className="h-4 w-4 inline mr-2" />
                              Next Step
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            {content.implementationPathway.successStories.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <StarIcon className="h-5 w-5 text-yellow-600" />
                  Success Stories
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.implementationPathway.successStories.map((story, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <StarIcon className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-yellow-800 text-sm leading-relaxed">{story}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Implementation Progress</span>
                  <span className="text-sm text-gray-500">
                    {completedSteps.size} of {content.implementationPathway.steps.length} steps completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(completedSteps.size / content.implementationPathway.steps.length) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {completedSteps.size === content.implementationPathway.steps.length && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Implementation Complete!</h4>
                      <p className="text-green-800 text-sm">
                        Congratulations on completing the implementation pathway. 
                        You've successfully integrated {content.philosophyContext.domain} principles into practice.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {content.tags.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {content.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}