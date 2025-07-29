import { NextRequest, NextResponse } from 'next/server';
import { contentWorkflow } from '@/lib/content/workflow';

/**
 * POST /api/admin/workflow/process
 * Process all content through the workflow system
 */
export async function POST() {
  try {
    console.log('⚡ Starting content workflow processing...');
    
    // Get all content from the real API
    const response = await fetch('http://localhost:3000/api/content/real?limit=100');
    const contentData = await response.json();
    
    if (!contentData.success) {
      throw new Error('Failed to fetch content for processing');
    }
    
    const allContent = contentData.data.content;
    console.log(`📋 Processing ${allContent.length} content items...`);
    
    let processedCount = 0;
    let errorCount = 0;
    
    // Process each content item through the workflow
    for (const item of allContent) {
      try {
        await contentWorkflow.queueContent(item, 'content_added');
        processedCount++;
      } catch (error) {
        console.warn(`⚠️ Failed to process item ${item.id}:`, error);
        errorCount++;
      }
    }
    
    const queueStatus = contentWorkflow.getQueueStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Content workflow processing initiated',
      stats: {
        totalItems: allContent.length,
        processedSuccessfully: processedCount,
        errors: errorCount,
        queueStatus
      },
      availableActions: contentWorkflow.getWorkflowActions().map(action => ({
        id: action.id,
        name: action.name,
        type: action.type,
        automated: action.automated
      }))
    });
    
  } catch (error) {
    console.error('❌ Workflow processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}