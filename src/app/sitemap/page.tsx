import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-black mb-8">AIME Wiki - Complete Site Map</h1>
        
        {/* Vision Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-300 rounded">
          <h2 className="text-2xl font-bold text-black mb-3">🎯 Original Vision Realized</h2>
          <p className="text-gray-700 mb-4">
            A unified knowledge base aggregating 20 years of AIME mentoring wisdom from multiple sources:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>423 YouTube videos from @aimementoring channel</li>
            <li>Airtable hoodie data with regional information</li>
            <li>Mailchimp newsletter archives</li>
            <li>GitHub repository content</li>
            <li>Research papers and stories</li>
          </ul>
        </div>

        {/* Main Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">📄 Main Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🏠 Homepage</h3>
              <p className="text-sm text-gray-600">Main landing page with recent content</p>
            </Link>
            
            <Link href="/content/videos" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">📺 Videos</h3>
              <p className="text-sm text-gray-600">YouTube videos with search, filters, themes</p>
            </Link>
            
            <Link href="/tools" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🛠️ Tools</h3>
              <p className="text-sm text-gray-600">Downloadable resources categorized</p>
            </Link>
            
            <Link href="/search" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🔍 Search</h3>
              <p className="text-sm text-gray-600">Semantic search across all content</p>
            </Link>
            
            <Link href="/browse" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">📚 Browse</h3>
              <p className="text-sm text-gray-600">Browse all content by category</p>
            </Link>
            
            <Link href="/stories" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">📖 Stories</h3>
              <p className="text-sm text-gray-600">Personal mentoring journeys</p>
            </Link>
          </div>
        </div>

        {/* Hoodie Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">🎓 Hoodie Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/hoodie-journey" className="block p-4 border border-blue-300 rounded hover:bg-blue-50">
              <h3 className="font-bold text-blue-600">🎯 Hoodie Journey</h3>
              <p className="text-sm text-gray-600">Interactive 7-phase pathway</p>
            </Link>
            
            <Link href="/hoodie-dashboard" className="block p-4 border border-green-300 rounded hover:bg-green-50">
              <h3 className="font-bold text-green-600">📊 Hoodie Dashboard</h3>
              <p className="text-sm text-gray-600">Real-time metrics and analytics</p>
            </Link>
            
            <Link href="/hoodie-exchange" className="block p-4 border border-purple-300 rounded hover:bg-purple-50">
              <h3 className="font-bold text-purple-600">📈 Hoodie Exchange</h3>
              <p className="text-sm text-gray-600">Knowledge value trading system</p>
            </Link>
          </div>
        </div>

        {/* Admin & Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">⚙️ Admin & Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">👨‍💼 Admin Dashboard</h3>
              <p className="text-sm text-gray-600">Content management interface</p>
            </Link>
            
            <Link href="/admin/data-lake" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🌊 Data Lake</h3>
              <p className="text-sm text-gray-600">Unified data aggregation status</p>
            </Link>
            
            <Link href="/aggregation" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🔄 Aggregation Pipeline</h3>
              <p className="text-sm text-gray-600">Content processing pipeline</p>
            </Link>
            
            <Link href="/status" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">📊 System Status</h3>
              <p className="text-sm text-gray-600">Health checks for all services</p>
            </Link>
            
            <Link href="/tools/debug" className="block p-4 border border-gray-300 rounded hover:bg-gray-50">
              <h3 className="font-bold text-blue-600">🐛 Debug Tools</h3>
              <p className="text-sm text-gray-600">Development utilities</p>
            </Link>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">🔌 API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-300 rounded">
              <h3 className="font-bold mb-2">Integration APIs</h3>
              <ul className="text-sm space-y-1">
                <li><a href="/api/integrations/youtube" className="text-blue-600 underline">/api/integrations/youtube</a> - YouTube videos</li>
                <li><a href="/api/integrations/airtable" className="text-blue-600 underline">/api/integrations/airtable</a> - Hoodie data</li>
                <li><a href="/api/integrations/mailchimp" className="text-blue-600 underline">/api/integrations/mailchimp</a> - Newsletters</li>
                <li><a href="/api/integrations/github" className="text-blue-600 underline">/api/integrations/github</a> - Repository content</li>
              </ul>
            </div>
            
            <div className="p-4 border border-gray-300 rounded">
              <h3 className="font-bold mb-2">Content APIs</h3>
              <ul className="text-sm space-y-1">
                <li><a href="/api/content/real" className="text-blue-600 underline">/api/content/real</a> - Aggregated content</li>
                <li><a href="/api/search" className="text-blue-600 underline">/api/search</a> - Search endpoint</li>
                <li><a href="/api/data-lake/init" className="text-blue-600 underline">/api/data-lake/init</a> - Initialize data</li>
                <li><a href="/api/docs" className="text-blue-600 underline">/api/docs</a> - Swagger documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="mb-8 p-6 bg-gray-50 border border-gray-300 rounded">
          <h2 className="text-xl font-bold text-black mb-3">🛠️ Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Frontend:</strong>
              <ul className="mt-1 text-gray-600">
                <li>• Next.js 13.5.6 App Router</li>
                <li>• React 18.2</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <strong>Backend:</strong>
              <ul className="mt-1 text-gray-600">
                <li>• Zod validation</li>
                <li>• JWT authentication</li>
                <li>• API rate limiting</li>
                <li>• Error handling</li>
              </ul>
            </div>
            <div>
              <strong>Data Layer:</strong>
              <ul className="mt-1 text-gray-600">
                <li>• PostgreSQL database</li>
                <li>• Redis caching</li>
                <li>• Full-text search</li>
                <li>• Background sync</li>
              </ul>
            </div>
            <div>
              <strong>Integrations:</strong>
              <ul className="mt-1 text-gray-600">
                <li>• YouTube API v3</li>
                <li>• Airtable API</li>
                <li>• Mailchimp API</li>
                <li>• GitHub API</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}