import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { fetchHoodieStockExchangeData, HoodieStockExchangeData } from '@/lib/integrations/hoodie-stock-exchange-data';
import { createAPIHandler } from '@/lib/api-middleware';
import { ExternalAPIError, ConfigurationError, ValidationError } from '@/lib/api-error-handler';

/**
 * GET /api/hoodies
 * Fetch real hoodie data from Airtable
 */
async function handleGetHoodies(request: NextRequest): Promise<NextResponse> {
  // Validate configuration
  if (!process.env.AIRTABLE_API_KEY) {
    throw new ConfigurationError('Airtable API key not configured');
  }
  
  if (!process.env.AIRTABLE_BASE_ID_HOODIES) {
    throw new ConfigurationError('Airtable hoodie base ID not configured');
  }

  console.log('🏫 Fetching real Hoodie data from Airtable...');
  
  const { searchParams } = new URL(request.url);
  const includeStats = searchParams.get('stats') !== 'false';
  
  try {
    const hoodies = await fetchHoodieStockExchangeData();
    
    console.log(`✅ Successfully fetched ${hoodies.length} hoodies from Airtable`);
    
    const response: any = {
      success: true,
      data: hoodies,
      meta: {
        total: hoodies.length,
        lastUpdated: new Date().toISOString(),
        source: 'airtable',
        baseId: process.env.AIRTABLE_BASE_ID_HOODIES
      }
    };
    
    if (includeStats) {
      // Generate basic stats from the data
      const stats = {
        totalHoodies: hoodies.length,
        activeHoodies: hoodies.filter(h => h.is_tradeable).length,
        totalHolders: new Set(hoodies.map(h => h.current_owner).filter(Boolean)).size,
        averageImpactValue: hoodies.reduce((sum, h) => sum + h.base_impact_value, 0) / hoodies.length,
        rarity: {
          common: hoodies.filter(h => h.rarity_level === 'common').length,
          rare: hoodies.filter(h => h.rarity_level === 'rare').length,
          legendary: hoodies.filter(h => h.rarity_level === 'legendary').length,
          mythic: hoodies.filter(h => h.rarity_level === 'mythic').length
        }
      };
      response.stats = stats;
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Failed to fetch Hoodie data:', error);
    
    // Categorize the error for better handling
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('401') || message.includes('unauthorized')) {
        throw new ExternalAPIError('Airtable authentication failed', error);
      }
      
      if (message.includes('403') || message.includes('forbidden')) {
        throw new ExternalAPIError('Airtable permissions denied', error);
      }
      
      if (message.includes('404') || message.includes('not found')) {
        throw new ExternalAPIError('Airtable base or table not found', error);
      }
      
      if (message.includes('quota') || message.includes('rate limit')) {
        throw new ExternalAPIError('Airtable rate limit exceeded', error);
      }
    }
    
    throw new ExternalAPIError('Airtable', error);
  }
}

/**
 * POST /api/hoodies
 * Process and analyze hoodie data (for batch operations)
 */
async function handlePostHoodies(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { refresh = false, analyze = false } = body;
  
  console.log('🏫 Processing Hoodie data request...');
  
  if (refresh) {
    try {
      // Force refresh data from Airtable
      const hoodies = await fetchHoodieStockExchangeData();
      
      if (analyze) {
        // Perform additional analysis
        const analysis = performHoodieAnalysis(hoodies);
        
        return NextResponse.json({
          success: true,
          message: 'Hoodie data refreshed and analyzed',
          data: hoodies,
          analysis,
          processedAt: new Date().toISOString()
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Hoodie data refreshed successfully',
        data: hoodies,
        refreshedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new ExternalAPIError('Airtable refresh failed', error);
    }
  }
  
  throw new ValidationError('No valid operation specified. Use refresh=true to refresh data.');
}

/**
 * Perform additional analysis on hoodie data
 */
function performHoodieAnalysis(hoodies: HoodieStockExchangeData[]) {
  const tradableHoodies = hoodies.filter(h => h.is_tradeable);
  const hoodiesWithOwners = hoodies.filter(h => h.current_owner);
  
  // Category distribution
  const categoryDistribution = hoodies.reduce((acc, hoodie) => {
    acc[hoodie.category] = (acc[hoodie.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Rarity distribution
  const rarityDistribution = hoodies.reduce((acc, hoodie) => {
    acc[hoodie.rarity_level] = (acc[hoodie.rarity_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Top impact hoodies
  const topImpactHoodies = hoodies
    .filter(h => h.base_impact_value > 0)
    .sort((a, b) => b.base_impact_value - a.base_impact_value)
    .slice(0, 5)
    .map(h => ({
      name: h.name,
      category: h.category,
      impactValue: h.base_impact_value,
      holders: h.current_holders,
      utilization: h.utilization_rate
    }));
  
  // Most active hoodies (by utilization)
  const mostActiveHoodies = hoodies
    .filter(h => h.utilization_rate > 0)
    .sort((a, b) => b.utilization_rate - a.utilization_rate)
    .slice(0, 5)
    .map(h => ({
      name: h.name,
      category: h.category,
      utilization: h.utilization_rate,
      impactContribution: h.impact_contribution
    }));
  
  return {
    overview: {
      totalHoodies: hoodies.length,
      tradableHoodies: tradableHoodies.length,
      hoodiesWithOwners: hoodiesWithOwners.length,
      totalHolders: new Set(hoodies.map(h => h.current_owner).filter(Boolean)).size,
      averageImpactValue: hoodies.reduce((sum, h) => sum + h.base_impact_value, 0) / hoodies.length,
      averageUtilization: hoodies.reduce((sum, h) => sum + h.utilization_rate, 0) / hoodies.length
    },
    categoryDistribution,
    rarityDistribution,
    topImpactHoodies,
    mostActiveHoodies,
    insights: [
      `${tradableHoodies.length} of ${hoodies.length} hoodies are currently tradeable`,
      `${hoodiesWithOwners.length} hoodies have active owners`,
      `${Object.keys(categoryDistribution).length} different hoodie categories`,
      `Average impact value: ${Math.round(hoodies.reduce((sum, h) => sum + h.base_impact_value, 0) / hoodies.length)}`
    ],
    recommendations: [
      'Encourage trading of high-impact hoodies to increase utilization',
      'Focus on expanding categories with highest engagement',
      'Create pathways for earning rare and legendary hoodies',
      'Implement mentorship programs for hoodie optimization'
    ]
  };
}

/**
 * Calculate overall health score for the hoodie network
 */
function calculateOverallHealthScore(hoodies: HoodieStockExchangeData[]): number {
  if (hoodies.length === 0) return 0;
  
  const tradableRatio = hoodies.filter(h => h.is_tradeable).length / hoodies.length;
  const avgUtilization = hoodies.reduce((sum, h) => sum + h.utilization_rate, 0) / hoodies.length / 100;
  const ownershipCoverage = hoodies.filter(h => h.current_owner).length / hoodies.length;
  
  // Weighted health score
  const healthScore = (tradableRatio * 0.4) + (avgUtilization * 0.4) + (ownershipCoverage * 0.2);
  
  return Math.round(healthScore * 100);
}

// Apply standardized error handling and middleware
export const GET = createAPIHandler(handleGetHoodies, {
  rateLimit: 'public',
  endpoint: '/api/hoodies'
});

export const POST = createAPIHandler(handlePostHoodies, {
  rateLimit: 'write',
  endpoint: '/api/hoodies'
});