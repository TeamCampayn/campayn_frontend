
import React, { useEffect, useRef } from 'react';
import { Brain, Zap, Target, TrendingUp, Users } from 'lucide-react';

interface AIMatchingVisualProps {
  isActive?: boolean;
}

export const AIMatchingVisual: React.FC<AIMatchingVisualProps> = ({ isActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Trigger animations when card becomes active
      const elements = containerRef.current.querySelectorAll('.animate-on-active');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-scale-in');
        }, index * 200);
      });
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-2">
      {/* Mobile/Small Screen Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-3">
        {/* Central AI Brain */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-white">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* AI Matching Process */}
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 space-y-2">
          <div className="text-center text-xs font-bold text-gray-800 mb-2">AI Matching Process</div>
          
          {/* Brand Requirements */}
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Fashion Brand Requirements</span>
            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Audience Analysis */}
          <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded border border-purple-200">
            <Users className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-purple-800">Audience Analysis: 18-35F</span>
            <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Performance Data */}
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-800">Historical ROI: 4.2x</span>
            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* AI Processing */}
          <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded border-2 border-blue-300">
            <Zap className="w-3 h-3 text-blue-600 animate-bounce" />
            <span className="text-xs font-bold text-blue-800">AI Processing...</span>
            <div className="ml-auto flex space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          {/* Match Result */}
          <div className="text-center p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
            <div className="text-lg font-bold text-green-800">98% Perfect Match!</div>
            <div className="text-xs text-green-600">Creator: @priya_fashion</div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Improved detailed layout similar to mobile */}
      <div className="hidden lg:block w-full max-w-lg space-y-4">
        {/* Central AI Brain */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-white">
              <Brain className="w-10 h-10 text-white animate-bounce" />
            </div>
            {/* Neural network lines */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="w-full h-full border-2 border-dashed border-blue-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* AI Matching Process */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 space-y-4">
          <div className="text-center text-lg font-bold text-gray-800 mb-4">AI Matching Process</div>
          
          {/* Brand Requirements */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Fashion Brand Requirements</span>
            <div className="ml-auto w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Audience Analysis */}
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Audience Analysis: 18-35F Urban</span>
            <div className="ml-auto w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Performance Data */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Historical Performance: 4.2x ROI</span>
            <div className="ml-auto w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* AI Processing */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <Zap className="w-5 h-5 text-blue-600 animate-bounce" />
            <span className="text-sm font-bold text-blue-800">AI Processing & Analysis...</span>
            <div className="ml-auto flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          {/* Match Result */}
          <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
            <div className="text-2xl font-bold text-green-800 mb-1">98% Perfect Match!</div>
            <div className="text-sm text-green-600 font-medium">Creator: @priya_fashion</div>
            <div className="text-xs text-green-500 mt-1">Engagement Rate: 8.5% • Follower Quality: 95%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
