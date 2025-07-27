'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  category?: string;
  url: string;
  source?: string;
  year?: string;
  hoodie?: boolean;
}

export default function UniversePage() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      // Fetch from multiple endpoints to get all content
      const [contentRes, toolsRes, businessCasesRes, videosRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/tools'),
        fetch('/api/business-cases'),
        fetch('/api/content/youtube')
      ]);

      const [content, tools, businessCases, videos] = await Promise.all([
        contentRes.json(),
        toolsRes.json(),
        businessCasesRes.json(),
        videosRes.json()
      ]);

      // Combine and format all content
      const combinedContent: ContentItem[] = [
        ...content.items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.content_type || 'content',
          category: item.category,
          url: item.url || `/content/${item.id}`,
          source: item.source,
          year: item.source_created_at?.substring(0, 4)
        })) || [],
        ...tools.tools?.map((tool: any) => ({
          id: tool.id,
          title: tool.title,
          type: 'tool',
          category: tool.category,
          url: `/tools/${tool.id}`,
          year: tool.created_at?.substring(0, 4)
        })) || [],
        ...businessCases.cases?.map((bc: any) => ({
          id: bc.id,
          title: bc.title,
          type: 'business_case',
          category: 'Business Cases',
          url: `/business-cases/${bc.id}`,
          year: bc.created_at?.substring(0, 4)
        })) || [],
        ...videos.videos?.map((video: any) => ({
          id: video.id,
          title: video.title,
          type: 'video',
          category: 'Videos',
          url: `/content/videos/${video.video_id}`,
          source: 'youtube',
          year: video.published_at?.substring(0, 4),
          hoodie: video.title.toLowerCase().includes('hoodie')
        })) || []
      ];

      // Sort alphabetically by title
      combinedContent.sort((a, b) => a.title.localeCompare(b.title));

      setAllContent(combinedContent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const filteredContent = allContent.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group content by first letter
  const groupedContent = filteredContent.reduce((acc: any, item) => {
    const firstLetter = item.title[0]?.toUpperCase() || '#';
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(item);
    return acc;
  }, {});

  // Split into three columns
  const letters = Object.keys(groupedContent).sort();
  const itemsPerColumn = Math.ceil(filteredContent.length / 3);
  
  const columns: ContentItem[][] = [[], [], []];
  let currentColumn = 0;
  let currentCount = 0;

  letters.forEach(letter => {
    const items = groupedContent[letter];
    items.forEach((item: ContentItem) => {
      columns[currentColumn].push(item);
      currentCount++;
      if (currentCount >= itemsPerColumn && currentColumn < 2) {
        currentColumn++;
        currentCount = 0;
      }
    });
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'tool': return '🛠️';
      case 'business_case': return '💼';
      case 'newsletter': return '📧';
      case 'hoodie': return '👕';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-light text-gray-900">AIME Universe</h1>
              <p className="text-gray-600 mt-1">All {allContent.length} pieces of knowledge in one place</p>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to search
            </Link>
          </div>

          {/* Quick search and filters */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Quick filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="tool">Tools</option>
              <option value="business_case">Business Cases</option>
              <option value="newsletter">Newsletters</option>
              <option value="content">Other Content</option>
            </select>

            <div className="text-sm text-gray-500">
              Showing {filteredContent.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading universe...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-6">
                {column.map((item, index) => {
                  // Check if this is the first item or if the first letter changed
                  const showLetter = index === 0 || 
                    column[index - 1]?.title[0]?.toUpperCase() !== item.title[0]?.toUpperCase();
                  const letter = item.title[0]?.toUpperCase() || '#';

                  return (
                    <div key={item.id}>
                      {showLetter && (
                        <h2 className="text-2xl font-light text-gray-400 mb-2 border-b border-gray-200 pb-1">
                          {letter}
                        </h2>
                      )}
                      <div className="ml-4">
                        <Link 
                          href={item.url}
                          className="group block hover:bg-gray-100 -mx-2 px-2 py-1 rounded transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">{getTypeIcon(item.type)}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </span>
                              {item.year && (
                                <span className="text-sm text-gray-500 ml-2">({item.year})</span>
                              )}
                              {item.hoodie && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">
                                  Hoodie
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer stats */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm text-gray-600">
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {allContent.filter(i => i.type === 'video').length}
                </div>
                <div>Videos</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {allContent.filter(i => i.type === 'tool').length}
                </div>
                <div>Tools</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {allContent.filter(i => i.type === 'business_case').length}
                </div>
                <div>Business Cases</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {allContent.filter(i => i.type === 'newsletter').length}
                </div>
                <div>Newsletters</div>
              </div>
              <div>
                <div className="text-2xl font-light text-gray-900">
                  {allContent.filter(i => i.hoodie).length}
                </div>
                <div>Hoodie Related</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}