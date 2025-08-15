import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, FileText, ExternalLink } from 'lucide-react';
import { fetchProfileData, generateCommentUrl } from '../services/profileService';
import { Card, Button, Avatar, Skeleton } from '../components/ui/UntitledUIComponents';
import ImageGallery from './ImageGallery';

function ProfileCard({ handle, showRecentPost = false, showReadMore = false, className = '' }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await fetchProfileData(handle);
        setProfileData(data);
      } catch (error) {
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
      <Card className={`${className}`} padding="sm">
        <div className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1">
            <Skeleton variant="title" className="mb-2 w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  if (!profileData) {
    return (
      <Card className={`bg-gray-50 ${className}`} padding="sm">
        <div className="text-center text-gray-500">
          <p>Profile unavailable</p>
          <p className="text-sm">@{handle}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-white to-gray-50 ${className}`} padding="sm" hover={true}>
      <div className="flex items-start gap-4">
        <Avatar
          src={profileData.avatar}
          alt={profileData.displayName}
          size="lg"
          status="online"
          className="border-2 border-brand-500"
        />
        
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

      {showRecentPost && (profileData.recentPost || profileData.recentPosts) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Recent posts:</h4>
            {showReadMore && profileData.recentPosts && profileData.recentPosts.length > 1 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAllPosts(!showAllPosts)}
              >
                {showAllPosts ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
          
          {/* Display posts */}
          {(() => {
            // Get posts to display
            const postsToShow = profileData.recentPosts && profileData.recentPosts.length > 0 
              ? (showAllPosts ? profileData.recentPosts : [profileData.recentPosts[0]])
              : profileData.recentPost ? [profileData.recentPost] : [];

            return postsToShow.map((post, index) => (
              <div key={post.uri || index} className="bg-gray-50 rounded-xl p-4 mb-3 last:mb-0">
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{post.text}</p>
                
                <ImageGallery 
                  images={post.images}
                  size="lg"
                  maxImages={3}
                  className="mb-3"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{post.likeCount || 0} likes</span>
                    <span>{post.replyCount || 0} replies</span>
                    <span>{post.repostCount || 0} reposts</span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<MessageSquare size={12} />}
                    onClick={() => window.open(generateCommentUrl(profileData.handle, post.uri), '_blank')}
                  >
                    Comment
                    <ExternalLink size={10} />
                  </Button>
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </Card>
  );
}

export default ProfileCard;