'use client'

import { motion } from 'framer-motion'
import { PillButton } from './pill-button'

export function ContentSection() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-14 md:px-12 md:py-20 border border-foreground/10">
        <div className="mx-auto max-w-6xl">
          
          {/* Top Header Row with Button */}
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            
            {/* Headline with smooth reveal animations triggered on mount */}
            <h2 className="font-display max-w-2xl text-4xl md:text-6xl !leading-[1.15] text-zinc-900">
              <span className="block overflow-hidden py-1">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  We connect brands with
                </motion.span>
              </span>
              <span className="block overflow-hidden py-1">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  creators & influencers
                </motion.span>
              </span>
              <span className="block overflow-hidden py-1">
                <motion.span
                  className="block text-blue"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                  who engage the audience.
                </motion.span>
              </span>
            </h2>

            {/* Read About Us Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PillButton variant="outline">Read about us</PillButton>
            </motion.div>
          </div>

          {/* Lower Content Row (Image + Description) */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-center">
            
            {/* Left Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card">
                <img
                  src="/images/content-hand.png"
                  alt="Creative content production at Campayn"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right Text Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5"
            >
              <p className="text-xl font-semibold md:text-2xl font-space text-zinc-800">
                See your influencer marketing goals become a reality:
              </p>
              <p className="leading-relaxed text-zinc-600 font-sans">
                We are passionate about conducting creative and engaging
                influencer marketing campaigns. We consult and manage content
                creators across YouTube, Twitch, TikTok and Instagram. Working
                with Campayn is different — our most important resource is our
                years of experience in influencer marketing.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
