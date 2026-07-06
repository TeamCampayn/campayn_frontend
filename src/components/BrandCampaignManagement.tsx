import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '@/utils/formatters';
import { getApiUrl } from '@/lib/api';
import {
  Clock,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  Eye,
  RefreshCw
} from 'lucide-react';

interface Campaign {
  id: string;
  campaign_name: string;
  brand_id: string;
  brand_name: string;
  phase: 'approval_pending' | 'approved_pending_funds' | 'creator_selection' | 'payment_pending' | 'content_approval' | 'campaign_active' | 'campaign_complete';
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_admin';
  budget: number;
  start_date: string;
  end_date: string;
  total_creators: number;
  approved_creators: number;
  pending_creators: number;
  total_contents: number;
  approved_contents: number;
  pending_contents: number;
  payment_status: 'pending' | 'paid' | 'failed';
  target_creators_count?: number;
  created_at: string;
  updated_at: string;
  description?: string;
  campaign_objectives?: string[];
  requirements?: string;
  deliverables?: string[];
}

const BrandCampaignManagement: React.FC = () => {
  const { brand } = useAuth();
  const navigate = useNavigate();
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    if (brand?.id) {
      fetchCampaigns();
    }
  }, [brand?.id]);

  const fetchCampaigns = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (!brand?.id) return;

      const params = new URLSearchParams();
      params.append('brand_id', brand.id);

      const response = await fetch(getApiUrl(`api/campaigns?${params}`));
      const data = await response.json();

      if (data.success) {
        setAllCampaigns(data.campaigns || []);
        calculateStats(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setAllCampaigns([]);
      calculateStats([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const calculateStats = (campaignData: Campaign[]) => {
    setStats({
      total: campaignData.length,
      active: campaignData.filter(c => c.status === 'active').length,
      completed: campaignData.filter(c => c.phase === 'campaign_complete').length,
      revenue: campaignData.reduce((sum, c) => sum + (c.budget || 0), 0)
    });
  };

  const filteredCampaigns = React.useMemo(() => {
    if (selectedPhase === 'all') return allCampaigns;
    if (selectedPhase === 'creator_selection') {
      return allCampaigns.filter(c => c.phase === 'creator_selection' || c.phase === 'approval_pending');
    }
    if (selectedPhase === 'payment_pending') {
      return allCampaigns.filter(c => c.phase === 'payment_pending' || c.phase === 'approved_pending_funds');
    }
    if (selectedPhase === 'content_approval') {
      return allCampaigns.filter(c => c.phase === 'content_approval');
    }
    if (selectedPhase === 'campaign_active') {
      return allCampaigns.filter(c => c.phase === 'campaign_active');
    }
    if (selectedPhase === 'campaign_complete') {
      return allCampaigns.filter(c => c.phase === 'campaign_complete');
    }
    return allCampaigns;
  }, [allCampaigns, selectedPhase]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'approval_pending': return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
      case 'creator_selection': return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
      case 'payment_pending': return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
      case 'content_approval': return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
      case 'campaign_active': return 'bg-neutral-900 text-white border border-neutral-900';
      case 'campaign_complete': return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
      default: return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
    }
  };

  const getPhaseProgress = (phase: string) => {
    switch (phase) {
      case 'approval_pending': return 5;
      case 'creator_selection': return 20;
      case 'payment_pending': return 40;
      case 'content_approval': return 60;
      case 'campaign_active': return 80;
      case 'campaign_complete': return 100;
      default: return 0;
    }
  };

  const formatPhaseLabel = (phase: string) => {
    return phase.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'approval_pending': return <Clock className="h-4 w-4" />;
      case 'creator_selection': return <Users className="h-4 w-4" />;
      case 'payment_pending': return <DollarSign className="h-4 w-4" />;
      case 'content_approval': return <FileText className="h-4 w-4" />;
      case 'campaign_active': return <PlayCircle className="h-4 w-4" />;
      case 'campaign_complete': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getNextAction = (campaign: Campaign) => {
    switch (campaign.phase) {
      case 'approval_pending':
        return {
          label: 'Awaiting Admin Review',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'secondary' as const,
          disabled: true
        };
      case 'creator_selection':
        return {
          label: 'View Recommendations',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const,
          disabled: false
        };
      case 'payment_pending':
        return {
          label: 'Process Payment',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const,
          disabled: false
        };
      case 'content_approval':
        return {
          label: 'Review Content',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const,
          disabled: false
        };
      case 'campaign_active':
        return {
          label: 'Monitor Analytics',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}/analytics`),
          variant: 'outline' as const,
          disabled: false
        };
      case 'campaign_complete':
        return {
          label: 'View Results',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'outline' as const,
          disabled: false
        };
      default:
        return {
          label: 'View Campaign',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'outline' as const,
          disabled: false
        };
    }
  };

  const handleRefresh = () => {
    fetchCampaigns(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-space uppercase text-zinc-900 mb-2">My Campaigns</h1>
            <p className="text-xs font-space uppercase text-zinc-500">Multi-phase campaign management dashboard</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase">My Campaigns</h1>
          <p className="text-xs font-space text-zinc-500 uppercase tracking-wider mt-1">Multi-phase campaign management dashboard</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary-pill py-1.5 px-3.5"
          >
            <span className="flex items-center">
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </span>
          </button>
          <button 
            onClick={() => navigate('/create-campaign')}
            className="btn-primary-pill"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Create Campaign
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold font-space text-zinc-400 uppercase tracking-wider mb-1.5">Total Campaigns</p>
              <div className="text-xl font-bold font-space text-neutral-900">{stats.total}</div>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-neutral-800">
              <FileText className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold font-space text-zinc-400 uppercase tracking-wider mb-1.5">Active Campaigns</p>
              <div className="text-xl font-bold font-space text-neutral-900">{stats.active}</div>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-black">
              <PlayCircle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold font-space text-zinc-400 uppercase tracking-wider mb-1.5">Completed</p>
              <div className="text-xl font-bold font-space text-neutral-900">{stats.completed}</div>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-neutral-800">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold font-space text-zinc-400 uppercase tracking-wider mb-1.5">Total Investment</p>
              <div className="text-xl font-bold font-space text-black">₹{formatNumber(stats.revenue)}</div>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-black">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Filter Tabs */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="w-full">
        <div className="flex overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/80 mb-6">
          <TabsList className="bg-neutral-100 border border-neutral-200/60 p-1 rounded-xl h-auto flex flex-nowrap whitespace-nowrap gap-1">
            <TabsTrigger 
              value="all" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              All Campaigns
            </TabsTrigger>
            <TabsTrigger 
              value="creator_selection" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              Creator Selection
            </TabsTrigger>
            <TabsTrigger 
              value="payment_pending" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              Payment Pending
            </TabsTrigger>
            <TabsTrigger 
              value="content_approval" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              Content Approval
            </TabsTrigger>
            <TabsTrigger 
              value="campaign_active" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              Campaign Active
            </TabsTrigger>
            <TabsTrigger 
              value="campaign_complete" 
              className="rounded-lg text-xs py-2 px-4 font-bold font-space uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-500 hover:text-neutral-800"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={selectedPhase} className="mt-6 focus-visible:outline-none">
          {filteredCampaigns.length === 0 ? (
            <Card className="border border-neutral-200 bg-white rounded-2xl">
              <CardContent className="p-16 text-center max-w-md mx-auto">
                <div className="mx-auto w-12 h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl flex items-center justify-center mb-4 text-neutral-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-extrabold font-space uppercase tracking-wider text-neutral-800 mb-2">
                  {selectedPhase === 'all' ? 'No campaigns yet' : `No campaigns in ${formatPhaseLabel(selectedPhase)}`}
                </h3>
                <p className="text-[11px] font-medium leading-relaxed text-neutral-400 mb-6 uppercase tracking-wider">
                  {selectedPhase === 'all' 
                    ? 'Launch your first campaign today to connect with top-tier creators and drive high impact.'
                    : `Try switching to another tab or check your active setups.`
                  }
                </p>
                {selectedPhase === 'all' && (
                  <button 
                    onClick={() => navigate('/create-campaign')}
                    className="btn-primary-pill inline-flex items-center gap-1.5 px-6 py-2.5"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Campaign
                  </button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredCampaigns.map((campaign) => {
                const nextAction = getNextAction(campaign);
                
                // Enhanced color helper
                const getPhaseClasses = (phase: string) => {
                  switch (phase) {
                    case 'approval_pending': 
                      return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
                    case 'creator_selection': 
                      return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
                    case 'approved_pending_funds':
                    case 'payment_pending': 
                      return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
                    case 'content_approval': 
                      return 'bg-zinc-50 text-zinc-600 border border-zinc-200';
                    case 'campaign_active': 
                      return 'bg-neutral-900 text-white border border-neutral-900';
                    case 'campaign_complete': 
                      return 'bg-zinc-50 text-zinc-650 border border-zinc-200';
                    default: 
                      return 'bg-zinc-50 text-zinc-650 border border-zinc-200';
                  }
                };

                return (
                  <Card key={campaign.id} className="bg-white border border-neutral-200/80 hover:border-neutral-400 shadow-sm hover:shadow transition-all duration-300 rounded-2xl overflow-hidden group">
                    <CardHeader className="pb-3 p-6">
                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                         <div className="space-y-1.5">
                           <div className="flex flex-wrap items-center gap-2">
                             <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
                               {getPhaseIcon(campaign.phase)}
                             </span>
                             <CardTitle className="text-base font-extrabold font-space text-neutral-800 uppercase tracking-wide group-hover:text-neutral-900 transition-colors">
                               {campaign.campaign_name}
                             </CardTitle>
                             <span className={`${getPhaseClasses(campaign.phase)} text-[9px] py-0.5 px-2.5 rounded-full font-bold font-space uppercase tracking-wider ml-1`}>
                               {formatPhaseLabel(campaign.phase)}
                             </span>
                           </div>
                          {campaign.description && (
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans max-w-3xl">
                              {campaign.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xs font-bold font-space text-neutral-400 uppercase tracking-wider">
                            Total Budget
                          </span>
                          <span className="text-lg font-extrabold font-space text-neutral-900 mt-0.5">
                            ₹{formatNumber(campaign.budget)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-6 pt-0 space-y-5">
                      {/* Custom Modern Gradient Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold font-space uppercase tracking-wider text-neutral-400">
                          <span>Campaign Phase Progress</span>
                          <span className="text-neutral-800 font-extrabold">{getPhaseProgress(campaign.phase)}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                            style={{ width: `${getPhaseProgress(campaign.phase)}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Campaign Metrics & CTA Actions */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-4 border-t border-neutral-150 gap-4">
                        <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider font-space text-neutral-500 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-neutral-400" />
                            <span>Creators:</span>
                            <span className="text-neutral-800 font-extrabold">
                              {campaign.approved_creators || 0}/{campaign.total_creators || 0}
                            </span>
                          </div>
                          <div className="hidden sm:block w-px h-4 bg-neutral-200" />
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-neutral-400" />
                            <span>Content:</span>
                            <span className="text-neutral-800 font-extrabold">
                              {campaign.approved_contents || 0}/{campaign.total_contents || 0}
                            </span>
                          </div>
                          <div className="hidden sm:block w-px h-4 bg-neutral-200" />
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-neutral-400" />
                            <span>Created:</span>
                            <span className="text-neutral-800 font-extrabold">
                              {new Date(campaign.created_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="hidden sm:block w-px h-4 bg-neutral-200" />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-neutral-400" />
                            <span>Status:</span>
                            <span className={`text-[9px] py-0.5 px-2 rounded-full font-bold border ${
                              campaign.status === 'active' 
                                ? 'border-green-200 text-green-700 bg-green-50/50' 
                                : campaign.status === 'pending_admin' 
                                ? 'border-amber-200 text-amber-700 bg-amber-50/50' 
                                : 'border-neutral-200 text-neutral-600 bg-neutral-50'
                            }`}>
                              {campaign.status === 'pending_admin' ? 'PENDING APPROVAL' : campaign.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={nextAction.action}
                          disabled={nextAction.disabled || campaign.status === 'pending_admin'}
                          className={`text-xs uppercase font-extrabold tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 h-auto ${
                            nextAction.variant === 'default'
                              ? 'btn-primary-pill'
                              : nextAction.variant === 'secondary'
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-transparent'
                              : 'btn-secondary-pill'
                          }`}
                        >
                          <span>{nextAction.label}</span>
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandCampaignManagement;