# AIME Knowledge Universe - Database Schema Analysis

## Overview
The AIME platform uses SQLite as the primary database with a comprehensive schema designed around content aggregation, Indigenous knowledge protocols, and the innovative "Hoodie Stock Exchange" system.

## Database Architecture

### **Core Database Setup**
- **Database**: SQLite with WAL (Write-Ahead Logging) mode
- **Performance**: Optimized with 1GB cache, memory temp storage, 256MB memory mapping
- **Location**: `./data/aime-data-lake.db`
- **Connection**: Singleton pattern with connection pooling

### **Schema Philosophy**
The database is architected around three main pillars:
1. **Content Aggregation**: Unified content from multiple sources (Airtable, YouTube, Mailchimp, GitHub)
2. **Knowledge Management**: Indigenous knowledge with cultural sensitivity protocols
3. **Gamified Learning**: Hoodie Stock Exchange for achievement and mentoring systems

---

## **Table Structure & Purpose**

### **📋 Core Content Tables**

#### **`content` (Primary Content Hub)**
**Purpose**: Central repository for all content types across AIME platform
**Why**: Unified content model allows for consistent search, filtering, and relationship mapping

| Column | Type | Purpose | Storage Pattern |
|--------|------|---------|----------------|
| `id` | TEXT PRIMARY KEY | Unique identifier (prefixed by type) | `tool-123`, `video-abc`, `newsletter-xyz` |
| `source` | TEXT | Origin system | `airtable`, `youtube`, `mailchimp`, `github` |
| `title` | TEXT | Content title/name | Direct from source API |
| `description` | TEXT | Content description | Truncated for performance |
| `content_type` | TEXT | Type classification | `tool`, `video`, `newsletter`, `knowledge` |
| `category` | TEXT | Content categorization | Source-specific categories |
| `tags`, `themes`, `topics` | TEXT (JSON) | Metadata arrays | Stored as JSON strings for flexibility |
| `metadata` | TEXT (JSON) | Source-specific data | Preserves original structure |
| `view_count` | INTEGER | Engagement tracking | Updated by user interactions |

**Relationships**: Referenced by specialized tables (tools, videos, newsletters)

#### **`tools` (Airtable Integration)**
**Purpose**: Extends content table with tool-specific metadata from Airtable
**Why**: Tools have unique properties (file attachments, usage restrictions) requiring specialized storage

| Column | Purpose | Storage Pattern |
|--------|---------|----------------|
| `tool_type` | Tool classification | From Airtable field |
| `usage_restrictions` | Access limitations | Direct text from Airtable |
| `file_size` | Attachment size info | Human-readable format |
| `download_url` | Direct download link | Airtable attachment URL |
| `attachments` | Attachment metadata | JSON array of file objects |
| `airtable_record_id` | Source record ID | For sync reconciliation |

**Storage Logic**: Only created when `content_type = 'tool'` and `source = 'airtable'`

#### **`videos` (YouTube Integration)**
**Purpose**: YouTube-specific metadata including analytics and video properties
**Why**: Videos require rich metadata (duration, view counts, transcripts) not applicable to other content

| Column | Purpose | Storage Pattern |
|--------|---------|----------------|
| `video_id` | YouTube video ID | 11-character YouTube ID |
| `channel_id`, `channel_title` | Creator information | From YouTube API |
| `duration` | Video length | ISO 8601 duration format |
| `view_count`, `like_count` | Engagement metrics | Updated from YouTube API |
| `transcript` | Video transcript | Full text for search |
| `captions_available` | Accessibility info | Boolean flag |
| `privacy_status` | Visibility setting | `public`, `unlisted`, `private` |

**Sync Strategy**: Batch updates from YouTube Data API v3

#### **`newsletters` (Mailchimp Integration)**
**Purpose**: Email campaign data including performance metrics
**Why**: Newsletters have unique metrics (open rates, click rates) and email-specific properties

| Column | Purpose | Storage Pattern |
|--------|---------|----------------|
| `campaign_id` | Mailchimp campaign ID | Unique campaign identifier |
| `subject_line` | Email subject | Marketing copy |
| `content_html`, `content_text` | Email content | Full HTML and plain text |
| `archive_url` | Public archive link | Mailchimp hosted URL |
| `opens`, `clicks` | Performance metrics | Engagement tracking |
| `open_rate`, `click_rate` | Calculated percentages | Marketing analytics |
| `recipient_count` | Email list size | Delivery statistics |

---

