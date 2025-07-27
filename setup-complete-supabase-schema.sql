-- =============================================================================
-- COMPLETE AIME KNOWLEDGE UNIVERSE SUPABASE SCHEMA
-- =============================================================================
-- Run this in your Supabase SQL Editor to create the full advanced schema
-- Project ID: bxwmcnzwsguarulsrgrx
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE CONTENT SYSTEM
-- =============================================================================

-- Main content table with enhanced features
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  source TEXT NOT NULL, -- 'youtube', 'airtable', 'mailchimp', 'github'
  content_type TEXT NOT NULL, -- 'video', 'tool', 'newsletter', 'story', 'research'
  
  -- Core content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Full content/transcript for search
  url TEXT,
  thumbnail_url TEXT,
  
  -- Philosophy integration (ADVANCED FEATURE)
  philosophy_domain TEXT,
  complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 5),
  prerequisite_concepts TEXT[] DEFAULT '{}',
  learning_objectives TEXT[] DEFAULT '{}',
  
  -- Enhanced metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  key_concepts TEXT[] DEFAULT '{}',
  
  -- Quality metrics (ADVANCED FEATURE)
  quality_score FLOAT DEFAULT 0.5 CHECK (quality_score BETWEEN 0 AND 1),
  engagement_score FLOAT DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  implementation_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_philosophy_primer BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  source_created_at TIMESTAMPTZ,
  source_updated_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure uniqueness per source
  UNIQUE(source, source_id)
);

-- =============================================================================
-- PHILOSOPHY SYSTEM (ADVANCED FEATURE)
-- =============================================================================

-- Philosophy primers for domain explanations
CREATE TABLE philosophy_primers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  brief_explanation TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  key_principles TEXT[] DEFAULT '{}',
  business_case TEXT,
  implementation_overview TEXT,
  common_misconceptions TEXT[] DEFAULT '{}',
  success_indicators TEXT[] DEFAULT '{}',
  related_content_ids UUID[] DEFAULT '{}',
  prerequisite_knowledge TEXT[] DEFAULT '{}',
  complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CONTENT RELATIONSHIPS (ADVANCED FEATURE)
-- =============================================================================

-- Enhanced content relationships
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  target_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'implements', 'supports', 'contradicts', 'builds_on', 'exemplifies', 'prerequisite_for'
  )),
  strength FLOAT DEFAULT 0.5 CHECK (strength BETWEEN 0 AND 1),
  context TEXT,
  auto_generated BOOLEAN DEFAULT TRUE,
  confidence_score FLOAT DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
  validated_by TEXT,
  validation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(source_content_id, target_content_id, relationship_type)
);

-- =============================================================================
-- CONCEPT CLUSTERING (ADVANCED FEATURE)
-- =============================================================================

-- Concept clusters for learning pathways
CREATE TABLE concept_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT,
  content_ids UUID[] DEFAULT '{}',
  centrality_score FLOAT DEFAULT 0.5 CHECK (centrality_score BETWEEN 0 AND 1),
  complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 5),
  prerequisite_clusters UUID[] DEFAULT '{}',
  learning_pathway_position INTEGER DEFAULT 1,
  estimated_learning_time INTEGER, -- in minutes
  practical_applications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER SESSION SYSTEM (ADVANCED FEATURE)
-- =============================================================================

