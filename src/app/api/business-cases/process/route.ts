import { NextResponse } from 'next/server';
import { BusinessCaseParser } from '@/lib/processors/business-case-parser';

export async function POST() {
  try {
    console.log('🔄 Starting business case areas processing...');
    
    const parser = new BusinessCaseParser();
    const result = await parser.processAndSave();
    
    return NextResponse.json({
      success: true,
      message: 'Business case areas processed successfully',
      data: {
        total_areas: result.total_count,
        categories: result.categories,
        summary: result.summary,
        cross_references: result.cross_references.length
      },
      areas_preview: result.areas.slice(0, 5).map(area => ({
        id: area.id,
        title: area.title,
        category: area.category,
        priority: area.priority,
        status: area.status,
        tags: area.tags
      }))
    });
  } catch (error) {
    console.error('Business case processing error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
      help: 'Make sure you have added your content to BUSINESS_CASE_AREAS_SOURCE.md'
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    const parser = new BusinessCaseParser();
    const result = await parser.parseSourceDocument();
    
    return NextResponse.json({
      success: true,
      preview: true,
      data: {
        total_areas: result.total_count,
        categories: result.categories,
        summary: result.summary
      },
      areas_preview: result.areas.slice(0, 10).map(area => ({
        id: area.id,
        title: area.title,
        category: area.category,
        summary: area.summary.substring(0, 100) + '...',
        priority: area.priority,
        status: area.status,
        tags: area.tags.slice(0, 5)
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Preview failed',
      help: 'Add your business case areas content to BUSINESS_CASE_AREAS_SOURCE.md first'
    }, { status: 400 });
  }
}