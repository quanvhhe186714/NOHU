#!/bin/bash
# Script để build frontend

echo "🔨 Building frontend..."
cd hacknohu
npm install
npm run build
echo "✅ Frontend built successfully!"
echo "📦 Output: hacknohu/dist/"

