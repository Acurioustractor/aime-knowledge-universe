"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Worksheets & Guides page
 * 
 * Page for worksheets and guides
 */
export default function WorksheetsPage() {
  const [worksheets, setWorksheets] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorksheets = async () => {
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
        
        // Filter for worksheets and guides
        const worksheets = enhancedContent.filter(item => 
          (item.primaryPurpose === 'tool' || item.secondaryPurposes?.includes('tool')) &&
          (item.toolDetails?.toolType === 'worksheet' || item.toolDetails?.toolType === 'guide')
        );
        
        // Sort by relevance (highest purpose relevance first)
        worksheets.sort((a, b) => b.purposeRelevance - a.purposeRelevance);
        
        setWorksheets(worksheets);
      } catch (err) {
        console.error('Error fetching worksheets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorksheets();
  }, []);
  
  // Get tool type label
  const getToolTypeLabel = (type?: string) => {
    switch (type) {
      case 'worksheet':
        return 'Worksheet';
      case 'guide':
        return 'Guide';
      default:
        return 'Resource';
    }
  };
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/tools" className="hover:text-primary-600">Tools & Resources</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Worksheets & Guides</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Worksheets & Guides</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Practical worksheets and step-by-step guides for various activities and processes. These resources
            are designed to help you implement specific practices and approaches.
          </p>
          
          {/* Worksheets vs Guides Tabs */}
          <div className="mb-12">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className="border-primary-500 text-primary-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  All Resources
                </button>
                <button
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Worksheets
                </button>
                <button
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Guides
                </button>
              </nav>
            </div>
          </div>
          
          {/* Worksheets Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Worksheets & Guides</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : worksheets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No worksheets or guides found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any worksheets or guides. Check back later for new content.
                </p>
                <Link href="/tools" className="btn btn-primary">
                  View All Tools
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {worksheets.map((worksheet) => (
                  <div key={worksheet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/tools/${worksheet.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {worksheet.thumbnail ? (
                          <Image
                            src={worksheet.thumbnail}
                            alt={worksheet.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            {worksheet.toolDetails?.toolType === 'worksheet' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-500">
                                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-purple-500">
                                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                              </svg>
                            )}
                          </div>
                        )}
                        <div className="absolute top-0 left-0 m-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {getToolTypeLabel(worksheet.toolDetails?.toolType)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{worksheet.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{worksheet.description}</p>
                        {worksheet.toolDetails?.targetAudience && worksheet.toolDetails.targetAudience.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">For:</span>
                            <span>{worksheet.toolDetails.targetAudience.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Back to Tools */}
          <div className="text-center">
            <Link href="/tools" className="btn btn-primary">
              View All Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}