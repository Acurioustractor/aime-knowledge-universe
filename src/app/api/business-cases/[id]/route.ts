import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/connection';
import { BusinessCasesRepository } from '@/lib/database/business-cases-repository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    // Initialize schema if needed
    await repo.initializeSchema();
    
    // Get single business case
    const businessCase = await repo.getBusinessCase(id);
    if (!businessCase) {
      return NextResponse.json(
        { success: false, error: 'Business case not found' }, 
        { status: 404 }
      );
    }
    
    // Get related content
    const related = await repo.getRelatedContent(id);
    
    return NextResponse.json({
      success: true,
      data: {
        ...businessCase,
        related
      }
    });
  } catch (error) {
    console.error(`Business case API error for ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    await repo.initializeSchema();
    
    // Update business case with specific ID
    const businessCase = await repo.upsertBusinessCase({ ...data, id });
    
    return NextResponse.json({
      success: true,
      data: businessCase
    });
  } catch (error) {
    console.error(`Business case update error for ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update business case' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const repo = new BusinessCasesRepository(db);
    
    await repo.initializeSchema();
    
    const success = await repo.deleteBusinessCase(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Business case not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Business case deleted successfully'
    });
  } catch (error) {
    console.error(`Business case deletion error for ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete business case' },
      { status: 500 }
    );
  }
}