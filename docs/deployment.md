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

Before running either workflow, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

2. Add the following secrets:

- `DO_SSH_KEY`: Your Digital Ocean SSH private key
  ```bash
  # Generate a new key pair if needed:
  ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
  # Add the public key to your Digital Ocean droplet's ~/.ssh/authorized_keys
  # Add the private key content to this secret
  ```

- `DROPLET_IP`: Your Digital Ocean droplet IP address
  ```
  170.64.155.210
  ```

- `DATABASE_URL`: PostgreSQL connection string
  ```
  postgresql://fnrapp:your_password@localhost:5432/fnrdb
  ```

- `SESSION_SECRET`: A secure random string for session encryption
  ```bash
  # Generate a secure random string:
  openssl rand -base64 32
  ```

- `CLIENT_URL`: Your frontend application URL
  ```
  https://your-frontend-domain.com
  ```

### Initial Setup Process

1. **Provision Server**:
   - Create a Digital Ocean droplet
   - Add your SSH public key to the droplet
   - Update `.env.deploy` with the droplet IP

2. **Configure GitHub Secrets**:
   - Add all required secrets to your GitHub repository
   - Ensure the SSH key has proper permissions on the droplet

3. **Run Server Setup**:
   - Go to GitHub Actions → Workflows → Server Setup
   - Click "Run workflow"
   - Select environment (prod/staging)
   - Monitor setup progress in Actions tab

4. **Verify Setup**:
   The setup workflow will automatically verify:
   - Node.js and PM2 installation
   - PostgreSQL configuration
   - Directory structure
   - Environment configuration

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
3. Check server logs:
   ```bash
   ssh root@170.64.155.210
   cd /var/www/fnr-app/logs
   tail -f error.log
   ```

4. Check database logs:
   ```bash
   ssh root@170.64.155.210
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

5. Database rollback if needed:
   ```bash
   ssh root@170.64.155.210
   cd /var/backups/db
   # List backups
   ls -l
   # Restore latest backup
   sudo -u postgres psql fnrdb < fnrdb_TIMESTAMP.sql
   ```

6. Application rollback if needed:
   ```bash
   ssh root@170.64.155.210
   cd /var/backups/app
   # List backups
   ls -l
   # Restore latest backup
   tar -xzf app_backup_TIMESTAMP.tar.gz -C /var/www/fnr-app/
   ```
