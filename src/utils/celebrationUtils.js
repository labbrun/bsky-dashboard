// Utility functions for celebration overlay

export const checkCelebrationConditions = (metrics, previousMetrics = null) => {
  const celebrations = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

  // Check for new followers - ONLY celebrate if we have real data showing growth
  if (previousMetrics && metrics.followersCount > previousMetrics.followersCount) {
    const newFollowers = metrics.followersCount - previousMetrics.followersCount;
    if (newFollowers > 0) {
      celebrations.push({
        type: 'followers',
        message: `You've gained ${newFollowers} new follower${newFollowers > 1 ? 's' : ''} since your last visit!`,
        count: newFollowers
      });
    }
  }
  // NOTE: Removed fake simulation - only celebrate real follower growth

  // Check for high engagement posts (using recent posts data)
  if (metrics.recentPosts && metrics.recentPosts.length > 0) {
    const highEngagementPosts = metrics.recentPosts.filter(post => {
      // Check if post is from last 24 hours
      const postDate = new Date(post.indexedAt);
      const isRecent = postDate >= twentyFourHoursAgo;
      
      // Check engagement criteria
      const hasHighComments = post.replyCount > 20;
      const hasHighShares = post.repostCount > 10; 
      const hasHighLikes = post.likeCount > 25;
      
      return isRecent && (hasHighComments || hasHighShares || hasHighLikes);
    });

    if (highEngagementPosts.length > 0) {
      const post = highEngagementPosts[0]; // Take the first high-engagement post
      let engagementType = '';
      if (post.replyCount > 20) engagementType = `${post.replyCount} comments`;
      else if (post.repostCount > 10) engagementType = `${post.repostCount} shares`;
      else if (post.likeCount > 25) engagementType = `${post.likeCount} likes`;

      celebrations.push({
        type: 'engagement',
        message: `Your recent post got amazing engagement with ${engagementType}! Keep up the great content!`,
        post: post
      });
    }
  }
  // NOTE: Removed fake engagement simulation - only celebrate real engagement

  return celebrations;
};

// Store previous metrics for comparison
export const storePreviousMetrics = (metrics) => {
  if (!metrics) return;
  
  const metricsData = {
    followersCount: metrics.followersCount,
    followsCount: metrics.followsCount,
    postsCount: metrics.postsCount,
    timestamp: Date.now()
  };
  
  localStorage.setItem('previousMetrics', JSON.stringify(metricsData));
};

// Get previous metrics for comparison
export const getPreviousMetrics = () => {
  try {
    const stored = localStorage.getItem('previousMetrics');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const shouldShowCelebration = () => {
  const today = new Date().toDateString();
  const lastShown = localStorage.getItem('celebrationLastShown');
  
  // Only show once per day
  if (lastShown === today) {
    return false;
  }
  
  return true;
};

export const markCelebrationShown = () => {
  const today = new Date().toDateString();
  localStorage.setItem('celebrationLastShown', today);
};

// Clear all celebration tracking (useful for testing)
export const clearCelebrationTracking = () => {
  localStorage.removeItem('celebrationLastShown');
  localStorage.removeItem('previousMetrics');
};

export const formatCelebrationMessage = (celebrations) => {
  if (celebrations.length === 0) return '';
  
  if (celebrations.length === 1) {
    return celebrations[0].message;
  }
  
  // Multiple celebrations
  const messages = celebrations.map(c => c.message);
  const lastMessage = messages.pop();
  return `${messages.join(' AND ')} AND ${lastMessage}`;
};