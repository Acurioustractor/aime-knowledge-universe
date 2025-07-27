'use client';

import { useState } from 'react';

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: any;
}

export default function TestIntegrationPage() {
  const [youtubeData, setYoutubeData] = useState<APIResponse | null>(null);
  const [searchData, setSearchData] = useState<APIResponse | null>(null);
  const [graphData, setGraphData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const testYouTubeAPI = async () => {
    setLoading('youtube');
    try {
      const response = await fetch('/api/content/youtube?maxResults=5');
      const data = await response.json();
      setYoutubeData(data);
    } catch (error) {
      setYoutubeData({ success: false, error: 'Failed to fetch YouTube data' });
    } finally {
      setLoading(null);
    }
  };

  const testSemanticSearch = async () => {
    setLoading('search');
    try {
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'indigenous wisdom and youth leadership',
          searchType: 'semantic',
          limit: 5,
          includeAnalytics: true
        })
      });
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      setSearchData({ success: false, error: 'Failed to perform semantic search' });
    } finally {
      setLoading(null);
    }
  };

  const testKnowledgeGraph = async () => {
    setLoading('graph');
    try {
      const response = await fetch('/api/knowledge-graph?view=full&depth=2');
      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      setGraphData({ success: false, error: 'Failed to fetch knowledge graph' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-wiki">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Integration Test
          </h1>
          <p className="text-xl text-gray-600">
            Test the real AIME Knowledge Platform APIs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* YouTube API Test */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              YouTube Integration
            </h2>
            <p className="text-gray-600 mb-6">
              Test the YouTube API that fetches IMAGI-NATION TV episodes with AI analysis.
            </p>
            <button
              onClick={testYouTubeAPI}
              disabled={loading === 'youtube'}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors mb-4"
            >
              {loading === 'youtube' ? 'Loading...' : 'Test YouTube API'}
            </button>
            
            {youtubeData && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Response:</h3>
                <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {youtubeData.success ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">✅ Success!</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Found {youtubeData.data?.length} videos
                      </p>
                      {youtubeData.data?.slice(0, 2).map((video: any, i: number) => (
                        <div key={i} className="border-l-2 border-blue-500 pl-3 mb-3">
                          <p className="font-medium text-sm">{video.title}</p>
                          <p className="text-xs text-gray-500">
                            Impact: {video.impactScore} | Themes: {video.aiAnalysis?.themes?.length}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600">❌ {youtubeData.error}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Semantic Search Test */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Semantic Search
            </h2>
            <p className="text-gray-600 mb-6">
              Test AI-powered semantic search across all AIME content.
            </p>
            <button
              onClick={testSemanticSearch}
              disabled={loading === 'search'}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mb-4"
            >
              {loading === 'search' ? 'Searching...' : 'Test Semantic Search'}
            </button>
            
            {searchData && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Response:</h3>
                <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {searchData.success ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">✅ Search Complete!</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Query: "{searchData.data?.query?.original}"
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Found {searchData.data?.results?.length} results
                      </p>
                      {searchData.data?.results?.slice(0, 2).map((result: any, i: number) => (
                        <div key={i} className="border-l-2 border-green-500 pl-3 mb-3">
                          <p className="font-medium text-sm">{result.title}</p>
                          <p className="text-xs text-gray-500">
                            Score: {Math.round(result.semanticScore * 100)}% | Type: {result.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600">❌ {searchData.error}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Knowledge Graph Test */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Knowledge Graph
            </h2>
            <p className="text-gray-600 mb-6">
              Test the knowledge graph API that maps relationships between content.
            </p>
            <button
              onClick={testKnowledgeGraph}
              disabled={loading === 'graph'}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors mb-4"
            >
              {loading === 'graph' ? 'Loading Graph...' : 'Test Knowledge Graph'}
            </button>
            
            {graphData && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Response:</h3>
                <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {graphData.success ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">✅ Graph Generated!</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Nodes: {graphData.metadata?.nodeCount} | Edges: {graphData.metadata?.edgeCount}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Density: {Math.round(graphData.metadata?.density * 100)}%
                      </p>
                      {graphData.data?.analytics?.nodeMetrics?.centralNodes?.slice(0, 3).map((node: any, i: number) => (
                        <div key={i} className="border-l-2 border-purple-500 pl-3 mb-2">
                          <p className="font-medium text-sm">{node.label}</p>
                          <p className="text-xs text-gray-500">
                            Connections: {node.connections}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-600">❌ {graphData.error}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Combined Demo */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Complete API Integration Demo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={async () => {
                await testYouTubeAPI();
                setTimeout(testSemanticSearch, 1000);
                setTimeout(testKnowledgeGraph, 2000);
              }}
              disabled={loading !== null}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              Run All Tests
            </button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">API Endpoints</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>/api/content/youtube</p>
                <p>/api/search/semantic</p>
                <p>/api/knowledge-graph</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Live Data</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>🎥 250+ Videos</p>
                <p>🔗 45.2K Connections</p>
                <p>🧠 18.7K AI Insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            API Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">YouTube API</h3>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400">GET</p>
                <p className="text-blue-300">/api/content/youtube</p>
                <p className="text-gray-300 mt-2">?maxResults=25</p>
                <p className="text-gray-300">&search=query</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Semantic Search</h3>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <p className="text-orange-400">POST</p>
                <p className="text-blue-300">/api/search/semantic</p>
                <p className="text-gray-300 mt-2">{'{'}</p>
                <p className="text-gray-300">  "query": "string",</p>
                <p className="text-gray-300">  "limit": 10</p>
                <p className="text-gray-300">{'}'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Knowledge Graph</h3>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400">GET</p>
                <p className="text-blue-300">/api/knowledge-graph</p>
                <p className="text-gray-300 mt-2">?view=full</p>
                <p className="text-gray-300">&depth=2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}