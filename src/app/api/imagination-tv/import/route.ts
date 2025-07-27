/**
 * Unified Video Import API
 * 
 * Coordinates import from YouTube and Airtable sources to create
 * a comprehensive video library in IMAGI-NATION TV
 */

import { NextRequest, NextResponse } from 'next/server';
import { youtubeImporter } from '@/lib/video-import/youtube-importer';
import { airtableImporter } from '@/lib/video-import/airtable-importer';
import { knowledgeConnections } from '@/lib/knowledge-connections';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/import - Import videos from various sources
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, source, adminKey, options = {} } = body;

    // Admin authentication
    if (adminKey !== 'aime-import-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Invalid admin key'
      }, { status: 401 });
    }

    console.log(`📹 Video import request: ${action} from ${source || 'all sources'}`);

    const startTime = Date.now();
    let results: any = {};

    switch (action) {
      case 'import-youtube':
        console.log('🎬 Starting YouTube video import...');
        results = await youtubeImporter.importAllVideos();
        break;

      case 'import-airtable':
        console.log('📋 Starting Airtable video import...');
        results = await airtableImporter.importAllVideos();
        break;

      case 'import-all':
        console.log('🌟 Starting comprehensive video import from all sources...');
        
        // Import from YouTube
        console.log('📺 Phase 1: YouTube Import');
        const youtubeResults = await youtubeImporter.importAllVideos();
        
        // Import from Airtable
        console.log('📋 Phase 2: Airtable Import');
        const airtableResults = await airtableImporter.importAllVideos();
        
        // Generate knowledge connections
        console.log('🔗 Phase 3: Knowledge Connections');
        const connectionsGenerated = await knowledgeConnections.generateAllConnections();
        
        results = {
          youtube: youtubeResults,
          airtable: airtableResults,
          connectionsGenerated,
          summary: {
            totalImported: youtubeResults.imported + airtableResults.imported,
            totalProcessed: youtubeResults.processed + airtableResults.processed,
            totalSkipped: airtableResults.skipped,
            totalErrors: youtubeResults.errors.length + airtableResults.errors.length
          }
        };
        break;

      case 'sync-airtable':
        console.log('🔄 Syncing Airtable video updates...');
        results = await airtableImporter.syncVideoUpdates(options.airtableId);
        break;

      case 'import-channel':
        if (!options.channelId) {
          return NextResponse.json({
            success: false,
            error: 'Channel ID is required for channel import'
          }, { status: 400 });
        }
        
        console.log(`📺 Importing from YouTube channel: ${options.channelId}`);
        results = await youtubeImporter.importChannelVideos(
          options.channelId, 
          options.maxResults || 500
        );
        break;

      case 'quality-check':
        console.log('🔍 Running video quality assessment...');
        results = await runQualityAssessment(options);
        break;

      case 'categorize-videos':
        console.log('🏷️ Re-categorizing existing videos...');
        results = await recategorizeVideos(options);
        break;

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        action,
        source,
        duration: `${duration}ms`,
        results,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Video import API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Import operation failed'
    }, { status: 500 });
  }
}

/**
 * GET /api/imagination-tv/import - Get import status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        const status = await getImportStatus();
        return NextResponse.json({
          success: true,
          data: status
        });

      case 'sources':
        const sources = await getAvailableSources();
        return NextResponse.json({
          success: true,
          data: sources
        });

      case 'quality-report':
        const qualityReport = await generateQualityReport();
        return NextResponse.json({
          success: true,
          data: qualityReport
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Import status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get import status'
    }, { status: 500 });
  }
}

/**
 * Helper Functions
 */

async function getImportStatus(): Promise<any> {
  const { getVideoDatabase } = await import('@/lib/database/video-database');
  const db = await getVideoDatabase();
  
  // Get episode statistics
  const { episodes: allEpisodes } = await db.getEpisodes({ limit: 10000 });
  
  const stats = {
    totalVideos: allEpisodes.length,
    publishedVideos: allEpisodes.filter((ep: any) => ep.status === 'published').length,
    draftVideos: allEpisodes.filter((ep: any) => ep.status === 'draft').length,
    
    // Source breakdown
    youtubeVideos: allEpisodes.filter((ep: any) => ep.youtube_id).length,
    vimeoVideos: allEpisodes.filter((ep: any) => ep.vimeo_id).length,
    airtableVideos: allEpisodes.filter((ep: any) => ep.id.startsWith('airtable-')).length,
    imaginationTvEpisodes: allEpisodes.filter((ep: any) => ep.id.startsWith('imagi-tv-')).length,
    
    // Content type breakdown
    contentTypes: getContentTypeBreakdown(allEpisodes),
    
    // Theme analysis
    topThemes: getTopThemes(allEpisodes),
    
    // Quality metrics
    qualityMetrics: getQualityMetrics(allEpisodes),
    
    // Processing status
    processingStatus: {
      withTranscription: allEpisodes.filter((ep: any) => ep.has_transcription).length,
      withWisdomExtracts: allEpisodes.filter((ep: any) => ep.wisdom_extracts_count > 0).length,
      pendingProcessing: allEpisodes.filter((ep: any) => ep.transcription_status === 'pending').length
    },
    
    lastUpdated: new Date().toISOString()
  };
  
  return stats;
}

