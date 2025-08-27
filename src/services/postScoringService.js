// Post Scoring Service
// Analyzes and scores social media posts for alignment with audience and performance potential

import { loadAllGuidance } from './aiGuidanceLoader';

class PostScoringService {
  constructor() {
    this.guidance = null;
    this.loadGuidanceData();
  }

  async loadGuidanceData() {
    try {
      this.guidance = await loadAllGuidance();
    } catch (error) {
      console.error('Failed to load guidance data for post scoring:', error);
      this.guidance = this.getFallbackGuidance();
    }
  }

  // Main function to score a post
  async scorePost(postContent, options = {}) {
    if (!this.guidance) {
      await this.loadGuidanceData();
    }

    const {
      scheduledDate = new Date(),
      platform = 'bluesky',
      postType = 'text',
      hasImages = false,
      hasLinks = false,
      targetAudience = 'tech-professionals'
    } = options;

    const scores = {
      overall: 0,
      contentAlignment: await this.scoreContentAlignment(postContent),
      audienceRelevance: await this.scoreAudienceRelevance(postContent),
      engagementPotential: this.scoreEngagementPotential(postContent, hasImages, hasLinks),
      timingOptimization: this.scoreTimingOptimization(scheduledDate),
      platformOptimization: this.scorePlatformOptimization(postContent, platform),
      trendAlignment: await this.scoreTrendAlignment(postContent),
      callToAction: this.scoreCallToAction(postContent),
      readability: this.scoreReadability(postContent)
    };

    // Calculate weighted overall score
    scores.overall = this.calculateOverallScore(scores);

    return {
      scores,
      recommendations: this.generateRecommendations(postContent, scores, options),
      improvements: this.suggestImprovements(postContent, scores),
      estimatedPerformance: this.estimatePerformance(scores),
      metadata: {
        wordCount: postContent.split(/\s+/).length,
        characterCount: postContent.length,
        hashtags: this.extractHashtags(postContent),
        mentions: this.extractMentions(postContent),
        links: this.extractLinks(postContent),
        sentiment: this.analyzeSentiment(postContent)
      }
    };
  }

  // Score content alignment with brand and audience
  async scoreContentAlignment(content) {
    const contentLower = content.toLowerCase();
    let score = 30; // Base score

    // Check alignment with brand topics from guidance
    const brandTopics = this.guidance?.brandAssets?.customerAvatar?.parsed?.interests || 
      ['privacy', 'security', 'homelab', 'self-hosting', 'automation'];

    let topicMatches = 0;
    brandTopics.forEach(topic => {
      if (contentLower.includes(topic.toLowerCase())) {
        topicMatches++;
        score += 15;
      }
    });

    // Check for pain points addressed
    const painPoints = this.guidance?.brandAssets?.customerAvatar?.parsed?.painPoints || 
      ['privacy concerns', 'complex tools', 'information overload'];

    painPoints.forEach(painPoint => {
      if (contentLower.includes(painPoint.toLowerCase().split(' ')[0])) {
        score += 10;
      }
    });

    // Professional tone indicators
    if (contentLower.match(/\b(solution|improve|optimize|secure|efficient)\b/)) score += 10;
    if (contentLower.match(/\b(tip|guide|tutorial|how to)\b/)) score += 15;
    
    return Math.min(100, score);
  }

