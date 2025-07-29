'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { HoodiePreview } from '@/components/hoodie-preview/HoodiePreview';
import { useHoodiePreview } from '@/hooks/useHoodiePreview';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  type: string;
  source: string;
  url?: string;
  metadata?: {
    duration?: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    thumbnails?: {
      medium?: { url: string };
      default?: { url: string };
    };
    channelTitle?: string;
    publishedDate?: string;
  };
  themes?: string[];
}

export default function VideosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>((searchParams.get('sort') as any) || 'date');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(searchParams.get('themes')?.split(',').filter(Boolean) || []);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(searchParams.get('formats')?.split(',').filter(Boolean) || []);
  const [selectedDuration, setSelectedDuration] = useState<string>(searchParams.get('duration') || 'all');
  const [selectedViewRange, setSelectedViewRange] = useState<string>(searchParams.get('viewRange') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [showHoodiePreview, setShowHoodiePreview] = useState(false);
  const videosPerPage = 50;
  
  // Use hoodie preview for video pages
  const { hoodie } = useHoodiePreview({
    autoRefresh: false,
    category: 'Media'
  });
  
  // Show hoodie preview after viewing a few videos
  useEffect(() => {
    const viewCount = parseInt(sessionStorage.getItem('videoViewCount') || '0');
    if (viewCount >= 3 && !sessionStorage.getItem('hoodiePreviewShown')) {
      setShowHoodiePreview(true);
      sessionStorage.setItem('hoodiePreviewShown', 'true');
    }
  }, []);

  // Filter options based on AIME content themes
  const themeOptions = [
    { id: 'education', label: 'Education Transformation', color: 'bg-blue-100 text-blue-800' },
    { id: 'indigenous', label: 'Indigenous Knowledge', color: 'bg-green-100 text-green-800' },
    { id: 'mentoring', label: 'Mentorship', color: 'bg-purple-100 text-purple-800' },
    { id: 'youth', label: 'Youth Leadership', color: 'bg-orange-100 text-orange-800' },
    { id: 'university', label: 'University Pathways', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'imagination', label: 'Imagination & Creativity', color: 'bg-pink-100 text-pink-800' },
    { id: 'community', label: 'Community Impact', color: 'bg-teal-100 text-teal-800' },
    { id: 'leadership', label: 'Leadership Development', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'student', label: 'Student Success', color: 'bg-red-100 text-red-800' },
    { id: 'program', label: 'AIME Programs', color: 'bg-gray-100 text-gray-800' }
  ];

  const formatOptions = [
    { id: 'workshop', label: 'Workshops & Training' },
    { id: 'interview', label: 'Interviews & Conversations' },
    { id: 'presentation', label: 'Presentations & Talks' },
    { id: 'panel', label: 'Panel Discussions' },
    { id: 'story', label: 'Student Stories' },
    { id: 'live', label: 'Live Sessions' }
  ];

  const durationOptions = [
    { id: 'all', label: 'All Durations' },
    { id: 'short', label: 'Short (0-15 min)' },
    { id: 'medium', label: 'Medium (15-45 min)' },
    { id: 'long', label: 'Long (45+ min)' }
  ];

  const viewRangeOptions = [
    { id: 'all', label: 'All View Counts' },
    { id: 'popular', label: 'Popular (100+ views)' },
    { id: 'trending', label: 'Trending (50+ views)' },
    { id: 'new', label: 'New Content (0-50 views)' }
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;
    
    async function fetchVideos() {
      try {
        console.log('🎬 Starting video fetch...');
        if (isMounted) {
          setLoading(true);
          setError(null); // Clear any previous errors
        }
        
        // Safety timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.log('🎬 TIMEOUT: Fetch took too long, forcing loading to false');
          if (isMounted) {
            setLoading(false);
            setError('Request timeout - please try refreshing the page');
          }
        }, 10000); // 10 second timeout
        
        const offset = (currentPage - 1) * videosPerPage;
        
        // Build query parameters
        const params = new URLSearchParams({
          type: 'video',
          limit: videosPerPage.toString(),
          offset: offset.toString(),
          sort: sortBy
        });
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        
        if (selectedThemes.length > 0) {
          params.append('themes', selectedThemes.join(','));
        }
        
        if (selectedFormats.length > 0) {
          params.append('formats', selectedFormats.join(','));
        }
        
        if (selectedDuration !== 'all') {
          params.append('duration', selectedDuration);
        }
        
        if (selectedViewRange !== 'all') {
          params.append('viewRange', selectedViewRange);
        }
        
        const apiUrl = `/api/unified-search?q=&types=video&limit=${videosPerPage}&offset=${offset}${searchQuery.trim() ? `&q=${encodeURIComponent(searchQuery.trim())}` : ''}`;
        console.log('🎬 Fetching videos from SQLite via unified search:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-cache' // Prevent caching issues
        });
        
        console.log('🎬 Response status:', response.status, response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🎬 Response data:', {
          success: data.success,
          resultsLength: data.data?.results?.length || 0,
          totalResults: data.data?.total_results || 0,
          hasData: !!data.data
        });
        
        if (data.success && data.data && data.data.results) {
          const videoContent = data.data.results; // Unified search results
          console.log('🎬 Videos from SQLite:', videoContent.length);
          
          // Transform unified search results to match video interface
          const transformedVideos = videoContent.map((result: any) => ({
            id: result.id,
            title: result.title,
            description: result.description,
            type: result.type,
            source: result.metadata?.source || 'content',
            url: result.url,
            metadata: {
              duration: result.metadata?.duration,
              viewCount: result.metadata?.viewCount || 0,
              likeCount: result.metadata?.likeCount || 0,
              commentCount: result.metadata?.commentCount || 0,
              thumbnails: result.metadata?.thumbnails || {},
              channelTitle: result.metadata?.channelTitle || 'IMAGI-NATION TV',
              publishedDate: result.created_at,
              platform: result.metadata?.platform || 'Video'
            },
            themes: result.metadata?.themes || []
          }));
          
          if (isMounted) {
            setVideos(transformedVideos);
            setTotalVideos(data.data.total_results || transformedVideos.length);
            setHasMore((currentPage * videosPerPage) < (data.data.total_results || transformedVideos.length));
            setError(null);
          }
        } else {
          console.error('🎬 API returned unsuccessful response:', data);
          if (isMounted) {
            setError(`API Error: ${data.error || 'Invalid response format'}`);
          }
        }
      } catch (err) {
        console.error('🎬 Error fetching videos:', err);
        console.log('🎬 Attempting simplified fallback...');
        
        // Fallback: Try a simpler API call
        try {
          const fallbackResponse = await fetch('/api/debug-videos?limit=10', { cache: 'no-cache' });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.realApiWorking && fallbackData.realApiResponse.videoCount > 0) {
              console.log('🎬 Fallback indicates API is working, trying one more time...');
              // Show a helpful error message since we know the API works
              if (isMounted) {
                setError('Loading failed, but videos are available. Please refresh the page.');
              }
            } else {
              if (isMounted) {
                setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
              }
            }
          }
        } catch (fallbackErr) {
          console.error('🎬 Fallback also failed:', fallbackErr);
          if (isMounted) {
            setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      } finally {
        console.log('🎬 Setting loading to false');
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVideos();
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [currentPage, searchQuery, sortBy, selectedThemes, selectedFormats, selectedDuration, selectedViewRange]);

  const formatDuration = (duration: string) => {
    // Convert PT25M30S to "25:30"
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes(prev => {
      const updated = prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId];
      setCurrentPage(1); // Reset to first page
      return updated;
    });
  };

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => {
      const updated = prev.includes(formatId)
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId];
      setCurrentPage(1); // Reset to first page
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedThemes([]);
    setSelectedFormats([]);
    setSelectedDuration('all');
    setSelectedViewRange('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedThemes.length > 0 || selectedFormats.length > 0 || 
    selectedDuration !== 'all' || selectedViewRange !== 'all' || searchQuery.trim();

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (sortBy !== 'date') params.set('sort', sortBy);
    if (selectedThemes.length > 0) params.set('themes', selectedThemes.join(','));
    if (selectedFormats.length > 0) params.set('formats', selectedFormats.join(','));
    if (selectedDuration !== 'all') params.set('duration', selectedDuration);
    if (selectedViewRange !== 'all') params.set('viewRange', selectedViewRange);
    
    const newURL = params.toString() ? `?${params.toString()}` : '/content/videos';
    router.replace(newURL, { scroll: false });
  };

  // Update URL when any filter changes
  useEffect(() => {
    updateURL();
  }, [searchQuery, sortBy, selectedThemes, selectedFormats, selectedDuration, selectedViewRange]);

  const loadMoreVideos = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const offset = (nextPage - 1) * videosPerPage;
      
      const params = new URLSearchParams({
        type: 'video',
        limit: videosPerPage.toString(),
        offset: offset.toString(),
        sort: sortBy
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      if (selectedThemes.length > 0) {
        params.append('themes', selectedThemes.join(','));
      }
      
      if (selectedFormats.length > 0) {
        params.append('formats', selectedFormats.join(','));
      }
      
      if (selectedDuration !== 'all') {
        params.append('duration', selectedDuration);
      }
      
      if (selectedViewRange !== 'all') {
        params.append('viewRange', selectedViewRange);
      }
      
      const apiUrl = `/api/unified-search?q=&types=video&limit=${videosPerPage}&offset=${(nextPage - 1) * videosPerPage}${searchQuery.trim() ? `&q=${encodeURIComponent(searchQuery.trim())}` : ''}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success && data.data?.results) {
        const transformedVideos = data.data.results.map((result: any) => ({
          id: result.id,
          title: result.title,
          description: result.description,
          type: result.type,
          source: result.metadata?.source || 'content',
          url: result.url,
          metadata: {
            duration: result.metadata?.duration,
            viewCount: result.metadata?.viewCount || 0,
            likeCount: result.metadata?.likeCount || 0,
            commentCount: result.metadata?.commentCount || 0,
            thumbnails: result.metadata?.thumbnails || {},
            channelTitle: result.metadata?.channelTitle || 'IMAGI-NATION TV',
            publishedDate: result.created_at,
            platform: result.metadata?.platform || 'Video'
          },
          themes: result.metadata?.themes || []
        }));
        setVideos(prev => [...prev, ...transformedVideos]);
        setCurrentPage(nextPage);
        setHasMore((nextPage * videosPerPage) < (data.data.total_results || 0));
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Videos</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">
            IMAGI-NATION TV Archive
          </h1>
          <p className="text-gray-700 max-w-4xl">
            Episodes from IMAGI-NATION TV featuring conversations about education transformation, 
            Indigenous custodianship, youth leadership, and imagination in action.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">
          {/* Advanced Search and Filter Controls */}
          <div className="mb-8 border border-gray-300 bg-gray-50">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-300 bg-white">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search videos
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by title, description, or keywords..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:w-48">
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'title')}
                    className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Most Recent</option>
                    <option value="views">Most Viewed</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
                
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 text-sm font-medium border ${
                      showFilters || hasActiveFilters
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {hasActiveFilters ? `Filters (${selectedThemes.length + selectedFormats.length + (selectedDuration !== 'all' ? 1 : 0) + (selectedViewRange !== 'all' ? 1 : 0)})` : 'Filters'}
                  </button>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-white"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="p-6 space-y-6">
                {/* Theme Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Content Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {themeOptions.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => toggleTheme(theme.id)}
                        className={`px-3 py-1 text-xs font-medium border rounded-full ${
                          selectedThemes.includes(theme.id)
                            ? `${theme.color} border-current`
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {theme.label}
                        {selectedThemes.includes(theme.id) && ' ✓'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Content Format</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatOptions.map(format => (
                      <button
                        key={format.id}
                        onClick={() => toggleFormat(format.id)}
                        className={`px-3 py-1 text-xs font-medium border rounded ${
                          selectedFormats.includes(format.id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {format.label}
                        {selectedFormats.includes(format.id) && ' ✓'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration and View Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Video Duration</h3>
                    <select
                      value={selectedDuration}
                      onChange={(e) => {
                        setSelectedDuration(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {durationOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Popularity</h3>
                    <select
                      value={selectedViewRange}
                      onChange={(e) => {
                        setSelectedViewRange(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {viewRangeOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading videos...</p>
            </div>
          )}

          {error && (
            <div className="border border-gray-300 p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">Error loading videos</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-blue-600 underline hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="border border-gray-300 p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">No videos found</h3>
              <p className="text-gray-700 mb-4">
                Video content is being processed and will be available here soon.
              </p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Found {totalVideos} videos • Showing {videos.length} videos (Page {currentPage} of {Math.ceil(totalVideos / videosPerPage)})
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Real YouTube data active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="border border-gray-300 bg-white">
                    {/* Video Thumbnail */}
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        {video.metadata?.thumbnails?.medium?.url ? (
                          <img 
                            src={video.metadata.thumbnails.medium.url} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-500 text-4xl">🎥</div>
                        )}
                      </div>
                      
                      {/* Duration overlay */}
                      {video.metadata?.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1">
                          {formatDuration(video.metadata.duration)}
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-black mb-2 line-clamp-2">
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {video.title}
                        </a>
                      </h3>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                        {video.description}
                      </p>

                      {/* Channel and stats */}
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span>{video.metadata?.channelTitle || 'IMAGI-NATION TV'}</span>
                        {video.metadata?.viewCount && (
                          <span>{formatViewCount(video.metadata.viewCount)} views</span>
                        )}
                      </div>

                      {/* Themes */}
                      {video.themes && video.themes.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {video.themes.slice(0, 3).map((theme, index) => (
                              <span 
                                key={index} 
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 border border-gray-300"
                              >
                                {theme}
                              </span>
                            ))}
                            {video.themes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{video.themes.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Engagement stats */}
                      {(video.metadata?.likeCount || video.metadata?.commentCount) && (
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          {video.metadata.likeCount && (
                            <span>👍 {formatViewCount(video.metadata.likeCount)}</span>
                          )}
                          {video.metadata.commentCount && (
                            <span>💬 {formatViewCount(video.metadata.commentCount)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 text-center border-t border-gray-300 pt-6">
                  <button
                    onClick={loadMoreVideos}
                    disabled={loadingMore}
                    className={`px-8 py-3 border border-gray-300 text-sm font-medium ${
                      loadingMore
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Loading more videos...
                      </div>
                    ) : (
                      'Load More Videos'
                    )}
                  </button>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    Showing {videos.length} of {totalVideos} videos
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Browse through all videos from the @aimementoring YouTube channel
                  </div>
                </div>
              )}
              
              {!hasMore && videos.length > 0 && (
                <div className="mt-8 text-center border-t border-gray-300 pt-6">
                  <div className="text-sm text-gray-600 mb-2">
                    ✅ You've reached the end! All {totalVideos} videos loaded.
                  </div>
                  <div className="text-xs text-gray-500">
                    Use search above to find specific content
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Floating Hoodie Preview */}
      {showHoodiePreview && hoodie && (
        <HoodiePreview 
          hoodie={hoodie}
          mode="floating"
          showActions={true}
          onInteraction={(action, hoodie) => {
            if (action === 'dismiss') {
              setShowHoodiePreview(false);
            } else if (action === 'learn') {
              router.push('/hoodie-exchange');
            }
          }}
        />
      )}
    </div>
  );
}