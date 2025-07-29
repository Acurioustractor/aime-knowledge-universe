#!/usr/bin/env node

/**
 * Test Report Generator
 * 
 * Runs all test suites and generates a comprehensive report
 */

const { execSync } = require('child_process');
const fs = require('fs');

async function runTestSuite(name, command) {
  console.log(`\n🧪 Running ${name}...`);
  
  try {
    const startTime = Date.now();
    const output = execSync(command, { 
      encoding: 'utf8',
      timeout: 30000 // 30 second timeout
    });
    const duration = Date.now() - startTime;
    
    return {
      name,
      success: true,
      duration,
      output: output.trim()
    };
    
  } catch (error) {
    return {
      name,
      success: false,
      duration: 0,
      output: error.stdout || error.message,
      error: error.message
    };
  }
}

async function generateReport() {
  console.log('📊 AIME Knowledge Platform - Comprehensive Test Report');
  console.log('=' .repeat(60));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  
  const testSuites = [
    {
      name: 'Search API Tests',
      command: 'node scripts/search-focused-test.js',
      description: 'Tests the unified search API functionality'
    },
    {
      name: 'Frontend Integration Tests',
      command: 'node scripts/frontend-test.js',
      description: 'Tests frontend pages and components'
    },
    {
      name: 'User Workflow Tests',
      command: 'node scripts/user-workflow-test.js',
      description: 'Tests complete user journeys'
    }
  ];
  
  const results = [];
  let totalDuration = 0;
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite.name, suite.command);
    results.push({ ...result, description: suite.description });
    totalDuration += result.duration;
  }
  
  // Generate summary
  const successfulSuites = results.filter(r => r.success).length;
  const totalSuites = results.length;
  const overallSuccess = successfulSuites === totalSuites;
  
  console.log(`\n📋 Test Suite Summary:`);
  console.log(`   Total Suites: ${totalSuites}`);
  console.log(`   Successful: ${successfulSuites}`);
  console.log(`   Failed: ${totalSuites - successfulSuites}`);
  console.log(`   Success Rate: ${Math.round((successfulSuites / totalSuites) * 100)}%`);
  console.log(`   Total Duration: ${totalDuration}ms`);
  
  // Detailed results
  console.log(`\n📊 Detailed Results:`);
  
  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    console.log(`\n${status} ${result.name}`);
    console.log(`   Description: ${result.description}`);
    console.log(`   Duration: ${result.duration}ms`);
    
    if (result.success) {
      // Extract key metrics from output
      const output = result.output;
      
      if (output.includes('Success Rate:')) {
        const match = output.match(/Success Rate: (\d+)%/);
        if (match) {
          console.log(`   Success Rate: ${match[1]}%`);
        }
      }
      
      if (output.includes('Total Tests:')) {
        const match = output.match(/Total Tests: (\d+)/);
        if (match) {
          console.log(`   Tests Run: ${match[1]}`);
        }
      }
      
      if (output.includes('Passed:')) {
        const match = output.match(/Passed: (\d+)/);
        if (match) {
          console.log(`   Tests Passed: ${match[1]}`);
        }
      }
      
    } else {
      console.log(`   Error: ${result.error}`);
    }
  }
  
  // System health summary
  console.log(`\n🏥 System Health Summary:`);
  
  const searchApiWorking = results.find(r => r.name === 'Search API Tests')?.success;
  const frontendWorking = results.find(r => r.name === 'Frontend Integration Tests')?.success;
  const workflowsWorking = results.find(r => r.name === 'User Workflow Tests')?.success;
  
  console.log(`   🔍 Search API: ${searchApiWorking ? '✅ Healthy' : '❌ Issues'}`);
  console.log(`   🌐 Frontend: ${frontendWorking ? '✅ Healthy' : '❌ Issues'}`);
  console.log(`   👤 User Workflows: ${workflowsWorking ? '✅ Healthy' : '❌ Issues'}`);
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (overallSuccess) {
    console.log(`   🎉 Excellent! All test suites passed.`);
    console.log(`   🚀 System is ready for production use.`);
    console.log(`   📈 Consider setting up automated testing in CI/CD.`);
    console.log(`   📊 Monitor performance metrics in production.`);
  } else {
    console.log(`   🔧 Some test suites failed - review the issues above.`);
    console.log(`   🔍 Focus on fixing critical user paths first.`);
    console.log(`   📝 Consider running individual test suites for debugging.`);
    console.log(`   ⚠️  Not recommended for production until issues are resolved.`);
  }
  
  // Generate markdown report
  const markdownReport = generateMarkdownReport(results, {
    totalSuites,
    successfulSuites,
    totalDuration,
    overallSuccess,
    timestamp: new Date().toISOString()
  });
  
  fs.writeFileSync('test-report.md', markdownReport);
  console.log(`\n📄 Detailed report saved to: test-report.md`);
  
  return overallSuccess;
}

