import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Search,
  Bell,
  RefreshCw,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  User
} from 'lucide-react';

function DashboardLayout({ children, metrics, loading, error, onRefresh, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    autoRefresh: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      path: '/',
      label: 'Overview',
      icon: BarChart3,
      description: 'Profile stats, growth metrics, and AI insights',
      badge: null
    },
    {
      path: '/performance',
      label: 'Bsky Performance',
      icon: TrendingUp,
      description: 'Bluesky content analysis, audience breakdown, and timing data',
      badge: null
    },
    {
      path: '/blog',
      label: 'Blog Performance',
      icon: BookOpen,
      description: 'Blog content analysis, traffic insights, and AI repurposing suggestions',
      badge: 'New'
    },
    {
      path: '/insights',
      label: 'Insights & Actions',
      icon: Lightbulb,
      description: 'AI recommendations, content ideas, and quick wins',
      badge: '5'
    }
  ];

  if (!metrics && !loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-brand-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-primary-900">Welcome to Labb Analytics Pro</h2>
          <p className="text-primary-600 mt-2">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-brand-500 rounded-xl flex items-center justify-center shadow-lg p-2">
                <img 
                  src={require('../assets/bluesky-logo.png')} 
                  alt="Bluesky Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to chart icon if logo doesn't load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <BarChart3 size={20} className="text-white" style={{display: 'none'}} />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Bluesky Dashboard</h1>
                  <p className="text-xs text-gray-500">Analytics & Insights</p>
                </div>
              )}
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:flex hidden"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search */}
        {isSidebarOpen && (
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-10 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={isActive ? { backgroundColor: '#0c2146' } : {}}
                >
                  <item.icon size={20} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`} />
                  {isSidebarOpen && (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              item.badge === 'New' 
                                ? 'bg-success-100 text-success-700' 
                                : 'bg-brand-100 text-brand-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          {metrics && isSidebarOpen ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <img
                    src={metrics.avatar}
                    alt={metrics.displayName}
                    className="w-10 h-10 rounded-full border-2 border-brand-500 object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">{metrics.displayName}</p>
                  <p className="text-xs text-gray-500">@{metrics.handle}</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    <Settings size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Preferences</span>
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-error-50 transition-colors text-error-600"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Collapsed sidebar user section
            <div className="flex justify-center">
              {metrics ? (
                <div className="relative">
                  <img
                    src={metrics.avatar}
                    alt={metrics.displayName}
                    className="w-10 h-10 rounded-full border-2 border-brand-500 object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {navigationItems.find(item => item.path === location.pathname)?.description || 'Analytics Overview'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Notification Toggle */}
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-gray-500" />
                <div 
                  onClick={() => setToggleStates(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`relative w-10 h-5 rounded-full cursor-pointer transition-all duration-200 ${
                    toggleStates.notifications ? 'bg-brand-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
                    toggleStates.notifications ? 'left-5' : 'left-0.5'
                  }`}></div>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;