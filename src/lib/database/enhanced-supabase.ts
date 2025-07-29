/**
 * Enhanced Supabase Client with Philosophy-First Architecture
 * 
 * Provides intelligent content operations, semantic search, and relationship mapping
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Enhanced database types
export interface ContentItem {
  id: string;
  source_id: string;
  source: 'youtube' | 'airtable' | 'mailchimp' | 'github';
  content_type: 'video' | 'tool' | 'newsletter' | 'story' | 'research';
  title: string;
  description?: string;
  content?: string;
  url?: string;
  thumbnail_url?: string;
  
  // Philosophy integration
  philosophy_domain?: string;
  complexity_level: number;
  prerequisite_concepts: string[];
  learning_objectives: string[];
  
  // Enhanced metadata
  metadata: Record<string, any>;
  tags: string[];
  categories: string[];
  authors: string[];
  themes: string[];
  key_concepts: string[];
  
  // Quality metrics
  quality_score: number;
  engagement_score: number;
  view_count: number;
  implementation_count: number;
  is_featured: boolean;
  is_philosophy_primer: boolean;
  
  // Timestamps
  source_created_at?: string;
  source_updated_at?: string;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface PhilosophyPrimer {
  id: string;
  domain: string;
  title: string;
  brief_explanation: string;
  detailed_explanation: string;
  key_principles: string[];
  business_case?: string;
  implementation_overview?: string;
  common_misconceptions: string[];
  success_indicators: string[];
  related_content_ids: string[];
  prerequisite_knowledge: string[];
  complexity_level: number;
  created_at: string;
  updated_at: string;
}

export interface ContentRelationship {
  id: string;
  source_content_id: string;
  target_content_id: string;
  relationship_type: 'implements' | 'supports' | 'contradicts' | 'builds_on' | 'exemplifies' | 'prerequisite_for';
  strength: number;
  context?: string;
  auto_generated: boolean;
  confidence_score: number;
  validated_by?: string;
  validation_date?: string;
  created_at: string;
}

export interface ConceptCluster {
  id: string;
  name: string;
  description?: string;
  philosophy_domain?: string;
  content_ids: string[];
  centrality_score: number;
  complexity_level: number;
  prerequisite_clusters: string[];
  learning_pathway_position: number;
  estimated_learning_time?: number;
  practical_applications: string[];
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  session_id: string;
  user_role?: string;
  interests: string[];
  current_focus_domain?: string;
  engagement_level: number;
  learning_style?: string;
  experience_level: string;
  goals: string[];
  preferred_complexity: number;
  last_active: string;
  created_at: string;
}

// Community-specific types
export interface CommunityUserProfile {
  id: string;
  session_id: string;
  
  // Connection preferences
  geographic_scope: 'local' | 'regional' | 'global';
  relationship_types: ('peer' | 'mentor' | 'mentee')[];
  communication_style: 'structured' | 'casual' | 'mixed';
  availability_windows: TimeWindow[];
  cultural_considerations: string[];
  location_info: LocationInfo;
  
  // Community contributions
  mentorship_hours: number;
  cohort_participations: string[];
  knowledge_shared_count: number;
  connections_made: number;
  
  // Privacy settings
  profile_visibility: 'private' | 'connections' | 'community' | 'public';
  show_location: boolean;
  show_contact_info: boolean;
  allow_direct_messages: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface TimeWindow {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;   // HH:MM format
  end_time: string;     // HH:MM format
  timezone: string;
}

export interface LocationInfo {
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserConnection {
  id: string;
  user_session_id: string;
  connected_session_id: string;
  connection_type: 'peer' | 'mentor_mentee' | 'cohort_member' | 'regional_community';
  relationship_strength: number;
  
  // Connection context
  connection_reason?: string;
  shared_interests: string[];
  mutual_connections: number;
  
  // Interaction tracking
  last_interaction?: string;
  interaction_count: number;
  message_count: number;
  
  // Relationship metadata
  mentor_session_id?: string;
  connection_date: string;
  status: 'pending' | 'active' | 'dormant' | 'ended';
}

export interface ImplementationCohort {
  id: string;
  name: string;
  description?: string;
  philosophy_domain: string;
  implementation_goal: string;
  
  // Configuration
  max_members: number;
  current_member_count: number;
  facilitator_session_ids: string[];
  
  // Timeline
  start_date?: string;
  expected_duration_weeks: number;
  current_phase: 'formation' | 'orientation' | 'active' | 'completion' | 'alumni';
  
  // Resources and tracking
  shared_resources: CohortResource[];
  milestones: CohortMilestone[];
  meeting_schedule: MeetingSchedule;
  
  // Status and metrics
  status: 'forming' | 'active' | 'completed' | 'disbanded';
  completion_rate: number;
  satisfaction_score?: number;
  
  created_at: string;
  updated_at: string;
}

export interface CohortResource {
  id: string;
  title: string;
  type: 'content' | 'tool' | 'template' | 'external_link';
  url?: string;
  content_id?: string;
  description?: string;
  added_by: string;
  added_date: string;
}

export interface CohortMilestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  completion_criteria: string[];
  status: 'pending' | 'in_progress' | 'completed';
  completed_by: string[];
  completion_date?: string;
}

export interface MeetingSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  day_of_week?: number;
  time?: string;
  timezone?: string;
  duration_minutes?: number;
}

export interface CohortMembership {
  id: string;
  cohort_id: string;
  member_session_id: string;
  role: 'member' | 'facilitator' | 'mentor';
  join_date: string;
  status: 'invited' | 'active' | 'inactive' | 'completed' | 'left';
  
  // Progress tracking
  individual_progress: Record<string, any>;
  contributions: CohortContribution[];
  peer_feedback: PeerFeedback[];
  
  // Engagement metrics
  attendance_rate: number;
  participation_score: number;
}

export interface CohortContribution {
  id: string;
  type: 'resource_shared' | 'insight_provided' | 'support_given' | 'milestone_achieved';
  description: string;
  date: string;
  impact_score?: number;
}

export interface PeerFeedback {
  id: string;
  from_session_id: string;
  feedback_type: 'appreciation' | 'suggestion' | 'collaboration_request';
  message: string;
  date: string;
  is_anonymous: boolean;
}

export interface MentorshipRelationship {
  id: string;
  mentor_session_id: string;
  mentee_session_id: string;
  
  // Configuration
  expertise_domains: string[];
  learning_goals: string[];
  meeting_frequency: 'weekly' | 'biweekly' | 'monthly';
  communication_preferences: Record<string, any>;
  
  // Timeline
  start_date: string;
  expected_duration_months: number;
  actual_end_date?: string;
  
  // Progress and outcomes
  goals_achieved: string[];
  milestones_completed: MentorshipMilestone[];
  wisdom_captured: string[];
  
  // Relationship health
  satisfaction_mentor?: number;
  satisfaction_mentee?: number;
  relationship_strength: number;
  
  status: 'pending' | 'active' | 'paused' | 'completed' | 'ended';
}

export interface MentorshipMilestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  completion_date?: string;
  reflection: string;
  impact_assessment: string;
}

export interface RegionalCommunity {
  id: string;
  name: string;
  description?: string;
  
  // Geographic definition
  geographic_type: 'city' | 'region' | 'country' | 'virtual';
  geographic_boundary: GeographicBoundary;
  timezone?: string;
  
  // Governance
  coordinator_session_ids: string[];
  advisor_session_ids: string[];
  decision_making_process: string;
  cultural_protocols: CulturalProtocol[];
  
  // Metrics
  member_count: number;
  active_member_count: number;
  engagement_score: number;
  
  status: 'forming' | 'active' | 'dormant' | 'archived';
  
  created_at: string;
  updated_at: string;
}

export interface GeographicBoundary {
  type: 'city' | 'region' | 'country' | 'virtual';
  name: string;
  coordinates?: {
    center: { latitude: number; longitude: number };
    radius_km?: number;
    boundary_points?: { latitude: number; longitude: number }[];
  };
  description: string;
}

export interface CulturalProtocol {
  id: string;
  title: string;
  description: string;
  context: string;
  guidelines: string[];
  examples: string[];
  importance_level: 'essential' | 'important' | 'recommended';
}

export interface CommunityActivity {
  id: string;
  title: string;
  description?: string;
  activity_type: 'discussion' | 'workshop' | 'mentoring_session' | 'cohort_meeting' | 'regional_event' | 'knowledge_sharing';
  
  // Context
  philosophy_domain?: string;
  related_content_ids: string[];
  facilitator_session_ids: string[];
  
  // Scheduling
  scheduled_start?: string;
  scheduled_end?: string;
  timezone?: string;
  location_type?: 'virtual' | 'in_person' | 'hybrid';
  location_details: Record<string, any>;
  
  // Participation
  max_participants?: number;
  current_participants: number;
  participant_session_ids: string[];
  
  // Outcomes
  outcomes_achieved: string[];
  knowledge_created: KnowledgeArtifact[];
  follow_up_actions: string[];
  
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  
  created_at: string;
  updated_at: string;
}

export interface KnowledgeArtifact {
  id: string;
  title: string;
  type: 'insight' | 'resource' | 'template' | 'case_study' | 'best_practice';
  content: string;
  contributors: string[];
  created_date: string;
  tags: string[];
}

export interface CommunityImpactMetric {
  id: string;
  metric_type: 'individual_growth' | 'relationship_formed' | 'knowledge_shared' | 'implementation_completed' | 'community_milestone';
  
  // Context
  session_id?: string;
  community_id?: string;
  cohort_id?: string;
  activity_id?: string;
  
  // Metric details
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  
  // Impact description
  impact_description?: string;
  evidence: Record<string, any>;
  beneficiaries: string[];
  
  // Validation
  validated_by?: string;
  validation_date?: string;
  confidence_score: number;
  
  created_at: string;
}

export interface UserInteraction {
  id: string;
  session_id: string;
  content_id: string;
  interaction_type: string;
  duration?: number;
  depth_level: number;
  completion_percentage: number;
  satisfaction_rating?: number;
  context: Record<string, any>;
  referrer_content_id?: string;
  created_at: string;
}

export interface ImplementationPathway {
  id: string;
  name: string;
  description?: string;
  philosophy_domain: string;
  target_audience?: string;
  difficulty_level: number;
  estimated_duration?: string;
  steps: any[];
  prerequisites: string[];
  success_criteria: string[];
  resources_needed: string[];
  common_challenges: string[];
  support_available: string[];
  created_at: string;
  updated_at: string;
}

// Initialize enhanced Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local');
}

export const supabase: SupabaseClient = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

/**
 * Enhanced Content Repository with Philosophy-First Operations
 */
