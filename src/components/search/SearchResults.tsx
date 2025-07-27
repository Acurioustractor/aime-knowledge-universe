/**
 * Search Results Component
 * 
 * Progressive search result disclosure with AI-powered summarization
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  SparklesIcon,
  BookOpenIcon,
  PlayIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  NewspaperIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
  content: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    content_type: string;
    philosophy_domain?: string;
    complexity_level: number;
    quality_score: number;
    engagement_score: number;
    view_count: number;
    key_concepts: string[];
    themes: string[];
    tags: string[];
    thumbnail_url?: string;
    url?: string;
    authors: string[];
    source_created_at?: string;
  };
  relevanceScore: number;
  matchType: string;
  highlights: string[];
  reasoning: string;
  similarityScore?: number;
  embeddingMatch?: boolean;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  summary?: string;
  loading?: boolean;
  onResultClick?: (contentId: string) => void;
  onResultExpand?: (contentId: string) => void;
  onGenerateSummary?: (results: SearchResult[]) => Promise<string>;
  className?: string;
}

export default function SearchResults({
  results,
  query,
  summary,
  loading = false,
  onResultClick,
  onResultExpand,
  onGenerateSummary,
  className = ''
}: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [groupedResults, setGroupedResults] = useState<{
    [key: string]: SearchResult[];
  }>({});

  useEffect(() => {
    if (results.length > 0) {
      groupResultsByType();
    }
  }, [results]);

  const groupResultsByType = () => {
    const grouped = results.reduce((acc, result) => {
      const type = result.content.content_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(result);
      return acc;
    }, {} as { [key: string]: SearchResult[] });

    setGroupedResults(grouped);
  };

  const toggleResultExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
      onResultExpand?.(resultId);
    }
    setExpandedResults(newExpanded);
  };

  const handleGenerateSummary = async () => {
    if (!onGenerateSummary) return;

    setSummaryLoading(true);
    try {
      const summary = await onGenerateSummary(results.slice(0, 10)); // Top 10 results
      setGeneratedSummary(summary);
      setShowSummary(true);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <PlayIcon className="h-5 w-5" />;
      case 'tool':
        return <WrenchScrewdriverIcon className="h-5 w-5" />;
      case 'story':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'research':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'newsletter':
        return <NewspaperIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'tool':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'story':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'research':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'newsletter':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityIndicator = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < level ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      />
    ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const highlightText = (text: string, highlights: string[]) => {
    if (highlights.length === 0) return text;

    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search terms or explore related concepts
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({results.length})
          </h2>
          
          {onGenerateSummary && (
            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="h-4 w-4" />
              {summaryLoading ? 'Generating...' : 'AI Summary'}
            </button>
          )}
        </div>

        {/* Search Summary */}
        {(summary || showSummary) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Search Summary</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {showSummary ? generatedSummary : summary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grouped Results */}
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([contentType, typeResults]) => (
          <div key={contentType}>
            {/* Content Type Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg border ${getContentTypeColor(contentType)}`}>
                {getContentTypeIcon(contentType)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 capitalize">
                {contentType}s ({typeResults.length})
              </h3>
            </div>

            {/* Results for this type */}
            <div className="space-y-4">
              {typeResults.map((result, index) => {
                const isExpanded = expandedResults.has(result.content.id);
                
                return (
                  <div
                    key={result.content.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Result Header */}
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => onResultClick?.(result.content.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {result.content.thumbnail_url ? (
                            <img
                              src={result.content.thumbnail_url}
                              alt=""
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center ${getContentTypeColor(result.content.content_type)}`}>
                              {getContentTypeIcon(result.content.content_type)}
                            </div>
                          )}
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-lg font-medium text-gray-900 leading-tight">
                              {highlightText(result.content.title, result.highlights)}
                            </h4>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">
                                {Math.round(result.relevanceScore * 100)}%
                              </span>
                              {result.embeddingMatch && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  AI Match
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {result.content.description && (
                            <p className="text-gray-600 mt-2 line-clamp-2">
                              {highlightText(result.content.description, result.highlights)}
                            </p>
                          )}

                          {/* Metadata Row */}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            {/* Complexity */}
                            <div className="flex items-center gap-2">
                              <span>Level:</span>
                              <div className="flex gap-1">
                                {getComplexityIndicator(result.content.complexity_level)}
                              </div>
                            </div>

                            {/* Philosophy Domain */}
                            {result.content.philosophy_domain && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {result.content.philosophy_domain}
                              </span>
                            )}

                            {/* Engagement Metrics */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <EyeIcon className="h-4 w-4" />
                                <span>{result.content.view_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <HeartIcon className="h-4 w-4" />
                                <span>{Math.round(result.content.engagement_score * 100)}%</span>
                              </div>
                            </div>

                            {/* Date */}
                            {result.content.source_created_at && (
                              <span>{formatDate(result.content.source_created_at)}</span>
                            )}
                          </div>

                          {/* Match Reasoning */}
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <SparklesIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-medium text-gray-600">
                                  {result.matchType} match:
                                </span>
                                <span className="text-xs text-gray-600 ml-1">
                                  {result.reasoning}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => toggleResultExpansion(result.content.id)}
                        className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <span>
                          {isExpanded ? 'Show less' : 'Show more details'}
                        </span>
                        {isExpanded ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6">
                          {/* Key Concepts */}
                          {result.content.key_concepts.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">Key Concepts</h5>
                              <div className="flex flex-wrap gap-2">
                                {result.content.key_concepts.map((concept, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Themes */}
                          {result.content.themes.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">Themes</h5>
                              <div className="flex flex-wrap gap-2">
                                {result.content.themes.map((theme, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Authors */}
                          {result.content.authors.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">Authors</h5>
                              <div className="text-sm text-gray-600">
                                {result.content.authors.join(', ')}
                              </div>
                            </div>
                          )}

                          {/* Content Preview */}
                          {result.content.content && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">Preview</h5>
                              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {result.content.content.substring(0, 300)}
                                {result.content.content.length > 300 && '...'}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            {result.content.url && (
                              <a
                                href={result.content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                              >
                                View Original
                              </a>
                            )}
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <ShareIcon className="h-4 w-4" />
                              Share
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}