/**
 * IMAGI-NATION TV Single Episode API
 * 
 * Detailed episode management with segments, wisdom, and analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/imagination-tv/episodes/[id] - Get single episode with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSegments = searchParams.get('includeSegments') !== 'false'; // Default true
    const includeWisdom = searchParams.get('includeWisdom') !== 'false'; // Default true
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';
    const includeTranscription = searchParams.get('includeTranscription') === 'true';

    console.log(`📺 Getting episode: ${params.id}`);

    const db = await getVideoDatabase();
    const episode = await db.getEpisode(params.id);

    if (!episode) {
      return NextResponse.json({
        success: false,
        error: 'Episode not found'
      }, { status: 404 });
    }

    // Build detailed episode response
    const detailedEpisode: any = {
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
      durationSeconds: episode.duration_seconds,
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
      culturalSensitivity: episode.cultural_sensitivity
    };

    // Include segments if requested
    if (includeSegments) {
      const segments = await db.getEpisodeSegments(episode.id);
      detailedEpisode.segments = segments.map(segment => ({
        id: segment.id,
        startTime: segment.start_time,
        endTime: segment.end_time,
        segmentOrder: segment.segment_order,
        segmentType: segment.segment_type,
        title: segment.title,
        description: segment.description,
        discussionPrompts: segment.discussion_prompts,
        relatedContent: segment.related_content,
        wisdomIndicators: segment.wisdom_indicators
      }));
    }

    // Include wisdom extracts if requested
    if (includeWisdom) {
      const wisdomExtracts = await db.getEpisodeWisdom(episode.id, true); // Only approved
      detailedEpisode.wisdomExtracts = wisdomExtracts.map(extract => ({
        id: extract.id,
        extractType: extract.extract_type,
        content: extract.content,
        timestampStart: extract.timestamp_start,
        timestampEnd: extract.timestamp_end,
        speaker: extract.speaker,
        confidence: extract.confidence,
        themes: extract.themes,
        culturalContext: extract.cultural_context,
        applications: extract.applications,
        relatedConcepts: extract.related_concepts,
        approved: extract.approved
      }));
    }

    // Include analytics if requested
    if (includeAnalytics) {
      detailedEpisode.analytics = await getDetailedAnalytics(episode.id);
    }

    // Include transcription if requested
    if (includeTranscription && episode.has_transcription) {
      detailedEpisode.transcription = {
        text: episode.transcription_text,
        confidence: episode.transcription_confidence,
        status: episode.transcription_status
      };
    }

    // Get related content suggestions
    const relatedEpisodes = await getRelatedEpisodes(episode.id, episode.themes, episode.programs);
    
    return NextResponse.json({
      success: true,
      data: {
        episode: detailedEpisode,
        relatedEpisodes,
        nextEpisode: await getNextEpisode(episode.season, episode.episode_number),
        previousEpisode: await getPreviousEpisode(episode.season, episode.episode_number)
      }
    });

  } catch (error) {
    console.error(`❌ Episode ${params.id} API error:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch episode'
    }, { status: 500 });
  }
}

/**
 * PUT /api/imagination-tv/episodes/[id] - Update episode
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log(`📺 Updating episode: ${params.id}`);

    const db = await getVideoDatabase();
    
    // Check if episode exists
    const existing = await db.getEpisode(params.id);
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Episode not found'
      }, { status: 404 });
    }

    // Update episode
    await db.updateEpisode(params.id, {
      title: body.title,
      description: body.description,
      video_url: body.videoUrl,
      youtube_id: body.youtubeId,
      vimeo_id: body.vimeoId,
      duration_seconds: body.durationSeconds,
      duration_iso: body.duration,
      thumbnail_url: body.thumbnailUrl,
      status: body.status,
      themes: body.themes,
      programs: body.programs,
      learning_objectives: body.learningObjectives,
      age_groups: body.ageGroups,
      cultural_contexts: body.culturalContexts,
      access_level: body.accessLevel,
      cultural_sensitivity: body.culturalSensitivity
    });

    // Update engagement metrics if provided
    if (body.analytics) {
      await db.updateEpisodeAnalytics(params.id, {
        total_views: body.analytics.totalViews,
        unique_viewers: body.analytics.uniqueViewers,
        average_watch_time: body.analytics.averageWatchTime,
        completion_rate: body.analytics.completionRate,
        likes: body.analytics.likes,
        shares: body.analytics.shares,
        comments: body.analytics.comments,
        discussions_started: body.analytics.discussionsStarted,
        reflections_submitted: body.analytics.reflectionsSubmitted
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        episodeId: params.id,
        message: 'Episode updated successfully'
      }
    });

  } catch (error) {
    console.error(`❌ Episode ${params.id} update error:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update episode'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/imagination-tv/episodes/[id] - Delete episode (archive)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📺 Archiving episode: ${params.id}`);

    const db = await getVideoDatabase();
    
    // Check if episode exists
    const existing = await db.getEpisode(params.id);
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Episode not found'
      }, { status: 404 });
    }

    // Archive instead of deleting
    await db.updateEpisode(params.id, {
      status: 'archived'
    });

    return NextResponse.json({
      success: true,
      data: {
        episodeId: params.id,
        message: 'Episode archived successfully'
      }
    });

  } catch (error) {
    console.error(`❌ Episode ${params.id} delete error:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive episode'
    }, { status: 500 });
  }
}

/**
 * Helper functions
 */
