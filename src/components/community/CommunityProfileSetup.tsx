/**
 * Community Profile Setup Component
 * 
 * Allows users to configure their community preferences, privacy settings, and connection preferences
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { CommunityUserProfile, TimeWindow, LocationInfo } from '@/lib/database/enhanced-supabase';

interface CommunityProfileSetupProps {
  sessionId: string;
  initialProfile?: CommunityUserProfile;
  onProfileUpdated?: (profile: CommunityUserProfile) => void;
  onClose?: () => void;
}

export default function CommunityProfileSetup({ 
  sessionId, 
  initialProfile, 
  onProfileUpdated, 
  onClose 
}: CommunityProfileSetupProps) {
  const [profile, setProfile] = useState<Partial<CommunityUserProfile>>({
    geographic_scope: 'global',
    relationship_types: ['peer'],
    communication_style: 'mixed',
    availability_windows: [],
    cultural_considerations: [],
    location_info: {},
    profile_visibility: 'community',
    show_location: false,
    show_contact_info: false,
    allow_direct_messages: true,
    ...initialProfile
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...profile
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        onProfileUpdated?.(result.data.profile);
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Profile save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<CommunityUserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addAvailabilityWindow = () => {
    const newWindow: TimeWindow = {
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '17:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    updateProfile({
      availability_windows: [...(profile.availability_windows || []), newWindow]
    });
  };

  const updateAvailabilityWindow = (index: number, updates: Partial<TimeWindow>) => {
    const windows = [...(profile.availability_windows || [])];
    windows[index] = { ...windows[index], ...updates };
    updateProfile({ availability_windows: windows });
  };

  const removeAvailabilityWindow = (index: number) => {
    const windows = [...(profile.availability_windows || [])];
    windows.splice(index, 1);
    updateProfile({ availability_windows: windows });
  };

  const addCulturalConsideration = (consideration: string) => {
    if (consideration.trim() && !profile.cultural_considerations?.includes(consideration.trim())) {
      updateProfile({
        cultural_considerations: [...(profile.cultural_considerations || []), consideration.trim()]
      });
    }
  };

  const removeCulturalConsideration = (consideration: string) => {
    updateProfile({
      cultural_considerations: profile.cultural_considerations?.filter(c => c !== consideration) || []
    });
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Updated!</h2>
          <p className="text-gray-600">
            Your community profile has been saved successfully. You're now ready to connect with others in the AIME community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Profile Setup</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Set up your community profile to connect with others who share your interests and goals in the AIME ecosystem.
        </p>

        {/* Progress indicator */}
        <div className="flex items-center space-x-4 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  i + 1 < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Step 1: Connection Preferences */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <HeartIcon className="h-5 w-5" />
            Connection Preferences
          </h2>

          {/* Geographic Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <GlobeAltIcon className="h-4 w-4 inline mr-2" />
              Geographic Scope
            </label>
            <div className="space-y-2">
              {[
                { value: 'local', label: 'Local', description: 'Connect with people in my city/area' },
                { value: 'regional', label: 'Regional', description: 'Connect with people in my region/country' },
                { value: 'global', label: 'Global', description: 'Connect with people worldwide' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="geographic_scope"
                    value={option.value}
                    checked={profile.geographic_scope === option.value}
                    onChange={(e) => updateProfile({ geographic_scope: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Relationship Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <UserIcon className="h-4 w-4 inline mr-2" />
              Relationship Types (select all that interest you)
            </label>
            <div className="space-y-2">
              {[
                { value: 'peer', label: 'Peer Connections', description: 'Connect with others at similar experience levels' },
                { value: 'mentor', label: 'Find Mentors', description: 'Connect with experienced practitioners who can guide me' },
                { value: 'mentee', label: 'Mentor Others', description: 'Share my experience with those starting their journey' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={profile.relationship_types?.includes(option.value as any) || false}
                    onChange={(e) => {
                      const types = profile.relationship_types || [];
                      if (e.target.checked) {
                        updateProfile({ relationship_types: [...types, option.value as any] });
                      } else {
                        updateProfile({ relationship_types: types.filter(t => t !== option.value) });
                      }
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-2" />
              Communication Style
            </label>
            <div className="space-y-2">
              {[
                { value: 'structured', label: 'Structured', description: 'Prefer organized, agenda-based interactions' },
                { value: 'casual', label: 'Casual', description: 'Prefer informal, conversational interactions' },
                { value: 'mixed', label: 'Mixed', description: 'Comfortable with both structured and casual approaches' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="communication_style"
                    value={option.value}
                    checked={profile.communication_style === option.value}
                    onChange={(e) => updateProfile({ communication_style: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Availability */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Availability Windows
          </h2>

          <p className="text-gray-600">
            Add your general availability to help others know when you're typically free for connections and conversations.
          </p>

          <div className="space-y-4">
            {profile.availability_windows?.map((window, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Availability Window {index + 1}</h4>
                  <button
                    onClick={() => removeAvailabilityWindow(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select
                      value={window.day_of_week}
                      onChange={(e) => updateAvailabilityWindow(index, { day_of_week: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {dayNames.map((day, dayIndex) => (
                        <option key={dayIndex} value={dayIndex}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={window.start_time}
                      onChange={(e) => updateAvailabilityWindow(index, { start_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={window.end_time}
                      onChange={(e) => updateAvailabilityWindow(index, { end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <input
                      type="text"
                      value={window.timezone}
                      onChange={(e) => updateAvailabilityWindow(index, { timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., America/New_York"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addAvailabilityWindow}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add Availability Window
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location & Cultural Considerations */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Location & Cultural Considerations
          </h2>

          {/* Location Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Location Information</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={profile.location_info?.city || ''}
                  onChange={(e) => updateProfile({
                    location_info: { ...profile.location_info, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Sydney"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Region/State</label>
                <input
                  type="text"
                  value={profile.location_info?.region || ''}
                  onChange={(e) => updateProfile({
                    location_info: { ...profile.location_info, region: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., NSW"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  value={profile.location_info?.country || ''}
                  onChange={(e) => updateProfile({
                    location_info: { ...profile.location_info, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Australia"
                />
              </div>
            </div>
          </div>

          {/* Cultural Considerations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cultural Considerations
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Share any cultural considerations that would help others connect with you respectfully.
            </p>
            
            <div className="space-y-2">
              {profile.cultural_considerations?.map((consideration, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-800">{consideration}</span>
                  <button
                    onClick={() => removeCulturalConsideration(consideration)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <input
                type="text"
                placeholder="Add a cultural consideration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCulturalConsideration(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Privacy Settings */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Privacy Settings
          </h2>

          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Visibility</label>
            <div className="space-y-2">
              {[
                { value: 'private', label: 'Private', description: 'Only I can see my profile' },
                { value: 'connections', label: 'Connections Only', description: 'Only my connections can see my profile' },
                { value: 'community', label: 'Community', description: 'All community members can see my profile' },
                { value: 'public', label: 'Public', description: 'Anyone can see my profile' }
              ].map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="profile_visibility"
                    value={option.value}
                    checked={profile.profile_visibility === option.value}
                    onChange={(e) => updateProfile({ profile_visibility: e.target.value as any })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Options */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={profile.show_location || false}
                onChange={(e) => updateProfile({ show_location: e.target.checked })}
              />
              <div>
                <div className="font-medium text-gray-900">Show Location</div>
                <div className="text-sm text-gray-600">Allow others to see your city/region</div>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={profile.show_contact_info || false}
                onChange={(e) => updateProfile({ show_contact_info: e.target.checked })}
              />
              <div>
                <div className="font-medium text-gray-900">Show Contact Information</div>
                <div className="text-sm text-gray-600">Allow others to see your contact details</div>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={profile.allow_direct_messages || false}
                onChange={(e) => updateProfile({ allow_direct_messages: e.target.checked })}
              />
              <div>
                <div className="font-medium text-gray-900">Allow Direct Messages</div>
                <div className="text-sm text-gray-600">Allow others to send you connection requests</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}