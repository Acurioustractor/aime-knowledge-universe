"use client"

import { useState, useEffect } from 'react'
import { ArrowRightIcon, BookOpenIcon, VideoCameraIcon, WrenchIcon } from '@heroicons/react/24/outline'

interface WikiContentRendererProps {
  section: string
  page: string
  onNavigate: (section: string, page?: string) => void
}

interface ContentItem {
  id: string
  title: string
  description: string
  type: string
  url?: string
  metadata?: any
}

export default function WikiContentRenderer({ section, page, onNavigate }: WikiContentRendererProps) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pageContent, setPageContent] = useState<any>(null)

  // Fetch content for the current section/page
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        // Map section/page to search queries
        const searchQuery = getSearchQueryForPage(section, page)
        const contentTypes = getContentTypesForPage(section, page)
        
        if (searchQuery) {
          const typesParam = contentTypes.join(',')
          const response = await fetch(
            `/api/unified-search?q=${encodeURIComponent(searchQuery)}&types=${typesParam}&limit=20`
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setContent(data.data.results || [])
            }
          }
        }
        
        // Set page-specific content
        setPageContent(getPageContent(section, page))
        
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [section, page])

  // Map section/page combinations to search queries
  const getSearchQueryForPage = (section: string, page: string): string => {
    const queryMap: Record<string, Record<string, string>> = {
      'indigenous-knowledge': {
        'overview': 'indigenous',
        'systems-thinking': 'indigenous systems thinking',
        'protocols': 'cultural protocols indigenous',
        'seven-generation': 'seven generation thinking',
        'connection-to-country': 'connection to country',
        'storytelling': 'indigenous storytelling'
      },
      'mentoring': {
        'overview': 'mentoring',
        'methodology': 'AIME methodology mentoring',
        'reverse-mentoring': 'reverse mentoring',
        'imagination-curriculum': 'imagination curriculum',
        'university-partnerships': 'university partnerships',
        'impact-measurement': 'impact measurement mentoring'
      },
      'hoodie-economics': {
        'overview': 'hoodie economics',
        'imagination-credits': 'imagination credits',
        'trading-system': 'hoodie trading',
        'value-creation': 'value creation hoodie',
        'digital-economy': 'digital economy hoodie',
        'case-studies': 'hoodie case studies'
      },
      'systems-change': {
        'overview': 'systems change',
        'joy-corps': 'joy corps transformation',
        'organizational-change': 'organizational change',
        'leadership-models': 'indigenous leadership',
        'network-effects': 'network effects scaling',
        'measurement-frameworks': 'change measurement'
      },
      'tools-frameworks': {
        'overview': 'tools frameworks',
        'assessment-tools': 'assessment tools',
        'planning-frameworks': 'planning frameworks',
        'facilitation-guides': 'facilitation guides',
        'evaluation-methods': 'evaluation methods',
        'digital-tools': 'digital tools'
      },
      'business-cases': {
        'overview': 'business case',
        'education-sector': 'education sector business case',
        'corporate-partnerships': 'corporate partnerships',
        'government-initiatives': 'government initiatives',
        'community-programs': 'community programs',
        'international-expansion': 'international expansion'
      },
      'media-content': {
        'overview': 'video content media',
        'video-library': 'video',
        'newsletters': 'newsletter',
        'podcasts': 'podcast audio',
        'presentations': 'presentation',
        'publications': 'publication report'
      },
      'research': {
        'overview': 'research',
        'impact-studies': 'impact studies research',
        'methodology-research': 'methodology research',
        'longitudinal-studies': 'longitudinal studies',
        'comparative-analysis': 'comparative analysis',
        'future-research': 'future research'
      }
    }

    return queryMap[section]?.[page] || section
  }

  // Map section/page to relevant content types
  const getContentTypesForPage = (section: string, page: string): string[] => {
    const typeMap: Record<string, Record<string, string[]>> = {
      'indigenous-knowledge': {
        'overview': ['knowledge', 'business_case'],
        'systems-thinking': ['knowledge', 'tool'],
        'protocols': ['knowledge'],
        'seven-generation': ['knowledge', 'business_case'],
        'connection-to-country': ['knowledge', 'video'],
        'storytelling': ['knowledge', 'video', 'tool']
      },
      'mentoring': {
        'overview': ['knowledge', 'business_case'],
        'methodology': ['knowledge', 'tool'],
        'reverse-mentoring': ['knowledge', 'business_case'],
        'imagination-curriculum': ['knowledge', 'tool'],
        'university-partnerships': ['business_case'],
        'impact-measurement': ['knowledge', 'tool']
      },
      'hoodie-economics': {
        'overview': ['knowledge', 'business_case'],
        'imagination-credits': ['hoodie', 'tool'],
        'trading-system': ['hoodie', 'tool'],
        'value-creation': ['business_case', 'knowledge'],
        'digital-economy': ['tool', 'business_case'],
        'case-studies': ['business_case']
      },
      'tools-frameworks': {
        'overview': ['tool'],
        'assessment-tools': ['tool'],
        'planning-frameworks': ['tool'],
        'facilitation-guides': ['tool'],
        'evaluation-methods': ['tool'],
        'digital-tools': ['tool']
      },
      'business-cases': {
        'overview': ['business_case'],
        'education-sector': ['business_case'],
        'corporate-partnerships': ['business_case'],
        'government-initiatives': ['business_case'],
        'community-programs': ['business_case'],
        'international-expansion': ['business_case']
      },
      'media-content': {
        'overview': ['video', 'content'],
        'video-library': ['video'],
        'newsletters': ['content'],
        'podcasts': ['content'],
        'presentations': ['tool'],
        'publications': ['knowledge']
      }
    }

    return typeMap[section]?.[page] || ['all']
  }

  // Get static page content
  const getPageContent = (section: string, page: string) => {
    // This would normally come from a CMS or markdown files
    // For now, we'll return structured content based on section/page
    
    if (section === 'overview' && page === 'introduction') {
      return {
        title: 'Welcome to AIME Knowledge Universe',
        subtitle: 'Your comprehensive guide to Indigenous wisdom and systems transformation',
        content: `
          <div class="prose prose-lg max-w-none">
            <p class="text-xl text-gray-600 mb-6">
              The AIME Knowledge Universe is a comprehensive repository of Indigenous wisdom, 
              practical tools, and transformative approaches to creating systemic change.
            </p>
            
            <h2>What You'll Find Here</h2>
            <p>
              This wiki contains over 2,700 resources spanning 20 years of AIME's work in 
              Indigenous education, mentoring, and systems transformation. Every piece of 
              knowledge has been carefully curated and organized to support your journey 
              of understanding and implementation.
            </p>
            
            <h2>Our Approach</h2>
            <p>
              We believe in the power of Indigenous knowledge systems to transform how we 
              think about education, economics, and social change. This wiki is organized 
              around key concepts that bridge traditional wisdom with contemporary challenges.
            </p>
            
            <h2>How to Navigate</h2>
            <ul>
              <li><strong>Browse by Section:</strong> Use the sidebar to explore different knowledge areas</li>
              <li><strong>Search Everything:</strong> Use the search bar to find specific topics across all content</li>
              <li><strong>Follow Connections:</strong> Look for related content and cross-references</li>
              <li><strong>Apply Learning:</strong> Each section includes practical tools and implementation guides</li>
            </ul>
          </div>
        `,
        quickLinks: [
          { title: 'Indigenous Knowledge Systems', section: 'indigenous-knowledge', page: 'overview' },
          { title: 'Mentoring Methodology', section: 'mentoring', page: 'methodology' },
          { title: 'Hoodie Economics', section: 'hoodie-economics', page: 'overview' },
          { title: 'Systems Change', section: 'systems-change', page: 'overview' }
        ]
      }
    }

    // Return default content structure
    return {
      title: getPageTitle(section, page),
      subtitle: getPageSubtitle(section, page),
      content: getPageDescription(section, page)
    }
  }

  const getPageTitle = (section: string, page: string): string => {
    const titles: Record<string, Record<string, string>> = {
      'indigenous-knowledge': {
        'overview': 'Indigenous Knowledge Systems',
        'systems-thinking': 'Indigenous Systems Thinking',
        'protocols': 'Cultural Protocols & Respect',
        'seven-generation': 'Seven Generation Thinking',
        'connection-to-country': 'Connection to Country',
        'storytelling': 'Indigenous Storytelling Traditions'
      },
      'mentoring': {
        'overview': 'AIME Mentoring Approach',
        'methodology': 'AIME Methodology Framework',
        'reverse-mentoring': 'Reverse Mentoring Models',
        'imagination-curriculum': 'Imagination Curriculum',
        'university-partnerships': 'University Partnership Models',
        'impact-measurement': 'Measuring Mentoring Impact'
      }
      // Add more as needed
    }

    return titles[section]?.[page] || `${section} - ${page}`
  }

  const getPageSubtitle = (section: string, page: string): string => {
    return `Explore ${content.length} resources related to this topic`
  }

  const getPageDescription = (section: string, page: string): string => {
    return `<p class="text-gray-600">This section contains curated resources, tools, and insights related to ${getPageTitle(section, page).toLowerCase()}. Use the content below to deepen your understanding and find practical applications.</p>`
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      knowledge: <BookOpenIcon className="w-5 h-5" />,
      video: <VideoCameraIcon className="w-5 h-5" />,
      tool: <WrenchIcon className="w-5 h-5" />,
      business_case: <ArrowRightIcon className="w-5 h-5" />,
      hoodie: <span className="text-lg">👕</span>,
      content: <span className="text-lg">📄</span>
    }
    return icons[type as keyof typeof icons] || <BookOpenIcon className="w-5 h-5" />
  }

  const getTypeColor = (type: string) => {
    const colors = {
      knowledge: 'bg-blue-100 text-blue-800 border-blue-200',
      video: 'bg-red-100 text-red-800 border-red-200',
      tool: 'bg-purple-100 text-purple-800 border-purple-200',
      business_case: 'bg-green-100 text-green-800 border-green-200',
      hoodie: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      content: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      {pageContent && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {pageContent.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {pageContent.subtitle}
          </p>
          
          {pageContent.content && (
            <div 
              className="mb-8"
              dangerouslySetInnerHTML={{ __html: pageContent.content }}
            />
          )}

          {/* Quick Links */}
          {pageContent.quickLinks && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {pageContent.quickLinks.map((link: any, index: number) => (
                <button
                  key={index}
                  onClick={() => onNavigate(link.section, link.page)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{link.title}</h3>
                  <div className="flex items-center text-sm text-blue-600">
                    <span>Explore</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      {content.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Related Resources ({content.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg border ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                        {item.type.replace('_', ' ')}
                      </span>
                      
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {content.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Content Coming Soon
          </h3>
          <p className="text-gray-600">
            We're working on adding more resources to this section.
          </p>
        </div>
      )}
    </div>
  )
}