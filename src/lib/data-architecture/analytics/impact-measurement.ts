/**
 * Analytics and Impact Measurement System for AIME Knowledge Platform
 * 
 * This system tracks, measures, and visualizes the impact of AIME's
 * mentoring programs across communities, individuals, and systems
 * over the past 20 years and into the future.
 */

import { UnifiedContent } from '../models/unified-content';
import { GraphNode, GraphEdge, KnowledgeGraph } from '../models/knowledge-graph';

// Core Impact Measurement Interface
export interface ImpactMeasurementSystem {
  // Impact tracking
  trackOutcome(outcome: OutcomeData): Promise<void>;
  measureImpact(criteria: ImpactCriteria): Promise<ImpactAssessment>;
  
  // Analytics
  analyzeProgram(programId: string, options?: AnalysisOptions): Promise<ProgramAnalysis>;
  analyzeRegion(region: string, timeframe?: TimeFrame): Promise<RegionalAnalysis>;
  analyzeCohort(cohortId: string): Promise<CohortAnalysis>;
  
  // Longitudinal studies
  trackJourney(participantId: string): Promise<ParticipantJourney>;
  measureTransformation(criteria: TransformationCriteria): Promise<TransformationMetrics>;
  
  // Predictive analytics
  predictOutcomes(context: PredictionContext): Promise<OutcomePrediction>;
  identifyRiskFactors(population: string): Promise<RiskAnalysis>;
  recommendInterventions(situation: SituationContext): Promise<InterventionRecommendations>;
  
  // Impact visualization
  generateImpactMap(options: MapOptions): Promise<ImpactMap>;
  createImpactDashboard(config: DashboardConfig): Promise<ImpactDashboard>;
  buildStoryOfChange(journey: ChangeJourney): Promise<StoryVisualization>;
  
  // Reporting
  generateImpactReport(criteria: ReportCriteria): Promise<ImpactReport>;
  createEvidencePortfolio(programId: string): Promise<EvidencePortfolio>;
  exportAnalytics(format: ExportFormat): Promise<AnalyticsExport>;
}

// Outcome Tracking
export interface OutcomeData {
  // Identification
  id: string;
  programId: string;
  participantId?: string;
  cohortId?: string;
  
  // Outcome details
  type: OutcomeType;
  category: OutcomeCategory;
  description: string;
  
  // Measurement
  metric: string;
  value: any;
  baseline?: any;
  target?: any;
  
  // Context
  date: Date;
  location?: Location;
  context?: OutcomeContext;
  
  // Evidence
  evidence: Evidence[];
  verificationStatus?: VerificationStatus;
  
  // Attribution
  attribution?: Attribution;
  contributingFactors?: string[];
}

export enum OutcomeType {
  INDIVIDUAL = 'individual',
  COMMUNITY = 'community',
  SYSTEM = 'system',
  CULTURAL = 'cultural',
  ECONOMIC = 'economic',
  EDUCATIONAL = 'educational',
  SOCIAL = 'social',
  ENVIRONMENTAL = 'environmental'
}

export enum OutcomeCategory {
  // Individual
  SKILL_DEVELOPMENT = 'skill_development',
  CONFIDENCE_BUILDING = 'confidence_building',
  IDENTITY_FORMATION = 'identity_formation',
  CAREER_PROGRESSION = 'career_progression',
  WELLBEING = 'wellbeing',
  
  // Community
  SOCIAL_COHESION = 'social_cohesion',
  CULTURAL_PRESERVATION = 'cultural_preservation',
  COLLECTIVE_EFFICACY = 'collective_efficacy',
  NETWORK_STRENGTHENING = 'network_strengthening',
  
  // System
  POLICY_CHANGE = 'policy_change',
  INSTITUTIONAL_REFORM = 'institutional_reform',
  PRACTICE_ADOPTION = 'practice_adoption',
  MINDSET_SHIFT = 'mindset_shift'
}

export interface OutcomeContext {
  setting: string;
  participants: number;
  duration: string;
  facilitators?: string[];
  challenges?: string[];
  enablers?: string[];
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  source: string;
  
  // Content
  description: string;
  data?: any;
  mediaIds?: string[];
  
  // Quality
  credibility: CredibilityLevel;
  reliability: number; // 0-1
  
  // Metadata
  collectionDate: Date;
  collector?: string;
  method?: CollectionMethod;
  
  // Verification
  verified?: boolean;
  verifier?: string;
  verificationDate?: Date;
}

export enum EvidenceType {
  QUANTITATIVE = 'quantitative',
  QUALITATIVE = 'qualitative',
  MIXED = 'mixed',
  OBSERVATIONAL = 'observational',
  TESTIMONIAL = 'testimonial',
  DOCUMENTARY = 'documentary',
  MEDIA = 'media'
}

export enum CredibilityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNVERIFIED = 'unverified'
}

export enum CollectionMethod {
  SURVEY = 'survey',
  INTERVIEW = 'interview',
  FOCUS_GROUP = 'focus_group',
  OBSERVATION = 'observation',
  DOCUMENT_ANALYSIS = 'document_analysis',
  DATA_MINING = 'data_mining',
  SENSOR = 'sensor',
  SELF_REPORT = 'self_report'
}

export interface VerificationStatus {
  verified: boolean;
  level: VerificationLevel;
  method: string;
  verifier?: string;
  date?: Date;
  notes?: string;
}

export enum VerificationLevel {
  SELF_REPORTED = 'self_reported',
  PEER_VERIFIED = 'peer_verified',
  EXPERT_VERIFIED = 'expert_verified',
  INDEPENDENTLY_VERIFIED = 'independently_verified',
  TRIANGULATED = 'triangulated'
}

export interface Attribution {
  primaryFactor: string;
  contributionPercentage?: number;
  alternativeFactors?: AlternativeFactor[];
  confidenceLevel: number;
}

export interface AlternativeFactor {
  factor: string;
  likelihood: number;
  evidence?: string[];
}

export interface Location {
  country: string;
  region?: string;
  city?: string;
  community?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Impact Assessment
export interface ImpactCriteria {
  // Scope
  programs?: string[];
  regions?: string[];
  timeframe?: TimeFrame;
  
  // Dimensions
  dimensions: ImpactDimension[];
  
  // Filters
  outcomeTypes?: OutcomeType[];
  minConfidence?: number;
  verifiedOnly?: boolean;
  
  // Aggregation
  aggregateBy?: AggregationLevel;
  
  // Comparison
  compareWith?: ComparisonGroup;
}

export interface TimeFrame {
  start: Date;
  end: Date;
  granularity?: TimeGranularity;
}

export enum TimeGranularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum ImpactDimension {
  REACH = 'reach',
  DEPTH = 'depth',
  SUSTAINABILITY = 'sustainability',
  SCALABILITY = 'scalability',
  EQUITY = 'equity',
  INNOVATION = 'innovation',
  SYSTEMS_CHANGE = 'systems_change'
}

export enum AggregationLevel {
  INDIVIDUAL = 'individual',
  COHORT = 'cohort',
  PROGRAM = 'program',
  REGION = 'region',
  ORGANIZATION = 'organization',
  GLOBAL = 'global'
}

export interface ComparisonGroup {
  type: 'control' | 'baseline' | 'benchmark' | 'historical';
  identifier: string;
  adjustments?: string[];
}

export interface ImpactAssessment {
  // Summary
  overallImpact: ImpactScore;
  summary: string;
  
  // Detailed metrics
  dimensions: DimensionAssessment[];
  
  // Outcomes
  outcomes: OutcomeAssessment[];
  
  // Reach
  reach: ReachMetrics;
  
  // Quality
  quality: QualityMetrics;
  
  // Sustainability
  sustainability: SustainabilityAssessment;
  
  // Cost-effectiveness
  costEffectiveness?: CostEffectiveness;
  
  // Recommendations
  recommendations: Recommendation[];
  
  // Confidence
  confidence: ConfidenceAssessment;
}

export interface ImpactScore {
  score: number; // 0-100
  rating: ImpactRating;
  trend: TrendDirection;
  benchmark?: number;
}

export enum ImpactRating {
  TRANSFORMATIVE = 'transformative',
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  MINIMAL = 'minimal'
}

export enum TrendDirection {
  INCREASING = 'increasing',
  STABLE = 'stable',
  DECREASING = 'decreasing',
  VOLATILE = 'volatile'
}

export interface DimensionAssessment {
  dimension: ImpactDimension;
  score: number;
  metrics: DimensionMetric[];
  insights: string[];
  improvementAreas?: string[];
}

export interface DimensionMetric {
  name: string;
  value: any;
  unit?: string;
  benchmark?: any;
  percentile?: number;
  trend: TrendData;
}

export interface TrendData {
  direction: TrendDirection;
  changeRate: number;
  volatility: number;
  forecast?: ForecastData;
}

export interface ForecastData {
  value: any;
  confidence: number;
  horizon: string;
  assumptions: string[];
}

export interface OutcomeAssessment {
  outcome: OutcomeData;
  achievement: AchievementLevel;
  significance: SignificanceLevel;
  sustainability: number;
  evidence: EvidenceStrength;
}

export enum AchievementLevel {
  EXCEEDED = 'exceeded',
  ACHIEVED = 'achieved',
  PARTIAL = 'partial',
  NOT_ACHIEVED = 'not_achieved'
}

export enum SignificanceLevel {
  TRANSFORMATIVE = 'transformative',
  SUBSTANTIAL = 'substantial',
  MODERATE = 'moderate',
  MINOR = 'minor'
}

export interface EvidenceStrength {
  quantity: number;
  quality: number;
  diversity: number;
  overall: number;
}

export interface ReachMetrics {
  // Direct reach
  individuals: ReachSegment;
  communities: ReachSegment;
  organizations: ReachSegment;
  
  // Indirect reach
  indirectBeneficiaries?: number;
  influenceMultiplier?: number;
  
  // Geographic spread
  countries: number;
  regions: string[];
  urbanRural: UrbanRuralDistribution;
  
  // Demographic reach
  demographics: DemographicReach;
  
