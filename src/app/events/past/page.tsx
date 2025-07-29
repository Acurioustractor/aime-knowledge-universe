"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Past Events page
 * 
 * Page for displaying past events and their materials
 */
export default function PastEventsPage() {
  const [pastEvents, setPastEvents] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    eventType?: any;
    region?: string;
    year?: number;
  }>({});
  const [filteredEvents, setFilteredEvents] = useState<PurposeContentItem[]>([]);
  
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setIsLoading(true);
        
        // Import the integration functions
        const { getAllContent } = await import('@/lib/integrations');
        
        // Fetch all content
        const allContent = await getAllContent();
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceMultipleWithPurpose(allContent);
        
        // Filter for events (primary or secondary purpose)
        const events = enhancedContent.filter(item => 
          (item.primaryPurpose === 'event' || item.secondaryPurposes?.includes('event')) &&
          item.eventDetails?.startDate
        );
        
        // Filter for past events
        const now = new Date();
        const past = events.filter(event => {
          const eventDate = new Date(event.eventDetails!.startDate!);
          return eventDate < now;
        });
        
        // Sort by date (descending - most recent first)
        past.sort((a, b) => {
          const dateA = new Date(a.eventDetails!.startDate!).getTime();
          const dateB = new Date(b.eventDetails!.startDate!).getTime();
          return dateB - dateA;
        });
        
        setPastEvents(past);
        setFilteredEvents(past);
      } catch (err) {
        console.error('Error fetching past events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPastEvents();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (pastEvents.length === 0) return;
    
    let filtered = [...pastEvents];
    
    // Filter by event type
    if (filters.eventType) {
      filtered = filtered.filter(event => 
        event.eventDetails?.eventType === filters.eventType
      );
    }
    
    // Filter by region
    if (filters.region) {
      filtered = filtered.filter(event => 
        event.regions?.some(region => 
          region.name.toLowerCase().includes(filters.region!.toLowerCase()) ||
          region.id === filters.region
        )
      );
    }
    
    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(event => {
        if (!event.eventDetails?.startDate) return false;
        const eventDate = new Date(event.eventDetails.startDate);
        return eventDate.getFullYear() === filters.year;
      });
    }
    
    setFilteredEvents(filtered);
  }, [pastEvents, filters]);
  
  // Get unique regions
  const regions = Array.from(
    new Set(
      pastEvents.flatMap(event => 
        event.regions?.map(region => ({ id: region.id, name: region.name })) || []
      ).map(region => JSON.stringify(region))
    )
  ).map(region => JSON.parse(region));
  
  // Get unique years
  const years = Array.from(
    new Set(
      pastEvents
        .filter(event => event.eventDetails?.startDate)
        .map(event => new Date(event.eventDetails!.startDate!).getFullYear())
    )
  ).sort((a, b) => b - a); // Sort descending
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };
  
  // Get event type label
  const getanyLabel = (type?: any) => {
    switch (type) {
      case 'workshop':
        return 'Workshop';
      case 'webinar':
        return 'Webinar';
      case 'training':
        return 'Training Program';
      case 'conference':
        return 'Conference';
      case 'meeting':
        return 'Meeting';
      default:
        return 'Event';
    }
  };
  
  // Get event type color
  const getanyColor = (type?: any) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'webinar':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-purple-100 text-purple-800';
      case 'conference':
        return 'bg-yellow-100 text-yellow-800';
      case 'meeting':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    
    if (!endDate) {
      return start.toLocaleDateString();
    }
    
    const end = new Date(endDate);
    
    // Same day
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString()}`;
    }
    
    // Same month
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
    }
    
    // Different months
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };
  
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
              <li className="text-gray-700 font-medium">Past Events</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Past Events</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Access recordings, materials, and resources from past events and programs.
            Explore the archive to find valuable content from previous workshops, webinars, and conferences.
          </p>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Type Filter */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select 
                  id="eventType" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.eventType || 'all'}
                  onChange={(e) => handleFilterChange('eventType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="workshop">Workshops</option>
                  <option value="webinar">Webinars</option>
                  <option value="training">Training Programs</option>
                  <option value="conference">Conferences</option>
                  <option value="meeting">Meetings</option>
                </select>
              </div>
              
              {/* Region Filter */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select 
                  id="region" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.region || 'all'}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <option value="all">All Regions</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Year Filter */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select 
                  id="year" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.year || 'all'}
                  onChange={(e) => handleFilterChange('year', e.target.value === 'all' ? undefined : parseInt(e.target.value))}
                >
                  <option value="all">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Past Events Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Event Archive</h2>
              <p className="text-sm text-gray-500">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No past events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more events.
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setFilters({})}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/events/${event.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-500">
                              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getanyColor(event.eventDetails?.eventType)}`}>
                            {getanyLabel(event.eventDetails?.eventType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDateRange(event.eventDetails?.startDate, event.eventDetails?.endDate)}</span>
                          
                          {event.eventDetails?.materials && event.eventDetails.materials.length > 0 && (
                            <div className="flex items-center ml-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary-600">
                                <path fillRule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Event Categories Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/events" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500 mr-3">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">All Events</h3>
                </div>
                <p className="text-gray-600">
                  View all events and programs.
                </p>
              </Link>
              
              <Link href="/events/upcoming" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-600 mr-3">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Upcoming Events</h3>
                </div>
                <p className="text-gray-600">
                  View all upcoming events and register to participate.
                </p>
              </Link>
              
              <Link href="/events/training" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500 mr-3">
                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                    <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Training Programs</h3>
                </div>
                <p className="text-gray-600">
                  Explore structured learning experiences for skill development.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}