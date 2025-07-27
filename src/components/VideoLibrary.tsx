'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { VideoCard } from './VideoComponents';

interface VideoLibraryProps {
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showSorting?: boolean;
  layout?: 'grid' | 'list' | 'masonry';
  maxVideos?: number;
}

interface FilterOptions {
  contentType: string[];
  themes: string[];
  programs: string[];
  ageGroups: string[];
  culturalContexts: string[];
  duration: string;
  hasTranscription: boolean | null;
  hasWisdomExtracts: boolean | null;
  quality: string;
}

interface SortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'publishedAt', label: 'Recently Published', direction: 'desc' },
  { key: 'viewCount', label: 'Most Viewed', direction: 'desc' },
  { key: 'wisdomExtractsCount', label: 'Most Insights', direction: 'desc' },
  { key: 'title', label: 'Alphabetical', direction: 'asc' },
  { key: 'duration', label: 'Duration (Short to Long)', direction: 'asc' },
  { key: 'duration', label: 'Duration (Long to Short)', direction: 'desc' },
  { key: 'episodeNumber', label: 'Episode Order', direction: 'asc' }
];

const CONTENT_TYPES = [
  { key: 'educational', label: '📚 Educational', description: 'Learning-focused content' },
  { key: 'inspirational', label: '✨ Inspirational', description: 'Motivational and uplifting' },
  { key: 'interview', label: '🎤 Interviews', description: 'Conversations with leaders' },
  { key: 'workshop', label: '🛠️ Workshops', description: 'Hands-on learning sessions' },
  { key: 'documentary', label: '🎬 Documentaries', description: 'In-depth storytelling' },
  { key: 'event', label: '🎪 Events', description: 'Conferences and gatherings' }
];

const THEMES = [
  { key: 'imagination', label: '🌟 Imagination', color: 'purple' },
  { key: 'mentoring', label: '🤝 Mentoring', color: 'blue' },
  { key: 'indigenous-wisdom', label: '🧿 Indigenous Wisdom', color: 'orange' },
  { key: 'systems-thinking', label: '🌐 Systems Thinking', color: 'green' },
  { key: 'youth-leadership', label: '👥 Youth Leadership', color: 'indigo' },
  { key: 'education', label: '📖 Education', color: 'red' },
  { key: 'community', label: '🏘️ Community', color: 'yellow' },
  { key: 'innovation', label: '💡 Innovation', color: 'pink' },
  { key: 'social-change', label: '⚡ Social Change', color: 'teal' },
  { key: 'economics', label: '💰 Economics', color: 'gray' }
];

const PROGRAMS = [
  { key: 'imagination-tv', label: 'IMAGI-NATION TV' },
  { key: 'imagi-labs', label: 'IMAGI-Labs' },
  { key: 'mentoring', label: 'Mentoring Program' },
  { key: 'joy-corps', label: 'Joy Corps' },
  { key: 'custodians', label: 'Custodians' },
  { key: 'citizens', label: 'Citizens' },
  { key: 'presidents', label: 'Presidents' },
  { key: 'hoodie-economics', label: 'Hoodie Economics' },
  { key: 'systems-residency', label: 'Systems Residency' }
];

