/**
 * Analytics for the purpose-based content organization system
 * 
 * This module provides functions for tracking user engagement with the
 * purpose-based content organization system.
 */

// Event categories
export enum AnalyticsCategory {
  CONTENT_DISCOVERY = 'content_discovery',
  SEARCH_FILTER = 'search_filter',
  CONTENT_ENGAGEMENT = 'content_engagement',
  PURPOSE_CLASSIFICATION = 'purpose_classification',
  NAVIGATION = 'navigation',
}

// Event actions
export enum AnalyticsAction {
  // Content discovery actions
  VIEW_PURPOSE_HUB = 'view_purpose_hub',
  CLICK_CONTENT_ITEM = 'click_content_item',
  NAVIGATE_BETWEEN_HUBS = 'navigate_between_hubs',
  
  // Search and filter actions
  SEARCH_QUERY = 'search_query',
  APPLY_FILTER = 'apply_filter',
  CLEAR_FILTER = 'clear_filter',
  CLICK_SEARCH_RESULT = 'click_search_result',
  ABANDON_SEARCH = 'abandon_search',
  
  // Content engagement actions
  VIEW_CONTENT = 'view_content',
  SHARE_CONTENT = 'share_content',
  CLICK_RELATED_CONTENT = 'click_related_content',
  RATE_CONTENT = 'rate_content',
  
  // Purpose classification actions
  SUGGEST_PURPOSE_CHANGE = 'suggest_purpose_change',
  PROVIDE_CLASSIFICATION_FEEDBACK = 'provide_classification_feedback',
  
  // Navigation actions
  CLICK_NAVIGATION_LINK = 'click_navigation_link',
  USE_BREADCRUMB = 'use_breadcrumb',
}

// Analytics event interface
export interface AnalyticsEvent {
  category: AnalyticsCategory;
  action: AnalyticsAction;
  label?: string;
  value?: number;
  dimensions?: Record<string, string | number | boolean>;
}

/**
 * Track an analytics event
 * 
 * This function sends an analytics event to the analytics provider.
 * It supports both client-side and server-side tracking.
 */
export function trackEvent(event: AnalyticsEvent): void {
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Get the analytics provider
  const analyticsProvider = getAnalyticsProvider();
  
  // Track the event
  if (analyticsProvider) {
    try {
      analyticsProvider.trackEvent(event);
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  } else if (isBrowser) {
    // Fallback to console logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Analytics event:', event);
    }
  }
}

/**
 * Track a page view
 * 
 * This function sends a page view event to the analytics provider.
 * It should be called whenever a page is loaded.
 */
export function trackPageView(path: string, title?: string): void {
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Get the analytics provider
  const analyticsProvider = getAnalyticsProvider();
  
  // Track the page view
  if (analyticsProvider) {
    try {
      analyticsProvider.trackPageView(path, title);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  } else if (isBrowser) {
    // Fallback to console logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Page view:', { path, title });
    }
  }
}

/**
 * Track a purpose hub view
 * 
 * This function sends an event when a user views a purpose hub.
 */
export function trackPurposeHubView(purpose: string): void {
  trackEvent({
    category: AnalyticsCategory.CONTENT_DISCOVERY,
    action: AnalyticsAction.VIEW_PURPOSE_HUB,
    label: purpose,
    dimensions: {
      purpose,
    },
  });
}

/**
 * Track a content item click
 * 
 * This function sends an event when a user clicks on a content item.
 */
export function trackContentItemClick(contentId: string, purpose: string, source: string): void {
  trackEvent({
    category: AnalyticsCategory.CONTENT_DISCOVERY,
    action: AnalyticsAction.CLICK_CONTENT_ITEM,
    label: contentId,
    dimensions: {
      purpose,
      source,
      contentId,
    },
  });
}

/**
 * Track a search query
 * 
 * This function sends an event when a user performs a search query.
 */
export function trackSearchQuery(query: string, purpose?: string): void {
  trackEvent({
    category: AnalyticsCategory.SEARCH_FILTER,
    action: AnalyticsAction.SEARCH_QUERY,
    label: query,
    dimensions: {
      query,
      purpose: purpose || 'all',
    },
  });
}

