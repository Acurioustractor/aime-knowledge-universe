"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

// Types for Knowledge Hub data
type KnowledgeItem = {
  id: string;
  name: string;
  path: string;
  type: string;
  html_url: string;
  download_url?: string;
  source: string;
};

export default function KnowledgeHubPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [activeSource, setActiveSource] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    const fetchKnowledgeData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all repositories
        const sources = ['knowledge-hub', 'artifacts', 'dashboards'];
        const requests = sources.map(source => 
          axios.get(`/api/knowledge?source=${source}&category=${activeCategory}`)
        );
        
        const responses = await Promise.allSettled(requests);
        
        // Process successful responses
        let allItems: KnowledgeItem[] = [];
        responses.forEach((response, index) => {
          if (response.status === 'fulfilled') {
            const source = sources[index];
            const data = response.value.data.results;
            
            // Add source information to each item
            const itemsWithSource = data.map((item: any) => ({
              ...item,
              source
            }));
            
            allItems = [...allItems, ...itemsWithSource];
          }
        });
        
        // Filter by active source if needed
        if (activeSource !== 'all') {
          allItems = allItems.filter(item => item.source === activeSource);
        }
        
        setItems(allItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching knowledge data:', err);
        setError('Failed to load knowledge hub data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchKnowledgeData();
  }, [activeSource, activeCategory]);
  
  // Function to determine the icon based on file type
  const getFileIcon = (item: KnowledgeItem) => {
    const name = item.name.toLowerCase();
    
    if (item.type === 'dir') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
          <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
        </svg>
      );
    }
    
    if (name.endsWith('.pdf')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
          <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
        </svg>
      );
    }
    
    if (name.endsWith('.md') || name.endsWith('.txt')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
          <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
        </svg>
      );
    }
    
    if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.gif')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    // Default file icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
      </svg>
    );
  };
  
  // Function to get source label
  const getSourceLabel = (source: string) => {
    switch(source) {
      case 'knowledge-hub':
        return 'Knowledge Hub';
      case 'artifacts':
        return 'AIME Artifacts';
      case 'dashboards':
        return 'AIME Dashboards';
      default:
        return source;
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
              <li className="text-gray-700 font-medium">Knowledge Hub</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">AIME Knowledge Hub</h1>
          
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            Access our comprehensive collection of resources, documents, and data from across the AIME ecosystem.
            This hub integrates content from multiple repositories to provide a unified knowledge base.
          </p>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source Repository</label>
                <select 
                  id="source" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={activeSource}
                  onChange={(e) => setActiveSource(e.target.value)}
                >
                  <option value="all">All Sources</option>
                  <option value="knowledge-hub">Knowledge Hub</option>
                  <option value="artifacts">AIME Artifacts</option>
                  <option value="dashboards">AIME Dashboards</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  id="category" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="research">Research</option>
                  <option value="education">Education</option>
                  <option value="implementation">Implementation</option>
                  <option value="toolkits">Toolkits</option>
                  <option value="media">Media</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="search" 
                  placeholder="Search resources by name or keyword" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Knowledge Items */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <tr key={`${item.source}-${item.path}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                {getFileIcon(item)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.path}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.type === 'dir' ? 'Directory' : 'File'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getSourceLabel(item.source)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a 
                              href={item.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              View
                            </a>
                            {item.download_url && (
                              <a 
                                href={item.download_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No items found. Try changing your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Integration Info */}
          <div className="mt-12 bg-primary-900 text-white rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-4">Repository Integration</h2>
                <p className="mb-6">
                  This Knowledge Hub integrates content from three core AIME repositories: aime-knowledge-hub, 
                  aime-artifacts, and AIMEdashboards. The integration provides a unified interface to access 
                  all resources in one place.
                </p>
                <Link 
                  href="/content/integration-guide"
                  className="btn bg-white text-primary-900 hover:bg-gray-100"
                >
                  View Integration Guide
                </Link>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/School - Day 4-16.jpg"
                    alt="Repository Integration"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}