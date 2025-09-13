import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FileText, 
  Users, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Sparkles,
  Share2,
  TrendingUp,
  BookOpen,
  ExternalLink
} from 'lucide-react';

// Services
import { getComprehensiveBlogAnalytics } from '../services/blogAnalyticsService';
import { getBlogTrafficOverview, getReferralTraffic } from '../services/googleAnalyticsService';
import realAIService from '../services/realAIService';
import logger from '../services/loggingService';

// Import Untitled UI components
import { 
  Button, 
  Badge, 
  Skeleton
} from '../components/ui/UntitledUIComponents';

// Import feature unavailable components
import { FeatureRequirements } from '../components/FeatureUnavailable';
import { isServiceConfigured } from '../services/credentialsService';

// Import mesh gradients for backgrounds (unused but kept for future use)

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

function BlogAnalytics({ metrics }) {
  const [loading, setLoading] = useState(true);
  const [blogAnalytics, setBlogAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [trafficData, setTrafficData] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [gaLoading, setGaLoading] = useState(false);
  
  // AI state management for blog analysis
  const [aiServiceReady, setAiServiceReady] = useState(false);
  const [blogAIAnalysis, setBlogAIAnalysis] = useState(null);
  const [loadingAIAnalysis, setLoadingAIAnalysis] = useState(false);
  
  // Initialize AI service for blog analysis
  useEffect(() => {
    const initAI = async () => {
      const ready = await realAIService.initialize();
      setAiServiceReady(ready);
    };
    initAI();
  }, []);
  
  // Generate AI analysis for blog content
  const generateBlogAIAnalysis = useCallback(async () => {
    if (!aiServiceReady || !blogAnalytics || loadingAIAnalysis) return;
    
    setLoadingAIAnalysis(true);
    try {
      // Create blog-specific metrics object for AI analysis
      const blogMetrics = {
        totalPosts: blogAnalytics.overview?.totalPosts || 0,
        recentPosts: blogAnalytics.content?.recentPosts?.slice(0, 5).map(post => ({
          text: post.title + ': ' + (post.description || post.excerpt || ''),
          title: post.title,
          link: post.link
        })) || [],
        traffic: {
          sessions: blogAnalytics.insights?.trafficPerformance?.totalSessions || 0,
          bounceRate: blogAnalytics.insights?.trafficPerformance?.averageBounceRate || 0
        }
      };
      
      const analysis = await realAIService.generateContentStrategy(blogMetrics, blogMetrics.recentPosts);
      setBlogAIAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate blog AI analysis:', error);
    } finally {
      setLoadingAIAnalysis(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiServiceReady, blogAnalytics]);
  
  // Auto-generate AI analysis when blog data loads
  useEffect(() => {
    if (aiServiceReady && blogAnalytics && !loadingAIAnalysis && !blogAIAnalysis) {
      generateBlogAIAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiServiceReady, blogAnalytics]);
  

  // Check if blog RSS is configured
  const isBlogConfigured = useMemo(() => {
    return isServiceConfigured('blog');
  }, []);

  // Load blog analytics data - Real data only
  const loadBlogAnalytics = useCallback(async () => {
    if (!isBlogConfigured) {
      setLoading(false);
      setError('Blog RSS feed not configured. Please configure it in Settings to view blog analytics.');
      setBlogAnalytics(null);
      return;
    }

    setLoading(true);
    setError(null);
    setBlogAnalytics(null);
    
    try {
      logger.info('Loading blog analytics data');
      // Add timeout to prevent page hanging
      const analytics = await Promise.race([
        getComprehensiveBlogAnalytics(timeRange),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Blog analytics loading timeout')), 15000)
        )
      ]);
      
      // Only set data if we got valid analytics
      if (analytics && !analytics.error) {
        setBlogAnalytics(analytics);
        logger.info('Blog analytics data loaded successfully', { hasAnalytics: !!analytics });
      } else {
        throw new Error(analytics?.error || 'Failed to load blog analytics');
      }
    } catch (err) {
      console.error('Blog analytics failed:', err.message);
      setError(`Failed to load blog analytics: ${err.message}. Please check your blog RSS configuration in Settings.`);
      setBlogAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [timeRange, isBlogConfigured]);

  // Load Google Analytics data - Optimized with timeout
  const loadGoogleAnalytics = useCallback(async () => {
    setGaLoading(true);
    try {
      logger.info('Loading Google Analytics data', { timeRangeDays: timeRange });
      
      // Use Promise.allSettled with a reasonable timeout
      const gaDataPromise = Promise.allSettled([
        getBlogTrafficOverview(timeRange),
        getReferralTraffic(timeRange)
      ]);
      
      // Add timeout wrapper
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve([
          { status: 'rejected', reason: { message: 'Timeout' } },
          { status: 'rejected', reason: { message: 'Timeout' } }
        ]), 20000) // Increased to 20 seconds to allow real GA API calls
      );
      
      const [trafficOverview, referralTraffic] = await Promise.race([gaDataPromise, timeoutPromise]);
      
      // Process traffic overview results
      if (trafficOverview.status === 'fulfilled' && trafficOverview.value && trafficOverview.value.length > 0) {
        logger.info('Google Analytics traffic data loaded', { dataPoints: trafficOverview.value?.length || 0 });
        setTrafficData(trafficOverview.value);
      } else {
        console.warn('❌ Traffic data failed or empty, reason:', trafficOverview.reason?.message || 'No data');
        setTrafficData(null); // Will use fallback data in UI
      }
      
      // Process referral traffic results  
      if (referralTraffic.status === 'fulfilled' && referralTraffic.value && referralTraffic.value.length > 0) {
        logger.info('Google Analytics referral data loaded', { sources: referralTraffic.value?.length || 0 });
        setReferralData(referralTraffic.value);
      } else {
        console.warn('❌ Referral data failed or empty, reason:', referralTraffic.reason?.message || 'No data');
        setReferralData(null); // Will use fallback data in UI
      }
    } catch (error) {
      console.error('Google Analytics loading error:', error);
      setTrafficData(null);
      setReferralData(null);
    } finally {
      setGaLoading(false);
    }
  }, [timeRange]);


  // All hooks must be called before any early returns
  const analytics = useMemo(() => blogAnalytics || {}, [blogAnalytics]);

  // Memoized expensive calculations to prevent re-computation on every render
  const totalSessions = useMemo(() => {
    if (trafficData && trafficData.length > 0) {
      return trafficData.reduce((sum, day) => sum + day.sessions, 0).toLocaleString();
    }
    return analytics.insights?.trafficPerformance?.totalSessions?.toLocaleString() || '--';
  }, [trafficData, analytics.insights?.trafficPerformance?.totalSessions]);

  const averageBounceRate = useMemo(() => {
    if (trafficData && trafficData.length > 0) {
      return (trafficData.reduce((sum, day) => sum + day.bounceRate, 0) / trafficData.length).toFixed(1);
    }
    return analytics.insights?.trafficPerformance?.averageBounceRate ? Math.round(analytics.insights.trafficPerformance.averageBounceRate) : '--';
  }, [trafficData, analytics.insights?.trafficPerformance?.averageBounceRate]);

  // Load data in background without blocking the UI
  useEffect(() => {
    // Load blog analytics first (faster)
    if (isBlogConfigured) {
      loadBlogAnalytics();
    } else {
      setLoading(false);
    }
  }, [loadBlogAnalytics, isBlogConfigured]);

  // Load Google Analytics separately to avoid blocking
  useEffect(() => {
    // Only load GA data if Google Analytics is configured
    const gaConfigured = isServiceConfigured('google');
    if (gaConfigured) {
      loadGoogleAnalytics();
    }
  }, [loadGoogleAnalytics]);

  // Check if required services are configured - MOVED AFTER ALL HOOKS
  const blogConfigured = isServiceConfigured('blog');
  const googleConfigured = isServiceConfigured('google');
  const missingFeatures = [];
  
  if (!blogConfigured) missingFeatures.push('blog');
  if (!googleConfigured) missingFeatures.push('google');

  // If no services are configured, show feature unavailable message
  if (!blogConfigured && !googleConfigured) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-brand-500" />
          <h1 className="text-2xl font-bold text-white">Blog Analytics</h1>
        </div>
        
        <div className="bg-primary-900 rounded-lg border border-gray-800">
          <div className="p-6">
            <FeatureRequirements features={['blog', 'google']} />
            <div className="mt-6 text-center">
              <Button
                onClick={() => window.location.href = '/settings'}
                variant="primary"
                size="lg"
              >
                Configure Blog Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-sm font-bold text-white">Blog Analytics</h1>
            <p className="text-primary-300 mt-2">Loading comprehensive blog performance analysis...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white">
              <Skeleton className="h-20" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white">
              <Skeleton className="h-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error && !blogAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} color="white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Blog Analytics Error
          </h2>
          <p className="text-gray-300 mb-6">
            {error}
          </p>
          <Button
            onClick={loadBlogAnalytics}
            variant="primary"
            size="lg"
            icon={<RefreshCw size={16} />}
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  // Use the same Bluesky profile data structure as other pages
  const profileData = metrics || {
    displayName: "Loading...",
    handle: "loading.bsky.social", 
    description: "Configure your Bluesky account in Settings to see your profile data here.",
    avatar: "https://avatar.vercel.sh/loading.bsky.social.svg?text=L",
    banner: null,
    followersCount: 0,
    followsCount: 0,
    postsCount: 0
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Bluesky Profile Header - Same as OverviewV2 */}
      <div className="relative">
        {/* Background Banner */}
        <div className="h-32 rounded-2xl relative overflow-hidden">
          {profileData.banner ? (
            <>
              <img 
                src={profileData.banner} 
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
                src={profileData.avatar}
                alt={profileData.displayName}
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
                  <h1 className="text-2xl font-bold text-white mb-1 font-sans">{profileData.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4 font-sans">@{profileData.handle}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ExternalLink size={16} />}
                    iconPosition="right"
                    onClick={() => window.open(`https://bsky.app/profile/${profileData.handle}`, '_blank')}
                  >
                    View on Bluesky
                  </Button>
                </div>
              </div>
              
              {/* Bio in styled container - full width */}
              <div className="bg-primary-800 border border-gray-600 rounded-xl p-4 mb-4 hover:border-brand-400 transition-colors">
                <p className="text-gray-300 leading-5 font-sans">{profileData.description || 'Configure your Bluesky account in Settings to see your profile description here.'}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{profileData.followersCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Followers</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{profileData.followsCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Following</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.mutualsPercentage || '--'}%</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Mutuals</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{profileData.postsCount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Posts</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.currentEngagement || '--'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Frequency</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.targetPercentage || '--'}%</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">On Target</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Blog Analytics</h1>
          <p className="text-gray-600 mt-1 font-sans">Analytics dashboard for the last {timeRange} days</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === 7 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange(7)}
          >
            Last 7 days
          </Button>
          <Button
            variant={timeRange === 30 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange(30)}
          >
            Last 30 days
          </Button>
          <Button
            variant={timeRange === 90 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange(90)}
          >
            Last 90 days
          </Button>
          <Button
            onClick={loadBlogAnalytics}
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Blog Intelligence Section - Uses dark background like OverviewV2 */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Sparkles size={24} className="text-warning-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                AI Blog Intelligence
              </h2>
              <Badge variant={aiServiceReady ? "success" : "secondary"} size="sm">
                {aiServiceReady ? "LIVE" : "NOT CONFIGURED"}
              </Badge>
            </div>
            
            {/* REAL AI Blog Analysis */}
            {!aiServiceReady ? (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-4">
                  Configure your AI API (API Key and Base URL) in Settings to get real AI analysis of your blog content.
                </p>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/settings'}
                  className="flex items-center gap-2"
                >
                  Configure AI Service
                </Button>
              </div>
            ) : loadingAIAnalysis ? (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  🤖 Analyzing your blog content with AI...
                </p>
              </div>
            ) : blogAIAnalysis ? (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <div className="mb-3">
                  <span className="text-brand-400 font-semibold text-sm font-sans">🤖 AI Blog Content Analysis</span>
                  <span className="ml-2 text-xs text-gray-400">Generated from your blog data</span>
                </div>
                <div className="text-sm font-sans leading-relaxed text-gray-300 whitespace-pre-line mb-4">
                  {blogAIAnalysis.content}
                </div>
                <Button 
                  size="sm"
                  onClick={generateBlogAIAnalysis}
                  disabled={loadingAIAnalysis}
                  className="flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  Refresh Analysis
                </Button>
                <div className="mt-3 text-xs text-gray-500">
                  Generated: {new Date(blogAIAnalysis.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-4">
                  {blogAnalytics ? 'Unable to generate AI analysis. Check your API configuration.' : 'Load blog data first to get AI analysis.'}
                </p>
                {blogAnalytics && (
                  <Button 
                    size="sm"
                    onClick={generateBlogAIAnalysis}
                    disabled={loadingAIAnalysis}
                    className="flex items-center gap-2"
                  >
                    <Sparkles size={14} />
                    Try Again
                  </Button>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Performance</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  {analytics.insights?.trafficPerformance?.totalSessions || '--'} monthly sessions with {analytics.insights?.trafficPerformance?.averageBounceRate ? Math.round(analytics.insights.trafficPerformance.averageBounceRate) : '--'}% bounce rate
                </p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Alignment</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  {analytics.content?.metrics?.averageAlignmentScore || '--'}% audience alignment across {analytics.overview?.totalPosts || '--'} analyzed posts
                </p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Opportunities</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  {analytics.insights?.repurposingInsights?.highPriorityOpportunities || '--'} high-priority repurposing opportunities identified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Traffic Analytics - Full Width with Real GA Data */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-white font-sans">
              Blog Traffic Analytics
            </h3>
            <p className="text-sm text-gray-300 mt-1 font-sans">
              Real-time Google Analytics data for the last {timeRange} days
            </p>
          </div>
          <Badge variant={gaLoading ? 'warning' : (trafficData ? 'success' : 'error')} size="sm">
            {gaLoading ? (
              <>
                <RefreshCw size={12} className="mr-1 animate-spin" />
                Loading GA
              </>
            ) : trafficData ? (
              <>
                <TrendingUp size={12} className="mr-1" />
                Live GA Data
              </>
            ) : (
              <>
                <AlertCircle size={12} className="mr-1" />
                Mock Data
              </>
            )}
          </Badge>
        </div>

        {/* Mock Data Notice */}
        {!gaLoading && !trafficData && (
          <div className="mb-6 p-4 bg-warning-900/20 border border-warning-600 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-warning-400 mt-0.5" />
              <div>
                <h4 className="text-warning-400 font-semibold text-sm font-sans mb-2">Using Mock Data</h4>
                <p className="text-warning-200 text-sm font-sans leading-relaxed mb-3">
                  The Google Analytics token server is not running. Start the token server to enable automatic authentication and real traffic data.
                </p>
                <div className="bg-warning-800/30 rounded-lg p-3">
                  <p className="text-warning-200 text-xs font-sans mb-2"><strong>To enable real data:</strong></p>
                  <ol className="text-warning-200 text-xs font-sans space-y-1 ml-4">
                    <li>1. Open a new terminal in your project folder</li>
                    <li>2. Run: <code className="bg-warning-700/50 px-1 rounded">cd server && npm start</code></li>
                    <li>3. Refresh this page - tokens will auto-renew every 55 minutes</li>
                  </ol>
                  <p className="text-warning-200 text-xs font-sans mt-2">
                    <strong>Alternative:</strong> Add <code className="bg-warning-700/50 px-1 rounded">REACT_APP_GOOGLE_ACCESS_TOKEN</code> to .env (expires hourly)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary-900 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-success-400" />
              <span className="text-success-400 font-semibold text-sm font-sans">Total Posts</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-sans">
              {analytics.overview?.totalPosts?.toLocaleString() || '--'}
            </p>
            <p className="text-sm text-gray-300 font-sans">
              {analytics.overview?.blogMetrics?.postsPerWeek || '--'}/week
            </p>
          </div>

          <div className="bg-primary-900 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-success-400" />
              <span className="text-success-400 font-semibold text-sm font-sans">Content Alignment</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-sans">
              {analytics.content?.metrics?.averageAlignmentScore || '--'}%
            </p>
            <p className="text-sm text-gray-300 font-sans">
              {getAlignmentStatus(analytics.content?.metrics?.averageAlignmentScore)}
            </p>
          </div>

          <div className="bg-primary-900 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-success-400" />
              <span className="text-success-400 font-semibold text-sm font-sans">Monthly Sessions</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-sans">
              {totalSessions}
            </p>
            <p className="text-sm text-gray-300 font-sans">
              {averageBounceRate}% bounce
            </p>
          </div>

          <div className="bg-primary-900 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-success-400" />
              <span className="text-success-400 font-semibold text-sm font-sans">Keyword Targeting</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-sans">
              {analytics.content?.keywordTargeting?.averageScore || '--'}%
            </p>
            <p className="text-sm text-gray-300 font-sans">
              {analytics.content?.keywordTargeting?.matchedKeywords || '--'} of {analytics.content?.keywordTargeting?.targetKeywords || '--'} targets
            </p>
          </div>
        </div>

        {/* Traffic Overview Chart - Full Width */}
        <div className="bg-primary-900 rounded-xl p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white font-sans">Traffic Overview</h4>
            <Badge variant={gaLoading ? 'warning' : (trafficData ? 'success' : 'secondary')} size="sm">
              {gaLoading ? (
                <>
                  <RefreshCw size={12} className="mr-1 animate-spin" />
                  Loading
                </>
              ) : trafficData ? (
                <>
                  <TrendingUp size={12} className="mr-1" />
                  Live GA Data
                </>
              ) : (
                'Mock Data'
              )}
            </Badge>
          </div>
          {trafficData && trafficData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontFamily: 'Inter'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke={CHART_COLORS.brand} 
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.brand, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke={CHART_COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.success, r: 4 }}
                  name="Pageviews"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={CHART_COLORS.warning}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.warning, r: 4 }}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <TrendingUp size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-white font-sans text-lg">
                {gaLoading ? 'Loading real Google Analytics data...' : 'No traffic data available'}
              </p>
              <p className="text-gray-400 font-sans text-sm mt-2">
                {!gaLoading && 'Check Google Analytics API configuration'}
              </p>
            </div>
          )}
        </div>

        {/* Traffic Sources - Symmetrical Professional Layout */}
        <div className="bg-primary-900 rounded-xl p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white font-sans">Traffic Sources</h4>
            <Badge variant={gaLoading ? 'warning' : (referralData ? 'success' : 'secondary')} size="sm">
              {referralData ? 'Live GA Data' : 'Mock Data'}
            </Badge>
          </div>
          <div className="w-full">
            {(referralData && referralData.length > 0) || (analytics.traffic?.referrals && analytics.traffic.referrals.length > 0) ? (
              (() => {
                const sources = (referralData && referralData.length > 0 ? referralData : analytics.traffic?.referrals || []).slice(0, 6);
                
                return (
                  <div className="flex w-full gap-3">
                    {sources.map((referral, index) => (
                      <div key={index} className="flex-1 bg-primary-800 rounded-xl p-4 hover:bg-primary-700 transition-colors text-center border border-gray-600 hover:border-brand-400">
                        {/* Icon */}
                        <div className="flex justify-center mb-3">
                          <div className={`w-4 h-4 rounded-full ${
                            referral.isBluesky ? 'bg-brand-500' : 
                            referral.isSearch ? 'bg-success-500' : 
                            referral.isSocial ? 'bg-warning-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        
                        {/* Source Name */}
                        <div className="mb-3">
                          <p className="text-white font-semibold font-sans text-xs min-h-[16px] flex items-center justify-center">
                            {referral.displayName || referral.source}
                          </p>
                          <p className="text-xs text-gray-400 font-sans mt-1">{referral.medium}</p>
                        </div>
                        
                        {/* Metrics */}
                        <div className="space-y-1">
                          <div>
                            <p className="text-white font-bold font-sans text-lg">{referral.sessions}</p>
                            <p className="text-xs text-gray-400 font-sans">Sessions</p>
                          </div>
                          <div>
                            <p className="text-gray-300 font-medium font-sans text-sm">{referral.users}</p>
                            <p className="text-xs text-gray-400 font-sans">Users</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <div className="text-center text-gray-400 py-16">
                <div className="flex justify-center mb-6">
                  <Share2 size={64} className="opacity-50" />
                </div>
                <p className="text-white font-sans text-lg mb-2">
                  {gaLoading ? 'Loading referral data...' : 'No referral data available'}
                </p>
                <p className="text-gray-400 font-sans text-sm">
                  {!gaLoading && 'Check Google Analytics API configuration'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Performance Analysis */}
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white font-sans">
                Content Performance
              </h3>
              <p className="text-sm text-gray-300 mt-1 font-sans">
                Recent blog posts analysis
              </p>
            </div>
            <Badge 
              variant={getPerformanceBadgeVariant(analytics.content?.metrics?.averageAlignmentScore)}
              size="sm"
            >
              {getAlignmentStatus(analytics.content?.metrics?.averageAlignmentScore)}
            </Badge>
          </div>
          
          {analytics.content?.recentPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.content.recentPosts.slice(0, 6).map((post, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-primary-900 hover:bg-primary-800 transition-colors cursor-pointer border border-gray-700"
                  onClick={() => {}}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-medium text-sm line-clamp-2 flex-1 font-sans">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 ml-3">
                      <div className={`w-2 h-2 rounded-full ${
                        post.analysis?.alignmentScore > 80 ? 'bg-success-500' :
                        post.analysis?.alignmentScore > 60 ? 'bg-warning-500' : 'bg-error-500'
                      }`}></div>
                      <span className="text-xs text-gray-400 font-sans">
                        {post.analysis?.alignmentScore || '--'}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-sans">{new Date(post.pubDate).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-sans">{post.wordCount} words</span>
                      <span className="font-sans">{post.readingTime}min</span>
                    </div>
                  </div>
                  
                  {post.analysis?.alignmentAnalysis && (
                    <p className="text-xs text-gray-300 line-clamp-2 font-sans">
                      {post.analysis.alignmentAnalysis}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-white font-sans">No blog posts found</p>
            </div>
          )}
          
          {/* AI Content Performance Summary - Only show if real AI data is available */}
          {analytics.insights?.contentAnalysis && (
            <div className="mt-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-brand-400" />
                <span className="text-brand-400 font-semibold text-sm font-sans">AI Performance Analysis</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                    {analytics.insights.contentAnalysis.summary}
                  </p>
                </div>
                
                {analytics.insights.contentAnalysis.recommendations && (
                  <div className="bg-primary-800 rounded-lg p-3 border border-gray-600">
                    <h4 className="text-brand-400 font-semibold text-xs font-sans mb-2">📈 AI Recommendations:</h4>
                    <p className="text-xs font-sans leading-relaxed text-success-300">
                      {analytics.insights.contentAnalysis.recommendations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Performance Insights - Show only when data is available */}
        {blogAnalytics?.contentAnalysis && (
          <div className="bg-primary-850 border border-gray-700 rounded-xl p-6 shadow-xl text-white">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="text-green-400" size={20} />
              Content Performance Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real performance data will be displayed here when available */}
              <div className="border border-gray-600 rounded-lg bg-primary-800 p-4">
                <h4 className="font-semibold text-gray-200 mb-3">📊 Performance Insights</h4>
                <p className="text-sm text-gray-300">
                  Configure Google Analytics in Settings to see detailed content performance insights.
                </p>
              </div>
              <div className="border border-gray-600 rounded-lg bg-primary-800 p-4">
                <h4 className="font-semibold text-gray-200 mb-3">💡 Recommendations</h4>
                <p className="text-sm text-gray-300">
                  AI-powered content recommendations will appear when blog analytics data is available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Blog Article Suggestions - Shows when data is available */}
        {blogAnalytics?.suggestions && blogAnalytics.suggestions.length > 0 ? (
          <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white font-sans flex items-center gap-2">
                  <BookOpen size={18} className="text-success-500" />
                  AI Blog Article Suggestions
                </h3>
                <p className="text-sm text-gray-300 mt-1 font-sans">
                  Strategic blog topics based on your performance data and trending content
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogAnalytics.suggestions.map((suggestion, index) => (
                <div key={index} className="bg-primary-900 border border-gray-700 rounded-xl p-4">
                  <h4 className="text-white font-semibold text-sm mb-2">{suggestion.title}</h4>
                  <p className="text-gray-300 text-xs">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white">
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-sans mb-2">AI Blog Suggestions</h3>
              <p className="text-sm text-gray-400 font-sans">Configure your blog analytics to get AI-powered content suggestions.</p>
            </div>
          </div>
        )}
    </div>
  );
}

// Helper functions
const getAlignmentStatus = (score) => {
  if (!score) return 'Unknown';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Moderate';
  return 'Needs Work';
};

const getPerformanceBadgeVariant = (score) => {
  if (!score) return 'secondary';
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 55) return 'warning';
  return 'error';
};

export default React.memo(BlogAnalytics);
