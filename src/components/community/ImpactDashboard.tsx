/**
 * Impact Dashboard Component
 * 
 * Displays community impact metrics, milestones, stories, and recognition
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  StarIcon,
  HeartIcon,
  UsersIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ImpactDashboardProps {
  sessionId: string;
  scope?: 'personal' | 'community' | 'global';
}

interface ImpactStory {
  id: string;
  title: string;
  storytellerSessionId: string;
  impactType: string;
  story: string;
  beneficiaries: {
    direct: number;
    indirect: number;
    communities: string[];
  };
  lessonsLearned: string[];
  createdAt: string;
  featuredStory: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  celebrationLevel: string;
  rewards: {
    badge?: string;
    title?: string;
    communityRecognition?: boolean;
  };
}

export default function ImpactDashboard({ sessionId, scope = 'personal' }: ImpactDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'milestones' | 'recognition'>('overview');
  
  // Create story form state
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    story: '',
    impactType: 'personal_transformation' as const,
    beneficiaries: { direct: 1, indirect: 0, communities: [] as string[] },
    lessonsLearned: ['']
  });

  useEffect(() => {
    loadDashboardData();
    loadStories();
    loadMilestones();
  }, [sessionId, scope]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`/api/community/impact?action=dashboard&sessionId=${sessionId}&scope=${scope}`);
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Dashboard load error:', err);
    }
  };

  const loadStories = async () => {
    try {
      const response = await fetch(`/api/community/impact?action=stories`);
      const result = await response.json();
      
      if (result.success) {
        setStories(result.data.stories);
      } else {
        console.error('Failed to load stories:', result.error);
      }
    } catch (err) {
      console.error('Stories load error:', err);
    }
  };

  const loadMilestones = async () => {
    try {
      const response = await fetch(`/api/community/impact?action=milestones`);
      const result = await response.json();
      
      if (result.success) {
        setMilestones(result.data.milestones);
      } else {
        console.error('Failed to load milestones:', result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createStory = async () => {
    if (!newStory.title.trim() || !newStory.story.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/community/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_story',
          sessionId,
          storyData: {
            ...newStory,
            timeline: {
              startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
              endDate: new Date().toISOString(),
              keyEvents: []
            },
            lessonsLearned: newStory.lessonsLearned.filter(lesson => lesson.trim())
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowStoryForm(false);
        setNewStory({
          title: '',
          story: '',
          impactType: 'personal_transformation',
          beneficiaries: { direct: 1, indirect: 0, communities: [] },
          lessonsLearned: ['']
        });
        loadStories();
        loadDashboardData();
      } else {
        setError(result.error || 'Failed to create story');
      }
    } catch (err) {
      setError('Failed to create impact story');
      console.error('Story creation error:', err);
    }
  };

  const getImpactTypeIcon = (type: string) => {
    const icons = {
      personal_transformation: '🌱',
      community_building: '🤝',
      implementation_success: '🚀',
      cultural_change: '🏛️'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  const getCelebrationIcon = (level: string) => {
    const icons = {
      recognition: '🏅',
      celebration: '🎉',
      major_milestone: '🏆'
    };
    return icons[level as keyof typeof icons] || '⭐';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading impact dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <ChartBarIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Impact Dashboard</h1>
            <p className="text-gray-600">Track your growth and community contributions</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData?.personalMetrics?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Impact Metrics</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.milestones?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Milestones</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData?.stories?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Stories Shared</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {dashboardData?.recognitions?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Recognitions</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'stories', label: 'Impact Stories', icon: BookOpenIcon },
              { id: 'milestones', label: 'Milestones', icon: TrophyIcon },
              { id: 'recognition', label: 'Recognition', icon: StarIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Impact Overview</h3>
              
              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Recent Impact Activity</h4>
                {dashboardData?.personalMetrics?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.personalMetrics.slice(0, 5).map((metric: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <h5 className="font-medium text-gray-900">{metric.metricName}</h5>
                          <p className="text-sm text-gray-600">{metric.impactDescription}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-purple-600">{metric.metricValue} {metric.metricUnit}</div>
                          <div className="text-xs text-gray-500">{new Date(metric.measuredAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No impact metrics yet</p>
                    <p className="text-sm">Start participating in community activities to track your impact</p>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {dashboardData?.recommendations?.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5 text-blue-600" />
                    Recommendations for Growth
                  </h4>
                  <ul className="space-y-2">
                    {dashboardData.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                        <SparklesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Impact Stories</h3>
                <button
                  onClick={() => setShowStoryForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Share Your Story
                </button>
              </div>

              {/* Create Story Form */}
              {showStoryForm && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Share Your Impact Story</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Story Title *</label>
                      <input
                        type="text"
                        value={newStory.title}
                        onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., How AIME Philosophy Transformed My Teaching"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Story *</label>
                      <textarea
                        value={newStory.story}
                        onChange={(e) => setNewStory(prev => ({ ...prev, story: e.target.value }))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell us about your journey, the challenges you faced, and the impact you've created..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Impact Type</label>
                        <select
                          value={newStory.impactType}
                          onChange={(e) => setNewStory(prev => ({ ...prev, impactType: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="personal_transformation">Personal Transformation</option>
                          <option value="community_building">Community Building</option>
                          <option value="implementation_success">Implementation Success</option>
                          <option value="cultural_change">Cultural Change</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">People Directly Impacted</label>
                        <input
                          type="number"
                          min="1"
                          value={newStory.beneficiaries.direct}
                          onChange={(e) => setNewStory(prev => ({ 
                            ...prev, 
                            beneficiaries: { ...prev.beneficiaries, direct: parseInt(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Lessons Learned</label>
                      {newStory.lessonsLearned.map((lesson, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={lesson}
                            onChange={(e) => {
                              const newLessons = [...newStory.lessonsLearned];
                              newLessons[index] = e.target.value;
                              setNewStory(prev => ({ ...prev, lessonsLearned: newLessons }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., Cultural context is crucial for effective implementation"
                          />
                          {newStory.lessonsLearned.length > 1 && (
                            <button
                              onClick={() => {
                                const newLessons = newStory.lessonsLearned.filter((_, i) => i !== index);
                                setNewStory(prev => ({ ...prev, lessonsLearned: newLessons }));
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setNewStory(prev => ({ 
                          ...prev, 
                          lessonsLearned: [...prev.lessonsLearned, ''] 
                        }))}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add lesson
                      </button>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowStoryForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createStory}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Share Story
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stories List */}
              {stories.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No impact stories yet</p>
                  <p className="text-sm text-gray-400">Share your first story to inspire others</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {stories.map((story, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getImpactTypeIcon(story.impactType)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{story.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{story.impactType.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {story.featuredStory && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{story.story}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span>{story.beneficiaries.direct} directly impacted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HeartIcon className="h-4 w-4 text-gray-400" />
                          <span>{story.beneficiaries.indirect} indirectly impacted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LightBulbIcon className="h-4 w-4 text-gray-400" />
                          <span>{story.lessonsLearned.length} lessons learned</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Shared {new Date(story.createdAt).toLocaleDateString()}
                        </div>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          Read Full Story →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Achievement Milestones</h3>
              
              {milestones.length === 0 ? (
                <div className="text-center py-12">
                  <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No milestones available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getCelebrationIcon(milestone.celebrationLevel)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{milestone.type} • {milestone.category}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium capitalize">
                          {milestone.celebrationLevel}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{milestone.description}</p>

                      {milestone.rewards && (
                        <div className="bg-gray-50 rounded p-3 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Rewards</h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            {milestone.rewards.badge && (
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                <span>Badge: {milestone.rewards.badge}</span>
                              </div>
                            )}
                            {milestone.rewards.title && (
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                <span>Title: {milestone.rewards.title}</span>
                              </div>
                            )}
                            {milestone.rewards.communityRecognition && (
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                <span>Community Recognition</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Progress: 0% complete
                        </div>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recognition Tab */}
          {activeTab === 'recognition' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Community Recognition</h3>
              
              <div className="text-center py-12">
                <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No recognitions yet</p>
                <p className="text-sm text-gray-400">Continue contributing to earn community recognition</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}