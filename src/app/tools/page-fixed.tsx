'use client';

import { useState, useEffect } from 'react';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  fileType?: string;
  size?: string;
  language: string;
  usageRestrictions: string;
  status: string;
  dateAdded: string;
  lastUpdated: string;
  attachments: any[];
  source: string;
  metadata: any;
}

export default function ToolsPageFixed() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTools, setTotalTools] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    console.log('🔧 Fixed Tools Page: Starting...');
    
    const fetchTools = async () => {
      try {
        console.log('🔧 Fixed Tools Page: Fetching...');
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/tools-fast?limit=12&offset=0');
        console.log('🔧 Fixed Tools Page: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('🔧 Fixed Tools Page: API response:', result);
        
        if (result.success) {
          const newTools = result.data || [];
          setTools(newTools);
          setTotalTools(result.meta?.total || 0);
          setHasMore(result.meta?.hasMore || false);
          console.log('🔧 Fixed Tools Page: Tools set:', newTools.length, 'Total:', result.meta?.total);
        } else {
          const errorMessage = result.error?.message || result.error || 'Failed to fetch tools';
          console.log('🔧 Fixed Tools Page: API Error:', errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        console.error('🔧 Fixed Tools Page: Fetch error:', err);
        setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        console.log('🔧 Fixed Tools Page: Setting loading to false');
        setLoading(false);
      }
    };

    fetchTools();
  }, []); // Empty dependency array

  console.log('🔧 Fixed Tools Page: Rendering - loading:', loading, 'tools:', tools.length, 'error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b border-gray-300">
          <div className="container-wiki py-2">
            <nav className="text-sm">
              <a className="text-blue-600 underline hover:text-blue-800" href="/">Home</a>
              <span className="text-gray-500 mx-1">›</span>
              <span className="text-gray-700">Tools</span>
            </nav>
          </div>
        </div>
        
        <div className="border-b border-gray-300 bg-white py-8">
          <div className="container-wiki">
            <h1 className="text-2xl font-bold text-black mb-4">Tools & Resources</h1>
            <p className="text-gray-700 max-w-4xl">Practical toolkits, frameworks, and resources for implementing AIME mentoring approaches.</p>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container-wiki">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-600">Loading tools... (Fixed version)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b border-gray-300">
          <div className="container-wiki py-2">
            <nav className="text-sm">
              <a className="text-blue-600 underline hover:text-blue-800" href="/">Home</a>
              <span className="text-gray-500 mx-1">›</span>
              <span className="text-gray-700">Tools</span>
            </nav>
          </div>
        </div>
        
        <div className="border-b border-gray-300 bg-white py-8">
          <div className="container-wiki">
            <h1 className="text-2xl font-bold text-black mb-4">Tools & Resources</h1>
            <p className="text-gray-700 max-w-4xl">Practical toolkits, frameworks, and resources for implementing AIME mentoring approaches.</p>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container-wiki">
            <div className="border border-red-300 p-6 bg-red-50">
              <h3 className="text-lg font-bold text-red-800 mb-2">Error loading tools</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <a className="text-blue-600 underline hover:text-blue-800" href="/">Home</a>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Tools</span>
          </nav>
        </div>
      </div>
      
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">Tools & Resources</h1>
          <p className="text-gray-700 max-w-4xl">Practical toolkits, frameworks, and resources for implementing AIME mentoring approaches.</p>
        </div>
      </div>
      
      <div className="py-8">
        <div className="container-wiki">
          {/* Results Counter */}
          <div className="mb-8 px-6 py-3 bg-white border border-gray-300 text-sm text-gray-600 font-medium">
            Showing {tools.length} of {totalTools} tools
            {hasMore && ` • ${totalTools - tools.length} more available`}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <div key={tool.id} className="border border-gray-300 rounded-lg bg-white hover:shadow-lg transition-shadow overflow-hidden">
                {tool.thumbnailUrl && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img 
                      src={tool.thumbnailUrl} 
                      alt={tool.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🛠️</span>
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{tool.category}</span>
                        {tool.fileType && (
                          <span className="ml-2 text-xs text-gray-400">• {tool.fileType}</span>
                        )}
                      </div>
                    </div>
                    {tool.size && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {tool.size}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                    {tool.title}
                  </h3>

                  {tool.description && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {tool.description}
                    </p>
                  )}

                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tool.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {tool.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{tool.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Added: {new Date(tool.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    {tool.url && (
                      <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600">No tools found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 