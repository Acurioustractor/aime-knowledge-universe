-- Community Integration Platform Database Schema
-- Extends existing AIME Knowledge Platform with community features

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enhanced user profiles with community preferences
CREATE TABLE community_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  -- Community connection preferences
  geographic_scope TEXT DEFAULT 'global' CHECK (geographic_scope IN ('local', 'regional', 'global')),
  relationship_types TEXT[] DEFAULT ARRAY['peer'], -- 'peer', 'mentor', 'mentee'
  communication_style TEXT DEFAULT 'mixed' CHECK (communication_style IN ('structured', 'casual', 'mixed')),
  availability_windows JSONB DEFAULT '[]', -- array of time windows
  cultural_considerations TEXT[] DEFAULT '{}',
  location_info JSONB DEFAULT '{}', -- city, region, country, timezone
  
  -- Community contribution tracking
  mentorship_hours INTEGER DEFAULT 0,
  cohort_participations TEXT[] DEFAULT '{}',
  knowledge_shared_count INTEGER DEFAULT 0,
  connections_made INTEGER DEFAULT 0,
  
  -- Privacy and visibility settings
  profile_visibility TEXT DEFAULT 'community' CHECK (profile_visibility IN ('private', 'connections', 'community', 'public')),
  show_location BOOLEAN DEFAULT FALSE,
  show_contact_info BOOLEAN DEFAULT FALSE,
  allow_direct_messages BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User connections and relationships
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  connected_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  connection_type TEXT NOT NULL CHECK (connection_type IN ('peer', 'mentor_mentee', 'cohort_member', 'regional_community')),
  relationship_strength FLOAT DEFAULT 0.5 CHECK (relationship_strength BETWEEN 0 AND 1),
  
  -- Connection context
  connection_reason TEXT, -- how/why they connected
  shared_interests TEXT[] DEFAULT '{}',
  mutual_connections INTEGER DEFAULT 0,
  
  -- Interaction tracking
  last_interaction TIMESTAMPTZ,
  interaction_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Relationship metadata
  mentor_session_id TEXT, -- if mentor_mentee type, who is the mentor
  connection_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'dormant', 'ended')),
  
  -- Prevent duplicate connections
  UNIQUE(user_session_id, connected_session_id),
  -- Prevent self-connections
  CHECK (user_session_id != connected_session_id)
);

-- Implementation cohorts
CREATE TABLE implementation_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT NOT NULL,
  implementation_goal TEXT NOT NULL,
  
  -- Cohort configuration
  max_members INTEGER DEFAULT 8,
  current_member_count INTEGER DEFAULT 0,
  facilitator_session_ids TEXT[] DEFAULT '{}',
  
  -- Timeline and structure
  start_date TIMESTAMPTZ,
  expected_duration_weeks INTEGER DEFAULT 12,
  current_phase TEXT DEFAULT 'formation' CHECK (current_phase IN ('formation', 'orientation', 'active', 'completion', 'alumni')),
  
  -- Cohort resources and tracking
  shared_resources JSONB DEFAULT '[]', -- array of resource objects
  milestones JSONB DEFAULT '[]', -- array of milestone objects
  meeting_schedule JSONB DEFAULT '{}', -- meeting frequency and times
  
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
  cohort_id UUID NOT NULL REFERENCES implementation_cohorts(id) ON DELETE CASCADE,
  member_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  -- Membership details
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'facilitator', 'mentor')),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('invited', 'active', 'inactive', 'completed', 'left')),
  
  -- Progress tracking
  individual_progress JSONB DEFAULT '{}', -- progress on cohort goals
  contributions JSONB DEFAULT '[]', -- array of contribution objects
  peer_feedback JSONB DEFAULT '[]', -- feedback from other members
  
  -- Engagement metrics
  attendance_rate FLOAT DEFAULT 0 CHECK (attendance_rate BETWEEN 0 AND 1),
  participation_score FLOAT DEFAULT 0 CHECK (participation_score BETWEEN 0 AND 1),
  
  UNIQUE(cohort_id, member_session_id)
);

