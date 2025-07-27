/**
 * Real Video Import from Working APIs
 * 
 * Uses the existing working YouTube API to import real AIME videos
 * into the IMAGI-NATION TV database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/import-real - Import from working YouTube API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, maxVideos = 20, importAll = false, channelId = null, directImport = false, videoData = null } = body;

    if (adminKey !== 'aime-import-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('📹 Starting real YouTube video import...');
    const startTime = Date.now();

    const db = await getVideoDatabase();
    const results = {
      imported: 0,
      processed: 0,
      errors: [] as string[]
    };

    // Handle direct video import
    if (directImport && videoData) {
      console.log(`📺 Direct import: ${videoData.title}`);
      
      try {
        // Check if video already exists
        const existing = await db.getEpisodeByYouTubeId(videoData.id);
        if (existing) {
          console.log(`⏭️  Video ${videoData.title} already exists, skipping...`);
          return NextResponse.json({
            success: true,
            data: {
              action: 'import-real',
              duration: `${Date.now() - startTime}ms`,
              results: { imported: 0, processed: 1, errors: ['Video already exists'] },
              videosFound: 1,
              timestamp: new Date().toISOString()
            }
          });
        }

        // Import the video directly
        const episodeId = await importVideoToDatabase(db, videoData);
        results.imported = 1;
        results.processed = 1;
        
        console.log(`✅ Directly imported: ${videoData.title}`);

      } catch (error) {
        const errorMsg = `Failed to import ${videoData.title}: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        results.processed = 1;
      }

      const duration = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        data: {
          action: 'import-real-direct',
          duration: `${duration}ms`,
          results,
          videosFound: 1,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Build API URL based on import type
    let apiUrl;
    if (channelId) {
      // Import from specific channel (for @aimementoring)
      apiUrl = `http://localhost:3001/api/youtube?channelId=${channelId}&limit=${importAll ? 500 : maxVideos}`;
    } else {
      // Default search-based import
      apiUrl = `http://localhost:3001/api/youtube?q=AIME&limit=${maxVideos}`;
    }

    console.log(`🔍 Fetching from: ${apiUrl}`);
    
    // Fetch videos from the working YouTube API
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.success || !data.videos) {
      throw new Error('Failed to fetch videos from YouTube API');
    }

    console.log(`📺 Processing ${data.videos.length} videos from YouTube API...`);

    for (const video of data.videos) {
      try {
        // Check if video already exists
        const existing = await db.getEpisodeByYouTubeId(video.id);
        if (existing) {
          console.log(`⏭️  Video ${video.title} already exists, skipping...`);
          continue;
        }

        // Process and import video
        const episodeId = await importVideoToDatabase(db, video);
        results.imported++;
        results.processed++;
        
        console.log(`✅ Imported: ${video.title}`);

      } catch (error) {
        const errorMsg = `Failed to import ${video.title}: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        results.processed++;
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        action: 'import-real',
        duration: `${duration}ms`,
        results,
        videosFound: data.videos.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Real import error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Import failed'
    }, { status: 500 });
  }
}

/**
 * Import video into IMAGI-NATION TV database
 */
async function importVideoToDatabase(db: any, video: any): Promise<string> {
  // Generate episode ID
  const episodeId = `aime-youtube-${video.id}`;
  
  // Parse duration
  const durationSeconds = parseYouTubeDuration(video.duration);
  
  // Classify content and extract themes
  const { contentType, themes, programs } = classifyVideo(video);
  
  // Determine if this is IMAGI-NATION TV content
  const isImaginationTv = video.title.toLowerCase().includes('imagi-nation tv') || 
                         video.title.toLowerCase().includes('imagination tv');
  
  // Generate learning objectives
  const learningObjectives = generateLearningObjectives(video, themes);
  
  // Determine cultural sensitivity
  const culturalSensitivity = determineCulturalSensitivity(video);
  
  // Create episode
  await db.createEpisode({
    id: episodeId,
    episode_number: isImaginationTv ? extractEpisodeNumber(video.title) : Math.floor(Math.random() * 1000) + 100,
    season: isImaginationTv ? 1 : 2, // Use season 2 for general YouTube content
    title: video.title,
    description: video.description,
    video_url: video.url,
    youtube_id: video.id,
    duration_seconds: durationSeconds,
    duration_iso: video.duration,
    thumbnail_url: video.thumbnail,
    published_at: video.publishedAt,
    status: 'published', // From existing API, assume published
    content_type: contentType,
    themes,
    programs,
    learning_objectives: learningObjectives,
    age_groups: determineAgeGroups(video),
    cultural_contexts: determineCulturalContexts(video),
    access_level: 'public',
    cultural_sensitivity: culturalSensitivity,
    has_transcription: video.hasTranscription || false,
    transcription_status: 'pending',
    wisdom_extracts_count: 0,
    key_topics: video.tags || [],
    view_count: Math.floor((video.viewCount || 0) * 0.1), // Scale down for internal tracking
    like_count: video.likeCount || 0,
    discussion_count: 0,
    reflection_count: 0
  });

  // Queue processing jobs
  if (video.hasTranscription) {
    await db.createProcessingJob({
      episode_id: episodeId,
      job_type: 'transcription',
      priority: 'medium',
      provider: 'youtube-captions',
      input_data: {
        youtubeId: video.id,
        duration: video.duration
      }
    });
  }

  // Queue wisdom extraction for educational content
  if (themes.length > 0) {
    await db.createProcessingJob({
      episode_id: episodeId,
      job_type: 'wisdom-extraction',
      priority: 'medium',
      provider: 'internal',
      input_data: {
        themes,
        tags: video.tags || [],
        culturalContext: culturalSensitivity
      }
    });
  }

  return episodeId;
}

