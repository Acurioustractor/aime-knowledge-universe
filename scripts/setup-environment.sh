#!/bin/bash

# AIME Wiki Environment Setup Script
echo "🚀 Setting up AIME Wiki Environment..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📄 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
else
    echo "⚠️ .env.local already exists, skipping copy"
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p data
    echo "✅ Data directory created"
fi

# Initialize SQLite database
if [ ! -f "data/aime-data-lake.db" ]; then
    echo "🗄️ Initializing SQLite database..."
    touch data/aime-data-lake.db
    echo "✅ Database file created"
fi

echo ""
echo "🔧 NEXT STEPS:"
echo "1. Edit .env.local with your actual API keys:"
echo "   - YOUTUBE_API_KEY (get from Google Cloud Console)"
echo "   - AIRTABLE_API_KEY (get from Airtable account settings)"
echo "   - GITHUB_API_TOKEN (get from GitHub settings > Developer settings)"
echo "   - MAILCHIMP_API_KEY (get from Mailchimp account)"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "🌊 Your AIME wiki will be ready at http://localhost:3000" 