/**
 * Admin Sync Dashboard
 * 
 * Interface for managing content synchronization
 */

'use client';

import { useState, useEffect } from 'react';

interface SyncStatus {
  source: string;
  last_sync_at?: string;
  last_successful_sync_at?: string;
  total_records: number;
  new_records: number;
  updated_records: number;
  sync_duration_ms: number;
  error_count: number;
  last_error?: string;
  next_sync_at?: string;
  is_syncing: boolean;
}

interface SyncResult {
  source: string;
  success: boolean;
  totalRecords: number;
  newRecords: number;
  updatedRecords: number;
  durationMs: number;
  error?: string;
}

export default function AdminSyncPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [lastSyncResults, setLastSyncResults] = useState<SyncResult[]>([]);

  // Fetch sync status
  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger sync
  const triggerSync = async (source?: string) => {
    try {
      setSyncing(source || 'all');
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, force: true })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLastSyncResults(data.results);
        await fetchSyncStatus(); // Refresh status
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed');
    } finally {
      setSyncing(null);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSyncStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading sync status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Sync Dashboard</h1>
          <p className="text-gray-600">Manage synchronization of content from external APIs to the database.</p>
        </div>

        {/* Sync Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sync Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => triggerSync()}
              disabled={syncing !== null}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing === 'all' ? 'Syncing All...' : 'Sync All Sources'}
            </button>
            
            {['youtube', 'airtable', 'mailchimp', 'github'].map(source => (
              <button
                key={source}
                onClick={() => triggerSync(source)}
                disabled={syncing !== null}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 capitalize"
              >
                {syncing === source ? `Syncing ${source}...` : `Sync ${source}`}
              </button>
            ))}
          </div>
        </div>

        {/* Last Sync Results */}
        {lastSyncResults.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Last Sync Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lastSyncResults.map(result => (
                <div
                  key={result.source}
                  className={`p-4 rounded-lg border-2 ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <h3 className="font-semibold capitalize">{result.source}</h3>
                  <div className="text-sm text-gray-600 mt-2">
                    <div>Status: {result.success ? '✅ Success' : '❌ Failed'}</div>
                    <div>Total: {result.totalRecords}</div>
                    <div>New: {result.newRecords}</div>
                    <div>Updated: {result.updatedRecords}</div>
                    <div>Duration: {formatDuration(result.durationMs)}</div>
                    {result.error && (
                      <div className="text-red-600 mt-1">Error: {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Source</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Records</th>
                  <th className="text-left py-2">Last Sync</th>
                  <th className="text-left py-2">Next Sync</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Errors</th>
                </tr>
              </thead>
              <tbody>
                {syncStatus.map(status => (
                  <tr key={status.source} className="border-b">
                    <td className="py-3 capitalize font-medium">{status.source}</td>
                    <td className="py-3">
                      {status.is_syncing ? (
                        <span className="text-blue-600">🔄 Syncing...</span>
                      ) : status.error_count > 0 ? (
                        <span className="text-red-600">❌ Error</span>
                      ) : (
                        <span className="text-green-600">✅ Ready</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        <div>Total: {status.total_records}</div>
                        {status.new_records > 0 && (
                          <div className="text-green-600">+{status.new_records} new</div>
                        )}
                        {status.updated_records > 0 && (
                          <div className="text-blue-600">~{status.updated_records} updated</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      {formatDate(status.last_successful_sync_at)}
                    </td>
                    <td className="py-3 text-sm">
                      {formatDate(status.next_sync_at)}
                    </td>
                    <td className="py-3 text-sm">
                      {formatDuration(status.sync_duration_ms)}
                    </td>
                    <td className="py-3">
                      {status.error_count > 0 ? (
                        <div className="text-sm">
                          <div className="text-red-600">{status.error_count} errors</div>
                          {status.last_error && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {status.last_error}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-green-600">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Content is stored in the database and served instantly</li>
            <li>• External APIs are only called during sync operations</li>
            <li>• Automatic syncing happens every 6 hours (configurable)</li>
            <li>• Manual syncing can be triggered anytime from this dashboard</li>
            <li>• Failed syncs are retried automatically with exponential backoff</li>
          </ul>
        </div>
      </div>
    </div>
  );
}