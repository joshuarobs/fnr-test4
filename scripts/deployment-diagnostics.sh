#!/bin/bash
# Comprehensive diagnostic script for FNR application deployment
# This script checks various aspects of the deployment and provides detailed feedback

# Text formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
INFO="ℹ️"
SUCCESS="✅"
WARNING="⚠️"
ERROR="❌"

# Function to print formatted messages
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

# Function to check if a command exists
check_command() {
  if ! command -v $1 &> /dev/null; then
    print_message "error" "Required command '$1' not found"
    return 1
  fi
  return 0
}

# Function to check if a port is in use
check_port() {
  local port=$1
  if lsof -i :$port > /dev/null; then
    print_message "info" "Port $port is in use"
    lsof -i :$port
    return 0
  else
    print_message "warning" "Port $port is not in use"
    return 1
  fi
}

# Function to check file permissions
check_permissions() {
  local path=$1
  local expected_perms=$2
  local actual_perms=$(stat -f "%Lp" "$path")
  if [ "$actual_perms" != "$expected_perms" ]; then
    print_message "warning" "Incorrect permissions on $path (expected: $expected_perms, actual: $actual_perms)"
    return 1
  fi
  return 0
}

# Function to check log files for errors
check_logs_for_errors() {
  local log_file=$1
  local hours=${2:-1}
  if [ -f "$log_file" ]; then
    print_message "info" "Checking last $hours hour(s) of logs in $log_file"
    local errors=$(find "$log_file" -mmin -$((hours * 60)) -exec grep -i "error\|exception\|fail" {} \;)
    if [ ! -z "$errors" ]; then
      print_message "error" "Found errors in $log_file:"
      echo "$errors"
      return 1
    fi
    print_message "success" "No errors found in $log_file"
  else
    print_message "warning" "Log file $log_file not found"
    return 1
  fi
  return 0
}

# Main diagnostic checks
main() {
  print_message "info" "Starting FNR deployment diagnostics..."
  echo "Time: $(date)"
  echo "Environment: $NODE_ENV"

  # Check required commands
  print_message "info" "Checking required commands..."
  required_commands=("node" "npm" "pm2" "psql")
  for cmd in "${required_commands[@]}"; do
    if check_command $cmd; then
      print_message "success" "Found command: $cmd"
    fi
  done

  # Check application directory
  APP_DIR="/var/www/fnr-app"
  print_message "info" "Checking application directory structure..."
  
  if [ ! -d "$APP_DIR" ]; then
    print_message "error" "Application directory not found at $APP_DIR"
    exit 1
  fi

  # Check critical files and directories
  critical_paths=(
    "$APP_DIR/dist/main.js"
    "$APP_DIR/dist/fnr-app/index.html"
    "$APP_DIR/dist/fnr-app/assets"
    "$APP_DIR/prisma/schema.prisma"
    "$APP_DIR/logs"
  )

  for path in "${critical_paths[@]}"; do
    if [ -e "$path" ]; then
      print_message "success" "Found: $path"
    else
      print_message "error" "Missing: $path"
    fi
  done

  # Check server process
  print_message "info" "Checking server process..."
  if pm2 list | grep -q "fnr-server"; then
    print_message "success" "Server process is running"
    pm2 show fnr-server
  else
    print_message "error" "Server process not found"
  fi

  # Check port 3000
  print_message "info" "Checking server port..."
  check_port 3000

  # Check logs
  print_message "info" "Checking application logs..."
  check_logs_for_errors "$APP_DIR/logs/app.log"
  check_logs_for_errors "$APP_DIR/logs/error.log"

  # Check frontend serving
  print_message "info" "Checking frontend serving..."
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
  if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
    print_message "success" "Frontend is being served correctly"
  else
    print_message "error" "Frontend serving check failed (HTTP $response)"
  fi

  # Check API endpoint
  print_message "info" "Checking API endpoint..."
  api_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api)
  if [ "$api_response" = "200" ]; then
    print_message "success" "API endpoint is accessible"
  else
    print_message "error" "API endpoint check failed (HTTP $api_response)"
  fi

  # Check database connection
  print_message "info" "Checking database connection..."
  if [ -f "$APP_DIR/.db_password" ]; then
    DB_PASSWORD=$(cat "$APP_DIR/.db_password")
    export PGPASSWORD="$DB_PASSWORD"
    if psql -U fnrapp -h localhost -d fnrdb -c '\q' 2>/dev/null; then
      print_message "success" "Database connection successful"
    else
      print_message "error" "Database connection failed"
    fi
    unset PGPASSWORD
  else
    print_message "error" "Database password file not found"
  fi

  # Final summary
  echo
  print_message "info" "Diagnostic check completed"
  echo "For more detailed information, please check:"
  echo "- Application logs: $APP_DIR/logs/"
  echo "- PM2 logs: pm2 logs fnr-server"
  echo "- System logs: journalctl -u fnr-server"
}

# Run main function
main
