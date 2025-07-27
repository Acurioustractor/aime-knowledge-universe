/**
 * Visualization and Storytelling Engine for AIME Knowledge Platform
 * 
 * This engine transforms data and insights into compelling visual stories,
 * interactive experiences, and immersive journeys through AIME's wisdom.
 */

import { UnifiedContent } from '../models/unified-content';
import { KnowledgeGraph, GraphNode, GraphEdge } from '../models/knowledge-graph';

// Core Storytelling Engine Interface
export interface StorytellingEngine {
  // Story creation
  createStory(content: StoryContent): Promise<Story>;
  generateNarrative(data: NarrativeData): Promise<Narrative>;
  buildJourney(journey: JourneyConfig): Promise<InteractiveJourney>;
  
  // Visualization generation
  visualizeData(data: VisualizationData): Promise<Visualization>;
  createInfographic(config: InfographicConfig): Promise<Infographic>;
  generateDashboard(metrics: DashboardMetrics): Promise<Dashboard>;
  
  // Interactive experiences
  createExploration(config: ExplorationConfig): Promise<InteractiveExploration>;
  buildTimeline(events: TimelineEvent[]): Promise<InteractiveTimeline>;
  generateMap(data: GeographicData): Promise<InteractiveMap>;
  
  // Immersive experiences
  create3DVisualization(graph: KnowledgeGraph): Promise<Visualization3D>;
  generateVRExperience(config: VRConfig): Promise<VRExperience>;
  buildAROverlay(context: ARContext): Promise<ARExperience>;
  
  // Animation and motion
  animateTransition(from: VisualizationState, to: VisualizationState): Promise<Animation>;
  createDataFlow(pipeline: DataFlowConfig): Promise<FlowAnimation>;
  
  // Export and sharing
  exportVisualization(viz: Visualization, format: ExportFormat): Promise<ExportResult>;
  generateEmbedCode(viz: Visualization): Promise<EmbedConfig>;
}

// Story Types
export interface StoryContent {
  // Core content
  title: string;
  theme: string;
  contents: UnifiedContent[];
  
  // Story elements
  protagonist?: StoryProtagonist;
  setting?: StorySetting;
  conflict?: StoryConflict;
  resolution?: StoryResolution;
  
  // Narrative style
  style: NarrativeStyle;
  tone: NarrativeTone;
  perspective: NarrativePerspective;
  
  // Target audience
  audience: AudienceProfile;
  
  // Customization
  options?: StoryOptions;
}

export interface StoryProtagonist {
  type: 'person' | 'community' | 'idea' | 'practice';
  name: string;
  description: string;
  journey: JourneyPoint[];
  transformation?: Transformation;
}

export interface JourneyPoint {
  stage: string;
  description: string;
  emotion?: string;
  learning?: string;
  challenge?: string;
  support?: string;
}

export interface Transformation {
  from: string;
  to: string;
  catalyst: string;
  evidence: string[];
  impact: string;
}

export interface StorySetting {
  location: string;
  time: string;
  context: string;
  culturalBackground?: string;
  challenges: string[];
  opportunities: string[];
}

export interface StoryConflict {
  type: 'internal' | 'external' | 'systemic';
  description: string;
  stakes: string;
  obstacles: string[];
  attempts: AttemptedSolution[];
}

export interface AttemptedSolution {
  approach: string;
  outcome: string;
  learning: string;
}

export interface StoryResolution {
  outcome: string;
  impact: string;
  lessons: string[];
  callToAction?: string;
  future?: string;
}

export enum NarrativeStyle {
  DOCUMENTARY = 'documentary',
  PERSONAL = 'personal',
  JOURNALISTIC = 'journalistic',
  MYTHOLOGICAL = 'mythological',
  EDUCATIONAL = 'educational',
  INSPIRATIONAL = 'inspirational',
  ANALYTICAL = 'analytical'
}

export enum NarrativeTone {
  HOPEFUL = 'hopeful',
  REFLECTIVE = 'reflective',
  URGENT = 'urgent',
  CELEBRATORY = 'celebratory',
  CONTEMPLATIVE = 'contemplative',
  EMPOWERING = 'empowering',
  CHALLENGING = 'challenging'
}

export enum NarrativePerspective {
  FIRST_PERSON = 'first_person',
  THIRD_PERSON = 'third_person',
  OMNISCIENT = 'omniscient',
  MULTIPLE = 'multiple',
  COLLECTIVE = 'collective'
}

export interface AudienceProfile {
  primaryAudience: AudienceType;
  ageRange?: string;
  culturalContext?: string[];
  expertise?: ExpertiseLevel;
  interests?: string[];
  goals?: string[];
}

export enum AudienceType {
  YOUTH = 'youth',
  EDUCATORS = 'educators',
  POLICYMAKERS = 'policymakers',
  COMMUNITY_LEADERS = 'community_leaders',
  RESEARCHERS = 'researchers',
  GENERAL_PUBLIC = 'general_public',
  FUNDERS = 'funders',
  PRACTITIONERS = 'practitioners'
}

export enum ExpertiseLevel {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface StoryOptions {
  // Length
  targetLength?: 'micro' | 'short' | 'medium' | 'long';
  
  // Media
  includeMedia?: boolean;
  mediaTypes?: MediaType[];
  
  // Interactivity
  interactive?: boolean;
  branches?: StoryBranch[];
  
  // Localization
  languages?: string[];
  culturalAdaptation?: boolean;
  
  // Accessibility
  accessibility?: AccessibilityOptions;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ANIMATION = 'animation',
  INTERACTIVE = 'interactive',
  DATA_VIZ = 'data_viz'
}

export interface StoryBranch {
  decision: string;
  options: BranchOption[];
}

export interface BranchOption {
  choice: string;
  consequence: string;
  nextStage: string;
}

export interface AccessibilityOptions {
  altText: boolean;
  captions: boolean;
  audioDescription: boolean;
  signLanguage?: boolean;
  simplifiedVersion?: boolean;
  highContrast?: boolean;
}

export interface Story {
  id: string;
  
  // Story content
  title: string;
  narrative: StorySegment[];
  
  // Media elements
  media: MediaElement[];
  
  // Metadata
  duration: number;
  wordCount: number;
  readingLevel: string;
  
  // Engagement
  emotionalArc: EmotionalArc;
  keyMoments: KeyMoment[];
  
  // Sharing
  shareableQuotes: Quote[];
  summary: string;
  tags: string[];
  
  // Versions
  versions?: StoryVersion[];
}

export interface StorySegment {
  id: string;
  type: SegmentType;
  content: string;
  
  // Timing
  startTime?: number;
  duration?: number;
  
  // Media
  media?: MediaReference[];
  
  // Styling
  style?: SegmentStyle;
  
  // Interaction
  interactions?: SegmentInteraction[];
}

export enum SegmentType {
  INTRODUCTION = 'introduction',
  CONTEXT = 'context',
  DEVELOPMENT = 'development',
  CLIMAX = 'climax',
  RESOLUTION = 'resolution',
  REFLECTION = 'reflection',
  CALL_TO_ACTION = 'call_to_action'
}

export interface MediaReference {
  mediaId: string;
  placement: 'inline' | 'background' | 'sidebar' | 'fullscreen';
  timing?: MediaTiming;
  effect?: MediaEffect;
}

export interface MediaTiming {
  start: number;
  end?: number;
  transition?: TransitionType;
}

export enum TransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  MORPH = 'morph',
  DISSOLVE = 'dissolve'
}

export interface MediaEffect {
  type: 'parallax' | 'ken_burns' | 'fade' | 'blur' | 'color_shift';
  parameters: Record<string, any>;
}

export interface SegmentStyle {
  typography?: TypographyStyle;
  layout?: LayoutStyle;
  animation?: AnimationStyle;
  mood?: MoodStyle;
}

export interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: string;
}

export interface LayoutStyle {
  columns?: number;
  padding?: string;
  background?: BackgroundStyle;
  foreground?: string;
}

