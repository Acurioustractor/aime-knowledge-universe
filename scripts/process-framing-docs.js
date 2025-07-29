#!/usr/bin/env node

/**
 * Framing Documents Processor
 * 
 * Analyzes and processes AIME framing documents to extract key concepts,
 * themes, and relationships for platform integration.
 */

const fs = require('fs');
const path = require('path');

const FRAMING_DOCS_DIR = 'docs/Framing_docs';
const OUTPUT_DIR = 'docs/processed-framing';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Key concepts to look for across documents
const KEY_CONCEPTS = [
  // Economic Concepts
  'hoodie economics', 'imagination credits', 'relational economics', 'value creation',
  'capital shift', 'economic transformation', 'alternative economics',
  
  // Philosophical Concepts
  'indigenous systems thinking', 'seven generation thinking', 'connection to country',
  'reciprocity', 'custodianship', 'cultural protocols', 'traditional knowledge',
  
  // Organizational Concepts
  'mentoring methodology', 'reverse mentoring', 'joy corps', 'systems change',
  'imagination curriculum', 'university partnerships', 'network effects',
  
  // Strategic Concepts
  'imagi-nation', 'scaling impact', 'global transformation', 'partnership models',
  'community engagement', 'youth empowerment', 'educational equity',
  
  // Operational Concepts
  'digital hoodies', 'trading system', 'impact measurement', 'sustainability',
  'innovation', 'collaboration', 'knowledge sharing'
];

// Document categories based on filename patterns
const DOCUMENT_CATEGORIES = {
  vision: ['Letter to Humanity', 'We-full', 'No Shame at AIME'],
  economic: ['Hoodie Economics', '100M Capital Shift', 'IMAGI-NATION GRP', 'Letter to Billionaires'],
  strategic: ['AIME Imagi-Nation Summary', 'Investment Deck', 'Federal Government', 'Funder Invitation'],
  operational: ['AIME Full Report', 'About AIME Website', 'Patnering letter', 'Lightning'],
  communication: ['Tour Transcript', 'Global Need', 'Townhall', 'Earth Commons']
};

function categorizeDocument(filename) {
  for (const [category, patterns] of Object.entries(DOCUMENT_CATEGORIES)) {
    if (patterns.some(pattern => filename.includes(pattern))) {
      return category;
    }
  }
  return 'uncategorized';
}

function extractConcepts(content) {
  const foundConcepts = [];
  const contentLower = content.toLowerCase();
  
  for (const concept of KEY_CONCEPTS) {
    if (contentLower.includes(concept.toLowerCase())) {
      foundConcepts.push(concept);
    }
  }
  
  return foundConcepts;
}

function extractKeyQuotes(content) {
  const quotes = [];
  
  // Look for quoted text
  const quotedMatches = content.match(/"([^"]{50,200})"/g);
  if (quotedMatches) {
    quotes.push(...quotedMatches.slice(0, 5)); // Top 5 quotes
  }
  
  // Look for impactful statements (sentences with key words)
  const impactWords = ['transform', 'imagine', 'create', 'build', 'change', 'future', 'generation'];
  const sentences = content.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    if (sentence.length > 50 && sentence.length < 200) {
      if (impactWords.some(word => sentence.toLowerCase().includes(word))) {
        quotes.push(sentence.trim());
        if (quotes.length >= 10) break;
      }
    }
  }
  
  return [...new Set(quotes)]; // Remove duplicates
}

