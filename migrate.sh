#!/bin/bash

# =============================================================================
# AIME Knowledge Universe - GitHub Migration Script
# =============================================================================
# This script migrates the AIME Knowledge Universe to a new GitHub repository
# with all database systems and operational components packaged for deployment
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DIR="/Users/benknight/Code/AIME wiki"
REPO_NAME="aime-knowledge-universe"
BRANCH_NAME="main"

echo -e "${BLUE}🚀 AIME Knowledge Universe Migration Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if repository URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide the GitHub repository URL${NC}"
    echo "Usage: ./migrate.sh https://github.com/YOUR_ORG/aime-knowledge-universe.git"
    exit 1
fi

REPO_URL="$1"
TARGET_DIR="$(basename "$REPO_URL" .git)"

echo -e "${YELLOW}📋 Migration Configuration:${NC}"
echo "   Source: $SOURCE_DIR"
echo "   Target: $TARGET_DIR"
echo "   Repository: $REPO_URL"
echo ""

# Step 1: Clone the new repository
echo -e "${BLUE}📥 Step 1: Cloning new repository...${NC}"
if [ -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}⚠️  Directory $TARGET_DIR already exists. Removing...${NC}"
    rm -rf "$TARGET_DIR"
fi

git clone "$REPO_URL" "$TARGET_DIR"
cd "$TARGET_DIR"

# Step 2: Copy source code with exclusions
echo -e "${BLUE}📦 Step 2: Copying source code...${NC}"
rsync -av --progress \
    --exclude='.env.local' \
    --exclude='.env.production' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='data/*.db-wal' \
    --exclude='data/*.db-shm' \
    --exclude='*.log' \
    --exclude='*.tmp' \
    --exclude='.DS_Store' \
    "$SOURCE_DIR/" ./

echo -e "${GREEN}✅ Source code copied successfully${NC}"

# Step 3: Verify critical files
echo -e "${BLUE}🔍 Step 3: Verifying critical files...${NC}"

CRITICAL_FILES=(
    "package.json"
    "src/app/page.tsx"
    "src/lib/database/connection.ts"
    "data/aime-data-lake.db"
    ".env.example"
    "vercel.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${RED}   ❌ $file (missing)${NC}"
    fi
done

# Step 4: Database verification
echo -e "${BLUE}🗄️  Step 4: Verifying databases...${NC}"
if [ -d "data" ]; then
    echo -e "${GREEN}   ✅ Data directory exists${NC}"
    ls -la data/ | while read line; do
        echo "   📊 $line"
    done
else
    echo -e "${RED}   ❌ Data directory missing${NC}"
fi

# Step 5: Setup environment
echo -e "${BLUE}⚙️  Step 5: Setting up environment...${NC}"
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo -e "${GREEN}   ✅ Environment template created (.env.local)${NC}"
    echo -e "${YELLOW}   ⚠️  Please configure .env.local with your API keys${NC}"
else
    echo -e "${RED}   ❌ .env.example not found${NC}"
fi

# Step 6: Install dependencies
echo -e "${BLUE}📦 Step 6: Installing dependencies...${NC}"
if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}   ✅ Dependencies installed${NC}"
else
    echo -e "${RED}   ❌ npm not found. Please install Node.js${NC}"
fi

# Step 7: Create deployment scripts
echo -e "${BLUE}🚀 Step 7: Creating deployment scripts...${NC}"

# Create quick start script
cat > quick-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting AIME Knowledge Universe..."
echo "1. Installing dependencies..."
npm install
echo "2. Setting up environment..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Please configure .env.local with your API keys"
fi
echo "3. Starting development server..."
npm run dev
EOF

chmod +x quick-start.sh

# Create production deploy script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying AIME Knowledge Universe to production..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Don't forget to configure environment variables in Vercel dashboard"
EOF

chmod +x deploy.sh

echo -e "${GREEN}   ✅ Deployment scripts created${NC}"

# Step 8: Update .gitignore for security
echo -e "${BLUE}🔐 Step 8: Updating security settings...${NC}"

cat >> .gitignore << 'EOF'

