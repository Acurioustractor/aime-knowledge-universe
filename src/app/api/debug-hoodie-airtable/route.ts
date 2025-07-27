/**
 * Debug Hoodie Airtable API
 * 
 * Connects to the real Airtable base to discover tables and data structure
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AIRTABLE_BASE_ID = 'appkGLUAFOIGUhvoF';

export async function GET(request: NextRequest) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'AIRTABLE_API_KEY not configured',
      debug: {
        baseId: AIRTABLE_BASE_ID,
        envVars: Object.keys(process.env).filter(key => key.includes('AIRTABLE'))
      }
    });
  }

  console.log(`🔍 Debugging Airtable base: ${AIRTABLE_BASE_ID}`);

  try {
    // First, try to get the base schema to see what tables exist
    const schemaUrl = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;
    
    const schemaResponse = await fetch(schemaUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (schemaResponse.ok) {
      const schema = await schemaResponse.json();
      console.log('✅ Schema retrieved successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Base schema retrieved',
        schema: schema,
        tables: schema.tables?.map((t: any) => ({
          id: t.id,
          name: t.name,
          fields: t.fields?.map((f: any) => ({
            name: f.name,
            type: f.type
          }))
        }))
      });
    }

    // If schema fails, try some common table names
    const commonTableNames = [
      'Hoodie Stock Exchange',
      'Hoodies',
      'Digital Hoodies', 
      'Stock Exchange',
      'Trading',
      'Badges',
      'Achievements',
      'Table 1' // Default name
    ];

    const results = [];

    for (const tableName of commonTableNames) {
      try {
        console.log(`🔍 Trying table: ${tableName}`);
        
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}?maxRecords=3`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found table: ${tableName} with ${data.records?.length || 0} records`);
          
          results.push({
            tableName,
            success: true,
            recordCount: data.records?.length || 0,
            sampleRecord: data.records?.[0]?.fields || null,
            fields: data.records?.[0] ? Object.keys(data.records[0].fields) : []
          });
        } else {
          console.log(`❌ Table not found: ${tableName} (${response.status})`);
          results.push({
            tableName,
            success: false,
            error: `${response.status} ${response.statusText}`
          });
        }
      } catch (error) {
        console.error(`❌ Error checking table ${tableName}:`, error);
        results.push({
          tableName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successfulTables = results.filter(r => r.success);

    return NextResponse.json({
      success: successfulTables.length > 0,
      message: `Found ${successfulTables.length} accessible tables`,
      baseId: AIRTABLE_BASE_ID,
      results,
      recommendations: {
        foundTables: successfulTables.map(t => t.tableName),
        suggestions: [
          'Use the table name that returned data',
          'Check the field names in sampleRecord to understand data structure',
          'Update the hoodie integration to use actual field names'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Debug failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      baseId: AIRTABLE_BASE_ID
    }, { status: 500 });
  }
}