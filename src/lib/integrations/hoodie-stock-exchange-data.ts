/**
 * Hoodie Stock Exchange Airtable Data Integration
 * 
 * Fetches real hoodie stock exchange data from the specified Airtable base
 * Base ID: appkGLUAFOIGUhvoF
 */

interface AirtableHoodieRecord {
  id: string;
  fields: {
    'Hoodie Unique Name'?: string; // Formula field combining Category Area + Hoodie Name
    'Category Area'?: string; // Single select with categories like JOY, IKSL, Citizens, etc.
    'Hoodie Name'?: string; // Single select with specific hoodie names
    'Type'?: string; // Single select: Tool, Action, etc.
    'Physical/Digital'?: string; // Physical only, Digital only, Digital then physical
    'Reason for minting'?: string; // Rich text - expected impact
    'Who can earn the hoodie'?: string; // Audience/intended recipient
    'If digital only*: why this metric?'?: string; // Rich text explanation
    'Hoodie Design'?: any[]; // Multiple attachments for designs
    'Digital Hoodie Status'?: string; // Minted, Design approved, etc.
    'Physical Hoodie Status'?: string; // Not required, In production, etc.
    'Hoodie One Line Description'?: string; // Rich text description
    'Impact Baseline'?: string; // Rich text - impact needed to achieve
    'Impact tracking'?: string; // Current impact status
    'Members/Alumni that have earned this hoodie'?: string; // Recipients
    'Impact multiplier'?: number; // Numerical multiplier
    'Latest 5 earners'?: string; // Recent recipients
    'Life time hoodie earners'?: number; // Total count
    'Imagination Credits'?: number; // Credits value
    'Imagination Credits + Bonus'?: number; // Bonus credits
  };
}

export interface HoodieStockExchangeData {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity_level: string;
  base_impact_value: number;
  current_holders: number;
  imagination_credit_multiplier: number;
  is_tradeable: boolean;
  current_owner?: string;
  owner_email?: string;
  acquisition_story?: string;
  utilization_rate: number;
  impact_contribution: number;
  trading_history?: any[];
  associated_content?: string;
  unlock_criteria?: any;
  prerequisites?: string[];
  status: string;
  created_at: string;
  last_trade_date?: string;
  icon?: string;
  tags: string[];
  community_score: number;
  vision_alignment: number;
  market_value: number;
  
  // Calculated fields
  imagination_credits_earned?: number;
  portfolio_value?: number;
  trading_volume?: number;
  performance_score?: number;
}

export interface ExchangeStats {
  total_hoodies: number;
  total_holders: number;
  total_trades: number;
  total_market_value: number;
  average_imagination_credits: number;
  top_categories: { category: string; count: number }[];
  rarity_distribution: { rarity: string; count: number }[];
  most_active_traders: { name: string; trades: number }[];
}

const AIRTABLE_BASE_ID = 'appkGLUAFOIGUhvoF';
const AIRTABLE_TABLE_NAME = 'HOODIE STOCK EXCHANGE'; // Real table name from your base

export async function fetchHoodieStockExchangeData(): Promise<{
  hoodies: HoodieStockExchangeData[];
  stats: ExchangeStats;
}> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ AIRTABLE_API_KEY not found, using mock data');
    return generateMockExchangeData();
  }

  console.log(`🎭 Fetching Hoodie Stock Exchange data from Airtable base: ${AIRTABLE_BASE_ID}`);

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.error('❌ Airtable table not found. Check table name or base ID.');
        console.log('📋 Available options: Try "Hoodies", "Digital Hoodies", or "Stock Exchange"');
      }
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Retrieved ${data.records?.length || 0} hoodie records from Airtable`);

    const hoodies = transformAirtableRecords(data.records || []);
    const stats = calculateExchangeStats(hoodies);

    return { hoodies, stats };

  } catch (error) {
    console.error('❌ Failed to fetch Airtable data:', error);
    console.log('🔄 Falling back to mock data for development');
    return generateMockExchangeData();
  }
}

function transformAirtableRecords(records: AirtableHoodieRecord[]): HoodieStockExchangeData[] {
  return records.map(record => {
    const fields = record.fields;
    
    // Extract rarity from hoodie name or default to common
    const hoodieType = fields['Type'] || 'Tool';
    const rarity = determineRarityFromType(hoodieType, fields['Category Area'] || '');
    
    // Parse rich text fields to plain text
    const description = extractPlainText(fields['Hoodie One Line Description']) || 
                       extractPlainText(fields['Reason for minting']) || '';
    
    // Calculate impact value from baseline
    const impactBaseline = extractPlainText(fields['Impact Baseline']) || '';
    const baseImpactValue = extractNumberFromText(impactBaseline) || 10;
    
    return {
      id: record.id,
      name: fields['Hoodie Unique Name'] || fields['Hoodie Name'] || 'Unnamed Hoodie',
      description: description,
      category: mapCategoryArea(fields['Category Area'] || 'General'),
      rarity_level: rarity,
      base_impact_value: baseImpactValue,
      current_holders: fields['Life time hoodie earners'] || 0,
      imagination_credit_multiplier: fields['Impact multiplier'] || 1.0,
      is_tradeable: fields['Digital Hoodie Status'] === 'Minted (published)' || fields['Physical Hoodie Status'] === 'Shipped',
      current_owner: extractLatestEarner(fields['Latest 5 earners']),
      owner_email: undefined, // Not available in this schema
      acquisition_story: extractPlainText(fields['Who can earn the hoodie']),
      utilization_rate: calculateUtilizationFromStatus(fields['Digital Hoodie Status'], fields['Physical Hoodie Status']),
      impact_contribution: fields['Imagination Credits'] || 0,
      trading_history: [], // Would need separate trading data
      associated_content: fields['Category Area'],
      unlock_criteria: { type: fields['Type'], category: fields['Category Area'] },
      prerequisites: extractPrerequisites(fields['Who can earn the hoodie']),
      status: fields['Digital Hoodie Status'] === 'Minted (published)' ? 'active' : 'inactive',
      created_at: new Date().toISOString(), // Not available in schema
      last_trade_date: undefined,
      icon: getIconForCategory(fields['Category Area'] || ''),
      tags: [fields['Type'] || '', fields['Category Area'] || ''].filter(Boolean),
      community_score: Math.min(100, (fields['Life time hoodie earners'] || 0) * 5), // Estimate based on earners
      vision_alignment: calculateVisionAlignment(fields['Category Area'] || ''),
      market_value: fields['Imagination Credits + Bonus'] || fields['Imagination Credits'] || baseImpactValue,
      
      // Calculate derived values
      imagination_credits_earned: (fields['Imagination Credits'] || 0) * (fields['Impact multiplier'] || 1),
      portfolio_value: (fields['Imagination Credits + Bonus'] || 0) * (fields['Life time hoodie earners'] || 1),
      trading_volume: 0, // Would need trading history data
      performance_score: calculatePerformanceScoreFromAirtable(fields)
    };
  });
}

function parseJSON(jsonString?: string): any {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

// Helper functions for transforming Airtable data
function determineRarityFromType(type: string, category: string): string {
  if (category.includes('IMAGI-NATION')) return 'mythic';
  if (type === 'NATION Graduation') return 'legendary';
  if (type === 'Accreditation / Action') return 'rare';
  if (type === 'Action (Top 150 Quality)') return 'rare';
  return 'common';
}

function extractPlainText(richText: any): string {
  if (typeof richText === 'string') return richText;
  if (typeof richText === 'object' && richText?.text) return richText.text;
  if (Array.isArray(richText)) {
    return richText.map(item => item.text || item).join(' ');
  }
  return '';
}

function extractNumberFromText(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function mapCategoryArea(categoryArea: string): string {
  if (categoryArea.includes('JOY')) return 'transformation';
  if (categoryArea.includes('IKSL')) return 'knowledge';
  if (categoryArea.includes('Citizens')) return 'community';
  if (categoryArea.includes('Presidents')) return 'leadership';
  if (categoryArea.includes('Schools')) return 'education';
  if (categoryArea.includes('Embassy')) return 'innovation';
  if (categoryArea.includes('Systems Change')) return 'systems';
  if (categoryArea.includes('Custodians')) return 'stewardship';
  if (categoryArea.includes('Toolshed')) return 'tools';
  if (categoryArea.includes('IMAGI-NATION')) return 'imagination';
  return 'general';
}

function extractLatestEarner(earnersText?: string): string | undefined {
  if (!earnersText) return undefined;
  const earners = earnersText.split(',').map(e => e.trim()).filter(Boolean);
  return earners[0] || undefined;
}

function calculateUtilizationFromStatus(digitalStatus?: string, physicalStatus?: string): number {
  let score = 0;
  if (digitalStatus === 'Minted (published)') score += 50;
  if (physicalStatus === 'Shipped') score += 50;
  if (digitalStatus === 'Design approved') score += 25;
  if (physicalStatus === 'In production') score += 25;
  return score;
}

function extractPrerequisites(whoCanEarn?: string): string[] {
  if (!whoCanEarn) return [];
  const text = extractPlainText(whoCanEarn).toLowerCase();
  const prerequisites = [];
  if (text.includes('mentor')) prerequisites.push('Mentoring experience');
  if (text.includes('graduation')) prerequisites.push('Program graduation');
  if (text.includes('custodian')) prerequisites.push('Custodial role');
  if (text.includes('leader')) prerequisites.push('Leadership role');
  return prerequisites;
}

function getIconForCategory(categoryArea: string): string {
  if (categoryArea.includes('JOY')) return '😊';
  if (categoryArea.includes('IKSL')) return '📚';
  if (categoryArea.includes('Citizens')) return '🤝';
  if (categoryArea.includes('Presidents')) return '👑';
  if (categoryArea.includes('Schools')) return '🎓';
  if (categoryArea.includes('Embassy')) return '🏛️';
  if (categoryArea.includes('Systems Change')) return '🔄';
  if (categoryArea.includes('Custodians')) return '🛡️';
  if (categoryArea.includes('Toolshed')) return '🔧';
  if (categoryArea.includes('IMAGI-NATION')) return '✨';
  if (categoryArea.includes('Sun')) return '☀️';
  if (categoryArea.includes('Death')) return '🌅';
  return '🎭';
}

function calculateVisionAlignment(categoryArea: string): number {
  // Higher alignment for core AIME programs
  if (categoryArea.includes('JOY')) return 95;
  if (categoryArea.includes('IKSL')) return 90;
  if (categoryArea.includes('IMAGI-NATION')) return 100;
  if (categoryArea.includes('Citizens')) return 85;
  if (categoryArea.includes('Embassy')) return 80;
  return 70;
}

function calculatePerformanceScore(fields: any): number {
  const impact = fields['Impact Contribution'] || 0;
  const utilization = fields['Utilization Rate'] || 0;
  const community = fields['Community Score'] || 0;
  const vision = fields['Vision Alignment'] || 0;
  
  return (impact * 0.3 + utilization * 0.3 + community * 0.2 + vision * 0.2);
}

function calculatePerformanceScoreFromAirtable(fields: any): number {
  const imaginationCredits = fields['Imagination Credits'] || 0;
  const lifetimeEarners = fields['Life time hoodie earners'] || 0;
  const impactMultiplier = fields['Impact multiplier'] || 1;
  const categoryWeight = getCategoryWeight(fields['Category Area'] || '');
  
  return (imaginationCredits * 0.4 + lifetimeEarners * 0.3 + impactMultiplier * 0.2 + categoryWeight * 0.1);
}

function getCategoryWeight(categoryArea: string): number {
  if (categoryArea.includes('IMAGI-NATION')) return 100;
  if (categoryArea.includes('JOY')) return 90;
  if (categoryArea.includes('IKSL')) return 85;
  if (categoryArea.includes('Embassy')) return 80;
  return 70;
}

function calculateExchangeStats(hoodies: HoodieStockExchangeData[]): ExchangeStats {
  const totalHolders = new Set(hoodies.map(h => h.current_owner).filter(Boolean)).size;
  const totalTrades = hoodies.reduce((sum, h) => sum + (h.trading_volume || 0), 0);
  const totalMarketValue = hoodies.reduce((sum, h) => sum + h.market_value, 0);
  const avgCredits = hoodies.reduce((sum, h) => sum + (h.imagination_credits_earned || 0), 0) / hoodies.length;

  // Category distribution
  const categoryStats: Record<string, number> = {};
  hoodies.forEach(h => {
    categoryStats[h.category] = (categoryStats[h.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryStats)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Rarity distribution
  const rarityStats: Record<string, number> = {};
  hoodies.forEach(h => {
    rarityStats[h.rarity_level] = (rarityStats[h.rarity_level] || 0) + 1;
  });
  const rarityDistribution = Object.entries(rarityStats)
    .map(([rarity, count]) => ({ rarity, count }));

  // Most active traders (mock for now, would need trade history)
  const traderStats: Record<string, number> = {};
  hoodies.forEach(h => {
    if (h.current_owner) {
      traderStats[h.current_owner] = (traderStats[h.current_owner] || 0) + (h.trading_volume || 0);
    }
  });
  const mostActiveTraders = Object.entries(traderStats)
    .map(([name, trades]) => ({ name, trades }))
    .sort((a, b) => b.trades - a.trades)
    .slice(0, 10);

  return {
    total_hoodies: hoodies.length,
    total_holders: totalHolders,
    total_trades: totalTrades,
    total_market_value: totalMarketValue,
    average_imagination_credits: avgCredits,
    top_categories: topCategories,
    rarity_distribution: rarityDistribution,
    most_active_traders: mostActiveTraders
  };
}

function generateMockExchangeData(): { hoodies: HoodieStockExchangeData[]; stats: ExchangeStats } {
  const mockHoodies: HoodieStockExchangeData[] = [
    {
      id: 'mock-1',
      name: 'Systems Mapping Hoodie',
      description: 'A powerful hoodie for those who can see the bigger picture and map complex organizational systems',
      category: 'transformation',
      rarity_level: 'rare',
      base_impact_value: 25,
      current_holders: 12,
      imagination_credit_multiplier: 1.5,
      is_tradeable: true,
      current_owner: 'Maria Santos',
      utilization_rate: 85,
      impact_contribution: 32,
      status: 'active',
      created_at: '2024-01-15T00:00:00.000Z',
      tags: ['systems-thinking', 'transformation', 'leadership'],
      community_score: 92,
      vision_alignment: 88,
      market_value: 125,
      imagination_credits_earned: 48,
      portfolio_value: 1500,
      trading_volume: 8,
      performance_score: 78.5
    },
    {
      id: 'mock-2',
      name: 'Innovation Catalyst Hoodie',
      description: 'For visionaries who spark creative breakthroughs and transform traditional thinking',
      category: 'innovation',
      rarity_level: 'legendary',
      base_impact_value: 50,
      current_holders: 5,
      imagination_credit_multiplier: 2.0,
      is_tradeable: true,
      current_owner: 'Alex Chen',
      utilization_rate: 95,
      impact_contribution: 78,
      status: 'active',
      created_at: '2024-02-01T00:00:00.000Z',
      tags: ['innovation', 'creativity', 'breakthrough'],
      community_score: 97,
      vision_alignment: 94,
      market_value: 250,
      imagination_credits_earned: 156,
      portfolio_value: 1250,
      trading_volume: 12,
      performance_score: 91.2
    },
    {
      id: 'mock-3',
      name: 'Mentorship Master Hoodie',
      description: 'The badge of those who excel at guiding others through transformation journeys',
      category: 'knowledge',
      rarity_level: 'rare',
      base_impact_value: 35,
      current_holders: 8,
      imagination_credit_multiplier: 1.8,
      is_tradeable: true,
      current_owner: 'Dr. Jennifer Williams',
      utilization_rate: 92,
      impact_contribution: 55,
      status: 'active',
      created_at: '2024-01-20T00:00:00.000Z',
      tags: ['mentorship', 'guidance', 'wisdom'],
      community_score: 89,
      vision_alignment: 86,
      market_value: 180,
      imagination_credits_earned: 99,
      portfolio_value: 1440,
      trading_volume: 6,
      performance_score: 85.7
    }
  ];

  const stats: ExchangeStats = {
    total_hoodies: mockHoodies.length,
    total_holders: 3,
    total_trades: 26,
    total_market_value: 555,
    average_imagination_credits: 101,
    top_categories: [
      { category: 'transformation', count: 1 },
      { category: 'innovation', count: 1 },
      { category: 'knowledge', count: 1 }
    ],
    rarity_distribution: [
      { rarity: 'rare', count: 2 },
      { rarity: 'legendary', count: 1 }
    ],
    most_active_traders: [
      { name: 'Alex Chen', trades: 12 },
      { name: 'Maria Santos', trades: 8 },
      { name: 'Dr. Jennifer Williams', trades: 6 }
    ]
  };

  return { hoodies: mockHoodies, stats };
}

// Trading operations
export async function executeHoodieTrade(trade: {
  hoodie_id: string;
  from_holder: string;
  to_holder: string;
  imagination_credits: number;
  trade_story: string;
}): Promise<{ success: boolean; trade_id?: string; error?: string }> {
  // This would integrate with the database to execute actual trades
  // For now, return a mock successful trade
  return {
    success: true,
    trade_id: `trade-${Date.now()}`,
  };
}

export async function getHolderPortfolio(holder_name: string): Promise<{
  hoodies: HoodieStockExchangeData[];
  total_value: number;
  imagination_credits: number;
  trading_history: any[];
}> {
  const { hoodies } = await fetchHoodieStockExchangeData();
  const holderHoodies = hoodies.filter(h => h.current_owner === holder_name);
  
  return {
    hoodies: holderHoodies,
    total_value: holderHoodies.reduce((sum, h) => sum + h.market_value, 0),
    imagination_credits: holderHoodies.reduce((sum, h) => sum + (h.imagination_credits_earned || 0), 0),
    trading_history: []
  };
}