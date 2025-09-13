/**
 * Services Index
 * Central export point for all services to simplify imports
 * @module services
 */

// Core API Services
export { getProfile, getFollowers, getAuthorFeed } from './blueskyService';
export { getCredentials, saveCredentials, isServiceConfigured } from './credentialsService';
export { default as logger } from './loggingService';

// Analytics Services
export { getPerformanceAnalytics } from './analyticsService';
export { getComprehensiveBlogAnalytics } from './blogAnalyticsService';
export { getBlogTrafficOverview, getReferralTraffic } from './googleAnalyticsService';

// AI & Content Services
export { getAIContext } from './aiContextProvider';
export { AIInsightsGenerator } from './aiInsightsService';
export { analyzeAndRepurposeBlogContent } from './enhancedContentRepurposingService';

// Data Services
export { fetchProfileData } from './profileService';
export { getRSSFeedData } from './rssService';
export { saveUserSettings, getUserSettings } from './supabaseService';

// Utility Services
export { TrendAnalysisService } from './trendAnalysisService';

// Error Handling
export * from '../utils/errorUtils';

// Custom Hooks
export { useAsyncOperation, useMultipleAsyncOperations } from '../hooks/useAsyncOperation';