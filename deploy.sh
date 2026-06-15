#!/bin/bash

# Deployment script for backend
set -e

echo "📦 Building backend..."
npm run build

echo "✅ Backend build complete"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env and update with production values"
echo "2. Run: npm install -g pm2"
echo "3. Run: pm2 start ecosystem.config.js"
echo ""
echo "Or use Docker:"
echo "1. Copy .env.example to .env"
echo "2. Run: docker-compose up -d"
echo ""
echo "✨ Backend is ready for deployment!"
