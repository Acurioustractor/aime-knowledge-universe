/**
 * Community Impact Page
 * 
 * Main page for community impact tracking and celebration
 */

'use client';

import { useState } from 'react';
import ImpactDashboard from '@/components/community/ImpactDashboard';

export default function CommunityImpactPage() {
  const [sessionId] = useState(`demo_${Date.now()}`);
  const [scope] = useState<'personal' | 'community' | 'global'>('personal');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AIME Community Impact</h1>
              <p className="text-sm text-gray-600">Track growth, celebrate achievements, and share stories</p>
            </div>
            <div className="text-sm text-gray-500">
              Session: {sessionId.slice(0, 12)}...
            </div>
          </div>
        </div>
      </div>

      <ImpactDashboard sessionId={sessionId} scope={scope} />
    </div>
  );
}