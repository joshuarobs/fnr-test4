# Required GitHub Secrets

Before deploying the application, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

2. Add these required secrets:

## `DO_SSH_KEY`
Your Digital Ocean SSH private key
```bash
# Generate a new key pair if needed:
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
# Add the public key to your Digital Ocean droplet's ~/.ssh/authorized_keys
# Add the private key content to this secret
```

## `DROPLET_IP`
Your Digital Ocean droplet IP address
```
xxx.xxx.xxx.xxx
```

## `DATABASE_PASSWORD`
PostgreSQL database password for the fnrapp user
```bash
# Generate a secure password:
openssl rand -base64 32
```

## `DATABASE_URL`
PostgreSQL connection string using the password above
```
postgresql://fnrapp:your_database_password@localhost:5432/fnrdb
```

## `SESSION_SECRET`
A secure random string for session encryption
```bash
# Generate a secure random string:
openssl rand -base64 32
```

## `CLIENT_URL`
Your frontend application URL
```
https://your-frontend-domain.com
```

# Setting Up Secrets

1. For each secret above:
   - Click "New repository secret"
   - Enter the secret name exactly as shown (e.g., `DO_SSH_KEY`)
   - Paste the corresponding value
   - Click "Add secret"

2. Verify all secrets are set:
   - Go to repository Settings → Secrets and variables → Actions
   - Confirm all required secrets are listed

# Initial Deployment

After setting up all secrets:

1. Run the Server Setup workflow:
   - Go to Actions → Workflows → "Server Setup"
   - Click "Run workflow"
   - Select environment (prod/staging)
   - Click "Run workflow"

2. Monitor the setup progress in the Actions tab

3. Once setup is complete, your repository is ready for automated deployments:
   - Push to `main` branch → Production deployment
   - Push to `staging` branch → Staging deployment
