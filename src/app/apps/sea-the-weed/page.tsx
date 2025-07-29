'use client';

import Link from 'next/link';

export default function SeaTheWeedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/apps" className="text-blue-200 hover:text-white text-sm">
              ← Back to Apps
            </Link>
          </div>
          <h1 className="text-4xl font-light mb-4 flex items-center space-x-3">
            <span className="text-5xl">🌊</span>
            <span>Sea the Weed</span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Environmental awareness and ocean conservation platform connecting Indigenous knowledge with modern science.
          </p>
        </div>
      </div>

      {/* Beta Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="text-8xl mb-8">🧪</div>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Beta Testing
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">Q4 2024 Launch</span>
        </div>
        <h2 className="text-3xl font-light text-gray-900 mb-6">
          Ocean Health Through Indigenous Custodianship
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Sea the Weed bridges ancient Indigenous knowledge of ocean health with modern environmental science, 
          creating tools for community-led conservation and marine ecosystem education.
        </p>

        {/* Beta Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '📊',
              title: 'Ocean Health Monitoring',
              description: 'Real-time data collection and analysis of marine ecosystem indicators',
              status: 'beta'
            },
            {
              icon: '🧠',
              title: 'Indigenous Knowledge',
              description: 'Integration of traditional ecological knowledge with scientific methods',
              status: 'beta'
            },
            {
              icon: '👥',
              title: 'Community Data',
              description: 'Citizen science tools for community-driven environmental monitoring',
              status: 'beta'
            },
            {
              icon: '🎯',
              title: 'Conservation Tracking',
              description: 'Track conservation actions and their impact on marine ecosystems',
              status: 'coming-soon'
            },
            {
              icon: '📚',
              title: 'Educational Resources',
              description: 'Learning materials connecting ocean health to climate and community',
              status: 'coming-soon'
            },
            {
              icon: '🌐',
              title: 'Ecosystem Visualization',
              description: 'Interactive maps and visualizations of ocean health data',
              status: 'coming-soon'
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg relative">
              {feature.status === 'beta' && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                  Beta
                </span>
              )}
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Indigenous Knowledge Integration */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Bridging Traditional and Modern Knowledge Systems
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏝️</div>
              <h4 className="font-medium text-gray-900 mb-2">Traditional Indicators</h4>
              <p className="text-sm text-gray-600">
                Seasonal patterns, species behavior, and ecological relationships
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h4 className="font-medium text-gray-900 mb-2">Scientific Methods</h4>
              <p className="text-sm text-gray-600">
                Modern monitoring tools, data analysis, and research methodologies
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤲</div>
              <h4 className="font-medium text-gray-900 mb-2">Community Action</h4>
              <p className="text-sm text-gray-600">
                Locally-led conservation initiatives and environmental stewardship
              </p>
            </div>
          </div>
        </div>

        {/* Beta Testing Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Beta Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Basic ocean health data collection</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Traditional knowledge documentation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Community observation logging</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Data visualization dashboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Mobile app for field data collection</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-teal-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Who Can Join Beta</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span>🏫</span>
                <span>Educational institutions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🌊</span>
                <span>Marine conservation organizations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🏘️</span>
                <span>Coastal Indigenous communities</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🔬</span>
                <span>Environmental researchers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>👨‍🎓</span>
                <span>Students and citizen scientists</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Beta Access */}
        <div className="bg-white border border-blue-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Request Beta Access
          </h3>
          <p className="text-gray-600 mb-6">
            Join our beta testing program to help shape the future of community-led ocean conservation.
          </p>
          <form className="space-y-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="">Select your role</option>
              <option value="educator">Educator</option>
              <option value="researcher">Researcher</option>
              <option value="community-leader">Community Leader</option>
              <option value="conservationist">Conservationist</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Tell us about your interest in ocean conservation and how you'd like to use Sea the Weed"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
            <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Request Beta Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}