"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'

export default function StoryPage() {
  const params = useParams();
  const storyId = params.id as string;
  
  const [story, setStory] = useState<PurposeContentItem | null>(null);
  const [relatedStories, setRelatedStories] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch story and related stories
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true);
        
        // Import the integration functions
        const { getContentById } = await import('@/lib/integrations');
        
        // Fetch the story by ID
        const content = await getContentById(storyId);
        
        if (!content) {
          console.error(`Story with ID ${storyId} not found`);
          setIsLoading(false);
          return;
        }
        
        // Create content enhancer
        const { DefaultContentEnhancer } = await import('@/lib/content-organization/utils/content-enhancer');
        const { DefaultPurposeClassifier } = await import('@/lib/content-organization/classifiers/purpose-classifier');
        
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceWithPurpose(content);
        
        // Set the story
        setStory(enhancedContent);
        
        // For now, use mock related stories
        // In a real implementation, we would fetch related stories from the API
        setRelatedStories(getMockRelatedStories());
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStory();
  }, [storyId]);
  
  // Get story type label
  const getStoryTypeLabel = (type?: string) => {
    switch (type) {
      case 'personal':
        return 'Personal Story';
      case 'case_study':
        return 'Case Study';
      case 'impact':
        return 'Impact Story';
      case 'journey':
        return 'Journey';
      default:
        return 'Story';
    }
  };
  
  // Mock story for testing
  function getMockStory(id: string): PurposeContentItem {
    return {
      id,
      title: 'Personal Story: My Journey in Education',
      description: 'A personal story about my journey in education and how it transformed my perspective on learning.',
      content: 'This is the full content of the story. It would include paragraphs of text describing the personal journey in education.',
      contentType: 'video',
      source: 'youtube',
      url: 'https://youtube.com/watch?v=123',
      date: '2023-01-01',
      tags: ['story', 'personal', 'journey', 'education'],
      themes: [{ id: 'theme1', name: 'Education', relevance: 90 }],
      topics: [{ id: 'topic1', name: 'Personal Growth', keywords: ['growth'] }],
      authors: ['Author 1'],
      thumbnail: '/assets/images/School - Day 4-16.jpg',
      primaryPurpose: 'story',
      purposeRelevance: 90,
      storyDetails: {
        storyType: 'personal',
        keyQuotes: [
          'Education is not just about learning facts, but about transforming perspectives.',
          'The journey of education is as important as the destination.'
        ],
        protagonists: ['Author 1']
      }
    };
  }
  
  // Mock related stories for testing
  function getMockRelatedStories(): PurposeContentItem[] {
    return [
      {
        id: 'story2',
        title: 'Impact Story: Education in Rural Communities',
        description: 'A story about the impact of education initiatives in rural communities and how they are changing lives.',
        contentType: 'video',
        source: 'youtube',
        url: 'https://youtube.com/watch?v=456',
        date: '2023-01-20',
        tags: ['story', 'impact', 'education', 'rural'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 85 }],
        topics: [{ id: 'topic5', name: 'Rural Education', keywords: ['rural'] }],
        authors: ['Author 6'],
        thumbnail: '/assets/images/School - Day 4-20.jpg',
        primaryPurpose: 'story',
        purposeRelevance: 85,
        storyDetails: {
          storyType: 'impact'
        },
        relationshipStrength: 80
      },
      {
        id: 'story3',
        title: 'Case Study: Innovative Learning Approaches',
        description: 'A case study examining innovative approaches to learning and their outcomes in different contexts.',
        contentType: 'document',
        source: 'airtable',
        url: 'https://example.com/case-study',
        date: '2023-01-15',
        tags: ['story', 'case study', 'education', 'innovation'],
        themes: [{ id: 'theme1', name: 'Education', relevance: 80 }, { id: 'theme2', name: 'Innovation', relevance: 85 }],
        topics: [{ id: 'topic6', name: 'Learning Innovation', keywords: ['innovation'] }],
        authors: ['Author 7'],
        thumbnail: '/assets/images/School - Day 4-44.jpg',
        primaryPurpose: 'story',
        purposeRelevance: 80,
        storyDetails: {
          storyType: 'case_study'
        },
        relationshipStrength: 70
      }
    ];
  }
  
  if (isLoading || !story) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-wiki">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/stories" className="hover:text-primary-600">Stories & Narratives</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">{story.title}</li>
            </ol>
          </nav>
          
          {/* Story Header */}
          <div className="mb-8">
            {story.storyDetails?.storyType && (
              <div className="mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {getStoryTypeLabel(story.storyDetails.storyType)}
                </span>
              </div>
            )}
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{story.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{story.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              {story.date && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                  </svg>
                  <span>{new Date(story.date).toLocaleDateString()}</span>
                </div>
              )}
              {story.authors && story.authors.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  <span>{story.authors.join(', ')}</span>
                </div>
              )}
              {story.themes && story.themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.themes.map(theme => (
                    <span 
                      key={theme.id} 
                      className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Story Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {story.thumbnail && (
              <div className="relative h-96 w-full">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  style={{objectFit: 'cover'}}
                  className="bg-gray-100"
                />
              </div>
            )}
            <div className="p-8">
              {story.contentType === 'video' && story.url && (
                <div className="aspect-w-16 aspect-h-9 mb-8">
                  <div className="bg-gray-100 flex items-center justify-center p-8 rounded-lg">
                    <p className="text-gray-500">Video content would be embedded here.</p>
                  </div>
                </div>
              )}
              
              {story.content && (
                <div className="prose prose-lg max-w-none">
                  <p>{story.content}</p>
                </div>
              )}
              
              {/* Key Quotes */}
              {story.storyDetails?.keyQuotes && story.storyDetails.keyQuotes.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Key Quotes</h2>
                  <div className="space-y-4">
                    {story.storyDetails.keyQuotes.map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-primary-500 pl-4 py-2 italic text-gray-700">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Stories */}
          {relatedStories.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Related Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedStories.map((relatedStory) => (
                  <div key={relatedStory.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/stories/${relatedStory.id}`} className="block hover:opacity-95 transition-opacity">
                      <div className="relative h-48">
                        {relatedStory.thumbnail ? (
                          <Image
                            src={relatedStory.thumbnail}
                            alt={relatedStory.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="bg-gray-100"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                              <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm4.5 7.5a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75zm-4.5.75a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75v-3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Story type badge */}
                        {relatedStory.storyDetails?.storyType && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {getStoryTypeLabel(relatedStory.storyDetails.storyType)}
                            </span>
                          </div>
                        )}
                        
                        {/* Relationship strength */}
                        {relatedStory.relationshipStrength && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {relatedStory.relationshipStrength >= 80 ? 'Strong' : 
                               relatedStory.relationshipStrength >= 60 ? 'Medium' : 'Weak'} Relation
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{relatedStory.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{relatedStory.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {relatedStory.themes?.slice(0, 2).map(theme => (
                            <span 
                              key={theme.id} 
                              className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full"
                            >
                              {theme.name}
                            </span>
                          ))}
                          {relatedStory.date && (
                            <span className="text-xs text-gray-500 ml-auto">
                              {new Date(relatedStory.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}