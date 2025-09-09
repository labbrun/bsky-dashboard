// Local Storage Service
// Provides local data persistence when database is not configured

const STORAGE_KEYS = {
  PROFILE: 'bluesky-analytics-profile',
  POSTS: 'bluesky-analytics-posts',
  FOLLOWERS: 'bluesky-analytics-followers',
  METRICS_HISTORY: 'bluesky-analytics-metrics-history'
};

const MAX_STORAGE_ITEMS = 100; // Limit stored items to prevent localStorage bloat

// Helper to safely parse JSON from localStorage
const safeJSONParse = (data, fallback = null) => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.warn('Failed to parse localStorage data:', error);
    return fallback;
  }
};

// Helper to safely stringify JSON for localStorage
const safeJSONStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.warn('Failed to stringify data for localStorage:', error);
    return null;
  }
};

// Store profile data
export const storeProfile = (profileData) => {
  try {
    const dataToStore = {
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    const serialized = safeJSONStringify(dataToStore);
    if (serialized) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, serialized);
    }
  } catch (error) {
    console.warn('Failed to store profile data:', error);
  }
};

// Get profile data
export const getStoredProfile = (handle) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const profileData = safeJSONParse(stored);
    
    if (profileData && profileData.handle === handle) {
      return profileData;
    }
    return null;
  } catch (error) {
    console.warn('Failed to retrieve profile data:', error);
    return null;
  }
};

// Store posts data
export const storePosts = (posts, handle) => {
  try {
    const postsToStore = posts.slice(0, MAX_STORAGE_ITEMS).map(post => ({
      ...post,
      profile_handle: handle,
      stored_at: new Date().toISOString()
    }));
    
    const serialized = safeJSONStringify(postsToStore);
    if (serialized) {
      localStorage.setItem(STORAGE_KEYS.POSTS, serialized);
    }
  } catch (error) {
    console.warn('Failed to store posts data:', error);
  }
};

// Get stored posts
export const getStoredPosts = (handle) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    const posts = safeJSONParse(stored, []);
    
    // Filter posts for the specific handle
    return posts.filter(post => post.profile_handle === handle);
  } catch (error) {
    console.warn('Failed to retrieve posts data:', error);
    return [];
  }
};

// Store followers data
export const storeFollowers = (followers, handle) => {
  try {
    const followersToStore = followers.slice(0, MAX_STORAGE_ITEMS).map(follower => ({
      ...follower,
      profile_handle: handle,
      stored_at: new Date().toISOString()
    }));
    
    const serialized = safeJSONStringify(followersToStore);
    if (serialized) {
      localStorage.setItem(STORAGE_KEYS.FOLLOWERS, serialized);
    }
  } catch (error) {
    console.warn('Failed to store followers data:', error);
  }
};

// Get stored followers
export const getStoredFollowers = (handle) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FOLLOWERS);
    const followers = safeJSONParse(stored, []);
    
    return followers.filter(follower => follower.profile_handle === handle);
  } catch (error) {
    console.warn('Failed to retrieve followers data:', error);
    return [];
  }
};

// Store daily metrics snapshot
export const storeMetricsSnapshot = (metricsData, handle) => {
  try {
    const existingHistory = getMetricsHistory(handle);
    const today = new Date().toDateString();
    
    const snapshot = {
      date: today,
      profile_handle: handle,
      followers_count: metricsData.followersCount || 0,
      follows_count: metricsData.followsCount || 0,
      posts_count: metricsData.postsCount || 0,
      total_likes: metricsData.totalLikes || 0,
      total_replies: metricsData.totalReplies || 0,
      total_reposts: metricsData.totalReposts || 0,
      stored_at: new Date().toISOString()
    };
    
    // Remove existing entry for today and add new one
    const updatedHistory = [
      snapshot,
      ...existingHistory.filter(entry => entry.date !== today)
    ].slice(0, 30); // Keep only last 30 days
    
    const serialized = safeJSONStringify(updatedHistory);
    if (serialized) {
      localStorage.setItem(STORAGE_KEYS.METRICS_HISTORY, serialized);
    }
  } catch (error) {
    console.warn('Failed to store metrics snapshot:', error);
  }
};

// Get metrics history
export const getMetricsHistory = (handle) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.METRICS_HISTORY);
    const history = safeJSONParse(stored, []);
    
    return history.filter(entry => entry.profile_handle === handle);
  } catch (error) {
    console.warn('Failed to retrieve metrics history:', error);
    return [];
  }
};

// Clear all stored data (for logout or data reset)
export const clearStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear stored data:', error);
  }
};

// Get storage usage info
export const getStorageInfo = () => {
  try {
    const usage = {};
    let totalSize = 0;
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      const size = data ? new Blob([data]).size : 0;
      usage[name] = {
        size,
        items: data ? safeJSONParse(data, []).length || 1 : 0
      };
      totalSize += size;
    });
    
    return {
      usage,
      totalSize,
      totalSizeFormatted: `${(totalSize / 1024).toFixed(2)} KB`
    };
  } catch (error) {
    console.warn('Failed to get storage info:', error);
    return null;
  }
};

// Check if data is stale (older than specified minutes)
export const isDataStale = (storedData, maxAgeMinutes = 60) => {
  if (!storedData || !storedData.lastUpdated) return true;
  
  const lastUpdated = new Date(storedData.lastUpdated);
  const now = new Date();
  const ageMinutes = (now - lastUpdated) / (1000 * 60);
  
  return ageMinutes > maxAgeMinutes;
};

// Mock the Supabase-like interface for local storage
export const createLocalStorageService = (handle) => ({
  // Fetch user metrics (mimics supabaseService.fetchUserMetrics)
  fetchUserMetrics: async () => {
    const profile = getStoredProfile(handle);
    const posts = getStoredPosts(handle);
    const followers = getStoredFollowers(handle);
    
    if (!profile) {
      throw new Error('No cached profile data available in local storage');
    }
    
    // Calculate totals from stored posts
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalReplies = posts.reduce((sum, post) => sum + (post.replyCount || 0), 0);
    const totalReposts = posts.reduce((sum, post) => sum + (post.repostCount || 0), 0);
    
    return {
      handle: profile.handle,
      displayName: profile.displayName || 'Unknown User',
      bio: profile.bio || 'No bio available',
      description: profile.bio || 'No bio available',
      avatar: profile.avatar || 'https://via.placeholder.com/120',
      followersCount: profile.followersCount || 0,
      followsCount: profile.followsCount || 0,
      postsCount: profile.postsCount || 0,
      totalLikes,
      totalReplies,
      totalReposts,
      recentPosts: posts.map(post => ({
        uri: post.uri,
        text: post.text,
        likeCount: post.likeCount || 0,
        replyCount: post.replyCount || 0,
        repostCount: post.repostCount || 0,
        indexedAt: post.indexedAt,
        images: post.images || []
      })),
      sampleFollowers: followers.map(follower => ({
        handle: follower.handle,
        displayName: follower.displayName,
        avatar: follower.avatar || 'https://via.placeholder.com/80'
      }))
    };
  },

  // Store profile data
  upsertProfile: async (profileData) => {
    storeProfile(profileData);
    return { data: profileData, error: null };
  },

  // Store posts data
  insertPosts: async (handle, posts) => {
    storePosts(posts, handle);
    return { data: posts, error: null };
  },

  // Test connection (always successful for local storage)
  testConnection: async () => {
    return { connected: true, tablesExist: false, mode: 'local-storage' };
  }
});