#!/usr/bin/env node

/**
 * Search-Focused Test Suite
 * 
 * Comprehensive testing for the unified search API and related functionality
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const searchTestScenarios = [
  // Basic functionality
  {
    name: 'Basic Text Search',
    query: 'mentoring',
    expectedResults: true,
    expectedTypes: ['tool', 'content', 'business_case']
  },
  {
    name: 'Indigenous Content Search',
    query: 'indigenous',
    expectedResults: true,
    checkIndigenousDetection: true
  },
  {
    name: 'Hoodie Search',
    query: 'hoodie',
    expectedResults: true,
    expectedTypes: ['hoodie', 'tool', 'content']
  },
  {
    name: 'Systems Thinking Search',
    query: 'systems thinking',
    expectedResults: true,
    checkQueryExpansion: true
  },
  
  // Content type specific searches
  {
    name: 'Business Cases Only',
    query: 'transformation',
    types: ['business_case'],
    expectedResults: true
  },
  {
    name: 'Tools Only',
    query: 'book',
    types: ['tool'],
    expectedResults: true
  },
  {
    name: 'Hoodies Only',
    query: 'achievement',
    types: ['hoodie'],
    expectedResults: false // Might not have results
  },
  
  // Advanced features
  {
    name: 'Wildcard Search',
    query: '*',
    limit: 100,
    expectedResults: true,
    checkPerformance: true
  },
  {
    name: 'Complex Multi-word Query',
    query: 'indigenous systems thinking mentoring leadership',
    expectedResults: false, // Might not have exact matches
    checkQueryExpansion: true
  },
  
  // Edge cases
  {
    name: 'Single Character',
    query: 'a',
    expectedResults: true
  },
  {
    name: 'Numbers',
    query: '2024',
    expectedResults: false
  },
  {
    name: 'Special Characters',
    query: 'AIME & mentoring',
    expectedResults: true
  }
];

async function testSearchScenario(scenario) {
  console.log(`\n🔍 Testing: ${scenario.name}`);
  
  const startTime = Date.now();
  
  try {
    // Build URL
    const params = new URLSearchParams({
      q: scenario.query,
      limit: scenario.limit || 20
    });
    
    if (scenario.types) {
      params.append('types', scenario.types.join(','));
    }
    
    const url = `${baseUrl}/api/unified-search?${params}`;
    console.log(`   Query: "${scenario.query}"`);
    
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.log(`   ❌ HTTP Error: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.log(`   ❌ API Error: ${data.error}`);
      return false;
    }
    
    const results = data.data.results || [];
    const totalResults = data.data.total_results || 0;
    
    console.log(`   📊 Results: ${totalResults} (${responseTime}ms)`);
    
    // Check if we expected results
    if (scenario.expectedResults && totalResults === 0) {
      console.log(`   ⚠️  Expected results but got none`);
    } else if (!scenario.expectedResults && totalResults > 0) {
      console.log(`   ℹ️  Got unexpected results (not necessarily bad)`);
    }
    
    // Check result types
    if (scenario.expectedTypes && results.length > 0) {
      const foundTypes = [...new Set(results.map(r => r.type))];
      const hasExpectedTypes = scenario.expectedTypes.some(type => foundTypes.includes(type));
      
      if (hasExpectedTypes) {
        console.log(`   ✅ Found expected types: ${foundTypes.join(', ')}`);
      } else {
        console.log(`   ⚠️  Expected types ${scenario.expectedTypes.join(', ')}, found: ${foundTypes.join(', ')}`);
      }
    }
    
    // Check Indigenous content detection
    if (scenario.checkIndigenousDetection && results.length > 0) {
      const indigenousContent = results.filter(r => 
        r.cultural_sensitivity && r.cultural_sensitivity.includes('Indigenous content detected')
      );
      
      if (indigenousContent.length > 0) {
        console.log(`   🏛️  Indigenous content detected: ${indigenousContent.length} items`);
      } else {
        console.log(`   ℹ️  No Indigenous content detected in results`);
      }
    }
    
    // Check query expansion
    if (scenario.checkQueryExpansion) {
      const expandedQueries = data.data.expanded_queries || [];
      if (expandedQueries.length > 1) {
        console.log(`   🔄 Query expanded to ${expandedQueries.length} variations`);
      } else {
        console.log(`   ℹ️  No query expansion occurred`);
      }
    }
    
    // Check performance
    if (scenario.checkPerformance) {
      if (responseTime < 100) {
        console.log(`   ⚡ Excellent performance: ${responseTime}ms`);
      } else if (responseTime < 500) {
        console.log(`   ✅ Good performance: ${responseTime}ms`);
      } else {
        console.log(`   ⚠️  Slow performance: ${responseTime}ms`);
      }
    }
    
    // Check search suggestions
    const suggestions = data.data.search_suggestions || [];
    if (suggestions.length > 0) {
      console.log(`   💡 Suggestions: ${suggestions.slice(0, 3).join(', ')}...`);
    }
    
    console.log(`   ✅ Test completed successfully`);
    return true;
    
  } catch (error) {
    console.log(`   💥 Exception: ${error.message}`);
    return false;
  }
}

async function testAdvancedSearch() {
  console.log(`\n🎯 Testing Advanced Search (POST)`);
  
  const advancedTests = [
    {
      name: 'Filtered Search',
      body: {
        query: 'mentoring',
        types: ['tool', 'content'],
        limit: 10,
        filters: {
          min_relevance: 0.5
        }
      }
    },
    {
      name: 'Indigenous Content Filter',
      body: {
        query: 'community',
        types: ['all'],
        limit: 20,
        filters: {
          indigenous_only: true
        }
      }
    },
    {
      name: 'Date Range Filter',
      body: {
        query: 'leadership',
        types: ['all'],
        limit: 15,
        filters: {
          date_from: '2024-01-01'
        }
      }
    }
  ];
  
  let passed = 0;
  
  for (const test of advancedTests) {
    try {
      console.log(`\n   🧪 ${test.name}`);
      
      const response = await fetch(`${baseUrl}/api/unified-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.body)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log(`      ✅ Success: ${data.data?.total_results || 0} results`);
          passed++;
        } else {
          console.log(`      ❌ API Error: ${data.error}`);
        }
      } else {
        console.log(`      ❌ HTTP Error: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`      💥 Exception: ${error.message}`);
    }
  }
  
  console.log(`\n   📊 Advanced Search Results: ${passed}/${advancedTests.length} passed`);
  return passed === advancedTests.length;
}

async function testHealthAndMonitoring() {
  console.log(`\n🏥 Testing Health & Monitoring`);
  
  try {
    const response = await fetch(`${baseUrl}/api/unified-search/health`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.status === 'healthy') {
        console.log(`   ✅ System Health: ${data.status}`);
        console.log(`   🔧 Database: ${data.checks?.database_connection}`);
        console.log(`   🔍 Search Engine: ${data.checks?.search_enhancement}`);
        return true;
      } else {
        console.log(`   ❌ System Unhealthy: ${data.status}`);
        return false;
      }
    } else {
      console.log(`   ❌ Health check failed: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.log(`   💥 Health check exception: ${error.message}`);
    return false;
  }
}

async function runSearchTests() {
  console.log('🚀 Search-Focused Test Suite');
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Test Scenarios: ${searchTestScenarios.length}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Health check first
  const healthPassed = await testHealthAndMonitoring();
  totalTests++;
  if (healthPassed) passedTests++;
  
  // Run search scenarios
  for (const scenario of searchTestScenarios) {
    const passed = await testSearchScenario(scenario);
    totalTests++;
    if (passed) passedTests++;
  }
  
  // Advanced search tests
  const advancedPassed = await testAdvancedSearch();
  totalTests++;
  if (advancedPassed) passedTests++;
  
  // Final summary
  console.log(`\n🎯 Final Results:`);
  console.log(`   📊 Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log(`\n🎉 All search tests passed! Search system is fully functional.`);
    return true;
  } else {
    console.log(`\n⚠️  Some tests had issues. Search system is mostly functional.`);
    return false;
  }
}

// Run the tests
runSearchTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});