#!/bin/bash
# server-setup.sh - Initial server environment setup for Digital Ocean droplet
# Usage: ./scripts/server-setup.sh <environment> [ssh_key_path]

# Load environment variables from .env.deploy
if [ ! -f .env.deploy ]; then
    echo "Error: .env.deploy file not found"
    exit 1
fi
source .env.deploy

# Check if environment is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: ./scripts/server-setup.sh <environment> [ssh_key_path]"
    echo "Environment options: staging, prod"
    echo "Example: ./scripts/server-setup.sh prod"
    echo "Example with custom SSH key: ./scripts/server-setup.sh prod ~/.ssh/digital_ocean_key"
    exit 1
fi

ENV=$1
SSH_KEY="${2:-~/.ssh/id_rsa}"

# Set droplet IP based on environment
if [ "$ENV" = "prod" ]; then
    DROPLET_IP=$PROD_DROPLET_IP
    NODE_ENV="production"
elif [ "$ENV" = "staging" ]; then
    DROPLET_IP=$STAGING_DROPLET_IP
    NODE_ENV="staging"
else
    echo "Error: Invalid environment. Use 'staging' or 'prod'"
    exit 1
fi

# Check if droplet IP is set
if [ -z "$DROPLET_IP" ]; then
    echo "Error: Droplet IP not set for $ENV environment in .env.deploy"
    exit 1
fi

echo "=== Initial Server Setup Script ==="
echo "Droplet IP: $DROPLET_IP"
echo "Using SSH key: $SSH_KEY"

# Create the remote setup script
cat > .setup.sh << 'EOF'
#!/bin/bash

# Update package list and upgrade existing packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y curl git build-essential

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Install PostgreSQL
echo "Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

# Configure PostgreSQL
echo "Configuring PostgreSQL..."
# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Create PostgreSQL user and database
sudo -u postgres psql << PSQL
CREATE USER fnrapp WITH PASSWORD 'your_secure_password';
CREATE DATABASE fnrdb;
GRANT ALL PRIVILEGES ON DATABASE fnrdb TO fnrapp;
\q
PSQL

# Configure PostgreSQL to allow connections
echo "Configuring PostgreSQL authentication..."
# Backup original config
cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.bak
cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.bak

# Update postgresql.conf to listen on all interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf

# Update pg_hba.conf to allow connections from the application
cat >> /etc/postgresql/*/main/pg_hba.conf << CONF
# Allow connections from the application
host    fnrdb       fnrapp          0.0.0.0/0               scram-sha-256
CONF

# Restart PostgreSQL to apply changes
systemctl restart postgresql

# Create application directory
echo "Setting up application directory..."
mkdir -p /var/www/fnr-app
chown -R $USER:$USER /var/www/fnr-app

# Clone repository
echo "Cloning repository..."
cd /var/www/fnr-app
git clone git@github.com:joshuarobs/fnr-test4.git .

# Create backup directory
echo "Setting up backup directory..."
mkdir -p /var/backups/app
chown -R $USER:$USER /var/backups/app

# Setup environment variables
echo "Setting up environment variables..."
cat > /var/www/fnr-app/.env << ENV
DATABASE_URL="postgresql://fnrapp:your_secure_password@localhost:5432/fnrdb"
NODE_ENV="$NODE_ENV"
PORT=3000
ENV

# Set correct permissions for the .env file
chmod 600 /var/www/fnr-app/.env

# Install certbot for SSL (if needed)
echo "Installing certbot for SSL..."
apt-get install -y certbot

echo "=== Server Setup Complete ==="
echo "Next steps:"
echo "1. Update the database password in /var/www/fnr-app/.env"
echo "2. Configure SSL certificates using certbot if needed"
echo "3. Run the quick-deploy.sh script to deploy your application"
EOF

# Transfer and execute the setup script
echo "Transferring setup script to server..."
scp -i "$SSH_KEY" .setup.sh root@$DROPLET_IP:/root/setup.sh

echo "Executing setup script on server..."
ssh -i "$SSH_KEY" root@$DROPLET_IP "chmod +x /root/setup.sh && /root/setup.sh"

# Clean up
echo "Cleaning up..."
rm .setup.sh

echo "=== Server Setup Complete ==="
echo "Your server environment has been configured!"
echo "Important: Make sure to:"
echo "1. Update the database password in /var/www/fnr-app/.env on the server"
echo "2. Configure SSL certificates if needed using: certbot --nginx"
echo "3. Run the quick-deploy.sh script to deploy your application"
