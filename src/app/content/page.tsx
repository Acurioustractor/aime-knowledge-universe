"use client"

import Link from 'next/link'
import Image from 'next/image'

// Metadata moved to layout.tsx

export default function ContentPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Content Archive</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Content Archive</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Explore our collection of 250+ episodes and workshops featuring conversations with young people, 
            Indigenous knowledge holders, prime ministers, educators, artists, and systems thinkers from 52 countries.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link href="/content/videos" className="card group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/assets/images/Uluru Day 1-136.jpg"
                  alt="Video Archive"
                  fill
                  style={{objectFit: 'cover'}}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold">Video Archive</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Browse our collection of IMAGI-NATION {'{TV}'} episodes featuring conversations with participants from around the world.
                </p>
                <div className="text-primary-600 font-medium flex items-center">
                  Explore Videos
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
            
            <Link href="/newsletters" className="card group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/assets/images/School - Day 4-44.jpg"
                  alt="Newsletter Archive"
                  fill
                  style={{objectFit: 'cover'}}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold">Newsletter Archive</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Access our collection of newsletters featuring updates on our research synthesis, featured episodes, and insights.
                </p>
                <div className="text-primary-600 font-medium flex items-center">
                  Browse Newsletters
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Content by Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Imagination & Creativity</h3>
              <p className="text-gray-600 mb-4">
                Explore content focused on nurturing imagination as a core human capacity.
              </p>
              <Link href="/content/themes/imagination" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Theme
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Relational Economies</h3>
              <p className="text-gray-600 mb-4">
                Discover content about creating economies based on relationship rather than transaction.
              </p>
              <Link href="/content/themes/relational-economies" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Theme
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Indigenous Systems Thinking</h3>
              <p className="text-gray-600 mb-4">
                Learn from Indigenous wisdom and knowledge systems that offer solutions to contemporary challenges.
              </p>
              <Link href="/content/themes/indigenous-systems" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Theme
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Integrated Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500 mr-2">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-lg">YouTube Videos</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access our collection of 250+ IMAGI-NATION {'{TV}'} episodes featuring conversations with participants from around the world.
              </p>
              <Link href="/content/videos" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Videos
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500 mr-2">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <h3 className="font-semibold text-lg">Mailchimp Newsletters</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access our collection of newsletters featuring updates on our research synthesis, featured episodes, and insights.
              </p>
              <Link href="/newsletters" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Newsletters
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500 mr-2">
                  <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
                <h3 className="font-semibold text-lg">Airtable Resources</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Explore our structured database of resources, events, and implementation toolkits from Airtable.
              </p>
              <Link href="/knowledge-hub" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Browse Resources
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-primary-900 text-white rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-4">AIME Knowledge Hub</h2>
                <p className="mb-6">
                  Access our comprehensive collection of resources from three core AIME repositories: aime-knowledge-hub, 
                  aime-artifacts, and AIMEdashboards - all integrated into one unified platform.
                </p>
                <Link 
                  href="/knowledge-hub"
                  className="btn bg-white text-primary-900 hover:bg-gray-100"
                >
                  Explore Knowledge Hub
                </Link>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/School - Day 4-16.jpg"
                    alt="Knowledge Hub"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}