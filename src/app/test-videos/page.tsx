'use client';

import { useState, useEffect } from 'react';

export default function TestVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Test page loading videos...');
    
    fetch('/api/imagination-tv/episodes?limit=5')
      .then(response => {
        console.log('📡 Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📺 Full API response:', data);
        if (data.success && data.data && data.data.episodes) {
          setVideos(data.data.episodes);
          console.log(`✅ Loaded ${data.data.episodes.length} videos`);
        } else {
          setError('No videos in response');
        }
      })
      .catch(error => {
        console.error('❌ Error:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video API Test</h1>
      <p className="mb-4">Found {videos.length} videos</p>
      
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div key={video.id} className="border p-4 rounded">
            <h3 className="font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-600">ID: {video.id}</p>
            <p className="text-sm text-gray-600">Status: {video.status}</p>
            <p className="text-sm text-gray-600">Themes: {JSON.stringify(video.themes)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}