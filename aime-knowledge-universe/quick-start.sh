#\!/bin/bash
echo "🚀 Starting AIME Knowledge Universe..."
echo "1. Installing dependencies..."
npm install --legacy-peer-deps
echo "2. Setting up environment..."
if [ \! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "⚠️  Please configure .env.local with your API keys"
fi
echo "3. Starting development server..."
npm run dev
EOF < /dev/null