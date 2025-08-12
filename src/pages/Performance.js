import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Sparkles, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Hash,
  Target,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

// Brand chart colors - consistent with your palette
const CHART_COLORS = ['#002945', '#2B54BE', '#3A5393', '#0E4CE8', '#3B4869', '#23B26A', '#F79009', '#F04438', '#8B5CF6'];

// Brand keyword usage analysis
const brandKeywordAnalysis = {
  'Home Lab': {
    usage: 'High',
    frequency: '68%',
    impactOnScore: '+24 points',
    synopsis: 'Excellent alignment! Your Home Lab content consistently drives high engagement (avg 7.2% ER). This keyword appears in 68% of your high-performing posts and strongly resonates with your core audience.',
    recommendation: 'Continue focusing on practical Home Lab tutorials and setups. Your audience craves hands-on technical content.',
    scoreContribution: 24
  },
  'Self Hosting': {
    usage: 'High', 
    frequency: '52%',
    impactOnScore: '+18 points',
    synopsis: 'Strong performance with Self Hosting content. These posts get 45% more saves/bookmarks, indicating high practical value. Your privacy-focused self-hosting guides are particularly successful.',
    recommendation: 'Expand into advanced self-hosting topics like security hardening and backup strategies.',
    scoreContribution: 18
  },
  'Privacy': {
    usage: 'High',
    frequency: '61%', 
    impactOnScore: '+22 points',
    synopsis: 'Privacy content generates strong community engagement and positions you as a thought leader. These posts get 2.1x more replies, showing active discussion.',
    recommendation: 'Create more privacy-focused small business content - this intersection performs exceptionally well.',
    scoreContribution: 22
  },
  'Small Business': {
    usage: 'Medium',
    frequency: '34%',
    impactOnScore: '+12 points', 
    synopsis: 'Moderate usage but high potential. Small Business + Tech content gets 85% more engagement than pure tech posts. Underutilized opportunity for growth.',
    recommendation: 'Increase small business tech content frequency. Focus on cost-effective solutions and ROI discussions.',
    scoreContribution: 12
  },
  'Tech': {
    usage: 'Low',
    frequency: '23%',
    impactOnScore: '+8 points',
    synopsis: 'Generic "Tech" posts underperform. While broad tech content gets decent reach, it lacks the targeted engagement of your niche topics.',
    recommendation: 'Replace generic tech content with specific Home Lab, Privacy, or Self Hosting angles for better alignment.',
    scoreContribution: 8
  }
};

// AI-powered keyword explanations
const keywordExplanations = {
  'Docker': {
    why: 'Docker is essential for Home Lab enthusiasts who want containerized applications. Your audience actively uses Docker for self-hosting services.',
    benefit: 'Posts about Docker tutorials and Home Lab setups get 40% higher engagement than generic tech posts.',
    trend: 'Docker + Home Lab content has grown 65% in the past 6 months among your target demographic.'
  },
  'Kubernetes': {
    why: 'Kubernetes appeals to advanced Home Lab users scaling their infrastructure. It aligns with your Self Hosting and Privacy themes.',
    benefit: 'K8s content targeting small business infrastructure needs could increase your reach by 25%.',
    trend: 'Kubernetes for small business content has 3x higher shareability than general K8s posts.'
  },
  'Proxmox': {
    why: 'Proxmox is a top choice for Home Lab virtualization. Your Privacy and Self Hosting audience frequently uses Proxmox.',
    benefit: 'Proxmox tutorials and guides see 80% more saves/bookmarks, indicating high value to your audience.',
    trend: 'Proxmox content performs exceptionally well with your followers who also follow @homelab and @selfhosted accounts.'
  },
  'FOSS': {
    why: 'Free and Open Source Software strongly aligns with Privacy and Self Hosting values. Your audience prioritizes FOSS solutions.',
    benefit: 'FOSS-focused content gets 2.5x more amplification through retweets and mentions.',
    trend: 'FOSS content creates strong community engagement and positions you as a thought leader in Privacy tech.'
  }
};

