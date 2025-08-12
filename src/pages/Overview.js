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
  CheckCircle
} from 'lucide-react';

// Chart colors
const CHART_COLORS = {
  primary: '#2B54BE',
  secondary: '#00C896',
  accent: '#0E4CE8',
  success: '#17B26A',
  warning: '#F39C12',
  error: '#E63946'
};

function Overview({ metrics }) {
  // Sample data for charts
  const followersData = [
    { date: 'Mon', followers: 1450 },
    { date: 'Tue', followers: 1465 },
    { date: 'Wed', followers: 1480 },
    { date: 'Thu', followers: 1510 },
    { date: 'Fri', followers: 1520 },
    { date: 'Sat', followers: 1535 },
    { date: 'Sun', followers: 1550 },
  ];

  const engagementData = [
    { date: 'Mon', rate: 4.2 },
    { date: 'Tue', rate: 5.1 },
    { date: 'Wed', rate: 3.8 },
    { date: 'Thu', rate: 6.2 },
    { date: 'Fri', rate: 5.5 },
    { date: 'Sat', rate: 5.8 },
    { date: 'Sun', rate: 4.9 },
  ];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-900">No data available</h2>
          <p className="text-primary-600 mt-2">Please wait while we load your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Overview Section */}
      <div className="bg-white border border-primary-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start gap-8">
          <div className="relative">
            <img
              src={metrics.avatar}
              alt={metrics.displayName}
              className="w-32 h-32 rounded-full border-4 border-brand-500 object-cover shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success-500 rounded-full border-3 border-white flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary-900 mb-2">{metrics.displayName}</h1>
            <p className="text-lg text-primary-600 mb-4">@{metrics.handle}</p>
            <p className="text-primary-700 mb-6">{metrics.description || 'No bio available'}</p>
            
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-900">{metrics.followersCount.toLocaleString()}</p>
                <p className="text-sm text-primary-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-900">{metrics.followsCount.toLocaleString()}</p>
                <p className="text-sm text-primary-600">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-900">{metrics.postsCount.toLocaleString()}</p>
                <p className="text-sm text-primary-600">Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary & Suggestions */}
      <div className="bg-gradient-to-br from-brand-50 to-electric-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-500 rounded-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary-900 mb-3">AI Summary & Suggestions</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-success-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your engagement rate is 28% above average for accounts your size. Keep up the great work!</p>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp size={16} className="text-brand-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Posting between 2-4 PM has shown 45% higher engagement. Consider scheduling more content during these hours.</p>
              </div>
              <div className="flex items-start gap-2">
                <Target size={16} className="text-accent-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your tech-focused posts get 3x more amplification. Consider increasing this content type.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-100 rounded-lg">
              <Users size={20} className="text-success-600" />
            </div>
            <div className="flex items-center gap-1 text-success-600">
              <ArrowUp size={16} />
              <span className="text-sm font-bold">+127</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-900">+127</h3>
          <p className="text-sm text-primary-600 mt-1">Net Followers This Week</p>
        </div>

        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-100 rounded-lg">
              <MessageSquare size={20} className="text-brand-600" />
            </div>
            <div className="flex items-center gap-1 text-warning-600">
              <ArrowDown size={16} />
              <span className="text-sm font-bold">-2</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-900">12/14</h3>
          <p className="text-sm text-primary-600 mt-1">Posts vs Weekly Target</p>
        </div>

        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-electric-100 rounded-lg">
              <Heart size={20} className="text-electric-600" />
            </div>
            <div className="flex items-center gap-1 text-success-600">
              <ArrowUp size={16} />
              <span className="text-sm font-bold">+0.8%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-900">5.2%</h3>
          <p className="text-sm text-primary-600 mt-1">Engagement Rate</p>
        </div>

        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Target size={20} className="text-accent-600" />
            </div>
            <div className="flex items-center gap-1 text-success-600">
              <ArrowUp size={16} />
              <span className="text-sm font-bold">+15%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-900">82%</h3>
          <p className="text-sm text-primary-600 mt-1">Quality Followers</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Followers Over Time */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6">Followers Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Rate Trend */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6">Engagement Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => `${value}%`}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={CHART_COLORS.secondary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.secondary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keyword Targeting Feedback */}
      <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary-900 mb-4">Keyword Targeting Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary-600">On-Target Keywords</span>
              <span className="text-sm font-bold text-success-600">76%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success-500 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary-900 mb-2">Top Keywords</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-200">AI</span>
              <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-200">Tech</span>
              <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-200">Innovation</span>
              <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-200">Startup</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary-900 mb-2">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-warning-50 text-warning-700 text-xs rounded-md border border-warning-200">Web3</span>
              <span className="px-2 py-1 bg-warning-50 text-warning-700 text-xs rounded-md border border-warning-200">Blockchain</span>
              <span className="px-2 py-1 bg-warning-50 text-warning-700 text-xs rounded-md border border-warning-200">Future</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;