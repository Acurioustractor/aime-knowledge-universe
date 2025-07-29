/**
 * Philosophy-First Content Template
 * 
 * Template that presents content with philosophy context first, then practical application
 */

'use client';

import { useState } from 'react';
import { 
  LightBulbIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { PhilosophyPrimer } from '@/components/philosophy/PhilosophyPrimer';
import { ContextualTooltip } from '@/components/philosophy/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/philosophy/ProgressiveDisclosure';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
  type: 'philosophy' | 'business-case' | 'implementation' | 'evidence' | 'story';
  priority: number;
}

interface PhilosophyFirstTemplateProps {
  title: string;
  philosophyDomain: string;
  philosophyPrimer: {
    title: string;
    briefExplanation: string;
    detailedExplanation: string;
    keyPrinciples: string[];
    businessCase: string;
    implementationOverview: string;
    commonMisconceptions?: string[];
    successIndicators?: string[];
  };
  businessCaseNarrative: {
    problem: string;
    solution: string;
    benefits: string[];
    evidence: string[];
    roi?: string;
  };
  implementationPathway: {
    steps: Array<{
      title: string;
      description: string;
      timeframe: string;
      resources: string[];
      outcomes: string[];
    }>;
    prerequisites: string[];
    successMetrics: string[];
  };
  stories: Array<{
    title: string;
    context: string;
    challenge: string;
    application: string;
    outcome: string;
    lessons: string[];
  }>;
  evidence: Array<{
    type: 'research' | 'case-study' | 'testimonial' | 'data';
    title: string;
    summary: string;
    source: string;
    credibility: number;
  }>;
  onEngagement?: (section: string, action: string) => void;
  className?: string;
}

