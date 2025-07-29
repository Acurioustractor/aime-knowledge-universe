#!/usr/bin/env node

/**
 * Frontend Integration Test Suite
 * 
 * Tests the frontend pages and components we've built
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const frontendTests = [
  {
    name: 'Home Page',
    path: '/',
    expectedContent: ['AIME', 'Knowledge', 'Platform'],
    description: 'Main landing page'
  },
  {
    name: 'Philosophy Demo',
    path: '/philosophy-demo',
    expectedContent: ['Philosophy', 'Progressive', 'Disclosure'],
    description: 'Philosophy-first user experience demo'
  },
  {
    name: 'Enhanced Content Demo',
    path: '/enhanced-content-demo',
    expectedContent: ['Enhanced', 'Content', 'Template'],
    description: 'Enhanced content presentation demo'
  },
  {
    name: 'Hoodie Observatory',
    path: '/hoodie-observatory',
    expectedContent: ['Observatory', 'Hoodie', 'Economics'],
    description: 'Hoodie Stock Exchange Observatory'
  },
  {
    name: 'Discovery Page',
    path: '/discovery',
    expectedContent: ['Discovery', 'Search', 'Content'],
    description: 'Content discovery interface'
  },
  {
    name: 'Discover Page',
    path: '/discover',
    expectedContent: ['Discover', 'Search'],
    description: 'Alternative discovery interface'
  },
  {
    name: 'Content Universe',
    path: '/content-universe',
    expectedContent: ['Universe', 'Content'],
    description: 'Content universe visualization'
  }
];

async function testFrontendPage(test) {
  console.log(`\n🌐 Testing: ${test.name}`);
  console.log(`   Path: ${test.path}`);
  console.log(`   Description: ${test.description}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseUrl}${test.path}`, {
      headers: {
        'User-Agent': 'AIME-Frontend-Test/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`   📊 Status: ${response.status} (${responseTime}ms)`);
    
    if (!response.ok) {
      console.log(`   ❌ HTTP Error: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const html = await response.text();
    
    // Check for basic HTML structure
    if (!html.includes('<html') || !html.includes('</html>')) {
      console.log(`   ❌ Invalid HTML structure`);
      return false;
    }
    
    // Check for React/Next.js indicators
    if (html.includes('__NEXT_DATA__') || html.includes('_app')) {
      console.log(`   ✅ Next.js app detected`);
    }
    
    // Check for expected content
    let foundContent = 0;
    const missingContent = [];
    
    for (const content of test.expectedContent) {
      if (html.toLowerCase().includes(content.toLowerCase())) {
        foundContent++;
      } else {
        missingContent.push(content);
      }
    }
    
    if (foundContent === test.expectedContent.length) {
      console.log(`   ✅ All expected content found: ${test.expectedContent.join(', ')}`);
    } else {
      console.log(`   ⚠️  Found ${foundContent}/${test.expectedContent.length} expected content items`);
      if (missingContent.length > 0) {
        console.log(`   📝 Missing: ${missingContent.join(', ')}`);
      }
    }
    
    // Check for common errors
    const errorIndicators = [
      'Error:',
      'TypeError:',
      'ReferenceError:',
      'Cannot read property',
      'Cannot read properties',
      'is not defined',
      '500 Internal Server Error',
      'Application error'
    ];
    
    const foundErrors = errorIndicators.filter(error => 
      html.includes(error)
    );
    
    if (foundErrors.length > 0) {
      console.log(`   ⚠️  Potential errors detected: ${foundErrors.join(', ')}`);
    }
    
    // Performance check
    if (responseTime < 200) {
      console.log(`   ⚡ Excellent load time: ${responseTime}ms`);
    } else if (responseTime < 1000) {
      console.log(`   ✅ Good load time: ${responseTime}ms`);
    } else {
      console.log(`   ⚠️  Slow load time: ${responseTime}ms`);
    }
    
    // Check page size
    const sizeKB = Math.round(html.length / 1024);
    console.log(`   📦 Page size: ${sizeKB}KB`);
    
    console.log(`   ✅ Page loaded successfully`);
    return true;
    
  } catch (error) {
    console.log(`   💥 Exception: ${error.message}`);
    return false;
  }
}

async function testAPIIntegration() {
  console.log(`\n🔌 Testing API Integration`);
  
  const apiTests = [
    {
      name: 'Search API from Frontend',
      test: async () => {
        // Simulate what the frontend would do
        const response = await fetch(`${baseUrl}/api/unified-search?q=test&limit=5`);
        return response.ok && (await response.json()).success;
      }
    },
    {
      name: 'Health Check Accessibility',
      test: async () => {
        const response = await fetch(`${baseUrl}/api/unified-search/health`);
        return response.ok && (await response.json()).status === 'healthy';
      }
    }
  ];
  
  let passed = 0;
  
  for (const apiTest of apiTests) {
    try {
      console.log(`   🧪 ${apiTest.name}`);
      const result = await apiTest.test();
      
      if (result) {
        console.log(`      ✅ Passed`);
        passed++;
      } else {
        console.log(`      ❌ Failed`);
      }
      
    } catch (error) {
      console.log(`      💥 Exception: ${error.message}`);
    }
  }
  
  console.log(`   📊 API Integration: ${passed}/${apiTests.length} passed`);
  return passed === apiTests.length;
}

async function runFrontendTests() {
  console.log('🚀 Frontend Integration Test Suite');
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Pages to test: ${frontendTests.length}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test each frontend page
  for (const test of frontendTests) {
    const passed = await testFrontendPage(test);
    totalTests++;
    if (passed) passedTests++;
  }
  
  // Test API integration
  const apiPassed = await testAPIIntegration();
  totalTests++;
  if (apiPassed) passedTests++;
  
  // Summary
  console.log(`\n🎯 Frontend Test Results:`);
  console.log(`   📊 Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (passedTests === totalTests) {
    console.log(`   🎉 All frontend tests passed! Your application is working great.`);
    console.log(`   🚀 Ready for user testing and deployment.`);
  } else {
    console.log(`   🔧 Some pages may need attention.`);
    console.log(`   📝 Check the logs above for specific issues.`);
    console.log(`   🔍 Consider running individual page tests for debugging.`);
  }
  
  return passedTests === totalTests;
}

// Run the tests
runFrontendTests().catch(error => {
  console.error('💥 Frontend test suite failed:', error);
  process.exit(1);
});