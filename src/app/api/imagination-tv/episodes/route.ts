/**
 * IMAGI-NATION TV Episodes API
 * 
 * Complete episode management with database integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase, Episode } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/imagination-tv/episodes - Get episodes with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!) : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeSegments = searchParams.get('includeSegments') === 'true';
    const includeWisdom = searchParams.get('includeWisdom') === 'true';
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    console.log('📺 IMAGI-NATION TV episodes request:', {
      status, season, limit, offset, includeSegments, includeWisdom, includeAnalytics
    });

    const db = await getVideoDatabase();
    
    const { episodes, total } = await db.getEpisodes({
      status,
      season,
      limit,
      offset,
      includeSegments,
      includeWisdom
    });

    // Transform episodes for API response
    const transformedEpisodes = await Promise.all(episodes.map(async (episode) => {
      const transformed: any = {
        id: episode.id,
        episodeNumber: episode.episode_number,
        season: episode.season,
        title: episode.title,
        description: episode.description,
        
        // Video data
        videoUrl: episode.video_url,
        youtubeId: episode.youtube_id,
        vimeoId: episode.vimeo_id,
        duration: episode.duration_iso || formatDuration(episode.duration_seconds || 0),
        thumbnailUrl: episode.thumbnail_url,
        
        // Publishing info
        publishedAt: episode.published_at,
        updatedAt: episode.updated_at,
        status: episode.status,
        
        // Content
        contentType: episode.content_type,
        themes: episode.themes,
        programs: episode.programs,
        learningObjectives: episode.learning_objectives,
        ageGroups: episode.age_groups,
        culturalContexts: episode.cultural_contexts,
        
        // Engagement
        viewCount: episode.view_count,
        likeCount: episode.like_count,
        discussionCount: episode.discussion_count,
        reflectionCount: episode.reflection_count,
        
        // AI Processing
        hasTranscription: episode.has_transcription,
        transcriptionStatus: episode.transcription_status,
        transcriptionConfidence: episode.transcription_confidence,
        wisdomExtractsCount: episode.wisdom_extracts_count,
        keyTopics: episode.key_topics,
        
        // Access
        accessLevel: episode.access_level,
        culturalSensitivity: episode.cultural_sensitivity,
        
        // Optional includes
        segments: includeSegments ? (episode as any).segments : undefined,
        wisdomExtracts: includeWisdom ? (episode as any).wisdomExtracts : undefined
      };

      // Include analytics if requested
      if (includeAnalytics) {
        transformed.analytics = await getEpisodeAnalyticsData(episode.id);
      }

      return transformed;
    }));

    // Get summary stats
    const stats = await getEpisodesStats();

    return NextResponse.json({
      success: true,
      data: {
        episodes: transformedEpisodes,
        total,
        stats
      },
      meta: {
        offset,
        limit,
        hasMore: offset + limit < total,
        filters: {
          status,
          season,
          includeSegments,
          includeWisdom,
          includeAnalytics
        }
      }
    });

  } catch (error) {
    console.error('❌ IMAGI-NATION TV episodes API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch episodes'
    }, { status: 500 });
  }
}

/**
 * POST /api/imagination-tv/episodes - Create or update episode
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, episode, segments, wisdomExtracts } = body;

    console.log('📺 IMAGI-NATION TV episodes POST:', action);

    const db = await getVideoDatabase();

    switch (action) {
      case 'create':
        if (!episode) {
          return NextResponse.json({
            success: false,
            error: 'Episode data is required'
          }, { status: 400 });
        }

        // Create episode
        const episodeId = await db.createEpisode({
          episode_number: episode.episodeNumber,
          season: episode.season || 1,
          title: episode.title,
          description: episode.description,
          video_url: episode.videoUrl,
          youtube_id: episode.youtubeId,
          vimeo_id: episode.vimeoId,
          duration_seconds: episode.durationSeconds,
          duration_iso: episode.duration,
          thumbnail_url: episode.thumbnailUrl,
          published_at: episode.publishedAt || new Date().toISOString(),
          status: episode.status || 'draft',
          content_type: episode.contentType || 'educational',
          themes: episode.themes || [],
          programs: episode.programs || [],
          learning_objectives: episode.learningObjectives || [],
          age_groups: episode.ageGroups || [],
          cultural_contexts: episode.culturalContexts || [],
          access_level: episode.accessLevel || 'public',
          cultural_sensitivity: episode.culturalSensitivity || 'none'
        });

        // Create segments if provided
        if (segments && Array.isArray(segments)) {
          for (const segment of segments) {
            await db.createEpisodeSegment({
              episode_id: episodeId,
              start_time: segment.startTime,
              end_time: segment.endTime,
              segment_order: segment.segmentOrder,
              segment_type: segment.segmentType,
              title: segment.title,
              description: segment.description,
              discussion_prompts: segment.discussionPrompts || [],
              related_content: segment.relatedContent || [],
              wisdom_indicators: segment.wisdomIndicators || 0
            });
          }
        }

        // Create wisdom extracts if provided
        if (wisdomExtracts && Array.isArray(wisdomExtracts)) {
          for (const extract of wisdomExtracts) {
            await db.createWisdomExtract({
              episode_id: episodeId,
              extract_type: extract.extractType,
              content: extract.content,
              timestamp_start: extract.timestampStart,
              timestamp_end: extract.timestampEnd,
              speaker: extract.speaker,
              confidence: extract.confidence,
              themes: extract.themes || [],
              cultural_context: extract.culturalContext || 'general',
              applications: extract.applications || [],
              related_concepts: extract.relatedConcepts || [],
              reviewed: extract.reviewed || false,
              approved: extract.approved || false
            });
          }
        }

        // Queue processing jobs
        await queueEpisodeProcessing(episodeId, episode);

        return NextResponse.json({
          success: true,
          data: {
            episodeId,
            message: 'Episode created successfully'
          }
        });

      case 'update':
        if (!episode.id) {
          return NextResponse.json({
            success: false,
            error: 'Episode ID is required for update'
          }, { status: 400 });
        }

        await db.updateEpisode(episode.id, {
          title: episode.title,
          description: episode.description,
          video_url: episode.videoUrl,
          youtube_id: episode.youtubeId,
          vimeo_id: episode.vimeoId,
          duration_seconds: episode.durationSeconds,
          duration_iso: episode.duration,
          thumbnail_url: episode.thumbnailUrl,
          status: episode.status,
          themes: episode.themes,
          programs: episode.programs,
          learning_objectives: episode.learningObjectives,
          age_groups: episode.ageGroups,
          cultural_contexts: episode.culturalContexts,
          access_level: episode.accessLevel,
          cultural_sensitivity: episode.culturalSensitivity
        });

        return NextResponse.json({
          success: true,
          data: {
            episodeId: episode.id,
            message: 'Episode updated successfully'
          }
        });

      case 'batch-import':
        if (!Array.isArray(body.episodes)) {
          return NextResponse.json({
            success: false,
            error: 'Episodes array is required'
          }, { status: 400 });
        }

        const results = [];
        
        for (const ep of body.episodes) {
          try {
            const id = await db.createEpisode({
              episode_number: ep.episodeNumber,
              season: ep.season || 1,
              title: ep.title,
              description: ep.description,
              video_url: ep.videoUrl,
              youtube_id: ep.youtubeId,
              duration_iso: ep.duration,
              thumbnail_url: ep.thumbnailUrl,
              published_at: ep.publishedAt,
              status: ep.status || 'published',
              themes: ep.themes || [],
              programs: ep.programs || [],
              learning_objectives: ep.learningObjectives || []
            });

            results.push({ episodeId: id, success: true });
            
            // Queue processing
            await queueEpisodeProcessing(id, ep);
            
          } catch (error) {
            results.push({ 
              title: ep.title, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        return NextResponse.json({
          success: true,
          data: {
            totalProcessed: body.episodes.length,
            successful,
            failed,
            results
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ IMAGI-NATION TV episodes POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process episode request'
    }, { status: 500 });
  }
}

/**
 * Helper functions
 */
