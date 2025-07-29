// Analytics Setup for User Testing
// Add to your analytics configuration

const userTestingEvents = {
  "navigation": [
    "page_view",
    "section_change",
    "breadcrumb_click",
    "menu_interaction"
  ],
  "content": [
    "document_open",
    "concept_hover",
    "search_query",
    "filter_applied"
  ],
  "engagement": [
    "time_on_page",
    "scroll_depth",
    "link_click",
    "download_start"
  ],
  "conversion": [
    "contact_form",
    "newsletter_signup",
    "resource_download",
    "external_link"
  ]
};

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
