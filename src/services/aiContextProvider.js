// AI Context Provider
// Universal AI guidance integration for all analysis and content suggestions across the app
// This service injects brand voice, customer avatar, and marketing strategies into AI operations

import { loadAllGuidance } from './aiGuidanceLoader';

// Global AI context cache
let aiContext = null;

// Initialize AI context - call this on app startup
export const initializeAIContext = async () => {
  try {
    console.log('Initializing universal AI context...');
    const guidance = await loadAllGuidance();
    
    aiContext = {
      brandVoice: extractBrandVoice(guidance),
      customerAvatar: extractCustomerAvatar(guidance),
      contentStrategies: extractContentStrategies(guidance),
      marketingPsychology: extractMarketingPsychology(guidance),
      blueskyStrategies: extractBlueskyStrategies(guidance),
      
      // Quick access helpers
      targetKeywords: extractTargetKeywords(guidance),
      contentPreferences: extractContentPreferences(guidance),
      engagementTactics: extractEngagementTactics(guidance),
      
      // Metadata
      loadedAt: new Date(),
      isInitialized: true
    };
    
    console.log('AI Context initialized successfully:', {
      hasCustomerAvatar: !!aiContext.customerAvatar,
      hasContentStrategies: !!aiContext.contentStrategies,
      hasMarketingPsychology: !!aiContext.marketingPsychology,
      targetKeywords: aiContext.targetKeywords.length
    });
    
    return aiContext;
  } catch (error) {
    console.error('Failed to initialize AI context:', error);
    aiContext = getDefaultAIContext();
    return aiContext;
  }
};

// Get current AI context (initialize if needed)
export const getAIContext = async () => {
  if (!aiContext) {
    return await initializeAIContext();
  }
  return aiContext;
};

// Generate AI-enhanced content analysis using all guidance
export const enhanceContentAnalysis = async (content, analysisType = 'general') => {
  const context = await getAIContext();
  
  const enhancement = {
    originalContent: content,
    analysisType,
    
    // Brand alignment analysis
    brandAlignment: analyzeBrandAlignment(content, context),
    
    // Audience fit analysis
    audienceFit: analyzeAudienceFit(content, context),
    
    // Content strategy recommendations
    strategyRecommendations: generateStrategyRecommendations(content, context),
    
    // Marketing psychology insights
    psychologyInsights: generatePsychologyInsights(content, context),
    
    // Bluesky-specific optimization
    blueskyOptimization: generateBlueskyOptimization(content, context),
    
    // Overall score and summary
    overallScore: 0, // Will be calculated
    summary: ''
  };
  
  // Calculate overall score based on all factors
  enhancement.overallScore = calculateOverallScore(enhancement);
  
  // Generate summary
  enhancement.summary = generateAnalysisSummary(enhancement, context);
  
  return enhancement;
};

// Generate content suggestions using AI guidance
export const generateAIContentSuggestions = async (sourceContent, targetPlatform = 'bluesky') => {
  const context = await getAIContext();
  
  const suggestions = {
    sourceContent,
    targetPlatform,
    
    // Different types of content suggestions
    quickPosts: generateQuickPostSuggestions(sourceContent, context),
    threadIdeas: generateThreadSuggestions(sourceContent, context),
    engagementPosts: generateEngagementSuggestions(sourceContent, context),
    
    // Hook and opener suggestions
    hooks: generateHookSuggestions(sourceContent, context),
    
    // Timing and strategy recommendations
    postingStrategy: generatePostingStrategy(sourceContent, context),
    
    // Hashtag suggestions
    hashtags: generateHashtagSuggestions(sourceContent, context),
    
    // Cross-platform adaptations
    adaptations: generatePlatformAdaptations(sourceContent, context)
  };
  
  return suggestions;
};

// Extract brand voice guidelines from loaded guidance
const extractBrandVoice = (guidance) => {
  const brandAssets = guidance.brandAssets || {};
  
  return {
    tone: 'Conversational, knowledgeable, and approachable',
    personality: 'Tech-savvy privacy advocate with practical insights',
    values: ['Privacy', 'Control', 'Autonomy', 'Learning', 'Community'],
    avoidWords: ['complicated', 'difficult', 'impossible', 'never'],
    preferredWords: ['simple', 'practical', 'secure', 'private', 'efficient'],
    guidelines: [
      'Use conversational tone while maintaining authority',
      'Include practical examples and real-world applications', 
      'Emphasize privacy and security benefits',
      'Be helpful, not preachy',
      'Focus on cost-effective solutions',
      'Encourage experimentation and learning'
    ],
    // Extract from actual guidance files when available
    fullContext: brandAssets.customerAvatar?.rawContent || ''
  };
};

