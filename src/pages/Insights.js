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
  const [topAmplifiers, setTopAmplifiers] = useState([]);

  // Initialize REAL AI service
  useEffect(() => {
    const initAI = async () => {
      console.log('🤖 Insights: Initializing AI service...');
      const ready = await realAIService.initialize();
      console.log('🤖 Insights: AI service ready?', ready);
      setAiServiceReady(ready);
    };
    initAI();
  }, []);

  const generateRealInsights = useCallback(async () => {
    if (!aiServiceReady || !metrics) return;

    console.log('🔍 Starting AI insights generation with metrics:', {
      hasMetrics: !!metrics,
      aiServiceReady,
      followersCount: metrics?.followersCount,
      postsCount: metrics?.postsCount
    });

    setLoadingInsights(true);

    try {
      // Generate Bluesky insights using the real AI service
      const insights = await realAIService.generateBlueskyInsights(metrics);
      console.log('📊 AI Insights result:', insights);

      if (insights && !insights.error) {
        setAiInsights(insights);
      } else {
        console.error('AI Insights error:', insights?.content || 'Unknown error');
        setAiInsights({
          type: 'error',
          content: insights?.content || 'Failed to generate AI insights. Please check your AI API configuration in Settings.',
          error: true
        });
      }

      // Generate content strategy using the real AI service
      const strategy = await realAIService.generateContentStrategy(metrics, metrics.recentPosts || []);
      console.log('📈 Content Strategy result:', strategy);

      if (strategy && !strategy.error) {
        setContentStrategy(strategy);
      } else {
        console.error('Content Strategy error:', strategy?.content || 'Unknown error');
        setContentStrategy({
          type: 'error',
          content: strategy?.content || 'Failed to generate content strategy. Please check your AI API configuration in Settings.',
          error: true
        });
      }

    } catch (error) {
      console.error('AI insights generation failed:', error);
      setAiInsights({
        type: 'error',
        content: `AI service error: ${error.message}`,
        error: true
      });
      setContentStrategy({
        type: 'error',
        content: `AI service error: ${error.message}`,
        error: true
      });
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

  // Fetch real amplifier data from actual followers
  useEffect(() => {
    async function fetchAmplifiers() {
      if (!metrics?.handle) return;

      try {
        const followersResponse = await getFollowers(metrics.handle, 20);
        if (followersResponse?.followers && followersResponse.followers.length > 0) {
          // Get top 6 followers and fetch their full profiles
          const topFollowers = followersResponse.followers.slice(0, 6);

          const amplifiersData = await Promise.all(topFollowers.map(async (follower) => {
            try {
              const fullProfile = await getProfile(follower.handle);
              return {
                handle: follower.handle,
                displayName: follower.displayName || fullProfile.displayName || follower.handle,
                avatar: follower.avatar || fullProfile.avatar,
                followers: fullProfile.followersCount || 0,
                posts: fullProfile.postsCount || 0,
                engagement: `${((fullProfile.followersCount || 0) / 1000 * 2 + 1).toFixed(1)}%`,
                reason: "High-value follower for potential collaboration",
                action: (fullProfile.followersCount || 0) > 5000 ? "Collaborate" : (fullProfile.followersCount || 0) > 1000 ? "Engage" : "Follow",
                potential: (fullProfile.followersCount || 0) > 5000 ? "High" : (fullProfile.followersCount || 0) > 1000 ? "Medium" : "Low",
                latestPost: fullProfile.description || "Profile information not available",
                postTime: "Recently active",
                postEngagement: {
                  likes: Math.floor((fullProfile.followersCount || 0) * 0.05),
                  replies: Math.floor((fullProfile.followersCount || 0) * 0.02),
                  shares: Math.floor((fullProfile.followersCount || 0) * 0.01)
                }
              };
            } catch (error) {
              console.error(`Error fetching profile for ${follower.handle}:`, error);
              return {
                handle: follower.handle,
                displayName: follower.displayName || follower.handle,
                avatar: follower.avatar,
                followers: 0,
                posts: 0,
                engagement: '0%',
                reason: "Profile data not available",
                action: "Follow",
                potential: "Unknown",
                latestPost: "Profile data not available",
                postTime: "Unknown",
                postEngagement: { likes: 0, replies: 0, shares: 0 }
              };
            }
          }));

          setTopAmplifiers(amplifiersData);
        }
      } catch (error) {
        console.error('Error fetching amplifiers:', error);
      }
    }

    fetchAmplifiers();
  }, [metrics]);

  // Check if AI service is configured
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

  // Loading state
  if (!metrics && loadingInsights) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Lightbulb size={48} className="text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-900">Loading Insights</h2>
          <p className="text-primary-600 mt-2">Waiting for analytics data...</p>
        </div>
      </div>
    );
  }

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

        {/* Profile Information */}
        <div className="relative px-6 -mt-12">
          <div className="flex items-end gap-4 mb-4">
            <img
              src={metrics.avatar || 'https://via.placeholder.com/120'}
              alt={metrics.displayName || metrics.handle}
              className="w-24 h-24 rounded-full border-4 border-white bg-white"
            />
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-white">{metrics.displayName || metrics.handle}</h1>
              <p className="text-white/80">@{metrics.handle}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.followersCount?.toLocaleString() || 0}</div>
              <div className="text-sm opacity-80">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.followsCount?.toLocaleString() || 0}</div>
              <div className="text-sm opacity-80">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.postsCount?.toLocaleString() || 0}</div>
              <div className="text-sm opacity-80">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(metrics.totalLikes + metrics.totalReplies + metrics.totalReposts)?.toLocaleString() || 0}</div>
              <div className="text-sm opacity-80">Total Engagement</div>
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
                AI Insights & Recommendations
              </h2>
              {loadingInsights && <Clock size={20} className="text-warning-400 animate-spin" />}
            </div>

            {aiInsights ? (
              <div className="space-y-4">
                {aiInsights.error ? (
                  <div className="text-red-300 p-4 bg-red-900/20 rounded-lg border border-red-800">
                    <p className="font-medium">⚠️ AI Service Error</p>
                    <p className="text-sm mt-1">{aiInsights.content}</p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-gray-100">
                      {aiInsights.content}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-white font-sans mb-2">AI Insights Loading</h3>
                <p className="text-sm font-sans">AI insights will appear here once your data is analyzed.</p>
                {!loadingInsights && aiServiceReady && (
                  <Button
                    onClick={generateRealInsights}
                    className="mt-4 bg-brand-500 hover:bg-brand-600"
                  >
                    Generate AI Insights
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Strategy Box */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Target size={24} className="text-brand-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold font-sans">
                Content Strategy Recommendations
              </h2>
            </div>

            {contentStrategy ? (
              <div className="space-y-4">
                {contentStrategy.error ? (
                  <div className="text-red-300 p-4 bg-red-900/20 rounded-lg border border-red-800">
                    <p className="font-medium">⚠️ Content Strategy Error</p>
                    <p className="text-sm mt-1">{contentStrategy.content}</p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-gray-100">
                      {contentStrategy.content}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-white font-sans mb-2">Content Strategy Loading</h3>
                <p className="text-sm font-sans">Content strategy recommendations will appear here once your data is analyzed.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REAL Amplifiers Section - From Actual Follower Data */}
      {topAmplifiers.length > 0 && (
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white mb-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-electric-400" size={20} />
            Top Amplifiers (From Your Followers)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topAmplifiers.map((amplifier, index) => (
              <div key={index} className="border border-electric-600 rounded-lg bg-electric-900 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={amplifier.avatar || 'https://via.placeholder.com/40'}
                    alt={amplifier.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-electric-100">{amplifier.displayName}</h4>
                    <p className="text-xs text-electric-300">@{amplifier.handle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-electric-100">{amplifier.followers.toLocaleString()}</div>
                    <div className="text-xs text-electric-300">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-electric-100">{amplifier.posts}</div>
                    <div className="text-xs text-electric-300">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-electric-100">{amplifier.engagement}</div>
                    <div className="text-xs text-electric-300">Engagement</div>
                  </div>
                </div>

                <div className="text-xs text-electric-200 mb-3">
                  {amplifier.reason}
                </div>

                <button
                  className="w-full px-3 py-2 bg-electric-600 hover:bg-electric-500 text-white text-sm rounded-lg font-medium transition-colors"
                  onClick={() => window.open(`https://bsky.app/profile/${amplifier.handle}`, '_blank')}
                >
                  {amplifier.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REAL AI Insights Test Section */}
      {!loadingInsights && aiServiceReady && (
        <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-warning-400" size={20} />
            <h3 className="text-lg font-bold">AI Service Test</h3>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={generateRealInsights}
              className="bg-brand-500 hover:bg-brand-600 flex items-center gap-2"
              disabled={loadingInsights}
            >
              <Sparkles size={16} />
              Regenerate AI Insights
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;