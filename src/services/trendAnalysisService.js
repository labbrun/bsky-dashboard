// Trend Analysis Service
// Fetches trending topics and discussions from Google, Reddit, and LinkedIn
// Uses Google Custom Search API to ethically access public data

import { APP_CONFIG } from '../config/app.config';

const GOOGLE_CSE_CONFIG = APP_CONFIG.api.google;
const LINKEDIN_CONFIG = APP_CONFIG.api.linkedin;

// Keywords related to LabbRun's target audience
const DEFAULT_KEYWORDS = [
  'self hosting',
  'home lab',
  'privacy tools',
  'open source alternatives',
  'docker containers',
  'kubernetes homelab',
  'self hosted apps',
  'privacy focused tools',
  'cost effective tech',
  'small business automation'
];

export class TrendAnalysisService {
  constructor() {
    this.googleApiKey = GOOGLE_CSE_CONFIG.customSearchApiKey;
    this.searchEngineId = GOOGLE_CSE_CONFIG.searchEngineId;
    this.linkedinClientId = LINKEDIN_CONFIG.clientId;
  }

  // Search Google Custom Search API
  async searchGoogle(query, site = null, num = 10) {
    if (!this.googleApiKey || !this.searchEngineId) {
      throw new Error('Google Custom Search API key or Search Engine ID not configured');
    }

    const siteQuery = site ? `site:${site} ${query}` : query;
    const url = new URL(GOOGLE_CSE_CONFIG.baseUrl);
    url.searchParams.append('key', this.googleApiKey);
    url.searchParams.append('cx', this.searchEngineId);
    url.searchParams.append('q', siteQuery);
    url.searchParams.append('num', num.toString());
    url.searchParams.append('sort', 'date'); // Get recent results

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseGoogleResults(data, site);
    } catch (error) {
      console.error('Google Search API error:', error);
      throw error;
    }
  }

  // Parse Google search results into structured format
  parseGoogleResults(data, source) {
    if (!data.items) return [];

    return data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      displayLink: item.displayLink,
      source: source || 'google',
      publishedDate: item.pagemap?.metatags?.[0]?.['article:published_time'] || 
                    item.pagemap?.metatags?.[0]?.['og:updated_time'] || 
                    new Date().toISOString(),
      engagement: this.estimateEngagement(item),
      keywords: this.extractKeywords(item.snippet)
    }));
  }

  // Estimate engagement based on search result properties
  estimateEngagement(item) {
    let score = 0;
    
    // Higher score for Reddit posts with comments
    if (item.displayLink?.includes('reddit.com')) {
      const commentMatch = item.snippet.match(/(\d+)\s+(comment|reply)/i);
      if (commentMatch) {
        score += Math.min(parseInt(commentMatch[1]) * 2, 100);
      } else {
        score += 10; // Base score for Reddit posts
      }
    }
    
    // Higher score for LinkedIn posts
    if (item.displayLink?.includes('linkedin.com')) {
      score += 15; // Base score for LinkedIn
    }
    
    // Boost for recent content
    const title = item.title.toLowerCase();
    if (title.includes('2024') || title.includes('2025') || title.includes('new') || title.includes('latest')) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }

  // Extract relevant keywords from text
  extractKeywords(text) {
    const keywords = [];
    const lowercaseText = text.toLowerCase();
    
    DEFAULT_KEYWORDS.forEach(keyword => {
      if (lowercaseText.includes(keyword.toLowerCase())) {
        keywords.push(keyword);
      }
    });
    
    return keywords;
  }

  // Get trending topics from Reddit via Google Search
  async getRedditTrends(keywords = DEFAULT_KEYWORDS) {
    const trends = [];
    
    for (const keyword of keywords.slice(0, 5)) { // Limit to avoid rate limits
      try {
        const results = await this.searchGoogle(keyword, 'reddit.com', 5);
        trends.push({
          keyword,
          platform: 'reddit',
          posts: results,
          totalPosts: results.length,
          avgEngagement: results.reduce((sum, post) => sum + post.engagement, 0) / results.length || 0
        });
      } catch (error) {
        console.error(`Error fetching Reddit trends for ${keyword}:`, error);
      }
    }
    
    return trends;
  }

  // Get trending topics from LinkedIn via Google Search
  async getLinkedInTrends(keywords = DEFAULT_KEYWORDS) {
    const trends = [];
    
    for (const keyword of keywords.slice(0, 3)) { // Limit more strictly for LinkedIn
      try {
        const results = await this.searchGoogle(`${keyword} startup OR business OR entrepreneur`, 'linkedin.com', 3);
        trends.push({
          keyword,
          platform: 'linkedin',
          posts: results,
          totalPosts: results.length,
          avgEngagement: results.reduce((sum, post) => sum + post.engagement, 0) / results.length || 0
        });
      } catch (error) {
        console.error(`Error fetching LinkedIn trends for ${keyword}:`, error);
      }
    }
    
    return trends;
  }

  // Get general trending topics via Google Search
  async getGoogleTrends(keywords = DEFAULT_KEYWORDS) {
    const trends = [];
    
    for (const keyword of keywords.slice(0, 3)) {
      try {
        const results = await this.searchGoogle(`${keyword} 2025 trending OR popular OR latest`, null, 5);
        trends.push({
          keyword,
          platform: 'google',
          posts: results,
          totalPosts: results.length,
          avgEngagement: results.reduce((sum, post) => sum + post.engagement, 0) / results.length || 0
        });
      } catch (error) {
        console.error(`Error fetching Google trends for ${keyword}:`, error);
      }
    }
    
    return trends;
  }

  // Get comprehensive trend analysis
  async getComprehensiveTrends(customKeywords = null) {
    const keywords = customKeywords || DEFAULT_KEYWORDS;
    
    try {
      const [redditTrends, linkedinTrends, googleTrends] = await Promise.all([
        this.getRedditTrends(keywords),
        this.getLinkedInTrends(keywords),
        this.getGoogleTrends(keywords)
      ]);

      // Combine and analyze trends
      const allTrends = [...redditTrends, ...linkedinTrends, ...googleTrends];
      const topKeywords = this.identifyTopKeywords(allTrends);
      const trendingTopics = this.identifyTrendingTopics(allTrends);
      const questions = this.extractQuestions(allTrends);
      const painPoints = this.identifyPainPoints(allTrends);

      return {
        summary: {
          totalTrends: allTrends.length,
          totalPosts: allTrends.reduce((sum, trend) => sum + trend.totalPosts, 0),
          avgEngagement: allTrends.reduce((sum, trend) => sum + trend.avgEngagement, 0) / allTrends.length || 0,
          lastUpdated: new Date().toISOString()
        },
        topKeywords,
        trendingTopics,
        questions,
        painPoints,
        platformBreakdown: {
          reddit: redditTrends,
          linkedin: linkedinTrends,
          google: googleTrends
        }
      };
    } catch (error) {
      console.error('Error fetching comprehensive trends:', error);
      throw error;
    }
  }

  // Identify top performing keywords
  identifyTopKeywords(trends) {
    const keywordScores = {};
    
    trends.forEach(trend => {
      const score = trend.avgEngagement * trend.totalPosts;
      if (keywordScores[trend.keyword]) {
        keywordScores[trend.keyword] += score;
      } else {
        keywordScores[trend.keyword] = score;
      }
    });

    return Object.entries(keywordScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, score]) => ({ keyword, score: Math.round(score) }));
  }

  // Identify trending topics from post titles and snippets
  identifyTrendingTopics(trends) {
    const topics = [];
    
    trends.forEach(trend => {
      trend.posts.forEach(post => {
        if (post.engagement > 20) { // Only high-engagement posts
          topics.push({
            title: post.title,
            snippet: post.snippet,
            source: post.source,
            engagement: post.engagement,
            link: post.link,
            keywords: post.keywords
          });
        }
      });
    });

    return topics.sort((a, b) => b.engagement - a.engagement).slice(0, 15);
  }

  // Extract questions from post titles and snippets
  extractQuestions(trends) {
    const questions = [];
    
    trends.forEach(trend => {
      trend.posts.forEach(post => {
        const text = `${post.title} ${post.snippet}`;
        const questionMatches = text.match(/[^.!]*\?[^.!]*/g);
        
        if (questionMatches) {
          questionMatches.forEach(question => {
            const cleanQuestion = question.trim();
            if (cleanQuestion.length > 10 && cleanQuestion.length < 200) {
              questions.push({
                question: cleanQuestion,
                source: post.source,
                link: post.link,
                keywords: post.keywords
              });
            }
          });
        }
      });
    });

    return questions.slice(0, 10);
  }

  // Identify pain points from discussions
  identifyPainPoints(trends) {
    const painKeywords = ['problem', 'issue', 'difficult', 'hard', 'struggle', 'challenge', 'pain', 'frustrating', 'expensive', 'slow'];
    const painPoints = [];
    
    trends.forEach(trend => {
      trend.posts.forEach(post => {
        const text = `${post.title} ${post.snippet}`.toLowerCase();
        const foundPainWords = painKeywords.filter(word => text.includes(word));
        
        if (foundPainWords.length > 0) {
          painPoints.push({
            title: post.title,
            snippet: post.snippet.substring(0, 150) + '...',
            source: post.source,
            link: post.link,
            painIndicators: foundPainWords,
            keywords: post.keywords
          });
        }
      });
    });

    return painPoints
      .sort((a, b) => b.painIndicators.length - a.painIndicators.length)
      .slice(0, 10);
  }
}

export default TrendAnalysisService;