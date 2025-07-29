'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface KnowledgeHubIntegrationProps {
  currentFilter?: string;
  currentTheme?: string;
  videoCount?: number;
}

interface RelatedContent {
  type: 'article' | 'program' | 'resource' | 'app';
  title: string;
  description: string;
  url: string;
  icon: string;
  tags: string[];
}

export function KnowledgeHubIntegration({ 
  currentFilter = 'all', 
  currentTheme = 'all',
  videoCount = 0 
}: KnowledgeHubIntegrationProps) {
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);
  const [loading, setLoading] = useState(false);

  // Define related content based on current filters
  const getRelatedContent = (): RelatedContent[] => {
    const baseContent: RelatedContent[] = [
      {
        type: 'app',
        title: 'IMAGI-NATION Network',
        description: 'Connect with the global community of imagination-based educators and changemakers',
        url: '/apps/network',
        icon: '🌐',
        tags: ['community', 'network', 'global']
      },
      {
        type: 'resource',
        title: 'AIME Methodology Hub',
        description: 'Explore the core methodologies and frameworks behind AIME\'s approach',
        url: '/knowledge/methodology',
        icon: '📚',
        tags: ['methodology', 'education', 'frameworks']
      },
      {
        type: 'program',
        title: 'Digital Asset Manager',
        description: 'Explore all AIME digital assets, media, and educational resources',
        url: '/apps/digital-asset-manager',
        icon: '🗂️',
        tags: ['assets', 'media', 'resources']
      }
    ];

    // Add filter-specific content
    const filterSpecificContent: RelatedContent[] = [];

    if (currentFilter === 'imagination-tv') {
      filterSpecificContent.push(
        {
          type: 'article',
          title: 'IMAGI-NATION TV Production Guide',
          description: 'Learn how IMAGI-NATION TV episodes are created and the stories behind them',
          url: '/knowledge/imagination-tv-guide',
          icon: '🎬',
          tags: ['production', 'storytelling', 'behind-scenes']
        },
        {
          type: 'resource',
          title: 'Interactive Learning Templates',
          description: 'Templates and tools for creating your own imagination-based learning experiences',
          url: '/resources/learning-templates',
          icon: '🛠️',
          tags: ['templates', 'learning', 'tools']
        }
      );
    }

    if (currentFilter === 'aime-tv') {
      filterSpecificContent.push(
        {
          type: 'article',
          title: 'AIME TV Archive Explorer',
          description: 'Deep dive into the complete archive of AIME TV episodes and their impact',
          url: '/knowledge/aime-tv-archive',
          icon: '📼',
          tags: ['archive', 'history', 'impact']
        },
        {
          type: 'program',
          title: 'Mentoring Stories Collection',
          description: 'Real stories and case studies from AIME\'s mentoring programs',
          url: '/stories/mentoring',
          icon: '💝',
          tags: ['mentoring', 'stories', 'impact']
        }
      );
    }

    if (currentFilter === 'imagi-labs') {
      filterSpecificContent.push(
        {
          type: 'app',
          title: 'Innovation Lab Toolkit',
          description: 'Tools and resources for running your own innovation labs and design challenges',
          url: '/apps/innovation-lab',
          icon: '🧪',
          tags: ['innovation', 'labs', 'design']
        },
        {
          type: 'resource',
          title: 'Systems Change Playbook',
          description: 'Practical guide to implementing systems change in education and community',
          url: '/playbooks/systems-change',
          icon: '⚙️',
          tags: ['systems', 'change', 'implementation']
        }
      );
    }

    if (currentFilter === 'hoodie-economics') {
      filterSpecificContent.push(
        {
          type: 'article',
          title: 'Hoodie Economics Deep Dive',
          description: 'Understanding kindness economics and relationship-based value creation',
          url: '/knowledge/hoodie-economics',
          icon: '👥',
          tags: ['economics', 'kindness', 'relationships']
        },
        {
          type: 'resource',
          title: 'Community Wealth Toolkit',
          description: 'Tools for measuring and building community wealth beyond traditional metrics',
          url: '/toolkits/community-wealth',
          icon: '💰',
          tags: ['community', 'wealth', 'metrics']
        }
      );
    }

    // Theme-specific content
    if (currentTheme === 'indigenous-wisdom') {
      filterSpecificContent.push(
        {
          type: 'resource',
          title: 'Indigenous Knowledge Systems',
          description: 'Learn about Indigenous ways of knowing and their applications in modern contexts',
          url: '/knowledge/indigenous-systems',
          icon: '🧿',
          tags: ['indigenous', 'wisdom', 'knowledge']
        },
        {
          type: 'article',
          title: 'Seven Generation Thinking',
          description: 'Understanding and applying seven generation thinking to decision-making',
          url: '/concepts/seven-generation-thinking',
          icon: '🌱',
          tags: ['thinking', 'sustainability', 'decisions']
        }
      );
    }

    if (currentTheme === 'mentoring') {
      filterSpecificContent.push(
        {
          type: 'app',
          title: 'Mentoring Network',
          description: 'Connect with mentors and mentees in the AIME community',
          url: '/apps/mentoring-network',
          icon: '🤝',
          tags: ['mentoring', 'network', 'relationships']
        },
        {
          type: 'resource',
          title: 'Relationship-First Mentoring Guide',
          description: 'AIME\'s approach to building meaningful mentoring relationships',
          url: '/guides/mentoring',
          icon: '💫',
          tags: ['relationships', 'mentoring', 'guidance']
        }
      );
    }

    return [...baseContent, ...filterSpecificContent].slice(0, 6);
  };

  useEffect(() => {
    setRelatedContent(getRelatedContent());
  }, [currentFilter, currentTheme]);

  if (relatedContent.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">🔗</span>
            Explore Related Knowledge
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Discover more content related to your current exploration
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {videoCount > 0 && `${videoCount} videos filtered`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedContent.map((content, index) => (
          <Link
            key={index}
            href={content.url}
            className="group bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {content.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {content.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {content.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {content.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {content.tags.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{content.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-indigo-200">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/knowledge"
            className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
          >
            <span className="mr-1">📖</span>
            Knowledge Hub
          </Link>
          <Link
            href="/apps"
            className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            <span className="mr-1">🚀</span>
            All Apps
          </Link>
          <Link
            href="/stories"
            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            <span className="mr-1">📚</span>
            Stories
          </Link>
          <Link
            href="/network"
            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <span className="mr-1">🌐</span>
            Network
          </Link>
        </div>
      </div>
    </div>
  );
}