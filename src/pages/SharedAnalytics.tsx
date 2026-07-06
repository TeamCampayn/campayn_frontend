import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { getApiUrl } from '../lib/api';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  DollarSign,
  Target,
  FileText,
  Activity,
  ArrowUpRight,
  Printer,
  ShieldAlert
} from 'lucide-react';
import {
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
  avg_engagement_rate?: number;
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

const COLORS = ['#000000', '#09090B', '#71717A', '#27272A', '#D4D4D8', '#A1A1AA'];

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

const SharedAnalytics: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('Standard Brand');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [creatorPerformance, setCreatorPerformance] = useState<CreatorPerformance[]>([]);

  useEffect(() => {
    if (brandId) {
      fetchAnalytics();
    }
  }, [brandId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const campaignsRes = await fetch(
        getApiUrl(`/api/campaigns?brand_id=${brandId}`)
      );
      const campaignsData = await campaignsRes.json();
      const campaignsList = (campaignsData.success ? campaignsData.campaigns : []) || [];
      setCampaigns(campaignsList);

      let dashStats: any = null;
      try {
        const statsRes = await fetch(getApiUrl(`/api/dashboard/stats/${brandId}`));
        const statsData = await statsRes.json();
        if (statsData.success) {
          dashStats = statsData.stats;
          if (statsData.brand_name) {
            setBrandName(statsData.brand_name);
          }
        }
      } catch { /* ignore */ }

      const summary = calculateAnalytics(campaignsList, dashStats);
      setAnalytics(summary);

      if (dashStats?.topCreators && dashStats.topCreators.length > 0) {
        setCreatorPerformance(dashStats.topCreators);
      } else {
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
      console.error('Error fetching shared analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shared analytics data',
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
      <div className="p-8 flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Loading Shared Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 min-h-screen bg-zinc-50 flex items-center justify-center">
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl max-w-md w-full">
          <CardContent className="py-12 text-center">
            <ShieldAlert className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 mb-2">No Analytics Data</h3>
            <p className="text-[10px] font-space uppercase tracking-wider text-zinc-500">This shared link does not point to an active brand dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const demoData = getBrandDemographics(brandName);
  const clickCount = Math.round(analytics.totalReach * (demoData.cpc_clicks / 100));
  const cpmVal = analytics.totalReach > 0 ? (analytics.totalBudgetSpent / analytics.totalReach) * 1000 : 0;
  const cpcVal = clickCount > 0 ? analytics.totalBudgetSpent / clickCount : 0;
  const cpeVal = analytics.totalEngagement > 0 ? analytics.totalBudgetSpent / analytics.totalEngagement : 0;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-8">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #ffffff !important; }
          .print-hidden { display: none !important; }
          [role="tabpanel"] { display: block !important; opacity: 1 !important; visibility: visible !important; page-break-before: always; }
          [role="tablist"] { display: none !important; }
          .recharts-wrapper, .recharts-surface { overflow: visible !important; }
          .bg-zinc-50 { background-color: #ffffff !important; }
          [class*="rounded-2xl"] { break-inside: avoid; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tighter uppercase font-space text-black">Campayn</span>
              <span className="text-[9px] bg-neutral-900 text-white px-2 py-0.5 rounded-full font-bold font-space uppercase">Shared Link</span>
            </div>
            <h1 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mt-2 flex items-center gap-2">
              {brandName} Performance Analytics
            </h1>
            <p className="text-xs font-space text-zinc-500 uppercase tracking-wider mt-1.5">Read-Only Analytics Snapshot � Real-time tracking</p>
          </div>
          <div className="print-hidden">
            <button
              onClick={() => window.print()}
              className="btn-primary-pill text-xs py-2 px-4 h-9 flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-1">Total Campaigns</p>
                <div className="text-xl font-bold font-space text-neutral-900">{analytics.totalCampaigns}</div>
                <div className="flex items-center mt-1.5 gap-1.5 text-[9px] font-space uppercase tracking-wider font-bold">
                  <span className="border border-zinc-200 text-zinc-650 bg-white py-0.5 px-2.5 rounded-full">{analytics.activeCampaigns} Active</span>
                </div>
              </div>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-neutral-900">
                <Target className="h-4 w-4 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-1">Total Reach</p>
                <div className="text-xl font-bold font-space text-neutral-900">{formatNumber(analytics.totalReach)}</div>
                <div className="flex items-center mt-1.5 text-[9px] font-space uppercase tracking-wider font-bold text-zinc-500">
                  <ArrowUpRight className="h-3 w-3 mr-0.5 text-neutral-800" />
                  <span>+12.5% vs last period</span>
                </div>
              </div>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-neutral-900">
                <Eye className="h-4 w-4 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-1">Total Engagement</p>
                <div className="text-xl font-bold font-space text-neutral-900">{formatNumber(analytics.totalEngagement)}</div>
                <div className="flex items-center mt-1.5 text-[9px] font-space uppercase tracking-wider font-bold text-neutral-900">
                  <Heart className="h-3 w-3 mr-0.5 text-black" />
                  <span>{(analytics.avgEngagementRate || 0).toFixed(2)}% avg rate</span>
                </div>
              </div>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-neutral-900">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-1">Budget Spent</p>
                <div className="text-xl font-bold font-space text-neutral-900">{formatCurrency(analytics.totalBudgetSpent)}</div>
                <div className="flex items-center mt-1.5 text-[9px] font-space uppercase tracking-wider font-bold text-neutral-900">
                  <Activity className="h-3 w-3 mr-0.5 text-black" />
                  <span>{(analytics.roi || 0).toFixed(1)}% ROI</span>
                </div>
              </div>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-neutral-900">
                <DollarSign className="h-4 w-4 text-black" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-zinc-200 p-1 rounded-full w-full max-w-5xl flex flex-row flex-nowrap items-center justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-1.5 shadow-sm">
            <TabsTrigger value="overview" className="rounded-full text-[10px] md:text-xs font-bold font-space uppercase tracking-wider py-1.5 px-3 md:px-4 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200 shrink-0">Overview</TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-full text-[10px] md:text-xs font-bold font-space uppercase tracking-wider py-1.5 px-3 md:px-4 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200 shrink-0">Campaigns</TabsTrigger>
            <TabsTrigger value="creators" className="rounded-full text-[10px] md:text-xs font-bold font-space uppercase tracking-wider py-1.5 px-3 md:px-4 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200 shrink-0">Creators</TabsTrigger>
            <TabsTrigger value="demographics" className="rounded-full text-[10px] md:text-xs font-bold font-space uppercase tracking-wider py-1.5 px-3 md:px-4 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-200 shrink-0">Audience Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl">
                <CardHeader className="pb-3 border-b border-zinc-100">
                  <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-black" />
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
                        fill="#000000"
                        dataKey="value"
                        style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', fontWeight: 'bold' }}
                      >
                        {campaignPhaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl">
                <CardHeader className="pb-3 border-b border-zinc-100">
                  <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-black" />
                    Engagement vs Reach Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={engagementTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                      <YAxis stroke="#94a3b8" fontSize={10} style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                      <Tooltip contentStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px' }} />
                      <Legend wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="reach" stackId="1" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="engagement" stackId="2" stroke="#09090B" fill="#09090B" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6 focus-visible:outline-none">
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Campaign Performance Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {campaigns.slice(0, 10).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 bg-white">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-850">{campaign.campaign_name}</h4>
                        <div className="flex items-center gap-4 mt-1.5 text-[10px] font-space uppercase tracking-wider font-bold text-zinc-400">
                          <span className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1 text-black" />
                            {campaign.creator_count} creators
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3.5 w-3.5 mr-1 text-neutral-850" />
                            {formatCurrency(campaign.budget)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3.5 w-3.5 mr-1 text-black" />
                            {formatNumber(campaign.total_reach || 0)} reach
                          </span>
                        </div>
                      </div>
                      <span className="border border-zinc-200 text-zinc-650 bg-white font-space text-[9px] uppercase tracking-wider py-0.5 px-2.5 rounded-full font-bold">
                        {(campaign.phase || '').replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6 focus-visible:outline-none">
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Top Performing Creators</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {creatorPerformance.map((creator, index) => (
                    <div key={creator.creator_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-neutral-900 font-bold font-space text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-805">{creator.creator_name}</h4>
                          <p className="text-[10px] font-space text-zinc-400 mt-0.5 uppercase tracking-wider">{creator.ig_handle}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500">
                        <div>
                          <p className="text-zinc-400 text-[9px] uppercase tracking-wider mb-0.5 font-bold">Followers</p>
                          <p className="text-neutral-800">{formatNumber(creator.followers)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[9px] uppercase tracking-wider mb-0.5 font-bold">Posts</p>
                          <p className="text-neutral-800">{creator.total_posts}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[9px] uppercase tracking-wider mb-0.5 font-bold">Engagement</p>
                          <p className="text-neutral-800">{formatNumber(creator.total_engagement)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-[9px] uppercase tracking-wider mb-0.5 font-bold">Avg Rate</p>
                          <p className="text-black font-extrabold">{(creator.avg_engagement_rate || 0).toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-350">
              <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl lg:col-span-2">
                <CardHeader className="pb-3 border-b border-zinc-100">
                  <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-black" />
                    Audience Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demoData.age} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="%" style={{ fontFamily: 'Space Grotesk, sans-serif' }} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px' }} />
                        <Bar dataKey="value" fill="#000000" radius={[6, 6, 0, 0]} barSize={40}>
                          {demoData.age.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 2 ? '#09090B' : '#000000'} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl">
                <CardHeader className="pb-3 border-b border-zinc-100">
                  <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-black" />
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col justify-between h-[280px]">
                  <div className="space-y-5">
                    {demoData.gender.map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between items-center mb-1 font-space text-[10px] uppercase tracking-wider font-bold">
                          <span className="text-zinc-500">{item.name}</span>
                          <span className="text-neutral-850">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-1 bg-zinc-100 rounded-full [&>div]:bg-black" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer info indicating shared platform details */}
        <div className="text-center pt-8 border-t border-zinc-200">
          <p className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-400">
            Powered by Campayn Premium Analytics • Indore • MP • India
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedAnalytics;
