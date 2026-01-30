import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
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
  Heart, 
  MessageCircle, 
  Users, 
  Target,
  BarChart3,
  Activity,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Instagram,
  Sparkles,
  Award,
  Zap
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
  category?: string;
  subcategory?: string;
  followers_count?: number;
  engagement_rate?: number;
};

type CampaignCreator = {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: string;
  recommended_by_admin?: boolean;
  admin_notes?: string;
  creators: Creator;
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
  creators: CampaignCreator[];
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
  }>;
};

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return 0;
  return Number(val);
};

const formatDisplayNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return '-';
  const n = Number(val);
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const pct = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return '-';
  return `${(Number(val)).toFixed(2)}%`;
};

const getEngagementRate = (likes: number, comments: number, followers: number) => {
  if (!followers || followers === 0) return 0;
  return ((likes + comments) / followers) * 100;
};

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
const GRADIENT_COLORS = {
  primary: 'from-indigo-500 to-purple-600',
  secondary: 'from-pink-500 to-rose-600',
  success: 'from-emerald-500 to-teal-600',
  warning: 'from-amber-500 to-orange-600',
};

const CampaignAnalytics: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { brand } = useAuth();

  const { data: details, isLoading, isError, error, refetch } = useQuery<CampaignDetailsResponse>({
    queryKey: ['campaign-details', campaignId],
    queryFn: async () => {
      const url = getApiUrl(`api/campaigns/${campaignId}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load campaign');
      return res.json();
    },
    enabled: !!campaignId,
  });

  const liveContents = React.useMemo(() => {
    const all = details?.contents || [];
    return all.filter((c) => !!c.post_url);
  }, [details]);

  const allCampaignCreators = React.useMemo(() => {
    return details?.creators || [];
  }, [details]);

  const pendingApprovalContent = React.useMemo(() => {
    const all = details?.contents || [];
    return all.filter((c) => c.approval_status === 'pending' || c.approval_status === 'needs_revision');
  }, [details]);

  const creatorPostStatus = React.useMemo(() => {
    const statusMap = new Map<string, { hasPosted: boolean; postUrl?: string; contentId?: string }>();
    const allContents = details?.contents || [];
    
    allCampaignCreators.forEach(cc => {
      const creatorId = cc.creator_id;
      const creatorContent = allContents.find(c => c.creator_id === creatorId && c.post_url);
      statusMap.set(creatorId, {
        hasPosted: !!creatorContent?.post_url,
        postUrl: creatorContent?.post_url || undefined,
        contentId: creatorContent?.id
      });
    });
    
    return statusMap;
  }, [allCampaignCreators, details?.contents]);

  const handles = React.useMemo(() => {
    const s = new Set<string>();
    for (const c of liveContents) {
      if (c.creators?.ig_handle) s.add(c.creators.ig_handle.replace(/^@/, ''));
    }
    return Array.from(s);
  }, [liveContents]);

  const postInsightsQueries = useQuery<{ [contentId: string]: any }>({
    queryKey: ['post-insights', liveContents.map(c => c.id).sort().join(',')],
    queryFn: async () => {
      const entries = await Promise.all(liveContents.map(async (content) => {
        if (!content.post_url || !content.creators?.ig_handle) {
          return [content.id, null] as const;
        }
        
        const handle = content.creators.ig_handle.replace(/^@/, '');
        try {
          const url = getApiUrl(`api/post-insights?postUrl=${encodeURIComponent(content.post_url)}&username=${encodeURIComponent(handle)}`);
          const res = await fetch(url);
          if (!res.ok) return [content.id, null] as const;
          const data = await res.json();
          return [content.id, data] as const;
        } catch {
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

  const insightsQueries = useQuery<{ [handle: string]: InsightsResponse }>({
    queryKey: ['insights-by-handle', handles.sort().join(',')],
    queryFn: async () => {
      const entries = await Promise.all(handles.map(async (h) => {
        const url = getApiUrl(`api/insights?username=${encodeURIComponent(h)}`);
        const res = await fetch(url);
        if (!res.ok) return [h, null] as const;
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
      return {
        ...postData.post,
        creator_followers: postData.creator?.followers_count || 0,
        creator_profile_picture: postData.creator?.profile_picture_url,
      };
    }
    return null;
  };

  const refreshAll = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['insights-by-handle'] });
    queryClient.invalidateQueries({ queryKey: ['post-insights'] });
  };

  const combinedMetrics = React.useMemo(() => {
    if (liveContents.length === 0) return null;

    let totalLikes = 0;
    let totalComments = 0;
    let totalFollowers = 0;
    let totalEngagement = 0;
    let validPosts = 0;

    liveContents.forEach((c) => {
      const handle = c.creators?.ig_handle?.replace(/^@/, '') || '';
      const insights = insightsByHandle[handle];
      const postData = getPostDataForContent(c.id);
      
      const likes = postData?.like_count ?? 0;
      const comments = postData?.comments_count ?? 0;
      const followers = postData?.creator_followers || formatNumber(insights?.profile?.followers_count) || 1;
      const engagementRate = postData?.engagement_rate ?? getEngagementRate(likes, comments, followers);

      if (postData) {
        totalLikes += likes;
        totalComments += comments;
        totalFollowers += followers;
        totalEngagement += engagementRate;
        validPosts++;
      }
    });

    return {
      totalLikes,
      totalComments,
      totalFollowers,
      avgEngagement: validPosts > 0 ? totalEngagement / validPosts : 0,
      totalPosts: validPosts,
      totalCreators: handles.length
    };
  }, [liveContents, insightsByHandle, handles.length]);

  const chartData = React.useMemo(() => {
    return liveContents.map((c, index) => {
      const handle = c.creators?.ig_handle?.replace(/^@/, '') || '';
      const insights = insightsByHandle[handle];
      const postData = getPostDataForContent(c.id);
      
      const likes = postData?.like_count ?? 0;
      const comments = postData?.comments_count ?? 0;
      const followers = postData?.creator_followers || formatNumber(insights?.profile?.followers_count) || 1;
      const engagementRate = postData?.engagement_rate ?? getEngagementRate(likes, comments, followers);
      
      return {
        name: c.creators?.name?.split(' ')[0] || `Post ${index + 1}`,
        likes,
        comments,
        engagement: engagementRate,
        followers
      };
    });
  }, [liveContents, insightsByHandle, postInsightsByContentId]);

  const pieData = React.useMemo(() => {
    if (!combinedMetrics) return [];
    
    return [
      { name: 'Likes', value: combinedMetrics.totalLikes, color: '#ec4899' },
      { name: 'Comments', value: combinedMetrics.totalComments, color: '#6366f1' }
    ].filter(item => item.value > 0);
  }, [combinedMetrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-slate-600 mt-6 font-medium">Loading campaign analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !details?.campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Campaign Analytics</h1>
              <p className="text-red-600 mb-6">{(error as Error)?.message || 'Failed to load campaign'}</p>
              <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const postedCount = Array.from(creatorPostStatus.values()).filter(s => s.hasPosted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.history.back()}
              className="mt-1 hover:bg-indigo-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
                {details.campaign.campaign_name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-sm">
                  {details.campaign.phase.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  Analytics Dashboard
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/dashboard/campaigns/${details.campaign.id}`}>
              <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaign
              </Button>
            </Link>
            <Button onClick={refreshAll} size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {liveContents.length === 0 && allCampaignCreators.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-900">No Creators Yet</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Once creators are assigned to this campaign and they post content, you'll see comprehensive analytics here.
              </p>
            </CardContent>
          </Card>
        ) : liveContents.length === 0 ? (
          <>
            {/* Summary Cards - No Live Posts Yet */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-100">Total Creators</p>
                      <p className="text-4xl font-bold mt-1">{allCampaignCreators.length}</p>
                      <p className="text-xs text-indigo-200 mt-2">Assigned to campaign</p>
                    </div>
                    <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <Users className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-100">Posted</p>
                      <p className="text-4xl font-bold mt-1">{postedCount}</p>
                      <p className="text-xs text-emerald-200 mt-2">Live content</p>
                    </div>
                    <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-100">Pending</p>
                      <p className="text-4xl font-bold mt-1">{pendingApprovalContent.length}</p>
                      <p className="text-xs text-amber-200 mt-2">Awaiting review</p>
                    </div>
                    <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <Clock className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-100">Potential Reach</p>
                      <p className="text-4xl font-bold mt-1">
                        {formatDisplayNumber(allCampaignCreators.reduce((sum, cc) => sum + (cc.creators?.followers_count || 0), 0))}
                      </p>
                      <p className="text-xs text-pink-200 mt-2">Combined followers</p>
                    </div>
                    <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                      <Target className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for No Live Posts */}
            <Tabs defaultValue="creators" className="space-y-6">
              <TabsList className="bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-xl shadow-sm">
                <TabsTrigger value="creators" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-6">
                  <Users className="h-4 w-4 mr-2" />
                  Creators ({allCampaignCreators.length})
                </TabsTrigger>
                <TabsTrigger value="approval" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-6">
                  <FileText className="h-4 w-4 mr-2" />
                  Approval
                  {pendingApprovalContent.length > 0 && (
                    <Badge className="ml-2 bg-rose-500 text-white border-0 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {pendingApprovalContent.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="creators" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCampaignCreators.map(cc => {
                    const creator = cc.creators;
                    const handle = creator?.ig_handle?.replace(/^@/, '') || '';
                    const postStatus = creatorPostStatus.get(cc.creator_id);
                    const hasPosted = postStatus?.hasPosted || false;

                    return (
                      <Card key={cc.id} className={`border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${hasPosted ? 'ring-2 ring-emerald-500 ring-offset-4' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-5">
                            {creator?.profile_picture_url ? (
                              <img 
                                src={creator.profile_picture_url} 
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-white" 
                                alt={creator?.name || handle}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                  {(creator?.name || handle || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-slate-900 truncate">{creator?.name || 'Unknown'}</h3>
                              <a 
                                href={`https://instagram.com/${handle}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700 truncate block"
                              >
                                @{handle || 'unknown'}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-5 py-3 px-4 bg-slate-50 rounded-xl">
                            <div className="text-center flex-1">
                              <p className="text-lg font-bold text-slate-900">{formatDisplayNumber(creator?.followers_count)}</p>
                              <p className="text-xs text-slate-500">Followers</p>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div className="text-center flex-1">
                              <p className="text-sm font-semibold text-slate-700">{creator?.category || '-'}</p>
                              <p className="text-xs text-slate-500">Category</p>
                            </div>
                          </div>

                          <div className={`flex items-center justify-center gap-2 mt-4 p-3.5 rounded-xl font-medium ${hasPosted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {hasPosted ? (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                <span>Posted</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-5 w-5 text-slate-400" />
                                <span>Awaiting Post</span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="approval" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    {pendingApprovalContent.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <p className="text-slate-600 font-medium">All caught up!</p>
                        <p className="text-sm text-slate-500 mt-1">No content pending approval</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pendingApprovalContent.map((content) => (
                          <Card key={content.id} className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardContent className="p-5">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <Users className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{content.creators?.name || 'Unknown'}</div>
                                  <div className="text-sm text-slate-500">@{content.creators?.ig_handle?.replace(/^@/, '')}</div>
                                </div>
                              </div>
                              <Badge className={`${content.approval_status === 'pending' ? 'bg-amber-500' : 'bg-orange-500'} text-white border-0`}>
                                {content.approval_status === 'pending' ? 'Pending Review' : 'Needs Revision'}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            {/* Overview Cards - With Live Posts */}
            {combinedMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-100">Total Engagement</p>
                        <p className="text-4xl font-bold mt-1">
                          {formatDisplayNumber(combinedMetrics.totalLikes + combinedMetrics.totalComments)}
                        </p>
                        <p className="text-xs text-indigo-200 mt-2 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Avg: {pct(combinedMetrics.avgEngagement)}
                        </p>
                      </div>
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                        <Zap className="h-7 w-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-100">Total Likes</p>
                        <p className="text-4xl font-bold mt-1">
                          {formatDisplayNumber(combinedMetrics.totalLikes)}
                        </p>
                        <p className="text-xs text-pink-200 mt-2">
                          Across {combinedMetrics.totalPosts} posts
                        </p>
                      </div>
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                        <Heart className="h-7 w-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-100">Total Comments</p>
                        <p className="text-4xl font-bold mt-1">
                          {formatDisplayNumber(combinedMetrics.totalComments)}
                        </p>
                        <p className="text-xs text-blue-200 mt-2">
                          User conversations
                        </p>
                      </div>
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                        <MessageCircle className="h-7 w-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-100">Total Reach</p>
                        <p className="text-4xl font-bold mt-1">
                          {formatDisplayNumber(combinedMetrics.totalFollowers)}
                        </p>
                        <p className="text-xs text-emerald-200 mt-2">
                          Creator followers
                        </p>
                      </div>
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                        <Target className="h-7 w-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-xl shadow-sm inline-flex">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-5">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="approval" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-5">
                  <FileText className="h-4 w-4 mr-2" />
                  Approval
                  {pendingApprovalContent.length > 0 && (
                    <Badge className="ml-2 bg-rose-500 text-white border-0 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {pendingApprovalContent.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="creators" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-5">
                  <Users className="h-4 w-4 mr-2" />
                  Creators ({allCampaignCreators.length})
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-5">
                  <Target className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-5">
                  <Instagram className="h-4 w-4 mr-2" />
                  Live Posts ({liveContents.length})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Engagement Chart */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-indigo-600" />
                        </div>
                        Engagement by Creator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <defs>
                              <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#f472b6" stopOpacity={0.8}/>
                              </linearGradient>
                              <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                              }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="likes" fill="url(#likesGradient)" name="Likes" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="comments" fill="url(#commentsGradient)" name="Comments" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-300 flex items-center justify-center">
                          <p className="text-slate-500">No data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Distribution Pie Chart */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-pink-600" />
                        </div>
                        Engagement Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={110}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => formatDisplayNumber(value)}
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                              }}
                            />
                            <Legend 
                              formatter={(value) => <span className="text-slate-600 font-medium">{value}</span>}
                              wrapperStyle={{ paddingTop: '20px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-300 flex items-center justify-center">
                          <p className="text-slate-500">No data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-md bg-white">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{allCampaignCreators.length}</p>
                      <p className="text-sm text-slate-500">Total Creators</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md bg-white">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{postedCount}</p>
                      <p className="text-sm text-slate-500">Posted</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md bg-white">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{allCampaignCreators.length - postedCount}</p>
                      <p className="text-sm text-slate-500">Pending</p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md bg-white">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-pink-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{pct(combinedMetrics?.avgEngagement)}</p>
                      <p className="text-sm text-slate-500">Avg Engagement</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Approval Tab */}
              <TabsContent value="approval" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    {pendingApprovalContent.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                        <p className="text-slate-600 font-medium">All caught up!</p>
                        <p className="text-sm text-slate-500 mt-1">No content pending approval</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pendingApprovalContent.map((content) => (
                          <Card key={content.id} className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                            <CardContent className="p-5">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                  <Users className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{content.creators?.name || 'Unknown'}</div>
                                  <div className="text-sm text-slate-500">@{content.creators?.ig_handle?.replace(/^@/, '')}</div>
                                </div>
                              </div>
                              <Badge className={`${content.approval_status === 'pending' ? 'bg-amber-500' : 'bg-orange-500'} text-white border-0`}>
                                {content.approval_status === 'pending' ? 'Pending Review' : 'Needs Revision'}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Creators Tab */}
              <TabsContent value="creators" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCampaignCreators.map(cc => {
                    const creator = cc.creators;
                    const handle = creator?.ig_handle?.replace(/^@/, '') || '';
                    const postStatus = creatorPostStatus.get(cc.creator_id);
                    const hasPosted = postStatus?.hasPosted || false;

                    return (
                      <Card key={cc.id} className={`border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${hasPosted ? 'ring-2 ring-emerald-500 ring-offset-4' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-5">
                            {creator?.profile_picture_url ? (
                              <img 
                                src={creator.profile_picture_url} 
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-white" 
                                alt={creator?.name || handle}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                  {(creator?.name || handle || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-slate-900 truncate">{creator?.name || 'Unknown'}</h3>
                              <a 
                                href={`https://instagram.com/${handle}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700 truncate block"
                              >
                                @{handle || 'unknown'}
                              </a>
                            </div>
                          </div>

                          <div className={`flex items-center justify-center gap-2 mt-5 p-3.5 rounded-xl font-medium ${hasPosted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {hasPosted ? (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                <span>Posted</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-5 w-5 text-slate-400" />
                                <span>Awaiting Post</span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Campaign Insights Tab */}
              <TabsContent value="performance" className="space-y-6">
                {/* Campaign Progress - Full Width */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="h-8 w-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-emerald-600" />
                      </div>
                      Campaign Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Posting Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">Posting Progress</span>
                          <span className="text-sm font-bold text-emerald-600">
                            {postedCount} / {allCampaignCreators.length}
                          </span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${allCampaignCreators.length > 0 ? (postedCount / allCampaignCreators.length) * 100 : 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {allCampaignCreators.length - postedCount} creators yet to post
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-indigo-600">{pct(combinedMetrics?.avgEngagement)}</p>
                          <p className="text-xs text-slate-600 mt-1">Avg Engagement Rate</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-pink-600">
                            {formatDisplayNumber(combinedMetrics?.totalFollowers || 0)}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">Posted Reach</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-amber-600">{liveContents.length}</p>
                          <p className="text-xs text-slate-600 mt-1">Live Posts</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl text-center">
                          <p className="text-2xl font-bold text-emerald-600">
                            {formatDisplayNumber((combinedMetrics?.totalLikes || 0) + (combinedMetrics?.totalComments || 0))}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">Total Interactions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reach by Posted Creators */}
                {liveContents.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                        </div>
                        Reach by Posted Creators
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Get creators who have posted with their reach data
                        const postedCreatorsData = liveContents.map(c => {
                          const handle = c.creators?.ig_handle?.replace(/^@/, '') || '';
                          const insights = insightsByHandle[handle];
                          const postData = getPostDataForContent(c.id);
                          const followers = postData?.creator_followers || formatNumber(insights?.profile?.followers_count) || 0;
                          
                          return {
                            id: c.id,
                            name: c.creators?.name || 'Unknown',
                            handle,
                            followers,
                            profilePic: postData?.creator_profile_picture || insights?.profile?.profile_picture_url || c.creators?.profile_picture_url
                          };
                        }).sort((a, b) => b.followers - a.followers);
                        
                        const maxFollowers = postedCreatorsData[0]?.followers || 1;
                        
                        if (postedCreatorsData.length === 0) {
                          return (
                            <div className="text-center py-8">
                              <p className="text-slate-500">No posted creators yet</p>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="space-y-4 mt-2">
                            {postedCreatorsData.map((creator, idx) => (
                              <div key={creator.id} className="flex items-center gap-4">
                                <span className="text-sm font-bold text-slate-400 w-6">#{idx + 1}</span>
                                {creator.profilePic ? (
                                  <img 
                                    src={creator.profilePic} 
                                    alt={creator.name}
                                    className="w-10 h-10 rounded-xl object-cover shadow"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow">
                                    {creator.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm font-medium text-slate-900 truncate">{creator.name}</p>
                                    <span className="text-sm font-bold text-indigo-600">{formatDisplayNumber(creator.followers)}</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                      style={{ width: `${(creator.followers / maxFollowers) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Live Posts Tab */}
              <TabsContent value="posts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveContents.map((c) => {
                    const handle = c.creators?.ig_handle || '';
                    const clean = handle.replace(/^@/, '');
                    const insights = insightsByHandle[clean];
                    const postData = getPostDataForContent(c.id);
                    const pp = postData?.creator_profile_picture || insights?.profile?.profile_picture_url || c.creators?.profile_picture_url;
                    const thumb = postData?.thumbnail_url || postData?.media_url || c.thumbnail_url;
                    
                    const likes = postData?.like_count ?? 0;
                    const comments = postData?.comments_count ?? 0;
                    const followers = postData?.creator_followers || formatNumber(insights?.profile?.followers_count) || 1;
                    const engagementRate = postData?.engagement_rate ?? getEngagementRate(likes, comments, followers);

                    return (
                      <Card key={c.id} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                        {thumb ? (
                          <div className="relative aspect-square">
                            <img 
                              src={thumb} 
                              alt={c.creators?.name || 'Post'} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-black/70 text-white backdrop-blur border-0">
                                {c.content_type?.toUpperCase() || 'POST'}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <Heart className="h-4 w-4" />
                                  <span className="font-semibold">{formatDisplayNumber(likes)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MessageCircle className="h-4 w-4" />
                                  <span className="font-semibold">{formatDisplayNumber(comments)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <Activity className="h-12 w-12 text-slate-400" />
                          </div>
                        )}
                        
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-4">
                            {pp ? (
                              <img src={pp} className="w-11 h-11 rounded-xl object-cover shadow" alt={c.creators?.name} />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-indigo-600" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-900 truncate">{c.creators?.name}</div>
                              <div className="text-sm text-slate-500 truncate">@{clean}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                              <Heart className="h-4 w-4 mx-auto mb-1 text-pink-600" />
                              <div className="font-bold text-pink-600">{formatDisplayNumber(likes)}</div>
                              <div className="text-xs text-slate-500">Likes</div>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                              <MessageCircle className="h-4 w-4 mx-auto mb-1 text-indigo-600" />
                              <div className="font-bold text-indigo-600">{formatDisplayNumber(comments)}</div>
                              <div className="text-xs text-slate-500">Comments</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-700">Engagement</span>
                            </div>
                            <span className="font-bold text-emerald-600">{pct(engagementRate)}</span>
                          </div>

                          {!postData && likes === 0 && comments === 0 && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-700">Could not fetch live metrics for this post</p>
                              </div>
                            </div>
                          )}
                          
                          {c.post_url && (
                            <a 
                              href={c.post_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-4 flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-500/25"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View on Instagram
                            </a>
                          )}
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
