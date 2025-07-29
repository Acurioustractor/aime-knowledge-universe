/**
 * Centralized API Error Handling
 * 
 * Provides consistent error handling and response formatting for all API routes
 */

import { NextResponse } from 'next/server';
import { createErrorResponse, ErrorCodes, StatusCodes } from './api-response';

export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(ErrorCodes.VALIDATION_ERROR, message, StatusCodes.BAD_REQUEST, details);
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(ErrorCodes.NOT_FOUND, `${resource} not found`, StatusCodes.NOT_FOUND);
  }
}

export class ExternalAPIError extends APIError {
  constructor(service: string, originalError?: any) {
    super(
      ErrorCodes.EXTERNAL_API_ERROR,
      `External service error: ${service}`,
      StatusCodes.BAD_GATEWAY,
      originalError
    );
  }
}

export class ConfigurationError extends APIError {
  constructor(message: string) {
    super(ErrorCodes.CONFIGURATION_ERROR, message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export class RateLimitError extends APIError {
  constructor(service?: string) {
    super(
      ErrorCodes.RATE_LIMITED,
      service ? `Rate limit exceeded for ${service}` : 'Rate limit exceeded',
      StatusCodes.TOO_MANY_REQUESTS
    );
  }
}

/**
 * Centralized error handler for API routes
 */
export function handleAPIError(error: unknown, endpoint?: string): NextResponse {
  console.error(`❌ API Error in ${endpoint || 'unknown endpoint'}:`, error);
  
  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      createErrorResponse(error.code, error.message, error.details, endpoint),
      { status: error.statusCode }
    );
  }
  
  // Handle validation errors (e.g., from Zod)
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        error,
        endpoint
      ),
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  
  // Handle external API errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // YouTube API specific errors
    if (message.includes('quota') || message.includes('403')) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.RATE_LIMITED,
          'YouTube API quota exceeded',
          { originalError: error.message },
          endpoint
        ),
        { status: StatusCodes.TOO_MANY_REQUESTS }
      );
    }
    
    // Airtable API specific errors
    if (message.includes('airtable') && message.includes('401')) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.CONFIGURATION_ERROR,
          'Airtable API authentication failed',
          { originalError: error.message },
          endpoint
        ),
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    
    // Configuration errors
    if (message.includes('not configured') || message.includes('api key')) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.CONFIGURATION_ERROR,
          error.message,
          null,
          endpoint
        ),
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  }
  
  // Default internal server error
  return NextResponse.json(
    createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Internal server error',
      process.env.NODE_ENV === 'development' ? String(error) : null,
      endpoint
    ),
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler(
  handler: (...args: any[]) => Promise<NextResponse>,
  endpoint?: string
) {
  return async (...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error, endpoint);
    }
  };
}

/**
 * Input validation helpers
 */
export function validateRequiredParams(
  params: Record<string, any>,
  required: string[]
): void {
  const missing = required.filter(key => !params[key]);
  if (missing.length > 0) {
    throw new ValidationError(`Missing required parameters: ${missing.join(', ')}`);
  }
}

export function validatePaginationParams(
  limit?: string | number,
  offset?: string | number
): { limit: number; offset: number } {
  const parsedLimit = Number(limit) || 50;
  const parsedOffset = Number(offset) || 0;
  
  if (parsedLimit < 1 || parsedLimit > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }
  
  if (parsedOffset < 0) {
    throw new ValidationError('Offset must be non-negative');
  }
  
  return { limit: parsedLimit, offset: parsedOffset };
}

/**
 * Service availability checker
 */
export function checkServiceAvailable(service: string, condition: boolean): void {
  if (!condition) {
    throw new ConfigurationError(`${service} service is not configured or unavailable`);
  }
} 