import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Search, Filter, Users, Instagram, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/ui/loading-spinner';
import { getApiUrl } from '../../lib/api';

interface Creator {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  ig_handle: string;
}

const ExploreCreators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  const ITEMS_PER_PAGE = 20;

  // Fetch creators from backend API
  const fetchCreators = useCallback(async (page: number = 1, search: string = '', category: string = 'all', subcategory: string = 'all') => {
    try {
      // Only show full loading spinner on initial load
      if (isInitialLoad.current) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: search,
        category: category,
        subcategory: subcategory
      });

      const url = getApiUrl(`api/creators?${params}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Backend API not available. Please start the backend server.');
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch creators`);
      }

      const data = await response.json();
      
      setCreators(data.creators || []);
      setFilteredCreators(data.creators || []);
      setTotalCount(data.totalCount || 0);
      isInitialLoad.current = false;
    } catch (error: any) {
      setError(error.message || 'Failed to load creators');
      setCreators([]);
      setFilteredCreators([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  // Store categories with their subcategories
  interface CategoryData {
    name: string;
    subcategories: string[];
  }
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  const fetchCategories = async () => {
    try {
      const url = getApiUrl('api/creators/categories');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      
      // Extract category names and subcategories from the response
      if (data.success && data.categories) {
        const categoryData = data.categories.map((cat: any) => ({
          name: typeof cat === 'string' ? cat : cat.name || cat.category,
          subcategories: cat.subcategories || []
        }));
        setCategories(categoryData);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCreators(currentPage, debouncedSearchTerm, selectedCategory, selectedSubcategory);
  }, [currentPage, debouncedSearchTerm, selectedCategory, selectedSubcategory, fetchCreators]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1); // Reset to first page when search changes
      }
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search - just update the input, debounce handles API call
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all'); // Reset subcategory when category changes
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle subcategory filter
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Get subcategories for the selected category
  const getAvailableSubcategories = (): string[] => {
    if (selectedCategory === 'all') {
      // Aggregate all subcategories when no specific category is selected
      const allSubcategories = new Set<string>();
      categories.forEach(cat => {
        cat.subcategories.forEach(sub => allSubcategories.add(sub));
      });
      return Array.from(allSubcategories).sort();
    }
    const selectedCat = categories.find(cat => cat.name === selectedCategory);
    return selectedCat?.subcategories || [];
  };

  // Handle creator profile view
  const handleViewProfile = (creator: Creator) => {
    navigate(`/dashboard/creator-profile/${encodeURIComponent(creator.ig_handle)}`, {
      state: { creator }
    });
  };

  // Format Instagram handle
  const formatHandle = (handle: string) => {
    return handle.startsWith('@') ? handle : `@${handle}`;
  };

  // Get creator initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && isInitialLoad.current) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading creators...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Explore Creators
            </h1>
            <p className="text-gray-600 mt-2">
              Discover and connect with Instagram influencers from our database of 38,000+ creators
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {totalCount > 0 ? `${totalCount.toLocaleString()} creators available` : 'Loading creators...'}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search creators by name or Instagram handle..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            {/* Subcategory Filter */}
            <select
              value={selectedSubcategory}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={getAvailableSubcategories().length === 0}
            >
              <option value="all">All Subcategories</option>
              {getAvailableSubcategories().map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredCreators.map((creator) => (
          <Card key={creator.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold">
                    {getInitials(creator.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{creator.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Instagram className="h-3 w-3 mr-1" />
                    <span className="truncate">{formatHandle(creator.ig_handle)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Badge variant="secondary" className="mb-4">
                {creator.subcategory}
              </Badge>
              
              <Button 
                onClick={() => handleViewProfile(creator)}
                className="w-full group-hover:bg-blue-600 transition-colors"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile & Analytics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Creators</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchCreators(currentPage, searchTerm, selectedCategory)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
            {error.includes('Backend API not available') && (
              <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded">
                <p className="font-medium">Quick Fix:</p>
                <p>Run <code className="bg-red-200 px-1 rounded">npm run dev</code> in the backend folder</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCreators.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No creators found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters to find creators.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExploreCreators;