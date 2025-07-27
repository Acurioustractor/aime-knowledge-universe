'use client';

import Link from 'next/link';

export default function FilmMapPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/apps" className="text-red-200 hover:text-white text-sm">
              ← Back to Apps
            </Link>
          </div>
          <h1 className="text-4xl font-light mb-4 flex items-center space-x-3">
            <span className="text-5xl">🎬</span>
            <span>IMAGINE Film Map</span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Interactive storytelling and film creation platform empowering communities to create, share, and discover stories.
          </p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="text-8xl mb-8">🎭</div>
        <h2 className="text-3xl font-light text-gray-900 mb-6">
          Coming Soon in 2024 Q3
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          IMAGINE Film Map will revolutionize storytelling by combining Indigenous narrative traditions 
          with modern film technology, creating interactive experiences that honor culture while embracing innovation.
        </p>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '🗺️',
              title: 'Story Mapping',
              description: 'Visual story mapping interface for planning and structuring narrative experiences'
            },
            {
              icon: '🎥',
              title: 'Collaborative Creation',
              description: 'Multi-user film creation with real-time collaboration and version control'
            },
            {
              icon: '🌍',
              title: 'Cultural Integration',
              description: 'Tools specifically designed for Indigenous and cultural storytelling traditions'
            },
            {
              icon: '🎮',
              title: 'Interactive Elements',
              description: 'Add interactive hotspots, decision points, and immersive elements to films'
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              description: 'Create and view content on any device with responsive design'
            },
            {
              icon: '🏫',
              title: 'Educational Tools',
              description: 'Integration with educational curricula and learning objectives'
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Storytelling Philosophy */}
        <div className="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Honoring Traditional Storytelling in Digital Spaces
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📖</div>
              <h4 className="font-medium text-gray-900 mb-2">Oral Tradition</h4>
              <p className="text-sm text-gray-600">
                Preserving and adapting oral storytelling traditions for digital mediums
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h4 className="font-medium text-gray-900 mb-2">Community Voices</h4>
              <p className="text-sm text-gray-600">
                Amplifying diverse community voices and perspectives through film
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="font-medium text-gray-900 mb-2">Cultural Expression</h4>
              <p className="text-sm text-gray-600">
                Supporting authentic cultural expression and artistic freedom
              </p>
            </div>
          </div>
        </div>

        {/* Development Roadmap */}
        <div className="bg-white border border-red-200 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Roadmap</h3>
          <div className="space-y-4">
            {[
              { phase: 'Phase 1', title: 'Story Mapping Tools', status: 'In Development', date: 'Q1 2024' },
              { phase: 'Phase 2', title: 'Basic Film Creation', status: 'Planning', date: 'Q2 2024' },
              { phase: 'Phase 3', title: 'Interactive Features', status: 'Design', date: 'Q3 2024' },
              { phase: 'Phase 4', title: 'Community Platform', status: 'Research', date: 'Q4 2024' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-red-600">{item.phase}</span>
                  <span className="font-medium text-gray-900">{item.title}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.date}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'In Development' ? 'bg-green-100 text-green-800' :
                    item.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interest Registration */}
        <div className="bg-white border border-red-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Join the Creative Community
          </h3>
          <p className="text-gray-600 mb-6">
            Be part of the creative community shaping the future of interactive storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}