// AI Guidance Loader Service
// Loads and processes all AI guidance content for universal use across the app
// This service makes brand assets, content strategies, and marketing psychology
// available to ALL AI functions throughout the application

// Cache for loaded guidance content
let guidanceCache = {};
let isLoading = false;

// Load all guidance files and cache them
export const loadAllGuidance = async () => {
  if (Object.keys(guidanceCache).length > 0) {
    return guidanceCache; // Return cached data
  }

  if (isLoading) {
    // Wait for current loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return guidanceCache;
  }

  isLoading = true;

  try {
    // Load all markdown files from the uploaded guidance
    guidanceCache = {
      brandAssets: await loadBrandAssets(),
      contentStrategies: await loadContentStrategies(),
      marketingPsychology: await loadMarketingPsychology(),
      examples: await loadExamples()
    };

    console.log('AI Guidance loaded successfully:', {
      brandAssets: Object.keys(guidanceCache.brandAssets).length,
      contentStrategies: Object.keys(guidanceCache.contentStrategies).length,
      marketingPsychology: Object.keys(guidanceCache.marketingPsychology).length
    });

    return guidanceCache;
  } catch (error) {
    console.error('Error loading AI guidance:', error);
    return getDefaultGuidance();
  } finally {
    isLoading = false;
  }
};

// Load brand assets (voice, audience, customer avatar)
const loadBrandAssets = async () => {
  try {
    const [customerAvatarContent, targetAudienceContent] = await Promise.all([
      loadMarkdownFile('/src/data/ai-guidance/brand-assets/custom-avatar.md'),
      loadMarkdownFile('/src/data/ai-guidance/brand-assets/target-audience.md')
    ]);

    return {
      customerAvatar: {
        rawContent: customerAvatarContent,
        // Parse structured data from markdown content
        parsed: parseCustomerAvatar(customerAvatarContent)
      },
      targetAudience: {
        rawContent: targetAudienceContent,
        parsed: parseTargetAudience(targetAudienceContent)
      }
    };
  } catch (error) {
    console.warn('Could not load brand assets, using defaults:', error.message);
    return getDefaultBrandAssets();
  }
};

// Load content strategies
const loadContentStrategies = async () => {
  try {
    const [blueskyStrategies, calendarStrategies, repurposingStrategies, hooksContent] = await Promise.all([
      loadMarkdownFile('/src/data/ai-guidance/content-strategies/bluesky-copywriting-strategies.md'),
      loadMarkdownFile('/src/data/ai-guidance/content-strategies/content-calendar-strategies.md'),
      loadMarkdownFile('/src/data/ai-guidance/content-strategies/content-repurposing-strategies.md'),
      loadMarkdownFile('/src/data/ai-guidance/content-strategies/hooks-and-openers.md')
    ]);

    return {
      blueskyStrategies: {
        rawContent: blueskyStrategies,
        parsed: parseBlueskyStrategies(blueskyStrategies)
      },
      calendarStrategies: {
        rawContent: calendarStrategies,
        parsed: parseCalendarStrategies(calendarStrategies)
      },
      repurposingStrategies: {
        rawContent: repurposingStrategies,
        parsed: parseRepurposingStrategies(repurposingStrategies)
      },
      hooksAndOpeners: {
        rawContent: hooksContent,
        parsed: parseHooksContent(hooksContent)
      }
    };
  } catch (error) {
    console.warn('Could not load content strategies, using defaults:', error.message);
    return getDefaultContentStrategies();
  }
};

// Load marketing psychology guidance
const loadMarketingPsychology = async () => {
  try {
    const [psychologyContent, persuasionContent, viralHooksContent] = await Promise.all([
      loadMarkdownFile('/src/data/ai-guidance/marketing-psychology/marketing-psychology.md'),
      loadMarkdownFile('/src/data/ai-guidance/marketing-psychology/persuation-techniques.md'),
      loadMarkdownFile('/src/data/ai-guidance/marketing-psychology/viral-hook-strategies.md')
    ]);

    return {
      marketingPsychology: {
        rawContent: psychologyContent,
        parsed: parseMarketingPsychology(psychologyContent)
      },
      persuasionTechniques: {
        rawContent: persuasionContent,
        parsed: parsePersuasionTechniques(persuasionContent)
      },
      viralHookStrategies: {
        rawContent: viralHooksContent,
        parsed: parseViralHooks(viralHooksContent)
      }
    };
  } catch (error) {
    console.warn('Could not load marketing psychology, using defaults:', error.message);
    return getDefaultMarketingPsychology();
  }
};

