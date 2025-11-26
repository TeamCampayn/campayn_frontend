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
import { ArrowLeft, ArrowRight, Check, DollarSign, Video, Users, Package, FileText, Info, Play, Image, Zap, Star, X, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { getApiUrl } from '../lib/api';
import { calculateAffordableCreators, getRecommendedCreatorCount, formatINR, CREATOR_PRICING, type CreatorTier } from '../lib/pricing';

interface CampaignFormData {
  budget: string;
  contentType: string;
  creatorType: string;
  qualityLevel: string;
  productName: string;
  productLink: string;
  productValue: string;
  category: string;
  shippingRequired: boolean;
  budgetFlexible: boolean;
  targetCategory: string;
  targetSubcategory: string;
  creatorTier: string;
}

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, brand } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIProcessing, setShowAIProcessing] = useState(false);
  const [aiProcessingStage, setAIProcessingStage] = useState(0);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    budget: '50000',
    contentType: '',
    creatorType: '',
    qualityLevel: '',
    productName: '',
    productLink: '',
    productValue: '',
    category: '',
    shippingRequired: false,
    budgetFlexible: false,
    targetCategory: '',
    targetSubcategory: '',
    creatorTier: '',
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

      if (!brand) {
        toast({
          title: "Brand Profile Required",
          description: "Please complete your brand profile first.",
          variant: "destructive",
        });
        return;
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
      
      // Create campaign in database (updated for new multi-phase system)
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          brand_id: brand.id,
          campaign_name: `${formData.productName || 'Untitled'} Campaign`,
          description: `Content: ${formData.contentType}, Creator: ${formData.creatorType}, Quality: ${formData.qualityLevel}. Product: ${formData.productName}${formData.productLink ? `. Link: ${formData.productLink}` : ''}`,
          budget: parseInt(formData.budget) || 0,
          campaign_objectives: ['Brand Awareness', 'Product Marketing'],
          requirements: `Content Type: ${formData.contentType}, Creator Type: ${formData.creatorType}, Quality Level: ${formData.qualityLevel}${formData.shippingRequired ? '. Shipping required.' : ''}`,
          deliverables: {
            content_type: formData.contentType,
            creator_type: formData.creatorType,
            quality_level: formData.qualityLevel,
            product_name: formData.productName,
            shipping_required: formData.shippingRequired
          },
          // NEW: Automated recommendation fields with budget-based calculation
          target_category: formData.targetCategory,
          target_subcategory: formData.targetSubcategory || null,
          creator_type: formData.creatorTier,
          target_creators_count: budgetRecommendation.optimal,
          // Pricing fields (separate columns)
          estimated_cost_per_creator: budgetRecommendation.pricing.pricePerCreator,
          max_affordable_creators: budgetRecommendation.max,
          actual_creators_selected: 0,
          // END NEW
          phase: 'creator_selection',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        })
        .select()
        .single();

      if (campaignError) {
        throw new Error('Failed to create campaign');
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

      // AUTO-GENERATE CREATOR RECOMMENDATIONS WITH AI ANIMATION
      if (formData.targetCategory) {
        
        // Show AI processing animation
        setShowAIProcessing(true);
        setAIProcessingStage(0);
        
        const stages = [
          { stage: 0, text: "Analyzing campaign requirements...", duration: 800 },
          { stage: 1, text: "Searching creator database...", duration: 1000 },
          { stage: 2, text: "AI matching creators to your criteria...", duration: 1200 },
          { stage: 3, text: "Calculating engagement scores...", duration: 1000 },
          { stage: 4, text: "Finalizing recommendations...", duration: 800 }
        ];
        
        // Animate through stages
        for (let i = 0; i < stages.length; i++) {
          await new Promise(resolve => setTimeout(() => {
            setAIProcessingStage(stages[i].stage);
            resolve(true);
          }, stages[i].duration));
        }
        
        try {
          const recsResponse = await fetch(
            getApiUrl(`/api/campaigns/${campaignData.id}/generate-recommendations`),
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ autoApprove: false })
            }
          );
          
          const recsData = await recsResponse.json();
          
          if (recsData.success) {
            setAIProcessingStage(5); // Success stage
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Navigate to campaign detail page
            navigate(`/dashboard/campaigns/${campaignData.id}`);
          } else {
            setShowAIProcessing(false);
            toast({
              title: "Campaign Created Successfully!",
              description: "Your campaign has been created. We'll recommend creators shortly.",
              duration: 5000,
            });
            navigate('/dashboard');
          }
        } catch (recError) {
          setShowAIProcessing(false);
          toast({
            title: "Campaign Created Successfully!",
            description: "Your campaign has been created. We'll recommend creators shortly.",
            duration: 5000,
          });
          navigate('/dashboard');
        }
      } else {
        // No category selected, fallback
        toast({
          title: "Campaign Created Successfully!",
          description: "Your campaign has been created.",
          duration: 5000,
        });
        navigate('/dashboard');
      }
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your campaign. Please try again.",
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
        return formData.budget !== '';
      case 2:
        return formData.contentType !== '';
      case 3:
        return formData.creatorType !== '' && formData.creatorTier !== '' && formData.qualityLevel !== '' && formData.targetCategory !== '';
      case 4:
        return formData.productName !== '' && formData.productLink !== '' && formData.category !== '';
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose campaign budget</h2>
              <p className="text-gray-600 text-lg">Set your investment for maximum impact</p>
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
                      Current: {formatCurrency(formData.budget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="budgetFlexible"
                  checked={formData.budgetFlexible}
                  onCheckedChange={(checked) => updateFormData('budgetFlexible', checked as boolean)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="budgetFlexible" className="text-sm font-medium text-gray-900 cursor-pointer">
                    My budget is slightly flexible (this will allow you to get more creators in your campaign)
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
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

            <div className="space-y-6">
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
                  Product Link*
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
                <p className="text-sm text-gray-500 mt-1">This is the retail value of your product</p>
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
                      <h3 className={cn("font-semibold mb-2", formData.shippingRequired ? "text-blue-900" : "text-gray-900")}>
                        Shipping Required
                      </h3>
                      <p className="text-sm text-gray-600">
                        You'll send physical products to creators for review and content creation.
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
                      <h3 className={cn("font-semibold mb-2", !formData.shippingRequired ? "text-blue-900" : "text-gray-900")}>
                        No Shipping
                      </h3>
                      <p className="text-sm text-gray-600">
                        Digital product or service that doesn't require physical shipping.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                100% refund policy: Get a full refund if creators don't deliver or meet quality standards.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Submit Campaign</h2>
              <p className="text-gray-600 text-lg">Review your campaign details and submit to receive quotations from creators.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-lg font-semibold">{formatCurrency(formData.budget)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Content Types</p>
                  <p className="text-lg font-semibold">{formData.contentType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Creator Categories</p>
                  <p className="text-lg font-semibold">{formData.creatorType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Creator Quality</p>
                  <p className="text-lg font-semibold">{formData.qualityLevel || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product</p>
                  <p className="text-lg font-semibold">{formData.productName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Category</p>
                  <p className="text-lg font-semibold">{formData.category || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Value</p>
                  <p className="text-lg font-semibold">{formData.productValue ? `₹${formData.productValue}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Shipping Required</p>
                  <p className="text-lg font-semibold">{formData.shippingRequired ? 'Yes' : 'No'}</p>
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
    return {
      budget: formData.budget ? formatCurrency(formData.budget) : 'Not set',
      estimatedCreators: formData.creatorType ? '1' : 'Not selected',
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
                {Array.from({ length: 5 }).map((_, index) => (
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

                  {currentStep < 5 ? (
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
                      {isSubmitting ? 'Submitting...' : 'Send quotations'}
                    </Button>
                  )}
                </div>
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