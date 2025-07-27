#!/usr/bin/env node

/**
 * Comprehensive Platform Testing Script
 * 
 * Systematically tests all knowledge areas and generates reports
 */

const fs = require('fs');
const path = require('path');

// Define all systems to test
const SYSTEMS_TO_TEST = {
  'Core Knowledge Systems': {
    'Philosophy System': {
      pages: ['/understanding', '/philosophy'],
      components: ['PhilosophyPrimer', 'ProgressiveDisclosure', 'ContextualTooltip'],
      apis: [],
      description: 'AIME philosophy education and understanding'
    },
    'Framing System': {
      pages: ['/framing'],
      components: ['FramingInterface'],
      apis: ['/api/framing'],
      description: 'Document framing and analysis system'
    },
    'Wiki System': {
      pages: ['/wiki/*'],
      components: ['WikiContentRenderer', 'WikiSearch', 'WikiSidebar', 'WikiBreadcrumbs'],
      apis: [],
      description: 'Knowledge wiki and content management'
    },
    'Search & Discovery': {
      pages: ['/search', '/discovery'],
      components: ['SearchResults', 'SearchInterface'],
      apis: ['/api/unified-search', '/api/discovery', '/api/recommendations'],
      description: 'Unified search and content discovery'
    },
    'Hoodie Observatory': {
      pages: ['/hoodie-observatory'],
      components: ['HoodieObservatoryDashboard', 'HoodieEconomicsBusinessCase', 'HoodieJourneyVisualization'],
      apis: [],
      description: 'Economic impact and journey visualization'
    }
  },
  'Community Integration Systems': {
    'Community Profiles': {
      pages: ['/community/profile'],
      components: ['CommunityProfileSetup'],
      apis: ['/api/community/profile', '/api/community/matching', '/api/community/connections'],
      description: 'User profiles and community matching'
    },
    'Cohort Formation': {
      pages: ['/community/cohorts'],
      components: ['CohortDashboard', 'CohortFormation'],
      apis: ['/api/community/cohorts'],
      description: 'Collaborative learning cohorts'
    },
    'Mentorship Network': {
      pages: ['/community/mentorship'],
      components: ['MentorshipDashboard'],
      apis: ['/api/community/mentorship'],
      description: 'Mentor-mentee matching and relationships'
    },
    'Regional Communities': {
      pages: ['/community/regional'],
      components: ['RegionalCommunityDashboard', 'RegionalCommunitySetup'],
      apis: ['/api/community/regional'],
      description: 'Geographic community organization'
    },
    'Learning Spaces': {
      pages: ['/community/learning-spaces'],
      components: ['LearningSpacesDashboard'],
      apis: ['/api/community/learning-spaces'],
      description: 'AI-enhanced collaborative learning spaces'
    },
    'Impact Measurement': {
      pages: ['/community/impact'],
      components: ['ImpactDashboard'],
      apis: ['/api/community/impact'],
      description: 'Community impact tracking and celebration'
    }
  }
};

// Testing categories
const TEST_CATEGORIES = {
  FUNCTIONALITY: 'Basic functionality and features',
  USER_EXPERIENCE: 'User interface and experience',
  KNOWLEDGE_DELIVERY: 'Educational content and learning',
  INTEGRATION: 'System integration and data flow',
  PERFORMANCE: 'Speed and responsiveness',
  ACCESSIBILITY: 'Inclusive design and accessibility'
};

// Severity levels
const SEVERITY_LEVELS = {
  CRITICAL: 'Critical - Blocks core functionality',
  HIGH: 'High - Significantly impacts user experience',
  MEDIUM: 'Medium - Noticeable but not blocking',
  LOW: 'Low - Minor improvement opportunity'
};

class PlatformTester {
  constructor() {
    this.testResults = {};
    this.overallIssues = [];
    this.recommendations = [];
  }

