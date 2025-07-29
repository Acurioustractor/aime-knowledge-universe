/**
 * Airtable IMAGI-NATION TV Episodes Import
 * 
 * Specifically imports curated IMAGI-NATION TV episodes from Airtable
 * with deduplication against existing YouTube imports
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/import-airtable-episodes - Import IMAGI-NATION TV episodes from Airtable
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, tableId = null } = body;

    if (adminKey !== 'aime-import-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('📺 Starting Airtable IMAGI-NATION TV episodes import...');
    const startTime = Date.now();

    // Get Airtable API credentials from environment
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    // Use the DAM base as specified by user
    const airtableBaseId = process.env.AIRTABLE_BASE_ID_DAM;
    
    if (!airtableApiKey || !airtableBaseId) {
      throw new Error('Airtable credentials not configured');
    }

    // Get all tables in the DAM base to search for AIME TV episodes
    const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${airtableBaseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!tablesResponse.ok) {
      throw new Error(`Failed to fetch tables: ${tablesResponse.status} ${tablesResponse.statusText}`);
    }

    const tablesData = await tablesResponse.json();
    console.log(`📋 Found ${tablesData.tables.length} tables in DAM base:`);
    tablesData.tables.forEach((table: any, i: number) => {
      console.log(`   ${i + 1}. ${table.name} (${table.id})`);
    });

    let allEpisodesData: any[] = [];
    let processedTables: string[] = [];

    // Search all tables for records with Topic = "AIME TV"
    for (const table of tablesData.tables) {
      try {
        console.log(`🔍 Searching table: ${table.name} for Topic = "AIME TV"...`);
        
        // Use filter formula to specifically look for Topic = "AIME TV"
        const filterFormula = encodeURIComponent(`{Topic} = "AIME TV"`);
        const tableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${table.id}?filterByFormula=${filterFormula}`;
        
        const tableResponse = await fetch(tableUrl, {
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (tableResponse.ok) {
          const tableData = await tableResponse.json();
          const records = tableData.records || [];
          
          if (records.length > 0) {
            console.log(`✅ Found ${records.length} AIME TV episodes in table: ${table.name}`);
            allEpisodesData.push(...records);
            processedTables.push(table.name);
          } else {
            console.log(`   No AIME TV episodes in table: ${table.name}`);
          }
        } else {
          console.log(`   ⚠️ Could not search table: ${table.name} (${tableResponse.status})`);
        }
      } catch (error) {
        console.log(`   ❌ Error searching table ${table.name}:`, error);
      }
    }

    console.log(`📊 Total AIME TV episodes found across ${processedTables.length} tables: ${allEpisodesData.length}`);
    if (processedTables.length > 0) {
      console.log(`📋 Tables with AIME TV content: ${processedTables.join(', ')}`);
    }

    if (allEpisodesData.length === 0) {
      throw new Error(`No AIME TV episodes found with Topic = "AIME TV" in any table`);
    }

    // Use the filtered AIME TV episodes
    const filteredEpisodes = allEpisodesData;
    
    // Log first record to understand structure
    if (filteredEpisodes.length > 0) {
      console.log('🔍 Sample AIME TV record fields:', Object.keys(filteredEpisodes[0].fields));
      console.log('🔍 First AIME TV record data:', JSON.stringify(filteredEpisodes[0].fields, null, 2));
    }

    const db = await getVideoDatabase();
    const results = {
      imported: 0,
      processed: 0,
      skipped: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    console.log(`📺 Processing ${filteredEpisodes.length} episodes from Airtable tables: ${processedTables.join(', ')}...`);

    for (const record of filteredEpisodes) {
      try {
        const fields = record.fields;
        
        // Skip if missing essential data
        if (!fields.Title && !fields.Name && !fields.Episode) {
          console.log('⏭️  Skipping record without title');
          results.skipped++;
          continue;
        }

        const title = fields.Title || fields.Name || fields.Episode || 'Untitled Episode';
        
        // Check for duplicates by title
        const existingByTitle = await db.get(
          'SELECT id FROM imagination_tv_episodes WHERE title = ?',
          [title]
        );

        if (existingByTitle) {
          console.log(`⏭️  Episode "${title}" already exists, skipping...`);
          results.duplicates++;
          continue;
        }

        // Check for YouTube ID duplicates if present
        const youtubeId = extractYouTubeId(fields);
        if (youtubeId) {
          const existingByYouTube = await db.getEpisodeByYouTubeId(youtubeId);
          if (existingByYouTube) {
            console.log(`⏭️  Episode with YouTube ID ${youtubeId} already exists, skipping...`);
            results.duplicates++;
            continue;
          }
        }

        // Process and import episode
        const episodeId = await importEpisodeToDatabase(db, fields, record.id);
        results.imported++;
        results.processed++;
        
        console.log(`✅ Imported: ${title}`);

      } catch (error) {
        const errorMsg = `Failed to import episode: ${error}`;
        console.error('❌', errorMsg);
        results.errors.push(errorMsg);
        results.processed++;
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        action: 'import-airtable-episodes',
        tablesSearched: processedTables,
        duration: `${duration}ms`,
        results,
        episodesFound: filteredEpisodes.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Airtable episodes import error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Import failed'
    }, { status: 500 });
  }
}

/**
 * Extract YouTube ID from various possible field formats
 */