export class EnhancedContentRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  /**
   * Get content with philosophy-first filtering and intelligent recommendations
   */
  async getContentWithPhilosophy(options: {
    philosophyDomain?: string;
    complexityLevel?: number;
    userRole?: string;
    includePrerequisites?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ items: ContentItem[]; total: number; philosophy?: PhilosophyPrimer }> {
    const {
      philosophyDomain,
      complexityLevel,
      userRole,
      includePrerequisites = true,
      limit = 20,
      offset = 0
    } = options;

    let query = this.client
      .from('content_with_philosophy')
      .select('*', { count: 'exact' });

    // Apply philosophy-first filtering
    if (philosophyDomain) {
      query = query.eq('philosophy_domain', philosophyDomain);
    }

    if (complexityLevel) {
      query = query.lte('complexity_level', complexityLevel);
    }

    // Order by philosophy primers first, then quality
    query = query
      .order('is_philosophy_primer', { ascending: false })
      .order('quality_score', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching content with philosophy:', error);
      throw error;
    }

    // Get philosophy primer if domain specified
    let philosophy: PhilosophyPrimer | undefined;
    if (philosophyDomain) {
      philosophy = await this.getPhilosophyPrimer(philosophyDomain);
    }

    return {
      items: data || [],
      total: count || 0,
      philosophy
    };
  }

  /**
   * Get philosophy primer for a domain
   */
  async getPhilosophyPrimer(domain: string): Promise<PhilosophyPrimer | null> {
    const { data, error } = await this.client
      .from('philosophy_primers')
      .select('*')
      .eq('domain', domain)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching philosophy primer:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get all philosophy primers
   */
  async getAllPhilosophyPrimers(): Promise<PhilosophyPrimer[]> {
    const { data, error } = await this.client
      .from('philosophy_primers')
      .select('*')
      .order('domain');

    if (error) {
      console.error('Error fetching philosophy primers:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get content relationships with detailed information
   */
  async getContentRelationships(contentId: string, relationshipTypes?: string[]): Promise<ContentRelationship[]> {
    let query = this.client
      .from('content_relationships_detailed')
      .select('*')
      .or(`source_content_id.eq.${contentId},target_content_id.eq.${contentId}`)
      .order('strength', { ascending: false });

    if (relationshipTypes?.length) {
      query = query.in('relationship_type', relationshipTypes);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content relationships:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get recommended content based on user context
   */
  async getRecommendedContent(options: {
    sessionId: string;
    currentContentId?: string;
    recommendationType: 'related' | 'next_steps' | 'prerequisites' | 'examples';
    limit?: number;
  }): Promise<ContentItem[]> {
    const { sessionId, currentContentId, recommendationType, limit = 5 } = options;

    // Get user session context
    const { data: session } = await this.client
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (!session) {
      return [];
    }

    let query = this.client
      .from('content_items')
      .select('*');

    // Apply recommendation logic based on type
    switch (recommendationType) {
      case 'related':
        if (currentContentId) {
          // Get content with similar philosophy domain or concepts
          const { data: currentContent } = await this.client
            .from('content_items')
            .select('philosophy_domain, key_concepts')
            .eq('id', currentContentId)
            .single();

          if (currentContent) {
            query = query
              .eq('philosophy_domain', currentContent.philosophy_domain)
              .neq('id', currentContentId);
          }
        }
        break;

      case 'prerequisites':
        if (currentContentId) {
          // Get prerequisite content
          const { data: relationships } = await this.client
            .from('content_relationships')
            .select('source_content_id')
            .eq('target_content_id', currentContentId)
            .eq('relationship_type', 'prerequisite_for');

          if (relationships?.length) {
            const prerequisiteIds = relationships.map(r => r.source_content_id);
            query = query.in('id', prerequisiteIds);
          }
        }
        break;

      case 'next_steps':
        // Get content that builds on current understanding
        if (session.current_focus_domain) {
          query = query
            .eq('philosophy_domain', session.current_focus_domain)
            .gte('complexity_level', session.preferred_complexity);
        }
        break;

      case 'examples':
        // Get practical examples and case studies
        query = query
          .in('content_type', ['story', 'tool'])
          .eq('philosophy_domain', session.current_focus_domain);
        break;
    }

    // Apply user preferences
    if (session.preferred_complexity) {
      query = query.lte('complexity_level', session.preferred_complexity + 1);
    }

    query = query
      .order('quality_score', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching recommended content:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Semantic search using vector embeddings
   */
  async semanticSearch(options: {
    query: string;
    philosophyDomain?: string;
    contentTypes?: string[];
    userContext?: UserSession;
    limit?: number;
  }): Promise<{ results: ContentItem[]; summary?: string }> {
    const { query, philosophyDomain, contentTypes, userContext, limit = 10 } = options;

    // For now, implement basic text search until vector embeddings are set up
    let searchQuery = this.client
      .from('content_items')
      .select('*')
      .textSearch('title,description,content', query, {
        type: 'websearch',
        config: 'english'
      });

    if (philosophyDomain) {
      searchQuery = searchQuery.eq('philosophy_domain', philosophyDomain);
    }

    if (contentTypes?.length) {
      searchQuery = searchQuery.in('content_type', contentTypes);
    }

    if (userContext?.preferred_complexity) {
      searchQuery = searchQuery.lte('complexity_level', userContext.preferred_complexity + 1);
    }

    searchQuery = searchQuery
      .order('quality_score', { ascending: false })
      .limit(limit);

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }

    return {
      results: data || [],
      summary: `Found ${data?.length || 0} results for "${query}"`
    };
  }

  /**
   * Track user interaction for personalization
   */
  async trackUserInteraction(interaction: Omit<UserInteraction, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.client
      .from('user_interactions')
      .insert(interaction);

    if (error) {
      console.error('Error tracking user interaction:', error);
      // Don't throw - analytics shouldn't break the app
    }
  }

  /**
   * Get or create user session
   */
  async getOrCreateUserSession(sessionId: string, initialData?: Partial<UserSession>): Promise<UserSession> {
    // Try to get existing session
    const { data: existingSession } = await this.client
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existingSession) {
      // Update last active
      await this.client
        .from('user_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('session_id', sessionId);

      return existingSession;
    }

    // Create new session
    const newSession = {
      session_id: sessionId,
      user_role: initialData?.user_role || null,
      interests: initialData?.interests || [],
      current_focus_domain: initialData?.current_focus_domain || null,
      engagement_level: initialData?.engagement_level || 1,
      learning_style: initialData?.learning_style || null,
      experience_level: initialData?.experience_level || 'beginner',
      goals: initialData?.goals || [],
      preferred_complexity: initialData?.preferred_complexity || 1
    };

    const { data, error } = await this.client
      .from('user_sessions')
      .insert(newSession)
      .select()
      .single();

    if (error) {
      console.error('Error creating user session:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get implementation pathways for a philosophy domain
   */
  async getImplementationPathways(options: {
    philosophyDomain?: string;
    targetAudience?: string;
    difficultyLevel?: number;
  } = {}): Promise<ImplementationPathway[]> {
    const { philosophyDomain, targetAudience, difficultyLevel } = options;

    let query = this.client
      .from('implementation_pathways')
      .select('*');

    if (philosophyDomain) {
      query = query.eq('philosophy_domain', philosophyDomain);
    }

    if (targetAudience) {
      query = query.eq('target_audience', targetAudience);
    }

    if (difficultyLevel) {
      query = query.lte('difficulty_level', difficultyLevel);
    }

    query = query.order('difficulty_level');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching implementation pathways:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get content performance analytics
   */
  async getContentPerformance(contentId?: string): Promise<any[]> {
    let query = this.client
      .from('content_performance')
      .select('*');

    if (contentId) {
      query = query.eq('id', contentId);
    } else {
      query = query
        .order('avg_satisfaction', { ascending: false, nullsFirst: false })
        .limit(20);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content performance:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Batch upsert content with enhanced metadata
   */
  async batchUpsertEnhancedContent(items: Partial<ContentItem>[]): Promise<{ success: number; errors: number }> {
    if (items.length === 0) return { success: 0, errors: 0 };

    console.log(`📦 Upserting ${items.length} enhanced content items...`);

    try {
      const { data, error } = await this.client
        .from('content_items')
        .upsert(items, {
          onConflict: 'source,source_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Enhanced batch upsert error:', error);
        return { success: 0, errors: items.length };
      }

      console.log(`✅ Successfully upserted ${items.length} enhanced items`);
      return { success: items.length, errors: 0 };

    } catch (error) {
      console.error('Enhanced batch upsert failed:', error);
      return { success: 0, errors: items.length };
    }
  }

  // ===== COMMUNITY FEATURES =====

  /**
   * Get or create community user profile
   */
  async getOrCreateCommunityProfile(sessionId: string, initialData?: Partial<CommunityUserProfile>): Promise<CommunityUserProfile> {
    // Try to get existing profile
    const { data: existingProfile } = await this.client
      .from('community_user_profiles')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (existingProfile) {
      // Update last active in user session
      await this.client
        .from('user_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('session_id', sessionId);

      return existingProfile;
    }

    // Create new community profile
    const newProfile = {
      session_id: sessionId,
      geographic_scope: initialData?.geographic_scope || 'global',
      relationship_types: initialData?.relationship_types || ['peer'],
      communication_style: initialData?.communication_style || 'mixed',
      availability_windows: initialData?.availability_windows || [],
      cultural_considerations: initialData?.cultural_considerations || [],
      location_info: initialData?.location_info || {},
      profile_visibility: initialData?.profile_visibility || 'community',
      show_location: initialData?.show_location || false,
      show_contact_info: initialData?.show_contact_info || false,
      allow_direct_messages: initialData?.allow_direct_messages || true
    };

    const { data, error } = await this.client
      .from('community_user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating community profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update community user profile
   */
  async updateCommunityProfile(sessionId: string, updates: Partial<CommunityUserProfile>): Promise<CommunityUserProfile> {
    const { data, error } = await this.client
      .from('community_user_profiles')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating community profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get user connections with detailed information
   */
  async getUserConnections(sessionId: string, connectionType?: string): Promise<UserConnection[]> {
    let query = this.client
      .from('user_connections_detailed')
      .select('*')
      .or(`user_session_id.eq.${sessionId},connected_session_id.eq.${sessionId}`)
      .eq('status', 'active')
      .order('relationship_strength', { ascending: false });

    if (connectionType) {
      query = query.eq('connection_type', connectionType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user connections:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new user connection
   */
  async createUserConnection(connection: Omit<UserConnection, 'id' | 'connection_date'>): Promise<UserConnection> {
    const { data, error } = await this.client
      .from('user_connections')
      .insert(connection)
      .select()
      .single();

    if (error) {
      console.error('Error creating user connection:', error);
      throw error;
    }

    // Update connection counts in community profiles
    await this.updateConnectionCounts(connection.user_session_id);
    await this.updateConnectionCounts(connection.connected_session_id);

    return data;
  }

  /**
   * Update connection counts in community profiles
   */
  private async updateConnectionCounts(sessionId: string): Promise<void> {
    const { count } = await this.client
      .from('user_connections')
      .select('*', { count: 'exact', head: true })
      .or(`user_session_id.eq.${sessionId},connected_session_id.eq.${sessionId}`)
      .eq('status', 'active');

    await this.client
      .from('community_user_profiles')
      .update({ connections_made: count || 0 })
      .eq('session_id', sessionId);
  }

  /**
   * Get implementation cohorts
   */
  async getImplementationCohorts(options: {
    philosophyDomain?: string;
    status?: string;
    memberSessionId?: string;
    limit?: number;
  } = {}): Promise<ImplementationCohort[]> {
    const { philosophyDomain, status, memberSessionId, limit = 20 } = options;

    let query = this.client
      .from('cohort_overview')
      .select('*');

    if (philosophyDomain) {
      query = query.eq('philosophy_domain', philosophyDomain);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (memberSessionId) {
      // Get cohorts where user is a member
      const { data: memberships } = await this.client
        .from('cohort_memberships')
        .select('cohort_id')
        .eq('member_session_id', memberSessionId)
        .eq('status', 'active');

      if (memberships?.length) {
        const cohortIds = memberships.map(m => m.cohort_id);
        query = query.in('id', cohortIds);
      } else {
        return [];
      }
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching implementation cohorts:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new implementation cohort
   */
  async createImplementationCohort(cohort: Omit<ImplementationCohort, 'id' | 'created_at' | 'updated_at'>): Promise<ImplementationCohort> {
    const { data, error } = await this.client
      .from('implementation_cohorts')
      .insert(cohort)
      .select()
      .single();

    if (error) {
      console.error('Error creating implementation cohort:', error);
      throw error;
    }

    return data;
  }

  /**
   * Join an implementation cohort
   */
  async joinCohort(cohortId: string, sessionId: string, role: 'member' | 'facilitator' | 'mentor' = 'member'): Promise<CohortMembership> {
    // Check if cohort has space
    const { data: cohort } = await this.client
      .from('implementation_cohorts')
      .select('max_members, current_member_count')
      .eq('id', cohortId)
      .single();

    if (cohort && cohort.current_member_count >= cohort.max_members) {
      throw new Error('Cohort is full');
    }

    // Create membership
    const membership = {
      cohort_id: cohortId,
      member_session_id: sessionId,
      role,
      individual_progress: {},
      contributions: [],
      peer_feedback: []
    };

    const { data, error } = await this.client
      .from('cohort_memberships')
      .insert(membership)
      .select()
      .single();

    if (error) {
      console.error('Error joining cohort:', error);
      throw error;
    }

    // Update cohort member count
    await this.client
      .from('implementation_cohorts')
      .update({ current_member_count: (cohort?.current_member_count || 0) + 1 })
      .eq('id', cohortId);

    return data;
  }

  /**
   * Get mentorship relationships
   */
  async getMentorshipRelationships(sessionId: string, role?: 'mentor' | 'mentee'): Promise<MentorshipRelationship[]> {
    let query = this.client
      .from('mentorship_relationships')
      .select('*')
      .eq('status', 'active');

    if (role === 'mentor') {
      query = query.eq('mentor_session_id', sessionId);
    } else if (role === 'mentee') {
      query = query.eq('mentee_session_id', sessionId);
    } else {
      query = query.or(`mentor_session_id.eq.${sessionId},mentee_session_id.eq.${sessionId}`);
    }

    query = query.order('start_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching mentorship relationships:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a mentorship relationship
   */
  async createMentorshipRelationship(relationship: Omit<MentorshipRelationship, 'id' | 'start_date'>): Promise<MentorshipRelationship> {
    const { data, error } = await this.client
      .from('mentorship_relationships')
      .insert({
        ...relationship,
        start_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating mentorship relationship:', error);
      throw error;
    }

    // Update mentorship hours in community profiles
    await this.updateMentorshipHours(relationship.mentor_session_id);

    return data;
  }

  /**
   * Update mentorship hours in community profile
   */
  private async updateMentorshipHours(sessionId: string): Promise<void> {
    const { count } = await this.client
      .from('mentorship_relationships')
      .select('*', { count: 'exact', head: true })
      .eq('mentor_session_id', sessionId)
      .in('status', ['active', 'completed']);

    // Estimate hours based on relationship count and duration
    const estimatedHours = (count || 0) * 10; // Rough estimate

    await this.client
      .from('community_user_profiles')
      .update({ mentorship_hours: estimatedHours })
      .eq('session_id', sessionId);
  }

  /**
   * Get regional communities
   */
  async getRegionalCommunities(options: {
    geographicType?: string;
    status?: string;
    memberSessionId?: string;
  } = {}): Promise<RegionalCommunity[]> {
    const { geographicType, status, memberSessionId } = options;

    let query = this.client
      .from('regional_communities')
      .select('*');

    if (geographicType) {
      query = query.eq('geographic_type', geographicType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (memberSessionId) {
      // Get communities where user is a member
      const { data: memberships } = await this.client
        .from('regional_community_memberships')
        .select('community_id')
        .eq('member_session_id', memberSessionId)
        .eq('status', 'active');

      if (memberships?.length) {
        const communityIds = memberships.map(m => m.community_id);
        query = query.in('id', communityIds);
      } else {
        return [];
      }
    }

    query = query.order('member_count', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching regional communities:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Track community impact metric
   */
  async trackCommunityImpact(metric: Omit<CommunityImpactMetric, 'id' | 'created_at'>): Promise<CommunityImpactMetric> {
    const { data, error } = await this.client
      .from('community_impact_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) {
      console.error('Error tracking community impact:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get community health metrics
   */
  async getCommunityHealthMetrics(): Promise<any> {
    const { data, error } = await this.client
      .from('community_health_metrics')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching community health metrics:', error);
      throw error;
    }

    return data;
  }
}

// Singleton instances
export const enhancedContentRepository = new EnhancedContentRepository();
export const contentRepository = enhancedContentRepository; // Backward compatibility