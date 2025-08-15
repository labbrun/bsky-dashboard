import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  MessageSquare,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import TypingEffect from '../components/TypingEffect';
import { getAuthorFeed } from '../services/blueskyService';
import { getPerformanceAnalytics } from '../services/analyticsService';
import { 
  Card, 
  Badge, 
  Skeleton,
  Button
} from '../components/ui/UntitledUIComponents';

// Import mesh gradients for backgrounds
import gradient1 from '../assets/untitled-ui/Additional assets/Mesh gradients/11.jpg';


function PerformanceV2({ metrics }) {
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [hasTyped, setHasTyped] = useState(false);
  const [currentObservation, setCurrentObservation] = useState('');
  const [timeRange, setTimeRange] = useState('7'); // '7' for 7 days, '30' for 30 days

  // Helper functions for expanding/collapsing posts
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Fetch real data on component mount and when time range changes
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (metrics && metrics.handle) {
        try {
          // Fetch recent posts based on time range
          setLoadingPosts(true);
          const limit = timeRange === '7' ? 15 : 25; // More posts for 30-day analysis
          const feedResponse = await getAuthorFeed(metrics.handle, limit);
          if (feedResponse && feedResponse.feed) {
            // Filter posts by time range
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
            
            const filteredFeed = feedResponse.feed.filter(item => {
              const postDate = new Date(item.post.indexedAt);
              return postDate >= cutoffDate;
            });
            
            // Generate analytics data using all filtered posts for more accurate analysis
            const allFilteredPosts = filteredFeed.map((item, index) => {
              const post = item.post;
              const hasImages = post.record?.embed?.images && post.record.embed.images.length > 0;
              const isThread = post.record?.reply?.parent?.uri ? true : false;
              const format = hasImages ? 'Text + Image' : isThread ? 'Thread' : 'Text';
              
              const totalEngagement = (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0);
              const engagementRate = metrics.followersCount > 0 
                ? ((totalEngagement / metrics.followersCount) * 100).toFixed(1)
                : 0;
              
              return {
                id: index + 1,
                uri: post.uri,
                text: post.record?.text || '',
                timestamp: post.indexedAt,
                format,
                likes: post.likeCount || 0,
                replies: post.replyCount || 0,
                reposts: post.repostCount || 0,
                engagementRate: parseFloat(engagementRate),
                topic: detectTopic(post.record?.text || '')
              };
            });
            
            const analytics = getPerformanceAnalytics(allFilteredPosts, metrics);
            setAnalyticsData(analytics);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    fetchPerformanceData();
  }, [metrics, timeRange]);

  // Generate AI Performance Insights based on analytics data and time range
  const getAIPerformanceObservation = React.useMemo(() => {
    if (!analyticsData || !metrics) return '';
    
    const topFormat = analyticsData.engagementByFormat[0];
    const topTopic = analyticsData.engagementByTopic[0];
    const avgEngagement = analyticsData.summary.avgEngagement;
    const totalPosts = analyticsData.summary.totalPosts;
    
    if (timeRange === '7') {
      return `Your last 7 days show strong performance patterns with "${topFormat?.format || 'Text'}" posts driving ${topFormat?.rate || 0}% engagement rates. ${topTopic?.topic || 'General'} content is resonating particularly well this week. With ${totalPosts} posts and ${avgEngagement.toFixed(1)} average engagements, your short-term strategy is effective. For the next week, focus on publishing more "${topFormat?.format || 'Text'}" content during peak engagement hours and continue exploring "${topTopic?.topic || 'General'}" topics that are currently trending with your audience.`;
    } else {
      return `Over the past 30 days, your content performance shows excellent strategic direction. "${topFormat?.format || 'Text'}" posts consistently achieve ${topFormat?.rate || 0}% engagement rates, while "${topTopic?.topic || 'General'}" topics drive the strongest audience response. With ${totalPosts} posts analyzed and ${avgEngagement.toFixed(1)} average engagements per post, your monthly performance indicates solid growth potential. Consider scaling your top-performing content types and experimenting with related topics to "${topTopic?.topic || 'General'}" to expand your reach while maintaining engagement quality.`;
    }
  }, [analyticsData, metrics, timeRange]);
  
  // Update observation when analytics data or time range changes
  React.useEffect(() => {
    if (analyticsData && metrics) {
      const newObservation = getAIPerformanceObservation;
      setCurrentObservation(newObservation);
      setHasTyped(false); // Reset typing effect when time range changes
    }
  }, [analyticsData, metrics, timeRange, getAIPerformanceObservation]);

  // Helper function to detect topic from post text
  const detectTopic = (text) => {
    const lowercaseText = text.toLowerCase();
    if (lowercaseText.includes('ai') || lowercaseText.includes('artificial intelligence')) return 'AI';
    if (lowercaseText.includes('startup') || lowercaseText.includes('launch')) return 'Startup';
    if (lowercaseText.includes('personal') || lowercaseText.includes('life')) return 'Personal';
    if (lowercaseText.includes('tech') || lowercaseText.includes('software')) return 'Tech';
    return 'General';
  };


  // Use real analytics data or fallback to sample data
  const engagementByFormat = analyticsData?.engagementByFormat || [
    { format: 'Text + Image', rate: 0 },
    { format: 'Text', rate: 0 },
    { format: 'Link', rate: 0 },
    { format: 'Reply', rate: 0 },
    { format: 'Quote Post', rate: 0 }
  ];

  const engagementByTopic = analyticsData?.engagementByTopic || [
    { topic: 'AI & Tech', rate: 0 },
    { topic: 'Home Lab', rate: 0 },
    { topic: 'Privacy & Security', rate: 0 },
    { topic: 'Small Business', rate: 0 },
    { topic: 'Personal', rate: 0 }
  ];


  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md bg-primary-850 border-gray-700">
          <BarChart3 size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">Loading Performance Data</h2>
          <p className="text-gray-300 mt-2">Analyzing your content and audience metrics...</p>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8 font-sans">
      {/* Bluesky-Style Profile Header */}
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
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1 font-sans">{metrics.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4 font-sans">@{metrics.handle}</p>
                  <p className="text-gray-300 mb-4 max-w-2xl leading-5 font-sans">{metrics.description || 'Building the future with Home Lab, Self Hosting, and Privacy-first solutions for Small Business.'}</p>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white font-sans">{metrics.followersCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium font-sans">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white font-sans">{metrics.followsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium font-sans">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white font-sans">{metrics.postsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium font-sans">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white font-sans">12/14</p>
                      <p className="text-gray-400 text-sm font-medium font-sans">Frequency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white font-sans">23%</p>
                      <p className="text-gray-400 text-sm font-medium font-sans">Mutuals</p>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Performance</h1>
          <p className="text-gray-600 mt-1 font-sans">Detailed analytics and content performance metrics for the last {timeRange} days</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '7' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange('7')}
          >
            Last 7 days
          </Button>
          <Button
            variant={timeRange === '30' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange('30')}
          >
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Hero Section with Mesh Gradient Background */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${gradient1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Sparkles size={24} className="text-warning-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold font-sans">
                  AI Performance Insights
                </h2>
                <Badge variant="warning" size="sm">LIVE</Badge>
              </div>
              
              {/* AI Observation Section */}
              <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
                {hasTyped || !currentObservation ? (
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                    {currentObservation}
                  </p>
                ) : (
                  <TypingEffect 
                    text={currentObservation}
                    speed={30}
                    onComplete={() => setHasTyped(true)}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Top Format</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                    {analyticsData?.engagementByFormat[0]?.format || 'Text'} posts perform best ({analyticsData?.engagementByFormat[0]?.rate || 0}% engagement)
                  </p>
                </div>
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Top Topic</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                    {analyticsData?.engagementByTopic[0]?.topic || 'General'} content drives {analyticsData?.engagementByTopic[0]?.rate || 0}% engagement rate
                  </p>
                </div>
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Avg Performance</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                    {analyticsData?.summary.avgEngagement?.toFixed(1) || '0'} engagements per post across {analyticsData?.summary.totalPosts || 0} posts analyzed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance Section */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <BarChart3 size={24} className="text-warning-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                Content Performance
              </h2>
              <Badge variant="warning" size="sm">LIVE</Badge>
            </div>
            
            <div className="space-y-6">
              {/* Overview Boxes in 3x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Content Overview */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Content Overview</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1 font-sans">
                    {metrics?.recentPosts?.filter(p => !p.isReply).length || 0} posts
                  </p>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-2">Total posts • Reach: 2,847 accounts</p>
                  <p className="text-xs font-sans text-success-400">
                    Avg ER: {analyticsData?.summary?.avgEngagement ? (analyticsData.summary.avgEngagement / (metrics?.followersCount || 1) * 100).toFixed(1) : 0}%
                  </p>
                </div>

                {/* Engagement by Format */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Engagement by Format</span>
                  </div>
                  <div className="space-y-2">
                    {engagementByFormat.slice(0, 3).map((item, idx) => {
                      const totalPosts = metrics?.recentPosts?.length || 1;
                      const formatPosts = metrics?.recentPosts?.filter(p => p.format === item.format).length || 0;
                      const percentage = ((formatPosts / totalPosts) * 100).toFixed(1);
                      
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300 font-sans">{item.format}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-success-400 font-sans">{percentage}%</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-success-400 h-2 rounded-full"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comments Overview */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Comments Overview</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1 font-sans">
                    {metrics?.recentPosts?.filter(p => p.isReply).length || 0} comments
                  </p>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-2">Total comments • Reach: 1,234 accounts</p>
                  <p className="text-xs font-sans text-success-400">
                    Avg ER: {analyticsData?.summary?.avgEngagement ? (analyticsData.summary.avgEngagement / (metrics?.followersCount || 1) * 100).toFixed(1) : 0}%
                  </p>
                </div>

                {/* Engagement by Topic */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Engagement by Topic</span>
                  </div>
                  <div className="space-y-2">
                    {engagementByTopic.slice(0, 3).map((item, idx) => {
                      const totalPosts = metrics?.recentPosts?.length || 1;
                      const topicPosts = item.count || 0;
                      const percentage = ((topicPosts / totalPosts) * 100).toFixed(1);
                      
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300 font-sans">{item.topic}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-success-400 font-sans">{percentage}%</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-success-400 h-2 rounded-full"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avg First-Hour ER */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Avg First-Hour ER</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1 font-sans">3.8%</p>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-2">Engagement rate in first hour • Speed metric</p>
                  <p className="text-xs font-sans text-success-400">
                    +0.5% improvement
                  </p>
                </div>

                {/* Time to 10 Engagements */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Time to 10 Engagements</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1 font-sans">47m</p>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300 mb-2">Speed of engagement • Average time</p>
                  <p className="text-xs font-sans text-success-400">
                    -12m faster
                  </p>
                </div>
              </div>

              {/* Recent and Popular Posts Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Posts Section */}
                <div className="space-y-4">
                  <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-lg font-semibold text-white font-sans mb-4">Last 5 posts</h3>
                    {loadingPosts ? (
                      <div className="space-y-4">
                        <Skeleton variant="card" height={100} />
                        <Skeleton variant="card" height={100} />
                        <Skeleton variant="card" height={100} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {metrics?.recentPosts?.filter(post => !post.isReply).slice(0, 5).map((post, index) => {
                          const postId = post.uri || `post-${index}`;
                          const isExpanded = expandedPosts.has(postId);
                          const totalEngagement = (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0);
                          const engagementRate = metrics?.followersCount > 0 
                            ? ((totalEngagement / metrics.followersCount) * 100).toFixed(1)
                            : 0;
                          
                          
                          return (
                            <div key={postId} className="bg-primary-850 border border-gray-600 rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                {/* Image Section - Using exact Overview page logic */}
                                <div className="flex-shrink-0">
                                  {post.images && post.images.length > 0 ? (
                                    <div>
                                      <img 
                                        src={post.images[0].thumb || post.images[0].fullsize || post.images[0]}
                                        alt={post.images[0].alt || 'Post image'}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div 
                                        className="w-16 h-16 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans"
                                        style={{ display: 'none' }}
                                      >
                                        🖼️
                                      </div>
                                      {post.images.length > 1 && (
                                        <div className="text-xs text-gray-400 mt-1 text-center font-sans">
                                          +{post.images.length - 1} more
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans">
                                      📝
                                    </div>
                                  )}
                                </div>
                                
                                {/* Content Section */}
                                <div className="flex-1">
                                  <div className="mb-2">
                                    <p className={`text-sm text-gray-300 font-sans leading-relaxed ${
                                      isExpanded ? '' : 'line-clamp-2'
                                    }`}>
                                      {post.text || 'No text content'}
                                    </p>
                                    {post.text && post.text.length > 100 && (
                                      <button
                                        onClick={() => togglePostExpansion(postId)}
                                        className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                      >
                                        {isExpanded ? 'Show less' : 'Show more'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs">
                                      <span className="text-red-400 font-sans">{post.likeCount || 0} ❤️</span>
                                      <span className="text-blue-400 font-sans">{post.replyCount || 0} 💬</span>
                                      <span className="text-green-400 font-sans">{post.repostCount || 0} 🔄</span>
                                    </div>
                                    <div className="text-xs text-success-400 font-sans font-semibold">
                                      ER: {engagementRate}%
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-400 font-sans">
                                      {post.indexedAt ? new Date(post.indexedAt).toLocaleDateString() : 'No date'}
                                    </div>
                                    <div className="text-xs text-gray-500 font-sans">
                                      Format: {post.format || 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {(!metrics?.recentPosts || metrics.recentPosts.filter(post => !post.isReply).length === 0) && (
                          <div className="text-center text-gray-400 font-sans py-8">
                            No recent posts found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  
                  {/* 2 Most Popular Posts */}
                  <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-lg font-semibold text-white font-sans mb-4">2 Most Popular Posts</h3>
                    {loadingPosts ? (
                      <div className="space-y-4">
                        <Skeleton variant="card" height={80} />
                        <Skeleton variant="card" height={80} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {metrics?.recentPosts?.filter(post => !post.isReply)
                          .sort((a, b) => {
                            const aEngagement = (a.likeCount || 0) + (a.replyCount || 0) + (a.repostCount || 0);
                            const bEngagement = (b.likeCount || 0) + (b.replyCount || 0) + (b.repostCount || 0);
                            return bEngagement - aEngagement;
                          })
                          .slice(0, 2).map((post, index) => {
                          const postId = `popular-${post.uri || index}`;
                          const isExpanded = expandedPosts.has(postId);
                          const totalEngagement = (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0);
                          const engagementRate = metrics?.followersCount > 0 
                            ? ((totalEngagement / metrics.followersCount) * 100).toFixed(1)
                            : 0;
                          
                          return (
                            <div key={postId} className="bg-primary-850 border border-gray-600 rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                {/* Image Section */}
                                <div className="flex-shrink-0">
                                  {post.images && post.images.length > 0 ? (
                                    <div>
                                      <img 
                                        src={post.images[0].thumb || post.images[0].fullsize || post.images[0]}
                                        alt={post.images[0].alt || 'Post image'}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div 
                                        className="w-16 h-16 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans"
                                        style={{ display: 'none' }}
                                      >
                                        🖼️
                                      </div>
                                      {post.images.length > 1 && (
                                        <div className="text-xs text-gray-400 mt-1 text-center font-sans">
                                          +{post.images.length - 1} more
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans">
                                      📝
                                    </div>
                                  )}
                                </div>
                                
                                {/* Content Section */}
                                <div className="flex-1">
                                  <div className="mb-2">
                                    <p className={`text-sm text-gray-300 font-sans leading-relaxed ${
                                      isExpanded ? '' : 'line-clamp-2'
                                    }`}>
                                      {post.text || 'No text content'}
                                    </p>
                                    {post.text && post.text.length > 100 && (
                                      <button
                                        onClick={() => togglePostExpansion(postId)}
                                        className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                      >
                                        {isExpanded ? 'Show less' : 'Show more'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs">
                                      <span className="text-red-400 font-sans">{post.likeCount || 0} ❤️</span>
                                      <span className="text-blue-400 font-sans">{post.replyCount || 0} 💬</span>
                                      <span className="text-green-400 font-sans">{post.repostCount || 0} 🔄</span>
                                    </div>
                                    <div className="text-xs text-success-400 font-sans font-semibold">
                                      ER: {engagementRate}%
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-400 font-sans">
                                      {post.indexedAt ? new Date(post.indexedAt).toLocaleDateString() : 'No date'}
                                    </div>
                                    <div className="text-xs text-warning-400 font-sans">
                                      🏆 Popular
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {(!metrics?.recentPosts || metrics.recentPosts.filter(post => !post.isReply).length < 2) && (
                          <div className="text-center text-gray-400 font-sans py-8">
                            Not enough posts for popularity ranking
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-lg font-semibold text-white font-sans mb-4">Last 5 comments</h3>
                    {loadingPosts ? (
                      <div className="space-y-4">
                        <Skeleton variant="card" height={100} />
                        <Skeleton variant="card" height={100} />
                        <Skeleton variant="card" height={100} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {metrics?.recentPosts?.filter(post => post.isReply && post.replyTo).slice(0, 5).map((comment, index) => {
                          const commentId = comment.uri || `comment-${index}`;
                          const isExpanded = expandedComments.has(commentId);
                          const totalEngagement = (comment.likeCount || 0) + (comment.replyCount || 0) + (comment.repostCount || 0);
                          const engagementRate = metrics?.followersCount > 0 
                            ? ((totalEngagement / metrics.followersCount) * 100).toFixed(1)
                            : 0;
                          
                          return (
                            <div key={commentId} className="bg-primary-850 border border-gray-600 rounded-lg p-4">
                              {/* Original Post Context */}
                              {comment.replyTo && (
                                <div className="mb-3 p-3 rounded-lg border border-gray-600 bg-white/5">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-gray-400 font-sans">
                                      💬 Replying to @{comment.replyTo.author.handle}
                                    </span>
                                  </div>
                                  <p className={`text-xs text-gray-300 italic font-sans leading-5 ${
                                    isExpanded ? '' : 'line-clamp-2'
                                  }`}>
                                    "{comment.replyTo.text}"
                                  </p>
                                  {comment.replyTo.text && comment.replyTo.text.length > 80 && (
                                    <button
                                      onClick={() => toggleCommentExpansion(commentId)}
                                      className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                    >
                                      {isExpanded ? 'Show less original' : 'Show more original'}
                                    </button>
                                  )}
                                </div>
                              )}
                              
                              {/* Comment Content */}
                              <div className="flex items-start gap-4">
                                {/* Image Section - Check for comment images */}
                                <div className="flex-shrink-0">
                                  {comment.images && comment.images.length > 0 ? (
                                    <div>
                                      <img 
                                        src={comment.images[0].thumb || comment.images[0].fullsize || comment.images[0]}
                                        alt={comment.images[0].alt || 'Comment image'}
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div 
                                        className="w-12 h-12 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans"
                                        style={{ display: 'none' }}
                                      >
                                        💬
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans">
                                      💬
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="mb-2">
                                    <p className={`text-sm text-gray-300 font-sans leading-relaxed ${
                                      isExpanded ? '' : 'line-clamp-2'
                                    }`}>
                                      {comment.text || 'No comment text'}
                                    </p>
                                    {comment.text && comment.text.length > 100 && (
                                      <button
                                        onClick={() => toggleCommentExpansion(commentId)}
                                        className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                      >
                                        {isExpanded ? 'Show less' : 'Show more'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs">
                                      <span className="text-red-400 font-sans">{comment.likeCount || 0} ❤️</span>
                                      <span className="text-blue-400 font-sans">{comment.replyCount || 0} 💬</span>
                                      <span className="text-green-400 font-sans">{comment.repostCount || 0} 🔄</span>
                                    </div>
                                    <div className="text-xs text-success-400 font-sans font-semibold">
                                      ER: {engagementRate}%
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-400 font-sans">
                                      {comment.indexedAt ? new Date(comment.indexedAt).toLocaleDateString() : 'No date'}
                                    </div>
                                    <div className="text-xs text-gray-500 font-sans">
                                      Format: {comment.format || 'Reply'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {(!metrics?.recentPosts || metrics.recentPosts.filter(post => post.isReply && post.replyTo).length === 0) && (
                          <div className="text-center text-gray-400 font-sans py-8">
                            No recent comments found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 2 Most Popular Comments */}
                  <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                    <h3 className="text-lg font-semibold text-white font-sans mb-4">2 Most Popular Comments</h3>
                    {loadingPosts ? (
                      <div className="space-y-4">
                        <Skeleton variant="card" height={80} />
                        <Skeleton variant="card" height={80} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {metrics?.recentPosts?.filter(post => post.isReply && post.replyTo)
                          .sort((a, b) => {
                            const aEngagement = (a.likeCount || 0) + (a.replyCount || 0) + (a.repostCount || 0);
                            const bEngagement = (b.likeCount || 0) + (b.replyCount || 0) + (b.repostCount || 0);
                            return bEngagement - aEngagement;
                          })
                          .slice(0, 2).map((comment, index) => {
                          const commentId = `popular-comment-${comment.uri || index}`;
                          const isExpanded = expandedComments.has(commentId);
                          const totalEngagement = (comment.likeCount || 0) + (comment.replyCount || 0) + (comment.repostCount || 0);
                          const engagementRate = metrics?.followersCount > 0 
                            ? ((totalEngagement / metrics.followersCount) * 100).toFixed(1)
                            : 0;
                          
                          return (
                            <div key={commentId} className="bg-primary-850 border border-gray-600 rounded-lg p-4">
                              {/* Original Post Context */}
                              {comment.replyTo && (
                                <div className="mb-3 p-3 rounded-lg border border-gray-600 bg-white/5">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-gray-400 font-sans">
                                      💬 Replying to @{comment.replyTo.author.handle}
                                    </span>
                                  </div>
                                  <p className={`text-xs text-gray-300 italic font-sans leading-5 ${
                                    isExpanded ? '' : 'line-clamp-2'
                                  }`}>
                                    "{comment.replyTo.text}"
                                  </p>
                                  {comment.replyTo.text && comment.replyTo.text.length > 80 && (
                                    <button
                                      onClick={() => toggleCommentExpansion(commentId)}
                                      className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                    >
                                      {isExpanded ? 'Show less original' : 'Show more original'}
                                    </button>
                                  )}
                                </div>
                              )}
                              
                              {/* Comment Content */}
                              <div className="flex items-start gap-4">
                                {/* Image Section */}
                                <div className="flex-shrink-0">
                                  {comment.images && comment.images.length > 0 ? (
                                    <div>
                                      <img 
                                        src={comment.images[0].thumb || comment.images[0].fullsize || comment.images[0]}
                                        alt={comment.images[0].alt || 'Comment image'}
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div 
                                        className="w-12 h-12 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans"
                                        style={{ display: 'none' }}
                                      >
                                        💬
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-sans">
                                      💬
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="mb-2">
                                    <p className={`text-sm text-gray-300 font-sans leading-relaxed ${
                                      isExpanded ? '' : 'line-clamp-2'
                                    }`}>
                                      {comment.text || 'No comment text'}
                                    </p>
                                    {comment.text && comment.text.length > 100 && (
                                      <button
                                        onClick={() => toggleCommentExpansion(commentId)}
                                        className="text-xs text-brand-400 hover:text-brand-300 font-sans mt-1 underline"
                                      >
                                        {isExpanded ? 'Show less' : 'Show more'}
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-3 text-xs">
                                      <span className="text-red-400 font-sans">{comment.likeCount || 0} ❤️</span>
                                      <span className="text-blue-400 font-sans">{comment.replyCount || 0} 💬</span>
                                      <span className="text-green-400 font-sans">{comment.repostCount || 0} 🔄</span>
                                    </div>
                                    <div className="text-xs text-success-400 font-sans font-semibold">
                                      ER: {engagementRate}%
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-400 font-sans">
                                      {comment.indexedAt ? new Date(comment.indexedAt).toLocaleDateString() : 'No date'}
                                    </div>
                                    <div className="text-xs text-warning-400 font-sans">
                                      🏆 Popular
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {(!metrics?.recentPosts || metrics.recentPosts.filter(post => post.isReply && post.replyTo).length < 2) && (
                          <div className="text-center text-gray-400 font-sans py-8">
                            Not enough comments for popularity ranking
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* AI Topic Insights */}
      {analyticsData?.aiTopicInsights && (
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Target size={24} className="text-warning-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold font-sans">
                  AI Topic Analysis & Recommendations
                </h2>
                <Badge variant="warning" size="sm">INSIGHTS</Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topic Targeting Accuracy */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className={analyticsData.aiTopicInsights.onTarget > 70 ? "text-success-400" : "text-warning-400"} />
                    <span className={`font-semibold text-sm font-sans ${
                      analyticsData.aiTopicInsights.onTarget > 70 ? 'text-success-400' : 'text-warning-400'
                    }`}>
                      Topic Targeting Accuracy
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2 font-sans">
                    {analyticsData.aiTopicInsights.onTarget}%
                  </p>
                  <p className="text-sm text-gray-300 font-sans mb-3">
                    of your content aligns with target topics
                  </p>
                  
                  {analyticsData.aiTopicInsights.offTarget.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 font-sans mb-2">Off-target content:</p>
                      {analyticsData.aiTopicInsights.offTarget.slice(0, 2).map((post, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-2 mb-2">
                          <p className="text-xs text-gray-300 font-sans">
                            {post.topic}: {post.text}
                          </p>
                          <p className="text-xs text-warning-400 font-sans">
                            {post.engagement} interactions
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Recommendations */}
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">
                      AI Recommendations
                    </span>
                  </div>
                  <div className="space-y-3">
                    {analyticsData.aiTopicInsights.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-gray-300 font-sans leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default PerformanceV2;