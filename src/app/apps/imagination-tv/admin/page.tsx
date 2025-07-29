'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ImportStatus {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  youtubeVideos: number;
  airtableVideos: number;
  imaginationTvEpisodes: number;
  processingStatus: {
    withTranscription: number;
    withWisdomExtracts: number;
    pendingProcessing: number;
  };
}

interface QualityReport {
  totalEpisodes: number;
  overallQualityScore: number;
  qualityChecks: Record<string, { count: number; percentage: number }>;
  recommendations: string[];
}

export default function VideoAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [importProgress, setImportProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load import status
      const statusResponse = await fetch('/api/imagination-tv/import?action=status');
      const statusData = await statusResponse.json();
      if (statusData.success) {
        setImportStatus(statusData.data);
      }

      // Load quality report
      const qualityResponse = await fetch('/api/imagination-tv/import?action=quality-report');
      const qualityData = await qualityResponse.json();
      if (qualityData.success) {
        setQualityReport(qualityData.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runImport = async (action: string, source?: string, options: any = {}) => {
    if (!adminKey) {
      alert('Please enter admin key');
      return;
    }

    setImportProgress({ action, status: 'running', startTime: Date.now() });

    try {
      // Determine the correct API endpoint based on action
      let apiEndpoint = '/api/imagination-tv/import';
      if (action === 'import-real-bulk') {
        apiEndpoint = '/api/imagination-tv/import-bulk';
      } else if (action === 'import-airtable-episodes') {
        apiEndpoint = '/api/imagination-tv/import-airtable-episodes';
      } else if (action === 'import-real-channel') {
        apiEndpoint = '/api/imagination-tv/import-real';
      } else if (action === 'deduplicate') {
        apiEndpoint = '/api/imagination-tv/deduplicate';
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          source,
          adminKey,
          ...options
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setImportProgress({
          action,
          status: 'completed',
          results: data.data.results,
          duration: data.data.duration
        });
        
        // Reload dashboard data
        await loadDashboardData();
      } else {
        setImportProgress({
          action,
          status: 'failed',
          error: data.error
        });
      }
    } catch (error) {
      setImportProgress({
        action,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Import failed'
      });
    }
  };

  const generateConnections = async () => {
    if (!adminKey) {
      alert('Please enter admin key');
      return;
    }

    try {
      const response = await fetch('/api/imagination-tv/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'generate-all',
          adminKey: 'aime-connections-2024' // Different key for connections
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Generated ${data.data.totalConnections} knowledge connections`);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/apps/imagination-tv" className="text-purple-600 hover:text-purple-700">
                ← Back to IMAGI-NATION TV
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Video Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="password"
                placeholder="Admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={loadDashboardData}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'import', label: 'Import Videos' },
              { id: 'quality', label: 'Quality Control' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && importStatus && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📺</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Videos</p>
                    <p className="text-2xl font-semibold text-gray-900">{importStatus.totalVideos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Published</p>
                    <p className="text-2xl font-semibold text-gray-900">{importStatus.publishedVideos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Drafts</p>
                    <p className="text-2xl font-semibold text-gray-900">{importStatus.draftVideos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🧠</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">With Wisdom</p>
                    <p className="text-2xl font-semibold text-gray-900">{importStatus.processingStatus.withWisdomExtracts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Video Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{importStatus.youtubeVideos}</div>
                  <div className="text-sm text-gray-500">YouTube Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{importStatus.airtableVideos}</div>
                  <div className="text-sm text-gray-500">Airtable Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{importStatus.imaginationTvEpisodes}</div>
                  <div className="text-sm text-gray-500">IMAGI-NATION TV</div>
                </div>
              </div>
            </div>

            {/* Processing Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">With Transcription</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(importStatus.processingStatus.withTranscription / importStatus.totalVideos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{importStatus.processingStatus.withTranscription}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">With Wisdom Extracts</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(importStatus.processingStatus.withWisdomExtracts / importStatus.totalVideos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{importStatus.processingStatus.withWisdomExtracts}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Processing</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${(importStatus.processingStatus.pendingProcessing / importStatus.totalVideos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{importStatus.processingStatus.pendingProcessing}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            {/* Import Progress */}
            {importProgress && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Import Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      importProgress.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      importProgress.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {importProgress.status}
                    </span>
                  </div>
                  
                  {importProgress.status === 'completed' && importProgress.results && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Import Results</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        {importProgress.results.summary ? (
                          <>
                            <div>Total Imported: {importProgress.results.summary.totalImported}</div>
                            <div>Total Processed: {importProgress.results.summary.totalProcessed}</div>
                            <div>Errors: {importProgress.results.summary.totalErrors}</div>
                            {importProgress.results.connectionsGenerated && (
                              <div>Knowledge Connections: {importProgress.results.connectionsGenerated}</div>
                            )}
                          </>
                        ) : (
                          <>
                            <div>Imported: {importProgress.results.imported || 0}</div>
                            <div>Processed: {importProgress.results.processed || 0}</div>
                            <div>Errors: {importProgress.results.errors?.length || 0}</div>
                          </>
                        )}
                        <div>Duration: {importProgress.duration}</div>
                      </div>
                    </div>
                  )}
                  
                  {importProgress.status === 'failed' && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Import Failed</h4>
                      <p className="text-sm text-red-700">{importProgress.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Import Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🔍 Quick YouTube Test</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Import 20 videos from AIME's YouTube search for testing and validation.
                </p>
                <button
                  onClick={() => runImport('import-real-channel', undefined, { maxVideos: 20 })}
                  disabled={importProgress?.status === 'running'}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {importProgress?.status === 'running' ? 'Importing...' : 'Import 20 Test Videos'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📺 Airtable IMAGI-NATION TV</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Import official IMAGI-NATION TV episodes from Airtable with full metadata.
                </p>
                <button
                  onClick={() => runImport('import-airtable-episodes')}
                  disabled={importProgress?.status === 'running'}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {importProgress?.status === 'running' ? 'Importing...' : 'Import TV Episodes'}
                </button>
              </div>
            </div>

            {/* Bulk Import Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg shadow-lg text-white">
              <h3 className="text-xl font-bold mb-4">🚀 Bulk Import - All 423 Videos</h3>
              <p className="text-purple-100 mb-6">
                Import all videos from @aimementoring YouTube channel with intelligent batching, 
                deduplication, and cross-platform matching against Airtable data.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => runImport('import-real-bulk', undefined, { 
                    channelId: 'UCyour-channel-id', 
                    importAll: true, 
                    batchSize: 50 
                  })}
                  disabled={importProgress?.status === 'running'}
                  className="bg-white text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {importProgress?.status === 'running' ? 'Importing...' : '📥 Import All 423 Videos'}
                </button>
                
                <button
                  onClick={() => runImport('deduplicate', undefined, { action: 'analyze' })}
                  disabled={importProgress?.status === 'running'}
                  className="bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {importProgress?.status === 'running' ? 'Analyzing...' : '🔍 Find Duplicates'}
                </button>
                
                <button
                  onClick={() => runImport('deduplicate', undefined, { action: 'merge', autoMerge: true })}
                  disabled={importProgress?.status === 'running'}
                  className="bg-white text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {importProgress?.status === 'running' ? 'Merging...' : '🔄 Auto-Merge Duplicates'}
                </button>
              </div>
              
              <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg">
                <h4 className="font-medium mb-2">💡 Bulk Import Features:</h4>
                <ul className="text-sm text-purple-100 space-y-1">
                  <li>• Intelligent batching (50 videos per batch)</li>
                  <li>• Automatic deduplication against existing content</li>
                  <li>• Cross-platform matching (YouTube ↔ Airtable)</li>
                  <li>• Progress tracking and error handling</li>
                  <li>• Quality scoring and content classification</li>
                </ul>
              </div>
            </div>

            {/* Comprehensive Import */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Import & Processing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Run a comprehensive import from all sources, including automatic wisdom extraction and knowledge connections.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => runImport('import-all')}
                  disabled={importProgress?.status === 'running'}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {importProgress?.status === 'running' ? 'Running Complete Import...' : 'Run Complete Import'}
                </button>
                
                <button
                  onClick={generateConnections}
                  disabled={importProgress?.status === 'running'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Knowledge Connections
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quality Tab */}
        {activeTab === 'quality' && qualityReport && (
          <div className="space-y-6">
            {/* Quality Score */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Quality Score</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        qualityReport.overallQualityScore >= 80 ? 'bg-green-600' :
                        qualityReport.overallQualityScore >= 60 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${qualityReport.overallQualityScore}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">{qualityReport.overallQualityScore}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on {qualityReport.totalEpisodes} videos
              </p>
            </div>

            {/* Quality Checks */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Metrics</h3>
              <div className="space-y-4">
                {Object.entries(qualityReport.qualityChecks).map(([check, data]) => (
                  <div key={check} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {check.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            data.percentage >= 80 ? 'bg-green-600' :
                            data.percentage >= 60 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {data.count}/{qualityReport.totalEpisodes} ({data.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {qualityReport.recommendations.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {qualityReport.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-500 mt-0.5">💡</span>
                      <span className="text-sm text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Video Analytics</h3>
              <p className="text-gray-600">
                Comprehensive analytics dashboard coming soon. This will include:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• View patterns and engagement metrics</li>
                <li>• Wisdom extract interaction rates</li>
                <li>• Content discovery pathways</li>
                <li>• Learning objective completion rates</li>
                <li>• Cross-platform performance comparison</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}