async function getDetailedAnalytics(episodeId: string): Promise<any> {
  // This would fetch comprehensive analytics
  // For now, return enhanced mock data
  return {
    viewMetrics: {
      totalViews: Math.floor(Math.random() * 50000) + 10000,
      uniqueViewers: Math.floor(Math.random() * 30000) + 5000,
      averageWatchTime: Math.floor(Math.random() * 600) + 300,
      completionRate: 0.6 + Math.random() * 0.3,
      viewsByRegion: {
        'North America': Math.floor(Math.random() * 15000) + 5000,
        'Australia/Oceania': Math.floor(Math.random() * 10000) + 3000,
        'Europe': Math.floor(Math.random() * 8000) + 2000,
        'Asia': Math.floor(Math.random() * 6000) + 1500,
        'Other': Math.floor(Math.random() * 3000) + 500
      }
    },
    engagementMetrics: {
      likes: Math.floor(Math.random() * 2000) + 500,
      shares: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 300) + 50,
      discussionsStarted: Math.floor(Math.random() * 100) + 20,
      reflectionsSubmitted: Math.floor(Math.random() * 150) + 30,
      wisdomExtractsViewed: Math.floor(Math.random() * 1000) + 200,
      wisdomExtractsShared: Math.floor(Math.random() * 200) + 50,
      knowledgeConnectionsFollowed: Math.floor(Math.random() * 100) + 25
    },
    watchPatterns: {
      mostReplayedSegments: [
        { startTime: 120, endTime: 180, title: 'Seven Generation Thinking', replayCount: 45 },
        { startTime: 480, endTime: 540, title: 'Indigenous Wisdom Sharing', replayCount: 32 },
        { startTime: 720, endTime: 780, title: 'Systems Change Principles', replayCount: 28 }
      ],
      commonDropOffPoints: [
        { timestamp: 300, percentage: 15 },
        { timestamp: 900, percentage: 25 },
        { timestamp: 1200, percentage: 35 }
      ],
      averageSessionLength: Math.floor(Math.random() * 400) + 200
    },
    wisdomEngagement: {
      extractsPerView: 2.3 + Math.random() * 1.5,
      mostSharedExtracts: [
        { extractId: 'wisdom-1', shares: 45, type: 'indigenous-wisdom' },
        { extractId: 'wisdom-2', shares: 32, type: 'systems-thinking' },
        { extractId: 'wisdom-3', shares: 28, type: 'mentoring-insight' }
      ],
      culturalContextEngagement: {
        'indigenous': 0.8 + Math.random() * 0.15,
        'global': 0.6 + Math.random() * 0.2,
        'general': 0.4 + Math.random() * 0.3
      }
    },
    lastUpdated: new Date().toISOString()
  };
}

