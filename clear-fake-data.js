/**
 * Clear fake video data from database
 */

const sqlite3 = require('sqlite3');
const path = require('path');

const clearFakeData = async () => {
  console.log('🧹 Clearing fake video data...');

  const dbPath = path.join(process.cwd(), 'data', 'video.db');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }

      console.log('📺 Connected to video database');
      
      // Clear all episodes
      db.run('DELETE FROM imagination_tv_episodes', [], function(err) {
        if (err) {
          console.error('❌ Failed to clear episodes:', err);
          reject(err);
        } else {
          console.log(`✅ Cleared ${this.changes} episodes`);
          
          // Clear related data
          db.run('DELETE FROM episode_segments', [], function(err) {
            if (err) {
              console.error('❌ Failed to clear segments:', err);
            } else {
              console.log(`✅ Cleared ${this.changes} segments`);
            }
          });
          
          db.run('DELETE FROM video_wisdom_extracts', [], function(err) {
            if (err) {
              console.error('❌ Failed to clear wisdom extracts:', err);
            } else {
              console.log(`✅ Cleared ${this.changes} wisdom extracts`);
            }
          });
          
          db.run('DELETE FROM episode_knowledge_connections', [], function(err) {
            if (err) {
              console.error('❌ Failed to clear knowledge connections:', err);
            } else {
              console.log(`✅ Cleared ${this.changes} knowledge connections`);
            }
          });
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err);
            } else {
              console.log('📺 Database cleared and closed');
            }
            resolve();
          });
        }
      });
    });
  });
};

clearFakeData().then(() => {
  console.log('🎉 Fake data cleared! Ready for real video import.');
}).catch(console.error);