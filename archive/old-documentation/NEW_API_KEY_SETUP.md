# 🚀 Quick Setup: New YouTube API Key

## **Step 1: Create New API Key (5 minutes)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project**:
   - Click "Select Project" → "New Project"
   - Name it "AIME YouTube API 2" 
   - Click "Create"
3. **Enable YouTube Data API**:
   - Go to "APIs & Services" → "Library"
   - Search "YouTube Data API v3"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - **Copy the key immediately!**

## **Step 2: Add Key to Your System (30 seconds)**

1. **Open your `.env.local` file**
2. **Replace this line**:
   ```env
   YOUTUBE_API_KEY_2=your_new_api_key_here
   ```
   **With your new key**:
   ```env
   YOUTUBE_API_KEY_2=AIzaSyYOUR_NEW_KEY_HERE
   ```
3. **Save the file**

## **Step 3: Restart & Test (1 minute)**

1. **Restart your development server**:
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

2. **Test the new key**:
   ```bash
   curl "http://localhost:3000/api/integrations/youtube?limit=5"
   ```

## **What You'll Get**

✅ **Fresh 10,000 unit daily quota**  
✅ **Automatic failover** (if key 1 fails, uses key 2)  
✅ **All 423 real videos** from your @aimementoring channel  
✅ **Real engagement data** (views, likes, comments)  
✅ **Real thumbnails** and metadata  

## **System Intelligence**

The system now:
- **Tries Key 1** first (your original key)
- **Switches to Key 2** if quota exceeded
- **Falls back to mock data** only if all keys fail
- **Logs which key is working** for debugging

## **Expected Output After Setup**

```json
{
  "success": true,
  "items": [
    {
      "id": "youtube-nfWZhgpzwko",
      "title": "IMAGI-NATION {LABS} - Imagination in Every Classroom",
      "url": "https://youtube.com/watch?v=nfWZhgpzwko",
      "metadata": {
        "viewCount": 196,
        "likeCount": 4,
        "duration": "PT1H6S"
      }
    }
  ],
  "meta": {
    "total": 423,
    "source": "REAL_YOUTUBE_API"
  }
}
```

## **Troubleshooting**

**If you still see mock data:**
1. Check the server logs for "API key X succeeded"
2. Verify the new key is correctly in `.env.local`
3. Make sure you restarted the development server

**Need more keys?**
Repeat the process to create `YOUTUBE_API_KEY_3` for even more quota!

---

**🎯 Result**: Your frontend will immediately show all 423 real AIME videos with full metadata!