/**
 * Improved Content API Route
 * 
 * Demonstrates proper API structure with:
 * - Standardized response format
 * - Centralized error handling  
 * - Input validation
 * - Environment checking
 * - Proper documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentStorage } from '@/lib/content-storage';
import { 
  createSuccessResponse, 
  createPaginatedResponse 
} from '@/lib/api-response';
import { 
  withErrorHandler,
  validatePaginationParams,
  ConfigurationError,
  ValidationError
} from '@/lib/api-error-handler';
import { isServiceAvailable } from '@/lib/environment';

interface ContentQueryParams {
  type?: string;
  source?: string;
  limit: string;
  offset: string;
  search?: string;
}

/**
 * GET /api/content-improved
 * 
 * Fetch content with filtering, pagination, and search
 * 
 * Query Parameters:
 * - type: Content type filter (optional)
 * - source: Content source filter (optional) 
 * - limit: Number of items per page (1-100, default: 50)
 * - offset: Number of items to skip (default: 0)
 * - search: Search query (optional)
 * 
 * Response Format:
 * - success: boolean
 * - data: ContentItem[]
 * - meta: pagination and metadata
 */
async function handleGet(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  // Extract and validate parameters
  const params: ContentQueryParams = {
    type: searchParams.get('type') || undefined,
    source: searchParams.get('source') || undefined,
    limit: searchParams.get('limit') || '50',
    offset: searchParams.get('offset') || '0',
    search: searchParams.get('search') || undefined
  };
  
  const { limit, offset } = validatePaginationParams(params.limit, params.offset);
  
  // Check if content storage is available
  if (!contentStorage) {
    throw new ConfigurationError('Content storage not initialized');
  }
  
  try {
    if (params.search) {
      // Handle search requests
      const results = contentStorage.searchContent(params.search);
      const paginatedResults = results.slice(offset, offset + limit);
      
      return NextResponse.json(
        createPaginatedResponse(
          paginatedResults,
          results.length,
          offset,
          limit,
          {
            endpoint: '/api/content-improved',
            processing_time: Date.now() - startTime
          }
        )
      );
    }
    
    // Handle filtered content requests
    const { content, total } = contentStorage.getFilteredContent({
      type: params.type,
      source: params.source,
      limit,
      offset
    });
    
    return NextResponse.json(
      createPaginatedResponse(
        content,
        total,
        offset,
        limit,
        {
          endpoint: '/api/content-improved',
          processing_time: Date.now() - startTime
        }
      )
    );
    
  } catch (error) {
    // Let the error handler deal with storage-specific errors
    throw error;
  }
}

/**
 * POST /api/content-improved
 * 
 * Trigger content refresh or bulk operations
 * 
 * Body Parameters:
 * - action: 'refresh' | 'reindex' | 'analyze'
 * - sources?: string[] - specific sources to process
 * - options?: object - additional processing options
 */
async function handlePost(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { action, sources, options } = body;
    
    if (!action) {
      throw new ValidationError('Action parameter is required');
    }
    
    switch (action) {
      case 'refresh':
        // Check service availability before refreshing
        const services = {
          youtube: isServiceAvailable.youtube(),
          airtable: isServiceAvailable.airtable(),
          github: isServiceAvailable.github(),
          mailchimp: isServiceAvailable.mailchimp()
        };
        
        // Simulate refresh operation
        const refreshResults = {
          sources_refreshed: sources || Object.keys(services).filter(s => services[s as keyof typeof services]),
          items_updated: Math.floor(Math.random() * 100),
          services_available: services
        };
        
        return NextResponse.json(
          createSuccessResponse(refreshResults, {
            endpoint: '/api/content-improved',
            processing_time: Date.now() - startTime
          })
        );
        
      case 'reindex':
        // Simulate reindexing
        const reindexResults = {
          items_reindexed: contentStorage.getStats().totalItems || 0,
          search_index_rebuilt: true
        };
        
        return NextResponse.json(
          createSuccessResponse(reindexResults, {
            endpoint: '/api/content-improved',
            processing_time: Date.now() - startTime
          })
        );
        
      case 'analyze':
        // Simulate content analysis
        const analysisResults = {
          content_quality_scores: {
            average: 8.2,
            highest: 9.8,
            lowest: 6.1
          },
          top_themes: ['Education', 'Indigenous Knowledge', 'Youth Leadership'],
          recommendations: [
            'Increase video content with transcripts',
            'Expand international perspectives',
            'Create more interactive tools'
          ]
        };
        
        return NextResponse.json(
          createSuccessResponse(analysisResults, {
            endpoint: '/api/content-improved',
            processing_time: Date.now() - startTime
          })
        );
        
      default:
        throw new ValidationError(`Unknown action: ${action}. Supported actions: refresh, reindex, analyze`);
    }
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid JSON in request body');
    }
    throw error;
  }
}

// Export handlers with error handling wrapper
export const GET = withErrorHandler(handleGet, '/api/content-improved');
export const POST = withErrorHandler(handlePost, '/api/content-improved'); 