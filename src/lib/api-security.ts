/**
 * API Security, Rate Limiting & Monitoring
 * 
 * Provides authentication, rate limiting, and monitoring capabilities for API routes
 */

import { NextRequest } from 'next/server';
import { RateLimitError, ConfigurationError } from './api-error-handler';

// Simple in-memory store for demo (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const apiMetrics = new Map<string, { requests: number; errors: number; avgResponseTime: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface ApiKeyConfig {
  adminKeys: string[];
  readOnlyKeys: string[];
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions) {
  return (request: NextRequest): void => {
    const key = options.keyGenerator 
      ? options.keyGenerator(request)
      : getClientIP(request);
    
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    const record = rateLimitStore.get(key);
    
    if (!record || record.resetTime < windowStart) {
      // Reset window
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
      return;
    }
    
    if (record.count >= options.maxRequests) {
      throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`);
    }
    
    record.count++;
  };
}

/**
 * Predefined rate limit configurations
 */
export const rateLimits = {
  // Public endpoints - more permissive
  public: rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }), // 100 per 15 minutes
  
  // Search endpoints - moderate limits
  search: rateLimit({ maxRequests: 50, windowMs: 15 * 60 * 1000 }), // 50 per 15 minutes
  
  // Admin endpoints - stricter limits
  admin: rateLimit({ maxRequests: 20, windowMs: 15 * 60 * 1000 }), // 20 per 15 minutes
  
  // Sync/processing endpoints - very strict
  sync: rateLimit({ maxRequests: 5, windowMs: 60 * 60 * 1000 }), // 5 per hour
};

/**
 * API Key authentication
 */
export class APIKeyAuth {
  private static config: ApiKeyConfig = {
    adminKeys: (process.env.ADMIN_API_KEYS || '').split(',').filter(Boolean),
    readOnlyKeys: (process.env.READONLY_API_KEYS || '').split(',').filter(Boolean)
  };
  
  static validateAdminKey(request: NextRequest): boolean {
    const apiKey = this.extractApiKey(request);
    return !!apiKey && this.config.adminKeys.includes(apiKey);
  }
  
  static validateReadOnlyKey(request: NextRequest): boolean {
    const apiKey = this.extractApiKey(request);
    return !!apiKey && (
      this.config.adminKeys.includes(apiKey) || 
      this.config.readOnlyKeys.includes(apiKey)
    );
  }
  
  static requireAdmin(request: NextRequest): void {
    if (!this.validateAdminKey(request)) {
      throw new ConfigurationError('Admin API key required');
    }
  }
  
  static requireReadOnly(request: NextRequest): void {
    if (!this.validateReadOnlyKey(request)) {
      throw new ConfigurationError('Valid API key required');
    }
  }
  
  private static extractApiKey(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Check X-API-Key header
    const apiKeyHeader = request.headers.get('X-API-Key');
    if (apiKeyHeader) {
      return apiKeyHeader;
    }
    
    // Check query parameter (less secure, avoid for sensitive endpoints)
    const url = new URL(request.url);
    const apiKeyParam = url.searchParams.get('api_key');
    if (apiKeyParam) {
      return apiKeyParam;
    }
    
    return null;
  }
}

/**
 * Request logging and metrics
 */
export class APIMetrics {
  static startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }
  
  static recordRequest(endpoint: string, responseTime: number, isError: boolean = false): void {
    const current = apiMetrics.get(endpoint) || { requests: 0, errors: 0, avgResponseTime: 0 };
    
    current.requests++;
    if (isError) current.errors++;
    
    // Calculate rolling average response time
    current.avgResponseTime = (current.avgResponseTime * (current.requests - 1) + responseTime) / current.requests;
    
    apiMetrics.set(endpoint, current);
  }
  
  static getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [endpoint, metrics] of apiMetrics.entries()) {
      result[endpoint] = {
        ...metrics,
        errorRate: metrics.requests > 0 ? (metrics.errors / metrics.requests) * 100 : 0
      };
    }
    return result;
  }
  
  static clearMetrics(): void {
    apiMetrics.clear();
  }
}

/**
 * Health check utilities
 */
export class HealthCheck {
  static async checkServices(): Promise<Record<string, { status: 'healthy' | 'unhealthy'; details?: any }>> {
    const results: Record<string, any> = {};
    
    // Check YouTube API
    try {
      const youtubeKey = process.env.YOUTUBE_API_KEY;
      if (!youtubeKey || youtubeKey.includes('your_')) {
        results.youtube = { status: 'unhealthy', details: 'API key not configured' };
      } else {
        // Could add actual API test here
        results.youtube = { status: 'healthy', details: 'API key configured' };
      }
    } catch (error) {
      results.youtube = { status: 'unhealthy', details: String(error) };
    }
    
    // Check Airtable API
    try {
      const airtableKey = process.env.AIRTABLE_API_KEY;
      if (!airtableKey || airtableKey.includes('your_')) {
        results.airtable = { status: 'unhealthy', details: 'API key not configured' };
      } else {
        results.airtable = { status: 'healthy', details: 'API key configured' };
      }
    } catch (error) {
      results.airtable = { status: 'unhealthy', details: String(error) };
    }
    
    // Check memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const memoryHealthy = memUsage.heapUsed < memUsage.heapTotal * 0.9;
      results.memory = {
        status: memoryHealthy ? 'healthy' : 'unhealthy',
        details: {
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          usage: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`
        }
      };
    }
    
    return results;
  }
  
  static getOverallHealth(serviceChecks: Record<string, { status: string }>): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(serviceChecks).map(s => s.status);
    const healthyCount = statuses.filter(s => s === 'healthy').length;
    const totalCount = statuses.length;
    
    if (healthyCount === totalCount) return 'healthy';
    if (healthyCount > totalCount * 0.5) return 'degraded';
    return 'unhealthy';
  }
}

/**
 * Security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store, max-age=0'
  };
}

/**
 * Utility functions
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const real = request.headers.get('x-real-ip');
  if (real) {
    return real;
  }
  
  // Fallback - in serverless this might not be available
  return 'unknown';
}

/**
 * Middleware wrapper for applying security measures
 */
export function withSecurity(
  handler: (...args: any[]) => Promise<Response>,
  options: {
    rateLimit?: (request: NextRequest) => void;
    requireAuth?: (request: NextRequest) => void;
    endpoint?: string;
  } = {}
) {
  return async (...args: any[]): Promise<Response> => {
    const request = args[0] as NextRequest;
    const timer = APIMetrics.startTimer();
    let isError = false;
    
    try {
      // Apply rate limiting
      if (options.rateLimit) {
        options.rateLimit(request);
      }
      
      // Apply authentication
      if (options.requireAuth) {
        options.requireAuth(request);
      }
      
      // Call the actual handler
      const response = await handler(...args);
      
      // Add security headers
      const securityHeaders = getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
      
    } catch (error) {
      isError = true;
      throw error;
    } finally {
      // Record metrics
      if (options.endpoint) {
        const responseTime = timer();
        APIMetrics.recordRequest(options.endpoint, responseTime, isError);
      }
    }
  };
} 