
import { useState } from 'react'
import { Header } from './components/Header'
import { InfoBar } from './components/InfoBar'
import { CampaignBudget } from './components/CampaignBudget'
import { ContentRequirements } from './components/ContentRequirements'
import { CreatorSelection } from './components/CreatorSelection'
import { ShippingDetails } from './components/ShippingDetails'
import { ExpectationSection } from './components/ExpectationSection'
import { OrderingGuidelines } from './components/OrderingGuidelines'
import { OrderSummary } from './components/OrderSummary'

interface CampaignData {
  budget: number;
  flexibleBudget: boolean;
  contentTypes: string[];
  addEdits: boolean;
  categories: string[];
  quality: number;
  shippingRequired: boolean;
  productName: string;
  productLink: string;
  retailValue: number;
  discountApplied: boolean;
  productCategory: string;
  creatorCategories: string[];
  creatorQuality: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    budget: 25000,
    flexibleBudget: false,
    contentTypes: ['reel'],
    addEdits: false,
    categories: ['fashion'],
    quality: 3,
    shippingRequired: true,
    productName: '',
    productLink: '',
    retailValue: 0,
    discountApplied: false,
    productCategory: '',
    creatorCategories: [],
    creatorQuality: ''
  })

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }))
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header currentStep={currentStep} />
      <InfoBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2 space-y-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✨</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Create your campaign
                  </h1>
                  <p className="text-gray-600 mt-1">Build something amazing with creators</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                  Step {currentStep} of 4
                </div>
              </div>
            </div>

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
              <ShippingDetails 
                data={campaignData} 
                updateData={updateCampaignData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            <ExpectationSection />
            <OrderingGuidelines />
          </div>

          <div className="col-span-1">
            <OrderSummary campaignData={campaignData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