/**
 * Track a filter application
 * 
 * This function sends an event when a user applies a filter.
 */
export function trackFilterApply(filterType: string, filterValue: string, purpose?: string): void {
  trackEvent({
    category: AnalyticsCategory.SEARCH_FILTER,
    action: AnalyticsAction.APPLY_FILTER,
    label: `${filterType}:${filterValue}`,
    dimensions: {
      filterType,
      filterValue,
      purpose: purpose || 'all',
    },
  });
}

/**
 * Track a content view
 * 
 * This function sends an event when a user views a content item.
 */
export function trackContentView(contentId: string, purpose: string, source: string): void {
  trackEvent({
    category: AnalyticsCategory.CONTENT_ENGAGEMENT,
    action: AnalyticsAction.VIEW_CONTENT,
    label: contentId,
    dimensions: {
      purpose,
      source,
      contentId,
    },
  });
}

/**
 * Track a related content click
 * 
 * This function sends an event when a user clicks on related content.
 */
export function trackRelatedContentClick(
  sourceContentId: string, 
  targetContentId: string, 
  sourcePurpose: string, 
  targetPurpose: string,
  relationshipStrength?: number
): void {
  trackEvent({
    category: AnalyticsCategory.CONTENT_ENGAGEMENT,
    action: AnalyticsAction.CLICK_RELATED_CONTENT,
    label: `${sourceContentId} -> ${targetContentId}`,
    value: relationshipStrength,
    dimensions: {
      sourceContentId,
      targetContentId,
      sourcePurpose,
      targetPurpose,
      relationshipStrength,
    },
  });
}

/**
 * Track purpose classification feedback
 * 
 * This function sends an event when a user provides feedback on purpose classification.
 */
export function trackPurposeClassificationFeedback(
  contentId: string, 
  currentPurpose: string, 
  suggestedPurpose: string
): void {
  trackEvent({
    category: AnalyticsCategory.PURPOSE_CLASSIFICATION,
    action: AnalyticsAction.PROVIDE_CLASSIFICATION_FEEDBACK,
    label: contentId,
    dimensions: {
      contentId,
      currentPurpose,
      suggestedPurpose,
    },
  });
}

/**
 * Track navigation between purpose hubs
 * 
 * This function sends an event when a user navigates between purpose hubs.
 */
export function trackNavigationBetweenHubs(fromPurpose: string, toPurpose: string): void {
  trackEvent({
    category: AnalyticsCategory.NAVIGATION,
    action: AnalyticsAction.NAVIGATE_BETWEEN_HUBS,
    label: `${fromPurpose} -> ${toPurpose}`,
    dimensions: {
      fromPurpose,
      toPurpose,
    },
  });
}

/**
 * Analytics provider interface
 * 
 * This interface defines the methods that an analytics provider must implement.
 */
export interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(path: string, title?: string): void;
}

/**
 * Get the analytics provider
 * 
 * This function returns the analytics provider based on the environment.
 * It supports both client-side and server-side tracking.
 */
function getAnalyticsProvider(): AnalyticsProvider | null {
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Return null if we're not in the browser and not in a server environment
  // that supports analytics
  if (!isBrowser && process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  // In a real implementation, this would return the actual analytics provider
  // based on the environment and configuration
  
  // For now, return a mock provider in development
  if (process.env.NODE_ENV !== 'production') {
    return {
      trackEvent: (event: AnalyticsEvent) => {
        console.log('Analytics event:', event);
      },
      trackPageView: (path: string, title?: string) => {
        console.log('Page view:', { path, title });
      },
    };
  }
  
  // In production, this would return the actual analytics provider
  // For example, Google Analytics, Mixpanel, etc.
  return null;
}

/**
 * React hook for analytics
 * 
 * This hook provides analytics tracking functions for React components.
 */
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    trackPurposeHubView,
    trackContentItemClick,
    trackSearchQuery,
    trackFilterApply,
    trackContentView,
    trackRelatedContentClick,
    trackPurposeClassificationFeedback,
    trackNavigationBetweenHubs,
  };
}

// Import React hooks if needed
// import { useEffect } from 'react';