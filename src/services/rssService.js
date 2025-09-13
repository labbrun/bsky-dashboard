// RSS Feed Service
// Fetches and processes blog content from RSS feeds for analytics

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

// Convert RSS XML to JavaScript object
const parseRSSFeed = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Failed to parse RSS feed');
  }

  const channel = xmlDoc.querySelector('channel');
  if (!channel) {
    throw new Error('Invalid RSS feed format');
  }

  // Extract feed metadata
  const feedInfo = {
    title: channel.querySelector('title')?.textContent || 'Blog',
    description: channel.querySelector('description')?.textContent || '',
    link: channel.querySelector('link')?.textContent || '',
    lastBuildDate: channel.querySelector('lastBuildDate')?.textContent || '',
    language: channel.querySelector('language')?.textContent || 'en'
  };

  // Extract all items/posts
  const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
    const title = item.querySelector('title')?.textContent || 'Untitled';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const guid = item.querySelector('guid')?.textContent || link;
    
    // Extract categories/tags
    const categories = Array.from(item.querySelectorAll('category')).map(cat => 
      cat.textContent.trim()
    );

    // Parse content and extract text
    let content = description;
    const contentEncoded = item.querySelector('content\\:encoded') || 
                          item.querySelector('encoded');
    if (contentEncoded) {
      content = contentEncoded.textContent;
    }

    // Strip HTML tags for text analysis
    const textContent = content.replace(/<[^>]*>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();

    // Extract word count and reading time
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 WPM average

    // Parse publication date
    const publishedDate = pubDate ? new Date(pubDate) : new Date();

    return {
      id: guid,
      title,
      link,
      description: description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
      content: textContent,
      htmlContent: content,
      pubDate: publishedDate,
      pubDateString: pubDate,
      categories,
      wordCount,
      readingTime,
      
      // Analytics fields
      excerpt: textContent.substring(0, 300) + (textContent.length > 300 ? '...' : ''),
      
      // Will be populated by analysis functions
      sentiment: null,
      topics: [],
      targetAudienceAlignment: null,
      blueskyPotential: null
    };
  });

  return {
    feed: feedInfo,
    posts: items
  };
};

// Fetch RSS feed data
export const fetchBlogFeed = async (rssUrl) => {
  if (!rssUrl) {
    throw new Error('RSS URL is required');
  }
  
  try {
    
    // Try direct fetch first
    let response;
    let xmlText;
    
    try {
      response = await fetch(rssUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Direct fetch failed: ${response.status}`);
      }
      
      xmlText = await response.text();
      
    } catch (directError) {
      
      // Fallback to CORS proxy
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(rssUrl)}`;
      response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`CORS proxy fetch failed: ${response.status} ${response.statusText}`);
      }
      
      const proxyData = await response.json();
      xmlText = proxyData.contents;
    }
    
    if (!xmlText) {
      throw new Error('No XML content received');
    }
    
    const feedData = parseRSSFeed(xmlText);
    
    return feedData;
  } catch (error) {
    throw new Error(`RSS feed error: ${error.message}`);
  }
};

// Analyze blog post content for target audience alignment
export const analyzeBlogPostAlignment = (post, targetTopics = []) => {
  if (!post.content) return { score: 0, topics: [], analysis: 'No content available' };

  const content = post.content.toLowerCase();
  const title = post.title.toLowerCase();
  
  // Default tech/business topics if none provided
  const defaultTopics = [
    'ai', 'artificial intelligence', 'machine learning', 'automation',
    'technology', 'software', 'development', 'programming', 'code',
    'business', 'startup', 'entrepreneur', 'productivity', 'innovation',
    'privacy', 'security', 'data', 'analytics', 'cloud', 'api',
    'homelab', 'server', 'networking', 'infrastructure', 'devops'
  ];
  
  const topics = targetTopics.length > 0 ? targetTopics : defaultTopics;
  const foundTopics = [];
  let score = 0;

  // Check title (weighted more heavily)
  topics.forEach(topic => {
    if (title.includes(topic)) {
      foundTopics.push(topic);
      score += 3; // Title mentions are worth more
    }
  });

  // Check content
  topics.forEach(topic => {
    if (content.includes(topic) && !foundTopics.includes(topic)) {
      foundTopics.push(topic);
      score += 1;
    }
  });

  // Calculate percentage alignment
  const alignmentScore = Math.min(100, (score / Math.max(topics.length, 10)) * 100);

  return {
    score: Math.round(alignmentScore),
    topics: foundTopics,
    analysis: generateAlignmentAnalysis(alignmentScore, foundTopics)
  };
};

// Generate human-readable alignment analysis
const generateAlignmentAnalysis = (score, topics) => {
  if (score >= 80) {
    return `Excellent alignment with your target audience. Strong focus on ${topics.slice(0, 3).join(', ')}.`;
  } else if (score >= 60) {
    return `Good alignment. Covers relevant topics including ${topics.slice(0, 2).join(', ')}.`;
  } else if (score >= 40) {
    return `Moderate alignment. Some relevant content but could be more targeted.`;
  } else if (score >= 20) {
    return `Low alignment. Consider adding more content about your core topics.`;
  } else {
    return `Off-target content. May not resonate strongly with your Bluesky audience.`;
  }
};

// Calculate blog posting frequency and consistency
export const calculateBlogMetrics = (posts) => {
  if (!posts || posts.length === 0) {
    return {
      totalPosts: 0,
      averageWordsPerPost: 0,
      averageReadingTime: 0,
      postingFrequency: 'No posts',
      consistencyScore: 0,
      lastPostDate: null,
      topCategories: []
    };
  }

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  // Calculate metrics
  const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
  const averageWordsPerPost = Math.round(totalWords / posts.length);
  const averageReadingTime = Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length);

  // Calculate posting frequency (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentPosts = posts.filter(post => new Date(post.pubDate) >= thirtyDaysAgo);
  const postsPerWeek = (recentPosts.length / 30) * 7;

  let frequency;
  if (postsPerWeek >= 3) frequency = 'Very Active (3+ per week)';
  else if (postsPerWeek >= 1) frequency = 'Active (1+ per week)';
  else if (postsPerWeek >= 0.5) frequency = 'Regular (2+ per month)';
  else if (postsPerWeek >= 0.25) frequency = 'Occasional (1+ per month)';
  else frequency = 'Infrequent (less than monthly)';

  // Calculate consistency score based on posting intervals
  let consistencyScore = 0;
  if (sortedPosts.length > 1) {
    const intervals = [];
    for (let i = 0; i < sortedPosts.length - 1; i++) {
      const diff = Math.abs(new Date(sortedPosts[i].pubDate) - new Date(sortedPosts[i + 1].pubDate));
      intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    consistencyScore = Math.max(0, Math.min(100, 100 - (standardDeviation / avgInterval) * 100));
  }

  // Extract top categories
  const categoryCount = {};
  posts.forEach(post => {
    post.categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  return {
    totalPosts: posts.length,
    averageWordsPerPost,
    averageReadingTime,
    postingFrequency: frequency,
    consistencyScore: Math.round(consistencyScore),
    lastPostDate: sortedPosts[0]?.pubDate,
    topCategories,
    recentPosts: recentPosts.length,
    postsPerWeek: Math.round(postsPerWeek * 10) / 10
  };
};

// Test RSS feed connection
export const testRSSConnection = async (rssUrl) => {
  try {
    const result = await fetchBlogFeed(rssUrl);
    return { 
      connected: true, 
      message: `RSS feed accessible - found ${result.posts.length} posts from "${result.feed.title}"` 
    };
  } catch (error) {
    return { connected: false, message: error.message };
  }
};