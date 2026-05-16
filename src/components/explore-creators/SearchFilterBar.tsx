
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, MapPin, Sparkles } from "lucide-react";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    category: string;
    city: string;
    minScore: string;
    followerRange: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
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
  const categories = ["Fashion", "Tech", "Beauty", "Food", "Fitness", "Travel", "Lifestyle", "Gaming"];
  const cities = ["Indore", "Bhopal", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];
  const scoreOptions = [
    { value: "0", label: "Any Score" },
    { value: "40", label: "40+ Points" },
    { value: "70", label: "70+ Points" },
    { value: "90", label: "90+ Elite" }
  ];
  
  const sortOptions = [
    { value: "score-desc", label: "Highest Score" },
    { value: "followers-desc", label: "Largest Audience" },
    { value: "engagement-desc", label: "Highest Engagement" }
  ];

  const activeFiltersCount = Object.values(filters).filter(f => f !== "" && f !== "0").length;

  return (
    <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-campayn-primary/5 to-transparent pointer-events-none" />
      
      {/* Search Bar */}
      <div className="relative group/input">
        <div className="absolute -inset-1 bg-gradient-to-r from-campayn-primary to-violet-600 rounded-2xl blur opacity-0 group-focus-within/input:opacity-10 transition duration-500"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
          <Input
            placeholder="Search by name, handle, or expertise..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-14 text-lg bg-white/5 border-white/10 text-white rounded-2xl focus:ring-campayn-primary/20 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <Select
          value={filters.city || "all-cities"}
          onValueChange={(value) => onFilterChange("city", value === "all-cities" ? "" : value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-500" />
              <SelectValue placeholder="All Cities" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
            <SelectItem value="all-cities">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category || "all-categories"}
          onValueChange={(value) => onFilterChange("category", value === "all-categories" ? "" : value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.minScore || "0"}
          onValueChange={(value) => onFilterChange("minScore", value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <SelectValue placeholder="Min Score" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
            {scoreOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active:</span>
            <Badge variant="outline" className="bg-campayn-primary/10 text-campayn-primary border-campayn-primary/20 rounded-lg px-3 py-1">
              {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
