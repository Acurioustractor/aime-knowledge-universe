'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InsightData {
  totalCases: number;
  flagshipCases: number;
  totalPhases: number;
  totalHoodies: number;
  crossConnections: number;
  impactAreas: string[];
  recentActivity: any[];
}

export default function BusinessCaseInsights() {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      // This would fetch real insights from the API
      setInsights({
        totalCases: 8,
        flagshipCases: 3,
        totalPhases: 32,
        totalHoodies: 47,
        crossConnections: 156,
        impactAreas: ['Education', 'Leadership', 'Economics', 'Governance', 'Innovation'],
        recentActivity: [
          { type: 'new_case', title: 'Joy Corps expansion', time: '2 days ago' },
          { type: 'update', title: 'Presidents program milestone', time: '1 week ago' }
        ]
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const insightCards = [
    {
      title: "Transformation Network",
      description: "See how all 8 pathways interconnect to create systemic change",
      icon: "🕸️",
      color: "from-blue-500 to-purple-500",
      stats: `${insights.crossConnections} connections mapped`
    },
    {
      title: "Digital Progression",
      description: "Track your journey through digital hoodies and achievements",
      icon: "🏆",
      color: "from-yellow-500 to-orange-500",
      stats: `${insights.totalHoodies} hoodies available`
    },
    {
      title: "Impact Amplification",
      description: "Measure collective impact across all transformation areas",
      icon: "📈",
      color: "from-green-500 to-teal-500",
      stats: `${insights.impactAreas.length} impact areas`
    },
    {
      title: "Community Intelligence",
      description: "Learn from the collective wisdom of all participants",
      icon: "🧠",
      color: "from-purple-500 to-pink-500",
      stats: "Global community insights"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Insights Overview */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🔮 Transformation Insights</h2>
        <p className="text-indigo-200 mb-6">
          Discover patterns, connections, and insights across AIME's transformation ecosystem
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{insights.totalCases}</div>
            <div className="text-sm text-indigo-200">Active Pathways</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{insights.totalPhases}</div>
            <div className="text-sm text-indigo-200">Transformation Phases</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{insights.crossConnections}</div>
            <div className="text-sm text-indigo-200">Cross-Connections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-indigo-200">Possibility Space</div>
          </div>
        </div>
      </div>

      {/* Interactive Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insightCards.map((card, index) => (
          <div 
            key={index}
            className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${card.color}`}
            onClick={() => setActiveInsight(index)}
          >
            <div className="relative z-10 text-white">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-white/90 text-sm mb-3">{card.description}</p>
              <div className="text-xs text-white/75 font-medium">{card.stats}</div>
            </div>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Dynamic Insight Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">{insightCards[activeInsight].icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{insightCards[activeInsight].title}</h3>
        </div>
        
        {activeInsight === 0 && <NetworkInsight insights={insights} />}
        {activeInsight === 1 && <HoodieInsight insights={insights} />}
        {activeInsight === 2 && <ImpactInsight insights={insights} />}
        {activeInsight === 3 && <CommunityInsight insights={insights} />}
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="text-xl mr-2">⚡</span>
            Recent Activity
          </h3>
          <Link href="/business-cases/activity" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        <div className="space-y-3">
          {insights.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
              <div className="text-xs text-gray-400">{activity.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual insight components
function NetworkInsight({ insights }: { insights: InsightData }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Visualize how the {insights.totalCases} transformation pathways create {insights.crossConnections} 
        meaningful connections across different domains of change.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {insights.impactAreas.map((area, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-medium text-gray-900 text-sm">{area}</div>
            <div className="text-xs text-gray-500">Active pathway</div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        🕸️ Explore Network Map
      </button>
    </div>
  );
}

function HoodieInsight({ insights }: { insights: InsightData }) {
  const hoodieTypes = [
    { name: 'Systems Thinking', count: 12, color: 'bg-blue-100 text-blue-800' },
    { name: 'Leadership', count: 8, color: 'bg-purple-100 text-purple-800' },
    { name: 'Innovation', count: 15, color: 'bg-green-100 text-green-800' },
    { name: 'Network Building', count: 12, color: 'bg-orange-100 text-orange-800' }
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Track your progress through {insights.totalHoodies} digital hoodies across all transformation pathways. 
        Each hoodie represents mastery of specific capabilities and contributions to the network.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {hoodieTypes.map((type, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900 text-sm">{type.name}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${type.color}`}>
                {type.count} available
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(type.count / 15) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-yellow-500 text-yellow-900 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
        🏆 View Hoodie Collection
      </button>
    </div>
  );
}

function ImpactInsight({ insights }: { insights: InsightData }) {
  const impactMetrics = [
    { metric: 'Organizations Transformed', value: '127', change: '+23%' },
    { metric: 'Leaders Developed', value: '2,341', change: '+45%' },
    { metric: 'Communities Engaged', value: '89', change: '+12%' },
    { metric: 'Systemic Changes', value: '34', change: '+67%' }
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Measure the collective impact across all {insights.totalCases} transformation pathways. 
        These metrics show the real-world changes happening through AIME's approach.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-800">{metric.value}</div>
            <div className="text-sm text-gray-700 mb-1">{metric.metric}</div>
            <div className="text-xs text-green-600 font-medium">{metric.change} this quarter</div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
        📊 View Impact Dashboard
      </button>
    </div>
  );
}

function CommunityInsight({ insights }: { insights: InsightData }) {
  const communityStats = [
    'Global network of change-makers sharing knowledge',
    'Real-time collaboration across transformation pathways',
    'Collective intelligence from diverse implementation contexts',
    'Peer mentoring and support across all journey phases'
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Tap into the collective wisdom of thousands of transformation leaders working across 
        all {insights.totalCases} pathways worldwide.
      </p>
      
      <div className="space-y-3">
        {communityStats.map((stat, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
              {index + 1}
            </div>
            <div className="text-sm text-gray-700">{stat}</div>
          </div>
        ))}
      </div>
      
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
        🧠 Join Community Intelligence
      </button>
    </div>
  );
}