async function getEpisodeAnalyticsData(episodeId: string): Promise<any> {
  // This would fetch recent analytics data
  // For now, return mock data
  return {
    totalViews: Math.floor(Math.random() * 50000) + 10000,
    uniqueViewers: Math.floor(Math.random() * 30000) + 5000,
    averageWatchTime: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
    completionRate: 0.6 + Math.random() * 0.3, // 60-90%
    likes: Math.floor(Math.random() * 2000) + 500,
    shares: Math.floor(Math.random() * 500) + 100,
    comments: Math.floor(Math.random() * 300) + 50,
    discussionsStarted: Math.floor(Math.random() * 100) + 20,
    reflectionsSubmitted: Math.floor(Math.random() * 150) + 30,
    wisdomExtractsViewed: Math.floor(Math.random() * 1000) + 200,
    wisdomExtractsShared: Math.floor(Math.random() * 200) + 50,
    knowledgeConnectionsFollowed: Math.floor(Math.random() * 100) + 25,
    lastUpdated: new Date().toISOString()
  };
}

async function getEpisodesStats(): Promise<any> {
  const db = await getVideoDatabase();
  
  // Get overall statistics
  const publishedEpisodes = await db.getEpisodes({ status: 'published', limit: 1000 });
  const draftEpisodes = await db.getEpisodes({ status: 'draft', limit: 1000 });
  
  const totalViews = publishedEpisodes.episodes.reduce((sum, ep) => sum + ep.view_count, 0);
  const totalDiscussions = publishedEpisodes.episodes.reduce((sum, ep) => sum + ep.discussion_count, 0);
  const totalWisdomExtracts = publishedEpisodes.episodes.reduce((sum, ep) => sum + ep.wisdom_extracts_count, 0);
  
  return {
    totalEpisodes: publishedEpisodes.total,
    draftEpisodes: draftEpisodes.total,
    totalViews,
    totalDiscussions,
    totalWisdomExtracts,
    averageWisdomPerEpisode: publishedEpisodes.total > 0 ? Math.round(totalWisdomExtracts / publishedEpisodes.total) : 0,
    episodesWithTranscription: publishedEpisodes.episodes.filter(ep => ep.has_transcription).length,
    transcriptionRate: publishedEpisodes.total > 0 ? 
      Math.round((publishedEpisodes.episodes.filter(ep => ep.has_transcription).length / publishedEpisodes.total) * 100) : 0
  };
}

