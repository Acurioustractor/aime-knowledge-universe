/**
 * AIME Master Hoodie Challenge System
 * A comprehensive platform-wide gamification system that tracks learning,
 * engagement, and real-world impact across all AIME Knowledge Universe content
 */

export interface MasterHoodieProfile {
  userId: string;
  displayName: string;
  hoodieEconomicsScore: number;
  totalValue: number;
  earnedHoodies: string[];
  completedChallenges: string[];
  currentChallenges: string[];
  achievements: Achievement[];
  level: number;
  rank: string;
  relationalProfile: RelationalProfile;
  realWorldImpact: RealWorldImpact;
  createdAt: Date | string;
  lastActive: Date | string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'community' | 'impact' | 'indigenous' | 'leadership';
  icon: string;
  value: number;
  earnedAt: Date | string;
  relationshipImpact: string;
}

export interface RelationalProfile {
  mentorshipConnections: number;
  communityContributions: number;
  knowledgeShared: number;
  realRelationshipsBuilt: number;
  indigenousWisdomHonored: number;
}

export interface RealWorldImpact {
  menteeCount: number;
  projectsLed: number;
  communityHoursContributed: number;
  indigenousKnowledgeShared: number;
  systemsChanged: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'systems-thinking' | 'mentorship' | 'community' | 'indigenous-wisdom';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  estimatedTime: string;
  prerequisites: string[];
  steps: ChallengeStep[];
  rewards: HoodieReward[];
  participants: number;
  completionRate: number;
  realWorldApplication: string;
  indigenousWisdom: string;
  isActive: boolean;
  seasonalAvailability?: string[];
}

export interface ChallengeStep {
  id: string;
  title: string;
  description: string;
  type: 'learning' | 'reflection' | 'action' | 'community' | 'creation';
  content: string;
  verification: 'self-report' | 'peer-review' | 'mentor-approval' | 'data-tracking';
  timeEstimate: string;
  resources: string[];
  isCompleted: boolean;
}

export interface HoodieReward {
  hoodieId: string;
  unlockCondition: string;
  bonusValue?: number;
  specialEdition?: boolean;
}

// Master Hoodie Categories - Expanded System
export const MASTER_HOODIE_CATEGORIES = {
  INDIGENOUS_WISDOM: {
    name: 'Indigenous Wisdom',
    description: 'Hoodies earned through deep engagement with Indigenous knowledge systems',
    color: '#8B4513',
    maxHoodies: 25
  },
  NATURE_CONNECTION: {
    name: 'Nature Connection', 
    description: 'Hoodies unlocked through nature-based learning and environmental stewardship',
    color: '#228B22',
    maxHoodies: 20
  },
  SYSTEMS_THINKING: {
    name: 'Systems Thinking',
    description: 'Hoodies for understanding and transforming complex systems',
    color: '#4169E1',
    maxHoodies: 18
  },
  MENTORSHIP_MASTERY: {
    name: 'Mentorship Mastery',
    description: 'Core mentorship principles and practices - the original 18',
    color: '#FF6347',
    maxHoodies: 18
  },
  COMMUNITY_BUILDING: {
    name: 'Community Building',
    description: 'Hoodies for creating and nurturing community connections',
    color: '#9932CC',
    maxHoodies: 15
  },
  REAL_WORLD_IMPACT: {
    name: 'Real World Impact',
    description: 'Hoodies earned through documented real-world change and action',
    color: '#FF4500',
    maxHoodies: 12
  },
  KNOWLEDGE_SYNTHESIS: {
    name: 'Knowledge Synthesis',
    description: 'Advanced hoodies for connecting ideas across disciplines',
    color: '#20B2AA',
    maxHoodies: 10
  },
  LEADERSHIP_EVOLUTION: {
    name: 'Leadership Evolution',
    description: 'Hoodies for developing Indigenous-informed leadership',
    color: '#DC143C',
    maxHoodies: 8
  }
};

// Hoodie Economics Scoring Algorithm
export class HoodieEconomicsEngine {
  
  /**
   * Calculate comprehensive Hoodie Economics Score
   * Factors: Learning depth, community engagement, real-world impact, time consistency
   */
  static calculateScore(profile: MasterHoodieProfile): number {
    const baseScore = profile.totalValue; // Raw hoodie value
    
    // Learning Depth Multiplier (how deep vs surface level)
    const learningDepth = this.calculateLearningDepth(profile);
    
    // Relational Impact Multiplier (real relationships, not digital metrics)
    const relationalImpact = this.calculateRelationalImpact(profile);
    
    // Real World Application Multiplier
    const realWorldMultiplier = this.calculateRealWorldMultiplier(profile);
    
    // Consistency Bonus (regular engagement over time)
    const consistencyBonus = this.calculateConsistencyBonus(profile);
    
    // Indigenous Wisdom Bonus (deep engagement with cultural content)
    const indigenousBonus = this.calculateIndigenousWisdomBonus(profile);
    
    const finalScore = baseScore * 
      (1 + learningDepth) * 
      (1 + relationalImpact) * 
      (1 + realWorldMultiplier) * 
      (1 + consistencyBonus) * 
      (1 + indigenousBonus);
    
    return Math.round(finalScore);
  }
  
  private static calculateLearningDepth(profile: MasterHoodieProfile): number {
    // Measure quality over quantity
    const completedReflections = profile.achievements.filter(a => a.category === 'learning').length;
    const avgTimePerHoodie = this.calculateAverageEngagementTime(profile);
    const crossCategoryLearning = this.calculateCrossCategoryEngagement(profile);
    
    return Math.min(0.5, (completedReflections * 0.1 + avgTimePerHoodie * 0.2 + crossCategoryLearning * 0.3));
  }
  
