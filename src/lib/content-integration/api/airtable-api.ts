/**
 * Airtable API Integration
 * 
 * This module provides functions to fetch content from Airtable.
 */

import { ContentItem, RawContent } from '../models/content-item';
import axios from 'axios';

// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Fetch records from an Airtable table
 * 
 * @param tableName Airtable table name
 * @param view Airtable view name
 * @param maxRecords Maximum number of records to return
 * @returns Promise<ContentItem[]> Array of content items
 */
export async function fetchAirtableRecords(
  tableName: string,
  view?: string,
  maxRecords: number = 100
): Promise<ContentItem[]> {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.warn('Airtable API key or base ID not found. Using mock data instead.');
      return [];
    }

    const response = await axios.get(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableName}`, {
      params: {
        view,
        maxRecords
      },
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    // Convert Airtable API response to ContentItem array
    return response.data.records.map((record: any) => normalizeAirtableRecord(record, tableName));
  } catch (error) {
    console.error(`Error fetching Airtable records from ${tableName}:`, error);
    return [];
  }
}

/**
 * Normalize an Airtable record to a ContentItem
 * 
 * @param record Airtable record object
 * @param tableName Airtable table name
 * @returns ContentItem
 */
function normalizeAirtableRecord(record: RawContent, tableName: string): ContentItem {
  const fields = record.fields;
  
  // Determine content type based on table name
  let contentType: 'document' | 'resource' | 'toolkit' | 'event' | 'newsletter';
  switch (tableName.toLowerCase()) {
    case 'events':
      contentType = 'event';
      break;
    case 'newsletters':
      contentType = 'newsletter';
      break;
    case 'toolkits':
      contentType = 'toolkit';
      break;
    case 'resources':
      contentType = 'resource';
      break;
    default:
      contentType = 'document';
  }
  
  // Extract tags from record
  const tags = fields.Tags ? fields.Tags.split(',').map((tag: string) => tag.trim()) : [];
  
  // Extract themes from record
  const themes = fields.Themes ? fields.Themes.map((theme: string, index: number) => ({
    id: `theme-${theme.toLowerCase().replace(/\s+/g, '-')}`,
    name: theme,
    relevance: 80 - (index * 10) // Decrease relevance for each additional theme
  })) : [];
  
  // Extract topics from record
  const topics = fields.Topics ? fields.Topics.map((topic: string) => ({
    id: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
    name: topic,
    keywords: [topic.toLowerCase()]
  })) : [];
  
  // Extract authors from record
  const authors = fields.Authors ? 
    (Array.isArray(fields.Authors) ? fields.Authors : [fields.Authors]) : 
    [];
  
  // Build content item
  const contentItem: ContentItem = {
    id: `airtable-${record.id}`,
    title: fields.Title || fields.Name || 'Untitled',
    description: fields.Description || '',
    contentType,
    source: 'airtable',
    url: fields.URL || '',
    thumbnail: fields.Thumbnail?.[0]?.url || fields.Image?.[0]?.url || '',
    date: fields.Date || fields.PublishedDate || fields.CreatedDate || record.createdTime,
    authors,
    tags,
    themes,
    topics,
    metadata: {
      recordId: record.id,
      tableName,
      ...fields
    }
  };
  
  // Add event-specific fields
  if (contentType === 'event' && fields.EventType) {
    contentItem.metadata.eventDetails = {
      eventType: fields.EventType.toLowerCase(),
      startDate: fields.StartDate || fields.Date,
      endDate: fields.EndDate,
      location: fields.Location
    };
  }
  
  // Add newsletter-specific fields
  if (contentType === 'newsletter' && fields.NewsletterType) {
    contentItem.metadata.updateDetails = {
      updateType: fields.NewsletterType.toLowerCase(),
      publicationDate: fields.PublishedDate || fields.Date,
      publisher: fields.Publisher
    };
  }
  
  // Add tool-specific fields
  if (contentType === 'toolkit' && fields.ToolType) {
    contentItem.metadata.toolDetails = {
      toolType: fields.ToolType.toLowerCase(),
      targetAudience: fields.TargetAudience,
      implementationContext: fields.ImplementationContext
    };
  }
  
  // Add research-specific fields
  if (fields.ResearchType) {
    contentItem.metadata.researchDetails = {
      researchType: fields.ResearchType.toLowerCase(),
      keyFindings: fields.KeyFindings,
      methodology: fields.Methodology
    };
  }
  
  // Add story-specific fields
  if (fields.StoryType) {
    contentItem.metadata.storyDetails = {
      storyType: fields.StoryType.toLowerCase(),
      keyQuotes: fields.KeyQuotes,
      protagonists: fields.Protagonists
    };
  }
  
  return contentItem;
}

/**
 * Search Airtable records
 * 
 * @param query Search query
 * @param tables Array of table names to search
 * @returns Promise<ContentItem[]> Array of content items
 */
export async function searchAirtableRecords(
  query: string,
  tables: string[] = ['Content', 'Events', 'Resources']
): Promise<ContentItem[]> {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.warn('Airtable API key or base ID not found. Using mock data instead.');
      return [];
    }

    // Fetch records from each table
    const recordPromises = tables.map(tableName => 
      fetchAirtableRecords(tableName)
    );
    
    const allRecords = (await Promise.all(recordPromises)).flat();
    
    // Filter records by query
    const queryLower = query.toLowerCase();
    return allRecords.filter(record => 
      record.title.toLowerCase().includes(queryLower) ||
      record.description.toLowerCase().includes(queryLower) ||
      record.tags?.some(tag => tag.toLowerCase().includes(queryLower)) ||
      record.themes?.some(theme => theme.name.toLowerCase().includes(queryLower)) ||
      record.topics?.some(topic => topic.name.toLowerCase().includes(queryLower))
    );
  } catch (error) {
    console.error('Error searching Airtable records:', error);
    return [];
  }
}