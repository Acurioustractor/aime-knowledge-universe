import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// This API route will fetch data from the AIME Knowledge Hub repository
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const source = searchParams.get('source') || 'all';
    
    // Define the base URL for the GitHub API
    const baseUrl = 'https://api.github.com/repos';
    
    // Determine which repository to query based on the source parameter
    let repoPath;
    switch(source) {
      case 'artifacts':
        repoPath = 'Acurioustractor/aime-artifacts';
        break;
      case 'dashboards':
        repoPath = 'Acurioustractor/AIMEdashboards';
        break;
      default:
        repoPath = 'Acurioustractor/aime-knowledge-hub';
    }
    
    // Fetch content from the repository
    // For demonstration, we're fetching the contents of the repository root
    // In a real implementation, you would navigate to specific folders based on category
    const response = await axios.get(`${baseUrl}/${repoPath}/contents`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add GitHub token if needed for private repos
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    
    // Filter results based on category if needed
    let results = response.data;
    if (category !== 'all') {
      results = results.filter((item: any) => {
        // Implement category filtering logic here
        // This is a placeholder - you would need to define how categories map to content
        return item.name.toLowerCase().includes(category.toLowerCase());
      });
    }
    
    return NextResponse.json({ 
      source,
      category,
      results 
    });
  } catch (error: any) {
    console.error('Knowledge API error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge data' },
      { status: 500 }
    );
  }
}