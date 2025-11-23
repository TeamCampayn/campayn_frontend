import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CampaignFormData {
  // Budget & Duration
  budget: number;
  duration: number;
  
  // Content Types
  contentTypes: string[];
  
  // Category
  category: string;
  
  // Quality
  quality: string;
  
  // Creators
  creators: {
    micro: { count: number; price: number };
    medium: { count: number; price: number };
    large: { count: number; price: number };
  };
  
  // Product Details
  productName: string;
  productDescription: string;
  productWebsite: string;
  productFeatures: string[];
  launchStatus: string;
  shippingDetails: string;
  
  // Campaign Details
  campaignName: string;
  campaignDescription: string;
  tagline: string;
  
  // Audience Details
  idealAudience: string;
  targetStates: string[];
  ageRangeMin: number;
  ageRangeMax: number;
  
  // Guidelines
  guidelines: string;
  refundPolicy: string;
}

interface CampaignFormContextType {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
  resetForm: () => void;
  submitCampaign: () => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

const CampaignFormContext = createContext<CampaignFormContextType | undefined>(undefined);

export const useCampaignForm = () => {
  const context = useContext(CampaignFormContext);
  if (context === undefined) {
    throw new Error('useCampaignForm must be used within a CampaignFormProvider');
  }
  return context;
};

const initialFormData: CampaignFormData = {
  budget: 25000,
  duration: 30,
  contentTypes: [],
  category: '',
  quality: 'mass',
  creators: {
    micro: { count: 25, price: 3900 },
    medium: { count: 13, price: 7400 },
    large: { count: 8, price: 14200 }
  },
  productName: '',
  productDescription: '',
  productWebsite: '',
  productFeatures: [],
  launchStatus: '',
  shippingDetails: '',
  campaignName: '',
  campaignDescription: '',
  tagline: '',
  idealAudience: '',
  targetStates: [],
  ageRangeMin: 18,
  ageRangeMax: 65,
  guidelines: '',
  refundPolicy: ''
};

interface CampaignFormProviderProps {
  children: ReactNode;
}

export const CampaignFormProvider: React.FC<CampaignFormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const submitCampaign = async (): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    
    try {
      // This will be implemented to save to database
      console.log('Submitting campaign:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting campaign:', error);
      return { success: false, error: 'Failed to submit campaign' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    formData,
    updateFormData,
    resetForm,
    submitCampaign,
    isSubmitting
  };

  return (
    <CampaignFormContext.Provider value={value}>
      {children}
    </CampaignFormContext.Provider>
  );
};
