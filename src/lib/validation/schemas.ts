import { z } from 'zod';

// Common validation schemas
export const idSchema = z.string().min(1, 'ID is required');
export const limitSchema = z.number().int().min(1).max(100).default(10);
export const offsetSchema = z.number().int().min(0).default(0);
export const sortSchema = z.enum(['asc', 'desc']).default('desc');

// YouTube Integration schemas
export const youtubeIntegrationActionSchema = z.enum([
  'initialize',
  'full-sync', 
  'incremental-sync',
  'start-integration',
  'stop-integration',
  'setup-channels',
  'comprehensive-search'
]);

export const youtubeChannelSchema = z.object({
  channelId: z.string().min(1, 'Channel ID is required'),
  channelName: z.string().min(1, 'Channel name is required'),
  customUrl: z.string().optional(),
  description: z.string().optional(),
  subscriberCount: z.number().optional(),
  videoCount: z.number().optional(),
  thumbnails: z.record(z.string()).optional()
});

export const youtubeSearchOptionsSchema = z.object({
  limit: limitSchema,
  sortBy: z.enum(['relevance', 'published', 'views', 'rating']).default('relevance'),
  dateFilter: z.enum(['hour', 'today', 'week', 'month', 'year']).optional(),
  channelId: z.string().optional(),
  hasTranscript: z.boolean().optional()
});

export const youtubeIntegrationRequestSchema = z.object({
  action: youtubeIntegrationActionSchema,
  channels: z.array(youtubeChannelSchema).optional(),
  query: z.string().optional(),
  searchOptions: youtubeSearchOptionsSchema.optional()
}).refine((data) => {
  if (data.action === 'setup-channels' && !data.channels) {
    return false;
  }
  if (data.action === 'comprehensive-search' && !data.query) {
    return false;
  }
  return true;
}, {
  message: 'Missing required fields for the specified action'
});

// Authentication schemas
export const authTokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

export const apiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required')
});

// Content schemas
export const contentTypeSchema = z.enum(['video', 'article', 'research', 'story', 'tool', 'event']);

export const contentFilterSchema = z.object({
  type: contentTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  author: z.string().optional(),
  featured: z.boolean().optional(),
  limit: limitSchema,
  offset: offsetSchema
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: contentTypeSchema.optional(),
  semantic: z.boolean().default(false),
  limit: limitSchema,
  filters: contentFilterSchema.optional()
});

// Airtable integration schemas
export const airtableRecordSchema = z.object({
  id: z.string().optional(),
  fields: z.record(z.any()),
  createdTime: z.string().datetime().optional()
});

export const airtableRequestSchema = z.object({
  action: z.enum(['list', 'create', 'update', 'delete', 'sync']),
  tableId: z.string().min(1, 'Table ID is required'),
  recordId: z.string().optional(),
  record: airtableRecordSchema.optional(),
  filters: z.record(z.any()).optional()
});

// Data Lake schemas
export const dataLakeOperationSchema = z.object({
  operation: z.enum(['init', 'sync', 'backup', 'restore', 'query']),
  force: z.boolean().default(false),
  backup: z.boolean().default(true)
});

// Health check schema
export const healthCheckQuerySchema = z.object({
  action: z.enum(['status', 'health-check', 'dashboard-data']).default('status'),
  component: z.enum(['youtube', 'airtable', 'database', 'redis', 'all']).optional()
});

// Error response schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.any().optional(),
  timestamp: z.string().datetime().default(() => new Date().toISOString())
});

// Success response schema
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any().optional(),
  message: z.string().optional(),
  timestamp: z.string().datetime().default(() => new Date().toISOString())
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: limitSchema,
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0)
});

// Export type inference
export type YoutubeIntegrationRequest = z.infer<typeof youtubeIntegrationRequestSchema>;
export type YoutubeChannel = z.infer<typeof youtubeChannelSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type ContentFilter = z.infer<typeof contentFilterSchema>;
export type AirtableRequest = z.infer<typeof airtableRequestSchema>;
export type DataLakeOperation = z.infer<typeof dataLakeOperationSchema>;
export type HealthCheckQuery = z.infer<typeof healthCheckQuerySchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;