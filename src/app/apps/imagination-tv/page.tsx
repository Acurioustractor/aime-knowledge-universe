'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VideoLibrary } from '@/components/VideoLibraryFixed';

interface Episode {
  id: string;
  title: string;
  description: string;
  episodeNumber: number;
  season?: number;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  status: 'published' | 'coming-soon' | 'preview';
  themes: string[];
  learningObjectives: string[];
  wisdomExtracts: number;
  hasTranscription: boolean;
  engagementData?: {
    views: number;
    discussions: number;
    reflections: number;
  };
  segments?: Array<{
    type: 'introduction' | 'story' | 'wisdom' | 'activity' | 'reflection' | 'discussion';
    startTime: number;
    endTime: number;
    title: string;
    description: string;
  }>;
}

const mockEpisodes: Episode[] = [
  {
    id: 'ep-001',
    title: 'Welcome to the Movement',
    description: 'The first episode of IMAGI-NATION TV, introducing viewers to a new way of thinking about education and systems change through Indigenous custodianship and imagination.',
    episodeNumber: 1,
    season: 1,
    duration: 'PT25M18S',
    publishedAt: '2024-01-15T10:00:00Z',
    thumbnailUrl: 'https://img.youtube.com/vi/imagi-1/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=imagi-nation-tv-1',
    status: 'published',
    themes: ['imagination', 'systems-change', 'education', 'indigenous-wisdom'],
    learningObjectives: [
      'Understand the core principles of imagination-based learning',
      'Explore the connection between Indigenous custodianship and systems thinking',
      'Identify opportunities for positive change in your community'
    ],
    wisdomExtracts: 8,
    hasTranscription: true,
    engagementData: {
      views: 45230,
      discussions: 342,
      reflections: 156
    },
    segments: [
      {
        type: 'introduction',
        startTime: 0,
        endTime: 120,
        title: 'Welcome & Vision',
        description: 'Jack Manning Bancroft welcomes viewers and shares the vision for IMAGI-NATION TV'
      },
      {
        type: 'story',
        startTime: 120,
        endTime: 480,
        title: 'The Power of Imagination',
        description: 'A story about how imagination can transform perspectives and open new possibilities'
      },
      {
        type: 'wisdom',
        startTime: 480,
        endTime: 720,
        title: 'Seven Generation Thinking',
        description: 'Indigenous custodianship about thinking seven generations ahead in decision-making'
      },
      {
        type: 'activity',
        startTime: 720,
        endTime: 960,
        title: 'Imagination Exercise',
        description: 'An interactive exercise to stretch your imagination and envision positive change'
      },
      {
        type: 'reflection',
        startTime: 960,
        endTime: 1200,
        title: 'Personal Reflection',
        description: 'Time to reflect on your role in creating positive change'
      },
      {
        type: 'discussion',
        startTime: 1200,
        endTime: 1518,
        title: 'Community Connection',
        description: 'Discussion prompts for engaging with your community about the episode themes'
      }
    ]
  },
  {
    id: 'ep-002',
    title: 'Systems Thinking & Indigenous Knowledge',
    description: 'Exploring how Indigenous knowledge systems offer powerful frameworks for understanding and navigating complexity in the modern world.',
    episodeNumber: 2,
    season: 1,
    duration: 'PT28M45S',
    publishedAt: '2024-01-22T10:00:00Z',
    thumbnailUrl: 'https://img.youtube.com/vi/imagi-2/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=imagi-nation-tv-2',
    status: 'published',
    themes: ['systems-thinking', 'indigenous-knowledge', 'complexity', 'wisdom'],
    learningObjectives: [
      'Learn about Indigenous knowledge systems and their relevance today',
      'Understand systems thinking through Indigenous frameworks',
      'Apply holistic thinking to personal and community challenges'
    ],
    wisdomExtracts: 12,
    hasTranscription: true,
    engagementData: {
      views: 38940,
      discussions: 298,
      reflections: 134
    }
  },
  {
    id: 'ep-003',
    title: 'Mentoring & Relationship Building',
    description: 'The AIME approach to mentoring: building relationships first, focusing on potential, and creating networks of support and opportunity.',
    episodeNumber: 3,
    season: 1,
    duration: 'PT24M12S',
    publishedAt: '2024-01-29T10:00:00Z',
    thumbnailUrl: 'https://img.youtube.com/vi/imagi-3/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=imagi-nation-tv-3',
    status: 'published',
    themes: ['mentoring', 'relationships', 'youth-leadership', 'potential'],
    learningObjectives: [
      'Understand relationship-first mentoring approaches',
      'Learn how to unlock potential in yourself and others',
      'Explore the power of networks and community support'
    ],
    wisdomExtracts: 9,
    hasTranscription: true,
    engagementData: {
      views: 42180,
      discussions: 387,
      reflections: 189
    }
  },
  {
    id: 'ep-004',
    title: 'Hoodie Economics & Value Creation',
    description: 'Rethinking economics through relationship and community wealth, exploring alternative models that prioritize people and planet over profit.',
    episodeNumber: 4,
    season: 1,
    duration: 'PT31M56S',
    publishedAt: '2024-02-05T10:00:00Z',
    thumbnailUrl: 'https://img.youtube.com/vi/imagi-4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=imagi-nation-tv-4',
    status: 'coming-soon',
    themes: ['hoodie-economics', 'alternative-economics', 'community-wealth', 'value-creation'],
    learningObjectives: [
      'Understand alternative economic models based on relationship',
      'Explore community wealth and shared value creation',
      'Challenge traditional notions of success and value'
    ],
    wisdomExtracts: 0,
    hasTranscription: false
  }
];