  // Depth of engagement
  engagementLevels: EngagementDistribution;
}

export interface ReachSegment {
  total: number;
  unique: number;
  active: number;
  growth: GrowthMetrics;
}

export interface GrowthMetrics {
  rate: number;
  acceleration: number;
  projection: number;
  sustainabilityIndex: number;
}

export interface UrbanRuralDistribution {
  urban: number;
  rural: number;
  remote: number;
}

export interface DemographicReach {
  ageGroups: Distribution;
  gender: Distribution;
  ethnicities?: Distribution;
  socioeconomic?: Distribution;
  education?: Distribution;
}

export interface Distribution {
  categories: DistributionCategory[];
  diversityIndex: number;
  representativeness: number;
}

export interface DistributionCategory {
  name: string;
  count: number;
  percentage: number;
  growth?: number;
}

export interface EngagementDistribution {
  high: number;
  medium: number;
  low: number;
  averageDuration: string;
  retentionRate: number;
}

export interface QualityMetrics {
  // Program quality
  programFidelity: number;
  implementationQuality: number;
  adaptationEffectiveness: number;
  
  // Outcome quality
  outcomeReliability: number;
  outcomeValidity: number;
  
  // Process quality
  participantSatisfaction: number;
  facilitatorEffectiveness: number;
  
  // Innovation
  innovationIndex: number;
  bestPractices: string[];
}

export interface SustainabilityAssessment {
  score: number;
  
  // Dimensions
  financial: SustainabilityDimension;
  institutional: SustainabilityDimension;
  community: SustainabilityDimension;
  environmental: SustainabilityDimension;
  
  // Projections
  projectedLifespan: string;
  criticalDependencies: Dependency[];
  
  // Strategies
  sustainabilityPlan?: SustainabilityPlan;
}

export interface SustainabilityDimension {
  score: number;
  strengths: string[];
  vulnerabilities: string[];
  recommendations: string[];
}

export interface Dependency {
  type: string;
  description: string;
  criticalityLevel: 'high' | 'medium' | 'low';
  mitigationStrategies?: string[];
}

export interface SustainabilityPlan {
  goals: SustainabilityGoal[];
  strategies: Strategy[];
  timeline: string;
  resources: ResourceRequirement[];
}

export interface SustainabilityGoal {
  goal: string;
  indicator: string;
  target: any;
  deadline: Date;
}

export interface Strategy {
  name: string;
  description: string;
  actions: string[];
  responsible: string[];
  timeline: string;
}

export interface ResourceRequirement {
  type: 'financial' | 'human' | 'technical' | 'partnership';
  description: string;
  quantity: any;
  source?: string;
}

export interface CostEffectiveness {
  // Cost per outcome
  costPerOutcome: CostMetric[];
  
  // Return on investment
  socialROI: number;
  economicROI?: number;
  
  // Efficiency
  efficiencyScore: number;
  benchmarkComparison?: BenchmarkComparison;
  
  // Value for money
  valueRating: ValueRating;
}

export interface CostMetric {
  outcome: string;
  cost: number;
  unit: string;
  benchmark?: number;
  trend: TrendDirection;
}

export interface BenchmarkComparison {
  benchmark: string;
  performance: 'above' | 'at' | 'below';
  difference: number;
  percentile?: number;
}

export enum ValueRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: Priority;
  
  // Content
  title: string;
  description: string;
  rationale: string;
  
  // Implementation
  actions: RecommendedAction[];
  resources: string[];
  timeline?: string;
  
  // Impact
  expectedImpact: string;
  effortRequired: EffortLevel;
  
  // Evidence
  evidenceBase: string[];
  successExamples?: string[];
}

export enum RecommendationType {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  TACTICAL = 'tactical',
  INNOVATION = 'innovation',
  RISK_MITIGATION = 'risk_mitigation'
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface RecommendedAction {
  action: string;
  responsible?: string;
  deadline?: Date;
  dependencies?: string[];
}

export enum EffortLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTENSIVE = 'extensive'
}

export interface ConfidenceAssessment {
  overall: number;
  
  // Components
  dataQuality: number;
  evidenceStrength: number;
  methodologicalRigor: number;
  
  // Limitations
  limitations: string[];
  assumptions: string[];
  
  // Validation
  validationMethods: string[];
  peerReview?: boolean;
}

// Program Analysis
export interface AnalysisOptions {
  // Scope
  includeSubPrograms?: boolean;
  includeRelated?: boolean;
  
  // Depth
  analysisDepth: AnalysisDepth;
  
  // Comparisons
  compareTo?: string[];
  benchmarks?: string[];
  
  // Time
  timeframe?: TimeFrame;
  longitudinal?: boolean;
}

export enum AnalysisDepth {
  SUMMARY = 'summary',
  STANDARD = 'standard',
  DETAILED = 'detailed',
  COMPREHENSIVE = 'comprehensive'
}

export interface ProgramAnalysis {
  // Program info
  programId: string;
  programName: string;
  description: string;
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  phases: ProgramPhase[];
  
  // Implementation
  implementation: ImplementationAnalysis;
  
  // Outcomes
  outcomes: OutcomeAnalysis;
  
  // Impact
  impact: ImpactAssessment;
  
  // Participants
  participants: ParticipantAnalysis;
  
  // Cost-benefit
  costBenefit: CostBenefitAnalysis;
  
  // Learning
  learnings: LearningAnalysis;
  
  // Recommendations
  recommendations: ProgramRecommendations;
}

export interface ProgramPhase {
  name: string;
  startDate: Date;
  endDate?: Date;
  objectives: string[];
  achievements: string[];
  challenges?: string[];
}

export interface ImplementationAnalysis {
  // Coverage
  geographicCoverage: GeographicCoverage;
  demographicCoverage: DemographicCoverage;
  
  // Quality
  fidelity: FidelityAssessment;
  adaptations: Adaptation[];
  
  // Resources
  resourceUtilization: ResourceUtilization;
  
  // Partnerships
  partnerships: PartnershipAnalysis;
  
  // Challenges
  challenges: Challenge[];
  solutions: Solution[];
}

export interface GeographicCoverage {
  countries: CountryCoverage[];
  totalArea: number;
  populationReached: number;
  penetrationRate: number;
  expansionTimeline: ExpansionEvent[];
}

export interface CountryCoverage {
  country: string;
  regions: string[];
  sites: number;
  participants: number;
  startDate: Date;
}

export interface ExpansionEvent {
  date: Date;
  location: string;
  scale: number;
  trigger?: string;
}

export interface DemographicCoverage {
  totalParticipants: number;
  demographics: DetailedDemographics;
  inclusionIndex: number;
  gaps?: DemographicGap[];
}

export interface DetailedDemographics {
  age: AgeDistribution;
  gender: GenderDistribution;
  ethnicity?: EthnicityDistribution;
  socioeconomic?: SocioeconomicDistribution;
  education?: EducationDistribution;
  special?: SpecialPopulations;
}

export interface AgeDistribution {
  ranges: AgeRange[];
  mean: number;
  median: number;
  stdDev: number;
}

export interface AgeRange {
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface GenderDistribution {
  male: number;
  female: number;
  nonBinary?: number;
  notDisclosed?: number;
  genderBalanceIndex: number;
}

export interface EthnicityDistribution {
  groups: EthnicGroup[];
  diversityIndex: number;
  representationGap?: number;
}

export interface EthnicGroup {
  name: string;
  count: number;
  percentage: number;
  indigenous?: boolean;
}

export interface SocioeconomicDistribution {
  levels: SocioeconomicLevel[];
  mobilityRate?: number;
}

export interface SocioeconomicLevel {
  level: string;
  count: number;
  percentage: number;
  characteristics?: string[];
}

export interface EducationDistribution {
  levels: EducationLevel[];
  completionRates: CompletionRates;
  progressionRates?: ProgressionRates;
}

export interface EducationLevel {
  level: string;
  count: number;
  percentage: number;
}

export interface CompletionRates {
  overall: number;
  byLevel: Record<string, number>;
  byDemographic?: Record<string, number>;
}

export interface ProgressionRates {
  toHigherEducation: number;
  toEmployment: number;
  toLeadership: number;
}

export interface SpecialPopulations {
  refugees?: number;
  disabilities?: number;
  minorityLanguages?: number;
  other?: Record<string, number>;
}

export interface DemographicGap {
  group: string;
  expectedReach: number;
  actualReach: number;
  gap: number;
  reasons?: string[];
  strategies?: string[];
}

export interface FidelityAssessment {
  overallFidelity: number;
  
  // Components
  coreComponents: ComponentFidelity[];
  
  // Adaptations
  adaptationNecessity: number;
  adaptationEffectiveness: number;
  
  // Quality assurance
  qualityAssurance: QualityAssurance;
}

export interface ComponentFidelity {
  component: string;
  fidelityScore: number;
  critical: boolean;
  variations?: ComponentVariation[];
}

export interface ComponentVariation {
  location: string;
  variation: string;
  reason: string;
  impact?: string;
  approved?: boolean;
}

export interface QualityAssurance {
  mechanisms: QAMechanism[];
  frequency: string;
  findings: QAFinding[];
  improvements: number;
}

export interface QAMechanism {
  type: string;
  description: string;
  frequency: string;
  responsible: string;
}

export interface QAFinding {
  date: Date;
  finding: string;
  severity: 'high' | 'medium' | 'low';
  action?: string;
  resolved?: boolean;
}

export interface Adaptation {
  id: string;
  type: AdaptationType;
  description: string;
  
  // Context
  location?: string;
  reason: string;
  
  // Implementation
  implementationDate: Date;
  implementedBy: string;
  
  // Evaluation
  effectiveness?: number;
  retained?: boolean;
  scaled?: boolean;
}

export enum AdaptationType {
  CULTURAL = 'cultural',
  LINGUISTIC = 'linguistic',
  CONTEXTUAL = 'contextual',
  RESOURCE = 'resource',
  TECHNOLOGICAL = 'technological',
  PEDAGOGICAL = 'pedagogical'
}

export interface ResourceUtilization {
  // Financial
  budget: BudgetAnalysis;
  costEfficiency: number;
  
  // Human resources
  staff: StaffAnalysis;
  volunteers?: VolunteerAnalysis;
  
  // Material resources
  materials: MaterialAnalysis;
  infrastructure?: InfrastructureAnalysis;
  
  // Time
  timeAllocation: TimeAnalysis;
}

export interface BudgetAnalysis {
  totalBudget: number;
  expenditure: number;
  utilizationRate: number;
  
  // Breakdown
  byCategory: BudgetCategory[];
  byPhase?: BudgetPhase[];
  
  // Efficiency
  costPerParticipant: number;
  costPerOutcome: Record<string, number>;
  