async function getRelatedEpisodes(episodeId: string, themes: string[], programs: string[]): Promise<any[]> {
  const db = await getVideoDatabase();
  
  // This would use more sophisticated matching
  // For now, return mock related episodes
  const { episodes } = await db.getEpisodes({ 
    status: 'published', 
    limit: 6 
  });
  
  return episodes
    .filter(ep => ep.id !== episodeId)
    .slice(0, 3)
    .map(ep => ({
      id: ep.id,
      episodeNumber: ep.episode_number,
      season: ep.season,
      title: ep.title,
      description: ep.description.substring(0, 150) + '...',
      thumbnailUrl: ep.thumbnail_url,
      duration: ep.duration_iso,
      themes: ep.themes,
      viewCount: ep.view_count,
      wisdomExtractsCount: ep.wisdom_extracts_count,
      matchingThemes: themes.filter(theme => ep.themes.includes(theme)),
      matchingPrograms: programs.filter(program => ep.programs.includes(program))
    }));
}

async function getNextEpisode(season: number, episodeNumber: number): Promise<any | null> {
  const db = await getVideoDatabase();
  
  // Try next episode in same season
  const { episodes } = await db.getEpisodes({ 
    status: 'published', 
    season,
    limit: 100
  });
  
  const nextInSeason = episodes.find(ep => ep.episode_number === episodeNumber + 1);
  if (nextInSeason) {
    return {
      id: nextInSeason.id,
      episodeNumber: nextInSeason.episode_number,
      season: nextInSeason.season,
      title: nextInSeason.title,
      thumbnailUrl: nextInSeason.thumbnail_url
    };
  }
  
  // Try first episode of next season
  const { episodes: nextSeason } = await db.getEpisodes({ 
    status: 'published', 
    season: season + 1,
    limit: 1
  });
  
  if (nextSeason.length > 0) {
    const firstOfNext = nextSeason[0];
    return {
      id: firstOfNext.id,
      episodeNumber: firstOfNext.episode_number,
      season: firstOfNext.season,
      title: firstOfNext.title,
      thumbnailUrl: firstOfNext.thumbnail_url
    };
  }
  
  return null;
}

async function getPreviousEpisode(season: number, episodeNumber: number): Promise<any | null> {
  const db = await getVideoDatabase();
  
  // Try previous episode in same season
  if (episodeNumber > 1) {
    const { episodes } = await db.getEpisodes({ 
      status: 'published', 
      season,
      limit: 100
    });
    
    const prevInSeason = episodes.find(ep => ep.episode_number === episodeNumber - 1);
    if (prevInSeason) {
      return {
        id: prevInSeason.id,
        episodeNumber: prevInSeason.episode_number,
        season: prevInSeason.season,
        title: prevInSeason.title,
        thumbnailUrl: prevInSeason.thumbnail_url
      };
    }
  }
  
  // Try last episode of previous season
  if (season > 1) {
    const { episodes: prevSeason } = await db.getEpisodes({ 
      status: 'published', 
      season: season - 1,
      limit: 100
    });
    
    if (prevSeason.length > 0) {
      const lastOfPrev = prevSeason.sort((a, b) => b.episode_number - a.episode_number)[0];
      return {
        id: lastOfPrev.id,
        episodeNumber: lastOfPrev.episode_number,
        season: lastOfPrev.season,
        title: lastOfPrev.title,
        thumbnailUrl: lastOfPrev.thumbnail_url
      };
    }
  }
  
  return null;
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