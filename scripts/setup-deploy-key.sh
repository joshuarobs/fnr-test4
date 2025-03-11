#!/bin/bash

DROPLET_IP="170.64.188.76"
DROPLET_USERNAME="root"
KEY_PATH="$HOME/.ssh/github_deploy_key"

# Generate key pair
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f "$KEY_PATH" -N ""

# Setup on droplet
ssh "$DROPLET_USERNAME@$DROPLET_IP" "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat "$KEY_PATH.pub" | ssh "$DROPLET_USERNAME@$DROPLET_IP" "cat >> ~/.ssh/authorized_keys"
ssh "$DROPLET_USERNAME@$DROPLET_IP" "chmod 600 ~/.ssh/authorized_keys"

# Test connection
ssh -i "$KEY_PATH" "$DROPLET_USERNAME@$DROPLET_IP" "echo 'SSH key setup successful!'"

# Show next steps
echo "=== NEXT STEPS ==="
echo "1. Copy this private key for GitHub:"
echo "----------------------------------------"
cat "$KEY_PATH"
echo "----------------------------------------"
echo "2. Go to GitHub repository → Settings → Secrets → Actions"
echo "3. Add these secrets:"
echo "   - DO_SSH_KEY: (paste the private key above)"
echo "   - DROPLET_IP: $DROPLET_IP"
echo "   - DATABASE_URL: postgresql://fnrapp:your_database_password@localhost:5432/fnrdb"
echo "   - SESSION_SECRET: $(openssl rand -base64 32)"
echo "   - CLIENT_URL: http://$DROPLET_IP:3000"
