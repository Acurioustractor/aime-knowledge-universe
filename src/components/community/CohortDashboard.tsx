/**
 * Cohort Dashboard Component
 * 
 * Collaborative tools for cohort members including shared resources, progress tracking, and discussions
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  ImplementationCohort, 
  CohortMembership, 
  CohortResource, 
  CohortMilestone 
} from '@/lib/database/enhanced-supabase';

interface CohortDashboardProps {
  cohortId: string;
  sessionId: string;
  userRole?: 'member' | 'facilitator' | 'mentor';
}

interface CohortWithMembers extends ImplementationCohort {
  members: Array<CohortMembership & { userSession: any }>;
  memberCount: number;
}

export default function CohortDashboard({ cohortId, sessionId, userRole = 'member' }: CohortDashboardProps) {
  const [cohort, setCohort] = useState<CohortWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'progress' | 'discussions' | 'members'>('overview');
  const [newResource, setNewResource] = useState({ title: '', type: 'content', url: '', description: '' });
  const [showAddResource, setShowAddResource] = useState(false);

  useEffect(() => {
    loadCohortData();
  }, [cohortId]);

  const loadCohortData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/cohorts?memberSessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success) {
        const targetCohort = result.data.cohorts.find((c: any) => c.id === cohortId);
        if (targetCohort) {
          setCohort(targetCohort);
        } else {
          setError('Cohort not found');
        }
      } else {
        setError(result.error || 'Failed to load cohort');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Cohort load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCohort = async () => {
    try {
      const response = await fetch('/api/community/cohorts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          cohortId,
          sessionId,
          role: 'member'
        })
      });

      const result = await response.json();
      if (result.success) {
        loadCohortData(); // Reload to show updated membership
      } else {
        setError(result.error || 'Failed to join cohort');
      }
    } catch (err) {
      setError('Failed to join cohort');
      console.error('Join cohort error:', err);
    }
  };

  const handleAdvancePhase = async () => {
    if (userRole !== 'facilitator') return;

    try {
      const response = await fetch('/api/community/cohorts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance_phase',
          cohortId,
          sessionId
        })
      });

      const result = await response.json();
      if (result.success) {
        loadCohortData();
      } else {
        setError(result.error || 'Failed to advance phase');
      }
    } catch (err) {
      setError('Failed to advance phase');
      console.error('Advance phase error:', err);
    }
  };

  const addResource = async () => {
    if (!newResource.title.trim()) return;

    try {
      const updatedResources = [
        ...cohort!.shared_resources,
        {
          id: Date.now().toString(),
          ...newResource,
          added_by: sessionId,
          added_date: new Date().toISOString()
        }
      ];

      const response = await fetch('/api/community/cohorts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          cohortId,
          sessionId,
          updates: { shared_resources: updatedResources }
        })
      });

      const result = await response.json();
      if (result.success) {
        setNewResource({ title: '', type: 'content', url: '', description: '' });
        setShowAddResource(false);
        loadCohortData();
      } else {
        setError(result.error || 'Failed to add resource');
      }
    } catch (err) {
      setError('Failed to add resource');
      console.error('Add resource error:', err);
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      formation: 'bg-yellow-100 text-yellow-800',
      orientation: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completion: 'bg-purple-100 text-purple-800',
      alumni: 'bg-gray-100 text-gray-800'
    };
    return colors[phase as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      forming: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      disbanded: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohort dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Cohort not found</p>
      </div>
    );
  }

  const isUserMember = cohort.members.some(member => 
    member.member_session_id === sessionId && member.status === 'active'
  );

  const completedMilestones = cohort.milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = cohort.milestones.length > 0 
    ? (completedMilestones / cohort.milestones.length) * 100 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Cohort Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{cohort.name}</h1>
            <p className="text-gray-600 mb-4">{cohort.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full font-medium ${getPhaseColor(cohort.current_phase)}`}>
                {cohort.current_phase.charAt(0).toUpperCase() + cohort.current_phase.slice(1)} Phase
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(cohort.status)}`}>
                {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
              </span>
              <span className="text-gray-500">
                <UsersIcon className="h-4 w-4 inline mr-1" />
                {cohort.memberCount} / {cohort.max_members} members
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isUserMember && cohort.status === 'forming' && (
              <button
                onClick={handleJoinCohort}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Join Cohort
              </button>
            )}
            
            {userRole === 'facilitator' && cohort.current_phase !== 'alumni' && (
              <button
                onClick={handleAdvancePhase}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Advance Phase
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{cohort.memberCount}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedMilestones}</div>
            <div className="text-sm text-gray-600">Milestones Complete</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{cohort.shared_resources.length}</div>
            <div className="text-sm text-gray-600">Shared Resources</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{cohort.expected_duration_weeks}</div>
            <div className="text-sm text-gray-600">Week Duration</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'resources', label: 'Resources', icon: BookOpenIcon },
              { id: 'progress', label: 'Progress', icon: CheckCircleIcon },
              { id: 'discussions', label: 'Discussions', icon: ChatBubbleLeftRightIcon },
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Goal</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{cohort.implementation_goal}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Philosophy Domain</h3>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {cohort.philosophy_domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting Schedule</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="capitalize">{cohort.meeting_schedule.frequency}</span>
                  {cohort.meeting_schedule.duration_minutes && (
                    <>
                      <span>•</span>
                      <ClockIcon className="h-4 w-4" />
                      <span>{cohort.meeting_schedule.duration_minutes} minutes</span>
                    </>
                  )}
                </div>
              </div>

              {cohort.start_date && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="text-gray-700">
                    <p>Started: {new Date(cohort.start_date).toLocaleDateString()}</p>
                    <p>Duration: {cohort.expected_duration_weeks} weeks</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Shared Resources</h3>
                {isUserMember && (
                  <button
                    onClick={() => setShowAddResource(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Resource
                  </button>
                )}
              </div>

              {showAddResource && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Resource title"
                      value={newResource.title}
                      onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={newResource.type}
                      onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="content">Content</option>
                      <option value="tool">Tool</option>
                      <option value="template">Template</option>
                      <option value="external_link">External Link</option>
                    </select>
                  </div>
                  <input
                    type="url"
                    placeholder="URL (optional)"
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    placeholder="Description"
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addResource}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add Resource
                    </button>
                    <button
                      onClick={() => setShowAddResource(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {cohort.shared_resources.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No resources shared yet</p>
                ) : (
                  cohort.shared_resources.map((resource, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <DocumentIcon className="h-4 w-4 text-gray-500" />
                            <h4 className="font-medium text-gray-900">{resource.title}</h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {resource.type}
                            </span>
                          </div>
                          {resource.description && (
                            <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            Added {new Date(resource.added_date).toLocaleDateString()}
                          </div>
                        </div>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                          >
                            Open <ArrowRightIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
              
              <div className="space-y-3">
                {cohort.milestones.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No milestones defined yet</p>
                ) : (
                  cohort.milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                          milestone.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : milestone.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {milestone.status === 'completed' ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{milestone.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Target: {new Date(milestone.target_date).toLocaleDateString()}</span>
                            {milestone.completion_date && (
                              <span>Completed: {new Date(milestone.completion_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          
                          {milestone.completion_criteria && milestone.completion_criteria.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 mb-1">Completion Criteria:</div>
                              <ul className="text-xs text-gray-500 list-disc list-inside">
                                {milestone.completion_criteria.map((criteria, i) => (
                                  <li key={i}>{criteria}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Cohort Discussions</h3>
              <div className="text-center py-8 text-gray-500">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Discussion features coming soon!</p>
                <p className="text-sm">Connect with your cohort members through structured conversations.</p>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Cohort Members</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cohort.members.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {member.userSession?.interests?.[0]?.charAt(0).toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.userSession?.user_role || 'Member'}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{member.role}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 capitalize">{member.userSession?.experience_level}</span>
                      </div>
                      
                      {member.userSession?.interests && member.userSession.interests.length > 0 && (
                        <div>
                          <span className="text-gray-600">Interests:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {member.userSession.interests.slice(0, 3).map((interest: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Participation:</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round((member.participation_score || 0) * 5)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}