-- Mentorship relationships
CREATE TABLE mentorship_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  mentee_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  -- Relationship configuration
  expertise_domains TEXT[] NOT NULL, -- what the mentor helps with
  learning_goals TEXT[] NOT NULL, -- what the mentee wants to achieve
  meeting_frequency TEXT DEFAULT 'weekly', -- 'weekly', 'biweekly', 'monthly'
  communication_preferences JSONB DEFAULT '{}',
  
  -- Relationship timeline
  start_date TIMESTAMPTZ DEFAULT NOW(),
  expected_duration_months INTEGER DEFAULT 6,
  actual_end_date TIMESTAMPTZ,
  
  -- Progress and outcomes
  goals_achieved TEXT[] DEFAULT '{}',
  milestones_completed JSONB DEFAULT '[]',
  wisdom_captured TEXT[] DEFAULT '{}', -- insights shared with community
  
  -- Relationship health
  satisfaction_mentor FLOAT CHECK (satisfaction_mentor BETWEEN 1 AND 5),
  satisfaction_mentee FLOAT CHECK (satisfaction_mentee BETWEEN 1 AND 5),
  relationship_strength FLOAT DEFAULT 0.5 CHECK (relationship_strength BETWEEN 0 AND 1),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'ended')),
  
  -- Prevent self-mentoring
  CHECK (mentor_session_id != mentee_session_id),
  UNIQUE(mentor_session_id, mentee_session_id)
);

-- Regional communities
CREATE TABLE regional_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Geographic definition
  geographic_type TEXT NOT NULL CHECK (geographic_type IN ('city', 'region', 'country', 'virtual')),
  geographic_boundary JSONB NOT NULL, -- coordinates, description, etc.
  timezone TEXT,
  
  -- Community governance
  coordinator_session_ids TEXT[] DEFAULT '{}',
  advisor_session_ids TEXT[] DEFAULT '{}',
  decision_making_process TEXT DEFAULT 'consensus',
  cultural_protocols JSONB DEFAULT '[]',
  
  -- Community metrics
  member_count INTEGER DEFAULT 0,
  active_member_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 1),
  
  -- Status
  status TEXT DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'dormant', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regional community memberships
CREATE TABLE regional_community_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES regional_communities(id) ON DELETE CASCADE,
  member_session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'coordinator', 'advisor')),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
  
  -- Local engagement
  local_initiatives_participated TEXT[] DEFAULT '{}',
  events_attended INTEGER DEFAULT 0,
  contributions_made JSONB DEFAULT '[]',
  
  UNIQUE(community_id, member_session_id)
);

-- Community activities and events
CREATE TABLE community_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('discussion', 'workshop', 'mentoring_session', 'cohort_meeting', 'regional_event', 'knowledge_sharing')),
  
  -- Activity context
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

-- Community discussions and knowledge sharing
CREATE TABLE community_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discussion_type TEXT NOT NULL CHECK (discussion_type IN ('philosophy_circle', 'implementation_lab', 'story_sharing', 'innovation_workshop', 'cultural_learning')),
  
  -- Discussion context
  philosophy_domain TEXT,
  related_content_ids UUID[] DEFAULT '{}',
  parent_discussion_id UUID REFERENCES community_discussions(id),
  
  -- Participation
  creator_session_id TEXT NOT NULL REFERENCES user_sessions(session_id),
  participant_session_ids TEXT[] DEFAULT '{}',
  moderator_session_ids TEXT[] DEFAULT '{}',
  
  -- Content and insights
  key_themes TEXT[] DEFAULT '{}',
  action_items TEXT[] DEFAULT '{}',
  wisdom_captured TEXT[] DEFAULT '{}',
  resources_shared JSONB DEFAULT '[]',
  
  -- Engagement metrics
  message_count INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  
  -- Cultural sensitivity
  cultural_protocols_followed BOOLEAN DEFAULT TRUE,
  cultural_advisor_reviewed BOOLEAN DEFAULT FALSE,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community impact tracking
CREATE TABLE community_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('individual_growth', 'relationship_formed', 'knowledge_shared', 'implementation_completed', 'community_milestone')),
  
  -- Context
  session_id TEXT REFERENCES user_sessions(session_id),
  community_id UUID REFERENCES regional_communities(id),
  cohort_id UUID REFERENCES implementation_cohorts(id),
  activity_id UUID REFERENCES community_activities(id),
  
  -- Metric details
  metric_name TEXT NOT NULL,
  metric_value FLOAT NOT NULL,
  metric_unit TEXT, -- 'hours', 'connections', 'implementations', etc.
  
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

-- Indexes for performance
CREATE INDEX idx_community_profiles_session ON community_user_profiles(session_id);
CREATE INDEX idx_community_profiles_location ON community_user_profiles USING GIN(location_info);
CREATE INDEX idx_community_profiles_visibility ON community_user_profiles(profile_visibility);

CREATE INDEX idx_connections_user ON user_connections(user_session_id);
CREATE INDEX idx_connections_connected ON user_connections(connected_session_id);
CREATE INDEX idx_connections_type ON user_connections(connection_type);
CREATE INDEX idx_connections_status ON user_connections(status);
CREATE INDEX idx_connections_strength ON user_connections(relationship_strength DESC);

