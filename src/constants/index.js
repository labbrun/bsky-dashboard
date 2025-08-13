// Application Constants
// Centralized constants for navigation, metrics, time ranges, messages, and thresholds

// Navigation Items
export const NAVIGATION_ITEMS = [
  { 
    name: 'Overview', 
    path: '/overview', 
    icon: 'LayoutDashboard',
    badge: null,
    description: 'Dashboard overview and key metrics'
  },
  { 
    name: 'Performance', 
    path: '/performance', 
    icon: 'TrendingUp',
    badge: null,
    description: 'Content and engagement performance'
  },
  { 
    name: 'Insights', 
    path: '/insights', 
    icon: 'Lightbulb',
    badge: 'New',
    badgeColor: 'success',
    description: 'AI-powered analytics insights'
  },
];

// Metric Types
export const METRIC_TYPES = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
  POSTS: 'posts',
  ENGAGEMENT: 'engagement',
  LIKES: 'likes',
  REPLIES: 'replies',
  REPOSTS: 'reposts',
};

// Time Ranges
export const TIME_RANGES = {
  TODAY: 'today',
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '90d',
  YEAR: '365d',
  ALL: 'all',
};

// Celebration Thresholds
export const CELEBRATION_THRESHOLDS = {
  followers: [100, 500, 1000, 5000, 10000, 50000, 100000],
  posts: [100, 500, 1000, 5000, 10000],
  likes: [1000, 5000, 10000, 50000, 100000],
};

// Error Messages
export const ERROR_MESSAGES = {
  API_CONNECTION: 'Unable to connect to Bluesky API. Please try again later.',
  AUTH_FAILED: 'Authentication failed. Please check your credentials.',
  DATA_FETCH: 'Failed to fetch data. Please refresh the page.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  DATA_SYNCED: 'Data synced to database',
  PROFILE_UPDATED: 'Profile updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
};