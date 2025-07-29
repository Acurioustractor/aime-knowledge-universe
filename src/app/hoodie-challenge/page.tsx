'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HoodieEconomicsEngine, MasterHoodieProfile, MASTER_HOODIE_CATEGORIES } from '@/lib/hoodie-challenge/master-hoodie-system';
import { INDIGENOUS_NATURE_CHALLENGES, getActiveChalllenges } from '@/lib/hoodie-challenge/indigenous-challenges';
import { PlatformHoodieEngine, HoodieEarningOpportunity } from '@/lib/hoodie-challenge/platform-integration';

export default function HoodieChallengePage() {
  const [profile, setProfile] = useState<MasterHoodieProfile | null>(null);
  const [opportunities, setOpportunities] = useState<HoodieEarningOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'economics' | 'opportunities'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadOpportunities();
  }, []);

  const loadProfile = () => {
    // Load or create user profile
    const stored = localStorage.getItem('hoodie-challenge-profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      // Create new profile
      const newProfile: MasterHoodieProfile = {
        userId: 'demo-user',
        displayName: 'AIME Explorer',
        hoodieEconomicsScore: 0,
        totalValue: 0,
        earnedHoodies: [],
        completedChallenges: [],
        currentChallenges: [],
        achievements: [],
        level: 1,
        rank: 'New Journey',
        relationalProfile: {
          mentorshipConnections: 0,
          communityContributions: 0,
          knowledgeShared: 0,
          realRelationshipsBuilt: 0,
          indigenousWisdomHonored: 0
        },
        realWorldImpact: {
          menteeCount: 0,
          projectsLed: 0,
          communityHoursContributed: 0,
          indigenousKnowledgeShared: 0,
          systemsChanged: 0
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setProfile(newProfile);
      localStorage.setItem('hoodie-challenge-profile', JSON.stringify(newProfile));
    }
    setLoading(false);
  };

  const loadOpportunities = () => {
    // Analyze platform activity for hoodie earning opportunities
    const opps = PlatformHoodieEngine.analyzeForHoodieEarning('demo-user');
    setOpportunities(opps);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading Hoodie Challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                🏆 AIME Hoodie Challenge BETA
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/hoodie-stock-exchange" 
                className="text-green-400 hover:text-green-300 text-sm font-medium bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-green-400/30 hover:border-green-400/50 transition-all"
              >
                💰 View Stock Exchange
              </Link>
              <div className="text-white/90 text-sm bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-yellow-400/30">
                Hoodie Economics Score: <span className="text-yellow-400 font-bold">{profile.hoodieEconomicsScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-4 border-b border-white/20">
          {[
            { id: 'dashboard', label: '📊 Dashboard', desc: 'Your progress overview' },
            { id: 'challenges', label: '🌱 Challenges', desc: 'Indigenous custodianship challenges' },
            { id: 'economics', label: '👕 Economics', desc: 'Hoodie value & relationships' },
            { id: 'opportunities', label: '✨ Opportunities', desc: 'Hoodie earning chances' }
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
        {activeTab === 'dashboard' && (
          <DashboardView profile={profile} />
        )}
        
        {activeTab === 'challenges' && (
          <ChallengesView />
        )}
        
        {activeTab === 'economics' && (
          <EconomicsView profile={profile} />
        )}
        
        {activeTab === 'opportunities' && (
          <OpportunitiesView opportunities={opportunities} />
        )}
      </div>

      {/* Beta Notice */}
      <div className="fixed bottom-4 right-4 bg-yellow-400/90 text-black px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
        🧪 BETA - Testing New Hoodie Economics System
      </div>
    </div>
  );
}

function DashboardView({ profile }: { profile: MasterHoodieProfile }) {
  const score = HoodieEconomicsEngine.calculateScore(profile);
  const level = HoodieEconomicsEngine.calculateLevel(score);
  const rank = HoodieEconomicsEngine.calculateRank(score);

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{score}</div>
          <div className="text-white/80">Hoodie Economics Score</div>
          <div className="text-xs text-yellow-300 mt-1">Relationship-based value</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-xl p-6 border border-emerald-400/30">
          <div className="text-3xl font-bold text-emerald-400 mb-2">{level}</div>
          <div className="text-white/80">Level</div>
          <div className="text-xs text-emerald-300 mt-1">{rank}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
          <div className="text-3xl font-bold text-blue-400 mb-2">{profile.earnedHoodies.length}</div>
          <div className="text-white/80">Hoodies Earned</div>
          <div className="text-xs text-blue-300 mt-1">Across all categories</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
          <div className="text-3xl font-bold text-purple-400 mb-2">{profile.relationalProfile.realRelationshipsBuilt}</div>
          <div className="text-white/80">Real Relationships</div>
          <div className="text-xs text-purple-300 mt-1">Genuine connections made</div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🌱 Your Learning Journey</h3>
        <div className="space-y-4">
          <div className="text-white/80">
            This system tracks your engagement across the entire AIME Knowledge Universe:
          </div>
          <ul className="text-white/70 space-y-2 ml-4">
            <li>• Deep engagement with content (not just clicking through)</li>
            <li>• Real-world application of Indigenous custodianship</li>
            <li>• Genuine relationship building and knowledge sharing</li>
            <li>• Respectful engagement with cultural knowledge</li>
            <li>• Systems thinking across multiple domains</li>
          </ul>
          <div className="mt-6 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
            <p className="text-yellow-300 font-semibold">🎯 Beta Testing Focus:</p>
            <p className="text-white/80 text-sm mt-1">
              Complete lessons in the Mentor App, watch IMAGI-NATION TV episodes, and engage with business cases 
              to see how the algorithm detects patterns and awards hoodies for deep, relational learning.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/apps/mentor-app"
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg p-4 border border-green-400/30 hover:border-green-400/50 transition-all group"
        >
          <h4 className="text-green-300 font-semibold mb-2 group-hover:text-green-200">🎓 Continue Mentor App</h4>
          <p className="text-white/70 text-sm">Complete lessons to earn foundational hoodies</p>
        </Link>
        
        <Link 
          href="/apps/imagination-tv"
          className="bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-lg p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all group"
        >
          <h4 className="text-purple-300 font-semibold mb-2 group-hover:text-purple-200">📺 Watch IMAGI-NATION TV</h4>
          <p className="text-white/70 text-sm">Deep engagement with episodes unlocks special hoodies</p>
        </Link>
        
        <Link 
          href="/business-cases"
          className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-lg p-4 border border-orange-400/30 hover:border-orange-400/50 transition-all group"
        >
          <h4 className="text-orange-300 font-semibold mb-2 group-hover:text-orange-200">💼 Explore Business Cases</h4>
          <p className="text-white/70 text-sm">Apply learning to real scenarios</p>
        </Link>
      </div>
    </div>
  );
}

function ChallengesView() {
  const activeChallenges = getActiveChalllenges();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">🌱 Indigenous Wisdom Challenges</h2>
        <p className="text-white/80 max-w-3xl mx-auto">
          These challenges are rooted in Indigenous knowledge systems and help you develop systems thinking,
          nature connection, and relational ways of being. Each challenge unlocks unique hoodies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeChallenges.map(challenge => (
          <div key={challenge.id} className="bg-black/30 rounded-xl p-6 border border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{challenge.name}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    {challenge.category.replace('-', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                    {challenge.difficulty}
                  </span>
                  <span className="text-white/60">{challenge.estimatedTime}</span>
                </div>
              </div>
              <div className="text-2xl">
                {challenge.category === 'nature' ? '🌿' : 
                 challenge.category === 'systems-thinking' ? '🧠' : 
                 challenge.category === 'indigenous-wisdom' ? '🪶' : '🤝'}
              </div>
            </div>

            <p className="text-white/80 mb-4">{challenge.description}</p>

            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-white mb-2">Indigenous Wisdom:</h4>
              <p className="text-white/80 text-sm">{challenge.indigenousWisdom}</p>
            </div>

            <div className="bg-yellow-400/10 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-300 mb-2">Real-World Application:</h4>
              <p className="text-white/80 text-sm">{challenge.realWorldApplication}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                {challenge.steps.length} steps • {challenge.rewards.length} hoodie{challenge.rewards.length > 1 ? 's' : ''}
              </div>
              <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-400 hover:to-blue-500 transition-all">
                Start Challenge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EconomicsView({ profile }: { profile: MasterHoodieProfile }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">👕 Hoodie Economics System</h2>
        <p className="text-white/80 max-w-3xl mx-auto">
          Hoodie Economics values relationship, knowledge sharing, and real-world impact over digital metrics.
          Your score reflects the depth of your learning and the strength of your connections.
        </p>
      </div>

      {/* Hoodie Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(MASTER_HOODIE_CATEGORIES).map(([key, category]) => (
          <div key={key} className="bg-black/30 rounded-xl p-4 border border-white/20">
            <div 
              className="w-full h-20 rounded-lg mb-4 flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color + '20', borderColor: category.color + '40' }}
            >
              👕
            </div>
            <h3 className="font-semibold text-white mb-2">{category.name}</h3>
            <p className="text-white/70 text-sm mb-3">{category.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Max: {category.maxHoodies}</span>
              <span className="text-emerald-400">0 earned</span>
            </div>
          </div>
        ))}
      </div>

      {/* Relational Profile */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-bold text-white mb-4">🤝 Your Relational Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{profile.relationalProfile.mentorshipConnections}</div>
            <div className="text-white/80 text-sm">Mentorship Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{profile.relationalProfile.realRelationshipsBuilt}</div>
            <div className="text-white/80 text-sm">Real Relationships</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{profile.relationalProfile.knowledgeShared}</div>
            <div className="text-white/80 text-sm">Knowledge Shared</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{profile.relationalProfile.communityContributions}</div>
            <div className="text-white/80 text-sm">Community Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{profile.relationalProfile.indigenousWisdomHonored}</div>
            <div className="text-white/80 text-sm">Indigenous Wisdom Honored</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunitiesView({ opportunities }: { opportunities: HoodieEarningOpportunity[] }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">✨ Hoodie Earning Opportunities</h2>
        <p className="text-white/80 max-w-3xl mx-auto">
          Based on your learning patterns across the platform, these hoodies are within reach.
          Complete the required actions to earn them.
        </p>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-white mb-2">Keep Learning!</h3>
          <p className="text-white/80 mb-6">
            Engage more deeply with content across the platform to unlock hoodie earning opportunities.
          </p>
          <Link 
            href="/apps/mentor-app"
            className="inline-block bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-emerald-400 hover:to-blue-500 transition-all"
          >
            Start Learning
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-xl p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">🏆 {opp.hoodieId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
              <p className="text-white/90 mb-3">{opp.reason}</p>
              
              <div className="bg-black/30 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Evidence:</h4>
                <p className="text-white/80 text-sm">{opp.evidence}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-white mb-2">Required Actions:</h4>
                <ul className="space-y-1">
                  {opp.requiredActions.map((action, actionIndex) => (
                    <li key={actionIndex} className="text-white/80 text-sm flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-semibold">Value: {opp.estimatedValue} points</span>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all">
                  Claim Hoodie
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}