// Google Analytics Service
// Integrates with Google Analytics 4 to fetch blog traffic data using Service Account

import logger from './loggingService';
import { getServiceCredentials } from './credentialsService';

const GA_BASE_URL = 'https://analyticsdata.googleapis.com/v1beta';

// Service Account JWT token generation
let accessToken = null;
let tokenExpiration = null;

// Check if Google Analytics is properly configured
const checkGAConfiguration = async () => {
  try {
    const gaCredentials = await getServiceCredentials('googleAnalytics');

    if (!gaCredentials.serviceAccountEmail || !gaCredentials.serviceAccountKey || !gaCredentials.propertyId) {
      return {
        configured: false,
        error: 'Google Analytics Service Account not configured. Please configure it in Settings → Google Analytics.'
      };
    }

    return {
      configured: true,
      propertyId: `properties/${gaCredentials.propertyId}`,
      serviceAccountEmail: gaCredentials.serviceAccountEmail
    };
  } catch (error) {
    return {
      configured: false,
      error: `Error checking Google Analytics configuration: ${error.message}`
    };
  }
};

// Check for manual environment token fallback
const checkEnvironmentToken = () => {
  const envToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
  if (envToken) {
    accessToken = envToken;
    tokenExpiration = Date.now() + (50 * 60 * 1000); // Assume 50 min validity
    logger.info('Using manual Google Analytics token from environment');
    return true;
  }
  return false;
};

// Check if current token is still valid (with 5 minute buffer)
const isTokenValid = () => {
  if (!accessToken || !tokenExpiration) {
    return false;
  }
  
  const now = Date.now();
  const buffer = 5 * 60 * 1000; // 5 minute buffer
  return tokenExpiration > (now + buffer);
};

// Get access token using service account credentials
const getTokenFromServiceAccount = async () => {
  try {
    const gaCredentials = await getServiceCredentials('googleAnalytics');

    if (!gaCredentials.serviceAccountEmail || !gaCredentials.serviceAccountKey) {
      return false;
    }

    // For simplicity, this would normally use JWT to authenticate
    // For now, we'll assume the serviceAccountKey is already an access token
    // In a production app, you'd implement proper JWT-based service account auth
    accessToken = gaCredentials.serviceAccountKey;
    tokenExpiration = Date.now() + (55 * 60 * 1000); // 55 minutes validity

    logger.info('Using Google Analytics service account authentication');
    return true;
  } catch (error) {
    logger.error('Service account authentication failed:', error);
    return false;
  }
};

// Ensure we have a valid access token
const ensureValidToken = async () => {
  // If current token is valid, use it
  if (isTokenValid()) {
    return true;
  }

  // Try to get token from service account first
  if (await getTokenFromServiceAccount()) {
    return true;
  }

  // Fallback to environment token
  if (checkEnvironmentToken()) {
    return true;
  }

  console.warn('❌ No Google Analytics authentication available.');
  console.warn('💡 Configure Google Analytics Service Account in Settings');
  return false;
};

// Legacy function for compatibility
export const authenticateWithServiceAccount = async () => {
  return await ensureValidToken();
};

// Set access token (legacy method for compatibility)
export const setAccessToken = (token) => {
  accessToken = token;
};

// Test GA API connection
export const testGAConnection = async () => {
  // Check configuration first
  const config = await checkGAConfiguration();
  if (!config.configured) {
    return {
      connected: false,
      message: config.error
    };
  }

  const authenticated = await ensureValidToken();
  if (!authenticated) {
    return {
      connected: false,
      message: 'Google Analytics authentication failed. Please check your service account credentials.'
    };
  }

  try {
    const response = await fetch(`${GA_BASE_URL}/${config.propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }],
        dimensions: [{ name: 'date' }]
      })
    });

    if (response.ok) {
      return { connected: true, message: 'Google Analytics API connected successfully' };
    } else {
      const errorText = await response.text();
      return { connected: false, message: `GA API error: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { connected: false, message: `GA connection error: ${error.message}` };
  }
};

// Get blog traffic overview data
export const getBlogTrafficOverview = async (days = 30) => {
  // Check configuration first
  const config = await checkGAConfiguration();
  if (!config.configured) {
    throw new Error(config.error);
  }

  const authenticated = await ensureValidToken();
  if (!authenticated) {
    // Return empty data when credentials not available
    throw new Error('Google Analytics authentication failed. Please check your service account credentials.');
  }

  try {
    // Add timeout to prevent hanging API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${GA_BASE_URL}/${config.propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' }
        ],
        dimensions: [{ name: 'date' }]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('GA traffic overview failed:', response.status, errorText);
      throw new Error(`GA API error: ${response.status}`);
    }

    const data = await response.json();
    return processTrafficDataGA4(data);
  } catch (error) {
    console.warn('Traffic overview error:', error.message);
    // Throw error instead of returning mock data
    throw new Error(`Failed to fetch Google Analytics traffic data: ${error.message}`);
  }
};

