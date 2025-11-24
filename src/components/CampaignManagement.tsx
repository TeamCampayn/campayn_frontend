import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  TrendingUp
} from 'lucide-react';

// Simple number formatter for this component
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${prefix}${(absValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${prefix}${(absValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${prefix}${(absValue / 1_000).toFixed(1)}K`;
  } else {
    return `${prefix}${absValue.toLocaleString()}`;
  }
};

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
  created_at: string;
  updated_at: string;
}

const CampaignManagement: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchCampaigns();
  }, [selectedPhase]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
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
      // Set empty state on error
      setCampaigns([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (campaignData: Campaign[]) => {
    const stats = {
      total: campaignData.length,
      active: campaignData.filter(c => c.status === 'active').length,
      completed: campaignData.filter(c => c.status === 'completed').length,
      revenue: campaignData
        .filter(c => c.payment_status === 'paid')
        .reduce((sum, c) => sum + (c.budget || 0), 0)
    };
    setStats(stats);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'creator_selection': return 'bg-blue-500';
      case 'payment_pending': return 'bg-yellow-500';
      case 'content_approval': return 'bg-purple-500';
      case 'campaign_active': return 'bg-green-500';
      case 'campaign_complete': return 'bg-gray-500';
      default: return 'bg-gray-400';
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
    return phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const phases = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'creator_selection', label: 'Creator Selection' },
    { value: 'payment_pending', label: 'Payment Pending' },
    { value: 'content_approval', label: 'Content Approval' },
    { value: 'campaign_active', label: 'Campaign Active' },
    { value: 'campaign_complete', label: 'Completed' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600 mt-1">Manage multi-phase campaign workflows</p>
        </div>
        <Button
          onClick={() => window.location.href = '/admin/campaigns/new'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{formatNumber(stats.revenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Filter Tabs */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
        <TabsList className="grid w-full grid-cols-6">
          {phases.map((phase) => (
            <TabsTrigger key={phase.value} value={phase.value}>
              {phase.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedPhase} className="mt-6">
          <div className="grid gap-6">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No campaigns found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedPhase === 'all'
                        ? 'Create your first campaign to get started'
                        : `No campaigns in ${formatPhaseLabel(selectedPhase)} phase`
                      }
                    </p>
                    <Button
                      onClick={() => window.location.href = '/admin/campaigns/new'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Create New Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {campaign.campaign_name}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getPhaseColor(campaign.phase)} text-white`}
                          >
                            {formatPhaseLabel(campaign.phase)}
                          </Badge>
                          <Badge 
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">Brand: {campaign.brand_name}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Campaign Progress</span>
                            <span>{getPhaseProgress(campaign.phase)}%</span>
                          </div>
                          <Progress 
                            value={getPhaseProgress(campaign.phase)} 
                            className="h-2"
                          />
                        </div>

                        {/* Campaign Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">₹{formatNumber(campaign.budget)}</div>
                              <div className="text-gray-500">Budget</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium">
                                {campaign.approved_creators}/{campaign.total_creators}
                              </div>
                              <div className="text-gray-500">Creators</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="font-medium">
                                {campaign.approved_contents}/{campaign.total_contents}
                              </div>
                              <div className="text-gray-500">Content</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div>
                              <div className="font-medium">
                                {new Date(campaign.end_date).toLocaleDateString()}
                              </div>
                              <div className="text-gray-500">End Date</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
                        >
                          View Details
                        </Button>
                        
                        {campaign.phase === 'creator_selection' && (
                          <Button
                            size="sm"
                            onClick={() => navigate('/admin/creators')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Assign Creators
                          </Button>
                        )}

                        {campaign.phase === 'payment_pending' && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/campaigns/${campaign.id}/payment`)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Confirm Payment
                          </Button>
                        )}

                        {campaign.phase === 'content_approval' && (
                          <Button
                            size="sm"
                            onClick={() => window.location.href = `/admin/campaigns/${campaign.id}/content`}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Review Content
                          </Button>
                        )}

                        {campaign.phase === 'campaign_active' && (
                          <Button
                            size="sm"
                            onClick={() => window.location.href = `/admin/campaigns/${campaign.id}/monitor`}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Monitor
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Payment Status Indicator */}
                    {campaign.payment_status && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        {campaign.payment_status === 'paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : campaign.payment_status === 'failed' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          campaign.payment_status === 'paid' ? 'text-green-600' :
                          campaign.payment_status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          Payment {campaign.payment_status}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagement;