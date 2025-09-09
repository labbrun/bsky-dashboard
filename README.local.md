# 🦋 Bluesky Analytics Dashboard - Local Setup

A self-hosted analytics dashboard for your Bluesky social media account.

## 🚀 Quick Start

### Option 1: Interactive Setup (Recommended)
```bash
npm install
node scripts/setup.js
npm start
```

### Option 2: Manual Setup
1. Copy `.env.example` to `.env`
2. Edit `.env` with your configuration
3. Run the application:
```bash
npm install
npm start
```

### Option 3: Docker Deployment
```bash
# Quick start with environment variables
BLUESKY_HANDLE=your-handle.bsky.social \
AUTH_PASSWORD=your-secure-password \
docker-compose up -d

# Or create a .env file first
cp .env.example .env
# Edit .env file...
docker-compose up -d
```

## 📋 Required Configuration

### Essential Settings
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BLUESKY_HANDLE` | Your Bluesky handle (without @) | `alice.bsky.social` |
| `REACT_APP_AUTH_PASSWORD` | Dashboard access password | `secure-password-123` |

### Optional Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_NAME` | Dashboard title | `Bluesky Analytics Dashboard` |
| `REACT_APP_MODE` | Application mode | `local` |
| `REACT_APP_DEBUG` | Enable debug logging | `false` |
| `REACT_APP_REFRESH_INTERVAL` | Auto-refresh interval (ms) | `300000` (5 min) |

## 🗄️ Database Features (Optional)

The dashboard can run in two modes:
- **Local-only mode**: All data is fetched fresh from Bluesky API
- **Database mode**: Data is cached in Supabase for better performance

### Enable Database Storage
Add these to your `.env`:
```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Local Database with Docker
```bash
# Start with local Supabase database
docker-compose --profile with-database up -d
```

## 🔌 Optional Integrations

### Google Services (Trend Analysis)
```env
REACT_APP_GOOGLE_CSE_API_KEY=your-api-key
REACT_APP_GOOGLE_CSE_ID=your-search-engine-id
```

### LinkedIn Integration
```env
REACT_APP_LINKEDIN_CLIENT_ID=your-client-id
REACT_APP_LINKEDIN_CLIENT_SECRET=your-client-secret
```

### Postiz Integration (Social Scheduling)
```env
REACT_APP_POSTIZ_URL=https://your-postiz-instance.com
REACT_APP_POSTIZ_API_KEY=your-api-key
```

## 🛠️ Development

### Local Development
```bash
npm install
npm start
```
Dashboard will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Docker Development
```bash
docker-compose up --build
```

## 📊 Features

### Core Analytics
- ✅ Profile metrics and growth tracking
- ✅ Post performance analysis
- ✅ Engagement rate calculations
- ✅ Follower insights
- ✅ Content format analysis
- ✅ Interactive charts and graphs

### Optional Features
- 🔄 Data persistence (with Supabase)
- 🔍 Trend analysis (with Google)
- 💼 LinkedIn cross-posting (with LinkedIn API)
- 📅 Content scheduling (with Postiz)

## 🔒 Security

### Best Practices
- Use strong, unique passwords
- Never commit `.env` files to version control
- Regularly rotate API keys
- Use different credentials for development/production
- Keep your dashboard password secure

### Environment Variables
All sensitive configuration is handled through environment variables:
- No hardcoded credentials in the source code
- Optional features disable automatically without API keys
- Secure defaults for all settings

## 🐳 Docker Deployment

### Simple Deployment
```bash
# Create environment configuration
cp .env.example .env
# Edit .env with your settings...

# Deploy
docker-compose up -d
```

### With Database
```bash
docker-compose --profile with-database up -d
```

### Environment Variables in Docker
You can also pass environment variables directly:
```bash
docker run -p 3000:80 \
  -e REACT_APP_BLUESKY_HANDLE=your-handle.bsky.social \
  -e REACT_APP_AUTH_PASSWORD=secure-password \
  bluesky-analytics-dashboard
```

## 🚨 Troubleshooting

### Common Issues

**Can't connect to Bluesky API**
- Check your internet connection
- Verify your handle is correct
- Ensure the handle exists and is public

**Dashboard won't load**
- Check your password is correct
- Verify environment variables are set
- Check browser console for errors

**Database features not working**
- Verify Supabase credentials are correct
- Check Supabase project is active
- Ensure database tables exist

### Debug Mode
Enable debug logging:
```env
REACT_APP_DEBUG=true
```

### Docker Issues
```bash
# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Reset everything
docker-compose down -v
docker-compose up -d
```

## 📝 Configuration Examples

### Minimal Setup (.env)
```env
REACT_APP_BLUESKY_HANDLE=alice.bsky.social
REACT_APP_AUTH_PASSWORD=my-secure-password
REACT_APP_NAME=Alice's Analytics
```

### Full Setup (.env)
```env
# Basic Configuration
REACT_APP_BLUESKY_HANDLE=alice.bsky.social
REACT_APP_AUTH_PASSWORD=super-secure-password-123
REACT_APP_NAME=Alice's Bluesky Analytics Pro
REACT_APP_MODE=local
REACT_APP_DEBUG=false
REACT_APP_REFRESH_INTERVAL=300000

# Database (Optional)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Google Services (Optional)
REACT_APP_GOOGLE_CSE_API_KEY=your-google-api-key
REACT_APP_GOOGLE_CSE_ID=your-search-engine-id

# LinkedIn Integration (Optional)
REACT_APP_LINKEDIN_CLIENT_ID=your-linkedin-client-id
REACT_APP_LINKEDIN_CLIENT_SECRET=your-linkedin-secret

# Postiz Integration (Optional)
REACT_APP_POSTIZ_URL=https://your-postiz.example.com
REACT_APP_POSTIZ_API_KEY=your-postiz-api-key
```

## 🔄 Updates

To update your local installation:
```bash
git pull origin main
npm install
npm start
```

For Docker:
```bash
git pull origin main
docker-compose up --build -d
```

## 📞 Support

For issues and questions:
1. Check this README
2. Review the troubleshooting section
3. Check the browser console for errors
4. Verify your configuration settings

---

**🎉 Enjoy your self-hosted Bluesky analytics dashboard!**