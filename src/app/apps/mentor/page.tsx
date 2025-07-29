'use client';

import Link from 'next/link';

export default function MentorAppPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/apps" className="text-green-200 hover:text-white text-sm">
              ← Back to Apps
            </Link>
          </div>
          <h1 className="text-4xl font-light mb-4 flex items-center space-x-3">
            <span className="text-5xl">🤝</span>
            <span>Mentor App</span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            AI-powered mentoring platform connecting wisdom with opportunity through relationship-first approaches.
          </p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="text-8xl mb-8">🚧</div>
        <h2 className="text-3xl font-light text-gray-900 mb-6">
          Coming Soon in 2024 Q2
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          The Mentor App is being built with AIME's proven mentoring methodology at its core, 
          combining relationship-first approaches with AI-powered matching and personalized learning paths.
        </p>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '🎯',
              title: 'Smart Matching',
              description: 'AI-powered mentor-mentee pairing based on goals, interests, and compatibility'
            },
            {
              icon: '📈',
              title: 'Progress Tracking',
              description: 'Visual progress tracking and milestone celebration for mentoring relationships'
            },
            {
              icon: '💬',
              title: 'Virtual Sessions',
              description: 'Integrated video calls, messaging, and resource sharing for remote mentoring'
            },
            {
              icon: '📚',
              title: 'Resource Library',
              description: 'Access to AIME\'s mentoring resources, tools, and wisdom extracts'
            },
            {
              icon: '🌐',
              title: 'Community Building',
              description: 'Connect with the global AIME mentoring community and share experiences'
            },
            {
              icon: '🔍',
              title: 'Insight Analytics',
              description: 'Data-driven insights to improve mentoring outcomes and relationships'
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Methodology Preview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Built on AIME's Proven Mentoring Methodology
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">❤️</div>
              <h4 className="font-medium text-gray-900 mb-2">Relationship First</h4>
              <p className="text-sm text-gray-600">
                Building genuine connections before focusing on outcomes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h4 className="font-medium text-gray-900 mb-2">Potential Focus</h4>
              <p className="text-sm text-gray-600">
                Seeing and nurturing the potential in every young person
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h4 className="font-medium text-gray-900 mb-2">Network Power</h4>
              <p className="text-sm text-gray-600">
                Creating networks of support and opportunity
              </p>
            </div>
          </div>
        </div>

        {/* Interest Registration */}
        <div className="bg-white border border-green-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Be the First to Know
          </h3>
          <p className="text-gray-600 mb-6">
            Register your interest to get early access and updates on the Mentor App development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}