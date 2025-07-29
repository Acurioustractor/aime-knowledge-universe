/**
 * Unified Content Model for AIME Knowledge Platform
 * 
 * This enhanced data model supports:
 * - Multi-source content integration
 * - Knowledge graph relationships
 * - AI-powered content analysis
 * - Impact measurement and analytics
 * - Community contributions
 */

export interface UnifiedContent {
  // Core Identifiers
  id: string;
  globalId: string; // Unique across all sources
  version: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Content Details
  title: string;
  description: string;
  content?: string;
  summary?: string; // AI-generated summary
  
  // Content Classification
  type: ContentType;
  source: ContentSource;
  format: ContentFormat;
  language: string;
  languages: string[]; // Available translations
  
  // Rich Metadata
  authors: Author[];
  contributors: Contributor[];
  mentions: Person[]; // People mentioned in content
  
  // Taxonomy & Classification
  themes: ThemeNode[];
  topics: Topic[];
  tags: Tag[];
  keywords: string[]; // AI-extracted keywords
  
  // Geographic & Cultural Context
  regions: Region[];
  communities: Community[];
  culturalContext: CulturalContext[];
  
  // Temporal Information
  publicationDate?: Date;
  eventDate?: Date;
  dateRange?: DateRange;
  timeline?: TimelineEvent[];
  
  // Media & Resources
  media: MediaAsset[];
  attachments: Attachment[];
  externalLinks: ExternalLink[];
  
  // Relationships & Knowledge Graph
  relationships: ContentRelationship[];
  citations: Citation[];
  references: Reference[];
  
  // AI Analysis
  aiAnalysis: AIAnalysis;
  sentiment: SentimentAnalysis;
  insights: Insight[];
  
  // Impact & Metrics
  impact: ImpactMetrics;
  engagement: EngagementMetrics;
  reach: ReachMetrics;
  
  // Community & Interaction
  communityContributions: CommunityContribution[];
  feedback: Feedback[];
  discussions: Discussion[];
  
  // Quality & Trust
  qualityScore: number; // 0-100
  verificationStatus: VerificationStatus;
  trustIndicators: TrustIndicator[];
  
  // Access & Permissions
  accessibility: AccessibilityInfo;
  license: License;
  permissions: Permission[];
  
  // Source-Specific Metadata
  sourceMetadata: Record<string, any>;
}

export enum ContentType {
  VIDEO = 'video',
  DOCUMENT = 'document',
  RESOURCE = 'resource',
  TOOLKIT = 'toolkit',
  EVENT = 'event',
  WORKSHOP = 'workshop',
  NEWSLETTER = 'newsletter',
  DASHBOARD = 'dashboard',
  STORY = 'story',
  RESEARCH = 'research',
  PODCAST = 'podcast',
  COURSE = 'course',
  ARTIFACT = 'artifact'
}

export enum ContentSource {
  YOUTUBE = 'youtube',
  GITHUB = 'github',
  AIRTABLE = 'airtable',
  MAILCHIMP = 'mailchimp',
  COMMUNITY = 'community',
  PARTNER = 'partner',
  ARCHIVE = 'archive',
  LIVE_EVENT = 'live_event'
}

export enum ContentFormat {
  VIDEO = 'video',
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  HTML = 'html',
  AUDIO = 'audio',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
  DATASET = 'dataset'
}

export interface Author {
  id: string;
  name: string;
  role: string;
  affiliation?: string;
  bio?: string;
  profileUrl?: string;
  contributions: number;
}

export interface Contributor {
  id: string;
  name: string;
  type: ContributorType;
  contribution: string;
  date: Date;
}

export enum ContributorType {
  MENTOR = 'mentor',
  YOUTH = 'youth',
  ELDER = 'elder',
  PARTNER = 'partner',
  VOLUNTEER = 'volunteer',
  STAFF = 'staff'
}

export interface Person {
  id: string;
  name: string;
  role?: string;
  community?: string;
  mentionContext: string;
}

