// Analytics Service for engagement analysis and AI-powered insights

/**
 * Analyzes engagement by post format using real data
 * @param {Array} posts - Array of posts with format and engagement data
 * @returns {Array} Format analysis with engagement rates
 */
export const analyzeEngagementByFormat = (posts) => {
  if (!posts || posts.length === 0) {
    return [
      { format: 'Text + Image', rate: 0, count: 0 },
      { format: 'Text', rate: 0, count: 0 },
      { format: 'Link', rate: 0, count: 0 },
      { format: 'Reply', rate: 0, count: 0 },
      { format: 'Quote Post', rate: 0, count: 0 }
    ];
  }

  // Group posts by format
  const formatGroups = posts.reduce((groups, post) => {
    const format = post.format || 'Text';
    if (!groups[format]) {
      groups[format] = [];
    }
    groups[format].push(post);
    return groups;
  }, {});

  // Calculate engagement rates for each format
  const formatAnalysis = Object.entries(formatGroups).map(([format, formatPosts]) => {
    const totalEngagement = formatPosts.reduce((sum, post) => 
      sum + (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0), 0
    );
    const avgEngagement = formatPosts.length > 0 ? totalEngagement / formatPosts.length : 0;
    
    // Convert to engagement rate (assuming follower base for calculation)
    const engagementRate = avgEngagement > 0 ? Math.min(avgEngagement / 10, 15) : 0; // Simplified rate calculation
    
    return {
      format,
      rate: parseFloat(engagementRate.toFixed(1)),
      count: formatPosts.length,
      totalEngagement,
      avgEngagement: parseFloat(avgEngagement.toFixed(1))
    };
  });

  // Sort by engagement rate
  return formatAnalysis.sort((a, b) => b.rate - a.rate);
};

/**
 * Target keywords and phrases for topic analysis
 */
const TARGET_KEYWORDS = {
  'AI & Tech': ['ai', 'artificial intelligence', 'machine learning', 'tech', 'technology', 'software', 'coding', 'programming', 'development', 'automation'],
  'Home Lab': ['homelab', 'home lab', 'server', 'networking', 'self-hosting', 'docker', 'kubernetes', 'raspberry pi', 'nas', 'storage'],
  'Privacy & Security': ['privacy', 'security', 'encryption', 'vpn', 'data protection', 'cybersecurity', 'surveillance', 'gdpr', 'open source'],
  'Small Business': ['small business', 'entrepreneurship', 'startup', 'business', 'enterprise', 'smb', 'productivity', 'workflow', 'efficiency'],
  'Personal': ['personal', 'life', 'thoughts', 'opinion', 'experience', 'journey', 'learning', 'growth', 'reflection']
};

/**
 * Analyzes engagement by topic using keyword matching and AI insights
 * @param {Array} posts - Array of posts with text content
 * @param {Object} targetAudience - Target audience information
 * @returns {Object} Topic analysis with AI insights
 */
export const analyzeEngagementByTopic = (posts, targetAudience = {}) => {
  if (!posts || posts.length === 0) {
    return {
      topicEngagement: [],
      aiInsights: {
        onTarget: 0,
        offTarget: [],
        recommendations: [],
        similarTopics: []
      }
    };
  }

  // Analyze posts by topic
  const topicAnalysis = {};
  const offTargetPosts = [];
  let onTargetCount = 0;

  posts.forEach(post => {
    const text = (post.text || '').toLowerCase();
    const engagement = (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0);
    let matchedTopic = null;

    // Check against target keywords
    for (const [topic, keywords] of Object.entries(TARGET_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        matchedTopic = topic;
        onTargetCount++;
        break;
      }
    }

    // If no match found, it's off-target
    if (!matchedTopic) {
      // Try to categorize off-target content
      if (text.includes('politics') || text.includes('news') || text.includes('current events')) {
        matchedTopic = 'Politics/News';
      } else if (text.includes('sports') || text.includes('game') || text.includes('gaming')) {
        matchedTopic = 'Sports/Gaming';
      } else if (text.includes('food') || text.includes('recipe') || text.includes('cooking')) {
        matchedTopic = 'Food/Lifestyle';
      } else {
        matchedTopic = 'Other';
      }
      
      offTargetPosts.push({
        topic: matchedTopic,
        text: post.text?.substring(0, 100) + '...',
        engagement
      });
    }

    // Add to topic analysis
    if (!topicAnalysis[matchedTopic]) {
      topicAnalysis[matchedTopic] = {
        posts: [],
        totalEngagement: 0,
        count: 0
      };
    }
    
    topicAnalysis[matchedTopic].posts.push(post);
    topicAnalysis[matchedTopic].totalEngagement += engagement;
    topicAnalysis[matchedTopic].count++;
  });

  // Calculate engagement rates
  const topicEngagement = Object.entries(topicAnalysis).map(([topic, data]) => {
    const avgEngagement = data.count > 0 ? data.totalEngagement / data.count : 0;
    const engagementRate = avgEngagement > 0 ? Math.min(avgEngagement / 8, 12) : 0; // Simplified rate calculation
    
    return {
      topic,
      rate: parseFloat(engagementRate.toFixed(1)),
      count: data.count,
      totalEngagement: data.totalEngagement,
      avgEngagement: parseFloat(avgEngagement.toFixed(1))
    };
  }).sort((a, b) => b.rate - a.rate);

  // Generate AI insights
  const onTargetPercentage = posts.length > 0 ? (onTargetCount / posts.length) * 100 : 0;
  
  const aiInsights = {
    onTarget: parseFloat(onTargetPercentage.toFixed(1)),
    offTarget: offTargetPosts.slice(0, 3), // Show top 3 off-target posts
    recommendations: generateTopicRecommendations(topicEngagement, onTargetPercentage),
    similarTopics: generateSimilarTopics(topicEngagement)
  };

  return {
    topicEngagement,
    aiInsights
  };
};

