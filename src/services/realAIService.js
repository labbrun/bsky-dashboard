/**
 * Real AI Service - Actually connects to configured AI APIs
 * No fake content, no mock responses, no hardcoded insights
 * @module realAIService
 */

import { getServiceCredentials } from './credentialsService';
import logger from './loggingService';

/**
 * Real AI Service Class - Makes actual API calls
 */
export class RealAIService {
  constructor() {
    this.config = null;
    this.isConfigured = false;
  }

  /**
   * Initialize the AI service with user's configuration
   */
  async initialize() {
    try {
      this.config = getServiceCredentials('ai');
      this.isConfigured = !!(this.config.apiKey && this.config.baseUrl);
      
      if (this.isConfigured) {
        logger.info('AI Service initialized', {
          provider: this.config.provider,
          baseUrl: this.config.baseUrl,
          hasApiKey: !!this.config.apiKey
        });
      } else {
        logger.warn('AI Service not configured - missing API key or base URL');
      }
      
      return this.isConfigured;
    } catch (error) {
      logger.error('Failed to initialize AI Service', error);
      this.isConfigured = false;
      return false;
    }
  }

  /**
   * Check if AI service is properly configured
   */
  isReady() {
    return this.isConfigured && this.config && this.config.apiKey && this.config.baseUrl;
  }

