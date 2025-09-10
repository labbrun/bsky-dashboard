#!/bin/bash

# Bulletproof deployment script - Uses pre-built image
set -e

echo "🚀 Deploying Bsky Dashboard (Pre-built)"
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
    APP_NAME="My Bsky Dashboard"
fi

echo
echo "🔧 Configuration:"
echo "   Handle: $BLUESKY_HANDLE"
echo "   App Name: $APP_NAME"
echo "   Port: 3000"
echo

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop bsky-dashboard 2>/dev/null || true
docker rm bsky-dashboard 2>/dev/null || true

# Run the pre-built container
echo "🚀 Starting Bsky Dashboard..."
docker run -d \
  --name bsky-dashboard \
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
    git clone https://github.com/labbrun/bsky-dashboard.git . && \
    npm install --production --ignore-scripts --no-optional && \
    npm run build && \
    npx serve -s build -l 3000
  "

# Wait for container to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if it's running
if docker ps | grep -q bsky-dashboard; then
    echo "✅ Success! Your dashboard is running at:"
    echo "   👉 http://localhost:3000"
    echo
    echo "📋 Login with:"
    echo "   Password: $AUTH_PASSWORD"
    echo
    echo "🛠️  Useful commands:"
    echo "   View logs: docker logs bsky-dashboard"
    echo "   Stop app:  docker stop bsky-dashboard"
    echo "   Restart:   docker restart bsky-dashboard"
    echo
else
    echo "❌ Failed to start. Check logs:"
    docker logs bsky-dashboard
    exit 1
fi