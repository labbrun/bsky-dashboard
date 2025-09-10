// Application Configuration
export const APP_CONFIG = {
  // Application Info
  app: {
    name: process.env.REACT_APP_NAME || 'Bsky Dashboard',
    mode: process.env.REACT_APP_MODE || 'local', // local, cloud, demo
    debug: process.env.REACT_APP_DEBUG === 'true',
  },

  // API Configuration
  api: {
    blueskyBaseUrl: 'https://public.api.bsky.app',
    defaultHandle: process.env.REACT_APP_BLUESKY_HANDLE || 'bsky.app',
    maxRetries: 3,
    retryDelay: 1000,
    
    // Trend Analysis APIs (Optional)
    google: {
      customSearchApiKey: process.env.REACT_APP_GOOGLE_CSE_API_KEY || '',
      searchEngineId: process.env.REACT_APP_GOOGLE_CSE_ID || '',
      baseUrl: 'https://customsearch.googleapis.com/customsearch/v1'
    },
    
    // LinkedIn Integration (Optional)
    linkedin: {
      clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET || '',
      baseUrl: 'https://api.linkedin.com/v2',
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization'
    },

    // Postiz Integration (Optional)
    postiz: {
      url: process.env.REACT_APP_POSTIZ_URL || '',
      apiKey: process.env.REACT_APP_POSTIZ_API_KEY || ''
    }
  },

  // Database Configuration
  database: {
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    // If Supabase credentials are not provided, app runs in local-only mode
    enabled: !!(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY)
  },
  
  // Authentication
  auth: {
    storageKey: 'bluesky-analytics-logged-in',
    // No fallback password - must be set via environment or user setup
    password: process.env.REACT_APP_AUTH_PASSWORD || null,
  },
  
  // UI Configuration
  ui: {
    sidebarWidth: {
      open: 'w-80',
      closed: 'w-20',
    },
    transitionDuration: 300,
    celebrationDuration: 5000,
  },
  
  // Chart Configuration
  charts: {
    colors: {
      primary: '#002945',
      brand: '#2B54BE',
      accent: '#3A5393',
      electric: '#0E4CE8',
      slate: '#3B4869',
      success: '#23B26A',
      warning: '#F79009',
      error: '#F04438',
    },
    defaultHeight: 300,
  },
  
  // Data Refresh
  refresh: {
    interval: parseInt(process.env.REACT_APP_REFRESH_INTERVAL) || 300000, // 5 minutes default
    enabled: parseInt(process.env.REACT_APP_REFRESH_INTERVAL) > 0,
  },

  // Feature Flags
  features: {
    googleAnalytics: !!process.env.REACT_APP_GOOGLE_CSE_API_KEY,
    linkedinIntegration: !!process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    postizIntegration: !!process.env.REACT_APP_POSTIZ_URL,
    databaseStorage: !!(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY),
  }
};

export default APP_CONFIG;