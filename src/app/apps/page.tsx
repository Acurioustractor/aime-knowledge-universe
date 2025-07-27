'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AppInfo {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  status: 'live' | 'coming-soon' | 'beta';
  route: string;
  features: string[];
  themes: string[];
  targetAudience: string[];
  launchDate?: string;
  betaAccess?: boolean;
}

const apps: AppInfo[] = [
  {
    id: 'imagination-tv',
    name: 'IMAGI-NATION TV',
    description: 'Interactive learning platform with Indigenous wisdom and systems thinking',
    longDescription: 'IMAGI-NATION TV is an immersive learning experience that combines storytelling, Indigenous wisdom, and systems thinking. Each episode features interactive segments, discussion prompts, and connections to AIME\'s knowledge base.',
    icon: '📺',
    status: 'live',
    route: '/apps/imagination-tv',
    features: [
      'Interactive episode viewing',
      'Wisdom extraction highlights',
      'Discussion prompts and reflection',
      'Knowledge connections',
      'Community engagement',
      'Learning objectives tracking'
    ],
    themes: ['indigenous-wisdom', 'systems-thinking', 'storytelling', 'imagination'],
    targetAudience: ['Students', 'Educators', 'Community Leaders', 'Change Makers'],
    launchDate: '2024-01-15'
  },
  {
    id: 'mentor-app',
    name: 'AIME Mentor App',
    description: 'Interactive mentoring lessons with audio, video, and hands-on activities',
    longDescription: 'The AIME Mentor App provides a comprehensive learning journey through AIME\'s core mentoring principles. Each lesson combines Jack Manning Bancroft\'s audio wisdom, Vimeo videos, and practical activities to transform how you approach mentoring and relationship-building.',
    icon: '🎓',
    status: 'live',
    route: '/apps/mentor-app',
    features: [
      'Jack Manning Bancroft audio lessons',
      'Interactive Vimeo video content',
      'Hands-on activities and reflection',
      'Progress tracking and completion',
      'AIME Values deep-dives',
      'Knowledge ecosystem integration'
    ],
    themes: ['mentoring', 'indigenous-wisdom', 'personal-development', 'aime-values'],
    targetAudience: ['Mentors', 'Educators', 'Youth Workers', 'Community Leaders'],
    launchDate: '2024-07-27'
  },
  {
    id: 'film-map',
    name: 'IMAGINE Film Map',
    description: 'Interactive storytelling and film creation platform',
    longDescription: 'IMAGINE Film Map empowers communities to create, share, and discover stories through interactive film experiences. Built on principles of imagination-based learning and cultural storytelling.',
    icon: '🎬',
    status: 'coming-soon',
    route: '/apps/film-map',
    features: [
      'Interactive story creation',
      'Community film sharing',
      'Cultural storytelling tools',
      'Collaborative editing',
      'Story mapping interface',
      'Educational integration'
    ],
    themes: ['storytelling', 'creativity', 'community', 'cultural-expression'],
    targetAudience: ['Filmmakers', 'Students', 'Communities', 'Storytellers'],
    launchDate: '2024-Q3'
  },
  {
    id: 'sea-the-weed',
    name: 'Sea the Weed',
    description: 'Environmental awareness and ocean conservation platform',
    longDescription: 'Sea the Weed connects Indigenous knowledge of ocean health with modern environmental science, creating tools for community-led conservation and education about marine ecosystems.',
    icon: '🌊',
    status: 'beta',
    route: '/apps/sea-the-weed',
    features: [
      'Ocean health monitoring',
      'Indigenous knowledge integration',
      'Community data collection',
      'Conservation action tracking',
      'Educational resources',
      'Ecosystem visualization'
    ],
    themes: ['environmental-stewardship', 'indigenous-knowledge', 'ocean-health', 'community-science'],
    targetAudience: ['Environmental Scientists', 'Indigenous Communities', 'Students', 'Conservationists'],
    launchDate: '2024-Q4',
    betaAccess: true
  }
];

export default function AppsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'education', 'mentoring', 'storytelling', 'environment'];
  const statuses = ['all', 'live', 'beta', 'coming-soon'];

  const filteredApps = apps.filter(app => {
    const categoryMatch = selectedCategory === 'all' || 
      (selectedCategory === 'education' && app.themes.includes('systems-thinking')) ||
      (selectedCategory === 'mentoring' && app.themes.includes('mentoring')) ||
      (selectedCategory === 'storytelling' && app.themes.includes('storytelling')) ||
      (selectedCategory === 'environment' && app.themes.includes('environmental-stewardship'));
    
    const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
    
    return categoryMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      live: 'bg-green-100 text-green-800 border-green-200',
      beta: 'bg-blue-100 text-blue-800 border-blue-200',
      'coming-soon': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const labels = {
      live: 'Live',
      beta: 'Beta',
      'coming-soon': 'Coming Soon'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return '✅';
      case 'beta': return '🚧';
      case 'coming-soon': return '🔜';
      default: return '📱';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-light mb-6">
              AIME Apps
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Imagination-powered applications that bridge Indigenous wisdom with modern technology, 
              creating tools for learning, mentoring, storytelling, and systems change.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>{apps.filter(a => a.status === 'live').length} Live Apps</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚧</span>
                <span>{apps.filter(a => a.status === 'beta').length} Beta Apps</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔜</span>
                <span>{apps.filter(a => a.status === 'coming-soon').length} Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              {/* App Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{app.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(app.status)}
                        {app.betaAccess && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                            Beta Access
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-2xl">{getStatusIcon(app.status)}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {app.description}
                </p>
              </div>

              {/* App Details */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Target Audience */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">For</h4>
                    <div className="flex flex-wrap gap-1">
                      {app.targetAudience.slice(0, 3).map((audience, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {audience}
                        </span>
                      ))}
                      {app.targetAudience.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{app.targetAudience.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {app.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Launch Info */}
                  {(app.launchDate || app.status === 'coming-soon') && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {app.status === 'live' ? 'Launched' : 'Expected'}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {app.launchDate || 'TBA'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6">
                {app.status === 'live' ? (
                  <Link
                    href={app.route}
                    className="block w-full bg-purple-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Launch App
                  </Link>
                ) : app.status === 'beta' ? (
                  <Link
                    href={app.route}
                    className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Join Beta
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full bg-gray-100 text-gray-500 text-center py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No apps found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more apps.</p>
          </div>
        )}

        {/* Developer Info */}
        <div className="mt-16 p-8 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Building the Future of Indigenous-Led Innovation
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              Each AIME app is designed with Indigenous wisdom at its core, combining traditional knowledge 
              with modern technology to create tools that serve communities, foster learning, and drive 
              systems change through imagination and relationship-first approaches.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>🌱</span>
                <span>Indigenous-Led Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔗</span>
                <span>Knowledge Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Community-Focused</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Imagination-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}