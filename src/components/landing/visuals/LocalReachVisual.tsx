
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
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-xs space-y-4">
        {/* India Map */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="relative w-full h-32 bg-gradient-to-b from-green-100 to-emerald-200 rounded-lg border-2 border-green-300 overflow-hidden">
            <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-emerald-500 opacity-40 rounded-lg" style={{
              clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
            }}></div>
            
            {/* Cities */}
            <div className="absolute top-2 left-3 w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
            <div className="absolute top-4 right-3 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 right-3 w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
            
            <div className="absolute bottom-1 left-1 right-1 bg-white/80 backdrop-blur-sm rounded p-1 text-center">
              <div className="text-xs font-bold text-green-800">155K+ Creators • 500+ Cities</div>
            </div>
          </div>
        </div>

        {/* Business & Creators */}
        <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-bold text-green-800">Local Store</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-bold text-gray-800">Raj</div>
              <div className="text-xs text-orange-600">Tech</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-bold text-gray-800">Priya</div>
              <div className="text-xs text-pink-600">Lifestyle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative w-full max-w-sm h-full flex items-center justify-center">
        {/* India Map - Centered and contained */}
        <div className="relative w-48 h-56 mx-auto">
          <div className="w-full h-full bg-gradient-to-b from-green-100 to-emerald-200 rounded-2xl border-4 border-green-300 relative overflow-hidden shadow-2xl">
            {/* Animated map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-emerald-300/50"></div>
            
            {/* Map silhouette */}
            <div className="absolute inset-4 bg-gradient-to-br from-green-400 to-emerald-500 opacity-40 rounded-lg shadow-inner" style={{
              clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
            }}></div>
            
            {/* Tier 2/3 Cities - Better positioned */}
            <div className="absolute top-8 left-8 animate-on-active group">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-orange-300 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-4 left-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Lucknow
              </div>
            </div>
            
            <div className="absolute top-16 right-10 animate-on-active group">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-pink-300 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-4 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Bhopal
              </div>
            </div>
            
            <div className="absolute bottom-16 left-10 animate-on-active group">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute bottom-4 left-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Nashik
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 animate-on-active group">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-purple-300 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute bottom-4 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Kochi
              </div>
            </div>
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-50">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <line x1="32" y1="40" x2="152" y2="80" stroke="url(#connectionGradient)" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
              <line x1="40" y1="180" x2="152" y2="144" stroke="url(#connectionGradient)" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
              <line x1="32" y1="40" x2="40" y2="180" stroke="url(#connectionGradient)" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
              <line x1="160" y1="72" x2="160" y2="160" stroke="url(#connectionGradient)" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
            </svg>
            
            {/* Stats overlay - Repositioned to avoid overlap */}
            <div className="absolute bottom-1 left-1 right-1 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 border border-green-200">
              <div className="flex justify-between text-xs font-bold text-green-800">
                <span>155K+ Creators</span>
                <span>500+ Cities</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Local Business - Positioned outside the map container */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 animate-on-active z-10">
          <div className="bg-white rounded-lg shadow-xl p-2 border-2 border-green-300 group hover:scale-105 transition-transform">
            <Store className="w-6 h-6 text-green-600 mx-auto mb-1 animate-bounce" />
            <div className="text-xs font-bold text-center text-green-800">Local Store</div>
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        
        {/* Creator Profiles - Positioned outside the map container */}
        <div className="absolute right-0 top-1/4 transform translate-x-2 animate-on-active z-10">
          <div className="bg-white rounded-lg shadow-lg p-2 text-center border-2 border-orange-200 group hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-1 flex items-center justify-center shadow-lg">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-bold text-gray-800">Raj</div>
            <div className="text-xs text-orange-600">Tech</div>
          </div>
        </div>
        
        <div className="absolute right-0 bottom-1/4 transform translate-x-2 animate-on-active z-10">
          <div className="bg-white rounded-lg shadow-lg p-2 text-center border-2 border-pink-200 group hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-1 flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-bold text-gray-800">Priya</div>
            <div className="text-xs text-pink-600">Lifestyle</div>
          </div>
        </div>
      </div>
    </div>
  );
};
