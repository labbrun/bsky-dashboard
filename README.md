# 🦋 Bsky Dashboard

A self-hosted analytics dashboard for your Bluesky social media account.

## 🚀 **One-Command Deploy**

```bash
git clone https://github.com/labbrun/bsky-dashboard.git
cd bsky-dashboard

# If you get permission denied, add user to docker group first:
# sudo usermod -aG docker $USER && newgrp docker

docker compose up -d
```

**That's it!** Dashboard runs at http://localhost:3000

- **Default login:** Password `demo123`
- **Demo account:** `demo.bsky.social`

> **First run takes 3-5 minutes** to build. Subsequent starts are instant.

## ⚙️ **Quick Customization**

Edit `docker-compose.yml` before running:

```yaml
environment:
  - REACT_APP_BLUESKY_HANDLE=your-handle.bsky.social  # Your Bluesky handle
  - REACT_APP_AUTH_PASSWORD=your-secure-password       # Dashboard password
  - REACT_APP_NAME=My Analytics Dashboard              # Dashboard title
```

Then run:
```bash
docker compose up --build -d
```

## 🎯 **Features**

- ✅ **Real Bluesky data** - Your actual posts, followers, engagement
- ✅ **Admin settings** - Configure APIs through web interface  
- ✅ **No dummy data** - Only shows real information
- ✅ **Privacy first** - All data stays on your server
- ✅ **Optional integrations** - AI insights, Google trends, blog analytics
- ✅ **Works everywhere** - Proxmox VMs, home servers, cloud instances
- ✅ **No dependencies** - Just Docker (everything else is containerized)

## 🔧 **Optional APIs**

After deployment, go to **Settings** to configure:

- **AI Insights** - OpenAI, Claude, Perplexity, or local AI
- **Google Trends** - Custom Search API for trend analysis  
- **Blog Analytics** - RSS feed integration
- **LinkedIn** - Cross-platform analytics
- **Postiz** - Social media scheduling

## 🛠️ **Management Commands**

```bash
# View logs
docker compose logs -f

# Stop dashboard
docker compose down

# Update to latest version
git pull
docker compose up --build -d

# Restart
docker compose restart
```

## 🌍 **Production Deployment**

### **Environment Variables**
Set these for production:
```bash
export REACT_APP_BLUESKY_HANDLE=your-handle.bsky.social
export REACT_APP_AUTH_PASSWORD=secure-password-123
export REACT_APP_NAME="Production Analytics"
docker compose up -d
```

### **Cloud Deployment**
- **Railway:** One-click deploy button
- **Vercel:** One-click deploy button  
- **Heroku:** One-click deploy button

## 📊 **Requirements**

- **Docker Desktop** (includes Docker Compose V2) - [Download here](https://www.docker.com/products/docker-desktop/)
- **Bluesky account** (handle + optional app password)
- **2GB RAM** minimum
- **Internet connection** for API access

### **Check Compatibility**
```bash
# Verify your Docker setup (optional)
npm run check-docker
```

## 🔒 **Security**

- Dashboard is password protected
- All data stays on your server
- No telemetry or tracking
- API keys stored securely in browser localStorage
- Optional database encryption with Supabase

## 🚨 **Troubleshooting**

### **Docker permission denied:**
```bash
# On Linux/Ubuntu - Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended for production)
sudo docker compose up -d

# Verify Docker is running
sudo systemctl status docker
sudo systemctl start docker
```

### **Port 3000 in use:**
```yaml
ports:
  - "8080:3000"  # Use port 8080 instead
```

### **Build fails:**
```bash
# Try rebuilding from scratch
docker compose build --no-cache
docker compose up -d

# If still failing, use fallback configuration
docker compose -f docker-compose.fallback.yml up -d
```

### **Compilation errors:**
```bash
# If you see "Failed to compile. Syntax error"
# This is usually due to React build issues

# Quick fix - use simple build:
docker compose -f docker-compose.fallback.yml up --build -d

# Clean build (removes all cache):
docker system prune -a
docker compose up --build -d
```

### **Can't access dashboard:**
```bash
# Check if running
docker ps

# Check logs
docker compose logs bluesky-analytics

# Test locally
curl -I http://localhost:3000
```

## 💡 **Quick Tips**

- **First run takes 3-5 minutes** (building React app)
- **Subsequent starts are instant** (uses cached build)
- **Settings page** configures all optional features  
- **Works offline** after initial API data fetch
- **Mobile friendly** responsive design

## 🏠 **Common Deployment Scenarios**

### **Proxmox VM (Ubuntu/Debian)**
```bash
# Create Ubuntu/Debian VM, then:
sudo apt update && sudo apt install docker.io docker-compose-plugin

# Add your user to docker group (avoid using sudo)
sudo usermod -aG docker $USER
newgrp docker

# Clone and deploy
git clone https://github.com/labbrun/bsky-dashboard.git
cd bsky-dashboard
docker compose up -d
```

### **Home Server (Raspberry Pi, NUC, etc.)**
```bash
# Install Docker Desktop or Docker Engine
# Add user to docker group if on Linux
sudo usermod -aG docker $USER && newgrp docker

git clone https://github.com/labbrun/bsky-dashboard.git
cd bsky-dashboard
docker compose up -d
```

### **Cloud Instance (AWS, DigitalOcean, etc.)**
```bash
# On any Linux instance:
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
git clone https://github.com/labbrun/bsky-dashboard.git
cd bsky-dashboard
docker compose up -d
```

---

**🎉 Enjoy your self-hosted Bluesky analytics dashboard!**

For support, open an issue or check the troubleshooting guide.