  // Variance
  variance: number;
  varianceReasons?: string[];
}

export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
  notes?: string;
}

export interface BudgetPhase {
  phase: string;
  budget: number;
  spent: number;
  outcomes: number;
  efficiency: number;
}

export interface StaffAnalysis {
  totalStaff: number;
  fte: number;
  
  // Composition
  byRole: StaffRole[];
  byLocation?: StaffLocation[];
  
  // Performance
  productivity: number;
  retention: number;
  satisfaction?: number;
  
  // Development
  trainingHours: number;
  skillsGrowth?: SkillsAssessment;
}

export interface StaffRole {
  role: string;
  count: number;
  fte: number;
  turnover?: number;
  performance?: number;
}

export interface StaffLocation {
  location: string;
  count: number;
  localHires: number;
  culturalMatch: number;
}

export interface SkillsAssessment {
  baseline: Record<string, number>;
  current: Record<string, number>;
  growth: Record<string, number>;
  gaps?: string[];
}

export interface VolunteerAnalysis {
  totalVolunteers: number;
  activeVolunteers: number;
  
  // Contribution
  totalHours: number;
  valueContributed: number;
  
  // Engagement
  retentionRate: number;
  satisfactionScore?: number;
  
  // Impact
  tasksCompleted: number;
  beneficiariesServed: number;
}

export interface MaterialAnalysis {
  // Inventory
  itemsDistributed: MaterialItem[];
  utilizationRate: number;
  
  // Efficiency
  wasteRate: number;
  reuseRate?: number;
  
  // Local sourcing
  localSourcingRate?: number;
  sustainabilityScore?: number;
}

export interface MaterialItem {
  item: string;
  quantity: number;
  unit: string;
  cost?: number;
  recipients: number;
}

export interface InfrastructureAnalysis {
  facilities: Facility[];
  utilization: number;
  condition: ConditionAssessment;
  accessibility: AccessibilityAssessment;
}

export interface Facility {
  name: string;
  type: string;
  capacity: number;
  utilization: number;
  condition: string;
  upgrades?: string[];
}

export interface ConditionAssessment {
  overall: string;
  maintenanceNeeds: MaintenanceNeed[];
  upgradesPlan?: UpgradePlan;
}

export interface MaintenanceNeed {
  item: string;
  priority: Priority;
  cost?: number;
  timeline?: string;
}

export interface UpgradePlan {
  upgrades: Upgrade[];
  totalCost: number;
  timeline: string;
  benefits: string[];
}

export interface Upgrade {
  description: string;
  cost: number;
  duration: string;
  impact: string;
}

export interface AccessibilityAssessment {
  physicalAccess: number;
  transportAccess: number;
  digitalAccess?: number;
  barriers?: AccessBarrier[];
}

export interface AccessBarrier {
  type: string;
  description: string;
  affected: number;
  solutions?: string[];
}

export interface TimeAnalysis {
  totalProgramHours: number;
  
  // Distribution
  byActivity: ActivityTime[];
  byPhase?: PhaseTime[];
  
  // Efficiency
  activeTime: number;
  preparationTime: number;
  adminTime: number;
  
  // Optimization
  timeWaste?: number;
  optimizationOpportunities?: string[];
}

export interface ActivityTime {
  activity: string;
  hours: number;
  percentage: number;
  participants: number;
  outcomeEfficiency?: number;
}

export interface PhaseTime {
  phase: string;
  duration: string;
  intensity: number;
  outcomes: number;
}

export interface PartnershipAnalysis {
  totalPartners: number;
  activePartners: number;
  
  // Types
  byType: PartnerType[];
  bySector?: PartnerSector[];
  
  // Contribution
  contributions: PartnerContribution[];
  valueCreated: number;
  
  // Quality
  satisfactionScore: number;
  alignmentScore: number;
  
  // Sustainability
  longevity: number;
  dependencyRisk?: number;
}

export interface PartnerType {
  type: string;
  count: number;
  contribution: string;
  satisfaction?: number;
}

export interface PartnerSector {
  sector: string;
  count: number;
  resources: string[];
  influence: number;
}

export interface PartnerContribution {
  partner: string;
  type: 'financial' | 'inkind' | 'expertise' | 'network' | 'advocacy';
  value: number;
  description: string;
  duration?: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  description: string;
  
  // Impact
  severity: Severity;
  affectedAreas: string[];
  affectedParticipants?: number;
  
  // Timeline
  identifiedDate: Date;
  resolvedDate?: Date;
  duration?: string;
  
  // Resolution
  status: ResolutionStatus;
  solutions?: Solution[];
  lessonsLearned?: string[];
}

export enum ChallengeType {
  RESOURCE = 'resource',
  OPERATIONAL = 'operational',
  CULTURAL = 'cultural',
  ENVIRONMENTAL = 'environmental',
  POLITICAL = 'political',
  TECHNICAL = 'technical',
  PARTNERSHIP = 'partnership'
}

export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ResolutionStatus {
  RESOLVED = 'resolved',
  ONGOING = 'ongoing',
  ESCALATED = 'escalated',
  ACCEPTED = 'accepted'
}

export interface Solution {
  id: string;
  challenge: string;
  description: string;
  
  // Implementation
  implementedBy: string;
  implementationDate: Date;
  resources?: string[];
  
  // Effectiveness
  effectiveness: number;
  sideEffects?: string[];
  
  // Scalability
  scalable: boolean;
  replicable: boolean;
  documentation?: string;
}

export interface OutcomeAnalysis {
  // Achievement
  totalOutcomes: number;
  achievedOutcomes: number;
  achievementRate: number;
  
  // By category
  byCategory: OutcomeCategoryAnalysis[];
  
  // Quality
  outcomeQuality: OutcomeQuality;
  
  // Attribution
  attributionAnalysis: AttributionAnalysis;
  
  // Unexpected
  unexpectedOutcomes?: UnexpectedOutcome[];
}

export interface OutcomeCategoryAnalysis {
  category: OutcomeCategory;
  outcomes: OutcomeData[];
  achievementRate: number;
  averageImpact: number;
  sustainability: number;
}

export interface OutcomeQuality {
  evidenceStrength: number;
  measurementRigor: number;
  verificationRate: number;
  consistencyScore: number;
}

export interface AttributionAnalysis {
  programContribution: number;
  externalFactors: ExternalFactor[];
  confidenceLevel: number;
  methodology: string;
}

export interface ExternalFactor {
  factor: string;
  influence: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  evidence?: string[];
}

export interface UnexpectedOutcome {
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  significance: SignificanceLevel;
  response?: string;
  integration?: boolean;
}

export interface ParticipantAnalysis {
  // Overview
  totalParticipants: number;
  activeParticipants: number;
  completionRate: number;
  
  // Segmentation
  segments: ParticipantSegment[];
  
  // Journey
  journeyAnalysis: JourneyAnalysis;
  
  // Satisfaction
  satisfaction: SatisfactionAnalysis;
  
  // Outcomes
  participantOutcomes: ParticipantOutcomes;
  
  // Alumni
  alumniEngagement?: AlumniAnalysis;
}

export interface ParticipantSegment {
  name: string;
  criteria: string[];
  size: number;
  characteristics: string[];
  outcomes: SegmentOutcomes;
}

export interface SegmentOutcomes {
  completionRate: number;
  satisfactionScore: number;
  outcomeAchievement: number;
  uniqueStrengths?: string[];
  uniqueChallenges?: string[];
}

export interface JourneyAnalysis {
  stages: JourneyStage[];
  averageDuration: string;
  
  // Progression
  progressionRates: number[];
  dropoutPoints: DropoutPoint[];
  
  // Milestones
  keyMilestones: Milestone[];
  achievementRates: Record<string, number>;
}

export interface JourneyStage {
  name: string;
  duration: string;
  participants: number;
  completionRate: number;
  keyActivities: string[];
  outcomes: string[];
}

export interface DropoutPoint {
  stage: string;
  rate: number;
  reasons: DropoutReason[];
  preventionStrategies?: string[];
}

export interface DropoutReason {
  reason: string;
  frequency: number;
  preventable: boolean;
  addressed?: boolean;
}

export interface Milestone {
  name: string;
  description: string;
  achievers: number;
  averageTime: string;
  significance: string;
}

export interface SatisfactionAnalysis {
  overallScore: number;
  
  // Components
  programContent: number;
  facilitation: number;
  support: number;
  outcomes: number;
  
  // Feedback
  feedback: FeedbackSummary;
  
  // Recommendations
  participantRecommendations: string[];
  netPromoterScore?: number;
}

export interface FeedbackSummary {
  totalResponses: number;
  responseRate: number;
  
  // Themes
  positiveThemes: FeedbackTheme[];
  improvementAreas: FeedbackTheme[];
  
  // Quotes
  testimonials: Testimonial[];
}

export interface FeedbackTheme {
  theme: string;
  frequency: number;
  sentiment: number;
  examples: string[];
}

export interface Testimonial {
  quote: string;
  author?: string;
  context?: string;
  permission?: boolean;
  impact?: string;
}

export interface ParticipantOutcomes {
  // Individual level
  skillsDeveloped: SkillOutcome[];
  confidenceGrowth: number;
  behaviorChanges: BehaviorChange[];
  
  // Career/education
  careerProgress?: CareerOutcome[];
  educationProgress?: EducationOutcome[];
  
  // Wellbeing
  wellbeingImprovement?: WellbeingOutcome;
  
  // Community contribution
  communityEngagement?: CommunityOutcome[];
}

export interface SkillOutcome {
  skill: string;
  baseline: number;
  current: number;
  growth: number;
  application?: string[];
}

export interface BehaviorChange {
  behavior: string;
  frequency: number;
  sustainability: number;
  impact?: string;
  evidence?: string[];
}

export interface CareerOutcome {
  type: 'employment' | 'promotion' | 'entrepreneurship' | 'skills';
  description: string;
  participants: number;
  timeframe: string;
  quality?: string;
}

export interface EducationOutcome {
  type: 'enrollment' | 'completion' | 'performance' | 'aspiration';
  level: string;
  participants: number;
  successRate: number;
  support?: string[];
}

export interface WellbeingOutcome {
  dimensions: WellbeingDimension[];
  overallImprovement: number;
  sustainedImprovement?: number;
}

export interface WellbeingDimension {
  dimension: string;
  baseline: number;
  current: number;
  improvement: number;
  factors?: string[];
}

