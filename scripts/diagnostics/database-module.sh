#!/bin/bash
# Database diagnostic module for FNR application
# This module checks database-specific deployment and runtime issues

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

# Function to check database connection
check_database_connection() {
  print_message "info" "Checking database connection..."
  
  # Check if PostgreSQL is installed
  if ! command -v psql &> /dev/null; then
    print_message "error" "PostgreSQL client not found"
    return 1
  fi
  
  # Check database password file
  if [[ -f "$APP_DIR/.db_password" ]]; then
    DB_PASSWORD=$(cat "$APP_DIR/.db_password")
    export PGPASSWORD="$DB_PASSWORD"
    
    # Test database connection
    if psql -U fnrapp -h localhost -d fnrdb -c '\conninfo' 2>/dev/null; then
      print_message "success" "Database connection successful"
      
      # Check database size
      print_message "info" "Database size:"
      psql -U fnrapp -h localhost -d fnrdb -c "SELECT pg_size_pretty(pg_database_size('fnrdb'));" 2>/dev/null
    else
      print_message "error" "Database connection failed"
    fi
    
    unset PGPASSWORD
  else
    print_message "error" "Database password file not found"
  fi
}

# Function to check migrations
check_migrations() {
  print_message "info" "Checking database migrations..."
  
  # Check if prisma directory exists
  if [[ -d "$APP_DIR/prisma" ]]; then
    print_message "success" "Prisma directory found"
    
    # List migration files
    print_message "info" "Migration files:"
    ls -la "$APP_DIR/prisma/migrations"
    
    # Check migration status using prisma
    if command -v npx &> /dev/null; then
      cd "$APP_DIR" && npx prisma migrate status || print_message "error" "Failed to check migration status"
    else
      print_message "error" "npx not found, cannot check migration status"
    fi
  else
    print_message "error" "Prisma directory not found"
  fi
}

# Function to check database performance
check_database_performance() {
  print_message "info" "Checking database performance..."
  
  if [[ -f "$APP_DIR/.db_password" ]]; then
    DB_PASSWORD=$(cat "$APP_DIR/.db_password")
    export PGPASSWORD="$DB_PASSWORD"
    
    # Check active connections
    print_message "info" "Active connections:"
    psql -U fnrapp -h localhost -d fnrdb -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null
    
    # Check table sizes
    print_message "info" "Table sizes:"
    psql -U fnrapp -h localhost -d fnrdb -c "SELECT relname as table_name, pg_size_pretty(pg_total_relation_size(relid)) as total_size FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;" 2>/dev/null
    
    # Check index usage
    print_message "info" "Index usage statistics:"
    psql -U fnrapp -h localhost -d fnrdb -c "SELECT schemaname, relname, idx_scan, seq_scan, idx_tup_read, seq_tup_read, idx_scan::float/(idx_scan + seq_scan + 1) as idx_scan_pct FROM pg_stat_user_tables ORDER BY idx_scan_pct DESC LIMIT 5;" 2>/dev/null
    
    unset PGPASSWORD
  else
    print_message "error" "Cannot check database performance, password file not found"
  fi
}

# Function to check database backups
check_database_backups() {
  print_message "info" "Checking database backups..."
  
  # Check backup directory
  local backup_dir="/var/backups/db"
  if [[ -d "$backup_dir" ]]; then
    print_message "success" "Backup directory found"
    
    # List recent backups
    print_message "info" "Recent backups:"
    ls -lth "$backup_dir" | head -n 5
    
    # Check backup file sizes
    print_message "info" "Backup sizes:"
    du -sh "$backup_dir"/* 2>/dev/null | sort -hr | head -n 5
  else
    print_message "error" "Backup directory not found"
  fi
}

# Function to check database logs
check_database_logs() {
  print_message "info" "Checking database logs..."
  
  # PostgreSQL log directory
  local pg_log_dir="/var/log/postgresql"
  
  if [[ -d "$pg_log_dir" ]]; then
    print_message "success" "PostgreSQL log directory found"
    
    # Check recent log entries
    print_message "info" "Recent PostgreSQL log entries:"
    sudo tail -n 50 "$pg_log_dir"/postgresql-*.log 2>/dev/null || print_message "error" "Cannot read PostgreSQL logs"
    
    # Check for errors in logs
    print_message "info" "Recent errors in PostgreSQL logs:"
    sudo grep -i "error\|fatal\|panic" "$pg_log_dir"/postgresql-*.log 2>/dev/null | tail -n 20 || print_message "error" "Cannot search PostgreSQL logs"
  else
    print_message "error" "PostgreSQL log directory not found"
  fi
}

# Main function to run all database checks
main() {
  print_message "info" "Starting database diagnostics..."
  echo
  
  # Run all checks
  check_database_connection
  echo
  
  check_migrations
  echo
  
  check_database_performance
  echo
  
  check_database_backups
  echo
  
  check_database_logs
  echo
  
  print_message "info" "Database diagnostics complete"
}

# Run main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main
fi
