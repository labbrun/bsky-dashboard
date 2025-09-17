/**
 * Credentials Service
 * Manages API credentials and validation for all integrations
 * @module credentialsService
 */

import logger from './loggingService';

const STORAGE_KEY = 'bluesky-analytics-settings';

/**
 * Backs up credentials to database if Supabase is configured
 * @private
 * @param {Object} credentials - The credentials to backup
 * @throws {Error} When backup fails
 */
const backupCredentialsToDatabase = async (credentials) => {
  // Only attempt backup if Supabase is configured
  const supabaseConfig = credentials.database;
  if (!supabaseConfig?.supabaseUrl || !supabaseConfig?.supabaseAnonKey) {
    return; // Skip backup if no database configured
  }
  
  try {
    // Import Supabase service dynamically to avoid circular dependencies
    const { saveUserSettings } = await import('./supabaseService');
    
    // Create a sanitized copy without sensitive database credentials for backup
    const backupData = {
      ...credentials,
      database: {
        // Don't backup the database credentials themselves
        configured: true,
        lastBackup: new Date().toISOString()
      }
    };
    
    await saveUserSettings('credentials_backup', backupData);
  } catch (error) {
    throw error; // Re-throw to be caught by calling function
  }
};

/**
 * Retrieves all saved credentials from database first, then localStorage as fallback
 * @returns {Promise<Object>} Object containing all saved credentials or empty object if none found
 */
export const getCredentials = async () => {
  try {
    // First try to get from database if Supabase is configured
    const localCredentials = getLocalCredentials();
    const supabaseConfig = localCredentials.database;

    if (supabaseConfig?.supabaseUrl && supabaseConfig?.supabaseAnonKey) {
      try {
        const { getUserSettings } = await import('./supabaseService');
        const result = await getUserSettings('credentials_backup');

        if (result.success && result.data) {
          // Merge database credentials with local ones (local takes precedence for database config)
          return {
            ...result.data,
            database: localCredentials.database // Keep local database config
          };
        }
      } catch (error) {
        console.warn('Failed to load credentials from database, using localStorage:', error.message);
      }
    }

    // Fallback to localStorage
    return localCredentials;
  } catch (error) {
    logger.error('Failed to load credentials', error);
    return {};
  }
};

/**
 * Retrieves credentials from localStorage only
 * @returns {Object} Object containing all saved credentials or empty object if none found
 */
export const getLocalCredentials = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    logger.error('Failed to load local credentials', error);
    return {};
  }
};

/**
 * Saves credentials to localStorage and optionally backs them up to database
 * @param {Object} credentials - The credentials object to save
 * @returns {Promise<void>}
 * @throws {Error} When save operation fails
 */
