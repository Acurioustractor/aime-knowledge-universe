import { NextRequest, NextResponse } from 'next/server';
import { fetchHoodieStockExchangeData } from '@/lib/integrations/hoodie-stock-exchange-data';

export async function GET(request: NextRequest) {
  try {
    console.log('🏪 Hoodie Stock Exchange API called');
    
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('stats') === 'true';
    
    // Fetch the hoodie stock exchange data
    const data = await fetchHoodieStockExchangeData();
    
    console.log(`✅ Retrieved ${data.hoodies.length} hoodies from stock exchange`);
    
    const response = {
      success: true,
      data: data.hoodies,
      stats: includeStats ? data.stats : undefined,
      meta: {
        total: data.hoodies.length,
        lastUpdated: new Date().toISOString(),
        source: 'airtable-stock-exchange'
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Hoodie Stock Exchange API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch hoodie stock exchange data',
      data: [],
      meta: {
        total: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error-fallback'
      }
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    console.log(`🔄 Stock Exchange ${action} requested:`, data);
    
    switch (action) {
      case 'trade':
        // Handle hoodie trading
        const { hoodie_id, from_holder, to_holder, imagination_credits, trade_story } = data;
        
        // For now, return a mock successful trade
        return NextResponse.json({
          success: true,
          trade_id: `trade-${Date.now()}`,
          message: 'Trade executed successfully',
          trade_details: {
            hoodie_id,
            from_holder,
            to_holder,
            imagination_credits,
            trade_story,
            timestamp: new Date().toISOString()
          }
        });
        
      case 'earn':
        // Handle hoodie earning through challenges
        const { hoodie_id: earnedHoodieId, user_id, challenge_id } = data;
        
        return NextResponse.json({
          success: true,
          earning_id: `earn-${Date.now()}`,
          message: 'Hoodie earned successfully',
          earning_details: {
            hoodie_id: earnedHoodieId,
            user_id,
            challenge_id,
            timestamp: new Date().toISOString()
          }
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Stock Exchange POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process stock exchange action'
    }, { 
      status: 500 
    });
  }
}