#!/bin/bash
# Script để deploy backend lên VPS

echo "🚀 Deploying backend..."

# Kiểm tra .env
if [ ! -f backend/.env ]; then
    echo "❌ Error: backend/.env not found!"
    echo "Please create backend/.env file with required variables"
    exit 1
fi

cd backend

# Cài đặt dependencies
echo "📦 Installing dependencies..."
npm install

# Seed database (optional)
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed
fi

# Start với PM2
echo "▶️  Starting backend with PM2..."
pm2 start src/index.js --name "hacknohu-backend" || pm2 restart hacknohu-backend
pm2 save

echo "✅ Backend deployed successfully!"