// Get referral traffic from Bluesky and other sources
export const getReferralTraffic = async (days = 30) => {
  // Check configuration first
  const config = await checkGAConfiguration();
  if (!config.configured) {
    throw new Error(config.error);
  }

  const authenticated = await ensureValidToken();
  if (!authenticated) {
    throw new Error('Google Analytics authentication failed. Please check your service account credentials.');
  }

  try {
    // Add timeout to prevent hanging API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${GA_BASE_URL}/${config.propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' }
        ],
        dimensions: [
          { name: 'sessionSource' },
          { name: 'sessionMedium' }
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('GA referral traffic failed:', response.status, errorText);
      throw new Error(`GA API error: ${response.status}`);
    }

    const data = await response.json();
    return processReferralDataGA4(data);
  } catch (error) {
    console.warn('Referral traffic error:', error.message);
    throw new Error(`Failed to fetch Google Analytics referral data: ${error.message}`);
  }
};

// Get top performing blog posts
export const getTopBlogPosts = async (days = 30) => {
  // Check configuration first
  const config = await checkGAConfiguration();
  if (!config.configured) {
    throw new Error(config.error);
  }

  const authenticated = await ensureValidToken();
  if (!authenticated) {
    throw new Error('Google Analytics authentication failed. Please check your service account credentials.');
  }

  try {
    const response = await fetch(`${GA_BASE_URL}/${config.propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageTimeOnPage' },
          { name: 'bounceRate' }
        ],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'PARTIAL_REGEXP',
              value: '^/[^?]*/$' // Blog post URLs typically end with /
            }
          }
        },
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('GA top posts failed:', response.status, errorText);
      throw new Error(`GA API error: ${response.status}`);
    }

    const data = await response.json();
    return processTopPostsDataGA4(data);
  } catch (error) {
    console.warn('Top posts error:', error.message);
    throw new Error(`Failed to fetch Google Analytics top posts data: ${error.message}`);
  }
};

// Process GA4 traffic data response
const processTrafficDataGA4 = (gaResponse) => {
  const rows = gaResponse.rows || [];

  const trafficData = rows.map(row => {
    const date = row.dimensionValues[0].value;
    const metrics = row.metricValues;
    
    return {
      date: formatGADate(date),
      sessions: parseInt(metrics[0].value) || 0,
      users: parseInt(metrics[1].value) || 0,
      pageviews: parseInt(metrics[2].value) || 0,
      bounceRate: parseFloat(metrics[3].value) || 0,
      avgSessionDuration: parseFloat(metrics[4].value) || 0
    };
  });

  return trafficData;
};

// Legacy GA Universal Analytics processor removed - using GA4 only

// Process GA4 referral data response
const processReferralDataGA4 = (gaResponse) => {
  const rows = gaResponse.rows || [];

  return rows.map(row => {
    const source = row.dimensionValues[0].value;
    const medium = row.dimensionValues[1].value;
    const sessions = parseInt(row.metricValues[0].value) || 0;
    const users = parseInt(row.metricValues[1].value) || 0;
    
    return {
      source,
      medium,
      sessions,
      users,
      displayName: source === '(direct)' ? 'Direct' : source,
      isBluesky: source.includes('bsky') || source.includes('bluesky'),
      isSearch: medium === 'organic',
      isSocial: medium === 'social' || ['twitter', 'facebook', 'linkedin', 'bsky', 'bluesky'].includes(source)
    };
  });
};

// Legacy GA Universal Analytics processor removed - using GA4 only

// Process GA4 top posts data
const processTopPostsDataGA4 = (gaResponse) => {
  const rows = gaResponse.rows || [];

  return rows.map(row => {
    const path = row.dimensionValues[0].value;
    const title = row.dimensionValues[1].value;
    const pageviews = parseInt(row.metricValues[0].value) || 0;
    const timeOnPage = parseFloat(row.metricValues[1].value) || 0;
    const bounceRate = parseFloat(row.metricValues[2].value) || 0;
    
    return {
      path,
      title,
      pageviews,
      uniquePageviews: pageviews, // GA4 doesn't distinguish unique pageviews
      avgTimeOnPage: timeOnPage,
      bounceRate,
      url: `https://labb.run${path}`
    };
  });
};

// Legacy GA Universal Analytics processor removed - using GA4 only

// Format GA date (YYYYMMDD) to readable format
const formatGADate = (gaDate) => {
  // const year = gaDate.substring(0, 4); // Not used in current format
  const month = gaDate.substring(4, 6);
  const day = gaDate.substring(6, 8);
  return `${month}/${day}`;
};

// No mock data generators - use only real data from Google Analytics API

const googleAnalyticsService = {
  testGAConnection,
  getBlogTrafficOverview,
  getReferralTraffic,
  getTopBlogPosts,
  setAccessToken
};

export default googleAnalyticsService;