CREATE INDEX idx_cohorts_domain ON implementation_cohorts(philosophy_domain);
CREATE INDEX idx_cohorts_status ON implementation_cohorts(status);
CREATE INDEX idx_cohorts_phase ON implementation_cohorts(current_phase);

CREATE INDEX idx_cohort_members_cohort ON cohort_memberships(cohort_id);
CREATE INDEX idx_cohort_members_session ON cohort_memberships(member_session_id);
CREATE INDEX idx_cohort_members_role ON cohort_memberships(role);

CREATE INDEX idx_mentorship_mentor ON mentorship_relationships(mentor_session_id);
CREATE INDEX idx_mentorship_mentee ON mentorship_relationships(mentee_session_id);
CREATE INDEX idx_mentorship_status ON mentorship_relationships(status);
CREATE INDEX idx_mentorship_domains ON mentorship_relationships USING GIN(expertise_domains);

CREATE INDEX idx_regional_communities_type ON regional_communities(geographic_type);
CREATE INDEX idx_regional_communities_status ON regional_communities(status);

CREATE INDEX idx_community_activities_type ON community_activities(activity_type);
CREATE INDEX idx_community_activities_domain ON community_activities(philosophy_domain);
CREATE INDEX idx_community_activities_start ON community_activities(scheduled_start);

CREATE INDEX idx_discussions_type ON community_discussions(discussion_type);
CREATE INDEX idx_discussions_creator ON community_discussions(creator_session_id);
CREATE INDEX idx_discussions_domain ON community_discussions(philosophy_domain);

CREATE INDEX idx_impact_metrics_type ON community_impact_metrics(metric_type);
CREATE INDEX idx_impact_metrics_session ON community_impact_metrics(session_id);
CREATE INDEX idx_impact_metrics_date ON community_impact_metrics(created_at DESC);

-- Auto-update timestamps
CREATE TRIGGER update_community_user_profiles_updated_at 
    BEFORE UPDATE ON community_user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_implementation_cohorts_updated_at 
    BEFORE UPDATE ON implementation_cohorts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regional_communities_updated_at 
    BEFORE UPDATE ON regional_communities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_activities_updated_at 
    BEFORE UPDATE ON community_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_discussions_updated_at 
    BEFORE UPDATE ON community_discussions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Useful views for community features
CREATE VIEW community_user_profiles_enhanced AS
SELECT 
  cup.*,
  us.interests,
  us.current_focus_domain,
  us.experience_level,
  us.goals,
  us.preferred_complexity
FROM community_user_profiles cup
JOIN user_sessions us ON cup.session_id = us.session_id;

CREATE VIEW user_connections_detailed AS
SELECT 
  uc.*,
  us1.interests as user_interests,
  us1.current_focus_domain as user_focus,
  us2.interests as connected_interests,
  us2.current_focus_domain as connected_focus,
  ARRAY(
    SELECT unnest(us1.interests) 
    INTERSECT 
    SELECT unnest(us2.interests)
  ) as shared_interests_calculated
FROM user_connections uc
JOIN user_sessions us1 ON uc.user_session_id = us1.session_id
JOIN user_sessions us2 ON uc.connected_session_id = us2.session_id;

CREATE VIEW cohort_overview AS
SELECT 
  ic.*,
  COUNT(cm.id) as actual_member_count,
  AVG(cm.participation_score) as avg_participation,
  COUNT(CASE WHEN cm.status = 'active' THEN 1 END) as active_members
FROM implementation_cohorts ic
LEFT JOIN cohort_memberships cm ON ic.id = cm.cohort_id
GROUP BY ic.id;

CREATE VIEW community_health_metrics AS
SELECT 
  'overall' as scope,
  COUNT(DISTINCT cup.session_id) as total_community_members,
  COUNT(DISTINCT uc.id) as total_connections,
  COUNT(DISTINCT ic.id) as active_cohorts,
  COUNT(DISTINCT mr.id) as active_mentorships,
  COUNT(DISTINCT rc.id) as regional_communities,
  AVG(uc.relationship_strength) as avg_relationship_strength
FROM community_user_profiles cup
LEFT JOIN user_connections uc ON cup.session_id = uc.user_session_id AND uc.status = 'active'
LEFT JOIN implementation_cohorts ic ON ic.status = 'active'
LEFT JOIN mentorship_relationships mr ON mr.status = 'active'
LEFT JOIN regional_communities rc ON rc.status = 'active';