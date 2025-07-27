/**
 * Learning Spaces Dashboard Component
 * 
 * Interface for managing collaborative learning spaces with AI-enhanced facilitation
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  CalendarIcon,
  PlusIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LearningSpacesDashboardProps {
  sessionId: string;
}

interface LearningSpace {
  id: string;
  title: string;
  description: string;
  type: string;
  facilitatorSessionId: string;
  participantCount: number;
  maxParticipants: number;
  status: string;
  schedule: {
    meetingFrequency: string;
    duration: number;
    timezone: string;
  };
  learningObjectives: string[];
}

export default function LearningSpacesDashboard({ sessionId }: LearningSpacesDashboardProps) {
  const [spaces, setSpaces] = useState<LearningSpace[]>([]);
  const [userSpaces, setUserSpaces] = useState<LearningSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my_spaces' | 'create'>('browse');
  
  // Create space form state
  const [newSpace, setNewSpace] = useState({
    title: '',
    description: '',
    type: 'philosophy_circle' as const,
    maxParticipants: 8,
    learningObjectives: [''],
    schedule: {
      meetingFrequency: 'weekly' as const,
      duration: 90,
      timezone: 'UTC'
    }
  });

  useEffect(() => {
    loadLearningSpaces();
  }, [sessionId]);

  const loadLearningSpaces = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/learning-spaces?action=spaces&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success) {
        setSpaces(result.data.availableSpaces);
        setUserSpaces(result.data.userSpaces);
      } else {
        setError(result.error || 'Failed to load learning spaces');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Learning spaces load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const joinSpace = async (spaceId: string) => {
    try {
      const response = await fetch('/api/community/learning-spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join_space',
          sessionId,
          spaceId,
          motivation: 'Interested in collaborative learning'
        })
      });

      const result = await response.json();
      if (result.success) {
        loadLearningSpaces(); // Reload to update lists
      } else {
        setError(result.error || 'Failed to join space');
      }
    } catch (err) {
      setError('Failed to join learning space');
      console.error('Join space error:', err);
    }
  };

  const createSpace = async () => {
    if (!newSpace.title.trim() || !newSpace.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/community/learning-spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_space',
          sessionId,
          spaceData: {
            ...newSpace,
            learningObjectives: newSpace.learningObjectives.filter(obj => obj.trim())
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setActiveTab('my_spaces');
        setNewSpace({
          title: '',
          description: '',
          type: 'philosophy_circle',
          maxParticipants: 8,
          learningObjectives: [''],
          schedule: {
            meetingFrequency: 'weekly',
            duration: 90,
            timezone: 'UTC'
          }
        });
        loadLearningSpaces();
      } else {
        setError(result.error || 'Failed to create space');
      }
    } catch (err) {
      setError('Failed to create learning space');
      console.error('Create space error:', err);
    }
  };

  const getSpaceTypeIcon = (type: string) => {
    const icons = {
      philosophy_circle: '🤔',
      implementation_lab: '🔬',
      story_sharing: '📖',
      knowledge_creation: '💡',
      peer_support: '🤝'
    };
    return icons[type as keyof typeof icons] || '🏛️';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      forming: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning spaces...</p>
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
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Spaces</h1>
            <p className="text-gray-600">Collaborative spaces for philosophy, implementation, and story sharing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{userSpaces.length}</div>
            <div className="text-sm text-gray-600">My Spaces</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{spaces.length}</div>
            <div className="text-sm text-gray-600">Available Spaces</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {spaces.filter(s => s.type === 'philosophy_circle').length}
            </div>
            <div className="text-sm text-gray-600">Philosophy Circles</div>
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
              { id: 'browse', label: 'Browse Spaces', icon: AcademicCapIcon },
              { id: 'my_spaces', label: 'My Spaces', icon: UsersIcon },
              { id: 'create', label: 'Create Space', icon: PlusIcon }
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
          {/* Browse Spaces Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Learning Spaces</h3>
              
              {spaces.length === 0 ? (
                <div className="text-center py-12">
                  <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No learning spaces available</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Create the First Space
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {spaces.map((space, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getSpaceTypeIcon(space.type)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{space.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{space.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(space.status)}`}>
                          {space.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{space.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-medium">{space.participantCount}/{space.maxParticipants}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium capitalize">{space.schedule.meetingFrequency}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{space.schedule.duration} minutes</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          {space.learningObjectives.slice(0, 3).map((objective, i) => (
                            <li key={i}>{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <SparklesIcon className="h-4 w-4" />
                          <span>AI-Enhanced</span>
                        </div>
                        <button
                          onClick={() => joinSpace(space.id)}
                          disabled={space.participantCount >= space.maxParticipants}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {space.participantCount >= space.maxParticipants ? 'Full' : 'Join Space'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Spaces Tab */}
          {activeTab === 'my_spaces' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">My Learning Spaces</h3>
              
              {userSpaces.length === 0 ? (
                <div className="text-center py-12">
                  <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't joined any learning spaces yet</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Browse Available Spaces
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSpaces.map((space, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getSpaceTypeIcon(space.type)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{space.title}</h4>
                            <p className="text-sm text-gray-600">
                              {space.facilitatorSessionId === sessionId ? 'Facilitating' : 'Participating'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(space.status)}`}>
                            {space.status}
                          </span>
                          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                            Enter Space →
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>Next: Today 2:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400" />
                          <span>5 recent messages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LightBulbIcon className="h-4 w-4 text-gray-400" />
                          <span>3 insights captured</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Space Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Learning Space</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Space Title *
                  </label>
                  <input
                    type="text"
                    value={newSpace.title}
                    onChange={(e) => setNewSpace(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., AIME Philosophy Deep Dive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newSpace.description}
                    onChange={(e) => setNewSpace(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe the purpose and focus of this learning space..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Space Type
                    </label>
                    <select
                      value={newSpace.type}
                      onChange={(e) => setNewSpace(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="philosophy_circle">Philosophy Circle</option>
                      <option value="implementation_lab">Implementation Lab</option>
                      <option value="story_sharing">Story Sharing</option>
                      <option value="knowledge_creation">Knowledge Creation</option>
                      <option value="peer_support">Peer Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={newSpace.maxParticipants}
                      onChange={(e) => setNewSpace(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Frequency
                    </label>
                    <select
                      value={newSpace.schedule.meetingFrequency}
                      onChange={(e) => setNewSpace(prev => ({ 
                        ...prev, 
                        schedule: { ...prev.schedule, meetingFrequency: e.target.value as any }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives
                  </label>
                  {newSpace.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => {
                          const newObjectives = [...newSpace.learningObjectives];
                          newObjectives[index] = e.target.value;
                          setNewSpace(prev => ({ ...prev, learningObjectives: newObjectives }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Understand systems thinking principles"
                      />
                      {newSpace.learningObjectives.length > 1 && (
                        <button
                          onClick={() => {
                            const newObjectives = newSpace.learningObjectives.filter((_, i) => i !== index);
                            setNewSpace(prev => ({ ...prev, learningObjectives: newObjectives }));
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setNewSpace(prev => ({ 
                      ...prev, 
                      learningObjectives: [...prev.learningObjectives, ''] 
                    }))}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add objective
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createSpace}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Create Learning Space
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}