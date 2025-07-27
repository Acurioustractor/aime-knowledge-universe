/**
 * AIME Knowledge Hub Sync API
 * 
 * Syncs documents from the AIME Knowledge Hub GitHub repository
 * into the local knowledge management system
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';
import { AIMEKnowledgeHubIntegration, KnowledgeDocument, KnowledgeChunk } from '@/lib/integrations/github-knowledge-hub';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for sync operations

// GET /api/knowledge-sync - Check sync status and available documents
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get current knowledge status
    const documentsCount = await db.get('SELECT COUNT(*) as count FROM knowledge_documents');
    const chunksCount = await db.get('SELECT COUNT(*) as count FROM knowledge_chunks');
    const validationsCount = await db.get('SELECT COUNT(*) as count FROM knowledge_validations');
    
    const recentDocuments = await db.all(`
      SELECT id, title, document_type, validation_status, last_synced_at 
      FROM knowledge_documents 
      ORDER BY last_synced_at DESC 
      LIMIT 10
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          documents: documentsCount.count,
          chunks: chunksCount.count,
          validations: validationsCount.count
        },
        recent_documents: recentDocuments,
        sync_status: 'ready'
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to get knowledge sync status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get sync status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/knowledge-sync - Sync documents from GitHub
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'sync';
    
    console.log(`🔄 Starting knowledge sync action: ${action}`);
    
    switch (action) {
      case 'sync': {
        const result = await syncAllDocuments(body.force_update || false);
        return NextResponse.json({
          success: true,
          data: result,
          message: `Successfully synced ${result.documents_processed} documents`
        });
      }
      
      case 'validate': {
        const { document_id, chunk_id, validator_info } = body;
        const result = await addValidation(document_id, chunk_id, validator_info);
        return NextResponse.json({
          success: true,
          data: result,
          message: 'Validation added successfully'
        });
      }
      
      case 'search': {
        const { query, filters } = body;
        const results = await searchKnowledge(query, filters);
        return NextResponse.json({
          success: true,
          data: results
        });
      }
      
      case 'analyze': {
        const analysis = await analyzeKnowledgeBase();
        return NextResponse.json({
          success: true,
          data: analysis
        });
      }
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Knowledge sync failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Knowledge sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Sync all documents from AIME Knowledge Hub GitHub repository
 */
async function syncAllDocuments(forceUpdate: boolean = false): Promise<{
  documents_processed: number;
  chunks_created: number;
  new_documents: number;
  updated_documents: number;
  errors: string[];
}> {
  console.log('📚 Starting AIME Knowledge Hub document sync...');
  
  const db = await getDatabase();
  const integration = new AIMEKnowledgeHubIntegration();
  
  let documentsProcessed = 0;
  let chunksCreated = 0;
  let newDocuments = 0;
  let updatedDocuments = 0;
  const errors: string[] = [];
  
  try {
    // Fetch all documents from GitHub
    const documents = await integration.fetchAllDocuments();
    console.log(`📥 Retrieved ${documents.length} documents from GitHub`);
    
    for (const document of documents) {
      try {
        // Check if document already exists
        const existing = await db.get(
          'SELECT id, github_sha, updated_at FROM knowledge_documents WHERE github_path = ?',
          [document.github_path]
        );
        
        let shouldUpdate = forceUpdate;
        if (!existing) {
          shouldUpdate = true;
          newDocuments++;
        } else if (existing.github_sha !== document.metadata.sha) {
          shouldUpdate = true;
          updatedDocuments++;
        }
        
        if (shouldUpdate) {
          // Insert or update document
          await db.run(`
            INSERT OR REPLACE INTO knowledge_documents (
              id, github_path, github_sha, title, content, markdown_content,
              document_type, metadata, validation_status, cultural_sensitivity_level,
              updated_at, last_synced_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [
            document.id,
            document.github_path,
            document.metadata.sha || '',
            document.title,
            document.content,
            document.markdown_content,
            document.document_type,
            JSON.stringify(document.metadata),
            'pending',
            determineCulturalSensitivity(document)
          ]);
          
          // Delete existing chunks for this document
          await db.run('DELETE FROM knowledge_chunks WHERE document_id = ?', [document.id]);
          
          // Insert chunks
          for (const chunk of document.chunks) {
            await db.run(`
              INSERT INTO knowledge_chunks (
                id, document_id, chunk_index, chunk_content, chunk_type,
                concepts, relationships, validation_scores
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              chunk.id,
              document.id,
              chunk.chunk_index,
              chunk.chunk_content,
              chunk.chunk_type,
              JSON.stringify(chunk.concepts),
              JSON.stringify(chunk.relationships),
              JSON.stringify(chunk.validation_scores)
            ]);
            chunksCreated++;
          }
          
          // Auto-connect to relevant hoodies
          await connectDocumentToHoodies(db, document);
          
          documentsProcessed++;
          console.log(`✅ Processed: ${document.title}`);
        } else {
          console.log(`⏭️ Skipped (no changes): ${document.title}`);
        }
        
      } catch (error) {
        const errorMsg = `Failed to process document ${document.title}: ${error}`;
        console.error('❌', errorMsg);
        errors.push(errorMsg);
      }
    }
    
    console.log(`🎉 Knowledge sync completed: ${documentsProcessed} documents processed`);
    
  } catch (error) {
    const errorMsg = `Knowledge sync failed: ${error}`;
    console.error('❌', errorMsg);
    errors.push(errorMsg);
  }
  
  return {
    documents_processed: documentsProcessed,
    chunks_created: chunksCreated,
    new_documents: newDocuments,
    updated_documents: updatedDocuments,
    errors
  };
}

