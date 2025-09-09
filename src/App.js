import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, TrendingUp, FileText, Settings as SettingsIcon } from 'lucide-react';

// Import Untitled UI styles
import './styles/untitled-ui-variables.css';

// Configuration
import { APP_CONFIG } from './config/app.config';

// Services
import { testConnection, upsertProfile, insertPosts } from './services/supabaseService';
import { fetchBlueskyUserData, testBlueskyAPI } from './services/blueskyService';
import { initializeAIContext } from './services/aiContextProvider';
import { createLocalStorageService, storeProfile, storePosts, storeFollowers, storeMetricsSnapshot } from './services/localStorageService';
import { getEffectiveConfig, isServiceConfigured } from './services/credentialsService';

// Import layout and pages
import DashboardLayout from './layouts/DashboardLayout';
import OverviewV2 from './pages/OverviewV2';
import PerformanceV2 from './pages/PerformanceV2';
import Insights from './pages/Insights';
import BlogAnalytics from './pages/BlogAnalytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

// Import Untitled UI components
import { Button, Card } from './components/ui/UntitledUIComponents';

function App() {
  // Check if this is the first run (no password set)
  const [isFirstRun, setIsFirstRun] = useState(() => {
    return !localStorage.getItem('bluesky-analytics-password');
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Don't auto-login on first run
    if (!localStorage.getItem('bluesky-analytics-password')) return false;
    return localStorage.getItem(APP_CONFIG.auth.storageKey) === 'true';
  });
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  // Get handle from credentials or fallback to config
  const effectiveConfig = getEffectiveConfig();
  const FIXED_HANDLE = effectiveConfig.bluesky.handle || APP_CONFIG.api.defaultHandle;

  // Fetch data from Bluesky API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if Bluesky credentials are configured
      if (!isServiceConfigured('bluesky')) {
        throw new Error('Bluesky credentials not configured. Please go to Settings to configure your handle and app password.');
      }

      if (!FIXED_HANDLE) {
        throw new Error('No Bluesky handle configured. Please check your settings.');
      }
      
      const apiWorking = await testBlueskyAPI();
      if (!apiWorking) {
        throw new Error('Failed to connect to Bluesky API. Check your internet connection or try again later.');
      }
      
      const data = await fetchBlueskyUserData(FIXED_HANDLE);
      
      setMetrics(data);

      // Optional: Sync to database or local storage for persistence
      try {
        if (APP_CONFIG.database.enabled) {
          // Use Supabase database if configured
          const connectionResult = await testConnection();
          if (connectionResult.connected && connectionResult.tablesExist) {
            await upsertProfile(data);
            await insertPosts(data.handle, data.recentPosts);
          }
        } else {
          // Use local storage as fallback
          storeProfile(data);
          storePosts(data.recentPosts, data.handle);
          storeFollowers(data.sampleFollowers, data.handle);
          storeMetricsSnapshot(data, data.handle);
        }
      } catch (storageError) {
        console.warn('Data storage failed:', storageError.message);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [FIXED_HANDLE]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      // Initialize universal AI context for all AI-powered features
      initializeAIContext().catch(error => 
        console.warn('AI context initialization failed:', error)
      );
    }
  }, [isLoggedIn, fetchData]);

  // Update browser tab title with username
  useEffect(() => {
    if (metrics && metrics.displayName) {
      document.title = `${metrics.displayName} Dashboard`;
    } else if (FIXED_HANDLE) {
      document.title = `@${FIXED_HANDLE} Dashboard`;
    } else {
      document.title = 'Bluesky Analytics Dashboard';
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Bluesky Analytics Dashboard';
    };
  }, [metrics, FIXED_HANDLE]);

  // Simple password hashing function (SHA-256)
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFirstRunSetup = async (e) => {
    e?.preventDefault();
    
    if (!password || password.length < 8) {
      alert('Password must be at least 8 characters long for security');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Hash and save the password
    const hashedPassword = await hashPassword(password);
    localStorage.setItem('bluesky-analytics-password', hashedPassword);
    setIsFirstRun(false);
    setIsLoggedIn(true);
    localStorage.setItem(APP_CONFIG.auth.storageKey, 'true');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    const storedPassword = localStorage.getItem('bluesky-analytics-password');
    const envPassword = APP_CONFIG.auth.password;
    
    // Hash the entered password
    const enteredPasswordHash = await hashPassword(password);
    
    // Check against stored hash or environment password
    const isValidPassword = (storedPassword && enteredPasswordHash === storedPassword) || 
                           (envPassword && password === envPassword);
    
    if (isValidPassword) {
      setIsLoggedIn(true);
      localStorage.setItem(APP_CONFIG.auth.storageKey, 'true');
      setPassword('');
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

  // First Run Setup or Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-brand-50 p-8">
        <Card className="w-full max-w-md" padding="xl">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingUp size={40} color="white" />
            </div>
            <h1 className="text-display-xs font-bold text-primary-900 mb-2">
              🦋 {APP_CONFIG.app.name}
            </h1>
            <p className="text-lg text-primary-600">
              {isFirstRun ? 'Welcome! Let\'s get started' : 'Advanced Bluesky Analytics Suite'}
            </p>
          </div>
          
          {/* User Card */}
          <div className="bg-gradient-to-br from-brand-50 to-electric-50 border border-brand-200 rounded-xl p-6 text-center mb-8 shadow-sm">
            <p className="text-brand-700 font-bold text-lg mb-1">
              @{APP_CONFIG.api.defaultHandle}
            </p>
            <p className="text-brand-600 text-sm">
              {isFirstRun ? 'First Time Setup' : 'Professional Analytics Dashboard'}
            </p>
            <p className="text-brand-500 text-xs mt-2">
              Mode: {APP_CONFIG.app.mode} {APP_CONFIG.database.enabled ? '(DB)' : '(Local)'}
            </p>
          </div>
          
          {isFirstRun ? (
            /* First Run Setup Form */
            <form onSubmit={handleFirstRunSetup} className="flex flex-col gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>🎉 Welcome!</strong> Create your dashboard password to get started.
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-primary-900 mb-2">
                  Create Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password (min 8 characters)"
                  required
                  minLength="8"
                  className="untitled-input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary-900 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength="8"
                  className="untitled-input w-full"
                />
              </div>

              <Button 
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Create Dashboard & Get Started
              </Button>
            </form>
          ) : (
            /* Regular Login Form */
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-semibold text-primary-900 mb-2">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="untitled-input w-full"
                />
              </div>

              <Button 
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Access Analytics Suite
              </Button>
            </form>
          )}
        </Card>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-brand-50">
        <Card className="text-center">
          <div className="w-15 h-15 border-4 border-primary-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-xl font-semibold text-primary-900">
            Loading Analytics Suite...
          </h2>
        </Card>
      </div>
    );
  }

  // Always show the dashboard - let individual pages handle missing data
  // This ensures Settings is always accessible even with connection errors

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
            element={<OverviewV2 metrics={metrics} />} 
          />
          <Route 
            path="/performance" 
            element={<PerformanceV2 metrics={metrics} />} 
          />
          <Route 
            path="/insights" 
            element={<Insights metrics={metrics} />} 
          />
          <Route 
            path="/blog-analytics" 
            element={<BlogAnalytics metrics={metrics} />} 
          />
          <Route 
            path="/calendar" 
            element={<Calendar metrics={metrics} />} 
          />
          <Route 
            path="/settings" 
            element={<Settings />} 
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