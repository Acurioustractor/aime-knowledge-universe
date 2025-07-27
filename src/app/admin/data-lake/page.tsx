'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TestResult {
  github: { status: string; itemCount: number; timing: string; error?: string };
  airtable: { status: string; itemCount: number; timing: string; error?: string };
  mailchimp: { status: string; itemCount: number; timing: string; error?: string };
}

interface TestResponse {
  success: boolean;
  message: string;
  timestamp: string;
  summary: TestResult;
  results: any;
}

export default function DataLakeAdminPage() {
  const [testResults, setTestResults] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDataLakeTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test/data-lake');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        success: false,
        message: 'Test failed to run',
        timestamp: new Date().toISOString(),
        summary: {
          github: { status: 'error', itemCount: 0, timing: '0ms', error: 'Failed to run test' },
          airtable: { status: 'error', itemCount: 0, timing: '0ms', error: 'Failed to run test' },
          mailchimp: { status: 'error', itemCount: 0, timing: '0ms', error: 'Failed to run test' }
        },
        results: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <Link href="/admin" className="text-blue-600 underline hover:text-blue-800">Admin</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Data Lake Testing</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">
            Data Lake Integration Testing
          </h1>
          <p className="text-gray-700 max-w-4xl">
            Test and monitor GitHub, Airtable, and Mailchimp API integrations.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">
          {/* Test Controls */}
          <div className="border border-gray-300 p-6 bg-gray-50 mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Run Integration Tests</h2>
            <button
              onClick={runDataLakeTest}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Running Tests...' : 'Test All Integrations'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="border border-gray-300 p-6 bg-white">
              <h2 className="text-lg font-bold text-black mb-4">Test Results</h2>
              
              {/* Summary */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Status:</span>
                  <span className={`px-2 py-1 rounded text-sm border ${testResults.success ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                    {testResults.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Message: {testResults.message}</div>
                  <div>Timestamp: {testResults.timestamp}</div>
                </div>
              </div>

              {/* Individual Integration Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* GitHub */}
                <div className="border border-gray-300 p-4">
                  <h3 className="font-bold text-black mb-2 flex items-center">
                    GitHub Integration
                    <span className={`ml-2 px-2 py-1 rounded text-xs border ${getStatusColor(testResults.summary.github.status)}`}>
                      {testResults.summary.github.status}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Items: {testResults.summary.github.itemCount}</div>
                    <div>Timing: {testResults.summary.github.timing}</div>
                    {testResults.summary.github.error && (
                      <div className="text-red-600">Error: {testResults.summary.github.error}</div>
                    )}
                  </div>
                </div>

                {/* Airtable */}
                <div className="border border-gray-300 p-4">
                  <h3 className="font-bold text-black mb-2 flex items-center">
                    Airtable Integration
                    <span className={`ml-2 px-2 py-1 rounded text-xs border ${getStatusColor(testResults.summary.airtable.status)}`}>
                      {testResults.summary.airtable.status}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Items: {testResults.summary.airtable.itemCount}</div>
                    <div>Timing: {testResults.summary.airtable.timing}</div>
                    {testResults.summary.airtable.error && (
                      <div className="text-red-600">Error: {testResults.summary.airtable.error}</div>
                    )}
                  </div>
                </div>

                {/* Mailchimp */}
                <div className="border border-gray-300 p-4">
                  <h3 className="font-bold text-black mb-2 flex items-center">
                    Mailchimp Integration
                    <span className={`ml-2 px-2 py-1 rounded text-xs border ${getStatusColor(testResults.summary.mailchimp.status)}`}>
                      {testResults.summary.mailchimp.status}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Items: {testResults.summary.mailchimp.itemCount}</div>
                    <div>Timing: {testResults.summary.mailchimp.timing}</div>
                    {testResults.summary.mailchimp.error && (
                      <div className="text-red-600">Error: {testResults.summary.mailchimp.error}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              {testResults.results && (
                <div className="mt-6">
                  <h3 className="font-bold text-black mb-2">Detailed Results</h3>
                  <div className="bg-gray-50 p-4 border border-gray-300 overflow-x-auto">
                    <pre className="text-xs text-gray-700">
                      {JSON.stringify(testResults.results, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}