# Backup deploy.yml

This is a working version of .github/workflows/deploy.yml


name: Build and Deploy

on:
  push:
    branches: [main, staging]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

env:
  NODE_VERSION: '20'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: |
          cd apps/fnr-server
          npx prisma generate
          cd ../..

      - name: Build applications
        id: build
        run: |
          echo "🏗️ Building server application..."
          npx nx build fnr-server --skip-nx-cache

          echo "🏗️ Building frontend application..."
          npx nx build fnr-app --skip-nx-cache

          # Verify server build output
          if [ ! -d "dist/apps/fnr-server" ]; then
            echo "❌ Server build output directory not found"
            exit 1
          fi

          if [ ! -f "dist/apps/fnr-server/main.js" ]; then
            echo "❌ Server main build artifact not found"
            exit 1
          fi

          # Verify frontend build output
          if [ ! -d "dist/apps/fnr-app" ]; then
            echo "❌ Frontend build output directory not found"
            exit 1
          fi

          if [ ! -f "dist/apps/fnr-app/index.html" ]; then
            echo "❌ Frontend index.html not found"
            exit 1
          fi

          echo "📦 Build output contents:"
          echo "Server build:"
          ls -la dist/apps/fnr-server/
          echo "Frontend build:"
          ls -la dist/apps/fnr-app/

          echo "✅ Build completed successfully"

      - name: Run tests
        run: npx nx test fnr-server --skip-nx-cache

      - name: Verify build artifacts
        run: |
          echo "🔍 Verifying build artifacts..."

          # Function to check required files
          check_file() {
            local file=$1
            local name=$2
            if [ ! -f "$file" ]; then
              echo "❌ Required $name not found at: $file"
              return 1
            fi
            echo "✅ Found $name: $file"
            return 0
          }

          # Function to check required directories
          check_directory() {
            local dir=$1
            local name=$2
            if [ ! -d "$dir" ]; then
              echo "❌ Required $name directory not found at: $dir"
              return 1
            fi
            echo "✅ Found $name directory: $dir"
            echo "📦 Contents of $name directory:"
            ls -la "$dir"
            return 0
          }

          # Check server build
          check_directory "dist/apps/fnr-server" "Server build" || exit 1
          check_file "dist/apps/fnr-server/main.js" "Server main file" || exit 1

          # Check frontend build
          check_directory "dist/apps/fnr-app" "Frontend build" || exit 1
          check_file "dist/apps/fnr-app/index.html" "Frontend index file" || exit 1
          check_file "dist/apps/fnr-app/manifest.json" "Frontend manifest" || exit 1

          # Check frontend assets
          if [ ! -d "dist/apps/fnr-app/assets" ]; then
            echo "⚠️ Frontend assets directory not found, creating it..."
            mkdir -p dist/apps/fnr-app/assets
          else
            echo "✅ Frontend assets directory found"
            echo "📦 Assets directory contents:"
            ls -la dist/apps/fnr-app/assets/
            
            # Check for critical asset types
            echo "🔍 Checking for critical asset types..."
            asset_types=("js" "css")
            for type in "${asset_types[@]}"; do
              count=$(find dist/apps/fnr-app/assets -name "*.${type}" | wc -l)
              if [ "$count" -eq 0 ]; then
                echo "⚠️ Warning: No .${type} files found in assets directory"
              else
                echo "✅ Found ${count} .${type} files"
              fi
            done
          fi

          # Check Prisma files
          check_directory "apps/fnr-server/prisma" "Prisma" || exit 1
          check_file "apps/fnr-server/prisma/schema.prisma" "Prisma schema" || exit 1
          check_file "apps/fnr-server/prisma/seed.ts" "Prisma seed" || exit 1

          # Verify frontend build integrity
          echo "🔍 Verifying frontend build integrity..."
          if ! grep -q "<!DOCTYPE html>" "dist/apps/fnr-app/index.html"; then
            echo "❌ index.html appears to be invalid"
            exit 1
          fi

          # Check for environment-specific configurations
          echo "🔍 Checking environment configurations..."
          if [ ! -f "dist/apps/fnr-app/config.js" ] && [ ! -f "dist/apps/fnr-app/assets/config.js" ]; then
            echo "⚠️ Warning: No frontend configuration file found"
          fi

          echo "✅ Build artifact verification completed successfully"

      - name: Upload deployment package
        uses: actions/upload-artifact@v4
        with:
          name: deployment-package
          path: |
            dist/apps/fnr-server/**
            dist/apps/fnr-app/**
            apps/fnr-server/prisma/**
            docs/frontend-diagnostics.sh
            package.json
            package-lock.json
            .env.deploy
          if-no-files-found: error
          retention-days: 1
          compression-level: 6
          overwrite: true

      - name: Generate deployment manifest
        run: |
          echo "📝 Generating deployment manifest..."
          cat << EOF > deployment-manifest.json
          {
            "version": "1.0",
            "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
            "commit": "${{ github.sha }}",
            "branch": "${{ github.ref_name }}",
            "environment": "${{ github.event.inputs.environment || 'staging' }}",
            "artifacts": {
              "server": {
                "main": "dist/apps/fnr-server/main.js",
                "config": "dist/apps/fnr-server/config.js"
              },
              "frontend": {
                "index": "dist/apps/fnr-app/index.html",
                "assets": "dist/apps/fnr-app/assets"
              },
              "prisma": {
                "schema": "apps/fnr-server/prisma/schema.prisma",
                "seed": "apps/fnr-server/prisma/seed.ts"
              }
            }
          }
          EOF

          echo "✅ Deployment manifest generated:"
          cat deployment-manifest.json

      - name: Upload deployment manifest
        uses: actions/upload-artifact@v4
        with:
          name: deployment-manifest
          path: deployment-manifest.json
          if-no-files-found: error

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/staging' || github.event.inputs.environment == 'staging'
    runs-on: ubuntu-latest

    steps:
      - name: Download deployment package
        id: download-package
        uses: actions/download-artifact@v4
        with:
          name: deployment-package
          path: deploy

      - name: Organize deployment files
        run: |
          echo "🔍 Organizing deployment files..."

          # Create directory structure
          mkdir -p deploy/dist deploy/prisma

          # Move files to correct locations
          mv deploy/apps/fnr-server/prisma/* deploy/prisma/
          mv deploy/dist/apps/fnr-server/* deploy/dist/
          mv deploy/dist/apps/fnr-app deploy/dist/

          # Clean up empty directories
          rm -rf deploy/apps

          echo "📋 Final deployment structure (excluding node_modules):"
          ls -R deploy/ | grep -v "node_modules"

      - name: Verify deployment package
        run: |
          echo "🔍 Verifying deployment package..."

          echo "📦 Checking required files..."
          required_files=(
            "deploy/dist/main.js"
            "deploy/dist/fnr-app/index.html"
            "deploy/prisma/schema.prisma"
            "deploy/package.json"
          )

          for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
              echo "❌ Required file not found: $file"
              ls -la $(dirname "$file")
              exit 1
            fi
            echo "✅ Found: $file"
          done

          # Check for assets directory
          if [ ! -d "deploy/dist/fnr-app/assets" ]; then
            echo "⚠️ Assets directory not found, creating it to prevent issues"
            mkdir -p deploy/dist/fnr-app/assets
          else
            echo "✅ Assets directory found"
            echo "📦 Assets directory contents:"
            ls -la deploy/dist/fnr-app/assets/
          fi

          echo "✅ Deployment package verification successful"

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh/
          echo "${{ secrets.DO_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.DROPLET_IP }} >> ~/.ssh/known_hosts

      - name: Backup Database
        run: |
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_DIR="/var/backups/db"
            mkdir -p $BACKUP_DIR
            
            # Get database password from server
            DB_PASSWORD=$(cat /var/www/fnr-app/.db_password)
            export PGPASSWORD="$DB_PASSWORD"
            
            pg_dump -U fnrapp -h localhost fnrdb > $BACKUP_DIR/fnrdb_$TIMESTAMP.sql
            
            # Keep only last 5 backups
            ls -t $BACKUP_DIR/fnrdb_*.sql | tail -n +6 | xargs rm -f 2>/dev/null
            
            # Clear password from environment
            unset PGPASSWORD
          ENDSSH

      - name: Deploy Application
        run: |
          # Transfer files
          scp -r deploy/* root@${{ secrets.DROPLET_IP }}:/tmp/deploy/

          # Execute deployment
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            APP_DIR="/var/www/fnr-app"
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_DIR="/var/backups/app"

            # Backup current deployment
            if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
              mkdir -p $BACKUP_DIR
              tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz -C $APP_DIR .
              ls -t $BACKUP_DIR/app_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null
            fi

            # Stop current application
            pm2 stop all 2>/dev/null || true

            # Deploy new build
            mkdir -p $APP_DIR
            rm -rf $APP_DIR/*
            cp -r /tmp/deploy/* $APP_DIR/

            # Install production dependencies only
            cd $APP_DIR
            npm ci --only=production

            # Generate Prisma client
            npx prisma generate

            # Setup directories
            mkdir -p logs scripts
            chmod 755 logs scripts
            chmod -R 755 prisma

            # Copy diagnostics script
            cp /tmp/deploy/docs/frontend-diagnostics.sh scripts/
            chmod +x scripts/frontend-diagnostics.sh

            # Run database migrations
            DB_PASSWORD=$(cat .db_password)
            export DATABASE_URL="postgresql://fnrapp:${DB_PASSWORD}@localhost:5432/fnrdb"
            npx prisma migrate deploy --schema=./prisma/schema.prisma

            if [ $? -ne 0 ]; then
              echo "Migration failed. Rolling back to last backup..."
              LATEST_BACKUP=$(ls -t /var/backups/db/fnrdb_*.sql | head -n1)
              if [ -n "$LATEST_BACKUP" ]; then
                export PGPASSWORD="$DB_PASSWORD"
                psql -U fnrapp -h localhost -d fnrdb -f "$LATEST_BACKUP"
                unset PGPASSWORD
              fi
              exit 1
            fi

            # Start application
            pm2 delete all 2>/dev/null || true
            ENV="${{ github.ref == 'refs/heads/main' && 'prod' || 'staging' }}"
            
            # Set environment variables
            export NODE_ENV=production
            
            # Verify frontend files
            echo "Verifying frontend files..."
            if [ ! -d "dist/fnr-app" ] || [ ! -f "dist/fnr-app/index.html" ]; then
              echo "❌ Frontend files missing or incomplete"
              exit 1
            fi
            
            # Verify assets
            echo "Verifying frontend assets..."
            if [ ! -d "dist/fnr-app/assets" ]; then
              echo "❌ Assets directory missing"
              exit 1
            fi
            
            # Set correct permissions
            chmod -R 755 dist/fnr-app
            
            pm2 start dist/main.js \
              --name "fnr-server-$ENV" \
              --log $APP_DIR/logs/app.log \
              --error $APP_DIR/logs/error.log \
              --time \
              --merge-logs \
              --env production \
              --env NODE_ENV=production
            
            pm2 save
          ENDSSH

      - name: Verify Deployment
        run: |
          # Wait for application to start
          sleep 10

          # Check if service is running
          ssh root@${{ secrets.DROPLET_IP }} "pm2 list | grep fnr-server"

          # Verify database connection and run seed
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            cd /var/www/fnr-app
            
            # Verify directory structure
            echo "Verifying deployment structure..."
            if [ ! -d "prisma" ]; then
              echo "❌ Error: prisma directory not found"
              ls -la
              exit 1
            fi
            
            echo "📂 Deployment directory structure (excluding node_modules):"
            find . -maxdepth 2 -not -path "./node_modules*" -not -path "*/node_modules*"
            
            # Setup environment
            DB_PASSWORD=$(cat .db_password)
            export DATABASE_URL="postgresql://fnrapp:${DB_PASSWORD}@localhost:5432/fnrdb"
            export NODE_ENV=production
            
            echo "Running database seed..."
            # Run seed with transpileOnly to bypass TypeScript errors
            npx ts-node --skipProject --transpileOnly --compiler-options '{"module":"CommonJS"}' prisma/seed.ts 2>&1 | tee seed.log
            
            if [ $? -ne 0 ]; then
              echo "❌ Database seeding failed. Check seed.log for details:"
              cat seed.log
              exit 1
            fi
            
            echo "✅ Database seeding completed successfully"
            rm -f seed.log
          ENDSSH

          # Verify HTTP endpoint
          echo "Verifying HTTP endpoint..."
          # Verify API endpoint
          echo "Verifying API endpoint..."
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://${{ secrets.DROPLET_IP }}:3000/api)

          # Verify frontend serving
          echo "Verifying frontend serving..."
          FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://${{ secrets.DROPLET_IP }}:3000/)
          if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
            echo "✅ API endpoint verified successfully"
          else
            echo "❌ API endpoint verification failed"
            exit 1
          fi

          if [ "$FRONTEND_RESPONSE" = "200" ] || [ "$FRONTEND_RESPONSE" = "301" ] || [ "$FRONTEND_RESPONSE" = "302" ]; then
            echo "✅ Frontend serving verified successfully"
          else
            echo "❌ Frontend serving verification failed"
            exit 1
          fi

          echo "✅ Deployment verified successfully"

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main' || github.event.inputs.environment == 'production'
    runs-on: ubuntu-latest

    steps:
      - name: Download deployment package
        id: download-package
        uses: actions/download-artifact@v4
        with:
          name: deployment-package
          path: deploy

      - name: Organize deployment files
        run: |
          echo "🔍 Organizing deployment files..."

          # Create directory structure
          mkdir -p deploy/dist deploy/prisma

          # Move files to correct locations
          mv deploy/apps/fnr-server/prisma/* deploy/prisma/
          mv deploy/dist/apps/fnr-server/* deploy/dist/
          mv deploy/dist/apps/fnr-app deploy/dist/

          # Clean up empty directories
          rm -rf deploy/apps

          echo "📋 Final deployment structure (excluding node_modules):"
          ls -R deploy/ | grep -v "node_modules"

      - name: Verify deployment package
        run: |
          echo "🔍 Verifying deployment package..."

          echo "📦 Checking required files..."
          required_files=(
            "deploy/dist/main.js"
            "deploy/dist/fnr-app/index.html"
            "deploy/prisma/schema.prisma"
            "deploy/package.json"
          )

          for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
              echo "❌ Required file not found: $file"
              ls -la $(dirname "$file")
              exit 1
            fi
            echo "✅ Found: $file"
          done

          # Check for assets directory
          if [ ! -d "deploy/dist/fnr-app/assets" ]; then
            echo "⚠️ Assets directory not found, creating it to prevent issues"
            mkdir -p deploy/dist/fnr-app/assets
          else
            echo "✅ Assets directory found"
            echo "📦 Assets directory contents:"
            ls -la deploy/dist/fnr-app/assets/
          fi

          echo "✅ Deployment package verification successful"

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh/
          echo "${{ secrets.DO_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.DROPLET_IP }} >> ~/.ssh/known_hosts

      - name: Backup Database
        run: |
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_DIR="/var/backups/db"
            mkdir -p $BACKUP_DIR
            
            # Get database password from server
            DB_PASSWORD=$(cat /var/www/fnr-app/.db_password)
            export PGPASSWORD="$DB_PASSWORD"
            
            pg_dump -U fnrapp -h localhost fnrdb > $BACKUP_DIR/fnrdb_$TIMESTAMP.sql
            
            # Keep only last 5 backups
            ls -t $BACKUP_DIR/fnrdb_*.sql | tail -n +6 | xargs rm -f 2>/dev/null
            
            # Clear password from environment
            unset PGPASSWORD
          ENDSSH

      - name: Deploy Application
        run: |
          # Transfer files
          scp -r deploy/* root@${{ secrets.DROPLET_IP }}:/tmp/deploy/

          # Execute deployment
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            APP_DIR="/var/www/fnr-app"
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_DIR="/var/backups/app"

            # Backup current deployment
            if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
              mkdir -p $BACKUP_DIR
              tar -czf $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz -C $APP_DIR .
              ls -t $BACKUP_DIR/app_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null
            fi

            # Stop current application
            pm2 stop all 2>/dev/null || true

            # Deploy new build
            mkdir -p $APP_DIR
            rm -rf $APP_DIR/*
            cp -r /tmp/deploy/* $APP_DIR/

            # Install production dependencies only
            cd $APP_DIR
            npm ci --only=production

            # Generate Prisma client
            npx prisma generate

            # Setup directories
            mkdir -p logs scripts
            chmod 755 logs scripts
            chmod -R 755 prisma

            # Copy diagnostics script
            cp /tmp/deploy/docs/frontend-diagnostics.sh scripts/
            chmod +x scripts/frontend-diagnostics.sh

            # Run database migrations
            DB_PASSWORD=$(cat .db_password)
            export DATABASE_URL="postgresql://fnrapp:${DB_PASSWORD}@localhost:5432/fnrdb"
            npx prisma migrate deploy --schema=./prisma/schema.prisma

            if [ $? -ne 0 ]; then
              echo "Migration failed. Rolling back to last backup..."
              LATEST_BACKUP=$(ls -t /var/backups/db/fnrdb_*.sql | head -n1)
              if [ -n "$LATEST_BACKUP" ]; then
                export PGPASSWORD="$DB_PASSWORD"
                psql -U fnrapp -h localhost -d fnrdb -f "$LATEST_BACKUP"
                unset PGPASSWORD
              fi
              exit 1
            fi

            # Start application
            pm2 delete all 2>/dev/null || true
            ENV="${{ github.ref == 'refs/heads/main' && 'prod' || 'staging' }}"
            pm2 start dist/main.js \
              --name "fnr-server-$ENV" \
              --log $APP_DIR/logs/app.log \
              --error $APP_DIR/logs/error.log \
              --time \
              --merge-logs \
              --env production
            
            pm2 save
          ENDSSH

      - name: Verify Deployment
        run: |
          # Wait for application to start
          sleep 10

          # Check if service is running
          ssh root@${{ secrets.DROPLET_IP }} "pm2 list | grep fnr-server"

          # Verify database connection and run seed
          ssh root@${{ secrets.DROPLET_IP }} << 'ENDSSH'
            cd /var/www/fnr-app
            
            # Verify directory structure
            echo "Verifying deployment structure..."
            if [ ! -d "prisma" ]; then
              echo "❌ Error: prisma directory not found"
              ls -la
              exit 1
            fi
            
            echo "📂 Deployment directory structure (excluding node_modules):"
            find . -maxdepth 2 -not -path "./node_modules*" -not -path "*/node_modules*"
            
            # Setup environment
            DB_PASSWORD=$(cat .db_password)
            export DATABASE_URL="postgresql://fnrapp:${DB_PASSWORD}@localhost:5432/fnrdb"
            export NODE_ENV=production
            
            echo "Running database seed..."
            # Run seed with transpileOnly to bypass TypeScript errors
            npx ts-node --skipProject --transpileOnly --compiler-options '{"module":"CommonJS"}' prisma/seed.ts 2>&1 | tee seed.log
            
            if [ $? -ne 0 ]; then
              echo "❌ Database seeding failed. Check seed.log for details:"
              cat seed.log
              exit 1
            fi
            
            echo "✅ Database seeding completed successfully"
            rm -f seed.log
          ENDSSH

          # Verify HTTP endpoint
          echo "Verifying HTTP endpoint..."
          # Verify API endpoint
          echo "Verifying API endpoint..."
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://${{ secrets.DROPLET_IP }}:3000/api)

          # Verify frontend serving
          echo "Verifying frontend serving..."
          FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://${{ secrets.DROPLET_IP }}:3000/)
          if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
            echo "✅ API endpoint verified successfully"
          else
            echo "❌ API endpoint verification failed"
            exit 1
          fi

          if [ "$FRONTEND_RESPONSE" = "200" ] || [ "$FRONTEND_RESPONSE" = "301" ] || [ "$FRONTEND_RESPONSE" = "302" ]; then
            echo "✅ Frontend serving verified successfully"
          else
            echo "❌ Frontend serving verification failed"
            exit 1
          fi

          echo "✅ Deployment verified successfully"

      - name: Cleanup
        if: always()
        run: |
          # First cleanup remote files
          ssh root@${{ secrets.DROPLET_IP }} "rm -rf /tmp/deploy" || echo "Remote cleanup failed but continuing..."
          # Then cleanup local files
          rm -rf .deploy
          # Finally remove SSH key as the last step
          rm -rf ~/.ssh/id_rsa