export const saveCredentials = async (credentials) => {
  try {
    // Get existing credentials first to merge with new ones
    const existing = await getCredentials();
    
    // Deep merge the credentials to preserve existing sections
    const merged = {
      ...existing,
      ...credentials,
      // Ensure nested objects are properly merged
      profile: {
        ...existing.profile,
        ...credentials.profile
      }
    };
    
    // Merge each service section properly
    Object.keys(credentials).forEach(service => {
      if (service !== 'profile' && typeof credentials[service] === 'object') {
        merged[service] = {
          ...existing[service],
          ...credentials[service]
        };
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Create auto backup whenever settings are saved
    try {
      const { createAutoBackup } = await import('../utils/settingsBackup');
      createAutoBackup();
    } catch (error) {
      // Don't fail the save operation if auto backup fails
      console.warn('Auto backup failed:', error);
    }

    // Optionally backup to database if Supabase is configured
    try {
      await backupCredentialsToDatabase(merged);
    } catch (error) {
      // Don't fail the save operation if database backup fails
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Get profile settings (keywords, preferences, etc.)
export const getProfileSettings = async () => {
  const credentials = await getCredentials();
  return credentials.profile || {
    keywords: [],
    displayName: '',
    bio: '',
    targetAudience: '',
    contentGoals: [],
    customAvatar: null,
    documents: {
      customerAvatar: null,
      targetAudience: null
    }
  };
};

// Save profile settings
export const saveProfileSettings = async (profileSettings) => {
  try {
    const credentials = await getCredentials();
    credentials.profile = profileSettings;
    return await saveCredentials(credentials);
  } catch (error) {
    return false;
  }
};

// Get specific service credentials
export const getServiceCredentials = async (service) => {
  const allCredentials = await getCredentials();
  return allCredentials[service] || {};
};

// Check if service is configured (synchronous, uses localStorage only)
export const isServiceConfigured = (service) => {
  const allCredentials = getLocalCredentials();
  const credentials = allCredentials[service] || {};

  switch (service) {
    case 'bluesky':
      return !!(credentials.handle && credentials.accessToken && credentials.refreshToken);
    
    case 'ai':
      return !!(credentials.apiKey || credentials.provider === 'local');
    
    case 'googleTrends':
      return !!(credentials.clientId && credentials.clientSecret);
    
    case 'googleAnalytics':
      return !!(credentials.serviceAccountEmail && credentials.serviceAccountKey && credentials.propertyId);
    
    case 'linkedin':
      return !!(credentials.clientId && credentials.clientSecret);
    
    case 'blog':
      const blogConfigured = !!(credentials.rssUrl);
      console.log('🔍 Blog credentials check:', {
        rssUrl: credentials.rssUrl,
        configured: blogConfigured,
        credentials: credentials
      });
      return blogConfigured;
    
    case 'postiz':
      return !!(credentials.url && credentials.apiKey);
    
    default:
      return false;
  }
};

// Validate database credentials
export const validateDatabaseCredentials = async (supabaseUrl, supabaseAnonKey) => {
  try {
    if (!supabaseUrl && !supabaseAnonKey) {
      return { valid: true, warning: 'Database not configured - running in local-only mode' };
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return { valid: false, error: 'Both Supabase URL and Anon Key are required' };
    }

    // Basic format validation
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      return { valid: false, error: 'Invalid Supabase URL format. Should be like: https://your-project.supabase.co' };
    }

    if (supabaseAnonKey.length < 100 || !supabaseAnonKey.startsWith('eyJ')) {
      return { valid: false, error: 'Invalid Supabase Anon Key format. Should be a JWT token starting with "eyJ"' };
    }

    // Test actual connection (basic ping)
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      
      if (!response.ok) {
        return { valid: false, error: 'Cannot connect to Supabase. Check your URL and key.' };
      }
      
      return { valid: true };
    } catch (fetchError) {
      return { valid: false, error: 'Network error connecting to Supabase' };
    }
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate Bluesky credentials
export const validateBlueskyCredentials = async (handle, accessToken, apiEndpoint, refreshToken) => {
  try {
    if (!handle || !accessToken) {
      return { valid: false, error: 'Handle and access token are required' };
    }

    if (!refreshToken) {
      return { valid: false, error: 'Refresh token is required for automatic token renewal' };
    }

    // Validate access token format (JWT tokens start with eyJ)
    if (!accessToken.startsWith('eyJ')) {
      return { valid: false, error: 'Access token should be a JWT token starting with "eyJ"' };
    }

    // Validate refresh token format (JWT tokens start with eyJ)
    if (!refreshToken.startsWith('eyJ')) {
      return { valid: false, error: 'Refresh token should be a JWT token starting with "eyJ"' };
    }

    // Validate API endpoint format if provided
    if (apiEndpoint && !apiEndpoint.startsWith('http://') && !apiEndpoint.startsWith('https://')) {
      return { valid: false, error: 'API endpoint must start with http:// or https://' };
    }

    // Basic format validation - allow any domain (Bluesky supports custom domains)
    if (!handle.includes('.')) {
      return { valid: false, error: 'Invalid handle format. Should be like: username.bsky.social or username.yourdomain.com' };
    }

    // Check for valid domain structure
    const parts = handle.split('.');
    if (parts.length < 2 || parts.some(part => part.length === 0)) {
      return { valid: false, error: 'Invalid handle format. Should be like: username.bsky.social or username.yourdomain.com' };
    }

    // Test actual API access with the token
    try {
      const endpoint = apiEndpoint || 'https://bsky.social/xrpc';
      const response = await fetch(`${endpoint}/app.bsky.actor.getProfile?actor=${handle}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          return { valid: false, error: 'Invalid access token. Please check your token.' };
        } else if (response.status === 400) {
          return { valid: false, error: 'Bad request. Check your handle format.' };
        } else {
          return { valid: false, error: errorData.message || `API request failed: ${response.statusText}` };
        }
      }

      const profileData = await response.json();

      return {
        valid: true,
        note: `Successfully connected to @${profileData.handle || handle}`,
        handle: profileData.handle || handle,
        displayName: profileData.displayName || 'Unknown'
      };

    } catch (fetchError) {
      return { valid: false, error: 'Network error. Check your internet connection and try again.' };
    }

  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate AI API credentials
export const validateAICredentials = async (provider, apiKey, baseUrl) => {
  try {
    if (provider === 'local') {
      if (!baseUrl) {
        return { valid: false, error: 'Base URL required for local AI' };
      }
      
      // Test local AI connection
      try {
        const response = await fetch(`${baseUrl}/models`, { 
          method: 'GET',
          timeout: 5000 
        });
        if (response.ok) {
          return { valid: true };
        } else {
          return { valid: false, error: 'Cannot connect to local AI server' };
        }
      } catch (error) {
        return { valid: false, error: 'Local AI server not accessible' };
      }
    }

    if (!apiKey) {
      return { valid: false, error: 'API key is required' };
    }

    // Validate API key format
    switch (provider) {
      case 'openai':
        if (!apiKey.startsWith('sk-')) {
          return { valid: false, error: 'OpenAI API key should start with sk-' };
        }
        break;
      
      case 'anthropic':
        if (!apiKey.startsWith('sk-ant-')) {
          return { valid: false, error: 'Anthropic API key should start with sk-ant-' };
        }
        break;
      
      case 'perplexity':
        if (!apiKey.startsWith('pplx-')) {
          return { valid: false, error: 'Perplexity API key should start with pplx-' };
        }
        break;
      
      default:
        // For other providers, skip format validation
        break;
    }

    return { valid: true };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate Google Trends credentials
export const validateGoogleTrendsCredentials = async (clientId, clientSecret) => {
  try {
    if (!clientId || !clientSecret) {
      return { valid: false, error: 'Both Client ID and Client Secret are required' };
    }

    // Validate Client ID format (Google OAuth client IDs have specific format)
    if (!clientId.includes('.apps.googleusercontent.com')) {
      return { valid: false, error: 'Invalid Client ID format. Should end with .apps.googleusercontent.com' };
    }

    // Validate Client Secret format
    if (!clientSecret.startsWith('GOCSPX-')) {
      return { valid: false, error: 'Invalid Client Secret format. Should start with GOCSPX-' };
    }

    // For Google Trends API, we can't easily test without going through full OAuth flow
    // But we can validate the credential format
    return { 
      valid: true, 
      note: 'Credentials format is correct. Google Trends will monitor your configured keywords for AI analysis.' 
    };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate Google Analytics credentials
export const validateGoogleAnalyticsCredentials = async (serviceAccountEmail, serviceAccountKey, propertyId) => {
  try {
    if (!serviceAccountEmail || !serviceAccountKey || !propertyId) {
      return { valid: false, error: 'Service Account Email, Private Key, and Property ID are required' };
    }

    // Validate Service Account Email format
    if (!serviceAccountEmail.includes('.iam.gserviceaccount.com')) {
      return { valid: false, error: 'Invalid Service Account Email format. Should end with .iam.gserviceaccount.com' };
    }

    // Validate Private Key format
    if (!serviceAccountKey.includes('-----BEGIN PRIVATE KEY-----')) {
      return { valid: false, error: 'Invalid Private Key format. Should start with -----BEGIN PRIVATE KEY-----' };
    }

    // Validate Property ID is numeric
    if (!/^\d+$/.test(propertyId)) {
      return { valid: false, error: 'Property ID should be numeric (e.g., 123456789)' };
    }

    // Basic validation passed - service account setup is much simpler than OAuth
    return { 
      valid: true, 
      note: 'Service Account credentials format is correct. Make sure the service account has Viewer access to your GA4 property.' 
    };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate RSS feed URL
export const validateBlogCredentials = async (rssUrl) => {
  try {
    if (!rssUrl) {
      return { valid: false, error: 'RSS URL is required' };
    }

    if (!rssUrl.startsWith('http://') && !rssUrl.startsWith('https://')) {
      return { valid: false, error: 'RSS URL must start with http:// or https://' };
    }

    // Import and test RSS feed using the RSS service
    const { testRSSConnection } = await import('./rssService');
    const result = await testRSSConnection(rssUrl);
    
    if (result.connected) {
      return { valid: true, note: result.message };
    } else {
      return { valid: false, error: result.message };
    }
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate LinkedIn credentials
export const validateLinkedInCredentials = async (clientId, clientSecret) => {
  try {
    if (!clientId || !clientSecret) {
      return { valid: false, error: 'Both Client ID and Client Secret are required' };
    }

    // Basic format validation (LinkedIn doesn't have strict format requirements)
    if (clientId.length < 10) {
      return { valid: false, error: 'Client ID appears to be too short' };
    }

    if (!clientSecret.startsWith('WPL_AP') && clientSecret.length < 20) {
      return { valid: false, error: 'Client Secret format appears invalid' };
    }

    // For LinkedIn, we can't test without OAuth flow, so basic validation only
    return { valid: true, note: 'Basic validation passed. Full validation requires OAuth flow.' };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate Postiz credentials
export const validatePostizCredentials = async (url, apiKey) => {
  try {
    if (!url || !apiKey) {
      return { valid: false, error: 'Both URL and API key are required' };
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }

    // Test Postiz API
    try {
      const response = await fetch(`${url}/api/health`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.ok) {
        return { valid: true };
      } else {
        return { valid: false, error: `Postiz API returned ${response.status}` };
      }
    } catch (error) {
      return { valid: false, error: 'Cannot connect to Postiz instance' };
    }
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate all credentials for a service
export const validateServiceCredentials = async (service, credentials) => {
  switch (service) {
    case 'bluesky':
      return validateBlueskyCredentials(credentials.handle, credentials.accessToken, credentials.apiEndpoint, credentials.refreshToken);
    
    case 'database':
      return validateDatabaseCredentials(credentials.supabaseUrl, credentials.supabaseAnonKey);
    
    case 'ai':
      return validateAICredentials(credentials.provider, credentials.apiKey, credentials.baseUrl);
    
    case 'googleTrends':
      return validateGoogleTrendsCredentials(credentials.clientId, credentials.clientSecret);
    
    case 'googleAnalytics':
      return validateGoogleAnalyticsCredentials(credentials.serviceAccountEmail, credentials.serviceAccountKey, credentials.propertyId);
    
    case 'blog':
      return validateBlogCredentials(credentials.rssUrl);
    
    case 'linkedin':
      return validateLinkedInCredentials(credentials.clientId, credentials.clientSecret);
    
    case 'postiz':
      return validatePostizCredentials(credentials.url, credentials.apiKey);
    
    default:
      return { valid: false, error: 'Unknown service' };
  }
};

// Get effective configuration (combines saved settings with environment variables)
export const getEffectiveConfig = () => {
  const savedCredentials = getLocalCredentials();
  
  // Merge with environment variables (env vars take precedence for security)
  return {
    bluesky: {
      handle: process.env.REACT_APP_BLUESKY_HANDLE || savedCredentials.bluesky?.handle || '',
      appPassword: process.env.REACT_APP_BLUESKY_APP_PASSWORD || savedCredentials.bluesky?.appPassword || '',
      accessToken: savedCredentials.bluesky?.accessToken || '',
      refreshToken: savedCredentials.bluesky?.refreshToken || '',
    },
    ai: {
      provider: savedCredentials.ai?.provider || 'openai',
      apiKey: process.env.REACT_APP_AI_API_KEY || savedCredentials.ai?.apiKey || '',
      baseUrl: process.env.REACT_APP_AI_BASE_URL || savedCredentials.ai?.baseUrl || '',
    },
    google: {
      customSearchApiKey: process.env.REACT_APP_GOOGLE_CSE_API_KEY || savedCredentials.google?.customSearchApiKey || '',
      searchEngineId: process.env.REACT_APP_GOOGLE_CSE_ID || savedCredentials.google?.searchEngineId || '',
    },
    linkedin: {
      clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || savedCredentials.linkedin?.clientId || '',
      clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET || savedCredentials.linkedin?.clientSecret || '',
    },
    blog: {
      rssUrl: process.env.REACT_APP_BLOG_RSS_URL || savedCredentials.blog?.rssUrl || '',
      blogUrl: process.env.REACT_APP_BLOG_URL || savedCredentials.blog?.blogUrl || '',
    },
    postiz: {
      url: process.env.REACT_APP_POSTIZ_URL || savedCredentials.postiz?.url || '',
      apiKey: process.env.REACT_APP_POSTIZ_API_KEY || savedCredentials.postiz?.apiKey || '',
    }
  };
};

// Clear all credentials
export const clearCredentials = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

// Export credentials (for backup/migration)
export const exportCredentials = () => {
  const credentials = getCredentials();
  // Remove sensitive data for export
  const sanitized = {};
  
  Object.keys(credentials).forEach(service => {
    sanitized[service] = {};
    Object.keys(credentials[service]).forEach(key => {
      // Keep non-sensitive fields
      if (['handle', 'provider', 'url', 'blogUrl', 'rssUrl'].includes(key)) {
        sanitized[service][key] = credentials[service][key];
      } else {
        sanitized[service][key] = '[HIDDEN]';
      }
    });
  });
  
  return sanitized;
};

// Avatar management functions
export const saveCustomAvatar = (avatarDataUrl) => {
  try {
    const profileSettings = getProfileSettings();
    profileSettings.customAvatar = avatarDataUrl;
    return saveProfileSettings(profileSettings);
  } catch (error) {
    return false;
  }
};

export const getCustomAvatar = () => {
  const profileSettings = getProfileSettings();
  return profileSettings.customAvatar;
};

export const removeCustomAvatar = () => {
  try {
    const profileSettings = getProfileSettings();
    profileSettings.customAvatar = null;
    return saveProfileSettings(profileSettings);
  } catch (error) {
    return false;
  }
};

// Document management functions
export const saveDocument = (documentType, content, filename) => {
  try {
    const profileSettings = getProfileSettings();
    if (!profileSettings.documents) {
      profileSettings.documents = {};
    }
    profileSettings.documents[documentType] = {
      content,
      filename,
      uploadedAt: new Date().toISOString()
    };
    return saveProfileSettings(profileSettings);
  } catch (error) {
    return false;
  }
};

export const getDocument = (documentType) => {
  const profileSettings = getProfileSettings();
  return profileSettings.documents?.[documentType] || null;
};

export const removeDocument = (documentType) => {
  try {
    const profileSettings = getProfileSettings();
    if (profileSettings.documents && profileSettings.documents[documentType]) {
      delete profileSettings.documents[documentType];
      return saveProfileSettings(profileSettings);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getAllDocuments = () => {
  const profileSettings = getProfileSettings();
  return profileSettings.documents || {};
};

// Get configuration status summary
export const getConfigurationStatus = () => {
  const effective = getEffectiveConfig();
  
  return {
    bluesky: {
      configured: isServiceConfigured('bluesky'),
      required: true,
      source: effective.bluesky.handle === process.env.REACT_APP_BLUESKY_HANDLE ? 'env' : 'settings'
    },
    ai: {
      configured: isServiceConfigured('ai'),
      required: false,
      source: effective.ai.apiKey === process.env.REACT_APP_AI_API_KEY ? 'env' : 'settings'
    },
    google: {
      configured: isServiceConfigured('google'),
      required: false,
      source: effective.google.customSearchApiKey === process.env.REACT_APP_GOOGLE_CSE_API_KEY ? 'env' : 'settings'
    },
    linkedin: {
      configured: isServiceConfigured('linkedin'),
      required: false,
      source: effective.linkedin.clientId === process.env.REACT_APP_LINKEDIN_CLIENT_ID ? 'env' : 'settings'
    },
    blog: {
      configured: isServiceConfigured('blog'),
      required: false,
      source: 'settings' // Blog settings only from UI
    },
    postiz: {
      configured: isServiceConfigured('postiz'),
      required: false,
      source: effective.postiz.url === process.env.REACT_APP_POSTIZ_URL ? 'env' : 'settings'
    }
  };
};