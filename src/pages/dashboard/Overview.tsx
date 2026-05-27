import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/lib/api';
import { 
  Target, 
  Eye, 
  Users, 
  TrendingUp,
  Plus,
  Rocket,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';

interface DashboardStats {
  totalCampaigns: number;
  draftCampaigns: number;
  quotingCampaigns: number;
  liveCampaigns: number;
  completedCampaigns: number;
  activeCreators: number;
  totalSpend: number;
  totalReach: number;
}

interface RecentCampaign {
  id: string;
  campaign_name: string;
  status: string;
  phase: string;
  created_at: string;
  budget: number;
}

const Overview: React.FC = () => {
  const { brand } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<RecentCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand?.id) {
      fetchDashboardData();
    }
  }, [brand?.id]);

  const fetchDashboardData = async () => {
    if (!brand?.id) return;
    
    setLoading(true);
    try {
      // Use backend API to fetch dashboard stats (bypasses RLS for creators table)
      const response = await fetch(getApiUrl(`api/dashboard/stats/${brand.id}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentCampaigns(data.recentCampaigns || []);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default stats on error
      setStats({
        totalCampaigns: 0,
        draftCampaigns: 0,
        quotingCampaigns: 0,
        liveCampaigns: 0,
        completedCampaigns: 0,
        activeCreators: 0,
        totalSpend: 0,
        totalReach: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'draft':
      case 'quotation_pending':
        return 'bg-gray-100 text-gray-700';
      case 'quotation_sent':
      case 'quotation_accepted':
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'creator_selection':
        return 'bg-blue-100 text-blue-700';
      case 'campaign_active':
      case 'content_creation':
      case 'content_approval':
        return 'bg-green-100 text-green-700';
      case 'completed':
      case 'campaign_complete':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'quotation_pending':
        return 'Pending Quote';
      case 'quotation_sent':
        return 'Quote Sent';
      case 'quotation_accepted':
        return 'Quote Accepted';
      case 'payment_pending':
        return 'payment pending';
      case 'creator_selection':
        return 'Selecting Creators';
      case 'campaign_active':
        return 'Live';
      case 'content_creation':
        return 'Creating Content';
      case 'content_approval':
        return 'content approval';
      case 'completed':
      case 'campaign_complete':
        return 'campaign complete';
      default:
        return phase?.replace(/_/g, ' ') || 'Draft';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-800">
                {greeting()}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{brand?.brand_name || 'there'}</span>! 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Here's what's happening with your influencer campaigns
              </p>
            </div>
            <Button 
              onClick={() => navigate('/create-campaign')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm transition-all duration-200 rounded-xl px-5 py-2 h-auto text-sm font-medium border-0"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Campaigns */}
          <Card className="relative overflow-hidden bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Total Campaigns</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stats?.totalCampaigns || 0}</p>
                  )}
                </div>
                <div className="p-2.5 bg-blue-50/80 border border-blue-100/50 rounded-xl text-blue-600 shadow-sm">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && stats.totalCampaigns > 0 && (
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <span className="inline-flex items-center text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/campaigns')}>
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                    View all
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="relative overflow-hidden bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">In Progress</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      {(stats?.quotingCampaigns || 0) + (stats?.draftCampaigns || 0)}
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-amber-50/80 border border-amber-100/50 rounded-xl text-amber-600 shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-gray-100/60 border border-gray-200/30 rounded-full text-gray-500 font-medium">
                    {stats.draftCampaigns} draft
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-100/30 rounded-full text-amber-700 font-medium">
                    {stats.quotingCampaigns} quoting
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Campaigns */}
          <Card className="relative overflow-hidden bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Live Campaigns</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stats?.liveCampaigns || 0}</p>
                  )}
                </div>
                <div className="p-2.5 bg-green-50/80 border border-green-100/50 rounded-xl text-green-600 shadow-sm">
                  <Rocket className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && stats.liveCampaigns > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] text-green-600 font-semibold uppercase tracking-wider ml-0.5">Active now</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Creators */}
          <Card className="relative overflow-hidden bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Active Creators</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{stats?.activeCreators || 0}</p>
                  )}
                </div>
                <div className="p-2.5 bg-purple-50/80 border border-purple-100/50 rounded-xl text-purple-600 shadow-sm">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && stats.completedCampaigns > 0 && (
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-purple-500" />
                  <span>{stats.completedCampaigns} completed</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Overview */}
          <Card className="lg:col-span-1 border border-indigo-100/20 shadow-[0_4px_20px_rgba(0,0,0,0.01)] bg-gradient-to-br from-white/90 to-slate-50/60 rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Performance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Total Investment</span>
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <span className="font-bold text-sm text-gray-800">{formatCurrency(stats?.totalSpend || 0)}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Eye className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Est. Reach</span>
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <span className="font-bold text-sm text-gray-800">{formatNumber(stats?.totalReach || 0)}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Completion Rate</span>
                </div>
                {loading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="font-bold text-sm text-gray-800">
                    {stats && stats.totalCampaigns > 0 
                      ? Math.round((stats.completedCampaigns / stats.totalCampaigns) * 100) 
                      : 0}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] bg-white/80 rounded-2xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Recent Campaigns
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/campaigns')}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 p-1.5 h-auto rounded-lg"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : recentCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white/60 hover:bg-slate-50/80 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-indigo-100/30 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {campaign.campaign_name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {campaign.campaign_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(campaign.created_at).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getPhaseColor(campaign.phase)} border-0 text-[10px] py-0.5 px-2 rounded-full font-medium shadow-none`}>
                          {getPhaseLabel(campaign.phase)}
                        </Badge>
                        <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">No campaigns yet</h3>
                  <p className="text-xs text-gray-400 mb-4">Create your first influencer campaign to get started</p>
                  <Button 
                    onClick={() => navigate('/create-campaign')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-xl h-auto py-2 px-4 border-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border border-indigo-100/20 bg-gradient-to-r from-blue-600/5 to-purple-600/5 backdrop-blur-sm rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-base font-semibold text-slate-800 mb-1">Ready to scale your brand?</h3>
                <p className="text-xs text-slate-500">Launch a new influencer campaign and reach millions of engaged audiences</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/campaigns')}
                  variant="outline"
                  className="border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-4 py-2 h-auto rounded-xl"
                >
                  <Target className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  My Campaigns
                </Button>
                <Button 
                  onClick={() => navigate('/create-campaign')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 h-auto border-0 shadow-sm rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Campaign
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;