  /**
   * Run comprehensive testing
   */
  async runComprehensiveTest() {
    console.log('🧪 Starting Comprehensive Platform Testing...\n');

    // Test each system category
    for (const [categoryName, systems] of Object.entries(SYSTEMS_TO_TEST)) {
      console.log(`\n📋 Testing Category: ${categoryName}`);
      console.log('='.repeat(50));

      this.testResults[categoryName] = {};

      for (const [systemName, systemConfig] of Object.entries(systems)) {
        console.log(`\n🔍 Testing System: ${systemName}`);
        console.log(`Description: ${systemConfig.description}`);
        
        const systemResults = await this.testSystem(systemName, systemConfig);
        this.testResults[categoryName][systemName] = systemResults;
        
        this.displaySystemResults(systemName, systemResults);
      }
    }

    // Generate comprehensive report
    await this.generateComprehensiveReport();
    
    console.log('\n✅ Comprehensive testing completed!');
    console.log('📄 Check docs/testing-reports/ for detailed results');
  }

  /**
   * Test individual system
   */
  async testSystem(systemName, config) {
    const results = {
      system: systemName,
      config,
      tests: {
        functionality: await this.testFunctionality(config),
        userExperience: await this.testUserExperience(config),
        knowledgeDelivery: await this.testKnowledgeDelivery(config),
        integration: await this.testIntegration(config),
        performance: await this.testPerformance(config),
        accessibility: await this.testAccessibility(config)
      },
      issues: [],
      recommendations: [],
      scores: {},
      overallScore: 0
    };

    // Calculate scores and identify issues
    this.analyzeResults(results);
    
    return results;
  }

  /**
   * Test basic functionality
   */
  async testFunctionality(config) {
    const tests = [];
    
    // Test pages exist
    for (const page of config.pages) {
      tests.push({
        name: `Page exists: ${page}`,
        status: this.checkPageExists(page),
        category: 'Page Availability'
      });
    }

    // Test components exist
    for (const component of config.components) {
      tests.push({
        name: `Component exists: ${component}`,
        status: this.checkComponentExists(component),
        category: 'Component Availability'
      });
    }

    // Test APIs exist
    for (const api of config.apis) {
      tests.push({
        name: `API exists: ${api}`,
        status: this.checkAPIExists(api),
        category: 'API Availability'
      });
    }

    return tests;
  }

  /**
   * Test user experience
   */
  async testUserExperience(config) {
    return [
      {
        name: 'Navigation clarity',
        status: 'needs_review',
        category: 'Navigation',
        notes: 'Requires manual testing'
      },
      {
        name: 'Interface intuitiveness',
        status: 'needs_review',
        category: 'Interface Design',
        notes: 'Requires user feedback'
      },
      {
        name: 'Mobile responsiveness',
        status: 'needs_review',
        category: 'Responsive Design',
        notes: 'Requires device testing'
      }
    ];
  }

  /**
   * Test knowledge delivery
   */
  async testKnowledgeDelivery(config) {
    return [
      {
        name: 'Content accuracy',
        status: 'needs_review',
        category: 'Content Quality',
        notes: 'Requires AIME philosophy expert review'
      },
      {
        name: 'Learning progression',
        status: 'needs_review',
        category: 'Educational Design',
        notes: 'Requires educational assessment'
      },
      {
        name: 'Cultural sensitivity',
        status: 'needs_review',
        category: 'Cultural Appropriateness',
        notes: 'Requires cultural advisor review'
      }
    ];
  }

  /**
   * Test system integration
   */
  async testIntegration(config) {
    return [
      {
        name: 'Cross-system data flow',
        status: 'needs_review',
        category: 'Data Integration',
        notes: 'Requires integration testing'
      },
      {
        name: 'Search integration',
        status: 'needs_review',
        category: 'Search Integration',
        notes: 'Test if content is searchable'
      }
    ];
  }

  /**
   * Test performance
   */
  async testPerformance(config) {
    return [
      {
        name: 'Page load time',
        status: 'needs_review',
        category: 'Performance',
        notes: 'Requires performance testing tools'
      },
      {
        name: 'API response time',
        status: 'needs_review',
        category: 'API Performance',
        notes: 'Requires API benchmarking'
      }
    ];
  }

  /**
   * Test accessibility
   */
  async testAccessibility(config) {
    return [
      {
        name: 'Screen reader compatibility',
        status: 'needs_review',
        category: 'Screen Reader',
        notes: 'Requires accessibility testing tools'
      },
      {
        name: 'Keyboard navigation',
        status: 'needs_review',
        category: 'Keyboard Access',
        notes: 'Requires manual keyboard testing'
      },
      {
        name: 'Color contrast',
        status: 'needs_review',
        category: 'Visual Accessibility',
        notes: 'Requires contrast analysis'
      }
    ];
  }

  /**
   * Check if page exists
   */
  checkPageExists(pagePath) {
    // Check if corresponding page file exists
    const possiblePaths = [
      `src/app${pagePath}/page.tsx`,
      `src/app${pagePath}.tsx`,
      `src/pages${pagePath}.tsx`,
      `src/pages${pagePath}/index.tsx`
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return 'pass';
      }
    }
    return 'fail';
  }

  /**
   * Check if component exists
   */
  checkComponentExists(componentName) {
    // Check if component file exists
    const possiblePaths = [
      `src/components/**/${componentName}.tsx`,
      `src/components/${componentName}.tsx`,
      `src/components/**/${componentName}.jsx`,
      `src/components/${componentName}.jsx`
    ];

    // Simple check - look for files containing the component name
    try {
      const componentsDir = 'src/components';
      if (fs.existsSync(componentsDir)) {
        const files = this.getAllFiles(componentsDir);
        const componentFile = files.find(file => 
          file.includes(componentName) && (file.endsWith('.tsx') || file.endsWith('.jsx'))
        );
        return componentFile ? 'pass' : 'fail';
      }
    } catch (error) {
      console.error(`Error checking component ${componentName}:`, error.message);
    }
    
    return 'fail';
  }

  /**
   * Check if API exists
   */
  checkAPIExists(apiPath) {
    // Check if API route file exists
    const routePath = `src/app/api${apiPath}/route.ts`;
    return fs.existsSync(routePath) ? 'pass' : 'fail';
  }

  /**
   * Get all files recursively
   */
  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  /**
   * Analyze test results and generate scores
   */
  analyzeResults(results) {
    const categories = Object.keys(results.tests);
    
    categories.forEach(category => {
      const tests = results.tests[category];
      const passCount = tests.filter(t => t.status === 'pass').length;
      const totalCount = tests.length;
      const score = totalCount > 0 ? (passCount / totalCount) * 10 : 0;
      
      results.scores[category] = {
        score: Math.round(score * 10) / 10,
        passed: passCount,
        total: totalCount
      };

      // Identify issues
      tests.forEach(test => {
        if (test.status === 'fail') {
          results.issues.push({
            severity: 'HIGH',
            category: test.category,
            description: `${test.name} failed`,
            impact: 'Core functionality may be broken',
            suggestedFix: `Implement or fix ${test.name}`
          });
        } else if (test.status === 'needs_review') {
          results.recommendations.push({
            priority: 'MEDIUM',
            category: test.category,
            description: `${test.name} requires manual testing`,
            value: 'Ensures quality and user satisfaction',
            effort: 'MEDIUM'
          });
        }
      });
    });

    // Calculate overall score
    const scoreValues = Object.values(results.scores).map(s => s.score);
    results.overallScore = scoreValues.length > 0 
      ? Math.round((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10) / 10 
      : 0;
  }

  /**
   * Display system test results
   */
  displaySystemResults(systemName, results) {
    console.log(`\n📊 Results for ${systemName}:`);
    console.log(`Overall Score: ${results.overallScore}/10`);
    
    console.log('\n📈 Category Scores:');
    Object.entries(results.scores).forEach(([category, score]) => {
      console.log(`  ${category}: ${score.score}/10 (${score.passed}/${score.total} passed)`);
    });

    if (results.issues.length > 0) {
      console.log(`\n⚠️  Issues Found: ${results.issues.length}`);
      results.issues.slice(0, 3).forEach(issue => {
        console.log(`  - ${issue.severity}: ${issue.description}`);
      });
    }

    if (results.recommendations.length > 0) {
      console.log(`\n💡 Recommendations: ${results.recommendations.length}`);
      results.recommendations.slice(0, 2).forEach(rec => {
        console.log(`  - ${rec.priority}: ${rec.description}`);
      });
    }
  }

  /**
   * Generate comprehensive report
   */
  async generateComprehensiveReport() {
    const reportDir = 'docs/testing-reports';
    
    // Create reports directory
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Generate summary report
    await this.generateSummaryReport(reportDir);
    
    // Generate detailed reports for each system
    for (const [categoryName, systems] of Object.entries(this.testResults)) {
      for (const [systemName, results] of Object.entries(systems)) {
        await this.generateSystemReport(reportDir, systemName, results);
      }
    }

    // Generate action plan
    await this.generateActionPlan(reportDir);
  }

  /**
   * Generate summary report
   */
  async generateSummaryReport(reportDir) {
    const summaryPath = path.join(reportDir, 'TESTING_SUMMARY.md');
    
    let summary = `# AIME Knowledge Platform - Testing Summary\n\n`;
    summary += `Generated: ${new Date().toISOString()}\n\n`;
    
    summary += `## Overall Results\n\n`;
    
    // Calculate overall platform score
    let totalScore = 0;
    let systemCount = 0;
    
    for (const [categoryName, systems] of Object.entries(this.testResults)) {
      summary += `### ${categoryName}\n\n`;
      
      for (const [systemName, results] of Object.entries(systems)) {
        summary += `- **${systemName}**: ${results.overallScore}/10\n`;
        totalScore += results.overallScore;
        systemCount++;
      }
      summary += `\n`;
    }
    
    const platformScore = systemCount > 0 ? Math.round((totalScore / systemCount) * 10) / 10 : 0;
    summary += `**Platform Overall Score: ${platformScore}/10**\n\n`;
    
    summary += `## Next Steps\n\n`;
    summary += `1. Review individual system reports in this directory\n`;
    summary += `2. Address critical issues first\n`;
    summary += `3. Plan manual testing for items marked "needs_review"\n`;
    summary += `4. Implement recommended improvements\n`;
    summary += `5. Re-test after fixes are applied\n\n`;
    
    summary += `## Files Generated\n\n`;
    summary += `- Individual system reports: [SystemName]_REPORT.md\n`;
    summary += `- Action plan: ACTION_PLAN.md\n`;
    
    fs.writeFileSync(summaryPath, summary);
    console.log(`\n📄 Summary report generated: ${summaryPath}`);
  }

  /**
   * Generate individual system report
   */
  async generateSystemReport(reportDir, systemName, results) {
    const reportPath = path.join(reportDir, `${systemName.replace(/\s+/g, '_').toUpperCase()}_REPORT.md`);
    
    let report = `# ${systemName} - Testing Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += `## System Overview\n`;
    report += `**Description**: ${results.config.description}\n`;
    report += `**Overall Score**: ${results.overallScore}/10\n\n`;
    
    report += `### Pages\n`;
    results.config.pages.forEach(page => {
      report += `- ${page}\n`;
    });
    
    report += `\n### Components\n`;
    results.config.components.forEach(component => {
      report += `- ${component}\n`;
    });
    
    report += `\n### APIs\n`;
    results.config.apis.forEach(api => {
      report += `- ${api}\n`;
    });
    
    report += `\n## Test Results\n\n`;
    
    Object.entries(results.scores).forEach(([category, score]) => {
      report += `### ${category}\n`;
      report += `**Score**: ${score.score}/10 (${score.passed}/${score.total} passed)\n\n`;
      
      const categoryTests = results.tests[category];
      categoryTests.forEach(test => {
        const status = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⏳';
        report += `- ${status} ${test.name}`;
        if (test.notes) {
          report += ` - ${test.notes}`;
        }
        report += `\n`;
      });
      report += `\n`;
    });
    
    if (results.issues.length > 0) {
      report += `## Issues Identified\n\n`;
      results.issues.forEach((issue, index) => {
        report += `### ${index + 1}. ${issue.description}\n`;
        report += `- **Severity**: ${issue.severity}\n`;
        report += `- **Category**: ${issue.category}\n`;
        report += `- **Impact**: ${issue.impact}\n`;
        report += `- **Suggested Fix**: ${issue.suggestedFix}\n\n`;
      });
    }
    
    if (results.recommendations.length > 0) {
      report += `## Recommendations\n\n`;
      results.recommendations.forEach((rec, index) => {
        report += `### ${index + 1}. ${rec.description}\n`;
        report += `- **Priority**: ${rec.priority}\n`;
        report += `- **Category**: ${rec.category}\n`;
        report += `- **Value**: ${rec.value}\n`;
        report += `- **Effort**: ${rec.effort}\n\n`;
      });
    }
    
    fs.writeFileSync(reportPath, report);
  }

  /**
   * Generate action plan
   */
  async generateActionPlan(reportDir) {
    const actionPath = path.join(reportDir, 'ACTION_PLAN.md');
    
    let plan = `# AIME Knowledge Platform - Action Plan\n\n`;
    plan += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Collect all issues and recommendations
    const allIssues = [];
    const allRecommendations = [];
    
    for (const [categoryName, systems] of Object.entries(this.testResults)) {
      for (const [systemName, results] of Object.entries(systems)) {
        results.issues.forEach(issue => {
          allIssues.push({ ...issue, system: systemName });
        });
        results.recommendations.forEach(rec => {
          allRecommendations.push({ ...rec, system: systemName });
        });
      }
    }
    
    plan += `## Immediate Actions (Critical Issues)\n\n`;
    const criticalIssues = allIssues.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
    if (criticalIssues.length > 0) {
      criticalIssues.forEach((issue, index) => {
        plan += `${index + 1}. **${issue.system}**: ${issue.description}\n`;
        plan += `   - Fix: ${issue.suggestedFix}\n\n`;
      });
    } else {
      plan += `No critical issues identified! 🎉\n\n`;
    }
    
    plan += `## Short-term Improvements (1-2 weeks)\n\n`;
    const highPriorityRecs = allRecommendations.filter(r => r.priority === 'HIGH');
    highPriorityRecs.forEach((rec, index) => {
      plan += `${index + 1}. **${rec.system}**: ${rec.description}\n`;
      plan += `   - Value: ${rec.value}\n`;
      plan += `   - Effort: ${rec.effort}\n\n`;
    });
    
    plan += `## Medium-term Enhancements (1-2 months)\n\n`;
    const mediumPriorityRecs = allRecommendations.filter(r => r.priority === 'MEDIUM');
    mediumPriorityRecs.slice(0, 10).forEach((rec, index) => {
      plan += `${index + 1}. **${rec.system}**: ${rec.description}\n\n`;
    });
    
    plan += `## Testing Priorities\n\n`;
    plan += `### Manual Testing Required\n`;
    plan += `- User experience testing across all systems\n`;
    plan += `- Content accuracy review by AIME philosophy experts\n`;
    plan += `- Cultural sensitivity review by cultural advisors\n`;
    plan += `- Accessibility testing with assistive technologies\n`;
    plan += `- Performance testing under load\n\n`;
    
    plan += `### Automated Testing Setup\n`;
    plan += `- Set up unit tests for core functions\n`;
    plan += `- Implement integration tests for API endpoints\n`;
    plan += `- Add end-to-end testing for user journeys\n`;
    plan += `- Create performance monitoring\n\n`;
    
    fs.writeFileSync(actionPath, plan);
    console.log(`📋 Action plan generated: ${actionPath}`);
  }
}

// Run the comprehensive test if called directly
if (require.main === module) {
  const tester = new PlatformTester();
  tester.runComprehensiveTest().catch(console.error);
}

module.exports = PlatformTester;