/**
 * Generates AI-powered topic recommendations
 * @param {Array} topicEngagement - Current topic performance
 * @param {number} onTargetPercentage - Percentage of on-target posts
 * @returns {Array} Recommendations for improving topic strategy
 */
const generateTopicRecommendations = (topicEngagement, onTargetPercentage) => {
  const recommendations = [];

  if (onTargetPercentage < 70) {
    recommendations.push("Focus more on your core topics (AI & Tech, Home Lab, Privacy & Security) to better serve your target audience.");
  }

  const topPerformingTopic = topicEngagement[0];
  if (topPerformingTopic && topPerformingTopic.rate > 0) {
    recommendations.push(`Your "${topPerformingTopic.topic}" content performs best with ${topPerformingTopic.rate}% engagement. Consider creating more content in this area.`);
  }

  const lowPerformingTopics = topicEngagement.filter(t => t.rate < 2 && t.count > 1);
  if (lowPerformingTopics.length > 0) {
    recommendations.push(`Consider revising your approach to ${lowPerformingTopics[0].topic} content, as it's currently underperforming.`);
  }

  if (topicEngagement.some(t => t.topic.includes('Personal'))) {
    recommendations.push("Personal content can build stronger connections with your audience. Consider sharing more behind-the-scenes insights about your tech journey.");
  }

  return recommendations;
};

/**
 * Generates similar topics that might interest the target audience
 * @param {Array} topicEngagement - Current topic performance
 * @returns {Array} Similar topics with estimated engagement
 */
const generateSimilarTopics = (topicEngagement) => {
  const similarTopics = [
    {
      topic: 'DevOps & Infrastructure',
      estimatedRate: 6.2,
      reason: 'High overlap with Home Lab and AI & Tech audiences'
    },
    {
      topic: 'Open Source Projects',
      estimatedRate: 5.8,
      reason: 'Appeals to privacy-conscious and tech-savvy followers'
    },
    {
      topic: 'Cloud vs Self-Hosted',
      estimatedRate: 7.1,
      reason: 'Perfect blend of privacy, tech, and business interests'
    },
    {
      topic: 'Data Analytics & Visualization',
      estimatedRate: 5.5,
      reason: 'Combines AI/tech skills with business applications'
    },
    {
      topic: 'Remote Work Tech Setup',
      estimatedRate: 6.8,
      reason: 'Appeals to small business owners and tech enthusiasts'
    }
  ];

  // Adjust estimated rates based on current performance
  const avgRate = topicEngagement.length > 0 
    ? topicEngagement.reduce((sum, t) => sum + t.rate, 0) / topicEngagement.length 
    : 5;

  return similarTopics.map(topic => ({
    ...topic,
    estimatedRate: parseFloat((topic.estimatedRate * (avgRate / 5)).toFixed(1))
  })).sort((a, b) => b.estimatedRate - a.estimatedRate);
};

/**
 * Gets comprehensive analytics for the performance dashboard
 * @param {Array} posts - Array of posts
 * @param {Object} metrics - User metrics
 * @returns {Object} Complete analytics data
 */
export const getPerformanceAnalytics = (posts, metrics) => {
  const formatAnalysis = analyzeEngagementByFormat(posts);
  const topicAnalysis = analyzeEngagementByTopic(posts, metrics);

  return {
    engagementByFormat: formatAnalysis,
    engagementByTopic: topicAnalysis.topicEngagement,
    aiTopicInsights: topicAnalysis.aiInsights,
    summary: {
      totalPosts: posts?.length || 0,
      avgEngagement: posts?.length > 0 
        ? posts.reduce((sum, p) => sum + (p.likeCount + p.replyCount + p.repostCount), 0) / posts.length 
        : 0,
      topFormat: formatAnalysis[0]?.format || 'N/A',
      topTopic: topicAnalysis.topicEngagement[0]?.topic || 'N/A'
    }
  };
};