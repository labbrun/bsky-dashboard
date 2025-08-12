// Bluesky API Service
// Connects to the public Bluesky API to fetch real profile and post data

const BLUESKY_API_BASE = 'https://public.api.bsky.app';

// Get user profile information
export const getProfile = async (handle) => {
  try {
    const response = await fetch(`${BLUESKY_API_BASE}/xrpc/app.bsky.actor.getProfile?actor=${handle}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Get user's posts/feed
export const getAuthorFeed = async (handle, limit = 25, cursor = null) => {
  try {
    let url = `${BLUESKY_API_BASE}/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch author feed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching author feed:', error);
    throw error;
  }
};

// Get user's followers
export const getFollowers = async (handle, limit = 100, cursor = null) => {
  try {
    let url = `${BLUESKY_API_BASE}/xrpc/app.bsky.graph.getFollowers?actor=${handle}&limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch followers: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// Get users the account follows
export const getFollows = async (handle, limit = 100, cursor = null) => {
  try {
    let url = `${BLUESKY_API_BASE}/xrpc/app.bsky.graph.getFollows?actor=${handle}&limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch follows: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching follows:', error);
    throw error;
  }
};

// Transform Bluesky API data to match our dashboard format
export const transformBlueskyData = (profile, posts, followers) => {
  // Calculate engagement totals from posts
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
    recentPosts: posts.map(post => ({
      uri: post.uri,
      text: post.record?.text || '',
      likeCount: post.likeCount || 0,
      replyCount: post.replyCount || 0,
      repostCount: post.repostCount || 0,
      indexedAt: post.indexedAt,
      images: post.record?.embed?.images || []
    })),
    sampleFollowers: followers.map(follower => ({
      handle: follower.handle,
      displayName: follower.displayName || follower.handle,
      avatar: follower.avatar || 'https://via.placeholder.com/80'
    }))
  };
};

// Main function to fetch all user data
export const fetchBlueskyUserData = async (handle) => {
  try {
    console.log(`Fetching Bluesky data for: ${handle}`);
    
    // Fetch profile, posts, and followers in parallel
    const [profileData, feedData, followersData] = await Promise.all([
      getProfile(handle),
      getAuthorFeed(handle, 20),
      getFollowers(handle, 10)
    ]);
    
    console.log('Profile data:', profileData);
    console.log('Feed data:', feedData);
    console.log('Followers data:', followersData);
    
    // Transform and return data
    const transformedData = transformBlueskyData(
      profileData,
      feedData.feed?.map(item => item.post) || [],
      followersData.followers || []
    );
    
    console.log('Transformed data:', transformedData);
    return transformedData;
    
  } catch (error) {
    console.error('Error fetching Bluesky user data:', error);
    throw error;
  }
};

// Test function to verify API connectivity
export const testBlueskyAPI = async () => {
  try {
    // Test with a known public account
    const testHandle = 'bsky.app';
    const profile = await getProfile(testHandle);
    console.log('Bluesky API test successful:', profile);
    return true;
  } catch (error) {
    console.error('Bluesky API test failed:', error);
    return false;
  }
};