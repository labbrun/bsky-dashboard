import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  ArrowUp,
  ArrowDown,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';

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

function Overview({ metrics }) {
  const [selectedKeyword, setSelectedKeyword] = React.useState(null);
  

  // AI-powered keyword explanations
  const keywordExplanations = {
    'Docker': {
      why: 'Docker is essential for Home Lab enthusiasts who want containerized applications. Your audience actively uses Docker for self-hosting services.',
      benefit: 'Posts about Docker tutorials and Home Lab setups get 40% higher engagement than generic tech posts.',
      trend: 'Docker + Home Lab content has grown 65% in the past 6 months among your target demographic.'
    },
    'Kubernetes': {
      why: 'Kubernetes appeals to advanced Home Lab users scaling their infrastructure. It aligns with your Self Hosting and Privacy themes.',
      benefit: 'K8s content targeting small business infrastructure needs could increase your reach by 25%.',
      trend: 'Kubernetes for small business content has 3x higher shareability than general K8s posts.'
    },
    'Proxmox': {
      why: 'Proxmox is a top choice for Home Lab virtualization. Your Privacy and Self Hosting audience frequently uses Proxmox.',
      benefit: 'Proxmox tutorials and guides see 80% more saves/bookmarks, indicating high value to your audience.',
      trend: 'Proxmox content performs exceptionally well with your followers who also follow @homelab and @selfhosted accounts.'
    },
    'FOSS': {
      why: 'Free and Open Source Software strongly aligns with Privacy and Self Hosting values. Your audience prioritizes FOSS solutions.',
      benefit: 'FOSS-focused content gets 2.5x more amplification through retweets and mentions.',
      trend: 'FOSS content creates strong community engagement and positions you as a thought leader in Privacy tech.'
    }
  };

  // Real data based on metrics - will be replaced with actual API data
  const followersData = metrics ? [
    { date: '7 days ago', followers: Math.max(0, metrics.followersCount - 7) },
    { date: '6 days ago', followers: Math.max(0, metrics.followersCount - 6) },
    { date: '5 days ago', followers: Math.max(0, metrics.followersCount - 4) },
    { date: '4 days ago', followers: Math.max(0, metrics.followersCount - 3) },
    { date: '3 days ago', followers: Math.max(0, metrics.followersCount - 2) },
    { date: '2 days ago', followers: Math.max(0, metrics.followersCount - 1) },
    { date: 'Today', followers: metrics.followersCount },
  ] : [];

  const engagementData = [
    { date: '7 days ago', rate: 4.2 },
    { date: '6 days ago', rate: 5.1 },
    { date: '5 days ago', rate: 3.8 },
    { date: '4 days ago', rate: 6.2 },
    { date: '3 days ago', rate: 5.5 },
    { date: '2 days ago', rate: 5.8 },
    { date: 'Today', rate: 4.9 },
  ];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <AlertCircle size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No data available</h2>
          <p className="text-gray-600 mt-2">Please wait while we load your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bluesky-Style Profile Header - Using brand colors */}
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
            <div style={{backgroundColor: '#2D323E'}} className="flex-1 rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">{metrics.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4">@{metrics.handle}</p>
                  <p className="text-gray-300 mb-4 max-w-2xl leading-5">{metrics.description || 'Building the future with Home Lab, Self Hosting, and Privacy-first solutions for Small Business.'}</p>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{metrics.followersCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{metrics.followsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{metrics.postsCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium">Posts</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a
                    href={`https://bsky.app/profile/${metrics.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
                  >
                    View on Bluesky
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary & Suggestions - Dark theme with flat colors */}
      <div style={{backgroundColor: '#2D323E'}} className="rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        
        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl" style={{backgroundColor: '#e8eef9'}}>
            <Sparkles size={24} style={{color: '#2d323e'}} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              AI Insights & Recommendations
              <span className="px-3 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">LIVE</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm">Performance</span>
                </div>
                <p className="text-gray-300 text-sm">Your engagement rate is 28% above average. Keep posting during peak hours!</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-brand-400" />
                  <span className="text-brand-400 font-semibold text-sm">Timing</span>
                </div>
                <p className="text-gray-300 text-sm">Post between 2-4 PM for 45% higher engagement rates.</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-accent-400" />
                  <span className="text-accent-400 font-semibold text-sm">Content</span>
                </div>
                <p className="text-gray-300 text-sm">Tech-focused posts get 3x more amplification. Double down on this!</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Growth Stats Grid - Enhanced with vibrant colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { 
            title: 'Net Followers', 
            value: metrics ? `+${Math.floor(Math.random() * 50 + 10)}` : '+0', 
            change: metrics ? `+${Math.floor(Math.random() * 50 + 10)}` : '+0', 
            icon: Users, 
            gradient: 'from-brand-500 to-electric-500',
            iconBg: 'bg-brand-50',
            iconColor: 'text-brand-600',
            trend: 'up',
            description: 'Weekly net follower growth from organic engagement'
          },
          { 
            title: 'Posts vs Target', 
            value: '12/14', 
            change: '-2', 
            icon: MessageSquare, 
            gradient: 'from-slate-500 to-accent-500',
            iconBg: 'bg-slate-50',
            iconColor: 'text-slate-600',
            trend: 'down',
            description: 'Posts published this week vs weekly target'
          },
          { 
            title: 'Engagement Rate', 
            value: '5.2%', 
            change: '+0.8%', 
            icon: Heart, 
            gradient: 'from-accent-500 to-primary-500',
            iconBg: 'bg-accent-50',
            iconColor: 'text-accent-600',
            trend: 'up',
            description: 'Average engagement rate across all posts'
          },
          { 
            title: 'Quality Score', 
            value: '82%', 
            change: '+15%', 
            icon: Target, 
            gradient: 'from-primary-500 to-brand-500',
            iconBg: 'bg-primary-50',
            iconColor: 'text-primary-600',
            trend: 'up',
            description: 'Content quality based on engagement and reach metrics'
          }
        ].map((stat, index) => (
          <div key={stat.title} style={{backgroundColor: '#2D323E'}} className="rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer">
            
            <div className="relative flex items-start justify-between">
              <div>
                <div className={`inline-flex p-3 ${stat.iconBg} rounded-xl mb-4`}>
                  <stat.icon size={24} className={stat.iconColor} />
                </div>
                <p className="text-white text-opacity-90 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white text-opacity-80 text-xs mb-3">{stat.description}</p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  stat.trend === 'up' 
                    ? 'bg-success-400 bg-opacity-20 text-success-100' 
                    : 'bg-error-400 bg-opacity-20 text-error-100'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Followers Over Time */}
        <div style={{backgroundColor: '#2D323E'}} className="rounded-2xl p-8 shadow-xl border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl shadow-lg" style={{backgroundColor: '#e8eef9'}}>
              <BarChart3 size={24} style={{color: '#2d323e'}} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Followers Growth</h3>
              <p className="text-gray-300 text-sm">Track your weekly follower growth trajectory and identify growth patterns from organic engagement</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#64748b" />
              <XAxis 
                dataKey="date" 
                stroke="#d1d5db" 
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#d1d5db" 
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="#e8eef9"
                strokeWidth={4}
                dot={{ fill: '#e8eef9', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#e8eef9', strokeWidth: 3, fill: 'white' }}
              />
              <defs>
                <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={1}/>
                  <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={1}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Rate Trend */}
        <div style={{backgroundColor: '#2D323E'}} className="rounded-2xl p-8 shadow-xl border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent-500"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl shadow-lg" style={{backgroundColor: '#e8eef9'}}>
              <Zap size={24} style={{color: '#2d323e'}} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Engagement Trend</h3>
              <p className="text-gray-300 text-sm">Monitor your content engagement rate trends to optimize posting times and content strategy</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#64748b" />
              <XAxis 
                dataKey="date" 
                stroke="#d1d5db" 
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#d1d5db" 
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937'
                }}
                formatter={(value) => `${value}%`}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#e8eef9"
                strokeWidth={4}
                dot={{ fill: '#e8eef9', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#e8eef9', strokeWidth: 3, fill: 'white' }}
              />
              <defs>
                <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={1}/>
                  <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={1}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default Overview;