/**
 * Philosophy Primer Component
 * 
 * Provides contextual explanations that give users the "why" before the "how"
 */

'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, LightBulbIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PhilosophyPrimerProps {
  domain: string;
  title: string;
  briefExplanation: string;
  detailedExplanation: string;
  keyPrinciples: string[];
  businessCase: string;
  implementationOverview: string;
  commonMisconceptions?: string[];
  successIndicators?: string[];
  realWorldExamples?: string[];
  onEngagement?: (engagementType: 'view' | 'expand' | 'principle_click' | 'business_case_view') => void;
  className?: string;
}

export default function PhilosophyPrimer({
  domain,
  title,
  briefExplanation,
  detailedExplanation,
  keyPrinciples,
  businessCase,
  implementationOverview,
  commonMisconceptions = [],
  successIndicators = [],
  realWorldExamples = [],
  onEngagement,
  className = ''
}: PhilosophyPrimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'principles' | 'business-case' | 'implementation' | 'misconceptions' | 'indicators' | 'examples'>('overview');

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onEngagement?.(isExpanded ? 'view' : 'expand');
  };

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
    if (section === 'business-case') {
      onEngagement?.('business_case_view');
    }
  };

  const handlePrincipleClick = () => {
    onEngagement?.('principle_click');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header - Always Visible */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <LightBulbIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                Philosophy Foundation
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{briefExplanation}</p>
          </div>
          <button
            onClick={handleExpand}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Key Principles Preview - Always Visible */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Core Principles</h4>
          <div className="flex flex-wrap gap-2">
            {keyPrinciples.slice(0, 3).map((principle, index) => (
              <span
                key={index}
                onClick={handlePrincipleClick}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                {principle}
              </span>
            ))}
            {keyPrinciples.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                +{keyPrinciples.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
            {[
              { key: 'overview', label: 'Overview', icon: BookOpenIcon },
              { key: 'principles', label: 'Principles', icon: CheckCircleIcon },
              { key: 'business-case', label: 'Why It Works', icon: LightBulbIcon },
              { key: 'implementation', label: 'How to Apply', icon: CheckCircleIcon },
              ...(commonMisconceptions.length > 0 ? [{ key: 'misconceptions', label: 'Common Myths', icon: BookOpenIcon }] : []),
              ...(successIndicators.length > 0 ? [{ key: 'indicators', label: 'Success Signs', icon: CheckCircleIcon }] : []),
              ...(realWorldExamples.length > 0 ? [{ key: 'examples', label: 'Examples', icon: LightBulbIcon }] : [])
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSectionChange(key as typeof activeSection)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="prose prose-gray max-w-none">
            {activeSection === 'overview' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Overview</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {detailedExplanation}
                </div>
              </div>
            )}

            {activeSection === 'principles' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Core Principles</h4>
                <ul className="space-y-3">
                  {keyPrinciples.map((principle, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'business-case' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Why This Approach Works</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {businessCase}
                </div>
              </div>
            )}

            {activeSection === 'implementation' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">How to Apply This Philosophy</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {implementationOverview}
                </div>
              </div>
            )}

            {activeSection === 'misconceptions' && commonMisconceptions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Common Misconceptions</h4>
                <ul className="space-y-2">
                  {commonMisconceptions.map((misconception, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{misconception}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'indicators' && successIndicators.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Signs of Success</h4>
                <ul className="space-y-2">
                  {successIndicators.map((indicator, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'examples' && realWorldExamples.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Real-World Examples</h4>
                <ul className="space-y-2">
                  {realWorldExamples.map((example, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <LightBulbIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Ready to explore further?</h5>
              <p className="text-blue-700 text-sm mb-3">
                Discover tools, stories, and resources that demonstrate this philosophy in action.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  View Related Tools
                </button>
                <button className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-200 hover:bg-blue-50 transition-colors">
                  See Success Stories
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Philosophy Primer for sidebars and quick reference
 */
export function CompactPhilosophyPrimer({
  domain,
  title,
  briefExplanation,
  keyPrinciples,
  onExpand,
  className = ''
}: {
  domain: string;
  title: string;
  briefExplanation: string;
  keyPrinciples: string[];
  onExpand?: () => void;
  className?: string;
}) {
  return (
    <div className={`bg-blue-50 rounded-lg p-4 border border-blue-200 ${className}`}>
      <div className="flex items-start gap-3">
        <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 mb-1">{title}</h4>
          <p className="text-blue-700 text-sm mb-3">{briefExplanation}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {keyPrinciples.slice(0, 2).map((principle, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {principle}
              </span>
            ))}
          </div>
          {onExpand && (
            <button
              onClick={onExpand}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
            >
              Learn more about this philosophy →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}