import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Heart, Repeat2, Eye, LogOut, ExternalLink, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activePeriod, setActivePeriod] = useState(7);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Fetch real data from your API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('🔄 Connecting to API...');
    
    try {
      console.log('🚀 Fetching from: https://cors.mybots.run/metrics');
      const response = await fetch('https://cors.mybots.run/metrics');
      
      setDebugInfo(`📡 Response status: ${response.status}`);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Full API Response:', data);
      
      setDebugInfo(`✅ Data loaded: ${Object.keys(data).length} properties`);
      setMetrics(data);
      
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
      setDebugInfo(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'labb2025') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setActiveTab('overview');
    setMetrics(null);
    setError(null);
    setDebugInfo('');
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (isNaN(diffInHours)) return 'Unknown';
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const generatePostUrl = (uri) => {
    if (!metrics?.handle || !uri) return '#';
    const handle = metrics.handle;
    const postId = uri.split('/').pop();
    return `https://bsky.app/profile/${handle}/post/${postId}`;
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#052b46',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(30, 30, 30, 0.9)',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              Labb.run Analytics
            </h1>
            <p style={{ color: '#a0a0a0', margin: '0.5rem 0 0 0', fontSize: '16px' }}>
              Bluesky Intelligence Dashboard
            </p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#e0e0e0', 
                marginBottom: '0.5rem',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#1e90ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !metrics) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#052b46',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '1rem' }}>Loading your Bluesky data...</div>
          <div style={{ color: '#a0a0a0', marginBottom: '1rem' }}>Connecting to cors.mybots.run</div>
          <div style={{ color: '#1e90ff', fontSize: '14px' }}>{debugInfo}</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !metrics) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#052b46',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
          <div style={{ fontSize: '24px', marginBottom: '1rem', color: '#ef4444' }}>
            API Connection Failed
          </div>
          <div style={{ color: '#a0a0a0', marginBottom: '1rem', fontSize: '16px' }}>
            Error: {error}
          </div>
          <div style={{ color: '#a0a0a0', marginBottom: '2rem', fontSize: '14px' }}>
            Debug: {debugInfo}
          </div>
          
          <button 
            onClick={fetchData}
            style={{
              padding: '12px 24px',
              background: '#1e90ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Retry Connection
          </button>
          
          <button 
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard - only show if we have data
  if (!metrics) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#052b46',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '1rem' }}>No Data Available</div>
          <button onClick={fetchData} style={{
            padding: '12px 24px',
            background: '#1e90ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Load Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#052b46',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px'
    }}>
      {/* Profile Header */}
      <header style={{
        background: 'rgba(30, 30, 30, 0.9)',
        padding: '2rem',
        borderBottom: '1px solid #404040'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img 
            src={metrics.avatar || 'https://via.placeholder.com/120'} 
            alt="Profile"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid #1e90ff'
            }}
          />
          
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              {metrics.displayName || 'No Name'}
            </h1>
            <p style={{ margin: '0.25rem 0', color: '#1e90ff', fontSize: '18px' }}>
              @{metrics.handle || 'no-handle'}
            </p>
            <p style={{ margin: '1rem 0', color: '#e0e0e0', fontSize: '16px', lineHeight: '1.5' }}>
              {metrics.bio || metrics.description || 'No bio available'}
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                  {formatNumber(metrics.followersCount)}
                </span>
                <span style={{ color: '#a0a0a0', marginLeft: '0.5rem', fontSize: '16px' }}>
                  Followers
                </span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                  {formatNumber(metrics.followsCount)}
                </span>
                <span style={{ color: '#a0a0a0', marginLeft: '0.5rem', fontSize: '16px' }}>
                  Following
                </span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                  {formatNumber(metrics.postsCount)}
                </span>
                <span style={{ color: '#a0a0a0', marginLeft: '0.5rem', fontSize: '16px' }}>
                  Posts
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <button onClick={handleLogout} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '16px'
            }}>
              <LogOut size={16} />
              Logout
            </button>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[7, 14, 21, 31].map((days) => (
                <button
                  key={days}
                  onClick={() => setActivePeriod(days)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activePeriod === days ? '#1e90ff' : 'rgba(255, 255, 255, 0.1)',
                    color: activePeriod === days ? 'white' : '#e0e0e0'
                  }}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'rgba(30, 30, 30, 0.8)',
        borderBottom: '1px solid #404040',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'audience', label: 'Audience Analytics', icon: Users },
            { id: 'content', label: 'Content Performance', icon: TrendingUp },
            { id: 'trending', label: 'Trending Topics', icon: MessageSquare },
            { id: 'opportunities', label: 'Content Opportunities', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#1e90ff' : '#a0a0a0',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                borderBottom: activeTab === tab.id ? '2px solid #1e90ff' : '2px solid transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {activeTab === 'overview' && (
          <>
            {/* Metrics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1.5rem', 
              marginBottom: '2rem' 
            }}>
              {[
                { 
                  title: 'Total Posts', 
                  value: metrics.postsCount, 
                  change: '+12%', 
                  positive: true,
                  icon: MessageSquare 
                },
                { 
                  title: 'Average Engagement', 
                  value: Math.round((metrics.totalLikes + metrics.totalReplies + metrics.totalReposts) / metrics.postsCount), 
                  change: '+8%', 
                  positive: true,
                  icon: Heart 
                },
                { 
                  title: 'Followers Gained', 
                  value: 'Data not available', 
                  change: '-', 
                  positive: null,
                  icon: Users 
                },
                { 
                  title: 'Followers Lost', 
                  value: 'Data not available', 
                  change: '-', 
                  positive: null,
                  icon: TrendingUp 
                }
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(30, 30, 30, 0.8)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #404040'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <metric.icon size={24} style={{ color: '#1e90ff' }} />
                    {metric.positive !== null && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: metric.positive ? '#22c55e' : '#ef4444',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {metric.positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {metric.change}
                      </div>
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#e0e0e0', marginBottom: '0.5rem' }}>
                    {metric.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Daily Engagement Chart */}
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #404040',
              marginBottom: '2rem'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '18px', fontWeight: '600', color: 'white' }}>
                Daily Engagement Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { day: 'Mon 8/5', engagement: 1200 },
                  { day: 'Tue 8/6', engagement: 1900 },
                  { day: 'Wed 8/7', engagement: 800 },
                  { day: 'Thu 8/8', engagement: 2400 },
                  { day: 'Fri 8/9', engagement: 1600 },
                  { day: 'Sat 8/10', engagement: 2100 },
                  { day: 'Sun 8/11', engagement: 1800 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="day" stroke="#a0a0a0" fontSize={14} />
                  <YAxis stroke="#a0a0a0" fontSize={14} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(30, 30, 30, 0.9)', 
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#1e90ff" 
                    strokeWidth={3}
                    dot={{ fill: '#1e90ff', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#1e90ff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Posts and Followers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Recent Posts Timeline */}
              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #404040'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '18px', fontWeight: '600', color: 'white' }}>
                  My Recent Posts Timeline
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}>
                  {metrics.recentPosts.slice(0, 10).map((post, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {/* Post Image */}
                      {post.images && post.images.length > 0 ? (
                        <img 
                          src={post.images[0]} 
                          alt="Post"
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(135deg, #1e90ff, #4169e1)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <MessageSquare size={32} color="white" />
                        </div>
                      )}
                      
                      {/* Post Content */}
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          margin: '0 0 0.75rem 0', 
                          color: '#e0e0e0', 
                          fontSize: '16px', 
                          lineHeight: '1.4' 
                        }}>
                          {post.text}
                        </p>
                        
                        {/* Engagement Stats */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '1rem', 
                          fontSize: '14px', 
                          color: '#a0a0a0',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span>{formatDate(post.indexedAt)}</span>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Heart size={14} />
                              {formatNumber(post.likeCount)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MessageSquare size={14} />
                              {formatNumber(post.replyCount)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Repeat2 size={14} />
                              {formatNumber(post.repostCount)}
                            </span>
                            <span style={{ fontSize: '12px', color: '#1e90ff' }}>
                              Total: {formatNumber(post.likeCount + post.replyCount + post.repostCount)}
                            </span>
                          </div>
                          <a 
                            href={generatePostUrl(post.uri)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1e90ff', 
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 10 Followers */}
              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #404040'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '18px', fontWeight: '600', color: 'white' }}>
                  Top 10 Followers
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const follower = metrics.sampleFollowers[i % metrics.sampleFollowers.length];
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {/* Follower Avatar */}
                        <img 
                          src={follower.avatar} 
                          alt={follower.displayName || follower.handle}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                        
                        {/* Follower Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>
                                {follower.displayName || follower.handle}
                              </p>
                              <p style={{ margin: 0, fontSize: '14px', color: '#1e90ff' }}>
                                @{follower.handle}
                              </p>
                            </div>
                            <button style={{
                              background: '#1e90ff',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}>
                              Follow
                            </button>
                          </div>
                          
                          <p style={{ 
                            margin: '0.5rem 0', 
                            color: '#e0e0e0', 
                            fontSize: '16px', 
                            lineHeight: '1.4' 
                          }}>
                            Recent follower - Thanks for following! 🙏
                          </p>
                          
                          <div style={{ 
                            display: 'flex', 
                            gap: '1rem', 
                            fontSize: '14px', 
                            color: '#a0a0a0',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span>Recent follower</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <span>Profile details not available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other tabs */}
        {activeTab !== 'overview' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '18px' }}>Coming Soon</h2>
            <p style={{ margin: 0, fontSize: '16px' }}>Advanced analytics and insights</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;