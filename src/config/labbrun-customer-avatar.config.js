// LabbRun Customer Avatar and Target Audience Configuration
// Based on actual customer research from A:\Knowledge Docs\LabbRun

export const LABBRUN_CUSTOMER_AVATAR = {
  // Primary Customer Avatar - Alex Carter
  primaryAvatar: {
    id: 'alex-carter',
    name: 'Alex Carter',
    role: 'Small business owner & tech hobbyist',
    description: 'Ambitious entrepreneur who runs a small online consulting business from home. Experiments with self-hosting, home lab projects, and custom-built tech solutions.',
    
    demographics: {
      age: 42,
      ageRange: '25-65+',
      gender: 'Any (balanced mix)',
      location: 'Primarily U.S., but also Canada, UK, Australia, and other English-speaking countries',
      education: 'College-educated or self-taught with strong problem-solving skills',
      income: '$35k – $1M annual household income',
      livingSituation: 'Works from home in a suburban area with dedicated office space'
    },
    
    professional: {
      business: 'Small business operations (consulting, digital products, niche services)',
      techLevel: 'Comfortable with tech but still learning',
      experience: 'Handles own tech setup, dabbled in Linux servers, Raspberry Pi, NAS setups',
      workStyle: 'Balances business operations with genuine interest in experimenting with new tech'
    },
    
    goals: {
      shortTerm: [
        'Cut down on SaaS subscriptions by self-hosting',
        'Gain access to tools and processes previously too costly',
        'Implement secure, reliable systems for daily work'
      ],
      longTerm: [
        'Achieve full autonomy over data, tools, and infrastructure',
        'Build technical skills needed to grow their business',
        'Be confident in maintaining and troubleshooting own systems'
      ]
    },
    
    painPoints: [
      'Unsure where to start when exploring new tech solutions',
      'Struggles to filter and prioritize huge amount of available information',
      'Moderate budgets mean each investment must bring long-term value',
      'Concerned about security, privacy, and potential downtime'
    ],
    
    buyingBehavior: {
      research: 'Relies heavily on peer recommendations, online reviews, and trusted influencers',
      platforms: 'Amazon and reputable online tech retailers',
      priceConsciousness: 'Very price-conscious but willing to invest in proven ROI tools',
      preferences: 'Avoids recurring subscription fees, prefers one-time purchases or open-source solutions'
    },
    
    values: [
      'Privacy, control, and autonomy are non-negotiables',
      'Continuous learning but prefers simple, actionable guidance',
      'Enjoys experimenting and testing new tools',
      'Finds encouragement in online communities and forums'
    ],
    
    dailyHabits: {
      devices: 'Laptop most of the day, occasionally switches between Mac, Windows, and Linux',
      currentTech: 'Uses cloud services but gradually replacing with self-hosted alternatives',
      freeTime: 'Tweaking home lab setups, testing automation workflows, exploring AI tools',
      informationSources: 'Tech blogs, Reddit forums, YouTube tutorials'
    },
    
    quote: "I'm tired of paying monthly for tools I could run myself. I want to understand how my systems work, keep my data safe, and have more control without needing a massive IT budget."
  },

  // Target Audience Segments
  targetAudience: {
    primary: 'Amateur home labbers, entrepreneurs, and small business owners',
    interests: 'Self-hosting, running own tools, creating custom business processes',
    motivation: 'Cost savings, privacy, security, maintaining control over systems and services',
    skillLevel: 'Tech-savvy but still learning',
    
    demographics: {
      ageRange: '25-65+',
      gender: 'Mixed',
      location: 'Primarily U.S., any English-speaking country',
      education: 'College-educated or self-taught',
      income: '$35k – $1M',
      workStyle: 'Urban, suburban, or rural — most working from home or remote'
    },
    
    technologyProfile: {
      skillLevel: 'Basic to intermediate',
      strengths: 'Comfortable with Windows, Mac, some Linux, and cloud services',
      learningCurve: 'Early in AI adoption, not yet advanced',
      preferredDevices: 'Mostly laptops'
    },
    
    goals: {
      shortTerm: 'Save money and gain access to tools/processes previously out of reach or budget',
      longTerm: 'Achieve autonomy over services, tools, and data security',
      ongoing: 'Gain skills to advance business and better understand relied-upon technologies'
    },
    
    challenges: [
      'Lack of clear starting points and guidance in tech projects',
      'Moderate budgets, seeking long-term ROI',
      'Overwhelmed by information, struggling to prioritize learning',
      'Strong security and privacy concerns'
    ],
    
    buyingPatterns: {
      research: 'Rely heavily on reviews and recommendations before purchasing',
      platforms: 'Shop primarily on Amazon and other trusted technology retailers',
      budget: 'Price sensitive, but willing to invest for proven ROI',
      preferences: 'Prefer self-hosted or one-time purchase tools over subscriptions'
    },
    
    coreValues: [
      'Strong belief in privacy, control, and autonomy',
      'Value learning but prefer solutions with clear, simple instructions',
      'Open to experimentation with new tools and technologies',
      'Appreciate and seek community and peer support'
    ]
  },

  // Content Strategy Based on Avatar
  contentStrategy: {
    themes: [
      'Self-hosting solutions and setup guides',
      'Cost-effective alternatives to SaaS tools',
      'Home lab projects and tutorials',
      'Privacy and security best practices',
      'Business automation and efficiency',
      'Tech reviews focused on ROI and practical use'
    ],
    
    contentTypes: [
      {
        type: 'Step-by-step tutorials',
        purpose: 'Clear guidance for tech projects',
        tone: 'Simple, actionable, beginner-friendly'
      },
      {
        type: 'Tool reviews and comparisons',
        purpose: 'Help with buying decisions',
        tone: 'Honest, ROI-focused, practical'
      },
      {
        type: 'Case studies and real examples',
        purpose: 'Show practical implementations',
        tone: 'Authentic, relatable, results-driven'
      },
      {
        type: 'Community discussions',
        purpose: 'Peer support and recommendations',
        tone: 'Supportive, collaborative, problem-solving'
      }
    ],
    
    communicationStyle: {
      tone: 'Professional yet approachable, practical, educational',
      voice: 'Experienced peer sharing practical knowledge',
      language: 'Clear, jargon-free when possible, step-by-step when complex',
      focus: 'Problem-solving, cost-savings, autonomy, privacy'
    }
  },

  // Platform-Specific Strategy for Bluesky
  blueskyStrategy: {
    positioning: 'Trusted source for practical self-hosting and home lab guidance',
    contentMix: {
      tutorials: '40% - Step-by-step guides and how-tos',
      reviews: '25% - Tool and hardware reviews with ROI focus',
      community: '20% - Answering questions and peer discussions',
      insights: '15% - Industry trends and recommendations'
    },
    engagementApproach: 'Build community of like-minded home labbers and entrepreneurs',
    postingFrequency: '1-2 times per day with consistent value',
    keyTopics: [
      'Self-hosting alternatives to popular SaaS',
      'Budget-friendly home lab setups',
      'Privacy-focused tool recommendations',
      'Small business automation',
      'Learning resources and tutorials'
    ]
  }
};

