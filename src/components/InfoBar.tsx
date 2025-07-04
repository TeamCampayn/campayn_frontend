
import { CheckCircle, Sparkles } from 'lucide-react';

export const InfoBar = () => {
  const features = [
    "Unmatched pricing",
    "On-time delivery or money back", 
    "Receive 24 creator options",
    "Easy cancellation & refunds",
    "24/7 support anytime"
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-800">Why choose Campayn?</span>
            </div>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
