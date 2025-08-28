// Blog Analytics Service
// Comprehensive blog analysis combining RSS feeds, Google Analytics, and AI-powered insights

import { fetchBlogFeed, analyzeBlogPostAlignment, calculateBlogMetrics } from './rssService';
import { getBlogTrafficOverview, getReferralTraffic, getTopBlogPosts } from './googleAnalyticsService';
import { analyzeAndRepurposeBlogContent } from './enhancedContentRepurposingService';
import { getAIContext } from './aiContextProvider';

// Main blog analytics orchestrator
export const getComprehensiveBlogAnalytics = async (timeRange = 30) => {
  const analytics = {
    overview: {},
    content: {},
    traffic: {},
    repurposing: {},
    insights: {},
    recommendations: [],
    lastUpdated: new Date()
  };

  try {
    console.log('Loading comprehensive blog analytics...');
    
    // Load AI context for analysis
    const aiContext = await getAIContext();
    
    // Parallel data loading for performance
    const [blogData, trafficData, referralData, topPosts] = await Promise.allSettled([
      fetchBlogFeed(),
      getBlogTrafficOverview(timeRange),
      getReferralTraffic(timeRange),
      getTopBlogPosts(timeRange)
    ]);

    // Process blog content data
    if (blogData.status === 'fulfilled') {
      analytics.content = await processBlogContent(blogData.value, aiContext);
      analytics.overview.totalPosts = blogData.value.posts.length;
      analytics.overview.blogMetrics = calculateBlogMetrics(blogData.value.posts);
    } else {
      console.error('Blog feed loading failed:', blogData.reason);
      analytics.content = { error: blogData.reason.message };
    }

    // Process traffic data
    if (trafficData.status === 'fulfilled') {
      analytics.traffic.overview = processTrafficData(trafficData.value);
    } else {
      console.warn('Traffic data loading failed, using mock data:', trafficData.reason);
      analytics.traffic.overview = generateMockTrafficOverview(timeRange);
    }

    // Process referral data
    if (referralData.status === 'fulfilled') {
      analytics.traffic.referrals = processReferralData(referralData.value);
    } else {
      console.warn('Referral data loading failed, using mock data:', referralData.reason);
      analytics.traffic.referrals = generateMockReferralData();
    }

    // Process top posts
    if (topPosts.status === 'fulfilled') {
      analytics.traffic.topPosts = topPosts.value;
    } else {
      console.warn('Top posts loading failed, using mock data:', topPosts.reason);
      analytics.traffic.topPosts = generateMockTopPosts();
    }

    // Generate comprehensive insights
    analytics.insights = generateBlogInsights(analytics, aiContext);
    
    // Generate actionable recommendations
    analytics.recommendations = generateRecommendations(analytics, aiContext);

    console.log('Blog analytics loaded successfully:', {
      posts: analytics.overview.totalPosts,
      trafficPoints: analytics.traffic.overview?.length || 0,
      referrals: analytics.traffic.referrals?.length || 0,
      insights: Object.keys(analytics.insights).length
    });

    return analytics;

  } catch (error) {
    console.error('Blog analytics loading failed:', error);
    return {
      ...analytics,
      error: error.message,
      recommendations: [{
        type: 'error',
        priority: 'high',
        title: 'Analytics Loading Failed',
        description: error.message,
        action: 'Check RSS feed URL and Google Analytics configuration'
      }]
    };
  }
};

