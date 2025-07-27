-- AIME Knowledge Platform Enhanced Database Schema
-- Philosophy-First Content Architecture with Semantic Intelligence

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enhanced content table with philosophy integration
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  source TEXT NOT NULL, -- 'youtube', 'airtable', 'mailchimp', 'github'
  content_type TEXT NOT NULL, -- 'video', 'tool', 'newsletter', 'story', 'research'
  
  -- Core content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT,
  thumbnail_url TEXT,
  
  -- Philosophy integration
  philosophy_domain TEXT, -- 'imagination-based-learning', 'hoodie-economics', 'mentoring-systems'
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
  
  -- Quality and engagement metrics
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
  
  UNIQUE(source, source_id)
);

-- Philosophy primers for contextual explanations
CREATE TABLE philosophy_primers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE, -- 'imagination-based-learning', 'hoodie-economics', 'mentoring-systems'
  title TEXT NOT NULL,
  brief_explanation TEXT NOT NULL, -- 2-3 sentences for quick context
  detailed_explanation TEXT NOT NULL, -- comprehensive overview
  key_principles TEXT[] DEFAULT '{}',
  business_case TEXT, -- why this matters with evidence
  implementation_overview TEXT, -- how to apply in practice
  common_misconceptions TEXT[] DEFAULT '{}',
  success_indicators TEXT[] DEFAULT '{}',
  related_content_ids UUID[] DEFAULT '{}',
  prerequisite_knowledge TEXT[] DEFAULT '{}',
  complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content relationships with semantic understanding
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  target_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'implements', 'supports', 'contradicts', 'builds_on', 'exemplifies', 'prerequisite_for'
  strength FLOAT DEFAULT 0.5 CHECK (strength BETWEEN 0 AND 1),
  context TEXT, -- explanation of why this relationship exists
  auto_generated BOOLEAN DEFAULT FALSE,
  confidence_score FLOAT DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
  validated_by TEXT, -- who validated this relationship
  validation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(source_content_id, target_content_id, relationship_type)
);

-- Concept clusters for knowledge organization
CREATE TABLE concept_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT,
  content_ids UUID[] DEFAULT '{}',
  centrality_score FLOAT DEFAULT 0 CHECK (centrality_score BETWEEN 0 AND 1),
  complexity_level INTEGER DEFAULT 1 CHECK (complexity_level BETWEEN 1 AND 5),
  prerequisite_clusters UUID[] DEFAULT '{}',
  learning_pathway_position INTEGER DEFAULT 1,
  estimated_learning_time INTEGER, -- minutes to understand concept
  practical_applications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions and context modeling
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_role TEXT, -- 'educator', 'policymaker', 'community-leader', 'student', 'researcher'
  interests TEXT[] DEFAULT '{}',
  current_focus_domain TEXT,
  engagement_level INTEGER DEFAULT 1 CHECK (engagement_level BETWEEN 1 AND 5),
  learning_style TEXT, -- 'visual', 'conceptual', 'practical', 'story-driven'
  experience_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  goals TEXT[] DEFAULT '{}',
  preferred_complexity INTEGER DEFAULT 1 CHECK (preferred_complexity BETWEEN 1 AND 5),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interactions for personalization and analytics
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'view', 'bookmark', 'share', 'implement', 'philosophy_primer_viewed', 'relationship_explored'
  duration INTEGER, -- time spent in seconds
  depth_level INTEGER DEFAULT 1, -- how deep they went (1-5)
  completion_percentage FLOAT DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 1),
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  context JSONB DEFAULT '{}',
  referrer_content_id UUID REFERENCES content_items(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search analytics for optimization
CREATE TABLE search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  query TEXT NOT NULL,
  search_type TEXT DEFAULT 'semantic', -- 'semantic', 'keyword', 'relationship', 'philosophy'
  results_count INTEGER DEFAULT 0,
  clicked_results UUID[] DEFAULT '{}',
  result_positions INTEGER[] DEFAULT '{}', -- positions of clicked results
  satisfaction_score FLOAT CHECK (satisfaction_score BETWEEN 0 AND 1),
  found_what_looking_for BOOLEAN,
  search_context TEXT, -- what led to this search
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector embeddings for semantic search
CREATE TABLE content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  embedding_type TEXT DEFAULT 'content', -- 'content', 'title', 'summary', 'philosophy'
  embedding VECTOR(1536), -- OpenAI embedding dimension
  model_version TEXT DEFAULT 'text-embedding-ada-002',
  chunk_index INTEGER DEFAULT 0, -- for large content split into chunks
  chunk_text TEXT, -- the actual text that was embedded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Implementation pathways for guided learning
CREATE TABLE implementation_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  philosophy_domain TEXT NOT NULL,
  target_audience TEXT, -- 'educators', 'policymakers', 'community-leaders'
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration TEXT, -- '2 weeks', '1 month', etc.
  steps JSONB NOT NULL, -- ordered array of pathway steps
  prerequisites TEXT[] DEFAULT '{}',
  success_criteria TEXT[] DEFAULT '{}',
  resources_needed TEXT[] DEFAULT '{}',
  common_challenges TEXT[] DEFAULT '{}',
  support_available TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  pathway_id UUID REFERENCES implementation_pathways(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  completion_percentage FLOAT DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 1),
  notes TEXT,
  challenges_encountered TEXT[] DEFAULT '{}',
  support_requested BOOLEAN DEFAULT FALSE,
  
  UNIQUE(session_id, pathway_id)
);

