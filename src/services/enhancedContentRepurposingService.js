// Enhanced Content Repurposing Service
// Uses universal AI guidance assets to generate highly targeted content suggestions

import { enhanceContentAnalysis, generateAIContentSuggestions, getAIContext } from './aiContextProvider';

// Main content analysis and repurposing function
export const analyzeAndRepurposeBlogContent = async (blogPost, blueskyMetrics = null) => {
  if (!blogPost || !blogPost.content) {
    return {
      error: 'No blog content provided for analysis',
      suggestions: [],
      analysis: null
    };
  }

  try {
    // Get universal AI context (customer avatar, strategies, psychology)
    const aiContext = await getAIContext();
    
    // Perform comprehensive content analysis using all guidance assets
    const contentAnalysis = await enhanceContentAnalysis(blogPost.content, 'blog_repurposing');
    
    // Generate platform-specific content suggestions
    const contentSuggestions = await generateAIContentSuggestions(blogPost.content, 'bluesky');
    
    // Analyze content for specific repurposing opportunities
    const repurposingOpportunities = analyzeRepurposingOpportunities(blogPost, aiContext);
    
    // Generate Bluesky-specific post suggestions using all guidance
    const blueskyPosts = await generateEnhancedBlueskyPosts(blogPost, aiContext, blueskyMetrics);
    
    // Create posting strategy timeline
    const postingStrategy = generateEnhancedPostingStrategy(blogPost, aiContext, blueskyMetrics);
    
    // Generate hooks using marketing psychology
    const viralHooks = generateViralHooks(blogPost, aiContext);
    
    return {
      blogPost: {
        ...blogPost,
        analysisScore: contentAnalysis.overallScore,
        audienceAlignment: contentAnalysis.audienceFit.score
      },
      
      // Comprehensive analysis
      analysis: {
        contentScore: contentAnalysis.overallScore,
        brandAlignment: contentAnalysis.brandAlignment,
        audienceFit: contentAnalysis.audienceFit,
        blueskyOptimization: contentAnalysis.blueskyOptimization,
        summary: contentAnalysis.summary,
        keyInsights: extractKeyInsights(blogPost, aiContext)
      },
      
      // Content suggestions
      suggestions: {
        immediate: blueskyPosts.immediate,
        followUp: blueskyPosts.followUp,
        longTerm: blueskyPosts.longTerm,
        hooks: viralHooks,
        hashtags: generateContextualHashtags(blogPost, aiContext)
      },
      
      // Strategic recommendations
      strategy: {
        postingTimeline: postingStrategy.timeline,
        engagementTactics: postingStrategy.engagement,
        repurposingOpportunities: repurposingOpportunities,
        crossPlatformPotential: analyzeCrossPlatformPotential(blogPost, aiContext)
      },
      
      // Performance predictions
      predictions: {
        blueskyEngagement: predictBlueskyEngagement(blogPost, aiContext, blueskyMetrics),
        viralPotential: assessViralPotential(blogPost, aiContext),
        audienceResonance: contentAnalysis.audienceFit.score
      }
    };
    
  } catch (error) {
    console.error('Content analysis failed:', error);
    return {
      error: error.message,
      suggestions: [],
      analysis: null
    };
  }
};

