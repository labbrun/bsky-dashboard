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
// Store user authentication hash in database
export const storeUserAuth = async (passwordHash) => {
  try {
    const { data, error } = await supabase
      .from('user_auth')
      .upsert({
        id: 'default_user',
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.warn('Failed to store auth in database, using localStorage:', error.message);
    return { success: false, error: error.message };
  }
};

// Retrieve user authentication hash from database
export const getUserAuth = async () => {
  try {
    const { data, error } = await supabase
      .from('user_auth')
      .select('password_hash')
      .eq('id', 'default_user')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No auth record found
        return { success: true, passwordHash: null };
      }
      throw error;
    }
    return { success: true, passwordHash: data.password_hash };
  } catch (error) {
    console.warn('Failed to get auth from database, using localStorage:', error.message);
    return { success: false, error: error.message };
  }
};

// Save user settings to database
export const saveUserSettings = async (key, data) => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        id: 'default_user',
        setting_key: key,
        setting_data: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id,setting_key'
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.warn(`Failed to save ${key} to database:`, error.message);
    return { success: false, error: error.message };
  }
};

// Get user settings from database
export const getUserSettings = async (key) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('setting_data')
      .eq('id', 'default_user')
      .eq('setting_key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No setting found
        return { success: true, data: null };
      }
      throw error;
    }
    return { success: true, data: data.setting_data };
  } catch (error) {
    console.warn(`Failed to get ${key} from database:`, error.message);
    return { success: false, error: error.message };
  }
};

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