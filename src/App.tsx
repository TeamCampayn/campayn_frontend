
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Star, Package, Link, DollarSign, Info, Play, FileText, Image } from 'lucide-react'

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

const contentTypeOptions = [
  { id: 'reel', name: '30 seconds Reel', duration: 'Add video log', icon: Play },
  { id: 'story', name: 'Video Story', duration: '', icon: Play },
  { id: 'post', name: 'Static Post', duration: '', icon: Image }
]

const categoryOptions = [
  { id: 'fashion', name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop' },
  { id: 'lifestyle', name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=200&h=200&fit=crop' },
  { id: 'travel', name: 'Travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop' }
]

const qualityTiers = [
  { id: 1, stars: 4, name: 'Content quality: High', description: 'Content quality High', cost: '₹2K', selected: false },
  { id: 2, stars: 3, name: 'Content quality: Medium', description: 'Content quality Medium', cost: '₹1.5K', selected: false },
  { id: 3, stars: 5, name: 'Content quality: Best', description: 'Content quality Best', cost: '₹3K', selected: true }
]

const productCategories = [
  'Beauty', 'Lifestyle', 'Finance', 'Entertainment', 'Parenting', 'Health', 'Travel', 'Food', 'Tech'
]

const recentCreators = [
  { name: 'Fatimas.', followers: '4.8M followers', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=50&h=50&fit=crop&crop=face' },
  { name: '@shantinupur', followers: '2.1M followers', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
  { name: 'dane.artist', followers: '1.5M followers', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face' },
  { name: '@thepupil', followers: '923k followers', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  { name: 'sarikamann', followers: '820k followers', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  { name: 'rishiaggarwal4', followers: '750k followers', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
]

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

  const budgetMarks = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Amplify</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Unmatched pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">On-time delivery or money back</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Receive 24 creator options</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Easy cancellation & refunds</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Will buy support anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="col-span-2 space-y-8">
            
            {/* Campaign Title */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">Create your campaign</h1>
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Step 1 updated
                </div>
              </div>
            </div>

            {/* Campaign Budget Card */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Choose campaign budget</h2>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{campaignData.budget.toLocaleString()}
                    </div>
                    <div className="flex space-x-4 text-sm">
                      {budgetMarks.map((mark) => (
                        <span key={mark} className="text-gray-500">₹{mark >= 1000000 ? '10L+' : mark >= 100000 ? `${mark/100000}L` : `${mark/1000}K`}</span>
                      ))}
                    </div>
                  </div>
                  
                  <Slider
                    value={[campaignData.budget]}
                    onValueChange={(value) => updateCampaignData({ budget: value[0] })}
                    max={1000000}
                    min={5000}
                    step={5000}
                    className="w-full mb-6"
                  />
                  
                  <div className="flex items-center space-x-3 bg-yellow-50 p-4 rounded-lg">
                    <Checkbox
                      checked={campaignData.flexibleBudget}
                      onCheckedChange={(checked) => updateCampaignData({ flexibleBudget: checked as boolean })}
                    />
                    <Label className="text-sm text-gray-700">
                      My budget is slightly flexible (this will allow you to get more creators in your campaign)
                    </Label>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium">
                        We'll find partners around your price. Choose a higher price will help you get better creators
                      </p>
                      <p className="text-yellow-700 mt-1">
                        Campaign available for purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Requirements Card */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Choose content requirements per creator</h2>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                
                <p className="text-gray-600 mb-6">
                  Our pricing is dynamic and is always based on the topics selected.
                </p>

                <div className="space-y-4 mb-6">
                  {contentTypeOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = campaignData.contentTypes.includes(option.id)
                    
                    return (
                      <div
                        key={option.id}
                        onClick={() => updateCampaignData({ 
                          contentTypes: toggleArrayItem(campaignData.contentTypes, option.id) 
                        })}
                        className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-500' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{option.name}</h3>
                          {option.duration && (
                            <p className="text-sm text-gray-500">{option.duration}</p>
                          )}
                        </div>
                        {option.id === 'reel' && (
                          <Badge className="bg-orange-100 text-orange-800">Hot</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-700">Comments</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Pinned comments</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">CREATOR DETAILS</h3>
              
              {/* Creator Category Selection */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Select creator category</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Choose the type of creator you want to collaborate with. You can get an estimate to modify it when asking creators.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {categoryOptions.map((category) => {
                      const isSelected = campaignData.categories.includes(category.id)
                      
                      return (
                        <div
                          key={category.id}
                          onClick={() => updateCampaignData({ 
                            categories: toggleArrayItem(campaignData.categories, category.id) 
                          })}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                            isSelected ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                            <div className="p-3 text-white">
                              <h4 className="font-medium">{category.name}</h4>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2">
                            <Button
                              size="sm"
                              variant={isSelected ? "default" : "secondary"}
                              className="text-xs px-2 py-1"
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Creator Quality Selection */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Select creator quality</h2>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Select creator quality you prefer. This affects number of creators to hire on hand for your budget.
                  </p>

                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-blue-600 font-medium">Sample content</span>
                    <button className="text-blue-600">▶</button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {qualityTiers.map((tier) => {
                      const isSelected = campaignData.quality === tier.id
                      
                      return (
                        <div
                          key={tier.id}
                          onClick={() => updateCampaignData({ quality: tier.id })}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < tier.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{tier.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                          <p className="text-sm font-medium text-blue-600">{tier.cost}</p>
                          {tier.selected && (
                            <div className="mt-2">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Recently Selected Creators */}
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-3">Recently selected Micro online creators</h4>
                    <div className="grid grid-cols-6 gap-4">
                      {recentCreators.map((creator, index) => (
                        <div key={index} className="text-center">
                          <img
                            src={creator.image}
                            alt={creator.name}
                            className="w-12 h-12 rounded-full mx-auto mb-2"
                          />
                          <p className="text-xs font-medium text-gray-900">{creator.name}</p>
                          <p className="text-xs text-gray-600">{creator.followers}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">SHIPPING DETAILS</h3>
              
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Does the campaign involve sending a shipment to creator?
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Choose this option if you have a product that needs to be shipped to the creator so that they can create content.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div
                      onClick={() => updateCampaignData({ shippingRequired: true })}
                      className={`p-6 rounded-lg border-2 cursor-pointer ${
                        campaignData.shippingRequired ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h3 className="font-medium">Yes (shipping required)</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Physical products need to be shipped to creators we will handle the logistics and documentation
                      </p>
                      <div className="mt-3 text-xs text-yellow-600">
                        📦 Campaign deliveries same day
                      </div>
                    </div>

                    <div
                      onClick={() => updateCampaignData({ shippingRequired: false })}
                      className={`p-6 rounded-lg border-2 cursor-pointer ${
                        !campaignData.shippingRequired ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="w-6 h-6 text-blue-600">⚡</span>
                        <h3 className="font-medium">No (shipping not required)</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Anything that is not purchasing digital content etc
                      </p>
                      <div className="mt-3 text-xs text-yellow-600">
                        ⚡ Campaign deliveries same day
                      </div>
                    </div>
                  </div>

                  {/* Product Details Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Enter product name
                      </Label>
                      <Input
                        placeholder="e.g. Nike Shoes"
                        value={campaignData.productName}
                        onChange={(e) => updateCampaignData({ productName: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Enter product link
                      </Label>
                      <Input
                        placeholder="https://"
                        value={campaignData.productLink}
                        onChange={(e) => updateCampaignData({ productLink: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Enter retail value of the product that the creator will receive
                        </Label>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        We'll be telling this value to the creator when you submit your order. Use this as your products estimated worth.
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">₹</span>
                        <Input
                          type="number"
                          placeholder="Enter MRP of the product that you want to promote"
                          value={campaignData.retailValue || ''}
                          onChange={(e) => updateCampaignData({ retailValue: parseInt(e.target.value) || 0 })}
                          className="flex-1"
                        />
                        <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                          Get item valuation online
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox />
                        <Label className="text-xs text-gray-600">
                          Send this as "" gift to creators without further discount. Brands can free & income application. 
                          Every people quality creators for final campaigns.
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Product Category */}
                  <div className="mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Trending sponsored videos</h4>
                      <p className="text-sm text-blue-800">
                        Selecting a content vertical with our effect campaign pricing, to give you the correct high-end, you will get an 
                        option to choose a model 2 offer suitable content framework promotional posts placement.
                      </p>
                    </div>
                    
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Select your product category
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select your product category
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {productCategories.map((category) => (
                        <Button
                          key={category}
                          onClick={() => updateCampaignData({ productCategory: category })}
                          variant={campaignData.productCategory === category ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* What to Expect Section */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  What to expect after placing an order
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Campaign creation</h4>
                      <p className="text-sm text-gray-600">
                        One of our content experts will validate your campaign goals and contact approved vs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Creator content requirements</h4>
                      <p className="text-sm text-gray-600">
                        Market within 24 hrs. Pre-Price
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Learn about the key components of content requirements</h4>
                      <p className="text-sm text-gray-600">
                        Quality content can have world-class content always about you to select their clients that branded 
                        to ensure content is completed as per their budget expectations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">About Brand & product</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Product details</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Content sharing limits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Photo, campaign proofs</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Target audience of campaign</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ordering Guidelines */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Ordering guidelines
                </h2>
                <p className="text-gray-600 mb-4">
                  Our team of placing sales, brand submissions, product shipping, content 
                  delivery etc. View details
                </p>
                
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Get 100% refund when</h4>
                    <p className="text-sm text-gray-600">
                      No refunds owe free 24 creator options.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Any delay by creator on content creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Any delay in campaign delivery timeline</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      <strong>Heads up!</strong> If you placed an order for ₹7,500 for a total worth 50 units 
                      by 7am today, for faster checkout, almost shipping a control review by each creators.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Summary Card */}
          <div className="col-span-1">
            <div className="sticky top-8">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Select creator package and place order
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    The pricing is dynamic and adjust based on the inputs selected.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="text-sm">
                      <span className="text-gray-600">Your selected inputs:</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>₹{campaignData.budget.toLocaleString()} budget</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>1x reel content</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Fashion category</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Best creator quality</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Shipment involved</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">25</div>
                      <div className="text-sm text-gray-600">Campaign creators-content balance</div>
                      <div className="text-xs text-gray-500">Options balance</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <div className="text-xl font-bold text-gray-900">13</div>
                        <div className="text-gray-600">Micro creators</div>
                        <div className="text-xs text-gray-500">Best mix followers</div>
                        <div className="text-blue-600 font-medium">₹7,500/creator</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">7</div>
                        <div className="text-gray-600">Macro creators</div>
                        <div className="text-xs text-gray-500">High-level followers</div>
                        <div className="text-blue-600 font-medium">₹4,200/creator</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Select
                    </Button>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Place the campaign and submit get 28 choice from Amplify's plan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 mb-2">Campaign total with content value / 7% Gst invoice tax</div>
                    <div className="text-2xl font-bold text-blue-600">Place order @ ₹97,000</div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View price breakdown
                    </Button>
                    <Button variant="outline" className="w-full">
                      Download proposal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