// Process blog content with AI analysis
const processBlogContent = async (blogData, aiContext) => {
  const { posts } = blogData;
  
  if (!posts || posts.length === 0) {
    return { error: 'No blog posts found' };
  }

  // Analyze recent posts (last 10) - OPTIMIZED: Process in parallel batches
  const recentPosts = posts.slice(0, 10);
  const repurposingOpportunities = [];

  // Process posts in parallel batches of 3 to prevent overwhelming APIs
  const batchSize = 3;
  const analyzedPosts = [];
  
  for (let i = 0; i < recentPosts.length; i += batchSize) {
    const batch = recentPosts.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (post) => {
      try {
        // Analyze content alignment with audience (synchronous - fast)
        const alignment = analyzeBlogPostAlignment(post, aiContext.targetKeywords);
        
        // Get comprehensive AI analysis and repurposing suggestions (async - slow)
        // Use timeout to prevent hanging
        const repurposingAnalysis = await Promise.race([
          analyzeAndRepurposeBlogContent(post),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Analysis timeout')), 10000)
          )
        ]);
        
        const analyzedPost = {
          ...post,
          analysis: {
            alignmentScore: alignment.score,
            alignmentAnalysis: alignment.analysis,
            audienceResonance: repurposingAnalysis.analysis?.audienceFit?.score || 0,
            brandAlignment: repurposingAnalysis.analysis?.brandAlignment?.score || 0,
            contentScore: repurposingAnalysis.analysis?.contentScore || 0
          },
          repurposing: {
            suggestions: repurposingAnalysis.suggestions || {},
            strategy: repurposingAnalysis.strategy || {},
            predictions: repurposingAnalysis.predictions || {}
          }
        };

        // Collect high-potential repurposing opportunities
        if (repurposingAnalysis.strategy?.repurposingOpportunities) {
          repurposingOpportunities.push(...repurposingAnalysis.strategy.repurposingOpportunities.map(opp => ({
            ...opp,
            postTitle: post.title,
            postLink: post.link,
            postDate: post.pubDate
          })));
        }

        return analyzedPost;

      } catch (error) {
        console.warn(`Analysis failed for post: ${post.title}`, error);
        return {
          ...post,
          analysis: { 
            alignmentScore: 75, // Default score when analysis fails
            error: error.message 
          },
          repurposing: { error: error.message }
        };
      }
    });

    // Wait for current batch to complete before processing next batch
    const batchResults = await Promise.allSettled(batchPromises);
    const successfulResults = batchResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    analyzedPosts.push(...successfulResults);
    
    // Small delay between batches to prevent API rate limiting
    if (i + batchSize < recentPosts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Calculate aggregate content metrics
  const averageAlignmentScore = analyzedPosts
    .filter(p => p.analysis?.alignmentScore)
    .reduce((sum, p) => sum + p.analysis.alignmentScore, 0) / analyzedPosts.length;

  const averageAudienceResonance = analyzedPosts
    .filter(p => p.analysis?.audienceResonance)
    .reduce((sum, p) => sum + p.analysis.audienceResonance, 0) / analyzedPosts.length;

  return {
    recentPosts: analyzedPosts,
    metrics: {
      averageAlignmentScore: Math.round(averageAlignmentScore) || 0,
      averageAudienceResonance: Math.round(averageAudienceResonance) || 0,
      totalAnalyzed: analyzedPosts.length,
      highPerformingPosts: analyzedPosts.filter(p => p.analysis?.alignmentScore > 70).length
    },
    repurposingOpportunities: repurposingOpportunities
      .sort((a, b) => (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0))
      .slice(0, 8) // Top 8 opportunities
  };
};

// Process traffic data for visualization
const processTrafficData = (trafficData) => {
  if (!trafficData || trafficData.length === 0) {
    return generateMockTrafficOverview();
  }

  return trafficData.map(data => ({
    date: data.date,
    sessions: data.sessions,
    users: data.users,
    pageviews: data.pageviews,
    bounceRate: data.bounceRate,
    avgSessionDuration: data.avgSessionDuration
  }));
};

// Process referral data with Bluesky focus
const processReferralData = (referralData) => {
  if (!referralData || referralData.length === 0) {
    return generateMockReferralData();
  }

  return referralData.map(ref => ({
    ...ref,
    displayName: getDisplayName(ref.source),
    category: categorizeReferralSource(ref.source, ref.medium)
  }));
};

