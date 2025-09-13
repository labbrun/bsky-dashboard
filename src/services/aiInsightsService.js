// AI Insights Service with Universal AI Guidance Context
// Now uses universal AI guidance assets for all analysis and suggestions

import { getAIContext } from './aiContextProvider';
import TrendAnalysisService from './trendAnalysisService';

// AI Insights Categories
export const INSIGHT_CATEGORIES = {
  CONTENT_STRATEGY: 'content_strategy',
  AUDIENCE_GROWTH: 'audience_growth', 
  ENGAGEMENT_OPTIMIZATION: 'engagement_optimization',
  TREND_ANALYSIS: 'trend_analysis',
  POSTING_OPTIMIZATION: 'posting_optimization',
  BRAND_POSITIONING: 'brand_positioning'
};

// Generate contextual AI prompts based on universal guidance assets
export class AIInsightsGenerator {
  constructor(customerSegment = 'labbrun-primary') {
    this.segment = customerSegment;
    this.trendAnalysisService = new TrendAnalysisService();
    this.aiContext = null; // Will be loaded from universal guidance
  }
  
  // Initialize with universal AI context
  async initialize() {
    if (!this.aiContext) {
      this.aiContext = await getAIContext();
      console.log('AIInsightsGenerator initialized with universal context:', {
        hasCustomerAvatar: !!this.aiContext.customerAvatar,
        hasContentStrategies: !!this.aiContext.contentStrategies,
        targetKeywords: this.aiContext.targetKeywords?.length || 0
      });
    }
    return this.aiContext;
  }

  // Build comprehensive context for AI insights using universal guidance
  async buildContext(metricsData, insightCategory) {
    await this.initialize();
    
    const context = this.aiContext;
    const dataContext = this.formatMetricsForContext(metricsData);
    const categoryContext = this.getCategoryContext(insightCategory);
    
    // Build comprehensive context using all guidance assets
    const fullContext = `
## Brand Voice & Personality
${JSON.stringify(context.brandVoice, null, 2)}

## Target Customer Avatar
${JSON.stringify(context.customerAvatar, null, 2)}

## Content Strategies
${JSON.stringify(context.contentStrategies, null, 2)}

## Bluesky Platform Strategies  
${JSON.stringify(context.blueskyStrategies, null, 2)}

## Marketing Psychology Principles
${JSON.stringify(context.marketingPsychology, null, 2)}

## Current Performance Data
${dataContext}

## Analysis Category Focus
${categoryContext}

## Target Keywords
${context.targetKeywords.join(', ')}

Provide insights that align with the brand voice, resonate with the customer avatar, and leverage the marketing psychology principles for maximum engagement on Bluesky.
`;
    
    return fullContext;
  }

  // Format metrics data for AI context
  formatMetricsForContext(metrics) {
    if (!metrics) return 'No metrics data available.';

    return `
CURRENT PERFORMANCE METRICS:
- Handle: @${metrics.handle}
- Followers: ${metrics.followersCount?.toLocaleString() || 0}
- Following: ${metrics.followsCount?.toLocaleString() || 0} 
- Posts: ${metrics.postsCount?.toLocaleString() || 0}
- Total Engagement: ${(metrics.totalLikes + metrics.totalReplies + metrics.totalReposts)?.toLocaleString() || 0}
- Average Engagement per Post: ${metrics.postsCount > 0 ? Math.round((metrics.totalLikes + metrics.totalReplies + metrics.totalReposts) / metrics.postsCount) : 0}

RECENT CONTENT PERFORMANCE:
${metrics.recentPosts?.slice(0, 5).map((post, i) => `
Post ${i + 1}: "${post.text?.substring(0, 100)}${post.text?.length > 100 ? '...' : ''}"
- Likes: ${post.likeCount || 0}
- Replies: ${post.replyCount || 0} 
- Reposts: ${post.repostCount || 0}
- Total Engagement: ${(post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0)}
`).join('') || 'No recent posts available.'}

FOLLOWER SAMPLE:
${metrics.sampleFollowers?.slice(0, 3).map(f => `- ${f.displayName} (@${f.handle})`).join('\n') || 'No follower data available.'}
    `;
  }