// Analyze specific repurposing opportunities based on content type and strategy guidance
const analyzeRepurposingOpportunities = (blogPost, aiContext) => {
  const opportunities = [];
  const content = blogPost.content.toLowerCase();
  const title = blogPost.title.toLowerCase();
  const strategies = aiContext.contentStrategies;
  
  // Thread opportunity analysis
  if (blogPost.wordCount > 800) {
    opportunities.push({
      type: 'thread_series',
      priority: 'high',
      description: 'Convert to multi-part thread series',
      reason: `Long-form content (${blogPost.wordCount} words) perfect for thread breakdown`,
      strategy: strategies.repurposing.blogToSocial,
      estimatedPosts: Math.ceil(blogPost.wordCount / 200),
      timeline: 'Spread over 3-5 days for maximum engagement'
    });
  }
  
  // Tutorial breakdown opportunity
  if (title.includes('guide') || title.includes('how to') || content.includes('step')) {
    opportunities.push({
      type: 'tutorial_breakdown',
      priority: 'high', 
      description: 'Break into step-by-step micro-tutorials',
      reason: 'Tutorial content resonates strongly with your audience',
      strategy: 'Each step becomes individual post with practical value',
      estimatedPosts: 3-5,
      audienceAlignment: 95 // High alignment with customer avatar goals
    });
  }
  
  // Behind-the-scenes content
  opportunities.push({
    type: 'behind_scenes',
    priority: 'medium',
    description: 'Share writing process and insights',
    reason: 'Personal connection builds trust and authority',
    strategy: aiContext.marketingPsychology.principles.find(p => p.includes('Authority')),
    timing: '24-48 hours after publishing'
  });
  
  // Question/discussion posts
  if (content.includes('opinion') || content.includes('debate') || content.includes('challenge')) {
    opportunities.push({
      type: 'discussion_starter',
      priority: 'high',
      description: 'Convert controversial points to engagement posts',
      reason: 'Drives community discussion and builds engagement',
      strategy: 'Use contrarian hooks and question formats',
      engagementPotential: 85
    });
  }
  
  return opportunities;
};

// Generate enhanced Bluesky posts using all guidance assets
const generateEnhancedBlueskyPosts = async (blogPost, aiContext, blueskyMetrics) => {
  const posts = {
    immediate: [], // Post within 2 hours
    followUp: [],  // Post over next 3-5 days  
    longTerm: []   // Evergreen content for future use
  };
  
  const keyInsights = extractKeyInsights(blogPost, aiContext);
  const hooks = generateViralHooks(blogPost, aiContext);
  const brandVoice = aiContext.brandVoice;
  const customerAvatar = aiContext.customerAvatar;
  
  // Immediate announcement post
  posts.immediate.push({
    type: 'announcement',
    content: generateAnnouncementPost(blogPost, aiContext),
    timing: 'Within 2 hours of publishing',
    hashtags: generateContextualHashtags(blogPost, aiContext).slice(0, 2),
    expectedEngagement: 'Medium - announcement posts generate steady traffic',
    brandVoiceAlignment: 95
  });
  
  // Key insight posts (follow-up)
  keyInsights.forEach((insight, index) => {
    const hook = hooks[index % hooks.length];
    posts.followUp.push({
      type: 'key_insight',
      content: `${hook.hook}\n\n${insight}\n\nFrom my latest post: ${blogPost.title}\n\nFull read: ${blogPost.link}`,
      timing: `Day ${index + 1} after publishing`,
      hashtags: generateContextualHashtags(insight, aiContext).slice(0, 2),
      expectedEngagement: 'High - insight posts drive discussion',
      audienceAlignment: calculateAudienceAlignment(insight, customerAvatar),
      psychologyPrinciple: hook.psychologyPrinciple
    });
  });
  
  // Thread series for long content
  if (blogPost.wordCount > 600) {
    const threadContent = createThreadContent(blogPost, aiContext);
    posts.followUp.push({
      type: 'thread_series',
      content: threadContent,
      timing: '3-4 days after publishing',
      postCount: threadContent.length,
      hashtags: ['#Thread', ...generateContextualHashtags(blogPost, aiContext).slice(0, 2)],
      expectedEngagement: 'Very High - threads perform exceptionally well',
      strategy: 'Break into digestible chunks with clear progression'
    });
  }
  
  // Question/engagement post
  posts.followUp.push({
    type: 'engagement_question',
    content: generateEngagementQuestion(blogPost, aiContext),
    timing: '5-7 days after publishing', 
    hashtags: generateContextualHashtags(blogPost, aiContext).slice(0, 2),
    expectedEngagement: 'High - questions drive replies and discussion',
    communityBuilding: true
  });
  
  // Long-term evergreen content
  posts.longTerm.push({
    type: 'evergreen_tip',
    content: generateEvergreenTip(blogPost, aiContext),
    timing: 'Reusable anytime',
    hashtags: generateContextualHashtags(blogPost, aiContext),
    expectedEngagement: 'Consistent - evergreen content has lasting value',
    reusable: true
  });
  
  return posts;
};

