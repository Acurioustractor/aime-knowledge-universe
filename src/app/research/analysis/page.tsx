"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Research Analysis page
 * 
 * Page for data analysis and statistical research
 */
export default function ResearchAnalysisPage() {
  const [analysisContent, setAnalysisContent] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
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
        
        // Filter for research analysis
        const analysis = enhancedContent.filter(item => 
          (item.primaryPurpose === 'research' || item.secondaryPurposes?.includes('research')) &&
          item.researchDetails?.researchType === 'analysis'
        );
        
        // Sort by relevance (highest purpose relevance first)
        analysis.sort((a, b) => b.purposeRelevance - a.purposeRelevance);
        
        setAnalysisContent(analysis);
      } catch (err) {
        console.error('Error fetching research analysis:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
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
              <li className="text-gray-700 font-medium">Data Analysis</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Data Analysis</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Explore data analysis and statistical research that provides insights into patterns,
            trends, and correlations across various datasets and sources.
          </p>
          
          {/* Featured Analysis */}
          {analysisContent.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-full">
                      {analysisContent[0].thumbnail ? (
                        <Image
                          src={analysisContent[0].thumbnail}
                          alt={analysisContent[0].title}
                          fill
                          style={{objectFit: 'cover'}}
                          className="bg-gray-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-green-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-500">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured Analysis
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{analysisContent[0].title}</h2>
                    <p className="text-gray-600 mb-6">{analysisContent[0].description}</p>
                    <div className="mb-6">
                      {analysisContent[0].researchDetails?.keyFindings && analysisContent[0].researchDetails.keyFindings.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {analysisContent[0].researchDetails.keyFindings.slice(0, 2).map((finding, index) => (
                              <li key={index}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Link href={`/research/${analysisContent[0].id}`} className="btn btn-primary">
                      View Full Analysis
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Analysis Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">All Data Analysis</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : analysisContent.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No data analysis found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any data analysis content. Check back later for new content.
                </p>
                <Link href="/research" className="btn btn-primary">
                  View All Research
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skip the first analysis if it's already featured */}
                {analysisContent.slice(1).map((analysis) => (
                  <div key={analysis.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/research/${analysis.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {analysis.thumbnail ? (
                          <Image
                            src={analysis.thumbnail}
                            alt={analysis.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-500">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{analysis.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{analysis.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {analysis.themes?.slice(0, 2).map(theme => (
                            <span 
                              key={theme.id} 
                              className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {analysis.date && (
                            <span>{new Date(analysis.date).toLocaleDateString()}</span>
                          )}
                          {analysis.authors && analysis.authors.length > 0 && (
                            <span className="ml-auto">{analysis.authors[0]}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Related Research Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Explore Other Research Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/research/findings" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500 mr-3">
                    <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">Research Findings</h3>
                </div>
                <p className="text-gray-600">
                  Key findings from research studies and evaluations.
                </p>
              </Link>
              
              <Link href="/research/synthesis" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-purple-500 mr-3">
                    <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Synthesis Documents</h3>
                </div>
                <p className="text-gray-600">
                  Synthesis of research findings and insights.
                </p>
              </Link>
              
              <Link href="/research" className="bg-white rounded-lg shadow-md p-6 hover:bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-500 mr-3">
                    <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold">All Research</h3>
                </div>
                <p className="text-gray-600">
                  View all research and insights content.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}