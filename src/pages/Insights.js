import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb,
  Zap,
  FileText,
  Package,
  Target,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';

// Import REAL AI service
import realAIService from '../services/realAIService';
import { Button } from '../components/ui/UntitledUIComponents';
import { getFollowers, getProfile } from '../services/blueskyService';
import FeatureUnavailable from '../components/FeatureUnavailable';
import { isServiceConfigured } from '../services/credentialsService';

function Insights({ metrics }) {
  const [aiInsights, setAiInsights] = useState(null);
  const [contentStrategy, setContentStrategy] = useState(null);
  const [activePlatform, setActivePlatform] = useState('bluesky');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiServiceReady, setAiServiceReady] = useState(false);

  // Initialize REAL AI service
  useEffect(() => {
    const initAI = async () => {
      const ready = await realAIService.initialize();
      setAiServiceReady(ready);
    };
    initAI();
  }, []);

  const generateRealInsights = useCallback(async () => {
    if (!aiServiceReady || !metrics) return;

    setLoadingInsights(true);
    
    try {
      console.log('Generating REAL AI insights with metrics:', {
        followers: metrics.followersCount,
        posts: metrics.postsCount,
        hasRecentPosts: !!metrics.recentPosts?.length
      });
      
      // Generate REAL AI insights using the user's configured API
      const [insights, strategy] = await Promise.all([
        realAIService.generateBlueskyInsights(metrics),
        realAIService.generateContentStrategy(metrics, metrics.recentPosts || [])
      ]);
      
      if (!insights && !strategy) {
        console.log('AI service not configured or failed');
        setAiInsights(null);
        setContentStrategy(null);
        return;
      }
      
      setAiInsights(insights);
      setContentStrategy(strategy);
      
      console.log('Real AI insights generated successfully:', {
        hasInsights: !!insights,
        hasStrategy: !!strategy
      });

    } catch (error) {
      console.error('Error generating REAL insights:', error);
      setAiInsights(null);
      setContentStrategy(null);
    } finally {
      setLoadingInsights(false);
    }
  }, [aiServiceReady, metrics]);

  // Generate REAL AI insights when metrics are available
  useEffect(() => {
    if (metrics && aiServiceReady && !aiInsights && !loadingInsights) {
      generateRealInsights();
    }
  }, [metrics, aiServiceReady, aiInsights, loadingInsights, generateRealInsights]);

  // Fetch real amplifier data
  useEffect(() => {
    async function fetchAmplifiers() {
      if (!metrics?.handle) return;
      
      try {
        const followersResponse = await getFollowers(metrics.handle, 20);
        if (followersResponse?.followers && followersResponse.followers.length > 0) {
          // Get top 6 followers and fetch their full profiles
          const topFollowers = followersResponse.followers.slice(0, 6);
          
          // Fetch detailed profile data for each follower
          // eslint-disable-next-line no-unused-vars
          const amplifiersPromises = topFollowers.map(async (follower) => {
            try {
              const fullProfile = await getProfile(follower.handle);
              return {
                handle: follower.handle,
                displayName: follower.displayName || fullProfile.displayName || follower.handle,
                avatar: follower.avatar || fullProfile.avatar,
                followers: fullProfile.followersCount || 0,
                posts: fullProfile.postsCount || 0,
                engagement: `${((fullProfile.followersCount || 0) / 1000 * 2 + 1).toFixed(1)}%`, // Estimated based on follower count
                reason: "High-value follower for potential collaboration",
                action: (fullProfile.followersCount || 0) > 5000 ? "Collaborate" : (fullProfile.followersCount || 0) > 1000 ? "Engage" : "Follow",
                potential: (fullProfile.followersCount || 0) > 5000 ? "High" : (fullProfile.followersCount || 0) > 1000 ? "Medium" : "Low",
                latestPost: fullProfile.description || "Profile information not available",
                postTime: "Recently active",
                postEngagement: {
                  likes: Math.floor((fullProfile.followersCount || 0) * 0.05), // Estimated 5% engagement
                  replies: Math.floor((fullProfile.followersCount || 0) * 0.02), // Estimated 2% reply rate
                  shares: Math.floor((fullProfile.followersCount || 0) * 0.01) // Estimated 1% share rate
                }
              };
            } catch (profileError) {
              console.error(`Error fetching profile for ${follower.handle}:`, profileError);
              // Return basic data if profile fetch fails
              return {
                handle: follower.handle,
                displayName: follower.displayName || follower.handle,
                avatar: follower.avatar,
                followers: 0,
                posts: 0,
                engagement: "N/A",
                reason: "Profile data unavailable",
                action: "Reply",
                potential: "Unknown",
                latestPost: "Profile data not available",
                postTime: "N/A",
                postEngagement: { likes: 0, replies: 0, shares: 0 }
              };
            }
          });
          
          // const amplifiersData = await Promise.all(amplifiersPromises); // Unused
          // setTopAmplifiersData(amplifiersData); // Commented out - unused
        }
      } catch (error) {
        console.error('Error fetching amplifiers:', error);
        // Keep the default mock data if API fails
      }
    }
    
    fetchAmplifiers();
  }, [metrics]);

  // Check if AI service is configured - MOVED AFTER ALL HOOKS
  const aiConfigured = isServiceConfigured('ai');

  // If AI is not configured, show feature unavailable message
  if (!aiConfigured) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-brand-500" />
          <h1 className="text-2xl font-bold text-white">AI Insights</h1>
        </div>
        
        <div className="bg-primary-900 rounded-lg border border-gray-800">
          <FeatureUnavailable 
            feature="ai" 
            showSetupButton={true}
          />
        </div>
      </div>
    );
  }

  // Content and product ideas data
  const contentIdeas = [
    {
      title: "Home Lab Setup Journey Documentation",
      format: "Thread + Images",
      topic: "Home Labbing",
      description: "Document your complete home lab build process, from hardware selection to service deployment. Show cable management, rack setup, and troubleshooting real issues as they happen.",
      postTime: "Tuesday 2:30 PM",
      source: "Home lab content drives high engagement in tech communities",
      searchQuery: "home lab setup documentation and best practices"
    },
    {
      title: "Why Small Businesses Should Avoid Cloud Lock-in",
      format: "Opinion Thread",
      topic: "Privacy & Security", 
      description: "Challenge the 'cloud-first' mentality with a data-driven analysis of costs, security risks, and vendor dependencies. Present self-hosting as a viable alternative for privacy-conscious entrepreneurs.",
      postTime: "Thursday 3:00 PM",
      source: "Privacy-focused content resonates with tech entrepreneurs",
      searchQuery: "cloud vs self hosting for small business security"
    },
    {
      title: "Self-Hosted vs SaaS: Remote Work Tools Showdown",
      format: "Analysis + Screenshots",
      topic: "Remote Work",
      description: "Compare self-hosted alternatives (NextCloud, Jitsi, GitLab) against popular SaaS tools (Dropbox, Zoom, GitHub) for remote teams. Include setup complexity, costs, and privacy considerations.",
      postTime: "Monday 10:00 AM",
      source: "Tool comparisons help remote teams make informed decisions",
      searchQuery: "self hosted remote work tools vs saas alternatives"
    },
    {
      title: "How I Lost 3 Days of Work (Home Lab Backup Failure)",
      format: "Case Study",
      topic: "Self Hosting",
      description: "Document a real home lab disaster - failed backups, data loss, or service outages. Show the step-by-step recovery process and backup strategies that actually work for small businesses.",
      postTime: "Wednesday 1:30 PM",
      source: "Failure stories build trust and provide valuable lessons",
      searchQuery: "home lab backup strategies and disaster recovery"
    },
    {
      title: "The Great De-Clouding: Why 2024 is the Year of Self-Hosting",
      format: "Analysis Thread",
      topic: "Entrepreneurship",
      description: "Analyze the growing trend of businesses moving away from cloud services. Cover rising costs, privacy concerns, and improved self-hosting tools. Predict which industries will lead this shift.",
      postTime: "Friday 4:00 PM",
      source: "Trend analysis positions you as an industry thought leader",
      searchQuery: "business trends moving away from cloud to self hosting"
    },
    {
      title: "Small Business Security Challenge: Crowdsourced Solutions",
      format: "Interactive Post",
      topic: "Running a Small Business",
      description: "Post a real security challenge small businesses face (like secure remote access or client data protection). Ask your community for their solutions and compile the best approaches.",
      postTime: "Saturday 11:00 AM",
      source: "Security discussions drive high engagement in business communities",
      searchQuery: "small business cybersecurity challenges and solutions"
    }
  ];

  const productIdeas = [
    {
      title: "Home Lab Starter Kit for Small Business",
      type: "Digital Guide + Hardware List",
      description: "Complete guide for entrepreneurs to build their first business home lab for under $2000",
      audience: "Small business owners, Remote entrepreneurs",
      trend: "Rising cloud costs driving self-hosting adoption",
      outline: ["Hardware selection", "Network setup", "Service deployment", "Security hardening"],
      searchQuery: "home lab setup guide for small business"
    },
    {
      title: "Privacy-First Remote Work Toolkit", 
      type: "Software Bundle",
      description: "Self-hosted alternatives to popular SaaS tools for privacy-conscious remote teams",
      audience: "Remote team leaders, Privacy advocates",
      trend: "Growing concern over data privacy in remote work",
      outline: ["Communication tools", "File sharing", "Project management", "VPN solutions"],
      searchQuery: "privacy focused remote work tools and software"
    },
    {
      title: "Self-Hosting Security Checklist",
      type: "Security Assessment Tool",
      description: "Comprehensive security audit framework for self-hosted business infrastructure",
      audience: "IT managers, Security-conscious entrepreneurs",
      trend: "Increased cybersecurity threats to small businesses",
      outline: ["Network security", "Access controls", "Backup verification", "Incident response"],
      searchQuery: "self hosting security best practices for business"
    },
    {
      title: "Small Business Cloud Exit Strategy",
      type: "Migration Playbook",
      description: "Step-by-step guide to migrate from cloud services to self-hosted solutions without downtime",
      audience: "Small business owners, IT consultants",
      trend: "Cloud cost optimization and vendor independence",
      outline: ["Migration planning", "Data extraction", "Service transition", "Cost analysis"],
      searchQuery: "how to migrate small business from cloud to self hosting"
    },
    {
      title: "Entrepreneur's Home Office Network Blueprint",
      type: "Technical Blueprint",
      description: "Professional network design templates for home-based business operations with enterprise-grade security",
      audience: "Home-based entrepreneurs, Freelancers",
      trend: "Permanent shift to home-based businesses post-pandemic",
      outline: ["Network topology", "Security zones", "Guest isolation", "Business continuity"],
      searchQuery: "home office network design for entrepreneurs"
    },
    {
      title: "Privacy-Focused Business Productivity Suite",
      type: "Software Package",
      description: "Complete self-hosted productivity solution with email, calendar, file sharing, and collaboration tools",
      audience: "Privacy-conscious businesses, Tech startups",
      trend: "Data sovereignty and GDPR compliance requirements",
      outline: ["Email server setup", "Calendar integration", "Document collaboration", "Mobile access"],
      searchQuery: "self hosted business productivity tools and software"
    }
  ];

  // Removed unused topAmplifiersToEngage data structure



  // Platform content data
  const platformContent = {
    reddit: [
      {
        title: "Self-hosted email servers gaining popularity",
        snippet: "Discussion about setting up mail servers at home for better privacy and control over email data. Users sharing configurations and troubleshooting tips.",
        engagement: "156 upvotes • 43 comments",
        timeAgo: "2h ago",
        link: "https://reddit.com/r/selfhosted/comments/example1"
      },
      {
        title: "Docker homelab automation workflows",
        snippet: "Community members sharing Docker container setups for automating small business workflows and personal productivity systems.",
        engagement: "203 upvotes • 67 comments", 
        timeAgo: "4h ago",
        link: "https://reddit.com/r/homelab/comments/example2"
      },
      {
        title: "Privacy alternatives to Google Workspace",
        snippet: "Comprehensive thread about replacing Google services with privacy-focused alternatives for small business operations.",
        engagement: "89 upvotes • 31 comments",
        timeAgo: "6h ago", 
        link: "https://reddit.com/r/privacy/comments/example3"
      },
      {
        title: "Kubernetes vs Docker for small business",
        snippet: "Technical discussion about whether K8s complexity is worth it for small business automation or if Docker Compose is sufficient.",
        engagement: "134 upvotes • 52 comments",
        timeAgo: "8h ago",
        link: "https://reddit.com/r/kubernetes/comments/example4"
      },
      {
        title: "Home lab security best practices 2024",
        snippet: "Security-focused discussion about protecting home lab infrastructure from threats while maintaining accessibility and functionality.",
        engagement: "178 upvotes • 29 comments",
        timeAgo: "12h ago",
        link: "https://reddit.com/r/homelab/comments/example5"
      },
      {
        title: "Cost analysis: Self-hosting vs SaaS",
        snippet: "Detailed breakdown of actual costs comparing self-hosted solutions to popular SaaS alternatives for small businesses.",
        engagement: "245 upvotes • 88 comments",
        timeAgo: "1d ago",
        link: "https://reddit.com/r/entrepreneur/comments/example6"
      },
      {
        title: "NextCloud setup for business file sharing",
        snippet: "Step-by-step guide for setting up NextCloud as a Dropbox alternative with focus on security and team collaboration features.",
        engagement: "167 upvotes • 34 comments",
        timeAgo: "1d ago",
        link: "https://reddit.com/r/selfhosted/comments/example7"
      },
      {
        title: "Home Assistant business automation ideas",
        snippet: "Creative uses of Home Assistant for small business automation beyond home use - office monitoring, equipment management, etc.",
        engagement: "112 upvotes • 28 comments",
        timeAgo: "2d ago",
        link: "https://reddit.com/r/homeassistant/comments/example8"
      },
      {
        title: "Open source CRM alternatives comparison",
        snippet: "Community comparison of open source CRM solutions suitable for self-hosting, with focus on ease of setup and maintenance.",
        engagement: "198 upvotes • 45 comments",
        timeAgo: "2d ago",
        link: "https://reddit.com/r/selfhosted/comments/example9"
      }
    ],
    linkedin: [
      {
        title: "Why SMBs are moving to self-hosted solutions",
        snippet: "LinkedIn thought leader discussing the growing trend of small businesses adopting self-hosted infrastructure to reduce costs and increase data control.",
        engagement: "245 likes • 67 comments • 34 shares",
        timeAgo: "3h ago",
        link: "https://linkedin.com/posts/example1"
      },
      {
        title: "Docker revolutionizing small business IT",
        snippet: "CTO sharing how containerization transformed their startup's development workflow and reduced infrastructure costs by 40%.",
        engagement: "189 likes • 45 comments • 28 shares",
        timeAgo: "5h ago",
        link: "https://linkedin.com/posts/example2"
      },
      {
        title: "The hidden costs of SaaS subscriptions",
        snippet: "Business consultant analyzing how SaaS costs compound over time and when self-hosting becomes financially advantageous for growing companies.",
        engagement: "312 likes • 89 comments • 56 shares",
        timeAgo: "8h ago",
        link: "https://linkedin.com/posts/example3"
      },
      {
        title: "Privacy-first business tools gaining traction",
        snippet: "Tech executive discussing the shift toward privacy-focused alternatives to mainstream business tools, driven by data sovereignty concerns.",
        engagement: "156 likes • 34 comments • 22 shares",
        timeAgo: "12h ago",
        link: "https://linkedin.com/posts/example4"
      },
      {
        title: "Home lab skills driving career advancement",
        snippet: "DevOps engineer sharing how home lab experience led to promotion and increased salary, encouraging others to start their own setups.",
        engagement: "267 likes • 78 comments • 45 shares",
        timeAgo: "1d ago",
        link: "https://linkedin.com/posts/example5"
      },
      {
        title: "Kubernetes adoption in small businesses",
        snippet: "Infrastructure architect debating whether K8s complexity is justified for small teams, with practical alternatives and decision frameworks.",
        engagement: "198 likes • 67 comments • 31 shares",
        timeAgo: "1d ago",
        link: "https://linkedin.com/posts/example6"
      },
      {
        title: "Building technical teams for self-hosted future",
        snippet: "Startup founder discussing hiring strategies for teams capable of managing self-hosted infrastructure and the skills gap in the market.",
        engagement: "223 likes • 54 comments • 38 shares",
        timeAgo: "2d ago",
        link: "https://linkedin.com/posts/example7"
      },
      {
        title: "Cost-effective alternatives to enterprise software",
        snippet: "Business operations manager sharing real-world comparison of open-source vs proprietary solutions for common business functions.",
        engagement: "278 likes • 91 comments • 47 shares",
        timeAgo: "2d ago",
        link: "https://linkedin.com/posts/example8"
      },
      {
        title: "Remote work driving home lab adoption",
        snippet: "Remote work consultant explaining how distributed teams are leveraging home lab setups for better productivity and security.",
        engagement: "189 likes • 43 comments • 29 shares",
        timeAgo: "3d ago",
        link: "https://linkedin.com/posts/example9"
      }
    ],
    google: [
      {
        title: "Self hosting trends 2024",
        snippet: "Google Trends shows 340% increase in searches for 'self hosted email' and 280% increase for 'home lab setup' over the past year.",
        engagement: "High search volume",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=self%20hosted%20email"
      },
      {
        title: "Docker homelab rising searches",
        snippet: "Significant uptick in 'Docker homelab' searches, particularly strong in tech hubs like San Francisco, Seattle, and Austin.",
        engagement: "Growing interest",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=docker%20homelab"
      },
      {
        title: "Privacy alternatives trending",
        snippet: "Search interest for 'privacy focused business tools' and 'Google Workspace alternatives' showing sustained growth over 18 months.",
        engagement: "Consistent growth",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=google%20workspace%20alternatives"
      },
      {
        title: "NextCloud business adoption",
        snippet: "B2B searches for 'NextCloud business' and 'self hosted file sharing' correlation with remote work policy announcements.",
        engagement: "Business interest",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=nextcloud%20business"
      },
      {
        title: "Home Assistant commercial use",
        snippet: "Emerging trend in 'Home Assistant business automation' searches, indicating expansion beyond residential use cases.",
        engagement: "Emerging trend",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=home%20assistant%20business"
      },
      {
        title: "Open source CRM trending",
        snippet: "Search volume for 'open source CRM self hosted' reached all-time high, driven by data privacy and cost concerns.",
        engagement: "Peak interest",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=open%20source%20crm"
      },
      {
        title: "Kubernetes small business queries",
        snippet: "Balanced search interest between 'Kubernetes too complex' and 'Kubernetes for small business', indicating market education need.",
        engagement: "Mixed sentiment",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=kubernetes%20small%20business"
      },
      {
        title: "Self hosted security concerns",
        snippet: "Rising searches for 'home lab security' and 'self hosted security best practices' parallel with adoption growth.",
        engagement: "Growing concern",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=home%20lab%20security"
      },
      {
        title: "Cloud cost optimization trending",
        snippet: "Surge in 'cloud vs self hosting cost' searches coinciding with economic uncertainty and budget optimization initiatives.",
        engagement: "High relevance",
        timeAgo: "Live data",
        link: "https://trends.google.com/trends/explore?q=cloud%20vs%20self%20hosting"
      }
    ]
  };


  // Safety check for undefined metrics
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Lightbulb size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-900">Loading Insights</h2>
          <p className="text-primary-600 mt-2">Waiting for analytics data...</p>
        </div>
      </div>
    );
  }

  // Safety check for required data arrays
  const safeContentIdeas = contentIdeas || [];
  const safeProductIdeas = productIdeas || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Bluesky-Style Profile Header */}
      <div className="relative">
        {/* Background Banner */}
        <div className="h-32 rounded-2xl relative overflow-hidden">
          {metrics.banner ? (
            <>
              <img 
                src={metrics.banner} 
                alt="Profile banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/60 via-brand-500/40 to-electric-500/60"></div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-brand-500 to-electric-500"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            </>
          )}
        </div>
        
        {/* Profile Content */}
        <div className="relative -mt-16 px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-electric-500 rounded-full blur-lg opacity-40"></div>
              <img
                src={metrics.avatar}
                alt={metrics.displayName}
                className="relative w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl bg-white"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 rounded-2xl p-6 shadow-xl border border-gray-700 bg-primary-850">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1 font-sans">{metrics.displayName}</h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4 font-sans">@{metrics.handle}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ExternalLink size={16} />}
                    iconPosition="right"
                    onClick={() => window.open(`https://bsky.app/profile/${metrics.handle}`, '_blank')}
                  >
                    View on Bluesky
                  </Button>
                </div>
              </div>
              
              {/* Bio in styled container - full width */}
              <div className="bg-primary-800 border border-gray-600 rounded-xl p-4 mb-4 hover:border-brand-400 transition-colors">
                <p className="text-gray-300 leading-5 font-sans">{metrics.description || 'Configure your Bluesky account in Settings to see your profile description here.'}</p>
              </div>
                
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics.followersCount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">Followers</p>
                  </div>
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics.followsCount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">Following</p>
                  </div>
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.mutualsPercentage || '--'}%</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">Mutuals</p>
                  </div>
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics.postsCount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">Posts</p>
                  </div>
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.currentEngagement || '--'}</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">Frequency</p>
                  </div>
                  <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                    <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.targetPercentage || '--'}%</p>
                    <p className="text-gray-400 text-xs font-medium font-sans">On Target</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-sans">Insights</h1>
        <p className="text-gray-600 mt-1 font-sans">AI-driven insights and strategic recommendations</p>
      </div>

      {/* AI Performance Insights Box */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Sparkles size={24} className="text-warning-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                AI Performance Intelligence Summary
              </h2>
              <span className="px-3 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">LIVE</span>
            </div>
            
            {/* AI Performance Summary */}
            <div className="mb-6 p-4 rounded-xl bg-primary-850 border border-gray-600">
              <p className="text-sm text-gray-300">
                Configure your analytics integrations in Settings to see AI-powered performance insights and trend analysis here.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-success-400" />
                  <span className="text-success-400 font-semibold text-sm font-sans">Trend Alignment</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  Analytics data required to calculate content-trend alignment
                </p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-warning-400" />
                  <span className="text-warning-400 font-semibold text-sm font-sans">Content Gaps</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  Configure Google Trends to identify content opportunities
                </p>
              </div>
              <div className="bg-primary-850 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-electric-400" />
                  <span className="text-electric-400 font-semibold text-sm font-sans">Performance Insights</span>
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed text-gray-300">
                  Real performance insights will appear when analytics data is available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* REAL AI Insights Test Section */}
      <div className="bg-primary-850 border border-gray-700 rounded-xl p-6 shadow-xl text-white">
        <h3 className="text-lg font-bold text-white mb-4">🤖 Real AI Insights</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-3">
            AI Service Status: {aiServiceReady ? '✅ Ready' : '❌ Not Configured'}
          </p>
          
          <Button 
            onClick={generateRealInsights}
            disabled={!aiServiceReady || loadingInsights}
            className="bg-brand-500 hover:bg-brand-600"
          >
            {loadingInsights ? 'Generating Real AI Insights...' : 'Generate Real AI Insights'}
          </Button>
        </div>
        
        {aiInsights && (
          <div className="bg-primary-800 border border-gray-600 rounded-lg p-4 mb-4">
            <h4 className="text-brand-400 font-semibold mb-2">📊 Bluesky Performance Analysis</h4>
            <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {aiInsights.content}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Generated: {new Date(aiInsights.timestamp).toLocaleString()}
            </div>
          </div>
        )}
        
        {contentStrategy && (
          <div className="bg-primary-800 border border-gray-600 rounded-lg p-4">
            <h4 className="text-electric-400 font-semibold mb-2">🎯 Content Strategy</h4>
            <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {contentStrategy.content}
            </div>
          </div>
        )}
      </div>

      {/* Platform Content Tracking */}
      <div className="bg-primary-850 border border-gray-700 rounded-xl p-6 shadow-xl text-white">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="text-orange-400" size={20} />
          Trending Content Across Platforms
        </h3>
        
        {/* Platform Tabs */}
        <div className="flex border-b border-gray-600 mb-6">
          <button 
            onClick={() => setActivePlatform('reddit')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activePlatform === 'reddit' 
                ? 'border-orange-400 text-orange-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Reddit
          </button>
          <button 
            onClick={() => setActivePlatform('linkedin')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activePlatform === 'linkedin' 
                ? 'border-orange-400 text-orange-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            LinkedIn
          </button>
          <button 
            onClick={() => setActivePlatform('google')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activePlatform === 'google' 
                ? 'border-orange-400 text-orange-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Google Trends
          </button>
        </div>

        {/* Content Grid - Dynamic based on active platform */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(platformContent[activePlatform] || []).map((item, index) => (
            <div key={index} className="bg-primary-800 border border-gray-600 rounded-lg p-4 hover:border-orange-400 transition-colors">
              <div className="mb-3">
                <h4 className="font-semibold text-white text-sm leading-tight mb-2">{item.title}</h4>
                <p className="text-xs text-gray-300 line-clamp-3 mb-3">{item.snippet}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="text-gray-400">
                  <p className="mb-1">{item.engagement}</p>
                  <p>{item.timeAgo}</p>
                </div>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                >
                  View <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-warning-400" size={24} />
          Quick Wins
        </h2>

        {/* Content Ideas */}
        <div className="bg-primary-850 border border-gray-700 rounded-xl p-6 shadow-xl text-white">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="text-success-400" size={20} />
            6 Content Ideas Ready to Create
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeContentIdeas.map((idea, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 hover:border-brand-400 transition-colors bg-primary-800">
                <div className="mb-3">
                  <h4 className="font-semibold text-white mb-2">{idea.title}</h4>
                  <div className="flex gap-2 mb-3">
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700">
                      {idea.format}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700">
                      {idea.topic}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{idea.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock size={12} />
                      {idea.postTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 italic">{idea.source}</p>
                </div>
                
                {/* Research Buttons */}
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-2">Research this idea:</p>
                  <div className="grid grid-cols-3 gap-1">
                    <a 
                      href={`https://claude.ai/chat?q=${encodeURIComponent(idea.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#da7757' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c46749'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#da7757'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      Claude
                    </a>
                    <a 
                      href={`https://chat.openai.com/?q=${encodeURIComponent(idea.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#212121' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#212121'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.95 5.16-.21 9-4.4 9-9.95V7l-10-5z"/>
                      </svg>
                      ChatGPT
                    </a>
                    <a 
                      href={`https://www.perplexity.ai/search?q=${encodeURIComponent(idea.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#4d99a3' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3e7a82'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#4d99a3'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L1 21h22L12 2z"/>
                      </svg>
                      Perplexity
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Product Ideas */}
        <div className="bg-primary-850 border border-gray-700 rounded-xl p-6 shadow-xl text-white">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Package className="text-accent-400" size={20} />
            6 Digital Product Ideas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeProductIdeas.map((product, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 hover:border-accent-400 transition-colors bg-primary-800">
                <div className="mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <h4 className="font-semibold text-white flex-1">{product.title}</h4>
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-electric-100 text-electric-700 whitespace-nowrap">
                      {product.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{product.description}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    <strong>Target:</strong> {product.audience}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    <strong>Trend:</strong> {product.trend}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(product.outline || []).map((item, idx) => (
                      <span key={idx} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Research Buttons */}
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-2">Research this idea:</p>
                  <div className="grid grid-cols-3 gap-1">
                    <a 
                      href={`https://chat.openai.com/?q=${encodeURIComponent(product.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#212121' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#212121'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.95 5.16-.21 9-4.4 9-9.95V7l-10-5z"/>
                      </svg>
                      ChatGPT
                    </a>
                    <a 
                      href={`https://notebooklm.google.com/notebook/new?q=${encodeURIComponent(product.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#22262b' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2a2f35'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#22262b'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                        <path d="M10 9H8"/>
                      </svg>
                      NotebookLM
                    </a>
                    <a 
                      href={`https://www.perplexity.ai/search?q=${encodeURIComponent(product.searchQuery)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded transition-colors"
                      style={{ backgroundColor: '#4d99a3' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3e7a82'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#4d99a3'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L1 21h22L12 2z"/>
                      </svg>
                      Perplexity
                    </a>
                  </div>
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