export interface CommunityOutcome {
  type: 'leadership' | 'volunteering' | 'mentoring' | 'advocacy';
  description: string;
  participants: number;
  hoursContributed?: number;
  beneficiaries?: number;
}

export interface AlumniAnalysis {
  totalAlumni: number;
  activeAlumni: number;
  engagementRate: number;
  
  // Contributions
  contributions: AlumniContribution[];
  
  // Success stories
  successStories: SuccessStory[];
  
  // Network effects
  networkStrength: number;
  connectionDensity: number;
}

export interface AlumniContribution {
  type: 'mentoring' | 'financial' | 'advocacy' | 'employment' | 'partnership';
  contributors: number;
  value: any;
  description: string;
}

export interface SuccessStory {
  id: string;
  alumnus: string;
  achievement: string;
  programInfluence: string;
  currentRole?: string;
  inspiring?: boolean;
}

export interface CostBenefitAnalysis {
  // Costs
  totalCost: number;
  costBreakdown: CostCategory[];
  costPerParticipant: number;
  costPerOutcome: Record<string, number>;
  
  // Benefits
  monetizedBenefits?: MonetizedBenefit[];
  nonMonetizedBenefits: NonMonetizedBenefit[];
  
  // Ratios
  benefitCostRatio?: number;
  socialReturnOnInvestment?: number;
  
  // Comparison
  sectorBenchmark?: number;
  efficiency: EfficiencyRating;
}

export interface CostCategory {
  category: string;
  amount: number;
  percentage: number;
  necessary: boolean;
  optimizable?: boolean;
}

export interface MonetizedBenefit {
  benefit: string;
  value: number;
  methodology: string;
  confidence: number;
  timeframe: string;
}

export interface NonMonetizedBenefit {
  benefit: string;
  beneficiaries: number;
  significance: SignificanceLevel;
  evidence: string[];
  proxy?: string;
}

export enum EfficiencyRating {
  HIGHLY_EFFICIENT = 'highly_efficient',
  EFFICIENT = 'efficient',
  MODERATE = 'moderate',
  INEFFICIENT = 'inefficient'
}

export interface LearningAnalysis {
  // Key learnings
  keyLearnings: Learning[];
  
  // Best practices
  bestPractices: BestPractice[];
  
  // Innovations
  innovations: Innovation[];
  
  // Failures
  failures?: Failure[];
  
  // Knowledge products
  knowledgeProducts?: KnowledgeProduct[];
}

export interface Learning {
  id: string;
  category: string;
  learning: string;
  evidence: string[];
  applicability: string[];
  shared?: boolean;
}

export interface BestPractice {
  practice: string;
  description: string;
  effectiveness: number;
  conditions: string[];
  transferability: number;
  documentation?: string;
}

export interface Innovation {
  name: string;
  description: string;
  type: 'process' | 'product' | 'service' | 'model';
  impact: string;
  scalability: number;
  intellectual_property?: string;
}

export interface Failure {
  description: string;
  causes: string[];
  impact: string;
  lessonsLearned: string[];
  preventionMeasures?: string[];
}

export interface KnowledgeProduct {
  title: string;
  type: 'report' | 'toolkit' | 'guide' | 'video' | 'course';
  audience: string[];
  dissemination: number;
  utilization?: number;
  feedback?: string;
}

export interface ProgramRecommendations {
  // Strategic
  strategic: Recommendation[];
  
  // Operational
  operational: Recommendation[];
  
  // Scaling
  scaling?: ScalingRecommendation[];
  
  // Sustainability
  sustainability: SustainabilityRecommendation[];
  
  // Innovation
  innovation?: InnovationRecommendation[];
}

export interface ScalingRecommendation extends Recommendation {
  scalingStrategy: 'replication' | 'adaptation' | 'inspiration' | 'system_change';
  readiness: number;
  requirements: ScalingRequirement[];
  risks: Risk[];
}

export interface ScalingRequirement {
  requirement: string;
  currentStatus: 'met' | 'partial' | 'not_met';
  actions?: string[];
  timeline?: string;
}

export interface Risk {
  risk: string;
  likelihood: number;
  impact: number;
  mitigation: string[];
}

export interface SustainabilityRecommendation extends Recommendation {
  dimension: 'financial' | 'institutional' | 'community' | 'environmental';
  currentStatus: number;
  targetStatus: number;
  pathway: string[];
  milestones: SustainabilityMilestone[];
}

export interface SustainabilityMilestone {
  milestone: string;
  target: any;
  deadline: Date;
  responsible?: string;
}

export interface InnovationRecommendation extends Recommendation {
  innovationType: string;
  potential: number;
  feasibility: number;
  resources: ResourceRequirement[];
  partners?: string[];
}

// Regional Analysis
export interface RegionalAnalysis {
  region: string;
  
  // Coverage
  coverage: RegionalCoverage;
  
  // Demographics
  demographics: RegionalDemographics;
  
  // Programs
  programs: RegionalPrograms;
  
  // Outcomes
  outcomes: RegionalOutcomes;
  
  // Context
  context: RegionalContext;
  
  // Comparison
  comparison: RegionalComparison;
  
  // Opportunities
  opportunities: RegionalOpportunities;
}

export interface RegionalCoverage {
  area: number;
  population: number;
  reachedPopulation: number;
  penetrationRate: number;
  
  // Distribution
  urbanRural: UrbanRuralDistribution;
  byState?: StateCoverage[];
  
  // Growth
  growthTimeline: GrowthEvent[];
  projectedGrowth: number;
}

export interface StateCoverage {
  state: string;
  sites: number;
  participants: number;
  penetration: number;
  performance?: number;
}

export interface GrowthEvent {
  date: Date;
  type: 'expansion' | 'consolidation' | 'partnership';
  description: string;
  impact: number;
}

export interface RegionalDemographics {
  composition: DetailedDemographics;
  uniqueCharacteristics: string[];
  challenges: DemographicChallenge[];
  opportunities: string[];
}

export interface DemographicChallenge {
  challenge: string;
  affected: number;
  severity: Severity;
  strategies?: string[];
}

export interface RegionalPrograms {
  activePrograms: Program[];
  programDiversity: number;
  
  // Performance
  topPerforming: Program[];
  struggling?: Program[];
  
  // Adaptation
  regionalAdaptations: RegionalAdaptation[];
  innovativeApproaches?: string[];
}

export interface Program {
  id: string;
  name: string;
  type: string;
  participants: number;
  duration: string;
  outcomes: number;
  performance: number;
}

export interface RegionalAdaptation {
  program: string;
  adaptation: string;
  reason: string;
  effectiveness: number;
  adopted_elsewhere?: boolean;
}

export interface RegionalOutcomes {
  overview: OutcomeOverview;
  byCategory: OutcomeCategoryAnalysis[];
  
  // Unique outcomes
  uniqueOutcomes?: UniqueOutcome[];
  
  // Success factors
  successFactors: string[];
  
  // Challenges
  outcomeChallenges?: OutcomeChallenge[];
}

export interface OutcomeOverview {
  totalOutcomes: number;
  achievementRate: number;
  qualityScore: number;
  sustainabilityScore: number;
  trend: TrendDirection;
}

export interface UniqueOutcome {
  outcome: string;
  description: string;
  participants: number;
  significance: SignificanceLevel;
  replicability?: number;
}

export interface OutcomeChallenge {
  challenge: string;
  impact: string;
  affectedOutcomes: string[];
  mitigation?: string[];
}

export interface RegionalContext {
  // Socioeconomic
  socioeconomic: SocioeconomicContext;
  
  // Cultural
  cultural: CulturalContext;
  
  // Political
  political?: PoliticalContext;
  
  // Environmental
  environmental?: EnvironmentalContext;
  
  // Infrastructure
  infrastructure: InfrastructureContext;
}

export interface SocioeconomicContext {
  economicIndicators: EconomicIndicator[];
  socialIndicators: SocialIndicator[];
  challenges: string[];
  opportunities: string[];
}

export interface EconomicIndicator {
  indicator: string;
  value: number;
  trend: TrendDirection;
  comparison: string;
}

export interface SocialIndicator {
  indicator: string;
  value: any;
  assessment: string;
  relevance: string;
}

export interface CulturalContext {
  dominantCultures: string[];
  languages: string[];
  traditions: string[];
  culturalAssets: string[];
  sensitivities: string[];
}

export interface PoliticalContext {
  stability: string;
  supportLevel: string;
  policies: PolicyEnvironment;
  risks?: string[];
}

export interface PolicyEnvironment {
  supportive: string[];
  neutral: string[];
  challenging: string[];
  advocacy?: string[];
}

export interface EnvironmentalContext {
  climate: string;
  challenges: string[];
  opportunities: string[];
  sustainability: string[];
}

export interface InfrastructureContext {
  transportation: string;
  communication: string;
  digital: string;
  utilities: string;
  adequacy: number;
}

export interface RegionalComparison {
  // Performance vs other regions
  performanceRanking: number;
  strengthRanking: Record<string, number>;
  
  // Benchmarking
  benchmarks: RegionalBenchmark[];
  
  // Best practices
  exportablePractices: string[];
  importablePractices: string[];
}

export interface RegionalBenchmark {
  metric: string;
  regional: number;
  national: number;
  global?: number;
  percentile: number;
}

export interface RegionalOpportunities {
  // Growth
  growthOpportunities: GrowthOpportunity[];
  
  // Partnerships
  partnershipOpportunities: PartnershipOpportunity[];
  
  // Innovation
  innovationOpportunities: string[];
  
  // Resources
  untappedResources: string[];
  
  // Priority actions
  priorities: RegionalPriority[];
}

export interface GrowthOpportunity {
  area: string;
  potential: number;
  requirements: string[];
  timeline: string;
  strategy?: string;
}

export interface PartnershipOpportunity {
  partner: string;
  type: string;
  potential: string;
  alignment: number;
  nextSteps?: string[];
}

export interface RegionalPriority {
  priority: string;
  urgency: Priority;
  impact: number;
  resources: string[];
  timeline: string;
  responsible?: string[];
}

// Cohort Analysis
export interface CohortAnalysis {
  cohortId: string;
  
  // Definition
  definition: CohortDefinition;
  
  // Composition
  composition: CohortComposition;
  
  // Journey
  journey: CohortJourney;
  