// AI Context Templates for LabbRun Audience
export const LABBRUN_AI_CONTEXT = {
  baseContext: `
You are an AI insights assistant for LabbRun, a home labbing and self-hosting focused Bluesky account. Your audience consists of small business owners, entrepreneurs, and tech hobbyists who are interested in self-hosting, home lab projects, and reducing dependency on SaaS subscriptions.

Primary Avatar: Alex Carter - A 42-year-old small business owner who runs an online consulting business from home. Tech-savvy but still learning, motivated by cost savings, privacy, security, and maintaining control over systems and services.

Key Audience Characteristics:
- Age range: 25-65+, mixed gender, primarily English-speaking countries
- Income: $35k-$1M, mostly working from home
- Tech level: Basic to intermediate, comfortable with Windows/Mac/some Linux
- Values: Privacy, control, autonomy, continuous learning, community support
- Pain points: Information overload, moderate budgets, security concerns, unclear starting points
- Preferences: One-time purchases over subscriptions, peer recommendations, practical guidance

Content Focus: Self-hosting, home labs, cost-effective tech solutions, privacy/security, business automation, practical tutorials, tool reviews with ROI focus.
  `,
  
  contentGuidelines: `
When generating insights and recommendations:

1. Focus on PRACTICAL VALUE: Every recommendation should save money, increase control, or improve security
2. Consider BUDGET CONSTRAINTS: Audience has moderate budgets, needs proven ROI
3. Emphasize LEARNING: Provide clear, step-by-step guidance for complex topics
4. Address PRIVACY/SECURITY: Always consider data protection and autonomy
5. Build COMMUNITY: Encourage peer interaction and knowledge sharing
6. Avoid VENDOR LOCK-IN: Prefer open-source and self-hosted solutions
7. Show REAL EXAMPLES: Use case studies and practical implementations
8. Consider SKILL LEVEL: Basic to intermediate, avoid overly technical jargon

Content should help the audience achieve their goals of:
- Reducing SaaS subscription costs through self-hosting
- Building technical skills for business growth
- Maintaining control over data and infrastructure
- Finding cost-effective alternatives to expensive tools
  `
};

export default LABBRUN_CUSTOMER_AVATAR;