### **🧠 Knowledge Management Tables**

#### **`knowledge_documents` (GitHub Integration)**
**Purpose**: Indigenous knowledge content with cultural sensitivity protocols
**Why**: Knowledge requires validation, cultural context, and version control

| Column | Purpose | Cultural Significance |
|--------|---------|----------------------|
| `github_path` | File location in repo | Maintains source lineage |
| `github_sha` | Version control hash | Tracks content changes |
| `markdown_content` | Original markdown | Preserves formatting |
| `validation_status` | Approval state | `pending`, `approved`, `needs_review` |
| `cultural_sensitivity_level` | Access control | `public`, `restricted`, `sacred` |

**Cultural Protocols**: 
- Content flagged for Indigenous context requires community validation
- Sensitivity levels control access and presentation
- Version tracking preserves attribution

#### **`knowledge_chunks` (Semantic Processing)**
**Purpose**: Segmented knowledge for semantic search and AI processing
**Why**: Enables fine-grained search and relationship detection while maintaining context

| Column | Purpose | Processing Logic |
|--------|---------|------------------|
| `chunk_index` | Sequential ordering | Maintains document flow |
| `chunk_content` | Text segment | ~500 word chunks |
| `chunk_type` | Content classification | `paragraph`, `heading`, `list` |
| `concepts` | Extracted concepts | JSON array of key terms |
| `semantic_embedding` | Vector representation | For similarity search |

**Processing Pipeline**: Documents → Chunks → Concept Extraction → Embeddings

#### **`knowledge_validations` (Community Review)**
**Purpose**: Multi-tier validation system for Indigenous knowledge
**Why**: Ensures cultural appropriateness and accuracy through community oversight

| Column | Purpose | Validation Logic |
|--------|---------|------------------|
| `validator_type` | Reviewer category | `community_elder`, `subject_expert`, `cultural_advisor` |
| `vote_score` | Approval rating | -1 (reject), 0 (neutral), 1 (approve) |
| `confidence_level` | Certainty measure | 0.0 to 1.0 scale |
| `cultural_considerations` | Sensitivity notes | Free text for context |

**Validation Process**: Content → Community Review → Cultural Assessment → Approval

---

### **👕 Hoodie Stock Exchange (Gamification System)**

#### **`hoodies` (Digital Achievements)**
**Purpose**: Gamified learning achievements representing skills and knowledge mastery
**Why**: Creates engaging pathways and recognizable milestones in the learning journey

| Column | Purpose | Economic Logic |
|--------|---------|---------------|
| `name` | Achievement title | Human-readable identifier |
| `category` | Skill domain | `transformation`, `knowledge`, `impact` |
| `subcategory` | Specific area | `joy-corps`, `systems-mapping` |
| `rarity_level` | Scarcity tier | `common`, `rare`, `legendary`, `mythic` |
| `base_impact_value` | Base worth | Starting impact rating |
| `imagination_credit_multiplier` | Earning boost | Credit generation multiplier |
| `unlock_criteria` | Achievement requirements | JSON-encoded conditions |
| `is_tradeable` | Exchange eligibility | Boolean transfer permission |
| `max_holders` | Scarcity limit | -1 for unlimited |

**Economic Model**: Hoodies represent earned capabilities that can be traded based on community value assessment

#### **`hoodie_holders` (Ownership Records)**
**Purpose**: Tracks who holds which achievements and their engagement
**Why**: Creates accountability and enables mentorship chains

| Column | Purpose | Social Logic |
|--------|---------|-------------|
| `holder_id` | Person identifier | Links to user/community member |
| `acquired_method` | How obtained | `earned`, `traded`, `mentored`, `gifted` |
| `acquisition_story` | Achievement narrative | Personal story of earning |
| `current_impact_contribution` | Active value creation | Ongoing contribution measure |
| `utilization_rate` | Engagement level | How actively using the skills |
| `mentorship_chain` | Learning lineage | JSON array of previous mentors |

**Philosophy**: Each hoodie carries stories and relationships, not just achievements

#### **`hoodie_trades` (Exchange History)**
**Purpose**: Records all transfers with reasoning and impact tracking
**Why**: Maintains relationship economics and community decision-making transparency

| Column | Purpose | Relational Economics |
|--------|---------|---------------------|
| `trade_narrative` | Story behind trade | Why this exchange benefits community |
| `vision_alignment_score` | Mission fit | How well trade aligns with AIME vision |
| `community_validation_score` | Peer approval | Community assessment of trade value |
| `impact_prediction` | Expected outcomes | JSON forecast of trade benefits |
| `actual_impact_generated` | Measured results | Real-world outcomes tracking |
| `wisdom_dividends_percentage` | Ongoing connection | Continued relationship percentage |

