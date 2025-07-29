"use client"

import { useState } from 'react'
import { useFraming } from './FramingContext'

interface ConceptTooltipProps {
  concept: string
  children: React.ReactNode
  className?: string
}

export default function ConceptTooltip({ concept, children, className = '' }: ConceptTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { getConceptInfo, relatedConcepts } = useFraming()
  
  const conceptInfo = getConceptInfo(concept)
  const related = relatedConcepts(concept)

  if (!conceptInfo) {
    return <span className={className}>{children}</span>
  }

  return (
    <div className="relative inline-block">
      <span
        className={`cursor-help border-b border-dotted border-blue-500 text-blue-700 hover:text-blue-900 ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          
          <div className="mb-3">
            <h4 className="font-semibold text-gray-900 capitalize mb-1">
              {conceptInfo.name.replace(/-/g, ' ')}
            </h4>
            <div className="text-sm text-gray-600 mb-2">
              Found in {conceptInfo.frequency} documents across {conceptInfo.categories.length} categories
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {conceptInfo.categories.map(category => (
                <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {related.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Related Concepts
              </div>
              <div className="space-y-1">
                {related.slice(0, 3).map(rel => (
                  <div key={rel.name} className="text-sm text-gray-700 capitalize">
                    {rel.name.replace(/-/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <a 
              href="/understanding" 
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore full philosophical framework →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}