"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Implementation Toolkits page
 * 
 * Page for implementation toolkits and resources
 */
export default function ImplementationToolkitsPage() {
  const [implementationTools, setImplementationTools] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchImplementationTools = async () => {
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
        
        // Filter for implementation tools
        const implementationTools = enhancedContent.filter(item => 
          (item.primaryPurpose === 'tool' || item.secondaryPurposes?.includes('tool')) &&
          item.toolDetails?.toolType === 'implementation'
        );
        
        // Sort by relevance (highest purpose relevance first)
        implementationTools.sort((a, b) => b.purposeRelevance - a.purposeRelevance);
        
        setImplementationTools(implementationTools);
      } catch (err) {
        console.error('Error fetching implementation tools:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImplementationTools();
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
              <li><Link href="/tools" className="hover:text-primary-600">Tools & Resources</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Implementation Toolkits</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Implementation Toolkits</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Comprehensive toolkits for implementing AIME programs and initiatives. These toolkits provide
            step-by-step guidance, resources, and templates for successful implementation.
          </p>
          
          {/* Featured Implementation Toolkit */}
          {implementationTools.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-full">
                      {implementationTools[0].thumbnail ? (
                        <Image
                          src={implementationTools[0].thumbnail}
                          alt={implementationTools[0].title}
                          fill
                          style={{objectFit: 'cover'}}
                          className="bg-gray-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-500">
                            <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Featured Implementation Toolkit
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{implementationTools[0].title}</h2>
                    <p className="text-gray-600 mb-6">{implementationTools[0].description}</p>
                    {implementationTools[0].toolDetails?.targetAudience && implementationTools[0].toolDetails.targetAudience.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h3>
                        <div className="flex flex-wrap gap-2">
                          {implementationTools[0].toolDetails.targetAudience.map((audience, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full"
                            >
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Link href={`/tools/${implementationTools[0].id}`} className="btn btn-primary">
                      View Toolkit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Implementation Toolkits Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">All Implementation Toolkits</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : implementationTools.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No implementation toolkits found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any implementation toolkits. Check back later for new content.
                </p>
                <Link href="/tools" className="btn btn-primary">
                  View All Tools
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skip the first tool if it's already featured */}
                {implementationTools.slice(1).map((tool) => (
                  <div key={tool.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/tools/${tool.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {tool.thumbnail ? (
                          <Image
                            src={tool.thumbnail}
                            alt={tool.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-blue-500">
                              <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{tool.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
                        {tool.toolDetails?.targetAudience && tool.toolDetails.targetAudience.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">For:</span>
                            <span>{tool.toolDetails.targetAudience.join(', ')}</span>
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