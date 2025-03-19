#!/bin/bash
# Frontend Diagnostics Script for FNR Application
# This script helps diagnose issues with frontend serving in the FNR application
#
# To run this script on the server:
# ssh root@170.64.188.76 '/var/www/fnr-app/scripts/frontend-diagnostics.sh'
#

echo "=== FNR Frontend Diagnostics ==="
echo "Running diagnostics on $(date)"
echo

# Check environment
echo "=== Environment Information ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "NODE_ENV: $NODE_ENV"
echo

# Check server process
echo "=== Server Process ==="
pm2 list
echo

# Check application directory structure
echo "=== Application Directory Structure ==="
APP_DIR="/var/www/fnr-app"
if [ ! -d "$APP_DIR" ]; then
  echo "❌ Application directory not found at $APP_DIR"
  exit 1
fi

echo "Main application directory:"
ls -la $APP_DIR
echo

echo "Frontend directory:"
if [ -d "$APP_DIR/dist/fnr-app" ]; then
  ls -la $APP_DIR/dist/fnr-app
else
  echo "❌ Frontend directory not found at $APP_DIR/dist/fnr-app"
fi
echo

echo "Assets directory:"
if [ -d "$APP_DIR/dist/fnr-app/assets" ]; then
  ls -la $APP_DIR/dist/fnr-app/assets
else
  echo "❌ Assets directory not found at $APP_DIR/dist/fnr-app/assets"
fi
echo

# Check for critical files
echo "=== Critical Files Check ==="
CRITICAL_FILES=(
  "$APP_DIR/dist/main.js"
  "$APP_DIR/dist/fnr-app/index.html"
  "$APP_DIR/dist/fnr-app/assets"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -e "$file" ]; then
    echo "✅ Found: $file"
  else
    echo "❌ Missing: $file"
  fi
done
echo

# Check server logs
echo "=== Recent Server Logs ==="
if [ -f "$APP_DIR/logs/app.log" ]; then
  echo "Last 20 lines of app.log:"
  tail -n 20 $APP_DIR/logs/app.log
else
  echo "❌ App log not found at $APP_DIR/logs/app.log"
fi
echo

if [ -f "$APP_DIR/logs/error.log" ]; then
  echo "Last 20 lines of error.log:"
  tail -n 20 $APP_DIR/logs/error.log
else
  echo "❌ Error log not found at $APP_DIR/logs/error.log"
fi
echo

# Check for 404 errors
echo "=== 404 Errors Check ==="
if [ -f "$APP_DIR/logs/app.log" ]; then
  echo "Recent 404 errors:"
  grep -i "404" $APP_DIR/logs/app.log | tail -n 10
else
  echo "❌ Cannot check for 404 errors, log file not found"
fi
echo

# Test API and frontend endpoints
echo "=== Endpoint Tests ==="
echo "Testing API endpoint:"
curl -I http://localhost:3000/api 2>/dev/null || echo "❌ Cannot access API endpoint"
echo

echo "Testing frontend endpoint:"
curl -I http://localhost:3000/ 2>/dev/null || echo "❌ Cannot access frontend endpoint"
echo

echo "Testing assets endpoint:"
curl -I http://localhost:3000/assets/ 2>/dev/null || echo "❌ Cannot access assets endpoint"
echo

# Check main.js for static file serving configuration
echo "=== Static File Serving Configuration ==="
if [ -f "$APP_DIR/dist/main.js" ]; then
  echo "Checking static file serving configuration in main.js:"
  grep -A 10 "express.static" $APP_DIR/dist/main.js
else
  echo "❌ Cannot check static file serving configuration, main.js not found"
fi
echo

echo "=== Diagnostics Complete ==="
echo "If you're still experiencing issues, please check the following:"
echo "1. Ensure NODE_ENV is set to 'production'"
echo "2. Verify that the frontend build includes all necessary assets"
echo "3. Check that the server is correctly configured to serve static files"
echo "4. Ensure the assets directory exists and contains the required files"
echo "5. Restart the server using: pm2 restart all"
echo