-- User sessions for personalization
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_role TEXT,
  interests TEXT[] DEFAULT '{}',
  current_focus_domain TEXT,
  engagement_level INTEGER DEFAULT 1 CHECK (engagement_level BETWEEN 1 AND 5),
  learning_style TEXT,
  experience_level TEXT DEFAULT 'beginner',
  goals TEXT[] DEFAULT '{}',
  preferred_complexity INTEGER DEFAULT 1 CHECK (preferred_complexity BETWEEN 1 AND 5),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interactions for analytics
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'view', 'download', 'share', 'like', 'implement'
  duration INTEGER, -- in seconds
  depth_level INTEGER DEFAULT 1 CHECK (depth_level BETWEEN 1 AND 5),
  completion_percentage FLOAT DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  context JSONB DEFAULT '{}',
  referrer_content_id UUID REFERENCES content_items(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- COMMUNITY SYSTEM (ADVANCED FEATURE)
-- =============================================================================

-- Community user profiles
CREATE TABLE community_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL REFERENCES user_sessions(session_id),
  
  -- Connection preferences
  geographic_scope TEXT DEFAULT 'global' CHECK (geographic_scope IN ('local', 'regional', 'global')),
  relationship_types TEXT[] DEFAULT '{peer}' CHECK (relationship_types <@ ARRAY['peer', 'mentor', 'mentee']),
  communication_style TEXT DEFAULT 'mixed' CHECK (communication_style IN ('structured', 'casual', 'mixed')),
  availability_windows JSONB DEFAULT '[]',
  cultural_considerations TEXT[] DEFAULT '{}',
  location_info JSONB DEFAULT '{}',
  
  -- Community contributions
  mentorship_hours INTEGER DEFAULT 0,
  cohort_participations TEXT[] DEFAULT '{}',
  knowledge_shared_count INTEGER DEFAULT 0,
  connections_made INTEGER DEFAULT 0,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'community' CHECK (profile_visibility IN ('private', 'connections', 'community', 'public')),
  show_location BOOLEAN DEFAULT FALSE,
  show_contact_info BOOLEAN DEFAULT FALSE,
  allow_direct_messages BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User connections
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT NOT NULL,
  connected_session_id TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('peer', 'mentor_mentee', 'cohort_member', 'regional_community')),
  relationship_strength FLOAT DEFAULT 0.5 CHECK (relationship_strength BETWEEN 0 AND 1),
  
  -- Connection context
  connection_reason TEXT,
  shared_interests TEXT[] DEFAULT '{}',
  mutual_connections INTEGER DEFAULT 0,
  
  -- Interaction tracking
  last_interaction TIMESTAMPTZ,
  interaction_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Relationship metadata
  mentor_session_id TEXT,
  connection_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'dormant', 'ended')),
  
  UNIQUE(user_session_id, connected_session_id, connection_type)
);

-- =============================================================================
-- IMPLEMENTATION COHORTS (ADVANCED FEATURE)
-- =============================================================================

-- Implementation cohorts
CREATE TABLE implementation_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT NOT NULL,
  implementation_goal TEXT NOT NULL,
  
  -- Configuration
  max_members INTEGER DEFAULT 10,
  current_member_count INTEGER DEFAULT 0,
  facilitator_session_ids TEXT[] DEFAULT '{}',
  
  -- Timeline
  start_date TIMESTAMPTZ,
  expected_duration_weeks INTEGER DEFAULT 8,
  current_phase TEXT DEFAULT 'formation' CHECK (current_phase IN ('formation', 'orientation', 'active', 'completion', 'alumni')),
  
  -- Resources and tracking
  shared_resources JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  meeting_schedule JSONB DEFAULT '{}',
  
  -- Status and metrics
  status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'disbanded')),
  completion_rate FLOAT DEFAULT 0 CHECK (completion_rate BETWEEN 0 AND 1),
  satisfaction_score FLOAT CHECK (satisfaction_score BETWEEN 0 AND 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohort memberships
CREATE TABLE cohort_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES implementation_cohorts(id) ON DELETE CASCADE,
  member_session_id TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'facilitator', 'mentor')),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('invited', 'active', 'inactive', 'completed', 'left')),
  
  -- Progress tracking
  individual_progress JSONB DEFAULT '{}',
  contributions JSONB DEFAULT '[]',
  peer_feedback JSONB DEFAULT '[]',
  
  -- Engagement metrics
  attendance_rate FLOAT DEFAULT 0 CHECK (attendance_rate BETWEEN 0 AND 1),
  participation_score FLOAT DEFAULT 0 CHECK (participation_score BETWEEN 0 AND 1),
  
  UNIQUE(cohort_id, member_session_id)
);

-- =============================================================================
-- MENTORSHIP SYSTEM (ADVANCED FEATURE)
-- =============================================================================

