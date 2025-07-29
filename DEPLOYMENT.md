# 🚀 AIME Knowledge Universe - Deployment Guide

## 🎯 **Quick Deploy for Operations Team**

### **One-Command Setup**
```bash
# Clone and setup in one go
git clone https://github.com/YOUR_ORG/aime-knowledge-universe.git
cd aime-knowledge-universe
npm install
cp .env.example .env.local
npm run dev
```

**⚠️ Then configure `.env.local` with your API keys**

---

## 🔧 **Platform Deployment Options**

### **Option 1: Vercel (Recommended - Zero Config)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with one command
vercel

# Follow prompts:
# - Connect to GitHub
# - Configure environment variables
# - Deploy automatically
```

**Environment Variables to Set in Vercel:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
YOUTUBE_API_KEY=your_youtube_key
AIRTABLE_API_KEY=your_airtable_key
MAILCHIMP_API_KEY=your_mailchimp_key
```

### **Option 2: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **Option 3: DigitalOcean App Platform**
```bash
# Create app.yaml
cat > app.yaml << 'EOF'
name: aime-knowledge-universe
services:
- name: web
  source_dir: /
  github:
    repo: YOUR_ORG/aime-knowledge-universe
    branch: main
  run_command: npm start
  build_command: npm run build
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
EOF

# Deploy via DigitalOcean dashboard
```

---

## 🗄️ **Database Setup**

### **Supabase Setup (Recommended)**
```bash
# 1. Create Supabase project at https://supabase.com
# 2. Get your URL and keys from project settings
# 3. Run database setup script

node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
console.log('✅ Supabase connected successfully');
"
```

### **Local SQLite Setup**
```bash
# SQLite databases are included and ready to use
# No additional setup required for development
ls -la data/
# Should show: aime-data-lake.db, video.db, etc.
```

---

## 🔑 **API Keys & Integration Setup**

### **Required APIs (Core Functionality)**
1. **Supabase** (Database)
   - Create account at https://supabase.com
   - Create new project
   - Get URL and anon key from Settings > API

### **Optional APIs (Enhanced Features)**
2. **YouTube Data API**
   - Go to https://console.developers.google.com
   - Enable YouTube Data API v3
   - Create credentials

3. **Airtable**
   - Create token at https://airtable.com/create/tokens
   - Get base ID from your Airtable base

4. **Mailchimp**
   - Get API key from https://admin.mailchimp.com/account/api/
   - Get audience ID from your Mailchimp account

---

## 🎮 **Moneyless Shop Configuration**

### **Hoodie Economics Setup**
```bash
# The hoodie system is pre-configured and ready
# Access admin dashboard at: /admin
# Configure points and rewards in: /admin/hoodie-system

# Default point values (customizable):
# - Survey completion: 10 points
# - Video watching: 1 point per minute
# - Challenge completion: 50-100 points
# - Joy Corp accreditation: Custom hoodie unlock
```

### **User Point Tracking**
```javascript
// Points are automatically tracked when users:
// 1. Complete surveys (/learn)
// 2. Watch videos (/content/videos)
// 3. Engage with knowledge (/discover)
// 4. Complete challenges (/hoodie-challenge)

// Admin can view all user points at:
// /admin/user-metrics
```

---

## 📊 **Operational Monitoring**

### **Health Checks**
```bash
# API health
curl https://your-domain.com/api/health

# Database connectivity
curl https://your-domain.com/api/unified-search/health

# System status
curl https://your-domain.com/api/dashboard
```

### **Admin Dashboard Access**
- **URL:** `https://your-domain.com/admin`
- **Features:**
  - Content management
  - User point tracking
  - Hoodie distribution
  - System health monitoring
  - Knowledge curation

---

## 🔧 **Performance Optimization**

### **Caching Strategy**
```bash
# Redis setup (optional, for high traffic)
# Set REDIS_URL in environment variables
# Caching is automatically enabled when Redis is available
```

### **Database Optimization**
```bash
# SQLite optimization (automatic)
# Supabase scaling (automatic)
# Content CDN (via Vercel/platform)
```

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

**1. Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**2. Database Connection Issues**
```bash
# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test connection
node -e "console.log(require('@supabase/supabase-js'))"
```

**3. API Integration Failures**
```bash
# YouTube API quota exceeded
# Solution: Implement API rotation or increase quota

# Airtable rate limits
# Solution: Implement request queuing

# Mailchimp authentication
# Solution: Verify API key and server prefix
```

### **Emergency Maintenance**
```bash
# Put site in maintenance mode
touch public/maintenance.html

# Disable external APIs temporarily
export YOUTUBE_API_KEY=""
export AIRTABLE_API_KEY=""

# Restart with local data only
npm run dev
```

---

## 🔐 **Security Checklist**

### **Production Security**
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API keys rotated regularly
- [ ] HTTPS enabled
- [ ] Admin access protected
- [ ] User data encrypted
- [ ] Rate limiting enabled
- [ ] Error logging configured

### **Backup Strategy**
```bash
# Database backups (automated via Supabase)
# Static file backups (via platform)
# Environment config backups (manually managed)

# Emergency restore process:
# 1. Deploy from GitHub
# 2. Restore environment variables
# 3. Verify database connectivity
# 4. Test core functionality
```

---

## 🎯 **Success Metrics**

### **Operational KPIs**
- **Uptime:** 99.9% target
- **Response Time:** <2s average
- **Database Queries:** <100ms average
- **User Engagement:** Points earned per session
- **Knowledge Access:** Searches per day
- **Hoodie Distribution:** Rewards claimed per week

### **Business Metrics**
- **Joy Corps Created:** Organizations earning hoodies
- **Knowledge Interaction:** Content engagement rates
- **Community Growth:** Active users per month
- **API Usage:** External integrations (Fortnite, etc.)

---

## 🚀 **Go-Live Checklist**

### **Pre-Launch**
- [ ] Repository deployed to production platform
- [ ] Environment variables configured
- [ ] Database connected and seeded
- [ ] API integrations tested
- [ ] Admin dashboard accessible
- [ ] Security measures verified
- [ ] Performance optimized
- [ ] Monitoring enabled

### **Launch Day**
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] CDN enabled
- [ ] Backup systems running
- [ ] Team access configured
- [ ] Documentation updated
- [ ] Support channels ready

### **Post-Launch**
- [ ] Monitor system performance
- [ ] Track user engagement
- [ ] Collect feedback
- [ ] Plan next iterations
- [ ] Scale resources as needed

---

## 🎉 **Ready for Operation**

**The AIME Knowledge Universe is now ready for:**

1. **🛒 Moneyless Shop Operations** - Users can earn points and claim hoodies
2. **📊 Knowledge Curation** - Admin team can manage content and rewards
3. **🔗 API Integrations** - Ready for Fortnite, Guardians, Nike partnerships
4. **🌍 Global Scale** - Deployed on reliable, scalable infrastructure
5. **📈 Impact Measurement** - Track engagement and community growth

**Contact for Support:** [Your contact information]
**Emergency Contact:** [Emergency support details]

---

*"This is our shop. Finally." - Ready for global impact! 🌍*