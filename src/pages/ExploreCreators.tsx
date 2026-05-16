
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import SearchFilterBar from "@/components/explore-creators/SearchFilterBar";
import CreatorCard from "@/components/explore-creators/CreatorCard";
import { Compass, Users, Sparkles, TrendingUp, Loader2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExploreCreators = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score-desc");
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    minScore: "0",
    followerRange: ""
  });

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
      const params = new URLSearchParams({
        search: searchTerm,
        category: filters.category,
        city: filters.city,
        minScore: filters.minScore,
        sortBy: sortBy,
        limit: '20'
      });

      const res = await fetch(`${backendUrl}/api/creator/explore?${params}`);
      const result = await res.json();

      if (result.success) {
        setCreators(result.creators);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreators();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      city: "",
      minScore: "0",
      followerRange: ""
    });
    setSearchTerm("");
  };

  const handleViewProfile = (creator: any) => {
    // Navigate to the public media kit on the dashboard domain
    // Or if they are on the same domain, use relative path
    const dashboardUrl = "https://campayn-creators.vercel.app";
    window.open(`${dashboardUrl}/media-kit/${creator.igHandle}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 space-y-12 selection:bg-campayn-primary/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-campayn-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 w-fit">
            <Globe className="text-campayn-primary" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Public Discovery Portal</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-campayn-primary to-violet-500">Creators</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Discover verified creators in Indore, Bhopal, and across India using our proprietary <span className="text-white">Campayn Score™</span> intelligence.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-lg font-black text-xs uppercase tracking-widest">
            {total} Active Profiles
          </Badge>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated in real-time</p>
        </div>
      </div>

      {/* Quick Insights Bar */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Network Reach</span>
          </div>
          <div className="text-2xl font-black">1.2M+</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Avg Score</span>
          </div>
          <div className="text-2xl font-black">74.2</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Avg Engagement</span>
          </div>
          <div className="text-2xl font-black">6.4%</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3 text-violet-400 mb-2">
            <Compass size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Cities</span>
          </div>
          <div className="text-2xl font-black">12+</div>
        </div>
      </div>

      {/* Search & Filter Component */}
      <div className="relative z-20">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-12 w-12 animate-spin text-campayn-primary" />
            <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">Syncing Network Data...</p>
          </div>
        ) : creators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {creators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Compass className="text-slate-700" size={48} />
            </div>
            <h3 className="text-2xl font-black mb-2">No creators found</h3>
            <p className="text-slate-500 mb-8 max-w-sm">
              We couldn't find any creators matching your current filters. Try broadening your search or resetting filters.
            </p>
            <button 
              onClick={handleClearFilters}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all"
            >
              Reset Discovery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCreators;
