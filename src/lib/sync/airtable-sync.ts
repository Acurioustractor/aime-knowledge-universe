/**
 * Airtable Data Lake Sync Module
 * 
 * Fetches ALL 500+ tools from Airtable and syncs to database
 * Uses the same aggressive pagination logic that was working
 */

export interface AirtableToolRecord {
  id: string;
  title: string;
  description?: string;
  category?: string;
  fileType?: string;
  url?: string;
  thumbnailUrl?: string;
  tags?: string[];
  themes?: string[];
  metadata?: any;
}

/**
 * FOCUSED SYNC: Fetch tools from specific tools table only
 * Target: ~435 tools from main DAM base tools table
 */
export async function fetchAllAirtableTools(): Promise<AirtableToolRecord[]> {
  console.log('🎯 FOCUSED SYNC: Fetching tools from main tools table only...');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('AIRTABLE_API_KEY is required for sync');
  }

  // FOCUS ON MAIN TOOLS TABLE ONLY
  const baseId = process.env.AIRTABLE_BASE_ID_DAM;
  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID_DAM is required for sync');
  }
  const tableId = 'tbltntGrds3BoFidd'; // Main tools table with ~435 records
  
  console.log(`🎯 Fetching from base: ${baseId}, table: ${tableId}`);

  let allRecords: any[] = [];
  let airtableOffset: string | undefined = undefined;
  let pageCount = 0;

  // Fetch ALL records from the tools table with proper pagination
  do {
    pageCount++;
    
    let url = `https://api.airtable.com/v0/${baseId}/${tableId}?pageSize=100`;
    if (airtableOffset) {
      url += `&offset=${encodeURIComponent(airtableOffset)}`;
    }
    
    console.log(`🎯 Tools table: Fetching page ${pageCount}`);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log(`❌ Tools table failed: ${response.status} ${errorData}`);
        throw new Error(`Airtable API failed: ${response.status}`);
      }

      const data = await response.json();
      const newRecords = data.records || [];
      allRecords.push(...newRecords);
      
      console.log(`🎯 Tools table Page ${pageCount}: ${newRecords.length} records (Total: ${allRecords.length})`);
      
      airtableOffset = data.offset;
      
      if (airtableOffset) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      } else {
        console.log(`🎯 ✅ COMPLETED tools table: ${allRecords.length} records`);
      }

    } catch (error) {
      console.error(`❌ Error fetching tools table:`, error);
      throw error;
    }

  } while (airtableOffset); // Continue until no more pages

  console.log(`🎯 🎯 TOOLS SYNC COMPLETE! TOTAL RECORDS: ${allRecords.length}`);

  // Transform to standard format
  const transformedTools = allRecords.map((record: any) => {
    const fields = record.fields || {};
    
    // Standard field mapping for tools table
    const getName = () => {
      return fields.Name || fields.Title || 'Untitled Tool';
    };
    
    const getDescription = () => {
      return fields.Description || fields.Summary || fields.Notes || '';
    };
    
    const getCategory = () => {
      return fields.Category || fields.Type || 'General';
    };
    
    const getUrl = () => {
      return fields.URL || fields.Link || fields.url || '';
    };
    
    return {
      id: record.id,
      source_id: record.id,
      title: getName(),
      description: getDescription(),
      category: getCategory(),
      fileType: fields['File Type'] || fields.fileType || fields.Format || 'Unknown',
      url: getUrl(),
      thumbnailUrl: fields['Thumbnail URL'] || fields.thumbnailUrl || fields.Image || '',
      tags: typeof fields.Tags === 'string' ? fields.Tags.split(',').map((t: string) => t.trim()) : (fields.Tags || []),
      themes: typeof fields.Themes === 'string' ? fields.Themes.split(',').map((t: string) => t.trim()) : (fields.Themes || []),
      metadata: {
        airtable_record_id: record.id,
        created_time: record.createdTime,
        source: 'airtable_tools_table',
        raw_fields: fields
      }
    };
  });

  console.log(`🔥 🎯 DATABASE SYNC: Transformed ${transformedTools.length} tools for database storage`);
  return transformedTools;
}

/**
 * Transform Airtable tools to database content format
 */
export function transformToContentFormat(tools: AirtableToolRecord[]): any[] {
  return tools.map(tool => ({
    id: `airtable_${tool.id}`,
    source: 'airtable',
    source_id: tool.id,
    title: tool.title,
    description: tool.description,
    content_type: 'tool',
    category: tool.category,
    file_type: tool.fileType,
    url: tool.url,
    thumbnail_url: tool.thumbnailUrl,
    tags: JSON.stringify(tool.tags || []),
    themes: JSON.stringify(tool.themes || []),
    topics: JSON.stringify([]),
    authors: JSON.stringify([]),
    metadata: JSON.stringify(tool.metadata || {}),
    is_featured: false,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    indexed_at: new Date().toISOString()
  }));
} 