#!/bin/bash
# Frontend verification script for FNR application

# Function to verify frontend files
verify_frontend() {
  local dir=$1
  echo "🔍 Verifying frontend files in $dir..."
  
  # Check index.html
  if [ ! -f "$dir/index.html" ]; then
    echo "❌ index.html missing"
    return 1
  fi
  
  # Check assets directory
  if [ ! -d "$dir/assets" ]; then
    echo "❌ Assets directory missing"
    return 1
  fi
  
  # Check for critical asset types
  local missing_assets=0
  for ext in js css; do
    if [ $(find "$dir/assets" -name "*.$ext" | wc -l) -eq 0 ]; then
      echo "❌ No .$ext files found in assets directory"
      missing_assets=1
    fi
  done
  
  # Check favicon
  if [ ! -f "$dir/favicon.ico" ]; then
    echo "❌ favicon.ico missing"
    return 1
  fi
  
  if [ $missing_assets -eq 1 ]; then
    return 1
  fi
  
  echo "✅ Frontend files verified successfully"
  return 0
}

# If script is run directly, verify the directory passed as argument
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  if [ -z "$1" ]; then
    echo "❌ Usage: $0 <directory>"
    exit 1
  fi
  verify_frontend "$1"
fi
