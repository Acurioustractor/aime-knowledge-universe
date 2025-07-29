# Content Organization by Purpose

This directory contains documentation and code for the purpose-based content organization system for the IMAGI-NATION Wiki.

## Overview

The purpose-based content organization system organizes content by its purpose and value to users, rather than by its technical source. This creates a more intuitive and valuable user experience.

The system includes the following components:

- **Purpose Classifier**: Classifies content by purpose (Stories, Tools, Research, Events, Updates)
- **Content APIs**: Provides access to content by purpose
- **Purpose Hubs**: Presents content based on its purpose
- **Cross-Purpose Features**: Connects content across different purposes

## Local Testing

To test the content organization system locally, follow these steps:

1. **Launch the application with content organization features enabled**:

```bash
./scripts/launch-local-content-org.sh
```

This script creates an `.env.local` file with all content organization feature flags enabled and starts the Next.js development server.

2. **Run the test script to verify that the features are working**:

```bash
./scripts/local-test.sh
```

This script tests the purpose classifier, content filter, and feature flags to ensure they're working correctly.

3. **Open the application in your browser**:

```
http://localhost:3000
```

4. **Test the purpose-based navigation**:

- Navigate to the Stories hub: `/stories`
- Navigate to the Tools hub: `/tools`
- Navigate to the Research hub: `/research`
- Navigate to the Events hub: `/events`
- Navigate to the Updates hub: `/updates`

5. **Test the content filtering**:

- Use the filters on each hub to filter content by theme, date, etc.
- Search for content and use the purpose-based filters in the search results

6. **Test the related content**:

- View a content item and check the related content recommendations
- Click on related content to navigate between different purposes

## Feature Flags

The content organization system uses feature flags to enable or disable features. These flags can be set in the `.env.local` file or as environment variables.

The following feature flags are available:

- `ENABLE_PURPOSE_CLASSIFICATION`: Enable purpose classification
- `ENABLE_CONTENT_FILTERING`: Enable content filtering
- `ENABLE_CONTENT_RELATIONSHIPS`: Enable content relationships
- `ENABLE_SEARCH_INTEGRATION`: Enable search integration
- `ENABLE_PURPOSE_NAVIGATION`: Enable purpose-based navigation
- `ENABLE_HOME_PAGE_INTEGRATION`: Enable home page integration
- `ENABLE_RELATED_CONTENT`: Enable related content
- `ENABLE_CONTENT_FILTERS`: Enable content filters
- `ENABLE_STORY_HUB`: Enable the Stories hub
- `ENABLE_RESEARCH_HUB`: Enable the Research hub
- `ENABLE_EVENT_HUB`: Enable the Events hub
- `ENABLE_UPDATE_HUB`: Enable the Updates hub
- `ENABLE_TOOL_HUB`: Enable the Tools hub

## Debugging

To enable debugging for the content organization system, set the `NEXT_PUBLIC_CONTENT_DEBUG` environment variable to `true`.

This will output debug information to the console, including:

- Purpose classification results
- Content filtering operations
- Content relationship calculations
- Search operations

## Documentation

For more information about the content organization system, see the following documentation:

- [Design Document](./design.md): Detailed design of the content organization system
- [Migration Plan](./migration-plan.md): Plan for migrating existing content
- [API Reference](./api-reference.md): Reference for the content organization APIs
- [Content Managers Guide](./content-managers-guide.md): Guide for content managers

## User Testing

For information about user testing the content organization system, see the following documentation:

- [Test Plan](./user-testing/test-plan.md): Plan for testing the content organization system
- [Facilitator Script](./user-testing/facilitator-script.md): Script for facilitating user testing sessions
- [Pre-Test Questionnaire](./user-testing/pre-test-questionnaire.md): Questionnaire for participants before testing
- [Post-Test Interview](./user-testing/post-test-interview.md): Interview guide for after testing
- [Results Template](./user-testing/results-template.md): Template for recording test results