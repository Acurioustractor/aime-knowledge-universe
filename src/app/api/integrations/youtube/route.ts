import { NextRequest, NextResponse } from 'next/server';
import { ContentItem } from '@/lib/content-integration/models/content-item';

// REAL YouTube API Integration - MULTIPLE API KEYS FOR QUOTA MANAGEMENT
const API_KEYS = [
  process.env.YOUTUBE_API_KEY,
  process.env.YOUTUBE_API_KEY_2,
  process.env.YOUTUBE_API_KEY_3,
].filter(key => key && !key.includes('your_new_api_key_here') && !key.includes('Dummy'));

const AIME_CHANNEL_ID = 'UCDL9R_msvYDyHF7lx0NEyow'; // AIME's actual channel ID (@aimementoring)
const AIME_CHANNEL_HANDLE = '@aimementoring'; // AIME's channel handle

// Function to try API keys until one works
async function makeYouTubeAPICall(endpoint: string): Promise<any> {
  let lastError: any;
  
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    const url = `https://www.googleapis.com/youtube/v3/${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${apiKey}`;
    
    try {
      console.log(`🔑 Trying API key ${i + 1}/${API_KEYS.length}...`);
      
      const response = await fetch(url);
      
      if (response.ok) {
        console.log(`✅ API key ${i + 1} succeeded`);
        return await response.json();
      }
      
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.message?.includes('quota')) {
          console.log(`⚠️ API key ${i + 1} quota exceeded, trying next key...`);
          lastError = new Error(`API key ${i + 1} quota exceeded`);
          continue; // Try next key
        }
      }
      
      throw new Error(`API key ${i + 1} failed: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      console.log(`❌ API key ${i + 1} failed:`, error);
      lastError = error;
      continue; // Try next key
    }
  }
  
  // All keys failed
  throw new Error(`All ${API_KEYS.length} API keys failed. Last error: ${lastError}`);
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: any;
      channelTitle: string;
    };
  }>;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    console.log('🎥 Fetching REAL YouTube content from AIME channel...');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    // Check API key availability
    console.log('🔍 YouTube API Keys check:', `${API_KEYS.length} keys available`);
    
    const useMock = searchParams.get('mock') === 'true';
    
    // Force real API usage if we have API keys
    if (API_KEYS.length === 0) {
      console.log('❌ No valid YouTube API keys found');
      throw new Error('YouTube API key required but not found');
    }
    
    if (useMock) {
      console.log('🔄 Mock mode explicitly requested via URL parameter');
      throw new Error('Mock mode requested');
    }
    
    console.log(`✅ Using REAL YouTube API with ${API_KEYS.length} available keys`);
    
    try {
      console.log(`🔄 Fetching ALL videos from REAL @aimementoring YouTube channel...`);
      
      // Step 1: Get channel info and uploads playlist ID
      console.log('🔗 Getting channel info...');
      
      const channelData = await makeYouTubeAPICall(
        `channels?id=${AIME_CHANNEL_ID}&part=contentDetails,statistics,snippet`
      );
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }
      
      const channel = channelData.items[0];
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
      const totalVideoCount = parseInt(channel.statistics.videoCount);
      
      console.log(`📊 Found channel: ${channel.snippet.title} with ${totalVideoCount} videos`);
      console.log(`📝 Uploads playlist ID: ${uploadsPlaylistId}`);
      
      // Step 2: Get ALL videos from uploads playlist with pagination
      let allVideos: any[] = [];
      let nextPageToken: string | undefined;
      let pageCount = 0;
      const maxPages = Math.ceil(limit / 50); // Calculate how many pages we need
      
      do {
        console.log(`🔗 Fetching page ${pageCount + 1} of videos...`);
        
        const playlistData = await makeYouTubeAPICall(
          `playlistItems?playlistId=${uploadsPlaylistId}&part=snippet&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
        );
        allVideos.push(...playlistData.items);
        nextPageToken = playlistData.nextPageToken;
        pageCount++;
        
        console.log(`📊 Fetched ${allVideos.length} videos so far...`);
        
        // Apply offset logic
        if (allVideos.length >= offset + limit) {
          break;
        }
        
      } while (nextPageToken && pageCount < maxPages && allVideos.length < limit + offset);
      
      // Step 3: Get detailed video information in batches
      const videosToReturn = allVideos.slice(offset, offset + limit);
      const videoIds = videosToReturn.map(item => item.snippet.resourceId.videoId).join(',');
      
      if (videoIds) {
        console.log('🔗 Getting detailed video info...');
        
        const detailsData = await makeYouTubeAPICall(
          `videos?id=${videoIds}&part=snippet,statistics,contentDetails`
        );
        
        // Convert to ContentItem format with REAL data
        let items: any[] = detailsData.items.map((video: any) => ({
          id: `youtube-${video.id}`,
          title: video.snippet.title,
          description: video.snippet.description,
          contentType: 'video',
          source: 'youtube',
          url: `https://youtube.com/watch?v=${video.id}`,
          date: video.snippet.publishedAt,
          tags: extractTags(video.snippet.title + ' ' + video.snippet.description),
          themes: [{ id: 'education', name: 'Education', relevance: 90 }],
          topics: [{ id: 'mentoring', name: 'Mentoring', keywords: ['mentor', 'guide', 'youth'] }],
          authors: [video.snippet.channelTitle],
          thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
          metadata: {
            videoId: video.id,
            publishedAt: video.snippet.publishedAt,
            channelId: video.snippet.channelId,
            channelTitle: video.snippet.channelTitle,
            duration: video.contentDetails.duration,
            viewCount: parseInt(video.statistics.viewCount || '0'),
            likeCount: parseInt(video.statistics.likeCount || '0'),
            commentCount: parseInt(video.statistics.commentCount || '0'),
            thumbnails: video.snippet.thumbnails,
            tags: video.snippet.tags || [],
            categoryId: video.snippet.categoryId,
            defaultLanguage: video.snippet.defaultLanguage,
            caption: video.contentDetails.caption === 'true'
          }
        }));
        
        // Apply search filter if provided
        if (search) {
          const searchTerm = search.toLowerCase();
          items = items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }
        
        console.log(`✅ Successfully fetched ${items.length} REAL videos from @aimementoring channel!`);
        
        return NextResponse.json({
          success: true,
          items,
          meta: {
            total: totalVideoCount,
            offset,
            limit,
            hasMore: offset + items.length < totalVideoCount,
            channelInfo: {
              title: channel.snippet.title,
              handle: AIME_CHANNEL_HANDLE,
              videoCount: totalVideoCount,
              subscriberCount: channel.statistics.subscriberCount
            },
            source: 'REAL_YOUTUBE_API'
          }
        });
      }
      
    } catch (apiError) {
      console.error('❌ YouTube API failed:', apiError);
      
      // Check if it's a quota exceeded error
      const errorMessage = String(apiError);
      const isQuotaExceeded = errorMessage.includes('quota') || errorMessage.includes('403');
      
      if (isQuotaExceeded) {
        console.log('⚠️ YouTube API quota exceeded - using enhanced mock data representing your 423 real videos');
      } else {
        console.log('⚠️ YouTube API error - using enhanced mock data as fallback');
      }
      
      // Fallback to enhanced mock data that simulates 423 videos
      console.log('📝 Using enhanced mock data for 423 AIME videos...');
      
      const totalAvailable = 423; // Match your actual video count
      const remainingItems = Math.max(0, totalAvailable - offset);
      const itemsToReturn = Math.min(limit, remainingItems);
      
      if (itemsToReturn === 0) {
        return NextResponse.json({
          success: true,
          items: [],
          meta: {
            total: totalAvailable,
            offset,
            limit,
            hasMore: false,
            source: 'MOCK_423_VIDEOS'
          }
        });
      }
      
      // Generate realistic AIME video titles and content
      const videoTopics = [
        'Mentoring Journey', 'Indigenous Education', 'University Pathways', 'Youth Leadership',
        'Cultural Bridge', 'Student Success', 'Community Impact', 'Education Access',
        'Leadership Development', 'AIME Programs', 'Mentor Training', 'Student Stories',
        'University Partnerships', 'Indigenous Knowledge', 'Youth Empowerment', 'Program Outcomes',
        'Community Engagement', 'Educational Equity', 'Student Support', 'Graduation Stories'
      ];
      
      // Use actual existing images as thumbnails
      const availableThumbnails = [
        '/assets/images/IMG_1461.jpg',
        '/assets/images/School - Day 4-16.jpg', 
        '/assets/images/School - Day 4-20.jpg',
        '/assets/images/School - Day 4-44.jpg',
        '/assets/images/Uluru Day 1-136.jpg',
        '/assets/images/Uluru Day 1-47.jpg'
      ];

      const mockItems: any[] = Array.from({ length: itemsToReturn }, (_, i) => {
        const globalIndex = offset + i;
        const topic = videoTopics[globalIndex % videoTopics.length];
        
        return {
          id: `youtube-${globalIndex}`,
          title: `AIME Video ${globalIndex + 1}: ${topic}`,
          description: `Educational video about ${topic.toLowerCase()} and youth development featuring AIME programs and student stories.`,
          contentType: 'video',
          source: 'youtube',
          url: `https://youtube.com/watch?v=aime_${globalIndex}`,
          date: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(), // Last 2 years
          tags: ['education', 'mentoring', 'youth', 'indigenous', 'aime', topic.toLowerCase().replace(' ', '-')],
          themes: [{ 
            id: 'education', 
            name: 'Education', 
            relevance: 85 + Math.floor(Math.random() * 15) 
          }],
          topics: [{ 
            id: 'mentoring', 
            name: 'Mentoring', 
            keywords: ['mentor', 'guide', 'student', 'youth'] 
          }],
          authors: ['AIME Team'],
          thumbnail: availableThumbnails[globalIndex % availableThumbnails.length]
        };
      });

      return NextResponse.json({
        success: true,
        items: mockItems,
        meta: {
          total: totalAvailable,
          offset,
          limit,
          hasMore: offset + itemsToReturn < totalAvailable,
          source: 'MOCK_423_VIDEOS',
          apiError: isQuotaExceeded ? 'YouTube API quota exceeded - reset at midnight PT' : 'YouTube API unavailable, using enhanced mock data'
        }
      });
    }

  } catch (error) {
    console.error('❌ YouTube integration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch YouTube content'
    }, { status: 500 });
  }
}

// Helper function to extract tags from content
function extractTags(content: string): string[] {
  const commonTags = ['education', 'mentoring', 'youth', 'indigenous', 'aime'];
  const contentLower = content.toLowerCase();
  
  const additionalTags = [];
  if (contentLower.includes('university')) additionalTags.push('university');
  if (contentLower.includes('student')) additionalTags.push('student');
  if (contentLower.includes('leadership')) additionalTags.push('leadership');
  if (contentLower.includes('community')) additionalTags.push('community');
  if (contentLower.includes('culture')) additionalTags.push('cultural');
  if (contentLower.includes('success')) additionalTags.push('success');
  if (contentLower.includes('training')) additionalTags.push('training');
  
  return [...commonTags, ...additionalTags];
}