#!/bin/bash
# verify-deployment.sh - Verify the deployment status of the FNR application
# Usage: ./scripts/verify-deployment.sh <environment> [ssh_key_path]

# Load environment variables from .env.deploy
if [ ! -f .env.deploy ]; then
    echo "Error: .env.deploy file not found"
    exit 1
fi
source .env.deploy

# Check if environment is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: ./scripts/verify-deployment.sh <environment> [ssh_key_path]"
    echo "Environment options: staging, prod"
    echo "Example: ./scripts/verify-deployment.sh prod"
    echo "Example with custom SSH key: ./scripts/verify-deployment.sh prod ~/.ssh/digital_ocean_key"
    exit 1
fi

ENV=$1
SSH_KEY="${2:-~/.ssh/id_rsa}"

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

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        echo -e "${YELLOW}  → $3${NC}"
    fi
}

print_header() {
    echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# Create the remote verification script
cat > .verify.sh << 'EOF'
#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        echo -e "${YELLOW}  → $3${NC}"
    fi
}

print_header() {
    echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# 1. Server Environment Checks
print_header "Server Environment"

# Check Node.js
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status "Node.js installed" 0 "Version: $NODE_VERSION"
else
    print_status "Node.js not found" 1 "Install Node.js: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
fi

# Check PM2
PM2_VERSION=$(pm2 -v 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status "PM2 installed" 0 "Version: $PM2_VERSION"
else
    print_status "PM2 not found" 1 "Install PM2: npm install -g pm2"
fi

# Check PostgreSQL
PG_STATUS=$(systemctl is-active postgresql)
if [ "$PG_STATUS" = "active" ]; then
    print_status "PostgreSQL service" 0 "Status: Active"
else
    print_status "PostgreSQL service" 1 "Start PostgreSQL: systemctl start postgresql"
fi

# Check required directories
APP_DIR="/var/www/fnr-app"
if [ -d "$APP_DIR" ]; then
    print_status "Application directory" 0 "Path: $APP_DIR"
else
    print_status "Application directory" 1 "Create directory: mkdir -p $APP_DIR"
fi

# Check environment file
if [ -f "$APP_DIR/.env" ]; then
    print_status "Environment file" 0 "Path: $APP_DIR/.env"
else
    print_status "Environment file" 1 "Create .env file in $APP_DIR"
fi

# 2. Database Status
print_header "Database Status"

# Check PostgreSQL connection
if sudo -u postgres psql -c '\l' >/dev/null 2>&1; then
    print_status "PostgreSQL connection" 0 "Connected successfully"
else
    print_status "PostgreSQL connection" 1 "Check PostgreSQL credentials and connection"
fi

# Check database existence
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw fnrdb; then
    print_status "Database existence" 0 "Database 'fnrdb' exists"
else
    print_status "Database existence" 1 "Create database: createdb fnrdb"
fi

# Check database user
if sudo -u postgres psql -c '\du' | grep -q fnrapp; then
    print_status "Database user" 0 "User 'fnrapp' exists"
else
    print_status "Database user" 1 "Create user: createuser fnrapp"
fi

# 3. Application Status
print_header "Application Status"

# Check PM2 processes
PM2_PROCESS=$(pm2 list 2>/dev/null | grep "fnr-server-$ENV")
if [ $? -eq 0 ]; then
    print_status "PM2 process" 0 "fnr-server-$ENV is running"
else
    print_status "PM2 process" 1 "Start application: cd $APP_DIR && pm2 start dist/main.js --name fnr-server-$ENV"
fi

# Check application logs
if [ -f "$HOME/.pm2/logs/fnr-server-out.log" ]; then
    ERROR_COUNT=$(tail -n 50 "$HOME/.pm2/logs/fnr-server-out.log" | grep -i "error" | wc -l)
    if [ $ERROR_COUNT -eq 0 ]; then
        print_status "Application logs" 0 "No recent errors found"
    else
        print_status "Application logs" 1 "Found $ERROR_COUNT recent errors. Check: tail -n 50 $HOME/.pm2/logs/fnr-server-out.log"
    fi
else
    print_status "Application logs" 1 "Log file not found"
fi

# Check HTTP endpoint
if command -v curl >/dev/null 2>&1; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
        print_status "HTTP endpoint" 0 "Server responding on port 3000"
    else
        print_status "HTTP endpoint" 1 "Server not responding correctly (Status: $RESPONSE)"
    fi
else
    print_status "HTTP endpoint" 1 "curl not installed"
fi

# 4. System Status
print_header "System Status"

# Check memory usage
MEM_USAGE=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')
print_status "Memory usage" 0 "Current usage: $MEM_USAGE"

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}')
if [ "${DISK_USAGE%?}" -gt 90 ]; then
    print_status "Disk space" 1 "High disk usage: $DISK_USAGE"
else
    print_status "Disk space" 0 "Usage: $DISK_USAGE"
fi

# Check CPU load
LOAD_AVG=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1)
print_status "CPU load" 0 "Load average: $LOAD_AVG"

# Check active connections
CONN_COUNT=$(netstat -an | grep :3000 | grep ESTABLISHED | wc -l)
print_status "Active connections" 0 "Count: $CONN_COUNT"

# Final summary
print_header "Summary"
echo -e "${YELLOW}If any checks failed, address the suggested fixes and run this script again.${NC}"
echo -e "${YELLOW}For detailed logs: tail -f /root/.pm2/logs/fnr-server-out.log${NC}"
EOF

# Transfer and execute the verification script
echo "=== Starting Deployment Verification ==="
echo "Droplet IP: $DROPLET_IP"
echo "Using SSH key: $SSH_KEY"

# Transfer the script
echo "Transferring verification script..."
scp -i "$SSH_KEY" .verify.sh root@$DROPLET_IP:/root/verify.sh

# Execute the script
echo "Running verification..."
ssh -i "$SSH_KEY" root@$DROPLET_IP "chmod +x /root/verify.sh && /root/verify.sh"

# Clean up
rm .verify.sh

echo "=== Verification Complete ==="
