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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {greeting()}, {brand?.brand_name || 'there'}! 👋
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Here's what's happening with your influencer campaigns
              </p>
            </div>
            <Button 
              onClick={() => navigate('/create-campaign')}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Total Campaigns */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Campaigns</p>
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalCampaigns || 0}</p>
                  )}
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              {!loading && stats && stats.totalCampaigns > 0 && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="inline-flex items-center text-blue-600 font-medium">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    View all
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">
                      {(stats?.quotingCampaigns || 0) + (stats?.draftCampaigns || 0)}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {stats.draftCampaigns} draft
                  </span>
                  <span className="px-2 py-1 bg-amber-100 rounded-full text-amber-700">
                    {stats.quotingCampaigns} quoting
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Campaigns */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Live Campaigns</p>
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stats?.liveCampaigns || 0}</p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {!loading && stats && stats.liveCampaigns > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-green-600 font-medium ml-1">Active now</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Creators */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Creators</p>
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stats?.activeCreators || 0}</p>
                  )}
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              {!loading && stats && stats.completedCampaigns > 0 && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-purple-500" />
                  <span>{stats.completedCampaigns} completed</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Overview */}
          <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <span className="text-white/80">Total Investment</span>
                </div>
                {loading ? (
                  <Skeleton className="h-6 w-20 bg-white/20" />
                ) : (
                  <span className="font-bold text-lg">{formatCurrency(stats?.totalSpend || 0)}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </div>
                  <span className="text-white/80">Est. Reach</span>
                </div>
                {loading ? (
                  <Skeleton className="h-6 w-20 bg-white/20" />
                ) : (
                  <span className="font-bold text-lg">{formatNumber(stats?.totalReach || 0)}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-white/80">Completion Rate</span>
                </div>
                {loading ? (
                  <Skeleton className="h-6 w-16 bg-white/20" />
                ) : (
                  <span className="font-bold text-lg">
                    {stats && stats.totalCampaigns > 0 
                      ? Math.round((stats.completedCampaigns / stats.totalCampaigns) * 100) 
                      : 0}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                Recent Campaigns
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/campaigns')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View all
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {campaign.campaign_name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {campaign.campaign_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(campaign.created_at).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getPhaseColor(campaign.phase)} border-0`}>
                          {getPhaseLabel(campaign.phase)}
                        </Badge>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-500 mb-4">Create your first influencer campaign to get started</p>
                  <Button 
                    onClick={() => navigate('/create-campaign')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 to-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-white mb-1">Ready to scale your brand?</h3>
                <p className="text-gray-400">Launch a new influencer campaign and reach millions of engaged audiences</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/campaigns')}
                  variant="outline"
                  className="border-gray-600 text-gray-900 hover:bg-gray-700 hover:text-white bg-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  My Campaigns
                </Button>
                <Button 
                  onClick={() => navigate('/create-campaign')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
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