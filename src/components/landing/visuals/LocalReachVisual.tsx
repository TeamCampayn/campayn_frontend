
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
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center p-6">
      {/* Enhanced India Map */}
      <div className="relative">
        <div className="w-56 h-64 bg-gradient-to-b from-green-100 to-emerald-200 rounded-2xl border-4 border-green-300 relative overflow-hidden shadow-2xl">
          {/* Animated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-emerald-300/50"></div>
          
          {/* Map silhouette with better styling */}
          <div className="absolute inset-6 bg-gradient-to-br from-green-400 to-emerald-500 opacity-40 rounded-lg shadow-inner" style={{
            clipPath: 'polygon(30% 20%, 70% 15%, 85% 35%, 80% 60%, 70% 85%, 30% 80%, 15% 50%)'
          }}></div>
          
          {/* Enhanced Tier 2/3 Cities with better design */}
          <div className="absolute top-10 left-10 animate-on-active group">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-300 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute top-6 left-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Lucknow
              <div className="text-xs text-green-600">50K+ Creators</div>
            </div>
          </div>
          
          <div className="absolute top-20 right-14 animate-on-active group">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-pink-300 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute top-6 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Bhopal
              <div className="text-xs text-green-600">35K+ Creators</div>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-14 animate-on-active group">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute bottom-6 left-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Nashik
              <div className="text-xs text-green-600">28K+ Creators</div>
            </div>
          </div>
          
          <div className="absolute bottom-10 right-10 animate-on-active group">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-purple-300 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute bottom-6 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-800 shadow-md border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity">
              Kochi
              <div className="text-xs text-green-600">42K+ Creators</div>
            </div>
          </div>
          
          {/* Enhanced Connection Lines with gradients */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <line x1="40" y1="50" x2="180" y2="100" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
            <line x1="56" y1="220" x2="180" y2="180" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
            <line x1="40" y1="50" x2="56" y2="220" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
            <line x1="200" y1="90" x2="200" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
          </svg>
          
          {/* Stats overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-green-200">
            <div className="flex justify-between text-xs font-bold text-green-800">
              <span>155K+ Creators</span>
              <span>500+ Cities</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Local Business */}
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 animate-on-active">
          <div className="bg-white rounded-xl shadow-2xl p-3 border-4 border-green-300 group hover:scale-105 transition-transform">
            <Store className="w-8 h-8 text-green-600 mx-auto mb-2 animate-bounce" />
            <div className="text-sm font-bold text-center text-green-800">Local Store</div>
            <div className="text-xs text-center text-green-600 mt-1">Ready to Scale</div>
            <div className="absolute -top-2 -right-2 w-4 h-4">
              <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Creator Profiles */}
        <div className="absolute -right-8 top-1/4 animate-on-active">
          <div className="bg-white rounded-xl shadow-xl p-3 text-center border-2 border-orange-200 group hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-gray-800">Raj Kumar</div>
            <div className="text-xs text-orange-600">Tech Reviewer</div>
            <div className="text-xs text-gray-500">25K followers</div>
          </div>
        </div>
        
        <div className="absolute -right-8 bottom-1/4 animate-on-active">
          <div className="bg-white rounded-xl shadow-xl p-3 text-center border-2 border-pink-200 group hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-gray-800">Priya Sharma</div>
            <div className="text-xs text-pink-600">Lifestyle</div>
            <div className="text-xs text-gray-500">18K followers</div>
          </div>
        </div>
        
        {/* Network effect lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <line x1="180" y1="140" x2="230" y2="80" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="animate-pulse" opacity="0.6" />
            <line x1="180" y1="140" x2="230" y2="200" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" className="animate-pulse" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