-- Content quality assessments
CREATE TABLE content_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  assessor_type TEXT NOT NULL, -- 'ai', 'expert', 'community'
  assessor_id TEXT,
  quality_dimensions JSONB NOT NULL, -- accuracy, clarity, relevance, completeness, etc.
  overall_score FLOAT CHECK (overall_score BETWEEN 0 AND 1),
  feedback TEXT,
  improvement_suggestions TEXT[] DEFAULT '{}',
  assessment_date TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_content_philosophy_domain ON content_items(philosophy_domain);
CREATE INDEX idx_content_complexity ON content_items(complexity_level);
CREATE INDEX idx_content_quality ON content_items(quality_score DESC);
CREATE INDEX idx_content_engagement ON content_items(engagement_score DESC);
CREATE INDEX idx_content_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_content_primer ON content_items(is_philosophy_primer) WHERE is_philosophy_primer = TRUE;
CREATE INDEX idx_content_tags ON content_items USING GIN(tags);
CREATE INDEX idx_content_concepts ON content_items USING GIN(key_concepts);

-- Relationship indexes
CREATE INDEX idx_relationships_source ON content_relationships(source_content_id);
CREATE INDEX idx_relationships_target ON content_relationships(target_content_id);
CREATE INDEX idx_relationships_type ON content_relationships(relationship_type);
CREATE INDEX idx_relationships_strength ON content_relationships(strength DESC);

-- User interaction indexes
CREATE INDEX idx_interactions_session ON user_interactions(session_id);
CREATE INDEX idx_interactions_content ON user_interactions(content_id);
CREATE INDEX idx_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_interactions_date ON user_interactions(created_at DESC);

-- Search analytics indexes
CREATE INDEX idx_search_query ON search_analytics(query);
CREATE INDEX idx_search_type ON search_analytics(search_type);
CREATE INDEX idx_search_satisfaction ON search_analytics(satisfaction_score DESC);

-- Vector similarity indexes
CREATE INDEX ON content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_embeddings_content ON content_embeddings(content_id);
CREATE INDEX idx_embeddings_type ON content_embeddings(embedding_type);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_items_updated_at 
    BEFORE UPDATE ON content_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_philosophy_primers_updated_at 
    BEFORE UPDATE ON philosophy_primers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concept_clusters_updated_at 
    BEFORE UPDATE ON concept_clusters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_implementation_pathways_updated_at 
    BEFORE UPDATE ON implementation_pathways 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Useful views for common queries
