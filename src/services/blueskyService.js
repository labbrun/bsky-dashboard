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

const BLUESKY_API_BASE = 'https://bsky.social/xrpc';
const PUBLIC_API_BASE = 'https://public.api.bsky.app/xrpc';

// Session storage for authentication
let authSession = null;

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
 * Authenticates with Bluesky AT Protocol using stored credentials
 * @returns {Promise<Object>} Session data with access token
 * @throws {Error} When authentication fails
 */
export const authenticateBluesky = async () => {
  try {
    const credentials = getCredentials();
    const blueskyConfig = credentials.bluesky;

    if (!blueskyConfig?.handle || !blueskyConfig?.appPassword) {
      throw new Error('Bluesky credentials not configured. Please add your handle and app password in Settings.');
    }

    const response = await fetch(`${BLUESKY_API_BASE}/com.atproto.server.createSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: blueskyConfig.handle,
        password: blueskyConfig.appPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
    }

    const sessionData = await response.json();
    authSession = sessionData;
    return sessionData;

  } catch (error) {
    authSession = null;
    throw error;
  }
};

/**
 * Makes authenticated API request to Bluesky
 * @param {string} endpoint - API endpoint path
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
const makeAuthenticatedRequest = async (endpoint, params = {}) => {
  // Ensure we have a valid session
  if (!authSession) {
    await authenticateBluesky();
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `${BLUESKY_API_BASE}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${authSession.accessJwt}`,
      'Content-Type': 'application/json'
    }
  });

  // If unauthorized, try to reauthenticate once
  if (response.status === 401 && authSession) {
    authSession = null;
    await authenticateBluesky();

    const retryResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authSession.accessJwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!retryResponse.ok) {
      throw new Error(`API request failed: ${retryResponse.status} ${retryResponse.statusText}`);
    }

    return await retryResponse.json();
  }

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
    // If no handle provided, use the authenticated user's handle
    if (!handle && authSession?.handle) {
      handle = authSession.handle;
    } else if (!handle) {
      const credentials = getCredentials();
      handle = credentials.bluesky?.handle;
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
    // If no handle provided, use the authenticated user's handle
    if (!handle && authSession?.handle) {
      handle = authSession.handle;
    } else if (!handle) {
      const credentials = getCredentials();
      handle = credentials.bluesky?.handle;
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
    // If no handle provided, use the authenticated user's handle
    if (!handle && authSession?.handle) {
      handle = authSession.handle;
    } else if (!handle) {
      const credentials = getCredentials();
      handle = credentials.bluesky?.handle;
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
    // If no handle provided, use the authenticated user's handle
    if (!handle && authSession?.handle) {
      handle = authSession.handle;
    } else if (!handle) {
      const credentials = getCredentials();
      handle = credentials.bluesky?.handle;
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
    // Authenticate first
    if (!authSession) {
      await authenticateBluesky();
    }

    // Use authenticated user's handle if none provided
    if (!handle) {
      handle = authSession?.handle;
      if (!handle) {
        const credentials = getCredentials();
        handle = credentials.bluesky?.handle;
      }
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

// Test function to verify API connectivity and authentication
export const testBlueskyAPI = async () => {
  try {
    // Try to authenticate with stored credentials
    await authenticateBluesky();

    // If authentication succeeds, try to fetch the user's own profile
    const profile = await getProfile();

    // Return success with user info
    return {
      success: true,
      handle: profile.handle,
      displayName: profile.displayName
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
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

// Clear authentication session (for logout)
export const clearBlueskySession = () => {
  authSession = null;
};