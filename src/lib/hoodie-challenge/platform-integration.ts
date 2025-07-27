/**
 * AIME Platform-Wide Hoodie Challenge Integration
 * Tracks learning and engagement across ALL platform content to award hoodies
 * based on depth of engagement, real-world application, and relationship building
 */

import { HoodieEconomicsEngine, MasterHoodieProfile, PlatformActivity } from './master-hoodie-system';

// Platform Content Types that Can Earn Hoodies
export interface ContentEngagement {
  contentId: string;
  contentType: 'mentor_app' | 'imagi_nation_tv' | 'knowledge_hub' | 'business_cases' | 'stories' | 'tools' | 'research';
  engagementLevel: 'surface' | 'engaged' | 'deep' | 'applied' | 'teaching';
  timeSpent: number; // minutes
  completionActions: string[]; // what they actually did
  reflectionDepth: number; // 0-10 scale
  realWorldApplication?: string;
  knowledgeShared?: string;
  relationshipsFormed?: number;
}

// Cross-Platform Hoodie Earning Algorithm
export class PlatformHoodieEngine {
  
  /**
   * Analyze all platform engagement to determine hoodie earning eligibility
   * This is the MASTER algorithm that looks across everything
   */
  static analyzeForHoodieEarning(userId: string): HoodieEarningOpportunity[] {
    const userActivities = this.getUserActivities(userId);
    const profile = this.getUserProfile(userId);
    
    const opportunities: HoodieEarningOpportunity[] = [];
    
    // 1. Cross-content pattern analysis
    opportunities.push(...this.findCrossContentPatterns(userActivities));
    
    // 2. Depth of engagement analysis  
    opportunities.push(...this.findDeepEngagementPatterns(userActivities));
    
    // 3. Real-world application patterns
    opportunities.push(...this.findRealWorldApplications(userActivities));
    
    // 4. Knowledge synthesis patterns
    opportunities.push(...this.findKnowledgeSynthesis(userActivities));
    
    // 5. Relationship building patterns
    opportunities.push(...this.findRelationshipBuilding(userActivities));
    
    return opportunities.filter(opp => this.meetsHoodieStandards(opp, profile));
  }
  
  private static findCrossContentPatterns(activities: PlatformActivity[]): HoodieEarningOpportunity[] {
    const opportunities: HoodieEarningOpportunity[] = [];
    
    // Example: Someone who watches IMAGI-NATION TV + reads business cases + uses tools = Systems Thinking Hoodie
    const contentTypes = new Set(activities.map(a => a.contentType));
    const timeSpentByType = this.calculateTimeByContentType(activities);
    
    // Systems Thinking Pattern: Engaged across multiple content types showing systems awareness
    if (contentTypes.size >= 4 && 
        timeSpentByType.total > 300 && // 5+ hours total
        this.hasDeepEngagement(activities)) {
      opportunities.push({
        hoodieId: 'systems-integration-hoodie',
        reason: 'Demonstrated systems thinking across multiple knowledge domains',
        evidence: this.gatherSystemsThinkingEvidence(activities),
        requiredActions: ['Complete reflection on systems connections', 'Share one insight with community'],
        estimatedValue: 200
      });
    }
    
    // Indigenous Wisdom Integration Pattern
    if (this.showsIndigenousWisdomIntegration(activities)) {
      opportunities.push({
        hoodieId: 'wisdom-integration-hoodie', 
        reason: 'Deep engagement with Indigenous knowledge across multiple contexts',
        evidence: this.gatherIndigenousEngagementEvidence(activities),
        requiredActions: ['Demonstrate respectful application', 'Share how wisdom changed your perspective'],
        estimatedValue: 250
      });
    }
    
    return opportunities;
  }
  
  private static findDeepEngagementPatterns(activities: PlatformActivity[]): HoodieEarningOpportunity[] {
    const opportunities: HoodieEarningOpportunity[] = [];
    
    // Deep Learning Pattern: Spending significant time, reflecting, applying
    const deepActivities = activities.filter(a => 
      a.engagement.timeSpent > 30 && // 30+ minutes
      a.engagement.qualityScore > 0.7 && // High quality engagement
      a.engagement.reflection === true
    );
    
    if (deepActivities.length >= 5) {
      opportunities.push({
        hoodieId: 'deep-learner-hoodie',
        reason: 'Consistent pattern of deep, reflective engagement with content',
        evidence: `${deepActivities.length} instances of deep learning with average ${this.averageEngagementTime(deepActivities)} minutes per session`,
        requiredActions: ['Write about your learning process', 'Help another person learn something'],
        estimatedValue: 150
      });
    }
    
    return opportunities;
  }
  
