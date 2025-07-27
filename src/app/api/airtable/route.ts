/**
 * Airtable API - Refactored with Standardized Patterns
 * 
 * Generic Airtable data fetching with proper validation,
 * error handling, and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { 
  createPaginatedResponse,
  createSuccessResponse 
} from '@/lib/api-response';
import { 
  withErrorHandler,
  validatePaginationParams,
  ExternalAPIError,
  ConfigurationError,
  ValidationError
} from '@/lib/api-error-handler';
import { 
  withSecurity, 
  rateLimits 
} from '@/lib/api-security';
import { isServiceAvailable } from '@/lib/environment';

interface AirtableQueryParams {
  baseId?: string;
  tableId: string;
  view: string;
  limit: string;
  offset: string;
  filterByFormula?: string;
  sort?: string;
}

/**
 * GET /api/airtable
 * 
 * Fetch data from any Airtable base and table
 * 
 * Query Parameters:
 * - baseId: Airtable base ID (optional, uses env default)
 * - tableId: Airtable table ID (required)
 * - view: View name (default: 'Grid view')
 * - limit: Number of records per page (1-100, default: 50)
 * - offset: Number of records to skip (default: 0)
 * - filterByFormula: Airtable filter formula (optional)
 * - sort: Sort configuration (optional)
 */
async function handleGet(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  // Validate service availability
  if (!isServiceAvailable.airtable()) {
    throw new ConfigurationError('Airtable service not configured');
  }
  
  // Extract and validate parameters
  const params: AirtableQueryParams = {
    baseId: searchParams.get('baseId') || process.env.AIRTABLE_BASE_ID || undefined,
    tableId: searchParams.get('tableId') || searchParams.get('table') || '',
    view: searchParams.get('view') || 'Grid view',
    limit: searchParams.get('limit') || '50',
    offset: searchParams.get('offset') || '0',
    filterByFormula: searchParams.get('filterByFormula') || undefined,
    sort: searchParams.get('sort') || undefined
  };
  
  // Validate required parameters
  if (!params.baseId) {
    throw new ValidationError('baseId is required (provide as query param or set AIRTABLE_BASE_ID env var)');
  }
  
  if (!params.tableId) {
    throw new ValidationError('tableId or table parameter is required');
  }
  
  const { limit, offset } = validatePaginationParams(params.limit, params.offset);
  
  try {
    
    // Build Airtable API URL with parameters
    const baseUrl = `https://api.airtable.com/v0/${params.baseId}/${params.tableId}`;
    const urlParams = new URLSearchParams();
    
    // Add view parameter only if it's not the default
    if (params.view !== 'Grid view') {
      urlParams.append('view', params.view);
    }
    
    // For Airtable pagination, we need to fetch all records first
    // then apply our own pagination (since Airtable doesn't support offset)
    urlParams.append('maxRecords', '100'); // Airtable's max per request
    
    // Add optional parameters
    if (params.filterByFormula) {
      urlParams.append('filterByFormula', params.filterByFormula);
    }
    if (params.sort) {
      urlParams.append('sort', params.sort);
    }
    
    const airtableUrl = `${baseUrl}?${urlParams.toString()}`;
    
    console.log(`📊 Fetching from Airtable: ${params.tableId} in ${params.baseId}`);
    
    // Fetch all records with Airtable pagination
    let allRecords: any[] = [];
    let airtableOffset: string | undefined;
    
    do {
      const requestUrl = airtableOffset 
        ? `${airtableUrl}&offset=${airtableOffset}`
        : airtableUrl;
      
      const response = await fetch(requestUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Airtable API error:', response.status, errorText);
        throw new ExternalAPIError('Airtable', { 
          status: response.status, 
          message: errorText,
          url: requestUrl 
        });
      }
      
      const data = await response.json();
      allRecords.push(...(data.records || []));
      airtableOffset = data.offset;
      
      console.log(`📦 Fetched ${data.records?.length || 0} records (total: ${allRecords.length})`);
      
      // Add delay to respect rate limits
      if (airtableOffset) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } while (airtableOffset);
    
    // Apply our pagination to the results
    const paginatedRecords = allRecords.slice(offset, offset + limit);
    
    console.log(`✅ Returning ${paginatedRecords.length} records (${offset}-${offset + limit} of ${allRecords.length})`);
    
    return NextResponse.json(
      createPaginatedResponse(
        paginatedRecords,
        allRecords.length,
        offset,
        limit,
        {
          endpoint: '/api/airtable',
          processing_time: Date.now() - startTime
        }
      )
    );
  } catch (error) {
    console.error('❌ Airtable API error:', error);
    throw error; // Let the error handler deal with it
  }
}

// Apply security middleware and error handling
export const GET = withSecurity(
  withErrorHandler(handleGet, '/api/airtable'),
  {
    rateLimit: rateLimits.public,
    endpoint: '/api/airtable'
  }
);