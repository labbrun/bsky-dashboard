// Application Configuration
export const APP_CONFIG = {
  // API Configuration
  api: {
    blueskyBaseUrl: 'https://public.api.bsky.app',
    defaultHandle: 'labb.run',
    maxRetries: 3,
    retryDelay: 1000,
  },
  
  // Authentication
  auth: {
    storageKey: 'labb-analytics-logged-in',
    password: process.env.REACT_APP_AUTH_PASSWORD || 'dev-password-2025', // Use environment variable in production
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
    interval: 300000, // 5 minutes in milliseconds
    enabled: false, // Set to true to enable auto-refresh
  },
};

export default APP_CONFIG;