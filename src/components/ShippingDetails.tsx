
import { Package, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ShippingDetailsProps {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
}

const productCategories = [
  'Beauty', 'Lifestyle', 'Finance', 'Entertainment', 'Parenting', 'Health', 'Travel', 'Food', 'Tech'
];

export const ShippingDetails = ({ campaignData, updateCampaignData }: ShippingDetailsProps) => {
  return (
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
  );
};