  // Get category-specific context and instructions
  getCategoryContext(category) {
    // Use LabbRun-specific contexts when applicable
    const contexts = this.useLabbrRunContext ? this.getLabbrRunCategoryContexts() : this.getGenericCategoryContexts();
    return contexts[category] || contexts[INSIGHT_CATEGORIES.CONTENT_STRATEGY];
  }
  
  getLabbrRunCategoryContexts() {
    return {
      [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: `
INSIGHT CATEGORY: Content Strategy Analysis for Home Lab & Self-Hosting Audience
Focus on content that helps the audience achieve cost savings, privacy, and technical autonomy.

Consider for LabbRun audience:
- Self-hosting tutorials and guides that save money on SaaS subscriptions
- Home lab project walkthroughs with clear ROI
- Tool reviews focusing on cost-effectiveness and privacy
- Step-by-step technical guides for basic-to-intermediate skill levels
- Community-building content that encourages peer support
- Content addressing security and privacy concerns

Prioritize practical value, clear instructions, and real-world cost savings.
      `,
      
      [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: `
INSIGHT CATEGORY: Audience Growth for Home Lab Community
Focus on attracting small business owners and tech hobbyists interested in self-hosting.

Consider for LabbRun audience:
- Attracting entrepreneurs looking to reduce operational costs
- Engaging with home lab and self-hosting communities
- Building trust through authentic, helpful content
- Connecting with budget-conscious tech enthusiasts
- Growing within privacy-focused and open-source communities
- Leveraging peer recommendations and word-of-mouth

Focus on quality followers who value practical tech guidance over vanity metrics.
      `,
      
      [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: `
INSIGHT CATEGORY: Engagement Optimization for Technical Community
Focus on meaningful interactions that build community and provide value.

Consider for LabbRun audience:
- Encouraging questions about home lab setups and challenges
- Facilitating peer-to-peer learning and problem-solving
- Creating content that prompts sharing of personal experiences
- Building discussions around cost savings and efficiency
- Engaging with comments through helpful, detailed responses
- Fostering community support and knowledge sharing

Prioritize helpful, educational engagement that builds long-term relationships.
      `,
      
      [INSIGHT_CATEGORIES.TREND_ANALYSIS]: `
INSIGHT CATEGORY: Technology Trends for Home Lab & Self-Hosting
Identify emerging trends relevant to cost-conscious tech enthusiasts.

Consider for LabbRun audience:
- New self-hosting solutions and open-source alternatives
- Emerging privacy tools and security practices
- Cost-effective hardware trends for home labs
- Changes in SaaS pricing that create self-hosting opportunities
- New automation tools for small business efficiency
- Community discussions and popular topics in home lab forums

Focus on trends that offer practical value and cost savings.
      `,
      
      [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: `
INSIGHT CATEGORY: Posting Optimization & Competitive Positioning
Optimize posting schedule, format, and competitive positioning for global home lab audience.

Consider for LabbRun audience:
TIMING & FORMAT:
- Global audience spanning multiple time zones
- Home-based workers with flexible schedules
- Technical content that may require focused reading time
- Mix of quick tips and in-depth tutorials
- Community engagement patterns in tech forums
- Optimal times for reaching small business owners

COMPETITIVE POSITIONING:
- Other home lab content creators and their approaches
- Gaps in practical, beginner-friendly guidance
- Opportunities for unique value in cost-focused content
- Differentiation through business-oriented home lab content
- Building authority in specific niches (self-hosting, automation, etc.)
- Community partnerships and collaboration opportunities

Balance consistency with quality, prioritizing value over frequency and unique positioning.
      `,
      
      [INSIGHT_CATEGORIES.BRAND_POSITIONING]: `
INSIGHT CATEGORY: Brand Positioning for Home Lab Authority
Build authority as trusted source for practical self-hosting guidance.

Consider for LabbRun audience:
- Positioning as experienced peer rather than distant expert
- Building trust through transparent, honest content
- Emphasizing practical value and real-world experience
- Focusing on cost savings and business value
- Maintaining approachable, educational tone
- Building reputation for reliable, tested recommendations

Focus on authentic authority built through consistent value delivery.
      `
    };
  }
  
  getGenericCategoryContexts() {
    return {
      [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: `
INSIGHT CATEGORY: Content Strategy Analysis
Focus on analyzing content performance and providing strategic recommendations for future content creation.

Consider:
- Which content types perform best with this audience
- Content themes that resonate with tech entrepreneurs
- Optimal content mix and frequency
- Content gaps or opportunities
- Alignment with customer avatar preferences and pain points

Provide specific, actionable recommendations for content strategy improvement.
      `,
      
      [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: `
INSIGHT CATEGORY: Audience Growth Strategy
Analyze follower growth patterns and provide recommendations for sustainable audience building.

Consider:
- Current growth trajectory and benchmarks
- Follower quality vs quantity for this target market
- Networking opportunities within the tech entrepreneur community
- Strategies to attract the ideal customer avatar
- Cross-platform growth opportunities

Provide practical growth tactics tailored to the tech entrepreneur audience.
      `,

      [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: `
INSIGHT CATEGORY: Engagement Optimization
Analyze engagement patterns and provide recommendations to increase meaningful interactions.

Consider:
- Engagement rate benchmarks for this industry/audience
- Types of content that generate meaningful discussions
- Optimal posting times for the target demographic
- Community building strategies for tech professionals
- Ways to encourage valuable interactions vs vanity metrics

Focus on engagement quality that leads to business outcomes.
      `,

      [INSIGHT_CATEGORIES.TREND_ANALYSIS]: `
INSIGHT CATEGORY: Industry & Platform Trend Analysis
Identify relevant trends and opportunities in the tech/startup space on Bluesky.

Consider:
- Emerging topics in the tech entrepreneur community
- Platform-specific trends and features
- Industry conversations and thought leadership opportunities
- Competitive landscape and positioning
- Seasonal or cyclical trends affecting the target market

Provide trend-based content and engagement recommendations.
      `,

      [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: `
INSIGHT CATEGORY: Posting Schedule & Competitive Positioning
Analyze posting patterns, competitive landscape, and optimization strategies.

POSTING OPTIMIZATION:
- Optimal posting frequency for professional audience
- Best times to reach tech entrepreneurs globally
- Content format preferences (text, threads, images, links)
- Consistency and reliability in posting
- Platform-specific best practices for Bluesky

COMPETITIVE ANALYSIS:
- Benchmarking against similar accounts in the tech space
- Content gaps in the market that could be filled
- Unique value proposition opportunities
- Thought leadership positioning for the target audience
- Partnership and collaboration opportunities

Provide data-driven posting strategy and competitive positioning recommendations.
      `,

      [INSIGHT_CATEGORIES.BRAND_POSITIONING]: `
INSIGHT CATEGORY: Brand Positioning & Voice
Analyze brand presence and provide recommendations for stronger positioning.

Consider:
- Alignment with customer avatar values and interests
- Differentiation in the crowded tech space
- Thought leadership opportunities
- Brand voice consistency and authenticity
- Professional credibility building

Focus on positioning strategies that resonate with the target market.
      `
    };
  }

  // Generate specific insight prompts for different categories
  generateInsightPrompts(metrics, categories = [INSIGHT_CATEGORIES.CONTENT_STRATEGY]) {
    return categories.map(category => ({
      category,
      prompt: this.buildContext(metrics, category),
      instructions: `
Based on the context provided, generate 3-5 specific, actionable insights and recommendations.

Format your response as:

## ${this.getCategoryTitle(category)} Insights

### Key Findings
- [Bullet point findings based on data analysis]

### Recommendations
1. **[Actionable Recommendation Title]**
   - Specific action steps
   - Expected outcome
   - Timeline/priority

2. **[Next Recommendation]**
   - Action steps
   - Expected outcome  
   - Timeline/priority

### Success Metrics
- Specific KPIs to track
- Benchmarks to aim for
- Timeline for results

Keep insights practical, data-driven, and specifically relevant to the target audience of tech entrepreneurs and startup founders.
      `
    }));
  }

  getCategoryTitle(category) {
    const titles = {
      [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: 'Content Strategy',
      [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: 'Audience Growth',
      [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: 'Engagement Optimization', 
      [INSIGHT_CATEGORIES.TREND_ANALYSIS]: 'Trend Analysis',
      [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: 'Posting Optimization',
      [INSIGHT_CATEGORIES.BRAND_POSITIONING]: 'Brand Positioning'
    };
    return titles[category] || 'Insights';
  }



  // Check if AI service is configured and available
  async generateInsights(metrics, category = INSIGHT_CATEGORIES.CONTENT_STRATEGY) {
    // Get AI configuration
    const { getServiceCredentials } = await import('./credentialsService');
    const aiConfig = getServiceCredentials('ai');
    
    // Return null if no AI API is configured - UI will show settings link
    if (!aiConfig.apiKey || !aiConfig.baseUrl) {
      console.log('AI service not configured - missing API key or base URL');
      return null;
    }
    
    try {
      // Build the insight prompt
      const context = await this.buildContext(metrics, category);
      const prompts = this.generateInsightPrompts(metrics, [category]);
      const prompt = prompts[0];
      
      // Make API call to configured AI service
      const response = await this.callAIService(context, prompt.instructions, aiConfig);
      
      if (response) {
        return {
          category,
          content: response,
          timestamp: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return null;
    }
  }
  
  // Make API call to configured AI service
  async callAIService(context, instructions, aiConfig) {
    const { provider, apiKey, baseUrl } = aiConfig;
    
    try {
      let apiUrl = baseUrl;
      let headers = {
        'Content-Type': 'application/json',
      };
      let body = {};
      
      // Configure for different providers
      if (provider === 'openai' || !provider) {
        // OpenAI-compatible API
        apiUrl = `${baseUrl}/v1/chat/completions`;
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media and content marketing analyst. Provide actionable insights based on the data provided.'
            },
            {
              role: 'user',
              content: `${context}\n\n${instructions}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        };
      } else {
        // Generic API format
        body = {
          prompt: `${context}\n\n${instructions}`,
          max_tokens: 500
        };
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        timeout: 15000 // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract response based on provider
      if (provider === 'openai' || !provider) {
        return data.choices?.[0]?.message?.content || data.response;
      } else {
        return data.response || data.text || data.content;
      }
      
    } catch (error) {
      console.error('AI service call failed:', error);
      throw error;
    }
  }
}

// Utility functions
export const getInsightIcon = (category) => {
  const icons = {
    [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: 'FileText',
    [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: 'Users', 
    [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: 'MessageSquare',
    [INSIGHT_CATEGORIES.TREND_ANALYSIS]: 'TrendingUp',
    [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: 'Clock',
    [INSIGHT_CATEGORIES.BRAND_POSITIONING]: 'Award'
  };
  return icons[category] || 'Lightbulb';
};

export const getInsightColor = (category) => {
  const colors = {
    [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: 'blue',
    [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: 'green',
    [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: 'purple', 
    [INSIGHT_CATEGORIES.TREND_ANALYSIS]: 'orange',
    [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: 'indigo',
    [INSIGHT_CATEGORIES.BRAND_POSITIONING]: 'yellow'
  };
  return colors[category] || 'gray';
};

export default AIInsightsGenerator;