/**
 * Regional Community Page
 * 
 * Main page for regional community functionality
 */

'use client';

import { useState, useEffect } from 'react';
import RegionalCommunityDashboard from '@/components/community/RegionalCommunityDashboard';
import RegionalCommunitySetup from '@/components/community/RegionalCommunitySetup';

export default function RegionalCommunityPage() {
  const [sessionId] = useState(`demo_${Date.now()}`);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserCommunity();
  }, []);

  const checkUserCommunity = async () => {
    try {
      // Check if user has a community
      const response = await fetch(`/api/community/regional?action=membership&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data.primaryCommunity) {
        setCommunityId(result.data.primaryCommunity.regionalCommunityId);
      } else {
        setNeedsSetup(true);
      }
    } catch (err) {
      console.error('Error checking community:', err);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = (newCommunityId: string) => {
    setCommunityId(newCommunityId);
    setNeedsSetup(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading regional community...</p>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return <RegionalCommunitySetup sessionId={sessionId} onComplete={handleSetupComplete} />;
  }

  return <RegionalCommunityDashboard sessionId={sessionId} communityId={communityId || undefined} />;
}