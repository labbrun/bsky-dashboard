# 🚀 Deployment Guide

## 🎯 **Production Deploy (Bulletproof)**

### **One-Command Deploy**
```bash
git clone <your-repo-url>
cd bluesky-analytics-dashboard

# Deploy instantly (works everywhere)
BLUESKY_HANDLE=your-handle.bsky.social \
AUTH_PASSWORD=secure-password \
docker compose -f docker-compose.simple.yml up -d

# Access at http://localhost:3000
```

### **Local Development**
```bash
git clone <your-repo-url>
cd bluesky-analytics-dashboard
npm install
npm run setup
npm start
```

### ⚡ Option 3: Manual Setup
```bash
git clone <your-repo>
cd bluesky-analytics-dashboard
cp .env.example .env
# Edit .env with your settings
npm install
npm start
```

## 📋 Minimum Required Settings

Only 2 settings are required:

```env
REACT_APP_BLUESKY_HANDLE=your-handle.bsky.social
REACT_APP_AUTH_PASSWORD=your-secure-password
```

Everything else is optional!

## 🔑 Key Features

✅ **Works Offline**: No database required  
✅ **Self-Hosted**: Complete control over your data  
✅ **Docker Ready**: One command deployment  
✅ **Optional Database**: Use Supabase if you want persistence  
✅ **Zero Config**: Works with minimal setup  

## 🛠️ Commands

```bash
# Setup wizard
npm run setup

# Development
npm start

# Docker deployment
npm run docker:run

# Docker logs
npm run docker:logs

# Stop Docker
npm run docker:stop
```

## 📊 What You Get

- Real-time Bluesky analytics
- Post performance tracking  
- Follower insights
- Engagement metrics
- Interactive charts
- Content format analysis
- Export capabilities

## 🔒 Security Notes

- Dashboard is password protected
- No data leaves your server
- API keys stay in your environment
- Optional database for persistence
- Secure defaults for all settings

## 💡 Pro Tips

**Local-only mode**: Perfect for personal use, no database needed  
**Database mode**: Add Supabase for data persistence and history  
**Docker mode**: Best for production deployments  
**Development mode**: Use `npm start` for local development  

---

**Ready to deploy? Pick an option above and you'll be running in minutes!**