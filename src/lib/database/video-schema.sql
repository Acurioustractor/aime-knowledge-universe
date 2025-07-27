-- IMAGI-NATION TV Video Database Schema
-- Comprehensive video management system for AIME platform

-- Main episodes table
CREATE TABLE IF NOT EXISTS imagination_tv_episodes (
  id TEXT PRIMARY KEY,
  episode_number INTEGER NOT NULL,
  season INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Video metadata
  video_url TEXT NOT NULL,
  youtube_id TEXT,
  vimeo_id TEXT,
  duration_seconds INTEGER,
  duration_iso TEXT, -- PT25M18S format
  thumbnail_url TEXT,
  
  -- Publishing info
  published_at DATETIME NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK(status IN ('draft', 'published', 'archived', 'coming-soon')) DEFAULT 'draft',
  
  -- Content categorization
  content_type TEXT DEFAULT 'educational',
  themes TEXT, -- JSON array: ["imagination", "systems-thinking"]
  programs TEXT, -- JSON array: ["imagi-labs", "youth-leadership"]
  learning_objectives TEXT, -- JSON array
  age_groups TEXT, -- JSON array: ["13-17", "18+"]
  cultural_contexts TEXT, -- JSON array: ["Indigenous", "Global"]
  
  -- Engagement data
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  discussion_count INTEGER DEFAULT 0,
  reflection_count INTEGER DEFAULT 0,
  
  -- Transcription and AI processing
  has_transcription BOOLEAN DEFAULT FALSE,
  transcription_status TEXT CHECK(transcription_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  transcription_text TEXT,
  transcription_confidence REAL,
  wisdom_extracts_count INTEGER DEFAULT 0,
  key_topics TEXT, -- JSON array
  
  -- Access control
  access_level TEXT CHECK(access_level IN ('public', 'community', 'internal')) DEFAULT 'public',
  cultural_sensitivity TEXT CHECK(cultural_sensitivity IN ('none', 'advisory', 'permission-required')) DEFAULT 'none',
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(episode_number, season)
);

-- Episode segments table for interactive features
CREATE TABLE IF NOT EXISTS episode_segments (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  
  -- Segment timing
  start_time INTEGER NOT NULL, -- seconds
  end_time INTEGER NOT NULL,
  segment_order INTEGER NOT NULL,
  
  -- Segment content
  segment_type TEXT CHECK(segment_type IN ('introduction', 'story', 'wisdom', 'activity', 'reflection', 'discussion')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Interactive features
  discussion_prompts TEXT, -- JSON array
  related_content TEXT, -- JSON array of links/references
  wisdom_indicators REAL DEFAULT 0, -- 0-1 score
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE
);

-- Wisdom extracts from video transcriptions
CREATE TABLE IF NOT EXISTS video_wisdom_extracts (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  segment_id TEXT, -- Optional link to specific segment
  
  -- Extract content
  extract_type TEXT CHECK(extract_type IN ('indigenous-wisdom', 'systems-thinking', 'mentoring-insight', 'principle', 'story', 'methodology', 'reflection', 'teaching', 'ceremony')) NOT NULL,
  content TEXT NOT NULL,
  
  -- Timing and context
  timestamp_start INTEGER NOT NULL, -- seconds
  timestamp_end INTEGER,
  speaker TEXT,
  
  -- AI analysis
  confidence REAL NOT NULL, -- 0-1
  themes TEXT, -- JSON array
  cultural_context TEXT,
  applications TEXT, -- JSON array
  related_concepts TEXT, -- JSON array
  
  -- Manual review
  reviewed BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  reviewer_notes TEXT,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE,
  FOREIGN KEY (segment_id) REFERENCES episode_segments(id) ON DELETE SET NULL
);

-- Episode transcriptions
CREATE TABLE IF NOT EXISTS episode_transcriptions (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL UNIQUE,
  
  -- Transcription data
  full_text TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  provider TEXT, -- 'whisper', 'google', 'assemblyai'
  confidence REAL,
  
  -- Processing metadata
  word_count INTEGER,
  speaker_count INTEGER,
  processing_time_ms INTEGER,
  cost_cents INTEGER,
  
  -- Status tracking
  status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  started_at DATETIME,
  completed_at DATETIME,
  error_message TEXT,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE
);

-- Transcription segments with timestamps
CREATE TABLE IF NOT EXISTS transcription_segments (
  id TEXT PRIMARY KEY,
  transcription_id TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  
  -- Segment data
  segment_order INTEGER NOT NULL,
  start_time INTEGER NOT NULL, -- seconds
  end_time INTEGER NOT NULL,
  text TEXT NOT NULL,
  confidence REAL,
  
  -- Speaker identification
  speaker_id TEXT,
  speaker_name TEXT,
  
  -- AI analysis
  emotions TEXT, -- JSON array
  keywords TEXT, -- JSON array
  wisdom_score REAL DEFAULT 0, -- 0-1
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (transcription_id) REFERENCES episode_transcriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE
);

-- Episode knowledge connections to documents
CREATE TABLE IF NOT EXISTS episode_knowledge_connections (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  
  -- Connection target
  document_id TEXT NOT NULL,
  document_title TEXT,
  document_type TEXT, -- 'knowledge-doc', 'business-case', 'tool', 'newsletter'
  
  -- Connection details
  relationship_type TEXT CHECK(relationship_type IN ('references', 'expands-on', 'example-of', 'contradicts', 'builds-upon')) NOT NULL,
  relevance_score REAL NOT NULL, -- 0-1
  
  -- Specific connections
  episode_timestamp INTEGER, -- seconds where connection is relevant
  document_section TEXT,
  connection_description TEXT,
  
  -- Verification
  auto_generated BOOLEAN DEFAULT TRUE,
  manually_verified BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE
);

-- Video analytics and engagement tracking
CREATE TABLE IF NOT EXISTS episode_analytics (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  
  -- View analytics
  total_views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  average_watch_time INTEGER, -- seconds
  completion_rate REAL, -- 0-1
  
  -- Engagement metrics
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  discussions_started INTEGER DEFAULT 0,
  reflections_submitted INTEGER DEFAULT 0,
  
  -- Wisdom engagement
  wisdom_extracts_viewed INTEGER DEFAULT 0,
  wisdom_extracts_shared INTEGER DEFAULT 0,
  knowledge_connections_followed INTEGER DEFAULT 0,
  
  -- Timestamp tracking
  most_replayed_segment TEXT, -- JSON: {start: 120, end: 180, count: 45}
  drop_off_points TEXT, -- JSON array of timestamps where viewers leave
  
  -- Geographic and demographic data
  viewer_regions TEXT, -- JSON object
  viewer_age_groups TEXT, -- JSON object
  
  -- Time series data
  analytics_date DATE NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE,
  UNIQUE(episode_id, analytics_date)
);

-- Community discussions and reflections
CREATE TABLE IF NOT EXISTS episode_discussions (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  segment_id TEXT, -- Optional link to specific segment
  
  -- Discussion content
  discussion_type TEXT CHECK(discussion_type IN ('question', 'reflection', 'insight', 'application', 'critique', 'extension')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- User context (anonymized)
  user_role TEXT, -- 'student', 'educator', 'community-leader', 'practitioner'
  user_region TEXT,
  
  -- Engagement
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- Moderation
  status TEXT CHECK(status IN ('pending', 'approved', 'flagged', 'removed')) DEFAULT 'pending',
  moderator_notes TEXT,
  
  -- Cultural sensitivity
  cultural_context_sensitive BOOLEAN DEFAULT FALSE,
  requires_elder_review BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE,
  FOREIGN KEY (segment_id) REFERENCES episode_segments(id) ON DELETE SET NULL
);

-- Video processing jobs queue
CREATE TABLE IF NOT EXISTS video_processing_jobs (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  
  -- Job details
  job_type TEXT CHECK(job_type IN ('transcription', 'wisdom-extraction', 'knowledge-connection', 'analytics-update', 'thumbnail-generation')) NOT NULL,
  status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  -- Processing details
  provider TEXT, -- 'openai', 'google', 'assemblyai', 'internal'
  input_data TEXT, -- JSON
  output_data TEXT, -- JSON
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0,
  current_step TEXT,
  estimated_completion DATETIME,
  
  -- Resource usage
  processing_time_ms INTEGER,
  cost_cents INTEGER,
  tokens_used INTEGER,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  
  FOREIGN KEY (episode_id) REFERENCES imagination_tv_episodes(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_episodes_status ON imagination_tv_episodes(status);
CREATE INDEX IF NOT EXISTS idx_episodes_published ON imagination_tv_episodes(published_at);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON imagination_tv_episodes(episode_number, season);
CREATE INDEX IF NOT EXISTS idx_segments_episode ON episode_segments(episode_id, segment_order);
CREATE INDEX IF NOT EXISTS idx_wisdom_episode ON video_wisdom_extracts(episode_id, confidence);
CREATE INDEX IF NOT EXISTS idx_wisdom_type ON video_wisdom_extracts(extract_type, approved);
CREATE INDEX IF NOT EXISTS idx_transcription_episode ON episode_transcriptions(episode_id, status);
CREATE INDEX IF NOT EXISTS idx_transcription_segments_episode ON transcription_segments(episode_id, start_time);
CREATE INDEX IF NOT EXISTS idx_knowledge_connections_episode ON episode_knowledge_connections(episode_id, relevance_score);
CREATE INDEX IF NOT EXISTS idx_analytics_episode_date ON episode_analytics(episode_id, analytics_date);
CREATE INDEX IF NOT EXISTS idx_discussions_episode ON episode_discussions(episode_id, status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON video_processing_jobs(status, priority, created_at);

-- Views for common queries
CREATE VIEW IF NOT EXISTS published_episodes AS
SELECT 
  id, episode_number, season, title, description,
  video_url, youtube_id, duration_iso, thumbnail_url,
  published_at, themes, programs, learning_objectives,
  view_count, like_count, discussion_count,
  has_transcription, wisdom_extracts_count,
  access_level, cultural_sensitivity
FROM imagination_tv_episodes 
WHERE status = 'published' 
ORDER BY season DESC, episode_number DESC;

CREATE VIEW IF NOT EXISTS episode_stats AS
SELECT 
  e.id, e.title, e.episode_number, e.season,
  e.view_count, e.wisdom_extracts_count,
  COUNT(DISTINCT s.id) as segment_count,
  COUNT(DISTINCT w.id) as wisdom_count,
  COUNT(DISTINCT d.id) as discussion_count,
  AVG(w.confidence) as avg_wisdom_confidence,
  e.published_at
FROM imagination_tv_episodes e
LEFT JOIN episode_segments s ON e.id = s.episode_id
LEFT JOIN video_wisdom_extracts w ON e.id = w.episode_id AND w.approved = TRUE
LEFT JOIN episode_discussions d ON e.id = d.episode_id AND d.status = 'approved'
WHERE e.status = 'published'
GROUP BY e.id, e.title, e.episode_number, e.season, e.view_count, e.wisdom_extracts_count, e.published_at;

-- Sample data insertion for IMAGI-NATION TV Episode 1
INSERT OR REPLACE INTO imagination_tv_episodes (
  id, episode_number, season, title, description,
  video_url, youtube_id, duration_seconds, duration_iso,
  thumbnail_url, published_at, status,
  themes, programs, learning_objectives,
  view_count, like_count, discussion_count,
  has_transcription, transcription_status, wisdom_extracts_count,
  key_topics, access_level, cultural_sensitivity
) VALUES (
  'imagi-tv-s1e1',
  1, 1,
  'Welcome to the Movement',
  'The first episode of IMAGI-NATION TV, introducing viewers to a new way of thinking about education and systems change through Indigenous wisdom and imagination.',
  'https://www.youtube.com/watch?v=imagi-nation-tv-1',
  'imagi-nation-tv-1',
  1518, 'PT25M18S',
  'https://img.youtube.com/vi/imagi-1/maxresdefault.jpg',
  '2024-01-15 10:00:00',
  'published',
  '["imagination", "systems-change", "education", "indigenous-wisdom"]',
  '["imagi-labs", "youth-leadership"]',
  '["Understand the core principles of imagination-based learning", "Explore the connection between Indigenous wisdom and systems thinking", "Identify opportunities for positive change in your community"]',
  45230, 2134, 342,
  TRUE, 'completed', 8,
  '["imagination", "systems-thinking", "indigenous-wisdom", "education-transformation", "youth-leadership", "community-change", "seven-generation-thinking", "relationship-building"]',
  'public', 'advisory'
);