export interface BackgroundStyle {
  type: 'color' | 'gradient' | 'image' | 'video' | 'pattern';
  value: string;
  opacity?: number;
  blur?: number;
}

export interface AnimationStyle {
  entrance?: EntranceAnimation;
  emphasis?: EmphasisAnimation;
  exit?: ExitAnimation;
}

export interface EntranceAnimation {
  type: string;
  duration: number;
  delay?: number;
  easing?: string;
}

export interface EmphasisAnimation {
  type: string;
  trigger: 'time' | 'scroll' | 'hover' | 'click';
  parameters?: Record<string, any>;
}

export interface ExitAnimation {
  type: string;
  duration: number;
  easing?: string;
}

export interface MoodStyle {
  colorPalette: string[];
  lighting: 'bright' | 'soft' | 'dramatic' | 'neutral';
  texture?: string;
  atmosphere?: string;
}

export interface SegmentInteraction {
  type: InteractionType;
  trigger: InteractionTrigger;
  action: InteractionAction;
  feedback?: InteractionFeedback;
}

export enum InteractionType {
  CLICK = 'click',
  HOVER = 'hover',
  SCROLL = 'scroll',
  SWIPE = 'swipe',
  VOICE = 'voice',
  GESTURE = 'gesture'
}

export interface InteractionTrigger {
  element: string;
  condition?: string;
}

export interface InteractionAction {
  type: string;
  target?: string;
  parameters?: Record<string, any>;
}

export interface InteractionFeedback {
  visual?: string;
  audio?: string;
  haptic?: string;
}

export interface MediaElement {
  id: string;
  type: MediaType;
  source: string;
  
  // Metadata
  title?: string;
  description?: string;
  credits?: string;
  license?: string;
  
  // Technical
  format: string;
  dimensions?: Dimensions;
  duration?: number;
  fileSize?: number;
  
  // Accessibility
  altText?: string;
  transcript?: string;
  captions?: Caption[];
}

export interface Dimensions {
  width: number;
  height: number;
  depth?: number; // For 3D
}

export interface Caption {
  language: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface EmotionalArc {
  points: EmotionalPoint[];
  overallTrajectory: 'rising' | 'falling' | 'stable' | 'volatile';
  peakMoment: number;
  resolution: number;
}

export interface EmotionalPoint {
  time: number;
  emotion: string;
  intensity: number;
  trigger?: string;
}

export interface KeyMoment {
  time: number;
  type: 'revelation' | 'turning_point' | 'climax' | 'resolution';
  description: string;
  impact: string;
  mediaId?: string;
}

export interface Quote {
  text: string;
  attribution?: string;
  context?: string;
  shareableImage?: string;
}

export interface StoryVersion {
  versionId: string;
  language?: string;
  audience?: AudienceType;
  length?: string;
  culturalAdaptation?: string;
  created: Date;
}

// Narrative Generation
export interface NarrativeData {
  // Data sources
  contents: UnifiedContent[];
  insights?: Insight[];
  patterns?: Pattern[];
  
  // Narrative focus
  focus: NarrativeFocus;
  angle?: string;
  
  // Structure
  structure: NarrativeStructure;
  
  // Constraints
  constraints?: NarrativeConstraints;
}

export interface Insight {
  type: string;
  description: string;
  evidence: string[];
  significance: number;
}

export interface Pattern {
  type: string;
  description: string;
  instances: string[];
  strength: number;
}

export enum NarrativeFocus {
  TRANSFORMATION = 'transformation',
  IMPACT = 'impact',
  JOURNEY = 'journey',
  DISCOVERY = 'discovery',
  CHALLENGE = 'challenge',
  INNOVATION = 'innovation',
  COMMUNITY = 'community'
}

export enum NarrativeStructure {
  CHRONOLOGICAL = 'chronological',
  THEMATIC = 'thematic',
  SPATIAL = 'spatial',
  COMPARATIVE = 'comparative',
  PROBLEM_SOLUTION = 'problem_solution',
  CAUSE_EFFECT = 'cause_effect',
  CIRCULAR = 'circular'
}

export interface NarrativeConstraints {
  maxLength?: number;
  requiredElements?: string[];
  avoidElements?: string[];
  tone?: NarrativeTone;
  complexity?: ComplexityLevel;
}

export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  NUANCED = 'nuanced'
}

export interface Narrative {
  // Narrative content
  introduction: string;
  body: NarrativeSection[];
  conclusion: string;
  
  // Supporting elements
  evidence: Evidence[];
  visualizations?: VisualizationReference[];
  
  // Metadata
  structure: NarrativeStructure;
  themes: string[];
  messages: string[];
  
  // Engagement
  hooks: NarrativeHook[];
  callsToAction: CallToAction[];
}

export interface NarrativeSection {
  id: string;
  title: string;
  content: string;
  
  // Supporting content
  evidence?: string[];
  examples?: Example[];
  quotes?: Quote[];
  
  // Connections
  transitionFrom?: string;
  transitionTo?: string;
  relatedSections?: string[];
}

export interface Evidence {
  id: string;
  type: 'statistic' | 'quote' | 'example' | 'research' | 'observation';
  content: string;
  source: string;
  credibility: number;
  relevance: number;
}

export interface Example {
  id: string;
  description: string;
  context: string;
  outcome?: string;
  lesson?: string;
  mediaId?: string;
}

export interface VisualizationReference {
  vizId: string;
  placement: string;
  purpose: string;
  caption?: string;
}

export interface NarrativeHook {
  type: 'question' | 'statistic' | 'story' | 'quote' | 'challenge';
  content: string;
  placement: 'opening' | 'section' | 'closing';
  purpose: string;
}

export interface CallToAction {
  action: string;
  urgency: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'challenging';
  impact: string;
  resources?: string[];
}

// Interactive Journeys
export interface JourneyConfig {
  // Journey definition
  title: string;
  description: string;
  type: JourneyType;
  
  // Content
  stages: JourneyStage[];
  paths?: JourneyPath[];
  
  // Interaction
  navigation: NavigationType;
  progression: ProgressionType;
  
  // Personalization
  adaptive?: boolean;
  personalization?: PersonalizationConfig;
  
  // Gamification
  gamification?: GamificationConfig;
}

export enum JourneyType {
  LINEAR = 'linear',
  BRANCHING = 'branching',
  OPEN_WORLD = 'open_world',
  GUIDED = 'guided',
  EXPLORATORY = 'exploratory',
  ADAPTIVE = 'adaptive'
}

export interface JourneyStage {
  id: string;
  title: string;
  description: string;
  
  // Content
  content: StageContent[];
  activities?: Activity[];
  
  // Progress
  objectives: string[];
  completionCriteria: CompletionCriteria;
  
  // Navigation
  next?: string[];
  previous?: string;
  
  // Rewards
  rewards?: Reward[];
}

export interface StageContent {
  type: 'story' | 'video' | 'interactive' | 'assessment' | 'reflection';
  contentId: string;
  required: boolean;
  duration?: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  
  // Interaction
  interaction: ActivityInteraction;
  
  // Completion
  completion: ActivityCompletion;
  
  // Feedback
  feedback: ActivityFeedback;
}

export enum ActivityType {
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
  CREATION = 'creation',
  DISCUSSION = 'discussion',
  PRACTICE = 'practice',
  EXPLORATION = 'exploration',
  CHALLENGE = 'challenge'
}

export interface ActivityInteraction {
  type: string;
  elements: InteractionElement[];
  validation?: ValidationRule[];
}

