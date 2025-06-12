
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Package, Link, DollarSign } from 'lucide-react'

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

const steps = [
  'Campaign Budget',
  'Content Requirements', 
  'Creator Selection',
  'Product & Shipping',
  'Review & Order'
]

const contentTypeOptions = [
  'Instagram Post', 'Instagram Reel', 'Instagram Story', 
  'YouTube Video', 'TikTok Video', 'Blog Post'
]

const categoryOptions = [
  'Fashion', 'Lifestyle', 'Beauty', 'Tech', 'Food', 
  'Travel', 'Fitness', 'Home & Decor'
]

const productCategories = [
  'Beauty', 'Fashion', 'Tech', 'Home', 'Food', 'Health', 'Books', 'Other'
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [campaignData, setCampaignData] = useState<CampaignData>({
    budget: 15000,
    flexibleBudget: false,
    contentTypes: [],
    addEdits: false,
    categories: [],
    quality: 3,
    shippingRequired: false,
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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return campaignData.budget > 0
      case 1: return campaignData.contentTypes.length > 0
      case 2: return campaignData.categories.length > 0
      case 3: return campaignData.productName && campaignData.productLink && campaignData.retailValue > 0
      default: return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-gray-900">Set your campaign budget</h2>
              <p className="text-gray-600">Choose a budget that works for your goals</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <div className="text-4xl font-light text-blue-600 mb-2">
                  ₹{campaignData.budget.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Campaign Budget</div>
              </div>
              
              <Slider
                value={[campaignData.budget]}
                onValueChange={(value) => updateCampaignData({ budget: value[0] })}
                max={50000}
                min={5000}
                step={1000}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹5,000</span>
                <span>₹50,000+</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <Label htmlFor="flexible" className="text-sm">My budget is slightly flexible</Label>
                <Switch
                  id="flexible"
                  checked={campaignData.flexibleBudget}
                  onCheckedChange={(checked) => updateCampaignData({ flexibleBudget: checked })}
                />
              </div>
              
              <div className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 Need help determining your budget? Our team can assist you in finding the perfect range.
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-gray-900">Content requirements per creator</h2>
              <p className="text-gray-600">Select the type of content you need</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {contentTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateCampaignData({ 
                      contentTypes: toggleArrayItem(campaignData.contentTypes, type) 
                    })}
                    className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                      campaignData.contentTypes.includes(type)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <Label htmlFor="edits" className="text-sm font-medium">Add edits via us</Label>
                  <p className="text-xs text-gray-600">We'll handle content revisions for you</p>
                </div>
                <Switch
                  id="edits"
                  checked={campaignData.addEdits}
                  onCheckedChange={(checked) => updateCampaignData({ addEdits: checked })}
                />
              </div>
              
              {campaignData.contentTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {campaignData.contentTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800">
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-gray-900">Choose creator categories</h2>
              <p className="text-gray-600">Select the niches that align with your brand</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => updateCampaignData({ 
                      categories: toggleArrayItem(campaignData.categories, category) 
                    })}
                    className={`p-4 rounded-lg border-2 transition-all text-sm font-medium ${
                      campaignData.categories.includes(category)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium">Creator quality preference</Label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateCampaignData({ quality: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= campaignData.quality
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600">
                  {campaignData.quality === 1 && "Micro influencers"}
                  {campaignData.quality === 2 && "Small influencers"} 
                  {campaignData.quality === 3 && "Mid-tier creators"}
                  {campaignData.quality === 4 && "Established influencers"}
                  {campaignData.quality === 5 && "Top-tier creators"}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Recently selected creators</h4>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  ))}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                    +12
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-gray-900">Product & shipping details</h2>
              <p className="text-gray-600">Tell us about what you're promoting</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <Label className="font-medium">Shipping Required</Label>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Physical products need to be shipped to creators</p>
                  <Switch
                    checked={campaignData.shippingRequired}
                    onCheckedChange={(checked) => updateCampaignData({ shippingRequired: checked })}
                  />
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <Label className="font-medium">Apply Discount</Label>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Offer creators a special discount code</p>
                  <Switch
                    checked={campaignData.discountApplied}
                    onCheckedChange={(checked) => updateCampaignData({ discountApplied: checked })}
                  />
                </Card>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={campaignData.productName}
                    onChange={(e) => updateCampaignData({ productName: e.target.value })}
                    placeholder="Enter your product name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="productLink">Product Link</Label>
                  <div className="relative mt-1">
                    <Link className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="productLink"
                      value={campaignData.productLink}
                      onChange={(e) => updateCampaignData({ productLink: e.target.value })}
                      placeholder="https://your-product-link.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="retailValue">Retail Value (₹)</Label>
                  <Input
                    id="retailValue"
                    type="number"
                    value={campaignData.retailValue}
                    onChange={(e) => updateCampaignData({ retailValue: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Product Category</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {productCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => updateCampaignData({ productCategory: category })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          campaignData.productCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-gray-900">Review & place order</h2>
              <p className="text-gray-600">Review your campaign details before submitting</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Budget</h4>
                    <p className="text-2xl font-light text-blue-600">₹{campaignData.budget.toLocaleString()}</p>
                    {campaignData.flexibleBudget && (
                      <p className="text-sm text-gray-500">Flexible budget enabled</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Content Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {campaignData.contentTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-1">
                      {campaignData.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quality</h4>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= campaignData.quality
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {campaignData.productName && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Name:</span> {campaignData.productName}</p>
                      <p><span className="text-gray-600">Value:</span> ₹{campaignData.retailValue.toLocaleString()}</p>
                      <p><span className="text-gray-600">Category:</span> {campaignData.productCategory}</p>
                      <p><span className="text-gray-600">Shipping:</span> {campaignData.shippingRequired ? 'Required' : 'Not required'}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900">Create your campaign</h1>
              <p className="text-sm text-gray-600">Launch your influencer marketing campaign in minutes</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      index < currentStep
                        ? 'bg-blue-500 text-white'
                        : index === currentStep
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderStepContent()}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">Campaign Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">₹{campaignData.budget.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content types:</span>
                    <span className="font-medium">{campaignData.contentTypes.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories:</span>
                    <span className="font-medium">{campaignData.categories.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= campaignData.quality
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-3">
                    💡 Need help? Our team is here to assist you.
                  </div>
                  
                  <div className="space-y-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="w-full"
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep < steps.length - 1 ? (
                      <Button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        disabled={!canProceed()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={() => alert('Campaign submitted successfully!')}
                        disabled={!canProceed()}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                      >
                        Place Order
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
