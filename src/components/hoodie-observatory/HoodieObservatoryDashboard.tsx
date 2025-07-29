/**
 * Hoodie Observatory Dashboard
 * 
 * Philosophy-first visualization of hoodie economics using real Airtable data
 * Demonstrates relational value creation vs traditional transactional systems
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ChartBarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  StarIcon,
  HandRaisedIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { HoodieStockExchangeData, ExchangeStats } from '@/lib/integrations/hoodie-stock-exchange-data';

interface PhilosophyEnrichedHoodie extends HoodieStockExchangeData {
  philosophyPrinciple: string;
  relationalValueStory: string;
  communityImpactNarrative: string;
  implementationGuidance: string;
  contrastWithTraditional: string;
}

interface HoodieObservatoryDashboardProps {
  className?: string;
}

export default function HoodieObservatoryDashboard({ className = '' }: HoodieObservatoryDashboardProps) {
  const [hoodies, setHoodies] = useState<PhilosophyEnrichedHoodie[]>([]);
  const [stats, setStats] = useState<ExchangeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'philosophy' | 'community' | 'impact'>('philosophy');
  const [highlightedHoodie, setHighlightedHoodie] = useState<string | null>(null);

  useEffect(() => {
    loadHoodieData();
  }, []);

  const loadHoodieData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hoodie-exchange?action=list');
      const result = await response.json();
      
      if (result.success) {
        const enrichedHoodies = enrichHoodiesWithPhilosophy(result.data.hoodies);
        setHoodies(enrichedHoodies);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error loading hoodie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrichHoodiesWithPhilosophy = (rawHoodies: HoodieStockExchangeData[]): PhilosophyEnrichedHoodie[] => {
    return rawHoodies.map(hoodie => ({
      ...hoodie,
      philosophyPrinciple: getPhilosophyPrinciple(hoodie.category),
      relationalValueStory: getRelationalValueStory(hoodie),
      communityImpactNarrative: getCommunityImpactNarrative(hoodie),
      implementationGuidance: getImplementationGuidance(hoodie.category),
      contrastWithTraditional: getTraditionalContrast(hoodie.category)
    }));
  };

  const getPhilosophyPrinciple = (category: string): string => {
    const principles = {
      transformation: "Value is created through collective transformation, not individual accumulation",
      knowledge: "Wisdom shared multiplies rather than diminishes - knowledge grows when given away",
      community: "Strong relationships are the foundation of all sustainable value creation",
      leadership: "True leadership serves the community and unlocks potential in others",
      education: "Learning happens in relationship and creates value for entire communities",
      innovation: "Innovation emerges from diverse perspectives working together toward shared vision",
      systems: "Systems change requires understanding interconnections and long-term thinking",
      stewardship: "We are custodians of knowledge and resources for future generations",
      tools: "Tools are most valuable when they enable others to create positive change",
      imagination: "Imagination is the foundation of all possibility and transformation"
    };
    return principles[category as keyof typeof principles] || "Every action creates ripples of value throughout the community";
  };

  const getRelationalValueStory = (hoodie: PhilosophyEnrichedHoodie): string => {
    const baseStory = `This hoodie represents ${hoodie.current_holders} people who have demonstrated ${hoodie.description.toLowerCase()}. `;
    const impactStory = `Each holder amplifies the impact by ${hoodie.imagination_credit_multiplier}x, creating ${Math.round(hoodie.portfolio_value)} units of collective value. `;
    const communityStory = `Rather than competing for ownership, holders collaborate to increase the hoodie's impact across the entire community.`;
    return baseStory + impactStory + communityStory;
  };

  const getCommunityImpactNarrative = (hoodie: PhilosophyEnrichedHoodie): string => {
    return `When someone earns this hoodie, the entire community benefits. The ${hoodie.current_holders} current holders have collectively generated ${hoodie.imagination_credits_earned} imagination credits, which flow back into community programs and support systems. This demonstrates how individual achievement in hoodie economics creates shared abundance rather than individual wealth accumulation.`;
  };

  const getImplementationGuidance = (category: string): string => {
    const guidance = {
      transformation: "Start by identifying what transformation your organization needs, then create recognition systems that celebrate collective progress toward that vision.",
      knowledge: "Build knowledge-sharing systems where contributing wisdom increases your standing rather than hoarding information for competitive advantage.",
      community: "Design programs where individual success is measured by how much it contributes to community wellbeing and collective capacity.",
      leadership: "Develop leadership pathways that require mentoring others and demonstrating impact through community outcomes.",
      education: "Create learning environments where teaching others and collaborative achievement are valued over individual performance.",
      innovation: "Foster innovation through diverse collaboration and shared ownership of creative breakthroughs.",
      systems: "Approach systems change through relationship-building and long-term thinking rather than quick fixes.",
      stewardship: "Establish custodial roles that prioritize future generations and sustainable resource management.",
      tools: "Develop tools that become more valuable when shared and enable others to create positive change.",
      imagination: "Cultivate imagination through storytelling, creative collaboration, and visioning exercises."
    };
    return guidance[category as keyof typeof guidance] || "Focus on creating value that benefits the entire community while recognizing individual contributions.";
  };

  const getTraditionalContrast = (category: string): string => {
    return `Traditional systems would treat this as a scarce resource to be hoarded for individual benefit. In hoodie economics, this ${category} hoodie becomes more valuable as more people earn it and use it to create positive change. The goal is abundance and collective impact, not scarcity and individual accumulation.`;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      transformation: <SparklesIcon className="h-5 w-5" />,
      knowledge: <BookOpenIcon className="h-5 w-5" />,
      community: <UsersIcon className="h-5 w-5" />,
      leadership: <StarIcon className="h-5 w-5" />,
      education: <BuildingLibraryIcon className="h-5 w-5" />,
      innovation: <LightBulbIcon className="h-5 w-5" />,
      systems: <GlobeAltIcon className="h-5 w-5" />,
      stewardship: <HandRaisedIcon className="h-5 w-5" />,
      tools: <ChartBarIcon className="h-5 w-5" />,
      imagination: <HeartIcon className="h-5 w-5" />
    };
    return icons[category as keyof typeof icons] || <SparklesIcon className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      transformation: 'bg-purple-100 text-purple-800 border-purple-200',
      knowledge: 'bg-blue-100 text-blue-800 border-blue-200',
      community: 'bg-green-100 text-green-800 border-green-200',
      leadership: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      education: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      innovation: 'bg-pink-100 text-pink-800 border-pink-200',
      systems: 'bg-teal-100 text-teal-800 border-teal-200',
      stewardship: 'bg-orange-100 text-orange-800 border-orange-200',
      tools: 'bg-gray-100 text-gray-800 border-gray-200',
      imagination: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredHoodies = selectedCategory === 'all' 
    ? hoodies 
    : hoodies.filter(h => h.category === selectedCategory);

  const categories = Array.from(new Set(hoodies.map(h => h.category)));

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hoodie observatory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Observatory Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <HeartIcon className="h-8 w-8" />
              Hoodie Economics Observatory
            </h1>
            <p className="text-purple-100 text-lg mb-4">
              Witnessing relational value creation in action through AIME's hoodie ecosystem
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-purple-100">
                <strong>Philosophy in Practice:</strong> Unlike traditional stock exchanges that create value through scarcity and competition, 
                the hoodie observatory demonstrates how value multiplies when shared, how individual achievement creates collective abundance, 
                and how community recognition builds sustainable impact.
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{stats?.total_hoodies || 0}</div>
              <div className="text-sm text-purple-200">Active Hoodies</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Observatory Perspectives</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('philosophy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'philosophy'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LightBulbIcon className="h-4 w-4 inline mr-2" />
              Philosophy
            </button>
            <button
              onClick={() => setViewMode('community')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'community'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UsersIcon className="h-4 w-4 inline mr-2" />
              Community
            </button>
            <button
              onClick={() => setViewMode('impact')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'impact'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUpIcon className="h-4 w-4 inline mr-2" />
              Impact
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === category
                  ? getCategoryColor(category)
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                {getCategoryIcon(category)}
                {category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Observatory Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <HeartIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total_holders}</div>
                <div className="text-sm text-gray-600">Community Holders</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              People actively contributing to collective value creation
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.average_imagination_credits)}
                </div>
                <div className="text-sm text-gray-600">Avg Imagination Credits</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Relational value generated per hoodie
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${Math.round(stats.total_market_value).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Community Value</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Total value flowing through the community
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total_trades}</div>
                <div className="text-sm text-gray-600">Collaborative Exchanges</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Relationship-building transactions
            </p>
          </div>
        </div>
      )}

      {/* Hoodie Observatory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHoodies.map(hoodie => (
          <div
            key={hoodie.id}
            className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
              highlightedHoodie === hoodie.id
                ? 'border-purple-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setHighlightedHoodie(highlightedHoodie === hoodie.id ? null : hoodie.id)}
          >
            <div className="p-6">
              {/* Hoodie Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getCategoryColor(hoodie.category)}`}>
                    {getCategoryIcon(hoodie.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{hoodie.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(hoodie.category)}`}>
                      {hoodie.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{hoodie.current_holders}</div>
                  <div className="text-xs text-gray-500">holders</div>
                </div>
              </div>

              {/* Philosophy View */}
              {viewMode === 'philosophy' && (
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <LightBulbIcon className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-purple-900 text-sm">Core Principle</div>
                        <div className="text-purple-800 text-xs">{hoodie.philosophyPrinciple}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-700 text-sm">
                    {hoodie.relationalValueStory}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 text-sm mb-1">vs Traditional Systems</div>
                    <div className="text-gray-700 text-xs">{hoodie.contrastWithTraditional}</div>
                  </div>
                </div>
              )}

              {/* Community View */}
              {viewMode === 'community' && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <UsersIcon className="h-4 w-4 text-green-600" />
                      <div className="font-medium text-green-900 text-sm">Community Impact</div>
                    </div>
                    <div className="text-green-800 text-xs">{hoodie.communityImpactNarrative}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{hoodie.imagination_credits_earned}</div>
                      <div className="text-xs text-gray-500">Credits Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{hoodie.imagination_credit_multiplier}x</div>
                      <div className="text-xs text-gray-500">Impact Multiplier</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Impact View */}
              {viewMode === 'impact' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="h-4 w-4 text-blue-600" />
                      <div className="font-medium text-blue-900 text-sm">Implementation Guidance</div>
                    </div>
                    <div className="text-blue-800 text-xs">{hoodie.implementationGuidance}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{hoodie.utilization_rate}%</div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{hoodie.community_score}</div>
                      <div className="text-xs text-gray-500">Community</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{hoodie.vision_alignment}</div>
                      <div className="text-xs text-gray-500">Alignment</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expand Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {hoodie.description.substring(0, 60)}...
                  </div>
                  <ArrowRightIcon className={`h-4 w-4 text-gray-400 transition-transform ${
                    highlightedHoodie === hoodie.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {highlightedHoodie === hoodie.id && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
                    <p className="text-gray-700 text-sm">{hoodie.description}</p>
                  </div>
                  
                  {hoodie.prerequisites && hoodie.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                      <div className="flex flex-wrap gap-2">
                        {hoodie.prerequisites.map(prereq => (
                          <span key={prereq} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Base Impact:</span>
                      <span className="ml-2 text-gray-700">{hoodie.base_impact_value}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Market Value:</span>
                      <span className="ml-2 text-gray-700">${hoodie.market_value}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        hoodie.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {hoodie.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Tradeable:</span>
                      <span className="ml-2 text-gray-700">{hoodie.is_tradeable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Philosophy Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <HeartIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hoodie Economics in Action
            </h3>
            <p className="text-gray-700 mb-4">
              This observatory demonstrates how AIME's hoodie system embodies relational economics principles. 
              Each hoodie represents not just individual achievement, but community investment and collective value creation. 
              The more people who earn and utilize these hoodies, the more valuable they become for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-1">Relational Value</div>
                <div className="text-sm text-gray-600">
                  Value increases through relationships and community impact, not scarcity
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-1">Collective Benefit</div>
                <div className="text-sm text-gray-600">
                  Individual achievements create shared abundance and community resources
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-1">Sustainable Impact</div>
                <div className="text-sm text-gray-600">
                  Long-term thinking and stewardship create lasting positive change
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}