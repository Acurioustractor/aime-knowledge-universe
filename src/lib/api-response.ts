/**
 * Standardized API Response Format
 * 
 * Ensures all API endpoints return consistent response structures
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    endpoint?: string;
    total?: number;
    offset?: number;
    limit?: number;
    hasMore?: boolean;
    processing_time?: number;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    timestamp: string;
    endpoint?: string;
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    processing_time?: number;
  };
}

/**
 * Success response helper
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<APIResponse<T>['meta']>
): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}

/**
 * Error response helper
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
  endpoint?: string
): APIResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString(),
      endpoint
    }
  };
}

/**
 * Paginated response helper
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  offset: number,
  limit: number,
  meta?: Partial<PaginatedResponse<T>['meta']>
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
      ...meta
    }
  };
}

/**
 * Common error codes for consistency
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
} as const;

/**
 * HTTP Status Code Mapping
 */
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const; 