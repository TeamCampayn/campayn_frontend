import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle, 
  Users, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

type Campaign = {
  id: string;
  campaign_name: string;
  brand_id: string;
  phase: string;
};

type Creator = {
  id: string;
  name: string;
  ig_handle: string;
  profile_picture_url?: string;
};

type Content = {
  id: string;
  campaign_id: string;
  creator_id: string;
  content_type: 'photo' | 'video' | 'reel' | 'story' | string;
  content_url: string | null;
  thumbnail_url: string | null;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  post_url?: string | null;
  posted_at?: string | null;
  performance_metrics?: any;
  creators: Creator;
};

type CampaignDetailsResponse = {
  success: boolean;
  campaign: Campaign;
  contents: Content[];
};

type InsightsResponse = {
  profile: {
    username: string | null;
    followers_count: number | null;
    category: string | null;
    profile_picture_url: string | null;
  };
  metrics: {
    engagementRate: number;
    avgLikes: number;
    avgComments: number;
    avgViews: number;
    growth: {
      trend?: 'growing' | 'declining' | 'stable' | 'insufficient_data';
      percentChange7d?: number | null;
      percentChange30d?: number | null;
      velocity?: number | null;
    };
    bestPostingWindow?: string;
  };
  recentMedia: Array<{
    id: string | null;
    media_type: string | null;
    media_url: string | null;
    thumbnail_url: string | null;
    permalink: string | null;
    timestamp: string | null;
    caption: string | null;
    like_count: number | null;
    comments_count: number | null;
    video_views: number | null;
  }>;
};

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return 0;
  const n = Number(val);
  return n;
};

const formatDisplayNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return '—';
  const n = Number(val);
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const pct = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return '—';
  return `${(Number(val)).toFixed(2)}%`;
};