// Generate posting strategy using content calendar and timing guidance
const generateEnhancedPostingStrategy = (blogPost, aiContext, blueskyMetrics) => {
  const blueskyStrategies = aiContext.blueskyStrategies;
  const contentStrategies = aiContext.contentStrategies;
  
  return {
    timeline: {
      immediate: {
        action: 'Publish announcement post',
        timing: 'Within 2 hours of blog publication',
        reasoning: 'Strike while blog traffic is highest',
        expectedReach: 'Current followers + immediate discovery'
      },
      day1: {
        action: 'Share key insight #1',
        timing: '24 hours after publishing',
        reasoning: 'Maintain momentum while still trending',
        hook: 'Use curiosity or contrarian hook'
      },
      day3: {
        action: 'Post thread series or tutorial breakdown',
        timing: '3 days after publishing',
        reasoning: 'Deeper engagement when audience is primed',
        format: 'Multi-post thread with clear value'
      },
      day5: {
        action: 'Engagement question or discussion starter',
        timing: '5 days after publishing',
        reasoning: 'Build community discussion around topic',
        focus: 'Drive replies and build relationships'
      },
      ongoing: {
        action: 'Repurpose as evergreen content',
        timing: 'Monthly or quarterly',
        reasoning: 'Extend content lifecycle and reach new audiences',
        variation: 'Update with new examples or insights'
      }
    },
    
    engagement: {
      timing: blueskyStrategies.timing,
      frequency: 'Maximum 1 blog-related post per day to avoid oversaturation',
      responseStrategy: 'Respond to comments within 2-4 hours during peak times',
      communityBuilding: 'Tag relevant community members and start discussions',
      hashtagStrategy: blueskyStrategies.hashtags
    },
    
    optimization: {
      bestPerformingFormat: 'Insight posts with questions generate highest engagement',
      audiencePreference: blueskyStrategies.contentPreferences,
      platformSpecific: 'Bluesky users prefer authentic, technical content with real value',
      avoidance: 'Minimize sales-focused language, focus on value and community'
    }
  };
};

// Generate viral hooks using marketing psychology principles
const generateViralHooks = (blogPost, aiContext) => {
  const hooks = [];
  const psychology = aiContext.marketingPsychology;
  const title = blogPost.title;
  const content = blogPost.content.toLowerCase();
  
  // Question hooks (curiosity principle)
  hooks.push({
    hook: `What if I told you ${title.toLowerCase()} could change everything?`,
    type: 'curiosity_question',
    psychologyPrinciple: 'Curiosity Gap',
    usage: 'Opens loops that demand resolution',
    expectedEngagement: 'High'
  });
  
  // Contrarian hooks (challenge common beliefs)
  if (content.includes('everyone') || content.includes('most people')) {
    hooks.push({
      hook: `Unpopular opinion about ${extractMainTopic(title)}:`,
      type: 'contrarian',
      psychologyPrinciple: 'Cognitive Dissonance',
      usage: 'Challenges assumptions to drive engagement',
      expectedEngagement: 'Very High'
    });
  }
  
  // Authority hooks (demonstrate expertise)
  hooks.push({
    hook: `After ${getExperienceContext(content)}, here's what I learned about ${extractMainTopic(title)}:`,
    type: 'authority',
    psychologyPrinciple: 'Social Proof + Authority',
    usage: 'Establishes credibility before sharing insights',
    expectedEngagement: 'Medium-High'
  });
  
  // Problem-solution hooks (addresses pain points)
  const painPoints = aiContext.customerAvatar.painPoints;
  const relevantPain = painPoints.find(pain => 
    content.includes(pain.toLowerCase().split(' ')[0])
  );
  
  if (relevantPain) {
    hooks.push({
      hook: `Struggling with ${relevantPain.toLowerCase()}? Here's what actually works:`,
      type: 'problem_solution',
      psychologyPrinciple: 'Pain Point Resolution',
      usage: 'Directly addresses audience struggles',
      expectedEngagement: 'Very High',
      audienceAlignment: 95
    });
  }
  
  // Story hooks (personal connection)
  hooks.push({
    hook: `This ${extractMainTopic(title)} mistake almost cost me everything...`,
    type: 'story_teaser',
    psychologyPrinciple: 'Narrative Transportation',
    usage: 'Personal stories create emotional connection',
    expectedEngagement: 'High'
  });
  
  return hooks.slice(0, 5); // Return top 5 hooks
};

