'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { VideoCard } from './VideoComponents';
import { KnowledgeHubIntegration } from './KnowledgeHubIntegration';

interface VideoLibraryProps {
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showSorting?: boolean;
  layout?: 'grid' | 'list' | 'masonry';
  maxVideos?: number;
}

interface FilterState {
  program: string;
  theme: string;
  contentType: string;
  culturalContext: string;
  ageGroup: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function VideoLibrary({
  title = "Video Library",
  showFilters = true,
  showSearch = true,
  showSorting = true,
  layout = 'grid',
  maxVideos = 1000
}: VideoLibraryProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    program: 'all',
    theme: 'all',
    contentType: 'all',
    culturalContext: 'all',
    ageGroup: 'all',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/imagination-tv/episodes?limit=${maxVideos}&includeSegments=false&includeWisdom=false&includeAnalytics=true`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.episodes) {
        setVideos(data.data.episodes);
      } else {
        console.error('❌ API response not successful or no episodes found:', data);
        setVideos([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error('❌ Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define filter options based on our video analysis
  const filterOptions = useMemo(() => ({
    programs: [
      { value: 'all', label: 'All Programs', count: videos.length },
      { value: 'imagination-tv', label: '📺 IMAGI-NATION TV', count: videos.filter(v => v.title?.includes('IMAGI-NATION{TV}')).length },
      { value: 'aime-tv', label: '🎬 AIME TV', count: videos.filter(v => JSON.stringify(v.programs || []).includes('aime-core') || v.title?.toLowerCase().includes('aime tv')).length },
      { value: 'imagi-labs', label: '🧪 IMAGI-NATION LABS', count: videos.filter(v => v.title?.includes('IMAGI-NATION {LABS}')).length },
      { value: 'imagi-university', label: '🎓 IMAGI-NATION UNIVERSITY', count: videos.filter(v => v.title?.includes('IMAGI-NATION {University}') || v.title?.includes('IMAGI-NATION {UNIVERSITY}')).length },
      { value: 'hoodie-economics', label: '👥 Hoodie Economics', count: videos.filter(v => JSON.stringify(v.themes || []).includes('kindness-economics') || v.title?.toLowerCase().includes('hoodie')).length },
      { value: 'youtube-mentoring', label: '🤝 AIME Mentoring (YouTube)', count: videos.filter(v => v.id?.startsWith('aime-all-')).length }
    ],
    themes: [
      { value: 'all', label: 'All Themes' },
      { value: 'imagination', label: '✨ Imagination & Creativity' },
      { value: 'mentoring', label: '🤝 Mentoring & Relationships' },
      { value: 'indigenous-wisdom', label: '🧿 Indigenous Wisdom' },
      { value: 'education', label: '📚 Education & Learning' },
      { value: 'systems-thinking', label: '🌐 Systems Thinking' },
      { value: 'youth-leadership', label: '🌟 Youth Leadership' },
      { value: 'community', label: '🏘️ Community Building' },
      { value: 'innovation', label: '💡 Innovation & Change' },
      { value: 'storytelling', label: '📖 Storytelling' },
      { value: 'entrepreneurship', label: '🚀 Entrepreneurship' }
    ],
    contentTypes: [
      { value: 'all', label: 'All Content Types' },
      { value: 'educational', label: '📚 Educational' },
      { value: 'interview', label: '🎤 Interview' },
      { value: 'workshop', label: '🛠️ Workshop' },
      { value: 'documentary', label: '🎬 Documentary' },
      { value: 'inspirational', label: '⭐ Inspirational' },
      { value: 'keynote', label: '🎯 Keynote' }
    ],
    sortOptions: [
      { value: 'publishedAt', label: 'Recently Published' },
      { value: 'title', label: 'Title A-Z' },
      { value: 'viewCount', label: 'Most Popular' },
      { value: 'wisdomExtractsCount', label: 'Most Insights' },
      { value: 'duration', label: 'Duration' }
    ]
  }), [videos]);

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videos;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.themes?.some((theme: string) => theme.toLowerCase().includes(query)) ||
        video.keyTopics?.some((topic: string) => topic.toLowerCase().includes(query))
      );
    }

    // Apply program filter
    if (filters.program !== 'all') {
      filtered = filtered.filter(video => {
        switch (filters.program) {
          case 'imagination-tv':
            return video.title?.includes('IMAGI-NATION{TV}');
          case 'aime-tv':
            return JSON.stringify(video.programs || []).includes('aime-core') || 
                   video.title?.toLowerCase().includes('aime tv');
          case 'imagi-labs':
            return video.title?.includes('IMAGI-NATION {LABS}');
          case 'imagi-university':
            return video.title?.includes('IMAGI-NATION {University}') || 
                   video.title?.includes('IMAGI-NATION {UNIVERSITY}');
          case 'hoodie-economics':
            return JSON.stringify(video.themes || []).includes('kindness-economics') || 
                   video.title?.toLowerCase().includes('hoodie');
          case 'youtube-mentoring':
            return video.id?.startsWith('aime-all-');
          default:
            return true;
        }
      });
    }

    // Apply theme filter
    if (filters.theme !== 'all') {
      filtered = filtered.filter(video => {
        const themes = video.themes || [];
        const title = video.title?.toLowerCase() || '';
        const description = video.description?.toLowerCase() || '';
        
        switch (filters.theme) {
          case 'imagination':
            return themes.includes('imagination') || title.includes('imagination') || title.includes('creative');
          case 'mentoring':
            return themes.includes('mentoring') || title.includes('mentor');
          case 'indigenous-wisdom':
            return themes.includes('indigenous-wisdom') || title.includes('indigenous') || description.includes('indigenous');
          case 'education':
            return themes.includes('education') || title.includes('education') || title.includes('learning');
          case 'systems-thinking':
            return themes.includes('systems-thinking') || title.includes('systems') || description.includes('systems');
          case 'youth-leadership':
            return themes.includes('youth-leadership') || title.includes('youth') || title.includes('young');
          case 'community':
            return themes.includes('community') || title.includes('community');
          case 'innovation':
            return themes.includes('innovation') || title.includes('innovation') || title.includes('miracle');
          case 'storytelling':
            return title.includes('story') || description.includes('story');
          case 'entrepreneurship':
            return title.includes('entrepreneur') || description.includes('entrepreneur');
          default:
            return true;
        }
      });
    }

    // Apply content type filter
    if (filters.contentType !== 'all') {
      filtered = filtered.filter(video => {
        const contentType = video.contentType || 'educational';
        const title = video.title?.toLowerCase() || '';
        
        switch (filters.contentType) {
          case 'educational':
            return contentType === 'educational';
          case 'interview':
            return contentType === 'interview' || title.includes('interview') || title.includes('speaks');
          case 'workshop':
            return contentType === 'workshop' || title.includes('workshop') || title.includes('training');
          case 'documentary':
            return contentType === 'documentary' || title.includes('documentary');
          case 'inspirational':
            return contentType === 'inspirational' || title.includes('inspiration');
          case 'keynote':
            return title.includes('keynote');
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'publishedAt':
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'viewCount':
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        case 'wisdomExtractsCount':
          comparison = (a.wisdomExtractsCount || 0) - (b.wisdomExtractsCount || 0);
          break;
        case 'duration':
          comparison = (a.durationSeconds || 0) - (b.durationSeconds || 0);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [videos, searchQuery, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      program: 'all',
      theme: 'all',
      contentType: 'all',
      culturalContext: 'all',
      ageGroup: 'all',
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedVideos.length} of {videos.length} videos
            {(filters.program !== 'all' || filters.theme !== 'all' || filters.contentType !== 'all' || searchQuery) && (
              <button 
                onClick={clearFilters}
                className="ml-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search videos, themes, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      )}

      {/* Amazing Filter System */}
      {showFilters && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          {/* Top-line Program Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🎬</span>
              AIME Programs & Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.programs.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('program', option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.program === option.value
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filters.program === option.value 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Theme Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎭 Themes & Topics
              </label>
              <select
                value={filters.theme}
                onChange={(e) => updateFilter('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
              >
                {filterOptions.themes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📺 Content Type
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => updateFilter('contentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
              >
                {filterOptions.contentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
                >
                  {filterOptions.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:border-purple-500"
                  title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Insights */}
          {filteredAndSortedVideos.length > 0 && filteredAndSortedVideos.length !== videos.length && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredAndSortedVideos.length}
                  </div>
                  <div className="text-xs text-gray-600">Videos Found</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((filteredAndSortedVideos.length / videos.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">of Collection</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(filteredAndSortedVideos.reduce((acc, v) => acc + (v.durationSeconds || 0), 0) / 3600)}h
                  </div>
                  <div className="text-xs text-gray-600">Total Duration</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredAndSortedVideos.reduce((acc, v) => acc + (v.wisdomExtractsCount || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-600">Wisdom Insights</div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(filters.program !== 'all' || filters.theme !== 'all' || filters.contentType !== 'all') && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {filters.program !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filterOptions.programs.find(p => p.value === filters.program)?.label}
                    <button 
                      onClick={() => updateFilter('program', 'all')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.theme !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filterOptions.themes.find(t => t.value === filters.theme)?.label}
                    <button 
                      onClick={() => updateFilter('theme', 'all')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.contentType !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filterOptions.contentTypes.find(c => c.value === filters.contentType)?.label}
                    <button 
                      onClick={() => updateFilter('contentType', 'all')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedVideos.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 border">
          <div>
            Showing <span className="font-semibold text-gray-900">{filteredAndSortedVideos.length}</span> videos
            {searchQuery && (
              <span> matching "<span className="font-medium">{searchQuery}</span>"</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Sorted by {filterOptions.sortOptions.find(s => s.value === filters.sortBy)?.label}</span>
            <Link 
              href="/apps/imagination-tv" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to Episodes
            </Link>
          </div>
        </div>
      )}

      {/* Video Grid */}
      {filteredAndSortedVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📺</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 
              `No videos match "${searchQuery}" with the current filters.` :
              'No videos match the current filters.'
            }
          </p>
          <button 
            onClick={clearFilters}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          layout === 'list' ? 'grid-cols-1' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {filteredAndSortedVideos.map((video) => (
            <VideoCard
              key={video.id}
              episode={video}
              variant={layout === 'list' ? 'compact' : 'card'}
              showStats={true}
              showThemes={true}
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination Hint */}
      {filteredAndSortedVideos.length >= maxVideos && (
        <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <p className="text-gray-600 mb-2">
            Showing first {maxVideos} results. Use filters to narrow down your search.
          </p>
          <p className="text-sm text-gray-500">
            Total available: {videos.length} videos across all AIME programs
          </p>
        </div>
      )}

      {/* Knowledge Hub Integration */}
      <KnowledgeHubIntegration 
        currentFilter={filters.program}
        currentTheme={filters.theme}
        videoCount={filteredAndSortedVideos.length}
      />
    </div>
  );
}