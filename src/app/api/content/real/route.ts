import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fetchGitHubResources } from '@/lib/integrations/github';
import { fetchAirtableResources } from '@/lib/integrations/airtable';
import { fetchMailchimpCampaigns } from '@/lib/integrations/mailchimp';
import { fetchYouTubeVideos } from '@/lib/integrations/youtube';

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/content/real
 * 
 * Fetch real content from the markdown files in the wiki
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const region = searchParams.get('region');
    const theme = searchParams.get('theme');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'date';
    const themes = searchParams.get('themes')?.split(',').filter(Boolean) || [];
    const formats = searchParams.get('formats')?.split(',').filter(Boolean) || [];
    const duration = searchParams.get('duration') || 'all';
    const viewRange = searchParams.get('viewRange') || 'all';

    const rootPath = path.join(process.cwd());
    const allContent: any[] = [];

    // Read content from various directories
    const contentSources = [
      { dir: 'content', type: 'content' },
      { dir: 'research', type: 'research' },
      { dir: 'recommendations', type: 'recommendations' },
      { dir: 'implementation', type: 'tools' },
      { dir: 'voices', type: 'stories' },
      { dir: 'overview', type: 'overview' }
    ];

    for (const source of contentSources) {
      const dirPath = path.join(rootPath, source.dir);
      
      if (fs.existsSync(dirPath)) {
        const files = await getMarkdownFiles(dirPath);
        
        for (const file of files) {
          try {
            const content = fs.readFileSync(file, 'utf8');
            const { data: frontMatter, content: markdownContent } = matter(content);
            
            // Skip README files unless specifically requested
            if (path.basename(file) === 'README.md' && type !== 'overview') {
              continue;
            }

            const relativePath = path.relative(rootPath, file);
            const slug = relativePath.replace(/\.md$/, '').replace(/\//g, '-');
            
            const contentItem = {
              id: slug,
              globalId: `aime-${source.type}-${slug}`,
              type: source.type,
              title: frontMatter.title || extractTitleFromContent(markdownContent) || path.basename(file, '.md'),
              description: frontMatter.description || extractDescription(markdownContent),
              source: 'markdown',
              sourceId: relativePath,
              url: `/${relativePath.replace(/\.md$/, '')}`,
              metadata: {
                authors: frontMatter.authors || ['AIME Team'],
                publishedDate: frontMatter.date ? new Date(frontMatter.date) : getFileCreatedDate(file),
                language: frontMatter.language || 'en',
                region: frontMatter.region || 'Global',
                tags: frontMatter.tags || extractTagsFromContent(markdownContent),
                format: 'markdown',
                wordCount: markdownContent.split(/\s+/).length
              },
              content: {
                text: markdownContent,
                markdown: markdownContent,
                excerpt: extractExcerpt(markdownContent)
              },
              themes: frontMatter.themes || extractThemesFromContent(markdownContent),
              impactScore: frontMatter.impactScore || 7.0,
              qualityScore: calculateQualityScore(markdownContent, frontMatter),
              createdAt: getFileCreatedDate(file),
              updatedAt: getFileModifiedDate(file)
            };

            allContent.push(contentItem);
          } catch (error) {
            console.warn(`Error processing file ${file}:`, error);
          }
        }
      }
    }

    // Fetch data lake content (GitHub, Airtable, Mailchimp, YouTube)
    let githubResults: any[] = [];
    let airtableResults: any[] = [];
    let mailchimpResults: any[] = [];
    let youtubeResults: any[] = [];
    
    try {
      console.log('🔍 Starting data lake integrations...');
      
      // Fetch GitHub content
      try {
        githubResults = await fetchGitHubResources({ limit: 20 });
        console.log(`✅ GitHub: ${githubResults.length} items`);
      } catch (error) {
        console.warn('❌ GitHub fetch failed:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Fetch Airtable content
      try {
        airtableResults = await fetchAirtableResources({ limit: 20 });
        console.log(`✅ Airtable: ${airtableResults.length} items`);
      } catch (error) {
        console.warn('❌ Airtable fetch failed:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Fetch Mailchimp content - GET ALL NEWSLETTERS!
      try {
        mailchimpResults = await fetchMailchimpCampaigns({});
        console.log(`✅ Mailchimp: ${mailchimpResults.length} items`);
      } catch (error) {
        console.warn('❌ Mailchimp fetch failed:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Fetch YouTube content - GET ALL 423 VIDEOS!
      try {
        const offset = parseInt(searchParams.get('offset') || '0');
        const videoLimit = type === 'video' ? limit : 50; // Get up to the requested limit
        youtubeResults = await fetchYouTubeVideos({ 
          limit: videoLimit, 
          offset: offset,
          search: search || undefined
        });
        console.log(`✅ YouTube: ${youtubeResults.length} items (from 423 total available)`);
      } catch (error) {
        console.warn('❌ YouTube fetch failed:', error instanceof Error ? error.message : 'Unknown error');
      }

      // Transform data lake content to match our content structure
      const transformedGithub = githubResults.map(item => ({
        id: `github-${item.id}`,
        globalId: `aime-github-${item.id}`,
        type: 'document',
        title: item.title,
        description: item.description,
        source: 'github',
        sourceId: item.id,
        url: item.url,
        metadata: {
          authors: ['GitHub Repository'],
          publishedDate: item.date ? new Date(item.date) : new Date(),
          language: 'en',
          region: 'Global',
          tags: item.tags || [],
          format: 'document',
          repository: item.metadata?.repository || 'unknown'
        },
        content: {
          text: item.description,
          markdown: item.metadata?.content || '',
          excerpt: item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description
        },
        themes: extractThemesFromContent(item.description),
        impactScore: 6.0,
        qualityScore: 7.0,
        createdAt: item.date ? new Date(item.date) : new Date(),
        updatedAt: item.date ? new Date(item.date) : new Date()
      }));

      const transformedAirtable = airtableResults.map(item => ({
        id: `airtable-${item.id}`,
        globalId: `aime-airtable-${item.id}`,
        type: item.type === 'event' ? 'events' : 'tools',
        title: item.title,
        description: item.description,
        source: 'airtable',
        sourceId: item.id,
        url: item.url,
        metadata: {
          authors: ['AIME Team'],
          publishedDate: item.date ? new Date(item.date) : new Date(),
          language: 'en',
          region: item.metadata?.location || 'Global',
          tags: item.tags || [],
          format: 'resource',
          category: item.categories?.[0] || 'General'
        },
        content: {
          text: item.description,
          markdown: item.metadata?.content || '',
          excerpt: item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description
        },
        themes: item.categories || extractThemesFromContent(item.description),
        impactScore: 7.5,
        qualityScore: 8.0,
        createdAt: item.date ? new Date(item.date) : new Date(),
        updatedAt: item.date ? new Date(item.date) : new Date()
      }));

      const transformedMailchimp = mailchimpResults.map(item => ({
        id: `mailchimp-${item.id}`,
        globalId: `aime-mailchimp-${item.id}`,
        type: 'newsletter',
        title: item.title,
        description: item.description,
        source: 'mailchimp',
        sourceId: item.id,
        url: item.url,
        metadata: {
          authors: ['AIME Team'],
          publishedDate: item.date ? new Date(item.date) : new Date(),
          language: 'en',
          region: 'Global',
          tags: item.tags || [],
          format: 'newsletter',
          previewText: item.metadata?.previewText || ''
        },
        content: {
          text: item.description,
          markdown: item.metadata?.content || '',
          excerpt: item.metadata?.previewText || item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description
        },
        themes: extractThemesFromContent(item.description),
        impactScore: 8.0,
        qualityScore: 8.5,
        createdAt: item.date ? new Date(item.date) : new Date(),
        updatedAt: item.date ? new Date(item.date) : new Date()
      }));

      // Transform YouTube content to match our content structure  
      const transformedYoutube = youtubeResults.map(item => ({
        id: `youtube-${item.id}`,
        globalId: `aime-youtube-${item.id}`,
        type: 'video',
        title: item.title,
        description: item.description,
        source: 'youtube',
        sourceId: item.id,
        url: item.url,
        metadata: {
          authors: [item.metadata?.channelTitle || 'IMAGI-NATION TV'],
          publishedDate: item.date ? new Date(item.date) : new Date(),
          language: 'en',
          region: 'Global',
          tags: item.tags || [],
          format: 'video',
          duration: item.metadata?.duration || 'Unknown',
          viewCount: item.metadata?.viewCount || 0,
          likeCount: item.metadata?.likeCount || 0,
          commentCount: item.metadata?.commentCount || 0,
          thumbnails: item.metadata?.thumbnails || {},
          platform: 'YouTube'
        },
        content: {
          text: item.description,
          markdown: '',
          excerpt: item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description
        },
        themes: extractThemesFromContent(item.description + ' ' + item.title),
        impactScore: 8.5,
        qualityScore: 9.0,
        createdAt: item.date ? new Date(item.date) : new Date(),
        updatedAt: item.date ? new Date(item.date) : new Date()
      }));

      // Add data lake content to all content
      allContent.push(...transformedGithub, ...transformedAirtable, ...transformedMailchimp, ...transformedYoutube);
    } catch (error) {
      console.warn('Error fetching data lake content:', error);
    }

    // Apply filters
    let filteredContent = allContent;

    if (type !== 'all') {
      filteredContent = filteredContent.filter(item => item.type === type);
    }

    if (region && region !== 'all') {
      filteredContent = filteredContent.filter(item => 
        item.metadata.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (theme) {
      filteredContent = filteredContent.filter(item => 
        item.themes?.some((t: string) => t.toLowerCase().includes(theme.toLowerCase())) ||
        item.content.text.toLowerCase().includes(theme.toLowerCase())
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.content?.text?.toLowerCase().includes(searchTerm) ||
        item.themes?.some((t: string) => t.toLowerCase().includes(searchTerm))
      );
    }

    // Apply theme filters
    if (themes.length > 0) {
      filteredContent = filteredContent.filter(item => {
        if (!item.metadata?.tags) return false;
        return themes.some(theme => 
          item.metadata.tags.includes(theme) ||
          item.title.toLowerCase().includes(theme) ||
          item.description.toLowerCase().includes(theme)
        );
      });
    }

    // Apply format filters  
    if (formats.length > 0) {
      filteredContent = filteredContent.filter(item => {
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        return formats.some(format => {
          switch (format) {
            case 'workshop': return titleLower.includes('workshop') || titleLower.includes('training');
            case 'interview': return titleLower.includes('interview') || titleLower.includes('conversation');
            case 'presentation': return titleLower.includes('presentation') || titleLower.includes('talk');
            case 'panel': return titleLower.includes('panel') || titleLower.includes('discussion');
            case 'story': return titleLower.includes('story') || titleLower.includes('student');
            case 'live': return titleLower.includes('live') || descLower.includes('live');
            default: return false;
          }
        });
      });
    }

    // Apply duration filter
    if (duration !== 'all') {
      filteredContent = filteredContent.filter(item => {
        const durationStr = item.metadata?.duration || '';
        if (!durationStr || durationStr === 'P0D') return duration === 'short'; // Unknown or live streams
        
        // Parse YouTube duration format PT#H#M#S
        const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return duration === 'short';
        
        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const totalMinutes = hours * 60 + minutes;
        
        switch (duration) {
          case 'short': return totalMinutes <= 15;
          case 'medium': return totalMinutes > 15 && totalMinutes <= 45;
          case 'long': return totalMinutes > 45;
          default: return true;
        }
      });
    }

    // Apply view range filter
    if (viewRange !== 'all') {
      filteredContent = filteredContent.filter(item => {
        const views = item.metadata?.viewCount || 0;
        switch (viewRange) {
          case 'popular': return views >= 100;
          case 'trending': return views >= 50 && views < 100;
          case 'new': return views < 50;
          default: return true;
        }
      });
    }

    // Apply sorting
    switch (sort) {
      case 'views':
        filteredContent.sort((a, b) => {
          const viewsA = a.metadata?.viewCount || 0;
          const viewsB = b.metadata?.viewCount || 0;
          return viewsB - viewsA;
        });
        break;
      case 'title':
        filteredContent.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
      default:
        filteredContent.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    // Apply pagination manually for content (since YouTube API handles its own pagination)
    let paginatedContent;
    let totalFilteredCount;
    
    if (type === 'video') {
      // For videos, the YouTube API already handles pagination, so use the results directly
      paginatedContent = filteredContent;
      // Get total count - if any filters are applied, use filtered count, otherwise use known total
      const hasFilters = search || themes.length > 0 || formats.length > 0 || duration !== 'all' || viewRange !== 'all';
      totalFilteredCount = hasFilters ? filteredContent.length : 423; // We know AIME has 423 videos total
    } else {
      // For other content types, apply pagination here
      const offset = parseInt(searchParams.get('offset') || '0');
      paginatedContent = filteredContent.slice(offset, offset + limit);
      totalFilteredCount = filteredContent.length;
    }

    return NextResponse.json({
      success: true,
      data: {
        content: paginatedContent,
        total: totalFilteredCount,
        filtered: paginatedContent.length,
        metadata: {
          sources: contentSources.map(s => s.dir),
          types: Array.from(new Set(allContent.map(c => c.type))),
          regions: Array.from(new Set(allContent.map(c => c.metadata.region))),
          totalFiles: allContent.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching real content:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      const subFiles = await getMarkdownFiles(fullPath);
      files.push(...subFiles);
    } else if (item.isFile() && item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function extractTitleFromContent(content: string): string | null {
  // Look for the first H1 heading
  const h1Match = content.match(/^# (.+)$/m);
  if (h1Match) return h1Match[1];
  
  // Look for any heading
  const headingMatch = content.match(/^#{1,6} (.+)$/m);
  if (headingMatch) return headingMatch[1];
  
  return null;
}

function extractDescription(content: string): string {
  // Remove markdown headers and get first paragraph
  const withoutHeaders = content.replace(/^#{1,6} .+$/gm, '');
  const paragraphs = withoutHeaders.split('\n\n').filter(p => p.trim());
  
  if (paragraphs.length > 0) {
    const firstParagraph = paragraphs[0].trim();
    // Clean up markdown syntax
    const cleaned = firstParagraph
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link markup
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1'); // Remove code
    
    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
  }
  
  return 'No description available';
}

function extractExcerpt(content: string): string {
  const description = extractDescription(content);
  return description.length > 150 ? description.substring(0, 150) + '...' : description;
}

function extractTagsFromContent(content: string): string[] {
  const tags: string[] = [];
  
  // Look for common AIME themes
  const themes = [
    'imagination', 'creativity', 'indigenous', 'youth', 'leadership', 
    'mentorship', 'education', 'systems', 'innovation', 'cultural bridge',
    'relational economies', 'network health', 'environmental', 'workshop',
    'research', 'tools', 'toolkit', 'framework', 'program'
  ];
  
  const lowerContent = content.toLowerCase();
  themes.forEach(theme => {
    if (lowerContent.includes(theme)) {
      tags.push(theme);
    }
  });
  
  return Array.from(new Set(tags)); // Remove duplicates
}

function extractThemesFromContent(content: string): string[] {
  const themes: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Map content to AIME themes
  if (lowerContent.includes('imagination') || lowerContent.includes('creative')) {
    themes.push('Imagination & Creativity');
  }
  if (lowerContent.includes('indigenous') || lowerContent.includes('traditional knowledge')) {
    themes.push('Indigenous Systems Thinking');
  }
  if (lowerContent.includes('education') || lowerContent.includes('learning')) {
    themes.push('Education Transformation');
  }
  if (lowerContent.includes('youth') || lowerContent.includes('young people')) {
    themes.push('Youth Leadership');
  }
  if (lowerContent.includes('mentor') || lowerContent.includes('relationship')) {
    themes.push('Mentorship');
  }
  if (lowerContent.includes('environment') || lowerContent.includes('climate')) {
    themes.push('Environmental Custodianship');
  }
  if (lowerContent.includes('network') || lowerContent.includes('community')) {
    themes.push('Network Health');
  }
  if (lowerContent.includes('cultural') || lowerContent.includes('bridge')) {
    themes.push('Cultural Bridge');
  }
  
  return themes;
}

function calculateQualityScore(content: string, frontMatter: any): number {
  let score = 5; // Base score
  
  // Content length factor
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 500) score += 1;
  if (wordCount > 1000) score += 1;
  
  // Has structured sections
  if (content.includes('##')) score += 1;
  
  // Has front matter
  if (Object.keys(frontMatter).length > 0) score += 1;
  
  // Has links (indicates cross-referencing)
  if (content.includes('[') && content.includes('](')) score += 1;
  
  return Math.min(score, 10);
}

function getFileCreatedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.birthtime || stats.mtime;
  } catch {
    return new Date();
  }
}

function getFileModifiedDate(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}