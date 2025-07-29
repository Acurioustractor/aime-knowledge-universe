'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AggregationJob, Phase2ReadinessReport, ContentSource } from '@/lib/aggregation/content-pipeline';

export default function AggregationDashboard() {
  const [job, setJob] = useState<AggregationJob | null>(null);
  const [readinessReport, setReadinessReport] = useState<Phase2ReadinessReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/aggregation');
      const data = await response.json();
      
      if (data.success) {
        setJob(data.status);
        setReadinessReport(data.readinessReport);
        setIsRunning(data.status?.status === 'running');
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAggregation = async () => {
    try {
      setIsRunning(true);
      const response = await fetch('/api/aggregation', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        console.log(`Started aggregation job: ${data.jobId}`);
        fetchStatus(); // Immediately fetch updated status
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to start aggregation:', error);
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Loading Aggregation Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-wiki py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AIME Knowledge Center Aggregation</h1>
              <p className="text-gray-600">Content pipeline for building comprehensive knowledge center</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Wiki
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wiki py-8">
        {/* Pipeline Control */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pipeline Control</h2>
            <button
              onClick={startAggregation}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-medium ${
                isRunning 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? '🔄 Running...' : '🚀 Start Aggregation'}
            </button>
          </div>

          {job && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${getStatusColor(job.status)}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Phase:</span>
                <span className="font-medium">{job.progress.phase}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{job.progress.current.toLocaleString()} / {job.progress.total.toLocaleString()} items</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(job.progress.current / job.progress.total) * 100}%` }}
                ></div>
              </div>

              {job.startTime && (
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Started: {new Date(job.startTime).toLocaleString()}</span>
                  {job.endTime && (
                    <span>Completed: {new Date(job.endTime).toLocaleString()}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phase 1 Completion Status */}
        {readinessReport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Phase 1 Status
                {readinessReport.phase1Complete && <span className="ml-2 text-green-600">✅ Complete</span>}
                {!readinessReport.phase1Complete && <span className="ml-2 text-yellow-600">⏳ In Progress</span>}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Content Items:</span>
                  <span className="font-medium">
                    {readinessReport.contentStats.totalItems.toLocaleString()} / {readinessReport.contentStats.targetItems.toLocaleString()}
                    ({readinessReport.contentStats.completionPercentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Quality Score:</span>
                  <span className={`font-medium ${
                    readinessReport.contentStats.qualityScore >= 85 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {readinessReport.contentStats.qualityScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Knowledge Connections:</span>
                  <span className="font-medium">{readinessReport.knowledgeGraph.connectionsFound.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Categories Identified:</span>
                  <span className="font-medium">{readinessReport.knowledgeGraph.categoriesIdentified}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Network Density:</span>
                  <span className="font-medium">{(readinessReport.knowledgeGraph.networkDensity * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Data Sources</h3>
              
              <div className="space-y-3">
                {readinessReport.sourceStatus.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium capitalize">{source.source.replace('-', ' ')}</div>
                      <div className="text-sm text-gray-500">{source.itemsProcessed.toLocaleString()} items</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(source.status)}`}>
                        {source.status}
                      </div>
                      <div className="text-sm text-gray-500">
                        {source.completionRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 Readiness */}
        {readinessReport && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Phase 2 Readiness
              {readinessReport.readyForPhase2 && <span className="ml-2 text-green-600">🎯 Ready</span>}
              {!readinessReport.readyForPhase2 && <span className="ml-2 text-blue-600">🔄 Preparing</span>}
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Next Steps:</h4>
                <ul className="space-y-1">
                  {readinessReport.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">{readinessReport.readyForPhase2 ? '🚀' : '⏳'}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {readinessReport.readyForPhase2 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">🎉 Phase 1 Complete!</h4>
                  <p className="text-green-700 mb-3">
                    All criteria met. The knowledge center now contains {readinessReport.contentStats.totalItems.toLocaleString()} items 
                    with {readinessReport.knowledgeGraph.connectionsFound.toLocaleString()} connections across 
                    {readinessReport.knowledgeGraph.categoriesIdentified} categories.
                  </p>
                  <div className="font-medium text-green-800">
                    Ready to proceed to Phase 2: AI-powered knowledge processing and semantic search.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Handling */}
        {job?.errors && job.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Issues & Errors</h3>
            <div className="space-y-2">
              {job.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-800">{error.source}</span>
                    <span className="text-xs text-red-600">{error.type}</span>
                  </div>
                  <div className="text-sm text-red-700 mt-1">{error.message}</div>
                  <div className="text-xs text-red-500 mt-1">{new Date(error.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}