export default function ImaginationTVPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'episodes' | 'library'>('episodes');

  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      // Fetch real episodes from database API 
      const response = await fetch('/api/imagination-tv/episodes?includeSegments=true&includeWisdom=true&includeAnalytics=true');
      const data = await response.json();
      
      if (data.success && data.data.episodes) {
        // Transform API response to component format
        const transformedEpisodes = data.data.episodes.map((ep: any) => ({
          id: ep.id,
          title: ep.title,
          description: ep.description,
          episodeNumber: ep.episodeNumber,
          season: ep.season,
          duration: ep.duration,
          publishedAt: ep.publishedAt,
          thumbnailUrl: ep.thumbnailUrl,
          videoUrl: ep.videoUrl,
          status: ep.status,
          themes: ep.themes,
          learningObjectives: ep.learningObjectives,
          wisdomExtracts: ep.wisdomExtractsCount,
          hasTranscription: ep.hasTranscription,
          engagementData: {
            views: ep.viewCount,
            discussions: ep.discussionCount,
            reflections: ep.reflectionCount
          },
          segments: ep.segments ? ep.segments.map((seg: any) => ({
            type: seg.segmentType,
            startTime: seg.startTime,
            endTime: seg.endTime,
            title: seg.title,
            description: seg.description
          })) : []
        }));
        
        setEpisodes(transformedEpisodes);
        setSelectedEpisode(transformedEpisodes[0]);
        
        console.log(`📺 Loaded ${transformedEpisodes.length} real episodes from database`);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data');
        setEpisodes(mockEpisodes);
        setSelectedEpisode(mockEpisodes[0]);
      }
    } catch (error) {
      console.error('Failed to load episodes:', error);
      // Fallback to mock data
      setEpisodes(mockEpisodes);
      setSelectedEpisode(mockEpisodes[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEpisodes = episodes.filter(episode => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && episode.status === 'published') ||
      (filter === 'coming-soon' && episode.status === 'coming-soon');
    
    const matchesSearch = searchQuery === '' ||
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

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

  const getSegmentIcon = (type: string) => {
    const icons = {
      introduction: '👋',
      story: '📚',
      wisdom: '🧠',
      activity: '🎯',
      reflection: '🤔',
      discussion: '💬'
    };
    return icons[type as keyof typeof icons] || '📺';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IMAGI-NATION TV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Link href="/apps" className="text-purple-200 hover:text-white text-sm">
                  ← Back to Apps
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('episodes')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === 'episodes'
                          ? 'bg-white text-purple-700'
                          : 'text-purple-200 hover:text-white'
                      }`}
                    >
                      📺 Episodes
                    </button>
                    <button
                      onClick={() => setViewMode('library')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === 'library'
                          ? 'bg-white text-purple-700'
                          : 'text-purple-200 hover:text-white'
                      }`}
                    >
                      📚 Library
                    </button>
                  </div>
                  <Link href="/apps/imagination-tv/admin" className="text-purple-200 hover:text-white text-sm">
                    ⚙️ Admin
                  </Link>
                </div>
              </div>
              <h1 className="text-4xl font-light mb-4 flex items-center space-x-3">
                <span className="text-5xl">📺</span>
                <span>IMAGI-NATION TV</span>
              </h1>
              <p className="text-xl opacity-90 max-w-3xl">
                Interactive learning experiences that bridge Indigenous custodianship with modern challenges, 
                fostering imagination and systems thinking for positive change.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-light">457</div>
              <div className="text-sm opacity-80">Total Episodes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'library' ? (
          <VideoLibrary 
            title="Complete Video Library"
            showFilters={true}
            showSearch={true}
            showSorting={true}
            layout="grid"
            maxVideos={1000}
          />
        ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Episode Player/Details */}
          <div className="lg:col-span-2">
            {selectedEpisode ? (
              <div>
                {/* Video Player Area */}
                <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                  {selectedEpisode.status === 'published' && selectedEpisode.videoUrl && selectedEpisode.videoUrl.includes('youtube.com') ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedEpisode.videoUrl.split('watch?v=')[1]?.split('&')[0] || selectedEpisode.youtubeId}`}
                      title={selectedEpisode.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : selectedEpisode.status === 'published' ? (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📺</div>
                        <p className="text-lg">REAL AIME Video</p>
                        <p className="text-sm opacity-60 mb-4">{selectedEpisode.title}</p>
                        <a 
                          href={selectedEpisode.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block"
                        >
                          ▶️ Watch on YouTube
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🔜</div>
                        <p className="text-lg">Coming Soon</p>
                        <p className="text-sm opacity-60">This episode will be available soon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Episode Info */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Episode {selectedEpisode.episodeNumber}: {selectedEpisode.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span>{formatDuration(selectedEpisode.duration)}</span>
                        <span>•</span>
                        <span>{new Date(selectedEpisode.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        {getStatusBadge(selectedEpisode.status)}
                      </div>
                    </div>
                    {selectedEpisode.engagementData && (
                      <div className="text-right text-sm text-gray-600">
                        <div>{selectedEpisode.engagementData.views.toLocaleString()} views</div>
                        <div>{selectedEpisode.engagementData.discussions} discussions</div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedEpisode.description}
                  </p>

                  {/* Themes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEpisode.themes.map((theme, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {theme.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Learning Objectives</h4>
                    <ul className="space-y-2">
                      {selectedEpisode.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Episode Segments */}
                  {selectedEpisode.segments && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Episode Segments</h4>
                      <div className="space-y-3">
                        {selectedEpisode.segments.map((segment, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-lg">{getSegmentIcon(segment.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">{segment.title}</h5>
                                <span className="text-xs text-gray-500">
                                  {Math.floor(segment.startTime / 60)}:{(segment.startTime % 60).toString().padStart(2, '0')} - {Math.floor(segment.endTime / 60)}:{(segment.endTime % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{segment.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wisdom & Engagement Stats */}
                  {selectedEpisode.status === 'published' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-purple-600">{selectedEpisode.wisdomExtracts}</div>
                        <div className="text-xs text-gray-600">Wisdom Extracts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-blue-600">{selectedEpisode.hasTranscription ? '✅' : '⏳'}</div>
                        <div className="text-xs text-gray-600">Transcription</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-green-600">{selectedEpisode.engagementData?.discussions || 0}</div>
                        <div className="text-xs text-gray-600">Discussions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-orange-600">{selectedEpisode.engagementData?.reflections || 0}</div>
                        <div className="text-xs text-gray-600">Reflections</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Select an episode to view details</p>
              </div>
            )}
          </div>

          {/* Episode List Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Search and Filters */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search episodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 mb-3"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Episodes</option>
                  <option value="published">Published</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>

              {/* Episode List */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Episodes</h3>
                {filteredEpisodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedEpisode?.id === episode.id
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Episode {episode.episodeNumber}
                      </span>
                      {getStatusBadge(episode.status)}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {episode.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {episode.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDuration(episode.duration)}</span>
                      {episode.engagementData && (
                        <span>{episode.engagementData.views.toLocaleString()} views</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                <h4 className="font-medium mb-2">Join the Conversation</h4>
                <p className="text-sm opacity-90 mb-3">
                  Share your reflections and connect with the global AIME community.
                </p>
                <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                  Community Hub
                </button>
              </div>

              {/* Transcription Service Proposal */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🎯 Automated Transcription Service Proposal
                </h4>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">📊 Volume Analysis</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>457 published episodes</strong> in database</li>
                      <li>• ~25 minutes average length = <strong>190+ hours</strong> of content</li>
                      <li>• Currently: YouTube API videos + Vimeo from Airtable</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">⏱️ Processing Timeline</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• OpenAI Whisper API: ~1x real-time processing</li>
                      <li>• 5-10 concurrent jobs = 15-20 episodes daily</li>
                      <li>• <strong>Total timeline: 3-4 weeks</strong> for complete transcription</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">💰 Cost Estimates</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• OpenAI Whisper: $0.006/minute × 11,425 min = <strong>~$68</strong></li>
                      <li>• Processing & storage overhead = <strong>~$22-42</strong></li>
                      <li>• <strong>Total estimated cost: $90-110</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">🚀 Enhancement Value</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Searchable transcripts</strong> across entire archive</li>
                      <li>• <strong>Wisdom extraction</strong> from Indigenous knowledge content</li>
                      <li>• <strong>Knowledge connections</strong> to other AIME resources</li>
                      <li>• <strong>Enhanced discovery</strong> through natural language search</li>
                      <li>• <strong>Interactive captions</strong> with timestamp linking</li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-green-200">
                    <p className="text-xs italic text-gray-600">
                      Transform 190+ hours of Indigenous custodianship into a searchable knowledge base for under $100 in 3-4 weeks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}