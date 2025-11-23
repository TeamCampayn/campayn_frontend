import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl, SOCKET_URL } from '@/lib/api';
import { 
  Link, 
  Users, 
  Calendar, 
  CheckCircle, 
  ExternalLink, 
  Plus,
  RefreshCw,
  Play,
  Image,
  Video
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  ig_handle: string;
  profile_picture_url?: string;
}

interface ContentItem {
  id: string;
  campaign_id: string;
  creator_id: string;
  content_type: 'reel' | 'post' | 'story' | 'igtv' | 'carousel';
  content_url?: string | null;
  thumbnail_url?: string | null;
  caption?: string | null;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  post_url?: string | null;
  posted_at?: string | null;
  created_at: string;
  creators: Creator;
}

interface CampaignDetailsResponse {
  success: boolean;
  campaign: {
    id: string;
    campaign_name: string;
    phase: string;
  };
  contents: ContentItem[];
}

const AdminLinkManager: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [postUrls, setPostUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const fetchCampaignContents = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('api/campaigns/${campaignId}'));
      const data: CampaignDetailsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to load campaign contents');
      }
      
      setCampaignName(data.campaign.campaign_name);
      setContents(data.contents || []);
      
      // Initialize post URLs from existing data
      const initialUrls: Record<string, string> = {};
      data.contents?.forEach(content => {
        if (content.post_url) {
          initialUrls[content.id] = content.post_url;
        }
      });
      setPostUrls(initialUrls);
      
    } catch (error: any) {
      console.error('Error fetching campaign contents:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign contents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignContents();
  }, [campaignId]);

  const updatePostUrl = (contentId: string, url: string) => {
    setPostUrls(prev => ({
      ...prev,
      [contentId]: url
    }));
  };

  const savePostUrl = async (contentId: string) => {
    const url = postUrls[contentId];
    if (!url?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid post URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(prev => ({ ...prev, [contentId]: true }));
      
      const response = await fetch(`http://localhost:4000/api/campaigns/${campaignId}/contents/${contentId}/post`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_url: url })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save post URL');
      }
      
      toast({
        title: "Success",
        description: "Post URL saved successfully",
        variant: "default",
      });
      
      // Refresh the data to get updated posted_at time
      fetchCampaignContents();
      
    } catch (error: any) {
      console.error('Error saving post URL:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save post URL",
        variant: "destructive",
      });
    } finally {
      setSaving(prev => ({ ...prev, [contentId]: false }));
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'reel':
      case 'igtv':
        return <Video className="h-4 w-4" />;
      case 'story':
        return <Play className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Filter approved content that needs post links
  const approvedContents = contents.filter(content => content.approval_status === 'approved');
  const contentsWithLinks = approvedContents.filter(content => content.post_url);
  const contentsNeedingLinks = approvedContents.filter(content => !content.post_url);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Loading campaign contents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Post Link Manager</h1>
          <p className="text-gray-600">Campaign: {campaignName}</p>
        </div>
        <Button onClick={fetchCampaignContents} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{approvedContents.length}</div>
                <div className="text-sm text-gray-600">Approved Content</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Link className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{contentsWithLinks.length}</div>
                <div className="text-sm text-gray-600">Links Added</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{contentsNeedingLinks.length}</div>
                <div className="text-sm text-gray-600">Need Links</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contents Needing Links */}
      {contentsNeedingLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-500" />
              Content Needing Post Links ({contentsNeedingLinks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentsNeedingLinks.map((content) => (
              <div key={content.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{content.creators.name}</div>
                      <div className="text-sm text-gray-600">@{content.creators.ig_handle}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getContentIcon(content.content_type)}
                        <span className="text-sm text-gray-500 capitalize">{content.content_type}</span>
                        <Badge variant="outline" className="text-xs">
                          {content.approval_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Approved: {formatDateTime(content.created_at)}
                  </div>
                </div>
                
                {content.caption && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Caption: </span>
                    {content.caption}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://instagram.com/p/..."
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    value={postUrls[content.id] || ''}
                    onChange={(e) => updatePostUrl(content.id, e.target.value)}
                  />
                  <Button
                    onClick={() => savePostUrl(content.id)}
                    disabled={saving[content.id] || !postUrls[content.id]?.trim()}
                  >
                    {saving[content.id] ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Add Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contents With Links */}
      {contentsWithLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Content With Post Links ({contentsWithLinks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentsWithLinks.map((content) => (
              <div key={content.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{content.creators.name}</div>
                      <div className="text-sm text-gray-600">@{content.creators.ig_handle}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getContentIcon(content.content_type)}
                        <span className="text-sm text-gray-500 capitalize">{content.content_type}</span>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Live
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {content.posted_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Posted: {formatDateTime(content.posted_at)}
                      </div>
                    )}
                  </div>
                </div>
                
                {content.caption && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Caption: </span>
                    {content.caption}
                  </div>
                )}
                
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Live Post:</span>
                    <a
                      href={content.post_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-800 underline"
                    >
                      {content.post_url}
                    </a>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={content.post_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No approved content message */}
      {approvedContents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Approved Content Yet</h3>
            <p className="text-gray-600">
              Content must be approved by the brand before you can add post links.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLinkManager;