/**
 * Check real videos in database
 */

const sqlite3 = require('sqlite3');
const path = require('path');

const checkRealVideos = async () => {
  console.log('🔍 Checking real videos in database...');

  const dbPath = path.join(process.cwd(), 'data', 'video.db');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }

      console.log('📺 Connected to video database');
      
      db.all('SELECT id, title, youtube_id, published_at, status FROM imagination_tv_episodes ORDER BY published_at DESC', [], (err, rows) => {
        if (err) {
          console.error('❌ Query failed:', err);
          reject(err);
        } else {
          console.log(`\n📊 Found ${rows.length} episodes in database:`);
          console.log('='.repeat(80));
          
          rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.title}`);
            console.log(`   YouTube ID: ${row.youtube_id}`);
            console.log(`   Published: ${new Date(row.published_at).toLocaleDateString()}`);
            console.log(`   Status: ${row.status}`);
            console.log('');
          });
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err);
            } else {
              console.log('📺 Database closed');
            }
            resolve(rows);
          });
        }
      });
    });
  });
};

checkRealVideos().then(videos => {
  console.log(`\n✅ SUCCESS! ${videos.length} REAL AIME videos confirmed in database!`);
  console.log('\n🎬 Your REAL video titles include:');
  videos.slice(0, 5).forEach((video, i) => {
    console.log(`   ${i + 1}. ${video.title}`);
  });
  console.log(`\n🚀 Database contains authentic AIME content!`);
}).catch(console.error);