  /**
   * Make actual API call to the configured AI service
   */
  async makeAPICall(messages, options = {}) {
    if (!this.isReady()) {
      throw new Error('AI service not configured. Please set API key and base URL in Settings.');
    }

    const {
      maxTokens = 1000,
      temperature = 0.7,
      timeout = 30000
    } = options;

    try {
      logger.info('Making AI API call', {
        provider: this.config.provider,
        baseUrl: this.config.baseUrl,
        messageCount: messages.length
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      let apiUrl = this.config.baseUrl;
      let headers = {
        'Content-Type': 'application/json',
      };
      let body = {};

      // Configure request based on provider
      if (this.config.provider === 'openai' || !this.config.provider) {
        // OpenAI-compatible API (most local LLM servers use this format)
        apiUrl = `${this.config.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        body = {
          model: options.model || 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature,
          stream: false
        };
      } else if (this.config.provider === 'anthropic') {
        // Anthropic Claude API
        apiUrl = `${this.config.baseUrl.replace(/\/$/, '')}/v1/messages`;
        headers['x-api-key'] = this.config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        body = {
          model: options.model || 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          messages: messages
        };
      } else {
        // Generic/custom API format
        apiUrl = this.config.baseUrl;
        if (this.config.apiKey) {
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        body = {
          prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n\n'),
          max_tokens: maxTokens,
          temperature: temperature
        };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Extract response content based on provider
      let content = '';
      if (this.config.provider === 'openai' || !this.config.provider) {
        content = data.choices?.[0]?.message?.content || '';
      } else if (this.config.provider === 'anthropic') {
        content = data.content?.[0]?.text || '';
      } else {
        content = data.response || data.text || data.content || data.output || '';
      }

      if (!content) {
        throw new Error('AI API returned empty response');
      }

      logger.info('AI API call successful', {
        responseLength: content.length,
        provider: this.config.provider
      });

      return content;

    } catch (error) {
      logger.error('AI API call failed', error);
      
      if (error.name === 'AbortError') {
        throw new Error(`AI request timed out after ${timeout}ms`);
      }
      
      throw error;
    }
  }

  /**
   * Generate real AI insights for Bluesky metrics
   */
  async generateBlueskyInsights(metrics) {
    console.log('generateBlueskyInsights called with metrics:', !!metrics);
    console.log('AI service isReady:', this.isReady());
    console.log('AI config:', { hasApiKey: !!this.config?.apiKey, hasBaseUrl: !!this.config?.baseUrl, provider: this.config?.provider });
    
    if (!this.isReady()) {
      console.log('AI service not ready - returning null');
      return null;
    }

    const messages = [
      {
        role: 'system',
        content: 'You are an expert social media analyst. Analyze the provided Bluesky metrics and provide specific, actionable insights. Be concise and focus on concrete recommendations.'
      },
      {
        role: 'user',
        content: `Analyze these real Bluesky metrics and provide insights:

Followers: ${metrics.followersCount || 0}
Following: ${metrics.followsCount || 0}
Posts: ${metrics.postsCount || 0}
Total Likes Received: ${metrics.totalLikes || 0}
Total Replies Received: ${metrics.totalReplies || 0}
Total Reposts Received: ${metrics.totalReposts || 0}

Recent Posts Performance:
${metrics.recentPosts?.slice(0, 5).map((post, i) => 
  `Post ${i + 1}: "${post.text?.substring(0, 100)}..."
  - Likes: ${post.likeCount || 0}
  - Replies: ${post.replyCount || 0}
  - Reposts: ${post.repostCount || 0}`
).join('\n') || 'No recent posts available'}

Provide 3-5 specific insights about:
1. Content performance patterns
2. Audience engagement trends  
3. Growth recommendations
4. Content strategy suggestions

Format as clear bullet points.`
      }
    ];

    try {
      const insights = await this.makeAPICall(messages, {
        maxTokens: 800,
        temperature: 0.3
      });

      return {
        type: 'bluesky_insights',
        content: insights,
        timestamp: new Date().toISOString(),
        metricsAnalyzed: {
          followers: metrics.followersCount,
          posts: metrics.postsCount,
          totalEngagement: (metrics.totalLikes || 0) + (metrics.totalReplies || 0) + (metrics.totalReposts || 0)
        }
      };
    } catch (error) {
      logger.error('Failed to generate Bluesky insights', error);
      return null;
    }
  }

  /**
   * Generate real content strategy recommendations
   */
  async generateContentStrategy(metrics, recentPosts = []) {
    if (!this.isReady()) {
      return null;
    }

    const topPosts = recentPosts
      .sort((a, b) => ((b.likeCount || 0) + (b.replyCount || 0) + (b.repostCount || 0)) - 
                      ((a.likeCount || 0) + (a.replyCount || 0) + (a.repostCount || 0)))
      .slice(0, 3);

    const messages = [
      {
        role: 'system',
        content: 'You are a content strategist specializing in social media growth. Analyze the user\'s top-performing content and provide specific content strategy recommendations.'
      },
      {
        role: 'user',
        content: `Based on this real performance data, suggest a content strategy:

Account Stats:
- ${metrics.followersCount || 0} followers
- ${metrics.postsCount || 0} total posts
- Average engagement rate: ${metrics.postsCount > 0 ? 
  Math.round(((metrics.totalLikes + metrics.totalReplies + metrics.totalReposts) / metrics.postsCount) * 100) / 100 : 0} per post

Top Performing Posts:
${topPosts.map((post, i) => 
  `${i + 1}. "${post.text?.substring(0, 150)}..."
     Engagement: ${(post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0)} total`
).join('\n') || 'No posts to analyze'}

Provide specific recommendations for:
1. Content themes to focus on
2. Posting frequency and timing
3. Engagement tactics
4. Growth strategies

Be specific and actionable.`
      }
    ];

    try {
      const strategy = await this.makeAPICall(messages, {
        maxTokens: 600,
        temperature: 0.4
      });

      return {
        type: 'content_strategy',
        content: strategy,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to generate content strategy', error);
      return null;
    }
  }

  /**
   * Analyze specific post performance
   */
  async analyzePostPerformance(post, accountMetrics) {
    if (!this.isReady()) {
      return null;
    }

    const messages = [
      {
        role: 'system',
        content: 'Analyze this social media post performance and explain why it performed well or poorly. Be specific about content elements.'
      },
      {
        role: 'user',
        content: `Analyze this post performance:

Post: "${post.text}"
- Likes: ${post.likeCount || 0}
- Replies: ${post.replyCount || 0}
- Reposts: ${post.repostCount || 0}
- Total Engagement: ${(post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0)}

Account Context:
- Account has ${accountMetrics.followersCount || 0} followers
- Average engagement per post: ${accountMetrics.postsCount > 0 ? 
  Math.round(((accountMetrics.totalLikes + accountMetrics.totalReplies + accountMetrics.totalReposts) / accountMetrics.postsCount)) : 0}

Provide specific analysis of:
1. Why this post performed as it did
2. What content elements worked/didn't work
3. Suggestions for similar future content

Keep it concise but insightful.`
      }
    ];

    try {
      const analysis = await this.makeAPICall(messages, {
        maxTokens: 400,
        temperature: 0.2
      });

      return {
        type: 'post_analysis',
        content: analysis,
        timestamp: new Date().toISOString(),
        postId: post.uri || post.id
      };
    } catch (error) {
      logger.error('Failed to analyze post performance', error);
      return null;
    }
  }
}

// Create singleton instance
const realAIService = new RealAIService();

export default realAIService;