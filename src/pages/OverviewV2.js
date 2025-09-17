import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { checkCelebrationConditions, shouldShowCelebration, markCelebrationShown, formatCelebrationMessage, getPreviousMetrics, storePreviousMetrics } from '../utils/celebrationUtils';
import realAIService from '../services/realAIService';
import {
  Users,
  MessageSquare,
  Heart,
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  ExternalLink
} from 'lucide-react';

// Import Untitled UI components
import { 
  Card, 
  Button, 
  Badge, 
  MetricCard
} from '../components/ui/UntitledUIComponents';

// Import mesh gradients for backgrounds
import gradient2 from '../assets/gradients/15.jpg';

// Brand chart colors - using your custom palette
const CHART_COLORS = {
  primary: '#002945',    // Your primary color
  brand: '#2B54BE',      // Your brand color  
  accent: '#3A5393',     // Your accent color
  electric: '#0E4CE8',   // Your electric blue
  slate: '#3B4869',      // Your slate color
  success: '#23B26A',    // Success green
  warning: '#F79009',    // Warning orange
  error: '#F04438'       // Error red
};

function OverviewV2({ metrics }) {
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [celebrationMessage, setCelebrationMessage] = React.useState('');
  const [timePeriod, setTimePeriod] = React.useState('7'); // '7' for 7 days, '30' for 30 days, 'lifetime' for all time
  
  // AI state management
  const [aiServiceReady, setAiServiceReady] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // Generate AI insights for overview
  const generateOverviewInsights = React.useCallback(async () => {
    
    if (!aiServiceReady) {
      return;
    }
    
    if (!metrics) {
      return;
    }
    
    if (loadingInsights) {
      return;
    }
    
    setLoadingInsights(true);
    try {
      const insights = await realAIService.generateBlueskyInsights(metrics);
      setAiInsights(insights);
    } catch (error) {
    } finally {
      setLoadingInsights(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiServiceReady, metrics]);
  
  // Initialize AI service and auto-generate insights
  useEffect(() => {
    const initAI = async () => {
      const ready = await realAIService.initialize();
      setAiServiceReady(ready);
    };
    initAI();
  }, []);
  
  // Auto-generate insights when conditions are met (only once)
  useEffect(() => {
    if (aiServiceReady && metrics && !loadingInsights && !aiInsights) {
      generateOverviewInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiServiceReady, metrics]); // Removed loadingInsights and aiInsights to prevent infinite loop

  // Check for celebration conditions on component mount
  React.useEffect(() => {
    if (metrics && shouldShowCelebration()) {
      // Get previous metrics for comparison
      const previousMetrics = getPreviousMetrics();
      const celebrations = checkCelebrationConditions(metrics, previousMetrics);
      
      if (celebrations.length > 0) {
        const message = formatCelebrationMessage(celebrations);
        setCelebrationMessage(message);
        setShowCelebration(true);
        markCelebrationShown();
      }
      
      // Store current metrics for next visit
      storePreviousMetrics(metrics);
    }
  }, [metrics]);
  
  // Filter posts based on selected time period
  const getFilteredPosts = React.useMemo(() => {
    if (!metrics?.recentPosts) return [];
    
    if (timePeriod === 'lifetime') {
      return metrics.recentPosts; // Use all available posts for lifetime
    }
    
    const days = parseInt(timePeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return metrics.recentPosts.filter(post => {
      if (!post.indexedAt) return true; // Include posts without dates as fallback
      const postDate = new Date(post.indexedAt);
      return postDate >= cutoffDate;
    });
  }, [metrics, timePeriod]);

  // Calculate engagement metrics based on filtered posts
  const filteredEngagementMetrics = React.useMemo(() => {
    const filteredPosts = getFilteredPosts;
    
    const totalLikes = filteredPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalReplies = filteredPosts.reduce((sum, post) => sum + (post.replyCount || 0), 0);
    const totalReposts = filteredPosts.reduce((sum, post) => sum + (post.repostCount || 0), 0);
    const totalEngagement = totalLikes + totalReplies + totalReposts;
    
    return {
      totalLikes,
      totalReplies,
      totalReposts,
      totalEngagement,
      postCount: filteredPosts.length,
      avgEngagementPerPost: filteredPosts.length > 0 ? totalEngagement / filteredPosts.length : 0
    };
  }, [getFilteredPosts]);
  


  // Real follower data - show current follower count as single data point
  const followersData = React.useMemo(() => {
    if (!metrics) return [];

    // Since we only have current follower count, display it as a single point
    // Future enhancement: Store historical data for trend analysis
    return [{
      date: 'Current',
      followers: metrics.followersCount
    }];
  }, [metrics]);

  // Real engagement rate data based on actual metrics
  const engagementData = React.useMemo(() => {
    if (!metrics || !filteredEngagementMetrics.postCount) return [];

    // Calculate actual engagement rate from real data
    const engagementRate = metrics.followersCount > 0 && filteredEngagementMetrics.totalEngagement > 0
      ? Math.round(((filteredEngagementMetrics.totalEngagement / metrics.followersCount) * 100) * 10) / 10
      : 0;

    // Show current engagement rate as single data point
    // Future enhancement: Store historical data for trend analysis
    return [{
      date: `${timePeriod === 'lifetime' ? 'All Time' : `Last ${timePeriod} days`}`,
      rate: Math.max(0, engagementRate)
    }];
  }, [metrics, timePeriod, filteredEngagementMetrics]);

  // Community breakdown data based on post content analysis
  const communityBreakdown = React.useMemo(() => {
    if (!getFilteredPosts || getFilteredPosts.length === 0) {
      // No posts available - show placeholder message
      return [
        { name: 'No Data Available', value: 100, color: CHART_COLORS.slate }
      ];
    }

    const posts = getFilteredPosts;
    let techScore = 0;
    let businessScore = 0;
    let devScore = 0;
    let generalScore = 0;

    // Analyze post content for topic categories
    posts.forEach(post => {
      const text = (post.text || '').toLowerCase();
      let categorized = false;

      // Tech keywords
      if (text.match(/\b(ai|tech|technology|privacy|security|homelab|server|cloud|data|analytics|machine learning|artificial intelligence)\b/)) {
        techScore++;
        categorized = true;
      }

      // Business keywords
      if (text.match(/\b(business|startup|entrepreneur|productivity|enterprise|marketing|sales|strategy|growth|revenue)\b/)) {
        businessScore++;
        categorized = true;
      }

      // Developer keywords
      if (text.match(/\b(code|dev|developer|programming|software|github|api|javascript|python|react|coding|bug|feature)\b/)) {
        devScore++;
        categorized = true;
      }

      // If no category matched, count as general
      if (!categorized) {
        generalScore++;
      }
    });

    const totalCategorized = techScore + businessScore + devScore + generalScore;

    if (totalCategorized === 0) {
      return [
        { name: 'General Content', value: 100, color: CHART_COLORS.electric }
      ];
    }

    // Calculate percentages based on actual content
    const techPercentage = Math.round((techScore / totalCategorized) * 100);
    const businessPercentage = Math.round((businessScore / totalCategorized) * 100);
    const devPercentage = Math.round((devScore / totalCategorized) * 100);
    const generalPercentage = 100 - techPercentage - businessPercentage - devPercentage;

    const result = [
      { name: 'Tech Content', value: techPercentage, color: CHART_COLORS.primary },
      { name: 'Business Content', value: businessPercentage, color: CHART_COLORS.brand },
      { name: 'Developer Content', value: devPercentage, color: CHART_COLORS.accent },
      { name: 'General Content', value: Math.max(0, generalPercentage), color: CHART_COLORS.electric }
    ].filter(item => item.value > 0); // Remove categories with 0%

    return result;
  }, [getFilteredPosts]);


  if (!metrics) {
    return (
      <div className="space-y-8 font-sans">
        {/* Profile Configuration Message */}
        <div className="flex items-center justify-center min-h-96">
          <Card className="text-center max-w-md">
            <AlertCircle size={48} className="text-brand-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 font-sans">
              Connect Your Bluesky Account
            </h2>
            <p className="text-gray-600 mt-2 font-sans">
              Go to Settings to configure your Bluesky handle and app password to view your analytics.
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.href = '/settings'}
            >
              Open Settings
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay 
          message={celebrationMessage}
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {/* Bluesky-Style Profile Header - Restored Original Design */}
      <div className="relative">
        {/* Background Banner */}
        <div className="h-32 rounded-2xl relative overflow-hidden">
          {metrics.banner ? (
            <>
              <img 
                src={metrics.banner} 
                alt="Profile banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/60 via-brand-500/40 to-electric-500/60"></div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-brand-500 to-electric-500"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            </>
          )}
        </div>
        
        {/* Profile Content */}
        <div className="relative -mt-16 px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-electric-500 rounded-full blur-lg opacity-40"></div>
              <img
                src={metrics.avatar}
                alt={metrics.displayName}
                className="relative w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl bg-white"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 rounded-2xl p-6 shadow-xl border border-gray-700 bg-primary-850">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1 font-sans">{metrics.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4 font-sans">@{metrics.handle}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ExternalLink size={16} />}
                    iconPosition="right"
                    onClick={() => window.open(`https://bsky.app/profile/${metrics.handle}`, '_blank')}
                  >
                    View on Bluesky
                  </Button>
                </div>
              </div>
              
              {/* Bio in styled container - full width */}
              <div className="bg-primary-800 border border-gray-600 rounded-xl p-4 mb-4 hover:border-brand-400 transition-colors">
                <p className="text-gray-300 leading-5 font-sans">{metrics.description || 'Configure your Bluesky account in Settings to see your profile description here.'}</p>
              </div>
              
              {/* Stats grid - full width */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics.followersCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Followers</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics.followsCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Following</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">
                    {metrics.followersCount > 0 && metrics.followsCount > 0
                      ? Math.round((Math.min(metrics.followersCount, metrics.followsCount) / Math.max(metrics.followersCount, metrics.followsCount)) * 100)
                      : 0
                    }%
                  </p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Follow Ratio</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics.postsCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Posts</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">
                    {getFilteredPosts && getFilteredPosts.length > 0
                      ? `${Math.round(filteredEngagementMetrics.avgEngagementPerPost * 10) / 10}`
                      : '0'
                    }
                  </p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Avg Engagement</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">
                    {metrics.followersCount > 0 && filteredEngagementMetrics.totalEngagement > 0
                      ? Math.round(((filteredEngagementMetrics.totalEngagement / metrics.followersCount) * 100) * 10) / 10
                      : 0
                    }%
                  </p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Engagement Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Overview</h1>
          <p className="text-gray-600 mt-1 font-sans">
            Analytics dashboard for {timePeriod === 'lifetime' ? 'all time' : `the last ${timePeriod} days`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timePeriod === '7' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimePeriod('7')}
          >
            Last 7 days
          </Button>
          <Button
            variant={timePeriod === '30' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimePeriod('30')}
          >
            Last 30 days
          </Button>
          <Button
            variant={timePeriod === 'lifetime' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimePeriod('lifetime')}
          >
            Lifetime
          </Button>
        </div>
      </div>

      {/* REAL AI Insights Section */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Zap size={24} className={aiServiceReady ? "text-brand-400" : "text-gray-400"} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                AI Insights
              </h2>
              <Badge variant={aiServiceReady ? "success" : "secondary"} size="sm">
                {aiServiceReady ? "LIVE" : "NOT CONFIGURED"}
              </Badge>
            </div>
            
            {!aiServiceReady ? (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-4">
                  Configure your AI API (API Key and Base URL) in Settings to get real AI analysis of your social media performance.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/settings'}
                  className="flex items-center gap-2"
                >
                  <Target size={16} />
                  Configure AI Service
                </Button>
              </div>
            ) : loadingInsights ? (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  🤖 Generating real AI insights from your data...
                </p>
              </div>
            ) : aiInsights ? (
              <div className={`mb-6 p-4 rounded-xl border ${aiInsights.error ? 'bg-red-900 border-red-600' : 'bg-primary-850 border-gray-600'}`}>
                <div className="mb-3">
                  <span className={`font-semibold text-sm font-sans ${aiInsights.error ? 'text-red-400' : 'text-brand-400'}`}>
                    {aiInsights.error ? '❌ AI Service Error' : '🤖 AI Analysis Results'}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {aiInsights.error ? 'Error occurred' : 'Generated from your real data'}
                  </span>
                </div>
                <div className={`text-sm font-sans leading-relaxed whitespace-pre-line mb-4 ${aiInsights.error ? 'text-red-200' : 'text-gray-300'}`}>
                  {aiInsights.content}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={generateOverviewInsights}
                    disabled={loadingInsights}
                    className="flex items-center gap-2"
                  >
                    <Zap size={14} />
                    Refresh Analysis
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Analysis of {aiInsights.metricsAnalyzed?.followers || 0} followers, {aiInsights.metricsAnalyzed?.posts || 0} posts • {new Date(aiInsights.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-4">
                  Unable to generate AI insights. Check your API configuration.
                </p>
                <Button 
                  size="sm"
                  onClick={generateOverviewInsights}
                  disabled={loadingInsights}
                  className="flex items-center gap-2"
                >
                  <Zap size={14} />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Key Metrics Grid - Clean and Symmetrical */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Current Followers"
          value={metrics?.followersCount?.toLocaleString() || '0'}
          description="Total number of accounts\nfollowing you"
          change={`Following ${metrics?.followsCount?.toLocaleString() || '0'} accounts`}
          changeType="neutral"
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Total Posts"
          value={metrics?.postsCount?.toLocaleString() || '0'}
          description="Total number of posts\nyou've published"
          change={`Recent: ${metrics?.recentPosts?.length || 0} loaded`}
          changeType="neutral"
          icon={<MessageSquare size={20} />}
        />
        <MetricCard
          title={timePeriod === 'lifetime' ? 'Lifetime Engagement (Est.)' : 'Total Engagement'}
          value={(() => {
            if (timePeriod === 'lifetime' && metrics?.postsCount && filteredEngagementMetrics.postCount > 0) {
              // Estimate lifetime engagement by extrapolating from available posts
              const avgPerPost = filteredEngagementMetrics.avgEngagementPerPost;
              const lifetimeEstimate = Math.round(avgPerPost * metrics.postsCount);
              return lifetimeEstimate.toLocaleString();
            }
            return filteredEngagementMetrics.totalEngagement.toLocaleString();
          })()}
          description={timePeriod === 'lifetime' 
            ? `Estimated total engagement\nacross all ${metrics?.postsCount?.toLocaleString() || 0} posts`
            : `Likes, replies, and reposts\nin ${timePeriod === '7' ? 'last 7 days' : 'last 30 days'} (${filteredEngagementMetrics.postCount} posts)`
          }
          change={timePeriod === 'lifetime'
            ? `Based on ${filteredEngagementMetrics.postCount} available posts`
            : `${filteredEngagementMetrics.totalLikes} likes, ${filteredEngagementMetrics.totalReplies} replies, ${filteredEngagementMetrics.totalReposts} reposts`
          }
          changeType="positive"
          icon={<Heart size={20} />}
        />
        <MetricCard
          title="Avg Engagement Per Post"
          value={filteredEngagementMetrics.avgEngagementPerPost.toFixed(1)}
          description={`Average engagement per post\n(likes + replies + reposts)`}
          change={timePeriod === 'lifetime'
            ? `Estimated across all posts`
            : `Based on ${filteredEngagementMetrics.postCount} posts in selected period`
          }
          changeType={filteredEngagementMetrics.totalEngagement > 0 ? "positive" : "neutral"}
          icon={<Target size={20} />}
        />
      </div>

      {/* Charts Section - Clean and Symmetrical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Followers Growth Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-sans">
                Current Followers
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-sans">
                Current follower count from your Bluesky profile
              </p>
            </div>
            <Badge variant="primary" size="sm">
              <Users size={12} className="mr-1" />
              Live Data
            </Badge>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Inter'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke={CHART_COLORS.brand} 
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.brand, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Rate Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-sans">
                Engagement Rate
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-sans">
                {timePeriod === 'lifetime' ? 'Overall engagement rate' : `Engagement rate for last ${timePeriod} days`}
              </p>
            </div>
            <Badge variant={filteredEngagementMetrics.totalEngagement > 0 ? "success" : "secondary"} size="sm">
              <Heart size={12} className="mr-1" />
              {filteredEngagementMetrics.totalEngagement > 0 ? 'Active' : 'No Data'}
            </Badge>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Inter'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={CHART_COLORS.electric} 
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.electric, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Audience & Growth Section with Mesh Gradient */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${gradient2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-sans">Audience & Growth</h2>
                <p className="text-gray-600">Track your community growth and engagement</p>
              </div>
            </div>
            
            {/* Community Breakdown - Full Width */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Content Analysis</h3>
              <p className="text-sm text-gray-600 mb-6">Based on analysis of your {getFilteredPosts?.length || 0} posts in the selected time period</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={communityBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name.replace('Content', '')]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {communityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>
        </div>
      </div>

    </div>
  );
}

export default OverviewV2;