import { Timeline } from '../ui/timeline';

export const AboutJourney = () => {
  const data = [
    {
      title: "The Problem",
      content: (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/80 font-sans">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold text-zinc-900 mb-2">The Problem We Discovered</h4>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                We discovered that the creator economy, worth <span className="font-bold text-blue">$450 billion</span>, 
                was fundamentally fragmented. Thousands of talented macro and micro influencers struggled to find meaningful brand partnerships, 
                while brands spent countless hours searching for the right creative partners.
              </p>
            </div>
          </div>
          
          <div className="bg-red-50/40 p-5 rounded-2xl border border-red-200/50">
            <h5 className="text-red-900 font-heading font-bold text-sm md:text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Key Pain Points
            </h5>
            <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm text-zinc-700">
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
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/80 font-sans">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold text-zinc-900 mb-2">The Eureka Moment</h4>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                As students at <span className="font-bold text-blue">IIT Roorkee</span>, we witnessed firsthand 
                how technology could solve complex problems. We envisioned a platform that would democratize 
                creator-brand collaborations and ensure every authentic voice gets heard.
              </p>
            </div>
          </div>
          
          <div className="bg-blue/5 p-5 rounded-2xl border border-blue/15">
            <h5 className="text-zinc-900 font-heading font-bold text-sm md:text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue rounded-full"></span>
              Our Vision
            </h5>
            <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm text-zinc-700">
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
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/80 font-sans">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold text-zinc-900 mb-2">Building the Solution</h4>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                With passion and determination, we started building Campayn - a platform that bridges the gap 
                between creators and brands through intelligent matching and seamless collaboration tools.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/50">
              <h5 className="text-emerald-950 font-heading font-bold text-sm md:text-base mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                What We're Building
              </h5>
              <div className="space-y-2 text-xs md:text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Smart creator discovery and matching
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Transparent campaign management
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                  Fair pricing and payment systems
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-200/50">
              <h5 className="text-purple-950 font-heading font-bold text-sm md:text-base mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                Our Impact Goals
              </h5>
              <div className="space-y-2 text-xs md:text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Performance tracking & analytics
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Community-driven trust system
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Equal opportunities for all creators
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/50">
            <h5 className="text-amber-950 font-heading font-bold text-sm md:text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
              Our Mission
            </h5>
            <p className="text-zinc-700 text-sm md:text-base leading-relaxed font-semibold">
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