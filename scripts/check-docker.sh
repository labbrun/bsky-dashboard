#!/bin/bash

# Docker Compose V2 compatibility check
set -e

echo "🐳 Checking Docker Compose compatibility..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check Docker version
DOCKER_VERSION=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
echo "✅ Docker version: $DOCKER_VERSION"

# Check if Docker Compose V2 is available
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || docker compose version | grep -oE 'v?[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    echo "✅ Docker Compose V2 version: $COMPOSE_VERSION"
    echo "✅ Ready to deploy with Docker Compose V2!"
    echo ""
    echo "🚀 Run deployment with:"
    echo "   docker compose up -d"
    echo ""
    exit 0
fi

# Check for legacy Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    echo "⚠️  Found legacy docker-compose version: $COMPOSE_VERSION"
    echo ""
    echo "📋 You have options:"
    echo "1. Use legacy commands: docker-compose up -d"
    echo "2. Upgrade to Docker Compose V2 (recommended)"
    echo ""
    echo "🔧 To upgrade Docker Compose:"
    echo "   - Update Docker Desktop to latest version"
    echo "   - Or install Docker Compose V2 plugin"
    echo ""
    exit 0
fi

echo "❌ Docker Compose not found."
echo "Please install Docker Desktop which includes Docker Compose V2"
echo "Download from: https://www.docker.com/products/docker-desktop/"
exit 1