#!/bin/bash

# Purpose: This script is designed to run the database seed script in a production environment
# while ensuring proper environment variable setup. It's specifically created to address
# NODE_ENV persistence issues during GitHub Actions deployment.
#
# Background:
# - The seed script is essential for MVP deployment as it sets up initial data
# - Previous deployment attempts failed due to NODE_ENV not being properly set/persisted
# - This script provides a reliable way to run the seed with correct environment settings
#
# Usage:
# This script is called during the GitHub Actions deployment process after the application
# files are transferred to the server. It:
# 1. Sets required environment variables explicitly
# 2. Ensures proper working directory
# 3. Runs the seed script with necessary TypeScript compiler options
# 4. Provides detailed logging for debugging deployment issues

# Ensure we're in the correct directory
cd /var/www/fnr-app

# Set environment variables
export NODE_ENV=production
export DATABASE_URL="postgresql://fnrapp:${DB_PASSWORD}@localhost:5432/fnrdb"

# Print environment for debugging
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: $DATABASE_URL"

# Run the seed script with explicit environment and compiler options
npx ts-node \
  --skipProject \
  --transpileOnly \
  --compiler-options '{"module":"CommonJS"}' \
  prisma/seed.ts

# Check exit status
if [ $? -ne 0 ]; then
  echo "❌ Database seeding failed"
  exit 1
fi

echo "✅ Database seeding completed successfully"
