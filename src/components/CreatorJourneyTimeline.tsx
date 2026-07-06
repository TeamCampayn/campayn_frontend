"use client";

import { motion } from 'framer-motion';
import { Rocket, Wallet, Shield, Zap, Target } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    badges: ['Organic', 'Sustainable'],
    title: 'Growth Opportunities',
    desc: 'Connect with brands that align with your content and audience, leading to sustainable follower growth and long-term partnerships.',
    icon: Rocket,
    accentColor: '#818CF8',
    lightColor: '#E0E7FF',
    midColor: '#C7D2FE',
  },
  {
    n: '02',
    badges: ['Secure', 'Guaranteed'],
    title: 'Secure Payments & Wallet',
    desc: 'Get paid securely through our escrow-backed platform. Your wallet is always protected — no payment delays, no disputes.',
    icon: Wallet,
    accentColor: '#9333EA',
    lightColor: '#F3E8FF',
    midColor: '#D8B4FE',
  },
  {
    n: '03',
    badges: ['Flexible', 'Zero Cost'],
    title: 'Barter Campaign Support',
    desc: 'Use your wallet balance for barter campaigns — no need to pay from your pocket. Seamlessly manage all transactions in one place.',
    icon: Shield,
    accentColor: '#3B82F6',
    lightColor: '#EFF6FF',
    midColor: '#BFDBFE',
  },
  {
    n: '04',
    badges: ['Fast', 'Streamlined'],
    title: 'Quick Campaigns',
    desc: 'Find and apply to campaigns in minutes. Our smart matching system surfaces only the most relevant brand deals for your niche.',
    icon: Zap,
    accentColor: '#818CF8',
    lightColor: '#E0E7FF',
    midColor: '#C7D2FE',
  },
  {
    n: '05',
    badges: ['Authentic', 'Values-Driven'],
    title: 'Brand Alignment',
    desc: 'Work with brands that truly match your content style and audience interests — no awkward fits, only meaningful collaborations.',
    icon: Target,
    accentColor: '#9333EA',
    lightColor: '#F3E8FF',
    midColor: '#D8B4FE',
  },
];

