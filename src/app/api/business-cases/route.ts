import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';
import { BusinessCasesRepository } from '@/lib/database/business-cases-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    // Initialize schema if needed
    await repo.initializeSchema();
    
    // Get query parameters
    const options = {
      limit: parseInt(searchParams.get('limit') || '12'),
      offset: parseInt(searchParams.get('offset') || '0'),
      industry: searchParams.get('industry') || undefined,
      region: searchParams.get('region') || undefined,
      program_type: searchParams.get('program_type') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      search: searchParams.get('search') || undefined,
      featured_only: searchParams.get('featured') === 'true'
    };

    // Get single case if ID provided
    const caseId = searchParams.get('id');
    if (caseId) {
      const businessCase = await repo.getBusinessCase(caseId);
      if (!businessCase) {
        return NextResponse.json({ error: 'Business case not found' }, { status: 404 });
      }
      
      // Get related content
      const related = await repo.getRelatedContent(caseId);
      
      return NextResponse.json({
        success: true,
        data: {
          ...businessCase,
          related
        }
      });
    }

    // Get list of cases
    const { cases, total } = await repo.getBusinessCases(options);
    
    return NextResponse.json({
      success: true,
      data: cases,
      meta: {
        total,
        limit: options.limit,
        offset: options.offset,
        hasMore: (options.offset + options.limit) < total
      }
    });
  } catch (error) {
    console.error('Business cases API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    await repo.initializeSchema();
    
    const businessCase = await repo.upsertBusinessCase(data);
    
    return NextResponse.json({
      success: true,
      data: businessCase
    });
  } catch (error) {
    console.error('Business case creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create business case' },
      { status: 500 }
    );
  }
}