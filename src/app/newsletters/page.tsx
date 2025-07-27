"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ContentItem } from '@/lib/content-integration/models/content-item'
import NewsletterFilters from '@/components/newsletters/NewsletterFilters'

export default function NewslettersPage() {
  const [allNewsletters, setAllNewsletters] = useState<ContentItem[]>([])
  const [filteredNewsletters, setFilteredNewsletters] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const fetchNewsletters = async (syncAll = false) => {
    try {
      setIsLoading(true)
      setError(null)
      setSyncMessage(null)

      if (syncAll) {
        setIsSyncing(true)
        setSyncMessage('Syncing all newsletters from Mailchimp...')
      }

      // Fetch newsletters (sync all if requested)
      const url = syncAll ? '/api/newsletters?syncAll=true' : '/api/newsletters?count=100'
      console.log(`Fetching newsletters from: ${url}`)
      
      const newslettersResponse = await fetch(url)
      const newslettersData = await newslettersResponse.json()

      console.log('Newsletter API response:', newslettersData)

      if (newslettersData.success) {
        setAllNewsletters(newslettersData.data || [])
        setFilteredNewsletters(newslettersData.data || [])
        
        if (syncAll) {
          setSyncMessage(`✅ Successfully synced ${(newslettersData.data || []).length} newsletters`)
          setTimeout(() => setSyncMessage(null), 5000)
        }
      } else {
        // If API fails, try to load mock data as fallback
        console.warn('API failed, attempting to load mock data:', newslettersData.error)
        
        if (syncAll) {
          setSyncMessage('⚠️ Mailchimp API unavailable, loading sample data...')
        }
        
        // Import mock data as fallback
        const { getMockContent } = await import('@/lib/mock-data')
        const mockContent = getMockContent()
        const mockNewsletters = mockContent.filter(item => item.contentType === 'newsletter')
        
        setAllNewsletters(mockNewsletters)
        setFilteredNewsletters(mockNewsletters)
        
        if (syncAll) {
          setSyncMessage(`⚠️ Loaded ${mockNewsletters.length} sample newsletters (Mailchimp API unavailable)`)
          setTimeout(() => setSyncMessage(null), 8000)
        }
      }
    } catch (err) {
      console.error('Error fetching newsletters:', err)
      
      // Try to load mock data as final fallback
      try {
        const { getMockContent } = await import('@/lib/mock-data')
        const mockContent = getMockContent()
        const mockNewsletters = mockContent.filter(item => item.contentType === 'newsletter')
        
        setAllNewsletters(mockNewsletters)
        setFilteredNewsletters(mockNewsletters)
        
        setSyncMessage(`⚠️ Using sample data (${mockNewsletters.length} newsletters) - API connection failed`)
        setTimeout(() => setSyncMessage(null), 8000)
      } catch (mockError) {
        console.error('Failed to load mock data:', mockError)
        setError(err instanceof Error ? err.message : 'Failed to load newsletters')
      }
    } finally {
      setIsLoading(false)
      setIsSyncing(false)
    }
  }

  const handleSyncAll = () => {
    fetchNewsletters(true)
  }

  const handleFilterChange = useCallback((filtered: ContentItem[]) => {
    setFilteredNewsletters(filtered)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getNewsletterUrl = (newsletter: ContentItem) => {
    return newsletter.url || `/updates/${newsletter.id}`
  }

  const getNewsletterTypeLabel = (type?: string) => {
    if (!type || type === 'general') return ''
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b border-gray-300">
          <div className="container-wiki py-2">
            <nav className="text-sm">
              <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
              <span className="text-gray-500 mx-1">›</span>
              <span className="text-gray-700">Newsletters</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-300 bg-white py-8">
          <div className="container-wiki">
            <h1 className="text-2xl font-bold text-black mb-4">AIME Newsletters</h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-600">Loading newsletters...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b border-gray-300">
          <div className="container-wiki py-2">
            <nav className="text-sm">
              <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
              <span className="text-gray-500 mx-1">›</span>
              <span className="text-gray-700">Newsletters</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-300 bg-white py-8">
          <div className="container-wiki">
            <h1 className="text-2xl font-bold text-black mb-4">AIME Newsletters</h1>
            <div className="border border-red-300 p-6 bg-red-50 text-red-700">
              <h3 className="font-bold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Newsletters</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">AIME Newsletters</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 max-w-4xl">
              Stay connected with the latest insights, research findings, and program updates from the AIME community worldwide.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {allNewsletters.length} newsletter{allNewsletters.length !== 1 ? 's' : ''} total
              </div>
              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className={`px-4 py-2 text-sm border transition-colors ${
                  isSyncing 
                    ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSyncing ? 'Syncing...' : 'Sync All Newsletters'}
              </button>
            </div>
          </div>

          {/* Sync Message */}
          {syncMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800">
              {syncMessage}
            </div>
          )}

          {/* Filters */}
          {allNewsletters.length > 0 && (
            <NewsletterFilters 
              newsletters={allNewsletters}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">
          {filteredNewsletters.length === 0 ? (
            <div className="border border-gray-300 p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-black mb-2">No newsletters found</h3>
              <p className="text-gray-700">
                {allNewsletters.length > 0 ? 'No newsletters found matching your filters.' : 'Newsletter content is being processed and will be available here soon.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-black mb-2">
                  Recent Newsletters ({filteredNewsletters.length})
                </h2>
                <p className="text-sm text-gray-600">
                  The latest updates from AIME programs, research, and community initiatives.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredNewsletters.map((newsletter) => (
                  <div key={newsletter.id} className="border border-gray-300 p-6 bg-white hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-black">
                            <a 
                              href={getNewsletterUrl(newsletter)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {newsletter.title}
                            </a>
                          </h3>
                          {newsletter.metadata?.newsletterType && newsletter.metadata.newsletterType !== 'general' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs border border-green-200">
                              {getNewsletterTypeLabel(newsletter.metadata.newsletterType)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">
                          {newsletter.description}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        {newsletter.date && (
                          <div className="text-sm text-gray-600">
                            {formatDate(newsletter.date)}
                          </div>
                        )}
                        {newsletter.metadata?.openRate && (
                          <div className="text-sm text-gray-600 mt-1">
                            {Math.round(newsletter.metadata.openRate * 100)}% open rate
                          </div>
                        )}
                        {newsletter.metadata?.emailsSent && (
                          <div className="text-sm text-gray-600 mt-1">
                            {newsletter.metadata.emailsSent.toLocaleString()} sent
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Themes and Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newsletter.themes?.slice(0, 3).map(theme => (
                        <span
                          key={theme.id}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs border border-blue-200"
                        >
                          {theme.name}
                        </span>
                      ))}
                      {newsletter.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs border border-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs border border-blue-200">
                          Newsletter
                        </span>
                        <span>Source: Mailchimp</span>
                        {newsletter.authors && newsletter.authors.length > 0 && (
                          <span>By: {newsletter.authors.join(', ')}</span>
                        )}
                      </div>
                      <a 
                        href={getNewsletterUrl(newsletter)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Read newsletter →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Section */}
          <div className="mt-12 border border-gray-300 p-8 bg-gray-50">
            <h3 className="text-xl font-bold text-black mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-700 mb-6">
              Get the latest updates, research insights, and community stories delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              We respect your privacy and will never share your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}