/**
 * Regional Community Setup Component
 * 
 * Simple setup for users to join or create regional communities
 */

'use client';

import { useState } from 'react';
import { 
  MapPinIcon,
  GlobeAltIcon,
  UsersIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface RegionalCommunitySetupProps {
  sessionId: string;
  onComplete?: (communityId: string) => void;
}

export default function RegionalCommunitySetup({ sessionId, onComplete }: RegionalCommunitySetupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [locationData, setLocationData] = useState({
    country: '',
    region: '',
    city: '',
    preferredLanguages: ['English'],
    culturalAffiliations: [] as string[]
  });

  const [availableCommunities, setAvailableCommunities] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  const handleLocationSubmit = async () => {
    if (!locationData.country.trim()) {
      setError('Please enter your country');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get available communities
      const response = await fetch('/api/community/regional?action=communities');
      const result = await response.json();
      
      if (result.success) {
        setAvailableCommunities(result.data.communities);
        setStep(2);
      } else {
        setError(result.error || 'Failed to load communities');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunitySelection = async () => {
    if (!selectedCommunity) {
      setError('Please select a community or choose to create a new one');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (selectedCommunity === 'create_new') {
        // Assign to new community
        const response = await fetch('/api/community/regional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'assign',
            sessionId,
            locationPreferences: locationData
          })
        });

        const result = await response.json();
        if (result.success) {
          setStep(3);
          onComplete?.(result.data.assignedCommunity.id);
        } else {
          setError(result.error || 'Failed to create community');
        }
      } else {
        // Join existing community
        const response = await fetch('/api/community/regional', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join_community',
            sessionId,
            communityId: selectedCommunity
          })
        });

        const result = await response.json();
        if (result.success) {
          setStep(3);
          onComplete?.(selectedCommunity);
        } else {
          setError(result.error || 'Failed to join community');
        }
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GlobeAltIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Your Regional Community</h1>
          <p className="text-gray-600">Connect with AIME community members in your area</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step 1: Location Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tell us about your location</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={locationData.country}
                    onChange={(e) => setLocationData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Australia, United States, Canada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region/State
                  </label>
                  <input
                    type="text"
                    value={locationData.region}
                    onChange={(e) => setLocationData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., New South Wales, California, Ontario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationData.city}
                    onChange={(e) => setLocationData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Sydney, San Francisco, Toronto"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleLocationSubmit}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Find Communities'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Community Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose your community</h3>
              
              <div className="space-y-4">
                {/* Existing Communities */}
                {availableCommunities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Existing Communities</h4>
                    <div className="space-y-3">
                      {availableCommunities.map((community) => (
                        <label key={community.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="community"
                            value={community.id}
                            checked={selectedCommunity === community.id}
                            onChange={(e) => setSelectedCommunity(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPinIcon className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{community.name}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                community.status === 'thriving' ? 'bg-green-100 text-green-800' :
                                community.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {community.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <UsersIcon className="h-3 w-3" />
                                {community.membershipStats.totalMembers} members
                              </span>
                              <span>{community.region}, {community.country}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create New Community Option */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Or create a new community</h4>
                  <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="community"
                      value="create_new"
                      checked={selectedCommunity === 'create_new'}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PlusIcon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-gray-900">Create New Community</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Start a new AIME community in {locationData.region || locationData.country}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleCommunitySelection}
                disabled={loading || !selectedCommunity}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Join Community'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to your regional community!</h3>
              <p className="text-gray-600">
                You're now connected with AIME community members in your area. 
                Start exploring initiatives, events, and connections.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/community/regional'}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Go to Community Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}