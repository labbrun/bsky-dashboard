import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, MessageSquare, Heart, Repeat2, Eye, Settings, LogOut, Search, Filter, MoreHorizontal, ExternalLink, Clock, Hash, Target, Lightbulb } from 'lucide-react';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your actual Bluesky data as mock data
  const [metrics] = useState({
    "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:rgzzbabbrkgvjftuinib6ida/bafkreicii4dvbc273j3z2hthbnsc6rejpntg3mj2dvujjvo7v5kscqzzem@jpeg",
    "banner": "https://cdn.bsky.app/img/banner/plain/did:plc:rgzzbabbrkgvjftuinib6ida/bafkreigeqe2bcg2rnbpc4i2pcpy42vm5xujmwcsxuqbkyxgqjcqgofd23m@jpeg",
    "bio": " Home labbing, working remotely, and being your own privacy, security and IT department @ labb.run/blog | LLMs train on my data | Trust No Wan",
    "displayName": "Labb",
    "handle": "labb.run",
    "followersCount": 12,
    "followsCount": 58,
    "postsCount": 41,
    "totalLikes": 3357,
    "totalReplies": 46,
    "totalReposts": 1375,
    "recentPosts": [
      {
        "images": [],
        "indexedAt": "2025-07-22T12:44:44.342Z",
        "likeCount": 0,
        "replyCount": 0,
        "repostCount": 0,
        "text": "Obama (a Constitutional attorney) will wipe the floor with Trump and his insane ramblings. This is not the distraction fight he should be picking. It will not end well for him nor any of his minions who participate.",
        "uri": "at://did:plc:rgzzbabbrkgvjftuinib6ida/app.bsky.feed.post/3lukjuhykos23"
      },
      {
        "images": ["https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:rgzzbabbrkgvjftuinib6ida/bafkreihniacue7ghgwkv3wcsl4b27ulykj6won3v47rnelovyaw6bkmlwe@jpeg"],
        "indexedAt": "2025-07-22T12:36:20.542Z",
        "likeCount": 1,
        "replyCount": 0,
        "repostCount": 0,
        "text": "There are some device and OS options and in this article I mention many of them, but IMO ATM  GrapheneOS on a Pixel phone is my favorite way to accomplish this. \n\n#Privacy #GrapheneOS #GooglePixel\n\nlabb.run/how-to-set-u...",
        "uri": "at://did:plc:rgzzbabbrkgvjftuinib6ida/app.bsky.feed.post/3lukjffzljs23"
      },
      {
        "images": ["https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:rgzzbabbrkgvjftuinib6ida/bafkreigltauiwhwwv7k67s5ivnjc2x4uxpxubfrtwkc3ayjtfmgj3a67bq@jpeg"],
        "indexedAt": "2025-07-20T13:54:56.740Z",
        "likeCount": 0,
        "replyCount": 0,
        "repostCount": 0,
        "text": "Damn. That's good. \n\n#KendrickLamar #TrumpNotLikeUs\n\nyoutu.be/LHhYl895P_E?...",
        "uri": "at://did:plc:rgzzbabbrkgvjftuinib6ida/app.bsky.feed.post/3lufmu4dmi22g"
      },
      {
        "images": [],
        "indexedAt": "2025-07-09T16:27:38.439Z",
        "likeCount": 0,
        "replyCount": 0,
        "repostCount": 0,
        "text": "Hey, at least the weather is warmer, and we're finally ridding the planet of all those pesky Black Rhinos.",
        "uri": "at://did:plc:rgzzbabbrkgvjftuinib6ida/app.bsky.feed.post/3ltkab3h5es2t"
      },
      {
        "images": ["https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:rgzzbabbrkgvjftuinib6ida/bafkreiafgwvct3hp6fb76masiiruy2lempifglswav6hublgu2fkaz7hjy@jpeg"],
        "indexedAt": "2025-07-09T16:14:09.547Z",
        "likeCount": 0,
        "replyCount": 0,
        "repostCount": 0,
        "text": "Um...yeah. It gets harder and harder to accept the \"My heart goes out to you\" excuse...if anyone actually ever did. \n\nnypost.com/2025/07/09/u...",
        "uri": "at://did:plc:rgzzbabbrkgvjftuinib6ida/app.bsky.feed.post/3ltk7iwdejk2t"
      }
    ],
    "sampleFollowers": [
      {
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:6uuqsarv7muhngito6ktpmfn/bafkreiavv4ihgabp66ktou5bmh6nqqye6dsaqe4kvqxrf7kvmfqz5f322m@jpeg",
        "displayName": "",
        "handle": "helge-m.bsky.social"
      },
      {
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:gnq5h66pebqk3d3gzqzgiikt/bafkreicdvmd7vvowll2x73s6e7xrfb6hpdypoli3zzprem5ijmnsg45hhy@jpeg",
        "displayName": "",
        "handle": "billiebun.bsky.social"
      },
      {
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:gwlrj2a6zbx5nuigsxjvwc2q/bafkreibjm3t42owy5kw3jylxnef3nrz5jmtua7ytcc24xs5ddvikayy3ma@jpeg",
        "displayName": "Author M. I. Verras (She/Her)",
        "handle": "miverraswriter.bsky.social"
      }
    ]
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'labb2025') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('overview');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePostUrl = (uri, handle) => {
    if (!uri) return '#';
    const parts = uri.split('/');
    const rkey = parts[parts.length - 1];
    const postHandle = handle || 'labb.run';
    return `https://bsky.app/profile/${postHandle}/post/${rkey}`;
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px'
      }}>
        <div style={{
          background: 'rgba(30, 30, 30, 0.95)',
          border: '1px solid #404040',
          borderRadius: '16px',
          padding: '3rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#ffffff', fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Labb.run Analytics
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
              Bluesky Intelligence Dashboard
            </p>
          </div>
          
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#e0e0e0', 
                fontSize: '16px', 
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#2a2a2a',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Enter password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(59, 130, 246, 0.1)', 
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#93c5fd', fontSize: '14px', margin: 0 }}>
              Demo Password: labb2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'audience', label: 'Audience Analytics', icon: Users },
    { id: 'content', label: 'Content Performance', icon: MessageSquare },
    { id: 'trending', label: 'Trending Topics', icon: Hash },
    { id: 'opportunities', label: 'Content Opportunities', icon: Lightbulb }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      fontFamily: '"Roboto", sans-serif',
      fontSize: '16px'
    }}>
      <header style={{
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #404040',
        padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              Labb.run Analytics
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '16px', margin: 0 }}>
              Bluesky Intelligence Dashboard
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {error && (
              <span style={{ color: '#ef4444', fontSize: '16px' }}>
                {error}
              </span>
            )}
            {loading && (
              <span style={{ color: '#3b82f6', fontSize: '16px' }}>
                Loading...
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav style={{
        background: 'rgba(30, 30, 30, 0.8)',
        borderBottom: '1px solid #404040',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab.id ? '#3b82f6' : '#a0a0a0',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main style={{ padding: '2rem' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid #404040',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem' }}>
                Recent Posts Timeline
              </h2>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#a0a0a0' }}>
                  Loading posts...
                </div>
              ) : metrics?.recentPosts?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                  {metrics.recentPosts.map((post, index) => (
                    <div key={index} style={{
                      background: 'rgba(40, 40, 40, 0.6)',
                      border: '1px solid #505050',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#a0a0a0', fontSize: '14px' }}>
                          {formatDate(post.indexedAt)}
                        </span>
                        <a 
                          href={generatePostUrl(post.uri, metrics.handle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'none' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      
                      <p style={{ color: '#e0e0e0', fontSize: '16px', lineHeight: '1.4', marginBottom: '1rem' }}>
                        {post.text || 'No text content'}
                      </p>
                      
                      {post.images && post.images.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <img 
                            src={post.images[0]} 
                            alt="Post image"
                            style={{ width: '100%', maxWidth: '200px', borderRadius: '6px' }}
                          />
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '14px', color: '#a0a0a0' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Heart size={12} />
                          {post.likeCount || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MessageSquare size={12} />
                          {post.replyCount || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Repeat2 size={12} />
                          {post.repostCount || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#a0a0a0' }}>
                  No posts available
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid #404040',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                  Profile Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Followers</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.followersCount || 0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Following</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.followsCount || 0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Posts</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.postsCount || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid #404040',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                  Engagement Metrics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Total Likes</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.totalLikes || 0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Total Replies</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.totalReplies || 0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a0a0a0', fontSize: '16px' }}>Total Reposts</span>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '16px' }}>
                      {formatNumber(metrics?.totalReposts || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid #404040',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1rem' }}>
                  Recent Followers
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {metrics?.sampleFollowers?.slice(0, 3).map((follower, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.5rem',
                      background: 'rgba(40, 40, 40, 0.3)',
                      borderRadius: '6px'
                    }}>
                      <img 
                        src={follower.avatar}
                        alt="Avatar"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{ color: '#e0e0e0', fontSize: '14px' }}>
                        @{follower.handle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Audience Analytics</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show audience demographics and insights</p>
          </div>
        )}

        {activeTab === 'content' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Content Performance</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show your top performing posts and content analytics</p>
          </div>
        )}

        {activeTab === 'trending' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <Hash size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Trending Topics</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show trending topics across platforms</p>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <Lightbulb size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Content Opportunities</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show AI-generated content suggestions and opportunities</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;