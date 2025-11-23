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
import { ArrowLeft, ArrowRight, Check, DollarSign, Video, Users, Package, FileText, Info, Play, Image, Zap, Star, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

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
}

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, brand } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  });

  const updateFormData = (field: keyof CampaignFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

      console.log('Form data:', formData);
      console.log('User:', user.id);
      console.log('Brand:', brand.id);

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
          phase: 'creator_selection',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        })
        .select()
        .single();

      if (campaignError) {
        console.error('Campaign creation error:', campaignError);
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
        console.error('Activity logging error:', activityError);
        // Don't throw error here, as campaign was created successfully
      }

      // Show success message
      toast({
        title: "Campaign Created Successfully!",
        description: "Your campaign has entered the creator selection phase. You'll be notified when creators are recommended.",
        duration: 5000,
      });

      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting campaign:', error);
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
        return formData.creatorType !== '' && formData.qualityLevel !== '';
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
                onClick={() => updateFormData('creatorType', 'Nano creators')}
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
                onClick={() => updateFormData('creatorType', 'Micro creators')}
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
                onClick={() => updateFormData('creatorType', 'Macro creators')}
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
    </div>
  );
};

export default CampaignForm;