// Load successful examples
const loadExamples = async () => {
  return {
    highPerformingPosts: [],
    threadTemplates: []
  };
};

// Load markdown file content
const loadMarkdownFile = async (filePath) => {
  try {
    // In a React app, we need to fetch the files from the public directory
    // Move files to public/ai-guidance/ for direct fetching
    const publicPath = filePath.replace('/src/data/ai-guidance/', '/ai-guidance/');
    const response = await fetch(publicPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.warn(`Could not load markdown file ${filePath}:`, error.message);
    return '';
  }
};

// Parse customer avatar markdown content
const parseCustomerAvatar = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    // Extract key sections for AI use
    demographics: extractSection(content, 'demographics', 'target audience characteristics'),
    interests: extractListItems(content, 'interests', 'topics', 'focus areas'),
    painPoints: extractListItems(content, 'pain points', 'challenges', 'problems'),
    goals: extractListItems(content, 'goals', 'objectives', 'desires'),
    contentPreferences: extractSection(content, 'content preferences', 'content types', 'preferred content')
  };
};

// Parse target audience markdown content  
const parseTargetAudience = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    blueskyAudience: extractSection(content, 'bluesky', 'bluesky audience'),
    characteristics: extractSection(content, 'characteristics', 'traits'),
    engagementPatterns: extractSection(content, 'engagement', 'interaction patterns'),
    contentPreferences: extractSection(content, 'preferences', 'preferred content types')
  };
};

// Parse Bluesky strategies
const parseBlueskyStrategies = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    postTypes: extractListItems(content, 'post types', 'content types'),
    timingStrategy: extractSection(content, 'timing', 'schedule', 'when to post'),
    engagementTactics: extractSection(content, 'engagement', 'interaction strategies'),
    hashtagStrategy: extractSection(content, 'hashtag', 'tags', '#')
  };
};

// Parse calendar strategies
const parseCalendarStrategies = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    frequency: extractSection(content, 'frequency', 'how often'),
    scheduling: extractSection(content, 'schedule', 'timing'),
    contentMix: extractSection(content, 'content mix', 'variety', 'content types')
  };
};

// Parse repurposing strategies  
const parseRepurposingStrategies = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    blogToSocial: extractSection(content, 'blog', 'repurposing', 'convert'),
    strategies: extractListItems(content, 'strategies', 'methods', 'approaches'),
    timeline: extractSection(content, 'timeline', 'schedule', 'when')
  };
};

// Parse hooks content
const parseHooksContent = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    hookTypes: extractListItems(content, 'hook', 'opener', 'opening'),
    examples: extractListItems(content, 'example', 'template'),
    guidelines: extractListItems(content, 'guideline', 'rule', 'best practice')
  };
};

// Parse marketing psychology
const parseMarketingPsychology = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    principles: extractListItems(content, 'principle', 'psychology', 'trigger'),
    applications: extractSection(content, 'application', 'how to use', 'implementation')
  };
};

// Parse persuasion techniques
const parsePersuasionTechniques = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    techniques: extractListItems(content, 'technique', 'method', 'approach'),
    examples: extractListItems(content, 'example', 'case study')
  };
};

// Parse viral hooks
const parseViralHooks = (content) => {
  if (!content) return {};
  
  return {
    fullContent: content,
    viralHooks: extractListItems(content, 'hook', 'viral', 'attention'),
    templates: extractListItems(content, 'template', 'format', 'structure')
  };
};

// Utility: Extract section content based on keywords
const extractSection = (content, ...keywords) => {
  const lines = content.toLowerCase().split('\n');
  const relevantLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains any of the keywords
    const hasKeyword = keywords.some(keyword => 
      line.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      // Include this line and next few lines as context
      relevantLines.push(lines[i]);
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].trim() && !lines[j].startsWith('#')) {
          relevantLines.push(lines[j]);
        } else if (lines[j].startsWith('#')) {
          break; // Stop at next heading
        }
      }
      break;
    }
  }
  
  return relevantLines.join('\n').trim();
};

// Utility: Extract list items based on keywords
const extractListItems = (content, ...keywords) => {
  const lines = content.split('\n');
  const items = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // Look for markdown list items (-, *, +, numbers)
    if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/)) {
      const hasKeyword = keywords.some(keyword => 
        trimmed.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (hasKeyword || keywords.length === 0) {
        items.push(trimmed.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, ''));
      }
    }
  });
  
  return items;
};

// Get default guidance when files can't be loaded
const getDefaultGuidance = () => {
  return {
    brandAssets: getDefaultBrandAssets(),
    contentStrategies: getDefaultContentStrategies(),
    marketingPsychology: getDefaultMarketingPsychology(),
    examples: { highPerformingPosts: [] }
  };
};

// Default brand assets
const getDefaultBrandAssets = () => ({
  customerAvatar: {
    rawContent: '',
    parsed: {
      demographics: 'Tech-savvy professionals, developers, privacy advocates',
      interests: ['Privacy', 'Security', 'AI', 'Productivity', 'Self-hosting'],
      painPoints: ['Privacy concerns', 'Information overload', 'Complex tools'],
      goals: ['Better privacy', 'Increased productivity', 'Technical knowledge'],
      contentPreferences: 'Technical tutorials, privacy insights, practical guides'
    }
  },
  targetAudience: {
    rawContent: '',
    parsed: {
      blueskyAudience: 'Early adopters, privacy-focused, tech enthusiasts',
      characteristics: 'Values decentralization and open-source solutions',
      engagementPatterns: 'Thoughtful discussions, technical questions',
      contentPreferences: 'In-depth technical content, privacy-focused posts'
    }
  }
});

// Default content strategies  
const getDefaultContentStrategies = () => ({
  blueskyStrategies: {
    rawContent: '',
    parsed: {
      postTypes: ['Insight posts', 'Tutorial threads', 'Question posts'],
      timingStrategy: 'Post during peak hours: 9-11 AM, 1-3 PM, 7-9 PM EST',
      engagementTactics: 'Ask questions, share experiences, provide value',
      hashtagStrategy: 'Use 2-3 relevant hashtags, focus on niche topics'
    }
  },
  repurposingStrategies: {
    rawContent: '',
    parsed: {
      blogToSocial: 'Extract key insights, create threads, share behind-scenes',
      strategies: ['Key insight extraction', 'Thread creation', 'Q&A posts'],
      timeline: 'Immediate announcement, follow-up insights over 3-5 days'
    }
  }
});

// Default marketing psychology
const getDefaultMarketingPsychology = () => ({
  marketingPsychology: {
    rawContent: '',
    parsed: {
      principles: ['Social proof', 'Authority', 'Scarcity', 'Reciprocity'],
      applications: 'Use community examples, share expertise, create urgency'
    }
  },
  viralHookStrategies: {
    rawContent: '',
    parsed: {
      viralHooks: ['Question hooks', 'Contrarian takes', 'Story openers'],
      templates: ['What if...', 'Unpopular opinion:', 'Just discovered...']
    }
  }
});

// Get specific guidance category
export const getGuidance = async (category) => {
  const allGuidance = await loadAllGuidance();
  return allGuidance[category] || {};
};

// Get brand voice guidelines
export const getBrandVoice = async () => {
  const guidance = await getGuidance('brandAssets');
  return guidance.brandVoice || {};
};

// Get customer avatar information
export const getCustomerAvatar = async () => {
  const guidance = await getGuidance('brandAssets');
  return guidance.customerAvatar || {};
};

// Get Bluesky-specific strategies
export const getBlueskyStrategies = async () => {
  const guidance = await getGuidance('contentStrategies');
  return guidance.blueskyStrategies || {};
};

// Get marketing psychology principles
export const getMarketingPsychology = async () => {
  const guidance = await getGuidance('marketingPsychology');
  return guidance.psychologyPrinciples || [];
};

// Get hook strategies
export const getHookStrategies = async () => {
  const guidance = await getGuidance('marketingPsychology');
  return guidance.hooks || {};
};

// Refresh guidance cache (call when guidance files are updated)
export const refreshGuidanceCache = () => {
  guidanceCache = {};
  return loadAllGuidance();
};

const aiGuidanceLoader = {
  loadAllGuidance,
  getGuidance,
  getBrandVoice,
  getCustomerAvatar,
  getBlueskyStrategies,
  getMarketingPsychology,
  getHookStrategies,
  refreshGuidanceCache
};

export default aiGuidanceLoader;