  private static findRealWorldApplications(activities: PlatformActivity[]): HoodieEarningOpportunity[] {
    const opportunities: HoodieEarningOpportunity[] = [];
    
    // Real World Action Pattern: Learning + Application
    const applicationsCount = activities.filter(a => 
      a.activityType === 'real_world_action'
    ).length;
    
    const learningWithApplication = activities.filter(a => 
      a.engagement.completionRate > 0.8 && 
      this.hasRealWorldComponent(a)
    );
    
    if (applicationsCount >= 3 || learningWithApplication.length >= 5) {
      opportunities.push({
        hoodieId: 'action-taker-hoodie',
        reason: 'Consistently applies learning to create real-world change',
        evidence: this.gatherApplicationEvidence(activities),
        requiredActions: ['Document one significant real-world impact', 'Mentor someone else to take action'],
        estimatedValue: 300
      });
    }
    
    return opportunities;
  }
  
  private static findKnowledgeSynthesis(activities: PlatformActivity[]): HoodieEarningOpportunity[] {
    // Patterns where someone connects ideas across different areas
    // Creates new content or insights by combining knowledge
    return [];
  }
  
  private static findRelationshipBuilding(activities: PlatformActivity[]): HoodieEarningOpportunity[] {
    // Patterns showing genuine relationship building and knowledge sharing
    return [];
  }
  
