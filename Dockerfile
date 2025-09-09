# Multi-stage Docker build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies required for node-gyp
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Set environment for production build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Build the React application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install serve and curl for health checks
RUN apk add --no-cache curl && \
    npm install -g serve@14

# Create app directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set ownership
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard", "--single"]