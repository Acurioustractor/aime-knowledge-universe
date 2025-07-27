/**
 * Community Mentorship Page
 * 
 * Main page component that integrates mentorship functionality
 */

'use client';

import { useState, useEffect } from 'react';
import MentorshipDashboard from './MentorshipDashboard';
import { enhancedContentRepository } from '@/lib/database/enhanced-supabase';

interface CommunityMentorshipPageProps {
  sessionId?: string;
}

export default function CommunityMentorshipPage({ sessionId }: CommunityMentorshipPageProps) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [loading, setLoading] = useState(!sessionId);

  useEffect(() => {
    if (!sessionId) {
      // Generate or get session ID if not provided
      const generateSessionId = async () => {
        try {
          // In a real app, this would come from authentication
          const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Create a temporary user session for demo purposes
          await enhancedContentRepository.getOrCreateUserSession(tempSessionId);
          
          setCurrentSessionId(tempSessionId);
        } catch (error) {
          console.error('Error generating session:', error);
          setCurrentSessionId('demo_session');
        } finally {
          setLoading(false);
        }
      };

      generateSessionId();
    }
  }, [sessionId]);

  if (loading || !currentSessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing mentorship system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AIME Community Mentorship</h1>
              <p className="text-sm text-gray-600">Connect, learn, and grow together</p>
            </div>
            <div className="text-sm text-gray-500">
              Session: {currentSessionId.slice(0, 12)}...
            </div>
          </div>
        </div>
      </div>

      <MentorshipDashboard sessionId={currentSessionId} />
    </div>
  );
}