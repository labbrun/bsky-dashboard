import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  Repeat2, 
  RefreshCw,
  AlertCircle,
  Filter,
  Settings,
  Search,
  Bell,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  LogOut,
  ArrowUp
} from 'lucide-react';

// Import your existing services
import { testConnection, upsertProfile, insertPosts } from './services/supabaseService';
import { fetchBlueskyUserData, testBlueskyAPI } from './services/blueskyService';

// Professional chart colors using Untitled UI palette
const CHART_COLORS = [
  'rgb(46 144 250)', // blue-500
  'rgb(22 179 100)', // green-500  
  'rgb(239 104 32)', // orange-500
  'rgb(240 68 56)', // error-500
  'rgb(122 90 248)', // purple-500
  'rgb(6 174 212)', // cyan-500
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('labb-analytics-logged-in') === 'true';
  });
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // UI State
  const [filterSettings, setFilterSettings] = useState({
    timeframe: '7d',
    sortBy: 'engagement',
    showOnlyPopular: false,
  });
  
  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    autoRefresh: false,
  });

  // Fixed handle for labb.run
  const FIXED_HANDLE = 'labb.run';

  // Fetch data from Bluesky API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('🔄 Fetching comprehensive analytics...');
    
    try {
      setDebugInfo('🔗 Testing Bluesky API connection...');
      const apiWorking = await testBlueskyAPI();
      if (!apiWorking) {
        throw new Error('Failed to connect to Bluesky API');
      }
      
      setDebugInfo(`📊 Fetching data for @${FIXED_HANDLE}...`);
      const data = await fetchBlueskyUserData(FIXED_HANDLE);
      
      console.log('✅ Bluesky Data:', data);
      setDebugInfo(`✅ Live data loaded for @${FIXED_HANDLE}`);
      setMetrics(data);

      // Optional: Sync to Supabase for storage/analytics
      try {
        setDebugInfo('💾 Syncing to database...');
        const connectionResult = await testConnection();
        if (connectionResult.connected && connectionResult.tablesExist) {
          await upsertProfile(data);
          await insertPosts(data.handle, data.recentPosts);
          setDebugInfo('✅ Data synced to database');
        } else {
          console.log('Database not available, using live data only');
          setDebugInfo('✅ Live data loaded (database sync skipped)');
        }
      } catch (dbError) {
        console.log('Database sync failed, using live data only:', dbError);
        setDebugInfo('✅ Live data loaded (database sync failed)');
      }
      
    } catch (err) {
      console.error('❌ Data Fetch Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setDebugInfo(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (password === 'labb2025') {
      setIsLoggedIn(true);
      localStorage.setItem('labb-analytics-logged-in', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMetrics(null);
    setError(null);
    setDebugInfo('');
    setPassword('');
    localStorage.removeItem('labb-analytics-logged-in');
  };

  // Enhanced chart data
  const engagementData = [
    { name: 'Mon', engagement: 1200, followers: 1450, likes: 450, replies: 120, reposts: 80 },
    { name: 'Tue', engagement: 1900, followers: 1465, likes: 680, replies: 190, reposts: 140 },
    { name: 'Wed', engagement: 800, followers: 1480, likes: 320, replies: 85, reposts: 60 },
    { name: 'Thu', engagement: 2400, followers: 1510, likes: 890, replies: 240, reposts: 180 },
    { name: 'Fri', engagement: 1600, followers: 1520, likes: 590, replies: 160, reposts: 110 },
    { name: 'Sat', engagement: 2100, followers: 1535, likes: 750, replies: 210, reposts: 150 },
    { name: 'Sun', engagement: 1800, followers: 1550, likes: 620, replies: 180, reposts: 130 },
  ];

  const contentTypeData = [
    { name: 'Text Posts', value: 45, color: CHART_COLORS[0] },
    { name: 'Images', value: 30, color: CHART_COLORS[1] },
    { name: 'Links', value: 15, color: CHART_COLORS[2] },
    { name: 'Threads', value: 10, color: CHART_COLORS[3] },
  ];

  // Login Screen - Professional Untitled UI styling with Tailwind
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-blue-light-50 p-8 dark">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-800">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingUp size={40} color="white" />
            </div>
            <h1 className="text-display-xs font-bold text-gray-900 dark:text-gray-50 mb-2">
              🦋 Labb Analytics Pro
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Ultimate analytics dashboard
            </p>
          </div>
          
          {/* User Card */}
          <div className="bg-gradient-to-br from-brand-50 to-blue-light-25 border border-brand-200 rounded-xl p-6 text-center mb-8 shadow-sm">
            <p className="text-brand-700 font-bold text-lg mb-1">
              @labb.run
            </p>
            <p className="text-brand-600 text-sm">
              Comprehensive Analytics Suite
            </p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 text-base shadow-xs transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-10"
              />
            </div>

            <button 
              type="submit"
              className="w-full px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Access Analytics Suite
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-light-25 dark">
        <div className="text-center bg-white dark:bg-gray-950 p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="w-15 h-15 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Loading Analytics Suite...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            {debugInfo}
          </p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-error-25 dark">
        <div className="text-center max-w-md bg-white dark:bg-gray-950 p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <AlertCircle size={40} color="white" />
          </div>
          <h2 className="text-display-xs font-bold text-gray-900 dark:text-gray-50 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-warning-25 dark">
        <div className="text-center max-w-md bg-white dark:bg-gray-950 p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <FileText size={40} color="white" />
          </div>
          <h2 className="text-display-xs font-bold text-gray-900 dark:text-gray-50 mb-4">
            No Data Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
            Analytics data is not available
          </p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <RefreshCw size={16} />
            <span>Load Data</span>
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'brand-600' },
    { id: 'analytics', label: 'Advanced Analytics', icon: PieChartIcon, color: 'purple-600' },
    { id: 'content', label: 'Content Analysis', icon: FileText, color: 'orange-600' },
    { id: 'audience', label: 'Audience Insights', icon: Users, color: 'success-600' },
    { id: 'tools', label: 'Tools & Settings', icon: Settings, color: 'gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-blue-light-25 dark">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {/* User Avatar with Brand Ring */}
              <div className="relative">
                <img
                  src={metrics.avatar}
                  alt={metrics.displayName}
                  className="h-13 w-13 rounded-full border-3 border-brand-500 object-cover shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-gray-950 shadow-sm"></div>
              </div>
              
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {metrics.displayName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{metrics.handle} • Analytics Suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Search */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-70 pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-50 shadow-xs transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-10"
                />
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500 dark:text-gray-400" />
                <div 
                  onClick={() => setToggleStates(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-all duration-200 shadow-xs ${
                    toggleStates.notifications ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-sm ${
                    toggleStates.notifications ? 'left-5.5' : 'left-0.5'
                  }`}></div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={fetchData}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium cursor-pointer shadow-xs transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium cursor-pointer shadow-xs transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex gap-2 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-${tab.color} text-white shadow-md`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Enhanced Filters */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-md">
                <Filter size={18} className="text-brand-600" />
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-50">
                Analytics Filters
              </span>
            </div>

            <select
              value={filterSettings.timeframe}
              onChange={(e) => setFilterSettings(prev => ({ ...prev, timeframe: e.target.value }))}
              className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 text-sm font-medium shadow-xs cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="popular-posts"
                checked={filterSettings.showOnlyPopular}
                onChange={(e) => setFilterSettings(prev => ({ ...prev, showOnlyPopular: e.target.checked }))}
                className="w-4.5 h-4.5 text-brand-500 cursor-pointer"
              />
              <label 
                htmlFor="popular-posts" 
                className="text-sm text-gray-900 dark:text-gray-50 font-medium cursor-pointer"
              >
                Show only popular posts
              </label>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {[
                { 
                  title: 'Total Followers', 
                  value: metrics.followersCount, 
                  change: '+12.5%', 
                  icon: Users, 
                  colorClass: 'blue'
                },
                { 
                  title: 'Total Likes', 
                  value: metrics.totalLikes, 
                  change: '+8.2%', 
                  icon: Heart, 
                  colorClass: 'error'
                },
                { 
                  title: 'Total Replies', 
                  value: metrics.totalReplies, 
                  change: '+15.3%', 
                  icon: MessageSquare, 
                  colorClass: 'success'
                },
                { 
                  title: 'Total Reposts', 
                  value: metrics.totalReposts, 
                  change: '+6.1%', 
                  icon: Repeat2, 
                  colorClass: 'violet'
                },
              ].map((stat, index) => (
                <div 
                  key={stat.title} 
                  className={`bg-gradient-to-br from-${stat.colorClass}-50 to-white dark:from-${stat.colorClass}-900 dark:to-gray-950 border border-${stat.colorClass}-200 dark:border-${stat.colorClass}-800 rounded-xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden`}
                >
                  {/* Decorative gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.colorClass}-500 to-${stat.colorClass}-600`}></div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        {stat.title}
                      </p>
                      <p className="text-display-xs font-extrabold text-gray-900 dark:text-gray-50">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl bg-${stat.colorClass}-500 shadow-md`}>
                      <stat.icon size={28} color="white" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-success-100 dark:bg-success-900 rounded-md">
                      <ArrowUp size={12} className="text-success-600" />
                      <span className="text-xs font-bold text-success-600">
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      vs last period
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Engagement Chart */}
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-success-500"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
                      Engagement Over Time
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track your daily engagement metrics
                    </p>
                  </div>
                  <button className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 px-4 py-2 rounded-md font-semibold transition-all duration-200 hover:bg-brand-100 dark:hover:bg-brand-800">
                    View Details
                  </button>
                </div>
                
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        color: '#111827',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke={CHART_COLORS[0]} 
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: CHART_COLORS[0], strokeWidth: 2, fill: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      stroke={CHART_COLORS[1]} 
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: CHART_COLORS[1], strokeWidth: 2, fill: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Content Distribution Chart */}
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-error-500"></div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
                    Content Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Breakdown of your content types
                  </p>
                </div>
                
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {contentTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
                      <div 
                        className="w-4 h-4 rounded-full shadow-xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.value}% of content
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Recent Posts */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-500 to-blue-500"></div>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
                  Recent Posts
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your latest content performance
                </p>
              </div>
              
              <div className="flex flex-col gap-6">
                {metrics.recentPosts.slice(0, 5).map((post, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-25 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                    <p className="text-gray-900 dark:text-gray-50 text-base font-medium leading-relaxed mb-6">
                      {post.text}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-2 bg-error-50 dark:bg-error-900 rounded-md border border-error-200 dark:border-error-800">
                          <Heart size={16} className="text-error-500" />
                          <span className="text-sm font-semibold text-error-700 dark:text-error-400">
                            {post.likeCount}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 rounded-md border border-blue-200 dark:border-blue-800">
                          <MessageSquare size={16} className="text-blue-500" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            {post.replyCount}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 px-3 py-2 bg-success-50 dark:bg-success-900 rounded-md border border-success-200 dark:border-success-800">
                          <Repeat2 size={16} className="text-success-500" />
                          <span className="text-sm font-semibold text-success-700 dark:text-success-400">
                            {post.repostCount}
                          </span>
                        </div>
                      </div>
                      
                      <a
                        href={`https://bsky.app/profile/${metrics.handle}/post/${post.uri.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-600 font-semibold no-underline px-4 py-2 bg-brand-50 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-md transition-all duration-200 hover:bg-brand-100 dark:hover:bg-brand-800"
                      >
                        View on Bluesky →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab !== 'overview' && (
          <div className="bg-gradient-to-br from-white to-gray-25 dark:from-gray-950 dark:to-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-16 text-center shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${tabs.find(tab => tab.id === activeTab)?.color || 'gray-500'} to-${tabs.find(tab => tab.id === activeTab)?.color || 'gray-500'}`}></div>
            
            <div className={`w-25 h-25 bg-gradient-to-br from-${tabs.find(tab => tab.id === activeTab)?.color || 'gray-500'} to-${tabs.find(tab => tab.id === activeTab)?.color || 'gray-500'} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
              {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || Settings, { size: 48, color: 'white' })}
            </div>
            
            <h3 className="text-display-xs font-bold text-gray-900 dark:text-gray-50 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Advanced analytics features coming soon with full Untitled UI pro components. 
              This section will include comprehensive data analysis, insights, and powerful visualization tools.
            </p>
            <div className="inline-block px-8 py-4 bg-warning-50 dark:bg-warning-900 border border-warning-200 dark:border-warning-800 rounded-lg text-warning-700 dark:text-warning-400 text-sm font-semibold">
              🚧 Under Development
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;