// Helper functions for content generation

const extractKeyInsights = (blogPost, aiContext) => {
  const content = blogPost.content;
  const sentences = content.match(/[^\.!?]+[\.!?]+/g) || [];
  const insights = [];
  
  // Look for actionable insights and key takeaways
  const insightPatterns = [
    /the key (is|to)/i,
    /important to (understand|know|remember)/i,
    /what (matters|works) most/i,
    /the biggest (mistake|problem|challenge)/i,
    /here's why/i,
    /the truth is/i
  ];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 30 && trimmed.length < 200) {
      const hasInsightPattern = insightPatterns.some(pattern => pattern.test(trimmed));
      if (hasInsightPattern) {
        insights.push(trimmed);
      }
    }
  });
  
  // If no pattern-based insights, extract from paragraph starts
  if (insights.length === 0) {
    const paragraphs = content.split('\n\n');
    paragraphs.slice(0, 5).forEach(paragraph => {
      const firstSentence = paragraph.split('.')[0] + '.';
      if (firstSentence.length > 40 && firstSentence.length < 180) {
        insights.push(firstSentence.trim());
      }
    });
  }
  
  return insights.slice(0, 5);
};

const generateContextualHashtags = (content, aiContext) => {
  const contentLower = typeof content === 'string' ? content.toLowerCase() : '';
  const targetKeywords = aiContext.targetKeywords;
  const hashtags = [];
  
  // Check content against target keywords
  targetKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      const hashtag = '#' + keyword.charAt(0).toUpperCase() + keyword.slice(1).replace(/\s+/g, '');
      if (!hashtags.includes(hashtag)) {
        hashtags.push(hashtag);
      }
    }
  });
  
  // Add platform-specific hashtags based on content type
  if (contentLower.includes('tutorial') || contentLower.includes('guide')) {
    hashtags.push('#Tutorial');
  }
  if (contentLower.includes('tip') || contentLower.includes('advice')) {
    hashtags.push('#TechTips');
  }
  if (contentLower.includes('privacy') || contentLower.includes('security')) {
    hashtags.push('#PrivacyFirst');
  }
  
  return hashtags.slice(0, 4); // Limit to 4 hashtags
};

const generateAnnouncementPost = (blogPost, aiContext) => {
  const brandVoice = aiContext.brandVoice;
  const customerAvatar = aiContext.customerAvatar;
  
  // Create announcement that aligns with brand voice and audience interests
  const relevantInterests = customerAvatar.interests.filter(interest =>
    blogPost.content.toLowerCase().includes(interest.toLowerCase())
  ).slice(0, 2);
  
  return `📝 New post: "${blogPost.title}"\n\n${blogPost.excerpt}\n\n${relevantInterests.length > 0 ? `Perfect for anyone interested in ${relevantInterests.join(' & ')}.` : ''}\n\nRead more: ${blogPost.link}`;
};

const createThreadContent = (blogPost, aiContext) => {
  const insights = extractKeyInsights(blogPost, aiContext);
  const thread = [];
  
  // Thread intro
  thread.push(`🧵 Thread: Key takeaways from "${blogPost.title}"\n\n1/ Here's what you need to know:`);
  
  // Add insights as thread posts
  insights.forEach((insight, index) => {
    thread.push(`${index + 2}/ ${insight}`);
  });
  
  // Thread conclusion
  thread.push(`${insights.length + 2}/ What questions do you have about this approach?\n\nFull post: ${blogPost.link}`);
  
  return thread;
};

const generateEngagementQuestion = (blogPost, aiContext) => {
  const customerAvatar = aiContext.customerAvatar;
  const mainTopic = extractMainTopic(blogPost.title);
  
  return `Question for the community:\n\nAfter reading about ${mainTopic}, I'm curious:\n\nWhat's been your biggest challenge in this area?\n\nContext: ${blogPost.link}`;
};