  // Outcomes
  outcomes: CohortOutcomes;
  
  // Comparison
  comparison: CohortComparison;
  
  // Insights
  insights: CohortInsights;
}

export interface CohortDefinition {
  name: string;
  criteria: string[];
  startDate: Date;
  endDate?: Date;
  size: number;
  purpose?: string;
}

export interface CohortComposition {
  demographics: DetailedDemographics;
  baseline: BaselineCharacteristics;
  segments: CohortSegment[];
  homogeneity: number;
}

export interface BaselineCharacteristics {
  skills: Record<string, number>;
  knowledge: Record<string, number>;
  attitudes: Record<string, number>;
  circumstances: Record<string, any>;
}

export interface CohortSegment {
  name: string;
  size: number;
  characteristics: string[];
  performance?: SegmentPerformance;
}

export interface SegmentPerformance {
  completion: number;
  outcomes: number;
  satisfaction: number;
  differentiators?: string[];
}

export interface CohortJourney {
  timeline: CohortTimeline;
  progression: ProgressionAnalysis;
  engagement: EngagementAnalysis;
  support: SupportAnalysis;
}

export interface CohortTimeline {
  milestones: CohortMilestone[];
  phases: CohortPhase[];
  criticalEvents?: CriticalEvent[];
}

export interface CohortMilestone {
  milestone: string;
  date: Date;
  achievers: number;
  percentage: number;
  significance?: string;
}

export interface CohortPhase {
  phase: string;
  start: Date;
  end: Date;
  focus: string[];
  outcomes: string[];
  challenges?: string[];
}

export interface CriticalEvent {
  event: string;
  date: Date;
  impact: string;
  affected: number;
  response?: string;
}

export interface ProgressionAnalysis {
  completionRate: number;
  progressionSpeed: string;
  
  // Pathways
  pathways: ProgressionPathway[];
  
  // Barriers
  barriers: ProgressionBarrier[];
  
  // Accelerators
  accelerators: string[];
}

export interface ProgressionPathway {
  pathway: string;
  followers: number;
  successRate: number;
  duration: string;
  characteristics?: string[];
}

export interface ProgressionBarrier {
  barrier: string;
  affected: number;
  impact: string;
  solutions?: string[];
  resolved?: boolean;
}

export interface EngagementAnalysis {
  overall: number;
  byPhase: Record<string, number>;
  
  // Patterns
  patterns: EngagementPattern[];
  
  // Drivers
  drivers: string[];
  inhibitors: string[];
}

export interface EngagementPattern {
  pattern: string;
  frequency: number;
  correlation?: string;
  impact?: string;
}

export interface SupportAnalysis {
  typesReceived: SupportType[];
  effectiveness: Record<string, number>;
  gaps?: SupportGap[];
  innovations?: string[];
}

export interface SupportType {
  type: string;
  recipients: number;
  frequency: string;
  satisfaction: number;
  impact?: string;
}

export interface SupportGap {
  need: string;
  affected: number;
  severity: Severity;
  proposed?: string;
}

export interface CohortOutcomes {
  summary: OutcomeSummary;
  individual: IndividualOutcomes;
  collective: CollectiveOutcomes;
  sustainability: SustainabilityAnalysis;
}

export interface OutcomeSummary {
  achieved: number;
  partial: number;
  notAchieved: number;
  unexpected?: number;
  quality: number;
}

export interface IndividualOutcomes {
  skills: SkillDevelopment[];
  knowledge: KnowledgeGain[];
  attitudes: AttitudeShift[];
  behaviors: BehaviorChange[];
  achievements: Achievement[];
}

export interface SkillDevelopment {
  skill: string;
  gainers: number;
  averageGain: number;
  mastery: number;
  application?: number;
}

export interface KnowledgeGain {
  area: string;
  improvement: number;
  retention?: number;
  application?: number;
}

export interface AttitudeShift {
  attitude: string;
  baseline: number;
  current: number;
  shift: number;
  sustained?: boolean;
}

export interface Achievement {
  achievement: string;
  achievers: number;
  significance: SignificanceLevel;
  recognition?: string;
}

export interface CollectiveOutcomes {
  networkStrength: number;
  collaborations: number;
  collectiveAction: CollectiveAction[];
  systemsChange?: SystemChange[];
}

export interface CollectiveAction {
  action: string;
  participants: number;
  impact: string;
  sustained?: boolean;
}

export interface SystemChange {
  change: string;
  level: 'local' | 'regional' | 'national';
  evidence: string[];
  attribution?: number;
}

export interface CohortComparison {
  // vs other cohorts
  performance: ComparativePerformance;
  
  // vs benchmarks
  benchmarks: CohortBenchmark[];
  
  // Unique factors
  differentiators: string[];
  
  // Lessons
  lessons: ComparativeLesson[];
}

export interface ComparativePerformance {
  ranking: number;
  totalCohorts: number;
  strengths: string[];
  weaknesses: string[];
  trend: TrendDirection;
}

export interface CohortBenchmark {
  metric: string;
  cohort: number;
  benchmark: number;
  gap: number;
  significance?: string;
}

export interface ComparativeLesson {
  lesson: string;
  evidence: string[];
  applicability: string[];
  implemented?: boolean;
}

export interface CohortInsights {
  keyInsights: Insight[];
  successFactors: string[];
  recommendations: CohortRecommendation[];
  futureTracking?: string[];
}

export interface Insight {
  insight: string;
  type: 'discovery' | 'confirmation' | 'surprise' | 'concern';
  evidence: string[];
  implications: string[];
  actions?: string[];
}

export interface CohortRecommendation extends Recommendation {
  targetCohorts?: string[];
  conditions?: string[];
}

// Longitudinal Analysis
export interface ParticipantJourney {
  participantId: string;
  
  // Timeline
  timeline: JourneyTimeline;
  
  // Transformation
  transformation: TransformationAnalysis;
  
  // Relationships
  relationships: RelationshipAnalysis;
  
  // Impact
  impact: IndividualImpact;
  
  // Future
  trajectory: FutureTrajectory;
}

export interface JourneyTimeline {
  startDate: Date;
  milestones: JourneyMilestone[];
  currentStage: string;
  totalDuration: string;
  intensity: IntensityProfile;
}

export interface JourneyMilestone {
  date: Date;
  event: string;
  type: 'entry' | 'achievement' | 'challenge' | 'transition';
  significance: SignificanceLevel;
  outcome?: string;
}

export interface IntensityProfile {
  periods: IntensityPeriod[];
  average: number;
  peak: number;
  consistency: number;
}

export interface IntensityPeriod {
  start: Date;
  end: Date;
  level: number;
  activities: string[];
}

export interface TransformationAnalysis {
  dimensions: TransformationDimension[];
  overall: TransformationScore;
  narrative: TransformationNarrative;
  evidence: TransformationEvidence[];
}

export interface TransformationDimension {
  dimension: string;
  baseline: any;
  current: any;
  change: any;
  trajectory: TrendDirection;
  sustainability?: number;
}

export interface TransformationScore {
  magnitude: number;
  breadth: number;
  depth: number;
  sustainability: number;
  overall: number;
}

export interface TransformationNarrative {
  summary: string;
  keyMoments: string[];
  turningPoints: TurningPoint[];
  themes: string[];
}

export interface TurningPoint {
  date: Date;
  event: string;
  trigger: string;
  outcome: string;
  lasting?: boolean;
}

export interface TransformationEvidence {
  type: EvidenceType;
  description: string;
  date: Date;
  source: string;
  strength: number;
}

export interface RelationshipAnalysis {
  network: NetworkMetrics;
  mentors: MentorRelationship[];
  peers: PeerRelationship[];
  community: CommunityRelationship[];
}

export interface NetworkMetrics {
  size: number;
  density: number;
  diversity: number;
  quality: number;
  influence: number;
}

export interface MentorRelationship {
  mentorId: string;
  duration: string;
  quality: number;
  impact: string[];
  ongoing?: boolean;
}

export interface PeerRelationship {
  peerId: string;
  type: 'collaboration' | 'friendship' | 'support';
  strength: number;
  mutual?: boolean;
}

export interface CommunityRelationship {
  role: string;
  contribution: string;
  recognition?: string;
  influence?: number;
}

export interface IndividualImpact {
  personal: PersonalImpact;
  social: SocialImpact;
  economic?: EconomicImpact;
  rippleEffect: RippleEffect;
}

export interface PersonalImpact {
  wellbeing: number;
  confidence: number;
  skills: string[];
  achievements: string[];
  identity?: string;
}

export interface SocialImpact {
  relationships: number;
  leadership: string[];
  contribution: string[];
  influence: number;
}

export interface EconomicImpact {
  employment?: string;
  income?: string;
  economicMobility?: number;
  entrepreneurship?: string;
}

export interface RippleEffect {
  directImpact: number;
  indirectImpact: number;
  influencedPeople: number;
  inspiredActions: string[];
  systemicChange?: string[];
}

export interface FutureTrajectory {
  predictions: Prediction[];
  opportunities: Opportunity[];
  risks: Risk[];
  recommendations: string[];
  potential: PotentialAssessment;
}

export interface Prediction {
  outcome: string;
  probability: number;
  timeframe: string;
  conditions: string[];
  confidence: number;
}

export interface Opportunity {
  opportunity: string;
  readiness: number;
  requirements: string[];
  potentialImpact: string;
  support?: string[];
}

export interface PotentialAssessment {
  leadership: number;
  innovation: number;
  influence: number;
  contribution: number;
  overall: number;
}

// Transformation Metrics
export interface TransformationCriteria {
  population: string;
  dimensions: TransformationDimension[];
  timeframe: TimeFrame;
  baseline?: BaselineCriteria;
  controls?: ControlGroup[];
}

export interface BaselineCriteria {
  source: 'pre-program' | 'matched-control' | 'historical';
  data: any;
  quality: number;
}

export interface ControlGroup {
  id: string;
  size: number;
  matching: MatchingCriteria;
  data: any;
}

export interface MatchingCriteria {
  variables: string[];
  method: 'exact' | 'propensity' | 'statistical';
  quality: number;
}

export interface TransformationMetrics {
  overall: OverallTransformation;
  individual: IndividualTransformation[];
  collective: CollectiveTransformation;
  systemic: SystemicTransformation;
  sustainability: TransformationSustainability;
}

export interface OverallTransformation {
  transformationRate: number;
  averageMagnitude: number;
  sustainabilityRate: number;
  
