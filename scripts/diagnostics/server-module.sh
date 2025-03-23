#!/bin/bash
# Server diagnostic module for FNR application
# This module checks server-specific deployment and runtime issues

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

# Function to check environment
check_environment() {
  print_message "info" "Checking environment..."
  
  # Check Node.js version
  if command -v node &> /dev/null; then
    print_message "success" "Node.js version: $(node -v)"
  else
    print_message "error" "Node.js not found"
  fi
  
  # Check npm version
  if command -v npm &> /dev/null; then
    print_message "success" "NPM version: $(npm -v)"
  else
    print_message "error" "NPM not found"
  fi
  
  # Check NODE_ENV
  if [[ -n "$NODE_ENV" ]]; then
    print_message "success" "NODE_ENV: $NODE_ENV"
  else
    print_message "warning" "NODE_ENV not set"
  fi
  
  # Check environment variables
  cd "$APP_DIR" && node -e "console.log('NODE_ENV:', process.env.NODE_ENV)" || print_message "error" "Failed to check Node.js environment"
}

# Function to check server process
check_server_process() {
  print_message "info" "Checking server process..."
  
  # Check if PM2 is installed
  if command -v pm2 &> /dev/null; then
    print_message "success" "PM2 is installed"
    
    # Show PM2 process list
    print_message "info" "PM2 process list:"
    pm2 list
    
    # Show PM2 logs
    print_message "info" "Recent PM2 logs:"
    pm2 logs --lines 20 --nostream
  else
    print_message "error" "PM2 is not installed"
  fi
}

# Function to check API endpoints
check_api_endpoints() {
  print_message "info" "Checking API endpoints..."
  
  # Test main API endpoint
  if curl -I http://localhost:3000/api 2>/dev/null | grep -q "200 OK"; then
    print_message "success" "Main API endpoint is accessible"
  else
    print_message "error" "Cannot access main API endpoint"
  fi
  
  # Test specific API endpoints
  local endpoints=(
    "/api/auth"
    "/api/claims"
    "/api/users"
    "/api/staff"
    "/api/suppliers"
  )
  
  for endpoint in "${endpoints[@]}"; do
    if curl -I "http://localhost:3000$endpoint" 2>/dev/null | grep -q "200\|401\|403"; then
      print_message "success" "Endpoint $endpoint is responding"
    else
      print_message "error" "Cannot access endpoint $endpoint"
    fi
  done
}

# Function to check memory usage
check_memory_usage() {
  print_message "info" "Checking memory usage..."
  
  # Get memory usage from PM2
  if command -v pm2 &> /dev/null; then
    print_message "info" "PM2 process memory usage:"
    pm2 prettylist | grep -A 5 "memory"
  fi
  
  # Get system memory info
  print_message "info" "System memory information:"
  free -h
}

# Function to check server configuration
check_server_config() {
  print_message "info" "Checking server configuration..."
  
  # Check if main.js exists and examine static file serving configuration
  if [[ -f "$APP_DIR/dist/main.js" ]]; then
    print_message "info" "Static file serving configuration in main.js:"
    grep -A 10 "express.static" "$APP_DIR/dist/main.js"
  else
    print_message "error" "main.js not found"
  fi
  
  # Check session configuration
  if grep -q "session" "$APP_DIR/dist/main.js"; then
    print_message "success" "Session configuration found"
  else
    print_message "warning" "Session configuration not found"
  fi
}

# Function to check server logs
check_server_logs() {
  print_message "info" "Checking server logs..."
  
  # Check error log
  if [[ -f "$APP_DIR/logs/error.log" ]]; then
    print_message "info" "Recent errors from error.log:"
    tail -n 50 "$APP_DIR/logs/error.log"
  else
    print_message "error" "Error log not found"
  fi
  
  # Check for specific error patterns
  if [[ -f "$APP_DIR/logs/app.log" ]]; then
    print_message "info" "Checking for common error patterns..."
    grep -i "error\|exception\|failed" "$APP_DIR/logs/app.log" | tail -n 20
  fi
}

# Main function to run all server checks
main() {
  print_message "info" "Starting server diagnostics..."
  echo
  
  # Run all checks
  check_environment
  echo
  
  check_server_process
  echo
  
  check_api_endpoints
  echo
  
  check_memory_usage
  echo
  
  check_server_config
  echo
  
  check_server_logs
  echo
  
  print_message "info" "Server diagnostics complete"
}

# Run main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main
fi
