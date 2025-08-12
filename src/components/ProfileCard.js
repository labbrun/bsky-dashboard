import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, FileText, ExternalLink } from 'lucide-react';
import { fetchProfileData, generateCommentUrl } from '../services/profileService';

function ProfileCard({ handle, showRecentPost = false, className = '' }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await fetchProfileData(handle);
        setProfileData(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      loadProfile();
    }
  }, [handle]);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
        <div className="text-center text-gray-500">
          <p>Profile unavailable</p>
          <p className="text-sm">@{handle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={profileData.avatar}
            alt={profileData.displayName}
            className="w-12 h-12 rounded-full border-2 border-brand-500 object-cover shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{profileData.displayName}</h3>
          <p className="text-brand-600 font-semibold text-sm mb-2">@{profileData.handle}</p>
          
          {profileData.bio && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{profileData.bio}</p>
          )}
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Users size={14} />
              <span className="font-semibold">{profileData.followersCount.toLocaleString()}</span>
              <span>followers</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span className="font-semibold">{profileData.followsCount.toLocaleString()}</span>
              <span>following</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <FileText size={14} />
              <span className="font-semibold">{profileData.postsCount.toLocaleString()}</span>
              <span>posts</span>
            </div>
          </div>
        </div>
      </div>

      {showRecentPost && profileData.recentPost && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Most recent post:</h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">{profileData.recentPost.text}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{profileData.recentPost.likeCount} likes</span>
                <span>{profileData.recentPost.replyCount} replies</span>
                <span>{profileData.recentPost.repostCount} reposts</span>
              </div>
              <a
                href={generateCommentUrl(profileData.handle, profileData.recentPost.uri)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <MessageSquare size={12} />
                Comment
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;