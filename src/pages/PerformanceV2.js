import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  MessageSquare
} from 'lucide-react';
import { getAuthorFeed } from '../services/blueskyService';
import { getPerformanceAnalytics } from '../services/analyticsService';
import { 
  Card, 
  Badge, 
  Skeleton
} from '../components/ui/UntitledUIComponents';

// Import mesh gradients for backgrounds
import gradient1 from '../assets/untitled-ui/Additional assets/Mesh gradients/11.jpg';


function PerformanceV2({ metrics }) {
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());

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

  // Fetch real data on component mount
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (metrics && metrics.handle) {
        try {
          // Fetch recent posts
          setLoadingPosts(true);
          const feedResponse = await getAuthorFeed(metrics.handle, 10);
          if (feedResponse && feedResponse.feed) {
            const posts = feedResponse.feed.slice(0, 5).map((item, index) => {
              const post = item.post;
              const hasImages = post.record?.embed?.images && post.record.embed.images.length > 0;
              const isThread = post.record?.reply?.parent?.uri ? true : false;
              const format = hasImages ? 'Text + Image' : isThread ? 'Thread' : 'Text';
              
              // Calculate engagement rate
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
                amplification: post.repostCount > 0 ? (post.repostCount / (post.likeCount || 1)).toFixed(1) : 0,
                topic: detectTopic(post.record?.text || ''),
                images: post.record?.embed?.images || [],
                author: post.author
              };
            });
            
            // Generate analytics data
            const analytics = getPerformanceAnalytics(posts, metrics);
            setAnalyticsData(analytics);
            console.log('Analytics data generated:', analytics);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoadingPosts(false);
        }
      }
    };

    fetchPerformanceData();
  }, [metrics]);

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
    <div className="space-y-8">
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
                  AI Performance Intelligence
                </h2>
                <Badge variant="warning" size="sm">LIVE</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Performance</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Your engagement rate is 28% above average. Keep posting during peak hours!</p>
                </div>
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Timing</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Post between 2-4 PM for 45% higher engagement rates.</p>
                </div>
                <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-success-400" />
                    <span className="text-success-400 font-semibold text-sm font-sans">Content</span>
                  </div>
                  <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Tech-focused posts get 3x more amplification. Double down on this!</p>
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
                          
                          // Debug logging to match Overview page
                          console.log(`Performance Post ${index}:`, {
                            text: post.text?.substring(0, 50),
                            isReply: post.isReply,
                            replyTo: post.replyTo,
                            date: post.indexedAt,
                            hasImages: !!post.images,
                            imageCount: post.images?.length || 0,
                            images: post.images
                          });
                          
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
                                          console.log('Image failed to load:', e.target.src);
                                          e.target.style.display = 'none';
                                          e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => {
                                          console.log('Image loaded successfully:', post.images[0].thumb || post.images[0].fullsize);
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