"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Tool Detail page
 * 
 * Dynamic page for displaying individual tools
 */
export default function ToolDetailPage() {
  const params = useParams();
  const toolId = params.id as string;
  
  const [tool, setTool] = useState<PurposeContentItem | null>(null);
  const [relatedTools, setRelatedTools] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTool = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Import the integration functions
        const { getContentById, getAllContent } = await import('@/lib/integrations');
        
        // Fetch the tool by ID
        const toolContent = await getContentById(toolId);
        
        if (!toolContent) {
          setError('Tool not found');
          return;
        }
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
        
        // Enhance content with purpose fields
        const enhancedTool = contentEnhancer.enhanceWithPurpose(toolContent);
        
        // Check if it's a tool
        if (enhancedTool.primaryPurpose !== 'tool' && !enhancedTool.secondaryPurposes?.includes('tool')) {
          setError('Content is not a tool');
          return;
        }
        
        setTool(enhancedTool);
        
        // Fetch related tools
        const allContent = await getAllContent();
        const enhancedContent = contentEnhancer.enhanceMultipleWithPurpose(allContent);
        
        // Filter for tools
        const tools = enhancedContent.filter(item => 
          (item.primaryPurpose === 'tool' || item.secondaryPurposes?.includes('tool')) &&
          item.id !== toolId
        );
        
        // Find related tools based on themes and topics
        const toolThemes = enhancedTool.themes?.map(theme => theme.id) || [];
        const toolTopics = enhancedTool.topics?.map(topic => topic.id) || [];
        
        // Score tools by relevance to this tool
        const scoredTools = tools.map(item => {
          let score = 0;
          
          // Score by matching themes
          item.themes?.forEach(theme => {
            if (toolThemes.includes(theme.id)) {
              score += 10;
            }
          });
          
          // Score by matching topics
          item.topics?.forEach(topic => {
            if (toolTopics.includes(topic.id)) {
              score += 5;
            }
          });
          
          // Score by matching tool type
          if (item.toolDetails?.toolType === enhancedTool.toolDetails?.toolType) {
            score += 8;
          }
          
          // Score by matching audience
          const toolAudience = enhancedTool.toolDetails?.targetAudience || [];
          const itemAudience = item.toolDetails?.targetAudience || [];
          const matchingAudience = itemAudience.filter(audience => toolAudience.includes(audience));
          score += matchingAudience.length * 5;
          
          return {
            ...item,
            relationScore: score
          };
        });
        
        // Sort by relation score (descending)
        scoredTools.sort((a, b) => b.relationScore - a.relationScore);
        
        // Get top 3 related tools
        setRelatedTools(scoredTools.slice(0, 3).map(({ relationScore, ...item }) => item));
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError('Failed to load tool. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (toolId) {
      fetchTool();
    }
  }, [toolId]);
  
  // Get tool type label
  const getToolTypeLabel = (type?: string) => {
    switch (type) {
      case 'implementation':
        return 'Implementation Toolkit';
      case 'worksheet':
        return 'Worksheet';
      case 'guide':
        return 'Guide';
      case 'template':
        return 'Template';
      case 'toolkit':
        return 'Complete Toolkit';
      default:
        return 'Tool';
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
              <li className="text-gray-700 font-medium">Tool Details</li>
            </ol>
          </nav>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{error}</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find the tool you're looking for.
              </p>
              <Link href="/tools" className="btn btn-primary">
                View All Tools
              </Link>
            </div>
          ) : tool ? (
            <div>
              {/* Tool Header */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                    {getToolTypeLabel(tool.toolDetails?.toolType)}
                  </span>
                  {tool.date && (
                    <span className="text-sm text-gray-500">
                      {new Date(tool.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{tool.title}</h1>
                <p className="text-xl text-gray-700 mb-6">{tool.description}</p>
                {tool.authors && tool.authors.length > 0 && (
                  <p className="text-sm text-gray-500">
                    By {tool.authors.join(', ')}
                  </p>
                )}
              </div>
              
              {/* Tool Content */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                {/* Thumbnail */}
                {tool.thumbnail && (
                  <div className="mb-8">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={tool.thumbnail}
                        alt={tool.title}
                        fill
                        style={{objectFit: 'cover'}}
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                )}
                
                {/* Content */}
                {tool.content ? (
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: tool.content }} />
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No content available for this tool.
                  </p>
                )}
                
                {/* Usage Instructions */}
                {tool.toolDetails?.usageInstructions && (
                  <div className="mt-8 border-l-4 border-primary-500 pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-4">Usage Instructions</h3>
                    <p className="text-gray-700">
                      {tool.toolDetails.usageInstructions}
                    </p>
                  </div>
                )}
                
                {/* Target Audience and Implementation Context */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tool.toolDetails?.targetAudience && tool.toolDetails.targetAudience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.toolDetails.targetAudience.map((audience, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tool.toolDetails?.implementationContext && tool.toolDetails.implementationContext.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Implementation Context</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.toolDetails.implementationContext.map((context, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full"
                          >
                            {context}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Prerequisites */}
                {tool.toolDetails?.prerequisites && tool.toolDetails.prerequisites.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {tool.toolDetails.prerequisites.map((prerequisite, index) => (
                        <li key={index}>{prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Themes and Topics */}
                <div className="mt-8">
                  {tool.themes && tool.themes.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.themes.map(theme => (
                          <span 
                            key={theme.id} 
                            className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                          >
                            {theme.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tool.topics && tool.topics.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.topics.map(topic => (
                          <span 
                            key={topic.id} 
                            className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full"
                          >
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6">Related Tools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedTools.map((relatedTool) => (
                      <div key={relatedTool.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Link href={`/tools/${relatedTool.id}`} className="block hover:opacity-95 transition-opacity">
                          <div className="relative h-48">
                            {relatedTool.thumbnail ? (
                              <Image
                                src={relatedTool.thumbnail}
                                alt={relatedTool.title}
                                fill
                                style={{objectFit: 'cover'}}
                                className="bg-gray-100"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-300">
                                  <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-0 left-0 m-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                {getToolTypeLabel(relatedTool.toolDetails?.toolType)}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2 line-clamp-2">{relatedTool.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{relatedTool.description}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Back to Tools */}
              <div className="text-center">
                <Link href="/tools" className="btn btn-primary">
                  View All Tools
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}