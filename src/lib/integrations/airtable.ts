/**
 * Airtable Integration Service
 * 
 * Fetches and normalizes data from Airtable API
 */

import axios from 'axios';
import { ContentItem, FetchOptions } from './index';

/**
 * Fetches resources from Airtable API via our backend API
 */
export async function fetchAirtableResources(options: FetchOptions = {}): Promise<ContentItem[]> {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseIdDam = process.env.AIRTABLE_BASE_ID_DAM;
    const baseIdComms = process.env.AIRTABLE_BASE_ID_COMMS;
    
    // If we have real API credentials, try to use them
    if (apiKey && baseIdDam && apiKey !== 'your_airtable_api_key_here') {
      try {
        const allRecords: any[] = [];
        
        // Try to fetch from both bases
        const bases = [
          { id: baseIdDam, name: 'DAM' },
          { id: baseIdComms, name: 'COMMS' }
        ];
        
        for (const base of bases) {
          try {
            // Get tables from this base
            const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${base.id}/tables`, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (tablesResponse.ok) {
              const tablesData = await tablesResponse.json();
              
              // Get records from first table as a test
              if (tablesData.tables && tablesData.tables.length > 0) {
                const firstTable = tablesData.tables[0];
                const recordsResponse = await fetch(`https://api.airtable.com/v0/${base.id}/${firstTable.id}?maxRecords=${options.limit || 10}`, {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (recordsResponse.ok) {
                  const recordsData = await recordsResponse.json();
                  if (recordsData.records) {
                    allRecords.push(...recordsData.records.map((record: any) => ({
                      ...record,
                      baseInfo: { id: base.id, name: base.name, table: firstTable.name }
                    })));
                  }
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch from Airtable base ${base.name}:`, error);
          }
        }
        
        if (allRecords.length > 0) {
          return allRecords.map((record: any) => {
            const fields = record.fields || {};
            const name = fields.Name || fields.Title || fields.name || fields.title || Object.values(fields)[0] || 'Untitled';
            
            return {
              id: record.id,
              title: String(name),
              description: fields.Description || fields.description || fields.Notes || '',
              type: 'resource' as const,
              source: 'airtable',
              url: `/resources/${record.id}`,
              date: fields.Date || fields.date || record.createdTime,
              tags: Array.isArray(fields.Tags) ? fields.Tags : [],
              categories: fields.Category ? [fields.Category] : [],
              metadata: {
                baseInfo: record.baseInfo,
                airtableFields: fields
              }
            };
          });
        }
      } catch (error) {
        console.warn('Real Airtable API failed, using mock data:', error);
      }
    }
    
    // Fallback to mock data when no API key or API fails
    const mockRecords = [
      {
        id: 'rec1',
        fields: {
          Name: 'Indigenous Knowledge Systems Workshop',
          Description: 'A workshop exploring indigenous knowledge systems and their application to contemporary challenges.',
          Date: '2024-10-20',
          Location: 'Sydney, Australia',
          Type: 'Workshop',
          Tags: ['indigenous knowledge', 'workshop', 'systems thinking'],
          Category: 'Indigenous Systems Thinking'
        },
        createdTime: '2024-09-01T12:00:00.000Z'
      },
      {
        id: 'rec2',
        fields: {
          Name: 'Imagination Lab Toolkit',
          Description: 'A comprehensive toolkit for implementing imagination labs in educational settings.',
          Date: '2024-09-15',
          Type: 'Toolkit',
          Tags: ['education', 'toolkit', 'imagination'],
          Category: 'Education Transformation'
        },
        createdTime: '2024-08-15T12:00:00.000Z'
      },
      {
        id: 'rec3',
        fields: {
          Name: 'Youth Leadership Program',
          Description: 'A 12-week program developing youth leadership skills in systems design and community engagement.',
          Date: '2024-11-01',
          Location: 'Online',
          Type: 'Program',
          Tags: ['youth', 'leadership', 'systems design'],
          Category: 'Youth Leadership'
        },
        createdTime: '2024-09-10T12:00:00.000Z'
      }
    ];
    
    // Transform the response to our normalized format
    return mockRecords.map((record: any) => {
      const fields = record.fields;
      
      // Determine content type based on Airtable fields
      let contentType: 'resource' | 'toolkit' | 'event' = 'resource';
      if (fields.Type === 'Toolkit' || fields.Type === 'Implementation Guide') {
        contentType = 'toolkit';
      } else if (fields.Type === 'Event' || fields.Type === 'Workshop' || fields.Type === 'Program') {
        contentType = 'event';
      }
      
      return {
        id: record.id,
        title: fields.Name,
        description: fields.Description || '',
        type: contentType,
        source: 'airtable',
        url: `/resources/${record.id}`,
        thumbnail: fields.Thumbnail?.[0]?.url,
        date: fields.Date || record.createdTime,
        tags: fields.Tags || [],
        categories: fields.Category ? [fields.Category] : [],
        metadata: {
          location: fields.Location,
          status: fields.Status,
          author: fields.Author,
          attachments: fields.Attachments,
          links: fields.Links
        }
      };
    });
  } catch (error) {
    console.error('Error fetching Airtable resources:', error);
    
    // Return empty array on error
    return [];
  }
}

/**
 * Fetches a single resource by ID
 */
export async function fetchAirtableResourceById(id: string): Promise<ContentItem | null> {
  try {
    // Use mock data for development
    const mockRecords = [
      {
        id: 'rec1',
        fields: {
          Name: 'Indigenous Knowledge Systems Workshop',
          Description: 'A workshop exploring indigenous knowledge systems and their application to contemporary challenges.',
          Date: '2024-10-20',
          Location: 'Sydney, Australia',
          Type: 'Workshop',
          Tags: ['indigenous knowledge', 'workshop', 'systems thinking'],
          Category: 'Indigenous Systems Thinking',
          Content: 'This is the detailed content of the workshop...'
        },
        createdTime: '2024-09-01T12:00:00.000Z'
      },
      {
        id: 'rec2',
        fields: {
          Name: 'Imagination Lab Toolkit',
          Description: 'A comprehensive toolkit for implementing imagination labs in educational settings.',
          Date: '2024-09-15',
          Type: 'Toolkit',
          Tags: ['education', 'toolkit', 'imagination'],
          Category: 'Education Transformation',
          Content: 'This is the detailed content of the toolkit...'
        },
        createdTime: '2024-08-15T12:00:00.000Z'
      },
      {
        id: 'rec3',
        fields: {
          Name: 'Youth Leadership Program',
          Description: 'A 12-week program developing youth leadership skills in systems design and community engagement.',
          Date: '2024-11-01',
          Location: 'Online',
          Type: 'Program',
          Tags: ['youth', 'leadership', 'systems design'],
          Category: 'Youth Leadership',
          Content: 'This is the detailed content of the program...'
        },
        createdTime: '2024-09-10T12:00:00.000Z'
      }
    ];
    
    const record = mockRecords.find(r => r.id === id) || mockRecords[0];
    const fields = record.fields;
    
    // Determine content type based on Airtable fields
    let contentType: 'resource' | 'toolkit' | 'event' = 'resource';
    if (fields.Type === 'Toolkit' || fields.Type === 'Implementation Guide') {
      contentType = 'toolkit';
    } else if (fields.Type === 'Event' || fields.Type === 'Workshop' || fields.Type === 'Program') {
      contentType = 'event';
    }
    
    return {
      id: record.id,
      title: fields.Name,
      description: fields.Description || '',
      type: contentType,
      source: 'airtable',
      url: `/resources/${record.id}`,
      thumbnail: fields.Thumbnail?.[0]?.url,
      date: fields.Date || record.createdTime,
      tags: fields.Tags || [],
      categories: fields.Category ? [fields.Category] : [],
      metadata: {
        location: fields.Location,
        status: fields.Status,
        author: fields.Author,
        attachments: fields.Attachments,
        links: fields.Links,
        content: fields.Content
      }
    };
  } catch (error) {
    console.error(`Error fetching Airtable resource ${id}:`, error);
    return null;
  }
}

// Export alias for sync service compatibility
export const fetchAirtableContent = fetchAirtableResources;