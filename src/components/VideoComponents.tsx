'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Video card component for displaying episodes in grids/lists
export interface VideoCardProps {
  episode: {
    id: string;
    title: string;
    description: string;
    episodeNumber: number;
    season?: number;
    thumbnailUrl: string;
    duration: string;
    publishedAt: string;
    viewCount: number;
    wisdomExtractsCount: number;
    themes: string[];
    status: 'published' | 'coming-soon' | 'preview';
  };
  variant?: 'card' | 'compact' | 'featured';
  showStats?: boolean;
  showThemes?: boolean;
}

export function VideoCard({ 
  episode, 
  variant = 'card', 
  showStats = true, 
  showThemes = true 
}: VideoCardProps) {
  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0m';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800 border-green-200',
      'coming-soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      preview: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status === 'coming-soon' ? 'Coming Soon' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (variant === 'compact') {
    return (
      <Link href={`/apps/imagination-tv?episode=${episode.id}`} className="block">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={episode.thumbnailUrl} 
              alt={episode.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwyNiAyMkwyNCAyNEwyMiAyMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
              }}
            />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {formatDuration(episode.duration)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              Episode {episode.episodeNumber}: {episode.title}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              {showStats && (
                <>
                  <span>{episode.viewCount.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{episode.wisdomExtractsCount} insights</span>
                </>
              )}
            </div>
          </div>
          {getStatusBadge(episode.status)}
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/apps/imagination-tv?episode=${episode.id}`} className="block group">
        <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all overflow-hidden">
          <div className="relative aspect-video">
            <img 
              src={episode.thumbnailUrl} 
              alt={episode.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTYwIDg4TDE0NCAxMDRMMTI4IDg4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
            <div className="absolute top-3 left-3">
              {getStatusBadge(episode.status)}
            </div>
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
              {formatDuration(episode.duration)}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-2xl text-purple-600">▶️</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                Episode {episode.episodeNumber}: {episode.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {episode.description}
            </p>
            
            {showThemes && episode.themes.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {episode.themes.slice(0, 3).map((theme, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {theme.replace('-', ' ')}
                    </span>
                  ))}
                  {episode.themes.length > 3 && (
                    <span className="text-xs text-gray-500">+{episode.themes.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
            
            {showStats && (
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{episode.viewCount.toLocaleString()} views</span>
                  <span>{episode.wisdomExtractsCount} insights</span>
                </div>
                <span>{new Date(episode.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <Link href={`/apps/imagination-tv?episode=${episode.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all overflow-hidden">
        <div className="relative aspect-video">
          <img 
            src={episode.thumbnailUrl} 
            alt={episode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTYwIDg4TDE0NCAxMDRMMTI4IDg4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
            }}
          />
          <div className="absolute top-2 left-2">
            {getStatusBadge(episode.status)}
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(episode.duration)}
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
            Episode {episode.episodeNumber}: {episode.title}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {episode.description}
          </p>
          
          {showThemes && episode.themes.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {episode.themes.slice(0, 2).map((theme, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {theme.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{episode.viewCount.toLocaleString()} views</span>
              <span>{episode.wisdomExtractsCount} insights</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Video feed component for homepage/discover integration
export interface VideoFeedProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showHeader?: boolean;
  variant?: 'grid' | 'horizontal' | 'compact';
  filter?: 'latest' | 'popular' | 'featured';
}

export function VideoFeed({ 
  title = "IMAGI-NATION TV", 
  subtitle = "Video learning experiences",
  limit = 6,
  showHeader = true,
  variant = 'grid',
  filter = 'latest'
}: VideoFeedProps) {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEpisodes();
  }, [limit, filter]);

  const loadEpisodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/imagination-tv/episodes?limit=${limit}&status=published`);
      const data = await response.json();
      
      if (data.success && data.data.episodes) {
        let sortedEpisodes = data.data.episodes;
        
        // Apply filtering
        if (filter === 'popular') {
          sortedEpisodes = sortedEpisodes.sort((a: any, b: any) => b.viewCount - a.viewCount);
        } else if (filter === 'featured') {
          // Featured episodes could be manually curated or highest engagement
          sortedEpisodes = sortedEpisodes.sort((a: any, b: any) => 
            (b.viewCount + b.wisdomExtractsCount * 100) - (a.viewCount + a.wisdomExtractsCount * 100)
          );
        } else {
          // Latest by default
          sortedEpisodes = sortedEpisodes.sort((a: any, b: any) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        }
        
        setEpisodes(sortedEpisodes.slice(0, limit));
      } else {
        setError('Failed to load episodes');
      }
    } catch (error) {
      console.error('Failed to load video episodes:', error);
      setError('Failed to load episodes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        )}
        <div className={variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                        variant === 'horizontal' ? 'flex space-x-4 overflow-x-auto pb-4' : 
                        'space-y-3'}>
          {Array.from({ length: limit }).map((_, i) => (
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

  if (error || episodes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">📺</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error ? 'Failed to load episodes' : 'No episodes available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {error ? 'Please try again later.' : 'Check back soon for new content.'}
        </p>
        {error && (
          <button 
            onClick={loadEpisodes}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <Link 
            href="/apps/imagination-tv" 
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View all</span>
            <span>→</span>
          </Link>
        </div>
      )}
      
      <div className={
        variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
        variant === 'horizontal' ? 'flex space-x-4 overflow-x-auto pb-4' : 
        'space-y-3'
      }>
        {episodes.map((episode) => (
          <VideoCard 
            key={episode.id}
            episode={episode}
            variant={variant === 'compact' ? 'compact' : variant === 'horizontal' ? 'card' : 'card'}
            showStats={variant !== 'compact'}
            showThemes={variant !== 'compact'}
          />
        ))}
      </div>
    </div>
  );
}

// Wisdom insights widget
export interface WisdomInsightProps {
  episodeId?: string;
  limit?: number;
  themes?: string[];
}

export function WisdomInsights({ episodeId, limit = 3, themes = [] }: WisdomInsightProps) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [episodeId, limit, themes]);

  const loadInsights = async () => {
    setLoading(true);
    
    try {
      // This would fetch wisdom extracts from the API
      // For now, mock some data
      const mockInsights = [
        {
          id: 'wisdom-1',
          content: 'Seven generation thinking asks us to consider the impact of our decisions on seven generations into the future.',
          extractType: 'indigenous-wisdom',
          episodeTitle: 'Welcome to the Movement',
          confidence: 0.95
        },
        {
          id: 'wisdom-2', 
          content: 'The most powerful transformations happen when we start with relationship.',
          extractType: 'mentoring-insight',
          episodeTitle: 'Mentoring & Relationship Building',
          confidence: 0.92
        },
        {
          id: 'wisdom-3',
          content: 'Imagination is not just about dreaming - it\'s about seeing systems differently.',
          extractType: 'systems-thinking',
          episodeTitle: 'Systems Thinking & Indigenous Knowledge',
          confidence: 0.88
        }
      ];
      
      setInsights(mockInsights.slice(0, limit));
    } catch (error) {
      console.error('Failed to load wisdom insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      'indigenous-wisdom': '🧿',
      'systems-thinking': '🌐',
      'mentoring-insight': '🤝',
      'principle': '⭐',
      'story': '📚',
      'methodology': '🔧'
    };
    return icons[type as keyof typeof icons] || '💡';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <span>💡</span>
        <span>Wisdom Insights</span>
      </h3>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-start space-x-3">
              <span className="text-xl">{getInsightIcon(insight.extractType)}</span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-2">"{insight.content}"</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>From: {insight.episodeTitle}</span>
                  <span className="bg-white px-2 py-1 rounded text-xs">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link 
        href="/apps/imagination-tv" 
        className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium text-sm"
      >
        <span>Explore all insights</span>
        <span>→</span>
      </Link>
    </div>
  );
}