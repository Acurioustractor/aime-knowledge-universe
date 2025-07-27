'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { VideoFeed } from '@/components/VideoComponents'

interface ContentStats {
  knowledge_documents: number;
  business_cases: number;
  tools: number;
  videos: number;
  total: number;
}

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [featuredInsight, setFeaturedInsight] = useState<string>('');

  useEffect(() => {
    loadContentStats();
    setFeaturedInsight(getRandomInsight());
  }, []);

  const loadContentStats = async () => {
    try {
      const response = await fetch('/api/unified-search?q=test&limit=1');
      const data = await response.json();
      if (data.success && data.data.search_stats) {
        setStats(data.data.search_stats.total_content);
      }
    } catch (error) {
      // Fallback stats
      setStats({
        knowledge_documents: 19,
        business_cases: 8,
        tools: 500,
        videos: 6,
        total: 2700
      });
    }
  };

  const getRandomInsight = () => {
    const insights = [
      "Indigenous wisdom and modern systems thinking converge in unexpected ways",
      "Relational economics transforms how we understand value creation",
      "Seven-generation thinking reshapes organizational decision-making",
      "Mentoring relationships become the foundation for systemic change",
      "Imagination serves as the primary currency in knowledge economies"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-wide text-gray-900">
                AIME Knowledge Universe
              </h1>
              <p className="text-gray-600 mt-1">
                Indigenous wisdom for systems transformation
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              {stats && stats.total && (
                <p>{stats.total.toLocaleString()} resources</p>
              )}
              <p>Established 2005</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-extralight text-gray-900 mb-8 leading-tight">
            Transforming systems through<br />
            relational understanding
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Twenty years of Indigenous wisdom, mentoring methodology, and systems 
            thinking made searchable and accessible for those ready to reimagine 
            how organizations, communities, and individuals create lasting change.
          </p>

          {/* Search Interface */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="What would you like to understand?"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-none focus:outline-none focus:border-gray-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-8 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mb-16">{featuredInsight}</p>
        </div>
      </section>

      {/* Navigation Pathways */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-light text-gray-900 mb-12 text-center">
            Choose your pathway to understanding
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/discover" className="group">
              <div className="bg-white p-8 h-full hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-gray-300">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  Discover
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Browse through our comprehensive collection of Indigenous wisdom, 
                  business cases, and transformational tools. Perfect for exploration 
                  and serendipitous learning.
                </p>
                <div className="text-sm text-gray-500">
                  {stats && (
                    <>
                      <span>{stats.knowledge_documents} knowledge documents</span>
                      <span className="mx-2">•</span>
                      <span>{stats.business_cases} business cases</span>
                      <span className="mx-2">•</span>
                      <span>{stats.tools} tools</span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            <Link href="/apps" className="group">
              <div className="bg-white p-8 h-full hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-purple-300">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  📱 Apps
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Interactive applications that bring AIME's wisdom to life. 
                  From IMAGI-NATION TV to mentoring tools, experience 
                  imagination-powered learning.
                </p>
                <div className="text-sm text-gray-500">
                  <span>IMAGI-NATION TV</span>
                  <span className="mx-2">•</span>
                  <span>Mentor App</span>
                  <span className="mx-2">•</span>
                  <span>Film Map</span>
                </div>
              </div>
            </Link>

            <Link href="/learn" className="group">
              <div className="bg-white p-8 h-full hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-gray-300">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  Learn
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Follow structured pathways through AIME's methodology. 
                  From mentoring fundamentals to systems transformation, 
                  build understanding step by step.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Guided learning paths</span>
                  <span className="mx-2">•</span>
                  <span>Progress tracking</span>
                  <span className="mx-2">•</span>
                  <span>Community validation</span>
                </div>
              </div>
            </Link>

            <Link href="/understand" className="group">
              <div className="bg-white p-8 h-full hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-gray-300">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  Understand
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  See how concepts connect across Indigenous knowledge systems, 
                  organizational change, and practical implementation. 
                  Visualize relationships between ideas.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Knowledge mapping</span>
                  <span className="mx-2">•</span>
                  <span>Concept relationships</span>
                  <span className="mx-2">•</span>
                  <span>Systems thinking</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Essential Questions */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Essential Questions
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/discover?q=hoodie economics"
                  className="block text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100 hover:border-gray-300 transition-colors"
                >
                  What is hoodie economics and how does it work?
                </Link>
                <Link 
                  href="/discover?q=indigenous systems thinking"
                  className="block text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100 hover:border-gray-300 transition-colors"
                >
                  How does Indigenous wisdom inform systems change?
                </Link>
                <Link 
                  href="/discover?q=mentoring methodology"
                  className="block text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100 hover:border-gray-300 transition-colors"
                >
                  What makes AIME's mentoring approach unique?
                </Link>
                <Link 
                  href="/discover?q=joy corps transformation"
                  className="block text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100 hover:border-gray-300 transition-colors"
                >
                  How do organizations transform through Joy Corps?
                </Link>
              </div>
            </div>

            {/* Content Types */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Explore by Format
              </h3>
              <div className="space-y-4">
                <Link 
                  href="/apps"
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 -mx-4 transition-colors"
                >
                  <span className="text-gray-700">📱 Interactive Apps</span>
                  <span className="text-sm text-gray-500">
                    4 applications
                  </span>
                </Link>
                <Link 
                  href="/content/videos"
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 -mx-4 transition-colors"
                >
                  <span className="text-gray-700">Video Library</span>
                  <span className="text-sm text-gray-500">
                    {stats?.videos || 423} recordings
                  </span>
                </Link>
                <Link 
                  href="/business-cases"
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 -mx-4 transition-colors"
                >
                  <span className="text-gray-700">Business Cases</span>
                  <span className="text-sm text-gray-500">
                    {stats?.business_cases || 16} studies
                  </span>
                </Link>
                <Link 
                  href="/tools"
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 -mx-4 transition-colors"
                >
                  <span className="text-gray-700">Tools & Resources</span>
                  <span className="text-sm text-gray-500">
                    {stats?.tools || 824} items
                  </span>
                </Link>
                <Link 
                  href="/newsletters"
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-4 -mx-4 transition-colors"
                >
                  <span className="text-gray-700">Newsletter Archive</span>
                  <span className="text-sm text-gray-500">
                    Years of insights
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGI-NATION TV Featured Episodes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <VideoFeed 
            title="IMAGI-NATION TV"
            subtitle="Interactive learning experiences bridging Indigenous wisdom with modern challenges"
            limit={3}
            variant="grid"
            filter="featured"
            showHeader={true}
          />
        </div>
      </section>

      {/* Philosophy Footer */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl font-light leading-relaxed mb-8">
            "In a world that profits from disconnection, building relationships 
            is a revolutionary act. In a world that profits from limitation, 
            unleashing imagination is the ultimate act of resistance and creation."
          </blockquote>
          <cite className="text-gray-400">AIME Global Movement</cite>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex justify-center space-x-8 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About AIME
              </Link>
              <Link href="/discover" className="text-gray-400 hover:text-white transition-colors">
                Browse All Content
              </Link>
              <Link href="/learn" className="text-gray-400 hover:text-white transition-colors">
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}