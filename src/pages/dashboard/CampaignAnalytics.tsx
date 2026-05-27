import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
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
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
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
  Instagram,
  Sparkles,
  Award,
  Zap,
  DollarSign,
  Eye,
  Flame,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

type Campaign = {
  id: string;
  campaign_name: string;
  brand_id: string;
  phase: string;
  status: string;
  budget?: number;
  cpv_rate?: number;
  min_guarantee_per_creator?: number;
  max_payout_per_creator?: number;
};

type CampaignCreator = {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: string;
  recommended_by_admin?: boolean;
  admin_notes?: string;
  creators: {
    id: string;
    name: string;
    ig_handle: string;
    profile_picture_url?: string;
    category?: string;
    subcategory?: string;
    followers_count?: number;
    engagement_rate?: number;
  };
};

type Content = {
  id: string;
  campaign_id: string;
  creator_id: string;
  content_type: string;
  content_url: string | null;
  thumbnail_url: string | null;
  approval_status: string;
  post_url?: string | null;
  posted_at?: string | null;
  creators: {
    id: string;
    name: string;
    ig_handle: string;
  };
};

type CampaignDetailsResponse = {
  success: boolean;
  campaign: Campaign;
  creators: CampaignCreator[];
  contents: Content[];
  applications?: any[];
};

const formatDisplayNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || isNaN(val as number)) return '0';
  const n = Number(val);
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(amount as number)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const CampaignAnalytics: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const campaign = details?.campaign;
  const applications = details?.applications || [];
  const creators = details?.creators || [];
  const contents = details?.contents || [];

  // Filter posted creators
  const postedApplications = React.useMemo(() => {
    return applications.filter(app => app.status === 'posted' || !!app.post_url);
  }, [applications]);

  // Aggregate Overall Metrics
  const metrics = React.useMemo(() => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalFollowers = 0;
    let totalPayout = 0;
    let totalEngagementRate = 0;

    postedApplications.forEach(app => {
      const views = Number(app.verified_views || 0);
      const likes = Number(app.likes || 0);
      const comments = Number(app.comments || 0);
      const followers = Number(app.creator?.followers_count || 1);
      const payout = Number(app.final_earning_inr || 0);

      totalViews += views;
      totalLikes += likes;
      totalComments += comments;
      totalFollowers += followers;
      totalPayout += payout;

      const er = followers > 0 ? ((likes + comments) / followers) * 100 : 0;
      totalEngagementRate += er;
    });

    const avgEngagement = postedApplications.length > 0 ? totalEngagementRate / postedApplications.length : 0;
    const effectiveCPV = totalViews > 0 ? totalPayout / totalViews : 0;

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalFollowers,
      totalPayout,
      avgEngagement,
      effectiveCPV,
      postedCount: postedApplications.length
    };
  }, [postedApplications]);

  // Single-creator inline manual refresh
  const handleRefreshCreator = async (applicationId: string) => {
    try {
      toast({
        title: "Syncing Insights",
        description: "Connecting to Meta Graph API...",
      });
      const url = getApiUrl(`api/applications/${applicationId}/refresh-insights`);
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Sync Complete",
          description: "Verified stats updated successfully.",
        });
        refetch();
      } else {
        throw new Error(data.error || "Sync failed");
      }
    } catch (err: any) {
      toast({
        title: "Sync Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Sync all live posts in parallel
  const handleRefreshAll = async () => {
    if (postedApplications.length === 0) {
      toast({
        title: "No Live Content",
        description: "There are no live posts submitted to refresh.",
        variant: "destructive"
      });
      return;
    }

    try {
      setRefreshing(true);
      toast({
        title: "Syncing Campaign Insights",
        description: `Running real-time Instagram Graph API sync for ${postedApplications.length} active posts...`,
      });

      await Promise.all(
        postedApplications.map(async (app) => {
          const url = getApiUrl(`api/applications/${app.id}/refresh-insights`);
          await fetch(url, { method: 'POST' }).catch(err => console.error("Error syncing app:", app.id, err));
        })
      );

      toast({
        title: "Campaign Synced",
        description: "All live content metrics have been refreshed in real-time.",
      });
      refetch();
    } catch (err: any) {
      toast({
        title: "Sync Failed",
        description: "Could not sync all creator insights.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 1. Chart: Cumulative Views Progress Over Time
  const snapshotChartData = React.useMemo(() => {
    if (postedApplications.length === 0) return [];

    const timestamps = new Set<string>();
    postedApplications.forEach(app => {
      const snaps = app.snapshots || [];
      snaps.forEach((s: any) => {
        timestamps.add(new Date(s.captured_at).toISOString());
      });
    });

    if (timestamps.size === 0) {
      // Fallback: Create base point at zero and current values
      return [
        { time: 'Baseline', 'Total Campaign Views': 0 },
        { time: 'Current', 'Total Campaign Views': metrics.totalViews }
      ];
    }

    const sortedTimes = Array.from(timestamps).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedTimes.map(time => {
      const formattedTime = new Date(time).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      });

      const dataPoint: any = { time: formattedTime };
      let cumulativeViews = 0;

      postedApplications.forEach(app => {
        const snaps = app.snapshots || [];
        const matchingSnap = snaps
          .filter((s: any) => new Date(s.captured_at).getTime() <= new Date(time).getTime())
          .sort((a: any, b: any) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0];
        
        const views = matchingSnap ? Number(matchingSnap.views || 0) : 0;
        dataPoint[app.creator.name] = views;
        cumulativeViews += views;
      });

      dataPoint['Total Campaign Views'] = cumulativeViews;
      return dataPoint;
    });
  }, [postedApplications, metrics.totalViews]);

  // 2. Chart: Engagement vs Views Scatter Plot
  const scatterChartData = React.useMemo(() => {
    return postedApplications.map(app => {
      const views = Number(app.verified_views || 0);
      const likes = Number(app.likes || 0);
      const comments = Number(app.comments || 0);
      const followers = Number(app.creator?.followers_count || 1);
      const er = followers > 0 ? ((likes + comments) / followers) * 100 : 0;

      return {
        name: app.creator.name,
        views,
        engagementRate: er,
        followers,
        payout: app.final_earning_inr || 0
      };
    });
  }, [postedApplications]);

  // 3. Chart: Creator Views Comparison (Average Historical vs Actual Reel)
  const comparisonChartData = React.useMemo(() => {
    return postedApplications.map(app => {
      return {
        name: app.creator.name.split(' ')[0],
        'Reel Views': Number(app.verified_views || 0),
        'Historical Avg Views': Number(app.creator.avg_views || 0)
      };
    });
  }, [postedApplications]);

  // 4. Chart: Engagement Distribution
  const pieData = React.useMemo(() => {
    if (postedApplications.length === 0) return [];
    return [
      { name: 'Likes', value: metrics.totalLikes, color: '#ec4899' },
      { name: 'Comments', value: metrics.totalComments, color: '#6366f1' }
    ].filter(item => item.value > 0);
  }, [postedApplications, metrics.totalLikes, metrics.totalComments]);

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border-0 p-4 shadow-2xl rounded-2xl text-left text-xs min-w-[200px]">
          <p className="font-bold text-slate-200 mb-2 border-b border-white/10 pb-1.5">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex items-center justify-between gap-4 py-1 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
                <span className="text-slate-300">{pld.name}</span>
              </span>
              <span className="text-white">
                {pld.name.includes('Rate') || pld.name.includes('Engagement') 
                  ? `${Number(pld.value).toFixed(2)}%` 
                  : pld.name.includes('Payout') 
                    ? formatCurrency(pld.value)
                    : formatDisplayNumber(pld.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400" />
          </div>
          <p className="text-slate-400 font-medium">Analyzing Campaign Ledger...</p>
        </div>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <Card className="border-slate-800 bg-slate-900 max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Sync Error</h2>
            <p className="text-red-400 mb-6 font-medium">{(error as Error)?.message || 'Failed to load campaign'}</p>
            <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const budgetUsagePercent = campaign.budget && campaign.budget > 0 
    ? (metrics.totalPayout / campaign.budget) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white pb-12">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Breadcrumb Navigation & Real-time Pulsing Sync Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="flex items-start gap-4">
            <Link to={`/dashboard/campaigns/${campaign.id}`}>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 font-bold px-2.5 py-0.5 rounded-full text-xs">
                  {campaign.phase.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Meta API Sync Active
                </div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent mt-2">
                {campaign.campaign_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/dashboard/campaigns/${campaign.id}`}>
              <Button variant="outline" className="border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white">
                Manage Submissions
              </Button>
            </Link>
            <Button 
              onClick={handleRefreshAll} 
              disabled={refreshing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Sync Campaign
            </Button>
          </div>
        </div>

        {postedApplications.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <CardContent className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl border border-indigo-500/25 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/5">
                <Flame className="h-10 w-10 text-indigo-400 animate-pulse" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-bold text-slate-100">Pending Live Content</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Creator agreements are locked in. Historical profile averages will show here once content link verifications are approved and live tracking begins.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Link to={`/dashboard/campaigns/${campaign.id}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Go to Script Planner</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPI Metrics Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Total Verified Views */}
              <Card className="border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-300"></div>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300/80">Verified Views</span>
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Eye className="h-4.5 w-4.5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">{formatDisplayNumber(metrics.totalViews)}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-400/90 font-medium mt-1">
                      <span>Live views tracked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Accrued Spend */}
              <Card className="border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-300"></div>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300/80">Accrued Spent</span>
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">{formatCurrency(metrics.totalPayout)}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium mt-1">
                      <span>{budgetUsagePercent.toFixed(1)}% of budget utilized</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effective CPV */}
              <Card className="border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-300"></div>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-300/80">Effective CPV</span>
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">₹{metrics.effectiveCPV.toFixed(2)}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium mt-1">
                      <span>CPV rate: ₹{(campaign.cpv_rate || 0.6).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Engagement */}
              <Card className="border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-300"></div>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-pink-300/80">Engagement</span>
                    <div className="h-8 w-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                      <Activity className="h-4.5 w-4.5 text-pink-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">
                      {formatDisplayNumber(metrics.totalLikes + metrics.totalComments)}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-pink-400/90 font-medium mt-1">
                      <span>Avg Rate: {metrics.avgEngagement.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Audience Reach */}
              <Card className="border-slate-800/80 bg-slate-900/30 backdrop-blur-md hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-300"></div>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-300/80">Audience Reach</span>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Users className="h-4.5 w-4.5 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">{formatDisplayNumber(metrics.totalFollowers)}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-400/90 font-medium mt-1">
                      <span>Across {metrics.postedCount} active creators</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <TabsList className="bg-slate-900/60 border border-slate-800/60 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-5 py-2 font-bold text-xs text-slate-400">
                    <BarChart3 className="h-3.5 w-3.5 mr-2" />
                    Visual Analytics
                  </TabsTrigger>
                  <TabsTrigger value="creators" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-5 py-2 font-bold text-xs text-slate-400">
                    <Users className="h-3.5 w-3.5 mr-2" />
                    Creator Breakdown
                  </TabsTrigger>
                </TabsList>

                <div className="text-xs text-slate-400 font-medium">
                  Budget allocation: <span className="font-bold text-white">{formatCurrency(campaign.budget || 0)}</span>
                </div>
              </div>

              {/* OVERVIEW TAB: Charts Page */}
              <TabsContent value="overview" className="space-y-6">
                
                {/* Visual Analytics Chart Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Cumulative Campaign Views Growth */}
                  <Card className="border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-slate-300">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                        Views Tracker over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {snapshotChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                          <AreaChart data={snapshotChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="totalViewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" />
                            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="Total Campaign Views" 
                              stroke="#6366f1" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#totalViewsGrad)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[320px] flex items-center justify-center text-slate-500">
                          Waiting for more sync snapshots to plot growth trend...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Creator Performance Comparison */}
                  <Card className="border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-slate-300">
                        <Users className="h-4 w-4 text-emerald-400" />
                        Views vs. Creator Historical Average
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {comparisonChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="reelViewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                              </linearGradient>
                              <linearGradient id="histViewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#475569" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#334155" stopOpacity={0.5}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                            <Bar dataKey="Reel Views" fill="url(#reelViewsGrad)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Historical Avg Views" fill="url(#histViewsGrad)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[320px] flex items-center justify-center text-slate-500">
                          No performance values recorded.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Engagement vs Views Scatter Plot */}
                  <Card className="border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-slate-300">
                        <Activity className="h-4 w-4 text-pink-400" />
                        Engagement Rate vs. Views Matrix
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scatterChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" />
                            <XAxis 
                              type="number" 
                              dataKey="views" 
                              name="Views" 
                              unit="" 
                              tickFormatter={(v) => formatDisplayNumber(v)}
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                              label={{ value: 'Views', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 11 }}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="engagementRate" 
                              name="Engagement Rate" 
                              unit="%"
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                              label={{ value: 'Engagement Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                            />
                            <ZAxis type="number" dataKey="followers" range={[60, 400]} name="Followers" />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Creators" data={scatterChartData} fill="#ec4899">
                              {scatterChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[320px] flex items-center justify-center text-slate-500">
                          Waiting for verified view counts...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Likes vs Comments Distribution */}
                  <Card className="border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-slate-300">
                        <Award className="h-4 w-4 text-amber-400" />
                        Engagement Split
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pieData.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[320px]">
                          <div className="w-[200px] h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={90}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => formatDisplayNumber(v)} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex flex-col gap-3">
                            {pieData.map(item => (
                              <div key={item.name} className="flex items-center gap-3">
                                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <div>
                                  <p className="text-xs text-slate-400 font-semibold">{item.name}</p>
                                  <p className="text-lg font-bold text-white">{formatDisplayNumber(item.value)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-[320px] flex items-center justify-center text-slate-500">
                          No engagement metrics submitted yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>

              {/* CREATOR BREAKDOWN TAB */}
              <TabsContent value="creators" className="space-y-6">
                
                {/* Creator Performance Ledger Grid */}
                <div className="space-y-6">
                  {applications.map(app => {
                    const creator = app.creator || {};
                    const postUrl = app.post_url;
                    
                    const views = Number(app.verified_views || 0);
                    const likes = Number(app.likes || 0);
                    const comments = Number(app.comments || 0);
                    const followers = Number(creator.followers_count || 1);
                    const er = followers > 0 ? ((likes + comments) / followers) * 100 : 0;
                    
                    const cpv = campaign.cpv_rate || 0.6;
                    const minGuarantee = campaign.min_guarantee_per_creator || 0;
                    const maxPayout = campaign.max_payout_per_creator || 0;
                    
                    // Financial payout logic
                    const viewEarning = views * cpv;
                    const payout = app.final_earning_inr || 0;
                    const isMinGuaranteeBoosted = payout === minGuarantee && viewEarning < minGuarantee && minGuarantee > 0;
                    const isMaxPayoutCapped = payout === maxPayout && viewEarning > maxPayout && maxPayout > 0;

                    return (
                      <Card key={app.id} className="border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden hover:border-slate-700 transition-all duration-300">
                        <div className="p-6">
                          
                          {/* Creator Header Panel */}
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
                            
                            <div className="flex items-center gap-4">
                              <img 
                                src={creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=random`} 
                                alt={creator.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-slate-700/50 shadow-xl"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg text-white">{creator.name}</h3>
                                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold rounded-full px-2">
                                    Score: {creator.campayn_score || 0}
                                  </Badge>
                                </div>
                                <a 
                                  href={`https://instagram.com/${creator.ig_handle}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold block mt-0.5"
                                >
                                  @{creator.ig_handle}
                                </a>
                              </div>
                            </div>

                            {/* Post Status & Manual Sync Actions */}
                            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                              {postUrl ? (
                                <>
                                  <a 
                                    href={postUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-850 bg-slate-950 text-xs text-slate-300 hover:bg-slate-900 hover:text-white font-semibold transition-colors"
                                  >
                                    <Instagram className="h-3.5 w-3.5 text-pink-500" />
                                    View Reel
                                    <ExternalLink className="h-3 w-3 text-slate-500" />
                                  </a>
                                  <Button 
                                    onClick={() => handleRefreshCreator(app.id)}
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-800 bg-slate-900 text-xs hover:bg-slate-800 hover:text-white gap-1.5 font-bold"
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                    Sync Insights
                                  </Button>
                                </>
                              ) : (
                                <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-850 font-bold">
                                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                                  Awaiting post submission
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                            
                            {/* Panel 1: Profile Metrics */}
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80">Historical Profile</h5>
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400">Total Followers:</span>
                                  <span className="font-bold text-white">{formatDisplayNumber(followers)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400">Avg Views Benchmark:</span>
                                  <span className="font-bold text-white">{formatDisplayNumber(creator.avg_views)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-400">Historical ER:</span>
                                  <span className="font-bold text-white">{Number(creator.engagement_rate || 0).toFixed(2)}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Panel 2: Synced Metrics */}
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80">Verified Post Metrics</h5>
                              {postUrl ? (
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Verified Views:</span>
                                    <span className="font-bold text-indigo-400">{formatDisplayNumber(views)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Likes:</span>
                                    <span className="font-bold text-white">{formatDisplayNumber(likes)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Comments:</span>
                                    <span className="font-bold text-white">{formatDisplayNumber(comments)}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic py-2">No stats recorded yet.</p>
                              )}
                            </div>

                            {/* Panel 3: Performance Comparison */}
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80">Efficiency & ROI</h5>
                              {postUrl ? (
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Post Engagement Rate:</span>
                                    <span className="font-bold text-pink-400">{er.toFixed(2)}%</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Reach Multiplier:</span>
                                    <span className="font-bold text-white">{(views / followers).toFixed(2)}x</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Performance Index:</span>
                                    {creator.avg_views && creator.avg_views > 0 ? (
                                      <span className={`font-bold flex items-center gap-1 ${views >= creator.avg_views ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {views >= creator.avg_views ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {((views / creator.avg_views) * 100).toFixed(0)}%
                                      </span>
                                    ) : (
                                      <span className="font-bold text-white">-</span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic py-2">No post link verified.</p>
                              )}
                            </div>

                            {/* Panel 4: Payout Ledger & Contract Options */}
                            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-850/80 flex flex-col justify-between">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  <span>Final Earning</span>
                                  {isMinGuaranteeBoosted && (
                                    <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-extrabold px-1 rounded">
                                      Min Boosted
                                    </Badge>
                                  )}
                                  {isMaxPayoutCapped && (
                                    <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-extrabold px-1 rounded">
                                      Cap Reached
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="text-2xl font-black text-white">{formatCurrency(payout)}</h4>
                              </div>
                              
                              <div className="border-t border-slate-900 pt-2 mt-2 space-y-1 text-[10px] text-slate-500 font-semibold">
                                <div className="flex justify-between">
                                  <span>Base CPV Earning:</span>
                                  <span>{formatCurrency(viewEarning)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Guaranteed Min:</span>
                                  <span>{formatCurrency(minGuarantee)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Max Cap limit:</span>
                                  <span>{formatCurrency(maxPayout)}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>
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
