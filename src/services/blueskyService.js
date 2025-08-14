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
    recentPosts: posts.map((post, index) => {
      // Enhanced image detection for Bluesky embed structures
      let images = [];
      
      
      // PRIMARY: Check for images in post.embed.images (processed/viewed posts)
      if (post.embed?.images) {
        images = post.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
      }
      // SECONDARY: Check for images in post.record.embed.images (raw posts)
      else if (post.record?.embed?.images) {
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
          alt: post.embed.external.title || ''
        }];
      }
      // EXTERNAL RECORD: Check for external image embeds in record
      else if (post.record?.embed?.external?.thumb) {
        images = [{
          thumb: post.record.embed.external.thumb,
          fullsize: post.record.embed.external.thumb,
          alt: post.record.embed.external.title || ''
        }];
      }
      // QUOTED POSTS: Check for quoted post images
      else if (post.record?.embed?.record?.embeds?.[0]?.images) {
        images = post.record.embed.record.embeds[0].images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
      }
      // REPLY PARENT IMAGES: Check for images in reply parent post
      else if (post.reply?.parent?.embed?.external?.thumb) {
        images = [{
          thumb: post.reply.parent.embed.external.thumb,
          fullsize: post.reply.parent.embed.external.thumb,
          alt: post.reply.parent.embed.external.title || 'Reply parent image'
        }];
      }
      // REPLY ROOT IMAGES: Check for images in reply root post
      else if (post.reply?.root?.embed?.external?.thumb) {
        images = [{
          thumb: post.reply.root.embed.external.thumb,
          fullsize: post.reply.root.embed.external.thumb,
          alt: post.reply.root.embed.external.title || 'Reply root image'
        }];
      }
      else {
      }


      return {
        uri: post.uri,
        text: post.record?.text || '',
        likeCount: post.likeCount || 0,
        replyCount: post.replyCount || 0,
        repostCount: post.repostCount || 0,
        indexedAt: post.indexedAt,
        images
      };
    }),
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
    
    // Fetch profile, posts, and followers in parallel
    const [profileData, feedData, followersData] = await Promise.all([
      getProfile(handle),
      getAuthorFeed(handle, 20),
      getFollowers(handle, 10)
    ]);
    
    // Transform and return data
    const transformedData = transformBlueskyData(
      profileData,
      feedData.feed?.map(item => item.post) || [],
      followersData.followers || []
    );
    
    return transformedData;
    
  } catch (error) {
    throw error;
  }
};

// Test function to verify API connectivity
export const testBlueskyAPI = async () => {
  try {
    // Test with a known public account
    const testHandle = 'bsky.app';
    await getProfile(testHandle);
    return true;
  } catch (error) {
    return false;
  }
};