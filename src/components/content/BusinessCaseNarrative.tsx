/**
 * Business Case Narrative Component
 * 
 * Presents compelling business cases with narrative structure and evidence
 */

'use client';

import { useState } from 'react';
import { 
  ChartBarIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface BusinessMetric {
  label: string;
  value: string;
  change?: string;
  trend: 'up' | 'down' | 'stable';
  context: string;
}

interface BusinessCaseNarrativeProps {
  title: string;
  philosophyDomain: string;
  narrative: {
    situation: string;
    complication: string;
    question: string;
    answer: string;
  };
  businessImpact: {
    problemCost: string;
    solutionValue: string;
    timeToValue: string;
    riskMitigation: string[];
  };
  metrics: BusinessMetric[];
  stakeholderBenefits: Array<{
    stakeholder: string;
    benefits: string[];
    concerns: string[];
    winCondition: string;
  }>;
  implementationROI: {
    investment: string;
    returns: string[];
    paybackPeriod: string;
    riskFactors: string[];
  };
  competitiveAdvantage: {
    currentState: string;
    futureState: string;
    differentiators: string[];
  };
  onEngagement?: (section: string, action: string) => void;
  className?: string;
}

export default function BusinessCaseNarrative({
  title,
  philosophyDomain,
  narrative,
  businessImpact,
  metrics,
  stakeholderBenefits,
  implementationROI,
  competitiveAdvantage,
  onEngagement,
  className = ''
}: BusinessCaseNarrativeProps) {
  const [activeSection, setActiveSection] = useState<string>('narrative');
  const [expandedStakeholder, setExpandedStakeholder] = useState<string | null>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    onEngagement?.(section, 'view');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUpIcon className="h-4 w-4 text-red-600 transform rotate-180" />;
      case 'stable':
        return <div className="w-4 h-0.5 bg-gray-400" />;
    }
  };

  const sections = [
    { id: 'narrative', title: 'The Story', icon: LightBulbIcon },
    { id: 'impact', title: 'Business Impact', icon: ChartBarIcon },
    { id: 'stakeholders', title: 'Stakeholder Benefits', icon: UserGroupIcon },
    { id: 'roi', title: 'Return on Investment', icon: CurrencyDollarIcon },
    { id: 'advantage', title: 'Competitive Edge', icon: TrendingUpIcon }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">Business Case for {philosophyDomain}</p>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.slice(0, 4).map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              {metric.change && (
                <div className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6">
        {/* Narrative Section */}
        {activeSection === 'narrative' && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                The Business Story
              </h2>

              {/* SCQA Framework */}
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Situation</h3>
                  <p className="text-blue-800 leading-relaxed">{narrative.situation}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">Complication</h3>
                  <p className="text-yellow-800 leading-relaxed">{narrative.complication}</p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-400 p-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Question</h3>
                  <p className="text-purple-800 leading-relaxed">{narrative.question}</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Answer</h3>
                  <p className="text-green-800 leading-relaxed">{narrative.answer}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Impact Section */}
        {activeSection === 'impact' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Business Impact Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Cost */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-red-900">Cost of Inaction</h3>
                </div>
                <p className="text-red-800 leading-relaxed">{businessImpact.problemCost}</p>
              </div>

              {/* Solution Value */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Value of Solution</h3>
                </div>
                <p className="text-green-800 leading-relaxed">{businessImpact.solutionValue}</p>
              </div>

              {/* Time to Value */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Time to Value</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">{businessImpact.timeToValue}</p>
              </div>

              {/* Risk Mitigation */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Risk Mitigation</h3>
                </div>
                <ul className="space-y-2">
                  {businessImpact.riskMitigation.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-purple-800">
                      <CheckCircleIcon className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{metric.label}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    {metric.change && (
                      <div className={`text-sm mb-2 ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </div>
                    )}
                    <p className="text-xs text-gray-600">{metric.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stakeholder Benefits Section */}
        {activeSection === 'stakeholders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Stakeholder Benefits Analysis
            </h2>

            <div className="space-y-4">
              {stakeholderBenefits.map((stakeholder, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedStakeholder(
                      expandedStakeholder === stakeholder.stakeholder ? null : stakeholder.stakeholder
                    )}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{stakeholder.stakeholder}</h3>
                      </div>
                      <ArrowRightIcon 
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          expandedStakeholder === stakeholder.stakeholder ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {expandedStakeholder === stakeholder.stakeholder && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-green-900 mb-2">Benefits</h4>
                          <ul className="space-y-1">
                            {stakeholder.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                                <CheckCircleIcon className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-yellow-900 mb-2">Concerns</h4>
                          <ul className="space-y-1">
                            {stakeholder.concerns.map((concern, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                                <ExclamationTriangleIcon className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Win Condition</h4>
                          <p className="text-sm text-blue-800">{stakeholder.winCondition}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROI Section */}
        {activeSection === 'roi' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Return on Investment Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Investment Required</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">{implementationROI.investment}</p>
              </div>

              {/* Payback Period */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Payback Period</h3>
                </div>
                <p className="text-green-800 leading-relaxed">{implementationROI.paybackPeriod}</p>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4">Expected Returns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {implementationROI.returns.map((returnItem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <TrendingUpIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{returnItem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-4">Risk Factors</h3>
              <div className="space-y-2">
                {implementationROI.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Competitive Advantage Section */}
        {activeSection === 'advantage' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Competitive Advantage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current State */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Current State</h3>
                <p className="text-gray-700 leading-relaxed">{competitiveAdvantage.currentState}</p>
              </div>

              {/* Future State */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Future State</h3>
                <p className="text-blue-800 leading-relaxed">{competitiveAdvantage.futureState}</p>
              </div>
            </div>

            {/* Differentiators */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4">Key Differentiators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitiveAdvantage.differentiators.map((differentiator, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{differentiator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Ready to move forward?</h3>
            <p className="text-gray-600 text-sm">
              The business case is clear. Let's explore implementation options.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onEngagement?.('business-case', 'implementation-request')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Implementation Plan
            </button>
            <button 
              onClick={() => onEngagement?.('business-case', 'discussion-request')}
              className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Discuss with Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}