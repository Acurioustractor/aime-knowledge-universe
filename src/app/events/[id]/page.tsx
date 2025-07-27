"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Event Detail page
 * 
 * Dynamic page for displaying individual event details
 */
export default function EventDetailPage() {
  const { id } = useParams() as { id: string }
  const [event, setEvent] = useState<PurposeContentItem | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<PurposeContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        
        // Import the integration functions
        const { getContentById, getAllContent } = await import('@/lib/integrations')
        
        // Fetch the event
        const contentItem = await getContentById(id)
        
        if (!contentItem) {
          setError('Event not found')
          setIsLoading(false)
          return
        }
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier())
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceWithPurpose(contentItem)
        
        // Check if content is an event
        if (enhancedContent.primaryPurpose !== 'event' && 
            !enhancedContent.secondaryPurposes?.includes('event')) {
          setError('This content is not an event')
          setIsLoading(false)
          return
        }
        
        setEvent(enhancedContent)
        
        // Fetch related events
        const allContent = await getAllContent()
        const enhancedAllContent = contentEnhancer.enhanceMultipleWithPurpose(allContent)
        
        // Filter for events
        const events = enhancedAllContent.filter(item => 
          (item.primaryPurpose === 'event' || item.secondaryPurposes?.includes('event')) &&
          item.id !== id
        )
        
        // Get event type
        const eventType = enhancedContent.eventDetails?.eventType
        
        // Get regions from current event
        const regions = enhancedContent.regions?.map(region => region.id) || []
        
        // Score events by relevance to current event
        const scoredEvents = events.map(item => {
          let score = 0
          
          // Score by matching event type
          if (item.eventDetails?.eventType === eventType) {
            score += 10
          }
          
          // Score by matching regions
          item.regions?.forEach(region => {
            if (regions.includes(region.id)) {
              score += 5
            }
          })
          
          // Score by matching themes
          const eventThemes = enhancedContent.themes?.map(theme => theme.id) || []
          item.themes?.forEach(theme => {
            if (eventThemes.includes(theme.id)) {
              score += 3
            }
          })
          
          // Score by date proximity
          if (enhancedContent.eventDetails?.startDate && item.eventDetails?.startDate) {
            const eventDate = new Date(enhancedContent.eventDetails.startDate).getTime()
            const itemDate = new Date(item.eventDetails.startDate).getTime()
            const diffDays = Math.abs(eventDate - itemDate) / (1000 * 60 * 60 * 24)
            
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
        scoredEvents.sort((a, b) => b.relationScore - a.relationScore)
        
        // Get top related events
        const related = scoredEvents.slice(0, 3)
        setRelatedEvents(related)
        
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Error loading event')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvent()
  }, [id])
  
  // Get event type label
  const getanyLabel = (type?: any) => {
    switch (type) {
      case 'workshop':
        return 'Workshop'
      case 'webinar':
        return 'Webinar'
      case 'training':
        return 'Training Program'
      case 'conference':
        return 'Conference'
      case 'meeting':
        return 'Meeting'
      default:
        return 'Event'
    }
  }
  
  // Get event type color
  const getanyColor = (type?: any) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800'
      case 'webinar':
        return 'bg-green-100 text-green-800'
      case 'training':
        return 'bg-purple-100 text-purple-800'
      case 'conference':
        return 'bg-yellow-100 text-yellow-800'
      case 'meeting':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return ''
    
    const start = new Date(startDate)
    
    if (!endDate) {
      return start.toLocaleDateString()
    }
    
    const end = new Date(endDate)
    
    // Same day
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString()}`
    }
    
    // Same month
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
    }
    
    // Different months
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }
  
  // Check if event is upcoming
  const isUpcoming = (startDate?: string) => {
    if (!startDate) return false
    
    const now = new Date()
    const eventDate = new Date(startDate)
    
    return eventDate >= now
  }
  
  // Get material type icon
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.54 15h6.42l.5 1.5H8.29l.5-1.5zm8.085-8.995a.75.75 0 10-.75-1.299 12.81 12.81 0 00-3.558 3.05L11.03 8.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 001.146-.102 11.312 11.312 0 013.612-3.321z" clipRule="evenodd" />
          </svg>
        )
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        )
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
          </svg>
        )
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
            <path fillRule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z" clipRule="evenodd" />
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
  
  if (error || !event) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-wiki">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{error || 'Event not found'}</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find the event you're looking for.
              </p>
              <Link href="/events" className="btn btn-primary">
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const upcoming = event.eventDetails?.startDate ? isUpcoming(event.eventDetails.startDate) : false
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/events" className="hover:text-primary-600">Events & Programs</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">{event.title}</li>
            </ol>
          </nav>
          
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              {event.thumbnail ? (
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  fill
                  style={{objectFit: 'cover'}}
                  className="bg-gray-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-gray-300">
                    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getanyColor(event.eventDetails?.eventType)}`}>
                      {getanyLabel(event.eventDetails?.eventType)}
                    </span>
                    {upcoming && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{event.title}</h1>
                  {event.eventDetails?.startDate && (
                    <div className="flex items-center text-sm text-gray-200 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                      </svg>
                      <span>{formatDateRange(event.eventDetails.startDate, event.eventDetails.endDate)}</span>
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
                  <p className="text-lg text-gray-700 mb-6">{event.description}</p>
                  
                  {/* Event Content */}
                  {event.content && (
                    <div dangerouslySetInnerHTML={{ __html: event.content }} />
                  )}
                </div>
              </div>
              
              {/* Event Materials */}
              {event.eventDetails?.materials && event.eventDetails.materials.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Event Materials</h2>
                  <div className="space-y-4">
                    {event.eventDetails.materials.map((material, index) => (
                      <div key={index} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          {getMaterialTypeIcon(material.type)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium">{material.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                          <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                          >
                            Download
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                              <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v2.546l.943-1.048a.75.75 0 011.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.75z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Themes and Topics */}
              {(event.themes?.length || event.topics?.length) && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Themes & Topics</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.themes?.map(theme => (
                      <Link 
                        key={theme.id} 
                        href={`/events?theme=${theme.id}`}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1.5 rounded-full"
                      >
                        {theme.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.topics?.map(topic => (
                      <Link 
                        key={topic.id} 
                        href={`/events?topic=${topic.id}`}
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
              {/* Event Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                
                {/* Date */}
                {event.eventDetails?.startDate && (
                  <div className="flex items-start mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600 mt-0.5 mr-3">
                      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date</h3>
                      <p className="text-gray-700">{formatDateRange(event.eventDetails.startDate, event.eventDetails.endDate)}</p>
                    </div>
                  </div>
                )}
                
                {/* Location */}
                {event.eventDetails?.location && (
                  <div className="flex items-start mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600 mt-0.5 mr-3">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-gray-700">{event.eventDetails.location}</p>
                    </div>
                  </div>
                )}
                
                {/* Event Type */}
                <div className="flex items-start mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600 mt-0.5 mr-3">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
                    <p className="text-gray-700">{getanyLabel(event.eventDetails?.eventType)}</p>
                  </div>
                </div>
                
                {/* Speakers */}
                {event.eventDetails?.speakers && event.eventDetails.speakers.length > 0 && (
                  <div className="flex items-start mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600 mt-0.5 mr-3">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Speakers</h3>
                      <p className="text-gray-700">{event.eventDetails.speakers.join(', ')}</p>
                    </div>
                  </div>
                )}
                
                {/* Registration */}
                {upcoming && event.eventDetails?.registrationUrl && (
                  <div className="mt-6">
                    <a 
                      href={event.eventDetails.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary w-full"
                    >
                      Register Now
                    </a>
                  </div>
                )}
              </div>
              
              {/* Related Events */}
              {relatedEvents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Related Events</h2>
                  <div className="space-y-4">
                    {relatedEvents.map(item => (
                      <Link key={item.id} href={`/events/${item.id}`} className="block group">
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
                                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.eventDetails?.startDate && formatDateRange(item.eventDetails.startDate, item.eventDetails.endDate)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/events" className="text-primary-600 hover:text-primary-800 font-medium">
                      View all events →
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Source Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Source Information</h2>
                {event.source && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Source</h3>
                    <p className="text-gray-700">{event.source}</p>
                  </div>
                )}
                {event.url && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
                    <a 
                      href={event.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 break-all"
                    >
                      {event.url}
                    </a>
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