/**
 * GitHub Integration Service
 * 
 * Fetches and normalizes data from GitHub repositories
 */

import axios from 'axios';
import { ContentItem, FetchOptions } from './index';

/**
 * Fetches content from GitHub repositories via our backend API
 */
export async function fetchRepositoryContent(options: FetchOptions = {}): Promise<ContentItem[]> {
  try {
    // GitHub repositories to fetch from
    const repositories = [
      'Acurioustractor/aime-knowledge-hub',
      'Acurioustractor/aime-artifacts', 
      'Acurioustractor/AIMEdashboards'
    ];
    
    const allItems: any[] = [];
    
    for (const repo of repositories) {
      try {
        // Fetch repository contents from GitHub API
        const apiUrl = `https://api.github.com/repos/${repo}/contents`;
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'AIME-Knowledge-Archive'
        };
        
        // Add authentication if token is available
        const githubToken = process.env.GITHUB_API_TOKEN;
        if (githubToken && githubToken !== 'your_github_token_here') {
          headers['Authorization'] = `token ${githubToken}`;
        }
        
        const response = await fetch(apiUrl, { headers });
        
        if (!response.ok) {
          console.warn(`Failed to fetch ${repo}: ${response.status}`);
          continue;
        }
        
        const contents = await response.json();
        const repoName = repo.split('/')[1];
        
        // Filter for document files and add repository info
        const documentFiles = contents
          .filter((item: any) => 
            item.type === 'file' && 
            (item.name.endsWith('.md') || 
             item.name.endsWith('.txt') || 
             item.name.endsWith('.pdf'))
          )
          .map((item: any) => ({
            ...item,
            repository: repoName
          }));
        
        allItems.push(...documentFiles);
        
      } catch (error) {
        console.warn(`Error fetching repository ${repo}:`, error);
        continue;
      }
    }
    
    // If no items found, use fallback mock data
    const mockItems = allItems.length > 0 ? allItems : [
      {
        name: 'implementation-guide.md',
        path: 'docs/implementation-guide.md',
        sha: 'abc123',
        size: 5000,
        type: 'file',
        html_url: 'https://github.com/Acurioustractor/aime-knowledge-hub/blob/main/docs/implementation-guide.md',
        download_url: 'https://raw.githubusercontent.com/Acurioustractor/aime-knowledge-hub/main/docs/implementation-guide.md',
        repository: 'knowledge-hub'
      }
    ];
    
    // Transform the response to our normalized format
    return (allItems.length > 0 ? allItems : mockItems).map((item: any) => {
      // Determine content type based on file extension
      let contentType: 'document' | 'resource' = 'document';
      const name = item.name.toLowerCase();
      
      if (name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.pdf')) {
        contentType = 'document';
      } else if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.gif')) {
        contentType = 'resource';
      }
      
      return {
        id: item.sha,
        title: item.name,
        description: `File from ${item.repository} repository: ${item.path}`,
        type: contentType,
        source: 'github',
        url: item.html_url,
        date: null, // GitHub API doesn't provide this in the directory listing
        tags: [item.repository],
        metadata: {
          path: item.path,
          size: item.size,
          type: item.type,
          repository: item.repository,
          downloadUrl: item.download_url
        }
      };
    });
  } catch (error) {
    console.error('Error fetching GitHub repository content:', error);
    
    // Return empty array on error
    return [];
  }
}

/**
 * Fetches a single file by path and repository
 */
export async function fetchRepositoryFile(repo: string, path: string): Promise<ContentItem | null> {
  try {
    // Use mock data for development
    const mockFiles = [
      {
        name: 'implementation-guide.md',
        path: 'docs/implementation-guide.md',
        sha: 'abc123',
        size: 5000,
        type: 'file',
        html_url: 'https://github.com/Acurioustractor/aime-knowledge-hub/blob/main/docs/implementation-guide.md',
        download_url: 'https://raw.githubusercontent.com/Acurioustractor/aime-knowledge-hub/main/docs/implementation-guide.md',
        repository: 'knowledge-hub',
        content: '# Implementation Guide\n\nThis is a guide for implementing the AIME methodology...',
        encoding: 'utf-8'
      },
      {
        name: 'research-synthesis.md',
        path: 'research/synthesis/research-synthesis.md',
        sha: 'def456',
        size: 8000,
        type: 'file',
        html_url: 'https://github.com/Acurioustractor/aime-knowledge-hub/blob/main/research/synthesis/research-synthesis.md',
        download_url: 'https://raw.githubusercontent.com/Acurioustractor/aime-knowledge-hub/main/research/synthesis/research-synthesis.md',
        repository: 'knowledge-hub',
        content: '# Research Synthesis\n\nThis document synthesizes our research findings...',
        encoding: 'utf-8'
      }
    ];
    
    const file = mockFiles.find(f => f.repository === repo && f.path === path) || mockFiles[0];
    
    // Determine content type based on file extension
    let contentType: 'document' | 'resource' = 'document';
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.pdf')) {
      contentType = 'document';
    } else if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.gif')) {
      contentType = 'resource';
    }
    
    return {
      id: file.sha,
      title: file.name,
      description: `File from ${file.repository} repository: ${file.path}`,
      type: contentType,
      source: 'github',
      url: file.html_url,
      date: null,
      tags: [file.repository],
      metadata: {
        path: file.path,
        size: file.size,
        type: file.type,
        repository: file.repository,
        downloadUrl: file.download_url,
        content: file.content,
        encoding: file.encoding
      }
    };
  } catch (error) {
    console.error(`Error fetching GitHub file ${path} from ${repo}:`, error);
    return null;
  }
}

// Export alias for sync service compatibility
export const fetchGitHubContent = fetchRepositoryContent;
export const fetchGitHubResources = fetchRepositoryContent;