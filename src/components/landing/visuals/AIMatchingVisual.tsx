
import React, { useEffect, useRef } from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';

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
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        {/* Central AI Brain with enhanced design */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            {/* Main brain container */}
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-4 border-white">
              <Brain className="w-10 h-10 text-white animate-bounce" />
            </div>
            {/* Neural network lines */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="w-full h-full border-2 border-dashed border-blue-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Orbiting Elements */}
        <div className="relative w-56 h-56 mx-auto">
          {/* Brand Requirements - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 animate-on-active">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-xl text-sm font-bold text-blue-900 shadow-lg border border-blue-300 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Fashion Brand</span>
            </div>
          </div>
          
          {/* Top Right - Match Score */}
          <div className="absolute top-6 right-0 transform translate-x-4 animate-on-active">
            <div className="bg-gradient-to-r from-green-100 to-green-200 px-3 py-2 rounded-xl text-sm text-green-900 font-bold shadow-lg border border-green-300 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span>98% Match</span>
            </div>
          </div>
          
          {/* Right - Performance Data */}
          <div className="absolute right-2 top-1/2 transform translate-x-2 -translate-y-1/2 animate-on-active">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-2 rounded-xl text-sm text-purple-900 font-bold shadow-lg border border-purple-300 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>High ROI</span>
            </div>
          </div>
          
          {/* Bottom Right */}
          <div className="absolute bottom-6 right-2 animate-on-active">
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-xl text-sm text-yellow-900 font-bold shadow-lg border border-yellow-300 flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>92% Match</span>
            </div>
          </div>
          
          {/* Bottom - Target Audience */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 animate-on-active">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-200 px-4 py-2 rounded-xl text-sm font-bold text-purple-900 shadow-lg border border-purple-300 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Target Audience</span>
            </div>
          </div>
          
          {/* Left - Campaign Data */}
          <div className="absolute top-6 left-0 transform -translate-x-4 animate-on-active">
            <div className="bg-gradient-to-r from-orange-100 to-red-200 px-3 py-2 rounded-xl text-sm text-orange-900 font-bold shadow-lg border border-orange-300 flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>AI Analysis</span>
            </div>
          </div>
          
          {/* Animated connecting lines with gradients */}
          <svg className="absolute inset-0 w-full h-full animate-pulse" viewBox="0 0 224 224">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Outer orbit ring */}
            <circle cx="112" cy="112" r="100" fill="none" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8,4" className="animate-spin" style={{ animationDuration: '15s' }} />
            
            {/* Connection lines with animated dash */}
            <line x1="112" y1="12" x2="112" y2="70" stroke="#3b82f6" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
            <line x1="200" y1="56" x2="150" y2="90" stroke="#10b981" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
            <line x1="190" y1="112" x2="140" y2="112" stroke="#8b5cf6" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
            <line x1="200" y1="168" x2="150" y2="134" stroke="#f59e0b" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
            <line x1="112" y1="212" x2="112" y2="154" stroke="#8b5cf6" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
            <line x1="24" y1="56" x2="74" y2="90" stroke="#f97316" strokeWidth="3" opacity="0.7" strokeDasharray="4,2" className="animate-pulse" />
          </svg>
          
          {/* Data flow particles */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ top: '20%', left: '30%', animationDelay: '0s' }}></div>
            <div className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ top: '60%', left: '70%', animationDelay: '1s' }}></div>
            <div className="absolute w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ top: '80%', left: '40%', animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix missing import
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);