export interface InteractionElement {
  id: string;
  type: string;
  label?: string;
  options?: any[];
  constraints?: any;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface ActivityCompletion {
  type: 'automatic' | 'manual' | 'assessed';
  criteria: any;
  points?: number;
}

export interface ActivityFeedback {
  immediate: boolean;
  type: 'text' | 'visual' | 'audio' | 'haptic';
  positive: string;
  negative?: string;
  hints?: string[];
}

export interface CompletionCriteria {
  required: string[];
  optional?: string[];
  minScore?: number;
  timeLimit?: number;
}

export interface Reward {
  type: RewardType;
  value: any;
  condition?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export enum RewardType {
  BADGE = 'badge',
  POINTS = 'points',
  UNLOCK = 'unlock',
  CERTIFICATE = 'certificate',
  CONTENT = 'content',
  FEATURE = 'feature',
  RECOGNITION = 'recognition'
}

export interface JourneyPath {
  id: string;
  name: string;
  description: string;
  stages: string[];
  conditions?: PathCondition[];
  benefits?: string[];
}

export interface PathCondition {
  type: 'prerequisite' | 'choice' | 'performance' | 'time';
  value: any;
}

export enum NavigationType {
  SEQUENTIAL = 'sequential',
  FREE_ROAM = 'free_roam',
  GUIDED_CHOICE = 'guided_choice',
  ADAPTIVE = 'adaptive',
  TIME_BASED = 'time_based'
}

export enum ProgressionType {
  LINEAR = 'linear',
  MILESTONE = 'milestone',
  COMPETENCY = 'competency',
  EXPLORATORY = 'exploratory',
  MASTERY = 'mastery'
}

export interface PersonalizationConfig {
  // Adaptation
  adaptTo: AdaptationFactor[];
  
  // Difficulty
  dynamicDifficulty: boolean;
  difficultyRange: [number, number];
  
  // Content
  contentSelection: ContentSelectionStrategy;
  
  // Pacing
  pacingStrategy: PacingStrategy;
}

export enum AdaptationFactor {
  PERFORMANCE = 'performance',
  PREFERENCES = 'preferences',
  LEARNING_STYLE = 'learning_style',
  TIME_AVAILABLE = 'time_available',
  GOALS = 'goals',
  CONTEXT = 'context'
}

export enum ContentSelectionStrategy {
  RANDOM = 'random',
  SEQUENTIAL = 'sequential',
  ADAPTIVE = 'adaptive',
  PREFERENCE_BASED = 'preference_based',
  PERFORMANCE_BASED = 'performance_based'
}

export enum PacingStrategy {
  SELF_PACED = 'self_paced',
  TIME_BOXED = 'time_boxed',
  MILESTONE_BASED = 'milestone_based',
  ADAPTIVE = 'adaptive'
}

export interface GamificationConfig {
  // Points system
  pointsSystem: PointsSystem;
  
  // Achievements
  achievements: Achievement[];
  
  // Leaderboards
  leaderboards?: LeaderboardConfig[];
  
  // Challenges
  challenges?: Challenge[];
  
  // Social
  social?: SocialFeatures;
}

export interface PointsSystem {
  currency: string;
  actions: PointAction[];
  multipliers?: Multiplier[];
  decay?: DecayRule;
}

export interface PointAction {
  action: string;
  points: number;
  limit?: number;
  cooldown?: number;
}

export interface Multiplier {
  condition: string;
  factor: number;
  duration?: number;
}

export interface DecayRule {
  rate: number;
  period: number;
  minimum: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  
  // Criteria
  criteria: AchievementCriteria;
  
  // Reward
  reward: Reward;
  
  // Display
  icon: string;
  rarity: string;
  category?: string;
}

export interface AchievementCriteria {
  type: string;
  target: any;
  progress?: boolean;
}

export interface LeaderboardConfig {
  id: string;
  name: string;
  metric: string;
  
  // Scope
  scope: 'global' | 'regional' | 'group' | 'friends';
  
  // Time
  timeframe: 'all_time' | 'monthly' | 'weekly' | 'daily';
  
  // Display
  size: number;
  showUser: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  
  // Challenge details
  type: ChallengeType;
  difficulty: string;
  duration?: number;
  
  // Requirements
  requirements: string[];
  
  // Rewards
  rewards: Reward[];
  
  // Participation
  solo: boolean;
  team?: TeamConfig;
}

export enum ChallengeType {
  SPEED = 'speed',
  ACCURACY = 'accuracy',
  CREATIVITY = 'creativity',
  ENDURANCE = 'endurance',
  COLLABORATION = 'collaboration',
  KNOWLEDGE = 'knowledge'
}

export interface TeamConfig {
  minSize: number;
  maxSize: number;
  formation: 'random' | 'choice' | 'skill_based';
}

export interface SocialFeatures {
  sharing: boolean;
  collaboration: boolean;
  competition: boolean;
  mentoring: boolean;
  
  features: SocialFeature[];
}

export interface SocialFeature {
  type: string;
  enabled: boolean;
  config?: any;
}

export interface InteractiveJourney {
  id: string;
  
  // Journey structure
  config: JourneyConfig;
  stages: Map<string, ExpandedStage>;
  
  // State management
  state: JourneyState;
  
  // Analytics
  analytics: JourneyAnalytics;
  
  // API
  api: JourneyAPI;
}

export interface ExpandedStage extends JourneyStage {
  // Additional runtime properties
  status: StageStatus;
  progress: number;
  startTime?: Date;
  completionTime?: Date;
  attempts: number;
  score?: number;
}

export enum StageStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

export interface JourneyState {
  currentStage: string;
  visitedStages: string[];
  completedStages: string[];
  
  // Progress
  overallProgress: number;
  points: number;
  achievements: string[];
  
  // User data
  responses: Map<string, any>;
  preferences: any;
  
  // Session
  startTime: Date;
  lastActivity: Date;
  totalTime: number;
}

export interface JourneyAnalytics {
  // Engagement
  engagement: EngagementMetrics;
  
  // Performance
  performance: PerformanceMetrics;
  
  // Behavior
  behavior: BehaviorMetrics;
  
  // Outcomes
  outcomes: OutcomeMetrics;
}

export interface EngagementMetrics {
  totalTime: number;
  avgSessionTime: number;
  completionRate: number;
  dropoffPoints: DropoffPoint[];
  interactionRate: number;
}

export interface DropoffPoint {
  stageId: string;
  count: number;
  avgProgress: number;
  reasons?: string[];
}

export interface PerformanceMetrics {
  avgScore: number;
  successRate: number;
  avgAttempts: number;
  timeToCompletion: number;
  strugglingAreas: string[];
}

export interface BehaviorMetrics {
  pathsTaken: PathAnalysis[];
  navigationPattern: string;
  contentPreferences: any;
  interactionPatterns: any;
}

export interface PathAnalysis {
  path: string[];
  count: number;
  avgTime: number;
  successRate: number;
}

export interface OutcomeMetrics {
  learningObjectivesMet: number;
  skillsAcquired: string[];
  behaviorChanges?: string[];
  satisfaction?: number;
  retention?: number;
}

export interface JourneyAPI {
  // Navigation
  navigate(stageId: string): Promise<void>;
  canNavigate(stageId: string): boolean;
  
  // Progress
  completeActivity(activityId: string, response: any): Promise<void>;
  skipStage(stageId: string): Promise<void>;
  
  // State
  saveProgress(): Promise<void>;
  loadProgress(saveId: string): Promise<void>;
  
  // Analytics
  trackEvent(event: JourneyEvent): Promise<void>;
  getProgress(): ProgressReport;
}

export interface JourneyEvent {
  type: string;
  timestamp: Date;
  data: any;
  context?: any;
}

export interface ProgressReport {
  overall: number;
  byStage: Map<string, number>;
  achievements: string[];
  nextSteps: string[];
  estimatedCompletion?: Date;
}

// Data Visualization
export interface VisualizationData {
  // Data source
  type: DataType;
  data: any;
  
  // Visualization type
  vizType: VisualizationType;
  
  // Configuration
  config: VisualizationConfig;
  
  // Interactivity
  interactive?: boolean;
  interactions?: VizInteraction[];
}

export enum DataType {
  NUMERIC = 'numeric',
  CATEGORICAL = 'categorical',
  TEMPORAL = 'temporal',
  GEOGRAPHIC = 'geographic',
  NETWORK = 'network',
  HIERARCHICAL = 'hierarchical',
  MULTIDIMENSIONAL = 'multidimensional'
}

export enum VisualizationType {
  // Basic charts
  BAR = 'bar',
  LINE = 'line',
  AREA = 'area',
  PIE = 'pie',
  SCATTER = 'scatter',
  
