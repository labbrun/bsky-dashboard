# Google Analytics Setup Guide

Your Google Analytics Property ID is already configured: **358836912**

## To Get Real Google Analytics Data:

### Option 1: Service Account (Recommended)
1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**: Create a new project or use existing
3. **Enable API**: Enable "Google Analytics Reporting API"
4. **Create Service Account**:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Name it something like "bluesky-analytics"
   - Download the JSON key file
5. **Grant Access**:
   - In Google Analytics, go to Admin → Property Access Management
   - Add the service account email as a "Viewer"

### Option 2: OAuth (Alternative)
1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create OAuth Credentials**:
   - Go to APIs & Credentials
   - Create OAuth 2.0 Client ID
   - Add http://localhost:3000 as authorized origin
3. **Get Client ID and Secret**

## Current Status:
- ✅ **Property ID**: 358836912 (configured)
- ❌ **API Credentials**: Not set up yet
- ⚠️ **Fallback**: Using mock data until credentials are configured

## What Happens Now:
- **RSS Feed**: Will load your real blog posts from https://labb.run/feed/
- **Google Analytics**: Uses realistic mock data until you set up credentials
- **AI Analysis**: Works with real blog content using your guidance assets

## After Setup:
1. Create `.env.local` file in project root with:
```
REACT_APP_GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json_here
# OR for OAuth:
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_client_secret
```

2. The app will automatically switch from mock to real GA data.

## For Now:
The Blog Performance page will show:
- ✅ **Real blog posts** from your RSS feed
- ✅ **Real AI analysis** of your content alignment
- ✅ **Real repurposing suggestions** based on your strategies
- ⚠️ **Mock traffic data** (realistic patterns) until GA is connected