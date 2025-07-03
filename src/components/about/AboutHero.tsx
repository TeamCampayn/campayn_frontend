
import { RetroGrid } from '../ui/retro-grid';

export const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh] flex items-center">
      <RetroGrid />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Building the Future of Creator Economy
          </span>
        </h1>

        <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
          <p>
            We are a team of passionate students from <span className="font-semibold text-blue-600">IIT Roorkee</span>, 
            driven by a vision to revolutionize how creators and brands connect in the digital age.
          </p>
          
          <p>
            The creator economy has exploded into a <span className="font-bold text-purple-600">$450 billion market</span>, 
            yet millions of macro and micro influencers still struggle to find meaningful brand partnerships. 
            We witnessed talented creators with authentic voices being overlooked while brands spent countless 
            hours searching for the right creative partners.
          </p>
          
          <p>
            This gap inspired us to build <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Campayn</span> – 
            a platform that democratizes creator-brand collaborations, ensuring every authentic voice gets the 
            opportunity to shine and every brand finds their perfect creative match.
          </p>
          
          <p className="text-gray-600 italic">
            We're not just building a platform; we're crafting a movement that empowers creators 
            and transforms how authentic storytelling drives business success.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">🎓</div>
            <div className="text-gray-600 font-medium">IIT Roorkee Students</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">💡</div>
            <div className="text-gray-600 font-medium">Innovation Driven</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-pink-600 mb-2">🚀</div>
            <div className="text-gray-600 font-medium">Creator First</div>
          </div>
        </div>
      </div>
    </section>
  );
};
