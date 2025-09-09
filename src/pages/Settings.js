import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle, HelpCircle, Loader, Shield } from 'lucide-react';
import { Card, Button } from '../components/ui/UntitledUIComponents';
import { APP_CONFIG } from '../config/app.config';
import { 
  getCredentials, 
  saveCredentials, 
  validateServiceCredentials, 
  getEffectiveConfig,
  getConfigurationStatus
} from '../services/credentialsService';

const API_GUIDES = {
  bluesky: {
    title: 'Bluesky Account',
    description: 'Your Bluesky profile handle and app password for authentication',
    fields: [
      {
        key: 'handle',
        label: 'Bluesky Handle',
        type: 'text',
        placeholder: 'your-username.bsky.social or yourname.com',
        required: true,
        help: 'Your Bluesky handle (supports custom domains like yourname.com or standard username.bsky.social)'
      },
      {
        key: 'appPassword',
        label: 'App Password',
        type: 'password',
        placeholder: 'xxxx-xxxx-xxxx-xxxx',
        required: true,
        help: 'Generate this in Bluesky Settings → Privacy and Security → App Passwords'
      }
    ],
    setupGuide: {
      title: 'How to get Bluesky App Password:',
      steps: [
        'Open Bluesky app or web interface',
        'Go to Settings → Privacy and Security',
        'Scroll to "App Passwords" section',
        'Click "Add App Password"',
        'Give it a name (e.g., "Analytics Dashboard")',
        'Copy the generated password'
      ],
      link: 'https://bsky.app/settings/privacy-security',
      linkText: 'Open Bluesky Settings'
    }
  },

  database: {
    title: 'Database (Supabase)',
    description: 'Connect a database for historical data storage and settings persistence',
    fields: [
      {
        key: 'supabaseUrl',
        label: 'Supabase URL',
        type: 'text',
        placeholder: 'https://your-project.supabase.co',
        required: false,
        help: 'Your Supabase project URL'
      },
      {
        key: 'supabaseAnonKey',
        label: 'Supabase Anon Key',
        type: 'password',
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false,
        help: 'Your Supabase anonymous (public) key'
      }
    ],
    setupGuide: {
      title: 'How to set up Supabase database:',
      steps: [
        'Go to supabase.com and create a free account',
        'Create a new project',
        'Go to Settings → API',
        'Copy your "Project URL"',
        'Copy your "anon public" key',
        'Paste both values in the form above',
        'Save settings to enable database features'
      ],
      link: 'https://supabase.com/dashboard',
      linkText: 'Open Supabase Dashboard',
      note: 'Database is optional - app works locally without it, but you\'ll lose historical data on refresh'
    }
  },
  
  ai: {
    title: 'AI API',
    description: 'AI service for generating insights and content analysis',
    fields: [
      {
        key: 'provider',
        label: 'AI Provider',
        type: 'select',
        options: [
          { value: 'openai', label: 'OpenAI (ChatGPT)' },
          { value: 'anthropic', label: 'Anthropic (Claude)' },
          { value: 'perplexity', label: 'Perplexity AI' },
          { value: 'local', label: 'Local AI (Ollama/LM Studio)' },
          { value: 'custom', label: 'Custom API' }
        ],
        required: false
      },
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-...',
        required: false,
        help: 'Your AI service API key'
      },
      {
        key: 'baseUrl',
        label: 'Base URL (for local/custom)',
        type: 'text',
        placeholder: 'http://localhost:11434/v1',
        required: false,
        help: 'Only needed for local AI or custom endpoints'
      }
    ],
    setupGuide: {
      title: 'AI API Setup Options:',
      steps: [
        'OpenAI: Get API key from platform.openai.com',
        'Anthropic: Get API key from console.anthropic.com', 
        'Perplexity: Get API key from perplexity.ai/settings/api',
        'Local AI: Install Ollama or LM Studio locally',
        'Leave blank to disable AI features'
      ],
      links: [
        { url: 'https://platform.openai.com/api-keys', text: 'OpenAI API Keys' },
        { url: 'https://console.anthropic.com/', text: 'Anthropic Console' },
        { url: 'https://www.perplexity.ai/settings/api', text: 'Perplexity API' }
      ]
    }
  },

  google: {
    title: 'Google Services',
    description: 'Google Custom Search for trend analysis and content discovery',
    fields: [
      {
        key: 'customSearchApiKey',
        label: 'Custom Search API Key',
        type: 'password',
        placeholder: 'AIza...',
        required: false,
        help: 'Google Custom Search JSON API key'
      },
      {
        key: 'searchEngineId',
        label: 'Search Engine ID',
        type: 'text',
        placeholder: '017576662512468239146:omuauf_lfve',
        required: false,
        help: 'Your Custom Search Engine ID (cx parameter)'
      }
    ],
    setupGuide: {
      title: 'Google Custom Search Setup:',
      steps: [
        'Go to Google Cloud Console',
        'Enable Custom Search JSON API',
        'Create API credentials (API Key)',
        'Go to Custom Search Engine control panel',
        'Create a new search engine or use existing',
        'Copy the Search Engine ID (cx parameter)'
      ],
      links: [
        { url: 'https://console.cloud.google.com/apis/library/customsearch.googleapis.com', text: 'Enable Custom Search API' },
        { url: 'https://cse.google.com/cse/', text: 'Custom Search Engine' }
      ]
    }
  },

  linkedin: {
    title: 'LinkedIn Integration',
    description: 'LinkedIn API for cross-platform analytics and content sharing',
    fields: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        placeholder: '78...',
        required: false,
        help: 'LinkedIn App Client ID'
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'WPL_AP1...',
        required: false,
        help: 'LinkedIn App Client Secret'
      }
    ],
    setupGuide: {
      title: 'LinkedIn API Setup:',
      steps: [
        'Go to LinkedIn Developer Portal',
        'Create a new app',
        'Add your website URL as redirect URI',
        'Request access to required APIs',
        'Copy Client ID and Client Secret'
      ],
      link: 'https://developer.linkedin.com/apps',
      linkText: 'LinkedIn Developer Portal'
    }
  },

  blog: {
    title: 'Blog RSS Feed',
    description: 'RSS feed from your blog for content analytics integration',
    fields: [
      {
        key: 'rssUrl',
        label: 'RSS Feed URL',
        type: 'text',
        placeholder: 'https://yourblog.com/rss',
        required: false,
        help: 'Full URL to your blog\'s RSS feed'
      },
      {
        key: 'blogUrl',
        label: 'Blog Website URL',
        type: 'text',
        placeholder: 'https://yourblog.com',
        required: false,
        help: 'Your blog\'s main website URL'
      }
    ],
    setupGuide: {
      title: 'Blog RSS Setup:',
      steps: [
        'Most blogs automatically generate RSS feeds',
        'WordPress: Usually at /feed or /rss',
        'Ghost: Usually at /rss/',
        'Medium: Usually at /@username/feed',
        'Custom blogs: Check your platform documentation'
      ],
      note: 'Common RSS URLs: /feed, /rss, /rss.xml, /atom.xml'
    }
  },

  postiz: {
    title: 'Postiz Integration',
    description: 'Social media scheduling and management platform integration',
    fields: [
      {
        key: 'url',
        label: 'Postiz Instance URL',
        type: 'text',
        placeholder: 'https://your-postiz.com',
        required: false,
        help: 'URL of your Postiz instance'
      },
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'ptiz_...',
        required: false,
        help: 'Your Postiz API key'
      }
    ],
    setupGuide: {
      title: 'Postiz Setup:',
      steps: [
        'Install Postiz on your server or use hosted version',
        'Go to Settings → API Keys',
        'Generate a new API key',
        'Copy both the instance URL and API key'
      ],
      links: [
        { url: 'https://postiz.com', text: 'Postiz Website' },
        { url: 'https://docs.postiz.com', text: 'Postiz Documentation' }
      ]
    }
  }
};

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = getCredentials();
      setSettings(saved);
      
      // Load configuration status
      const status = getConfigurationStatus();
      setValidationStatus(status);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const success = saveCredentials(settings);
      if (!success) {
        throw new Error('Failed to save credentials');
      }
      
      // Validate settings after saving
      await validateAllSettings();
      
      // Show success message
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsSaving(false);
    }
  };

  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (key) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateSettings = async (section) => {
    const sectionSettings = settings[section];
    if (!sectionSettings) return;

    setValidationStatus(prev => ({
      ...prev,
      [section]: { status: 'validating' }
    }));

    try {
      const result = await validateServiceCredentials(section, sectionSettings);
      
      setValidationStatus(prev => ({
        ...prev,
        [section]: {
          status: result.valid ? 'valid' : 'invalid',
          message: result.error || result.note || '',
          configured: result.valid
        }
      }));
      
    } catch (error) {
      setValidationStatus(prev => ({
        ...prev,
        [section]: {
          status: 'error',
          message: error.message,
          configured: false
        }
      }));
    }
  };

  const validateAllSettings = async () => {
    for (const section of Object.keys(API_GUIDES)) {
      await validateSettings(section);
    }
  };

  const renderValidationIcon = (section) => {
    const validation = validationStatus[section];
    if (!validation) return null;
    
    switch (validation.status || validation) {
      case 'validating':
        return <Loader className="w-4 h-4 animate-spin text-brand-500" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'invalid':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error-500" />;
      default:
        return null;
    }
  };

  const getValidationMessage = (section) => {
    const validation = validationStatus[section];
    return validation?.message || '';
  };

  const renderSetupGuide = (guide) => (
    <div className="mt-4 p-4 bg-primary-850 rounded-lg border border-gray-700">
      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
        <HelpCircle className="w-4 h-4" />
        {guide.title}
      </h4>
      <ol className="text-sm text-gray-300 space-y-1 mb-3">
        {guide.steps.map((step, idx) => (
          <li key={idx} className="flex">
            <span className="text-brand-400 mr-2">{idx + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {guide.note && (
        <p className="text-sm text-gray-300 italic mb-3">{guide.note}</p>
      )}
      {guide.links && (
        <div className="flex flex-wrap gap-2">
          {guide.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              {link.text} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}
      {guide.link && (
        <a
          href={guide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          {guide.linkText} <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-brand-500" />
          <h1 className="text-2xl font-bold text-gray-900">API Settings</h1>
        </div>
        <Button
          onClick={saveSettings}
          variant="primary"
          icon={isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="bg-primary-850 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">📋 Configuration Guide</h3>
        <p className="text-gray-300 text-sm">
          Configure the APIs you want to use below. All integrations are optional - the dashboard works with just your Bluesky credentials.
          Click on each section to expand setup instructions.
        </p>
      </div>

      {/* API Settings Sections */}
      {Object.entries(API_GUIDES).map(([section, guide]) => {
        const sectionSettings = settings[section] || {};
        const isExpanded = expandedSection === section;
        const hasSettings = Object.values(sectionSettings).some(value => value && value.length > 0);
        
        return (
          <Card key={section} className="border-gray-700">
            <div className="p-6">
              {/* Section Header */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedSection(isExpanded ? null : section)}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                  {renderValidationIcon(section)}
                  {hasSettings && !renderValidationIcon(section) && (
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {hasSettings && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        validateSettings(section);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Test Connection
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    {isExpanded ? 'Collapse' : 'Configure'}
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mt-2">{guide.description}</p>

              {/* Section Content */}
              {isExpanded && (
                <div className="mt-6 space-y-4">
                  {/* Validation Message */}
                  {getValidationMessage(section) && (
                    <div className={`p-3 rounded-lg border ${
                      validationStatus[section]?.status === 'valid' 
                        ? 'bg-success-900/20 border-success-600/30 text-success-300' 
                        : 'bg-error-900/20 border-error-600/30 text-error-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        {renderValidationIcon(section)}
                        <span className="text-sm">{getValidationMessage(section)}</span>
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guide.fields.map((field) => {
                      const fieldKey = `${section}-${field.key}`;
                      const value = sectionSettings[field.key] || '';
                      
                      return (
                        <div key={field.key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-900">
                            {field.label}
                            {field.required && <span className="text-error-500 ml-1">*</span>}
                          </label>
                          
                          {field.type === 'select' ? (
                            <select
                              value={value}
                              onChange={(e) => updateSetting(section, field.key, e.target.value)}
                              className="untitled-input w-full"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="relative">
                              <input
                                type={field.type === 'password' && !showPasswords[fieldKey] ? 'password' : 'text'}
                                value={value}
                                onChange={(e) => updateSetting(section, field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="untitled-input w-full"
                              />
                              {field.type === 'password' && (
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(fieldKey)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                  {showPasswords[fieldKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          )}
                          
                          {field.help && (
                            <p className="text-xs text-gray-600">{field.help}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Setup Guide */}
                  {renderSetupGuide(guide.setupGuide)}
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* Warning about dummy data */}
      <div className="bg-warning-900/20 border border-warning-600/30 rounded-lg p-4">
        <h3 className="font-semibold text-warning-400 mb-2">⚠️ No Dummy Data Policy</h3>
        <p className="text-gray-700 text-sm">
          This dashboard only displays real data from your configured APIs. If a feature shows "No data available" or similar messages, 
          it means the required API credentials are not configured. Follow the setup guides above to enable each feature.
        </p>
      </div>
    </div>
  );
};

export default Settings;