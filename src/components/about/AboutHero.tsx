
import { Sparkles, Heart, Target } from 'lucide-react';

export const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform -rotate-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center transform rotate-3">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            About Campayn
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
          We're revolutionizing the creator economy by connecting authentic voices with meaningful brands, 
          building a future where creativity meets commerce seamlessly.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-600 font-medium">Active Creators</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-gray-600 font-medium">Brand Partners</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
              1M+
            </div>
            <div className="text-gray-600 font-medium">Campaigns Delivered</div>
          </div>
        </div>
      </div>
    </section>
  );
};
