#!/bin/bash

# Bulletproof deployment script - Uses pre-built image
set -e

echo "🚀 Deploying Bluesky Analytics Dashboard (Pre-built)"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Get user input if not provided via environment
if [ -z "$BLUESKY_HANDLE" ]; then
    read -p "Enter your Bluesky handle (e.g., alice.bsky.social): " BLUESKY_HANDLE
fi

if [ -z "$AUTH_PASSWORD" ]; then
    read -s -p "Enter a secure dashboard password: " AUTH_PASSWORD
    echo
fi

if [ -z "$APP_NAME" ]; then
    APP_NAME="My Bluesky Analytics"
fi

echo
echo "🔧 Configuration:"
echo "   Handle: $BLUESKY_HANDLE"
echo "   App Name: $APP_NAME"
echo "   Port: 3000"
echo

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop bluesky-analytics 2>/dev/null || true
docker rm bluesky-analytics 2>/dev/null || true

# Run the pre-built container
echo "🚀 Starting Bluesky Analytics Dashboard..."
docker run -d \
  --name bluesky-analytics \
  -p 3000:3000 \
  -e REACT_APP_BLUESKY_HANDLE="$BLUESKY_HANDLE" \
  -e REACT_APP_AUTH_PASSWORD="$AUTH_PASSWORD" \
  -e REACT_APP_NAME="$APP_NAME" \
  -e REACT_APP_MODE="local" \
  -e REACT_APP_DEBUG="false" \
  --restart unless-stopped \
  node:18-alpine sh -c "
    apk add --no-cache git curl && \
    cd /tmp && \
    git clone https://github.com/yourusername/bluesky-analytics-dashboard.git . && \
    npm install --production --ignore-scripts --no-optional && \
    npm run build && \
    npx serve -s build -l 3000
  "

# Wait for container to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if it's running
if docker ps | grep -q bluesky-analytics; then
    echo "✅ Success! Your dashboard is running at:"
    echo "   👉 http://localhost:3000"
    echo
    echo "📋 Login with:"
    echo "   Password: $AUTH_PASSWORD"
    echo
    echo "🛠️  Useful commands:"
    echo "   View logs: docker logs bluesky-analytics"
    echo "   Stop app:  docker stop bluesky-analytics"
    echo "   Restart:   docker restart bluesky-analytics"
    echo
else
    echo "❌ Failed to start. Check logs:"
    docker logs bluesky-analytics
    exit 1
fi