
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderSummaryProps {
  campaignData: any;
}

export const OrderSummary = ({ campaignData }: OrderSummaryProps) => {
  return (
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
  );
};
