#!/bin/bash
# pre-setup.sh - Sets up SSH deploy key for GitHub authentication
# Usage: ./scripts/pre-setup.sh <environment> [ssh_key_path] [key_name]

# Load environment variables from .env.deploy
if [ ! -f .env.deploy ]; then
    echo "Error: .env.deploy file not found"
    exit 1
fi
source .env.deploy

# Check if environment is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: ./scripts/pre-setup.sh <environment> [ssh_key_path] [key_name]"
    echo "Environment options: staging, prod"
    echo "Example: ./scripts/pre-setup.sh prod"
    echo "Example with custom key path: ./scripts/pre-setup.sh prod ~/.ssh"
    echo "Example with custom key path and name: ./scripts/pre-setup.sh prod ~/.ssh my_deploy_key"
    exit 1
fi

ENV=$1
SSH_KEY_PATH="${2:-C:\Users\User\.ssh}"  # Default to standard Windows SSH directory
KEY_NAME="${3:-fnr_deploy_key}"          # Default key name

# Set droplet IP based on environment
if [ "$ENV" = "prod" ]; then
    DROPLET_IP=$PROD_DROPLET_IP
elif [ "$ENV" = "staging" ]; then
    DROPLET_IP=$STAGING_DROPLET_IP
else
    echo "Error: Invalid environment. Use 'staging' or 'prod'"
    exit 1
fi

# Check if droplet IP is set
if [ -z "$DROPLET_IP" ]; then
    echo "Error: Droplet IP not set for $ENV environment in .env.deploy"
    exit 1
fi

# Construct full key path
FULL_KEY_PATH="$SSH_KEY_PATH/$KEY_NAME"

# Check if key exists
if [ ! -f "$FULL_KEY_PATH" ]; then
    echo "Error: SSH key not found at $FULL_KEY_PATH"
    echo "Generate a key using:"
    echo "ssh-keygen -t ed25519 -C \"deploy-key-fnr-test4\" -f $FULL_KEY_PATH"
    exit 1
fi

echo "=== SSH Setup Script ==="
echo "Droplet IP: $DROPLET_IP"
echo "Environment: $ENV"
echo "Using SSH key: $FULL_KEY_PATH"

# Create remote script for SSH setup
cat > .ssh-setup.sh << 'EOF'
#!/bin/bash

# Set up SSH directory
echo "Setting up SSH directory..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add GitHub to known hosts
echo "Adding GitHub to known hosts..."
ssh-keyscan github.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

# Test GitHub connection
echo "Testing GitHub connection..."
ssh -T git@github.com || true
EOF

# Copy deploy key to server
echo "Copying deploy key to server..."
scp "$FULL_KEY_PATH" root@$DROPLET_IP:/root/.ssh/id_ed25519

# Transfer and execute the setup script
echo "Transferring setup script..."
scp .ssh-setup.sh root@$DROPLET_IP:/root/ssh-setup.sh

echo "Executing setup script..."
ssh root@$DROPLET_IP "chmod +x /root/ssh-setup.sh && /root/ssh-setup.sh"

# Clean up
rm .ssh-setup.sh

echo "=== SSH Setup Complete ==="
echo "GitHub deploy key has been configured on the server"
