
import { CheckCircle, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderSummaryProps {
  campaignData: any;
}

export const OrderSummary = ({ campaignData }: OrderSummaryProps) => {
  return (
    <div className="sticky top-32">
      <Card className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
        <CardContent className="p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Creator Package</h3>
              <p className="text-gray-600 text-sm">Dynamic pricing based on your inputs</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="text-sm text-gray-600 font-medium mb-4">Your selected inputs:</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">₹{campaignData.budget.toLocaleString()} budget</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">1x reel content</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="font-medium">Fashion category</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium">Premium creator quality</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-medium">Shipment included</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">25</div>
              <div className="text-sm text-gray-600 font-medium">Campaign creators available</div>
              <div className="text-xs text-gray-500">Premium selection</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">13</div>
                <div className="text-gray-600 font-medium">Micro creators</div>
                <div className="text-xs text-gray-500 mb-2">Best engagement</div>
                <div className="text-blue-600 font-bold">₹7,500/creator</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">7</div>
                <div className="text-gray-600 font-medium">Macro creators</div>
                <div className="text-xs text-gray-500 mb-2">Maximum reach</div>
                <div className="text-purple-600 font-bold">₹4,200/creator</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Select Package
            </Button>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-800 font-medium">
                  Get 28+ creator choices from Campayn's premium network
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-3">Campaign total with content value + 7% GST</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ₹97,000
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              View Price Breakdown
            </Button>
            <Button variant="outline" className="w-full py-4 rounded-2xl font-semibold border-2 hover:bg-gray-50 transition-all duration-200">
              Download Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
