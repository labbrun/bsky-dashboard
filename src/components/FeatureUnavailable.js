import React from 'react';
import { Settings, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, Button } from './ui/UntitledUIComponents';

const FEATURE_REQUIREMENTS = {
  ai: {
    title: 'AI Insights',
    description: 'AI-powered analytics and content recommendations',
    requirements: 'Requires AI API credentials (OpenAI, Anthropic, Perplexity, or Local AI)',
    setupSteps: [
      'Go to Settings → AI API',
      'Choose your AI provider',
      'Add your API key or configure local AI',
      'Test the connection'
    ]
  },
  google: {
    title: 'Google Trends Integration',
    description: 'Trend analysis and content discovery',
    requirements: 'Requires Google Custom Search API credentials',
    setupSteps: [
      'Go to Settings → Google Services',
      'Get a Custom Search API key from Google Cloud',
      'Create a Custom Search Engine',
      'Add both credentials in settings'
    ]
  },
  blog: {
    title: 'Blog Analytics',
    description: 'Blog performance tracking and cross-platform analytics',
    requirements: 'Requires RSS feed URL from your blog',
    setupSteps: [
      'Go to Settings → Blog RSS Feed',
      'Add your blog\'s RSS feed URL',
      'Add your blog website URL',
      'Test the RSS feed connection'
    ]
  },
  linkedin: {
    title: 'LinkedIn Integration',
    description: 'Cross-platform analytics and content sharing',
    requirements: 'Requires LinkedIn Developer App credentials',
    setupSteps: [
      'Create a LinkedIn Developer App',
      'Go to Settings → LinkedIn Integration',
      'Add Client ID and Client Secret',
      'Test the connection'
    ]
  },
  postiz: {
    title: 'Social Media Scheduling',
    description: 'Schedule and manage social media posts',
    requirements: 'Requires Postiz instance and API key',
    setupSteps: [
      'Set up a Postiz instance',
      'Go to Settings → Postiz Integration',
      'Add instance URL and API key',
      'Test the connection'
    ]
  }
};

const FeatureUnavailable = ({ 
  feature, 
  size = 'normal',
  showSetupButton = true,
  customMessage 
}) => {
  const featureInfo = FEATURE_REQUIREMENTS[feature];
  
  if (!featureInfo && !customMessage) {
    return null;
  }

  const isCompact = size === 'compact';

  return (
    <div className={`${isCompact ? 'p-4' : 'p-6'} text-center`}>
      <div className={`w-${isCompact ? '12' : '16'} h-${isCompact ? '12' : '16'} mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center`}>
        <AlertTriangle className={`w-${isCompact ? '6' : '8'} h-${isCompact ? '6' : '8'} text-gray-400`} />
      </div>
      
      {customMessage ? (
        <div className="space-y-2">
          <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-300`}>
            Feature Unavailable
          </h3>
          <p className="text-sm text-gray-400">{customMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-300`}>
            {featureInfo.title} Not Configured
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            {featureInfo.description}
          </p>
          <div className="text-xs text-gray-500 mb-4">
            <p className="font-medium mb-1">{featureInfo.requirements}</p>
          </div>
          
          {!isCompact && (
            <div className="bg-primary-850 rounded-lg p-3 mb-4 text-left">
              <h4 className="text-sm font-semibold text-white mb-2">Quick Setup:</h4>
              <ol className="text-xs text-gray-300 space-y-1">
                {featureInfo.setupSteps.map((step, idx) => (
                  <li key={idx} className="flex">
                    <span className="text-brand-400 mr-2">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
      
      {showSetupButton && (
        <Button
          onClick={() => window.location.href = '/settings'}
          variant="secondary"
          size={isCompact ? "sm" : "md"}
          icon={<Settings className="w-4 h-4" />}
        >
          Configure in Settings
        </Button>
      )}
    </div>
  );
};

// Wrapper component for disabled sections
export const DisabledSection = ({ 
  feature, 
  children, 
  fallback,
  isConfigured = false 
}) => {
  if (isConfigured) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return (
    <Card className="border-gray-700">
      <FeatureUnavailable feature={feature} size="compact" />
    </Card>
  );
};

// Component for inline feature status
export const FeatureStatus = ({ 
  feature, 
  isConfigured, 
  showLabel = true 
}) => {
  const featureInfo = FEATURE_REQUIREMENTS[feature];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        isConfigured ? 'bg-success-500' : 'bg-gray-500'
      }`} />
      {showLabel && (
        <span className={`text-xs ${
          isConfigured ? 'text-success-300' : 'text-gray-400'
        }`}>
          {isConfigured ? 'Configured' : 'Not configured'}
        </span>
      )}
      {featureInfo && (
        <span className="text-xs text-gray-500">
          {featureInfo.title}
        </span>
      )}
    </div>
  );
};

// Component for feature requirement lists
export const FeatureRequirements = ({ features = [] }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-white">Required Integrations:</h4>
      {features.map(feature => {
        const info = FEATURE_REQUIREMENTS[feature];
        if (!info) return null;
        
        return (
          <div key={feature} className="flex items-start gap-3 p-3 bg-primary-850 rounded-lg border border-gray-700">
            <AlertTriangle className="w-5 h-5 text-warning-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-white">{info.title}</h5>
              <p className="text-sm text-gray-400 mt-1">{info.requirements}</p>
            </div>
            <Button
              onClick={() => window.location.href = '/settings'}
              variant="ghost"
              size="sm"
              icon={<ExternalLink className="w-3 h-3" />}
            >
              Setup
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureUnavailable;