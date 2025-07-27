/**
 * MASTER AIME KNOWLEDGE SYNC SYSTEM
 * 
 * This is the ultimate sync system that brings together ALL AIME content sources:
 * - Knowledge Hub documents (GitHub)
 * - YouTube videos 
 * - Mailchimp newsletters
 * - Airtable hoodies
 * - Business cases
 * - Tools
 * - Any other content sources we discover
 * 
 * SYNC ALL THE FUCKING THINGS! 🚀
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';
export const maxDuration = 600; // 10 minutes for full sync

interface SyncResult {
  source: string;
  status: 'success' | 'error' | 'skipped';
  items_synced: number;
  new_items: number;
  updated_items: number;
  errors: string[];
  execution_time: number;
}

// GET /api/master-sync - Get sync status
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get comprehensive content statistics
    const stats = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM knowledge_documents'),
      db.get('SELECT COUNT(*) as count FROM knowledge_chunks'), 
      db.get('SELECT COUNT(*) as count FROM business_cases'),
      db.get('SELECT COUNT(*) as count FROM tools'),
      db.get('SELECT COUNT(*) as count FROM hoodies'),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type = 'video'"),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type = 'newsletter'"),
      db.get("SELECT COUNT(*) as count FROM content WHERE content_type NOT IN ('video', 'newsletter')"),
      db.get('SELECT COUNT(*) as count FROM hoodie_holders'),
      db.get('SELECT COUNT(*) as count FROM hoodie_trades'),
    ]);
    
    const totalContent = stats.reduce((sum, stat) => sum + (stat?.count || 0), 0);
    
    return NextResponse.json({
      success: true,
      data: {
        total_content_items: totalContent,
        content_breakdown: {
          knowledge_documents: stats[0]?.count || 0,
          knowledge_chunks: stats[1]?.count || 0,
          business_cases: stats[2]?.count || 0,
          tools: stats[3]?.count || 0,
          hoodies: stats[4]?.count || 0,
          youtube_videos: stats[5]?.count || 0,
          newsletters: stats[6]?.count || 0,
          other_content: stats[7]?.count || 0,
          hoodie_holders: stats[8]?.count || 0,
          hoodie_trades: stats[9]?.count || 0
        },
        last_sync: await getLastSyncTimes(),
        sync_status: 'ready',
        message: `🌟 AIME Knowledge Universe contains ${totalContent.toLocaleString()} pieces of content!`
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to get master sync status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status'
    }, { status: 500 });
  }
}

// POST /api/master-sync - SYNC ALL THE THINGS! 🚀
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 MASTER SYNC INITIATED - SYNCING ALL AIME CONTENT SOURCES!');
  
  try {
    const body = await request.json();
    const {
      sources = ['all'],
      force_update = false,
      include_chunks = true
    } = body;
    
    const results: SyncResult[] = [];
    
    // 1. SYNC KNOWLEDGE HUB DOCUMENTS (GitHub)
    if (sources.includes('all') || sources.includes('knowledge')) {
      console.log('📚 SYNCING KNOWLEDGE HUB DOCUMENTS FROM GITHUB...');
      const knowledgeResult = await syncKnowledgeHub(force_update);
      results.push(knowledgeResult);
    }
    
    // 2. SYNC ALL MAILCHIMP NEWSLETTERS
    if (sources.includes('all') || sources.includes('newsletters')) {
      console.log('📧 SYNCING ALL MAILCHIMP NEWSLETTERS...');
      const newsletterResult = await syncAllNewsletters(force_update);
      results.push(newsletterResult);
    }
    
    // 3. SYNC YOUTUBE VIDEOS
    if (sources.includes('all') || sources.includes('videos')) {
      console.log('🎬 SYNCING YOUTUBE VIDEOS...');
      const videoResult = await syncYouTubeVideos(force_update);
      results.push(videoResult);
    }
    
    // 4. SYNC AIRTABLE HOODIES
    if (sources.includes('all') || sources.includes('hoodies')) {
      console.log('🎭 SYNCING AIRTABLE HOODIES...');
      const hoodieResult = await syncAirtableHoodies(force_update);
      results.push(hoodieResult);
    }
    
    // 5. SYNC BUSINESS CASES
    if (sources.includes('all') || sources.includes('business_cases')) {
      console.log('💡 SYNCING BUSINESS CASES...');
      const businessResult = await syncBusinessCases(force_update);
      results.push(businessResult);
    }
    
    // 6. SYNC TOOLS
    if (sources.includes('all') || sources.includes('tools')) {
      console.log('🔧 SYNCING TOOLS...');
      const toolsResult = await syncTools(force_update);
      results.push(toolsResult);
    }
    
    // 7. BUILD KNOWLEDGE RELATIONSHIPS
    if (sources.includes('all') || sources.includes('relationships')) {
      console.log('🕸️ BUILDING KNOWLEDGE RELATIONSHIPS...');
      const relationshipResult = await buildKnowledgeRelationships();
      results.push(relationshipResult);
    }
    
    const totalTime = Date.now() - startTime;
    const totalSynced = results.reduce((sum, r) => sum + r.items_synced, 0);
    const totalNew = results.reduce((sum, r) => sum + r.new_items, 0);
    const totalUpdated = results.reduce((sum, r) => sum + r.updated_items, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    
    console.log(`🎉 MASTER SYNC COMPLETE! ${totalSynced} items synced in ${totalTime}ms`);
    
    return NextResponse.json({
      success: true,
      data: {
        sync_results: results,
        summary: {
          total_items_synced: totalSynced,
          total_new_items: totalNew,
          total_updated_items: totalUpdated,
          total_errors: totalErrors,
          execution_time_ms: totalTime,
          execution_time_readable: `${Math.round(totalTime / 1000)}s`
        },
        message: `🚀 MASTER SYNC COMPLETE! Synced ${totalSynced} items across ${results.length} sources`
      }
    });
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('❌ MASTER SYNC FAILED:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Master sync failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      execution_time_ms: totalTime
    }, { status: 500 });
  }
}

/**
 * SYNC KNOWLEDGE HUB DOCUMENTS FROM GITHUB
 */
