"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Research Detail page
 * 
 * Dynamic page for displaying individual research items
 */
export default function ResearchDetailPage() {
  const { id } = useParams() as { id: string }
  const [research, setResearch] = useState<PurposeContentItem | null>(null)
  const [relatedResearch, setRelatedResearch] = useState<PurposeContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setIsLoading(true)
        
        // Import the integration functions
        const { getContentById, getAllContent } = await import('@/lib/integrations')
        
        // Fetch the research item
        const contentItem = await getContentById(id)
        
        if (!contentItem) {
          setError('Research item not found')
          setIsLoading(false)
          return
        }
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier())
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceWithPurpose(contentItem)
        
        // Check if content is research
        if (enhancedContent.primaryPurpose !== 'research' && 
            !enhancedContent.secondaryPurposes?.includes('research')) {
          setError('This content is not a research item')
          setIsLoading(false)
          return
        }
        
        setResearch(enhancedContent)
        
        // Fetch related research
        const allContent = await getAllContent()
        const enhancedAllContent = contentEnhancer.enhanceMultipleWithPurpose(allContent)
        
        // Filter for research items
        const researchItems = enhancedAllContent.filter(item => 
          (item.primaryPurpose === 'research' || item.secondaryPurposes?.includes('research')) &&
          item.id !== id
        )
        
        // Get themes from current research
        const themes = enhancedContent.themes?.map(theme => theme.id) || []
        
        // Get topics from current research
        const topics = enhancedContent.topics?.map(topic => topic.id) || []
        
        // Score research by relevance to current research
        const scoredResearch = researchItems.map(item => {
          let score = 0
          
          // Score by matching themes
          item.themes?.forEach(theme => {
            if (themes.includes(theme.id)) {
              score += 10
            }
          })
          
          // Score by matching topics
          item.topics?.forEach(topic => {
            if (topics.includes(topic.id)) {
              score += 5
            }
          })
          
          // Score by matching research type
          if (enhancedContent.researchDetails?.researchType === item.researchDetails?.researchType) {
            score += 8
          }
          
          // Score by matching tags
          const contentTags = enhancedContent.tags || []
          const itemTags = item.tags || []
          const matchingTags = itemTags.filter(tag => contentTags.includes(tag))
          score += matchingTags.length * 3
          
          return {
            ...item,
            relationScore: score
          }
        })
        
        // Sort by relation score (descending)
        scoredResearch.sort((a, b) => b.relationScore - a.relationScore)
        
        // Get top related research
        const related = scoredResearch.slice(0, 3)
        setRelatedResearch(related)
        
      } catch (err) {
        console.error('Error fetching research:', err)
        setError('Error loading research item')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchResearch()
  }, [id])
  
  // Get research type label
  const getResearchTypeLabel = (type?: string) => {
    switch (type) {
      case 'finding':
        return 'Research Finding'
      case 'analysis':
        return 'Data Analysis'
      case 'synthesis':
        return 'Synthesis'
      case 'data':
        return 'Data Resource'
      case 'report':
        return 'Research Report'
      default:
        return 'Research'
    }
  }
  
  // Get research type color
  const getResearchTypeColor = (type?: string) => {
    switch (type) {
      case 'finding':
        return 'bg-blue-100 text-blue-800'
      case 'analysis':
        return 'bg-green-100 text-green-800'
      case 'synthesis':
        return 'bg-purple-100 text-purple-800'
      case 'data':
        return 'bg-yellow-100 text-yellow-800'
      case 'report':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get research type icon
  const getResearchTypeIcon = (type?: string) => {
    switch (type) {
      case 'finding':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
          </svg>
        )
      case 'analysis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
          </svg>
        )
      case 'synthesis':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
            <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
          </svg>
        )
      case 'data':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
            <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
            <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
            <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
            <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
          </svg>
        )
      case 'report':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500">
            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
          </svg>
        )
    }
  }
  
  if (isLoading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-wiki">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !research) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-wiki">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{error || 'Research item not found'}</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find the research item you're looking for.
              </p>
              <Link href="/research" className="btn btn-primary">
                View All Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/research" className="hover:text-primary-600">Research & Insights</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">{research.title}</li>
            </ol>
          </nav>
          
          {/* Research Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              {research.thumbnail ? (
                <Image
                  src={research.thumbnail}
                  alt={research.title}
                  fill
                  style={{objectFit: 'cover'}}
                  className="bg-gray-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  {getResearchTypeIcon(research.researchDetails?.researchType)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResearchTypeColor(research.researchDetails?.researchType)}`}>
                      {getResearchTypeLabel(research.researchDetails?.researchType)}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{research.title}</h1>
                  {research.date && (
                    <div className="flex items-center text-sm text-gray-200 mb-2">
                      <span>{new Date(research.date).toLocaleDateString()}</span>
                      {research.authors && research.authors.length > 0 && (
                        <span className="ml-4">By {research.authors.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">{research.description}</p>
                  
                  {/* Research Content */}
                  {research.content && (
                    <div dangerouslySetInnerHTML={{ __html: research.content }} />
                  )}
                  
                  {/* Key Findings */}
                  {research.researchDetails?.keyFindings && research.researchDetails.keyFindings.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {research.researchDetails.keyFindings.map((finding, index) => (
                          <li key={index} className="text-gray-700">{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Methodology */}
                  {research.researchDetails?.methodology && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold mb-4">Methodology</h2>
                      <p className="text-gray-700">{research.researchDetails.methodology}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Themes and Topics */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4">Themes & Topics</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {research.themes?.map(theme => (
                    <Link 
                      key={theme.id} 
                      href={`/research?theme=${theme.id}`}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1.5 rounded-full"
                    >
                      {theme.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {research.topics?.map(topic => (
                    <Link 
                      key={topic.id} 
                      href={`/research?topic=${topic.id}`}
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full"
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Research Type Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                  {getResearchTypeIcon(research.researchDetails?.researchType)}
                  <h2 className="text-xl font-semibold ml-3">
                    {getResearchTypeLabel(research.researchDetails?.researchType)}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {research.researchDetails?.researchType === 'finding' && 
                    'Research findings provide key insights from studies and evaluations.'}
                  {research.researchDetails?.researchType === 'analysis' && 
                    'Data analysis explores patterns and trends in data from various sources.'}
                  {research.researchDetails?.researchType === 'synthesis' && 
                    'Synthesis documents bring together multiple research findings into comprehensive insights.'}
                  {research.researchDetails?.researchType === 'data' && 
                    'Data resources provide raw data and datasets for further analysis.'}
                  {research.researchDetails?.researchType === 'report' && 
                    'Research reports provide comprehensive documentation of research projects.'}
                </p>
                <Link 
                  href={`/research/${research.researchDetails?.researchType === 'finding' ? 'findings' : 
                          research.researchDetails?.researchType === 'analysis' ? 'analysis' : 
                          research.researchDetails?.researchType === 'synthesis' ? 'synthesis' : 
                          'research'}`} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  View all {getResearchTypeLabel(research.researchDetails?.researchType)} content →
                </Link>
              </div>
              
              {/* Related Research */}
              {relatedResearch.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Related Research</h2>
                  <div className="space-y-4">
                    {relatedResearch.map(item => (
                      <Link key={item.id} href={`/research/${item.id}`} className="block group">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-md">
                            {item.thumbnail ? (
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                style={{objectFit: 'cover'}}
                                className="bg-gray-100"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
                                  <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {getResearchTypeLabel(item.researchDetails?.researchType)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/research" className="text-primary-600 hover:text-primary-800 font-medium">
                      View all research →
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Source Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Source Information</h2>
                {research.source && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Source</h3>
                    <p className="text-gray-700">{research.source}</p>
                  </div>
                )}
                {research.url && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
                    <a 
                      href={research.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 break-all"
                    >
                      {research.url}
                    </a>
                  </div>
                )}
                {research.date && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Publication Date</h3>
                    <p className="text-gray-700">{new Date(research.date).toLocaleDateString()}</p>
                  </div>
                )}
                {research.authors && research.authors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Authors</h3>
                    <p className="text-gray-700">{research.authors.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}