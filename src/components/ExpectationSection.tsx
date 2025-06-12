
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ExpectationSection = () => {
  return (
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
  );
};
