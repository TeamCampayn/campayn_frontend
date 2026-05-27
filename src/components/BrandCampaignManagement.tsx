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
  phase: 'creator_selection' | 'payment_pending' | 'content_approval' | 'campaign_active' | 'campaign_complete';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
  }, [selectedPhase, brand?.id]);

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
      if (selectedPhase !== 'all') {
        params.append('phase', selectedPhase);
      }

      const response = await fetch(getApiUrl(`api/campaigns?${params}`));
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns || []);
        calculateStats(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'approval_pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'creator_selection': return 'bg-blue-100 text-blue-800';
      case 'payment_pending': return 'bg-yellow-100 text-yellow-800';
      case 'content_approval': return 'bg-purple-100 text-purple-800';
      case 'campaign_active': return 'bg-green-100 text-green-800';
      case 'campaign_complete': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
          label: 'View Creator Recommendations',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Campaigns</h1>
            <p className="text-gray-600">Multi-phase campaign management dashboard</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">My Campaigns</h1>
          <p className="text-xs text-gray-500 mt-1">Multi-phase campaign management dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-gray-200 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 h-auto rounded-xl"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => navigate('/create-campaign')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 h-auto border-0 shadow-sm rounded-xl font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Campaigns</p>
              <div className="text-xl font-bold text-gray-800">{stats.total}</div>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Active Campaigns</p>
              <div className="text-xl font-bold text-gray-800">{stats.active}</div>
            </div>
            <div className="p-2.5 bg-green-50 border border-green-100 rounded-xl text-green-600">
              <PlayCircle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Completed</p>
              <div className="text-xl font-bold text-gray-800">{stats.completed}</div>
            </div>
            <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Investment</p>
              <div className="text-xl font-bold text-gray-800">₹{formatNumber(stats.revenue)}</div>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Filter Tabs */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="w-full">
        <TabsList className="bg-gray-100/50 border border-gray-200/30 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="all" className="rounded-lg text-xs py-1.5 px-3">All Campaigns</TabsTrigger>
          <TabsTrigger value="creator_selection" className="rounded-lg text-xs py-1.5 px-3">Creator Selection</TabsTrigger>
          <TabsTrigger value="payment_pending" className="rounded-lg text-xs py-1.5 px-3">Payment Pending</TabsTrigger>
          <TabsTrigger value="content_approval" className="rounded-lg text-xs py-1.5 px-3">Content Approval</TabsTrigger>
          <TabsTrigger value="campaign_active" className="rounded-lg text-xs py-1.5 px-3">Campaign Active</TabsTrigger>
          <TabsTrigger value="campaign_complete" className="rounded-lg text-xs py-1.5 px-3">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPhase} className="mt-6 focus-visible:outline-none">
          {campaigns.length === 0 ? (
            <Card className="border border-gray-200/40 bg-white/80 rounded-2xl">
              <CardContent className="p-8 text-center">
                <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {selectedPhase === 'all' ? 'No campaigns yet' : `No campaigns in ${formatPhaseLabel(selectedPhase)} phase`}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {selectedPhase === 'all' 
                    ? 'Create your first campaign to start connecting with creators'
                    : `Switch to "All Campaigns" to see your complete campaign list`
                  }
                </p>
                {selectedPhase === 'all' && (
                  <Button 
                    onClick={() => navigate('/create-campaign')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 h-auto border-0 shadow-sm rounded-xl font-medium"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Your First Campaign
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => {
                const nextAction = getNextAction(campaign);
                return (
                  <Card key={campaign.id} className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl overflow-hidden group">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{getPhaseIcon(campaign.phase)}</span>
                            <CardTitle className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {campaign.campaign_name}
                            </CardTitle>
                          </div>
                          <Badge className={`${getPhaseColor(campaign.phase)} border-0 text-[10px] py-0.5 px-2 rounded-full font-medium shadow-none`}>
                            {formatPhaseLabel(campaign.phase)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t border-gray-100/60 sm:border-t-0">
                          <span className="text-xs font-semibold text-gray-600">
                            Budget: ₹{formatNumber(campaign.budget)}
                          </span>
                          <Button
                            variant={nextAction.variant}
                            size="sm"
                            onClick={nextAction.action}
                            disabled={nextAction.disabled || campaign.status === 'pending_admin'}
                            className={`text-xs px-3 py-1.5 h-auto rounded-lg ${
                              nextAction.variant === 'default'
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-0'
                                : nextAction.variant === 'secondary'
                                ? 'bg-gray-100 text-gray-400 border-0 cursor-not-allowed'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <span>{nextAction.label}</span>
                            <Eye className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {campaign.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{campaign.description}</p>
                      )}
                      
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-gray-500">Campaign Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{getPhaseProgress(campaign.phase)}%</span>
                        </div>
                        <Progress value={getPhaseProgress(campaign.phase)} className="h-1.5 bg-gray-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />
                      </div>

                      {/* Campaign Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100/60 text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-gray-400">Creators:</span>
                          <span className="font-semibold text-gray-700">{campaign.approved_creators || 0}/{campaign.total_creators || 0}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-purple-500" />
                          <span className="text-gray-400">Content:</span>
                          <span className="font-semibold text-gray-700">{campaign.approved_contents || 0}/{campaign.total_contents || 0}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-gray-400">Created:</span>
                          <span className="font-semibold text-gray-700">
                            {new Date(campaign.created_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-orange-500" />
                          <span className="text-gray-400">Status:</span>
                          <Badge 
                            variant={campaign.status === 'active' ? 'default' : campaign.status === 'pending_admin' ? 'outline' : 'secondary'} 
                            className={`text-[10px] py-0.5 px-2 shadow-none font-semibold uppercase tracking-wider ${
                              campaign.status === 'pending_admin' 
                                ? 'border-amber-200 bg-amber-50 text-amber-800' 
                                : ''
                            }`}
                          >
                            {campaign.status === 'pending_admin' ? 'Pending Approval' : campaign.status}
                          </Badge>
                        </div>
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