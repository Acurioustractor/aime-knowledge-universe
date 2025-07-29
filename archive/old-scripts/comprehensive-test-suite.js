#!/usr/bin/env node

/**
 * Comprehensive Test Suite for AIME Knowledge Platform
 * 
 * Tests API endpoints, frontend pages, and integration scenarios
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

// Test scenarios organized by category
const testScenarios = {
  api: {
    name: 'API Endpoints',
    tests: [
      {
        name: 'Health Check',
        url: '/api/unified-search/health',
        method: 'GET',
        expectStatus: 200,
        expectField: 'status',
        expectValue: 'healthy'
      },
      {
        name: 'Basic Search',
        url: '/api/unified-search?q=mentoring&limit=10',
        method: 'GET',
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      },
      {
        name: 'Advanced Search (POST)',
        url: '/api/unified-search',
        method: 'POST',
        body: {
          query: 'indigenous systems',
          types: ['all'],
          limit: 20
        },
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      },
      {
        name: 'Discovery API',
        url: '/api/discovery',
        method: 'GET',
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      },
      {
        name: 'Recommendations API',
        url: '/api/recommendations?user_id=test&limit=5',
        method: 'GET',
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      }
    ]
  },
  
  pages: {
    name: 'Frontend Pages',
    tests: [
      {
        name: 'Home Page',
        url: '/',
        method: 'GET',
        expectStatus: 200,
        expectContent: 'AIME'
      },
      {
        name: 'Discovery Page',
        url: '/discovery',
        method: 'GET',
        expectStatus: 200,
        expectContent: 'Discovery'
      },
      {
        name: 'Philosophy Demo',
        url: '/philosophy-demo',
        method: 'GET',
        expectStatus: 200,
        expectContent: 'Philosophy'
      },
      {
        name: 'Enhanced Content Demo',
        url: '/enhanced-content-demo',
        method: 'GET',
        expectStatus: 200,
        expectContent: 'Enhanced'
      },
      {
        name: 'Hoodie Observatory',
        url: '/hoodie-observatory',
        method: 'GET',
        expectStatus: 200,
        expectContent: 'Observatory'
      }
    ]
  },
  
  integration: {
    name: 'Integration Scenarios',
    tests: [
      {
        name: 'Search with Indigenous Content',
        url: '/api/unified-search?q=indigenous&limit=10',
        method: 'GET',
        expectStatus: 200,
        customCheck: (data) => {
          const hasIndigenousContent = data.data?.results?.some(r => 
            r.cultural_sensitivity?.includes('Indigenous content detected')
          );
          return hasIndigenousContent ? 'Found Indigenous content detection' : 'No Indigenous content detected';
        }
      },
      {
        name: 'Search with Relationships',
        url: '/api/unified-search?q=hoodie&limit=10',
        method: 'GET',
        expectStatus: 200,
        customCheck: (data) => {
          const hasRelationships = data.data?.results?.some(r => 
            r.related_items && r.related_items.length > 0
          );
          return hasRelationships ? 'Found content relationships' : 'No relationships detected';
        }
      },
      {
        name: 'Large Query Performance',
        url: '/api/unified-search?q=*&limit=1000',
        method: 'GET',
        expectStatus: 200,
        performanceCheck: true,
        maxResponseTime: 2000 // 2 seconds max
      }
    ]
  },
  
  edgeCases: {
    name: 'Edge Cases & Error Handling',
    tests: [
      {
        name: 'Empty Query',
        url: '/api/unified-search?q=',
        method: 'GET',
        expectStatus: 400,
        expectField: 'success',
        expectValue: false
      },
      {
        name: 'Very Long Query',
        url: '/api/unified-search?q=' + 'a'.repeat(600),
        method: 'GET',
        expectStatus: 200, // Should be truncated and handled
        expectField: 'success',
        expectValue: true
      },
      {
        name: 'Special Characters',
        url: '/api/unified-search?q=' + encodeURIComponent('!@#$%^&*()'),
        method: 'GET',
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      },
      {
        name: 'Unicode Characters',
        url: '/api/unified-search?q=' + encodeURIComponent('🔍 search test'),
        method: 'GET',
        expectStatus: 200,
        expectField: 'success',
        expectValue: true
      }
    ]
  }
};

async function runTest(test, categoryName) {
  const startTime = Date.now();
  
  try {
    console.log(`\n🧪 ${categoryName}: ${test.name}`);
    
    const url = `${baseUrl}${test.url}`;
    const options = {
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AIME-Test-Suite/1.0'
      }
    };
    
    if (test.body) {
      options.body = JSON.stringify(test.body);
    }
    
    const response = await fetch(url, options);
    const responseTime = Date.now() - startTime;
    
    console.log(`   📊 Status: ${response.status} (${responseTime}ms)`);
    
    // Check response status
    if (test.expectStatus && response.status !== test.expectStatus) {
      console.log(`   ❌ Expected status ${test.expectStatus}, got ${response.status}`);
      return false;
    }
    
    // Performance check
    if (test.performanceCheck && test.maxResponseTime && responseTime > test.maxResponseTime) {
      console.log(`   ⚠️  Performance warning: ${responseTime}ms > ${test.maxResponseTime}ms`);
    }
    
    // Get response data
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Check expected field/value
    if (test.expectField && test.expectValue !== undefined) {
      const actualValue = data[test.expectField];
      if (actualValue !== test.expectValue) {
        console.log(`   ❌ Expected ${test.expectField}=${test.expectValue}, got ${actualValue}`);
        return false;
      }
    }
    
    // Check expected content
    if (test.expectContent) {
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      if (!content.includes(test.expectContent)) {
        console.log(`   ❌ Expected content containing "${test.expectContent}"`);
        return false;
      }
    }
    
    // Custom check function
    if (test.customCheck && typeof data === 'object') {
      const checkResult = test.customCheck(data);
      console.log(`   🔍 Custom check: ${checkResult}`);
    }
    
    console.log(`   ✅ Passed`);
    return true;
    
  } catch (error) {
    console.log(`   💥 Exception: ${error.message}`);
    return false;
  }
}

async function runTestSuite() {
  console.log('🚀 Starting Comprehensive Test Suite');
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    categories: {}
  };
  
  for (const [categoryKey, category] of Object.entries(testScenarios)) {
    console.log(`\n📂 Category: ${category.name}`);
    console.log(`   Tests: ${category.tests.length}`);
    
    const categoryResults = {
      total: category.tests.length,
      passed: 0,
      failed: 0
    };
    
    for (const test of category.tests) {
      const passed = await runTest(test, category.name);
      results.total++;
      categoryResults.total++;
      
      if (passed) {
        results.passed++;
        categoryResults.passed++;
      } else {
        results.failed++;
        categoryResults.failed++;
      }
    }
    
    results.categories[categoryKey] = categoryResults;
    
    console.log(`\n   📊 ${category.name} Results:`);
    console.log(`      ✅ Passed: ${categoryResults.passed}`);
    console.log(`      ❌ Failed: ${categoryResults.failed}`);
    console.log(`      📈 Success Rate: ${Math.round((categoryResults.passed / categoryResults.total) * 100)}%`);
  }
  
  // Final summary
  console.log(`\n🎯 Final Test Results:`);
  console.log(`   📊 Total Tests: ${results.total}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📈 Overall Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
  
  // Category breakdown
  console.log(`\n📂 Category Breakdown:`);
  for (const [key, category] of Object.entries(results.categories)) {
    const successRate = Math.round((category.passed / category.total) * 100);
    const status = successRate === 100 ? '✅' : successRate >= 80 ? '⚠️' : '❌';
    console.log(`   ${status} ${testScenarios[key].name}: ${category.passed}/${category.total} (${successRate}%)`);
  }
  
  if (results.failed === 0) {
    console.log(`\n🎉 All tests passed! System is healthy.`);
    return true;
  } else {
    console.log(`\n⚠️  ${results.failed} test(s) failed. Check logs above for details.`);
    return false;
  }
}

// Performance monitoring
async function performanceTest() {
  console.log(`\n⚡ Performance Test Suite`);
  
  const performanceTests = [
    { name: 'Quick Search', query: 'test', limit: 10, maxTime: 100 },
    { name: 'Medium Search', query: 'indigenous mentoring', limit: 50, maxTime: 200 },
    { name: 'Large Search', query: '*', limit: 500, maxTime: 1000 },
    { name: 'Complex Search', query: 'indigenous systems thinking mentoring leadership', limit: 100, maxTime: 300 }
  ];
  
  for (const test of performanceTests) {
    const startTime = Date.now();
    
    try {
      const url = `${baseUrl}/api/unified-search?q=${encodeURIComponent(test.query)}&limit=${test.limit}`;
      const response = await fetch(url);
      const responseTime = Date.now() - startTime;
      
      const status = responseTime <= test.maxTime ? '✅' : '⚠️';
      console.log(`   ${status} ${test.name}: ${responseTime}ms (max: ${test.maxTime}ms)`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`      📊 Results: ${data.data?.total_results || 0}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${test.name}: Failed - ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  const success = await runTestSuite();
  await performanceTest();
  
  if (!success) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});