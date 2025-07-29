"use client"

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface WikiBreadcrumbsProps {
  section: string
  page: string
  onNavigate: (section: string, page?: string) => void
}

export default function WikiBreadcrumbs({ section, page, onNavigate }: WikiBreadcrumbsProps) {
  // Section mapping for display names
  const sectionNames: Record<string, string> = {
    'overview': 'Getting Started',
    'indigenous-knowledge': 'Indigenous Knowledge Systems',
    'mentoring': 'Mentoring & Education',
    'hoodie-economics': 'Hoodie Economics',
    'systems-change': 'Systems Change',
    'tools-frameworks': 'Tools & Frameworks',
    'business-cases': 'Business Cases',
    'media-content': 'Media & Content',
    'research': 'Research & Insights'
  }

  // Page mapping for display names
  const pageNames: Record<string, Record<string, string>> = {
    'overview': {
      'introduction': 'Introduction',
      'philosophy': 'Our Philosophy',
      'how-to-use': 'How to Use This Wiki',
      'quick-start': 'Quick Start Guide'
    },
    'indigenous-knowledge': {
      'overview': 'Overview',
      'systems-thinking': 'Indigenous Systems Thinking',
      'protocols': 'Cultural Protocols',
      'seven-generation': 'Seven Generation Thinking',
      'connection-to-country': 'Connection to Country',
      'storytelling': 'Indigenous Storytelling'
    },
    'mentoring': {
      'overview': 'Mentoring Overview',
      'methodology': 'AIME Methodology',
      'reverse-mentoring': 'Reverse Mentoring',
      'imagination-curriculum': 'Imagination Curriculum',
      'university-partnerships': 'University Partnerships',
      'impact-measurement': 'Impact Measurement'
    },
    'hoodie-economics': {
      'overview': 'What is Hoodie Economics?',
      'imagination-credits': 'Imagination Credits',
      'trading-system': 'Hoodie Trading System',
      'value-creation': 'Value Creation Models',
      'digital-economy': 'Digital Economy Integration',
      'case-studies': 'Implementation Case Studies'
    },
    'systems-change': {
      'overview': 'Systems Change Overview',
      'joy-corps': 'Joy Corps Transformation',
      'organizational-change': 'Organizational Change',
      'leadership-models': 'Indigenous Leadership Models',
      'network-effects': 'Network Effects & Scaling',
      'measurement-frameworks': 'Change Measurement'
    },
    'tools-frameworks': {
      'overview': 'All Tools',
      'assessment-tools': 'Assessment Tools',
      'planning-frameworks': 'Planning Frameworks',
      'facilitation-guides': 'Facilitation Guides',
      'evaluation-methods': 'Evaluation Methods',
      'digital-tools': 'Digital Tools'
    },
    'business-cases': {
      'overview': 'All Business Cases',
      'education-sector': 'Education Sector',
      'corporate-partnerships': 'Corporate Partnerships',
      'government-initiatives': 'Government Initiatives',
      'community-programs': 'Community Programs',
      'international-expansion': 'International Expansion'
    },
    'media-content': {
      'overview': 'All Media',
      'video-library': 'Video Library',
      'newsletters': 'Newsletter Archive',
      'podcasts': 'Podcasts & Audio',
      'presentations': 'Presentations',
      'publications': 'Publications & Reports'
    },
    'research': {
      'overview': 'Research Overview',
      'impact-studies': 'Impact Studies',
      'methodology-research': 'Methodology Research',
      'longitudinal-studies': 'Longitudinal Studies',
      'comparative-analysis': 'Comparative Analysis',
      'future-research': 'Future Research Directions'
    }
  }

  const sectionDisplayName = sectionNames[section] || section
  const pageDisplayName = pageNames[section]?.[page] || page

  return (
    <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
      <nav className="flex items-center space-x-2 text-sm">
        {/* Home */}
        <button
          onClick={() => onNavigate('overview', 'introduction')}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <HomeIcon className="w-4 h-4" />
        </button>

        <ChevronRightIcon className="w-4 h-4 text-gray-400" />

        {/* Section */}
        <button
          onClick={() => onNavigate(section, 'overview')}
          className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          {sectionDisplayName}
        </button>

        {/* Page (if not overview) */}
        {page !== 'overview' && (
          <>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">
              {pageDisplayName}
            </span>
          </>
        )}
      </nav>
    </div>
  )
}