function generateMarkdownReport(results, summary) {
  const { totalSuites, successfulSuites, totalDuration, overallSuccess, timestamp } = summary;
  
  let markdown = `# AIME Knowledge Platform - Test Report

**Generated:** ${timestamp}  
**Platform:** ${process.platform}  
**Node.js:** ${process.version}

## Summary

- **Total Test Suites:** ${totalSuites}
- **Successful:** ${successfulSuites}
- **Failed:** ${totalSuites - successfulSuites}
- **Success Rate:** ${Math.round((successfulSuites / totalSuites) * 100)}%
- **Total Duration:** ${totalDuration}ms
- **Overall Status:** ${overallSuccess ? '✅ PASS' : '❌ FAIL'}

## Test Suite Results

`;

  for (const result of results) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    markdown += `### ${status} ${result.name}

**Description:** ${result.description}  
**Duration:** ${result.duration}ms

`;

    if (result.success) {
      // Extract metrics
      const output = result.output;
      const successRateMatch = output.match(/Success Rate: (\d+)%/);
      const totalTestsMatch = output.match(/Total Tests: (\d+)/);
      const passedTestsMatch = output.match(/Passed: (\d+)/);
      
      if (successRateMatch || totalTestsMatch || passedTestsMatch) {
        markdown += `**Metrics:**
`;
        if (totalTestsMatch) markdown += `- Tests Run: ${totalTestsMatch[1]}\n`;
        if (passedTestsMatch) markdown += `- Tests Passed: ${passedTestsMatch[1]}\n`;
        if (successRateMatch) markdown += `- Success Rate: ${successRateMatch[1]}%\n`;
      }
    } else {
      markdown += `**Error:** ${result.error}

`;
    }
    
    markdown += `\n`;
  }
  
  markdown += `## System Health

| Component | Status |
|-----------|--------|
| Search API | ${results.find(r => r.name === 'Search API Tests')?.success ? '✅ Healthy' : '❌ Issues'} |
| Frontend | ${results.find(r => r.name === 'Frontend Integration Tests')?.success ? '✅ Healthy' : '❌ Issues'} |
| User Workflows | ${results.find(r => r.name === 'User Workflow Tests')?.success ? '✅ Healthy' : '❌ Issues'} |

## Recommendations

`;

  if (overallSuccess) {
    markdown += `- 🎉 **Excellent!** All test suites passed
- 🚀 System is ready for production use
- 📈 Consider setting up automated testing in CI/CD
- 📊 Monitor performance metrics in production
`;
  } else {
    markdown += `- 🔧 Some test suites failed - review the issues above
- 🔍 Focus on fixing critical user paths first
- 📝 Consider running individual test suites for debugging
- ⚠️ Not recommended for production until issues are resolved
`;
  }
  
  return markdown;
}

// Run the report generator
generateReport().then(success => {
  if (!success) {
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Report generation failed:', error);
  process.exit(1);
});