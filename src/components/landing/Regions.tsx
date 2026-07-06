'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { useState } from 'react'

type Region = 'North America' | 'India' | 'South America'

const DATA: Record<
  Region,
  { name: string; followers: string; platform: 'Youtube' | 'Instagram' | 'Tiktok'; img: string }[]
> = {
  'North America': [
    { name: 'MrBeast', followers: '60.4M', platform: 'Youtube', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Charli D\'Amelio', followers: '48.2M', platform: 'Tiktok', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Kylie Jenner', followers: '397M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Zach King', followers: '28.5M', platform: 'Tiktok', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Marques Brownlee', followers: '4.8M', platform: 'Youtube', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Selena Gomez', followers: '429M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
  ],
  India: [
    { name: 'Ranveer Allahbadia', followers: '7.2M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Kusha Kapila', followers: '3.5M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Bhuvan Bam', followers: '19.2M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Jannat Zubair', followers: '49.1M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'CarryMinati', followers: '24.5M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Dolly Singh', followers: '2.1M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150' },
  ],
  'South America': [
    { name: 'Neymar Jr', followers: '220M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Virginia Fonseca', followers: '46.2M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1619380061814-58f03707f082?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Whindersson Nunes', followers: '59.1M', platform: 'Youtube', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Larissa Manoela', followers: '51.8M', platform: 'Instagram', img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Luisito Comunica', followers: '33.2M', platform: 'Youtube', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150' },
    { name: 'Lele Pons', followers: '53.5M', platform: 'Tiktok', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150&h=150' },
  ],
}

const PATHS: Record<Region, string> = {
  'North America': 'M 180 53 C 270 53, 290 110, 400 110',
  'India': 'M 300 98 C 340 98, 360 110, 400 110',
  'South America': 'M 205 162 C 280 162, 310 110, 400 110',
}

// Custom platform icon renderer
function PlatformIcon({ platform }: { platform: 'Youtube' | 'Instagram' | 'Tiktok' }) {
  if (platform === 'Youtube') {
    return (
      <svg className="w-3.5 h-3.5 text-red-600 fill-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
  if (platform === 'Instagram') {
    return (
      <svg className="w-3.5 h-3.5 text-pink-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  }
  // TikTok: clean FontAwesome SVG path
  return (
    <svg className="w-3 h-3.5 text-zinc-950 shrink-0 fill-current" viewBox="0 0 448 512">
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
    </svg>
  )
}

export function Regions() {
  const [active, setActive] = useState<Region>('North America')

  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-14 md:px-12 md:py-16 border border-foreground/10">
        <div className="mx-auto max-w-6xl">
          
          {/* Header Grid */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-zinc-900 leading-tight">
              Influencer M54 Agency <br /> Manages Exclusively
            </h2>
            <p className="text-zinc-500 max-w-sm text-sm md:text-base md:pt-4 font-sans leading-relaxed">
              You can explore influencers we worked with based on their location.
            </p>
          </div>

          {/* Main Grid Layout - items centered to vertically align map and influencer card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center items-start">
            
            {/* Left Column: Interactive Map Box */}
            <div className="lg:col-span-7 flex flex-col relative">
              <div className="relative w-full h-[320px] md:h-[400px] bg-white rounded-[2rem] border border-zinc-200/80 flex items-center justify-center p-0 shadow-[0_12px_32px_rgba(0,0,0,0.02)]">
                
                {/* SVG containing Map, Lines, Dots, and Buttons */}
                <svg viewBox="0 0 400 220" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Dense dot pattern for realistic appearance */}
                    <pattern id="dotted-map-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.1" fill="#cbd5e1" />
                    </pattern>
                  </defs>
                  
                  {/* Scaled group to fit the map edge-to-edge inside the container */}
                  <g transform="translate(-18, -15) scale(1.4, 1.22)" className="pointer-events-none">
                    {/* Layer 1: Solid base shape underneath dots */}
                    <g fill="#e2e8f0" opacity="0.35">
                      <path d="M 120,30 C 135,25 150,30 145,45 C 135,52 120,45 120,30 Z" />
                      <path d="M 25,45 L 35,42 L 42,35 L 50,32 L 62,32 L 72,28 L 78,35 L 82,32 L 85,38 L 82,45 L 75,48 L 72,55 L 78,60 L 80,68 L 75,72 L 72,70 L 68,78 L 70,82 L 65,85 L 60,82 L 58,78 L 52,78 L 48,82 L 45,80 L 44,72 L 38,70 L 32,60 L 30,55 L 26,52 Z" />
                      <path d="M 56,92 L 62,90 L 68,95 L 72,102 L 74,115 L 72,130 L 68,145 L 64,165 L 58,185 L 55,190 L 52,185 L 52,175 L 50,160 L 46,145 L 43,130 L 42,120 L 45,110 L 45,100 L 50,96 Z" />
                      <path d="M 115,35 L 122,32 L 128,30 L 135,32 L 140,28 L 148,32 L 158,28 L 170,30 L 182,25 L 195,28 L 210,25 L 225,28 L 240,25 L 255,28 L 268,32 L 275,30 L 285,35 L 280,45 L 275,52 L 278,60 L 282,65 L 275,70 L 268,68 L 262,75 L 255,78 L 248,72 L 242,75 L 235,70 L 228,75 L 222,82 L 224,90 L 218,92 L 215,85 L 208,82 L 200,88 L 195,85 L 192,78 L 188,72 L 180,75 L 178,82 L 170,85 L 165,80 L 160,78 L 152,82 L 148,78 L 142,85 L 138,82 L 132,85 L 128,80 L 122,78 L 118,82 L 115,75 L 110,72 L 112,65 L 108,60 L 110,55 L 105,52 L 108,45 L 112,40 Z" />
                      <path d="M 118,88 L 125,85 L 132,90 L 142,92 L 148,98 L 146,105 L 148,115 L 142,125 L 138,135 L 132,145 L 128,150 L 124,152 L 122,148 L 124,140 L 120,132 L 118,125 L 115,118 L 112,110 L 110,105 L 108,98 L 112,94 Z" />
                      <path d="M 250,145 L 262,140 L 270,142 L 278,148 L 282,158 L 278,168 L 272,170 L 262,168 L 255,162 L 250,152 Z" />
                    </g>

                    {/* Layer 2: Dotted pattern covering the exact silhouettes */}
                    <g fill="url(#dotted-map-pattern)">
                      <path d="M 120,30 C 135,25 150,30 145,45 C 135,52 120,45 120,30 Z" />
                      <path d="M 25,45 L 35,42 L 42,35 L 50,32 L 62,32 L 72,28 L 78,35 L 82,32 L 85,38 L 82,45 L 75,48 L 72,55 L 78,60 L 80,68 L 75,72 L 72,70 L 68,78 L 70,82 L 65,85 L 60,82 L 58,78 L 52,78 L 48,82 L 45,80 L 44,72 L 38,70 L 32,60 L 30,55 L 26,52 Z" />
                      <path d="M 56,92 L 62,90 L 68,95 L 72,102 L 74,115 L 72,130 L 68,145 L 64,165 L 58,185 L 55,190 L 52,185 L 52,175 L 50,160 L 46,145 L 43,130 L 42,120 L 45,110 L 45,100 L 50,96 Z" />
                      <path d="M 115,35 L 122,32 L 128,30 L 135,32 L 140,28 L 148,32 L 158,28 L 170,30 L 182,25 L 195,28 L 210,25 L 225,28 L 240,25 L 255,28 L 268,32 L 275,30 L 285,35 L 280,45 L 275,52 L 278,60 L 282,65 L 275,70 L 268,68 L 262,75 L 255,78 L 248,72 L 242,75 L 235,70 L 228,75 L 222,82 L 224,90 L 218,92 L 215,85 L 208,82 L 200,88 L 195,85 L 192,78 L 188,72 L 180,75 L 178,82 L 170,85 L 165,80 L 160,78 L 152,82 L 148,78 L 142,85 L 138,82 L 132,85 L 128,80 L 122,78 L 118,82 L 115,75 L 110,72 L 112,65 L 108,60 L 110,55 L 105,52 L 108,45 L 112,40 Z" />
                      <path d="M 118,88 L 125,85 L 132,90 L 142,92 L 148,98 L 146,105 L 148,115 L 142,125 L 138,135 L 132,145 L 128,150 L 124,152 L 122,148 L 124,140 L 120,132 L 118,125 L 115,118 L 112,110 L 110,105 L 108,98 L 112,94 Z" />
                      <path d="M 250,145 L 262,140 L 270,142 L 278,148 L 282,158 L 278,168 L 272,170 L 262,168 L 255,162 L 250,152 Z" />
                    </g>
                  </g>

                  {/* Animated active path that curves to the exact center-right of the map container (400, 110) */}
                  <AnimatePresence mode="wait">
                    <motion.path
                      key={active}
                      d={PATHS[active]}
                      fill="none"
                      stroke="#18181b"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </AnimatePresence>

                  {/* HTML overlay buttons embedded via foreignObject */}
                  
                  {/* North America */}
                  <foreignObject x="45" y="32" width="135" height="42" className="overflow-visible">
                    <button 
                      onClick={() => setActive('North America')}
                      className={`w-full h-full font-sans font-semibold text-xs md:text-sm rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border flex items-center justify-center ${
                        active === 'North America' 
                          ? 'bg-zinc-950 text-white border-zinc-950 scale-105' 
                          : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      North America
                    </button>
                  </foreignObject>

                  {/* India */}
                  <foreignObject x="195" y="77" width="105" height="42" className="overflow-visible">
                    <button 
                      onClick={() => setActive('India')}
                      className={`w-full h-full font-sans font-semibold text-xs md:text-sm rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border flex items-center justify-center ${
                        active === 'India' 
                          ? 'bg-zinc-950 text-white border-zinc-950 scale-105' 
                          : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      India
                    </button>
                  </foreignObject>

                  {/* South America */}
                  <foreignObject x="70" y="141" width="135" height="42" className="overflow-visible">
                    <button 
                      onClick={() => setActive('South America')}
                      className={`w-full h-full font-sans font-semibold text-xs md:text-sm rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border flex items-center justify-center ${
                        active === 'South America' 
                          ? 'bg-zinc-950 text-white border-zinc-950 scale-105' 
                          : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      South America
                    </button>
                  </foreignObject>
                </svg>

                {/* Pixel-perfect HTML bridge line crossing the gap (gap-8 = 32px) to touch the influencer card outline exactly */}
                <AnimatePresence>
                  <motion.div 
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="absolute w-[32px] h-[1.5px] bg-zinc-950 z-20 lg:block hidden" 
                    style={{ 
                      right: '-32px', 
                      top: 'calc((110 / 220) * 100%)',
                      transform: 'translateY(-50%)'
                    }} 
                  />
                </AnimatePresence>

              </div>

              {/* Info bottom text bar */}
              <div className="mt-4 flex items-center gap-3 bg-white border border-zinc-200 rounded-[1.25rem] px-5 py-4 text-xs md:text-sm text-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.01)] font-sans font-medium">
                <div className="w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <span>You can select the region and view the influencers in that area</span>
              </div>
            </div>

            {/* Right Column: Influencers List Card */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] border border-zinc-200/80 p-6 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.03)] h-[380px] md:h-[470px] flex flex-col justify-between overflow-hidden relative">
              <div className="overflow-hidden pr-1 h-full">
                <AnimatePresence mode="wait">
                  <div className="h-full overflow-hidden relative" key={active}>
                    {/* Subtle fade overlays at top and bottom of the marquee for premium aesthetic */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full overflow-hidden flex flex-col justify-center"
                    >
                      <motion.div
                        animate={{ y: ['0%', '-50%'] }}
                        transition={{
                          repeat: Infinity,
                          ease: 'linear',
                          duration: 15,
                        }}
                        className="flex flex-col"
                      >
                        {[...DATA[active], ...DATA[active]].map((inf, idx) => {
                          const platformLabel = 
                            inf.platform === 'Youtube' 
                              ? 'YouTube' 
                              : inf.platform === 'Tiktok' 
                                ? 'TikTok' 
                                : 'Instagram'

                          return (
                            <div
                              key={`${inf.name}-${idx}`}
                              className="flex items-center justify-between gap-4 py-4 border-b border-zinc-100/80"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={inf.img}
                                  alt={inf.name}
                                  className="w-12 h-12 rounded-full border border-zinc-200 object-cover bg-zinc-50 shrink-0"
                                />
                                <div>
                                  <p className="font-sans font-bold text-zinc-900 text-base">{inf.name}</p>
                                  <p className="font-sans text-xs text-zinc-400 mt-0.5 font-medium">
                                    {inf.followers} Followers
                                  </p>
                                </div>
                              </div>
                              
                              <span className="border border-zinc-200/85 rounded-full px-3.5 py-1.5 text-xs font-semibold text-zinc-800 bg-white flex items-center gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-sans shrink-0">
                                <PlatformIcon platform={inf.platform} />
                                {platformLabel}
                              </span>
                            </div>
                          )
                        })}
                      </motion.div>
                    </motion.div>
                  </div>
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
