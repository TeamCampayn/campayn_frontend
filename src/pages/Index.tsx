
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { CampaignBudget } from "../components/CampaignBudget";
import { ContentRequirements } from "../components/ContentRequirements";
import { CreatorSelection } from "../components/CreatorSelection";
import { ProductDetails } from "../components/ProductDetails";
import { CampaignSummary } from "../components/CampaignSummary";

export interface CampaignData {
  budget: number;
  contentTypes: string[];
  creatorCategories: string[];
  creatorQuality: string;
  productName: string;
  productLink: string;
  productValue: number;
  productCategory: string;
  shippingRequired: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    budget: 0,
    contentTypes: [],
    creatorCategories: [],
    creatorQuality: "",
    productName: "",
    productLink: "",
    productValue: 0,
    productCategory: "",
    shippingRequired: false,
  });

  const updateCampaignData = (data: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitCampaign = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://mailing-service-zeta.vercel.app/api/generic-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignData,
          type: 'campaign_submission',
          subject: 'New Campaign Submission - Send Quotations',
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Failed to submit campaign');
      }
    } catch (error) {
      console.error('Campaign submission error:', error);
      alert('Failed to submit campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header currentStep={currentStep} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <CampaignBudget
                  data={campaignData}
                  updateData={updateCampaignData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <ContentRequirements
                  data={campaignData}
                  updateData={updateCampaignData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <CreatorSelection
                  data={campaignData}
                  updateData={updateCampaignData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 4 && (
                <ProductDetails
                  data={campaignData}
                  updateData={updateCampaignData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 5 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit Campaign</h2>
                  <p className="text-gray-600 mb-8">Review your campaign details and submit to receive quotations from creators.</p>
                  
                  <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div><strong>Budget:</strong> ${campaignData.budget}</div>
                    <div><strong>Content Types:</strong> {campaignData.contentTypes.join(', ')}</div>
                    <div><strong>Creator Categories:</strong> {campaignData.creatorCategories.join(', ')}</div>
                    <div><strong>Creator Quality:</strong> {campaignData.creatorQuality}</div>
                    <div><strong>Product:</strong> {campaignData.productName}</div>
                    <div><strong>Product Category:</strong> {campaignData.productCategory}</div>
                    <div><strong>Product Value:</strong> ${campaignData.productValue}</div>
                    <div><strong>Shipping Required:</strong> {campaignData.shippingRequired ? 'Yes' : 'No'}</div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={submitCampaign}
                      disabled={isSubmitting}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send quotations'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <CampaignSummary data={campaignData} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