/**
 * Classify video content based on title, description, and tags
 */
function classifyVideo(video: any): {
  contentType: string;
  themes: string[];
  programs: string[];
} {
  const text = [video.title, video.description, ...(video.tags || [])].join(' ').toLowerCase();
  
  // Content type classification
  let contentType = 'educational'; // Default
  if (text.includes('interview') || text.includes('conversation')) contentType = 'interview';
  if (text.includes('workshop') || text.includes('training')) contentType = 'workshop';
  if (text.includes('documentary') || text.includes('story')) contentType = 'documentary';
  if (text.includes('inspiration') || text.includes('motivational')) contentType = 'inspirational';
  if (text.includes('event') || text.includes('conference')) contentType = 'event';
  
  // Theme extraction
  const themes: string[] = [];
  if (text.includes('imagination') || text.includes('creative')) themes.push('imagination');
  if (text.includes('mentor') || text.includes('mentoring')) themes.push('mentoring');
  if (text.includes('indigenous') || text.includes('traditional')) themes.push('indigenous-wisdom');
  if (text.includes('system') || text.includes('holistic')) themes.push('systems-thinking');
  if (text.includes('youth') || text.includes('young') || text.includes('student')) themes.push('youth-leadership');
  if (text.includes('education') || text.includes('learning') || text.includes('teaching')) themes.push('education');
  if (text.includes('community') || text.includes('collective')) themes.push('community');
  if (text.includes('innovation') || text.includes('change')) themes.push('innovation');
  if (text.includes('leadership') || text.includes('leader')) themes.push('youth-leadership');
  if (text.includes('economic') || text.includes('hoodie economics')) themes.push('economics');
  
  // Program identification
  const programs: string[] = [];
  if (text.includes('imagi-labs') || text.includes('imagi labs')) programs.push('imagi-labs');
  if (text.includes('mentoring program') || text.includes('mentor program')) programs.push('mentoring');
  if (text.includes('joy corps') || text.includes('joycorps')) programs.push('joy-corps');
  if (text.includes('custodians')) programs.push('custodians');
  if (text.includes('citizens')) programs.push('citizens');
  if (text.includes('presidents')) programs.push('presidents');
  if (text.includes('hoodie economics')) programs.push('hoodie-economics');
  if (text.includes('imagi-nation tv') || text.includes('imagination tv')) programs.push('imagination-tv');
  
  return { contentType, themes, programs };
}

/**
 * Parse YouTube duration format (PT4M13S) to seconds
 */
function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Extract episode number from title if present
 */
function extractEpisodeNumber(title: string): number {
  const match = title.match(/episode\s*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Generate learning objectives based on video content
 */
function generateLearningObjectives(video: any, themes: string[]): string[] {
  const objectives: string[] = [];
  
  if (themes.includes('imagination')) {
    objectives.push('Explore the role of imagination in creating positive change');
  }
  
  if (themes.includes('mentoring')) {
    objectives.push('Understand effective mentoring relationships and practices');
  }
  
  if (themes.includes('indigenous-wisdom')) {
    objectives.push('Learn from Indigenous knowledge systems and perspectives');
  }
  
  if (themes.includes('systems-thinking')) {
    objectives.push('Develop systems thinking approaches to complex challenges');
  }
  
  if (themes.includes('youth-leadership')) {
    objectives.push('Understand youth leadership development and empowerment');
  }
  
  if (themes.includes('education')) {
    objectives.push('Explore innovative approaches to education and learning');
  }
  
  // Default objective if none specific
  if (objectives.length === 0) {
    objectives.push('Gain insights into AIME\'s approach to education and social change');
  }
  
  return objectives;
}

/**
 * Determine age groups for content
 */
function determineAgeGroups(video: any): string[] {
  const text = [video.title, video.description].join(' ').toLowerCase();
  const ageGroups: string[] = [];
  
  if (text.includes('high school') || text.includes('teenager') || text.includes('teen')) {
    ageGroups.push('13-17');
  }
  
  if (text.includes('university') || text.includes('college') || text.includes('young adult')) {
    ageGroups.push('18-25');
  }
  
  if (text.includes('professional') || text.includes('adult') || text.includes('leader')) {
    ageGroups.push('26+');
  }
  
  // Default to broad audience
  if (ageGroups.length === 0) {
    ageGroups.push('13+');
  }
  
  return ageGroups;
}

/**
 * Determine cultural contexts
 */
function determineCulturalContexts(video: any): string[] {
  const text = [video.title, video.description].join(' ').toLowerCase();
  const contexts: string[] = [];
  
  if (text.includes('indigenous') || text.includes('aboriginal') || text.includes('traditional')) {
    contexts.push('Indigenous');
  }
  
  if (text.includes('australia') || text.includes('australian')) {
    contexts.push('Australian');
  }
  
  if (text.includes('global') || text.includes('international')) {
    contexts.push('Global');
  }
  
  // Default to Global
  if (contexts.length === 0) {
    contexts.push('Global');
  }
  
  return contexts;
}

/**
 * Determine cultural sensitivity level
 */
function determineCulturalSensitivity(video: any): 'none' | 'advisory' | 'permission-required' {
  const text = [video.title, video.description].join(' ').toLowerCase();
  
  if (text.includes('indigenous') || text.includes('traditional') || text.includes('cultural')) {
    return 'advisory';
  }
  
  return 'none';
}