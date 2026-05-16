
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, MapPin, Sparkles, TrendingUp, Users, ArrowUpRight } from "lucide-react";

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    igHandle: string;
    profilePictureUrl: string;
    followers: number;
    engagementRate: number;
    campaynScore: number;
    category: string;
    location: string;
    verified: boolean;
  };
  onViewProfile: (creator: any) => void;
}

const CreatorCard = ({ creator, onViewProfile }: CreatorCardProps) => {
  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const getScoreColor = (s: number) => {
    if (s >= 91) return "text-violet-400 border-violet-500/20 bg-violet-500/5";
    if (s >= 71) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (s >= 41) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-slate-400 border-white/5 bg-white/5";
  };

  return (
    <Card 
      onClick={() => onViewProfile(creator)}
      className="group relative overflow-hidden bg-[#0a0a0a] border-white/5 hover:border-campayn-primary/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-campayn-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-campayn-primary to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              {creator.profilePictureUrl ? (
                <img 
                  src={creator.profilePictureUrl} 
                  alt={creator.name} 
                  className="relative w-16 h-16 rounded-2xl object-cover border border-white/10"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Instagram className="text-white/20" size={32} />
                </div>
              )}
              {creator.verified && (
                <div className="absolute -top-2 -right-2 bg-campayn-primary p-1 rounded-full shadow-lg">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
            </div>
            
            <div className={`px-3 py-1.5 rounded-xl border font-black text-xs uppercase tracking-widest ${getScoreColor(creator.campaynScore)}`}>
              {creator.campaynScore} pts
            </div>
          </div>

          {/* Name & Handle */}
          <div>
            <h3 className="text-lg font-black text-white truncate group-hover:text-campayn-primary transition-colors">{creator.name}</h3>
            <p className="text-sm text-slate-500 font-medium">@{creator.igHandle}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Followers</span>
              </div>
              <div className="text-sm font-black text-white">{formatNumber(creator.followers)}</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Engagement</span>
              </div>
              <div className="text-sm font-black text-white">{creator.engagementRate.toFixed(1)}%</div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{creator.location || 'India'}</span>
            </div>
            <div className="flex items-center gap-1 text-campayn-primary">
              <span className="text-[10px] font-black uppercase tracking-widest">View Kit</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
