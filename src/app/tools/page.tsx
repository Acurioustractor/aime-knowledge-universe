import ToolsClient from './ToolsClient';
import ErrorBoundary from './ErrorBoundary';

// Server-side function to get initial tools
async function getInitialTools() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/tools-fast?limit=12&offset=0`, { 
      cache: 'no-cache' 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Initial tools fetch error:', error);
    return { success: false, error: error.message };
  }
}

export default async function ToolsPage() {
  console.log('🔧 Tools Page: Starting server-side fetch...');
  
  const result = await getInitialTools();
  
  console.log('🔧 Tools Page: Initial fetch result:', { 
    success: result.success, 
    toolsCount: result.data?.length || 0,
    total: result.meta?.total || 0
  });

  const initialTools = result.success ? (result.data || []) : [];
  const totalTools = result.meta?.total || 0;
  const hasMore = result.meta?.hasMore || false;

  if (!result.success) {
    return <ErrorBoundary error={result.error || 'Failed to load tools and resources'} />;
  }

  return (
    <ToolsClient
      initialTools={initialTools}
      totalTools={totalTools}
      hasMore={hasMore}
    />
  );
}