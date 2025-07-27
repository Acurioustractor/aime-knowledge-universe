/**
 * Knowledge Graph Architecture for AIME Content
 * 
 * This module defines the graph-based structure for representing
 * relationships between content, people, concepts, and impacts
 * across AIME's 20 years of mentoring wisdom.
 */

import { UnifiedContent, Region, Community, ThemeNode } from './unified-content';

// Core Graph Types
export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
  version: string;
  lastUpdated: Date;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: NodeProperties;
  embeddings?: Embeddings; // For semantic search
  cluster?: string; // Community detection
  importance: number; // PageRank or similar
  timestamps: NodeTimestamps;
}

export enum NodeType {
  // Content Nodes
  CONTENT = 'content',
  STORY = 'story',
  TOOL = 'tool',
  RESEARCH = 'research',
  EVENT = 'event',
  
  // People Nodes
  PERSON = 'person',
  MENTOR = 'mentor',
  YOUTH = 'youth',
  ELDER = 'elder',
  SPEAKER = 'speaker',
  
  // Concept Nodes
  THEME = 'theme',
  CONCEPT = 'concept',
  PRACTICE = 'practice',
  VALUE = 'value',
  SKILL = 'skill',
  
  // Organization Nodes
  COMMUNITY = 'community',
  ORGANIZATION = 'organization',
  SCHOOL = 'school',
  PARTNER = 'partner',
  
  // Location Nodes
  LOCATION = 'location',
  REGION = 'region',
  COUNTRY = 'country',
  TERRITORY = 'territory',
  
  // Time Nodes
  TIME_PERIOD = 'time_period',
  MILESTONE = 'milestone',
  ERA = 'era',
  
  // Impact Nodes
  OUTCOME = 'outcome',
  IMPACT = 'impact',
  CHANGE = 'change',
  METRIC = 'metric',
  
  // Meta Nodes
  COLLECTION = 'collection',
  PATHWAY = 'pathway',
  JOURNEY = 'journey',
  PATTERN = 'pattern'
}

export interface NodeProperties {
  // Common properties
  name: string;
  description?: string;
  tags: string[];
  
  // Type-specific properties
  contentData?: ContentNodeData;
  personData?: PersonNodeData;
  conceptData?: ConceptNodeData;
  locationData?: LocationNodeData;
  impactData?: ImpactNodeData;
  
  // Graph-specific
  inDegree: number;
  outDegree: number;
  betweenness: number;
  closeness: number;
  
  // Custom metadata
  metadata: Record<string, any>;
}

export interface ContentNodeData {
  contentId: string;
  type: string;
  source: string;
  date?: Date;
  duration?: number;
  language: string;
  viewCount?: number;
  qualityScore: number;
}

export interface PersonNodeData {
  role: string[];
  affiliation?: string;
  location?: string;
  firstAppearance: Date;
  lastAppearance: Date;
  contributionCount: number;
  expertise: string[];
  story?: string;
}

export interface ConceptNodeData {
  category: string;
  definition: string;
  origin?: string;
  relatedPractices: string[];
  culturalContext?: string;
  frequency: number;
  evolution: ConceptEvolution[];
}

export interface ConceptEvolution {
  date: Date;
  description: string;
  evidence: string[];
}

export interface LocationNodeData {
  type: 'city' | 'region' | 'country' | 'territory';
  coordinates?: {
    lat: number;
    lng: number;
  };
  population?: number;
  indigenousName?: string;
  programs: string[];
  partnerships: string[];
}

export interface ImpactNodeData {
  type: string;
  metric: string;
  value: number;
  unit: string;
  timeframe: string;
  evidence: string[];
  confidence: number;
}

export interface NodeTimestamps {
  created: Date;
  updated: Date;
  firstMention?: Date;
  lastMention?: Date;
  peakActivity?: Date;
}

export interface Embeddings {
  text: number[]; // Text embedding vector
  visual?: number[]; // Visual embedding for images/videos
  audio?: number[]; // Audio embedding for speech
  combined?: number[]; // Multimodal embedding
  model: string;
  dimension: number;
}

export interface GraphEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  type: EdgeType;
  properties: EdgeProperties;
  weight: number;
  timestamps: EdgeTimestamps;
}

export enum EdgeType {
  // Content Relationships
  REFERENCES = 'references',
  CONTINUES = 'continues',
  IMPLEMENTS = 'implements',
  ADAPTS = 'adapts',
  CONTRADICTS = 'contradicts',
  SUPPORTS = 'supports',
  
  // People Relationships
  MENTORS = 'mentors',
  COLLABORATES_WITH = 'collaborates_with',
  LEARNS_FROM = 'learns_from',
  INSPIRED_BY = 'inspired_by',
  WORKS_WITH = 'works_with',
  
  // Concept Relationships
  IS_PART_OF = 'is_part_of',
  RELATES_TO = 'relates_to',
  EVOLVED_FROM = 'evolved_from',
  INFLUENCES = 'influences',
  REQUIRES = 'requires',
  
