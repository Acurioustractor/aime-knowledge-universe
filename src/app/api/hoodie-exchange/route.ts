/**
 * Hoodie Stock Exchange API
 * 
 * Main API endpoint for the AIME Digital Hoodie Stock Exchange system
 * Handles CRUD operations for digital hoodies, holders, trades, and portfolios
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContentRepository } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/hoodie-exchange - List hoodies with filtering and portfolio operations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';
    
    const repository = await getContentRepository();
    
    switch (action) {
      case 'list': {
        const options = {
          limit: parseInt(searchParams.get('limit') || '50'),
          offset: parseInt(searchParams.get('offset') || '0'),
          category: searchParams.get('category') || undefined,
          rarity: searchParams.get('rarity') || undefined,
          tradeable: searchParams.get('tradeable') ? searchParams.get('tradeable') === 'true' : undefined,
          search: searchParams.get('search') || undefined,
          sortBy: (searchParams.get('sortBy') as any) || 'newest'
        };
        
        const result = await repository.getHoodies(options);
        
        return NextResponse.json({
          success: true,
          data: result.hoodies,
          pagination: {
            total: result.total,
            limit: options.limit,
            offset: options.offset,
            hasMore: options.offset + options.limit < result.total
          }
        });
      }
      
      case 'stats': {
        const stats = await repository.getHoodieExchangeStats();
        
        return NextResponse.json({
          success: true,
          data: stats
        });
      }
      
      case 'portfolio': {
        const holderId = searchParams.get('holder_id');
        if (!holderId) {
          return NextResponse.json({
            success: false,
            error: 'holder_id is required for portfolio'
          }, { status: 400 });
        }
        
        const portfolio = await repository.getHolderPortfolio(holderId);
        
        return NextResponse.json({
          success: true,
          data: portfolio
        });
      }
      
      case 'opportunities': {
        const holderId = searchParams.get('holder_id');
        if (!holderId) {
          return NextResponse.json({
            success: false,
            error: 'holder_id is required for trading opportunities'
          }, { status: 400 });
        }
        
        const options = {
          category: searchParams.get('category') || undefined,
          maxPrice: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
          limit: parseInt(searchParams.get('limit') || '20')
        };
        
        const opportunities = await repository.getTradingOpportunities(holderId, options);
        
        return NextResponse.json({
          success: true,
          data: opportunities
        });
      }
      
      case 'hoodie': {
        const hoodieId = searchParams.get('id');
        if (!hoodieId) {
          return NextResponse.json({
            success: false,
            error: 'id is required for hoodie details'
          }, { status: 400 });
        }
        
        const hoodie = await repository.getHoodie(hoodieId);
        
        if (!hoodie) {
          return NextResponse.json({
            success: false,
            error: 'Hoodie not found'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          data: hoodie
        });
      }
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('🎭 Hoodie Exchange API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hoodie exchange data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/hoodie-exchange - Create hoodie, award, or execute trade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repository = await getContentRepository();
    
    const action = body.action || 'create';
    
    switch (action) {
      case 'create': {
        const { hoodie } = body;
        
        if (!hoodie || !hoodie.name || !hoodie.category) {
          return NextResponse.json({
            success: false,
            error: 'Hoodie name and category are required'
          }, { status: 400 });
        }
        
        const hoodieId = await repository.upsertHoodie(hoodie);
        
        return NextResponse.json({
          success: true,
          data: { hoodie_id: hoodieId },
          message: 'Hoodie created successfully'
        });
      }
      
      case 'award': {
        const { hoodie_id, holder } = body;
        
        if (!hoodie_id || !holder || !holder.holder_id || !holder.holder_name) {
          return NextResponse.json({
            success: false,
            error: 'hoodie_id and holder details (holder_id, holder_name) are required'
          }, { status: 400 });
        }
        
        const holderId = await repository.awardHoodie(hoodie_id, holder);
        
        return NextResponse.json({
          success: true,
          data: { holder_id: holderId },
          message: 'Hoodie awarded successfully'
        });
      }
      
      case 'trade': {
        const { trade } = body;
        
        if (!trade || !trade.hoodie_id || !trade.to_holder_id) {
          return NextResponse.json({
            success: false,
            error: 'Trade must include hoodie_id and to_holder_id'
          }, { status: 400 });
        }
        
        const tradeId = await repository.executeTrade(trade);
        
        return NextResponse.json({
          success: true,
          data: { trade_id: tradeId },
          message: 'Trade executed successfully'
        });
      }
      
      case 'seed': {
        // Seed initial hoodies based on business cases and content
        await seedInitialHoodies(repository);
        
        return NextResponse.json({
          success: true,
          message: 'Initial hoodies seeded successfully'
        });
      }
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('🎭 Hoodie Exchange POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process hoodie operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Seed initial hoodies based on the business cases and content structure
 */