/**
 * Add a validation to a knowledge chunk
 */
async function addValidation(documentId: string, chunkId: string, validatorInfo: {
  validator_id: string;
  validator_type: 'staff' | 'community' | 'elder' | 'expert' | 'ai';
  validator_name?: string;
  vote_score: -1 | 0 | 1;
  confidence_level?: number;
  rationale?: string;
  cultural_considerations?: string;
}): Promise<{ validation_id: string }> {
  const db = await getDatabase();
  
  const validationId = `validation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await db.run(`
    INSERT INTO knowledge_validations (
      id, chunk_id, document_id, validator_id, validator_type, validator_name,
      vote_score, confidence_level, rationale, cultural_considerations
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    validationId,
    chunkId || null,
    documentId,
    validatorInfo.validator_id,
    validatorInfo.validator_type,
    validatorInfo.validator_name || null,
    validatorInfo.vote_score,
    validatorInfo.confidence_level || 0.5,
    validatorInfo.rationale || null,
    validatorInfo.cultural_considerations || null
  ]);
  
  // Update chunk validation scores
  await updateChunkValidationScores(db, chunkId);
  
  return { validation_id: validationId };
}

/**
 * Search knowledge base
 */
async function searchKnowledge(query: string, filters?: {
  document_type?: string;
  validation_status?: string;
  cultural_sensitivity?: string;
}): Promise<{
  documents: any[];
  chunks: any[];
  total_results: number;
}> {
  const db = await getDatabase();
  
  let whereClause = 'WHERE (d.title LIKE ? OR d.content LIKE ? OR c.chunk_content LIKE ?)';
  const params = [`%${query}%`, `%${query}%`, `%${query}%`];
  
  if (filters?.document_type) {
    whereClause += ' AND d.document_type = ?';
    params.push(filters.document_type);
  }
  
  if (filters?.validation_status) {
    whereClause += ' AND d.validation_status = ?';
    params.push(filters.validation_status);
  }
  
  if (filters?.cultural_sensitivity) {
    whereClause += ' AND d.cultural_sensitivity_level = ?';
    params.push(filters.cultural_sensitivity);
  }
  
  const results = await db.all(`
    SELECT 
      d.id as document_id, d.title, d.document_type, d.validation_status,
      c.id as chunk_id, c.chunk_content, c.chunk_type, c.concepts
    FROM knowledge_documents d
    LEFT JOIN knowledge_chunks c ON d.id = c.document_id
    ${whereClause}
    ORDER BY d.updated_at DESC, c.chunk_index ASC
    LIMIT 50
  `, params);
  
  const documents = new Map();
  const chunks = [];
  
  results.forEach(row => {
    if (!documents.has(row.document_id)) {
      documents.set(row.document_id, {
        id: row.document_id,
        title: row.title,
        document_type: row.document_type,
        validation_status: row.validation_status,
        chunks: []
      });
    }
    
    if (row.chunk_id) {
      const chunk = {
        id: row.chunk_id,
        content: row.chunk_content,
        type: row.chunk_type,
        concepts: JSON.parse(row.concepts || '[]')
      };
      
      documents.get(row.document_id).chunks.push(chunk);
      chunks.push({
        ...chunk,
        document_id: row.document_id,
        document_title: row.title
      });
    }
  });
  
  return {
    documents: Array.from(documents.values()),
    chunks,
    total_results: results.length
  };
}

/**
 * Analyze knowledge base for insights
 */