  // Distribution
  distribution: TransformationDistribution;
  
  // Patterns
  patterns: TransformationPattern[];
  
  // Comparison
  vsBaseline?: number;
  vsControl?: number;
  
  // Significance
  statisticalSignificance?: number;
  practicalSignificance: SignificanceLevel;
}

export interface TransformationDistribution {
  high: number;
  moderate: number;
  low: number;
  none: number;
  negative?: number;
}

export interface TransformationPattern {
  pattern: string;
  frequency: number;
  characteristics: string[];
  predictors?: string[];
}

export interface IndividualTransformation {
  participantId: string;
  score: number;
  dimensions: DimensionScore[];
  trajectory: string;
  sustained: boolean;
  spillover?: SpilloverEffect[];
}

export interface DimensionScore {
  dimension: string;
  baseline: number;
  current: number;
  change: number;
  percentile?: number;
}

export interface SpilloverEffect {
  area: string;
  effect: string;
  magnitude: number;
  evidence?: string[];
}

export interface CollectiveTransformation {
  groupCohesion: number;
  collectiveEfficacy: number;
  sharedPurpose: number;
  networkEffects: NetworkEffect[];
  emergentOutcomes: EmergentOutcome[];
}

export interface NetworkEffect {
  type: string;
  strength: number;
  reach: number;
  description: string;
}

export interface EmergentOutcome {
  outcome: string;
  emergence: string;
  participants: number;
  significance: SignificanceLevel;
}

export interface SystemicTransformation {
  level: 'local' | 'regional' | 'national' | 'global';
  changes: SystemicChange[];
  adoption: AdoptionMetrics;
  institutionalization: InstitutionalizationLevel;
}

export interface SystemicChange {
  change: string;
  type: 'policy' | 'practice' | 'mindset' | 'structure';
  evidence: string[];
  permanence?: number;
}

export interface AdoptionMetrics {
  adopters: number;
  adoptionRate: number;
  diffusion: DiffusionStage;
  barriers?: string[];
}

export enum DiffusionStage {
  INNOVATION = 'innovation',
  EARLY_ADOPTION = 'early_adoption',
  EARLY_MAJORITY = 'early_majority',
  LATE_MAJORITY = 'late_majority',
  LAGGARDS = 'laggards'
}

export enum InstitutionalizationLevel {
  INFORMAL = 'informal',
  EMERGING = 'emerging',
  ESTABLISHED = 'established',
  EMBEDDED = 'embedded'
}

export interface TransformationSustainability {
  overallSustainability: number;
  
  // Factors
  factors: SustainabilityFactor[];
  
  // Projections
  projections: SustainabilityProjection[];
  
  // Strategies
  strategies: SustainabilityStrategy[];
}

export interface SustainabilityFactor {
  factor: string;
  influence: 'positive' | 'negative';
  strength: number;
  modifiable: boolean;
}

export interface SustainabilityProjection {
  timeframe: string;
  probability: number;
  scenario: string;
  assumptions: string[];
}

export interface SustainabilityStrategy {
  strategy: string;
  target: string;
  effectiveness: number;
  requirements: string[];
  timeline?: string;
}

// Predictive Analytics
export interface PredictionContext {
  // Target
  targetPopulation: string;
  targetOutcomes: string[];
  
  // Data
  historicalData: HistoricalData;
  currentConditions: CurrentConditions;
  
  // Model
  modelType?: ModelType;
  confidence?: number;
  
  // Scenarios
  scenarios?: Scenario[];
}

export interface HistoricalData {
  timeRange: TimeFrame;
  sampleSize: number;
  quality: number;
  completeness: number;
  biases?: string[];
}

export interface CurrentConditions {
  context: any;
  trends: Trend[];
  risks: Risk[];
  opportunities: Opportunity[];
}

export interface Trend {
  name: string;
  direction: TrendDirection;
  strength: number;
  duration: string;
  impact?: string;
}

export enum ModelType {
  REGRESSION = 'regression',
  CLASSIFICATION = 'classification',
  TIME_SERIES = 'time_series',
  NEURAL_NETWORK = 'neural_network',
  ENSEMBLE = 'ensemble'
}

export interface Scenario {
  name: string;
  probability: number;
  conditions: string[];
  outcomes: PredictedOutcome[];
}

export interface OutcomePrediction {
  predictions: PredictedOutcome[];
  confidence: ConfidenceInterval[];
  assumptions: Assumption[];
  limitations: string[];
  recommendations: PredictiveRecommendation[];
}

export interface PredictedOutcome {
  outcome: string;
  probability: number;
  timeframe: string;
  value?: any;
  range?: ValueRange;
  drivers: Driver[];
}

export interface ValueRange {
  min: any;
  max: any;
  mostLikely: any;
}

export interface Driver {
  factor: string;
  influence: number;
  direction: 'positive' | 'negative';
  controllable: boolean;
}

export interface ConfidenceInterval {
  outcome: string;
  lower: number;
  upper: number;
  level: number; // e.g., 0.95 for 95% CI
}

export interface Assumption {
  assumption: string;
  basis: string;
  sensitivity: number;
  alternative?: string;
}

export interface PredictiveRecommendation extends Recommendation {
  targetOutcome: string;
  improvementPotential: number;
  interventionPoints: InterventionPoint[];
}

export interface InterventionPoint {
  point: string;
  timing: string;
  leverage: number;
  cost?: number;
  feasibility?: number;
}

// Risk Analysis
export interface RiskAnalysis {
  population: string;
  overallRisk: RiskLevel;
  riskFactors: RiskFactor[];
  vulnerableGroups: VulnerableGroup[];
  mitigation: MitigationPlan;
  monitoring: MonitoringPlan;
}

export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  MINIMAL = 'minimal'
}

export interface RiskFactor {
  factor: string;
  prevalence: number;
  impact: number;
  riskScore: number;
  
  // Nature
  type: RiskType;
  controllability: Controllability;
  
  // Affected
  affected: number;
  distribution?: Distribution;
  
  // Trends
  trend: TrendDirection;
  projection?: string;
}

export enum RiskType {
  INDIVIDUAL = 'individual',
  SOCIAL = 'social',
  ECONOMIC = 'economic',
  ENVIRONMENTAL = 'environmental',
  INSTITUTIONAL = 'institutional',
  POLITICAL = 'political'
}

export enum Controllability {
  FULLY_CONTROLLABLE = 'fully_controllable',
  PARTIALLY_CONTROLLABLE = 'partially_controllable',
  INFLUENCEABLE = 'influenceable',
  UNCONTROLLABLE = 'uncontrollable'
}

export interface VulnerableGroup {
  group: string;
  size: number;
  vulnerabilities: Vulnerability[];
  resilience: ResilienceFactors;
  priorityLevel: Priority;
}

export interface Vulnerability {
  type: string;
  severity: Severity;
  causes: string[];
  consequences?: string[];
}

export interface ResilienceFactors {
  strengths: string[];
  resources: string[];
  coping: string[];
  overall: number;
}

export interface MitigationPlan {
  strategies: MitigationStrategy[];
  resources: ResourceAllocation[];
  timeline: MitigationTimeline;
  responsibilities: Responsibility[];
  budget?: number;
}

export interface MitigationStrategy {
  strategy: string;
  target: string;
  approach: string;
  
  // Effectiveness
  effectiveness: number;
  timeToImpact: string;
  
  // Implementation
  requirements: string[];
  barriers?: string[];
  
  // Monitoring
  indicators: string[];
  milestones?: string[];
}

export interface ResourceAllocation {
  resource: string;
  allocation: any;
  purpose: string;
  priority: Priority;
}

export interface MitigationTimeline {
  phases: MitigationPhase[];
  criticalDeadlines: Deadline[];
  dependencies: Dependency[];
}

export interface MitigationPhase {
  phase: string;
  start: Date;
  end: Date;
  objectives: string[];
  deliverables: string[];
}

export interface Deadline {
  deadline: Date;
  deliverable: string;
  responsible: string;
  critical: boolean;
}

export interface Responsibility {
  role: string;
  responsibilities: string[];
  accountable?: string;
  consulted?: string[];
  informed?: string[];
}

export interface MonitoringPlan {
  indicators: MonitoringIndicator[];
  frequency: MonitoringSchedule;
  methods: MonitoringMethod[];
  reporting: ReportingStructure;
  triggers: AlertTrigger[];
}

export interface MonitoringIndicator {
  indicator: string;
  type: 'leading' | 'lagging';
  baseline: any;
  target?: any;
  threshold?: Threshold;
  dataSource: string;
}

export interface Threshold {
  warning: any;
  critical: any;
  action: string;
}

export interface MonitoringSchedule {
  regular: RegularMonitoring[];
  eventBased: EventMonitoring[];
  continuous?: ContinuousMonitoring[];
}

export interface RegularMonitoring {
  activity: string;
  frequency: string;
  responsible: string;
  method: string;
}

export interface EventMonitoring {
  event: string;
  trigger: string;
  response: string;
  responsible: string;
}

export interface ContinuousMonitoring {
  metric: string;
  system: string;
  alerts: Alert[];
}

export interface Alert {
  condition: string;
  severity: Severity;
  recipients: string[];
  action: string;
}

export interface MonitoringMethod {
  method: string;
  description: string;
  tools?: string[];
  frequency: string;
  responsible: string;
}

export interface ReportingStructure {
  reports: ReportType[];
  audiences: ReportAudience[];
  channels: string[];
  escalation: EscalationPath;
}

export interface ReportType {
  name: string;
  frequency: string;
  content: string[];
  format: string;
  audience: string[];
}

export interface ReportAudience {
  audience: string;
  needs: string[];
  frequency: string;
  format: string;
}

export interface EscalationPath {
  levels: EscalationLevel[];
  triggers: string[];
  procedures: string[];
}

export interface EscalationLevel {
  level: number;
  authority: string;
  threshold: string;
  actions: string[];
}

export interface AlertTrigger {
  trigger: string;
  condition: string;
  severity: Severity;
  response: string;
  escalation?: boolean;
}

// Intervention Recommendations
export interface SituationContext {
  // Current state
  population: string;
  challenges: string[];
  resources: string[];
  constraints: string[];
  
  // Goals
  desiredOutcomes: string[];
  timeframe: string;
  
  // Context
  cultural?: string[];
  political?: string[];
  economic?: string[];
}

