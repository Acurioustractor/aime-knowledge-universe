'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BusinessCase {
  id: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: Record<string, any>;
  industry: string;
  region: string;
  program_type: string;
  year: number;
  featured_image_url?: string;
  related_tools: string[];
  related_videos: string[];
  related_content: string[];
  tags: string[];
  source_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface BusinessCasesClientProps {
  initialCases: BusinessCase[];
  totalCases: number;
  hasMore: boolean;
}

export default function BusinessCasesClient({ initialCases, totalCases, hasMore }: BusinessCasesClientProps) {
  const [cases, setCases] = useState<BusinessCase[]>(initialCases);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    program_type: '',
    year: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options (these would come from the data)
  const industries = ['Education', 'Corporate', 'Government', 'Non-Profit', 'Community'];
  const regions = ['Australia', 'United States', 'United Kingdom', 'South Africa', 'Global'];
  const programTypes = ['Mentoring', 'Training', 'Curriculum', 'Digital Platform', 'Partnership'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      region: '',
      program_type: '',
      year: '',
      search: ''
    });
    setPage(1);
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '12',
        offset: String(cases.length),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      });

      const response = await fetch(`/api/business-cases?${params}`);
      const result = await response.json();

      if (result.success) {
        setCases(prev => [...prev, ...result.data]);
      }
    } catch (error) {
      console.error('Error loading more cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format metrics value
  const formatMetricValue = (value: any): string => {
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
    }
    return String(value);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Filter Business Cases
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-blue-600">
                ({Object.values(filters).filter(v => v !== '').length} active)
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search case studies..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Grid */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Type
              </label>
              <select
                value={filters.program_type}
                onChange={(e) => handleFilterChange('program_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Programs</option>
                {programTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {cases.length} of {totalCases} business cases
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cases.map((businessCase) => (
          <div key={businessCase.id} className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Featured Image */}
            {businessCase.featured_image_url ? (
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={businessCase.featured_image_url} 
                  alt={businessCase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {businessCase.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {businessCase.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              {/* Metadata */}
              <div className="flex items-center gap-2 mb-3">
                {businessCase.industry && (
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                    {businessCase.industry}
                  </span>
                )}
                {businessCase.region && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {businessCase.region}
                  </span>
                )}
                {businessCase.year && (
                  <span className="text-xs text-gray-500">
                    {businessCase.year}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                <Link href={`/business-cases/${businessCase.id}`}>
                  {businessCase.title}
                </Link>
              </h3>

              {/* Summary */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {businessCase.summary}
              </p>

              {/* Key Metrics */}
              {businessCase.metrics && Object.keys(businessCase.metrics).length > 0 && (
                <div className="mb-4 space-y-2">
                  {Object.entries(businessCase.metrics).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{key}:</span>
                      <span className="font-semibold text-gray-900">{formatMetricValue(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {businessCase.tags && businessCase.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {businessCase.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                  {businessCase.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{businessCase.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Related Content Indicators */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                {businessCase.related_tools.length > 0 && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {businessCase.related_tools.length} tools
                  </span>
                )}
                {businessCase.related_videos.length > 0 && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    {businessCase.related_videos.length} videos
                  </span>
                )}
              </div>

              {/* Action */}
              <Link 
                href={`/business-cases/${businessCase.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Read Full Case Study
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Loading more...
              </>
            ) : (
              <>
                Load More Cases
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}