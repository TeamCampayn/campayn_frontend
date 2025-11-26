import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getApiUrl } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Filter,
  Send,
  ArrowLeft,
  Clock,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react';

// Simple number formatters
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    return `${(absValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${(absValue / 1_000).toFixed(1)}K`;
  } else {
    return absValue.toLocaleString();
  }
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(1)}%`;
};

interface Creator {
  id: string;
  name: string;
  ig_handle: string;
  category: string;
  subcategory?: string;
  followers_count: number;
  engagement_rate: number | null;
  avg_likes?: number;
  avg_comments?: number;
  profile_picture_url?: string;
  location?: string;
  priority_score?: number;
  account_status?: string;
}

interface Campaign {
  id: string;
  campaign_name: string;
  brand_name: string;
  budget: number;
  description: string;
  campaign_objectives?: string[];
  requirements?: string;
  deliverables?: string[];
}

const AdminCreatorSelection: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxFollowers, setMaxFollowers] = useState(10000000);
  const [minEngagement, setMinEngagement] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatingRecs, setGeneratingRecs] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
      fetchCreators();
    }
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(getApiUrl(`api/campaigns/${campaignId}`));
      const data = await response.json();
      
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        category: categoryFilter !== 'all' ? categoryFilter : '',
        min_followers: minFollowers.toString(),
        max_followers: maxFollowers.toString(),
        min_engagement: minEngagement.toString(),
        search: searchQuery
      });

      const url = getApiUrl(`api/creators?${params}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${text.substring(0, 200)}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }
      
      const data = await response.json();

      if (data.creators) {
        // Sort by priority score and engagement rate
        const sortedCreators = data.creators.sort((a: Creator, b: Creator) => {
          const scoreA = (a.priority_score || 0) + (a.engagement_rate || 0);
          const scoreB = (b.priority_score || 0) + (b.engagement_rate || 0);
          return scoreB - scoreA;
        });
        
        setCreators(sortedCreators);
      }
    } catch (error) {
      toast({
        title: 'Error loading creators',
        description: error instanceof Error ? error.message : 'Failed to fetch creators',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAutoRecommendations = async () => {
    if (!campaignId) return;
    
    setGeneratingRecs(true);
    try {
      const response = await fetch(
        getApiUrl(`/api/campaigns/${campaignId}/generate-recommendations`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ autoApprove: false })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Recommendations Generated',
          description: `${data.count} creators automatically matched based on campaign criteria!`,
        });
        // Refresh creators list to show recommendations
        fetchCreators();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate recommendations',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations',
        variant: 'destructive'
      });
    } finally {
      setGeneratingRecs(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCreators();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, categoryFilter, minFollowers, maxFollowers, minEngagement]);

  const handleCreatorToggle = (creatorId: string) => {
    const newSelected = new Set(selectedCreators);
    if (newSelected.has(creatorId)) {
      newSelected.delete(creatorId);
    } else {
      newSelected.add(creatorId);
    }
    setSelectedCreators(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCreators.size === creators.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(creators.map(c => c.id)));
    }
  };

  const handleRecommendCreators = async () => {
    if (selectedCreators.size === 0) {
      alert('Please select at least one creator');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch(getApiUrl(`api/campaigns/${campaignId}/recommend-creators`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creator_ids: Array.from(selectedCreators),
          admin_id: 'admin@campayn.local',
          admin_notes: adminNotes
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Creators recommended successfully! The brand will be notified.');
        window.location.href = `/admin/campaigns`;
      } else {
        throw new Error(data.error || 'Failed to recommend creators');
      }
    } catch (error) {
      console.error('Error recommending creators:', error);
      alert('Failed to recommend creators. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'all', 'Fashion', 'Beauty', 'Health & Wellness', 'Food & Beverage', 
    'Travel', 'Tech & Gadgets', 'Personal Finance', 'Home Decor', 
    'Parenting', 'Education', 'Pet Care', 'Gaming', 'Automobiles'
  ];

  if (loading && !campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/admin/campaigns'}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Creator Selection</h1>
          {campaign && (
            <p className="text-gray-600 mt-1">
              Select creators for "{campaign.campaign_name}" • Budget: ₹{formatNumber(campaign.budget)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{selectedCreators.size} selected</span>
        </div>
      </div>

      {/* Auto-Generate Recommendations Button */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Creator Matching</h3>
                  <p className="text-sm text-gray-600">
                    Automatically find the best creators based on campaign category and tier
                  </p>
                </div>
              </div>
              <Button 
                onClick={generateAutoRecommendations}
                disabled={!campaignId || generatingRecs}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generatingRecs ? 'Generating...' : 'Auto-Generate Recommendations'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Info Card */}
      {campaign && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Objectives</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {campaign.campaign_objectives?.join(', ') || 'Brand awareness, engagement'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Requirements</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {campaign.requirements || 'Standard campaign requirements'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Deliverables</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {campaign.deliverables?.join(', ') || 'Content creation and posting'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Followers Range */}
            <div>
              <label className="text-sm font-medium text-gray-700">Followers Range</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minFollowers || ''}
                  onChange={(e) => setMinFollowers(parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxFollowers || ''}
                  onChange={(e) => setMaxFollowers(parseInt(e.target.value) || 10000000)}
                />
              </div>
            </div>

            {/* Min Engagement */}
            <div>
              <label className="text-sm font-medium text-gray-700">Min Engagement Rate (%)</label>
              <Input
                type="number"
                placeholder="0"
                value={minEngagement || ''}
                onChange={(e) => setMinEngagement(parseFloat(e.target.value) || 0)}
                className="mt-1"
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            {/* Select All Toggle */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSelectAll}
                className="w-full"
                size="sm"
              >
                {selectedCreators.size === creators.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Creators Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : creators.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No creators found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {creators.length} creators • {selectedCreators.size} selected
                </p>
                
                {selectedCreators.size > 0 && (
                  <Button
                    onClick={() => document.getElementById('recommend-section')?.scrollIntoView()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Review Selection ({selectedCreators.size})
                  </Button>
                )}
              </div>

              {/* Creators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creators.map((creator) => (
                  <Card 
                    key={creator.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedCreators.has(creator.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => handleCreatorToggle(creator.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {creator.profile_picture_url ? (
                            <img
                              src={creator.profile_picture_url}
                              alt={creator.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div>
                            <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                            <p className="text-sm text-gray-600">@{creator.ig_handle}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {creator.category}
                            </Badge>
                          </div>
                        </div>

                        <Checkbox
                          checked={selectedCreators.has(creator.id)}
                          onChange={() => handleCreatorToggle(creator.id)}
                          className="mt-1"
                        />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="font-medium">{formatNumber(creator.followers_count)}</div>
                          <div className="text-gray-500">Followers</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="font-medium">
                            {formatPercentage(creator.engagement_rate)}
                          </div>
                          <div className="text-gray-500">Engagement</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Heart className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="font-medium">
                            {creator.avg_likes ? formatNumber(creator.avg_likes) : 'N/A'}
                          </div>
                          <div className="text-gray-500">Avg Likes</div>
                        </div>
                      </div>

                      {/* Priority Score */}
                      {creator.priority_score && creator.priority_score > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Priority Score</span>
                            <Badge 
                              variant={(creator.priority_score || 0) >= 7 ? 'default' : 'secondary'}
                              className={(creator.priority_score || 0) >= 7 ? 'bg-green-600' : ''}
                            >
                              {(creator.priority_score || 0).toFixed(1)}/10
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Section */}
          {selectedCreators.size > 0 && (
            <Card id="recommend-section" className="mt-8 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Send className="h-5 w-5" />
                  Recommend Selected Creators to Brand
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes or recommendations for the brand..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedCreators.size} creator{selectedCreators.size !== 1 ? 's' : ''} selected
                  </div>
                  
                  <Button
                    onClick={handleRecommendCreators}
                    disabled={submitting || selectedCreators.size === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Recommending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Recommend to Brand
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreatorSelection;