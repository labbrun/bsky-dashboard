import { supabase } from '../supabaseClient';

// Fetch user profile and metrics from Supabase
export const fetchUserMetrics = async (handle) => {
  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Get recent posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('profile_handle', handle)
      .order('indexed_at', { ascending: false })
      .limit(20);

    if (postsError) {
      throw postsError;
    }

    // Get sample followers
    const { data: followers, error: followersError } = await supabase
      .from('followers')
      .select('*')
      .eq('profile_handle', handle)
      .order('followed_at', { ascending: false })
      .limit(10);

    if (followersError) {
      throw followersError;
    }

    // Get daily metrics for the last 7 days
    const { error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('profile_handle', handle)
      .order('date', { ascending: false })
      .limit(7);

    if (metricsError) {
      throw metricsError;
    }

    // Calculate totals from posts
    const totalLikes = posts?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0;
    const totalReplies = posts?.reduce((sum, post) => sum + (post.reply_count || 0), 0) || 0;
    const totalReposts = posts?.reduce((sum, post) => sum + (post.repost_count || 0), 0) || 0;

    // Return data in the format expected by the React app
    return {
      handle: profile?.handle || handle,
      displayName: profile?.display_name || 'Unknown User',
      bio: profile?.bio || 'No bio available',
      description: profile?.bio || 'No bio available',
      avatar: profile?.avatar_url || 'https://via.placeholder.com/120',
      followersCount: profile?.followers_count || 0,
      followsCount: profile?.follows_count || 0,
      postsCount: profile?.posts_count || 0,
      totalLikes,
      totalReplies,
      totalReposts,
      recentPosts: posts?.map(post => ({
        uri: post.uri,
        text: post.text,
        likeCount: post.like_count || 0,
        replyCount: post.reply_count || 0,
        repostCount: post.repost_count || 0,
        indexedAt: post.indexed_at,
        images: post.images || []
      })) || [],
      sampleFollowers: followers?.map(follower => ({
        handle: follower.follower_handle,
        displayName: follower.follower_display_name,
        avatar: follower.follower_avatar_url || 'https://via.placeholder.com/80'
      })) || []
    };
  } catch (error) {
    throw error;
  }
};

// Insert or update profile data
export const upsertProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        handle: profileData.handle,
        display_name: profileData.displayName,
        bio: profileData.bio,
        avatar_url: profileData.avatar,
        followers_count: profileData.followersCount,
        follows_count: profileData.followsCount,
        posts_count: profileData.postsCount,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Insert posts data
export const insertPosts = async (handle, posts) => {
  try {
    const postsData = posts.map(post => ({
      uri: post.uri,
      profile_handle: handle,
      text: post.text,
      like_count: post.likeCount,
      reply_count: post.replyCount,
      repost_count: post.repostCount,
      indexed_at: post.indexedAt,
      images: post.images
    }));

    const { data, error } = await supabase
      .from('posts')
      .upsert(postsData, { onConflict: 'uri' });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Test connection to Supabase
export const testConnection = async () => {
  try {
    // First test basic connection
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      // If table doesn't exist, that's still a successful connection
      if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
        return { connected: true, tablesExist: false, error: error.message };
      }
      throw error;
    }
    return { connected: true, tablesExist: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};