import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3,
  TrendingUp,
  Lightbulb,
  Search,
  Bell,
  RefreshCw,
  LogOut,
  Menu,
  X
} from 'lucide-react';

function DashboardLayout({ children, metrics, loading, error, onRefresh, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    autoRefresh: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      label: 'Overview',
      icon: BarChart3,
      description: 'Profile stats, growth metrics, and AI insights'
    },
    {
      path: '/performance',
      label: 'Performance',
      icon: TrendingUp,
      description: 'Content analysis, audience breakdown, and timing data'
    },
    {
      path: '/insights',
      label: 'Insights & Actions',
      icon: Lightbulb,
      description: 'AI recommendations, content ideas, and quick wins'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left section - Logo and User Info */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-primary-600 hover:bg-primary-50"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Logo and brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-brand-500 rounded-lg flex items-center justify-center">
                  <BarChart3 size={18} className="text-white" />
                </div>
                <h1 className="text-lg font-bold text-primary-900 hidden sm:block">
                  Labb Analytics Pro
                </h1>
              </div>

              {/* User info - desktop only */}
              {metrics && (
                <div className="hidden lg:flex items-center gap-3 ml-6 pl-6 border-l border-primary-200">
                  <div className="relative">
                    <img
                      src={metrics.avatar}
                      alt={metrics.displayName}
                      className="w-8 h-8 rounded-full border-2 border-brand-500 object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900">{metrics.displayName}</p>
                    <p className="text-xs text-primary-600">@{metrics.handle}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right section - Search and Actions */}
            <div className="flex items-center gap-3">
              {/* Search - hidden on mobile */}
              <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500" />
                <input
                  type="text"
                  placeholder="Search analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-900 placeholder-primary-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-10"
                />
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary-500" />
                <div 
                  onClick={() => setToggleStates(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`relative w-10 h-5 rounded-full cursor-pointer transition-all duration-200 ${
                    toggleStates.notifications ? 'bg-brand-500' : 'bg-primary-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${
                    toggleStates.notifications ? 'left-5' : 'left-0.5'
                  }`}></div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={onRefresh}
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-white border-b border-primary-200 shadow-xs ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-2 py-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                  }`}
                >
                  <item.icon size={18} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className={`text-xs font-normal ${isActive ? 'text-white/80' : 'text-primary-500'} md:hidden`}>
                      {item.description}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;