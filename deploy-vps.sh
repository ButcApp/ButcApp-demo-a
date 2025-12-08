#!/bin/bash

<<<<<<< HEAD
# VPS Deployment Script for ButcApp (pnpm version)
=======
# VPS Deployment Script for ButcApp
>>>>>>> e24e41a09e2ad6015452c7d5548a957a3c4fec4d

echo "🚀 Starting VPS deployment..."

# Set variables
VPS_DOMAIN="your-vps-domain.com"
PROJECT_DIR="/path/to/your/project/on/vps"

# Update .env file for VPS
echo "📝 Updating environment variables..."
cat > $PROJECT_DIR/.env << EOF
DATABASE_URL=file:$PROJECT_DIR/db/custom.db
JWT_SECRET=butcapp-secret-key-change-in-production-2024
NEXT_PUBLIC_API_URL=https://$VPS_DOMAIN
EOF

# Install dependencies
echo "📦 Installing dependencies..."
cd $PROJECT_DIR
<<<<<<< HEAD
pnpm install

# Build the project
echo "🔨 Building the project..."
pnpm build

# Setup database
echo "🗄️ Setting up database..."
pnpm db:push

# Start the application
echo "🚀 Starting the application..."
pnpm start
=======
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Setup database
echo "🗄️ Setting up database..."
npm run db:push

# Start the application
echo "🚀 Starting the application..."
npm start
>>>>>>> e24e41a09e2ad6015452c7d5548a957a3c4fec4d

echo "✅ Deployment completed!"
echo "🌐 Your app is available at: https://$VPS_DOMAIN"
echo "🔧 Admin panel: https://$VPS_DOMAIN/0gv6O9Gizwrd1FCb40H22JE8y9aIgK/login"