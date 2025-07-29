/**
 * Regional Community Dashboard Component
 * 
 * Interface for managing regional community activities, governance, and local initiatives
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  GlobeAltIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CogIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface RegionalCommunityDashboardProps {
  sessionId: string;
  communityId?: string;
}

interface RegionalCommunity {
  id: string;
  name: string;
  region: string;
  country: string;
  timezone: string;
  description: string;
  culturalContext: {
    primaryLanguages: string[];
    indigenousGroups: string[];
    culturalConsiderations: string[];
    importantDates: any[];
  };
  leadership: {
    coordinators: string[];
    culturalAdvisors: string[];
    governanceModel: string;
  };
  membershipStats: {
    totalMembers: number;
    activeMembersLastMonth: number;
    newMembersThisMonth: number;
    membershipGrowthRate: number;
  };
  activityMetrics: {
    activeInitiatives: number;
    completedProjects: number;
    upcomingEvents: number;
    knowledgeResourcesShared: number;
  };
  status: 'forming' | 'active' | 'thriving' | 'needs_support';
}

interface RegionalInitiative {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  participantSessionIds: string[];
  timeline: {
    targetCompletionDate: string;
  };
  impact: {
    targetBeneficiaries: number;
    successMetrics: string[];
  };
}

export default function RegionalCommunityDashboard({ 
  sessionId, 
  communityId 
}: RegionalCommunityDashboardProps) {
  const [community, setCommunity] = useState<RegionalCommunity | null>(null);
  const [initiatives, setInitiatives] = useState<RegionalInitiative[]>([]);
  const [governance, setGovernance] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'initiatives' | 'governance' | 'events' | 'members'>('overview');
  
  // New initiative form state
  const [showNewInitiativeForm, setShowNewInitiativeForm] = useState(false);
  const [newInitiative, setNewInitiative] = useState({
    title: '',
    description: '',
    category: 'community_building' as const,
    targetCompletionDate: '',
    targetBeneficiaries: 10,
    successMetrics: [''],
    culturalConsiderations: ['']
  });

  useEffect(() => {
    if (communityId) {
      loadCommunityDashboard();
    } else {
      // If no community ID, try to find user's primary community
      findUserCommunity();
    }
  }, [sessionId, communityId]);

  const loadCommunityDashboard = async () => {
    if (!communityId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/community/regional?action=dashboard&communityId=${communityId}&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success) {
        setCommunity(result.data.community);
        setInitiatives(result.data.activeInitiatives);
        setGovernance(result.data.governance);
        setRecentActivity(result.data.recentActivity);
        setUpcomingEvents(result.data.upcomingEvents);
      } else {
        setError(result.error || 'Failed to load community dashboard');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const findUserCommunity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/regional?action=membership&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data.primaryCommunity) {
        // Redirect to primary community dashboard
        window.location.href = `/community/regional?communityId=${result.data.primaryCommunity.regionalCommunityId}`;
      } else {
        // No community found, show assignment interface
        setError('No regional community assigned. Please set your location preferences.');
      }
    } catch (err) {
      setError('Failed to find your community');
      console.error('Community lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInitiative = async () => {
    if (!communityId || !newInitiative.title.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/community/regional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_initiative',
          sessionId,
          communityId,
          initiativeData: {
            ...newInitiative,
            resources: {
              volunteersNeeded: 5,
              skillsRequired: [],
              materialsNeeded: []
            },
            impact: {
              targetBeneficiaries: newInitiative.targetBeneficiaries,
              successMetrics: newInitiative.successMetrics.filter(m => m.trim())
            },
            culturalConsiderations: newInitiative.culturalConsiderations.filter(c => c.trim())
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowNewInitiativeForm(false);
        setNewInitiative({
          title: '',
          description: '',
          category: 'community_building',
          targetCompletionDate: '',
          targetBeneficiaries: 10,
          successMetrics: [''],
          culturalConsiderations: ['']
        });
        loadCommunityDashboard(); // Reload to show new initiative
      } else {
        setError(result.error || 'Failed to create initiative');
      }
    } catch (err) {
      setError('Failed to create initiative');
      console.error('Initiative creation error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      forming: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      thriving: 'bg-blue-100 text-blue-800',
      needs_support: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      education: '📚',
      community_building: '🤝',
      cultural_preservation: '🏛️',
      systems_change: '⚙️',
      knowledge_sharing: '💡'
    };
    return icons[category as keyof typeof icons] || '🚀';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading regional community dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !community) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Community Not Found</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/community/regional/setup'}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Set Up Regional Community
          </button>
        </div>
      </div>
    );
  }

  if (!community) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <MapPinIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
              <p className="text-gray-600">{community.region}, {community.country}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(community.status)}`}>
                  {community.status.charAt(0).toUpperCase() + community.status.slice(1).replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">• {community.timezone}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Governance Model</div>
            <div className="font-medium text-gray-900 capitalize">{community.leadership.governanceModel}</div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{community.description}</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{community.membershipStats.totalMembers}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{community.activityMetrics.activeInitiatives}</div>
            <div className="text-sm text-gray-600">Active Initiatives</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{community.activityMetrics.completedProjects}</div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{community.activityMetrics.upcomingEvents}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
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
              { id: 'initiatives', label: 'Initiatives', icon: RocketLaunchIcon },
              { id: 'governance', label: 'Governance', icon: CogIcon },
              { id: 'events', label: 'Events', icon: CalendarIcon },
              { id: 'members', label: 'Members', icon: UsersIcon }
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
              <h3 className="text-lg font-semibold text-gray-900">Community Overview</h3>
              
              {/* Cultural Context */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Cultural Context</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Primary Languages</h5>
                    <div className="flex flex-wrap gap-2">
                      {community.culturalContext.primaryLanguages.map((lang, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {community.culturalContext.indigenousGroups.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Indigenous Groups</h5>
                      <div className="flex flex-wrap gap-2">
                        {community.culturalContext.indigenousGroups.map((group, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {community.culturalContext.culturalConsiderations.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700 mb-2">Cultural Considerations</h5>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      {community.culturalContext.culturalConsiderations.map((consideration, i) => (
                        <li key={i}>{consideration}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity to display</p>
                    <p className="text-sm">Community activities will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{activity.title}</h5>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initiatives Tab */}
          {activeTab === 'initiatives' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Community Initiatives</h3>
                <button
                  onClick={() => setShowNewInitiativeForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Initiative
                </button>
              </div>

              {/* New Initiative Form */}
              {showNewInitiativeForm && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Create New Initiative</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={newInitiative.title}
                        onChange={(e) => setNewInitiative(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Community Garden Project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={newInitiative.description}
                        onChange={(e) => setNewInitiative(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe the initiative and its goals..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={newInitiative.category}
                          onChange={(e) => setNewInitiative(prev => ({ ...prev, category: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="community_building">Community Building</option>
                          <option value="education">Education</option>
                          <option value="cultural_preservation">Cultural Preservation</option>
                          <option value="systems_change">Systems Change</option>
                          <option value="knowledge_sharing">Knowledge Sharing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Completion</label>
                        <input
                          type="date"
                          value={newInitiative.targetCompletionDate}
                          onChange={(e) => setNewInitiative(prev => ({ ...prev, targetCompletionDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Beneficiaries</label>
                        <input
                          type="number"
                          min="1"
                          value={newInitiative.targetBeneficiaries}
                          onChange={(e) => setNewInitiative(prev => ({ ...prev, targetBeneficiaries: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowNewInitiativeForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createInitiative}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Create Initiative
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Initiatives List */}
              {initiatives.length === 0 ? (
                <div className="text-center py-12">
                  <RocketLaunchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active initiatives yet</p>
                  <p className="text-sm text-gray-400">Create the first initiative to get your community started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {initiatives.map((initiative, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getCategoryIcon(initiative.category)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{initiative.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{initiative.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(initiative.status)}`}>
                          {initiative.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{initiative.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{initiative.participantSessionIds.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Beneficiaries:</span>
                          <span className="font-medium">{initiative.impact.targetBeneficiaries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Completion:</span>
                          <span className="font-medium">
                            {new Date(initiative.timeline.targetCompletionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
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

          {/* Governance Tab */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Community Governance</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <CogIcon className="h-5 w-5" />
                  <h4 className="font-medium">Governance Model: {community.leadership.governanceModel}</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  This community operates under a {community.leadership.governanceModel} governance model, 
                  ensuring inclusive decision-making and cultural sensitivity.
                </p>
              </div>

              {governance && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Current Leadership</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Coordinators</h5>
                        {governance.currentLeadership.coordinators.length === 0 ? (
                          <p className="text-sm text-gray-500">No coordinators assigned</p>
                        ) : (
                          <div className="space-y-2">
                            {governance.currentLeadership.coordinators.map((coord: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium">{coord.role}</span>
                                <span className="text-xs text-gray-500">
                                  Term: {new Date(coord.termStart).getFullYear()} - {new Date(coord.termEnd).getFullYear()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Cultural Advisors</h5>
                        {governance.currentLeadership.culturalAdvisors.length === 0 ? (
                          <p className="text-sm text-gray-500">No cultural advisors assigned</p>
                        ) : (
                          <div className="space-y-2">
                            {governance.currentLeadership.culturalAdvisors.map((advisor: any, i: number) => (
                              <div key={i} className="p-2 bg-gray-50 rounded">
                                <div className="text-sm font-medium">Cultural Advisor</div>
                                <div className="text-xs text-gray-500">
                                  Expertise: {advisor.expertise.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Governance Structure</h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coordinator Term Length:</span>
                        <span className="font-medium">{governance.governanceStructure.coordinatorTermLength} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Decision Threshold:</span>
                        <span className="font-medium">{Math.round(governance.governanceStructure.decisionMakingThreshold * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Election Process:</span>
                        <p className="text-gray-900 mt-1">{governance.governanceStructure.electionProcess}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Conflict Resolution:</span>
                        <p className="text-gray-900 mt-1">{governance.governanceStructure.conflictResolutionProcess}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Community Events</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  <PlusIcon className="h-4 w-4" />
                  New Event
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming events scheduled</p>
                  <p className="text-sm text-gray-400">Events and cultural celebrations will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>📅 {event.date}</span>
                            <span>📍 {event.location}</span>
                            <span>👥 {event.attendees} attending</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                          Join Event
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cultural Calendar */}
              {community.culturalContext.importantDates.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Cultural Calendar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {community.culturalContext.importantDates.map((date, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{date.name}</h5>
                          <span className="text-sm text-gray-500 capitalize">{date.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{date.description}</p>
                        <p className="text-xs text-gray-500">{date.significance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Community Members</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{community.membershipStats.totalMembers}</div>
                  <div className="text-sm text-gray-600">Total Members</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{community.membershipStats.activeMembersLastMonth}</div>
                  <div className="text-sm text-gray-600">Active This Month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{community.membershipStats.newMembersThisMonth}</div>
                  <div className="text-sm text-gray-600">New This Month</div>
                </div>
              </div>

              <div className="text-center py-12 text-gray-500">
                <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Member directory coming soon</p>
                <p className="text-sm">Connect with other community members</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}