-- Mentorship relationships
CREATE TABLE mentorship_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_session_id TEXT NOT NULL,
  mentee_session_id TEXT NOT NULL,
  
  -- Configuration
  expertise_domains TEXT[] DEFAULT '{}',
  learning_goals TEXT[] DEFAULT '{}',
  meeting_frequency TEXT DEFAULT 'monthly' CHECK (meeting_frequency IN ('weekly', 'biweekly', 'monthly')),
  communication_preferences JSONB DEFAULT '{}',
  
  -- Timeline
  start_date TIMESTAMPTZ DEFAULT NOW(),
  expected_duration_months INTEGER DEFAULT 6,
  actual_end_date TIMESTAMPTZ,
  
  -- Progress and outcomes
  goals_achieved TEXT[] DEFAULT '{}',
  milestones_completed JSONB DEFAULT '[]',
  wisdom_captured TEXT[] DEFAULT '{}',
  
  -- Relationship health
  satisfaction_mentor INTEGER CHECK (satisfaction_mentor BETWEEN 1 AND 5),
  satisfaction_mentee INTEGER CHECK (satisfaction_mentee BETWEEN 1 AND 5),
  relationship_strength FLOAT DEFAULT 0.5 CHECK (relationship_strength BETWEEN 0 AND 1),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'ended')),
  
  UNIQUE(mentor_session_id, mentee_session_id)
);

-- =============================================================================
-- REGIONAL COMMUNITIES (ADVANCED FEATURE)
-- =============================================================================

-- Regional communities
CREATE TABLE regional_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Geographic definition
  geographic_type TEXT NOT NULL CHECK (geographic_type IN ('city', 'region', 'country', 'virtual')),
  geographic_boundary JSONB NOT NULL,
  timezone TEXT,
  
  -- Governance
  coordinator_session_ids TEXT[] DEFAULT '{}',
  advisor_session_ids TEXT[] DEFAULT '{}',
  decision_making_process TEXT,
  cultural_protocols JSONB DEFAULT '[]',
  
  -- Metrics
  member_count INTEGER DEFAULT 0,
  active_member_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 1),
  
  status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'dormant', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- COMMUNITY ACTIVITIES (ADVANCED FEATURE)
-- =============================================================================

-- Community activities
CREATE TABLE community_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'discussion', 'workshop', 'mentoring_session', 'cohort_meeting', 'regional_event', 'knowledge_sharing'
  )),
  
  -- Context
  philosophy_domain TEXT,
  related_content_ids UUID[] DEFAULT '{}',
  facilitator_session_ids TEXT[] DEFAULT '{}',
  
  -- Scheduling
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  timezone TEXT,
  location_type TEXT CHECK (location_type IN ('virtual', 'in_person', 'hybrid')),
  location_details JSONB DEFAULT '{}',
  
  -- Participation
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  participant_session_ids TEXT[] DEFAULT '{}',
  
  -- Outcomes
  outcomes_achieved TEXT[] DEFAULT '{}',
  knowledge_created JSONB DEFAULT '[]',
  follow_up_actions TEXT[] DEFAULT '{}',
  
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- IMPACT MEASUREMENT (ADVANCED FEATURE)
-- =============================================================================

-- Community impact metrics
CREATE TABLE community_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'individual_growth', 'relationship_formed', 'knowledge_shared', 'implementation_completed', 'community_milestone'
  )),
  
  -- Context
  session_id TEXT,
  community_id UUID REFERENCES regional_communities(id),
  cohort_id UUID REFERENCES implementation_cohorts(id),
  activity_id UUID REFERENCES community_activities(id),
  
  -- Metric details
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  
  -- Impact description
  impact_description TEXT,
  evidence JSONB DEFAULT '{}',
  beneficiaries TEXT[] DEFAULT '{}',
  
  -- Validation
  validated_by TEXT,
  validation_date TIMESTAMPTZ,
  confidence_score FLOAT DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- IMPLEMENTATION PATHWAYS (ADVANCED FEATURE)
-- =============================================================================

-- Implementation pathways
CREATE TABLE implementation_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT NOT NULL,
  target_audience TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration TEXT,
  steps JSONB DEFAULT '[]',
  prerequisites TEXT[] DEFAULT '{}',
  success_criteria TEXT[] DEFAULT '{}',
  resources_needed TEXT[] DEFAULT '{}',
  common_challenges TEXT[] DEFAULT '{}',
  support_available TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- LEGACY SYNC SYSTEM
-- =============================================================================

