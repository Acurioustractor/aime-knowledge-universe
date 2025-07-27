"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UpdatesArchive from '@/components/updates/UpdatesArchive'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Announcements page
 * 
 * Page for displaying announcements and important updates
 */
export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnnouncements = async () => {
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
        
        // Filter for announcements
        const announcements = enhancedContent.filter(item => 
          (item.primaryPurpose === 'update' || item.secondaryPurposes?.includes('update')) &&
          item.updateDetails?.updateType === 'announcement'
        );
        
        // Sort by date (most recent first)
        announcements.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        
        setAnnouncements(announcements);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
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
              <li className="text-gray-700 font-medium">Announcements</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Announcements</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Stay informed with important announcements and updates from across the IMAGI-NATION network.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Announcements Archive */}
              <UpdatesArchive 
                updates={announcements}
                isLoading={isLoading}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Featured Announcement */}
              {announcements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Featured Announcement</h2>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {announcements[0].date && new Date(announcements[0].date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{announcements[0].title}</h3>
                  <p className="text-gray-600 mb-4">{announcements[0].description}</p>
                  <Link href={`/updates/${announcements[0].id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                    Read More →
                  </Link>
                </div>
              )}
              
              {/* Update Categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Update Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/updates/latest" className="flex items-center text-gray-700 hover:text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                      Latest Updates
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates/newsletters" className="flex items-center text-gray-700 hover:text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                      Newsletters
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates/announcements" className="flex items-center text-primary-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                      </svg>
                      Announcements
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates" className="flex items-center text-gray-700 hover:text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                      </svg>
                      All Updates
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Newsletter Subscription */}
              <div className="bg-primary-50 rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-semibold mb-2">Stay Updated</h2>
                <p className="text-gray-600 mb-4">
                  Subscribe to our newsletter to receive the latest updates and announcements.
                </p>
                <Link href="/updates/newsletters" className="btn btn-primary w-full">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}