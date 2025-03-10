# Deployment Guide

## GitHub Actions CI/CD Setup

The repository is configured with GitHub Actions for automated deployment to Digital Ocean. The workflow will automatically deploy:
- `main` branch → Production environment
- `staging` branch → Staging environment

### Required GitHub Secrets

Before the deployment workflow can run, you need to set up the following secrets in your GitHub repository:

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

### Initial Server Setup

Before the first deployment, ensure PostgreSQL is installed and configured on your Digital Ocean droplet:

1. Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Configure PostgreSQL:
   ```bash
   sudo -u postgres psql
   CREATE USER fnrapp WITH PASSWORD 'your_secure_password';
   CREATE DATABASE fnrdb;
   GRANT ALL PRIVILEGES ON DATABASE fnrdb TO fnrapp;
   \q
   ```

3. Update pg_hba.conf to allow application connections:
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   # Add line:
   host    fnrdb    fnrapp    0.0.0.0/0    scram-sha-256
   ```

4. Configure PostgreSQL to listen on all interfaces:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   # Update line:
   listen_addresses = '*'
   ```

5. Restart PostgreSQL:
   ```bash
   sudo systemctl restart postgresql
   ```

### Deployment Process

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

### Manual Deployment

While GitHub Actions is the preferred method, you can also use the provided shell scripts for manual deployment:

1. Initial setup: `./scripts/server-setup.sh prod`
2. Quick deploy: `./scripts/quick-deploy.sh prod`
3. Verify deployment: `./scripts/verify-deployment.sh prod`

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
