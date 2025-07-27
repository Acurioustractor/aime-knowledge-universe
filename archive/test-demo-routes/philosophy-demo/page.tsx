/**
 * Philosophy-First Content Architecture Demo
 * 
 * Demonstrates the complete philosophy-first content system with progressive disclosure,
 * contextual tooltips, and structured learning pathways
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  LightBulbIcon,
  BookOpenIcon,
  SparklesIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import PhilosophyContentViewer from '@/components/philosophy/PhilosophyContentViewer';

export default function PhilosophyDemoPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [engagementData, setEngagementData] = useState<any[]>([]);

  useEffect(() => {
    // Generate session ID
    setSessionId(`demo-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    console.log('Domain changed to:', domainId);
  };

  const handleEngagement = (data: any) => {
    setEngagementData(prev => [...prev, { ...data, timestamp: Date.now() }]);
    console.log('Engagement tracked:', data);
  };

  const resetDemo = () => {
    setSessionId(`demo-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    setEngagementData([]);
    setSelectedDomain('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Philosophy-First Content Architecture</h1>
                <p className="text-sm text-gray-600">AIME Knowledge Platform Demo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* User Level Selector */}
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <select
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Demo Introduction */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <LightBulbIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Philosophy-First Learning Experience
                  </h2>
                  <p className="text-gray-600 mb-4">
                    This demo showcases AIME's philosophy-first approach to content architecture. 
                    Content is structured around core philosophical domains with progressive disclosure, 
                    contextual explanations, and adaptive learning pathways.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpenIcon className="h-4 w-4 text-green-600" />
                      <span>Progressive Disclosure</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <SparklesIcon className="h-4 w-4 text-purple-600" />
                      <span>Contextual Tooltips</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 text-blue-600" />
                      <span>Philosophy Integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy Content Viewer */}
            {sessionId && (
              <PhilosophyContentViewer
                sessionId={sessionId}
                userLevel={userLevel}
                onDomainChange={handleDomainChange}
                onEngagement={handleEngagement}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Session Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Demo Session</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User Level:</span>
                  <span className="font-medium capitalize">{userLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-mono text-xs">{sessionId.slice(-8)}</span>
                </div>
                {selectedDomain && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Domain:</span>
                    <span className="font-medium text-xs">{selectedDomain}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Progressive Disclosure</h4>
                    <p className="text-xs text-gray-600">Content revealed based on understanding and prerequisites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Contextual Tooltips</h4>
                    <p className="text-xs text-gray-600">Hover over concepts for philosophy-grounded explanations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Adaptive Pathways</h4>
                    <p className="text-xs text-gray-600">Learning paths adjust to user level and progress</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Philosophy Integration</h4>
                    <p className="text-xs text-gray-600">All content grounded in AIME's core philosophy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Tracking */}
            {engagementData.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Engagement</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {engagementData.slice(-10).reverse().map((engagement, index) => (
                    <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-900">{engagement.type}</span>
                        <span className="text-gray-500">
                          {new Date(engagement.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {engagement.concept && (
                        <div className="text-gray-600">
                          Concept: <span className="font-medium">{engagement.concept}</span>
                        </div>
                      )}
                      {engagement.action && (
                        <div className="text-gray-600">
                          Action: <span className="font-medium">{engagement.action}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Explore</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>1. Select a philosophy domain to explore</p>
                <p>2. Choose between Overview, Progressive, or Primer views</p>
                <p>3. Hover over highlighted concepts for explanations</p>
                <p>4. Try different user levels to see adaptive content</p>
                <p>5. Watch the engagement tracking in the sidebar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}