const getEngagementRate = (likes: number, comments: number, followers: number) => {
  if (!followers || followers === 0) return 0;
  return ((likes + comments) / followers) * 100;
};

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const CampaignAnalytics: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { brand } = useAuth();

  // Fetch campaign details (includes contents + creators)
  const { data: details, isLoading, isError, error, refetch } = useQuery<CampaignDetailsResponse>({
    queryKey: ['campaign-details', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to load campaign');
      return res.json();
    },
    enabled: !!campaignId,
  });

  // Join campaign room for realtime content_posted/metrics updates
  const liveContents = React.useMemo(() => {
    const all = details?.contents || [];
    return all.filter((c) => !!c.post_url);
  }, [details]);

  // Build unique IG handles to fetch insights once per creator
  const handles = React.useMemo(() => {
    const s = new Set<string>();
    for (const c of liveContents) {
      if (c.creators?.ig_handle) s.add(c.creators.ig_handle.replace(/^@/, ''));
    }
    return Array.from(s);
  }, [liveContents]);

  // Fetch specific post insights for each live content
  const postInsightsQueries = useQuery<{ [contentId: string]: any }>({
    queryKey: ['post-insights', liveContents.map(c => c.id).sort().join(',')],
    queryFn: async () => {
      const entries = await Promise.all(liveContents.map(async (content) => {
        if (!content.post_url || !content.creators?.ig_handle) {
          return [content.id, null] as const;
        }
        
        const handle = content.creators.ig_handle.replace(/^@/, '');
        try {
          const res = await fetch(`/api/post-insights?postUrl=${encodeURIComponent(content.post_url)}&username=${encodeURIComponent(handle)}`);
          if (!res.ok) {
            console.log(`Failed to fetch post insights for ${content.id}:`, await res.text());
            return [content.id, null] as const;
          }
          const data = await res.json();
          return [content.id, data] as const;
        } catch (error) {
          console.error(`Error fetching post insights for ${content.id}:`, error);
          return [content.id, null] as const;
        }
      }));
      return entries.reduce((acc, [contentId, data]) => {
        if (data) acc[contentId] = data;
        return acc;
      }, {} as { [k: string]: any });
    },
    enabled: liveContents.length > 0,
  });

  // Fetch general insights per handle for profile data
  const insightsQueries = useQuery<{ [handle: string]: InsightsResponse }>({
    queryKey: ['insights-by-handle', handles.sort().join(',')],
    queryFn: async () => {
      const entries = await Promise.all(handles.map(async (h) => {
        const res = await fetch(`/api/insights?username=${encodeURIComponent(h)}`);
        if (!res.ok) {
          // Return minimal stub to avoid breaking UI
          return [h, null] as const;
        }
        const data: InsightsResponse = await res.json();
        return [h, data] as const;
      }));
      return entries.reduce((acc, [h, data]) => {
        if (data) acc[h] = data;
        return acc;
      }, {} as { [k: string]: InsightsResponse });
    },
    enabled: handles.length > 0,
  });

  const insightsByHandle = insightsQueries.data || {};
  const postInsightsByContentId = postInsightsQueries.data || {};

  const getPostDataForContent = (contentId: string) => {
    const postData = postInsightsByContentId[contentId];
    if (postData && postData.success && postData.post) {
      console.log(`Found specific post data for content ${contentId}:`, postData.post);
      return postData.post;
    }
    console.log(`No specific post data found for content ${contentId}`);
    return null;
  };

  const refreshAll = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['insights-by-handle'] });
    queryClient.invalidateQueries({ queryKey: ['post-insights'] });
  };

  // Calculate combined insights
  const combinedMetrics = React.useMemo(() => {
    if (liveContents.length === 0) return null;

    let totalLikes = 0;
    let totalComments = 0;
    let totalViews = 0;
    let totalFollowers = 0;
    let totalEngagement = 0;
    let validPosts = 0;

    liveContents.forEach((c) => {
      const handle = c.creators?.ig_handle?.replace(/^@/, '') || '';
      const insights = insightsByHandle[handle];
      const postData = getPostDataForContent(c.id);
      
      const likes = postData?.like_count ?? formatNumber(c.performance_metrics?.likes) ?? 0;
      const comments = postData?.comments_count ?? formatNumber(c.performance_metrics?.comments) ?? 0;
      const views = postData?.video_views ?? formatNumber(c.performance_metrics?.views) ?? 0;
      const followers = formatNumber(insights?.profile?.followers_count) ?? 1;

      if (likes > 0 || comments > 0 || views > 0) {
        totalLikes += likes;
        totalComments += comments;
        totalViews += views;
        totalFollowers += followers;
        totalEngagement += getEngagementRate(likes, comments, followers);
        validPosts++;
      }
    });

    return {
      totalLikes,
      totalComments,
      totalViews,
      totalFollowers,
      avgEngagement: validPosts > 0 ? totalEngagement / validPosts : 0,
      totalPosts: validPosts,
      totalCreators: handles.length
    };
  }, [liveContents, insightsByHandle, handles.length]);

  // Prepare data for charts
  const chartData = React.useMemo(() => {
    return liveContents.map((c, index) => {
      const handle = c.creators?.ig_handle?.replace(/^@/, '') || '';
      const insights = insightsByHandle[handle];
      const postData = getPostDataForContent(c.id);
      
      const likes = postData?.like_count ?? formatNumber(c.performance_metrics?.likes) ?? 0;
      const comments = postData?.comments_count ?? formatNumber(c.performance_metrics?.comments) ?? 0;
      const views = postData?.video_views ?? formatNumber(c.performance_metrics?.views) ?? 0;
      const followers = formatNumber(insights?.profile?.followers_count) ?? 1;
      
      return {
        name: c.creators?.name?.split(' ')[0] || `Post ${index + 1}`,
        likes,
        comments,
        views,
        engagement: getEngagementRate(likes, comments, followers),
        followers
      };
    });
  }, [liveContents, insightsByHandle, postInsightsByContentId]);

  const pieData = React.useMemo(() => {
    if (!combinedMetrics) return [];
    
    return [
      { name: 'Likes', value: combinedMetrics.totalLikes, color: '#ef4444' },
      { name: 'Comments', value: combinedMetrics.totalComments, color: '#3b82f6' },
      { name: 'Views', value: combinedMetrics.totalViews, color: '#10b981' }
    ].filter(item => item.value > 0);
  }, [combinedMetrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading campaign analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !details?.campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign Analytics</h1>
              <p className="text-red-600">Failed to load campaign. {(error as Error)?.message}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{details.campaign.campaign_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="outline" className="text-sm">
                    {details.campaign.phase.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">Campaign Analytics Dashboard</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/dashboard/campaigns/${details.campaign.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaign
              </Button>
            </Link>
            <Button onClick={refreshAll} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {liveContents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2 text-gray-900">No Live Posts Yet</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Once the admin adds post links for approved content, you'll see comprehensive analytics and insights here pulled directly from Instagram.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Cards */}
            {combinedMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatDisplayNumber(combinedMetrics.totalLikes + combinedMetrics.totalComments)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Avg: {formatDisplayNumber(Math.round(combinedMetrics.avgEngagement * 100) / 100)}%
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Likes</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatDisplayNumber(combinedMetrics.totalLikes)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Across {combinedMetrics.totalPosts} posts
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Comments</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatDisplayNumber(combinedMetrics.totalComments)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          User conversations
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatDisplayNumber(combinedMetrics.totalViews)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Video content reach
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="creators" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Creators
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Individual Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Engagement Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Engagement Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="likes" fill="#ef4444" name="Likes" />
                          <Bar dataKey="comments" fill="#3b82f6" name="Comments" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Engagement Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" />
                        Engagement Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatDisplayNumber(value as number)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} name="Engagement Rate %" />
                        <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} name="Likes" />
                        <Line type="monotone" dataKey="comments" stroke="#3b82f6" strokeWidth={2} name="Comments" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="creators" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {handles.map(handle => {
                    const ins = insightsByHandle[handle];
                    const creatorPosts = liveContents.filter(c => c.creators?.ig_handle?.replace(/^@/, '') === handle);
                    const totalCreatorLikes = creatorPosts.reduce((sum, c) => {
                      const postData = getPostDataForContent(c.id);
                      return sum + (postData?.like_count ?? formatNumber(c.performance_metrics?.likes) ?? 0);
                    }, 0);
                    const totalCreatorComments = creatorPosts.reduce((sum, c) => {
                      const postData = getPostDataForContent(c.id);
                      return sum + (postData?.comments_count ?? formatNumber(c.performance_metrics?.comments) ?? 0);
                    }, 0);

                    return (
                      <Card key={handle}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            {ins?.profile?.profile_picture_url ? (
                              <img 
                                src={ins.profile.profile_picture_url} 
                                className="w-12 h-12 rounded-full object-cover" 
                                alt={`@${handle}`}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">@{handle}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDisplayNumber(ins?.profile?.followers_count)} followers
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <Heart className="h-4 w-4 mx-auto mb-1 text-red-600" />
                              <div className="font-semibold text-red-600">{formatDisplayNumber(totalCreatorLikes)}</div>
                              <div className="text-xs text-gray-500">Total Likes</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <MessageCircle className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                              <div className="font-semibold text-blue-600">{formatDisplayNumber(totalCreatorComments)}</div>
                              <div className="text-xs text-gray-500">Total Comments</div>
                            </div>
                          </div>

                          <div className="mt-4 text-center">
                            <Badge variant="outline">
                              {creatorPosts.length} post{creatorPosts.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="posts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveContents.map((c) => {
                    const handle = c.creators?.ig_handle || '';
                    const clean = handle.replace(/^@/, '');
                    const insights = insightsByHandle[clean];
                    const postData = getPostDataForContent(c.id);
                    const pp = insights?.profile?.profile_picture_url || c.creators?.profile_picture_url;
                    const thumb = postData?.thumbnail_url || postData?.media_url || c.thumbnail_url;
                    
                    const likes = postData?.like_count ?? formatNumber(c.performance_metrics?.likes) ?? 0;
                    const comments = postData?.comments_count ?? formatNumber(c.performance_metrics?.comments) ?? 0;
                    const views = postData?.video_views ?? formatNumber(c.performance_metrics?.views) ?? 0;
                    const followers = formatNumber(insights?.profile?.followers_count) ?? 1;
                    const engagementRate = getEngagementRate(likes, comments, followers);

                    return (
                      <Card key={c.id} className="overflow-hidden">
                        {thumb ? (
                          <div className="relative">
                            <img 
                              src={thumb} 
                              alt={c.creators?.name || 'Post'} 
                              className="w-full aspect-square object-cover" 
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-black/70 text-white">
                                {c.content_type?.toUpperCase() || 'POST'}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">No preview</p>
                            </div>
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            {pp ? (
                              <img src={pp} className="w-10 h-10 rounded-full object-cover" alt={c.creators?.name} />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{c.creators?.name}</div>
                              <div className="text-sm text-gray-500 truncate">@{clean}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-red-50 rounded-lg">
                              <Heart className="h-4 w-4 mx-auto mb-1 text-red-600" />
                              <div className="font-semibold text-red-600">{formatDisplayNumber(likes)}</div>
                              <div className="text-xs text-gray-500">Likes</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <MessageCircle className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                              <div className="font-semibold text-blue-600">{formatDisplayNumber(comments)}</div>
                              <div className="text-xs text-gray-500">Comments</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <Eye className="h-4 w-4 mx-auto mb-1 text-green-600" />
                              <div className="font-semibold text-green-600">{formatDisplayNumber(views)}</div>
                              <div className="text-xs text-gray-500">Views</div>
                            </div>
                          </div>

                          {!postData && likes === 0 && comments === 0 && views === 0 && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-yellow-800">
                                  <p className="font-medium">No metrics found</p>
                                  <p>Could not fetch data for this post. The post might be too old, private, or the URL might be incorrect.</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {postData && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <div className="text-green-600 mt-0.5">✅</div>
                                <div className="text-xs text-green-800">
                                  <p className="font-medium">Live Data</p>
                                  <p>Showing real-time metrics from Instagram for this specific post.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-purple-600">
                                {engagementRate.toFixed(2)}% engagement
                              </span>
                            </div>
                            <a 
                              href={c.post_url || undefined} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Post
                            </a>
                          </div>

                          <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {c.posted_at ? new Date(c.posted_at).toLocaleDateString() : 'Date unknown'}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {c.content_type || 'post'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignAnalytics;