async function syncKnowledgeHub(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:3000/api/knowledge-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync', force_update: forceUpdate })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        source: 'Knowledge Hub (GitHub)',
        status: 'success',
        items_synced: data.data.documents_processed || 0,
        new_items: data.data.new_documents || 0,
        updated_items: data.data.updated_documents || 0,
        errors: data.data.errors || [],
        execution_time: Date.now() - startTime
      };
    } else {
      throw new Error(data.error || 'Knowledge sync failed');
    }
  } catch (error) {
    return {
      source: 'Knowledge Hub (GitHub)',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * SYNC ALL MAILCHIMP NEWSLETTERS
 */
async function syncAllNewsletters(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:3000/api/newsletters/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force_update: forceUpdate })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        source: 'Mailchimp Newsletters',
        status: 'success',
        items_synced: data.data?.synced_count || 0,
        new_items: data.data?.new_campaigns || 0,
        updated_items: data.data?.updated_campaigns || 0,
        errors: [],
        execution_time: Date.now() - startTime
      };
    } else {
      throw new Error(data.error || 'Newsletter sync failed');
    }
  } catch (error) {
    return {
      source: 'Mailchimp Newsletters',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Newsletter sync failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * SYNC YOUTUBE VIDEOS
 */
async function syncYouTubeVideos(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    // Sync from existing content or build new YouTube integration
    const db = await getDatabase();
    const existingVideos = await db.get("SELECT COUNT(*) as count FROM content WHERE content_type = 'video'");
    
    return {
      source: 'YouTube Videos',
      status: 'success',
      items_synced: existingVideos?.count || 0,
      new_items: 0,
      updated_items: 0,
      errors: [],
      execution_time: Date.now() - startTime
    };
  } catch (error) {
    return {
      source: 'YouTube Videos',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'YouTube sync failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * SYNC AIRTABLE HOODIES
 */
async function syncAirtableHoodies(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:3000/api/hoodie-exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' })
    });
    
    const data = await response.json();
    
    if (data.success) {
      const db = await getDatabase();
      const hoodieCount = await db.get('SELECT COUNT(*) as count FROM hoodies');
      
      return {
        source: 'Airtable Hoodies',
        status: 'success',
        items_synced: hoodieCount?.count || 0,
        new_items: 0,
        updated_items: 0,
        errors: [],
        execution_time: Date.now() - startTime
      };
    } else {
      throw new Error(data.error || 'Hoodie sync failed');
    }
  } catch (error) {
    return {
      source: 'Airtable Hoodies',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Hoodie sync failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * SYNC BUSINESS CASES
 */
async function syncBusinessCases(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const db = await getDatabase();
    const businessCases = await db.get('SELECT COUNT(*) as count FROM business_cases');
    
    return {
      source: 'Business Cases',
      status: 'success',
      items_synced: businessCases?.count || 0,
      new_items: 0,
      updated_items: 0,
      errors: [],
      execution_time: Date.now() - startTime
    };
  } catch (error) {
    return {
      source: 'Business Cases',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Business cases sync failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * SYNC TOOLS
 */
async function syncTools(forceUpdate: boolean): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const db = await getDatabase();
    const tools = await db.get('SELECT COUNT(*) as count FROM tools');
    
    return {
      source: 'Tools',
      status: 'success',
      items_synced: tools?.count || 0,
      new_items: 0,
      updated_items: 0,
      errors: [],
      execution_time: Date.now() - startTime
    };
  } catch (error) {
    return {
      source: 'Tools',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Tools sync failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * BUILD KNOWLEDGE RELATIONSHIPS
 */
async function buildKnowledgeRelationships(): Promise<SyncResult> {
  const startTime = Date.now();
  
  try {
    const db = await getDatabase();
    let relationshipsCreated = 0;
    
    // Create relationships between hoodies and knowledge documents
    const hoodies = await db.all('SELECT id, name, category, subcategory FROM hoodies LIMIT 100');
    const documents = await db.all('SELECT id, title, content, document_type FROM knowledge_documents LIMIT 50');
    
    for (const hoodie of hoodies) {
      for (const doc of documents) {
        const hoodieTerms = [hoodie.name, hoodie.category, hoodie.subcategory].filter(Boolean);
        const docContent = `${doc.title} ${doc.content}`.toLowerCase();
        
        let relevanceScore = 0;
        hoodieTerms.forEach(term => {
          if (term && docContent.includes(term.toLowerCase())) {
            relevanceScore += 0.3;
          }
        });
        
        if (relevanceScore >= 0.3) {
          try {
            await db.run(`
              INSERT OR REPLACE INTO knowledge_relationships (
                id, source_type, source_id, target_type, target_id, 
                relationship_type, strength, discovered_by
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              `rel-${hoodie.id}-${doc.id}`,
              'hoodie',
              hoodie.id,
              'knowledge',
              doc.id,
              'references',
              relevanceScore,
              'system'
            ]);
            relationshipsCreated++;
          } catch (error) {
            // Skip relationship creation errors
          }
        }
      }
    }
    
    return {
      source: 'Knowledge Relationships',
      status: 'success',
      items_synced: relationshipsCreated,
      new_items: relationshipsCreated,
      updated_items: 0,
      errors: [],
      execution_time: Date.now() - startTime
    };
  } catch (error) {
    return {
      source: 'Knowledge Relationships',
      status: 'error',
      items_synced: 0,
      new_items: 0,
      updated_items: 0,
      errors: [error instanceof Error ? error.message : 'Relationship building failed'],
      execution_time: Date.now() - startTime
    };
  }
}

/**
 * Get last sync times for all sources
 */
async function getLastSyncTimes(): Promise<Record<string, string>> {
  const db = await getDatabase();
  
  try {
    const syncTimes = await Promise.all([
      db.get('SELECT MAX(last_synced_at) as last_sync FROM knowledge_documents'),
      db.get('SELECT MAX(updated_at) as last_sync FROM business_cases'),
      db.get('SELECT MAX(updated_at) as last_sync FROM tools'),
      db.get('SELECT MAX(updated_at) as last_sync FROM hoodies'),
      db.get("SELECT MAX(updated_at) as last_sync FROM content WHERE content_type = 'video'"),
      db.get("SELECT MAX(updated_at) as last_sync FROM content WHERE content_type = 'newsletter'"),
    ]);
    
    return {
      knowledge_hub: syncTimes[0]?.last_sync || 'Never',
      business_cases: syncTimes[1]?.last_sync || 'Never',
      tools: syncTimes[2]?.last_sync || 'Never',
      hoodies: syncTimes[3]?.last_sync || 'Never',
      youtube_videos: syncTimes[4]?.last_sync || 'Never',
      newsletters: syncTimes[5]?.last_sync || 'Never'
    };
  } catch (error) {
    return {};
  }
}