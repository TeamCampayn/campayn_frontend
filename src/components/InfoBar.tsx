
import { CheckCircle } from 'lucide-react';

export const InfoBar = () => {
  return (
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
  );
};