function extractMetadata(content) {
  const metadata = {
    wordCount: content.split(/\s+/).length,
    paragraphs: content.split(/\n\s*\n/).length,
    hasNumbers: /\$[\d,]+/.test(content),
    hasPercentages: /\d+%/.test(content),
    hasYears: /20\d{2}/.test(content),
    urgencyLevel: 0
  };
  
  // Calculate urgency level based on language
  const urgencyWords = ['urgent', 'critical', 'immediate', 'now', 'crisis', 'emergency'];
  metadata.urgencyLevel = urgencyWords.reduce((count, word) => {
    return count + (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
  }, 0);
  
  return metadata;
}

function processDocument(filename, content) {
  console.log(`\n📄 Processing: ${filename}`);
  
  const document = {
    id: filename.replace(/\.(txt|md)$/, '').replace(/\s+/g, '_').toLowerCase(),
    title: filename.replace(/\.(txt|md)$/, ''),
    filename,
    category: categorizeDocument(filename),
    concepts: extractConcepts(content),
    keyQuotes: extractKeyQuotes(content),
    metadata: extractMetadata(content),
    contentPreview: content.substring(0, 500) + '...',
    processedAt: new Date().toISOString()
  };
  
  console.log(`   📊 Category: ${document.category}`);
  console.log(`   🎯 Concepts found: ${document.concepts.length}`);
  console.log(`   💬 Key quotes: ${document.keyQuotes.length}`);
  console.log(`   📝 Word count: ${document.metadata.wordCount}`);
  
  return document;
}

function generateConceptMap(documents) {
  const conceptMap = {};
  
  for (const doc of documents) {
    for (const concept of doc.concepts) {
      if (!conceptMap[concept]) {
        conceptMap[concept] = {
          name: concept,
          documents: [],
          frequency: 0,
          categories: new Set()
        };
      }
      
      conceptMap[concept].documents.push({
        id: doc.id,
        title: doc.title,
        category: doc.category
      });
      conceptMap[concept].frequency++;
      conceptMap[concept].categories.add(doc.category);
    }
  }
  
  // Convert sets to arrays for JSON serialization
  for (const concept of Object.values(conceptMap)) {
    concept.categories = Array.from(concept.categories);
  }
  
  return conceptMap;
}

function generateCategoryAnalysis(documents) {
  const analysis = {};
  
  for (const doc of documents) {
    if (!analysis[doc.category]) {
      analysis[doc.category] = {
        documents: [],
        totalConcepts: 0,
        uniqueConcepts: new Set(),
        avgWordCount: 0,
        urgencyLevel: 0
      };
    }
    
    const cat = analysis[doc.category];
    cat.documents.push(doc);
    cat.totalConcepts += doc.concepts.length;
    doc.concepts.forEach(concept => cat.uniqueConcepts.add(concept));
    cat.avgWordCount += doc.metadata.wordCount;
    cat.urgencyLevel += doc.metadata.urgencyLevel;
  }
  
  // Calculate averages and convert sets
  for (const cat of Object.values(analysis)) {
    cat.avgWordCount = Math.round(cat.avgWordCount / cat.documents.length);
    cat.urgencyLevel = Math.round(cat.urgencyLevel / cat.documents.length);
    cat.uniqueConcepts = Array.from(cat.uniqueConcepts);
  }
  
  return analysis;
}

async function main() {
  console.log('🚀 Starting Framing Documents Processing');
  console.log(`📁 Source: ${FRAMING_DOCS_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  
  try {
    const files = fs.readdirSync(FRAMING_DOCS_DIR);
    const documents = [];
    
    for (const file of files) {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        const filePath = path.join(FRAMING_DOCS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const document = processDocument(file, content);
        documents.push(document);
      }
    }
    
    console.log(`\n📊 Processing Summary:`);
    console.log(`   📄 Documents processed: ${documents.length}`);
    
    // Generate analysis
    const conceptMap = generateConceptMap(documents);
    const categoryAnalysis = generateCategoryAnalysis(documents);
    
    console.log(`   🎯 Unique concepts found: ${Object.keys(conceptMap).length}`);
    console.log(`   📂 Categories: ${Object.keys(categoryAnalysis).length}`);
    
    // Save processed data
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'documents.json'),
      JSON.stringify(documents, null, 2)
    );
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'concept-map.json'),
      JSON.stringify(conceptMap, null, 2)
    );
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'category-analysis.json'),
      JSON.stringify(categoryAnalysis, null, 2)
    );
    
    // Generate summary report
    const report = {
      processedAt: new Date().toISOString(),
      summary: {
        totalDocuments: documents.length,
        totalConcepts: Object.keys(conceptMap).length,
        categories: Object.keys(categoryAnalysis).length,
        avgWordsPerDoc: Math.round(documents.reduce((sum, doc) => sum + doc.metadata.wordCount, 0) / documents.length)
      },
      topConcepts: Object.entries(conceptMap)
        .sort(([,a], [,b]) => b.frequency - a.frequency)
        .slice(0, 10)
        .map(([name, data]) => ({ name, frequency: data.frequency, categories: data.categories })),
      categoryBreakdown: Object.entries(categoryAnalysis)
        .map(([name, data]) => ({
          name,
          documentCount: data.documents.length,
          uniqueConcepts: data.uniqueConcepts.length,
          avgWordCount: data.avgWordCount
        }))
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'processing-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log(`\n✅ Processing Complete!`);
    console.log(`📊 Files generated:`);
    console.log(`   - documents.json (${documents.length} documents)`);
    console.log(`   - concept-map.json (${Object.keys(conceptMap).length} concepts)`);
    console.log(`   - category-analysis.json (${Object.keys(categoryAnalysis).length} categories)`);
    console.log(`   - processing-report.json (summary)`);
    
    console.log(`\n🎯 Top Concepts:`);
    report.topConcepts.slice(0, 5).forEach(concept => {
      console.log(`   - ${concept.name}: ${concept.frequency} documents`);
    });
    
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
}

main();