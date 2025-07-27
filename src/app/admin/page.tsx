'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apis' | 'content' | 'analytics'>('overview');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-wiki py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AIME Admin Dashboard</h1>
              <p className="text-gray-600">System management and technical controls</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Public Site
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wiki py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {[
                  { id: 'overview', label: 'System Overview', icon: '📊' },
                  { id: 'apis', label: 'API Management', icon: '🔌' },
                  { id: 'content', label: 'Content Pipeline', icon: '🔄' },
                  { id: 'analytics', label: 'Analytics', icon: '📈' }
                ].map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/admin/sync" className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                  🔄 Force Content Sync
                </Link>
                <Link href="/admin/rebuild" className="block w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md">
                  🏗️ Rebuild Search Index
                </Link>
                <Link href="/admin/export" className="block w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md">
                  📤 Export Data
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <SystemOverview />}
            {activeTab === 'apis' && <APIManagement />}
            {activeTab === 'content' && <ContentPipeline />}
            {activeTab === 'analytics' && <SystemAnalytics />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemOverview() {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard label="API Health" status="healthy" value="99.9%" />
          <StatusCard label="Content Sources" status="healthy" value="4/4 Active" />
          <StatusCard label="Search Index" status="warning" value="Last updated 2h ago" />
          <StatusCard label="Knowledge Graph" status="healthy" value="45.2K nodes" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem 
            type="sync" 
            message="YouTube content synchronized - 3 new videos processed"
            timestamp="5 minutes ago"
          />
          <ActivityItem 
            type="search" 
            message="Semantic search index updated with 23 new connections"
            timestamp="1 hour ago"
          />
          <ActivityItem 
            type="error" 
            message="Mailchimp API rate limit warning"
            timestamp="2 hours ago"
          />
          <ActivityItem 
            type="success" 
            message="Knowledge graph rebuilt successfully"
            timestamp="4 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

function APIManagement() {
  return (
    <div className="space-y-6">
      {/* API Endpoints */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
        <div className="space-y-4">
          <APIEndpoint 
            method="GET" 
            path="/api/content/youtube" 
            description="Fetch YouTube content with AI analysis"
            status="active"
            lastCalled="2 minutes ago"
          />
          <APIEndpoint 
            method="POST" 
            path="/api/search/semantic" 
            description="Perform semantic search across all content"
            status="active"
            lastCalled="30 seconds ago"
          />
          <APIEndpoint 
            method="GET" 
            path="/api/knowledge-graph" 
            description="Retrieve knowledge graph data"
            status="active"
            lastCalled="5 minutes ago"
          />
        </div>
      </div>

      {/* API Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Requests today</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">98.9%</div>
            <div className="text-sm text-gray-600">Success rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">234ms</div>
            <div className="text-sm text-gray-600">Avg response</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPipeline() {
  return (
    <div className="space-y-6">
      {/* Data Sources */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Sources</h2>
        <div className="space-y-4">
          <SourceCard 
            name="IMAGI-NATION TV (YouTube)"
            status="connected"
            itemCount={256}
            lastSync="15 minutes ago"
            icon="🎥"
          />
          <SourceCard 
            name="Workshop Database (Airtable)"
            status="syncing"
            itemCount={148}
            lastSync="Currently syncing..."
            icon="📊"
          />
          <SourceCard 
            name="Research Repository (GitHub)"
            status="connected"
            itemCount={89}
            lastSync="1 hour ago"
            icon="🔬"
          />
          <SourceCard 
            name="Newsletter Archive (Mailchimp)"
            status="error"
            itemCount={34}
            lastSync="2 hours ago (rate limited)"
            icon="📧"
          />
        </div>
      </div>

      {/* Processing Queue */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Processing Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">18</div>
            <div className="text-sm text-gray-600">Queued</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">503</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">6</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemAnalytics() {
  return (
    <div className="space-y-6">
      {/* Usage Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900">2,847</div>
            <div className="text-sm text-gray-600">Total searches today</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900">1,203</div>
            <div className="text-sm text-gray-600">Unique visitors</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900">4.2m</div>
            <div className="text-sm text-gray-600">Content views</div>
          </div>
        </div>
      </div>

      {/* Popular Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Content</h2>
        <div className="space-y-3">
          <PopularItem 
            title="Indigenous Innovation and Youth Leadership"
            type="video"
            views={1247}
            engagement="92%"
          />
          <PopularItem 
            title="Cultural Bridge Building Framework"
            type="tool"
            views={834}
            engagement="87%"
          />
          <PopularItem 
            title="Mentorship Impact Study"
            type="research"
            views={672}
            engagement="95%"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatusCard({ label, status, value }: { label: string; status: 'healthy' | 'warning' | 'error'; value: string }) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function ActivityItem({ type, message, timestamp }: { type: string; message: string; timestamp: string }) {
  const typeIcons = {
    sync: '🔄',
    search: '🔍',
    error: '⚠️',
    success: '✅'
  };

  return (
    <div className="flex items-start space-x-3 p-3 border-l-2 border-gray-200">
      <span className="text-lg">{typeIcons[type as keyof typeof typeIcons] || '📝'}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{message}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}

function APIEndpoint({ method, path, description, status, lastCalled }: any) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <span className={`px-2 py-1 text-xs rounded font-mono ${
            method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {method}
          </span>
          <code className="text-sm font-mono text-gray-800">{path}</code>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-xs text-green-600 font-medium">{status}</div>
        <div className="text-xs text-gray-500">{lastCalled}</div>
      </div>
    </div>
  );
}

function SourceCard({ name, status, itemCount, lastSync, icon }: any) {
  const statusColors = {
    connected: 'text-green-600',
    syncing: 'text-blue-600',
    error: 'text-red-600'
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{itemCount} items</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-medium ${statusColors[status]}`}>{status}</div>
        <div className="text-xs text-gray-500">{lastSync}</div>
      </div>
    </div>
  );
}

function PopularItem({ title, type, views, engagement }: any) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">{views} views</div>
        <div className="text-xs text-green-600">{engagement} engagement</div>
      </div>
    </div>
  );
}