async function seedInitialHoodies(repository: any) {
  try {
    console.log('🎭 Fetching real hoodie data from Airtable...');
    
    // Import the Airtable data fetcher
    const { fetchHoodieStockExchangeData } = await import('@/lib/integrations/hoodie-stock-exchange-data');
    
    // Fetch real data from Airtable
    const { hoodies } = await fetchHoodieStockExchangeData();
    
    console.log(`📥 Retrieved ${hoodies.length} hoodies from Airtable`);
    
    // Transform and seed each hoodie into the database
    for (const hoodie of hoodies) {
      try {
        await repository.upsertHoodie({
          id: hoodie.id,
          name: hoodie.name,
          description: hoodie.description,
          category: hoodie.category,
          subcategory: hoodie.associated_content,
          rarity_level: hoodie.rarity_level,
          base_impact_value: hoodie.base_impact_value,
          imagination_credit_multiplier: hoodie.imagination_credit_multiplier,
          unlock_criteria: JSON.stringify(hoodie.unlock_criteria),
          prerequisite_hoodies: JSON.stringify(hoodie.prerequisites),
          is_tradeable: hoodie.is_tradeable ? 1 : 0,
          max_holders: -1, // Unlimited by default
          current_holders: hoodie.current_holders
        });
        
        // If the hoodie has a current owner, create a holder record
        if (hoodie.current_owner) {
          await repository.awardHoodie(hoodie.id, {
            holder_id: `holder-${hoodie.current_owner.toLowerCase().replace(/\s+/g, '-')}`,
            holder_name: hoodie.current_owner,
            holder_email: hoodie.owner_email,
            acquisition_story: hoodie.acquisition_story,
            acquired_method: 'earned'
          });
        }
        
      } catch (error) {
        console.error(`❌ Failed to seed hoodie: ${hoodie.name}`, error);
      }
    }
    
    console.log(`✅ Successfully seeded ${hoodies.length} hoodies from Airtable`);
    
  } catch (error) {
    console.error('❌ Failed to fetch Airtable data, falling back to essential hoodies:', error);
    
    // Fallback to a few essential hoodies if Airtable fails
    const fallbackHoodies = [
      {
        name: 'JOY Corps Transformation',
        description: 'Core transformation hoodie from JOY Corps program',
        category: 'transformation',
        subcategory: 'joy-corps',
        rarity_level: 'common',
        base_impact_value: 10.0,
        imagination_credit_multiplier: 1.2,
        unlock_criteria: { type: 'program_completion', requirements: ['joy-corps-phase-1'] },
        is_tradeable: true
      },
      {
        name: 'IKSL Knowledge Badge',
        description: 'Indigenous Knowledge Systems and Leadership achievement',
        category: 'knowledge',
        subcategory: 'iksl',
        rarity_level: 'rare',
        base_impact_value: 25.0,
        imagination_credit_multiplier: 1.5,
        unlock_criteria: { type: 'cultural_learning', requirements: ['indigenous-mentorship'] },
        is_tradeable: true
      },
      {
        name: 'Presidents Leadership Badge',
        description: 'Awarded for completion of Presidents Program',
        category: 'impact', 
        subcategory: 'leadership',
        rarity_level: 'legendary',
        base_impact_value: 75.0,
        imagination_credit_multiplier: 2.5,
        unlock_criteria: { type: 'program_completion', requirements: ['presidents-program'] },
        is_tradeable: true,
        max_holders: 50
      }
    ];
    
    for (const hoodie of fallbackHoodies) {
      try {
        await repository.upsertHoodie({
          id: `hoodie-${hoodie.category}-${hoodie.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...hoodie,
          unlock_criteria: JSON.stringify(hoodie.unlock_criteria),
          max_holders: hoodie.max_holders || -1
        });
      } catch (error) {
        console.error(`Failed to seed fallback hoodie: ${hoodie.name}`, error);
      }
    }
    
    console.log(`✅ Seeded ${fallbackHoodies.length} fallback hoodies`);
  }
}