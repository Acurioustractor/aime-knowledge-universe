'use client';

import { useState, useEffect } from 'react';
import { HoodieStockExchangeData, ExchangeStats, fetchHoodieStockExchangeData } from '@/lib/integrations/hoodie-stock-exchange-data';
import { hoodieEarningEngine } from '@/lib/hoodie-stock-exchange/earning-engine';

interface LearningPath {
  id: string;
  name: string;
  description: string;
  totalHoodies: number;
  earnedHoodies: number;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  hoodies?: HoodieStockExchangeData[];
}

interface EligibilityStatus {
  eligible: boolean;
  missing_requirements: string[];
  progress_percentage: number;
  next_steps: string[];
}

export function HoodieExchangeInterface() {
  const [hoodies, setHoodies] = useState<HoodieStockExchangeData[]>([]);
  const [stats, setStats] = useState<ExchangeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'journey' | 'collection' | 'share'>('journey');
  const [selectedHoodie, setSelectedHoodie] = useState<HoodieStockExchangeData | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [userName, setUserName] = useState<string>('Learning Explorer');
  const [userId] = useState<string>('user-demo-123'); // Mock user ID
  const [eligibilityStatuses, setEligibilityStatuses] = useState<Record<string, EligibilityStatus>>({});
  const [checkingEligibility, setCheckingEligibility] = useState<Set<string>>(new Set());

  // Learning paths generated from real hoodie data
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      const data = await fetchHoodieStockExchangeData();
      setHoodies(data.hoodies);
      setStats(data.stats);
      
      // Generate learning paths from real hoodie data
      const pathsMap = new Map();
      
      data.hoodies.forEach(hoodie => {
        const category = hoodie.category;
        if (!pathsMap.has(category)) {
          pathsMap.set(category, {
            id: category,
            name: getCategoryDisplayName(category),
            description: getCategoryDescription(category),
            hoodies: [],
            totalHoodies: 0,
            earnedHoodies: 0, // Would be calculated from user data
            icon: getCategoryIcon(category),
            difficulty: getDifficultyFromCategory(category),
            estimatedTime: getEstimatedTimeFromCategory(category)
          });
        }
        
        const path = pathsMap.get(category);
        path.hoodies.push(hoodie);
        path.totalHoodies += 1;
      });

      // Set learning paths from generated data
      setLearningPaths(Array.from(pathsMap.values()));
      
      // Check eligibility for featured hoodies
      const featuredHoodies = data.hoodies.slice(0, 6);
      for (const hoodie of featuredHoodies) {
        await checkHoodieEligibility(hoodie.id);
      }
      
    } catch (error) {
      console.error('Failed to load learning data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const checkHoodieEligibility = async (hoodieId: string) => {
    if (checkingEligibility.has(hoodieId)) return;
    
    setCheckingEligibility(prev => new Set(prev).add(hoodieId));
    
    try {
      const response = await fetch(`/api/hoodies/earning/eligibility?learner_id=${userId}&hoodie_id=${hoodieId}`);
      if (response.ok) {
        const eligibility = await response.json();
        setEligibilityStatuses(prev => ({
          ...prev,
          [hoodieId]: eligibility
        }));
      }
    } catch (error) {
      console.error('Failed to check eligibility:', error);
    } finally {
      setCheckingEligibility(prev => {
        const newSet = new Set(prev);
        newSet.delete(hoodieId);
        return newSet;
      });
    }
  };

  const getCategoryDisplayName = (category: string): string => {
    const names = {
      transformation: 'Transformation & Joy',
      knowledge: 'Indigenous Knowledge Systems', 
      community: 'Community Building',
      leadership: 'Leadership & Presidents',
      education: 'Educational Innovation',
      innovation: 'Embassy & Innovation',
      systems: 'Systems Change',
      stewardship: 'Custodial Stewardship',
      tools: 'Toolshed Mastery',
      imagination: 'IMAGI-NATION',
      general: 'General Learning'
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions = {
      transformation: 'Master joy-centered approaches to personal and organizational transformation',
      knowledge: 'Explore Indigenous Knowledge Systems and traditional wisdom',
      community: 'Build and strengthen community connections and support networks',
      leadership: 'Develop leadership skills for positive social impact',
      education: 'Innovate in educational approaches and learning systems',
      innovation: 'Drive innovation and creative problem-solving in your field',
      systems: 'Understand and influence complex systems for sustainable change',
      stewardship: 'Practice custodial stewardship of resources and knowledge',
      tools: 'Master practical tools and frameworks for impact',
      imagination: 'Engage with visionary thinking and imagination-centered practices',
      general: 'General learning and skill development'
    };
    return descriptions[category as keyof typeof descriptions] || 'Develop expertise in this area';
  };

  const getDifficultyFromCategory = (category: string): 'beginner' | 'intermediate' | 'advanced' => {
    const difficulties = {
      transformation: 'advanced',
      knowledge: 'intermediate',
      community: 'beginner',
      leadership: 'advanced',
      education: 'intermediate',
      innovation: 'advanced',
      systems: 'advanced',
      stewardship: 'intermediate',
      tools: 'beginner',
      imagination: 'advanced',
      general: 'beginner'
    };
    return difficulties[category as keyof typeof difficulties] || 'beginner';
  };

  const getEstimatedTimeFromCategory = (category: string): string => {
    const times = {
      transformation: '12-16 weeks',
      knowledge: '8-12 weeks',
      community: '4-6 weeks',
      leadership: '10-14 weeks',
      education: '6-10 weeks',
      innovation: '8-12 weeks',
      systems: '14-18 weeks',
      stewardship: '6-8 weeks',
      tools: '2-4 weeks',
      imagination: '16-20 weeks',
      general: '4-6 weeks'
    };
    return times[category as keyof typeof times] || '4-6 weeks';
  };

  const getAchievementColor = (category: string) => {
    const colors = {
      transformation: 'from-green-400 to-green-600',
      knowledge: 'from-blue-400 to-blue-600', 
      impact: 'from-purple-400 to-purple-600',
      innovation: 'from-yellow-400 to-yellow-600',
      leadership: 'from-red-400 to-red-600',
      community: 'from-indigo-400 to-indigo-600',
      wisdom: 'from-orange-400 to-orange-600',
      general: 'from-gray-400 to-gray-600'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      transformation: '🌟',
      knowledge: '📚',
      impact: '🚀',
      innovation: '💡',
      leadership: '👑',
      community: '🤝',
      wisdom: '🧙‍♂️',
      general: '🎓'
    };
    return icons[category as keyof typeof icons] || icons.general;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      legendary: 'from-purple-400 to-purple-600',
      mythic: 'from-yellow-400 to-yellow-600'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getUserHoodies = () => {
    // In production, this would filter based on user's actual achievements
    return hoodies.slice(0, 5); // Mock: show first 5 as earned
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-400 text-6xl mb-4">📚</div>
        <h2 className="text-white text-2xl font-bold mb-4">Learning System Offline</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button 
          onClick={loadLearningData}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">🎓 Your Learning Journey</h1>
        <p className="text-xl text-gray-300">Earn hoodies by mastering AIME wisdom and systems thinking</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {[
          { id: 'journey', label: '🛤️ Learning Paths', desc: 'Discover and start new journeys' },
          { id: 'collection', label: '🏆 My Collection', desc: 'Hoodies you\'ve earned' },
          { id: 'share', label: '🤝 Share & Mentor', desc: 'Help others learn' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedView === tab.id
                ? 'bg-white bg-opacity-20 text-white shadow-lg'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-15'
            }`}
          >
            <div className="text-lg">{tab.label}</div>
            <div className="text-xs opacity-75">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Learning Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{getUserHoodies().length}</div>
          <div className="text-sm text-gray-300">Hoodies Earned</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{learningPaths.length}</div>
          <div className="text-sm text-gray-300">Learning Paths</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{learningPaths.reduce((sum, path) => sum + path.earnedHoodies, 0)}</div>
          <div className="text-sm text-gray-300">Total Progress</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{learningPaths.length > 0 ? Math.round((learningPaths.reduce((sum, path) => sum + path.earnedHoodies, 0) / learningPaths.reduce((sum, path) => sum + path.totalHoodies, 0)) * 100) : 0}%</div>
          <div className="text-sm text-gray-300">Completion</div>
        </div>
      </div>

      {/* Journey View - Learning Paths */}
      {selectedView === 'journey' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🛤️ Learning Journeys</h2>
            <p className="text-gray-300">Choose your path to earn hoodies through mastery and impact</p>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-white bg-opacity-10 rounded-lg p-6 cursor-pointer hover:bg-opacity-20 transition-all"
                onClick={() => setSelectedPath(path)}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{path.icon}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{path.name}</h3>
                    <p className={`text-sm capitalize ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty} • {path.estimatedTime}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{path.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{path.totalHoodies}</div>
                    <div className="text-xs text-gray-400">Total Hoodies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{path.earnedHoodies}</div>
                    <div className="text-xs text-gray-400">Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">
                      {path.totalHoodies > 0 ? Math.round((path.earnedHoodies / path.totalHoodies) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-400">Progress</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${path.totalHoodies > 0 ? (path.earnedHoodies / path.totalHoodies) * 100 : 0}%` 
                    }}
                  ></div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
                  Start Journey
                </button>
              </div>
            ))}
          </div>

          {/* Featured Earning Opportunities */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6">🌟 Featured Earning Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hoodies.slice(0, 6).map((hoodie) => {
                const eligibility = eligibilityStatuses[hoodie.id];
                const isChecking = checkingEligibility.has(hoodie.id);
                
                return (
                  <div
                    key={hoodie.id}
                    className="bg-white bg-opacity-10 rounded-lg p-6 cursor-pointer hover:bg-opacity-20 transition-all"
                    onClick={() => setSelectedHoodie(hoodie)}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getAchievementColor(hoodie.category)} rounded-full flex items-center justify-center text-white text-xl mr-4`}>
                        {getCategoryIcon(hoodie.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{hoodie.name}</h4>
                        <p className="text-sm text-gray-300 capitalize">{hoodie.rarity_level}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{hoodie.description}</p>
                    
                    {/* Eligibility Status */}
                    {isChecking ? (
                      <div className="bg-gray-700 rounded p-3 mb-4">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                          <span className="text-gray-300 text-sm">Checking eligibility...</span>
                        </div>
                      </div>
                    ) : eligibility ? (
                      <div className={`rounded p-3 mb-4 ${eligibility.eligible ? 'bg-green-900 bg-opacity-50' : 'bg-yellow-900 bg-opacity-50'}`}>
                        <div className="flex items-center mb-2">
                          <span className={`text-sm font-medium ${eligibility.eligible ? 'text-green-300' : 'text-yellow-300'}`}>
                            {eligibility.eligible ? '✅ Ready to Earn!' : `📈 ${eligibility.progress_percentage}% Complete`}
                          </span>
                        </div>
                        {!eligibility.eligible && eligibility.next_steps.length > 0 && (
                          <div className="text-xs text-gray-300">
                            Next: {eligibility.next_steps[0]}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{hoodie.imagination_credit_multiplier}x</div>
                        <div className="text-xs text-gray-400">Credits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{hoodie.current_holders}</div>
                        <div className="text-xs text-gray-400">Holders</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          checkHoodieEligibility(hoodie.id);
                        }}
                        className="bg-purple-600 text-white py-1 px-3 rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        Check Progress
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Collection View - My Hoodies */}
      {selectedView === 'collection' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🏆 My Hoodie Collection</h2>
            <p className="text-gray-300">The hoodies you've earned through learning and impact</p>
          </div>

          {getUserHoodies().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getUserHoodies().map((hoodie) => (
                <div key={hoodie.id} className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getAchievementColor(hoodie.category)} rounded-full flex items-center justify-center text-white text-xl mr-4`}>
                      {getCategoryIcon(hoodie.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{hoodie.name}</h4>
                      <p className="text-sm text-gray-300 capitalize">{hoodie.rarity_level}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Impact Value:</span>
                      <span className="text-white">{hoodie.base_impact_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Credits Earned:</span>
                      <span className="text-yellow-400">{hoodie.imagination_credits_earned}</span>
                    </div>
                  </div>

                  {hoodie.acquisition_story && (
                    <div className="mt-4 p-3 bg-white bg-opacity-5 rounded text-sm text-gray-300">
                      <strong>Story:</strong> {hoodie.acquisition_story}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Start Your Collection</h3>
              <p className="text-gray-300 mb-6">Complete learning journeys to earn your first hoodie</p>
              <button
                onClick={() => setSelectedView('journey')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Learning Paths
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share & Mentor View */}
      {selectedView === 'share' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🤝 Share & Mentor</h2>
            <p className="text-gray-300">Help others on their learning journey and earn mentorship hoodies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mentoring Opportunities */}
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎓 Mentoring Opportunities</h3>
              <p className="text-gray-300 mb-4">Share your knowledge and earn mentorship hoodies</p>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">📚</div>
                  <div>
                    <div className="text-white font-medium">Guide newcomers</div>
                    <div className="text-gray-400 text-sm">Help new learners get started</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">🔧</div>
                  <div>
                    <div className="text-white font-medium">Share tools & resources</div>
                    <div className="text-gray-400 text-sm">Contribute useful resources</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">🌟</div>
                  <div>
                    <div className="text-white font-medium">Lead study groups</div>
                    <div className="text-gray-400 text-sm">Facilitate learning circles</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition-colors">
                Start Mentoring
              </button>
            </div>

            {/* Community Contributions */}
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">🌍 Community Impact</h3>
              <p className="text-gray-300 mb-4">Make real-world impact and earn transformation hoodies</p>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">🏘️</div>
                  <div>
                    <div className="text-white font-medium">Community projects</div>
                    <div className="text-gray-400 text-sm">Lead local transformation initiatives</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">📖</div>
                  <div>
                    <div className="text-white font-medium">Document learnings</div>
                    <div className="text-gray-400 text-sm">Share your transformation story</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white bg-opacity-5 rounded">
                  <div className="text-2xl mr-3">🤲</div>
                  <div>
                    <div className="text-white font-medium">Support others</div>
                    <div className="text-gray-400 text-sm">Help fellow learners succeed</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded font-medium hover:bg-purple-700 transition-colors">
                Share Impact Story
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Hoodie Detail Modal */}
      {selectedHoodie && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(selectedHoodie.rarity_level)} rounded-full flex items-center justify-center text-white text-2xl mr-4`}>
                    {getCategoryIcon(selectedHoodie.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedHoodie.name}</h2>
                    <p className="text-gray-300 capitalize">{selectedHoodie.rarity_level} • {selectedHoodie.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedHoodie(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-300">{selectedHoodie.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-white mb-2">Impact Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Impact:</span>
                      <span className="text-white">{selectedHoodie.base_impact_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Market Value:</span>
                      <span className="text-yellow-400">{selectedHoodie.market_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Utilization:</span>
                      <span className="text-white">{selectedHoodie.utilization_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Community Score:</span>
                      <span className="text-green-400">{selectedHoodie.community_score}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Trading Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tradeable:</span>
                      <span className={selectedHoodie.is_tradeable ? 'text-green-400' : 'text-red-400'}>
                        {selectedHoodie.is_tradeable ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Holders:</span>
                      <span className="text-white">{selectedHoodie.current_holders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Trading Volume:</span>
                      <span className="text-white">{selectedHoodie.trading_volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Credit Multiplier:</span>
                      <span className="text-purple-400">{selectedHoodie.imagination_credit_multiplier}x</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedHoodie.current_owner && (
                <div>
                  <h4 className="font-bold text-white mb-2">Current Owner</h4>
                  <p className="text-gray-300">{selectedHoodie.current_owner}</p>
                  {selectedHoodie.acquisition_story && (
                    <div className="mt-2 p-3 bg-white bg-opacity-5 rounded text-sm text-gray-300">
                      <strong>Acquisition Story:</strong> {selectedHoodie.acquisition_story}
                    </div>
                  )}
                </div>
              )}

              {selectedHoodie.tags.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHoodie.tags.map((tag, index) => (
                      <span key={index} className="bg-white bg-opacity-20 text-gray-300 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => checkHoodieEligibility(selectedHoodie.id)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Check My Progress
                </button>
                <button
                  onClick={() => setSelectedHoodie(null)}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Detail Modal */}
      {selectedPath && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="text-5xl mr-4">{selectedPath.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedPath.name}</h2>
                    <p className={`text-lg capitalize ${getDifficultyColor(selectedPath.difficulty)}`}>
                      {selectedPath.difficulty} • {selectedPath.estimatedTime}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPath(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-300 text-lg">{selectedPath.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{selectedPath.totalHoodies}</div>
                  <div className="text-sm text-gray-300">Total Hoodies</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{selectedPath.earnedHoodies}</div>
                  <div className="text-sm text-gray-300">Earned</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedPath.totalHoodies > 0 ? Math.round((selectedPath.earnedHoodies / selectedPath.totalHoodies) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-300">Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-3 rounded-full transition-all"
                  style={{ 
                    width: `${selectedPath.totalHoodies > 0 ? (selectedPath.earnedHoodies / selectedPath.totalHoodies) * 100 : 0}%` 
                  }}
                ></div>
              </div>

              {/* Available Hoodies in this Path */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Hoodies in this Learning Path</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPath.hoodies?.map((hoodie) => {
                    const eligibility = eligibilityStatuses[hoodie.id];
                    const isChecking = checkingEligibility.has(hoodie.id);
                    
                    return (
                      <div
                        key={hoodie.id}
                        className="bg-white bg-opacity-10 rounded-lg p-4 cursor-pointer hover:bg-opacity-20 transition-all"
                        onClick={() => {
                          setSelectedPath(null);
                          setSelectedHoodie(hoodie);
                        }}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getAchievementColor(hoodie.category)} rounded-full flex items-center justify-center text-white text-lg mr-3`}>
                            {getCategoryIcon(hoodie.category)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{hoodie.name}</h4>
                            <p className="text-xs text-gray-300 capitalize">{hoodie.rarity_level}</p>
                          </div>
                        </div>
                        
                        {/* Mini Eligibility Status */}
                        {isChecking ? (
                          <div className="text-xs text-gray-300 flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400 mr-1"></div>
                            Checking...
                          </div>
                        ) : eligibility ? (
                          <div className={`text-xs font-medium ${eligibility.eligible ? 'text-green-300' : 'text-yellow-300'}`}>
                            {eligibility.eligible ? '✅ Ready to Earn!' : `📈 ${eligibility.progress_percentage}%`}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              checkHoodieEligibility(hoodie.id);
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Check Progress →
                          </button>
                        )}

                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-gray-400">{hoodie.imagination_credit_multiplier}x credits</span>
                          <span className="text-gray-400">{hoodie.current_holders} holders</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setSelectedPath(null);
                    setSelectedView('journey');
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start This Journey
                </button>
                <button
                  onClick={() => setSelectedPath(null)}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}