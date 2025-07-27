# AIME Wiki Database Migration Plan

## Current Problem
- Constant API calls during build (expensive & slow)
- No persistent storage of content
- Rate limiting issues with external APIs
- Poor performance and reliability

## Solution: Supabase Database with Smart Sync

### Phase 1: Database Setup

#### 1.1 Supabase Schema Design
```sql
-- Main content table
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL, -- Original ID from source
  source TEXT NOT NULL, -- 'youtube', 'airtable', 'mailchimp', 'github'
  content_type TEXT NOT NULL, -- 'video', 'tool', 'newsletter', 'story'
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Full content/transcript
  url TEXT,
  thumbnail_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{}',
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  
  -- Timestamps
  source_created_at TIMESTAMPTZ,
  source_updated_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(source, source_id)
);

-- Sync status tracking
CREATE TABLE sync_status (
  source TEXT PRIMARY KEY,
  last_sync_at TIMESTAMPTZ,
  last_successful_sync_at TIMESTAMPTZ,
  total_records INTEGER DEFAULT 0,
  sync_duration_ms INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  next_sync_at TIMESTAMPTZ,
  is_syncing BOOLEAN DEFAULT FALSE
);

-- Full-text search
CREATE INDEX content_search_idx ON content_items 
USING GIN (to_tsvector('english', title || ' ' || description || ' ' || content));

-- Performance indexes
CREATE INDEX idx_content_source ON content_items(source);
CREATE INDEX idx_content_type ON content_items(content_type);
CREATE INDEX idx_content_updated ON content_items(updated_at DESC);
CREATE INDEX idx_content_created ON content_items(source_created_at DESC);
```

#### 1.2 Environment Configuration
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Sync Configuration
ENABLE_AUTO_SYNC=true
SYNC_INTERVAL_HOURS=6
FORCE_SYNC_ON_STARTUP=false
```

### Phase 2: Smart Sync System

#### 2.1 Sync Strategy
- **Initial Sync**: Full data import from all sources
- **Incremental Sync**: Only fetch new/updated content
- **Scheduled Sync**: Background sync every 6 hours
- **Manual Sync**: Admin-triggered full refresh
- **Real-time Updates**: For critical content

#### 2.2 Sync Priority
1. **High Priority** (sync every hour): Newsletters, announcements
2. **Medium Priority** (sync every 6 hours): YouTube videos, tools
3. **Low Priority** (sync daily): GitHub content, archived materials

### Phase 3: Implementation Plan

#### 3.1 Database Layer
```typescript
// src/lib/database/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export class ContentRepository {
  // Fast content retrieval (no API calls)
  async getContent(options: {
    source?: string
    contentType?: string
    limit?: number
    offset?: number
    search?: string
  }) {
    // Query local database only
  }
  
  // Batch upsert for sync operations
  async syncContent(source: string, items: ContentItem[]) {
    // Efficient batch operations
  }
}
```

#### 3.2 Sync Service
```typescript
// src/lib/sync/sync-service.ts
export class SyncService {
  async syncYouTube() {
    // Only call YouTube API, store in database
  }
  
  async syncAirtable() {
    // Only call Airtable API, store in database
  }
  
  async syncMailchimp() {
    // Only call Mailchimp API, store in database
  }
  
  async scheduleSync() {
    // Background sync scheduling
  }
}
```

#### 3.3 API Routes Update
```typescript
// src/app/api/content/route.ts
export async function GET() {
  // Always query database, never external APIs
  const repository = new ContentRepository()
  return repository.getContent(options)
}

// src/app/api/sync/route.ts
export async function POST() {
  // Manual sync trigger (admin only)
  const syncService = new SyncService()
  return syncService.syncAll()
}
```

### Phase 4: Migration Steps

#### Step 1: Setup Supabase
1. Create Supabase project
2. Run schema migration
3. Configure environment variables

#### Step 2: Initial Data Import
1. Run one-time sync from all sources
2. Populate database with existing content
3. Verify data integrity

#### Step 3: Update Application
1. Replace API calls with database queries
2. Implement sync service
3. Add admin sync controls

#### Step 4: Background Sync
1. Setup scheduled sync jobs
2. Implement error handling
3. Add monitoring/alerts

### Phase 5: Benefits

#### Performance
- **Build Time**: Reduced from 5+ minutes to <1 minute
- **Page Load**: Instant content loading
- **API Costs**: 90% reduction in external API calls

#### Reliability
- **Offline Capability**: Content available even if APIs are down
- **Rate Limiting**: No more API rate limit issues
- **Consistency**: Stable content during high traffic

#### Scalability
- **Caching**: Built-in database caching
- **Search**: Full-text search without API calls
- **Analytics**: Track content performance locally

### Phase 6: Monitoring & Maintenance

#### Sync Monitoring
- Track sync success/failure rates
- Monitor API quota usage
- Alert on sync failures

#### Data Quality
- Validate content integrity
- Handle duplicate detection
- Manage content lifecycle

#### Performance Optimization
- Database query optimization
- Index management
- Cache strategies

## Implementation Timeline

**Week 1**: Supabase setup + schema
**Week 2**: Sync service implementation
**Week 3**: Application updates
**Week 4**: Testing + deployment

## Cost Analysis

**Current**: ~$50/month in API calls during development
**With Database**: ~$10/month (Supabase free tier + minimal API calls)
**Savings**: 80% cost reduction + massive performance improvement