  // Advanced charts
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  SUNBURST = 'sunburst',
  SANKEY = 'sankey',
  CHORD = 'chord',
  
  // Geographic
  MAP = 'map',
  CHOROPLETH = 'choropleth',
  FLOW_MAP = 'flow_map',
  
  // Network
  FORCE_GRAPH = 'force_graph',
  TREE = 'tree',
  RADIAL = 'radial',
  
  // Special
  TIMELINE = 'timeline',
  CALENDAR = 'calendar',
  WORD_CLOUD = 'word_cloud',
  STREAM = 'stream'
}

export interface VisualizationConfig {
  // Dimensions
  width?: number;
  height?: number;
  margin?: Margin;
  
  // Scales
  scales?: ScaleConfig[];
  
  // Axes
  axes?: AxisConfig[];
  
  // Colors
  colorScheme?: ColorScheme;
  
  // Labels
  labels?: LabelConfig;
  
  // Legend
  legend?: LegendConfig;
  
  // Tooltips
  tooltips?: TooltipConfig;
  
  // Animation
  animation?: AnimationConfig;
  
  // Responsive
  responsive?: boolean;
  breakpoints?: Breakpoint[];
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ScaleConfig {
  dimension: 'x' | 'y' | 'color' | 'size' | 'shape';
  type: 'linear' | 'log' | 'ordinal' | 'time' | 'band';
  domain?: any[];
  range?: any[];
  nice?: boolean;
  clamp?: boolean;
}

export interface AxisConfig {
  dimension: 'x' | 'y';
  label?: string;
  ticks?: number;
  tickFormat?: string;
  gridLines?: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

export interface ColorScheme {
  type: 'sequential' | 'diverging' | 'categorical' | 'custom';
  scheme?: string;
  colors?: string[];
  domain?: any[];
  nullColor?: string;
}

export interface LabelConfig {
  show: boolean;
  field?: string;
  format?: string;
  position?: string;
  style?: TextStyle;
}

export interface TextStyle {
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  background?: string;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  orientation: 'horizontal' | 'vertical';
  title?: string;
  interactive?: boolean;
}

export interface TooltipConfig {
  show: boolean;
  fields: TooltipField[];
  format?: string;
  style?: TooltipStyle;
}

export interface TooltipField {
  field: string;
  label?: string;
  format?: string;
}

export interface TooltipStyle {
  background?: string;
  border?: string;
  padding?: string;
  fontSize?: string;
  color?: string;
}

export interface AnimationConfig {
  enabled: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  onEnter?: boolean;
  onUpdate?: boolean;
  onExit?: boolean;
}

export interface Breakpoint {
  width: number;
  config: Partial<VisualizationConfig>;
}

export interface VizInteraction {
  type: 'hover' | 'click' | 'brush' | 'zoom' | 'pan' | 'select';
  target: string;
  action: VizAction;
}

export interface VizAction {
  type: 'highlight' | 'filter' | 'drilldown' | 'details' | 'navigate';
  parameters?: any;
}

export interface Visualization {
  id: string;
  type: VisualizationType;
  
  // Rendered output
  element: any; // DOM element or canvas
  
  // Data binding
  data: any;
  
  // Configuration
  config: VisualizationConfig;
  
  // State
  state: VizState;
  
  // API
  api: VizAPI;
}

export interface VizState {
  selection?: any[];
  filters?: any[];
  zoom?: ZoomState;
  highlighted?: any[];
  activeInteraction?: string;
}

export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface VizAPI {
  // Data updates
  updateData(data: any): void;
  appendData(data: any): void;
  
  // Configuration
  updateConfig(config: Partial<VisualizationConfig>): void;
  
  // Interaction
  highlight(items: any[]): void;
  select(items: any[]): void;
  filter(criteria: any): void;
  reset(): void;
  
  // Export
  toSVG(): string;
  toPNG(): Promise<Blob>;
  toData(): any;
}

// Infographics
export interface InfographicConfig {
  // Content
  title: string;
  subtitle?: string;
  sections: InfographicSection[];
  
  // Design
  template?: InfographicTemplate;
  style: InfographicStyle;
  
  // Layout
  layout: LayoutConfig;
  
  // Branding
  branding?: BrandingConfig;
}

export interface InfographicSection {
  id: string;
  type: SectionType;
  content: SectionContent;
  
  // Layout
  position?: Position;
  size?: Size;
  
  // Styling
  style?: SectionStyle;
}

export enum SectionType {
  HEADER = 'header',
  STAT = 'stat',
  CHART = 'chart',
  TIMELINE = 'timeline',
  COMPARISON = 'comparison',
  PROCESS = 'process',
  QUOTE = 'quote',
  ICON_GRID = 'icon_grid',
  MAP = 'map',
  FOOTER = 'footer'
}

export interface SectionContent {
  // Text content
  text?: string;
  subtext?: string;
  
  // Data content
  data?: any;
  
  // Visual content
  icon?: string;
  image?: string;
  chart?: VisualizationConfig;
  
  // Structured content
  items?: ContentItem[];
}

export interface ContentItem {
  label: string;
  value?: any;
  icon?: string;
  color?: string;
  description?: string;
}

export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface SectionStyle {
  background?: string;
  border?: string;
  padding?: string;
  shadow?: string;
  opacity?: number;
}

export enum InfographicTemplate {
  STATISTICAL = 'statistical',
  TIMELINE = 'timeline',
  PROCESS = 'process',
  COMPARISON = 'comparison',
  HIERARCHICAL = 'hierarchical',
  GEOGRAPHIC = 'geographic',
  LIST = 'list',
  MIXED = 'mixed'
}

export interface InfographicStyle {
  colorPalette: string[];
  typography: TypographyConfig;
  iconStyle: IconStyle;
  decorativeElements?: DecorativeElement[];
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  
  scale: number[];
  lineHeight: number;
  
  headingStyle?: TextStyle;
  bodyStyle?: TextStyle;
  accentStyle?: TextStyle;
}

export interface IconStyle {
  type: 'line' | 'filled' | 'duotone' | 'custom';
  size: number;
  strokeWidth?: number;
  cornerRadius?: number;
}

export interface DecorativeElement {
  type: 'shape' | 'pattern' | 'illustration';
  position: Position;
  properties: any;
}

export interface LayoutConfig {
  type: LayoutType;
  grid?: GridConfig;
  flow?: FlowConfig;
  custom?: CustomLayout;
}

export enum LayoutType {
  GRID = 'grid',
  FLOW = 'flow',
  MASONRY = 'masonry',
  RADIAL = 'radial',
  CUSTOM = 'custom'
}

export interface GridConfig {
  columns: number;
  rows?: number;
  gap: number;
  alignment: string;
}

export interface FlowConfig {
  direction: 'horizontal' | 'vertical';
  wrap: boolean;
  justify: string;
  align: string;
}

export interface CustomLayout {
  positions: Map<string, Position>;
  connections?: Connection[];
}

export interface Connection {
  from: string;
  to: string;
  type: 'line' | 'curve' | 'arrow';
  style?: any;
}

export interface BrandingConfig {
  logo?: string;
  colors: BrandColors;
  fonts?: BrandFonts;
  watermark?: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
  neutral: string[];
}

export interface BrandFonts {
  primary: string;
  secondary?: string;
  fallback: string;
}

export interface Infographic {
  id: string;
  
  // Rendered output
  canvas: any; // Canvas or SVG element
  
  // Sections
  sections: Map<string, RenderedSection>;
  
  // Metadata
  dimensions: Dimensions;
  fileSize?: number;
  
  // Export options
  exportFormats: ExportFormat[];
}

export interface RenderedSection {
  section: InfographicSection;
  element: any;
  bounds: Bounds;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Dashboards
export interface DashboardMetrics {
  // Metric definitions
  metrics: MetricDefinition[];
  
