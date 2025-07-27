"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  
  // Show footer on all pages now, including homepage
  // (Removed the homepage exclusion so the beautiful footer shows everywhere)

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Brand and Philosophy */}
          <div className="space-y-8">
            <div>
              <Link href="/" className="inline-block mb-6">
                <div className="text-3xl font-light tracking-wide">AIME Knowledge Universe</div>
                <div className="text-gray-400 text-sm mt-2">Indigenous wisdom for systems transformation</div>
              </Link>
              
              <blockquote className="text-xl font-light leading-relaxed text-gray-300 italic">
                "In a world that profits from disconnection, building relationships is a revolutionary act. 
                In a world that profits from limitation, unleashing imagination is the ultimate act of 
                resistance and creation."
              </blockquote>
              <cite className="block text-gray-400 text-sm mt-4">AIME Global Movement</cite>
            </div>

            <div className="text-gray-400 text-sm">
              <p className="mb-2">Established 2005 • 2,700+ knowledge resources</p>
              <p>Twenty years of Indigenous wisdom applied to contemporary challenges</p>
            </div>
          </div>
          
          {/* Navigation and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Core Pathways */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">Core Pathways</h3>
              <nav className="space-y-3">
                <Link href="/discover" className="block text-gray-300 hover:text-white transition-colors">
                  Discover
                </Link>
                <Link href="/learn" className="block text-gray-300 hover:text-white transition-colors">
                  Learn
                </Link>
                <Link href="/understand" className="block text-gray-300 hover:text-white transition-colors">
                  Understand
                </Link>
                <Link href="/connect" className="block text-gray-300 hover:text-white transition-colors">
                  Connect
                </Link>
              </nav>
            </div>

            {/* Knowledge Areas */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">Knowledge Areas</h3>
              <nav className="space-y-3">
                <Link href="/discover?q=indigenous systems thinking" className="block text-gray-300 hover:text-white transition-colors">
                  Indigenous Systems Thinking
                </Link>
                <Link href="/discover?q=hoodie economics" className="block text-gray-300 hover:text-white transition-colors">
                  Hoodie Economics
                </Link>
                <Link href="/discover?q=mentoring methodology" className="block text-gray-300 hover:text-white transition-colors">
                  Mentoring Methodology
                </Link>
                <Link href="/discover?q=joy corps" className="block text-gray-300 hover:text-white transition-colors">
                  Joy Corps Transformation
                </Link>
                <Link href="/discover?q=imagination curriculum" className="block text-gray-300 hover:text-white transition-colors">
                  Imagination Curriculum
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-medium mb-6 text-white">Resources</h3>
              <nav className="space-y-3">
                <Link href="/understanding" className="block text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  🎯 Understanding AIME
                </Link>
                <Link href="/wiki" className="block text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                  📚 Visit the Wiki
                </Link>
                <Link href="/business-cases" className="block text-gray-300 hover:text-white transition-colors">
                  Business Cases
                </Link>
                <Link href="/framing" className="block text-green-400 hover:text-green-300 transition-colors font-medium">
                  🌱 Framing System
                </Link>
                <Link href="/tools" className="block text-gray-300 hover:text-white transition-colors">
                  Tools & Frameworks
                </Link>
                <Link href="/content/videos" className="block text-gray-300 hover:text-white transition-colors">
                  Video Library
                </Link>
                <Link href="/newsletters" className="block text-gray-300 hover:text-white transition-colors">
                  Newsletter Archive
                </Link>
                <Link href="/research" className="block text-gray-300 hover:text-white transition-colors">
                  Research & Insights
                </Link>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Australian Indigenous Mentoring Experience (AIME)</p>
              <p className="mt-1">Indigenous knowledge shared with respect, protocols, and reciprocity</p>
            </div>
            
            <div className="text-gray-400 text-sm">
              <p>Building bridges of imagination since 2005</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}