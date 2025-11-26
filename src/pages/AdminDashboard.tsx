import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  MessageCircle,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Building
} from 'lucide-react';
import LoadingSpinner from '../components/ui/loading-spinner';

interface Campaign {
  id: string;
  campaign_name: string;
  budget: number;
  status: string;
  created_at: string;
  platform: string;
  brands: {
    brand_name: string;
    brand_website?: string;
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check admin access first
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsCheckingAuth(true);
        
        if (!user) {
          navigate('/auth');
          return;
        }

        // Check if user is admin
        const isAdminUser = user.email === 'admin@campayn.local' || 
                           user.user_metadata?.is_admin === true ||
                           user.app_metadata?.is_admin === true;

        if (!isAdminUser) {
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
        
      } catch (error) {
        navigate('/auth');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        // Fetch all campaigns with brand information
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select(`
            *,
            brands!inner (
              brand_name,
              brand_website
            )
          `)
          .order('created_at', { ascending: false });

        if (campaignsError) {
          console.error('Campaigns fetch error:', campaignsError);
          setError('Failed to load campaigns');
          return;
        }

        setCampaigns(campaignsData || []);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'Draft', variant: 'secondary' as const },
      'quoting': { label: 'Quoting', variant: 'default' as const },
      'approved': { label: 'Approved', variant: 'default' as const },
      'live': { label: 'Live', variant: 'default' as const },
      'completed': { label: 'Completed', variant: 'default' as const },
      'rejected': { label: 'Rejected', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['draft'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatBudget = (budget: number) => {
    if (budget >= 100000) {
      return `₹${(budget / 100000).toFixed(1)}L`;
    }
    return `₹${budget.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStats = () => {
    const totalCampaigns = campaigns.length;
    const quotingCampaigns = campaigns.filter(c => c.status === 'quoting').length;
    const liveCampaigns = campaigns.filter(c => c.status === 'live').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

    return {
      totalCampaigns,
      quotingCampaigns,
      liveCampaigns,
      completedCampaigns,
      totalBudget
    };
  };

  const stats = getStats();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4 text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  // Don't render if not admin (should have redirected by now)
  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage all brand campaigns and quotations</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/admin/campaigns')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Building className="h-4 w-4 mr-2" />
                Multi-Phase Campaigns
              </Button>
              <Button 
                onClick={() => navigate('/admin/creators')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Users className="h-4 w-4 mr-2" />
                All Creators
              </Button>
              <Button 
                onClick={() => navigate('/admin/payments')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Payment Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Quoting</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.quotingCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.liveCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatBudget(stats.totalBudget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              All Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No campaigns found
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {campaign.campaign_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {campaign.brands.brand_name}
                          </div>
                          {campaign.brands.brand_website && (
                            <div className="text-sm text-gray-500">
                              {campaign.brands.brand_website}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {campaign.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="font-medium">
                        {formatBudget(campaign.budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(campaign.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/admin/campaigns')}
                            className="flex items-center"
                          >
                            <Building className="h-3 w-3 mr-1" />
                            Manage Campaign
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
