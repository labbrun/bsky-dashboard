// Customer Avatar and Target Market Configuration for AI Insights

export const CUSTOMER_AVATAR = {
  // Primary Customer Segments
  segments: [
    {
      id: 'tech-entrepreneurs',
      name: 'Tech Entrepreneurs & Startup Founders',
      description: 'Early-stage startup founders and entrepreneurs in the tech space',
      demographics: {
        ageRange: '25-45',
        income: '$50k-$500k+',
        education: 'College+',
        location: 'Global, primarily US/EU/APAC tech hubs',
        occupation: 'Founder, CTO, Tech Lead, Product Manager'
      },
      psychographics: {
        values: ['Innovation', 'Efficiency', 'Growth', 'Problem-solving'],
        interests: ['Emerging tech', 'Business strategy', 'Productivity tools', 'Networking'],
        painPoints: [
          'Finding the right tools and resources',
          'Scaling their business effectively', 
          'Staying ahead of competition',
          'Building and managing teams'
        ],
        goals: [
          'Build successful products',
          'Attract investment and customers',
          'Create efficient workflows',
          'Stay informed on industry trends'
        ]
      },
      contentPreferences: {
        formats: ['Quick insights', 'Case studies', 'Tool reviews', 'Industry analysis'],
        tone: 'Professional but approachable, data-driven',
        topics: ['Tech trends', 'Business growth', 'Productivity', 'Industry insights']
      }
    },
    {
      id: 'content-creators',
      name: 'Content Creators & Digital Marketers',
      description: 'Content creators, influencers, and digital marketing professionals',
      demographics: {
        ageRange: '22-40',
        income: '$30k-$200k',
        education: 'High school to College+',
        location: 'Global, high social media usage areas',
        occupation: 'Content Creator, Social Media Manager, Digital Marketer'
      },
      psychographics: {
        values: ['Creativity', 'Authenticity', 'Engagement', 'Growth'],
        interests: ['Social media trends', 'Content strategy', 'Brand building', 'Analytics'],
        painPoints: [
          'Growing and engaging their audience',
          'Creating consistent, quality content',
          'Understanding analytics and metrics',
          'Monetizing their content effectively'
        ],
        goals: [
          'Increase follower count and engagement',
          'Build a strong personal/brand presence',
          'Generate revenue from content',
          'Stay on top of platform trends'
        ]
      },
      contentPreferences: {
        formats: ['Visual insights', 'Trend analysis', 'Best practices', 'Performance tips'],
        tone: 'Engaging, visual, actionable',
        topics: ['Content strategy', 'Audience growth', 'Engagement tactics', 'Platform trends']
      }
    },
    {
      id: 'business-professionals',
      name: 'Business Professionals & Executives',
      description: 'Mid to senior-level business professionals across industries',
      demographics: {
        ageRange: '30-55',
        income: '$75k-$300k+',
        education: 'College+ (MBA preferred)',
        location: 'Global business centers',
        occupation: 'Director, VP, C-Suite, Consultant, Manager'
      },
      psychographics: {
        values: ['Leadership', 'Results', 'Networking', 'Continuous learning'],
        interests: ['Industry insights', 'Leadership development', 'Market trends', 'Strategic thinking'],
        painPoints: [
          'Staying informed on industry developments',
          'Building thought leadership',
          'Networking effectively',
          'Making data-driven decisions'
        ],
        goals: [
          'Advance their career',
          'Build professional network',
          'Stay ahead of industry trends',
          'Demonstrate thought leadership'
        ]
      },
      contentPreferences: {
        formats: ['Executive summaries', 'Industry reports', 'Thought leadership', 'Strategic insights'],
        tone: 'Professional, authoritative, concise',
        topics: ['Business strategy', 'Market analysis', 'Leadership insights', 'Industry trends']
      }
    }
  ],

  // Primary Target Market Focus
  primarySegment: 'tech-entrepreneurs',

  // Brand Voice and Positioning
  brandVoice: {
    personality: ['Innovative', 'Reliable', 'Insightful', 'Professional'],
    tone: 'Professional yet approachable, data-driven with actionable insights',
    values: ['Innovation', 'Efficiency', 'Growth', 'Transparency'],
    differentiators: [
      'AI-powered insights tailored to your audience',
      'Real-time social media analytics',
      'Actionable recommendations based on data',
      'Focus on tech and business professional communities'
    ]
  },

  // Content Strategy Guidelines
  contentStrategy: {
    themes: [
      'Tech industry trends and analysis',
      'Social media growth strategies',
      'Business development insights',
      'Productivity and efficiency tips',
      'Data-driven decision making'
    ],
    contentPillars: [
      {
        pillar: 'Industry Insights',
        description: 'Analysis of tech trends, market movements, and industry developments',
        percentage: 30
      },
      {
        pillar: 'Growth Strategies', 
        description: 'Practical advice for business and personal brand growth',
        percentage: 25
      },
      {
        pillar: 'Tool Reviews & Recommendations',
        description: 'Reviews and recommendations of tools, platforms, and resources',
        percentage: 20
      },
      {
        pillar: 'Data & Analytics',
        description: 'Insights from data analysis and performance metrics',
        percentage: 25
      }
    ]
  },

  // Platform-Specific Considerations
  platformStrategy: {
    bluesky: {
      approach: 'Professional networking with authentic personality',
      contentTypes: ['Industry insights', 'Quick tips', 'Thought leadership', 'Community engagement'],
      engagementStrategy: 'Build meaningful connections with tech professionals and entrepreneurs',
      postingFrequency: '1-3 times per day',
      optimalTimes: ['9-11 AM EST', '1-3 PM EST', '7-9 PM EST']
    }
  }
};

// AI Insights Context Templates
export const AI_CONTEXT_TEMPLATES = {
  // Base context that's always included
  baseContext: `
You are an AI insights assistant for a Bluesky analytics dashboard. Your primary audience consists of tech entrepreneurs, startup founders, content creators, and business professionals who use social media for professional networking and thought leadership.

Brand Voice: Professional yet approachable, data-driven, innovative, and focused on actionable insights.

Primary Customer Segment: Tech entrepreneurs and startup founders (ages 25-45) who value innovation, efficiency, and growth. They need practical insights to build their businesses, attract customers/investment, and stay ahead of industry trends.
  `,

  // Segment-specific contexts
  segmentContexts: {
    'tech-entrepreneurs': `
Target Audience Focus: Tech entrepreneurs and startup founders
Key Pain Points: Finding right tools, scaling effectively, staying competitive, team building
Goals: Build successful products, attract investment, create efficient workflows, stay informed
Content Preferences: Quick insights, case studies, tool reviews, industry analysis
Tone: Professional but approachable, data-driven, focused on practical applications
    `,
    'content-creators': `
Target Audience Focus: Content creators and digital marketers  
Key Pain Points: Audience growth, consistent content creation, understanding analytics, monetization
Goals: Increase engagement, build strong brand presence, generate revenue, stay on trends
Content Preferences: Visual insights, trend analysis, best practices, performance tips
Tone: Engaging, visual, actionable, trend-focused
    `,
    'business-professionals': `
Target Audience Focus: Business professionals and executives
Key Pain Points: Staying informed, building thought leadership, networking, data-driven decisions
Goals: Career advancement, professional networking, industry awareness, thought leadership
Content Preferences: Executive summaries, industry reports, strategic insights
Tone: Professional, authoritative, concise, strategic
    `
  }
};

export default CUSTOMER_AVATAR;