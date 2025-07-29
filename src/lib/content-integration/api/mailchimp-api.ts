/**
 * Mailchimp API Integration
 * 
 * This module provides functions to fetch newsletters and campaigns from Mailchimp.
 */

import { ContentItem, RawContent } from '../models/content-item';
import axios from 'axios';

// Mailchimp API configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || '';

// Extract server prefix from API key (e.g., 'us12' from key ending in '-us12')
const getServerPrefix = (apiKey: string): string => {
  const parts = apiKey.split('-');
  return parts.length > 1 ? parts[parts.length - 1] : 'us1';
};

const MAILCHIMP_SERVER = getServerPrefix(MAILCHIMP_API_KEY);
const MAILCHIMP_API_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0`;

/**
 * Fetch all campaigns (newsletters) from Mailchimp with pagination
 * 
 * @param count Maximum number of campaigns to return per request
 * @param offset Offset for pagination
 * @returns Promise<ContentItem[]> Array of newsletter content items
 */
export async function fetchMailchimpCampaigns(
  count: number = 100,
  offset: number = 0
): Promise<ContentItem[]> {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn('Mailchimp API key not found.');
      throw new Error('Mailchimp API key not configured');
    }

    console.log(`Fetching ${count} campaigns from Mailchimp (offset: ${offset})`);

    const response = await axios.get(`${MAILCHIMP_API_URL}/campaigns`, {
      params: {
        count,
        offset,
        status: 'sent', // Only get sent campaigns
        sort_field: 'send_time',
        sort_dir: 'DESC' // Most recent first
      },
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`
      },
      timeout: 30000 // 30 second timeout
    });

    // Convert Mailchimp campaigns to ContentItem array
    const campaigns = response.data.campaigns || [];
    console.log(`Retrieved ${campaigns.length} campaigns from Mailchimp`);
    
    const contentItems = await Promise.all(
      campaigns.map((campaign: any) => normalizeMailchimpCampaign(campaign))
    );

    const validItems = contentItems.filter(item => item !== null);
    console.log(`Successfully processed ${validItems.length} valid newsletters`);
    
    return validItems;
  } catch (error: any) {
    console.error('Error fetching Mailchimp campaigns:', error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 503) {
        throw new Error('Mailchimp service temporarily unavailable (503). Please try again later.');
      } else if (status === 401) {
        throw new Error('Invalid Mailchimp API key or unauthorized access.');
      } else if (status === 429) {
        throw new Error('Mailchimp API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`Mailchimp API error (${status}): ${data?.detail || data?.title || 'Unknown error'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Mailchimp API request timed out. Please try again.');
    } else {
      throw new Error(`Network error connecting to Mailchimp: ${error.message}`);
    }
  }
}

/**
 * Fetch ALL campaigns from Mailchimp using pagination
 * 
 * @returns Promise<ContentItem[]> Array of all newsletter content items
 */
export async function fetchAllMailchimpCampaigns(): Promise<ContentItem[]> {
  if (!MAILCHIMP_API_KEY) {
    throw new Error('Mailchimp API key not configured');
  }

  let allCampaigns: ContentItem[] = [];
  let offset = 0;
  const batchSize = 100; // Mailchimp's max per request
  let hasMore = true;
  let retryCount = 0;
  const maxRetries = 3;

  console.log('🔄 Starting to sync all newsletters from Mailchimp...');

  while (hasMore && retryCount < maxRetries) {
    try {
      console.log(`📥 Fetching batch ${Math.floor(offset / batchSize) + 1} (offset: ${offset})`);
      
      const batch = await fetchMailchimpCampaigns(batchSize, offset);
      
      if (batch.length === 0) {
        hasMore = false;
      } else {
        allCampaigns.push(...batch);
        offset += batchSize;
        
        // If we got less than the batch size, we've reached the end
        if (batch.length < batchSize) {
          hasMore = false;
        }
      }

      // Reset retry count on successful batch
      retryCount = 0;

      // Add a small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error: any) {
      retryCount++;
      console.error(`Error fetching batch ${Math.floor(offset / batchSize) + 1} (attempt ${retryCount}):`, error.message);
      
      if (retryCount >= maxRetries) {
        throw new Error(`Failed to sync newsletters after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait longer before retrying
      const delay = retryCount * 2000; // 2s, 4s, 6s
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.log(`✅ Successfully synced ${allCampaigns.length} newsletters from Mailchimp`);
  return allCampaigns;
}

/**
 * Fetch a specific campaign by ID
 * 
 * @param campaignId Mailchimp campaign ID
 * @returns Promise<ContentItem | null> Newsletter content item or null
 */
export async function fetchMailchimpCampaignById(campaignId: string): Promise<ContentItem | null> {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn('Mailchimp API key not found.');
      return null;
    }

    const response = await axios.get(`${MAILCHIMP_API_URL}/campaigns/${campaignId}`, {
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`
      }
    });

    return await normalizeMailchimpCampaign(response.data);
  } catch (error) {
    console.error(`Error fetching Mailchimp campaign ${campaignId}:`, error);
    return null;
  }
}

