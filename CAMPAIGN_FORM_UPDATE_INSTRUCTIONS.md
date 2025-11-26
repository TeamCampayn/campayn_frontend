// Add this after the existing creator type selection in step 3 of CampaignForm.tsx
// This adds automated creator recommendation fields

/* INSERT AFTER THE CREATOR QUALITY SELECTION IN STEP 3 */

{/* NEW: Creator Category Selection for Automated Recommendations */}
<div className="space-y-6 mt-8 pt-8 border-t">
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
      <Sparkles className="h-6 w-6 text-purple-600" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
      Automated Creator Matching
    </h3>
    <p className="text-gray-600">
      Select creator category to receive AI-powered recommendations
    </p>
  </div>

  {/* Target Category Selection */}
  <div>
    <Label htmlFor="targetCategory" className="block text-sm font-medium text-gray-700 mb-2">
      Target Creator Category*
    </Label>
    <Select
      value={formData.targetCategory}
      onValueChange={(value) => {
        updateFormData('targetCategory', value);
        updateFormData('targetSubcategory', ''); // Reset subcategory when category changes
        fetchSubcategories(value);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select creator category" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {loadingCategories ? (
          <SelectItem value="loading" disabled>
            Loading categories...
          </SelectItem>
        ) : categories.length === 0 ? (
          <SelectItem value="none" disabled>
            No categories available
          </SelectItem>
        ) : (
          categories.map((cat) => (
            <SelectItem key={cat.name} value={cat.name}>
              {cat.name} ({cat.count} creators)
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
    <p className="text-sm text-gray-500 mt-1">
      We'll match you with creators in this category
    </p>
  </div>

  {/* Subcategory Selection (shown after category is selected) */}
  {formData.targetCategory && (
    <div className="animate-fadeIn">
      <Label htmlFor="targetSubcategory" className="block text-sm font-medium text-gray-700 mb-2">
        Target Subcategory (Optional)
      </Label>
      <Select
        value={formData.targetSubcategory}
        onValueChange={(value) => updateFormData('targetSubcategory', value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select subcategory (optional)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="">Any Subcategory</SelectItem>
          {subcategories.map((subcat) => (
            <SelectItem key={subcat.name} value={subcat.name}>
              {subcat.name} ({subcat.count} creators)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500 mt-1">
        Narrow down to specific creator niches for better targeting
      </p>
    </div>
  )}

  {/* Creator Tier Summary (if category selected) */}
  {formData.targetCategory && creatorStats && (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <p className="font-semibold text-purple-900">
            Available Creators in {formData.targetCategory}
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nano (1K-10K)</p>
              <p className="font-bold text-purple-900">{creatorStats.by_tier.micro}</p>
            </div>
            <div>
              <p className="text-gray-600">Micro (10K-100K)</p>
              <p className="font-bold text-purple-900">{creatorStats.by_tier.macro}</p>
            </div>
            <div>
              <p className="text-gray-600">Mega (100K-2M)</p>
              <p className="font-bold text-purple-900">{creatorStats.by_tier.mega}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Avg. Engagement: {creatorStats.avg_engagement?.toFixed(2)}% | 
            Avg. Followers: {formatNumber(creatorStats.avg_followers)}
          </p>
        </div>
      </div>
    </div>
  )}
</div>

/* ADD THESE STATE VARIABLES AT THE TOP OF THE COMPONENT */
const [categories, setCategories] = useState<any[]>([]);
const [subcategories, setSubcategories] = useState<any[]>([]);
const [loadingCategories, setLoadingCategories] = useState(false);
const [creatorStats, setCreatorStats] = useState<any>(null);

/* ADD THESE TO THE FORM DATA INTERFACE */
interface CampaignFormData {
  // ... existing fields ...
  targetCategory: string;
  targetSubcategory: string;
  creatorTier: string; // Maps to: micro, macro, mega
}

/* ADD THIS TO THE INITIAL FORM DATA */
const [formData, setFormData] = useState<CampaignFormData>({
  // ... existing fields ...
  targetCategory: '',
  targetSubcategory: '',
  creatorTier: '', // Will be set based on creatorType selection
});

/* ADD THESE HELPER FUNCTIONS */
const fetchCategories = async () => {
  setLoadingCategories(true);
  try {
    const response = await fetch(getApiUrl('/api/creators/categories'));
    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast({
      title: 'Error',
      description: 'Failed to load creator categories',
      variant: 'destructive'
    });
  } finally {
    setLoadingCategories(false);
  }
};

const fetchSubcategories = async (category: string) => {
  try {
    const response = await fetch(getApiUrl(`/api/creators/categories/${category}/subcategories`));
    const data = await response.json();
    if (data.success) {
      setSubcategories(data.subcategories);
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};

const fetchCreatorStats = async () => {
  if (!formData.targetCategory) return;
  
  try {
    const params = new URLSearchParams({
      category: formData.targetCategory,
      ...(formData.targetSubcategory && { subcategory: formData.targetSubcategory })
    });
    
    const response = await fetch(getApiUrl(`/api/creators/stats?${params}`));
    const data = await response.json();
    if (data.success) {
      setCreatorStats(data.stats);
    }
  } catch (error) {
    console.error('Error fetching creator stats:', error);
  }
};

/* ADD useEffect TO LOAD CATEGORIES ON MOUNT */
useEffect(() => {
  fetchCategories();
}, []);

/* ADD useEffect TO FETCH STATS WHEN CATEGORY CHANGES */
useEffect(() => {
  if (formData.targetCategory) {
    fetchCreatorStats();
  }
}, [formData.targetCategory, formData.targetSubcategory]);

/* UPDATE THE creatorType MAPPING TO SET creatorTier */
// When user selects "Nano creators", set creatorTier to "micro"
// When user selects "Micro creators", set creatorTier to "macro"
// When user selects "Macro creators", set creatorTier to "mega"

const handleCreatorTypeSelection = (type: string) => {
  updateFormData('creatorType', type);
  
  // Map UI labels to database tiers
  const tierMapping: Record<string, string> = {
    'Nano creators': 'micro',    // 1K-10K
    'Micro creators': 'macro',   // 10K-100K
    'Macro creators': 'mega'     // 100K-2M
  };
  
  updateFormData('creatorTier', tierMapping[type] || '');
};

/* UPDATE THE CAMPAIGN CREATION TO INCLUDE NEW FIELDS */
const { data: campaignData, error: campaignError } = await supabase
  .from('campaigns')
  .insert({
    // ... existing fields ...
    target_category: formData.targetCategory,
    target_subcategory: formData.targetSubcategory || null,
    creator_type: formData.creatorTier,
  })
  .select()
  .single();

/* ADD FORMAT NUMBER HELPER */
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/* ADD SPARKLES ICON IMPORT */
import { ..., Sparkles } from 'lucide-react';

/* UPDATE STEP 3 VALIDATION */
case 3:
  return (
    formData.creatorType !== '' && 
    formData.qualityLevel !== '' &&
    formData.targetCategory !== '' // Add this validation
  );
