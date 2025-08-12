import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

// Brand chart colors - consistent with your palette
const CHART_COLORS = ['#002945', '#2B54BE', '#3A5393', '#0E4CE8', '#3B4869', '#23B26A', '#F79009', '#F04438', '#8B5CF6'];

function Performance({ metrics }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  // Sample data for performance analytics
  const recentPosts = [
    {
      id: 1,
      text: "The future of AI development is looking incredibly promising with new breakthroughs happening every day...",
      timestamp: "2024-01-15T14:30:00Z",
      format: "Text",
      likes: 245,
      replies: 32,
      reposts: 18,
      engagementRate: 6.2,
      amplification: 2.3,
      topic: "AI"
    },
    {
      id: 2,
      text: "Just shipped our latest feature! The team worked incredibly hard on this and I'm proud of what we built...",
      timestamp: "2024-01-15T10:15:00Z",
      format: "Text + Image",
      likes: 189,
      replies: 24,
      reposts: 12,
      engagementRate: 4.8,
      amplification: 1.8,
      topic: "Startup"
    },
    {
      id: 3,
      text: "Here's why I think the next wave of innovation will come from the intersection of AI and Web3...",
      timestamp: "2024-01-14T16:45:00Z",
      format: "Thread",
      likes: 312,
      replies: 48,
      reposts: 25,
      engagementRate: 7.8,
      amplification: 3.2,
      topic: "Tech"
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

  // Sample new followers with real handles to fetch
  const newFollowersHandles = ['techexplorer.bsky.social', 'airesearcher.bsky.social', 'startupfounder.bsky.social'];

  const topAmplifiers = [
    { handle: "airesearcher.bsky.social", engagements: 45, reach: 12500 },
    { handle: "techwriter.bsky.social", engagements: 38, reach: 9800 },
    { handle: "devtools.bsky.social", engagements: 32, reach: 8200 }
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
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <BarChart3 size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Performance Data</h2>
          <p className="text-gray-600 mt-2">Analyzing your content and audience metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Performance Insights - Enhanced with vibrant gradient */}
      <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
        
        <div className="relative flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Performance Intelligence
              <span className="px-3 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">AI POWERED</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-300" />
                  <span className="text-green-300 font-semibold text-sm">Content Insight</span>
                </div>
                <p className="text-white text-sm">Video content performs 68% better than text posts. Consider increasing video frequency.</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-300" />
                  <span className="text-blue-300 font-semibold text-sm">Timing Analysis</span>
                </div>
                <p className="text-white text-sm">Peak engagement window: 2-4 PM weekdays. Schedule important content accordingly.</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-purple-300" />
                  <span className="text-purple-300 font-semibold text-sm">Audience Behavior</span>
                </div>
                <p className="text-white text-sm">Your mutual followers drive 3.2x more amplification than regular followers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Performance</h2>
            <p className="text-gray-600">Analyze your posts, formats, and engagement patterns</p>
          </div>
        </div>
        
        {/* Recent Posts Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Posts Performance</h3>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-sm backdrop-blur-sm text-white placeholder-white"
              >
                <option value="week" className="text-gray-900">Last Week</option>
                <option value="month" className="text-gray-900">Last Month</option>
                <option value="quarter" className="text-gray-900">Last Quarter</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Post</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Format</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Topic</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">ER</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Engagement</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <p className="line-clamp-2">{post.text}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                        {post.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                        {post.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs">
                        <span className="text-red-600 font-semibold">{post.likes} ❤️</span>
                        <span className="text-blue-600 font-semibold">{post.replies} 💬</span>
                        <span className="text-green-600 font-semibold">{post.reposts} 🔄</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://bsky.app/profile/labb.run/post/${post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        View
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ER by Format */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
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
          </div>

          {/* ER by Topic */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
            
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
          </div>
        </div>
      </div>

      {/* Audience & Growth Section */}
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
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              New Followers This Week
            </h3>
            <div className="space-y-4">
              {newFollowersHandles.map((handle, index) => (
                <ProfileCard 
                  key={handle}
                  handle={handle} 
                  showRecentPost={true}
                  className="transform hover:scale-102 transition-transform"
                />
              ))}
            </div>
          </div>

          {/* Community Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
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
          </div>
        </div>

        {/* Top Amplifiers */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} />
            Top Amplifiers
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topAmplifiers.map((amplifier, index) => (
              <ProfileCard 
                key={amplifier.handle}
                handle={amplifier.handle} 
                showRecentPost={false}
                className="relative"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timing & Cadence Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timing & Cadence</h2>
            <p className="text-gray-600">Optimize your posting schedule for maximum impact</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: 'Posting Frequency', value: '12/14', subtitle: 'Posts this week vs target', color: 'from-blue-500 to-indigo-600' },
            { icon: Zap, title: 'Avg First-Hour ER', value: '3.8%', subtitle: '+0.5% vs last week', color: 'from-green-500 to-emerald-600' },
            { icon: Target, title: 'Time to 10 Engagements', value: '47m', subtitle: '-12m vs last week', color: 'from-purple-500 to-pink-600' },
            { icon: Hash, title: 'Mutuals Rate', value: '23%', subtitle: '+2% vs last week', color: 'from-orange-500 to-red-600' }
          ].map((stat, index) => (
            <div key={stat.title} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4 inline-flex">
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-white text-opacity-90 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white text-opacity-80 text-xs">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Performance;