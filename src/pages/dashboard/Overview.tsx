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
  totalEngagement?: number;
  avgEngagementRate?: number;
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

  const getPhaseClasses = (phase: string) => {
    switch (phase) {
      case 'approval_pending': 
        return 'bg-blue-50/70 text-blue-700 border border-blue-200/60';
      case 'creator_selection': 
        return 'bg-indigo-50/70 text-indigo-700 border border-indigo-200/60';
      case 'approved_pending_funds':
      case 'payment_pending': 
        return 'bg-amber-50/70 text-amber-700 border border-amber-200/60';
      case 'content_approval': 
        return 'bg-purple-50/70 text-purple-700 border border-purple-200/60';
      case 'campaign_active': 
        return 'bg-emerald-50/70 text-emerald-700 border border-emerald-200/60';
      case 'completed':
      case 'campaign_complete': 
        return 'bg-neutral-50 text-neutral-600 border border-neutral-200';
      default: 
        return 'bg-neutral-50 text-neutral-600 border border-neutral-200';
    }
  };

  return (
    <div className="bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold font-space tracking-tight text-neutral-900 uppercase">
                {greeting()}, <span className="text-neutral-900 font-extrabold">{brand?.brand_name || 'Partner'}</span>! 👋
              </h1>
              <p className="text-xs font-space text-neutral-400 uppercase tracking-wider mt-1.5">
                Real-time analytics & active campaign lifecycle manager
              </p>
            </div>
            <button 
              onClick={() => navigate('/create-campaign')}
              className="btn-primary-pill shadow-sm transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Campaign
              </span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Investment */}
          <Card className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold font-space text-neutral-400 uppercase tracking-wider mb-2">Total Investment</p>
                  {loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-3xl font-extrabold font-space text-neutral-800">{formatCurrency(stats?.totalSpend || 0)}</p>
                  )}
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 group-hover:scale-105 transition-transform duration-300">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider font-space">
                  <span className="inline-flex items-center text-neutral-950 hover:underline cursor-pointer" onClick={() => navigate('/wallet')}>
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                    Manage Wallet
                  </span>
                  <span className="text-neutral-400 font-medium font-sans lowercase">active spend</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estimated Reach */}
          <Card className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold font-space text-neutral-400 uppercase tracking-wider mb-2">Estimated Reach</p>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-extrabold font-space text-neutral-800">{formatNumber(stats?.totalReach || 0)}</p>
                  )}
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 group-hover:scale-105 transition-transform duration-300">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider font-space">
                  <span className="text-neutral-800">Total impressions</span>
                  <span className="text-neutral-400 font-medium font-sans lowercase">est. audience</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Engagement */}
          <Card className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold font-space text-neutral-400 uppercase tracking-wider mb-2">Total Engagement</p>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-extrabold font-space text-neutral-800">{formatNumber(stats?.totalEngagement || 0)}</p>
                  )}
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 group-hover:scale-105 transition-transform duration-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider font-space">
                  <span className="text-neutral-800">Likes & Comments</span>
                  <span className="text-neutral-400 font-medium font-sans lowercase">social feedback</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold font-space text-neutral-400 uppercase tracking-wider mb-2">Engagement Rate</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-extrabold font-space text-neutral-800">
                      {(stats?.avgEngagementRate || 0).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              {!loading && stats && (
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider font-space">
                  <span className="text-neutral-850">Avg creator ER</span>
                  <span className="text-neutral-400 font-medium font-sans lowercase">industry standard</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Overview (Campaign Lifecycles) */}
          <Card className="lg:col-span-1 border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-neutral-100 p-5">
              <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-neutral-800" />
                Campaign Lifecycles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-50 border border-neutral-200/60 rounded-lg text-neutral-700">
                      <Target className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-space font-bold text-neutral-500 uppercase tracking-wider">Total Campaigns</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="font-extrabold font-space text-sm text-neutral-800">{stats?.totalCampaigns || 0}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-50 border border-neutral-200/60 rounded-lg text-neutral-700">
                      <Rocket className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-space font-bold text-neutral-500 uppercase tracking-wider">Live Now</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="font-extrabold font-space text-sm text-neutral-800">{stats?.liveCampaigns || 0}</span>
                  )}
                </div>

                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-50 border border-neutral-200/60 rounded-lg text-neutral-700">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-space font-bold text-neutral-500 uppercase tracking-wider">In Progress</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="font-extrabold font-space text-sm text-neutral-800">
                      {(stats?.quotingCampaigns || 0) + (stats?.draftCampaigns || 0)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-50 border border-neutral-200/60 rounded-lg text-neutral-700">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-space font-bold text-neutral-500 uppercase tracking-wider">Active Creators</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="font-extrabold font-space text-sm text-neutral-800">{stats?.activeCreators || 0}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-50 border border-neutral-200/60 rounded-lg text-neutral-700">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-space font-bold text-neutral-500 uppercase tracking-wider">Completion Rate</span>
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="font-extrabold font-space text-sm text-neutral-800">
                      {stats && stats.totalCampaigns > 0 
                        ? Math.round((stats.completedCampaigns / stats.totalCampaigns) * 100) 
                        : 0}%
                    </span>
                  )}
                </div>
              </div>

              {/* Circular/Linear visual tracker for Completion Rate */}
              {!loading && stats && stats.totalCampaigns > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex justify-between text-[9px] font-bold font-space uppercase text-neutral-400 tracking-wider">
                    <span>Campaign Success Tracker</span>
                    <span>{stats.completedCampaigns} / {stats.totalCampaigns} Done</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-neutral-900 rounded-full"
                      style={{ width: `${Math.round((stats.completedCampaigns / stats.totalCampaigns) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 p-5">
              <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-400" />
                Recent Campaigns
              </CardTitle>
              <button 
                onClick={() => navigate('/campaigns')}
                className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-950 hover:text-neutral-850 hover:underline flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </CardHeader>
            <CardContent className="p-5">
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
                       onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                       className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-150 bg-neutral-50/40 hover:bg-neutral-50 hover:border-neutral-400 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 font-space font-extrabold text-xs uppercase shadow-sm group-hover:border-neutral-900 group-hover:text-neutral-900 transition-colors">
                          {campaign.campaign_name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-xs font-bold font-space text-neutral-800 uppercase tracking-wide group-hover:text-neutral-900 transition-colors">
                            {campaign.campaign_name}
                          </p>
                          <p className="text-[9px] font-bold font-space text-neutral-400 mt-0.5 uppercase tracking-wider">
                            {new Date(campaign.created_at).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`${getPhaseClasses(campaign.phase)} font-space text-[9px] uppercase tracking-wider py-0.5 px-2.5 rounded-full font-bold`}>
                          {getPhaseLabel(campaign.phase)}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-neutral-400" />
                  </div>
                  <h3 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 mb-1">No campaigns yet</h3>
                  <p className="text-[10px] text-neutral-400 mb-4 uppercase tracking-wider">Create your first influencer campaign to get started</p>
                  <button 
                    onClick={() => navigate('/create-campaign')}
                    className="btn-primary-pill py-1.5 px-4"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create Campaign
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border border-neutral-800 bg-neutral-900 text-white rounded-2xl shadow-sm overflow-hidden relative">
          {/* Ambient Glow Graphic Overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-1">
                <h3 className="text-lg font-bold font-space uppercase tracking-wider text-white">Ready to scale your brand?</h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-xl">
                  Launch a new targeted influencer campaign, recruit creators dynamically, and reach millions of engaged local consumers in Indore, Bhopal, and across MP.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button 
                  onClick={() => navigate('/campaigns')}
                  className="bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white rounded-full py-2.5 px-6 transition-all duration-200 uppercase tracking-wider text-xs font-extrabold font-space"
                >
                  <span className="flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    My Campaigns
                  </span>
                </button>
                <button 
                  onClick={() => navigate('/create-campaign')}
                  className="bg-white text-black hover:bg-neutral-250 border border-transparent rounded-full py-2.5 px-6 transition-all duration-200 uppercase tracking-wider text-xs font-extrabold font-space"
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-4 w-4" />
                    New Campaign
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;