/**
 * Import ALL 393 AIME videos into the database
 */

const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const importAll393Videos = async () => {
  console.log('🚀 IMPORTING ALL 393 REAL AIME VIDEOS...');

  const dbPath = path.join(process.cwd(), 'data', 'video.db');
  const allVideos = JSON.parse(fs.readFileSync('./all-aime-videos.json', 'utf8'));
  
  console.log(`📺 Loading ${allVideos.length} videos from all-aime-videos.json`);
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }

      console.log('📺 Connected to video database');
      console.log(`📥 Importing ${allVideos.length} REAL AIME videos in batches...`);
      
      let imported = 0;
      let skipped = 0;
      let processed = 0;
      const batchSize = 10;
      
      const insertVideo = (video, callback) => {
        const episodeId = `aime-all-${video.id}`;
        const now = new Date().toISOString();
        
        // Check if video already exists
        db.get('SELECT id FROM imagination_tv_episodes WHERE youtube_id = ?', [video.id], (err, existing) => {
          if (existing) {
            console.log(`⏭️  Video ${video.title.substring(0, 40)}... already exists, skipping`);
            skipped++;
            processed++;
            callback();
            return;
          }
          
          // Classify video based on title
          const themes = [];
          const programs = [];
          const title = video.title.toLowerCase();
          
          if (title.includes('mentoring')) themes.push('mentoring');
          if (title.includes('indigenous')) themes.push('indigenous-wisdom');
          if (title.includes('education')) themes.push('education');
          if (title.includes('imagi-nation')) themes.push('imagination');
          if (title.includes('kindness')) themes.push('kindness-economics');
          if (title.includes('joy')) themes.push('joy');
          if (title.includes('miracle')) themes.push('innovation');
          
          if (title.includes('imagi-nation')) programs.push('imagination-tv');
          if (title.includes('labs')) programs.push('imagi-labs');
          if (title.includes('university')) programs.push('imagi-university');
          if (title.includes('hoodie economics') || title.includes('kindness economics')) programs.push('hoodie-economics');
          
          // Generate learning objectives
          const learningObjectives = [
            'Understand AIME\'s approach to Indigenous education and mentoring',
            'Explore innovative solutions to complex social challenges',
            'Learn about imagination-based approaches to systems change'
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
            Math.floor(Math.random() * 10000) + 1000, // Random episode number
            3, // Season 3 for ALL AIME videos
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
            JSON.stringify(['Indigenous', 'Australian', 'Global']), // Cultural contexts
            0, // view_count
            0, // like_count
            0, // discussion_count
            0, // reflection_count
            false, // has_transcription
            'pending', // transcription_status
            0, // wisdom_extracts_count
            JSON.stringify(['aime', 'mentoring', 'education', 'imagination']), // key_topics
            'public', // access_level
            'advisory', // cultural_sensitivity (Indigenous content)
            now // created_at
          ];
          
          db.run(sql, params, function(err) {
            if (err) {
              console.error(`❌ Failed to import ${video.title.substring(0, 30)}...:`, err.message);
            } else {
              imported++;
              if (imported % 50 === 0) {
                console.log(`✅ Progress: ${imported}/${allVideos.length} videos imported`);
              }
            }
            processed++;
            callback();
          });
        });
      };
      
      // Process videos in batches
      let index = 0;
      
      const processBatch = () => {
        const batch = allVideos.slice(index, index + batchSize);
        if (batch.length === 0) {
          console.log(`\n🎉 IMPORT COMPLETE!`);
          console.log(`✅ Successfully imported: ${imported} videos`);
          console.log(`⏭️  Skipped duplicates: ${skipped} videos`);
          console.log(`📊 Total processed: ${processed}/${allVideos.length} videos`);
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err);
            } else {
              console.log('📺 Database closed');
            }
            resolve({ imported, skipped, processed });
          });
          return;
        }
        
        let batchComplete = 0;
        batch.forEach(video => {
          insertVideo(video, () => {
            batchComplete++;
            if (batchComplete === batch.length) {
              index += batchSize;
              // Small delay between batches
              setTimeout(processBatch, 50);
            }
          });
        });
      };
      
      processBatch();
    });
  });
};

importAll393Videos().then(result => {
  console.log(`\n🚀 SUCCESS! ${result.imported} real AIME videos imported!`);
  console.log(`📊 Total videos in database: ${result.imported + result.skipped}`);
  console.log(`\n🌐 Test your MASSIVE video library at:`);
  console.log(`   http://localhost:3000/apps/imagination-tv`);
  console.log(`\n🔥 You now have 393 REAL AIME videos! 🔥`);
}).catch(console.error);