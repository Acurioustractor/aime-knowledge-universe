/**
 * Video Deduplication and Cross-Platform Matching
 * 
 * Identifies and manages duplicate videos across YouTube and Airtable sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDatabase } from '@/lib/database/video-database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/deduplicate - Find and manage duplicate videos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, action = 'analyze', autoMerge = false } = body;

    if (adminKey !== 'aime-import-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('🔍 Starting video deduplication analysis...');
    const startTime = Date.now();

    const db = await getVideoDatabase();
    
    // Get all episodes
    const { episodes } = await db.getEpisodes({ limit: 10000 });
    console.log(`📺 Analyzing ${episodes.length} episodes for duplicates...`);

    const duplicateGroups = findDuplicateGroups(episodes);
    const crossPlatformMatches = findCrossPlatformMatches(episodes);
    
    let actionResults = null;
    
    if (action === 'merge' && autoMerge) {
      actionResults = await autoMergeDuplicates(db, duplicateGroups);
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        action: 'deduplicate-analysis',
        duration: `${duration}ms`,
        totalEpisodes: episodes.length,
        duplicateGroups: duplicateGroups.length,
        totalDuplicates: duplicateGroups.reduce((sum, group) => sum + group.episodes.length - 1, 0),
        crossPlatformMatches: crossPlatformMatches.length,
        duplicates: duplicateGroups,
        matches: crossPlatformMatches,
        actionResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Deduplication error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Deduplication failed'
    }, { status: 500 });
  }
}

/**
 * Find groups of duplicate episodes
 */
function findDuplicateGroups(episodes: any[]): any[] {
  const groups: any[] = [];
  const processed = new Set();

  for (let i = 0; i < episodes.length; i++) {
    if (processed.has(episodes[i].id)) continue;

    const episode = episodes[i];
    const duplicates = [episode];
    processed.add(episode.id);

    // Find duplicates of this episode
    for (let j = i + 1; j < episodes.length; j++) {
      if (processed.has(episodes[j].id)) continue;

      const other = episodes[j];
      const similarity = calculateSimilarity(episode, other);

      if (similarity.isDuplicate) {
        duplicates.push(other);
        processed.add(other.id);
      }
    }

    // Only add groups with actual duplicates
    if (duplicates.length > 1) {
      groups.push({
        groupId: `group-${i}`,
        primaryEpisode: episode,
        episodes: duplicates,
        duplicateCount: duplicates.length - 1,
        similarityReasons: calculateSimilarity(episode, duplicates[1]).reasons
      });
    }
  }

  return groups;
}

/**
 * Find cross-platform matches (YouTube vs Airtable)
 */
function findCrossPlatformMatches(episodes: any[]): any[] {
  const matches: any[] = [];
  const youtubeEpisodes = episodes.filter(ep => ep.id.includes('youtube') || ep.youtube_id);
  const airtableEpisodes = episodes.filter(ep => ep.id.includes('airtable'));

  console.log(`🔍 Checking ${youtubeEpisodes.length} YouTube vs ${airtableEpisodes.length} Airtable episodes...`);

  for (const youtubeEp of youtubeEpisodes) {
    for (const airtableEp of airtableEpisodes) {
      const similarity = calculateSimilarity(youtubeEp, airtableEp);
      
      if (similarity.score >= 0.8) { // High confidence match
        matches.push({
          matchId: `match-${youtubeEp.id}-${airtableEp.id}`,
          youtubeEpisode: youtubeEp,
          airtableEpisode: airtableEp,
          similarity: similarity.score,
          reasons: similarity.reasons,
          confidence: similarity.score >= 0.9 ? 'high' : 'medium'
        });
      }
    }
  }

  return matches;
}

/**
 * Calculate similarity between two episodes
 */
function calculateSimilarity(episode1: any, episode2: any): {
  score: number;
  isDuplicate: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // YouTube ID match (definitive)
  if (episode1.youtube_id && episode2.youtube_id && episode1.youtube_id === episode2.youtube_id) {
    score += 1.0;
    reasons.push('Identical YouTube ID');
    return { score, isDuplicate: true, reasons };
  }

  // Title similarity
  const titleSimilarity = calculateTextSimilarity(episode1.title, episode2.title);
  if (titleSimilarity >= 0.9) {
    score += 0.4;
    reasons.push(`Very similar titles (${Math.round(titleSimilarity * 100)}%)`);
  } else if (titleSimilarity >= 0.7) {
    score += 0.2;
    reasons.push(`Similar titles (${Math.round(titleSimilarity * 100)}%)`);
  }

  // Description similarity
  if (episode1.description && episode2.description) {
    const descSimilarity = calculateTextSimilarity(episode1.description, episode2.description);
    if (descSimilarity >= 0.8) {
      score += 0.3;
      reasons.push(`Very similar descriptions (${Math.round(descSimilarity * 100)}%)`);
    } else if (descSimilarity >= 0.6) {
      score += 0.15;
      reasons.push(`Similar descriptions (${Math.round(descSimilarity * 100)}%)`);
    }
  }

  // Duration similarity
  if (episode1.duration_seconds && episode2.duration_seconds) {
    const durationDiff = Math.abs(episode1.duration_seconds - episode2.duration_seconds);
    if (durationDiff <= 10) { // Within 10 seconds
      score += 0.2;
      reasons.push('Nearly identical duration');
    } else if (durationDiff <= 60) { // Within 1 minute
      score += 0.1;
      reasons.push('Similar duration');
    }
  }

  // Published date similarity
  if (episode1.published_at && episode2.published_at) {
    const date1 = new Date(episode1.published_at);
    const date2 = new Date(episode2.published_at);
    const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) {
      score += 0.1;
      reasons.push('Published on same day');
    } else if (daysDiff <= 7) {
      score += 0.05;
      reasons.push('Published within same week');
    }
  }

  const isDuplicate = score >= 0.7; // 70% threshold for duplicates

  return { score, isDuplicate, reasons };
}

