import { NextResponse } from 'next/server';
import { AIMEBusinessCasesProcessor } from '@/lib/processors/aime-business-cases-processor';

export async function POST() {
  try {
    console.log('🔄 Processing AIME business cases...');
    
    const processor = new AIMEBusinessCasesProcessor();
    const cases = await processor.saveProcessedCases();
    
    return NextResponse.json({
      success: true,
      message: 'AIME business cases processed successfully',
      data: {
        total_cases: cases.length,
        flagship_cases: cases.filter(c => c.priority === 'flagship').length,
        total_phases: cases.reduce((sum, c) => sum + c.phases.length, 0),
        total_hoodies: cases.reduce((sum, c) => sum + c.digital_hoodies.length, 0)
      },
      cases_summary: cases.map(c => ({
        id: c.id,
        title: c.title,
        priority: c.priority,
        phases: c.phases.length,
        hoodies: c.digital_hoodies.length,
        color_theme: c.color_theme,
        icon: c.icon
      }))
    });
  } catch (error) {
    console.error('AIME business cases processing error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
      help: 'Make sure the Business Cases folder contains all 8 AIME business case documents'
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    const processor = new AIMEBusinessCasesProcessor();
    const cases = await processor.processAllCases();
    
    return NextResponse.json({
      success: true,
      preview: true,
      data: {
        total_cases: cases.length,
        flagship_count: cases.filter(c => c.priority === 'flagship').length,
        core_count: cases.filter(c => c.priority === 'core').length
      },
      cases_preview: cases.map(c => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        target_audience: c.target_audience.substring(0, 100) + '...',
        phases: c.phases.length,
        hoodies: c.digital_hoodies.length,
        priority: c.priority,
        color_theme: c.color_theme,
        icon: c.icon,
        tags: c.tags.slice(0, 5)
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Preview failed',
      help: 'Business Cases folder should contain 8 AIME business case markdown files'
    }, { status: 400 });
  }
}