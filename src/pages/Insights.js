import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Users,
  Lightbulb,
  Zap,
  FileText,
  Package,
  ArrowRight,
  Star,
  Calendar,
  Target,
  MessageSquare,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Import AI insights system
import AIInsightsGenerator, { 
  INSIGHT_CATEGORIES, 
  getInsightIcon, 
  getInsightColor 
} from '../services/aiInsightsService';
import { CUSTOMER_AVATAR } from '../config/customer-avatar.config';
import { LABBRUN_CUSTOMER_AVATAR } from '../config/labbrun-customer-avatar.config';

function Insights({ metrics }) {
  const [aiInsights, setAiInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(INSIGHT_CATEGORIES.CONTENT_STRATEGY);
  const [customerSegment, setCustomerSegment] = useState('labbrun-primary');
  const [insightsGenerator, setInsightsGenerator] = useState(null);

  // Initialize AI insights generator
  useEffect(() => {
    const generator = new AIInsightsGenerator(customerSegment);
    setInsightsGenerator(generator);
  }, [customerSegment]);

  // Generate AI insights when metrics are available
  useEffect(() => {
    if (metrics && insightsGenerator && Object.keys(aiInsights).length === 0) {
      generateAllInsights();
    }
  }, [metrics, insightsGenerator]);

  const generateAllInsights = async () => {
    if (!insightsGenerator || !metrics) return;

    setLoadingInsights(true);
    const categories = Object.values(INSIGHT_CATEGORIES);
    const insights = {};

    for (const category of categories) {
      try {
        insights[category] = await insightsGenerator.generateMockInsights(metrics, category);
      } catch (error) {
        insights[category] = {
          title: 'Insights Unavailable',
          insights: [{
            type: 'error',
            title: 'Unable to generate insights',
            description: 'Please try again later or check your data.',
            actionable: false
          }],
          metrics: []
        };
      }
    }

    setAiInsights(insights);
    setLoadingInsights(false);
  };

  const refreshInsights = async () => {
    setAiInsights({});
    await generateAllInsights();
  };

  // Sample insights data (kept as fallback)
  const topPerformers = [
    {
      topic: "AI Development",
      format: "Thread",
      avgEngagement: 7.2,
      lift: 45,
      posts: 8,
      reason: "High-value technical insights resonate with your audience"
    },
    {
      topic: "Startup Journey", 
      format: "Personal Story",
      avgEngagement: 6.8,
      lift: 32,
      posts: 12,
      reason: "Authentic experiences build strong connections"
    },
    {
      topic: "Tech Reviews",
      format: "Video + Text",
      avgEngagement: 6.3,
      lift: 28,
      posts: 6,
      reason: "Visual content with expert analysis performs well"
    }
  ];

  const underperformers = [
    {
      topic: "Industry News",
      format: "Link Share",
      avgEngagement: 2.1,
      posts: 15,
      suggestion: "Add personal commentary and insights to news shares"
    },
    {
      topic: "General Tech",
      format: "Text Only",
      avgEngagement: 2.8,
      posts: 10,
      suggestion: "Focus on specific niches rather than broad topics"
    }
  ];

  const recommendedTimes = [
    { day: "Monday", time: "2:00 PM", reason: "Peak professional audience", confidence: 92 },
    { day: "Tuesday", time: "3:30 PM", reason: "High engagement window", confidence: 88 },
    { day: "Wednesday", time: "1:00 PM", reason: "Lunch break activity spike", confidence: 85 },
    { day: "Thursday", time: "2:45 PM", reason: "Mid-week momentum", confidence: 90 },
    { day: "Friday", time: "11:30 AM", reason: "Pre-weekend engagement", confidence: 78 }
  ];

  const topAmplifiersToEngage = [
    {
      handle: "airesearcher",
      avatar: "https://via.placeholder.com/40",
      followers: 15200,
      reason: "Frequently engages with AI content",
      action: "Reply to their latest AI ethics post",
      potential: "High"
    },
    {
      handle: "startupfounder",
      avatar: "https://via.placeholder.com/40", 
      followers: 8900,
      reason: "Shares your startup content regularly",
      action: "Share their latest funding announcement",
      potential: "Medium"
    },
    {
      handle: "techwriter",
      avatar: "https://via.placeholder.com/40",
      followers: 12400,
      reason: "Tech content creator with aligned audience", 
      action: "Comment on their development workflow post",
      potential: "High"
    }
  ];

  const contentIdeas = [
    {
      title: "The Hidden Costs of AI Implementation",
      format: "Thread",
      topic: "AI Business",
      hook: "Everyone talks about AI benefits, but here's what they don't tell you about the real costs...",
      postTime: "Tuesday 2:30 PM",
      source: "Based on your high-performing AI content"
    },
    {
      title: "My Biggest Startup Mistake (And How You Can Avoid It)",
      format: "Personal Story",
      topic: "Entrepreneurship", 
      hook: "2 years ago, I made a $50K mistake that nearly killed our startup. Here's what happened...",
      postTime: "Thursday 3:00 PM",
      source: "Personal stories perform 68% above average"
    },
    {
      title: "5 Tools Every Developer Should Know in 2024",
      format: "List + Screenshots",
      topic: "Development Tools",
      hook: "Stop wasting time with outdated tools. These 5 will transform your workflow...",
      postTime: "Monday 2:00 PM", 
      source: "Tool recommendations get high engagement"
    },
    {
      title: "Why Most AI Startups Will Fail (And 3 That Won't)",
      format: "Analysis Thread",
      topic: "AI Industry",
      hook: "The AI bubble is real, but these startups have what it takes to survive...",
      postTime: "Wednesday 1:00 PM",
      source: "Contrarian takes drive discussion"
    },
    {
      title: "Building in Public: Week 12 Update",
      format: "Update + Metrics",
      topic: "Building in Public",
      hook: "This week was rough. Here's what went wrong and what we learned...",
      postTime: "Friday 11:30 AM",
      source: "Regular updates build community"
    }
  ];

  const productIdeas = [
    {
      title: "AI Implementation Checklist",
      type: "Digital Guide",
      description: "Step-by-step guide for businesses adopting AI tools",
      audience: "SMB owners, CTOs",
      trend: "AI adoption in traditional industries",
      outline: ["Assessment framework", "Tool selection", "Implementation roadmap", "ROI measurement"]
    },
    {
      title: "Startup Pitch Deck Template", 
      type: "Template Pack",
      description: "Proven pitch deck templates used by funded startups",
      audience: "Early-stage founders",
      trend: "Startup funding challenges",
      outline: ["Problem/Solution", "Market analysis", "Business model", "Financial projections"]
    },
    {
      title: "Developer Productivity Bundle",
      type: "Tool Collection",
      description: "Curated tools and configs for developer efficiency",
      audience: "Software developers",
      trend: "Developer experience optimization",
      outline: ["VS Code extensions", "Terminal configs", "Automation scripts", "Workflow templates"]
    },
    {
      title: "Tech Interview Prep Course",
      type: "Video Course",
      description: "Complete preparation for senior engineer interviews",
      audience: "Mid-senior developers",
      trend: "Tech hiring market competitiveness",
      outline: ["System design", "Coding challenges", "Behavioral prep", "Negotiation tactics"]
    },
    {
      title: "SaaS Metrics Dashboard",
      type: "No-Code Tool",
      description: "Pre-built dashboard for tracking key SaaS metrics",
      audience: "SaaS founders, PMs",
      trend: "Data-driven decision making",
      outline: ["MRR tracking", "Churn analysis", "Customer segments", "Growth projections"]
    }
  ];

  // Get current customer avatar info
  const currentAvatar = customerSegment === 'labbrun-primary' 
    ? {
        id: 'labbrun-primary',
        name: 'LabbRun Primary Audience (Alex Carter)',
        description: LABBRUN_CUSTOMER_AVATAR.primaryAvatar.description,
        demographics: LABBRUN_CUSTOMER_AVATAR.primaryAvatar.demographics,
        psychographics: {
          values: LABBRUN_CUSTOMER_AVATAR.primaryAvatar.values.slice(0, 3),
          interests: ['Self-hosting', 'Home labs', 'Cost optimization', 'Privacy & security'],
          painPoints: LABBRUN_CUSTOMER_AVATAR.primaryAvatar.painPoints,
          goals: LABBRUN_CUSTOMER_AVATAR.primaryAvatar.goals.shortTerm
        },
        contentPreferences: {
          formats: ['Step-by-step tutorials', 'Tool reviews', 'Cost comparisons', 'Problem-solving guides'],
          tone: 'Practical, educational, peer-to-peer',
          topics: ['Self-hosting', 'Home automation', 'Business efficiency', 'Privacy tools']
        }
      }
    : CUSTOMER_AVATAR.segments.find(s => s.id === customerSegment) || CUSTOMER_AVATAR.segments[0];
  const currentInsights = aiInsights[selectedCategory];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Lightbulb size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-900">Generating Insights</h2>
          <p className="text-primary-600 mt-2">Analyzing your data to provide actionable recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Customer Avatar Context */}
      <div className="bg-gradient-to-br from-accent-50 to-electric-50 border border-accent-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-500 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-900">AI Insights Dashboard</h1>
              <p className="text-primary-600 text-sm">Personalized recommendations for {currentAvatar.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={customerSegment}
              onChange={(e) => setCustomerSegment(e.target.value)}
              className="text-sm border border-accent-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="labbrun-primary">LabbRun Primary (Home Lab & Self-Hosting)</option>
              {CUSTOMER_AVATAR.segments.map(segment => (
                <option key={segment.id} value={segment.id}>{segment.name}</option>
              ))}
            </select>
            <button 
              onClick={refreshInsights}
              disabled={loadingInsights}
              className="p-2 text-accent-600 hover:bg-accent-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh insights"
            >
              <RefreshCw size={16} className={loadingInsights ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        
        <div className="bg-white/50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-primary-900 mb-2">Target Audience Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-primary-700">Demographics:</span>
              <p className="text-primary-600">{currentAvatar.demographics.ageRange}, {currentAvatar.demographics.occupation}</p>
            </div>
            <div>
              <span className="font-medium text-primary-700">Key Values:</span>
              <p className="text-primary-600">{currentAvatar.psychographics.values.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium text-primary-700">Content Preferences:</span>
              <p className="text-primary-600">{currentAvatar.contentPreferences.formats.slice(0, 2).join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Categories Navigation */}
      <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-primary-900 mb-4">Insight Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.values(INSIGHT_CATEGORIES).map(category => {
            const IconComponent = {
              FileText,
              Users,
              MessageSquare,
              TrendingUp,
              Target,
              Clock,
              Award
            }[getInsightIcon(category)] || Lightbulb;
            
            const isActive = selectedCategory === category;
            const color = getInsightColor(category);
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  isActive 
                    ? `border-${color}-500 bg-${color}-50 text-${color}-700` 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <IconComponent size={20} className="mx-auto mb-1" />
                <p className="text-xs font-medium capitalize">
                  {category.replace('_', ' ')}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI-Generated Insights */}
      {currentInsights && (
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-900">{currentInsights.title}</h2>
            {loadingInsights && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>}
          </div>
          
          {/* Key Metrics */}
          {currentInsights.metrics && currentInsights.metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {currentInsights.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-lg font-bold text-primary-900">{metric.value}</p>
                  {metric.trend && (
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp size={12} className="text-success-500" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown size={12} className="text-error-500" />
                      ) : null}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-success-600' :
                        metric.trend === 'down' ? 'text-error-600' : 'text-gray-600'
                      }`}>{metric.trend}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Insights List */}
          <div className="space-y-4">
            {currentInsights.insights.map((insight, index) => {
              const bgColor = {
                finding: 'bg-blue-50 border-blue-200',
                recommendation: 'bg-green-50 border-green-200', 
                opportunity: 'bg-purple-50 border-purple-200',
                error: 'bg-red-50 border-red-200'
              }[insight.type] || 'bg-gray-50 border-gray-200';
              
              const iconColor = {
                finding: 'text-blue-600',
                recommendation: 'text-green-600',
                opportunity: 'text-purple-600', 
                error: 'text-red-600'
              }[insight.type] || 'text-gray-600';
              
              return (
                <div key={index} className={`border rounded-lg p-4 ${bgColor}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded ${iconColor}`}>
                      {insight.type === 'finding' && <Lightbulb size={16} />}
                      {insight.type === 'recommendation' && <Star size={16} />}
                      {insight.type === 'opportunity' && <Zap size={16} />}
                      {insight.type === 'error' && <AlertCircle size={16} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-900 mb-1">{insight.title}</h4>
                      <p className="text-primary-700 mb-2">{insight.description}</p>
                      {insight.priority && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{insight.priority} priority</span>
                          {insight.timeline && (
                            <span className="text-gray-600">Timeline: {insight.timeline}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy Performance Analysis (kept as backup) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-success-500" size={20} />
            Top Performing Topics & Formats
          </h3>
          <div className="space-y-4">
            {topPerformers.map((item, index) => (
              <div key={index} className="border border-success-200 rounded-lg p-4 bg-success-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-primary-900">{item.topic}</h4>
                    <p className="text-sm text-primary-600">{item.format} • {item.posts} posts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success-600">{item.avgEngagement}%</p>
                    <p className="text-xs text-success-600">+{item.lift}% lift</p>
                  </div>
                </div>
                <p className="text-sm text-primary-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Underperformers */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
            <TrendingDown className="text-error-500" size={20} />
            Improvement Opportunities
          </h3>
          <div className="space-y-4">
            {underperformers.map((item, index) => (
              <div key={index} className="border border-warning-200 rounded-lg p-4 bg-warning-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-primary-900">{item.topic}</h4>
                    <p className="text-sm text-primary-600">{item.format} • {item.posts} posts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-warning-600">{item.avgEngagement}%</p>
                  </div>
                </div>
                <p className="text-sm text-primary-700 mb-2">💡 {item.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Posting Times */}
      <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
          <Calendar className="text-brand-500" size={20} />
          Recommended Posting Times (Next Week)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {recommendedTimes.map((time, index) => (
            <div key={index} className="border border-brand-200 rounded-lg p-4 bg-brand-50">
              <h4 className="font-semibold text-primary-900">{time.day}</h4>
              <p className="text-lg font-bold text-brand-600 my-2">{time.time}</p>
              <p className="text-xs text-primary-600 mb-2">{time.reason}</p>
              <div className="flex items-center gap-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-brand-500 h-1.5 rounded-full" 
                    style={{ width: `${time.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs text-primary-600 ml-1">{time.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Amplifiers to Engage */}
      <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
          <Users className="text-electric-500" size={20} />
          Top 3 Amplifiers to Engage With
        </h3>
        <div className="space-y-4">
          {topAmplifiersToEngage.map((amplifier, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-electric-200 rounded-lg bg-electric-50">
              <div className="flex items-center gap-4">
                <img
                  src={amplifier.avatar}
                  alt={amplifier.handle}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-primary-900">@{amplifier.handle}</h4>
                  <p className="text-sm text-primary-600">{amplifier.followers.toLocaleString()} followers</p>
                  <p className="text-sm text-primary-700">{amplifier.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                  amplifier.potential === 'High' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                }`}>
                  {amplifier.potential} Potential
                </div>
                <p className="text-sm text-primary-700 font-medium">{amplifier.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
          <Zap className="text-warning-500" size={24} />
          Quick Wins
        </h2>

        {/* Content Ideas */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
            <FileText className="text-success-500" size={20} />
            5 Content Ideas Ready to Post
          </h3>
          <div className="space-y-4">
            {contentIdeas.map((idea, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary-900 mb-1">{idea.title}</h4>
                    <div className="flex gap-3 mb-2">
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700">
                        {idea.format}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700">
                        {idea.topic}
                      </span>
                    </div>
                    <p className="text-sm text-primary-700 mb-2 italic">"{idea.hook}"</p>
                    <div className="flex items-center gap-4 text-xs text-primary-600">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {idea.postTime}
                      </span>
                      <span>{idea.source}</span>
                    </div>
                  </div>
                  <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Product Ideas */}
        <div className="bg-white border border-primary-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
            <Package className="text-accent-500" size={20} />
            5 Digital Product Ideas
          </h3>
          <div className="space-y-4">
            {productIdeas.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-accent-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-primary-900">{product.title}</h4>
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-electric-100 text-electric-700">
                        {product.type}
                      </span>
                    </div>
                    <p className="text-sm text-primary-700 mb-2">{product.description}</p>
                    <p className="text-xs text-primary-600 mb-2">
                      <strong>Target:</strong> {product.audience} • <strong>Trend:</strong> {product.trend}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.outline.map((item, idx) => (
                        <span key={idx} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;