**Trading Philosophy**: Exchanges based on relationship value and community benefit, not just individual gain

#### **`imagination_credits` (Currency System)**
**Purpose**: Community currency for trading and relationship building
**Why**: Enables exchange while maintaining focus on impact and relationships

| Column | Purpose | Credit Logic |
|--------|---------|-------------|
| `credits_balance` | Available credits | Current spending power |
| `impact_multiplier` | Earning boost | Multiplier based on contribution quality |
| `community_recognition_score` | Peer appreciation | Community-assessed value |
| `relationship_depth_points` | Connection quality | Deep relationship building rewards |
| `innovation_catalyst_count` | Change creation | Tracking transformational impact |

**Currency Philosophy**: Credits earned through community contribution, not individual achievement

---

### **🔍 Search & Analytics Tables**

#### **`content_fts` (Full-Text Search)**
**Purpose**: SQLite FTS5 virtual table for fast content search
**Why**: Enables semantic search across all content types with ranking

**Search Capabilities**:
- Full-text search across title, description, content
- Phrase matching and proximity queries
- Ranking by relevance
- Cross-content-type search

#### **User Tracking Tables**
- **`user_interactions`**: Click tracking, time spent, engagement patterns
- **`user_activity`**: Search history, recommendation interactions
- **`search_history`**: Query patterns and success rates

**Privacy**: User data anonymized, focused on platform improvement

---

## **Data Storage Patterns**

### **JSON Field Usage**
Many fields store JSON for flexibility:
- **`tags`, `themes`, `topics`**: Arrays of categorization terms
- **`metadata`**: Source-specific data preservation  
- **`unlock_criteria`**: Complex achievement requirements
- **`attachments`**: File metadata with URLs and properties

**Why JSON**: Allows schema evolution without database migrations

### **ID Prefixing Strategy**
All content IDs use type prefixes:
- `tool-{uuid}` - Tools from Airtable
- `video-{youtube-id}` - YouTube videos
- `newsletter-{campaign-id}` - Mailchimp campaigns
- `knowledge-{path-hash}` - GitHub documents
- `hoodie-{generated}` - Achievement records

**Benefits**: 
- Clear content type identification
- Prevents ID collisions across sources
- Enables type-specific processing

### **Sync Status Tracking**
The `sync_status` table tracks data source synchronization:
- Last sync timestamps
- Record counts and success rates  
- Error tracking and retry logic
- Performance monitoring

---

## **Performance Optimizations**

### **Indexing Strategy**
Strategic indexes for common query patterns:
- **Content**: Source, type, category, creation date
- **Search**: FTS indexes for text search
- **Hoodies**: Category, rarity, tradeability
- **Time-based**: All timestamps for chronological queries

### **Database Settings**
- **WAL Mode**: Better concurrency for read-heavy workload
- **Large Cache**: 1GB cache for frequently accessed data
- **Memory Mapping**: 256MB for faster access
- **Memory Temp Storage**: Faster temporary operations

### **Query Patterns**
- **Pagination**: LIMIT/OFFSET for large result sets
- **Filtering**: WHERE clauses with indexed columns
- **Aggregation**: GROUP BY for statistics and summaries
- **Joins**: LEFT JOINs to include optional related data

---

## **Cultural Sensitivity Implementation**

### **Indigenous Knowledge Protocols**
1. **Detection**: Automated flagging of Indigenous content
2. **Validation**: Community review process
3. **Access Control**: Sensitivity-level-based restrictions
4. **Attribution**: Maintaining source and cultural context

### **Validation Workflow**
```
Content Ingestion → Indigenous Detection → Community Review → Cultural Assessment → Approval/Restriction
```

### **Sensitivity Levels**
- **Public**: Generally accessible content
- **Restricted**: Requires cultural awareness
- **Sacred**: Community-only access with protocols

---

## **Business Logic Integration**

### **Content Aggregation Flow**
1. **Source APIs**: Airtable, YouTube, Mailchimp, GitHub
2. **Batch Processing**: Periodic sync operations  
3. **Content Normalization**: Unified content model
4. **Relationship Detection**: Cross-content connections
5. **Search Indexing**: FTS and semantic search preparation

