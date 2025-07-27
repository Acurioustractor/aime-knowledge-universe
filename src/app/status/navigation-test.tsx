'use client';

import Link from 'next/link';
import { useState } from 'react';

const criticalPages = [
  { path: '/', name: 'Homepage' },
  { path: '/discover', name: 'Discover' },
  { path: '/learn', name: 'Learn' },
  { path: '/understand', name: 'Understand' },
  { path: '/about', name: 'About' },
  { path: '/framing', name: 'Framing' },
  { path: '/hoodie-observatory', name: 'Hoodie Observatory' },
  { path: '/understanding', name: 'Understanding (Philosophy)' },
  { path: '/community/mentorship', name: 'Community Mentorship' },
  { path: '/community/regional', name: 'Regional Communities' },
  { path: '/community/learning-spaces', name: 'Learning Spaces' },
  { path: '/community/impact', name: 'Impact Measurement' },
  { path: '/business-cases', name: 'Business Cases' },
  { path: '/tools', name: 'Tools' },
  { path: '/content/videos', name: 'Videos' },
  { path: '/newsletters', name: 'Newsletters' }
];

const criticalAPIs = [
  { path: '/api/unified-search?q=test&limit=1', name: 'Unified Search' },
  { path: '/api/framing?type=overview&limit=5', name: 'Framing API' },
  { path: '/api/community/mentorship', name: 'Mentorship API' },
  { path: '/api/community/regional', name: 'Regional API' },
  { path: '/api/community/learning-spaces', name: 'Learning Spaces API' },
  { path: '/api/community/impact', name: 'Impact API' },
  { path: '/api/discovery', name: 'Discovery API' },
  { path: '/api/recommendations', name: 'Recommendations API' }
];

export default function NavigationTest() {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  const testPage = async (path: string) => {
    setTestResults(prev => ({ ...prev, [path]: 'pending' }));
    
    try {
      const response = await fetch(path);
      if (response.ok) {
        setTestResults(prev => ({ ...prev, [path]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [path]: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [path]: 'error' }));
    }
  };

  const testAllPages = async () => {
    for (const page of criticalPages) {
      await testPage(page.path);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
  };

  const testAllAPIs = async () => {
    for (const api of criticalAPIs) {
      await testPage(api.path);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light text-gray-900 mb-8">
          AIME Platform Navigation Test
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pages Test */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Critical Pages</h2>
              <button
                onClick={testAllPages}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test All Pages
              </button>
            </div>
            
            <div className="space-y-2">
              {criticalPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={getStatusColor(testResults[page.path] || 'untested')}>
                      {getStatusIcon(testResults[page.path] || 'untested')}
                    </span>
                    <Link href={page.path} className="text-blue-600 hover:text-blue-800">
                      {page.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => testPage(page.path)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* APIs Test */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Critical APIs</h2>
              <button
                onClick={testAllAPIs}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test All APIs
              </button>
            </div>
            
            <div className="space-y-2">
              {criticalAPIs.map((api) => (
                <div key={api.path} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={getStatusColor(testResults[api.path] || 'untested')}>
                      {getStatusIcon(testResults[api.path] || 'untested')}
                    </span>
                    <span className="text-gray-700">{api.name}</span>
                  </div>
                  <button
                    onClick={() => testPage(api.path)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick User Journey Tests</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/discover?q=hoodie economics"
              className="p-4 bg-white border border-gray-200 rounded hover:bg-gray-50"
            >
              <h4 className="font-medium text-gray-900">Search Test</h4>
              <p className="text-sm text-gray-600">Test homepage search → discover</p>
            </Link>
            
            <Link 
              href="/framing"
              className="p-4 bg-white border border-gray-200 rounded hover:bg-gray-50"
            >
              <h4 className="font-medium text-gray-900">Framing Test</h4>
              <p className="text-sm text-gray-600">Test document framing system</p>
            </Link>
            
            <Link 
              href="/community/mentorship"
              className="p-4 bg-white border border-gray-200 rounded hover:bg-gray-50"
            >
              <h4 className="font-medium text-gray-900">Community Test</h4>
              <p className="text-sm text-gray-600">Test community features</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}