/**
 * Direct database import of real AIME videos
 */

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const directImportReal = async () => {
  console.log('🚀 DIRECT IMPORT OF REAL AIME VIDEOS...');

  const dbPath = path.join(process.cwd(), 'data', 'video.db');
  const realVideos = JSON.parse(fs.readFileSync('./real-youtube-videos.json', 'utf8'));
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }

      console.log('📺 Connected to video database');
      console.log(`📥 Importing ${realVideos.length} real AIME videos...`);
      
      let imported = 0;
      let processed = 0;
      
      const insertVideo = (video, callback) => {
        const episodeId = `aime-real-${video.id}`;
        const now = new Date().toISOString();
        
        // Classify video based on title
        const themes = [];
        const programs = [];
        const title = video.title.toLowerCase();
        
        if (title.includes('mentoring')) themes.push('mentoring');
        if (title.includes('indigenous')) themes.push('indigenous-wisdom');
        if (title.includes('education')) themes.push('education');
        if (title.includes('success')) themes.push('youth-leadership');
        if (title.includes('aime')) programs.push('aime-core');
        
        // Generate learning objectives
        const learningObjectives = [
          'Understand AIME\'s approach to Indigenous education',
          'Learn about mentoring relationships and their impact',
          'Explore Indigenous perspectives on education and success'
        ];
        
        const sql = `
          INSERT INTO imagination_tv_episodes (
            id, episode_number, season, title, description,
            video_url, youtube_id, duration_seconds, duration_iso,
            thumbnail_url, published_at, updated_at, status, content_type,
            themes, programs, learning_objectives, age_groups, cultural_contexts,
            view_count, like_count, discussion_count, reflection_count,
            has_transcription, transcription_status, wisdom_extracts_count,
            key_topics, access_level, cultural_sensitivity, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
          episodeId,
          Math.floor(Math.random() * 1000) + 100, // Random episode number
          2, // Season 2 for real YouTube imports
          video.title,
          video.description,
          video.url,
          video.id,
          0, // Duration in seconds (unknown)
          'PT0S', // Duration ISO
          video.thumbnail,
          video.publishedAt,
          now, // updated_at
          'published',
          'educational',
          JSON.stringify(themes),
          JSON.stringify(programs),
          JSON.stringify(learningObjectives),
          JSON.stringify(['13+']), // Age groups
          JSON.stringify(['Indigenous', 'Australian']), // Cultural contexts
          video.viewCount || 0,
          video.likeCount || 0,
          0, // discussion_count
          0, // reflection_count
          false, // has_transcription
          'pending', // transcription_status
          0, // wisdom_extracts_count
          JSON.stringify(['aime', 'indigenous', 'education']), // key_topics
          'public', // access_level
          'advisory', // cultural_sensitivity (Indigenous content)
          now // created_at
        ];
        
        db.run(sql, params, function(err) {
          if (err) {
            console.error(`❌ Failed to import ${video.title}:`, err);
          } else {
            console.log(`✅ Imported: ${video.title}`);
            imported++;
          }
          processed++;
          callback();
        });
      };
      
      // Process videos sequentially
      let index = 0;
      const processNext = () => {
        if (index >= realVideos.length) {
          console.log(`\n🎉 IMPORT COMPLETE!`);
          console.log(`✅ Successfully imported: ${imported}/${processed} videos`);
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err);
            } else {
              console.log('📺 Database closed');
            }
            resolve({ imported, processed });
          });
          return;
        }
        
        insertVideo(realVideos[index], () => {
          index++;
          processNext();
        });
      };
      
      processNext();
    });
  });
};

directImportReal().then(result => {
  console.log(`\n🚀 SUCCESS! ${result.imported} real AIME videos imported!`);
  console.log(`\n🌐 Test your REAL video system at:`);
  console.log(`   http://localhost:3001/apps/imagination-tv`);
}).catch(console.error);