export interface ThemeNode {
  id: string;
  name: string;
  description: string;
  level: number; // Hierarchy level
  parent?: string;
  children?: string[];
  weight: number; // Relevance to content
  examples: string[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  category: string;
  relatedThemes: string[];
  frequency: number; // How often it appears
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  confidence: number; // AI confidence if auto-generated
}

export enum TagType {
  MANUAL = 'manual',
  AI_GENERATED = 'ai_generated',
  COMMUNITY = 'community',
  SYSTEM = 'system'
}

export interface Region {
  id: string;
  name: string;
  type: RegionType;
  country?: string;
  continent?: string;
  coordinates?: Coordinates;
  indigenousTerritory?: string;
}

export enum RegionType {
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
  INDIGENOUS_NATION = 'indigenous_nation',
  COMMUNITY = 'community',
  GLOBAL = 'global'
}

export interface Community {
  id: string;
  name: string;
  type: CommunityType;
  location: Region;
  size: number;
  established: Date;
  description: string;
}

export enum CommunityType {
  INDIGENOUS = 'indigenous',
  URBAN = 'urban',
  RURAL = 'rural',
  SCHOOL = 'school',
  UNIVERSITY = 'university',
  ORGANIZATION = 'organization'
}

export interface CulturalContext {
  id: string;
  culture: string;
  traditions: string[];
  protocols: string[];
  significance: string;
  sensitivityLevel: SensitivityLevel;
}

export enum SensitivityLevel {
  PUBLIC = 'public',
  COMMUNITY = 'community',
  RESTRICTED = 'restricted',
  SACRED = 'sacred'
}

export interface DateRange {
  start: Date;
  end: Date;
  recurring?: RecurrencePattern;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
}

export interface TimelineEvent {
  date: Date;
  event: string;
  description: string;
  significance: string;
  relatedContent: string[];
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // For video/audio in seconds
  dimensions?: Dimensions;
  transcript?: string;
  captions?: Caption[];
  alt?: string;
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  ANIMATION = 'animation',
  INTERACTIVE = 'interactive'
}

export interface Caption {
  language: string;
  url: string;
  type: 'auto' | 'manual' | 'community';
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  description?: string;
}

export interface ExternalLink {
  url: string;
  title: string;
  description?: string;
  type: LinkType;
  verified: boolean;
}

export enum LinkType {
  REFERENCE = 'reference',
  RESOURCE = 'resource',
  SOCIAL = 'social',
  PARTNER = 'partner',
  TOOL = 'tool'
}

export interface ContentRelationship {
  targetId: string;
  type: RelationshipType;
  strength: number; // 0-100
  bidirectional: boolean;
  context?: string;
  metadata?: Record<string, any>;
}

export enum RelationshipType {
  CONTINUES = 'continues',
  REFERENCES = 'references',
  RESPONDS_TO = 'responds_to',
  IMPLEMENTS = 'implements',
  CONTRADICTS = 'contradicts',
  SUPPORTS = 'supports',
  PART_OF = 'part_of',
  VARIANT_OF = 'variant_of',
  TRANSLATION_OF = 'translation_of',
  INSPIRED_BY = 'inspired_by'
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  author?: string;
  date?: Date;
  url?: string;
  pageNumber?: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  publicationDate?: Date;
  publisher?: string;
  url?: string;
  doi?: string;
  type: ReferenceType;
}

export enum ReferenceType {
  ACADEMIC = 'academic',
  BOOK = 'book',
  REPORT = 'report',
  WEBSITE = 'website',
  MEDIA = 'media',
  TRADITIONAL = 'traditional_knowledge'
}

export interface AIAnalysis {
  analyzedAt: Date;
  modelVersion: string;
  themes: ExtractedTheme[];
  entities: ExtractedEntity[];
  concepts: ExtractedConcept[];
  summary: string;
  keyPoints: string[];
  questions: string[]; // Questions this content answers
  actionItems: string[]; // Actionable insights
  emotionalJourney?: EmotionalJourney;
}

export interface ExtractedTheme {
  theme: string;
  confidence: number;
  evidence: string[];
  relatedConcepts: string[];
}

export interface ExtractedEntity {
  name: string;
  type: EntityType;
  confidence: number;
  context: string;
  wikipediaUrl?: string;
}

export enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  LOCATION = 'location',
  EVENT = 'event',
  CONCEPT = 'concept',
  PROGRAM = 'program'
}

export interface ExtractedConcept {
  concept: string;
  definition: string;
  importance: number;
  relatedConcepts: string[];
  examples: string[];
}

export interface EmotionalJourney {
  stages: EmotionalStage[];
  overallSentiment: number; // -1 to 1
  transformation: string;
}

export interface EmotionalStage {
  timestamp?: number;
  emotion: string;
  intensity: number;
  description: string;
}

export interface SentimentAnalysis {
  overall: number; // -1 to 1
  positivity: number; // 0 to 1
  negativity: number; // 0 to 1
  neutrality: number; // 0 to 1
  emotions: EmotionScore[];
}

export interface EmotionScore {
  emotion: string;
  score: number;
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  impact: ImpactLevel;
  actionable: boolean;
}

