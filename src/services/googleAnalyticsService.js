// Google Analytics Service
// Integrates with Google Analytics 4 to fetch blog traffic data

const GA_PROPERTY_ID = 'properties/358836912';
const GA_BASE_URL = 'https://analyticsdata.googleapis.com/v1beta';

// Token Server Configuration
const TOKEN_SERVER_URL = 'http://localhost:3001';
let accessToken = null;
let tokenExpiration = null;

// Get fresh access token from token server
const getTokenFromServer = async () => {
  try {
    console.log('🔄 Fetching Google Analytics token from server...');
    const response = await fetch(`${TOKEN_SERVER_URL}/api/token`);
    
    if (!response.ok) {
      throw new Error(`Token server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.access_token) {
      accessToken = data.access_token;
      tokenExpiration = Date.now() + (data.expires_in * 1000);
      
      console.log(`✅ Got ${data.cached ? 'cached' : 'fresh'} Google Analytics token (expires in ${Math.floor(data.expires_in/60)} min)`);
      return true;
    } else {
      throw new Error(data.error || 'No access token in response');
    }
  } catch (error) {
    console.warn('❌ Token server unavailable:', error.message);
    return false;
  }
};

// Check for manual environment token fallback
const checkEnvironmentToken = () => {
  const envToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
  if (envToken) {
    accessToken = envToken;
    tokenExpiration = Date.now() + (50 * 60 * 1000); // Assume 50 min validity
    console.log('📱 Using manual Google Analytics token from environment');
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

// Ensure we have a valid access token
const ensureValidToken = async () => {
  // If current token is valid, use it
  if (isTokenValid()) {
    return true;
  }
  
  // Try to get token from server first
  if (await getTokenFromServer()) {
    return true;
  }
  
  // Fallback to environment token
  if (checkEnvironmentToken()) {
    return true;
  }
  
  console.warn('❌ No Google Analytics authentication available. Using mock data.');
  console.warn('💡 Start token server: cd server && npm start');
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
  const authenticated = await ensureValidToken();
  if (!authenticated) {
    return { 
      connected: false, 
      message: 'Google Analytics authentication failed. Using mock data.' 
    };
  }

  try {
    const response = await fetch(`${GA_BASE_URL}/${GA_PROPERTY_ID}:runReport`, {
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
  const authenticated = await ensureValidToken();
  if (!authenticated) {
    // Return mock data when credentials not available
    return generateMockTrafficData(days);
  }

  try {
    // Add timeout to prevent hanging API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${GA_BASE_URL}/${GA_PROPERTY_ID}:runReport`, {
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
    console.warn('Traffic overview error, using mock data:', error.message);
    // Fallback to mock data on error
    return generateMockTrafficData(days);
  }
};

// Get referral traffic from Bluesky and other sources
export const getReferralTraffic = async (days = 30) => {
  const authenticated = await ensureValidToken();
  if (!authenticated) {
    return generateMockReferralData(days);
  }

  try {
    // Add timeout to prevent hanging API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${GA_BASE_URL}/${GA_PROPERTY_ID}:runReport`, {
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
    console.warn('Referral traffic error, using mock data:', error.message);
    return generateMockReferralData(days);
  }
};

// Get top performing blog posts
export const getTopBlogPosts = async (days = 30) => {
  const authenticated = await ensureValidToken();
  if (!authenticated) {
    return generateMockTopPostsData();
  }

  try {
    const response = await fetch(`${GA_BASE_URL}/${GA_PROPERTY_ID}:runReport`, {
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
    console.warn('Top posts error, using mock data:', error.message);
    return generateMockTopPostsData();
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

// Generate mock data when GA credentials not available
const generateMockTrafficData = (days) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      sessions: Math.floor(Math.random() * 150) + 50,
      users: Math.floor(Math.random() * 120) + 40,
      pageviews: Math.floor(Math.random() * 300) + 100,
      bounceRate: Math.random() * 30 + 45,
      avgSessionDuration: Math.random() * 200 + 120
    });
  }
  return data;
};

const generateMockReferralData = (days) => {
  return [
    { source: 'google', medium: 'organic', sessions: 245, users: 198, displayName: 'Google', isBluesky: false, isSearch: true, isSocial: false },
    { source: 'bsky.app', medium: 'referral', sessions: 67, users: 52, displayName: 'Bluesky', isBluesky: true, isSearch: false, isSocial: true },
    { source: 'twitter', medium: 'social', sessions: 34, users: 29, displayName: 'Twitter', isBluesky: false, isSearch: false, isSocial: true },
    { source: '(direct)', medium: '(none)', sessions: 89, users: 76, displayName: 'Direct', isBluesky: false, isSearch: false, isSocial: false },
    { source: 'linkedin', medium: 'social', sessions: 23, users: 19, displayName: 'LinkedIn', isBluesky: false, isSearch: false, isSocial: true }
  ];
};

const generateMockTopPostsData = () => {
  return [
    {
      path: '/ai-privacy-fundamentals/',
      title: 'AI Privacy Fundamentals: Building Secure Systems',
      pageviews: 1247,
      uniquePageviews: 1156,
      avgTimeOnPage: 245,
      bounceRate: 23.4,
      url: 'https://labb.run/ai-privacy-fundamentals/'
    },
    {
      path: '/homelab-security-guide/',
      title: 'Complete Homelab Security Guide',
      pageviews: 892,
      uniquePageviews: 834,
      avgTimeOnPage: 312,
      bounceRate: 18.7,
      url: 'https://labb.run/homelab-security-guide/'
    },
    {
      path: '/productivity-automation-tools/',
      title: 'Productivity Automation Tools for Developers',
      pageviews: 634,
      uniquePageviews: 598,
      avgTimeOnPage: 189,
      bounceRate: 31.2,
      url: 'https://labb.run/productivity-automation-tools/'
    }
  ];
};

const googleAnalyticsService = {
  testGAConnection,
  getBlogTrafficOverview,
  getReferralTraffic,
  getTopBlogPosts,
  setAccessToken
};

export default googleAnalyticsService;