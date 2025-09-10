import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle, HelpCircle, Loader, Shield, User, Target, Plus, X, Upload, Camera } from 'lucide-react';
import { Card, Button } from '../components/ui/UntitledUIComponents';
import { APP_CONFIG } from '../config/app.config';
import { 
  getCredentials, 
  saveCredentials, 
  validateServiceCredentials, 
  getEffectiveConfig,
  getConfigurationStatus,
  getProfileSettings,
  saveProfileSettings,
  saveCustomAvatar,
  getCustomAvatar,
  removeCustomAvatar
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
    ]
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
    customAvatar: null
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
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

  const updateProfileField = (field, value) => {
    setProfileSettings(prev => ({
      ...prev,
      [field]: value
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

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save API credentials
      const credentialsSuccess = saveCredentials(settings);
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
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
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

          {/* Bluesky Account Section */}
          <Card className="border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bluesky Account</h3>
              <div className="grid grid-cols-1 gap-4">
                {API_GUIDES.bluesky.fields.map(field => {
                  const currentValue = (settings.bluesky || {})[field.key] || '';
                  const fieldId = `bluesky-${field.key}`;
                  const showPassword = showPasswords[fieldId];
                  
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
                          onChange={(e) => updateSetting('bluesky', field.key, e.target.value)}
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
                {renderValidationIcon('bluesky') && (
                  <div className="flex items-center gap-2 mt-2">
                    {renderValidationIcon('bluesky')}
                    <span className="text-sm text-gray-600">{getValidationMessage('bluesky')}</span>
                  </div>
                )}
                <Button
                  onClick={() => validateSettings('bluesky')}
                  variant="outline"
                  size="sm"
                  disabled={validationStatus.bluesky?.status === 'validating'}
                >
                  {validationStatus.bluesky?.status === 'validating' ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
              {API_GUIDES.bluesky.setupGuide && renderSetupGuide(API_GUIDES.bluesky.setupGuide)}
            </div>
          </Card>

          {/* Keywords Section */}
          <Card className="border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis Keywords</h3>
              {renderKeywordsSection()}
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
              Configure optional API integrations to enhance your dashboard with AI insights, database storage, and additional analytics.
              All integrations are optional - the dashboard works with just your Bluesky credentials.
            </p>
          </div>

          {/* API Settings Sections */}
          {Object.entries(API_GUIDES).filter(([section]) => section !== 'bluesky').map(([section, guide]) => {
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
                      <span className="text-gray-500 text-sm">
                        {isExpanded ? '−' : '+'}
                      </span>
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