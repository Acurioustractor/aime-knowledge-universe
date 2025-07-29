"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'

// Types for Events Calendar
type EventsCalendarProps = {
  events: PurposeContentItem[];
  isLoading?: boolean;
}

type CalendarEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  eventType?: string;
  location?: string;
}

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

/**
 * Events Calendar component
 * 
 * Displays events in a calendar view
 */
export default function EventsCalendar({ 
  events = [],
  isLoading = false
}: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  // Convert events to calendar events
  useEffect(() => {
    const convertedEvents = events
      .filter(event => event.eventDetails?.startDate)
      .map(event => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.eventDetails!.startDate!),
        endDate: event.eventDetails?.endDate ? new Date(event.eventDetails.endDate) : undefined,
        eventType: event.eventDetails?.eventType,
        location: event.eventDetails?.location
      }));
    
    setCalendarEvents(convertedEvents);
  }, [events]);
  
  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Get last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get day of week of first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Get total days in month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Get last day of previous month
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    // Get days from next month to show
    const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth); // 6 rows of 7 days = 42
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, lastDayOfPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDay(date, calendarEvents)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDay(date, calendarEvents)
      });
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDay(date, calendarEvents)
      });
    }
    
    setCalendarDays(days);
  }, [currentDate, calendarEvents]);
  
  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  // Get events for a specific day
  const getEventsForDay = (date: Date, events: CalendarEvent[]) => {
    return events.filter(event => {
      // Single day event
      if (!event.endDate) {
        return isSameDay(event.startDate, date);
      }
      
      // Multi-day event
      const eventStart = new Date(event.startDate);
      eventStart.setHours(0, 0, 0, 0);
      
      const eventEnd = new Date(event.endDate);
      eventEnd.setHours(23, 59, 59, 999);
      
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Format date as month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };
  
  // Get event type color
  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case 'workshop':
        return 'bg-blue-100 border-blue-300';
      case 'webinar':
        return 'bg-green-100 border-green-300';
      case 'training':
        return 'bg-purple-100 border-purple-300';
      case 'conference':
        return 'bg-yellow-100 border-yellow-300';
      case 'meeting':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };
  
  // Get event type text color
  const getEventTypeTextColor = (eventType?: string) => {
    switch (eventType) {
      case 'workshop':
        return 'text-blue-800';
      case 'webinar':
        return 'text-green-800';
      case 'training':
        return 'text-purple-800';
      case 'conference':
        return 'text-yellow-800';
      case 'meeting':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">{formatMonthYear(currentDate)}</h2>
        <div className="flex space-x-2">
          <button 
            type="button"
            className="p-2 rounded-md hover:bg-gray-200"
            onClick={goToPreviousMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            type="button"
            className="px-3 py-1 rounded-md hover:bg-gray-200 text-sm font-medium"
            onClick={goToToday}
          >
            Today
          </button>
          <button 
            type="button"
            className="p-2 rounded-md hover:bg-gray-200"
            onClick={goToNextMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 grid-rows-6 h-96 overflow-y-auto">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-24 border-b border-r p-1 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${day.isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${day.isToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {day.events.length > 0 && (
                    <span className="text-xs bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded-full">
                      {day.events.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                  {day.events.map((event) => (
                    <Link 
                      key={event.id} 
                      href={`/events/${event.id}`}
                      className={`block text-xs p-1 rounded border ${getEventTypeColor(event.eventType)} ${getEventTypeTextColor(event.eventType)} truncate hover:opacity-80`}
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Event Types</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="text-xs text-gray-600">Workshop</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span className="text-xs text-gray-600">Webinar</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
            <span className="text-xs text-gray-600">Training</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
            <span className="text-xs text-gray-600">Conference</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            <span className="text-xs text-gray-600">Meeting</span>
          </div>
        </div>
      </div>
    </div>
  );
}