// Inline SVG artworks for each step (isometric style matching Steps.tsx)
const ARTWORKS: Record<string, React.ReactNode> = {
  '01': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <ellipse cx="100" cy="180" rx="70" ry="12" fill="#C7D2FE" opacity="0.3" />
      <path d="M 40,140 L 100,165 L 160,140 L 100,115 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 40,140 L 100,165 L 100,175 L 40,150 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 100,165 L 160,140 L 160,150 L 100,175 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(0, -15)">
        <path d="M 55,127.5 L 100,146.25 L 145,127.5 L 100,108.75 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 55,127.5 L 100,146.25 L 100,156.25 L 55,137.5 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,146.25 L 145,127.5 L 145,137.5 L 100,156.25 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(0, -30)">
        <path d="M 70,115 L 100,127.5 L 130,115 L 100,102.5 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 70,115 L 100,127.5 L 100,137.5 L 70,125 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,127.5 L 130,115 L 130,125 L 100,137.5 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,-45; 0,-50; 0,-45" dur="4s" repeatCount="indefinite" />
        <path d="M 85,102.5 L 100,108.75 L 115,102.5 L 100,96.25 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,102.5 L 100,108.75 L 100,118.75 L 85,112.5 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,108.75 L 115,102.5 L 115,112.5 L 100,118.75 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  '02': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <ellipse cx="100" cy="170" rx="65" ry="12" fill="#E9D5FF" opacity="0.3" />
      <g transform="translate(0, -10)">
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(-20, 10)">
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g>
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(20, 10)">
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g>
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,20; 0,14; 0,20" dur="3.5s" repeatCount="indefinite" />
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g>
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g transform="translate(0, -20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  ),
  '03': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <ellipse cx="100" cy="155" rx="55" ry="10" fill="#BFDBFE" opacity="0.3" />
      <g transform="translate(0, 0)">
        <path d="M 100,60 L 115,67.5 L 100,75 L 85,67.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,67.5 L 100,75 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,75 L 115,67.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g transform="translate(-20, 10)">
        <path d="M 100,50 L 115,57.5 L 100,65 L 85,57.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,57.5 L 100,65 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,65 L 115,57.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g transform="translate(20, 10)">
        <path d="M 100,55 L 115,62.5 L 100,70 L 85,62.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,62.5 L 100,70 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,70 L 115,62.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,20; 0,12; 0,20" dur="5s" repeatCount="indefinite" />
        <path d="M 100,80 L 115,87.5 L 100,95 L 85,87.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,87.5 L 100,95 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,95 L 115,87.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  '04': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <ellipse cx="100" cy="180" rx="70" ry="12" fill="#E9D5FF" opacity="0.3" />
      <path d="M 40,140 L 100,165 L 160,140 L 100,115 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 40,140 L 100,165 L 100,175 L 40,150 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 100,165 L 160,140 L 160,150 L 100,175 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(0, -15)">
        <path d="M 55,127.5 L 100,146.25 L 145,127.5 L 100,108.75 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 55,127.5 L 100,146.25 L 100,156.25 L 55,137.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,146.25 L 145,127.5 L 145,137.5 L 100,156.25 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(0, -30)">
        <path d="M 70,115 L 100,127.5 L 130,115 L 100,102.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 70,115 L 100,127.5 L 100,137.5 L 70,125 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,127.5 L 130,115 L 130,125 L 100,137.5 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,-45; 0,-50; 0,-45" dur="4s" repeatCount="indefinite" />
        <path d="M 85,102.5 L 100,108.75 L 115,102.5 L 100,96.25 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,102.5 L 100,108.75 L 100,118.75 L 85,112.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,108.75 L 115,102.5 L 115,112.5 L 100,118.75 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  '05': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <ellipse cx="100" cy="155" rx="55" ry="10" fill="#E9D5FF" opacity="0.3" />
      <g transform="translate(0, 0)">
        <path d="M 100,60 L 115,67.5 L 100,75 L 85,67.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,67.5 L 100,75 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,75 L 115,67.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(-20, 10)">
        <path d="M 100,50 L 115,57.5 L 100,65 L 85,57.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,57.5 L 100,65 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,65 L 115,57.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(20, 10)">
        <path d="M 100,55 L 115,62.5 L 100,70 L 85,62.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,62.5 L 100,70 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,70 L 115,62.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,20; 0,12; 0,20" dur="5s" repeatCount="indefinite" />
        <path d="M 100,80 L 115,87.5 L 100,95 L 85,87.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,87.5 L 100,95 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,95 L 115,87.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
};

export const CreatorJourneyTimeline = () => {
  return (
    <section className="px-3 py-14 md:px-4 md:py-24">
      <div className="grain rounded-[2.5rem] bg-panel px-6 py-20 md:px-12 md:py-32 border border-zinc-200/40">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-24 md:mb-32">
            <h2 className="font-sans font-extrabold text-4xl md:text-[3.5rem] leading-[1.1] tracking-tight">
              <span className="text-[#818CF8] block mb-2">Your Creator Journey, Step by Step</span>
              <span className="text-zinc-500 block">We make every campaign count</span>
            </h2>
          </div>

          {/* Steps Alternating Stack */}
          <div className="space-y-28 md:space-y-40">
            {STEPS.map((s, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={s.n}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
                >
                  {/* Artwork Card */}
                  <motion.div
                    className={`w-full flex items-center justify-center p-12 bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-300 aspect-square max-w-[420px] md:max-w-[460px] mx-auto ${
                      isEven ? 'md:order-last' : 'md:order-first'
                    }`}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                  >
                    <div className="w-[60%] h-[60%] flex items-center justify-center">
                      {ARTWORKS[s.n]}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className={`flex flex-col justify-center text-left ${
                      isEven ? 'md:order-first' : 'md:order-last'
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                  >
                    {/* Large step number */}
                    <span className="font-sans font-extrabold text-[5rem] md:text-[6.5rem] text-[#818CF8]/25 leading-none tracking-tighter">
                      {s.n}
                    </span>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {s.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-zinc-300 px-3.5 py-0.5 text-[11px] font-medium font-sans text-zinc-500"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-bold text-3xl md:text-[2.25rem] text-zinc-900 tracking-tight mt-5 leading-none">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 text-zinc-500 text-sm md:text-base leading-relaxed max-w-[420px]">
                      {s.desc}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorJourneyTimeline;
