import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-black mb-4">
            AIME Knowledge Archive
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-4xl">
            A comprehensive collection of mentoring wisdom, stories, and resources from 20 years of AIME programs across 52 countries. 250+ episodes and resources available for search and discovery.
          </p>
          
          {/* Simple Search Box */}
          <div className="mb-6">
            <form action="/search" method="get" className="flex max-w-2xl">
              <input
                type="text"
                name="q"
                placeholder="Search the knowledge archive..."
                className="flex-1 px-3 py-2 border border-gray-400 text-base"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-400 hover:bg-gray-200 text-black font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600">
            <strong>Archive contains:</strong> 250+ episodes • 52 countries • 20 years of content
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="py-8 border-b border-gray-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl font-bold text-black mb-6">
            Browse by Category
          </h2>
          
          {/* Featured: Journey & Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-blue-300 p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎓</span>
                <h3 className="text-xl font-bold text-black">Hoodie Journey</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Explore the complete IMAGI-NATION mentoring pathway - from Ceremony In to Graduation. 
                Interactive guide with 7 phases, hoodies, and transformative learning experiences.
              </p>
              <Link href="/hoodie-journey" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                Start Journey →
              </Link>
            </div>

            <div className="border-2 border-green-300 p-6 bg-green-50 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📊</span>
                <h3 className="text-xl font-bold text-black">Hoodie Dashboard</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Real-time insights into AIME's global mentoring network. Live data from hoodie hubs 
                across regions with impact metrics, mentor/mentee statistics, and analytics.
              </p>
              <Link href="/hoodie-dashboard" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium">
                View Dashboard →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-300 p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">Stories</h3>
              <p className="text-sm text-gray-700 mb-3">Personal mentoring journeys and transformative moments</p>
              <Link href="/stories" className="text-blue-600 underline hover:text-blue-800">
                Browse stories →
              </Link>
            </div>

            <div className="border border-gray-300 p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">Videos</h3>
              <p className="text-sm text-gray-700 mb-3">IMAGI-NATION TV episodes and workshop recordings</p>
              <Link href="/content/videos" className="text-blue-600 underline hover:text-blue-800">
                Watch videos →
              </Link>
            </div>

            <div className="border border-gray-300 p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">Tools</h3>
              <p className="text-sm text-gray-700 mb-3">Practical resources and frameworks for mentors</p>
              <Link href="/tools" className="text-blue-600 underline hover:text-blue-800">
                Get tools →
              </Link>
            </div>

            <div className="border border-gray-300 p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">Research</h3>
              <p className="text-sm text-gray-700 mb-3">Insights and findings from global mentoring programs</p>
              <Link href="/research" className="text-blue-600 underline hover:text-blue-800">
                Read research →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Static Recent Content Placeholder */}
      <div className="py-8 border-b border-gray-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl font-bold text-black mb-6">Recent Additions</h2>
          <div className="border border-gray-300 p-6 bg-gray-50">
            <p className="text-gray-700 mb-4">
              Recent content section temporarily simplified to resolve technical issues.
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Use the navigation above to browse all available content.
            </p>
            <Link href="/browse?sort=recent" className="text-blue-600 underline hover:text-blue-800">
              View all recent content →
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="py-8 border-b border-gray-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl font-bold text-black mb-6">
            Popular Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-black mb-3">By Theme</h3>
              <ul className="space-y-2">
                <li>• <Link href="/search?q=climate+action" className="text-blue-600 underline hover:text-blue-800">Climate Action Leadership</Link> <span className="text-sm text-gray-600">(12 items)</span></li>
                <li>• <Link href="/search?q=indigenous+knowledge" className="text-blue-600 underline hover:text-blue-800">Indigenous Knowledge</Link> <span className="text-sm text-gray-600">(8 items)</span></li>
                <li>• <Link href="/search?q=digital+innovation" className="text-blue-600 underline hover:text-blue-800">Digital Innovation</Link> <span className="text-sm text-gray-600">(15 items)</span></li>
                <li>• <Link href="/search?q=cultural+bridge" className="text-blue-600 underline hover:text-blue-800">Cultural Bridge Building</Link> <span className="text-sm text-gray-600">(20 items)</span></li>
                <li>• <Link href="/search?q=youth+entrepreneurship" className="text-blue-600 underline hover:text-blue-800">Youth Entrepreneurship</Link> <span className="text-sm text-gray-600">(10 items)</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-black mb-3">By Region</h3>
              <ul className="space-y-2">
                <li>• <Link href="/browse?region=australia" className="text-blue-600 underline hover:text-blue-800">Australia</Link> <span className="text-sm text-gray-600">(45 items)</span></li>
                <li>• <Link href="/browse?region=north-america" className="text-blue-600 underline hover:text-blue-800">North America</Link> <span className="text-sm text-gray-600">(38 items)</span></li>
                <li>• <Link href="/browse?region=global" className="text-blue-600 underline hover:text-blue-800">Global/Multi-region</Link> <span className="text-sm text-gray-600">(67 items)</span></li>
                <li>• <Link href="/browse?region=pacific" className="text-blue-600 underline hover:text-blue-800">Pacific Islands</Link> <span className="text-sm text-gray-600">(22 items)</span></li>
                <li>• <Link href="/browse?region=africa" className="text-blue-600 underline hover:text-blue-800">Africa</Link> <span className="text-sm text-gray-600">(18 items)</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <h3 className="text-lg font-bold text-black mb-3">Quick Browse</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/browse?sort=recent" className="text-blue-600 underline hover:text-blue-800">Recent additions</Link>
              <Link href="/browse?type=videos" className="text-blue-600 underline hover:text-blue-800">All videos</Link>
              <Link href="/browse?type=stories" className="text-blue-600 underline hover:text-blue-800">All stories</Link>
              <Link href="/browse?type=tools" className="text-blue-600 underline hover:text-blue-800">All tools</Link>
              <Link href="/browse?type=research" className="text-blue-600 underline hover:text-blue-800">All research</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}