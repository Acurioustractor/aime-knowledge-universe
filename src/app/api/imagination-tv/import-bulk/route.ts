/**
 * Bulk Video Import System
 * 
 * Imports all 423 videos from @aimementoring YouTube channel
 * with deduplication and progress tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for bulk operations

/**
 * POST /api/imagination-tv/import-bulk - Bulk import all YouTube videos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, channelId = 'UCyour-channel-id', batchSize = 50, startAt = 0 } = body;

    if (adminKey !== 'aime-import-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('🚀 Starting bulk YouTube import...');
    console.log(`📊 Batch size: ${batchSize}, Starting at: ${startAt}`);
    const startTime = Date.now();

    const db = await getVideoDatabase();
    const results = {
      imported: 0,
      processed: 0,
      skipped: 0,
      duplicates: 0,
      errors: [] as string[],
      batches: [] as any[]
    };

    // Get total count first to plan batches
    console.log('🔍 Getting total video count...');
    const countResponse = await fetch(`http://localhost:3001/api/youtube?channelId=${channelId}&count=true`);
    const countData = await countResponse.json();
    const totalVideos = countData.totalCount || 423;
    
    console.log(`📺 Found ${totalVideos} total videos in channel`);

    // Calculate batches needed
    const totalBatches = Math.ceil((totalVideos - startAt) / batchSize);
    console.log(`📦 Will process ${totalBatches} batches of ${batchSize} videos each`);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const currentStart = startAt + (batchIndex * batchSize);
      const batchStartTime = Date.now();
      
      console.log(`\n📦 Processing batch ${batchIndex + 1}/${totalBatches} (videos ${currentStart}-${currentStart + batchSize - 1})`);

      try {
        // Fetch batch of videos
        const apiUrl = `http://localhost:3001/api/youtube?channelId=${channelId}&limit=${batchSize}&offset=${currentStart}`;
        console.log(`🔍 Fetching: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || !data.videos) {
          throw new Error(`Batch ${batchIndex + 1} failed: ${data.error || 'No videos returned'}`);
        }

        const batchResults = {
          batchIndex: batchIndex + 1,
          videosInBatch: data.videos.length,
          imported: 0,
          skipped: 0,
          duplicates: 0,
          errors: [] as string[]
        };

        console.log(`📺 Processing ${data.videos.length} videos in batch ${batchIndex + 1}`);

        // Process each video in the batch
        for (const video of data.videos) {
          try {
            // Check for duplicates
            const existing = await db.getEpisodeByYouTubeId(video.id);
            if (existing) {
              console.log(`⏭️  Video ${video.title} already exists, skipping...`);
              batchResults.duplicates++;
              results.duplicates++;
              continue;
            }

            // Import video
            const episodeId = await importBulkVideoToDatabase(db, video, batchIndex);
            batchResults.imported++;
            results.imported++;
            
            console.log(`✅ Imported: ${video.title}`);

          } catch (error) {
            const errorMsg = `Failed to import ${video.title}: ${error}`;
            console.error('❌', errorMsg);
            batchResults.errors.push(errorMsg);
            results.errors.push(errorMsg);
          }

          results.processed++;
        }

        const batchDuration = Date.now() - batchStartTime;
        batchResults.duration = `${batchDuration}ms`;
        results.batches.push(batchResults);

        console.log(`✅ Batch ${batchIndex + 1} complete: ${batchResults.imported} imported, ${batchResults.duplicates} duplicates, ${batchResults.errors.length} errors (${batchDuration}ms)`);

        // Brief pause between batches to avoid rate limiting
        if (batchIndex < totalBatches - 1) {
          console.log('⏸️  Pausing 2 seconds between batches...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        const errorMsg = `Batch ${batchIndex + 1} failed: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        
        // Continue with next batch despite this batch failing
        results.batches.push({
          batchIndex: batchIndex + 1,
          error: errorMsg,
          duration: `${Date.now() - batchStartTime}ms`
        });
      }
    }

    const totalDuration = Date.now() - startTime;

    // Final summary
    console.log('\n🎉 BULK IMPORT COMPLETE!');
    console.log(`📊 Total: ${results.imported} imported, ${results.duplicates} duplicates, ${results.errors.length} errors`);
    console.log(`⏱️  Duration: ${totalDuration}ms (${Math.round(totalDuration / 1000)} seconds)`);

    return NextResponse.json({
      success: true,
      data: {
        action: 'bulk-import',
        totalDuration: `${totalDuration}ms`,
        totalVideos,
        batchSize,
        startAt,
        batchesProcessed: results.batches.length,
        results,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Bulk import error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bulk import failed'
    }, { status: 500 });
  }
}

/**
 * Import video into database with bulk-optimized settings
 */
