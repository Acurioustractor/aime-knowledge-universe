/**
 * Database Performance Optimization Script
 * 
 * Adds indexes and optimizations to improve search performance
 * across the AIME Knowledge Universe database
 */

import { getDatabase } from '../database/connection';

interface IndexDefinition {
  table: string;
  name: string;
  columns: string[];
  unique?: boolean;
  description: string;
}

/**
 * Performance indexes for search optimization
 */
const SEARCH_INDEXES: IndexDefinition[] = [
  // Knowledge Documents Indexes
  {
    table: 'knowledge_documents',
    name: 'idx_knowledge_title_search',
    columns: ['title'],
    description: 'Fast title searches in knowledge documents'
  },
  {
    table: 'knowledge_documents',
    name: 'idx_knowledge_type_validation',
    columns: ['document_type', 'validation_status'],
    description: 'Filter by document type and validation status'
  },
  {
    table: 'knowledge_documents',
    name: 'idx_knowledge_updated',
    columns: ['updated_at', 'created_at'],
    description: 'Sort by recency for knowledge documents'
  },
  
  // Knowledge Chunks Indexes
  {
    table: 'knowledge_chunks',
    name: 'idx_chunks_document_index',
    columns: ['document_id', 'chunk_index'],
    description: 'Fast chunk retrieval by document and order'
  },
  {
    table: 'knowledge_chunks',
    name: 'idx_chunks_type',
    columns: ['chunk_type'],
    description: 'Filter chunks by type (heading, content, etc.)'
  },
  
  // Business Cases Indexes
  {
    table: 'business_cases',
    name: 'idx_business_title_category',
    columns: ['title', 'category'],
    description: 'Search business cases by title and category'
  },
  {
    table: 'business_cases',
    name: 'idx_business_updated',
    columns: ['updated_at'],
    description: 'Sort business cases by recency'
  },
  
  // Tools Indexes
  {
    table: 'tools',
    name: 'idx_tools_title',
    columns: ['title'],
    description: 'Fast title searches for tools'
  },
  {
    table: 'tools',
    name: 'idx_tools_updated',
    columns: ['updated_at'],
    description: 'Sort tools by recency'
  },
  
  // Content Indexes
  {
    table: 'content',
    name: 'idx_content_type_category',
    columns: ['content_type', 'category'],
    description: 'Filter content by type and category'
  },
  {
    table: 'content',
    name: 'idx_content_title',
    columns: ['title'],
    description: 'Fast title searches for content'
  },
  {
    table: 'content',
    name: 'idx_content_updated',
    columns: ['updated_at'],
    description: 'Sort content by recency'
  },
  
  // Hoodies Indexes
  {
    table: 'hoodies',
    name: 'idx_hoodies_name',
    columns: ['name'],
    description: 'Fast name searches for hoodies'
  },
  {
    table: 'hoodies',
    name: 'idx_hoodies_category_rarity',
    columns: ['category', 'rarity_level'],
    description: 'Filter hoodies by category and rarity'
  },
  {
    table: 'hoodies',
    name: 'idx_hoodies_impact_value',
    columns: ['base_impact_value'],
    description: 'Sort hoodies by impact value'
  },
  {
    table: 'hoodies',
    name: 'idx_hoodies_tradeable',
    columns: ['is_tradeable', 'category'],
    description: 'Filter tradeable hoodies by category'
  }
];

/**
 * Full-text search indexes (if supported by SQLite)
 */
const FULLTEXT_INDEXES: IndexDefinition[] = [
  {  
    table: 'knowledge_documents',
    name: 'fts_knowledge_content',
    columns: ['title', 'content'],
    description: 'Full-text search for knowledge documents'
  },
  {
    table: 'knowledge_chunks',
    name: 'fts_chunks_content',
    columns: ['chunk_content'],
    description: 'Full-text search for knowledge chunks'
  },
  {
    table: 'business_cases',
    name: 'fts_business_content',
    columns: ['title', 'description', 'content'],
    description: 'Full-text search for business cases'
  }
];

/**
 * Create a single index
 */
async function createIndex(db: any, index: IndexDefinition): Promise<boolean> {
  try {
    const columnList = index.columns.join(', ');
    const uniqueKeyword = index.unique ? 'UNIQUE' : '';
    
    const sql = `CREATE ${uniqueKeyword} INDEX IF NOT EXISTS ${index.name} 
                 ON ${index.table} (${columnList})`;
    
    await db.exec(sql);
    console.log(`✅ Created index: ${index.name} on ${index.table}(${columnList})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create index ${index.name}:`, error);
    return false;
  }
}

/**
 * Create full-text search virtual table
 */
