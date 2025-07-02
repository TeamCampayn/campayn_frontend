
import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Heart, Zap } from 'lucide-react';

interface BharatSplitVisualProps {
  isActive?: boolean;
}

export const BharatSplitVisual: React.FC<BharatSplitVisualProps> = ({ isActive = false }) => {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimateProgress(true), 300);
    } else {
      setAnimateProgress(false);
    }
  }, [isActive]);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Enhanced India's Digital Divide */}
        <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="text-center mb-6 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-emerald-600 animate-pulse" />
              <div className="text-lg font-bold text-gray-800">India's Creator Economy</div>
            </div>
            <div className="text-sm text-emerald-700">Bridging the Digital Divide</div>
          </div>
          
          <div className="space-y-5">
            {/* Traditional Focus - Enhanced */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Traditional Platforms</span>
                <span className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded-full font-bold">5% Coverage</span>
              </div>
              
              {/* Progress bar for traditional */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all duration-1000 ${
                    animateProgress ? 'w-[5%]' : 'w-0'
                  }`}
                ></div>
              </div>
              
              <div className="flex space-x-2 mb-3 flex-wrap gap-1">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Mumbai</div>
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">Delhi</div>
                <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">Bangalore</div>
              </div>
              <div className="text-xs text-gray-600 flex items-center space-x-2">
                <Users className="w-3 h-3" />
                <span>Metro cities only</span>
              </div>
            </div>
            
            {/* Campayn's Reach - Enhanced */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-4 border-4 border-emerald-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-emerald-800 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Campayn Platform</span>
                </span>
                <span className="text-xs bg-emerald-300 text-emerald-800 px-3 py-1 rounded-full font-bold animate-pulse">95% Coverage</span>
              </div>
              
              {/* Progress bar for Campayn */}
              <div className="w-full bg-emerald-200 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-emerald-500 to-cyan-600 h-3 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                    animateProgress ? 'w-[95%]' : 'w-0'
                  }`}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-emerald-600 text-white px-2 py-1 rounded text-xs text-center font-medium">राज कैफे</div>
                <div className="bg-cyan-600 text-white px-2 py-1 rounded text-xs text-center font-medium">प्रिया स्टूडियो</div>
                <div className="bg-teal-600 text-white px-2 py-1 rounded text-xs text-center font-medium">Local Salon</div>
                <div className="bg-green-600 text-white px-2 py-1 rounded text-xs text-center font-medium">नमस्कार Shop</div>
              </div>
              <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-2">
                <Heart className="w-3 h-3" />
                <span>Bharat's businesses included</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Impact Numbers */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 text-center border-2 border-orange-200">
              <div className={`text-2xl font-bold text-orange-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '500M+' : '0M'}
              </div>
              <div className="text-xs text-orange-700 font-medium">Underserved Market</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 text-center border-2 border-purple-200">
              <div className={`text-2xl font-bold text-purple-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2,800+' : '0'}
              </div>
              <div className="text-xs text-purple-700 font-medium">Cities & Towns</div>
            </div>
          </div>
          
          {/* Mission statement */}
          <div className="mt-4 text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-800">Our Mission</span>
            </div>
            <div className="text-xs text-orange-700">
              Democratizing creator economy for every Indian business
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
