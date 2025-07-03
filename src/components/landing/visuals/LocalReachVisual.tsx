
import React, { useEffect, useRef } from 'react';
import { Store, MapPin, Users, Smartphone } from 'lucide-react';

interface LocalReachVisualProps {
  isActive?: boolean;
}

export const LocalReachVisual: React.FC<LocalReachVisualProps> = ({ isActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-on-active');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-scale-in');
        }, index * 300);
      });
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-2">
      {/* Mobile Layout - Simplified and Lightweight */}
      <div className="lg:hidden w-full max-w-sm space-y-2 px-2">
        {/* India Map - Simplified */}
        <div className="bg-white rounded-lg shadow-md p-3 border border-green-100">
          <div className="relative w-full h-32 bg-gradient-to-b from-green-50 to-emerald-100 rounded-lg border border-green-200 overflow-hidden">
            {/* Simplified map shape */}
            <div className="absolute inset-3 bg-green-300 opacity-60 rounded" style={{
              clipPath: 'polygon(30% 25%, 70% 20%, 80% 40%, 75% 65%, 65% 80%, 35% 75%, 20% 50%)'
            }}></div>
            
            {/* Key cities - fewer, static */}
            <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-4 right-6 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            
            {/* Central hub - static */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-600 rounded-full"></div>
            
            <div className="absolute bottom-1 left-1 right-1 bg-white/80 rounded text-center py-1">
              <div className="text-xs font-semibold text-green-700">155K+ Creators</div>
            </div>
          </div>
        </div>

        {/* Connection Flow - Simplified */}
        <div className="bg-white rounded-lg shadow-md p-3 border border-gray-100">
          <div className="grid grid-cols-3 gap-3 items-center text-center">
            <div>
              <div className="w-8 h-8 bg-green-400 rounded-lg mx-auto mb-1 flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-semibold text-green-700">Store</div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-lg text-green-500">→</div>
            </div>
            
            <div className="space-y-1">
              <div className="w-6 h-6 bg-orange-400 rounded-full mx-auto flex items-center justify-center">
                <span className="text-xs text-white font-bold">C</span>
              </div>
              <div className="text-xs font-semibold text-gray-600">Creators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Simplified and Performance Optimized */}
      <div className="hidden lg:block w-full max-w-5xl mx-auto h-full">
        <div className="grid grid-cols-3 gap-6 items-center h-full px-6">
          {/* Local Business - Left */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-green-200 text-center">
              <Store className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <div className="text-base font-bold text-green-800">Local Business</div>
              <div className="text-sm text-gray-600 mt-1">Fashion Store in Mumbai</div>
            </div>
            
            {/* Simple arrow */}
            <div className="text-2xl text-green-500">→</div>
          </div>
          
          {/* India Map - Center - Simplified */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-56">
              <div className="w-full h-full bg-gradient-to-b from-green-100 to-emerald-200 rounded-xl border-2 border-green-300 relative overflow-hidden shadow-lg">
                {/* Simplified map silhouette */}
                <div className="absolute inset-4 bg-green-400 opacity-50 rounded-lg" style={{
                  clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
                }}></div>
                
                {/* Key cities - static for performance */}
                <div className="absolute top-8 left-8 w-2.5 h-2.5 bg-orange-500 rounded-full shadow-md"></div>
                <div className="absolute top-12 right-10 w-2.5 h-2.5 bg-pink-500 rounded-full shadow-md"></div>
                <div className="absolute bottom-12 left-10 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-md"></div>
                <div className="absolute bottom-8 right-8 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-md"></div>
                
                {/* Central hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full shadow-md"></div>
                
                {/* Stats overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded-lg p-2 text-center">
                  <div className="text-xs font-bold text-green-800">155K+ Creators</div>
                  <div className="text-xs text-green-600">500+ Cities</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creators - Right */}
          <div className="flex flex-col items-center space-y-3">
            {/* Simple arrow */}
            <div className="text-2xl text-pink-500">←</div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg shadow-lg p-3 text-center border border-orange-200">
                <div className="w-8 h-8 bg-orange-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-800">Raj Kumar</div>
                <div className="text-xs text-orange-600">Lucknow • 50K</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-3 text-center border border-pink-200">
                <div className="w-8 h-8 bg-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-gray-800">Priya Nair</div>
                <div className="text-xs text-pink-600">Kochi • 75K</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
