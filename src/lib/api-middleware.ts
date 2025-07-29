/**
 * API Middleware - Centralized error handling, validation, and security
 * 
 * Provides standardized middleware for all API routes to ensure consistent
 * error handling, request validation, and security measures.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError, APIError, ValidationError, RateLimitError } from './api-error-handler';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from './api-response';

/**
 * Rate limiting store (in-memory for now)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  skipSuccessfulRequests?: boolean;
}

export const defaultRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,    // 100 requests per minute
  skipSuccessfulRequests: false
};

/**
 * Request validation configuration
 */
export interface ValidationConfig {
  validateParams?: (params: URLSearchParams) => void;
  validateBody?: (body: any) => void;
  requiredHeaders?: string[];
  maxBodySize?: number; // in bytes
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  cors?: {
    origin?: string | string[];
    methods?: string[];
    headers?: string[];
  };
  allowedOrigins?: string[];
  requireAuth?: boolean;
}

/**
 * Comprehensive API middleware wrapper
 */
export function withAPIMiddleware<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  config: {
    rateLimit?: RateLimitConfig;
    validation?: ValidationConfig;
    security?: SecurityConfig;
    endpoint?: string;
  } = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const endpoint = config.endpoint || request.nextUrl.pathname;
    const clientIp = getClientIP(request);

    try {
      // 1. Security checks
      if (config.security) {
        const securityCheck = await applySecurityChecks(request, config.security);
        if (securityCheck) return securityCheck;
      }

      // 2. Rate limiting
      if (config.rateLimit) {
        const rateLimitCheck = await applyRateLimit(clientIp, endpoint, config.rateLimit);
        if (rateLimitCheck) return rateLimitCheck;
      }

      // 3. Request validation
      if (config.validation) {
        const validationCheck = await applyValidation(request, config.validation);
        if (validationCheck) return validationCheck;
      }

      // 4. Execute handler with error catching
      const response = await handler(request, ...args);

      // 5. Add standard headers
      return addStandardHeaders(response, startTime, endpoint);

    } catch (error) {
      console.error(`❌ API Error in ${endpoint}:`, error);
      
      // Update rate limit for failed requests if configured
      if (config.rateLimit && !config.rateLimit.skipSuccessfulRequests) {
        updateRateLimit(clientIp, endpoint);
      }

      return handleAPIError(error, endpoint);
    }
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Apply security checks
 */
async function applySecurityChecks(
  request: NextRequest, 
  config: SecurityConfig
): Promise<NextResponse | null> {
  const origin = request.headers.get('origin');
  
  // CORS checks
  if (config.cors && origin) {
    const allowedOrigins = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin || '*'];
    
    if (!allowedOrigins.includes('*') && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.FORBIDDEN,
          'CORS policy violation',
          { origin, allowedOrigins },
          request.nextUrl.pathname
        ),
        { status: 403 }
      );
    }
  }

  // Additional origin checks
  if (config.allowedOrigins && origin) {
    if (!config.allowedOrigins.includes(origin) && !config.allowedOrigins.includes('*')) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.FORBIDDEN,
          'Origin not allowed',
          { origin, allowedOrigins: config.allowedOrigins },
          request.nextUrl.pathname
        ),
        { status: 403 }
      );
    }
  }

  // Auth checks (placeholder for future implementation)
  if (config.requireAuth) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Authentication required',
          undefined,
          request.nextUrl.pathname
        ),
        { status: 401 }
      );
    }
  }

  return null;
}

/**
 * Apply rate limiting
 */
async function applyRateLimit(
  clientIP: string, 
  endpoint: string, 
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const key = `${clientIP}:${endpoint}`;
  const now = Date.now();
  const resetTime = now + config.windowMs;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime });
    return null;
  }
  
  if (current.count >= config.maxRequests) {
    return NextResponse.json(
      createErrorResponse(
        ErrorCodes.RATE_LIMITED,
        'Rate limit exceeded',
        {
          limit: config.maxRequests,
          windowMs: config.windowMs,
          resetTime: current.resetTime
        },
        endpoint
      ),
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(current.resetTime / 1000).toString()
        }
      }
    );
  }
  
  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);
  
  return null;
}

