/**
 * Content Relationships API Route
 * 
 * Provides access to content relationships and concept clustering
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';
import { relationshipEngine } from '@/lib/intelligence/relationship-engine';
import { conceptClusteringEngine } from '@/lib/intelligence/concept-clustering';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('contentId');
    const action = searchParams.get('action') || 'get';
    const relationshipTypes = searchParams.get('types')?.split(',');

    console.log(`Relationships API called with action: ${action}, contentId: ${contentId}`);

    switch (action) {
      case 'get':
        if (!contentId) {
          return NextResponse.json({
            success: false,
            error: 'Content ID required for get action'
          }, { status: 400 });
        }

        const relationships = await enhancedContentRepository.getContentRelationships(
          contentId,
          relationshipTypes
        );

        return NextResponse.json({
          success: true,
          data: relationships,
          total: relationships.length
        });

      case 'suggest':
        if (!contentId) {
          return NextResponse.json({
            success: false,
            error: 'Content ID required for suggest action'
          }, { status: 400 });
        }

        // Get the content item
        const content = await enhancedContentRepository.getContentWithPhilosophy({
          limit: 1000 // Get all content for analysis
        });

        const targetContent = content.items.find(item => item.id === contentId);
        if (!targetContent) {
          return NextResponse.json({
            success: false,
            error: 'Content not found'
          }, { status: 404 });
        }

        // Generate relationship suggestions
        const suggestions = await relationshipEngine.suggestRelationshipsForNewContent(
          targetContent,
          content.items.filter(item => item.id !== contentId),
          10
        );

        return NextResponse.json({
          success: true,
          data: suggestions,
          total: suggestions.length
        });

      case 'clusters':
        // Get concept clusters
        const allContent = await enhancedContentRepository.getContentWithPhilosophy({
          limit: 1000
        });

        const clusters = await conceptClusteringEngine.identifyConceptClusters(allContent.items);

        return NextResponse.json({
          success: true,
          data: clusters,
          total: clusters.length
        });

      case 'pathways':
        // Get learning pathways
        const contentForPathways = await enhancedContentRepository.getContentWithPhilosophy({
          limit: 1000
        });

        const conceptClusters = await conceptClusteringEngine.identifyConceptClusters(contentForPathways.items);
        const pathways = conceptClusteringEngine.generateLearningPathways(conceptClusters);

        return NextResponse.json({
          success: true,
          data: pathways,
          total: pathways.length
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: get, suggest, clusters, pathways'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Relationships API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch relationship data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log(`Relationships API POST called with action: ${action}`);

    switch (action) {
      case 'analyze':
        const { sourceContentId, targetContentIds } = data;
        
        if (!sourceContentId || !targetContentIds?.length) {
          return NextResponse.json({
            success: false,
            error: 'Source content ID and target content IDs required'
          }, { status: 400 });
        }

        // Get content items
        const allContent = await enhancedContentRepository.getContentWithPhilosophy({
          limit: 1000
        });

        const sourceContent = allContent.items.find(item => item.id === sourceContentId);
        const targetContent = allContent.items.filter(item => targetContentIds.includes(item.id));

        if (!sourceContent) {
          return NextResponse.json({
            success: false,
            error: 'Source content not found'
          }, { status: 404 });
        }

        // Analyze relationships
        const analysis = await relationshipEngine.analyzeContentRelationships(
          sourceContent,
          targetContent
        );

        return NextResponse.json({
          success: true,
          data: analysis,
          total: analysis.length
        });

      case 'validate':
        const { suggestion } = data;
        
        if (!suggestion) {
          return NextResponse.json({
            success: false,
            error: 'Relationship suggestion required'
          }, { status: 400 });
        }

        const validation = relationshipEngine.validateRelationship(suggestion);

        return NextResponse.json({
          success: true,
          data: validation
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: analyze, validate'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Relationships API POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process relationship request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}