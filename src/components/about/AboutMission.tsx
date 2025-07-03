
import { Lightbulb, Users, Zap } from 'lucide-react';

export const AboutMission = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At Campayn, we believe in the power of authentic storytelling. Our mission is to create 
              a platform where creators can thrive, brands can connect meaningfully with audiences, 
              and authentic content drives real results.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're not just building a platform – we're fostering a community where creativity, 
              authenticity, and business success intersect to create something truly special.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation First</h3>
              <p className="text-gray-600">
                We continuously push boundaries to create cutting-edge solutions for the creator economy.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Our platform is built by creators, for creators, with community feedback at its core.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Results Focused</h3>
              <p className="text-gray-600">
                We measure success by the growth and achievements of our creator community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
