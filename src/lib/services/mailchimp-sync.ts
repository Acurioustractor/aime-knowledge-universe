/**
 * Mailchimp Sync Service with Rate Limiting
 * 
 * This service handles syncing Mailchimp campaigns to the local database
 * with proper rate limiting to avoid API limits.
 */

import { getContentRepository } from '../database/connection';
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

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_CONCURRENT: 5, // Max 5 concurrent requests (well below Mailchimp's 10 limit)
  DELAY_BETWEEN_BATCHES: 2000, // 2 second delay between batches
  RETRY_DELAY: 5000, // 5 second delay on rate limit hit
  MAX_RETRIES: 3
};

export class MailchimpSyncService {
  private isRunning = false;
  private activeRequests = 0;

  /**
   * Full sync of all Mailchimp campaigns to database
   */
  async syncAllCampaigns(): Promise<{ success: boolean; synced: number; error?: string }> {
    if (this.isRunning) {
      return { success: false, synced: 0, error: 'Sync already in progress' };
    }

    if (!MAILCHIMP_API_KEY) {
      return { success: false, synced: 0, error: 'Mailchimp API key not configured' };
    }

    this.isRunning = true;
    console.log('📧 Starting full Mailchimp campaigns sync...');

    try {
      const repository = await getContentRepository();
      let totalSynced = 0;
      let offset = 0;
      const batchSize = 100;
      let hasMore = true;

      while (hasMore) {
        console.log(`📧 Fetching campaigns batch: offset ${offset}, limit ${batchSize}`);

        // Fetch campaigns with rate limiting
        const campaigns = await this.fetchCampaignsBatch(offset, batchSize);
        
        if (campaigns.length === 0) {
          hasMore = false;
          break;
        }

        // Fetch content for each campaign (with rate limiting)
        const campaignsWithContent = await this.fetchCampaignContents(campaigns);

        // Batch upsert to database
        const synced = await repository.batchUpsertNewsletters(campaignsWithContent);
        totalSynced += synced;

        console.log(`📧 Synced batch: ${synced} campaigns (total: ${totalSynced})`);

        // Check if we have more campaigns to fetch
        hasMore = campaigns.length === batchSize;
        offset += batchSize;

        // Delay between batches to respect rate limits
        if (hasMore) {
          console.log(`📧 Waiting ${RATE_LIMIT.DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await this.delay(RATE_LIMIT.DELAY_BETWEEN_BATCHES);
        }
      }

      console.log(`✅ Mailchimp sync completed: ${totalSynced} campaigns synced`);
      return { success: true, synced: totalSynced };

    } catch (error) {
      console.error('❌ Mailchimp sync failed:', error);
      return { 
        success: false, 
        synced: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Fetch a batch of campaigns from Mailchimp API
   */
  private async fetchCampaignsBatch(offset: number, count: number): Promise<any[]> {
    const url = `${MAILCHIMP_API_URL}/campaigns`;
    
    try {
      const response = await this.makeRateLimitedRequest(url, {
        params: {
          count,
          offset,
          status: 'sent',
          sort_field: 'send_time',
          sort_dir: 'DESC'
        }
      });

      return response.campaigns || [];
    } catch (error) {
      console.error(`Error fetching campaigns batch (offset: ${offset}):`, error);
      return [];
    }
  }

  /**
   * Fetch content for multiple campaigns with rate limiting
   */
  private async fetchCampaignContents(campaigns: any[]): Promise<any[]> {
    console.log(`📧 Fetching content for ${campaigns.length} campaigns...`);

    const campaignsWithContent = [];
    
    // Process campaigns in smaller batches to respect rate limits
    const batchSize = RATE_LIMIT.MAX_CONCURRENT;
    
    for (let i = 0; i < campaigns.length; i += batchSize) {
      const batch = campaigns.slice(i, i + batchSize);
      
      // Process batch concurrently but within rate limits
      const batchPromises = batch.map(async (campaign) => {
        try {
          // Wait for available slot
          while (this.activeRequests >= RATE_LIMIT.MAX_CONCURRENT) {
            await this.delay(100);
          }

          this.activeRequests++;
          
          // Fetch campaign content
          const content = await this.fetchCampaignContent(campaign.id);
          
          return {
            ...campaign,
            content: content || { html: '', plain_text: '' }
          };
        } catch (error) {
          console.error(`Error fetching content for campaign ${campaign.id}:`, error);
          return {
            ...campaign,
            content: { html: '', plain_text: '' }
          };
        } finally {
          this.activeRequests--;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      campaignsWithContent.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < campaigns.length) {
        await this.delay(500);
      }
    }

    return campaignsWithContent;
  }

  /**
   * Fetch content for a single campaign
   */
  private async fetchCampaignContent(campaignId: string): Promise<any> {
    const url = `${MAILCHIMP_API_URL}/campaigns/${campaignId}/content`;
    
    try {
      const response = await this.makeRateLimitedRequest(url);
      return response;
    } catch (error) {
      console.error(`Error fetching content for campaign ${campaignId}:`, error);
      return null;
    }
  }

  /**
   * Make API request with rate limiting and retry logic
   */
  private async makeRateLimitedRequest(url: string, config: any = {}): Promise<any> {
    let retries = 0;
    
    while (retries <= RATE_LIMIT.MAX_RETRIES) {
      try {
        const response = await axios.get(url, {
          ...config,
          headers: {
            'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
            'Accept': 'application/json',
            ...config.headers
          }
        });

        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          // Handle rate limiting (429)
          if (error.response?.status === 429) {
            retries++;
            const delay = RATE_LIMIT.RETRY_DELAY * retries;
            console.warn(`📧 Rate limited. Waiting ${delay}ms before retry ${retries}/${RATE_LIMIT.MAX_RETRIES}...`);
            
            if (retries <= RATE_LIMIT.MAX_RETRIES) {
              await this.delay(delay);
              continue;
            }
          }
          
          // Handle other HTTP errors
          if (error.response?.status === 404) {
            console.warn(`📧 Resource not found: ${url}`);
            return null;
          }
        }
        
        throw error;
      }
    }
    
    throw new Error(`Max retries exceeded for ${url}`);
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<any> {
    const repository = await getContentRepository();
    const syncStatus = await repository.getSyncStatus();
    
    return {
      isRunning: this.isRunning,
      activeRequests: this.activeRequests,
      lastSync: syncStatus.find(s => s.source === 'mailchimp')
    };
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let syncService: MailchimpSyncService | null = null;

export function getMailchimpSyncService(): MailchimpSyncService {
  if (!syncService) {
    syncService = new MailchimpSyncService();
  }
  return syncService;
}