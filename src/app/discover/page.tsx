'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'video' | 'business_case' | 'tool' | 'hoodie' | 'content';
  url?: string;
  metadata: Record<string, any>;
  relevance_score: number;
  created_at?: string;
}

interface ContentStats {
  knowledge_documents?: number;
  business_cases?: number;
  tools?: number;
  videos?: number;
  content?: number;
  hoodies?: number;
  total_content?: number;
}

const contentTypes = [
  { key: 'all', label: 'All Content', description: 'Browse everything' },
  { key: 'knowledge', label: 'Knowledge', description: 'Core wisdom and frameworks' },
  { key: 'business_case', label: 'Business Cases', description: 'Real-world applications' },
  { key: 'video', label: 'Videos', description: 'Visual learning content' },
  { key: 'tool', label: 'Tools', description: 'Practical resources' },
  { key: 'content', label: 'Articles', description: 'Written insights' }
];

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<ContentStats>({});
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [fallbackQuery, setFallbackQuery] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // Check for query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, []);

  const loadStats = async () => {
    try {
      // Use the unified search API to get correct stats from SQLite
      const response = await fetch('/api/unified-search?q=test&limit=1');
      const data = await response.json();
      
      if (data.success && data.data.search_stats) {
        const searchStats = data.data.search_stats.total_content;
        
        setStats({
          knowledge_documents: searchStats.knowledge_documents || 0,
          business_cases: searchStats.business_cases || 0,
          tools: searchStats.tools || 0,
          videos: searchStats.youtube_videos || 0,
          content: searchStats.content_items || 0,
          hoodies: searchStats.hoodies || 0,
          total_content: searchStats.total || 0
        });

        console.log('📊 Loaded SQLite content stats:', searchStats);
      } else {
        throw new Error('Failed to get unified search stats');
      }

    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback stats using the corrected SQLite data
      setStats({
        knowledge_documents: 0,
        business_cases: 23,
        tools: 824,
        videos: 423,
        content: 1808,
        hoodies: 100,
        total_content: 2755
      });
    }
  };

  const performSearch = async (searchQuery?: string) => {
    const rawSearchTerm = searchQuery || query;
    if (!rawSearchTerm.trim()) return;
    
    // Clean and extract key terms from the search query
    const cleanedQuery = rawSearchTerm
      .replace(/[?!.;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // Extract key terms by removing common question words
    const searchTerm = cleanedQuery
      .replace(/^(what|how|why|when|where|who)\s+(is|are|does|do|did|can|could|would|should)\s+/i, '')
      .replace(/^(what|how|why|when|where|who|is|are|does|do|did|can|could|would|should)\s+/i, '')
      .replace(/\s+(is|are|does|do|did|the|a|an)\s+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log('🔍 Starting search for:', rawSearchTerm, '-> cleaned:', searchTerm);
    setLoading(true);
    setHasSearched(true);
    setFallbackQuery(null); // Reset fallback query
    
    try {
      const typesParam = selectedTypes.includes('all') ? 'all' : selectedTypes.join(',');
      console.log('🔍 Search params:', { searchTerm, typesParam });
      
      // Try unified search with fallback strategies for better results
      console.log('🔍 Calling unified search...');
      let unifiedData = { success: false, data: { results: [], total_results: 0 } };
      
      // First try the main search term
      try {
        const unifiedResponse = await fetch(
          `/api/unified-search?q=${encodeURIComponent(searchTerm)}&types=${typesParam}&limit=50&include_chunks=true`
        );
        if (unifiedResponse.ok) {
          unifiedData = await unifiedResponse.json();
          console.log('🔍 Unified search response:', unifiedData);
        }
      } catch (error) {
        console.log('❌ Unified search failed:', error);
      }
      
      // If no results, try fallback searches with key terms
      if (!unifiedData.success || unifiedData.data.total_results === 0) {
        console.log('🔍 No results from main search, trying fallback searches...');
        
        // Extract key terms (words longer than 3 chars, excluding common words)
        const stopWords = ['how', 'does', 'what', 'where', 'when', 'who', 'why', 'guide', 'make', 'help', 'work', 'change'];
        const keyTerms = searchTerm.toLowerCase()
          .split(/\s+/)
          .filter(word => word.length > 3 && !stopWords.includes(word))
          .slice(0, 3); // Use top 3 key terms
        
        console.log('🔍 Key terms for fallback search:', keyTerms);
        
        if (keyTerms.length > 1) {
          // Try searching with key term combinations
          const fallbackQueries = [
            keyTerms.slice(0, 2).join(' '), // First 2 terms
            keyTerms[0], // Most important term
          ];
          
          for (const fallbackQuery of fallbackQueries) {
            try {
              console.log('🔍 Trying fallback search with:', fallbackQuery);
              const fallbackResponse = await fetch(
                `/api/unified-search?q=${encodeURIComponent(fallbackQuery)}&types=${typesParam}&limit=50&include_chunks=true`
              );
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                if (fallbackData.success && fallbackData.data.total_results > 0) {
                  console.log('✅ Fallback search successful with:', fallbackQuery, 'results:', fallbackData.data.total_results);
                  unifiedData = fallbackData;
                  setFallbackQuery(fallbackQuery); // Track the fallback query used
                  break; // Use first successful fallback
                }
              }
            } catch (error) {
              console.log('❌ Fallback search failed for:', fallbackQuery);
            }
          }
        }
      }
      
      // Search multiple content sources including videos
      console.log('🔍 Calling content APIs...');
      const [framingResponse, toolsResponse, businessCasesResponse, newslettersResponse, videosResponse, imaginationTvResponse] = await Promise.all([
        fetch(`/api/framing?type=search&q=${encodeURIComponent(searchTerm)}&limit=50`),
        fetch('/api/tools').then(res => res.json()).catch(() => ({ success: false })),
        fetch('/api/business-cases').then(res => res.json()).catch(() => ({ success: false })),
        fetch('/api/newsletters').then(res => res.json()).catch(() => ({ success: false })),
        fetch(`/api/youtube?q=${encodeURIComponent(searchTerm)}&limit=20`).then(res => res.json()).catch(() => ({ success: false })),
        fetch('/api/imagination-tv/episodes?limit=50&includeSegments=true&includeWisdom=true').then(res => res.json()).catch(() => ({ success: false }))
      ]);
      
      const framingData = await framingResponse.json();
      console.log('🔍 Framing API response:', framingData);
      console.log('🔍 Tools response:', toolsResponse);
      console.log('🔍 Business cases response:', businessCasesResponse);
      console.log('🔍 Newsletters response:', newslettersResponse);
      console.log('🔍 Videos response:', videosResponse);
      console.log('🔍 IMAGI-NATION TV response:', imaginationTvResponse);
      
      let allResults: SearchResult[] = [];
      let totalCount = 0;
      
      // Add unified search results if available
      if (unifiedData.success && unifiedData.data?.results) {
        console.log('✅ Adding', unifiedData.data.results.length, 'unified search results');
        allResults = [...unifiedData.data.results];
        totalCount += unifiedData.data.total_results || 0;
      } else {
        console.log('❌ No unified search results');
      }
      
      // Add framing results (knowledge documents)
      if (framingData.success && framingData.data?.results) {
        console.log('✅ Adding', framingData.data.results.length, 'framing API results');
        const framingResults = framingData.data.results.map((item: any, index: number) => ({
          id: `framing-${item.id || index}`,
          title: item.title || 'Knowledge Document',
          description: item.contentPreview ? item.contentPreview.substring(0, 300) + '...' : 
                      (item.fullContent ? item.fullContent.substring(0, 300) + '...' : 'No description available'),
          type: 'knowledge' as const,
          url: `/knowledge-synthesis#${item.id || 'content'}`,
          metadata: {
            source: 'framing',
            concepts: item.concepts || [],
            section: item.category || 'Knowledge Base',
            filename: item.filename || ''
          },
          relevance_score: item.relevance || (1 - index * 0.05),
          created_at: new Date().toISOString()
        }));
        
        allResults = [...allResults, ...framingResults];
        totalCount += framingData.data.results.length;
      } else {
        console.log('❌ No framing API results');
      }

      // Add tools results (search through tools)
      if (toolsResponse.success && toolsResponse.data) {
        const matchingTools = toolsResponse.data.filter((item: any) => 
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        console.log('✅ Adding', matchingTools.length, 'matching tools');
        const toolResults = matchingTools.map((item: any, index: number) => ({
          id: `tool-${item.id || index}`,
          title: item.title || 'Tool',
          description: item.description || 'No description available',
          type: 'tool' as const,
          url: `/tools#${item.id}`,
          metadata: {
            source: 'tools',
            category: item.category,
            tags: item.tags || [],
            fileType: item.fileType
          },
          relevance_score: 0.8 - index * 0.05,
          created_at: item.created_at || new Date().toISOString()
        }));
        
        allResults = [...allResults, ...toolResults];
        totalCount += matchingTools.length;
      }

      // Add business cases results (filter to core frameworks only)
      if (businessCasesResponse.success && businessCasesResponse.data) {
        // First filter to only core frameworks (not duplicate examples)
        const coreFrameworks = businessCasesResponse.data.filter((item: any) => 
          !item.id.includes('-') || item.id.includes('systems-residency') || item.id.includes('mentor-credit') ||
          item.id.includes('indigenous-labs') || item.id.includes('imagi-labs') || 
          item.id.includes('joy-corps') || item.id.includes('custodians') ||
          item.id.includes('citizens') || item.id.includes('presidents')
        );
        
        // Then filter by search terms
        const matchingBusinessCases = coreFrameworks.filter((item: any) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        console.log('✅ Adding', matchingBusinessCases.length, 'matching business cases');
        const businessCaseResults = matchingBusinessCases.map((item: any, index: number) => ({
          id: `business-case-${item.id || index}`,
          title: item.title || 'Business Case',
          description: item.description || item.content?.substring(0, 200) + '...' || 'No description available',
          type: 'business_case' as const,
          url: `/business-cases#${item.id}`,
          metadata: {
            source: 'business-cases',
            organization: item.organization,
            impact: item.impact,
            categories: item.categories || []
          },
          relevance_score: 0.7 - index * 0.05,
          created_at: item.created_at || new Date().toISOString()
        }));
        
        allResults = [...allResults, ...businessCaseResults];
        totalCount += matchingBusinessCases.length;
      }

      // Add newsletters/articles results  
      if (newslettersResponse.success && newslettersResponse.data) {
        const matchingNewsletters = newslettersResponse.data.filter((item: any) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        console.log('✅ Adding', matchingNewsletters.length, 'matching newsletters');
        const newsletterResults = matchingNewsletters.map((item: any, index: number) => ({
          id: `newsletter-${item.id || index}`,
          title: item.title || 'Article',
          description: item.description || item.content?.substring(0, 200) + '...' || 'No description available',
          type: 'content' as const,
          url: `/newsletters#${item.id}`,
          metadata: {
            source: 'newsletters',
            source_id: item.source_id,
            published_date: item.published_date
          },
          relevance_score: 0.6 - index * 0.05,
          created_at: item.created_at || new Date().toISOString()
        }));
        
        allResults = [...allResults, ...newsletterResults];
        totalCount += matchingNewsletters.length;
      }

      // Add video results
      if (videosResponse.success && videosResponse.videos) {
        console.log('✅ Adding', videosResponse.videos.length, 'video results');
        const videoResults = videosResponse.videos.map((item: any, index: number) => ({
          id: `video-${item.id || index}`,
          title: item.title || 'Video',
          description: item.description || 'No description available',
          type: 'video' as const,
          url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
          metadata: {
            source: 'youtube',
            duration: item.duration,
            viewCount: item.viewCount || 0,
            likeCount: item.likeCount || 0,
            channelTitle: item.channelTitle || 'AIME',
            publishedAt: item.publishedAt,
            tags: item.tags || [],
            categories: item.categories || [],
            hasTranscription: item.hasTranscription || false,
            thumbnail: item.thumbnail
          },
          relevance_score: 0.8 - index * 0.05,
          created_at: item.publishedAt || new Date().toISOString()
        }));
        
        allResults = [...allResults, ...videoResults];
        totalCount += videosResponse.videos.length;
      } else {
        console.log('❌ No video results or API failed');
      }

      // Add IMAGI-NATION TV episode results
      if (imaginationTvResponse.success && imaginationTvResponse.data?.episodes) {
        const episodes = imaginationTvResponse.data.episodes;
        
        // Filter episodes that match the search term
        const matchingEpisodes = episodes.filter((episode: any) => {
          const searchLower = searchTerm.toLowerCase();
          return episode.title?.toLowerCase().includes(searchLower) ||
                 episode.description?.toLowerCase().includes(searchLower) ||
                 episode.themes?.some((theme: string) => theme.toLowerCase().includes(searchLower)) ||
                 episode.keyTopics?.some((topic: string) => topic.toLowerCase().includes(searchLower)) ||
                 (episode.wisdomExtracts && episode.wisdomExtracts.some((extract: any) => 
                   extract.content?.toLowerCase().includes(searchLower) ||
                   extract.themes?.some((theme: string) => theme.toLowerCase().includes(searchLower))
                 ));
        });
        
        console.log('✅ Adding', matchingEpisodes.length, 'IMAGI-NATION TV episodes');
        const tvResults = matchingEpisodes.map((episode: any, index: number) => ({
          id: `imagination-tv-${episode.id}`,
          title: `${episode.title} (Episode ${episode.episodeNumber})`,
          description: episode.description || 'No description available',
          type: 'video' as const,
          url: `/apps/imagination-tv?episode=${episode.id}`,
          metadata: {
            source: 'imagination-tv',
            episode_number: episode.episodeNumber,
            season: episode.season,
            duration: episode.duration,
            viewCount: episode.viewCount || 0,
            wisdomExtractsCount: episode.wisdomExtractsCount || 0,
            themes: episode.themes || [],
            programs: episode.programs || [],
            hasTranscription: episode.hasTranscription,
            thumbnail: episode.thumbnailUrl,
            publishedAt: episode.publishedAt,
            status: episode.status
          },
          relevance_score: 0.9 - index * 0.05, // Give IMAGI-NATION TV high relevance
          created_at: episode.publishedAt || new Date().toISOString()
        }));
        
        allResults = [...allResults, ...tvResults];
        totalCount += matchingEpisodes.length;
      } else {
        console.log('❌ No IMAGI-NATION TV results or API failed');
      }
      
      console.log('🔍 Total results before deduplication:', allResults.length);
      
      // Remove duplicates and sort by relevance
      const uniqueResults = allResults.reduce((acc, current) => {
        const existing = acc.find(item => 
          item.title.toLowerCase() === current.title.toLowerCase() ||
          item.id === current.id
        );
        if (!existing) {
          acc.push(current);
        }
        return acc;
      }, [] as SearchResult[]);
      
      const sortedResults = uniqueResults.sort((a, b) => 
        (b.relevance_score || 0) - (a.relevance_score || 0)
      );
      
      console.log('🔍 Final results:', sortedResults.length, 'unique results');
      console.log('🔍 Setting results:', sortedResults);
      
      setResults(sortedResults);
      setTotalResults(totalCount);
      
    } catch (error) {
      console.error('❌ Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      'knowledge': 'Knowledge',
      'business_case': 'Business Case',
      'video': 'Video',
      'tool': 'Tool',
      'content': 'Article',
      'hoodie': 'Achievement'
    };
    return typeMap[type] || type;
  };

  const getContentTypeStats = () => {
    const total = stats.total_content || 0;
    return {
      'Knowledge Documents': stats.knowledge_documents || 0,
      'Business Cases': stats.business_cases || 0,
      'Videos': stats.videos || 0,
      'Tools & Resources': stats.tools || 0,
      'Articles & Insights': stats.content || 0,
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Discover Knowledge
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore {stats.total_content?.toLocaleString() || '2,700+'} pieces of Indigenous custodianship, 
            systems thinking, and transformational learning resources.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Search and Filters Sidebar */}
          <div className="lg:col-span-1">
            {/* Search Interface */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What would you like to understand?"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Content Type Filters */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content Types</h3>
              <div className="space-y-2">
                {contentTypes.map((type) => (
                  <label key={type.key} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.key)}
                      onChange={(e) => {
                        if (type.key === 'all') {
                          setSelectedTypes(e.target.checked ? ['all'] : []);
                        } else {
                          const newTypes = e.target.checked 
                            ? [...selectedTypes.filter(t => t !== 'all'), type.key]
                            : selectedTypes.filter(t => t !== type.key);
                          setSelectedTypes(newTypes.length ? newTypes : ['all']);
                        }
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Statistics with Routes */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Content Overview</h3>
              <div className="space-y-4">
                {(() => {
                  const contentTypes = [
                    { 
                      key: 'business_cases', 
                      label: 'Business Cases', 
                      count: stats.business_cases || 0,
                      icon: '💼',
                      route: '/business-cases',
                      description: 'Real-world transformations',
                      searchable: true
                    },
                    { 
                      key: 'tools', 
                      label: 'Tools & Resources', 
                      count: stats.tools || 0,
                      icon: '🛠️',
                      route: '/tools',
                      description: 'Practical implementation tools',
                      searchable: true
                    },
                    { 
                      key: 'content', 
                      label: 'Articles & Insights', 
                      count: stats.content || 0,
                      icon: '📰',
                      route: '/newsletters',
                      description: 'Community insights & updates',
                      searchable: true
                    },
                    { 
                      key: 'videos', 
                      label: 'Videos', 
                      count: stats.videos || 0,
                      icon: '🎥',
                      route: '/content/videos',
                      description: 'Visual learning content',
                      searchable: true // Now searchable with YouTube integration
                    }
                  ];

                  return contentTypes
                    .filter(type => type.count > 0) // Only show content types with actual content
                    .map((type) => (
                    <div key={type.key} className="group">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-gray-300 transition-colors">
                        <div className="flex items-center flex-1">
                          <span className="text-lg mr-3">{type.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{type.label}</span>
                              <span className="text-sm font-bold text-gray-900">{type.count.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <a 
                                href={type.route} 
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Browse all →
                              </a>
                              {type.searchable && (
                                <button
                                  onClick={() => {
                                    setQuery(type.label.toLowerCase());
                                    performSearch(type.label.toLowerCase());
                                  }}
                                  className="text-xs text-green-600 hover:underline"
                                >
                                  Search here
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Total Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Total Content</span>
                  <span className="text-lg font-bold text-blue-600">{stats.total_content?.toLocaleString() || 0}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Across Indigenous custodianship, practical tools, and community insights
                </p>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {!hasSearched ? (
              /* Initial State - Suggested Searches */
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-8">Start with a question</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { question: "What is hoodie economics?", description: "Explore relational economics and value creation" },
                    { question: "How does Indigenous custodianship guide systems change?", description: "Learn about seven-generation thinking and reciprocity" },
                    { question: "What makes AIME's mentoring approach unique?", description: "Understand relationship-first methodology" },
                    { question: "How do organizations transform through Joy Corps?", description: "See real business transformation examples" },
                    { question: "What tools support imagination-based learning?", description: "Discover practical implementation resources" },
                    { question: "How do communities build networks of change?", description: "Explore collective transformation models" }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(item.question);
                        performSearch(item.question);
                      }}
                      className="text-left p-6 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Search Results */
              <div>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-light text-gray-900">
                      {loading ? 'Searching...' : `${totalResults.toLocaleString()} results`}
                      {query && (
                        <span className="text-gray-600 font-normal"> for "{query}"</span>
                      )}
                    </h2>
                    {fallbackQuery && (
                      <p className="text-sm text-blue-600 mt-1">
                        🔍 Showing results for "{fallbackQuery}" (simplified from your original search)
                      </p>
                    )}
                  </div>
                  {query && (
                    <button
                      onClick={() => {
                        setQuery('');
                        setResults([]);
                        setHasSearched(false);
                        setTotalResults(0);
                        setFallbackQuery(null);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                {/* Search Summary & Content Categories */}
                {!loading && results.length > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Search Summary</h3>
                    <p className="text-gray-700 mb-4">
                      Found <strong>{totalResults} resources</strong> related to "{query}". 
                      This includes knowledge documents from AIME's Indigenous custodianship framework, 
                      practical tools, real-world case studies, and insights from our global community.
                    </p>
                    
                    {/* Content Type Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const breakdown = results.reduce((acc, result) => {
                          acc[result.type] = (acc[result.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        return Object.entries(breakdown).map(([type, count]) => {
                          const typeMap = {
                            'knowledge': { label: 'Knowledge Docs', icon: '📚', route: '/knowledge-synthesis', color: 'text-blue-600' },
                            'business_case': { label: 'Case Studies', icon: '💼', route: '/business-cases', color: 'text-green-600' },
                            'tool': { label: 'Tools', icon: '🛠️', route: '/tools', color: 'text-orange-600' },
                            'content': { label: 'Articles', icon: '📰', route: '/newsletters', color: 'text-purple-600' },
                            'video': { label: 'Videos', icon: '🎥', route: '/videos', color: 'text-red-600' }
                          };
                          const info = typeMap[type as keyof typeof typeMap] || { label: type, icon: '📄', route: '#', color: 'text-gray-600' };
                          
                          return (
                            <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{info.icon}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{info.label}</div>
                                  <a href={info.route} className={`text-xs ${info.color} hover:underline`}>
                                    View all →
                                  </a>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-gray-900">{count}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* Results List */}
                <div className="space-y-6">
                  {results.map((result) => (
                    <div key={result.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getTypeDisplayName(result.type)}
                          </span>
                          {result.relevance_score && (
                            <span className="text-xs text-gray-400">
                              {Math.round(result.relevance_score * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {result.url ? (
                          <Link href={result.url} className="hover:text-gray-700">
                            {result.title}
                          </Link>
                        ) : (
                          result.title
                        )}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {result.description}
                      </p>
                      
                      {result.created_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {results.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No results found. Try different keywords or explore the suggested questions above.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}