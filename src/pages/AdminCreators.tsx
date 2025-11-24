import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  Users, 
  Instagram, 
  ExternalLink, 
  Send,
  ArrowLeft,
  Target,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/ui/loading-spinner';
import { getApiUrl } from '@/lib/api';

interface Creator {
  id: string;
  name: string;
  subcategory: string;
  ig_handle: string;
  followers_count?: number;
  engagement_rate?: number;
  category?: string;
  account_status?: string;
}

interface Campaign {
  id: string;
  campaign_name: string;
  brand_name: string;
  phase: string;
  budget: number;
}

const AdminCreators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [targetCreatorsCount, setTargetCreatorsCount] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  // Fetch creators from backend API
  const fetchCreators = async (page: number = 1, search: string = '', category: string = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: search,
        category: category
      });

      const response = await fetch(`/api/creators?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Backend API not available. Please start the backend server.');
        }
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch creators`);
      }

      const data = await response.json();
      
      setCreators(data.creators || []);
      setTotalCount(data.totalCount || 0);
      
    } catch (error: any) {
      console.error('Error fetching creators:', error);
      setError(error.message || 'Failed to load creators');
      setCreators([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaigns in creator_selection phase
  const fetchCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await fetch(getApiUrl('api/campaigns?phase=creator_selection'));
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setCampaignsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators(currentPage, searchTerm, selectedCategory);
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle category filter
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle creator selection
  const handleCreatorToggle = (creatorId: string) => {
    const newSelected = new Set(selectedCreators);
    if (newSelected.has(creatorId)) {
      newSelected.delete(creatorId);
    } else {
      newSelected.add(creatorId);
    }
    setSelectedCreators(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCreators.size === creators.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(creators.map(c => c.id)));
    }
  };

  // Submit creator recommendations
  const handleSubmitRecommendations = async () => {
    if (!selectedCampaign || selectedCreators.size === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a campaign and at least one creator",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const selectedCreatorIds = Array.from(selectedCreators);

      // First update the campaign's target creators count
      const updateResponse = await fetch(getApiUrl(`api/campaigns/${selectedCampaign}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_creators_count: targetCreatorsCount,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update campaign target');
      }

      // Then recommend creators
      const response = await fetch(`http://localhost:4000/api/campaigns/${selectedCampaign}/recommend-creators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creator_ids: selectedCreatorIds,
          admin_notes: adminNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Recommendations Sent",
          description: `Successfully recommended ${selectedCreatorIds.length} creators to the brand`,
        });
        
        // Reset selections
        setSelectedCreators(new Set());
        setSelectedCampaign('');
        setAdminNotes('');
        setTargetCreatorsCount(3);
        
        // Refresh campaigns to update the selected campaign's status
        fetchCampaigns();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send recommendations",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to send recommendations",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Creators</h1>
                <p className="text-gray-600 mt-1">Assign creators to campaigns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Assignment Panel */}
        {selectedCreators.size > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Assign {selectedCreators.size} Creator(s) to Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Target Creators Required
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="How many creators does this campaign need?"
                    value={targetCreatorsCount}
                    onChange={(e) => setTargetCreatorsCount(parseInt(e.target.value) || 1)}
                    className="w-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total number of creators needed for this campaign
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Campaign
                  </label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a campaign in creator selection phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignsLoading ? (
                        <SelectItem value="" disabled>Loading campaigns...</SelectItem>
                      ) : campaigns.length === 0 ? (
                        <SelectItem value="" disabled>No campaigns in creator selection phase</SelectItem>
                      ) : (
                        campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.campaign_name} - {campaign.brand_name} (₹{formatNumber(campaign.budget)})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add notes about why you're recommending these creators..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitRecommendations}
                    disabled={submitting || !selectedCampaign}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? 'Sending...' : 'Send Recommendations to Brand'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCreators(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search creators by name or handle..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="md:w-auto"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {selectedCreators.size === creators.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {error ? 'Error loading creators' : `Showing ${creators.length} of ${totalCount} creators`}
            </p>
            {selectedCreators.size > 0 && (
              <p className="text-blue-600 font-medium">
                {selectedCreators.size} creator(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchCreators(currentPage, searchTerm, selectedCategory)}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Creators Grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {creators.map((creator) => (
              <Card 
                key={creator.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedCreators.has(creator.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleCreatorToggle(creator.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold">
                          {creator.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{creator.name}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <Instagram className="h-4 w-4 mr-1" />
                          <span className="truncate">@{creator.ig_handle}</span>
                        </div>
                      </div>
                    </div>
                    <Checkbox 
                      checked={selectedCreators.has(creator.id)}
                      onChange={() => handleCreatorToggle(creator.id)}
                      className="ml-2"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {creator.subcategory && (
                      <Badge variant="secondary" className="text-xs">
                        {creator.subcategory}
                      </Badge>
                    )}
                    
                    {creator.followers_count && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Followers:</span>
                        <span className="font-medium">{formatNumber(creator.followers_count)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Engagement:</span>
                      <span className="font-medium">{formatPercentage(creator.engagement_rate)}</span>
                    </div>

                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/creator-profile/${creator.ig_handle}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCreators;