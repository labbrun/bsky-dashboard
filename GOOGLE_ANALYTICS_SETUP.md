# Google Analytics Integration Setup

This guide explains how to set up **automatic, permanent** Google Analytics authentication for the Bluesky Analytics Dashboard.

## 🚀 Quick Start (Automatic Token Refresh)

**Your service account is already configured!** Just run the token server:

### Option 1: Use Startup Scripts (Easiest)

**Windows:**
```bash
start-all.bat
```

**Mac/Linux:**
```bash
./start-all.sh
```

### Option 2: Manual Start

**Terminal 1 (Token Server):**
```bash
cd server
npm start
```

**Terminal 2 (React App):**
```bash
npm start
```

## ✅ What This Gives You

- **Permanent Authentication**: Tokens auto-refresh every 55 minutes
- **No Manual Token Management**: Set it and forget it
- **Real Google Analytics Data**: Live traffic data, not mock data
- **Automatic Fallback**: Falls back gracefully if token server is down

## 🔍 How It Works

1. **Token Server** (`localhost:3001`): Generates fresh Google Analytics tokens using your service account
2. **Auto Refresh**: Tokens cached for 55 minutes, then automatically renewed
3. **React App** (`localhost:3000`): Fetches tokens from server as needed
4. **Fallback**: If server unavailable, can use manual token from `.env`

## 📊 Verification

Once both servers are running, you should see:

### In Blog Performance Page:
- ✅ **"Live GA Data"** badge (not "Mock Data")
- 📈 Real traffic charts with your actual data
- 🔗 Actual referral sources from your website

### In Browser Console:
```
🔄 Fetching Google Analytics token from server...
✅ Got fresh Google Analytics token (expires in 55 min)
```

## 🛠 Configuration

### Property ID
Currently set to `properties/358836912`. If this isn't your property:

1. Open `src/services/googleAnalyticsService.js`
2. Update line 4:
   ```javascript
   const GA_PROPERTY_ID = 'properties/YOUR_PROPERTY_ID';
   ```

### Manual Token Override
Add to `.env` if you want to bypass the token server:
```bash
REACT_APP_GOOGLE_ACCESS_TOKEN=your-manual-token
```

## 🔐 Security Notes

- ✅ Service account credentials secured in dedicated server
- ✅ Tokens never stored in React app environment
- ✅ Automatic token rotation prevents expiration
- ✅ CORS configured for localhost only

## 🚨 Troubleshooting

### Still Seeing "Mock Data"?

1. **Check token server is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check React console for errors:**
   - Press F12 → Console tab
   - Look for token fetch errors

3. **Restart both servers:**
   - Stop both servers (Ctrl+C)
   - Run startup script again

### Token Server Issues

**Port 3001 in use:**
```bash
# Kill process using port 3001
npx kill-port 3001
# Then restart
cd server && npm start
```

**Dependencies missing:**
```bash
cd server
npm install
```

## 📁 File Structure

```
├── server/
│   ├── tokenServer.js      # Automatic token generation
│   ├── package.json        # Server dependencies
│   └── node_modules/       # Server dependencies
├── src/services/
│   └── googleAnalyticsService.js  # Updated with token server integration
├── start-all.bat          # Windows startup script
├── start-all.sh           # Mac/Linux startup script
└── GOOGLE_ANALYTICS_SETUP.md     # This file
```

## 🚀 Production Deployment

For production:

1. **Deploy token server** to your hosting platform
2. **Update TOKEN_SERVER_URL** in `googleAnalyticsService.js`
3. **Add service account env vars** to production environment
4. **Set up monitoring** for token server health

## 📊 API Limits

Google Analytics Reporting API limits:
- 100 requests per 100 seconds per user  
- 10 requests per second
- Token server handles rate limiting automatically