#\!/bin/bash
echo "🚀 Deploying AIME Knowledge Universe to production..."

# Check if vercel is installed
if \! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete\!"
echo "🔗 Don't forget to configure environment variables in Vercel dashboard"
EOF < /dev/null