  // Data sources
  dataSources: DataSource[];
  
  // Time range
  timeRange: TimeRange;
  
  // Filters
  filters?: DashboardFilter[];
  
  // Layout
  layout?: DashboardLayout;
  
  // Theme
  theme?: DashboardTheme;
}

export interface MetricDefinition {
  id: string;
  name: string;
  description?: string;
  
  // Calculation
  type: MetricType;
  calculation: MetricCalculation;
  
  // Display
  display: MetricDisplay;
  
  // Targets
  target?: number;
  thresholds?: Threshold[];
  
  // Drill-down
  drillDown?: DrillDownConfig;
}

export enum MetricType {
  SCALAR = 'scalar',
  TREND = 'trend',
  DISTRIBUTION = 'distribution',
  COMPARISON = 'comparison',
  COMPOSITION = 'composition',
  RELATIONSHIP = 'relationship'
}

export interface MetricCalculation {
  field: string;
  aggregation: AggregationType;
  filters?: any[];
  groupBy?: string[];
  window?: TimeWindow;
}

export enum AggregationType {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  PERCENTILE = 'percentile',
  STDDEV = 'stddev',
  DISTINCT = 'distinct'
}

export interface TimeWindow {
  size: number;
  unit: TimeUnit;
  offset?: number;
}

export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export interface MetricDisplay {
  type: DisplayType;
  format?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sparkline?: boolean;
  comparison?: ComparisonConfig;
}

export enum DisplayType {
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  DURATION = 'duration',
  BYTES = 'bytes',
  CUSTOM = 'custom'
}

export interface ComparisonConfig {
  type: 'previous_period' | 'year_over_year' | 'target' | 'average';
  format: 'percentage' | 'absolute' | 'ratio';
  direction: 'positive_good' | 'negative_good' | 'neutral';
}

export interface Threshold {
  value: number;
  color: string;
  label?: string;
  alert?: AlertConfig;
}

export interface AlertConfig {
  enabled: boolean;
  channels: string[];
  message: string;
  cooldown?: number;
}

export interface DrillDownConfig {
  levels: DrillDownLevel[];
  defaultLevel?: number;
}

export interface DrillDownLevel {
  field: string;
  label: string;
  visualization?: VisualizationType;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  
  // Connection
  connection: DataConnection;
  
  // Query
  query?: DataQuery;
  
  // Refresh
  refresh?: RefreshConfig;
  
  // Cache
  cache?: CacheConfig;
}

export enum DataSourceType {
  API = 'api',
  DATABASE = 'database',
  FILE = 'file',
  STREAM = 'stream',
  COMPUTED = 'computed'
}

export interface DataConnection {
  url?: string;
  credentials?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface DataQuery {
  type: 'sql' | 'graphql' | 'rest' | 'custom';
  query: string;
  parameters?: Record<string, any>;
}

export interface RefreshConfig {
  interval: number;
  strategy: 'replace' | 'append' | 'merge';
  maxRetries?: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  strategy: 'memory' | 'disk' | 'hybrid';
  maxSize?: number;
}

export interface TimeRange {
  type: TimeRangeType;
  value?: any;
  
  // Custom range
  start?: Date;
  end?: Date;
  
  // Relative range
  duration?: number;
  unit?: TimeUnit;
  
  // Comparison
  compare?: boolean;
  compareType?: ComparisonType;
}

export enum TimeRangeType {
  FIXED = 'fixed',
  RELATIVE = 'relative',
  ROLLING = 'rolling',
  CUSTOM = 'custom'
}

export enum ComparisonType {
  PREVIOUS_PERIOD = 'previous_period',
  SAME_PERIOD_LAST_YEAR = 'same_period_last_year',
  CUSTOM = 'custom'
}

export interface DashboardFilter {
  id: string;
  field: string;
  label: string;
  
  // Filter type
  type: FilterType;
  
  // Options
  options?: FilterOption[];
  
  // Default
  defaultValue?: any;
  
  // Behavior
  multiSelect?: boolean;
  searchable?: boolean;
  hierarchical?: boolean;
}

export enum FilterType {
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RANGE = 'range',
  DATE_RANGE = 'date_range',
  SEARCH = 'search',
  TOGGLE = 'toggle'
}

export interface FilterOption {
  value: any;
  label: string;
  count?: number;
  children?: FilterOption[];
}

export interface DashboardLayout {
  type: 'grid' | 'flow' | 'tabs' | 'custom';
  
  // Grid layout
  grid?: DashboardGrid;
  
  // Flow layout
  flow?: DashboardFlow;
  
  // Tab layout
  tabs?: DashboardTab[];
  
  // Custom layout
  custom?: any;
}

export interface DashboardGrid {
  columns: number;
  rows?: number;
  gap: number;
  
  // Responsive
  breakpoints?: GridBreakpoint[];
}

export interface GridBreakpoint {
  width: number;
  columns: number;
}

export interface DashboardFlow {
  direction: 'horizontal' | 'vertical';
  wrap: boolean;
  sections: FlowSection[];
}

export interface FlowSection {
  id: string;
  width?: string;
  height?: string;
  widgets: string[];
}

export interface DashboardTab {
  id: string;
  label: string;
  icon?: string;
  widgets: string[];
  layout?: DashboardLayout;
}

export interface DashboardTheme {
  // Colors
  colors: ThemeColors;
  
  // Typography
  typography: ThemeTypography;
  
  // Spacing
  spacing: ThemeSpacing;
  
  // Components
  components: ComponentTheme;
  
  // Mode
  mode: 'light' | 'dark' | 'auto';
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  background: string;
  surface: string;
  text: string;
  
  chart: string[];
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
}

export interface ThemeSpacing {
  unit: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export interface ComponentTheme {
  card: CardTheme;
  chart: ChartTheme;
  table: TableTheme;
  // ... other components
}

export interface CardTheme {
  background: string;
  border: string;
  shadow: string;
  radius: string;
  padding: string;
}

export interface ChartTheme {
  background: string;
  gridColor: string;
  axisColor: string;
  fontFamily: string;
  fontSize: string;
}

export interface TableTheme {
  headerBackground: string;
  rowBackground: string;
  alternateRowBackground: string;
  borderColor: string;
  hoverColor: string;
}

export interface Dashboard {
  id: string;
  
  // Widgets
  widgets: Map<string, DashboardWidget>;
  
  // Layout
  layout: RenderedLayout;
  
  // State
  state: DashboardState;
  
  // API
  api: DashboardAPI;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  
  // Content
  metric?: MetricDefinition;
  visualization?: Visualization;
  content?: any;
  
  // Position
  position: WidgetPosition;
  
  // Interactivity
  interactive: boolean;
  actions?: WidgetAction[];
}

export enum WidgetType {
  METRIC = 'metric',
  CHART = 'chart',
  TABLE = 'table',
  MAP = 'map',
  TEXT = 'text',
  IMAGE = 'image',
  EMBED = 'embed'
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  layer?: number;
}

export interface WidgetAction {
  type: 'filter' | 'drilldown' | 'export' | 'share' | 'fullscreen';
  label: string;
  icon?: string;
  handler: () => void;
}

export interface RenderedLayout {
  container: any;
  dimensions: Dimensions;
  responsive: boolean;
}

export interface DashboardState {
  // Filters
  activeFilters: Map<string, any>;
  
  // Time
  timeRange: TimeRange;
  
  // Selection
  selectedWidgets: string[];
  highlightedData: any[];
  
  // View
  viewMode: 'view' | 'edit' | 'present';
  fullscreenWidget?: string;
}

export interface DashboardAPI {
  // Widget management
  addWidget(widget: DashboardWidget): void;
  removeWidget(widgetId: string): void;
  updateWidget(widgetId: string, updates: Partial<DashboardWidget>): void;
  
