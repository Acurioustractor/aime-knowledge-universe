/**
 * Test script for bulk video import system
 */

const testBulkImport = async () => {
  console.log('🚀 Testing bulk import system...');

  try {
    // Test 1: Check current status
    console.log('\n1. Checking current video status...');
    const statusResponse = await fetch('http://localhost:3001/api/imagination-tv/episodes');
    const statusData = await statusResponse.json();
    
    if (statusData.success) {
      console.log(`📊 Current videos in database: ${statusData.data.total}`);
      console.log(`📺 Episodes found: ${statusData.data.episodes.length}`);
    }

    // Test 2: Test Airtable AIME TV import
    console.log('\n2. Testing Airtable AIME TV import...');
    const airtableResponse = await fetch('http://localhost:3001/api/imagination-tv/import-airtable-episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey: 'aime-import-2024' })
    });
    
    const airtableData = await airtableResponse.json();
    console.log('Airtable result:', airtableData);

    // Test 3: Test small YouTube import
    console.log('\n3. Testing small YouTube import...');
    const youtubeResponse = await fetch('http://localhost:3001/api/imagination-tv/import-real', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        adminKey: 'aime-import-2024',
        maxVideos: 5,
        channelId: '@aimementoring'
      })
    });
    
    const youtubeData = await youtubeResponse.json();
    console.log('YouTube result:', youtubeData);

    // Test 4: Test deduplication
    console.log('\n4. Testing deduplication analysis...');
    const dedupeResponse = await fetch('http://localhost:3001/api/imagination-tv/deduplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        adminKey: 'aime-import-2024',
        action: 'analyze'
      })
    });
    
    const dedupeData = await dedupeResponse.json();
    console.log('Deduplication result:', dedupeData);

    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testBulkImport();
}

module.exports = { testBulkImport };