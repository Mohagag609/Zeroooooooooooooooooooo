#!/bin/bash

# Build script for ERP System
# This script ensures Prisma generates the client before building

echo "🚀 Starting build process..."

# Set build environment variables
export NODE_ENV=production
export DATABASE_URL=${DATABASE_URL:-"postgresql://user:pass@localhost:5432/placeholder"}

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"