function Performance({ metrics }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [selectedBrandKeyword, setSelectedBrandKeyword] = useState(null);

  // Sample data for performance analytics
  const recentPosts = [
    {
      id: 1,
      text: "The future of AI development is looking incredibly promising with new breakthroughs happening every day...",
      timestamp: "2024-01-15T14:30:00Z",
      format: "Text",
      likes: 245,
      replies: 32,
      reposts: 18,
      engagementRate: 6.2,
      amplification: 2.3,
      topic: "AI"
    },
    {
      id: 2,
      text: "Just shipped our latest feature! The team worked incredibly hard on this and I'm proud of what we built...",
      timestamp: "2024-01-15T10:15:00Z",
      format: "Text + Image",
      likes: 189,
      replies: 24,
      reposts: 12,
      engagementRate: 4.8,
      amplification: 1.8,
      topic: "Startup"
    },
    {
      id: 3,
      text: "Here's why I think the next wave of innovation will come from the intersection of AI and Web3...",
      timestamp: "2024-01-14T16:45:00Z",
      format: "Thread",
      likes: 312,
      replies: 48,
      reposts: 25,
      engagementRate: 7.8,
      amplification: 3.2,
      topic: "Tech"
    }
  ];

  const engagementByFormat = [
    { format: 'Video', rate: 8.5 },
    { format: 'Thread', rate: 7.2 },
    { format: 'Image', rate: 5.8 },
    { format: 'Text', rate: 4.2 },
    { format: 'Link', rate: 3.6 }
  ];

  const engagementByTopic = [
    { topic: 'Personal', rate: 7.8 },
    { topic: 'AI', rate: 6.8 },
    { topic: 'Tech', rate: 5.4 },
    { topic: 'Startup', rate: 4.9 },
    { topic: 'Industry', rate: 4.1 }
  ];

  // Sample new followers with real handles to fetch
  const newFollowersHandles = ['techexplorer.bsky.social', 'airesearcher.bsky.social', 'startupfounder.bsky.social'];

  const topAmplifiers = [
    { handle: "airesearcher.bsky.social", engagements: 45, reach: 12500 },
    { handle: "techwriter.bsky.social", engagements: 38, reach: 9800 },
    { handle: "devtools.bsky.social", engagements: 32, reach: 8200 }
  ];

  const communityBreakdown = [
    { name: 'Tech Enthusiasts', value: 40, color: CHART_COLORS[0] },
    { name: 'Entrepreneurs', value: 25, color: CHART_COLORS[1] },
    { name: 'Developers', value: 20, color: CHART_COLORS[2] },
    { name: 'Investors', value: 15, color: CHART_COLORS[3] }
  ];

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <BarChart3 size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Performance Data</h2>
          <p className="text-gray-600 mt-2">Analyzing your content and audience metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Performance Insights - Enhanced with vibrant gradient */}
      <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
        
        <div className="relative flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Performance Intelligence
              <span className="px-3 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">AI POWERED</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-300" />
                  <span className="text-green-300 font-semibold text-sm">Content Insight</span>
                </div>
                <p className="text-white text-sm">Video content performs 68% better than text posts. Consider increasing video frequency.</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-300" />
                  <span className="text-blue-300 font-semibold text-sm">Timing Analysis</span>
                </div>
                <p className="text-white text-sm">Peak engagement window: 2-4 PM weekdays. Schedule important content accordingly.</p>
              </div>
              <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-purple-300" />
                  <span className="text-purple-300 font-semibold text-sm">Audience Behavior</span>
                </div>
                <p className="text-white text-sm">Your mutual followers drive 3.2x more amplification than regular followers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Performance Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Performance</h2>
            <p className="text-gray-600">Analyze your posts, formats, and engagement patterns</p>
          </div>
        </div>
        
        {/* Recent Posts Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Posts Performance</h3>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-sm backdrop-blur-sm text-white placeholder-white"
              >
                <option value="week" className="text-gray-900">Last Week</option>
                <option value="month" className="text-gray-900">Last Month</option>
                <option value="quarter" className="text-gray-900">Last Quarter</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Post</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Format</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Topic</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">ER</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Engagement</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <p className="line-clamp-2">{post.text}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                        {post.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                        {post.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          post.engagementRate > 6 ? 'text-green-600' : 
                          post.engagementRate > 4 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {post.engagementRate}%
                        </span>
                        {post.engagementRate > 6 ? <ArrowUp size={14} className="text-green-500" /> : 
                         post.engagementRate < 4 ? <ArrowDown size={14} className="text-red-500" /> : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-xs">
                        <span className="text-red-600 font-semibold">{post.likes} ❤️</span>
                        <span className="text-blue-600 font-semibold">{post.replies} 💬</span>
                        <span className="text-green-600 font-semibold">{post.reposts} 🔄</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://bsky.app/profile/labb.run/post/${post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        View
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ER by Format */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Engagement by Format</h3>
                <p className="text-gray-600 text-sm">Which content types perform best</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementByFormat} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="format" stroke="#64748b" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement Rate']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="rate" fill="url(#colorGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ER by Topic */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-lg">
                <Hash size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Engagement by Topic</h3>
                <p className="text-gray-600 text-sm">Your most engaging content themes</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementByTopic} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="topic" stroke="#64748b" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement Rate']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="rate" fill="url(#colorGradient2)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Brand Keyword Alignment - Dark theme feature section */}
      <div style={{backgroundColor: '#0c2146'}} className="rounded-2xl p-8 shadow-xl border border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-electric-500 to-accent-500"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl shadow-lg" style={{backgroundColor: '#e8eef9'}}>
            <Target size={24} style={{color: '#2d323e'}} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Brand Keyword Alignment</h3>
            <p className="text-gray-300 text-sm">Track alignment with your target audience keywords for Home Lab, Self Hosting, and Privacy content</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="text-center p-6 bg-gradient-to-br from-success-900/30 to-success-800/30 rounded-2xl border border-success-600/30 backdrop-blur-sm">
              <div className="text-4xl font-bold text-success-400 mb-2">84%</div>
              <p className="text-success-200 font-semibold">Brand Alignment Score</p>
              <div className="mt-4 w-full bg-success-900/30 rounded-full h-3 border border-success-600/20">
                <div className="bg-gradient-to-r from-success-500 to-success-400 h-3 rounded-full shadow-inner" style={{ width: '84%' }}></div>
              </div>
              <p className="text-success-300 text-xs mt-2">Strong alignment with target keywords</p>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-success-400 rounded-full"></div>
              Your Brand Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Home Lab', 'Self Hosting', 'Privacy', 'Small Business', 'Tech'].map((keyword, index) => {
                // const analysis = brandKeywordAnalysis[keyword]; // Available for future use
                return (
                  <button
                    key={keyword}
                    onClick={() => setSelectedBrandKeyword(selectedBrandKeyword === keyword ? null : keyword)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer hover:scale-105 ${
                      selectedBrandKeyword === keyword
                        ? 'bg-white text-gray-900 border-2 border-brand-400 shadow-lg'
                        : index < 3
                        ? 'bg-gradient-to-r from-brand-500 to-electric-500 text-white hover:from-brand-600 hover:to-electric-600' 
                        : index < 4
                        ? 'bg-gradient-to-r from-accent-500 to-primary-500 text-white hover:from-accent-600 hover:to-primary-600'
                        : 'bg-slate-600/50 text-slate-200 border border-slate-500 hover:bg-slate-600/70'
                    }`}
                  >
                    #{keyword.replace(' ', '')}
                  </button>
                );
              })}
            </div>
            {selectedBrandKeyword ? (
              <div className="mt-4 bg-slate-600/30 rounded-xl p-4 border border-slate-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-400 rounded-full"></div>
                    <span className="text-brand-300 font-bold text-sm">Brand Usage Analysis: "{selectedBrandKeyword}"</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`px-2 py-1 rounded-full font-bold ${
                      brandKeywordAnalysis[selectedBrandKeyword].usage === 'High' ? 'bg-success-500/20 text-success-300' :
                      brandKeywordAnalysis[selectedBrandKeyword].usage === 'Medium' ? 'bg-warning-500/20 text-warning-300' :
                      'bg-error-500/20 text-error-300'
                    }`}>
                      {brandKeywordAnalysis[selectedBrandKeyword].usage} Usage
                    </span>
                    <span className="text-gray-300">
                      {brandKeywordAnalysis[selectedBrandKeyword].frequency} frequency
                    </span>
                    <span className="text-success-300 font-bold">
                      {brandKeywordAnalysis[selectedBrandKeyword].impactOnScore}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-gray-300">
                  <div>
                    <span className="text-white font-semibold block mb-1">Usage Synopsis:</span>
                    <p>{brandKeywordAnalysis[selectedBrandKeyword].synopsis}</p>
                  </div>
                  <div>
                    <span className="text-white font-semibold block mb-1">AI Recommendation:</span>
                    <p className="text-blue-300">{brandKeywordAnalysis[selectedBrandKeyword].recommendation}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600/50">
                    <span className="text-gray-400">Score Contribution:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-brand-500 to-success-500 h-2 rounded-full" 
                          style={{ width: `${(brandKeywordAnalysis[selectedBrandKeyword].scoreContribution / 24) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-success-400 font-bold">
                        {brandKeywordAnalysis[selectedBrandKeyword].scoreContribution}/24
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-gray-300">
                <p className="mb-3 text-brand-300">💡 Click on any brand keyword above to see detailed usage analysis and AI recommendations.</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                  <span>High usage: Home Lab, Self Hosting, Privacy</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
                  <span>Medium usage: Small Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-error-400 rounded-full"></div>
                  <span>Low usage: Tech (too generic)</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-400 rounded-full"></div>
              Recommended Keywords
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Docker', 'Kubernetes', 'Proxmox', 'FOSS'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSelectedKeyword(selectedKeyword === keyword ? null : keyword)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                    selectedKeyword === keyword
                      ? 'bg-brand-500 text-white border-brand-400'
                      : 'bg-brand-600/30 text-brand-200 border-brand-500/50 hover:bg-brand-500 hover:text-white'
                  }`}
                >
                  +{keyword}
                </button>
              ))}
            </div>
            
            {selectedKeyword ? (
              <div className="bg-slate-600/30 rounded-xl p-4 border border-slate-500/30 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
                  <span className="text-brand-300 font-semibold text-sm">AI Insight: Why target "{selectedKeyword}"?</span>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <p><span className="text-white font-semibold">Audience Fit:</span> {keywordExplanations[selectedKeyword].why}</p>
                  <p><span className="text-white font-semibold">Performance:</span> {keywordExplanations[selectedKeyword].benefit}</p>
                  <p><span className="text-white font-semibold">Trend Data:</span> {keywordExplanations[selectedKeyword].trend}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-300 mb-3">
                Click on any keyword above to see AI-powered insights about why you should target it.
              </p>
            )}
            
            <p className="text-xs text-gray-400">
              These keywords align with your Home Lab and Self Hosting audience and could increase engagement by 15-25%.
            </p>
          </div>
        </div>
      </div>

      {/* Audience & Growth Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audience & Growth</h2>
            <p className="text-gray-600">Track your community growth and engagement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Followers */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              New Followers This Week
            </h3>
            <div className="space-y-4">
              {newFollowersHandles.map((handle, index) => (
                <ProfileCard 
                  key={handle}
                  handle={handle} 
                  showRecentPost={true}
                  className="transform hover:scale-102 transition-transform"
                />
              ))}
            </div>
          </div>

          {/* Community Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Community Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={communityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {communityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {communityBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-gray-700">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Amplifiers */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} />
            Top Amplifiers
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topAmplifiers.map((amplifier, index) => (
              <ProfileCard 
                key={amplifier.handle}
                handle={amplifier.handle} 
                showRecentPost={false}
                className="relative"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timing & Cadence Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timing & Cadence</h2>
            <p className="text-gray-600">Optimize your posting schedule for maximum impact</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: 'Posting Frequency', value: '12/14', subtitle: 'Posts this week vs target', color: 'from-blue-500 to-indigo-600' },
            { icon: Zap, title: 'Avg First-Hour ER', value: '3.8%', subtitle: '+0.5% vs last week', color: 'from-green-500 to-emerald-600' },
            { icon: Target, title: 'Time to 10 Engagements', value: '47m', subtitle: '-12m vs last week', color: 'from-purple-500 to-pink-600' },
            { icon: Hash, title: 'Mutuals Rate', value: '23%', subtitle: '+2% vs last week', color: 'from-orange-500 to-red-600' }
          ].map((stat, index) => (
            <div key={stat.title} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mb-4 inline-flex">
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-white text-opacity-90 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white text-opacity-80 text-xs">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Performance;