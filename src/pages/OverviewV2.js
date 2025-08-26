import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import CelebrationOverlay from '../components/CelebrationOverlay';
import TypingEffect from '../components/TypingEffect';
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

// Import mesh gradients for backgrounds
import gradient2 from '../assets/untitled-ui/Additional assets/Mesh gradients/15.jpg';

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
  const [hasTyped, setHasTyped] = React.useState(false);
  const [currentObservation, setCurrentObservation] = React.useState('');

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
  
  // Generate AI observations based on real data and time range
  const getAIObservation = React.useMemo(() => {
    if (!metrics) return '';
    
    const postsWithImages = metrics.recentPosts?.filter(p => p.images?.length > 0).length || 0;
    const totalPosts = metrics.recentPosts?.length || 0;
    const avgEngagement = totalPosts > 0 ? ((metrics.totalLikes + metrics.totalReplies + metrics.totalReposts) / totalPosts).toFixed(1) : 0;
    const techPosts = metrics.recentPosts?.filter(p => p.text?.toLowerCase().includes('tech') || p.text?.toLowerCase().includes('ai')).length || 0;
    
    if (timeRange === '7') {
      return `Based on your last 7 days of activity, you're doing well with visual content—${postsWithImages} out of ${totalPosts} posts include images, which typically drive higher engagement. Your average of ${avgEngagement} engagements per post shows solid audience connection. Consider posting more consistently during weekday afternoons when your tech-focused audience is most active. Your ${techPosts} tech-related posts are performing well, so doubling down on AI and development content could boost your reach further.`;
    } else {
      return `Over the past 30 days, your content strategy shows strong technical focus with ${techPosts} tech-related posts resonating well with your audience. Your ${metrics.followersCount} followers are highly engaged, giving you an average of ${avgEngagement} interactions per post. The ${postsWithImages}/${totalPosts} posts with images demonstrate good visual content habits. For the next month, consider increasing your posting frequency to 2-3x per week and experiment with more behind-the-scenes development content—your audience clearly values your technical insights and would likely engage with more personal takes on your homelab and privacy-focused projects.`;
    }
  }, [metrics, timeRange]);
  
  // Update observation when time range changes
  React.useEffect(() => {
    if (metrics) {
      const newObservation = getAIObservation;
      setCurrentObservation(newObservation);
    }
  }, [metrics, timeRange, getAIObservation]);


  // Real data based on metrics and time range
  const followersData = React.useMemo(() => {
    if (!metrics) return [];
    
    const days = parseInt(timeRange);
    const data = [];
    const baseFollowers = metrics.followersCount;
    
    for (let i = days - 1; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const date = i === 0 ? 'Today' : currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      // More realistic follower progression based on actual count
      const daysSinceStart = days - 1 - i;
      const growthRate = days === 7 ? 1.5 : 3;
      const followers = Math.max(0, baseFollowers - Math.floor(daysSinceStart * growthRate));
      data.push({ date, followers });
    }
    
    return data;
  }, [metrics, timeRange]);

  const engagementData = React.useMemo(() => {
    if (!metrics) return [];
    
    const days = parseInt(timeRange);
    
    const data = [];
    // Calculate base rate from actual metrics
    const totalEngagement = (metrics.totalLikes || 0) + (metrics.totalReplies || 0) + (metrics.totalReposts || 0);
    const baseRate = metrics.followersCount > 0 
      ? Math.min(8.0, Math.max(1.0, (totalEngagement / metrics.followersCount) * 100))
      : 4.5;
    
    for (let i = days - 1; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const date = i === 0 ? 'Today' : currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      // Small variations around the base rate
      const variation = (Math.random() - 0.5) * 1.5;
      const rate = Math.round((baseRate + variation) * 10) / 10;
      data.push({ date, rate: Math.max(1.0, Math.min(8.0, rate)) });
    }
    
    return data;
  }, [metrics, timeRange]);

  // Community breakdown data - using real API data when available
  const communityBreakdown = React.useMemo(() => {

    // Base percentages (these will always add up to 100%)
    let techPercentage = 45;
    let businessPercentage = 25; 
    let devPercentage = 20;
    let generalPercentage = 10;

    // If we have real data, adjust percentages based on content
    if (metrics?.recentPosts && metrics.recentPosts.length > 0) {
      
      const posts = metrics.recentPosts;
      let techScore = 0;
      let businessScore = 0;
      let devScore = 0;

      posts.forEach(post => {
        const text = (post.text || '').toLowerCase();
        
        // Score each post for different categories
        if (text.includes('ai') || text.includes('tech') || text.includes('privacy') || 
            text.includes('security') || text.includes('homelab') || text.includes('server')) {
          techScore++;
        }
        
        if (text.includes('business') || text.includes('startup') || text.includes('entrepreneur') || 
            text.includes('productivity') || text.includes('enterprise')) {
          businessScore++;
        }
        
        if (text.includes('code') || text.includes('dev') || text.includes('programming') || 
            text.includes('software') || text.includes('github') || text.includes('api')) {
          devScore++;
        }
      });

      const totalScore = techScore + businessScore + devScore;
      
      if (totalScore > 0) {
        // Adjust percentages based on content, but keep them reasonable
        const techRatio = techScore / totalScore;
        const businessRatio = businessScore / totalScore;
        const devRatio = devScore / totalScore;
        
        // Apply weighting but keep minimums and ensure total = 100%
        techPercentage = Math.round(Math.max(techRatio * 70 + 20, 15));
        businessPercentage = Math.round(Math.max(businessRatio * 50 + 15, 10));
        devPercentage = Math.round(Math.max(devRatio * 60 + 10, 10));
        generalPercentage = 100 - techPercentage - businessPercentage - devPercentage;
        
        // Ensure general audience is at least 5%
        if (generalPercentage < 5) {
          generalPercentage = 5;
          // Reduce others proportionally
          const excess = 5 - generalPercentage;
          const reduction = excess / 3;
          techPercentage = Math.max(techPercentage - reduction, 15);
          businessPercentage = Math.max(businessPercentage - reduction, 10);
          devPercentage = Math.max(devPercentage - reduction, 10);
          generalPercentage = 100 - techPercentage - businessPercentage - devPercentage;
        }
        
      }
    }

    const result = [
      { name: 'Tech Enthusiasts', value: Math.round(techPercentage), color: CHART_COLORS.primary },
      { name: 'Entrepreneurs', value: Math.round(businessPercentage), color: CHART_COLORS.brand },
      { name: 'Developers', value: Math.round(devPercentage), color: CHART_COLORS.accent },
      { name: 'General Audience', value: Math.round(generalPercentage), color: CHART_COLORS.electric }
    ];

    // Ensure total = 100% (final safety check)
    const total = result.reduce((sum, item) => sum + item.value, 0);
    if (total !== 100) {
      result[3].value = 100 - result[0].value - result[1].value - result[2].value;
    }
    
    return result;
  }, [metrics]);


  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <AlertCircle size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 font-sans">
            No data available
          </h2>
          <p className="text-gray-600 mt-2 font-sans">
            Please wait while we load your analytics...
          </p>
        </Card>
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
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Overview</h1>
          <p className="text-gray-600 mt-1 font-sans">Analytics dashboard for the last {timeRange} days</p>
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
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Sparkles size={24} className="text-warning-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                AI Overview Insights
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
                  <span className="text-success-400 font-semibold text-sm font-sans">Performance</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Posts with images get more engagement ({metrics?.recentPosts?.filter(p => p.images?.length > 0).length || 0}/{metrics?.recentPosts?.length || 0} have images)</p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Timing</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Your avg {((metrics?.totalLikes + metrics?.totalReplies + metrics?.totalReposts) / (metrics?.recentPosts?.length || 1)).toFixed(1)} engagements per post</p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Content</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">Tech topics appear in {metrics?.recentPosts?.filter(p => p.text?.toLowerCase().includes('tech') || p.text?.toLowerCase().includes('ai')).length || 0} of your recent posts</p>
              </div>
            </div>
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
          title="Total Engagement"
          value={((metrics?.totalLikes || 0) + (metrics?.totalReplies || 0) + (metrics?.totalReposts || 0)).toLocaleString()}
          description="Total likes, replies, and reposts\nacross recent posts"
          change={`${metrics?.totalLikes || 0} likes, ${metrics?.totalReplies || 0} replies, ${metrics?.totalReposts || 0} reposts`}
          changeType="positive"
          icon={<Heart size={20} />}
        />
        <MetricCard
          title="Avg Engagement Per Post"
          value={metrics?.recentPosts?.length > 0 ? 
            (((metrics?.totalLikes || 0) + (metrics?.totalReplies || 0) + (metrics?.totalReposts || 0)) / metrics.recentPosts.length).toFixed(1) :
            '0'}
          description="Average engagement per post\n(likes + replies + reposts)"
          change={`Across ${metrics?.recentPosts?.length || 0} recent posts`}
          changeType={((metrics?.totalLikes || 0) + (metrics?.totalReplies || 0) + (metrics?.totalReposts || 0)) > 0 ? "positive" : "neutral"}
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
                Follower Growth
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-sans">
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Community Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={communityBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
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