async function importBulkVideoToDatabase(db: any, video: any, batchIndex: number): Promise<string> {
  // Generate episode ID
  const episodeId = `aime-bulk-${video.id}`;
  
  // Parse duration
  const durationSeconds = parseYouTubeDuration(video.duration);
  
  // Quick classification for bulk import
  const { contentType, themes, programs } = quickClassifyVideo(video);
  
  // Use batch-based season for organization
  const season = Math.floor(batchIndex / 10) + 3; // Season 3+ for bulk imports
  
  // Generate simple learning objectives
  const learningObjectives = generateQuickLearningObjectives(video, themes);
  
  // Create episode with optimized data
  await db.createEpisode({
    id: episodeId,
    episode_number: Math.floor(Math.random() * 10000) + 1000, // High numbers for bulk imports
    season,
    title: video.title,
    description: video.description || `YouTube video: ${video.title}`,
    video_url: video.url,
    youtube_id: video.id,
    duration_seconds: durationSeconds,
    duration_iso: video.duration,
    thumbnail_url: video.thumbnail,
    published_at: video.publishedAt,
    status: 'published',
    content_type: contentType,
    themes,
    programs,
    learning_objectives: learningObjectives,
    age_groups: determineQuickAgeGroups(video),
    cultural_contexts: ['Global'], // Default for bulk import
    access_level: 'public',
    cultural_sensitivity: 'none', // Default for bulk import
    has_transcription: video.hasTranscription || false,
    transcription_status: 'pending',
    wisdom_extracts_count: 0,
    key_topics: video.tags || [],
    view_count: Math.floor((video.viewCount || 0) * 0.1),
    like_count: video.likeCount || 0,
    discussion_count: 0,
    reflection_count: 0
  });

  return episodeId;
}

/**
 * Quick video classification for bulk processing
 */
function quickClassifyVideo(video: any): {
  contentType: string;
  themes: string[];
  programs: string[];
} {
  const text = [video.title, video.description].join(' ').toLowerCase();
  
  // Quick content type classification
  let contentType = 'educational';
  if (text.includes('interview')) contentType = 'interview';
  if (text.includes('workshop')) contentType = 'workshop';
  if (text.includes('event')) contentType = 'event';
  
  // Quick theme extraction (fewer themes for performance)
  const themes: string[] = [];
  if (text.includes('imagination')) themes.push('imagination');
  if (text.includes('mentor')) themes.push('mentoring');
  if (text.includes('indigenous')) themes.push('indigenous-wisdom');
  if (text.includes('youth') || text.includes('student')) themes.push('youth-leadership');
  if (text.includes('education')) themes.push('education');
  
  // Program identification
  const programs: string[] = [];
  if (text.includes('imagi-nation tv')) programs.push('imagination-tv');
  if (text.includes('hoodie economics')) programs.push('hoodie-economics');
  if (text.includes('custodians')) programs.push('custodians');
  
  return { contentType, themes, programs };
}

/**
 * Parse YouTube duration format efficiently
 */
function parseYouTubeDuration(duration: string): number {
  if (!duration) return 0;
  
  const match = duration.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Generate quick learning objectives
 */
function generateQuickLearningObjectives(video: any, themes: string[]): string[] {
  const objectives: string[] = [];
  
  if (themes.includes('imagination')) {
    objectives.push('Explore creative approaches to problem-solving');
  }
  if (themes.includes('mentoring')) {
    objectives.push('Understand mentoring relationships and impact');
  }
  if (themes.includes('education')) {
    objectives.push('Learn about innovative educational approaches');
  }
  
  // Default objective
  if (objectives.length === 0) {
    objectives.push('Gain insights from AIME\'s educational content');
  }
  
  return objectives;
}

/**
 * Determine age groups quickly
 */
function determineQuickAgeGroups(video: any): string[] {
  const text = [video.title, video.description].join(' ').toLowerCase();
  
  if (text.includes('high school') || text.includes('teen')) {
    return ['13-17'];
  }
  if (text.includes('university') || text.includes('college')) {
    return ['18-25'];
  }
  
  return ['13+']; // Default broad audience
}