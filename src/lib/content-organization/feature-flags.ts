/**
 * Feature flags for the purpose-based content organization system
 * 
 * This module provides a way to enable or disable features of the
 * purpose-based content organization system. This allows for gradual
 * rollout of features and A/B testing.
 */

/**
 * Feature flag configuration
 */
export interface FeatureFlags {
  // Core features
  enablePurposeClassification: boolean;
  enableContentFiltering: boolean;
  enableContentRelationships: boolean;
  enableSearchIntegration: boolean;
  
  // UI features
  enablePurposeNavigation: boolean;
  enableHomePageIntegration: boolean;
  enableRelatedContent: boolean;
  enableContentFilters: boolean;
  
  // Purpose-specific features
  enableStoryHub: boolean;
  enableResearchHub: boolean;
  enableEventHub: boolean;
  enableUpdateHub: boolean;
  enableToolHub: boolean;
}

/**
 * Default feature flags
 * 
 * All features are enabled by default in development mode
 * and disabled by default in production mode.
 */
const defaultFeatureFlags: FeatureFlags = {
  // Core features
  enablePurposeClassification: process.env.NODE_ENV !== 'production',
  enableContentFiltering: process.env.NODE_ENV !== 'production',
  enableContentRelationships: process.env.NODE_ENV !== 'production',
  enableSearchIntegration: process.env.NODE_ENV !== 'production',
  
  // UI features
  enablePurposeNavigation: process.env.NODE_ENV !== 'production',
  enableHomePageIntegration: process.env.NODE_ENV !== 'production',
  enableRelatedContent: process.env.NODE_ENV !== 'production',
  enableContentFilters: process.env.NODE_ENV !== 'production',
  
  // Purpose-specific features
  enableStoryHub: process.env.NODE_ENV !== 'production',
  enableResearchHub: process.env.NODE_ENV !== 'production',
  enableEventHub: process.env.NODE_ENV !== 'production',
  enableUpdateHub: process.env.NODE_ENV !== 'production',
  enableToolHub: process.env.NODE_ENV !== 'production',
};

/**
 * Feature flags from environment variables
 * 
 * These flags can be set in the .env file or as environment variables.
 * They override the default feature flags.
 */
const envFeatureFlags: Partial<FeatureFlags> = {
  // Core features
  enablePurposeClassification: process.env.ENABLE_PURPOSE_CLASSIFICATION === 'true',
  enableContentFiltering: process.env.ENABLE_CONTENT_FILTERING === 'true',
  enableContentRelationships: process.env.ENABLE_CONTENT_RELATIONSHIPS === 'true',
  enableSearchIntegration: process.env.ENABLE_SEARCH_INTEGRATION === 'true',
  
  // UI features
  enablePurposeNavigation: process.env.ENABLE_PURPOSE_NAVIGATION === 'true',
  enableHomePageIntegration: process.env.ENABLE_HOME_PAGE_INTEGRATION === 'true',
  enableRelatedContent: process.env.ENABLE_RELATED_CONTENT === 'true',
  enableContentFilters: process.env.ENABLE_CONTENT_FILTERS === 'true',
  
  // Purpose-specific features
  enableStoryHub: process.env.ENABLE_STORY_HUB === 'true',
  enableResearchHub: process.env.ENABLE_RESEARCH_HUB === 'true',
  enableEventHub: process.env.ENABLE_EVENT_HUB === 'true',
  enableUpdateHub: process.env.ENABLE_UPDATE_HUB === 'true',
  enableToolHub: process.env.ENABLE_TOOL_HUB === 'true',
};

/**
 * Feature flags from local storage
 * 
 * These flags can be set in local storage for testing purposes.
 * They override both the default and environment feature flags.
 */
const getLocalStorageFeatureFlags = (): Partial<FeatureFlags> => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const flags = localStorage.getItem('featureFlags');
    return flags ? JSON.parse(flags) : {};
  } catch (error) {
    console.error('Error reading feature flags from local storage:', error);
    return {};
  }
};

/**
 * Get feature flags
 * 
 * Returns the feature flags for the purpose-based content organization system.
 * The flags are determined by the following order of precedence:
 * 1. Local storage flags (highest precedence)
 * 2. Environment variable flags
 * 3. Default flags (lowest precedence)
 */
export function getFeatureFlags(): FeatureFlags {
  const localStorageFlags = getLocalStorageFeatureFlags();
  
  return {
    ...defaultFeatureFlags,
    ...Object.fromEntries(
      Object.entries(envFeatureFlags).filter(([_, value]) => value !== undefined)
    ),
    ...localStorageFlags,
  };
}

/**
 * Set feature flags in local storage
 * 
 * This function is only available in the browser and is used for testing purposes.
 */
export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const currentFlags = getLocalStorageFeatureFlags();
    const newFlags = { ...currentFlags, ...flags };
    localStorage.setItem('featureFlags', JSON.stringify(newFlags));
  } catch (error) {
    console.error('Error setting feature flags in local storage:', error);
  }
}

/**
 * Reset feature flags in local storage
 * 
 * This function is only available in the browser and is used for testing purposes.
 */
export function resetFeatureFlags(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem('featureFlags');
  } catch (error) {
    console.error('Error resetting feature flags in local storage:', error);
  }
}

/**
 * Feature flag hook for React components
 * 
 * This hook returns the feature flags for the purpose-based content organization system.
 * It also provides a function to update the feature flags in local storage.
 */
export function useFeatureFlags(): [FeatureFlags, (flags: Partial<FeatureFlags>) => void] {
  const [flags, setFlags] = useState<FeatureFlags>(getFeatureFlags());
  
  // Update flags when local storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setFlags(getFeatureFlags());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Function to update flags in local storage
  const updateFlags = useCallback((newFlags: Partial<FeatureFlags>) => {
    setFeatureFlags(newFlags);
    setFlags(getFeatureFlags());
  }, []);
  
  return [flags, updateFlags];
}

// Import React hooks
import { useState, useEffect, useCallback } from 'react';