  // Location Relationships
  LOCATED_IN = 'located_in',
  OPERATES_IN = 'operates_in',
  ORIGINATED_FROM = 'originated_from',
  SPREAD_TO = 'spread_to',
  
  // Time Relationships
  HAPPENED_BEFORE = 'happened_before',
  HAPPENED_DURING = 'happened_during',
  TRIGGERED = 'triggered',
  LED_TO = 'led_to',
  
  // Impact Relationships
  CAUSED = 'caused',
  CONTRIBUTED_TO = 'contributed_to',
  MEASURED_BY = 'measured_by',
  VALIDATES = 'validates',
  
  // Participation
  PARTICIPATED_IN = 'participated_in',
  ORGANIZED = 'organized',
  ATTENDED = 'attended',
  FEATURED_IN = 'featured_in',
  
  // Knowledge Flow
  TEACHES = 'teaches',
  DEMONSTRATES = 'demonstrates',
  APPLIES = 'applies',
  TRANSFORMS = 'transforms'
}

export interface EdgeProperties {
  // Relationship strength and confidence
  strength: number; // 0-1
  confidence: number; // 0-1
  
  // Context
  context?: string;
  evidence: string[];
  
  // Temporal
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  
  // Frequency
  occurrences: number;
  lastOccurrence: Date;
  
  // Direction
  bidirectional: boolean;
  primary: boolean;
  
  // Metadata
  metadata: Record<string, any>;
}

export interface EdgeTimestamps {
  created: Date;
  updated: Date;
  verified?: Date;
}

export interface GraphMetadata {
  nodeCount: number;
  edgeCount: number;
  density: number;
  components: number;
  diameter: number;
  avgPathLength: number;
  clustering: number;
  modularity: number;
  
  // Node type distribution
  nodeTypes: Record<NodeType, number>;
  
  // Edge type distribution
  edgeTypes: Record<EdgeType, number>;
  
  // Top nodes by centrality
  topNodesByCentrality: CentralityRanking[];
  
  // Community detection
  communities: Community[];
  
  // Temporal coverage
  temporalRange: {
    start: Date;
    end: Date;
  };
  
  // Geographic coverage
  geographicCoverage: string[];
  
  // Theme coverage
  themeCoverage: string[];
}

export interface CentralityRanking {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  centralityScore: number;
  centralityType: CentralityType;
}

export enum CentralityType {
  DEGREE = 'degree',
  BETWEENNESS = 'betweenness',
  CLOSENESS = 'closeness',
  EIGENVECTOR = 'eigenvector',
  PAGERANK = 'pagerank'
}

export interface Community {
  id: string;
  label: string;
  nodeCount: number;
  density: number;
  cohesion: number;
  topNodes: string[];
  dominantThemes: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
}

// Query Interfaces
export interface GraphQuery {
  // Node queries
  nodeFilters?: NodeFilter[];
  
  // Edge queries  
  edgeFilters?: EdgeFilter[];
  
  // Path queries
  pathQueries?: PathQuery[];
  
  // Subgraph extraction
  subgraphCriteria?: SubgraphCriteria;
  
  // Aggregations
  aggregations?: Aggregation[];
  
  // Limits and pagination
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: SortCriteria[];
}

export interface NodeFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface EdgeFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IN = 'in',
  NOT_IN = 'not_in',
  EXISTS = 'exists',
  NOT_EXISTS = 'not_exists'
}

export interface PathQuery {
  startNode: string;
  endNode?: string;
  pathType: PathType;
  constraints?: PathConstraints;
}

export enum PathType {
  SHORTEST = 'shortest',
  ALL_PATHS = 'all_paths',
  PATHS_WITH_RELATIONSHIP = 'paths_with_relationship',
  CYCLIC = 'cyclic',
  ACYCLIC = 'acyclic'
}

export interface PathConstraints {
  maxLength?: number;
  minLength?: number;
  includeNodeTypes?: NodeType[];
  excludeNodeTypes?: NodeType[];
  includeEdgeTypes?: EdgeType[];
  excludeEdgeTypes?: EdgeType[];
  minWeight?: number;
}

export interface SubgraphCriteria {
  centerNode?: string;
  radius?: number;
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  minConnections?: number;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

export interface Aggregation {
  field: string;
  function: AggregationFunction;
  groupBy?: string[];
  having?: AggregationFilter[];
}

export enum AggregationFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  STDDEV = 'stddev',
  PERCENTILE = 'percentile'
}

export interface AggregationFilter {
  aggregation: string;
  operator: FilterOperator;
  value: any;
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

// Graph Operations
export interface GraphOperations {
  // CRUD Operations
  addNode(node: GraphNode): Promise<GraphNode>;
  updateNode(id: string, updates: Partial<GraphNode>): Promise<GraphNode>;
  deleteNode(id: string): Promise<boolean>;
  
  addEdge(edge: GraphEdge): Promise<GraphEdge>;
  updateEdge(id: string, updates: Partial<GraphEdge>): Promise<GraphEdge>;
  deleteEdge(id: string): Promise<boolean>;
  
