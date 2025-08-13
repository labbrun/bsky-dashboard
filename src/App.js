import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Configuration
import { APP_CONFIG } from './config/app.config';

// Services
import { testConnection, upsertProfile, insertPosts } from './services/supabaseService';
import { fetchBlueskyUserData, testBlueskyAPI } from './services/blueskyService';

// Import layout and pages
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Performance from './pages/Performance';
import Insights from './pages/Insights';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(APP_CONFIG.auth.storageKey) === 'true';
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  const FIXED_HANDLE = APP_CONFIG.api.defaultHandle;

  // Fetch data from Bluesky API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiWorking = await testBlueskyAPI();
      if (!apiWorking) {
        throw new Error('Failed to connect to Bluesky API');
      }
      
      const data = await fetchBlueskyUserData(FIXED_HANDLE);
      
      setMetrics(data);

      // Optional: Sync to Supabase for storage/analytics
      try {
        const connectionResult = await testConnection();
        if (connectionResult.connected && connectionResult.tablesExist) {
          await upsertProfile(data);
          await insertPosts(data.handle, data.recentPosts);
        } else {
        }
      } catch (dbError) {
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
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
    if (password === APP_CONFIG.auth.password) {
      setIsLoggedIn(true);
      localStorage.setItem(APP_CONFIG.auth.storageKey, 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMetrics(null);
    setError(null);
    setPassword('');
    localStorage.removeItem(APP_CONFIG.auth.storageKey);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-brand-50 p-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-2xl border border-primary-200">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingUp size={40} color="white" />
            </div>
            <h1 className="text-display-xs font-bold text-primary-900 mb-2">
              🦋 Labb Analytics Pro
            </h1>
            <p className="text-lg text-primary-600">
              Advanced Bluesky Analytics Suite
            </p>
          </div>
          
          {/* User Card */}
          <div className="bg-gradient-to-br from-brand-50 to-electric-50 border border-brand-200 rounded-xl p-6 text-center mb-8 shadow-sm">
            <p className="text-brand-700 font-bold text-lg mb-1">
              @labb.run
            </p>
            <p className="text-brand-600 text-sm">
              Professional Analytics Dashboard
            </p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 border border-primary-300 rounded-lg bg-white text-primary-900 text-base shadow-xs transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20"
              />
            </div>

            <button 
              type="submit"
              className="w-full px-6 py-3.5 bg-gradient-to-r from-primary-500 to-brand-500 hover:from-primary-600 hover:to-brand-600 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-brand-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-primary-200">
          <div className="w-15 h-15 border-4 border-primary-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-xl font-semibold text-primary-900">
            Loading Analytics Suite...
          </h2>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-error-25">
        <div className="text-center max-w-md bg-white p-12 rounded-2xl shadow-xl border border-primary-200">
          <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <AlertCircle size={40} color="white" />
          </div>
          <h2 className="text-display-xs font-bold text-primary-900 mb-4">
            Connection Error
          </h2>
          <p className="text-primary-600 text-base mb-8">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-electric-500 hover:from-brand-600 hover:to-electric-600 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-warning-25">
        <div className="text-center max-w-md bg-white p-12 rounded-2xl shadow-xl border border-primary-200">
          <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <FileText size={40} color="white" />
          </div>
          <h2 className="text-display-xs font-bold text-primary-900 mb-4">
            No Data Available
          </h2>
          <p className="text-primary-600 text-base mb-8">
            Analytics data is not available
          </p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-electric-500 hover:from-brand-600 hover:to-electric-600 text-white text-base font-semibold rounded-lg cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <RefreshCw size={16} />
            <span>Load Data</span>
          </button>
        </div>
      </div>
    );
  }

  // Main Application with Router
  return (
    <Router>
      <DashboardLayout 
        metrics={metrics}
        loading={loading}
        error={error}
        onRefresh={fetchData}
        onLogout={handleLogout}
      >
        <Routes>
          <Route 
            path="/" 
            element={<Overview metrics={metrics} />} 
          />
          <Route 
            path="/performance" 
            element={<Performance metrics={metrics} />} 
          />
          <Route 
            path="/insights" 
            element={<Insights metrics={metrics} />} 
          />
          {/* Redirect any unknown routes to overview */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;