import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Heart, Repeat2, Eye, LogOut, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your actual Bluesky data
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
        "handle": "helge-m.bsky.social",
        "followersCount": 156,
        "postsCount": 23,
        "recentPost": "Just launched my new project! Excited to share with the community.",
        "recentPostImage": "https://picsum.photos/80/80?random=1"
      },
      {
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:gnq5h66pebqk3d3gzqzgiikt/bafkreicdvmd7vvowll2x73s6e7xrfb6hpdypoli3zzprem5ijmnsg45hhy@jpeg",
        "displayName": "",
        "handle": "billiebun.bsky.social",
        "followersCount": 892,
        "postsCount": 156,
        "recentPost": "Working on some new designs. Can't wait to show everyone!",
        "recentPostImage": "https://picsum.photos/80/80?random=2"
      },
      {
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:gwlrj2a6zbx5nuigsxjvwc2q/bafkreibjm3t42owy5kw3jylxnef3nrz5jmtua7ytcc24xs5ddvikayy3ma@jpeg",
        "displayName": "Author M. I. Verras (She/Her)",
        "handle": "miverraswriter.bsky.social",
        "followersCount": 1240,
        "postsCount": 342,
        "recentPost": "New chapter is live! Thanks for all the support on this journey.",
        "recentPostImage": "https://picsum.photos/80/80?random=3"
      }
    ]
  });

  // Mock engagement data for the graph
  const engagementData = [
    { day: 'Mon', engagement: 24 },
    { day: 'Tue', engagement: 45 },
    { day: 'Wed', engagement: 32 },
    { day: 'Thu', engagement: 67 },
    { day: 'Fri', engagement: 89 },
    { day: 'Sat', engagement: 56 },
    { day: 'Sun', engagement: 43 }
  ];

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

  const calculateEngagement = (post) => {
    return (post.likeCount || 0) + (post.replyCount || 0) + (post.repostCount || 0);
  };

  const MetricCard = ({ title, value, change, changeType = 'positive' }) => (
    <div style={{
      background: 'rgba(30, 30, 30, 0.8)',
      border: '1px solid #404040',
      borderRadius: '12px',
      padding: '1.5rem',
      width: '100%'
    }}>
      <h3 style={{ color: '#a0a0a0', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem', margin: 0 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
          {value}
        </span>
        {change && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            color: changeType === 'positive' ? '#10b981' : '#ef4444',
            fontSize: '14px'
          }}>
            {changeType === 'positive' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#052b46',
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#052b46',
      fontFamily: '"Roboto", sans-serif',
      fontSize: '16px'
    }}>
      {/* Profile Header */}
      <header style={{
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #404040',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Avatar */}
            <img 
              src={metrics.avatar} 
              alt="Profile Avatar"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #3b82f6'
              }}
            />
            
            {/* Profile Info */}
            <div>
              <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
                {metrics.displayName}
              </h1>
              <p style={{ color: '#3b82f6', fontSize: '16px', margin: '0 0 1rem 0' }}>
                @{metrics.handle}
              </p>
              <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: '1.4', maxWidth: '500px', margin: '0 0 1rem 0' }}>
                {metrics.bio}
              </p>
              
              {/* Stats */}
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>
                    {formatNumber(metrics.followersCount)}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>
                    {formatNumber(metrics.followsCount)}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Following</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>
                    {formatNumber(metrics.postsCount)}
                  </div>
                  <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Posts</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Period Selector and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                color: '#3b82f6',
                padding: '0.5rem 1rem',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={21}>Last 21 days</option>
              <option value={31}>Last 31 days</option>
            </select>
            
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
                fontSize: '14px'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
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
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'audience', label: 'Audience Analytics', icon: Users },
            { id: 'content', label: 'Content Performance', icon: MessageSquare },
            { id: 'trending', label: 'Trending Topics', icon: MessageSquare },
            { id: 'opportunities', label: 'Content Opportunities', icon: Eye }
          ].map((tab) => {
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
          <div>
            {/* Metrics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <MetricCard 
                title="Total Posts" 
                value={metrics.postsCount}
                change="Data not available"
                changeType="neutral"
              />
              <MetricCard 
                title="Average Engagement" 
                value="Data not available"
                change=""
                changeType="neutral"
              />
              <MetricCard 
                title="Followers Gained" 
                value="Data not available"
                change=""
                changeType="positive"
              />
              <MetricCard 
                title="Followers Lost" 
                value="Data not available"
                change=""
                changeType="negative"
              />
            </div>

            {/* Daily Engagement Graph */}
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid #404040',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem' }}>
                Daily Engagement Trends
              </h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="day" stroke="#a0a0a0" />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(30, 30, 30, 0.95)', 
                        border: '1px solid #404040',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Section - Recent Posts and Top Followers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Recent Posts */}
              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid #404040',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem' }}>
                  Recent Posts Timeline
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {metrics.recentPosts.slice(0, 10).map((post, index) => (
                    <div key={index} style={{
                      background: 'rgba(40, 40, 40, 0.6)',
                      border: '1px solid #505050',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem'
                    }}>
                      {/* Post Image */}
                      <div style={{ flexShrink: 0 }}>
                        {post.images && post.images.length > 0 ? (
                          <img 
                            src={post.images[0]} 
                            alt="Post"
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <MessageSquare size={24} color="#3b82f6" />
                          </div>
                        )}
                      </div>
                      
                      {/* Post Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
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
                        
                        <p style={{ 
                          color: '#e0e0e0', 
                          fontSize: '16px', 
                          lineHeight: '1.4', 
                          marginBottom: '1rem',
                          margin: '0 0 1rem 0'
                        }}>
                          {post.text}
                        </p>
                        
                        {/* Engagement Stats */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '1rem', 
                          fontSize: '14px', 
                          color: '#a0a0a0',
                          flexWrap: 'wrap'
                        }}>
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
                          <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                            Total: {calculateEngagement(post)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Followers */}
              <div style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid #404040',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem' }}>
                  Top 20 Followers
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Array.from({ length: 20 }, (_, i) => {
                    const follower = metrics.sampleFollowers[i % metrics.sampleFollowers.length];
                    return (
                      <div key={i} style={{
                        background: 'rgba(40, 40, 40, 0.6)',
                        border: '1px solid #505050',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        {/* Follower Post Image */}
                        <div style={{ flexShrink: 0 }}>
                          {follower.recentPostImage ? (
                            <img 
                              src={follower.recentPostImage} 
                              alt="Recent Post"
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '8px',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '80px',
                              height: '80px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <img 
                                src={follower.avatar}
                                alt="Follower Avatar"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Follower Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                              <div>
                                <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                                  @{follower.handle.split('.')[0]}
                                </div>
                                <div style={{ color: '#a0a0a0', fontSize: '14px' }}>
                                  {formatNumber(follower.followersCount)} followers • {follower.postsCount} posts
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {follower.recentPost && (
                            <p style={{ 
                              color: '#e0e0e0', 
                              fontSize: '16px', 
                              lineHeight: '1.4',
                              margin: '0 0 1rem 0'
                            }}>
                              {follower.recentPost}
                            </p>
                          )}
                          
                          <button style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '4px',
                            color: '#3b82f6',
                            padding: '0.5rem 1rem',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}>
                            Comment
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Trending Topics</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show trending topics across platforms</p>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0a0a0' }}>
            <Eye size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '18px' }}>Content Opportunities</h3>
            <p style={{ fontSize: '16px' }}>Coming soon - This will show AI-generated content suggestions and opportunities</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;