/**
 * Mentorship Dashboard Component
 * 
 * Interface for managing mentor-mentee relationships, finding mentors, and tracking progress
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { MentorshipRelationship } from '@/lib/database/enhanced-supabase';

interface MentorshipDashboardProps {
  sessionId: string;
  userRole?: 'mentor' | 'mentee' | 'both';
}

interface MentorshipWithDetails extends MentorshipRelationship {
  otherUser: {
    sessionId: string;
    userSession: any;
    communityProfile: any;
  } | null;
  userRole: 'mentor' | 'mentee';
}

interface MentorCandidate {
  sessionId: string;
  userSession: any;
  communityProfile: any;
  expertiseMatch: number;
  availabilityMatch: number;
  culturalFit: number;
  mentorshipCapacity: number;
  overallScore: number;
  reasoning: string[];
  sharedExperiences: string[];
  complementarySkills: string[];
  explanation: string;
}

export default function MentorshipDashboard({ sessionId }: MentorshipDashboardProps) {
  const [relationships, setRelationships] = useState<MentorshipWithDetails[]>([]);
  const [relationshipStats, setRelationshipStats] = useState<any>(null);
  const [mentorCandidates, setMentorCandidates] = useState<MentorCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingMentors, setSearchingMentors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'relationships' | 'find_mentors' | 'mentor_profile'>('relationships');
  
  // Find mentors form state
  const [mentorSearch, setMentorSearch] = useState({
    expertiseDomains: [''],
    learningGoals: [''],
    meetingFrequency: 'biweekly' as 'weekly' | 'biweekly' | 'monthly',
    expectedDurationMonths: 6,
    geographicPreference: 'global' as 'local' | 'regional' | 'global'
  });

  useEffect(() => {
    loadRelationships();
  }, [sessionId]);

  const loadRelationships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/mentorship?sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success) {
        setRelationships(result.data.relationships);
        setRelationshipStats(result.data.relationshipStats);
      } else {
        setError(result.error || 'Failed to load relationships');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Relationships load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchMentors = async () => {
    const expertiseDomains = mentorSearch.expertiseDomains.filter(d => d.trim());
    const learningGoals = mentorSearch.learningGoals.filter(g => g.trim());
    
    if (expertiseDomains.length === 0 || learningGoals.length === 0) {
      setError('Please specify at least one expertise domain and learning goal');
      return;
    }

    try {
      setSearchingMentors(true);
      setError(null);
      
      const params = new URLSearchParams({
        sessionId,
        action: 'find_mentors',
        expertiseDomains: expertiseDomains.join(','),
        learningGoals: learningGoals.join(','),
        meetingFrequency: mentorSearch.meetingFrequency,
        expectedDurationMonths: mentorSearch.expectedDurationMonths.toString(),
        geographicPreference: mentorSearch.geographicPreference
      });

      const response = await fetch(`/api/community/mentorship?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setMentorCandidates(result.data.mentorCandidates);
      } else {
        setError(result.error || 'Failed to find mentors');
      }
    } catch (err) {
      setError('Failed to search for mentors');
      console.error('Mentor search error:', err);
    } finally {
      setSearchingMentors(false);
    }
  };

  const requestMentorship = async (mentorSessionId: string) => {
    const expertiseDomains = mentorSearch.expertiseDomains.filter(d => d.trim());
    const learningGoals = mentorSearch.learningGoals.filter(g => g.trim());
    
    try {
      const response = await fetch('/api/community/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          mentorSessionId,
          menteeSessionId: sessionId,
          expertiseDomains,
          learningGoals,
          meetingFrequency: mentorSearch.meetingFrequency,
          expectedDurationMonths: mentorSearch.expectedDurationMonths,
          message: `I'm interested in learning about ${expertiseDomains.join(', ')} and would appreciate your guidance.`
        })
      });

      const result = await response.json();
      if (result.success) {
        loadRelationships(); // Reload to show new relationship
        setActiveTab('relationships');
      } else {
        setError(result.error || 'Failed to request mentorship');
      }
    } catch (err) {
      setError('Failed to request mentorship');
      console.error('Mentorship request error:', err);
    }
  };

  const updateRelationship = async (relationshipId: string, action: string, updates?: any) => {
    try {
      const response = await fetch('/api/community/mentorship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationshipId,
          sessionId,
          action,
          updates
        })
      });

      const result = await response.json();
      if (result.success) {
        loadRelationships();
      } else {
        setError(result.error || 'Failed to update relationship');
      }
    } catch (err) {
      setError('Failed to update relationship');
      console.error('Relationship update error:', err);
    }
  };

  const updateMentorSearch = (field: string, value: any) => {
    setMentorSearch(prev => ({ ...prev, [field]: value }));
  };

  const addSearchField = (field: 'expertiseDomains' | 'learningGoals') => {
    setMentorSearch(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateSearchField = (field: 'expertiseDomains' | 'learningGoals', index: number, value: string) => {
    setMentorSearch(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeSearchField = (field: 'expertiseDomains' | 'learningGoals', index: number) => {
    setMentorSearch(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-gray-100 text-gray-800',
      ended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentorship dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Connect with mentors and mentees to accelerate learning and share wisdom in the AIME community.
        </p>

        {relationshipStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{relationshipStats.activeMentorships}</div>
              <div className="text-sm text-gray-600">Active Mentorships</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{relationshipStats.activeMenteeships}</div>
              <div className="text-sm text-gray-600">Active Menteeships</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{relationshipStats.completedRelationships}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{relationshipStats.totalWisdomCaptured}</div>
              <div className="text-sm text-gray-600">Wisdom Shared</div>
            </div>
          </div>
        )}
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
              { id: 'relationships', label: 'My Relationships', icon: HeartIcon },
              { id: 'find_mentors', label: 'Find Mentors', icon: MagnifyingGlassIcon },
              { id: 'mentor_profile', label: 'Mentor Profile', icon: AcademicCapIcon }
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
          {/* Relationships Tab */}
          {activeTab === 'relationships' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Mentorship Relationships</h3>
              
              {relationships.length === 0 ? (
                <div className="text-center py-12">
                  <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No mentorship relationships yet</p>
                  <button
                    onClick={() => setActiveTab('find_mentors')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Find a Mentor
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {relationships.map((relationship, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {relationship.otherUser?.userSession?.user_role?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {relationship.userRole === 'mentor' ? 'Mentoring' : 'Learning from'} {relationship.otherUser?.userSession?.user_role || 'Community Member'}
                            </h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {relationship.otherUser?.userSession?.experience_level} level • {getFrequencyLabel(relationship.meeting_frequency)} meetings
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(relationship.status)}`}>
                            {relationship.status.charAt(0).toUpperCase() + relationship.status.slice(1)}
                          </span>
                          
                          {relationship.status === 'pending' && relationship.userRole === 'mentor' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateRelationship(relationship.id, 'accept')}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateRelationship(relationship.id, 'decline')}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          
                          {relationship.status === 'active' && (
                            <button
                              onClick={() => updateRelationship(relationship.id, 'complete')}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Expertise Domains</h5>
                          <div className="flex flex-wrap gap-2">
                            {relationship.expertise_domains.map((domain, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                {domain.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Learning Goals</h5>
                          <div className="space-y-1">
                            {relationship.learning_goals.slice(0, 3).map((goal, i) => (
                              <p key={i} className="text-sm text-gray-600">• {goal}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {relationship.relationship_strength && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Relationship Strength</span>
                            <span className="text-sm text-gray-600">{Math.round(relationship.relationship_strength * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${relationship.relationship_strength * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {relationship.wisdom_captured && relationship.wisdom_captured.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Recent Wisdom Captured</h5>
                          <div className="space-y-2">
                            {relationship.wisdom_captured.slice(0, 2).map((wisdom, i) => (
                              <p key={i} className="text-sm text-gray-600 italic">"{wisdom}"</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Find Mentors Tab */}
          {activeTab === 'find_mentors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Find Your Perfect Mentor</h3>
              
              {/* Search Form */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise Domains *
                  </label>
                  {mentorSearch.expertiseDomains.map((domain, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => updateSearchField('expertiseDomains', index, e.target.value)}
                        placeholder="e.g., systems-thinking, educational-design"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {mentorSearch.expertiseDomains.length > 1 && (
                        <button
                          onClick={() => removeSearchField('expertiseDomains', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addSearchField('expertiseDomains')}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add another domain
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Goals *
                  </label>
                  {mentorSearch.learningGoals.map((goal, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateSearchField('learningGoals', index, e.target.value)}
                        placeholder="e.g., Implement AIME philosophy in my organization"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {mentorSearch.learningGoals.length > 1 && (
                        <button
                          onClick={() => removeSearchField('learningGoals', index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addSearchField('learningGoals')}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add another goal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Frequency
                    </label>
                    <select
                      value={mentorSearch.meetingFrequency}
                      onChange={(e) => updateMentorSearch('meetingFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Duration (months)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={mentorSearch.expectedDurationMonths}
                      onChange={(e) => updateMentorSearch('expectedDurationMonths', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Geographic Preference
                    </label>
                    <select
                      value={mentorSearch.geographicPreference}
                      onChange={(e) => updateMentorSearch('geographicPreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="global">Global</option>
                      <option value="regional">Regional</option>
                      <option value="local">Local</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={searchMentors}
                  disabled={searchingMentors}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {searchingMentors ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-4 w-4" />
                      Find Mentors
                    </>
                  )}
                </button>
              </div>

              {/* Mentor Candidates */}
              {mentorCandidates.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Found {mentorCandidates.length} Potential Mentors
                  </h4>
                  
                  <div className="space-y-4">
                    {mentorCandidates.map((candidate, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium">
                                {candidate.userSession.user_role?.charAt(0).toUpperCase() || 'M'}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {candidate.userSession.user_role || 'Community Member'}
                              </h5>
                              <p className="text-sm text-gray-600 capitalize">
                                {candidate.userSession.experience_level} level
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                  {Math.round(candidate.overallScore * 100)}% match
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => requestMentorship(candidate.sessionId)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                          >
                            Request Mentorship
                          </button>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600">{candidate.explanation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-gray-900 mb-2">Interests & Focus</h6>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {candidate.userSession.interests.slice(0, 4).map((interest: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {interest.replace('-', ' ')}
                                </span>
                              ))}
                            </div>
                            {candidate.userSession.current_focus_domain && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Current Focus:</span> {candidate.userSession.current_focus_domain.replace('-', ' ')}
                              </p>
                            )}
                          </div>

                          <div>
                            <h6 className="font-medium text-gray-900 mb-2">Match Scores</h6>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Expertise</span>
                                <span className="text-sm font-medium">{Math.round(candidate.expertiseMatch * 100)}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Availability</span>
                                <span className="text-sm font-medium">{Math.round(candidate.availabilityMatch * 100)}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Cultural Fit</span>
                                <span className="text-sm font-medium">{Math.round(candidate.culturalFit * 100)}%</span>
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
          )}

          {/* Mentor Profile Tab */}
          {activeTab === 'mentor_profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Mentor Profile</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <AcademicCapIcon className="h-5 w-5" />
                  <h4 className="font-medium">Become a Mentor</h4>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  Share your knowledge and experience with others in the AIME community. 
                  Mentoring helps accelerate learning and creates lasting impact.
                </p>
                <p className="text-blue-600 text-sm">
                  Your mentor profile is automatically created based on your community profile. 
                  Update your interests, expertise, and availability in your community profile to attract the right mentees.
                </p>
              </div>

              {relationshipStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium text-gray-900">Active Mentees</h4>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {relationshipStats.activeMentorships}
                    </div>
                    <p className="text-sm text-gray-600">Currently mentoring</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ChartBarIcon className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Avg. Relationship Strength</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Math.round(relationshipStats.averageRelationshipStrength * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Mentorship effectiveness</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <StarIcon className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-gray-900">Wisdom Shared</h4>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {relationshipStats.totalWisdomCaptured}
                    </div>
                    <p className="text-sm text-gray-600">Insights captured</p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Mentorship Guidelines</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Set clear expectations and goals with your mentees at the beginning</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Maintain regular communication and scheduled meetings</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Focus on practical application of AIME philosophy and principles</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Capture and share wisdom gained through the mentorship process</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Provide constructive feedback and celebrate progress</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}