import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '@/utils/formatters';
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

      const response = await fetch(`http://localhost:4000/api/campaigns?${params}`);
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
      case 'creator_selection':
        return {
          label: 'View Creator Recommendations',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const
        };
      case 'payment_pending':
        return {
          label: 'Process Payment',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const
        };
      case 'content_approval':
        return {
          label: 'Review Content',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'default' as const
        };
      case 'campaign_active':
        return {
          label: 'Monitor Analytics',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}/analytics`),
          variant: 'outline' as const
        };
      case 'campaign_complete':
        return {
          label: 'View Results',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'outline' as const
        };
      default:
        return {
          label: 'View Campaign',
          action: () => navigate(`/dashboard/campaigns/${campaign.id}`),
          variant: 'outline' as const
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Campaigns</h1>
          <p className="text-gray-600">Multi-phase campaign management dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/create-campaign')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formatNumber(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">Total budget allocated</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Filter Tabs */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="creator_selection">Creator Selection</TabsTrigger>
          <TabsTrigger value="payment_pending">Payment Pending</TabsTrigger>
          <TabsTrigger value="content_approval">Content Approval</TabsTrigger>
          <TabsTrigger value="campaign_active">Campaign Active</TabsTrigger>
          <TabsTrigger value="campaign_complete">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPhase} className="mt-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {selectedPhase === 'all' ? 'No campaigns yet' : `No campaigns in ${formatPhaseLabel(selectedPhase)} phase`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedPhase === 'all' 
                    ? 'Create your first campaign to start connecting with creators'
                    : `Switch to "All Campaigns" to see your complete campaign list`
                  }
                </p>
                {selectedPhase === 'all' && (
                  <Button onClick={() => navigate('/create-campaign')}>
                    <Plus className="h-4 w-4 mr-2" />
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
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getPhaseIcon(campaign.phase)}
                            <CardTitle className="text-xl">{campaign.campaign_name}</CardTitle>
                          </div>
                          <Badge className={getPhaseColor(campaign.phase)}>
                            {formatPhaseLabel(campaign.phase)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            ₹{formatNumber(campaign.budget)}
                          </span>
                          <Button
                            variant={nextAction.variant}
                            size="sm"
                            onClick={nextAction.action}
                          >
                            {nextAction.label}
                            <Eye className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {campaign.description && (
                        <p className="text-gray-600 mb-4">{campaign.description}</p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Campaign Progress</span>
                          <span className="text-sm text-gray-500">{getPhaseProgress(campaign.phase)}%</span>
                        </div>
                        <Progress value={getPhaseProgress(campaign.phase)} className="h-2" />
                      </div>

                      {/* Campaign Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Creators:</span>
                          <span className="font-medium">{campaign.approved_creators || 0}/{campaign.total_creators || 0}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-600">Content:</span>
                          <span className="font-medium">{campaign.approved_contents || 0}/{campaign.total_contents || 0}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-600">Status:</span>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
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