"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, EventType } from '@/lib/content-organization/models/purpose-content'

// Types for Events Hub
type EventsHubProps = {
  upcomingEvents?: PurposeContentItem[];
  pastEvents?: PurposeContentItem[];
  isLoading?: boolean;
}

type EventFilters = {
  eventType?: EventType;
  region?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

type EventCategory = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  type: EventType;
}

/**
 * Events Hub component
 * 
 * Displays a hub for event-focused content with upcoming events,
 * event categories, and event grid with filtering.
 */
export default function EventsHub({ 
  upcomingEvents = [], 
  pastEvents = [],
  isLoading = false
}: EventsHubProps) {
  // State for filters
  const [filters, setFilters] = useState<EventFilters>({});
  const [filteredEvents, setFilteredEvents] = useState<PurposeContentItem[]>(pastEvents);
  
  // Event categories
  const eventCategories: EventCategory[] = [
    {
      id: 'workshop',
      name: 'Workshops',
      description: 'Interactive sessions focused on skill-building and collaboration',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500">
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      ),
      type: 'workshop'
    },
    {
      id: 'webinar',
      name: 'Webinars',
      description: 'Online presentations and discussions on key topics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500">
          <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" clipRule="evenodd" />
        </svg>
      ),
      type: 'webinar'
    },
    {
      id: 'training',
      name: 'Training Programs',
      description: 'Structured learning experiences for skill development',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500">
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      ),
      type: 'training'
    },
    {
      id: 'conference',
      name: 'Conferences',
      description: 'Larger gatherings featuring multiple sessions and speakers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-500">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      ),
      type: 'conference'
    },
    {
      id: 'meeting',
      name: 'Meetings',
      description: 'Focused gatherings for discussion and decision-making',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
          <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
        </svg>
      ),
      type: 'meeting'
    }
  ];
  
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
    
    // Filter by date range
    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter(event => {
        if (!event.eventDetails?.startDate) return false;
        
        const eventDate = new Date(event.eventDetails.startDate);
        
        if (filters.dateRange?.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (eventDate < fromDate) return false;
        }
        
        if (filters.dateRange?.to) {
          const toDate = new Date(filters.dateRange.to);
          if (eventDate > toDate) return false;
        }
        
        return true;
      });
    }
    
    setFilteredEvents(filtered);
  }, [pastEvents, filters]);
  
  // Get unique regions
  const regions = Array.from(
    new Set(
      [...upcomingEvents, ...pastEvents].flatMap(event => 
        event.regions?.map(region => ({ id: region.id, name: region.name })) || []
      ).map(region => JSON.stringify(region))
    )
  ).map(region => JSON.parse(region));
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof EventFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };
  
  // Get event type label
  const getEventTypeLabel = (type?: EventType) => {
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
  
  // Get event type icon
  const getEventTypeIcon = (type?: EventType) => {
    const category = eventCategories.find(cat => cat.type === type);
    return category ? category.icon : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
      </svg>
    );
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
              <li className="text-gray-700 font-medium">Events & Programs</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Events & Programs</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Discover workshops, webinars, training programs, and other events from across the IMAGI-NATION network.
            Join us to learn, connect, and collaborate with others in the community.
          </p>
          
          {/* Event Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Event Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {eventCategories.map((category) => (
                <button
                  key={category.id}
                  className={`bg-white rounded-lg shadow-md p-6 text-left hover:bg-gray-50 transition-colors ${
                    filters.eventType === category.type ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => handleFilterChange('eventType', filters.eventType === category.type ? 'all' : category.type)}
                >
                  <div className="flex items-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.slice(0, 4).map((event) => (
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
                          <div className="absolute inset-0 bg-primary-100 flex items-center justify-center">
                            {getEventTypeIcon(event.eventDetails?.eventType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getEventTypeLabel(event.eventDetails?.eventType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDateRange(event.eventDetails?.startDate, event.eventDetails?.endDate)}</span>
                          
                          {event.eventDetails?.location && (
                            <div className="flex items-center ml-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{event.eventDetails.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              {upcomingEvents.length > 4 && (
                <div className="mt-6 text-center">
                  <Link href="/events/upcoming" className="btn btn-primary">
                    View All Upcoming Events
                  </Link>
                </div>
              )}
            </div>
          )}
          
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
              
              {/* Date Filter */}
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input 
                  type="date" 
                  id="dateFrom" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mb-2"
                  value={filters.dateRange?.from || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: e.target.value || undefined
                    }
                  }))}
                />
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input 
                  type="date" 
                  id="dateTo" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filters.dateRange?.to || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      to: e.target.value || undefined
                    }
                  }))}
                />
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
              <h2 className="text-2xl font-semibold">Past Events</h2>
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
                            {getEventTypeIcon(event.eventDetails?.eventType)}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getEventTypeLabel(event.eventDetails?.eventType)}
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
                          
                          {event.eventDetails?.location && (
                            <div className="flex items-center ml-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{event.eventDetails.location}</span>
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
              
              <Link href="/events/past" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500 mr-3">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Past Events</h3>
                </div>
                <p className="text-gray-600">
                  Access recordings and materials from past events.
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