export default function PhilosophyFirstTemplate({
  title,
  philosophyDomain,
  philosophyPrimer,
  businessCaseNarrative,
  implementationPathway,
  stories,
  evidence,
  onEngagement,
  className = ''
}: PhilosophyFirstTemplateProps) {
  const [activeSection, setActiveSection] = useState<string>('philosophy');
  const [userProgress, setUserProgress] = useState<Set<string>>(new Set());

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    onEngagement?.(sectionId, 'view');
  };

  const markSectionComplete = (sectionId: string) => {
    const newProgress = new Set(userProgress);
    newProgress.add(sectionId);
    setUserProgress(newProgress);
    onEngagement?.(sectionId, 'complete');
  };

  const sections = [
    {
      id: 'philosophy',
      title: 'Philosophy Foundation',
      icon: LightBulbIcon,
      description: 'Understanding the why behind this approach',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'business-case',
      title: 'Business Case',
      icon: ChartBarIcon,
      description: 'Why this approach works in practice',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: WrenchScrewdriverIcon,
      description: 'How to apply these concepts',
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'evidence',
      title: 'Evidence & Research',
      icon: BookOpenIcon,
      description: 'Supporting data and research',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'stories',
      title: 'Success Stories',
      icon: UserGroupIcon,
      description: 'Real-world applications and outcomes',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const getProgressPercentage = () => {
    return (userProgress.size / sections.length) * 100;
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LightBulbIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">
                Philosophy Domain: 
                <ContextualTooltip
                  concept={philosophyDomain}
                  explanation={philosophyPrimer.briefExplanation}
                  philosophyDomain={philosophyDomain}
                >
                  <span className="ml-1 text-blue-600 font-medium cursor-help">
                    {philosophyDomain}
                  </span>
                </ContextualTooltip>
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Learning Progress</span>
              <span>{userProgress.size} of {sections.length} sections completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isCompleted = userProgress.has(section.id);

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isActive
                      ? `${section.color} border-current`
                      : isCompleted
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Philosophy Section */}
        {activeSection === 'philosophy' && (
          <div className="space-y-6">
            <PhilosophyPrimer
              domain={philosophyDomain}
              title={philosophyPrimer.title}
              briefExplanation={philosophyPrimer.briefExplanation}
              detailedExplanation={philosophyPrimer.detailedExplanation}
              keyPrinciples={philosophyPrimer.keyPrinciples}
              businessCase={philosophyPrimer.businessCase}
              implementationOverview={philosophyPrimer.implementationOverview}
              commonMisconceptions={philosophyPrimer.commonMisconceptions}
              successIndicators={philosophyPrimer.successIndicators}
              onEngagement={(type) => onEngagement?.('philosophy', type)}
            />

            <div className="flex justify-end">
              <button
                onClick={() => markSectionComplete('philosophy')}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                I understand the philosophy
              </button>
            </div>
          </div>
        )}

        {/* Business Case Section */}
        {activeSection === 'business-case' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Why This Approach Works
              </h2>
              
              {/* Problem Statement */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">The Challenge</h3>
                <p className="text-gray-700 leading-relaxed">
                  {businessCaseNarrative.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Our Solution</h3>
                <p className="text-gray-700 leading-relaxed">
                  {businessCaseNarrative.solution}
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessCaseNarrative.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI */}
              {businessCaseNarrative.roi && (
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Return on Investment</h3>
                  <p className="text-gray-700">{businessCaseNarrative.roi}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => markSectionComplete('business-case')}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                I see the business value
              </button>
            </div>
          </div>
        )}

        {/* Implementation Section */}
        {activeSection === 'implementation' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Implementation Pathway
              </h2>

              {/* Prerequisites */}
              {implementationPathway.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {implementationPathway.prerequisites.map((prereq, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Implementation Steps */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Step-by-Step Guide</h3>
                <div className="space-y-4">
                  {implementationPathway.steps.map((step, index) => (
                    <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-gray-700 mb-3">{step.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900">Timeframe:</span>
                              <p className="text-gray-600">{step.timeframe}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Resources:</span>
                              <ul className="text-gray-600 mt-1">
                                {step.resources.map((resource, i) => (
                                  <li key={i}>• {resource}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Outcomes:</span>
                              <ul className="text-gray-600 mt-1">
                                {step.outcomes.map((outcome, i) => (
                                  <li key={i}>• {outcome}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Success Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {implementationPathway.successMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ChartBarIcon className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => markSectionComplete('implementation')}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Ready to implement
              </button>
            </div>
          </div>
        )}

        {/* Evidence Section */}
        {activeSection === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Supporting Evidence
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evidence.map((item, index) => (
                  <div key={index} className="bg-white border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'research' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'case-study' ? 'bg-green-100 text-green-800' :
                        item.type === 'testimonial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{item.summary}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Source: {item.source}</span>
                      <div className="flex items-center gap-1">
                        <span>Credibility:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < item.credibility ? 'bg-purple-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => markSectionComplete('evidence')}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Evidence reviewed
              </button>
            </div>
          </div>
        )}

        {/* Stories Section */}
        {activeSection === 'stories' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Success Stories
              </h2>

              <div className="space-y-6">
                {stories.map((story, index) => (
                  <div key={index} className="bg-white border border-orange-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{story.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Context</h4>
                          <p className="text-gray-700 text-sm">{story.context}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Challenge</h4>
                          <p className="text-gray-700 text-sm">{story.challenge}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Application</h4>
                          <p className="text-gray-700 text-sm">{story.application}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Outcome</h4>
                          <p className="text-gray-700 text-sm">{story.outcome}</p>
                        </div>
                      </div>
                    </div>

                    {story.lessons.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">Key Lessons</h4>
                        <ul className="space-y-1">
                          {story.lessons.map((lesson, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <LightBulbIcon className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => markSectionComplete('stories')}
                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Stories inspire me
              </button>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {userProgress.size === sections.length && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Congratulations! You've completed all sections.
                </h3>
                <p className="text-green-700">
                  You now have a comprehensive understanding of {philosophyDomain}. 
                  Ready to put it into practice?
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                <PlayIcon className="h-4 w-4" />
                Start Implementation
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                <UserGroupIcon className="h-4 w-4" />
                Connect with Community
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                <ArrowRightIcon className="h-4 w-4" />
                Explore Related Content
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}