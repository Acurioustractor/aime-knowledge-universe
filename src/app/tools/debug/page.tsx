'use client';

import { useState, useEffect } from 'react';

export default function DebugToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 DebugToolsPage: useEffect starting...');
    
    const fetchTools = async () => {
      try {
        console.log('🔍 DebugToolsPage: Making API call...');
        
        const response = await fetch('/api/tools?limit=3');
        const result = await response.json();
        
        console.log('🔍 DebugToolsPage: API response:', result);
        
        if (result.success) {
          setTools(result.data || []);
          console.log('🔍 DebugToolsPage: Tools set:', result.data?.length);
        } else {
          setError(result.error?.message || 'Failed to fetch tools');
          console.log('🔍 DebugToolsPage: Error:', result.error);
        }
      } catch (err) {
        console.error('🔍 DebugToolsPage: Fetch error:', err);
        setError('Network error');
      } finally {
        setLoading(false);
        console.log('🔍 DebugToolsPage: Loading set to false');
      }
    };

    fetchTools();
  }, []);

  console.log('🔍 DebugToolsPage: Rendering - loading:', loading, 'tools:', tools.length, 'error:', error);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Tools Page</h1>
        <div className="text-blue-600">Loading tools... (Debug mode)</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Tools Page</h1>
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Tools Page</h1>
      <div className="mb-4">
        <strong>Found {tools.length} tools</strong>
      </div>
      
      <div className="space-y-4">
        {tools.map((tool: any) => (
          <div key={tool.id} className="border p-4 rounded">
            <h3 className="font-bold">{tool.title}</h3>
            <p className="text-sm text-gray-600">Category: {tool.category}</p>
            <p className="text-sm text-gray-600">Type: {tool.fileType}</p>
            {tool.thumbnailUrl && (
              <img 
                src={tool.thumbnailUrl} 
                alt={tool.title}
                className="w-32 h-18 object-cover mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 