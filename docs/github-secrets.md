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
Example: 170.64.188.76
```

## `DATABASE_PASSWORD`
PostgreSQL database password for the fnrapp user
```bash
# Default development value (not for production use):
12345

# For production, generate a secure password:
openssl rand -base64 32
```

## `DATABASE_URL`
PostgreSQL connection string
```
Example value to copy: postgresql://fnrapp:12345@localhost:5432/fnrdb
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
Example: https://fnrtest.com
```

## `DOMAIN_NAME`
Your application's domain name (required for Let's Encrypt SSL)
```
Example: fnrtest.com
```

## `ADMIN_EMAIL`
Email address for Let's Encrypt notifications and certificate expiry alerts
```
Example: admin@fnrtest.com
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

# SSL Configuration

The application uses Let's Encrypt for SSL certificates, which:
- Are automatically obtained during server setup
- Are valid for 90 days
- Auto-renew when they reach 30 days before expiration
- Provide trusted HTTPS encryption recognized by all modern browsers
- Require a valid domain name pointing to your server IP
