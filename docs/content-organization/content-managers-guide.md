# Content Managers Guide

This guide provides instructions for content managers on how to work with the purpose-based content organization system in the IMAGI-NATION Research Wiki.

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Purpose-Based Organization](#understanding-purpose-based-organization)
3. [Adding New Content](#adding-new-content)
4. [Editing Existing Content](#editing-existing-content)
5. [Organizing Content](#organizing-content)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

The IMAGI-NATION Research Wiki uses a purpose-based content organization system that organizes content based on its primary purpose rather than its source or format. This approach allows users to discover content that serves their specific needs, regardless of where it originated or how it's formatted.

As a content manager, your role is to ensure that content is properly classified, organized, and presented to users in a way that aligns with their needs and expectations.

## Understanding Purpose-Based Organization

### Purpose Types

The system classifies content into five primary purposes:

1. **Stories & Narratives** - Personal journeys, case studies, and impact stories
2. **Research & Insights** - Findings, analysis, and synthesis
3. **Events & Programs** - Workshops, webinars, and training programs
4. **Updates & News** - Newsletters, announcements, and news
5. **Tools & Resources** - Implementation resources and guides

Each content item is assigned a primary purpose and can have multiple secondary purposes. The system also calculates a purpose relevance score for each content item, indicating how strongly it aligns with its primary purpose.

### Purpose-Specific Details

Each purpose type has specific details that can be added to content items:

- **Stories & Narratives** - Story type, key quotes, key moments, protagonists
- **Research & Insights** - Research type, key findings, methodology, data points
- **Events & Programs** - Event type, start/end date, location, registration URL
- **Updates & News** - Update type, publication date, publisher, call to action
- **Tools & Resources** - Tool type, usage instructions, target audience, implementation context

## Adding New Content

When adding new content to the system, follow these steps:

1. **Determine the primary purpose** of the content based on its main function or goal.
2. **Identify any secondary purposes** that the content might serve.
3. **Add purpose-specific details** based on the primary purpose.
4. **Add common metadata** such as title, description, date, tags, themes, topics, etc.
5. **Upload or link to the content** itself.

### Example: Adding a New Story

```json
{
  "title": "Personal Story: My Journey",
  "description": "A personal story about my journey",
  "contentType": "video",
  "source": "youtube",
  "url": "https://youtube.com/watch?v=123",
  "date": "2023-01-01",
  "tags": ["story", "personal", "journey"],
  "themes": [
    { "id": "theme1", "name": "Theme 1" },
    { "id": "theme2", "name": "Theme 2" }
  ],
  "topics": [
    { "id": "topic1", "name": "Topic 1" }
  ],
  "primaryPurpose": "story",
  "secondaryPurposes": ["update"],
  "storyDetails": {
    "storyType": "personal",
    "keyQuotes": [
      "This is a key quote from the story",
      "This is another key quote"
    ],
    "protagonists": ["Person 1"]
  }
}
```

## Editing Existing Content

When editing existing content, consider the following:

1. **Review the primary purpose** and ensure it still accurately reflects the content's main function.
2. **Update purpose-specific details** as needed.
3. **Consider adding or updating secondary purposes** if the content serves multiple functions.
4. **Update common metadata** such as title, description, tags, etc.

## Organizing Content

### Themes and Topics

Themes and topics are used to organize content across purposes. They provide a way to group related content regardless of its primary purpose.

- **Themes** are broad categories that span multiple purposes, such as "Education", "Community", "Innovation", etc.
- **Topics** are more specific subjects within themes, such as "Classroom Teaching", "Community Engagement", "Design Thinking", etc.

When adding or editing content, assign relevant themes and topics to help users discover related content.

### Tags

Tags provide additional ways to categorize and discover content. Unlike themes and topics, tags are more flexible and can be used to highlight specific aspects of content that don't fit into the theme/topic hierarchy.

Use tags to highlight:

- Key concepts
- Geographic regions
- Target audiences
- Time periods
- Methodologies
- And more

### Relationships

The system automatically identifies relationships between content items based on shared themes, topics, tags, authors, and other attributes. However, you can also manually specify relationships between content items when needed.

## Best Practices

### Purpose Classification

- **Be clear about the primary purpose** of each content item.
- **Use secondary purposes sparingly** and only when the content genuinely serves multiple purposes.
- **Add purpose-specific details** to enhance the user experience.

### Metadata

- **Use descriptive titles** that clearly indicate the content's purpose and subject.
- **Write concise descriptions** that summarize the content's key points.
- **Add relevant tags** to improve discoverability.
- **Assign appropriate themes and topics** to help users find related content.

### Content Organization

- **Group related content** using themes and topics.
- **Create clear hierarchies** within each purpose type.
- **Use consistent naming conventions** for content items, themes, topics, and tags.

## Troubleshooting

### Content Not Appearing in Expected Location

If content is not appearing where expected, check:

1. **Primary purpose** - Is the content classified with the correct primary purpose?
2. **Themes and topics** - Are the correct themes and topics assigned?
3. **Tags** - Are relevant tags added to improve discoverability?
4. **Visibility settings** - Is the content set to be visible?

### Content Not Being Found in Search

If content is not appearing in search results, check:

1. **Search terms** - Are the search terms relevant to the content?
2. **Content metadata** - Does the content have appropriate metadata (title, description, tags, etc.)?
3. **Content indexing** - Has the content been indexed by the search system?

### Incorrect Purpose Classification

If content is being classified with an incorrect purpose, check:

1. **Content metadata** - Does the content have clear indicators of its purpose in the title, description, or tags?
2. **Manual override** - Consider manually overriding the purpose classification if needed.

For additional help or questions, please contact the system administrator.