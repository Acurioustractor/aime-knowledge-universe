import Link from 'next/link';

// Static video data to avoid API issues
const staticVideos = [
  {
    id: 'video-1',
    title: 'AIME Mentoring Journey: Building Bridges',
    description: 'An inspiring look at how AIME mentors create meaningful connections with young Indigenous students across Australia.',
    url: 'https://youtube.com/watch?v=example1',
    thumbnail: '/assets/video-thumb-1.jpg',
    duration: '15:32',
    views: '12K',
    publishedDate: '2024-01-15'
  },
  {
    id: 'video-2', 
    title: 'IMAGI-NATION TV: Youth Leadership Stories',
    description: 'Powerful stories from young leaders who have transformed their communities through education and mentorship.',
    url: 'https://youtube.com/watch?v=example2',
    thumbnail: '/assets/video-thumb-2.jpg',
    duration: '22:18',
    views: '8.5K',
    publishedDate: '2024-01-10'
  },
  {
    id: 'video-3',
    title: 'Indigenous Knowledge Systems in Education',
    description: 'Exploring how traditional knowledge systems can enhance modern educational approaches.',
    url: 'https://youtube.com/watch?v=example3',
    thumbnail: '/assets/video-thumb-3.jpg',
    duration: '18:45',
    views: '15K',
    publishedDate: '2024-01-05'
  },
  {
    id: 'video-4',
    title: 'Hoodie Journey: From Ceremony In to Graduation',
    description: 'Follow students through the complete AIME pathway from their first ceremony to graduation.',
    url: 'https://youtube.com/watch?v=example4',
    thumbnail: '/assets/video-thumb-4.jpg',
    duration: '28:12',
    views: '20K',
    publishedDate: '2023-12-28'
  },
  {
    id: 'video-5',
    title: 'Global Mentoring Networks: 52 Countries Connected',
    description: 'See how AIME has built mentoring networks across 52 countries, creating global connections.',
    url: 'https://youtube.com/watch?v=example5',
    thumbnail: '/assets/video-thumb-5.jpg',
    duration: '32:07',
    views: '25K',
    publishedDate: '2023-12-20'
  },
  {
    id: 'video-6',
    title: 'Imagination Economics: Rethinking Value',
    description: 'Jack Manning Bancroft discusses how imagination can transform economic thinking.',
    url: 'https://youtube.com/watch?v=example6',
    thumbnail: '/assets/video-thumb-6.jpg',
    duration: '45:33',
    views: '18K',
    publishedDate: '2023-12-15'
  }
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container mx-auto px-4 max-w-6xl py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Videos</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl font-bold text-black mb-4">
            IMAGI-NATION TV Archive
          </h1>
          <p className="text-gray-700 max-w-4xl">
            Episodes from IMAGI-NATION TV featuring conversations about education transformation, 
            Indigenous wisdom, youth leadership, and imagination in action.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Simple Search */}
          <div className="mb-8 border border-gray-300 bg-gray-50 p-6">
            <form action="/content/videos" method="get" className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search videos
                </label>
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search by title, description, or keywords..."
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Videos Grid */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Found {staticVideos.length} videos • Showing recent AIME content
            </p>
            <div className="text-sm text-blue-600 font-medium mb-6">
              📺 Static video showcase (API integration temporarily disabled)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticVideos.map((video) => (
              <div key={video.id} className="border border-gray-300 bg-white">
                {/* Video Thumbnail */}
                <div className="relative">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500 text-4xl">🎥</div>
                  </div>
                  
                  {/* Duration overlay */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1">
                    {video.duration}
                  </div>
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

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <span>IMAGI-NATION TV</span>
                    <span>{video.views} views</span>
                  </div>

                  {/* Published Date */}
                  <div className="text-xs text-gray-500">
                    Published: {new Date(video.publishedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More / Navigation */}
          <div className="mt-8 text-center border-t border-gray-300 pt-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {staticVideos.length} videos from the AIME archive
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                💡 <strong>Note:</strong> This is a simplified view. Full video integration with live YouTube data 
                is available but temporarily disabled to resolve technical issues.
              </p>
              
              <div className="flex justify-center gap-4 mt-4">
                <Link 
                  href="/content/videos" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Try full video page
                </Link>
                <Link 
                  href="/search?q=video" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Search for videos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}