  // Filtering
  applyFilter(filterId: string, value: any): void;
  clearFilter(filterId: string): void;
  clearAllFilters(): void;
  
  // Time range
  setTimeRange(range: TimeRange): void;
  
  // Refresh
  refresh(): Promise<void>;
  refreshWidget(widgetId: string): Promise<void>;
  
  // Export
  exportDashboard(format: ExportFormat): Promise<Blob>;
  exportWidget(widgetId: string, format: ExportFormat): Promise<Blob>;
  
  // Sharing
  getShareUrl(): string;
  getEmbedCode(): string;
}

// Interactive Experiences
export interface ExplorationConfig {
  // Content
  title: string;
  description: string;
  content: KnowledgeGraph;
  
  // Exploration type
  type: ExplorationType;
  
  // Starting point
  startNode?: string;
  startView?: ViewConfig;
  
  // Interaction
  interactions: ExplorationInteraction[];
  
  // Guidance
  guidance?: GuidanceConfig;
  
  // Rewards
  discoveries?: DiscoveryReward[];
}

export enum ExplorationType {
  FREE_EXPLORE = 'free_explore',
  GUIDED_TOUR = 'guided_tour',
  TREASURE_HUNT = 'treasure_hunt',
  MYSTERY = 'mystery',
  COLLABORATIVE = 'collaborative'
}

export interface ViewConfig {
  center?: Position;
  zoom?: number;
  rotation?: number;
  perspective?: string;
}

export interface ExplorationInteraction {
  type: 'navigate' | 'inspect' | 'collect' | 'annotate' | 'connect';
  target: 'node' | 'edge' | 'cluster' | 'region';
  action: string;
  feedback?: string;
}

export interface GuidanceConfig {
  type: 'hints' | 'breadcrumbs' | 'narrator' | 'companion';
  level: 'minimal' | 'balanced' | 'detailed';
  triggers: GuidanceTrigger[];
}

export interface GuidanceTrigger {
  condition: string;
  message: string;
  action?: string;
}

export interface DiscoveryReward {
  id: string;
  type: 'knowledge' | 'insight' | 'connection' | 'perspective';
  condition: string;
  reward: any;
  celebration?: CelebrationConfig;
}

export interface CelebrationConfig {
  type: 'animation' | 'sound' | 'message' | 'unlock';
  content: any;
  duration?: number;
}

export interface InteractiveExploration {
  id: string;
  
  // Exploration space
  space: ExplorationSpace;
  
  // User state
  userState: ExplorationState;
  
  // Discovery log
  discoveries: Discovery[];
  
  // API
  api: ExplorationAPI;
}

export interface ExplorationSpace {
  graph: KnowledgeGraph;
  regions: ExplorationRegion[];
  landmarks: Landmark[];
  paths: ExplorationPath[];
}

export interface ExplorationRegion {
  id: string;
  name: string;
  nodes: string[];
  theme?: string;
  difficulty?: number;
  locked?: boolean;
}

export interface Landmark {
  id: string;
  nodeId: string;
  type: 'hub' | 'gateway' | 'treasure' | 'viewpoint';
  importance: number;
  discovered: boolean;
}

export interface ExplorationPath {
  id: string;
  name: string;
  nodes: string[];
  type: 'main' | 'secret' | 'shortcut';
  unlocked: boolean;
}

export interface ExplorationState {
  currentNode: string;
  visitedNodes: Set<string>;
  collectedItems: string[];
  unlockedRegions: Set<string>;
  activeQuests?: Quest[];
  
  // Stats
  explorationTime: number;
  nodesVisited: number;
  edgesTraversed: number;
  discoveriesMode: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  reward: any;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'visit' | 'find' | 'connect' | 'collect';
  target: any;
  completed: boolean;
}

export interface Discovery {
  id: string;
  timestamp: Date;
  type: string;
  nodeId: string;
  significance: number;
  description: string;
  unlocked?: string[];
}

export interface ExplorationAPI {
  // Navigation
  moveTo(nodeId: string): Promise<void>;
  followEdge(edgeId: string): Promise<void>;
  teleportTo(nodeId: string): Promise<void>;
  
  // Interaction
  inspectNode(nodeId: string): NodeInfo;
  collectItem(itemId: string): Promise<void>;
  unlockRegion(regionId: string): Promise<void>;
  
  // Discovery
  markDiscovery(discovery: Discovery): void;
  getHint(): string;
  revealPath(pathId: string): void;
  
  // State
  saveExploration(): Promise<string>;
  loadExploration(saveId: string): Promise<void>;
}

export interface NodeInfo {
  node: GraphNode;
  connections: GraphEdge[];
  content?: UnifiedContent;
  secrets?: string[];
  actions: NodeAction[];
}

export interface NodeAction {
  id: string;
  label: string;
  type: string;
  enabled: boolean;
  result?: string;
}

// Timelines
export interface TimelineEvent {
  id: string;
  date: Date;
  endDate?: Date;
  
  // Content
  title: string;
  description: string;
  category?: string;
  
  // Media
  media?: MediaElement[];
  
  // Significance
  importance: number;
  impact?: string;
  
  // Connections
  related?: string[];
  tags?: string[];
}

export interface InteractiveTimeline {
  id: string;
  
  // Timeline data
  events: TimelineEvent[];
  periods?: TimePeriod[];
  
  // Visualization
  view: TimelineView;
  
  // Interaction
  controls: TimelineControls;
  
  // State
  state: TimelineState;
  
  // API
  api: TimelineAPI;
}

export interface TimePeriod {
  id: string;
  name: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
  pattern?: string;
}

export interface TimelineView {
  type: 'linear' | 'spiral' | 'radial' | 'calendar' | '3d';
  scale: TimeScale;
  range: DateRange;
  style: TimelineStyle;
}

export interface TimeScale {
  unit: TimeUnit;
  tickInterval: number;
  minZoom: number;
  maxZoom: number;
}

export interface TimelineStyle {
  theme: string;
  eventDisplay: 'dots' | 'bars' | 'cards' | 'mixed';
  connectionDisplay: 'lines' | 'arcs' | 'none';
  periodDisplay: 'bands' | 'gradients' | 'none';
}

export interface TimelineControls {
  play: boolean;
  speed: number;
  zoom: boolean;
  pan: boolean;
  filter: boolean;
  search: boolean;
}

export interface TimelineState {
  currentTime?: Date;
  selectedEvent?: string;
  visibleRange: DateRange;
  filters: TimelineFilter[];
  playbackState?: PlaybackState;
}

export interface TimelineFilter {
  field: string;
  values: any[];
  active: boolean;
}

export interface PlaybackState {
  playing: boolean;
  speed: number;
  direction: 'forward' | 'backward';
  loop: boolean;
}

export interface TimelineAPI {
  // Navigation
  goToDate(date: Date): void;
  goToEvent(eventId: string): void;
  zoomTo(range: DateRange): void;
  
  // Playback
  play(): void;
  pause(): void;
  setSpeed(speed: number): void;
  
  // Filtering
  filterByCategory(category: string): void;
  filterByImportance(min: number): void;
  search(query: string): TimelineEvent[];
  
  // Interaction
  selectEvent(eventId: string): void;
  getEventDetails(eventId: string): EventDetails;
  
  // Export
  exportTimeline(format: ExportFormat): Promise<Blob>;
}

export interface EventDetails {
  event: TimelineEvent;
  context: EventContext;
  connections: EventConnection[];
  media: MediaElement[];
}

export interface EventContext {
  period?: TimePeriod;
  precedingEvents: TimelineEvent[];
  followingEvents: TimelineEvent[];
  simultaneousEvents: TimelineEvent[];
}

export interface EventConnection {
  toEvent: string;
  type: 'causes' | 'influences' | 'relates' | 'contradicts';
  strength: number;
  description?: string;
}

// Geographic Maps
export interface GeographicData {
  // Location data
  locations: MapLocation[];
  
  // Regions
  regions?: MapRegion[];
  
  // Flows
  flows?: MapFlow[];
  
