import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Untitled UI styles
import './styles/untitled-ui-variables.css';

// Configuration
import { APP_CONFIG } from './config/app.config';

// Services
import { testConnection, upsertProfile, insertPosts } from './services/supabaseService';
import { fetchBlueskyUserData, testBlueskyAPI } from './services/blueskyService';
import { initializeAIContext } from './services/aiContextProvider';
import { storeProfile, storePosts, storeFollowers, storeMetricsSnapshot } from './services/localStorageService';
import { getEffectiveConfig, isServiceConfigured } from './services/credentialsService';
import { initializeFavicon } from './utils/faviconUtils';
import { createAutoBackup, checkForMissingSettings, restoreFromAutoBackup } from './utils/settingsBackup';

// Import layout and pages
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import OverviewV2 from './pages/OverviewV2';
import PerformanceV2 from './pages/PerformanceV2';
import Insights from './pages/Insights';
import BlogAnalytics from './pages/BlogAnalytics';
import Settings from './pages/Settings';

// Import Untitled UI components
import { Card } from './components/ui/UntitledUIComponents';

function App() {
  // Skip all authentication - direct access to app
  
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
      // Only fetch data if Bluesky credentials are configured
      if (!isServiceConfigured('bluesky')) {
        console.log('Bluesky credentials not configured. Users can configure them in Settings.');
        setMetrics(null);
        setLoading(false);
        return;
      }

      if (!FIXED_HANDLE) {
        console.log('No Bluesky handle configured.');
        setMetrics(null);
        setLoading(false);
        return;
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
    // Check for missing settings and restore if backup available
    const settingsCheck = checkForMissingSettings();
    if (settingsCheck.hasMissingSettings && settingsCheck.backupAvailable) {
      console.log('Settings appear to be missing, attempting to restore from auto backup...');
      restoreFromAutoBackup().then(restored => {
        if (restored) {
          // Wait a moment then fetch data with restored settings
          setTimeout(() => fetchData(), 1000);
        } else {
          fetchData();
        }
      });
    } else {
      // Always try to fetch data on app load
      fetchData();
    }

    // Initialize universal AI context for all AI-powered features
    initializeAIContext().catch(error =>
      console.warn('AI context initialization failed:', error)
    );
  }, [fetchData]);

  // Update browser tab title with username
  useEffect(() => {
    if (metrics && metrics.displayName) {
      document.title = `${metrics.displayName} Dashboard`;
    } else if (FIXED_HANDLE) {
      document.title = `@${FIXED_HANDLE} Dashboard`;
    } else {
      document.title = 'Bsky Dashboard';
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Bsky Dashboard';
    };
  }, [metrics, FIXED_HANDLE]);

  // Initialize custom favicon on app start and listen for updates
  useEffect(() => {
    initializeFavicon().catch(error => 
      console.warn('Favicon initialization failed:', error)
    );

    // Listen for avatar updates from settings page
    const handleAvatarUpdate = () => {
      initializeFavicon().catch(error => 
        console.warn('Favicon update failed:', error)
      );
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  const handleLogout = () => {
    // Optional logout functionality - can be removed if not needed
    console.log('Logout requested');
  };

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
            element={
              <ErrorBoundary>
                <OverviewV2 metrics={metrics} />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/performance" 
            element={
              <ErrorBoundary>
                <PerformanceV2 metrics={metrics} />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ErrorBoundary>
                <Insights metrics={metrics} />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/blog-analytics" 
            element={
              <ErrorBoundary>
                <BlogAnalytics metrics={metrics} />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            } 
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