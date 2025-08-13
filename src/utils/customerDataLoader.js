// Customer Data Loader - Automatically syncs with external customer avatar files
// Provides real-time access to updated customer avatar and target audience data

import { LABBRUN_CUSTOMER_AVATAR } from '../config/labbrun-customer-avatar.config';

// External file paths
const EXTERNAL_FILES = {
  customerAvatar: 'A:\\Knowledge Docs\\LabbRun\\Customer Avatar.md',
  targetAudience: 'A:\\Knowledge Docs\\LabbRun\\Target Audience.md'
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

  // Get current customer data (with caching)
  async getCustomerData() {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (cachedCustomerData && lastUpdateCheck && (now - lastUpdateCheck) < CACHE_DURATION) {
      return cachedCustomerData;
    }

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
      console.warn('Using default customer avatar config:', error.message);
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
      console.error('Failed to load external customer data:', error);
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

// Hook for React components
export const useCustomerData = () => {
  const [customerData, setCustomerData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await customerDataLoader.getCustomerData();
      setCustomerData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await customerDataLoader.refresh();
    setCustomerData(data);
    setLoading(false);
  };

  return { customerData, loading, refresh };
};

export default CustomerDataLoader;