  // Query Operations
  queryNodes(query: GraphQuery): Promise<GraphNode[]>;
  queryEdges(query: GraphQuery): Promise<GraphEdge[]>;
  queryPaths(query: PathQuery): Promise<Path[]>;
  querySubgraph(criteria: SubgraphCriteria): Promise<KnowledgeGraph>;
  
  // Analysis Operations
  calculateCentrality(type: CentralityType): Promise<CentralityRanking[]>;
  detectCommunities(algorithm: CommunityDetectionAlgorithm): Promise<Community[]>;
  findPatterns(patternType: PatternType): Promise<Pattern[]>;
  
  // Semantic Operations
  semanticSearch(query: string, limit?: number): Promise<GraphNode[]>;
  findSimilar(nodeId: string, limit?: number): Promise<GraphNode[]>;
  recommendConnections(nodeId: string): Promise<ConnectionRecommendation[]>;
  
  // Temporal Operations
  getTemporalEvolution(nodeId: string): Promise<TemporalEvolution>;
  getTimeSlice(date: Date, window?: number): Promise<KnowledgeGraph>;
  trackChange(startDate: Date, endDate: Date): Promise<ChangeReport>;
}

export interface Path {
  nodes: GraphNode[];
  edges: GraphEdge[];
  length: number;
  weight: number;
}

export enum CommunityDetectionAlgorithm {
  LOUVAIN = 'louvain',
  LABEL_PROPAGATION = 'label_propagation',
  GIRVAN_NEWMAN = 'girvan_newman',
  SPECTRAL = 'spectral'
}

export enum PatternType {
  TRIANGLE = 'triangle',
  STAR = 'star',
  CHAIN = 'chain',
  CYCLE = 'cycle',
  BIPARTITE = 'bipartite',
  HUB = 'hub',
  BRIDGE = 'bridge'
}

export interface Pattern {
  type: PatternType;
  nodes: string[];
  edges: string[];
  frequency: number;
  significance: number;
}

export interface ConnectionRecommendation {
  targetNode: GraphNode;
  score: number;
  reason: string;
  potentialRelationships: EdgeType[];
  commonConnections: string[];
}

export interface TemporalEvolution {
  nodeId: string;
  timeline: TimelinePoint[];
  growthRate: number;
  peakPeriods: Period[];
  trends: Trend[];
}

export interface TimelinePoint {
  date: Date;
  metrics: {
    connections: number;
    importance: number;
    activity: number;
  };
  events: string[];
}

export interface Period {
  start: Date;
  end: Date;
  description: string;
  metrics: Record<string, number>;
}

export interface Trend {
  type: 'growth' | 'decline' | 'stable' | 'cyclic';
  metric: string;
  startValue: number;
  endValue: number;
  changeRate: number;
  confidence: number;
}

export interface ChangeReport {
  addedNodes: GraphNode[];
  removedNodes: GraphNode[];
  updatedNodes: GraphNode[];
  addedEdges: GraphEdge[];
  removedEdges: GraphEdge[];
  updatedEdges: GraphEdge[];
  
  topGrowingNodes: GrowthMetric[];
  topDecliningNodes: GrowthMetric[];
  
  emergingThemes: string[];
  fadingThemes: string[];
  
  newCommunities: Community[];
  mergedCommunities: CommunityMerge[];
  
  overallGrowth: number;
  densityChange: number;
}

export interface GrowthMetric {
  nodeId: string;
  label: string;
  growthRate: number;
  newConnections: number;
  lostConnections: number;
}

export interface CommunityMerge {
  originalCommunities: string[];
  newCommunity: string;
  reason: string;
  similarity: number;
}

// Visualization Helpers
export interface GraphVisualization {
  layout: LayoutType;
  nodeVisuals: Record<string, NodeVisual>;
  edgeVisuals: Record<string, EdgeVisual>;
  clusters?: VisualCluster[];
  annotations?: Annotation[];
}

export enum LayoutType {
  FORCE_DIRECTED = 'force_directed',
  HIERARCHICAL = 'hierarchical',
  CIRCULAR = 'circular',
  GEOGRAPHIC = 'geographic',
  TEMPORAL = 'temporal',
  RADIAL = 'radial'
}

export interface NodeVisual {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: NodeShape;
  label?: string;
  icon?: string;
  visible: boolean;
}

export enum NodeShape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  DIAMOND = 'diamond',
  STAR = 'star',
  HEXAGON = 'hexagon'
}

export interface EdgeVisual {
  path: string; // SVG path
  color: string;
  width: number;
  style: EdgeStyle;
  label?: string;
  visible: boolean;
}

export enum EdgeStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  CURVED = 'curved',
  STRAIGHT = 'straight'
}

export interface VisualCluster {
  id: string;
  nodes: string[];
  boundary: string; // SVG path
  color: string;
  label: string;
}

export interface Annotation {
  id: string;
  type: 'text' | 'arrow' | 'region';
  content: string;
  position: {
    x: number;
    y: number;
  };
  style: Record<string, any>;
}