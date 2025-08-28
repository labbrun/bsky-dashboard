// Postiz API Integration Service
// Handles scheduling posts, fetching scheduled content, and managing integrations

class PostizService {
  constructor() {
    // Use environment variables or fallback to your specific installation
    this.baseURL = process.env.REACT_APP_POSTIZ_URL || 'https://postiz.dedsec.one';
    this.publicAPIURL = process.env.REACT_APP_POSTIZ_URL ? `${process.env.REACT_APP_POSTIZ_URL}/public/v1` : 'https://postiz.dedsec.one/public/v1';
    this.apiKey = process.env.REACT_APP_POSTIZ_API_KEY || 'dba3ffea31eb752494363c171eba10419237e46c484eadafd84b240d9bce53b6';
    this.rateLimitRemaining = 30; // Postiz allows 30 requests per hour
    this.rateLimitReset = null;
  }

  // Set API key (should be called during app initialization)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Check if API is configured
  isConfigured() {
    return !!this.apiKey;
  }

  // Make authenticated request to Postiz API
  async makeRequest(endpoint, options = {}) {
    if (!this.apiKey) {
      throw new Error('Postiz API key not configured. Please set your API key in settings.');
    }

    const url = `${this.publicAPIURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Update rate limit info
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '30');
      this.rateLimitReset = response.headers.get('X-RateLimit-Reset');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Postiz API Error (${response.status}): ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Postiz API request failed:', error);
      throw error;
    }
  }

  // Get all scheduled and published posts
  async getPosts(startDate = null, endDate = null) {
    try {
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate instanceof Date ? startDate.toISOString() : startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate instanceof Date ? endDate.toISOString() : endDate);
      }

      const endpoint = `/posts${params.toString() ? '?' + params.toString() : ''}`;
      const response = await this.makeRequest(endpoint);
      
      return {
        success: true,
        posts: response.data || [],
        pagination: response.pagination || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        posts: []
      };
    }
  }

  // Get connected social media integrations/channels
  async getIntegrations() {
    try {
      const response = await this.makeRequest('/integrations');
      
      // Filter for Bluesky integrations since this is a Bluesky analytics app
      const blueskyIntegrations = response.data?.filter(integration => 
        integration.provider === 'bluesky' || integration.name.toLowerCase().includes('bluesky')
      ) || [];

      return {
        success: true,
        integrations: response.data || [],
        blueskyIntegrations,
        hasBluesky: blueskyIntegrations.length > 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        integrations: [],
        blueskyIntegrations: [],
        hasBluesky: false
      };
    }
  }

  // Schedule a new post
  async schedulePost(postData) {
    try {
      const payload = {
        type: postData.scheduleType || 'schedule', // 'draft', 'schedule', or 'now'
        date: postData.scheduledDate || new Date().toISOString(),
        shortLink: postData.shortLink !== false, // Default to true
        tags: postData.tags || [],
        posts: postData.posts.map(post => ({
          integration: {
            id: post.integrationId
          },
          value: [{
            content: post.content,
            image: post.images || []
          }],
          group: post.group || '',
          settings: post.settings || {}
        }))
      };

      const response = await this.makeRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        post: response,
        message: 'Post scheduled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update an existing post
  async updatePost(postId, postData) {
    try {
      const payload = {
        type: postData.scheduleType || 'schedule',
        date: postData.scheduledDate || new Date().toISOString(),
        shortLink: postData.shortLink !== false,
        tags: postData.tags || [],
        posts: postData.posts.map(post => ({
          integration: {
            id: post.integrationId
          },
          value: [{
            content: post.content,
            image: post.images || []
          }],
          group: post.group || '',
          settings: post.settings || {}
        }))
      };

      const response = await this.makeRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        post: response,
        message: 'Post updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete a scheduled post
  async deletePost(postId) {
    try {
      await this.makeRequest(`/posts/${postId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Post deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload media file
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}/public/v1/files`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        file: result,
        url: result.path
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get rate limit status
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
      isLimited: this.rateLimitRemaining <= 0
    };
  }

  // Generate post for Bluesky with content optimization
  generateOptimizedPost(content, options = {}) {
    const {
      maxLength = 300, // Bluesky character limit
      includeHashtags = true
    } = options;

    let optimizedContent = content;

    // Trim content if too long
    if (optimizedContent.length > maxLength) {
      optimizedContent = optimizedContent.substring(0, maxLength - 3) + '...';
    }

    // Add appropriate hashtags based on content analysis
    if (includeHashtags) {
      const hashtags = this.generateRelevantHashtags(content);
      if (hashtags.length > 0 && (optimizedContent.length + hashtags.join(' ').length + 1) <= maxLength) {
        optimizedContent += ' ' + hashtags.join(' ');
      }
    }

    return {
      content: optimizedContent,
      characterCount: optimizedContent.length,
      isWithinLimit: optimizedContent.length <= maxLength,
      suggestedHashtags: this.generateRelevantHashtags(content),
      estimatedEngagement: this.estimateEngagement(optimizedContent)
    };
  }

  // Generate relevant hashtags based on content
  generateRelevantHashtags(content) {
    const contentLower = content.toLowerCase();
    const hashtags = [];

    // Technical hashtags
    if (contentLower.includes('homelab') || contentLower.includes('self-host')) {
      hashtags.push('#homelab');
    }
    if (contentLower.includes('privacy') || contentLower.includes('security')) {
      hashtags.push('#privacy');
    }
    if (contentLower.includes('automation') || contentLower.includes('devops')) {
      hashtags.push('#automation');
    }
    if (contentLower.includes('ai') || contentLower.includes('artificial intelligence')) {
      hashtags.push('#ai');
    }
    if (contentLower.includes('tech') || contentLower.includes('technology')) {
      hashtags.push('#tech');
    }

    // Business hashtags
    if (contentLower.includes('business') || contentLower.includes('entrepreneur')) {
      hashtags.push('#business');
    }
    if (contentLower.includes('productivity')) {
      hashtags.push('#productivity');
    }

    return hashtags.slice(0, 3); // Limit to 3 hashtags
  }

  // Estimate engagement potential based on content analysis
  estimateEngagement(content) {
    let score = 50; // Base score

    // Positive factors
    if (content.includes('?')) score += 15; // Questions boost engagement
    if (content.includes('!')) score += 10; // Excitement
    if (content.match(/#\w+/g)) score += 10; // Has hashtags
    if (content.length > 100 && content.length < 250) score += 15; // Optimal length
    if (content.includes('tip') || content.includes('guide')) score += 20; // Educational
    if (content.includes('new') || content.includes('update')) score += 10; // Timely

    // Negative factors
    if (content.length < 50) score -= 20; // Too short
    if (content.length > 280) score -= 15; // Too long
    if (!content.match(/[.!?]/)) score -= 10; // No punctuation

    return Math.max(0, Math.min(100, score));
  }

  // Smart scheduling interface - tries API first, falls back to web interface
  async openScheduleInterface(content, platform = 'bluesky', options = {}) {
    try {
      // Option 1: Try to get integrations and create post directly via API
      const integrationsResult = await this.getIntegrations();
      
      if (integrationsResult.success && integrationsResult.hasBluesky) {
        // Found Bluesky integration, try to create a draft post
        const blueskyIntegration = integrationsResult.blueskyIntegrations[0];
        
        const postData = {
          scheduleType: 'draft', // Create as draft so user can review/schedule
          posts: [{
            integrationId: blueskyIntegration.id,
            content: content,
            images: [],
            settings: {}
          }]
        };
        
        console.log('Creating draft post via API:', postData);
        const createResult = await this.schedulePost(postData);
        
        if (createResult.success) {
          // Success! Open the launches page to show the created draft
          window.open(`${this.baseURL}/launches`, '_blank');
          
          // Show success message
          const message = `✅ Draft post created successfully!\n\nContent: "${content}"\n\nOpening Postiz to review and schedule...`;
          alert(message);
          return;
        } else {
          console.warn('API post creation failed, falling back to web interface:', createResult.error);
        }
      }
      
      // Option 2: Fallback to web interface with smart session handling
      this.openWebInterface(content, platform);
      
    } catch (error) {
      console.error('Error with smart scheduling:', error);
      // Fallback to web interface
      this.openWebInterface(content, platform);
    }
  }

  // Open web interface (preserves session cookies)
  openWebInterface(content, platform = 'bluesky') {
    try {
      const launchesUrl = `${this.baseURL}/launches`;
      
      // Copy content to clipboard for easy pasting
      if (navigator.clipboard && content) {
        navigator.clipboard.writeText(content).then(() => {
          console.log('Content copied to clipboard for pasting');
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
        });
      }
      
      // Open in new tab - this should work once pop-ups are allowed
      console.log('Opening Postiz in new tab:', launchesUrl);
      const newWindow = window.open(launchesUrl, '_blank', 'noopener,noreferrer');
      
      // Always show the helpful message since clipboard copying happens regardless
      setTimeout(() => {
        const message = `📋 Content copied to clipboard!\n\n"${content}"\n\nPaste it into Postiz when the page loads.`;
        alert(message);
      }, 100);
      
    } catch (error) {
      console.error('Error opening web interface:', error);
      alert(`Please visit: ${this.baseURL}/launches\n\nContent to schedule: "${content}"`);
    }
  }
}

// Create singleton instance
const postizService = new PostizService();

export default postizService;

// Named exports for specific functions
export {
  PostizService
};