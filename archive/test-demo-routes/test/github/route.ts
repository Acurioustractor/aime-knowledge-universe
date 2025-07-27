/**
 * GitHub API Test Endpoint
 * 
 * Tests real GitHub API integration for AIME repositories
 */

import { NextRequest, NextResponse } from 'next/server';

// GitHub repositories to test
const AIME_REPOSITORIES = [
  'Acurioustractor/aime-knowledge-hub',
  'Acurioustractor/aime-artifacts', 
  'Acurioustractor/AIMEdashboards'
];

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  html_url: string;
  download_url: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Testing GitHub API integration...');
    
    const results = [];
    
    for (const repo of AIME_REPOSITORIES) {
      try {
        console.log(`Testing repository: ${repo}`);
        
        // Test GitHub API access
        const apiUrl = `https://api.github.com/repos/${repo}/contents`;
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'AIME-Knowledge-Archive'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}: ${response.statusText}`);
        }
        
        const contents = await response.json();
        
        // Extract markdown and document files
        const documents = contents
          .filter((item: GitHubFile) => 
            item.type === 'file' && 
            (item.name.endsWith('.md') || 
             item.name.endsWith('.txt') || 
             item.name.endsWith('.pdf'))
          )
          .slice(0, 5); // Limit to first 5 files for testing
        
        results.push({
          repository: repo,
          status: 'success',
          fileCount: contents.length,
          documentCount: documents.length,
          sampleFiles: documents.map((file: GitHubFile) => ({
            name: file.name,
            path: file.path,
            size: file.size,
            url: file.html_url
          }))
        });
        
      } catch (error) {
        console.error(`Error testing repository ${repo}:`, error);
        results.push({
          repository: repo,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'GitHub API test completed',
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error('GitHub API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}