import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  Search, 
  Eye, 
  Heart, 
  MessageSquare, 
  ExternalLink, 
  TrendingUp, 
  Instagram,
  ArrowUpDown,
  Filter,
  Sparkles,
  Users,
  Play,
  RotateCw,
  X
} from 'lucide-react';

interface CreatorInfo {
  id: string;
  name: string;
  ig_handle: string;
  avatar_url: string;
  followers: number;
}

interface AssetMetrics {
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
}

interface VaultAsset {
  id: string;
  campaign_id: string;
  campaign_name: string;
  creator: CreatorInfo;
  content_type: string;
  post_url: string;
  thumbnail_url: string;
  posted_at: string;
  metrics: AssetMetrics;
  source: 'new' | 'legacy';
}

const AssetVault: React.FC = () => {
  const { brand } = useAuth();
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<VaultAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'new' | 'legacy'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'views' | 'engagement'>('date_desc');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  useEffect(() => {
    if (brand?.id) {
      fetchVaultAssets();
    }
  }, [brand?.id]);

  const handleRefreshAsset = async (assetId: string, source: 'new' | 'legacy') => {
    try {
      const response = await fetch(getApiUrl(`api/vault/assets/${assetId}/refresh`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source })
      });
      const data = await response.json();
      if (data.success && data.metrics) {
        setAssets(prev => prev.map(asset => {
          if (asset.id === assetId) {
            return {
              ...asset,
              metrics: data.metrics
            };
          }
          return asset;
        }));
        return { success: true, metrics: data.metrics };
      } else {
        throw new Error(data.error || 'Failed to refresh asset metrics');
      }
    } catch (err: any) {
      console.error('Error refreshing asset metrics:', err);
      throw err;
    }
  };

  useEffect(() => {
    applyFiltersAndSorting();
  }, [assets, searchTerm, sourceFilter, sortBy, selectedCampaign]);

  const fetchVaultAssets = async () => {
    if (!brand?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl(`api/dashboard/vault/${brand.id}`));
      if (!response.ok) {
        throw new Error('Failed to fetch vault assets');
      }
      const data = await response.json();
      if (data.success) {
        setAssets(data.assets || []);
      } else {
        throw new Error(data.error || 'Failed to fetch vault assets');
      }
    } catch (err: any) {
      console.error('Error fetching vault assets:', err);
      setError(err.message || 'An error occurred while loading creative assets.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = () => {
    let result = [...assets];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(asset => 
        asset.creator.name.toLowerCase().includes(term) ||
        asset.creator.ig_handle.toLowerCase().includes(term) ||
        asset.campaign_name.toLowerCase().includes(term)
      );
    }

    // Source filter
    if (sourceFilter !== 'all') {
      result = result.filter(asset => asset.source === sourceFilter);
    }

    // Campaign filter
    if (selectedCampaign !== 'all') {
      result = result.filter(asset => asset.campaign_name === selectedCampaign);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime();
      }
      if (sortBy === 'views') {
        return (b.metrics.views || 0) - (a.metrics.views || 0);
      }
      if (sortBy === 'engagement') {
        return (b.metrics.engagement_rate || 0) - (a.metrics.engagement_rate || 0);
      }
      return 0;
    });

    setFilteredAssets(result);
  };

  // Get unique campaign names for filter
  const campaignNames = Array.from(new Set(assets.map(a => a.campaign_name)));

  // Calculate metrics stats
  const totalViews = filteredAssets.reduce((sum, item) => sum + (item.metrics.views || 0), 0);
  const totalLikes = filteredAssets.reduce((sum, item) => sum + (item.metrics.likes || 0), 0);
  const totalComments = filteredAssets.reduce((sum, item) => sum + (item.metrics.comments || 0), 0);
  const avgEngagementRate = filteredAssets.length > 0 
    ? (filteredAssets.reduce((sum, item) => sum + (item.metrics.engagement_rate || 0), 0) / filteredAssets.length).toFixed(2)
    : '0.00';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-black mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-semibold font-mono">Creative Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space text-neutral-900 uppercase">
            Asset Vault
          </h1>
          <p className="text-zinc-500 text-xs font-space uppercase tracking-wider mt-1.5">
            Aggregated reels, creator credits, and real-time performance heatmaps.
          </p>
        </div>
        <button 
          onClick={fetchVaultAssets} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-full transition-all text-xs font-space uppercase font-bold tracking-wider text-zinc-700 shadow-none"
        >
          <RotateCw className={`w-4 h-4 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aggregate Assets', value: formatNumber(filteredAssets.length), icon: Film, sub: 'Filtered submitted reels' },
          { label: 'Combined Reel Views', value: formatNumber(totalViews), icon: Eye, sub: 'Total performance impact' },
          { label: 'Combined Interactions', value: formatNumber(totalLikes + totalComments), icon: Heart, sub: 'Likes and comments count' },
          { label: 'Avg Engagement Rate', value: `${avgEngagementRate}%`, icon: TrendingUp, sub: 'Audience resonance score' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="p-5 bg-white border border-zinc-200/80 shadow-none rounded-2xl relative overflow-hidden group hover:border-black/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-full blur-2xl group-hover:bg-black/10 transition-all duration-300" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold font-space text-zinc-400 uppercase tracking-wider">{stat.label}</span>
              <div className="p-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-black">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-space text-neutral-900 mb-1">{stat.value}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider font-space text-zinc-400 truncate">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters & Control bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8 p-4 bg-white border border-zinc-200/80 shadow-none rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by creator name, @handle, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200/80 rounded-xl focus:border-zinc-400 focus:outline-none text-xs text-zinc-800 placeholder-zinc-400 transition-colors font-space shadow-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Source Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/80 rounded-xl p-1">
            {(['all', 'new', 'legacy'] as const).map((source) => (
              <button
                key={source}
                onClick={() => setSourceFilter(source)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-space uppercase tracking-wider transition-all ${
                  sourceFilter === source 
                    ? 'bg-black text-white font-bold' 
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {source === 'all' ? 'All Sources' : `${source} Flow`}
              </button>
            ))}
          </div>

          {/* Campaign Filter */}
          {campaignNames.length > 0 && (
            <div className="relative">
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200/80 rounded-xl text-[10px] font-space uppercase font-bold tracking-wider text-zinc-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer h-9 shadow-none"
              >
                <option value="all">All Campaigns</option>
                {campaignNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          )}

          {/* Sort selection */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200/80 rounded-xl text-[10px] font-space uppercase font-bold tracking-wider text-zinc-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer h-9 shadow-none"
            >
              <option value="date_desc">Newest Submission</option>
              <option value="date_asc">Oldest Submission</option>
              <option value="views">Highest Views</option>
              <option value="engagement">Highest Engagement</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white border border-zinc-200/80 rounded-2xl shadow-none">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-zinc-250 border-t-[#000000] rounded-full animate-spin" />
            <Film className="w-5 h-5 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-xs font-space uppercase tracking-wider text-zinc-500">AGGREGATING CREATIVES...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto text-center my-12 shadow-none">
          <p className="text-red-600 font-space uppercase tracking-wider text-xs font-bold">{error}</p>
          <button 
            onClick={fetchVaultAssets} 
            className="mt-4 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-space uppercase font-bold tracking-wider rounded-full border border-red-200 transition-colors shadow-none"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredAssets.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-300 bg-white rounded-2xl shadow-none">
          <Film className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold font-space uppercase tracking-wider text-neutral-900">No Creative Assets Found</h3>
          <p className="text-xs text-zinc-500 font-space max-w-sm mx-auto mt-1 uppercase tracking-wider">
            Once creators submit live Instagram Reel links to your campaigns, their content and insights will populate here automatically.
          </p>
        </div>
      )}

      {/* Assets Grid */}
      {!loading && !error && filteredAssets.length > 0 && (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {filteredAssets.map((asset, index) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                index={index} 
                onRefreshAsset={handleRefreshAsset}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

interface AssetCardProps {
  asset: VaultAsset;
  index: number;
  onRefreshAsset: (assetId: string, source: 'new' | 'legacy') => Promise<{ success: boolean; metrics: AssetMetrics }>;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, index, onRefreshAsset }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const getHeatmapStrength = () => {
    const er = asset.metrics.engagement_rate;
    if (er > 10) return { primary: 'rgba(24, 24, 27, 0.45)', secondary: 'rgba(63, 63, 70, 0.3)' };
    if (er > 5) return { primary: 'rgba(24, 24, 27, 0.35)', secondary: 'rgba(82, 82, 91, 0.2)' };
    return { primary: 'rgba(24, 24, 27, 0.25)', secondary: 'rgba(113, 113, 122, 0.15)' };
  };

  const colors = getHeatmapStrength();

  // Build correct Instagram embed URL preserving content type (reel/p/tv)
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    const match = url.match(/instagram\.com\/(reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1] && match[2]) {
      return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
    }
    return '';
  };

  const embedUrl = getEmbedUrl(asset.post_url);

  const handleCardClick = () => {
    if (asset.post_url) {
      window.open(asset.post_url, '_blank');
    }
  };

  const handleSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);
    try {
      await onRefreshAsset(asset.id, asset.source);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2000);
    } catch (err: any) {
      setSyncError(err.message || 'Failed to sync');
      setTimeout(() => setSyncError(null), 2000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="relative group cursor-pointer overflow-hidden aspect-[4/5] bg-white border border-zinc-200/80 hover:border-zinc-350 rounded-2xl flex flex-col justify-between shadow-none"
    >
      {/* Thumbnail, Cropped Instagram Embed, or Fallback */}
      <div className="absolute inset-0 z-0">
        {asset.thumbnail_url ? (
          <img 
            src={asset.thumbnail_url} 
            alt={asset.campaign_name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
          />
        ) : embedUrl ? (
          <div className="w-full h-full relative bg-zinc-50 overflow-hidden">
            {/* Scale-cropped iframe: zooms 2x into the video area, overflow:hidden clips all branding */}
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              style={{
                transform: 'scale(2)',
                transformOrigin: 'center 40%',
                pointerEvents: 'none',
              }}
              allowFullScreen
              allow="autoplay; encrypted-media"
              scrolling="no"
              frameBorder="0"
              title={`Instagram embed - ${asset.campaign_name}`}
            />
            {/* Dark poster overlay — fades out on hover to "reveal" video */}
            <AnimatePresence>
              {!isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-[5] flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg shadow-black/10">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full bg-zinc-50/50 relative flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 opacity-[0.03]" 
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} 
            />
            <div className="w-36 h-36 bg-black/5 rounded-full blur-2xl group-hover:bg-black/10 transition-all duration-300" />
            <Play className="w-8 h-8 text-zinc-300 group-hover:text-black group-hover:scale-110 transition-all duration-300" />
          </div>
        )}
      </div>

      {/* Campaign name tag */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 text-[9px] font-space tracking-wider text-zinc-600 uppercase font-bold">
          {asset.campaign_name}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <span className="px-2 py-0.5 rounded-full bg-zinc-50 border border-black/30 text-[9px] font-space text-black font-bold uppercase tracking-wider">
          {asset.source === 'new' ? 'Multi-Phase' : 'Legacy'}
        </span>
      </div>

      {/* Engagement heatmap overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20"
          >
            {/* Simulated Heatmap circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute w-36 h-36 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                  top: '15%',
                  left: '20%'
                }}
              />
              <div 
                className="absolute w-28 h-28 rounded-full blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
                  bottom: '25%',
                  right: '15%'
                }}
              />
            </div>

            {/* Dark glassmorphic filter overlay */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-[8px] border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/50" />

            {/* Hover details & interactive stats */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-space text-zinc-400 font-bold uppercase tracking-wider">
                  Reel Submission
                </span>
                
                <div className="flex items-center gap-2">
                  {syncSuccess && (
                    <span className="text-[8px] font-space uppercase tracking-wider text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">Synced</span>
                  )}
                  {syncError && (
                    <span className="text-[8px] font-space uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">Error</span>
                  )}
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="p-1 hover:bg-zinc-100 rounded transition-colors text-black hover:text-zinc-900 disabled:opacity-50"
                    title="Sync Live Metrics"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(asset.post_url, '_blank');
                    }}
                    className="p-1 hover:bg-zinc-100 rounded transition-colors text-zinc-650 hover:text-zinc-900"
                    title="Open on Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-black font-bold font-space tracking-wider uppercase">
                  Instagram Insights
                </span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                    <div className="flex items-center gap-1 text-zinc-400 mb-0.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-space font-bold uppercase tracking-wider">Views</span>
                    </div>
                    <div className="text-xs font-bold font-space text-neutral-900">
                      {asset.metrics.views ? asset.metrics.views.toLocaleString() : '0'}
                    </div>
                  </div>

                  <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                    <div className="flex items-center gap-1 text-zinc-400 mb-0.5">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-space font-bold uppercase tracking-wider">Likes</span>
                    </div>
                    <div className="text-xs font-bold font-space text-neutral-900">
                      {asset.metrics.likes ? asset.metrics.likes.toLocaleString() : '0'}
                    </div>
                  </div>

                  <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                    <div className="flex items-center gap-1 text-zinc-400 mb-0.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-space font-bold uppercase tracking-wider">Comments</span>
                    </div>
                    <div className="text-xs font-bold font-space text-neutral-900">
                      {asset.metrics.comments ? asset.metrics.comments.toLocaleString() : '0'}
                    </div>
                  </div>

                  <div className="bg-black/10 border border-black/20 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-black mb-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-space font-bold uppercase tracking-wider">Eng. Rate</span>
                    </div>
                    <div className="text-xs font-bold font-space text-black">
                      {asset.metrics.engagement_rate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creator footer (persistent when not hovered, matches card layout) */}
      <div className="w-full z-10 mt-auto bg-gradient-to-t from-white/95 via-white/80 to-transparent p-4 flex items-center justify-between pointer-events-none border-t border-zinc-100">
        <div className="flex items-center gap-2">
          {asset.creator.avatar_url ? (
            <img 
              src={asset.creator.avatar_url} 
              alt={asset.creator.name} 
              className="w-8 h-8 rounded-full object-cover border border-zinc-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          )}
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-neutral-900 truncate max-w-[120px] font-space">{asset.creator.name}</div>
            <div className="text-[9px] text-black truncate max-w-[120px] font-space uppercase font-bold tracking-wider">{asset.creator.ig_handle}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200">
          <Instagram className="w-3 h-3 text-black" />
          <span className="text-[9px] font-space text-zinc-600 font-bold uppercase tracking-wider">Reel</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetVault;
