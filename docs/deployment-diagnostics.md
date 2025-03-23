# Deployment Diagnostics

This document describes the diagnostic tools available for troubleshooting deployment and runtime issues with the FNR application.

## Diagnostic Scripts Overview

The FNR application includes a comprehensive set of diagnostic scripts to help identify and troubleshoot issues across different components of the system. These scripts are organized into a modular system with one master script and specialized diagnostic modules.

### Master Script: all-diagnostics.sh

The main entry point for running diagnostics. This script can:
- Run all diagnostic checks across all components
- Run specific diagnostic modules individually
- Provide formatted, color-coded output for better readability

Usage:
```bash
# Run all diagnostics
./all-diagnostics.sh --all

# Run specific module
./all-diagnostics.sh --frontend
./all-diagnostics.sh --server
./all-diagnostics.sh --database

# Show help
./all-diagnostics.sh --help
```

### Diagnostic Modules

The system is divided into three specialized modules:

1. **Frontend Module** (`diagnostics/frontend-module.sh`)
   - Directory structure verification
   - Static file serving configuration
   - Asset availability checks
   - Frontend routing tests
   - 404 error analysis
   - Asset loading verification

2. **Server Module** (`diagnostics/server-module.sh`)
   - Node.js environment verification
   - Process management (PM2) status
   - Server configuration checks
   - API endpoint testing
   - Error log analysis
   - Memory usage monitoring
   - Session configuration verification

3. **Database Module** (`diagnostics/database-module.sh`)
   - Database connectivity tests
   - Migration status checks
   - Backup verification
   - Performance metrics
   - Connection pool status
   - Query execution times

## Script Locations

All diagnostic scripts are located in the following directory structure:
```
/var/www/fnr-app/scripts/
├── all-diagnostics.sh        # Master script
└── diagnostics/              # Modules directory
    ├── frontend-module.sh
    ├── server-module.sh
    └── database-module.sh
```

## Common Issues and Solutions

### Frontend Issues
- **Static files not serving**: Check the frontend module output for directory structure and file permissions
- **404 errors**: The frontend module will show recent 404s and suggest potential fixes
- **Asset loading failures**: Frontend diagnostics will verify all required assets exist and are accessible

### Server Issues
- **Process not running**: Server module will show PM2 status and logs
- **API endpoints unreachable**: Server diagnostics include endpoint testing
- **Memory issues**: Server module includes memory usage monitoring

### Database Issues
- **Connection failures**: Database module verifies connectivity and credentials
- **Migration problems**: Checks migration status and suggests fixes
- **Performance issues**: Monitors query times and connection pool status

## Running Diagnostics

1. SSH into your server:
   ```bash
   ssh root@your-server-ip
   ```

2. Navigate to the scripts directory:
   ```bash
   cd /var/www/fnr-app/scripts
   ```

3. Run diagnostics:
   ```bash
   # Run all checks
   ./all-diagnostics.sh --all
   
   # Or run specific modules
   ./all-diagnostics.sh --frontend
   ./all-diagnostics.sh --server
   ./all-diagnostics.sh --database
   ```

4. Review the output:
   - ✅ Green checkmarks indicate passing checks
   - ⚠️ Yellow warnings indicate potential issues
   - ❌ Red X's indicate failures that need attention

## Interpreting Results

The diagnostic output is organized into sections:

1. **Environment Information**
   - Node.js version
   - NPM version
   - Current directory
   - Environment variables

2. **Component Status**
   - Process status
   - Service health
   - Resource availability

3. **Error Analysis**
   - Recent error logs
   - Common issues
   - Suggested solutions

4. **Performance Metrics**
   - Response times
   - Resource usage
   - Database metrics

## Troubleshooting Steps

1. Run the full diagnostics first:
   ```bash
   ./all-diagnostics.sh --all
   ```

2. Note any failures or warnings

3. Run specific module diagnostics for problem areas:
   ```bash
   ./all-diagnostics.sh --frontend  # For frontend issues
   ./all-diagnostics.sh --server    # For server issues
   ./all-diagnostics.sh --database  # For database issues
   ```

4. Follow the suggested solutions in the diagnostic output

5. After making changes, run diagnostics again to verify fixes

## Extending the Diagnostics

The modular system makes it easy to add new checks:

1. Add new checks to the appropriate module
2. Update this documentation with new checks
3. Add any new command-line options to the master script

For adding new diagnostic checks, see the existing modules for examples of:
- Standard output formatting
- Error handling
- Status checks
- Log analysis