### **Hoodie Economics Flow**
1. **Achievement Definition**: Skills and knowledge milestones
2. **Earning Criteria**: Community-validated requirements
3. **Trading Logic**: Relationship-based exchanges
4. **Impact Tracking**: Real-world outcome measurement
5. **Community Validation**: Peer review of trades

---

## **Data Relationships & Dependencies**

### **Content Hierarchy**
```
content (1) → tools (0..1)
content (1) → videos (0..1)  
content (1) → newsletters (0..1)
knowledge_documents (1) → knowledge_chunks (0..n)
knowledge_chunks (1) → knowledge_validations (0..n)
```

### **Hoodie Relationships**
```
hoodies (1) → hoodie_holders (0..n)
hoodies (1) → hoodie_trades (0..n)
hoodie_holders (1) → imagination_credits (0..1)
hoodie_trades (1) → hoodie_holders (2) [from/to]
```

### **Cross-System Connections**
```
hoodies → content (associated_content_id)
knowledge_documents → hoodies (hoodie_knowledge_requirements)
content → user_interactions (engagement tracking)
```

---

## **Current Database State Analysis**

### **Strengths**
✅ **Unified Content Model**: Single interface for diverse content types
✅ **Cultural Sensitivity**: Built-in Indigenous knowledge protocols  
✅ **Scalable Architecture**: JSON flexibility with relational integrity
✅ **Performance Optimized**: Strategic indexing and caching
✅ **Relationship Mapping**: Cross-content connections and knowledge graph
✅ **Gamification Integration**: Sophisticated achievement and trading system

### **Potential Improvements**
⚠️ **User Management**: No formal user/auth table structure
⚠️ **Content Versioning**: Limited version control beyond GitHub content
⚠️ **Analytics Aggregation**: Raw tracking data without summary tables
⚠️ **Backup Strategy**: No documented backup/recovery procedures
⚠️ **Data Validation**: Limited constraints beyond required fields

### **Testing Recommendations**
Based on this schema analysis, testing should focus on:
1. **Content Aggregation**: Multi-source sync integrity
2. **Search Performance**: FTS and semantic search quality
3. **Cultural Protocols**: Indigenous content handling accuracy
4. **Hoodie Economics**: Trading logic and community validation
5. **Data Relationships**: Cross-table consistency and referential integrity

---

## **Database Access Patterns & Methods**

### **API Layer Data Access**

#### **Search Operations** (`/api/search/`)
- **Query Pattern**: Uses SQLite FTS5 (Full-Text Search) for semantic content discovery
- **Tables Accessed**: `content` ↔ `content_fts` (JOIN operation)
- **When Used**: User search queries, content discovery, filtering by type
- **Why This Pattern**: Enables fast text search across all content types with relevance ranking
- **Performance**: Optimized with FTS indexes, supports pagination and type filtering

```sql
-- Primary search query pattern
SELECT c.id, c.title, c.description, c.content_type 
FROM content c
JOIN content_fts fts ON c.id = fts.id
WHERE content_fts MATCH ? 
ORDER BY rank LIMIT ? OFFSET ?
```

#### **Dashboard Analytics** (`/api/dashboard/`)
- **Query Pattern**: Comprehensive statistics across all tables
- **Tables Accessed**: `knowledge_documents`, `business_cases`, `tools`, `hoodies`, `content`, `knowledge_chunks`
- **When Used**: Real-time dashboard updates, system monitoring, content overview
- **Why This Pattern**: Provides holistic view of platform health and content distribution
- **Performance**: Multiple concurrent COUNT queries, simulated analytics for growth trends

```sql
-- Content overview pattern
SELECT COUNT(*) as count FROM knowledge_documents;
SELECT COUNT(*) as count FROM business_cases WHERE created_at >= ?;
```

#### **Content Management** (`/api/content/`)
- **Query Pattern**: CRUD operations with relationship tracking
- **Tables Accessed**: `content`, specialized tables (`tools`, `videos`, `newsletters`)
- **When Used**: Content creation, updates, retrieval, sync operations
- **Why This Pattern**: Maintains unified content model while preserving type-specific metadata

#### **Business Cases** (`/api/business-cases/`)
- **Query Pattern**: Specialized CRUD with relationship mapping
- **Tables Accessed**: `business_cases`, `content_relationships`, `business_cases_fts`
- **When Used**: Business case management, related content discovery
- **Why This Pattern**: Supports complex filtering, search, and relationship detection

