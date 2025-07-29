/**
 * YouTube API Quota Manager
 * 
 * Manages multiple API keys and distributes quota usage
 */

interface QuotaState {
  [apiKey: string]: {
    usedToday: number;
    lastReset: string;
    isBlocked: boolean;
  };
}

export class YouTubeQuotaManager {
  private quotaFile = '/tmp/youtube-quota.json';
  private dailyLimit = 100; // Conservative limit per key
  
  // Add multiple API keys here
  private apiKeys = [
    process.env.YOUTUBE_API_KEY,
    process.env.YOUTUBE_API_KEY_2, // Add second key
    process.env.YOUTUBE_API_KEY_3, // Add third key
  ].filter(Boolean) as string[];

  async getAvailableAPIKey(): Promise<string | null> {
    const quotaState = await this.loadQuotaState();
    
    // Check each API key for availability
    for (const apiKey of this.apiKeys) {
      const keyState = quotaState[apiKey] || {
        usedToday: 0,
        lastReset: new Date().toDateString(),
        isBlocked: false
      };
      
      // Reset quota if it's a new day
      if (keyState.lastReset !== new Date().toDateString()) {
        keyState.usedToday = 0;
        keyState.lastReset = new Date().toDateString();
        keyState.isBlocked = false;
      }
      
      // Return key if under quota limit
      if (!keyState.isBlocked && keyState.usedToday < this.dailyLimit) {
        quotaState[apiKey] = keyState;
        await this.saveQuotaState(quotaState);
        return apiKey;
      }
    }
    
    return null; // No available keys
  }

  async recordQuotaUsage(apiKey: string, units: number): Promise<void> {
    const quotaState = await this.loadQuotaState();
    
    if (!quotaState[apiKey]) {
      quotaState[apiKey] = {
        usedToday: 0,
        lastReset: new Date().toDateString(),
        isBlocked: false
      };
    }
    
    quotaState[apiKey].usedToday += units;
    
    // Block key if approaching limit
    if (quotaState[apiKey].usedToday >= this.dailyLimit * 0.9) {
      quotaState[apiKey].isBlocked = true;
      console.log(`⚠️ API key blocked due to quota usage: ${quotaState[apiKey].usedToday}/${this.dailyLimit}`);
    }
    
    await this.saveQuotaState(quotaState);
  }

  async getQuotaStatus(): Promise<{
    totalKeys: number;
    availableKeys: number;
    totalQuotaUsed: number;
    keyStatus: Array<{
      key: string;
      used: number;
      limit: number;
      available: boolean;
    }>;
  }> {
    const quotaState = await this.loadQuotaState();
    
    const keyStatus = this.apiKeys.map(apiKey => {
      const state = quotaState[apiKey] || { usedToday: 0, isBlocked: false };
      return {
        key: apiKey.substring(0, 10) + '...',
        used: state.usedToday,
        limit: this.dailyLimit,
        available: !state.isBlocked && state.usedToday < this.dailyLimit
      };
    });
    
    return {
      totalKeys: this.apiKeys.length,
      availableKeys: keyStatus.filter(k => k.available).length,
      totalQuotaUsed: keyStatus.reduce((sum, k) => sum + k.used, 0),
      keyStatus
    };
  }

  private async loadQuotaState(): Promise<QuotaState> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.quotaFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private async saveQuotaState(state: QuotaState): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.writeFile(this.quotaFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Failed to save quota state:', error);
    }
  }
}

export const quotaManager = new YouTubeQuotaManager();