  // Layers
  layers?: MapLayer[];
}

export interface MapLocation {
  id: string;
  coordinates: Coordinates;
  
  // Content
  name: string;
  description?: string;
  category?: string;
  
  // Data
  value?: number;
  metadata?: any;
  
  // Display
  icon?: string;
  color?: string;
  size?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
  alt?: number;
}

export interface MapRegion {
  id: string;
  name: string;
  geometry: any; // GeoJSON
  data?: any;
  style?: RegionStyle;
}

export interface RegionStyle {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  pattern?: string;
}

export interface MapFlow {
  id: string;
  from: string;
  to: string;
  value: number;
  type?: string;
  style?: FlowStyle;
}

export interface FlowStyle {
  color?: string;
  width?: number;
  opacity?: number;
  animation?: 'none' | 'flow' | 'pulse';
  curvature?: number;
}

export interface MapLayer {
  id: string;
  name: string;
  type: LayerType;
  data: any;
  visible: boolean;
  opacity?: number;
  style?: any;
}

export enum LayerType {
  TILE = 'tile',
  VECTOR = 'vector',
  HEATMAP = 'heatmap',
  CLUSTER = 'cluster',
  CUSTOM = 'custom'
}

export interface InteractiveMap {
  id: string;
  
  // Map instance
  map: any; // Mapbox/Leaflet instance
  
  // Data
  data: GeographicData;
  
  // Controls
  controls: MapControls;
  
  // State
  state: MapState;
  
  // API
  api: MapAPI;
}

export interface MapControls {
  zoom: boolean;
  pan: boolean;
  rotate: boolean;
  pitch: boolean;
  fullscreen: boolean;
  layers: boolean;
  search: boolean;
  measure: boolean;
}

export interface MapState {
  center: Coordinates;
  zoom: number;
  bearing?: number;
  pitch?: number;
  bounds?: MapBounds;
  
  selectedLocation?: string;
  highlightedRegion?: string;
  visibleLayers: Set<string>;
  
