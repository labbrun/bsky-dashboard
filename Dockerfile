# Production-ready Dockerfile - Works on all systems
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies (handles Python issues)
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

# Copy package files
COPY package*.json ./

# Install dependencies with comprehensive fallbacks
RUN npm install --production --legacy-peer-deps --no-optional || \
    npm install --production --force || \
    (echo "Fallback install..." && npm install --legacy-peer-deps)

# Copy source code
COPY . .

# Build the React application
RUN npm run build || npm run build --legacy-peer-deps

# Install serve globally
RUN npm install -g serve

# Remove source files to reduce image size
RUN rm -rf src public node_modules/.cache

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"]