// Extract customer avatar insights
const extractCustomerAvatar = (guidance) => {
  const brandAssets = guidance.brandAssets || {};
  const avatar = brandAssets.customerAvatar?.parsed || {};
  
  return {
    demographics: avatar.demographics || 'Tech-savvy professionals, entrepreneurs, small business owners',
    interests: avatar.interests || ['Privacy', 'Security', 'Self-hosting', 'Automation', 'Productivity', 'AI'],
    painPoints: avatar.painPoints || [
      'Overwhelmed by information',
      'Budget constraints', 
      'Security concerns',
      'Time limitations',
      'Technical complexity'
    ],
    goals: avatar.goals || [
      'Cost savings',
      'Better privacy', 
      'Increased control',
      'Technical knowledge',
      'Business growth'
    ],
    contentPreferences: avatar.contentPreferences || 'Practical tutorials, step-by-step guides, real-world examples',
    fullContext: brandAssets.customerAvatar?.rawContent || ''
  };
};

// Extract content strategies
const extractContentStrategies = (guidance) => {
  const strategies = guidance.contentStrategies || {};
  
  return {
    repurposing: strategies.repurposingStrategies?.parsed || {
      blogToSocial: 'Extract key insights, create threads, share behind-scenes',
      timeline: 'Immediate announcement, follow-up over 3-5 days'
    },
    calendar: strategies.calendarStrategies?.parsed || {
      frequency: '1-3 posts per day',
      timing: 'Peak hours: 9-11 AM, 1-3 PM, 7-9 PM EST'
    },
    hooks: strategies.hooksAndOpeners?.parsed || {
      types: ['Question hooks', 'Contrarian takes', 'Story openers']
    },
    fullContext: Object.values(strategies).map(s => s.rawContent || '').join('\n\n')
  };
};

// Extract marketing psychology principles
const extractMarketingPsychology = (guidance) => {
  const psychology = guidance.marketingPsychology || {};
  
  return {
    principles: [
      'Social proof - Reference community examples',
      'Authority - Share expertise and experience', 
      'Scarcity - Limited insights, exclusive content',
      'Reciprocity - Provide value before asking',
      'Curiosity - Use hooks and questions',
      'Storytelling - Share personal experiences'
    ],
    viralHooks: psychology.viralHookStrategies?.parsed?.viralHooks || [
      'Question hooks', 
      'Contrarian takes', 
      'Story openers',
      'Behind-the-scenes content'
    ],
    persuasionTechniques: psychology.persuasionTechniques?.parsed?.techniques || [
      'Problem-solution framework',
      'Before-after scenarios', 
      'Social validation',
      'Expert positioning'
    ],
    fullContext: Object.values(psychology).map(p => p.rawContent || '').join('\n\n')
  };
};

// Extract Bluesky-specific strategies
const extractBlueskyStrategies = (guidance) => {
  const strategies = guidance.contentStrategies?.blueskyStrategies?.parsed || {};
  
  return {
    postTypes: strategies.postTypes || ['Insight posts', 'Tutorial threads', 'Question posts'],
    timing: strategies.timingStrategy || 'Peak hours: 9-11 AM, 1-3 PM, 7-9 PM EST',
    engagement: strategies.engagementTactics || 'Ask questions, share experiences, provide value',
    hashtags: strategies.hashtagStrategy || 'Use 2-3 relevant hashtags, focus on niche topics',
    community: 'Privacy-focused, tech enthusiasts, early adopters',
    contentPreferences: 'Technical deep-dives, practical tutorials, privacy insights',
    fullContext: guidance.contentStrategies?.blueskyStrategies?.rawContent || ''
  };
};

// Extract target keywords for content analysis
const extractTargetKeywords = (guidance) => {
  const avatar = guidance.brandAssets?.customerAvatar?.parsed || {};
  const interests = avatar.interests || [];
  
  const baseKeywords = [
    'privacy', 'security', 'self-hosting', 'homelab', 'automation',
    'productivity', 'AI', 'tech', 'business', 'startup', 'entrepreneur',
    'open source', 'decentralized', 'control', 'autonomy'
  ];
  
  return [...new Set([...baseKeywords, ...interests.map(i => i.toLowerCase())])];
};

// Extract content preferences
const extractContentPreferences = (guidance) => {
  
  return {
    formats: ['Tutorials', 'Guides', 'Tips', 'Insights', 'Behind-scenes'],
    tone: 'Conversational but knowledgeable',
    length: 'Detailed but accessible',
    examples: 'Real-world applications',
    engagement: 'Questions and community discussion'
  };
};

// Extract engagement tactics
const extractEngagementTactics = (guidance) => {
  
  return {
    hooks: ['Questions', 'Contrarian views', 'Personal stories', 'Industry insights'],
    cta: ['Ask questions', 'Share experiences', 'Request feedback', 'Invite discussion'],
    community: ['Tag relevant users', 'Reference discussions', 'Share community wins'],
    timing: ['Peak hours posting', 'Follow-up engagement', 'Thread development']
  };
};

