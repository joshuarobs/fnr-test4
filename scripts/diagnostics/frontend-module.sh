#!/bin/bash
# Frontend diagnostic module for FNR application
# This module checks frontend-specific deployment and serving issues

# Text formatting (if not already defined)
if [[ -z "$RED" ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  NC='\033[0m'
  INFO="ℹ️"
  SUCCESS="✅"
  WARNING="⚠️"
  ERROR="❌"
fi

# Print formatted messages (if not already defined)
if ! command -v print_message &> /dev/null; then
  print_message() {
    local type=$1
    local message=$2
    case $type in
      "info") echo -e "${INFO} ${message}" ;;
      "success") echo -e "${GREEN}${SUCCESS} ${message}${NC}" ;;
      "warning") echo -e "${YELLOW}${WARNING} ${message}${NC}" ;;
      "error") echo -e "${RED}${ERROR} ${message}${NC}" ;;
    esac
  }
fi

# Application directory
APP_DIR="/var/www/fnr-app"
FRONTEND_DIR="$APP_DIR/dist/fnr-app"

# Function to check directory structure
check_directory_structure() {
  print_message "info" "Checking directory structure..."
  
  # Check main directories
  if [[ ! -d "$APP_DIR" ]]; then
    print_message "error" "Application directory not found at: $APP_DIR"
    return 1
  fi
  
  if [[ ! -d "$FRONTEND_DIR" ]]; then
    print_message "error" "Frontend directory not found at: $FRONTEND_DIR"
    return 1
  fi
  
  # List JavaScript files
  print_message "info" "JavaScript files:"
  find "$APP_DIR/dist" -type f -name "*.js" | sort
  
  # List HTML files
  print_message "info" "HTML files:"
  find "$APP_DIR/dist" -type f -name "*.html" | sort
  
  # Show directory contents
  print_message "info" "Main application directory contents:"
  ls -la "$APP_DIR/dist/"
  
  print_message "info" "Frontend directory contents:"
  ls -la "$FRONTEND_DIR/"
  
  # Check assets directory
  if [[ -d "$FRONTEND_DIR/assets" ]]; then
    print_message "success" "Assets directory found"
    print_message "info" "Assets directory contents:"
    ls -la "$FRONTEND_DIR/assets"
  else
    print_message "error" "Assets directory not found"
  fi
}

# Function to check critical files
check_critical_files() {
  print_message "info" "Checking critical files..."
  
  local critical_files=(
    "$APP_DIR/dist/main.js"
    "$FRONTEND_DIR/index.html"
    "$FRONTEND_DIR/assets"
  )
  
  local all_found=true
  
  for file in "${critical_files[@]}"; do
    if [[ -e "$file" ]]; then
      print_message "success" "Found: $file"
      
      # For index.html, check its content
      if [[ "$file" == "$FRONTEND_DIR/index.html" ]]; then
        print_message "info" "Checking index.html content..."
        cat "$file"
      fi
    else
      print_message "error" "Missing: $file"
      all_found=false
    fi
  done
  
  $all_found
}

# Function to check static file serving
check_static_serving() {
  print_message "info" "Checking static file serving..."
  
  # Check if the server can access frontend files
  if node -e "const fs=require('fs'); const path=require('path'); console.log('Frontend index exists:', fs.existsSync(path.join('$APP_DIR', 'dist/fnr-app/index.html'))); console.log('Server main exists:', fs.existsSync(path.join('$APP_DIR', 'dist/main.js')));" 2>/dev/null; then
    print_message "success" "Server can access frontend files"
  else
    print_message "error" "Server cannot access frontend files"
  fi
  
  # Test frontend endpoints
  print_message "info" "Testing frontend endpoints..."
  
  # Root endpoint
  if curl -I http://localhost:3000/ 2>/dev/null | grep -q "200 OK"; then
    print_message "success" "Frontend root endpoint is accessible"
  else
    print_message "error" "Cannot access frontend root endpoint"
  fi
  
  # Assets endpoint
  if curl -I http://localhost:3000/assets/ 2>/dev/null | grep -q "200 OK"; then
    print_message "success" "Assets endpoint is accessible"
  else
    print_message "error" "Cannot access assets endpoint"
  fi
}

# Function to check for 404 errors
check_404_errors() {
  print_message "info" "Checking for 404 errors..."
  
  if [[ -f "$APP_DIR/logs/app.log" ]]; then
    local recent_404s=$(grep -i "404" "$APP_DIR/logs/app.log" | tail -n 10)
    if [[ -n "$recent_404s" ]]; then
      print_message "warning" "Recent 404 errors found:"
      echo "$recent_404s"
    else
      print_message "success" "No recent 404 errors found"
    fi
  else
    print_message "error" "Cannot check for 404 errors, log file not found"
  fi
}

# Function to check server logs
check_logs() {
  print_message "info" "Checking server logs..."
  
  # Check app.log
  if [[ -f "$APP_DIR/logs/app.log" ]]; then
    print_message "info" "Last 20 lines of app.log:"
    tail -n 20 "$APP_DIR/logs/app.log"
  else
    print_message "error" "App log not found"
  fi
  
  # Check error.log
  if [[ -f "$APP_DIR/logs/error.log" ]]; then
    print_message "info" "Last 20 lines of error.log:"
    tail -n 20 "$APP_DIR/logs/error.log"
  else
    print_message "error" "Error log not found"
  fi
}

# Main function to run all frontend checks
main() {
  print_message "info" "Starting frontend diagnostics..."
  echo
  
  # Run all checks
  check_directory_structure
  echo
  
  check_critical_files
  echo
  
  check_static_serving
  echo
  
  check_404_errors
  echo
  
  check_logs
  echo
  
  print_message "info" "Frontend diagnostics complete"
}

# Run main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main
fi
