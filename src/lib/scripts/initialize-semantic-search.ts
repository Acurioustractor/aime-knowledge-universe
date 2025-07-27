/**
 * Initialize Semantic Search Engine with AIME Content
 * 
 * This script populates the semantic search engine with all content
 * from the AIME database for enhanced semantic similarity calculations
 */

import { getDatabase } from '../database/connection';
import { initializeSemanticSearch } from '../semantic-search';

interface ContentDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

/**
 * Gather all content from the AIME database
 */
async function gatherAllContent(): Promise<ContentDocument[]> {
  const db = await getDatabase();
  const documents: ContentDocument[] = [];
  
  console.log('📚 Gathering content from knowledge documents...');
  const knowledgeDocs = await db.all(`
    SELECT id, title, content, document_type, metadata, validation_status
    FROM knowledge_documents
    WHERE validation_status = 'approved' OR validation_status IS NULL
    ORDER BY updated_at DESC
  `);
  
  knowledgeDocs.forEach(doc => {
    documents.push({
      id: `knowledge_${doc.id}`,
      content: `${doc.title}\n\n${doc.content}`,
      metadata: {
        type: 'knowledge',
        document_type: doc.document_type,
        title: doc.title,
        validation_status: doc.validation_status,
        ...JSON.parse(doc.metadata || '{}')
      }
    });
  });
  
  console.log('💼 Gathering business cases...');
  const businessCases = await db.all(`
    SELECT id, title, description, content, category
    FROM business_cases
    ORDER BY updated_at DESC
  `);
  
  businessCases.forEach(bc => {
    documents.push({
      id: `business_case_${bc.id}`,
      content: `${bc.title}\n\n${bc.description}\n\n${bc.content}`,
      metadata: {
        type: 'business_case',
        title: bc.title,
        category: bc.category
      }
    });
  });
  
  console.log('🛠️ Gathering tools...');
  const tools = await db.all(`
    SELECT id, title, description, tags, themes, topics
    FROM tools
    ORDER BY updated_at DESC
  `);
  
  tools.forEach(tool => {
    documents.push({
      id: `tool_${tool.id}`,
      content: `${tool.title}\n\n${tool.description}`,
      metadata: {
        type: 'tool',
        title: tool.title,
        tags: JSON.parse(tool.tags || '[]'),
        themes: JSON.parse(tool.themes || '[]'),
        topics: JSON.parse(tool.topics || '[]')
      }
    });
  });
  
  console.log('🎥 Gathering video content...');
  const videos = await db.all(`
    SELECT id, title, description, category, tags, themes, topics
    FROM content
    WHERE content_type = 'video'
    ORDER BY updated_at DESC
  `);
  
  videos.forEach(video => {
    documents.push({
      id: `video_${video.id}`,
      content: `${video.title}\n\n${video.description}`,
      metadata: {
        type: 'video',
        title: video.title,
        category: video.category,
        tags: JSON.parse(video.tags || '[]'),
        themes: JSON.parse(video.themes || '[]'),
        topics: JSON.parse(video.topics || '[]')
      }
    });
  });
  
  console.log('👕 Gathering hoodie information...');
  const hoodies = await db.all(`
    SELECT id, name, description, category, subcategory, rarity_level
    FROM hoodies
    ORDER BY base_impact_value DESC
  `);
  
  hoodies.forEach(hoodie => {
    const content = hoodie.description ? 
      `${hoodie.name}\n\n${hoodie.description}` : 
      `${hoodie.name}\n\n${hoodie.rarity_level} ${hoodie.category} hoodie in ${hoodie.subcategory}`;
      
    documents.push({
      id: `hoodie_${hoodie.id}`,
      content,
      metadata: {
        type: 'hoodie',
        name: hoodie.name,
        category: hoodie.category,
        subcategory: hoodie.subcategory,
        rarity_level: hoodie.rarity_level
      }
    });
  });
  
  console.log('📰 Gathering additional content...');
  const additionalContent = await db.all(`
    SELECT id, title, description, content_type, category
    FROM content
    WHERE content_type NOT IN ('video')
    ORDER BY updated_at DESC
  `);
  
  additionalContent.forEach(item => {
    documents.push({
      id: `content_${item.id}`,
      content: `${item.title}\n\n${item.description}`,
      metadata: {
        type: 'content',
        title: item.title,
        content_type: item.content_type,
        category: item.category
      }
    });
  });
  
  console.log('📚 Gathering knowledge chunks...');
  const chunks = await db.all(`
    SELECT c.id, c.chunk_content, c.chunk_type, c.concepts,
           d.title as document_title, d.id as document_id
    FROM knowledge_chunks c
    JOIN knowledge_documents d ON c.document_id = d.id
    WHERE d.validation_status = 'approved' OR d.validation_status IS NULL
    ORDER BY c.chunk_index ASC
    LIMIT 1000
  `);
  
  chunks.forEach(chunk => {
    documents.push({
      id: `chunk_${chunk.id}`,
      content: chunk.chunk_content,
      metadata: {
        type: 'knowledge_chunk',
        chunk_type: chunk.chunk_type,
        concepts: JSON.parse(chunk.concepts || '[]'),
        parent_document: chunk.document_id,
        parent_title: chunk.document_title
      }
    });
  });
  
  return documents;
}

/**
 * Main initialization function
 */
async function initializeSemanticSearchEngine() {
  try {
    console.log('🚀 Starting semantic search initialization...');
    
    const startTime = Date.now();
    const documents = await gatherAllContent();
    
    console.log(`📄 Collected ${documents.length} documents from database`);
    
    // Initialize the semantic search engine
    const engine = await initializeSemanticSearch(documents);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log(`✅ Semantic search engine initialized successfully!`);
    console.log(`⏱️ Total time: ${duration} seconds`);
    console.log(`📊 Processed ${documents.length} documents`);
    
    // Test the engine with a sample query
    console.log('🧪 Testing semantic search...');
    const testResults = engine.findSimilar('indigenous knowledge systems', 
      documents.slice(0, 50).map(d => d.id), 5);
    console.log(`Found ${testResults.length} semantically similar results for test query`);
    
    return engine;
    
  } catch (error) {
    console.error('❌ Failed to initialize semantic search:', error);
    throw error;
  }
}

/**
 * Export for use in other modules
 */
export { initializeSemanticSearchEngine, gatherAllContent };

/**
 * Run initialization if this script is executed directly
 */
if (require.main === module) {
  initializeSemanticSearchEngine()
    .then(() => {
      console.log('🎉 Semantic search initialization complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}