CREATE VIEW content_with_philosophy AS
SELECT 
  c.*,
  p.title as philosophy_title,
  p.brief_explanation as philosophy_brief,
  p.key_principles
FROM content_items c
LEFT JOIN philosophy_primers p ON c.philosophy_domain = p.domain;

CREATE VIEW content_relationships_detailed AS
SELECT 
  cr.*,
  sc.title as source_title,
  tc.title as target_title,
  sc.philosophy_domain as source_domain,
  tc.philosophy_domain as target_domain
FROM content_relationships cr
JOIN content_items sc ON cr.source_content_id = sc.id
JOIN content_items tc ON cr.target_content_id = tc.id;

CREATE VIEW user_engagement_summary AS
SELECT 
  ui.session_id,
  us.user_role,
  us.current_focus_domain,
  COUNT(*) as total_interactions,
  AVG(ui.duration) as avg_duration,
  AVG(ui.satisfaction_rating) as avg_satisfaction,
  COUNT(DISTINCT ui.content_id) as unique_content_viewed,
  MAX(ui.created_at) as last_interaction
FROM user_interactions ui
JOIN user_sessions us ON ui.session_id = us.session_id
GROUP BY ui.session_id, us.user_role, us.current_focus_domain;

CREATE VIEW content_performance AS
SELECT 
  c.id,
  c.title,
  c.philosophy_domain,
  c.quality_score,
  c.engagement_score,
  c.view_count,
  COUNT(ui.id) as interaction_count,
  AVG(ui.satisfaction_rating) as avg_satisfaction,
  COUNT(DISTINCT ui.session_id) as unique_users
FROM content_items c
LEFT JOIN user_interactions ui ON c.id = ui.content_id
GROUP BY c.id, c.title, c.philosophy_domain, c.quality_score, c.engagement_score, c.view_count;

-- Insert initial philosophy primers
INSERT INTO philosophy_primers (domain, title, brief_explanation, detailed_explanation, key_principles, business_case) VALUES 
(
  'imagination-based-learning',
  'Imagination-Based Learning',
  'Education that prioritizes imagination as the foundation for all learning, moving beyond standardized approaches to cultivate creative thinking and problem-solving.',
  'Imagination-Based Learning represents a fundamental shift from traditional education models that prioritize standardization and compliance to approaches that center imagination as the core capacity for learning and growth. This philosophy recognizes that imagination is not a luxury or add-on to education, but the essential human capacity that enables us to envision possibilities, solve complex problems, and create meaningful change. It involves creating learning environments where students are encouraged to question, explore, and create rather than simply consume predetermined content.',
  ARRAY['Imagination as foundation', 'Student agency and voice', 'Real-world problem solving', 'Creative confidence building', 'Collaborative learning'],
  'Research shows that imagination-based approaches lead to higher engagement, better retention, improved problem-solving skills, and greater student satisfaction. Organizations implementing these approaches see increased innovation, better team collaboration, and more adaptive responses to change.'
),
(
  'hoodie-economics',
  'Hoodie Economics',
  'An economic philosophy that prioritizes relational value over transactional value, focusing on long-term community wellbeing rather than short-term individual gain.',
  'Hoodie Economics challenges the fundamental assumptions of traditional economic models by prioritizing relationships, community wellbeing, and long-term sustainability over short-term profit maximization. Named after the hoodie as a symbol of comfort, belonging, and shared identity, this approach recognizes that true value is created through connections, trust, and mutual support rather than purely transactional exchanges. It emphasizes abundance thinking, collaborative problem-solving, and the understanding that individual success is interconnected with community success.',
  ARRAY['Relational over transactional', 'Community wellbeing focus', 'Long-term sustainability', 'Abundance mindset', 'Collaborative value creation'],
  'Organizations adopting hoodie economic principles report higher employee satisfaction, stronger community relationships, more sustainable growth, and greater resilience during challenges. Communities implementing these approaches see reduced inequality, increased social cohesion, and more innovative solutions to local problems.'
),
(
  'mentoring-systems',
  'Mentoring Systems',
  'Structured approaches to mentoring that create networks of support, learning, and growth rather than traditional one-to-one relationships.',
  'Mentoring Systems represent an evolution from traditional mentoring models to comprehensive networks of support that recognize mentoring as a systemic practice rather than individual relationships. This approach creates interconnected webs of learning where everyone is both a mentor and mentee, sharing knowledge, experience, and support across different levels and contexts. It emphasizes cultural responsiveness, reciprocal learning, and the understanding that effective mentoring requires systemic support and intentional design.',
  ARRAY['Network-based mentoring', 'Reciprocal learning', 'Cultural responsiveness', 'Systemic support', 'Intentional relationship design'],
  'Research demonstrates that systemic mentoring approaches lead to better outcomes for all participants, increased retention rates, stronger community connections, and more equitable access to opportunities. Organizations with strong mentoring systems show higher employee engagement, better succession planning, and more inclusive cultures.'
);

