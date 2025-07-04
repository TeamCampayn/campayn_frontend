
import { Particles } from '../ui/particles';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export const AboutHero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <Particles
        className="absolute inset-0"
        quantity={80}
        ease={80}
        color={color}
        refresh
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Building the Future of
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
            Creator Economy
          </span>
        </h1>

        <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-gray-600 leading-relaxed">
          <p className="font-medium">
            We are passionate students from <span className="text-blue-600 font-semibold">IIT Roorkee</span>, 
            driven by a vision to revolutionize how creators and brands connect.
          </p>
          
          <p>
            The creator economy has exploded into a <span className="text-purple-600 font-semibold">$450 billion market</span>, 
            yet millions of macro and micro influencers struggle to find meaningful brand partnerships. 
            We witnessed talented creators being overlooked while brands spent countless hours searching 
            for the right creative partners.
          </p>
          
          <p>
            This inspired us to build <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Campayn</span>. 
            We're democratizing creator-brand collaborations and ensuring every authentic voice gets heard.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30 shadow-sm">
            <div className="text-blue-600 font-semibold text-sm">🎓 IIT Roorkee</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30 shadow-sm">
            <div className="text-purple-600 font-semibold text-sm">💡 Innovation Driven</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30 shadow-sm">
            <div className="text-pink-600 font-semibold text-sm">🚀 Creator First</div>
          </div>
        </div>
      </div>
    </section>
  );
};
