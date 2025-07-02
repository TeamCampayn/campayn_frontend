
import React, { useEffect, useRef, useState } from 'react';
import { Users, Shield, Award, TrendingUp } from 'lucide-react';

interface TrustSystemVisualProps {
  isActive?: boolean;
}

export const TrustSystemVisual: React.FC<TrustSystemVisualProps> = ({ isActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimateProgress(true), 300);
    } else {
      setAnimateProgress(false);
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
          {/* Enhanced Creator Profile */}
          <div className="flex items-center space-x-4 mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-gray-800">Arjun Mehta</span>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                  Gold Tier
                </div>
              </div>
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <span>Fashion Creator</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Animated Trust Metrics */}
          <div className="space-y-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Response Rate</span>
                <span className={`text-sm font-bold text-green-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '98%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 shadow-inner ${
                    animateProgress ? 'w-[98%]' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Delivery Rate</span>
                <span className={`text-sm font-bold text-green-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '100%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 delay-300 shadow-inner ${
                    animateProgress ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Quality Score</span>
                <span className={`text-sm font-bold text-blue-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '4.8/5' : '0.0/5'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 delay-600 shadow-inner ${
                    animateProgress ? 'w-[96%]' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Wallet System */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-green-800">Secure Wallet</span>
              <Shield className="w-5 h-5 text-green-600 animate-pulse" />
            </div>
            <div className={`text-2xl font-bold text-green-700 mb-1 transition-all duration-1000 ${
              animateProgress ? 'animate-bounce' : ''
            }`}>
              {animateProgress ? '₹12,450' : '₹0'}
            </div>
            <div className="text-xs text-green-600 flex items-center space-x-2">
              <span>Available for withdrawal</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          {/* Enhanced Tier Progress */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between text-sm text-purple-700 mb-2 font-medium">
              <span>Progress to Platinum</span>
              <span className={`transition-all duration-500 ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '850/1000 XP' : '0/1000 XP'}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden mb-2">
              <div 
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-1500 delay-200 shadow-inner ${
                  animateProgress ? 'w-[85%]' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="text-xs text-purple-600 text-center">
              🏆 Only 150 XP away from Platinum status!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