-- Sync status tracking
CREATE TABLE sync_status (
  source TEXT PRIMARY KEY,
  last_sync_at TIMESTAMPTZ,
  last_successful_sync_at TIMESTAMPTZ,
  total_records INTEGER DEFAULT 0,
  new_records INTEGER DEFAULT 0,
  updated_records INTEGER DEFAULT 0,
  sync_duration_ms INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  next_sync_at TIMESTAMPTZ,
  is_syncing BOOLEAN DEFAULT FALSE,
  sync_config JSONB DEFAULT '{}'
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Content indexes
CREATE INDEX idx_content_source ON content_items(source);
CREATE INDEX idx_content_type ON content_items(content_type);
CREATE INDEX idx_content_philosophy ON content_items(philosophy_domain);
CREATE INDEX idx_content_complexity ON content_items(complexity_level);
CREATE INDEX idx_content_quality ON content_items(quality_score DESC);
CREATE INDEX idx_content_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_content_updated ON content_items(updated_at DESC);
CREATE INDEX idx_content_tags ON content_items USING GIN(tags);
CREATE INDEX idx_content_categories ON content_items USING GIN(categories);
CREATE INDEX idx_content_concepts ON content_items USING GIN(key_concepts);

-- Full-text search index
CREATE INDEX content_search_idx ON content_items 
USING GIN (to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(content, '')
));

-- Relationship indexes
CREATE INDEX idx_relationships_source ON content_relationships(source_content_id);
CREATE INDEX idx_relationships_target ON content_relationships(target_content_id);
CREATE INDEX idx_relationships_type ON content_relationships(relationship_type);
CREATE INDEX idx_relationships_strength ON content_relationships(strength DESC);

-- Community indexes
CREATE INDEX idx_user_sessions_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_domain ON user_sessions(current_focus_domain);
CREATE INDEX idx_user_profiles_session ON community_user_profiles(session_id);
CREATE INDEX idx_user_connections_user ON user_connections(user_session_id);
CREATE INDEX idx_user_connections_connected ON user_connections(connected_session_id);
CREATE INDEX idx_user_connections_type ON user_connections(connection_type);

-- Cohort indexes
CREATE INDEX idx_cohorts_domain ON implementation_cohorts(philosophy_domain);
CREATE INDEX idx_cohorts_status ON implementation_cohorts(status);
CREATE INDEX idx_cohort_members_cohort ON cohort_memberships(cohort_id);
CREATE INDEX idx_cohort_members_session ON cohort_memberships(member_session_id);

-- Interaction indexes
CREATE INDEX idx_interactions_session ON user_interactions(session_id);
CREATE INDEX idx_interactions_content ON user_interactions(content_id);
CREATE INDEX idx_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_interactions_date ON user_interactions(created_at DESC);

-- =============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- =============================================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_philosophy_primers_updated_at 
    BEFORE UPDATE ON philosophy_primers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concept_clusters_updated_at 
    BEFORE UPDATE ON concept_clusters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_profiles_updated_at 
    BEFORE UPDATE ON community_user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at 
    BEFORE UPDATE ON implementation_cohorts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regional_communities_updated_at 
    BEFORE UPDATE ON regional_communities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_activities_updated_at 
    BEFORE UPDATE ON community_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- USEFUL VIEWS FOR QUERIES
-- =============================================================================

-- Content with philosophy information
CREATE VIEW content_with_philosophy AS
SELECT 
  c.*,
  p.title as philosophy_title,
  p.brief_explanation as philosophy_brief
FROM content_items c
LEFT JOIN philosophy_primers p ON c.philosophy_domain = p.domain;

-- Content performance analytics
CREATE VIEW content_performance AS
SELECT 
  c.id,
  c.title,
  c.content_type,
  c.philosophy_domain,
  c.quality_score,
  c.engagement_score,
  c.view_count,
  COUNT(ui.id) as total_interactions,
  AVG(ui.satisfaction_rating) as avg_satisfaction,
  AVG(ui.completion_percentage) as avg_completion,
  COUNT(ui.id) FILTER (WHERE ui.interaction_type = 'implement') as implementation_count
FROM content_items c
LEFT JOIN user_interactions ui ON c.id = ui.content_id
GROUP BY c.id, c.title, c.content_type, c.philosophy_domain, c.quality_score, c.engagement_score, c.view_count;

-- User connections with details
CREATE VIEW user_connections_detailed AS
SELECT 
  uc.*,
  up1.location_info as user_location,
  up2.location_info as connected_location,
  up1.relationship_types as user_relationship_types,
  up2.relationship_types as connected_relationship_types
