/**
 * Test script to find and import REAL YouTube videos
 */

const axios = require('axios');

const testRealYouTube = async () => {
  console.log('🎯 Testing REAL YouTube API for AIME videos...');

  const API_KEY = 'AIzaSyCUXSCmZ1T1PEHoromxj3Y7H9z0wyelhmI';
  
  try {
    // Test 1: Search for AIME videos broadly
    console.log('\n1. Broad search for AIME videos...');
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=relevance&type=video&q=AIME%20Indigenous%20education%20Australia&key=${API_KEY}`;
    
    const response = await axios.get(searchUrl);
    const videos = response.data.items;
    
    console.log(`📺 Found ${videos.length} videos`);
    
    if (videos.length > 0) {
      console.log('\n🎬 Sample video titles:');
      videos.slice(0, 5).forEach((video, index) => {
        console.log(`${index + 1}. ${video.snippet.title}`);
        console.log(`   Channel: ${video.snippet.channelTitle}`);
        console.log(`   Published: ${video.snippet.publishedAt}`);
        console.log(`   ID: ${video.id.videoId}`);
        console.log('');
      });
      
      // Now import these REAL videos to our database
      console.log('📥 Importing REAL videos to database...');
      
      const importData = videos.map(video => ({
        id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.medium?.url,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        channelTitle: video.snippet.channelTitle,
        hasTranscription: false
      }));
      
      // Save to a file for manual import
      const fs = require('fs');
      fs.writeFileSync('./real-youtube-videos.json', JSON.stringify(importData, null, 2));
      console.log('💾 Saved real video data to real-youtube-videos.json');
      
      return importData;
    } else {
      console.log('❌ No videos found');
    }
    
  } catch (error) {
    console.error('❌ YouTube API error:', error.response?.data || error.message);
  }
};

// Run the test
testRealYouTube().then(videos => {
  if (videos && videos.length > 0) {
    console.log(`\n✅ SUCCESS: Found ${videos.length} real AIME videos!`);
    console.log('🚀 Ready to import these into IMAGI-NATION TV');
  }
}).catch(console.error);