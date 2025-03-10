# Legacy Manual Deployment

This document describes the manual deployment process using shell scripts. While GitHub Actions is the recommended deployment method, these scripts are maintained for cases where manual deployment is needed.

## Prerequisites

1. Generate a GitHub deploy key:
   ```sh
   # Default location and name
   ssh-keygen -t ed25519 -C "deploy-key-fnr-test4" -f C:\Users\User\.ssh\fnr_deploy_key

   # Or custom location and name
   ssh-keygen -t ed25519 -C "deploy-key-fnr-test4" -f /custom/path/custom_key_name
   ```

2. Add the public key to GitHub:
   - Go to repository Settings > Deploy keys
   - Add new deploy key
   - Paste the contents of the .pub file
   - Give read-only access

## Deployment Scripts

The deployment process uses four scripts in sequence:

### 1. pre-setup.sh
Sets up SSH authentication and GitHub access on the server.

```sh
# Using default key location
./scripts/pre-setup.sh prod

# Using custom key location
./scripts/pre-setup.sh prod /custom/path

# Using custom key location and name
./scripts/pre-setup.sh prod /custom/path custom_key_name
```

### 2. server-setup.sh
Configures the server environment:
- Installs Node.js, PM2, PostgreSQL
- Creates application directory
- Clones repository
- Sets up environment variables

```sh
./scripts/server-setup.sh prod
```

### 3. quick-deploy.sh
Handles the actual deployment:
- Builds the application
- Transfers files to server
- Restarts services

```sh
./scripts/quick-deploy.sh prod
```

### 4. verify-deployment.sh
Validates the deployment:
- Checks all components
- Verifies server health
- Tests application status

```sh
./scripts/verify-deployment.sh prod
```

## Full Deployment Process

```sh
# 1. Initial setup with default SSH key
./scripts/pre-setup.sh prod

# Or with custom key
./scripts/pre-setup.sh prod /custom/path custom_key_name

# 2. Configure server
./scripts/server-setup.sh prod

# 3. Deploy application
./scripts/quick-deploy.sh prod

# 4. Verify deployment
./scripts/verify-deployment.sh prod
```

## Verification Details

The verify-deployment.sh script performs comprehensive checks:

### Server Environment
- Node.js and PM2 installation
- PostgreSQL service status
- Required directories and environment files

### Database Status
- PostgreSQL connection
- Database and user existence
- Migrations status

### Application Status
- PM2 processes
- Application logs
- HTTP endpoint response

### System Status
- Memory usage
- Disk space
- CPU load
- Active connections

Each check provides clear status indicators and suggested fixes for any issues found.

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   ```sh
   # Check SSH connection
   ssh -i ~/.ssh/fnr_deploy_key root@$DROPLET_IP
   
   # Verify key permissions
   chmod 600 ~/.ssh/fnr_deploy_key
   ```

2. **PostgreSQL Connection Issues**
   ```sh
   # Check PostgreSQL status
   systemctl status postgresql
   
   # View PostgreSQL logs
   tail -f /var/log/postgresql/postgresql-*.log
   ```

3. **Application Not Starting**
   ```sh
   # Check PM2 status
   pm2 list
   
   # View application logs
   tail -f /var/www/fnr-app/logs/error.log
   ```

### Rollback Process

If deployment fails, you can rollback to a previous version:

1. List available backups:
   ```sh
   ssh root@$DROPLET_IP "ls -l /var/backups/app"
   ```

2. Choose and restore a backup:
   ```sh
   ssh root@$DROPLET_IP
   cd /var/backups/app
   tar -xzf app_backup_TIMESTAMP.tar.gz -C /var/www/fnr-app/
   cd /var/www/fnr-app
   npm ci --only=production
   pm2 restart all
   ```

## Important Notes

- The scripts use the droplet IP from `.env.deploy` file
- Update the database password in `/var/www/fnr-app/.env` after setup
- Configure SSL certificates if needed using: `certbot --nginx`
- Keep only the last 5 backups (automatically managed by scripts)
- All scripts support both staging and production environments
