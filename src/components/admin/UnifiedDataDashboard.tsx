'use client';

import { useState, useEffect } from 'react';

interface SyncResult {
  success: boolean;
  source: string;
  synced: number;
  total: number;
  duration: number;
  error?: string;
}

interface DatabaseStats {
  total_items: number;
  total_sources: number;
  tools_count: number;
  videos_count: number;
  newsletters_count?: number;
  documents_count?: number;
  last_sync: string;
  source_breakdown: Record<string, number>;
  sync_history: any[];
}

interface SyncStatus {
  isRunning: boolean;
  currentStep: string;
  progress: number;
  results: SyncResult[];
  startTime?: number;
  estimatedCompletion?: number;
}

export default function UnifiedDataDashboard() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDashboard();
    
    // Poll for sync status every 5 seconds when syncing
    const interval = setInterval(() => {
      if (syncing || syncStatus?.isRunning) {
        loadSyncStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [syncing, syncStatus?.isRunning]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sync/unified?stats=true');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setSyncStatus(data.status);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/unified');
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus(data.status);
        setSyncing(data.status.isRunning);
      }
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const startSync = async (options: {
    includeVideos?: boolean;
    includeNewsletters?: boolean;
    includeTools?: boolean;
    includeDocuments?: boolean;
  } = {}) => {
    try {
      setSyncing(true);
      const response = await fetch('/api/sync/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload dashboard after successful sync
        await loadDashboard();
      } else {
        console.error('Sync failed:', data.error);
      }
    } catch (error) {
      console.error('Error starting sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getSourceIcon = (source: string) => {
    const icons: Record<string, string> = {
      airtable: '🛠️',
      youtube: '📺',
      mailchimp: '📧',
      github: '📄'
    };
    return icons[source] || '📊';
  };

  const getSourceName = (source: string) => {
    const names: Record<string, string> = {
      airtable: 'Tools (Airtable)',
      youtube: 'Videos (YouTube)',
      mailchimp: 'Newsletters (Mailchimp)',
      github: 'Documents (GitHub)'
    };
    return names[source] || source;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading database dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AIME Data Lake Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of all content sources and sync status</p>
        </div>

        {/* Sync Status */}
        {syncStatus && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Sync Status</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => startSync()}
                  disabled={syncStatus.isRunning}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncStatus.isRunning ? '🔄 Syncing...' : '🚀 Sync All'}
                </button>
                <button
                  onClick={loadDashboard}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {syncStatus.isRunning && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{syncStatus.currentStep}</span>
                  <span>{Math.round(syncStatus.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${syncStatus.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {syncStatus.results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {syncStatus.results.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getSourceIcon(result.source)}</span>
                      <span className="font-medium text-gray-900">{getSourceName(result.source)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Synced: {formatNumber(result.synced)} / {formatNumber(result.total)}</div>
                      <div>Duration: {formatDuration(result.duration)}</div>
                      {result.error && <div className="text-red-600 mt-1">Error: {result.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Database Statistics */}
        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-600 mr-4">📊</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total_items)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-green-600 mr-4">🛠️</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tools</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.tools_count)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-red-600 mr-4">📺</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Videos</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.videos_count)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-600 mr-4">📧</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Newsletters</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.newsletters_count || 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Source</h3>
                <div className="space-y-3">
                  {Object.entries(stats.source_breakdown).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getSourceIcon(source)}</span>
                        <span className="font-medium text-gray-900">{getSourceName(source)}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-600">{formatNumber(count)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync History</h3>
                <div className="space-y-3">
                  {stats.sync_history.slice(0, 5).map((sync, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{getSourceName(sync.source)}</div>
                        <div className="text-sm text-gray-500">{formatNumber(sync.total_records)} items</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {sync.last_sync_at ? new Date(sync.last_sync_at).toLocaleDateString() : 'Never'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sync.sync_duration_ms ? formatDuration(sync.sync_duration_ms) : '-'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => startSync({ includeTools: true })}
                  disabled={syncStatus?.isRunning}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛠️</div>
                    <div className="text-sm font-medium">Sync Tools</div>
                  </div>
                </button>

                <button
                  onClick={() => startSync({ includeVideos: true })}
                  disabled={syncStatus?.isRunning}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📺</div>
                    <div className="text-sm font-medium">Sync Videos</div>
                  </div>
                </button>

                <button
                  onClick={() => startSync({ includeNewsletters: true })}
                  disabled={syncStatus?.isRunning}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📧</div>
                    <div className="text-sm font-medium">Sync Newsletters</div>
                  </div>
                </button>

                <button
                  onClick={() => startSync({ includeDocuments: true })}
                  disabled={syncStatus?.isRunning}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-sm font-medium">Sync Documents</div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}