/**
 * Update rate limit counter
 */
function updateRateLimit(clientIP: string, endpoint: string): void {
  const key = `${clientIP}:${endpoint}`;
  const current = rateLimitStore.get(key);
  
  if (current) {
    current.count++;
    rateLimitStore.set(key, current);
  }
}

/**
 * Apply request validation
 */
async function applyValidation(
  request: NextRequest, 
  config: ValidationConfig
): Promise<NextResponse | null> {
  try {
    // Validate required headers
    if (config.requiredHeaders) {
      for (const header of config.requiredHeaders) {
        if (!request.headers.get(header)) {
          throw new ValidationError(`Required header missing: ${header}`);
        }
      }
    }

    // Validate query parameters
    if (config.validateParams) {
      const searchParams = request.nextUrl.searchParams;
      config.validateParams(searchParams);
    }

    // Validate request body for POST/PUT requests
    if ((request.method === 'POST' || request.method === 'PUT') && config.validateBody) {
      const contentLength = request.headers.get('content-length');
      
      // Check body size
      if (config.maxBodySize && contentLength) {
        const size = parseInt(contentLength);
        if (size > config.maxBodySize) {
          throw new ValidationError(`Request body too large. Max size: ${config.maxBodySize} bytes`);
        }
      }

      // Parse and validate body
      try {
        const body = await request.json();
        config.validateBody(body);
      } catch (error) {
        if (error instanceof ValidationError) throw error;
        throw new ValidationError('Invalid JSON in request body');
      }
    }

    return null;
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.VALIDATION_ERROR,
          error.message,
          error.details,
          request.nextUrl.pathname
        ),
        { status: 400 }
      );
    }
    throw error;
  }
}

/**
 * Add standard response headers
 */
function addStandardHeaders(
  response: NextResponse, 
  startTime: number, 
  endpoint: string
): NextResponse {
  const processingTime = Date.now() - startTime;
  
  response.headers.set('X-Processing-Time', `${processingTime}ms`);
  response.headers.set('X-Endpoint', endpoint);
  response.headers.set('X-Timestamp', new Date().toISOString());
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

/**
 * Common validation functions
 */
export const validators = {
  pagination: (params: URLSearchParams) => {
    const limit = params.get('limit');
    const offset = params.get('offset');
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
        throw new ValidationError('Limit must be between 1 and 1000');
      }
    }
    
    if (offset) {
      const offsetNum = parseInt(offset);
      if (isNaN(offsetNum) || offsetNum < 0) {
        throw new ValidationError('Offset must be non-negative');
      }
    }
  },
  
  searchQuery: (params: URLSearchParams) => {
    const query = params.get('q') || params.get('query');
    if (!query || query.trim().length === 0) {
      throw new ValidationError('Search query is required');
    }
    if (query.length > 500) {
      throw new ValidationError('Search query too long (max 500 characters)');
    }
  },
  
  id: (id: string) => {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('ID is required');
    }
    if (id.length > 100) {
      throw new ValidationError('ID too long (max 100 characters)');
    }
  }
};

/**
 * Common rate limit configurations
 */
export const rateLimits = {
  public: { windowMs: 60 * 1000, maxRequests: 100 },      // 100 req/min for public APIs
  search: { windowMs: 60 * 1000, maxRequests: 30 },       // 30 req/min for search
  write: { windowMs: 60 * 1000, maxRequests: 10 },        // 10 req/min for write operations
  heavy: { windowMs: 60 * 1000, maxRequests: 5 }          // 5 req/min for heavy operations
};

/**
 * Utility function to create a simple API handler with standard middleware
 */
export function createAPIHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: {
    rateLimit?: keyof typeof rateLimits | RateLimitConfig;
    requireValidation?: boolean;
    endpoint?: string;
  } = {}
) {
  const rateLimitConfig = typeof config.rateLimit === 'string' 
    ? rateLimits[config.rateLimit] 
    : config.rateLimit;

  const validationConfig = config.requireValidation ? {
    validateParams: validators.pagination
  } : undefined;

  return withAPIMiddleware(handler, {
    rateLimit: rateLimitConfig,
    validation: validationConfig,
    endpoint: config.endpoint,
    security: {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization']
      }
    }
  });
}