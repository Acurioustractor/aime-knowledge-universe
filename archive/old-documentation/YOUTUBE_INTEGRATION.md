# YouTube Integration System - World Class Implementation

A comprehensive YouTube integration system for AIME that handles hundreds of videos with proper storage, syncing, transcription, and search capabilities.

## Overview

This system provides a complete solution for integrating YouTube content into the AIME knowledge center with the following capabilities:

- **Video Storage**: Persistent storage of hundreds of YouTube videos with metadata
- **Sync Management**: Automated syncing with different schedules (full, incremental, metadata)
- **Content Integration**: Seamless integration with the main content storage for unified search
- **Transcription System**: Preparation and handling of video transcriptions
- **Search & Discovery**: Advanced search across video content including transcriptions
- **Real-time Monitoring**: Comprehensive statistics and health monitoring

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AIME YouTube Integration                  │
├─────────────────────────────────────────────────────────────┤
│  Frontend Components                                        │
│  ├── YouTube Dashboard                                      │
│  ├── Video Browse/Search                                    │
│  └── Admin Management                                       │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                  │
│  ├── /api/youtube/integration    (Main management)         │
│  ├── /api/youtube/sync          (Sync operations)          │
│  ├── /api/youtube/videos        (Video access)             │
│  ├── /api/youtube/channels      (Channel management)       │
│  ├── /api/youtube/transcription (Transcription system)     │
│  └── /api/youtube/test          (Testing & validation)     │
├─────────────────────────────────────────────────────────────┤
│  Core Services                                             │
│  ├── YouTube API Client         (youtube-api.ts)          │
│  ├── Video Storage System       (youtube-storage.ts)      │
│  ├── Sync Manager              (youtube-sync-manager.ts)   │
│  ├── Content Integration       (youtube-content-int...)    │
│  └── Transcription Manager     (transcription-manager.ts) │
├─────────────────────────────────────────────────────────────┤
│  External Services                                         │
│  ├── YouTube API v3                                       │
│  ├── Transcription Services (Google/AWS/Azure)            │
│  └── Content Storage System                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### 🎥 Video Management
- Store and manage hundreds of YouTube videos
- Complete metadata extraction and indexing
- Automatic deduplication and version management
- Channel-based organization and filtering

### 🔄 Smart Syncing
- **Full Sync**: Complete channel synchronization (weekly)
- **Incremental Sync**: Recent videos only (every 6 hours)
- **Metadata Sync**: Update existing video stats (daily)
- Rate limiting and error handling with automatic retries

### 🔍 Advanced Search
- Full-text search across titles, descriptions, and tags
- Transcription-based search (when available)
- Keyword and topic extraction
- Search suggestions and related content

### 🎤 Transcription System
- Automatic transcription queueing for new videos
- Support for multiple providers (Google, AWS, Azure, OpenAI)
- Timestamp-based search within transcriptions
- Quality control and confidence scoring

### 📊 Analytics & Monitoring
- Real-time sync statistics and health monitoring
- Video engagement metrics (views, likes, comments)
- Transcription completion rates and quality metrics
- Channel performance analytics

## Setup & Configuration

### 1. Environment Variables

Add to your `.env.local` file:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 2. Initialize the System

```bash
# Test the system
curl -X POST http://localhost:3000/api/youtube/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "full-system"}'

# Initialize with real API
curl -X POST http://localhost:3000/api/youtube/integration \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'
```

### 3. Add YouTube Channels

```bash
curl -X POST http://localhost:3000/api/youtube/channels \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add",
    "channelData": {
      "channelId": "UC_AIME_CHANNEL_ID",
      "channelName": "AIME",
      "enabled": true,
      "syncPriority": "high"
    }
  }'
```

## API Reference

### Main Integration Endpoint

**POST /api/youtube/integration**

Actions:
- `initialize` - Initialize the complete system
- `full-sync` - Perform full synchronization
- `incremental-sync` - Perform incremental sync
- `start-integration` - Start content integration service
- `stop-integration` - Stop content integration service
- `setup-channels` - Add multiple channels at once
- `comprehensive-search` - Advanced search functionality

**GET /api/youtube/integration**

Actions:
- `status` - Get system status and health
- `health-check` - Comprehensive health check
- `dashboard-data` - Get dashboard statistics

### Video Management

**GET /api/youtube/videos**

Query parameters:
- `action`: list, search, stats, content-items
- `channelId`: Filter by channel
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)
- `sortBy`: published, views, likes, duration
- `sortOrder`: asc, desc
- `hasTranscription`: true/false
- `search`: Search query

**POST /api/youtube/videos**

