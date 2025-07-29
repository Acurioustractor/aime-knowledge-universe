# 🔐 AIME Wiki Environment Management Guide

## 🚨 CRITICAL: Your API Keys Are Missing!

Your API keys were not found in the environment files. This guide will help you set them up securely and prevent future loss.

## 🔧 Quick Setup (Do This Now)

### 1. Add Your API Keys
Edit `.env.local` and replace the placeholder values:

```bash
# Open your environment file
nano .env.local

# Replace these lines with your actual API keys:
YOUTUBE_API_KEY=your_actual_youtube_api_key
MAILCHIMP_API_KEY=your_actual_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us1
AIRTABLE_API_KEY=your_actual_airtable_api_key
GITHUB_API_TOKEN=your_actual_github_token
```

### 2. Create Immediate Backup
```bash
# Run this after adding your keys
./scripts/backup-env.sh
```

### 3. Test Your Integration
```bash
# Start the development server
npm run dev

# Test the APIs
curl "http://localhost:3000/api/content/real?type=newsletter"
```

## 🛡️ Security System Overview

### Files Created:
- ✅ `.env.example` - Template with all required variables
- ✅ `.env.local` - Your actual environment file (add your keys here)
- ✅ `.gitignore` - Prevents accidental commits of secrets
- ✅ `scripts/backup-env.sh` - Creates encrypted backups
- ✅ `scripts/restore-env.sh` - Restores from backups

### Protection Layers:
1. **Git Protection** - `.env.local` is in `.gitignore`
2. **Backup System** - Automatic encrypted backups
3. **Template System** - `.env.example` for reference
4. **Validation** - Scripts check for required keys

## 📋 Getting Your API Keys

### Mailchimp API Key
1. Go to: https://admin.mailchimp.com/account/api/
2. Click "Create A Key"
3. Copy the key (format: `xxxxxxxx-us1`)
4. The part after the dash is your server prefix

### YouTube API Key
1. Go to: https://console.developers.google.com/
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the key

### Airtable API Key
1. Go to: https://airtable.com/create/tokens
2. Create a Personal Access Token
3. Grant `data.records:read` permissions
4. Copy the token (starts with `pat`)

### GitHub API Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `repo` scope for read access
4. Copy the token

## 🔄 Backup & Recovery Commands

### Create Backup
```bash
./scripts/backup-env.sh
```

### List Backups
```bash
ls -la ~/.aime-wiki-backups/
```

### Restore from Backup
```bash
./scripts/restore-env.sh
```

### Manual Backup (Alternative)
```bash
# Create manual backup
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)

# Store in secure location
mkdir -p ~/secure-backups
cp .env.local ~/secure-backups/aime-wiki-env-$(date +%Y%m%d).backup
```

## 🧪 Testing Your Setup

### 1. Test Environment Loading
```bash
node -e "console.log('MAILCHIMP_API_KEY:', process.env.MAILCHIMP_API_KEY ? 'Found' : 'Missing')"
```

### 2. Test API Endpoints
```bash
# Test Mailchimp
curl "http://localhost:3000/api/content/real?type=newsletter"

# Test All Integrations
curl "http://localhost:3000/api/test/data-lake"
```

### 3. Verify Integration Status
Visit: http://localhost:3000/admin/data-lake

## ⚠️ Security Best Practices

### DO:
- ✅ Use the backup scripts regularly
- ✅ Keep backups in secure locations
- ✅ Test integrations after changes
- ✅ Use different API keys for development/production

### DON'T:
- ❌ Commit `.env.local` to git
- ❌ Share API keys in chat/email
- ❌ Use production keys in development
- ❌ Store keys in code files

## 🆘 Recovery Scenarios

### Lost .env.local File
```bash
# Restore from backup
./scripts/restore-env.sh

# Or copy from template
cp .env.example .env.local
# Then add your actual keys
```

### Corrupted Environment
```bash
# Check what's wrong
cat .env.local

# Restore from backup
./scripts/restore-env.sh

# Or rebuild from template
rm .env.local
cp .env.example .env.local
# Add your keys again
```

### API Keys Compromised
1. Revoke old keys in each service
2. Generate new keys
3. Update `.env.local`
4. Create new backup
5. Test integrations

## 📞 Support Commands

### Check Current Environment
```bash
# Show all environment variables (excluding values)
env | grep -E "MAILCHIMP|YOUTUBE|AIRTABLE|GITHUB" | sed 's/=.*/=***/'
```

### Validate Setup
```bash
# Check required files exist
ls -la .env.local .env.example .gitignore
ls -la scripts/backup-env.sh scripts/restore-env.sh
```

### Debug Integration Issues
```bash
# Check if variables are loaded
npm run dev
# Then visit: http://localhost:3000/admin/data-lake
```

---

## 🎯 Next Steps

1. **Add your actual API keys to `.env.local`** 
2. **Run `./scripts/backup-env.sh`**
3. **Test integrations work**
4. **Set up regular backups**

Your API integrations will work properly once you add the real keys!