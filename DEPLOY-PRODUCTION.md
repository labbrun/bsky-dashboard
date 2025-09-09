# 🚀 Production Deployment Guide

## One-Command Deploy (Recommended)

### **Instant Deploy**
```bash
# 1. Clone and enter directory
git clone <your-repo-url>
cd bluesky-analytics-dashboard

# 2. Deploy with your credentials
BLUESKY_HANDLE=your-handle.bsky.social \
AUTH_PASSWORD=your-secure-password \
docker compose -f docker-compose.simple.yml up -d

# 3. Access at http://localhost:3000
```

## 🐳 **Production Docker Options**

### **Option 1: Simple Docker (Zero Python Issues)**
```bash
# Uses Dockerfile.simple - guaranteed to work everywhere
docker compose -f docker-compose.simple.yml up -d
```

### **Option 2: Nginx Docker (Performance Optimized)**
```bash
# Uses nginx for production serving
docker compose up -d
```

### **Option 3: Single Docker Command**
```bash
# No docker-compose needed
docker run -d \
  -p 3000:3000 \
  -e BLUESKY_HANDLE=your-handle.bsky.social \
  -e AUTH_PASSWORD=your-password \
  --name bluesky-analytics \
  $(docker build -q -f Dockerfile.simple .)
```

## 🌍 **Cloud Deployment**

### **Railway**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up
```

### **Vercel**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### **Heroku**
```dockerfile
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### **DigitalOcean App Platform**
```yaml
# app.yaml
name: bluesky-analytics
services:
- name: web
  source_dir: /
  github:
    repo: your-username/bluesky-analytics-dashboard
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: REACT_APP_BLUESKY_HANDLE
    value: your-handle.bsky.social
  - key: REACT_APP_AUTH_PASSWORD
    value: your-secure-password
```

## ⚡ **Quick Production Checklist**

### **Before Deploy:**
- [ ] Update `.env` with your credentials
- [ ] Choose a strong dashboard password
- [ ] Test locally first: `npm start`

### **Security:**
- [ ] Use HTTPS in production
- [ ] Set strong AUTH_PASSWORD
- [ ] Don't commit `.env` to git
- [ ] Use environment variables for secrets

### **Performance:**
- [ ] Use nginx Docker for high traffic
- [ ] Enable gzip compression
- [ ] Set up CDN if needed
- [ ] Monitor resource usage

## 🔧 **Environment Variables**

### **Required:**
```env
REACT_APP_BLUESKY_HANDLE=your-handle.bsky.social
REACT_APP_AUTH_PASSWORD=secure-password-123
```

### **Production Recommended:**
```env
REACT_APP_NAME=My Analytics Dashboard
REACT_APP_MODE=production
REACT_APP_DEBUG=false
REACT_APP_REFRESH_INTERVAL=300000
```

### **Optional Integrations:**
```env
# AI Features
REACT_APP_AI_PROVIDER=openai
REACT_APP_AI_API_KEY=sk-...

# Google Analytics
REACT_APP_GOOGLE_CSE_API_KEY=AIza...
REACT_APP_GOOGLE_CSE_ID=...

# Database
REACT_APP_SUPABASE_URL=https://...
REACT_APP_SUPABASE_ANON_KEY=...
```

## 🚨 **Troubleshooting**

### **Build Issues:**
```bash
# Use the simple Dockerfile (no Python issues)
docker build -f Dockerfile.simple -t bluesky-analytics .
docker run -p 3000:3000 bluesky-analytics
```

### **Port Issues:**
```bash
# Use different port
docker run -p 8080:3000 ...
# Access at http://localhost:8080
```

### **Memory Issues:**
```bash
# Increase Docker memory limit
docker run --memory=1g ...
```

## 📊 **Monitoring**

### **Health Check:**
```bash
# Check if running
curl -f http://localhost:3000/health || echo "App down"

# View logs
docker logs bluesky-analytics-dashboard
```

### **Auto Restart:**
```yaml
# In docker-compose.yml
restart: unless-stopped
```

## 🔄 **Updates**

### **Update Deployment:**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.simple.yml up --build -d
```

### **Zero Downtime:**
```bash
# Build new image
docker build -f Dockerfile.simple -t bluesky-analytics:new .

# Stop old, start new
docker stop bluesky-analytics
docker run -d --name bluesky-analytics-new bluesky-analytics:new
docker rm bluesky-analytics
docker rename bluesky-analytics-new bluesky-analytics
```

---

**🎉 Your production-ready Bluesky Analytics Dashboard is now deployed and accessible to users worldwide!**