async function analyzeKnowledgeBase(): Promise<{
  document_types: Record<string, number>;
  validation_distribution: Record<string, number>;
  top_concepts: Array<{ concept: string; frequency: number }>;
  knowledge_coverage: any;
}> {
  const db = await getDatabase();
  
  // Document type distribution
  const docTypes = await db.all(`
    SELECT document_type, COUNT(*) as count 
    FROM knowledge_documents 
    GROUP BY document_type 
    ORDER BY count DESC
  `);
  
  // Validation status distribution
  const validationDist = await db.all(`
    SELECT validation_status, COUNT(*) as count 
    FROM knowledge_documents 
    GROUP BY validation_status
  `);
  
  // Top concepts across all chunks
  const conceptsData = await db.all(`
    SELECT concepts FROM knowledge_chunks WHERE concepts IS NOT NULL
  `);
  
  const conceptFrequency: Record<string, number> = {};
  conceptsData.forEach(row => {
    try {
      const concepts = JSON.parse(row.concepts);
      concepts.forEach((concept: string) => {
        conceptFrequency[concept] = (conceptFrequency[concept] || 0) + 1;
      });
    } catch (error) {
      // Skip invalid JSON
    }
  });
  
  const topConcepts = Object.entries(conceptFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([concept, frequency]) => ({ concept, frequency }));
  
  return {
    document_types: Object.fromEntries(docTypes.map(d => [d.document_type, d.count])),
    validation_distribution: Object.fromEntries(validationDist.map(v => [v.validation_status, v.count])),
    top_concepts: topConcepts,
    knowledge_coverage: {
      total_documents: docTypes.reduce((sum, d) => sum + d.count, 0),
      total_concepts: Object.keys(conceptFrequency).length,
      avg_concepts_per_document: topConcepts.length > 0 ? 
        topConcepts.reduce((sum, c) => sum + c.frequency, 0) / topConcepts.length : 0
    }
  };
}

/**
 * Determine cultural sensitivity level of a document
 */
function determineCulturalSensitivity(document: KnowledgeDocument): string {
  const content = document.content.toLowerCase();
  const title = document.title.toLowerCase();
  
  // Check for indigenous/cultural content
  if (
    content.includes('indigenous') || content.includes('elder') || 
    content.includes('cultural') || content.includes('sacred') ||
    content.includes('ceremony') || content.includes('tradition') ||
    title.includes('elder') || title.includes('indigenous')
  ) {
    return 'community'; // Requires community validation
  }
  
  // Check for sensitive processes
  if (
    content.includes('validation') || content.includes('verification') ||
    document.document_type === 'process' || document.document_type === 'methodology'
  ) {
    return 'restricted'; // Staff/expert only
  }
  
  return 'public'; // Publicly accessible
}

/**
 * Connect a document to relevant hoodies based on content analysis
 */
async function connectDocumentToHoodies(db: any, document: KnowledgeDocument): Promise<void> {
  const content = document.content.toLowerCase();
  const concepts = document.chunks.flatMap(chunk => chunk.concepts).map(c => c.toLowerCase());
  
  // Get existing hoodies
  const hoodies = await db.all('SELECT id, name, category, subcategory FROM hoodies');
  
  for (const hoodie of hoodies) {
    let relevanceScore = 0;
    const hoodieTerms = [
      hoodie.name.toLowerCase(),
      hoodie.category.toLowerCase(),
      hoodie.subcategory?.toLowerCase()
    ].filter(Boolean);
    
    // Check for direct matches
    hoodieTerms.forEach(term => {
      if (content.includes(term) || concepts.includes(term)) {
        relevanceScore += 0.5;
      }
    });
    
    // Check for concept overlap
    const overlapCount = concepts.filter(concept => 
      hoodieTerms.some(term => term.includes(concept) || concept.includes(term))
    ).length;
    
    relevanceScore += overlapCount * 0.2;
    
    // Create connection if relevance is high enough
    if (relevanceScore >= 0.3) {
      const requirementId = `req-${hoodie.id}-${document.id}`;
      
      await db.run(`
        INSERT OR REPLACE INTO hoodie_knowledge_requirements (
          id, hoodie_id, document_id, requirement_type, validation_threshold
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        requirementId,
        hoodie.id,
        document.id,
        'engagement',
        0.6 // Require 60% validation consensus
      ]);
    }
  }
}

/**
 * Update chunk validation scores based on all validations
 */
async function updateChunkValidationScores(db: any, chunkId: string): Promise<void> {
  if (!chunkId) return;
  
  const validations = await db.all(`
    SELECT validator_type, vote_score, confidence_level 
    FROM knowledge_validations 
    WHERE chunk_id = ?
  `, [chunkId]);
  
  const scores: Record<string, number> = {};
  
  validations.forEach(validation => {
    const weight = validation.confidence_level || 0.5;
    const score = validation.vote_score * weight;
    
    if (!scores[validation.validator_type]) {
      scores[validation.validator_type] = [];
    }
    scores[validation.validator_type].push(score);
  });
  
  // Calculate average scores per validator type
  const avgScores: Record<string, number> = {};
  Object.entries(scores).forEach(([type, scoreArray]) => {
    avgScores[type] = scoreArray.reduce((sum, score) => sum + score, 0) / scoreArray.length;
  });
  
  // Calculate overall consensus
  const allScores = Object.values(avgScores);
  const consensus = allScores.length > 0 ? 
    allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
  
  avgScores.consensus = consensus;
  
  await db.run(`
    UPDATE knowledge_chunks 
    SET validation_scores = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [JSON.stringify(avgScores), chunkId]);
}