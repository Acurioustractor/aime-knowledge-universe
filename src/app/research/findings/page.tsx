"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Research Findings page
 * 
 * Page for research findings and key insights
 */
export default function ResearchFindingsPage() {
  const [findings, setFindings] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFindings = async () => {
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
        
        // Filter for research findings
        const findings = enhancedContent.filter(item => 
          (item.primaryPurpose === 'research' || item.secondaryPurposes?.includes('research')) &&
          item.researchDetails?.researchType === 'finding'
        );
        
        // Sort by date (newest first)
        findings.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        
        setFindings(findings);
      } catch (err) {
        console.error('Error fetching research findings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFindings();
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
              <li><Link href="/research" className="hover:text-primary-600">Research & Insights</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Research Findings</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Research Findings</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Explore key findings from our research and evaluation work. These findings provide
            evidence-based insights into the impact and effectiveness of our programs.
          </p>
          
          {/* Featured Finding */}
          {findings.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-full">
                      {findings[0].thumbnail ? (
                        <Image
                          src={findings[0].thumbnail}
                          alt={findings[0].title}
                          fill
                          style={{objectFit: 'cover'}}
                          className="bg-gray-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-500">
                            <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Featured Finding
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{findings[0].title}</h2>
                    <p className="text-gray-600 mb-6">{findings[0].description}</p>
                    {findings[0].researchDetails?.keyFindings && findings[0].researchDetails.keyFindings.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Key Finding</h3>
                        <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700">
                          {findings[0].researchDetails.keyFindings[0]}
                        </blockquote>
                      </div>
                    )}
                    <Link href={`/research/${findings[0].id}`} className="btn btn-primary">
                      Read Full Research
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Findings Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">All Findings</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : findings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No findings found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any research findings. Check back later for new content.
                </p>
                <Link href="/research" className="btn btn-primary">
                  View All Research
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skip the first finding if it's already featured */}
                {findings.slice(1).map((finding) => (
                  <div key={finding.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/research/${finding.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {finding.thumbnail ? (
                          <Image
                            src={finding.thumbnail}
                            alt={finding.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-blue-500">
                              <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{finding.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{finding.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {finding.date && (
                            <span>{new Date(finding.date).toLocaleDateString()}</span>
                          )}
                          {finding.authors && finding.authors.length > 0 && (
                            <span className="ml-auto">{finding.authors[0]}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Back to Research */}
          <div className="text-center">
            <Link href="/research" className="btn btn-primary">
              View All Research
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}