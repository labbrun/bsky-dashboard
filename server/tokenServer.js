// Google Analytics Token Server
// Simple Express server to generate Google Analytics tokens server-side
// This solves the browser JWT signing limitation

const express = require('express');
const crypto = require('crypto');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Service account credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": "bsky-analytics",
  "private_key_id": "076307478b6b449290367f7662abf772e3d02c62",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDzM3A2ye5cv3Ux\nddrGZPprQcn4hCp3PIoowYYBkCea8hZxUWKP417qyH22cEX2QbzrS+r7hha3JZKT\n7wNppdwFO4hC0nEyaofOguN25eAJkv46X2XBwyzV9jI/4W6g878UOFLkD/fJCntQ\nyikxVdrWJjggri/1RL1TfV+xau3cQ6VUkAEsxhQAVOFs6gdCTb8qltendxLnhwz/\n4FwC7yCq5ZuPmfhSKmzw3Z8T/OdfuKOskd5gpvfs0IIXwh1AQcAXG36qIbkxjSyn\nLmtDJfQ9SiurO8gocru+nU+UU/Y2b7/JghWHvT8mUJJ0ZbzsKmjlRX7kw+I89xzi\nTpoOIr6VAgMBAAECggEAKcUT6NUV02guwKf1Q03klLdf8QcCJCiJsiZK1cnkg4BA\nyoWn3/61Nq3oqYTu/zSbNe58FWcaT6psWmwasfKCr4NiC9gJCRey640fdDRXHk3Y\nzD3GRFk5QiZeywn07j/u+ZIS6oizjhv2whF2sbqFM3KtAS/pnL6JpeVKojYzVDkU\nV9Mze9pQRo2Bb5M0+8HQV9uYZQ+hI4V9DZgvXTK2vMxbY5dqxVn+yrgO/I38RzyI\nr3uceZ4GHWXvoLWzMzEsg/kv0yxazbqQItjk9mTEjCJC5pSrpw9EUkaRmY91e1bQ\nsGXOkpVfsGTm6kU5c/M2gi9PyGNPRE3cAr7JS0zUAQKBgQD/oufhxPh+uiCyvAaE\npuVS4IUA6HUK/lNH8br/923VOMwiUKLQcLOA8ox3+7lALx7Hf6aTmHTsseteVCxk\nVR/Z32/bQAMeTsZTKHbJSEPvnYzW2HFq/v5FrYmDfm+ve7+auFMYiK1UWFJo1M37\nSIQwXPhcdB8p+2rzoGELECa6NQKBgQDzjAEFC2yC4LpHI2j0ti54cRlK/t70vBxJ\nFDaIIr8/z+n7KFcUTcv6n7sB32IziNO4mre2AxbwloEi4pOhynbgGJwWH8o6OXGQ\nl814gx9Ed45pLq8FYOHqqPAMIMjS8nK8pa/UmFqlWfznmGcXfeFMPe80darp77yN\nUJoigQd+4QKBgDtCMC6N0mzOCLZmD7zAU3iawzoqqLcbrYKH7qlXWgaLXAa4WoWn\nGnVRxG4r1A2k3qWwWZTtSm1z8PO033WCpheDTBKvDAoCiMbOInsWXWk2RGepVOFQ\nqvDMAYyRyqILNadQAzM0u7lJoBDdA8K0VLBBXPFRmcfJmElRbC18WP3hAoGBAKb6\nlXRk+bfd5jmB8KLfCYtwV5wQlMKM+oOsRRsfX6qbnVuis9lq4XBq9Wd6RbT5mdeW\n1GAJTEAVoGJPoFKsIsbQeKu+jgNPgSpWufxnQhfKNKyu4ja4zwv5WeOm0qm2qq3m\nl2AWOQfnY7tRxVTY7JA+YnPAPTd5M/hbi+IePwphAoGABhlhqxaYZsWd00H1liYl\nKNi3r+fCwvy7fCIeeXa/mJOztMHv5K9u96/KqZgE+1xah7ODhMTfyykfwyrpvw9B\ncv3NVif4A9tFqTbokV/H2O92oepHfZNRMyMLjqak0daCBmacMI9xePwaoVyXatJI\nRcDd6i7cZY1DeTWyyg6HnhY=\n-----END PRIVATE KEY-----\n",
  "client_email": "bksy-analytics@bsky-analytics.iam.gserviceaccount.com",
  "client_id": "105938020616615630117"
};

// Token cache
let tokenCache = {
  token: null,
  expires: null
};

// Create JWT token
function createJWT() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, // 1 hour expiration
    iat: now
  };

  // Create JWT header
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  // Base64URL encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), {
    key: serviceAccount.private_key,
    padding: crypto.constants.RSA_PKCS1_PADDING
  });
  
  const encodedSignature = signature.toString('base64url');
  
  return `${signatureInput}.${encodedSignature}`;
}

// Exchange JWT for access token
async function getAccessTokenFromGoogle() {
  return new Promise((resolve, reject) => {
    const jwt = createJWT();
    
    const postData = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve({
              token: response.access_token,
              expires_in: response.expires_in,
              expires_at: Date.now() + (response.expires_in * 1000)
            });
          } else {
            reject(new Error(response.error_description || 'Failed to get access token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Get cached or fresh token
async function getValidToken() {
  const now = Date.now();
  const buffer = 5 * 60 * 1000; // 5 minute buffer
  
  // Return cached token if still valid
  if (tokenCache.token && tokenCache.expires && tokenCache.expires > (now + buffer)) {
    return {
      token: tokenCache.token,
      cached: true,
      expires_in: Math.floor((tokenCache.expires - now) / 1000)
    };
  }
  
  // Generate new token
  console.log('Generating new Google Analytics access token...');
  const tokenData = await getAccessTokenFromGoogle();
  
  // Cache the token
  tokenCache.token = tokenData.token;
  tokenCache.expires = tokenData.expires_at;
  
  return {
    token: tokenData.token,
    cached: false,
    expires_in: tokenData.expires_in
  };
}

// API Routes

// Get access token
app.get('/api/token', async (req, res) => {
  try {
    const tokenData = await getValidToken();
    
    res.json({
      success: true,
      access_token: tokenData.token,
      expires_in: tokenData.expires_in,
      cached: tokenData.cached,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const now = Date.now();
  res.json({
    status: 'healthy',
    service: 'Google Analytics Token Server',
    uptime: process.uptime(),
    token_cached: !!tokenCache.token,
    token_expires: tokenCache.expires ? new Date(tokenCache.expires) : null,
    token_valid: tokenCache.expires ? tokenCache.expires > now : false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Google Analytics Token Server running on http://localhost:${PORT}`);
  console.log(`📧 Service Account: ${serviceAccount.client_email}`);
  console.log(`🔄 Tokens will auto-refresh every ~55 minutes`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Token endpoint: http://localhost:${PORT}/api/token`);
});