// Analyze how well content aligns with brand voice and values
const analyzeBrandAlignment = (content, context) => {
  const contentLower = content.toLowerCase();
  const brandVoice = context.brandVoice;
  let score = 0;
  const feedback = [];
  
  // Check for preferred words
  brandVoice.preferredWords.forEach(word => {
    if (contentLower.includes(word)) {
      score += 10;
      feedback.push(`✓ Good use of preferred word: "${word}"`);
    }
  });
  
  // Check for words to avoid
  brandVoice.avoidWords.forEach(word => {
    if (contentLower.includes(word)) {
      score -= 15;
      feedback.push(`⚠ Consider avoiding: "${word}"`);
    }
  });
  
  // Check for brand values
  brandVoice.values.forEach(value => {
    if (contentLower.includes(value.toLowerCase())) {
      score += 8;
      feedback.push(`✓ Aligns with brand value: ${value}`);
    }
  });
  
  const alignmentScore = Math.max(0, Math.min(100, score + 50)); // Base score of 50
  
  return {
    score: alignmentScore,
    feedback,
    recommendation: generateBrandAlignmentRecommendation(alignmentScore)
  };
};

// Analyze how well content fits target audience
const analyzeAudienceFit = (content, context) => {
  const contentLower = content.toLowerCase();
  const avatar = context.customerAvatar;
  let score = 0;
  const matches = [];
  
  // Check for audience interests
  avatar.interests.forEach(interest => {
    if (contentLower.includes(interest.toLowerCase())) {
      score += 12;
      matches.push(interest);
    }
  });
  
  // Check for pain point relevance
  avatar.painPoints.forEach(pain => {
    const painKeywords = pain.toLowerCase().split(' ');
    if (painKeywords.some(keyword => contentLower.includes(keyword))) {
      score += 15;
      matches.push(`Addresses: ${pain}`);
    }
  });
  
  // Check for goal alignment
  avatar.goals.forEach(goal => {
    const goalKeywords = goal.toLowerCase().split(' ');
    if (goalKeywords.some(keyword => contentLower.includes(keyword))) {
      score += 10;
      matches.push(`Supports goal: ${goal}`);
    }
  });
  
  const fitScore = Math.min(100, score);
  
  return {
    score: fitScore,
    matches,
    recommendation: generateAudienceFitRecommendation(fitScore, matches)
  };
};

// Generate strategy recommendations based on content analysis
const generateStrategyRecommendations = (content, context) => {
  const recommendations = [];
  
  // Repurposing recommendations
  if (content.length > 500) {
    recommendations.push({
      type: 'repurposing',
      action: 'Create thread series',
      reason: 'Content length suitable for multi-post thread',
      priority: 'high'
    });
  }
  
  if (content.toLowerCase().includes('tip') || content.toLowerCase().includes('how to')) {
    recommendations.push({
      type: 'format',
      action: 'Create quick tip posts',
      reason: 'Tutorial content perfect for bite-sized insights',
      priority: 'medium'
    });
  }
  
  return recommendations;
};

// Generate psychology insights for content
const generatePsychologyInsights = (content, context) => {
  const insights = [];
  
  // Check for psychological triggers
  if (content.toLowerCase().includes('you') && content.includes('?')) {
    insights.push({
      principle: 'Engagement',
      observation: 'Content uses direct address and questions',
      suggestion: 'Great for driving interaction and replies'
    });
  }
  
  if (content.toLowerCase().includes('just') || content.toLowerCase().includes('discovered')) {
    insights.push({
      principle: 'Curiosity',
      observation: 'Content creates curiosity gap',
      suggestion: 'Leverage with follow-up content to maintain interest'
    });
  }
  
  return insights;
};

// Generate Bluesky-specific optimization suggestions
const generateBlueskyOptimization = (content, context) => {
  const optimizations = [];
  
  // Length optimization
  if (content.length > 300) {
    optimizations.push({
      type: 'length',
      suggestion: 'Consider breaking into thread for better engagement',
      reason: 'Bluesky users prefer digestible content chunks'
    });
  }
  
  // Hashtag suggestions
  const relevantHashtags = generateHashtagSuggestions(content, context);
  if (relevantHashtags.length > 0) {
    optimizations.push({
      type: 'hashtags',
      suggestion: `Add hashtags: ${relevantHashtags.slice(0, 3).join(', ')}`,
      reason: 'Increase discoverability in Bluesky feeds'
    });
  }
  
  return optimizations;
};

