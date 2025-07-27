-- AIME Wiki Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main content table
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL, -- Original ID from source (youtube video id, airtable record id, etc)
  source TEXT NOT NULL, -- 'youtube', 'airtable', 'mailchimp', 'github'
  content_type TEXT NOT NULL, -- 'video', 'tool', 'newsletter', 'story', 'research'
  
  -- Core content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Full content/transcript for search
  url TEXT,
  thumbnail_url TEXT,
  
  -- Structured metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  
  -- Analytics & engagement
  view_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Source timestamps
  source_created_at TIMESTAMPTZ,
  source_updated_at TIMESTAMPTZ,
  
  -- System timestamps
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure uniqueness per source
  UNIQUE(source, source_id)
);

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

-- Content relationships (for related content features)
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  related_content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'similar', 'referenced', 'sequel', 'part_of'
  strength FLOAT DEFAULT 0.5, -- 0-1 relationship strength
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(source_content_id, related_content_id, relationship_type)
);

-- User interactions (for analytics)
CREATE TABLE content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'view', 'download', 'share', 'like'
  user_session TEXT, -- Anonymous session tracking
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search queries (for analytics)
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  user_session TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_content_source ON content_items(source);
CREATE INDEX idx_content_type ON content_items(content_type);
CREATE INDEX idx_content_updated ON content_items(updated_at DESC);
CREATE INDEX idx_content_created ON content_items(source_created_at DESC);
CREATE INDEX idx_content_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_content_tags ON content_items USING GIN(tags);
CREATE INDEX idx_content_categories ON content_items USING GIN(categories);

-- Full-text search index (simplified to avoid IMMUTABLE function issues)
CREATE INDEX content_search_idx ON content_items 
USING GIN (to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(content, '')
));

-- Relationship indexes
CREATE INDEX idx_relationships_source ON content_relationships(source_content_id);
CREATE INDEX idx_relationships_related ON content_relationships(related_content_id);

-- Analytics indexes
CREATE INDEX idx_interactions_content ON content_interactions(content_id);
CREATE INDEX idx_interactions_type ON content_interactions(interaction_type);
CREATE INDEX idx_interactions_date ON content_interactions(created_at DESC);

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

-- Row Level Security (RLS) - Enable if you need user-specific access
-- ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- CREATE POLICY "Public content read access" ON content_items FOR SELECT USING (true);
-- CREATE POLICY "Public sync status read access" ON sync_status FOR SELECT USING (true);

-- Useful views for common queries
CREATE VIEW content_summary AS
SELECT 
  source,
  content_type,
  COUNT(*) as total_items,
  MAX(last_synced_at) as last_sync,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as new_today,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count
FROM content_items 
GROUP BY source, content_type;

CREATE VIEW popular_content AS
SELECT 
  id,
  title,
  source,
  content_type,
  view_count,
  engagement_score,
  created_at
FROM content_items 
WHERE view_count > 0 
ORDER BY engagement_score DESC, view_count DESC;

-- Insert initial sync status records
INSERT INTO sync_status (source, next_sync_at) VALUES 
('youtube', NOW()),
('airtable', NOW()),
('mailchimp', NOW()),
('github', NOW())
ON CONFLICT (source) DO NOTHING;

-- Sample data for testing (remove in production)
-- INSERT INTO content_items (source_id, source, content_type, title, description, url) VALUES
-- ('test-1', 'youtube', 'video', 'Sample Video', 'This is a test video', 'https://youtube.com/watch?v=test'),
-- ('test-2', 'airtable', 'tool', 'Sample Tool', 'This is a test tool', 'https://example.com/tool');