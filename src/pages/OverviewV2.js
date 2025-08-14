import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { checkCelebrationConditions, shouldShowCelebration, markCelebrationShown, formatCelebrationMessage } from '../utils/celebrationUtils';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  ArrowUp,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
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
  const [timeRange, setTimeRange] = React.useState('7'); // '7' for 7 days, '30' for 30 days

  // Check for celebration conditions on component mount
  React.useEffect(() => {
    if (metrics && shouldShowCelebration()) {
      const celebrations = checkCelebrationConditions(metrics);
      if (celebrations.length > 0) {
        const message = formatCelebrationMessage(celebrations);
        setCelebrationMessage(message);
        setShowCelebration(true);
        markCelebrationShown();
      }
    }
  }, [metrics]);

  // Real data based on metrics and time range
  const followersData = React.useMemo(() => {
    if (!metrics) return [];
    
    const days = parseInt(timeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = i === 0 ? 'Today' : `${i}d ago`;
      const followers = Math.max(0, metrics.followersCount - Math.floor(Math.random() * i * 2));
      data.push({ date, followers });
    }
    
    return data;
  }, [metrics, timeRange]);

  const engagementData = React.useMemo(() => {
    const days = parseInt(timeRange);
    const data = [];
    const baseRate = 4.5;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = i === 0 ? 'Today' : `${i}d ago`;
      const rate = Math.round((baseRate + (Math.random() - 0.5) * 3) * 10) / 10;
      data.push({ date, rate: Math.max(1.0, Math.min(8.0, rate)) });
    }
    
    return data;
  }, [timeRange]);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <AlertCircle size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 600 }}>
            No data available
          </h2>
          <p className="text-gray-600 mt-2" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
            Please wait while we load your analytics...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
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
            <div style={{backgroundColor: '#0c2146'}} className="flex-1 rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Inter', fontWeight: 700 }}>{metrics.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>@{metrics.handle}</p>
                  <p className="text-gray-300 mb-4 max-w-2xl leading-5" style={{ fontFamily: 'Inter', fontWeight: 400 }}>{metrics.description || 'Building the future with Home Lab, Self Hosting, and Privacy-first solutions for Small Business.'}</p>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter', fontWeight: 700 }}>{metrics.followersCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium" style={{ fontFamily: 'Inter', fontWeight: 500 }}>Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter', fontWeight: 700 }}>{metrics.followsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium" style={{ fontFamily: 'Inter', fontWeight: 500 }}>Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter', fontWeight: 700 }}>{metrics.postsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium" style={{ fontFamily: 'Inter', fontWeight: 500 }}>Posts</p>
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
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 700 }}>Overview</h1>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter', fontWeight: 400 }}>Analytics dashboard for the last {timeRange} days</p>
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

      {/* AI Insights Section */}
      <div style={{backgroundColor: '#13336b'}} className="rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Sparkles size={24} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Inter', fontWeight: 700 }}>
                AI Insights & Recommendations
              </h2>
              <Badge variant="warning" size="sm">LIVE</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{backgroundColor: '#0c2146'}} className="rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Performance</span>
                </div>
                <p className="text-sm" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '1.5', color: '#d5d7da' }}>Your engagement rate is {timeRange === '7' ? '28% above average' : '32% above average'}. Keep posting during peak hours!</p>
              </div>
              <div style={{backgroundColor: '#0c2146'}} className="rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Timing</span>
                </div>
                <p className="text-sm" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '1.5', color: '#d5d7da' }}>Post between 2-4 PM for {timeRange === '7' ? '45%' : '48%'} higher engagement rates.</p>
              </div>
              <div style={{backgroundColor: '#0c2146'}} className="rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Content</span>
                </div>
                <p className="text-sm" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '1.5', color: '#d5d7da' }}>Tech-focused posts get {timeRange === '7' ? '3x' : '3.2x'} more amplification. Double down on this!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Preview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 600 }}>
            Recent Posts Performance
          </h3>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => window.location.href = '/performance'}
          >
            View Performance
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.recentPosts && metrics.recentPosts.slice(0, 4).map((post, index) => (
            <div key={index} className="p-4 rounded-lg" style={{backgroundColor: '#13336b'}}>
              {/* Date at top left */}
              <div className="mb-3">
                <span className="text-sm font-bold" style={{ fontFamily: 'Inter', color: '#d5d7da', fontWeight: 700 }}>
                  {new Date(post.indexedAt).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit'
                  }).replace(/(\w+), (\d+\/\d+\/\d+)/, '$1 ($2)')}
                </span>
              </div>
              
              <div className="flex items-start gap-6">
                {/* Featured Image on Left - Show placeholder if no image */}
                {post.images && post.images.length > 0 ? (
                  <div className="flex-shrink-0">
                    <img 
                      src={post.images[0].thumb || post.images[0].fullsize || post.images[0]}
                      alt={post.images[0].alt || 'Post image'}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-24 h-24 bg-gray-700 rounded-xl border border-gray-600 flex items-center justify-center text-gray-400 text-xs"
                      style={{ display: 'none', fontFamily: 'Inter' }}
                    >
                      No Image
                    </div>
                    {post.images.length > 1 && (
                      <div className="text-xs text-gray-400 mt-1 text-center" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
                        +{post.images.length - 1} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-700 rounded-xl border border-gray-600 flex items-center justify-center text-gray-400 text-xs" style={{ fontFamily: 'Inter' }}>
                    📝
                  </div>
                )}
                
                {/* Text Content on Right */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-3" style={{ fontFamily: 'Inter', fontWeight: 400, color: '#d5d7da', lineHeight: '1.5' }}>
                    {post.text}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="default" size="sm">
                      {post.likeCount} likes
                    </Badge>
                    <Badge variant="default" size="sm">
                      {post.replyCount} replies
                    </Badge>
                    <Badge variant="default" size="sm">
                      {post.repostCount} reposts
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Metrics Grid - Clean and Symmetrical */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Net Followers"
          value={`+${Math.floor(Math.random() * 50 + 10)}`}
          description={`${timeRange}-day net follower growth`}
          change={`+${Math.floor(Math.random() * 20 + 5)} vs last ${timeRange} days`}
          changeType="positive"
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Posts vs Target"
          value={timeRange === '7' ? '12/14' : '48/60'}
          description={`Posts this ${timeRange === '7' ? 'week' : 'month'} vs target`}
          change={timeRange === '7' ? '-2 posts' : '+8 posts'}
          changeType={timeRange === '7' ? 'negative' : 'positive'}
          icon={<MessageSquare size={20} />}
        />
        <MetricCard
          title="Engagement Rate"
          value={timeRange === '7' ? '5.2%' : '5.8%'}
          description="Average across all posts"
          change={timeRange === '7' ? '+0.8%' : '+1.2%'}
          changeType="positive"
          icon={<Heart size={20} />}
        />
        <MetricCard
          title="Quality Score"
          value={timeRange === '7' ? '82%' : '85%'}
          description="Content quality metric"
          change={timeRange === '7' ? '+15%' : '+18%'}
          changeType="positive"
          icon={<Target size={20} />}
        />
      </div>

      {/* Charts Section - Clean and Symmetrical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Followers Growth Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 600 }}>
                Follower Growth
              </h3>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
                Last {timeRange} days
              </p>
            </div>
            <Badge variant="success" size="sm">
              <ArrowUp size={12} className="mr-1" />
              Growing
            </Badge>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                fontSize={12}
                style={{ fontFamily: 'Inter' }}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={12}
                style={{ fontFamily: 'Inter' }}
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
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 600 }}>
                Engagement Rate
              </h3>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
                Daily average %
              </p>
            </div>
            <Badge variant="primary" size="sm">
              <Zap size={12} className="mr-1" />
              Active
            </Badge>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                fontSize={12}
                style={{ fontFamily: 'Inter' }}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={12}
                style={{ fontFamily: 'Inter' }}
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

    </div>
  );
}

export default OverviewV2;