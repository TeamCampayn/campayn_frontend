import { Timeline } from '../ui/timeline';

export const AboutJourney = () => {
  const data = [
    {
      title: "The Problem",
      content: (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-semibold text-slate-800 mb-2">The Problem We Discovered</h4>
              <p className="text-slate-600 text-base leading-relaxed">
                We discovered that the creator economy, worth <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">$450 billion</span>, 
                was fundamentally broken. Thousands of talented macro and micro influencers struggled to find meaningful brand partnerships, 
                while brands spent countless hours searching for the right creative partners.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
            <h5 className="text-red-800 font-heading font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Key Pain Points
            </h5>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-red-700">
              <div className="flex items-center gap-2">📊 $450B market with broken matchmaking</div>
              <div className="flex items-center gap-2">🔍 Brands struggling to find authentic creators</div>
              <div className="flex items-center gap-2">💔 Talented creators being overlooked</div>
              <div className="flex items-center gap-2">⏰ Hours wasted on manual processes</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Idea",
      content: (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💡</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-semibold text-slate-800 mb-2">The Eureka Moment</h4>
              <p className="text-slate-600 text-base leading-relaxed">
                As students at <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">IIT Roorkee</span>, we witnessed firsthand 
                how technology could solve complex problems. We envisioned a platform that would democratize 
                creator-brand collaborations and ensure every authentic voice gets heard.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h5 className="text-blue-800 font-heading font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Our Vision
            </h5>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
              <div className="flex items-center gap-2">🎯 AI-powered creator-brand matching</div>
              <div className="flex items-center gap-2">🌟 Democratizing opportunities for all</div>
              <div className="flex items-center gap-2">🚀 Streamlined collaboration workflows</div>
              <div className="flex items-center gap-2">📈 Data-driven campaign optimization</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Building Campayn",
      content: (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🚀</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-semibold text-slate-800 mb-2">Building the Solution</h4>
              <p className="text-slate-600 text-base leading-relaxed">
                With passion and determination, we started building Campayn - a platform that bridges the gap 
                between creators and brands through intelligent matching and seamless collaboration tools.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h5 className="text-green-800 font-heading font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                What We're Building
              </h5>
              <div className="space-y-3 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Smart creator discovery and matching
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Transparent campaign management
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Fair pricing and payment systems
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h5 className="text-purple-800 font-heading font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Our Impact Goals
              </h5>
              <div className="space-y-3 text-sm text-purple-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Performance tracking & analytics
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Community-driven trust system
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Equal opportunities for all creators
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
            <h5 className="text-orange-800 font-heading font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Our Mission
            </h5>
            <p className="text-orange-700 text-base leading-relaxed font-medium">
              To create a world where every creator, regardless of their follower count, 
              has equal opportunity to collaborate with brands and build sustainable careers.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return <Timeline data={data} />;
};