/**
 * Mentor App Lessons API
 * 
 * Fetches all Mentor App lessons from Airtable with their videos, audio, and activities
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour
export const runtime = 'nodejs';

/**
 * GET /api/mentor-app/lessons - Fetch all Mentor App lessons
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🎓 Starting Mentor App lessons fetch...');
    const startTime = Date.now();

    // Get Airtable API credentials from environment
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID_DAM;
    
    if (!airtableApiKey || !airtableBaseId) {
      throw new Error('Airtable credentials not configured');
    }

    // Get all tables in the DAM base with caching
    const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${airtableBaseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!tablesResponse.ok) {
      throw new Error(`Failed to fetch tables: ${tablesResponse.status} ${tablesResponse.statusText}`);
    }

    const tablesData = await tablesResponse.json();
    console.log(`📋 Found ${tablesData.tables.length} tables in DAM base`);

    let allMentorLessons: any[] = [];

    // Search all tables for Mentor App records
    for (const table of tablesData.tables) {
      try {
        console.log(`🔍 Searching table: ${table.name} for Mentor App lessons...`);
        
        // Get ALL records from table with pagination
        let allRecords: any[] = [];
        let offset = '';
        
        do {
          let tableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${table.id}?pageSize=100`;
          if (offset) tableUrl += `&offset=${offset}`;
          
          const tableResponse = await fetch(tableUrl, {
            headers: {
              'Authorization': `Bearer ${airtableApiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (tableResponse.ok) {
            const tableData = await tableResponse.json();
            const pageRecords = tableData.records || [];
            allRecords = allRecords.concat(pageRecords);
            offset = tableData.offset || '';
          } else {
            break;
          }
        } while (offset);

        if (allRecords.length > 0) {
          const records = allRecords;
          
          // Filter for core Mentor App lessons - specific titles provided by user
          const targetLessons = [
            'Know Yourself | Mentor App',
            'BRAVE Goals | Mentor App', 
            'Rebelliousness | Mentor App',
            'Kindness | Mentor App',
            'Hope | Mentor App',
            'Freedom | Mentor App',
            'No Shame | Mentor App',
            'Failure | Mentor App',
            'Initiative | Mentor App',
            'Forgiveness | Mentor App',
            'Effort | Mentor App',
            'Mentors Not Saviours | Mentor App',
            'Change | Mentor App',
            'The Gift of Time | Mentor App',
            'Empathy | Mentor App',
            'Yes And | Mentor App',
            'Listening | Mentor App',
            'Asking Questions | Mentor App'
          ];
          
          const mentorAppRecords = records.filter((record: any) => {
            const fields = record.fields;
            const name = fields.Name || '';
            
            // Debug: log any record that contains "Mentor App"
            if (name.includes('Mentor App')) {
              console.log(`   📝 Found potential match: "${name}" in table ${table.name}`);
            }
            
            // Exact match for the 18 specific Mentor App lessons
            return targetLessons.includes(name);
          });

          if (mentorAppRecords.length > 0) {
            console.log(`✅ Found ${mentorAppRecords.length} Mentor App lessons in table: ${table.name}`);
            mentorAppRecords.forEach(record => {
              console.log(`   ➤ "${record.fields.Name}"`);
            });
            allMentorLessons.push(...mentorAppRecords);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error searching table ${table.name}:`, error);
      }
    }

    console.log(`📚 Total Mentor App lessons found: ${allMentorLessons.length}`);

    // Transform the lessons into a clean format
    const transformedLessons = allMentorLessons.map((record: any, index: number) => {
      const fields = record.fields;
      
      return {
        id: record.id,
        lessonNumber: index + 1,
        title: extractTitle(fields),
        topic: fields.Keyword?.[0] || fields.Title || 'Unknown',
        summary: fields.Summary || fields['Write ups'] || fields['Short Write ups (70 char or less)'] || '',
        longDescription: fields['Write ups'] || '',
        
        // Media assets
        vimeoUrl: fields.Link || '',
        vimeoEmbed: fields.Embed || '',
        audioUrl: extractAudioUrl(fields),
        thumbnailUrl: extractThumbnailUrl(fields),
        
        // Learning components
        activity: fields.ACTIVITY || '',
        learningObjectives: generateLearningObjectives(fields),
        
        // Metadata
        keywords: fields.Keyword || [],
        tags: fields.Tags || [],
        status: fields.Status || 'Current – up to date',
        completionDate: fields['COMPLETION DATE '] || null,
        duration: extractDuration(fields),
        
        // AIME ecosystem connections
        relatedTopics: fields.Topic ? [fields.Topic] : [],
        areaOfFocus: fields.Area || 'Mentoring',
        culturalContext: extractCulturalContext(fields),
        
        // Engagement features
        hasReflection: !!fields.ACTIVITY,
        hasAudio: !!extractAudioUrl(fields),
        hasVideo: !!fields.Link,
        isInteractive: !!fields.ACTIVITY
      };
    });

    // Sort by lesson number/title for consistent ordering
    transformedLessons.sort((a, b) => {
      if (a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
      return a.lessonNumber - b.lessonNumber;
    });

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        lessons: transformedLessons,
        totalLessons: transformedLessons.length,
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`
      }
    });

  } catch (error) {
    console.error('❌ Mentor App lessons fetch error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch mentor lessons'
    }, { status: 500 });
  }
}

/**
 * Helper functions for data extraction and transformation
 */

function extractTitle(fields: any): string {
  const name = fields.Name || '';
  
  // Extract title from "Topic | Mentor App" format
  if (name.includes('| Mentor App')) {
    return name.split('| Mentor App')[0].trim();
  }
  
  return fields.Title || name || 'Untitled Lesson';
}

function extractAudioUrl(fields: any): string | null {
  const audioUpload = fields['Audio upload'];
  if (audioUpload && audioUpload.length > 0) {
    return audioUpload[0].url;
  }
  return null;
}

function extractThumbnailUrl(fields: any): string | null {
  const attachments = fields.Attachments;
  if (attachments && attachments.length > 0) {
    return attachments[0].url;
  }
  return null;
}

function extractDuration(fields: any): string {
  // Try to estimate duration from audio file size or default to reasonable time
  const audioUpload = fields['Audio upload'];
  if (audioUpload && audioUpload.length > 0) {
    const sizeInBytes = audioUpload[0].size;
    // Rough estimate: 1MB ≈ 1 minute for audio
    const estimatedMinutes = Math.round(sizeInBytes / 1000000);
    return `${Math.max(estimatedMinutes, 5)} minutes`;
  }
  return '10 minutes';
}

function generateLearningObjectives(fields: any): string[] {
  const topic = fields.Keyword?.[0] || 'mentoring';
  const baseObjectives = [
    `Understand the core concept of ${topic.toLowerCase()}`,
    'Apply AIME\'s mentoring principles in real situations',
    'Develop practical skills for positive change'
  ];
  
  if (fields.ACTIVITY) {
    baseObjectives.push('Complete hands-on activities to reinforce learning');
  }
  
  return baseObjectives;
}

function extractCulturalContext(fields: any): string[] {
  const contexts = ['Indigenous wisdom', 'Australian context', 'Global mentoring'];
  
  if (fields.Area === 'Mentoring') {
    contexts.push('AIME methodology');
  }
  
  return contexts;
}