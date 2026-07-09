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
  requiresScript: boolean;
  coverImageUrl?: string;
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
    requiresScript: true,
    coverImageUrl: '',
  });

  // State for cover image
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (PNG, JPG, WEBP).',
        variant: 'destructive',
      });
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 5) {
      toast({
        title: 'File too large',
        description: 'Cover photo must be under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingCover(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      
      const { error: uploadErr } = await supabase.storage
        .from('campaigns')
        .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type });

      if (uploadErr) {
        throw new Error(uploadErr.message);
      }

      const { data: pub } = supabase.storage.from('campaigns').getPublicUrl(path);
      const publicUrl = pub?.publicUrl;

      if (publicUrl) {
        setCoverPreviewUrl(publicUrl);
        updateFormData('coverImageUrl', publicUrl);
        toast({
          title: 'Success',
          description: 'Cover photo uploaded successfully!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload cover photo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const clearCoverImage = () => {
    setCoverPreviewUrl('');
    setCoverUrlInput('');
    updateFormData('coverImageUrl', '');
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

  // Pre-fill campaign details from brand profile (onboarding scrapings)
  React.useEffect(() => {
    if (brand) {
      setFormData(prev => ({
        ...prev,
        productName: prev.productName || brand.brand_name || '',
        productLink: prev.productLink || brand.brand_website || '',
        category: prev.category || brand.industry || '',
        brief: prev.brief || brand.brand_description || '',
      }));
    }
  }, [brand]);

  const nextStep = () => {
    if (currentStep < 5) {
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

      // Show AI Matchmaking loader first
      setShowAIProcessing(true);
      setAIProcessingStage(0);

      // Animate stages for AI loader
      for (let stage = 1; stage <= 5; stage++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAIProcessingStage(stage);
      }

      // Keep it complete for 500ms
      await new Promise(resolve => setTimeout(resolve, 500));

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
          cover_image_url: formData.coverImageUrl || null,
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
          cover_image_url: formData.coverImageUrl || null,
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
          requires_script: formData.requiresScript ?? true, // Requires script approval before starting work
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
      setShowAIProcessing(false);
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message || 'There was a problem submitting your campaign.'}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setShowAIProcessing(false);
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.productName !== '' && formData.category !== '' && formData.productValue !== '';
      case 2:
        return formData.contentType !== '' && formData.brief !== '' && formData.keyMessages !== '' && formData.dos !== '' && formData.donts !== '' && formData.requiredHashtags !== '';
      case 3:
        return formData.creatorType !== '' && formData.creatorTier !== '' && formData.qualityLevel !== '' && formData.targetCategory !== '';
      case 4:
        return formData.budget !== '';
      case 5:
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
    'Parenting', 'Health', 'Travel', 'Food', 'Tech', 'Fashion'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <Package className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">Product Details & Narrative</h2>
              <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Define the product you want to promote and its target category</p>
              {brand && (
                <div className="mt-3 inline-block bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider font-space text-black">
                  ✨ Pre-filled from your Brand Profile
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-3 block">
                  Product Type*
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      updateFormData('productType', 'physical');
                      updateFormData('shippingRequired', true);
                    }}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left transition-all duration-200 font-space",
                      formData.productType === 'physical'
                        ? "border-black bg-blue-50/20 text-neutral-900"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-650"
                    )}
                  >
                    <Package className={cn("h-6 w-6 mb-2", formData.productType === 'physical' ? "text-black" : "text-zinc-400")} />
                    <div className="font-bold text-xs uppercase tracking-wider">Physical Product</div>
                    <p className="text-[10px] text-zinc-550 mt-1 leading-normal">Requires physical shipping to creators (e.g. fashion, devices, cosmetics)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateFormData('productType', 'digital');
                      updateFormData('shippingRequired', false);
                    }}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left transition-all duration-200 font-space",
                      formData.productType === 'digital'
                        ? "border-black bg-blue-50/20 text-neutral-900"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-650"
                    )}
                  >
                    <Sparkles className={cn("h-6 w-6 mb-2", formData.productType === 'digital' ? "text-black" : "text-zinc-400")} />
                    <div className="font-bold text-xs uppercase tracking-wider">Software / Digital</div>
                    <p className="text-[10px] text-zinc-550 mt-1 leading-normal">Accessed via download link, access codes, or licenses</p>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="productName" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                  Product Name*
                </Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="Enter your product name"
                  value={formData.productName}
                  onChange={(e) => updateFormData('productName', e.target.value)}
                  className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                />
              </div>

              <div>
                <Label htmlFor="productLink" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                  Product Link (Optional)
                </Label>
                <Input
                  id="productLink"
                  type="url"
                  placeholder="https://your-product-link.com"
                  value={formData.productLink}
                  onChange={(e) => updateFormData('productLink', e.target.value)}
                  className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                />
              </div>

              <div>
                <Label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                  Campaign Cover Photo (Upload or URL)
                </Label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setCoverMode('upload')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold font-space uppercase tracking-wider transition-colors border",
                      coverMode === 'upload'
                        ? "bg-black text-white border-black"
                        : "bg-zinc-50 text-zinc-650 border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMode('url')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold font-space uppercase tracking-wider transition-colors border",
                      coverMode === 'url'
                        ? "bg-black text-white border-black"
                        : "bg-zinc-50 text-zinc-650 border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    Image URL
                  </button>
                </div>

                {coverMode === 'url' ? (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/cover-image.jpg"
                      value={coverUrlInput}
                      onChange={(e) => {
                        setCoverUrlInput(e.target.value);
                        updateFormData('coverImageUrl', e.target.value);
                        setCoverPreviewUrl(e.target.value);
                      }}
                      className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black text-xs"
                    />
                    <p className="text-[10px] text-zinc-400 uppercase font-space tracking-wider">Provide a high-quality web URL for your campaign cover photo.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-xl p-5 text-center transition-colors bg-zinc-50/50 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={isUploadingCover}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <Image className="h-6 w-6 text-zinc-400 mb-1" />
                        <p className="text-[11px] font-bold font-space uppercase tracking-wider text-zinc-700">
                          {isUploadingCover ? "Uploading Cover..." : "Click or drag to upload cover photo"}
                        </p>
                        <p className="text-[9px] text-zinc-400 font-space uppercase tracking-wider">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  </div>
                )}

                {coverPreviewUrl && (
                  <div className="mt-4 relative rounded-xl overflow-hidden border border-zinc-200 aspect-[16/9] max-h-40 bg-zinc-50">
                    <img
                      src={coverPreviewUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearCoverImage}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur flex items-center justify-center text-white transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="productValue" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                  Product Value (₹)*
                </Label>
                <Input
                  id="productValue"
                  type="text"
                  placeholder="Enter product value"
                  value={formData.productValue}
                  onChange={(e) => updateFormData('productValue', e.target.value)}
                  className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                />
                <p className="text-[10px] text-zinc-400 mt-1 uppercase font-space tracking-wider">This is the retail value of your product</p>
              </div>

              <div>
                <Label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-3 block">
                  Product Category*
                </Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateFormData('category', category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold font-space uppercase tracking-wider transition-colors",
                        formData.category === category
                          ? "bg-black text-white border border-black"
                          : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {formData.productType === 'physical' ? (
                <div>
                  <Label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-3 block">
                    Shipping Details
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                        formData.shippingRequired 
                          ? "border-black bg-blue-50/10" 
                          : "border-zinc-200 hover:border-zinc-350"
                      )}
                      onClick={() => updateFormData('shippingRequired', true)}
                    >
                      <CardContent className="p-6 text-center">
                        <Package className={cn("h-8 w-8 mx-auto mb-3", formData.shippingRequired ? "text-black" : "text-zinc-450")} />
                        <h3 className={cn("text-xs font-bold font-space uppercase tracking-wider mb-2", formData.shippingRequired ? "text-neutral-900" : "text-zinc-700")}>
                          Shipping Required
                        </h3>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          You will send physical products to creators for content creation.
                        </p>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                        !formData.shippingRequired 
                          ? "border-black bg-blue-50/10" 
                          : "border-zinc-200 hover:border-zinc-350"
                      )}
                      onClick={() => updateFormData('shippingRequired', false)}
                    >
                      <CardContent className="p-6 text-center">
                        <X className={cn("h-8 w-8 mx-auto mb-3", !formData.shippingRequired ? "text-black" : "text-zinc-450")} />
                        <h3 className={cn("text-xs font-bold font-space uppercase tracking-wider mb-2", !formData.shippingRequired ? "text-neutral-900" : "text-zinc-700")}>
                          No Shipping
                        </h3>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Creators already own your physical product or buy it locally.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3 text-left">
                  <Info className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold font-space uppercase tracking-wider text-blue-905">Digital Access Delivery</p>
                    <p className="text-[10px] text-blue-800 mt-1 leading-normal">
                      No physical shipping is required. Once you accept a creator, you can share SaaS links, credentials, or licenses on the dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-left flex items-start space-x-2.5">
              <Check className="h-4.5 w-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-emerald-800 font-semibold font-space uppercase tracking-wider leading-relaxed">
                ✓ 100% refund policy: Get a full refund if creators don't deliver or meet quality standards.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <FileText className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">Content Requirements & Guidelines</h2>
              <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Select content format and write clear instructions for creators</p>
            </div>

            {/* Content Formats */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                Choose Content Format per Creator*
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-space">
                {/* 30 seconds Reel Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                    formData.contentType === '30 seconds Reel' 
                      ? "border-black bg-blue-50/10" 
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                  onClick={() => updateFormData('contentType', '30 seconds Reel')}
                >
                  <CardContent className="p-5 relative">
                    <div className="flex items-center justify-between mb-4">
                      <Play className={cn("h-8 w-8", formData.contentType === '30 seconds Reel' ? "text-black" : "text-zinc-400")} />
                      {formData.contentType === '30 seconds Reel' && (
                        <span className="bg-orange-500 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Hot</span>
                      )}
                    </div>
                    <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-2", formData.contentType === '30 seconds Reel' ? "text-neutral-900" : "text-zinc-700")}>
                      30 seconds Reel
                    </h3>
                    <p className="text-[10px] text-zinc-500">Add video log</p>
                  </CardContent>
                </Card>

                {/* Video Story Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                    formData.contentType === 'Video Story' 
                      ? "border-black bg-blue-50/10" 
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                  onClick={() => updateFormData('contentType', 'Video Story')}
                >
                  <CardContent className="p-5">
                    <Play className={cn("h-8 w-8 mb-4", formData.contentType === 'Video Story' ? "text-black" : "text-zinc-400")} />
                    <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-2", formData.contentType === 'Video Story' ? "text-neutral-900" : "text-zinc-700")}>
                      Video Story
                    </h3>
                    <p className="text-[10px] text-zinc-500">Short, engaging video</p>
                  </CardContent>
                </Card>

                {/* Static Post Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                    formData.contentType === 'Static Post' 
                      ? "border-black bg-blue-50/10" 
                      : "border-zinc-200 hover:border-zinc-300"
                  )}
                  onClick={() => updateFormData('contentType', 'Static Post')}
                >
                  <CardContent className="p-5">
                    <Image className={cn("h-8 w-8 mb-4", formData.contentType === 'Static Post' ? "text-black" : "text-zinc-400")} />
                    <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-2", formData.contentType === 'Static Post' ? "text-neutral-900" : "text-zinc-700")}>
                      Static Post
                    </h3>
                    <p className="text-[10px] text-zinc-500">Image or carousel post</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Creator Guidelines */}
            <div className="space-y-6 text-left border-t border-zinc-105 pt-6">
              <div>
                <Label htmlFor="brief" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                  Campaign / Brand Brief*
                </Label>
                <textarea
                  id="brief"
                  rows={4}
                  placeholder="Explain what your brand stands for, what this campaign is about, and the main story you want creators to tell..."
                  value={formData.brief}
                  onChange={(e) => updateFormData('brief', e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-3 shadow-none focus:border-black focus:ring-black text-xs font-sans"
                />
              </div>

              <div>
                <Label htmlFor="keyMessages" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                  Key Messages (One message per line)*
                </Label>
                <textarea
                  id="keyMessages"
                  rows={3}
                  placeholder="e.g. 100% natural and vegan ingredients&#10;Use my promo code CAMPA15 for 15% discount&#10;Delivered in just 15 minutes in Indore"
                  value={formData.keyMessages}
                  onChange={(e) => updateFormData('keyMessages', e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 p-3 shadow-none focus:border-black focus:ring-black text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dos" className="text-[10px] font-bold font-space uppercase tracking-wider text-emerald-700 mb-2 block font-semibold">
                    Do's (What to do)*
                  </Label>
                  <textarea
                    id="dos"
                    rows={4}
                    placeholder="e.g. Show product texture clearly&#10;Show the onboarding process&#10;Keep background minimal and clean"
                    value={formData.dos}
                    onChange={(e) => updateFormData('dos', e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 p-3 shadow-none focus:border-black focus:ring-black text-xs font-sans"
                  />
                </div>

                <div>
                  <Label htmlFor="donts" className="text-[10px] font-bold font-space uppercase tracking-wider text-red-750 mb-2 block font-semibold">
                    Don'ts (What to avoid)*
                  </Label>
                  <textarea
                    id="donts"
                    rows={4}
                    placeholder="e.g. Don't show competitor logos&#10;Don't use low light/blurry video&#10;Don't forget the call-to-action link"
                    value={formData.donts}
                    onChange={(e) => updateFormData('donts', e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 p-3 shadow-none focus:border-black focus:ring-black text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="requiredHashtags" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                  Required Hashtags (Comma separated)*
                </Label>
                <Input
                  id="requiredHashtags"
                  type="text"
                  placeholder="#YourBrand, #Ad, #HealthyLifestyle"
                  value={formData.requiredHashtags}
                  onChange={(e) => updateFormData('requiredHashtags', e.target.value)}
                  className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                />
              </div>

              <div>
                <Label htmlFor="timelineDays" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                  Creator Timeline (Days allowed to post after approval)*
                </Label>
                <Select
                  value={formData.timelineDays}
                  onValueChange={(value) => updateFormData('timelineDays', value)}
                >
                  <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select delivery timeline" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="7">7 Days (Fast turnaround)</SelectItem>
                    <SelectItem value="14">14 Days (Standard)</SelectItem>
                    <SelectItem value="21">21 Days (Detailed product test)</SelectItem>
                    <SelectItem value="30">30 Days (Flexible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="requiresScript"
                  checked={formData.requiresScript ?? true}
                  onCheckedChange={(checked) => updateFormData('requiresScript', !!checked)}
                  className="border-zinc-300 text-black focus:ring-black w-4.5 h-4.5 rounded"
                />
                <div className="grid gap-1 leading-tight">
                  <Label
                    htmlFor="requiresScript"
                    className="text-xs font-bold font-space uppercase tracking-wider text-zinc-700 cursor-pointer"
                  >
                    Require Script Approval
                  </Label>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-space">
                    If checked, creators must submit a script and receive your approval before filming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">Select Target Creator Tiers</h2>
              <p className="text-xs font-space uppercase tracking-wider text-zinc-505">Choose the tier and category of creators for your campaign.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-space">
              {/* Nano creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                  formData.creatorType === 'Nano creators' 
                    ? "border-black bg-blue-50/10" 
                    : "border-zinc-200 hover:border-zinc-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Nano creators');
                  updateFormData('creatorTier', 'micro');
                }}
              >
                <CardContent className="p-5 text-center">
                  <div className="flex justify-center mb-3">
                    <Users className={cn("h-8 w-8", formData.creatorType === 'Nano creators' ? "text-black" : "text-zinc-400")} />
                  </div>
                  <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-1", formData.creatorType === 'Nano creators' ? "text-neutral-900" : "text-zinc-700")}>
                    Nano creators
                  </h3>
                  <p className="text-[10px] text-zinc-450 uppercase mb-2">1K - 10K followers</p>
                  <p className="text-[10px] text-zinc-500 leading-normal">High engagement, authentic content</p>
                </CardContent>
              </Card>

              {/* Micro creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                  formData.creatorType === 'Micro creators' 
                    ? "border-black bg-blue-50/10" 
                    : "border-zinc-200 hover:border-zinc-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Micro creators');
                  updateFormData('creatorTier', 'macro');
                }}
              >
                <CardContent className="p-5 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", formData.creatorType === 'Micro creators' ? "bg-black" : "bg-zinc-250")}>
                      <span className="text-white text-xs font-bold leading-none">+</span>
                    </div>
                  </div>
                  <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-1", formData.creatorType === 'Micro creators' ? "text-neutral-900" : "text-zinc-700")}>
                    Micro creators
                  </h3>
                  <p className="text-[10px] text-zinc-455 uppercase mb-2">10K - 100K followers</p>
                  <p className="text-[10px] text-zinc-500 leading-normal">Balanced reach and engagement</p>
                </CardContent>
              </Card>

              {/* Macro creators */}
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 bg-white border rounded-2xl shadow-none",
                  formData.creatorType === 'Macro creators' 
                    ? "border-black bg-blue-50/10" 
                    : "border-zinc-200 hover:border-zinc-300"
                )}
                onClick={() => {
                  updateFormData('creatorType', 'Macro creators');
                  updateFormData('creatorTier', 'mega');
                }}
              >
                <CardContent className="p-5 text-center">
                  <div className="flex justify-center mb-3">
                    <Star className={cn("h-8 w-8", formData.creatorType === 'Macro creators' ? "text-black" : "text-zinc-400")} />
                  </div>
                  <h3 className={cn("text-xs font-bold uppercase tracking-wider mb-1", formData.creatorType === 'Macro creators' ? "text-neutral-900" : "text-zinc-700")}>
                    Macro creators
                  </h3>
                  <p className="text-[10px] text-zinc-455 uppercase mb-2">100K+ followers</p>
                  <p className="text-[10px] text-zinc-500 leading-normal">Maximum reach and visibility</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 text-left border-t border-zinc-100 pt-6">
              <h3 className="text-xs font-bold font-space uppercase tracking-wider text-zinc-505">Creator Quality</h3>
              <div className="flex flex-wrap gap-3 font-space">
                {['Standard Quality', 'Premium Quality', 'Elite Quality'].map((quality) => (
                  <button
                    key={quality}
                    onClick={() => updateFormData('qualityLevel', quality)}
                    className={cn(
                      "px-5 py-3.5 rounded-2xl border-2 transition-all duration-200 text-left min-w-[140px] flex-1",
                      formData.qualityLevel === quality
                        ? "border-black bg-blue-50/10 text-neutral-900 font-bold"
                        : "border-zinc-200 text-zinc-650 hover:border-zinc-300"
                    )}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">{quality.split(' ')[0]}</div>
                      <div className="text-[9px] uppercase tracking-wider text-zinc-455 mt-1">
                        {quality === 'Standard Quality' && "Budget friendly"}
                        {quality === 'Premium Quality' && "Higher reach"}
                        {quality === 'Elite Quality' && "Top tier ROI"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Automated Creator Matching Section */}
            <div className="space-y-6 mt-8 pt-8 border-t border-zinc-100 text-left">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">
                  Automated Creator Matching
                </h3>
                <p className="text-xs font-space uppercase tracking-wider text-zinc-505">
                  Select creator category to receive AI-powered recommendations
                </p>
              </div>

              {/* Target Category Selection */}
              <div>
                <Label htmlFor="targetCategory" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
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
                  <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select creator category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-xl">
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
                <p className="text-[10px] text-zinc-400 mt-1 uppercase font-space tracking-wider">
                  We'll match you with creators in this category
                </p>
              </div>

              {/* Subcategory Selection */}
              {formData.targetCategory && (
                <div className="animate-fadeIn">
                  <Label htmlFor="targetSubcategory" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                    Target Subcategory (Optional)
                  </Label>
                  <Select
                    value={formData.targetSubcategory || '__any__'}
                    onValueChange={(value) => updateFormData('targetSubcategory', value === '__any__' ? '' : value)}
                  >
                    <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Select subcategory (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] rounded-xl">
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
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-space tracking-wider">
                    Narrow down to specific creator niches for better targeting
                  </p>
                </div>
              )}

              {/* Creator Stats Display */}
              {formData.targetCategory && creatorStats && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 font-space">
                  <div className="flex items-start space-x-3.5">
                    <Info className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <div className="space-y-3 w-full">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                        Available Creators in {formData.targetCategory}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-[10px] uppercase font-bold tracking-wider text-zinc-500 pt-1">
                        <div>
                          <p className="text-zinc-400">Nano (1K-10K)</p>
                          <p className="text-sm font-bold text-neutral-950 mt-0.5">{creatorStats.by_tier?.micro || 0}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400">Micro (10K-100K)</p>
                          <p className="text-sm font-bold text-neutral-950 mt-0.5">{creatorStats.by_tier?.macro || 0}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400">Mega (100K-2M)</p>
                          <p className="text-sm font-bold text-neutral-950 mt-0.5">{creatorStats.by_tier?.mega || 0}</p>
                        </div>
                      </div>
                      <div className="border-t border-zinc-200 pt-2.5 flex justify-between items-center text-[9px] uppercase tracking-wider font-bold text-zinc-450">
                        <span>Avg. Engagement: {creatorStats.avg_engagement?.toFixed(2)}%</span>
                        <span>Avg. Followers: {formatNumber(creatorStats.avg_followers)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <DollarSign className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">Campaign Budget & Commercials</h2>
              <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Set your total investment, pay caps, and view targets</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-space">
              {/* Left Column: Budget Selection & Payout Caps */}
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 block">
                      Campaign Total Budget*
                    </Label>
                    <div className="text-4xl font-bold text-neutral-900 tracking-tight mb-6">
                      {formatCurrency(formData.budget)}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateFormData('budget', option.value)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border",
                            formData.budget === option.value
                              ? "bg-black text-white border-black"
                              : "bg-zinc-50 text-zinc-650 border-zinc-200 hover:bg-zinc-100"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-2">
                      <input
                        type="range"
                        min="5000"
                        max="1000000"
                        step="5000"
                        value={formData.budget}
                        onChange={(e) => updateFormData('budget', e.target.value)}
                        className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#000000]"
                      />
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-zinc-400 font-bold mt-2">
                        <span>₹5K</span>
                        <span>₹10L+</span>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Guarantee */}
                  <div className="border-t border-zinc-100 pt-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label htmlFor="minGuarantee" className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                          Minimum Guarantee per Creator
                        </Label>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-450 block mt-0.5">
                          Fixed amount paid to creator regardless of views (covers raw creation/editing costs)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-neutral-950">₹{parseInt(formData.minGuarantee).toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={formData.minGuarantee}
                      onChange={(e) => updateFormData('minGuarantee', e.target.value)}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#000000]"
                    />
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                      <span>₹0 (No base fee)</span>
                      <span>₹5K</span>
                      <span>₹10K</span>
                    </div>
                  </div>

                  {/* Maximum Payout Cap */}
                  <div className="border-t border-zinc-100 pt-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label htmlFor="maxPayout" className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                          Maximum Payout Cap per Creator*
                        </Label>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-450 block mt-0.5">
                          Hard limit on what one creator can earn (limits brand risk if content goes viral)
                        </span>
                      </div>
                      <span className="text-sm font-bold text-black">₹{parseInt(formData.maxPayout).toLocaleString()}</span>
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
                        if (parseInt(formData.minGuarantee) > parseInt(val)) {
                          updateFormData('minGuarantee', val);
                        }
                      }}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#000000]"
                    />
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                      <span>₹1K</span>
                      <span>₹25K</span>
                      <span>₹50K (High cap)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculations & Estimates */}
              <div className="space-y-6">
                {/* Estimated Reach Card */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider">Estimated Campaign Reach</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Based on standard CPV of 50 Paise</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
                    <div>
                      <span className="text-3xl font-bold text-neutral-950 tracking-tight">
                        {Math.round(parseInt(formData.budget) / 0.50).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1.5">Est. Views</span>
                    </div>
                    <span className="bg-blue-50 border border-blue-100 text-black text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 rounded-full">
                      Subject to Admin Review
                    </span>
                  </div>

                  <div className="flex items-start space-x-2 text-[10px] text-zinc-500 leading-normal pt-1">
                    <Info className="h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                    <p className="uppercase tracking-wider">
                      The platform Admin will set the final CPV rate depending on your niche category and selected creator tiers prior to publication.
                    </p>
                  </div>
                </div>

                {/* Creator Count & Pricing Breakdown */}
                {formData.budget && formData.creatorTier && (
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                    {(() => {
                      const recommendation = getRecommendedCreatorCount(
                        parseInt(formData.budget), 
                        formData.creatorTier as CreatorTier
                      );
                      return (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-neutral-950 text-xs uppercase tracking-wider">Recommended Matching</h4>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                                Targeting {recommendation.pricing.followerRange} followers
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-black tracking-tight">{recommendation.optimal}</span>
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">creators</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-wider">
                            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                              <p className="text-zinc-400">Est. cost per creator</p>
                              <p className="text-sm font-bold text-neutral-950 mt-1">{formatINR(recommendation.pricing.pricePerCreator)}</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                              <p className="text-zinc-400">Max limit count</p>
                              <p className="text-sm font-bold text-neutral-950 mt-1">{recommendation.max} creators</p>
                            </div>
                          </div>

                          <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-zinc-500">Estimated Total Cost:</span>
                            <span className="text-base font-bold text-neutral-950">
                              {formatINR(recommendation.optimal * recommendation.pricing.pricePerCreator)}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Maximum Onboarded Creators Indicator */}
                {formData.budget && formData.maxPayout && (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-left">
                      <Users className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-950 text-xs uppercase tracking-wider">Max Onboarded Creators</p>
                        <p className="text-[9px] text-emerald-700 uppercase tracking-wider mt-0.5">Budget ÷ Max Payout per Creator</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-950">
                        {Math.floor(parseInt(formData.budget) / (parseInt(formData.maxPayout) || 10000)) || 1}
                      </p>
                      <p className="text-[9px] text-emerald-700 uppercase tracking-wider font-bold">Creators Max</p>
                    </div>
                  </div>
                )}

                {/* Flexibility Option */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="budgetFlexible"
                      checked={formData.budgetFlexible}
                      onCheckedChange={(checked) => updateFormData('budgetFlexible', checked as boolean)}
                      className="mt-0.5 border-zinc-300 text-black focus:ring-black"
                    />
                    <div className="grid gap-0.5">
                      <label htmlFor="budgetFlexible" className="text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer">
                        Budget Flexibility
                      </label>
                      <p className="text-[10px] text-zinc-455 uppercase tracking-wider leading-relaxed">
                        Allow minor budget adjustments to onboard optimal creators matching your niche.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <Check className="h-6 w-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase mb-2">Review & Launch</h2>
              <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Double check your campaign details before launching matching queue</p>
            </div>

            <div className="space-y-6 font-space">
              {/* Product Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
                  <Package className="h-4.5 w-4.5 text-black" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">1. Product & Narrative</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-zinc-400 block">Product Name</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.productName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Product Type</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.productType || '-'}</span>
                  </div>
                  {formData.productLink && (
                    <div className="md:col-span-2">
                      <span className="text-zinc-400 block">Product Link</span>
                      <a href={formData.productLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-black hover:underline mt-1 block truncate normal-case">
                        {formData.productLink}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-400 block">Retail Value</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">₹{formData.productValue || '-'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Shipping Required</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.shippingRequired ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Category</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.category || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Requirements & Brief Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
                  <FileText className="h-4.5 w-4.5 text-black" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">2. Guidelines & Brief</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-zinc-400 block">Content Format</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.contentType || '-'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Submission Timeline</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.timelineDays} Days after approval</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-zinc-400 block">Script Approval Required</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{(formData.requiresScript ?? true) ? 'Yes (Mandatory script review)' : 'No'}</span>
                  </div>
                  <div className="md:col-span-2 border-t border-zinc-100 pt-4">
                    <span className="text-zinc-400 block mb-1">Campaign Brief</span>
                    <p className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl text-xs font-sans text-zinc-700 italic normal-case font-normal whitespace-pre-wrap leading-relaxed">
                      {formData.brief || '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-zinc-400 block mb-1">Key Messages</span>
                    <p className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl text-xs font-sans text-zinc-700 normal-case font-normal whitespace-pre-wrap leading-relaxed">
                      {formData.keyMessages || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-emerald-700 block mb-1">Do's</span>
                    <p className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-xl text-xs font-sans text-emerald-905 normal-case font-normal whitespace-pre-wrap leading-relaxed">
                      {formData.dos || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-red-750 block mb-1">Don'ts</span>
                    <p className="bg-red-50/30 border border-red-100 p-4 rounded-xl text-xs font-sans text-red-905 normal-case font-normal whitespace-pre-wrap leading-relaxed">
                      {formData.donts || '-'}
                    </p>
                  </div>
                  <div className="md:col-span-2 border-t border-zinc-100 pt-4">
                    <span className="text-zinc-400 block mb-1">Required Hashtags</span>
                    <span className="text-xs font-mono text-neutral-955 bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-lg inline-block normal-case font-medium">
                      {formData.requiredHashtags || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator Tiers Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
                  <Users className="h-4.5 w-4.5 text-black" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">3. Target Creator Tiers & Niche</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-zinc-400 block">Creator Tier</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.creatorTier || '-'} ({formData.creatorType})</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Quality Level</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.qualityLevel || '-'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-405 block">Target Category</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.targetCategory || '-'}</span>
                  </div>
                  {formData.targetSubcategory && (
                    <div>
                      <span className="text-zinc-405 block">Niche Subcategory</span>
                      <span className="text-xs font-bold text-neutral-955 mt-1 block">{formData.targetSubcategory}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget & Payouts Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-zinc-100 pb-3">
                  <DollarSign className="h-4.5 w-4.5 text-black" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">4. Budget & Payout Rules</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-zinc-400 block">Total Budget</span>
                    <span className="text-sm font-bold text-neutral-955 mt-1 block">{formatCurrency(formData.budget)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Cost Per View (CPV)</span>
                    <span className="text-xs font-bold text-black mt-1 block">Pending Review (Admin set)</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Min Guarantee per Creator</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">₹{parseInt(formData.minGuarantee).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Max Payout cap per Creator</span>
                    <span className="text-xs font-bold text-neutral-955 mt-1 block">₹{parseInt(formData.maxPayout).toLocaleString()}</span>
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
    <div className="min-h-screen bg-grid-dots flex flex-col font-sans pb-12 text-left">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200/80 px-4 md:px-8 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black">
              <span className="text-white font-space font-bold text-base leading-none">+</span>
            </div>
            <div>
              <span className="text-xl font-bold font-space text-black tracking-tight">
                Campayn<span className="text-black font-sans font-light ml-0.5">+</span>
              </span>
              <div className="text-[10px] text-zinc-400 font-space uppercase tracking-wider font-bold">Influencer Portal</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {brand && (
              <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-wider font-space font-semibold text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-full">
                <span>Welcome, {brand.brand_name}</span>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-secondary-pill py-1.5 px-3.5 text-[10px] h-8 flex items-center"
            >
              Exit Wizard
            </button>
          </div>
        </div>
      </header>

      {/* Step progress timeline */}
      <div className="bg-white border-b border-zinc-200/80 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-250" />
            {/* Active Highlight Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
            
            {[
              { number: 1, name: 'Product' },
              { number: 2, name: 'Guidelines' },
              { number: 3, name: 'Creators' },
              { number: 4, name: 'Budget' },
              { number: 5, name: 'Review' },
            ].map((step) => {
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-space text-xs font-bold transition-all duration-200 border-2",
                      isCompleted 
                        ? "bg-black border-black text-white"
                        : isActive
                          ? "bg-white border-black text-black ring-4 ring-blue-50"
                          : "bg-white border-zinc-200 text-zinc-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span 
                    className={cn(
                      "absolute top-10 whitespace-nowrap text-[9px] font-bold font-space uppercase tracking-wider",
                      isActive ? "text-black" : isCompleted ? "text-black" : "text-zinc-400"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl">
              <CardContent className="p-6 md:p-8">
                {!brand ? (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase">Complete Your Brand Profile</h2>
                      <p className="mt-1.5 text-xs font-space uppercase tracking-wider text-zinc-500">Let's set up your brand information to get started with campaigns.</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="brand_name" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                          Brand Name*
                        </Label>
                        <Input
                          id="brand_name"
                          type="text"
                          placeholder="Enter your brand name"
                          value={brandFormData.brand_name}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                          className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand_website" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 mb-2 block">
                          Brand Website*
                        </Label>
                        <Input
                          id="brand_website"
                          type="url"
                          placeholder="https://yourbrand.com"
                          value={brandFormData.brand_website}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_website: e.target.value }))}
                          className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                        />
                      </div>

                      <div>
                        <Label htmlFor="social_handles" className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-505 mb-2 block">
                          Social Handles (Optional)
                        </Label>
                        <Input
                          id="social_handles"
                          type="text"
                          placeholder="@yourbrand, @other_handle"
                          value={brandFormData.social_handles}
                          onChange={(e) => setBrandFormData(prev => ({ ...prev, social_handles: e.target.value }))}
                          className="w-full h-11 rounded-xl border-zinc-200 focus:border-black focus:ring-black"
                        />
                      </div>

                      <button 
                        onClick={handleCreateProfile} 
                        disabled={isCreatingProfile}
                        className="w-full btn-primary-pill py-3 h-auto"
                      >
                        {isCreatingProfile ? 'Creating Profile...' : 'Create Brand Profile'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {renderStep()}
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100">
                      <button
                        onClick={prevStep}
                        className="btn-secondary-pill flex items-center h-10 px-6"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {currentStep === 1 ? 'Back to Dashboard' : 'Back'}
                      </button>

                      {currentStep < 5 ? (
                        <button
                          onClick={nextStep}
                          disabled={!isStepValid(currentStep)}
                          className={cn(
                            "btn-primary-pill flex items-center h-10 px-6",
                            !isStepValid(currentStep) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="btn-primary-pill flex items-center h-10 px-6 bg-black hover:bg-blue-700 border-transparent text-white"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-zinc-200/80 shadow-none rounded-2xl sticky top-24">
              <CardHeader className="border-b border-zinc-100 pb-4">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-450">Budget</span>
                  <span className="text-sm font-bold font-space">{summary.budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-455">Estimated Creators</span>
                  <span className="text-sm font-bold font-space">{summary.estimatedCreators}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-455">Content Format</span>
                  <span className="text-sm font-semibold text-zinc-800 truncate max-w-[120px]" title={formData.contentType}>{formData.contentType || 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-455">Creator Quality</span>
                  <span className="text-sm font-semibold text-zinc-800">{summary.creatorQuality}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold font-space uppercase tracking-wider text-zinc-455">Target Niche</span>
                  <span className="text-sm font-semibold text-zinc-800">{formData.targetCategory || 'Not selected'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Processing Modal */}
      {showAIProcessing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] rounded-3xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-300 border border-zinc-800/60 shadow-[0_0_50px_rgba(0,102,255,0.15)] text-left">
            <div className="text-center font-space">
              {/* Spinner */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-black/10 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
                <div className="absolute inset-2 border-2 border-dashed border-black rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black animate-pulse" />
                </div>
              </div>

              {/* Stage Title */}
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 font-space">
                {aiProcessingStage === 5 ? 'Matching Complete' : 'AI Engine Search'}
              </h3>
              
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-6 min-h-[48px] flex items-center justify-center font-bold px-4 leading-normal font-space">
                {aiProcessingStage === 0 && "Analyzing campaign parameters..."}
                {aiProcessingStage === 1 && "Querying database of 37,000+ creators..."}
                {aiProcessingStage === 2 && "Filtering by categories and location fit..."}
                {aiProcessingStage === 3 && "Evaluating engagement quality score..."}
                {aiProcessingStage === 4 && "Finalizing curated matching recommendation list..."}
                {aiProcessingStage === 5 && "Creators matched successfully!"}
              </p>

              {/* Progress Line */}
              <div className="w-full bg-zinc-900 rounded-full h-1 mb-4 overflow-hidden border border-zinc-800">
                <div 
                  className="bg-black h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((aiProcessingStage + 1) / 6) * 100}%` }}
                ></div>
              </div>

              {/* Stage Indicators */}
              <div className="flex justify-center space-x-2.5 mb-6">
                {[0, 1, 2, 3, 4, 5].map((stage) => (
                  <div
                    key={stage}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      stage <= aiProcessingStage 
                        ? "bg-black scale-110 shadow-[0_0_8px_#000000]" 
                        : "bg-zinc-800"
                    )}
                  />
                ))}
              </div>

              {/* Insight Box */}
              <div className="bg-[#18181b] border border-zinc-800/80 rounded-2xl p-4 text-left">
                <p className="text-[9px] text-black font-bold uppercase tracking-wider font-space">
                  ⚡ ENGINE LOG
                </p>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-semibold leading-relaxed font-mono">
                  {aiProcessingStage === 0 && "> initializing parameter matrices..."}
                  {aiProcessingStage === 1 && "> executing full index scan on indexed pools..."}
                  {aiProcessingStage === 2 && "> pruning non-matching sectors and tiers..."}
                  {aiProcessingStage === 3 && "> normalizing audit scores for audience segments..."}
                  {aiProcessingStage === 4 && "> rank-sorting candidates based on alignment..."}
                  {aiProcessingStage === 5 && "> compilation done. loading matched dashboard..."}
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