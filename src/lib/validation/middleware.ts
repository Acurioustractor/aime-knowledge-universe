import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { errorResponseSchema } from './schemas';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: any
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(body);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false,
      error: 'Invalid request body',
      details: String(error)
    };
  }
}

export function validateSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): ValidationResult<T> {
  try {
    const params: Record<string, any> = {};
    
    searchParams.forEach((value, key) => {
      // Try to parse numbers and booleans
      if (value === 'true') params[key] = true;
      else if (value === 'false') params[key] = false;
      else if (!isNaN(Number(value)) && value !== '') params[key] = Number(value);
      else params[key] = value;
    });

    const validatedData = schema.parse(params);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Invalid query parameters',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false,
      error: 'Invalid query parameters',
      details: String(error)
    };
  }
}

export function createValidationError(
  message: string,
  details?: any,
  status: number = 400
): NextResponse {
  const errorResponse = errorResponseSchema.parse({
    success: false,
    error: message,
    details
  });
  
  return NextResponse.json(errorResponse, { status });
}

export function createSuccessResponse(
  data?: any,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }, { status });
}

export async function withValidation<TBody, TQuery>(
  request: NextRequest,
  options: {
    bodySchema?: z.ZodSchema<TBody>;
    querySchema?: z.ZodSchema<TQuery>;
  }
): Promise<{
  body?: TBody;
  query?: TQuery;
  error?: NextResponse;
}> {
  const result: {
    body?: TBody;
    query?: TQuery;
    error?: NextResponse;
  } = {};

  // Validate request body if schema provided
  if (options.bodySchema) {
    try {
      const bodyText = await request.text();
      const body = bodyText ? JSON.parse(bodyText) : {};
      
      const bodyValidation = validateRequestBody(options.bodySchema, body);
      if (!bodyValidation.success) {
        result.error = createValidationError(
          bodyValidation.error!,
          bodyValidation.details
        );
        return result;
      }
      result.body = bodyValidation.data;
    } catch (error) {
      result.error = createValidationError('Invalid JSON in request body');
      return result;
    }
  }

  // Validate query parameters if schema provided
  if (options.querySchema) {
    const { searchParams } = new URL(request.url);
    const queryValidation = validateSearchParams(options.querySchema, searchParams);
    
    if (!queryValidation.success) {
      result.error = createValidationError(
        queryValidation.error!,
        queryValidation.details
      );
      return result;
    }
    result.query = queryValidation.data;
  }

  return result;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof ZodError) {
    return createValidationError('Validation failed', error.errors);
  }
  
  if (error instanceof Error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
  
  return NextResponse.json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  }, { status: 500 });
}