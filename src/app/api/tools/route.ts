/**
 * Tools API - Refactored with Standardized Patterns
 * 
 * Fetches tools from Airtable Digital Assets with proper validation,
 * error handling, and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { 
  createSuccessResponse,
  createPaginatedResponse 
} from '@/lib/api-response';
import { 
  withErrorHandler,
  validatePaginationParams,
  ExternalAPIError,
  ConfigurationError
} from '@/lib/api-error-handler';
import { 
  withSecurity, 
  rateLimits 
} from '@/lib/api-security';
import { isServiceAvailable } from '@/lib/environment';

/**
 * GET /api/tools
 * 
 * AGGRESSIVE TOOL FETCHING - GET EVERY SINGLE TOOL FROM AIRTABLE!
 */
async function handleGet(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  // Validate service availability
  if (!isServiceAvailable.airtable()) {
    throw new ConfigurationError('Airtable service not configured');
  }
  
  // Extract and validate parameters
  const { limit, offset } = validatePaginationParams(
    searchParams.get('limit'),
    searchParams.get('offset')
  );
  
  const category = searchParams.get('category');
  const format = searchParams.get('format');
  
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    
    // Use environment variable for base ID
    const baseId = process.env.AIRTABLE_BASE_ID_DAM;
    if (!baseId) {
      throw new Error('AIRTABLE_BASE_ID_DAM is required');
    }

    console.log('🔥 🚀 FETCHING ALL TOOLS FROM AIRTABLE!');
    console.log('🔥 Target base:', baseId);
    console.log('🔥 API key available:', !!apiKey);
    
    // FOCUS ON THE CORRECT TABLE WITH 435 TOOLS!
    const possibleTables = [
      { 
        id: 'tbltntGrds3BoFidd', 
        name: 'REAL Tools Table (435 tools)', 
        primary: true,
        viewId: 'viwbqdshLc9iD18Yr' // Use the specific view
      },
      // Backup tables in case the main one fails
      { id: 'tblContent', name: 'Content Backup' },
      { id: 'tblTools', name: 'Tools Backup' },
    ];
    
    let allRecords: any[] = [];
    let currentBaseId = baseId; // Start with primary base
    
    // TRY PRIMARY BASE FIRST, THEN FALLBACK
    const basesToTry = [
      { id: baseId, name: 'Primary Base (435 tools)' },
      { id: fallbackBaseId, name: 'Fallback Base (original)' }
    ];
    
    for (const baseInfo of basesToTry) {
      if (!baseInfo.id) continue; // Skip if base ID is missing
      
      currentBaseId = baseInfo.id;
      console.log(`🔥 🎯 TRYING BASE: ${baseInfo.name} (${currentBaseId})`);
      
      let baseWorked = false;
      
      // Search through tables in this base
      for (const table of possibleTables) {
        console.log(`🔥 🔍 SEARCHING TABLE: ${table.name} (${table.id}) in base ${currentBaseId}`);
        
        try {
        let airtableOffset: string | undefined;
        let tableRecords: any[] = [];
        let pageCount = 0;
        
        // NO FILTERS - GET EVERY SINGLE RECORD!
        console.log(`🔥 NO FILTERS - FETCHING ALL RECORDS FROM ${table.name}`);
        
        // AGGRESSIVE PAGINATION - FORCE GET ALL 435 TOOLS!
        do {
          pageCount++;
          
          // Build URL - REMOVE VIEW TO GET ALL 435 RECORDS!
          let url = `https://api.airtable.com/v0/${currentBaseId}/${table.id}?maxRecords=100`;
          // DON'T USE VIEW - it limits results! We want ALL 435 tools!
          console.log(`🔥 IGNORING VIEW - GETTING ALL RECORDS TO REACH 435 TOOLS!`);
          if (airtableOffset) {
            url += `&offset=${airtableOffset}`;
          }
          
          // SAFETY CHECK: If this is the primary table and we're past page 1 but still under 435, keep trying
          if (table.primary && pageCount > 1 && tableRecords.length < 435 && !airtableOffset) {
            console.log(`🔥 🚨 SAFETY OVERRIDE: Only ${tableRecords.length}/435 tools, forcing more attempts...`);
          }
          
          console.log(`🔥 Page ${pageCount} for ${table.name}:`);
          console.log(`🔥 URL: ${url}`);
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ Table ${table.name} failed:`, response.status, errorText);
            break; // Try next table
          }

          const data = await response.json();
          const newRecords = data.records || [];
          tableRecords.push(...newRecords);
          
          console.log(`🔥 ${table.name} Page ${pageCount}: ${newRecords.length} records (Total: ${tableRecords.length})`);
          console.log(`🔥 📊 RAW RESPONSE DATA:`, {
            records_in_response: data.records?.length || 0,
            offset_returned: data.offset || 'NONE',
            has_more_data: !!data.offset,
            total_so_far: tableRecords.length,
            target_count: '435'
          });
          
          airtableOffset = data.offset;
          
          if (airtableOffset) {
            console.log(`🔥 🔄 CONTINUING pagination with offset: ${airtableOffset}`);
            await new Promise(resolve => setTimeout(resolve, 100)); // Shorter delay
          } else {
            console.log(`🔥 🛑 PAGINATION STOPPED - No offset returned`);
            console.log(`🔥 📊 FINAL COUNT: ${tableRecords.length} (Expected: 435)`);
            if (tableRecords.length < 400) {
              console.log(`🔥 ⚠️ WARNING: Got ${tableRecords.length} but expected 435 - something's wrong!`);
            }
          }
        } while (airtableOffset || (table.primary && tableRecords.length < 435 && pageCount < 10));
        
        // Add ALL records from this table
        if (tableRecords.length > 0) {
          allRecords.push(...tableRecords);
          baseWorked = true;
          console.log(`🔥 ✅ Added ${tableRecords.length} records from ${table.name}. Total: ${allRecords.length}`);
        } else {
          console.log(`🔥 ⚠️ No records found in ${table.name}`);
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`🔥 ❌ Error with table ${table.name} in base ${currentBaseId}:`, errorMsg);
        
        // If it's an auth error and this is the primary base, continue to fallback
        if (errorMsg.includes('401') || errorMsg.includes('AUTHENTICATION')) {
          console.log(`🔥 ⚠️ Authentication failed for base ${currentBaseId}, will try fallback...`);
          break; // Exit table loop to try next base
        }
        // Continue to next table for other errors
      }
    }
    
    // If this base worked, don't try the fallback
    if (baseWorked && allRecords.length > 0) {
      console.log(`🔥 ✅ SUCCESS with base ${currentBaseId}! Found ${allRecords.length} total records.`);
      break; // Exit base loop
    } else {
      console.log(`🔥 ⚠️ Base ${currentBaseId} didn't work, trying next base...`);
    }
  }

    console.log(`🔥 🎯 SEARCH COMPLETE! TOTAL RECORDS FROM ALL TABLES: ${allRecords.length}`);

    // Transform records to our tool format - Accept ANY record as a potential tool
    const tools = allRecords.map((record: any) => {
      const fields = record.fields || {};
      
      // Process attachments if they exist
      const attachments = fields.Attachments || fields.Files || fields.Media || [];
      const processedAttachments = attachments.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        url: att.url,
        type: att.type,
        size: att.size,
        thumbnails: att.thumbnails || {}
      }));

      // Extract video information from various possible fields
      const videoUrl = fields.URL || fields.Link || fields.VideoURL || fields.Video || fields.Url;
      const thumbnailUrl = processedAttachments.length > 0 
        ? (processedAttachments[0].thumbnails?.large?.url || processedAttachments[0].thumbnails?.medium?.url || processedAttachments[0].url)
        : (fields.Thumbnail || fields.Image || fields.ThumbnailURL);

      return {
        id: record.id,
        title: fields.Name || fields.Title || fields.Tool || fields.Asset || 'Untitled Tool',
        description: fields.Description || fields.Summary || fields.Content || fields.Notes || '',
        category: fields.Category || fields.Type || fields.Genre || 'General',
        fileType: fields.FileType || fields.Type || fields.Format || (videoUrl ? 'Video' : 'Unknown'),
        tags: fields.Tags || fields.Keywords || fields.Topics || [],
        size: fields.Size || fields.FileSize || 'Unknown',
        usageRestrictions: fields.Usage || fields.Rights || fields.License || 'Unknown',
        dateAdded: fields.DateAdded || fields.Created || fields.Date || new Date().toISOString(),
        url: videoUrl,
        thumbnailUrl: thumbnailUrl,
        attachments: processedAttachments,
        metadata: {
          source: 'airtable',
          airtableId: record.id,
          lastModified: record.lastModified || new Date().toISOString(),
          createdTime: record.createdTime || new Date().toISOString(),
          allFields: fields // Keep all original fields for debugging
        }
      };
    });

    console.log(`🔥 🎯 TRANSFORMED ${tools.length} TOOLS`);
    
    // Count by type
    const videoCount = tools.filter(t => t.fileType === 'Video' || t.url).length;
    const toolCount = tools.filter(t => t.title.toLowerCase().includes('tool')).length;
    
    console.log(`🔥 📊 TOOL BREAKDOWN:`);
    console.log(`🔥 - Total tools: ${tools.length}`);
    console.log(`🔥 - Videos: ${videoCount}`);
    console.log(`🔥 - Tools (by name): ${toolCount}`);

    // Apply client-side filtering if requested
    let filteredTools = tools;
    
    if (category && category !== 'all') {
      filteredTools = filteredTools.filter(tool => 
        tool.category?.toLowerCase() === category.toLowerCase()
      );
      console.log(`🔥 Filtered by category '${category}': ${filteredTools.length} tools`);
    }
    
    if (format && format !== 'all') {
      filteredTools = filteredTools.filter(tool => 
        tool.fileType?.toLowerCase() === format.toLowerCase()
      );
      console.log(`🔥 Filtered by format '${format}': ${filteredTools.length} tools`);
    }

    // Apply pagination to the filtered results
    const paginatedTools = filteredTools.slice(offset, offset + limit);
    
    console.log(`🔥 🎯 FINAL RESULT: Returning ${paginatedTools.length} of ${filteredTools.length} tools (page ${Math.floor(offset/limit) + 1})`);

    return NextResponse.json(
      createPaginatedResponse(
        paginatedTools,
        filteredTools.length,
        offset,
        limit,
        {
          endpoint: '/api/tools',
          processing_time: Date.now() - startTime
        }
      )
    );

  } catch (error) {
    console.error('❌ AGGRESSIVE TOOL FETCH FAILED:', error);
    throw error;
  }
}

// Apply security middleware and error handling
export const GET = withSecurity(
  withErrorHandler(handleGet, '/api/tools'),
  {
    rateLimit: rateLimits.public,
    endpoint: '/api/tools'
  }
);