  private static calculateRelationalImpact(profile: MasterHoodieProfile): number {
    const mentorshipConnections = profile.relationalProfile.mentorshipConnections;
    const communityContributions = profile.relationalProfile.communityContributions;
    const realRelationships = profile.relationalProfile.realRelationshipsBuilt;
    const knowledgeShared = profile.relationalProfile.knowledgeShared;
    const indigenousWisdomHonored = profile.relationalProfile.indigenousWisdomHonored;
    
    // Focus on real relationships and knowledge sharing, not digital metrics
    return Math.min(0.8, (
      mentorshipConnections * 0.15 + // Real mentoring relationships
      realRelationships * 0.2 +      // Genuine connections made
      knowledgeShared * 0.1 +        // Knowledge passed on to others  
      communityContributions * 0.05 + // Community involvement
      indigenousWisdomHonored * 0.1   // Respectful engagement with Indigenous knowledge
    ));
  }
  
  private static calculateRealWorldMultiplier(profile: MasterHoodieProfile): number {
    const impact = profile.realWorldImpact;
    const totalImpact = impact.menteeCount + impact.projectsLed + 
                       (impact.communityHoursContributed / 10) + 
                       impact.systemsChanged * 5;
    
    return Math.min(1.0, totalImpact * 0.1);
  }
  
  private static calculateConsistencyBonus(profile: MasterHoodieProfile): number {
    // Measure engagement over time vs binge learning
    const daysSinceStart = this.daysBetween(profile.createdAt, new Date());
    const daysSinceLastActive = this.daysBetween(profile.lastActive, new Date());
    
    if (daysSinceLastActive > 30) return 0; // Inactive penalty
    
    const consistencyScore = Math.min(daysSinceStart / 365, 1) * 0.3; // Up to 30% for year+ engagement
    return consistencyScore;
  }
  
  private static calculateIndigenousWisdomBonus(profile: MasterHoodieProfile): number {
    const indigenousHoodies = profile.earnedHoodies.filter(id => 
      id.includes('indigenous') || id.includes('cultural') || id.includes('traditional')
    ).length;
    
    const wisdomShared = profile.realWorldImpact.indigenousKnowledgeShared;
    
    return Math.min(0.4, (indigenousHoodies * 0.05 + wisdomShared * 0.1));
  }
  
  private static calculateAverageEngagementTime(profile: MasterHoodieProfile): number {
    // This would be calculated from actual user interaction data
    // For now, return a placeholder based on achievement depth
    return profile.achievements.length > 0 ? 0.1 : 0;
  }
  
  private static calculateCrossCategoryEngagement(profile: MasterHoodieProfile): number {
    const categories = Object.keys(MASTER_HOODIE_CATEGORIES);
    const engagedCategories = categories.filter(cat => 
      profile.earnedHoodies.some(hoodie => hoodie.includes(cat.toLowerCase()))
    );
    
    return Math.min(0.3, engagedCategories.length * 0.05);
  }
  
  private static daysBetween(date1: Date | string, date2: Date | string): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
  }
  
  /**
   * Determine user rank based on Hoodie Economics Score
   */
  static calculateRank(score: number): string {
    if (score >= 50000) return 'Elder'; // Master level
    if (score >= 25000) return 'Wisdom Keeper'; // Expert level
    if (score >= 10000) return 'Knowledge Carrier'; // Advanced
    if (score >= 5000) return 'Learning Warrior'; // Intermediate
    if (score >= 2000) return 'Curious Explorer'; // Beginner+
    if (score >= 500) return 'First Steps'; // Beginner
    return 'New Journey'; // Just started
  }
  
  /**
   * Calculate level progression (1-100 levels)
   */
  static calculateLevel(score: number): number {
    // Exponential level progression to keep engagement
    return Math.min(100, Math.floor(Math.sqrt(score / 100)) + 1);
  }
}

// Platform-wide Activity Tracking
export interface PlatformActivity {
  userId: string;
  activityType: 'lesson_completion' | 'video_watch' | 'content_creation' | 'community_interaction' | 'real_world_action';
  contentId: string;
  contentType: 'mentor_app' | 'imagi_nation_tv' | 'knowledge_hub' | 'community' | 'external';
  engagement: {
    timeSpent: number; // minutes
    completionRate: number; // 0-1
    qualityScore: number; // 0-1 based on interaction depth
    socialShare: boolean;
    reflection: boolean;
  };
  timestamp: Date | string;
  hoodieEarned?: string;
  challengeProgress?: string;
}

export class PlatformTracker {
  
  /**
   * Track activity across all AIME platform content
   */
  static trackActivity(activity: PlatformActivity): void {
    // Store activity
    this.storeActivity(activity);
    
    // Check for new hoodie unlocks
    this.checkHoodieUnlocks(activity);
    
    // Update challenge progress
    this.updateChallengeProgress(activity);
    
    // Calculate new scores
    this.updateUserScores(activity.userId);
  }
  
  private static storeActivity(activity: PlatformActivity): void {
    const activities = this.getStoredActivities();
    activities.push(activity);
    localStorage.setItem('platform-activities', JSON.stringify(activities));
  }
  
  private static getStoredActivities(): PlatformActivity[] {
    const stored = localStorage.getItem('platform-activities');
    return stored ? JSON.parse(stored) : [];
  }
  
  private static checkHoodieUnlocks(activity: PlatformActivity): void {
    // Complex logic to determine if new hoodies should be unlocked
    // based on cross-platform engagement patterns
  }
  
  private static updateChallengeProgress(activity: PlatformActivity): void {
    // Update progress on active challenges
  }
  
  private static updateUserScores(userId: string): void {
    // Recalculate Hoodie Economics Score based on all activities
  }
}