export interface InterventionRecommendations {
  recommendations: InterventionOption[];
  prioritization: PrioritizationMatrix;
  implementation: ImplementationPlan;
  evaluation: EvaluationFramework;
}

export interface InterventionOption {
  intervention: string;
  description: string;
  
  // Suitability
  fit: FitAssessment;
  
  // Impact
  expectedImpact: ImpactEstimate;
  
  // Requirements
  requirements: InterventionRequirements;
  
  // Evidence
  evidenceBase: EvidenceBase;
  
  // Risks
  risks: Risk[];
  
  // Adaptations
  adaptations?: AdaptationSuggestion[];
}

export interface FitAssessment {
  overall: number;
  cultural: number;
  contextual: number;
  resource: number;
  capacity: number;
  rationale: string;
}

export interface ImpactEstimate {
  magnitude: number;
  reach: number;
  timeToImpact: string;
  sustainability: number;
  confidence: number;
}

export interface InterventionRequirements {
  resources: ResourceRequirement[];
  capacity: CapacityRequirement[];
  partnerships?: string[];
  preconditions?: string[];
}

export interface CapacityRequirement {
  capacity: string;
  current: number;
  required: number;
  gap: number;
  development?: string;
}

export interface EvidenceBase {
  strength: number;
  studies: number;
  contexts: string[];
  outcomes: string[];
  limitations?: string[];
}

export interface AdaptationSuggestion {
  aspect: string;
  original: string;
  suggested: string;
  rationale: string;
  precedent?: string;
}

export interface PrioritizationMatrix {
  criteria: PrioritizationCriteria[];
  scores: PrioritizationScore[];
  recommendations: string[];
}

export interface PrioritizationCriteria {
  criterion: string;
  weight: number;
  rationale: string;
}

export interface PrioritizationScore {
  intervention: string;
  scores: Record<string, number>;
  weightedScore: number;
  rank: number;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  timeline: ImplementationTimeline;
  resources: ResourcePlan;
  risks: RiskManagementPlan;
  communication: CommunicationPlan;
}

export interface ImplementationPhase {
  phase: string;
  objectives: string[];
  activities: Activity[];
  deliverables: string[];
  duration: string;
  dependencies?: string[];
}

export interface Activity {
  activity: string;
  responsible: string;
  participants?: string[];
  resources: string[];
  output: string;
}

export interface ImplementationTimeline {
  start: Date;
  milestones: ImplementationMilestone[];
  criticalPath: string[];
  buffer?: string;
}

export interface ImplementationMilestone {
  milestone: string;
  date: Date;
  deliverables: string[];
  successCriteria: string[];
  responsible: string;
}

export interface ResourcePlan {
  budget: BudgetPlan;
  human: HumanResourcePlan;
  material: MaterialResourcePlan;
  technical?: TechnicalResourcePlan;
}

export interface BudgetPlan {
  total: number;
  byPhase: Record<string, number>;
  byCategory: Record<string, number>;
  contingency: number;
  sources?: FundingSource[];
}

export interface FundingSource {
  source: string;
  amount: number;
  status: 'secured' | 'pending' | 'potential';
  conditions?: string[];
}

export interface HumanResourcePlan {
  roles: RoleDefinition[];
  recruitment?: RecruitmentPlan;
  training: TrainingPlan;
  supervision: SupervisionStructure;
}

export interface RoleDefinition {
  role: string;
  responsibilities: string[];
  qualifications: string[];
  fte: number;
  duration: string;
}

export interface RecruitmentPlan {
  positions: number;
  timeline: string;
  strategy: string;
  budget: number;
}

export interface TrainingPlan {
  programs: TrainingProgram[];
  schedule: string;
  budget: number;
  evaluation: string;
}

export interface TrainingProgram {
  program: string;
  participants: string[];
  duration: string;
  objectives: string[];
  method: string;
}

export interface SupervisionStructure {
  levels: SupervisionLevel[];
  ratios: Record<string, number>;
  support: string[];
}

export interface SupervisionLevel {
  level: string;
  supervisor: string;
  supervisees: string[];
  frequency: string;
}

export interface MaterialResourcePlan {
  items: MaterialRequirement[];
  procurement: ProcurementPlan;
  distribution: DistributionPlan;
  management: ResourceManagement;
}

export interface MaterialRequirement {
  item: string;
  quantity: number;
  specifications?: string;
  purpose: string;
  timeline: string;
}

export interface ProcurementPlan {
  strategy: string;
  suppliers?: string[];
  timeline: string;
  quality: string;
}

export interface DistributionPlan {
  method: string;
  schedule: string;
  tracking: string;
  accountability: string;
}

export interface ResourceManagement {
  storage?: string;
  inventory: string;
  maintenance?: string;
  disposal?: string;
}

export interface TechnicalResourcePlan {
  systems: TechnicalSystem[];
  infrastructure?: string[];
  support: TechnicalSupport;
  security: SecurityPlan;
}

export interface TechnicalSystem {
  system: string;
  purpose: string;
  requirements: string[];
  cost?: number;
  maintenance?: string;
}

export interface TechnicalSupport {
  type: string;
  provider?: string;
  availability: string;
  cost?: number;
}

export interface SecurityPlan {
  measures: string[];
  responsible: string;
  audit: string;
  incident: string;
}

export interface RiskManagementPlan {
  risks: IdentifiedRisk[];
  mitigation: RiskMitigation[];
  contingency: ContingencyPlan[];
  monitoring: RiskMonitoring;
}

export interface IdentifiedRisk {
  risk: string;
  likelihood: number;
  impact: number;
  category: string;
  owner: string;
}

export interface RiskMitigation {
  risk: string;
  strategy: string;
  actions: string[];
  responsible: string;
  timeline: string;
}

export interface ContingencyPlan {
  scenario: string;
  trigger: string;
  response: string[];
  responsible: string;
  resources?: string[];
}

export interface RiskMonitoring {
  indicators: string[];
  frequency: string;
  reporting: string;
  review: string;
}

export interface CommunicationPlan {
  objectives: string[];
  audiences: CommunicationAudience[];
  messages: KeyMessage[];
  channels: CommunicationChannel[];
  schedule: CommunicationSchedule;
}

export interface CommunicationAudience {
  audience: string;
  needs: string[];
  influencers?: string[];
  barriers?: string[];
}

export interface KeyMessage {
  message: string;
  audience: string[];
  medium: string[];
  timing: string;
}

export interface CommunicationChannel {
  channel: string;
  purpose: string;
  frequency: string;
  responsible: string;
}

export interface CommunicationSchedule {
  regular: RegularCommunication[];
  milestone: MilestoneCommunication[];
  responsive: ResponsiveCommunication[];
}

export interface RegularCommunication {
  type: string;
  frequency: string;
  audience: string[];
  content: string[];
}

export interface MilestoneCommunication {
  milestone: string;
  communication: string;
  audience: string[];
  method: string;
}

export interface ResponsiveCommunication {
  trigger: string;
  response: string;
  timeline: string;
  responsible: string;
}

export interface EvaluationFramework {
  purpose: string[];
  questions: EvaluationQuestion[];
  design: EvaluationDesign;
  methods: EvaluationMethod[];
  timeline: EvaluationTimeline;
  utilization: UtilizationPlan;
}

export interface EvaluationQuestion {
  question: string;
  type: 'process' | 'outcome' | 'impact';
  priority: Priority;
  indicators: string[];
}

export interface EvaluationDesign {
  type: 'experimental' | 'quasi-experimental' | 'observational' | 'mixed';
  comparison?: string;
  sampling: SamplingStrategy;
  ethics: EthicsConsiderations;
}

export interface SamplingStrategy {
  method: string;
  size: number;
  criteria?: string[];
  representation: string[];
}

export interface EthicsConsiderations {
  approval?: string;
  consent: string;
  confidentiality: string;
  beneficence: string;
}

export interface EvaluationMethod {
  method: string;
  purpose: string;
  tools: string[];
  participants: string;
  frequency?: string;
}

export interface EvaluationTimeline {
  baseline?: Date;
  midline?: Date;
  endline: Date;
  followUp?: Date[];
}

export interface UtilizationPlan {
  users: string[];
  products: EvaluationProduct[];
  dissemination: DisseminationStrategy;
  application: ApplicationSupport;
}

export interface EvaluationProduct {
  product: string;
  audience: string[];
  format: string;
  timeline: string;
}

export interface DisseminationStrategy {
  channels: string[];
  events?: string[];
  publications?: string[];
  creative?: string[];
}

export interface ApplicationSupport {
  facilitation?: string;
  tools?: string[];
  followUp: string;
  adaptation: string;
}

// Visualization Types
export interface ImpactMap {
  type: 'geographic' | 'network' | 'flow' | 'heat';
  data: MapData;
  layers: MapLayer[];
  interactions: MapInteraction[];
  legend: MapLegend;
}

export interface MapData {
  points: MapPoint[];
  connections?: MapConnection[];
  regions?: MapRegion[];
  metrics: Record<string, any>;
}

export interface MapPoint {
  id: string;
  location: Coordinates;
  type: string;
  size: number;
  color: string;
  data: any;
}

export interface MapConnection {
  from: string;
  to: string;
  weight: number;
  type: string;
  animated?: boolean;
}

export interface MapRegion {
  id: string;
  geometry: any;
  value: number;
  color: string;
  pattern?: string;
}

export interface MapLayer {
  id: string;
  type: string;
  visible: boolean;
  opacity: number;
  data: any;
}

export interface MapInteraction {
  type: 'hover' | 'click' | 'zoom' | 'filter';
  action: string;
  target?: string;
}

export interface MapLegend {
  title: string;
  items: LegendItem[];
  position: string;
}

export interface LegendItem {
  symbol: string;
  label: string;
  value?: any;
}

export interface ImpactDashboard {
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshRate?: number;
  exportOptions: ExportOption[];
}

export interface DashboardLayout {
  type: 'grid' | 'flow' | 'tabs';
  columns?: number;
  rows?: number;
  responsive: boolean;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  data: any;
  config: WidgetConfig;
  interactions?: WidgetInteraction[];
}

