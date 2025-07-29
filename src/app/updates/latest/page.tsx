"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LatestUpdates from '@/components/updates/LatestUpdates'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Latest Updates page
 * 
 * Page for displaying the latest updates and news
 */
export default function LatestUpdatesPage() {
  const [latestUpdates, setLatestUpdates] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        setIsLoading(true);
        
        // Import the integration functions
        const { getAllContent } = await import('@/lib/integrations');
        
        // Fetch all content
        const allContent = await getAllContent();
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceMultipleWithPurpose(allContent);
        
        // Filter for updates (primary or secondary purpose)
        const updates = enhancedContent.filter(item => 
          item.primaryPurpose === 'update' || 
          item.secondaryPurposes?.includes('update')
        );
        
        // Sort by date (most recent first)
        updates.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        
        setLatestUpdates(updates);
      } catch (err) {
        console.error('Error fetching latest updates:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLatestUpdates();
  }, []);
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/updates" className="hover:text-primary-600">Updates & News</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Latest Updates</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Latest Updates</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Stay informed with the most recent updates, announcements, and news from across the IMAGI-NATION network.
          </p>
          
          {/* Latest Updates */}
          <div className="mb-12">
            <LatestUpdates 
              updates={latestUpdates}
              isLoading={isLoading}
            />
          </div>
          
          {/* Newsletter Subscription */}
          <div className="bg-primary-50 rounded-lg shadow-md p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-2">Subscribe to Our Newsletter</h2>
                <p className="text-gray-600">
                  Stay up to date with the latest updates, announcements, and news. Subscribe to our newsletter to receive regular updates directly in your inbox.
                </p>
              </div>
              <div className="md:w-1/3">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Update Categories Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/updates" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500 mr-3">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">All Updates</h3>
                </div>
                <p className="text-gray-600">
                  View all updates and news.
                </p>
              </Link>
              
              <Link href="/updates/newsletters" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500 mr-3">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Newsletters</h3>
                </div>
                <p className="text-gray-600">
                  Browse all newsletters and subscribe to receive future updates.
                </p>
              </Link>
              
              <Link href="/updates/announcements" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500 mr-3">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Announcements</h3>
                </div>
                <p className="text-gray-600">
                  View important announcements and updates.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}