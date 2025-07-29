"use client"

import { useState, useEffect } from 'react'
import EventsHub from '@/components/events/EventsHub'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Events page
 * 
 * Main page for the Events & Programs hub
 */
export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<PurposeContentItem[]>([]);
  const [pastEvents, setPastEvents] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
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
          item.primaryPurpose === 'event' || 
          item.secondaryPurposes?.includes('event')
        );
        
        // Sort by relevance (highest purpose relevance first)
        events.sort((a, b) => b.purposeRelevance - a.purposeRelevance);
        
        // Split into upcoming and past events
        const now = new Date();
        
        const upcoming = events.filter(event => {
          if (!event.eventDetails?.startDate) return false;
          const eventDate = new Date(event.eventDetails.startDate);
          return eventDate >= now;
        }).sort((a, b) => {
          const dateA = new Date(a.eventDetails!.startDate!).getTime();
          const dateB = new Date(b.eventDetails!.startDate!).getTime();
          return dateA - dateB; // Ascending by date
        });
        
        const past = events.filter(event => {
          if (!event.eventDetails?.startDate) return false;
          const eventDate = new Date(event.eventDetails.startDate);
          return eventDate < now;
        }).sort((a, b) => {
          const dateA = new Date(a.eventDetails!.startDate!).getTime();
          const dateB = new Date(b.eventDetails!.startDate!).getTime();
          return dateB - dateA; // Descending by date (most recent first)
        });
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <EventsHub 
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      isLoading={isLoading}
    />
  );
}