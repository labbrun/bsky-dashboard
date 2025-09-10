// Credentials Service
// Manages API credentials and validation for all integrations

const STORAGE_KEY = 'bluesky-analytics-settings';

// Get all saved credentials
export const getCredentials = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load credentials:', error);
    return {};
  }
};

// Save credentials
export const saveCredentials = (credentials) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return true;
  } catch (error) {
    console.error('Failed to save credentials:', error);
    return false;
  }
};

// Get profile settings (keywords, preferences, etc.)
export const getProfileSettings = () => {
  const credentials = getCredentials();
  return credentials.profile || {
    keywords: [],
    displayName: '',
    bio: '',
    targetAudience: '',
    contentGoals: []
  };
};

// Save profile settings
export const saveProfileSettings = (profileSettings) => {
  try {
    const credentials = getCredentials();
    credentials.profile = profileSettings;
    return saveCredentials(credentials);
  } catch (error) {
    console.error('Failed to save profile settings:', error);
    return false;
  }
};

// Get specific service credentials
export const getServiceCredentials = (service) => {
  const allCredentials = getCredentials();
  return allCredentials[service] || {};
};

// Check if service is configured
export const isServiceConfigured = (service) => {
  const credentials = getServiceCredentials(service);
  
  switch (service) {
    case 'bluesky':
      return !!(credentials.handle && credentials.appPassword);
    
    case 'ai':
      return !!(credentials.apiKey || credentials.provider === 'local');
    
    case 'google':
      return !!(credentials.customSearchApiKey && credentials.searchEngineId);
    
    case 'linkedin':
      return !!(credentials.clientId && credentials.clientSecret);
    
    case 'blog':
      return !!(credentials.rssUrl);
    
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
export const validateBlueskyCredentials = async (handle, appPassword) => {
  try {
    if (!handle || !appPassword) {
      return { valid: false, error: 'Handle and app password are required' };
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

    if (appPassword.length < 16 || !appPassword.includes('-')) {
      return { valid: false, error: 'Invalid app password format. Should be like: xxxx-xxxx-xxxx-xxxx' };
    }

    // Test actual connection (this would require implementing AT Protocol authentication)
    // For now, we'll do basic validation
    return { valid: true };
    
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
    }

    return { valid: true };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Validate Google Custom Search credentials
export const validateGoogleCredentials = async (apiKey, searchEngineId) => {
  try {
    if (!apiKey || !searchEngineId) {
      return { valid: false, error: 'Both API key and Search Engine ID are required' };
    }

    if (!apiKey.startsWith('AIza')) {
      return { valid: false, error: 'Google API key should start with AIza' };
    }

    // Test the API
    const testUrl = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=test`;
    
    try {
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (response.ok && data.searchInformation) {
        return { valid: true };
      } else {
        return { valid: false, error: data.error?.message || 'Invalid credentials' };
      }
    } catch (error) {
      return { valid: false, error: 'Failed to test Google API connection' };
    }
    
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

    // Test RSS feed
    try {
      const response = await fetch(rssUrl, { 
        method: 'HEAD', 
        timeout: 10000 
      });
      
      if (response.ok) {
        return { valid: true };
      } else {
        return { valid: false, error: `RSS feed returned ${response.status}` };
      }
    } catch (error) {
      return { valid: false, error: 'Cannot access RSS feed' };
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
      return validateBlueskyCredentials(credentials.handle, credentials.appPassword);
    
    case 'database':
      return validateDatabaseCredentials(credentials.supabaseUrl, credentials.supabaseAnonKey);
    
    case 'ai':
      return validateAICredentials(credentials.provider, credentials.apiKey, credentials.baseUrl);
    
    case 'google':
      return validateGoogleCredentials(credentials.customSearchApiKey, credentials.searchEngineId);
    
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
  const savedCredentials = getCredentials();
  
  // Merge with environment variables (env vars take precedence for security)
  return {
    bluesky: {
      handle: process.env.REACT_APP_BLUESKY_HANDLE || savedCredentials.bluesky?.handle || '',
      appPassword: process.env.REACT_APP_BLUESKY_APP_PASSWORD || savedCredentials.bluesky?.appPassword || '',
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
    console.error('Failed to clear credentials:', error);
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