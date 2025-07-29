-- Business Cases Extension for AIME Data Lake

-- Business Cases table
CREATE TABLE IF NOT EXISTS business_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  impact TEXT,
  metrics TEXT, -- JSON string with key metrics
  industry TEXT,
  region TEXT,
  program_type TEXT,
  year INTEGER,
  featured_image_url TEXT,
  related_tools TEXT, -- JSON array of tool IDs
  related_videos TEXT, -- JSON array of video IDs
  related_content TEXT, -- JSON array of other content IDs
  tags TEXT, -- JSON array
  source_url TEXT,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for business cases
CREATE INDEX IF NOT EXISTS idx_business_cases_industry ON business_cases(industry);
CREATE INDEX IF NOT EXISTS idx_business_cases_region ON business_cases(region);
CREATE INDEX IF NOT EXISTS idx_business_cases_year ON business_cases(year);
CREATE INDEX IF NOT EXISTS idx_business_cases_program ON business_cases(program_type);
CREATE INDEX IF NOT EXISTS idx_business_cases_featured ON business_cases(is_featured);

-- Cross-references table for content relationships
CREATE TABLE IF NOT EXISTS content_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  strength REAL DEFAULT 1.0,
  metadata TEXT, -- JSON string
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_type, source_id, target_type, target_id, relationship_type)
);

-- Indexes for relationships
CREATE INDEX IF NOT EXISTS idx_relationships_source ON content_relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON content_relationships(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON content_relationships(relationship_type);

-- Full-text search for business cases
CREATE VIRTUAL TABLE IF NOT EXISTS business_cases_fts USING fts5(
  id, title, summary, challenge, solution, impact, tags
);

-- Example relationships:
-- business_case -> tool (used_in)
-- business_case -> video (featured_in)
-- tool -> video (demonstrated_in)
-- content -> content (related_to)