function extractYouTubeId(fields: any): string | null {
  // Common field names for YouTube links
  const possibleFields = [
    'YouTube URL',
    'YouTube Link', 
    'Video URL',
    'Video Link',
    'YouTube',
    'URL',
    'Link',
    'Video'
  ];

  for (const fieldName of possibleFields) {
    const value = fields[fieldName];
    if (typeof value === 'string' && value.includes('youtube.com')) {
      const match = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match) {
        return match[1];
      }
    }
  }

  return null;
}

/**
 * Import episode into IMAGI-NATION TV database
 */
async function importEpisodeToDatabase(db: any, fields: any, airtableId: string): Promise<string> {
  // Generate episode ID
  const episodeId = `aime-airtable-${airtableId}`;
  
  // Extract title
  const title = fields.Title || fields.Name || fields.Episode || 'Untitled Episode';
  
  // Extract description
  const description = fields.Description || fields.Summary || fields.Notes || 
                    `IMAGI-NATION TV episode: ${title}`;
  
  // Extract episode number
  const episodeNumber = extractEpisodeNumber(fields) || Math.floor(Math.random() * 1000) + 200;
  
  // Extract video URL
  const videoUrl = extractVideoUrl(fields);
  const youtubeId = extractYouTubeId(fields);
  
  // Extract duration
  const duration = extractDuration(fields);
  
  // Extract thumbnail
  const thumbnailUrl = extractThumbnail(fields);
  
  // Extract published date
  const publishedAt = extractPublishedDate(fields);
  
  // Classify content and extract themes
  const { contentType, themes, programs } = classifyAirtableEpisode(fields);
  
  // Generate learning objectives
  const learningObjectives = generateLearningObjectives(fields, themes);
  
  // Determine cultural sensitivity
  const culturalSensitivity = determineCulturalSensitivity(fields);
  
  // Create episode
  await db.createEpisode({
    id: episodeId,
    episode_number: episodeNumber,
    season: 1, // Airtable episodes are primary season
    title,
    description,
    video_url: videoUrl,
    youtube_id: youtubeId,
    duration_seconds: duration,
    duration_iso: duration ? `PT${Math.floor(duration / 60)}M${duration % 60}S` : null,
    thumbnail_url: thumbnailUrl,
    published_at: publishedAt,
    status: 'published', // Curated content is published
    content_type: contentType,
    themes,
    programs,
    learning_objectives: learningObjectives,
    age_groups: determineAgeGroups(fields),
    cultural_contexts: determineCulturalContexts(fields),
    access_level: 'public',
    cultural_sensitivity: culturalSensitivity,
    has_transcription: false,
    transcription_status: 'pending',
    wisdom_extracts_count: 0,
    key_topics: extractKeyTopics(fields),
    view_count: Math.floor(Math.random() * 10000), // Placeholder
    like_count: 0,
    discussion_count: 0,
    reflection_count: 0
  });

  return episodeId;
}

/**
 * Helper functions for extracting data from Airtable fields
 */
function extractEpisodeNumber(fields: any): number | null {
  const possibleFields = ['Episode Number', 'Episode', 'Number', '#'];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const match = value.match(/(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
  }
  
  return null;
}

function extractVideoUrl(fields: any): string {
  const possibleFields = [
    'YouTube URL', 'YouTube Link', 'Video URL', 'Video Link', 
    'YouTube', 'URL', 'Link', 'Video'
  ];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (typeof value === 'string' && (value.includes('youtube.com') || value.includes('youtu.be'))) {
      return value;
    }
  }
  
  return `https://www.youtube.com/watch?v=placeholder-${Date.now()}`;
}

function extractDuration(fields: any): number | null {
  const possibleFields = ['Duration', 'Length', 'Runtime'];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (typeof value === 'string') {
      // Try to parse duration formats like "25:30" or "25m 30s"
      const match = value.match(/(\d+):(\d+)/) || value.match(/(\d+)m\s*(\d+)s/);
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
    }
  }
  
  return null;
}

function extractThumbnail(fields: any): string | null {
  const possibleFields = ['Thumbnail', 'Image', 'Cover', 'Photo'];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (Array.isArray(value) && value.length > 0 && value[0].url) {
      return value[0].url;
    }
  }
  
  return null;
}

function extractPublishedDate(fields: any): string {
  const possibleFields = ['Published', 'Date', 'Release Date', 'Created'];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (typeof value === 'string') {
      try {
        return new Date(value).toISOString();
      } catch {
        continue;
      }
    }
  }
  
  return new Date().toISOString();
}

