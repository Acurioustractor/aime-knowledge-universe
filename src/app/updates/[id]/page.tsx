"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PurposeContentItem, UpdateType } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Update Detail page
 * 
 * Dynamic page for displaying individual update details
 */
export default function UpdateDetailPage() {
  const { id } = useParams() as { id: string }
  const [update, setUpdate] = useState<PurposeContentItem | null>(null)
  const [relatedUpdates, setRelatedUpdates] = useState<PurposeContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        setIsLoading(true)
        
        // Import the integration functions
        const { getContentById, getAllContent } = await import('@/lib/integrations')
        
        // Fetch the update
        const contentItem = await getContentById(id)
        
        if (!contentItem) {
          setError('Update not found')
          setIsLoading(false)
          return
        }
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier())
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceWithPurpose(contentItem)
        
        // Check if content is an update
        if (enhancedContent.primaryPurpose !== 'update' && 
            !enhancedContent.secondaryPurposes?.includes('update')) {
          setError('This content is not an update')
          setIsLoading(false)
          return
        }
        
        setUpdate(enhancedContent)
        
        // Fetch related updates
        const allContent = await getAllContent()
        const enhancedAllContent = contentEnhancer.enhanceMultipleWithPurpose(allContent)
        
        // Filter for updates
        const updates = enhancedAllContent.filter(item => 
          (item.primaryPurpose === 'update' || item.secondaryPurposes?.includes('update')) &&
          item.id !== id
        )
        
        // Get update type
        const updateType = enhancedContent.updateDetails?.updateType
        
        // Get themes from current update
        const themes = enhancedContent.themes?.map(theme => theme.id) || []
        
        // Score updates by relevance to current update
        const scoredUpdates = updates.map(item => {
          let score = 0
          
          // Score by matching update type
          if (item.updateDetails?.updateType === updateType) {
            score += 10
          }
          
          // Score by matching themes
          item.themes?.forEach(theme => {
            if (themes.includes(theme.id)) {
              score += 5
            }
          })
          
          // Score by date proximity
          if (enhancedContent.date && item.date) {
            const updateDate = new Date(enhancedContent.date).getTime()
            const itemDate = new Date(item.date).getTime()
            const diffDays = Math.abs(updateDate - itemDate) / (1000 * 60 * 60 * 24)
            
            // Closer dates get higher scores
            if (diffDays < 30) {
              score += 5
            } else if (diffDays < 90) {
              score += 3
            } else if (diffDays < 180) {
              score += 1
            }
          }
          
          return {
            ...item,
            relationScore: score
          }
        })
        
        // Sort by relation score (descending)
        scoredUpdates.sort((a, b) => b.relationScore - a.relationScore)
        
        // Get top related updates
        const related = scoredUpdates.slice(0, 3)
        setRelatedUpdates(related)
        
      } catch (err) {
        console.error('Error fetching update:', err)
        setError('Error loading update')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUpdate()
  }, [id])
  
  // Get update type label
  const getUpdateTypeLabel = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'Newsletter'
      case 'announcement':
        return 'Announcement'
      case 'news':
        return 'News'
      case 'release':
        return 'Release'
      default:
        return 'Update'
    }
  }
  
  // Get update type color
  const getUpdateTypeColor = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'bg-blue-100 text-blue-800'
      case 'announcement':
        return 'bg-green-100 text-green-800'
      case 'news':
        return 'bg-purple-100 text-purple-800'
      case 'release':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get update type icon
  const getUpdateTypeIcon = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        )
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
          </svg>
        )
      case 'news':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        )
      case 'release':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
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
  
  if (error || !update) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-wiki">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{error || 'Update not found'}</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find the update you're looking for.
              </p>
              <Link href="/updates" className="btn btn-primary">
                View All Updates
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
              <li><Link href="/updates" className="hover:text-primary-600">Updates & News</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">{update.title}</li>
            </ol>
          </nav>
          
          {/* Update Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              {update.thumbnail ? (
                <Image
                  src={update.thumbnail}
                  alt={update.title}
                  fill
                  style={{objectFit: 'cover'}}
                  className="bg-gray-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  {getUpdateTypeIcon(update.updateDetails?.updateType)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeColor(update.updateDetails?.updateType)}`}>
                      {getUpdateTypeLabel(update.updateDetails?.updateType)}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{update.title}</h1>
                  {update.date && (
                    <div className="flex items-center text-sm text-gray-200 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                      <span>{new Date(update.date).toLocaleDateString()}</span>
                      
                      {update.updateDetails?.publisher && (
                        <span className="ml-4">{update.updateDetails.publisher}</span>
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
                  <p className="text-lg text-gray-700 mb-6">{update.description}</p>
                  
                  {/* Update Content */}
                  {update.content && (
                    <div dangerouslySetInnerHTML={{ __html: update.content }} />
                  )}
                  
                  {/* Highlights */}
                  {update.updateDetails?.highlights && update.updateDetails.highlights.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {update.updateDetails.highlights.map((highlight, index) => (
                          <li key={index} className="text-gray-700">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Call to Action */}
                  {update.updateDetails?.callToAction && (
                    <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
                      <p className="text-gray-700">{update.updateDetails.callToAction}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Themes and Topics */}
              {(update.themes?.length || update.topics?.length) && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Themes & Topics</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {update.themes?.map(theme => (
                      <Link 
                        key={theme.id} 
                        href={`/updates?theme=${theme.id}`}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1.5 rounded-full"
                      >
                        {theme.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {update.topics?.map(topic => (
                      <Link 
                        key={topic.id} 
                        href={`/updates?topic=${topic.id}`}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full"
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Update Type Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-4">
                  {getUpdateTypeIcon(update.updateDetails?.updateType)}
                  <h2 className="text-xl font-semibold ml-3">
                    {getUpdateTypeLabel(update.updateDetails?.updateType)}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {update.updateDetails?.updateType === 'newsletter' && 
                    'Newsletters provide regular updates and information about our activities and initiatives.'}
                  {update.updateDetails?.updateType === 'announcement' && 
                    'Announcements share important information and updates about our organization and programs.'}
                  {update.updateDetails?.updateType === 'news' && 
                    'News articles provide current information and updates about recent developments.'}
                  {update.updateDetails?.updateType === 'release' && 
                    'Releases announce new tools, resources, and features that have been launched.'}
                </p>
                <Link 
                  href={`/updates/${update.updateDetails?.updateType === 'newsletter' ? 'newsletters' : 
                          update.updateDetails?.updateType === 'announcement' ? 'announcements' : 
                          'latest'}`} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  View all {getUpdateTypeLabel(update.updateDetails?.updateType).toLowerCase()} →
                </Link>
              </div>
              
              {/* Related Updates */}
              {relatedUpdates.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Related Updates</h2>
                  <div className="space-y-4">
                    {relatedUpdates.map(item => (
                      <Link key={item.id} href={`/updates/${item.id}`} className="block group">
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
                                  <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
                                  <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.date && new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/updates" className="text-primary-600 hover:text-primary-800 font-medium">
                      View all updates →
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Newsletter Subscription */}
              <div className="bg-primary-50 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
                <p className="text-gray-600 mb-4">
                  Subscribe to our newsletter to receive the latest updates and announcements.
                </p>
                <Link href="/updates/newsletters" className="btn btn-primary w-full">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}