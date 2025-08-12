// Utility functions for celebration overlay

export const checkCelebrationConditions = (metrics, previousMetrics = null) => {
  const celebrations = [];
  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

  // Check for new followers (simulate realistic conditions)
  const shouldCelebrateFolowers = Math.random() > 0.3; // 70% chance of having new followers
  if (shouldCelebrateFolowers) {
    if (previousMetrics && metrics.followersCount > previousMetrics.followersCount) {
      const newFollowers = metrics.followersCount - previousMetrics.followersCount;
      if (newFollowers > 0) {
        celebrations.push({
          type: 'followers',
          message: `You've gained ${newFollowers} new follower${newFollowers > 1 ? 's' : ''} in the last 24 hours!`,
          count: newFollowers
        });
      }
    } else {
      // Simulate new followers for demo (5-20 new followers)
      const simulatedNewFollowers = Math.floor(Math.random() * 16) + 5;
      celebrations.push({
        type: 'followers',
        message: `You've gained ${simulatedNewFollowers} new followers in the last 24 hours!`,
        count: simulatedNewFollowers
      });
    }
  }

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
  } else {
    // Simulate high engagement for demo purposes
    const shouldSimulateHighEngagement = Math.random() > 0.5; // 50% chance
    if (shouldSimulateHighEngagement) {
      const engagementTypes = [
        { type: 'comments', count: Math.floor(Math.random() * 20) + 21, label: 'comments' },
        { type: 'shares', count: Math.floor(Math.random() * 15) + 11, label: 'shares' },
        { type: 'likes', count: Math.floor(Math.random() * 25) + 26, label: 'likes' }
      ];
      const randomEngagement = engagementTypes[Math.floor(Math.random() * engagementTypes.length)];
      
      celebrations.push({
        type: 'engagement',
        message: `Your recent post got amazing engagement with ${randomEngagement.count} ${randomEngagement.label}! Keep up the great content!`,
        engagement: randomEngagement
      });
    }
  }

  return celebrations;
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