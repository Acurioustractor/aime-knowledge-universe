'use client';

import { useState } from 'react';

interface LoadMoreButtonProps {
  currentCount: number;
  totalCount: number;
  hasMore: boolean;
}

export default function LoadMoreButton({ currentCount, totalCount, hasMore }: LoadMoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [currentHasMore, setCurrentHasMore] = useState(hasMore);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    if (loading || !currentHasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tools-fast?limit=12&offset=${currentCount + tools.length}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const newTools = result.data || [];
        setTools(prev => [...prev, ...newTools]);
        setCurrentHasMore(result.meta?.hasMore || false);
      } else {
        throw new Error(result.error || 'Failed to load more tools');
      }
    } catch (error) {
      console.error('Load more error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load more tools');
    } finally {
      setLoading(false);
    }
  };

  const remainingCount = totalCount - currentCount - tools.length;

  return (
    <div className="space-y-8">
      {/* Show newly loaded tools */}
      {tools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tools.map((tool: any) => (
            <div key={tool.id} className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Same card structure as main page */}
              {tool.thumbnailUrl && (
                <div className="relative bg-gray-100 overflow-hidden">
                  <img 
                    src={tool.thumbnailUrl} 
                    alt={tool.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {tool.fileType === 'Video' && (
                      <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                        📹 Video
                      </div>
                    )}
                    {tool.fileType === 'Document' && (
                      <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                        📄 Document
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                    {tool.category || 'General'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                {tool.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <span>{new Date(tool.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  {tool.url && (
                    <a 
                      href={tool.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      <span>Open</span>
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button or Error */}
      {error ? (
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadMore}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : currentHasMore ? (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Loading more resources...
              </>
            ) : (
              <>
                <span>Load {Math.min(12, remainingCount)} more resources</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Showing <span className="font-medium">{currentCount + tools.length}</span> of <span className="font-medium">{totalCount}</span> resources
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-8 h-8 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-green-700 font-medium">All resources loaded!</p>
            <p className="text-green-600 text-sm mt-1">You've seen all {totalCount} available resources</p>
          </div>
        </div>
      )}
    </div>
  );
} 