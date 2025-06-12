
import { CheckCircle, Info, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const OrderingGuidelines = () => {
  return (
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
  );
};
