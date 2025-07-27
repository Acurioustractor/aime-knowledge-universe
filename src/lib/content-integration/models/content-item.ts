/**
 * Core data models for the content integration system
 */

/**
 * Content types supported by the system
 */
export type ContentType = 
  | 'video'
  | 'document'
  | 'resource'
  | 'toolkit'
  | 'event'
  | 'newsletter'
  | 'dashboard';

/**
 * Content sources supported by the system
 */
export type ContentSource =
  | 'youtube'
  | 'github'
  | 'airtable'
  | 'mailchimp';

/**
 * Theme model representing a content theme or topic
 */
export type Theme = {
  id: string;
  name: string;
  description?: string;
  relevance: number; // 0-100
};

/**
 * Topic model representing a specific topic within a theme
 */
export type Topic = {
  id: string;
  name: string;
  description?: string;
  keywords?: string[];
};

/**
 * Region model representing a geographic region
 */
export type Region = {
  id: string;
  name: string;
  type: 'country' | 'continent' | 'indigenous-nation';
};

/**
 * Participant type model representing a type of participant
 */
export type ParticipantType = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Relationship type between content items
 */
export type RelationshipType =
  | 'continues'
  | 'expands'
  | 'contrasts'
  | 'references'
  | 'implements'
  | 'inspires';

/**
 * Related content item model
 */
export type RelatedContentItem = {
  id: string;
  relationshipType: RelationshipType;
  strength: number; // 0-100
};

/**
 * Insight model representing a key insight from content
 */
export type Insight = {
  text: string;
  source: string;
  themes?: Theme[];
};

/**
 * Content item model representing any content regardless of source
 */
export type ContentItem = {
  id: string;
  title: string;
  description: string;
  content?: string;
  contentType: ContentType;
  source: ContentSource;
  url: string;
  thumbnail?: string;
  date?: string;
  authors?: string[];
  themes?: Theme[];
  topics?: Topic[];
  tags?: string[];
  regions?: Region[];
  participantTypes?: ParticipantType[];
  relatedContent?: RelatedContentItem[];
  insights?: Insight[];
  metadata?: Record<string, any>;
};

/**
 * Raw content item before normalization
 */
export type RawContent = Record<string, any>;

/**
 * Options for fetching content
 */
export type ContentOptions = {
  limit?: number;
  offset?: number;
  query?: string;
  theme?: string;
  topic?: string;
  contentType?: ContentType;
  source?: ContentSource;
  region?: string;
  participantType?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'relevance' | 'title';
  sortOrder?: 'asc' | 'desc';
};

/**
 * Search options
 */
export type SearchOptions = ContentOptions & {
  includeContent?: boolean;
  groupBy?: 'theme' | 'source' | 'type' | 'none';
};

/**
 * Search filters
 */
export type SearchFilters = {
  contentTypes?: ContentType[];
  sources?: ContentSource[];
  themes?: string[];
  topics?: string[];
  regions?: string[];
  participantTypes?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
};

/**
 * Search result
 */
export type SearchResult = ContentItem & {
  relevance: number;
  matchedTerms?: string[];
  highlightedText?: string;
};

/**
 * Content path representing a sequence of related content
 */
export type ContentPath = {
  id: string;
  name: string;
  description?: string;
  items: ContentPathItem[];
};

/**
 * Content path item
 */
export type ContentPathItem = {
  contentId: string;
  order: number;
  description?: string;
};

/**
 * Theme taxonomy
 */
export type ThemeTaxonomy = {
  themes: ThemeDefinition[];
};

/**
 * Theme definition
 */
export type ThemeDefinition = {
  id: string;
  name: string;
  description?: string;
  parentTheme?: string;
  childThemes?: string[];
  relatedThemes?: string[];
  topics?: TopicDefinition[];
};

/**
 * Topic definition
 */
export type TopicDefinition = {
  id: string;
  name: string;
  description?: string;
  keywords?: string[];
};

/**
 * Error types
 */
export type ErrorType =
  | 'api_connection_error'
  | 'authentication_error'
  | 'resource_not_found'
  | 'parsing_error'
  | 'validation_error';

/**
 * Error response
 */
export type ErrorResponse = {
  type: ErrorType;
  message: string;
  source: string;
  timestamp: string;
  details?: Record<string, any>;
};