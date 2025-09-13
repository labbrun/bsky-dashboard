import React from 'react';
import { 
  Clock,
  Target,
  TrendingUp,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Lightbulb
} from 'lucide-react';

import { Button } from '../components/ui/UntitledUIComponents';

function Calendar({ metrics }) {
  return (
    <div className="space-y-8 font-sans">
      {/* Profile Header - Same as other pages */}
      <div className="relative">
        <div className="h-32 rounded-2xl relative overflow-hidden">
          {metrics?.banner ? (
            <>
              <img 
                src={metrics.banner} 
                alt="Profile banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/60 via-brand-500/40 to-electric-500/60"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-700 via-brand-600 to-electric-600"></div>
          )}
        </div>
        
        <div className="relative -mt-16 px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-electric-500 rounded-full blur-lg opacity-40"></div>
              <img
                src={metrics?.avatar || "https://avatar.vercel.sh/bluesky.svg?text=BS"}
                alt="Profile"
                className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl"
                onError={(e) => {
                  e.target.src = "https://avatar.vercel.sh/bluesky.svg?text=BS";
                }}
              />
            </div>
            
            <div className="flex-1 rounded-2xl p-6 shadow-xl border border-gray-700 bg-primary-850">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1 font-sans">
                    {metrics?.displayName || "Loading..."}
                  </h1>
                  <p className="text-lg text-brand-400 font-semibold mb-3 leading-4 font-sans">
                    @{metrics?.handle || "loading.bsky.social"}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ExternalLink size={16} />}
                    iconPosition="right"
                    onClick={() => window.open(`https://bsky.app/profile/${metrics?.handle || 'bluesky'}`, '_blank')}
                  >
                    View on Bluesky
                  </Button>
                </div>
              </div>
              
              <div className="bg-primary-800 border border-gray-600 rounded-xl p-4 mb-4 hover:border-brand-400 transition-colors">
                <p className="text-gray-300 leading-5 font-sans">
                  {metrics?.description || 'Configure your Bluesky account in Settings to see your profile description here.'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.followersCount?.toLocaleString() || '0'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Followers</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.followsCount?.toLocaleString() || '0'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Following</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.scheduledPosts || '0'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Scheduled</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.postsCount?.toLocaleString() || '0'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Posts</p>
                </div>
                <div className="bg-primary-800 border border-gray-600 rounded-xl p-3 text-center hover:border-brand-400 transition-colors min-h-[80px] flex flex-col justify-center">
                  <p className="text-xl font-bold text-white font-sans mb-1">{metrics?.drafts || '0'}</p>
                  <p className="text-gray-400 text-xs font-medium font-sans">Connected</p>
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

      {/* Schedule Post Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          icon={<ExternalLink size={20} />}
          onClick={() => window.open('https://postiz.dedsec.one/launches', '_blank')}
          className="text-lg px-8 py-4"
        >
          Schedule Post in Postiz
        </Button>
      </div>

      {/* AI Content Strategy Summary */}
      <div className="bg-primary-850 rounded-2xl p-6 shadow-xl border border-gray-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-400/20 to-electric-500/20 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Sparkles size={24} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold font-sans">
                  AI Content Strategy Intelligence
                </h2>
                <span className="px-3 py-1 text-xs bg-brand-400 text-brand-900 rounded-full font-bold">LIVE</span>
              </div>
              
              {/* Performance-Based Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-400 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Top Performing Topics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-primary-800/50 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">Privacy & Security</span>
                        <p className="text-gray-300 text-sm">Average 4.2x engagement</p>
                      </div>
                      <div className="text-success-400 font-bold">+320%</div>
                    </div>
                    <div className="flex items-center justify-between bg-primary-800/50 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">Homelab Tutorials</span>
                        <p className="text-gray-300 text-sm">High reply engagement</p>
                      </div>
                      <div className="text-success-400 font-bold">+280%</div>
                    </div>
                    <div className="flex items-center justify-between bg-primary-800/50 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">Self-Hosting Tips</span>
                        <p className="text-gray-300 text-sm">Strong audience match</p>
                      </div>
                      <div className="text-success-400 font-bold">+245%</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-400 mb-3 flex items-center gap-2">
                    <Target size={18} />
                    Optimal Timing & Strategy
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-primary-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-brand-400" />
                        <span className="text-white font-medium">Best Posting Times</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        <strong>Weekdays:</strong> 9-11 AM (peak), 1-3 PM, 7-9 PM EST<br/>
                        <strong>Content type:</strong> Technical tutorials perform 40% better in morning slots
                      </p>
                    </div>
                    
                    <div className="bg-primary-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-brand-400" />
                        <span className="text-white font-medium">Engagement Patterns</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Configure analytics integrations to see your engagement patterns and optimization tips based on real performance data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Ideas Row */}
              <div className="mt-6 pt-6 border-t border-gray-600/50">
                <h3 className="text-lg font-semibold text-brand-400 mb-4 flex items-center gap-2">
                  <Lightbulb size={18} />
                  Trending Content Ideas for This Week
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-800/30 border border-brand-400/30 rounded-lg p-4 hover:bg-primary-800/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                      <span className="text-white font-medium text-sm">Privacy Alternative Discovery</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Share a new privacy-focused tool or service you've found. High engagement topic.
                    </p>
                  </div>

                  <div className="bg-primary-800/30 border border-brand-400/30 rounded-lg p-4 hover:bg-primary-800/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
                      <span className="text-white font-medium text-sm">Quick Homelab Tips</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Share a quick, actionable tip. These get high saves and replies from your audience.
                    </p>
                  </div>

                  <div className="bg-primary-800/30 border border-brand-400/30 rounded-lg p-4 hover:bg-primary-800/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-electric-400 rounded-full"></div>
                      <span className="text-white font-medium text-sm">Tech Opinion/Take</span>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Share a thoughtful opinion on current tech trends. Drives discussion and replies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="mt-6 pt-6 border-t border-gray-600/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-gray-400">Avg. Weekly Posts:</span>
                      <span className="text-white font-semibold ml-2">8.5</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Top Engagement Time:</span>
                      <span className="text-white font-semibold ml-2">10:30 AM EST</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Content Sweet Spot:</span>
                      <span className="text-white font-semibold ml-2">180-250 characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Calendar;