function getContentTypeBreakdown(episodes: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  for (const episode of episodes) {
    const type = episode.content_type || 'unknown';
    breakdown[type] = (breakdown[type] || 0) + 1;
  }
  
  return breakdown;
}

function getTopThemes(episodes: any[]): Array<{ theme: string; count: number }> {
  const themeCounts: Record<string, number> = {};
  
  for (const episode of episodes) {
    const themes = episode.themes || [];
    for (const theme of themes) {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    }
  }
  
  return Object.entries(themeCounts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getQualityMetrics(episodes: any[]): any {
  const published = episodes.filter(ep => ep.status === 'published');
  
  if (published.length === 0) {
    return { averageViewCount: 0, averageWisdomExtracts: 0, engagementRate: 0 };
  }
  
  const totalViews = published.reduce((sum, ep) => sum + (ep.view_count || 0), 0);
  const totalWisdom = published.reduce((sum, ep) => sum + (ep.wisdom_extracts_count || 0), 0);
  const totalEngagement = published.reduce((sum, ep) => 
    sum + (ep.like_count || 0) + (ep.discussion_count || 0) + (ep.reflection_count || 0), 0
  );
  
  return {
    averageViewCount: Math.round(totalViews / published.length),
    averageWisdomExtracts: Math.round(totalWisdom / published.length),
    engagementRate: totalViews > 0 ? Math.round((totalEngagement / totalViews) * 100) / 100 : 0,
    totalPublished: published.length
  };
}

async function getAvailableSources(): Promise<any> {
  return {
    youtube: {
      name: 'YouTube',
      description: 'AIME official YouTube channels',
      status: process.env.YOUTUBE_API_KEY ? 'configured' : 'not_configured',
      channels: [
        { id: 'UCfH7_J6bT5nVLz1VJ6z2J4A', name: 'AIME Main Channel' },
        // Add more channels as needed
      ]
    },
    airtable: {
      name: 'Airtable',
      description: 'AIME video asset database',
      status: process.env.AIRTABLE_API_KEY ? 'configured' : 'not_configured',
      tables: ['Video Assets', 'IMAGI-NATION TV Episodes']
    },
    manual: {
      name: 'Manual Upload',
      description: 'Direct video URL imports',
      status: 'available'
    }
  };
}

async function generateQualityReport(): Promise<any> {
  const { getVideoDatabase } = await import('@/lib/database/video-database');
  const db = await getVideoDatabase();
  
  const { episodes } = await db.getEpisodes({ limit: 10000 });
  
  // Quality assessment criteria
  const qualityChecks = {
    hasDescription: episodes.filter(ep => ep.description && ep.description.length > 50).length,
    hasThumbnail: episodes.filter(ep => ep.thumbnail_url).length,
    hasTranscription: episodes.filter(ep => ep.has_transcription).length,
    hasWisdomExtracts: episodes.filter(ep => ep.wisdom_extracts_count > 0).length,
    hasLearningObjectives: episodes.filter(ep => 
      ep.learning_objectives && ep.learning_objectives.length > 0
    ).length,
    hasThemes: episodes.filter(ep => ep.themes && ep.themes.length > 0).length,
    hasPrograms: episodes.filter(ep => ep.programs && ep.programs.length > 0).length,
    appropriateDuration: episodes.filter(ep => 
      ep.duration_seconds && ep.duration_seconds > 120 && ep.duration_seconds < 3600
    ).length
  };
  
  const totalEpisodes = episodes.length;
  
  const qualityScore = totalEpisodes > 0 ? 
    Object.values(qualityChecks).reduce((sum, count) => sum + count, 0) / 
    (Object.keys(qualityChecks).length * totalEpisodes) : 0;
  
  return {
    totalEpisodes,
    overallQualityScore: Math.round(qualityScore * 100),
    qualityChecks: Object.fromEntries(
      Object.entries(qualityChecks).map(([check, count]) => [
        check, 
        { 
          count, 
          percentage: totalEpisodes > 0 ? Math.round((count / totalEpisodes) * 100) : 0 
        }
      ])
    ),
    recommendations: generateQualityRecommendations(qualityChecks, totalEpisodes)
  };
}

function generateQualityRecommendations(checks: any, total: number): string[] {
  const recommendations: string[] = [];
  
  if (checks.hasDescription / total < 0.8) {
    recommendations.push('Add detailed descriptions to improve discoverability');
  }
  
  if (checks.hasTranscription / total < 0.5) {
    recommendations.push('Increase transcription coverage for accessibility');
  }
  
  if (checks.hasWisdomExtracts / total < 0.3) {
    recommendations.push('Extract more wisdom insights for enhanced learning');
  }
  
  if (checks.hasLearningObjectives / total < 0.6) {
    recommendations.push('Define clear learning objectives for educational content');
  }
  
  if (checks.hasThemes / total < 0.9) {
    recommendations.push('Tag videos with relevant themes for better organization');
  }
  
  return recommendations;
}

async function runQualityAssessment(options: any): Promise<any> {
  const { getVideoDatabase } = await import('@/lib/database/video-database');
  const db = await getVideoDatabase();
  
  const { episodes } = await db.getEpisodes({ 
    status: options.status || 'published',
    limit: options.limit || 1000 
  });
  
  const assessmentResults = [];
  
  for (const episode of episodes) {
    const score = calculateEpisodeQualityScore(episode);
    const issues = identifyQualityIssues(episode);
    
    if (score < 0.7 || issues.length > 0) {
      assessmentResults.push({
        id: episode.id,
        title: episode.title,
        qualityScore: score,
        issues,
        recommendations: generateEpisodeRecommendations(issues)
      });
    }
  }
  
  return {
    episodesAssessed: episodes.length,
    needsAttention: assessmentResults.length,
    results: assessmentResults.slice(0, 50) // Limit results
  };
}

function calculateEpisodeQualityScore(episode: any): number {
  let score = 0.5; // Base score
  
  // Content quality indicators
  if (episode.description && episode.description.length > 100) score += 0.1;
  if (episode.thumbnail_url) score += 0.1;
  if (episode.has_transcription) score += 0.15;
  if (episode.wisdom_extracts_count > 0) score += 0.15;
  if (episode.learning_objectives && episode.learning_objectives.length > 0) score += 0.1;
  if (episode.themes && episode.themes.length > 2) score += 0.1;
  if (episode.programs && episode.programs.length > 0) score += 0.05;
  
  // Engagement indicators
  if (episode.view_count > 100) score += 0.05;
  if (episode.discussion_count > 0) score += 0.05;
  
  // Duration appropriateness
  if (episode.duration_seconds > 300 && episode.duration_seconds < 2400) score += 0.05;
  
  return Math.min(score, 1.0);
}

function identifyQualityIssues(episode: any): string[] {
  const issues: string[] = [];
  
  if (!episode.description || episode.description.length < 50) {
    issues.push('Short or missing description');
  }
  
  if (!episode.thumbnail_url) {
    issues.push('Missing thumbnail');
  }
  
  if (!episode.has_transcription) {
    issues.push('No transcription available');
  }
  
  if (!episode.learning_objectives || episode.learning_objectives.length === 0) {
    issues.push('No learning objectives defined');
  }
  
  if (!episode.themes || episode.themes.length === 0) {
    issues.push('No themes tagged');
  }
  
  if (episode.duration_seconds && episode.duration_seconds < 120) {
    issues.push('Very short duration');
  }
  
  if (episode.wisdom_extracts_count === 0) {
    issues.push('No wisdom extracts identified');
  }
  
  return issues;
}

function generateEpisodeRecommendations(issues: string[]): string[] {
  const recommendations: string[] = [];
  
  if (issues.includes('Short or missing description')) {
    recommendations.push('Add a comprehensive description with key topics and learning outcomes');
  }
  
  if (issues.includes('Missing thumbnail')) {
    recommendations.push('Add an engaging thumbnail that represents the content');
  }
  
  if (issues.includes('No transcription available')) {
    recommendations.push('Generate transcription for accessibility and searchability');
  }
  
  if (issues.includes('No learning objectives defined')) {
    recommendations.push('Define clear, measurable learning objectives');
  }
  
  if (issues.includes('No themes tagged')) {
    recommendations.push('Tag with relevant AIME themes and topics');
  }
  
  return recommendations;
}

async function recategorizeVideos(options: any): Promise<any> {
  // This would implement intelligent re-categorization of existing videos
  // based on updated classification algorithms
  return {
    message: 'Video recategorization feature coming soon',
    totalVideos: 0,
    recategorized: 0
  };
}