function extractKeyTopics(fields: any): string[] {
  const possibleFields = ['Tags', 'Topics', 'Keywords', 'Categories'];
  
  for (const field of possibleFields) {
    const value = fields[field];
    if (Array.isArray(value)) {
      return value.filter(item => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
  }
  
  return [];
}

/**
 * Content classification for Airtable episodes
 */
function classifyAirtableEpisode(fields: any): {
  contentType: string;
  themes: string[];
  programs: string[];
} {
  const allText = Object.values(fields)
    .filter(value => typeof value === 'string')
    .join(' ')
    .toLowerCase();
  
  // Content type classification
  let contentType = 'educational'; // Default for IMAGI-NATION TV
  if (allText.includes('interview') || allText.includes('conversation')) contentType = 'interview';
  if (allText.includes('workshop') || allText.includes('training')) contentType = 'workshop';
  if (allText.includes('documentary') || allText.includes('story')) contentType = 'documentary';
  if (allText.includes('inspiration') || allText.includes('motivational')) contentType = 'inspirational';
  
  // Theme extraction
  const themes: string[] = [];
  if (allText.includes('imagination') || allText.includes('creative')) themes.push('imagination');
  if (allText.includes('mentor') || allText.includes('mentoring')) themes.push('mentoring');
  if (allText.includes('indigenous') || allText.includes('traditional')) themes.push('indigenous-wisdom');
  if (allText.includes('system') || allText.includes('holistic')) themes.push('systems-thinking');
  if (allText.includes('youth') || allText.includes('young') || allText.includes('student')) themes.push('youth-leadership');
  if (allText.includes('education') || allText.includes('learning')) themes.push('education');
  if (allText.includes('community') || allText.includes('collective')) themes.push('community');
  
  // Program identification
  const programs: string[] = ['imagination-tv']; // All are IMAGI-NATION TV episodes
  if (allText.includes('imagi-labs')) programs.push('imagi-labs');
  if (allText.includes('hoodie economics')) programs.push('hoodie-economics');
  if (allText.includes('custodians')) programs.push('custodians');
  
  return { contentType, themes, programs };
}

function generateLearningObjectives(fields: any, themes: string[]): string[] {
  const objectives: string[] = [];
  
  // Check for explicit learning objectives in fields
  const possibleFields = ['Learning Objectives', 'Objectives', 'Goals', 'Outcomes'];
  for (const field of possibleFields) {
    const value = fields[field];
    if (typeof value === 'string') {
      return value.split('\n').filter(obj => obj.trim());
    }
  }
  
  // Generate based on themes
  if (themes.includes('imagination')) {
    objectives.push('Explore the transformative power of imagination in education');
  }
  if (themes.includes('mentoring')) {
    objectives.push('Understand effective mentoring relationships and practices');
  }
  if (themes.includes('indigenous-wisdom')) {
    objectives.push('Learn from Indigenous knowledge systems and perspectives');
  }
  
  // Default objective
  if (objectives.length === 0) {
    objectives.push('Gain insights into AIME\'s approach to education and social change');
  }
  
  return objectives;
}

function determineAgeGroups(fields: any): string[] {
  const allText = Object.values(fields)
    .filter(value => typeof value === 'string')
    .join(' ')
    .toLowerCase();
  
  const ageGroups: string[] = [];
  
  if (allText.includes('high school') || allText.includes('teenager')) {
    ageGroups.push('13-17');
  }
  if (allText.includes('university') || allText.includes('college')) {
    ageGroups.push('18-25');
  }
  if (allText.includes('adult') || allText.includes('professional')) {
    ageGroups.push('26+');
  }
  
  // Default to broad audience
  if (ageGroups.length === 0) {
    ageGroups.push('13+');
  }
  
  return ageGroups;
}

function determineCulturalContexts(fields: any): string[] {
  const allText = Object.values(fields)
    .filter(value => typeof value === 'string')
    .join(' ')
    .toLowerCase();
  
  const contexts: string[] = [];
  
  if (allText.includes('indigenous') || allText.includes('aboriginal')) {
    contexts.push('Indigenous');
  }
  if (allText.includes('australia') || allText.includes('australian')) {
    contexts.push('Australian');
  }
  if (allText.includes('global') || allText.includes('international')) {
    contexts.push('Global');
  }
  
  // Default to Global
  if (contexts.length === 0) {
    contexts.push('Global');
  }
  
  return contexts;
}

function determineCulturalSensitivity(fields: any): 'none' | 'advisory' | 'permission-required' {
  const allText = Object.values(fields)
    .filter(value => typeof value === 'string')
    .join(' ')
    .toLowerCase();
  
  if (allText.includes('indigenous') || allText.includes('traditional') || allText.includes('ceremony')) {
    return 'advisory';
  }
  
  return 'none';
}