FROM user_connections uc
LEFT JOIN community_user_profiles up1 ON uc.user_session_id = up1.session_id
LEFT JOIN community_user_profiles up2 ON uc.connected_session_id = up2.session_id;

-- Cohort overview
CREATE VIEW cohort_overview AS
SELECT 
  c.*,
  COUNT(cm.id) as actual_member_count,
  AVG(cm.attendance_rate) as avg_attendance,
  AVG(cm.participation_score) as avg_participation
FROM implementation_cohorts c
LEFT JOIN cohort_memberships cm ON c.id = cm.cohort_id AND cm.status = 'active'
GROUP BY c.id;

-- Community health metrics
CREATE VIEW community_health_metrics AS
SELECT 
  COUNT(DISTINCT us.session_id) as total_users,
  COUNT(DISTINCT cup.session_id) as community_members,
  COUNT(DISTINCT uc.id) as total_connections,
  COUNT(DISTINCT mr.id) as active_mentorships,
  COUNT(DISTINCT ic.id) as active_cohorts,
  AVG(cup.connections_made) as avg_connections_per_user,
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.created_at > NOW() - INTERVAL '30 days') as recent_activities
FROM user_sessions us
LEFT JOIN community_user_profiles cup ON us.session_id = cup.session_id
LEFT JOIN user_connections uc ON us.session_id = uc.user_session_id AND uc.status = 'active'
LEFT JOIN mentorship_relationships mr ON us.session_id = mr.mentor_session_id OR us.session_id = mr.mentee_session_id
LEFT JOIN implementation_cohorts ic ON ic.status = 'active'
LEFT JOIN community_activities ca ON TRUE;

-- Content summary view
CREATE VIEW content_summary AS
SELECT 
  source,
  content_type,
  COUNT(*) as total_items,
  MAX(last_synced_at) as last_sync,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as new_today,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count,
  AVG(quality_score) as avg_quality,
  AVG(engagement_score) as avg_engagement
FROM content_items 
GROUP BY source, content_type;

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert initial sync status records
INSERT INTO sync_status (source, next_sync_at) VALUES 
('youtube', NOW()),
('airtable', NOW()),
('mailchimp', NOW()),
('github', NOW())
ON CONFLICT (source) DO NOTHING;

-- Insert sample philosophy primers
INSERT INTO philosophy_primers (domain, title, brief_explanation, detailed_explanation, key_principles) VALUES
(
  'hoodie_economics',
  'Hoodie Economics',
  'An alternative economic model focused on systemic change and regenerative practices.',
  'Hoodie Economics represents a paradigm shift from extractive capitalism to regenerative economics, emphasizing community wealth-building, Indigenous wisdom, and systemic transformation.',
  ARRAY['Regenerative over extractive', 'Community wealth-building', 'Indigenous wisdom integration', 'Systemic thinking']
),
(
  'imagination_unleashed',
  'Imagination Unleashed',
  'The power of imagination as a catalyst for social and systemic change.',
  'Imagination Unleashed explores how creative thinking and visionary approaches can transform individuals, communities, and systems, moving beyond limiting beliefs to create new possibilities.',
  ARRAY['Creative problem-solving', 'Visionary thinking', 'Breaking limiting beliefs', 'Possibility creation']
),
(
  'mentoring_methodology',
  'AIME Mentoring Methodology',
  'A relationship-based approach to education and personal development.',
  'The AIME Mentoring Methodology centers on authentic relationships, cultural pride, and strength-based approaches to unlock human potential and create pathways to opportunity.',
  ARRAY['Relationship-based learning', 'Cultural pride', 'Strength-based approaches', 'Opportunity creation']
)
ON CONFLICT (domain) DO NOTHING;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'AIME Knowledge Universe Supabase schema created successfully!';
  RAISE NOTICE 'Project ID: bxwmcnzwsguarulsrgrx';
  RAISE NOTICE 'Advanced features enabled:';
  RAISE NOTICE '- Philosophy-first content system';
  RAISE NOTICE '- AI-powered community matching';
  RAISE NOTICE '- Implementation cohorts';
  RAISE NOTICE '- Semantic search & recommendations';
  RAISE NOTICE '- Regional community management';
  RAISE NOTICE '- Advanced analytics & impact tracking';
END $$;