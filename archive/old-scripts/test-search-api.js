#!/usr/bin/env node

/**
 * Search API Testing Script
 * 
 * Tests the unified search API with various queries to identify potential issues
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const testQueries = [
  // Basic queries
  'test',
  'mentoring',
  'indigenous',
  'hoodie',
  'systems',
  
  // Edge cases that might cause issues
  '*',
  '   ',
  'a'.repeat(100), // Long query
  'special chars: !@#$%^&*()',
  'unicode: 🔍 search',
  
  // Complex queries
  'indigenous systems thinking mentoring',
  'hoodie economics business case',
  'joy corps transformation leadership'
];

const testEndpoints = [
  '/api/unified-search/health',
  '/api/unified-search?q=test&limit=10',
  '/api/unified-search?q=*&limit=5000', // The problematic query from content-universe
];

async function testEndpoint(url, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    console.log(`   Status: ${response.status} (${responseTime}ms)`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error: ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    if (data.success) {
      console.log(`   ✅ Success: ${data.data?.total_results || 'N/A'} results`);
    } else {
      console.log(`   ❌ API Error: ${data.error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`   💥 Exception: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Search API Tests');
  console.log(`   Base URL: ${baseUrl}`);
  
  let passed = 0;
  let failed = 0;
  
  // Test health endpoint
  const healthPassed = await testEndpoint(`${baseUrl}/api/unified-search/health`, 'Health Check');
  if (healthPassed) passed++; else failed++;
  
  // Test basic endpoints
  for (const endpoint of testEndpoints.slice(1)) {
    const testPassed = await testEndpoint(`${baseUrl}${endpoint}`, `Basic endpoint: ${endpoint}`);
    if (testPassed) passed++; else failed++;
  }
  
  // Test various queries
  for (const query of testQueries) {
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}/api/unified-search?q=${encodedQuery}&limit=10`;
    const testPassed = await testEndpoint(url, `Query: "${query}"`);
    if (testPassed) passed++; else failed++;
  }
  
  // Test POST endpoint
  try {
    console.log(`\n🧪 Testing: POST Advanced Search`);
    const response = await fetch(`${baseUrl}/api/unified-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'indigenous mentoring',
        types: ['all'],
        limit: 20,
        filters: { min_relevance: 0.5 }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ POST Success: ${data.data?.total_results || 'N/A'} results`);
      passed++;
    } else {
      console.log(`   ❌ POST Failed: ${response.status}`);
      failed++;
    }
  } catch (error) {
    console.log(`   💥 POST Exception: ${error.message}`);
    failed++;
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed > 0) {
    console.log(`\n⚠️  Some tests failed. Check the logs above for details.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All tests passed!`);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});