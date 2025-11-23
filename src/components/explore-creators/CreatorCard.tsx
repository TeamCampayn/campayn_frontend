
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Instagram, Youtube, Eye } from "lucide-react";

interface CreatorCardProps {
  creator: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
    followers: string;
    engagementRate: string;
    rating: number;
    niche: string[];
    platforms: string[];
    bio: string;
    location: string;
    legitimacyScore?: number;
  };
  onViewProfile: (creator: any) => void;
}

const CreatorCard = ({ creator, onViewProfile }: CreatorCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="text-sm font-medium text-slate-700 ml-1">{rating}</span>
      </div>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header with avatar and basic info */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {creator.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{creator.name}</h3>
              <p className="text-sm text-slate-600 truncate">{creator.handle}</p>
              <div className="flex items-center mt-1 space-x-2">
                {creator.platforms.map((platform) => (
                  <div key={platform}>
                    {getPlatformIcon(platform)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex justify-center">
            {renderStars(creator.rating)}
          </div>

          {/* Niche Tags */}
          <div className="flex flex-wrap gap-2">
            {creator.niche.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary-50 text-primary-700 border-primary-200">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-blue-900">{creator.followers}</div>
              <div className="text-xs text-blue-600">Followers</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-900">{creator.engagementRate}</div>
              <div className="text-xs text-green-600">Engagement</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-purple-900">
                {creator.legitimacyScore ? creator.legitimacyScore.toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-purple-600">Legitimacy</div>
            </div>
          </div>

          {/* Bio */}
          <div className="border-t pt-3">
            <p className="text-sm text-slate-600 line-clamp-2">{creator.bio}</p>
            <p className="text-xs text-slate-500 mt-2">📍 {creator.location}</p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => onViewProfile(creator)}
            className="w-full bg-primary hover:bg-primary-600 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
