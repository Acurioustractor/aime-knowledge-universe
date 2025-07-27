#!/usr/bin/env node

/**
 * SQLite to Supabase Migration Script
 * 
 * Migrates existing data from SQLite to the new Supabase setup
 */

const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SQLITE_PATH = './data/aime-data-lake.db';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials not found in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateData() {
  console.log('🚀 Starting SQLite to Supabase migration...');
  
  try {
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('content_items')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection verified');
    
    // Open SQLite database
    const db = new sqlite3.Database(SQLITE_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('❌ SQLite connection failed:', err);
        return;
      }
      console.log('✅ SQLite connection established');
    });
    
    // Check what tables exist in SQLite
    await checkSQLiteTables(db);
    
    // Migrate content if it exists
    await migrateContent(db);
    
    // Close SQLite connection
    db.close((err) => {
      if (err) {
        console.error('Error closing SQLite:', err);
      } else {
        console.log('✅ SQLite connection closed');
      }
    });
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

function checkSQLiteTables(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('📋 SQLite tables found:');
      rows.forEach(row => console.log(`   - ${row.name}`));
      resolve(rows);
    });
  });
}

function migrateContent(db) {
  return new Promise((resolve, reject) => {
    console.log('📦 Migrating content...');
    
    // Check if content table exists
    db.get(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='content'
    `, async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        console.log('ℹ️  No content table found in SQLite, skipping content migration');
        resolve();
        return;
      }
      
      // Get all content from SQLite
      db.all('SELECT * FROM content LIMIT 100', async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log(`📊 Found ${rows.length} content items to migrate`);
        
        if (rows.length === 0) {
          console.log('ℹ️  No content to migrate');
          resolve();
          return;
        }
        
        // Transform SQLite data to Supabase format
        const transformedData = rows.map(row => ({
          source_id: row.source_id || row.id || `migrated-${Date.now()}-${Math.random()}`,
          source: row.source || 'sqlite_migration',
          content_type: row.content_type || determineContentType(row),
          title: row.title || 'Untitled',
          description: row.description || row.summary || null,
          content: row.content || row.transcript || null,
          url: row.url || row.link || null,
          thumbnail_url: row.thumbnail_url || row.thumbnail || null,
          
          // Enhanced fields with defaults
          philosophy_domain: row.philosophy_domain || null,
          complexity_level: row.complexity_level || 1,
          prerequisite_concepts: row.prerequisite_concepts || [],
          learning_objectives: row.learning_objectives || [],
          
          metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : {},
          tags: row.tags ? (Array.isArray(row.tags) ? row.tags : row.tags.split(',')) : [],
          categories: row.categories ? (Array.isArray(row.categories) ? row.categories : row.categories.split(',')) : [],
          authors: row.authors ? (Array.isArray(row.authors) ? row.authors : row.authors.split(',')) : [],
          themes: row.themes ? (Array.isArray(row.themes) ? row.themes : row.themes.split(',')) : [],
          key_concepts: row.key_concepts ? (Array.isArray(row.key_concepts) ? row.key_concepts : row.key_concepts.split(',')) : [],
          
          quality_score: row.quality_score || 0.5,
          engagement_score: row.engagement_score || 0,
          view_count: row.view_count || 0,
          implementation_count: row.implementation_count || 0,
          is_featured: row.is_featured || false,
          is_philosophy_primer: row.is_philosophy_primer || false,
          
          source_created_at: row.source_created_at || row.created_at || new Date().toISOString(),
          source_updated_at: row.source_updated_at || row.updated_at || null,
          last_synced_at: new Date().toISOString()
        }));
        
        // Insert in batches of 10
        const batchSize = 10;
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < transformedData.length; i += batchSize) {
          const batch = transformedData.slice(i, i + batchSize);
          
          try {
            const { data, error } = await supabase
              .from('content_items')
              .upsert(batch, { 
                onConflict: 'source,source_id',
                ignoreDuplicates: false 
              });
            
            if (error) {
              console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error);
              errorCount += batch.length;
            } else {
              console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} migrated (${batch.length} items)`);
              successCount += batch.length;
            }
          } catch (batchError) {
            console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, batchError);
            errorCount += batch.length;
          }
        }
        
        console.log(`📊 Migration summary: ${successCount} successful, ${errorCount} failed`);
        resolve();
      });
    });
  });
}

function determineContentType(row) {
  if (row.content_type) return row.content_type;
  if (row.url && row.url.includes('youtube')) return 'video';
  if (row.title && row.title.toLowerCase().includes('tool')) return 'tool';
  if (row.title && row.title.toLowerCase().includes('newsletter')) return 'newsletter';
  if (row.title && row.title.toLowerCase().includes('story')) return 'story';
  return 'research';
}

// Run migration
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };