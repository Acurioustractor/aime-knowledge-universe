#!/usr/bin/env node

/**
 * User Testing Setup Script
 * 
 * Creates comprehensive user testing scenarios and tracking setup
 */

const fs = require('fs');
const path = require('path');

// User personas for testing
const USER_PERSONAS = {
  newVisitor: {
    name: "New Visitor",
    description: "First-time visitor curious about AIME",
    goals: ["Understand what AIME is", "Learn about Indigenous approaches", "Find relevant content"],
    entryPoints: ["/", "/understanding", "/discover"],
    successCriteria: ["Can explain AIME's mission", "Understands key concepts", "Finds interesting content"]
  },
  
  educator: {
    name: "Educator",
    description: "Teacher or educational professional seeking resources",
    goals: ["Find teaching resources", "Understand mentoring methodology", "Access business cases"],
    entryPoints: ["/discover", "/wiki", "/business-cases"],
    successCriteria: ["Finds relevant tools", "Understands implementation", "Downloads resources"]
  },
  
  researcher: {
    name: "Researcher",
    description: "Academic or policy researcher studying Indigenous systems",
    goals: ["Deep dive into philosophy", "Find research data", "Understand methodologies"],
    entryPoints: ["/understanding", "/wiki", "/research"],
    successCriteria: ["Grasps philosophical depth", "Finds citations", "Understands frameworks"]
  },
  
  partner: {
    name: "Potential Partner",
    description: "Organization considering partnership with AIME",
    goals: ["Understand partnership models", "See success stories", "Find contact information"],
    entryPoints: ["/", "/business-cases", "/understanding"],
    successCriteria: ["Understands value proposition", "Sees relevant examples", "Initiates contact"]
  },
  
  communityMember: {
    name: "Community Member",
    description: "Someone from AIME community or Indigenous background",
    goals: ["Stay updated", "Access resources", "Connect with others"],
    entryPoints: ["/", "/discover", "/connect"],
    successCriteria: ["Finds updates", "Accesses tools", "Feels represented"]
  }
};

// Testing scenarios
const TESTING_SCENARIOS = {
  scenario1: {
    title: "First Impression & Understanding",
    persona: "newVisitor",
    duration: "10-15 minutes",
    tasks: [
      "Visit the homepage and spend 2 minutes exploring",
      "Explain what AIME does in your own words",
      "Find information about 'Hoodie Economics'",
      "Navigate to the Understanding section",
      "Choose one philosophical framework to explore"
    ],
    metrics: ["Time to understanding", "Navigation success", "Concept comprehension"],
    questions: [
      "What is your first impression of AIME?",
      "What does 'Hoodie Economics' mean to you?",
      "How would you describe AIME's approach to education?",
      "What questions do you still have?"
    ]
  },
  
  scenario2: {
    title: "Resource Discovery & Application",
    persona: "educator",
    duration: "15-20 minutes",
    tasks: [
      "Find a business case relevant to education",
      "Locate the mentoring methodology",
      "Search for 'indigenous systems thinking'",
      "Find practical tools you could use",
      "Explore the wiki for additional resources"
    ],
    metrics: ["Search success rate", "Resource relevance", "Tool accessibility"],
    questions: [
      "How relevant were the resources you found?",
      "What would you implement first?",
      "What additional resources do you need?",
      "How clear were the implementation guides?"
    ]
  },
  
  scenario3: {
    title: "Deep Philosophical Exploration",
    persona: "researcher",
    duration: "20-25 minutes",
    tasks: [
      "Explore Indigenous knowledge systems in depth",
      "Find connections between different concepts",
      "Read a complete framing document",
      "Identify research methodologies used",
      "Locate citations or references"
    ],
    metrics: ["Depth of exploration", "Concept connections", "Research utility"],
    questions: [
      "How well does the platform support deep research?",
      "What philosophical concepts were clearest?",
      "How useful are the cross-references?",
      "What academic features are missing?"
    ]
  },
  
  scenario4: {
    title: "Partnership Exploration",
    persona: "partner",
    duration: "15-20 minutes",
    tasks: [
      "Understand AIME's partnership approach",
      "Find examples of successful partnerships",
      "Explore the economic framework",
      "Locate contact information",
      "Assess alignment with your organization"
    ],
    metrics: ["Partnership clarity", "Example relevance", "Contact accessibility"],
    questions: [
      "How clear is AIME's partnership model?",
      "Which examples were most relevant?",
      "What would be your next step?",
      "What concerns do you have?"
    ]
  }
};

// Analytics tracking setup
const ANALYTICS_EVENTS = {
  navigation: [
    "page_view",
    "section_change",
    "breadcrumb_click",
    "menu_interaction"
  ],
  
  content: [
    "document_open",
    "concept_hover",
    "search_query",
    "filter_applied"
  ],
  
  engagement: [
    "time_on_page",
    "scroll_depth",
    "link_click",
    "download_start"
  ],
  
  conversion: [
    "contact_form",
    "newsletter_signup",
    "resource_download",
    "external_link"
  ]
};

function generateTestingScript() {
  const script = `# AIME Knowledge Platform - User Testing Script

## Pre-Testing Setup

### Participant Information
- **Name**: _______________
- **Role**: _______________
- **Experience with AIME**: _______________
- **Technical Comfort Level**: _______________

### Testing Environment
- **Device**: Desktop/Mobile/Tablet
- **Browser**: _______________
- **Screen Recording**: Started ✓
- **Audio Recording**: Started ✓

## Testing Scenarios

${Object.entries(TESTING_SCENARIOS).map(([key, scenario]) => `
### ${scenario.title}
**Persona**: ${scenario.persona}  
**Duration**: ${scenario.duration}

#### Tasks:
${scenario.tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}

#### Observation Notes:
- Navigation patterns: _______________
- Confusion points: _______________
- Success indicators: _______________
- Emotional responses: _______________

#### Post-Task Questions:
${scenario.questions.map(q => `- ${q}`).join('\n')}

#### Metrics Collected:
${scenario.metrics.map(m => `- ${m}: _______________`).join('\n')}

---
`).join('')}

## Post-Testing Interview

### Overall Experience
1. What was your overall impression of the platform?
2. What worked well for you?
3. What was confusing or frustrating?
4. What would you change?

### Content Quality
1. How relevant was the content to your needs?
2. Was the information presented clearly?
3. What additional content would be helpful?
4. How trustworthy did the information seem?

### Navigation & Usability
1. How easy was it to find what you were looking for?
2. Did the navigation make sense?
3. What would improve the user experience?
4. Any technical issues encountered?

### Value Proposition
1. What value does this platform provide?
2. Would you return to use it again?
3. Would you recommend it to others?
4. What would motivate you to engage more?

## Quantitative Metrics

### Task Completion
${Object.entries(TESTING_SCENARIOS).map(([key, scenario]) => `
- **${scenario.title}**: ___/5 tasks completed
`).join('')}

### Time Metrics
- Total session time: _______________
- Time to first success: _______________
- Average task completion time: _______________

### Engagement Metrics
- Pages visited: _______________
- Search queries: _______________
- Documents opened: _______________
- External links clicked: _______________

### Satisfaction Scores (1-10)
- Ease of use: _______________
- Content quality: _______________
- Visual design: _______________
- Overall satisfaction: _______________
- Likelihood to recommend: _______________

## Follow-up Actions
- [ ] Send thank you email
- [ ] Share relevant resources
- [ ] Schedule follow-up if interested
- [ ] Add to user feedback database
`;

  return script;
}

function generateAnalyticsSetup() {
  return `// Analytics Setup for User Testing
// Add to your analytics configuration

const userTestingEvents = ${JSON.stringify(ANALYTICS_EVENTS, null, 2)};

// Track user testing sessions
function trackTestingSession(sessionId, persona, scenario) {
  // Your analytics implementation
  analytics.track('testing_session_start', {
    sessionId,
    persona,
    scenario,
    timestamp: new Date().toISOString()
  });
}

// Track task completion
function trackTaskCompletion(sessionId, taskId, success, duration) {
  analytics.track('task_completion', {
    sessionId,
    taskId,
    success,
    duration,
    timestamp: new Date().toISOString()
  });
}

// Track user feedback
function trackUserFeedback(sessionId, feedback) {
  analytics.track('user_feedback', {
    sessionId,
    feedback,
    timestamp: new Date().toISOString()
  });
}
`;
}

function main() {
  console.log('🧪 Generating User Testing Materials');
  
  // Create testing directory
  const testingDir = 'docs/user-testing';
  if (!fs.existsSync(testingDir)) {
    fs.mkdirSync(testingDir, { recursive: true });
  }
  
  // Generate testing script
  const testingScript = generateTestingScript();
  fs.writeFileSync(path.join(testingDir, 'testing-script.md'), testingScript);
  
  // Generate analytics setup
  const analyticsSetup = generateAnalyticsSetup();
  fs.writeFileSync(path.join(testingDir, 'analytics-setup.js'), analyticsSetup);
  
  // Generate persona profiles
  const personaProfiles = Object.entries(USER_PERSONAS).map(([key, persona]) => `
# ${persona.name} Persona

## Description
${persona.description}

## Goals
${persona.goals.map(goal => `- ${goal}`).join('\n')}

## Typical Entry Points
${persona.entryPoints.map(entry => `- ${entry}`).join('\n')}

## Success Criteria
${persona.successCriteria.map(criteria => `- ${criteria}`).join('\n')}
`).join('\n---\n');
  
  fs.writeFileSync(path.join(testingDir, 'user-personas.md'), personaProfiles);
  
  // Generate testing checklist
  const checklist = `# User Testing Checklist

## Pre-Testing Setup
- [ ] Recruit 5-8 participants per persona
- [ ] Set up screen recording software
- [ ] Prepare testing environment
- [ ] Configure analytics tracking
- [ ] Print testing scripts
- [ ] Prepare consent forms

## During Testing
- [ ] Start recordings
- [ ] Follow script consistently
- [ ] Take detailed notes
- [ ] Ask follow-up questions
- [ ] Track quantitative metrics
- [ ] Note emotional responses

## Post-Testing
- [ ] Compile session notes
- [ ] Analyze quantitative data
- [ ] Identify common patterns
- [ ] Prioritize improvements
- [ ] Create action plan
- [ ] Share results with team

## Tools Needed
- [ ] Screen recording software (Loom, OBS)
- [ ] Note-taking app (Notion, Google Docs)
- [ ] Timer for tasks
- [ ] Analytics dashboard access
- [ ] Feedback collection form
`;
  
  fs.writeFileSync(path.join(testingDir, 'testing-checklist.md'), checklist);
  
  console.log('✅ User testing materials generated:');
  console.log(`   📄 Testing script: ${testingDir}/testing-script.md`);
  console.log(`   👥 User personas: ${testingDir}/user-personas.md`);
  console.log(`   📊 Analytics setup: ${testingDir}/analytics-setup.js`);
  console.log(`   ✅ Testing checklist: ${testingDir}/testing-checklist.md`);
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Review and customize testing materials');
  console.log('   2. Recruit test participants');
  console.log('   3. Set up testing environment');
  console.log('   4. Configure analytics tracking');
  console.log('   5. Schedule testing sessions');
}

main();