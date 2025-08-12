import React from 'react';
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
  Calendar
} from 'lucide-react';

function Insights({ metrics }) {
  // Sample insights data
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
      {/* AI Summary & Suggestions */}
      <div className="bg-gradient-to-br from-accent-50 to-electric-50 border border-accent-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-accent-500 rounded-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary-900 mb-3">Strategic Insights</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Star size={16} className="text-success-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your technical AI threads consistently outperform other content by 45%. Double down on this format.</p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-brand-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Posting between 2-4 PM on weekdays yields 38% higher engagement rates. Optimize your scheduling.</p>
              </div>
              <div className="flex items-start gap-2">
                <Users size={16} className="text-electric-500 mt-1 flex-shrink-0" />
                <p className="text-primary-700">Your mutual follower network is highly engaged. Focus on building relationships with key amplifiers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
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