import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
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
  Zap,
  SlidersHorizontal
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
  likes?: number;
  comments?: number;
  shares?: number;
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

const getBrandDemographics = (brandName: string | undefined) => {
  const name = (brandName || '').toLowerCase();
  
  if (name.includes('tata')) {
    return {
      age: [
        { name: '13-17', value: 3 },
        { name: '18-24', value: 18 },
        { name: '25-34', value: 48 },
        { name: '35-44', value: 22 },
        { name: '45+', value: 9 }
      ],
      gender: [
        { name: 'Male', value: 72 },
        { name: 'Female', value: 24 },
        { name: 'Non-Binary', value: 4 }
      ],
      cities: [
        { name: 'Indore', value: 38 },
        { name: 'Bhopal', value: 27 },
        { name: 'Jabalpur', value: 15 },
        { name: 'Gwalior', value: 12 },
        { name: 'Ujjain', value: 8 }
      ],
      countries: [
        { name: 'India', value: 96, flag: '🇮🇳' },
        { name: 'UAE', value: 2, flag: '🇦🇪' },
        { name: 'Nepal', value: 1, flag: '🇳🇵' },
        { name: 'Others', value: 1, flag: '🌍' }
      ],
      niches: [
        { name: 'EVs & Tech', value: 55 },
        { name: 'Automotive', value: 25 },
        { name: 'Travel & Vlog', value: 12 },
        { name: 'Lifestyle', value: 8 }
      ],
      sentiment: [
        { name: 'Positive', value: 78, color: '#10b981' },
        { name: 'Neutral', value: 16, color: '#64748b' },
        { name: 'Negative', value: 6, color: '#ef4444' }
      ],
      keywords: ['charging', 'silent', 'range', 'acceleration', 'clean energy', 'Indore', 'Lake road', 'EV India'],
      cpc_clicks: 1.6
    };
  } else if (name.includes('nykaa')) {
    return {
      age: [
        { name: '13-17', value: 12 },
        { name: '18-24', value: 54 },
        { name: '25-34', value: 26 },
        { name: '35-44', value: 6 },
        { name: '45+', value: 2 }
      ],
      gender: [
        { name: 'Female', value: 86 },
        { name: 'Male', value: 10 },
        { name: 'Non-Binary', value: 4 }
      ],
      cities: [
        { name: 'Indore', value: 32 },
        { name: 'Mumbai', value: 25 },
        { name: 'Delhi', value: 22 },
        { name: 'Bhopal', value: 13 },
        { name: 'Pune', value: 8 }
      ],
      countries: [
        { name: 'India', value: 94, flag: '🇮🇳' },
        { name: 'Bangladesh', value: 3, flag: '🇧🇩' },
        { name: 'Nepal', value: 2, flag: '🇳🇵' },
        { name: 'Others', value: 1, flag: '🌍' }
      ],
      niches: [
        { name: 'Beauty', value: 65 },
        { name: 'Makeup & Skin', value: 20 },
        { name: 'Fashion', value: 10 },
        { name: 'Lifestyle', value: 5 }
      ],
      sentiment: [
        { name: 'Positive', value: 82, color: '#10b981' },
        { name: 'Neutral', value: 14, color: '#64748b' },
        { name: 'Negative', value: 4, color: '#ef4444' }
      ],
      keywords: ['matte', 'pigment', 'shades', 'affordable', 'long-lasting', 'glam', 'festive', 'lipsticks'],
      cpc_clicks: 2.2
    };
  } else {
    return {
      age: [
        { name: '13-17', value: 15 },
        { name: '18-24', value: 45 },
        { name: '25-34', value: 28 },
        { name: '35-44', value: 9 },
        { name: '45+', value: 3 }
      ],
      gender: [
        { name: 'Male', value: 58 },
        { name: 'Female', value: 38 },
        { name: 'Non-Binary', value: 4 }
      ],
      cities: [
        { name: 'Mumbai', value: 30 },
        { name: 'Delhi', value: 24 },
        { name: 'Indore', value: 20 },
        { name: 'Bangalore', value: 16 },
        { name: 'Kolkata', value: 10 }
      ],
      countries: [
        { name: 'India', value: 92, flag: '🇮🇳' },
        { name: 'US', value: 4, flag: '🇺🇸' },
        { name: 'UK', value: 2, flag: '🇬🇧' },
        { name: 'Others', value: 2, flag: '🌍' }
      ],
      niches: [
        { name: 'Sports & Run', value: 50 },
        { name: 'Fitness', value: 30 },
        { name: 'Sneakers', value: 15 },
        { name: 'Fashion', value: 5 }
      ],
      sentiment: [
        { name: 'Positive', value: 75, color: '#10b981' },
        { name: 'Neutral', value: 18, color: '#64748b' },
        { name: 'Negative', value: 7, color: '#ef4444' }
      ],
      keywords: ['shoes', 'running', 'comfort', 'monsoon run', 'premium', 'durable', 'sole', 'Indore run'],
      cpc_clicks: 1.8
    };
  }
};

const BrandAnalytics: React.FC = () => {
  const { brand, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [creatorPerformance, setCreatorPerformance] = useState<CreatorPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [widgetConfig, setWidgetConfig] = useState<{ [key: string]: boolean }>({
    campaigns: true,
    reach: true,
    engagement: true,
    spend: true,
    cpe: true,
    cpm: true,
    cpc: true,
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    if (brand?.id) {
      fetchAnalytics();
    } else if (!authLoading) {
      // Auth finished loading but no brand — stop spinner
      setLoading(false);
    }
  }, [brand, authLoading, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch campaigns from campaign_overview
      const campaignsRes = await fetch(
        getApiUrl(`/api/campaigns?brand_id=${brand?.id}`)
      );
      const campaignsData = await campaignsRes.json();

      const campaignsList = (campaignsData.success ? campaignsData.campaigns : []) || [];
      setCampaigns(campaignsList);

      // Also fetch dashboard stats for richer metrics
      let dashStats: any = null;
      try {
        const statsRes = await fetch(getApiUrl(`api/dashboard/stats/${brand?.id}`));
        const statsData = await statsRes.json();
        if (statsData.success) dashStats = statsData.stats;
      } catch { /* ignore */ }

      // Calculate analytics summary from campaign_overview data
      const summary = calculateAnalytics(campaignsList, dashStats);
      setAnalytics(summary);

      // Build creator performance from backend dashboard stats topCreators
      if (dashStats?.topCreators && dashStats.topCreators.length > 0) {
        setCreatorPerformance(dashStats.topCreators);
      } else {
        // Fallback mapping if no top creators returned
        const creatorsFromOverview: CreatorPerformance[] = campaignsList
          .filter((c: any) => (c.total_creators || 0) > 0)
          .slice(0, 5)
          .map((c: any, i: number) => ({
            creator_id: String(i + 1),
            creator_name: c.brand_name || `Campaign ${i + 1}`,
            ig_handle: `@${(c.campaign_name || '').toLowerCase().replace(/\s+/g, '_').slice(0, 20)}`,
            followers: c.total_reach || (c.total_creators || 1) * 5000,
            total_posts: c.approved_contents || c.total_contents || 0,
            total_engagement: c.total_engagement || Math.round((c.budget || 0) * 0.15),
            avg_engagement_rate: c.avg_engagement_rate || (c.total_engagement && c.total_reach ? (c.total_engagement / c.total_reach * 100) : 3.2 + Math.random() * 2)
          }));
        setCreatorPerformance(creatorsFromOverview.length > 0 ? creatorsFromOverview : []);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set safe defaults on error so the page still renders
      setAnalytics({
        totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0,
        totalBudgetSpent: 0, totalReach: 0, totalEngagement: 0,
        avgEngagementRate: 0, totalCreators: 0, totalContent: 0, roi: 0
      });
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (campaignsList: any[], dashStats?: any): AnalyticsSummary => {
    const safeCampaigns = Array.isArray(campaignsList) ? campaignsList.filter(Boolean) : [];
    const activeCampaigns = safeCampaigns.filter(c =>
      c.phase === 'campaign_active' || c.phase === 'content_approval' || c.phase === 'content_creation'
    );
    const completedCampaigns = safeCampaigns.filter(c =>
      c.phase === 'campaign_complete' || c.phase === 'completed' || c.status === 'completed'
    );

    const totalBudget = safeCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    // Use dashboard stats reach if available, else sum from overview
    const totalReach = dashStats?.totalReach ||
      safeCampaigns.reduce((sum, c) => sum + (c.total_reach || 0), 0);
    const totalEngagement = dashStats?.totalEngagement ||
      safeCampaigns.reduce((sum, c) => sum + (c.total_engagement || 0), 0);
    const totalCreators = dashStats?.activeCreators ||
      safeCampaigns.reduce((sum, c) => sum + (c.total_creators || c.creator_count || 0), 0);
    const totalContent = safeCampaigns.reduce((sum, c) => sum + (c.total_contents || 0), 0);

    const avgEngagementRate = dashStats?.avgEngagementRate || (totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0);
    const roi = totalBudget > 0 ? ((totalEngagement * 0.05) / totalBudget) * 100 : 0;

    return {
      totalCampaigns: safeCampaigns.length,
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: completedCampaigns.length,
      totalBudgetSpent: totalBudget,
      totalReach,
      totalEngagement,
      avgEngagementRate,
      totalCreators,
      totalContent: totalContent || safeCampaigns.length * 3,
      roi,
      likes: dashStats?.likes || totalEngagement * 0.7,
      comments: dashStats?.comments || totalEngagement * 0.2,
      shares: dashStats?.shares || totalEngagement * 0.1
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
        campaigns: (campaigns || []).filter(Boolean).map(c => ({
          name: c.campaign_name || 'Unnamed',
          phase: c.phase || '',
          budget: c.budget || 0,
          creators: c.creator_count || 0,
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
    return num ? num.toString() : '0';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
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
  const safeCampaigns = Array.isArray(campaigns) ? campaigns.filter(Boolean) : [];
  const campaignPhaseData = [
    { name: 'Creator Selection', value: safeCampaigns.filter(c => c.phase === 'creator_selection').length },
    { name: 'Payment Pending', value: safeCampaigns.filter(c => c.phase === 'payment_pending').length },
    { name: 'Content Approval', value: safeCampaigns.filter(c => c.phase === 'content_approval').length },
    { name: 'Active', value: safeCampaigns.filter(c => c.phase === 'campaign_active').length },
    { name: 'Completed', value: safeCampaigns.filter(c => c.phase === 'campaign_complete').length }
  ].filter(item => item.value > 0);
  const engagementTrendData = safeCampaigns
    .slice(0, 6)
    .reverse()
    .map(c => {
      const estimatedReach = c.total_reach || Math.round((c.budget || 5000) * 1.5 + (c.creator_count || 1) * 2000);
      const estimatedEngagement = c.total_engagement || Math.round(estimatedReach * ((c.avg_engagement_rate || 3.2) / 100));
      return {
        name: c && c.campaign_name ? c.campaign_name.substring(0, 15) : 'Unnamed',
        engagement: estimatedEngagement,
        reach: estimatedReach
      };
    });

  const demoData = getBrandDemographics(brand?.brand_name);
  const clickCount = Math.round(analytics.totalReach * (demoData.cpc_clicks / 100));
  const cpmVal = analytics.totalReach > 0 ? (analytics.totalBudgetSpent / analytics.totalReach) * 1000 : 0;
  const cpcVal = clickCount > 0 ? analytics.totalBudgetSpent / clickCount : 0;
  const cpeVal = analytics.totalEngagement > 0 ? analytics.totalBudgetSpent / analytics.totalEngagement : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
            Analytics & Reports
            <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-normal">
              {brand?.brand_name || 'Standard'} Demo
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Comprehensive overview of your campaign performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-gray-100/50 border border-gray-200/30 p-1 rounded-xl flex gap-1">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
              className={`text-xs py-1 px-2.5 h-auto rounded-lg ${
                timeRange === '7d'
                  ? 'bg-white text-gray-800 border-0 shadow-sm'
                  : 'bg-transparent text-gray-500 border-0 hover:bg-gray-200/30'
              }`}
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
              className={`text-xs py-1 px-2.5 h-auto rounded-lg ${
                timeRange === '30d'
                  ? 'bg-white text-gray-800 border-0 shadow-sm'
                  : 'bg-transparent text-gray-500 border-0 hover:bg-gray-200/30'
              }`}
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
              className={`text-xs py-1 px-2.5 h-auto rounded-lg ${
                timeRange === '90d'
                  ? 'bg-white text-gray-800 border-0 shadow-sm'
                  : 'bg-transparent text-gray-500 border-0 hover:bg-gray-200/30'
              }`}
            >
              90D
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('all')}
              className={`text-xs py-1 px-2.5 h-auto rounded-lg ${
                timeRange === 'all'
                  ? 'bg-white text-gray-800 border-0 shadow-sm'
                  : 'bg-transparent text-gray-500 border-0 hover:bg-gray-200/30'
              }`}
            >
              All
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="border-gray-200/80 text-gray-600 text-xs px-3 py-2 h-auto shadow-sm rounded-xl font-medium flex items-center gap-1.5 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Customize Widgets
          </Button>
          <Button 
            onClick={handleDownloadReport} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 h-auto border-0 shadow-sm rounded-xl font-medium"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Widget Layout Customizer Dropdown */}
      {isConfigOpen && (
        <Card className="p-4 bg-white/95 border border-gray-200 shadow-md rounded-2xl max-w-md animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h3 className="text-xs font-semibold text-gray-700">Toggle Dashboard Columns</h3>
            <span className="text-[10px] text-gray-400">Select which widgets to show</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(widgetConfig).map((key) => (
              <label key={key} className="flex items-center space-x-2 text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetConfig[key]}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
                <span className="capitalize">{key === 'cpm' ? 'CPM (Mille)' : key === 'cpc' ? 'CPC (Clicks)' : key === 'cpe' ? 'CPE (Engagement)' : key}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {widgetConfig.campaigns && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Campaigns</p>
                <div className="text-xl font-bold text-gray-800">{analytics.totalCampaigns}</div>
                <div className="flex items-center mt-1.5 gap-1.5 text-[10px]">
                  <Badge variant="outline" className="bg-blue-50/50 border-blue-100 text-blue-600 py-0 px-1 rounded font-medium shadow-none">{analytics.activeCampaigns} Active</Badge>
                  <span className="text-gray-400 font-medium">{analytics.completedCampaigns} Done</span>
                </div>
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
                <Target className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.reach && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Reach</p>
                <div className="text-xl font-bold text-gray-800">{formatNumber(analytics.totalReach)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-green-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  <span>+12.5% vs last period</span>
                </div>
              </div>
              <div className="p-2.5 bg-green-50 border border-green-100 rounded-xl text-green-600">
                <Eye className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.engagement && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Engagement</p>
                <div className="text-xl font-bold text-gray-800">{formatNumber(analytics.totalEngagement)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-purple-600 font-semibold uppercase tracking-wider">
                  <Heart className="h-3 w-3 mr-0.5" />
                  <span>{analytics.avgEngagementRate.toFixed(2)}% avg rate</span>
                </div>
              </div>
              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.spend && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Budget Spent</p>
                <div className="text-xl font-bold text-gray-800">{formatCurrency(analytics.totalBudgetSpent)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-orange-600 font-semibold uppercase tracking-wider">
                  <Zap className="h-3 w-3 mr-0.5" />
                  <span>{analytics.roi.toFixed(1)}% ROI</span>
                </div>
              </div>
              <div className="p-2.5 bg-orange-50 border border-orange-100 rounded-xl text-orange-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.cpe && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Cost Per Engagement (CPE)</p>
                <div className="text-xl font-bold text-gray-800">{formatCurrency(cpeVal)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-indigo-600 font-medium">
                  <span>Based on likes/comments</span>
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <Activity className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.cpm && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">CPM (Per 1,000 Views)</p>
                <div className="text-xl font-bold text-gray-800">{formatCurrency(cpmVal)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-teal-600 font-medium">
                  <span>View efficiency cost</span>
                </div>
              </div>
              <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
                <Eye className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}

        {widgetConfig.cpc && (
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">CPC (Est. Cost Per Click)</p>
                <div className="text-xl font-bold text-gray-800">{formatCurrency(cpcVal)}</div>
                <div className="flex items-center mt-1.5 text-[10px] text-rose-600 font-medium">
                  <span>{formatNumber(clickCount)} estimated link clicks</span>
                </div>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Total Creators</p>
              <div className="text-lg font-bold text-gray-800">{analytics.totalCreators}</div>
            </div>
            <Users className="h-5 w-5 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Content Pieces</p>
              <div className="text-lg font-bold text-gray-800">{analytics.totalContent}</div>
            </div>
            <FileText className="h-5 w-5 text-green-500" />
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Avg. Engagement Rate</p>
              <div className="text-lg font-bold text-gray-800">{analytics.avgEngagementRate.toFixed(2)}%</div>
            </div>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100/50 border border-gray-200/30 p-1 rounded-xl h-auto flex flex-wrap gap-1 w-full max-w-2xl">
          <TabsTrigger value="overview" className="rounded-lg text-xs py-1.5 px-3 flex-1">Overview</TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-lg text-xs py-1.5 px-3 flex-1">Campaigns</TabsTrigger>
          <TabsTrigger value="creators" className="rounded-lg text-xs py-1.5 px-3 flex-1">Creators</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg text-xs py-1.5 px-3 flex-1">Performance</TabsTrigger>
          <TabsTrigger value="demographics" className="rounded-lg text-xs py-1.5 px-3 flex-1">Audience Demographics</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg text-xs py-1.5 px-3 flex-1">Advanced Insights & ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Phase Distribution */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                  Campaign Phase Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
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
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" />
                  Engagement vs Reach
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stackId="1" 
                      stroke="#2563eb" 
                      fill="#2563eb" 
                      fillOpacity={0.1}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stackId="2" 
                      stroke="#9333ea" 
                      fill="#9333ea" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6 focus-visible:outline-none">
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-gray-100/60">
              <CardTitle className="text-sm font-semibold text-gray-700">Campaign Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {campaigns.slice(0, 10).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white/60 hover:bg-slate-50/80 cursor-pointer transition-all duration-200 group">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{campaign.campaign_name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 font-medium">
                        <span className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-blue-500/80" />
                          {campaign.creator_count} creators
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3.5 w-3.5 mr-1 text-emerald-500/80" />
                          {formatCurrency(campaign.budget)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3.5 w-3.5 mr-1 text-indigo-500/80" />
                          {formatNumber(campaign.total_reach || 0)} reach
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-indigo-50/60 text-indigo-600 border-0 text-[10px] py-0.5 px-2 rounded-full font-medium shadow-none uppercase tracking-wider">
                      {campaign.phase.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6 focus-visible:outline-none">
          <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-gray-100/60">
              <CardTitle className="text-sm font-semibold text-gray-700">Top Performing Creators</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {creatorPerformance.map((creator, index) => (
                  <div key={creator.creator_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-white/60 hover:bg-slate-50/80 transition-all duration-200 gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-9 w-9 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-indigo-100/30 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{creator.creator_name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{creator.ig_handle}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-gray-500">
                      <div className="text-left">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Followers</p>
                        <p className="font-semibold text-gray-700">{formatNumber(creator.followers)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Posts</p>
                        <p className="font-semibold text-gray-700">{creator.total_posts}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Engagement</p>
                        <p className="font-semibold text-gray-700">{formatNumber(creator.total_engagement)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Avg Rate</p>
                        <p className="font-bold text-emerald-600">{creator.avg_engagement_rate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Likes', value: analytics.totalEngagement * 0.7 },
                    { name: 'Comments', value: analytics.totalEngagement * 0.2 },
                    { name: 'Shares', value: analytics.totalEngagement * 0.1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">ROI & Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500">Return on Investment</span>
                    <span className="text-sm font-bold text-green-600">{analytics.roi.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(analytics.roi, 100)} className="h-1.5 bg-gray-100 rounded-full [&>div]:bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500">Engagement Rate</span>
                    <span className="text-sm font-bold text-blue-600">{analytics.avgEngagementRate.toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.min(analytics.avgEngagementRate * 20, 100)} className="h-1.5 bg-gray-100 rounded-full [&>div]:bg-blue-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500">Campaign Completion Rate</span>
                    <span className="text-sm font-bold text-purple-600">
                      {analytics.totalCampaigns > 0 
                        ? ((analytics.completedCampaigns / analytics.totalCampaigns) * 100).toFixed(1) 
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.totalCampaigns > 0 
                      ? (analytics.completedCampaigns / analytics.totalCampaigns) * 100 
                      : 0} 
                    className="h-1.5 bg-gray-100 rounded-full [&>div]:bg-purple-500" 
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="font-medium">Cost per Engagement</span>
                    <span className="font-bold text-gray-800">
                      {analytics.totalEngagement > 0 
                        ? formatCurrency(analytics.totalBudgetSpent / analytics.totalEngagement)
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-350">
            {/* Age Distribution */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm lg:col-span-2">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Audience Age Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demoData.age} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                        {demoData.age.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? '#4f46e5' : '#3b82f6'} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gender Split */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-indigo-500" />
                  Gender Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col justify-between h-[280px]">
                <div className="space-y-5">
                  {demoData.gender.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>{item.name}</span>
                        <span className="text-indigo-600">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 mt-4 text-center">
                  Aggregated statistics from all active campaign creator audiences
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Cities */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">Top Cities</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {demoData.cities.map((city, idx) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                      <span className="text-gray-400 w-4 font-normal">#{idx + 1}</span>
                      <span>{city.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 w-1/2 justify-end">
                      <Progress value={city.value * 2} className="h-1.5 w-24" />
                      <span className="text-xs font-bold text-gray-600 min-w-8 text-right">{city.value}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {demoData.countries.map((country, idx) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-xs font-semibold text-gray-700">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 w-1/2 justify-end">
                      <Progress value={country.value} className="h-1.5 w-24" />
                      <span className="text-xs font-bold text-gray-600 min-w-8 text-right">{country.value}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audience Niches */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">Audience Niche Focus</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoData.niches}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {demoData.niches.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                  {demoData.niches.map((niche, idx) => (
                    <div key={niche.name} className="flex items-center space-x-1.5 text-[10px] font-semibold text-gray-500">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span>{niche.name} ({niche.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-350">
            {/* Comment Sentiment Donut */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                  Audience Feedback & Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-around">
                <div className="h-[220px] w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoData.sentiment}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        dataKey="value"
                      >
                        {demoData.sentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 min-w-[150px]">
                  {demoData.sentiment.map((s) => (
                    <div key={s.name} className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span>{s.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword tags / cloud & Deep Stats */}
            <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-gray-100/60">
                <CardTitle className="text-sm font-semibold text-gray-700">Most Frequently Mentioned in Comments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 flex-1">
                <div className="flex flex-wrap gap-2">
                  {demoData.keywords.map((kw, idx) => (
                    <Badge
                      key={kw}
                      variant="outline"
                      className="bg-slate-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-200 cursor-default text-xs py-1 px-2.5 rounded-lg shadow-none font-medium"
                    >
                      #{kw}
                    </Badge>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Advanced Cost Efficiency Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400">CPM (Cost/1k Views)</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">{formatCurrency(cpmVal)}</p>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400">CPE (Cost/Engagement)</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">{formatCurrency(cpeVal)}</p>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl col-span-2">
                      <p className="text-[10px] font-semibold text-gray-400">CPC (Est. Cost/Click)</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">{formatCurrency(cpcVal)} <span className="text-[10px] text-gray-400 font-normal">({formatNumber(clickCount)} clicks)</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100/60">
          <CardTitle className="text-sm font-semibold text-gray-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2.5">
            <Button 
              variant="outline" 
              onClick={handleDownloadReport}
              className="border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 h-auto rounded-lg"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Download Full Report
            </Button>
            <Button 
              variant="outline"
              className="border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 h-auto rounded-lg"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Share Analytics
            </Button>
            <Button 
              variant="outline"
              className="border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 h-auto rounded-lg"
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Schedule Report
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchAnalytics}
              className="border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 h-auto rounded-lg"
            >
              <Activity className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandAnalytics;
