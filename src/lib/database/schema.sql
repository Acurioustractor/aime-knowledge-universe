-- AIME Wiki Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    permissions TEXT[],
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('video', 'article', 'research', 'story', 'tool', 'event')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content TEXT,
    url VARCHAR(1000),
    external_id VARCHAR(255), -- YouTube video ID, Airtable record ID, etc.
    source VARCHAR(100), -- 'youtube', 'airtable', 'github', etc.
    author VARCHAR(255),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    search_vector tsvector
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS content_search_idx ON content_items USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS content_type_idx ON content_items(type);
CREATE INDEX IF NOT EXISTS content_source_idx ON content_items(source);
CREATE INDEX IF NOT EXISTS content_published_idx ON content_items(published_at);
CREATE INDEX IF NOT EXISTS content_featured_idx ON content_items(is_featured);
CREATE INDEX IF NOT EXISTS content_external_id_idx ON content_items(external_id, source);

-- YouTube channels table
CREATE TABLE IF NOT EXISTS youtube_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(255) UNIQUE NOT NULL,
    channel_name VARCHAR(255) NOT NULL,
    custom_url VARCHAR(255),
    description TEXT,
    subscriber_count BIGINT,
    video_count INTEGER,
    view_count BIGINT,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id VARCHAR(255) UNIQUE NOT NULL,
    channel_id VARCHAR(255) REFERENCES youtube_channels(channel_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    published_at TIMESTAMP,
    duration INTEGER, -- in seconds
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    thumbnail_url VARCHAR(500),
    transcript TEXT,
    transcript_processed BOOLEAN DEFAULT false,
    tags TEXT[],
    category_id INTEGER,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    search_vector tsvector
);

CREATE INDEX IF NOT EXISTS youtube_videos_search_idx ON youtube_videos USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS youtube_videos_channel_idx ON youtube_videos(channel_id);
CREATE INDEX IF NOT EXISTS youtube_videos_published_idx ON youtube_videos(published_at);

-- Airtable records table
CREATE TABLE IF NOT EXISTS airtable_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id VARCHAR(255) NOT NULL,
    table_id VARCHAR(255) NOT NULL,
    base_id VARCHAR(255) NOT NULL,
    fields JSONB NOT NULL DEFAULT '{}',
    created_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP,
    UNIQUE(record_id, table_id)
);

CREATE INDEX IF NOT EXISTS airtable_records_table_idx ON airtable_records(table_id);
CREATE INDEX IF NOT EXISTS airtable_records_base_idx ON airtable_records(base_id);

-- Sync jobs table for tracking synchronization operations
CREATE TABLE IF NOT EXISTS sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type VARCHAR(100) NOT NULL, -- 'youtube_full', 'youtube_incremental', 'airtable_sync', etc.
    source VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0, -- percentage 0-100
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS sync_jobs_status_idx ON sync_jobs(status);
CREATE INDEX IF NOT EXISTS sync_jobs_type_idx ON sync_jobs(job_type);
CREATE INDEX IF NOT EXISTS sync_jobs_created_idx ON sync_jobs(created_at);

-- Cache entries table (as fallback when Redis is not available)
CREATE TABLE IF NOT EXISTS cache_entries (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS cache_expires_idx ON cache_entries(expires_at);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS activity_log_user_idx ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS activity_log_action_idx ON activity_log(action);
CREATE INDEX IF NOT EXISTS activity_log_created_idx ON activity_log(created_at);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Functions for updating search vectors
CREATE OR REPLACE FUNCTION update_content_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
                        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
                        setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::TEXT[]), ' ')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_youtube_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
                        setweight(to_tsvector('english', COALESCE(NEW.transcript, '')), 'C') ||
                        setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::TEXT[]), ' ')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating search vectors
DROP TRIGGER IF EXISTS content_search_vector_update ON content_items;
CREATE TRIGGER content_search_vector_update
    BEFORE INSERT OR UPDATE ON content_items
    FOR EACH ROW EXECUTE FUNCTION update_content_search_vector();

DROP TRIGGER IF EXISTS youtube_search_vector_update ON youtube_videos;
CREATE TRIGGER youtube_search_vector_update
    BEFORE INSERT OR UPDATE ON youtube_videos
    FOR EACH ROW EXECUTE FUNCTION update_youtube_search_vector();

-- Function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_youtube_channels_updated_at BEFORE UPDATE ON youtube_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_youtube_videos_updated_at BEFORE UPDATE ON youtube_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_airtable_records_updated_at BEFORE UPDATE ON airtable_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password should be changed immediately)
INSERT INTO users (email, password_hash, role, permissions) 
VALUES (
    'admin@aime.wiki',
    '$2b$10$8K1p/a9U/y8W9iGwLj5RH.1jkuF5Q9tL3/gM2xI/rM9H3lOp2Q6re', -- 'admin123' - CHANGE THIS!
    'admin',
    ARRAY['youtube:read', 'youtube:sync', 'youtube:admin', 'content:read', 'content:write', 'content:delete', 'airtable:read', 'airtable:write', 'airtable:sync', 'system:admin', 'system:monitor', 'api:access', 'api:admin']
) ON CONFLICT (email) DO NOTHING;

-- Insert default system configuration
INSERT INTO system_config (key, value, description) VALUES 
    ('app_name', '"AIME Wiki"', 'Application name'),
    ('youtube_sync_enabled', 'true', 'Enable YouTube synchronization'),
    ('airtable_sync_enabled', 'true', 'Enable Airtable synchronization'),
    ('cache_enabled', 'true', 'Enable Redis caching'),
    ('search_enabled', 'true', 'Enable full-text search'),
    ('max_search_results', '100', 'Maximum search results per query'),
    ('sync_interval_minutes', '30', 'Default sync interval in minutes')
ON CONFLICT (key) DO NOTHING;