const generateEvergreenTip = (blogPost, aiContext) => {
  const insights = extractKeyInsights(blogPost, aiContext);
  if (insights.length > 0) {
    return `💡 Pro tip:\n\n${insights[0]}\n\nThis insight from my experience with ${extractMainTopic(blogPost.title)} has been game-changing.`;
  }
  
  return `💡 Key lesson from my latest post:\n\n${blogPost.excerpt}\n\nWhat's been your experience with this?`;
};

// Utility functions
const extractMainTopic = (title) => {
  // Extract the main topic from blog title
  const words = title.toLowerCase().split(' ');
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'why', 'when', 'where'];
  const mainWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
  return mainWords.slice(0, 2).join(' ');
};

const getExperienceContext = (content) => {
  const experienceIndicators = [
    'years of experience',
    'working with',
    'helping clients',
    'building systems',
    'testing solutions'
  ];
  
  for (const indicator of experienceIndicators) {
    if (content.includes(indicator)) {
      return indicator.replace('of experience', '').trim();
    }
  }
  
  return 'extensive experience';
};

const calculateAudienceAlignment = (content, customerAvatar) => {
  const contentLower = content.toLowerCase();
  let score = 0;
  
  customerAvatar.interests.forEach(interest => {
    if (contentLower.includes(interest.toLowerCase())) {
      score += 20;
    }
  });
  
  customerAvatar.painPoints.forEach(pain => {
    if (contentLower.includes(pain.toLowerCase().split(' ')[0])) {
      score += 15;
    }
  });
  
  return Math.min(100, score);
};

const predictBlueskyEngagement = (blogPost, aiContext, blueskyMetrics) => {
  let score = 50; // Base score
  
  // Analyze content alignment
  const audienceAlignment = calculateAudienceAlignment(blogPost.content, aiContext.customerAvatar);
  score += audienceAlignment * 0.3;
  
  // Factor in content type preferences
  if (blogPost.title.toLowerCase().includes('tutorial') || blogPost.title.toLowerCase().includes('guide')) {
    score += 15; // Tutorials perform well with this audience
  }
  
  if (blogPost.content.toLowerCase().includes('privacy') || blogPost.content.toLowerCase().includes('security')) {
    score += 20; // High-interest topics
  }
  
  // Historical performance factor
  if (blueskyMetrics) {
    const avgEngagement = (blueskyMetrics.totalLikes + blueskyMetrics.totalReplies + blueskyMetrics.totalReposts) / Math.max(blueskyMetrics.postsCount, 1);
    if (avgEngagement > 10) score += 10;
    if (avgEngagement > 20) score += 15;
  }
  
  return Math.min(100, Math.round(score));
};

const assessViralPotential = (blogPost, aiContext) => {
  let potential = 30; // Base viral potential
  
  const content = blogPost.content.toLowerCase();
  const title = blogPost.title.toLowerCase();
  
  // Controversial or contrarian content
  if (content.includes('unpopular') || content.includes('controversial') || title.includes('wrong')) {
    potential += 25;
  }
  
  // Practical, immediately actionable content
  if (title.includes('how to') || content.includes('step by step')) {
    potential += 20;
  }
  
  // Trending topics in target audience
  const trendingKeywords = ['ai', 'privacy', 'self-hosting', 'automation'];
  trendingKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      potential += 10;
    }
  });
  
  return Math.min(100, potential);
};

const analyzeCrossPlatformPotential = (blogPost, aiContext) => {
  return {
    bluesky: {
      fit: 90,
      reasoning: 'Perfect audience alignment with privacy-focused, tech-savvy community',
      optimization: 'Use technical depth and privacy angles'
    },
    twitter: {
      fit: 60, 
      reasoning: 'Broader audience but can work with proper hooks',
      optimization: 'Focus on controversial angles and quick tips'
    },
    linkedin: {
      fit: 40,
      reasoning: 'Limited fit unless emphasizing business benefits',
      optimization: 'Highlight ROI, cost savings, and business applications'
    }
  };
};

export default {
  analyzeAndRepurposeBlogContent
};