// Generate hook suggestions based on content and psychology principles
const generateHookSuggestions = (content, context) => {
  const hooks = [];
  const contentLower = content.toLowerCase();
  
  // Question hooks
  if (contentLower.includes('problem') || contentLower.includes('challenge')) {
    hooks.push({
      type: 'question',
      hook: 'What if I told you there\'s a simple solution to [problem]?',
      reason: 'Curiosity + solution promise'
    });
  }
  
  // Contrarian hooks
  if (contentLower.includes('everyone') || contentLower.includes('most people')) {
    hooks.push({
      type: 'contrarian',
      hook: 'Unpopular opinion: [contrarian take]',
      reason: 'Challenges common beliefs'
    });
  }
  
  return hooks;
};

// Additional helper functions...
const generateQuickPostSuggestions = (content, context) => {
  // Implementation for quick post generation
  return [];
};

const generateThreadSuggestions = (content, context) => {
  // Implementation for thread generation
  return [];
};

const generateEngagementSuggestions = (content, context) => {
  // Implementation for engagement post generation
  return [];
};

const generatePostingStrategy = (content, context) => {
  const bluesky = context.blueskyStrategies;
  return {
    timing: bluesky.timing,
    frequency: 'Follow up with insights over 3-5 days',
    engagement: 'Respond to comments within 2-4 hours'
  };
};

const generateHashtagSuggestions = (content, context) => {
  const keywords = context.targetKeywords;
  const suggestions = [];
  const contentLower = content.toLowerCase();
  
  keywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      suggestions.push(`#${keyword.charAt(0).toUpperCase()}${keyword.slice(1)}`);
    }
  });
  
  return suggestions.slice(0, 3); // Limit to 3 hashtags
};

const generatePlatformAdaptations = (content, context) => {
  return {
    bluesky: 'Current content',
    twitter: 'Shortened version with thread potential',
    linkedin: 'Professional angle with business benefits'
  };
};

const calculateOverallScore = (enhancement) => {
  const weights = {
    brandAlignment: 0.3,
    audienceFit: 0.3,
    blueskyOptimization: 0.2,
    psychologyInsights: 0.2
  };
  
  let score = 0;
  score += (enhancement.brandAlignment.score || 0) * weights.brandAlignment;
  score += (enhancement.audienceFit.score || 0) * weights.audienceFit;
  score += 75 * weights.blueskyOptimization; // Default optimization score
  score += 70 * weights.psychologyInsights; // Default psychology score
  
  return Math.round(score);
};

const generateAnalysisSummary = (enhancement, context) => {
  const score = enhancement.overallScore;
  
  if (score >= 85) {
    return `Excellent content alignment! This content strongly resonates with your target audience and brand voice. Ready for optimal Bluesky performance.`;
  } else if (score >= 70) {
    return `Good content alignment. Minor adjustments could improve audience resonance and engagement potential.`;
  } else if (score >= 55) {
    return `Moderate alignment. Consider emphasizing privacy/tech angles and using more targeted language for your audience.`;
  } else {
    return `Content needs refinement. Focus on audience interests, brand voice consistency, and Bluesky optimization for better performance.`;
  }
};

const generateBrandAlignmentRecommendation = (score) => {
  if (score >= 80) return 'Strong brand alignment - maintain current approach';
  if (score >= 60) return 'Good alignment - consider emphasizing brand values more';
  return 'Improve alignment by using preferred terminology and focusing on brand values';
};

const generateAudienceFitRecommendation = (score, matches) => {
  if (score >= 80) return `Excellent audience fit! Resonates with: ${matches.slice(0, 3).join(', ')}`;
  if (score >= 60) return 'Good audience targeting - consider adding more specific pain point solutions';
  return 'Improve audience fit by addressing specific interests and pain points more directly';
};

// Default AI context when guidance files aren't available
const getDefaultAIContext = () => ({
  brandVoice: {
    tone: 'Conversational and knowledgeable',
    values: ['Privacy', 'Security', 'Productivity'],
    guidelines: ['Be helpful', 'Focus on practical solutions']
  },
  customerAvatar: {
    interests: ['Privacy', 'Security', 'Tech', 'Productivity'],
    painPoints: ['Information overload', 'Budget constraints'],
    goals: ['Better privacy', 'Increased productivity']
  },
  contentStrategies: {
    repurposing: { blogToSocial: 'Extract insights, create threads' }
  },
  marketingPsychology: {
    principles: ['Social proof', 'Authority', 'Curiosity']
  },
  blueskyStrategies: {
    postTypes: ['Insights', 'Tutorials', 'Questions'],
    timing: 'Peak hours for engagement'
  },
  targetKeywords: ['privacy', 'security', 'tech', 'productivity'],
  isInitialized: true,
  loadedAt: new Date()
});

const aiContextProvider = {
  initializeAIContext,
  getAIContext,
  enhanceContentAnalysis,
  generateAIContentSuggestions
};

export default aiContextProvider;