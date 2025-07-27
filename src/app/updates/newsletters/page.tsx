"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UpdatesArchive from '@/components/updates/UpdatesArchive'
import SubscriptionForm from '@/components/updates/SubscriptionForm'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Newsletters page
 * 
 * Page for displaying newsletters and subscription form
 */
export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setIsLoading(true);
        
        // Fetch newsletters from our API
        const response = await fetch('/api/newsletters?count=20');
        const data = await response.json();
        
        if (data.success) {
          // Convert ContentItem to PurposeContentItem format
          const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
          const enhancedNewsletters = contentEnhancer.enhanceMultipleWithPurpose(data.data);
          setNewsletters(enhancedNewsletters);
        } else {
          console.error('Failed to fetch newsletters:', data.error);
        }
      } catch (err) {
        console.error('Error fetching newsletters:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsletters();
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
              <li className="text-gray-700 font-medium">Newsletters</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Newsletters</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Browse our collection of newsletters and subscribe to receive future updates directly in your inbox.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Newsletters Archive */}
              <UpdatesArchive 
                updates={newsletters}
                isLoading={isLoading}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Subscription Form */}
              <SubscriptionForm />
              
              {/* Update Categories */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
                    <Link href="/updates/newsletters" className="flex items-center text-primary-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary-600">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                      Newsletters
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates/announcements" className="flex items-center text-gray-700 hover:text-primary-600">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}