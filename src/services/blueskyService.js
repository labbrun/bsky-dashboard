// Bluesky API Service
// Connects to the public Bluesky API to fetch real profile and post data
//
// ⚠️  MANDATORY IMAGE EXTRACTION RULE ⚠️
// ALL functions in this service MUST extract and provide images/avatars when available
// This includes: profile avatars, post images, banner images, external thumbnails
// NEVER return data without attempting image extraction first
// Use comprehensive fallback chains for missing images

const BLUESKY_API_BASE = 'https://public.api.bsky.app';

// MANDATORY IMAGE EXTRACTION UTILITY
const extractAvatar = (profileData, fallbackHandle = 'user') => {
  // Comprehensive avatar extraction with multiple fallback paths
  const avatar = profileData.avatar || 
                profileData.profile?.avatar || 
                profileData.user?.avatar ||
                profileData.data?.avatar ||
                `https://avatar.vercel.sh/${fallbackHandle}.svg?text=${fallbackHandle.charAt(0).toUpperCase()}`;
                
  
  return avatar;
};

// Get user profile information
export const getProfile = async (handle) => {
  try {
    const response = await fetch(`${BLUESKY_API_BASE}/xrpc/app.bsky.actor.getProfile?actor=${handle}`);
    
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
      
      // Comprehensive image extraction with debugging
      console.log('Processing post images for:', post.record?.text?.substring(0, 50));
      
      // PRIMARY: Check for images in post.embed.images (processed/viewed posts)
      if (post.embed?.images && Array.isArray(post.embed.images)) {
        images = post.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
        console.log('Found embed.images:', images.length);
      }
      // SECONDARY: Check for images in post.record.embed.images (raw posts)
      else if (post.record?.embed?.images && Array.isArray(post.record.embed.images)) {
        images = post.record.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || ''
        }));
        console.log('Found record.embed.images:', images.length);
      }
      // EXTERNAL: Check for external link thumbnails in post.embed.external
      else if (post.embed?.external?.thumb) {
        images = [{
          thumb: post.embed.external.thumb,
          fullsize: post.embed.external.thumb,
          alt: post.embed.external.title || 'External link thumbnail'
        }];
        console.log('Found external thumb in embed');
      }
      // EXTERNAL RECORD: Check for external image embeds in record
      else if (post.record?.embed?.external?.thumb) {
        images = [{
          thumb: post.record.embed.external.thumb,
          fullsize: post.record.embed.external.thumb,
          alt: post.record.embed.external.title || 'External link thumbnail'
        }];
        console.log('Found external thumb in record');
      }
      // QUOTED POSTS: Check for quoted post images
      else if (post.record?.embed?.record?.embeds?.[0]?.images) {
        images = post.record.embed.record.embeds[0].images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Quoted post image'
        }));
        console.log('Found quoted post images:', images.length);
      }
      // QUOTED POST EXTERNAL: Check for external images in quoted posts
      else if (post.record?.embed?.record?.embed?.external?.thumb) {
        images = [{
          thumb: post.record.embed.record.embed.external.thumb,
          fullsize: post.record.embed.record.embed.external.thumb,
          alt: post.record.embed.record.embed.external.title || 'Quoted post external image'
        }];
        console.log('Found quoted post external image');
      }
      // REPLY PARENT IMAGES: Check for images in reply parent post
      else if (feedItem.reply?.parent?.embed?.images?.[0]) {
        images = feedItem.reply.parent.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Reply parent image'
        }));
        console.log('Found parent reply images:', images.length);
      }
      // REPLY ROOT IMAGES: Check for images in reply root post
      else if (feedItem.reply?.root?.embed?.images?.[0]) {
        images = feedItem.reply.root.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Reply root image'
        }));
        console.log('Found root reply images:', images.length);
      }
      // ALTERNATIVE PATHS: Check alternative image paths
      else if (post.value?.embed?.images) {
        images = post.value.embed.images.map(img => ({
          thumb: img.thumb,
          fullsize: img.fullsize,
          alt: img.alt || 'Alternative path image'
        }));
        console.log('Found value.embed images:', images.length);
      }
      
      // Final fallback - log structure for debugging
      if (images.length === 0 && (post.embed || post.record?.embed)) {
        console.log('No images found, post structure:', {
          hasEmbed: !!post.embed,
          embedKeys: post.embed ? Object.keys(post.embed) : [],
          hasRecordEmbed: !!post.record?.embed,
          recordEmbedKeys: post.record?.embed ? Object.keys(post.record.embed) : [],
          postText: post.record?.text?.substring(0, 50)
        });
      }


      // Debug logging for replies - check both feedItem.reply and post.reply
      if (feedItem.reply || post.reply) {
        console.log('Found a reply post:', {
          postText: post.record?.text,
          hasFeedReply: !!feedItem.reply,
          hasPostReply: !!post.reply,
          feedItemReply: feedItem.reply,
          postReply: post.reply
        });
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

// Main function to fetch all user data
export const fetchBlueskyUserData = async (handle) => {
  try {
    
    // Fetch profile, posts, and followers in parallel
    const [profileData, feedData, followersData] = await Promise.all([
      getProfile(handle),
      getAuthorFeed(handle, 20),
      getFollowers(handle, 10)
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