export enum InsightType {
  PATTERN = 'pattern',
  ANOMALY = 'anomaly',
  TREND = 'trend',
  CORRELATION = 'correlation',
  RECOMMENDATION = 'recommendation',
  WARNING = 'warning',
  OPPORTUNITY = 'opportunity'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  TRANSFORMATIVE = 'transformative'
}

export interface ImpactMetrics {
  livesReached: number;
  communitiesEngaged: number;
  programsInfluenced: number;
  storiesGenerated: number;
  outcomesAchieved: Outcome[];
  sdgAlignment: SDGAlignment[];
}

export interface Outcome {
  id: string;
  description: string;
  metric: string;
  value: number;
  evidence: string[];
  date: Date;
}

export interface SDGAlignment {
  goal: number;
  target: string;
  contribution: string;
  evidence: string[];
}

export interface EngagementMetrics {
  views: number;
  uniqueViewers: number;
  avgViewDuration?: number;
  completionRate?: number;
  shares: number;
  likes: number;
  comments: number;
  bookmarks: number;
  downloads: number;
  interactions: Interaction[];
}

export interface Interaction {
  type: InteractionType;
  count: number;
  timestamp: Date;
  context?: string;
}

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  SHARE = 'share',
  COMMENT = 'comment',
  BOOKMARK = 'bookmark',
  DOWNLOAD = 'download',
  IMPLEMENT = 'implement',
  ADAPT = 'adapt'
}

export interface ReachMetrics {
  geographic: GeographicReach[];
  demographic: DemographicReach[];
  organizational: OrganizationalReach[];
  timeZones: string[];
  languages: string[];
}

export interface GeographicReach {
  region: string;
  count: number;
  percentage: number;
}

export interface DemographicReach {
  category: string;
  value: string;
  count: number;
  percentage: number;
}

export interface OrganizationalReach {
  type: string;
  name: string;
  size: number;
  sector: string;
}

export interface CommunityContribution {
  id: string;
  contributorId: string;
  type: ContributionType;
  content: string;
  date: Date;
  status: ContributionStatus;
  votes: number;
  verifiedBy?: string[];
}

export enum ContributionType {
  STORY = 'story',
  TRANSLATION = 'translation',
  ADAPTATION = 'adaptation',
  EXAMPLE = 'example',
  CORRECTION = 'correction',
  ENHANCEMENT = 'enhancement',
  CONTEXT = 'context'
}

export enum ContributionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review'
}

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  content: string;
  rating?: number;
  date: Date;
  helpful: number;
  response?: string;
}

export enum FeedbackType {
  COMMENT = 'comment',
  QUESTION = 'question',
  SUGGESTION = 'suggestion',
  ISSUE = 'issue',
  PRAISE = 'praise'
}

export interface Discussion {
  id: string;
  topic: string;
  participants: string[];
  messages: number;
  lastActivity: Date;
  status: DiscussionStatus;
  outcome?: string;
}

export enum DiscussionStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
  LOCKED = 'locked'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  COMMUNITY_VERIFIED = 'community_verified',
  EXPERT_VERIFIED = 'expert_verified',
  OFFICIALLY_VERIFIED = 'officially_verified'
}

export interface TrustIndicator {
  type: TrustType;
  value: string;
  verifiedBy: string;
  date: Date;
}

export enum TrustType {
  SOURCE_CREDIBILITY = 'source_credibility',
  PEER_REVIEW = 'peer_review',
  EXPERT_ENDORSEMENT = 'expert_endorsement',
  COMMUNITY_VALIDATION = 'community_validation',
  FACT_CHECK = 'fact_check'
}

export interface AccessibilityInfo {
  wcagLevel: 'A' | 'AA' | 'AAA';
  features: AccessibilityFeature[];
  languages: string[];
  readingLevel: string;
  alternativeFormats: AlternativeFormat[];
}

export interface AccessibilityFeature {
  type: string;
  available: boolean;
  description?: string;
}

export interface AlternativeFormat {
  type: string;
  url: string;
  language?: string;
}

export interface License {
  type: string;
  url: string;
  permissions: string[];
  restrictions: string[];
  attribution: string;
}

export interface Permission {
  action: PermissionAction;
  scope: PermissionScope;
  grantedTo: string[];
  conditions?: string[];
}

export enum PermissionAction {
  VIEW = 'view',
  DOWNLOAD = 'download',
  SHARE = 'share',
  MODIFY = 'modify',
  REDISTRIBUTE = 'redistribute',
  COMMERCIAL_USE = 'commercial_use'
}

export enum PermissionScope {
  PUBLIC = 'public',
  COMMUNITY = 'community',
  PARTNER = 'partner',
  INTERNAL = 'internal',
  RESTRICTED = 'restricted'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Dimensions {
  width: number;
  height: number;
}