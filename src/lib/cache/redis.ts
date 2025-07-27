import { createClient, RedisClientType } from 'redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class RedisCache {
  private client: RedisClientType | null = null;
  private connected = false;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const redisUrl = process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING;
      
      if (!redisUrl) {
        console.warn('Redis URL not configured. Caching will be disabled.');
        return;
      }

      this.client = createClient({
        url: redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis connection refused');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 3) {
            console.error('Max Redis connection attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.stats.errors++;
        this.connected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis client connected');
        this.connected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis client disconnected');
        this.connected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Redis initialization failed:', error);
      this.client = null;
      this.connected = false;
    }
  }

  private getKey(key: string, prefix?: string): string {
    const actualPrefix = prefix || process.env.REDIS_PREFIX || 'aime:';
    return `${actualPrefix}${key}`;
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.client || !this.connected) {
      this.stats.misses++;
      return null;
    }

    try {
      const fullKey = this.getKey(key, options.prefix);
      const value = await this.client.get(fullKey);
      
      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return JSON.parse(value);
    } catch (error) {
      console.error('Redis get error:', error);
      this.stats.errors++;
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    if (!this.client || !this.connected) {
      return false;
    }

    try {
      const fullKey = this.getKey(key, options.prefix);
      const serializedValue = JSON.stringify(value);
      
      if (options.ttl) {
        await this.client.setEx(fullKey, options.ttl, serializedValue);
      } else {
        await this.client.set(fullKey, serializedValue);
      }
      
      this.stats.sets++;
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.client || !this.connected) {
      return false;
    }

    try {
      const fullKey = this.getKey(key, options.prefix);
      await this.client.del(fullKey);
      this.stats.deletes++;
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.client || !this.connected) {
      return false;
    }

    try {
      const fullKey = this.getKey(key, options.prefix);
      const exists = await this.client.exists(fullKey);
      return exists === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      this.stats.errors++;
      return false;
    }
  }

  async clear(pattern?: string, options: CacheOptions = {}): Promise<number> {
    if (!this.client || !this.connected) {
      return 0;
    }

    try {
      const searchPattern = pattern 
        ? this.getKey(pattern, options.prefix)
        : this.getKey('*', options.prefix);
      
      const keys = await this.client.keys(searchPattern);
      
      if (keys.length === 0) {
        return 0;
      }
      
      await this.client.del(keys);
      this.stats.deletes += keys.length;
      return keys.length;
    } catch (error) {
      console.error('Redis clear error:', error);
      this.stats.errors++;
      return 0;
    }
  }

  async getStats(): Promise<CacheStats & { connected: boolean }> {
    return {
      ...this.stats,
      connected: this.connected
    };
  }

  async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Create singleton instance
export const redisCache = new RedisCache();

// Cache key generators for different types of data
export const CacheKeys = {
  youtube: {
    video: (videoId: string) => `youtube:video:${videoId}`,
    channel: (channelId: string) => `youtube:channel:${channelId}`,
    search: (query: string, options: any) => 
      `youtube:search:${Buffer.from(JSON.stringify({ query, options })).toString('base64')}`,
    stats: () => 'youtube:stats',
    sync: (type: string) => `youtube:sync:${type}`
  },
  airtable: {
    record: (tableId: string, recordId: string) => `airtable:${tableId}:${recordId}`,
    table: (tableId: string) => `airtable:table:${tableId}`,
    query: (tableId: string, filters: any) => 
      `airtable:query:${tableId}:${Buffer.from(JSON.stringify(filters)).toString('base64')}`
  },
  content: {
    item: (type: string, id: string) => `content:${type}:${id}`,
    search: (query: string, filters: any) => 
      `content:search:${Buffer.from(JSON.stringify({ query, filters })).toString('base64')}`,
    featured: () => 'content:featured',
    stats: () => 'content:stats'
  },
  system: {
    health: () => 'system:health',
    config: () => 'system:config'
  }
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 5 * 60,        // 5 minutes
  MEDIUM: 30 * 60,      // 30 minutes  
  LONG: 2 * 60 * 60,    // 2 hours
  VERY_LONG: 24 * 60 * 60, // 24 hours
  YOUTUBE_API: 10 * 60,    // 10 minutes for YouTube API calls
  AIRTABLE_API: 5 * 60,    // 5 minutes for Airtable API calls
  SEARCH_RESULTS: 15 * 60, // 15 minutes for search results
  STATS: 60 * 60,          // 1 hour for stats
};