
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
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-4">
        {/* Creator Profile */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="flex items-center space-x-3 mb-3 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Award className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-gray-800 text-sm">Arjun M</span>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                  Gold
                </div>
              </div>
              <div className="text-xs text-gray-600 flex items-center space-x-1">
                <span>Fashion</span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Trust Metrics */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-medium">Response Rate</span>
              <span className={`text-xs font-bold text-green-600 transition-all duration-500 ${
                animateProgress ? 'animate-pulse' : ''
              }`}>
                {animateProgress ? '98%' : '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-inner ${
                  animateProgress ? 'w-[98%]' : 'w-0'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Wallet and Tier System */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200 space-y-3">
          {/* Secure Wallet */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-800">Secure Wallet</span>
              <Shield className="w-4 h-4 text-green-600 animate-pulse" />
            </div>
            <div className={`text-lg font-bold text-green-700 transition-all duration-1000 ${
              animateProgress ? 'animate-bounce' : ''
            }`}>
              {animateProgress ? '₹12,450' : '₹0'}
            </div>
            <div className="text-xs text-green-600">Available</div>
          </div>
          
          {/* Tier Progress */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between text-xs text-purple-700 mb-1 font-medium">
              <span>To Platinum</span>
              <span className={`transition-all duration-500 ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '850/1000' : '0/1000'}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden mb-1">
              <div 
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-1500 delay-200 shadow-inner ${
                  animateProgress ? 'w-[85%]' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="text-xs text-purple-600 text-center">
              🏆 150 XP to Platinum!
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full max-w-xs">
        <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors">
          {/* Creator Profile */}
          <div className="flex items-center space-x-3 mb-4 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Award className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-gray-800 text-sm">Arjun M</span>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                  Gold
                </div>
              </div>
              <div className="text-xs text-gray-600 flex items-center space-x-1">
                <span>Fashion</span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Trust Metrics */}
          <div className="space-y-3 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Response Rate</span>
                <span className={`text-xs font-bold text-green-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '98%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 shadow-inner ${
                    animateProgress ? 'w-[98%]' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Delivery Rate</span>
                <span className={`text-xs font-bold text-green-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '100%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 delay-300 shadow-inner ${
                    animateProgress ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Quality Score</span>
                <span className={`text-xs font-bold text-blue-600 transition-all duration-500 ${
                  animateProgress ? 'animate-pulse' : ''
                }`}>
                  {animateProgress ? '4.8/5' : '0.0/5'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-1000 delay-600 shadow-inner ${
                    animateProgress ? 'w-[96%]' : 'w-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Wallet System */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200 mb-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-800">Secure Wallet</span>
              <Shield className="w-4 h-4 text-green-600 animate-pulse" />
            </div>
            <div className={`text-lg font-bold text-green-700 mb-1 transition-all duration-1000 ${
              animateProgress ? 'animate-bounce' : ''
            }`}>
              {animateProgress ? '₹12,450' : '₹0'}
            </div>
            <div className="text-xs text-green-600 flex items-center space-x-1">
              <span>Available</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          {/* Tier Progress */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
            <div className="flex justify-between text-xs text-purple-700 mb-1 font-medium">
              <span>To Platinum</span>
              <span className={`transition-all duration-500 ${animateProgress ? 'animate-pulse' : ''}`}>
                {animateProgress ? '850/1000' : '0/1000'}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden mb-1">
              <div 
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-1500 delay-200 shadow-inner ${
                  animateProgress ? 'w-[85%]' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="text-xs text-purple-600 text-center">
              🏆 150 XP to Platinum!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