-- Insert initial implementation pathways
INSERT INTO implementation_pathways (name, description, philosophy_domain, target_audience, difficulty_level, estimated_duration, steps) VALUES 
(
  'Educator Introduction to Imagination-Based Learning',
  'A comprehensive pathway for educators to understand and begin implementing imagination-based learning approaches in their classrooms.',
  'imagination-based-learning',
  'educators',
  2,
  '4 weeks',
  '[
    {"step": 1, "title": "Understanding the Philosophy", "description": "Explore the core principles of imagination-based learning", "resources": ["philosophy_primer"], "duration": "3 days"},
    {"step": 2, "title": "Assessing Current Practice", "description": "Evaluate your current teaching methods and identify opportunities", "resources": ["assessment_tool"], "duration": "2 days"},
    {"step": 3, "title": "Designing Imagination-Centered Activities", "description": "Create your first imagination-based learning experiences", "resources": ["activity_templates"], "duration": "1 week"},
    {"step": 4, "title": "Implementation and Reflection", "description": "Try new approaches and reflect on outcomes", "resources": ["reflection_guide"], "duration": "2 weeks"}
  ]'::jsonb
),
(
  'Organization Transition to Hoodie Economics',
  'A structured approach for organizations to transition from traditional economic models to hoodie economic principles.',
  'hoodie-economics',
  'community-leaders',
  3,
  '3 months',
  '[
    {"step": 1, "title": "Philosophy Deep Dive", "description": "Understand hoodie economics principles and business case", "resources": ["philosophy_primer", "case_studies"], "duration": "1 week"},
    {"step": 2, "title": "Current State Assessment", "description": "Evaluate existing economic relationships and practices", "resources": ["assessment_framework"], "duration": "2 weeks"},
    {"step": 3, "title": "Stakeholder Engagement", "description": "Build understanding and buy-in across the organization", "resources": ["engagement_toolkit"], "duration": "3 weeks"},
    {"step": 4, "title": "Pilot Implementation", "description": "Start with small-scale hoodie economic practices", "resources": ["pilot_guide"], "duration": "4 weeks"},
    {"step": 5, "title": "Scaling and Integration", "description": "Expand successful practices across the organization", "resources": ["scaling_framework"], "duration": "4 weeks"}
  ]'::jsonb
);

-- Create initial sync status for enhanced system
INSERT INTO sync_status (source, next_sync_at) VALUES 
('youtube', NOW()),
('airtable', NOW()),
('mailchimp', NOW()),
('github', NOW()),
('philosophy_content', NOW())
ON CONFLICT (source) DO NOTHING;