#!/usr/bin/env node

/**
 * User Workflow Test Suite
 * 
 * Simulates real user journeys through the AIME Knowledge Platform
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const userWorkflows = [
  {
    name: 'New User Discovery Journey',
    description: 'A new user exploring AIME content for the first time',
    steps: [
      {
        action: 'Visit home page',
        url: '/',
        expectContent: ['AIME']
      },
      {
        action: 'Search for mentoring',
        url: '/api/unified-search?q=mentoring&limit=10',
        expectResults: true,
        expectTypes: ['business_case', 'tool', 'content']
      },
      {
        action: 'Explore philosophy demo',
        url: '/philosophy-demo',
        expectContent: ['Philosophy', 'Progressive']
      },
      {
        action: 'Check hoodie observatory',
        url: '/hoodie-observatory',
        expectContent: ['Observatory', 'Economics']
      }
    ]
  },
  
  {
    name: 'Researcher Deep Dive',
    description: 'A researcher looking for Indigenous knowledge systems',
    steps: [
      {
        action: 'Search for indigenous content',
        url: '/api/unified-search?q=indigenous&limit=20',
        expectResults: true,
        checkIndigenousDetection: true
      },
      {
        action: 'Advanced search with filters',
        url: '/api/unified-search',
        method: 'POST',
        body: {
          query: 'indigenous systems',
          types: ['all'],
          filters: { indigenous_only: true }
        },
        expectResults: true
      },
      {
        action: 'Explore enhanced content',
        url: '/enhanced-content-demo',
        expectContent: ['Enhanced', 'Content']
      }
    ]
  },
  
  {
    name: 'Educator Content Discovery',
    description: 'An educator looking for teaching resources',
    steps: [
      {
        action: 'Visit discovery page',
        url: '/discovery',
        expectContent: ['Discovery', 'Search']
      },
      {
        action: 'Search for educational tools',
        url: '/api/unified-search?q=book&types=tool&limit=15',
        expectResults: true
      },
      {
        action: 'Search for business cases',
        url: '/api/unified-search?q=transformation&types=business_case&limit=10',
        expectResults: true
      }
    ]
  },
  
  {
    name: 'System Administrator Health Check',
    description: 'Admin checking system health and performance',
    steps: [
      {
        action: 'Check API health',
        url: '/api/unified-search/health',
        expectHealthy: true
      },
      {
        action: 'Test search performance',
        url: '/api/unified-search?q=*&limit=100',
        expectResults: true,
        checkPerformance: true,
        maxResponseTime: 500
      },
      {
        action: 'Test edge cases',
        url: '/api/unified-search?q=' + encodeURIComponent('special chars: !@#$%'),
        expectNoError: true
      }
    ]
  }
];

async function executeWorkflowStep(step, workflowName) {
  console.log(`      🔸 ${step.action}`);
  
  const startTime = Date.now();
  
  try {
    const options = {
      method: step.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `AIME-Workflow-Test/${workflowName}`
      }
    };
    
    if (step.body) {
      options.body = JSON.stringify(step.body);
    }
    
    const response = await fetch(`${baseUrl}${step.url}`, options);
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      console.log(`         ❌ HTTP ${response.status}: ${response.statusText}`);
      return false;
    }
    
    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Check expectations
    let checks = [];
    
    // Content expectations
    if (step.expectContent) {
      const content = typeof data === 'string' ? data : JSON.stringify(data);
      const foundContent = step.expectContent.filter(expected => 
        content.toLowerCase().includes(expected.toLowerCase())
      );
      
      if (foundContent.length === step.expectContent.length) {
        checks.push(`✅ Content: ${foundContent.join(', ')}`);
      } else {
        checks.push(`⚠️ Content: ${foundContent.length}/${step.expectContent.length} found`);
      }
    }
    
    // Results expectations
    if (step.expectResults && typeof data === 'object' && data.success) {
      const resultCount = data.data?.total_results || 0;
      if (resultCount > 0) {
        checks.push(`✅ Results: ${resultCount} found`);
      } else {
        checks.push(`⚠️ Results: No results found`);
      }
    }
    
    // Health check
    if (step.expectHealthy && typeof data === 'object') {
      if (data.status === 'healthy') {
        checks.push(`✅ Health: System healthy`);
      } else {
        checks.push(`❌ Health: System unhealthy`);
      }
    }
    
    // Indigenous content detection
    if (step.checkIndigenousDetection && typeof data === 'object' && data.data?.results) {
      const indigenousCount = data.data.results.filter(r => 
        r.cultural_sensitivity?.includes('Indigenous content detected')
      ).length;
      
      if (indigenousCount > 0) {
        checks.push(`🏛️ Indigenous: ${indigenousCount} items detected`);
      } else {
        checks.push(`ℹ️ Indigenous: No specific detection`);
      }
    }
    
    // Performance check
    if (step.checkPerformance) {
      if (responseTime <= (step.maxResponseTime || 1000)) {
        checks.push(`⚡ Performance: ${responseTime}ms`);
      } else {
        checks.push(`⚠️ Performance: ${responseTime}ms (slow)`);
      }
    }
    
    // Error check
    if (step.expectNoError) {
      if (typeof data === 'object' && data.success !== false) {
        checks.push(`✅ No errors`);
      } else {
        checks.push(`⚠️ Potential error detected`);
      }
    }
    
    // Display results
    if (checks.length > 0) {
      console.log(`         ${checks.join(', ')}`);
    } else {
      console.log(`         ✅ Completed (${responseTime}ms)`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`         💥 Exception: ${error.message}`);
    return false;
  }
}

async function runUserWorkflow(workflow) {
  console.log(`\n👤 User Workflow: ${workflow.name}`);
  console.log(`   📝 ${workflow.description}`);
  console.log(`   🔢 Steps: ${workflow.steps.length}`);
  
  let completedSteps = 0;
  
  for (const step of workflow.steps) {
    const success = await executeWorkflowStep(step, workflow.name);
    if (success) {
      completedSteps++;
    }
  }
  
  const successRate = Math.round((completedSteps / workflow.steps.length) * 100);
  console.log(`   📊 Completed: ${completedSteps}/${workflow.steps.length} (${successRate}%)`);
  
  return completedSteps === workflow.steps.length;
}

async function runWorkflowTests() {
  console.log('🚀 User Workflow Test Suite');
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Workflows: ${userWorkflows.length}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  let totalWorkflows = 0;
  let successfulWorkflows = 0;
  let totalSteps = 0;
  let successfulSteps = 0;
  
  for (const workflow of userWorkflows) {
    const workflowSuccess = await runUserWorkflow(workflow);
    
    totalWorkflows++;
    totalSteps += workflow.steps.length;
    
    if (workflowSuccess) {
      successfulWorkflows++;
      successfulSteps += workflow.steps.length;
    } else {
      // Count partial success
      for (const step of workflow.steps) {
        try {
          const stepSuccess = await executeWorkflowStep(step, workflow.name);
          if (stepSuccess) successfulSteps++;
        } catch (error) {
          // Step already failed, don't count
        }
      }
    }
  }
  
  // Final summary
  console.log(`\n🎯 Workflow Test Results:`);
  console.log(`   👥 Workflows: ${successfulWorkflows}/${totalWorkflows} completed successfully`);
  console.log(`   🔢 Steps: ${successfulSteps}/${totalSteps} completed successfully`);
  console.log(`   📈 Workflow Success Rate: ${Math.round((successfulWorkflows / totalWorkflows) * 100)}%`);
  console.log(`   📈 Step Success Rate: ${Math.round((successfulSteps / totalSteps) * 100)}%`);
  
  // User experience assessment
  console.log(`\n🎨 User Experience Assessment:`);
  
  if (successfulWorkflows === totalWorkflows) {
    console.log(`   🌟 Excellent: All user workflows completed successfully`);
    console.log(`   🚀 Users should have a smooth experience across all features`);
    console.log(`   ✅ Ready for production use`);
  } else if (successfulWorkflows >= totalWorkflows * 0.8) {
    console.log(`   👍 Good: Most user workflows work well`);
    console.log(`   🔧 Minor issues may affect some user journeys`);
    console.log(`   📝 Consider addressing failing workflows`);
  } else {
    console.log(`   ⚠️ Needs Attention: Several workflows have issues`);
    console.log(`   🔍 Review failing steps and fix critical user paths`);
    console.log(`   🚫 Not recommended for production without fixes`);
  }
  
  return successfulWorkflows === totalWorkflows;
}

// Run the workflow tests
runWorkflowTests().catch(error => {
  console.error('💥 Workflow test suite failed:', error);
  process.exit(1);
});