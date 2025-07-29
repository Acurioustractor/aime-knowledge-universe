/**
 * Environment Configuration & Validation
 * 
 * Validates and manages all environment variables on startup
 */

export interface EnvironmentConfig {
  // YouTube API
  youtubeApiKey: string;
  youtubeApiKey2?: string;
  youtubeApiKey3?: string;
  youtubeChannelId?: string;
  
  // Airtable API
  airtableApiKey: string;
  airtableBaseId?: string;
  airtableBaseIdDam?: string;
  airtableBaseIdComms?: string;
  airtableBaseIdHoodies?: string;
  
  // GitHub API
  githubApiToken?: string;
  
  // Mailchimp API
  mailchimpApiKey?: string;
  mailchimpServerPrefix?: string;
  
  // Application
  nodeEnv: 'development' | 'production' | 'test';
  nextPublicSiteUrl?: string;
  port?: string;
  
  // Database/Storage
  databaseUrl?: string;
  redisUrl?: string;
}

class EnvironmentValidator {
  private config: Partial<EnvironmentConfig> = {};
  private requiredVars: (keyof EnvironmentConfig)[] = [
    'youtubeApiKey',
    'airtableApiKey',
    'nodeEnv'
  ];
  
  validate(): EnvironmentConfig {
    this.loadVariables();
    this.checkRequired();
    this.validateFormats();
    
    console.log('✅ Environment validation passed');
    return this.config as EnvironmentConfig;
  }
  
  private loadVariables() {
    this.config = {
      // YouTube
      youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
      youtubeApiKey2: process.env.YOUTUBE_API_KEY_2,
      youtubeApiKey3: process.env.YOUTUBE_API_KEY_3,
      youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID,
      
      // Airtable
      airtableApiKey: process.env.AIRTABLE_API_KEY || '',
      airtableBaseId: process.env.AIRTABLE_BASE_ID,
      airtableBaseIdDam: process.env.AIRTABLE_BASE_ID_DAM,
      airtableBaseIdComms: process.env.AIRTABLE_BASE_ID_COMMS,
      airtableBaseIdHoodies: process.env.AIRTABLE_BASE_ID_HOODIES,
      
      // GitHub
      githubApiToken: process.env.GITHUB_API_TOKEN,
      
      // Mailchimp
      mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
      mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
      
      // Application
      nodeEnv: (process.env.NODE_ENV as any) || 'development',
      nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      port: process.env.PORT,
      
      // Database
      databaseUrl: process.env.DATABASE_URL,
      redisUrl: process.env.REDIS_URL,
    };
  }
  
  private checkRequired() {
    const missing: string[] = [];
    
    for (const key of this.requiredVars) {
      const value = this.config[key];
      if (!value || value === '' || 
          (typeof value === 'string' && 
           (value.includes('your_') || value.includes('dummy') || value.includes('example')))) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0) {
      console.error('❌ Missing or invalid environment variables:', missing);
      throw new Error(`Environment validation failed. Missing: ${missing.join(', ')}`);
    }
  }
  
  private validateFormats() {
    // YouTube API Key validation
    if (this.config.youtubeApiKey && !this.config.youtubeApiKey.match(/^AIza[0-9A-Za-z-_]{35}$/)) {
      console.warn('⚠️ YouTube API key format looks invalid');
    }
    
    // Airtable API Key validation
    if (this.config.airtableApiKey && !this.config.airtableApiKey.match(/^key[a-zA-Z0-9]{14}$/)) {
      console.warn('⚠️ Airtable API key format looks invalid');
    }
    
    // URL validation
    if (this.config.nextPublicSiteUrl && !this.isValidUrl(this.config.nextPublicSiteUrl)) {
      console.warn('⚠️ NEXT_PUBLIC_SITE_URL is not a valid URL');
    }
  }
  
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  getServiceStatus(): Record<string, boolean> {
    return {
      youtube: !!this.config.youtubeApiKey && !this.config.youtubeApiKey.includes('your_'),
      airtable: !!this.config.airtableApiKey && !this.config.airtableApiKey.includes('your_'),
      github: !!this.config.githubApiToken && !this.config.githubApiToken.includes('your_'),
      mailchimp: !!this.config.mailchimpApiKey && !this.config.mailchimpApiKey.includes('your_')
    };
  }
}

// Export singleton instance
export const environmentValidator = new EnvironmentValidator();
export const env = environmentValidator.validate();

// Service availability helpers
export const isServiceAvailable = {
  youtube: () => !!env.youtubeApiKey && !env.youtubeApiKey.includes('your_'),
  airtable: () => !!env.airtableApiKey && !env.airtableApiKey.includes('your_'),
  github: () => !!env.githubApiToken && !env.githubApiToken.includes('your_'),
  mailchimp: () => !!env.mailchimpApiKey && !env.mailchimpApiKey.includes('your_')
};

export default env; 