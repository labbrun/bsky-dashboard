/**
 * Bluesky API Service
 * Connects to the Bluesky AT Protocol API with user authentication to fetch real profile and post data
 *
 * ⚠️  MANDATORY IMAGE EXTRACTION RULE ⚠️
 * ALL functions in this service MUST extract and provide images/avatars when available
 * This includes: profile avatars, post images, banner images, external thumbnails
 * NEVER return data without attempting image extraction first
 * Use comprehensive fallback chains for missing images
 * @module blueskyService
 */

import { getCredentials } from './credentialsService';

const DEFAULT_BLUESKY_API_BASE = 'https://bsky.social/xrpc';
const PUBLIC_API_BASE = 'https://public.api.bsky.app/xrpc';

// Get configured API endpoint or fall back to default
const getApiEndpoint = () => {
  const credentials = getCredentials();
  return credentials.bluesky?.apiEndpoint || DEFAULT_BLUESKY_API_BASE;
};

/**
 * Tests if the Bluesky API is accessible with current credentials
 * @returns {Promise<boolean>} True if API is working
 */
export const testBlueskyAPI = async () => {
  try {
    console.log('🧪 Testing Bluesky API connectivity...');
    const tokenData = await getBlueskyToken();
    const response = await fetch(`${getApiEndpoint()}/app.bsky.actor.getProfile?actor=${tokenData.handle}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Bluesky API test successful');
      return true;
    } else {
      console.warn('❌ Bluesky API test failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.warn('💥 Bluesky API test failed:', error);
    return false;
  }
};

/**
 * Debug utility to test token refresh functionality
 * @returns {Promise<Object>} Test results
 */
export const debugTokenRefresh = async () => {
  console.log('🔧 Starting token refresh debug test...');

  try {
    const credentials = getCredentials();
    const blueskyConfig = credentials.bluesky;

    if (!blueskyConfig?.refreshToken) {
      return {
        success: false,
        error: 'No refresh token configured',
        details: 'Please add your refresh token in Settings'
      };
    }

    console.log('📋 Debug info:', {
      hasAccessToken: !!blueskyConfig.accessToken,
      hasRefreshToken: !!blueskyConfig.refreshToken,
      accessTokenStart: blueskyConfig.accessToken?.substring(0, 10) + '...',
      refreshTokenStart: blueskyConfig.refreshToken?.substring(0, 10) + '...',
      handle: blueskyConfig.handle,
      apiEndpoint: getApiEndpoint()
    });

    // Test current token validity
    const isCurrentValid = await isTokenValid(blueskyConfig.accessToken, blueskyConfig.handle);
    console.log('🔍 Current token valid:', isCurrentValid);

    // Force a refresh to test the mechanism
    console.log('🔄 Testing refresh mechanism...');
    const newToken = await refreshAccessToken();

    // Test the new token
    const isNewValid = await isTokenValid(newToken, blueskyConfig.handle);
    console.log('🔍 New token valid:', isNewValid);

    return {
      success: true,
      currentTokenValid: isCurrentValid,
      refreshSuccessful: !!newToken,
      newTokenValid: isNewValid,
      newTokenStart: newToken?.substring(0, 10) + '...'
    };

  } catch (error) {
    console.error('💥 Token refresh debug failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
};

/**
 * MANDATORY IMAGE EXTRACTION UTILITY
 * Extracts avatar from profile data with comprehensive fallback chain
 * @private
 * @param {Object} profileData - The profile data object
 * @param {string} fallbackHandle - Handle to use for fallback avatar generation
 * @returns {string} Avatar URL or generated fallback
 */
const extractAvatar = (profileData, fallbackHandle = 'user') => {
  // Comprehensive avatar extraction with multiple fallback paths
  const avatar = profileData.avatar || 
                profileData.profile?.avatar || 
                profileData.user?.avatar ||
                profileData.data?.avatar ||
                `https://avatar.vercel.sh/${fallbackHandle}.svg?text=${fallbackHandle.charAt(0).toUpperCase()}`;
                
  
  return avatar;
};

/**
 * Refreshes the Bluesky access token using the refresh token
 * @returns {Promise<string>} New access token
 * @throws {Error} When refresh fails
 */
export const refreshAccessToken = async () => {
  console.log('🔄 Starting token refresh...');

  try {
    const credentials = getCredentials();
    const blueskyConfig = credentials.bluesky;

    if (!blueskyConfig?.refreshToken) {
      const error = 'Bluesky refresh token not configured. Please add your refresh token in Settings.';
      console.error('❌ Token refresh failed:', error);
      throw new Error(error);
    }

    console.log('📡 Making refresh request to:', `${getApiEndpoint()}/com.atproto.server.refreshSession`);

    const response = await fetch(`${getApiEndpoint()}/com.atproto.server.refreshSession`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${blueskyConfig.refreshToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token refresh HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      if (response.status === 401) {
        throw new Error('Refresh token is invalid or expired. Please update your refresh token in Settings.');
      } else if (response.status === 400) {
        throw new Error('Invalid refresh token format. Please check your refresh token in Settings.');
      } else {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Token refresh successful, received new tokens');

    if (!data.accessJwt) {
      throw new Error('Invalid refresh response: missing accessJwt');
    }

    // Update stored credentials with new access token
    const updatedCredentials = {
      ...credentials,
      bluesky: {
        ...blueskyConfig,
        accessToken: data.accessJwt,
        refreshToken: data.refreshJwt || blueskyConfig.refreshToken
      }
    };

    // Save updated credentials back to localStorage
    localStorage.setItem('bluesky-analytics-credentials', JSON.stringify(updatedCredentials));
    console.log('💾 Updated credentials saved to localStorage');

    return data.accessJwt;
  } catch (error) {
    console.error('💥 Token refresh error:', error);
    throw error;
  }
};

/**
 * Checks if an access token is valid by making a test API call
 * @param {string} accessToken - The access token to validate
 * @param {string} handle - The user handle for testing
 * @returns {Promise<boolean>} True if token is valid
 */
const isTokenValid = async (accessToken, handle) => {
  try {
    console.log('🔍 Testing token validity for handle:', handle);
    const response = await fetch(`${getApiEndpoint()}/app.bsky.actor.getProfile?actor=${handle}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Token validation successful');
      return true;
    } else {
      console.log(`❌ Token validation failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Token validation error:', error.message);
    return false;
  }
};

/**
 * Refreshes access token with retry logic
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<string>} New access token
 */
const refreshWithRetry = async (maxRetries = 2) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Token refresh attempt ${attempt}/${maxRetries}`);
      const newToken = await refreshAccessToken();
      console.log(`✅ Token refresh succeeded on attempt ${attempt}`);
      return newToken;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Token refresh attempt ${attempt} failed:`, error.message);

      // Don't retry on authentication errors (401, 400) as these likely indicate invalid refresh token
      if (error.message.includes('invalid') || error.message.includes('expired') || error.message.includes('401') || error.message.includes('400')) {
        console.log('❌ Authentication error detected, skipping retries');
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Gets Bluesky access token from stored credentials, refreshing if necessary
 * @returns {Promise<Object>} Token data
 * @throws {Error} When credentials not configured
 */
export const getBlueskyToken = async () => {
  try {
    const credentials = getCredentials();
    const blueskyConfig = credentials.bluesky;

    if (!blueskyConfig?.handle || !blueskyConfig?.accessToken) {
      throw new Error('Bluesky credentials not configured. Please add your handle and access token in Settings.');
    }

    // Check if current token is valid
    console.log('🔍 Validating current access token...');
    const isValid = await isTokenValid(blueskyConfig.accessToken, blueskyConfig.handle);

    if (!isValid) {
      console.log('🔄 Access token expired, attempting refresh...');
      try {
        const newAccessToken = await refreshWithRetry();
        console.log('✅ Token refresh completed successfully');
        return {
          accessToken: newAccessToken,
          handle: blueskyConfig.handle
        };
      } catch (refreshError) {
        console.error('💥 All token refresh attempts failed:', refreshError);
        throw new Error('Access token expired and refresh failed. Please update your credentials in Settings.');
      }
    }

    console.log('✅ Current access token is valid');
    return {
      accessToken: blueskyConfig.accessToken,
      handle: blueskyConfig.handle
    };

  } catch (error) {
    throw error;
  }
};

/**
 * Makes authenticated API request to Bluesky using access token
 * @param {string} endpoint - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
const makeAuthenticatedRequest = async (endpoint, params = {}) => {
  // Get access token
  const tokenData = await getBlueskyToken();

  const queryString = new URLSearchParams(params).toString();
  const url = `${getApiEndpoint()}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetches user profile information from Bluesky API (authenticated)
 * @param {string} handle - The user handle (with or without @) - defaults to authenticated user
 * @returns {Promise<Object>} Profile data with extracted images
 * @throws {Error} When profile cannot be fetched
 */
export const getProfile = async (handle = null) => {
  try {
    // If no handle provided, use the configured user's handle
    if (!handle) {
      const tokenData = await getBlueskyToken();
      handle = tokenData.handle;
    }

    if (!handle) {
      throw new Error('No handle provided and no authenticated user found');
    }

    const data = await makeAuthenticatedRequest('app.bsky.actor.getProfile', {
      actor: handle
    });

    // MANDATORY: Ensure avatar is always extracted and added to response
    data.avatar = extractAvatar(data, handle);

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user's posts/feed (authenticated)
export const getAuthorFeed = async (handle = null, limit = 25, cursor = null) => {
  try {
    // If no handle provided, use the configured user's handle
    if (!handle) {
      const tokenData = await getBlueskyToken();
      handle = tokenData.handle;
    }

    if (!handle) {
      throw new Error('No handle provided and no authenticated user found');
    }

    const params = { actor: handle, limit: limit.toString() };
    if (cursor) {
      params.cursor = cursor;
    }

    const data = await makeAuthenticatedRequest('app.bsky.feed.getAuthorFeed', params);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get user's followers (authenticated)
export const getFollowers = async (handle = null, limit = 100, cursor = null) => {
  try {
    // If no handle provided, use the configured user's handle
    if (!handle) {
      const tokenData = await getBlueskyToken();
      handle = tokenData.handle;
    }

    if (!handle) {
      throw new Error('No handle provided and no authenticated user found');
    }

    const params = { actor: handle, limit: limit.toString() };
    if (cursor) {
      params.cursor = cursor;
    }

    const data = await makeAuthenticatedRequest('app.bsky.graph.getFollowers', params);

    // MANDATORY: Ensure all follower avatars are extracted
    if (data.followers && Array.isArray(data.followers)) {
      data.followers = data.followers.map(follower => ({
        ...follower,
        avatar: extractAvatar(follower, follower.handle || 'follower')
      }));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get users the account follows (authenticated)
export const getFollows = async (handle = null, limit = 100, cursor = null) => {
  try {
    // If no handle provided, use the configured user's handle
    if (!handle) {
      const tokenData = await getBlueskyToken();
      handle = tokenData.handle;
    }

    if (!handle) {
      throw new Error('No handle provided and no authenticated user found');
    }

    const params = { actor: handle, limit: limit.toString() };
    if (cursor) {
      params.cursor = cursor;
    }

    const data = await makeAuthenticatedRequest('app.bsky.graph.getFollows', params);
    return data;
  } catch (error) {
    throw error;
  }
};

// Transform Bluesky API data to match our dashboard format
export const transformBlueskyData = (profile, feedItems, followers) => {
  // Extract posts from feed items and calculate engagement totals
  const posts = feedItems.map(item => item.post);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
  const totalReplies = posts.reduce((sum, post) => sum + (post.replyCount || 0), 0);
  const totalReposts = posts.reduce((sum, post) => sum + (post.repostCount || 0), 0);

  return {
    handle: profile.handle,
    displayName: profile.displayName || profile.handle,
    bio: profile.description || 'No bio available',
    description: profile.description || 'No bio available',
    avatar: profile.avatar || 'https://via.placeholder.com/120',
    banner: profile.banner || null, // Add banner support
    followersCount: profile.followersCount || 0,
    followsCount: profile.followsCount || 0,
    postsCount: profile.postsCount || 0,
    totalLikes,
    totalReplies,
    totalReposts,
    recentPosts: feedItems.map((feedItem, index) => {
      const post = feedItem.post;
      // Enhanced image detection for Bluesky embed structures
      let images = [];
      
      // Comprehensive image extraction
      
      // PRIMARY: Check for images in post.embed.images (processed/viewed posts)
      if (post.embed?.images && Array.isArray(post.embed.images)) {
        images = post.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
      }
      // SECONDARY: Check for images in post.record.embed.images (raw posts)
      else if (post.record?.embed?.images && Array.isArray(post.record.embed.images)) {
        images = post.record.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
      }
      // EXTERNAL: Check for external link thumbnails in post.embed.external
      else if (post.embed?.external?.thumb) {
        images = [{
          thumb: post.embed.external.thumb,
          fullsize: post.embed.external.thumb,
          alt: post.embed.external.title || 'External link thumbnail'
        }];
      }
      // EXTERNAL RECORD: Check for external image embeds in record
      else if (post.record?.embed?.external?.thumb) {
        images = [{
          thumb: post.record.embed.external.thumb,
          fullsize: post.record.embed.external.thumb,
          alt: post.record.embed.external.title || 'External link thumbnail'
        }];
      }
      // QUOTED POSTS: Check for quoted post images
      else if (post.record?.embed?.record?.embeds?.[0]?.images) {
        images = post.record.embed.record.embeds[0].images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Quoted post image'
        }));
      }
      // QUOTED POST EXTERNAL: Check for external images in quoted posts
      else if (post.record?.embed?.record?.embed?.external?.thumb) {
        images = [{
          thumb: post.record.embed.record.embed.external.thumb,
          fullsize: post.record.embed.record.embed.external.thumb,
          alt: post.record.embed.record.embed.external.title || 'Quoted post external image'
        }];
      }
      // REPLY PARENT IMAGES: Check for images in reply parent post
      else if (feedItem.reply?.parent?.embed?.images?.[0]) {
        images = feedItem.reply.parent.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Reply parent image'
        }));
      }
      // REPLY ROOT IMAGES: Check for images in reply root post
      else if (feedItem.reply?.root?.embed?.images?.[0]) {
        images = feedItem.reply.root.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Reply root image'
        }));
      }
      // ALTERNATIVE PATHS: Check alternative image paths
      else if (post.value?.embed?.images) {
        images = post.value.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Alternative path image'
        }));
      }
      

      // Determine post format based on content
      let format = 'Text';
      if (images.length > 0) {
        format = 'Text + Image';
      } else if (post.embed?.external || post.record?.embed?.external) {
        format = 'Link';
      } else if (post.record?.text && post.record.text.length > 280) {
        format = 'Long Text';
      } else if (feedItem.reply?.parent || feedItem.reply?.root) {
        format = 'Reply';
      } else if (post.record?.embed?.record) {
        format = 'Quote Post';
      }

      return {
        uri: post.uri,
        text: post.record?.text || '',
        likeCount: post.likeCount || 0,
        replyCount: post.replyCount || 0,
        repostCount: post.repostCount || 0,
        indexedAt: post.indexedAt,
        images,
        format, // Add format detection
        isReply: !!(feedItem.reply?.parent || feedItem.reply?.root || post.reply?.parent || post.reply?.root),
        replyTo: feedItem.reply?.parent || post.reply?.parent ? {
          uri: (feedItem.reply?.parent || post.reply?.parent).uri,
          text: (feedItem.reply?.parent || post.reply?.parent).record?.text || '',
          author: {
            handle: (feedItem.reply?.parent || post.reply?.parent).author?.handle || '',
            displayName: (feedItem.reply?.parent || post.reply?.parent).author?.displayName || ''
          }
        } : null
      };
    }),
    sampleFollowers: followers.map(follower => ({
      handle: follower.handle,
      displayName: follower.displayName || follower.handle,
      avatar: follower.avatar || 'https://via.placeholder.com/80'
    }))
  };
};

// Main function to fetch all user data (authenticated)
export const fetchBlueskyUserData = async (handle = null) => {
  try {
    // Use configured user's handle if none provided
    if (!handle) {
      const tokenData = await getBlueskyToken();
      handle = tokenData.handle;
    }

    if (!handle) {
      throw new Error('No handle available for data fetching');
    }

    // Fetch profile, posts, and followers in parallel
    const [profileData, feedData, followersData] = await Promise.all([
      getProfile(handle),
      getAuthorFeed(handle, 50), // Get more posts for better analytics
      getFollowers(handle, 20)   // Get more followers for better analysis
    ]);

    // Transform and return data (pass full feed items to preserve reply context)
    const transformedData = transformBlueskyData(
      profileData,
      feedData.feed || [],
      followersData.followers || []
    );

    return transformedData;

  } catch (error) {
    throw error;
  }
};


// Public API fallback for non-authenticated requests
export const getPublicProfile = async (handle) => {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/app.bsky.actor.getProfile?actor=${handle}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // MANDATORY: Ensure avatar is always extracted and added to response
    data.avatar = extractAvatar(data, handle);

    return data;
  } catch (error) {
    throw error;
  }
};

