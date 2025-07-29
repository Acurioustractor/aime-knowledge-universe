/**
 * Framing Documents API
 * 
 * Provides access to processed framing documents, concepts, and relationships
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Load processed framing data with full document content
function loadFramingData() {
  try {
    const dataDir = path.join(process.cwd(), 'docs/processed-framing');
    const framingDocsDir = path.join(process.cwd(), 'docs/Framing_docs');
    
    const documents = JSON.parse(fs.readFileSync(path.join(dataDir, 'documents.json'), 'utf8'));
    const conceptMap = JSON.parse(fs.readFileSync(path.join(dataDir, 'concept-map.json'), 'utf8'));
    const categoryAnalysis = JSON.parse(fs.readFileSync(path.join(dataDir, 'category-analysis.json'), 'utf8'));
    const report = JSON.parse(fs.readFileSync(path.join(dataDir, 'processing-report.json'), 'utf8'));
    
    // Load full document content
    const documentsWithContent = documents.map(doc => {
      try {
        const fullContent = fs.readFileSync(path.join(framingDocsDir, doc.filename), 'utf8');
        return {
          ...doc,
          fullContent,
          summary: generateDocumentSummary(fullContent),
          readingTime: Math.ceil(doc.metadata.wordCount / 200) // Average reading speed
        };
      } catch (error) {
        console.warn(`Could not load content for ${doc.filename}`);
        return doc;
      }
    });
    
    return { documents: documentsWithContent, conceptMap, categoryAnalysis, report };
  } catch (error) {
    console.error('Failed to load framing data:', error);
    return null;
  }
}

// Generate an intelligent summary of the document
function generateDocumentSummary(content: string): string {
  const text = content.trim();
  if (!text) return 'Document summary not available.';
  
  // Clean and prepare text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const words = cleanText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const wordCount = words.length;
  
  // AIME-specific concepts and themes
  const aimeConcepts = {
    'indigenous wisdom': ['indigenous', 'wisdom', 'traditional', 'cultural', 'ancestral'],
    'systems thinking': ['systems', 'transformation', 'change', 'holistic', 'interconnected'],
    'mentoring': ['mentoring', 'mentor', 'mentee', 'guidance', 'relationship'],
    'hoodie economics': ['hoodie', 'economics', 'relational', 'value', 'reciprocity'],
    'imagination': ['imagination', 'creative', 'innovative', 'visionary', 'possibility'],
    'community': ['community', 'collective', 'together', 'network', 'connection'],
    'seven-generation': ['seven-generation', 'future', 'sustainability', 'legacy', 'generations'],
    'joy corps': ['joy', 'corps', 'transformation', 'organizational', 'culture'],
    'imagi-nation': ['imagi-nation', 'vision', 'movement', 'global', 'initiative']
  };
  
  // Identify key themes in the document
  const detectedThemes = [];
  for (const [theme, keywords] of Object.entries(aimeConcepts)) {
    const themeScore = keywords.reduce((score, keyword) => {
      const occurrences = (cleanText.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
      return score + occurrences;
    }, 0);
    
    if (themeScore > 0) {
      detectedThemes.push({ theme, score: themeScore });
    }
  }
  
  // Sort themes by relevance
  detectedThemes.sort((a, b) => b.score - a.score);
  const primaryThemes = detectedThemes.slice(0, 3).map(t => t.theme);
  
  // Find the most important sentences based on:
  // 1. Contains multiple AIME concepts
  // 2. Is in the first or last 20% of the document
  // 3. Contains action words or impact statements
  const impactWords = ['transform', 'create', 'build', 'develop', 'implement', 'achieve', 'establish', 'demonstrate', 'enable', 'support'];
  
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    const sentenceLower = sentence.toLowerCase();
    
    // Position scoring (beginning and end are important)
    const position = index / sentences.length;
    if (position < 0.2 || position > 0.8) score += 2;
    
    // AIME concept scoring
    const conceptCount = Object.values(aimeConcepts).flat().reduce((count, keyword) => {
      return count + (sentenceLower.includes(keyword) ? 1 : 0);
    }, 0);
    score += conceptCount * 3;
    
    // Impact word scoring
    const impactCount = impactWords.reduce((count, word) => {
      return count + (sentenceLower.includes(word) ? 1 : 0);
    }, 0);
    score += impactCount * 2;
    
    // Length scoring (prefer medium-length sentences)
    if (sentence.length > 50 && sentence.length < 200) score += 1;
    
    // Avoid very short or very long sentences
    if (sentence.length < 30 || sentence.length > 300) score -= 2;
    
    return { sentence: sentence.trim(), score, index };
  });
  
  // Get top sentences for summary
  const topSentences = scoredSentences
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .sort((a, b) => a.index - b.index); // Maintain document order
  
  // Build a concise 3-sentence summary
  const summaryParts = [];
  
  // Sentence 1: What the document is about (themes/purpose)
  if (primaryThemes.length > 0) {
    const themeText = primaryThemes.length === 1 
      ? primaryThemes[0] 
      : primaryThemes.slice(0, -1).join(', ') + ' and ' + primaryThemes[primaryThemes.length - 1];
    summaryParts.push(`This document focuses on ${themeText} within AIME's Indigenous wisdom framework.`);
  } else {
    summaryParts.push('This document presents AIME-related concepts and methodologies.');
  }
  
  // Sentence 2: Key insight or main argument (from highest scoring sentence)
  if (topSentences.length > 0) {
    const keyInsight = topSentences[0].sentence;
    // Clean up the sentence and ensure it's not too long
    let cleanInsight = keyInsight.replace(/^\s*[-•]\s*/, '').trim();
    if (cleanInsight.length > 150) {
      cleanInsight = cleanInsight.substring(0, 147) + '...';
    }
    summaryParts.push(cleanInsight + (cleanInsight.endsWith('.') ? '' : '.'));
  } else {
    // Fallback: find a sentence that explains what AIME does or proposes
    const explanatorySentence = sentences.find(s => {
      const lower = s.toLowerCase();
      return (lower.includes('aime') || lower.includes('approach') || lower.includes('method')) 
        && s.length > 40 && s.length < 200;
    });
    if (explanatorySentence) {
      summaryParts.push(explanatorySentence.trim() + (explanatorySentence.endsWith('.') ? '' : '.'));
    } else {
      summaryParts.push('The document outlines key principles and applications of AIME\'s methodology.');
    }
  }
  
  // Sentence 3: Impact/application or scope
  const hasTransformation = cleanText.toLowerCase().includes('transform');
  const hasImplementation = cleanText.toLowerCase().includes('implement') || cleanText.toLowerCase().includes('application');
  const hasOrganization = cleanText.toLowerCase().includes('organization') || cleanText.toLowerCase().includes('business');
  const hasCommunity = cleanText.toLowerCase().includes('community') || cleanText.toLowerCase().includes('collective');
  
  if (hasTransformation && hasOrganization) {
    summaryParts.push('It demonstrates how these principles can transform organizational practices and create systemic change.');
  } else if (hasImplementation) {
    summaryParts.push('The document provides practical guidance for implementing these concepts in real-world contexts.');
  } else if (hasCommunity) {
    summaryParts.push('It emphasizes the role of community relationships and collective action in creating meaningful change.');
  } else if (conceptCount > 3) {
    summaryParts.push(`The document integrates ${conceptCount} key AIME concepts to present a comprehensive approach to systems transformation.`);
  } else {
    summaryParts.push('It contributes to AIME\'s broader vision of Indigenous-led systems transformation.');
  }
  
  // Join the three sentences
  const summary = summaryParts.slice(0, 3).join(' ');
  
  return summary || 'This document contains AIME-related content exploring Indigenous wisdom and systems transformation.';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'overview';
    const category = searchParams.get('category');
    const concept = searchParams.get('concept');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const framingData = loadFramingData();
    if (!framingData) {
      return NextResponse.json({
        success: false,
        error: 'Framing data not available'
      }, { status: 500 });
    }
    
    const { documents, conceptMap, categoryAnalysis, report } = framingData;
    
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            summary: report.summary,
            topConcepts: report.topConcepts.slice(0, limit),
            categories: report.categoryBreakdown,
            recentDocuments: documents
              .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
              .slice(0, 5)
              .map(doc => ({
                id: doc.id,
                title: doc.title,
                category: doc.category,
                conceptCount: doc.concepts.length
              }))
          }
        });
        
      case 'documents':
        let filteredDocs = documents;
        
        if (category) {
          filteredDocs = filteredDocs.filter(doc => doc.category === category);
        }
        
        if (concept) {
          filteredDocs = filteredDocs.filter(doc => 
            doc.concepts.some(c => c.toLowerCase().includes(concept.toLowerCase()))
          );
        }
        
        return NextResponse.json({
          success: true,
          data: {
            documents: filteredDocs.slice(0, limit).map(doc => ({
              ...doc,
              fullContent: undefined // Don't send full content in list view
            })),
            total: filteredDocs.length,
            filters: { category, concept }
          }
        });
        
      case 'document':
        const docId = searchParams.get('id');
        if (!docId) {
          return NextResponse.json({
            success: false,
            error: 'Document ID required'
          }, { status: 400 });
        }
        
        const document = documents.find(doc => doc.id === docId);
        if (!document) {
          return NextResponse.json({
            success: false,
            error: 'Document not found'
          }, { status: 404 });
        }
        
        // Find related documents based on shared concepts
        const relatedDocs = documents
          .filter(doc => doc.id !== docId)
          .map(doc => ({
            ...doc,
            sharedConcepts: doc.concepts.filter(concept => 
              document.concepts.includes(concept)
            ).length,
            fullContent: undefined
          }))
          .filter(doc => doc.sharedConcepts > 0)
          .sort((a, b) => b.sharedConcepts - a.sharedConcepts)
          .slice(0, 5);
        
        return NextResponse.json({
          success: true,
          data: {
            document,
            relatedDocuments: relatedDocs,
            navigation: {
              prev: documents[documents.findIndex(d => d.id === docId) - 1]?.id,
              next: documents[documents.findIndex(d => d.id === docId) + 1]?.id
            }
          }
        });
        
      case 'concepts':
        const concepts = Object.entries(conceptMap)
          .map(([name, data]) => ({
            name,
            frequency: data.frequency,
            categories: data.categories,
            documents: data.documents.slice(0, 5) // Limit document references
          }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, limit);
          
        return NextResponse.json({
          success: true,
          data: { concepts }
        });
        
      case 'categories':
        return NextResponse.json({
          success: true,
          data: { categories: categoryAnalysis }
        });
        
      case 'search':
        const query = searchParams.get('q')?.toLowerCase() || '';
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Search query required'
          }, { status: 400 });
        }
        
        const searchResults = documents.filter(doc => 
          doc.title.toLowerCase().includes(query) ||
          doc.concepts.some(concept => concept.toLowerCase().includes(query)) ||
          doc.keyQuotes.some(quote => quote.toLowerCase().includes(query))
        ).slice(0, limit);
        
        return NextResponse.json({
          success: true,
          data: {
            query,
            results: searchResults,
            total: searchResults.length
          }
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Framing API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}