import { NextRequest, NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@/lib/docs/swagger';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     tags: [Documentation]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, yaml]
 *           default: json
 *         description: Output format for the specification
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *           text/yaml:
 *             schema:
 *               type: string
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    const spec = generateOpenAPISpec();
    
    if (format === 'yaml') {
      // Convert to YAML if needed
      const yaml = require('js-yaml');
      const yamlSpec = yaml.dump(spec);
      
      return new NextResponse(yamlSpec, {
        headers: {
          'Content-Type': 'text/yaml',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
      });
    }
    
    return NextResponse.json(spec, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
    
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate API documentation',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}