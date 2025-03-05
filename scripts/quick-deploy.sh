#!/bin/bash
# quick-deploy.sh - Reset and deploy latest build to Digital Ocean droplet
# Usage: ./scripts/quick-deploy.sh <droplet_ip> [ssh_key_path]

# Check if droplet IP is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: ./scripts/quick-deploy.sh <droplet_ip> [ssh_key_path]"
    echo "Example: ./scripts/quick-deploy.sh 123.456.789.0"
    echo "Example with custom SSH key: ./scripts/quick-deploy.sh 123.456.789.0 ~/.ssh/digital_ocean_key"
    exit 1
fi

DROPLET_IP=$1
SSH_KEY="${2:-~/.ssh/id_rsa}"
APP_DIR="/var/www/fnr-app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/app"

echo "=== Quick Reset and Deploy ==="
echo "Droplet IP: $DROPLET_IP"
echo "Using SSH key: $SSH_KEY"

# Build the application locally
echo "Building application..."
npm install
npx nx build fnr-server --prod  # Build server for production

# Create temporary directory for deployment
echo "Preparing deployment package..."
rm -rf .deploy
mkdir -p .deploy/dist
cp -r dist/apps/fnr-server/* .deploy/dist/  # Copy NX server build output
cp package.json .deploy/
cp package-lock.json .deploy/ 2>/dev/null || cp yarn.lock .deploy/ 2>/dev/null || echo "No lock file found"

# Create the remote script for server-side operations
cat > .deploy/reset-and-deploy.sh << 'EOF'
#!/bin/bash
APP_DIR="/var/www/fnr-app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/app"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current deployment if it exists
if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
    echo "Backing up current deployment..."
    tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz -C $APP_DIR .
    
    # Keep only the 5 most recent backups
    ls -t $BACKUP_DIR/app_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null
fi

# Stop current application
echo "Stopping application..."
pm2 stop all 2>/dev/null || true

# Clear application directory
echo "Clearing application directory..."
mkdir -p $APP_DIR
rm -rf $APP_DIR/*

# Deploy new build
echo "Deploying new build..."
cp -r /tmp/deploy/* $APP_DIR/

# Install production dependencies
echo "Installing production dependencies..."
cd $APP_DIR
npm ci --only=production

# Start application
echo "Starting application..."
pm2 delete all 2>/dev/null || true
cd $APP_DIR

# Start the server using the NX build output
pm2 start dist/main.js --name fnr-server

pm2 save

echo "Deployment complete!"
EOF

# Make the script executable
chmod +x .deploy/reset-and-deploy.sh

# Transfer deployment package to the server
echo "Transferring files to server..."
scp -i "$SSH_KEY" -r .deploy/* root@$DROPLET_IP:/tmp/deploy/

# Execute remote reset and deploy script
echo "Executing deployment on server..."
ssh -i "$SSH_KEY" root@$DROPLET_IP "bash /tmp/deploy/reset-and-deploy.sh"

# Clean up
echo "Cleaning up temporary files..."
rm -rf .deploy

echo "=== Deployment complete ==="
echo "Your application has been updated on the server!"