async function createFullTextIndex(db: any, index: IndexDefinition): Promise<boolean> {
  try {
    const columnList = index.columns.join(', ');
    
    // Create FTS virtual table
    const ftsTableName = `${index.table}_fts`;
    const sql = `CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsTableName} 
                 USING fts5(${columnList}, content='${index.table}')`;
    
    await db.exec(sql);
    
    // Populate FTS table
    const populateSql = `INSERT INTO ${ftsTableName}(${ftsTableName}) VALUES('rebuild')`;
    await db.exec(populateSql);
    
    console.log(`✅ Created FTS index: ${ftsTableName} for full-text search`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create FTS index ${index.name}:`, error);
    return false;
  }
}

/**
 * Analyze table statistics for query optimization
 */
async function analyzeDatabase(db: any): Promise<void> {
  try {
    console.log('📊 Analyzing database statistics...');
    
    const tables = [
      'knowledge_documents', 'knowledge_chunks', 'business_cases', 
      'tools', 'content', 'hoodies'
    ];
    
    for (const table of tables) {
      try {
        await db.exec(`ANALYZE ${table}`);
        console.log(`✅ Analyzed table: ${table}`);
      } catch (error) {
        console.warn(`⚠️ Could not analyze table ${table}:`, error);
      }
    }
    
    // Update global statistics
    await db.exec('ANALYZE');
    console.log('✅ Updated global database statistics');
    
  } catch (error) {
    console.error('❌ Failed to analyze database:', error);
  }
}

/**
 * Check current database performance settings
 */
async function checkDatabaseSettings(db: any): Promise<void> {
  try {
    console.log('⚙️ Checking database performance settings...');
    
    const settings = [
      'journal_mode',
      'synchronous', 
      'cache_size',
      'temp_store',
      'mmap_size'
    ];
    
    for (const setting of settings) {
      try {
        const result = await db.get(`PRAGMA ${setting}`);
        const value = result ? Object.values(result)[0] : 'unknown';
        console.log(`  ${setting}: ${value}`);
      } catch (error) {
        console.warn(`  Could not check ${setting}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to check database settings:', error);
  }
}

/**
 * Optimize database performance settings
 */
async function optimizeDatabaseSettings(db: any): Promise<void> {
  try {
    console.log('🚀 Optimizing database performance settings...');
    
    // WAL mode for better concurrent access
    await db.exec('PRAGMA journal_mode = WAL');
    console.log('✅ Set journal mode to WAL');
    
    // Increase cache size (in KB)
    await db.exec('PRAGMA cache_size = -64000'); // 64MB
    console.log('✅ Increased cache size to 64MB');
    
    // Use memory for temporary storage
    await db.exec('PRAGMA temp_store = MEMORY');
    console.log('✅ Set temporary storage to memory');
    
    // Enable memory-mapped I/O (256MB)
    await db.exec('PRAGMA mmap_size = 268435456');
    console.log('✅ Enabled memory-mapped I/O (256MB)');
    
    // Optimize synchronous mode for performance
    await db.exec('PRAGMA synchronous = NORMAL');
    console.log('✅ Set synchronous mode to NORMAL');
    
  } catch (error) {
    console.error('❌ Failed to optimize database settings:', error);
  }
}

/**
 * Get database table statistics
 */
async function getTableStatistics(db: any): Promise<void> {
  try {
    console.log('📈 Database table statistics:');
    
    const tables = [
      'knowledge_documents', 'knowledge_chunks', 'business_cases',
      'tools', 'content', 'hoodies'
    ];
    
    const stats = [];
    
    for (const table of tables) {
      try {
        const count = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
        const size = await db.get(`
          SELECT 
            COUNT(*) * AVG(LENGTH(CAST(* AS TEXT))) / 1024 as size_kb 
          FROM ${table}
        `);
        
        stats.push({
          table,
          rows: count.count,
          size_kb: Math.round(size.size_kb || 0)
        });
      } catch (error) {
        stats.push({ table, rows: 'error', size_kb: 'error' });
      }
    }
    
    console.table(stats);
    
  } catch (error) {
    console.error('❌ Failed to get table statistics:', error);
  }
}

/**
 * Main optimization function
 */
async function optimizeDatabase(): Promise<void> {
  try {
    console.log('🚀 Starting database optimization...');
    const startTime = Date.now();
    
    const db = await getDatabase();
    
    // Check current settings
    await checkDatabaseSettings(db);
    
    // Get initial statistics
    await getTableStatistics(db);
    
    // Optimize settings
    await optimizeDatabaseSettings(db);
    
    // Create search indexes
    console.log('📝 Creating search performance indexes...');
    let indexCount = 0;
    
    for (const index of SEARCH_INDEXES) {
      const success = await createIndex(db, index);
      if (success) indexCount++;
    }
    
    // Create full-text search indexes if supported
    console.log('🔍 Creating full-text search indexes...');
    let ftsCount = 0;
    
    for (const index of FULLTEXT_INDEXES) {
      const success = await createFullTextIndex(db, index);
      if (success) ftsCount++;
    }
    
    // Analyze database for query optimization
    await analyzeDatabase(db);
    
    // Final statistics
    await getTableStatistics(db);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('✅ Database optimization complete!');
    console.log(`📊 Created ${indexCount} regular indexes`);
    console.log(`🔍 Created ${ftsCount} full-text search indexes`);
    console.log(`⏱️ Total time: ${duration} seconds`);
    
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    throw error;
  }
}

/**
 * Export for use in other modules
 */
export { optimizeDatabase, createIndex, analyzeDatabase };

/**
 * Run optimization if this script is executed directly
 */
if (require.main === module) {
  optimizeDatabase()
    .then(() => {
      console.log('🎉 Database optimization complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Optimization failed:', error);
      process.exit(1);
    });
}