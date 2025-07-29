import { Pool, PoolConfig, PoolClient } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class PostgresDatabase {
  private pool: Pool | null = null;
  private config: DatabaseConfig;
  private initialized = false;

  constructor() {
    this.config = this.loadConfig();
    this.initialize();
  }

  private loadConfig(): DatabaseConfig {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (databaseUrl) {
      // Parse connection URL
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    }

    // Fallback to individual environment variables
    return {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'aime_wiki',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '',
      ssl: process.env.POSTGRES_SSL === 'true',
      max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  private async initialize() {
    try {
      this.pool = new Pool(this.config);
      
      this.pool.on('error', (err) => {
        console.error('Database pool error:', err);
      });

      this.pool.on('connect', () => {
        console.log('New database client connected');
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      console.log('Database connected successfully');
      this.initialized = true;

      // Run migrations if needed
      await this.runMigrations();
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.initialized = false;
      this.pool = null;
    }
  }

  private async runMigrations() {
    if (!this.pool) return;

    try {
      const client = await this.pool.connect();
      
      // Create migrations table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Read and execute schema file
      try {
        const schemaPath = join(process.cwd(), 'src/lib/database/schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');
        
        // Check if initial schema migration has been run
        const migrationCheck = await client.query(
          'SELECT COUNT(*) FROM migrations WHERE name = $1',
          ['initial_schema']
        );

        if (parseInt(migrationCheck.rows[0].count) === 0) {
          console.log('Running initial database schema migration...');
          await client.query(schema);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            ['initial_schema']
          );
          console.log('Initial schema migration completed');
        }
      } catch (schemaError) {
        console.warn('Schema file not found or invalid, skipping migration:', schemaError);
      }

      client.release();
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    if (!this.pool || !this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(text, params);
    return results.length > 0 ? results[0] : null;
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool || !this.initialized) {
      throw new Error('Database not initialized');
    }

    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool || !this.initialized) {
      throw new Error('Database not initialized');
    }
    
    return this.pool.connect();
  }

  async healthCheck(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    if (!this.pool || !this.initialized) {
      return { healthy: false, error: 'Database not initialized' };
    }

    try {
      const start = Date.now();
      await this.pool.query('SELECT 1');
      const latency = Date.now() - start;
      
      return { healthy: true, latency };
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getStats(): Promise<{
    totalConnections: number;
    idleConnections: number;
    waitingConnections: number;
  }> {
    if (!this.pool) {
      return { totalConnections: 0, idleConnections: 0, waitingConnections: 0 };
    }

    return {
      totalConnections: this.pool.totalCount,
      idleConnections: this.pool.idleCount,
      waitingConnections: this.pool.waitingCount
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.initialized = false;
      console.log('Database pool closed');
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Create singleton instance
export const postgres = new PostgresDatabase();

// Database models/repositories
export class BaseRepository {
  protected async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    return postgres.query<T>(text, params);
  }

  protected async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    return postgres.queryOne<T>(text, params);
  }

  protected async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    return postgres.transaction(callback);
  }
}