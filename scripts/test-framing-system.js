/**
 * Test script for the AIME Framing System
 * Tests both the API and the document processing functionality
 */

const testDocuments = [
  {
    title: "Test Indigenous Systems Thinking",
    content: `
    Indigenous wisdom teaches us about seven-generation thinking and the importance of considering 
    the impact of our decisions on future generations. This systems approach to transformation 
    recognizes that relationships are at the center of all meaningful change. Through mentoring 
    and community connection, we can build networks that support imagination and creativity.
    
    The hoodie economics model demonstrates how relational value creation can transform traditional 
    economic systems. By prioritizing reciprocity and community benefit over profit maximization,
    we create sustainable pathways for transformation.
    `
  },
  {
    title: "Test Business Strategy Document", 
    content: `
    Our strategic plan focuses on operational efficiency and implementation of new systems.
    We need to develop communication strategies that align with our vision for the future.
    The plan includes metrics for measuring success and frameworks for decision-making.
    
    Key objectives include expanding our reach, improving our processes, and building 
    stronger partnerships with stakeholders across multiple sectors.
    `
  },
  {
    title: "Test AIME Philosophy Document",
    content: `
    AIME's IMAGI-NATION represents a fundamental shift in how we approach education and mentoring.
    Through the Joy Corps methodology, organizations can embed Indigenous wisdom into their 
    operations and culture. This transformation requires imagination as currency and relationships
    as the foundation for all meaningful change.
    
    The seven-generation thinking principle guides our approach to systems transformation,
    ensuring that every decision considers the impact on future generations. This wisdom
    comes from Indigenous knowledge systems that have sustained communities for thousands of years.
    `
  }
];

async function testFramingAPI() {
  console.log('🧪 Testing AIME Framing System API...\n');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test 1: Overview endpoint
  console.log('1. Testing overview endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/framing?type=overview&limit=10`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Overview API working');
      console.log(`   - ${data.data.summary.totalDocuments} documents processed`);
      console.log(`   - ${data.data.summary.totalConcepts} concepts identified`);
      console.log(`   - ${data.data.summary.categories} categories`);
    } else {
      console.log('❌ Overview API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Overview API error:', error.message);
  }
  
  // Test 2: Documents endpoint
  console.log('\n2. Testing documents endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/framing?type=documents&limit=5`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Documents API working');
      console.log(`   - Retrieved ${data.data.documents.length} documents`);
      if (data.data.documents.length > 0) {
        console.log(`   - Sample: "${data.data.documents[0].title}"`);
      }
    } else {
      console.log('❌ Documents API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Documents API error:', error.message);
  }
  
  // Test 3: Concepts endpoint
  console.log('\n3. Testing concepts endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/framing?type=concepts&limit=10`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Concepts API working');
      console.log(`   - Retrieved ${data.data.concepts.length} concepts`);
      if (data.data.concepts.length > 0) {
        const topConcept = data.data.concepts[0];
        console.log(`   - Top concept: "${topConcept.name}" (${topConcept.frequency} documents)`);
      }
    } else {
      console.log('❌ Concepts API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Concepts API error:', error.message);
  }
  
  // Test 4: Search endpoint
  console.log('\n4. Testing search endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/framing?type=search&q=indigenous&limit=5`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Search API working');
      console.log(`   - Found ${data.data.results.length} results for "indigenous"`);
    } else {
      console.log('❌ Search API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Search API error:', error.message);
  }
}

function testClientSideProcessing() {
  console.log('\n🔬 Testing Client-Side Document Processing...\n');
  
  testDocuments.forEach((doc, index) => {
    console.log(`${index + 1}. Processing: "${doc.title}"`);
    
    const result = processDocumentClientSide(doc.content, doc.title);
    
    console.log(`   ✅ Category: ${result.category}`);
    console.log(`   ✅ Concepts: ${result.concepts.join(', ') || 'None'}`);
    console.log(`   ✅ Word Count: ${result.wordCount}`);
    console.log(`   ✅ Key Quotes: ${result.keyQuotes.length} found`);
    console.log('');
  });
}

// Client-side processing function (same as in the component)
function processDocumentClientSide(content, title) {
  const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  const wordCount = words.length;
  
  const aimeConcepts = [
    'indigenous', 'mentoring', 'hoodie', 'economics', 'systems', 'transformation',
    'imagination', 'relationships', 'community', 'wisdom', 'knowledge', 'learning',
    'joy', 'corps', 'imagi-nation', 'seven-generation', 'reciprocity', 'connection'
  ];
  
  const foundConcepts = aimeConcepts.filter(concept => 
    content.toLowerCase().includes(concept)
  );
  
  let category = 'uncategorized';
  if (content.toLowerCase().includes('economic') || content.toLowerCase().includes('hoodie')) {
    category = 'economic';
  } else if (content.toLowerCase().includes('vision') || content.toLowerCase().includes('future')) {
    category = 'vision';
  } else if (content.toLowerCase().includes('strategy') || content.toLowerCase().includes('plan')) {
    category = 'strategic';
  } else if (content.toLowerCase().includes('operation') || content.toLowerCase().includes('implement')) {
    category = 'operational';
  } else if (content.toLowerCase().includes('communication') || content.toLowerCase().includes('story')) {
    category = 'communication';
  }
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyQuotes = sentences.filter(sentence => 
    aimeConcepts.some(concept => sentence.toLowerCase().includes(concept))
  ).slice(0, 3);
  
  return {
    id: Date.now().toString(),
    title,
    category,
    concepts: foundConcepts,
    keyQuotes,
    wordCount,
    processedAt: new Date().toISOString(),
    summary: `Document contains ${foundConcepts.length} AIME concepts and ${wordCount} words. Categorized as ${category}.`
  };
}

async function runAllTests() {
  console.log('🚀 AIME Framing System Test Suite\n');
  console.log('=' .repeat(50));
  
  // Test API endpoints
  await testFramingAPI();
  
  console.log('\n' + '=' .repeat(50));
  
  // Test client-side processing
  testClientSideProcessing();
  
  console.log('=' .repeat(50));
  console.log('✅ All tests completed!\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Visit /framing to test the upload interface');
  console.log('2. Try uploading a document or pasting text');
  console.log('3. Check that analysis results are meaningful');
  console.log('4. Verify dashboard shows processed documents');
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testFramingAPI, testClientSideProcessing, runAllTests };