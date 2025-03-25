#!/bin/bash
# Master diagnostic script for FNR application
# This script provides a unified interface for running various diagnostic checks
# Usage:
# Run all diagnostics
# ssh root@170.64.155.210 'cd /var/www/fnr-app/scripts && bash all-diagnostics.sh --all'

# Text formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
INFO="ℹ️"
SUCCESS="✅"
WARNING="⚠️"
ERROR="❌"

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIAGNOSTICS_DIR="$SCRIPT_DIR/diagnostics"

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

# Function to check if diagnostic modules exist
check_modules() {
  local missing_modules=0
  
  if [[ ! -f "$DIAGNOSTICS_DIR/frontend-module.sh" ]]; then
    print_message "error" "Frontend module not found at: $DIAGNOSTICS_DIR/frontend-module.sh"
    missing_modules=1
  fi
  
  if [[ ! -f "$DIAGNOSTICS_DIR/server-module.sh" ]]; then
    print_message "error" "Server module not found at: $DIAGNOSTICS_DIR/server-module.sh"
    missing_modules=1
  fi
  
  if [[ ! -f "$DIAGNOSTICS_DIR/database-module.sh" ]]; then
    print_message "error" "Database module not found at: $DIAGNOSTICS_DIR/database-module.sh"
    missing_modules=1
  fi
  
  return $missing_modules
}

# Function to show script usage
show_usage() {
  echo "Usage: ./all-diagnostics.sh [options]"
  echo
  echo "Options:"
  echo "  --all       Run all diagnostics (default)"
  echo "  --frontend  Run only frontend diagnostics"
  echo "  --server    Run only server diagnostics"
  echo "  --database  Run only database diagnostics"
  echo "  --help      Show this help message"
  echo
  echo "Examples:"
  echo "  ./all-diagnostics.sh --all"
  echo "  ./all-diagnostics.sh --frontend"
  echo "  ./all-diagnostics.sh --server"
  echo "  ./all-diagnostics.sh --database"
}

# Function to run a specific diagnostic module
run_module() {
  local module=$1
  local module_path="$DIAGNOSTICS_DIR/${module}-module.sh"
  
  if [[ -f "$module_path" ]]; then
    print_message "info" "Running ${module} diagnostics..."
    echo "=================================================="
    bash "$module_path"
    echo "=================================================="
    echo
  else
    print_message "error" "Module not found: $module_path"
    return 1
  fi
}

# Create diagnostics directory if it doesn't exist
mkdir -p "$DIAGNOSTICS_DIR"

# Main script logic
main() {
  # Print header
  echo "=================================================="
  echo "           FNR Application Diagnostics"
  echo "=================================================="
  echo "Running diagnostics on $(date)"
  echo "Current directory: $(pwd)"
  echo

  # Check if modules exist
  check_modules || {
    print_message "error" "Some diagnostic modules are missing. Please ensure all modules are properly installed."
    exit 1
  }

  # Process command line arguments
  case "$1" in
    --help)
      show_usage
      exit 0
      ;;
    --frontend)
      run_module "frontend"
      ;;
    --server)
      run_module "server"
      ;;
    --database)
      run_module "database"
      ;;
    --all|"")
      print_message "info" "Running all diagnostics..."
      echo
      run_module "frontend"
      run_module "server"
      run_module "database"
      ;;
    *)
      print_message "error" "Unknown option: $1"
      echo
      show_usage
      exit 1
      ;;
  esac

  # Print footer
  echo "=================================================="
  echo "           Diagnostics Complete"
  echo "=================================================="
}

# Run main function
main "$@"
