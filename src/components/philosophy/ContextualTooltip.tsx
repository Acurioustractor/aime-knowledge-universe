/**
 * Contextual Explanation Tooltip Component
 * 
 * Provides contextual philosophy explanations and concept definitions
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  InformationCircleIcon, 
  LightBulbIcon, 
  BookOpenIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface ContextualTooltipProps {
  concept: string;
  explanation: string;
  philosophyDomain?: string;
  relatedConcepts?: string[];
  examples?: string[];
  trigger?: 'hover' | 'click';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  children: React.ReactNode;
  onEngagement?: (concept: string, action: 'view' | 'expand' | 'related_click') => void;
  className?: string;
}

export default function ContextualTooltip({
  concept,
  explanation,
  philosophyDomain,
  relatedConcepts = [],
  examples = [],
  trigger = 'hover',
  position = 'auto',
  children,
  onEngagement,
  className = ''
}: ContextualTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && position === 'auto' && triggerRef.current && tooltipRef.current) {
      calculateOptimalPosition();
    }
  }, [isVisible, position]);

  const calculateOptimalPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let optimalPosition = 'top';

    // Check if there's space above
    if (triggerRect.top - tooltipRect.height < 20) {
      optimalPosition = 'bottom';
    }

    // Check if there's space below
    if (triggerRect.bottom + tooltipRect.height > viewportHeight - 20) {
      optimalPosition = 'top';
    }

    // Check horizontal space for side positions
    if (triggerRect.left - tooltipRect.width > 20) {
      optimalPosition = 'left';
    } else if (triggerRect.right + tooltipRect.width < viewportWidth - 20) {
      optimalPosition = 'right';
    }

    setCalculatedPosition(optimalPosition as typeof position);
  };

  const handleShow = () => {
    setIsVisible(true);
    onEngagement?.(concept, 'view');
  };

  const handleHide = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
      setIsExpanded(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      if (!isVisible) {
        onEngagement?.(concept, 'view');
      }
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onEngagement?.(concept, 'expand');
  };

  const handleRelatedClick = (relatedConcept: string) => {
    onEngagement?.(relatedConcept, 'related_click');
  };

  const getTooltipClasses = () => {
    const baseClasses = 'absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm';
    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      auto: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    };

    return `${baseClasses} ${positionClasses[calculatedPosition]}`;
  };

  const getArrowClasses = () => {
    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-white',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-white',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-white',
      auto: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-white'
    };

    return `absolute w-0 h-0 border-8 ${arrowClasses[calculatedPosition]}`;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Element */}
      <div
        ref={triggerRef}
        className="inline-block cursor-help"
        onMouseEnter={trigger === 'hover' ? handleShow : undefined}
        onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        onClick={trigger === 'click' ? handleClick : undefined}
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          onMouseEnter={trigger === 'hover' ? () => setIsVisible(true) : undefined}
          onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        >
          {/* Arrow */}
          <div className={getArrowClasses()} />

          {/* Content */}
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <LightBulbIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <h4 className="font-semibold text-gray-900 text-sm">{concept}</h4>
              </div>
              {trigger === 'click' && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Philosophy Domain Badge */}
            {philosophyDomain && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {philosophyDomain}
                </span>
              </div>
            )}

            {/* Explanation */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {explanation}
            </p>

            {/* Examples */}
            {examples.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-gray-900 text-xs mb-2">Examples:</h5>
                <ul className="space-y-1">
                  {examples.slice(0, isExpanded ? examples.length : 2).map((example, index) => (
                    <li key={index} className="text-gray-600 text-xs flex items-start gap-2">
                      <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
                {examples.length > 2 && !isExpanded && (
                  <button
                    onClick={handleExpand}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                  >
                    Show {examples.length - 2} more examples
                  </button>
                )}
              </div>
            )}

            {/* Related Concepts */}
            {relatedConcepts.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-gray-900 text-xs mb-2">Related:</h5>
                <div className="flex flex-wrap gap-1">
                  {relatedConcepts.slice(0, isExpanded ? relatedConcepts.length : 3).map((related, index) => (
                    <button
                      key={index}
                      onClick={() => handleRelatedClick(related)}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {related}
                    </button>
                  ))}
                </div>
                {relatedConcepts.length > 3 && !isExpanded && (
                  <button
                    onClick={handleExpand}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                  >
                    +{relatedConcepts.length - 3} more
                  </button>
                )}
              </div>
            )}

            {/* Expand/Collapse Button */}
            {(examples.length > 2 || relatedConcepts.length > 3) && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleExpand}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  <BookOpenIcon className="h-3 w-3" />
                  {isExpanded ? 'Show less' : 'Learn more'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline Concept Highlighter
 * Automatically wraps concepts in text with contextual tooltips
 */
export function ConceptHighlighter({
  text,
  concepts,
  philosophyDomain,
  onEngagement,
  className = ''
}: {
  text: string;
  concepts: Record<string, {
    explanation: string;
    examples?: string[];
    relatedConcepts?: string[];
  }>;
  philosophyDomain?: string;
  onEngagement?: (concept: string, action: string) => void;
  className?: string;
}) {
  const highlightConcepts = (text: string) => {
    let highlightedText = text;
    const conceptKeys = Object.keys(concepts).sort((a, b) => b.length - a.length); // Sort by length to avoid partial matches

    conceptKeys.forEach(concept => {
      const regex = new RegExp(`\\b(${concept})\\b`, 'gi');
      const conceptData = concepts[concept];
      
      highlightedText = highlightedText.replace(regex, (match) => {
        return `<concept-tooltip data-concept="${concept}" data-explanation="${conceptData.explanation}" data-examples="${JSON.stringify(conceptData.examples || [])}" data-related="${JSON.stringify(conceptData.relatedConcepts || [])}">${match}</concept-tooltip>`;
      });
    });

    return highlightedText;
  };

  const renderHighlightedText = () => {
    const highlighted = highlightConcepts(text);
    const parts = highlighted.split(/(<concept-tooltip[^>]*>.*?<\/concept-tooltip>)/);

    return parts.map((part, index) => {
      if (part.startsWith('<concept-tooltip')) {
        const conceptMatch = part.match(/data-concept="([^"]*)"/);
        const explanationMatch = part.match(/data-explanation="([^"]*)"/);
        const examplesMatch = part.match(/data-examples="([^"]*)"/);
        const relatedMatch = part.match(/data-related="([^"]*)"/);
        const textMatch = part.match(/>([^<]*)</);

        if (conceptMatch && explanationMatch && textMatch) {
          const concept = conceptMatch[1];
          const explanation = explanationMatch[1];
          const examples = examplesMatch ? JSON.parse(examplesMatch[1]) : [];
          const relatedConcepts = relatedMatch ? JSON.parse(relatedMatch[1]) : [];
          const displayText = textMatch[1];

          return (
            <ContextualTooltip
              key={index}
              concept={concept}
              explanation={explanation}
              philosophyDomain={philosophyDomain}
              examples={examples}
              relatedConcepts={relatedConcepts}
              onEngagement={onEngagement}
            >
              <span className="underline decoration-dotted decoration-blue-500 text-blue-700 cursor-help">
                {displayText}
              </span>
            </ContextualTooltip>
          );
        }
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={className}>
      {renderHighlightedText()}
    </div>
  );
}

/**
 * Philosophy Concept Badge
 * Quick reference badge with tooltip
 */
export function ConceptBadge({
  concept,
  explanation,
  philosophyDomain,
  variant = 'default',
  size = 'sm',
  onEngagement,
  className = ''
}: {
  concept: string;
  explanation: string;
  philosophyDomain?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md';
  onEngagement?: (concept: string, action: string) => void;
  className?: string;
}) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm'
  };

  return (
    <ContextualTooltip
      concept={concept}
      explanation={explanation}
      philosophyDomain={philosophyDomain}
      onEngagement={onEngagement}
      trigger="hover"
    >
      <span className={`inline-flex items-center gap-1 rounded-full font-medium border cursor-help transition-colors hover:opacity-80 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
        <InformationCircleIcon className="h-3 w-3" />
        {concept}
      </span>
    </ContextualTooltip>
  );
}