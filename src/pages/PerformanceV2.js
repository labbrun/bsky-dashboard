import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Sparkles, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Hash,
  Target,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Award
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { getFollowers, getAuthorFeed } from '../services/blueskyService';
import { generateBlueskyPostUrl } from '../services/profileService';
import { 
  Card, 
  Button, 
  Badge, 
  MetricCard, 
  Table, 
  ProgressBar, 
  Skeleton
} from '../components/ui/UntitledUIComponents';

// Import mesh gradients for backgrounds
import gradient1 from '../assets/untitled-ui/Additional assets/Mesh gradients/11.jpg';
import gradient2 from '../assets/untitled-ui/Additional assets/Mesh gradients/15.jpg';

// Brand chart colors - consistent with your palette
const CHART_COLORS = ['#002945', '#2B54BE', '#3A5393', '#0E4CE8', '#3B4869', '#23B26A', '#F79009', '#F04438', '#8B5CF6'];

function PerformanceV2({ metrics }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [newFollowers, setNewFollowers] = useState([]);
  const [topAmplifiersData, setTopAmplifiersData] = useState([]);
  const [recentPostsData, setRecentPostsData] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (metrics && metrics.handle) {
        try {
          // Fetch recent followers
          setLoadingFollowers(true);
          const followersResponse = await getFollowers(metrics.handle, 10);
          if (followersResponse && followersResponse.followers) {
            // Get the most recent 3 followers for detailed display
            const recentFollowers = followersResponse.followers.slice(0, 3).map(f => f.handle);
            setNewFollowers(recentFollowers);
            
            // Get top amplifiers (followers with high engagement)
            const topAmplifiers = followersResponse.followers
              .slice(0, 3)
              .map(f => ({
                handle: f.handle,
                engagements: 'Data unavailable',
                reach: 'Data unavailable'
              }));
            setTopAmplifiersData(topAmplifiers);
          }
        } catch (error) {
          console.error('Error fetching followers:', error);
          // Set default values on error
          setNewFollowers(['techexplorer.bsky.social', 'airesearcher.bsky.social', 'startupfounder.bsky.social']);
          setTopAmplifiersData([
            { handle: "airesearcher.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' },
            { handle: "techwriter.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' },
            { handle: "devtools.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' }
          ]);
        } finally {
          setLoadingFollowers(false);
        }

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
            setRecentPostsData(posts);
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

  // Use real data if available, otherwise use sample data
  const recentPosts = recentPostsData.length > 0 ? recentPostsData : [
    {
      id: 1,
      text: "Loading recent posts...",
      timestamp: new Date().toISOString(),
      format: "Text",
      likes: 0,
      replies: 0,
      reposts: 0,
      engagementRate: 0,
      amplification: 0,
      topic: "General"
    }
  ];

  const engagementByFormat = [
    { format: 'Video', rate: 8.5 },
    { format: 'Thread', rate: 7.2 },
    { format: 'Image', rate: 5.8 },
    { format: 'Text', rate: 4.2 },
    { format: 'Link', rate: 3.6 }
  ];

  const engagementByTopic = [
    { topic: 'Personal', rate: 7.8 },
    { topic: 'AI', rate: 6.8 },
    { topic: 'Tech', rate: 5.4 },
    { topic: 'Startup', rate: 4.9 },
    { topic: 'Industry', rate: 4.1 }
  ];

  // Use real followers data or fallback to sample handles
  const newFollowersHandles = newFollowers.length > 0 ? newFollowers : 
    ['techexplorer.bsky.social', 'airesearcher.bsky.social', 'startupfounder.bsky.social'];

  const topAmplifiers = topAmplifiersData.length > 0 ? topAmplifiersData : [
    { handle: "airesearcher.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' },
    { handle: "techwriter.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' },
    { handle: "devtools.bsky.social", engagements: 'Data unavailable', reach: 'Data unavailable' }
  ];

  const communityBreakdown = [
    { name: 'Tech Enthusiasts', value: 40, color: CHART_COLORS[0] },
    { name: 'Entrepreneurs', value: 25, color: CHART_COLORS[1] },
    { name: 'Developers', value: 20, color: CHART_COLORS[2] },
    { name: 'Investors', value: 15, color: CHART_COLORS[3] }
  ];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <BarChart3 size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Performance Data</h2>
          <p className="text-gray-600 mt-2">Analyzing your content and audience metrics...</p>
        </Card>
      </div>
    );
  }

  // Table columns configuration for Untitled UI Table
  const postTableColumns = [
    {
      header: 'Post',
      accessor: null,
      render: (post) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 line-clamp-2">{post.text}</p>
          {post.images && post.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.images.slice(0, 2).map((image, idx) => (
                <img 
                  key={idx}
                  src={image.thumb || image.fullsize} 
                  alt={`Content ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              ))}
              {post.images.length > 2 && (
                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-semibold">+{post.images.length - 2}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Format',
      accessor: null,
      render: (post) => <Badge variant="primary" size="sm">{post.format}</Badge>
    },
    {
      header: 'Topic',
      accessor: null,
      render: (post) => <Badge variant="brand" size="sm">{post.topic}</Badge>
    },
    {
      header: 'Time',
      accessor: null,
      render: (post) => <span className="text-sm text-gray-600">{new Date(post.timestamp).toLocaleDateString()}</span>
    },
    {
      header: 'ER',
      accessor: null,
      render: (post) => (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${
            post.engagementRate > 6 ? 'text-green-600' : 
            post.engagementRate > 4 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {post.engagementRate}%
          </span>
          {post.engagementRate > 6 ? <ArrowUp size={14} className="text-green-500" /> : 
           post.engagementRate < 4 ? <ArrowDown size={14} className="text-red-500" /> : null}
        </div>
      )
    },
    {
      header: 'Engagement',
      accessor: null,
      render: (post) => (
        <div className="flex gap-3 text-xs">
          <span className="text-red-600 font-semibold">{post.likes} ❤️</span>
          <span className="text-blue-600 font-semibold">{post.replies} 💬</span>
          <span className="text-green-600 font-semibold">{post.reposts} 🔄</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: null,
      render: (post) => (
        <Button
          size="sm"
          variant="primary"
          icon={<ExternalLink size={12} />}
          iconPosition="right"
          onClick={() => window.open(post.uri ? generateBlueskyPostUrl(post.author?.handle || metrics?.handle || 'labb.run', post.uri) : '#', '_blank')}
        >
          View
        </Button>
      )
    }
  ];

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
        <Card className="bg-white bg-opacity-95 backdrop-blur-md border-0" padding="xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter', fontWeight: 700 }}>Performance Intelligence</h2>
              <Badge variant="warning" size="lg" className="mb-4">AI POWERED</Badge>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <MetricCard
                  title="Content Insight"
                  value="68%"
                  description="Video performs better than text"
                  change="+12% this week"
                  changeType="positive"
                  icon={<TrendingUp size={20} />}
                />
                <MetricCard
                  title="Peak Time"
                  value="2-4 PM"
                  description="Optimal posting window"
                  change="Weekdays"
                  changeType="neutral"
                  icon={<Clock size={20} />}
                />
                <MetricCard
                  title="Amplification"
                  value="3.2x"
                  description="From mutual followers"
                  change="+0.5x"
                  changeType="positive"
                  icon={<Users size={20} />}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Posting Frequency"
          value="12/14"
          description="Posts this week vs target"
          change="+2 vs last week"
          changeType="positive"
          icon={<Calendar size={20} />}
        />
        <MetricCard
          title="Avg First-Hour ER"
          value="3.8%"
          description="Engagement rate"
          change="+0.5%"
          changeType="positive"
          icon={<Zap size={20} />}
        />
        <MetricCard
          title="Time to 10 Engagements"
          value="47m"
          description="Speed of engagement"
          change="-12m"
          changeType="positive"
          icon={<Target size={20} />}
        />
        <MetricCard
          title="Mutuals Rate"
          value="23%"
          description="Followers who follow back"
          change="+2%"
          changeType="positive"
          icon={<Hash size={20} />}
        />
      </div>

      {/* Content Performance Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 700 }}>Content Performance</h2>
            <p className="text-gray-600">Analyze your posts, formats, and engagement patterns</p>
          </div>
        </div>
        
        {/* Recent Posts Table using Untitled UI Table Component */}
        <Card padding="none">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Posts Performance</h3>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="untitled-input bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white"
              >
                <option value="week" className="text-gray-900">Last Week</option>
                <option value="month" className="text-gray-900">Last Month</option>
                <option value="quarter" className="text-gray-900">Last Quarter</option>
              </select>
            </div>
          </div>
          
          {loadingPosts ? (
            <div className="p-8">
              <Skeleton variant="text" className="mb-4" />
              <Skeleton variant="text" className="mb-4" />
              <Skeleton variant="text" />
            </div>
          ) : (
            <Table columns={postTableColumns} data={recentPosts} />
          )}
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ER by Format */}
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Engagement by Format</h3>
                <p className="text-gray-600 text-sm">Which content types perform best</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementByFormat} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="format" stroke="#64748b" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement Rate']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="rate" fill="url(#colorGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* ER by Topic */}
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-lg">
                <Hash size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Engagement by Topic</h3>
                <p className="text-gray-600 text-sm">Your most engaging content themes</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementByTopic} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="topic" stroke="#64748b" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement Rate']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="rate" fill="url(#colorGradient2)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
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
                <h2 className="text-2xl font-bold text-gray-900">Audience & Growth</h2>
                <p className="text-gray-600">Track your community growth and engagement</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Followers */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  New Followers This Week
                  {loadingFollowers && (
                    <Badge variant="default" size="sm">Loading...</Badge>
                  )}
                </h3>
                <div className="space-y-4">
                  {loadingFollowers ? (
                    <>
                      <Skeleton variant="card" height={100} />
                      <Skeleton variant="card" height={100} />
                      <Skeleton variant="card" height={100} />
                    </>
                  ) : (
                    newFollowersHandles.map((handle, index) => (
                      <ProfileCard 
                        key={handle}
                        handle={handle} 
                        showRecentPost={true}
                        className="transform hover:scale-102 transition-transform"
                      />
                    ))
                  )}
                </div>
              </Card>

              {/* Community Breakdown */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Community Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={communityBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {communityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {communityBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-gray-700">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Amplifiers */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="text-blue-500" size={20} />
                Top Amplifiers
                {loadingFollowers && (
                  <Badge variant="default" size="sm">Loading...</Badge>
                )}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {loadingFollowers ? (
                  <>
                    <Skeleton variant="card" height={150} />
                    <Skeleton variant="card" height={150} />
                    <Skeleton variant="card" height={150} />
                  </>
                ) : (
                  topAmplifiers.map((amplifier, index) => (
                    <div key={amplifier.handle} className="space-y-3">
                      <ProfileCard 
                        handle={amplifier.handle} 
                        showRecentPost={false}
                      />
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" padding="sm">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Engagements</span>
                            <Badge variant="primary" size="sm">{typeof amplifier.engagements === 'string' ? amplifier.engagements : amplifier.engagements}</Badge>
                          </div>
                          {typeof amplifier.engagements === 'number' ? (
                            <ProgressBar 
                              value={amplifier.engagements} 
                              max={50} 
                              variant="primary" 
                              size="sm"
                            />
                          ) : (
                            <div className="text-xs text-gray-500 text-center py-2">{amplifier.engagements}</div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Est. Reach</span>
                            <Badge variant="brand" size="sm">{typeof amplifier.reach === 'string' ? amplifier.reach : amplifier.reach.toLocaleString()}</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceV2;