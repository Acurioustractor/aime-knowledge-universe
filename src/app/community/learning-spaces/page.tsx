/**
 * Learning Spaces Page
 * 
 * Main page for collaborative learning spaces
 */

'use client';

import { useState } from 'react';
import LearningSpacesDashboard from '@/components/community/LearningSpacesDashboard';

export default function LearningSpacesPage() {
  const [sessionId] = useState(`demo_${Date.now()}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AIME Learning Spaces</h1>
              <p className="text-sm text-gray-600">Collaborative learning with AI-enhanced facilitation</p>
            </div>
            <div className="text-sm text-gray-500">
              Session: {sessionId.slice(0, 12)}...
            </div>
          </div>
        </div>
      </div>

      <LearningSpacesDashboard sessionId={sessionId} />
    </div>
  );
}