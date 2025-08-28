-- Bluesky Analytics Dashboard - Simple Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS daily_metrics CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP VIEW IF EXISTS profile_analytics_summary CASCADE;

-- Create profiles table for Bluesky user profiles
CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE,
    display_name TEXT,
    description TEXT,
    avatar TEXT,
    banner TEXT,
    followers_count INTEGER DEFAULT 0,
    follows_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Bluesky-specific fields
    did TEXT,
    indexed_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics fields
    verification_status TEXT DEFAULT 'unverified',
    account_type TEXT DEFAULT 'personal'
);

-- Create posts table for caching recent posts
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_handle TEXT NOT NULL,
    uri TEXT NOT NULL UNIQUE,
    cid TEXT,
    text TEXT,
    reply_count INTEGER DEFAULT 0,
    repost_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    quote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Content analysis fields
    has_images BOOLEAN DEFAULT FALSE,
    has_links BOOLEAN DEFAULT FALSE,
    has_mentions BOOLEAN DEFAULT FALSE,
    has_hashtags BOOLEAN DEFAULT FALSE,
    
    -- Engagement metrics
    engagement_rate DECIMAL(5,2),
    
    -- Foreign key reference
    FOREIGN KEY (profile_handle) REFERENCES profiles(handle) ON DELETE CASCADE
);

-- Create followers table for tracking follower data
CREATE TABLE followers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_handle TEXT NOT NULL,
    follower_handle TEXT NOT NULL,
    follower_display_name TEXT,
    follower_avatar TEXT,
    followers_count INTEGER DEFAULT 0,
    follows_count INTEGER DEFAULT 0,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate follower records
    UNIQUE(profile_handle, follower_handle),
    
    -- Foreign key reference
    FOREIGN KEY (profile_handle) REFERENCES profiles(handle) ON DELETE CASCADE
);

-- Create daily_metrics table for historical analytics
CREATE TABLE daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_handle TEXT NOT NULL,
    date DATE NOT NULL,
    
    -- Follower metrics
    followers_count INTEGER DEFAULT 0,
    followers_gained INTEGER DEFAULT 0,
    followers_lost INTEGER DEFAULT 0,
    
    -- Content metrics
    posts_count INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_replies INTEGER DEFAULT 0,
    total_reposts INTEGER DEFAULT 0,
    total_quotes INTEGER DEFAULT 0,
    
    -- Engagement metrics
    average_engagement_rate DECIMAL(5,2),
    top_post_likes INTEGER DEFAULT 0,
    
    -- Calculated fields
    engagement_score DECIMAL(8,2),
    growth_rate DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate daily records
    UNIQUE(profile_handle, date),
    
    -- Foreign key reference
    FOREIGN KEY (profile_handle) REFERENCES profiles(handle) ON DELETE CASCADE
);

-- Create analytics_sessions table for tracking data fetching sessions
CREATE TABLE analytics_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_handle TEXT NOT NULL,
    session_type TEXT NOT NULL, -- 'full_refresh', 'incremental', 'manual'
    status TEXT DEFAULT 'started', -- 'started', 'completed', 'failed'
    
    -- Session metrics
    profiles_updated INTEGER DEFAULT 0,
    posts_fetched INTEGER DEFAULT 0,
    followers_updated INTEGER DEFAULT 0,
    metrics_calculated INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Error tracking
    error_message TEXT,
    
    -- Foreign key reference
    FOREIGN KEY (profile_handle) REFERENCES profiles(handle) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_handle ON profiles(handle);
CREATE INDEX idx_profiles_last_fetched ON profiles(last_fetched_at);

CREATE INDEX idx_posts_profile_handle ON posts(profile_handle);
CREATE INDEX idx_posts_indexed_at ON posts(indexed_at DESC);
CREATE INDEX idx_posts_engagement ON posts(engagement_rate DESC);

CREATE INDEX idx_followers_profile_handle ON followers(profile_handle);
CREATE INDEX idx_followers_followed_at ON followers(followed_at DESC);

CREATE INDEX idx_daily_metrics_profile_date ON daily_metrics(profile_handle, date DESC);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date DESC);

CREATE INDEX idx_sessions_profile_handle ON analytics_sessions(profile_handle);
CREATE INDEX idx_sessions_started_at ON analytics_sessions(started_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON posts FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON followers FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON followers FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON daily_metrics FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON daily_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON analytics_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON analytics_sessions FOR UPDATE USING (true);

-- Insert sample profile (replace with your actual handle)
INSERT INTO profiles (handle, display_name, description) 
VALUES ('yourhandle.bsky.social', 'Your Name', 'Building the future with Home Lab, Self Hosting, and Privacy-first solutions for Small Business.')
ON CONFLICT (handle) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully! 🎉' AS message;