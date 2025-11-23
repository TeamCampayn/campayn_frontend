
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    niche: string[];
    followerRange: string;
    engagementRange: string,
    ratingRange: string;
    platform: string[];
    location: string;
  };
  onFilterChange: (filterType: string, value: string | string[]) => void;
  onClearFilters: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange
}: SearchFilterBarProps) => {
  const nicheOptions = ["Fashion", "Tech", "Beauty", "Food", "Fitness", "Travel", "Lifestyle", "Gaming"];
  const followerRanges = ["0-10K", "10K-50K", "50K-100K", "100K-500K", "500K+"];
  const engagementRanges = ["0-2%", "2-5%", "5-10%", "10%+"];
  const ratingRanges = ["All", "4+ Stars", "4.5+ Stars"];
  const platformOptions = ["Instagram", "YouTube", "TikTok"];
  const locationOptions = ["New York", "Los Angeles", "London", "Paris", "Tokyo"];
  const sortOptions = [
    { value: "followers-desc", label: "Followers (High to Low)" },
    { value: "followers-asc", label: "Followers (Low to High)" },
    { value: "engagement-desc", label: "Engagement (High to Low)" },
    { value: "rating-desc", label: "Rating (High to Low)" },
    { value: "recent", label: "Recently Active" }
  ];

  const activeFiltersCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <Input
          placeholder="Search creators by name, handle, or keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Select
          value={filters.niche[0] || "all-niches"}
          onValueChange={(value) => onFilterChange("niche", value === "all-niches" ? [] : [value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Niche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-niches">All Niches</SelectItem>
            {nicheOptions.map((niche) => (
              <SelectItem key={niche} value={niche}>{niche}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.followerRange || "all-followers"}
          onValueChange={(value) => onFilterChange("followerRange", value === "all-followers" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Followers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-followers">All Ranges</SelectItem>
            {followerRanges.map((range) => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.engagementRange || "all-engagement"}
          onValueChange={(value) => onFilterChange("engagementRange", value === "all-engagement" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Engagement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-engagement">All Rates</SelectItem>
            {engagementRanges.map((range) => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.ratingRange}
          onValueChange={(value) => onFilterChange("ratingRange", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratingRanges.map((range) => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.platform[0] || "all-platforms"}
          onValueChange={(value) => onFilterChange("platform", value === "all-platforms" ? [] : [value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-platforms">All Platforms</SelectItem>
            {platformOptions.map((platform) => (
              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Active filters:</span>
            <Badge variant="outline" className="bg-primary-50 text-primary-700">
              <Filter className="h-3 w-3 mr-1" />
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