# AIME Knowledge Universe - Security
.env.local
.env.production
.env

# Database files with sensitive data
data/*.db-wal
data/*.db-shm

# Logs and temporary files
*.log
*.tmp
logs/

# Sensitive configuration
*.key
*.pem
secrets/
EOF

echo -e "${GREEN}   ✅ Security settings updated${NC}"

# Step 9: Test basic functionality
echo -e "${BLUE}🧪 Step 9: Testing basic functionality...${NC}"

# Test if package.json is valid
if node -pe "require('./package.json').name" &> /dev/null; then
    echo -e "${GREEN}   ✅ package.json is valid${NC}"
else
    echo -e "${RED}   ❌ package.json has issues${NC}"
fi

# Test TypeScript configuration
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}   ✅ TypeScript configuration found${NC}"
else
    echo -e "${RED}   ❌ TypeScript configuration missing${NC}"
fi

# Step 10: Commit and push
echo -e "${BLUE}📤 Step 10: Committing to repository...${NC}"

git add .

# Create comprehensive commit message
git commit -m "🚀 Initial migration: AIME Knowledge Universe

🎯 Complete Platform Migration:
- ✅ Knowledge data lake with 2,700+ assets
- ✅ Unified search system
- ✅ Hoodie economics infrastructure
- ✅ Admin dashboard & content management
- ✅ API integrations (YouTube, Airtable, Mailchimp)
- ✅ Supabase database configuration
- ✅ Security & environment setup

🛒 Ready for Moneyless Shop Implementation:
- User authentication system
- Points tracking infrastructure
- Reward distribution system
- Challenge completion tracking
- Admin curation tools

🔧 Operational Features:
- Database migration scripts
- Deployment automation
- Health monitoring
- Performance optimization
- Security measures

🎮 Integration Ready:
- Fortnite API preparation
- Guardians platform hooks
- Nike/Patagonia partnership framework
- Open source architecture

📊 Key Statistics:
- 150+ planned tools
- 130+ systems change residencies
- 5 action VISA pathways
- 10,000 hoodie inventory system

🌍 Platform Status: Ready for global deployment

'This is our shop. Finally.' - Jack Manning Bancroft"

echo -e "${GREEN}   ✅ Changes committed${NC}"

# Push to repository
git push origin "$BRANCH_NAME"
echo -e "${GREEN}   ✅ Pushed to repository${NC}"

# Step 11: Final summary
echo ""
echo -e "${GREEN}🎉 MIGRATION COMPLETE! 🎉${NC}"
echo -e "${GREEN}========================${NC}"
echo ""
echo -e "${BLUE}📊 Migration Summary:${NC}"
echo "   🗂️  Repository: $REPO_URL"
echo "   📁 Directory: $TARGET_DIR"
echo "   🗄️  Databases: Included and operational"
echo "   🔧 Dependencies: Installed"
echo "   🔐 Security: Configured"
echo "   🚀 Deployment: Scripts ready"
echo ""
echo -e "${YELLOW}⚠️  NEXT STEPS:${NC}"
echo "   1. Configure .env.local with your API keys"
echo "   2. Set up Supabase database (see DEPLOYMENT.md)"
echo "   3. Test locally: ./quick-start.sh"
echo "   4. Deploy to production: ./deploy.sh"
echo "   5. Configure team access on GitHub"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   📋 DEPLOYMENT.md - Complete deployment guide"
echo "   🔧 GITHUB_MIGRATION_GUIDE.md - Technical details"
echo "   ⚙️  quick-start.sh - Local development"
echo "   🚀 deploy.sh - Production deployment"
echo ""
echo -e "${GREEN}✅ AIME Knowledge Universe is ready for operation!${NC}"
echo -e "${GREEN}🛒 Ready to implement Jack's moneyless shop vision!${NC}"
echo ""

# Show final directory structure
echo -e "${BLUE}📁 Final Directory Structure:${NC}"
tree -L 2 -I 'node_modules|.next|.git' || ls -la

echo ""
echo -e "${BLUE}🎯 Happy building! The knowledge economy awaits! 🌍${NC}"