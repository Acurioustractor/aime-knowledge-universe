# 🚀 AIME Wiki Deployment Checklist

## ⚠️ CRITICAL ISSUES FOUND & FIXED

### 1. **Security Issues** ✅ FIXED
- [x] Removed hardcoded API keys from source code
- [x] Added development scripts to .gitignore
- [x] Fixed environment variable fallbacks

### 2. **Code Quality Issues** ✅ FIXED
- [x] Fixed smart quotes (curly quotes) in TypeScript files
- [x] Fixed hardcoded localhost URLs in API calls
- [x] Removed escaped quotes from JSX attributes

### 3. **Build Issues** ✅ FIXED
- [x] Created missing module stubs for content-storage, youtube-transcripts, spotify-transcripts
- [x] Fixed webpack configuration for Node.js modules
- [x] Added Airtable domains to image configuration
- [x] Production build now succeeds

## 📋 PRE-DEPLOYMENT CHECKLIST

### Environment Setup
- [ ] Copy `.env.production.example` to `.env.production.local`
- [ ] Set all required environment variables:
  - [ ] `AIRTABLE_API_KEY` (REQUIRED)
  - [ ] `AIRTABLE_BASE_ID_DAM` (REQUIRED)
  - [ ] `YOUTUBE_API_KEY` (REQUIRED)
  - [ ] `NEXT_PUBLIC_APP_URL` (REQUIRED - your domain)
  - [ ] `JWT_SECRET` (REQUIRED - generate secure random)
  - [ ] `SESSION_SECRET` (REQUIRED - generate secure random)
  - [ ] `API_KEY` (REQUIRED - generate secure random)
  - [ ] `ADMIN_API_KEY` (REQUIRED - generate secure random)

### Database Setup
- [ ] Choose database option:
  - [ ] SQLite (default, works automatically)
  - [ ] PostgreSQL (set `DATABASE_URL`)
- [ ] Verify databases exist in `data/` directory:
  - [x] `aime-data-lake.db` (2.7M)
  - [x] `video.db` (544K)
  - [ ] Initialize `aime_knowledge.db` if needed

### Build & Test
```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Test the production build locally
npm run start

# 4. Run linting (if available)
npm run lint

# 5. Run tests (if available)
npm test
```

## 🚀 DEPLOYMENT TO VERCEL

### 1. Prepare GitHub Repository
```bash
# Add all files
git add .

# Commit changes
git commit -m "Production-ready: Fixed security issues, smart quotes, and hardcoded URLs

- Removed hardcoded API keys
- Fixed smart quotes in TypeScript files
- Updated all API calls to use relative URLs
- Added production environment configuration
- Added deployment documentation"

# Push to GitHub
git push origin main
```

### 2. Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 3. Environment Variables in Vercel
Add these in Vercel dashboard (Settings → Environment Variables):

**Required:**
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID_DAM`
- `YOUTUBE_API_KEY`
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- `SESSION_SECRET` (generate with: `openssl rand -base64 32`)
- `API_KEY` (generate with: `openssl rand -base64 32`)
- `ADMIN_API_KEY` (generate with: `openssl rand -base64 32`)

**Optional but Recommended:**
- `DATABASE_URL` (if using PostgreSQL)
- `REDIS_URL` (if using Redis for caching)

### 4. Domain Configuration
- [ ] Add custom domain in Vercel
- [ ] Update DNS records
- [ ] Enable HTTPS (automatic in Vercel)
- [ ] Update `NEXT_PUBLIC_APP_URL` to your domain

## 🔍 POST-DEPLOYMENT VERIFICATION

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Video Library displays videos
- [ ] IMAGI-NATION TV app works
- [ ] Mentor App displays all 18 lessons
- [ ] Individual lesson pages work
- [ ] Video playback (YouTube/Vimeo) works
- [ ] Search functionality works
- [ ] API endpoints respond correctly

### Performance & Security
- [ ] Check browser console for errors
- [ ] Verify no API keys in source
- [ ] Test HTTPS is working
- [ ] Check page load times
- [ ] Verify mobile responsiveness

### Data Verification
- [ ] YouTube videos load (457+ videos)
- [ ] Mentor App lessons load (18 lessons)
- [ ] Airtable data syncs correctly

## 🛠️ TROUBLESHOOTING

### Common Issues

1. **"AIRTABLE_API_KEY is required"**
   - Ensure environment variable is set in Vercel

2. **Videos not loading**
   - Check YOUTUBE_API_KEY is set
   - Verify API quota hasn't been exceeded

3. **Database errors**
   - For SQLite: Ensure data directory is included
   - For PostgreSQL: Verify DATABASE_URL is correct

4. **404 errors on API calls**
   - Ensure all localhost URLs were replaced
   - Check API routes are deployed

## 📝 NOTES

- The app uses SQLite by default (no setup required)
- All sensitive data is in environment variables
- Smart quotes have been fixed in all TypeScript files
- Development scripts with hardcoded keys are gitignored
- The app is optimized for Vercel deployment

## ✅ READY FOR DEPLOYMENT!

Once all items are checked, the application is ready for production deployment on Vercel.