/**
 * Fetch campaign content (HTML)
 * 
 * @param campaignId Mailchimp campaign ID
 * @returns Promise<string> Campaign HTML content
 */
export async function fetchCampaignContent(campaignId: string): Promise<string> {
  try {
    if (!MAILCHIMP_API_KEY) {
      return '';
    }

    const response = await axios.get(`${MAILCHIMP_API_URL}/campaigns/${campaignId}/content`, {
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`
      }
    });

    return response.data.html || '';
  } catch (error) {
    console.error(`Error fetching campaign content for ${campaignId}:`, error);
    return '';
  }
}

/**
 * Normalize a Mailchimp campaign to a ContentItem
 * 
 * @param campaign Mailchimp campaign object
 * @returns Promise<ContentItem | null>
 */
async function normalizeMailchimpCampaign(campaign: RawContent): Promise<ContentItem | null> {
  try {
    const settings = campaign.settings || {};
    const recipients = campaign.recipients || {};
    
    // Skip campaigns without proper settings
    if (!settings.subject_line) {
      return null;
    }

    // Fetch campaign content
    const content = await fetchCampaignContent(campaign.id);
    
    // Extract plain text from HTML content for description
    const description = extractTextFromHtml(content).substring(0, 300) + '...';
    
    // Extract themes from subject line and content
    const themes = extractThemesFromNewsletter(settings.subject_line, content);
    
    // Extract topics from content
    const topics = extractTopicsFromNewsletter(content);
    
    // Generate tags based on campaign type and content
    const tags = generateNewsletterTags(campaign, content);

    // Determine newsletter type based on campaign data
    const newsletterType = determineNewsletterType(campaign, settings, content);

    return {
      id: `mailchimp-${campaign.id}`,
      title: settings.subject_line,
      description,
      content,
      contentType: 'newsletter',
      source: 'mailchimp',
      url: campaign.archive_url || '',
      thumbnail: '', // Mailchimp doesn't provide thumbnails
      date: campaign.send_time || campaign.create_time,
      authors: [settings.from_name || 'IMAGI-NATION'],
      tags,
      themes,
      topics,
      metadata: {
        campaignId: campaign.id,
        campaignType: campaign.type,
        newsletterType,
        status: campaign.status,
        emailsSent: campaign.emails_sent,
        listId: recipients.list_id,
        listName: recipients.list_name,
        openRate: campaign.report_summary?.open_rate,
        clickRate: campaign.report_summary?.click_rate,
        fromName: settings.from_name,
        fromEmail: settings.reply_to,
        segmentText: recipients.segment_text,
        recipientCount: recipients.recipient_count,
        updateDetails: {
          updateType: 'newsletter',
          newsletterType,
          publicationDate: campaign.send_time,
          publisher: settings.from_name || 'IMAGI-NATION'
        }
      }
    };
  } catch (error) {
    console.error('Error normalizing Mailchimp campaign:', error);
    return null;
  }
}

/**
 * Determine newsletter type based on campaign data
 * 
 * @param campaign Mailchimp campaign object
 * @param settings Campaign settings
 * @param content Campaign content
 * @returns Newsletter type
 */
function determineNewsletterType(campaign: RawContent, settings: RawContent, content: string): string {
  const subject = settings.subject_line?.toLowerCase() || '';
  const contentLower = content.toLowerCase();
  
  // Check for specific newsletter types based on subject line and content
  if (subject.includes('weekly') || subject.includes('week')) {
    return 'weekly';
  } else if (subject.includes('monthly') || subject.includes('month')) {
    return 'monthly';
  } else if (subject.includes('quarterly') || subject.includes('quarter')) {
    return 'quarterly';
  } else if (subject.includes('annual') || subject.includes('year')) {
    return 'annual';
  } else if (subject.includes('special') || subject.includes('announcement')) {
    return 'special';
  } else if (subject.includes('update') || contentLower.includes('update')) {
    return 'update';
  } else if (subject.includes('digest') || contentLower.includes('digest')) {
    return 'digest';
  } else if (subject.includes('spotlight') || contentLower.includes('spotlight')) {
    return 'spotlight';
  } else if (subject.includes('event') || contentLower.includes('workshop') || contentLower.includes('webinar')) {
    return 'event';
  } else if (subject.includes('research') || contentLower.includes('research') || contentLower.includes('findings')) {
    return 'research';
  } else {
    return 'general';
  }
}

/**
 * Extract plain text from HTML content
 * 
 * @param html HTML content
 * @returns Plain text
 */
function extractTextFromHtml(html: string): string {
  // Simple HTML tag removal - in production, you might want to use a proper HTML parser
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract themes from newsletter subject and content
 * 
 * @param subject Newsletter subject line
 * @param content Newsletter HTML content
 * @returns Array of themes
 */
function extractThemesFromNewsletter(subject: string, content: string): { id: string; name: string; relevance: number }[] {
  const text = `${subject} ${extractTextFromHtml(content)}`.toLowerCase();
  
  const themeKeywords = {
    'Education': ['education', 'learning', 'school', 'teaching', 'classroom', 'curriculum'],
    'Innovation': ['innovation', 'technology', 'future', 'digital', 'creative'],
    'Community': ['community', 'collaboration', 'partnership', 'network', 'connection'],
    'Research': ['research', 'study', 'findings', 'analysis', 'data', 'insights'],
    'Events': ['event', 'workshop', 'webinar', 'conference', 'training', 'program'],
    'Stories': ['story', 'journey', 'experience', 'impact', 'narrative', 'testimonial'],
    'Tools': ['tool', 'resource', 'guide', 'toolkit', 'template', 'framework'],
    'Global': ['global', 'international', 'worldwide', 'countries', 'nations'],
    'Youth': ['youth', 'young', 'student', 'children', 'kids', 'generation'],
    'Indigenous': ['indigenous', 'aboriginal', 'native', 'traditional', 'cultural']
  };

  const themes: { id: string; name: string; relevance: number }[] = [];

  Object.entries(themeKeywords).forEach(([themeName, keywords]) => {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > 0) {
      themes.push({
        id: `theme-${themeName.toLowerCase()}`,
        name: themeName,
        relevance: Math.min(matches * 20, 100) // Max 100% relevance
      });
    }
  });

  return themes.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Extract topics from newsletter content
 * 
 * @param content Newsletter HTML content
 * @returns Array of topics
 */
function extractTopicsFromNewsletter(content: string): { id: string; name: string; keywords?: string[] }[] {
  const text = extractTextFromHtml(content).toLowerCase();
  
  const topicKeywords = [
    'imagination', 'creativity', 'mentoring', 'leadership', 'empowerment',
    'equity', 'inclusion', 'diversity', 'sustainability', 'environment',
    'wellbeing', 'mental health', 'social impact', 'systems change',
    'policy', 'advocacy', 'funding', 'grants', 'partnerships'
  ];

  const topics: { id: string; name: string; keywords?: string[] }[] = [];

  topicKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      topics.push({
        id: `topic-${keyword.replace(/\s+/g, '-')}`,
        name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        keywords: [keyword]
      });
    }
  });

  return topics;
}

/**
 * Generate tags for newsletter based on campaign data and content
 * 
 * @param campaign Mailchimp campaign object
 * @param content Newsletter HTML content
 * @returns Array of tags
 */
function generateNewsletterTags(campaign: RawContent, content: string): string[] {
  const tags = ['newsletter', 'update'];
  
  // Add campaign type
  if (campaign.type) {
    tags.push(campaign.type);
  }
  
  // Add date-based tags
  if (campaign.send_time) {
    const date = new Date(campaign.send_time);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
    tags.push(`${year}`, month);
  }
  
  // Add content-based tags
  const text = extractTextFromHtml(content).toLowerCase();
  const contentTags = [
    'announcement', 'news', 'update', 'feature', 'spotlight',
    'interview', 'story', 'event', 'workshop', 'program'
  ];
  
  contentTags.forEach(tag => {
    if (text.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Search newsletters by query
 * 
 * @param query Search query
 * @param count Maximum number of results
 * @returns Promise<ContentItem[]> Array of matching newsletters
 */
export async function searchMailchimpCampaigns(
  query: string,
  count: number = 20
): Promise<ContentItem[]> {
  try {
    // Fetch all campaigns and filter locally
    // In a production system, you might want to implement server-side search
    const allCampaigns = await fetchMailchimpCampaigns(100);
    
    if (!query) return allCampaigns.slice(0, count);
    
    const lowerQuery = query.toLowerCase();
    
    return allCampaigns
      .filter(campaign => 
        campaign.title.toLowerCase().includes(lowerQuery) ||
        campaign.description.toLowerCase().includes(lowerQuery) ||
        campaign.content?.toLowerCase().includes(lowerQuery) ||
        campaign.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        campaign.themes?.some(theme => theme.name.toLowerCase().includes(lowerQuery))
      )
      .slice(0, count);
  } catch (error) {
    console.error('Error searching Mailchimp campaigns:', error);
    return [];
  }
}

/**
 * Get newsletter statistics
 * 
 * @returns Promise<object> Newsletter statistics
 */
export async function getNewsletterStats(): Promise<{
  totalNewsletters: number;
  totalSubscribers: number;
  averageOpenRate: number;
  averageClickRate: number;
}> {
  try {
    if (!MAILCHIMP_API_KEY) {
      return {
        totalNewsletters: 0,
        totalSubscribers: 0,
        averageOpenRate: 0,
        averageClickRate: 0
      };
    }

    // Fetch campaigns for stats
    const campaigns = await fetchMailchimpCampaigns(100);
    
    // Fetch list info for subscriber count
    let totalSubscribers = 0;
    if (MAILCHIMP_AUDIENCE_ID) {
      try {
        const listResponse = await axios.get(`${MAILCHIMP_API_URL}/lists/${MAILCHIMP_AUDIENCE_ID}`, {
          headers: {
            Authorization: `Bearer ${MAILCHIMP_API_KEY}`
          }
        });
        totalSubscribers = listResponse.data.stats?.member_count || 0;
      } catch (error) {
        console.error('Error fetching list stats:', error);
      }
    }

    // Calculate averages
    const campaignsWithStats = campaigns.filter(c => c.metadata?.openRate && c.metadata?.clickRate);
    const averageOpenRate = campaignsWithStats.length > 0 
      ? campaignsWithStats.reduce((sum, c) => sum + (c.metadata?.openRate || 0), 0) / campaignsWithStats.length
      : 0;
    const averageClickRate = campaignsWithStats.length > 0
      ? campaignsWithStats.reduce((sum, c) => sum + (c.metadata?.clickRate || 0), 0) / campaignsWithStats.length
      : 0;

    return {
      totalNewsletters: campaigns.length,
      totalSubscribers,
      averageOpenRate: Math.round(averageOpenRate * 100) / 100,
      averageClickRate: Math.round(averageClickRate * 100) / 100
    };
  } catch (error) {
    console.error('Error getting newsletter stats:', error);
    return {
      totalNewsletters: 0,
      totalSubscribers: 0,
      averageOpenRate: 0,
      averageClickRate: 0
    };
  }
}