import swaggerJsdoc from 'swagger-jsdoc';
import { z } from 'zod';

// Convert Zod schemas to OpenAPI schemas
export function zodToOpenAPI(schema: z.ZodType): any {
  if (schema instanceof z.ZodString) {
    return { type: 'string' };
  }
  if (schema instanceof z.ZodNumber) {
    return { type: 'number' };
  }
  if (schema instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  }
  if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodToOpenAPI(schema.element)
    };
  }
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    for (const [key, value] of Object.entries(schema.shape)) {
      properties[key] = zodToOpenAPI(value as z.ZodType);
      if (!(value as any).isOptional()) {
        required.push(key);
      }
    }
    
    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    };
  }
  if (schema instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: schema.options
    };
  }
  if (schema instanceof z.ZodUnion) {
    return {
      oneOf: schema.options.map((option: z.ZodType) => zodToOpenAPI(option))
    };
  }
  if (schema instanceof z.ZodOptional) {
    return zodToOpenAPI(schema.unwrap());
  }
  if (schema instanceof z.ZodDefault) {
    const baseSchema = zodToOpenAPI(schema.removeDefault());
    return {
      ...baseSchema,
      default: schema._def.defaultValue()
    };
  }
  
  // Fallback for unknown types
  return { type: 'object' };
}

// OpenAPI specification
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AIME Wiki API',
      version: '1.0.0',
      description: `
        AIME Wiki API provides access to content, YouTube integration, 
        Airtable synchronization, and administrative features.
        
        ## Authentication
        
        The API supports two authentication methods:
        
        1. **JWT Bearer Token** (Recommended)
           - Include in Authorization header: \`Bearer your-jwt-token\`
           - Provides role-based access control and detailed permissions
        
        2. **API Key** (Legacy)
           - Include as X-API-Key header or api_key query parameter
           - Limited permissions for backwards compatibility
        
        ## Rate Limiting
        
        API endpoints are rate limited to prevent abuse. Limits vary by endpoint:
        - Read operations: 100 requests per minute
        - Write operations: 20 requests per minute
        - Admin operations: 10 requests per minute
        
        ## Caching
        
        Many endpoints implement Redis caching for improved performance:
        - YouTube API data: 10 minutes
        - Airtable data: 5 minutes
        - Search results: 15 minutes
        - Content stats: 1 hour
      `,
      contact: {
        name: 'AIME API Support',
        email: 'api@aime.wiki'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for legacy authentication'
        },
        ApiKeyQuery: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key',
          description: 'API key as query parameter'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            details: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' }
          },
          required: ['success', 'error']
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          },
          required: ['success']
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, example: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, example: 10 },
            total: { type: 'integer', minimum: 0, example: 150 },
            totalPages: { type: 'integer', minimum: 0, example: 15 }
          }
        },
        ContentItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            type: { 
              type: 'string', 
              enum: ['video', 'article', 'research', 'story', 'tool', 'event'] 
            },
            title: { type: 'string', maxLength: 500 },
            description: { type: 'string' },
            content: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            external_id: { type: 'string' },
            source: { type: 'string' },
            author: { type: 'string' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            metadata: { type: 'object' },
            tags: { type: 'array', items: { type: 'string' } },
            is_featured: { type: 'boolean' },
            is_published: { type: 'boolean' },
            view_count: { type: 'integer', minimum: 0 }
          },
          required: ['id', 'type', 'title']
        },
        YoutubeChannel: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            channel_id: { type: 'string' },
            channel_name: { type: 'string' },
            custom_url: { type: 'string' },
            description: { type: 'string' },
            subscriber_count: { type: 'integer', minimum: 0 },
            video_count: { type: 'integer', minimum: 0 },
            view_count: { type: 'integer', minimum: 0 },
            thumbnail_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            last_sync: { type: 'string', format: 'date-time' },
            is_active: { type: 'boolean' },
            metadata: { type: 'object' }
          },
          required: ['id', 'channel_id', 'channel_name']
        },
        YoutubeVideo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            video_id: { type: 'string' },
            channel_id: { type: 'string' },
            title: { type: 'string', maxLength: 500 },
            description: { type: 'string' },
            published_at: { type: 'string', format: 'date-time' },
            duration: { type: 'integer', minimum: 0 },
            view_count: { type: 'integer', minimum: 0 },
            like_count: { type: 'integer', minimum: 0 },
            comment_count: { type: 'integer', minimum: 0 },
            thumbnail_url: { type: 'string', format: 'uri' },
            transcript: { type: 'string' },
            transcript_processed: { type: 'boolean' },
            tags: { type: 'array', items: { type: 'string' } },
            category_id: { type: 'integer' },
            language: { type: 'string', maxLength: 10 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            last_sync: { type: 'string', format: 'date-time' },
            metadata: { type: 'object' }
          },
          required: ['id', 'video_id', 'channel_id', 'title']
        },
        SyncJob: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            job_type: { type: 'string' },
            source: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] 
            },
            started_at: { type: 'string', format: 'date-time' },
            completed_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            progress: { type: 'integer', minimum: 0, maximum: 100 },
            total_items: { type: 'integer', minimum: 0 },
            processed_items: { type: 'integer', minimum: 0 },
            error_message: { type: 'string' },
            metadata: { type: 'object' },
            created_by: { type: 'string', format: 'uuid' }
          },
          required: ['id', 'job_type', 'source', 'status']
        }
      },
      responses: {
        ValidationError: {
          description: 'Validation Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Validation failed',
                details: [
                  {
                    field: 'action',
                    message: 'Invalid enum value',
                    code: 'invalid_enum_value'
                  }
                ],
                timestamp: '2025-01-20T10:30:00Z'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Authentication required',
                timestamp: '2025-01-20T10:30:00Z'
              }
            }
          }
        },
        Forbidden: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Insufficient permissions',
                required: ['youtube:admin'],
                timestamp: '2025-01-20T10:30:00Z'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Resource not found',
                timestamp: '2025-01-20T10:30:00Z'
              }
            }
          }
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: 'Internal server error',
                timestamp: '2025-01-20T10:30:00Z'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'YouTube',
        description: 'YouTube integration and video management'
      },
      {
        name: 'Content',
        description: 'Content management and retrieval'
      },
      {
        name: 'Search',
        description: 'Content search functionality'
      },
      {
        name: 'Airtable',
        description: 'Airtable integration and synchronization'
      },
      {
        name: 'Admin',
        description: 'Administrative operations'
      },
      {
        name: 'Health',
        description: 'System health and monitoring'
      }
    ]
  },
  apis: [
    './src/app/api/**/*.ts', // Path to the API files
    './src/lib/docs/swagger-docs.ts' // Additional documentation
  ]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Generate OpenAPI spec with runtime schema conversion
export function generateOpenAPISpec() {
  return {
    ...swaggerSpec,
    // Add any runtime-generated schemas here
  };
}