async function queueEpisodeProcessing(episodeId: string, episode: any): Promise<void> {
  const db = await getVideoDatabase();
  
  // Queue transcription if video URL exists
  if (episode.videoUrl || episode.youtubeId) {
    await db.createProcessingJob({
      episode_id: episodeId,
      job_type: 'transcription',
      priority: 'high',
      provider: 'openai',
      input_data: {
        videoUrl: episode.videoUrl,
        youtubeId: episode.youtubeId,
        duration: episode.duration
      }
    });
  }
  
  // Queue wisdom extraction (will run after transcription)
  await db.createProcessingJob({
    episode_id: episodeId,
    job_type: 'wisdom-extraction',
    priority: 'medium',
    provider: 'internal',
    input_data: {
      themes: episode.themes || [],
      culturalContext: episode.culturalSensitivity || 'none'
    }
  });
  
  // Queue knowledge connections
  await db.createProcessingJob({
    episode_id: episodeId,
    job_type: 'knowledge-connection',
    priority: 'low',
    provider: 'internal',
    input_data: {
      themes: episode.themes || [],
      programs: episode.programs || []
    }
  });
  
  console.log(`⚙️ Queued processing jobs for episode: ${episodeId}`);
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `PT${hours}H${minutes}M${secs}S`;
  } else if (minutes > 0) {
    return `PT${minutes}M${secs}S`;
  } else {
    return `PT${secs}S`;
  }
}