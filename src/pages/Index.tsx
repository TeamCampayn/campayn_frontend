
import { useState } from "react";
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
  const [currentStep, setCurrentStep] = useState(1);
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Created Successfully!</h2>
                  <p className="text-gray-600 mb-8">Your campaign has been created and is ready to go live. You can now start connecting with creators.</p>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setCampaignData({
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
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Another Campaign
                  </button>
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
