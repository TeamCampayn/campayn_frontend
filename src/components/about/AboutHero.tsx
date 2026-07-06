import { Particles } from '../ui/particles';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export const AboutHero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <section className="relative overflow-hidden min-h-[60vh] flex items-center justify-center py-16">
      <Particles
        className="absolute inset-0"
        quantity={60}
        ease={80}
        color={color}
        refresh
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-none tracking-tight text-zinc-900">
          Building the Future of <br />
          <span className="text-blue">Creator Economy</span>
        </h1>

        <div className="max-w-3xl mx-auto space-y-5 text-base md:text-lg text-zinc-600 font-sans leading-relaxed">
          <p className="font-semibold text-zinc-800">
            We are passionate students from <span className="text-blue font-bold">IIT Roorkee</span>, 
            driven by a vision to revolutionize how creators and brands connect.
          </p>
          
          <p>
            The creator economy has exploded into a <span className="text-zinc-900 font-semibold">$450 billion market</span>, 
            yet millions of macro and micro influencers struggle to find meaningful brand partnerships. 
            We witnessed talented creators being overlooked while brands spent countless hours searching 
            for the right creative partners.
          </p>
          
          <p>
            This inspired us to build <span className="font-extrabold text-blue">Campayn</span>. 
            We're democratizing creator-brand collaborations and ensuring every authentic voice gets heard.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-zinc-800 font-heading font-bold text-sm">🎓 IIT Roorkee</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-zinc-800 font-heading font-bold text-sm">💡 Innovation Driven</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-zinc-800 font-heading font-bold text-sm">🚀 Creator First</div>
          </div>
        </div>
      </div>
    </section>
  );
};