/**
 * Calculate text similarity using Jaccard index
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;

  // Normalize texts
  const normalize = (text: string) => text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));

  // Jaccard similarity
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Auto-merge duplicate episodes
 */
async function autoMergeDuplicates(db: any, duplicateGroups: any[]): Promise<any> {
  const results = {
    groupsProcessed: 0,
    episodesMerged: 0,
    episodesDeleted: 0,
    errors: [] as string[]
  };

  console.log(`🔄 Auto-merging ${duplicateGroups.length} duplicate groups...`);

  for (const group of duplicateGroups) {
    try {
      // Choose the best episode as primary (prefer Airtable, then oldest)
      const primary = choosePrimaryEpisode(group.episodes);
      const duplicates = group.episodes.filter(ep => ep.id !== primary.id);

      console.log(`🔄 Merging group: ${group.episodes.length} episodes -> 1 primary (${primary.title})`);

      // Merge data from duplicates into primary
      const mergedData = mergeEpisodeData(primary, duplicates);
      
      // Update primary episode with merged data
      await db.updateEpisode(primary.id, mergedData);

      // Delete duplicate episodes
      for (const duplicate of duplicates) {
        await db.run('DELETE FROM imagination_tv_episodes WHERE id = ?', [duplicate.id]);
        console.log(`🗑️  Deleted duplicate: ${duplicate.id}`);
        results.episodesDeleted++;
      }

      results.groupsProcessed++;
      results.episodesMerged += duplicates.length;

    } catch (error) {
      const errorMsg = `Failed to merge group ${group.groupId}: ${error}`;
      console.error('❌', errorMsg);
      results.errors.push(errorMsg);
    }
  }

  console.log(`✅ Auto-merge complete: ${results.groupsProcessed} groups, ${results.episodesMerged} merged, ${results.episodesDeleted} deleted`);
  return results;
}

/**
 * Choose the best episode as primary from a duplicate group
 */
function choosePrimaryEpisode(episodes: any[]): any {
  // Prefer Airtable episodes (curated content)
  const airtableEpisodes = episodes.filter(ep => ep.id.includes('airtable'));
  if (airtableEpisodes.length > 0) {
    return airtableEpisodes[0];
  }

  // Prefer episodes with more complete data
  episodes.sort((a, b) => {
    const scoreA = calculateCompletenessScore(a);
    const scoreB = calculateCompletenessScore(b);
    return scoreB - scoreA;
  });

  return episodes[0];
}

/**
 * Calculate completeness score for an episode
 */
function calculateCompletenessScore(episode: any): number {
  let score = 0;

  if (episode.description && episode.description.length > 100) score += 2;
  if (episode.youtube_id) score += 1;
  if (episode.thumbnail_url) score += 1;
  if (episode.has_transcription) score += 1;
  if (episode.themes && episode.themes.length > 0) score += 1;
  if (episode.learning_objectives && episode.learning_objectives.length > 0) score += 1;
  if (episode.wisdom_extracts_count > 0) score += 2;

  return score;
}

/**
 * Merge data from multiple episodes into one
 */
function mergeEpisodeData(primary: any, duplicates: any[]): any {
  const merged: any = { ...primary };

  for (const duplicate of duplicates) {
    // Merge themes
    if (duplicate.themes) {
      const combinedThemes = [...(merged.themes || []), ...duplicate.themes];
      merged.themes = [...new Set(combinedThemes)];
    }

    // Merge learning objectives
    if (duplicate.learning_objectives) {
      const combinedObjectives = [...(merged.learning_objectives || []), ...duplicate.learning_objectives];
      merged.learning_objectives = [...new Set(combinedObjectives)];
    }

    // Take better description if available
    if (duplicate.description && duplicate.description.length > (merged.description?.length || 0)) {
      merged.description = duplicate.description;
    }

    // Take YouTube ID if missing
    if (!merged.youtube_id && duplicate.youtube_id) {
      merged.youtube_id = duplicate.youtube_id;
    }

    // Take thumbnail if missing
    if (!merged.thumbnail_url && duplicate.thumbnail_url) {
      merged.thumbnail_url = duplicate.thumbnail_url;
    }

    // Combine view counts
    merged.view_count = (merged.view_count || 0) + (duplicate.view_count || 0);
  }

  return merged;
}