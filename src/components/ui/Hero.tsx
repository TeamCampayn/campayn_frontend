
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroDemo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    // Navigate to contact or signup
    console.log('Get started clicked');
  };

  const handleWatchDemo = () => {
    // Play demo video or show demo
    console.log('Watch demo clicked');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <Badge variant="secondary" className="mb-8 px-6 py-2 text-sm bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
            Launching Soon
          </Badge>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campaign
            </span>
            <br />
            <span className="text-slate-800">
              Like Never Before
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect brands with authentic creators. Build campaigns that resonate. 
            Drive results that matter. Welcome to the future of influencer marketing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleWatchDemo}
              className="border-2 border-slate-300 hover:border-purple-400 text-slate-700 hover:text-purple-700 px-8 py-4 text-lg bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-800 mb-2">10x</div>
              <div className="text-slate-600">Better ROI</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-800 mb-2">500K+</div>
              <div className="text-slate-600">Active Creators</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <Zap className="w-8 h-8 text-pink-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-slate-800 mb-2">24hrs</div>
              <div className="text-slate-600">Campaign Launch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
