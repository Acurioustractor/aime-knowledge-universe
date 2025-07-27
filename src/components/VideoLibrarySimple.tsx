'use client';

import { useState, useEffect } from 'react';
import { VideoCard } from './VideoComponents';

export function VideoLibrarySimple() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    console.log('🔄 Starting to load videos...');
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/imagination-tv/episodes?limit=50`);
      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📺 API Response data:', data);
      
      if (data.success && data.data && data.data.episodes) {
        console.log(`✅ Successfully loaded ${data.data.episodes.length} videos`);
        
        // Transform the data to match VideoCard expectations
        const transformedVideos = data.data.episodes.map((episode: any) => ({
          id: episode.id,
          title: episode.title || 'Untitled',
          description: episode.description || '',
          episodeNumber: episode.episodeNumber || 0,
          season: episode.season,
          thumbnailUrl: episode.thumbnailUrl || '',
          duration: episode.duration || 'PT0S',
          publishedAt: episode.publishedAt || new Date().toISOString(),
          viewCount: episode.viewCount || 0,
          wisdomExtractsCount: episode.wisdomExtractsCount || 0,
          themes: episode.themes || [],
          status: episode.status || 'published',
          // Additional fields that might be useful
          programs: episode.programs || [],
          keyTopics: episode.keyTopics || [],
          contentType: episode.contentType || 'educational',
          videoUrl: episode.videoUrl || '',
          youtubeId: episode.youtubeId || null
        }));
        
        setVideos(transformedVideos);
        console.log('📺 Sample transformed video:', transformedVideos[0]);
      } else {
        throw new Error('API returned no episodes or unsuccessful response');
      }
    } catch (error) {
      console.error('❌ Failed to load videos:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Videos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadVideos}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Video Library</h1>
          <p className="text-gray-600 mt-1">{videos.length} videos available</p>
        </div>
      </div>

      {/* Simple Test Display */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Debug Info</h3>
        <p className="text-blue-800">Videos loaded: {videos.length}</p>
        {videos.length > 0 && (
          <p className="text-blue-700 text-sm mt-1">
            Sample: {videos[0].title}
          </p>
        )}
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📺</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600">Check the console for debugging information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 12).map((video) => (
            <VideoCard
              key={video.id}
              episode={video}
              variant="card"
              showStats={true}
              showThemes={true}
            />
          ))}
        </div>
      )}

      {videos.length > 12 && (
        <div className="text-center py-4">
          <p className="text-gray-600">Showing first 12 of {videos.length} videos</p>
        </div>
      )}
    </div>
  );
}