# Database Setup Instructions

This guide walks you through setting up the Supabase database schema for your Bluesky Analytics Dashboard.

## 🚀 Quick Setup

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com/) and sign in
2. Select your project: **ubuvwieczlclrbsecjki**
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Schema

1. In the SQL Editor, click **"New Query"**
2. Copy the entire contents of `schema.sql` (in this same folder)
3. Paste it into the SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

### Step 3: Verify Tables Created

After running the schema, you should see these tables in the **Table Editor**:

✅ **profiles** - Bluesky user profiles and metadata  
✅ **posts** - Cached recent posts for faster loading  
✅ **followers** - Follower tracking data over time  
✅ **daily_metrics** - Historical analytics snapshots  
✅ **analytics_sessions** - Data fetching session logs  

## 🔍 What Each Table Does

### `profiles`
- **Purpose**: Stores Bluesky profile information
- **Key Fields**: `handle`, `display_name`, `followers_count`, `posts_count`
- **Updated**: When profile data is fetched from Bluesky API

### `posts` 
- **Purpose**: Caches recent posts for faster dashboard loading
- **Key Fields**: `profile_handle`, `text`, `like_count`, `repost_count`
- **Updated**: When new posts are fetched

### `followers`
- **Purpose**: Tracks follower data for growth analytics
- **Key Fields**: `profile_handle`, `follower_handle`, `followed_at`
- **Updated**: During follower sync operations

### `daily_metrics`
- **Purpose**: Daily snapshots for historical tracking
- **Key Fields**: `date`, `followers_count`, `engagement_rate`
- **Updated**: Daily or when analytics are recalculated

### `analytics_sessions`
- **Purpose**: Logs data fetching sessions for monitoring
- **Key Fields**: `session_type`, `status`, `duration_seconds`
- **Updated**: Each time data is synced

## 🛠 Customization

### Update Your Handle
Replace the sample handle in the schema:

```sql
-- Line near the bottom of schema.sql
INSERT INTO profiles (handle, display_name, description) 
VALUES ('yourhandle.bsky.social', 'Your Name', 'Your bio description')
```

Change to your actual Bluesky handle:
```sql
INSERT INTO profiles (handle, display_name, description) 
VALUES ('youractualhandle.bsky.social', 'Your Actual Name', 'Your actual bio')
```

### Security Settings

The schema includes Row Level Security (RLS) with permissive policies. For production:

1. **Restrict access** based on authenticated users
2. **Add user-specific policies** if supporting multiple users
3. **Review permissions** in the Supabase dashboard

## 🧪 Testing the Connection

After creating the schema, test the connection:

1. **Start your app**: `npm start` (with token server running)
2. **Check browser console** for database connection logs
3. **Navigate to different pages** to see if data loads
4. **Look for errors** in the Network tab (F12 → Network)

### Expected Behavior

- **First load**: Tables will be empty, app fetches from Bluesky API
- **Subsequent loads**: Data loads faster from database cache
- **Profile updates**: New data gets stored in database

## 🔧 Troubleshooting

### "relation does not exist" errors
- **Cause**: Schema not created or wrong database
- **Fix**: Re-run the schema.sql in the SQL Editor

### Permission denied errors  
- **Cause**: RLS policies too restrictive
- **Fix**: Check policies in Supabase → Authentication → Policies

### Connection timeouts
- **Cause**: Network issues or wrong credentials
- **Fix**: Verify `.env` file has correct Supabase URL/key

### Data not persisting
- **Cause**: App not configured to use database
- **Fix**: Check `supabaseService.js` is being called by components

## 📊 Monitoring

Monitor your database usage in Supabase Dashboard:

- **Database** → View table sizes and row counts
- **Logs** → Check for errors and slow queries  
- **API** → Monitor API usage and performance

## 🚀 Next Steps

Once the schema is set up:

1. **Initial data load**: App will populate tables on first use
2. **Historical tracking**: Metrics will build up over time  
3. **Performance benefits**: Faster loading and caching
4. **Analytics growth**: Rich historical data for insights

The database setup is a one-time process that will significantly improve your dashboard's performance and enable historical analytics tracking!