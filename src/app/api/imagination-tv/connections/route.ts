/**
 * Knowledge Connections API
 * 
 * Generates and manages connections between video content and knowledge documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { knowledgeConnections } from '@/lib/knowledge-connections';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/imagination-tv/connections - Generate knowledge connections
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, episodeId, adminKey } = body;

    // Simple admin authentication
    if (adminKey !== 'aime-connections-2024') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    console.log('🔗 Knowledge connections request:', action);

    switch (action) {
      case 'generate-episode':
        if (!episodeId) {
          return NextResponse.json({
            success: false,
            error: 'Episode ID is required'
          }, { status: 400 });
        }

        const connections = await knowledgeConnections.generateConnectionsForEpisode(episodeId);
        
        return NextResponse.json({
          success: true,
          data: {
            episodeId,
            connectionsGenerated: connections.length,
            connections: connections.slice(0, 10) // Return first 10 for preview
          }
        });

      case 'generate-all':
        console.log('🔗 Generating connections for all episodes...');
        const totalConnections = await knowledgeConnections.generateAllConnections();
        
        return NextResponse.json({
          success: true,
          data: {
            message: 'Generated connections for all episodes',
            totalConnections
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Knowledge connections API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process connections request'
    }, { status: 500 });
  }
}

/**
 * GET /api/imagination-tv/connections - Get existing connections
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('episodeId');
    const documentId = searchParams.get('documentId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (episodeId) {
      const connections = await knowledgeConnections.getEpisodeConnections(episodeId);
      
      return NextResponse.json({
        success: true,
        data: {
          episodeId,
          connections: connections.slice(0, limit)
        }
      });
    }

    if (documentId) {
      const connections = await knowledgeConnections.getDocumentConnections(documentId);
      
      return NextResponse.json({
        success: true,
        data: {
          documentId,
          connections: connections.slice(0, limit)
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Either episodeId or documentId parameter is required'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Knowledge connections GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch connections'
    }, { status: 500 });
  }
}