import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Check, DollarSign, Video, Users, Package, FileText, Info, Play, Image, Zap, Star, X, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { getApiUrl } from '../lib/api';
import { calculateAffordableCreators, getRecommendedCreatorCount, formatINR, CREATOR_PRICING, type CreatorTier } from '../lib/pricing';

interface CampaignFormData {
  budget: string;
  cpvRate: string;
  minGuarantee: string;
  maxPayout: string;
  contentType: string;
  creatorType: string;
  qualityLevel: string;
  productName: string;
  productLink: string;
  productValue: string;
  productType: string;
  category: string;
  shippingRequired: boolean;
  budgetFlexible: boolean;
  targetCategory: string;
  targetSubcategory: string;
  creatorTier: string;
  brief: string;
  keyMessages: string;
  dos: string;
  donts: string;
  requiredHashtags: string;
  timelineDays: string;
}

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, brand, createBrandProfile, loading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIProcessing, setShowAIProcessing] = useState(false);
  const [aiProcessingStage, setAIProcessingStage] = useState(0);
  
  // State for brand profile creation
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [brandFormData, setBrandFormData] = useState({
    brand_name: '',
    brand_website: '',
    social_handles: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }
  
  const [formData, setFormData] = useState<CampaignFormData>({
    budget: '50000',
    cpvRate: '50',
    minGuarantee: '1500',
    maxPayout: '10000',
    contentType: '',
    creatorType: '',
    qualityLevel: '',
    productName: '',
    productLink: '',
    productValue: '',
    productType: 'physical',
    category: '',
    shippingRequired: false,
    budgetFlexible: false,
    targetCategory: '',
    targetSubcategory: '',
    creatorTier: '',
    brief: '',
    keyMessages: '',
    dos: '',
    donts: '',
    requiredHashtags: '',
    timelineDays: '14',
  });

  // State for recommendation system
  const [creatorCategories, setCreatorCategories] = useState<any[]>([]);
  const [creatorSubcategories, setCreatorSubcategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creatorStats, setCreatorStats] = useState<any>(null);

  const updateFormData = (field: keyof CampaignFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProfile = async () => {
    if (!brandFormData.brand_name || !brandFormData.brand_website) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in brand name and website',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingProfile(true);
    try {
      await createBrandProfile({
        brand_name: brandFormData.brand_name,
        brand_website: brandFormData.brand_website,
        social_handles: brandFormData.social_handles,
        niches: [],
      });

      toast({
        title: 'Success',
        description: 'Brand profile created successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create brand profile',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const url = getApiUrl('/api/creators/categories');
      const response = await fetch(url);
      const data = await response.json();
      if (data.success && data.categories) {
        setCreatorCategories(data.categories);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load creator categories',
        variant: 'destructive'
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories for selected category
  const fetchSubcategories = async (category: string) => {
    try {
      const url = getApiUrl(`/api/creators/categories/${encodeURIComponent(category)}/subcategories`);
      const response = await fetch(url);
      const data = await response.json();
      if (data.success && data.subcategories) {
        setCreatorSubcategories(data.subcategories);
      } else {
        setCreatorSubcategories([]);
      }
    } catch (error) {
      setCreatorSubcategories([]);
    }
  };

  // Fetch creator stats for selected category/subcategory
  const fetchCreatorStats = async () => {
    if (!formData.targetCategory) return;
    
    try {
      const params = new URLSearchParams({
        category: formData.targetCategory,
        ...(formData.targetSubcategory && { subcategory: formData.targetSubcategory })
      });
      
      const response = await fetch(getApiUrl(`/api/creator-stats?${params}`));
      const data = await response.json();
      if (data.success) {
        setCreatorStats(data.stats);
      }
    } catch (error) {
      // Silently fail - stats are optional
    }
  };

  // Load categories on component mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch stats when category or subcategory changes
  React.useEffect(() => {
    if (formData.targetCategory) {
      fetchCreatorStats();
    }
  }, [formData.targetCategory, formData.targetSubcategory]);

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate user and brand
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a campaign.",
          variant: "destructive",
        });
        return;
      }

      let brandId = brand?.id;

      if (!brandId) {
        console.log("No brand profile found, attempting to create default profile...");
        try {
          const defaultName = user.email?.split('@')[0] || 'Brand';
          const { data: createdBrand, error: insertErr } = await supabase
            .from('brands')
              .insert({
                user_id: user.id,
                brand_name: defaultName,
                brand_website: 'https://example.com', // Provide a valid URL fallback
                social_handles: '',
                niches: [],
                company_size: '1-10',
                industry: 'other',
                description: '',
                experience_level: 'beginner',
              })
            .select('id')
            .single();

          if (insertErr) {
            console.error('Failed to auto-create brand in form:', insertErr);
            toast({
              title: "Brand Profile Required",
              description: `Failed to auto-create profile: ${insertErr.message}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          
          brandId = createdBrand.id;
          console.log("Auto-created brand profile with ID:", brandId);
        } catch (err) {
          console.error('Exception creating brand in form:', err);
          setIsSubmitting(false);
          return;
        }
      }

      // Validate creatorTier is set
      if (!formData.creatorTier || !['micro', 'macro', 'mega'].includes(formData.creatorTier)) {
        toast({
          title: "Error",
          description: "Please select a creator tier (Nano, Micro, or Macro creators)",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Calculate optimal creator count based on budget and tier
      const budgetRecommendation = getRecommendedCreatorCount(
        parseInt(formData.budget), 
        formData.creatorTier as CreatorTier
      );
      
      // Calculate max affordable and optimal slots based on max payout cap
      const minGuaranteeVal = parseInt(formData.minGuarantee) || 0;
      const maxPayoutVal = parseInt(formData.maxPayout) || 10000;
      const maxAffordableByCap = Math.floor(parseInt(formData.budget) / maxPayoutVal) || 1;
      
      // Create campaign in database (updated for new multi-phase system)
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          brand_id: brandId,
          campaign_name: `${formData.productName || 'Untitled'} Campaign`,
          campaign_type: formData.category || 'Instagram',
          campaign_description: formData.brief || `Content: ${formData.contentType}, Creator: ${formData.creatorType}, Quality: ${formData.qualityLevel}. Product: ${formData.productName}${formData.productLink ? `. Link: ${formData.productLink}` : ''}`,
          description: formData.brief || `Content: ${formData.contentType}, Creator: ${formData.creatorType}, Quality: ${formData.qualityLevel}. Product: ${formData.productName}${formData.productLink ? `. Link: ${formData.productLink}` : ''}`,
          budget: parseInt(formData.budget) || 0,
          cpv_rate: 0.0,
          min_guarantee_per_creator: minGuaranteeVal,
          max_payout_per_creator: maxPayoutVal,
          campaign_objectives: ['Brand Awareness', 'Product Marketing'],
          requirements: `Content Type: ${formData.contentType}, Creator Type: ${formData.creatorType}, Quality Level: ${formData.qualityLevel}${formData.shippingRequired ? '. Shipping required.' : ''}`,
          deliverables: {
            content_type: formData.contentType,
            creator_type: formData.creatorType,
            quality_level: formData.qualityLevel,
            product_name: formData.productName,
            product_link: formData.productLink,
            product_type: formData.productType,
            product_value: formData.productValue,
            shipping_required: formData.shippingRequired
          },
          // NEW: Automated recommendation fields with budget-based calculation
          target_category: formData.targetCategory,
          target_subcategory: formData.targetSubcategory || null,
          creator_type: formData.creatorTier,
          target_creators_count: maxAffordableByCap,
          // Pricing fields (separate columns)
          estimated_cost_per_creator: maxPayoutVal, // Since cap defines max cost per creator
          max_affordable_creators: maxAffordableByCap,
          actual_creators_selected: 0,
          // END NEW
          phase: 'approval_pending',
          status: 'pending_admin',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        })
        .select()
        .single();

      if (campaignError) {
        throw new Error(`Failed to create campaign: ${campaignError.message}`);
      }

      // DUAL-SYNC INSERTION into legacy_campaigns
      const parsedKeyMessages = formData.keyMessages.split('\n').map(m => m.trim()).filter(Boolean);
      const parsedHashtags = formData.requiredHashtags.split(',').map(h => h.trim()).filter(Boolean);
      const parsedDos = formData.dos.split('\n').map(d => d.trim()).filter(Boolean);
      const parsedDonts = formData.donts.split('\n').map(d => d.trim()).filter(Boolean);

      const { error: legacyError } = await supabase
        .from('legacy_campaigns')
        .insert({
          id: campaignData.id, // SAME UUID!
          brand_name: brand?.brand_name || 'Brand',
          title: campaignData.campaign_name,
          tagline: `Promote ${formData.productName}`,
          brief: formData.brief,
          deliverables: [formData.contentType || '30 seconds Reel'],
          do_dont: { do: parsedDos, dont: parsedDonts },
          platform: 'instagram',
          target_niches: [formData.targetCategory],
          target_tiers: formData.creatorTier === 'micro' ? ['nano'] : formData.creatorTier === 'macro' ? ['micro'] : ['mid', 'macro'],
          cpv_paise: 0,
          budget_inr: parseInt(formData.budget) || 0,
          min_guarantee_per_creator: minGuaranteeVal,
          max_payout_per_creator: maxPayoutVal,
          slots_total: maxAffordableByCap,
          slots_filled: 0,
          requires_script: true, // Requires script approval before starting work
          deadline: new Date(Date.now() + (parseInt(formData.timelineDays) || 14) * 24 * 60 * 60 * 1000).toISOString(),
          status: 'paused',
          created_by: user.id,
          payout_window_days: 7,
          key_messages: parsedKeyMessages,
          hashtags: parsedHashtags
        });

      if (legacyError) {
        console.error('Failed to create legacy_campaign record:', legacyError);
      }

      // Log campaign activity for the new multi-phase system
      const { error: activityError } = await supabase
        .from('campaign_activities')
        .insert({
          campaign_id: campaignData.id,
          user_id: user.id,
          user_type: 'brand',
          activity_type: 'campaign_created',
          description: `Campaign "${campaignData.campaign_name}" created by brand`,
          metadata: {
            budget: parseInt(formData.budget),
            content_type: formData.contentType,
            creator_type: formData.creatorType,
            product_name: formData.productName
          }
        });

      if (activityError) {
        // Don't throw error here, as campaign was created successfully
      }

      // Trigger recommendation generation in the background (fire and forget)
      if (formData.targetCategory) {
        fetch(
          getApiUrl(`/api/campaigns/${campaignData.id}/generate-recommendations`),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autoApprove: false })
          }
        ).catch(err => console.error("Background recommendations gen failed:", err));
      }

      toast({
        title: "Campaign Created Successfully!",
        description: "Your campaign has been launched directly and is now active.",
        duration: 5000,
      });

      // Navigate to campaign detail page immediately
      navigate(`/dashboard/campaigns/${campaignData.id}`);
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message || 'There was a problem submitting your campaign.'}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.budget !== '' && formData.cpvRate !== '';
      case 2:
        return formData.contentType !== '';
      case 3:
        return formData.creatorType !== '' && formData.creatorTier !== '' && formData.qualityLevel !== '' && formData.targetCategory !== '';
      case 4:
        return formData.productName !== '' && formData.category !== '' && formData.productValue !== '';
      case 5:
        return formData.brief !== '' && formData.keyMessages !== '' && formData.dos !== '' && formData.donts !== '' && formData.requiredHashtags !== '';
      case 6:
        return true;
      default:
        return false;
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value);
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  const budgetOptions = [
    { value: '5000', label: '₹5K' },
    { value: '10000', label: '₹10K' },
    { value: '25000', label: '₹25K' },
    { value: '50000', label: '₹50K' },
    { value: '100000', label: '₹1L' },
    { value: '250000', label: '₹2.5L' },
    { value: '500000', label: '₹5L' },
    { value: '1000000', label: '₹10L+' },
  ];

  const categories = [
    'Beauty', 'Lifestyle', 'Finance', 'Entertainment', 
    'Parenting', 'Health', 'Travel', 'Food', 'Tech'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose campaign budget & CPV</h2>
              <p className="text-gray-600 text-lg">Set your investment and cost-per-view for maximum impact</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-8">
                {formatCurrency(formData.budget)}
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('budget', option.value)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      formData.budget === option.value
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative">
                  <div className="relative">
                    <input
                      type="range"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div 
                      className="absolute top-0 h-2 bg-blue-600 rounded-lg pointer-events-none"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((parseInt(formData.budget) - 5000) / (1000000 - 5000)) * 100))}%`
                      }}
                    ></div>
                    {/* Tick marks for budget options */}
                    {budgetOptions.map((option, index) => {
                      const position = ((parseInt(option.value) - 5000) / (1000000 - 5000)) * 100;
                      return (
                        <div
                          key={option.value}
                          className="absolute top-0 w-0.5 h-2 bg-gray-400 pointer-events-none"
                          style={{ left: `${position}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-3">
                    <span>₹5K</span>
                    <span>₹10L+</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">
                      Current Budget: {formatCurrency(formData.budget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CPV Rate & Reach Information */}
            <div className="border-t pt-6 space-y-4 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Estimated Campaign Reach</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Based on a standard CPV of 50 Paise, your budget of <strong>{formatCurrency(formData.budget)}</strong> yields approximately:
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-white/60 rounded-lg p-3 border border-blue-100">
                  <div>
                    <span className="text-2xl font-black text-blue-900">
                      {Math.round(parseInt(formData.budget) / 0.50).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-blue-700 ml-1">Est. Views</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-[10px] text-blue-800 uppercase font-bold py-0.5 px-2">
                    Subject to Admin Review
                  </Badge>
                </div>

                <div className="flex items-start space-x-2 text-[10px] text-gray-500 leading-normal border-t border-blue-100 pt-3">
                  <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>
                    Your campaign will be sent to the Admin queue. The Admin will assign the exact CPV rate based on your budget, target category, and niche before publication.
                  </p>
                </div>
              </div>
            </div>

            {/* Hybrid Payout Settings */}
            <div className="border-t pt-6 space-y-6 max-w-md mx-auto">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Creator Payout Caps & Safety Guarantees</h3>
                <p className="text-xs text-gray-500">Protect your budget while guaranteeing fair pay for creator production costs.</p>
              </div>

              {/* Minimum Guarantee */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <Label htmlFor="minGuarantee" className="text-sm font-semibold text-gray-700">Minimum Guarantee per Creator</Label>
                    <p className="text-[10px] text-gray-400">Fixed amount paid to creator regardless of views (covers raw creation/editing costs)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">₹{parseInt(formData.minGuarantee).toLocaleString()}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={formData.minGuarantee}
                  onChange={(e) => updateFormData('minGuarantee', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹0 (No base fee)</span>
                  <span>₹5K</span>
                  <span>₹10K (Premium base)</span>
                </div>
              </div>

              {/* Maximum Payout Cap */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <Label htmlFor="maxPayout" className="text-sm font-semibold text-gray-700">Maximum Payout Cap per Creator*</Label>
                    <p className="text-[10px] text-gray-400">Hard limit on what one creator can earn (limits brand risk if content goes viral)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">₹{parseInt(formData.maxPayout).toLocaleString()}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={formData.maxPayout}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateFormData('maxPayout', val);
                    // Ensure minGuarantee <= maxPayout
                    if (parseInt(formData.minGuarantee) > parseInt(val)) {
                      updateFormData('minGuarantee', val);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>₹1K</span>
                  <span>₹25K</span>
                  <span>₹50K (High ceiling)</span>
                </div>
              </div>

              {/* Creator Limit Indicator */}
              {formData.budget && formData.maxPayout && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-fadeIn">
                  <div className="flex items-center space-x-3 text-left">
                    <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Max Onboarded Creators</p>
                      <p className="text-[10px] text-green-700">Formula: Budget ÷ Max Payout per Creator</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-900">
                      {Math.floor(parseInt(formData.budget) / (parseInt(formData.maxPayout) || 10000)) || 1}
                    </p>
                    <p className="text-[10px] text-green-700">Creators Max</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="budgetFlexible"
                  checked={formData.budgetFlexible}
                  onCheckedChange={(checked) => updateFormData('budgetFlexible', checked as boolean)}
                  className="mt-1"
                />
                <div className="text-left">
                  <label htmlFor="budgetFlexible" className="text-sm font-medium text-gray-900 cursor-pointer">
                    My budget is slightly flexible (this will allow you to get more creators in your campaign)
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="font-semibold text-blue-900">Pro Tip: Higher budgets attract premium creators</p>
                  <p className="text-sm text-blue-700 mt-1">Campaign available for purchase with flexible payment options.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                Choose content requirements per creator
                <Info className="ml-2 h-5 w-5 text-gray-400" />
              </h2>
              <p className="text-gray-600 text-lg">Our pricing is dynamic and is always based on the topics selected.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 30 seconds Reel Card */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.contentType === '30 seconds Reel' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => updateFormData('contentType', '30 seconds Reel')}
              >
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <Play className={cn("h-8 w-8", formData.contentType === '30 seconds Reel' ? "text-blue-600" : "text-gray-400")} />
                    {formData.contentType === '30 seconds Reel' && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">Hot</span>
                    )}
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-2", formData.contentType === '30 seconds Reel' ? "text-blue-900" : "text-gray-900")}>
                    30 seconds Reel
                  </h3>
                  <p className="text-sm text-gray-500">Add video log</p>
                </CardContent>
              </Card>

              {/* Video Story Card */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.contentType === 'Video Story' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => updateFormData('contentType', 'Video Story')}
              >
                <CardContent className="p-6">
                  <Play className={cn("h-8 w-8 mb-4", formData.contentType === 'Video Story' ? "text-blue-600" : "text-gray-400")} />
                  <h3 className={cn("text-xl font-semibold mb-2", formData.contentType === 'Video Story' ? "text-blue-900" : "text-gray-900")}>
                    Video Story
                  </h3>
                  <p className="text-sm text-gray-500">Short, engaging video</p>
                </CardContent>
              </Card>

              {/* Static Post Card */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.contentType === 'Static Post' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => updateFormData('contentType', 'Static Post')}
              >
                <CardContent className="p-6">
                  <Image className={cn("h-8 w-8 mb-4", formData.contentType === 'Static Post' ? "text-blue-600" : "text-gray-400")} />
                  <h3 className={cn("text-xl font-semibold mb-2", formData.contentType === 'Static Post' ? "text-blue-900" : "text-gray-900")}>
                    Static Post
                  </h3>
                  <p className="text-sm text-gray-500">Image or carousel post</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Select creator types</h2>
              <p className="text-gray-600 text-lg">Choose the type of creators you want to work with for your campaign.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nano creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.creatorType === 'Nano creators' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Nano creators');
                  updateFormData('creatorTier', 'micro');
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Users className={cn("h-8 w-8", formData.creatorType === 'Nano creators' ? "text-blue-600" : "text-gray-400")} />
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-2", formData.creatorType === 'Nano creators' ? "text-blue-900" : "text-gray-900")}>
                    Nano creators
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">1K - 10K followers</p>
                  <p className="text-sm text-gray-600">High engagement, authentic content</p>
                </CardContent>
              </Card>

              {/* Micro creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.creatorType === 'Micro creators' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Micro creators');
                  updateFormData('creatorTier', 'macro');
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={cn("h-8 w-8 rounded flex items-center justify-center", formData.creatorType === 'Micro creators' ? "bg-blue-600" : "bg-gray-400")}>
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-2", formData.creatorType === 'Micro creators' ? "text-blue-900" : "text-gray-900")}>
                    Micro creators
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">10K - 100K followers</p>
                  <p className="text-sm text-gray-600">Balanced reach and engagement</p>
                </CardContent>
              </Card>

              {/* Macro creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  formData.creatorType === 'Macro creators' 
                    ? "border-blue-500 bg-blue-50 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Macro creators');
                  updateFormData('creatorTier', 'mega');
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Star className={cn("h-8 w-8", formData.creatorType === 'Macro creators' ? "text-blue-600" : "text-gray-400")} />
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-2", formData.creatorType === 'Macro creators' ? "text-blue-900" : "text-gray-900")}>
                    Macro creators
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">100K+ followers</p>
                  <p className="text-sm text-gray-600">Maximum reach and visibility</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Creator Quality</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateFormData('qualityLevel', 'Standard Quality')}
                  className={cn(
                    "px-6 py-3 rounded-lg border-2 transition-colors",
                    formData.qualityLevel === 'Standard Quality'
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-300"
                  )}
                >
                  <div className="text-left">
                    <div className="font-semibold">Standard Quality</div>
                    <div className="text-sm">Budget friendly</div>
                  </div>
                </button>
                <button
                  onClick={() => updateFormData('qualityLevel', 'Premium Quality')}
                  className={cn(
                    "px-6 py-3 rounded-lg border-2 transition-colors",
                    formData.qualityLevel === 'Premium Quality'
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-300"
                  )}
                >
                  <div className="text-left">
                    <div className="font-semibold">Premium Quality</div>
                    <div className="text-sm">Higher engagement</div>
                  </div>
                </button>
                <button
                  onClick={() => updateFormData('qualityLevel', 'Elite Quality')}
                  className={cn(
                    "px-6 py-3 rounded-lg border-2 transition-colors",
                    formData.qualityLevel === 'Elite Quality'
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-300"
                  )}
                >
                  <div className="text-left">
                    <div className="font-semibold">Elite Quality</div>
                    <div className="text-sm">Top tier creators</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Automated Creator Matching Section */}
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
                    updateFormData('targetSubcategory', '');
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
                    ) : creatorCategories.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      creatorCategories
                        .filter(cat => cat.category && cat.category.trim() !== '')
                        .map((cat) => (
                          <SelectItem key={cat.category} value={cat.category}>
                            {cat.category} ({cat.creator_count} creators)
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  We'll match you with creators in this category
                </p>
              </div>

              {/* Subcategory Selection */}
              {formData.targetCategory && (
                <div className="animate-fadeIn">
                  <Label htmlFor="targetSubcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Subcategory (Optional)
                  </Label>
                  <Select
                    value={formData.targetSubcategory || '__any__'}
                    onValueChange={(value) => updateFormData('targetSubcategory', value === '__any__' ? '' : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subcategory (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="__any__">Any Subcategory</SelectItem>
                      {creatorSubcategories
                        .filter((subcat) => subcat.name && subcat.name.trim() !== '')
                        .map((subcat) => (
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

              {/* Creator Stats Display */}
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
                          <p className="font-bold text-purple-900">{creatorStats.by_tier?.micro || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Micro (10K-100K)</p>
                          <p className="font-bold text-purple-900">{creatorStats.by_tier?.macro || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Mega (100K-2M)</p>
                          <p className="font-bold text-purple-900">{creatorStats.by_tier?.mega || 0}</p>
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

              {/* Budget-Based Pricing Display */}
              {formData.budget && formData.creatorTier && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 shadow-md">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-lg font-bold text-green-900 mb-1">
                          Budget Analysis
                        </p>
                        <p className="text-sm text-gray-700">
                          Based on your ₹{parseInt(formData.budget).toLocaleString('en-IN')} budget and selected creator tier
                        </p>
                      </div>

                      {/* Pricing Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Nano/Micro Creators */}
                        <div className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          formData.creatorTier === 'micro' 
                            ? "bg-blue-100 border-blue-500 shadow-md" 
                            : "bg-white border-gray-200"
                        )}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Nano Creators</div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatINR(CREATOR_PRICING.micro.pricePerCreator)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {CREATOR_PRICING.micro.followerRange}
                          </div>
                          {formData.creatorTier === 'micro' && (
                            <div className="mt-2 text-xs font-semibold text-blue-700">
                              ✓ You can afford {calculateAffordableCreators(parseInt(formData.budget), 'micro')} creators
                            </div>
                          )}
                        </div>

                        {/* Macro Creators */}
                        <div className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          formData.creatorTier === 'macro' 
                            ? "bg-blue-100 border-blue-500 shadow-md" 
                            : "bg-white border-gray-200"
                        )}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Macro Creators</div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatINR(CREATOR_PRICING.macro.pricePerCreator)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {CREATOR_PRICING.macro.followerRange}
                          </div>
                          {formData.creatorTier === 'macro' && (
                            <div className="mt-2 text-xs font-semibold text-blue-700">
                              ✓ You can afford {calculateAffordableCreators(parseInt(formData.budget), 'macro')} creators
                            </div>
                          )}
                        </div>

                        {/* Mega Creators */}
                        <div className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          formData.creatorTier === 'mega' 
                            ? "bg-blue-100 border-blue-500 shadow-md" 
                            : "bg-white border-gray-200"
                        )}>
                          <div className="text-xs font-medium text-gray-600 mb-1">Mega Creators</div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatINR(CREATOR_PRICING.mega.pricePerCreator)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {CREATOR_PRICING.mega.followerRange}
                          </div>
                          {formData.creatorTier === 'mega' && (
                            <div className="mt-2 text-xs font-semibold text-blue-700">
                              ✓ You can afford {calculateAffordableCreators(parseInt(formData.budget), 'mega')} creators
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommendation Summary */}
                      {(() => {
                        const recommendation = getRecommendedCreatorCount(
                          parseInt(formData.budget), 
                          formData.creatorTier as CreatorTier
                        );
                        return (
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-semibold text-gray-900 text-base">
                                  Recommended Creator Count
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Optimized for {recommendation.pricing.followerRange} followers
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold text-green-600">
                                  {recommendation.optimal}
                                </div>
                                <div className="text-xs text-gray-500">creators</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs text-gray-600">Cost per creator</p>
                                <p className="font-bold text-gray-900">
                                  {formatINR(recommendation.pricing.pricePerCreator)}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs text-gray-600">Maximum affordable</p>
                                <p className="font-bold text-gray-900">
                                  {recommendation.max} creators
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Estimated Total Cost:</span>
                                <span className="font-bold text-gray-900 text-lg">
                                  {formatINR(recommendation.optimal * recommendation.pricing.pricePerCreator)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Using {((recommendation.optimal * recommendation.pricing.pricePerCreator / parseInt(formData.budget)) * 100).toFixed(0)}% of your budget
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Details</h2>
              <p className="text-gray-600 text-lg">Tell us about the product you want to promote</p>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Type*
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      updateFormData('productType', 'physical');
                      updateFormData('shippingRequired', true);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200",
                      formData.productType === 'physical'
                        ? "border-blue-500 bg-blue-50/50 shadow-md text-blue-900"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    )}
                  >
                    <Package className="h-6 w-6 mb-2 text-blue-600" />
                    <div className="font-semibold text-sm">Physical Product</div>
                    <p className="text-[10px] text-gray-500 mt-1">Requires physical shipping to creators (e.g. fashion, devices, cosmetics)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateFormData('productType', 'digital');
                      updateFormData('shippingRequired', false);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200",
                      formData.productType === 'digital'
                        ? "border-blue-500 bg-blue-50/50 shadow-md text-blue-900"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    )}
                  >
                    <Sparkles className="h-6 w-6 mb-2 text-purple-600" />
                    <div className="font-semibold text-sm">Software / Digital</div>
                    <p className="text-[10px] text-gray-500 mt-1">Accessed via download link, access codes, or licenses</p>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name*
                </Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="Enter your product name"
                  value={formData.productName}
                  onChange={(e) => updateFormData('productName', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Link (Optional)
                </Label>
                <Input
                  id="productLink"
                  type="url"
                  placeholder="https://your-product-link.com"
                  value={formData.productLink}
                  onChange={(e) => updateFormData('productLink', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="productValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Value (₹)*
                </Label>
                <Input
                  id="productValue"
                  type="text"
                  placeholder="Enter product value"
                  value={formData.productValue}
                  onChange={(e) => updateFormData('productValue', e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">This is the retail value of your product</p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Category*
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateFormData('category', category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        formData.category === category
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {formData.productType === 'physical' ? (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-3">
                    Shipping Details
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        formData.shippingRequired 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-blue-300"
                      )}
                      onClick={() => updateFormData('shippingRequired', true)}
                    >
                      <CardContent className="p-6 text-center">
                        <Package className={cn("h-8 w-8 mx-auto mb-3", formData.shippingRequired ? "text-blue-600" : "text-gray-400")} />
                        <h3 className={cn("font-semibold mb-2 text-sm", formData.shippingRequired ? "text-blue-900" : "text-gray-900")}>
                          Shipping Required
                        </h3>
                        <p className="text-xs text-gray-600">
                          You will send physical products to creators for content creation.
                        </p>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        !formData.shippingRequired 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-blue-300"
                      )}
                      onClick={() => updateFormData('shippingRequired', false)}
                    >
                      <CardContent className="p-6 text-center">
                        <X className={cn("h-8 w-8 mx-auto mb-3", !formData.shippingRequired ? "text-blue-600" : "text-gray-400")} />
                        <h3 className={cn("font-semibold mb-2 text-sm", !formData.shippingRequired ? "text-blue-900" : "text-gray-900")}>
                          No Shipping
                        </h3>
                        <p className="text-xs text-gray-600">
                          Creators already own your physical product or buy it locally.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3 text-left">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-950 text-sm">Digital Access Delivery</p>
                    <p className="text-xs text-blue-800 mt-1">
                      No physical shipping is required. Once you accept a creator, you can share SaaS links, credentials, or licenses on the dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <p className="text-sm text-green-800 font-medium">
                ✓ 100% refund policy: Get a full refund if creators don't deliver or meet quality standards.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Creator Instructions</h2>
              <p className="text-gray-600 text-lg">Define clear instructions and expectations to guide accepted creators</p>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <Label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign / Brand Brief*
                </Label>
                <textarea
                  id="brief"
                  rows={4}
                  placeholder="Explain what your brand stands for, what this campaign is about, and the main story you want creators to tell..."
                  value={formData.brief}
                  onChange={(e) => updateFormData('brief', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="keyMessages" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Messages (One message per line)*
                </Label>
                <textarea
                  id="keyMessages"
                  rows={3}
                  placeholder="e.g. 100% natural and vegan ingredients&#10;Use my promo code CAMPA15 for 15% discount&#10;Delivered in just 15 minutes in Indore"
                  value={formData.keyMessages}
                  onChange={(e) => updateFormData('keyMessages', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dos" className="block text-sm font-medium text-green-700 mb-2 font-semibold">
                    Do's (What to do)*
                  </Label>
                  <textarea
                    id="dos"
                    rows={4}
                    placeholder="e.g. Show product texture clearly&#10;Show the onboarding process&#10;Keep background minimal and clean"
                    value={formData.dos}
                    onChange={(e) => updateFormData('dos', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="donts" className="block text-sm font-medium text-red-700 mb-2 font-semibold">
                    Don'ts (What to avoid)*
                  </Label>
                  <textarea
                    id="donts"
                    rows={4}
                    placeholder="e.g. Don't show competitor logos&#10;Don't use low light/blurry video&#10;Don't forget the call-to-action link"
                    value={formData.donts}
                    onChange={(e) => updateFormData('donts', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="requiredHashtags" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Hashtags (Comma separated)*
                </Label>
                <Input
                  id="requiredHashtags"
                  type="text"
                  placeholder="#YourBrand, #Ad, #HealthyLifestyle"
                  value={formData.requiredHashtags}
                  onChange={(e) => updateFormData('requiredHashtags', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="timelineDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Creator Timeline (Days allowed to post after script approval)*
                </Label>
                <Select
                  value={formData.timelineDays}
                  onValueChange={(value) => updateFormData('timelineDays', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select delivery timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days (Fast turnaround)</SelectItem>
                    <SelectItem value="14">14 Days (Standard)</SelectItem>
                    <SelectItem value="21">21 Days (Detailed product test)</SelectItem>
                    <SelectItem value="30">30 Days (Flexible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit Campaign</h2>
              <p className="text-gray-600 text-lg">Review your campaign details before submitting to match creators.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 text-left">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">1. Budget & Targeting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Budget:</span> <span className="font-semibold">{formatCurrency(formData.budget)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cost Per View (CPV):</span> <span className="font-semibold text-blue-600">Pending Review (Admin set)</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Niche Category:</span> <span className="font-semibold">{formData.targetCategory || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Creator Tier:</span> <span className="font-semibold text-capitalize">{formData.creatorTier || '-'} ({formData.creatorType})</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">2. Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product Name:</span> <span className="font-semibold">{formData.productName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Product Type:</span> <span className="font-semibold text-capitalize">{formData.productType || '-'}</span>
                  </div>
                  {formData.productLink && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Product Link:</span> <a href={formData.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">{formData.productLink}</a>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Product Value:</span> <span className="font-semibold">₹{formData.productValue || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Shipping Required:</span> <span className="font-semibold">{formData.shippingRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">3. Creator Instructions & Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block font-semibold mb-1">Campaign Brief:</span>
                    <p className="bg-gray-50 p-3 rounded text-gray-700 italic whitespace-pre-wrap">{formData.brief || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-semibold mb-1">Required Hashtags:</span>
                    <p className="bg-gray-50 p-2 rounded text-gray-700 font-mono">{formData.requiredHashtags || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-semibold mb-1">Creator Timeline:</span>
                    <p className="bg-gray-50 p-2 rounded text-gray-700 font-semibold">{formData.timelineDays} Days allowed after script approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCampaignSummary = () => {
    const budget = parseInt(formData.budget) || 0;
    const tier = formData.creatorTier as CreatorTier;
    
    let estimatedCreators = 'Not selected';
    if (formData.creatorType && formData.creatorTier) {
      const recommendation = getRecommendedCreatorCount(budget, tier);
      estimatedCreators = recommendation.optimal.toString();
    }

    return {
      budget: formData.budget ? formatCurrency(formData.budget) : 'Not set',
      estimatedCreators: estimatedCreators,
      contentTypes: formData.contentType ? '1' : '0',
      creatorQuality: formData.qualityLevel || 'Not selected',
      categories: formData.category ? '1' : '0',
    };
  };

  const summary = getCampaignSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Campayn</h1>
                <p className="text-sm text-gray-500">Creator Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {!brand ? (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Brand Profile</h2>
                      <p className="text-gray-600 text-lg">Let's set up your brand information to get started with campaigns.</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Brand Name*
                        </Label>
                        <Input
                          id="brand_name"
                          type="text"
                          placeholder="Enter your brand name"
                          value={brandFormData.brand_name}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand_website" className="block text-sm font-medium text-gray-700 mb-2">
                          Brand Website*
                        </Label>
                        <Input
                          id="brand_website"
                          type="url"
                          placeholder="https://yourbrand.com"
                          value={brandFormData.brand_website}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_website: e.target.value }))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="social_handles" className="block text-sm font-medium text-gray-700 mb-2">
                          Social Handles (Optional)
                        </Label>
                        <Input
                          id="social_handles"
                          type="text"
                          placeholder="@yourbrand, @other_handle"
                          value={brandFormData.social_handles}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, social_handles: e.target.value }))}
                          className="w-full"
                        />
                      </div>

                      <Button 
                        onClick={handleCreateProfile} 
                        disabled={isCreatingProfile}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isCreatingProfile ? 'Creating Profile...' : 'Create Brand Profile'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {renderStep()}
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {currentStep === 1 ? 'Back to Dashboard' : 'Back'}
                      </Button>

                      {currentStep < 6 ? (
                        <Button
                          onClick={nextStep}
                          disabled={!isStepValid(currentStep)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Budget</span>
                  <span className="text-sm font-semibold">{summary.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Estimated creators</span>
                  <span className="text-sm font-semibold">{summary.estimatedCreators}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Content types</span>
                  <span className="text-sm font-semibold">{summary.contentTypes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Creator quality</span>
                  <span className="text-sm font-semibold">{summary.creatorQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Categories</span>
                  <span className="text-sm font-semibold">{summary.categories}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Processing Modal */}
      {showAIProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              {/* AI Icon Animation */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-purple-600 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              {/* Stage Text */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {aiProcessingStage === 5 ? '✅ Complete!' : '🤖 AI Processing'}
              </h3>
              
              <p className="text-gray-600 mb-6 min-h-[48px] flex items-center justify-center">
                {aiProcessingStage === 0 && "Analyzing your campaign requirements..."}
                {aiProcessingStage === 1 && "Searching through 37,000+ creators..."}
                {aiProcessingStage === 2 && "AI matching creators to your criteria..."}
                {aiProcessingStage === 3 && "Calculating engagement scores..."}
                {aiProcessingStage === 4 && "Finalizing top recommendations..."}
                {aiProcessingStage === 5 && "Successfully matched creators to your campaign!"}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((aiProcessingStage + 1) / 6) * 100}%` }}
                ></div>
              </div>

              {/* Stage Indicators */}
              <div className="flex justify-center space-x-2 mb-6">
                {[0, 1, 2, 3, 4, 5].map((stage) => (
                  <div
                    key={stage}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      stage <= aiProcessingStage 
                        ? "bg-purple-600 scale-110" 
                        : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              {/* Fun Facts */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium">
                  💡 Did you know?
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {aiProcessingStage === 0 && "Our AI analyzes over 50 data points per creator"}
                  {aiProcessingStage === 1 && "We have creators across 50+ categories"}
                  {aiProcessingStage === 2 && "Matching considers engagement, reach, and niche fit"}
                  {aiProcessingStage === 3 && "Higher engagement = better ROI for your campaign"}
                  {aiProcessingStage === 4 && "We're selecting the perfect creators for you"}
                  {aiProcessingStage === 5 && "You're about to see your personalized matches!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignForm;