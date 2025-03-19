# Frontend Deployment Guide

This document provides guidance on deploying and troubleshooting the frontend application in the FNR monorepo.

## Overview

The FNR application is a monorepo with a React frontend (fnr-app) and Express backend (fnr-server). The frontend is built using Vite and served by the Express server in production mode.

## Deployment Process

The deployment process is handled by GitHub Actions workflows defined in `.github/workflows/deploy.yml`. The workflow:

1. Builds both the server and frontend applications
2. Verifies the build outputs, including checking for the presence of assets
3. Packages the build outputs for deployment
4. Deploys the package to the server
5. Verifies the deployment

## Recent Improvements

We've made several improvements to the deployment process to ensure that frontend assets are correctly handled:

### 1. Vite Configuration Updates

The Vite configuration has been updated to:
- Use relative paths for assets with `base: './'`
- Generate a manifest file for better asset tracking
- Ensure consistent naming for assets
- Configure proper chunking for vendor libraries

### 2. Server Configuration Updates

The Express server configuration has been updated to:
- Add better error handling for missing frontend files
- Add a dedicated route for serving assets with caching
- Add logging to help diagnose static file serving issues
- Verify the existence of frontend directories and files at startup

### 3. GitHub Actions Workflow Updates

The GitHub Actions workflow has been updated to:
- Verify the presence of frontend assets during the build process
- Create the assets directory if it doesn't exist to prevent issues
- Add more detailed logging of the deployment package structure

## Troubleshooting

If you encounter issues with the frontend not being served correctly, follow these steps:

### 1. Run the Diagnostic Script

We've created a diagnostic script that can help identify issues with the frontend deployment. To use it:

1. SSH into the server
2. Copy the script from `docs/frontend-diagnostics.sh` to the server or download it directly
3. Make it executable: `chmod +x frontend-diagnostics.sh`
4. Run the script: `./frontend-diagnostics.sh`

The script will check:
- The server environment
- The application directory structure
- The presence of critical files
- Recent server logs
- 404 errors
- API and frontend endpoints
- Static file serving configuration

### 2. Check Common Issues

Common issues include:

- **Missing Assets Directory**: The assets directory should be at `/var/www/fnr-app/dist/fnr-app/assets`. If it's missing, the deployment process should create it, but you can create it manually if needed.

- **Incorrect Static File Serving Configuration**: The server should be configured to serve static files from `/var/www/fnr-app/dist/fnr-app` and assets from `/var/www/fnr-app/dist/fnr-app/assets`.

- **NODE_ENV Not Set to Production**: Ensure that the NODE_ENV environment variable is set to 'production' when running the server.

- **Missing or Incorrect Asset Paths**: Check that the assets are being generated with the correct paths. The Vite configuration should be using relative paths with `base: './'`.

### 3. Manual Fixes

If you need to manually fix issues:

- **Restart the Server**: `pm2 restart all`

- **Rebuild the Frontend**: If you need to rebuild the frontend, you can run:
  ```bash
  cd /var/www/fnr-app
  npx nx build fnr-app
  ```

- **Check Server Logs**: `tail -f /var/www/fnr-app/logs/app.log`

## Verification

After making changes, verify that the frontend is being served correctly:

1. Check that the API endpoint is accessible: `curl -I http://your-server-ip:3000/api`
2. Check that the frontend is accessible: `curl -I http://your-server-ip:3000/`
3. Check that assets are accessible: `curl -I http://your-server-ip:3000/assets/`

## Further Assistance

If you continue to experience issues, please:

1. Run the diagnostic script and review the output
2. Check the server logs for any errors
3. Verify that the deployment process completed successfully
4. Ensure that all the required files are present on the server

If the issue persists, please contact the development team for further assistance.
