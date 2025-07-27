/**
 * Find ALL AIME videos from YouTube
 */

const axios = require('axios');

const findAllAimeVideos = async () => {
  console.log('🔍 SEARCHING FOR ALL 400+ AIME VIDEOS...');

  const API_KEY = 'AIzaSyCUXSCmZ1T1PEHoromxj3Y7H9z0wyelhmI';
  
  try {
    // Search 1: Get videos from AIME Mentoring channel directly
    console.log('\n1. Searching AIME Mentoring channel...');
    
    // First, find the channel ID for AIME Mentoring
    const channelSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&type=channel&q=AIME%20Mentoring&key=${API_KEY}`;
    const channelResponse = await axios.get(channelSearchUrl);
    
    console.log('📺 Found channels:');
    channelResponse.data.items.forEach((channel, i) => {
      console.log(`${i + 1}. ${channel.snippet.title} (${channel.id.channelId})`);
      console.log(`   Description: ${channel.snippet.description.substring(0, 100)}...`);
    });

    // Get the AIME Mentoring channel ID
    const aimeChannel = channelResponse.data.items.find(ch => 
      ch.snippet.title.toLowerCase().includes('aime') && 
      ch.snippet.title.toLowerCase().includes('mentoring')
    );
    
    if (aimeChannel) {
      const channelId = aimeChannel.id.channelId;
      console.log(`\n🎯 Found AIME Mentoring channel: ${channelId}`);
      
      // Now get ALL videos from this channel
      console.log('\n2. Getting ALL videos from AIME Mentoring channel...');
      
      let allVideos = [];
      let nextPageToken = '';
      let pageCount = 0;
      
      do {
        pageCount++;
        console.log(`   📦 Fetching page ${pageCount}...`);
        
        const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&pageToken=${nextPageToken}&key=${API_KEY}`;
        const videosResponse = await axios.get(videosUrl);
        
        const pageVideos = videosResponse.data.items;
        allVideos = allVideos.concat(pageVideos);
        
        console.log(`   ✅ Got ${pageVideos.length} videos (total: ${allVideos.length})`);
        
        nextPageToken = videosResponse.data.nextPageToken || '';
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } while (nextPageToken && pageCount < 20); // Safety limit
      
      console.log(`\n🎉 TOTAL VIDEOS FOUND: ${allVideos.length}`);
      
      // Process and save all videos
      const processedVideos = allVideos.map(video => ({
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.medium?.url,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        channelTitle: video.snippet.channelTitle,
        hasTranscription: false
      }));
      
      // Save to file
      const fs = require('fs');
      fs.writeFileSync('./all-aime-videos.json', JSON.stringify(processedVideos, null, 2));
      console.log(`💾 Saved ${processedVideos.length} videos to all-aime-videos.json`);
      
      return { channelId, videos: processedVideos };
    }
    
    // Search 2: Broader search for AIME videos
    console.log('\n3. Doing broader search for AIME videos...');
    
    let broadVideos = [];
    let nextPageToken = '';
    let pageCount = 0;
    
    do {
      pageCount++;
      console.log(`   📦 Broad search page ${pageCount}...`);
      
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&type=video&q=AIME%20Australian%20Indigenous%20Mentoring%20Experience&pageToken=${nextPageToken}&key=${API_KEY}`;
      const searchResponse = await axios.get(searchUrl);
      
      const pageVideos = searchResponse.data.items;
      broadVideos = broadVideos.concat(pageVideos);
      
      console.log(`   ✅ Got ${pageVideos.length} videos (total: ${broadVideos.length})`);
      
      nextPageToken = searchResponse.data.nextPageToken || '';
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } while (nextPageToken && pageCount < 10);
    
    console.log(`\n🌐 BROAD SEARCH TOTAL: ${broadVideos.length} videos`);
    
    const processedBroadVideos = broadVideos.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails?.medium?.url,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      channelTitle: video.snippet.channelTitle,
      hasTranscription: false
    }));
    
    const fs = require('fs');
    fs.writeFileSync('./broad-aime-videos.json', JSON.stringify(processedBroadVideos, null, 2));
    console.log(`💾 Saved ${processedBroadVideos.length} broad search videos`);
    
    return { videos: processedBroadVideos };
    
  } catch (error) {
    console.error('❌ Search error:', error.response?.data || error.message);
  }
};

// Run the search
findAllAimeVideos().then(result => {
  if (result && result.videos) {
    console.log(`\n🚀 SUCCESS! Found ${result.videos.length} AIME videos!`);
    console.log('📺 Sample video titles:');
    result.videos.slice(0, 10).forEach((video, i) => {
      console.log(`   ${i + 1}. ${video.title} (${video.channelTitle})`);
    });
    console.log('\n🔥 Ready to import ALL videos into IMAGI-NATION TV!');
  }
}).catch(console.error);