  // Score relevance to target audience
  async scoreAudienceRelevance(content) {
    const contentLower = content.toLowerCase();
    let score = 40; // Base score

    // Technical audience indicators
    const techTerms = ['api', 'server', 'docker', 'kubernetes', 'vpn', 'ssl', 'encryption', 
                      'monitoring', 'backup', 'network', 'infrastructure', 'devops'];
    
    let techCount = 0;
    techTerms.forEach(term => {
      if (contentLower.includes(term)) {
        techCount++;
        score += 8;
      }
    });

    // Business value indicators
    const businessTerms = ['cost', 'efficiency', 'productivity', 'roi', 'business', 'enterprise'];
    businessTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 6;
      }
    });

    // Avoid overly technical jargon that might alienate broader audience
    const jargonTerms = ['regex', 'grep', 'sed', 'awk', 'kernel', 'syscall'];
    let jargonCount = 0;
    jargonTerms.forEach(term => {
      if (contentLower.includes(term)) {
        jargonCount++;
      }
    });
    
    if (jargonCount > 2) score -= 15;

    return Math.min(100, Math.max(0, score));
  }

  // Score potential for engagement
  scoreEngagementPotential(content, hasImages, hasLinks) {
    let score = 35; // Base score

    const contentLength = content.length;
    
    // Optimal length for Bluesky (100-250 characters tends to perform well)
    if (contentLength >= 100 && contentLength <= 250) {
      score += 20;
    } else if (contentLength >= 50 && contentLength <= 300) {
      score += 10;
    } else if (contentLength < 50) {
      score -= 10;
    }

    // Engagement drivers
    if (content.includes('?')) score += 15; // Questions
    if (content.match(/\b(what|how|why|when|where)\b/i)) score += 10; // Question words
    if (content.includes('!')) score += 8; // Excitement
    if (hasImages) score += 12; // Visual content
    if (hasLinks) score += 8; // External resources

    // Call-to-action indicators
    if (content.match(/\b(share|comment|reply|thoughts|experience)\b/i)) score += 12;
    if (content.match(/\b(agree|disagree|opinion)\b/i)) score += 8;

    // Hashtag optimization
    const hashtags = this.extractHashtags(content);
    if (hashtags.length >= 1 && hashtags.length <= 3) {
      score += 10;
    } else if (hashtags.length > 3) {
      score -= 5; // Too many hashtags can look spammy
    }

    return Math.min(100, score);
  }

  // Score timing optimization
  scoreTimingOptimization(scheduledDate) {
    const date = new Date(scheduledDate);
    const hour = date.getHours();
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    let score = 50; // Base score

    // Optimal posting times for tech audience (based on general social media research)
    // Weekdays 9-11 AM, 1-3 PM, 7-9 PM EST
    if ((hour >= 9 && hour <= 11) || (hour >= 13 && hour <= 15) || (hour >= 19 && hour <= 21)) {
      score += 25;
    } else if ((hour >= 8 && hour <= 12) || (hour >= 17 && hour <= 22)) {
      score += 15;
    } else if (hour >= 6 && hour <= 23) {
      score += 5;
    } else {
      score -= 20; // Very early morning or late night
    }

    // Weekday preference for professional content
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday-Friday
      score += 15;
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      score -= 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  // Score platform-specific optimization
  scorePlatformOptimization(content, platform) {
    let score = 60; // Base score

    if (platform === 'bluesky') {
      // Bluesky character limit is 300
      if (content.length <= 300) {
        score += 20;
      } else {
        score -= 25; // Over limit
      }

      // Bluesky culture tends to favor thoughtful, less promotional content
      if (content.match(/\b(buy|sale|discount|offer|deal)\b/i)) {
        score -= 15; // Promotional language
      }

      // Bluesky users appreciate technical depth
      if (content.match(/\b(tutorial|guide|explanation|analysis)\b/i)) {
        score += 10;
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  // Score alignment with current trends
  async scoreTrendAlignment(content) {
    let score = 45; // Base score

    // Current tech trends (this could be made dynamic by fetching from APIs)
    const trendingTopics = [
      'ai', 'artificial intelligence', 'machine learning', 'privacy', 'security',
      'self-hosting', 'decentralization', 'open source', 'homelab', 'automation',
      'kubernetes', 'docker', 'monitoring', 'cloud costs'
    ];

    const contentLower = content.toLowerCase();
    let trendMatches = 0;
    
    trendingTopics.forEach(trend => {
      if (contentLower.includes(trend)) {
        trendMatches++;
        score += 10;
      }
    });

    // Bonus for multiple trend alignment
    if (trendMatches >= 2) score += 15;

    return Math.min(100, score);
  }

  // Score call-to-action effectiveness
  scoreCallToAction(content) {
    let score = 30; // Base score

    const contentLower = content.toLowerCase();

    // Strong CTAs
    if (contentLower.match(/\b(what do you think|share your|tell me|comment|reply)\b/)) {
      score += 25;
    }

    // Medium CTAs
    if (contentLower.match(/\b(thoughts|experience|opinion|agree)\b/)) {
      score += 15;
    }

    // Weak CTAs
    if (contentLower.match(/\b(check out|link in bio|more info)\b/)) {
      score += 8;
    }

    // Question as CTA
    if (content.includes('?')) {
      score += 12;
    }

    return Math.min(100, score);
  }

  // Score readability
  scoreReadability(content) {
    let score = 50; // Base score

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);

    // Optimal sentence length for social media
    if (avgWordsPerSentence <= 15) {
      score += 20;
    } else if (avgWordsPerSentence <= 20) {
      score += 10;
    } else {
      score -= 10;
    }

    // Paragraph structure (line breaks)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length > 1 && content.length > 150) {
      score += 15; // Good formatting for longer posts
    }

    // Avoid walls of text
    if (content.length > 200 && !content.includes('\n') && !content.includes('.')) {
      score -= 20;
    }

    return Math.min(100, Math.max(0, score));
  }

  // Calculate weighted overall score
  calculateOverallScore(scores) {
    const weights = {
      contentAlignment: 0.25,
      audienceRelevance: 0.20,
      engagementPotential: 0.20,
      timingOptimization: 0.10,
      platformOptimization: 0.10,
      trendAlignment: 0.05,
      callToAction: 0.05,
      readability: 0.05
    };

    let weightedScore = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      weightedScore += (scores[key] || 0) * weight;
    });

    return Math.round(weightedScore);
  }

  // Generate recommendations
  generateRecommendations(content, scores, options) {
    const recommendations = [];

    if (scores.contentAlignment < 70) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        title: 'Improve Content Alignment',
        description: 'Consider mentioning privacy, security, or homelab topics to better align with your audience interests.'
      });
    }

    if (scores.engagementPotential < 60) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        title: 'Boost Engagement',
        description: 'Add a question or call-to-action to encourage audience interaction.'
      });
    }

    if (content.length > 280 && options.platform === 'bluesky') {
      recommendations.push({
        type: 'platform',
        priority: 'high',
        title: 'Reduce Length',
        description: 'Shorten your post to fit within Bluesky\'s character limit for optimal performance.'
      });
    }

    if (scores.timingOptimization < 50) {
      recommendations.push({
        type: 'timing',
        priority: 'low',
        title: 'Optimize Timing',
        description: 'Consider scheduling during peak hours: 9-11 AM, 1-3 PM, or 7-9 PM EST on weekdays.'
      });
    }

    return recommendations;
  }

  // Suggest specific improvements
  suggestImprovements(content, scores) {
    const improvements = [];

    const hashtags = this.extractHashtags(content);
    if (hashtags.length === 0) {
      improvements.push('Add 1-2 relevant hashtags like #homelab #privacy #tech');
    }

    if (!content.includes('?') && scores.engagementPotential < 70) {
      improvements.push('End with a question to encourage replies');
    }

    if (scores.readability < 60 && content.length > 150) {
      improvements.push('Break up long sentences or add line breaks for better readability');
    }

    return improvements;
  }

  // Estimate performance metrics
  estimatePerformance(scores) {
    const overall = scores.overall;
    
    // Rough estimates based on typical social media performance
    const baseEngagement = 0.02; // 2% base engagement rate
    const multiplier = overall / 50; // Score of 50 = 1x multiplier

    return {
      estimatedEngagementRate: (baseEngagement * multiplier).toFixed(3),
      estimatedLikes: Math.round(100 * multiplier),
      estimatedReplies: Math.round(15 * multiplier),
      estimatedShares: Math.round(8 * multiplier),
      confidenceLevel: overall >= 80 ? 'high' : overall >= 60 ? 'medium' : 'low'
    };
  }

  // Utility functions
  extractHashtags(content) {
    return content.match(/#[\w]+/g) || [];
  }

  extractMentions(content) {
    return content.match(/@[\w.-]+/g) || [];
  }

  extractLinks(content) {
    return content.match(/https?:\/\/[^\s]+/g) || [];
  }

  analyzeSentiment(content) {
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'awesome', 'fantastic', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed'];
    
    const contentLower = content.toLowerCase();
    let positive = 0;
    let negative = 0;

    positiveWords.forEach(word => {
      if (contentLower.includes(word)) positive++;
    });

    negativeWords.forEach(word => {
      if (contentLower.includes(word)) negative++;
    });

    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  getFallbackGuidance() {
    return {
      brandAssets: {
        customerAvatar: {
          parsed: {
            interests: ['privacy', 'security', 'homelab', 'self-hosting', 'automation'],
            painPoints: ['privacy concerns', 'complex tools', 'information overload']
          }
        }
      }
    };
  }
}

const postScoringService = new PostScoringService();

export default postScoringService;
export { PostScoringService };