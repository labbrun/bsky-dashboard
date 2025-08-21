// Customer Data Loader - Now deprecated, replaced by universal AI guidance system
// Legacy file maintained for backward compatibility
// Use aiContextProvider.js and aiGuidanceLoader.js for all customer data

import { getAIContext } from '../services/aiContextProvider';
import logger from '../services/loggingService';

// DEPRECATED: External files now handled by universal AI guidance system
// Customer data is loaded from public/ai-guidance/ directory
const DEPRECATED_EXTERNAL_FILES = {
  customerAvatar: 'Now loaded via aiGuidanceLoader.js',
  targetAudience: 'Now loaded via aiGuidanceLoader.js'
};

// Local cache
let cachedCustomerData = null;
let lastUpdateCheck = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class CustomerDataLoader {
  constructor() {
    this.isLoading = false;
    this.lastModified = {};
  }

  // Get current customer data (now uses universal AI guidance)
  async getCustomerData() {
    logger.warn('CustomerDataLoader is deprecated. Use aiContextProvider.getAIContext() instead.');
    
    try {
      // Redirect to new universal AI context
      const aiContext = await getAIContext();
      
      // Transform to legacy format for backward compatibility
      return {
        customerAvatar: aiContext.customerAvatar,
        targetAudience: aiContext.customerAvatar, // Same data in new system
        brandVoice: aiContext.brandVoice,
        contentStrategies: aiContext.contentStrategies,
        lastUpdated: aiContext.loadedAt,
        source: 'universal-ai-guidance'
      };
    } catch (error) {
      logger.error('Failed to load customer data from universal AI guidance:', error);
      return this.getDefaultCustomerData();
    }
  }
  
  // Fallback default data
  getDefaultCustomerData() {
    return {
      customerAvatar: {
        demographics: 'Tech-savvy professionals, entrepreneurs',
        interests: ['Privacy', 'Security', 'Productivity', 'Self-hosting'],
        painPoints: ['Information overload', 'Budget constraints'],
        goals: ['Better privacy', 'Increased productivity']
      },
      source: 'default-fallback'
    };

    // Check if files need updating
    try {
      const needsUpdate = await this.checkForUpdates();
      
      if (needsUpdate || !cachedCustomerData) {
        await this.loadFromExternalFiles();
      }
      
      lastUpdateCheck = now;
      return cachedCustomerData || LABBRUN_CUSTOMER_AVATAR;
      
    } catch (error) {
      // Fallback to default config if external files can't be accessed
      logger.warn('Using default customer avatar config', { error: error.message });
      return LABBRUN_CUSTOMER_AVATAR;
    }
  }

  // Check if external files have been modified
  async checkForUpdates() {
    try {
      // In a real implementation, you would check file modification times
      // For now, we'll assume files may have changed every cache duration
      return !cachedCustomerData;
    } catch (error) {
      return false;
    }
  }

  // Load and parse external customer avatar files
  async loadFromExternalFiles() {
    this.isLoading = true;
    
    try {
      // In a browser environment, we can't directly read files from the file system
      // This would need to be implemented with:
      // 1. File upload interface
      // 2. API endpoint that reads the files
      // 3. Electron app with file system access
      // 4. Browser extension with file access permissions
      
      // For now, we'll use the imported config but provide the structure
      // for future implementation
      
      cachedCustomerData = LABBRUN_CUSTOMER_AVATAR;
      
      // Future implementation would:
      // 1. Read the markdown files
      // 2. Parse them into structured data
      // 3. Update the cached configuration
      
    } catch (error) {
      logger.error('Failed to load external customer data', { error: error.message, stack: error.stack });
      cachedCustomerData = LABBRUN_CUSTOMER_AVATAR;
    } finally {
      this.isLoading = false;
    }
  }

  // Manual refresh method
  async refresh() {
    cachedCustomerData = null;
    lastUpdateCheck = null;
    return this.getCustomerData();
  }

  // Parse markdown content into structured data (for future use)
  parseCustomerAvatarMarkdown(content) {
    // This would parse the markdown file and extract:
    // - Demographics
    // - Goals & aspirations  
    // - Pain points
    // - Values & motivations
    // - Buying behaviors
    // etc.
    
    const parsed = {
      id: 'external-avatar',
      name: 'Updated Customer Avatar',
      // ... would extract from markdown content
    };
    
    return parsed;
  }

  // Get AI context based on current customer data
  async getAIContext() {
    const customerData = await this.getCustomerData();
    
    return {
      baseContext: this.buildBaseContext(customerData),
      contentGuidelines: this.buildContentGuidelines(customerData),
      insightPrompts: this.buildInsightPrompts(customerData)
    };
  }

  buildBaseContext(customerData) {
    const avatar = customerData.primaryAvatar;
    
    return `
You are an AI insights assistant for LabbRun, analyzing social media performance for a ${avatar.role}.

Primary Customer Avatar: ${avatar.name} - ${avatar.description}

Key Demographics:
- Age: ${avatar.demographics.age} (range: ${avatar.demographics.ageRange})
- Income: ${avatar.demographics.income}
- Location: ${avatar.demographics.location}
- Education: ${avatar.demographics.education}

Core Values: ${avatar.values.join(', ')}

Primary Goals:
${avatar.goals.shortTerm.map(goal => `- ${goal}`).join('\n')}

Key Pain Points:
${avatar.painPoints.map(point => `- ${point}`).join('\n')}

Quote: "${avatar.quote}"
    `;
  }

  buildContentGuidelines(customerData) {
    const strategy = customerData.contentStrategy;
    
    return `
Content Strategy Guidelines:

Primary Themes:
${strategy.themes.map(theme => `- ${theme}`).join('\n')}

Communication Style:
- Tone: ${strategy.communicationStyle.tone}
- Voice: ${strategy.communicationStyle.voice}  
- Language: ${strategy.communicationStyle.language}
- Focus: ${strategy.communicationStyle.focus}

For Bluesky Platform:
${Object.entries(customerData.blueskyStrategy.contentMix).map(([type, percentage]) => `- ${type}: ${percentage}`).join('\n')}

Key Topics: ${customerData.blueskyStrategy.keyTopics.join(', ')}
    `;
  }

  buildInsightPrompts(customerData) {
    return {
      contentStrategy: `Generate insights for content that helps ${customerData.primaryAvatar.name} achieve cost savings, privacy, and technical autonomy through self-hosting and home lab projects.`,
      audienceGrowth: `Focus on attracting ${customerData.targetAudience.primary} who value ${customerData.targetAudience.coreValues.join(', ')}.`,
      engagement: `Optimize for meaningful interactions that provide practical value and build community among ${customerData.targetAudience.primary}.`
    };
  }
}

// Singleton instance
export const customerDataLoader = new CustomerDataLoader();

// Utility functions
export const getCurrentCustomerAvatar = () => customerDataLoader.getCustomerData();
export const refreshCustomerData = () => customerDataLoader.refresh();
export const getAIContext = () => customerDataLoader.getAIContext();

// Note: React hooks moved to components that use them directly
// This eliminates the import dependency issue

export default CustomerDataLoader;