// Generate comprehensive blog insights
const generateBlogInsights = (analytics, aiContext) => {
  const insights = {};

  // Content performance insights
  if (analytics.content.metrics) {
    const metrics = analytics.content.metrics;
    
    insights.contentPerformance = {
      score: metrics.averageAlignmentScore,
      status: getPerformanceStatus(metrics.averageAlignmentScore),
      summary: `Your content averages ${metrics.averageAlignmentScore}% alignment with your target audience. ${metrics.highPerformingPosts} out of ${metrics.totalAnalyzed} recent posts are high-performing.`,
      recommendation: metrics.averageAlignmentScore < 70 
        ? 'Focus more on privacy, self-hosting, and productivity topics that resonate with your audience.'
        : 'Excellent content alignment! Continue focusing on your current topics.'
    };
  }

  // Traffic insights
  if (analytics.traffic.overview && analytics.traffic.overview.length > 0) {
    const latestTraffic = analytics.traffic.overview[analytics.traffic.overview.length - 1];
    const totalSessions = analytics.traffic.overview.reduce((sum, day) => sum + day.sessions, 0);
    const avgBounceRate = analytics.traffic.overview.reduce((sum, day) => sum + day.bounceRate, 0) / analytics.traffic.overview.length;

    insights.trafficPerformance = {
      totalSessions,
      averageBounceRate: Math.round(avgBounceRate),
      latestSessions: latestTraffic.sessions,
      trend: analytics.traffic.overview.length > 1 
        ? (latestTraffic.sessions > analytics.traffic.overview[0].sessions ? 'increasing' : 'decreasing')
        : 'stable',
      summary: `${totalSessions} total sessions with ${Math.round(avgBounceRate)}% average bounce rate. Traffic is ${insights.trafficPerformance?.trend || 'stable'}.`
    };
  }

  // Referral insights with Bluesky focus
  if (analytics.traffic.referrals && analytics.traffic.referrals.length > 0) {
    const blueskyReferrals = analytics.traffic.referrals.filter(ref => ref.isBluesky);
    const searchReferrals = analytics.traffic.referrals.filter(ref => ref.isSearch);
    const socialReferrals = analytics.traffic.referrals.filter(ref => ref.isSocial);

    insights.referralInsights = {
      blueskyTraffic: blueskyReferrals.reduce((sum, ref) => sum + ref.sessions, 0),
      searchTraffic: searchReferrals.reduce((sum, ref) => sum + ref.sessions, 0),
      socialTraffic: socialReferrals.reduce((sum, ref) => sum + ref.sessions, 0),
      blueskyPerformance: blueskyReferrals.length > 0 ? 'active' : 'opportunity',
      summary: `Bluesky driving ${blueskyReferrals.reduce((sum, ref) => sum + ref.sessions, 0)} sessions. Search traffic: ${searchReferrals.reduce((sum, ref) => sum + ref.sessions, 0)} sessions.`
    };
  }

  // Content repurposing insights
  if (analytics.content.repurposingOpportunities) {
    const opportunities = analytics.content.repurposingOpportunities;
    const highPriorityOpportunities = opportunities.filter(opp => opp.priority === 'high');

    insights.repurposingInsights = {
      totalOpportunities: opportunities.length,
      highPriorityOpportunities: highPriorityOpportunities.length,
      topOpportunityType: getMostCommonOpportunityType(opportunities),
      summary: `${opportunities.length} repurposing opportunities identified, ${highPriorityOpportunities.length} high-priority. Focus on ${getMostCommonOpportunityType(opportunities)} content.`
    };
  }

  return insights;
};

// Generate actionable recommendations
const generateRecommendations = (analytics, aiContext) => {
  const recommendations = [];

  // Content alignment recommendations
  if (analytics.content.metrics && analytics.content.metrics.averageAlignmentScore < 70) {
    recommendations.push({
      type: 'content_optimization',
      priority: 'high',
      title: 'Improve Content-Audience Alignment',
      description: `Your content averages ${analytics.content.metrics.averageAlignmentScore}% alignment with your target audience interests.`,
      action: 'Focus more on privacy, self-hosting, homelab, and productivity topics',
      impact: 'Higher engagement and more qualified Bluesky traffic',
      timeframe: 'Next 3-5 posts'
    });
  }

  // Bluesky traffic recommendations
  if (analytics.traffic.referrals) {
    const blueskyTraffic = analytics.traffic.referrals
      .filter(ref => ref.isBluesky)
      .reduce((sum, ref) => sum + ref.sessions, 0);
    
    if (blueskyTraffic < 20) {
      recommendations.push({
        type: 'bluesky_optimization',
        priority: 'high',
        title: 'Increase Bluesky Traffic',
        description: `Currently getting ${blueskyTraffic} sessions from Bluesky. Significant opportunity for growth.`,
        action: 'Implement systematic blog content repurposing for Bluesky using the suggestions below',
        impact: 'Could increase Bluesky referral traffic by 200-400%',
        timeframe: 'Next 2-4 weeks'
      });
    }
  }

  // Repurposing opportunity recommendations
  if (analytics.content.repurposingOpportunities && analytics.content.repurposingOpportunities.length > 0) {
    const topOpportunity = analytics.content.repurposingOpportunities[0];
    
    recommendations.push({
      type: 'content_repurposing',
      priority: topOpportunity.priority,
      title: `Leverage ${topOpportunity.type.replace('_', ' ').toUpperCase()} Opportunity`,
      description: topOpportunity.description,
      action: topOpportunity.strategy || 'Follow the AI-generated repurposing suggestions',
      impact: `Estimated ${topOpportunity.engagementPotential || 75}% engagement potential`,
      timeframe: topOpportunity.timeline || 'This week',
      relatedPost: topOpportunity.postTitle
    });
  }

  // Google Analytics setup recommendation
  if (analytics.traffic.overview && analytics.traffic.overview.every(day => day.sessions < 10)) {
    recommendations.push({
      type: 'analytics_setup',
      priority: 'medium',
      title: 'Verify Google Analytics Setup',
      description: 'Traffic data appears unusually low, which may indicate a configuration issue.',
      action: 'Check Google Analytics integration and ensure tracking is working properly',
      impact: 'Better data for optimization decisions',
      timeframe: 'This week'
    });
  }

  return recommendations.slice(0, 6); // Limit to top 6 recommendations
};

