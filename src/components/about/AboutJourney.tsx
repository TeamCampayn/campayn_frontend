import { Timeline } from '../ui/timeline';

export const AboutJourney = () => {
  const data = [
    {
      title: "The Problem",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            We discovered that the creator economy, worth <span className="font-semibold text-purple-600">$450 billion</span>, 
            was broken. Thousands of talented macro and micro influencers struggled to find meaningful brand partnerships, 
            while brands spent countless hours searching for the right creative partners.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
            <h4 className="text-purple-800 font-semibold mb-2">Key Insights</h4>
            <div className="space-y-2 text-sm text-purple-700">
              <div>📊 $450B creator economy with inefficient matchmaking</div>
              <div>🔍 Brands struggling to find authentic creators</div>
              <div>💔 Talented creators being overlooked</div>
              <div>⏰ Hours wasted on manual discovery processes</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Idea",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            As students at <span className="font-semibold text-blue-600">IIT Roorkee</span>, we witnessed firsthand 
            how technology could solve complex problems. We envisioned a platform that would democratize 
            creator-brand collaborations and ensure every authentic voice gets heard.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h4 className="text-blue-800 font-semibold mb-2">Our Vision</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div>🎯 AI-powered creator-brand matching</div>
              <div>🌟 Democratizing opportunities for all creators</div>
              <div>🚀 Streamlined collaboration workflows</div>
              <div>📈 Data-driven campaign optimization</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Building Campayn",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            With passion and determination, we started building Campayn - a platform that bridges the gap 
            between creators and brands through intelligent matching and seamless collaboration tools.
          </p>
          <div className="mb-8">
            <h4 className="text-gray-800 font-semibold mb-4">What We're Building</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2 items-center">
                ✅ Smart creator discovery and matching
              </div>
              <div className="flex gap-2 items-center">
                ✅ Transparent campaign management
              </div>
              <div className="flex gap-2 items-center">
                ✅ Fair pricing and payment systems
              </div>
              <div className="flex gap-2 items-center">
                ✅ Performance tracking and analytics
              </div>
              <div className="flex gap-2 items-center">
                ✅ Community-driven trust system
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
            <h4 className="text-green-800 font-semibold mb-2">Our Mission</h4>
            <p className="text-green-700 text-sm">
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