  // Helper methods
  private static getUserActivities(userId: string): PlatformActivity[] {
    const stored = localStorage.getItem(`platform-activities-${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
  
  private static getUserProfile(userId: string): MasterHoodieProfile | null {
    const stored = localStorage.getItem(`hoodie-profile-${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  
  private static calculateTimeByContentType(activities: PlatformActivity[]) {
    const byType: Record<string, number> = {};
    let total = 0;
    
    activities.forEach(activity => {
      byType[activity.contentType] = (byType[activity.contentType] || 0) + activity.engagement.timeSpent;
      total += activity.engagement.timeSpent;
    });
    
    return { byType, total };
  }
  
  private static hasDeepEngagement(activities: PlatformActivity[]): boolean {
    return activities.some(a => 
      a.engagement.timeSpent > 45 && 
      a.engagement.qualityScore > 0.8 &&
      a.engagement.reflection === true
    );
  }
  
  private static showsIndigenousWisdomIntegration(activities: PlatformActivity[]): boolean {
    // Check for respectful, deep engagement with Indigenous content across multiple sessions
    const indigenousContent = activities.filter(a => 
      this.isIndigenousContent(a.contentId) && 
      a.engagement.qualityScore > 0.7
    );
    
    return indigenousContent.length >= 3 && 
           this.hasRespectfulEngagement(indigenousContent);
  }
  
  private static isIndigenousContent(contentId: string): boolean {
    // Logic to identify content with Indigenous knowledge
    return contentId.includes('indigenous') || 
           contentId.includes('traditional') ||
           contentId.includes('cultural') ||
           contentId.includes('country') ||
           contentId.includes('wisdom');
  }
  
  private static hasRespectfulEngagement(activities: PlatformActivity[]): boolean {
    // Check for indicators of respectful engagement with Indigenous knowledge
    return activities.every(a => 
      a.engagement.reflection === true && 
      a.engagement.timeSpent > 20
    );
  }
  
  private static hasRealWorldComponent(activity: PlatformActivity): boolean {
    return activity.engagement.completionRate > 0.8 && 
           (activity.activityType === 'real_world_action' || 
            activity.engagement.timeSpent > 60);
  }
  
  private static averageEngagementTime(activities: PlatformActivity[]): number {
    const total = activities.reduce((sum, a) => sum + a.engagement.timeSpent, 0);
    return Math.round(total / activities.length);
  }
  
  private static gatherSystemsThinkingEvidence(activities: PlatformActivity[]): string {
    const contentTypes = new Set(activities.map(a => a.contentType));
    const totalTime = activities.reduce((sum, a) => sum + a.engagement.timeSpent, 0);
    
    return `Engaged across ${contentTypes.size} different content types over ${Math.round(totalTime/60)} hours, showing ability to connect ideas across domains`;
  }
  
  private static gatherIndigenousEngagementEvidence(activities: PlatformActivity[]): string {
    const indigenousActivities = activities.filter(a => this.isIndigenousContent(a.contentId));
    const totalTime = indigenousActivities.reduce((sum, a) => sum + a.engagement.timeSpent, 0);
    
    return `Deep engagement with Indigenous knowledge over ${indigenousActivities.length} sessions totaling ${Math.round(totalTime/60)} hours`;
  }
  
  private static gatherApplicationEvidence(activities: PlatformActivity[]): string {
    const applications = activities.filter(a => a.activityType === 'real_world_action');
    return `Documented ${applications.length} real-world applications of learning`;
  }
  
  private static meetsHoodieStandards(opportunity: HoodieEarningOpportunity, profile: MasterHoodieProfile | null): boolean {
    // Check if the opportunity meets AIME's standards for hoodie earning
    // Must show genuine learning, relationship building, and real-world application
    return opportunity.estimatedValue >= 100 && 
           opportunity.requiredActions.length > 0;
  }
}

export interface HoodieEarningOpportunity {
  hoodieId: string;
  reason: string;
  evidence: string;
  requiredActions: string[];
  estimatedValue: number;
}

// Platform Integration Points
export class PlatformIntegration {
  
  /**
   * Track content engagement across the entire platform
   */
  static trackContentEngagement(engagement: ContentEngagement): void {
    // Convert to platform activity format
    const activity: PlatformActivity = {
      userId: this.getCurrentUserId(),
      activityType: this.mapToActivityType(engagement.engagementLevel),
      contentId: engagement.contentId,
      contentType: engagement.contentType,
      engagement: {
        timeSpent: engagement.timeSpent,
        completionRate: this.calculateCompletionRate(engagement),
        qualityScore: engagement.reflectionDepth / 10,
        socialShare: false, // No social media
        reflection: engagement.reflectionDepth > 5
      },
      timestamp: new Date()
    };
    
    // Store the activity
    this.storeActivity(activity);
    
    // Check for hoodie earning opportunities
    this.checkHoodieOpportunities(activity.userId);
  }
  
  private static getCurrentUserId(): string {
    // Get current user ID - in real app this would come from auth
    return localStorage.getItem('current-user-id') || 'anonymous';
  }
  
  private static mapToActivityType(level: string): PlatformActivity['activityType'] {
    switch(level) {
      case 'applied': return 'real_world_action';
      case 'teaching': return 'community_interaction';
      default: return 'lesson_completion';
    }
  }
  
  private static calculateCompletionRate(engagement: ContentEngagement): number {
    // Calculate based on engagement level and actions taken
    const baseRate = engagement.timeSpent > 30 ? 0.8 : 0.5;
    const actionBonus = engagement.completionActions.length * 0.1;
    return Math.min(1.0, baseRate + actionBonus);
  }
  
  private static storeActivity(activity: PlatformActivity): void {
    const stored = localStorage.getItem(`platform-activities-${activity.userId}`) || '[]';
    const activities: PlatformActivity[] = JSON.parse(stored);
    activities.push(activity);
    localStorage.setItem(`platform-activities-${activity.userId}`, JSON.stringify(activities));
  }
  
  private static checkHoodieOpportunities(userId: string): void {
    const opportunities = PlatformHoodieEngine.analyzeForHoodieEarning(userId);
    
    if (opportunities.length > 0) {
      // Show hoodie earning opportunity to user
      this.presentHoodieOpportunities(opportunities);
    }
  }
  
  private static presentHoodieOpportunities(opportunities: HoodieEarningOpportunity[]): void {
    // Present opportunities to user for completion
    console.log('🏆 New Hoodie Opportunities:', opportunities);
    
    // In real app, this would show in UI
    opportunities.forEach(opp => {
      console.log(`Hoodie Available: ${opp.hoodieId}`);
      console.log(`Reason: ${opp.reason}`);
      console.log(`Evidence: ${opp.evidence}`);
      console.log(`Required Actions: ${opp.requiredActions.join(', ')}`);
    });
  }
}