export enum WidgetType {
  METRIC = 'metric',
  CHART = 'chart',
  MAP = 'map',
  TABLE = 'table',
  TIMELINE = 'timeline',
  NARRATIVE = 'narrative',
  MEDIA = 'media'
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetConfig {
  title?: string;
  subtitle?: string;
  visualization?: any;
  updateFrequency?: number;
  thresholds?: Threshold[];
}

export interface WidgetInteraction {
  type: string;
  action: string;
  target?: string;
}

export interface DashboardFilter {
  id: string;
  type: 'select' | 'range' | 'date' | 'search';
  field: string;
  options?: any[];
  default?: any;
}

export interface ExportOption {
  format: ExportFormat;
  scope: 'dashboard' | 'widget' | 'data';
  filename?: string;
}

export interface ChangeJourney {
  protagonist: JourneyProtagonist;
  timeline: JourneyEvent[];
  transformation: TransformationNarrative;
  impact: ImpactNarrative;
  media?: MediaAsset[];
}

export interface JourneyProtagonist {
  type: 'individual' | 'community' | 'organization';
  name: string;
  background: string;
  startingPoint: string;
  aspirations: string[];
}

export interface JourneyEvent {
  date: Date;
  event: string;
  type: 'challenge' | 'intervention' | 'milestone' | 'outcome';
  description: string;
  significance: SignificanceLevel;
  evidence?: string[];
}

export interface ImpactNarrative {
  personal?: string;
  social?: string;
  systemic?: string;
  rippleEffects: string[];
  sustainability: string;
}

export interface StoryVisualization {
  format: StoryFormat;
  scenes: StoryScene[];
  narrative: NarrativeStructure;
  interactions: StoryInteraction[];
  shareOptions: ShareOption[];
}

export enum StoryFormat {
  LINEAR = 'linear',
  INTERACTIVE = 'interactive',
  SCROLLYTELLING = 'scrollytelling',
  VIDEO = 'video',
  MULTIMEDIA = 'multimedia'
}

export interface StoryScene {
  id: string;
  type: 'intro' | 'context' | 'challenge' | 'intervention' | 'transformation' | 'impact' | 'reflection';
  content: SceneContent;
  transition?: SceneTransition;
}

export interface SceneContent {
  text?: string;
  media?: MediaAsset[];
  data?: any;
  quote?: Quote;
  callToAction?: string;
}

export interface MediaAsset {
  type: 'image' | 'video' | 'audio' | 'animation';
  url: string;
  caption?: string;
  credit?: string;
  altText?: string;
}

export interface Quote {
  text: string;
  author: string;
  context?: string;
  emphasis?: boolean;
}

export interface SceneTransition {
  type: 'fade' | 'slide' | 'zoom' | 'parallax';
  duration: number;
  trigger: 'auto' | 'scroll' | 'click';
}

export interface NarrativeStructure {
  arc: 'linear' | 'circular' | 'branching';
  voiceType: 'first-person' | 'third-person' | 'multi-voice';
  tone: 'inspirational' | 'educational' | 'reflective' | 'urgent';
  themes: string[];
}

export interface StoryInteraction {
  trigger: string;
  action: string;
  feedback?: string;
}

export interface ShareOption {
  platform: string;
  format: string;
  message?: string;
}

// Reporting
export interface ReportCriteria {
  type: ReportType;
  scope: ReportScope;
  period: TimeFrame;
  audience: ReportAudience;
  sections: ReportSection[];
  format: ReportFormat;
}

export enum ReportType {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  PROGRAM = 'program',
  DONOR = 'donor',
  EVALUATION = 'evaluation',
  LEARNING = 'learning'
}

export interface ReportScope {
  geographic?: string[];
  programs?: string[];
  themes?: string[];
  populations?: string[];
}

export interface ReportAudience {
  primary: string[];
  secondary?: string[];
  needs: string[];
  preferences?: ReportPreference[];
}

export interface ReportPreference {
  aspect: string;
  preference: string;
}

export interface ReportSection {
  title: string;
  type: SectionType;
  content: SectionContent;
  order: number;
  pageBreak?: boolean;
}

export enum SectionType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  INTRODUCTION = 'introduction',
  METHODOLOGY = 'methodology',
  FINDINGS = 'findings',
  ANALYSIS = 'analysis',
  RECOMMENDATIONS = 'recommendations',
  CONCLUSION = 'conclusion',
  APPENDIX = 'appendix'
}

export interface SectionContent {
  narrative?: string;
  data?: any;
  visualizations?: any[];
  tables?: any[];
  quotes?: Quote[];
  cases?: CaseStudy[];
}

export interface CaseStudy {
  title: string;
  summary: string;
  context: string;
  intervention: string;
  outcome: string;
  lessons: string[];
  media?: MediaAsset[];
}

export enum ReportFormat {
  PDF = 'pdf',
  WORD = 'word',
  HTML = 'html',
  INTERACTIVE = 'interactive',
  PRESENTATION = 'presentation'
}

export interface ImpactReport {
  metadata: ReportMetadata;
  summary: ExecutiveSummary;
  sections: ReportSection[];
  appendices?: Appendix[];
  distribution: DistributionPlan;
}

export interface ReportMetadata {
  title: string;
  subtitle?: string;
  authors: string[];
  date: Date;
  version: string;
  language: string;
  accessibility?: AccessibilityFeatures;
}

export interface AccessibilityFeatures {
  altText: boolean;
  screenReaderOptimized: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  simplifiedVersion?: boolean;
}

export interface ExecutiveSummary {
  overview: string;
  keyFindings: string[];
  majorOutcomes: string[];
  recommendations: string[];
  callToAction?: string;
}

export interface Appendix {
  title: string;
  content: any;
  reference: string;
}

export interface DistributionPlan {
  channels: DistributionChannel[];
  embargo?: Date;
  languages?: string[];
  followUp?: FollowUpPlan;
}

export interface DistributionChannel {
  channel: string;
  format: string;
  audience: string[];
  timing: string;
}

export interface FollowUpPlan {
  activities: FollowUpActivity[];
  timeline: string;
  responsible: string[];
}

export interface FollowUpActivity {
  activity: string;
  purpose: string;
  audience: string[];
  timing: string;
}

export interface EvidencePortfolio {
  program: string;
  evidence: CategorizedEvidence;
  quality: QualityAssessment;
  gaps: EvidenceGap[];
  recommendations: EvidenceRecommendation[];
}

export interface CategorizedEvidence {
  quantitative: Evidence[];
  qualitative: Evidence[];
  mixed: Evidence[];
  external: Evidence[];
}

export interface QualityAssessment {
  overall: number;
  criteria: QualityCriterion[];
  strengths: string[];
  weaknesses: string[];
}

export interface QualityCriterion {
  criterion: string;
  score: number;
  justification: string;
}

export interface EvidenceGap {
  area: string;
  importance: Priority;
  description: string;
  strategy?: string;
}

export interface EvidenceRecommendation {
  recommendation: string;
  purpose: string;
  method?: string;
  resources?: string[];
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf',
  POWERPOINT = 'powerpoint',
  TABLEAU = 'tableau',
  POWERBI = 'powerbi'
}

export interface AnalyticsExport {
  format: ExportFormat;
  data: any;
  metadata: ExportMetadata;
  schema?: any;
}

export interface ExportMetadata {
  exported: Date;
  exporter: string;
  filters: any;
  scope: any;
  rowCount?: number;
  fileSize?: number;
}

// Service Implementation
export class ImpactMeasurementService implements ImpactMeasurementSystem {
  constructor(
    private dataStore: DataStore,
    private analyticsEngine: AnalyticsEngine,
    private mlEngine: MachineLearningEngine,
    private visualizationEngine: VisualizationEngine,
    private reportingEngine: ReportingEngine
  ) {}

  async trackOutcome(outcome: OutcomeData): Promise<void> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async measureImpact(criteria: ImpactCriteria): Promise<ImpactAssessment> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async analyzeProgram(programId: string, options?: AnalysisOptions): Promise<ProgramAnalysis> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async analyzeRegion(region: string, timeframe?: TimeFrame): Promise<RegionalAnalysis> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async analyzeCohort(cohortId: string): Promise<CohortAnalysis> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async trackJourney(participantId: string): Promise<ParticipantJourney> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async measureTransformation(criteria: TransformationCriteria): Promise<TransformationMetrics> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async predictOutcomes(context: PredictionContext): Promise<OutcomePrediction> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async identifyRiskFactors(population: string): Promise<RiskAnalysis> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async recommendInterventions(situation: SituationContext): Promise<InterventionRecommendations> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateImpactMap(options: MapOptions): Promise<ImpactMap> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async createImpactDashboard(config: DashboardConfig): Promise<ImpactDashboard> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async buildStoryOfChange(journey: ChangeJourney): Promise<StoryVisualization> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async generateImpactReport(criteria: ReportCriteria): Promise<ImpactReport> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async createEvidencePortfolio(programId: string): Promise<EvidencePortfolio> {
    // Implementation
    throw new Error('Implementation pending');
  }

  async exportAnalytics(format: ExportFormat): Promise<AnalyticsExport> {
    // Implementation
    throw new Error('Implementation pending');
  }
}

// Supporting Services
export interface DataStore {
  save(data: any): Promise<void>;
  get(id: string): Promise<any>;
  query(query: any): Promise<any[]>;
  aggregate(pipeline: any[]): Promise<any>;
}

export interface AnalyticsEngine {
  analyze(data: any, config: any): Promise<any>;
  compare(datasets: any[], criteria: any): Promise<any>;
  trend(data: any, timeframe: any): Promise<any>;
  forecast(data: any, horizon: any): Promise<any>;
}

export interface MachineLearningEngine {
  train(data: any, config: any): Promise<any>;
  predict(model: any, data: any): Promise<any>;
  classify(data: any, categories: any): Promise<any>;
  cluster(data: any, config: any): Promise<any>;
}

export interface VisualizationEngine {
  createChart(data: any, config: any): Promise<any>;
  createMap(data: any, config: any): Promise<any>;
  createDashboard(config: any): Promise<any>;
  createStory(narrative: any): Promise<any>;
}

export interface ReportingEngine {
  generateReport(template: any, data: any): Promise<any>;
  exportReport(report: any, format: any): Promise<any>;
  scheduleReport(config: any): Promise<any>;
  distributeReport(report: any, channels: any): Promise<any>;
}

// Supporting Types
export interface MapOptions {
  type: string;
  data: any;
  style?: any;
  interactions?: any;
}

export interface DashboardConfig {
  layout: any;
  widgets: any[];
  theme?: any;
  filters?: any[];
}