export function VideoLibrary({
  title = "Video Library",
  showFilters = true,
  showSearch = true,
  showSorting = true,
  layout = 'grid',
  maxVideos = 100
}: VideoLibraryProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS[0]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    contentType: [],
    themes: [],
    programs: [],
    ageGroups: [],
    culturalContexts: [],
    duration: 'any',
    hasTranscription: null,
    hasWisdomExtracts: null,
    quality: 'any'
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/imagination-tv/episodes?limit=${maxVideos}&includeSegments=false&includeWisdom=false&includeAnalytics=true`);
      const data = await response.json();
      
      if (data.success && data.data.episodes) {
        setVideos(data.data.episodes);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = [...videos];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.themes?.some((theme: string) => theme.toLowerCase().includes(query)) ||
        video.keyTopics?.some((topic: string) => topic.toLowerCase().includes(query))
      );
    }

    // Apply content type filter
    if (filters.contentType.length > 0) {
      filtered = filtered.filter(video =>
        filters.contentType.includes(video.contentType)
      );
    }

    // Apply theme filter
    if (filters.themes.length > 0) {
      filtered = filtered.filter(video =>
        video.themes?.some((theme: string) => filters.themes.includes(theme))
      );
    }

    // Apply program filter
    if (filters.programs.length > 0) {
      filtered = filtered.filter(video =>
        video.programs?.some((program: string) => filters.programs.includes(program))
      );
    }

    // Apply age group filter
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(video =>
        video.ageGroups?.some((age: string) => filters.ageGroups.includes(age))
      );
    }

    // Apply cultural context filter
    if (filters.culturalContexts.length > 0) {
      filtered = filtered.filter(video =>
        video.culturalContexts?.some((context: string) => filters.culturalContexts.includes(context))
      );
    }

    // Apply duration filter
    if (filters.duration !== 'any') {
      filtered = filtered.filter(video => {
        const duration = parseDuration(video.duration);
        switch (filters.duration) {
          case 'short': return duration < 600; // < 10 min
          case 'medium': return duration >= 600 && duration < 1800; // 10-30 min
          case 'long': return duration >= 1800; // > 30 min
          default: return true;
        }
      });
    }

    // Apply transcription filter
    if (filters.hasTranscription !== null) {
      filtered = filtered.filter(video =>
        video.hasTranscription === filters.hasTranscription
      );
    }

    // Apply wisdom extracts filter
    if (filters.hasWisdomExtracts !== null) {
      filtered = filtered.filter(video => {
        const hasWisdom = (video.wisdomExtractsCount || 0) > 0;
        return hasWisdom === filters.hasWisdomExtracts;
      });
    }

    // Apply quality filter
    if (filters.quality !== 'any') {
      filtered = filtered.filter(video => {
        const score = calculateQualityScore(video);
        switch (filters.quality) {
          case 'high': return score >= 0.8;
          case 'medium': return score >= 0.6 && score < 0.8;
          case 'low': return score < 0.6;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy.key) {
        case 'publishedAt':
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
          break;
        case 'viewCount':
          aValue = a.viewCount || 0;
          bValue = b.viewCount || 0;
          break;
        case 'wisdomExtractsCount':
          aValue = a.wisdomExtractsCount || 0;
          bValue = b.wisdomExtractsCount || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'duration':
          aValue = parseDuration(a.duration);
          bValue = parseDuration(b.duration);
          break;
        case 'episodeNumber':
          aValue = a.episodeNumber || 0;
          bValue = b.episodeNumber || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [videos, searchQuery, filters, sortBy]);

  const parseDuration = (duration: string): number => {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  };

  const calculateQualityScore = (video: any): number => {
    let score = 0.5;
    
    if (video.description && video.description.length > 100) score += 0.1;
    if (video.hasTranscription) score += 0.15;
    if (video.wisdomExtractsCount > 0) score += 0.15;
    if (video.learningObjectives && video.learningObjectives.length > 0) score += 0.1;
    if (video.themes && video.themes.length > 2) score += 0.1;
    if (video.viewCount > 100) score += 0.05;
    
    return Math.min(score, 1.0);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFilterValue = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      const updated = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [key]: updated
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      contentType: [],
      themes: [],
      programs: [],
      ageGroups: [],
      culturalContexts: [],
      duration: 'any',
      hasTranscription: null,
      hasWisdomExtracts: null,
      quality: 'any'
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.contentType.length > 0) count++;
    if (filters.themes.length > 0) count++;
    if (filters.programs.length > 0) count++;
    if (filters.ageGroups.length > 0) count++;
    if (filters.culturalContexts.length > 0) count++;
    if (filters.duration !== 'any') count++;
    if (filters.hasTranscription !== null) count++;
    if (filters.hasWisdomExtracts !== null) count++;
    if (filters.quality !== 'any') count++;
    if (searchQuery) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
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
            {getActiveFilterCount() > 0 && (
              <span className="ml-2">
                ({getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active)
              </span>
            )}
          </p>
        </div>
        
        {showSorting && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={`${sortBy.key}-${sortBy.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-');
                setSortBy({ key, label: '', direction: direction as 'asc' | 'desc' });
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={`${option.key}-${option.direction}`} value={`${option.key}-${option.direction}`}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search videos by title, description, themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFiltersPanel || getActiveFilterCount() > 0
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🔍 Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
              
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content Type Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Content Type</h4>
              <div className="space-y-2">
                {CONTENT_TYPES.map((type) => (
                  <label key={type.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.contentType.includes(type.key)}
                      onChange={() => toggleFilterValue('contentType', type.key)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Themes Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Themes</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {THEMES.map((theme) => (
                  <label key={theme.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.themes.includes(theme.key)}
                      onChange={() => toggleFilterValue('themes', theme.key)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{theme.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Programs Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Programs</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {PROGRAMS.map((program) => (
                  <label key={program.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.programs.includes(program.key)}
                      onChange={() => toggleFilterValue('programs', program.key)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{program.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-200">
            {/* Duration Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
              <select
                value={filters.duration}
                onChange={(e) => updateFilter('duration', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="any">Any duration</option>
                <option value="short">Short (< 10 min)</option>
                <option value="medium">Medium (10-30 min)</option>
                <option value="long">Long (> 30 min)</option>
              </select>
            </div>

            {/* Quality Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quality</h4>
              <select
                value={filters.quality}
                onChange={(e) => updateFilter('quality', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="any">Any quality</option>
                <option value="high">High quality</option>
                <option value="medium">Medium quality</option>
                <option value="low">Lower quality</option>
              </select>
            </div>

            {/* Transcription Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Accessibility</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasTranscription === true}
                    onChange={(e) => updateFilter('hasTranscription', e.target.checked ? true : null)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Has transcription</span>
                </label>
              </div>
            </div>

            {/* Wisdom Extracts Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Learning Features</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasWisdomExtracts === true}
                    onChange={(e) => updateFilter('hasWisdomExtracts', e.target.checked ? true : null)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Has wisdom insights</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      {filteredAndSortedVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📺</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600 mb-4">
            {getActiveFilterCount() > 0 
              ? 'Try adjusting your filters or search terms.'
              : 'No videos are available at the moment.'
            }
          </p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className={
          layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
          layout === 'list' ? 'space-y-4' :
          'columns-1 md:columns-2 lg:columns-3 gap-6'
        }>
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
    </div>
  );
}