import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { getApiUrl } from '../../lib/api';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  Target,
  Download,
  Calendar,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Share2,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
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
  Area,
  AreaChart
} from 'recharts';

interface Campaign {
  id: string;
  campaign_name: string;
  phase: string;
  status: string;
  budget: number;
  creator_count: number;
  total_reach?: number;
  total_engagement?: number;
  created_at: string;
}

interface AnalyticsSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalBudgetSpent: number;
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalCreators: number;
  totalContent: number;
  roi: number;
}

interface CreatorPerformance {
  creator_id: string;
  creator_name: string;
  ig_handle: string;
  followers: number;
  total_posts: number;
  total_engagement: number;
  avg_engagement_rate: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const BrandAnalytics: React.FC = () => {
  const { brand } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [creatorPerformance, setCreatorPerformance] = useState<CreatorPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    if (brand?.id) {
      fetchAnalytics();
    }
  }, [brand, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns
      const campaignsRes = await fetch(
        getApiUrl(`/api/campaigns?brand_id=${brand?.id}`)
      );
      const campaignsData = await campaignsRes.json();
      
      if (campaignsData.success) {
        setCampaigns(campaignsData.campaigns || []);
        
        // Calculate analytics summary
        const summary = calculateAnalytics(campaignsData.campaigns || []);
        setAnalytics(summary);
      }
      
      // Fetch creator performance data
      // For now, using mock data - replace with actual API call
      setCreatorPerformance([
        {
          creator_id: '1',
          creator_name: 'Creator One',
          ig_handle: '@creator_one',
          followers: 50000,
          total_posts: 12,
          total_engagement: 8500,
          avg_engagement_rate: 3.4
        },
        {
          creator_id: '2',
          creator_name: 'Creator Two',
          ig_handle: '@creator_two',
          followers: 75000,
          total_posts: 8,
          total_engagement: 12000,
          avg_engagement_rate: 4.2
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (campaigns: Campaign[]): AnalyticsSummary => {
    const activeCampaigns = campaigns.filter(c => 
      c.phase === 'campaign_active' || c.phase === 'content_approval'
    );
    const completedCampaigns = campaigns.filter(c => c.phase === 'campaign_complete');
    
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const totalReach = campaigns.reduce((sum, c) => sum + (c.total_reach || 0), 0);
    const totalEngagement = campaigns.reduce((sum, c) => sum + (c.total_engagement || 0), 0);
    const totalCreators = campaigns.reduce((sum, c) => sum + (c.creator_count || 0), 0);
    
    const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
    const roi = totalBudget > 0 ? ((totalEngagement * 0.05) / totalBudget) * 100 : 0; // Simplified ROI
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: completedCampaigns.length,
      totalBudgetSpent: totalBudget,
      totalReach,
      totalEngagement,
      avgEngagementRate,
      totalCreators,
      totalContent: campaigns.length * 5, // Estimate
      roi
    };
  };

  const handleDownloadReport = async () => {
    try {
      toast({
        title: 'Generating Report',
        description: 'Your analytics report is being prepared...'
      });
      
      // TODO: Implement actual PDF/CSV generation
      // For now, prepare data for download
      const reportData = {
        brand: brand?.brand_name,
        generated_at: new Date().toISOString(),
        period: timeRange,
        summary: analytics,
        campaigns: campaigns.map(c => ({
          name: c.campaign_name,
          phase: c.phase,
          budget: c.budget,
          creators: c.creator_count,
          reach: c.total_reach || 0,
          engagement: c.total_engagement || 0
        })),
        creator_performance: creatorPerformance
      };
      
      // Create downloadable JSON (temporary - replace with PDF/CSV)
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campayn-analytics-${brand?.brand_name}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast({
        title: 'Report Downloaded',
        description: 'Your analytics report has been downloaded successfully.'
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive'
      });
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">Create campaigns to start tracking analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const campaignPhaseData = [
    { name: 'Creator Selection', value: campaigns.filter(c => c.phase === 'creator_selection').length },
    { name: 'Payment Pending', value: campaigns.filter(c => c.phase === 'payment_pending').length },
    { name: 'Content Approval', value: campaigns.filter(c => c.phase === 'content_approval').length },
    { name: 'Active', value: campaigns.filter(c => c.phase === 'campaign_active').length },
    { name: 'Completed', value: campaigns.filter(c => c.phase === 'campaign_complete').length }
  ].filter(item => item.value > 0);

  const engagementTrendData = campaigns
    .slice(0, 6)
    .reverse()
    .map(c => ({
      name: c.campaign_name.substring(0, 15),
      engagement: c.total_engagement || 0,
      reach: c.total_reach || 0
    }));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your campaign performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('all')}
            >
              All Time
            </Button>
          </div>
          <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalCampaigns}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Badge variant="outline" className="mr-2">{analytics.activeCampaigns} Active</Badge>
                  <span className="text-gray-500">{analytics.completedCampaigns} Completed</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(analytics.totalReach)}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+12.5% vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(analytics.totalEngagement)}</p>
                <div className="flex items-center mt-2 text-sm text-purple-600">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{analytics.avgEngagementRate.toFixed(2)}% avg rate</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(analytics.totalBudgetSpent)}</p>
                <div className="flex items-center mt-2 text-sm text-orange-600">
                  <Zap className="h-4 w-4 mr-1" />
                  <span>{analytics.roi.toFixed(1)}% ROI</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Creators</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalCreators}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Pieces</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.totalContent}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.avgEngagementRate.toFixed(2)}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Phase Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Campaign Phase Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={campaignPhaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {campaignPhaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement vs Reach Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Engagement vs Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stackId="2" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 10).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{campaign.campaign_name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.creator_count} creators
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(campaign.budget)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {formatNumber(campaign.total_reach || 0)} reach
                        </span>
                      </div>
                    </div>
                    <Badge className={
                      campaign.phase === 'campaign_active' ? 'bg-green-100 text-green-800' :
                      campaign.phase === 'campaign_complete' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {campaign.phase.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creatorPerformance.map((creator, index) => (
                  <div key={creator.creator_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{creator.creator_name}</h4>
                        <p className="text-sm text-gray-600">{creator.ig_handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Followers</p>
                        <p className="font-semibold text-gray-900">{formatNumber(creator.followers)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Posts</p>
                        <p className="font-semibold text-gray-900">{creator.total_posts}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-semibold text-gray-900">{formatNumber(creator.total_engagement)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Avg Rate</p>
                        <p className="font-semibold text-green-600">{creator.avg_engagement_rate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Likes', value: analytics.totalEngagement * 0.7 },
                    { name: 'Comments', value: analytics.totalEngagement * 0.2 },
                    { name: 'Shares', value: analytics.totalEngagement * 0.1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI & Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Return on Investment</span>
                      <span className="text-lg font-bold text-green-600">{analytics.roi.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.roi, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Engagement Rate</span>
                      <span className="text-lg font-bold text-blue-600">{analytics.avgEngagementRate.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(analytics.avgEngagementRate * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Campaign Completion Rate</span>
                      <span className="text-lg font-bold text-purple-600">
                        {analytics.totalCampaigns > 0 
                          ? ((analytics.completedCampaigns / analytics.totalCampaigns) * 100).toFixed(1) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${analytics.totalCampaigns > 0 
                            ? (analytics.completedCampaigns / analytics.totalCampaigns) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cost per Engagement</span>
                      <span className="font-semibold">
                        {analytics.totalEngagement > 0 
                          ? formatCurrency(analytics.totalBudgetSpent / analytics.totalEngagement)
                          : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Analytics
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline" onClick={fetchAnalytics}>
              <Activity className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandAnalytics;
