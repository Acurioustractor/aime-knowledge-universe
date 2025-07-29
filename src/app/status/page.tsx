'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatusCheck {
  name: string;
  endpoint: string;
  status: 'checking' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function StatusPage() {
  const [checks, setChecks] = useState<StatusCheck[]>([
    { name: 'API Health', endpoint: '/api/health', status: 'checking' },
    { name: 'YouTube Integration', endpoint: '/api/integrations/youtube?limit=1', status: 'checking' },
    { name: 'Airtable Integration', endpoint: '/api/integrations/airtable?limit=1', status: 'checking' },
    { name: 'Mailchimp Integration', endpoint: '/api/integrations/mailchimp?limit=1', status: 'checking' },
    { name: 'Content API', endpoint: '/api/content/real?type=video&limit=1', status: 'checking' },
    { name: 'Data Lake', endpoint: '/api/data-lake/init', status: 'checking' },
    { name: 'Swagger Docs', endpoint: '/api/docs', status: 'checking' },
    { name: 'Redis Cache', endpoint: '/api/health', status: 'checking' },
    { name: 'PostgreSQL', endpoint: '/api/health', status: 'checking' },
  ]);

  useEffect(() => {
    checkAllEndpoints();
  }, []);

  const checkAllEndpoints = async () => {
    const updatedChecks = await Promise.all(
      checks.map(async (check) => {
        try {
          const response = await fetch(check.endpoint);
          const data = await response.json();
          
          if (response.ok && (data.success || data.status === 'healthy')) {
            return {
              ...check,
              status: 'success' as const,
              message: data.meta?.source || data.status || 'Working',
              data: data
            };
          } else {
            return {
              ...check,
              status: 'error' as const,
              message: data.error || 'Failed'
            };
          }
        } catch (error) {
          return {
            ...check,
            status: 'error' as const,
            message: error instanceof Error ? error.message : 'Connection failed'
          };
        }
      })
    );

    setChecks(updatedChecks);
  };

  const getStatusIcon = (status: StatusCheck['status']) => {
    switch (status) {
      case 'checking': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: StatusCheck['status']) => {
    switch (status) {
      case 'checking': return 'text-gray-500';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-black mb-8">System Status Dashboard</h1>
        
        <div className="mb-8 p-6 bg-blue-50 border border-blue-300 rounded">
          <h2 className="text-xl font-bold text-blue-900 mb-3">Original Vision Status</h2>
          <p className="text-blue-800 mb-4">
            Unified data lake pulling from YouTube, Airtable, Mailchimp, and more into a single knowledge base.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-blue-200">
              <strong>Data Sources:</strong> YouTube API, Airtable, Mailchimp, GitHub
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <strong>Processing:</strong> Redis Cache, PostgreSQL, Data Lake
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <strong>Features:</strong> JWT Auth, Zod Validation, Swagger Docs
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {checks.map((check) => (
            <div key={check.name} className="border border-gray-300 p-4 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(check.status)}</span>
                  <div>
                    <h3 className="font-bold text-black">{check.name}</h3>
                    <p className="text-sm text-gray-600">{check.endpoint}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                  {check.message}
                </div>
              </div>
              
              {check.status === 'success' && check.data && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(check.data, null, 2).slice(0, 200)}...
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-300 rounded">
          <h2 className="text-xl font-bold text-green-900 mb-3">Quick Access Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/content/videos" className="text-blue-600 underline hover:text-blue-800">
              📺 Videos Page (with filters)
            </Link>
            <Link href="/tools" className="text-blue-600 underline hover:text-blue-800">
              🛠️ Tools Page (categorized)
            </Link>
            <Link href="/search" className="text-blue-600 underline hover:text-blue-800">
              🔍 Search (semantic)
            </Link>
            <Link href="/admin" className="text-blue-600 underline hover:text-blue-800">
              👨‍💼 Admin Dashboard
            </Link>
            <Link href="/api/docs" className="text-blue-600 underline hover:text-blue-800">
              📚 API Documentation
            </Link>
            <Link href="/data-lake" className="text-blue-600 underline hover:text-blue-800">
              🌊 Data Lake Status
            </Link>
            <Link href="/status/navigation-test" className="text-blue-600 underline hover:text-blue-800">
              🧭 Navigation Test
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={checkAllEndpoints}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Status
          </button>
          <Link href="/" className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}