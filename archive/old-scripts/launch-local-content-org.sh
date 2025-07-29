#!/bin/bash

# Local development server launcher script for content organization testing
# This script launches the application with all content organization features enabled

echo "Starting local development server with content organization features enabled..."

# Create .env.local file with feature flags enabled
cat > .env.local << EOL
# Content Organization Feature Flags
ENABLE_PURPOSE_CLASSIFICATION=true
ENABLE_CONTENT_FILTERING=true
ENABLE_CONTENT_RELATIONSHIPS=true
ENABLE_SEARCH_INTEGRATION=true
ENABLE_PURPOSE_NAVIGATION=true
ENABLE_HOME_PAGE_INTEGRATION=true
ENABLE_RELATED_CONTENT=true
ENABLE_CONTENT_FILTERS=true
ENABLE_STORY_HUB=true
ENABLE_RESEARCH_HUB=true
ENABLE_EVENT_HUB=true
ENABLE_UPDATE_HUB=true
ENABLE_TOOL_HUB=true

# Debug settings
NEXT_PUBLIC_CONTENT_DEBUG=true
EOL

echo "Created .env.local with content organization features enabled"

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the development server
echo "Starting Next.js development server..."
npx next dev