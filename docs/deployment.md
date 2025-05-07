# Deployment Guide

## GitHub Actions Workflows

The repository uses two GitHub Actions workflows for managing deployments:

1. **Server Setup** (`setup.yml`):
   - One-time server provisioning workflow
   - Manually triggered for initial setup
   - Installs and configures all required dependencies
   - Sets up PostgreSQL, Node.js, PM2, and application directory structure

2. **Continuous Deployment** (`deploy.yml`):
   - Automated deployment workflow
   - Triggers on push to protected branches:
     - `main` branch → Production environment
     - `staging` branch → Staging environment
   - Handles building, testing, and deploying application updates

### Required GitHub Secrets

See [GitHub Secrets Setup Guide](./github-secrets.md) for detailed instructions on setting up all required secrets.

The following secrets must be configured before deployment:
- `DO_SSH_KEY`: SSH key for Digital Ocean access
- `DROPLET_IP`: Digital Ocean droplet IP
- `DATABASE_PASSWORD`: PostgreSQL user password
- `DATABASE_URL`: Database connection string
- `SESSION_SECRET`: Session encryption key
- `CLIENT_URL`: Frontend application URL

### Initial Setup Process

1. **Provision Digital Ocean Droplet**:
   - Create a new droplet in your Digital Ocean account
   - Choose Ubuntu 22.04 LTS
   - Select your preferred size (minimum 2GB RAM recommended)
   - Add your SSH public key during creation
   - Note the droplet's IP address

2. **Configure GitHub Repository**:
   - Follow the [GitHub Secrets Setup Guide](./github-secrets.md)
   - Ensure all required secrets are properly configured
   - Verify SSH key permissions on the droplet

3. **Run Initial Server Setup**:
   - Navigate to GitHub Actions → Workflows → Server Setup
   - Click "Run workflow"
   - Choose environment (prod/staging)
   - Monitor the setup process in Actions tab

4. **Verify Installation**:
   The setup workflow automatically verifies:
   - Node.js (v20) and PM2 installation
   - PostgreSQL setup and configuration
   - Application directory structure
   - Environment variables
   - Database connection

### Deployment Process

After successful server setup, deployments are fully automated:

1. Push to protected branches:
   - Push to `main` for production deployment
   - Push to `staging` for staging deployment

2. The workflow will automatically:
   - Build the application
   - Run tests
   - Backup the database
   - Run database migrations
   - Deploy the new version
   - Verify the deployment and database connection

3. Monitor deployment:
   - Check GitHub Actions tab for deployment status
   - View deployment logs in Digital Ocean droplet:
     ```bash
     ssh root@170.64.155.210
     cd /var/www/fnr-app/logs
     tail -f app.log
     ```

### Troubleshooting

If deployment fails:

1. Check GitHub Actions logs for errors
2. Verify secrets are correctly set
3. Run diagnostics to identify issues:

   ```bash
   # Run all diagnostics
   ssh root@170.64.155.210 'cd /var/www/fnr-app/scripts && bash all-diagnostics.sh --all'

   # Run frontend diagnostics only
   ssh root@170.64.155.210 'cd /var/www/fnr-app/scripts && bash all-diagnostics.sh --frontend'

   # Run server diagnostics only
   ssh root@170.64.155.210 'cd /var/www/fnr-app/scripts && bash all-diagnostics.sh --server'

   # Run database diagnostics only
   ssh root@170.64.155.210 'cd /var/www/fnr-app/scripts && bash all-diagnostics.sh --database'
   ```

   For detailed information about the diagnostic tools and interpreting results, see [Deployment Diagnostics Guide](./deployment-diagnostics.md).

4. Check server logs:
   ```bash
   ssh root@170.64.155.210
   cd /var/www/fnr-app/logs
   tail -f error.log
   ```

5. Check database logs:
   ```bash
   ssh root@170.64.155.210
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

6. Database rollback if needed:
   ```bash
   ssh root@170.64.155.210
   cd /var/backups/db
   # List backups
   ls -l
   # Restore latest backup
   sudo -u postgres psql fnrdb < fnrdb_TIMESTAMP.sql
   ```

7. Application rollback if needed:
   ```bash
   ssh root@170.64.155.210
   cd /var/backups/app
   # List backups
   ls -l
   # Restore latest backup
   tar -xzf app_backup_TIMESTAMP.tar.gz -C /var/www/fnr-app/
   ```
