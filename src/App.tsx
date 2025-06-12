
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
}

function App() {
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
    productCategory: ''
  })

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }))
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <InfoBar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">Create your campaign</h1>
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Step 1 updated
                </div>
              </div>
            </div>

            <CampaignBudget 
              campaignData={campaignData} 
              updateCampaignData={updateCampaignData} 
            />

            <ContentRequirements 
              campaignData={campaignData} 
              updateCampaignData={updateCampaignData}
              toggleArrayItem={toggleArrayItem}
            />

            <CreatorSelection 
              campaignData={campaignData} 
              updateCampaignData={updateCampaignData}
              toggleArrayItem={toggleArrayItem}
            />

            <ShippingDetails 
              campaignData={campaignData} 
              updateCampaignData={updateCampaignData} 
            />

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
