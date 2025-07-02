
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
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm h-full flex items-center justify-center">
        {/* Central AI Brain */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            {/* Main brain container */}
            <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-white">
              <Brain className="w-8 h-8 text-white animate-bounce" />
            </div>
            {/* Neural network lines */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="w-full h-full border-2 border-dashed border-blue-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* Orbiting Elements - Optimized for mobile */}
        <div className="relative w-full h-full max-w-xs max-h-xs">
          {/* Brand Requirements - Top */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-900 shadow-lg border border-blue-300 flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>Fashion Brand</span>
            </div>
          </div>
          
          {/* Top Right - Match Score */}
          <div className="absolute top-8 right-2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-green-100 to-green-200 px-2 py-1 rounded-lg text-xs text-green-900 font-bold shadow-lg border border-green-300 flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
              <span>98%</span>
            </div>
          </div>
          
          {/* Right - Performance Data */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded-lg text-xs text-purple-900 font-bold shadow-lg border border-purple-300 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>High ROI</span>
            </div>
          </div>
          
          {/* Bottom Right */}
          <div className="absolute bottom-8 right-2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 px-2 py-1 rounded-lg text-xs text-yellow-900 font-bold shadow-lg border border-yellow-300 flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>92%</span>
            </div>
          </div>
          
          {/* Bottom - Target Audience */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-900 shadow-lg border border-purple-300 flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Audience</span>
            </div>
          </div>
          
          {/* Left - Campaign Data */}
          <div className="absolute top-8 left-2 animate-on-active z-10">
            <div className="bg-gradient-to-r from-orange-100 to-red-200 px-2 py-1 rounded-lg text-xs text-orange-900 font-bold shadow-lg border border-orange-300 flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>AI</span>
            </div>
          </div>
          
          {/* Animated connecting lines */}
          <svg className="absolute inset-0 w-full h-full animate-pulse opacity-50" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Outer orbit ring */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="6,3" className="animate-spin" style={{ animationDuration: '15s' }} />
            
            {/* Connection lines */}
            <line x1="100" y1="20" x2="100" y2="60" stroke="#3b82f6" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
            <line x1="170" y1="40" x2="130" y2="80" stroke="#10b981" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
            <line x1="180" y1="100" x2="140" y2="100" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
            <line x1="170" y1="160" x2="130" y2="120" stroke="#f59e0b" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
            <line x1="100" y1="180" x2="100" y2="140" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
            <line x1="30" y1="40" x2="70" y2="80" stroke="#f97316" strokeWidth="2" opacity="0.5" strokeDasharray="3,2" className="animate-pulse" />
          </svg>
        </div>
      </div>
    </div>
  );
};
