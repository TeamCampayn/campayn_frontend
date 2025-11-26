
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Check } from "lucide-react";
import { useCampaignForm } from "@/contexts/CampaignFormContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const OrderSummarySidebar = () => {
  const { formData, isSubmitting } = useCampaignForm();
  const { user, brand, createBrandProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const pricing = formData.creators;
  const totalCost = 
    pricing.micro.count * pricing.micro.price +
    pricing.medium.count * pricing.medium.price +
    pricing.large.count * pricing.large.price;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to place an order',
        variant: 'destructive',
      });
      return;
    }

    let effectiveBrandId = brand?.id as string | undefined;

    if (!effectiveBrandId) {
      try {
        toast({
          title: 'Creating brand profile…',
          description: 'Setting up a minimal profile so you can continue',
        });

        const defaultBrandName = user.email?.split('@')[0] || 'Brand';
        const { error: createError } = await createBrandProfile({
          brand_name: defaultBrandName,
          brand_website: '',
          social_handles: '',
          niches: [],
        });

        if (createError) {
          throw createError;
        }

        // Fetch the newly created brand id to proceed safely
        const { data: createdBrand, error: fetchBrandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (fetchBrandError || !createdBrand) {
          throw fetchBrandError || new Error('Brand not found after creation');
        }

        effectiveBrandId = createdBrand.id;
      } catch (e) {
        console.error('Auto brand creation failed:', e);
        toast({
          title: 'Brand Profile Required',
          description: 'Please complete your brand profile on the dashboard',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }
    }

    // Validate required fields
    if (!formData.campaignName) {
      toast({
        title: 'Campaign Name Required',
        description: 'Please enter a campaign name',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: 'Category Required',
        description: 'Please select a category for your campaign',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          brand_id: effectiveBrandId,
          campaign_name: formData.campaignName || 'New Campaign',
          campaign_type: formData.category,
          campaign_description: formData.campaignDescription || '',
          tagline: formData.tagline || '',
          budget: formData.budget,
          content_types: formData.contentTypes,
          creator_category: formData.category,
          creator_tier: formData.quality,
          status: 'draft'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create quotation
      const { error: quotationError } = await supabase
        .from('quotations')
        .insert({
          campaign_id: campaign.id,
          brand_id: effectiveBrandId,
          total_cost: totalCost,
          creator_count: pricing.micro.count + pricing.medium.count + pricing.large.count,
          estimated_reach: Math.floor(totalCost * 100), // Rough estimate
          status: 'pending',
          notes: `Budget: ₹${formData.budget.toLocaleString()}, Duration: ${formData.duration} days, Quality: ${formData.quality}`
        });

      if (quotationError) throw quotationError;

      toast({
        title: 'Order Placed Successfully!',
        description: 'Your campaign quotation has been submitted for review',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Select creator package & place order
        </h2>
        <p className="text-sm text-slate-600">
          Live pricing based on your selections
        </p>
      </div>

      {/* Input Summary */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Campaign:</span>
          <span className="font-medium">{formData.campaignName || 'Not entered'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Budget:</span>
          <span className="font-medium">₹{formData.budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Duration:</span>
          <span className="font-medium">{formData.duration} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Category:</span>
          <span className="font-medium">{formData.category || 'Not selected'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Quality:</span>
          <span className="font-medium">{formData.quality || 'Not selected'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping:</span>
          <span className="font-medium">Required</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Pricing Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-blue-900">Micro creators</span>
              <p className="text-xs text-blue-700">{pricing.micro.count} creators</p>
            </div>
            <span className="font-semibold text-blue-900">
              ₹{(pricing.micro.count * pricing.micro.price).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-green-900">Medium creators</span>
              <p className="text-xs text-green-700">{pricing.medium.count} creators</p>
            </div>
            <span className="font-semibold text-green-900">
              ₹{(pricing.medium.count * pricing.medium.price).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-purple-900">Large creators</span>
              <p className="text-xs text-purple-700">{pricing.large.count} creators</p>
            </div>
            <span className="font-semibold text-purple-900">
              ₹{(pricing.large.count * pricing.large.price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Green Badge */}
      <Badge className="w-full justify-center bg-green-100 text-green-800 hover:bg-green-100 py-2">
        <Check className="h-4 w-4 mr-2" />
        Receive minimum 50 creator options
      </Badge>

      {/* Primary CTA */}
      <Button 
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className="w-full bg-[#7C3AED] hover:bg-[#6d28d9] text-white font-semibold py-3 text-base disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Placing Order...</span>
          </div>
        ) : (
          `Place order @ ₹${totalCost.toLocaleString()}`
        )}
      </Button>

      {/* Secondary Actions */}
      <div className="flex flex-col space-y-2 text-center">
        <button className="flex items-center justify-center space-x-2 text-[#7C3AED] hover:text-[#6d28d9] text-sm font-medium">
          <FileText className="h-4 w-4" />
          <span>View price breakup</span>
        </button>
        <button className="flex items-center justify-center space-x-2 text-[#7C3AED] hover:text-[#6d28d9] text-sm font-medium">
          <Download className="h-4 w-4" />
          <span>Download proposal</span>
        </button>
      </div>
    </div>
  );
};

export default OrderSummarySidebar;
