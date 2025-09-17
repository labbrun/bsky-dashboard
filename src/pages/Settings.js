import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle, HelpCircle, Loader, User, Target, Plus, X, Upload, Camera, FileText, Trash2 } from 'lucide-react';
import { Card, Button } from '../components/ui/UntitledUIComponents';
import {
  getCredentials,
  saveCredentials,
  validateServiceCredentials,
  getConfigurationStatus,
  getProfileSettings,
  saveProfileSettings,
  saveDocument,
  removeDocument,
  getAllDocuments
} from '../services/credentialsService';

const API_GUIDES = {
  bluesky: {
    title: 'Bluesky API Configuration',
    description: 'Configure your Bluesky access token for analytics data access',
    fields: [
      {
        key: 'accessToken',
        label: 'Bluesky Access Token',
        type: 'password',
        placeholder: 'eyJ0eXAiOiJKV1QiLCJhbGci...',
        required: true,
        help: 'Your Bluesky access token for API access. Get this from Bluesky developer console.'
      },
      {
        key: 'handle',
        label: 'Bluesky Handle',
        type: 'text',
        placeholder: 'your-username.bsky.social or yourname.com',
        required: true,
        help: 'Your Bluesky handle (supports custom domains like yourname.com or standard username.bsky.social)'
      },
      {
        key: 'apiEndpoint',
        label: 'API Endpoint (Optional)',
        type: 'text',
        placeholder: 'https://bsky.social/xrpc',
        required: false,
        help: 'Custom API endpoint (defaults to https://bsky.social/xrpc if not specified)'
      }
    ],
    setupGuide: {
      title: 'How to get Bluesky Access Token:',
      steps: [
        'Visit the Bluesky Developer Documentation',
        'Follow the authentication guide to create an access token',
        'Use your Bluesky handle and app password to generate the token',
        'Copy the access token (starts with "eyJ...")',
        'Paste it in the Access Token field above',
        'Enter your Bluesky handle in the Handle field'
      ],
      link: 'https://docs.bsky.app/docs/get-started',
      linkText: 'View Bluesky API Documentation'
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
        ],
        required: true,
        help: 'Choose your preferred AI service provider'
      },
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-... or your API key',
        required: false,
        help: 'Not required for local AI providers'
      },
      {
        key: 'baseUrl',
        label: 'Base URL (Local AI only)',
        type: 'text',
        placeholder: 'http://localhost:1234/v1',
        required: false,
        help: 'Base URL for local AI providers like Ollama or LM Studio'
      }
    ],
    setupGuide: {
      title: 'How to get AI API credentials:',
      steps: [
        'Choose your preferred AI provider',
        'For OpenAI: Go to platform.openai.com → API Keys',
        'For Anthropic: Go to console.anthropic.com → Get API Keys',
        'For Perplexity: Go to perplexity.ai → Settings → API',
        'For Local AI: Install Ollama or LM Studio and note the base URL',
        'Create an API key and paste it above',
        'Save settings to enable AI features'
      ],
      note: 'AI is optional - basic analytics work without it, but you\'ll miss AI insights and recommendations'
    }
  },

  googleTrends: {
    title: 'Google Trends API',
    description: 'Google Trends API for monitoring keyword trends and providing AI insights',
    fields: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        placeholder: '123456789-abc123.apps.googleusercontent.com',
        required: false,
        help: 'Google Trends API Client ID from Google Cloud Console'
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'GOCSPX-...',
        required: false,
        help: 'Google Trends API Client Secret for OAuth authentication'
      }
    ],
    setupGuide: {
      title: 'How to set up Google Trends API:',
      steps: [
        'Go to console.developers.google.com',
        'Create a new project or select existing one',
        'Enable "Google Trends API"',
        'Go to "Credentials" → Create OAuth 2.0 Client ID',
        'Set application type to "Web application"',
        'Add authorized redirect URIs for your domain',
        'Copy the Client ID and Client Secret',
        'Paste both values in the form above'
      ],
      link: 'https://console.developers.google.com',
      linkText: 'Google Cloud Console',
      note: 'Google Trends API monitors your configured keywords and provides trend data for AI analysis and recommendations'
    }
  },

  googleAnalytics: {
    title: 'Google Analytics API',
    description: 'Google Analytics API for blog performance analysis and traffic insights',
    fields: [
      {
        key: 'serviceAccountEmail',
        label: 'Service Account Email',
        type: 'text',
        placeholder: 'analytics-service@your-project.iam.gserviceaccount.com',
        required: false,
        help: 'Service account email from your Google Cloud Console'
      },
      {
        key: 'serviceAccountKey',
        label: 'Service Account Private Key',
        type: 'password',
        placeholder: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----',
        required: false,
        help: 'Private key from the service account JSON file'
      },
      {
        key: 'propertyId',
        label: 'GA4 Property ID',
        type: 'text',
        placeholder: '123456789',
        required: false,
        help: 'Your Google Analytics 4 Property ID (found in GA4 Admin → Property Settings)'
      }
    ],
    setupGuide: {
      title: 'How to set up Google Analytics API (Service Account):',
      steps: [
        'Go to console.cloud.google.com',
        'Create a new project or select existing one',
        'Enable "Google Analytics Data API v1"',
        'Go to "IAM & Admin" → "Service Accounts"',
        'Click "Create Service Account"',
        'Name it "analytics-service" and create',
        'Click on the service account → "Keys" → "Add Key" → "Create New Key" → JSON',
        'Download the JSON file and copy the email and private_key values',
        'In Google Analytics, go to Admin → Property → Property Access Management',
        'Add the service account email with "Viewer" permissions',
        'Copy Property ID from GA4 Admin → Property Settings'
      ],
      link: 'https://console.cloud.google.com',
      linkText: 'Google Cloud Console',
      note: 'Service Account authentication is much simpler than OAuth - no refresh tokens needed! Just grant the service account access to your GA4 property.'
    }
  },

  linkedin: {
    title: 'LinkedIn Integration',
    description: 'LinkedIn API for professional network integration and content sharing',
    fields: [
      {
        key: 'clientId',
        label: 'Client ID',
        type: 'text',
        placeholder: '86abc12345',
        required: false,
        help: 'LinkedIn application client ID'
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        type: 'password',
        placeholder: 'WPL_AP1...',
        required: false,
        help: 'LinkedIn application client secret'
      }
    ],
    setupGuide: {
      title: 'How to set up LinkedIn Integration:',
      steps: [
        'Go to developer.linkedin.com',
        'Create a new app for your company',
        'Add your company page as the app owner',
        'Request access to LinkedIn Marketing API',
        'Copy the Client ID and Client Secret',
        'Paste both values in the form above',
        'Complete OAuth flow when prompted'
      ],
      link: 'https://developer.linkedin.com',
      linkText: 'LinkedIn Developers',
      note: 'LinkedIn is optional - enables professional network insights and content cross-posting'
    }
  },

  blog: {
    title: 'Blog RSS Feed',
    description: 'RSS feed integration for blog content analysis and insights',
    fields: [
      {
        key: 'rssUrl',
        label: 'RSS Feed URL',
        type: 'text',
        placeholder: 'https://yourblog.com/feed.xml',
        required: false,
        help: 'Your blog\'s RSS feed URL for content analysis'
      },
      {
        key: 'blogUrl',
        label: 'Blog URL (Optional)',
        type: 'text',
        placeholder: 'https://yourblog.com',
        required: false,
        help: 'Your blog\'s main URL for reference'
      }
    ],
    setupGuide: {
      title: 'How to set up Blog RSS integration:',
      steps: [
        'Find your blog\'s RSS feed URL',
        'For WordPress: Usually /feed or /rss',
        'For Ghost: Usually /rss',
        'For Jekyll/Hugo: Usually /feed.xml',
        'Test the RSS URL in a browser',
        'Paste the RSS URL in the form above',
        'Save settings to enable blog analytics'
      ],
      note: 'Blog RSS is optional - enables blog content analysis, cross-posting suggestions, and content repurposing insights'
    }
  },

  postiz: {
    title: 'Postiz Integration',
    description: 'Postiz social media management platform integration for content scheduling',
    fields: [
      {
        key: 'url',
        label: 'Postiz Instance URL',
        type: 'text',
        placeholder: 'https://your-postiz.com',
        required: false,
        help: 'Your Postiz instance URL (self-hosted or cloud)'
      },
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'postiz_...',
        required: false,
        help: 'Postiz API key for integration'
      }
    ],
    setupGuide: {
      title: 'How to set up Postiz Integration:',
      steps: [
        'Deploy Postiz or use cloud version',
        'Log in to your Postiz dashboard',
        'Go to Settings → API Keys',
        'Generate a new API key',
        'Copy your instance URL and API key',
        'Paste both values in the form above',
        'Save settings to enable scheduling features'
      ],
      link: 'https://postiz.com',
      linkText: 'Postiz Website',
      note: 'Postiz is optional - enables direct social media scheduling and cross-platform posting'
    }
  }
};

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [profileSettings, setProfileSettings] = useState({
    keywords: [],
    displayName: '',
    bio: '',
    targetAudience: '',
    contentGoals: [],
    customAvatar: null,
    documents: {
      customerAvatar: null,
      targetAudience: null
    }
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [documents, setDocuments] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'apis'

  useEffect(() => {
    loadSettings();
    loadProfileSettings();
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

  const loadProfileSettings = () => {
    try {
      const saved = getProfileSettings();
      setProfileSettings(saved);
      setAvatarPreview(saved.customAvatar);
      
      // Load documents
      const allDocuments = getAllDocuments();
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Failed to load profile settings:', error);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && profileSettings.keywords.length < 5) {
      setProfileSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setProfileSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };


  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setAvatarPreview(dataUrl);
        setProfileSettings(prev => ({
          ...prev,
          customAvatar: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setProfileSettings(prev => ({
      ...prev,
      customAvatar: null
    }));
  };

  const handleDocumentUpload = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type (text/markdown files)
      if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
        alert('Please select a text or markdown file (.txt, .md)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const success = saveDocument(documentType, content, file.name);
        if (success) {
          setDocuments(prev => ({
            ...prev,
            [documentType]: {
              content,
              filename: file.name,
              uploadedAt: new Date().toISOString()
            }
          }));
          
          // Notify other components about document update
          window.dispatchEvent(new CustomEvent('aiDocumentsUpdated', {
            detail: { documentType, filename: file.name }
          }));
        } else {
          alert('Failed to save document');
        }
      };
      reader.readAsText(file);
    }
  };

  const removeDocumentHandler = (documentType) => {
    const success = removeDocument(documentType);
    if (success) {
      setDocuments(prev => {
        const updated = { ...prev };
        delete updated[documentType];
        return updated;
      });
      
      // Notify other components about document removal
      window.dispatchEvent(new CustomEvent('aiDocumentsUpdated', {
        detail: { documentType, action: 'removed' }
      }));
    } else {
      alert('Failed to remove document');
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save API credentials
      const credentialsSuccess = await saveCredentials(settings);
      if (!credentialsSuccess) {
        throw new Error('Failed to save credentials');
      }
      
      // Save profile settings
      const profileSuccess = saveProfileSettings(profileSettings);
      if (!profileSuccess) {
        throw new Error('Failed to save profile settings');
      }
      
      // Notify other components about avatar update
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
      
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
    setSettings(prev => {
      // Get current credentials from localStorage to ensure we don't lose data
      const current = getCredentials();
      
      return {
        ...current, // Start with all existing credentials
        ...prev,    // Apply any changes from state
        [section]: {
          ...current[section], // Preserve existing section data
          ...prev[section],    // Apply state changes
          [field]: value       // Apply new value
        }
      };
    });
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

  const renderKeywordsSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Keywords & Keyphrases
          <span className="text-gray-500 text-xs ml-2">(Up to 5 keywords for AI analysis)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter a keyword or keyphrase"
            className="untitled-input flex-1"
            maxLength={50}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
          />
          <Button
            onClick={addKeyword}
            variant="outline"
            size="sm"
            disabled={!newKeyword.trim() || profileSettings.keywords.length >= 5}
            icon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
        </div>
        {profileSettings.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profileSettings.keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm"
              >
                <Target className="w-3 h-3" />
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(index)}
                  className="text-brand-600 hover:text-brand-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Keywords help the AI analyze how well your content aligns with your goals and suggest improvements.
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-brand-500" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile & Keywords
            </div>
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'apis'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              API Integrations
            </div>
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-primary-850 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Profile & Analytics Configuration</h3>
            <p className="text-gray-300 text-sm">
              Configure your profile settings and keywords to help AI analyze your content performance and provide targeted suggestions.
            </p>
          </div>

          {/* Avatar Upload Section */}
          <Card className="border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Avatar</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a custom avatar or logo to display in the header instead of the default Bluesky icon.
              </p>
              
              <div className="flex items-start gap-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden mb-3 bg-gray-100 flex items-center justify-center">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={24} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Square images work best<br />
                    Max size: 2MB
                  </p>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <div className="flex gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                      <Upload size={16} />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {avatarPreview && (
                      <button
                        onClick={removeAvatar}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>• Recommended: 200x200px or larger</p>
                    <p>• Supported formats: JPG, PNG, GIF</p>
                    <p>• Will be automatically resized to fit</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>


          {/* Keywords Section */}
          <Card className="border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis Keywords</h3>
              {renderKeywordsSection()}
            </div>
          </Card>

          {/* AI Training Documents Section */}
          <Card className="border-gray-700">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText size={20} className="text-brand-500" />
                    AI Training Documents
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload documents to personalize AI recommendations based on your specific audience and goals.
                  </p>
                </div>
                
                {/* Status Overview */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium">
                  {Object.keys(documents).length === 0 ? (
                    <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                      <AlertCircle size={12} />
                      No documents uploaded
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-success-100 text-success-700 px-3 py-1.5 rounded-full">
                      <CheckCircle size={12} />
                      {Object.keys(documents).length}/2 documents uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Start Guide */}
              {Object.keys(documents).length === 0 && (
                <div className="mb-6 p-4 bg-primary-850 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <HelpCircle size={16} />
                    Quick Start Guide
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Upload these optional documents to enhance AI analysis quality:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="font-medium text-white">Customer Avatar:</span> Demographics, goals, pain points, and characteristics of your ideal customer
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="font-medium text-white">Target Audience:</span> Broader audience description, behaviors, preferences, and segments
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Avatar Document */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      Customer Avatar
                    </h4>
                    {documents.customerAvatar && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Active
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Purpose:</strong> Define your ideal customer profile</p>
                    <p><strong>Include:</strong> Demographics, goals, challenges, motivations</p>
                    <p><strong>Format:</strong> .txt or .md file, up to 5MB</p>
                  </div>
                  
                  {documents.customerAvatar ? (
                    <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{documents.customerAvatar.filename}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded {new Date(documents.customerAvatar.uploadedAt).toLocaleDateString()} at {new Date(documents.customerAvatar.uploadedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                <CheckCircle size={10} className="mr-1" />
                                AI Ready
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocumentHandler('customerAvatar')}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-3"
                          title="Remove document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                        <Upload size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Upload Customer Avatar</p>
                      <p className="text-xs text-gray-500">Click or drag a .txt or .md file here</p>
                      <input
                        type="file"
                        accept=".txt,.md,text/*"
                        onChange={(e) => handleDocumentUpload('customerAvatar', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Target Audience Document */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target size={16} className="text-green-600" />
                      </div>
                      Target Audience
                    </h4>
                    {documents.targetAudience && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        Active
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Purpose:</strong> Describe your broader audience segments</p>
                    <p><strong>Include:</strong> Personas, behaviors, preferences, interests</p>
                    <p><strong>Format:</strong> .txt or .md file, up to 5MB</p>
                  </div>
                  
                  {documents.targetAudience ? (
                    <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{documents.targetAudience.filename}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded {new Date(documents.targetAudience.uploadedAt).toLocaleDateString()} at {new Date(documents.targetAudience.uploadedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                <CheckCircle size={10} className="mr-1" />
                                AI Ready
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocumentHandler('targetAudience')}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-3"
                          title="Remove document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                        <Upload size={20} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Upload Target Audience</p>
                      <p className="text-xs text-gray-500">Click or drag a .txt or .md file here</p>
                      <input
                        type="file"
                        accept=".txt,.md,text/*"
                        onChange={(e) => handleDocumentUpload('targetAudience', e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Benefits Section - Only show if at least one document is uploaded */}
              {Object.keys(documents).length > 0 && (
                <div className="mt-6 p-4 bg-success-50 rounded-lg border border-success-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-success-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-success-900 mb-2">
                        AI Enhanced Analysis Active
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-success-700">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-success-600 rounded-full"></div>
                          Personalized content recommendations
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-success-600 rounded-full"></div>
                          Audience-specific performance insights
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-success-600 rounded-full"></div>
                          Tailored content strategy suggestions
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-success-600 rounded-full"></div>
                          Context-aware analytics feedback
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Section - Always visible */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <HelpCircle size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Document Tips</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>• <strong>Format:</strong> Use plain text (.txt) or Markdown (.md) files for best results</div>
                      <div>• <strong>Length:</strong> Aim for 200-2000 words per document for optimal AI processing</div>
                      <div>• <strong>Content:</strong> Be specific and detailed - more context leads to better AI recommendations</div>
                      <div>• <strong>Privacy:</strong> Documents are stored locally and never shared with third parties</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* API Integrations Tab */}
      {activeTab === 'apis' && (
        <div className="space-y-6">
          <div className="bg-primary-850 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">🔧 API Integrations</h3>
            <p className="text-gray-300 text-sm">
              Configure API integrations for your dashboard. Bluesky is required for core functionality.
              Other integrations are optional and enhance your dashboard with AI insights, database storage, and additional analytics.
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
                          variant="outline"
                          size="sm"
                          disabled={validationStatus[section]?.status === 'validating'}
                        >
                          {validationStatus[section]?.status === 'validating' ? 'Testing...' : 'Test'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
                        {isExpanded ? 'Collapse' : 'Configure'}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-2">{guide.description}</p>
                  
                  {getValidationMessage(section) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{getValidationMessage(section)}</p>
                    </div>
                  )}

                  {/* Expanded Section Content */}
                  {isExpanded && (
                    <div className="mt-6 space-y-4">
                      {guide.fields && (
                        <div className="grid grid-cols-1 gap-4">
                          {guide.fields.map(field => {
                            const currentValue = sectionSettings[field.key] || '';
                            const fieldId = `${section}-${field.key}`;
                            const showPassword = showPasswords[fieldId];
                            
                            if (field.type === 'select') {
                              return (
                                <div key={field.key} className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-900">
                                    {field.label}
                                    {field.required && <span className="text-error-500 ml-1">*</span>}
                                  </label>
                                  <select
                                    value={currentValue}
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
                                  {field.help && (
                                    <p className="text-xs text-gray-500">{field.help}</p>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <div key={field.key} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-900">
                                  {field.label}
                                  {field.required && <span className="text-error-500 ml-1">*</span>}
                                </label>
                                <div className="relative">
                                  <input
                                    type={field.type === 'password' && !showPassword ? 'password' : 'text'}
                                    value={currentValue}
                                    onChange={(e) => updateSetting(section, field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="untitled-input w-full"
                                  />
                                  {field.type === 'password' && (
                                    <button
                                      type="button"
                                      onClick={() => setShowPasswords(prev => ({
                                        ...prev,
                                        [fieldId]: !prev[fieldId]
                                      }))}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  )}
                                </div>
                                {field.help && (
                                  <p className="text-xs text-gray-500">{field.help}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {guide.setupGuide && renderSetupGuide(guide.setupGuide)}
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
      )}
    </div>
  );
};

export default Settings;