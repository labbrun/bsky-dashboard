// Service for fetching profile data from Bluesky API
import { fetchBlueskyUserData } from './blueskyService';

export async function fetchProfileData(handle) {
  try {
    const data = await fetchBlueskyUserData(handle);
    return {
      avatar: data.avatar,
      displayName: data.displayName,
      handle: data.handle,
      bio: data.description || 'No bio available',
      followersCount: data.followersCount,
      followsCount: data.followsCount,
      postsCount: data.postsCount,
      recentPost: data.recentPosts && data.recentPosts.length > 0 
        ? {
            text: data.recentPosts[0].text,
            uri: data.recentPosts[0].uri,
            timestamp: data.recentPosts[0].indexedAt || data.recentPosts[0].createdAt,
            likeCount: data.recentPosts[0].likeCount,
            replyCount: data.recentPosts[0].replyCount,
            repostCount: data.recentPosts[0].repostCount,
            images: data.recentPosts[0].images || []
          }
        : null,
      recentPosts: data.recentPosts && data.recentPosts.length > 0 
        ? data.recentPosts.slice(0, 5).map(post => ({
            text: post.text,
            uri: post.uri,
            timestamp: post.indexedAt || post.createdAt,
            likeCount: post.likeCount,
            replyCount: post.replyCount,
            repostCount: post.repostCount,
            images: post.images || []
          }))
        : []
    };
  } catch (error) {
    return {
      avatar: 'https://via.placeholder.com/40',
      displayName: handle,
      handle: handle,
      bio: 'Profile unavailable',
      followersCount: 0,
      followsCount: 0,
      postsCount: 0,
      recentPost: null,
      recentPosts: []
    };
  }
}

export function generateBlueskyPostUrl(handle, postUri) {
  if (!postUri) return '#';
  const postId = postUri.split('/').pop();
  return `https://bsky.app/profile/${handle}/post/${postId}`;
}

export function generateCommentUrl(handle, postUri) {
  const postUrl = generateBlueskyPostUrl(handle, postUri);
  return postUrl; // Bluesky will open the post where users can comment
}