```sql
-- Business case with relationships
SELECT * FROM business_cases WHERE industry = ? AND region = ?;
SELECT * FROM content_relationships WHERE source_type = 'business_case';
```

### **Service Layer Data Access**

#### **Unified Sync Service** (`unified-sync.ts`)
- **Access Pattern**: Batch operations across multiple external sources
- **Tables Modified**: `content`, `tools`, `videos`, `newsletters`, `sync_status`
- **When Used**: Scheduled sync operations, data pipeline processing
- **Why This Pattern**: Coordinates multi-source data aggregation with conflict resolution

#### **Relationship Detection** (`relationship-detector.ts`)
- **Access Pattern**: Graph analysis and connection creation
- **Tables Accessed**: All content tables for semantic analysis
- **Tables Modified**: `content_relationships`, knowledge graph structures
- **When Used**: Post-content-creation analysis, knowledge graph updates
- **Why This Pattern**: Builds intelligent connections between content types

### **Database Connection Patterns**

#### **Primary Connection** (`connection.ts`)
- **Connection Type**: SQLite with WAL mode and performance optimization
- **Usage Pattern**: Singleton pattern with connection pooling
- **When Established**: Application startup, API request handling
- **Performance Settings**: 1GB cache, memory temp storage, 256MB mmap

```typescript
// Connection optimization pattern
await db.exec('PRAGMA journal_mode = WAL');
await db.exec('PRAGMA cache_size = 1000000');
await db.exec('PRAGMA temp_store = MEMORY');
```

#### **Supabase Integration** (`supabase.ts`)
- **Connection Type**: PostgreSQL via Supabase client
- **Usage Pattern**: Repository pattern with real-time features
- **When Used**: Advanced querying, real-time updates, cloud scaling
- **Why Dual Database**: SQLite for performance, Supabase for features

#### **Redis Caching** (`redis.ts`)
- **Access Pattern**: Key-value caching for frequently accessed data
- **When Used**: Search result caching, session data, performance optimization
- **Cache Strategy**: Write-through caching with TTL-based expiration

### **Data Storage Timing & Logic**

#### **Content Ingestion Flow**
1. **External API Fetch**: Airtable, YouTube, Mailchimp, GitHub APIs
2. **Content Normalization**: Transform to unified content model
3. **Primary Storage**: Insert into `content` table with type-specific tables
4. **Search Indexing**: Update `content_fts` for text search
5. **Relationship Analysis**: Detect and store cross-content connections
6. **Cache Updates**: Refresh Redis cache for affected queries

#### **Knowledge Document Processing**
1. **GitHub Sync**: Pull markdown files from repository
2. **Cultural Validation**: Indigenous content detection and flagging
3. **Chunk Processing**: Break documents into searchable segments
4. **Semantic Analysis**: Extract concepts and generate embeddings
5. **Community Review**: Route to appropriate validation workflows
6. **Knowledge Graph Update**: Add nodes and relationships

#### **Hoodie Stock Exchange Updates**
1. **Achievement Definition**: Create hoodie with unlock criteria
2. **Holder Management**: Track ownership and trading history
3. **Impact Assessment**: Monitor real-world outcomes
4. **Community Validation**: Peer review of trades and achievements
5. **Credit System Updates**: Adjust imagination credits based on contributions

### **Query Optimization Patterns**

#### **Indexing Strategy**
- **Content Discovery**: Indexes on `content_type`, `source`, `created_at`
- **Search Performance**: FTS5 indexes for full-text search
- **Relationship Queries**: Composite indexes on relationship tables
- **Time-based Queries**: Indexes on all timestamp columns

#### **Query Patterns**
- **Pagination**: Consistent LIMIT/OFFSET pattern across APIs
- **Filtering**: WHERE clauses using indexed columns
- **Aggregation**: GROUP BY for statistics and dashboard metrics
- **Joins**: LEFT JOINs for optional related data inclusion

### **Data Consistency & Integrity**

#### **Transaction Patterns**
- **Content Creation**: Atomic transactions across content and type-specific tables
- **Sync Operations**: Batch transactions with rollback on failure
- **Relationship Updates**: Consistent graph state maintenance

#### **Validation Logic**
- **Cultural Sensitivity**: Indigenous content requires community validation
- **Business Rules**: Hoodie trading requires community approval
- **Data Quality**: Schema validation before storage

---

This comprehensive schema supports AIME's mission of Indigenous knowledge sharing, community building, and relationship-centered learning through a sophisticated yet culturally sensitive technical foundation.