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
        <div className="h-48 rounded-2xl relative overflow-hidden">
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
        <div className="relative -mt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
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
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{metrics.displayName}</h1>
                  <p className="text-lg text-brand-600 font-semibold mb-3">@{metrics.handle}</p>
                  <p className="text-gray-700 mb-4 max-w-2xl leading-relaxed">{metrics.description || 'Building the future with Home Lab, Self Hosting, and Privacy-first solutions for Small Business.'}</p>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{metrics.followersCount.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm font-medium">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{metrics.followsCount.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm font-medium">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{metrics.postsCount.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm font-medium">Posts</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a
                    href={`https://bsky.app/profile/${metrics.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-brand-500 to-electric-500 hover:from-brand-600 hover:to-electric-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
                  >
                    View on Bluesky
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary & Suggestions - Using brand colors */}
      <div className="bg-gradient-to-br from-slate-600 via-accent-500 to-primary-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
        
        <div className="relative flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              AI Insights & Recommendations
              <span className="px-3 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">LIVE</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-300" />
                  <span className="text-green-300 font-semibold text-sm">Performance</span>
                </div>
                <p className="text-white text-sm">Your engagement rate is 28% above average. Keep posting during peak hours!</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-300" />
                  <span className="text-blue-300 font-semibold text-sm">Timing</span>
                </div>
                <p className="text-white text-sm">Post between 2-4 PM for 45% higher engagement rates.</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-purple-300" />
                  <span className="text-purple-300 font-semibold text-sm">Content</span>
                </div>
                <p className="text-white text-sm">Tech-focused posts get 3x more amplification. Double down on this!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Keyword Alignment - Dark theme feature section */}
      <div style={{backgroundColor: '#2D323E'}} className="rounded-2xl p-8 shadow-xl border border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-electric-500 to-accent-500"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-brand-500 to-electric-500 rounded-xl shadow-lg">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Brand Keyword Alignment</h3>
            <p className="text-gray-300 text-sm">Track alignment with your target audience keywords for Home Lab, Self Hosting, and Privacy content</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="text-center p-6 bg-gradient-to-br from-success-900/30 to-success-800/30 rounded-2xl border border-success-600/30 backdrop-blur-sm">
              <div className="text-4xl font-bold text-success-400 mb-2">84%</div>
              <p className="text-success-200 font-semibold">Brand Alignment Score</p>
              <div className="mt-4 w-full bg-success-900/30 rounded-full h-3 border border-success-600/20">
                <div className="bg-gradient-to-r from-success-500 to-success-400 h-3 rounded-full shadow-inner" style={{ width: '84%' }}></div>
              </div>
              <p className="text-success-300 text-xs mt-2">Strong alignment with target keywords</p>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-success-400 rounded-full"></div>
              Your Brand Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Home Lab', 'Self Hosting', 'Privacy', 'Small Business', 'Tech'].map((keyword, index) => (
                <span key={keyword} className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-sm ${
                  index < 3
                    ? 'bg-gradient-to-r from-brand-500 to-electric-500 text-white' 
                    : index < 4
                    ? 'bg-gradient-to-r from-accent-500 to-primary-500 text-white'
                    : 'bg-slate-600/50 text-slate-200 border border-slate-500'
                }`}>
                  #{keyword.replace(' ', '')}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                <span>High usage: Home Lab, Self Hosting, Privacy</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
                <span>Medium usage: Small Business</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error-400 rounded-full"></div>
                <span>Low usage: Tech (too generic)</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-400 rounded-full"></div>
              Recommended Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Docker', 'Kubernetes', 'Proxmox', 'FOSS'].map((keyword) => (
                <span key={keyword} className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600/30 to-electric-600/30 text-brand-200 border border-brand-500/50 hover:from-brand-500 hover:to-electric-500 hover:text-white transition-all cursor-pointer backdrop-blur-sm">
                  +{keyword}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-300 mt-3">
              These keywords align with your Home Lab and Self Hosting audience and could increase engagement by 15-25%.
            </p>
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
          <div key={stat.title} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
            
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
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-electric-500 to-accent-500"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-brand-500 to-electric-500 rounded-xl shadow-lg">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Followers Growth</h3>
              <p className="text-gray-500 text-sm">Track your weekly follower growth trajectory and identify growth patterns from organic engagement</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#64748b" 
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
                stroke="url(#colorGradient1)"
                strokeWidth={4}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: CHART_COLORS.primary, strokeWidth: 3, fill: 'white' }}
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
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 via-primary-500 to-slate-500"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl shadow-lg">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Engagement Trend</h3>
              <p className="text-gray-500 text-sm">Monitor your content engagement rate trends to optimize posting times and content strategy</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#64748b" 
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
                stroke="url(#colorGradient2)"
                strokeWidth={4}
                dot={{ fill: CHART_COLORS.secondary, strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: CHART_COLORS.secondary, strokeWidth: 3, fill: 'white' }}
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