Actions:
- `update-transcription` - Queue videos for transcription

### Sync Management

**POST /api/youtube/sync**

Query parameters:
- `type`: full, incremental, channel, transcription
- `channelId`: For channel-specific sync

**GET /api/youtube/sync**

Actions:
- `stats` - Get sync statistics
- `history` - Get sync history
- `status` - Get sync status

### Transcription System

**POST /api/youtube/transcription**

Actions:
- `queue` - Queue videos for transcription
- `search` - Search transcriptions

**GET /api/youtube/transcription**

Actions:
- `stats` - Transcription statistics
- `job` - Get specific job status
- `jobs` - Get all jobs
- `result` - Get transcription result
- `dashboard` - Dashboard data

## Usage Examples

### 1. Full System Initialization

```javascript
// Initialize the complete YouTube integration
const response = await fetch('/api/youtube/integration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'initialize' })
});

const result = await response.json();
console.log('System initialized:', result.success);
```

### 2. Search YouTube Videos

```javascript
// Search across all YouTube content
const searchResponse = await fetch('/api/youtube/videos?action=search&search=mentoring&limit=10');
const searchResults = await searchResponse.json();

console.log(`Found ${searchResults.data.total} videos`);
searchResults.data.videos.forEach(video => {
  console.log(`- ${video.title} (${video.viewCount} views)`);
});
```

### 3. Queue Videos for Transcription

```javascript
// Queue recent videos for transcription
const videoIds = ['video1', 'video2', 'video3'];
const transcriptionResponse = await fetch('/api/youtube/transcription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'queue',
    videoIds,
    options: { priority: 'high', provider: 'google' }
  })
});

const result = await transcriptionResponse.json();
console.log(`Queued ${result.data.queued} videos for transcription`);
```

### 4. Monitor System Health

```javascript
// Get comprehensive system status
const healthResponse = await fetch('/api/youtube/integration?action=health-check');
const health = await healthResponse.json();

console.log('System Health:', {
  overall: health.data.overall ? 'Healthy' : 'Issues Detected',
  apiConnection: health.data.components.apiConnection,
  integrationActive: health.data.components.integration
});
```

## Performance & Scalability

### Rate Limiting
- YouTube API: 1 second delay between calls
- Max concurrent sync jobs: 2
- Batch size: 50 videos per request

### Storage Optimization
- Deduplication of video entries
- Indexed search metadata
- Configurable retention policies
- Memory-efficient pagination

### Sync Strategies
- **Full Sync**: Weekly, processes all videos
- **Incremental Sync**: 6-hourly, processes recent videos only
- **Smart Retry**: Exponential backoff for failed requests
- **Priority Queuing**: High-priority channels sync first

## Monitoring & Analytics

### Key Metrics
- Total videos stored and synchronized
- Sync success/failure rates
- Transcription completion rates
- Search performance and usage
- API quota utilization

### Dashboard Data
Access comprehensive dashboard data:

```bash
curl -X GET "http://localhost:3000/api/youtube/integration?action=dashboard-data"
```

Returns:
- Video counts and growth
- Channel performance
- Sync job status
- Transcription statistics
- System health indicators

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify YOUTUBE_API_KEY in environment
   - Check API key permissions and quotas

2. **Sync Failures**
   - Check network connectivity
   - Verify channel IDs are correct
   - Review sync error logs

3. **Transcription Not Working**
   - Ensure videos have captions available
   - Check transcription provider configuration
   - Monitor transcription job queue

### Testing

Run comprehensive tests:

```bash
# Full system test
curl -X POST http://localhost:3000/api/youtube/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "full-system"}'

# Test specific components
curl -X POST http://localhost:3000/api/youtube/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "storage-system"}'
```

## Integration with AIME Content System

The YouTube integration seamlessly connects with the main AIME content system:

1. **Unified Search**: YouTube videos appear in main content search
2. **Content Suggestions**: Videos included in recommendation engine
3. **Browse Pages**: Videos accessible through content browse interface
4. **Tagging System**: YouTube content tagged with AIME-specific categories

## Future Enhancements

- **Real-time Webhooks**: Instant notifications for new videos
- **Advanced Analytics**: Machine learning-based content analysis
- **Live Streaming**: Support for live video content
- **Collaborative Features**: Comments and social engagement
- **Mobile Optimization**: Mobile-first video browsing experience

---

## Support

For technical support or questions about the YouTube integration system, please refer to:

- API documentation in the codebase
- Test endpoints for validation
- Health check endpoints for monitoring
- Error logs for troubleshooting

The system is designed to be robust, scalable, and maintainable, providing a world-class foundation for AIME's YouTube content management needs.