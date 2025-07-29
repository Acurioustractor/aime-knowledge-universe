/**
 * Import REAL AIME YouTube videos into IMAGI-NATION TV database
 */

const fs = require('fs');

const importRealVideos = async () => {
  console.log('🔥 CLEARING FAKE DATA AND IMPORTING REAL AIME VIDEOS...');

  try {
    // Step 1: Clear existing fake data
    console.log('\n1. Clearing fake video data...');
    const clearResponse = await fetch('http://localhost:3001/api/imagination-tv/episodes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey: 'aime-import-2024', clearAll: true })
    });

    if (clearResponse.ok) {
      console.log('✅ Cleared existing fake data');
    } else {
      console.log('⚠️ Could not clear via API, continuing with import...');
    }

    // Step 2: Load real video data
    const realVideos = JSON.parse(fs.readFileSync('./real-youtube-videos.json', 'utf8'));
    console.log(`\n2. Loading ${realVideos.length} REAL AIME videos...`);

    // Step 3: Import each real video
    console.log('\n3. Importing REAL videos to database...');
    let imported = 0;
    let errors = [];

    for (const video of realVideos) {
      try {
        const importResponse = await fetch('http://localhost:3001/api/imagination-tv/import-real', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminKey: 'aime-import-2024',
            directImport: true,
            videoData: {
              id: video.id,
              title: video.title,
              description: video.description,
              publishedAt: video.publishedAt,
              thumbnail: video.thumbnail,
              url: video.url,
              channelTitle: video.channelTitle,
              duration: 'PT0S', // Will be updated when we get video details
              tags: ['aime', 'indigenous', 'education', 'mentoring'],
              viewCount: 0,
              likeCount: 0,
              hasTranscription: false
            }
          })
        });

        if (importResponse.ok) {
          console.log(`✅ Imported: ${video.title.substring(0, 50)}...`);
          imported++;
        } else {
          const errorData = await importResponse.text();
          console.log(`❌ Failed: ${video.title.substring(0, 30)}... - ${errorData}`);
          errors.push(`${video.title}: ${errorData}`);
        }

      } catch (error) {
        console.log(`❌ Error importing ${video.title.substring(0, 30)}...: ${error.message}`);
        errors.push(`${video.title}: ${error.message}`);
      }
    }

    console.log(`\n🎉 IMPORT COMPLETE!`);
    console.log(`✅ Successfully imported: ${imported} videos`);
    console.log(`❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n🔍 Error details:');
      errors.forEach(error => console.log(`  - ${error}`));
    }

    // Step 4: Verify the import
    console.log('\n4. Verifying import...');
    const verifyResponse = await fetch('http://localhost:3001/api/imagination-tv/episodes');
    const verifyData = await verifyResponse.json();
    
    if (verifyData.success) {
      console.log(`✅ Database now contains ${verifyData.data.total} episodes`);
      console.log('\n📺 Real AIME videos now in system:');
      verifyData.data.episodes.slice(0, 5).forEach((ep, i) => {
        console.log(`${i + 1}. ${ep.title}`);
      });
    }

    return {
      imported,
      errors: errors.length,
      total: verifyData.data?.total || 0
    };

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
};

// Run the import
importRealVideos().then(result => {
  console.log(`\n🚀 SUCCESS! Imported ${result.imported} real AIME videos!`);
  console.log(`📊 Total videos in database: ${result.total}`);
  console.log(`\n🌐 Test your real video system at:`);
  console.log(`   http://localhost:3001/apps/imagination-tv`);
}).catch(error => {
  console.error('💥 Import failed:', error);
});