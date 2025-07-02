
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
    <div className="w-full h-full flex items-center justify-center p-2">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="text-center p-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Heart className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div className="text-sm font-bold text-gray-800">Creator Economy</div>
            </div>
            <div className="text-xs text-emerald-700">Bridging Digital Divide</div>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200 space-y-3">
          {/* Traditional Platforms */}
          <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Traditional</span>
              <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full font-bold">5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full transition-all duration-1000 ${
                  animateProgress ? 'w-[5%]' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="text-xs text-gray-600">Metro cities only</div>
          </div>
          
          {/* Campayn's Reach */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-3 border-4 border-emerald-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-emerald-800 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Campayn</span>
              </span>
              <span className="text-xs bg-emerald-300 text-emerald-800 px-2 py-1 rounded-full font-bold animate-pulse">95%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-emerald-500 to-cyan-600 h-2 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                  animateProgress ? 'w-[95%]' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="text-xs text-emerald-700 font-semibold">Bharat included</div>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 text-center border-2 border-orange-200">
              <div className={`text-lg font-bold text-orange-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '500M+' : '0M'}
              </div>
              <div className="text-xs text-orange-700 font-medium">Underserved</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 text-center border-2 border-purple-200">
              <div className={`text-lg font-bold text-purple-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2,800+' : '0'}
              </div>
              <div className="text-xs text-purple-700 font-medium">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-xs">
        {/* India's Digital Divide */}
        <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="text-center mb-4 p-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Heart className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div className="text-sm font-bold text-gray-800">Creator Economy</div>
            </div>
            <div className="text-xs text-emerald-700">Bridging Digital Divide</div>
          </div>
          
          <div className="space-y-4">
            {/* Traditional Focus */}
            <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Traditional Platforms</span>
                <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full font-bold">5%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full transition-all duration-1000 ${
                    animateProgress ? 'w-[5%]' : 'w-0'
                  }`}
                ></div>
              </div>
              
              <div className="flex space-x-1 mb-2 flex-wrap gap-1">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Mumbai</div>
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">Delhi</div>
              </div>
              <div className="text-xs text-gray-600 flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>Metro only</span>
              </div>
            </div>
            
            {/* Campayn's Reach */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-3 border-4 border-emerald-200 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Campayn</span>
                </span>
                <span className="text-xs bg-emerald-300 text-emerald-800 px-2 py-1 rounded-full font-bold animate-pulse">95%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-emerald-200 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-emerald-500 to-cyan-600 h-2 rounded-full transition-all duration-1500 delay-300 shadow-inner ${
                    animateProgress ? 'w-[95%]' : 'w-0'
                  }`}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-1 mb-2">
                <div className="bg-emerald-600 text-white px-2 py-1 rounded text-xs text-center font-medium">राज कैफे</div>
                <div className="bg-cyan-600 text-white px-2 py-1 rounded text-xs text-center font-medium">Local Salon</div>
              </div>
              <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>Bharat included</span>
              </div>
            </div>
          </div>
          
          {/* Impact Numbers */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 text-center border-2 border-orange-200">
              <div className={`text-lg font-bold text-orange-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '500M+' : '0M'}
              </div>
              <div className="text-xs text-orange-700 font-medium">Underserved</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 text-center border-2 border-purple-200">
              <div className={`text-lg font-bold text-purple-800 transition-all duration-1000 ${
                animateProgress ? 'animate-bounce' : ''
              }`}>
                {animateProgress ? '2,800+' : '0'}
              </div>
              <div className="text-xs text-purple-700 font-medium">Cities</div>
            </div>
          </div>
          
          {/* Mission statement */}
          <div className="mt-3 text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border border-yellow-200">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-bold text-orange-800">Democratizing</span>
            </div>
            <div className="text-xs text-orange-700">
              Creator economy for every business
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
