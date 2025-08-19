// AI Insights Service with Customer Avatar Context

import { CUSTOMER_AVATAR, AI_CONTEXT_TEMPLATES } from '../config/customer-avatar.config';
import { LABBRUN_CUSTOMER_AVATAR, LABBRUN_AI_CONTEXT } from '../config/labbrun-customer-avatar.config';
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

// Generate contextual AI prompts based on customer avatar and data
export class AIInsightsGenerator {
  constructor(customerSegment = 'labbrun-primary') {
    this.segment = customerSegment;
    this.trendAnalysisService = new TrendAnalysisService();
    
    // Use LabbRun-specific avatar data when available
    if (customerSegment === 'labbrun-primary') {
      this.customerAvatar = LABBRUN_CUSTOMER_AVATAR.primaryAvatar;
      this.targetAudience = LABBRUN_CUSTOMER_AVATAR.targetAudience;
      this.useLabbrRunContext = true;
    } else {
      this.customerAvatar = CUSTOMER_AVATAR.segments.find(s => s.id === customerSegment) || 
                            CUSTOMER_AVATAR.segments[0];
      this.useLabbrRunContext = false;
    }
  }

  // Build comprehensive context for AI insights
  buildContext(metricsData, insightCategory) {
    let baseContext, segmentContext;
    
    if (this.useLabbrRunContext) {
      baseContext = LABBRUN_AI_CONTEXT.baseContext;
      segmentContext = LABBRUN_AI_CONTEXT.contentGuidelines;
    } else {
      baseContext = AI_CONTEXT_TEMPLATES.baseContext;
      segmentContext = AI_CONTEXT_TEMPLATES.segmentContexts[this.segment] || '';
    }
    
    const dataContext = this.formatMetricsForContext(metricsData);
    const categoryContext = this.getCategoryContext(insightCategory);
    
    return `${baseContext}\n\n${segmentContext}\n\n${categoryContext}\n\n${dataContext}`;
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

  // Generate live trend analysis insights
  async generateLiveTrendAnalysis(metrics) {
    try {
      console.log('🔍 Fetching live trend data...');
      const trendData = await this.trendAnalysisService.getComprehensiveTrends();
      
      return {
        title: 'Live Trend Analysis & Market Intelligence',
        insights: [
          {
            type: 'finding',
            title: `${trendData.topKeywords[0]?.keyword || 'Self-hosting'} discussions trending`,
            description: `Found ${trendData.summary.totalPosts} recent discussions with ${Math.round(trendData.summary.avgEngagement)}% average engagement across platforms.`,
            actionable: true
          },
          {
            type: 'opportunity',
            title: 'High-engagement content opportunities',
            description: `${trendData.trendingTopics.length} trending topics identified with low competition. Create content addressing these hot topics.`,
            potential: 'high'
          },
          {
            type: 'recommendation',
            title: 'Address audience questions',
            description: `${trendData.questions.length} common questions found. Answer these in your content to capture search traffic and engagement.`,
            priority: 'high',
            timeline: '2 weeks'
          },
          {
            type: 'trending',
            title: 'Platform-specific opportunities',
            description: `Reddit discussions show ${trendData.platformBreakdown.reddit.length} trending topics, LinkedIn has ${trendData.platformBreakdown.linkedin.length} business-focused conversations.`,
            actionable: true
          }
        ],
        metrics: [
          { label: 'Live topics analyzed', value: trendData.summary.totalTrends.toString(), trend: 'up' },
          { label: 'Average engagement', value: `${Math.round(trendData.summary.avgEngagement)}%`, trend: 'up' },
          { label: 'Content opportunities', value: `${trendData.questions.length} identified`, trend: 'up' },
          { label: 'Last updated', value: new Date().toLocaleTimeString(), trend: 'stable' }
        ],
        trendingTopics: trendData.trendingTopics.slice(0, 6).map(topic => ({
          topic: topic.title,
          snippet: topic.snippet,
          engagement: topic.engagement,
          platform: topic.source === 'reddit.com' ? 'Reddit' : topic.source === 'linkedin.com' ? 'LinkedIn' : 'Google',
          link: topic.link
        })),
        questions: trendData.questions.slice(0, 6).map(q => ({
          question: q.question,
          link: q.link,
          source: q.source
        })),
        painPoints: trendData.painPoints.slice(0, 6).map(p => ({
          title: p.title,
          snippet: p.snippet,
          link: p.link,
          source: p.source
        }))
      };
    } catch (error) {
      console.error('❌ Error fetching live trend data:', error);
      // Fallback to mock data if API fails
      return this.getMockTrendAnalysis();
    }
  }

  // Fallback mock trend analysis
  getMockTrendAnalysis() {
    return {
      title: 'Trend Analysis & Market Intelligence (Mock Data)',
      insights: [
        {
          type: 'finding',
          title: 'Self-hosting gaining momentum',
          description: 'Interest in self-hosted solutions increased 340% across Reddit and LinkedIn discussions, driven by privacy concerns and cost optimization.',
          actionable: true
        },
        {
          type: 'opportunity',
          title: 'Docker container tutorials trending',
          description: 'High engagement on Docker homelab setups and container management tutorials. Low competition for beginner-friendly content.',
          potential: 'high'
        },
        {
          type: 'recommendation',
          title: 'Address common pain points',
          description: 'Create content addressing top questions: "Docker vs Podman for homelab", "Best self-hosted alternatives to Google Workspace", and "Kubernetes too complex for small business".',
          priority: 'high',
          timeline: '2 weeks'
        },
        {
          type: 'trending',
          title: 'Privacy-first tools discussion spike',
          description: 'Discussions about privacy-focused alternatives to mainstream tools increased 200% this month, especially around email and file sharing.',
          actionable: true
        }
      ],
      metrics: [
        { label: 'Trending keywords match', value: '85%', trend: 'up' },
        { label: 'Market opportunity score', value: '9.2/10', trend: 'up' },
        { label: 'Competition level', value: 'Medium', trend: 'stable' },
        { label: 'Content gap opportunities', value: '12 identified', trend: 'up' }
      ],
      trendingTopics: [
        { 
          topic: 'Self-hosted email servers', 
          snippet: 'Discussion about setting up mail servers at home for better privacy and control over email data.',
          engagement: 95, 
          platform: 'Reddit',
          link: 'https://reddit.com/r/selfhosted/comments/example1'
        },
        { 
          topic: 'Docker homelab automation', 
          snippet: 'Business owners sharing Docker container setups for automating small business workflows.',
          engagement: 88, 
          platform: 'LinkedIn',
          link: 'https://linkedin.com/posts/example1'
        },
        { 
          topic: 'Privacy alternatives to Google', 
          snippet: 'Community recommendations for replacing Google services with privacy-focused alternatives.',
          engagement: 82, 
          platform: 'Reddit',
          link: 'https://reddit.com/r/privacy/comments/example2'
        },
        { 
          topic: 'Kubernetes for small business', 
          snippet: 'Tech leaders discussing whether K8s is worth the complexity for small business automation.',
          engagement: 76, 
          platform: 'LinkedIn',
          link: 'https://linkedin.com/posts/example2'
        },
        { 
          topic: 'Home lab security best practices', 
          snippet: 'Security-focused discussion about protecting home lab infrastructure from threats.',
          engagement: 71, 
          platform: 'Reddit',
          link: 'https://reddit.com/r/homelab/comments/example3'
        },
        { 
          topic: 'Cost-effective self-hosting solutions', 
          snippet: 'Entrepreneurs sharing budget-friendly approaches to hosting their own business tools.',
          engagement: 68, 
          platform: 'LinkedIn',
          link: 'https://linkedin.com/posts/example3'
        }
      ],
      questions: [
        {
          question: 'What is the best self-hosted alternative to Dropbox for small business file sharing?',
          link: 'https://reddit.com/r/selfhosted/comments/question1',
          source: 'reddit.com'
        },
        {
          question: 'How do I set up Docker containers for a home lab without breaking everything?',
          link: 'https://reddit.com/r/homelab/comments/question2',
          source: 'reddit.com'
        },
        {
          question: 'Is Kubernetes overkill for small business automation, or should I stick with Docker?',
          link: 'https://linkedin.com/posts/question1',
          source: 'linkedin.com'
        },
        {
          question: 'Which privacy-focused email provider should I use for my business?',
          link: 'https://reddit.com/r/privacy/comments/question3',
          source: 'reddit.com'
        },
        {
          question: 'How much does it actually cost to self-host vs using SaaS solutions?',
          link: 'https://linkedin.com/posts/question2',
          source: 'linkedin.com'
        },
        {
          question: 'What are the security risks of running a home lab for business purposes?',
          link: 'https://reddit.com/r/homelab/comments/question4',
          source: 'reddit.com'
        }
      ],
      painPoints: [
        {
          title: 'Docker setup too complex for beginners',
          snippet: 'Many users struggle with Docker networking and volume management when starting their home lab journey.',
          link: 'https://reddit.com/r/docker/comments/pain1',
          source: 'reddit.com'
        },
        {
          title: 'Self-hosting requires too much maintenance time',
          snippet: 'Business owners finding it difficult to maintain self-hosted solutions while running their business.',
          link: 'https://linkedin.com/posts/pain1',
          source: 'linkedin.com'
        },
        {
          title: 'Difficult to find reliable self-hosted alternatives',
          snippet: 'Users expressing frustration with the lack of mature alternatives to popular SaaS tools.',
          link: 'https://reddit.com/r/selfhosted/comments/pain2',
          source: 'reddit.com'
        },
        {
          title: 'Privacy tools often lack user-friendly interfaces',
          snippet: 'Small business owners want privacy but struggle with complex interfaces in open-source tools.',
          link: 'https://linkedin.com/posts/pain2',
          source: 'linkedin.com'
        },
        {
          title: 'Cost comparison between self-hosting and SaaS unclear',
          snippet: 'Entrepreneurs need better tools to calculate the true cost of self-hosting vs subscription services.',
          link: 'https://reddit.com/r/entrepreneur/comments/pain3',
          source: 'reddit.com'
        },
        {
          title: 'Limited technical support for home lab setups',
          snippet: 'Business users struggling to find professional support for their self-hosted infrastructure.',
          link: 'https://linkedin.com/posts/pain3',
          source: 'linkedin.com'
        }
      ]
    };
  }

  // Generate segment-specific insights based on customer avatar
  getSegmentSpecificInsights(category, metrics) {
    const avatarName = this.customerAvatar.name || 'your audience';
    const primaryGoals = this.customerAvatar.goals || [];
    const painPoints = this.customerAvatar.painPoints || [];
    const interests = this.customerAvatar.interests || [];

    // Customize insights based on the selected customer segment
    const segmentInsights = {
      [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: this.getContentStrategyForSegment(avatarName, interests, painPoints),
      [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: this.getAudienceGrowthForSegment(avatarName, primaryGoals),
      [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: this.getEngagementForSegment(avatarName, interests),
      [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: this.getPostingOptimizationForSegment(avatarName, painPoints)
    };

    return segmentInsights[category] || this.getDefaultInsights(category);
  }

  getContentStrategyForSegment(avatarName, interests, painPoints) {
    const topInterest = interests[0] || 'technology';
    const topPainPoint = painPoints[0] || 'finding the right tools';
    
    return {
      title: `Content Strategy Analysis for ${avatarName}`,
      insights: [
        {
          type: 'finding',
          title: `High-performing ${topInterest} content patterns`,
          description: `Your posts about ${topInterest.toLowerCase()} and related insights generate 3x more engagement than general updates, resonating strongly with ${avatarName}.`,
          actionable: true
        },
        {
          type: 'recommendation',
          title: `Address ${topPainPoint.toLowerCase()}`,
          description: `Focus 40% of content on helping ${avatarName} with ${topPainPoint.toLowerCase()}, as this directly addresses their primary concern.`,
          priority: 'high',
          timeline: '2 weeks'
        },
        {
          type: 'opportunity',
          title: `${topInterest} thought leadership gap`,
          description: `There's an opportunity to establish thought leadership in ${topInterest.toLowerCase()} for ${avatarName} - low competition, high interest from your audience.`,
          potential: 'high'
        }
      ],
      metrics: [
        { label: 'Optimal post frequency', value: '5-7 posts/week', trend: 'up' },
        { label: 'Best performing content type', value: topInterest + ' insights', trend: 'stable' },
        { label: 'Engagement boost potential', value: '+45%', trend: 'up' }
      ]
    };
  }

  getAudienceGrowthForSegment(avatarName, goals) {
    const primaryGoal = goals[0] || 'achieve success';
    
    return {
      title: `Audience Growth Strategy for ${avatarName}`,
      insights: [
        {
          type: 'finding',
          title: 'Quality follower acquisition',
          description: `Your followers have high engagement rates (8.5%) with ${avatarName}, but growth is slower than industry average for this segment.`,
          actionable: true
        },
        {
          type: 'recommendation', 
          title: `Leverage ${avatarName} communities`,
          description: `Engage with communities focused on "${primaryGoal.toLowerCase()}" to attract quality followers aligned with your avatar.`,
          priority: 'medium',
          timeline: '1 month'
        },
        {
          type: 'opportunity',
          title: 'Cross-platform synergy',
          description: `Your LinkedIn audience of ${avatarName} could be converted to Bluesky followers through strategic cross-posting.`,
          potential: 'medium'
        }
      ],
      metrics: [
        { label: 'Monthly growth rate', value: '12%', trend: 'up' },
        { label: 'Follower quality score', value: '9.1/10', trend: 'stable' },
        { label: 'Conversion potential', value: '240 followers', trend: 'up' }
      ]
    };
  }

  getEngagementForSegment(avatarName, interests) {
    const topInterest = interests[0] || 'technology';
    
    return {
      title: `Engagement Optimization for ${avatarName}`,
      insights: [
        {
          type: 'finding',
          title: 'Peak engagement windows',
          description: `${avatarName} are most active during business hours, with peak engagement 9-11 AM and 2-4 PM EST.`,
          actionable: true
        },
        {
          type: 'recommendation',
          title: 'Implement discussion starters',
          description: `End posts with questions about ${topInterest.toLowerCase()} to increase reply rates from ${avatarName} who value peer insights.`,
          priority: 'high',
          timeline: '1 week'
        },
        {
          type: 'opportunity',
          title: 'Thread engagement potential',
          description: `Long-form threads about ${topInterest.toLowerCase()} could increase average engagement with ${avatarName} by 60%.`,
          potential: 'high'
        }
      ],
      metrics: [
        { label: 'Average engagement rate', value: '8.5%', trend: 'up' },
        { label: 'Reply rate', value: '3.2%', trend: 'stable' },
        { label: 'Share rate', value: '1.8%', trend: 'up' }
      ]
    };
  }

  getPostingOptimizationForSegment(avatarName, painPoints) {
    const topPainPoint = painPoints[0] || 'finding solutions';
    
    return {
      title: `Posting Optimization & Competitive Positioning for ${avatarName}`,
      insights: [
        {
          type: 'finding',
          title: 'Optimal posting times identified',
          description: `${avatarName} are most active during business hours, with 40% higher engagement 10 AM - 12 PM EST and 3-5 PM EST.`,
          actionable: true
        },
        {
          type: 'recommendation',
          title: 'Competitor gap opportunity',
          description: `Analysis shows competitors don't address "${topPainPoint.toLowerCase()}" effectively. Focus on practical solutions to differentiate.`,
          priority: 'high',
          timeline: '1 week'
        },
        {
          type: 'opportunity',
          title: 'Thread format underutilized',
          description: `Long-form threads get 3x more engagement with ${avatarName}, but competitors rarely use this format effectively.`,
          potential: 'high'
        },
        {
          type: 'finding',
          title: 'Weekly posting cadence analysis',
          description: `Consistent 5-7 posts per week outperforms sporadic high-volume posting by 65% for ${avatarName} retention.`,
          actionable: true
        }
      ],
      metrics: [
        { label: 'Optimal posting frequency', value: '5-7 posts/week', trend: 'stable' },
        { label: 'Best engagement window', value: '10 AM - 12 PM EST', trend: 'up' },
        { label: 'Thread engagement boost', value: '+200%', trend: 'up' },
        { label: 'Competitive differentiation score', value: '8.4/10', trend: 'up' }
      ]
    };
  }

  // Generate mock insights for development (replace with actual AI API calls)
  async generateMockInsights(metrics, category = INSIGHT_CATEGORIES.CONTENT_STRATEGY) {
    // Special handling for trend analysis - try live data first
    if (category === INSIGHT_CATEGORIES.TREND_ANALYSIS) {
      return await this.generateLiveTrendAnalysis(metrics);
    }

    // Use segment-specific insights
    const segmentInsights = this.getSegmentSpecificInsights(category, metrics);
    if (segmentInsights) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return segmentInsights;
    }

    // Fallback to original implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const insights = {
      [INSIGHT_CATEGORIES.CONTENT_STRATEGY]: {
        title: 'Content Strategy Analysis',
        insights: [
          {
            type: 'finding',
            title: 'High-performing content patterns',
            description: 'Your posts about tech trends and startup insights generate 3x more engagement than general updates.',
            actionable: true
          },
          {
            type: 'recommendation',
            title: 'Increase industry analysis content',
            description: 'Focus 40% of content on tech industry analysis and startup case studies to better serve your entrepreneur audience.',
            priority: 'high',
            timeline: '2 weeks'
          },
          {
            type: 'opportunity',
            title: 'Thought leadership gap',
            description: 'There\'s an opportunity to establish thought leadership in AI/ML startup space - low competition, high interest from your audience.',
            potential: 'high'
          }
        ],
        metrics: [
          { label: 'Optimal post frequency', value: '5-7 posts/week', trend: 'up' },
          { label: 'Best performing content type', value: 'Industry insights', trend: 'stable' },
          { label: 'Engagement boost potential', value: '+45%', trend: 'up' }
        ]
      },
      [INSIGHT_CATEGORIES.AUDIENCE_GROWTH]: {
        title: 'Audience Growth Strategy',
        insights: [
          {
            type: 'finding',
            title: 'Quality follower acquisition',
            description: 'Your followers have high engagement rates (8.5%) but growth is slower than industry average.',
            actionable: true
          },
          {
            type: 'recommendation', 
            title: 'Leverage tech community hashtags',
            description: 'Engage with #TechStartup and #BuildInPublic communities to attract quality followers aligned with your avatar.',
            priority: 'medium',
            timeline: '1 month'
          },
          {
            type: 'opportunity',
            title: 'Cross-platform synergy',
            description: 'Your LinkedIn audience could be converted to Bluesky followers through strategic cross-posting.',
            potential: 'medium'
          }
        ],
        metrics: [
          { label: 'Monthly growth rate', value: '12%', trend: 'up' },
          { label: 'Follower quality score', value: '9.1/10', trend: 'stable' },
          { label: 'Conversion potential', value: '240 followers', trend: 'up' }
        ]
      },
      [INSIGHT_CATEGORIES.ENGAGEMENT_OPTIMIZATION]: {
        title: 'Engagement Optimization',
        insights: [
          {
            type: 'finding',
            title: 'Peak engagement windows',
            description: 'Your audience is most active 9-11 AM EST and 2-4 PM EST, aligning with business hours.',
            actionable: true
          },
          {
            type: 'recommendation',
            title: 'Implement discussion starters',
            description: 'End posts with questions to increase reply rates from tech entrepreneurs who value peer insights.',
            priority: 'high',
            timeline: '1 week'
          },
          {
            type: 'opportunity',
            title: 'Thread engagement potential',
            description: 'Long-form threads about startup journeys could increase average engagement by 60%.',
            potential: 'high'
          }
        ],
        metrics: [
          { label: 'Average engagement rate', value: '8.5%', trend: 'up' },
          { label: 'Reply rate', value: '3.2%', trend: 'stable' },
          { label: 'Share rate', value: '1.8%', trend: 'up' }
        ]
      },
      [INSIGHT_CATEGORIES.POSTING_OPTIMIZATION]: {
        title: 'Posting Optimization & Competitive Positioning',
        insights: [
          {
            type: 'finding',
            title: 'Optimal posting times identified',
            description: 'Your audience is most active 10 AM - 12 PM EST and 3-5 PM EST, with 40% higher engagement during these windows.',
            actionable: true
          },
          {
            type: 'recommendation',
            title: 'Competitor gap opportunity',
            description: 'Analysis shows competitors post mostly theoretical content. Focus on practical, hands-on tutorials to differentiate.',
            priority: 'high',
            timeline: '1 week'
          },
          {
            type: 'opportunity',
            title: 'Thread format underutilized',
            description: 'Long-form threads get 3x more engagement than single posts, but competitors rarely use this format effectively.',
            potential: 'high'
          },
          {
            type: 'finding',
            title: 'Weekly posting cadence analysis',
            description: 'Consistent 5-7 posts per week outperforms sporadic high-volume posting by 65% in audience retention.',
            actionable: true
          }
        ],
        metrics: [
          { label: 'Optimal posting frequency', value: '5-7 posts/week', trend: 'stable' },
          { label: 'Best engagement window', value: '10 AM - 12 PM EST', trend: 'up' },
          { label: 'Thread engagement boost', value: '+200%', trend: 'up' },
          { label: 'Competitive differentiation score', value: '8.4/10', trend: 'up' }
        ]
      }
    };

    return insights[category] || insights[INSIGHT_CATEGORIES.CONTENT_STRATEGY];
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