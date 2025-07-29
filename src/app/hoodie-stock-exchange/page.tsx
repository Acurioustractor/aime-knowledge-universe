'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HoodieStockExchangeData, ExchangeStats, fetchHoodieStockExchangeData, executeHoodieTrade, getHolderPortfolio } from '@/lib/integrations/hoodie-stock-exchange-data';

export default function HoodieStockExchangePage() {
  const [hoodies, setHoodies] = useState<HoodieStockExchangeData[]>([]);
  const [stats, setStats] = useState<ExchangeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'trading' | 'analytics'>('market');
  const [selectedHoodie, setSelectedHoodie] = useState<HoodieStockExchangeData | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'market_value' | 'impact_contribution' | 'imagination_credits' | 'rarity'>('market_value');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadExchangeData();
    loadUserPortfolio();
  }, []);

  const loadExchangeData = async () => {
    try {
      const data = await fetchHoodieStockExchangeData();
      setHoodies(data.hoodies);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load hoodie exchange data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPortfolio = async () => {
    try {
      const portfolio = await getHolderPortfolio('Demo User');
      setUserPortfolio(portfolio);
    } catch (error) {
      console.error('Failed to load user portfolio:', error);
    }
  };

  const filteredHoodies = hoodies
    .filter(hoodie => 
      hoodie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoodie.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(hoodie => filterCategory === 'all' || hoodie.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'market_value': return b.market_value - a.market_value;
        case 'impact_contribution': return b.impact_contribution - a.impact_contribution;
        case 'imagination_credits': return (b.imagination_credits_earned || 0) - (a.imagination_credits_earned || 0);
        case 'rarity': return getRarityScore(b.rarity_level) - getRarityScore(a.rarity_level);
        default: return 0;
      }
    });

  const categories = Array.from(new Set(hoodies.map(h => h.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading Hoodie Stock Exchange...</p>
          <p className="text-blue-200 text-sm mt-2">Fetching real-time data from Airtable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/40 border-b border-yellow-400/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white/90 hover:text-white text-sm flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all"
              >
                <span>←</span>
                <span>Back to Knowledge Universe</span>
              </Link>
              <div className="text-yellow-400 text-xl font-bold">
                💰 AIME Hoodie Stock Exchange
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/hoodie-challenge" 
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all"
              >
                🏆 Hoodie Challenge
              </Link>
              <div className="text-white/90 text-sm bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                Total Market Value: <span className="text-yellow-400 font-bold">{stats?.total_market_value.toLocaleString()} credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Stats Banner */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white mb-1">{stats?.total_hoodies || 0}</div>
            <div className="text-white/70 text-sm">Total Hoodies</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-green-400/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats?.total_holders || 0}</div>
            <div className="text-white/70 text-sm">Active Holders</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-blue-400/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats?.total_trades || 0}</div>
            <div className="text-white/70 text-sm">Total Trades</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 border border-orange-400/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-orange-400 mb-1">{Math.round(stats?.average_imagination_credits || 0)}</div>
            <div className="text-white/70 text-sm">Avg Credits</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-4 border-b border-white/20">
          {[
            { id: 'market', label: '🏪 Market', desc: 'Browse & trade hoodies' },
            { id: 'portfolio', label: '💼 Portfolio', desc: 'Your hoodie collection' },
            { id: 'trading', label: '📈 Trading', desc: 'Active trades & orders' },
            { id: 'analytics', label: '📊 Analytics', desc: 'Market insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-xs text-white/60">{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-black/30 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search hoodies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-yellow-400/50"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-yellow-400/50"
                >
                  <option value="market_value">Market Value</option>
                  <option value="impact_contribution">Impact Score</option>
                  <option value="imagination_credits">Credits</option>
                  <option value="rarity">Rarity</option>
                </select>
              </div>
            </div>

            {/* Hoodie Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHoodies.map((hoodie) => (
                <HoodieCard
                  key={hoodie.id}
                  hoodie={hoodie}
                  onSelect={() => setSelectedHoodie(hoodie)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView portfolio={userPortfolio} />
        )}

        {activeTab === 'trading' && (
          <TradingView hoodies={hoodies} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView stats={stats} hoodies={hoodies} />
        )}
      </div>

      {/* Hoodie Detail Modal */}
      {selectedHoodie && (
        <HoodieDetailModal
          hoodie={selectedHoodie}
          onClose={() => setSelectedHoodie(null)}
          onTrade={(hoodie) => {
            // Handle trade initiation
            console.log('Initiating trade for:', hoodie.name);
          }}
        />
      )}
    </div>
  );
}

function HoodieCard({ hoodie, onSelect }: { hoodie: HoodieStockExchangeData; onSelect: () => void }) {
  const rarityColors = {
    common: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    legendary: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    mythic: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
  };

  return (
    <div 
      onClick={onSelect}
      className="bg-black/30 rounded-xl p-6 border border-white/20 backdrop-blur-sm hover:border-yellow-400/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{hoodie.icon || '👕'}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${rarityColors[hoodie.rarity_level as keyof typeof rarityColors] || rarityColors.common}`}>
            {hoodie.rarity_level}
          </span>
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-bold text-lg">{hoodie.market_value}</div>
          <div className="text-white/60 text-xs">credits</div>
        </div>
      </div>

      {/* Name & Description */}
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors">
        {hoodie.name}
      </h3>
      <p className="text-white/70 text-sm mb-4 line-clamp-2">
        {hoodie.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-green-400 font-semibold text-sm">{hoodie.impact_contribution}</div>
          <div className="text-white/60 text-xs">Impact Score</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-blue-400 font-semibold text-sm">{hoodie.current_holders}</div>
          <div className="text-white/60 text-xs">Holders</div>
        </div>
      </div>

      {/* Owner & Status */}
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-xs">
          {hoodie.current_owner ? `Owned by ${hoodie.current_owner}` : 'Available'}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          hoodie.is_tradeable 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {hoodie.is_tradeable ? 'Tradeable' : 'Locked'}
        </div>
      </div>
    </div>
  );
}

function HoodieDetailModal({ hoodie, onClose, onTrade }: {
  hoodie: HoodieStockExchangeData;
  onClose: () => void;
  onTrade: (hoodie: HoodieStockExchangeData) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/30">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{hoodie.icon || '👕'}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{hoodie.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                    {hoodie.category}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                    {hoodie.rarity_level}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-white/80">{hoodie.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border border-yellow-400/30">
              <div className="text-2xl font-bold text-yellow-400">{hoodie.market_value}</div>
              <div className="text-white/70 text-sm">Market Value</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-green-400/30">
              <div className="text-2xl font-bold text-green-400">{hoodie.impact_contribution}</div>
              <div className="text-white/70 text-sm">Impact Score</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-blue-400/30">
              <div className="text-2xl font-bold text-blue-400">{hoodie.current_holders}</div>
              <div className="text-white/70 text-sm">Holders</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-purple-400/30">
              <div className="text-2xl font-bold text-purple-400">{hoodie.imagination_credits_earned || 0}</div>
              <div className="text-white/70 text-sm">Credits Earned</div>
            </div>
          </div>

          {/* Unlock Criteria */}
          {hoodie.unlock_criteria && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How to Earn</h3>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/80">{hoodie.acquisition_story}</p>
              </div>
            </div>
          )}

          {/* Trading Actions */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">
                  {hoodie.current_owner ? `Owned by ${hoodie.current_owner}` : 'Available for Earning'}
                </div>
                <div className="text-white/60 text-sm">
                  {hoodie.is_tradeable ? 'This hoodie is available for trading' : 'This hoodie cannot be traded'}
                </div>
              </div>
              {hoodie.is_tradeable && (
                <button
                  onClick={() => onTrade(hoodie)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
                >
                  Initiate Trade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioView({ portfolio }: { portfolio: any }) {
  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💼</div>
        <h3 className="text-xl font-semibold text-white mb-2">Portfolio Loading...</h3>
        <p className="text-white/80">Fetching your hoodie collection</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/30 rounded-xl p-6 border border-yellow-400/30">
          <h3 className="text-lg font-semibold text-white mb-2">Total Portfolio Value</h3>
          <div className="text-3xl font-bold text-yellow-400">{portfolio.total_value.toLocaleString()}</div>
          <div className="text-white/60 text-sm">Imagination Credits</div>
        </div>
        <div className="bg-black/30 rounded-xl p-6 border border-green-400/30">
          <h3 className="text-lg font-semibold text-white mb-2">Hoodies Owned</h3>
          <div className="text-3xl font-bold text-green-400">{portfolio.hoodies.length}</div>
          <div className="text-white/60 text-sm">Unique Collections</div>
        </div>
        <div className="bg-black/30 rounded-xl p-6 border border-blue-400/30">
          <h3 className="text-lg font-semibold text-white mb-2">Total Credits Earned</h3>
          <div className="text-3xl font-bold text-blue-400">{portfolio.imagination_credits.toLocaleString()}</div>
          <div className="text-white/60 text-sm">Lifetime Earnings</div>
        </div>
      </div>

      {/* Owned Hoodies */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Your Hoodie Collection</h3>
        {portfolio.hoodies.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-white/80">No hoodies in your portfolio yet.</p>
            <p className="text-white/60 text-sm mt-2">Complete challenges and engage with content to earn hoodies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.hoodies.map((hoodie: HoodieStockExchangeData) => (
              <div key={hoodie.id} className="bg-white/5 rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{hoodie.icon || '👕'}</span>
                  <span className="text-yellow-400 font-semibold">{hoodie.market_value}</span>
                </div>
                <h4 className="text-white font-medium mb-1">{hoodie.name}</h4>
                <p className="text-white/60 text-sm">{hoodie.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TradingView({ hoodies }: { hoodies: HoodieStockExchangeData[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-white mb-2">Trading Coming Soon</h3>
        <p className="text-white/80 mb-4">Active trading features are in development</p>
        <p className="text-white/60 text-sm">For now, focus on earning hoodies through the Hoodie Challenge!</p>
      </div>
    </div>
  );
}

function AnalyticsView({ stats, hoodies }: { stats: ExchangeStats | null; hoodies: HoodieStockExchangeData[] }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Category Distribution */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Category Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.top_categories.map(({ category, count }) => (
            <div key={category} className="bg-white/5 rounded-lg p-4">
              <div className="text-lg font-semibold text-white">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
              <div className="text-yellow-400 font-bold text-xl">{count}</div>
              <div className="text-white/60 text-sm">hoodies</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rarity Distribution */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Rarity Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.rarity_distribution.map(({ rarity, count }) => (
            <div key={rarity} className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-white capitalize">{rarity}</div>
              <div className="text-yellow-400 font-bold text-2xl">{count}</div>
              <div className="text-white/60 text-sm">hoodies</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Highest Value Hoodies</h3>
        <div className="space-y-3">
          {hoodies
            .sort((a, b) => b.market_value - a.market_value)
            .slice(0, 5)
            .map((hoodie, index) => (
              <div key={hoodie.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                  <span className="text-lg">{hoodie.icon || '👕'}</span>
                  <div>
                    <div className="text-white font-medium">{hoodie.name}</div>
                    <div className="text-white/60 text-sm">{hoodie.category}</div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">{hoodie.market_value} credits</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function getRarityScore(rarity: string): number {
  const scores = { mythic: 4, legendary: 3, rare: 2, common: 1 };
  return scores[rarity as keyof typeof scores] || 1;
}