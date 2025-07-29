"use client"

import Link from 'next/link'

// Metadata needs to be in a separate layout file when using client components

export default function ImplementationPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Implementation</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Implementation</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl">
            The IMAGI-NATION Research Synthesis isn't just a document—it's a blueprint for action. 
            This section outlines how these insights can be activated across different contexts.
          </p>
          
          {/* Strategic Release */}
          <h2 className="text-2xl font-semibold mb-6">Strategic Release (January 26, 2025)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Launch Strategy</h3>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coordination with IMAGINE film release
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Simultaneous global embassy activations
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Media and public engagement plan
                </li>
              </ul>
              <Link href="/implementation/launch/strategy" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                View Launch Strategy
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Stakeholder Delivery</h3>
              <p className="text-gray-700 mb-4">Direct delivery to key stakeholders:</p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Government treasurers
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Education ministers
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  UN representatives
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-600 mr-2 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Indigenous knowledge networks
                </li>
              </ul>
              <Link href="/implementation/launch/stakeholder-delivery" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                View Stakeholder Plan
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Resource Hub */}
          <h2 className="text-2xl font-semibold mb-6">Resource Hub</h2>
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/implementation/resources/toolkits" className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-3">Implementation Toolkits</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Practical guides for implementing each recommendation in different contexts.
                </p>
                <div className="text-primary-600 font-medium flex items-center mt-auto">
                  Access Toolkits
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
              
              <Link href="/implementation/resources/connection" className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-3">Connection Platform</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Digital space for implementers to connect, share learnings, and collaborate.
                </p>
                <div className="text-primary-600 font-medium flex items-center mt-auto">
                  Join Platform
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
              
              <Link href="/implementation/resources/funding" className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-3">Funding Pathways</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Resources for securing support to implement recommendations.
                </p>
                <div className="text-primary-600 font-medium flex items-center mt-auto">
                  Explore Funding
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}