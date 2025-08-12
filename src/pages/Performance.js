import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Sparkles, 
  MessageSquare, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Hash,
  Target
} from 'lucide-react';

// Chart colors
const CHART_COLORS = ['#2B54BE', '#00C896', '#FF6B35', '#E63946', '#9B59B6', '#F39C12', '#0E4CE8'];

function Performance({ metrics }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  // Sample data for performance analytics
  const recentPosts = [
    {
      id: 1,
      text: "The future of AI development is looking incredibly promising...",
      timestamp: "2024-01-15 14:30",
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
      text: "Just shipped our latest feature! The team worked incredibly hard...",
      timestamp: "2024-01-15 10:15",
      format: "Text + Image",
      likes: 189,
      replies: 24,
      reposts: 12,
      engagementRate: 4.8,
      amplification: 1.8,
      topic: "Startup"
    },
    // Add more sample posts...
  ];

  const engagementByFormat = [
    { format: 'Text', rate: 4.2 },
    { format: 'Image', rate: 5.8 },
    { format: 'Video', rate: 7.1 },
    { format: 'Link', rate: 3.6 },
    { format: 'Thread', rate: 6.3 }
  ];

  const engagementByTopic = [
    { topic: 'AI', rate: 6.8 },
    { topic: 'Tech', rate: 5.4 },
    { topic: 'Startup', rate: 4.9 },
    { topic: 'Personal', rate: 7.2 },
    { topic: 'Industry', rate: 4.1 }
  ];

  const newFollowers = [
    {
      avatar: "https://via.placeholder.com/40",
      handle: "techexplorer",
      followers: 1250,
      following: 840,
      posts: 156,
      recentPost: "Loving the new AI tools coming out..."
    },
    // Add more sample followers...
  ];

  const topAmplifiers = [
    {
      handle: "airesearcher",
      avatar: "https://via.placeholder.com/40",
      engagements: 45,
      reach: 12500,
      relationship: "Mutual"
    },
    // Add more amplifiers...
  ];

  const communityBreakdown = [
    { name: 'Tech Enthusiasts', value: 40, color: CHART_COLORS[0] },
    { name: 'Entrepreneurs', value: 25, color: CHART_COLORS[1] },
    { name: 'Developers', value: 20, color: CHART_COLORS[2] },
    { name: 'Investors', value: 15, color: CHART_COLORS[3] }
  ];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-900">Loading Performance Data</h2>
          <p className="text-primary-600 mt-2">Analyzing your content and audience metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Summary & Suggestions */}
      <div className="bg-gradient-to-br from-electric-50 to-brand-50 border border-electric-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-electric-500 rounded-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary-900 mb-3">Performance Insights</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <TrendingUp size={16} className="text-success-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your video content performs 68% better than text posts. Consider increasing video frequency.</p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-brand-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Peak engagement window: 2-4 PM weekdays. Schedule important content during this time.</p>
              </div>
              <div className="flex items-start gap-2">
                <Users size={16} className="text-accent-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your mutual followers drive 3.2x more amplification than regular followers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900">Content Performance</h2>
        
        {/* Recent Posts Table */}
        <div className="bg-white border border-primary-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-primary-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-900">Recent Posts (Last 30 Days)</h3>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-primary-300 rounded-lg text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">ER</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Likes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Replies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase">Reposts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary-900 max-w-xs truncate">
                        {post.text}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700">
                        {post.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700">
                        {post.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-600">
                      {new Date(post.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        post.engagementRate > 5 ? 'text-success-600' : 
                        post.engagementRate > 3 ? 'text-warning-600' : 'text-error-600'
                      }`}>
                        {post.engagementRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-900">{post.likes}</td>
                    <td className="px-6 py-4 text-sm text-primary-900">{post.replies}</td>
                    <td className="px-6 py-4 text-sm text-primary-900">{post.reposts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ER by Format */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Engagement Rate by Format</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementByFormat}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="format" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ER by Topic */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Engagement Rate by Topic</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementByTopic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="topic" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill={CHART_COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audience & Growth Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900">Audience & Growth</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Followers */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">New Followers This Week</h3>
            <div className="space-y-4">
              {newFollowers.map((follower, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={follower.avatar}
                    alt={follower.handle}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-900">@{follower.handle}</p>
                    <p className="text-xs text-primary-600">{follower.followers} followers • {follower.posts} posts</p>
                    <p className="text-xs text-primary-600 truncate">{follower.recentPost}</p>
                  </div>
                  <button className="px-3 py-1 text-xs bg-brand-500 text-white rounded-md hover:bg-brand-600">
                    <MessageSquare size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Community Breakdown */}
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Community Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={communityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {communityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {communityBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-primary-700">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Amplifiers */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Top 5 Amplifiers</h3>
          <div className="space-y-3">
            {topAmplifiers.map((amplifier, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={amplifier.avatar}
                    alt={amplifier.handle}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary-900">@{amplifier.handle}</p>
                    <p className="text-xs text-primary-600">{amplifier.relationship}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-900">{amplifier.engagements} engagements</p>
                  <p className="text-xs text-primary-600">{amplifier.reach.toLocaleString()} reach</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timing & Cadence Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900">Timing & Cadence</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={20} className="text-brand-500" />
              <h3 className="text-lg font-semibold text-primary-900">Posting Frequency</h3>
            </div>
            <p className="text-2xl font-bold text-primary-900">12/14</p>
            <p className="text-sm text-primary-600">Posts this week vs target</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-warning-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-electric-500" />
              <h3 className="text-lg font-semibold text-primary-900">Avg First-Hour ER</h3>
            </div>
            <p className="text-2xl font-bold text-primary-900">3.8%</p>
            <p className="text-sm text-success-600">+0.5% vs last week</p>
          </div>

          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target size={20} className="text-success-500" />
              <h3 className="text-lg font-semibold text-primary-900">Time to 10 Engagements</h3>
            </div>
            <p className="text-2xl font-bold text-primary-900">47m</p>
            <p className="text-sm text-success-600">-12m vs last week</p>
          </div>

          <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Hash size={20} className="text-accent-500" />
              <h3 className="text-lg font-semibold text-primary-900">Mutuals Rate</h3>
            </div>
            <p className="text-2xl font-bold text-primary-900">23%</p>
            <p className="text-sm text-success-600">+2% vs last week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;