  filters: MapFilter[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapFilter {
  layer: string;
  field: string;
  values: any[];
}

export interface MapAPI {
  // Navigation
  flyTo(location: Coordinates, zoom?: number): void;
  fitBounds(bounds: MapBounds): void;
  setView(view: MapView): void;
  
  // Data
  addLocation(location: MapLocation): void;
  updateLocation(id: string, updates: Partial<MapLocation>): void;
  removeLocation(id: string): void;
  
  // Layers
  showLayer(layerId: string): void;
  hideLayer(layerId: string): void;
  setLayerOpacity(layerId: string, opacity: number): void;
  
  // Interaction
  selectLocation(id: string): void;
  highlightRegion(id: string): void;
  showPopup(location: Coordinates, content: string): void;
  
  // Analysis
  measureDistance(from: Coordinates, to: Coordinates): number;
  calculateArea(region: MapRegion): number;
  findNearby(location: Coordinates, radius: number): MapLocation[];
  
  // Export
  exportMap(format: 'png' | 'pdf' | 'svg'): Promise<Blob>;
}

export interface MapView {
  center: Coordinates;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

// 3D Visualizations
export interface Visualization3D {
  id: string;
  
  // 3D scene
  scene: any; // Three.js scene
  camera: any; // Three.js camera
  renderer: any; // Three.js renderer
  
  // Content
  objects: Map<string, any>;
  
  // Interaction
  controls: any; // OrbitControls etc
  raycaster: any; // For picking
  
  // Animation
  animations: Animation3D[];
  
  // API
  api: Viz3DAPI;
}

export interface Animation3D {
  id: string;
  target: any;
  property: string;
  from: any;
  to: any;
  duration: number;
  easing: string;
  loop?: boolean;
}

export interface Viz3DAPI {
  // Object management
  addObject(object: any, id: string): void;
  removeObject(id: string): void;
  updateObject(id: string, updates: any): void;
  
  // Camera
  setCameraPosition(position: any): void;
  lookAt(target: any): void;
  animateCamera(to: any, duration: number): void;
  
  // Interaction
  enablePicking(callback: (object: any) => void): void;
  highlight(objectId: string): void;
  focus(objectId: string): void;
  
  // Animation
  animate(animation: Animation3D): void;
  stopAnimation(id: string): void;
  
  // Rendering
  render(): void;
  resize(width: number, height: number): void;
  screenshot(): Promise<Blob>;
}

// VR/AR Experiences
export interface VRConfig {
  // Scene setup
  environment: VREnvironment;
  content: VRContent[];
  
  // Interaction
  interactions: VRInteraction[];
  locomotion: LocomotionConfig;
  
  // UI
  ui: VRUI;
  
  // Performance
  performance: PerformanceConfig;
}

export interface VREnvironment {
  type: 'skybox' | 'room' | 'landscape' | 'abstract';
  assets: EnvironmentAsset[];
  lighting: LightingConfig;
  audio?: SpatialAudio[];
}

export interface EnvironmentAsset {
  type: 'mesh' | 'texture' | 'skybox';
  source: string;
  position?: any;
  scale?: any;
  material?: any;
}

export interface LightingConfig {
  ambient: any;
  directional?: any[];
  point?: any[];
  fog?: any;
}

export interface SpatialAudio {
  source: string;
  position: any;
  volume: number;
  loop?: boolean;
  spatial: boolean;
}

export interface VRContent {
  id: string;
  type: 'model' | 'text' | 'image' | 'video' | 'portal';
  source: string;
  position: any;
  rotation?: any;
  scale?: any;
  
  // Interaction
  interactive?: boolean;
  actions?: VRAction[];
  
  // Animation
  animation?: any;
}

export interface VRAction {
  trigger: 'gaze' | 'click' | 'proximity' | 'gesture';
  action: string;
  parameters?: any;
}

export interface VRInteraction {
  type: 'raycast' | 'grab' | 'teleport' | 'ui';
  hand: 'left' | 'right' | 'both';
  button?: string;
  hapticFeedback?: HapticConfig;
}

export interface HapticConfig {
  duration: number;
  frequency: number;
  amplitude: number;
}

export interface LocomotionConfig {
  type: 'teleport' | 'smooth' | 'room_scale' | 'flying';
  speed?: number;
  constraints?: any;
}

export interface VRUI {
  menu: VRMenu;
  hud?: VRHUD;
  tooltips?: boolean;
  notifications?: VRNotifications;
}

export interface VRMenu {
  type: 'floating' | 'wrist' | 'spatial';
  items: VRMenuItem[];
  position?: any;
}

export interface VRMenuItem {
  label: string;
  icon?: string;
  action: string;
  submenu?: VRMenuItem[];
}

export interface VRHUD {
  elements: HUDElement[];
  position: 'top' | 'bottom' | 'center';
  opacity: number;
}

export interface HUDElement {
  type: 'text' | 'bar' | 'icon' | 'minimap';
  content: any;
  position: any;
}

export interface VRNotifications {
  position: any;
  duration: number;
  style: any;
}

export interface PerformanceConfig {
  targetFPS: number;
  dynamicResolution: boolean;
  foveatedRendering?: boolean;
  levelOfDetail: boolean;
}

export interface VRExperience {
  id: string;
  
  // VR setup
  session: any; // WebXR session
  scene: any;
  
  // State
  state: VRState;
  
  // API
  api: VRAPI;
}

export interface VRState {
  inVR: boolean;
  position: any;
  rotation: any;
  selectedObject?: string;
  inventory: string[];
  progress: Map<string, any>;
}

export interface VRAPI {
  // Session
  enterVR(): Promise<void>;
  exitVR(): void;
  
  // Movement
  teleportTo(position: any): void;
  moveSmooth(direction: any, speed: number): void;
  
  // Interaction
  selectObject(id: string): void;
  grabObject(id: string): void;
  useObject(id: string): void;
  
  // UI
  showMenu(): void;
  hideMenu(): void;
  showTooltip(content: string, position: any): void;
}

export interface ARContext {
  // Real world understanding
  planes: ARPlane[];
  anchors: ARAnchor[];
  lighting: ARLighting;
  
  // Content
  objects: ARObject[];
  
  // Interaction
  interactions: ARInteraction[];
}

export interface ARPlane {
  id: string;
  type: 'horizontal' | 'vertical';
  center: any;
  extent: any;
  vertices: any[];
}

export interface ARAnchor {
  id: string;
  transform: any;
  trackingState: 'tracking' | 'limited' | 'lost';
}

export interface ARLighting {
  intensity: number;
  temperature: number;
  direction?: any;
}

export interface ARObject {
  id: string;
  type: 'model' | 'text' | 'image' | 'particle';
  content: any;
  anchor: string;
  offset?: any;
  scale?: any;
  
  // Behavior
  physics?: boolean;
  occlusion?: boolean;
  shadows?: boolean;
}

export interface ARInteraction {
  type: 'tap' | 'drag' | 'pinch' | 'rotate';
  target: 'object' | 'plane' | 'any';
  action: string;
}

export interface ARExperience {
  id: string;
  
  // AR session
  session: any; // WebXR session
  
  // Tracking
  tracking: ARTracking;
  
  // Content
  content: Map<string, ARObject>;
  
  // API
  api: ARAPI;
}

export interface ARTracking {
  state: 'initializing' | 'tracking' | 'limited' | 'lost';
  quality: number;
  planes: Map<string, ARPlane>;
  anchors: Map<string, ARAnchor>;
}

export interface ARAPI {
  // Placement
  placeObject(object: ARObject, position: any): void;
  moveObject(id: string, position: any): void;
  removeObject(id: string): void;
  
  // Anchoring
  createAnchor(transform: any): string;
  deleteAnchor(id: string): void;
  
  // Interaction
  hitTest(screenPosition: any): ARHitResult | null;
  selectObject(id: string): void;
  
  // Tracking
  resetTracking(): void;
  saveSession(): string;
  loadSession(data: string): void;
}

export interface ARHitResult {
  position: any;
  normal: any;
  distance: number;
  planeId?: string;
}

// Export Types
export enum ExportFormat {
  PNG = 'png',
  JPEG = 'jpeg',
  SVG = 'svg',
  PDF = 'pdf',
  HTML = 'html',
  JSON = 'json',
  CSV = 'csv',
  MP4 = 'mp4',
  GIF = 'gif'
}

export interface ExportResult {
  format: ExportFormat;
  data: Blob;
  filename: string;
  metadata?: ExportMetadata;
}

export interface ExportMetadata {
  title?: string;
  description?: string;
  author?: string;
  created: Date;
  dimensions?: Dimensions;
  duration?: number;
  fileSize: number;
}

export interface EmbedConfig {
  url: string;
  code: string;
  
  // Options
  responsive?: boolean;
  width?: number;
  height?: number;
  
  // Features
  interactive?: boolean;
  controls?: boolean;
  branding?: boolean;
}

// Animation Types
export interface Animation {
  id: string;
  
  // Timeline
  timeline: AnimationTimeline;
  
  // Playback
  playbackState: PlaybackState;
  
  // API
  api: AnimationAPI;
}

export interface AnimationTimeline {
  duration: number;
  tracks: AnimationTrack[];
  markers?: TimeMarker[];
}

export interface AnimationTrack {
  id: string;
  target: string;
  property: string;
  keyframes: Keyframe[];
  easing?: string;
}

export interface Keyframe {
  time: number;
  value: any;
  easing?: string;
  tension?: number;
}

export interface TimeMarker {
  time: number;
  label: string;
  action?: string;
}

export interface AnimationAPI {
  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setSpeed(speed: number): void;
  reverse(): void;
  loop(enabled: boolean): void;
}

export interface VisualizationState {
  view: any;
  selection: any[];
  filters: any[];
  annotations: any[];
  timestamp: Date;
}

export interface FlowAnimation {
  id: string;
  
  // Flow visualization
  particles: ParticleSystem;
  paths: FlowPath[];
  
  // Animation
  animation: Animation;
  
  // API
  api: FlowAPI;
}

export interface ParticleSystem {
  count: number;
  particles: Particle[];
  emitters: Emitter[];
  forces: Force[];
}

export interface Particle {
  position: any;
  velocity: any;
  age: number;
  lifespan: number;
  size: number;
  color: string;
  data?: any;
}

export interface Emitter {
  position: any;
  rate: number;
  spread: number;
  initialVelocity: any;
  particleOptions: any;
}

export interface Force {
  type: 'gravity' | 'attraction' | 'repulsion' | 'drag';
  strength: number;
  position?: any;
  falloff?: number;
}

export interface FlowPath {
  points: any[];
  width: number;
  color: string;
  flowSpeed: number;
  particles?: boolean;
}

export interface FlowAPI {
  addEmitter(emitter: Emitter): void;
  removeEmitter(id: string): void;
  addForce(force: Force): void;
  updateFlow(pathId: string, speed: number): void;
  reset(): void;
}

export interface DataFlowConfig {
  // Pipeline stages
  stages: FlowStage[];
  
  // Connections
  connections: FlowConnection[];
  
  // Data
  dataRate?: number;
  dataVolume?: number;
  
  // Style
  style: FlowStyle;
}

export interface FlowStage {
  id: string;
  label: string;
  type: string;
  position: Position;
  icon?: string;
  metrics?: any;
}

export interface FlowConnection {
  from: string;
  to: string;
  volume?: number;
  latency?: number;
  reliability?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Implementation
export class StorytellingEngineService implements StorytellingEngine {
  constructor(
    private renderEngine: RenderEngine,
    private animationEngine: AnimationEngine,
    private interactionEngine: InteractionEngine,
    private aiService: AIService,
    private assetManager: AssetManager
  ) {}

  async createStory(content: StoryContent): Promise<Story> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateNarrative(data: NarrativeData): Promise<Narrative> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async buildJourney(journey: JourneyConfig): Promise<InteractiveJourney> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async visualizeData(data: VisualizationData): Promise<Visualization> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async createInfographic(config: InfographicConfig): Promise<Infographic> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateDashboard(metrics: DashboardMetrics): Promise<Dashboard> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async createExploration(config: ExplorationConfig): Promise<InteractiveExploration> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async buildTimeline(events: TimelineEvent[]): Promise<InteractiveTimeline> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateMap(data: GeographicData): Promise<InteractiveMap> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async create3DVisualization(graph: KnowledgeGraph): Promise<Visualization3D> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateVRExperience(config: VRConfig): Promise<VRExperience> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async buildAROverlay(context: ARContext): Promise<ARExperience> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async animateTransition(from: VisualizationState, to: VisualizationState): Promise<Animation> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async createDataFlow(pipeline: DataFlowConfig): Promise<FlowAnimation> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async exportVisualization(viz: Visualization, format: ExportFormat): Promise<ExportResult> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateEmbedCode(viz: Visualization): Promise<EmbedConfig> {
    // Implementation
    throw new Error('Implementation pending');
  }
}

// Supporting interfaces
export interface RenderEngine {
  render2D(canvas: any, elements: any[]): void;
  render3D(scene: any, camera: any): void;
  renderVR(session: any, frame: any): void;
  renderAR(session: any, frame: any): void;
}

export interface AnimationEngine {
  createTimeline(config: any): any;
  animate(element: any, properties: any, options: any): Promise<void>;
  createParticleSystem(config: any): any;
  createTransition(from: any, to: any, options: any): any;
}

export interface InteractionEngine {
  enableInteraction(element: any, type: string, handler: Function): void;
  createGesture(type: string, handler: Function): void;
  enableVRController(hand: string, actions: any): void;
  enableARTouch(handler: Function): void;
}

export interface AssetManager {
  loadImage(url: string): Promise<any>;
  loadVideo(url: string): Promise<any>;
  loadModel(url: string): Promise<any>;
  loadAudio(url: string): Promise<any>;
  preload(assets: string[]): Promise<void>;
}