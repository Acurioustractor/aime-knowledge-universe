/**
 * Purpose Content Models
 * 
 * This file defines the data models for purpose-based content organization.
 */

import { ContentItem } from '../../content-integration/models/content-item';

/**
 * Content purpose types
 */
export type ContentPurpose = 
  | 'story'
  | 'tool'
  | 'research'
  | 'event'
  | 'update';

/**
 * Purpose-enhanced content item
 */
export interface PurposeContentItem extends ContentItem {
  // Purpose-based fields
  primaryPurpose: ContentPurpose;
  secondaryPurposes?: ContentPurpose[];
  purposeRelevance: number; // 0-100
  
  // Purpose-specific details
  storyDetails?: StoryDetails;
  toolDetails?: ToolDetails;
  researchDetails?: ResearchDetails;
  eventDetails?: EventDetails;
  updateDetails?: UpdateDetails;
  
  // Relationship fields
  relationshipStrength?: number; // 0-100
}

/**
 * Story options for filtering and fetching
 */
export interface StoryOptions {
  storyType?: StoryType;
  theme?: string;
  region?: string;
  dateFrom?: string;
  dateTo?: string;
  protagonists?: string[];
}

/**
 * Story type
 */
export type StoryType = 'personal' | 'case_study' | 'impact' | 'journey';

/**
 * Story details
 */
export interface StoryDetails {
  storyType: StoryType;
  keyQuotes?: string[];
  keyMoments?: KeyMoment[];
  protagonists?: string[];
  narrative?: string;
}

/**
 * Key moment in a story
 */
export interface KeyMoment {
  title: string;
  description: string;
  timestamp?: string;
}

/**
 * Tool details
 */
export interface ToolDetails {
  toolType: 'implementation' | 'worksheet' | 'guide' | 'toolkit' | 'template';
  usageInstructions?: string;
  targetAudience?: string[];
  implementationContext?: string[];
  prerequisites?: string[];
}

/**
 * Research details
 */
export interface ResearchDetails {
  researchType: 'finding' | 'analysis' | 'synthesis' | 'data' | 'report';
  keyFindings?: string[];
  methodology?: string;
  dataPoints?: DataPoint[];
  visualizations?: Visualization[];
}

/**
 * Data point in research
 */
export interface DataPoint {
  label: string;
  value: number | string;
  unit?: string;
}

/**
 * Visualization in research
 */
export interface Visualization {
  title: string;
  description: string;
  type: 'chart' | 'graph' | 'table' | 'image';
  url?: string;
  data?: any;
}

/**
 * Event details
 */
export interface EventDetails {
  eventType: 'workshop' | 'webinar' | 'training' | 'conference' | 'meeting';
  startDate?: string;
  endDate?: string;
  location?: string;
  registrationUrl?: string;
  materials?: EventMaterial[];
  speakers?: string[];
}

/**
 * Event material
 */
export interface EventMaterial {
  title: string;
  description: string;
  url: string;
  type: 'slides' | 'video' | 'document' | 'worksheet';
}

/**
 * Update details
 */
export interface UpdateDetails {
  updateType: 'newsletter' | 'announcement' | 'news' | 'release';
  publicationDate?: string;
  publisher?: string;
  callToAction?: string;
  highlights?: string[];
}