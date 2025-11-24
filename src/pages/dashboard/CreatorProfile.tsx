import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft, 
  Instagram, 
  Users, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Globe,
  Eye,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/loading-spinner';
import { getApiUrl } from '@/lib/api';

interface Creator {
  id: string;
  name: string;
  subcategory: string;
  ig_handle: string;
}

interface InstagramProfile {
  username: string;
  id: string;
  name: string;
  profile_picture_url: string;
  biography: string;
  website: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  category: string;
}

interface Metrics {
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgViews: number;
  activeFollowerEstimate: number;
  bestPostingWindow: string;
  hashtagStats: Array<{ hashtag: string; count: number }>;
  captionStats: {
    avgLength: number;
    percentLongCaptions100: number;
  };
  growth: {
    percentChange7d: number;
    percentChange30d: number;
    velocity: number;
    nextMilestones: number[];
  };
}

interface MediaPost {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
  timestamp: string;
  caption: string;
  like_count: number;
  comments_count: number;
  video_views: number;
}

interface CreatorAnalytics {
  profile: InstagramProfile;
  metrics: Metrics;
  recentMedia: MediaPost[];
}

const CreatorProfile: React.FC = () => {
  const { igHandle, id } = useParams<{ igHandle?: string; id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const creator = location.state?.creator;

  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator by ID if we have numeric ID
  const fetchCreatorById = async (creatorId: string) => {
    try {
      const response = await fetch(getApiUrl(`api/creators/${creatorId}`));
      if (!response.ok) {
        throw new Error('Failed to fetch creator data');
      }
      const data = await response.json();
      return data.creator;
    } catch (err) {
      console.error('Error fetching creator by ID:', err);
      throw err;
    }
  };

  // Fetch creator analytics from backend
  const fetchAnalytics = async () => {
    let targetHandle = igHandle;
    
    // If we have a numeric ID instead of handle, fetch the creator first
    if (id && !igHandle) {
      try {
        const creator = await fetchCreatorById(id);
        setCreatorData(creator);
        targetHandle = creator.ig_handle;
      } catch (err) {
        setError('Failed to load creator data');
        return;
      }
    }

    if (!targetHandle) return;

    try {
      setLoading(true);
      setError(null);

      const cleanHandle = targetHandle.replace('@', '');
      const response = await fetch(`/api/insights?username=${cleanHandle}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch creator analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load creator analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [igHandle, id]);

  // Format numbers
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Format percentage
  const formatPercentage = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0.00%';
    }
    return `${num.toFixed(2)}%`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get engagement rate color
  const getEngagementColor = (rate: number | null | undefined): string => {
    if (rate === null || rate === undefined || isNaN(rate)) return 'text-gray-600';
    if (rate >= 3) return 'text-green-600';
    if (rate >= 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get growth color
  const getGrowthColor = (change: number | null | undefined): string => {
    if (change === null || change === undefined || isNaN(change)) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading creator analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/explore-creators')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to Load Analytics</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/explore-creators')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
      </div>

      {(analytics || creatorData || creator) && (
        <>
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={analytics?.profile?.profile_picture_url} 
                    alt={analytics?.profile?.name || creatorData?.name || creator?.name} 
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                    {(analytics?.profile?.name || creatorData?.name || creator?.name)
                      ?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {analytics?.profile?.name || creatorData?.name || creator?.name}
                      </h1>
                      <div className="flex items-center text-lg text-gray-600 mt-1">
                        <Instagram className="h-5 w-5 mr-2" />
                        @{analytics?.profile?.username || creatorData?.ig_handle || creator?.ig_handle || igHandle}
                      </div>
                      {(creator || creatorData) && (
                        <Badge variant="secondary" className="mt-2">
                          {creator?.subcategory || creatorData?.category || creatorData?.subcategory}
                        </Badge>
                      )}
                      {/* Show basic creator info if analytics not available */}
                      {!analytics && creatorData && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>{formatNumber(creatorData.followers_count)} followers</span>
                          <span>{formatPercentage(creatorData.engagement_rate)} engagement</span>
                        </div>
                      )}
                    </div>
                    
                    {analytics && (
                      <div className="flex space-x-4 mt-4 md:mt-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatNumber(analytics.profile.followers_count)}
                          </div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatNumber(analytics.profile.following_count)}
                          </div>
                          <div className="text-sm text-gray-600">Following</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatNumber(analytics.profile.media_count)}
                          </div>
                          <div className="text-sm text-gray-600">Posts</div>
                        </div>
                      </div>
                    )}
                    {!analytics && creatorData && (
                      <div className="flex space-x-4 mt-4 md:mt-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatNumber(creatorData.followers_count)}
                          </div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPercentage(creatorData.engagement_rate)}
                          </div>
                          <div className="text-sm text-gray-600">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {creatorData.category || 'Creator'}
                          </div>
                          <div className="text-sm text-gray-600">Category</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {analytics?.profile?.biography && (
                    <p className="text-gray-700 mt-4">{analytics.profile.biography}</p>
                  )}
                  
                  {analytics?.profile?.website && (
                    <div className="flex items-center mt-2">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      <a 
                        href={analytics.profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {analytics.profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Tabs */}
          {analytics ? (
            <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="content">Recent Posts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getEngagementColor(analytics.metrics.engagementRate)}`}>
                      {formatPercentage(analytics.metrics.engagementRate)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Avg Likes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(analytics.metrics.avgLikes)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Avg Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(analytics.metrics.avgComments)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Avg Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {analytics.metrics.avgViews && analytics.metrics.avgViews > 0 ? 
                        formatNumber(analytics.metrics.avgViews) : 
                        <span className="text-gray-500 text-base">Limited Access</span>
                      }
                    </div>
                    {analytics.metrics.avgViews && analytics.metrics.avgViews > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Per video/reel</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Best Posting Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Best Posting Window
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {analytics.metrics.bestPostingWindow || 'No data available'}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Hashtags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.metrics.hashtagStats?.slice(0, 10).map((tag, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-blue-600">{tag.hashtag}</span>
                          <Badge variant="secondary">{tag.count}</Badge>
                        </div>
                      )) || <p className="text-gray-500">No hashtag data available</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Caption Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Caption Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Average Length</span>
                        <span className="font-semibold">
                          {analytics.metrics.captionStats?.avgLength ? analytics.metrics.captionStats.avgLength.toFixed(0) : '0'} chars
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Long Captions (100+)</span>
                        <span className="font-semibold">
                          {formatPercentage((analytics.metrics.captionStats?.percentLongCaptions100 || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Followers</span>
                        <span className="font-semibold">
                          {formatPercentage((analytics.metrics.activeFollowerEstimate || 0))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Growth Tab */}
            <TabsContent value="growth" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      7-Day Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getGrowthColor(analytics.metrics.growth?.percentChange7d || 0)}`}>
                      {analytics.metrics.growth?.percentChange7d !== null && analytics.metrics.growth?.percentChange7d !== undefined ? 
                        `${analytics.metrics.growth.percentChange7d > 0 ? '+' : ''}${formatPercentage(analytics.metrics.growth.percentChange7d)}` : 
                        <span className="text-gray-500 text-base">New Profile</span>
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      30-Day Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getGrowthColor(analytics.metrics.growth?.percentChange30d || 0)}`}>
                      {analytics.metrics.growth?.percentChange30d !== null && analytics.metrics.growth?.percentChange30d !== undefined ? 
                        `${analytics.metrics.growth.percentChange30d > 0 ? '+' : ''}${formatPercentage(analytics.metrics.growth.percentChange30d)}` : 
                        <span className="text-gray-500 text-base">Tracking...</span>
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Growth Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {analytics.metrics.growth?.velocity && analytics.metrics.growth.velocity !== 0 ? 
                        `${formatNumber(analytics.metrics.growth.velocity)}/day` : 
                        <span className="text-gray-500 text-base">Calculating...</span>
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Milestones */}
              {analytics.metrics.growth?.nextMilestones && analytics.metrics.growth.nextMilestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Next Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analytics.metrics.growth.nextMilestones.map((milestone, index) => (
                        <Badge key={index} variant="outline">
                          {formatNumber(milestone)} followers
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Recent Posts Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.recentMedia?.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                      <img 
                        src={post.thumbnail_url || post.media_url} 
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{formatDate(post.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          {post.media_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          {formatNumber(post.like_count)}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                          {formatNumber(post.comments_count)}
                        </div>
                        {post.video_views && (
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-green-500" />
                            {formatNumber(post.video_views)}
                          </div>
                        )}
                      </div>
                      
                      {post.caption && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {post.caption.slice(0, 100)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          ) : creatorData && (
            /* Basic Creator Info when analytics not available */
            <Card>
              <CardHeader>
                <CardTitle>Creator Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(creatorData.followers_count)}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPercentage(creatorData.engagement_rate)}
                    </div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {creatorData.category || creatorData.subcategory || 'Creator'}
                    </div>
                    <div className="text-sm text-gray-600">Category</div>
                  </div>
                </div>
                {creatorData.bio && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">About</h4>
                    <p className="text-gray-700">{creatorData.bio}</p>
                  </div>
                )}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Detailed analytics are not available for this creator at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CreatorProfile;