// Helper functions
const getPerformanceStatus = (score) => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  return 'needs_improvement';
};

const getDisplayName = (source) => {
  const displayNames = {
    'google': 'Google Search',
    'bsky.app': 'Bluesky',
    'twitter.com': 'Twitter/X',
    'linkedin.com': 'LinkedIn',
    'direct': 'Direct Traffic',
    '(none)': 'Direct'
  };
  return displayNames[source] || source;
};

const categorizeReferralSource = (source, medium) => {
  if (source.includes('bsky') || source.includes('bluesky')) return 'bluesky';
  if (medium === 'organic') return 'search';
  if (medium === 'social') return 'social';
  if (medium === '(none)' || source === 'direct') return 'direct';
  if (medium === 'referral') return 'referral';
  return 'other';
};

const getMostCommonOpportunityType = (opportunities) => {
  if (!opportunities || opportunities.length === 0) return 'general content';
  
  const typeCounts = {};
  opportunities.forEach(opp => {
    typeCounts[opp.type] = (typeCounts[opp.type] || 0) + 1;
  });
  
  const mostCommon = Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  return mostCommon ? mostCommon[0].replace('_', ' ') : 'general content';
};

// Mock data generators for when APIs aren't available
const generateMockTrafficOverview = (days = 30) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      sessions: Math.floor(Math.random() * 100) + 30,
      users: Math.floor(Math.random() * 80) + 25,
      pageviews: Math.floor(Math.random() * 200) + 60,
      bounceRate: Math.random() * 20 + 40,
      avgSessionDuration: Math.random() * 150 + 90
    });
  }
  return data;
};

const generateMockReferralData = () => [
  { source: 'google', medium: 'organic', sessions: 185, users: 156, isBluesky: false, isSearch: true, isSocial: false, category: 'search', displayName: 'Google Search' },
  { source: 'bsky.app', medium: 'referral', sessions: 42, users: 38, isBluesky: true, isSearch: false, isSocial: true, category: 'bluesky', displayName: 'Bluesky' },
  { source: 'direct', medium: '(none)', sessions: 67, users: 58, isBluesky: false, isSearch: false, isSocial: false, category: 'direct', displayName: 'Direct Traffic' },
  { source: 'twitter.com', medium: 'social', sessions: 23, users: 21, isBluesky: false, isSearch: false, isSocial: true, category: 'social', displayName: 'Twitter/X' }
];

const generateMockTopPosts = () => [
  {
    path: '/ai-privacy-fundamentals/',
    title: 'AI Privacy Fundamentals: Building Secure Systems',
    pageviews: 847,
    uniquePageviews: 782,
    avgTimeOnPage: 245,
    bounceRate: 23.4,
    url: 'https://labb.run/ai-privacy-fundamentals/'
  },
  {
    path: '/homelab-security-guide/',
    title: 'Complete Homelab Security Guide',
    pageviews: 623,
    uniquePageviews: 589,
    avgTimeOnPage: 312,
    bounceRate: 18.7,
    url: 'https://labb.run/homelab-security-guide/'
  }
];

// Get specific blog post analysis
export const getPostAnalysis = async (postId) => {
  try {
    const blogData = await fetchBlogFeed();
    const post = blogData.posts.find(p => p.id === postId);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return await analyzeAndRepurposeBlogContent(post);
    
  } catch (error) {
    console.error('Post analysis failed:', error);
    throw error;
  }
};

// Test blog analytics connections
export const testBlogAnalyticsConnections = async () => {
  const tests = {
    rssConnection: false,
    googleAnalytics: false,
    aiGuidance: false
  };
  
  try {
    await fetchBlogFeed();
    tests.rssConnection = true;
  } catch (error) {
    console.warn('RSS connection failed:', error.message);
  }
  
  try {
    await getBlogTrafficOverview(7);
    tests.googleAnalytics = true;
  } catch (error) {
    console.warn('Google Analytics connection failed:', error.message);
  }
  
  try {
    const context = await getAIContext();
    tests.aiGuidance = context.isInitialized;
  } catch (error) {
    console.warn('AI guidance loading failed:', error.message);
  }
  
  return tests;
};

const blogAnalyticsService = {
  getComprehensiveBlogAnalytics,
  getPostAnalysis,
  testBlogAnalyticsConnections
};

export default blogAnalyticsService;